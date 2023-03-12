import { useEffect, useState } from "react";
import { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { trpc } from "../../trpc";
import { dateFormat } from "../Home";

export function ClicksPerMonth({
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
        text: "Nombre de clicks par mois",
      },
    },
  };
  const [today] = useState(new Date());
  const [range] = useState({
    lte: new Date(today.getFullYear(), 11, 30),
    gte: new Date(today.getFullYear(), 0, 1),
  });
  const clicksPerMonthQuery = trpc.api.applications.clicksPerMonth.useQuery({
    id: applicationToken,
    range,
  });
  const clicksPerMonth = clicksPerMonthQuery.data;
  function updateData(): ChartData<
    "line",
    (number | [number, number] | null)[],
    unknown
  > {
    return {
      labels: clicksPerMonth?.map((stat) => `${stat.month}/${stat.year}`) ?? [],
      datasets: [
        {
          label: `${dateFormat(range.gte)} au ${dateFormat(range.lte)}`,
          data: clicksPerMonth?.map((app) => app.total) ?? [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  }

  let data = updateData();
  useEffect(() => {
    data = updateData();
  }, [clicksPerMonth]);

  return (
    <>{clicksPerMonth ? <Line options={options} data={data} /> : "rien"}</>
  );
}
