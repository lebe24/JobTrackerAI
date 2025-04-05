import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Job schema
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  companyInitials: text("company_initials").notNull(),
  companyColor: text("company_color").notNull(),
  position: text("position").notNull(),
  location: text("location").notNull(),
  salary: text("salary").notNull(),
  jobType: text("job_type").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull().default(""),
  postedDate: timestamp("posted_date").notNull().defaultNow(),
  notionPageId: text("notion_page_id").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Application schema
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id").notNull(),
  status: text("status").notNull().default("Applied"),
  appliedDate: timestamp("applied_date").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  notes: text("notes").notNull().default(""),
  notionPageId: text("notion_page_id").notNull().default(""),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Chat message schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Enums and other types
export const ApplicationStatus = z.enum([
  "Applied",
  "In Review",
  "Interview",
  "Final Interview",
  "Offer",
  "Rejected",
  "Accepted"
]);

export type ApplicationStatusType = z.infer<typeof ApplicationStatus>;

// Extended types for frontend use
export type JobWithStatus = Job & {
  status?: ApplicationStatusType;
  appliedDate?: Date;
};

export type ApplicationWithJob = Application & {
  job: Job;
};

export type DashboardStats = {
  totalApplications: number;
  interviewInvites: number;
  inProgress: number;
  rejected: number;
};
