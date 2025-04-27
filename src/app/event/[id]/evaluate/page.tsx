'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const EvaluateProposal = ({ eventId }: { eventId: String }) => {
  const router = useRouter()
  const { id } = useParams()
  interface Proposal {
    id: string
    title: string
  }

  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selectedProposalId, setSelectedProposalId] = useState('')
  const [evaluation, setEvaluation] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(`/api/event/${id}/proposals`)
        if (!response.ok) {
          throw new Error('Failed to fetch proposals')
        }
        const data = await response.json()
        console.log('Fetched proposals:', data) // Log the fetched proposals
        setProposals(data)
      } catch (error) {
        console.error('Error fetching proposals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [id])

  if (loading) {
    return <div>Loading proposals...</div>
  }

  if (proposals.length === 0) {
    return <div>No proposals available for this event.</div>
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/event/${id}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposalId: selectedProposalId,
          evaluation,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate proposal')
      }

      const result = await response.json()
      console.log('Evaluation submitted successfully:', result)
      router.push('/events') // Redirect after successful evaluation
    } catch (error) {
      console.error('Error submitting evaluation:', error)
    }
  }

  if (loading) {
    return <div>Loading proposals...</div>
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Evaluate Proposals
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="proposal"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Proposal *
          </label>
          <select
            id="proposal"
            value={selectedProposalId}
            onChange={(e) => setSelectedProposalId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a Proposal --</option>
            {proposals.map((proposal) => (
              <option key={proposal.id} value={proposal.id}>
                {proposal.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="evaluation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Evaluation *
          </label>
          <textarea
            id="evaluation"
            value={evaluation}
            onChange={(e) => setEvaluation(e.target.value)}
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your evaluation for the selected proposal"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Evaluation
          </button>
        </div>
      </form>
    </div>
  )
}

export default EvaluateProposal
