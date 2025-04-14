// types.ts

// Enum for Proposal Status
export enum ProposalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

// Type for Deliverables
export interface Deliverable {
  title: string
  description: string
  dueDate: Date
}

// Type for Votes
export interface Votes {
  for: number
  against: number
}

// Type for AI Evaluation
export interface AIEvaluation {
  score: number
  comments?: string
}

// Type for Proposal
export interface Proposal {
  id: string // Unique identifier for the proposal
  title: string // Title of the proposal
  description: string // Description of the proposal
  requestedAmount: number // Amount requested for the proposal
  deliverables: Deliverable[] // List of deliverables
  status: ProposalStatus // Current status of the proposal
  stellarAddress?: string // Optional Stellar address for payouts
  createdAt: Date // Timestamp of creation
  aiEvaluation?: AIEvaluation // Optional AI evaluation results
  votes?: Votes // Optional votes
}

// Type for User
export interface User {
  id: string // Unique identifier for the user
  username: string // Username of the user
  email: string // Email of the user
  walletAddress: string // Wallet address of the user
}

// Type for API Response
export interface ApiResponse<T> {
  success: boolean // Indicates if the API call was successful
  data?: T // The data returned from the API
  error?: string // Error message if the API call failed
}

// Type for Proposal Submission
export interface ProposalSubmission {
  title: string // Title of the proposal
  description: string // Description of the proposal
  requestedAmount: number // Amount requested for the proposal
  deliverables: Deliverable[] // List of deliverables
  stellarAddress?: string // Optional Stellar address for payouts
}

// Type for Voting
export interface Voting {
  proposalId: string // ID of the proposal being voted on
  vote: 'for' | 'against' // Vote choice
}

// Type for Evaluation Result
export interface EvaluationResult {
  proposalId: string // ID of the proposal being evaluated
  evaluation: AIEvaluation // Evaluation details
}

// Type for Pagination
export interface Pagination {
  page: number // Current page number
  pageSize: number // Number of items per page
  totalItems: number // Total number of items
}

// Type for Proposals List Response
export interface ProposalsListResponse {
  proposals: Proposal[] // List of proposals
  pagination: Pagination // Pagination details
}
