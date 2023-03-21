import React, {useEffect, useState} from "react";
import styled from "@emotion/styled";
import useInterval from "../hooks/userInterval";
import {usePropertiesContext} from "../context/PropertiesContext";
import IStationInfo from "../entity/IStationInfo";
import {Button, message, Radio, Timeline} from "antd";
import ILineInfo from "../entity/ILineInfo";
import {useDataContext} from "../context/DataContext";
import {getBusInfo} from "../custom/Converter";
import {useTranslation} from "react-i18next";
import {PageHeader} from '@ant-design/pro-layout';
import {TimelineItemProps} from "antd/es/timeline/TimelineItem";
import DIRECTION from "../common/DirectionsEnum";
import ListItem from "../component/ListItem";
import {FcRefresh} from "react-icons/fc";

interface ITimeLineItem extends TimelineItemProps {
}

interface Position {
    latitude: number,
    longitude: number
}

const StationDisplay = () => {
    //mi
    const maxDistance = 500;
    const positionFlag = "position-scroll-flag"
    const {
        sysSettings,
        setSysSettings,
        userSelectedBusInfo,
        setSelectedBusInfo,
        cleanSelectedLineInfo
    } = usePropertiesContext()
    const {stationInfoList} = useDataContext()
    const [busListItems, setBusListItems] = useState<ITimeLineItem[]>([])
    const [freshRate, setFreshRate] = useState<number>(sysSettings.refresh)
    const [refreshBtn, setRefreshBtn] = useState<boolean>(false)
    const [clientPosition, setClientPosition] = useState<Position | null>(null)
    const {t} = useTranslation();

    useEffect(() => {
        generateBusInfo().then((result) => {
            reGenerateBusListInfo(result)
        })
    }, [stationInfoList])


    useEffect(() => {
        sysSettings.refresh = freshRate
        setSysSettings(sysSettings)
    }, [freshRate])

    useEffect(() => {
        generateBusInfo().then(async (result) => {
            reGenerateBusListInfo(result)
        });
    }, [refreshBtn])

    useInterval(() => {
        generateBusInfo().then(async (result) => {
            reGenerateBusListInfo(result)
        })
    }, freshRate)

    const generateBusInfo = async () => {
        if (userSelectedBusInfo == null) {
            throw Error("selectBusInfo is null");
        }
        return await getBusInfo(userSelectedBusInfo).then(async result => {
            return result
        })
    }

    const reGenerateBusListInfo = (data: Map<string, ILineInfo> | null) => {
        let resultArray: ITimeLineItem[] = []
        let stationList = [...stationInfoList];
        stationList.sort((a, b) => {
            return parseInt(a.order) > parseInt(b.order) ? 1 : -1;
        })

        distanceProcessor(stationList)
        stationList.forEach(value => {
            resultArray.push(generatorStop(value));
            //match bus and stop
            if (data) {
                if (parseInt(value.order) > 1 && parseInt(value.order) < stationInfoList?.length) {
                    let busInfo = data.get(value.order);
                    if (busInfo) {
                        resultArray.push(generatorBus(busInfo));
                    }
                }
            }
        })
        setBusListItems(resultArray)

    }



    const onRefreshBtnClick = () => {
        setRefreshBtn(!refreshBtn)
    }

    //Get position from browser and compare user  between stop position
    // if distance below maxDistance
    // return positionFlag else ""
    const positionProcessor = (stopPosition: Position): number => {
        if (clientPosition) {
            let radLat1 = stopPosition.latitude * Math.PI / 180.0;
            let radLat2 = clientPosition.latitude * Math.PI / 180.0;
            let a = radLat1 - radLat2;
            let b = stopPosition.longitude * Math.PI / 180.0 - clientPosition.longitude * Math.PI / 180.0;
            let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * 6378.137;// EARTH_RADIUS;
            //Mi
            s = Math.round(s * 10000) / 10;
            return s;
        } else {
            return maxDistance
        }
    }

    const distanceProcessor = (stationList: IStationInfo[]) => {
        //Position func
        let minDistance: number = maxDistance;
        let minDistanceIndex: number = -1;
        for (let i = 0; i < stationList.length; i++) {
            let distance = positionProcessor({
                latitude: parseFloat(stationList[i].latitude),
                longitude: parseFloat(stationList[i].longitude)
            })
            if (minDistance > distance) {
                minDistance = distance;
                minDistanceIndex = i;
            }
        }
        if (minDistanceIndex > -1) {
            stationList[minDistanceIndex].scroll = true;
        }
    }

    const scrollTo = () => {
        let positionElement = document.getElementsByClassName(positionFlag)[0]
        if (positionElement) {
            positionElement.scrollIntoView({behavior: 'smooth'})
        }
    }

    const scrollSwitch = async () => {
        let enableLocation = false;
        if (enableLocation) {
            return navigator.geolocation.getCurrentPosition(
                position => setClientPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }),
                err => console.log(err)
            );
        }
        return null;
    }


    const chDirection = () => {
        if (userSelectedBusInfo) {
            if (userSelectedBusInfo?.direct === DIRECTION.UPWARD) {
                setSelectedBusInfo({...userSelectedBusInfo, direct: DIRECTION.DOWNWARD})
            } else {
                setSelectedBusInfo({...userSelectedBusInfo, direct: DIRECTION.UPWARD})
            }
        }

    }

    const warn = () => {
        message.info(t('warn.fresh_rate'));
    }

    const generatorStop = (data: IStationInfo): ITimeLineItem => {
        return {
            color: "blue",
            children: (
                <TimeLineItemStyle title={<TimeLineItemTitleStyle>{data.name}</TimeLineItemTitleStyle>}>
                    <TimeLineItemSubStyle>
                        <p>{t('station.name') + ":" + data.lineName}</p>
                        <p>{t('station.direction') + ":" + data.direction}</p>
                    </TimeLineItemSubStyle>
                </TimeLineItemStyle>
            )
        }
    }

    const generatorBus = (data: ILineInfo): ITimeLineItem => {
        return {
            color: data.speed === "0" ? "gray" : "green",
            children: (
                <TimeLineItemStyle title={<TimeLineItemTitleStyle>{data.name}</TimeLineItemTitleStyle>}>
                    <TimeLineItemSubStyle>
                        <p>{t('bus.plant_number') + ":" + data.busPlateNumber}</p>
                    </TimeLineItemSubStyle>
                </TimeLineItemStyle>
            )
        }
    }

    return (
        <StationDisplayStyle>
            <PageHeader
                className="site-page-header"
                onBack={cleanSelectedLineInfo}
                title={<BusNameStyle style={{fontSize: "3vh"}}>{userSelectedBusInfo?.lineName}</BusNameStyle>}
                extra={
                    <PageHeaderExtraStyle>
                        {/*Change Direction button*/}
                        <DirectionButtonStyle onClick={chDirection} type="primary"
                                              block>{userSelectedBusInfo?.direct === DIRECTION.UPWARD ? t('bus.upward') : t('bus.downward')}
                        </DirectionButtonStyle>
                        {/*Rate button*/}
                        <Radio.Group defaultValue={freshRate.toString()} buttonStyle="solid" onChange={e => {
                            setFreshRate(e.target.value)
                        }}>
                            <Radio.Button value="2600" onClick={warn}>{t('fresh_rate.time.two')}</Radio.Button>
                            <Radio.Button value="5000">{t('fresh_rate.time.five')}</Radio.Button>
                            <Radio.Button value="8000">{t('fresh_rate.time.eight')}</Radio.Button>
                        </Radio.Group>
                        {/*<RefreshBtnStyle >*/}
                        {/*    <FcRefresh/>*/}
                        {/*</RefreshBtnStyle>*/}
                    </PageHeaderExtraStyle>}
                // subTitle="This is a subtitle"
            />
            {/*Bus View*/}
            <TimelineStyle>
                <Timeline mode={'right'} items={busListItems}/>
            </TimelineStyle>

        </StationDisplayStyle>


    )
}

