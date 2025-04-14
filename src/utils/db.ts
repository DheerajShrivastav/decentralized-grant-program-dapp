import { PrismaClient } from '@prisma/client'
import { Proposal } from '../../types/index' // Adjusted import path

const prisma = new PrismaClient()

export async function storeProposal(
  proposal: Omit<Proposal, 'id' | 'createdAt'>
): Promise<Proposal> {
  const result = await prisma.proposal.create({
    data: {
      title: proposal.title,
      description: proposal.description,
      requestedAmount: proposal.requestedAmount,
      deliverables: JSON.stringify(proposal.deliverables),
      status: proposal.status,
      stellarAddress: proposal.stellarAddress,
      createdAt: new Date(), // Set createdAt to the current date
    },
  })

  return transformProposal(result)
}

export async function retrieveProposal(id: string): Promise<Proposal> {
  const result = await prisma.proposal.findUnique({
    where: { id },
  })

  if (!result) throw new Error('Proposal not found')
  return transformProposal(result)
}

export async function listProposals(): Promise<Proposal[]> {
  const result = await prisma.proposal.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return result.map(transformProposal)
}

export async function updateProposalStatus(
  id: string,
  status: string
): Promise<void> {
  await prisma.proposal.update({
    where: { id },
    data: { status },
  })
}

export async function updateProposalVotes(
  id: string,
  votes: { for: number; against: number }
): Promise<void> {
  await prisma.proposal.update({
    where: { id },
    data: { votes },
  })
}

export async function updateAIEvaluation(
  id: string,
  evaluation: any
): Promise<void> {
  await prisma.proposal.update({
    where: { id },
    data: { aiEvaluation: evaluation },
  })
}

function transformProposal(row: any): Proposal {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    requestedAmount: Number(row.requestedAmount),
    deliverables: JSON.parse(row.deliverables),
    status: row.status,
    stellarAddress: row.stellarAddress,
    createdAt: row.createdAt,
    aiEvaluation: row.aiEvaluation,
    votes: row.votes,
  }
}
