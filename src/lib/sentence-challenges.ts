
export type SentenceChallenge = {
  id: string;
  english: string;
  correct: string[];
  meaning: string;
  type: string;
};

export const SENTENCE_CHALLENGES: SentenceChallenge[] = [
  // Level 1-20: Basic Nominal Construction (Subject + Complement + Verb)
  { 
    id: 's-1', 
    english: "I am Jon.", 
    correct: ["Ni", "Jon", "naiz"], 
    meaning: "In Basque, the verb (naiz) goes at the end! 'Ni' is the I-brick, and 'Jon' is the name-brick.", 
    type: "A1 Basics" 
  },
  { 
    id: 's-2', 
    english: "The house is big.", 
    correct: ["Etxea", "handia", "da"], 
    meaning: "Notice the '-a' on 'Etxe-a'. That's the 'the-brick' we learned in the Lego workshop. 'Da' means 'is'.", 
    type: "A1 Description" 
  },
  { 
    id: 's-3', 
    english: "The dog is small.", 
    correct: ["Txakurrak", "txikia", "da"], 
    meaning: "Wait! Why does 'Txakur-a' have a 'k'? In some cases, words that end in 'a' already act like 'the'. Here, it's the subject brick.", 
    type: "A1 Description" 
  },
  { 
    id: 's-4', 
    english: "I am in the house.", 
    correct: ["Ni", "etxean", "naiz"], 
    meaning: "The '-n' on 'etxea-n' is the 'inside-brick'. It tells us the location of the action.", 
    type: "A1 Location" 
  },
  { 
    id: 's-5', 
    english: "The cat is on the table.", 
    correct: ["Katua", "mahaian", "dago"], 
    meaning: "We use 'dago' for location. 'Mahai-a-n' means Table-the-in. Snap the pieces together!", 
    type: "A1 Location" 
  },
  { 
    id: 's-6', 
    english: "I have the book.", 
    correct: ["Nik", "liburua", "dut"], 
    meaning: "The 'Nik' has a gold '-k' piece (The Boss Badge). This means 'I' am doing the action of having the book.", 
    type: "A1 Transitive" 
  },
  { 
    id: 's-7', 
    english: "The child is playing.", 
    correct: ["Haurra", "jolasten", "da"], 
    meaning: "The subject 'Haurra' is just standing there doing an action that doesn't affect anything else, so no Boss Badge needed!", 
    type: "A1 Daily" 
  },
  { 
    id: 's-8', 
    english: "I drink the water.", 
    correct: ["Nik", "ura", "edaten", "dut"], 
    meaning: "'Nik' (The Boss) + 'Ura' (The Thing) + 'Edaten dut' (The Action Engine).", 
    type: "A1 Daily" 
  },
  { 
    id: 's-9', 
    english: "The apple is red.", 
    correct: ["Sagarra", "gorria", "da"], 
    meaning: "Both the noun (Sagarra) and the adjective (Gorria) usually get the 'the-brick' (-a) when describing something.", 
    type: "A1 Description" 
  },
  { 
    id: 's-10', 
    english: "We are friends.", 
    correct: ["Gu", "lagunak", "gara"], 
    meaning: "Plural alert! 'Lagun-ak' uses the multi-stud plural brick. 'Gara' is the plural version of 'naiz'.", 
    type: "A1 Plurals" 
  },
  { 
    id: 's-11', 
    english: "The shops are new.", 
    correct: ["Dendak", "berriak", "dira"], 
    meaning: "Both 'Denda' and 'Berri' get the plural '-ak' piece to match! 'Dendak' means 'The shops'.", 
    type: "A1 Plurals" 
  },
  { 
    id: 's-12', 
    english: "I go to the town.", 
    correct: ["Ni", "herrira", "noa"], 
    meaning: "The '-ra' on 'herri-ra' is the 'toward-brick'. It shows motion toward a place.", 
    type: "A1 Motion" 
  },
  { 
    id: 's-13', 
    english: "My father is at work.", 
    correct: ["Nire", "aita", "lanean", "dago"], 
    meaning: "'Nire' is the possessive brick. 'Lan-ea-n' means in the work.", 
    type: "A1 Family" 
  },
  { 
    id: 's-14', 
    english: "The woman is beautiful.", 
    correct: ["Emakumea", "ederra", "da"], 
    meaning: "Simple description: Subject + Adjective + Is.", 
    type: "A1 Description" 
  },
  { 
    id: 's-15', 
    english: "The city is big.", 
    correct: ["Hiria", "handia", "da"], 
    meaning: "Hiria (The city) + Handia (The big) + Da (Is).", 
    type: "A1 Description" 
  },
  { 
    id: 's-16', 
    english: "I see the bird.", 
    correct: ["Nik", "hegaztia", "ikusten", "dut"], 
    meaning: "The Boss (Nik) sees the thing (Hegaztia).", 
    type: "A1 Senses" 
  },
  { 
    id: 's-17', 
    english: "The money is on the table.", 
    correct: ["Dirua", "mahaian", "dago"], 
    meaning: "Location check! Dirua (The money) + Mahaian (On the table) + Dago (Is).", 
    type: "A1 Location" 
  },
  { 
    id: 's-18', 
    english: "I want the bread.", 
    correct: ["Nik", "ogia", "nahi", "dut"], 
    meaning: "Wanting is an action! The Boss (Nik) wants the bread (Ogia).", 
    type: "A1 Shopping" 
  },
  { 
    id: 's-19', 
    english: "They are from San Sebastian.", 
    correct: ["Haiek", "Donostiakoak", "dira"], 
    meaning: "The '-ko' is the 'from-place-brick'. 'Donostiakoak' means people from Donostia.", 
    type: "A1 Origins" 
  },
  { 
    id: 's-20', 
    english: "I am happy.", 
    correct: ["Pozik", "naiz"], 
    meaning: "'Pozik' is an adverbial brick that describes how you are feeling.", 
    type: "A1 Emotion" 
  },
  
  // A1-A2 Extended (21-100) - Using nouns from FREQUENT_NOUNS
  { id: 's-21', english: "Where is the shop?", correct: ["Non", "dago", "denda?"], meaning: "Questions start with 'Non' (Where) and 'dago' (is location).", type: "A1 Questions" },
  { id: 's-22', english: "The shop is closed.", correct: ["Denda", "itxita", "dago"], meaning: "A state of being: Denda (Shop) + Itxita (Closed) + Dago (Is).", type: "A1 State" },
  { id: 's-23', english: "I go to the shop.", correct: ["Ni", "dendara", "noa"], meaning: "Motion toward: 'Ni' + 'Dendara' (To the shop) + 'Noa' (I go).", type: "A1 Motion" },
  { id: 's-24', english: "The water is cold.", correct: ["Ura", "hotza", "dago"], meaning: "Descriptions of temp use 'dago' or 'da' depending on context. Here, 'hotza' describes the state.", type: "A1 Description" },
  { id: 's-25', english: "I have many books.", correct: ["Nik", "liburu", "asko", "ditut"], meaning: "'Asko' (Many) goes after the noun. 'Ditut' is the plural engine (I have them).", type: "A1 Assets" },
  { id: 's-26', english: "The mountain is high.", correct: ["Mendia", "altua", "da"], meaning: "A classic description brick set.", type: "A1 Nature" },
  { id: 's-27', english: "The mountains are beautiful.", correct: ["Mendiak", "ederrak", "dira"], meaning: "Plural noun + Plural adjective + Plural verb!", type: "A1 Nature" },
  { id: 's-28', english: "I eat the apple.", correct: ["Nik", "sagarra", "jaten", "dut"], meaning: "Transitive action: The Boss (Nik) eats the object (Sagarra).", type: "A1 Daily" },
  { id: 's-29', english: "The man is at home.", correct: ["Gizona", "etxean", "dago"], meaning: "Gizona (The man) + Etxean (In the house) + Dago (Is).", type: "A1 Location" },
  { id: 's-30', english: "The woman is at work.", correct: ["Emakumea", "lanean", "dago"], meaning: "Emakumea (The woman) + Lanean (In work) + Dago (Is).", type: "A1 Location" },
  { id: 's-31', english: "I have a car.", correct: ["Nik", "auto", "bat", "dut"], meaning: "'Bat' (One/A) snaps after the noun 'Auto'.", type: "A1 Assets" },
  { id: 's-32', english: "The car is blue.", correct: ["Autoa", "urdina", "da"], meaning: "Auto-a (The car) + Urdin-a (The blue) + Da (Is).", type: "A1 Description" },
  { id: 's-33', english: "I see the tree.", correct: ["Nik", "zuhaitza", "ikusten", "dut"], meaning: "The Boss (Nik) sees the thing (Zuhaitza).", type: "A1 Nature" },
  { id: 's-34', english: "The sun is hot.", correct: ["Eguzkia", "bero", "dago"], meaning: "Weather and environment descriptions.", type: "A1 Nature" },
  { id: 's-35', english: "I drink milk.", correct: ["Nik", "esnea", "edaten", "dut"], meaning: "Esne-a (The milk) being consumed by the Boss (Nik).", type: "A1 Food" },
  { id: 's-36', english: "I eat bread.", correct: ["Nik", "ogia", "jan", "egiten", "dut"], meaning: "Another way to say 'I eat bread' using 'egin' (to do).", type: "A1 Food" },
  { id: 's-37', english: "Where is the dog?", correct: ["Non", "dago", "txakurra?"], meaning: "Asking for location of a specific dog.", type: "A1 Questions" },
  { id: 's-38', english: "The dog is in the street.", correct: ["Txakurra", "kalean", "dago"], meaning: "Txakurra (The dog) + Kalean (In the street) + Dago (Is).", type: "A1 Location" },
  { id: 's-39', english: "I am with the friend.", correct: ["Ni", "lagunarekin", "naiz"], meaning: "The '-rekin' brick means 'with'. Lagun-a-rekin.", type: "A2 Complex" },
  { id: 's-40', english: "I have money.", correct: ["Nik", "dirua", "dut"], meaning: "I (Boss) have the money.", type: "A1 Assets" },
  { id: 's-41', english: "The boy is small.", correct: ["Mutila", "txikia", "da"], meaning: "Mutil-a (The boy) + Txiki-a (The small) + Da (Is).", type: "A1 Description" },
  { id: 's-42', english: "The girl is big.", correct: ["Neska", "handia", "da"], meaning: "Neska (The girl) + Handia (The big) + Da (Is).", type: "A1 Description" },
  { id: 's-43', english: "The child is in the school.", correct: ["Haurra", "eskola", "batean", "dago"], meaning: "Haurra (The child) + Eskola batean (In a school) + Dago.", type: "A1 Location" },
  { id: 's-44', english: "The teacher is in the room.", correct: ["Irakaslea", "gelan", "dago"], meaning: "Irakasle-a (The teacher) + Gela-n (In the room).", type: "A1 Location" },
  { id: 's-45', english: "The book is new.", correct: ["Liburua", "berria", "da"], meaning: "Liburu-a + Berri-a + Da.", type: "A1 Description" },
  { id: 's-46', english: "I read the book.", correct: ["Nik", "liburua", "irakurtzen", "dut"], meaning: "The Boss reads the book.", type: "A1 Daily" },
  { id: 's-47', english: "The window is open.", correct: ["Leihoa", "zabalik", "dago"], meaning: "Leiho-a (The window) + Zabalik (Open) + Dago.", type: "A1 State" },
  { id: 's-48', english: "The door is closed.", correct: ["Atea", "itxita", "dago"], meaning: "Ate-a (The door) + Itxita (Closed) + Dago.", type: "A1 State" },
  { id: 's-49', english: "I have a cat.", correct: ["Nik", "katu", "bat", "dut"], meaning: "Katu (Cat) + Bat (One) + Dut (I have it).", type: "A1 Assets" },
  { id: 's-50', english: "The cat is black.", correct: ["Katua", "beltza", "da"], meaning: "Katu-a + Beltz-a + Da.", type: "A1 Description" },
  { id: 's-51', english: "The flower is red.", correct: ["Lorea", "gorria", "da"], meaning: "Lore-a + Gorri-a + Da.", type: "A1 Nature" },
  { id: 's-52', english: "The river is long.", correct: ["Ibaia", "luzea", "da"], meaning: "Ibai-a + Luze-a + Da.", type: "A1 Nature" },
  { id: 's-53', english: "The sea is blue.", correct: ["Itsasoa", "urdina", "da"], meaning: "Itsaso-a + Urdin-a + Da.", type: "A1 Nature" },
  { id: 's-54', english: "The sky is gray.", correct: ["Zerua", "grisa", "dago"], meaning: "Weather state uses 'dago'.", type: "A1 Nature" },
  { id: 's-55', english: "I eat the meat.", correct: ["Nik", "haragia", "jaten", "dut"], meaning: "Haragi-a (The meat) being eaten by the Boss.", type: "A1 Food" },
  { id: 's-56', english: "I drink the wine.", correct: ["Nik", "ardoa", "edaten", "dut"], meaning: "Ardo-a (The wine) being drunk by the Boss.", type: "A1 Food" },
  { id: 's-57', english: "The town is old.", correct: ["Herria", "zaharra", "da"], meaning: "Herri-a + Zahar-a + Da.", type: "A1 Description" },
  { id: 's-58', english: "The city is noisy.", correct: ["Hiria", "zalapartatsua", "da"], meaning: "Hiri-a + Zalapartatsu-a + Da.", type: "A2 Description" },
  { id: 's-59', english: "I see the moon.", correct: ["Nik", "ilargia", "ikusten", "dut"], meaning: "The Boss sees the moon.", type: "A1 Nature" },
  { id: 's-60', english: "The stars are bright.", correct: ["Izarrak", "distiratsuak", "dira"], meaning: "Plural subject and adjective.", type: "A1 Nature" },
  { id: 's-61', english: "I am in the forest.", correct: ["Ni", "basoan", "naiz"], meaning: "Baso-a-n (In the forest).", type: "A1 Location" },
  { id: 's-62', english: "The bird flies.", correct: ["Hegaztiak", "hegan", "egiten", "du"], meaning: "The bird (Boss) does flight.", type: "A1 Nature" },
  { id: 's-63', english: "The tree is tall.", correct: ["Zuhaitza", "altua", "da"], meaning: "Zuhaitz-a + Altu-a + Da.", type: "A1 Nature" },
  { id: 's-64', english: "I have a phone.", correct: ["Nik", "telefono", "bat", "dut"], meaning: "Telefono + Bat + Dut.", type: "A1 Assets" },
  { id: 's-65', english: "The phone is new.", correct: ["Telefonoa", "berria", "da"], meaning: "Telefono-a + Berri-a + Da.", type: "A1 Description" },
  { id: 's-66', english: "I work in the shop.", correct: ["Nik", "dendan", "lan", "egiten", "dut"], meaning: "I (Boss) do work in the shop.", type: "A1 Work" },
  { id: 's-67', english: "The boy is at the zoo.", correct: ["Mutila", "zooan", "dago"], meaning: "Mutil-a + Zoo-a-n + Dago.", type: "A1 Location" },
  { id: 's-68', english: "The girl is at the cinema.", correct: ["Neska", "zineman", "dago"], meaning: "Neska + Zinema-n + Dago.", type: "A1 Location" },
  { id: 's-69', english: "The child is at the park.", correct: ["Haurra", "parkean", "dago"], meaning: "Haurra + Parke-a-n + Dago.", type: "A1 Location" },
  { id: 's-70', english: "I like the beach.", correct: ["Hondartza", "atsegin", "dut"], meaning: "I please the beach (I like it).", type: "A2 Preferences" },
  { id: 's-71', english: "The hospital is far.", correct: ["Ospitalea", "urrun", "dago"], meaning: "Ospitale-a + Urrun (Far) + Dago.", type: "A1 Location" },
  { id: 's-72', english: "The church is old.", correct: ["Eliza", "zaharra", "da"], meaning: "Eliza + Zahar-a + Da.", type: "A1 Description" },
  { id: 's-73', english: "I have a gift.", correct: ["Nik", "opari", "bat", "dut"], meaning: "Opari (Gift) + Bat + Dut.", type: "A1 Assets" },
  { id: 's-74', english: "The gift is for you.", correct: ["Oparia", "zuretzat", "da"], meaning: "Opari-a + Zuretzat (For you) + Da.", type: "A2 Complex" },
  { id: 's-75', english: "I eat breakfast.", correct: ["Nik", "gosaria", "jaten", "dut"], meaning: "The Boss eats the breakfast.", type: "A1 Food" },
  { id: 's-76', english: "I eat lunch.", correct: ["Nik", "bazkariak", "jaten", "ditut"], meaning: "I eat the lunches (plural).", type: "A1 Food" },
  { id: 's-77', english: "I eat dinner.", correct: ["Nik", "afaria", "jaten", "dut"], meaning: "The Boss eats the dinner.", type: "A1 Food" },
  { id: 's-78', english: "The food is good.", correct: ["Janaria", "ona", "da"], meaning: "Janari-a + On-a + Da.", type: "A1 Food" },
  { id: 's-79', english: "The shoes are black.", correct: ["Oinetakoak", "beltzak", "dira"], meaning: "Plural subject and adjective.", type: "A1 Description" },
  { id: 's-80', english: "The pants are long.", correct: ["Prakak", "luzeak", "dira"], meaning: "Plural subject and adjective.", type: "A1 Description" },
  { id: 's-81', english: "I have a shirt.", correct: ["Nik", "kamiseta", "bat", "dut"], meaning: "Kamiseta + Bat + Dut.", type: "A1 Assets" },
  { id: 's-82', english: "The body is strong.", correct: ["Gorputza", "sendoa", "da"], meaning: "Gorputz-a + Sendo-a + Da.", type: "A1 Description" },
  { id: 's-83', english: "The head is big.", correct: ["Burua", "handia", "da"], meaning: "Buru-a + Handi-a + Da.", type: "A1 Description" },
  { id: 's-84', english: "I see with the eye.", correct: ["Begiarekin", "ikusten", "dut"], meaning: "Begi-a-rekin (With the eye).", type: "A2 Complex" },
  { id: 's-85', english: "I hear with the ear.", correct: ["Belarriarekin", "entzuten", "dut"], meaning: "Belarri-a-rekin (With the ear).", type: "A2 Complex" },
  { id: 's-86', english: "The mouth is small.", correct: ["Ahoa", "txikia", "da"], meaning: "Aho-a + Txiki-a + Da.", type: "A1 Description" },
  { id: 's-87', english: "The heart is red.", correct: ["Bihotza", "gorria", "da"], meaning: "Bihotz-a + Gorri-a + Da.", type: "A1 Description" },
  { id: 's-88', english: "The blood is red.", correct: ["Odola", "gorria", "da"], meaning: "Odol-a + Gorri-a + Da.", type: "A1 Description" },
  { id: 's-89', english: "The foot is small.", correct: ["Oina", "txikia", "da"], meaning: "Oin-a + Txiki-a + Da.", type: "A1 Description" },
  { id: 's-90', english: "I play a game.", correct: ["Nik", "jolas", "bat", "egiten", "dut"], meaning: "I (Boss) do a game.", type: "A1 Daily" },
  { id: 's-91', english: "The music is loud.", correct: ["Musika", "ozen", "dago"], meaning: "State of the music.", type: "A1 Description" },
  { id: 's-92', english: "I sing a song.", correct: ["Nik", "kantu", "bat", "kantatzen", "dut"], meaning: "The Boss sings a song.", type: "A1 Daily" },
  { id: 's-93', english: "They dance at the party.", correct: ["Haiek", "jaian", "dantzatzen", "dira"], meaning: "Subject + Locative + Verb.", type: "A1 Daily" },
  { id: 's-94', english: "The vacation is long.", correct: ["Oporrak", "luzeak", "dira"], meaning: "Vacations (plural in Basque) are long.", type: "A1 Description" },
  { id: 's-95', english: "I go to the beach.", correct: ["Ni", "hondartzara", "noa"], meaning: "Ni + Hondartza-ra + Noa.", type: "A1 Motion" },
  { id: 's-96', english: "The museum is interesting.", correct: ["Museoa", "interesgarria", "da"], meaning: "Museo-a + Interesgarri-a + Da.", type: "A2 Description" },
  { id: 's-97', english: "I am in the library.", correct: ["Ni", "liburutegian", "naiz"], meaning: "Liburutegi-a-n (In the library).", type: "A1 Location" },
  { id: 's-98', english: "The church is beautiful.", correct: ["Eliza", "ederra", "da"], meaning: "Eliza + Eder-a + Da.", type: "A1 Description" },
  { id: 's-99', english: "I brought an apple for the friend.", correct: ["Lagunarentzat", "sagarra", "ekarri", "dut"], meaning: "Lagun-a-rentzat (For the friend) + Sagar-a + Ekarri dut.", type: "A2 Complex" },
  { id: 's-100', english: "The book is for the child.", correct: ["Liburua", "haurrarentzat", "da"], meaning: "Liburu-a + Haur-a-rentzat (For the child) + Da.", type: "A2 Complex" }
];
