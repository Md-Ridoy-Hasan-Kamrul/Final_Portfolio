/**
 * SEO Utilities for Portfolio Website
 * Principal Frontend Architect Standard Implementation
 *
 * Features:
 * - Dynamic metadata generation
 * - Structured data (JSON-LD)
 * - Open Graph tags
 * - Twitter Card tags
 * - Canonical URLs
 * - Sitemap generation helpers
 */

/**
 * Default SEO configuration
 */
export const DEFAULT_SEO = {
  title: 'Md. Ridoy Hasan Kamrul - Frontend Developer',
  description:
    'Computer Science graduate specializing in MERN stack with a strong focus on frontend development. Building responsive, user-friendly web applications with React, Next.js, and modern web technologies.',
  canonical: 'https://mdridoyhasankamrul.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mdridoyhasankamrul.com',
    siteName: 'Md. Ridoy Hasan Kamrul Portfolio',
    images: [
      {
        url: 'https://mdridoyhasankamrul.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Md. Ridoy Hasan Kamrul - Frontend Developer',
      },
    ],
  },
  twitter: {
    handle: '@mdridoyhasan',
    site: '@mdridoyhasan',
    cardType: 'summary_large_image',
  },
  keywords: [
    'Frontend Developer',
    'React Developer',
    'Next.js Developer',
    'MERN Stack',
    'TypeScript',
    'Tailwind CSS',
    'Web Development',
    'UI/UX Development',
    'Bangladesh Developer',
    'Dhaka',
  ],
  author: {
    name: 'Md. Ridoy Hasan Kamrul',
    email: 'mdridoyhasankamrul@gmail.com',
    url: 'https://mdridoyhasankamrul.com',
  },
};

/**
 * Generate complete page metadata
 * @param {Object} options - SEO configuration options
 * @returns {Object} Metadata object for Next.js or React Helmet
 */
export const generateMetadata = (options = {}) => {
  const seo = { ...DEFAULT_SEO, ...options };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(', '),
    canonical: seo.canonical,
    openGraph: {
      title: seo.openGraph.title || seo.title,
      description: seo.openGraph.description || seo.description,
      url: seo.openGraph.url,
      type: seo.openGraph.type,
      locale: seo.openGraph.locale,
      siteName: seo.openGraph.siteName,
      images: seo.openGraph.images,
    },
    twitter: {
      card: seo.twitter.cardType,
      site: seo.twitter.site,
      creator: seo.twitter.handle,
      title: seo.title,
      description: seo.description,
      images: seo.openGraph.images,
    },
    alternates: {
      canonical: seo.canonical,
    },
  };
};

/**
 * Generate JSON-LD structured data for a Person
 * @returns {Object} Person schema
 */
export const generatePersonSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Md. Ridoy Hasan Kamrul',
    jobTitle: 'Frontend Developer',
    url: 'https://mdridoyhasankamrul.com',
    email: 'mdridoyhasankamrul@gmail.com',
    image: 'https://mdridoyhasankamrul.com/profile.jpg',
    sameAs: [
      'https://github.com/Md-Ridoy-Hasan-Kamrul',
      'https://www.linkedin.com/in/md-ridoy-hasan-kamrul',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'Bangladesh',
    },
    knowsAbout: [
      'Frontend Development',
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'MERN Stack',
      'Web Performance',
      'Accessibility',
      'SEO',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Computer Science',
    },
  };
};

/**
 * Generate JSON-LD structured data for WebSite
 * @returns {Object} WebSite schema
 */
export const generateWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Md. Ridoy Hasan Kamrul Portfolio',
    url: 'https://mdridoyhasankamrul.com',
    description: DEFAULT_SEO.description,
    author: {
      '@type': 'Person',
      name: 'Md. Ridoy Hasan Kamrul',
    },
    inLanguage: 'en-US',
  };
};

/**
 * Generate JSON-LD structured data for a CreativeWork (Projects)
 * @param {Object} project - Project details
 * @returns {Object} CreativeWork schema
 */
export const generateProjectSchema = (project) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: project.liveUrl,
    author: {
      '@type': 'Person',
      name: 'Md. Ridoy Hasan Kamrul',
      url: 'https://mdridoyhasankamrul.com',
    },
    keywords: project.highlights.join(', '),
    genre: project.category,
  };
};

/**
 * Generate JSON-LD structured data for BreadcrumbList
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {Object} BreadcrumbList schema
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

/**
 * Insert structured data into the document head
 * @param {Object} schema - Schema.org structured data
 */
