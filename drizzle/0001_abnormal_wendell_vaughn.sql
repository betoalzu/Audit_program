CREATE TYPE "public"."interview_analysis_status" AS ENUM('running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "interview_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_id" uuid NOT NULL,
	"answer_hash" text NOT NULL,
	"status" "interview_analysis_status" DEFAULT 'running' NOT NULL,
	"run_count" integer DEFAULT 1 NOT NULL,
	"model" text NOT NULL,
	"prompt_version" integer NOT NULL,
	"result" jsonb,
	"input_tokens" integer,
	"output_tokens" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "interview_analyses_interview_id_unique" UNIQUE("interview_id")
);
--> statement-breakpoint
ALTER TABLE "interview_analyses" ADD CONSTRAINT "interview_analyses_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;