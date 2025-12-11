import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        platforms: {
          include: {
            platform: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    // Transformar datos para el frontend
    const formattedGames = games.map((game) => ({
      id: game.id,
      igdbId: game.igdbId,
      name: game.name,
      rating: game.rating,
      releaseDate: game.releaseDate?.toISOString() || null,
      coverUrl: game.coverUrl,
      genres: game.genres.map((gg) => ({
        id: gg.genre.id,
        name: gg.genre.name,
      })),
      platforms: game.platforms.map((gp) => ({
        id: gp.platform.id,
        name: gp.platform.name,
      })),
    }));

    return NextResponse.json(formattedGames);
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    return NextResponse.json(
      { error: 'Error al obtener juegos' },
      { status: 500 }
    );
  }
}