export const insertStructuredData = (schema) => {
  if (typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Update meta tags dynamically
 * @param {Object} metadata - Metadata object
 */
export const updateMetaTags = (metadata) => {
  if (typeof document === 'undefined') return;

  // Update title
  if (metadata.title) {
    document.title = metadata.title;
  }

  // Update description
  updateOrCreateMetaTag('description', metadata.description);

  // Update keywords
  if (metadata.keywords) {
    updateOrCreateMetaTag('keywords', metadata.keywords);
  }

  // Update canonical
  if (metadata.canonical) {
    updateOrCreateLink('canonical', metadata.canonical);
  }

  // Update Open Graph tags
  if (metadata.openGraph) {
    updateOrCreateMetaTag('og:title', metadata.openGraph.title, 'property');
    updateOrCreateMetaTag(
      'og:description',
      metadata.openGraph.description,
      'property'
    );
    updateOrCreateMetaTag('og:url', metadata.openGraph.url, 'property');
    updateOrCreateMetaTag('og:type', metadata.openGraph.type, 'property');
    updateOrCreateMetaTag('og:locale', metadata.openGraph.locale, 'property');
    updateOrCreateMetaTag(
      'og:site_name',
      metadata.openGraph.siteName,
      'property'
    );

    if (metadata.openGraph.images && metadata.openGraph.images.length > 0) {
      const image = metadata.openGraph.images[0];
      updateOrCreateMetaTag('og:image', image.url, 'property');
      updateOrCreateMetaTag('og:image:width', image.width, 'property');
      updateOrCreateMetaTag('og:image:height', image.height, 'property');
      updateOrCreateMetaTag('og:image:alt', image.alt, 'property');
    }
  }

  // Update Twitter Card tags
  if (metadata.twitter) {
    updateOrCreateMetaTag('twitter:card', metadata.twitter.card);
    updateOrCreateMetaTag('twitter:site', metadata.twitter.site);
    updateOrCreateMetaTag('twitter:creator', metadata.twitter.creator);
    updateOrCreateMetaTag('twitter:title', metadata.twitter.title);
    updateOrCreateMetaTag('twitter:description', metadata.twitter.description);

    if (metadata.twitter.images && metadata.twitter.images.length > 0) {
      updateOrCreateMetaTag('twitter:image', metadata.twitter.images[0].url);
    }
  }
};

/**
 * Helper function to update or create meta tags
 * @param {string} name - Meta tag name or property
 * @param {string} content - Meta tag content
 * @param {string} attribute - Attribute type ('name' or 'property')
 */
const updateOrCreateMetaTag = (name, content, attribute = 'name') => {
  if (!content) return;

  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
};

/**
 * Helper function to update or create link tags
 * @param {string} rel - Link relation
 * @param {string} href - Link href
 */
const updateOrCreateLink = (rel, href) => {
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`);

  if (element) {
    element.setAttribute('href', href);
  } else {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    element.setAttribute('href', href);
    document.head.appendChild(element);
  }
};

/**
 * Generate sitemap entry for a page
 * @param {Object} page - Page details
 * @returns {Object} Sitemap entry
 */
export const generateSitemapEntry = (page) => {
  return {
    url: page.url,
    lastModified: page.lastModified || new Date().toISOString(),
    changeFrequency: page.changeFrequency || 'monthly',
    priority: page.priority || 0.8,
  };
};

/**
 * Generate robots.txt content
 * @param {Object} options - Robots.txt configuration
 * @returns {string} Robots.txt content
 */
export const generateRobotsTxt = (options = {}) => {
  const {
    sitemap = 'https://mdridoyhasankamrul.com/sitemap.xml',
    disallow = [],
  } = options;

  let content = 'User-agent: *\n';

  if (disallow.length > 0) {
    disallow.forEach((path) => {
      content += `Disallow: ${path}\n`;
    });
  } else {
    content += 'Allow: /\n';
  }

  content += `\nSitemap: ${sitemap}\n`;

  return content;
};

/**
 * Preload critical resources
 * @param {Array} resources - Array of resource URLs
 */
export const preloadResources = (resources) => {
  if (typeof document === 'undefined') return;

  resources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = resource.as || 'script';
    if (resource.type) link.type = resource.type;
    document.head.appendChild(link);
  });
};

/**
 * Initialize SEO for the application
 * @param {Object} config - SEO configuration
 */
export const initializeSEO = (config = {}) => {
  const metadata = generateMetadata(config);
  updateMetaTags(metadata);

  // Insert structured data
  insertStructuredData(generatePersonSchema());
  insertStructuredData(generateWebsiteSchema());

  // Preload critical resources
  preloadResources([
    { url: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
  ]);
};

export default {
  DEFAULT_SEO,
  generateMetadata,
  generatePersonSchema,
  generateWebsiteSchema,
  generateProjectSchema,
  generateBreadcrumbSchema,
  insertStructuredData,
  updateMetaTags,
  generateSitemapEntry,
  generateRobotsTxt,
  preloadResources,
  initializeSEO,
};
