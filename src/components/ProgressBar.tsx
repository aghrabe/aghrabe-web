interface Props {
    progress: number;
}

export default function ProgressBar({ progress }: Props) {
    return (
        <>
            <div className={"w-full h-8 rounded-md bg-outline"}>
                <div
                    className={
                        "h-8 text-xl font-medium text-center text-on-primary bg-primary rounded-md transition-all duration-500 ease-in-out"
                    }
                    style={{ width: `${progress}%` }}
                >
                    {progress.toFixed(2)}%
                </div>
            </div>
        </>
    );
}
