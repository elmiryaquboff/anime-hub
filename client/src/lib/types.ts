/*
 * AnimeHub — Type Definitions
 * Design: "Dijital Akış" Cyberpunk Theme
 */

export interface AnimeAired {
  from: string;
  to: string;
  string: string;
}

export interface Anime {
  mal_id: number;
  title: string;
  title_english: string;
  title_japanese: string;
  synopsis: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  episodes: number | null;
  status: string;
  aired: AnimeAired;
  duration: string;
  rating: string;
  genres: string[];
  themes: string[];
  studios: string[];
  source: string;
  type: string;
  image_url: string;
  trailer_url: string;
  url: string;
  favorites: number | null;
  season: string;
  year: number | null;
  background: string;
  is_special?: boolean;
}

export interface Review {
  reviewer: string;
  score: number;
  text: string;
  helpful: number;
}

export type SortOption = "score" | "rank" | "popularity" | "members" | "year" | "title";
export type FilterGenre = string;
