"use server";

import { z } from "zod";
import { and, asc, eq, sql, inArray } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { CourseProps } from "../lib/types";
import fs from "fs";
import path from "path";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { subdomainURL } from "./utils";
import {
  User,
  users,
  teams,
  tenants,
  siteheader,
  pages,
  SiteHeader,
  teamMembers,
  activityLogs,
  paymentPages,
  blogs,
  blogCategories,
  tags,
  course_content,
  course,
  course_modules,
  course_topics,
  course_module_topics_link,
  type CourseType,
  type CourseModuleType,
  type CourseTopicType,
  type CourseContentType,
  type paymentPagesType,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
  type NewActivityLog,
  type NewTenant,
  type NewSiteHeader,
  type Tenant,
  type PageType,
  type blogsType,
  type TeamMember,
  type NewPage,
  type blogCategoriesType,
  type tagType,
  ActivityType,
  invitations,
  menus,
  course_modules_link,
} from "@/lib/db/schema";
import { comparePasswords, hashPassword, setSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createCheckoutSession } from "@/lib/payments/stripe";
import { getUser, getUserWithTeam } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";
import {
  validatedAction,
  validatedActionWithUser,
} from "@/lib/auth/middleware";
import { Tags } from "lucide-react";
interface UpdateOrCreateSiteHeader {
  siteid: string;
  newHeader: string;
}

async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  const newActivity: NewActivityLog = {
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || "",
  };
  await db.insert(activityLogs).values(newActivity);
}

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

const siteIdSchema = z.object({
  tenant: z.string().min(3).max(255),
});
export type SiteDataInput = {
  siteId: string;
  siteIcon?: File;
  siteHeader: string;
};

/* Course Save */

export async function saveCourse(siteId: string, courseData: CourseProps) {
  // Check if a course with the same name already exists
  const existingCourse = await db
    .select({ id: course.id })
    .from(course)
    .where(and(eq(course.name, courseData.name), eq(course.site_id, siteId)))
    .limit(1);

  if (existingCourse.length > 0) {
    throw new Error("A course with this name already exists.");
  }

  // Save title block
  const courseContent = await db
    .insert(course_content)
    .values({ siteId: siteId, content: courseData.content })
    .returning()
    .then((res) => res[0]);

  const titleRecord = await db
    .insert(course)
    .values({
      site_id: siteId,
      name: courseData.name,
      content_id: courseContent.id,
    })
    .returning()
    .then((res) => res[0]);

  for (const module of courseData.modules) {
    const moduleBlock = await db
      .insert(course_content)
      .values({ siteId: siteId, content: module.content })
      .returning()
      .then((res) => res[0]);

    const moduleRecord = await db
      .insert(course_modules)
      .values({
        site_id: siteId,
        name: module.name,
        course_id: titleRecord.id,
        content_id: moduleBlock.id,
      })
      .returning()
      .then((res) => res[0]);

    // Link module to title
    await db.insert(course_modules_link).values({
      course_id: titleRecord.id,
      site_id: siteId,
      module_id: moduleRecord.id,
    });

    for (const topic of module.topics) {
      const topicBlock = await db
        .insert(course_content)
        .values({ siteId: siteId, content: topic.content })
        .returning()
        .then((res) => res[0]);

      const topicRecord = await db
        .insert(course_topics)
        .values({
          site_id: siteId,
          name: topic.name,
          module_id: moduleRecord.id,
          content_id: topicBlock.id,
        })
        .returning()
        .then((res) => res[0]);

      // Link topic to module
      await db.insert(course_module_topics_link).values({
        module_id: moduleRecord.id,
        site_id: siteId,
        topic_id: topicRecord.id,
      });
    }
  }

  return { success: true };
}

