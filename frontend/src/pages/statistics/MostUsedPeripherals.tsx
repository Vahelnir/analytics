import { useEffect, useState } from "react";
import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import { trpc } from "../../trpc";
import { dateFormat } from "../Home";

export function MostUsedPeripherals({
  applicationToken,
}: {
  applicationToken: string;
}) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Navigateurs les plus utilisés",
      },
    },
  };
  const [today] = useState(new Date());
  const [range] = useState({
    lte: new Date(today.getFullYear(), 11, 30),
    gte: new Date(today.getFullYear(), 0, 1),
  });
  const mostUsedPeripherals =
    trpc.api.applications.mostUsedPeripherals.useQuery({
      id: applicationToken,
      range,
    });
  const mostClickedElements = mostUsedPeripherals.data;
  function updateData(): ChartData<
    "bar",
    (number | [number, number] | null)[],
    unknown
  > {
    return {
      labels:
        mostClickedElements?.map(
          (app) =>
            `${app.agent.browser.name} ${app.agent.browser.version} (${app.agent.os.name} ${app.agent.os.version})`
        ) ?? [],
      datasets: [
        {
          label: `${dateFormat(range.gte)} au ${dateFormat(range.lte)}`,
          data: mostClickedElements?.map((app) => app.total) ?? [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  }

  let data = updateData();
  useEffect(() => {
    data = updateData();
  }, [mostClickedElements]);

  return (
    <>
      {mostClickedElements ? (
        <Bar options={options} data={data} />
      ) : (
        "Chargement..."
      )}
    </>
  );
}
