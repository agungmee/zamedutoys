-- Add pre-order fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_preorder BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS preorder_days INTEGER DEFAULT 7;
