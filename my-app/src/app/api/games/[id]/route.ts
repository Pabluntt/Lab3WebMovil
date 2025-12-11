import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const gameId = parseInt(resolvedParams.id);

    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, igdbId, rating, releaseDate, coverUrl, genres, platforms } = body;

    // Validar datos requeridos
    if (!name || !igdbId) {
      return NextResponse.json(
        { error: 'El nombre e igdbId son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el juego existe
    const existingGame = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!existingGame) {
      return NextResponse.json(
        { error: 'Juego no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el juego
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        name,
        igdbId: parseInt(igdbId),
        rating: rating ? parseFloat(rating) : null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        coverUrl: coverUrl || null,
      },
    });

    // Eliminar géneros actuales
    await prisma.gameGenre.deleteMany({
      where: { gameId },
    });

    // Agregar nuevos géneros
    if (genres && Array.isArray(genres) && genres.length > 0) {
      for (const genreName of genres) {
        let genre = await prisma.genre.findUnique({
          where: { name: genreName },
        });

        if (!genre) {
          genre = await prisma.genre.create({
            data: { name: genreName },
          });
        }

        await prisma.gameGenre.create({
          data: {
            gameId: gameId,
            genreId: genre.id,
          },
        });
      }
    }

    // Eliminar plataformas actuales
    await prisma.gamePlatform.deleteMany({
      where: { gameId },
    });

    // Agregar nuevas plataformas
    if (platforms && Array.isArray(platforms) && platforms.length > 0) {
      for (const platformName of platforms) {
        let platform = await prisma.platform.findUnique({
          where: { name: platformName },
        });

        if (!platform) {
          platform = await prisma.platform.create({
            data: { name: platformName },
          });
        }

        await prisma.gamePlatform.create({
          data: {
            gameId: gameId,
            platformId: platform.id,
          },
        });
      }
    }

    // Obtener el juego actualizado con sus relaciones
    const gameWithRelations = await prisma.game.findUnique({
      where: { id: gameId },
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
        id: gameWithRelations?.id,
        igdbId: gameWithRelations?.igdbId,
        name: gameWithRelations?.name,
        rating: gameWithRelations?.rating,
        releaseDate: gameWithRelations?.releaseDate?.toISOString() || null,
        coverUrl: gameWithRelations?.coverUrl,
        genres: gameWithRelations?.genres.map((gg) => ({
          id: gg.genre.id,
          name: gg.genre.name,
        })),
        platforms: gameWithRelations?.platforms.map((gp) => ({
          id: gp.platform.id,
          name: gp.platform.name,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar juego:', error);
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message);
      console.error('Stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: 'Error al actualizar juego',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Esperar si es Promise
    const resolvedParams = await Promise.resolve(params);
    const gameId = parseInt(resolvedParams.id);

    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar que el juego existe
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Juego no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el juego (las cascadas en la BD eliminarán las relaciones)
    await prisma.game.delete({
      where: { id: gameId },
    });

    return NextResponse.json(
      { message: 'Juego eliminado correctamente', id: gameId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar juego:', error);
    return NextResponse.json(
      { error: 'Error al eliminar juego' },
      { status: 500 }
    );
  }
}
