import Button from "../Button";
import Modal from "./Modal";
import { useBreakpoint } from "../../context/BreakpointContext";

interface Props {
    onClose: () => void;
    onLogout: () => void;
}

export default function LogoutModal({ onClose, onLogout }: Props) {
    const { isMobile } = useBreakpoint();

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className={"space-y-6"}>
                <div className={"space-y-2"}>
                    <p className={"text-lg md:text-xl"}>
                        Are you sure you want to log out?
                    </p>
                </div>
                <div className={"space-y-2"}>
                    <Button
                        type={"button"}
                        variant={"outlined"}
                        color={"error"}
                        onClick={onLogout}
                        size={isMobile ? "small" : "medium"}
                        fullWidth
                    >
                        Confirm Logout
                    </Button>
                    <Button
                        type={"button"}
                        variant={"contained"}
                        onClick={onClose}
                        size={isMobile ? "small" : "medium"}
                        fullWidth
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
