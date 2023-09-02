const path = require("path");
const { v4 } = require('uuid')
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

// 公众号调用，获取ticket
app.get("/api/ticket", async (req, res) => {
  // 这个请求可能会带有一个sceneStr, 解构赋值
  const { sceneStr } = req.body
  const sceneObj = {
    event: 'oauth',
    id: `${v4()}`
  }
  const scene_str = sceneStr ? sceneStr : JSON.stringify(sceneObj)
  // # action_name:
  // # # QR_SCENE 临时二维码
  // # # QR_STR_SCENE 临时字符串参数值 √
  // # # QR_LIMIT_SCENE 永久整型参数值
  // # # QR_LIMIT_STR_SCENE 永久字符串参数值
  // # scene_id: 场景值ID
  // # scene_str: 字符串形式的场景值ID
  const params = {
    url: `https://api.weixin.qq.com/cgi-bin/qrcode/create`,
    method: 'POST',
    data: {
      "expire_seconds": 3600,
      "action_name": "QR_STR_SCENE", 
      "action_info": {
        "scene": {
          "scene_str": scene_str
        }
      }
    },
  }
  const respData = await axios(params).then(resp => {
    return resp.data
  })
  if (respData.errcode || respData.errmsg) throw new Error(respData.errmsg)
  res.send({
    ticket: respData.ticket,
    sceneId: scene_str,
    expireSeconds: expire_seconds,
    createdAt,
  });
})

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
