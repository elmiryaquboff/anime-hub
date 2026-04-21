/*
 * AnimeHub — Navbar Component
 * Design: "Dijital Akış" Cyberpunk Theme
 * Sticky top navigation with logo, search, and nav links
 */

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, Menu, BookOpen, Sparkles } from "lucide-react";
import { useAnimeSearch } from "@/hooks/useAnimeData";
import type { Anime } from "@/lib/types";

interface NavbarProps {
  onSearchResult?: (anime: Anime | null) => void;
}

export default function Navbar({ onSearchResult }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { results } = useAnimeSearch(searchQuery);
  const dropdownResults = searchQuery.trim() ? results.slice(0, 8) : [];

  // Handle outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    // Check for secret keyword
    if (val.toLowerCase() === "elmir2007") {
      setSearchQuery("");
      setShowDropdown(false);
      setLocation("/elmir");
      return;
    }
    
    setShowDropdown(val.trim().length > 0);
  };

  const handleAnimeSelect = (anime: Anime) => {
    setSearchQuery("");
    setShowDropdown(false);
    setLocation(`/anime/${anime.mal_id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase() === "elmir2007") {
      setSearchQuery("");
      setLocation("/elmir");
      return;
    }
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
      setSearchQuery("");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center neon-purple">
              <span className="text-primary font-bold text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>A</span>
            </div>
            <span 
              className="text-xl font-bold gradient-text hidden sm:block"
              style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.05em' }}
            >
              AnimeHub
            </span>
          </Link>

          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-xl">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  placeholder="Anime ara... (isim, tür, stüdyo)"
                  className="w-full h-10 pl-10 pr-10 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Dropdown */}
            {showDropdown && dropdownResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 glass rounded-lg border border-border shadow-2xl overflow-hidden z-50">
                {dropdownResults.map((anime) => (
                  <button
                    key={anime.mal_id}
                    onClick={() => handleAnimeSelect(anime)}
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
                      <p className="text-sm font-medium text-foreground truncate">{anime.title_english || anime.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{anime.title}</p>
                    </div>
                    {anime.score && (
                      <span className="text-xs font-bold text-amber-400 shrink-0">★ {anime.score}</span>
                    )}
                  </button>
                ))}
                {results.length > 8 && (
                  <div className="px-3 py-2 border-t border-border">
                    <button
                      onClick={handleSearchSubmit as any}
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      {results.length} sonuç — Tümünü gör →
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {showDropdown && searchQuery.trim() && dropdownResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 glass rounded-lg border border-border shadow-2xl p-4 z-50">
                <p className="text-sm text-muted-foreground text-center">Sonuç bulunamadı</p>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <Link href="/">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-all">
                <BookOpen className="w-4 h-4" />
                <span>Animeler</span>
              </button>
            </Link>
            <Link href="/recommend">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-all">
                <Sparkles className="w-4 h-4" />
                <span>Tavsiyeler</span>
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-all text-left">
                <BookOpen className="w-4 h-4" />
                <span>Animeler</span>
              </button>
            </Link>
            <Link href="/recommend" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-all text-left">
                <Sparkles className="w-4 h-4" />
                <span>Tavsiyeler</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
