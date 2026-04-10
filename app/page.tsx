"use client";

import { useState } from "react";
import { translateCommit, Quest } from "@/utils/questEngine";
import { calculateLevel, getHeroClass } from "@/utils/stats";

export default function Home() {
  const [username, setUsername] = useState("");
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);

  const startQuest = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/github?username=${username}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuests(data.map((c: any) => translateCommit(c.message, c.repo)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crt min-h-screen bg-[#212529] text-white p-4 md:p-10 font-retro">
      <main className="max-w-6xl mx-auto">
        
        <header className="mb-12 text-center">
          <h1 className="text-2xl md:text-4xl mb-6 text-[#f7d51d] tracking-widest">COMMIT-TO-QUEST</h1>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <input 
              type="text" 
              className="nes-input is-dark !max-w-xs" 
              placeholder="GitHub User"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startQuest()}
            />
            <button className="nes-btn is-primary" onClick={startQuest}>
              {loading ? "..." : "Commence"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-1">
            <div className="nes-container with-title is-dark">
              <p className="title !text-[12px]">Hero Stats</p>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <i className="nes-sprites pixel-heart"></i>
                  <div>
                    <p className="text-blue-400 text-sm mb-1 uppercase">{username || "Traveler"}</p>
                    <p className="text-[10px] uppercase">Class: {getHeroClass(quests)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] mb-2 uppercase">Lvl {calculateLevel(quests.length)} Progress</p>
                  <progress className="nes-progress is-success" value={quests.length % 10} max="10"></progress>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span>EXP: {quests.length * 100}</span>
                  <span className="text-[#f7d51d]">HP: 100/100</span>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="nes-container with-title is-dark">
              <p className="title !text-[12px]">Quest Log</p>
              <div className="flex flex-col gap-8 max-h-[500px] overflow-y-auto p-4">
                {quests.length > 0 ? (
                  quests.map((quest, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="nes-balloon from-left is-dark !w-full">
                        <div className="flex flex-col">
                          <span className={`text-[10px] uppercase mb-1 ${
                            quest.color === 'is-error' ? 'text-red-500' :
                            quest.color === 'is-success' ? 'text-green-500' :
                            quest.color === 'is-warning' ? 'text-yellow-500' :
                            'text-blue-500'
                          }`}>
                            [{quest.type}]
                          </span>
                          <p className="text-white text-xs md:text-sm leading-relaxed">
                            {quest.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xs text-gray-400 animate-pulse uppercase">Waiting for the traveler's scrolls...</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}