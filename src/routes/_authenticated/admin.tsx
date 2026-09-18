import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  adminGalleryQuery,
  adminOffersQuery,
  adminProductsQuery,
  removeStoredImage,
  slugify,
  uploadImage,
  type AdminProduct,
} from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel | sNeha's Makeover" },
      { name: "description", content: "Manage gallery photos, offer banners and the product catalogue." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Panel | sNeha's Makeover" },
      { property: "og:description", content: "Manage gallery, offers and products." },
    ],
  }),
  component: AdminPage,
});

const CATEGORIES = ["Makeup", "Hair", "Nails", "Skin", "Other"];
const PRODUCT_CATEGORIES = ["Makeup", "Hair", "Nails", "Skin", "Other"];
const TABS = ["Gallery", "Offers", "Products"] as const;
type Tab = (typeof TABS)[number];

const inputClass =
  "mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold";

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("Gallery");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return setIsAdmin(false);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(Boolean(data));
    })();
  }, []);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isAdmin === null) {
    return <p className="px-5 py-40 text-center text-sm text-muted-foreground">Checking access…</p>;
  }

  if (!isAdmin) {
    return (
      <section className="px-5 py-40 text-center">
        <h1 className="font-serif text-3xl">No admin access</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          This account is not on the studio admin list.
        </p>
        <button onClick={signOut} className="btn btn-dark mt-8">
          Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="px-5 pb-24 pt-32 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-gold">Studio</p>
            <h1 className="mt-3 font-serif text-4xl">Admin panel</h1>
          </div>
          <button onClick={signOut} className="btn btn-outline-dark">
            Sign out
          </button>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-xs uppercase tracking-[0.18em] transition-colors ${
                tab === t ? "border-b-2 border-gold text-foreground" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {tab === "Gallery" ? <GalleryAdmin /> : null}
          {tab === "Offers" ? <OffersAdmin /> : null}
          {tab === "Products" ? <ProductsAdmin /> : null}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Gallery --------------------------------- */

function GalleryAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminGalleryQuery);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]!);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const items = useMemo(() => {
    const all = data ?? [];
    return filter === "All" ? all : all.filter((i) => i.category === filter);
  }, [data, filter]);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    await queryClient.invalidateQueries({ queryKey: ["gallery"] });
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { url } = await uploadImage("gallery", file);
      const { error: err } = await supabase.from("gallery_items").insert({
        title: title || file.name,
        category,
        image_url: url,
        alt_text: title || null,
      });
      if (err) throw err;
      setTitle("");
      setFile(null);
      (document.getElementById("gallery-file") as HTMLInputElement | null)?.value &&
        ((document.getElementById("gallery-file") as HTMLInputElement).value = "");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string, imageUrl: string) {
    if (!window.confirm("Delete this photo?")) return;
    const { error: err } = await supabase.from("gallery_items").delete().eq("id", id);
    if (err) return setError(err.message);
    await removeStoredImage(imageUrl);
    await refresh();
  }

  return (
    <div className="space-y-12">
      <form onSubmit={onUpload} className="grid gap-4 border border-border p-6 sm:grid-cols-3">
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Photo</label>
          <input
            id="gallery-file"
            type="file"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-3">
          {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
          <button disabled={busy} className="btn btn-dark disabled:opacity-60">
            {busy ? "Uploading…" : "Upload photo"}
          </button>
        </div>
      </form>

      <div>
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`border px-4 py-2 text-xs uppercase tracking-[0.18em] ${
                filter === c ? "border-gold text-gold" : "border-border text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading photos…</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="border border-border">
                <img src={item.image_url} alt={item.title} className="aspect-[3/4] w-full object-cover" />
                <div className="p-3">
                  <p className="truncate text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                  <button
                    onClick={() => onDelete(item.id, item.image_url)}
                    className="mt-3 text-xs uppercase tracking-[0.18em] text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No photos in this category yet.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- Offers ---------------------------------- */

function OffersAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminOffersQuery);
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin", "offers"] });
    await queryClient.invalidateQueries({ queryKey: ["offers"] });
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { url } = await uploadImage("offers", file);
      const { error: err } = await supabase.from("offers").insert({
        title: title || "Special Offer",
        image_url: url,
        link_url: linkUrl || null,
        active: true,
      });
      if (err) throw err;
      setTitle("");
      setLinkUrl("");
      setFile(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    const { error: err } = await supabase.from("offers").update({ active }).eq("id", id);
    if (err) return setError(err.message);
    await refresh();
  }

  async function onDelete(id: string, imageUrl: string) {
    if (!window.confirm("Delete this offer banner?")) return;
    const { error: err } = await supabase.from("offers").delete().eq("id", id);
    if (err) return setError(err.message);
    await removeStoredImage(imageUrl);
    await refresh();
  }

  return (
    <div className="space-y-12">
      <form onSubmit={onUpload} className="grid gap-4 border border-border p-6 sm:grid-cols-3">
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Link (optional)
          </label>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Banner image (portrait)
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-3">
          {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
          <button disabled={busy} className="btn btn-dark disabled:opacity-60">
            {busy ? "Uploading…" : "Upload offer"}
          </button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading offers…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(data ?? []).map((offer) => (
            <div key={offer.id} className="border border-border">
              <img src={offer.image_url} alt={offer.title} className="aspect-[3/4] w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-sm">{offer.title}</p>
                <p className="text-xs text-muted-foreground">
                  {offer.active ? "Showing to visitors" : "Hidden"}
                </p>
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => toggleActive(offer.id, !offer.active)}
                    className="text-xs uppercase tracking-[0.18em] text-gold-dark hover:underline"
                  >
                    {offer.active ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => onDelete(offer.id, offer.image_url)}
                    className="text-xs uppercase tracking-[0.18em] text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No offer banners yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Products --------------------------------- */

type ProductForm = {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: string;
  sale_price: string;
  availability: string;
  image_url: string;
  featured: boolean;
  published: boolean;
};

const emptyProduct: ProductForm = {
  name: "",
  category: PRODUCT_CATEGORIES[0]!,
  description: "",
  price: "",
  sale_price: "",
  availability: "Available",
  image_url: "",
  featured: false,
  published: true,
};

function ProductsAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminProductsQuery);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    await queryClient.invalidateQueries({ queryKey: ["products"] });
  }

  function edit(product: AdminProduct) {
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description ?? "",
      price: product.price != null ? String(product.price) : "",
      sale_price: product.sale_price != null ? String(product.sale_price) : "",
      availability: product.availability,
      image_url: product.image_url ?? "",
      featured: product.featured,
      published: product.published,
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      let imageUrl = form.image_url;
      if (file) {
        const uploaded = await uploadImage("products", file);
        imageUrl = uploaded.url;
      }
      const payload = {
        name: form.name,
        slug: slugify(form.name) || crypto.randomUUID(),
        category: form.category,
        description: form.description || null,
        price: form.price ? Number(form.price) : null,
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        availability: form.availability,
        image_url: imageUrl || null,
        featured: form.featured,
        published: form.published,
      };

      if (form.id) {
        const { error: err } = await supabase.from("products").update(payload).eq("id", form.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("products").insert(payload);
        if (err) throw err;
      }
      setForm(emptyProduct);
      setFile(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(product: AdminProduct) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    const { error: err } = await supabase.from("products").delete().eq("id", product.id);
    if (err) return setError(err.message);
    await removeStoredImage(product.image_url);
    await refresh();
  }

  return (
    <div className="space-y-12">
      <form onSubmit={onSubmit} className="grid gap-4 border border-border p-6 sm:grid-cols-3">
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Availability
          </label>
          <select
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
            className={inputClass}
          >
            <option>Available</option>
            <option>Out of stock</option>
            <option>On order</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Price</label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Sale price
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.sale_price}
            onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-3">
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-6 sm:col-span-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Visible on website
          </label>
        </div>
        <div className="sm:col-span-3">
          {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}
          <div className="flex gap-3">
            <button disabled={busy} className="btn btn-dark disabled:opacity-60">
              {busy ? "Saving…" : form.id ? "Update product" : "Add product"}
            </button>
            {form.id ? (
              <button
                type="button"
                onClick={() => {
                  setForm(emptyProduct);
                  setFile(null);
                }}
                className="btn btn-outline-dark"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading products…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(data ?? []).map((product) => (
            <div key={product.id} className="border border-border">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  No photo
                </div>
              )}
              <div className="p-3">
                <p className="truncate text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.category} · {product.published ? "Visible" : "Hidden"}
                </p>
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => edit(product)}
                    className="text-xs uppercase tracking-[0.18em] text-gold-dark hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="text-xs uppercase tracking-[0.18em] text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
