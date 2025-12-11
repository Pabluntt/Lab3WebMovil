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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Añadir Nuevo Juego</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ¡Juego creado exitosamente!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Juego *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: The Legend of Zelda"
            />
          </div>

          {/* IGDB ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IGDB ID *
            </label>
            <input
              type="number"
              name="igdbId"
              value={formData.igdbId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 5"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 85.5"
            />
          </div>

          {/* Fecha de lanzamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Lanzamiento
            </label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* URL de portada */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de la Portada
            </label>
            <input
              type="url"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: https://example.com/cover.jpg"
            />
          </div>
        </div>

        {/* Géneros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Géneros
          </label>
          <div className="flex gap-2 mb-3">
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Action, Adventure"
            />
            <button
              type="button"
              onClick={handleAddGenre}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Añadir
            </button>
          </div>
          {formData.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.genres.map((genre, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plataformas
          </label>
          <div className="flex gap-2 mb-3">
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: PC, PlayStation 5"
            />
            <button
              type="button"
              onClick={handleAddPlatform}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Añadir
            </button>
          </div>
          {formData.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.platforms.map((platform, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {platform}
                  <button
                    type="button"
                    onClick={() => handleRemovePlatform(index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
          >
            {loading ? 'Creando...' : 'Crear Juego'}
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
            className="flex-1 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
