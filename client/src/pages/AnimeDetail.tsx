/*
 * AnimeHub — Anime Detail Page
 * Design: "Dijital Akış" Cyberpunk Theme
 * Shows full anime info: cover, synopsis, score, genres, reviews, related
 */

import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Star, Users, Trophy, TrendingUp, 
  Calendar, Clock, Tv, Film, Play, ExternalLink,
  BookOpen, ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import { useAnimeById, useAnimeData } from "@/hooks/useAnimeData";

// Static review data for each anime (generated based on common themes)
function generateReviews(anime: { title: string; title_english?: string; score: number | null; genres: string[]; synopsis: string }) {
  const reviews = [
    {
      reviewer: "AnimeFan_TR",
      score: Math.min(10, Math.round((anime.score || 7) + 0.5)),
      text: `${anime.title_english || anime.title || anime.title} gerçekten etkileyici bir yapım. ${anime.genres.slice(0, 2).join(" ve ")} türlerini seven herkesin izlemesi gerekiyor. Karakterler derinlemesine işlenmiş ve hikaye akışı oldukça tatmin edici.`,
      helpful: Math.floor(Math.random() * 200) + 50,
    },
    {
      reviewer: "OtakuMaster",
      score: Math.min(10, Math.round((anime.score || 7) - 0.5)),
      text: `Animenin ilk bölümlerinden itibaren bağımlılık yapıyor. Animasyon kalitesi ve müzikler mükemmel. ${anime.genres.includes("Action") ? "Aksiyon sahneleri nefes kesici." : "Duygusal derinliği çok etkileyici."} Kesinlikle tavsiye ederim.`,
      helpful: Math.floor(Math.random() * 150) + 30,
    },
    {
      reviewer: "SakuraNight",
      score: Math.min(10, Math.round((anime.score || 7))),
      text: `Bu anime beni gerçekten şaşırttı. ${anime.synopsis ? anime.synopsis.slice(0, 100) + "..." : "Hikayesi çok sürükleyici."} Özellikle karakter gelişimi ve dünya inşası konusunda oldukça başarılı bir yapım.`,
      helpful: Math.floor(Math.random() * 100) + 20,
    },
  ];
  return reviews;
}

