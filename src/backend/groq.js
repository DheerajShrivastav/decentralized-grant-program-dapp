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

// Function to fetch proposals from the database related to a specific event
async function fetchProposals(eventId) {
  return await prisma.proposal.findMany({
    where: { eventId }, // Filter by eventId
    select: {
      id: true, // Include the ID for updating the winner
      title: true,
      description: true,
      requestedAmount: true,
      votes: true,
    },
  })
}

async function fetchEventDetails(eventId) {
  return await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      title: true,
      description: true,
    },
  })
}

async function main() {
  try {
    const eventId = 'cm9nn3ssf0006keer4d8y1lgc'
    const chatCompletion = await getGroqChatCompletion(eventId)
    // Print the completion returned by the LLM
    console.log('Groq AI Analysis:')
    const analysis =
      chatCompletion.choices[0]?.message?.content || 'No response'
    console.log(analysis)
    // Extract the winner from the analysis
    const proposals = await fetchProposals(eventId) // Fetch proposals again to pass to the function
    const winnerId = extractWinnerFromAnalysis(analysis, proposals)
    console.log('Winner Proposal ID:', winnerId)

    if (winnerId) {
      await prisma.event.update({
        where: { id: eventId },
        data: { winnerProposal: winnerId }, // Update with the actual proposal ID
      })
    }
  } catch (error) {
    console.error('Error analyzing proposals:', error)
  }
}

function extractWinnerFromAnalysis(analysis, proposals) {
  // Implement logic to extract the winner's ID from the Groq AI response
  const match = analysis.match(/Proposal (\d+)/)
  if (match) {
    const proposalIndex = parseInt(match[1], 10) - 1 // Convert to zero-based index
    if (proposalIndex >= 0 && proposalIndex < proposals.length) {
      return proposals[proposalIndex].id // Return the actual ID
    }
  }

  // If no match found, determine the proposal with the highest votes
  const validProposals = proposals.filter((p) => typeof p.votes === 'number')
  if (validProposals.length === 0) {
    return null // No valid proposals with numeric votes
  }

  // Find the proposal with the highest votes
  const winnerProposal = validProposals.reduce((prev, current) => {
    return prev.votes > current.votes ? prev : current
  })

  return winnerProposal.id // Return the ID of the proposal with the highest votes
}

export async function getGroqChatCompletion(eventId) {
  const proposals = await fetchProposals(eventId) // Fetch proposals related to the event
  const event = await fetchEventDetails(eventId)

  if (!event) {
    throw new Error('Event not found')
  }

  // Format event details and proposals into a readable string for Groq AI
  const eventDetails = `Event Title: ${event.title}\nDescription: ${event.description}\n`
  const proposalSummaries = proposals
    .map(
      (p, index) =>
        `Proposal ${index + 1}:\nTitle: ${p.title}\nDescription: ${
          p.description
        }\nRequested Amount: $${p.requestedAmount}\nVotes: ${p.votes || 0}\n`
    )
    .join('\n')
  const content = `Analyze the following event and proposals. Based on the event's title and description, determine which proposal aligns most closely with the event and has the highest votes:\n\n${eventDetails}\nProposals:\n${proposalSummaries}`

  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    model: 'llama-3.3-70b-versatile',
  })
}

main()
