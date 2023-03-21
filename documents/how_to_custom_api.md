# How to use the Realtime Bus
In this tutorial, we will introduce how to use the city bus API to obtain data such as bus routes, stop information and real-time bus status.

## Preconditions
Have basic TypeScript and React knowledge
A React application running on a local or remote server

## Instructions
### Modify the files under the src/custom/ folder.
1. Converter.tsx defines methods and API addresses for requesting various APIs.
2. RequestUtil.tsx defines the Http request method, return method and.
3. Under the remote folder, it contains Interface for various external API requests

## Converter.tsx
Each method defines the parameters of the current request, the request method (the common request method is in the HTTP_METHODS class, and the default is GET request), and the conversion method after the data is obtained.
1. getDirection: Convert the direction value in the interface to a string type
2. getLineStyle: display the style of the line in the list on the left
3. getServerVersion: Get the version number of the server map, if inconsistent, delete the information in the local database and reload the Map data
4. getLineList: Get the list of bus lines. This method will be executed twice at startup, namely UPWARD and DOWNWARD
5. getStationInfo: Get bus station information, request the station information of the line currently selected by the user
6. getBusInfo: Get the real-time bus status, request the real-time bus location information of the line currently selected by the user, and use the Order number to match the station number in getStationInfo

## RequestUtil.tsx

1. interface IConfig defines the format returned after requesting the interface

2. http() wraps an asynchronous network request function
    - parameters:
        - url: string - required, indicating the URL address to request.
        - config: IConfig - Optional, contains the object of the request configuration item, which inherits from RequestInit and adds a data field to indicate the data to be sent.

- return value:
    - Promise<IRemoteResponse> - When the request is successful, an IRemoteResponse object will be returned, indicating the response data; when the request fails, an error will be thrown.