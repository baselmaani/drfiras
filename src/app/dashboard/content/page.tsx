import Link from "next/link";

const components = [
  {
    group: "Homepage Sections",
    items: [
      {
        href: "/dashboard/content/navbar",
        title: "Navbar",
        desc: "Phone, WhatsApp & Instagram buttons, booking link, social links",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/hero",
        title: "Hero Section",
        desc: "Headline, body text, CTA buttons, portrait image and stat counter",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/services",
        title: "Services Grid",
        desc: "Add, edit or remove dental services shown in the services grid",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/services-section",
        title: "Services Section",
        desc: "Edit the eyebrow label, heading and description above the services grid",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
          </svg>
        ),
      },
      {
        href: "/dashboard/before-after",
        title: "Before & After",
        desc: "Upload before & after case photos shown in the gallery",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/before-after-section",
        title: "Before & After Section",
        desc: "Edit the eyebrow label, heading and description above the before & after gallery",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/contact",
        title: "Contact / Book Section",
        desc: "Phone, email, address, WhatsApp, map embed URL, form email",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/about",
        title: "About Section",
        desc: "Biography paragraphs, stats, CTA button",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/at-a-glance",
        title: "At a Glance",
        desc: "Key stats and facts shown below the hero",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/google-reviews",
        title: "Google Reviews",
        desc: "Rating, review count, URL, and custom review cards",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/instagram",
        title: "Instagram Feed",
        desc: "Profile handle, follower count, bio, and post images",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="4" strokeWidth={2} />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/faq",
        title: "FAQ Section",
        desc: "Frequently asked questions shown at the bottom of the homepage",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/page-faqs",
        title: "Page FAQs",
        desc: "FAQ sections for About, Contact, Services, and Blog pages",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Content & Blog",
    items: [
      {
        href: "/dashboard/posts",
        title: "Blog Posts",
        desc: "Write and publish blog articles",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/pages-seo",
        title: "Page SEO",
        desc: "Title, description and keywords for every page",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/menu",
        title: "Navigation Menu",
        desc: "Edit the links shown in the top navigation bar",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
          </svg>
        ),
      },
      {
        href: "/dashboard/content/footer",
        title: "Footer",
        desc: "CTA banner, tagline, working hours and button labels",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h16M4 16h16M4 12h10" />
          </svg>
        ),
      },
    ],
  },
];

export default function ContentHubPage() {
  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-[#1b4f72]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          All Components
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Select any component below to edit its content.
        </p>
      </div>

      <div className="space-y-8">
        {components.map((group) => (
          <div key={group.group}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
              {group.group}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-[#1b4f72]/20 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1b4f72]/8 flex items-center justify-center text-[#1b4f72] flex-shrink-0 group-hover:bg-[#1b4f72]/15 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-[#1b4f72] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
