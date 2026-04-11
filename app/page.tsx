"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { translateCommit, Quest } from "@/utils/questEngine";
import { calculateLevel, getHeroClass, calculateAttributes } from "@/utils/stats";
import { generateLoot, Item } from "@/utils/lootEngine";

export default function Home() {
  const [username, setUsername] = useState("");
  const [quests, setQuests] = useState<Quest[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [attributes, setAttributes] = useState({ str: 10, int: 10, agi: 10, lck: 10 });
  const [loading, setLoading] = useState(false);

  const startQuest = async () => {
    if (!username) return;
    setLoading(true);
    setSelectedItem(null);
    try {
      const res = await fetch(`/api/github?username=${username}`);
      const data = await res.json();
      if (data.quests) {
        setQuests(data.quests.map((q: any) => translateCommit(q.message, q.repo)));
        setItems(generateLoot(data.repos));
        setAttributes(calculateAttributes(data.stats.languages, data.stats.totalStars));
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
          <h1 className="text-2xl md:text-4xl mb-6 text-[#f7d51d] tracking-tighter">COMMIT-TO-QUEST</h1>
          <div className="flex justify-center gap-2">
            <input 
              type="text" 
              className="nes-input is-dark !max-w-xs" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startQuest()}
            />
            <button className="nes-btn is-primary" onClick={startQuest}>
              {loading ? "..." : "Commence"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="flex flex-col gap-6">
            <div className="nes-container with-title is-dark">
              <p className="title !text-[10px]">Attributes</p>
              <div className="text-[10px] space-y-2">
                <p className="text-blue-400">LVL {calculateLevel(quests.length)} {getHeroClass(quests)}</p>
                <div className="grid grid-cols-2 gap-2">
                  <p>STR: {attributes.str}</p>
                  <p>INT: {attributes.int}</p>
                  <p>AGI: {attributes.agi}</p>
                  <p>LCK: {attributes.lck}</p>
                </div>
              </div>
            </div>

            <div className="nes-container with-title is-dark">
              <p className="title !text-[10px]">Inventory</p>
              <div className="flex flex-wrap gap-4 min-h-[40px]">
                {items.map((item, i) => (
                  <motion.i 
                    key={i} 
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`${item.icon} cursor-pointer ${
                      item.rarity === 'Legendary' ? 'animate-pulse text-yellow-400' : ''
                    }`}
                    onClick={() => setSelectedItem(item)}
                  ></motion.i>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {selectedItem && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="nes-container is-dark is-rounded"
                >
                  <p className="text-[#f7d51d] text-[10px] mb-2">{selectedItem.name.toUpperCase()}</p>
                  <p className="text-[8px] leading-relaxed mb-2 text-gray-300">{selectedItem.description}</p>
                  <hr className="border-gray-700 mb-2" />
                  <p className="text-[8px] text-green-400">{selectedItem.statBoost}</p>
                  <p className="text-[7px] text-gray-500 mt-1 italic">{selectedItem.requirement}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          <section className="lg:col-span-2">
            <div className="nes-container with-title is-dark">
              <p className="title !text-[10px]">Quest Log</p>
              <div className="flex flex-col gap-6 max-h-[550px] overflow-y-auto p-2">
                {quests.map((quest, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="nes-balloon from-left is-dark !w-full"
                  >
                    <span className={`text-[10px] ${
                      quest.color === 'is-error' ? 'text-red-500' :
                      quest.color === 'is-success' ? 'text-green-500' : 'text-blue-500'
                    }`}>
                      [{quest.type}]
                    </span>
                    <p className="text-xs mt-1">{quest.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}