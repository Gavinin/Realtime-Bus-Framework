import '@emotion/react'
import {ITheme} from "./ITheme";

declare module '@emotion/react' {
    export interface Theme extends ITheme {
    }
}