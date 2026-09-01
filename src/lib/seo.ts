export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const DEFAULT_TITLE = 'GussWare - High-End Freelance Tech Community';
const DEFAULT_DESCRIPTION =
  'Technology built by people. A collaborative freelance community delivering high-impact digital solutions with industrial precision and human-centric warmth.';
const DEFAULT_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvGLHYWymJdvRhCXXPwx0SAq-SHzF2Xx_Ly5Qn2EzfsJYgm8348KRnXAWTHFFVr1NWEMUWM-36JCH4dYCsWRLa70Qn0cIODvhIq4MPdy-SuOHkuHoqvoVaZjd0F5ERcZSt2V_3ZBwP56OF_T9NUK4rMoPzhZdRQYvGkxwIeKFrU6UzWZWQgmcp4thNG6ynQw_1Ld2mC-yUlmoUnLe35sa7100VLG994RAVqC_FCph-s_PLw7h4Bdg8';

export function getSEOMetadata(props: SEOProps = {}) {
  const title = props.title ? `${props.title} | GussWare` : DEFAULT_TITLE;
  const description = props.description || DEFAULT_DESCRIPTION;
  const image = props.image || DEFAULT_IMAGE;
  const type = props.type || 'website';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function updateDocumentHead(seo: SEOProps) {
  if (typeof document === 'undefined') return;
  const fullTitle = seo.title ? `${seo.title} - GussWare` : DEFAULT_TITLE;
  document.title = fullTitle;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', seo.description || DEFAULT_DESCRIPTION);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', fullTitle);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', seo.description || DEFAULT_DESCRIPTION);
  }
}
