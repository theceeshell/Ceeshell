-- Editable site labels (see src/lib/cms/site-texts.ts), analytics and WhatsApp settings.
ALTER TABLE "SiteSettings" ADD COLUMN "googleAnalyticsId" TEXT,
ADD COLUMN "texts" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "whatsappButton" BOOLEAN NOT NULL DEFAULT false;

-- Show/hide items on the public site without deleting them.
ALTER TABLE "Service" ADD COLUMN "visible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "PortfolioProject" ADD COLUMN "visible" BOOLEAN NOT NULL DEFAULT true;

-- Industries become fully manageable in the admin.
ALTER TABLE "Industry" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "seoDescription" TEXT,
ADD COLUMN "seoTitle" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "visible" BOOLEAN NOT NULL DEFAULT true;

-- Privacy Policy and Terms move from code into editable CMS pages, each with
-- one "document" section. The contact email comes from Site Settings.
INSERT INTO "Page" ("id", "slug", "title", "description", "createdAt", "updatedAt")
VALUES (gen_random_uuid()::text, 'privacy-policy', 'Privacy Policy', 'How Cee-Shell collects, uses and protects information submitted through this website.', now(), now())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "Section" ("id", "pageId", "type", "name", "order", "enabled", "content", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, p."id", 'document', 'Policy text', 0, true,
  jsonb_build_object(
    'heading', 'Privacy Policy',
    'intro', 'Last updated: January 2026',
    'html', replace('<h2>Information We Collect</h2><p>When you submit a project inquiry, subscribe to our newsletter, or otherwise contact Cee-Shell, we collect the information you provide directly — such as your name, company, email address, phone number and project details.</p><h2>How We Use Information</h2><p>Information submitted through this site is used solely to respond to inquiries, prepare proposals, deliver newsletter content you''ve opted into, and improve our services. We do not sell or rent your information to third parties.</p><h2>Cookies &amp; Analytics</h2><p>This site may use basic analytics cookies to understand aggregate visitor behaviour and improve site performance. No personally identifying analytics data is sold or shared with third parties for advertising purposes.</p><h2>Data Retention</h2><p>Project inquiry information is retained for as long as necessary to respond to your request and, if a project proceeds, for the duration of our working relationship and applicable record-keeping requirements.</p><h2>Your Rights</h2><p>You may request access to, correction of, or deletion of your personal information at any time by contacting __EMAIL__.</p><h2>Contact</h2><p>Questions about this policy can be directed to __EMAIL__.</p>', '__EMAIL__',
      coalesce((SELECT '<a href="mailto:' || "email" || '">' || "email" || '</a>' FROM "SiteSettings" WHERE "id" = 'singleton'), 'us'))
  ),
  now(), now()
FROM "Page" p
WHERE p."slug" = 'privacy-policy' AND NOT EXISTS (SELECT 1 FROM "Section" s WHERE s."pageId" = p."id");

INSERT INTO "Page" ("id", "slug", "title", "description", "createdAt", "updatedAt")
VALUES (gen_random_uuid()::text, 'terms', 'Terms of Service', 'Terms governing the use of the Cee-Shell website and engagement of Cee-Shell''s creative services.', now(), now())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "Section" ("id", "pageId", "type", "name", "order", "enabled", "content", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, p."id", 'document', 'Terms text', 0, true,
  jsonb_build_object(
    'heading', 'Terms of Service',
    'intro', 'Last updated: January 2026',
    'html', replace('<h2>Use of This Website</h2><p>This website is provided by Cee-Shell for the purpose of showcasing our work and enabling prospective clients to submit project inquiries. Content on this site may not be reproduced or used for commercial purposes without written permission.</p><h2>Project Engagements</h2><p>Submitting an inquiry through this website does not constitute a binding agreement. All project engagements are governed by a separate signed proposal or contract outlining scope, deliverables, timeline and payment terms.</p><h2>Intellectual Property</h2><p>Portfolio work displayed on this site remains the intellectual property of Cee-Shell and the respective clients unless otherwise agreed in writing. Ownership of deliverables from a specific engagement is defined in that engagement''s contract.</p><h2>Limitation of Liability</h2><p>Cee-Shell makes reasonable efforts to keep this website accurate and available but does not guarantee uninterrupted access and is not liable for damages arising from use of this site.</p><h2>Changes to These Terms</h2><p>These terms may be updated periodically. Continued use of this website after changes are posted constitutes acceptance of the revised terms.</p><h2>Contact</h2><p>Questions about these terms can be directed to __EMAIL__.</p>', '__EMAIL__',
      coalesce((SELECT '<a href="mailto:' || "email" || '">' || "email" || '</a>' FROM "SiteSettings" WHERE "id" = 'singleton'), 'us'))
  ),
  now(), now()
FROM "Page" p
WHERE p."slug" = 'terms' AND NOT EXISTS (SELECT 1 FROM "Section" s WHERE s."pageId" = p."id");
