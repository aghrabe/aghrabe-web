interface Props {
    id: string;
    type: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
    id,
    type,
    placeholder,
    value,
    onChange,
}: Props) {
    return (
        <div className="flex flex-col gap-2">
            {/*
            <label
                htmlFor={id}
                className={"text-md font-medium text-on-background"}
            >
                {placeholder}
            </label>
            */}
            <input
                id={id}
                type={type}
                name={id}
                value={value}
                onChange={onChange}
                className={
                    "border border-outline rounded-md px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-xl placeholder:text-outline-variant"
                }
                placeholder={placeholder}
                required
            />
        </div>
    );
}
