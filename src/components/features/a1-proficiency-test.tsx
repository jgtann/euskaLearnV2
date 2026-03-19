'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award,
  BrainCircuit,
  Construction,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  id: number;
  category: 'Vocabulary' | 'Morphology' | 'Syntax';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const A1_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Vocabulary',
    question: "How do you say 'The house' in Basque?",
    options: ["Etxe", "Etxea", "Etxek", "Etxean"],
    correct: 1,
    explanation: "The '-a' suffix is the 'the-brick' (definite article) in Basque."
  },
  {
    id: 2,
    category: 'Morphology',
    question: "Which 'brick' marks the Boss (the person doing the action)?",
    options: ["-a", "-ak", "-k", "-n"],
    correct: 2,
    explanation: "The gold '-k' piece is the Ergative 'Boss Badge' for transitive subjects."
  },
  {
    id: 3,
    category: 'Syntax',
    question: "What is the typical order of a Basque sentence?",
    options: ["Subject - Verb - Object (SVO)", "Verb - Subject - Object (VSO)", "Subject - Object - Verb (SOV)", "Object - Verb - Subject (OVS)"],
    correct: 2,
    explanation: "Basque is an SOV language; the 'Action Engine' (verb) usually sits at the end."
  },
  {
    id: 4,
    category: 'Vocabulary',
    question: "Translate: 'I am Jon.'",
    options: ["Ni Jon da", "Ni Jon naiz", "Nik Jon dut", "Ni Jon nago"],
    correct: 1,
    explanation: "'Naiz' is the 'am-brick' for the first person (I am)."
  },
  {
    id: 5,
    category: 'Morphology',
    question: "How do you pluralize 'The dog' (Txakur)?",
    options: ["Txakurak", "Txakurrak", "Txakurk", "Txakurn"],
    correct: 1,
    explanation: "Txakur ends in a vibrant 'r', so we double it: Txakur-rak."
  },
  {
    id: 6,
    category: 'Morphology',
    question: "Which suffix is the 'Inside-Brick' for location?",
    options: ["-ra", "-tik", "-n", "-ri"],
    correct: 2,
    explanation: "The Inessive marker '-n' indicates being inside or at a place (e.g., etxean)."
  },
  {
    id: 7,
    category: 'Vocabulary',
    question: "Which verb is used for location ('I am here')?",
    options: ["Izan", "Ukan", "Egon", "Egin"],
    correct: 2,
    explanation: "'Egon' is the 'Being (Location)' verb, whereas 'Izan' is for identity."
  },
  {
    id: 8,
    category: 'Syntax',
    question: "In the sentence 'Nik liburua dut', what does 'dut' mean?",
    options: ["I am it", "I have it", "I see it", "I want it"],
    correct: 1,
    explanation: "'Dut' is the transitive auxiliary meaning 'I have it'."
  },
  {
    id: 9,
    category: 'Vocabulary',
    question: "How do you say 'The big house'?",
    options: ["Etxea handia", "Handia etxea", "Etxe handia", "Etxea handi"],
    correct: 2,
    explanation: "In Basque, the adjective follows the noun, and the article '-a' attaches to the end of the phrase."
  },
  {
    id: 10,
    category: 'Morphology',
    question: "Which suffix means 'With' (e.g., With the friend)?",
    options: ["-tzat", "-rekin", "-rentzat", "-rako"],
    correct: 1,
    explanation: "The '-rekin' brick (Comitative) means 'with'."
  }
];

