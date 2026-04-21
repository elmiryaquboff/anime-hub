/*
 * AnimeHub — Elmir's Secret Page
 * Design: "Dijital Akış" Cyberpunk Theme — Special Golden Edition
 * Triggered by searching "Elmir2007"
 * Shows Elmir's personal anime recommendations
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Star, ArrowLeft, Crown, Sparkles, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAnimeData } from "@/hooks/useAnimeData";
import type { Anime } from "@/lib/types";

// Elmir's special anime list with correct MAL IDs
const ELMIR_MAL_IDS = [
  38659,  // Shinchou Yuusha: Kono Yuusha ga Ore Tueee Kuse ni Shinchou Sugiru
  35507,  // Classroom of the Elite (Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e)
  37430,  // That Time I Got Reincarnated as a Slime
  9919,   // Blue Exorcist (Ao no Exorcist)
  52991,  // Frieren: Beyond Journey's End (Sousou no Frieren)
  29803,  // Overlord
  48316,  // The Eminence in Shadow (Kage no Jitsuryokusha ni Naritakute!)
  40496,  // The Misfit of Demon King Academy
  37150,  // Douluo Dalu (Soul Land)
  31240,  // Re:Zero
  44511,  // Chainsaw Man
  50265,  // Spy x Family
  30276,  // One Punch Man
  53865,  // Yozakura-san Chi no Daisakusen
  17895,  // Golden Time
  4224,   // Toradora!
  50346,  // Yofukashi no Uta (Call of the Night)
];

// Display names for Elmir's list (English/common names)
const DISPLAY_NAMES: Record<number, string> = {
  38659: "Cautious Hero",
  35507: "Classroom of the Elite",
  37430: "That Time I Got Reincarnated as a Slime",
  9919: "Blue Exorcist",
  52991: "Frieren: Beyond Journey's End",
  29803: "Overlord",
  48316: "The Eminence in Shadow",
  40496: "The Misfit of Demon King Academy",
  37150: "Soul Land (Douluo Dalu)",
  31240: "Re:Zero",
  44511: "Chainsaw Man",
  50265: "Spy x Family",
  30276: "One Punch Man",
  53865: "Yozakura Family",
  17895: "Golden Time",
  4224: "Toradora!",
  50346: "Call of the Night",
};

interface AnimeCardElmirProps {
  anime: Anime;
  index: number;
}

function AnimeCardElmir({ anime, index }: AnimeCardElmirProps) {
  const [showDetail, setShowDetail] = useState(false);
  const displayName = DISPLAY_NAMES[anime.mal_id] || anime.title_english || anime.title;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
        onClick={() => setShowDetail(true)}
        className="cursor-pointer group"
      >
        <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/20 hover:border-amber-500/60 transition-all duration-300 bg-card"
          style={{
            boxShadow: "0 0 0 0 rgba(245, 158, 11, 0)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 20px rgba(245, 158, 11, 0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 0 rgba(245, 158, 11, 0)";
          }}
        >
          {/* Cover Image */}
          <div className="aspect-[2/3] overflow-hidden">
            <img
              src={anime.image_url}
              alt={displayName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/225x320/0D0D1A/F59E0B?text=?";
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Score */}
            {anime.score && (
              <div className="absolute top-2 right-2 bg-amber-500/90 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs font-bold text-black flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {anime.score.toFixed(1)}
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-xs text-white/80 text-center">Detayları gör →</p>
            </div>
          </div>

          {/* Title */}
          <div className="p-3 text-center">
            <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
              {displayName}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetail(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-card rounded-2xl border border-amber-500/30 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
              style={{ boxShadow: "0 0 40px rgba(245, 158, 11, 0.2)" }}
            >
              <div className="flex gap-4 p-5">
                <img
                  src={anime.image_url}
                  alt={displayName}
                  className="w-28 h-40 object-cover rounded-lg shrink-0 border border-amber-500/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/112x160/0D0D1A/F59E0B?text=?";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground mb-1">{displayName}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{anime.title}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {anime.score && (
                      <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {anime.score.toFixed(1)}
                      </span>
                    )}
                    {anime.year && (
                      <span className="px-2 py-1 rounded bg-card border border-border text-muted-foreground text-xs">
                        {anime.year}
                      </span>
                    )}
                    {anime.episodes && (
                      <span className="px-2 py-1 rounded bg-card border border-border text-muted-foreground text-xs">
                        {anime.episodes} bölüm
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {anime.genres.slice(0, 4).map(g => (
                      <span key={g} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {anime.synopsis && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{anime.synopsis}</p>
                </div>
              )}
              
              <div className="px-5 pb-5 flex gap-2">
                <Link href={`/anime/${anime.mal_id}`} onClick={() => setShowDetail(false)}>
                  <button className="flex-1 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
                    Detaylı Bilgi
                  </button>
                </Link>
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground text-sm hover:text-foreground transition-all"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ElmirPage() {
  const { anime: allAnime, loading } = useAnimeData();
  const [revealed, setRevealed] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; delay: number}>>([]);

  const elmirAnime = allAnime.filter(a => ELMIR_MAL_IDS.includes(a.mal_id));
  
  // Sort by ELMIR_MAL_IDS order
  const sortedElmirAnime = ELMIR_MAL_IDS
    .map(id => elmirAnime.find(a => a.mal_id === id))
    .filter(Boolean) as Anime[];

  useEffect(() => {
    // Generate particles
    const ps = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(ps);

    // Auto-reveal after animation
    const timer = setTimeout(() => setRevealed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      <div className="pt-16">
        {/* Hero Section */}
        <div
          className="relative py-20 overflow-hidden"
          style={{
            backgroundImage: `url(/elmir-bg.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-background/60" />
          
          {/* Floating Particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute w-1 h-1 rounded-full bg-amber-400/60"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + p.delay,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}

          <div className="relative container text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">Gizli Sayfa Açıldı</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Crown className="w-10 h-10 text-amber-400" />
                <h1
                  className="text-5xl md:text-6xl font-black"
                  style={{
                    fontFamily: 'Orbitron, monospace',
                    background: 'linear-gradient(135deg, #F59E0B, #FCD34D, #F59E0B)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Elmir
                </h1>
                <Crown className="w-10 h-10 text-amber-400" />
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-amber-300 mb-4"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                'nin Tavsiyeleri
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Özenle seçilmiş {ELMIR_MAL_IDS.length} anime — izlemeye değer en iyi yapımlar
              </p>
            </motion.div>
          </div>
        </div>

        {/* Anime Grid */}
        <div className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Ana Sayfaya Dön</span>
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">{sortedElmirAnime.length} Anime</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 17 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-card border border-border overflow-hidden animate-pulse">
                  <div className="aspect-[2/3] bg-muted" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedElmirAnime.map((anime, index) => (
                <AnimeCardElmir key={anime.mal_id} anime={anime} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-amber-500/20 mt-8 py-8">
        <div className="container text-center">
          <p className="text-sm text-amber-400/60">
            ✨ Elmir'in özel anime listesi ✨
          </p>
        </div>
      </footer>
    </div>
  );
}
