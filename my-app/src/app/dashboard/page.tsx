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
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Título y contador */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              🎮 JUEGOS JAJ
            </h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {filteredGames.length} juegos encontrados
            </p>
          </div>

          {/* Grid responsive de controles */}
          <div className="space-y-3 sm:space-y-0">
            {/* Primera fila - Modos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2 lg:gap-3">
              {/* Botón Editar */}
              <button
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  if (!isEditMode) {
                    setEditingGame(null);
                  }
                }}
                className={`col-span-1 inline-flex items-center justify-center lg:justify-start gap-1 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-medium text-sm sm:text-base transition-all ${
                  isEditMode
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-md'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                <span>✏️</span>
                <span className="hidden sm:inline">{isEditMode ? 'Editar ON' : 'Editar'}</span>
              </button>

              {/* Botón Seleccionar */}
              <button
                onClick={() => {
                  setIsSelectMode(!isSelectMode);
                  if (!isSelectMode) {
                    setSelectedGames([]);
                  }
                }}
                className={`col-span-1 inline-flex items-center justify-center lg:justify-start gap-1 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-medium text-sm sm:text-base transition-all ${
                  isSelectMode
                    ? 'bg-yellow-600 hover:bg-yellow-700 shadow-md'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                <span>☑️</span>
                <span className="hidden sm:inline">{isSelectMode ? 'Selec. ON' : 'Selec.'}</span>
              </button>

              {/* Botón Eliminar (solo en modo selección) */}
              {isSelectMode && (
                <div className="col-span-1">
                  <DeleteGamesButton
                    selectedGameIds={selectedGames}
                    onSelectionChange={setSelectedGames}
                  />
                </div>
              )}

              {/* Botón Añadir Juego */}
              <Link
                href="/games/add"
                className="col-span-1 sm:col-span-1 lg:col-span-auto inline-flex items-center justify-center lg:justify-start gap-1 sm:gap-2 rounded-lg bg-green-600 px-3 sm:px-4 py-2 sm:py-3 text-white font-medium text-sm sm:text-base hover:bg-green-700 transition-all shadow-sm"
              >
                <span>➕</span>
                <span className="hidden sm:inline">Añadir</span>
              </Link>
            </div>

            {/* Segunda fila - Toggle de vista */}
            <div className="flex gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1.5 sm:p-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                📊 Tarjetas
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                📝 Lista
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Filtros */}
        <FiltersBar />

        {/* Lista de Juegos */}
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              📚 Todos los Juegos
            </h2>
            {isSelectMode && (
              <button
                onClick={handleSelectAll}
                className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap font-medium"
              >
                {selectedGames.length === filteredGames.length && filteredGames.length > 0
                  ? '☐ Deseleccionar todos'
                  : '☑️ Seleccionar todos'}
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
