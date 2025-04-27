'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Proposal } from '../../../../../types/index'

const ProposalsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[] | null>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/event/${id}/proposals`)
        if (!response.ok) {
          throw new Error('Failed to fetch proposals')
        }
        const data = await response.json()
        setProposals(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [])

  if (loading) {
    return <div>Loading proposals...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const handleView = (proposalId: string) => {
    router.push(`/proposals/${proposalId}`)
  }

  const handleEdit = (proposalId: string) => {
    router.push(`/proposals/${proposalId}/edit`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Proposals</h1>
      {proposals?.length === 0 ? (
        <p>No proposals submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {proposals?.map((proposal) => (
            <li
              key={proposal.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{proposal.title}</h2>
              <p className="text-gray-600">{proposal.description}</p>
              <p className="text-sm text-gray-500">
                Status: <span className="font-medium">{proposal.status}</span>
              </p>
              <p className="text-sm text-gray-500">
                Requested Amount: ${proposal.requestedAmount}
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleView(proposal.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  View Full Proposal
                </button>
                <button
                  onClick={() => handleEdit(proposal.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Edit Proposal
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <button
          onClick={() => router.push(`/event/${id}/evaluate`)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Evaluate Proposals
        </button>
      </div>
    </div>
  )
}

export default ProposalsPage
