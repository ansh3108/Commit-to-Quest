export const calculateLevel = (count: number) => {
  return Math.floor(Math.sqrt(count)) + 1;
};

export const getHeroClass = (quests: any[]) => {
  const types = quests.map(q => q.type);
  if (types.includes("PushEvent")) return "Berserker";
  if (types.includes("CreateEvent")) return "Architect";
  return "Adventurer";
};

export const calculateAttributes = (languages: Record<string, number>, stars: number) => {
  const str = (languages["Rust"] || 0) * 5 + (languages["C++"] || 0) * 5 + 10;
  const int = (languages["TypeScript"] || 0) * 3 + (languages["JavaScript"] || 0) * 2 + 10;
  const agi = (languages["CSS"] || 0) * 5 + (languages["HTML"] || 0) * 2 + 10;
  const lck = stars + 5;

  return { str, int, agi, lck };
};