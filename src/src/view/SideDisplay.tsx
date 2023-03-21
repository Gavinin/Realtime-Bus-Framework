import React, {useState} from 'react';
import BusSelectorDisplay from "./BusSelectorDisplay";
import type {RadioChangeEvent} from 'antd';
import {Radio} from 'antd';
import styled from "@emotion/styled";
import FavouriteBarDisplay from "./FavouriteBarDisplay";
import {usePropertiesContext} from "../context/PropertiesContext";
import useMount from "../hooks/useMount";
import {useTranslation} from "react-i18next";
import {FcBookmark, FcSelfServiceKiosk} from "react-icons/fc";

const SideDisplay = () => {
    type TabPosition = 'fav' | 'all';
    const {favouriteList} = usePropertiesContext();
    const [mode, setMode] = useState<TabPosition>('all');
    const {t} = useTranslation();


    useMount(() => {
        if (favouriteList.length > 0) {
            setMode('fav');
        } else {
            setMode('all')
        }
    })

    const handleModeChange = (e: RadioChangeEvent) => {
        setMode(e.target.value);
    };


    return (
        <>
            <TabGroupStyle size="large" buttonStyle="solid" onChange={handleModeChange} value={mode}>
                <TabBtnGroupStyle value="fav">
                    <TabBtnStyle>
                        <TabBtnSpanStyle style={{textAlign: "right"}}><FcBookmark/></TabBtnSpanStyle>
                        <TabBtnSpanStyle style={{textAlign: "left"}}>{t('favourite.name')}</TabBtnSpanStyle>
                    </TabBtnStyle>

                </TabBtnGroupStyle>
                <TabBtnGroupStyle value="all">
                    <TabBtnStyle>
                        <TabBtnSpanStyle style={{textAlign: "right"}}><FcSelfServiceKiosk/></TabBtnSpanStyle>
                        <TabBtnSpanStyle style={{textAlign: "left"}}>{t('bus.list')}</TabBtnSpanStyle>
                    </TabBtnStyle>
                </TabBtnGroupStyle>
            </TabGroupStyle>
            <SideStyle>
                {mode === "fav" ? <FavouriteBarDisplay/> : <BusSelectorDisplay/>}
            </SideStyle>
        </>
    )
}

export default SideDisplay

const TabGroupStyle = styled(Radio.Group)`
  
  width: 100%;
  //height: 100%;
`
const TabBtnGroupStyle = styled(Radio.Button)`

  width: 50%;
`
const TabBtnStyle = styled.div`

  display: flex;
  justify-content: space-between;
`
const TabBtnSpanStyle = styled.span`
  
  flex-grow: 1;
`

const SideStyle = styled.div`
`