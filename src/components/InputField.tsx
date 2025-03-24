import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    ref?: React.Ref<HTMLInputElement>;
}

export default function InputField({ error, label, id, ref, ...props }: Props) {
    return (
        <div className={"flex flex-col gap-2"}>
            {label && (
                <label
                    htmlFor={id}
                    className={"block text-lg md:text-xl font-medium"}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                name={id}
                ref={ref}
                className={`border rounded-md px-4 py-3 focus:ring-2 text-xl placeholder:text-outline-variant transition outline-none ${error ? "border-error focus:ring-error focus:border-error" : "border-outline focus:ring-primary focus:border-primary"}`}
                {...props}
            />
            {error && <p className={"text-error text-sm"}>{error}</p>}
        </div>
    );
}
