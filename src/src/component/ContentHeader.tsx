import {FcMenu} from "react-icons/fc";
import React from "react";
import {usePropertiesContext} from "../context/PropertiesContext";
import {MdDarkMode, MdLightMode} from "react-icons/md";
import styled from "@emotion/styled";
import ThemeEnum from "../common/ThemeEnum";

const ContentHeader = () => {
    const {sysSettings, setSysSettings} = usePropertiesContext()

    const onSideBarClick = () => {
        setSysSettings({...sysSettings, sidebar: true})
    }

    const toggleTheme = () => {
        setSysSettings({...sysSettings, theme: sysSettings.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK})
    }
    return (
        <ContentHeaderStyle>
            {/*Show Drawer button */}
            <LeftBtnStyle>
                <FcMenu onClick={onSideBarClick}/>
            </LeftBtnStyle>

            <RightBtnStyle>

                {sysSettings.theme === ThemeEnum.DARK ? <MdDarkMode onClick={toggleTheme}/> :
                    <MdLightMode onClick={toggleTheme}/>}
            </RightBtnStyle>
        </ContentHeaderStyle>
    )
}

const ContentHeaderStyle = styled.div`
  //width: 100vh;
  display: flex;
`
const LeftBtnStyle = styled.div`
  //float: left;
  margin: 2.5vh
`
const RightBtnStyle = styled.div`
  float: right;
  margin: 2.5vh
`

export default ContentHeader