"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, MapPin, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { fulfillmentLabel, type Listing } from "@/lib/catalog";
import { contentImage, contentProductToListing, contentText, loadContent } from "@/lib/content";

export default function ProductPage() {
  const [item, setItem] = useState<Listing | null>(null);
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    const slug = new URL(window.location.href).searchParams.get("slug");
    loadContent(controller.signal)
      .then((snapshot) => {
        setContent(snapshot.content || {});
        const listing = (snapshot.storefront?.products || [])
          .filter((product) => product.availability !== "hidden")
          .map(contentProductToListing)
          .find((candidate) => candidate.slug === slug);
        setItem(listing || null);
        setState(listing ? "ready" : "missing");
      })
      .catch((error) => {
        if (error?.name !== "AbortError") setState("error");
      });
    return () => controller.abort();
  }, []);

  const canBuy = item?.status === "available";

  return (
    <main className="productPage">
      <div className="topline"><span>{contentText(content, "announcement.primary", "New listings added regularly")}</span><span>{contentText(content, "announcement.secondary", "Local pickup · Shipping on select items")}</span></div>
      <header>
        <Link href="/" className="wordmark"><img src={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").url} alt={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").alt || "AJ's Closet & Things"} /></Link>
        <Link className="backLink" href="/#finds"><ArrowLeft /> All listings</Link>
      </header>
      {state === "loading" && <p className="nothing" role="status">Loading product…</p>}
      {state === "error" && <p className="nothing" role="alert">This product is temporarily unavailable. Please try again shortly.</p>}
      {state === "missing" && <p className="nothing" role="alert">This product is no longer available. <Link href="/#finds">Browse current listings.</Link></p>}
      {state === "ready" && item && (
        <div className="productLayout">
          <section className="gallery">
            <div className={"productHeroArt art" + (item.image ? " photo" : "")}>
              {item.image && <img src={item.image} alt={item.name} />}<span>{item.condition}</span>
              {item.status !== "available" && <b className="status">{item.status}</b>}
            </div>
          </section>
          <section className="productDetails">
            <p className="kicker purple">{item.category}</p><h1>{item.name}</h1>
            <div className="priceLine"><strong>${item.price}</strong><span className={"stock " + item.status}>{item.status}</span></div>
            <p className="description">{item.description}</p>
            <div className="fulfillmentCard">
              {item.fulfillment === "pickup" ? <MapPin /> : <Truck />}
              <div><b>{fulfillmentLabel(item.fulfillment)}</b><span>{item.fulfillment === "pickup" ? "Pickup details provided after purchase." : "Final options and cost shown at checkout."}</span></div>
            </div>
            <ul className="detailList">{item.details.map((detail) => <li key={detail}><Check />{detail}</li>)}</ul>
            {canBuy ? <a className="buyButton" href={`/?add=${item.id}#finds`}>Add to bag</a> : <button className="buyButton" disabled>{item.status}</button>}
            <p className="buyerNote"><ShieldCheck /> Each listing includes current photos and clear condition details.</p>
          </section>
        </div>
      )}
      <footer><Link href="/" className="wordmark light"><img src={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").url} alt={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").alt || "AJ's Closet & Things"} /></Link><p>{contentText(content, "footer.tagline", "Secondhand goods · Local pickup and select shipping")}</p><small><a href="https://tech.cesrb.com">CESRB//BUILT</a></small></footer>
    </main>
  );
}
