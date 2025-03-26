import { CircleAlert } from "lucide-react";

interface Props {
    error: string;
}

export default function FormErrorSection({ error }: Props) {
    return (
        <div
            className={
                "flex items-center gap-2 bg-error-container px-3 py-2 rounded-md border-1 border-error text-on-error-container text-sm md:text-base mt-2"
            }
        >
            <CircleAlert className="h-4 w-4 md:h-5 md:w-5  flex-shrink-0 text-error" />
            <span>{error}</span>
        </div>
    );
}
