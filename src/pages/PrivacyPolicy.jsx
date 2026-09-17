import React from 'react';
import InfoPageLayout from '@/components/info/InfoPageLayout';

export default function PrivacyPolicy() {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="Last updated: August 2026">
      <p>
        Pascaqueen ("we", "us", "our") respects your privacy. This policy explains what
        information we collect through this website and how we use it.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Account information you provide when signing up (email address).</li>
        <li>Order details you submit at checkout (products, quantities, and any message sent via WhatsApp).</li>
        <li>Basic usage data such as pages visited, used to understand how the site is used.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and fulfil your orders.</li>
        <li>To respond to enquiries sent via WhatsApp, email, or the contact form.</li>
        <li>To improve our products and website experience.</li>
      </ul>

      <h2>How We Share Your Information</h2>
      <p>
        We do not sell your personal information. Order details are shared with our team via
        WhatsApp solely to fulfil your order. We use Supabase to securely store account and
        order data.
      </p>

      <h2>Your Choices</h2>
      <p>
        You can request deletion of your account and associated data at any time by contacting
        us at <a href="mailto:support@pascaqueen.shop">support@pascaqueen.shop</a>.
      </p>

      <p>
        <em>
          [Business owner: this is a general-purpose template. Please review with a qualified
          professional to ensure it reflects your actual data practices and complies with the
          Nigeria Data Protection Act and any other applicable laws before publishing.]
        </em>
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions about this policy can be sent to <a href="mailto:support@pascaqueen.shop">support@pascaqueen.shop</a>.
      </p>
    </InfoPageLayout>
  );
}
