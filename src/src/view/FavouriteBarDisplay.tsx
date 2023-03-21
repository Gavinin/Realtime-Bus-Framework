import React from 'react';
import {Button, List} from "antd";
import {ILineInfo2IBusInfo} from "../entity/IUserSelectedBusInfo";
import {usePropertiesContext} from "../context/PropertiesContext";
import ILineListInfo from "../entity/ILineListInfo";
import styled from "@emotion/styled";
import {getDirection, getLineStyle} from "../custom/Converter";
import {useTranslation} from "react-i18next";

const FavouriteBarDisplay = () => {

    const {favouriteList, setSelectedBusInfo, deleteFromFavouriteList} = usePropertiesContext();
    const {t} = useTranslation();


    const onBusSelected = (data: ILineListInfo) => {
        setSelectedBusInfo(ILineInfo2IBusInfo(data))
    }


    return (
        <ListStyle>

            <List
                style={{
                    height: '100%'
                }}
                className="favourite-list"
                itemLayout="vertical"
                dataSource={favouriteList}
                locale={{
                    emptyText: (<>
                        {t('favourite.empty')}
                    </>)
                }}
                renderItem={item => (
                    <List.Item
                        actions={[<Button
                            type="primary"
                            shape="round"
                            size={"middle"}
                            onClick={() => {
                                deleteFromFavouriteList(item)
                            }}>
                            {t('favourite.remove')}
                        </Button>]}
                        onClick={() => {
                            onBusSelected(item)
                        }}
                    >
                        <List.Item.Meta
                            title={getLineStyle(item)}
                            description={getDirection(item.direct)}
                        />
                    </List.Item>
                )}
            />

        </ListStyle>
    )
}

export default FavouriteBarDisplay;

const ListStyle = styled.div`
  //background: #fbfbfb;
  
  //height: 84vh;
`