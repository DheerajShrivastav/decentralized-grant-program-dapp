import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
    })
    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }
    return NextResponse.json(proposal)
  } catch (error) {
    console.error('Error fetching proposal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    )
  }
}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const updatedProposal = await prisma.proposal.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(updatedProposal)
  } catch (error) {
    console.error('Error updating proposal:', error)
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    )
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.proposal.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: 'Proposal deleted successfully' })
  } catch (error) {
    console.error('Error deleting proposal:', error)
    return NextResponse.json(
      { error: 'Failed to delete proposal' },
      { status: 500 }
    )
  }
}
