import { useState } from "react";
import { AuthType, LoginValueType, RegisterValueType } from "../types/auth";
import Button from "./Button";
import InputField from "./InputField";

interface Props {
    type: AuthType;
    onSubmit: (values: LoginValueType | RegisterValueType) => void;
}

type FormStateType =
    | { type: "login"; data: LoginValueType }
    | { type: "register"; data: RegisterValueType };

function Inputs({
    formData,
    handleChange,
}: {
    formData: FormStateType;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return formData.type === "login" ? (
        <>
            <InputField
                id={"email"}
                type={"email"}
                label={"email"}
                placeholder={"Email"}
                value={formData.data.email}
                onChange={handleChange}
            />

            <InputField
                id={"password"}
                type={"password"}
                label={"password"}
                placeholder={"Password"}
                value={formData.data.password}
                onChange={handleChange}
            />
        </>
    ) : (
        <>
            <InputField
                id={"email"}
                type={"email"}
                label={"email"}
                placeholder={"Email"}
                value={formData.data.email}
                onChange={handleChange}
            />

            <InputField
                id={"password"}
                type={"password"}
                label={"password"}
                placeholder={"Password"}
                value={formData.data.password}
                onChange={handleChange}
            />

            <InputField
                id={"password-confirmation"}
                type={"password"}
                label={"password confirmation"}
                placeholder={"Password Confirmation"}
                value={formData.data.passwordConfirm}
                onChange={handleChange}
            />
        </>
    );
}

export default function AuthForm({ type, onSubmit }: Props) {
    return (
        <form
            className={
                "flex flex-col gap-12 bg-surface text-on-surface p-14 rounded-3xl shadow-lg w-full"
            }
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <h2 className={"text-4xl text-on-surface font-bold"}>
                {type === "login" ? "Login" : "Sign Up"}
            </h2>

            <div className={"space-y-6"}>
                <Inputs formData={formData} handleChange={() => { }} />

                <div className={"space-y-2"}>
                    <Button type={"submit"} size={"large"} fullWidth>
                        Submit
                    </Button>
                    {type === "login" && (
                        <Button
                            type={"button"}
                            size={"large"}
                            variant={"text"}
                            fullWidth
                        >
                            Forgot password
                        </Button>
                    )}
                </div>

                {/*OAuth later here*/}
            </div>
        </form>
    );
}