export async function getFullCourse(siteId: string, courseId: string) {
  // 1. Fetch the title
  const course_rec = await db
    .select({
      id: course.id,
      name: course.name,
      content_id: course.content_id,
      content: course_content.content,
    })
    .from(course)
    .leftJoin(course_content, eq(course.content_id, course_content.id))
    .where(eq(course.id, course_content.id) && eq(course.site_id, siteId));

  if (!course_rec) return null;

  // 2. Find module links for this title
  const linkedModules = await db
    .select({ module_id: course_modules_link.module_id })
    .from(course_modules_link)
    .where(eq(course_modules_link.course_id, course_rec[0].id));

  const moduleIds = linkedModules.map((m) => m.module_id);
  if (moduleIds.length === 0) return { ...course, modules: [] };

  // 3. Get module data and block content
  const modulesWithBlocks = await db
    .select({
      id: course_modules.id,
      name: course_modules.name,
      content_id: course_modules.content_id,
      content: course_content.content,
    })
    .from(course_modules)
    .leftJoin(course_content, eq(course_modules.content_id, course_content.id))
    .where(
      and(
        inArray(
          course_modules.id,
          moduleIds.filter((id): id is string => id !== null)
        ),
        eq(course_modules.site_id, siteId)
      )
    );

  // 4. Get module → topic links
  const moduleTopicLinks = await db
    .select()
    .from(course_module_topics_link)
    .where(
      and(
        inArray(
          course_module_topics_link.module_id,
          moduleIds.filter((id): id is string => id !== null)
        ),
        eq(course_module_topics_link.site_id, siteId)
      )
    );

  const topicIds = moduleTopicLinks.map((link) => link.topic_id);

  // 5. Get topic data and block content
  const topicsWithBlocks = topicIds.length
    ? await db
        .select({
          id: course_topics.id,
          name: course_topics.name,
          blockId: course_topics.content_id,
          blockContent: course_content.content,
        })
        .from(course_topics)
        .leftJoin(
          course_content,
          eq(course_content.id, course_topics.content_id)
        )
        .where(
          and(
            eq(course_topics.site_id, siteId),
            inArray(
              course_topics.id,
              topicIds.filter((id): id is string => id !== null)
            )
          )
        )
    : [];

  // 6. Group topics under modules
  const moduleMap: Record<string, any> = {};
  for (const module of modulesWithBlocks) {
    moduleMap[module.id] = { ...module, topics: [] };
  }

  for (const link of moduleTopicLinks) {
    const topic = topicsWithBlocks.find((t) => t.id === link.topic_id);
    if (topic) {
      if (link.module_id !== null) {
        moduleMap[link.module_id].topics.push(topic);
      }
    }
  }

  const modulesStructured = Object.values(moduleMap);

  return {
    id: course.id,
    name: course.name,
    content_id: course.content_id,

    modules: modulesStructured,
  };
}

// Function to get siteId - a placeholder for your siteId fetch logic
export async function getSiteId() {
  // This is a placeholder. Replace with your actual logic to fetch siteId.
  const siteId = "123"; // Mock siteId
  return siteId;
}

// Server action to update header and icon in the database
export async function updateSiteParameters(data: FormData) {
  const siteHeader = data.get("siteHeader") as string;
  const file = data.get("icon") as File | null;
  const siteId = data.get("siteId") as string;

  if (!file || !siteId || !siteHeader) {
    return { error: "Missing required fields" };
  }

  // Set up the file path for the icon
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const iconPath = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir, iconPath);

  // Save the file to the filesystem
  await fs.promises.writeFile(
    filePath,
    new Uint8Array(await file.arrayBuffer())
  );

  // Update the database
  await db
    .update(siteheader)
    .set({ siteHeader, siteiconURL: filePath })
    .where(eq(siteheader.siteId, siteId));

  // Revalidate the page to show updates
  revalidatePath("/");

  return { message: "Site header updated successfully" };
}

