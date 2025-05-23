-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('cremation', 'bathing', 'funeral', 'grooming', 'custom_vehicles', 'other_care');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED', 'IN_PROGRESS', 'REJECTED', 'NO_SHOW', 'BLOCKED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RESERVATION_CREATED', 'RESERVATION_UPDATED', 'RESERVATION_CANCELED', 'RESERVATION_ACCEPTED', 'RESERVATION_REJECTED', 'RESERVATION_COMPLETED', 'RESERVATION_REMINDER', 'REVIEW_REQUESTED', 'REVIEW_RECEIVED', 'PAYMENT_COMPLETED', 'PAYMENT_FAILED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('READY', 'IN_PROGRESS', 'WAITING_FOR_DEPOSIT', 'DONE', 'CANCELED', 'ABORTED', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'VIRTUAL_ACCOUNT', 'ACCOUNT_TRANSFER', 'MOBILE_PAYMENT', 'GIFT_CARD', 'EASY_PAY');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('WEEKLY', 'BREAK');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "phone" TEXT,
    "image" TEXT,
    "address" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Pet" (
    "pet_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "age" INTEGER,
    "weight" DOUBLE PRECISION,
    "photo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("pet_id")
);

-- CreateTable
CREATE TABLE "services" (
    "service_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "admin_id" UUID NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "reservation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "service_id" UUID,
    "business_id" UUID NOT NULL,
    "pet_id" UUID,
    "status" "ReservationStatus" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "is_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "title" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "NotificationType" NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "business_schedules" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "schedule_data" JSONB,
    "day_of_week" TEXT,
    "type" "ScheduleType",
    "start_time" TEXT,
    "end_time" TEXT,
    "reason" TEXT,
    "is_day_off" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_services" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "reservations_business_id_start_time_end_time_is_available_idx" ON "reservations"("business_id", "start_time", "end_time", "is_available");

-- CreateIndex
CREATE INDEX "reservations_user_id_start_time_idx" ON "reservations"("user_id", "start_time");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "business_schedules_business_id_idx" ON "business_schedules"("business_id");

-- CreateIndex
CREATE INDEX "business_services_business_id_idx" ON "business_services"("business_id");

-- CreateIndex
CREATE INDEX "business_services_service_id_idx" ON "business_services"("service_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_services_business_id_service_id_key" ON "business_services"("business_id", "service_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("pet_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_schedules" ADD CONSTRAINT "business_schedules_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_services" ADD CONSTRAINT "business_services_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_services" ADD CONSTRAINT "business_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;
