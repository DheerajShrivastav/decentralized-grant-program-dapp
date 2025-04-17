// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {GrantDistribution} from "../src/GrantDistribution.sol";
import {console} from "forge-std/console.sol";

contract DeployGrantDistribution is Script {
    GrantDistribution public grantDistribution;
    address[] public proposerAddresses;

    constructor() {}

    function run() external returns (GrantDistribution) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);
        grantDistribution = new GrantDistribution();
        vm.stopBroadcast();
        console.log(
            "GrantDistribution contract deployed at:",
            address(grantDistribution)
        );
        return (grantDistribution);
    }
}
