import Groq from 'groq-sdk'
import type { Activity } from '@/features/activites/types'
import type { AgeInMonths } from '@/features/enfant/types'

// MOCK_AI=true permet de développer l'UI sans consommer le quota Groq.
function isMockMode(): boolean {
  return !process.env.GROQ_API_KEY || process.env.MOCK_AI === 'true'
}

async function getMockSuggestion(activity: Activity, ageInMonths: AgeInMonths): Promise<string> {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000))
  return (
    `[MOCK] Pour « ${activity.title} » avec un enfant de ${ageInMonths} mois : ` +
    `commencez par des sessions courtes de 5 minutes, guidez doucement les gestes, ` +
    `et célébrez chaque tentative avec enthousiasme !`
  )
}

export async function getActivitySuggestion(
  activity: Activity,
  ageInMonths: AgeInMonths
): Promise<string> {
  if (isMockMode()) {
    return getMockSuggestion(activity, ageInMonths)
  }

  // Client instancié ici et non au niveau module : new Groq() lève une erreur
  // immédiate si GROQ_API_KEY est absent, ce qui planterait le serveur même en mock.
  const client = new Groq()

  const completion = await client.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    max_tokens: 512,
    // gpt-oss raisonne avant de répondre et ce raisonnement consomme max_tokens :
    // un effort bas laisse la place à la réponse, et on ne renvoie pas le
    // raisonnement au client, il n'est pas destiné aux parents.
    reasoning_effort: 'low',
    include_reasoning: false,
    messages: [
      {
        role: 'user',
        content: buildPrompt(activity, ageInMonths),
      },
    ],
  })

  const content = completion.choices[0]?.message.content
  if (!content) throw new Error("Réponse vide de l'API Groq")
  return content
}

function buildPrompt(activity: Activity, ageInMonths: AgeInMonths): string {
  const materialsText =
    activity.materials.length > 0
      ? `Matériaux : ${activity.materials.join(', ')}`
      : 'Aucun matériau nécessaire'

  return `Tu aides des parents à adapter des activités pour leur jeune enfant.

Activité : ${activity.title}
Description : ${activity.description}
${materialsText}
Durée : ${activity.duration} min
Difficulté : ${activity.difficulty}
Âge de l'enfant : ${ageInMonths} mois

Donne 2 ou 3 conseils concrets et pratiques pour adapter cette activité à un enfant de ${ageInMonths} mois. Sois chaleureux, précis et bref. Réponds directement en français, sans formatage markdown.`
}
