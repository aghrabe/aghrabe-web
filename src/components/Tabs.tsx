import { Dispatch, SetStateAction } from "react";

import { TabItems } from "../types/tab";
import { AuthType } from "../types/auth";

interface Props {
    tabItems: TabItems[];
    activeTab: AuthType;
    setActiveTab: Dispatch<SetStateAction<AuthType>>;
}

export default function Tabs({ tabItems, activeTab, setActiveTab }: Props) {
    return (
        <>
            <div>Tabs</div>
        </>
    );
}
