/*
 * AnimeHub — useAnimeData Hook
 * Fetches anime data from the static JSON file (Jikan API data)
 * Design: "Dijital Akış" Cyberpunk Theme
 */

import { useState, useEffect, useMemo } from "react";
import type { Anime } from "@/lib/types";

const ANIME_DATA_URL = "/anime_data.json";

let cachedData: Anime[] | null = null;
let fetchPromise: Promise<Anime[]> | null = null;

async function fetchAnimeData(): Promise<Anime[]> {
  if (cachedData) return cachedData;
  if (fetchPromise) return fetchPromise;
  
  fetchPromise = fetch(ANIME_DATA_URL)
    .then(res => res.json())
    .then(data => {
      cachedData = data;
      return data as Anime[];
    });
  
  return fetchPromise;
}

export function useAnimeData() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimeData()
      .then(data => {
        setAnime(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { anime, loading, error };
}

export function useAnimeById(id: number) {
  const { anime, loading, error } = useAnimeData();
  
  const found = useMemo(() => {
    return anime.find(a => a.mal_id === id) || null;
  }, [anime, id]);
  
  return { anime: found, loading, error };
}

export function useAnimeSearch(query: string) {
  const { anime, loading, error } = useAnimeData();
  
  const results = useMemo(() => {
    if (!query.trim()) return anime;
    const q = query.toLowerCase().trim();
    return anime.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.title_english.toLowerCase().includes(q) ||
      a.title_japanese.toLowerCase().includes(q) ||
      a.genres.some(g => g.toLowerCase().includes(q)) ||
      a.studios.some(s => s.toLowerCase().includes(q))
    );
  }, [anime, query]);
  
  return { results, loading, error };
}

export function useSpecialAnime() {
  const { anime, loading, error } = useAnimeData();
  
  const specialAnime = useMemo(() => {
    return anime.filter(a => a.is_special);
  }, [anime]);
  
  return { specialAnime, loading, error };
}

export function useAnimeRecommendations(likedTitles: string[]) {
  const { anime, loading, error } = useAnimeData();
  
  const recommendations = useMemo(() => {
    if (!likedTitles.length || !anime.length) return [];
    
    // Find the liked anime in our database
    const likedAnime: Anime[] = [];
    for (const title of likedTitles) {
      const q = title.toLowerCase().trim();
      const found = anime.find(a => 
        a.title.toLowerCase().includes(q) ||
        a.title_english.toLowerCase().includes(q)
      );
      if (found) likedAnime.push(found);
    }
    
    if (!likedAnime.length) {
      // If no matches found, return top-rated anime
      return anime
        .filter(a => a.score && a.score >= 8.0)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 20);
    }
    
    // Collect genres and themes from liked anime
    const genreCount: Record<string, number> = {};
    const themeCount: Record<string, number> = {};
    const studioCount: Record<string, number> = {};
    const likedIds = new Set(likedAnime.map(a => a.mal_id));
    
    for (const a of likedAnime) {
      for (const g of a.genres) {
        genreCount[g] = (genreCount[g] || 0) + 2;
      }
      for (const t of a.themes) {
        themeCount[t] = (themeCount[t] || 0) + 1;
      }
      for (const s of a.studios) {
        studioCount[s] = (studioCount[s] || 0) + 1;
      }
    }
    
    // Score each anime
    const scored = anime
      .filter(a => !likedIds.has(a.mal_id))
      .map(a => {
        let score = 0;
        for (const g of a.genres) score += genreCount[g] || 0;
        for (const t of a.themes) score += themeCount[t] || 0;
        for (const s of a.studios) score += studioCount[s] || 0;
        // Boost by MAL score
        if (a.score) score += a.score * 0.5;
        return { anime: a, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);
    
    return scored.slice(0, 24).map(({ anime }) => anime);
  }, [anime, likedTitles]);
  
  return { recommendations, loading, error };
}
