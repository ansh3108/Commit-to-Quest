export const calculateLevel = (count: number) => {
  return Math.floor(Math.sqrt(count)) + 1;
};

export const getHeroClass = (quests: any[]) => {
  const types = quests.map(q => q.type);
  const mostCommon = types.sort((a, b) =>
    types.filter(v => v === a).length - types.filter(v => v === b).length
  ).pop();

  if (mostCommon === "Quest Completed") return "Paladin";
  if (mostCommon === "Item Found") return "Explorer";
  if (mostCommon === "World Event") return "Architect";
  if (mostCommon === "Lore Unlock") return "Scholar";
  
  return "Adventurer";
};