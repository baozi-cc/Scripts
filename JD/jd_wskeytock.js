/*
wskey 获取
基于py更改而成，wskey本地更新cookie，配合bot：https://github.com/coderIndu/du_v4bot， 可实现自动替换wskey/cookie
将cookie存放在config/cookie.sh中
将wskey存放在config/wskey.sh中
# 格式(cookie.sh):
Cookie1="pt_key=xxx;pt_pin=xxx;"
Cookie2=...
# 格式(wskey.sh):
Cookie1="pin=xxx;wskey=xxx"
Cookie2=...
发送wskey/cookie至bot即可自动增加替换。
*/


const $ = new Env('cookie自动替换');
const notify = $.isNode() ? require('./sendNotify') : '';
// //Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
// //IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message, noFailure = true;
const cookiePath = '../config/cookie.sh'
const wskeyPath = '../config/wskey.sh'
//IOS等用户直接用NobyDa的jd cookie
// axios.maxRedirects: 5, // default
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      // console.log(cookie)
      await TotalBean(); // 检测失效cookie
      if (!$.isLogin) {
        $.msg($.name, `\n【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\n`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        pin = cookiesArr[i].match(/(?<=pt_pin=).*(?=;)/)[0];
        let result = await runAll()
        noFailure = false
        if ($.isNode()) {
          await notify.sendNotify(`\n${$.name}\ncookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n${result}`)
        }
        continue
      }
    }
  }
  if (noFailure) {
    console.log("无过期cookie👌");
    await notify.sendNotify(`wskey自动替换cookie\n`, `无过期cookie👌`)
  }
})()

//  执行所有任务
function runAll() {
  return new Promise(async resolve => {
    let result = ""
    try {
      console.log(pin)
      let wskey = await findWskey(pin)
      let tokenKey = await getTokenKey(wskey)
      let newCookie = await getJDCookie(tokenKey)
      if (wskey != "" && tokenKey != undefined && newCookie != "") {
        console.log(`账号的wskey: ${wskey}\n账号的tokenKey: ${tokenKey}\n新的Cookie: ${newCookie}\n`);
        result = await addCookie(newCookie)
      } else {
        console.log(`账号的wskey: ${wskey}\n账号的tokenKey: ${tokenKey}\n`);
        result = "wskey/tokenKey/newCookie为空，替换错误！"
      }
    } catch (error) {
      console.log("runAll出错", error);
    } finally {
      resolve(result)
    }
  })
}

