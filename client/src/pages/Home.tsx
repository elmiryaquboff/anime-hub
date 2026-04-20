/*
 * AnimeHub — Home Page
 * Design: "Dijital Akış" Cyberpunk Theme
 * Features: Hero section, anime grid with search/filter, featured anime
 * Colors: #050510 bg, #7C3AED primary, #06B6D4 cyan, #F59E0B amber
 */

import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, Star, TrendingUp, Award, X, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import { useAnimeData } from "@/hooks/useAnimeData";
import type { Anime, SortOption } from "@/lib/types";

const ITEMS_PER_PAGE = 40;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "score", label: "Puana Göre" },
  { value: "rank", label: "Sıralamaya Göre" },
  { value: "popularity", label: "Popülerliğe Göre" },
  { value: "members", label: "Üye Sayısına Göre" },
  { value: "year", label: "Yıla Göre" },
  { value: "title", label: "İsme Göre" },
];

export default function Home() {
  const [location] = useLocation();
  const { anime, loading } = useAnimeData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "top" | "popular">("all");

  // Parse search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const q = params.get("search");
    if (q) setSearchQuery(q);
  }, [location]);

  // Get all unique genres
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    anime.forEach(a => a.genres.forEach(g => genres.add(g)));
    return Array.from(genres).sort();
  }, [anime]);

  // Filter and sort anime
  const filteredAnime = useMemo(() => {
    let result = [...anime];
    
    // Tab filter
    if (activeTab === "top") {
      result = result.filter(a => a.score && a.score >= 8.0);
    } else if (activeTab === "popular") {
      result = result.sort((a, b) => (a.popularity || 9999) - (b.popularity || 9999));
      result = result.slice(0, 100);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.title_english.toLowerCase().includes(q) ||
        a.title_japanese.toLowerCase().includes(q) ||
        a.genres.some(g => g.toLowerCase().includes(q)) ||
        a.studios.some(s => s.toLowerCase().includes(q)) ||
        (a.synopsis && a.synopsis.toLowerCase().includes(q))
      );
    }
    
    // Genre filter
    if (selectedGenres.length > 0) {
      result = result.filter(a =>
        selectedGenres.every(g => a.genres.includes(g))
      );
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return (b.score || 0) - (a.score || 0);
        case "rank":
          return (a.rank || 9999) - (b.rank || 9999);
        case "popularity":
          return (a.popularity || 9999) - (b.popularity || 9999);
        case "members":
          return (b.members || 0) - (a.members || 0);
        case "year":
          return (b.year || 0) - (a.year || 0);
        case "title":
          return (a.title_english || a.title).localeCompare(b.title_english || b.title);
        default:
          return 0;
      }
    });
    
    return result;
  }, [anime, searchQuery, selectedGenres, sortBy, activeTab]);

  const paginatedAnime = filteredAnime.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginatedAnime.length < filteredAnime.length;

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    setPage(1);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  // Featured anime (top 5 by score)
  const featuredAnime = useMemo(() => {
    return anime
      .filter(a => a.score && a.score >= 9.0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 5);
  }, [anime]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative pt-16 pb-16 overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663396542934/KXsm9ghLm6LDbD6vj8cypu/hero-bg-XHYiES9xLvWjvuFGBysYCD.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative container py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                {anime.length}+ Anime
              </span>
              <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-3 py-1">
                MyAnimeList Verileri
              </span>
            </div>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <span className="gradient-text">Anime</span>
              <br />
              <span className="text-foreground">Evreni</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Yüzlerce anime hakkında detaylı bilgi, MAL puanları, özetler ve kişiselleştirilmiş tavsiyeler. Favori animeni bul.
            </p>
            
            {/* Hero Search */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Anime ara... (örn: Attack on Titan, Action, MAPPA)"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card/80 backdrop-blur border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-base"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-border bg-card/50">
        <div className="container py-3">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 shrink-0">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{anime.filter(a => a.score && a.score >= 8.0).length}</span> Yüksek Puanlı
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{allGenres.length}</span> Farklı Tür
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                En Yüksek: <span className="text-foreground font-semibold">{anime[0]?.score?.toFixed(1) || "—"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Tabs + Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-border">
            {[
              { key: "all", label: "Tümü" },
              { key: "top", label: "En İyi (8.0+)" },
              { key: "popular", label: "Popüler" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key as any); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1); }}
                className="h-9 pl-3 pr-8 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary/60 appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-all ${
                showFilters || selectedGenres.length > 0
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtrele</span>
              {selectedGenres.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {selectedGenres.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Genre Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Türe Göre Filtrele</h3>
                  {selectedGenres.length > 0 && (
                    <button
                      onClick={() => setSelectedGenres([])}
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Temizle
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">"{searchQuery}"</span> için{" "}
              <span className="text-primary font-semibold">{filteredAnime.length}</span> sonuç
            </p>
            <button
              onClick={() => { setSearchQuery(""); setPage(1); }}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Aramayı Temizle
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-card border border-border overflow-hidden animate-pulse">
                <div className="aspect-[2/3] bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Anime Grid */}
        {!loading && (
          <>
            {filteredAnime.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Sonuç Bulunamadı</h3>
                <p className="text-muted-foreground">Farklı bir arama terimi veya filtre deneyin.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              >
                {paginatedAnime.map((anime, index) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
                  >
                    <AnimeCard anime={anime} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-8 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary font-medium hover:bg-primary/20 transition-all"
                >
                  Daha Fazla Yükle ({filteredAnime.length - paginatedAnime.length} kaldı)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Veriler{" "}
            <a href="https://myanimelist.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              MyAnimeList
            </a>{" "}
            ve{" "}
            <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Jikan API
            </a>{" "}
            üzerinden alınmıştır.
          </p>
        </div>
      </footer>
    </div>
  );
}
