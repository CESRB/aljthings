"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Plus,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import {
  contentMediaUrl,
  contentText,
  loadContent,
  type ContentProduct,
} from "@/lib/content";
export default function Home() {
  const [cat, setCat] = useState("Everything"),
    [query, setQuery] = useState(""),
    [bag, setBag] = useState<Record<string, boolean>>({}),
    [open, setOpen] = useState(false),
    [items, setItems] = useState<ContentProduct[]>([]),
    [content, setContent] = useState<Record<string, unknown>>({}),
    [contentState, setContentState] = useState<"loading" | "ready" | "error">("loading");
  const cats = useMemo(
    () => ["Everything", ...Array.from(new Set(items.map((item) => item.category).filter(Boolean))) as string[]],
    [items],
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
      (sum, id) => sum + (items.find((i) => i.id === id)?.price_cents || 0) / 100,
      0,
    );
  const add = (id: string) => {
    setBag((current) => ({ ...current, [id]: true }));
    setOpen(true);
  };
  const remove = (id: string) =>
    setBag((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  useEffect(() => {
    const controller = new AbortController();
    loadContent(controller.signal)
      .then((snapshot) => {
        setContent(snapshot.content || {});
        setItems((snapshot.storefront?.products || []).filter((item) => item.availability !== "hidden"));
        setContentState("ready");
      })
      .catch((error) => {
        if (error?.name !== "AbortError") setContentState("error");
      });
    const url = new URL(window.location.href);
    const id = url.searchParams.get("add");
    if (id) queueMicrotask(() => setBag((current) => ({ ...current, [id]: true })));
    return () => controller.abort();
  }, []);
  return (
    <main>
      <div className="topline">
        <span>New listings added regularly</span>
        <span>Local pickup · Shipping on select items</span>
      </div>
      <header>
        <a href="#top" className="wordmark">
          <img src="/brand/aj-logo-horizontal.png" alt="AJ's Closet & Things" />
        </a>
        <nav>
          <a href="#finds">The finds</a>
          <a href="#how">How it works</a>
          <a href="#about">Buying info</a>
        </nav>
        <button className="bagBtn" onClick={() => setOpen(true)}>
          <ShoppingBag />
          <span>Bag</span>
          <b>{count}</b>
        </button>
      </header>
      <section className="hero" id="top">
        <div className="heroMark"><img src="/brand/aj-monogram-spaced.png" alt="" /></div>
        <div className="heroCopy">
          <p className="kicker">AJ’s Closet & Things</p>
          <h1>
            {contentText(content, "home.hero.heading", "Shop current")}
            <br />
            <em>listings.</em>
          </h1>
          <p>
            {contentText(content, "home.hero.subheading", "Browse a changing selection of quality secondhand goods, available for shipping or local pickup.")}
          </p>
          <a href="#finds">
            Browse current listings <ArrowRight />
          </a>
        </div>
      </section>
      <section className="intro">
        <strong>Each listing is for one unique item.</strong>
        <p>Real photos, clear condition notes, straightforward prices.</p>
      </section>
      <section className="market" id="finds">
        <div className="marketHead">
          <div>
            <p className="kicker purple">Current listings</p>
            <h2>Shop all</h2>
          </div>
          <label>
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the collection"
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
            <article className={"listing " + i.availability} key={i.id}>
              <div className="artLink">
                <div className="art photo">
                  <img src={contentMediaUrl(i.images?.[0]?.url)} alt={i.images?.[0]?.alt_text || i.name} />
                  <span>{i.category || "Current find"}</span>
                  {i.availability !== "available" && (
                    <b className="status">{i.availability}</b>
                  )}
                </div>
              </div>
              <div className="meta">
                <p>{i.category || "Current find"}</p>
                <h3>{i.name}</h3>
                <div>
                  <span className="method">
                    <Truck /> Shipping or pickup details
                  </span>
                  <strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: i.currency || "USD" }).format(i.price_cents / 100)}</strong>
                </div>
              </div>
              <button
                disabled={i.availability !== "available" || !!bag[i.id]}
                onClick={() => add(i.id)}
              >
                {bag[i.id]
                  ? "In bag"
                  : i.availability === "available"
                    ? "Add to bag"
                    : i.availability}{" "}
                {i.availability === "available" && !bag[i.id] && <Plus />}
              </button>
            </article>
          ))}
        </div>
        {contentState === "ready" && !shown.length && (
          <p className="nothing">
            Nothing available matches that search right now.
          </p>
        )}
      </section>
      <section className="how" id="how">
        <div>
          <p className="kicker gold">How shopping works</p>
          <h2>
            Find it.
            <br />
            Review it.
            <br />
            Make it yours.
          </h2>
        </div>
        <ol>
          <li>
            <b>01</b>
            <div>
              <h3>Review the listing</h3>
              <p>
                Photos, condition, measurements, and any flaws are shown up
                front.
              </p>
            </div>
          </li>
          <li>
            <b>02</b>
            <div>
              <h3>Choose shipping or pickup</h3>
              <p>
                Shippable items can go to checkout. Larger finds stay local.
              </p>
            </div>
          </li>
          <li>
            <b>03</b>
            <div>
              <h3>Available while listed</h3>
              <p>
                Most listings are single items. Sold listings are removed from
                the shop.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className="about" id="about">
        <p className="kicker purple">Buying information</p>
        <div>
          <h2>
            Clear details
            <br />
            before you buy.
          </h2>
          <p>
            {contentText(content, "about.body", "Listings include current photos, measurements when relevant, condition details, and any known flaws. Shippable items show delivery options at checkout. Furniture and other oversized items are marked for local pickup.")}
          </p>
        </div>
      </section>
      <footer>
        <a href="#top" className="wordmark light">
          <img src="/brand/aj-logo-horizontal.png" alt="AJ's Closet & Things" />
        </a>
        <p>Secondhand goods · Local pickup and select shipping</p>
        <small>
          Store preview · <a href="https://tech.cesrb.com">CESRB//BUILT</a>
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
              const i = items.find((x) => x.id === id)!;
              return (
                <div className="bagItem" key={id}>
                  <div className="thumb photo">
                    <img src={contentMediaUrl(i.images?.[0]?.url)} alt="" />
                  </div>
                  <div>
                    <h3>{i.name}</h3>
                    <p>Shipping or pickup details</p>
                    <button className="removeItem" onClick={() => remove(i.id)}>
                      Remove
                    </button>
                  </div>
                  <strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: i.currency || "USD" }).format(i.price_cents / 100)}</strong>
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
            <p>
              Checkout activates after the real inventory and fulfillment rules
              are connected.
            </p>
            <button disabled>Checkout coming soon</button>
          </div>
        )}
      </aside>
    </main>
  );
}
