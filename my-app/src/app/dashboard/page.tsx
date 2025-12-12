'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGames, resetFilters, Game } from '@/store/gamesSlice';
import GameCard from '@/components/GameCard';
import FiltersBar from '@/components/FiltersBar';
import DeleteGamesButton from '@/components/DeleteGamesButton';
import EditGameForm from '@/components/EditGameForm';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Bar, Line, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
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

  // Manejadores de clicks en gráficos
  const handleGenreClick = (label: string) => {
    const gamesWithGenre = filteredGames.filter(g =>
      g.genres.some(genre => genre.name === label)
    );
    if (gamesWithGenre.length > 0) {
      router.push(`/games/${gamesWithGenre[0].id}`);
    }
  };

  const handlePlatformClick = (label: string) => {
    const gamesWithPlatform = filteredGames.filter(g =>
      g.platforms.some(platform => platform.name === label)
    );
    if (gamesWithPlatform.length > 0) {
      router.push(`/games/${gamesWithPlatform[0].id}`);
    }
  };

  const handleRatingClick = (index: number) => {
    const ranges = [
      { min: 0, max: 20 },
      { min: 20, max: 40 },
      { min: 40, max: 60 },
      { min: 60, max: 80 },
      { min: 80, max: 100 },
    ];
    const range = ranges[index];
    const gamesInRange = filteredGames.filter(g =>
      g.rating && g.rating >= range.min && g.rating < range.max
    );
    if (gamesInRange.length > 0) {
      router.push(`/games/${gamesInRange[0].id}`);
    }
  };

  const handleTopRatedClick = (index: number) => {
    const topGames = filteredGames
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
    if (topGames[index]) {
      router.push(`/games/${topGames[index].id}`);
    }
  };

  const handleYearClick = (label: string) => {
    const year = parseInt(label);
    const gamesInYear = filteredGames.filter(g =>
      g.releaseDate && new Date(g.releaseDate).getFullYear() === year
    );
    if (gamesInYear.length > 0) {
      router.push(`/games/${gamesInYear[0].id}`);
    }
  };

  // Cálculo de datos para gráficos
  const getGenreStats = () => {
    const genreMap = new Map<string, number>();
    filteredGames.forEach(game => {
      game.genres.forEach(genre => {
        genreMap.set(genre.name, (genreMap.get(genre.name) || 0) + 1);
      });
    });
    return {
      labels: Array.from(genreMap.keys()),
      datasets: [{
        data: Array.from(genreMap.values()),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF9F40'
        ],
      }]
    };
  };

  const getPlatformStats = () => {
    const platformMap = new Map<string, number>();
    filteredGames.forEach(game => {
      game.platforms.forEach(platform => {
        platformMap.set(platform.name, (platformMap.get(platform.name) || 0) + 1);
      });
    });
    return {
      labels: Array.from(platformMap.keys()),
      datasets: [{
        label: 'Juegos por Plataforma',
        data: Array.from(platformMap.values()),
        backgroundColor: '#36A2EB',
        borderColor: '#1e40af',
        borderWidth: 1,
      }]
    };
  };

  const getRatingDistribution = () => {
    const ranges = [
      { min: 0, max: 20, label: '0-20' },
      { min: 20, max: 40, label: '20-40' },
      { min: 40, max: 60, label: '40-60' },
      { min: 60, max: 80, label: '60-80' },
      { min: 80, max: 100, label: '80-100' },
    ];
    const counts = ranges.map(range => 
      filteredGames.filter(g => {
        const rating = g.rating || 0;
        return rating >= range.min && rating <= range.max;
      }).length
    );
    return {
      labels: ranges.map(r => r.label),
      datasets: [{
        label: 'Cantidad de Juegos',
        data: counts,
        borderColor: '#FF9F40',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      }]
    };
  };

  const getTopRatedGames = () => {
    const topGames = [...filteredGames]
      .filter(g => g.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
    
    return {
      labels: topGames.map(g => g.name.slice(0, 15)),
      datasets: [{
        label: 'Rating',
        data: topGames.map(g => g.rating || 0),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderWidth: 2,
      }]
    };
  };

  const getYearDistribution = () => {
    const yearMap = new Map<number, number>();
    filteredGames.forEach(game => {
      if (game.releaseDate) {
        const year = new Date(game.releaseDate).getFullYear();
        yearMap.set(year, (yearMap.get(year) || 0) + 1);
      }
    });
    const sortedYears = Array.from(yearMap.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(-10);
    
    return {
      labels: sortedYears.map(y => y[0].toString()),
      datasets: [{
        label: 'Juegos por Año',
        data: sortedYears.map(y => y[1]),
        backgroundColor: '#9966FF',
        borderColor: '#6b21a8',
        borderWidth: 1,
      }]
    };
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
        {/* Sección de Métricas Clave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total de juegos</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{filteredGames.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Rating promedio</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {filteredGames.length > 0
                ? ((filteredGames.reduce((sum, g) => sum + (g.rating || 0), 0) / filteredGames.length).toFixed(1))
                : '0'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Géneros únicos</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {new Set(filteredGames.flatMap(g => g.genres.map(g => g.name))).size}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Plataformas</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {new Set(filteredGames.flatMap(g => g.platforms.map(p => p.name))).size}
            </p>
          </div>
        </div>

        {/* Sección de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico 1: Géneros (Pie) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Distribución por género</h2>
            {filteredGames.length > 0 ? (
              <div style={{ maxHeight: '300px', position: 'relative' }}>
                <Pie data={getGenreStats()} options={{ maintainAspectRatio: false }} />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">Sin datos</p>
            )}
          </div>

          {/* Gráfico 2: Plataformas (Bar) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Juegos por plataforma</h2>
            {filteredGames.length > 0 ? (
              <div style={{ maxHeight: '300px', position: 'relative' }}>
                <Bar data={getPlatformStats()} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">Sin datos</p>
            )}
          </div>

          {/* Gráfico 3: Distribución de Rating (Line) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Distribución de ratings</h2>
            {filteredGames.length > 0 ? (
              <div style={{ maxHeight: '300px', position: 'relative' }}>
                <Line data={getRatingDistribution()} options={{ maintainAspectRatio: false }} />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">Sin datos</p>
            )}
          </div>

          {/* Gráfico 4: Top Rated (Doughnut) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top 5 juegos</h2>
            {filteredGames.length > 0 ? (
              <div style={{ maxHeight: '300px', position: 'relative' }}>
                <Doughnut data={getTopRatedGames()} options={{ maintainAspectRatio: false }} />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">Sin datos</p>
            )}
          </div>

          {/* Gráfico 5: Lanzamientos por Año (Bar) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Juegos por año de lanzamiento</h2>
            {filteredGames.length > 0 ? (
              <div style={{ maxHeight: '300px', position: 'relative' }}>
                <Bar data={getYearDistribution()} options={{ maintainAspectRatio: false }} />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">Sin datos</p>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4"> Filtros y Búsqueda</h2>
          <FiltersBar />
        </div>

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
