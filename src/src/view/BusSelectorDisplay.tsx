import React, {Fragment, useEffect, useState} from "react";
import {LoadingOutlined, StarFilled, StarOutlined} from '@ant-design/icons';
import {usePropertiesContext} from "../context/PropertiesContext";
import styled from "@emotion/styled";
import {Button, Input, List, Spin} from "antd";
import {ILineInfo2IBusInfo} from "../entity/IUserSelectedBusInfo";
import DIRECTION from "../common/DirectionsEnum";
import ILineListInfo from "../entity/ILineListInfo";
import {useDataContext} from "../context/DataContext";
import {getLineStyle} from "../custom/Converter";
import {useTranslation} from "react-i18next";
import {useTheme} from "@emotion/react";

const LineDisplay = () => {
    const {
        deleteFromFavouriteList,
        cleanSelectedLineInfo,
        addToFavouriteList,
        setSelectedBusInfo,
        sysSettings,
        setSysSettings
    } = usePropertiesContext();
    const [searchInp, setSearchInp] = useState<string | null>(null);
    const [direction, setDirection] = useState<DIRECTION>(DIRECTION.UPWARD)
    const {lineList, selectLineList} = useDataContext()
    const {t} = useTranslation();

    useEffect(() => {
        selectLineList(searchInp, direction).then()
    }, [direction, searchInp])

    const onBusSelected = (data: ILineListInfo) => {
        cleanSelectedLineInfo()
        setSelectedBusInfo(ILineInfo2IBusInfo(data))
        setSysSettings({...sysSettings,sidebar:false})
    }

    const chDirection = () => {
        if (direction === DIRECTION.UPWARD) {
            setDirection(DIRECTION.DOWNWARD)
        } else {
            setDirection(DIRECTION.UPWARD)
        }
    }

    const onFavBtn = (item: ILineListInfo) => {
        if (item.fav) {
            deleteFromFavouriteList(item)
        } else {
            addToFavouriteList(item)
        }
        selectLineList(searchInp, direction).then()
    }

    return (
        <Fragment>
            <LineSearchStyle
                placeholder={t('bus.search').toString()}
                allowClear
                size="large"
                onChange={e => {
                    setSearchInp(e.target.value);
                }}
            />
            <InpCleanBtnStyle
                type="primary"
                block
                size={'middle'}
                onClick={() => {
                    selectLineList(null, direction).then()
                }}>
                {t('common.clean')}
            </InpCleanBtnStyle>
            <br/>
            <DirectionButtonStyle onClick={chDirection} type="primary"
                                  block>{direction === DIRECTION.UPWARD ? t('bus.upward') : t('bus.downward')}
            </DirectionButtonStyle>
            <BusListStyle>
                <List
                    style={{border: 0}}
                    className="line-list"
                    itemLayout="vertical"
                    bordered={true}
                    size={'small'}
                    dataSource={lineList}
                    renderItem={item => (<>
                            <List.Item
                                // actions={[<FavouriteBtn item={item}/>]}
                                actions={[
                                    <Button
                                        type="primary"
                                        shape="round"
                                        size={"middle"}
                                        onClick={() => {
                                            onFavBtn(item)
                                        }}>
                                        {item.fav ? <StarFilled/> : <StarOutlined/>}
                                    </Button>]}
                                onClick={() => {
                                    onBusSelected(item)
                                }}
                            >
                                <List.Item.Meta
                                    title={<LineListItemStyle>{getLineStyle(item)}</LineListItemStyle>}
                                    description={<LineListItemStyle>
                                        {
                                            DIRECTION.UPWARD === item.direct ? t('bus.upward') : t('bus.downward')
                                        }
                                    </LineListItemStyle>}
                                />
                            </List.Item>
                        </>
                    )}
                >
                </List>
            </BusListStyle>

        </Fragment>
    )
}

const BusSelectorDisplay = () => {
    const {lineList} = useDataContext()
    return (
        <BusSelectorStyle>
            {lineList ? <LineDisplay/> : <NoneDataStyle/>}
        </BusSelectorStyle>
    )
}

export default BusSelectorDisplay;

const NoneData = () => {
    const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;
    return (
        <Spin size={"large"} indicator={antIcon}/>
    )
}

const BusSelectorStyle = styled('div')`
`
const NoneDataStyle = styled(NoneData)`
  justify-content: center;
  align-items: center;
`

const LineSearchStyle = styled(Input)`
  box-sizing: border-box;
  margin: 1vh 1vh 1vh 0;
  border: 0;
`

const SelectorSearchBtnStyle = styled(Button)`
  box-sizing: border-box;
  margin: 1vh 1vh 1vh 0;
  border: 0;
`

const InpCleanBtnStyle = styled(SelectorSearchBtnStyle)`

`

const DirectionButtonStyle = styled(SelectorSearchBtnStyle)`

`
const LineListItemStyle = styled('div')`
  color: ${props => props.theme.colors.frontColor};
`

const BusListStyle = styled.div`
  height: 65vh;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: none; /* firefox */

  ::-webkit-scrollbar {
    display: none;
  }
`


