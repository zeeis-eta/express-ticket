# wxcloudrun-express

[![GitHub license](https://img.shields.io/github/license/WeixinCloud/wxcloudrun-express)](https://github.com/WeixinCloud/wxcloudrun-express)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/WeixinCloud/wxcloudrun-express/express)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/WeixinCloud/wxcloudrun-express/sequelize)

微信云托管 Node.js Express 框架模版，实现简单的计数器读写接口，使用云托管 MySQL 读写、记录计数值。

![](https://qcloudimg.tencent-cloud.cn/raw/be22992d297d1b9a1a5365e606276781.png)

## 快速开始

前往 [微信云托管快速开始页面](https://cloud.weixin.qq.com/cloudrun/onekey)，选择相应语言的模板，根据引导完成部署。

## 本地调试
下载代码在本地调试，请参考[微信云托管本地调试指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/guide/debug/)

## 实时开发
代码变动时，不需要重新构建和启动容器，即可查看变动后的效果。请参考[微信云托管实时开发指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/guide/debug/dev.html)

## Dockerfile最佳实践
请参考[如何提高项目构建效率](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/scene/build/speed.html)

## 项目结构说明

```
.
├── Dockerfile
├── README.md
├── container.config.json
├── db.js
├── index.js
├── index.html
├── package.json
```

- `index.js`：项目入口，实现主要的读写 API
- `db.js`：数据库相关实现，使用 `sequelize` 作为 ORM
- `index.html`：首页代码
- `package.json`：Node.js 项目定义文件
- `container.config.json`：模板部署「服务设置」初始化配置（二开请忽略）
- `Dockerfile`：容器配置文件

## 服务 API 文档

### `GET /api/count`

获取当前计数

#### 请求参数

无

#### 响应结果

- `code`：错误码
- `data`：当前计数值

##### 响应结果示例

```json
{
  "code": 0,
  "data": 42
}
```

#### 调用示例

```
curl https://<云托管服务域名>/api/count
```

### `POST /api/count`

更新计数，自增或者清零

#### 请求参数

- `action`：`string` 类型，枚举值
  - 等于 `"inc"` 时，表示计数加一
  - 等于 `"clear"` 时，表示计数重置（清零）

##### 请求参数示例

```
{
  "action": "inc"
}
```

#### 响应结果

- `code`：错误码
- `data`：当前计数值

##### 响应结果示例

```json
{
  "code": 0,
  "data": 42
}
```

#### 调用示例

```
curl -X POST -H 'content-type: application/json' -d '{"action": "inc"}' https://<云托管服务域名>/api/count
```

## 使用注意
如果不是通过微信云托管控制台部署模板代码，而是自行复制/下载模板代码后，手动新建一个服务并部署，需要在「服务设置」中补全以下环境变量，才可正常使用，否则会引发无法连接数据库，进而导致部署失败。
- MYSQL_ADDRESS
- MYSQL_PASSWORD
- MYSQL_USERNAME
以上三个变量的值请按实际情况填写。如果使用云托管内MySQL，可以在控制台MySQL页面获取相关信息。


## License

[MIT](./LICENSE)


## vscode插件
- Weixin Cloudbase Docker Extension  
安装之后，在设置中搜索"wxcloud", 设置Appid和CLI key  

## Ubuntu安装Docker
```bash
sudo apt update
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo docker run hello-world
```
## 权限问题(docker报错：ERROR: Got permission denied)
- 第一次切换到root  
`sudo passwd root`
- su root
```bash
phong@phong-virtual-machine:~/Desktop/express-ticket$ su root
Password:
root@phong-virtual-machine:/home/phong/Desktop/express-ticket# sudo groupadd docker
groupadd: group 'docker' already exists
root@phong-virtual-machine:/home/phong/Desktop/express-ticket# sudo gpasswd -a phong docker
Adding user phong to group docker
root@phong-virtual-machine:/home/phong/Desktop/express-ticket# newgrp docker
root@phong-virtual-machine:/home/phong/Desktop/express-ticket# su phong
phong@phong-virtual-machine:~/Desktop/express-ticket$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
phong@phong-virtual-machine:~/Desktop/express-ticket$
```
- 重启Ubuntu

## 启动Proxy nodes for VPC access
启动api.weixin.qq.com容器
```bash
Executing task: docker run  --rm -d --network wxcb0 --name api.weixin.qq.com --pull=always -e TOAL_ROLE=client -e TOAL_SERVER=https://wxcloud-localdebug-proxy-68063-4-1320492701.sh.run.tcloudbase.com:443 -e TOAL_KEY=TOAL_j8h4uqhl5m -e TOAL_SERVER_TIMEOUT=200 -e TOAL_MODE=shortpoll -e TOAL_LOCAL_PORT=80 -e TOAL_TARGET=api.weixin.qq.com -e TOAL_VERBOSE=DEBUG -l role=vpcdebugproxy -l wxcloud=api.weixin.qq.com -l domain=api.weixin.qq.com ccr.ccs.tencentyun.com/tcb_prd/wxcloud-localdebug-proxy:latest 
```
## 将项目打包成容器
```bash
phong@phong-virtual-machine:~/Desktop/express-ticket$ docker run --rm --network wxcb0 -p 8080:80 -it -v /home/phong/Desktop/express-ticket:/app alpine:3.13 /bin/sh
/ # cd app
/app # ls
Dockerfile             README.md              db.js                  index.js
LICENSE                container.config.json  index.html             package.json
```
## 安装Dockerfile中的命令，安装依赖，运行
```bash
sed -i 's/dl-cdn.alpinelinux.org/mirrors.tencent.com/g' /etc/apk/repositories \
apk add --update --no-cache nodejs npm
npm install
npm start
```
## 访问8080端口的ticket接口
http://Linux的IP地址:8080/ticket
返回：
```json
{
    "ticket": "xxx",
    "expire_seconds": xxx,
    "url": "http://weixin.qq.com/q/xxx"
}
```
