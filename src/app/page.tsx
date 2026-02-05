import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Languages, BarChart, ShieldAlert, User } from "lucide-react";

// Mock user data to demonstrate the "Rescue Mission" feature
const mockUser = {
  name: "Alex",
  streak: 12,
  current_mission: "rescue", // or 'active'
};

const features = [
  {
    title: "Learn",
    description: "Construct words with interactive morpheme tiles.",
    href: "/learn",
    icon: <BookOpen className="size-8 text-primary" />,
  },
  {
    title: "Translate",
    description: "Use AI to translate and understand Basque grammar.",
    href: "/translate",
    icon: <Languages className="size-8 text-primary" />,
  },
  {
    title: "Progress",
    description: "Analyze your learning patterns and error heatmaps.",
    href: "/progress",
    icon: <BarChart className="size-8 text-primary" />,
  },
  {
    title: "Self-Intro",
    description: "Build your own Basque introduction with AI.",
    href: "/introduction",
    icon: <User className="size-8 text-primary" />,
  }
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-4xl font-bold text-foreground">Welcome back, {mockUser.name}!</h1>
        <p className="text-muted-foreground mt-2 text-lg">Let's continue your Basque learning journey.</p>
      </div>

      {mockUser.current_mission === "rescue" && (
        <Card className="bg-primary/10 border-primary/50">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-3 bg-primary/20 rounded-full">
              <ShieldAlert className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-heading">Rescue Mission Activated!</CardTitle>
              <CardDescription className="mt-1">
                You're close to losing your streak! Complete this quick review session to protect it with a 'Streak Shield'.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/learn?mission=rescue">
                Start Rescue Mission <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              {feature.icon}
              <div className="flex-1">
                <CardTitle className="font-heading text-2xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link href={feature.href}>
                  Go to {feature.title} <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
