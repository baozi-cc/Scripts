const APIKey = 'CookiesJD' //需要更新的cookie名称
const $ = new API('ql', false)
const CacheKey = `#${APIKey}`

const jdHelp = JSON.parse($.read('#jd_ck_remark') || '{}')
let remark = []
try {
  remark = JSON.parse(jdHelp.remark || '[]')
} catch (e) {
  console.log(e)
}

const _TGUserID = $.getData('CreamK_TG_User_ID');
const _TGBotToken = $.getData('CreamK_TG_Bot_Token');

$.TGBotToken = _TGBotToken;
$.TGUserIDs = [];
if (_TGUserID) {
  $.TGUserIDs.push(_TGUserID);
}

//tg通知
function updateCookie(cookie, TGUserID) {
  return new Promise((resolve) => {
    const opts = {
      url: `https://api.telegram.org/bot${$.TGBotToken}/sendMessage`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `chat_id=${TGUserID}&text=${cookie}&disable_web_page_preview=true`,
    };

    $.post(opts, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
        } else {
          data = JSON.parse(data);
          if (data.ok) {
            console.log(`已发送 wskey(${cookie}) 至 ${TGUserID}🎉\n`);
            const resData = `已发送 wskey(${cookie}) 至 ${TGUserID}🎉`;
            $.msg(`${resData}`,``)
          } else if (data.error_code === 400) {
            console.log(`发送失败，请联系 ${TGUserID}。\n`);
            resData = `发送失败，请联系 ${TGUserID}。`;
            $.msg(`${resData}`,``)
          } else if (data.error_code === 401) {
            console.log(`${TGUserID} bot token 填写错误。\n`);
            resData = `${TGUserID} bot token 填写错误。`;
            $.msg(`${resData}`,``)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}


//-------------------
//  🌟 jd金融获取ck
//-------------------
if($request&&$request.url.indexOf("recommendGetWay")>=0) {
    const Cookie = $request.headers['Cookie']
    const pt_pin="pt_pin="+Cookie.match(/pt_pin=(.+?);/)[1];
    const pt_key="pt_key="+Cookie.match(/pt_key=(.+?);/)[1];
    const jdCookie = pt_key+" "+pt_pin;
    $.log(`[${jsname}] 获取jdCookie请求: 成功🎉,jdCookie: ${jdCookie}`)
    $.msg(`获取jdCookie: 成功🎉`, ``)
    for (const userId of $.TGUserIDs) {
        updateCookie(jdCookie, userId)  
    }
  
  
  
}


//从qx中读取变量名称
function getCache() {
  return JSON.parse($.read(CacheKey) || '[]')
}

//编码变量
function getUsername(ck) {
  if (!ck) return ''
  return decodeURIComponent(ck.match(/pin=(.+?);/)[1])
}

//判断变量是否失效
async function TotalBean(Cookie) {
    const opt = {
      url: 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2&sceneval=2&g_login_type=1&g_ty=ls&isLogin=1',
      headers: {
        cookie: Cookie,
        Referer: 'https://home.m.jd.com/',
      },
    }
    return $.http.get(opt).then((response) => {
      try {
        return JSON.parse(response.body)
      } catch (e) {
        return false
      }
    })
  }
  
//登陆助手
function updateJDHelp(username) {
    if (remark.length) {
        const newRemark = remark.map((item) => {
            if (item.username === username) {
                return { ...item, status: '正常' }
            }
            return item
        })
        jdHelp.remark = JSON.stringify(newRemark, null, `\t`)
        $.write(JSON.stringify(jdHelp), '#jd_ck_remark')
    }
}
  


function ENV() {
  const isQX = typeof $task !== 'undefined'
  const isLoon = typeof $loon !== 'undefined'
  const isSurge = typeof $httpClient !== 'undefined' && !isLoon
  const isJSBox = typeof require == 'function' && typeof $jsbox != 'undefined'
  const isNode = typeof require == 'function' && !isJSBox
  const isRequest = typeof $request !== 'undefined'
  const isScriptable = typeof importModule !== 'undefined'
  return { isQX, isLoon, isSurge, isNode, isJSBox, isRequest, isScriptable }
}

function API(name = 'untitled', debug = false) {
  const { isQX, isLoon, isSurge, isNode, isJSBox, isScriptable } = ENV()
  return new (class {
    constructor(name, debug) {
      this.name = name
      this.debug = debug

      this.http = HTTP()
      this.env = ENV()

      this.node = (() => {
        if (isNode) {
          const fs = require('fs')

          return {
            fs,
          }
        } else {
          return null
        }
      })()
      this.initCache()

      const delay = (t, v) =>
        new Promise(function (resolve) {
          setTimeout(resolve.bind(null, v), t)
        })

      Promise.prototype.delay = function (t) {
        return this.then(function (v) {
          return delay(t, v)
        })
      }
    }

    // persistance

    // initialize cache
    initCache() {
      if (isQX) this.cache = JSON.parse($prefs.valueForKey(this.name) || '{}')
      if (isLoon || isSurge)
        this.cache = JSON.parse($persistentStore.read(this.name) || '{}')

      if (isNode) {
        // create a json for root cache
        let fpath = 'root.json'
        if (!this.node.fs.existsSync(fpath)) {
          this.node.fs.writeFileSync(
            fpath,
            JSON.stringify({}),
            { flag: 'wx' },
            (err) => console.log(err)
          )
        }
        this.root = {}

        // create a json file with the given name if not exists
        fpath = `${this.name}.json`
        if (!this.node.fs.existsSync(fpath)) {
          this.node.fs.writeFileSync(
            fpath,
            JSON.stringify({}),
            { flag: 'wx' },
            (err) => console.log(err)
          )
          this.cache = {}
        } else {
          this.cache = JSON.parse(
            this.node.fs.readFileSync(`${this.name}.json`)
          )
        }
      }
    }

    // store cache
    persistCache() {
      const data = JSON.stringify(this.cache)
      if (isQX) $prefs.setValueForKey(data, this.name)
      if (isLoon || isSurge) $persistentStore.write(data, this.name)
      if (isNode) {
        this.node.fs.writeFileSync(
          `${this.name}.json`,
          data,
          { flag: 'w' },
          (err) => console.log(err)
        )
        this.node.fs.writeFileSync(
          'root.json',
          JSON.stringify(this.root),
          { flag: 'w' },
          (err) => console.log(err)
        )
      }
    }

    write(data, key) {
      this.log(`SET ${key}`)
      if (key.indexOf('#') !== -1) {
        key = key.substr(1)
        if (isSurge || isLoon) {
          return $persistentStore.write(data, key)
        }
        if (isQX) {
          return $prefs.setValueForKey(data, key)
        }
        if (isNode) {
          this.root[key] = data
        }
      } else {
        this.cache[key] = data
      }
      this.persistCache()
    }

    read(key) {
      this.log(`READ ${key}`)
      if (key.indexOf('#') !== -1) {
        key = key.substr(1)
        if (isSurge || isLoon) {
          return $persistentStore.read(key)
        }
        if (isQX) {
          return $prefs.valueForKey(key)
        }
        if (isNode) {
          return this.root[key]
        }
      } else {
        return this.cache[key]
      }
    }

    delete(key) {
      this.log(`DELETE ${key}`)
      if (key.indexOf('#') !== -1) {
        key = key.substr(1)
        if (isSurge || isLoon) {
          return $persistentStore.write(null, key)
        }
        if (isQX) {
          return $prefs.removeValueForKey(key)
        }
        if (isNode) {
          delete this.root[key]
        }
      } else {
        delete this.cache[key]
      }
      this.persistCache()
    }

    // notification
    notify(title, subtitle = '', content = '', options = {}) {
      const openURL = options['open-url']
      const mediaURL = options['media-url']

      if (isQX) $notify(title, subtitle, content, options)
      if (isSurge) {
        $notification.post(
          title,
          subtitle,
          content + `${mediaURL ? '\n多媒体:' + mediaURL : ''}`,
          {
            url: openURL,
          }
        )
      }
      if (isLoon) {
        let opts = {}
        if (openURL) opts['openUrl'] = openURL
        if (mediaURL) opts['mediaUrl'] = mediaURL
        if (JSON.stringify(opts) == '{}') {
          $notification.post(title, subtitle, content)
        } else {
          $notification.post(title, subtitle, content, opts)
        }
      }
      if (isNode || isScriptable) {
        const content_ =
          content +
          (openURL ? `\n点击跳转: ${openURL}` : '') +
          (mediaURL ? `\n多媒体: ${mediaURL}` : '')
        if (isJSBox) {
          const push = require('push')
          push.schedule({
            title: title,
            body: (subtitle ? subtitle + '\n' : '') + content_,
          })
        } else {
          console.log(`${title}\n${subtitle}\n${content_}\n\n`)
        }
      }
    }

    // other helper functions
    log(msg) {
      if (this.debug) console.log(msg)
    }

    info(msg) {
      console.log(msg)
    }

    error(msg) {
      console.log('ERROR: ' + msg)
    }

    wait(millisec) {
      return new Promise((resolve) => setTimeout(resolve, millisec))
    }

    done(value = {}) {
      if (isQX || isLoon || isSurge) {
        $done(value)
      } else if (isNode && !isJSBox) {
        if (typeof $context !== 'undefined') {
          $context.headers = value.headers
          $context.statusCode = value.statusCode
          $context.body = value.body
        }
      }
    }
  })(name, debug)
}
