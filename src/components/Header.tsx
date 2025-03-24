import { ReactNode } from "react";

interface Props {
    header: string;
    children?: ReactNode;
}

export default function Header({ header, children }: Props) {
    return (
        <div className={"flex justify-between"}>
            <h2 className={"text-xl md:text-2xl font-bold"}>{header}</h2>
            {children}
        </div>
    );
}
