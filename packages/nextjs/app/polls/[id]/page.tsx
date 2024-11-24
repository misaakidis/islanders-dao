"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { Option, POLLS_PATH, Poll } from "~~/app/polls/_common";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();

  const [pollData, updatePolls] = useLocalStorage<Poll[]>(POLLS_PATH, []);
  const [selectedOption, setSelectedOption] = useState<Option>();

  const poll = pollData.find(p => p.id === parseInt(id));
  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-xl font-bold text-gray-800">Poll Not Found</h1>
          <p className="text-gray-600">The poll you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const handleVote = () => {
    if (selectedOption) {
      selectedOption.count++;
      updatePolls(pollData);
      router.push(`/${POLLS_PATH}`);
      alert("Your vote has been recorded!");
    } else {
      alert("Please select an option before voting.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">{poll.title}</h1>
        <p className="text-gray-600 mb-4">{poll.description}</p>
        <form className="space-y-4">
          {poll.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`option-${index}`}
                name="poll-option"
                value={option.value}
                onChange={() => setSelectedOption(option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`option-${index}`} className="ml-2 text-gray-700">
                {option.label} [{option.count}]
              </label>
            </div>
          ))}
        </form>
        <button
          onClick={handleVote}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
}
