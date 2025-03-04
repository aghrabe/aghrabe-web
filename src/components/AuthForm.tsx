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

// BUG: pass confirm doesn't work
// TODO: useRef

export default function AuthForm({ type, onSubmit }: Props) {
    const [formData, setFormData] = useState<FormStateType>(
        type === "login"
            ? { type: "login", data: { email: "", password: "" } }
            : {
                  type: "register",
                  data: { email: "", password: "", passwordConfirm: "" },
              },
    );

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (prev.type === "login") {
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        [name]: value,
                    },
                } as { type: "login"; data: LoginValueType };
            } else {
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        [name]: value,
                    },
                } as { type: "register"; data: RegisterValueType };
            }
        });
    }

    return (
        <form
            className={
                "flex flex-col gap-12 bg-surface text-on-surface p-14 rounded-lg shadow-lg w-full"
            }
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(formData.data);
            }}
        >
            <h2 className={"text-4xl text-on-surface font-bold"}>
                {type === "login" ? "Login" : "Sign In"}
            </h2>

            <div className={"space-y-6"}>
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

                {formData.type === "register" && (
                    <InputField
                        id={"password-confirmation"}
                        type={"password"}
                        label={"password confirmation"}
                        placeholder={"Password Confirmation"}
                        value={formData.data.passwordConfirm}
                        onChange={handleChange}
                    />
                )}

                <div className={"space-y-2"}>
                    <Button type={"submit"} size={"large"} fullWidth>
                        Submit
                    </Button>
                    <Button
                        type={"button"}
                        size={"large"}
                        variant={"text"}
                        fullWidth
                    >
                        Forgot password
                    </Button>
                </div>

                {/*OAuth later here*/}
            </div>
        </form>
    );
}
