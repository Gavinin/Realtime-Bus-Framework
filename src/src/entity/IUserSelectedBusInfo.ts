import ILineListInfo from "./ILineListInfo";

interface IUserSelectedBusInfo {
    lineName: string,
    direct: string
}

export const ILineInfo2IBusInfo = (lineInfo: ILineListInfo): IUserSelectedBusInfo => {
    return {
        lineName: lineInfo.lineName,
        direct: lineInfo.direct || ""
    }

}

export default IUserSelectedBusInfo;