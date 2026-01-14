export type ProgramCategory = 
  | "education" 
  | "health" 
  | "economic" 
  | "environment" 
  | "peace";

export interface Program {
  id: string;
  slug: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  fullDescription: { fr: string; en: string };
  category: ProgramCategory;
  image: string;
  startDate: string;
  status: "active" | "completed" | "planned";
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: { fr: string; en: string };
  content: { fr: string; en: string };
  excerpt: { fr: string; en: string };
  author: string;
  category: string;
  image: string;
  date: string;
  featured: boolean;
}

export interface Event {
  id: string;
  slug: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  location: { fr: string; en: string };
  date: string;
  time: string;
  type: "workshop" | "seminar" | "training" | "campaign" | "other";
  image: string;
  registrationRequired: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: { fr: string; en: string };
  category: string;
  date?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: { fr: string; en: string };
  bio: { fr: string; en: string };
  image?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
}

// Programs Data
export const programs: Program[] = [
  {
    id: "1",
    slug: "education-fondamentale",
    title: {
      fr: "Accès à l'Éducation Fondamentale",
      en: "Access to Basic Education"
    },
    description: {
      fr: "Programme visant à faciliter l'accès à l'éducation pour les personnes sourdes-muettes et autres vulnérables",
      en: "Program aimed at facilitating access to education for deaf-mute and other vulnerable people"
    },
    fullDescription: {
      fr: "Notre programme d'éducation fondamentale assure que tous les enfants et jeunes, notamment ceux vivant avec un handicap, ont accès à une éducation de qualité. Nous travaillons avec les écoles pour adapter les méthodes d'enseignement et fournir le soutien nécessaire.",
      en: "Our basic education program ensures that all children and youth, especially those living with disabilities, have access to quality education. We work with schools to adapt teaching methods and provide necessary support."
    },
    category: "education",
    image: "/img/photo formation a Gitega.jpg",
    startDate: "2023-01-15",
    status: "active"
  },
  {
    id: "2",
    slug: "sante-vih-sida",
    title: {
      fr: "Santé et Lutte contre le VIH/SIDA",
      en: "Health and HIV/AIDS Prevention"
    },
    description: {
      fr: "Sensibilisation et prévention du VIH/SIDA auprès des personnes vulnérables",
      en: "HIV/AIDS awareness and prevention among vulnerable people"
    },
    fullDescription: {
      fr: "Nous organisons des campagnes de sensibilisation et des séances de formation sur la prévention du VIH/SIDA, l'hygiène et les pratiques sanitaires essentielles. Ce programme inclut également le soutien aux personnes vivant avec le VIH.",
      en: "We organize awareness campaigns and training sessions on HIV/AIDS prevention, hygiene and essential health practices. This program also includes support for people living with HIV."
    },
    category: "health",
    image: "/img/IMG_20200731_123321.jpg",
    startDate: "2022-06-01",
    status: "active"
  },
  {
    id: "3",
    slug: "autonomisation-economique",
    title: {
      fr: "Autonomisation Socio-Économique",
      en: "Socio-Economic Empowerment"
    },
    description: {
      fr: "Formation professionnelle et création d'opportunités économiques pour les personnes vulnérables",
      en: "Vocational training and creation of economic opportunities for vulnerable people"
    },
    fullDescription: {
      fr: "Nous offrons des formations professionnelles adaptées et accompagnons les bénéficiaires dans la création de micro-entreprises et de coopératives. Ce programme vise à assurer l'autosuffisance économique des personnes vulnérables.",
      en: "We provide adapted vocational training and support beneficiaries in creating micro-enterprises and cooperatives. This program aims to ensure the economic self-sufficiency of vulnerable people."
    },
    category: "economic",
    image: "/img/IMG_20200731_135408.jpg",
    startDate: "2023-03-10",
    status: "active"
  },
  {
    id: "4",
    slug: "protection-environnement",
    title: {
      fr: "Protection de l'Environnement",
      en: "Environmental Protection"
    },
    description: {
      fr: "Actions environnementales et sensibilisation à la protection de l'environnement",
      en: "Environmental actions and awareness on environmental protection"
    },
    fullDescription: {
      fr: "Nous organisons des activités de collecte d'ordures, de plantation d'arbres et de sensibilisation à l'utilisation de l'eau potable. Ce programme contribue à la protection de l'environnement tout en impliquant les communautés vulnérables.",
      en: "We organize waste collection activities, tree planting and awareness on the use of drinking water. This program contributes to environmental protection while involving vulnerable communities."
    },
    category: "environment",
    image: "/img/IMG_20200731_140327.jpg",
    startDate: "2023-05-20",
    status: "active"
  },
  {
    id: "5",
    slug: "paix-droits-homme",
    title: {
      fr: "Paix et Droits de l'Homme",
      en: "Peace and Human Rights"
    },
    description: {
      fr: "Promotion de la culture de la paix et défense des droits des personnes vulnérables",
      en: "Promotion of peace culture and defense of vulnerable people's rights"
    },
    fullDescription: {
      fr: "Nous sensibilisons les communautés sur les droits humains et la culture de la paix. Ce programme inclut la formation en leadership, l'éducation à la citoyenneté et la promotion de la cohésion sociale.",
      en: "We raise community awareness on human rights and peace culture. This program includes leadership training, citizenship education and promotion of social cohesion."
    },
    category: "peace",
    image: "/img/IMG_20200731_123515.jpg",
    startDate: "2022-09-01",
    status: "active"
  },
  {
    id: "6",
    slug: "securite-alimentaire",
    title: {
      fr: "Sécurité Alimentaire",
      en: "Food Security"
    },
    description: {
      fr: "Jardins potagers et réduction de la malnutrition",
      en: "Vegetable gardens and malnutrition reduction"
    },
    fullDescription: {
      fr: "Nous encourageons la création de jardins potagers familiaux et communautaires pour améliorer la sécurité alimentaire et réduire la malnutrition, particulièrement chez les enfants et les personnes âgées vulnérables.",
      en: "We encourage the creation of family and community vegetable gardens to improve food security and reduce malnutrition, especially among vulnerable children and elderly people."
    },
    category: "economic",
    image: "/img/IMG_20200731_140405.jpg",
    startDate: "2023-07-01",
    status: "active"
  },
  {
    id: "7",
    slug: "formation-professionnelle-sourds",
    title: {
      fr: "Centre de Formation Professionnelle pour Sourds",
      en: "Vocational Training Center for Deaf People"
    },
    description: {
      fr: "Projet de création d'un centre de formation professionnelle adapté aux sourds-muets",
      en: "Project to create a vocational training center adapted for deaf-mute people"
    },
    fullDescription: {
      fr: "Ce projet ambitieux vise à créer un centre de formation professionnelle entièrement adapté aux besoins des personnes sourdes-muettes, offrant des formations dans divers domaines techniques et professionnels.",
      en: "This ambitious project aims to create a vocational training center fully adapted to the needs of deaf-mute people, offering training in various technical and professional fields."
    },
    category: "education",
    image: "/img/IMG_20200730_083659.jpg",
    startDate: "2024-01-01",
    status: "planned"
  },
  {
    id: "8",
    slug: "sensibilisation-covid",
    title: {
      fr: "Sensibilisation COVID-19 pour Sourds-Muets",
      en: "COVID-19 Awareness for Deaf-Mute People"
    },
    description: {
      fr: "Campagne de sensibilisation sur le COVID-19 adaptée aux personnes sourdes-muettes",
      en: "COVID-19 awareness campaign adapted for deaf-mute people"
    },
    fullDescription: {
      fr: "En partenariat avec l'UNICEF, nous avons mené une campagne de sensibilisation sur le COVID-19 spécifiquement adaptée aux personnes sourdes-muettes, utilisant la langue des signes et des supports visuels accessibles.",
      en: "In partnership with UNICEF, we conducted a COVID-19 awareness campaign specifically adapted for deaf-mute people, using sign language and accessible visual materials."
    },
    category: "health",
    image: "/img/IMG-20200403-WA0034.jpg",
    startDate: "2021-03-01",
    status: "completed"
  },
  {
    id: "9",
    slug: "violences-genre",
    title: {
      fr: "Lutte contre les Violences Basées sur le Genre",
      en: "Fight Against Gender-Based Violence"
    },
    description: {
      fr: "Campagnes contre les violences basées sur le genre",
      en: "Campaigns against gender-based violence"
    },
    fullDescription: {
      fr: "Nous organisons des campagnes de sensibilisation et des formations pour lutter contre les violences basées sur le genre, avec un focus particulier sur les femmes et filles vulnérables, y compris les sourdes-muettes.",
      en: "We organize awareness campaigns and training to fight against gender-based violence, with a particular focus on vulnerable women and girls, including deaf-mute people."
    },
    category: "peace",
    image: "/img/IMG-20200703-WA0009.jpg",
    startDate: "2022-04-15",
    status: "active"
  },
  {
    id: "10",
    slug: "orientation-sociale",
    title: {
      fr: "Écoute et Orientation Sociale",
      en: "Listening and Social Guidance"
    },
    description: {
      fr: "Services d'écoute et d'orientation pour plus de 1500 personnes sourdes",
      en: "Listening and guidance services for over 1500 deaf people"
    },
    fullDescription: {
      fr: "Nous offrons des services d'écoute, d'orientation sociale, éducative et médicale aux personnes sourdes. Plus de 1500 personnes ont bénéficié de ces services, qui incluent également une assistance d'urgence pour les plus vulnérables.",
      en: "We offer listening, social, educational and medical guidance services to deaf people. Over 1500 people have benefited from these services, which also include emergency assistance for the most vulnerable."
    },
    category: "health",
    image: "/img/IMG_20200731_140259.jpg",
    startDate: "2021-01-01",
    status: "active"
  }
];

