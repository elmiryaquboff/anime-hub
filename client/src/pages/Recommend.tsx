/*
 * AnimeHub — Recommendation Page
 * Design: "Dijital Akış" Cyberpunk Theme
 * Features: User inputs liked anime, gets personalized recommendations
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, X, Search, ChevronRight, Wand2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import { useAnimeRecommendations, useAnimeSearch } from "@/hooks/useAnimeData";

export default function Recommend() {
  const [inputValue, setInputValue] = useState("");
  const [likedAnime, setLikedAnime] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { results: searchResults } = useAnimeSearch(inputValue);
  const { recommendations, loading } = useAnimeRecommendations(submitted ? likedAnime : []);

  const dropdownResults = inputValue.trim() ? searchResults.slice(0, 6) : [];

  const addAnime = (title: string) => {
    if (title.trim() && !likedAnime.includes(title.trim())) {
      setLikedAnime(prev => [...prev, title.trim()]);
      setSubmitted(false);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeAnime = (title: string) => {
    setLikedAnime(prev => prev.filter(a => a !== title));
    setSubmitted(false);
  };

  const handleGetRecommendations = () => {
    if (likedAnime.length > 0) {
      setSubmitted(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      addAnime(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Hero */}
        <div 
          className="relative py-16 overflow-hidden"
          style={{
            backgroundImage: `url(/recommendation-bg.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-background/80" />
          <div className="relative container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Akıllı Tavsiye Sistemi</span>
              </div>
              <h1 
                className="text-4xl md:text-5xl font-black mb-4 gradient-text"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                Anime Tavsiyesi Al
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Sevdiğin animeleri ekle, sana özel tavsiyeler alalım. Tür ve tema analizine dayalı akıllı öneri sistemi.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container py-10">
          {/* Input Section */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                Sevdiğin Animeleri Ekle
              </h2>

              {/* Input */}
              <div className="relative mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(e.target.value.trim().length > 0);
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => inputValue.trim() && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Anime adı yaz... (örn: Naruto, Attack on Titan)"
                      className="w-full h-11 pl-10 pr-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && dropdownResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 glass rounded-lg border border-border shadow-2xl overflow-hidden z-50">
                        {dropdownResults.map((anime) => (
                          <button
                            key={anime.mal_id}
                            onMouseDown={() => addAnime(anime.title_english || anime.title)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/10 transition-colors text-left"
                          >
                            <img
                              src={anime.image_url}
                              alt={anime.title}
                              className="w-8 h-12 object-cover rounded shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/32x48/0D0D1A/7C3AED?text=?";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {anime.title_english || anime.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{anime.title}</p>
                            </div>
                            {anime.score && (
                              <span className="text-xs font-bold text-amber-400 shrink-0">★ {anime.score}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => inputValue.trim() && addAnime(inputValue)}
                    className="h-11 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Ekle
                  </button>
                </div>
              </div>

              {/* Added Anime Tags */}
              {likedAnime.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Eklenen animeler:</p>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {likedAnime.map(title => (
                        <motion.div
                          key={title}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm"
                        >
                          <span>{title}</span>
                          <button
                            onClick={() => removeAnime(title)}
                            className="hover:text-primary/60 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Quick Suggestions */}
              {likedAnime.length === 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Hızlı ekleme:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Attack on Titan", "Naruto", "One Piece", "Death Note", "Demon Slayer", "Fullmetal Alchemist"].map(title => (
                      <button
                        key={title}
                        onClick={() => addAnime(title)}
                        className="px-3 py-1 rounded-full text-xs border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                      >
                        + {title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Get Recommendations Button */}
              <button
                onClick={handleGetRecommendations}
                disabled={likedAnime.length === 0}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Tavsiye Al
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="rounded-xl bg-card border border-border overflow-hidden animate-pulse">
                        <div className="aspect-[2/3] bg-muted" />
                        <div className="p-3 space-y-2">
                          <div className="h-3 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Sana Özel Tavsiyeler
                        <span className="text-sm font-normal text-muted-foreground">
                          ({recommendations.length} anime)
                        </span>
                      </h2>
                    </div>
                    
                    {recommendations.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Tavsiye bulunamadı. Farklı animeler deneyin.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {recommendations.map((anime, i) => (
                          <motion.div
                            key={anime.mal_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <AnimeCard anime={anime} />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Tavsiyeler, sevdiğiniz animelerin tür ve tema analizine dayanmaktadır.
          </p>
        </div>
      </footer>
    </div>
  );
}
