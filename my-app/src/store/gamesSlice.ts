import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Game {
  id: number;
  igdbId: number;
  name: string;
  rating: number | null;
  releaseDate: string | null;
  coverUrl: string | null;
  genres: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
}

export interface Filters {
  search: string;
  genre: string;
  platform: string;
  minRating: number;
  sortBy: 'name' | 'rating' | 'releaseDate';
  sortOrder: 'asc' | 'desc';
}

interface GamesState {
  games: Game[];
  filteredGames: Game[];
  filters: Filters;
  loading: boolean;
  error: string | null;
}

const initialState: GamesState = {
  games: [],
  filteredGames: [],
  filters: {
    search: '',
    genre: '',
    platform: '',
    minRating: 0,
    sortBy: 'rating',
    sortOrder: 'desc',
  },
  loading: false,
  error: null,
};

// Thunk para obtener juegos desde la API
export const fetchGames = createAsyncThunk('games/fetchGames', async () => {
  const response = await fetch('/api/games');
  if (!response.ok) throw new Error('Error al obtener juegos');
  return response.json();
});

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Aplicar filtros
      applyFilters(state);
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredGames = state.games;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
        applyFilters(state);
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error desconocido';
      });
  },
});

// Función para aplicar filtros
function applyFilters(state: GamesState) {
  let filtered = [...state.games];

  // Filtro por búsqueda
  if (state.filters.search) {
    filtered = filtered.filter((game) =>
      game.name.toLowerCase().includes(state.filters.search.toLowerCase())
    );
  }

  // Filtro por género
  if (state.filters.genre) {
    filtered = filtered.filter((game) =>
      game.genres.some((g) => g.name === state.filters.genre)
    );
  }

  // Filtro por plataforma
  if (state.filters.platform) {
    filtered = filtered.filter((game) =>
      game.platforms.some((p) => p.name === state.filters.platform)
    );
  }

  // Filtro por rating mínimo
  if (state.filters.minRating > 0) {
    filtered = filtered.filter((game) => (game.rating || 0) >= state.filters.minRating);
  }

  // Ordenamiento
  filtered.sort((a, b) => {
    const { sortBy, sortOrder } = state.filters;
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
      case 'releaseDate':
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        comparison = dateA - dateB;
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  state.filteredGames = filtered;
}

export const { setFilters, resetFilters } = gamesSlice.actions;
export default gamesSlice.reducer;
