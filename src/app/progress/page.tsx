'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { format, startOfWeek } from 'date-fns';
import { ErrorAnalysis } from "@/components/features/error-analysis";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Target, Activity } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Skeleton } from '@/components/ui/skeleton';

export default function ProgressPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const userLearningItemsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'user_learning_items');
    }, [user, firestore]);

    const { data: learningItems, isLoading } = useCollection<{ lastReviewed: number }>(userLearningItemsQuery);

    const learningVelocityData = useMemo(() => {
        if (!learningItems || learningItems.length === 0) {
            return [];
        }

        const itemsByWeek = learningItems.reduce<Record<string, { week: string; items: number }>>((acc, item) => {
            if (!item.lastReviewed) return acc;

            const reviewDate = new Date(item.lastReviewed);
            const weekStartDate = startOfWeek(reviewDate, { weekStartsOn: 1 }); // Monday
            const weekKey = format(weekStartDate, 'yyyy-MM-dd');

            if (!acc[weekKey]) {
                acc[weekKey] = {
                    week: format(weekStartDate, 'MMM d'),
                    items: 0,
                };
            }
            acc[weekKey].items++;
            return acc;
        }, {});

        const sortedKeys = Object.keys(itemsByWeek).sort();
        // Get last 6 weeks of activity
        const recentWeeks = sortedKeys.slice(-6);

        return recentWeeks.map(key => itemsByWeek[key]);
    }, [learningItems]);

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
              <BarChart className="text-primary"/>
              Learning Velocity
            </CardTitle>
            <CardDescription>
              Your weekly review activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isLoading && (
                  <div className="flex h-full w-full items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
              )}
              {!isLoading && learningVelocityData.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed bg-muted/50 p-8 text-center">
                  <Activity className="size-12 text-muted-foreground" />
                  <h3 className="font-semibold">No Activity Recorded</h3>
                  <p className="text-muted-foreground">Complete some learning activities to see your progress chart here.</p>
                </div>
              )}
              {!isLoading && learningVelocityData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={learningVelocityData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                          background: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      cursor={{ fill: 'hsl(var(--accent))' }}
                    />
                    <Bar dataKey="items" name="Items Reviewed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
