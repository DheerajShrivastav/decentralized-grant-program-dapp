// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {Test, console} from "forge-std/Test.sol";
import {GrantDistribution} from "../../src/GrantDistribution.sol";
import {DeployGrantDistribution} from "../../script/DepolyGrantDistribution.sol";

// import {ERC20Mock} from "../mocks/ERC20Mock.sol";

contract GrantDistributionTest is Test {
    GrantDistribution public grantDistribution;

    uint256 public constant STARTING_USER_BALANCE = 10 ether;
    uint256 public constant STARTING_USER2_BALANCE = 0 ether;
    uint256 public constant STARTING_DEPLOYER_BALANCE = 100 ether;

    address public deployer;
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");

    GrantDistribution.Proposal public proposal;

    // HelperConfig public config;
    DeployGrantDistribution public deployerContract;

    function setUp() public {
        deployerContract = new DeployGrantDistribution();
        (grantDistribution) = deployerContract.run();
        // config = new HelperConfig(); // Initialize the config object
        // (, , , , uint256 deployerKey) = config.activeNetworkConfig();
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerKey); // Initialize the deployer address
        address grantDistributionAddress = address(grantDistribution);
        vm.deal(user1, STARTING_USER_BALANCE);
        vm.deal(user2, STARTING_USER2_BALANCE);
        vm.deal(grantDistributionAddress, STARTING_DEPLOYER_BALANCE);
    }

    function testSubmitProposal() public {
        vm.startPrank(user1);
        grantDistribution.submitProposal("Title", "Description", 100);
        vm.stopPrank();

        (
            uint256 id,
            address proposer,
            string memory title,
            string memory description,
            uint256 requestedAmount,
            bool exists,
            bool approved
        ) = grantDistribution.proposals(1);
        proposal = GrantDistribution.Proposal({
            id: id,
            proposer: proposer,
            title: title,
            description: description,
            requestedAmount: requestedAmount,
            exists: exists,
            approved: approved
        });
        assertEq(proposal.id, 1);
        assertEq(proposal.proposer, user1);
        assertEq(proposal.title, "Title");
        assertEq(proposal.description, "Description");
        assertEq(proposal.requestedAmount, 100);
        assertFalse(proposal.exists, "Proposal should exist");
        assertTrue(proposal.approved, "Proposal should not be approved");
    }

    function testApproveProposal() public {
        vm.startPrank(user1);
        grantDistribution.submitProposal("Title", "Description", 100);
        vm.stopPrank();

        vm.startPrank(deployer);
        grantDistribution.approveProposal(1);
        vm.stopPrank();

        (
            uint256 id,
            address proposer,
            string memory title,
            string memory description,
            uint256 requestedAmount,
            bool exists,
            bool approved
        ) = grantDistribution.proposals(1);
        proposal = GrantDistribution.Proposal({
            id: id,
            proposer: proposer,
            title: title,
            description: description,
            requestedAmount: requestedAmount,
            exists: exists,
            approved: approved
        });
        assertTrue(proposal.approved);
    }

    function testDistributeGrant() public {
        vm.startPrank(user1);
        grantDistribution.submitProposal("Title", "Description", 1 ether);
        vm.stopPrank();

        vm.startPrank(deployer);
        grantDistribution.approveProposal(1);
        vm.stopPrank();

        vm.startPrank(deployer);
        grantDistribution.distributeGrant(1);
        vm.stopPrank();
        console.log("balance", address(user1).balance);
        assertEq(address(proposal.proposer).balance, proposal.requestedAmount);
    }
}
