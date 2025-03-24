interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    size: "small" | "medium" | "large";
}

/**
 * A customizable switch component that can be used to toggle between two states (checked/unchecked).
 *
 * @prop {boolean} [checked={isChecked}] - The current state of the switch. `true` means the switch is on, `false` means it's off.
 * @prop {function} [onChange={setIsChecked}] - A callback function to handle changes to the switch state. Receives a boolean (`true`/`false`) as an argument.
 * @prop {'small' | 'medium' | 'large'} [size="small"] - The size of the switch. It determines the width and height of the switch and toggle.
 *
 * @description
 * This component uses Tailwind CSS for styling. The switch has three different sizes (`small`, `medium`, and `large`),
 * which will adjust the size of the toggle and the container. The `checked` state determines if the switch is in the "on"
 * position or the "off" position. When clicked, the switch toggles its state, and the `onChange` function is triggered.
 *
 * **RTL Support:** The component supports Right-to-Left (RTL) layouts by utilizing the `rtl:-translate-x-full` class for
 * the toggle when it is checked. This ensures that the toggle moves correctly in RTL contexts (i.e., for languages like Persian, Arabic
 * and Hebrew where the text direction is right-to-left).
 *
 * @example
 * ```tsx
 * <Switch checked={isChecked} onChange={setIsChecked} size="medium" />
 * ```
 */
export default function Switch({ checked, onChange, size }: SwitchProps) {
    const sizes = {
        small: {
            container: "w-10 h-5",
            toggle: "w-5 h-5",
        },
        medium: {
            container: "w-12 h-6",
            toggle: "w-6 h-6",
        },
        large: {
            container: "w-14 h-7",
            toggle: "w-7 h-7",
        },
    };

    return (
        <label className="inline-flex items-center">
            <div
                className={`relative inline-block transition duration-300 ease-in-out rounded-full cursor-pointer ${sizes[size].container
                    } ${checked ? "bg-primary" : "bg-outline"}`}
            >
                <button
                    type={"button"}
                    className={`absolute block bg-white rounded-full shadow-md cursor-pointer transition-transform duration-300 ease-in-out transform ${checked
                            ? "ltr:translate-x-full rtl:-translate-x-full border border-primary"
                            : "translate-x-0 border border-outline"
                        } ${sizes[size].toggle}`}
                    style={{
                        insetInlineStart: "0%",
                        insetInlineEnd: "auto",
                    }}
                    onClick={() => onChange(!checked)}
                ></button>
            </div>
        </label>
    );
}