// News Articles Data
export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "campagne-covid-unicef-2021",
    title: {
      fr: "Campagne de Sensibilisation COVID-19 avec l'UNICEF",
      en: "COVID-19 Awareness Campaign with UNICEF"
    },
    content: {
      fr: "En 2021, l'A.E.P.V.B a mené une campagne majeure de sensibilisation sur le COVID-19, spécifiquement adaptée aux personnes sourdes-muettes. En partenariat avec l'UNICEF Burundi, nous avons créé des contenus en langue des signes et organisé des sessions de formation dans plusieurs provinces. Cette initiative a permis d'atteindre des centaines de personnes qui n'avaient pas accès aux informations standard sur la pandémie.",
      en: "In 2021, A.E.P.V.B conducted a major COVID-19 awareness campaign, specifically adapted for deaf-mute people. In partnership with UNICEF Burundi, we created sign language content and organized training sessions in several provinces. This initiative reached hundreds of people who did not have access to standard pandemic information."
    },
    excerpt: {
      fr: "Campagne majeure de sensibilisation COVID-19 adaptée aux personnes sourdes-muettes en partenariat avec l'UNICEF.",
      en: "Major COVID-19 awareness campaign adapted for deaf-mute people in partnership with UNICEF."
    },
    author: "Rock HAKIZIMANA",
    category: "health",
    image: "/img/IMG-20200403-WA0034.jpg",
    date: "2021-06-15",
    featured: true
  },
  {
    id: "2",
    slug: "pratiques-familiales-essentielles-2022",
    title: {
      fr: "Promotion des Pratiques Familiales Essentielles",
      en: "Promotion of Essential Family Practices"
    },
    content: {
      fr: "En 2022, en collaboration avec l'UNICEF et le Ministère de la Solidarité, nous avons lancé un programme de promotion des pratiques familiales essentielles. Ce programme vise à améliorer la santé maternelle et infantile, la nutrition, et l'hygiène dans les foyers vulnérables.",
      en: "In 2022, in collaboration with UNICEF and the Ministry of Solidarity, we launched a program to promote essential family practices. This program aims to improve maternal and child health, nutrition, and hygiene in vulnerable households."
    },
    excerpt: {
      fr: "Programme de promotion des pratiques familiales essentielles en collaboration avec l'UNICEF et le Ministère de la Solidarité.",
      en: "Program to promote essential family practices in collaboration with UNICEF and the Ministry of Solidarity."
    },
    author: "Jacqueline NIYONKURU",
    category: "health",
    image: "/img/IMG-20200704-WA0001.jpg",
    date: "2022-03-20",
    featured: true
  },
  {
    id: "3",
    slug: "assistance-urgence-150-sourds",
    title: {
      fr: "Assistance d'Urgence à Plus de 150 Sourds Vulnérables",
      en: "Emergency Assistance to Over 150 Vulnerable Deaf People"
    },
    content: {
      fr: "Notre programme d'assistance d'urgence a permis d'aider plus de 150 personnes sourdes particulièrement vulnérables en leur fournissant une aide alimentaire, des soins médicaux et un soutien psychosocial. Cette intervention a été cruciale pendant les périodes difficiles, notamment pendant la pandémie.",
      en: "Our emergency assistance program helped over 150 particularly vulnerable deaf people by providing food aid, medical care and psychosocial support. This intervention was crucial during difficult periods, especially during the pandemic."
    },
    excerpt: {
      fr: "Plus de 150 personnes sourdes vulnérables ont bénéficié de notre programme d'assistance d'urgence.",
      en: "Over 150 vulnerable deaf people benefited from our emergency assistance program."
    },
    author: "Bella IRAKOZE",
    category: "health",
    image: "/img/IMG_20200731_123532.jpg",
    date: "2021-12-10",
    featured: false
  },
  {
    id: "4",
    slug: "actions-environnementales-2023",
    title: {
      fr: "Actions Environnementales : Collecte et Plantation",
      en: "Environmental Actions: Collection and Planting"
    },
    content: {
      fr: "En 2023, nous avons intensifié nos actions environnementales en organisant plusieurs campagnes de collecte d'ordures dans les quartiers de Bujumbura et en plantant plus de 500 arbres dans les espaces communautaires. Ces activités sensibilisent également à l'importance de la protection de l'environnement.",
      en: "In 2023, we intensified our environmental actions by organizing several waste collection campaigns in Bujumbura neighborhoods and planting over 500 trees in community spaces. These activities also raise awareness of the importance of environmental protection."
    },
    excerpt: {
      fr: "Campagnes de collecte d'ordures et plantation de plus de 500 arbres dans les espaces communautaires.",
      en: "Waste collection campaigns and planting of over 500 trees in community spaces."
    },
    author: "Parfait GASORE",
    category: "environment",
    image: "/img/IMG_20200731_140327.jpg",
    date: "2023-05-15",
    featured: false
  },
  {
    id: "5",
    slug: "formation-entrepreneuriat",
    title: {
      fr: "Formation en Entrepreneuriat pour Personnes Vulnérables",
      en: "Entrepreneurship Training for Vulnerable People"
    },
    content: {
      fr: "Nous avons lancé un programme de formation en entrepreneuriat destiné aux personnes vulnérables, incluant des sessions sur la gestion d'entreprise, le marketing et la comptabilité de base. Les participants reçoivent également un accompagnement pour créer leurs propres micro-entreprises.",
      en: "We launched an entrepreneurship training program for vulnerable people, including sessions on business management, marketing and basic accounting. Participants also receive support to create their own micro-enterprises."
    },
    excerpt: {
      fr: "Programme de formation en entrepreneuriat avec accompagnement pour la création de micro-entreprises.",
      en: "Entrepreneurship training program with support for creating micro-enterprises."
    },
    author: "Nestor BUCUMI",
    category: "economic",
    image: "/img/IMG_20200731_135408.jpg",
    date: "2023-08-20",
    featured: true
  },
  {
    id: "6",
    slug: "sensibilisation-eau-potable",
    title: {
      fr: "Sensibilisation à l'Utilisation de l'Eau Potable",
      en: "Awareness on the Use of Drinking Water"
    },
    content: {
      fr: "Nous menons des campagnes de sensibilisation sur l'importance de l'utilisation de l'eau potable et des méthodes de traitement de l'eau à domicile. Ces activités visent à réduire les maladies hydriques dans les communautés vulnérables.",
      en: "We conduct awareness campaigns on the importance of using drinking water and home water treatment methods. These activities aim to reduce waterborne diseases in vulnerable communities."
    },
    excerpt: {
      fr: "Campagnes de sensibilisation sur l'utilisation de l'eau potable et le traitement de l'eau.",
      en: "Awareness campaigns on the use of drinking water and water treatment."
    },
    author: "Lydia IRANKUNDA",
    category: "health",
    image: "/img/IMG_20200821-WA0067.jpg",
    date: "2023-06-10",
    featured: false
  },
  {
    id: "7",
    slug: "cooperatives-inclusives",
    title: {
      fr: "Mise en Place de Coopératives Inclusives",
      en: "Establishment of Inclusive Cooperatives"
    },
    content: {
      fr: "Nous accompagnons la création de coopératives inclusives permettant aux personnes vulnérables de s'unir pour développer des activités économiques collectives. Ces coopératives favorisent l'entraide et l'autonomisation économique.",
      en: "We support the creation of inclusive cooperatives that allow vulnerable people to unite to develop collective economic activities. These cooperatives promote mutual aid and economic empowerment."
    },
    excerpt: {
      fr: "Accompagnement à la création de coopératives inclusives pour activités économiques collectives.",
      en: "Support for the creation of inclusive cooperatives for collective economic activities."
    },
    author: "Rock HAKIZIMANA",
    category: "economic",
    image: "/img/IMG_20200731_135419.jpg",
    date: "2023-09-05",
    featured: false
  },
  {
    id: "8",
    slug: "education-citoyennete",
    title: {
      fr: "Éducation à la Citoyenneté et Leadership",
      en: "Citizenship Education and Leadership"
    },
    content: {
      fr: "Notre programme d'éducation à la citoyenneté forme les jeunes et les personnes vulnérables à devenir des leaders communautaires. Les participants apprennent leurs droits, leurs responsabilités civiques et développent des compétences en leadership.",
      en: "Our citizenship education program trains youth and vulnerable people to become community leaders. Participants learn their rights, civic responsibilities and develop leadership skills."
    },
    excerpt: {
      fr: "Programme de formation en citoyenneté et leadership pour jeunes et personnes vulnérables.",
      en: "Citizenship and leadership training program for youth and vulnerable people."
    },
    author: "Jacqueline NIYONKURU",
    category: "peace",
    image: "/img/IMG_8674.JPG",
    date: "2023-07-18",
    featured: false
  },
  {
    id: "9",
    slug: "jardins-potagers",
    title: {
      fr: "Projet de Jardins Potagers pour la Sécurité Alimentaire",
      en: "Vegetable Garden Project for Food Security"
    },
    content: {
      fr: "Nous encourageons la création de jardins potagers familiaux et communautaires pour améliorer la sécurité alimentaire. Ce projet permet aux familles vulnérables de produire leurs propres légumes et de réduire la malnutrition.",
      en: "We encourage the creation of family and community vegetable gardens to improve food security. This project allows vulnerable families to grow their own vegetables and reduce malnutrition."
    },
    excerpt: {
      fr: "Encouragement à la création de jardins potagers pour améliorer la sécurité alimentaire.",
      en: "Encouraging the creation of vegetable gardens to improve food security."
    },
    author: "Bella IRAKOZE",
    category: "economic",
    image: "/img/IMG_20200731_140405.jpg",
    date: "2023-08-01",
    featured: false
  },
  {
    id: "10",
    slug: "orientation-1500-sourds",
    title: {
      fr: "Plus de 1500 Sourds Orientés et Accompagnés",
      en: "Over 1500 Deaf People Guided and Supported"
    },
    content: {
      fr: "Depuis notre création, nous avons offert des services d'écoute et d'orientation sociale, éducative et médicale à plus de 1500 personnes sourdes. Ces services incluent l'accompagnement dans les démarches administratives, l'orientation vers les services de santé et l'appui à l'éducation.",
      en: "Since our creation, we have provided listening and social, educational and medical guidance services to over 1500 deaf people. These services include support with administrative procedures, referral to health services and educational support."
    },
    excerpt: {
      fr: "Plus de 1500 personnes sourdes ont bénéficié de nos services d'orientation et d'accompagnement.",
      en: "Over 1500 deaf people have benefited from our guidance and support services."
    },
    author: "Nestor BUCUMI",
    category: "health",
    image: "/img/IMG_20200731_140259.jpg",
    date: "2023-10-12",
    featured: true
  },
  {
    id: "11",
    slug: "partenariat-ministere-sante",
    title: {
      fr: "Nouveau Partenariat avec le Ministère de la Santé",
      en: "New Partnership with the Ministry of Health"
    },
    content: {
      fr: "Nous avons signé un nouveau partenariat avec le Ministère de la Santé Publique et de la Lutte contre le Sida pour renforcer nos programmes de santé. Ce partenariat permettra d'améliorer l'accès aux soins de santé pour les personnes vulnérables.",
      en: "We signed a new partnership with the Ministry of Public Health and the Fight Against AIDS to strengthen our health programs. This partnership will improve access to health care for vulnerable people."
    },
    excerpt: {
      fr: "Nouveau partenariat avec le Ministère de la Santé pour améliorer l'accès aux soins.",
      en: "New partnership with the Ministry of Health to improve access to care."
    },
    author: "Parfait GASORE",
    category: "health",
    image: "/img/IMG-20200501-WA0020.jpg",
    date: "2023-11-05",
    featured: false
  },
  {
    id: "12",
    slug: "observatoire-droits-humains",
    title: {
      fr: "Projet d'Observatoire des Droits Humains",
      en: "Human Rights Observatory Project"
    },
    content: {
      fr: "Nous travaillons sur la création d'un observatoire des droits humains des sourds au Burundi. Cet observatoire documentera les violations de droits, sensibilisera les communautés et plaidera pour une meilleure protection juridique.",
      en: "We are working on creating a human rights observatory for deaf people in Burundi. This observatory will document rights violations, raise community awareness and advocate for better legal protection."
    },
    excerpt: {
      fr: "Création d'un observatoire des droits humains des sourds pour documenter et défendre leurs droits.",
      en: "Creation of a human rights observatory for deaf people to document and defend their rights."
    },
    author: "Rock HAKIZIMANA",
    category: "peace",
    image: "/img/IMG_8685.JPG",
    date: "2023-11-20",
    featured: true
  }
];

