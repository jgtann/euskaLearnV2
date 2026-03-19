
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  BookOpen, 
  Languages, 
  BarChart, 
  ShieldAlert, 
  Trophy, 
  Sparkles,
  CheckCircle2,
  Clock,
  BrainCircuit,
  Lock,
  Zap,
  MapPin,
  Users
} from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';
import { WORLDS } from '@/lib/lego-data';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userItemsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'user_learning_items');
  }, [user, firestore]);
  const { data: learningItems } = useCollection(userItemsQuery);

  // Thesis 5.3: SRS-Driven Quest Logic & Mastery Gates
  const worldProgress = useMemo(() => {
    if (!learningItems) return {};
    return WORLDS.reduce((acc, world) => {
        const completedInWorld = learningItems.filter(item => 
            item.world === world.id && item.level >= 4
        ).length;
        acc[world.id] = Math.min((completedInWorld / 5) * 100, 100);
        return acc;
    }, {} as Record<string, number>);
  }, [learningItems]);

  const atRiskMissions = useMemo(() => {
    if (!learningItems) return [];
    return learningItems.filter(item => 
        (item.incorrectCount || 0) > (item.correctCount || 0) * 1.5
    ).slice(0, 2);
  }, [learningItems]);

  return (
    <div className="flex flex-col gap-8">
      {/* High-Agency Activation Header */}
      <div className="relative overflow-hidden rounded-3xl bg-basque-green p-8 text-white shadow-xl">
        <div className="absolute right-[-30px] top-[-30px] opacity-10">
          <Trophy size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h1 className="font-heading text-4xl font-black tracking-tight tracking-tight">Kaixo, {user?.displayName?.split(' ')[0] || 'Ikasle'}!</h1>
            <div className="flex gap-2 items-center">
              <Badge className="bg-basque-red hover:bg-basque-red border-none uppercase tracking-wider text-[10px]">Phase 1: Bridge Mode</Badge>
              <span className="text-basque-stone/80 text-sm font-medium">80% English Scaffolding Active</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px] border border-white/20">
              <p className="text-[10px] uppercase opacity-70 font-bold tracking-widest">Procedural Mastery</p>
              <p className="text-2xl font-black">{Math.round(Object.values(worldProgress).reduce((a, b) => a + b, 0) / WORLDS.length)}%</p>
              <Progress value={Object.values(worldProgress).reduce((a, b) => a + b, 0) / WORLDS.length} className="h-1 mt-2 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* The Five Worlds Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <BookOpen className="text-primary" />
            The Curriculum Spine
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {WORLDS.map((world, i) => {
              const progress = worldProgress[world.id] || 0;
              const isLocked = i > 0 && (worldProgress[WORLDS[i-1].id] || 0) < 80;

              return (
                <Card key={world.id} className={cn(
                    "group transition-all border-l-4",
                    isLocked ? "opacity-60 bg-muted/50 border-l-muted" : "hover:shadow-lg border-l-primary"
                )}>
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-2 bg-primary/5 rounded-lg">
                       {isLocked ? <Lock className="size-5 text-muted-foreground" /> : <Zap className="size-5 text-primary" />}
                    </div>
                    <CardTitle className="font-heading text-base">{world.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">{world.description}</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1" />
                    </div>
                    {!isLocked && (
                      <Button variant="ghost" size="sm" asChild className="w-full mt-4 h-8 text-[10px] uppercase font-bold tracking-widest text-primary border border-primary/20 hover:bg-primary/5">
                        <Link href={`/learn?world=${world.id}`}>Enter World <ArrowRight className="ml-2 size-3" /></Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Motivational Side Scaffolding */}
        <div className="space-y-6">
          {/* Rescue Mission Trigger */}
          {atRiskMissions.length > 0 && (
            <Card className="bg-basque-red/5 border-basque-red/20 border-2 border-dashed">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-basque-red uppercase tracking-widest">
                        <ShieldAlert className="size-4" />
                        Rescue Mission Active
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        We detected friction with the <strong>{atRiskMissions[0].learningItemId}</strong> brick. Complete a review to earn a <strong>Streak Shield</strong>.
                    </p>
                    <Button size="sm" className="w-full bg-basque-red hover:bg-red-800 text-white" asChild>
                        <Link href={`/learn?mission=rescue&item=${atRiskMissions[0].learningItemId}`}>Repair Construction</Link>
                    </Button>
                </CardContent>
            </Card>
          )}

          <Card className="border-t-4 border-t-basque-earth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg">
                <BrainCircuit className="text-basque-earth size-5" />
                Evaluative Indicators
              </CardTitle>
              <CardDescription className="text-[11px]">Mapping morphological acquisition.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-3 rounded-xl bg-muted/50 border space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Ergative (-k)</span>
                    <span className="text-basque-green">High</span>
                  </div>
                  <Progress value={85} className="h-1.5" />
               </div>
               <div className="p-3 rounded-xl bg-muted/50 border space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Dative (-ri)</span>
                    <span className="text-basque-red">Friction</span>
                  </div>
                  <Progress value={20} className="h-1.5" />
               </div>
               <Button variant="outline" size="sm" className="w-full text-[10px] uppercase font-bold tracking-widest mt-2" asChild>
                  <Link href="/progress">View Detail Map</Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
