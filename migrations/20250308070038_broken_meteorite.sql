CREATE TABLE "e_com_products" (
	"id" text PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"name" text NOT NULL,
	"size" text NOT NULL,
	"color" text NOT NULL,
	"price" double precision NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"embedding" vector(768)
);
--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "e_com_products" USING hnsw ("embedding" vector_cosine_ops);