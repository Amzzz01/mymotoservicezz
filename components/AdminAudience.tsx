import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationAudience, getAudienceCounts } from '../utils/adminApi';
import { fillTemplate } from '../utils/roadTax';
import { Language } from '../translations';
import AdminHeader from './AdminHeader';

const parseEmails = (text: string) => text.split(/[\s,;]+/).filter(Boolean);

const Option: React.FC<{
  selected: boolean;
  onSelect: () => void;
  label: string;
  hint?: string;
}> = ({ selected, onSelect, label, hint }) => (
  <label className={`min-h-[46px] px-3 flex items-center gap-2.5 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-100 ${selected
    ? 'border-2 border-cyan-600 bg-cyan-50 dark:bg-cyan-900/30'
    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
  }`}>
    <input type="radio" name="audience" checked={selected} onChange={onSelect} className="w-[18px] h-[18px] accent-cyan-600" />
    <span className="flex-grow">{label}</span>
    {hint && <span className="text-sm font-normal text-slate-600 dark:text-slate-400">{hint}</span>}
  </label>
);

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mt-2">{children}</h2>
);

interface AdminAudienceProps {
  value: NotificationAudience;
  onChange: (audience: NotificationAudience) => void;
  onBack: () => void;
}

const AdminAudience: React.FC<AdminAudienceProps> = ({ value, onChange, onBack }) => {
  const { t } = useApp();
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [emailsText, setEmailsText] = useState(value.kind === 'users' ? value.emails.join('\n') : '');
  const [vehicleText, setVehicleText] = useState(value.kind === 'vehicleType' ? value.text : '');
  const [language, setLanguage] = useState<Language>(value.kind === 'language' ? value.language : 'en');

  useEffect(() => {
    // Only a helpful hint: the confirm step always shows the real count before anything is sent
    getAudienceCounts().then(setCounts).catch(err => console.error('Failed to load audience counts:', err));
  }, []);

  const deviceHint = (key: string) =>
    counts ? fillTemplate(t.audDevices, { count: String(counts[key] ?? 0) }) : '';

  const simple = (kind: 'everyone' | 'roadTaxExpired' | 'roadTaxSoon' | 'newUsers' | 'inactive' | 'noVehicle', label: string) => (
    <Option
      selected={value.kind === kind}
      onSelect={() => onChange({ kind })}
      label={label}
      hint={deviceHint(kind)}
    />
  );

  const inputClass = 'w-full px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100';

  return (
    <>
      <AdminHeader title={t.notifSendTo} onBack={onBack} />
      <fieldset className="max-w-xl mx-auto p-4 flex flex-col gap-1.5">
        <legend className="sr-only">{t.notifSendTo}</legend>

        <Section>{t.audSectionPeople}</Section>
        {simple('everyone', t.audEveryone)}
        <Option
          selected={value.kind === 'users'}
          onSelect={() => onChange({ kind: 'users', emails: parseEmails(emailsText) })}
          label={t.audPick}
          hint={t.audPickHint}
        />
        {value.kind === 'users' && (
          <div className="flex flex-col gap-1 py-1">
            <label htmlFor="audience-emails" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.audEmailsLabel}</label>
            <textarea
              id="audience-emails"
              rows={3}
              autoComplete="off"
              value={emailsText}
              onChange={event => {
                setEmailsText(event.target.value);
                onChange({ kind: 'users', emails: parseEmails(event.target.value) });
              }}
              className={`${inputClass} py-2.5 resize-none`}
            />
          </div>
        )}

        <Section>{t.audSectionRoadTax}</Section>
        {simple('roadTaxExpired', t.audRoadTaxExpired)}
        {simple('roadTaxSoon', t.audRoadTaxSoon)}

        <Section>{t.audSectionActivity}</Section>
        {simple('newUsers', t.audNew)}
        {simple('inactive', t.audInactive)}
        {simple('noVehicle', t.audNoVehicle)}

        <Section>{t.audSectionVehicle}</Section>
        <Option
          selected={value.kind === 'vehicleType'}
          onSelect={() => onChange({ kind: 'vehicleType', text: vehicleText.trim() })}
          label={t.audVehicle}
          hint={t.audVehicleHint}
        />
        {value.kind === 'vehicleType' && (
          <div className="flex flex-col gap-1 py-1">
            <label htmlFor="audience-vehicle" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.audVehicle}</label>
            <input
              id="audience-vehicle"
              type="text"
              maxLength={40}
              autoComplete="off"
              value={vehicleText}
              onChange={event => {
                setVehicleText(event.target.value);
                onChange({ kind: 'vehicleType', text: event.target.value.trim() });
              }}
              className={`${inputClass} min-h-[46px]`}
            />
          </div>
        )}
        <Option
          selected={value.kind === 'language'}
          onSelect={() => onChange({ kind: 'language', language })}
          label={t.audLanguage}
          hint={value.kind === 'language' ? deviceHint(`language_${language}`) : t.audLanguageHint}
        />
        {value.kind === 'language' && (
          <div className="grid grid-cols-2 gap-1.5 py-1">
            {(['en', 'ms'] as Language[]).map(option => (
              <button
                key={option}
                type="button"
                aria-pressed={language === option}
                onClick={() => {
                  setLanguage(option);
                  onChange({ kind: 'language', language: option });
                }}
                className={`min-h-[44px] rounded-lg text-sm ${language === option
                  ? 'border-2 border-cyan-600 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-900 dark:text-cyan-200 font-bold'
                  : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold'
                }`}
              >
                {option === 'en' ? 'English' : 'Bahasa Melayu'}
              </button>
            ))}
          </div>
        )}
        <div className="min-h-[46px] px-3 flex items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex-grow">{t.audServiceOverdue}</span>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">{t.audLater}</span>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-3 min-h-[48px] rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold"
        >
          {t.audDone}
        </button>
      </fieldset>
    </>
  );
};

export default AdminAudience;
