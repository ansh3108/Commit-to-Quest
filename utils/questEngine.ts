export interface Quest {
  text: string;
  type: string;
  color: string;
  repo: string;
}

export const translateCommit = (message: string, repoName: string): Quest => {
  const msg = message.toLowerCase();
  const repo = repoName.split('/')[1] || repoName;
  
  if (msg.includes('fix') || msg.includes('bug') || msg.includes('patch')) {
    return { 
      text: `Slayed the ${repo} Beast`, 
      type: "Quest Completed", 
      color: "is-error",
      repo: repo
    };
  }
  
  if (msg.includes('feat') || msg.includes('add') || msg.includes('new')) {
    return { 
      text: `Discovered the ${repo} Artifact`, 
      type: "Item Found", 
      color: "is-success",
      repo: repo
    };
  }
  
  if (msg.includes('refactor') || msg.includes('clean') || msg.includes('perf')) {
    return { 
      text: `Purified the ${repo} Ruins`, 
      type: "World Event", 
      color: "is-warning",
      repo: repo
    };
  }
  
  if (msg.includes('docs') || msg.includes('readme')) {
    return { 
      text: `Deciphered the ${repo} Scrolls`, 
      type: "Lore Unlock", 
      color: "is-primary",
      repo: repo
    };
  }

  return { 
    text: `Explored the land of ${repo}`, 
    type: "Discovery", 
    color: "is-dark",
    repo: repo
  };
};