'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeftSquare } from 'lucide-react'

const CreateNewEvent = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    mode: 'online',
    type: 'hackathon',
    tags: [] as string[],
    prizes: [
      { title: '', amount: '' }, // First prize
      { title: '', amount: '' }, // Second prize
      { title: '', amount: '' }, // Third prize
    ],
    banner: null as File | null,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    location: '',
    maxParticipants: '',
    eligibility: '',
    rulesAndGuidelines: '',
  })

  const [tagInput, setTagInput] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    if (name.includes('.')) {
      const [parent, child] = name.split('.') as [keyof typeof formData, string]
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent] as Record<string, any>),
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleTagAdd = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput],
      })
      setTagInput('')
    }
  }

  const handleTagRemove = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      setFormData({
        ...formData,
        banner: file,
      })

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePrizeChange = (
    index: number,
    field: 'title' | 'amount',
    value: string
  ) => {
    const updatedPrizes = [...formData.prizes]
    updatedPrizes[index][field] = value
    setFormData({ ...formData, prizes: updatedPrizes })
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    // Prepare form data for submission
    const dataToSubmit = {
      ...formData,
      prizes: formData.prizes.filter((prize) => prize.title || prize.amount), // Filter out empty prizes
      banner: formData.banner ? await uploadImage(formData.banner) : null, // Handle image upload if necessary
    }

    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      const newEvent = await response.json()
      console.log('Event created successfully:', newEvent)
      router.push('/events') // Redirect to events page after successful creation
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  const uploadImage = async (file: File) => {
    // Implement your image upload logic here
    // For example, you might upload the image to a cloud storage service and return the URL
    return 'uploaded_image_url' // Replace with actual uploaded image URL
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-6">
      <ArrowLeftSquare className="ml-20" size={50} />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event title"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your event"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="mode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Mode *
                </label>
                <select
                  id="mode"
                  name="mode"
                  required
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="ideathon">Ideathon</option>
                  <option value="ctf">CTF (Capture The Flag)</option>
                  <option value="workshop">Workshop</option>
                  <option value="conference">Conference</option>
                </select>
              </div>
            </div>

            {formData.mode === 'offline' || formData.mode === 'hybrid' ? (
              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required={
                    formData.mode === 'offline' || formData.mode === 'hybrid'
                  }
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px- 4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event location"
                />
              </div>
            ) : null}
          </div>

          {/* Tags */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Event Tags</h2>

            <div className="flex items-center mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add tags (e.g., blockchain, AI, Web3)"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 text-blue-800 hover:text-blue-600 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Prizes */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Prize Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.prizes.map((prize, index) => (
                <div key={index}>
                  <label
                    htmlFor={`prizes.${index}.title`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {index === 0
                      ? 'First Prize *'
                      : index === 1
                      ? 'Second Prize'
                      : 'Third Prize'}
                  </label>
                  <input
                    type="text"
                    id={`prizes.${index}.title`}
                    name={`prizes.${index}.title`}
                    required={index === 0}
                    value={prize.title}
                    onChange={(e) =>
                      handlePrizeChange(index, 'title', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Prize Title"
                  />
                  <input
                    type="text"
                    id={`prizes.${index}.amount`}
                    name={`prizes.${index}.amount`}
                    value={prize.amount}
                    onChange={(e) =>
                      handlePrizeChange(index, 'amount', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    placeholder="Prize Amount"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Banner */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Event Banner</h2>

            <div className="mb-4">
              <label
                htmlFor="banner"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Banner Image *
              </label>
              <input
                type="file"
                id="banner"
                name="banner"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {previewImage && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </p>
                <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={previewImage}
                    alt="Banner Preview"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="contactName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  required
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Additional Information
            </h2>

            <div className="mb-4">
              <label
                htmlFor="maxParticipants"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Maximum Participants
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave blank for unlimited"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="eligibility"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Eligibility Criteria
              </label>
              <textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Who can participate in this event?"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="rulesAndGuidelines"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rules and Guidelines
              </label>
              <textarea
                id="rulesAndGuidelines"
                name="rulesAndGuidelines"
                value={formData.rulesAndGuidelines}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any specific rules or guidelines participants should follow"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateNewEvent
