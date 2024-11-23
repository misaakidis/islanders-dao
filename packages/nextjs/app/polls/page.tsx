import PollsList from "./_components/PollsList";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Pools: NextPage = () => {
  const polls = [
    { id: 1, title: "Favorite Programming Language?", description: "Vote for your favorite language!" },
    { id: 2, title: "Best Movie of 2024?", description: "Choose the best film of the year." },
  ];

  // pools = usePools()
  return (
    <>
      <PollsList polls={polls} />
    </>
  );
};

export default Pools;
