// src/pages/Profile.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Mail, ShieldCheck, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { updateProfile } from '../auth/authSlice';

const formatDateTime = (value?: number) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
};

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);
  const authStatus = useSelector((s: RootState) => s.auth.status);
  const authError = useSelector((s: RootState) => s.auth.error);

  const [displayName, setDisplayName] = useState(user?.displayName ?? user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const initials = useMemo(() => {
    const source = user?.displayName || user?.username || 'User';
    return source.charAt(0).toUpperCase();
  }, [user?.displayName, user?.username]);

  useEffect(() => {
    setDisplayName(user?.displayName ?? user?.username ?? '');
    setEmail(user?.email ?? '');
  }, [user?.displayName, user?.email, user?.username]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(null), 2500);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-light">
        <p className="text-sm text-gray-500">Sign in to manage your profile.</p>
      </div>
    );
  }

  const handleReset = () => {
    setDisplayName(user.displayName ?? user.username);
    setEmail(user.email ?? '');
    setFormError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const result = await dispatch(updateProfile({ displayName, email }));
    if (updateProfile.fulfilled.match(result)) {
      setSuccessMessage('Profile updated successfully.');
    } else {
      const message = (result.payload as string) ?? authError ?? 'Profile update failed.';
      setFormError(message);
    }
  };

  const isSaving = authStatus === 'loading';

  return (
    <div className="flex-1 min-h-0 bg-gray-light">
      <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Profile</p>
          <h2 className="text-2xl font-semibold text-secondary">Your account details</h2>
          <p className="text-sm text-gray-500">
            Update how your name and email appear across the Secure Messenger desktop client.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="text-sm font-medium text-gray-700">Display name</label>
              <input
                className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Mail size={16} className="text-gray-400" />
                <input
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-sm">
                {formError && <p className="text-red-500">{formError}</p>}
                {!formError && successMessage && <p className="text-green-600">{successMessage}</p>}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-secondary text-white flex items-center justify-center text-lg font-semibold">
                  {initials}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400">Signed in as</p>
                  <p className="text-base font-semibold text-secondary">{user.username}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span>{user.email || 'No email on file'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span>Last sign-in: {formatDateTime(user.loggedInAt)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-secondary/5 to-primary/10 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                <ShieldCheck size={16} />
                <span>Security checklist</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>- Keep your profile name consistent with your team identity.</li>
                <li>- Use a recoverable email address for future sync updates.</li>
                <li>- Sign out when stepping away from shared devices.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