// Events Data
export const events: Event[] = [
  {
    id: "1",
    slug: "formation-sign-language-2024",
    title: {
      fr: "Formation en Langue des Signes Burundaise",
      en: "Burundian Sign Language Training"
    },
    description: {
      fr: "Formation intensive de 3 jours en langue des signes burundaise pour les enseignants et les professionnels de la santé.",
      en: "Intensive 3-day training in Burundian sign language for teachers and health professionals."
    },
    location: {
      fr: "Bujumbura, Centre de Formation A.E.P.V.B",
      en: "Bujumbura, A.E.P.V.B Training Center"
    },
    date: "2024-02-15",
    time: "09:00",
    type: "training",
    image: "/img/photo formation a Gitega.jpg",
    registrationRequired: true
  },
  {
    id: "2",
    slug: "seminaire-autonomisation-femmes",
    title: {
      fr: "Séminaire sur l'Autonomisation des Femmes Vulnérables",
      en: "Seminar on Empowerment of Vulnerable Women"
    },
    description: {
      fr: "Séminaire d'une journée sur l'autonomisation économique et sociale des femmes vivant avec handicap.",
      en: "One-day seminar on economic and social empowerment of women living with disabilities."
    },
    location: {
      fr: "Gitega, Hôtel des Mille Collines",
      en: "Gitega, Hotel des Mille Collines"
    },
    date: "2024-03-10",
    time: "08:30",
    type: "seminar",
    image: "/img/IMG-20200703-WA0009.jpg",
    registrationRequired: true
  },
  {
    id: "3",
    slug: "campagne-sensibilisation-environnement",
    title: {
      fr: "Campagne de Sensibilisation Environnementale",
      en: "Environmental Awareness Campaign"
    },
    description: {
      fr: "Grande campagne de collecte d'ordures et de plantation d'arbres dans les quartiers de Bujumbura.",
      en: "Major waste collection and tree planting campaign in Bujumbura neighborhoods."
    },
    location: {
      fr: "Bujumbura, Plusieurs quartiers",
      en: "Bujumbura, Several neighborhoods"
    },
    date: "2024-04-22",
    time: "07:00",
    type: "campaign",
    image: "/img/IMG_20200731_140327.jpg",
    registrationRequired: false
  },
  {
    id: "4",
    slug: "atelier-entrepreneuriat-jeunes",
    title: {
      fr: "Atelier d'Entrepreneuriat pour Jeunes Vulnérables",
      en: "Entrepreneurship Workshop for Vulnerable Youth"
    },
    description: {
      fr: "Atelier pratique de 2 jours sur la création d'entreprise et la gestion financière de base.",
      en: "Practical 2-day workshop on business creation and basic financial management."
    },
    location: {
      fr: "Ngozi, Centre Communautaire",
      en: "Ngozi, Community Center"
    },
    date: "2024-05-18",
    time: "09:00",
    type: "workshop",
    image: "/img/IMG_20200731_135408.jpg",
    registrationRequired: true
  },
  {
    id: "5",
    slug: "forum-droits-personnes-handicap",
    title: {
      fr: "Forum sur les Droits des Personnes Handicapées",
      en: "Forum on Rights of Persons with Disabilities"
    },
    description: {
      fr: "Forum de discussion et de plaidoyer pour les droits des personnes handicapées au Burundi.",
      en: "Discussion and advocacy forum for the rights of persons with disabilities in Burundi."
    },
    location: {
      fr: "Bujumbura, Centre de Conférences",
      en: "Bujumbura, Conference Center"
    },
    date: "2024-06-03",
    time: "08:00",
    type: "seminar",
    image: "/img/IMG_8674.JPG",
    registrationRequired: true
  },
  {
    id: "6",
    slug: "formation-premiers-secours",
    title: {
      fr: "Formation aux Premiers Secours",
      en: "First Aid Training"
    },
    description: {
      fr: "Formation aux premiers secours adaptée aux personnes sourdes, avec des supports visuels et la langue des signes.",
      en: "First aid training adapted for deaf people, with visual supports and sign language."
    },
    location: {
      fr: "Rutana, Dispensaire Communal",
      en: "Rutana, Municipal Dispensary"
    },
    date: "2024-06-20",
    time: "09:00",
    type: "training",
    image: "/img/IMG-20200403-WA0014.jpg",
    registrationRequired: true
  },
  {
    id: "7",
    slug: "colloque-sante-communautaire",
    title: {
      fr: "Colloque sur la Santé Communautaire",
      en: "Symposium on Community Health"
    },
    description: {
      fr: "Colloque d'une journée sur les défis de la santé communautaire et les solutions pour les personnes vulnérables.",
      en: "One-day symposium on community health challenges and solutions for vulnerable people."
    },
    location: {
      fr: "Muramvya, Salle Polyvalente",
      en: "Muramvya, Multipurpose Hall"
    },
    date: "2024-07-12",
    time: "08:30",
    type: "seminar",
    image: "/img/IMG-20200501-WA0022.jpg",
    registrationRequired: true
  },
  {
    id: "8",
    slug: "festival-inclusion-sociale",
    title: {
      fr: "Festival de l'Inclusion Sociale",
      en: "Social Inclusion Festival"
    },
    description: {
      fr: "Festival culturel et artistique mettant en valeur les talents des personnes vivant avec handicap.",
      en: "Cultural and artistic festival showcasing the talents of people living with disabilities."
    },
    location: {
      fr: "Bujumbura, Stade de l'Amitié",
      en: "Bujumbura, Friendship Stadium"
    },
    date: "2024-08-15",
    time: "14:00",
    type: "other",
    image: "/img/IMG_8685.JPG",
    registrationRequired: false
  },
  {
    id: "9",
    slug: "campagne-prevention-vih",
    title: {
      fr: "Campagne de Prévention du VIH/SIDA",
      en: "HIV/AIDS Prevention Campaign"
    },
    description: {
      fr: "Campagne de sensibilisation et de dépistage du VIH/SIDA dans les communautés vulnérables.",
      en: "HIV/AIDS awareness and screening campaign in vulnerable communities."
    },
    location: {
      fr: "Cibitoke, Centre de Santé",
      en: "Cibitoke, Health Center"
    },
    date: "2024-09-05",
    time: "08:00",
    type: "campaign",
    image: "/img/IMG_20200731_123321.jpg",
    registrationRequired: false
  },
  {
    id: "10",
    slug: "seminaire-leadership-jeunes",
    title: {
      fr: "Séminaire de Leadership pour Jeunes",
      en: "Youth Leadership Seminar"
    },
    description: {
      fr: "Séminaire de développement des compétences en leadership pour les jeunes vulnérables.",
      en: "Seminar on developing leadership skills for vulnerable youth."
    },
    location: {
      fr: "Kayanza, Centre de Formation",
      en: "Kayanza, Training Center"
    },
    date: "2024-09-28",
    time: "09:00",
    type: "seminar",
    image: "/img/IMG_8694.JPG",
    registrationRequired: true
  },
  {
    id: "11",
    slug: "workshop-cooperatives",
    title: {
      fr: "Atelier sur la Création de Coopératives",
      en: "Workshop on Creating Cooperatives"
    },
    description: {
      fr: "Atelier pratique sur la création et la gestion de coopératives inclusives.",
      en: "Practical workshop on creating and managing inclusive cooperatives."
    },
    location: {
      fr: "Bururi, Salle Communautaire",
      en: "Bururi, Community Hall"
    },
    date: "2024-10-15",
    time: "09:00",
    type: "workshop",
    image: "/img/IMG_20200731_135419.jpg",
    registrationRequired: true
  },
  {
    id: "12",
    slug: "journee-internationale-handicap",
    title: {
      fr: "Journée Internationale des Personnes Handicapées",
      en: "International Day of Persons with Disabilities"
    },
    description: {
      fr: "Célébration de la Journée Internationale des Personnes Handicapées avec activités et plaidoyer.",
      en: "Celebration of International Day of Persons with Disabilities with activities and advocacy."
    },
    location: {
      fr: "Bujumbura, Place de l'Indépendance",
      en: "Bujumbura, Independence Square"
    },
    date: "2024-12-03",
    time: "09:00",
    type: "other",
    image: "/img/IMG_8700.JPG",
    registrationRequired: false
  }
];

