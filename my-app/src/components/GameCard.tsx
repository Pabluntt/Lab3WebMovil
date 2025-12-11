'use client';

import { Game } from '@/store/gamesSlice';
import Image from 'next/image';
import Link from 'next/link';

interface GameCardProps {
  game: Game;
  viewMode: 'grid' | 'list';
}

export default function GameCard({ game, viewMode }: GameCardProps) {
  if (viewMode === 'list') {
    return (
      <Link href={`/games/${game.id}`}>
        <div className="group flex gap-4 overflow-hidden rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-xl dark:bg-gray-800">
          {/* Imagen */}
          <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
            {game.coverUrl ? (
              <Image
                src={game.coverUrl}
                alt={game.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="96px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                Sin imagen
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                {game.name}
              </h3>

              {/* Géneros */}
              {game.genres.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {game.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Plataformas */}
              {game.platforms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {game.platforms.slice(0, 3).map((platform) => (
                    <span
                      key={platform.id}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {platform.name}
                    </span>
                  ))}
                  {game.platforms.length > 3 && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      +{game.platforms.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between">
              {/* Rating */}
              {game.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {game.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Fecha */}
              {game.releaseDate && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(game.releaseDate).getFullYear()}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/games/${game.id}`}>
      <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl dark:bg-gray-800">
        {/* Imagen */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {game.coverUrl ? (
            <Image
              src={game.coverUrl}
              alt={game.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
            {game.name}
          </h3>

          {/* Rating */}
          {game.rating && (
            <div className="mb-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xl">⭐</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {game.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Géneros */}
          {game.genres.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {game.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Fecha de lanzamiento */}
          {game.releaseDate && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(game.releaseDate).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
