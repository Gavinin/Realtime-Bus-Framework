import ILineInfo from "../../entity/ILineInfo";
import DIRECTION from "../../common/DirectionsEnum";

interface IRemoteBusDetail {
    "busno": string,
    "linename": string,
    "upordown": string,
    "inorder": string,
    "weidu": number,
    "jingdu": number,
    "nowstate": string,
    "speed": string,
    "gpstime": string,
    "air": number,
    "a5": number
}

export const toIBusDetail = (remoteBusDetail: IRemoteBusDetail): ILineInfo => {
    return {
        "busPlateNumber": remoteBusDetail.busno,
        "name": remoteBusDetail.linename,
        "direction": remoteBusDetail.upordown == "下行" ? DIRECTION.DOWNWARD : DIRECTION.UPWARD,
        "order": remoteBusDetail.inorder,
        "latitude": remoteBusDetail.weidu,
        "longitude": remoteBusDetail.jingdu,
        "speed": remoteBusDetail.speed
    }
}

export default IRemoteBusDetail;