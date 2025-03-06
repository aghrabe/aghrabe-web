import LoaderIcon from "../assets/icons/LoaderIcon";

export default function LoadingSpinner() {
    return (
        <span
            className={
                "flex justify-center items-center space-x-2 animate-spin"
            }
        >
            <LoaderIcon />
        </span>
    );
}
