import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
    });
    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }
    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json({ error: "Failed to fetch proposal" }, { status: 500 });
  }
}