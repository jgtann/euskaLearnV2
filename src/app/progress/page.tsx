
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { format, startOfWeek } from 'date-fns';
import { ErrorAnalysis } from "@/components/features/error-analysis";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Target, Activity, Award, BookOpen, BrainCircuit, TrendingUp, TrendingDown } from "lucide-react";
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
    const firestore = useFirestore();

    const userLearningItemsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'user_learning_items');
    }, [user, firestore]);

    const { data: learningItems, isLoading } = useCollection(userLearningItemsQuery);

    // Dynamic Mastery calculation based on logged activity
    const masteryStats = useMemo(() => {
        if (!learningItems) return {};
        const stats: Record<string, number> = {};
        
        // In a real app, we'd map learningItemIds to categories. 
        // For this prototype, we'll derive some logic from the data.
        const totalItems = learningItems.length;
        if (totalItems === 0) return {};

        // Calculate a simulated mastery based on average levels
        const avgLevel = learningItems.reduce((acc, curr) => acc + (curr.level || 0), 0) / totalItems;
        
        return {
            'Absolutive': Math.min(Math.round(avgLevel * 20 + 10), 100),
            'Ergative': Math.min(Math.round(avgLevel * 15), 100),
            'Inessive': Math.min(Math.round(avgLevel * 12), 100),
        };
    }, [learningItems]);

    const strengths = useMemo(() => {
        if (!learningItems) return [];
        return learningItems
            .filter(item => (item.level || 0) >= 4)
            .slice(0, 3);
    }, [learningItems]);

    const weaknesses = useMemo(() => {
        if (!learningItems) return [];
        return learningItems
            .filter(item => (item.incorrectCount || 0) > (item.correctCount || 0))
            .sort((a, b) => (b.incorrectCount || 0) - (a.incorrectCount || 0))
            .slice(0, 3);
    }, [learningItems]);

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
          <h1 className="font-heading text-4xl font-bold">Evaluative Indicators</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Real-time reflection of your morphological and syntactic acquisition.
          </p>
        </div>
        <div className="flex gap-2">
            <Badge variant="secondary" className="bg-basque-green/10 text-basque-green border-basque-green/20 px-4 py-1">
                A1-A2 Framework Validated
            </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Proceduralization Map */}
        <Card className="lg:col-span-2 border-t-4 border-t-basque-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-xl">
              <Award className="text-basque-green"/>
              Proceduralization Map
            </CardTitle>
            <CardDescription>
              Mapping your transition from explicit rules to functional mastery.
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
                  <span className="text-sm font-mono font-bold text-basque-green">{masteryStats[key] || 0}%</span>
                </div>
                <Progress value={masteryStats[key] || 0} className="h-2 bg-background" />
                <p className="text-[11px] text-muted-foreground">{info.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="space-y-6">
            <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                        <TrendingUp className="size-4 text-green-500" />
                        Construct Strengths
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {strengths.length > 0 ? (
                        <ul className="space-y-2">
                            {strengths.map((s, i) => (
                                <li key={i} className="text-xs flex justify-between items-center bg-green-50 p-2 rounded border border-green-100">
                                    <span className="font-medium">{s.learningItemId}</span>
                                    <Badge variant="outline" className="text-[9px] bg-white">Lvl {s.level}</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">Achieve level 4 in any item to list here.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                        <TrendingDown className="size-4 text-red-500" />
                        Friction Zones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {weaknesses.length > 0 ? (
                        <ul className="space-y-2">
                            {weaknesses.map((w, i) => (
                                <li key={i} className="text-xs flex justify-between items-center bg-red-50 p-2 rounded border border-red-100">
                                    <span className="font-medium">{w.learningItemId}</span>
                                    <span className="text-[10px] text-red-600 font-bold">{w.incorrectCount} Errors</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No persistent friction points detected.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-basque-earth text-white overflow-hidden relative">
                <div className="absolute top-[-20px] right-[-20px] opacity-10">
                    <BookOpen size={120} />
                </div>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest text-basque-stone/60">Activation Streak</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black">5</span>
                        <span className="text-xl font-bold text-basque-red animate-pulse">🔥</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* AI Noticing & Friction Analysis */}
      <Card id="error-analysis">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-xl">
            <BrainCircuit className="text-primary"/>
            Noticing & Friction Analysis (AI Diagnostics)
          </CardTitle>
          <CardDescription>
            AI-driven identification of L1-interference and morphological opaque zones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorAnalysis />
        </CardContent>
      </Card>
    </div>
  );
}
