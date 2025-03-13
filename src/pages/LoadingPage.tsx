import LoadingSpinner from "../components/LoadingSpinner";

export default function LoadingPage() {
    return (
        <div className={"flex justify-center items-center min-h-screen"}>
            <LoadingSpinner size={"xxlarge"} />
        </div>
    );
}
