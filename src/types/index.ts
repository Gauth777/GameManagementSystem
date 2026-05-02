export interface UserSession {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "PLAYER";
  image?: string;
}

export interface Company {
  id: number;
  name: string;
  headquarters: string;
  foundedYear: number;
  games?: Game[];
  createdAt: string;
}

export interface Game {
  id: number;
  name: string;
  genre: string;
  releaseDate: string;
  companyId: number;
  company?: Company;
  gameModes?: GameMode[];
  characters?: Character[];
  teams?: Team[];
  gameAccounts?: GameAccount[];
  createdAt: string;
}

export interface GameMode {
  id: number;
  name: string;
  description: string | null;
  gameId: number;
  game?: Game;
}

export interface Player {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "PLAYER";
  joinDate: string;
  avatarUrl: string | null;
  gameAccounts?: GameAccount[];
  stats?: PlayerStats[];
  matchParticipations?: MatchParticipation[];
  createdAt: string;
}

export interface GameAccount {
  id: number;
  playerId: number;
  gameId: number;
  accountLevel: number;
  createdDate: string;
  player?: Player;
  game?: Game;
}

export interface Character {
  id: number;
  name: string;
  role: string;
  gameId: number;
  imageUrl: string | null;
  game?: Game;
}

export interface Team {
  id: number;
  name: string;
  gameId: number;
  createdDate: string;
  logoUrl: string | null;
  game?: Game;
  participations?: MatchParticipation[];
}

export interface Tournament {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  matches?: Match[];
  createdAt: string;
}

export interface Match {
  id: number;
  matchDate: string;
  matchType: string;
  gameModeId: number;
  tournamentId: number | null;
  gameMode?: GameMode;
  tournament?: Tournament | null;
  participations?: MatchParticipation[];
  playerStats?: PlayerStats[];
  createdAt: string;
}

export interface MatchParticipation {
  id: number;
  matchId: number;
  teamId: number;
  playerId: number;
  result: "WIN" | "LOSS" | "DRAW" | "PENDING";
  match?: Match;
  team?: Team;
  player?: Player;
}

export interface PlayerStats {
  id: number;
  playerId: number;
  matchId: number;
  score: number;
  kills: number;
  deaths: number;
  assists: number;
  player?: Player;
  match?: Match;
}

export interface LeaderboardEntry {
  rank: number;
  id: number;
  username: string;
  avatarUrl: string | null;
  totalScore: number;
  wins: number;
  totalMatches: number;
  kills: number;
  deaths: number;
  kdRatio: number;
}

export interface DashboardStats {
  totalPlayers: number;
  activeMatches: number;
  ongoingTournaments: number;
  topScore: number;
}

export interface SimulationResult {
  match: Match;
  team1: { team: Team; players: Player[]; totalScore: number };
  team2: { team: Team; players: Player[]; totalScore: number };
  winner: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
