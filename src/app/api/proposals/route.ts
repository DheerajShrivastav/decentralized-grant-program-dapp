// app/api/proposals/route.ts

import { NextResponse } from 'next/server'
import {
  storeProposal,
  retrieveProposal,
  listProposals,
  updateProposalStatus,
  updateProposalVotes,
  updateAIEvaluation,
} from '../../../utils/db' // Adjust the import path to your db.ts file
import { Proposal } from '../../../../types/index' // Adjust the import path as necessary

// POST /api/proposals
export async function POST(request: Request) {
  try {
    const proposalData: Omit<Proposal, 'id' | 'createdAt'> =
      await request.json()
    const newProposal = await storeProposal(proposalData)
    return NextResponse.json(newProposal, { status: 201 })
  } catch (error) {
    console.error('Error creating proposal:', error)
    return NextResponse.json(
      { message: 'Error creating proposal' },
      { status: 500 }
    )
  }
}

// GET /api/proposals
export async function GET() {
  try {
    const proposals = await listProposals()
    return NextResponse.json(proposals)
  } catch (error) {
    console.error('Error retrieving proposals:', error)
    return NextResponse.json(
      { message: 'Error retrieving proposals' },
      { status: 500 }
    )
  }
}

// GET /api/proposals/:id
export async function GET_BY_ID(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const proposal = await retrieveProposal(id)
    return NextResponse.json(proposal)
  } catch (error) {
    console.error('Error retrieving proposal:', error)
    return NextResponse.json({ message: 'Proposal not found' }, { status: 404 })
  }
}

// PATCH /api/proposals/:id/status
export async function PATCH_STATUS(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { status } = await request.json()
  try {
    await updateProposalStatus(id, status)
    return NextResponse.json({ message: 'Proposal status updated' })
  } catch (error) {
    console.error('Error updating proposal status:', error)
    return NextResponse.json(
      { message: 'Error updating proposal status' },
      { status: 500 }
    )
  }
}

// PATCH /api/proposals/:id/votes
export async function PATCH_VOTES(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { votes } = await request.json()
  try {
    await updateProposalVotes(id, votes)
    return NextResponse.json({ message: 'Proposal votes updated' })
  } catch (error) {
    console.error('Error updating proposal votes:', error)
    return NextResponse.json(
      { message: 'Error updating proposal votes' },
      { status: 500 }
    )
  }
}

// PATCH /api/proposals/:id/evaluation
export async function PATCH_EVALUATION(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { evaluation } = await request.json()
  try {
    await updateAIEvaluation(id, evaluation)
    return NextResponse.json({ message: 'Proposal AI evaluation updated' })
  } catch (error) {
    console.error('Error updating AI evaluation:', error)
    return NextResponse.json(
      { message: 'Error updating AI evaluation' },
      { status: 500 }
    )
  }
}
