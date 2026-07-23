-- Blog enhancements: category chips, featured/popular, updated_at
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE blog_posts
SET category = COALESCE(NULLIF(TRIM(category), ''), 'Crypto')
WHERE category IS NULL OR TRIM(category) = '';

CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
  ON blog_posts (is_published, published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured
  ON blog_posts (is_featured, published_at DESC NULLS LAST)
  WHERE is_published = true;
