import IUserSelectedBusInfo from "../../entity/IUserSelectedBusInfo";
import {getDirection} from "../Converter";

interface IRemoteBusInfo {
    linename: string,
    upordown: string
}

export const toIRemoteBusInfo = (selectedBusInfo: IUserSelectedBusInfo): IRemoteBusInfo => {

    return {
        linename: selectedBusInfo.lineName || "",
        upordown: getDirection(selectedBusInfo.direct)
    }
}


export default IRemoteBusInfo;