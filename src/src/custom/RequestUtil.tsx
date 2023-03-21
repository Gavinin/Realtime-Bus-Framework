import qs from "qs";
import React from "react";
import IRemoteResponse from "./remote/IRemoteResponse";

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