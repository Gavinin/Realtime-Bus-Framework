import UserDataStats from "../common/UserDataStats";
import IUserSelectedBusInfo from "../entity/IUserSelectedBusInfo";
import ILineListInfo from "../entity/ILineListInfo";
import Dexie, {Table} from 'dexie';
import IStationInfo from "../entity/IStationInfo";
import SystemProperties from "../common/SystemProperties";

export const getItem = (key: string) => localStorage.getItem(key);
export const setItem = (key: string, value: string) => localStorage.setItem(key, value);
export const removeItem = (key: string) => localStorage.removeItem(key);

export const getUserSelectedLine = () => {
    let busLine = getItem(UserDataStats.SELECTED_BUS_LINE);
    if (busLine == null) {
        return null;
    }
    let userInfoLocal: IUserSelectedBusInfo = JSON.parse(busLine);
    return userInfoLocal;

}
export const cleanUserSelectedLine = () => {
    removeItem(UserDataStats.SELECTED_BUS_LINE);
}

export const setUserSelectedLine = (userInfo: IUserSelectedBusInfo) => {
    if (userInfo.lineName !== undefined && userInfo.direct !== undefined) {
        setItem(UserDataStats.SELECTED_BUS_LINE, JSON.stringify(userInfo));
    }
}

export const getFavList = (): ILineListInfo[] => {
    let busLine = getItem(UserDataStats.FAVOURITE_LIST);
    if (busLine) {
        return JSON.parse(busLine);
    }
    return [];
}
export const cleanFavList = () => {
    removeItem(UserDataStats.FAVOURITE_LIST);

}

export const setFavList = (favInfo: ILineListInfo[]) => {
    if (favInfo.length > 0) {
        setItem(UserDataStats.FAVOURITE_LIST, JSON.stringify(favInfo));
    }
}

export const getSysProperties = () => {
    let sysPropertiesStr = getItem(UserDataStats.SYSTEM_PROPERTIES);
    let sysProperties: SystemProperties;
    if (sysPropertiesStr == null) {
        sysPropertiesStr = "{\n" +
            "            \"language\": \"zh_cn\",\n" +
            "            \"sidebar\": \"true\",\n" +
            "            \"refresh\": 8000,\n" +
            "            \"version\": \"0\",\n" +
            "            \"theme\": \"light\"\n" +
            "        }"

        setItem(UserDataStats.SYSTEM_PROPERTIES, sysPropertiesStr)
    }
    sysProperties = JSON.parse(sysPropertiesStr)
    return sysProperties;
}

export const setSysProperties = (setSysSettings: SystemProperties) => {
    setItem(UserDataStats.SYSTEM_PROPERTIES, JSON.stringify(setSysSettings))
}

export class IDBDexie extends Dexie {
    lineInfoTable!: Table<ILineListInfo>;
    stationPointTable!: Table<IStationInfo>;


    constructor() {
        super(UserDataStats.INDEXEDDB_FLAG);
        this.version(1).stores({
            lineInfoTable: '++id, lineName, startStop, endStop, earlyHour, lastHour, direct, describe',
            stationPointTable: '++id, [lineName+direction], order, name, side, longitude, latitude'
        });
    }
}

export const idb = new IDBDexie();



