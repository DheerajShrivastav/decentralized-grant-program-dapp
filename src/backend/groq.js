import Groq from 'groq-sdk'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const groq = new Groq({
  apiKey:
    process.env.GROQ_API_KEY ||
    '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',
})

async function testDatabaseConnection() {
  try {
    const proposals = await prisma.proposal.findMany()
    console.log('Fetched Proposals:', proposals)
  } catch (error) {
    console.error('Error fetching proposals:', error)
  }
}
testDatabaseConnection()
// Function to fetch proposals from the database
async function fetchProposals() {
  return await prisma.proposal.findMany({
    select: {
      title: true,
      description: true,
      requestedAmount: true,
    },
  })
}

async function main() {
  try {
    const chatCompletion = await getGroqChatCompletion()
    // Print the completion returned by the LLM
    console.log('Groq AI Analysis:')
    console.log(chatCompletion.choices[0]?.message?.content || 'No response')
  } catch (error) {
    console.error('Error analyzing proposals:', error)
  }
}

export async function getGroqChatCompletion() {
  const proposals = await fetchProposals()

  // Format proposals into a readable string for Groq AI
  const proposalSummaries = proposals.map(
    (p, index) =>
      `Proposal ${index + 1}:\nTitle: ${p.title}\nDescription: ${p.description}\nRequested Amount: $${p.requestedAmount}\n`
  ).join('\n')

  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `Analyze the following proposals and provide insights:\n\n${proposalSummaries}`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
  })
}
main()
