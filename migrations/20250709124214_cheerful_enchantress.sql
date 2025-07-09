DROP INDEX "embeddingIndex";--> statement-breakpoint
CREATE INDEX "search_index" ON "e_com_products" USING gin ((
          setweight(to_tsvector('english', "name"), 'A') ||
          setweight(to_tsvector('english', "description"), 'B') ||
          setweight(to_tsvector('english', "color"), 'C')
      ));--> statement-breakpoint
ALTER TABLE "e_com_products" DROP COLUMN "embedding";