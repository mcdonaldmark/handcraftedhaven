"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import styles from './Toast.module.css';

const ToastContext = createContext<((message: string, type: string, duration?: number) => void) | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<any[]>([]);

    const showToast = useCallback((message: string, type: string = "success", duration = 3000) => {
        const id = Date.now();
        setToasts((prev: any) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev: any) => prev.filter((toast: any) => toast.id !== id));
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className={styles.toastContainer} >
                {toasts.map((toast: any) => (
                    <div key={toast.id} className={styles.toast} style={{ backgroundColor: toast.type === "success" ? "#27ae60" : "#e74c3c" }}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};