export function A1ProficiencyTest() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = A1_QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / A1_QUESTIONS.length) * 100;

  const score = useMemo(() => {
    return Object.entries(answers).reduce((acc, [qId, ansIdx]) => {
      const q = A1_QUESTIONS.find(q => q.id === Number(qId));
      return q?.correct === ansIdx ? acc + 1 : acc;
    }, 0);
  }, [answers]);

  const handleNext = () => {
    if (selectedOption === null) return;
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: Number(selectedOption) }));
    setSelectedOption(null);

    if (currentIdx < A1_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetTest = () => {
    setCurrentIdx(0);
    setAnswers({});
    setIsFinished(false);
    setSelectedOption(null);
  };

  if (isFinished) {
    const percentage = (score / A1_QUESTIONS.length) * 100;
    return (
      <Card className="max-w-2xl mx-auto border-t-8 border-t-basque-green shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-basque-green/10 rounded-full">
              <Trophy className="size-16 text-basque-green animate-bounce" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black text-basque-earth">Diagnostic Complete</CardTitle>
          <CardDescription className="text-lg">CEFR A1 Validation Results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl font-black text-basque-green">{percentage}%</span>
            <Badge variant="secondary" className="px-6 py-1 uppercase tracking-widest text-xs font-bold">
              {percentage >= 80 ? 'Proficiency Level: A1 Validated' : 'Proficiency Level: Building A1'}
            </Badge>
          </div>

          <div className="grid gap-4">
             <div className="p-6 rounded-2xl bg-muted/50 border space-y-2">
                <div className="flex items-center gap-2 text-basque-earth font-bold">
                   <BrainCircuit className="size-5 text-primary" />
                   Mastery Analysis
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                   {percentage >= 80 
                    ? "Excellent! You have successfully internalised the SOV baseline and core morphological 'bricks'. You are ready to move towards A2 complex social quests."
                    : "You're making progress! We detected some friction with morphological 'snapping' rules. Focus on World 2 (Actions) to strengthen your 'Boss Badge' recognition."}
                </p>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="font-bold text-center uppercase tracking-widest text-[10px] text-muted-foreground">Category Performance</h3>
             <div className="space-y-2">
                {['Vocabulary', 'Morphology', 'Syntax'].map(cat => {
                   const catQs = A1_QUESTIONS.filter(q => q.category === cat);
                   const catScore = catQs.filter(q => answers[q.id] === q.correct).length;
                   const catPercent = (catScore / catQs.length) * 100;
                   return (
                     <div key={cat} className="flex items-center justify-between p-3 bg-white rounded-xl border">
                        <span className="text-sm font-bold">{cat}</span>
                        <div className="flex items-center gap-3">
                           <Progress value={catPercent} className="w-24 h-2" />
                           <span className="text-xs font-black min-w-[3rem] text-right">{Math.round(catPercent)}%</span>
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 p-8 bg-muted/20">
          <Button variant="outline" className="flex-1 font-bold h-12" onClick={resetTest}>
            <RotateCcw className="mr-2 size-4" /> Retake Test
          </Button>
          <Button className="flex-1 bg-basque-green hover:bg-green-800 font-bold h-12" asChild>
             <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-end px-2">
        <div>
          <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[10px] mb-2">
            {currentQuestion.category}
          </Badge>
          <h2 className="text-2xl font-black text-basque-earth tracking-tight">Question {currentIdx + 1} of {A1_QUESTIONS.length}</h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Progress</span>
          <Progress value={progress} className="h-2 w-32 mt-1" />
        </div>
      </div>

      <Card className="border-t-8 border-t-primary shadow-xl overflow-hidden">
        <CardHeader className="p-8 bg-basque-stone/20">
          <CardTitle className="text-2xl font-bold leading-tight text-center">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="grid gap-3">
            {currentQuestion.options.map((option, i) => (
              <div key={i} className={cn(
                "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-primary/5",
                selectedOption === String(i) ? "border-primary bg-primary/5 shadow-md" : "border-muted"
              )} onClick={() => setSelectedOption(String(i))}>
                <RadioGroupItem value={String(i)} id={`opt-${i}`} className="sr-only" />
                <div className={cn(
                  "size-6 rounded-full border-2 flex items-center justify-center font-bold text-xs",
                  selectedOption === String(i) ? "border-primary bg-primary text-white" : "border-muted text-muted-foreground"
                )}>
                  {String.fromCharCode(65 + i)}
                </div>
                <Label htmlFor={`opt-${i}`} className="text-lg font-bold flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="p-8 border-t flex justify-end bg-muted/10">
          <Button 
            disabled={selectedOption === null} 
            className="px-8 h-12 bg-basque-earth hover:bg-black font-black uppercase tracking-widest"
            onClick={handleNext}
          >
            {currentIdx === A1_QUESTIONS.length - 1 ? 'Finish Test' : 'Next Question'}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-center gap-8 text-muted-foreground/40 mt-6">
        <div className="flex items-center gap-2"><Construction className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Lego Pedagogical Standard</span></div>
        <div className="flex items-center gap-2"><Award className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">A1 CEFR Framework</span></div>
      </div>
    </div>
  );
}
