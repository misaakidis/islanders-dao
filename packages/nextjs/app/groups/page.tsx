"use client";

import React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { GROUPS_PATH, Group } from "~~/app/groups/_common";

const Pools: NextPage = () => {
  const [groups, updateGroups] = useLocalStorage<Group[]>(GROUPS_PATH, []);

  const join = (id: number) => {
    const group = groups.find(g => g.id === id);
    if (group) {
      group.joined = true;
      updateGroups(groups);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
          <Link
            href={`/${GROUPS_PATH}/create`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Create New Group
          </Link>
        </header>
        {groups && groups.length > 0 ? (
          <ul className="space-y-4">
            {groups.map((group: Group) => (
              <li
                key={group.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">{group.title}</h2>
                  <p className="text-sm text-gray-500">{group.description}</p>
                </div>

                {group.joined ? (
                  "joined"
                ) : (
                  <button onClick={() => join(group.id)} className="btn btn-sm btn-secondary">
                    Join
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No groups available. Be the first to create one!</p>
        )}
      </div>
    </div>
  );
};

export default Pools;
