'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Game } from '@/store/gamesSlice';

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.id as string;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) throw new Error('Juego no encontrado');
        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg">Cargando juego...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <p className="text-red-500 text-lg font-semibold mb-4">❌ {error || 'Juego no encontrado'}</p>
            <Link href="/games" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline">
              ← Volver al listado
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Botón de regreso */}
        <Link
          href="/games"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6 font-semibold"
        >
          ← Volver al listado
        </Link>

        {/* Contenedor principal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{game.name}</h1>
          </div>

          {/* Contenido */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Portada del juego */}
              <div className="md:col-span-1">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 shadow-lg">
                  {game.coverUrl ? (
                    <Image
                      src={game.coverUrl}
                      alt={game.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <span className="text-center">Sin portada disponible</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del juego */}
              <div className="md:col-span-2 space-y-6">
                {/* Rating y Fecha de lanzamiento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Rating */}
                  {game.rating && (
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Calificación</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">
                          {game.rating.toFixed(1)} <span className="text-lg text-gray-500 dark:text-gray-400">sobre 100</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fecha de lanzamiento */}
                  {game.releaseDate && (
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Fecha de Lanzamiento</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {new Date(game.releaseDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Géneros */}
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3">Géneros</p>
                  <div className="flex flex-wrap gap-2">
                    {game.genres.length > 0 ? (
                      game.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium text-sm"
                        >
                          {genre.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Sin géneros</p>
                    )}
                  </div>
                </div>

                {/* Plataformas */}
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3">Plataformas</p>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.length > 0 ? (
                      game.platforms.map((platform) => (
                        <span
                          key={platform.id}
                          className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium text-sm"
                        >
                          {platform.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Sin plataformas</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas adicionales */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Estadísticas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Géneros</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{game.genres.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Plataformas</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{game.platforms.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Año de Lanzamiento</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'N/A'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Rating</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {game.rating ? game.rating.toFixed(0) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de acción */}
            <div className="mt-8 flex gap-4">
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Ir al Dashboard
              </Link>
              <Link
                href="/games"
                className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                Ver más juegos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
