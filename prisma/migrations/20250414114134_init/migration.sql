-- CreateTable
CREATE TABLE "proposals" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requestedAmount" DOUBLE PRECISION NOT NULL,
    "deliverables" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "stellarAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiEvaluation" JSONB,
    "votes" JSONB,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);
