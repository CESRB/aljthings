"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Plus,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import {
  contentProductToListing,
  contentMediaUrl,
  contentImage,
  contentText,
  loadContent,
  loadGallery,
  type ContentCollection,
  type ContentPost,
  type GalleryItem,
} from "@/lib/content";
import { addCommerceItem, removeCommerceItem } from "@/lib/commerce";
import {
  categories as previewCategories,
  fulfillmentLabel,
  listings as previewItems,
  type Listing,
} from "@/lib/catalog";
export default function Home() {
  const [cat, setCat] = useState("Everything"),
    [query, setQuery] = useState(""),
    [bag, setBag] = useState<Record<string, { commerceItemId?: string }>>({}),
    [open, setOpen] = useState(false),
    [items, setItems] = useState<Listing[]>(previewItems),
    [content, setContent] = useState<Record<string, unknown>>({}),
    [collections, setCollections] = useState<ContentCollection[]>([]),
    [posts, setPosts] = useState<ContentPost[]>([]),
    [gallery, setGallery] = useState<GalleryItem[]>([]),
    [commerceError, setCommerceError] = useState(""),
    [usingPreview, setUsingPreview] = useState(true),
    [contentState, setContentState] = useState<"loading" | "ready" | "error">("loading");
  const cats = useMemo(
    () => usingPreview ? previewCategories : ["Everything", ...Array.from(new Set(items.map((item) => item.category)))],
    [items, usingPreview],
  );
  const shown = useMemo(
    () =>
      items.filter(
        (i) =>
          (cat === "Everything" || i.category === cat) &&
          i.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [cat, query, items],
  );
  const count = Object.keys(bag).length,
    total = Object.keys(bag).reduce(
      (sum, id) => sum + (items.find((i) => String(i.id) === id)?.price || 0),
      0,
    );
  const add = async (id: string) => {
    const item = items.find((candidate) => String(candidate.id) === id);
    if (!item || bag[id]) return;
    setCommerceError("");
    if (item.commerce) {
      try {
        const result = await addCommerceItem(item);
        setBag((current) => ({ ...current, [id]: { commerceItemId: result.itemId } }));
      } catch {
        setCommerceError("Checkout is still being activated for this store. Please try again shortly.");
        setOpen(true);
        return;
      }
    } else {
      setBag((current) => ({ ...current, [id]: {} }));
    }
    setOpen(true);
  };
  const remove = async (id: string) => {
    const commerceItemId = bag[id]?.commerceItemId;
    if (commerceItemId) {
      try { await removeCommerceItem(commerceItemId); } catch { setCommerceError("That item could not be removed. Please refresh and try again."); return; }
    }
    setBag((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };
  useEffect(() => {
    const controller = new AbortController();
    const requestedAdd = new URL(window.location.href).searchParams.get("add");
    loadContent(controller.signal)
      .then((snapshot) => {
        setContent(snapshot.content || {});
        setCollections(snapshot.collections || []);
        setPosts(snapshot.blog || []);
        const products=(snapshot.storefront?.products || []).filter((item) => item.availability !== "hidden");
        const resolvedItems = products.length ? products.map(contentProductToListing) : previewItems;
        if (products.length) {
          setItems(resolvedItems);
          setUsingPreview(false);
        }
        const requestedItem = requestedAdd ? resolvedItems.find((candidate) => String(candidate.id) === requestedAdd || candidate.slug === requestedAdd) : undefined;
        if (requestedItem) {
          if (requestedItem.commerce) {
            void addCommerceItem(requestedItem).then((result) => {
              setBag((current) => ({ ...current, [String(requestedItem.id)]: { commerceItemId: result.itemId } }));
              setOpen(true);
            }).catch(() => { setCommerceError("Checkout is still being activated for this store. Please try again shortly."); setOpen(true); });
          } else {
            setBag((current) => ({ ...current, [String(requestedItem.id)]: {} }));
            setOpen(true);
          }
        }
        setContentState("ready");
      })
      .catch((error) => {
        if (error?.name !== "AbortError") setContentState("error");
      });
    loadGallery(controller.signal).then(setGallery).catch(() => setGallery([]));
    return () => controller.abort();
  }, []);
  return (
    <main>
      <div className="topline">
        <span>{contentText(content, "announcement.primary", "New listings added regularly")}</span>
        <span>{contentText(content, "announcement.secondary", "Local pickup · Shipping on select items")}</span>
      </div>
      <header>
        <a href="#top" className="wordmark">
          <img src={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").url} alt={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").alt || "AJ's Closet & Things"} />
        </a>
        <nav>
          <a href="#finds">{contentText(content, "navigation.shop", "The finds")}</a>
          <a href="#how">{contentText(content, "navigation.how", "How it works")}</a>
          <a href="#about">{contentText(content, "navigation.about", "Buying info")}</a>
        </nav>
        <button className="bagBtn" onClick={() => setOpen(true)}>
          <ShoppingBag />
          <span>Bag</span>
          <b>{count}</b>
        </button>
      </header>
      <section className="hero" id="top">
        <div className="heroMark"><img src={contentImage(content, "brand.monogram", "/brand/aj-monogram-spaced.png").url} alt={contentImage(content, "brand.monogram", "/brand/aj-monogram-spaced.png").alt} /></div>
        <div className="heroCopy">
          <p className="kicker">{contentText(content, "home.hero.kicker", "AJ’s Closet & Things")}</p>
          <h1>
            {contentText(content, "home.hero.heading", "Shop current")}
            <br />
            <em>{contentText(content, "home.hero.emphasis", "listings.")}</em>
          </h1>
          <p>
            {contentText(content, "home.hero.subheading", "Browse a changing selection of quality secondhand goods, available for shipping or local pickup.")}
          </p>
          <a href="#finds">
            {contentText(content, "home.hero.cta", "Browse current listings")} <ArrowRight />
          </a>
        </div>
      </section>
      <section className="intro">
        <strong>{contentText(content, "home.intro.heading", "Each listing is for one unique item.")}</strong>
        <p>{contentText(content, "home.intro.body", "Real photos, clear condition notes, straightforward prices.")}</p>
      </section>
      {!!gallery.length && (
        <section className="managedSection" id="gallery">
          <p className="kicker purple">{contentText(content, "gallery.kicker", "Gallery")}</p>
          <h2>{contentText(content, "gallery.heading", "Recent finds")}</h2>
          <div className="managedGallery">
            {gallery.map((item) => <figure key={item.id}><img src={item.url} alt={item.alt_text} /><figcaption><strong>{item.title}</strong>{item.caption && <span>{item.caption}</span>}</figcaption></figure>)}
          </div>
        </section>
      )}
      <section className="market" id="finds">
        <div className="marketHead">
          <div>
            <p className="kicker purple">{contentText(content, "products.kicker", "Current listings")}</p>
            <h2>{contentText(content, "products.heading", "Shop all")}</h2>
          </div>
          <label>
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={contentText(content, "products.search_placeholder", "Search the collection")}
            />
          </label>
        </div>
        <div className="cats">
          {cats.map((c) => (
            <button
              className={cat === c ? "active" : ""}
              onClick={() => setCat(c)}
              key={c}
            >
              {c}
            </button>
          ))}
        </div>
        {contentState === "error" && <p className="sample">Current listings could not load. Please refresh the page.</p>}
        <div className="items">
          {shown.map((i) => (
            <article className={"listing " + i.status} key={i.id}>
              <a className="artLink" href={"/products/" + i.slug}>
                <div className={`art ${usingPreview ? i.art : "photo"}`}>
                  {!usingPreview && <img src={i.image} alt={i.name} />}
                  <span>{i.condition}</span>
                  {i.status !== "available" && (
                    <b className="status">{i.status}</b>
                  )}
                </div>
              </a>
              <div className="meta">
                <p>{i.category}</p>
                <h3><a href={"/products/" + i.slug}>{i.name}</a></h3>
                <div>
                  <span className="method">
                    {i.fulfillment === "pickup" ? <MapPin /> : <Truck />}
                    {fulfillmentLabel(i.fulfillment)}
                  </span>
                  <strong>${i.price}</strong>
                </div>
              </div>
              <button
                disabled={i.status !== "available" || !!bag[String(i.id)]}
                onClick={() => add(String(i.id))}
              >
                {bag[String(i.id)]
                  ? "In bag"
                  : i.status === "available"
                    ? "Add to bag"
                    : i.status}{" "}
                {i.status === "available" && !bag[String(i.id)] && <Plus />}
              </button>
            </article>
          ))}
        </div>
        {usingPreview && <p className="sample">Sample inventory for the preview. Published CESRB Content replaces these items automatically.</p>}
        {contentState === "ready" && !shown.length && (
          <p className="nothing">
            Nothing available matches that search right now.
          </p>
        )}
      </section>
      {collections.map((collection) => collection.items?.length ? (
        <section className="managedSection" key={collection.key}>
          <p className="kicker gold">{collection.name}</p>
          {collection.description && <p className="managedIntro">{collection.description}</p>}
          <div className="managedCards">
            {collection.items.map((item) => <article key={item.id}>{Object.entries(item.values).map(([key, value]) => typeof value === "string" ? <p key={key}><strong>{key.replaceAll("_", " ")}</strong><span>{value}</span></p> : null)}</article>)}
          </div>
        </section>
      ) : null)}
      {!!posts.length && (
        <section className="managedSection">
          <p className="kicker purple">{contentText(content, "blog.heading", "Updates")}</p>
          <div className="managedCards">{posts.map((post) => <article key={post.id}>{post.featured_image && <img src={contentMediaUrl(post.featured_image.url)} alt={post.featured_image.alt_text} />}<h3>{post.title}</h3>{post.excerpt && <p>{post.excerpt}</p>}</article>)}</div>
        </section>
      )}
      <section className="how" id="how">
        <div>
          <p className="kicker gold">{contentText(content, "how.kicker", "How shopping works")}</p>
          <h2>
            {contentText(content, "how.line_one", "Find it.")}
            <br />
            {contentText(content, "how.line_two", "Review it.")}
            <br />
            {contentText(content, "how.line_three", "Make it yours.")}
          </h2>
        </div>
        <ol>
          <li>
            <b>01</b>
            <div>
              <h3>{contentText(content, "how.step_one.heading", "Review the listing")}</h3>
              <p>{contentText(content, "how.step_one.body", "Photos, condition, measurements, and any flaws are shown up front.")}</p>
            </div>
          </li>
          <li>
            <b>02</b>
            <div>
              <h3>{contentText(content, "how.step_two.heading", "Choose shipping or pickup")}</h3>
              <p>{contentText(content, "how.step_two.body", "Shippable items can go to checkout. Larger finds stay local.")}</p>
            </div>
          </li>
          <li>
            <b>03</b>
            <div>
              <h3>{contentText(content, "how.step_three.heading", "Available while listed")}</h3>
              <p>{contentText(content, "how.step_three.body", "Most listings are single items. Sold listings are removed from the shop.")}</p>
            </div>
          </li>
        </ol>
      </section>
      <section className="about" id="about">
        <p className="kicker purple">{contentText(content, "about.kicker", "Buying information")}</p>
        <div>
          <h2>
            {contentText(content, "about.heading_one", "Clear details")}
            <br />
            {contentText(content, "about.heading_two", "before you buy.")}
          </h2>
          <p>
            {contentText(content, "about.body", "Listings include current photos, measurements when relevant, condition details, and any known flaws. Shippable items show delivery options at checkout. Furniture and other oversized items are marked for local pickup.")}
          </p>
        </div>
      </section>
      <footer>
        <a href="#top" className="wordmark light">
          <img src={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").url} alt={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").alt || "AJ's Closet & Things"} />
        </a>
        <p>{contentText(content, "footer.tagline", "Secondhand goods · Local pickup and select shipping")}</p>
        <small>
          {contentText(content, "footer.status", "Store preview")} · <a href="https://tech.cesrb.com">CESRB//BUILT</a>
        </small>
      </footer>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className={open ? "drawer open" : "drawer"} aria-hidden={!open}>
        <div className="drawerHead">
          <div>
            <p className="kicker purple">Shopping bag</p>
            <h2>Your bag</h2>
          </div>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <div className="bagBody">
          {!count ? (
            <div className="emptyBag">
              <ShoppingBag />
              <h3>Your bag is empty</h3>
              <p>Browse the latest available items.</p>
            </div>
          ) : (
            Object.keys(bag).map((id) => {
              const i = items.find((x) => String(x.id) === id)!;
              return (
                <div className="bagItem" key={id}>
                  <div className="thumb photo">
                    <img src={i.image} alt="" />
                  </div>
                  <div>
                    <h3>{i.name}</h3>
                    <p>{fulfillmentLabel(i.fulfillment)}</p>
                    <button className="removeItem" onClick={() => remove(String(i.id))}>
                      Remove
                    </button>
                  </div>
                  <strong>${i.price}</strong>
                </div>
              );
            })
          )}
        </div>
        {!!count && (
          <div className="checkout">
            <div>
              <span>Subtotal</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            {commerceError && <p className="checkoutError" role="alert">{commerceError}</p>}
            <p>{usingPreview ? "Checkout is unavailable for sample inventory." : "Secure checkout opens after shipping or pickup details are confirmed."}</p>
            <a className={usingPreview ? "checkoutButton disabled" : "checkoutButton"} href={usingPreview ? undefined : "/checkout"} aria-disabled={usingPreview}>Continue to checkout</a>
          </div>
        )}
      </aside>
    </main>
  );
}
