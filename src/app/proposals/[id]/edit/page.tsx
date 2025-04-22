'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation' // Assuming you're using Next.js routing
import { ArrowLeftSquare } from 'lucide-react'

const EditProposal = () => {
  const router = useRouter()
  const { id } = useParams() // Get the proposal ID from the URL
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requestedAmount: 0,
    deliverables: {},
    status: 'pending',
    stellarAddress: '',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`/api/proposals/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch proposal')
        }
        const data = await response.json()
        setFormData({
          title: data.title,
          description: data.description,
          requestedAmount: data.requestedAmount,
          deliverables: data.deliverables,
          status: data.status,
          stellarAddress: data.stellarAddress || '',
        })
      } catch (error) {
        console.error('Error fetching proposal:', error)
        setError('Failed to load proposal')
      } finally {
        setLoading(false)
      }
    }

    fetchProposal()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'requestedAmount' ? parseFloat(value) : value, // Convert to number if it's requestedAmount
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update proposal')
      }

      const updatedProposal = await response.json()
      console.log('Proposal updated successfully:', updatedProposal)
      router.push('/proposals') // Redirect to proposals page after successful update
    } catch (error) {
      console.error('Error updating proposal:', error)
      setError('Failed to update proposal')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-6">
      <ArrowLeftSquare
        className="ml-20"
        size={50}
        onClick={() => router.back()}
      />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Proposal</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Proposal Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter proposal title"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter proposal description"
            />
          </div>

          {/* Requested Amount */}
          <div className="mb-4">
            <label
              htmlFor="requestedAmount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Requested Amount *
            </label>
            <input
              type="number"
              id="requestedAmount"
              name="requestedAmount"
              required
              value={formData.requestedAmount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter requested amount"
            />
          </div>

          {/* Deliverables */}
          <div className="mb-4">
            <label
              htmlFor="deliverables"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Deliverables *
            </label>
            <textarea
              id="deliverables"
              name="deliverables"
              required
              value={JSON.stringify(formData.deliverables)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliverables: JSON.parse(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter deliverables in JSON format"
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Stellar Address */}
          <div className="mb-4">
            <label
              htmlFor="stellarAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Wallet Address
            </label>
            <input
              type="text"
              id="stellarAddress"
              name="stellarAddress"
              value={formData.stellarAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter wallet address"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Update Proposal
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProposal
