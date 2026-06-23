import Anthropic from '@anthropic-ai/sdk'
import type { Activity } from '@/features/activites/types'
import type { AgeInMonths } from '@/features/enfant/types'

// TODO: supprimer isMockMode et getMockSuggestion dès que ANTHROPIC_API_KEY est disponible.
function isMockMode(): boolean {
  return !process.env.ANTHROPIC_API_KEY || process.env.MOCK_AI === 'true'
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

  // Client instancié ici et non au niveau module : new Anthropic() lève une erreur
  // immédiate si ANTHROPIC_API_KEY est absent, ce qui planterait le serveur même en mock.
  const client = new Anthropic()

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: buildPrompt(activity, ageInMonths),
      },
    ],
  })

  const block = message.content[0]
  // Type guard : l'API peut retourner des blocs tool_use ou image, pas seulement du texte
  if (block.type !== 'text') throw new Error("Réponse inattendue de l'API Claude")
  return block.text
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
