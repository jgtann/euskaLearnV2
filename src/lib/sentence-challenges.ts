export type SentenceChallenge = {
  id: string;
  english: string;
  correct: string[];
  meaning: string;
  type: string;
  world: 'names' | 'actions' | 'location' | 'habits' | 'social';
};

export const SENTENCE_CHALLENGES: SentenceChallenge[] = [
  // World 1: Names & Things
  { 
    id: 's-1', 
    english: "I am Jon.", 
    correct: ["Ni", "Jon", "naiz"], 
    meaning: "In Basque, the verb (naiz) goes at the end! 'Ni' is the I-brick, and 'Jon' is the name-brick.", 
    type: "A1 Basics",
    world: 'names'
  },
  { 
    id: 's-2', 
    english: "The house is big.", 
    correct: ["Etxea", "handia", "da"], 
    meaning: "Notice the '-a' on 'Etxe-a'. That's the 'the-brick' we learned in the Lego workshop. 'Da' means 'is'.", 
    type: "A1 Description",
    world: 'names'
  },
  { 
    id: 's-3', 
    english: "The dog is small.", 
    correct: ["Txakurrak", "txikia", "da"], 
    meaning: "Wait! Why does 'Txakur-a' have a 'k'? In some cases, words that end in 'a' already act like 'the'. Here, it's the subject brick.", 
    type: "A1 Description",
    world: 'names'
  },
  { 
    id: 's-9', 
    english: "The apple is red.", 
    correct: ["Sagarra", "gorria", "da"], 
    meaning: "Both the noun (Sagarra) and the adjective (Gorria) usually get the 'the-brick' (-a) when describing something.", 
    type: "A1 Description",
    world: 'names'
  },
  { 
    id: 's-10', 
    english: "We are friends.", 
    correct: ["Gu", "lagunak", "gara"], 
    meaning: "Plural alert! 'Lagun-ak' uses the multi-stud plural brick. 'Gara' is the plural version of 'naiz'.", 
    type: "A1 Plurals",
    world: 'names'
  },

  // World 2: Actions (Who Does What?)
  { 
    id: 's-6', 
    english: "I have the book.", 
    correct: ["Nik", "liburua", "dut"], 
    meaning: "The 'Nik' has a gold '-k' piece (The Boss Badge). This means 'I' am doing the action of having the book.", 
    type: "A1 Transitive",
    world: 'actions'
  },
  { 
    id: 's-8', 
    english: "I drink the water.", 
    correct: ["Nik", "ura", "edaten", "dut"], 
    meaning: "'Nik' (The Boss) + 'Ura' (The Thing) + 'Edaten dut' (The Action Engine).", 
    type: "A1 Daily",
    world: 'actions'
  },
  { 
    id: 's-16', 
    english: "I see the bird.", 
    correct: ["Nik", "hegaztia", "ikusten", "dut"], 
    meaning: "The Boss (Nik) sees the thing (Hegaztia).", 
    type: "A1 Senses",
    world: 'actions'
  },
  { 
    id: 's-18', 
    english: "I want the bread.", 
    correct: ["Nik", "ogia", "nahi", "dut"], 
    meaning: "Wanting is an action! The Boss (Nik) wants the bread (Ogia).", 
    type: "A1 Shopping",
    world: 'actions'
  },
  { 
    id: 's-31', 
    english: "I have a car.", 
    correct: ["Nik", "auto", "bat", "dut"], 
    meaning: "'Bat' (One/A) snaps after the noun 'Auto'.", 
    type: "A1 Assets",
    world: 'actions'
  },

  // World 3: Being & Location
  { 
    id: 's-4', 
    english: "I am in the house.", 
    correct: ["Ni", "etxean", "naiz"], 
    meaning: "The '-n' on 'etxea-n' is the 'inside-brick'. It tells us the location of the action.", 
    type: "A1 Location",
    world: 'location'
  },
  { 
    id: 's-5', 
    english: "The cat is on the table.", 
    correct: ["Katua", "mahaian", "dago"], 
    meaning: "We use 'dago' for location. 'Mahai-a-n' means Table-the-in. Snap the pieces together!", 
    type: "A1 Location",
    world: 'location'
  },
  { 
    id: 's-12', 
    english: "I go to the town.", 
    correct: ["Ni", "herrira", "noa"], 
    meaning: "The '-ra' on 'herri-ra' is the 'toward-brick'. It shows motion toward a place.", 
    type: "A1 Motion",
    world: 'location'
  },
  { 
    id: 's-17', 
    english: "The money is on the table.", 
    correct: ["Dirua", "mahaian", "dago"], 
    meaning: "Location check! Dirua (The money) + Mahaian (On the table) + Dago (Is).", 
    type: "A1 Location",
    world: 'location'
  },
  { 
    id: 's-29', 
    english: "The man is at home.", 
    correct: ["Gizona", "etxean", "dago"], 
    meaning: "Gizona (The man) + Etxean (In the house) + Dago (Is).", 
    type: "A1 Location",
    world: 'location'
  },

  // World 4: Habits
  { 
    id: 's-7', 
    english: "The child is playing.", 
    correct: ["Haurra", "jolasten", "da"], 
    meaning: "The subject 'Haurra' is just standing there doing an action that doesn't affect anything else, so no Boss Badge needed!", 
    type: "A1 Daily",
    world: 'habits'
  },
  { 
    id: 's-28', 
    english: "I eat the apple.", 
    correct: ["Nik", "sagarra", "jaten", "dut"], 
    meaning: "Transitive action: The Boss (Nik) eats the object (Sagarra).", 
    type: "A1 Daily",
    world: 'habits'
  },
  { 
    id: 's-46', 
    english: "I read the book.", 
    correct: ["Nik", "liburua", "irakurtzen", "dut"], 
    meaning: "The Boss reads the book.", 
    type: "A1 Daily",
    world: 'habits'
  },
  { 
    id: 's-75', 
    english: "I eat breakfast.", 
    correct: ["Nik", "gosaria", "jaten", "dut"], 
    meaning: "The Boss eats the breakfast.", 
    type: "A1 Food",
    world: 'habits'
  },
  { 
    id: 's-90', 
    english: "I play a game.", 
    correct: ["Nik", "jolas", "bat", "egiten", "dut"], 
    meaning: "I (Boss) do a game.", 
    type: "A1 Daily",
    world: 'habits'
  },

  // World 5: Social Quests
  { 
    id: 's-13', 
    english: "My father is at work.", 
    correct: ["Nire", "aita", "lanean", "dago"], 
    meaning: "'Nire' is the possessive brick. 'Lan-ea-n' means in the work.", 
    type: "A1 Family",
    world: 'social'
  },
  { 
    id: 's-19', 
    english: "They are from San Sebastian.", 
    correct: ["Haiek", "Donostiakoak", "dira"], 
    meaning: "The '-ko' is the 'from-place-brick'. 'Donostiakoak' means people from Donostia.", 
    type: "A1 Origins",
    world: 'social'
  },
  { 
    id: 's-39', 
    english: "I am with the friend.", 
    correct: ["Ni", "lagunarekin", "naiz"], 
    meaning: "The '-rekin' brick means 'with'. Lagun-a-rekin.", 
    type: "A2 Complex",
    world: 'social'
  },
  { 
    id: 's-74', 
    english: "The gift is for you.", 
    correct: ["Oparia", "zuretzat", "da"], 
    meaning: "Opari-a + Zuretzat (For you) + Da.", 
    type: "A2 Complex",
    world: 'social'
  },
  { 
    id: 's-100', 
    english: "The book is for the child.", 
    correct: ["Liburua", "haurrarentzat", "da"], 
    meaning: "Liburu-a + Haur-a-rentzat (For the child) + Da.", 
    type: "A2 Complex",
    world: 'social'
  }
];