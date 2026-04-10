"use client";

import { useState } from "react";
import { translateCommit, Quest } from "@/utils/questEngine";

export default function Home() {
  const [username, setUsername] = useState("");
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startQuest = async () => {
    if (!username) return;
    
    console.log("Starting adventure for:", username);
    setLoading(true);
    setError(null);
    setQuests([]);

    try {
      const res = await fetch(`/api/github?username=${username}`);
      const data = await res.json();

      console.log("Raw data from guild:", data);

      if (!res.ok) {
        throw new Error(data.error || "The gatekeeper denied entry");
      }

      if (Array.isArray(data) && data.length > 0) {
        const translated = data.map((c: any) => translateCommit(c.message, c.repo));
        console.log("Translated Quests:", translated);
        setQuests(translated);
      } else {
        console.log("No push events found in the scrolls.");
        setError("This traveler has no recent public exploits.");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Adventure failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto min-h-screen">
      <section className="nes-container with-title is-centered mb-10">
        <p className="title font-retro">Commit-to-Quest</p>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="nes-field">
            <input 
              type="text" 
              className="nes-input" 
              placeholder="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startQuest()}
            />
          </div>
          <button 
            type="button" 
            className="nes-btn is-primary"
            onClick={startQuest}
            disabled={loading}
          >
            {loading ? "..." : "Commence!"}
          </button>
        </div>
      </section>

      {error && (
        <div className="nes-container is-error mb-10">
          <p className="text-white font-retro text-xs">{error}</p>
        </div>
      )}

      <div className="grid gap-8">
        {quests.map((quest, i) => (
          <div key={i} className={`nes-container with-title ${quest.color}`}>
            <p className="title font-retro text-[10px]">{quest.type}</p>
            <p className="text-sm md:text-base">{quest.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}