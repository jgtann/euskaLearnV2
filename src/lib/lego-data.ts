
export type WorldType = 'names' | 'actions' | 'location' | 'habits' | 'social';

export type LegoLevel = {
  id: number;
  world: WorldType;
  title: string;
  description: string;
  example: string;
  bricks: { text: string; role: 'root' | 'article' | 'plural' | 'suffix' | 'gold' | 'verb' }[];
  target: string;
  translation: string;
  logic: string;
};

export const WORLDS = [
  { id: 'names', title: 'World 1: Names & Things', description: 'Determiners, pluralization, and noun order.', icon: 'Boxes' },
  { id: 'actions', title: 'World 2: Who Does What?', description: 'The SOV baseline and the Ergative (-k) "Boss Badge".', icon: 'Zap' },
  { id: 'location', title: 'World 3: Being & Location', description: 'The verbs izan/egon and the "Inside-Brick" (-n).', icon: 'MapPin' },
  { id: 'habits', title: 'World 4: Habits', description: 'The -tzen habitual engine and routine activities.', icon: 'Clock' },
  { id: 'social', title: 'World 5: Social Quests', description: 'Dative recipients (-ri) and polite encounters.', icon: 'Users' }
];

export const FREQUENT_NOUNS = [
  { basque: "Etxe", english: "House", world: 'names' },
  { basque: "Gizon", english: "Man", world: 'names' },
  { basque: "Emakume", english: "Woman", world: 'names' },
  { basque: "Txakur", english: "Dog", world: 'names' },
  { basque: "Katu", english: "Cat", world: 'names' },
  { basque: "Sagar", english: "Apple", world: 'names' },
  { basque: "Ur", english: "Water", world: 'names' },
  { basque: "Liburu", english: "Book", world: 'names' }
];

export function generateLegoLevels(noun: { basque: string, english: string, world?: string }): LegoLevel[] {
  const root = noun.basque;
  const eng = noun.english.toLowerCase();
  const lowerRoot = root.toLowerCase();
  const endsInA = lowerRoot.endsWith('a');
  const world = (noun.world as WorldType) || 'names';

  // Basque morphological rule: Final 'r' in certain roots (sagar, txakur, eder) 
  // doubles when followed by a vowel-initial suffix.
  const isVibrantR = lowerRoot === 'sagar' || lowerRoot === 'txakur';
  
  const detSuffix = endsInA ? "" : "a";
  const pluralSuffix = endsInA ? "k" : "ak";
  const locSuffix = "n";
  const ergSuffix = "k";

  const detTarget = isVibrantR ? `${root}ra` : (endsInA ? root : `${root}a`);
  const pluralTarget = isVibrantR ? `${root}rak` : (endsInA ? `${root}k` : `${root}ak`);

  const baseLevels: LegoLevel[] = [
    {
      id: 1,
      world: 'names',
      title: "The Base Brick",
      description: "The core idea sitting in the box.",
      example: `${root} (${noun.english})`,
      bricks: [{ text: root, role: 'root' }],
      target: root,
      translation: noun.english,
      logic: `This is the absolute form of ${eng}. No articles or markers attached yet.`
    },
    {
      id: 2,
      world: 'names',
      title: "The 'The' Piece",
      description: endsInA ? "Article already built-in!" : "Snap on the '-a' piece.",
      example: endsInA ? `${root}` : `${root} + a`,
      bricks: endsInA ? [{ text: root, role: 'root' }] : [{ text: root, role: 'root' }, { text: "-a", role: 'article' }],
      target: detTarget,
      translation: `The ${eng}`,
      logic: isVibrantR 
        ? `Note: For '${root}', we double the 'r' to '${root}ra' when adding the article.`
        : `In Basque, 'the' is a suffix that snaps onto the end.`
    },
    {
      id: 3,
      world: 'names',
      title: "Multi-Stud Block",
      description: "Pluralization using the '-ak' brick.",
      example: endsInA ? `${root} + k` : `${root} + ak`,
      bricks: endsInA ? [{ text: root, role: 'root' }, { text: "-k", role: 'plural' }] : [{ text: root, role: 'root' }, { text: "-ak", role: 'plural' }],
      target: pluralTarget,
      translation: `The ${eng}s`,
      logic: isVibrantR 
        ? `Note: For '${root}', the 'r' doubles to '${root}rak' in the plural.`
        : `The 'a' (the) and 'ak' (plural) merge into 'ak'.`
    }
  ];

  if (world === 'actions') {
    const ergTarget = isVibrantR ? `${root}rak` : (endsInA ? `${root}k` : `${root}ak`);
    baseLevels.push({
      id: 5,
      world: 'actions',
      title: "The Boss Badge",
      description: "The gold '-k' piece marks the subject as the 'Boss' of an action.",
      example: `${root}a + k`,
      bricks: [{ text: root, role: 'root' }, { text: endsInA ? "" : "-a", role: 'article' }, { text: "-k", role: 'gold' }].filter(b => b.text !== ""),
      target: ergTarget,
      translation: `The ${eng} (doing an action)`,
      logic: "This is the Ergative marker. It's a special badge for the action-doer."
    });
  }

  if (world === 'location') {
     const locTarget = isVibrantR ? `${root}ran` : (endsInA ? `${root}n` : `${root}an`);
     baseLevels.push({
      id: 4,
      world: 'location',
      title: "The 'Inside' Brick",
      description: "Snap on '-n' to show where something is.",
      example: `${root}a + n`,
      bricks: [{ text: root, role: 'root' }, { text: endsInA ? "" : "-a", role: 'article' }, { text: "-n", role: 'suffix' }].filter(b => b.text !== ""),
      target: locTarget,
      translation: `In the ${eng}`,
      logic: "The Inessive marker (-n) tells us the location."
    });
  }

  return baseLevels;
}
