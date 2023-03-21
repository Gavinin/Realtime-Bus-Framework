import React from "react";
import styled from "@emotion/styled";
import {useTranslation} from "react-i18next";

const WelcomeDisplay = () => {
    const {t} = useTranslation();

    return (
        <Index>
            <h2>
                {t('common.welcome')}
            </h2>
            <h1>{t('common.github')}<a href="https://github.com/Gavinin/YantaiBus">Yantai Bus</a></h1>
            <h1 style={{textAlign: "center"}}>{t('common.remark')}</h1>
        </Index>
    )

}
export default WelcomeDisplay;

const Index = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`