# 实时公交框架

本项目是一个基于React的实时公交框架，旨在提供一个易于定制和扩展的平台，用于展示公共交通数据。

<div style="font-size: 1.5rem;">
  <a href="./README.md">English</a> | <a href="./README_ZH.md">中文</a>
</div>

## 特性

- 实时数据：该框架使用公共交通数据接口，提供最新的实时公交数据。
- 可扩展性：该框架易于扩展，您可以轻松地添加新的公交数据源或修改现有的数据源。
- 定制性：您可以自定义公交站点的样式和地图的样式，以满足您的需求。

## 快速开始

1. 克隆本仓库
```shell
git clone https://github.com/Gavinin/Realtime-Bus-Framework.git
```
2. 安装依赖
```shell
cd Realtime-Bus-Framework/src
npm install
```
3. 修改custom文件夹下的配置文件
   详细方法请参考 [如何修改请求配置文件](./documents/how_to_custom_api_zh.md)
4. 运行项目
```shell
npm start
```
5. 在浏览器中查看项目

在浏览器中打开`http://localhost:3000`即可查看实时公交框架。

## 如何贡献

如果您想为该项目做出贡献，您可以按照以下步骤进行：

1. 克隆本仓库
```shell
git clone https://github.com/Gavinin/Realtime-Bus-Framework.git
```
2. 创建新分支
```shell
git checkout -b feature/your-feature
```
3. 修改代码并提交更改
```shell
git add .
git commit -m "Add your commit message here"
git push origin feature/your-feature
```
4. 提交Pull请求

在GitHub上打开一个Pull请求，描述您所做的更改。


## 许可证

本项目基于MIT许可证发布，详情请参阅[LICENSE.md](LICENSE.md)文件。

