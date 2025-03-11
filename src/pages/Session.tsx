import MoreIcon from "../assets/icons/MoreIcon";
import Header from "../components/Header";
import Icon from "../components/Icon";
import ProgressBar from "../components/ProgressBar";
import SessionTracker from "../components/SessionTracker";

export default function Session() {
    return (
        <div className={"flex w-full h-full gap-8"}>
            <div className={"basis-3/5 h-full flex flex-col justify-between"}>
                <Header header={"Session"}>
                    <Icon size={"medium"}>
                        <MoreIcon />
                    </Icon>
                </Header>
                <SessionTracker />
                <div></div>
            </div>
            <div
                className={
                    "basis-2/5 h-full flex flex-col border-l-2 border-outline px-8 gap-4"
                }
            >
                <Header header={"History"} />
                <div className={"px-4 overflow-y-auto h-[calc(100%-45px)]"}>
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                    <ProgressBar progress={10} />
                </div>
            </div>
        </div>
    );
}
