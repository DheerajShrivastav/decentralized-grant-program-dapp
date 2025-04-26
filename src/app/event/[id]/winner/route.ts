import { NextResponse } from "next/server";
import { prisma } from "../../../../../utils/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        proposals: true,
      },
    });

    if (!event || !event.winnerProposal) {
      return NextResponse.json({ error: "Winner not found" }, { status: 404 });
    }

    // Fetch the winner proposal details 
    const winnerProposal = await prisma.proposal.findUnique({
      where: { id: event.winnerProposal },
    });

    if (!winnerProposal) {
      return NextResponse.json({ error: "Winner proposal not found" }, { status: 404 });
    }

    return NextResponse.json({
      eventTitle: event.title,
      winner: winnerProposal,
    });
  } catch (error) {
    console.error("Error fetching winner:", error);
    return NextResponse.json({ error: "Failed to fetch winner" }, { status: 500 });
  }
}