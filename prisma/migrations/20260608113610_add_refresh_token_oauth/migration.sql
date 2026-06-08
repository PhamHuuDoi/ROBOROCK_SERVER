/*
  Warnings:

  - A unique constraint covering the columns `[receipt_id,product_id]` on the table `import_receipt_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[request_id,product_id]` on the table `transfer_request_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branch_id,name]` on the table `warehouses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "provider_uid" VARCHAR(255) NOT NULL,
    "access_token" VARCHAR(512),
    "refresh_token" VARCHAR(512),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "device_info" VARCHAR(100),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_oauth_user" ON "oauth_accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_provider_uid_key" ON "oauth_accounts"("provider", "provider_uid");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_user" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "import_receipt_items_receipt_id_product_id_key" ON "import_receipt_items"("receipt_id", "product_id");

-- CreateIndex
CREATE INDEX "idx_profiles_user" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_request_items_request_id_product_id_key" ON "transfer_request_items"("request_id", "product_id");

-- CreateIndex
CREATE INDEX "idx_warehouses_branch" ON "warehouses"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_branch_id_name_key" ON "warehouses"("branch_id", "name");

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