export async function getUserSiteId() {
  const User = (await getUser()) ?? "";

  let slug = User ? User.siteId || "" : "";

  //const data = await getSiteHeaderElements(slug||"" ) ;

  return slug;
}
export async function isSiteRegistered(siteId: string) {
  // Fetch tenant record from the tenants table
  const availTenant = await db
    .select({
      tenant: tenants.tenant, // Assuming 'tenant' is a column in the 'tenants' table
    })
    .from(tenants)
    .where(eq(tenants.tenant, siteId))
    .limit(1);

  // Check if the tenant exists
  if (availTenant.length === 0) {
    // availTenant will be an array, so check its length
    return false;
  }

  // If tenant exists, proceed with other logic or return success
  return true;
}

export async function getHeader(siteId: string) {
  // This is a placeholder. Replace with your actual logic to fetch siteId.

  return siteId;
}

export async function getSiteHeaderElements(siteId: string) {
  const siteHeaderElements = await db
    .select()
    .from(siteheader)
    .where(and(eq(siteheader.siteId, siteId)))
    .limit(1);

  if (siteHeaderElements.length === 0) {
    return null;
  }

  return siteHeaderElements[0];
}

export async function getSitePages(siteId: string) {
  return await db.select().from(pages).where(eq(pages.siteId, siteId));
}

export async function getSiteBlogs(siteId: string) {
  return await db.select().from(blogs).where(eq(blogs.siteId, siteId));
}

