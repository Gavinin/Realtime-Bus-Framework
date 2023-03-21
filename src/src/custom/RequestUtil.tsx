import qs from "qs";
import React from "react";
import IRemoteResponse from "./remote/IRemoteResponse";

export const enum BUS_APIS {
    BUS_STATUS = "http://your.server/service",
    SERVER_MAP = "http://your.server/service",
    SERVER_LINES = "http://your.server/service",
    SERVER_VERSION = "http://your.server/service"

}


interface IConfig extends RequestInit {
    data?: any;
}

const http = async (
    url: string,
    {data, headers, ...customConfig}: IConfig = {}
) => {
    const config = {
        method: "GET",
        headers: {
            "Content-Type": data ? "application/json" : "",
        },
        ...customConfig,
    };

    if (config.method.toUpperCase() === "GET") {
        url = `${url}?${qs.stringify(data)}`;
    } else {
        config.body = JSON.stringify(data || {});
    }
    return await window.fetch(url, config).then(async (res) => {
        let dataRes: IRemoteResponse = await res.json();
        if (dataRes.data) {
            return dataRes;
        } else {
            return Promise.reject(dataRes);
        }
    });
}

export default http