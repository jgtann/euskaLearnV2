
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { format, startOfWeek } from 'date-fns';
import { ErrorAnalysis } from "@/components/features/error-analysis";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Target, Activity, Award, BookOpen } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Thesis 2.3: Mapping progress to specific Basque "Cases" (Deklinabidea)
const caseMap: Record<string, { label: string; description: string }> = {
  'Absolutive': { label: 'Nor (Object)', description: 'Basic naming and objects.' },
  'Ergative': { label: 'Nork (Subject)', description: 'Subjects doing an action.' },
  'Dative': { label: 'Nori (Recipient)', description: 'To or for someone.' },
  'Inessive': { label: 'Non (Location)', description: 'Being inside or at a place.' },
  'Adlative': { label: 'Nora (Direction)', description: 'Moving towards a place.' },
  'Ablative': { label: 'Nondik (Origin)', description: 'Coming from a place.' },
};

export default function ProgressPage() {
    const { user } = useUser();
    const [mockMastery, setMockMastery] = useState<Record<string, number>>({});

    useEffect(() => {
        // Simulating data derived from user activity for the Mastery Radar
        setMockMastery({
            'Absolutive': 85,
            'Ergative': 42,
            'Dative': 15,
            'Inessive': 60,
            'Adlative': 30,
            'Ablative': 10,
        });
    }, []);

    const firestore = useFirestore();
    const userLearningItemsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'user_learning_items');
    }, [user, firestore]);

    const { data: learningItems, isLoading } = useCollection<{ lastReviewed: number }>(userLearningItemsQuery);

    const learningVelocityData = useMemo(() => {
        if (!learningItems || learningItems.length === 0) return [];
        const itemsByWeek = learningItems.reduce<Record<string, { week: string; items: number }>>((acc, item) => {
            if (!item.lastReviewed) return acc;
            const reviewDate = new Date(item.lastReviewed);
            const weekStartDate = startOfWeek(reviewDate, { weekStartsOn: 1 });
            const weekKey = format(weekStartDate, 'yyyy-MM-dd');
            if (!acc[weekKey]) acc[weekKey] = { week: format(weekStartDate, 'MMM d'), items: 0 };
            acc[weekKey].items++;
            return acc;
        }, {});
        return Object.keys(itemsByWeek).sort().slice(-6).map(key => itemsByWeek[key]);
    }, [learningItems]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold">Euskal Maila</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Your linguistic proficiency and cognitive activation map.
          </p>
        </div>
        <div className="flex gap-2">
            <Badge variant="secondary" className="bg-basque-green/10 text-basque-green border-basque-green/20 px-4 py-1">
                A1 Level Receptive
            </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Thesis 6.5: Mastery Dashboard / Grammatical Radar */}
        <Card className="lg:col-span-2 border-t-4 border-t-basque-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-xl">
              <Award className="text-basque-green"/>
              Grammatical Competency Map
            </CardTitle>
            <CardDescription>
              Proficiency across the Basque Case (Deklinabidea) system.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {Object.entries(caseMap).map(([key, info]) => (
              <div key={key} className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{key}</p>
                    <h4 className="font-bold text-basque-earth">{info.label}</h4>
                  </div>
                  <span className="text-sm font-mono font-bold text-basque-green">{mockMastery[key] || 0}%</span>
                </div>
                <Progress value={mockMastery[key] || 0} className="h-2 bg-background" />
                <p className="text-[11px] text-muted-foreground">{info.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Thesis 2.1: Recency Factor / Activity */}
        <div className="space-y-8">
            <Card className="border-t-4 border-t-basque-red">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-xl">
                  <Activity className="text-basque-red"/>
                  Activation Threshold
                </CardTitle>
                <CardDescription>Weekly cognitive reinforcement.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  {isLoading ? <Skeleton className="h-full w-full" /> : learningVelocityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={learningVelocityData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)" }}
                          cursor={{ fill: 'hsl(var(--accent))' }}
                        />
                        <Bar dataKey="items" name="Items Reviewed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                        <Activity className="size-8 mb-2 opacity-20" />
                        <p className="text-xs">No recent activation.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-basque-earth text-white overflow-hidden relative">
                <div className="absolute top-[-20px] right-[-20px] opacity-10">
                    <BookOpen size={120} />
                </div>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest text-basque-stone/60">Study Streak</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black">5</span>
                        <span className="text-xl font-bold text-basque-red animate-pulse">🔥</span>
                    </div>
                    <p className="text-xs text-basque-stone/80 mt-2 italic">"Gogoa den tokian, bidea han."</p>
                </CardContent>
            </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-xl">
            <Target className="text-primary"/>
            Linguistic Friction Points (AI Analysis)
          </CardTitle>
          <CardDescription>
            Personalized detection of "learned attention" interference.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorAnalysis />
        </CardContent>
      </Card>
    </div>
  );
}