export async function getCurrentPage(siteId: string, name: string) {
  try {
    const result = await db
      .select()
      .from(pages)
      .where(and(eq(pages.siteId, siteId), eq(pages.name, name)))
      .limit(1);

    if (result.length === 0) {
      throw new Error(
        `Page with name "${name}" not found for site "${siteId}".`
      );
    }

    return result[0];
  } catch (error) {
    console.error(`Error fetching page "${name}" for site "${siteId}":`, error);
    return null;
  }
}
export async function getCurrentBlog(siteId: string, name: string) {
  try {
    const result = await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.siteId, siteId), eq(blogs.name, name)))
      .limit(1);

    if (result.length === 0) {
      throw new Error(
        `Blog with name "${name}" not found for site "${siteId}".`
      );
    }

    return result[0];
  } catch (error) {
    console.error(`Error fetching blog "${name}" for site "${siteId}":`, error);
    return null;
  }
}
export async function upinsertBlog(
  siteId: string,
  name: string,
  layout: string,
  menuItem: string,
  category: string,
  tags: string,
  author: string,
  authorbio: string,
  authorimage: string,
  blogImageURL: string,

  content: any
) {
  let blog;

  if (name) {
    // Try to update the page if pageId is provided
    try {
      const updatedBlog = await db
        .update(blogs)
        .set({
          siteId: siteId,
          name: name,
          layout: layout,
          menuItem: menuItem,
          category: category,
          tags: tags,
          author: author,
          authorbio: authorbio,
          authorimage: authorimage,
          blogImageURL: blogImageURL,

          content: content,
        })
        .where(eq(blogs.name, name))
        .returning();

      if (updatedBlog.length > 0) {
        blog = updatedBlog[0];
        revalidatePath(`${siteId}/admin/manageblogs/BlogUpdate/${name}`); // Revalidate the editor page
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      throw new Error("Failed to update the blog.");
    }
  }

  if (!blog) {
    // Insert a new page if pageId is not found or not provided

    try {
      const newBlog = await db
        .insert(blogs)
        .values({
          siteId: siteId,
          name: name,
          layout: layout,
          menuItem: menuItem,
          category: category,
          tags: tags,
          author: author,
          authorbio: authorbio,
          authorimage: authorimage,
          blogImageURL: blogImageURL,
          content: content,
        }) // Assuming db.generateId() generates a new ID
        .returning();

      blog = newBlog[0];
      revalidatePath("/"); // Revalidate the path to refresh the page list
    } catch (error) {
      console.error("Error creating blog:", error);
      throw new Error("Failed to create a new blog.");
    }
  }

  return blog;
}

export async function getBlogCategories(siteId: string) {
  try {
    // Fetch distinct categories from the blogs table for the given siteId
    const categories = await db
      .select({ name: blogCategories.name })
      .from(blogCategories)
      .where(eq(blogCategories.siteId, siteId));

    // Map to get an array of unique category names
    const categoryList = categories.map((cat) => cat.name).filter(Boolean);

    return categoryList;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    throw new Error("Failed to retrieve blog categories.");
  }
}
export async function insertCategory(siteId: string, categoryName: string) {
  try {
    // Insert the new category into the blogs table
    const newCategory = await db
      .insert(blogCategories)
      .values({ siteId, name: categoryName })
      .returning();

    if (newCategory.length === 0) {
      throw new Error("Failed to insert the new category.");
    }

    return newCategory[0]; // Return the inserted category
  } catch (error) {
    console.error("Error inserting category:", error);
    throw new Error("Failed to insert the new category.");
  }
}

export async function getTags(siteId: string) {
  try {
    // Fetch distinct categories from the blogs table for the given siteId
    const newtags = await db
      .select({ name: tags.name })
      .from(tags)
      .where(eq(tags.siteId, siteId));

    // Map to get an array of unique category names
    const tagList = newtags.map((tag) => tag.name).filter(Boolean);

    return tagList;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to retrieve tags.");
  }
}
export async function insertTag(siteId: string, tagName: string) {
  try {
    // Insert the new category into the blogs table
    const newTag = await db
      .insert(tags)
      .values({ siteId, name: tagName })
      .returning();

    if (newTag.length === 0) {
      throw new Error("Failed to insert the new category.");
    }

    return newTag[0]; // Return the inserted category
  } catch (error) {
    console.error("Error inserting tag:", error);
    throw new Error("Failed to insert the new tag.");
  }
}

export async function createPage(siteId: string, name: string, layout: string) {
  const newPage = await db
    .insert(pages)
    .values({ siteId, name, layout, content: {} })
    .returning();
  revalidatePath("/"); // Revalidate the path to refresh the page list
  return newPage[0];
  // Validate or transform the result (optional, if needed)
  if (!newPage) {
    throw new Error("Failed to create a new page.");
  }

  // Ensure it matches the Page interface
  return newPage[0] as PageType;
}
export async function upinsertPage(
  siteId: string,
  name: string,
  layout: string,
  menuItem: string,
  content: any
) {
  let page;

  if (name) {
    // Try to update the page if pageId is provided
    try {
      const updatedPage = await db
        .update(pages)
        .set({
          siteId: siteId,
          name: name,
          layout: layout,
          menuItem: menuItem,
          content: content,
        })
        .where(eq(pages.name, name))
        .returning();

      if (updatedPage.length > 0) {
        page = updatedPage[0];
        revalidatePath(`${siteId}/admin/managepage/pageeditor/${name}`); // Revalidate the editor page
      }
    } catch (error) {
      console.error("Error updating page:", error);
      throw new Error("Failed to update the page.");
    }
  }

  if (!page) {
    // Insert a new page if pageId is not found or not provided

    try {
      const newPage = await db
        .insert(pages)
        .values({
          siteId: siteId,
          name: name,
          layout: layout,
          menuItem: menuItem,
          content: content,
        }) // Assuming db.generateId() generates a new ID
        .returning();

      page = newPage[0];
      revalidatePath("/"); // Revalidate the path to refresh the page list
    } catch (error) {
      console.error("Error creating page:", error);
      throw new Error("Failed to create a new page.");
    }
  }

  return page;
}
export async function updatePage(id: string, content: any) {
  const updatedPage = await db
    .update(pages)
    .set(content)

    .where(eq(pages.id, Number(id)))
    .returning();
  revalidatePath(`/editor/${id}`); // Revalidate the editor page
  return updatedPage[0];
}

export async function uploadImage(siteId: string, image: File | null) {
  if (!image) return "";
  return handleS3ImageUpload(image, siteId);

  /** 
  let iconPath: string = "",
    filePath: string = "";

  try {
    if (image) {
      // Set up the file path for the icon
      const uploadsDir = path.join(process.cwd(), "public", "uploads", siteId);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      iconPath = `/uploads/${siteId}/${Date.now()}-${image.name}`;
      filePath = path.join(process.cwd(), "public", iconPath);

      // Save the file to the filesystem
      await fs.promises.writeFile(
        filePath,
        new Uint8Array(await image.arrayBuffer())
      );
      // Set file permissions to read and write for the owner, and read for others
      await fs.promises.chmod(filePath, 0o755);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error uploading image:", error.message);
    } else {
      console.error("Unknown error occurred while uploading image.");
    }
    return "";
  }
  return iconPath;
  */
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedUrl(
  siteId: string,
  fileName: string,
  fileType: string
) {
  try {
    const key = `uploads/${siteId}/${Date.now()}-${fileName}`;

    const { url, fields } = await createPresignedPost(s3, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Fields: { "Content-Type": fileType },
      Expires: 60, // URL expires in 60 seconds
      Conditions: [["content-length-range", 0, 10 * 1024 * 1024]], // Limit file size to 10MB
    });

    return { url, fields, key };
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    return { error: "Failed to get presigned URL" };
  }
}
export const handleS3ImageUpload = async (file: File, siteId: string) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Get the presigned URL from the server
      const { url, fields, key } = await getPresignedUrl(
        siteId,
        file.name,
        file.type
      );

      if (url && fields && key) {
        // Step 2: Prepare the form data for S3 upload
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) =>
          formData.append(key, value)
        );

        formData.append("file", file); // Append the actual file

        // Step 3: Upload the file to S3
        const uploadRes = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          console.log(process.env.AWS_BUCKET_NAME); // Check if this is valid
          console.log(process.env.AWS_REGION); // Check if this is valid
          console.log(key); // Check if the key has a valid value             s
          const imageURL = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
          console.log(`🔗 URL: ${imageURL}`);
          return imageURL;
        } else {
          console.error("❌ Upload failed");
          return null;
        }
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      return null;
    }
  }
};
export async function deleteS3Image(siteId: string, imagePath: string) {
  try {
    const key = imagePath.replace(
      `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/`,
      ""
    );

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    return "error";
  }
  return "Deleted";
}

