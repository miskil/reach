import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  unique,
  boolean,
  jsonb,
  numeric,
  uuid,
  primaryKey,
  foreignKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export interface ContentType {
  components: Array<{
    id: string;
    type: string;
    widget: any;
  }>;
}

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId")
    .notNull()
    .references(() => tenants.tenant),

  name: varchar("name", { length: 255 }).notNull(),
  layout: varchar("layout", { length: 50 }).notNull(),
  menuItem: varchar("menu_item", { length: 255 }),
  content: jsonb("content").notNull(), // Stores layout-specific content as JSON
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId")
    .notNull()
    .references(() => tenants.tenant),

  name: varchar("name", { length: 255 }).notNull(),
  layout: varchar("layout", { length: 50 }).notNull(),
  menuItem: varchar("menu_item", { length: 255 }),
  category: varchar("category", { length: 255 }),
  tags: varchar("tags", { length: 255 }),
  author: varchar("author", { length: 255 }),
  authorbio: varchar("authorbio", { length: 255 }),
  authorimage: varchar("authorimage", { length: 255 }),
  blogImageURL: varchar("blogImageURL", { length: 255 }),
  content: jsonb("content").notNull(), // Stores layout-specific content as JSON
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
export const blogCategories = pgTable("blogCategories", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),

  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),

  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const tenants = pgTable("tenants", {
  id: serial("id").unique(),
  tenant: varchar("tenant", { length: 100 }).primaryKey().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteheader = pgTable("siteheader", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),
  siteiconURL: varchar("siteiconURL", { length: 400 }),
  content: jsonb("content").notNull(), // Stores layout-specific content as JSON

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Table definition
export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  parent_id: integer("parent_id").references((): any => menus.id),
  siteId: varchar("siteId").references(() => tenants.tenant),
  menuItem: varchar("title", { length: 255 }).unique(),
  url: varchar("url", { length: 255 }).notNull(),
  order_num: integer("order_num").notNull(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

/** Courses */

export const course_content = pgTable("course_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: varchar("siteId").references(() => tenants.tenant),

  content: text("content").notNull(),
});

export const course = pgTable("course", {
  id: uuid("id").primaryKey().defaultRandom(),
  site_id: varchar("site_id").references(() => tenants.tenant),

  name: text("name").notNull().unique(),
  content_id: uuid("content_id").references(() => course_content.id),
});

export const course_modules = pgTable("course_modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  site_id: varchar("site_id").references(() => tenants.tenant),

  course_id: uuid("course_id").references(() => course.id),
  name: text("name").notNull(),
  content_id: uuid("content_id").references(() => course_content.id),
});

export const course_topics = pgTable("course_topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  site_id: varchar("site_id").references(() => tenants.tenant),

  module_id: uuid("module_id").references(() => course_modules.id),
  name: text("name").notNull(),
  content_id: uuid("content_id").references(() => course_content.id),
});

// Relations
export const course_modules_link = pgTable("course_modules_link", {
  course_id: uuid("course_id").references(() => course.id),
  site_id: varchar("site_id").references(() => tenants.tenant),

  module_id: uuid("module_id").references(() => course_modules.id),
  position: integer("position").notNull().default(0),
});

export const course_module_topics_link = pgTable("course_module_topics_link", {
  module_id: uuid("module_id").references(() => course_modules.id),
  site_id: varchar("site_id").references(() => tenants.tenant),
  topic_id: uuid("topic_id").references(() => course_topics.id),
  position: integer("position").notNull().default(0),
});

// db/schema/members.ts

export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  site_id: varchar("site_id").references(() => tenants.tenant),
  email: text("email").notNull(),
  accessLevel: text("access_level").notNull(), // 'admin' | 'editor' | 'viewer'
  invitedBy: varchar("invitedBy", { length: 255 })
    .notNull()
    .references(() => users.email),
  createdAt: timestamp("created_at").defaultNow(),
});

// db/schema/invites.ts
export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  site_id: varchar("site_id").references(() => tenants.tenant),
  email: text("email").notNull(),
  accessLevel: text("access_level").notNull(), // 'admin' | 'editor' | 'viewer'

  token: text("token").notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'accepted' | 'declined'
  invitedBy: varchar("invitedBy", { length: 255 })
    .notNull()
    .references(() => users.email),

  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const paymentPages = pgTable("payment_pages", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),
  title: text("title").notNull(),
  description: text("description").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  successUrl: text("success_url").notNull(),
  cancelUrl: text("cancel_url").notNull(),
  customFields: jsonb("custom_fields"),
  createdAt: text("created_at").default("now()"),
  updatedAt: text("updated_at").default("now()"),
});
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeProductId: text("stripe_product_id"),
  planName: varchar("plan_name", { length: 50 }),
  subscriptionStatus: varchar("subscription_status", { length: 20 }),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  role: varchar("role", { length: 50 }).notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),

  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  invitedBy: integer("invited_by")
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp("invited_at").notNull().defaultNow(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export type Tenant = typeof tenants.$inferSelect;

export type Pages = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type blogsType = typeof blogs.$inferSelect;
export type blogCategoriesType = typeof blogCategories.$inferSelect;
export type tagType = typeof tags.$inferInsert;
export type NewTenant = typeof tenants.$inferInsert;
export type NewSiteHeader = typeof siteheader.$inferInsert;
export type SiteHeader = typeof siteheader.$inferSelect;
export type PageType = typeof pages.$inferSelect;
export type CourseContentType = typeof course_content.$inferInsert;
export type CourseModuleType = typeof course_modules.$inferInsert;
export type CourseTopicType = typeof course_topics.$inferInsert;

export type CourseType = typeof course.$inferSelect;
export type paymentPagesType = typeof paymentPages.$inferSelect;

export type SiteMenusType = typeof menus.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, "id" | "name" | "email">;
  })[];
};

export enum ActivityType {
  SIGN_UP = "SIGN_UP",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
  UPDATE_PASSWORD = "UPDATE_PASSWORD",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
  CREATE_TEAM = "CREATE_TEAM",
  REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER",
  INVITE_TEAM_MEMBER = "INVITE_TEAM_MEMBER",
  ACCEPT_INVITATION = "ACCEPT_INVITATION",
}
