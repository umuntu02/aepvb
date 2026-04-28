export const adminFr = {
  // Général
  title: "Administration AEPVB",
  logout: "Se déconnecter",
  save: "Enregistrer",
  saving: "Enregistrement…",
  cancel: "Annuler",
  delete: "Supprimer",
  edit: "Modifier",
  add: "Ajouter",
  search: "Rechercher…",
  loading: "Chargement…",
  noResults: "Aucun résultat",
  actions: "Actions",
  success: "Enregistré ✓",
  error: "Une erreur s'est produite",
  unauthorized: "Session expirée. Veuillez vous reconnecter.",

  // Confirmation de suppression
  confirmTitle: "Êtes-vous sûr ?",
  confirmBody: "Cette action est irréversible.",
  confirmYes: "Oui, supprimer",
  confirmNo: "Annuler",

  // Statut
  published: "Publié",
  draft: "Brouillon",
  togglePublished: "Publié sur le site",

  // Navigation (sidebar)
  navDashboard: "Tableau de bord",
  navNews: "Actualités",
  navEvents: "Événements",
  navGallery: "Galerie",
  navPrograms: "Programmes",
  navTeam: "Équipe",
  navPartners: "Partenaires",

  // Dashboard
  dashboardTitle: "Tableau de bord",
  statsNews: "Actualités",
  statsEvents: "Événements",
  statsUpcoming: "À venir",
  statsPast: "Passés",
  statsGallery: "Photos",
  statsPrograms: "Programmes",
  recentActivity: "Activité récente",
  quickAdd: "Ajout rapide",
  quickAddNews: "+ Ajouter une actualité",
  quickAddEvent: "+ Ajouter un événement",
  quickAddPhoto: "+ Ajouter une photo",
  daysAgo: (n: number) => (n === 0 ? "Aujourd'hui" : n === 1 ? "Il y a 1 jour" : `Il y a ${n} jours`),

  // Champs bilingues
  fieldTitleFr: "Titre (Français)",
  fieldTitleEn: "Title (English)",
  fieldDescFr: "Description (Français)",
  fieldDescEn: "Description (English)",
  fieldFullDescFr: "Description complète (Français)",
  fieldFullDescEn: "Full Description (English)",
  fieldContentFr: "Contenu (Français)",
  fieldContentEn: "Content (English)",
  fieldExcerptFr: "Extrait (Français)",
  fieldExcerptEn: "Excerpt (English)",
  fieldLocationFr: "Lieu (Français)",
  fieldLocationEn: "Location (English)",
  fieldRoleFr: "Rôle (Français)",
  fieldRoleEn: "Role (English)",
  fieldBioFr: "Biographie (Français)",
  fieldBioEn: "Biography (English)",
  fieldAltFr: "Texte alternatif (Français)",
  fieldAltEn: "Alternative text (English)",

  // Champs communs
  fieldSlug: "Identifiant URL (slug)",
  fieldSlugEdit: "Modifier",
  fieldSlugLock: "Verrouiller",
  fieldDate: "Date",
  fieldTime: "Heure",
  fieldCategory: "Catégorie",
  fieldType: "Type",
  fieldAuthor: "Auteur",
  fieldStatus: "Statut du programme",
  fieldStartDate: "Date de début",
  fieldFeatured: "À la une",
  fieldRegistration: "Inscription requise",
  fieldName: "Nom",
  fieldWebsite: "Site web",
  fieldImage: "Image",
  fieldPhoto: "Photo",
  fieldLogo: "Logo",

  // Upload image
  imageUpload: "Choisir une image",
  imageChange: "Changer l'image",
  imageRemove: "Supprimer l'image",
  imageFormats: "JPG, PNG ou WEBP — max 5 Mo",
  imageAltRequired: "Le texte alternatif est obligatoire pour l'accessibilité",
  imageUploading: "Téléchargement en cours…",

  // Validation
  required: "Ce champ est obligatoire",
  maxLength: (n: number) => `Maximum ${n} caractères`,
  urlInvalid: "Veuillez entrer une URL valide (https://…)",

  // Actualités
  newsTitle: "Actualités",
  newsAdd: "+ Ajouter une actualité",
  newsNew: "Nouvelle actualité",
  newsEdit: "Modifier l'actualité",
  newsColTitle: "Titre",
  newsColDate: "Date",
  newsColCategory: "Catégorie",
  newsColStatus: "Statut",

  // Événements
  eventsTitle: "Événements",
  eventsAdd: "+ Ajouter un événement",
  eventsNew: "Nouvel événement",
  eventsEdit: "Modifier l'événement",
  eventsColTitle: "Titre",
  eventsColDate: "Date",
  eventsColLocation: "Lieu",
  eventsColStatus: "Statut",
  eventsUpcoming: "À venir",
  eventsPast: "Passé",

  // Galerie
  galleryTitle: "Galerie",
  galleryAdd: "+ Ajouter une photo",
  galleryNew: "Nouvelle photo",
  galleryEdit: "Modifier la photo",
  galleryReorder: "Faites glisser pour réordonner",

  // Programmes
  programsTitle: "Programmes",
  programsAdd: "+ Ajouter un programme",
  programsNew: "Nouveau programme",
  programsEdit: "Modifier le programme",
  programsColTitle: "Titre",
  programsColSlug: "Identifiant",
  programsColStatus: "Statut",

  // Équipe
  teamTitle: "Équipe",
  teamAdd: "+ Ajouter un membre",
  teamNew: "Nouveau membre",
  teamEdit: "Modifier le membre",
  teamColName: "Nom",
  teamColRole: "Rôle",
  teamColPhoto: "Photo",
  teamReorder: "Faites glisser pour réordonner",

  // Album photos (events & news)
  albumTitle: "Album photos",
  albumSubtitleEvents: "Ces photos apparaîtront sur la page de l'événement.",
  albumSubtitleNews: "Ces photos apparaîtront sur la page de l'actualité.",
  albumUploadZone: "Cliquez ou déposez vos photos ici",
  albumUploading: "Téléchargement en cours…",
  albumDeleteConfirm: "Supprimer cette photo ? Cette action est irréversible.",
  albumEditAlt: "Modifier le texte alternatif",
  albumDragHandle: "Réordonner",
  albumNoPhotos: "Aucune photo pour l'instant.",
  albumSaveFirst: "Vous pourrez ajouter des photos après avoir sauvegardé.",

  // Partenaires
  partnersTitle: "Partenaires",
  partnersAdd: "+ Ajouter un partenaire",
  partnersNew: "Nouveau partenaire",
  partnersEdit: "Modifier le partenaire",
  partnersColName: "Nom",
  partnersColLogo: "Logo",
  partnersColWebsite: "Site web",
  partnersReorder: "Faites glisser pour réordonner",
} as const;

export type AdminFr = typeof adminFr;
