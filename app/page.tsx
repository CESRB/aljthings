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
  categories as cats,
  fulfillmentLabel,
  listings as items,
} from "@/lib/catalog";
export default function Home() {
  const [cat, setCat] = useState("Everything"),
    [query, setQuery] = useState(""),
    [bag, setBag] = useState<Record<number, boolean>>({}),
    [open, setOpen] = useState(false);
  const shown = useMemo(
    () =>
      items.filter(
        (i) =>
          (cat === "Everything" || i.category === cat) &&
          i.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [cat, query],
  );
  const count = Object.keys(bag).length,
    total = Object.keys(bag).reduce(
      (sum, id) => sum + items.find((i) => i.id === Number(id))!.price,
      0,
    );
  const add = (id: number) => {
    setBag((current) => ({ ...current, [id]: true }));
    setOpen(true);
  };
  const remove = (id: number) =>
    setBag((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  useEffect(() => {
    const url = new URL(window.location.href);
    const id = Number(url.searchParams.get("add"));
    const item = items.find((candidate) => candidate.id === id);
    if (!item || item.status !== "available") return;
    queueMicrotask(() => {
      setBag((current) => ({ ...current, [id]: true }));
      setOpen(true);
      url.searchParams.delete("add");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    });
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
            Shop current
            <br />
            <em>listings.</em>
          </h1>
          <p>
            Browse a changing selection of quality secondhand goods, available
            for shipping or local pickup.
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
        <p className="sample">
          Sample inventory for the preview. Real items, photos, prices, and
          condition notes will replace these before launch.
        </p>
        <div className="items">
          {shown.map((i) => (
            <article className={"listing " + i.status} key={i.id}>
              <a className="artLink" href={"/products/" + i.slug}>
                <div className="art photo">
                  <img src={i.image} alt={i.name} />
                  <span>{i.condition}</span>
                  {i.status !== "available" && (
                    <b className="status">{i.status}</b>
                  )}
                </div>
              </a>
              <div className="meta">
                <p>{i.category}</p>
                <h3>
                  <a href={"/products/" + i.slug}>{i.name}</a>
                </h3>
                <div>
                  <span className="method">
                    {i.fulfillment === "pickup" ? <MapPin /> : <Truck />}
                    {fulfillmentLabel(i.fulfillment)}
                  </span>
                  <strong>${i.price}</strong>
                </div>
              </div>
              <button
                disabled={i.status !== "available" || !!bag[i.id]}
                onClick={() => add(i.id)}
              >
                {bag[i.id]
                  ? "In bag"
                  : i.status === "available"
                    ? "Add to bag"
                    : i.status}{" "}
                {i.status === "available" && !bag[i.id] && <Plus />}
              </button>
            </article>
          ))}
        </div>
        {!shown.length && (
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
            Listings include current photos, measurements when relevant,
            condition details, and any known flaws. Shippable items show
            delivery options at checkout. Furniture and other oversized items
            are marked for local pickup.
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
              const i = items.find((x) => x.id === Number(id))!;
              return (
                <div className="bagItem" key={id}>
                  <div className="thumb photo">
                    <img src={i.image} alt="" />
                  </div>
                  <div>
                    <h3>{i.name}</h3>
                    <p>{fulfillmentLabel(i.fulfillment)}</p>
                    <button className="removeItem" onClick={() => remove(i.id)}>
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
