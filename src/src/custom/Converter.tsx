/*
* This file for adept different city bus API to this system.
* which contains several main functions.
* 1. getDirection
* 2. getLineStyle
* 3. getServerVersion
* 4. getLineList
* 5. getStationInfo
* 6. getBusInfo
* */

import React from "react";
import ILineListInfo from "../entity/ILineListInfo";
import IRemoteBusInfo, {toIRemoteBusInfo} from "./remote/IRemoteBusInfo";
import IUserSelectedBusInfo from "../entity/IUserSelectedBusInfo";
import http from "./RequestUtil";
import IRemoteBusDetail, {toIBusDetail} from "./remote/IRemoteBusDetail";
import ILineInfo from "../entity/ILineInfo";
import HTTP_METHODS from "../common/HttpMethod";
import IRemoteMapInfo, {toIMapInfo} from "./remote/IRemoteMapInfo";
import IStationInfo from "../entity/IStationInfo";
import DIRECTION from "../common/DirectionsEnum";
import IRemoteLineInfo from "./remote/IRemoteLineInfo";
import IRemoteLineList from "./remote/IRemoteLineList";

export const enum BUS_APIS {
    BUS_STATUS = "http://your.server/service",
    SERVER_MAP = "http://your.server/service",
    SERVER_LINES = "http://your.server/service",
    SERVER_VERSION = "http://your.server/service"

}


/**
 * This method is used to convert the value of the direction in the interface
 * @param direct the direct key in internal system.
 */
export const getDirection = (direct: DIRECTION | string | unknown): string => {
    return DIRECTION.UPWARD === direct ? "UPWARD" : "DOWNWARD";
}

/**
 * Display line style in left bar
 * like: line 1 (Start-End)
 */
export const getLineStyle = (item: ILineListInfo): string => {
    return item.lineName + '(' + item.startStop + '-' + item.endStop + ')'
}

/**
 * This function control the app resetting settings,
 * when remote server is different with localstorage
 * @return just a string like "1.0.0" or "1" no limit
 */
export const getServerVersion = async (): Promise<string> => {
    return await http(BUS_APIS.SERVER_VERSION, {
        method: HTTP_METHODS.GET,
        data: {}
    }).then((response) => {
        if (response.data !== "") {
            return response.data;
        }
        return "null";
    })
}

/**
 * This function will return the all bus list displayed on left bar
 * @param direct The direction parameters after the converted conversion are received through the getDirection method
 *          direct: "UPWARD"
 */
export const getLineList = async (direct?: DIRECTION): Promise<ILineListInfo[]> => {
    let data: IRemoteLineInfo = {
        line: "",
        direction: getDirection(direct)
    }
    return await http(BUS_APIS.SERVER_LINES, {
        method: HTTP_METHODS.GET,
        data: data
    }).then((response) => {
        let remoteLineInfos: Array<IRemoteLineList> = response.data
        let lineInfos: ILineListInfo[] = []
        remoteLineInfos?.forEach((customList) => {
            lineInfos.push({
                lineName: customList.lineName,
                startStop: customList.startStop,
                endStop: customList.endStop,
                earlyHour: customList.earlyHour,
                lastHour: customList.lastHour,
                direct: direct,
                describe: "",
            })
        })
        return lineInfos
    })

}

/**
 * Get the specific information of the bus line selected by the current user, including all stations and other information
 * @param selectedBusInfo
 *      lineName: "line1",
 *      direct: "UPWARD"
 */
export const getStationInfo = async (selectedBusInfo: IUserSelectedBusInfo): Promise<IStationInfo[] | null> => {
    let remoteData: IRemoteBusInfo = toIRemoteBusInfo(selectedBusInfo)
    return http(BUS_APIS.SERVER_MAP, {
        method: HTTP_METHODS.GET,
        data: remoteData
    }).then(async (response) => {
        if (response.data.length > 0) {
            let tmp: Array<IRemoteMapInfo> = response.data
            let result: Array<IStationInfo> = []
            tmp.forEach(value => {
                let mapInfo = toIMapInfo(value)
                mapInfo.lineName = selectedBusInfo.lineName;
                mapInfo.direction = getDirection(selectedBusInfo.direct)
                result.push(mapInfo)
            })
            return result
        }
        return null;
    })
}

/**
 * Get the real -time status of the current buses
 * @param selectedBusInfo Contain the bus information selected by the user
 *      lineName: "line1",
 *      direct: "UPWARD"
 */
export const getBusInfo = async (selectedBusInfo: IUserSelectedBusInfo): Promise<Map<string, ILineInfo>> => {
    let remoteData: IRemoteBusInfo = toIRemoteBusInfo(selectedBusInfo)
    return http(BUS_APIS.BUS_STATUS, {
        data: remoteData,
        method: HTTP_METHODS.GET
    }).then((response) => {
        let result: Map<string, ILineInfo> = new Map();
        if (response.data.length > 0) {
            let tmp: Array<IRemoteBusDetail> = response.data
            tmp.forEach(value => result.set(value.inorder, toIBusDetail(value)))
            return result;
        }
        return result;
    })
}
