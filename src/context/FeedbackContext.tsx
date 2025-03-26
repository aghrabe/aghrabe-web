import { useState } from "react";
import ContextGenerator from "./ContextGenerator";

interface BeforeFeedbackPayload {
    mood_before: number;
    journal_before: string;
}

interface AfterFeedbackPayload {
    mood_after: number;
    journal_after: string;
}

interface FeedbackContext {
    beforeFeedback: BeforeFeedbackPayload | null;
    afterFeedback: AfterFeedbackPayload | null;
    setBeforeFeedback: (feedback: BeforeFeedbackPayload | null) => void;
    setAfterFeedback: (feedback: AfterFeedbackPayload | null) => void;
}

const { Provider, useContextValue: useFeedbackContext } =
    ContextGenerator<FeedbackContext>("Feedback");

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
    const [beforeFeedback, setBeforeFeedback] =
        useState<BeforeFeedbackPayload | null>(null);
    const [afterFeedback, setAfterFeedback] =
        useState<AfterFeedbackPayload | null>(null);

    return (
        <Provider
            value={{
                beforeFeedback,
                afterFeedback,
                setBeforeFeedback,
                setAfterFeedback,
            }}
        >
            {children}
        </Provider>
    );
}

export { useFeedbackContext };
