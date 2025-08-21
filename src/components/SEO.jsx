import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "Cẩm nang phòng chống tội phạm - Công an tỉnh Quảng Ninh",
  description = "Cẩm nang phòng chống tội phạm và vi phạm pháp luật. Hướng dẫn định danh điện tử, tội phạm hình sự, công nghệ cao, ma túy, giao thông, phòng cháy chữa cháy và các thủ tục hành chính.",
  keywords = "cẩm nang phòng chống tội phạm, công an quảng ninh, định danh điện tử, tội phạm hình sự, tội phạm công nghệ cao, ma túy, giao thông, phòng cháy chữa cháy, thủ tục hành chính, an ninh trật tự",
  image = "/logo.jpg",
  url = "https://camnangtrangtri.vn",
  type = "website"
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cẩm nang phòng chống tội phạm",
    "description": description,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "Công an tỉnh Quảng Ninh",
      "logo": {
        "@type": "ImageObject",
        "url": `${url}/logo.jpg`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${url}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Công an tỉnh Quảng Ninh" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="vi" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Cẩm nang phòng chống tội phạm" />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
