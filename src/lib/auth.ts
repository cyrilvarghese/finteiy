// ─── HARDCODED AUTH ──────────────────────────────────────────────────────────

export type UserRole = "parent" | "child";

export interface AppUser {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  /** For children only — true means no game history, needs onboarding */
  isNew: boolean;
}

export const USERS: AppUser[] = [
  {
    id: "parent-1",
    username: "parent",
    password: "finteiy2024",
    role: "parent",
    displayName: "Alex (Parent)",
    isNew: false,
  },
  {
    id: "child-1",
    username: "maya",
    password: "save123",
    role: "child",
    displayName: "Maya",
    isNew: false,
  },
  {
    id: "child-2",
    username: "jordan",
    password: "goal456",
    role: "child",
    displayName: "Jordan",
    isNew: true,
  },
];

/**
 * Look up a user by credentials.
 * If `expectedRole` is provided, only users of that role can match.
 */
export function authenticate(
  username: string,
  password: string,
  expectedRole?: UserRole,
): AppUser | null {
  const user = USERS.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password &&
      (expectedRole === undefined || u.role === expectedRole),
  );
  return user ?? null;
}
