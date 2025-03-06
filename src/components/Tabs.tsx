import { Dispatch, SetStateAction } from "react";

import { TabItemsType } from "../types/tab";
import { AuthType } from "../types/auth";

interface Props {
    tabItems: TabItemsType[];
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
