import React, {useState} from "react";
import IUserSelectedBusInfo from "../entity/IUserSelectedBusInfo";
import useMount from "../hooks/useMount";
import {
    cleanFavList,
    cleanUserSelectedLine,
    getFavList,
    getSysProperties,
    getUserSelectedLine,
    setFavList,
    setSysProperties,
    setUserSelectedLine
} from "../util/LocalStorageUtils";
import ILineListInfo from "../entity/ILineListInfo";
import SystemProperties from "../common/SystemProperties";
import {useTranslation} from "react-i18next";

interface IBusInfoContext {
    sysSettings: SystemProperties,
    setSysSettings: (setSysSettings: SystemProperties) => void,
    userSelectedBusInfo: IUserSelectedBusInfo | null,
    setSelectedBusInfo: (userInfo: IUserSelectedBusInfo) => boolean,
    favouriteList: ILineListInfo[],
    cleanSelectedLineInfo: () => void,
    addToFavouriteList: (lineInfo: ILineListInfo) => boolean,
    deleteFromFavouriteList: (lineInfo: ILineListInfo) => boolean,
    cleanFavouriteList: () => void,
}

const PropertiesContext = React.createContext<IBusInfoContext | undefined>(undefined)
PropertiesContext.displayName = "PropertiesContext"

export const PropertiesProvider = ({children}: { children: React.ReactNode }) => {
    const [sysSettings, __setSysSettings] = useState<SystemProperties>(getSysProperties())
    const [userSelectedBusInfo, _setUserSelecteduserSelectedBusInfo] = useState<IUserSelectedBusInfo | null>(null)
    const [favouriteList, setFavouriteList] = useState<ILineListInfo[]>(getFavList())
    const {i18n} = useTranslation()

    useMount(() => {
        _setUserSelecteduserSelectedBusInfo(getUserSelectedLine())
        if (sysSettings.language) {
            i18n.changeLanguage(sysSettings.language)
        }
    })

    const setSelectedBusInfo = (userInfo: IUserSelectedBusInfo) => {
        if (userInfo.lineName !== null && userInfo.direct !== null) {
            _setUserSelecteduserSelectedBusInfo(userInfo)
            setUserSelectedLine(userInfo)
            return true
        }
        return false;
    }

    const cleanSelectedLineInfo = () => {
        _setUserSelecteduserSelectedBusInfo(null);
        cleanUserSelectedLine();
    }

    const cleanFavouriteList = () => {
        setFavouriteList([]);
        cleanFavList();
    }
    const setSysSettings = (setSysSettings: SystemProperties) => {
        setSysProperties(setSysSettings);
        __setSysSettings(setSysSettings)
    }

    const addToFavouriteList = (lineInfo: ILineListInfo) => {
        let notExist = true;
        favouriteList.forEach(value => {
            if (lineInfo.describe === value.describe && lineInfo.lineName === value.lineName) {
                notExist = false;
            }
        })
        if (notExist) {
            let fl_tmp = favouriteList;
            fl_tmp.push(lineInfo);
            setFavouriteList(fl_tmp);
            setFavList(fl_tmp);
        }

        return notExist
    }

    const deleteFromFavouriteList = (lineInfo: ILineListInfo) => {
        let hasExist = false;
        let fl_tmp = favouriteList;
        fl_tmp.map((value, index) => {
            if (lineInfo.describe === value.describe && lineInfo.lineName === value.lineName) {
                fl_tmp.splice(index, 1);
                hasExist = true;
            }
        })
        if (hasExist) {
            setFavouriteList(fl_tmp);
            setFavList(fl_tmp);
        }
        return hasExist;
    }



    return <PropertiesContext.Provider children={children} value={{
        userSelectedBusInfo,
        sysSettings,
        setSysSettings,
        setSelectedBusInfo,
        cleanSelectedLineInfo,
        favouriteList,
        addToFavouriteList,
        deleteFromFavouriteList,
        cleanFavouriteList
    }}/>
}


export const usePropertiesContext = () => {
    const context = React.useContext(PropertiesContext);
    if (!context) {
        throw new Error("useAuth MUST be running in PropertiesContext");
    }
    return context;
}