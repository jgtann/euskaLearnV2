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
  Users,
  Sparkles,
  CheckCircle2,
  Clock,
  BrainCircuit
} from "lucide-react";
import { useUser } from '@/firebase';

const features = [
  { title: "Morpheme Construct", description: "Manage agglutination with snap-tiles.", href: "/learn", icon: <BookOpen className="size-6 text-primary" /> },
  { title: "Smart Vocabulary", description: "SRS-driven flashcard review.", href: "/vocabulary", icon: <CheckCircle2 className="size-6 text-primary" /> },
  { title: "Translanguaging", description: "AI-powered cognitive scaffolding.", href: "/translate", icon: <Languages className="size-6 text-primary" /> },
  { title: "Grammar Check", description: "AI-powered friction and error analysis.", href: "/grammar-check", icon: <BrainCircuit className="size-6 text-primary" /> },
  { title: "Evaluative Indicators", description: "Map your grammatical competence.", href: "/progress", icon: <BarChart className="size-6 text-primary" /> },
];

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-8">
      {/* Thesis 4.7: Gamified Design - High-Agency Activation Header */}
      <div className="relative overflow-hidden rounded-3xl bg-basque-green p-8 text-white shadow-xl">
        <div className="absolute right-[-30px] top-[-30px] opacity-10">
          <Trophy size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h1 className="font-heading text-4xl font-black tracking-tight">Kaixo, {user?.displayName?.split(' ')[0] || 'Ikasle'}!</h1>
            <div className="flex gap-2 items-center">
              <Badge className="bg-basque-red hover:bg-basque-red border-none uppercase tracking-wider text-[10px]">CEFR A1 Scholar</Badge>
              <span className="text-basque-stone/80 text-sm font-medium">5 Day Activation Streak 🔥</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px] border border-white/20">
              <p className="text-[10px] uppercase opacity-70 font-bold tracking-widest">Resting-Level Activation</p>
              <p className="text-2xl font-black">80%</p>
              <Progress value={80} className="h-1 mt-2 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <CardTitle className="font-heading text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <Button variant="ghost" size="sm" asChild className="p-0 hover:bg-transparent text-primary">
                  <Link href={feature.href}>Start Activity <ArrowRight className="ml-2 size-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {/* Thesis 5.3: SRS-Driven Quest Logic */}
          <Card className="md:col-span-2 bg-muted/30 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Clock className="size-4 text-orange-500" />
                Daily Retrieval Quests
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
               <div className="flex items-center gap-3 p-3 rounded-xl bg-background border">
                  <CheckCircle2 className="size-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-xs font-bold">Constructional Entrenchment</p>
                    <p className="text-[10px] text-muted-foreground">Complete 5 Ergative puzzles.</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-3 rounded-xl bg-background border opacity-60">
                  <div className="size-5 rounded-full border-2 border-muted" />
                  <div className="flex-1">
                    <p className="text-xs font-bold">Syntax Activation</p>
                    <p className="text-[10px] text-muted-foreground">Reconstruct 3 complex sentences.</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Thesis 3.3 & 5.5: Social Scaffolding (Community Tavern) */}
        <div className="space-y-6">
          <Card className="border-t-4 border-t-basque-earth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg">
                <Users className="text-basque-earth size-5" />
                Community Tavern
              </CardTitle>
              <CardDescription>Investment in an imagined community.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Jon A.', xp: '2,450', avatar: 'J' },
                { name: 'Miren L.', xp: '1,820', avatar: 'M' },
                { name: 'Ane B.', xp: '1,500', avatar: 'A' },
              ].map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="size-8 rounded-full bg-basque-stone flex items-center justify-center font-bold text-xs border border-basque-earth/20">{member.avatar}</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">{member.name}</p>
                    <p className="text-[10px] text-muted-foreground">{member.xp} XP This Week</p>
                  </div>
                  {i === 0 && <Sparkles className="size-4 text-yellow-500" />}
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full text-xs mt-2">View Leaderboard</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-dashed border-2">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <ShieldAlert className="size-5 text-primary" />
              <CardTitle className="text-sm font-bold uppercase">Rescue Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your activation threshold is dropping! Complete a session to earn a <strong>Streak Shield</strong>.
              </p>
              <Button size="sm" className="w-full mt-4" asChild>
                <Link href="/learn?mission=rescue">Mitigate Attrition</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}