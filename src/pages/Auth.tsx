import { useState } from "react";

import Tabs from "../components/Tabs";
import AuthForm from "../components/AuthForm";
import { AuthType, LoginValueType } from "../types/auth";
import { TabItemsType } from "../types/tab";
import Button from "../components/Button";

export default function Auth() {
    const [activeTab, setActiveTab] = useState<AuthType>("register");
    const tabItems: TabItemsType[] = [
        { key: "login", label: "Login" },
        { key: "register", label: "Register" },
    ];
    const dontHaveAcc =
        activeTab === "login"
            ? "Don't have an account?"
            : "Already Have an account?";

    function handleAuth(value: LoginValueType) {
        console.log("Authvalue: ", value);
        // console.log("activeTab", activeTab);
    }

    return (
        <div className={"w-full min-h-screen flex justify-center items-center"}>
            <div
                className={
                    "w-full max-w-xl flex flex-col items-center justify-center p-6"
                }
            >
                <AuthForm type={activeTab} onSubmit={handleAuth} />
                <span className={"text-lg text-on-background-varient"}>
                    {dontHaveAcc}
                    <Button size={"medium"} variant={"text"}>
                        {activeTab === "login" ? "Sign Up" : "Login"}
                    </Button>
                </span>
            </div>
        </div>
    );
}
