import {ThemeProvider} from '@emotion/react';
import React, {useEffect, useState} from "react";
import {usePropertiesContext} from "../context/PropertiesContext";
import ThemeEnum from "../common/ThemeEnum";
import {ITheme} from "./ITheme";

const Theme = ({children}: { children: React.ReactNode }) => {
    const {sysSettings} = usePropertiesContext();
    const lightTheme: ITheme = {
        colors: {
            mainBackground: '#fff',
            tabBackground: '#ececec',
            sideBarBackground: '#fff',
            searchBackground: '#ececec',
            frontColor: '#000',
        },
        css: {
            borderRadius: '5px'
        }

    } as const

    const darkTheme: ITheme = {
        colors: {
            mainBackground: '#2f2f2f',
            tabBackground: '#6a6969',
            sideBarBackground: '#373737',
            searchBackground: '#3a3a3a',
            frontColor: '#fff',
        },
        css: {
            borderRadius: '5px'
        }
    } as const


    const [theme, setTheme] = useState<ITheme>(sysSettings.theme === ThemeEnum.LIGHT ? lightTheme : darkTheme)
    const themeProcessor = () => {
        sysSettings.theme === ThemeEnum.LIGHT ? setTheme(lightTheme) : setTheme(darkTheme)
    }

    useEffect(() => {
        themeProcessor()
    }, [sysSettings.theme])


    return (
        <ThemeProvider theme={theme} children={children}/>
    )

}

export default Theme;