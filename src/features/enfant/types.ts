export type AgeInMonths = number

export interface ChildProfile {
  id: string
  userId: string
  name: string
  birthDate: Date   // Date et non string : permet les calculs d'âge en mois
  createdAt: Date
}

// birthDate est string car c'est ce que renvoie un <input type="date">.
// La conversion vers Date se fait dans le service, pas dans le composant.
export interface ChildFormData {
  name: string
  birthDate: string
}
