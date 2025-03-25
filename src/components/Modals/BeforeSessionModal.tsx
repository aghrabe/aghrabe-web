import { useState } from "react";
import useMoodMapper from "../../hooks/useMoodMapper";
import Modal from "./Modal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function BeforeSessionModal({ isOpen, onClose }: Props) {
    const { getMoodIcon, getMoodText } = useMoodMapper();
    const [moodBefore, setMoodBefore] = useState<number>(3);

    function renderMoodSelector(
        label: string,
        value: number,
        onChange: (value: number) => void,
    ) {
        return (
            <div className={"space-y-2"}>
                <p className={"text-sm md:text-lg font-medium"}>{label}</p>
                <div className={"flex justify-between"}>
                    {[1, 2, 3, 4, 5].map((mood) => {
                        const isActive = value === mood;

                        return (
                            <div
                                key={mood}
                                className={
                                    "flex flex-col justify-center items-center"
                                }
                            >
                                <button
                                    type={"button"}
                                    onClick={() => onChange(mood)}
                                    className={`p-2 w-fit rounded-full transition-all ${isActive
                                            ? "bg-outline"
                                            : "bg-card hover:bg-outline  cursor-pointer"
                                        }`}
                                >
                                    {getMoodIcon(mood)}
                                </button>
                                <p
                                    className={`${isActive ? "text-on-surface" : "text-surface"} text-center text-sm mt-1`}
                                >
                                    {getMoodText(value)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div
                className={
                    "max-h-[80vh] space-y-4 md:space-y-6 overflow-y-auto p-0 md:p-6"
                }
            >
                {renderMoodSelector(
                    "How do you feel before playing?",
                    moodBefore,
                    setMoodBefore,
                )}
            </div>
        </Modal>
    );
}