// Gallery Images
export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "/img/IMG_20200730_083659.jpg",
    alt: {
      fr: "Formation en langue des signes",
      en: "Sign language training"
    },
    category: "training",
    date: "2020-07-30"
  },
  {
    id: "2",
    src: "/img/IMG_20200731_123321.jpg",
    alt: {
      fr: "Sensibilisation santé",
      en: "Health awareness"
    },
    category: "health",
    date: "2020-07-31"
  },
  {
    id: "3",
    src: "/img/IMG_20200731_123343.jpg",
    alt: {
      fr: "Activité communautaire",
      en: "Community activity"
    },
    category: "community",
    date: "2020-07-31"
  },
  {
    id: "4",
    src: "/img/IMG_20200731_123515.jpg",
    alt: {
      fr: "Réunion de sensibilisation",
      en: "Awareness meeting"
    },
    category: "education",
    date: "2020-07-31"
  },
  {
    id: "5",
    src: "/img/IMG_20200731_123532.jpg",
    alt: {
      fr: "Distribution d'aide",
      en: "Aid distribution"
    },
    category: "aid",
    date: "2020-07-31"
  },
  {
    id: "6",
    src: "/img/IMG_20200731_135408.jpg",
    alt: {
      fr: "Atelier d'entrepreneuriat",
      en: "Entrepreneurship workshop"
    },
    category: "training",
    date: "2020-07-31"
  },
  {
    id: "7",
    src: "/img/IMG_20200731_135419.jpg",
    alt: {
      fr: "Formation professionnelle",
      en: "Vocational training"
    },
    category: "training",
    date: "2020-07-31"
  },
  {
    id: "8",
    src: "/img/IMG_20200731_135428.jpg",
    alt: {
      fr: "Échange communautaire",
      en: "Community exchange"
    },
    category: "community",
    date: "2020-07-31"
  },
  {
    id: "9",
    src: "/img/IMG_20200731_135709.jpg",
    alt: {
      fr: "Activité éducative",
      en: "Educational activity"
    },
    category: "education",
    date: "2020-07-31"
  },
  {
    id: "10",
    src: "/img/IMG_20200731_135720.jpg",
    alt: {
      fr: "Sensibilisation",
      en: "Awareness raising"
    },
    category: "education",
    date: "2020-07-31"
  },
  {
    id: "11",
    src: "/img/IMG_20200731_140253.jpg",
    alt: {
      fr: "Réunion communautaire",
      en: "Community meeting"
    },
    category: "community",
    date: "2020-07-31"
  },
  {
    id: "12",
    src: "/img/IMG_20200731_140259.jpg",
    alt: {
      fr: "Orientation et écoute",
      en: "Guidance and listening"
    },
    category: "health",
    date: "2020-07-31"
  },
  {
    id: "13",
    src: "/img/IMG_20200731_140327.jpg",
    alt: {
      fr: "Action environnementale",
      en: "Environmental action"
    },
    category: "environment",
    date: "2020-07-31"
  },
  {
    id: "14",
    src: "/img/IMG_20200731_140405.jpg",
    alt: {
      fr: "Jardin potager",
      en: "Vegetable garden"
    },
    category: "environment",
    date: "2020-07-31"
  },
  {
    id: "15",
    src: "/img/photo formation a Gitega.jpg",
    alt: {
      fr: "Formation à Gitega",
      en: "Training in Gitega"
    },
    category: "training",
    date: "2020-08-01"
  },
  {
    id: "16",
    src: "/img/IMG_8674.JPG",
    alt: {
      fr: "Activité communautaire",
      en: "Community activity"
    },
    category: "community",
    date: "2020-09-01"
  },
  {
    id: "17",
    src: "/img/IMG_8685.JPG",
    alt: {
      fr: "Célébration",
      en: "Celebration"
    },
    category: "community",
    date: "2020-09-02"
  },
  {
    id: "18",
    src: "/img/IMG_8694.JPG",
    alt: {
      fr: "Formation",
      en: "Training"
    },
    category: "training",
    date: "2020-09-03"
  },
  {
    id: "19",
    src: "/img/IMG-20200403-WA0034.jpg",
    alt: {
      fr: "Sensibilisation COVID-19",
      en: "COVID-19 awareness"
    },
    category: "health",
    date: "2020-04-03"
  },
  {
    id: "20",
    src: "/img/IMG-20200703-WA0009.jpg",
    alt: {
      fr: "Lutte contre les violences",
      en: "Fight against violence"
    },
    category: "education",
    date: "2020-07-03"
  }
];

