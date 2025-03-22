import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";

import {
    loginSchema,
    LoginSchemaType,
    registerSchema,
    RegisterSchemaType,
} from "../../lib/types/auth";
import Button from "../Button";
import InputField from "../InputField";
import Icon from "../Icon";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import { OAuthResponse } from "@supabase/supabase-js";
import { AuthProviderError } from "../../lib/constants/authErrors";

interface AuthProps {
    onSubmit: (values: LoginSchemaType) => Promise<void>;
    onOAuth?: () => Promise<AuthProviderError | OAuthResponse | null>;
}

interface LoginProps extends AuthProps {
    type: "login";
}

interface RegisterProps extends AuthProps {
    type: "register";
}

type Props = LoginProps | RegisterProps;

export default function AuthForm({ type, onSubmit, onOAuth }: Props) {
    const isLogin = type === "login";
    const schema = isLogin ? loginSchema : registerSchema;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LoginSchemaType | RegisterSchemaType>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    async function submitHandler(data: LoginSchemaType | RegisterSchemaType) {
        try {
            if (isLogin) {
                await onSubmit(data as LoginSchemaType);
            } else {
                await onSubmit(data as RegisterSchemaType);
            }
            reset();
        } catch (err) {
            throw new Error(
                `Error while ${isLogin ? "logging in" : "registering"}: ${err}`,
            );
        }
    }

    return (
        <form
            className={
                "flex flex-col gap-12 md:bg-surface text-on-background md:text-on-surface p-8 md:p-14 rounded-3xl md:shadow-lg w-full"
            }
            onSubmit={handleSubmit(submitHandler)}
        >
            <h2
                className={
                    "text-4xl text-on-background md:text-on-surface font-bold"
                }
            >
                {isLogin ? "Login" : "Sign Up"}
            </h2>

            <div className={"space-y-6"}>
                <InputField
                    {...register("email")}
                    error={errors.email?.message}
                    id={"email"}
                    type={"email"}
                    placeholder={"Email"}
                />

                <InputField
                    {...register("password")}
                    error={errors.password?.message}
                    id={"password"}
                    type={"password"}
                    placeholder={"Password"}
                />

                {!isLogin && (
                    <InputField
                        {...register("passwordConfirm")}
                        error={
                            (errors as FieldErrors<RegisterSchemaType>)
                                .passwordConfirm?.message
                        }
                        id={"password-confirmation"}
                        type={"password"}
                        placeholder={"Password Confirmation"}
                    />
                )}

                <div className={"space-y-2"}>
                    <Button
                        type={"submit"}
                        size={"large"}
                        loading={isSubmitting}
                        fullWidth
                    >
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

                <div className={"flex items-center"}>
                    <hr className={"flex-grow border-t border-outline"} />
                    <span className={"mx-2 text-outline-variant text-sm"}>
                        or
                    </span>
                    <hr className={"flex-grow border-t border-outline"} />
                </div>

                <Button
                    type={"button"}
                    onClick={onOAuth}
                    variant={"contained"}
                    size={"large"}
                    className={
                        "bg-google-btn-bg text-google-btn-text border border-google-btn-border hover:bg-google-btn-hover-bg flex items-center justify-center gap-2"
                    }
                    customColor
                    fullWidth
                >
                    <Icon className={"w-6 h-6"}>
                        <GoogleIcon />
                    </Icon>
                    <span>Sign in with Google</span>
                </Button>
            </div>
        </form>
    );
}
