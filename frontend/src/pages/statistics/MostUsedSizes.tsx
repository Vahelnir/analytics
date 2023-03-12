import { useEffect, useState } from "react";
import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import { trpc } from "../../trpc";
import { dateFormat } from "../Home";

export function MostUsedSizes({
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
        text: "Taille d'écran les plus utilisées",
      },
    },
  };
  const [today] = useState(new Date());
  const [range] = useState({
    lte: new Date(today.getFullYear(), 11, 30),
    gte: new Date(today.getFullYear(), 0, 1),
  });
  const mostUsedSizes = trpc.api.applications.mostUsedSizes.useQuery({
    id: applicationToken,
    range,
  });
  const mostClickedElements = mostUsedSizes.data;
  function updateData(): ChartData<
    "bar",
    (number | [number, number] | null)[],
    unknown
  > {
    return {
      labels:
        mostClickedElements?.map(
          (app) => `${app.size.width}x${app.size.height}`
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
    <>{mostClickedElements ? <Bar options={options} data={data} /> : "rien"}</>
  );
}
