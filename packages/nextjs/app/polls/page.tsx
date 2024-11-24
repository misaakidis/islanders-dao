"use client";

import React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { POLLS_PATH, Poll } from "~~/app/polls/_common";

const Pools: NextPage = () => {
  const [polls, updatePolls] = useLocalStorage<Poll[]>(POLLS_PATH, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Polls</h1>
          <Link
            href={`/${POLLS_PATH}/create`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Create New Poll
          </Link>
        </header>
        {polls && polls.length > 0 ? (
          <ul className="space-y-4">
            {polls.map((poll: { id: React.Key | null | undefined; title: string; description: string }) => (
              <li
                key={poll.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">{poll.title}</h2>
                  <p className="text-sm text-gray-500">{poll.description}</p>
                </div>
                <Link
                  href={`/${POLLS_PATH}/${poll.id}`}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Vote
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No polls available. Be the first to create one!</p>
        )}
      </div>
    </div>
  );
};

export default Pools;
