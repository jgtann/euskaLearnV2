'use client';

import { useState, useMemo, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RefreshCw, Sparkles, ArrowRight, XCircle, Volume2, Loader2, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { getSpeech } from '@/app/actions/speech';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

const sentenceChallenges = [
  { id: 's-1', english: "I am Jon.", correct: ["Ni", "Jon", "naiz"], meaning: "Subject + Complement + Verb", type: "A1 Basics" },
  { id: 's-2', english: "You are a student.", correct: ["Zu", "ikaslea", "zara"], meaning: "Subject + Noun + Verb", type: "A1 Basics" },
  { id: 's-3', english: "The house is big.", correct: ["Etxea", "handia", "da"], meaning: "Subject + Adjective + Verb", type: "A1 Basics" },
  { id: 's-4', english: "We are friends.", correct: ["Gu", "lagunak", "gara"], meaning: "Plural Subject + Plural Noun + Verb", type: "A1 Basics" },
  { id: 's-5', english: "I am in the house.", correct: ["Ni", "etxean", "naiz"], meaning: "Subject + Inessive + Verb", type: "A1 Location" },
  { id: 's-6', english: "The book is on the table.", correct: ["Liburua", "mahaian", "dago"], meaning: "Subject + Locative + Verb (State)", type: "A1 Location" },
  { id: 's-7', english: "I have a book.", correct: ["Nik", "liburu", "bat", "dut"], meaning: "Ergative + Object + Bat + Aux", type: "A1 Transitive" },
  { id: 's-8', english: "I drink water.", correct: ["Nik", "ura", "edaten", "dut"], meaning: "Ergative + Object + Main Verb + Aux", type: "A1 Daily" },
  { id: 's-9', english: "I am not a doctor.", correct: ["Ni", "ez", "naiz", "medikua"], meaning: "Negation + Aux + Complement", type: "A1 Negation" },
  { id: 's-10', english: "I always study.", correct: ["Nik", "beti", "ikasten", "dut"], meaning: "Ergative + Adverb + Verb + Aux", type: "A2 Time" },
  { id: 's-11', english: "He eats an apple.", correct: ["Hark", "sagarra", "jaten", "du"], meaning: "Ergative (Hark) + Object + Verb + Aux", type: "A1 Transitive" },
  { id: 's-12', english: "They see the mountain.", correct: ["Haiek", "mendia", "ikusten", "dute"], meaning: "Subject + Object + Verb + Aux", type: "A1 Basics" },
  { id: 's-13', english: "We go to the park.", correct: ["Gu", "parkera", "goaz"], meaning: "Subject + Allative (to the) + Verb", type: "A1 Location" },
  { id: 's-14', english: "Where are you from?", correct: ["Nongoa", "zara", "zu?"], meaning: "Genitive + Verb + Subject", type: "A1 Basics" },
  { id: 's-15', english: "I am from Bilbao.", correct: ["Ni", "Bilbokoa", "naiz"], meaning: "Subject + Genitive + Verb", type: "A1 Basics" },
  { id: 's-16', english: "The coffee is hot.", correct: ["Kafea", "bero", "dago"], meaning: "Subject + Adjective + Verb (State)", type: "A1 Basics" },
  { id: 's-17', english: "I like milk.", correct: ["Esnea", "gustatzen", "zait"], meaning: "Subject + Verb + Dative Aux (to me)", type: "A1 Preferences" },
  { id: 's-18', english: "Do you like tea?", correct: ["Tea", "gustatzen", "zaizu?"], meaning: "Subject + Verb + Dative Aux (to you)", type: "A1 Preferences" },
  { id: 's-19', english: "I have two sisters.", correct: ["Nik", "bi", "arreba", "ditut"], meaning: "Ergative + Number + Noun + Plural Aux", type: "A1 Family" },
  { id: 's-20', english: "She has three brothers.", correct: ["Hark", "hiru", "neba", "ditu"], meaning: "Ergative + Number + Noun + Plural Aux", type: "A1 Family" },
  { id: 's-21', english: "I was happy.", correct: ["Ni", "pozik", "nintzen"], meaning: "Subject + Adverb + Past Aux", type: "A2 Past" },
  { id: 's-22', english: "Yesterday I went home.", correct: ["Atzo", "etxera", "joan", "nintzen"], meaning: "Adverb + Allative + Verb + Past Aux", type: "A2 Past" },
  { id: 's-23', english: "I had a cat.", correct: ["Nik", "katu", "bat", "nuen"], meaning: "Ergative + Object + Bat + Past Aux", type: "A2 Past" },
  { id: 's-24', english: "They were in the street.", correct: ["Haiek", "kalean", "zeuden"], meaning: "Subject + Inessive + Past Verb (State)", type: "A2 Past" },
  { id: 's-25', english: "I gave the book to her.", correct: ["Nik", "liburua", "eman", "nion"], meaning: "Ergative + Object + Verb + Dative Past Aux", type: "A2 Ditransitive" },
  { id: 's-26', english: "You told me the truth.", correct: ["Zuk", "egia", "esan", "zenidan"], meaning: "Ergative + Object + Verb + Dative Past Aux", type: "A2 Ditransitive" },
  { id: 's-27', english: "I don't have money.", correct: ["Nik", "ez", "dut", "dirurik"], meaning: "Negation + Aux + Partitive (any money)", type: "A1 Negation" },
  { id: 's-28', english: "We don't know.", correct: ["Guk", "ez", "dakigu"], meaning: "Subject + Negation + Synthetic Verb", type: "A1 Negation" },
  { id: 's-29', english: "I want to sleep.", correct: ["Lo", "egin", "nahi", "dut"], meaning: "Noun + Verb + Want + Aux", type: "A1 Intent" },
  { id: 's-30', english: "Can you help me?", correct: ["Lagun", "diezaidakezu?"], meaning: "Verb + Potencial Aux (to me)", type: "A2 Modal" },
  { id: 's-31', english: "I am writing a letter.", correct: ["Gutun", "bat", "idazten", "ari", "naiz"], meaning: "Object + Progressive Aspect", type: "A2 Aspect" },
  { id: 's-32', english: "What are you doing?", correct: ["Zer", "egiten", "ari", "zara?"], meaning: "What + Progressive Aspect", type: "A2 Aspect" },
  { id: 's-33', english: "The cat is under the table.", correct: ["Katua", "mahaiaren", "azpian", "dago"], meaning: "Subject + Genitive + Postposition + Verb", type: "A2 Location" },
  { id: 's-34', english: "The ball is behind the door.", correct: ["Pilota", "atearen", "atzean", "dago"], meaning: "Subject + Genitive + Postposition + Verb", type: "A2 Location" },
  { id: 's-35', english: "I come from the school.", correct: ["Eskolatik", "nator"], meaning: "Ablative (from) + Synthetic Verb", type: "A1 Location" },
  { id: 's-36', english: "We are going to Bilbao.", correct: ["Bilbora", "goaz"], meaning: "Allative (to) + Synthetic Verb", type: "A1 Location" },
  { id: 's-37', english: "I have to work.", correct: ["Lan", "egin", "behar", "dut"], meaning: "Work + Need + Aux", type: "A1 Necessity" },
  { id: 's-38', english: "He needs a car.", correct: ["Hark", "auto", "bat", "behar", "du"], meaning: "Ergative + Bat + Need + Aux", type: "A1 Necessity" },
  { id: 's-39', english: "I am cold.", correct: ["Hotz", "naiz"], meaning: "Adjective + Verb", type: "A1 Feelings" },
  { id: 's-40', english: "Are you hungry?", correct: ["Gose", "zara?"], meaning: "Adjective + Verb", type: "A1 Feelings" },
  { id: 's-41', english: "I love you.", correct: ["Maite", "zaitut"], meaning: "Love + Object Aux (you)", type: "A1 Emotions" },
  { id: 's-42', english: "They love us.", correct: ["Maite", "gaituzte"], meaning: "Love + Object Aux (us)", type: "A1 Emotions" },
  { id: 's-43', english: "I will go tomorrow.", correct: ["Bihar", "joango", "naiz"], meaning: "Adverb + Future Verb + Aux", type: "A2 Future" },
  { id: 's-44', english: "We will eat later.", correct: ["Gero", "jango", "dugu"], meaning: "Adverb + Future Verb + Aux", type: "A2 Future" },
  { id: 's-45', english: "The bread is on the table.", correct: ["Ogia", "mahaiaren", "gainean", "dago"], meaning: "Subject + Genitive + Postposition + Verb", type: "A2 Location" },
  { id: 's-46', english: "I am tired.", correct: ["Nigatuta", "naiz"], meaning: "Adjective + Verb", type: "A1 Feelings" },
  { id: 's-47', english: "The window is open.", correct: ["Leihoa", "zabalik", "dago"], meaning: "Subject + Participle (state) + Verb", type: "A1 States" },
  { id: 's-48', english: "The door is closed.", correct: ["Atea", "itxita", "dago"], meaning: "Subject + Participle (state) + Verb", type: "A1 States" },
  { id: 's-49', english: "I buy bread every day.", correct: ["Egunero", "ogia", "erosten", "dut"], meaning: "Frequency + Object + Verb + Aux", type: "A1 Daily" },
  { id: 's-50', english: "She speaks Basque very well.", correct: ["Hark", "oso", "ondo", "hitz", "egiten", "du", "euskaraz"], meaning: "Ergative + Adv + Verb + In language", type: "A2 Daily" },
  { id: 's-51', english: "I live in Donostia.", correct: ["Donostian", "bizi", "naiz"], meaning: "Inessive + Verb", type: "A1 Basics" },
  { id: 's-52', english: "My father is a teacher.", correct: ["Nire", "aita", "irakaslea", "da"], meaning: "My + Subject + Noun + Verb", type: "A1 Family" },
  { id: 's-53', english: "Your house is beautiful.", correct: ["Zure", "etxea", "ederra", "da"], meaning: "Your + Subject + Adj + Verb", type: "A1 Basics" },
  { id: 's-54', english: "I have a big dog.", correct: ["Nik", "txakur", "handi", "bat", "dut"], meaning: "Ergative + Noun + Adj + Bat + Aux", type: "A1 Basics" },
  { id: 's-55', english: "We drink cider.", correct: ["Guk", "sagardoa", "edaten", "dugu"], meaning: "Ergative + Object + Verb + Aux", type: "A1 Daily" },
  { id: 's-56', english: "They play football.", correct: ["Haiek", "futbolean", "jokatzen", "dute"], meaning: "Subject + Inessive (in football) + Verb + Aux", type: "A2 Daily" },
  { id: 's-57', english: "I am reading a book.", correct: ["Liburu", "bat", "irakurtzen", "ari", "naiz"], meaning: "Object + Progressive", type: "A2 Aspect" },
  { id: 's-58', english: "You are listening to music.", correct: ["Musika", "entzuten", "ari", "zara"], meaning: "Object + Progressive", type: "A2 Aspect" },
  { id: 's-59', english: "The milk is in the fridge.", correct: ["Esnea", "hozkailuan", "dago"], meaning: "Subject + Inessive + Verb", type: "A1 Location" },
  { id: 's-60', english: "I study at the university.", correct: ["Unibertsitatean", "ikasten", "dut"], meaning: "Inessive + Verb + Aux", type: "A1 Daily" },
  { id: 's-61', english: "I don't like cheese.", correct: ["Gazta", "ez", "zait", "gustatzen"], meaning: "Negation + Aux + Verb", type: "A1 Preferences" },
  { id: 's-62', english: "She doesn't like meat.", correct: ["Haragia", "ez", "zaio", "gustatzen"], meaning: "Negation + Aux + Verb", type: "A1 Preferences" },
  { id: 's-63', english: "The keys are in the car.", correct: ["Giltzak", "autoan", "daude"], meaning: "Plural Subject + Inessive + Plural Verb", type: "A1 Location" },
  { id: 's-64', english: "I saw you yesterday.", correct: ["Atzo", "ikusi", "zintudan"], meaning: "Adverb + Verb + Object Aux (you past)", type: "A2 Past" },
  { id: 's-65', english: "We saw them in the park.", correct: ["Parkean", "ikusi", "genituen"], meaning: "Inessive + Verb + Plural Object Aux (past)", type: "A2 Past" },
  { id: 's-66', english: "I will call you.", correct: ["Deituko", "dizut"], meaning: "Future Verb + Dative Aux (to you)", type: "A2 Future" },
  { id: 's-67', english: "He will give it to me.", correct: ["Emango", "didazu"], meaning: "Future Verb + Dative Aux (to me)", type: "A2 Future" },
  { id: 's-68', english: "I am learning Basque.", correct: ["Euskara", "ikasten", "ari", "naiz"], meaning: "Object + Progressive", type: "A1 Basics" },
  { id: 's-69', english: "You speak very fast.", correct: ["Oso", "azkar", "hitz", "egiten", "duzu"], meaning: "Adv + Adv + Verb + Aux", type: "A1 Basics" },
  { id: 's-70', english: "The children are playing.", correct: ["Haurrak", "jolasten", "ari", "dira"], meaning: "Plural Subject + Progressive", type: "A1 Daily" },
  { id: 's-71', english: "I want a coffee.", correct: ["Kafe", "bat", "nahi", "dut"], meaning: "Object + Want + Aux", type: "A1 Basics" },
  { id: 's-72', english: "We want two beers.", correct: ["Bi", "garagardo", "nahi", "ditugu"], meaning: "Number + Object + Want + Plural Aux", type: "A1 Daily" },
  { id: 's-73', english: "I don't know your name.", correct: ["Zure", "izena", "ez", "dut", "ezagutzen"], meaning: "Your + Object + Negation + Aux + Verb", type: "A1 Basics" },
  { id: 's-74', english: "Where is the bathroom?", correct: ["Non", "dago", "komuna?"], meaning: "Where + Verb + Subject", type: "A1 Basics" },
  { id: 's-75', english: "The museum is near here.", correct: ["Museoa", "hemendik", "gertu", "dago"], meaning: "Subject + Ablative + Near + Verb", type: "A2 Location" },
  { id: 's-76', english: "I am going to work now.", correct: ["Orain", "lanera", "noa"], meaning: "Adverb + Allative + Synthetic Verb", type: "A1 Daily" },
  { id: 's-77', english: "What time is it?", correct: ["Zer", "ordu", "da?"], meaning: "What + Time + Verb", type: "A1 Basics" },
  { id: 's-78', english: "It is three o'clock.", correct: ["Hirurak", "dira"], meaning: "Three (the) + Plural Verb", type: "A1 Time" },
  { id: 's-79', english: "I am 20 years old.", correct: ["Hogei", "urte", "ditut"], meaning: "Number + Years + Aux (I have them)", type: "A1 Basics" },
  { id: 's-80', english: "How old are you?", correct: ["Zenbat", "urte", "dituzu?"], meaning: "How many + Years + Aux (you have them)", type: "A1 Basics" },
  { id: 's-81', english: "The sun is shining.", correct: ["Eguzkia", "aterata", "dago"], meaning: "Subject + Participle + Verb", type: "A2 Nature" },
  { id: 's-82', english: "It is raining.", correct: ["Euria", "ari", "du"], meaning: "Subject (rain) + Progressive Aux", type: "A2 Nature" },
  { id: 's-83', english: "I have a headache.", correct: ["Buruko", "mina", "dut"], meaning: "Head + Pain + Aux", type: "A1 Basics" },
  { id: 's-84', english: "She has a cold.", correct: ["Hark", "katarroa", "du"], meaning: "Ergative + Object + Aux", type: "A1 Basics" },
  { id: 's-85', english: "I forgot the keys.", correct: ["Giltzak", "ahaztu", "zaizkit"], meaning: "Plural Subject + Verb + Dative Aux (to me)", type: "A2 Past" },
  { id: 's-86', english: "Wait for me.", correct: ["Itxaron", "niri"], meaning: "Verb + Dative (me)", type: "A1 Imperative" },
  { id: 's-87', english: "Open the door, please.", correct: ["Iriki", "atea,", "mesedez"], meaning: "Verb + Object + Please", type: "A1 Imperative" },
  { id: 's-88', english: "Close the book.", correct: ["Itxi", "liburua"], meaning: "Verb + Object", type: "A1 Imperative" },
  { id: 's-89', english: "I am studying Basque history.", correct: ["Euskal", "Herriko", "historia", "ikasten", "ari", "naiz"], meaning: "Adj + Genitive + Object + Progressive", type: "A2 Culture" },
  { id: 's-90', english: "Basque is very ancient.", correct: ["Euskara", "oso", "zaharra", "da"], meaning: "Subject + Adv + Adj + Verb", type: "A1 Culture" },
  { id: 's-91', english: "I like dancing.", correct: ["Dantza", "egitea", "gustatzen", "zait"], meaning: "Noun + Doing (the) + Like + Aux", type: "A2 Preferences" },
  { id: 's-92', english: "He likes singing.", correct: ["Abestea", "gustatzen", "zaio"], meaning: "Singing (the) + Like + Aux", type: "A2 Preferences" },
  { id: 's-93', english: "We live in a small village.", correct: ["Herri", "txiki", "batean", "bizi", "gara"], meaning: "Noun + Adj + Bat-Inessive + Live + Verb", type: "A2 Basics" },
  { id: 's-94', english: "I am happy to see you.", correct: ["Pozten", "naiz", "zu", "ikusteaz"], meaning: "Verb + Aux + You + Seeing (instrumental)", type: "A2 Feelings" },
  { id: 's-95', english: "See you later!", correct: ["Gero", "arte!"], meaning: "Later + Until", type: "A1 Basics" },
  { id: 's-96', english: "Have a good day!", correct: ["Egun", "on", "izan!"], meaning: "Day + Good + Have", type: "A1 Basics" },
  { id: 's-97', english: "Welcome!", correct: ["Ongi", "etorri!"], meaning: "Well + Come", type: "A1 Basics" },
  { id: 's-98', english: "How are you?", correct: ["Zer", "moduz", "zaude?"], meaning: "What + Way + Verb", type: "A1 Basics" },
  { id: 's-99', english: "I am fine, thanks.", correct: ["Ondo", "naiz,", "eskerrik", "asko"], meaning: "Well + Verb + Thanks", type: "A1 Basics" },
  { id: 's-100', english: "The train leaves at five.", correct: ["Trena", "bostetan", "irten", "da"], meaning: "Subject + Time (at five) + Verb + Aux", type: "A2 Time" },
];

export function SentenceBuilder() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [constructed, setConstructed] = useState<string[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAudioPending, startAudioTransition] = useTransition();
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const userItemsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'user_learning_items');
  }, [user, firestore]);
  const { data: userItems } = useCollection(userItemsQuery);

  const sortedChallenges = useMemo(() => {
    const now = Date.now();
    const records = userItems || [];
    const recordMap = new Map(records.map(r => [r.learningItemId, r]));

    return [...sentenceChallenges].sort((a, b) => {
      const recA = recordMap.get(a.id);
      const recB = recordMap.get(b.id);
      const dueA = recA ? recA.nextReview : 0;
      const dueB = recB ? recB.nextReview : 0;
      if (dueA <= now && dueB > now) return -1;
      if (dueB <= now && dueA > now) return 1;
      return Math.random() - 0.5;
    });
  }, [userItems]);

  const current = sortedChallenges[currentIdx];

  useEffect(() => {
    if (current) {
      setPalette([...current.correct].sort(() => Math.random() - 0.5));
      setConstructed([]);
      setFeedback(null);
    }
  }, [current]);

  const updateSRS = (success: boolean) => {
    if (!user || !firestore || !current) return;
    const records = userItems || [];
    const record = records.find(r => r.learningItemId === current.id);
    const level = record ? (success ? Math.min(record.level + 1, 5) : Math.max(record.level - 1, 0)) : (success ? 1 : 0);
    const intervals = [0, 1, 3, 7, 14, 30];
    const nextReview = Date.now() + (intervals[level] || 0) * 24 * 60 * 60 * 1000;
    
    const docId = record?.id || `${user.uid}_${current.id}`;
    const docRef = doc(firestore, 'users', user.uid, 'user_learning_items', docId);
    
    setDocumentNonBlocking(docRef, {
      id: docId,
      userId: user.uid,
      learningItemId: current.id,
      lastReviewed: Date.now(),
      nextReview,
      level,
      correctCount: (record?.correctCount || 0) + (success ? 1 : 0),
      incorrectCount: (record?.incorrectCount || 0) + (success ? 0 : 1),
    }, { merge: true });
  };

  const check = () => {
    const isCorrect = JSON.stringify(constructed) === JSON.stringify(current.correct);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateSRS(isCorrect);
    if (isCorrect) handlePlayAudio();
  };

  const handlePlayAudio = () => {
    const text = current.correct.join(' ');
    if (isAudioPending) return;
    if (audioCache[text]) { new Audio(audioCache[text]).play().catch(() => {}); return; }
    startAudioTransition(async () => {
      const formData = new FormData();
      formData.append('text', text);
      const response = await getSpeech(null, formData);
      if (response.data?.audioDataUri) {
        setAudioCache(prev => ({ ...prev, [text]: response.data.audioDataUri }));
        new Audio(response.data.audioDataUri).play().catch(() => {});
      }
    });
  };

  if (!current) return <div className="p-8 text-center">Loading syntax workshop...</div>;

  return (
    <div className="space-y-6">
      <Card className="border-t-8 border-t-primary shadow-xl overflow-hidden">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">{current.type}</Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BrainCircuit className="size-3" />
              <span className="text-[10px] font-bold">SRS Tracking</span>
            </div>
          </div>
          <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Syntax Scramble</CardTitle>
          <div className="text-2xl font-bold mt-2 text-basque-earth">"{current.english}"</div>
        </CardHeader>
        <CardContent className="space-y-8">
          {feedback === 'correct' && (
            <div className="flex flex-col items-center justify-center gap-2 py-4 animate-in zoom-in-95 fade-in duration-500">
              <div className="flex items-center gap-2 text-basque-green font-black text-2xl uppercase tracking-tighter">
                <Sparkles className="size-6 animate-bounce" />
                Zorionak!
                <Sparkles className="size-6 animate-bounce" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Syntax Correct</p>
            </div>
          )}

          <div className={cn(
            "flex flex-wrap items-center justify-center gap-2 p-6 min-h-[140px] rounded-2xl border-2 border-dashed transition-all duration-500", 
            feedback === 'correct' ? "bg-green-100 border-green-500 shadow-sm" : "bg-muted/50 border-border"
          )}>
            {constructed.map((w, i) => (
              <Button key={i} variant="outline" className="bg-white font-bold border-b-4 active:border-b-0 animate-in slide-in-from-bottom-2" onClick={() => {
                if (feedback === 'correct') return;
                setConstructed(prev => prev.filter((_, idx) => idx !== i));
                setPalette(prev => [...prev, w]);
              }}>
                {w}
              </Button>
            ))}
            {constructed.length === 0 && <p className="text-gray-400 italic">Select words to build the sentence...</p>}
          </div>

          <div className="flex flex-wrap justify-center gap-3 p-6 bg-muted rounded-xl border">
            {palette.map((w, i) => (
              <Button key={i} variant="secondary" className="font-bold bg-white border-b-4 hover:shadow-md transition-shadow" onClick={() => {
                if (feedback === 'correct') return;
                setConstructed(prev => [...prev, w]);
                setPalette(prev => prev.filter((_, idx) => idx !== i));
              }}>
                {w}
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={() => { setPalette([...current.correct].sort()); setConstructed([]); setFeedback(null); }}>
              <RefreshCw className="size-4 mr-2" /> Reset
            </Button>
            {feedback === 'correct' ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePlayAudio} disabled={isAudioPending}>
                  {isAudioPending ? <Loader2 className="size-5 animate-spin" /> : <Volume2 className="size-5" />}
                </Button>
                <Button className="bg-basque-green hover:bg-green-700 px-8" onClick={() => setCurrentIdx(prev => (prev + 1) % sortedChallenges.length)}>
                  Next <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            ) : (
              <Button className="bg-basque-earth hover:bg-black px-8" onClick={check} disabled={constructed.length !== current.correct.length}>
                Check Syntax
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {feedback === 'incorrect' && (
        <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-center flex items-center justify-center gap-2 text-destructive animate-in shake">
          <XCircle className="size-5" />
          <p className="text-sm font-bold">Hint: {current.meaning}</p>
        </div>
      )}
      {feedback === 'correct' && (
        <div className="bg-basque-green/10 p-4 rounded-xl border border-basque-green/20 text-center flex flex-col items-center justify-center gap-1 text-basque-green animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2"><Sparkles className="size-5" /><p className="text-sm font-bold uppercase">Grammar Note</p></div>
          <p className="text-xs">{current.meaning}</p>
        </div>
      )}
    </div>
  );
}