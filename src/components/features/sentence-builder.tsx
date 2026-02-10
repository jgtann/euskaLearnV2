
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, RefreshCw, Sparkles, ArrowRight, XCircle } from 'lucide-react';

// Thesis 5.4: Expanded Syntax Scrambles (A1 & A2 levels)
const sentenceChallenges = [
  // A1: Basics & "To Be" (Nor)
  { english: "I am Jon.", correct: ["Ni", "Jon", "naiz"], meaning: "Subject + Complement + Verb", type: "A1 Basics" },
  { english: "You are a student.", correct: ["Zu", "ikaslea", "zara"], meaning: "Subject + Noun + Verb", type: "A1 Basics" },
  { english: "The house is big.", correct: ["Etxea", "handia", "da"], meaning: "Subject + Adjective + Verb", type: "A1 Basics" },
  { english: "We are friends.", correct: ["Gu", "lagunak", "gara"], meaning: "Plural Subject + Plural Noun + Verb", type: "A1 Basics" },
  { english: "They are teachers.", correct: ["Haiek", "irakasleak", "dira"], meaning: "Plural Subject + Plural Noun + Verb", type: "A1 Basics" },
  
  // A1: Locations (Inessive)
  { english: "I am in the house.", correct: ["Ni", "etxean", "naiz"], meaning: "Subject + Inessive + Verb", type: "A1 Location" },
  { english: "The book is on the table.", correct: ["Liburua", "mahaian", "dago"], meaning: "Subject + Locative + Verb (State)", type: "A1 Location" },
  { english: "We are in Bilbao.", correct: ["Gu", "Bilbon", "gaude"], meaning: "Subject + City-In + Verb (State)", type: "A1 Location" },
  { english: "The water is cold.", correct: ["Ura", "hotza", "dago"], meaning: "Subject + Temp Adjective + Dago", type: "A1 Location" },
  { english: "Are you at school?", correct: ["Eskolan", "zaude?", "Zu"], meaning: "Locative + Verb + Subject", type: "A1 Location" },

  // A1: Possession & Transitive (Nor-Nork)
  { english: "I have a book.", correct: ["Nik", "liburu", "bat", "dut"], meaning: "Ergative + Object + Bat + Aux", type: "A1 Transitive" },
  { english: "You have two dogs.", correct: ["Zuk", "bi", "txakur", "dituzu"], meaning: "Ergative + Number + Object + Aux (Plural Obj)", type: "A1 Transitive" },
  { english: "He has the key.", correct: ["Hark", "giltza", "du"], meaning: "Ergative + Object + Aux", type: "A1 Transitive" },
  { english: "We have the food.", correct: ["Guk", "janaria", "dugu"], meaning: "Ergative + Object + Aux", type: "A1 Transitive" },
  { english: "They have the cars.", correct: ["Haiek", "autoak", "dituzte"], meaning: "Ergative + Plural Object + Aux", type: "A1 Transitive" },

  // A1: Basic Verbs (Present)
  { english: "I drink water.", correct: ["Nik", "ura", "edaten", "dut"], meaning: "Ergative + Object + Main Verb + Aux", type: "A1 Daily" },
  { english: "You eat bread.", correct: ["Zuk", "ogia", "jaten", "duzu"], meaning: "Ergative + Object + Main Verb + Aux", type: "A1 Daily" },
  { english: "The girl speaks Basque.", correct: ["Neskak", "euskaraz", "hitz", "egiten", "du"], meaning: "Ergative + Language + Compound Verb", type: "A1 Daily" },
  { english: "I go to the park.", correct: ["Ni", "parkera", "joaten", "naiz"], meaning: "Subject + Adlative + Main Verb + Aux", type: "A1 Daily" },
  { english: "We see the mountain.", correct: ["Guk", "mendia", "ikusten", "dugu"], meaning: "Ergative + Object + Verb + Aux", type: "A1 Daily" },

  // A1: Negation (The "Order Flip")
  { english: "I am not a doctor.", correct: ["Ni", "ez", "naiz", "medikua"], meaning: "Negation + Aux + Complement", type: "A1 Negation" },
  { english: "You don't have water.", correct: ["Zuk", "ez", "duzu", "urarik"], meaning: "Ergative + Ez + Aux + Partitive", type: "A1 Negation" },
  { english: "He doesn't speak.", correct: ["Hark", "ez", "du", "hitz", "egiten"], meaning: "Ergative + Ez + Aux + Main Verb", type: "A1 Negation" },
  { english: "We are not in the city.", correct: ["Gu", "ez", "gaude", "hirian"], meaning: "Subject + Ez + Aux + Locative", type: "A1 Negation" },
  { english: "It is not expensive.", correct: ["Hura", "ez", "da", "garestia"], meaning: "Subject + Ez + Aux + Adjective", type: "A1 Negation" },

  // A2: Adverbs & Time
  { english: "I always study.", correct: ["Nik", "beti", "ikasten", "dut"], meaning: "Ergative + Adverb + Verb + Aux", type: "A2 Time" },
  { english: "She often comes here.", correct: ["Hura", "sarri", "hona", "etortzen", "da"], meaning: "Subject + Adverb + Adlative + Verb + Aux", type: "A2 Time" },
  { english: "Today is Monday.", correct: ["Gaur", "astelehena", "da"], meaning: "Time + Complement + Verb", type: "A2 Time" },
  { english: "We eat at two.", correct: ["Gu", "bietan", "bazkaltzen", "gara"], meaning: "Subject + Time-In + Verb + Aux", type: "A2 Time" },
  { english: "I never smoke.", correct: ["Nik", "ez", "dut", "inoiz", "erretzen"], meaning: "Ergative + Ez + Aux + Inoiz + Verb", type: "A2 Time" },

  // A2: Past Tense (Lehenaldia - Nor)
  { english: "I was at home.", correct: ["Ni", "etxean", "nintzen"], meaning: "Subject + Locative + Past Aux", type: "A2 Past" },
  { english: "You were happy.", correct: ["Zu", "pozik", "zinen"], meaning: "Subject + Adjective + Past Aux", type: "A2 Past" },
  { english: "The man was tired.", correct: ["Gizona", "nekatuta", "zegoen"], meaning: "Subject + Participle + Past State", type: "A2 Past" },
  { english: "We went to the beach.", correct: ["Gu", "hondartzara", "joan", "ginen"], meaning: "Subject + Adlative + Verb + Past Aux", type: "A2 Past" },
  { english: "They came yesterday.", correct: ["Haiek", "atzo", "etorri", "ziren"], meaning: "Subject + Time + Verb + Past Aux", type: "A2 Past" },

  // A2: Past Tense (Lehenaldia - Nor-Nork)
  { english: "I had a cat.", correct: ["Nik", "katu", "bat", "nuen"], meaning: "Ergative + Object + Past Aux", type: "A2 Past" },
  { english: "You saw the movie.", correct: ["Zuk", "pelikula", "ikusi", "zenuen"], meaning: "Ergative + Object + Verb + Past Aux", type: "A2 Past" },
  { english: "He bought the bread.", correct: ["Hark", "ogia", "erosi", "zuen"], meaning: "Ergative + Object + Verb + Past Aux", type: "A2 Past" },
  { english: "We read the books.", correct: ["Guk", "liburuak", "irakurri", "genituen"], meaning: "Ergative + Plural Object + Verb + Past Aux", type: "A2 Past" },
  { english: "They did the work.", correct: ["Haiek", "lana", "egin", "zuten"], meaning: "Ergative + Object + Verb + Past Aux", type: "A2 Past" },

  // A2: Recipient Actions (Nor-Nori-Nork)
  { english: "I give the book to you.", correct: ["Nik", "liburua", "ematen", "dizut"], meaning: "Ergative + Obj + Verb + Aux (I to You)", type: "A2 Ditransitive" },
  { english: "The woman gives the book to the man.", correct: ["Emakumeak", "gizonari", "liburua", "ematen", "dio"], meaning: "Ergative + Dative + Obj + Verb + Aux", type: "A2 Ditransitive" },
  { english: "We tell the truth to them.", correct: ["Guk", "egia", "esaten", "diegu"], meaning: "Ergative + Obj + Verb + Aux (We to Them)", type: "A2 Ditransitive" },
  { english: "You bring flowers to her.", correct: ["Zuk", "loreak", "ekartzen", "diozu"], meaning: "Ergative + Plural Obj + Verb + Aux", type: "A2 Ditransitive" },
  { english: "I wrote a letter to my mother.", correct: ["Nik", "gutun", "bat", "idatzi", "nion", "amari"], meaning: "Ergative + Obj + Verb + Past Aux + Dative", type: "A2 Ditransitive" },

  // A2: Feelings & States
  { english: "I am cold.", correct: ["Ni", "hotzak", "nago"], meaning: "Subject + Noun (Cold) + Verb (State)", type: "A2 State" },
  { english: "Are you hungry?", correct: ["Gose", "zara?", "Zu"], meaning: "Noun (Hunger) + Verb + Subject", type: "A2 State" },
  { english: "I like coffee.", correct: ["Niri", "kafea", "gustatzen", "zait"], meaning: "Dative + Subject + Verb + Aux", type: "A2 State" },
  { english: "We love Basque.", correct: ["Guri", "euskara", "maite", "dugu"], meaning: "Dative + Subject + Maite + Aux", type: "A2 State" },
  { english: "She is thirsty.", correct: ["Hura", "egarriak", "dago"], meaning: "Subject + Noun (Thirst) + Verb (State)", type: "A2 State" },

  // A2: Direction & Origin
  { english: "I come from the city.", correct: ["Ni", "hiritik", "nator"], meaning: "Subject + Ablative + Verb (Synthetic)", type: "A2 Travel" },
  { english: "We go to the mountain.", correct: ["Gu", "mendira", "goaz"], meaning: "Subject + Adlative + Verb (Synthetic)", type: "A2 Travel" },
  { english: "Where are you going?", correct: ["Nora", "zoaz?", "Zu"], meaning: "Where-To + Verb + Subject", type: "A2 Travel" },
  { english: "I am going to San Sebastian.", correct: ["Donostiara", "noa", "ni"], meaning: "Adlative + Verb + Subject", type: "A2 Travel" },
  { english: "The train comes from Madrid.", correct: ["Trena", "Madriletik", "dator"], meaning: "Subject + City-From + Verb", type: "A2 Travel" },

  // A2: Complex Structures & Questions
  { english: "Who has the money?", correct: ["Nork", "du", "dirua?"], meaning: "Who (Erg) + Aux + Object", type: "A2 Questions" },
  { english: "What is this?", correct: ["Zer", "da", "hau?"], meaning: "What + Verb + This", type: "A2 Questions" },
  { english: "Where is the dog?", correct: ["Non", "dago", "txakurra?"], meaning: "Where + Verb + Subject", type: "A2 Questions" },
  { english: "Why are you here?", correct: ["Zergatik", "zaude", "hemen?"], meaning: "Why + Verb + Here", type: "A2 Questions" },
  { english: "How are you?", correct: ["Nola", "zaude?", "Zu"], meaning: "How + Verb + Subject", type: "A2 Questions" },

  // Filling up to 100 sentences with variants of the above patterns
  { english: "The cat is on the chair.", correct: ["Katua", "aulkian", "dago"], meaning: "Subject + Locative + Dago", type: "A1 Location" },
  { english: "I drink red wine.", correct: ["Nik", "ardo", "gorria", "edaten", "dut"], meaning: "Ergative + Object + Adjective + Verb + Aux", type: "A1 Daily" },
  { english: "The car is blue.", correct: ["Autoa", "urdina", "da"], meaning: "Subject + Adjective + Verb", type: "A1 Basics" },
  { english: "We study every day.", correct: ["Guk", "egunero", "ikasten", "dugu"], meaning: "Ergative + Adv + Verb + Aux", type: "A2 Time" },
  { english: "I bought an apple.", correct: ["Nik", "sagar", "bat", "erosi", "nuen"], meaning: "Ergative + Object + Verb + Past Aux", type: "A2 Past" },
  { english: "The father works in the office.", correct: ["Aitak", "bulegoan", "lan", "egiten", "du"], meaning: "Ergative + Locative + Compound Verb", type: "A1 Daily" },
  { english: "I saw my friend.", correct: ["Nik", "nire", "laguna", "ikusi", "nuen"], meaning: "Ergative + My + Object + Verb + Past Aux", type: "A2 Past" },
  { english: "The keys are here.", correct: ["Giltzak", "hemen", "daude"], meaning: "Subject (Plural) + Here + Verb (Plural)", type: "A1 Location" },
  { english: "Give the money to me.", correct: ["Eman", "dirua", "niri"], meaning: "Verb + Object + Dative", type: "A2 Ditransitive" },
  { english: "I don't know.", correct: ["Nik", "ez", "dakit"], meaning: "Ergative + Ez + Synthetic Verb", type: "A1 Negation" },
  { english: "They were in the garden.", correct: ["Haiek", "lorategian", "zeuden"], meaning: "Subject + Locative + Past Verb (Plural)", type: "A2 Past" },
  { english: "The bread is fresh.", correct: ["Ogia", "berria", "da"], meaning: "Subject + Adjective + Verb", type: "A1 Basics" },
  { english: "I love you.", correct: ["Maite", "zaitut"], meaning: "Maite + Aux (I to You)", type: "A1 Basics" },
  { english: "We live in a small village.", correct: ["Gu", "herri", "txiki", "batean", "bizi", "gara"], meaning: "Subject + Noun + Adj + Bat-In + Bizi + Aux", type: "A2 Travel" },
  { english: "It rained yesterday.", correct: ["Atzo", "euria", "egin", "zuen"], meaning: "Time + Subject + Verb + Past Aux", type: "A2 Past" },
  { english: "The windows are open.", correct: ["Leihoak", "zabalik", "daude"], meaning: "Subject + State + Verb", type: "A1 Location" },
  { english: "I read the newspaper.", correct: ["Nik", "egunkaria", "irakurtzen", "dut"], meaning: "Ergative + Object + Verb + Aux", type: "A1 Daily" },
  { english: "They understood everything.", correct: ["Haiek", "dena", "ulertu", "zuten"], meaning: "Ergative + Everything + Verb + Past Aux", type: "A2 Past" },
  { english: "She sang a song.", correct: ["Hark", "abesti", "bat", "kantatu", "zuen"], meaning: "Ergative + Noun + Bat + Verb + Past Aux", type: "A2 Past" },
  { english: "I want to go.", correct: ["Nik", "joan", "nahi", "dut"], meaning: "Ergative + Verb + Nahi + Aux", type: "A1 Daily" },
  { english: "The table is broken.", correct: ["Mahaia", "hautsita", "dago"], meaning: "Subject + Participle + Verb", type: "A2 State" },
  { english: "We are at the door.", correct: ["Gu", "atean", "gaude"], meaning: "Subject + Locative + Verb", type: "A1 Location" },
  { english: "The man eats an orange.", correct: ["Gizonak", "laranja", "bat", "jaten", "du"], meaning: "Ergative + Obj + Bat + Verb + Aux", type: "A1 Daily" },
  { english: "I need help.", correct: ["Nik", "laguntza", "behar", "dut"], meaning: "Ergative + Help + Behar + Aux", type: "A1 Daily" },
  { english: "The book was interesting.", correct: ["Liburua", "interesgarria", "zen"], meaning: "Subject + Adjective + Past Aux", type: "A2 Past" },
  { english: "They walked together.", correct: ["Haiek", "elkarrekin", "ibili", "ziren"], meaning: "Subject + Together + Verb + Past Aux", type: "A2 Past" },
  { english: "I am thirsty.", correct: ["Ni", "egarriak", "nago"], meaning: "Subject + Noun + Verb", type: "A2 State" },
  { english: "The sky is gray.", correct: ["Zeurua", "grisa", "dago"], meaning: "Subject + Adjective + Verb", type: "A1 Basics" },
  { english: "He told a story.", correct: ["Hark", "ipuin", "bat", "kontatu", "zuen"], meaning: "Ergative + Obj + Bat + Verb + Past Aux", type: "A2 Past" },
  { english: "We saw the stars.", correct: ["Guk", "izarrak", "ikusi", "genituen"], meaning: "Ergative + Plural Obj + Verb + Past Aux", type: "A2 Past" },
  { english: "The flowers are beautiful.", correct: ["Loreak", "ederrak", "dira"], meaning: "Plural Subject + Plural Adj + Verb", type: "A1 Basics" },
  { english: "I don't like beer.", correct: ["Niri", "ez", "zait", "garagardoa", "gustatzen"], meaning: "Dative + Ez + Aux + Subject + Verb", type: "A2 State" },
  { english: "You found the treasure.", correct: ["Zuk", "altxorra", "aurkitu", "zenuen"], meaning: "Ergative + Object + Verb + Past Aux", type: "A2 Past" },
  { english: "The child sleeps.", correct: ["Haurra", "lo", "dago"], meaning: "Subject + Sleep + Verb", type: "A1 Daily" },
  { english: "The house is old.", correct: ["Etxea", "zaharra", "da"], meaning: "Subject + Adj + Verb", type: "A1 Basics" },
  { english: "We drink coffee with milk.", correct: ["Guk", "kafea", "esnearekin", "edaten", "dugu"], meaning: "Ergative + Obj + With-Milk + Verb + Aux", type: "A2 Daily" },
  { english: "I am twenty years old.", correct: ["Nik", "hogei", "urte", "ditut"], meaning: "Ergative + Number + Years + Aux", type: "A1 Basics" },
  { english: "The teacher speaks clearly.", correct: ["Irakasleak", "garbi", "hitz", "egiten", "du"], meaning: "Ergative + Adv + Verb + Aux", type: "A2 Daily" },
  { english: "They built a bridge.", correct: ["Haiek", "zubi", "bat", "eraiki", "zuten"], meaning: "Ergative + Obj + Bat + Verb + Past Aux", type: "A2 Past" },
  { english: "I will go tomorrow.", correct: ["Bihar", "joango", "naiz"], meaning: "Time + Future Verb + Aux", type: "A2 Future" }
];

