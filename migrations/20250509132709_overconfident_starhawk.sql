CREATE TABLE "e_com_cart" (
	"user_id" text PRIMARY KEY NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "e_com_products" (
	"id" text PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"name" text NOT NULL,
	"size" text NOT NULL,
	"color" text NOT NULL,
	"price" double precision NOT NULL,
	"available" integer NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"embedding" vector(768)
);
--> statement-breakpoint
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
	"stripe_customer_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "e_com_cart" ADD CONSTRAINT "e_com_cart_user_id_e_com_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."e_com_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "e_com_purchases" ADD CONSTRAINT "e_com_purchases_user_id_e_com_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."e_com_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "e_com_purchases" ADD CONSTRAINT "e_com_purchases_product_id_e_com_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."e_com_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "e_com_products" USING hnsw ("embedding" vector_cosine_ops);