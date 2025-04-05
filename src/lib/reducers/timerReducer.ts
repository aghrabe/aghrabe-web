import { TimerAction, TimerContextState } from "../types/timer";

export default function timerReducer(
    state: TimerContextState,
    action: TimerAction,
): TimerContextState {
    switch (action.type) {
        case "INIT":
            return { ...state, ...action.payload };
        case "INCREMENT":
            return { ...state, elapsed: state.elapsed + 1 };
        case "SET_ELAPSED":
            return { ...state, elapsed: action.payload };
        case "SET_STATUS":
            return { ...state, status: action.payload };
        case "RESET":
            return {
                elapsed: action.payload.elapsed,
                status: action.payload.status,
            };
        default:
            return state;
    }
}
