CREATE TABLE "e_com_purchases" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "e_com_users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "e_com_purchases" ADD CONSTRAINT "e_com_purchases_user_id_e_com_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."e_com_users"("id") ON DELETE no action ON UPDATE no action;