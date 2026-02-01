// src/pages/Settings.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Volume2, HardDrive, Keyboard, ShieldCheck } from 'lucide-react';

const SETTINGS_KEY = 'smd.userSettings';

type SettingsState = {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoDownloadAttachments: boolean;
  enterToSend: boolean;
  showTypingIndicators: boolean;
};

const defaultSettings: SettingsState = {
  notificationsEnabled: true,
  soundEnabled: true,
  autoDownloadAttachments: false,
  enterToSend: true,
  showTypingIndicators: true,
};

const isSettingsState = (value: unknown): value is SettingsState => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as SettingsState;
  return [
    typeof candidate.notificationsEnabled === 'boolean',
    typeof candidate.soundEnabled === 'boolean',
    typeof candidate.autoDownloadAttachments === 'boolean',
    typeof candidate.enterToSend === 'boolean',
    typeof candidate.showTypingIndicators === 'boolean',
  ].every(Boolean);
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (isSettingsState(parsed)) {
        setSettings(parsed);
      }
    } catch {
      // ignore storage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setSavedAt(Date.now());
    } catch {
      // ignore storage errors
    }
  }, [isLoaded, settings]);

  const lastSavedLabel = useMemo(() => {
    if (!savedAt) return 'Not saved yet';
    return `Saved ${new Date(savedAt).toLocaleTimeString()}`;
  }, [savedAt]);

  const updateSetting = <K extends keyof SettingsState>(key: K) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const SettingRow = ({
    title,
    description,
    checked,
    onToggle,
    icon,
  }: {
    title: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-secondary">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-secondary">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="flex-1 min-h-0 bg-gray-light">
      <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Settings</p>
          <h2 className="text-2xl font-semibold text-secondary">Preferences and privacy</h2>
          <p className="text-sm text-gray-500">
            Tune how Secure Messenger behaves on this device. Changes save automatically.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="space-y-4">
            <SettingRow
              title="Desktop notifications"
              description="Show alerts for incoming messages when the app is running."
              checked={settings.notificationsEnabled}
              onToggle={() => updateSetting('notificationsEnabled')}
              icon={<Bell size={18} />}
            />
            <SettingRow
              title="Sound effects"
              description="Play notification sounds for new messages and mentions."
              checked={settings.soundEnabled}
              onToggle={() => updateSetting('soundEnabled')}
              icon={<Volume2 size={18} />}
            />
            <SettingRow
              title="Auto-download attachments"
              description="Automatically download files from trusted chats."
              checked={settings.autoDownloadAttachments}
              onToggle={() => updateSetting('autoDownloadAttachments')}
              icon={<HardDrive size={18} />}
            />
            <SettingRow
              title="Enter to send"
              description="Send messages with Enter and use Shift+Enter for new lines."
              checked={settings.enterToSend}
              onToggle={() => updateSetting('enterToSend')}
              icon={<Keyboard size={18} />}
            />
            <SettingRow
              title="Typing indicators"
              description="Show when contacts are typing in the active conversation."
              checked={settings.showTypingIndicators}
              onToggle={() => updateSetting('showTypingIndicators')}
              icon={<ShieldCheck size={18} />}
            />
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
              <p className="text-xs uppercase tracking-widest text-gray-400">Status</p>
              <p className="text-sm text-gray-600">{lastSavedLabel}</p>
              <button
                type="button"
                onClick={resetSettings}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-secondary hover:bg-gray-50"
              >
                Reset to defaults
              </button>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-secondary/5 to-primary/10 p-5">
              <p className="text-sm font-semibold text-secondary">Privacy checklist</p>
              <ul className="mt-3 space-y-2 text-xs text-gray-600">
                <li>- Review notification visibility on shared screens.</li>
                <li>- Disable auto-download when on public networks.</li>
                <li>- Keep typing indicators on to improve team clarity.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Settings;
