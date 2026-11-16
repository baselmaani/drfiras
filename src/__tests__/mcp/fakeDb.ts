// A tiny in-memory stand-in for the Prisma client, enough for the MCP write layer and OAuth code.
// Supports equality, `in`, `notIn`, `contains`, `gt` and `OR` filters, and auto-increment ids.
type Row = Record<string, unknown>;
type Where = Record<string, unknown>;

function matches(row: Row, where: Where | undefined): boolean {
  if (!where) return true;
  return Object.entries(where).every(([key, cond]) => {
    if (key === "OR") return (cond as Where[]).some((w) => matches(row, w));
    const value = row[key];
    if (cond !== null && typeof cond === "object" && !(cond instanceof Date) && !Array.isArray(cond)) {
      const c = cond as Record<string, unknown>;
      if ("in" in c) return (c.in as unknown[]).includes(value);
      if ("notIn" in c) return !(c.notIn as unknown[]).includes(value);
      if ("contains" in c) {
        const needle = String(c.contains);
        const hay = String(value ?? "");
        return c.mode === "insensitive" ? hay.toLowerCase().includes(needle.toLowerCase()) : hay.includes(needle);
      }
      if ("gt" in c) return value instanceof Date && value > (c.gt as Date);
      return false;
    }
    // Prisma returns null for unset optional columns.
    return cond === null ? value == null : value === cond;
  });
}

function table(opts: { stringIds?: boolean; timestamps?: boolean } = {}) {
  let rows: Row[] = [];
  let nextId = 1;
  const find = (where: Where) => rows.find((r) => matches(r, where)) ?? null;
  const stamp = (data: Row, creating: boolean): Row =>
    opts.timestamps === false
      ? data
      : { ...(creating ? { createdAt: new Date() } : {}), ...data, updatedAt: new Date() };
  const api = {
    rows: () => rows,
    reset: () => {
      rows = [];
      nextId = 1;
    },
    findUnique: async ({ where, include }: { where: Where; include?: Where }) => {
      const row = find(where);
      if (row && include?.client) return { ...row, client: { name: "Test client" } };
      return row ? { ...row } : null;
    },
    findFirst: async ({ where }: { where: Where }) => find(where),
    findMany: async (args: { where?: Where; include?: Where; orderBy?: unknown; skip?: number; take?: number } = {}) => {
      let hit = rows.filter((r) => matches(r, args.where));
      const order = (Array.isArray(args.orderBy) ? args.orderBy[0] : args.orderBy) as Record<string, string> | undefined;
      if (order) {
        const [field, dir] = Object.entries(order)[0];
        // Newest-first among equal timestamps means reverse insertion order.
        if (dir === "desc") hit = [...hit].reverse();
        hit = [...hit].sort((a, b) => {
          const x = a[field] as number | Date, y = b[field] as number | Date;
          return x === y || +x === +y ? 0 : (x > y ? 1 : -1) * (dir === "desc" ? -1 : 1);
        });
      }
      hit = hit.slice(args.skip ?? 0, args.take ? (args.skip ?? 0) + args.take : undefined);
      return hit.map((r) => (args.include?.client ? { ...r, client: { name: "Test client" } } : { ...r }));
    },
    count: async (args: { where?: Where } = {}) => rows.filter((r) => matches(r, args.where)).length,
    create: async ({ data }: { data: Row }) => {
      const id = data.id ?? (opts.stringIds ? `id${nextId++}` : nextId++);
      if (typeof id === "number" && id >= nextId) nextId = id + 1;
      if (rows.some((r) => r.id === id)) throw Object.assign(new Error("dup"), { code: "P2002" });
      for (const unique of ["slug", "key", "url", "codeHash", "accessHash", "refreshHash"])
        if (data[unique] !== undefined && rows.some((r) => r[unique] === data[unique]))
          throw Object.assign(new Error("dup"), { code: "P2002" });
      const row = stamp({ ...data, id }, true);
      rows.push(row);
      return { ...row };
    },
    update: async ({ where, data }: { where: Where; data: Row }) => {
      const row = find(where);
      if (!row) throw Object.assign(new Error("missing"), { code: "P2025" });
      Object.assign(row, stamp(data, false));
      return { ...row };
    },
    updateMany: async ({ where, data }: { where: Where; data: Row }) => {
      const hit = rows.filter((r) => matches(r, where));
      hit.forEach((r) => Object.assign(r, data));
      return { count: hit.length };
    },
    delete: async ({ where }: { where: Where }) => {
      const row = find(where);
      if (!row) throw Object.assign(new Error("missing"), { code: "P2025" });
      rows = rows.filter((r) => r !== row);
      return row;
    },
    deleteMany: async ({ where }: { where: Where }) => {
      const before = rows.length;
      rows = rows.filter((r) => !matches(r, where));
      return { count: before - rows.length };
    },
    upsert: async ({ where, update, create }: { where: Where; update: Row; create: Row }) => {
      const row = find(where);
      if (row) return api.update({ where, data: update });
      return api.create({ data: create });
    },
  };
  return api;
}

export function createFakeDb() {
  const db = {
    post: table(),
    service: table(),
    servicePrice: table(),
    beforeAfter: table(),
    galleryImage: table(),
    menuItem: table(),
    mediaFolder: table(),
    mediaFile: table(),
    siteSetting: table(),
    mcpClient: table({ stringIds: true }),
    mcpAuthCode: table({ stringIds: true }),
    mcpToken: table({ stringIds: true }),
    mcpAuditLog: table({ stringIds: true }),
    $transaction: async (ops: Promise<unknown>[]) => Promise.all(ops),
    reset() {
      for (const t of Object.values(db)) if (typeof t === "object" && "reset" in t) t.reset();
    },
  };
  return db;
}