export async function upsertSiteData(data: FormData) {
  const siteId = data.get("siteId") as string | null;
  const siteHeader = data.get("siteHeader") as string | null;
  const siteIcon = data.get("siteIcon") as File | null;
  const headerTextColor = data.get("headerTextColor") as string | null;
  const headerFontSize = data.get("headerFontSize") as string | null;
  const headerBkgColor = data.get("headerBkgColor") as string | null;
  const headerBkgImage = data.get("headerBkgImage") as File | null;
  const existingiconURL = data.get("existingiconURL") as string | null;
  const existingbgImageURL = data.get("existingbgImageURL") as string | null;

  existingiconURL;
  existingbgImageURL;

  if (!siteId || !siteHeader) {
    return { error: "Missing required fields" };
  }

  let siteIconPath = "",
    bkgImagePath = "";

  if (siteIcon) {
    try {
      siteIconPath = (await uploadImage(siteId, siteIcon)) || "";
    } catch (error) {
      console.error("Image Upload Error:", error);
      return { error: "Failed to upload site icon" };
    }
  }

  if (headerBkgImage) {
    try {
      bkgImagePath = (await uploadImage(siteId, headerBkgImage)) || "";
    } catch (error) {
      console.error("Image Upload Error:", error);
      return { error: "Failed to upload site icon" };
    }
  }

  const updateData = {
    siteiconURL: siteIconPath,
    siteHeader,
    headerTextColor,
    headerFontSize,
    headerBkgColor,
    headerBkgImageURL: bkgImagePath,
  };

  Object.keys(updateData).forEach((key) => {
    if (updateData[key as keyof typeof updateData] === undefined) {
      delete updateData[key as keyof typeof updateData];
    }
  });

  try {
    const existingSite = await db
      .select()
      .from(siteheader)
      .where(eq(siteheader.siteId, siteId))
      .then((rows) => rows[0]);

    if (existingSite) {
      await db
        .update(siteheader)
        .set(updateData)
        .where(eq(siteheader.siteId, siteId));
    } else {
      await db.insert(siteheader).values({ siteId, ...updateData });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return {
      error: "Failed to create or update site data. Please try again later.",
    };
  }

  return { success: true };
}

export const getCourses = async (siteId: string) => {
  const courseData = await db
    .select({ name: course.name, id: course.id })
    .from(course)
    .where(eq(course.site_id, siteId));
  return courseData;
};
export async function getCoursebyId(siteId: string, courseId: string) {
  try {
    // Fetch the course record
    const courseRec = await db
      .select({
        id: course.id,
        name: course.name,
        content_id: course.content_id,
      })
      .from(course)
      .where(and(eq(course.id, courseId), eq(course.site_id, siteId)))
      .limit(1);

    if (courseRec.length === 0) return null;

    // Fetch the course content
    const courseContent = await db
      .select({ content: course_content.content })
      .from(course_content)
      .where(
        courseRec[0].content_id
          ? eq(course_content.id, courseRec[0].content_id)
          : sql`false`
      )
      .limit(1);

    const modulesRec = await db
      .select({
        id: course_modules.id,
        name: course_modules.name,
        content_id: course_modules.content_id,
        content: course_content.content,
      })
      .from(course_modules)
      .leftJoin(
        course_content,
        eq(course_modules.content_id, course_content.id) // Join with course_content using content_id
      )
      .where(eq(course_modules.course_id, courseRec[0].id));

    const moduleIds = modulesRec.map((module) => module.id);

    const topicsRec =
      moduleIds.length > 0
        ? await db
            .select({
              id: course_topics.id,
              name: course_topics.name,
              content_id: course_topics.content_id,
              content: course_content.content,
              module_id: course_topics.module_id,
            })
            .from(course_topics)
            .leftJoin(
              course_content,
              eq(course_topics.content_id, course_content.id)
            )
            .where(inArray(course_topics.module_id, moduleIds))
        : [];

    const courseData: CourseProps = {
      id: courseRec[0].id,
      name: courseRec[0].name,
      content_id: courseRec[0].content_id ?? "",
      content: courseContent[0]?.content || "",
      siteId: siteId,
      modules: modulesRec.map((module) => ({
        id: module.id,
        name: module.name || "", // Ensure name is always a string
        content_id: module.content_id || "", // Ensure content_id is always a string
        content: module.content_id
          ? modulesRec.find((c) => c.content_id === module.content_id)
              ?.content || ""
          : "",
        topics: topicsRec
          .filter((topic) => topic.module_id === module.id)
          .map((topic) => ({
            id: topic.id,
            name: topic.name,
            content_id: topic.content_id || "", // Ensure content_id is always a string
            content: topic.content || "",
          })),
      })),
    };

    return courseData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve course");
  }
}

export async function addMenu(data: FormData) {
  const siteId = data.get("siteId") as string;
  const menuItem = data.get("menuItem") as string;
  const url = data.get("url") as string;
  const order_num = parseInt(data.get("order_num") as string, 10);

  await db.insert(menus).values({
    siteId: siteId,
    menuItem: menuItem,
    url: url,
    order_num: order_num,
  });
  revalidatePath("/menu-management");
}

export async function deleteMenu(id: number) {
  await db.delete(menus).where(eq(menus.id, id));
  revalidatePath("/menu-management");
}

export async function getMenuItems(siteId: string) {
  return await db
    .select()
    .from(menus)
    .where(eq(menus.siteId, siteId))
    .orderBy(asc(menus.order_num));
}

export const verifyAvailability = async (tenant: string) => {
  // Fetch tenant record from the tenants table
  const availTenant = await db
    .select({
      tenant: tenants.tenant, // Assuming 'tenant' is a column in the 'tenants' table
    })
    .from(tenants)
    .where(eq(tenants.tenant, tenant))
    .limit(1);

  // Check if the tenant exists
  if (availTenant.length === 0) {
    // availTenant will be an array, so check its length
    return { success: "Site URL is available." };
  }

  // If tenant exists, proceed with other logic or return success
  return { error: "Site URL already taken. Try other name" };
};

export const createTenant = async (tenant: string) => {
  const newTenant: NewTenant = {
    tenant,
  };

  const [createdTenant] = await db
    .insert(tenants)
    .values(newTenant)
    .returning();

  if (!createdTenant) {
    return { error: "Site URL already taken. Try other name" };
  }
  const user = await getUser();
  console.log("Got User..." + user);
  if (user) {
    await db
      .update(users)
      .set({ siteId: newTenant.tenant })
      .where(eq(users.email, user.email));
  }

  return { success: "Site URL Created." };
};

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const userWithTeam = await db
    .select({
      user: users,

      team: teams,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .leftJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(users.email, email))
    .limit(1);

  if (userWithTeam.length === 0) {
    return { error: "Invalid email or password. Please try again." };
  }

  const { user: foundUser, team: foundTeam } = userWithTeam[0];

  const isPasswordValid = await comparePasswords(
    password,
    foundUser.passwordHash
  );

  if (!isPasswordValid) {
    return { error: "Invalid email or password. Please try again." };
  }

  await Promise.all([
    setSession(foundUser),
    logActivity(foundTeam?.id, foundUser.id, ActivityType.SIGN_IN),
  ]);

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "checkout") {
    const priceId = formData.get("priceId") as string;
    return createCheckoutSession({ team: foundTeam, priceId });
  }

  if (foundUser.siteId) {
    const gotoURL = subdomainURL(foundUser.siteId, "/pages");
    console.log("Redirecting to: ", gotoURL);
    redirect(gotoURL);
  } else {
    redirect("/registersite");
  }
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional(),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, inviteId } = data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { error: "Failed to create user. Please try again." };
  }

  const passwordHash = await hashPassword(password);

  const newUser: NewUser = {
    email,
    passwordHash,
    role: "owner", // Default role, will be overridden if there's an invitation
  };

  const [createdUser] = await db.insert(users).values(newUser).returning();

  if (!createdUser) {
    return { error: "Failed to create user. Please try again." };
  }

  let teamId: number;
  let userRole: string;
  let createdTeam: typeof teams.$inferSelect | null = null;

  if (inviteId) {
    // Check if there's a valid invitation
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.id, parseInt(inviteId)),
          eq(invitations.email, email),
          eq(invitations.status, "pending")
        )
      )
      .limit(1);

    if (invitation) {
      teamId = invitation.teamId;
      userRole = invitation.role;

      await db
        .update(invitations)
        .set({ status: "accepted" })
        .where(eq(invitations.id, invitation.id));

      await logActivity(teamId, createdUser.id, ActivityType.ACCEPT_INVITATION);

      [createdTeam] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, teamId))
        .limit(1);
    } else {
      return { error: "Invalid or expired invitation." };
    }
  } else {
    // Create a new team if there's no invitation
    const newTeam: NewTeam = {
      name: `${email}'s Team`,
    };

    [createdTeam] = await db.insert(teams).values(newTeam).returning();

    if (!createdTeam) {
      return { error: "Failed to create team. Please try again." };
    }

    teamId = createdTeam.id;
    userRole = "owner";

    await logActivity(teamId, createdUser.id, ActivityType.CREATE_TEAM);
  }

  const newTeamMember: NewTeamMember = {
    userId: createdUser.id,
    teamId: teamId,
    role: userRole,
  };

  await Promise.all([
    db.insert(teamMembers).values(newTeamMember),
    logActivity(teamId, createdUser.id, ActivityType.SIGN_UP),
    setSession(createdUser),
  ]);

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "checkout") {
    const priceId = formData.get("priceId") as string;
    return createCheckoutSession({ team: createdTeam, priceId });
  }

  redirect("/registersite");
});

