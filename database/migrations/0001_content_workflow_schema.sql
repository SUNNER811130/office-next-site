CREATE SCHEMA office_next_content;

CREATE TABLE office_next_content.sites (
  site_key text NOT NULL,
  environment text NOT NULL,
  schema_version smallint NOT NULL DEFAULT 1,
  published_content jsonb NOT NULL,
  published_revision integer NOT NULL,
  published_updated_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT sites_pkey PRIMARY KEY (site_key, environment),
  CONSTRAINT sites_site_key_valid CHECK (
    length(btrim(site_key)) BETWEEN 1 AND 128
  ),
  CONSTRAINT sites_environment_valid CHECK (
    environment IN ('development', 'test', 'preview', 'production')
  ),
  CONSTRAINT sites_schema_version_positive CHECK (schema_version >= 1),
  CONSTRAINT sites_published_content_object CHECK (
    jsonb_typeof(published_content) = 'object'
  ),
  CONSTRAINT sites_published_revision_positive CHECK (published_revision >= 1)
);

CREATE TABLE office_next_content.scope_versions (
  site_key text NOT NULL,
  environment text NOT NULL,
  scope text NOT NULL,
  published_revision integer NOT NULL,
  published_updated_at timestamptz NOT NULL,
  CONSTRAINT scope_versions_pkey PRIMARY KEY (site_key, environment, scope),
  CONSTRAINT scope_versions_site_fkey FOREIGN KEY (site_key, environment)
    REFERENCES office_next_content.sites (site_key, environment)
    ON DELETE CASCADE,
  CONSTRAINT scope_versions_scope_valid CHECK (
    scope IN (
      'brand',
      'home',
      'founder',
      'services',
      'cases',
      'testimonials',
      'faq',
      'contact',
      'social',
      'design',
      'pageBlocks.home',
      'pageBlocks.services',
      'pageBlocks.about',
      'pageBlocks.contact'
    )
  ),
  CONSTRAINT scope_versions_published_revision_positive CHECK (
    published_revision >= 1
  )
);

CREATE TABLE office_next_content.drafts (
  site_key text NOT NULL,
  environment text NOT NULL,
  scope text NOT NULL,
  value jsonb NOT NULL,
  revision integer NOT NULL,
  based_on_published_revision integer NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT drafts_pkey PRIMARY KEY (site_key, environment, scope),
  CONSTRAINT drafts_scope_version_fkey FOREIGN KEY (site_key, environment, scope)
    REFERENCES office_next_content.scope_versions (site_key, environment, scope)
    ON DELETE CASCADE,
  CONSTRAINT drafts_scope_valid CHECK (
    scope IN (
      'brand',
      'home',
      'founder',
      'services',
      'cases',
      'testimonials',
      'faq',
      'contact',
      'social',
      'design',
      'pageBlocks.home',
      'pageBlocks.services',
      'pageBlocks.about',
      'pageBlocks.contact'
    )
  ),
  CONSTRAINT drafts_revision_positive CHECK (revision >= 1),
  CONSTRAINT drafts_based_on_published_revision_positive CHECK (
    based_on_published_revision >= 1
  )
);
