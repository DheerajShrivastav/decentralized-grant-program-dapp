'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Proposal } from '../../../../../types/index'

const EditProposalPage: React.FC = () => {
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/proposals/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch proposal')
        }
        const data = await response.json()
        setProposal(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProposal()
  }, [params.id])

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/proposals/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposal),
      })

      if (!response.ok) {
        throw new Error('Failed to save proposal')
      }

      router.push('/proposals')
    } catch (err) {
      console.error(err)
      alert('Failed to save proposal.')
    }
  }

  if (loading) {
    return <div>Loading proposal...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Proposal</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSave()
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={proposal.title}
            onChange={(e) =>
              setProposal({ ...proposal, title: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={proposal.description}
            onChange={(e) =>
              setProposal({ ...proposal, description: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditProposalPage
