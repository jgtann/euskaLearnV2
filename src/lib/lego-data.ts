
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
  { basque: "Neska", english: "Girl" },
  { basque: "Lagun", english: "Friend" },
  { basque: "Gela", english: "Room" },
  { basque: "Leiho", english: "Window" },
  { basque: "Ate", english: "Door" },
  { basque: "Ohe", english: "Bed" },
  { basque: "Sukalde", english: "Kitchen" },
  { basque: "Arkatz", english: "Pencil" },
  { basque: "Paper", english: "Paper" },
  { basque: "Telefono", english: "Phone" },
  { basque: "Itsaso", english: "Sea" },
  { basque: "Eguzki", english: "Sun" },
  { basque: "Ilargi", english: "Moon" },
  { basque: "Izar", english: "Star" },
  { basque: "Baso", english: "Forest" },
  { basque: "Animalia", english: "Animal" },
  { basque: "Hegazti", english: "Bird" },
  { basque: "Landare", english: "Plant" },
  { basque: "Janari", english: "Food" },
  { basque: "Gosari", english: "Breakfast" },
  { basque: "Bazkari", english: "Lunch" },
  { basque: "Afari", english: "Dinner" },
  { basque: "Arropa", english: "Clothes" },
  { basque: "Jantzi", english: "Dress" },
  { basque: "Oinetako", english: "Shoe" },
  { basque: "Txano", english: "Hat" },
  { basque: "Soineko", english: "Dress" },
  { basque: "Praka", english: "Pants" },
  { basque: "Kamiseta", english: "T-shirt" },
  { basque: "Gorputz", english: "Body" },
  { basque: "Buru", english: "Head" },
  { basque: "Begi", english: "Eye" },
  { basque: "Belarri", english: "Ear" },
  { basque: "Sudur", english: "Nose" },
  { basque: "Aho", english: "Mouth" },
  { basque: "Hortz", english: "Tooth" },
  { basque: "Bihotz", english: "Heart" },
  { basque: "Odol", english: "Blood" },
  { basque: "Oin", english: "Foot" },
  { basque: "Beso", english: "Arm" },
  { basque: "Jolas", english: "Game" },
  { basque: "Kirol", english: "Sport" },
  { basque: "Futbol", english: "Football" },
  { basque: "Pilota", english: "Ball" },
  { basque: "Musika", english: "Music" },
  { basque: "Kantu", english: "Song" },
  { basque: "Dantza", english: "Dance" },
  { basque: "Jai", english: "Party" },
  { basque: "Opor", english: "Vacation" },
  { basque: "Bidaia", english: "Trip" },
  { basque: "Hondartza", english: "Beach" },
  { basque: "Parke", english: "Park" },
  { basque: "Zoo", english: "Zoo" },
  { basque: "Zinema", english: "Cinema" },
  { basque: "Museo", english: "Museum" },
  { basque: "Liburutegi", english: "Library" },
  { basque: "Eliza", english: "Church" },
  { basque: "Ospitale", english: "Hospital" },
  { basque: "Zentro", english: "Center" },
  { basque: "Opari", english: "Gift" }
];

export function generateLegoLevels(noun: { basque: string, english: string }): LegoLevel[] {
  const root = noun.basque;
  const eng = noun.english.toLowerCase();
  const endsInA = root.toLowerCase().endsWith('a');

  return [
    {
      id: 1,
      title: "Level 1: The Base Brick",
      description: "Every build starts with one piece. This is the core idea sitting in the box.",
      example: `${root} (${noun.english})`,
      bricks: [{ text: root, role: 'root' }],
      target: root,
      translation: noun.english,
      logic: `This is the dictionary form of ${eng}. In Basque, we often refer to this as the 'unmarked' or 'absolute' brick.`
    },
    {
      id: 2,
      title: "Level 2: The 'The' Piece",
      description: `Snap on the specialized piece to make it specific. ${endsInA ? "Since the brick already ends in 'a', the 'the' piece is already built-in!" : "Snap on the '-a' piece."}`,
      example: endsInA ? `${root}` : `${root} + a = ${root}a`,
      bricks: endsInA ? [{ text: root, role: 'root' }] : [{ text: root, role: 'root' }, { text: "-a", role: 'article' }],
      target: endsInA ? root : `${root}a`,
      translation: `The ${eng}`,
      logic: endsInA ? `Because ${root} ends in 'a', it already acts as if it has the article attached.` : `In Basque, 'the' is a suffix that snaps onto the end of the base brick.`
    },
    {
      id: 3,
      title: "Level 3: Multi-Stud Block",
      description: `If you have more than one, we use the plural piece '-ak'. ${endsInA ? "Since the brick ends in 'a', we just snap on a '-k'." : "Snap on '-ak'."}`,
      example: endsInA ? `${root} + k = ${root}k` : `${root} + ak = ${root}ak`,
      bricks: endsInA ? [{ text: root, role: 'root' }, { text: "-k", role: 'plural' }] : [{ text: root, role: 'root' }, { text: "-ak", role: 'plural' }],
      target: endsInA ? `${root}k` : `${root}ak`,
      translation: `The ${eng}s`,
      logic: `One simple piece swap changes the meaning from 'one' to 'many'. ${endsInA ? "The 'a' + 'ak' merge into 'ak'." : ""}`
    },
    {
      id: 4,
      title: "Level 4: The 'Where/Who' Pieces",
      description: "Now we add 'action' or 'location' blocks to the back of the train.",
      example: `${root}a + rekin = ${root}${endsInA ? "" : "a"}rekin`,
      bricks: [{ text: root, role: 'root' }, { text: endsInA ? "" : "-a", role: 'article' }, { text: "-rekin", role: 'suffix' }].filter(b => b.text !== ""),
      target: `${endsInA ? root : root + 'a'}rekin`,
      translation: `With the ${eng}`,
      logic: `The word gets longer as we add context, but the base brick '${root}' stays at the front.`
    },
    {
      id: 5,
      title: "Level 5: The Boss Badge",
      description: "The gold '-k' piece marks the subject as the 'Boss' of an action.",
      example: `${root}a + k = ${root}${endsInA ? "" : "a"}k`,
      bricks: [{ text: root, role: 'root' }, { text: endsInA ? "" : "-a", role: 'article' }, { text: "-k", role: 'gold' }].filter(b => b.text !== ""),
      target: `${endsInA ? root : root + 'a'}k`,
      translation: `The ${eng} (doing an action)`,
      logic: "This gold piece is called the Ergative marker. It's like a special badge for the word doing the work."
    },
    {
      id: 6,
      title: "Level 6: The Super-Verb engine",
      description: "Basque verbs are like complex engines made of tiny technical parts.",
      example: "d + i + zu + t = Dizut",
      bricks: [{ text: "d-", role: 'verb' }, { text: "-i-", role: 'verb' }, { text: "-zu-", role: 'verb' }, { text: "-t", role: 'verb' }],
      target: "Dizut",
      translation: "I give it to you",
      logic: "d- (it) + -i- (giving) + -zu- (to you) + -t (by me). Everything snapped into one powerful engine block!"
    }
  ];
}
