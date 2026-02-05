'use client';

import { ErrorAnalysis } from "@/components/features/error-analysis";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Target } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const learningVelocityData = [
  { week: 'Week 1', items: 20 },
  { week: 'Week 2', items: 35 },
  { week: 'Week 3', items: 50 },
  { week: 'Week 4', items: 45 },
  { week: 'Week 5', items: 60 },
  { week: 'Week 6', items: 75 },
];

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-4xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Review your performance, analyze errors, and track your growth.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Target className="text-primary"/>
              Personalized Error Analysis
            </CardTitle>
            <CardDescription>
              Use AI to discover which morphemes are causing you the most trouble and get an error heatmap.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorAnalysis />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <BarChart className="text-accent"/>
              Learning Velocity
            </CardTitle>
            <CardDescription>
              Items mastered per week from the 360-item MVP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={learningVelocityData}>
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                        background: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="items" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