// Team Members
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Nestor BUCUMI",
    role: {
      fr: "Représentant légal & Président",
      en: "Legal Representative & President"
    },
    bio: {
      fr: "Fondateur et président de l'A.E.P.V.B, Nestor BUCUMI œuvre depuis plus de 8 ans pour la promotion des droits des personnes vulnérables au Burundi.",
      en: "Founder and president of A.E.P.V.B, Nestor BUCUMI has worked for over 8 years to promote the rights of vulnerable people in Burundi."
    }
  },
  {
    id: "2",
    name: "Jacqueline NIYONKURU",
    role: {
      fr: "Vice-présidente",
      en: "Vice-President"
    },
    bio: {
      fr: "Jacqueline NIYONKURU coordonne les activités de terrain et assure la liaison avec les communautés locales.",
      en: "Jacqueline NIYONKURU coordinates field activities and ensures liaison with local communities."
    }
  },
  {
    id: "3",
    name: "Rock HAKIZIMANA",
    role: {
      fr: "Secrétaire exécutif",
      en: "Executive Secretary"
    },
    bio: {
      fr: "Rock HAKIZIMANA gère l'administration quotidienne et la coordination des programmes de l'association.",
      en: "Rock HAKIZIMANA manages daily administration and coordination of the association's programs."
    }
  },
  {
    id: "4",
    name: "Bella IRAKOZE",
    role: {
      fr: "Chargée des finances",
      en: "Finance Officer"
    },
    bio: {
      fr: "Bella IRAKOZE est responsable de la gestion financière et de la comptabilité de l'association.",
      en: "Bella IRAKOZE is responsible for financial management and accounting of the association."
    }
  },
  {
    id: "5",
    name: "Parfait GASORE",
    role: {
      fr: "Chargé de la communication",
      en: "Communication Officer"
    },
    bio: {
      fr: "Parfait GASORE coordonne les activités de communication, de sensibilisation et les relations avec les médias.",
      en: "Parfait GASORE coordinates communication activities, awareness raising and media relations."
    }
  },
  {
    id: "6",
    name: "Lydia IRANKUNDA",
    role: {
      fr: "Caissière",
      en: "Cashier"
    },
    bio: {
      fr: "Lydia IRANKUNDA assure la gestion de la caisse et le suivi des transactions financières.",
      en: "Lydia IRANKUNDA manages the cash register and tracks financial transactions."
    }
  }
];

