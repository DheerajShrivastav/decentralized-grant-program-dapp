"use client";

import React, { useEffect, useState } from "react";

const ProposalsPage: React.FC = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);

        // Fetch proposals from the API
        const response = await fetch("/api/proposals");
        if (!response.ok) {
          throw new Error("Failed to fetch proposals");
        }

        const data = await response.json();
        setProposals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Proposals</h1>
      {proposals.length === 0 ? (
        <p>You have not submitted any proposals yet.</p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((proposal) => (
            <li
              key={proposal.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{proposal.title}</h2>
              <p className="text-gray-600">{proposal.description}</p>
              <p className="text-sm text-gray-500">
                Status: <span className="font-medium">{proposal.status}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProposalsPage;