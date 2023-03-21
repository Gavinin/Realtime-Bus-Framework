/**
 * This interface described any line info.
 */
interface ILineListInfo {
    id?: number,
    lineName: string,
    startStop: string,
    endStop: string,
    earlyHour: string,
    lastHour: string,
    describe?: string,
    direct?: string,
    fav?: boolean
}

export default ILineListInfo;