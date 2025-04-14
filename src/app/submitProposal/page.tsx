'use client'
// app/submitProposal/page.tsx

import React, { useState } from 'react'
import { useRouter } from 'next/navigation' // Use next/navigation for routing in App Router
import { PlusCircle, Loader } from 'lucide-react'
import { Proposal, Deliverable, ProposalStatus } from '../../../types/index' // Adjust the import path as necessary

const SubmitProposal: React.FC = () => {
  const router = useRouter() // Use useRouter from next/navigation
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { title: '', description: '', dueDate: new Date() },
  ])
  const [formData, setFormData] = useState<
    Omit<Proposal, 'id' | 'createdAt' | 'status'>
  >({
    title: '',
    description: '',
    requestedAmount: 0,
    stellarAddress: '',
    deliverables: [],
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'requestedAmount' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleDeliverableChange = (
    index: number,
    field: keyof Deliverable,
    value: string
  ) => {
    const newDeliverables = [...deliverables]
    newDeliverables[index] = { ...newDeliverables[index], [field]: value }
    setDeliverables(newDeliverables)
  }

  const addDeliverable = () => {
    setDeliverables([
      ...deliverables,
      { title: '', description: '', dueDate: new Date() },
    ])
  }

  const removeDeliverable = (index: number) => {
    const newDeliverables = deliverables.filter((_, i) => i !== index)
    setDeliverables(newDeliverables)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const proposal: Omit<Proposal, 'id' | 'createdAt'> = {
        ...formData,
        deliverables: deliverables.filter(
          (d) => d.title.trim() !== '' && d.description.trim() !== ''
        ),
        status: ProposalStatus.PENDING,
      }

      // Call the API endpoint to store the proposal
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposal),
      })

      if (!response.ok) {
        throw new Error('Failed to submit proposal')
      }

      console.log('Proposal submitted successfully')
      //   router.push('/proposals') // Use router.push for navigation
    } catch (error) {
      console.error('Error submitting proposal:', error)
      alert('Failed to submit proposal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Submit a Proposal
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter proposal title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter proposal description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requested Amount
          </label>
          <input
            type="number"
            name="requestedAmount"
            value={formData.requestedAmount}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter requested amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stellar Address
          </label>
          <input
            type="text"
            name="stellarAddress"
            value={formData.stellarAddress}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your Stellar address"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Deliverables
          </h2>
          {deliverables.map((deliverable, index) => (
            <div
              key={index}
              className="mb-4 border p-4 rounded-lg border-gray-200"
            >
              <div className="flex justify-between">
                <h3 className="font-medium">Deliverable {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeDeliverable(index)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={deliverable.title}
                  onChange={(e) =>
                    handleDeliverableChange(index, 'title', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter deliverable title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={deliverable.description}
                  onChange={(e) =>
                    handleDeliverableChange(
                      index,
                      'description',
                      e.target.value
                    )
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter deliverable description"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addDeliverable}
            className="flex items-center text-indigo-600 hover:underline"
          >
            <PlusCircle className="mr-2" /> Add Deliverable
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 text-white font-semibold rounded-lg ${
            isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <Loader className="animate-spin" />
          ) : (
            'Submit Proposal'
          )}
        </button>
      </form>
    </div>
  )
}

export default SubmitProposal
