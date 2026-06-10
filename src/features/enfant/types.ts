// =============================================================================
// features/enfant/types.ts
//
// Pourquoi ce fichier existe ?
// Chaque feature possède ses propres types. Cela évite les dépendances croisées
// et respecte le principe de responsabilité unique (SOLID — "S").
// =============================================================================

// -----------------------------------------------------------------------------
// AgeInMonths
//
// Un "type alias" sur un primitif. `number` seul manque de contexte :
// est-ce des mois ? des jours ? des années ?
// Nommer ce type documente l'intention et rend les signatures de fonctions
// plus lisibles : getActivities(age: AgeInMonths) vs getActivities(age: number)
// -----------------------------------------------------------------------------
export type AgeInMonths = number

// -----------------------------------------------------------------------------
// ChildProfile
//
// Représente un enfant tel qu'il est stocké en base de données et manipulé
// dans la logique métier de l'application.
//
// On utilise `interface` ici car :
// - c'est un objet structuré (une "entité")
// - les interfaces sont extensibles si une autre feature a besoin d'y ajouter
//   des propriétés (ex: feature/ia pourrait enrichir ce profil)
//
// birthDate est un objet `Date` JavaScript (et non une string) car :
// - on a besoin de faire des calculs dessus (âge en mois, comparaisons...)
// - la conversion string → Date est faite au niveau du service (couche d'accès
//   aux données), pas dans les composants
// -----------------------------------------------------------------------------
export interface ChildProfile {
  id: string           // UUID généré par Supabase
  userId: string       // FK vers auth.users — à qui appartient ce profil
  name: string
  birthDate: Date      // Objet Date : permet les calculs d'âge
  createdAt: Date      // Timestamp de création, utile pour les tris
}

// -----------------------------------------------------------------------------
// ChildFormData
//
// Représente les données telles qu'elles viennent d'un formulaire HTML.
//
// Un <input type="date"> renvoie TOUJOURS une string (ex: "2023-04-15").
// TypeScript nous oblige donc à représenter cela fidèlement — si on mettait
// `Date` ici, on aurait un faux sentiment de sécurité alors que la valeur
// réelle est une string.
//
// Le flux de transformation est explicite :
//   ChildFormData (string) → validation → conversion → ChildProfile (Date)
// -----------------------------------------------------------------------------
export interface ChildFormData {
  name: string
  birthDate: string    // Format ISO "YYYY-MM-DD" — valeur brute du <input type="date">
}
