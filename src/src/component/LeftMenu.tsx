import {Drawer, DrawerProps, Dropdown, MenuProps} from "antd";
import {FcPrevious, FcSettings} from "react-icons/fc";
import SideDisplay from "../view/SideDisplay";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {usePropertiesContext} from "../context/PropertiesContext";
import styled from "@emotion/styled";
import {useTheme} from "@emotion/react";

const LeftMenu = () => {
    const {i18n} = useTranslation()
    const {sysSettings, setSysSettings} = usePropertiesContext()
    const [placement] = useState<DrawerProps['placement']>('left');
    const theme = useTheme()

    const onClick: MenuProps['onClick'] = ({key}) => {
        i18n.changeLanguage(key)
        let sysSettingsTmp = sysSettings;
        sysSettingsTmp.language = key;
        setSysSettings(sysSettingsTmp);
    };

    const onSideBarClose = () => {
        setSysSettings({...sysSettings, sidebar: false})
    }


    const items: MenuProps['items'] = [
        {
            label: '中文',
            key: 'zh_cn',
        },
        {
            label: 'English',
            key: 'en',
        },
        {
            label: 'Français',
            key: 'fr',
        }
    ];


    return (
        <>
            {/*Left drawer component*/}
            <LeftMenuStyle
                style={{background: theme.colors.sideBarBackground, color: theme.colors.frontColor}}
                title=""
                placement={placement}
                closable={true}
                onClose={onSideBarClose}
                open={sysSettings.sidebar}
                key={placement}
                mask={true}
                maskClosable={true}
                closeIcon={<FcPrevious/>}
                extra={
                    <Dropdown menu={{items, onClick}} placement="bottom" arrow>
                        <FcSettings/>
                    </Dropdown>
                }>
                <SideDisplay/>
            </LeftMenuStyle>
        </>
    )
}

const LeftMenuStyle = styled(Drawer)`
  background: ${props => props.theme.colors.tabBackground};
  color: ${props => props.theme.colors.frontColor};
`

export default LeftMenu;