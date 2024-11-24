// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

contract IslandFactory {
    ISemaphoreVerifier public verifier; // Instance of the Semaphore verifier

    struct Poll {
        uint256 id;
        string topic;
        string[] options; // Voting options
        mapping(uint8 => uint256) votes; // Votes per option
        uint256 blockHeight; // Block height when the poll was created
    }

    struct Island {
        uint256 id;
        uint256 groupId; // Semaphore group ID
        uint8 merkleTreeDepth; // Depth of the Merkle tree
        uint256[] identityCommitments; // Identity commitments of group members
        mapping(uint256 => Poll) polls; // Polls within the island
        uint256 pollCount;
    }

    mapping(uint256 => Island) public islands;
    uint256 public islandCount;

    event IslandCreated(uint256 indexed islandId, uint256 groupId);
    event MemberAdded(uint256 indexed islandId, uint256 identityCommitment);
    event PollCreated(
        uint256 indexed islandId,
        uint256 indexed pollId,
        string topic,
        string[] options,
        uint256 blockHeight
    );
    event VoteCast(
        uint256 indexed islandId,
        uint256 indexed pollId,
        uint8 optionIndex
    );

    /// @notice Initialize the contract with the Semaphore verifier address
    /// @param verifierAddress The address of the deployed Semaphore verifier contract
    constructor(address verifierAddress) {
        verifier = ISemaphoreVerifier(verifierAddress);
    }

    /// @notice Create a new Island
    /// @param merkleTreeDepth The depth of the Merkle tree for the group
    function createIsland(uint8 merkleTreeDepth) external {
        require(
            merkleTreeDepth >= 16 && merkleTreeDepth <= 32,
            "Merkle tree depth must be between 16 and 32"
        );

        islandCount++;
        uint256 groupId = islandCount; // Using islandCount as the groupId

        Island storage island = islands[islandCount];
        island.id = islandCount;
        island.groupId = groupId;
        island.merkleTreeDepth = merkleTreeDepth;

        emit IslandCreated(islandCount, groupId);
    }

    /// @notice Add a new member to an Island
    /// @param islandId The ID of the Island
    /// @param identityCommitment Semaphore identity commitment
    function addMember(uint256 islandId, uint256 identityCommitment) external {
        require(islandExists(islandId), "Island does not exist");

        Island storage island = islands[islandId];
        island.identityCommitments.push(identityCommitment);

        emit MemberAdded(islandId, identityCommitment);
    }

    /// @notice Create a new poll within an Island
    /// @param islandId The ID of the Island
    /// @param topic The topic of the poll
    /// @param options The voting options
    function createPoll(
        uint256 islandId,
        string memory topic,
        string[] memory options
    ) external {
        require(islandExists(islandId), "Island does not exist");
        require(options.length > 0, "Options cannot be empty");
        require(options.length <= 256, "Too many options, max 256");

        Island storage island = islands[islandId];
        island.pollCount++;
        Poll storage poll = island.polls[island.pollCount];
        poll.id = island.pollCount;
        poll.topic = topic;
        poll.options = options;
        poll.blockHeight = block.number;

        emit PollCreated(
            islandId,
            island.pollCount,
            topic,
            options,
            poll.blockHeight
        );
    }

    /// @notice Cast a vote in a poll within an Island
    /// @param islandId The ID of the Island
    /// @param pollId The ID of the poll
    /// @param optionIndex The index of the chosen option
    /// @param signal The signal (e.g., vote) being sent
    /// @param merkleTreeRoot The Merkle tree root of the group
    /// @param nullifierHash The nullifier hash to prevent double voting
    /// @param externalNullifier The external nullifier for the proof
    /// @param proof The zero-knowledge proof containing `a`, `b`, and `c`
    function vote(
        uint256 islandId,
        uint256 pollId,
        uint8 optionIndex,
        bytes32 signal,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external {
        require(islandExists(islandId), "Island does not exist");

        Island storage island = islands[islandId];
        require(pollExists(island, pollId), "Poll does not exist");
        require(optionIndex < island.polls[pollId].options.length, "Invalid option index");

        // Split the proof into a, b, and c components
        uint256[2] memory a = [proof[0], proof[1]];
        uint256[2][2] memory b = [[proof[2], proof[3]], [proof[4], proof[5]]];
        uint256[2] memory c = [proof[6], proof[7]];

        // Calculate the signal hash as a uint256
        uint256 signalHash = uint256(keccak256(abi.encodePacked(signal))) >> 8;

        // Construct the public signals array
        uint256[4] memory publicSignals = [
            merkleTreeRoot,
            nullifierHash,
            signalHash,
            externalNullifier
        ];

        // Verify the proof using Semaphore Verifier
        bool isValid = verifier.verifyProof(
            a,
            b,
            c,
            publicSignals,
            island.merkleTreeDepth
        );

        require(isValid, "Invalid proof");

        // Increment the vote count for the selected option
        island.polls[pollId].votes[optionIndex]++;

        emit VoteCast(islandId, pollId, optionIndex);
    }

    /// @notice Check if an Island exists
    /// @param islandId The ID of the Island
    /// @return True if the Island exists, false otherwise
    function islandExists(uint256 islandId) public view returns (bool) {
        return islandId > 0 && islandId <= islandCount;
    }

    /// @notice Check if a Poll exists within an Island
    /// @param island The Island struct
    /// @param pollId The ID of the Poll
    /// @return True if the Poll exists, false otherwise
    function pollExists(Island storage island, uint256 pollId) internal view returns (bool) {
        return pollId > 0 && pollId <= island.pollCount;
    }
}
