import React, { useState } from 'react';

export default function MangaPortfolio() {
  const [activeTab, setActiveTab] = useState('all');

  const works = [
    { id: 1, title: "Cyber Neon - 1-bob", category: "manga", desc: "Sci-Fi janridagi qisqa manga sahifalari" },
    { id: 2, title: "Qahramon eskizlari", category: "art", desc: "Asosiy personajlarning konsept-artlari" },
    { id: 3, title: "Dunyoni shakllantirish", category: "concept", desc: "Fon va muhit dizayni" },
  ];

  const filteredWorks = activeTab === 'all' 
    ? works 
    : works.filter(w => w.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto py-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-widest text-indigo-400">STUDIO // PORTFOLIO</h1>
        <nav className="flex space-x-6 text-sm">
          <button onClick={() => setActiveTab('all')} className={`hover:text-indigo-400 transition ${activeTab === 'all' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}>Barchasi</button>
          <button onClick={() => setActiveTab('manga')} className={`hover:text-indigo-400 transition ${activeTab === 'manga' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}>Manga</button>
          <button onClick={() => setActiveTab('art')} className={`hover:text-indigo-400 transition ${activeTab === 'art' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}>Artlar</button>
          <button onClick={() => setActiveTab('concept')} className={`hover:text-indigo-400 transition ${activeTab === 'concept' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}>Konsept</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center my-20 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-6 tracking-tight">Hikoyalar va Vizual Olamlar</h2>
        <p className="text-slate-400 text-lg leading-relaxed">Manga chizish, sahifalash, syujet yaratish va raqamli illustratsiyalar bo'yicha shaxsiy ijodiy ishlar to'plami.</p>
      </section>

      {/* Gallery Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {filteredWorks.map(work => (
          <div key={work.id} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition duration-300 group">
            <div className="h-64 bg-slate-800 flex items-center justify-center text-slate-600 group-hover:bg-slate-700/50 transition">
              <span className="text-sm font-medium">[ {work.title} Rasm ]</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">{work.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-100">{work.title}</h3>
              <p className="text-slate-400 text-sm">{work.desc}</p>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto text-center py-8 border-t border-slate-800 text-slate-500 text-sm">
        <p>© 2026 Manga Portfolio. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}
