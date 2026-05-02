import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Companies
  const companies = await Promise.all([
    prisma.company.create({
      data: { name: "Riot Games", headquarters: "Los Angeles, USA", foundedYear: 2006 },
    }),
    prisma.company.create({
      data: { name: "Valve Corporation", headquarters: "Bellevue, USA", foundedYear: 1996 },
    }),
    prisma.company.create({
      data: { name: "Blizzard Entertainment", headquarters: "Irvine, USA", foundedYear: 1991 },
    }),
    prisma.company.create({
      data: { name: "Epic Games", headquarters: "Cary, USA", foundedYear: 1991 },
    }),
    prisma.company.create({
      data: { name: "Activision", headquarters: "Santa Monica, USA", foundedYear: 1979 },
    }),
  ]);
  console.log(`✅ Created ${companies.length} companies`);

  // 2. Games
  const games = await Promise.all([
    prisma.game.create({
      data: { name: "Valorant", genre: "FPS", releaseDate: new Date("2020-06-02"), companyId: companies[0].id },
    }),
    prisma.game.create({
      data: { name: "League of Legends", genre: "MOBA", releaseDate: new Date("2009-10-27"), companyId: companies[0].id },
    }),
    prisma.game.create({
      data: { name: "Counter-Strike 2", genre: "FPS", releaseDate: new Date("2023-09-27"), companyId: companies[1].id },
    }),
    prisma.game.create({
      data: { name: "Dota 2", genre: "MOBA", releaseDate: new Date("2013-07-09"), companyId: companies[1].id },
    }),
    prisma.game.create({
      data: { name: "Overwatch 2", genre: "FPS", releaseDate: new Date("2022-10-04"), companyId: companies[2].id },
    }),
    prisma.game.create({
      data: { name: "Hearthstone", genre: "Card Game", releaseDate: new Date("2014-03-11"), companyId: companies[2].id },
    }),
    prisma.game.create({
      data: { name: "Fortnite", genre: "Battle Royale", releaseDate: new Date("2017-07-21"), companyId: companies[3].id },
    }),
    prisma.game.create({
      data: { name: "Call of Duty: Warzone", genre: "FPS", releaseDate: new Date("2020-03-10"), companyId: companies[4].id },
    }),
  ]);
  console.log(`✅ Created ${games.length} games`);

  // 3. Game Modes
  const gameModes = await Promise.all([
    // Valorant modes
    prisma.gameMode.create({ data: { name: "Competitive", description: "5v5 ranked competitive mode", gameId: games[0].id } }),
    prisma.gameMode.create({ data: { name: "Unrated", description: "5v5 casual unrated mode", gameId: games[0].id } }),
    prisma.gameMode.create({ data: { name: "Deathmatch", description: "Free-for-all deathmatch", gameId: games[0].id } }),
    prisma.gameMode.create({ data: { name: "Spike Rush", description: "Fast-paced spike plant mode", gameId: games[0].id } }),
    // LoL modes
    prisma.gameMode.create({ data: { name: "Ranked Solo/Duo", description: "5v5 ranked on Summoner's Rift", gameId: games[1].id } }),
    prisma.gameMode.create({ data: { name: "Normal Draft", description: "5v5 normal draft pick", gameId: games[1].id } }),
    prisma.gameMode.create({ data: { name: "ARAM", description: "All Random All Mid", gameId: games[1].id } }),
    // CS2 modes
    prisma.gameMode.create({ data: { name: "Competitive", description: "5v5 bomb defusal ranked", gameId: games[2].id } }),
    prisma.gameMode.create({ data: { name: "Casual", description: "Casual bomb defusal", gameId: games[2].id } }),
    prisma.gameMode.create({ data: { name: "Wingman", description: "2v2 competitive mode", gameId: games[2].id } }),
    // Dota 2 modes
    prisma.gameMode.create({ data: { name: "Ranked All Pick", description: "Standard ranked mode", gameId: games[3].id } }),
    prisma.gameMode.create({ data: { name: "Turbo", description: "Faster paced mode", gameId: games[3].id } }),
    prisma.gameMode.create({ data: { name: "Captains Mode", description: "Tournament draft mode", gameId: games[3].id } }),
    // Overwatch 2 modes
    prisma.gameMode.create({ data: { name: "Competitive", description: "Ranked 5v5 role queue", gameId: games[4].id } }),
    prisma.gameMode.create({ data: { name: "Quick Play", description: "Casual 5v5 mode", gameId: games[4].id } }),
    prisma.gameMode.create({ data: { name: "Arcade", description: "Fun rotating game modes", gameId: games[4].id } }),
    // Hearthstone modes
    prisma.gameMode.create({ data: { name: "Standard", description: "Standard ranked ladder", gameId: games[5].id } }),
    prisma.gameMode.create({ data: { name: "Wild", description: "All cards available", gameId: games[5].id } }),
    prisma.gameMode.create({ data: { name: "Arena", description: "Draft and play", gameId: games[5].id } }),
    // Fortnite modes
    prisma.gameMode.create({ data: { name: "Solo", description: "Solo battle royale", gameId: games[6].id } }),
    prisma.gameMode.create({ data: { name: "Duos", description: "Two-player teams", gameId: games[6].id } }),
    prisma.gameMode.create({ data: { name: "Squads", description: "Four-player squads", gameId: games[6].id } }),
    prisma.gameMode.create({ data: { name: "Zero Build", description: "No building mode", gameId: games[6].id } }),
    // Warzone modes
    prisma.gameMode.create({ data: { name: "Battle Royale", description: "150-player battle royale", gameId: games[7].id } }),
    prisma.gameMode.create({ data: { name: "Resurgence", description: "Smaller map with respawns", gameId: games[7].id } }),
    prisma.gameMode.create({ data: { name: "Plunder", description: "Collect cash to win", gameId: games[7].id } }),
  ]);
  console.log(`✅ Created ${gameModes.length} game modes`);

  // 4. Players
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const playerHash = await bcrypt.hash("Player@123", 10);

  const playerNames = [
    { username: "admin", email: "admin@gms.dev", role: "ADMIN" as const, hash: passwordHash },
    { username: "Faker", email: "faker@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "s1mple", email: "s1mple@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Shroud", email: "shroud@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "TenZ", email: "tenz@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Ninja", email: "ninja@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Bugha", email: "bugha@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "ScreaM", email: "scream@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Mixwell", email: "mixwell@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Carzzy", email: "carzzy@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Aspas", email: "aspas@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Demon1", email: "demon1@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Yay", email: "yay@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Derke", email: "derke@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Chronicle", email: "chronicle@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "nAts", email: "nats@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Crashies", email: "crashies@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "Mako", email: "mako@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "ZywOo", email: "zywoo@gms.dev", role: "PLAYER" as const, hash: playerHash },
    { username: "NiKo", email: "niko@gms.dev", role: "PLAYER" as const, hash: playerHash },
  ];

  const players = await Promise.all(
    playerNames.map((p) =>
      prisma.player.create({
        data: {
          username: p.username,
          email: p.email,
          passwordHash: p.hash,
          role: p.role,
        },
      })
    )
  );
  console.log(`✅ Created ${players.length} players`);

  // 5. Characters
  const characters = await Promise.all([
    prisma.character.create({ data: { name: "Jett", role: "Duelist", gameId: games[0].id } }),
    prisma.character.create({ data: { name: "Sage", role: "Sentinel", gameId: games[0].id } }),
    prisma.character.create({ data: { name: "Omen", role: "Controller", gameId: games[0].id } }),
    prisma.character.create({ data: { name: "Sova", role: "Initiator", gameId: games[0].id } }),
    prisma.character.create({ data: { name: "Phoenix", role: "Duelist", gameId: games[0].id } }),
    prisma.character.create({ data: { name: "Ahri", role: "Mage", gameId: games[1].id } }),
    prisma.character.create({ data: { name: "Yasuo", role: "Fighter", gameId: games[1].id } }),
    prisma.character.create({ data: { name: "Jinx", role: "Marksman", gameId: games[1].id } }),
    prisma.character.create({ data: { name: "Thresh", role: "Support", gameId: games[1].id } }),
    prisma.character.create({ data: { name: "Tracer", role: "Damage", gameId: games[4].id } }),
    prisma.character.create({ data: { name: "Mercy", role: "Support", gameId: games[4].id } }),
    prisma.character.create({ data: { name: "Reinhardt", role: "Tank", gameId: games[4].id } }),
    prisma.character.create({ data: { name: "Pudge", role: "Strength", gameId: games[3].id } }),
    prisma.character.create({ data: { name: "Invoker", role: "Intelligence", gameId: games[3].id } }),
    prisma.character.create({ data: { name: "Anti-Mage", role: "Agility", gameId: games[3].id } }),
  ]);
  console.log(`✅ Created ${characters.length} characters`);

  // 6. Teams
  const teams = await Promise.all([
    prisma.team.create({ data: { name: "Sentinels", gameId: games[0].id } }),
    prisma.team.create({ data: { name: "Cloud9", gameId: games[0].id } }),
    prisma.team.create({ data: { name: "T1", gameId: games[1].id } }),
    prisma.team.create({ data: { name: "Gen.G", gameId: games[1].id } }),
    prisma.team.create({ data: { name: "FaZe Clan", gameId: games[2].id } }),
    prisma.team.create({ data: { name: "Natus Vincere", gameId: games[2].id } }),
    prisma.team.create({ data: { name: "Team Liquid", gameId: games[3].id } }),
    prisma.team.create({ data: { name: "OG", gameId: games[3].id } }),
    prisma.team.create({ data: { name: "Dallas Fuel", gameId: games[4].id } }),
    prisma.team.create({ data: { name: "San Francisco Shock", gameId: games[4].id } }),
  ]);
  console.log(`✅ Created ${teams.length} teams`);

  // 7. Game Accounts
  const accountPairs = [
    [1, 0], [1, 1], [2, 1], [3, 2], [4, 0], [5, 0], [6, 6], [7, 0],
    [8, 0], [9, 1], [10, 0], [11, 0], [12, 0], [13, 2], [14, 0],
    [15, 2], [16, 0], [17, 0], [18, 3], [19, 2],
  ];

  await Promise.all(
    accountPairs.map(([pi, gi]) =>
      prisma.gameAccount.create({
        data: {
          playerId: players[pi].id,
          gameId: games[gi].id,
          accountLevel: Math.floor(Math.random() * 100) + 1,
        },
      })
    )
  );
  console.log("✅ Created game accounts");

  // 8. Tournaments
  const tournaments = await Promise.all([
    prisma.tournament.create({
      data: {
        name: "Valorant Champions 2024",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-08-25"),
        prizePool: 1000000,
        status: "COMPLETED",
      },
    }),
    prisma.tournament.create({
      data: {
        name: "League Worlds 2024",
        startDate: new Date("2024-09-25"),
        endDate: new Date("2024-11-02"),
        prizePool: 2225000,
        status: "COMPLETED",
      },
    }),
    prisma.tournament.create({
      data: {
        name: "CS2 Major Copenhagen",
        startDate: new Date("2025-03-17"),
        endDate: new Date("2025-03-31"),
        prizePool: 1250000,
        status: "ONGOING",
      },
    }),
    prisma.tournament.create({
      data: {
        name: "Valorant Masters Shanghai",
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-23"),
        prizePool: 750000,
        status: "UPCOMING",
      },
    }),
  ]);
  console.log(`✅ Created ${tournaments.length} tournaments`);

  // 9. Matches + Participations + Stats
  const matchTypes = ["Ranked", "Casual", "Tournament", "Scrimmage"];
  const results: ("WIN" | "LOSS")[] = ["WIN", "LOSS"];

  for (let i = 0; i < 30; i++) {
    const teamPairIndex = i % 5;
    const team1 = teams[teamPairIndex * 2];
    const team2 = teams[teamPairIndex * 2 + 1];
    const modeIndex = i % gameModes.length;
    const isTourn = i < 8;
    const tournId = isTourn ? tournaments[i % tournaments.length].id : null;
    const mType = isTourn ? "Tournament" : matchTypes[i % matchTypes.length];

    const match = await prisma.match.create({
      data: {
        matchDate: new Date(Date.now() - (30 - i) * 86400000),
        matchType: mType,
        gameModeId: gameModes[modeIndex].id,
        tournamentId: tournId,
      },
    });

    const winnerIsTeam1 = Math.random() > 0.5;

    // 5 players per team (cycling through players)
    for (let j = 0; j < 5; j++) {
      const p1Index = (teamPairIndex * 2 + j) % players.length;
      const p2Index = (teamPairIndex * 2 + j + 5) % players.length;

      await prisma.matchParticipation.create({
        data: {
          matchId: match.id,
          teamId: team1.id,
          playerId: players[p1Index].id,
          result: winnerIsTeam1 ? "WIN" : "LOSS",
        },
      });
      await prisma.matchParticipation.create({
        data: {
          matchId: match.id,
          teamId: team2.id,
          playerId: players[p2Index].id,
          result: winnerIsTeam1 ? "LOSS" : "WIN",
        },
      });

      await prisma.playerStats.create({
        data: {
          playerId: players[p1Index].id,
          matchId: match.id,
          score: Math.floor(Math.random() * 35) + 5,
          kills: Math.floor(Math.random() * 25) + 1,
          deaths: Math.floor(Math.random() * 15) + 1,
          assists: Math.floor(Math.random() * 20),
        },
      });
      await prisma.playerStats.create({
        data: {
          playerId: players[p2Index].id,
          matchId: match.id,
          score: Math.floor(Math.random() * 35) + 5,
          kills: Math.floor(Math.random() * 25) + 1,
          deaths: Math.floor(Math.random() * 15) + 1,
          assists: Math.floor(Math.random() * 20),
        },
      });
    }
  }
  console.log("✅ Created 30 matches with participations and stats");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
