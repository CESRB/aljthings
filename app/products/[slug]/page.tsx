import { ArrowLeft, Check, MapPin, ShieldCheck, Truck } from "lucide-react";
import { fulfillmentLabel } from "@/lib/catalog";
import { contentImage, contentProductToListing, contentText, loadContent } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";

async function managedListings() {
  const snapshot = await loadContent(undefined, "force-cache");
  return (snapshot.storefront?.products || [])
    .filter((item) => item.availability !== "hidden")
    .map(contentProductToListing);
}

export async function generateStaticParams() {
  return (await managedListings()).map((item) => ({ slug: item.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const snapshot = await loadContent(undefined, "force-cache");
  const content = snapshot.content || {};
  const managed = (snapshot.storefront?.products || []).filter((product) => product.availability !== "hidden").map(contentProductToListing);
  const item = managed.find((candidate) => candidate.slug === slug);
  if (!item) notFound();
  const canBuy = item.status === "available";

  return (
    <main className="productPage">
      <div className="topline"><span>{contentText(content, "announcement.primary", "New listings added regularly")}</span><span>{contentText(content, "announcement.secondary", "Local pickup · Shipping on select items")}</span></div>
      <header>
        <Link href="/" className="wordmark"><img src={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").url} alt={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").alt || "AJ's Closet & Things"} /></Link>
        <Link className="backLink" href="/#finds"><ArrowLeft /> All listings</Link>
      </header>
      <div className="productLayout">
        <section className="gallery">
          <div className="productHeroArt art photo">
            <img src={item.image} alt={item.name} /><span>{item.condition}</span>
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
      <footer><Link href="/" className="wordmark light"><img src={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").url} alt={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").alt || "AJ's Closet & Things"} /></Link><p>{contentText(content, "footer.tagline", "Secondhand goods · Local pickup and select shipping")}</p><small><a href="https://tech.cesrb.com">CESRB//BUILT</a></small></footer>
    </main>
  );
}
