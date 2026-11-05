import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import {
  NotificationAudience,
  NotificationContent,
  NotificationTab,
  NotificationType,
  describeAudience,
  getAdminErrorMessage,
  sendTestNotification,
} from '../utils/adminApi';
import { registerPushToken } from '../utils/pushTokens';
import { fillTemplate } from '../utils/roadTax';
import AdminAudience from './AdminAudience';
import AdminConfirm from './AdminConfirm';
import AdminHeader from './AdminHeader';

const MAX_TITLE_LENGTH = 60; // Matches the server's limits
const MAX_BODY_LENGTH = 200;
const EMPTY_CONTENT: NotificationContent = { titleEn: '', bodyEn: '', titleMs: '', bodyMs: '' };

interface AdminComposeProps {
  initialEmail?: string;
  onBack: () => void;
  onSent: (result: { people: number; attempted: number }) => void;
}

const AdminCompose: React.FC<AdminComposeProps> = ({ initialEmail, onBack, onSent }) => {
  const { t, language } = useApp();
  const { currentUser } = useAuth();
  const [view, setView] = useState<'form' | 'audience'>('form');
  const [type, setType] = useState<NotificationType>('tip');
  const [content, setContent] = useState(EMPTY_CONTENT);
  const [audience, setAudience] = useState<NotificationAudience>(
    initialEmail ? { kind: 'users', emails: [initialEmail] } : { kind: 'everyone' }
  );
  const [openTab, setOpenTab] = useState<NotificationTab>('overview');
  const [showConfirm, setShowConfirm] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testError, setTestError] = useState('');
  const [needsAlerts, setNeedsAlerts] = useState(false);

  const contentReady = useMemo(() => (Object.values(content) as string[]).every(value => value.trim()), [content]);
  const audienceReady =
    (audience.kind !== 'users' || audience.emails.length > 0) &&
    (audience.kind !== 'vehicleType' || audience.text.length > 0);

  const setField = (field: keyof NotificationContent, value: string) =>
    setContent(current => ({ ...current, [field]: value }));

  const handleTest = async () => {
    setTesting(true);
    setTestMessage('');
    setTestError('');
    setNeedsAlerts(false);
    try {
      const { devices } = await sendTestNotification(content, openTab);
      setTestMessage(fillTemplate(t.notifTestSent, { count: String(devices) }));
    } catch (err: any) {
      console.error('Test notification failed:', err);
      setTestError(getAdminErrorMessage(err, t));
      setNeedsAlerts(err?.message === 'no-devices');
    } finally {
      setTesting(false);
    }
  };

  // Admin accounts often have no vehicle, so they may never have been asked for permission
  const handleEnableAlerts = async () => {
    setTestError('');
    try {
      const permission = 'Notification' in window ? await Notification.requestPermission() : 'denied';
      if (permission !== 'granted' || !currentUser) {
        setTestError(t.notifAlertsBlocked);
        return;
      }
      await registerPushToken(currentUser.uid, language);
      setNeedsAlerts(false);
      setTestMessage(t.notifAlertsOn);
    } catch (err) {
      console.error('Failed to turn on alerts:', err);
      setTestError(t.notifAlertsBlocked);
    }
  };

  if (view === 'audience') {
    return <AdminAudience value={audience} onChange={setAudience} onBack={() => setView('form')} />;
  }

  const inputClass = 'px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100';
  const labelClass = 'text-sm font-semibold text-slate-700 dark:text-slate-300';

  const languageBlock = (
    heading: string,
    titleLabel: string,
    messageLabel: string,
    titleField: keyof NotificationContent,
    bodyField: keyof NotificationContent,
    idPrefix: string
  ) => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col gap-2">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{heading}</h2>
      <label htmlFor={`${idPrefix}-title`} className={labelClass}>{titleLabel}</label>
      <input
        id={`${idPrefix}-title`}
        type="text"
        maxLength={MAX_TITLE_LENGTH}
        value={content[titleField]}
        onChange={event => setField(titleField, event.target.value)}
        className={`${inputClass} min-h-[44px]`}
      />
      <label htmlFor={`${idPrefix}-body`} className={labelClass}>{messageLabel}</label>
      <textarea
        id={`${idPrefix}-body`}
        rows={2}
        maxLength={MAX_BODY_LENGTH}
        value={content[bodyField]}
        onChange={event => setField(bodyField, event.target.value)}
        className={`${inputClass} py-2.5 resize-none`}
      />
    </div>
  );

  return (
    <>
      <AdminHeader title={t.adminNewNotification} onBack={onBack} />
      <div className="max-w-xl mx-auto p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>{t.confType}</span>
          <div className="grid grid-cols-2 gap-1.5">
            {([['tip', t.notifTypeTip], ['update', t.notifTypeUpdate]] as [NotificationType, string][]).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={type === id}
                onClick={() => setType(id)}
                className={`min-h-[44px] rounded-lg text-sm ${type === id
                  ? 'border-2 border-cyan-600 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-900 dark:text-cyan-200 font-bold'
                  : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {languageBlock('English', 'Title', 'Message', 'titleEn', 'bodyEn', 'en')}
        {languageBlock('Bahasa Melayu', 'Tajuk', 'Mesej', 'titleMs', 'bodyMs', 'ms')}

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100">
          <button
            type="button"
            onClick={() => setView('audience')}
            className="w-full min-h-[48px] px-3.5 flex items-center justify-between gap-3 text-left border-b border-slate-200 dark:border-slate-700"
          >
            {t.notifSendTo}
            <span className="font-normal text-right text-slate-600 dark:text-slate-400 break-words min-w-0">{describeAudience(audience, t)} ›</span>
          </button>
          <div className="min-h-[48px] px-3.5 flex items-center justify-between gap-3">
            <label htmlFor="notification-tab">{t.notifOpens}</label>
            <select
              id="notification-tab"
              value={openTab}
              onChange={event => setOpenTab(event.target.value as NotificationTab)}
              className="min-h-[40px] px-2 rounded-lg font-normal bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
            >
              <option value="overview">{t.overview}</option>
              <option value="analytics">{t.analytics}</option>
              <option value="mileage">{t.mileage}</option>
              <option value="reminders">{t.reminders}</option>
            </select>
          </div>
        </div>

        {testMessage && <p className="text-sm font-semibold text-green-800 dark:text-green-400" role="status">{testMessage}</p>}
        {testError && <p className="text-sm font-semibold text-red-700 dark:text-red-400" role="alert">{testError}</p>}
        {needsAlerts && (
          <button
            type="button"
            onClick={handleEnableAlerts}
            className="min-h-[46px] rounded-lg bg-violet-700 hover:bg-violet-600 text-white text-sm font-bold"
          >
            {t.notifEnableAlerts}
          </button>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleTest}
            disabled={!contentReady || testing}
            className="flex-1 min-h-[48px] rounded-lg border border-cyan-600 text-cyan-800 dark:text-cyan-300 text-sm font-bold hover:bg-cyan-50 dark:hover:bg-cyan-900/30 disabled:opacity-50"
          >
            {t.notifTest}
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={!contentReady || !audienceReady}
            className="flex-1 min-h-[48px] rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold disabled:opacity-50"
          >
            {t.notifContinue}
          </button>
        </div>
      </div>

      {showConfirm && (
        <AdminConfirm
          type={type}
          content={content}
          audience={audience}
          openTab={openTab}
          onCancel={() => setShowConfirm(false)}
          onSent={onSent}
        />
      )}
    </>
  );
};

export default AdminCompose;