// Partners
export const partners: Partner[] = [
  {
    id: "1",
    name: "Le Gouvernement",
    website: "#"
  },
  {
    id: "2",
    name: "Ministère de la Solidarité, des Droits de la Personne Humaine, des Affaires Sociales et du Genre",
    website: "#"
  },
  {
    id: "3",
    name: "Ministère de la Santé Publique et de la Lutte contre le Sida",
    website: "#"
  },
  {
    id: "4",
    name: "UNICEF Burundi",
    website: "https://www.unicef.org/burundi"
  },
  {
    id: "5",
    name: "OMS (Organisation Mondiale de la Santé)",
    website: "https://www.who.int"
  },
  {
    id: "6",
    name: "Rotary Club",
    website: "https://www.rotary.org"
  },
  {
    id: "7",
    name: "Office Burundais pour la Protection de l'Environnement",
    website: "#"
  },
  {
    id: "8",
    name: "Organisations locales des personnes vivant avec handicap",
    website: "#"
  },
  {
    id: "9",
    name: "Leaders communautaires",
    website: "#"
  }
];

// Helper functions
export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find(p => p.slug === slug);
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find(n => n.slug === slug);
}

export function getEventBySlug(slug: string): Event | undefined {
  return events.find(e => e.slug === slug);
}

export function getProgramsByCategory(category: ProgramCategory | "all"): Program[] {
  if (category === "all") return programs;
  return programs.filter(p => p.category === category);
}

export function getUpcomingEvents(): Event[] {
  const today = new Date().toISOString().split('T')[0];
  return events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getPastEvents(): Event[] {
  const today = new Date().toISOString().split('T')[0];
  return events
    .filter(e => e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedNews(): NewsArticle[] {
  return newsArticles.filter(n => n.featured).slice(0, 3);
}

export function getLatestNews(limit: number = 3): NewsArticle[] {
  return [...newsArticles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
