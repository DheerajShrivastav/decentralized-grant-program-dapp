"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const FullProposalPage: React.FC = () => {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/proposals/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch proposal");
        }
        const data = await response.json();
        setProposal(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [params.id]);

  if (loading) {
    return <div>Loading proposal...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{proposal.title}</h1>
      <p className="text-gray-600 mb-4">{proposal.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        Status: <span className="font-medium">{proposal.status}</span>
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Requested Amount: ${proposal.requestedAmount}
      </p>
      <p className="text-sm text-gray-500">
        Deliverables: {JSON.stringify(proposal.deliverables)}
      </p>
    </div>
  );
};

export default FullProposalPage;