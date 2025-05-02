import { createContext, FC, PropsWithChildren, useContext, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider as LibThemeProvider } from '@mui/material';
import { ThemeMode } from '../Models/Theme';
import { loadFromStorage, saveIntoStorage, StorageKey } from '../Services/Storage';

export const darkTheme = createTheme({
  palette: { mode: ThemeMode.Dark },
  components: { MuiPaper: { defaultProps: { elevation: 5 } } }
});

export const lightTheme = createTheme({
  palette: { mode: ThemeMode.Light },
  components: { MuiPaper: { defaultProps: { elevation: 2 } } }
});

export type ThemeContextProps = {
  themeMode: ThemeMode;
  onThemeMode: () => void;
};

const ThemeContext = createContext<ThemeContextProps | null>(null);

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    loadFromStorage({ key: StorageKey.ThemeMode, fallback: ThemeMode.Light })
  );

  const onThemeMode = () => {
    const mode = themeMode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
    setThemeMode(mode);
    saveIntoStorage({ key: StorageKey.ThemeMode, data: mode });
  };

  return (
    <ThemeContext.Provider value={{ themeMode, onThemeMode }}>
      <LibThemeProvider theme={themeMode === ThemeMode.Light ? lightTheme : darkTheme}>
        <CssBaseline />
        {children}
      </LibThemeProvider>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const event = useContext(ThemeContext);
  if (event == null) {
    throw new Error('useTheme() called outside of a ThemeProvider?');
  }
  return event;
};

export { ThemeProvider, useTheme };
