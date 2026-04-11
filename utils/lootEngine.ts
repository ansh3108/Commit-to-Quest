export interface Item {
  name: string;
  icon: string;
  rarity: "Common" | "Rare" | "Legendary";
  description: string;
  requirement: string;
  statBoost: string;
}

export const generateLoot = (repos: any[]): Item[] => {
  const inventory: Item[] = [];

  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  if (totalStars > 0) {
    inventory.push({ 
      name: "Bounty Hunter's Pouch", 
      icon: "nes-icon coin", 
      rarity: "Common",
      description: "A small bag of gold earned from the admiration of others.",
      requirement: `Unlocked by: ${totalStars} Total Stars`,
      statBoost: "+2 Luck"
    });
  }

  const hasSolana = repos.some(r => 
    r.name.toLowerCase().includes('solana') || 
    r.description?.toLowerCase().includes('web3') ||
    r.description?.toLowerCase().includes('blockchain')
  );
  if (hasSolana) {
    inventory.push({ 
      name: "Ledger of the Chain", 
      icon: "nes-icon trophy", 
      rarity: "Legendary",
      description: "An ancient book containing the secrets of decentralized realms.",
      requirement: "Unlocked by: Web3/Solana Development",
      statBoost: "+10 Intelligence"
    });
  }

  const hasDocs = repos.some(r => r.has_pages || r.name.toLowerCase().includes('docs'));
  if (hasDocs) {
    inventory.push({
      name: "Ancient Scroll of Truth",
      icon: "nes-icon message",
      rarity: "Rare",
      description: "A scroll that explains the inner workings of the universe so others don't get lost.",
      requirement: "Unlocked by: Documentation/GitHub Pages",
      statBoost: "+5 Intelligence"
    });
  }

  const uniqueLanguages = new Set(repos.map(r => r.language).filter(Boolean)).size;
  if (uniqueLanguages >= 5) {
    inventory.push({
      name: "Prism of Tongues",
      icon: "nes-icon crystal",
      rarity: "Legendary",
      description: "A shimmering crystal that allows the holder to speak in many syntaxes.",
      requirement: `Unlocked by: ${uniqueLanguages} Different Languages`,
      statBoost: "+8 Versatility"
    });
  }

  const hasOldRepo = repos.some(r => {
    const createdDate = new Date(r.created_at);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    return createdDate < twoYearsAgo;
  });
  if (hasOldRepo) {
    inventory.push({
      name: "Weathered Shield",
      icon: "nes-icon shield",
      rarity: "Rare",
      description: "A shield scarred by years of production deployments and merge conflicts.",
      requirement: "Unlocked by: Maintaining Repos for 2+ Years",
      statBoost: "+10 Defense"
    });
  }

  const hasIssues = repos.some(r => r.open_issues_count > 10);
  if (hasIssues) {
    inventory.push({
      name: "Slayer's Gauntlet",
      icon: "nes-icon sword",
      rarity: "Common",
      description: "Worn by those who stand at the front lines of the Issue Tracker.",
      requirement: "Unlocked by: Managing high-issue repositories",
      statBoost: "+3 Strength"
    });
  }

  return inventory;
};