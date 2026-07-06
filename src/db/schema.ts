import { pgTable, uuid, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";

export const moderatorApplications = pgTable("moderator_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: text("email").notNull(),
  facebookLink: text("facebook_link").notNull(),
  address: text("address").notNull(),
  parentPhone: varchar("parent_phone", { length: 20 }),
  parentFacebook: text("parent_facebook"),
  schoolName: text("school_name"),
  className: text("class_name"),
  teacherName: text("teacher_name"),
  teacherPhone: varchar("teacher_phone", { length: 20 }),
  teacherFacebook: text("teacher_facebook"),
  idDocumentUrl: text("id_document_url").notNull(),
  facePhotoUrl: text("face_photo_url").notNull(),
  verificationMethod: text("verification_method").notNull(),
  status: varchar("status", { length: 20 }).default("Pending").notNull(),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moderatorRules = pgTable("moderator_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const moderatorAnnouncements = pgTable("moderator_announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey(), // matches auth.users.id in Supabase
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
