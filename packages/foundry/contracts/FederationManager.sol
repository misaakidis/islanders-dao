// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IslandFactory.sol";

contract FederationManager {
    IslandFactory public islandFactory;

    // Mapping of group ID to its parent (supergroup) ID
    mapping(uint256 => uint256) public supergroup;

    // Mapping of group ID to its children (subgroups)
    mapping(uint256 => uint256[]) public subgroups;

    // Event emitted when a federation is created
    event FederationCreated(uint256 indexed supergroupId, uint256 indexed subgroupId);

    /// @notice Initialize the contract with the IslandFactory address
    /// @param islandFactoryAddress The address of the IslandFactory contract
    constructor(address islandFactoryAddress) {
        islandFactory = IslandFactory(islandFactoryAddress);
    }

    /// @notice Federate two islands by creating a hierarchical relationship
    /// @param supergroupId The ID of the supergroup (parent)
    /// @param subgroupId The ID of the subgroup (child)
    function createFederation(uint256 supergroupId, uint256 subgroupId) external {
        require(
            islandFactory.islandExists(supergroupId),
            "Supergroup does not exist in IslandFactory"
        );
        require(
            islandFactory.islandExists(subgroupId),
            "Subgroup does not exist in IslandFactory"
        );
        require(supergroupId != subgroupId, "A group cannot federate with itself");
        require(supergroup[subgroupId] == 0, "Subgroup is already federated");

        // Set the supergroup for the subgroup
        supergroup[subgroupId] = supergroupId;

        // Add the subgroup to the list of subgroups for the supergroup
        subgroups[supergroupId].push(subgroupId);

        emit FederationCreated(supergroupId, subgroupId);
    }

    /// @notice Get the supergroup of a given group
    /// @param groupId The ID of the group
    /// @return The ID of the supergroup
    function getSupergroup(uint256 groupId) external view returns (uint256) {
        return supergroup[groupId];
    }

    /// @notice Get the subgroups of a given group
    /// @param groupId The ID of the group
    /// @return An array of subgroup IDs
    function getSubgroups(uint256 groupId) external view returns (uint256[] memory) {
        return subgroups[groupId];
    }

    /// @notice Get the entire hierarchy of supergroups for a given group
    /// @param groupId The ID of the group
    /// @return An array of ancestor group IDs (from closest to farthest ancestor)
    function getSupergroupHierarchy(uint256 groupId) external view returns (uint256[] memory) {
        uint256[] memory ancestors = new uint256[](getHierarchyDepth(groupId));
        uint256 currentGroup = groupId;
        uint256 index = 0;

        while (supergroup[currentGroup] != 0) {
            ancestors[index] = supergroup[currentGroup];
            currentGroup = supergroup[currentGroup];
            index++;
        }

        return ancestors;
    }

    /// @notice Get the entire hierarchy of subgroups for a given group
    /// @param groupId The ID of the group
    /// @return An array of all descendant group IDs
    function getSubgroupHierarchy(uint256 groupId) external view returns (uint256[] memory) {
        uint256[] memory descendants = new uint256[](getSubgroupCount(groupId));
        uint256 count = 0;

        _collectSubgroups(groupId, descendants, count);

        return descendants;
    }

    /// @notice Helper function to collect subgroups recursively
    /// @param groupId The current group being processed
    /// @param descendants The array to store the descendant group IDs
    /// @param count The current count of descendants
    function _collectSubgroups(
        uint256 groupId,
        uint256[] memory descendants,
        uint256 count
    ) internal view {
        uint256[] memory children = subgroups[groupId];
        for (uint256 i = 0; i < children.length; i++) {
            descendants[count] = children[i];
            count++;
            _collectSubgroups(children[i], descendants, count);
        }
    }

    /// @notice Get the number of all descendants for a given group
    /// @param groupId The ID of the group
    /// @return The total number of descendants
    function getSubgroupCount(uint256 groupId) public view returns (uint256) {
        uint256 count = subgroups[groupId].length;

        for (uint256 i = 0; i < subgroups[groupId].length; i++) {
            count += getSubgroupCount(subgroups[groupId][i]);
        }

        return count;
    }

    /// @notice Get the depth of the hierarchy for a given group
    /// @param groupId The ID of the group
    /// @return The depth of the hierarchy
    function getHierarchyDepth(uint256 groupId) public view returns (uint256) {
        uint256 depth = 0;
        uint256 currentGroup = groupId;

        while (supergroup[currentGroup] != 0) {
            depth++;
            currentGroup = supergroup[currentGroup];
        }

        return depth;
    }
}
