"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Cell, Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A donut chart with text";

type ChartItem = {
  label: string;
  value: number;
  fill?: string;
};

type ChartPieDonutTextProps = {
  data: ChartItem[];
  title: string;
  centerAmount?: string;
  date?: string;
  centerLabel?: string;
  footerLabel?: string;
};

export function ChartPieDonutText({
  data,
  centerAmount,
  centerLabel,
  title,
  date,
  footerLabel,
}: ChartPieDonutTextProps) {
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data]
  );

  const chartConfig = Object.fromEntries(
    data.map((d, i) => [
      d.label,
      {
        label: d.label,
        color: `var(--chart-${(i % 5) + 1})`,
        fill: d.fill || `hsl(${(i * 360) / data.length}, 70%, 60%)`,
      },
    ])
  ) satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center text-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>As of {date}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((d, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    d.fill || `hsl(${(index * 360) / data.length}, 70%, 60%)`
                  }
                />
              ))}

              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {centerAmount ? centerAmount : total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {centerLabel ? centerLabel : "Total"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {footerLabel} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total budget spent for the month
        </div>
      </CardFooter>
    </Card>
  );
}
