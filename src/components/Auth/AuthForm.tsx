import { useEffect, useRef, useState } from "react";

import {
    AuthPayload,
    AuthType,
    LoginPayload,
    RegisterPayload,
} from "../../types/auth";
import Button from "../Button";
import InputField from "../InputField";

interface LoginProps {
    type: "login";
    onSubmit: (values: LoginPayload) => Promise<void>;
}

interface RegisterProps {
    type: "register";
    onSubmit: (values: RegisterPayload) => Promise<void>;
}

type Props = LoginProps | RegisterProps;

const initialPayloads: Record<AuthType, AuthPayload> = {
    login: { email: "", password: "" },
    register: { email: "", password: "", passwordConfirm: "" },
};

export default function AuthForm({ type, onSubmit }: Props) {
    const payloadRef = useRef<AuthPayload>(initialPayloads[type]);
    const [, forceRender] = useState(false);
    const isLogin = type === "login";

    useEffect(() => {
        payloadRef.current = initialPayloads[type];
        forceRender((prev) => !prev);
    }, [type]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;

        if (id === "password-confirmation") {
            (payloadRef.current as RegisterPayload).passwordConfirm = value;
        } else {
            payloadRef.current[id as keyof AuthPayload] = value;
        }

        forceRender((prev) => !prev);
    }

    function SubmitHandler(e: React.FormEvent) {
        e.preventDefault();
        if (type === "login") {
            onSubmit(payloadRef.current as LoginPayload);
        } else {
            onSubmit(payloadRef.current as RegisterPayload);
        }
    }

    return (
        <form
            className={
                "flex flex-col gap-12 bg-surface text-on-surface p-14 rounded-3xl shadow-lg w-full"
            }
            onSubmit={SubmitHandler}
        >
            <h2 className={"text-4xl text-on-surface font-bold"}>
                {isLogin ? "Login" : "Sign Up"}
            </h2>

            <div className={"space-y-6"}>
                <InputField
                    id={"email"}
                    type={"email"}
                    label={"Email"}
                    placeholder={"Email"}
                    value={payloadRef.current.email}
                    onChange={handleChange}
                />

                <InputField
                    id={"password"}
                    type={"password"}
                    label={"Password"}
                    placeholder={"Password"}
                    value={payloadRef.current.password}
                    onChange={handleChange}
                />

                {!isLogin && (
                    <InputField
                        id={"password-confirmation"}
                        type={"password"}
                        label={"Password Confirmation"}
                        placeholder={"Password Confirmation"}
                        value={
                            (payloadRef.current as RegisterPayload)
                                .passwordConfirm
                        }
                        onChange={handleChange}
                    />
                )}

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
            </div>
        </form>
    );
}
