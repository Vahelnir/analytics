import { useEffect, useState } from "react";
import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import { trpc } from "../../trpc";
import { dateFormat } from "../Home";

export function MostClickedElements({
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
        text: "Élements les plus cliqués",
      },
    },
  };
  const [today] = useState(new Date());
  const [range] = useState({
    lte: new Date(today.getFullYear(), 11, 30),
    gte: new Date(today.getFullYear(), 0, 1),
  });
  const mostClickedElementsQuery =
    trpc.api.applications.mostClickedElements.useQuery({
      id: applicationToken,
      range,
    });
  const mostClickedElements = mostClickedElementsQuery.data;
  function updateData(): ChartData<
    "bar",
    (number | [number, number] | null)[],
    unknown
  > {
    return {
      labels: mostClickedElements?.map((app) => app.selector) ?? [],
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
