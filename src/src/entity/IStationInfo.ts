/**
 * This interface described any station info.
 */
interface IStationInfo {
    id?: number,
    lineName?: string,
    direction?: string,
    scroll?: boolean,
    order: string,
    name: string,
    side: string,
    longitude: string,
    latitude: string
}

export default IStationInfo;