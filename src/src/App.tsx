import React from 'react';
import {usePropertiesContext} from "./context/PropertiesContext";
import StationDisplay from "./view/StationDisplay";
import WelcomeDisplay from "./view/WelcomeDisplay";
import {Layout} from 'antd';
import styled from "@emotion/styled";
import LeftMenu from "./component/LeftMenu";
import ContentHeader from "./component/ContentHeader";
import Theme from "./theme/Theme";


const {Content} = Layout;
const App: React.FC = () => {
    const {userSelectedBusInfo} = usePropertiesContext();

    return (
        <Theme>
            <ContentLayout
                id={"station-display"}
                className="site-layout"
            >
                <LeftMenu/>
                <ContentHeaderStyle/>
                <ContentCardLayout>
                    {/*Show welcome page if userSelectedBusInfo not be selected */}
                    {userSelectedBusInfo ? <StationDisplay/> : <WelcomeDisplay/>}
                </ContentCardLayout>

            </ContentLayout>
        </Theme>
    );
}


export default App;

const ContentLayout = styled('div')`
  background: ${props => props.theme.colors.mainBackground};
  color: ${props => props.theme.colors.frontColor};
  height: 100vh;
  &::-webkit-scrollbar {
    display: none;
  }

`
const ContentHeaderStyle = styled(ContentHeader)`
  height: 5vh;
`

const ContentCardLayout = styled(Content)`
  max-height: 94vh;
  background: ${props => props.theme.colors.mainBackground};
  color: ${props => props.theme.colors.frontColor};

`


