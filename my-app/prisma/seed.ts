import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { join } from 'path';

// Cargar .env desde el directorio raíz
config({ path: join(__dirname, '..', '.env') });

// Verificar que DATABASE_URL esté cargado
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL no está definido en el archivo .env');
  process.exit(1);
}

// Crear el cliente de Prisma con el adaptador de PostgreSQL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Configuración de IGDB
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID!;
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN!;

async function fetchIGDB(endpoint: string, body: string) {
  const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CLIENT_ID,
      'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
      'Accept': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`IGDB API error: ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // 1. Obtener géneros populares
  console.log('📊 Obteniendo géneros...');
  const genresData = await fetchIGDB('genres', 'fields id, name; where id = (5,12,31,32,33,15,16,4,10,14); limit 10;');
  
  const genres = await Promise.all(
    genresData.map((genre: any) =>
      prisma.genre.upsert({
        where: { name: genre.name },
        update: {},
        create: { name: genre.name },
      })
    )
  );
  
  // Crear un mapa de IGDB ID a nuestro Genre ID
  const genreMap = new Map<number, number>();
  for (let i = 0; i < genresData.length; i++) {
    genreMap.set(genresData[i].id, genres[i].id);
  }
  
  console.log(`✅ ${genres.length} géneros creados`);

  // 2. Obtener plataformas principales
  console.log('🎮 Obteniendo plataformas...');
  const platformsData = await fetchIGDB(
    'platforms',
    'fields id, name; where id = (6,48,49,167,169,130,14,41,46,38); limit 10;'
  );
  
  const platforms = await Promise.all(
    platformsData.map((platform: any) =>
      prisma.platform.upsert({
        where: { name: platform.name },
        update: {},
        create: { name: platform.name },
      })
    )
  );
  
  // Crear un mapa de IGDB ID a nuestro Platform ID
  const platformMap = new Map<number, number>();
  for (let i = 0; i < platformsData.length; i++) {
    platformMap.set(platformsData[i].id, platforms[i].id);
  }
  
  console.log(`✅ ${platforms.length} plataformas creadas`);

  // 3. Obtener juegos populares con todos los datos
  console.log('🎲 Obteniendo videojuegos...');
  const gamesData = await fetchIGDB(
    'games',
    `fields name, rating, first_release_date, cover.url, genres, platforms;
     where rating > 70 & rating_count > 100;
     sort rating desc;
     limit 50;`
  );

  console.log('💾 Guardando videojuegos en la base de datos...');
  let gamesCreated = 0;

  for (const gameData of gamesData) {
    try {
      // Crear el juego
      const game = await prisma.game.create({
        data: {
          igdbId: gameData.id,
          name: gameData.name,
          rating: gameData.rating || null,
          releaseDate: gameData.first_release_date
            ? new Date(gameData.first_release_date * 1000)
            : null,
          coverUrl: gameData.cover?.url
            ? `https:${gameData.cover.url.replace('t_thumb', 't_cover_big')}`
            : null,
        },
      });

      // Relacionar géneros
      if (gameData.genres && gameData.genres.length > 0) {
        const genreIds = gameData.genres.slice(0, 3); // Máximo 3 géneros
        for (const igdbGenreId of genreIds) {
          const ourGenreId = genreMap.get(igdbGenreId);
          if (ourGenreId) {
            await prisma.gameGenre.create({
              data: {
                gameId: game.id,
                genreId: ourGenreId,
              },
            });
          }
        }
      }

      // Relacionar plataformas
      if (gameData.platforms && gameData.platforms.length > 0) {
        const platformIds = gameData.platforms.slice(0, 5); // Máximo 5 plataformas
        for (const igdbPlatformId of platformIds) {
          const ourPlatformId = platformMap.get(igdbPlatformId);
          if (ourPlatformId) {
            await prisma.gamePlatform.create({
              data: {
                gameId: game.id,
                platformId: ourPlatformId,
              },
            });
          }
        }
      }

      gamesCreated++;
      console.log(`  ✓ ${game.name}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`  ⊗ ${gameData.name} (ya existe)`);
      } else {
        console.error(`  ✗ Error con ${gameData.name}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Seed completado:`);
  console.log(`   - ${genres.length} géneros`);
  console.log(`   - ${platforms.length} plataformas`);
  console.log(`   - ${gamesCreated} videojuegos con datos reales de IGDB\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
