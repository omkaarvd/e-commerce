ALTER TABLE "e_com_products" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "e_com_products" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "e_com_products" ADD COLUMN "updated_at" timestamp DEFAULT now();