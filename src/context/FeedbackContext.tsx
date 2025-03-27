import { useState } from "react";
import ContextGenerator from "./ContextGenerator";

export interface BeforeFeedbackPayload {
    mood_before: number;
    journal_before: string;
}

export interface AfterFeedbackPayload {
    mood_after: number;
    journal_after: string;
}

interface FeedbackContext {
    beforeFeedback: BeforeFeedbackPayload;
    afterFeedback: AfterFeedbackPayload;
    setBeforeFeedback: (feedback: BeforeFeedbackPayload) => void;
    setAfterFeedback: (feedback: AfterFeedbackPayload) => void;
}

const { Provider, useContextValue: useFeedbackContext } =
    ContextGenerator<FeedbackContext>("Feedback");

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
    const [beforeFeedback, setBeforeFeedback] = useState<BeforeFeedbackPayload>(
        {
            mood_before: 3,
            journal_before: "",
        },
    );
    const [afterFeedback, setAfterFeedback] = useState<AfterFeedbackPayload>({
        mood_after: 3,
        journal_after: "",
    });

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
