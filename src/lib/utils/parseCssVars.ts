import fs from "fs";
import postcss from "postcss";
import postcssJs from "postcss-js";

export function getCssVariables(filePath: string): Record<string, string> {
    const css = fs.readFileSync(filePath, "utf-8");
    const root = postcss.parse(css);
    const styles = postcssJs.objectify(root);

    return Object.keys(styles)
        .filter((key) => key.startsWith("--"))
        .reduce(
            (vars, key) => {
                vars[key] = styles[key];
                return vars;
            },
            {} as Record<string, string>,
        );
}
