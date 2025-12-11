'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchGames } from '@/store/gamesSlice';

interface DeleteGamesProps {
  selectedGameIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export default function DeleteGamesButton({
  selectedGameIds,
  onSelectionChange,
}: DeleteGamesProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteGames = async () => {
    if (selectedGameIds.length === 0) return;

    setLoading(true);
    try {
      const deletePromises = selectedGameIds.map((id) =>
        fetch(`/api/games/${id}`, { method: 'DELETE' })
      );

      const results = await Promise.all(deletePromises);

      // Verificar si todas las eliminciones fueron exitosas
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        // Limpiar selección y recargar
        onSelectionChange([]);
        dispatch(fetchGames());
        setShowConfirm(false);
      } else {
        alert('Error al eliminar algunos juegos');
      }
    } catch (error) {
      console.error('Error eliminando juegos:', error);
      alert('Error al eliminar juegos');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = selectedGameIds.length === 0 || loading;

  return (
    <div className="relative">
      <button
        onClick={() => setShowConfirm(!showConfirm)}
        disabled={isDisabled}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white font-medium transition-colors ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        🗑️ Eliminar {selectedGameIds.length > 0 && `(${selectedGameIds.length})`}
      </button>

      {/* Modal de confirmación */}
      {showConfirm && !isDisabled && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50 p-4 min-w-80">
          <p className="text-gray-900 dark:text-white font-semibold mb-3">
            ¿Eliminar {selectedGameIds.length} juego{selectedGameIds.length !== 1 ? 's' : ''}?
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteGames}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Eliminando...' : 'Confirmar'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-400 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
