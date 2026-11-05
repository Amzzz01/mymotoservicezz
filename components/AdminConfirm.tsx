import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  NotificationAudience,
  NotificationContent,
  NotificationPreview,
  NotificationSendResult,
  NotificationTab,
  NotificationType,
  describeAudience,
  describeNotificationType,
  formatAdminDateTime,
  getAdminErrorMessage,
  previewNotification,
  sendNotification,
} from '../utils/adminApi';
import { fillTemplate } from '../utils/roadTax';
import Spinner from './Spinner';

const CONFIRM_WORD = 'SEND';

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="min-h-[40px] px-3.5 py-2 flex items-center justify-between gap-3 border-b last:border-b-0 border-slate-200 dark:border-slate-700">
    <span className="text-slate-600 dark:text-slate-400">{label}</span>
    <span className="font-semibold text-right text-slate-800 dark:text-slate-100">{value}</span>
  </div>
);

interface AdminConfirmProps {
  type: NotificationType;
  content: NotificationContent;
  audience: NotificationAudience;
  openTab: NotificationTab;
  scheduleAt?: string;
  onCancel: () => void;
  onSent: (result: NotificationSendResult) => void;
}

const AdminConfirm: React.FC<AdminConfirmProps> = ({ type, content, audience, openTab, scheduleAt, onCancel, onSent }) => {
  const { t, language } = useApp();
  const [preview, setPreview] = useState<NotificationPreview | null>(null);
  const [typed, setTyped] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  // Stays the same while this sheet is open, so retrying after a lost connection can't send twice
  const sendId = useRef(crypto.randomUUID());

  useEffect(() => {
    previewNotification(audience, type, scheduleAt).then(setPreview).catch(err => {
      console.error('Failed to preview notification:', err);
      setError(getAdminErrorMessage(err, t));
    });
  }, [audience, type, scheduleAt, t]);

  const needsTyping = audience.kind === 'everyone';
  const limitReached = Boolean(preview?.isBulk && preview.usedToday >= preview.dailyLimit);
  const canSend = Boolean(preview) && preview!.people > 0 && !limitReached && !sending
    && (!needsTyping || typed.trim() === CONFIRM_WORD);

  const handleSend = async () => {
    setSending(true);
    setError('');
    try {
      const result = await sendNotification({
        sendId: sendId.current,
        type,
        content,
        audience,
        openTab,
        confirm: typed.trim(),
        scheduleAt,
      });
      onSent(result);
    } catch (err) {
      console.error('Failed to send notification:', err);
      setError(getAdminErrorMessage(err, t));
      setSending(false);
    }
  };

  const scheduleText = formatAdminDateTime(scheduleAt ?? null, language);
  const previewTitle = language === 'ms' ? content.titleMs : content.titleEn;
  const previewBody = language === 'ms' ? content.bodyMs : content.bodyEn;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 flex flex-col justify-end sm:items-center sm:justify-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full sm:max-w-md max-h-full overflow-y-auto bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl p-5 flex flex-col gap-3.5"
      >
        <h2 id="confirm-title" className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          {scheduleAt
            ? fillTemplate(t.confTitleScheduled, { date: scheduleText })
            : preview ? fillTemplate(t.confTitle, { count: String(preview.devices) }) : t.notifContinue}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{scheduleAt ? t.confScheduledNote : t.confNote}</p>

        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t.confLook}</h3>
        <div className="bg-slate-800 dark:bg-slate-900 text-slate-100 rounded-2xl px-3.5 py-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <img src="/icons/icon-96x96.png" alt="" className="w-4 h-4 rounded-full" />
            {t.appName}
          </div>
          <div className="text-[15px] font-bold break-words">{previewTitle}</div>
          <div className="text-sm text-slate-200 break-words">{previewBody}</div>
        </div>

        {!preview && !error && <div className="flex justify-center py-4"><Spinner /></div>}

        {preview && (
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
            <Row label={t.confType} value={describeNotificationType(type, t)} />
            <Row label={t.notifSendTo} value={describeAudience(audience, t)} />
            <Row label={t.audDevicesLabel} value={String(preview.devices)} />
            {scheduleAt && <Row label={t.confWhen} value={scheduleText} />}
            <Row
              label={t.confLanguages}
              value={fillTemplate(t.confLanguagesValue, { en: String(preview.languages.en), ms: String(preview.languages.ms) })}
            />
            <Row label={t.confBell} value={fillTemplate(t.audPeopleCount, { count: String(preview.people) })} />
            {preview.isBulk && (
              <Row
                label={scheduleAt ? t.confSendsLeftThatDay : t.confSendsLeft}
                value={fillTemplate(t.confSendsLeftValue, {
                  left: String(Math.max(preview.dailyLimit - preview.usedToday, 0)),
                  limit: String(preview.dailyLimit),
                })}
              />
            )}
          </div>
        )}

        {preview && preview.unknownEmails.length > 0 && (
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 break-words">
            {fillTemplate(t.confUnknown, { emails: preview.unknownEmails.join(', ') })}
          </p>
        )}
        {preview?.people === 0 && <p className="text-sm font-semibold text-red-700 dark:text-red-400" role="alert">{t.adminErrNoRecipients}</p>}
        {limitReached && <p className="text-sm font-semibold text-red-700 dark:text-red-400" role="alert">{t.adminErrLimitReached}</p>}

        {needsTyping && preview && !limitReached && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-word" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.confTypeSend}</label>
            <input
              id="confirm-word"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              value={typed}
              onChange={event => setTyped(event.target.value)}
              className="min-h-[46px] px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
            />
          </div>
        )}

        {error && <p className="text-sm font-semibold text-red-700 dark:text-red-400" role="alert">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={sending}
            className="flex-1 min-h-[50px] rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-60"
          >
            {t.adminCancel}
          </button>
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex-[2] min-h-[50px] rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {sending && <Spinner size="sm" variant="white" />}
            {scheduleAt ? t.confSchedule : t.confSendNow}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirm;
