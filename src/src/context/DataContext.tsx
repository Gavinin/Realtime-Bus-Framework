import React, {useEffect, useState} from "react";
import ILineListInfo from "../entity/ILineListInfo";
import IStationInfo from "../entity/IStationInfo";
import useMount from "../hooks/useMount";
import {idb} from "../util/LocalStorageUtils";
import {usePropertiesContext} from "./PropertiesContext";
import DIRECTION from "../common/DirectionsEnum";
import {getDirection, getLineList, getServerVersion, getStationInfo} from "../custom/Converter";

export interface IGlobalDataContext {
    lineList: ILineListInfo[]
    stationInfoList: IStationInfo[]

    selectLineList(line: string | null, direction: string): Promise<void>

    selectedStationInfoList(line: string, direction: string): Promise<void>

    mounter(): void
}

const DataContext = React.createContext<IGlobalDataContext | null>(null)
DataContext.displayName = "GlobalData"


export const DataProvider = ({children}: { children: React.ReactNode }) => {
    const [lineList, setLineList] = useState<ILineListInfo[]>([])
    const [stationInfoList, setStationInfoList] = useState<IStationInfo[]>([])
    const {sysSettings, setSysSettings, userSelectedBusInfo, favouriteList} = usePropertiesContext();
    const mounter = () => {
        console.log("Welcome to ibus!!")
    }

    useEffect(() => {
        if (userSelectedBusInfo !== null) {
            selectedStationInfoList(userSelectedBusInfo.lineName, userSelectedBusInfo.direct).then()
        }
    }, [userSelectedBusInfo])


    useMount(async () => {
        let shouldUpdate = false;
        await getServerVersion().then(async (versionNumber) => {
            if (versionNumber !== sysSettings.version) {
                shouldUpdate = true
                //update version properties
                setSysSettings({...sysSettings, version: versionNumber})
            }
        }).then(async () => {
            await idb.lineInfoTable.where({
                direct: DIRECTION.UPWARD
            }).toArray().then(async initCheck => {
                if (initCheck.length === 0) {
                    shouldUpdate = true
                }
            }).then(async () => {
                if (shouldUpdate) {
                    await idb.lineInfoTable.clear().then(async () => {
                            await idb.stationPointTable.clear().then(async () => {
                                await getLineList(DIRECTION.DOWNWARD).then(async downData => {
                                    if (userSelectedBusInfo?.direct === DIRECTION.DOWNWARD) {
                                        setLineList(downData)
                                        console.log("saving to line list")
                                    }
                                    await idb.lineInfoTable.bulkAdd(downData)
                                }).then(async () => {
                                    await getLineList(DIRECTION.UPWARD).then(async upData => {
                                        await idb.lineInfoTable.bulkAdd(upData).then(() => {
                                            if (userSelectedBusInfo?.direct === DIRECTION.UPWARD || userSelectedBusInfo === null) {
                                                setLineList(upData)
                                                console.log("saving to line list")

                                            }
                                        });
                                    })
                                })
                            })
                        }
                    )

                }
            })
        })


    })

    const containNum = (str: string) => {
        return !isNaN(parseInt(str))
    }
    const hasFav = (line: string, direct: string): boolean => {
        let result: boolean = false;
        favouriteList.forEach(value => {
            if (value.lineName === line && value.direct === direct) {
                result = true;
            }
        })
        return result;
    }

    const selectLineList = async (line: string | null, direction: string): Promise<void> => {
        await idb.lineInfoTable.filter(
            (value) => {
                // console.log(value.direct)
                if (line) {
                    return value.direct === direction && value.lineName.includes(line)
                } else {
                    return value.direct === direction
                }
            }).toArray()
            .then(value => {
                setLineList(queryArrayProcessor(value))
            })

    }

    const queryArrayProcessor = (result: ILineListInfo[]) => {
        let res_tmp = result
        res_tmp.forEach(value => value.fav = hasFav(value.lineName, value.direct || ""))

        res_tmp.sort((a: ILineListInfo, b: ILineListInfo) => {
            if (containNum(a.lineName) && !containNum(b.lineName)) {
                return -1
            } else if (!containNum(a.lineName) && containNum(b.lineName)) {
                return 1
            }
            if (containNum(a.lineName) && containNum(b.lineName)) {
                if (parseInt(a.lineName) >= parseInt(b.lineName)) {
                    return 1
                } else {
                    return -1
                }
            }
            return 0
        })
        return res_tmp

    }


    const selectedStationInfoList = async (line: string, direction: string): Promise<void> => {
        await idb.stationPointTable.where({lineName: line, direction: getDirection(direction)})
            .toArray()
            .then(async value => {
                //if data in idb
                if (value.length > 0) {
                    let result: IStationInfo[] = []
                    let dumpMap: Map<string, IStationInfo> = new Map()
                    value.forEach(value => {
                        dumpMap.set(value.name, value);
                    })
                    dumpMap.forEach(value => {
                        result.push(value)
                    })
                    setStationInfoList(result);
                } else {
                    if (userSelectedBusInfo == null) {
                        throw Error("selectBusInfo is null");
                    }
                    await getStationInfo(userSelectedBusInfo).then(async result => {
                        if (result != null) {
                            setStationInfoList(result);
                            await idb.stationPointTable.bulkAdd(result).then()
                        }
                    })

                }
            })
    }

    return <DataContext.Provider children={children} value={{
        lineList,
        stationInfoList,
        selectLineList,
        selectedStationInfoList,
        mounter
    }}/>

}

export const useDataContext = () => {
    const context = React.useContext(DataContext);
    if (!context) {
        throw new Error("useAuth MUST be running in DataContext");
    }
    return context;
}
