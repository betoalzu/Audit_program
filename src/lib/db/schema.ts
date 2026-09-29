import { relations, sql } from "drizzle-orm";
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import type { InterviewAnswers } from "../interview-schema";

export const interviewStatus = pgEnum("interview_status", [
  "draft",
  "in_progress",
  "pending_review",
  "confirmed",
  "diagnosed",
  "paused",
  "error",
]);

export const interviewScreen = pgEnum("interview_screen", ["welcome", "questions", "review", "done"]);

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  sector: text("sector"),
  location: text("location"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const interviews = pgTable("interviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  status: interviewStatus("status").notNull().default("draft"),
  schemaVersion: integer("schema_version").notNull().default(1),
  currentStep: integer("current_step").notNull().default(0),
  currentScreen: interviewScreen("current_screen").notNull().default("welcome"),
  answers: jsonb("answers").$type<InterviewAnswers>().notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const processes = pgTable("processes", {
  id: uuid("id").defaultRandom().primaryKey(),
  interviewId: uuid("interview_id").notNull().unique().references(() => interviews.id, { onDelete: "cascade" }),
  name: text("name"),
  goal: text("goal"),
  frequency: text("frequency"),
  caseCount: text("case_count"),
  minutesPerCase: text("minutes_per_case"),
  tools: text("tools"),
  manualStep: text("manual_step"),
  problems: text("problems"),
  humanDecisions: text("human_decisions"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const interviewSessions = pgTable("interview_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  interviewId: uuid("interview_id").notNull().references(() => interviews.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("interview_sessions_token_hash_idx").on(table.tokenHash),
  index("interview_sessions_expiry_idx").on(table.expiresAt),
]);

export const companyRelations = relations(companies, ({ many }) => ({ interviews: many(interviews) }));
export const interviewRelations = relations(interviews, ({ one }) => ({
  company: one(companies, { fields: [interviews.companyId], references: [companies.id] }),
  process: one(processes),
}));
export const processRelations = relations(processes, ({ one }) => ({
  interview: one(interviews, { fields: [processes.interviewId], references: [interviews.id] }),
}));