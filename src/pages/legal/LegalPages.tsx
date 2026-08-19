interface LegalPageProps {
  title: string
  children: React.ReactNode
}

export function LegalLayout({ title, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      <div className="prose prose-sm mt-8 max-w-none space-y-4 text-brand-800/70 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export function AboutPage() {
  return (
    <LegalLayout title="About Us">
      <p>
        J-World Clothes is dedicated to customers who are looking for modest fashion — clothing
        that is stylish, well-made, and aligned with values of coverage and elegance.
      </p>
      <p>
        We carefully curate products from well-known international brands, selecting pieces that
        fit a modest wardrobe across Men, Women, Kids, and Baby. From long-line coats and layered
        looks to covered silhouettes and everyday essentials, we bring together options that are
        often hard to find in one place.
      </p>
      <p>
        Hundreds of millions of people around the world — and countless communities, families, and
        faith groups — share this approach to dressing. Yet until now, there has been no dedicated
        platform that brings modest style from trusted, recognisable brands into a single, easy
        shopping experience.
      </p>
      <p>
        J-World Clothes is built to fill that gap. Our mission is to make modest fashion from top
        brands accessible, discoverable, and simple to shop — so you can find pieces you love
        without compromise.
      </p>
    </LegalLayout>
  )
}

export function ContactPage() {
  return (
    <LegalLayout title="Contact">
      <p>We&apos;d love to hear from you. Reach out with questions, feedback, or partnership inquiries.</p>
      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:info@jworldclothes.com" className="text-accent hover:text-accent-hover">
          info@jworldclothes.com
        </a>
      </p>
      <p>
        <strong>Response Time:</strong> We typically respond within 1–2 business days.
      </p>
    </LegalLayout>
  )
}

export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p><strong>Last updated:</strong> August 2026</p>

      <h2 className="font-display text-xl font-semibold text-brand-900">1. Introduction</h2>
      <p>
        J-World Clothes (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates jworldclothes.com (the &quot;Site&quot;).
        We are committed to protecting your privacy and ensuring transparency about how your data is
        collected, used, and safeguarded.
      </p>

      <h2 className="font-display text-xl font-semibold text-brand-900">2. Information We Collect</h2>
      <p>
        <strong>Automated &amp; Usage Data:</strong> When you visit our Site, we automatically collect
        certain technical information via log files and analytics tools, including your IP address,
        browser type, operating system, referring URLs, device information, and pages viewed.
      </p>
      <p>
        <strong>Local Storage:</strong> Wishlists and user interface preferences may be stored locally
        within your browser session.
      </p>
      <p>
        <strong>Communications:</strong> If you contact us directly via email, we collect your email
        address and any details provided in your inquiry.
      </p>

      <h2 className="font-display text-xl font-semibold text-brand-900">3. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies, web beacons, and tracking pixels to ensure proper site functionality, analyze
        traffic patterns, and track affiliate referrals.
      </p>
      <p>
        <strong>Affiliate Cookies:</strong> When you click on outgoing product links on our Site,
        third-party affiliate networks and merchant partners place tracking cookies in your browser to
        verify qualifying purchases and assign referral commissions.
      </p>
      <p>
        <strong>Managing Cookies:</strong> You can configure your browser settings to refuse cookies or
        alert you when cookies are being sent. Note that some features of the Site may not function
        properly without cookies enabled.
      </p>

      <h2 className="font-display text-xl font-semibold text-brand-900">4. Affiliate Disclaimer &amp; Commercial Relationships</h2>
      <p>
        J-World Clothes participates in various affiliate marketing programs designed to provide a means
        for sites to earn advertising fees by linking to affiliated merchant websites. We may earn a
        commission when you click on external links and complete purchases, at no additional cost to you.
      </p>

      <h2 className="font-display text-xl font-semibold text-brand-900">5. Third-Party Websites &amp; External Links</h2>
      <p>
        Our Site contains links to external retailers, brand partners, and affiliate networks. Once you
        leave our Site, our Privacy Policy no longer applies. We have no control over and assume no
        responsibility for the content, privacy policies, or practices of any third-party websites.
      </p>

      <h2 className="font-display text-xl font-semibold text-brand-900">6. User Data Rights (GDPR &amp; CCPA Compliance)</h2>
      <p>
        Depending on your location, you may have specific rights regarding your personal data, including:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>The right to access, update, or request the deletion of any personal information we hold about you.</li>
        <li>The right to opt out of certain automated tracking and cookie storage.</li>
      </ul>
      <p>To exercise any of these rights, please reach out via our contact email below.</p>

      <h2 className="font-display text-xl font-semibold text-brand-900">7. Children&apos;s Privacy</h2>
      <p>
        Our Site offers family, children&apos;s, and modest fashion curation, but our services are intended
        for adults. We do not knowingly collect personal identifiable information from children under
        the age of 16.
      </p>

      <h2 className="font-display text-xl font-semibold text-brand-900">8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Any updates will be posted on this page with an
        updated revision date.
      </p>

      <h2 className="font-display text-xl font-semibold text-brand-900">9. Contact Us</h2>
      <p>
        For any questions regarding this Privacy Policy or our data practices, please contact us at:
      </p>
      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:info@jworldclothes.com" className="text-accent hover:text-accent-hover">
          info@jworldclothes.com
        </a>
      </p>
    </LegalLayout>
  )
}

export function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p><strong>Last updated:</strong> August 2026</p>
      <p>
        By accessing J-World Clothes, you agree to these Terms of Service. If you do not agree,
        please do not use our website.
      </p>
      <h2 className="font-display text-xl font-semibold text-brand-900">Use of Service</h2>
      <p>
        J-World Clothes provides a curated catalog of fashion products with links to third-party merchants.
        We do not sell products directly. All purchases are made on external merchant websites.
      </p>
      <h2 className="font-display text-xl font-semibold text-brand-900">Product Information</h2>
      <p>
        Product prices, availability, and descriptions are provided for informational purposes and
        may not reflect current merchant data. Always verify details on the merchant site before purchasing.
      </p>
      <h2 className="font-display text-xl font-semibold text-brand-900">Limitation of Liability</h2>
      <p>
        J-World Clothes is not liable for any issues arising from purchases made on third-party websites,
        including but not limited to product quality, shipping, returns, or pricing discrepancies.
      </p>
    </LegalLayout>
  )
}

export function AffiliateDisclosurePage() {
  return (
    <LegalLayout title="Affiliate Disclosure">
      <p>
        J-World Clothes participates in affiliate marketing programs. This means we may earn a commission
        when you click on product links and make a qualifying purchase on a merchant&apos;s website —
        at no additional cost to you.
      </p>
      <p>
        Product prices and availability are accurate as of the date/time indicated and are subject to change.
        Any price and availability information displayed on the merchant site at the time of purchase will apply.
      </p>
      <p>
        We only recommend products and brands we believe offer value to our visitors. Affiliate relationships
        do not influence our editorial curation — we prioritize quality, style, and relevance.
      </p>
      <p>
        If you have questions about our affiliate partnerships, please contact us at{' '}
        <a href="mailto:info@jworldclothes.com" className="text-accent">info@jworldclothes.com</a>.
      </p>
    </LegalLayout>
  )
}
