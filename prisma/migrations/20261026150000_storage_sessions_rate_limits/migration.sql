-- Session revocation: bumped on password/role/active changes and logout.
ALTER TABLE "User" ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;

-- Uploads now live in Supabase Storage instead of the (read-only, ephemeral)
-- Vercel filesystem.
ALTER TABLE "Media" ADD COLUMN "storagePath" TEXT;
ALTER TABLE "ContactInquiry" RENAME COLUMN "attachmentUrl" TO "attachmentPath";

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");

-- CreateIndex
CREATE INDEX "BlogPost_status_publishDate_idx" ON "BlogPost"("status", "publishDate");

-- CreateIndex
CREATE INDEX "ContactInquiry_createdAt_idx" ON "ContactInquiry"("createdAt");

-- Same lockdown as 20261026120000_lock_down_data_api: these tables are only
-- reached through Prisma, never through the Supabase Data API.
ALTER TABLE "NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;

-- Storage buckets. Limits are enforced by Supabase itself, independent of the
-- app's own validation. Both are accessed server-side with the secret key, so
-- no storage.objects policies are needed (and none are granted to anon).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('media', 'media', true, 10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
  ('inquiry-attachments', 'inquiry-attachments', false, 4194304,
    ARRAY[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ])
ON CONFLICT (id) DO NOTHING;
