ALTER TABLE "e_com_purchases" DROP CONSTRAINT "e_com_purchases_user_id_e_com_users_id_fk";
--> statement-breakpoint
ALTER TABLE "e_com_purchases" ADD CONSTRAINT "e_com_purchases_product_id_e_com_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."e_com_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "e_com_purchases" ADD CONSTRAINT "e_com_purchases_user_id_e_com_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."e_com_users"("id") ON DELETE cascade ON UPDATE no action;