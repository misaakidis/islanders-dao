"use client"

import type {NextPage} from "next"
import {useState} from "react"

const CreatePoll: NextPage = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState([""])

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!title.trim() || options.some((opt) => !opt.trim())) {
      alert("Please fill in all fields and options.")
      return
    }
    // onSubmit({ title, description, options });
    setTitle("")
    setDescription("")
    setOptions([""])
    alert("Poll created successfully!")
  }

  return (<div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Create New Poll</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Poll Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={3}
            />
          </div>
          <div>
            <label
              htmlFor="options"
              className="block text-sm font-medium text-gray-700"
            >
              Options
            </label>
            {options.map((option, index) => (<div key={index} className="flex items-center space-x-4 mt-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
                {options.length > 1 && (<button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Remove
                  </button>)}
              </div>))}
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Add Option
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-semibold"
          >
            Create Poll
          </button>
        </form>
      </div>
    </div>)
}

export default CreatePoll
