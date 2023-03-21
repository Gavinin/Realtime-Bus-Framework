import React, {useState} from "react";
import styled from "@emotion/styled";
import {FcCollapse, FcExpand} from "react-icons/fc";

const ListItem = ({
                      children,
                      title,
                      size = 'middle',
                      open = false,
                  }: {
    children?: React.ReactNode;
    title?: React.ReactNode;
    size?: 'small' | 'middle' | 'large';
    open?: boolean
}) => {

    const [expand, setExpand] = useState<boolean>(open);
    const togglePanel = () => setExpand(!expand)
    return (
        <ListItemStyle>
            <ListItemTitleStyle onClick={togglePanel}>
                <ListItemTitleIcon>{expand ? <FcCollapse/> : <FcExpand/>}</ListItemTitleIcon>
                <ListItemTitleText>{title}</ListItemTitleText>
            </ListItemTitleStyle>
            <ListItemSubStyle expand={expand}>
                {children}
            </ListItemSubStyle>
        </ListItemStyle>
    )

}

const ListItemStyle = styled('div')`
  //border: 1px solid ;
  background: ${props => props.theme.colors.tabBackground};
  border-radius: ${props => props.theme.css.borderRadius};
  margin: 1vh;
`

const ListItemTitleStyle = styled('div')`
  padding: 1vh;
  cursor: pointer;
  height: 3vh;
`

const ListItemTitleText = styled('div')`
  //cursor: pointer;
  float: right;
`
const ListItemTitleIcon = styled('div')`
    float: left;
`
const ListItemSubStyle = styled('div')<{ expand: boolean }>`
  padding-right: 2vh;
  max-height: ${props => (props.expand ? '20vh' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`
export default ListItem