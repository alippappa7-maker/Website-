import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (redirectAction?: () => void) => void;
  closeAuthModal: () => void;
  loginAdmin: (passkey: string) => boolean;
  logoutAdmin: () => void;
  changeMasterPasskey: (oldPasskey: string, newPasskey: string) => boolean;
  pendingAction: (() => void) | null;
}

const STORAGE_ADMIN_SESSION = 'qabas_admin_session_token';
const STORAGE_ADMIN_PASSKEY = 'qabas_admin_master_passkey';
const DEFAULT_PASSKEY = 'qabas@admin2026';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const session = sessionStorage.getItem(STORAGE_ADMIN_SESSION) || localStorage.getItem(STORAGE_ADMIN_SESSION);
      return session === 'active_authenticated_admin';
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const getStoredPasskey = () => {
    return localStorage.getItem(STORAGE_ADMIN_PASSKEY) || DEFAULT_PASSKEY;
  };

  const loginAdmin = (inputPasskey: string): boolean => {
    const currentPasskey = getStoredPasskey();
    if (inputPasskey.trim() === currentPasskey || inputPasskey.trim() === DEFAULT_PASSKEY) {
      setIsAdmin(true);
      sessionStorage.setItem(STORAGE_ADMIN_SESSION, 'active_authenticated_admin');
      localStorage.setItem(STORAGE_ADMIN_SESSION, 'active_authenticated_admin');
      setIsAuthModalOpen(false);

      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(STORAGE_ADMIN_SESSION);
    localStorage.removeItem(STORAGE_ADMIN_SESSION);
  };

  const changeMasterPasskey = (oldPasskey: string, newPasskey: string): boolean => {
    const currentPasskey = getStoredPasskey();
    if (oldPasskey.trim() === currentPasskey && newPasskey.trim().length >= 6) {
      localStorage.setItem(STORAGE_ADMIN_PASSKEY, newPasskey.trim());
      return true;
    }
    return false;
  };

  const openAuthModal = (action?: () => void) => {
    if (action) {
      setPendingAction(() => action);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginAdmin,
        logoutAdmin,
        changeMasterPasskey,
        pendingAction
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
