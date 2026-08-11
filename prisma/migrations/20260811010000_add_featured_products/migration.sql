ALTER TABLE "Product"
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "featuredPosition" INTEGER;

CREATE INDEX "Product_featured_featuredPosition_idx"
ON "Product"("featured", "featuredPosition");
