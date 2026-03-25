export type SentenceChallenge = {
  id: string;
  english: string;
  correct: string[];
  meaning: string;
  type: string;
  world: 'names' | 'actions' | 'location' | 'habits' | 'social';
  highlights?: Record<string, string[]>; // Maps a full word to its [root, suffix] parts
};

export const SENTENCE_CHALLENGES: SentenceChallenge[] = [
  // World 1: Names & Things
  { 
    id: 's-1', 
    english: "I am Jon.", 
    correct: ["Ni", "Jon", "naiz"], 
    meaning: "In Basque, the verb goes at the end! 'Ni' is the I-brick, and 'naiz' refers to 'I am' (the am-brick). 'Jon' is the name-brick.", 
    type: "A1 Basics",
    world: 'names',
    highlights: { "naiz": ["na", "iz"] }
  },
  { 
    id: 's-2', 
    english: "The house is big.", 
    correct: ["Etxea", "handia", "da"], 
    meaning: "Notice the '-a' on 'Etxe-a'. That's the 'the-brick' we learned in the Lego workshop. 'Da' means 'is' (he/she/it is).", 
    type: "A1 Description",
    world: 'names',
    highlights: { "Etxea": ["Etxe", "a"], "handia": ["handi", "a"] }
  },
  { 
    id: 's-3', 
    english: "The dog is small.", 
    correct: ["Txakurrak", "txikia", "da"], 
    meaning: "In Basque, 'Txakurrak' can mean 'the dog' as a subject. Notice the vibrant 'r' doubling! 'Da' is our 'is-brick'.", 
    type: "A1 Description",
    world: 'names',
    highlights: { "Txakurrak": ["Txakur", "rak"], "txikia": ["txiki", "a"] }
  },
  { 
    id: 's-9', 
    english: "The apple is red.", 
    correct: ["Sagarra", "gorria", "da"], 
    meaning: "Sagar (Apple) becomes Sagar-ra (The apple). The 'r' doubles! 'Da' acts as the 'is-brick'.", 
    type: "A1 Description",
    world: 'names',
    highlights: { "Sagarra": ["Sagar", "ra"], "gorria": ["gorri", "a"] }
  },
  { 
    id: 's-10', 
    english: "We are friends.", 
    correct: ["Gu", "lagunak", "gara"], 
    meaning: "Plural alert! 'Lagun-ak' uses the multi-stud plural brick. 'Gara' refers to 'we are'.", 
    type: "A1 Plurals",
    world: 'names',
    highlights: { "lagunak": ["lagun", "ak"] }
  },

  // World 2: Actions (Who Does What?)
  { 
    id: 's-6', 
    english: "I have the book.", 
    correct: ["Nik", "liburua", "dut"], 
    meaning: "The 'Nik' has a gold '-k' piece (The Boss Badge). 'Liburu-a' is the 'the-book' brick, where 'liburu' (book) and '-a' (the) snap together. 'Dut' means 'I have it'.", 
    type: "A1 Transitive",
    world: 'actions',
    highlights: { "Nik": ["Ni", "k"], "liburua": ["liburu", "a"] }
  },
  { 
    id: 's-8', 
    english: "I drink the water.", 
    correct: ["Nik", "ura", "edaten", "dut"], 
    meaning: "'Nik' (The Boss) + 'Ura' (The Thing) + 'Edaten dut' (The Action Engine). 'Dut' indexes both 'I' and 'it'.", 
    type: "A1 Daily",
    world: 'actions',
    highlights: { "Nik": ["Ni", "k"], "ura": ["ur", "a"], "edaten": ["eda", "ten"] }
  },
  { 
    id: 's-18', 
    english: "I want the bread.", 
    correct: ["Nik", "ogia", "nahi", "dut"], 
    meaning: "The Boss (Nik) wants (nahi) the bread (Ogia). 'Dut' completes the action.", 
    type: "A1 Shopping",
    world: 'actions',
    highlights: { "Nik": ["Ni", "k"], "ogia": ["ogi", "a"] }
  },

  // World 3: Being & Location
  { 
    id: 's-4', 
    english: "I am in the house.", 
    correct: ["Ni", "etxean", "naiz"], 
    meaning: "The '-n' on 'etxea-n' is the 'inside-brick'. 'Naiz' refers to 'I am' (the am-brick).", 
    type: "A1 Location",
    world: 'location',
    highlights: { "etxean": ["etxea", "n"], "naiz": ["na", "iz"] }
  },
  { 
    id: 's-5', 
    english: "The cat is on the table.", 
    correct: ["Katua", "mahaian", "dago"], 
    meaning: "Location check! Katua (The cat) + Mahaian (On the table) + Dago (Is, specifically for location).", 
    type: "A1 Location",
    world: 'location',
    highlights: { "Katua": ["Katu", "a"], "mahaian": ["mahai", "an"] }
  },

  // World 5: Social Quests
  { 
    id: 's-39', 
    english: "I am with the friend.", 
    correct: ["Ni", "lagunarekin", "naiz"], 
    meaning: "The '-rekin' brick means 'with'. 'Naiz' confirms the 'I am' (am-brick) state.", 
    type: "A2 Complex",
    world: 'social',
    highlights: { "lagunarekin": ["lagun", "arekin"], "naiz": ["na", "iz"] }
  },
  { 
    id: 's-74', 
    english: "The gift is for you.", 
    correct: ["Oparia", "zuretzat", "da"], 
    meaning: "Zuretzat (For you) uses the '-tzat' recipient brick. 'Da' is the 'is-brick'.", 
    type: "A2 Complex",
    world: 'social',
    highlights: { "Oparia": ["Opari", "a"], "zuretzat": ["zure", "tzat"] }
  }
];
