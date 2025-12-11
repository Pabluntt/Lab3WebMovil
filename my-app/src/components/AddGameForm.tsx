'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchGames } from '@/store/gamesSlice';

interface FormData {
  name: string;
  igdbId: string;
  rating: string;
  releaseDate: string;
  coverUrl: string;
  genres: string[];
  platforms: string[];
}

export default function AddGameForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    igdbId: '',
    rating: '',
    releaseDate: '',
    coverUrl: '',
    genres: [],
    platforms: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newGenre, setNewGenre] = useState('');
  const [newPlatform, setNewPlatform] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddGenre = () => {
    if (newGenre.trim() && !formData.genres.includes(newGenre.trim())) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, newGenre.trim()],
      }));
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((_, i) => i !== index),
    }));
  };

  const handleAddPlatform = () => {
    if (newPlatform.trim() && !formData.platforms.includes(newPlatform.trim())) {
      setFormData((prev) => ({
        ...prev,
        platforms: [...prev.platforms, newPlatform.trim()],
      }));
      setNewPlatform('');
    }
  };

  const handleRemovePlatform = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          igdbId: parseInt(formData.igdbId),
          rating: formData.rating ? parseFloat(formData.rating) : null,
          releaseDate: formData.releaseDate || null,
          coverUrl: formData.coverUrl || null,
          genres: formData.genres,
          platforms: formData.platforms,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear el juego');
      }

      setSuccess(true);
      setFormData({
        name: '',
        igdbId: '',
        rating: '',
        releaseDate: '',
        coverUrl: '',
        genres: [],
        platforms: [],
      });

      // Recargar los juegos
      dispatch(fetchGames());

      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-8 sm:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">🎮 Añadir Nuevo Juego</h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2">Completa el formulario para agregar un juego a tu biblioteca</p>
        </div>

        {/* Contenido del formulario */}
        <div className="px-4 py-6 sm:px-8 sm:py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg text-sm sm:text-base">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg text-sm sm:text-base">
              ✅ ¡Juego creado exitosamente!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Juego *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-lg transition-all"
              placeholder="Ej: The Legend of Zelda"
            />
          </div>

          {/* IGDB ID */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              IGDB ID *
            </label>
            <input
              type="number"
              name="igdbId"
              value={formData.igdbId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-lg transition-all"
              placeholder="Ej: 5"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Calificación (0-100)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-lg transition-all"
              placeholder="Ej: 85.5"
            />
          </div>

          {/* Fecha de lanzamiento */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Lanzamiento
            </label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-lg transition-all"
            />
          </div>

          {/* URL de portada */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              URL de la Portada
            </label>
            <input
              type="url"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-lg transition-all"
              placeholder="Ej: https://example.com/cover.jpg"
            />
          </div>
        </div>

        {/* Géneros */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🏷️ Géneros
          </label>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              type="text"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddGenre();
                }
              }}
              className="flex-1 px-4 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-lg transition-all"
              placeholder="Ej: Action"
            />
            <button
              type="button"
              onClick={handleAddGenre}
              className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold whitespace-nowrap text-sm sm:text-base"
            >
              + Añadir
            </button>
          </div>
          {formData.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.genres.map((genre, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(index)}
                    className="ml-2 font-bold hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Plataformas */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🖥️ Plataformas
          </label>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              type="text"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPlatform();
                }
              }}
              className="flex-1 px-4 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-lg transition-all"
              placeholder="Ej: PC"
            />
            <button
              type="button"
              onClick={handleAddPlatform}
              className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold whitespace-nowrap text-sm sm:text-base"
            >
              + Añadir
            </button>
          </div>
          {formData.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.platforms.map((platform, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                >
                  {platform}
                  <button
                    type="button"
                    onClick={() => handleRemovePlatform(index)}
                    className="ml-2 font-bold hover:text-green-600 dark:hover:text-green-400"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Botones - Full width en móvil */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition disabled:from-gray-400 disabled:to-gray-400 text-base sm:text-lg"
          >
            {loading ? '⏳ Creando...' : '✅ Crear Juego'}
          </button>
          <button
            type="reset"
            onClick={() =>
              setFormData({
                name: '',
                igdbId: '',
                rating: '',
                releaseDate: '',
                coverUrl: '',
                genres: [],
                platforms: [],
              })
            }
            className="flex-1 px-6 py-3 sm:py-4 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition text-base sm:text-lg"
          >
            🔄 Limpiar
          </button>
        </div>
        </form>
        </div>
      </div>
    </div>
  );
}
