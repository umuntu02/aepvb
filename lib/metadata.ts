import type { Metadata } from "next";

type Language = "fr" | "en";

interface PageMetadataOptions {
  title: string;
  description: string;
  lang?: Language;
  path?: string;
}

const siteName = "A.E.P.V.B";
const siteDescriptionFR = "Association pour la défense et la promotion des droits des personnes vulnérables au Burundi";
const siteDescriptionEN = "Association for the defense and promotion of vulnerable people's rights in Burundi";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aepvb.org";

export function generateMetadata({
  title,
  description,
  lang = "fr",
  path = "",
}: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const locale = lang === "fr" ? "fr_FR" : "en_US";
  const alternateLocale = lang === "fr" ? "en_US" : "fr_FR";
  const currentPath = path || "";
  const url = `${siteUrl}${currentPath}`;

  return {
    title: fullTitle,
    description,
    keywords: lang === "fr" 
      ? ["AEPVB", "Association", "Personnes vulnérables", "Burundi", "Handicap", "Droits humains", "Développement social", "Aide humanitaire"]
      : ["AEPVB", "Association", "Vulnerable people", "Burundi", "Disability", "Human rights", "Social development", "Humanitarian aid"],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
      languages: {
        "fr-FR": `${siteUrl}${currentPath}`,
        "en-US": `${siteUrl}/en${currentPath}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      locale,
      alternateLocale,
      type: "website",
      images: [
        {
          url: `${siteUrl}/favicon_io/android-chrome-512x512.png`,
          width: 512,
          height: 512,
          alt: `${siteName} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
      images: [`${siteUrl}/favicon_io/android-chrome-512x512.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Predefined metadata for common pages
export const pageMetadata = {
  home: {
    fr: {
      title: "Accueil",
      description: "A.E.P.V.B - Action pour l'Encadrement et la Promotion des Vulnérables au Burundi. Association engagée pour la défense et la promotion des droits des personnes vulnérables, contribuant à leur promotion socio-économique, socio-éducative et à la culture de la paix.",
    },
    en: {
      title: "Home",
      description: "A.E.P.V.B - Action for the Support and Promotion of Vulnerable People in Burundi. Association committed to defending and promoting the rights of vulnerable people, contributing to their socio-economic, socio-educational promotion and peace culture.",
    },
  },
  about: {
    fr: {
      title: "À propos",
      description: "Découvrez l'histoire, la mission, la vision et les valeurs de l'A.E.P.V.B. Une association burundaise dédiée à l'encadrement et à la promotion des personnes vulnérables depuis sa création.",
    },
    en: {
      title: "About Us",
      description: "Discover the history, mission, vision and values of A.E.P.V.B. A Burundian association dedicated to supporting and promoting vulnerable people since its inception.",
    },
  },
  programs: {
    fr: {
      title: "Nos Programmes",
      description: "Explorez nos programmes d'intervention pour l'amélioration des conditions de vie des personnes vulnérables au Burundi. Éducation, formation, insertion professionnelle et développement communautaire.",
    },
    en: {
      title: "Our Programs",
      description: "Explore our intervention programs to improve the living conditions of vulnerable people in Burundi. Education, training, professional integration and community development.",
    },
  },
  news: {
    fr: {
      title: "Actualités",
      description: "Restez informés des dernières actualités et réalisations de l'A.E.P.V.B. Nouvelles, événements et activités de l'association pour la promotion des personnes vulnérables.",
    },
    en: {
      title: "News",
      description: "Stay informed about the latest news and achievements of A.E.P.V.B. News, events and activities of the association for the promotion of vulnerable people.",
    },
  },
  events: {
    fr: {
      title: "Événements",
      description: "Découvrez les événements à venir et passés organisés par l'A.E.P.V.B. Rejoignez-nous pour soutenir la cause des personnes vulnérables au Burundi.",
    },
    en: {
      title: "Events",
      description: "Discover upcoming and past events organized by A.E.P.V.B. Join us to support the cause of vulnerable people in Burundi.",
    },
  },
  gallery: {
    fr: {
      title: "Galerie",
      description: "Parcourez notre galerie photo et découvrez en images les activités, événements et réalisations de l'A.E.P.V.B en faveur des personnes vulnérables au Burundi.",
    },
    en: {
      title: "Gallery",
      description: "Browse our photo gallery and discover in pictures the activities, events and achievements of A.E.P.V.B for vulnerable people in Burundi.",
    },
  },
  donate: {
    fr: {
      title: "Faire un Don",
      description: "Soutenez la mission de l'A.E.P.V.B en faisant un don. Votre contribution fait la différence dans la vie des personnes vulnérables au Burundi. Ensemble, construisons un avenir meilleur.",
    },
    en: {
      title: "Donate",
      description: "Support the mission of A.E.P.V.B by making a donation. Your contribution makes a difference in the lives of vulnerable people in Burundi. Together, let's build a better future.",
    },
  },
  contact: {
    fr: {
      title: "Contact",
      description: "Contactez l'A.E.P.V.B pour plus d'informations, questions ou partenariats. Nous sommes à votre écoute pour soutenir les personnes vulnérables au Burundi.",
    },
    en: {
      title: "Contact Us",
      description: "Contact A.E.P.V.B for more information, questions or partnerships. We are here to listen and support vulnerable people in Burundi.",
    },
  },
} as const;
