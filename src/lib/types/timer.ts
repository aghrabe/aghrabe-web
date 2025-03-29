export type TimerStatus =
    | "idle"
    | "wantToStart"
    | "running"
    | "paused"
    | "wantToEnd"
    | "ended";

export interface TimerContextState {
    elapsed: number;
    status: TimerStatus;
}

export type TimerAction =
    | { type: "INIT"; payload: TimerContextState }
    | { type: "INCREMENT" }
    | { type: "SET_ELAPSED"; payload: number }
    | { type: "SET_STATUS"; payload: TimerStatus }
    | { type: "RESET"; payload: TimerContextState };

export interface TimerControlActions {
    resetToIdle: () => void;
    prepareForStart: () => void;
    prepareForEnd: () => void;
    updateElapsedTime: (elapsed: number) => void;
    beginTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    endTimer: () => void;
}