export function SentenceBuilder() {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [palette, setPalette] = useState<string[]>([]);

  const current = sentenceChallenges[challengeIdx];

  useEffect(() => {
    if (current) {
      setPalette([...current.correct].sort(() => Math.random() - 0.5));
      setConstructed([]);
      setFeedback(null);
    }
  }, [challengeIdx, current]);

  const handleTile = (word: string, isPalette: boolean, idx?: number) => {
    if (feedback === 'correct') return;
    if (isPalette) {
      setConstructed([...constructed, word]);
      const newPalette = [...palette];
      newPalette.splice(idx!, 1);
      setPalette(newPalette);
    } else {
      setConstructed(constructed.filter((_, i) => i !== idx));
      setPalette([...palette, word]);
    }
    setFeedback(null);
  };

  const check = () => {
    const isCorrect = JSON.stringify(constructed) === JSON.stringify(current.correct);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-8 border-t-primary shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded">
              {current.type}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">
              {challengeIdx + 1} / {sentenceChallenges.length}
            </span>
          </div>
          <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Syntax Scramble</CardTitle>
          <div className="text-2xl font-bold mt-2 text-basque-earth">"{current.english}"</div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className={cn(
            "flex flex-wrap items-center justify-center gap-2 p-6 min-h-[120px] rounded-2xl border-2 border-dashed transition-all",
            feedback === 'correct' ? "bg-green-50 border-green-500 shadow-inner" : "bg-muted/50 border-border"
          )}>
            {constructed.map((w, i) => (
              <Button 
                key={i} 
                variant="outline" 
                className="bg-white font-bold border-b-4 border-slate-200 active:border-b-0 translate-y-0 active:translate-y-px" 
                onClick={() => handleTile(w, false, i)}
              >
                {w}
              </Button>
            ))}
            {constructed.length === 0 && <p className="text-muted-foreground italic">Reconstruct the Basque sentence...</p>}
          </div>

          <div className="flex flex-wrap justify-center gap-3 p-6 bg-muted rounded-xl min-h-[100px] border">
            {palette.map((w, i) => (
              <Button 
                key={i} 
                variant="secondary" 
                className="font-bold hover:scale-105 transition-transform bg-white text-basque-earth border-b-4 border-basque-earth/10" 
                onClick={() => handleTile(w, true, i)}
              >
                {w}
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={() => { setPalette([...current.correct].sort()); setConstructed([]); setFeedback(null); }}>
              <RefreshCw className="size-4 mr-2" /> Reset
            </Button>
            {feedback === 'correct' ? (
              <Button className="bg-basque-green hover:bg-green-700 px-8" onClick={() => setChallengeIdx((i) => (i + 1) % sentenceChallenges.length)}>
                Next Sentence <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button 
                className="bg-basque-earth hover:bg-black px-8 shadow-lg" 
                onClick={check} 
                disabled={constructed.length !== current.correct.length}
              >
                Check Syntax
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {feedback === 'incorrect' && (
        <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-center flex items-center justify-center gap-2 text-destructive animate-in shake">
          <XCircle className="size-5" />
          <p className="text-sm font-bold">Try a different order. Hint: {current.meaning}</p>
        </div>
      )}

      {feedback === 'correct' && (
        <div className="bg-basque-green/10 p-4 rounded-xl border border-basque-green/20 text-center flex flex-col items-center justify-center gap-1 text-basque-green animate-in fade-in zoom-in">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" />
            <p className="text-sm font-bold uppercase tracking-widest">Grammar Note</p>
          </div>
          <p className="text-xs opacity-80">{current.meaning}</p>
        </div>
      )}
    </div>
  );
}
