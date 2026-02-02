// src/pages/Settings.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Volume2, HardDrive, Keyboard, ShieldCheck, Wifi, WifiOff, RefreshCw, Wrench, Database, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { syncIpcClient } from '../services/syncIpcClient';
import { fetchChats, resetPagination } from '../app/slices/chatsSlice';

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
  const dispatch = useDispatch<AppDispatch>();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [seedResult, setSeedResult] = useState<{ chats: number; messages: number } | null>(null);
  
  const connectionStatus = useSelector((s: RootState) => s.connection.status);
  const reconnectAttempts = useSelector((s: RootState) => s.connection.reconnectAttempts);

  const handleSimulateDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await syncIpcClient.simulateDisconnect();
    } finally {
      setTimeout(() => setIsDisconnecting(false), 1000);
    }
  };

  const handleForceReconnect = async () => {
    setIsReconnecting(true);
    try {
      await syncIpcClient.forceReconnect();
    } finally {
      setTimeout(() => setIsReconnecting(false), 1000);
    }
  };

  const handleSeedDataset = async () => {
    if (!confirm('This will add 200 chats and 20,000 messages. Continue?')) return;
    
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const result = await syncIpcClient.seedLargeDataset();
      if (result.success && result.data) {
        setSeedResult(result.data);
        // Refresh chat list
        dispatch(resetPagination());
        dispatch(fetchChats({ offset: 0, limit: 50 }));
      }
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('This will delete ALL chats and messages. This cannot be undone. Continue?')) return;
    
    setIsClearing(true);
    setSeedResult(null);
    try {
      await syncIpcClient.clearAllData();
      // Refresh chat list
      dispatch(resetPagination());
      dispatch(fetchChats({ offset: 0, limit: 50 }));
    } finally {
      setIsClearing(false);
    }
  };

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

            {/* Developer Tools - Connection Testing */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-secondary">
                <Wrench size={18} />
                <p className="text-sm font-semibold">Developer Tools</p>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                {connectionStatus === 'connected' && (
                  <Wifi size={16} className="text-green-500" />
                )}
                {connectionStatus === 'reconnecting' && (
                  <RefreshCw size={16} className="text-yellow-500 animate-spin" />
                )}
                {connectionStatus === 'offline' && (
                  <WifiOff size={16} className="text-red-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{connectionStatus}</p>
                  {reconnectAttempts > 0 && (
                    <p className="text-xs text-gray-500">Attempt {reconnectAttempts}</p>
                  )}
                </div>
              </div>

              {/* Test Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSimulateDisconnect}
                  disabled={isDisconnecting || connectionStatus === 'offline'}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <WifiOff size={14} />
                  {isDisconnecting ? 'Disconnecting...' : 'Simulate Connection Drop'}
                </button>
                
                <button
                  type="button"
                  onClick={handleForceReconnect}
                  disabled={isReconnecting || connectionStatus === 'connected'}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={14} className={isReconnecting ? 'animate-spin' : ''} />
                  {isReconnecting ? 'Reconnecting...' : 'Force Reconnect'}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Use these tools to test connection recovery behavior.
              </p>
            </div>

            {/* Database Tools */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-secondary">
                <Database size={18} />
                <p className="text-sm font-semibold">Database Tools</p>
              </div>
              
              {seedResult && (
                <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                  Seeded {seedResult.chats} chats and {seedResult.messages} messages
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSeedDataset}
                  disabled={isSeeding}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Database size={14} />
                  {isSeeding ? 'Seeding (this may take a moment)...' : 'Seed Large Dataset (200 chats, 20K msgs)'}
                </button>
                
                <button
                  type="button"
                  onClick={handleClearData}
                  disabled={isClearing}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  {isClearing ? 'Clearing...' : 'Clear All Data'}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Seed large dataset to test virtualization performance.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Settings;
