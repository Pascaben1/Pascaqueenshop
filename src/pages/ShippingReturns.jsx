import React from 'react';
import InfoPageLayout from '@/components/info/InfoPageLayout';

export default function ShippingReturns() {
  return (
    <InfoPageLayout title="Shipping & Returns" subtitle="Last updated: August 2026">
      <h2>Shipping</h2>
      <p>
        Orders are confirmed and coordinated directly over WhatsApp after checkout. Once your
        order is confirmed, we will let you know the estimated delivery time for your location
        and the applicable delivery fee, if any.
      </p>
      <p>
        <em>
          [Business owner: replace this paragraph with your real delivery areas, timeframes,
          and fees — e.g. "Same-day delivery within Calabar, 2–5 business days nationwide."]
        </em>
      </p>

      <h2>Returns & Refunds</h2>
      <p>
        Because our products are consumable herbal goods, we're only able to accept returns
        for items that arrive damaged, incorrect, or defective. If this happens, please contact
        us within 48 hours of delivery with your order details and photos of the item.
      </p>
      <p>
        <em>
          [Business owner: confirm your actual return window and whether refunds are cash,
          bank transfer, or store credit, then replace this note.]
        </em>
      </p>

      <h2>Damaged or Missing Items</h2>
      <p>
        If your order arrives damaged or incomplete, reach out to us immediately on WhatsApp
        at <a href="https://wa.me/2347062823828" target="_blank" rel="noopener noreferrer">+234 706 282 3828</a> or
        email <a href="mailto:support@pascaqueen.shop">support@pascaqueen.shop</a> so we can make it right.
      </p>
    </InfoPageLayout>
  );
}