export async function signOut() {
  const user = (await getUser()) as User;
  const userWithTeam = await getUserWithTeam(user.id);
  await logActivity(userWithTeam?.teamId, user.id, ActivityType.SIGN_OUT);
  (await cookies()).delete("session");
}

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return { error: "Current password is incorrect." };
    }

    if (currentPassword === newPassword) {
      return {
        error: "New password must be different from the current password.",
      };
    }

    const newPasswordHash = await hashPassword(newPassword);
    const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      db
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, user.id)),
      logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_PASSWORD),
    ]);

    return { success: "Password updated successfully." };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100),
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    const isPasswordValid = await comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      return { error: "Incorrect password. Account deletion failed." };
    }

    const userWithTeam = await getUserWithTeam(user.id);

    await logActivity(
      userWithTeam?.teamId,
      user.id,
      ActivityType.DELETE_ACCOUNT
    );

    // Soft delete
    await db
      .update(users)
      .set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
        email: sql`CONCAT(email, '-', id, '-deleted')`, // Ensure email uniqueness
      })
      .where(eq(users.id, user.id));

    if (userWithTeam?.teamId) {
      await db
        .delete(teamMembers)
        .where(
          and(
            eq(teamMembers.userId, user.id),
            eq(teamMembers.teamId, userWithTeam.teamId)
          )
        );
    }

    (await cookies()).delete("session");
    redirect("/sign-in");
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      db.update(users).set({ name, email }).where(eq(users.id, user.id)),
      logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_ACCOUNT),
    ]);

    return { success: "Account updated successfully." };
  }
);

