import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { trpc } from "../trpc";
import { MostClickedElements } from "./statistics/MostClickedElements";
import { MostUsedPeripherals } from "./statistics/MostUsedPeripherals";
import { ClicksPerMonth } from "./statistics/ClicksPerMonth";
import { MostUsedSizes } from "./statistics/MostUsedSizes";
import { AverageLatency } from "./statistics/AverageLatency";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export const dateFormat = (date: Date) =>
  `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

export function Home() {
  const [selectedApplicationToken, setSelectedApplicationToken] =
    useState<string>("");
  const applicationListQuery = trpc.api.applications.all.useQuery();
  const applicationList = applicationListQuery.data;

  return (
    <div>
      {applicationList ? (
        <>
          <select
            value={selectedApplicationToken}
            onChange={(event) =>
              setSelectedApplicationToken(event.target.value)
            }
          >
            <option value="">Aucune application</option>
            {applicationList.map((application) => (
              <option value={application.token} key={application.id}>
                {application.name}
              </option>
            ))}
          </select>
          {selectedApplicationToken ? (
            <ApplicationStats applicationToken={selectedApplicationToken} />
          ) : (
            <>Aucune application n&apos;est sélectionné</>
          )}
        </>
      ) : (
        <>Chargement des données...</>
      )}
    </div>
  );
}

function ApplicationStats({ applicationToken }: { applicationToken: string }) {
  return (
    <div className="flex flex-wrap">
      <div className="w-1/2 p-4">
        <MostClickedElements applicationToken={applicationToken} />
      </div>
      <div className="w-1/2 p-4">
        <MostUsedPeripherals applicationToken={applicationToken} />
      </div>
      <div className="w-1/2 p-4">
        <ClicksPerMonth applicationToken={applicationToken} />
      </div>
      <div className="w-1/2 p-4">
        <MostUsedSizes applicationToken={applicationToken} />
      </div>
      <div className="w-1/2 p-4">
        <AverageLatency applicationToken={applicationToken} />
      </div>
    </div>
  );
}
