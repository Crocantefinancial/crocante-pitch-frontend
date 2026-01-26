"use client";

import Toast, { ToastType } from "@/components/core/toast";
import { createContext, useContext, useState } from "react";

const ToastContext = createContext<{
    showToast: (message: string, type: ToastType) => void;
    hideToast: () => void;
} | null>(null);

export function ToastProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<ToastType>(ToastType.INFO);

    const showToastCallback = (message: string, type: ToastType) => {
        setShowToast(true);
        setToastMessage(message);
        setToastType(type);
    }

    const hideToastCallback = () => {
        setShowToast(false);
    }
    return (
        <ToastContext.Provider value={{ showToast: showToastCallback, hideToast: hideToastCallback }}>
            <Toast
                show={showToast}
                message={toastMessage}
                type={toastType}
                onClose={hideToastCallback}
                duration={5000}
            />
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

