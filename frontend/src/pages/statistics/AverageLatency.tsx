import { useEffect, useState } from "react";
import { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { trpc } from "../../trpc";
import { dateFormat } from "../Home";

export function AverageLatency({
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
        text: "Latence moyenne des events",
      },
    },
  };
  const [today] = useState(new Date());
  const [range] = useState({
    lte: new Date(today.getFullYear(), 11, 30),
    gte: new Date(today.getFullYear(), 0, 1),
  });
  const averageLatencyQuery = trpc.api.applications.averageLatency.useQuery({
    id: applicationToken,
    range,
  });
  const averageLatency = averageLatencyQuery.data;
  function updateData(): ChartData<
    "line",
    (number | [number, number] | null)[],
    unknown
  > {
    return {
      labels: averageLatency?.map((stat) => `${stat.month}/${stat.year}`) ?? [],
      datasets: [
        {
          label: `${dateFormat(range.gte)} au ${dateFormat(range.lte)}`,
          data: averageLatency?.map((app) => app.latency) ?? [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  }

  let data = updateData();
  useEffect(() => {
    data = updateData();
  }, [averageLatency]);

  return (
    <>
      {averageLatency ? (
        <Line options={options} data={data} />
      ) : (
        "Chargement..."
      )}
    </>
  );
}