const TimeLineItemSubStyle = styled.div`
  color: ${props => props.theme.colors.frontColor};
`

const StationDisplayStyle = styled.div`
`
const TimeLineItemTitleStyle = styled('span')`
  color: ${props => props.theme.colors.frontColor};
`
const PageHeaderExtraStyle = styled.div`
  float: right;
  margin-top: 1vh;
`

const TimelineStyle = styled.div`
  padding: 1vh;
  max-height: 80vh;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: none; /* firefox */

  ::-webkit-scrollbar {
    display: none;
  }
`
const TimeLineItemStyle = styled(ListItem)`
  background: ${props => props.theme.colors.tabBackground};
  color: ${props => props.theme.colors.frontColor};

`
// const TimeLineItemDetailStyle = styled(Panel)`
//   background: ${props => props.theme.colors.tabBackground};
//   color: ${props => props.theme.colors.frontColor};
//
// `

const BusNameStyle = styled('div')`
  color: ${props => props.theme.colors.frontColor};

`

const DirectionButtonStyle = styled(Button)`
  width: 15vh !important;
  margin-right: 1.5vh;
`

const RefreshBtnStyle = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  padding: 0 15px;
  border-radius: 6px;
  width: 2vh !important;
  margin-left: 1.5vh;
  float: right;
  background: #bcbcbc;
`

export default StationDisplay;

