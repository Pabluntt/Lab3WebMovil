'use client';

import { useEffect, useState } from 'react';
import GameCard from '@/components/GameCard';
import FiltersBar from '@/components/FiltersBar';
import { Game } from '@/store/gamesSlice';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) throw new Error('Error al cargar juegos');
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Mis Juegos</h1>
        
        <FiltersBar />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {games.length > 0 ? (
            games.map((game) => <GameCard key={game.id} game={game} viewMode="grid" />)
          ) : (
            <p className="text-slate-600 dark:text-slate-300 col-span-full text-center py-10">
              No hay juegos. ¡Añade uno!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
