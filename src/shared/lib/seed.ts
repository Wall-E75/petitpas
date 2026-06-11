import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// ts-node ne charge pas .env.local automatiquement (contrairement à Next.js).
// On parse le fichier manuellement avec fs — pas besoin de dotenv.
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach(line => {
      const match = line.match(/^([A-Z0-9_]+)=(.+)$/)
      if (match) process.env[match[1]] = match[2].trim()
    })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables manquantes dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Types en snake_case pour correspondre aux colonnes de la table Supabase.
// Différent des interfaces TypeScript du projet qui utilisent le camelCase.
type DevelopmentArea =
  | 'motricite_fine'
  | 'motricite_globale'
  | 'langage'
  | 'eveil_sensoriel'
  | 'social_emotionnel'
  | 'creativite'

interface ActivityRow {
  title: string
  description: string
  age_min: number
  age_max: number
  duration: number
  materials: string[]
  benefits: DevelopmentArea[]
  difficulty: 'facile' | 'moyen' | 'avance'
  is_premium: boolean
}

const activities: ActivityRow[] = [
  // ── 0-6 mois ────────────────────────────────────────────────────────────
  {
    title: 'Tummy time',
    description:
      'Allongez votre bébé sur le ventre quelques minutes par jour sur une surface ferme. Cette position renforce les muscles du cou, des épaules et du dos, indispensables pour les prochaines étapes motrices. Commencez par 2-3 minutes et augmentez progressivement.',
    age_min: 0,
    age_max: 5,
    duration: 10,
    materials: ['tapis de jeu', 'couverture ferme'],
    benefits: ['motricite_globale'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Comptines et chansons',
    description:
      'Chantez des comptines simples en articulant clairement et en variant les tons de voix. Les bébés adorent les répétitions et les mélodies régulières bien avant de comprendre les mots. Cette routine quotidienne est le premier fondement du développement du langage.',
    age_min: 0,
    age_max: 5,
    duration: 5,
    materials: [],
    benefits: ['langage', 'social_emotionnel'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Mobile noir et blanc',
    description:
      'Suspendez un mobile à forts contrastes à 25-30 cm du visage de votre bébé : les nouveau-nés distinguent d\'abord le noir, le blanc et le rouge. Changez-le régulièrement pour maintenir l\'intérêt et stimuler la vision qui se développe rapidement. Un mobile fait maison avec du papier suffit.',
    age_min: 0,
    age_max: 3,
    duration: 15,
    materials: ['mobile', 'papier noir et blanc', 'carton'],
    benefits: ['eveil_sensoriel'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Massage bébé',
    description:
      'Avec une huile adaptée, massez doucement votre bébé en partant des pieds vers la tête avec de longs mouvements lents. Le toucher renforce le lien d\'attachement, soulage les coliques et aide bébé à mieux dormir. Choisissez un moment où bébé est calme et éveillé, pas juste après un repas.',
    age_min: 0,
    age_max: 5,
    duration: 15,
    materials: ['huile de massage bébé', 'serviette douce'],
    benefits: ['social_emotionnel', 'eveil_sensoriel'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Jeu du miroir',
    description:
      'Placez votre bébé face à un miroir incassable et observez-le sourire à son reflet. Il ne se reconnaît pas encore, mais réagit à ce "bébé" qui lui ressemble. Ce jeu développe la conscience d\'autrui, l\'imitation et les premières expressions émotionnelles.',
    age_min: 2,
    age_max: 5,
    duration: 10,
    materials: ['miroir incassable pour bébé'],
    benefits: ['social_emotionnel', 'eveil_sensoriel'],
    difficulty: 'facile',
    is_premium: false,
  },

  // ── 6-12 mois ────────────────────────────────────────────────────────────
  {
    title: 'Balles de textures',
    description:
      'Proposez plusieurs balles aux textures différentes : lisse, rugueuse, à picots, douce. Laissez votre bébé les explorer librement en les touchant, les portant à la bouche et les faisant rouler. Cette exploration libre développe la discrimination sensorielle et la préhension.',
    age_min: 6,
    age_max: 11,
    duration: 15,
    materials: ['balles de textures variées', 'tapis de jeu'],
    benefits: ['eveil_sensoriel', 'motricite_fine'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Coucou caché',
    description:
      'Cachez votre visage derrière vos mains ou un tissu léger, puis réapparaissez avec enthousiasme. Ce jeu enseigne la permanence de l\'objet : les personnes et les choses continuent d\'exister quand on ne les voit plus. C\'est une étape cognitive majeure entre 6 et 10 mois.',
    age_min: 6,
    age_max: 11,
    duration: 10,
    materials: ['foulard léger'],
    benefits: ['social_emotionnel', 'langage'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Exploration sensorielle culinaire',
    description:
      'Installez bébé dans sa chaise haute et proposez-lui de toucher différentes textures alimentaires : purée froide, riz cuit, compote, fromage blanc. Laissez-le explorer librement avec ses mains sans chercher à le faire manger. Accepter le désordre, c\'est accepter l\'apprentissage.',
    age_min: 8,
    age_max: 11,
    duration: 20,
    materials: ['chaise haute', 'bavette à poche', 'aliments variés en petites portions', 'bâche de sol'],
    benefits: ['eveil_sensoriel', 'motricite_fine'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Empilements et boîtes',
    description:
      'Proposez des gobelets emboîtables ou des boîtes de tailles différentes. Montrez comment empiler deux éléments, puis renversez la tour — défaire est aussi formateur que construire. Votre bébé apprend la relation cause-effet et commence à anticiper les conséquences.',
    age_min: 8,
    age_max: 11,
    duration: 15,
    materials: ['gobelets emboîtables', 'boîtes plastiques de tailles différentes'],
    benefits: ['motricite_fine', 'creativite'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Premiers livres cartonnés',
    description:
      'Feuilletez ensemble des livres avec des illustrations simples et contrastées en nommant ce que vous voyez. À cet âge, l\'intérêt pour un livre dure 2 à 5 minutes et c\'est normal. L\'objectif est d\'associer les mots aux images et d\'instaurer une routine positive autour de la lecture.',
    age_min: 6,
    age_max: 11,
    duration: 10,
    materials: ['livres cartonnés bébé'],
    benefits: ['langage', 'eveil_sensoriel'],
    difficulty: 'facile',
    is_premium: false,
  },

  // ── 12-18 mois ────────────────────────────────────────────────────────────
  {
    title: 'Marcher pieds nus',
    description:
      'Laissez votre enfant marcher pieds nus sur des surfaces variées : herbe, sable, carrelage froid, tapis épais. Les récepteurs sensoriels de la plante des pieds stimulent l\'équilibre et la proprioception. Nommez les sensations ensemble : "c\'est froid", "c\'est doux", "ça chatouille".',
    age_min: 12,
    age_max: 17,
    duration: 20,
    materials: ['tapis de textures', 'bac à sable', 'herbe'],
    benefits: ['motricite_globale', 'eveil_sensoriel'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Gribouillage aux gros crayons',
    description:
      'Proposez des crayons épais triangulaires (plus faciles à saisir) et de grandes feuilles au sol. À cet âge, les traits et les ronds n\'ont pas de signification — c\'est la découverte du geste graphique qui compte. Ne dessinez pas à sa place : laissez l\'exploration libre.',
    age_min: 12,
    age_max: 17,
    duration: 15,
    materials: ['crayons gras triangulaires', 'grandes feuilles de papier', 'tablier'],
    benefits: ['creativite', 'motricite_fine'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Boîte à formes',
    description:
      'Proposez une boîte avec 2-3 formes seulement (rond, carré, triangle). Montrez une fois comment insérer une pièce, puis laissez votre enfant essayer. La concentration nécessaire pour orienter la pièce dans le bon sens développe la coordination main-œil et la persévérance.',
    age_min: 12,
    age_max: 17,
    duration: 15,
    materials: ['boîte à formes'],
    benefits: ['motricite_fine'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Lecture interactive',
    description:
      'Lisez ensemble en posant des questions simples : "Où est le chat ?", "Comment fait le chien ?". À 12-18 mois, l\'enfant comprend beaucoup plus de mots qu\'il n\'en dit. Chaque question enrichit son vocabulaire passif et renforce la relation parent-enfant.',
    age_min: 12,
    age_max: 17,
    duration: 10,
    materials: ['livres illustrés simples', 'livres avec sons ou textures'],
    benefits: ['langage', 'social_emotionnel'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Jeu d\'eau dans le bain',
    description:
      'Proposez des tasses, un entonnoir et une passoire dans le bain. Transvaser de l\'eau d\'un récipient à l\'autre est une activité fascinante qui introduit intuitivement les notions de volume et de vide. Restez toujours à portée de main et ne laissez jamais votre enfant sans surveillance.',
    age_min: 12,
    age_max: 17,
    duration: 20,
    materials: ['tasses plastique', 'entonnoir', 'passoire', 'petits arrosoirs'],
    benefits: ['eveil_sensoriel', 'motricite_fine', 'creativite'],
    difficulty: 'facile',
    is_premium: false,
  },

  // ── 18-24 mois ────────────────────────────────────────────────────────────
  {
    title: 'Puzzle à encastrement',
    description:
      'Commencez par des puzzles à encastrement (une pièce = un emplacement) avant de passer aux puzzles 2-4 pièces. Aidez seulement quand l\'enfant est bloqué depuis une minute — la légère frustration fait partie de l\'apprentissage. Célébrez chaque réussite avec enthousiasme.',
    age_min: 18,
    age_max: 23,
    duration: 15,
    materials: ['puzzle encastrement', 'puzzle 3-4 pièces'],
    benefits: ['motricite_fine'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Peinture aux doigts',
    description:
      'Sur une grande feuille fixée au sol ou au mur, laissez votre enfant peindre librement avec ses doigts et ses paumes. Utilisez des peintures lavables non toxiques. Cette activité est un excellent défouloir créatif et sensoriel — le résultat importe moins que le processus.',
    age_min: 18,
    age_max: 23,
    duration: 20,
    materials: ['peinture lavable non toxique', 'grande feuille papier', 'tablier', 'bâche de protection'],
    benefits: ['creativite', 'motricite_fine', 'eveil_sensoriel'],
    difficulty: 'moyen',
    is_premium: false,
  },
  {
    title: 'Course poursuite',
    description:
      'Courez ensemble et encouragez votre enfant à vous attraper, puis inversez les rôles. Ce jeu simple développe l\'endurance, la conscience du corps dans l\'espace et la coordination. Les éclats de rire font partie intégrante des bénéfices — le mouvement joyeux est la meilleure des motivations.',
    age_min: 18,
    age_max: 23,
    duration: 15,
    materials: [],
    benefits: ['motricite_globale', 'social_emotionnel'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Construction de tours',
    description:
      'Avec des blocs de bois ou des boîtes légères, encouragez l\'enfant à construire la tour la plus haute possible. L\'objectif n\'est pas la hauteur mais la précision du geste et la résilience face à l\'échec quand la tour s\'effondre. Construisez ensemble puis laissez-le dépasser votre hauteur.',
    age_min: 18,
    age_max: 23,
    duration: 15,
    materials: ['blocs de bois', 'boîtes vides légères', 'légos duplo'],
    benefits: ['motricite_fine', 'creativite'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Collages libres',
    description:
      'Proposez des morceaux de papier coloré, du coton, des feuilles séchées et un carton avec une colle en bâton. Laissez coller librement sans modèle à reproduire. Le résultat n\'a aucune importance — c\'est l\'acte de choisir, saisir et placer qui développe la motricité fine et l\'expression créative.',
    age_min: 20,
    age_max: 23,
    duration: 20,
    materials: ['papier coloré découpé', 'colle en bâton', 'carton épais', 'coton', 'feuilles séchées'],
    benefits: ['creativite', 'motricite_fine'],
    difficulty: 'moyen',
    is_premium: false,
  },

  // ── 24-36 mois ────────────────────────────────────────────────────────────
  {
    title: 'Tri de couleurs',
    description:
      'Préparez 3 bols de couleurs différentes et des objets colorés à trier (pompons, crayons, légos). Demandez à votre enfant de mettre chaque objet dans le bol de sa couleur. Commencez par 2 couleurs et ajoutez progressivement — l\'objectif est la discrimination visuelle, pas la perfection.',
    age_min: 24,
    age_max: 35,
    duration: 15,
    materials: ['bols colorés', 'pompons colorés', 'légos', 'crayons de couleur'],
    benefits: ['motricite_fine', 'creativite'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Sauts et parcours moteur',
    description:
      'Dessinez des cercles à la craie ou posez des cerceaux au sol pour que votre enfant saute de l\'un à l\'autre. Ajoutez une ligne à suivre en équilibre, un coussin sur lequel atterrir. Ces mini-parcours développent la coordination, l\'équilibre et la confiance en son corps.',
    age_min: 24,
    age_max: 35,
    duration: 20,
    materials: ['craie de trottoir', 'cerceaux', 'coussins', 'adhésif coloré'],
    benefits: ['motricite_globale'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Jeu symbolique — la dînette',
    description:
      'Proposez une petite dînette et encouragez votre enfant à "préparer un repas" pour ses peluches ou pour vous. Le jeu symbolique (faire semblant) est un marqueur clé du développement cognitif vers 2 ans. Participez en tant qu\'invité pour enrichir le scénario et le vocabulaire.',
    age_min: 24,
    age_max: 35,
    duration: 30,
    materials: ['dînette jouet', 'peluches', 'petites assiettes et tasses'],
    benefits: ['social_emotionnel', 'creativite', 'langage'],
    difficulty: 'facile',
    is_premium: false,
  },
  {
    title: 'Pâte à modeler maison',
    description:
      'Fabriquez ensemble une pâte à modeler : 2 tasses de farine, 1 tasse de sel, 1 tasse d\'eau tiède, colorant alimentaire. La préparation est déjà une activité d\'éveil. Ensuite, rouler, aplatir, découper avec des emporte-pièces renforce les muscles des mains nécessaires pour l\'écriture future.',
    age_min: 24,
    age_max: 35,
    duration: 30,
    materials: ['farine', 'sel fin', 'eau', 'colorant alimentaire', 'emporte-pièces', 'rouleau'],
    benefits: ['motricite_fine', 'eveil_sensoriel', 'creativite'],
    difficulty: 'moyen',
    is_premium: false,
  },
  {
    title: 'Histoires inventées',
    description:
      'Commencez une histoire simple : "Il était une fois un lapin qui avait faim..." et demandez à votre enfant de continuer : "Et après ?" Acceptez toutes les réponses, aussi farfelues soient-elles. Ce jeu développe la narration, l\'imagination et enrichit le vocabulaire dans un cadre ludique.',
    age_min: 24,
    age_max: 35,
    duration: 15,
    materials: ['figurines ou peluches comme support optionnel'],
    benefits: ['langage', 'creativite', 'social_emotionnel'],
    difficulty: 'facile',
    is_premium: false,
  },
]

async function seed() {
  console.log(`Insertion de ${activities.length} activités...`)

  const { error } = await supabase.from('activities').insert(activities)

  if (error) {
    console.error('❌ Échec :', error.message)
    // Si l'erreur est une violation RLS, désactivez RLS sur la table activities
    // dans le dashboard Supabase (Table Editor > activities > RLS) ou utilisez
    // SUPABASE_SERVICE_ROLE_KEY à la place de NEXT_PUBLIC_SUPABASE_ANON_KEY.
    process.exit(1)
  }

  console.log(`✓ ${activities.length} activités insérées avec succès`)
}

seed()
