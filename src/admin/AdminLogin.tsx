import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, BarChart3, Eye, EyeOff, FolderKanban, Layers, Lock, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import avatar from '../assets/2X2JAMES.jpg';
import { Button, Field, Input } from './components/ui';

const HIGHLIGHTS = [
  { icon: FolderKanban, text: 'Edit projects, work history and copy without touching code.' },
  { icon: Layers, text: 'Reorder or hide home-page sections and add custom blocks.' },
  { icon: BarChart3, text: 'See who is visiting, from where, and what they click.' },
];

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin';

  // Already signed in (e.g. landed here from a bookmark) -> straight to the admin.
  useEffect(() => {
    document.title = 'Sign in · Efraim James Studio';
    supabase?.auth.getSession().then(({ data }) => {
      if (data.session) navigate(redirectTo, { replace: true });
    });
  }, [navigate, redirectTo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured — VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing from this build.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] max-w-xl flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(45,212,191,0.18),transparent_40%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-inset ring-white/10">
            <img src="/Logo1.png" alt="" className="h-6 w-6 object-contain" />
          </span>
          <div>
            <p className="text-sm font-bold">Efraim James</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400">Portfolio Studio</p>
          </div>
        </div>

        <div className="relative">
          <img src={avatar} alt="" className="mb-6 h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-400/50" />
          <h1 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            Your portfolio,
            <br />
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">editable in minutes.</span>
          </h1>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Protected by Supabase Auth and row-level security.
        </p>
      </aside>

      {/* Form */}
      <main className="flex flex-1 flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <div className="flex items-center gap-2 lg:hidden">
            <img src="/Logo1.png" alt="" className="h-7 w-7 object-contain" />
            <span className="text-sm font-bold text-slate-900">Efraim James</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="mb-8">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/10">
                <Lock className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
              <p className="mt-1 text-sm text-slate-500">Sign in to manage your portfolio content and analytics.</p>
            </div>

            {error && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Field label="Email" htmlFor="email" required>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Password" htmlFor="password" required>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
            </div>

            <Button type="submit" loading={loading} className="mt-6 w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>

            <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
              Single-owner workspace. Credentials are managed in the Supabase dashboard.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
