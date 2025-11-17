import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../store/settings/settingsSlice';
import type { Language } from '../../types';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageChange = (lang: string) => {
    dispatch(setLanguage(lang as Language));
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };

  return (
    <>
      <IconButton
        onClick={handleLanguageClick}
        sx={{ color: 'text.primary' }}
        title="Change language"
      >
        <LanguageIcon />
      </IconButton>
      <Menu anchorEl={languageAnchor} open={Boolean(languageAnchor)} onClose={handleLanguageClose}>
        <MenuItem onClick={() => handleLanguageChange('en')} selected={i18n.language === 'en'}>
          English
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('es')} selected={i18n.language === 'es'}>
          Español
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('pt')} selected={i18n.language === 'pt'}>
          Português
        </MenuItem>
      </Menu>
    </>
  );
}
