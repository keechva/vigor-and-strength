"use client";

import { useState } from "react";
import { MastersHubHero } from "./MastersHubHero";
import {
  MastersHubFilters,
  type MastersHubFilterValue,
} from "./MastersHubFilters";
import { MastersHubGrid } from "./MastersHubGrid";
import { MastersHubCrossLinks } from "./MastersHubCrossLinks";

export function MastersHubClient() {
  const [selectedDirection, setSelectedDirection] =
    useState<MastersHubFilterValue>("all");

  return (
    <>
      <MastersHubHero />
      <div className="bridge-warm-in" aria-hidden="true" />
      <MastersHubFilters
        selected={selectedDirection}
        onChange={setSelectedDirection}
      />
      <MastersHubGrid filterDirection={selectedDirection} />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <MastersHubCrossLinks />
    </>
  );
}
