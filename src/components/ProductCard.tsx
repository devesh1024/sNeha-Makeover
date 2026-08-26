import type { Product } from "@/lib/content";
import { whatsappLink } from "@/config/site";

function priceLabel(product: Product) {
  if (product.sale_price != null) {
    return (
      <span className="flex items-baseline gap-2">
        <span className="text-foreground">₹{Number(product.sale_price).toLocaleString("en-IN")}</span>
        <span className="text-xs text-muted-foreground line-through">
          ₹{Number(product.price ?? 0).toLocaleString("en-IN")}
        </span>
      </span>
    );
  }
  if (product.price != null) {
    return <span>₹{Number(product.price).toLocaleString("en-IN")}</span>;
  }
  return <span className="text-muted-foreground">Contact us</span>;
}

export function ProductCard({
  product,
  onView,
}: {
  product: Product;
  onView: (product: Product) => void;
}) {
  return (
    <article className="group flex flex-col border border-border bg-card transition-colors duration-500 hover:border-gold/60">
      <div className="aspect-4/5 overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Image coming soon
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow text-gold-muted">{product.category}</p>
        <h3 className="mt-3 text-xl">{product.name}</h3>
        {product.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">{priceLabel(product)}</span>
          <span
            className={`border px-2 py-1 text-[0.65rem] uppercase tracking-[0.14em] ${
              product.availability === "Out of Stock"
                ? "border-border text-muted-foreground"
                : "border-gold/50 text-gold-dark"
            }`}
          >
            {product.availability}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={() => onView(product)} className="btn btn-outline-dark flex-1">
            View Details
          </button>
          <a
            href={whatsappLink(`Hi, I would like to know more about "${product.name}" available at sNeha's Makeover.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark flex-1"
          >
            Inquire
          </a>
        </div>
      </div>
    </article>
  );
}
