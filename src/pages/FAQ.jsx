import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import InfoPageLayout from '@/components/info/InfoPageLayout';

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Browse our products, add what you need to your cart, and tap the cart button to check out. Your order details are sent straight to us on WhatsApp so we can confirm availability and delivery.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We currently confirm orders and arrange payment directly over WhatsApp after checkout. We\'ll walk you through the available payment options (bank transfer, etc.) when we confirm your order.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery times depend on your location within Nigeria. We\'ll give you an accurate estimate when we confirm your order on WhatsApp.',
  },
  {
    q: 'Are your products safe to use?',
    a: 'Our herbal products are prepared from natural ingredients. Always check the ingredients and warnings listed on each product page, and consult a healthcare professional before use if you are pregnant, nursing, on medication, or managing a medical condition.',
  },
  {
    q: 'Can I return a product?',
    a: 'See our Shipping & Returns page for full details on returns and refunds.',
  },
  {
    q: 'How can I contact Pascaqueen directly?',
    a: 'The fastest way is WhatsApp at +234 706 282 3828. You can also email support@pascaqueen.shop.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-emerald-100 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium text-gray-900">{q}</span>
        <ChevronDown className={`w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-5 pb-4 text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function FAQ() {
  return (
    <InfoPageLayout title="Frequently Asked Questions" subtitle="Everything you need to know before you order.">
      <div className="space-y-3 not-prose">
        {FAQS.map((item) => (
          <FAQItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>
    </InfoPageLayout>
  );
}
