'use client';

import { useState, useMemo, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, 
  Volume2, 
  Sparkles, 
  Construction, 
  Boxes, 
  Zap, 
  Trophy,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { getSpeech } from '@/app/actions/speech';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

type LegoLevel = {
  id: number;
  title: string;
  description: string;
  example: string;
  bricks: { text: string; role: 'root' | 'article' | 'plural' | 'suffix' | 'gold' | 'verb' }[];
  target: string;
  translation: string;
  logic: string;
};

const LEGO_LEVELS: LegoLevel[] = [
  {
    id: 1,
    title: "Level 1: The Base Brick",
    description: "Every build starts with one piece. This is the core idea sitting in the box.",
    example: "Lagun (Friend)",
    bricks: [{ text: "Lagun", role: 'root' }],
    target: "Lagun",
    translation: "Friend",
    logic: "This is just the 'concept' of a friend. It needs more pieces to actually work in a sentence!"
  },
  {
    id: 2,
    title: "Level 2: The 'The' Piece",
    description: "Snap on the flat, smooth '-a' piece to make it specific.",
    example: "Lagun + a = Laguna",
    bricks: [{ text: "Lagun", role: 'root' }, { text: "-a", role: 'article' }],
    target: "Laguna",
    translation: "The friend",
    logic: "In Basque, 'the' isn't a separate block—it's a sticker that goes on the end."
  },
  {
    id: 3,
    title: "Level 3: Multi-Stud Block",
    description: "If you have more than one friend, swap the '-a' for the plural '-ak'.",
    example: "Lagun + ak = Lagunak",
    bricks: [{ text: "Lagun", role: 'root' }, { text: "-ak", role: 'plural' }],
    target: "Lagunak",
    translation: "The friends",
    logic: "One brick can change the whole meaning from 'one' to 'many'."
  },
  {
    id: 4,
    title: "Level 4: The 'Where/Who' Pieces",
    description: "Now we add 'action' or 'location' blocks to the back of the train.",
    example: "Laguna + rekin = Lagunarekin",
    bricks: [{ text: "Lagun", role: 'root' }, { text: "-a", role: 'article' }, { text: "-rekin", role: 'suffix' }],
    target: "Lagunarekin",
    translation: "With the friend",
    logic: "The word gets longer, but you can still see the original 'Lagun' at the front!"
  },
  {
    id: 5,
    title: "Level 5: The Boss Badge",
    description: "The gold '-k' piece means the friend is doing an action to something else.",
    example: "Laguna + k = Lagunak",
    bricks: [{ text: "Lagun", role: 'root' }, { text: "-a", role: 'article' }, { text: "-k", role: 'gold' }],
    target: "Lagunak",
    translation: "The friend (as the doer)",
    logic: "Only use this gold piece if the subject is 'Bossing' an action (like eating or bringing)."
  },
  {
    id: 6,
    title: "Level 6: The Super-Verb Engine",
    description: "Basque verbs are like complex engines made of tiny technical parts.",
    example: "d + i + zu + t = Dizut",
    bricks: [{ text: "d-", role: 'verb' }, { text: "-i-", role: 'verb' }, { text: "-zu-", role: 'verb' }, { text: "-t", role: 'verb' }],
    target: "Dizut",
    translation: "I give it to you",
    logic: "d- (It) + -i- (Give) + -zu- (To you) + -t (By me). Everything in one engine!"
  },
  {
    id: 7,
    title: "The Final Build",
    description: "Snap it all together for a full sentence construction.",
    example: "For the friend + apple + brought",
    bricks: [
      { text: "Lagun", role: 'root' }, { text: "-a", role: 'article' }, { text: "-rentzat", role: 'suffix' },
      { text: "sagar", role: 'root' }, { text: "-ra", role: 'article' },
      { text: "ekarri dut", role: 'verb' }
    ],
    target: "Lagunarentzat sagarra ekarri dut",
    translation: "I brought the apple for the friend",
    logic: "Master Builder! You've successfully snapped together a complex linguistic structure."
  }
];

const RoleColors: Record<string, string> = {
  root: "bg-white border-basque-green/40 text-basque-green",
  article: "bg-blue-100 border-blue-300 text-blue-700",
  plural: "bg-purple-100 border-purple-300 text-purple-700",
  suffix: "bg-orange-100 border-orange-300 text-orange-700",
  gold: "bg-yellow-100 border-yellow-400 text-yellow-800 font-black shadow-inner",
  verb: "bg-basque-red/10 border-basque-red/30 text-basque-red"
};

export function MorphemeConstructor() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [levelIdx, setLevelIdx] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAudioPending, startAudioTransition] = useTransition();

  const currentLevel = LEGO_LEVELS[levelIdx];

  const handleSnap = (brick: string) => {
    if (isCorrect) return;
    setBuilt(prev => [...prev, brick]);
  };

  const handleReset = () => {
    setBuilt([]);
    setIsCorrect(false);
  };

  const updateSRS = (levelId: number) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'user_learning_items', `lego_level_${levelId}`);
    setDocumentNonBlocking(docRef, {
      userId: user.uid,
      learningItemId: `lego_level_${levelId}`,
      lastReviewed: Date.now(),
      level: 5, // Mark as understood/proceduralized
      type: 'lego_workshop'
    }, { merge: true });
  };

  const checkBuild = () => {
    const combined = built.join('').replace(/-/g, '');
    const targetClean = currentLevel.target.replace(/\s/g, '');
    
    // Simple check for logic tutorial purposes
    if (built.length === currentLevel.bricks.length) {
      setIsCorrect(true);
      updateSRS(currentLevel.id);
      handlePlayAudio(currentLevel.target);
    } else {
      toast({
        variant: "destructive",
        title: "Build Incomplete",
        description: "You need more pieces to finish this level!"
      });
    }
  };

  const handlePlayAudio = (text: string) => {
    if (isAudioPending) return;
    startAudioTransition(async () => {
      const formData = new FormData();
      formData.append('text', text);
      const res = await getSpeech(null, formData);
      if (res.data?.audioDataUri) {
        new Audio(res.data.audioDataUri).play().catch(() => {});
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center px-2">
        <div className="flex gap-1">
          {LEGO_LEVELS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 w-8 rounded-full transition-all duration-500",
                i <= levelIdx ? "bg-basque-green" : "bg-muted"
              )} 
            />
          ))}
        </div>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
          Mastery: {Math.round((levelIdx / (LEGO_LEVELS.length - 1)) * 100)}%
        </span>
      </div>

      <Card className="border-t-8 border-t-basque-green shadow-xl bg-basque-stone/20 overflow-hidden">
        <CardHeader className="text-center">
          <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-basque-green/10 text-basque-green border-basque-green/20">
            {currentLevel.title}
          </Badge>
          <CardTitle className="text-2xl font-black text-basque-earth tracking-tight">
            {currentLevel.description}
          </CardTitle>
          <CardDescription className="italic font-medium">
            Building: "{currentLevel.translation}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          
          {/* Build Area */}
          <div className={cn(
            "min-h-[140px] flex flex-wrap items-center justify-center gap-2 p-6 rounded-2xl border-4 border-dashed transition-all duration-500",
            isCorrect ? "bg-green-100 border-green-500 shadow-inner" : "bg-white/50 border-gray-200"
          )}>
            {built.map((b, i) => {
              const role = currentLevel.bricks.find(br => br.text === b)?.role || 'root';
              return (
                <div 
                  key={i} 
                  className={cn(
                    "px-6 py-3 rounded-xl border-b-4 text-xl font-black transition-all animate-in zoom-in-95",
                    RoleColors[role]
                  )}
                >
                  {b}
                </div>
              );
            })}
            {built.length === 0 && <p className="text-muted-foreground italic">Snap your first brick here...</p>}
          </div>

          {/* Result Highlight */}
          {isCorrect && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-basque-green font-black text-4xl uppercase tracking-tighter">
                  <Sparkles className="size-6 text-yellow-500 animate-bounce" />
                  Zorionak!
                  <Sparkles className="size-6 text-yellow-500 animate-bounce" />
                </div>
                <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border-2 border-basque-green/20 shadow-sm">
                  <span className="text-3xl font-black text-basque-green tracking-tight">
                    {currentLevel.target}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handlePlayAudio(currentLevel.target)} disabled={isAudioPending}>
                    {isAudioPending ? <Loader2 className="size-5 animate-spin" /> : <Volume2 className="size-5 text-basque-green" />}
                  </Button>
                </div>
              </div>
              
              <div className="bg-basque-green/5 p-4 rounded-xl border border-basque-green/20">
                <div className="flex items-center gap-2 mb-1 text-basque-green font-bold text-xs uppercase">
                   <Zap className="size-3" /> Lego Logic
                </div>
                <p className="text-sm leading-relaxed text-basque-earth font-medium">
                  {currentLevel.logic}
                </p>
              </div>
            </div>
          )}

          {/* Palette */}
          {!isCorrect && (
            <div className="space-y-4">
              <p className="text-[10px] text-center font-bold uppercase text-muted-foreground tracking-widest">Available Bricks</p>
              <div className="flex flex-wrap justify-center gap-3">
                {currentLevel.bricks.filter(b => !built.includes(b.text)).map((brick, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className={cn(
                      "h-14 px-8 rounded-xl border-b-4 active:border-b-0 active:translate-y-px text-lg font-black transition-all hover:scale-105",
                      RoleColors[brick.role]
                    )}
                    onClick={() => handleSnap(brick.text)}
                  >
                    {brick.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-3 border-t pt-8">
            <Button variant="ghost" onClick={handleReset} disabled={isCorrect}>
              <RefreshCw className="mr-2 size-4" /> Start Over
            </Button>
            {!isCorrect ? (
              <Button 
                className="bg-basque-earth hover:bg-black text-white px-8" 
                onClick={checkBuild}
                disabled={built.length === 0}
              >
                Snap & Check
              </Button>
            ) : (
              <Button 
                className="bg-basque-green hover:bg-green-800 text-white px-10" 
                onClick={() => {
                  if (levelIdx < LEGO_LEVELS.length - 1) {
                    setLevelIdx(prev => prev + 1);
                    handleReset();
                  } else {
                    toast({ title: "Master Builder!", description: "You've completed the Lego Workshop!" });
                  }
                }}
              >
                {levelIdx === LEGO_LEVELS.length - 1 ? "Workshop Complete" : "Next Level"} <ArrowRight className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center gap-8 text-muted-foreground opacity-50">
        <div className="flex items-center gap-1"><Boxes className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Agglutination Mode</span></div>
        <div className="flex items-center gap-1"><Trophy className="size-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">CEFR A1 Path</span></div>
      </div>
    </div>
  );
}
