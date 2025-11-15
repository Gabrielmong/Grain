import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store/hooks';

export function LanguageSync() {
  const { i18n } = useTranslation();
  const language = useAppSelector((state) => state.settings.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return null;
}
