"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { shippingQuotes, startCheckout, type ShippingAddress, type ShippingQuote } from "@/lib/commerce";
import { contentImage, loadContent } from "@/lib/content";

const emptyAddress: ShippingAddress = { recipientName: "", line1: "", city: "", region: "", postalCode: "", countryCode: "US" };

export default function CheckoutPage() {
  const [address, setAddress] = useState(emptyAddress);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [method, setMethod] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const controller = new AbortController();
    loadContent(controller.signal).then((snapshot) => setContent(snapshot.content || {})).catch(() => undefined);
    return () => controller.abort();
  }, []);

  async function quote(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await shippingQuotes({ ...address, recipientName: name });
      setQuotes(result.shipping); setMethod(result.shipping[0]?.methodId || "");
      if (!result.shipping.length) setError("No delivery or pickup option is available yet.");
    } catch { setError("Checkout is still being activated for this store. Please try again shortly."); }
    finally { setBusy(false); }
  }

  async function pay() {
    if (!method || !name.trim() || !email.trim()) { setError("Add your name, email, and a delivery option."); return; }
    setBusy(true); setError("");
    try {
      const result = await startCheckout({ requestId: crypto.randomUUID(), shippingMethodId: method, shippingAddress: { ...address, recipientName: name }, customerName: name, customerEmail: email });
      window.location.assign(result.hostedUrl);
    } catch { setError("Secure payment could not start. Your cart is unchanged; please try again."); setBusy(false); }
  }

  const field = (key: keyof ShippingAddress, label: string, required = true) => (
    <label>{label}<input required={required} value={address[key] || ""} onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))} /></label>
  );

  return <main className="checkoutPage">
    <header><Link href="/" className="wordmark"><img src={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").url} alt={contentImage(content, "brand.header_logo", "/brand/aj-logo-horizontal.png").alt || "AJ's Closet & Things"} /></Link><Link href="/">Back to shop</Link></header>
    <form className="checkoutCard" onSubmit={quote}>
      <p className="kicker purple">Secure checkout</p><h1>Delivery details</h1>
      <div className="checkoutFields"><label>Full name<input required value={name} onChange={(e) => setName(e.target.value)} /></label><label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>{field("line1", "Street address")}{field("line2", "Apartment / suite", false)}{field("city", "City")}{field("region", "State")}{field("postalCode", "ZIP code")}{field("countryCode", "Country")}</div>
      {!quotes.length && <button className="checkoutButton" disabled={busy}>{busy ? "Checking…" : "See delivery options"}</button>}
      {!!quotes.length && <fieldset><legend>Delivery or pickup</legend>{quotes.map((item) => <label className="shippingOption" key={item.methodId}><input type="radio" name="shipping" checked={method === item.methodId} onChange={() => setMethod(item.methodId)} /><span>{item.name}</span><strong>{item.amountMinor ? new Intl.NumberFormat("en-US", { style: "currency", currency: item.currency }).format(item.amountMinor / 100) : "Free"}</strong></label>)}<button type="button" className="checkoutButton" disabled={busy} onClick={pay}>{busy ? "Opening secure payment…" : "Continue to secure payment"}</button></fieldset>}
      {error && <p className="checkoutError" role="alert">{error}</p>}
      <p className="checkoutNotice">Payment is handled securely by CESRB Billing. The shop never stores card details.</p>
    </form>
  </main>;
}
