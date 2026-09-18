export const apiKeys = [
  { id: "key_live", token: "live-token", userId: "u1", active: true },
  { id: "key_admin", token: "admin-token", userId: "u2", active: true },
  { id: "key_old", token: "revoked-token", userId: "u1", active: false },
];

export const users = [
  { id: "u1", role: "member", orgId: "org_a" },
  { id: "u2", role: "admin", orgId: "org_a" },
];

export const auditLogs: { event: string; detail: string }[] = [];

export const projects = [
  { id: "p1", createdAt: 1 },
  { id: "p2", createdAt: 2 },
  { id: "p3", createdAt: 3 },
];

export const deliveries = new Set<string>();
