
export type LegoLevel = {
  id: number;
  title: string;
  description: string;
  example: string;
  bricks: { text: string; role: 'root' | 'article' | 'plural' | 'suffix' | 'gold' | 'verb' }[];
  target: string;
  translation: string;
  logic: string;
};

export const FREQUENT_NOUNS = [
  { basque: "Etxe", english: "House" },
  { basque: "Gizon", english: "Man" },
  { basque: "Emakume", english: "Woman" },
  { basque: "Txakur", english: "Dog" },
  { basque: "Katu", english: "Cat" },
  { basque: "Sagar", english: "Apple" },
  { basque: "Ur", english: "Water" },
  { basque: "Liburu", english: "Book" },
  { basque: "Mahai", english: "Table" },
  { basque: "Eskola", english: "School" },
  { basque: "Hiri", english: "City" },
  { basque: "Herri", english: "Town" },
  { basque: "Ama", english: "Mother" },
  { basque: "Aita", english: "Father" },
  { basque: "Seme", english: "Son" },
  { basque: "Alaba", english: "Daughter" },
  { basque: "Haur", english: "Child" },
  { basque: "Lan", english: "Work" },
  { basque: "Diru", english: "Money" },
  { basque: "Pertsona", english: "Person" },
  { basque: "Gauza", english: "Thing" },
  { basque: "Esku", english: "Hand" },
  { basque: "Egun", english: "Day" },
  { basque: "Urte", english: "Year" },
  { basque: "Leku", english: "Place" },
  { basque: "Lore", english: "Flower" },
  { basque: "Mendi", english: "Mountain" },
  { basque: "Ibai", english: "River" },
  { basque: "Zeru", english: "Sky" },
  { basque: "Ogi", english: "Bread" },
  { basque: "Ardo", english: "Wine" },
  { basque: "Esne", english: "Milk" },
  { basque: "Haragi", english: "Meat" },
  { basque: "Arrain", english: "Fish" },
  { basque: "Auto", english: "Car" },
  { basque: "Tren", english: "Train" },
  { basque: "Kale", english: "Street" },
  { basque: "Denda", english: "Shop" },
  { basque: "Mutil", english: "Boy" },
  { basque: "Neska", english: "Girl" }
];

export function generateLegoLevels(noun: { basque: string, english: string }): LegoLevel[] {
  const root = noun.basque;
  const eng = noun.english.toLowerCase();

  return [
    {
      id: 1,
      title: "Level 1: The Base Brick",
      description: "Every build starts with one piece. This is the core idea sitting in the box.",
      example: `${root} (${noun.english})`,
      bricks: [{ text: root, role: 'root' }],
      target: root,
      translation: noun.english,
      logic: `This is just the 'concept' of ${eng}. In Basque, the dictionary form is like a raw Lego brick.`
    },
    {
      id: 2,
      title: "Level 2: The 'The' Piece",
      description: "Snap on the flat, smooth '-a' piece to make it specific.",
      example: `${root} + a = ${root}a`,
      bricks: [{ text: root, role: 'root' }, { text: "-a", role: 'article' }],
      target: `${root}a`,
      translation: `The ${eng}`,
      logic: "In Basque, 'the' is a sticker that goes on the end of the brick."
    },
    {
      id: 3,
      title: "Level 3: Multi-Stud Block",
      description: "If you have more than one, swap the '-a' for the plural '-ak'.",
      example: `${root} + ak = ${root}ak`,
      bricks: [{ text: root, role: 'root' }, { text: "-ak", role: 'plural' }],
      target: `${root}ak`,
      translation: `The ${eng}s`,
      logic: "One simple swap changes the whole meaning from 'one' to 'many'."
    },
    {
      id: 4,
      title: "Level 4: The 'Where/Who' Pieces",
      description: "Now we add 'action' or 'location' blocks to the back of the train.",
      example: `${root}a + rekin = ${root}arekin`,
      bricks: [{ text: root, role: 'root' }, { text: "-a", role: 'article' }, { text: "-rekin", role: 'suffix' }],
      target: `${root}arekin`,
      translation: `With the ${eng}`,
      logic: `The word gets longer, but you can still see the original ${root} at the front!`
    },
    {
      id: 5,
      title: "Level 5: The Boss Badge",
      description: "The gold '-k' piece means the subject is doing an action to something else.",
      example: `${root}a + k = ${root}ak`,
      bricks: [{ text: root, role: 'root' }, { text: "-a", role: 'article' }, { text: "-k", role: 'gold' }],
      target: `${root}ak`,
      translation: `The ${eng} (as the doer)`,
      logic: "This gold piece marks the 'Boss' of the action. It's called the Ergative case."
    },
    {
      id: 6,
      title: "Level 6: The Super-Verb engine",
      description: "Basque verbs are like complex engines made of tiny technical parts.",
      example: "d + u + t = Dut",
      bricks: [{ text: "d-", role: 'verb' }, { text: "-u-", role: 'verb' }, { text: "-t", role: 'verb' }],
      target: "Dut",
      translation: "I have it",
      logic: "d- (it) + -u- (have) + -t (by me). Everything snapped into one engine block!"
    }
  ];
}
