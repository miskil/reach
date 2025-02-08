"use server";

import { z } from "zod";
import { and, asc, eq, sql, inArray } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { Course } from "../lib/types";
import fs from "fs";
import path from "path";

import {
  User,
  users,
  teams,
  tenants,
  siteheader,
  pages,
  courses,
  modules,
  topics,
  SiteHeader,
  teamMembers,
  activityLogs,
  paymentPages,
  type paymentPagesType,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
  type NewActivityLog,
  type NewTenant,
  type NewSiteHeader,
  type Tenant,
  type PageType,
  type CourseType,
  type ModulesType,
  type TeamMember,
  type NewPage,
  ActivityType,
  invitations,
  menus,
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
  await fs.promises.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

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
export async function deleteImage(siteId: string, imagePath: string) {
  try {
    const filePath = path.join(process.cwd(), "public", imagePath);
    await fs.promises.rm(filePath);
  } catch {
    return "error";
  }
  return "Deleted";
}

export async function uploadImage(siteId: string, image: File | null) {
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
        Buffer.from(await image.arrayBuffer())
      );
    }
  } catch {
    return "";
  }
  return iconPath;
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
      siteIconPath = await uploadImage(siteId, siteIcon);
    } catch (error) {
      console.error("Image Upload Error:", error);
      return { error: "Failed to upload site icon" };
    }
  }

  if (headerBkgImage) {
    try {
      bkgImagePath = await uploadImage(siteId, headerBkgImage);
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
    .select()
    .from(courses)
    .where(eq(courses.siteId, siteId));
  return courseData;
};
export async function getCoursebyTitle(
  siteId: string,
  courseTitle: string
): Promise<Course | null> {
  try {
    const courseData = await db
      .select()
      .from(courses)
      .where(and(eq(courses.title, courseTitle), eq(courses.siteId, siteId)));

    if (courseData.length === 0) return null;

    const modulesData = await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseData[0].id));

    if (!Array.isArray(modulesData)) {
      throw new Error("modulesData should be an array");
    }

    const moduleIds = modulesData.map((module) => module.id);

    const topicsData =
      moduleIds.length > 0
        ? await db
            .select()
            .from(topics)
            .where(inArray(topics.moduleId, moduleIds))
        : [];

    const course: Course = {
      id: courseData[0].id,
      title: courseData[0].title,
      pageUrl: courseData[0].course_url || "",
      modules: modulesData.map((module) => ({
        id: module.id,
        name: module.name || null,
        pageUrl: module.module_url || null,
        order: module.order,
        topics: topicsData
          .filter((topic) => topic.moduleId === module.id)
          .map((topic) => ({
            id: topic.id,
            name: topic.name,
            pageUrl: topic.topic_url || null,
            order: topic.order,
            moduleId: topic.moduleId,
          })),
      })),
    };

    return course;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve course");
  }
}
export const saveCourse = async (siteId: string, course: any) => {
  try {
    if (!course.title || !siteId) {
      throw new Error("Invalid course data");
    }

    if (course.id) {
      // Update existing course
      const updatedCourse = await db
        .update(courses)
        .set({
          siteId: siteId,
          title: course.title,
          course_url: course.pageUrl,
        })
        .where(eq(courses.id, course.id) && eq(courses.siteId, siteId))
        .returning();

      if (!updatedCourse.length) {
        throw new Error("Failed to update course");
      }
    } else {
      // Create new course
      const [insertedCourse] = await db
        .insert(courses)
        .values({
          siteId: siteId,
          title: course.title,
          course_url: course.pageUrl,
        })
        .returning();
      if (!insertedCourse) {
        throw new Error("Failed to create course");
      }
      course.id = insertedCourse.id;
    }

    // Insert modules and topics
    for (const module of course.modules) {
      let insertedModule;
      if (module.id) {
        [insertedModule] = await db
          .update(modules)
          .set({
            courseId: course.id,
            siteId: siteId,
            name: module.name,
            order: module.order,
            module_url: module.pageUrl,
          })
          .where(eq(modules.id, module.id))
          .returning();
        if (!insertedModule) {
          throw new Error("Failed to update module");
        }
      } else {
        [insertedModule] = await db

          .insert(modules)
          .values({
            courseId: course.id,
            siteId: siteId,
            name: module.name,
            order: module.order,
            module_url: module.pageUrl,
          })
          .returning();
        if (!insertedModule) {
          throw new Error("Failed to create module");
        }

        module.id = insertedModule.id;
      }
      // Insert or update topics
      const existingTopics = await db
        .select({ id: topics.id })
        .from(topics)
        .where(eq(topics.moduleId, module.id));

      const existingTopicIds = existingTopics.map((t) => t.id);
      const updatedTopicIds: number[] = module.topics
        .map((t: { id: number }) => t.id)
        .filter(Boolean);

      // Delete topics that are no longer present
      const topicsToDelete = existingTopicIds.filter(
        (id) => !updatedTopicIds.includes(id)
      );
      if (topicsToDelete.length > 0) {
        const deletedTopics = await db
          .delete(topics)
          .where(inArray(topics.id, topicsToDelete))
          .returning();

        if (!deletedTopics.length) {
          throw new Error("Failed to delete topics");
        }
      }

      for (const topic of module.topics) {
        if (!topic.name || !topic.pageUrl) {
          throw new Error("Missing required topic information");
        }

        if (topic.id) {
          const updatedTopic = await db
            .update(topics)
            .set({
              name: topic.name,
              order: topic.order,
              topic_url: topic.pageUrl,
            })
            .where(eq(topics.id, topic.id))
            .returning();

          if (!updatedTopic.length) {
            throw new Error("Failed to update topic");
          }
        } else {
          const [insertedTopic] = await db
            .insert(topics)
            .values({
              moduleId: module.id,
              siteId: siteId,
              name: topic.name,
              order: topic.order,
              topic_url: topic.pageUrl,
            })
            .returning();

          if (!insertedTopic) {
            throw new Error("Failed to create topic");
          }

          topic.id = insertedTopic.id;
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save course");
  }
};

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

  if (foundUser.siteId) redirect(`/${foundUser.siteId}`);
  redirect("/registersite");
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
