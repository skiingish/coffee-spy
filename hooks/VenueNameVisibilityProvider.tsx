"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

interface VenueNameVisibilityContextValue {
  showVenueNames: boolean;
  toggleVenueNames: () => void;
  setShowVenueNames: (value: boolean) => void;
}

const VenueNameVisibilityContext = createContext<VenueNameVisibilityContextValue | undefined>(undefined);

const STORAGE_KEY = 'showVenueNames';

export const VenueNameVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [showVenueNames, setShowVenueNames] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setShowVenueNames(stored === 'true');
      }
    } catch {
    
    } finally {
      setLoaded(true);
    }
  }, []);

  const persist = (value: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
    }
  };

  const toggleVenueNames = useCallback(() => {
    setShowVenueNames(prev => {
      const next = !prev;
      persist(next);
      return next;
    });
  }, []);

  const setAndPersist = useCallback((value: boolean) => {
    setShowVenueNames(value);
    persist(value);
  }, []);

  const value: VenueNameVisibilityContextValue = {
    showVenueNames,
    toggleVenueNames,
    setShowVenueNames: setAndPersist,
  };

  
  if (!loaded) {
    return null;
  }

  return (
    <VenueNameVisibilityContext.Provider value={value}>
      {children}
    </VenueNameVisibilityContext.Provider>
  );
};

export const useVenueNameVisibility = () => {
  const ctx = useContext(VenueNameVisibilityContext);
  if (!ctx) {
    throw new Error('useVenueNameVisibility must be used within a VenueNameVisibilityProvider');
  }
  return ctx;
};
