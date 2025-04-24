import Groq from 'groq-sdk'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
    const eventId = 'your-event-id'
    const chatCompletion = await getGroqChatCompletion()
    // Print the completion returned by the LLM
    console.log('Groq AI Analysis:')
    const analysis =
      chatCompletion.choices[0]?.message?.content || 'No response'
    console.log(analysis)
    // Extract the winner from the analysis (you can customize this logic)
    const winner = extractWinnerFromAnalysis(analysis)
    console.log('Winner Proposal:', winner)

    if (winner) {
      await prisma.event.update({
        where: { id: eventId },
        data: { winnerProposal: winner },
      })
    }
  } catch (error) {
    console.error('Error analyzing proposals:', error)
  }
}
function extractWinnerFromAnalysis(analysis) {
  // Implement logic to extract the winner from the Groq AI response
  // For example, parse the response to find the proposal with the highest score
  const match = analysis.match(/Proposal (\d+)/)
  return match ? `Proposal ${match[1]}` : null
}
export async function getGroqChatCompletion() {
  const proposals = await fetchProposals()

  // Format proposals into a readable string for Groq AI
  const proposalSummaries = proposals
    .map(
      (p, index) =>
        `Proposal ${index + 1}:\nTitle: ${p.title}\nDescription: ${
          p.description
        }\nRequested Amount: $${p.requestedAmount}\n`
    )
    .join('\n')

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