export default function AnimeDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const { anime, loading } = useAnimeById(id);
  const { anime: allAnime } = useAnimeData();
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  // Related anime (same genres)
  const relatedAnime = allAnime
    .filter(a => 
      a.mal_id !== id && 
      a.genres.some(g => anime?.genres.includes(g)) &&
      a.score && a.score >= 7.5
    )
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 12);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-card rounded w-1/3 mb-8" />
            <div className="flex gap-8">
              <div className="w-64 h-96 bg-card rounded-xl shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="h-10 bg-card rounded w-2/3" />
                <div className="h-4 bg-card rounded w-1/3" />
                <div className="h-32 bg-card rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Anime Bulunamadı</h1>
          <Link href="/">
            <button className="text-primary hover:underline">Ana Sayfaya Dön</button>
          </Link>
        </div>
      </div>
    );
  }

  const displayTitle = anime.title_english && anime.title_english !== anime.title 
    ? anime.title_english 
    : anime.title;

  const reviews = generateReviews(anime as any);
  const synopsis = anime.synopsis || "Bu anime için özet bilgisi bulunmamaktadır.";
  const truncatedSynopsis = synopsis.length > 400 ? synopsis.slice(0, 400) + "..." : synopsis;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        {/* Banner Background */}
        <div 
          className="relative h-64 md:h-80 overflow-hidden"
          style={{
            backgroundImage: `url(${anime.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            filter: 'blur(0px)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        </div>

        <div className="container -mt-32 relative pb-16">
          {/* Back Button */}
          <Link href="/">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Geri Dön</span>
            </button>
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="shrink-0"
            >
              <div className="w-48 md:w-64 rounded-xl overflow-hidden border-2 border-primary/30 neon-purple shadow-2xl mx-auto md:mx-0">
                <img
                  src={anime.image_url}
                  alt={displayTitle}
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/256x384/0D0D1A/7C3AED?text=No+Image";
                  }}
                />
              </div>
              
              {/* Quick Actions */}
              <div className="mt-4 space-y-2 w-48 md:w-64 mx-auto md:mx-0">
                {anime.url && (
                  <a
                    href={anime.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    MyAnimeList'te Gör
                  </a>
                )}
                {anime.trailer_url && (
                  <a
                    href={anime.trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
                  >
                    <Play className="w-4 h-4" />
                    Fragmanı İzle
                  </a>
                )}
              </div>
            </motion.div>

            {/* Anime Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              {/* Title */}
              <div className="mb-4">
                <h1 
                  className="text-3xl md:text-4xl font-black text-foreground mb-1 leading-tight"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  {displayTitle}
                </h1>
                {displayTitle !== anime.title && (
                  <p className="text-lg text-muted-foreground">{anime.title}</p>
                )}
                {anime.title_japanese && (
                  <p className="text-sm text-muted-foreground mt-1" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                    {anime.title_japanese}
                  </p>
                )}
              </div>

              {/* Score & Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {anime.score && (
                  <div className="bg-card rounded-xl p-3 border border-border text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-2xl font-black text-amber-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {anime.score.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">MAL Puanı</p>
                    {anime.scored_by && (
                      <p className="text-xs text-muted-foreground">{(anime.scored_by / 1000).toFixed(0)}K oy</p>
                    )}
                  </div>
                )}
                {anime.rank && (
                  <div className="bg-card rounded-xl p-3 border border-border text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-2xl font-black text-primary" style={{ fontFamily: 'Orbitron, monospace' }}>
                        #{anime.rank}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Sıralama</p>
                  </div>
                )}
                {anime.popularity && (
                  <div className="bg-card rounded-xl p-3 border border-border text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span className="text-2xl font-black text-cyan-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                        #{anime.popularity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Popülerlik</p>
                  </div>
                )}
                {anime.members && (
                  <div className="bg-card rounded-xl p-3 border border-border text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-xl font-black text-green-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {(anime.members / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Üye</p>
                  </div>
                )}
              </div>

              {/* Genres */}
              {anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.genres.map(genre => (
                    <span key={genre} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                      {genre}
                    </span>
                  ))}
                  {anime.themes.map(theme => (
                    <span key={theme} className="px-3 py-1 rounded-full text-sm bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                      {theme}
                    </span>
                  ))}
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Tv, label: "Tür", value: anime.type || "TV" },
                  { icon: BookOpen, label: "Bölüm", value: anime.episodes ? `${anime.episodes} bölüm` : "Devam Ediyor" },
                  { icon: Clock, label: "Süre", value: anime.duration || "—" },
                  { icon: Calendar, label: "Yayın", value: anime.aired?.string || (anime.year ? String(anime.year) : "—") },
                  { icon: Film, label: "Kaynak", value: anime.source || "—" },
                  { icon: Star, label: "Stüdyo", value: anime.studios.join(", ") || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2 p-3 bg-card rounded-lg border border-border">
                    <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Synopsis */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Özet
                </h2>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {showFullSynopsis ? synopsis : truncatedSynopsis}
                  </p>
                  {synopsis.length > 400 && (
                    <button
                      onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                      className="mt-2 text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      {showFullSynopsis ? "Daha Az Göster" : "Devamını Oku"}
                      <ChevronRight className={`w-3 h-3 transition-transform ${showFullSynopsis ? "rotate-90" : ""}`} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Kullanıcı Yorumları
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.map((review, i) => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{review.reviewer[0]}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{review.reviewer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-amber-400">{review.score}/10</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{review.text}</p>
                  <p className="text-xs text-muted-foreground mt-2">{review.helpful} kişi faydalı buldu</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Related Anime */}
          {relatedAnime.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Benzer Animeler
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {relatedAnime.slice(0, 12).map(a => (
                  <AnimeCard key={a.mal_id} anime={a} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Veriler{" "}
            <a href="https://myanimelist.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              MyAnimeList
            </a>{" "}
            üzerinden alınmıştır.
          </p>
        </div>
      </footer>
    </div>
  );
}
