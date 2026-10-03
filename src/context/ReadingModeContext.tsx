import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ReadingTheme = 'cosmic' | 'sepia' | 'dark' | 'light';
export type ReadingFont = 'cairo' | 'tajawal' | 'amiri';

interface ReadingModeContextType {
  isReadingMode: boolean;
  enterReadingMode: () => void;
  exitReadingMode: () => void;
  toggleReadingMode: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  theme: ReadingTheme;
  setTheme: (theme: ReadingTheme) => void;
  fontFamily: ReadingFont;
  setFontFamily: (font: ReadingFont) => void;
}

const ReadingModeContext = createContext<ReadingModeContextType | undefined>(undefined);

export const ReadingModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReadingMode, setIsReadingMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(20); // Default comfortable font size
  const [lineHeight, setLineHeight] = useState<number>(2.2); // Default relaxed line height
  const [theme, setTheme] = useState<ReadingTheme>('cosmic');
  const [fontFamily, setFontFamily] = useState<ReadingFont>('tajawal');

  const enterReadingMode = useCallback(() => {
    setIsReadingMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const exitReadingMode = useCallback(() => {
    setIsReadingMode(false);
  }, []);

  const toggleReadingMode = useCallback(() => {
    setIsReadingMode((prev) => !prev);
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 2, 32));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 2, 16));
  }, []);

  // Handle ESC key to exit reading mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isReadingMode) {
        exitReadingMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReadingMode, exitReadingMode]);

  return (
    <ReadingModeContext.Provider
      value={{
        isReadingMode,
        enterReadingMode,
        exitReadingMode,
        toggleReadingMode,
        fontSize,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        lineHeight,
        setLineHeight,
        theme,
        setTheme,
        fontFamily,
        setFontFamily,
      }}
    >
      {children}
    </ReadingModeContext.Provider>
  );
};

export const useReadingMode = () => {
  const context = useContext(ReadingModeContext);
  if (!context) {
    throw new Error('useReadingMode must be used within a ReadingModeProvider');
  }
  return context;
};
