import React from "react";
// import { Link } from "react-router-dom"; // Assuming you're using React Router
import Link from "next/link";

// @ts-ignore
const PollsList = ({ polls }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Polls</h1>
          <Link
            href="/create-poll"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Create New Poll
          </Link>
        </header>
        {polls && polls.length > 0 ? (
          <ul className="space-y-4">
            {polls.map(
              (poll: {
                id: React.Key | null | undefined;
                title:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<React.AwaitedReactNode>
                  | null
                  | undefined;
                description:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<React.AwaitedReactNode>
                  | null
                  | undefined;
              }) => (
                <li
                  key={poll.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">{poll.title}</h2>
                    <p className="text-sm text-gray-500">{poll.description}</p>
                  </div>
                  <Link
                    href={`/polls/${poll.id}`}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                  >
                    Vote
                  </Link>
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No polls available. Be the first to create one!</p>
        )}
      </div>
    </div>
  );
};

export default PollsList;