//  替换cookie 
async function addCookie(cookie) {
  return new Promise(async resolve => {
    let result = ""
    try {
      let pt_pin = /(?=(pt_pin|pin)).*(.*?\;)/;
      let findPin = cookie.match(pt_pin)[0];
      // console.log(findPin);
      let path = cookiePath
      if (/^pin/.test(cookie)) {
        path = wskeyPath
      }
      const options = {
        files: path,
        from: "",
        to: "",
      };

      let data = fs.readFileSync(path, 'utf-8').toString().split("\n"); // 读取cookie数据
      data.forEach(element => {
        if (element.indexOf(findPin) != -1) {
          console.log(`失效的cookie：${element}`);
          let replace = element.match(/(?<=(Cookie|pin).*\=\").*(?=\")/)[0];
          options.from = replace;
          options.to = cookie;
        }
      });
      if (options.from == "") {
        let cookieCount = data.length;
        let appendStr = `Cookie${cookieCount}="${cookie}"\n`;
        fs.appendFileSync(path, appendStr);
        console.log("cookie/wskey添加成功！");
        result = "cookie/wskey添加成功"
      } else {
        result = replace(options).then((res) => {
          if (res[0].hasChanged) {
            // console.log("cookie存在，已经替换。");
            return "cookie/wskey存在，已经替换。";
          } else {
            // console.log("cookie/wskey已存在，无需替换！");
            return "cookie/wskey已存在，无需替换。"
          }
        })
      }
    } catch (e) {
      $.logErr(e)
    } finally {
      resolve(result)
    }
  })

}

//  查找wskey
function findWskey(pin) {
  return new Promise(async resolve => {
    let wskey = ""
    try {
      let wskeyArr = [$.getdata('WskeyJD'), $.getdata('WskeyJD2'), ...jsonParse($.getdata('wskeyList') || "[]").map(item => item.cookie)].filter(item => !!item);
      // let pin = cookiesArr[i].match(/(?<=pt_pin=).*(?=;)/)[0];
      for (let i = 0; i < wskeyArr.length; i++) {
        wskey = wskeyArr[i]
        if (wskey.indexOf(pin) != -1) {
          wskey = wskey.match(/pin.*;/)[0]
          break  // 找到则跳出
        }
      }
    } catch (error) {
      console.log("查找wskey失败", error);
    } finally {
      console.log(wskey)
      resolve(wskey)
    }
  })
}


// 获取TokenKey
function getTokenKey(wsCookie) {
  return new Promise(async resolve => {
    let body = "body=%7B%22action%22%3A%22to%22%2C%22to%22%3A%22https%253A%252F%252Fh5.m.jd.com%252FbabelDiy%252FZeus%252F2bf3XEEyWG11pQzPGkKpKX2GxJz2%252Findex.html%253FbabelChannel%253Dttt2%2526doTask%253Dc%22%7D&"
    // https://api.m.jd.com/client.action?functionId=genToken&${data}${body}
    const option = {
      url: `https://api.m.jd.com/client.action?functionId=genToken&clientVersion=10.2.6&build=91563&client=android&partner=xiaomi001&oaid=e8dab32fa48fc28a&eid=eidAc164812151sedEIbZs7ARjaWGHvyEylD3HRCHOPZQ/j/jIzBgLsklI+FG2NllDOe1Wx69bDCFGT4VF80qJnPXgpu/xEEQUSC588nMoqxMeRIfDZT&sdkVersion=30&lang=zh_CN&harmonyOs=0&networkType=wifi&uts=0f31TVRjBSvr80ezMhXI0CmaXAcEQ0ajjpt5D6BU%2BuNIlc6ZDb9gsYOb1GBvDIw0fIikx20yzmgxODf%2B8Wzz1pWkkhDuvRBja3jdr90Ph7VuWgVGVPoUMZV%2F4Yney6e1kGDAj%2BfByoJJTwyGWBnL3Wr9ysz5ZWlkPrepEX5nohcS0cs5PtsYLKw1nOxJdV%2B8GwnMF824SkdXkMXmg4N5Mw%3D%3D&uemps=0-0&ext=%7B%22prstate%22%3A%220%22%7D&ef=1&ep=%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1639972110147%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22area%22%3A%22CJrpCJG4Cv8nDNq1XzG5CNO2%22%2C%22d_model%22%3A%22JWunCK%3D%3D%22%2C%22wifiBssid%22%3A%22dW5hbw93bq%3D%3D%22%2C%22osVersion%22%3A%22CJO%3D%22%2C%22d_brand%22%3A%22WQvrb21f%22%2C%22screen%22%3A%22CtSmDsenCNqm%22%2C%22uuid%22%3A%22CWG4YWS1Y2G4CtG0ZtC2Ym%3D%3D%22%2C%22aid%22%3A%22CWG4YWS1Y2G4CtG0ZtC2Ym%3D%3D%22%2C%22openudid%22%3A%22CWG4YWS1Y2G4CtG0ZtC2Ym%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D&st=1639972126338&sign=b8a18f60cee8997f0413bd295d67cd46&sv=102&${body}`,
      headers: {
        "Host": 'api.m.jd.com',
        "Cookie": wsCookie,
        "accept": '*/*',
        "referer": '',
        'user-agent': 'okhttp/3.12.1;jdmall;apple;version/9.4.0;build/88830;screen/1440x3007;os/11;network/wifi;' + uuidv4(),
        'accept-language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'content-type': 'application/x-www-form-urlencoded;',
      },
    }
    console.log(option);
    $.post(option, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          data = ""
          $.logErr(err);
        } else {
          // console.log(resp)
          data = JSON.parse(data)['tokenKey']
        }
      } catch (error) {
        $.logErr(error)
      } finally {
        // console.log(data)
        resolve(data)
      }
    })
  })
}

