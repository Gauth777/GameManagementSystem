export const ROLES = {
  ADMIN: "ADMIN",
  PLAYER: "PLAYER",
} as const;

export const TOURNAMENT_STATUS = {
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
} as const;

export const MATCH_RESULT = {
  WIN: "WIN",
  LOSS: "LOSS",
  DRAW: "DRAW",
  PENDING: "PENDING",
} as const;

export const MATCH_TYPES = [
  "Ranked",
  "Casual",
  "Tournament",
  "Scrimmage",
] as const;

export const GENRES = [
  "FPS",
  "MOBA",
  "Battle Royale",
  "RPG",
  "RTS",
  "Fighting",
  "Sports",
  "Card Game",
] as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Players", href: "/players", icon: "Users" },
  { label: "Games", href: "/games", icon: "Gamepad2" },
  { label: "Matches", href: "/matches", icon: "Swords" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Tournaments", href: "/tournaments", icon: "Crown" },
  { label: "Teams", href: "/teams", icon: "Shield" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Admin", href: "/admin", icon: "Settings" },
  { label: "Companies", href: "/admin/companies", icon: "Building2" },
  { label: "Simulate", href: "/admin/simulate", icon: "Zap" },
] as const;

export const PAGE_SIZE = 10;
