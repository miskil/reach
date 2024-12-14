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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

export const tenants = pgTable("tenants", {
  id: serial("id").unique(),
  tenant: varchar("tenant", { length: 100 }).primaryKey().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteheader = pgTable("siteheader", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),
  siteiconURL: varchar("siteiconURL", { length: 400 }),
  siteHeader: varchar("siteHeader", { length: 400 }),
  headerTextColor: varchar("headertextcolor", { length: 12 }),
  headerFontSize: varchar("headerfontsize", { length: 12 }),
  headerBkgColor: varchar("headerbkgcolor", { length: 12 }),
  headerBkgImageURL: varchar("headerbkgimageURL", { length: 400 }),
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
/*
export const pagex = pgTable("pagex", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),
  pageTemplate: varchar("pageTemplate", { length: 20 })
    .notNull()
    .default("page1"), //page1, page2, page3, page4
  menuItem: varchar("menuItem").references(() => menus.menuItem),
  pagetitle: varchar("pagetitle", { length: 255 }).notNull(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),
  pageTemplate: varchar("pageTemplate").references(() => pagex.pageTemplate),
  image_url: varchar("image_url", { length: 400 }).notNull(),
  order_num: integer("order_num").notNull(), // To maintain the order of images
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
export const tiles = pgTable("tiles", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),
  pageTemplate: varchar("pageTemplate").references(() => pagex.pageTemplate),
  image_url: varchar("image_url", { length: 400 }), // Image URL for the tile
  text: text("text"), // Text content for the tile
  more_link: varchar("more_link", { length: 400 }), // Link for the "more..." text
  order_num: integer("order_num").notNull(), // To maintain the order of tiles
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
export const pageitems = pgTable("pageitems", {
  id: serial("id").primaryKey(),
  siteId: varchar("siteId").references(() => tenants.tenant),
  menuItem: varchar("menuItem").references(() => menus.menuItem),
  pagetitle: varchar("pagetitle", { length: 255 }).notNull(),
  order_num: integer("order_num").notNull(),
  item_type: varchar("item_type", { length: 20 }).notNull().default("text"), //text, image, video, audio, banner link
  item_url: varchar("item_url", { length: 400 }),
  item_text: text("item_text"), //text
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
*/
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
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
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

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export type Tenant = typeof tenants.$inferSelect;
export type Banner = typeof banners.$inferSelect;
export type NewBanner = typeof banners.$inferInsert;
export type Tile = typeof tiles.$inferSelect;
export type NewTile = typeof tiles.$inferInsert;
export type Pages = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type NewTenant = typeof tenants.$inferInsert;
export type NewSiteHeader = typeof siteheader.$inferInsert;
export type SiteHeader = typeof siteheader.$inferSelect;
export type PageType = typeof pages.$inferSelect;

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
