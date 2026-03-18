export const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GenPDF",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  description:
    "GenPDF is an AI-powered PDF tool for converting, summarizing, analyzing, and extracting content from PDF documents.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  url: "https://genpdf.app",
  creator: {
    "@type": "Organization",
    name: "GenPDF"
  }
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GenPDF",
  url: "https://genpdf.app",
  logo: "https://genpdf.app/og-image.png",
  sameAs: []
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GenPDF",
  url: "https://genpdf.app"
};
