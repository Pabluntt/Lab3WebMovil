'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGames, resetFilters, Game } from '@/store/gamesSlice';
import GameCard from '@/components/GameCard';
import FiltersBar from '@/components/FiltersBar';
import DeleteGamesButton from '@/components/DeleteGamesButton';
import EditGameForm from '@/components/EditGameForm';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { filteredGames, loading, error } = useAppSelector((state) => state.games);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGames, setSelectedGames] = useState<number[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  const handleToggleSelect = (gameId: number) => {
    setSelectedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleSelectAll = () => {
    if (selectedGames.length === filteredGames.length) {
      setSelectedGames([]);
    } else {
      setSelectedGames(filteredGames.map((game) => game.id));
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
  };

  const handleCloseEdit = () => {
    setEditingGame(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg">Cargando juegos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchGames())}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                JUEGOS JAJ
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {filteredGames.length} juegos encontrados
              </p>
            </div>
            
            <div className="flex gap-2 items-center">
              {/* Botón Editar */}
              <button
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  if (!isEditMode) {
                    setEditingGame(null);
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white font-medium transition-colors ${
                  isEditMode
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isEditMode ? '✓ Modo Editar ON' : '✏️ Modo Editar'}
              </button>

              {/* Botón Seleccionar */}
              <button
                onClick={() => {
                  setIsSelectMode(!isSelectMode);
                  if (!isSelectMode) {
                    setSelectedGames([]);
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white font-medium transition-colors ${
                  isSelectMode
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isSelectMode ? '✓ Modo Selección ON' : '☑️ Modo Selección'}
              </button>

              {/* Botón Eliminar (solo en modo selección) */}
              {isSelectMode && (
                <DeleteGamesButton
                  selectedGameIds={selectedGames}
                  onSelectionChange={setSelectedGames}
                />
              )}

              {/* Botón Añadir Juego */}
              <Link
                href="/games/add"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors"
              >
                ➕ Añadir Juego
              </Link>
              
              {/* Toggle de vista */}
              <div className="flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white shadow'
                      : 'text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Tarjetas grandecitas
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white shadow'
                      : 'text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Listita jiji
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Filtros */}
        <FiltersBar />

        {/* Lista de Juegos */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Todos los Juegos
            </h2>
            {isSelectMode && (
              <button
                onClick={handleSelectAll}
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {selectedGames.length === filteredGames.length && filteredGames.length > 0
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos'}
              </button>
            )}
          </div>
          
          {filteredGames.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                No se encontraron juegos con los filtros aplicados
              </p>
              <button
                onClick={() => dispatch(resetFilters())}
                className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  viewMode="grid"
                  isSelected={selectedGames.includes(game.id)}
                  onToggleSelect={handleToggleSelect}
                  isSelectMode={isSelectMode}
                  isEditMode={isEditMode}
                  onEdit={handleEditGame}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  viewMode="list"
                  isSelected={selectedGames.includes(game.id)}
                  onToggleSelect={handleToggleSelect}
                  isSelectMode={isSelectMode}
                  isEditMode={isEditMode}
                  onEdit={handleEditGame}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal de edición */}
      {editingGame && (
        <EditGameForm game={editingGame} onClose={handleCloseEdit} />
      )}
    </div>
  );
}
