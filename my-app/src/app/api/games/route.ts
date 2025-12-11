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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, igdbId, rating, releaseDate, coverUrl, genres, platforms } = body;

    // Validacion
    if (!name || !igdbId) {
      return NextResponse.json(
        { error: 'El nombre e igdbId son requeridos' },
        { status: 400 }
      );
    }

    // Crear el juego
    const game = await prisma.game.create({
      data: {
        name,
        igdbId,
        rating: rating || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        coverUrl: coverUrl || null,
      },
    });

    // Agregar géneros 
    if (genres && Array.isArray(genres) && genres.length > 0) {
      for (const genreName of genres) {
        // Buscar o crear el género
        let genre = await prisma.genre.findUnique({
          where: { name: genreName },
        });

        if (!genre) {
          genre = await prisma.genre.create({
            data: { name: genreName },
          });
        }

        // Crear la relación
        await prisma.gameGenre.create({
          data: {
            gameId: game.id,
            genreId: genre.id,
          },
        });
      }
    }

    // Agregar plataforma
    if (platforms && Array.isArray(platforms) && platforms.length > 0) {
      for (const platformName of platforms) {
        // Buscar o crear la plataforma
        let platform = await prisma.platform.findUnique({
          where: { name: platformName },
        });

        if (!platform) {
          platform = await prisma.platform.create({
            data: { name: platformName },
          });
        }

        // Crear la relación
        await prisma.gamePlatform.create({
          data: {
            gameId: game.id,
            platformId: platform.id,
          },
        });
      }
    }

    // Obtener el juego creado
    const createdGame = await prisma.game.findUnique({
      where: { id: game.id },
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
    });

    return NextResponse.json(
      {
        id: createdGame?.id,
        igdbId: createdGame?.igdbId,
        name: createdGame?.name,
        rating: createdGame?.rating,
        releaseDate: createdGame?.releaseDate?.toISOString() || null,
        coverUrl: createdGame?.coverUrl,
        genres: createdGame?.genres.map((gg) => ({
          id: gg.genre.id,
          name: gg.genre.name,
        })),
        platforms: createdGame?.platforms.map((gp) => ({
          id: gp.platform.id,
          name: gp.platform.name,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear juego:', error);
    return NextResponse.json(
      { error: 'Error al crear juego' },
      { status: 500 }
    );
  }
}
