'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, resetFilters } from '@/store/gamesSlice';
import { useEffect, useState } from 'react';

export default function FiltersBar() {
  const dispatch = useAppDispatch();
  const { games, filters } = useAppSelector((state) => state.games);

  // Extraer géneros y plataformas únicos
  const genres = Array.from(
    new Set(games.flatMap((game) => game.genres.map((g) => g.name)))
  ).sort();

  const platforms = Array.from(
    new Set(games.flatMap((game) => game.platforms.map((p) => p.name)))
  ).sort();

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Búsqueda */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Buscar
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
            placeholder="Nombre del juego..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Género */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Género
          </label>
          <select
            value={filters.genre}
            onChange={(e) => dispatch(setFilters({ genre: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los géneros</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Plataforma */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Plataforma
          </label>
          <select
            value={filters.platform}
            onChange={(e) => dispatch(setFilters({ platform: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas las plataformas</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Mínimo */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rating Mínimo: {filters.minRating}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minRating}
            onChange={(e) => dispatch(setFilters({ minRating: Number(e.target.value) }))}
            className="w-full"
          />
        </div>

        {/* Ordenar */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ordenar por
          </label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                dispatch(setFilters({ sortBy: e.target.value as any }))
              }
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="rating">Rating</option>
              <option value="name">Nombre</option>
              <option value="releaseDate">Fecha</option>
            </select>
            <button
              onClick={() =>
                dispatch(
                  setFilters({
                    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                  })
                )
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Botón limpiar filtros */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => dispatch(resetFilters())}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}
