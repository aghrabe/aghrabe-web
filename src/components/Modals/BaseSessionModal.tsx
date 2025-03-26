import { ReactNode } from "react";
import Button from "../Button";
import Modal from "./Modal";

interface BaseSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    submitText: string;
    isSubmitDisabled?: boolean;
    children: ReactNode;
}

export default function BaseSessionModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    submitText,
    isSubmitDisabled = false,
    children,
}: BaseSessionModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div
                className={
                    "max-h-[80vh] space-y-4 md:space-y-6 overflow-y-auto p-0 md:p-6"
                }
            >
                <div className={"flex items-center justify-between"}>
                    <h2 className={"text-xl md:text-2xl font-bold"}>{title}</h2>
                </div>

                <div className={"space-y-4 md:space-y-6"}>{children}</div>

                <div className={"flex gap-2 mt-6"}>
                    <Button
                        onClick={onClose}
                        variant={"outlined"}
                        size={"small"}
                        fullWidth
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        variant={"contained"}
                        size={"small"}
                        fullWidth
                        disabled={isSubmitDisabled}
                    >
                        {submitText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
