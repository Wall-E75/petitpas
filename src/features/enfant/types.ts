export type AgeInMonths = number

export interface ChildProfile {
  id: string
  userId: string
  name: string
  birthDate: Date   // Date et non string : permet les calculs d'âge en mois
  createdAt: Date
}

// Forme brute d'une ligne de la table `children`, avant conversion par le service.
// Le client Supabase n'étant pas typé, ce contrat est la seule garantie sur `row`.
export interface ChildRow {
  id: string
  user_id: string | null
  name: string
  birth_date: string
  created_at: string
}

// birthDate est string car c'est ce que renvoie un <input type="date">.
// La conversion vers Date se fait dans le service, pas dans le composant.
export interface ChildFormData {
  name: string
  birthDate: string
}
