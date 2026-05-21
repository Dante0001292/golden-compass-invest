import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LogOut,
  Shield,
  Users,
  UserPlus,
  Trash2,
  Pencil,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import type { KumoUser } from "@/config/users";
import { isAdminLogin } from "@/lib/auth";
import { getAllUsers, createUser, deleteUser, updateUser, getSiteSetting, setSiteSetting } from "@/server-actions";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Admin Panel — Kumo Capital" }],
  }),
});

// ─── Login gate ───────────────────────────────────────────────────────────────

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (isAdminLogin(username, password)) {
      setAuthed(true);
      setError("");
    } else {
      setError("Invalid username or password.");
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-[var(--gradient-radial-gold)] opacity-40" />
        <div className="relative z-10 w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-2">
            <span className="grid size-12 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <Shield className="size-5 text-primary-foreground" />
            </span>
            <p className="font-display text-xl tracking-tight">Admin Login</p>
            <p className="text-xs text-muted-foreground">Kumo Capital Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 rounded-3xl glass-gold p-8">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full rounded-2xl glass px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-[color:var(--loss)]">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-gold py-3 text-sm font-medium text-primary-foreground shadow-gold transition hover:opacity-90"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminPanel onLogout={() => setAuthed(false)} />;
}

// ─── Admin panel ──────────────────────────────────────────────────────────────

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<KumoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "add">("users");

  // Create user form state
  const [form, setForm] = useState({ username: "", displayName: "", password: "", balance: "" });
  const [showFormPw, setShowFormPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingUserBalance, setSavingUserBalance] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingBalance, setEditingBalance] = useState("");
  const [siteSaltBalance, setSiteSaltBalance] = useState("15623321");
  const [savingSaltBalance, setSavingSaltBalance] = useState(false);
  const [siteSettingsLoading, setSiteSettingsLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function fetchUsers() {
    setLoading(true);
    setFetchError(null);
    try {
      const fetched = await getAllUsers();
      setUsers(Array.isArray(fetched) ? fetched : []);
    } catch (err: any) {
      console.error("fetchUsers error:", err);
      setFetchError(err?.message || "Failed to load users. Check your Supabase environment variables in Vercel.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); fetchSiteSaltBalance(); }, []);

  async function fetchSiteSaltBalance() {
    setSiteSettingsLoading(true);
    try {
      const result = await getSiteSetting({ data: { key: "salt_balance" } });
      if (result?.value !== null && result?.value !== undefined) {
        setSiteSaltBalance(String(result.value));
      }
    } catch (err: any) {
      console.error("fetchSiteSaltBalance error:", err);
    } finally {
      setSiteSettingsLoading(false);
    }
  }

  async function handleSaveSaltBalance() {
    const bal = parseFloat(siteSaltBalance);
    if (isNaN(bal) || bal < 0) {
      showToast("error", "Please enter a valid site balance.");
      return;
    }
    setSavingSaltBalance(true);
    const result = await setSiteSetting({ data: { key: "salt_balance", value: bal } });
    setSavingSaltBalance(false);
    if (result.success) {
      showToast("success", "Salt-San investment balance updated.");
    } else {
      showToast("error", result.error || "Failed to save site balance.");
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.displayName || !form.password || !form.balance) {
      showToast("error", "All fields are required.");
      return;
    }
    const bal = parseFloat(form.balance);
    if (isNaN(bal) || bal < 0) {
      showToast("error", "Please enter a valid balance.");
      return;
    }
    setSubmitting(true);
    const result = await createUser({
      data: {
        username: form.username,
        displayName: form.displayName,
        password: form.password,
        balance: bal,
      },
    });
    setSubmitting(false);
    console.log("[admin] createUser result:", result);
    if (result.success) {
      showToast("success", `User "${form.displayName}" created successfully!`);
      setForm({ username: "", displayName: "", password: "", balance: "" });
      setActiveTab("users");
      fetchUsers();
    } else {
      showToast("error", result.error || "Failed to create user.");
    }
  }

  async function handleDeleteUser(user: KumoUser) {
    if (!confirm(`Delete user "${user.displayName}" (@${user.username})? This cannot be undone.`)) return;
    const result = await deleteUser({ data: { id: user.id } });
    if (result.success) {
      showToast("success", `User "${user.displayName}" deleted.`);
      fetchUsers();
    } else {
      showToast("error", result.error || "Failed to delete user.");
    }
  }

  function startEditingUser(user: KumoUser) {
    setEditingUserId(user.id);
    setEditingBalance(String(Math.round(user.balance)));
  }

  function cancelEditingUser() {
    setEditingUserId(null);
    setEditingBalance("");
  }

  async function handleSaveUserBalance(user: KumoUser) {
    if (!editingUserId) return;
    const bal = parseFloat(editingBalance);
    if (isNaN(bal) || bal < 0) {
      showToast("error", "Please enter a valid balance.");
      return;
    }
    setSavingUserBalance(true);
    const result = await updateUser({ data: { id: user.id, balance: bal } });
    setSavingUserBalance(false);
    if (result.success) {
      showToast("success", `Balance for ${user.displayName} updated.`);
      setEditingUserId(null);
      setEditingBalance("");
      fetchUsers();
    } else {
      showToast("error", result.error || "Failed to update balance.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[50vh] bg-[var(--gradient-radial-gold)] opacity-30" />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm shadow-elev transition-all ${
            toast.type === "success"
              ? "bg-[oklch(0.78_0.16_150)]/20 text-[color:var(--success)] border border-[color:var(--success)]/30"
              : "bg-[oklch(0.65_0.2_25)]/20 text-[color:var(--loss)] border border-[color:var(--loss)]/30"
          }`}
        >
          {toast.type === "success"
            ? <CheckCircle2 className="size-4 shrink-0" />
            : <XCircle className="size-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <Shield className="size-4 text-primary-foreground" />
            </span>
            <div>
              <p className="font-display text-base leading-none">Kumo Capital</p>
              <p className="text-[10px] text-gold">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => { onLogout(); navigate({ to: "/login" }); }}
            className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <LogOut className="size-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 py-10">

        {/* Tab switcher */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === "users" ? "bg-gradient-gold text-primary-foreground shadow-gold" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-4" /> All Users
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === "add" ? "bg-gradient-gold text-primary-foreground shadow-gold" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="size-4" /> Add New User
          </button>
        </div>

        {activeTab === "users" && (
          <section className="mb-8 rounded-3xl glass p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Site Portfolio</p>
                <h2 className="font-display text-2xl tracking-tight">Salt-San Investment</h2>
              </div>
              <span className="rounded-full bg-[oklch(0.78_0.16_150)]/10 px-3 py-1 text-[11px] text-[color:var(--success)]">
                Visible to all users
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground">Current salt balance (¥)</label>
                <input
                  type="number"
                  min="0"
                  value={siteSaltBalance}
                  onChange={(e) => setSiteSaltBalance(e.target.value)}
                  className="w-full rounded-2xl glass px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60"
                />
              </div>
              <button
                onClick={handleSaveSaltBalance}
                disabled={siteSettingsLoading || savingSaltBalance}
                className="rounded-full bg-gradient-gold px-5 py-3 text-sm font-medium text-primary-foreground shadow-gold transition hover:opacity-90 disabled:opacity-60"
              >
                {savingSaltBalance ? "Saving…" : "Save site balance"}
              </button>
            </div>
            {siteSettingsLoading && (
              <p className="mt-3 text-sm text-muted-foreground">Loading current site balance…</p>
            )}
          </section>
        )}

        {/* ── Users list ── */}
        {activeTab === "users" && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl glass-gold">
                  <Users className="size-4 text-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">Registered Users</p>
                  <h2 className="font-display text-2xl tracking-tight">
                    {loading ? "Loading…" : `${users.length} user${users.length !== 1 ? "s" : ""}`}
                  </h2>
                </div>
              </div>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-50"
              >
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl glass">
              {/* Table header */}
              <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/5 px-5 py-3 text-[11px] uppercase tracking-widest text-muted-foreground sm:grid">
                <span>Display Name</span>
                <span>Username</span>
                <span>Password</span>
                <span>Balance</span>
                <span></span>
              </div>

              {loading ? (
                <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                  <RefreshCw className="mx-auto mb-3 size-5 animate-spin opacity-50" />
                  Loading users…
                </div>
              ) : fetchError ? (
                <div className="px-5 py-12 text-center text-sm">
                  <XCircle className="mx-auto mb-3 size-6 text-[color:var(--loss)] opacity-70" />
                  <p className="font-medium text-[color:var(--loss)]">Could not connect to database</p>
                  <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">{fetchError}</p>
                  <button onClick={fetchUsers} className="mt-4 rounded-full glass px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition">
                    Try Again
                  </button>
                </div>
              ) : users.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No users yet. Create your first user using the <strong>"Add New User"</strong> tab above.
                </div>
              ) : (
                users.map((u) => {
                  const isEditing = editingUserId === u.id;
                  return (
                    <div
                      key={u.id}
                      className="grid grid-cols-2 gap-3 border-b border-white/5 px-5 py-4 last:border-0 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] items-center transition hover:bg-white/[0.02]"
                    >
                      <p className="text-sm font-medium">{u.displayName}</p>
                      <p className="text-sm text-muted-foreground">@{u.username}</p>
                      <p className="font-mono text-sm text-muted-foreground">{u.password}</p>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={editingBalance}
                          onChange={(e) => setEditingBalance(e.target.value)}
                          className="w-full rounded-2xl glass px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60"
                        />
                      ) : (
                        <p className="text-sm text-[color:var(--success)]">¥{u.balance.toLocaleString("ja-JP")}</p>
                      )}
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveUserBalance(u)}
                              disabled={savingUserBalance}
                              className="rounded-full bg-gradient-gold px-3 py-2 text-[11px] font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                            >
                              {savingUserBalance ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={cancelEditingUser}
                              className="rounded-full glass px-3 py-2 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditingUser(u)}
                              className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                              title="Edit balance"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-[color:var(--loss)]/10 hover:text-[color:var(--loss)]"
                              title="Delete user"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* ── Create user form ── */}
        {activeTab === "add" && (
          <section className="max-w-lg">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl glass-gold">
                <UserPlus className="size-4 text-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">New Account</p>
                <h2 className="font-display text-2xl tracking-tight">Create User</h2>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 rounded-3xl glass-gold p-8">
              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground">Display Name <span className="text-[color:var(--loss)]">*</span></label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                  placeholder="e.g. John Smith"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground">Username <span className="text-[color:var(--loss)]">*</span></label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value.replace(/\s/g, "").toLowerCase() }))}
                  placeholder="e.g. johnsmith"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">Lowercase letters and numbers only. Used to log in.</p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground">Password <span className="text-[color:var(--loss)]">*</span></label>
                <div className="relative">
                  <input
                    type={showFormPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full rounded-2xl glass px-4 py-3 pr-10 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showFormPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground">Initial Balance (¥) <span className="text-[color:var(--loss)]">*</span></label>
                <input
                  type="number"
                  min="0"
                  value={form.balance}
                  onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))}
                  placeholder="e.g. 1000000"
                  className="w-full rounded-2xl glass px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gradient-gold py-3 text-sm font-medium text-primary-foreground shadow-gold transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? <><RefreshCw className="size-4 animate-spin" /> Creating…</> : <><UserPlus className="size-4" /> Create User</>}
              </button>
            </form>
          </section>
        )}

      </main>
    </div>
  );
}
