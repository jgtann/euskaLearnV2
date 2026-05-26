import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeploymentCard from "@/components/features/deployment-card";
import { BookOpen, Languages, BarChart, User } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Interactive Learning",
    description: "Master Basque morphemes by constructing words with our hands-on tile system.",
    icon: <BookOpen className="size-10 text-primary" />,
  },
  {
    title: "AI-Powered Translation",
    description: "Go beyond simple translation. Understand the 'why' behind the grammar with AI-driven explanations.",
    icon: <Languages className="size-10 text-primary" />,
  },
  {
    title: "Personalized Progress",
    description: "Our AI analyzes your common mistakes, creating a personalized learning path to target your weak spots.",
    icon: <BarChart className="size-10 text-primary" />,
  },
  {
    title: "AI Introduction Builder",
    description: "Craft a perfect self-introduction in Basque, with AI guidance on vocabulary and formality.",
    icon: <User className="size-10 text-primary" />,
  },
];


export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="font-heading text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  The Modern Way to Master Basque
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Euskal Sustatzailea uses AI to create a personalized and effective learning experience for adult learners.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/register">Get Started for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="w-full h-auto rounded-xl bg-muted flex items-center justify-center p-8">
              <span className="font-bold text-9xl text-primary/20">ES</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="font-heading text-3xl font-bold tracking-tighter sm:text-5xl">An AI-Tutor for Your Basque Journey</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform is designed to accelerate your learning by focusing on understanding, not just memorization.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4 mt-12">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center flex flex-col items-center">
                <CardHeader className="items-center">
                  {feature.icon}
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <DeploymentCard />
        </div>
      </section>

      <section className="w-full py-20 md:py-24 lg:py-32 bg-muted">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="font-heading text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Start Your Journey?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Create an account and begin your personalized Basque learning experience today. It's free to get started!
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full">
               <Link href="/register">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
