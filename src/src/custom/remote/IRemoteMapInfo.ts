import IStationInfo from "../../entity/IStationInfo";

interface IRemoteMapInfo {
    stopName: string,
    side: string,
    jingdu: string,
    weidu: string,
    stopOrder: string
}

export const toIMapInfo = (remoteMapInfo: IRemoteMapInfo): IStationInfo => {
    return {
        order: remoteMapInfo.stopOrder,
        name: remoteMapInfo.stopName,
        side: remoteMapInfo.side,
        longitude: remoteMapInfo.jingdu,
        latitude: remoteMapInfo.weidu
    }

}

export default IRemoteMapInfo;