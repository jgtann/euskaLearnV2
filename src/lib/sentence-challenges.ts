
export type SentenceChallenge = {
  id: string;
  english: string;
  correct: string[];
  meaning: string;
  type: string;
};

export const SENTENCE_CHALLENGES: SentenceChallenge[] = [
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
  { id: 's-11', english: "The cat eats an apple.", correct: ["Katuak", "sagar", "bat", "jaten", "du"], meaning: "Ergative + Object + Verb + Aux", type: "A1 Daily" },
  { id: 's-12', english: "My father is at work.", correct: ["Nire", "aita", "lanean", "dago"], meaning: "Genitive + Subject + Locative + Verb", type: "A1 Family" },
  { id: 's-13', english: "I like the mountains.", correct: ["Mendiak", "maite", "ditut"], meaning: "Object (Plural) + Love + Aux", type: "A1 Nature" },
  { id: 's-14', english: "He goes to the town.", correct: ["Hura", "herrira", "doa"], meaning: "Subject + Allative + Verb", type: "A1 Motion" },
  { id: 's-15', english: "We have two cars.", correct: ["Guk", "bi", "auto", "ditugu"], meaning: "Ergative + Number + Noun + Aux", type: "A1 Assets" },
  { id: 's-16', english: "The woman is beautiful.", correct: ["Emakumea", "ederra", "da"], meaning: "Subject + Adjective + Verb", type: "A1 Description" },
  { id: 's-17', english: "I see the city.", correct: ["Nik", "hiria", "ikusten", "dut"], meaning: "Ergative + Object + Verb + Aux", type: "A1 Senses" },
  { id: 's-18', english: "The child plays in the street.", correct: ["Haurra", "kalean", "jolasten", "da"], meaning: "Subject + Locative + Verb", type: "A1 Daily" },
  { id: 's-19', english: "They are from San Sebastian.", correct: ["Haiek", "Donostiakoak", "dira"], meaning: "Subject + Local Genitive + Verb", type: "A1 Origins" },
  { id: 's-20', english: "I want to buy bread.", correct: ["Nik", "ogia", "erosi", "nahi", "dut"], meaning: "Ergative + Object + Verb + Want + Aux", type: "A1 Shopping" }
  // ... (In a production environment, this would be an even larger JSON file or fetched from Firestore)
];
