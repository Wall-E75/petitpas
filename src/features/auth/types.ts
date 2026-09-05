// `interface` plutôt que `type` ici : on décrit la forme d'un objet et on
// veut un nom qui apparaît tel quel dans les messages d'erreur TypeScript et
// l'autocomplétion. `type` serait équivalent pour ce cas ; on réserve `type`
// aux unions, intersections et alias de primitives.
export interface AuthCredentials {
  email: string
  password: string
}

// Le formulaire d'inscription ajoute une confirmation de mot de passe. On la
// dérive de AuthCredentials avec une intersection (`&`) : si un jour un champ
// est ajouté à AuthCredentials, RegisterFormData le récupère automatiquement.
export type RegisterFormData = AuthCredentials & {
  confirmPassword: string
}
