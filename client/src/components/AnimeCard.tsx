/*
 * AnimeHub — AnimeCard Component
 * Design: "Dijital Akış" Cyberpunk Theme
 * Displays anime cover, title, score, genres
 */

import { Link } from "wouter";
import { Star, Tv, Film } from "lucide-react";
import type { Anime } from "@/lib/types";

interface AnimeCardProps {
  anime: Anime;
  showDetail?: boolean;
}

export default function AnimeCard({ anime, showDetail = false }: AnimeCardProps) {
  const displayTitle = anime.title_english && anime.title_english !== anime.title 
    ? anime.title_english 
    : anime.title;

  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <div className="anime-card group relative rounded-xl overflow-hidden bg-card border border-border cursor-pointer h-full">
        {/* Cover Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={anime.image_url}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/225x320/0D0D1A/7C3AED?text=No+Image";
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Score Badge */}
          {anime.score && (
            <div className="absolute top-2 right-2 score-badge rounded-md px-2 py-0.5 text-xs flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              <span>{anime.score.toFixed(1)}</span>
            </div>
          )}
          
          {/* Type badge */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 text-xs text-muted-foreground flex items-center gap-1">
            {anime.type === "Movie" ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
            <span>{anime.type || "TV"}</span>
          </div>

          {/* Hover overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {anime.genres.slice(0, 3).map(genre => (
                  <span key={genre} className="text-xs bg-primary/20 text-primary border border-primary/30 rounded px-1.5 py-0.5">
                    {genre}
                  </span>
                ))}
              </div>
            )}
            {anime.episodes && (
              <p className="text-xs text-muted-foreground">{anime.episodes} bölüm</p>
            )}
          </div>
        </div>

        {/* Card Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
            {displayTitle}
          </h3>
          {displayTitle !== anime.title && (
            <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{anime.title}</p>
          )}
          <div className="flex items-center justify-between mt-1">
            {anime.year && (
              <span className="text-xs text-muted-foreground">{anime.year}</span>
            )}
            {anime.rank && (
              <span className="text-xs text-muted-foreground">#{anime.rank}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