// 获取sign
function getSign() {
  return new Promise(resolve => {
    // const option = {
    //   url: `http://43.135.90.23/wskey`,
    //   headers: {
    //     "user-agent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    //     // "Content-Type": "application/json"
    //     "Connection": "close"
    //   },
    //   // body: JSON.stringify({
    //   //   "url": 'https://home.m.jd.com/myJd/newhome.action'
    //   // }),
    // }

    // $.get(option, (err, resp, data) => {
    //   try {
    //     if (err) {
    //       console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
    //       console.log(resp)
    //       $.logErr(err);
    //     } else {
    //       data = JSON.parse(data)
    //       console.log(typeof data)
    //       let sign = ""
    //       for (const key in data) {
    //         sign += `${key}=${data[key]}&`
    //       }
    //       // let sign = `${data[1]}&${data[2]}&${data[3]}&${data[4]}&${data[5]}&${data[6]}`
    //       console.log(sign)
    //       // data = sign
    //     }
    //   } catch (e) {
    //     $.logErr(e, resp);
    //   } finally {
    //     // console.log(data)
    //     resolve(data);
    //   }
    // })
    let data = {"clientVersion":"10.2.2","client":"apple","sv":"120","st":new Date().getTime(),"uuid":"949f1cc6d00ef394","sign":"2b2a3aef7174c86953b27b8ce8725692"}
    // data = JSON.parse(data)
    // console.log(typeof data)
    let sign = ""
    for (const key in data) {
      sign += `${key}=${data[key]}&`
    }
    console.log(sign)
    resolve(sign)
  })
}
// axios.interceptors.response.use(function (response) {
//   // 2xx 范围内的状态码都会触发该函数。
//   // 对响应数据做点什么
//   console.log(response);
//   // return response;
// }, function (error) {
//   // 超出 2xx 范围的状态码都会触发该函数。
//   // 对响应错误做点什么
//   return Promise.reject(error);
// });

// 获取newCookie
function getJDCookie(tokenKey) {
  return new Promise(resolve => {

    const option = {
      method: 'get',
      url: `https://un.m.jd.com/cgi-bin/app/appjmp?tokenKey=${tokenKey}&to=https://h5.m.jd.com/babelDiy/Zeus/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html?babelChannel=ttt2&doTask=c`,
      headers: {
        "Connection": 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        "Accept": 'application/json, text/plain, */*',
        'Accept-Language': 'zh-cn',
        "User-Agent": 'okhttp/3.12.1;jdmall;apple;version/9.4.0;build/88830;screen/1440x3007;os/11;network/wifi;' + uuidv4(),
      },
      maxRedirects: 0, // default
      withCredentials: true,
      validateStatus: function (status) {
        return status >= 200 && status == 302;  // 默认
      },
    }
    $.post(config, async (err, resp, data) => {
      let data = ""
      // console.log(typeof resp);
      try {
        let headers = resp['headers']['set-cookie'].toString();
        let pt_pin = headers.match(/pt_pin.*?;/)[0];
        ck = headers.match(/pt_key.*?;/)[0] + pt_pin;
        
        if (ck.indexOf("fake") != -1) {
          console.log(`${pt_pin}: wskey状态失效`);
          ck = "";
        } else {
          console.log(`${pt_pin}: wskey状态正常`);
        }
      } catch (e) {
        ck = "";
        console.log(e);
      } finally {
        // console.log(data);
        resolve(data);
      }
    }) 
  })
}

function TotalBean() {
  return new Promise(async resolve => {
    // console.log(cookie)
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0 && data.base && data.base.nickname) {
              $.nickName = data.base.nickname;
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}

function timer(second) {
  return new Promise(resolve => {
    console.log(`定时${second}秒...`);
    return setTimeout(() => {
      resolve()
    }, second * 1000);
  })
}

// prettier-ignore
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
