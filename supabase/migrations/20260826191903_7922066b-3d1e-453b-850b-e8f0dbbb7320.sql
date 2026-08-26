CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Other',
  description text,
  price numeric(10,2),
  sale_price numeric(10,2),
  image_url text,
  additional_images text[] NOT NULL DEFAULT '{}',
  availability text NOT NULL DEFAULT 'Available',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  image_url text NOT NULL,
  alt_text text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  inquiry_type text NOT NULL DEFAULT 'General',
  service_or_product text,
  preferred_date date,
  message text,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'sNeha''s Makeover',
  tagline text,
  phone text,
  whatsapp text,
  email text,
  address text,
  instagram text,
  maps_url text,
  opening_hours text,
  logo_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT ALL ON public.gallery_items TO service_role;
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published products are public" ON public.products FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Published gallery items are public" ON public.gallery_items FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Site settings are public" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (tagline, phone, whatsapp, email, address, instagram, maps_url, opening_hours, logo_url)
VALUES ('Khud Se Milo – Naye Look Ke Saath.', '87801 72428', '918780172428', 'Your email here', 'Your address here', 'https://instagram.com/sneha_makeover1111', 'Your Google Maps link here', 'Your opening hours here', '/__l5e/assets-v1/0304e6ab-36d3-40b8-a974-654cebf06479/logo.png');

INSERT INTO public.gallery_items (title, category, image_url, alt_text, featured, display_order) VALUES
('Bridal Makeover Session', 'Makeup', '/__l5e/assets-v1/e7af159f-67cb-4ec9-9ac9-3b72d24be1d4/work-1.jpg', 'Makeup, hairstyling and bridal looks created at sNeha''s Makeover', true, 1),
('Bridal & Festive Portfolio', 'Makeup', '/__l5e/assets-v1/c2bee63a-a24b-4f67-b345-fd982adff4d2/work-2.jpg', 'Collection of bridal, haldi and party makeup looks by sNeha''s Makeover', true, 2),
('Traditional Bridal Look', 'Makeup', '/__l5e/assets-v1/1be01970-73aa-4309-b893-1730689fbe2a/work-3.jpg', 'Bride in a red lehenga with kundan jewellery, styled by sNeha''s Makeover', true, 3),
('Nail Art Training Certificate', 'Other', '/__l5e/assets-v1/d9134dae-ac96-4f47-9988-2d1423a6769e/work-4.jpg', 'Neha Solanki receiving a nail art course completion certificate', false, 4),
('Studio Service Menu', 'Other', '/__l5e/assets-v1/cd0e4ecd-1366-4c54-9309-248f35c81cf2/poster.jpg', 'sNeha''s Makeover studio poster listing makeup, skin, hair and nail services', false, 5);