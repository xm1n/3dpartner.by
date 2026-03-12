import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_catalogs_icon" AS ENUM('printer', 'spool', 'cube', 'gear', 'tools', 'box');
  CREATE TYPE "public"."enum_products_badges" AS ENUM('bestseller', 'new', 'sale', 'preorder');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_badges" AS ENUM('bestseller', 'new', 'sale', 'preorder');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('new', 'confirmed', 'paid', 'packing', 'shipping', 'delivered', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_orders_delivery_method" AS ENUM('pickup', 'courier', 'europochta', 'belpochta');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('card', 'erip', 'invoice', 'cash');
  CREATE TYPE "public"."enum_print_orders_status" AS ENUM('new', 'estimating', 'approval', 'paid', 'slicing', 'printing', 'postprocessing', 'ready', 'delivered', 'cancelled');
  CREATE TYPE "public"."enum_production_cards_status" AS ENUM('draft', 'queued', 'slicing', 'printing', 'postprocessing', 'completed', 'defect');
  CREATE TYPE "public"."enum_printers_type" AS ENUM('fdm', 'sla', 'sls');
  CREATE TYPE "public"."enum_printers_status" AS ENUM('idle', 'printing', 'maintenance', 'broken');
  CREATE TYPE "public"."enum_farm_materials_material_type" AS ENUM('pla', 'petg', 'abs', 'asa', 'tpu', 'nylon', 'pc', 'composite', 'resin');
  CREATE TYPE "public"."enum_engineer_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_engineer_projects_license_type" AS ENUM('free', 'paid', 'print_only');
  CREATE TYPE "public"."enum__engineer_projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__engineer_projects_v_version_license_type" AS ENUM('free', 'paid', 'print_only');
  CREATE TYPE "public"."enum_engineer_tasks_status" AS ENUM('open', 'assigned', 'in_progress', 'review', 'completed', 'dispute', 'cancelled');
  CREATE TYPE "public"."enum_b2b_clients_discount_column" AS ENUM('base', 'partner_5', 'dealer_10', 'distributor_15', 'custom');
  CREATE TYPE "public"."enum_b2b_pricelists_format" AS ENUM('xml', 'csv', 'json');
  CREATE TYPE "public"."enum_b2b_pricelists_price_rule" AS ENUM('base', 'client_discount', 'markup');
  CREATE TYPE "public"."enum_b2b_applications_status" AS ENUM('new', 'in_progress', 'approved', 'rejected');
  CREATE TYPE "public"."enum_promotions_type" AS ENUM('promo_percent', 'promo_fixed', 'promo_shipping', 'cart_rule');
  CREATE TYPE "public"."enum_banners_position" AS ENUM('hero', 'megamenu', 'catalog', 'popup');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_articles_article_category" AS ENUM('knowledge', 'news', 'reviews', 'tutorials');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_article_category" AS ENUM('knowledge', 'news', 'reviews', 'tutorials');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_slicer_profiles_slicer" AS ENUM('bambu_studio', 'orcaslicer', 'prusaslicer', 'cura', 'other');
  CREATE TYPE "public"."enum_users_permissions" AS ENUM('shop_catalog', 'shop_orders', 'farm_orders', 'farm_equipment', 'engineers', 'b2b', 'marketing', 'content', 'import');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'manager', 'developer', 'b2c_customer', 'b2b_customer', 'engineer');
  CREATE TYPE "public"."enum_callback_requests_status" AS ENUM('new', 'contacted', 'closed');
  CREATE TABLE "catalogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"icon" "enum_catalogs_icon",
  	"show_in_nav" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"megamenu_banner_banner_image_id" integer,
  	"megamenu_banner_banner_badge" varchar,
  	"megamenu_banner_banner_title" varchar,
  	"megamenu_banner_banner_text" varchar,
  	"megamenu_banner_banner_link" varchar,
  	"megamenu_banner_banner_link_text" varchar DEFAULT 'Подробнее',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant_name" varchar,
  	"variant_sku" varchar,
  	"variant_price" numeric,
  	"variant_stock" numeric,
  	"color_hex" varchar
  );
  
  CREATE TABLE "products_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"spec_name" varchar,
  	"spec_value" varchar
  );
  
  CREATE TABLE "products_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "products_download_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "products_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"sku" varchar,
  	"catalog_id" integer,
  	"brand_id" integer,
  	"description" jsonb,
  	"price" numeric,
  	"old_price" numeric,
  	"in_stock" boolean DEFAULT true,
  	"stock_quantity" numeric,
  	"available_for_b2_b" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"moysklad_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "_products_v_version_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant_name" varchar,
  	"variant_sku" varchar,
  	"variant_price" numeric,
  	"variant_stock" numeric,
  	"color_hex" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"spec_name" varchar,
  	"spec_value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_download_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__products_v_version_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_sku" varchar,
  	"version_catalog_id" integer,
  	"version_brand_id" integer,
  	"version_description" jsonb,
  	"version_price" numeric,
  	"version_old_price" numeric,
  	"version_in_stock" boolean DEFAULT true,
  	"version_stock_quantity" numeric,
  	"version_available_for_b2_b" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_moysklad_id" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "categories_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"catalog_id" integer,
  	"parent_id" integer,
  	"image_id" integer,
  	"description" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"logo_id" integer,
  	"description" varchar,
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"variant_name" varchar,
  	"quantity" numeric NOT NULL,
  	"unit_price" numeric NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'new',
  	"customer_id" integer,
  	"contact_info_first_name" varchar,
  	"contact_info_last_name" varchar,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"subtotal" numeric,
  	"delivery_cost" numeric,
  	"total" numeric,
  	"delivery_method" "enum_orders_delivery_method",
  	"delivery_address" varchar,
  	"delivery_tracking_number" varchar,
  	"payment_method" "enum_orders_payment_method",
  	"payment_paid" boolean,
  	"customer_note" varchar,
  	"moysklad_order_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"author_id" integer NOT NULL,
  	"author_name" varchar,
  	"rating" numeric NOT NULL,
  	"text" varchar NOT NULL,
  	"approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "print_orders_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"file_name" varchar
  );
  
  CREATE TABLE "print_orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"status" "enum_print_orders_status" DEFAULT 'new',
  	"customer_id" integer,
  	"print_params_material" varchar,
  	"print_params_color" varchar,
  	"print_params_infill" numeric,
  	"print_params_layer_height" numeric,
  	"print_params_quantity" numeric DEFAULT 1,
  	"print_params_need_supports" boolean,
  	"estimation_volume_cm3" numeric,
  	"estimation_weight_grams" numeric,
  	"estimation_print_time_minutes" numeric,
  	"estimation_estimated_price" numeric,
  	"customer_note" varchar,
  	"internal_note" varchar,
  	"yougile_task_id" varchar,
  	"production_card_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "production_cards_source_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "production_cards_gcode_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"printer_model" varchar
  );
  
  CREATE TABLE "production_cards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"status" "enum_production_cards_status" DEFAULT 'draft',
  	"instructions" jsonb,
  	"postprocessing_notes" varchar,
  	"printer_id" integer,
  	"material_used_id" integer,
  	"grams_used" numeric,
  	"yougile_task_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "printers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"model" varchar NOT NULL,
  	"manufacturer" varchar,
  	"type" "enum_printers_type",
  	"status" "enum_printers_status" DEFAULT 'idle',
  	"print_hours" numeric DEFAULT 0,
  	"print_volume" varchar,
  	"notes" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "farm_materials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"material_type" "enum_farm_materials_material_type" NOT NULL,
  	"brand" varchar,
  	"color" varchar,
  	"color_hex" varchar,
  	"spool_weight_grams" numeric DEFAULT 1000,
  	"remaining_grams" numeric NOT NULL,
  	"price_per_gram" numeric,
  	"linked_product_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "engineer_projects_source_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"version" varchar
  );
  
  CREATE TABLE "engineer_projects_renders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "engineer_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"author_id" integer,
  	"description" jsonb,
  	"status" "enum_engineer_projects_status" DEFAULT 'draft',
  	"license_type" "enum_engineer_projects_license_type" DEFAULT 'free',
  	"license_price" numeric,
  	"royalty_percent" numeric DEFAULT 10,
  	"printability_score" numeric,
  	"print_specs_material" varchar,
  	"print_specs_infill" varchar,
  	"print_specs_supports" boolean,
  	"print_specs_notes" varchar,
  	"linked_product_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_engineer_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_engineer_projects_v_version_source_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"version" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_engineer_projects_v_version_renders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_engineer_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_author_id" integer,
  	"version_description" jsonb,
  	"version_status" "enum__engineer_projects_v_version_status" DEFAULT 'draft',
  	"version_license_type" "enum__engineer_projects_v_version_license_type" DEFAULT 'free',
  	"version_license_price" numeric,
  	"version_royalty_percent" numeric DEFAULT 10,
  	"version_printability_score" numeric,
  	"version_print_specs_material" varchar,
  	"version_print_specs_infill" varchar,
  	"version_print_specs_supports" boolean,
  	"version_print_specs_notes" varchar,
  	"version_linked_product_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__engineer_projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "engineer_tasks_reference_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "engineer_tasks_responses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"engineer_id" integer NOT NULL,
  	"price" numeric,
  	"estimated_days" numeric,
  	"message" varchar,
  	"selected" boolean DEFAULT false
  );
  
  CREATE TABLE "engineer_tasks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"client_id" integer NOT NULL,
  	"briefing" jsonb,
  	"budget" numeric,
  	"deadline" timestamp(3) with time zone,
  	"status" "enum_engineer_tasks_status" DEFAULT 'open',
  	"assigned_engineer_id" integer,
  	"escrow_amount" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "b2b_clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"inn" varchar,
  	"user_id" integer,
  	"contact_person" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"legal_address" varchar,
  	"discount_column" "enum_b2b_clients_discount_column" DEFAULT 'base',
  	"custom_discount_percent" numeric,
  	"api_token" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "b2b_pricelists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"format" "enum_b2b_pricelists_format" NOT NULL,
  	"client_id" integer,
  	"only_b2_b_available" boolean DEFAULT true,
  	"include_out_of_stock" boolean DEFAULT false,
  	"price_rule" "enum_b2b_pricelists_price_rule",
  	"markup_percent" numeric,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "b2b_pricelists_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "b2b_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"inn" varchar,
  	"contact_person" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"comment" varchar,
  	"user_id" integer,
  	"status" "enum_b2b_applications_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "promotions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_promotions_type" NOT NULL,
  	"code" varchar,
  	"discount_value" numeric,
  	"min_order_amount" numeric,
  	"min_quantity" numeric,
  	"usage_limit" numeric,
  	"used_count" numeric DEFAULT 0,
  	"valid_from" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "promotions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "banners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"image_id" integer NOT NULL,
  	"link" varchar,
  	"button_text" varchar,
  	"position" "enum_banners_position" NOT NULL,
  	"badge_text" varchar,
  	"badge_color" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"article_category" "enum_articles_article_category",
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"content" jsonb,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_article_category" "enum__articles_v_version_article_category",
  	"version_excerpt" varchar,
  	"version_cover_image_id" integer,
  	"version_content" jsonb,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "slicer_profiles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"printer" varchar NOT NULL,
  	"material" varchar NOT NULL,
  	"slicer" "enum_slicer_profiles_slicer",
  	"profile_file_id" integer NOT NULL,
  	"description" varchar,
  	"download_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_permissions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_permissions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar,
  	"phone" varchar,
  	"role" "enum_users_role" DEFAULT 'b2c_customer' NOT NULL,
  	"delivery_address_city" varchar,
  	"delivery_address_street" varchar,
  	"delivery_address_postal_code" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "callback_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"comment" varchar,
  	"preferred_time" varchar,
  	"user_id" integer,
  	"status" "enum_callback_requests_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"catalogs_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer,
  	"orders_id" integer,
  	"reviews_id" integer,
  	"print_orders_id" integer,
  	"production_cards_id" integer,
  	"printers_id" integer,
  	"farm_materials_id" integer,
  	"engineer_projects_id" integer,
  	"engineer_tasks_id" integer,
  	"b2b_clients_id" integer,
  	"b2b_pricelists_id" integer,
  	"b2b_applications_id" integer,
  	"promotions_id" integer,
  	"banners_id" integer,
  	"pages_id" integer,
  	"articles_id" integer,
  	"slicer_profiles_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"callback_requests_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_managers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"department" varchar NOT NULL,
  	"phone" varchar,
  	"photo_id" integer,
  	"is_online" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"general_site_name" varchar DEFAULT '3D Partner',
  	"general_tagline" varchar,
  	"general_logo_id" integer,
  	"contacts_phone" varchar DEFAULT '+375 (29) 111-22-33',
  	"contacts_phone_secondary" varchar,
  	"contacts_email" varchar DEFAULT 'info@3dpartner.by',
  	"contacts_address" varchar DEFAULT 'г. Минск, ул. Технологическая, 1',
  	"contacts_working_hours" varchar DEFAULT 'Пн-Пт: 9:00 - 18:00',
  	"socials_telegram" varchar,
  	"socials_whatsapp" varchar,
  	"socials_vk" varchar,
  	"socials_instagram" varchar,
  	"legal_company_full_name" varchar,
  	"legal_inn" varchar,
  	"legal_trade_reg_date" varchar,
  	"legal_trade_reg_number" varchar,
  	"legal_legal_address" varchar,
  	"analytics_google_analytics_id" varchar,
  	"analytics_yandex_metrika_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "calculator_settings_materials_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color_name" varchar,
  	"color_hex" varchar,
  	"available" boolean DEFAULT true
  );
  
  CREATE TABLE "calculator_settings_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"price_per_gram" numeric NOT NULL,
  	"price_per_cm3" numeric,
  	"density" numeric
  );
  
  CREATE TABLE "calculator_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"coefficients_infill25" numeric DEFAULT 1,
  	"coefficients_infill50" numeric DEFAULT 1.3,
  	"coefficients_infill75" numeric DEFAULT 1.6,
  	"coefficients_infill100" numeric DEFAULT 2,
  	"coefficients_support_multiplier" numeric DEFAULT 1.15,
  	"coefficients_engineering_material_multiplier" numeric DEFAULT 1.5,
  	"limits_min_order_amount" numeric DEFAULT 20,
  	"limits_max_file_size_mb" numeric DEFAULT 100,
  	"limits_max_dimension_mm" numeric DEFAULT 300,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_top_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_main_menu_megamenu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "navigation_main_menu_megamenu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "navigation_main_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"has_megamenu" boolean DEFAULT false,
  	"banner_id" integer
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_megamenu_banner_banner_image_id_media_id_fk" FOREIGN KEY ("megamenu_banner_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs" ADD CONSTRAINT "products_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_download_files" ADD CONSTRAINT "products_download_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_download_files" ADD CONSTRAINT "products_download_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_badges" ADD CONSTRAINT "products_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_catalog_id_catalogs_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."catalogs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants" ADD CONSTRAINT "_products_v_version_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs" ADD CONSTRAINT "_products_v_version_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_images" ADD CONSTRAINT "_products_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_images" ADD CONSTRAINT "_products_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_download_files" ADD CONSTRAINT "_products_v_version_download_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_download_files" ADD CONSTRAINT "_products_v_version_download_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_badges" ADD CONSTRAINT "_products_v_version_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_catalog_id_catalogs_id_fk" FOREIGN KEY ("version_catalog_id") REFERENCES "public"."catalogs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_brand_id_brands_id_fk" FOREIGN KEY ("version_brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_carousel_slides" ADD CONSTRAINT "categories_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_catalog_id_catalogs_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."catalogs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "print_orders_files" ADD CONSTRAINT "print_orders_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "print_orders_files" ADD CONSTRAINT "print_orders_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."print_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "print_orders" ADD CONSTRAINT "print_orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "print_orders" ADD CONSTRAINT "print_orders_production_card_id_production_cards_id_fk" FOREIGN KEY ("production_card_id") REFERENCES "public"."production_cards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "production_cards_source_files" ADD CONSTRAINT "production_cards_source_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "production_cards_source_files" ADD CONSTRAINT "production_cards_source_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."production_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "production_cards_gcode_files" ADD CONSTRAINT "production_cards_gcode_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "production_cards_gcode_files" ADD CONSTRAINT "production_cards_gcode_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."production_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "production_cards" ADD CONSTRAINT "production_cards_printer_id_printers_id_fk" FOREIGN KEY ("printer_id") REFERENCES "public"."printers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "production_cards" ADD CONSTRAINT "production_cards_material_used_id_farm_materials_id_fk" FOREIGN KEY ("material_used_id") REFERENCES "public"."farm_materials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "printers" ADD CONSTRAINT "printers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "farm_materials" ADD CONSTRAINT "farm_materials_linked_product_id_products_id_fk" FOREIGN KEY ("linked_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engineer_projects_source_files" ADD CONSTRAINT "engineer_projects_source_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engineer_projects_source_files" ADD CONSTRAINT "engineer_projects_source_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_projects_renders" ADD CONSTRAINT "engineer_projects_renders_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engineer_projects_renders" ADD CONSTRAINT "engineer_projects_renders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_projects" ADD CONSTRAINT "engineer_projects_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engineer_projects" ADD CONSTRAINT "engineer_projects_linked_product_id_products_id_fk" FOREIGN KEY ("linked_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_engineer_projects_v_version_source_files" ADD CONSTRAINT "_engineer_projects_v_version_source_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_engineer_projects_v_version_source_files" ADD CONSTRAINT "_engineer_projects_v_version_source_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_engineer_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_engineer_projects_v_version_renders" ADD CONSTRAINT "_engineer_projects_v_version_renders_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_engineer_projects_v_version_renders" ADD CONSTRAINT "_engineer_projects_v_version_renders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_engineer_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_engineer_projects_v" ADD CONSTRAINT "_engineer_projects_v_parent_id_engineer_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."engineer_projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_engineer_projects_v" ADD CONSTRAINT "_engineer_projects_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_engineer_projects_v" ADD CONSTRAINT "_engineer_projects_v_version_linked_product_id_products_id_fk" FOREIGN KEY ("version_linked_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engineer_tasks_reference_files" ADD CONSTRAINT "engineer_tasks_reference_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engineer_tasks_reference_files" ADD CONSTRAINT "engineer_tasks_reference_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_tasks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_tasks_responses" ADD CONSTRAINT "engineer_tasks_responses_engineer_id_users_id_fk" FOREIGN KEY ("engineer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engineer_tasks_responses" ADD CONSTRAINT "engineer_tasks_responses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_tasks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_tasks" ADD CONSTRAINT "engineer_tasks_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engineer_tasks" ADD CONSTRAINT "engineer_tasks_assigned_engineer_id_users_id_fk" FOREIGN KEY ("assigned_engineer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "b2b_clients" ADD CONSTRAINT "b2b_clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "b2b_pricelists" ADD CONSTRAINT "b2b_pricelists_client_id_b2b_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."b2b_clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "b2b_pricelists_rels" ADD CONSTRAINT "b2b_pricelists_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."b2b_pricelists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "b2b_pricelists_rels" ADD CONSTRAINT "b2b_pricelists_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "b2b_pricelists_rels" ADD CONSTRAINT "b2b_pricelists_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "b2b_applications" ADD CONSTRAINT "b2b_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotions_rels" ADD CONSTRAINT "promotions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promotions_rels" ADD CONSTRAINT "promotions_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "banners" ADD CONSTRAINT "banners_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "slicer_profiles" ADD CONSTRAINT "slicer_profiles_profile_file_id_media_id_fk" FOREIGN KEY ("profile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_permissions" ADD CONSTRAINT "users_permissions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "callback_requests" ADD CONSTRAINT "callback_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_catalogs_fk" FOREIGN KEY ("catalogs_id") REFERENCES "public"."catalogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_print_orders_fk" FOREIGN KEY ("print_orders_id") REFERENCES "public"."print_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_production_cards_fk" FOREIGN KEY ("production_cards_id") REFERENCES "public"."production_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_printers_fk" FOREIGN KEY ("printers_id") REFERENCES "public"."printers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_farm_materials_fk" FOREIGN KEY ("farm_materials_id") REFERENCES "public"."farm_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_engineer_projects_fk" FOREIGN KEY ("engineer_projects_id") REFERENCES "public"."engineer_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_engineer_tasks_fk" FOREIGN KEY ("engineer_tasks_id") REFERENCES "public"."engineer_tasks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_b2b_clients_fk" FOREIGN KEY ("b2b_clients_id") REFERENCES "public"."b2b_clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_b2b_pricelists_fk" FOREIGN KEY ("b2b_pricelists_id") REFERENCES "public"."b2b_pricelists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_b2b_applications_fk" FOREIGN KEY ("b2b_applications_id") REFERENCES "public"."b2b_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_banners_fk" FOREIGN KEY ("banners_id") REFERENCES "public"."banners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_slicer_profiles_fk" FOREIGN KEY ("slicer_profiles_id") REFERENCES "public"."slicer_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_callback_requests_fk" FOREIGN KEY ("callback_requests_id") REFERENCES "public"."callback_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_managers" ADD CONSTRAINT "site_settings_managers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_managers" ADD CONSTRAINT "site_settings_managers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_general_logo_id_media_id_fk" FOREIGN KEY ("general_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "calculator_settings_materials_colors" ADD CONSTRAINT "calculator_settings_materials_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calculator_settings_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "calculator_settings_materials" ADD CONSTRAINT "calculator_settings_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calculator_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_top_bar" ADD CONSTRAINT "navigation_top_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_menu_megamenu_columns_links" ADD CONSTRAINT "navigation_main_menu_megamenu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main_menu_megamenu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_menu_megamenu_columns" ADD CONSTRAINT "navigation_main_menu_megamenu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_menu" ADD CONSTRAINT "navigation_main_menu_banner_id_banners_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_main_menu" ADD CONSTRAINT "navigation_main_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "catalogs_slug_idx" ON "catalogs" USING btree ("slug");
  CREATE INDEX "catalogs_image_idx" ON "catalogs" USING btree ("image_id");
  CREATE INDEX "catalogs_megamenu_banner_megamenu_banner_banner_image_idx" ON "catalogs" USING btree ("megamenu_banner_banner_image_id");
  CREATE INDEX "catalogs_updated_at_idx" ON "catalogs" USING btree ("updated_at");
  CREATE INDEX "catalogs_created_at_idx" ON "catalogs" USING btree ("created_at");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE INDEX "products_specs_order_idx" ON "products_specs" USING btree ("_order");
  CREATE INDEX "products_specs_parent_id_idx" ON "products_specs" USING btree ("_parent_id");
  CREATE INDEX "products_images_order_idx" ON "products_images" USING btree ("_order");
  CREATE INDEX "products_images_parent_id_idx" ON "products_images" USING btree ("_parent_id");
  CREATE INDEX "products_images_image_idx" ON "products_images" USING btree ("image_id");
  CREATE INDEX "products_download_files_order_idx" ON "products_download_files" USING btree ("_order");
  CREATE INDEX "products_download_files_parent_id_idx" ON "products_download_files" USING btree ("_parent_id");
  CREATE INDEX "products_download_files_file_idx" ON "products_download_files" USING btree ("file_id");
  CREATE INDEX "products_badges_order_idx" ON "products_badges" USING btree ("order");
  CREATE INDEX "products_badges_parent_idx" ON "products_badges" USING btree ("parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_catalog_idx" ON "products" USING btree ("catalog_id");
  CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_categories_id_idx" ON "products_rels" USING btree ("categories_id");
  CREATE INDEX "_products_v_version_variants_order_idx" ON "_products_v_version_variants" USING btree ("_order");
  CREATE INDEX "_products_v_version_variants_parent_id_idx" ON "_products_v_version_variants" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_specs_order_idx" ON "_products_v_version_specs" USING btree ("_order");
  CREATE INDEX "_products_v_version_specs_parent_id_idx" ON "_products_v_version_specs" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_images_order_idx" ON "_products_v_version_images" USING btree ("_order");
  CREATE INDEX "_products_v_version_images_parent_id_idx" ON "_products_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_images_image_idx" ON "_products_v_version_images" USING btree ("image_id");
  CREATE INDEX "_products_v_version_download_files_order_idx" ON "_products_v_version_download_files" USING btree ("_order");
  CREATE INDEX "_products_v_version_download_files_parent_id_idx" ON "_products_v_version_download_files" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_download_files_file_idx" ON "_products_v_version_download_files" USING btree ("file_id");
  CREATE INDEX "_products_v_version_badges_order_idx" ON "_products_v_version_badges" USING btree ("order");
  CREATE INDEX "_products_v_version_badges_parent_idx" ON "_products_v_version_badges" USING btree ("parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_catalog_idx" ON "_products_v" USING btree ("version_catalog_id");
  CREATE INDEX "_products_v_version_version_brand_idx" ON "_products_v" USING btree ("version_brand_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_categories_id_idx" ON "_products_v_rels" USING btree ("categories_id");
  CREATE INDEX "categories_carousel_slides_order_idx" ON "categories_carousel_slides" USING btree ("_order");
  CREATE INDEX "categories_carousel_slides_parent_id_idx" ON "categories_carousel_slides" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_catalog_idx" ON "categories" USING btree ("catalog_id");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "reviews_product_idx" ON "reviews" USING btree ("product_id");
  CREATE INDEX "reviews_author_idx" ON "reviews" USING btree ("author_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE INDEX "print_orders_files_order_idx" ON "print_orders_files" USING btree ("_order");
  CREATE INDEX "print_orders_files_parent_id_idx" ON "print_orders_files" USING btree ("_parent_id");
  CREATE INDEX "print_orders_files_file_idx" ON "print_orders_files" USING btree ("file_id");
  CREATE UNIQUE INDEX "print_orders_order_number_idx" ON "print_orders" USING btree ("order_number");
  CREATE INDEX "print_orders_customer_idx" ON "print_orders" USING btree ("customer_id");
  CREATE INDEX "print_orders_production_card_idx" ON "print_orders" USING btree ("production_card_id");
  CREATE INDEX "print_orders_updated_at_idx" ON "print_orders" USING btree ("updated_at");
  CREATE INDEX "print_orders_created_at_idx" ON "print_orders" USING btree ("created_at");
  CREATE INDEX "production_cards_source_files_order_idx" ON "production_cards_source_files" USING btree ("_order");
  CREATE INDEX "production_cards_source_files_parent_id_idx" ON "production_cards_source_files" USING btree ("_parent_id");
  CREATE INDEX "production_cards_source_files_file_idx" ON "production_cards_source_files" USING btree ("file_id");
  CREATE INDEX "production_cards_gcode_files_order_idx" ON "production_cards_gcode_files" USING btree ("_order");
  CREATE INDEX "production_cards_gcode_files_parent_id_idx" ON "production_cards_gcode_files" USING btree ("_parent_id");
  CREATE INDEX "production_cards_gcode_files_file_idx" ON "production_cards_gcode_files" USING btree ("file_id");
  CREATE INDEX "production_cards_printer_idx" ON "production_cards" USING btree ("printer_id");
  CREATE INDEX "production_cards_material_used_idx" ON "production_cards" USING btree ("material_used_id");
  CREATE INDEX "production_cards_updated_at_idx" ON "production_cards" USING btree ("updated_at");
  CREATE INDEX "production_cards_created_at_idx" ON "production_cards" USING btree ("created_at");
  CREATE INDEX "printers_photo_idx" ON "printers" USING btree ("photo_id");
  CREATE INDEX "printers_updated_at_idx" ON "printers" USING btree ("updated_at");
  CREATE INDEX "printers_created_at_idx" ON "printers" USING btree ("created_at");
  CREATE INDEX "farm_materials_linked_product_idx" ON "farm_materials" USING btree ("linked_product_id");
  CREATE INDEX "farm_materials_updated_at_idx" ON "farm_materials" USING btree ("updated_at");
  CREATE INDEX "farm_materials_created_at_idx" ON "farm_materials" USING btree ("created_at");
  CREATE INDEX "engineer_projects_source_files_order_idx" ON "engineer_projects_source_files" USING btree ("_order");
  CREATE INDEX "engineer_projects_source_files_parent_id_idx" ON "engineer_projects_source_files" USING btree ("_parent_id");
  CREATE INDEX "engineer_projects_source_files_file_idx" ON "engineer_projects_source_files" USING btree ("file_id");
  CREATE INDEX "engineer_projects_renders_order_idx" ON "engineer_projects_renders" USING btree ("_order");
  CREATE INDEX "engineer_projects_renders_parent_id_idx" ON "engineer_projects_renders" USING btree ("_parent_id");
  CREATE INDEX "engineer_projects_renders_image_idx" ON "engineer_projects_renders" USING btree ("image_id");
  CREATE UNIQUE INDEX "engineer_projects_slug_idx" ON "engineer_projects" USING btree ("slug");
  CREATE INDEX "engineer_projects_author_idx" ON "engineer_projects" USING btree ("author_id");
  CREATE INDEX "engineer_projects_linked_product_idx" ON "engineer_projects" USING btree ("linked_product_id");
  CREATE INDEX "engineer_projects_updated_at_idx" ON "engineer_projects" USING btree ("updated_at");
  CREATE INDEX "engineer_projects_created_at_idx" ON "engineer_projects" USING btree ("created_at");
  CREATE INDEX "engineer_projects__status_idx" ON "engineer_projects" USING btree ("_status");
  CREATE INDEX "_engineer_projects_v_version_source_files_order_idx" ON "_engineer_projects_v_version_source_files" USING btree ("_order");
  CREATE INDEX "_engineer_projects_v_version_source_files_parent_id_idx" ON "_engineer_projects_v_version_source_files" USING btree ("_parent_id");
  CREATE INDEX "_engineer_projects_v_version_source_files_file_idx" ON "_engineer_projects_v_version_source_files" USING btree ("file_id");
  CREATE INDEX "_engineer_projects_v_version_renders_order_idx" ON "_engineer_projects_v_version_renders" USING btree ("_order");
  CREATE INDEX "_engineer_projects_v_version_renders_parent_id_idx" ON "_engineer_projects_v_version_renders" USING btree ("_parent_id");
  CREATE INDEX "_engineer_projects_v_version_renders_image_idx" ON "_engineer_projects_v_version_renders" USING btree ("image_id");
  CREATE INDEX "_engineer_projects_v_parent_idx" ON "_engineer_projects_v" USING btree ("parent_id");
  CREATE INDEX "_engineer_projects_v_version_version_slug_idx" ON "_engineer_projects_v" USING btree ("version_slug");
  CREATE INDEX "_engineer_projects_v_version_version_author_idx" ON "_engineer_projects_v" USING btree ("version_author_id");
  CREATE INDEX "_engineer_projects_v_version_version_linked_product_idx" ON "_engineer_projects_v" USING btree ("version_linked_product_id");
  CREATE INDEX "_engineer_projects_v_version_version_updated_at_idx" ON "_engineer_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_engineer_projects_v_version_version_created_at_idx" ON "_engineer_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_engineer_projects_v_version_version__status_idx" ON "_engineer_projects_v" USING btree ("version__status");
  CREATE INDEX "_engineer_projects_v_created_at_idx" ON "_engineer_projects_v" USING btree ("created_at");
  CREATE INDEX "_engineer_projects_v_updated_at_idx" ON "_engineer_projects_v" USING btree ("updated_at");
  CREATE INDEX "_engineer_projects_v_latest_idx" ON "_engineer_projects_v" USING btree ("latest");
  CREATE INDEX "engineer_tasks_reference_files_order_idx" ON "engineer_tasks_reference_files" USING btree ("_order");
  CREATE INDEX "engineer_tasks_reference_files_parent_id_idx" ON "engineer_tasks_reference_files" USING btree ("_parent_id");
  CREATE INDEX "engineer_tasks_reference_files_file_idx" ON "engineer_tasks_reference_files" USING btree ("file_id");
  CREATE INDEX "engineer_tasks_responses_order_idx" ON "engineer_tasks_responses" USING btree ("_order");
  CREATE INDEX "engineer_tasks_responses_parent_id_idx" ON "engineer_tasks_responses" USING btree ("_parent_id");
  CREATE INDEX "engineer_tasks_responses_engineer_idx" ON "engineer_tasks_responses" USING btree ("engineer_id");
  CREATE INDEX "engineer_tasks_client_idx" ON "engineer_tasks" USING btree ("client_id");
  CREATE INDEX "engineer_tasks_assigned_engineer_idx" ON "engineer_tasks" USING btree ("assigned_engineer_id");
  CREATE INDEX "engineer_tasks_updated_at_idx" ON "engineer_tasks" USING btree ("updated_at");
  CREATE INDEX "engineer_tasks_created_at_idx" ON "engineer_tasks" USING btree ("created_at");
  CREATE INDEX "b2b_clients_user_idx" ON "b2b_clients" USING btree ("user_id");
  CREATE INDEX "b2b_clients_updated_at_idx" ON "b2b_clients" USING btree ("updated_at");
  CREATE INDEX "b2b_clients_created_at_idx" ON "b2b_clients" USING btree ("created_at");
  CREATE INDEX "b2b_pricelists_client_idx" ON "b2b_pricelists" USING btree ("client_id");
  CREATE INDEX "b2b_pricelists_updated_at_idx" ON "b2b_pricelists" USING btree ("updated_at");
  CREATE INDEX "b2b_pricelists_created_at_idx" ON "b2b_pricelists" USING btree ("created_at");
  CREATE INDEX "b2b_pricelists_rels_order_idx" ON "b2b_pricelists_rels" USING btree ("order");
  CREATE INDEX "b2b_pricelists_rels_parent_idx" ON "b2b_pricelists_rels" USING btree ("parent_id");
  CREATE INDEX "b2b_pricelists_rels_path_idx" ON "b2b_pricelists_rels" USING btree ("path");
  CREATE INDEX "b2b_pricelists_rels_categories_id_idx" ON "b2b_pricelists_rels" USING btree ("categories_id");
  CREATE INDEX "b2b_pricelists_rels_brands_id_idx" ON "b2b_pricelists_rels" USING btree ("brands_id");
  CREATE INDEX "b2b_applications_user_idx" ON "b2b_applications" USING btree ("user_id");
  CREATE INDEX "b2b_applications_updated_at_idx" ON "b2b_applications" USING btree ("updated_at");
  CREATE INDEX "b2b_applications_created_at_idx" ON "b2b_applications" USING btree ("created_at");
  CREATE INDEX "promotions_updated_at_idx" ON "promotions" USING btree ("updated_at");
  CREATE INDEX "promotions_created_at_idx" ON "promotions" USING btree ("created_at");
  CREATE INDEX "promotions_rels_order_idx" ON "promotions_rels" USING btree ("order");
  CREATE INDEX "promotions_rels_parent_idx" ON "promotions_rels" USING btree ("parent_id");
  CREATE INDEX "promotions_rels_path_idx" ON "promotions_rels" USING btree ("path");
  CREATE INDEX "promotions_rels_categories_id_idx" ON "promotions_rels" USING btree ("categories_id");
  CREATE INDEX "banners_image_idx" ON "banners" USING btree ("image_id");
  CREATE INDEX "banners_updated_at_idx" ON "banners" USING btree ("updated_at");
  CREATE INDEX "banners_created_at_idx" ON "banners" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_cover_image_idx" ON "articles" USING btree ("cover_image_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_cover_image_idx" ON "_articles_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "slicer_profiles_profile_file_idx" ON "slicer_profiles" USING btree ("profile_file_id");
  CREATE INDEX "slicer_profiles_updated_at_idx" ON "slicer_profiles" USING btree ("updated_at");
  CREATE INDEX "slicer_profiles_created_at_idx" ON "slicer_profiles" USING btree ("created_at");
  CREATE INDEX "users_permissions_order_idx" ON "users_permissions" USING btree ("order");
  CREATE INDEX "users_permissions_parent_idx" ON "users_permissions" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "callback_requests_user_idx" ON "callback_requests" USING btree ("user_id");
  CREATE INDEX "callback_requests_updated_at_idx" ON "callback_requests" USING btree ("updated_at");
  CREATE INDEX "callback_requests_created_at_idx" ON "callback_requests" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_catalogs_id_idx" ON "payload_locked_documents_rels" USING btree ("catalogs_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_print_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("print_orders_id");
  CREATE INDEX "payload_locked_documents_rels_production_cards_id_idx" ON "payload_locked_documents_rels" USING btree ("production_cards_id");
  CREATE INDEX "payload_locked_documents_rels_printers_id_idx" ON "payload_locked_documents_rels" USING btree ("printers_id");
  CREATE INDEX "payload_locked_documents_rels_farm_materials_id_idx" ON "payload_locked_documents_rels" USING btree ("farm_materials_id");
  CREATE INDEX "payload_locked_documents_rels_engineer_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("engineer_projects_id");
  CREATE INDEX "payload_locked_documents_rels_engineer_tasks_id_idx" ON "payload_locked_documents_rels" USING btree ("engineer_tasks_id");
  CREATE INDEX "payload_locked_documents_rels_b2b_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("b2b_clients_id");
  CREATE INDEX "payload_locked_documents_rels_b2b_pricelists_id_idx" ON "payload_locked_documents_rels" USING btree ("b2b_pricelists_id");
  CREATE INDEX "payload_locked_documents_rels_b2b_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("b2b_applications_id");
  CREATE INDEX "payload_locked_documents_rels_promotions_id_idx" ON "payload_locked_documents_rels" USING btree ("promotions_id");
  CREATE INDEX "payload_locked_documents_rels_banners_id_idx" ON "payload_locked_documents_rels" USING btree ("banners_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_slicer_profiles_id_idx" ON "payload_locked_documents_rels" USING btree ("slicer_profiles_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_callback_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("callback_requests_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_managers_order_idx" ON "site_settings_managers" USING btree ("_order");
  CREATE INDEX "site_settings_managers_parent_id_idx" ON "site_settings_managers" USING btree ("_parent_id");
  CREATE INDEX "site_settings_managers_photo_idx" ON "site_settings_managers" USING btree ("photo_id");
  CREATE INDEX "site_settings_general_general_logo_idx" ON "site_settings" USING btree ("general_logo_id");
  CREATE INDEX "calculator_settings_materials_colors_order_idx" ON "calculator_settings_materials_colors" USING btree ("_order");
  CREATE INDEX "calculator_settings_materials_colors_parent_id_idx" ON "calculator_settings_materials_colors" USING btree ("_parent_id");
  CREATE INDEX "calculator_settings_materials_order_idx" ON "calculator_settings_materials" USING btree ("_order");
  CREATE INDEX "calculator_settings_materials_parent_id_idx" ON "calculator_settings_materials" USING btree ("_parent_id");
  CREATE INDEX "navigation_top_bar_order_idx" ON "navigation_top_bar" USING btree ("_order");
  CREATE INDEX "navigation_top_bar_parent_id_idx" ON "navigation_top_bar" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_menu_megamenu_columns_links_order_idx" ON "navigation_main_menu_megamenu_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_main_menu_megamenu_columns_links_parent_id_idx" ON "navigation_main_menu_megamenu_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_menu_megamenu_columns_order_idx" ON "navigation_main_menu_megamenu_columns" USING btree ("_order");
  CREATE INDEX "navigation_main_menu_megamenu_columns_parent_id_idx" ON "navigation_main_menu_megamenu_columns" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_menu_order_idx" ON "navigation_main_menu" USING btree ("_order");
  CREATE INDEX "navigation_main_menu_parent_id_idx" ON "navigation_main_menu" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_menu_banner_idx" ON "navigation_main_menu" USING btree ("banner_id");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "catalogs" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products_specs" CASCADE;
  DROP TABLE "products_images" CASCADE;
  DROP TABLE "products_download_files" CASCADE;
  DROP TABLE "products_badges" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_variants" CASCADE;
  DROP TABLE "_products_v_version_specs" CASCADE;
  DROP TABLE "_products_v_version_images" CASCADE;
  DROP TABLE "_products_v_version_download_files" CASCADE;
  DROP TABLE "_products_v_version_badges" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "categories_carousel_slides" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "print_orders_files" CASCADE;
  DROP TABLE "print_orders" CASCADE;
  DROP TABLE "production_cards_source_files" CASCADE;
  DROP TABLE "production_cards_gcode_files" CASCADE;
  DROP TABLE "production_cards" CASCADE;
  DROP TABLE "printers" CASCADE;
  DROP TABLE "farm_materials" CASCADE;
  DROP TABLE "engineer_projects_source_files" CASCADE;
  DROP TABLE "engineer_projects_renders" CASCADE;
  DROP TABLE "engineer_projects" CASCADE;
  DROP TABLE "_engineer_projects_v_version_source_files" CASCADE;
  DROP TABLE "_engineer_projects_v_version_renders" CASCADE;
  DROP TABLE "_engineer_projects_v" CASCADE;
  DROP TABLE "engineer_tasks_reference_files" CASCADE;
  DROP TABLE "engineer_tasks_responses" CASCADE;
  DROP TABLE "engineer_tasks" CASCADE;
  DROP TABLE "b2b_clients" CASCADE;
  DROP TABLE "b2b_pricelists" CASCADE;
  DROP TABLE "b2b_pricelists_rels" CASCADE;
  DROP TABLE "b2b_applications" CASCADE;
  DROP TABLE "promotions" CASCADE;
  DROP TABLE "promotions_rels" CASCADE;
  DROP TABLE "banners" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "slicer_profiles" CASCADE;
  DROP TABLE "users_permissions" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "callback_requests" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_managers" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "calculator_settings_materials_colors" CASCADE;
  DROP TABLE "calculator_settings_materials" CASCADE;
  DROP TABLE "calculator_settings" CASCADE;
  DROP TABLE "navigation_top_bar" CASCADE;
  DROP TABLE "navigation_main_menu_megamenu_columns_links" CASCADE;
  DROP TABLE "navigation_main_menu_megamenu_columns" CASCADE;
  DROP TABLE "navigation_main_menu" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."enum_catalogs_icon";
  DROP TYPE "public"."enum_products_badges";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_badges";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_delivery_method";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_print_orders_status";
  DROP TYPE "public"."enum_production_cards_status";
  DROP TYPE "public"."enum_printers_type";
  DROP TYPE "public"."enum_printers_status";
  DROP TYPE "public"."enum_farm_materials_material_type";
  DROP TYPE "public"."enum_engineer_projects_status";
  DROP TYPE "public"."enum_engineer_projects_license_type";
  DROP TYPE "public"."enum__engineer_projects_v_version_status";
  DROP TYPE "public"."enum__engineer_projects_v_version_license_type";
  DROP TYPE "public"."enum_engineer_tasks_status";
  DROP TYPE "public"."enum_b2b_clients_discount_column";
  DROP TYPE "public"."enum_b2b_pricelists_format";
  DROP TYPE "public"."enum_b2b_pricelists_price_rule";
  DROP TYPE "public"."enum_b2b_applications_status";
  DROP TYPE "public"."enum_promotions_type";
  DROP TYPE "public"."enum_banners_position";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_articles_article_category";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_article_category";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_slicer_profiles_slicer";
  DROP TYPE "public"."enum_users_permissions";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_callback_requests_status";`)
}
