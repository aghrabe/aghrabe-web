import MoreIcon from "../../assets/icons/MoreIcon";
import Header from "../../components/Header";
import Icon from "../../components/Icon";
import SessionTracker from "../../components/SessionTracker";

export default function Session() {
    return (
        <div className={"flex w-full h-full gap-8"}>
            <div
                className={
                    "basis-3/5 max-h-screen flex flex-col justify-between"
                }
            >
                <Header header={"Session"}>
                    <Icon size={"medium"}>
                        <MoreIcon />
                    </Icon>
                </Header>
                <SessionTracker />
                <div></div>
            </div>
            <div className={"basis-2/5 border-l-2 border-outline px-8"}>
                <Header header={"History"} />
            </div>
        </div>
    );
}
