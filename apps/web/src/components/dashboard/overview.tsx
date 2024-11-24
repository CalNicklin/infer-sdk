"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DailyUsage, getApiUsage } from "@/app/actions/get-api-usage";
import { ChartContainer, ChartTooltip } from "../ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltipContent } from "../ui/chart";
import { useEffect, useState } from "react";

export default function Overview() {
  const [apiUsageData, setApiUsageData] = useState<DailyUsage[]>([]);

  useEffect(() => {
    getApiUsage().then(setApiUsageData);
  }, []);

  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white/80">API Usage</CardTitle>
        <CardDescription className="text-white/60">
          Your API request volume for the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] h-[300px]">
            <ChartContainer
              config={{
                requests: {
                  label: "Requests",
                  color: "rgba(100,200,255,0.5)",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apiUsageData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Bar
                    dataKey="requests"
                    fill="rgba(100,200,255,0.5)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-white/60">
          Total Requests:{" "}
          {apiUsageData.reduce((acc, day) => acc + day.requests, 0)}
        </p>
      </CardFooter>
    </Card>
  );
}
