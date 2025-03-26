import { ReactNode, useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Props) {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            document.body.style.overflow = "hidden"; // disable scroll
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = ""; // restore scroll
            }, 300);
            return () => clearTimeout(timer);
        }

        return () => {
            document.body.style.overflow = ""; // ensure reset on unmount
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (shouldRender) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [shouldRender, onClose]);

    if (!shouldRender) return null;

    return (
        <div className={"fixed inset-0 z-50 flex items-center justify-center"}>
            {/* overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                    isOpen ? "opacity-70" : "opacity-0"
                }`}
                onClick={onClose}
            ></div>
            {/* modal Content */}
            <div
                className={`w-[95%] md:w-[800px] bg-surface text-on-surface rounded-lg shadow-lg px-4 py-6 md:p-6 z-10 ${isOpen ? "animate-modal-open" : "animate-modal-open"}`}
            >
                {children}
            </div>
        </div>
    );
}
