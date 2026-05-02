import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const playerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100).optional(),
  role: z.enum(["ADMIN", "PLAYER"]).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const gameSchema = z.object({
  name: z.string().min(1).max(100),
  genre: z.string().min(1).max(50),
  releaseDate: z.string().or(z.date()),
  companyId: z.number().int().positive(),
});

export const gameModeSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().nullable().optional(),
  gameId: z.number().int().positive(),
});

export const matchSchema = z.object({
  matchDate: z.string().or(z.date()),
  matchType: z.string().min(1).max(50),
  gameModeId: z.number().int().positive(),
  tournamentId: z.number().int().positive().nullable().optional(),
});

export const tournamentSchema = z.object({
  name: z.string().min(1).max(100),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  prizePool: z.number().positive(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"]).optional(),
});

export const teamSchema = z.object({
  name: z.string().min(1).max(100),
  gameId: z.number().int().positive(),
  logoUrl: z.string().url().nullable().optional(),
});

export const companySchema = z.object({
  name: z.string().min(1).max(100),
  headquarters: z.string().min(1).max(100),
  foundedYear: z.number().int().min(1900).max(2030),
});

export const simulateSchema = z.object({
  gameModeId: z.number().int().positive(),
  team1Id: z.number().int().positive(),
  team2Id: z.number().int().positive(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PlayerInput = z.infer<typeof playerSchema>;
export type GameInput = z.infer<typeof gameSchema>;
export type MatchInput = z.infer<typeof matchSchema>;
export type TournamentInput = z.infer<typeof tournamentSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type SimulateInput = z.infer<typeof simulateSchema>;
