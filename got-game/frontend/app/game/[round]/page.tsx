"use client";

import { useParams } from "next/navigation";
import RoundOnePage from "@/components/game/RoundOne";
import RoundTwoPage from "@/components/game/RoundTwo";
import RoundThreePage from "@/components/game/RoundThree";
import RoundFourPage from "@/components/game/RoundFour";
import RoundFivePage from "@/components/game/RoundFive";

export default function DynamicRoundPage() {
  const { round } = useParams();
  const roundNumber = Number(round);

  switch (roundNumber) {
    case 1:
      return <RoundOnePage />;
    case 2:
      return <RoundTwoPage />;
    case 3:
      return <RoundThreePage />;
    case 4:
      return <RoundFourPage />;
    case 5:
      return <RoundFivePage />;
    default:
      return <div className="text-white p-10">Round not found</div>;
  }
}
