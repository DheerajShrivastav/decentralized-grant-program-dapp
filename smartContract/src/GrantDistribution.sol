// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GrantDistribution {
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 requestedAmount;
        bool approved;
        bool exists;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    address public admin;

    event ProposalSubmitted(
        uint256 id,
        address proposer,
        string title,
        uint256 requestedAmount
    );
    event ProposalApproved(uint256 id, address proposer);
    event GrantDistributed(uint256 id, address recipient, uint256 amount);

    constructor() {
        admin = msg.sender; // Set the contract deployer as the admin
    }

    function submitProposal(
        string memory title,
        string memory description,
        uint256 requestedAmount
    ) public {
        proposalCount++;
        proposals[proposalCount] = Proposal(
            proposalCount,
            msg.sender,
            title,
            description,
            requestedAmount,
            false,
            true
        );
        emit ProposalSubmitted(
            proposalCount,
            msg.sender,
            title,
            requestedAmount
        );
    }

    function approveProposal(uint256 id) public {
        require(msg.sender == admin, "Only admin can approve proposals");
        Proposal storage proposal = proposals[id];
        require(proposal.exists, "Proposal does not exist");
        require(!proposal.approved, "Proposal already approved");

        proposal.approved = true;
        emit ProposalApproved(id, proposal.proposer);
    }

    function distributeGrant(uint256 id) public {
        Proposal storage proposal = proposals[id];
        require(proposal.approved, "Proposal not approved");
        require(
            address(this).balance >= proposal.requestedAmount,
            "Insufficient contract balance"
        );

        payable(proposal.proposer).transfer(proposal.requestedAmount);
        emit GrantDistributed(id, proposal.proposer, proposal.requestedAmount);
    }

    // Function to receive Ether
    receive() external payable {}
}
