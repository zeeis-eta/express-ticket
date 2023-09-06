const path = require("path");
const { v4 } = require('uuid')
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const axios = require('axios');
// const fs = require('fs')
const request = require('request')
// const { init: initDB, Counter } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);


app.get("/", async (req, res) => {
  res.send('hello, this is the home page')
})
// // 首页
// app.get("/", async (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

// // 更新计数
// app.post("/api/count", async (req, res) => {
//   const { action } = req.body;
//   if (action === "inc") {
//     await Counter.create();
//   } else if (action === "clear") {
//     await Counter.destroy({
//       truncate: true,
//     });
//   }
//   res.send({
//     code: 0,
//     data: await Counter.count(),
//   });
// });

// // 获取计数
// app.get("/api/count", async (req, res) => {
//   const result = await Counter.count();
//   res.send({
//     code: 0,
//     data: result,
//   });
// });

// // 小程序调用，获取微信 Open ID
// app.get("/api/wx_openid", async (req, res) => {
//   if (req.headers["x-wx-source"]) {
//     res.send(req.headers["x-wx-openid"]);
//   }
// });

app.get("/msg", function (req, res) {
  request({
    method: 'POST',
    url: 'http://api.weixin.qq.com/wxa/msg_sec_check',
    body: JSON.stringify({
      openid: 'ogEXr6dy7oAWIh7Le8lJep6cAmzw', //用户的Openid，用户需要在近两个小时内访问过小程序
      version: 2, // 2.0版本
      scene: 2, //场景枚举值 1-资料 2-评论 3-论坛 4-社交日志
      content: '安全检测文本'
    })
  }, function (error, response) {
    if (error) {
      res.send(error.toString())
    } else {
      console.log('接口返回内容', response.body)
      res.send(JSON.parse(response.body))
    }
  })
})

app.post("/taoyi_ticket", function (req, res) {
  const { sceneStr, expireSeconds } = req.body
  request({
    method: 'POST',
    url: 'http://api.weixin.qq.com/cgi-bin/qrcode/create',
    body: JSON.stringify({
      action_name: 'QR_STR_SCENE',
      expire_seconds: expireSeconds || 3600,
      action_info: {
        scene: {
          scene_str: sceneStr
        }
      }
    })
  }, function (error, response) {
    if (error) {
      res.send(error.toString())
    } else {
      console.log('接口返回内容', response.body)
      res.send(JSON.parse(response.body))
    }
  })
})

app.post("/guanhai_ticket", function (req, res) {
  const { sceneStr, expireSeconds } = req.body
  request({
    method: 'POST',
    url: 'http://api.weixin.qq.com/cgi-bin/qrcode/create?from_appid=wx1c096fbf07724f12',
    body: JSON.stringify({
      action_name: 'QR_STR_SCENE',
      expire_seconds: expireSeconds || 3600,
      action_info: {
        scene: {
          scene_str: sceneStr
        }
      }
    })
  }, function (error, response) {
    if (error) {
      res.send(error.toString())
    } else {
      console.log('接口返回内容', response.body)
      res.send(JSON.parse(response.body))
    }
  })
})


// app.post("/ticket", async (req, res) => {
//   // 这个请求可能会带有一个sceneStr, 解构赋值
//   const { sceneStr } = req.body
//   const sceneObj = {
//     event: 'oauth',
//     id: `${v4()}`
//   }
//   const scene_str = sceneStr ? sceneStr : JSON.stringify(sceneObj)
//   // # action_name:
//   // # # QR_SCENE 临时二维码
//   // # # QR_STR_SCENE 临时字符串参数值 √
//   // # # QR_LIMIT_SCENE 永久整型参数值
//   // # # QR_LIMIT_STR_SCENE 永久字符串参数值
//   // # scene_id: 场景值ID
//   // # scene_str: 字符串形式的场景值ID
//   const api = `https://api.weixin.qq.com/cgi-bin/qrcode/create`
//   request(api, {
//     method: 'POST',
//     body: JSON.stringify({
//       "action_name": "QR_STR_SCENE",
//       "expire_seconds": 3600,
//       "action_info": {
//         "scene": {
//           "scene_str": scene_str
//         }
//       }
//     }),
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   }, (err, resp, body) => {
//     try {
//       const data = JSON.parse(body).data_list[0]
//       res.send(data)
//       // res.send({
//       //   ticket: respData.ticket,
//       //   sceneId: scene_str,
//       //   expireSeconds: expire_seconds,
//       //   createdAt,
//       // });
//     } catch (error) {
//       res.send('get phone failed');
//     }
//   });


// })

const port = process.env.PORT || 80;

async function bootstrap() {
  // await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