const removeTeamMemberSchema = z.object({
  memberId: z.number(),
});

export const removeTeamMember = validatedActionWithUser(
  removeTeamMemberSchema,
  async (data, _, user) => {
    const { memberId } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.id, memberId),
          eq(teamMembers.teamId, userWithTeam.teamId)
        )
      );

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.REMOVE_TEAM_MEMBER
    );

    return { success: "Team member removed successfully" };
  }
);

const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["member", "owner"]),
});

export const inviteTeamMember = validatedActionWithUser(
  inviteTeamMemberSchema,
  async (data, _, user) => {
    const { email, role } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    const existingMember = await db
      .select()
      .from(users)
      .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
      .where(
        and(eq(users.email, email), eq(teamMembers.teamId, userWithTeam.teamId))
      )
      .limit(1);

    if (existingMember.length > 0) {
      return { error: "User is already a member of this team" };
    }

    // Check if there's an existing invitation
    const existingInvitation = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.email, email),
          eq(invitations.teamId, userWithTeam.teamId),
          eq(invitations.status, "pending")
        )
      )
      .limit(1);

    if (existingInvitation.length > 0) {
      return { error: "An invitation has already been sent to this email" };
    }

    // Create a new invitation
    await db.insert(invitations).values({
      teamId: userWithTeam.teamId,
      email,
      role,
      invitedBy: user.id,
      status: "pending",
    });

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER
    );

    // TODO: Send invitation email and include ?inviteId={id} to sign-up URL
    // await sendInvitationEmail(email, userWithTeam.team.name, role)

    return { success: "Invitation sent successfully" };
  }
);
