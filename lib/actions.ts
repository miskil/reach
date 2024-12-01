"use server";

import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import fs from "fs";
import path from "path";

import {
  User,
  users,
  teams,
  tenants,
  siteheader,
  SiteHeader,
  teamMembers,
  activityLogs,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
  type NewActivityLog,
  type NewTenant,
  type NewSiteHeader,
  ActivityType,
  invitations,
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

export async function deleteImage(imagePath: string) {
  try {
    const filePath = path.join(process.cwd(), "public", imagePath);
    await fs.promises.rm(filePath);
  } catch {
    return "error";
  }
  return "Deleted";
}

async function uploadImage(image: File | null) {
  let iconPath: string = "",
    filePath: string = "";

  try {
    if (image) {
      // Set up the file path for the icon
      const uploadsDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      iconPath = `/uploads/${Date.now()}-${image.name}`;
      filePath = path.join(uploadsDir, iconPath);

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
  const headerBkgImage = data.get("headerBkgImage") as string | null;
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
      siteIconPath = await uploadImage(siteIcon);
    } catch (error) {
      console.error("Image Upload Error:", error);
      return { error: "Failed to upload site icon" };
    }
  }

  if (headerBkgImage) {
    try {
      bkgImagePath = await uploadImage(headerBkgImage);
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
