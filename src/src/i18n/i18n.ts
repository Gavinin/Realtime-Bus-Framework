import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import zh_cn from "./zh_cn.json"
import en from "./en.json"
import fr from "./fr.json"

const resources = {
    "en": {
        translation: en
    },
    "zh_cn": {
        translation: zh_cn
    },
    "fr": {
        translation: fr
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "zh_cn",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;