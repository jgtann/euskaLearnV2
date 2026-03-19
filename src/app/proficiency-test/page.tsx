import { A1ProficiencyTest } from "@/components/features/a1-proficiency-test";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

export default function ProficiencyTestPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="size-8 text-basque-green" />
            <h1 className="font-heading text-4xl font-black tracking-tight">Master Builder Validation</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
           Take the diagnostic test to measure your current Basque proficiency against the 
           <strong> CEFR A1 Standard</strong>. Prove your mastery of the 'Bricks' and 'Syntax Engines'.
        </p>
        <div className="flex justify-center gap-2">
            <Badge variant="outline" className="border-basque-green/30 text-basque-green uppercase tracking-widest text-[9px]">Vocabulary</Badge>
            <Badge variant="outline" className="border-basque-red/30 text-basque-red uppercase tracking-widest text-[9px]">Morphology</Badge>
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-widest text-[9px]">Syntax</Badge>
        </div>
      </div>
      
      <A1ProficiencyTest />
    </div>
  );
}
