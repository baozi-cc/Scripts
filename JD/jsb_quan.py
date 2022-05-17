from email import message
import json
import math
import random
import threading
import time
import datetime
import requests
import os
import sys
import re
import  urllib
import logging
import traceback

# 获取时间戳网址：https://tool.lu/timestamp/   5/8 5/7 23:59:58



######################################################
#可以改的参数
#1、券的api  quan_api
#2、可以读取青龙的cookie
#3、使用cookie的下标（从0开始） quan_account_index ，默认执行第一个
######################################################


range_n = 30  # 单个cookie线程个数
range_sleep = 0.1  # 间隔时间

# 没用的参数
log_list = []
atime = 0


logger = logging.getLogger(name=None)  # 创建一个日志对象
logging.Formatter("%(message)s")  # 日志内容格式化
logger.setLevel(logging.INFO)  # 设置日志等级
logger.addHandler(logging.StreamHandler())  # 添加控制台日志
# logger.addHandler(logging.FileHandler(filename="text.log", mode="w"))  # 添加文件日志


# 券的参数
def get_args(url):
    deUrl=urllib.parse.unquote(url)
    start_pos=re.search("args", deUrl).start()
    start_pos=start_pos+7
    end_pos=len(deUrl)-2
    args=deUrl[start_pos:end_pos]
    return args

if 'quan_api' in os.environ:
    quan_api=os.environ["quan_api"]
    args=get_args(quan_api)
else:
    args = 'key=CB80DDB21929DB2DB9849A60F929CCB99B3BF927A75E71562ADB7CEC61846545338F6E4517C1973762A51B43E2C88518_bingo,roleId=3FE9EECAAA41B666E4FFAF79F20E21120520F1A5AFE5C9E8D77BD263F6726B9E5E06C7051840093D00E358BF32A400ED69C31825CC6E0B4002396D97E04CBE9B95BD50D3490D09DC4746C78A5C257455D11BB1F359F00BC8367524EC3D44EDDA221AD90D25402C0AED4BCE9EFBC506428188DEBB9A3B93AA72D7CF3C822077B7D4A2456215E02A8A3DA720FF426525BC40D44921C13A1FE2CDFEDBB98CF065955FEED95F578D1A7D0C8ED8051EBD5E53_bingo,strengthenKey=4C8818C1732D1A7B9733D611F28BD8B57923ADE220C9B60370F65B533E02E0F8E6A0FEFA632101D3D5409FE4F92580CF_bingo'



# 获取cookie
if 'JD_COOKIE' in os.environ:
    ori_cookies =os.environ["JD_COOKIE"].split('&')
else:
    ori_cookies =['' ]
if len(ori_cookies)==0:
    logger.info("未发现cookie")
    sys.exit(0)

#获取抢券下标,并根据下标提取ck
if 'quan_account_index' in os.environ:
    quan_account_index=os.environ["quan_account_index"]
else:
    quan_account_index="0"

account_index=re.findall(r"\d+",quan_account_index)
cookies=[]
for i in range(len(account_index)):
    if int(account_index[i])>len(ori_cookies)-1:
        logger.info("下标超出，请检查参数 quan_account_index ,默认从0开始哦！")
        sys.exit(0)
    else:
        cookies.append(ori_cookies[int(account_index[i])])




# 总线程个数
range_n = int(len(cookies)) *range_n  


# 加载通知
def load_send() -> None:
    logger.info("加载推送功能中...")
    global send
    send = None
    cur_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(cur_path)
    if os.path.exists(cur_path + "/notify.py"):
        try:
            from notify import send
        except Exception:
            send = None
            logger.info(f"❌加载通知服务失败!!!\n{traceback.format_exc()}")



#获取下一个时间戳
def get_next_timeStamp():
    # 当前时间
    now_time = datetime.datetime.now()
    # 把根据当前时间计算下一个整点时间戳
    integer_time = (now_time + datetime.timedelta(hours=1)).strftime("%Y-%m-%d %H:00:00")
    time_array = time.strptime(integer_time, "%Y-%m-%d %H:%M:%S")
    time_stamp = int(time.mktime(time_array))
    return time_stamp


def get_log_list(num):
    global log_list
    while(len(log_list)<num):
        url = f'http://log.creamk.eu.org/log'
        res = requests.get(url=url).json()
        log_list.append(res)
        time.sleep(0.1)
    return log_list


def randomString(e):
    t = "0123456789abcdef"
    a = len(t)
    n = ""
    for i in range(e):
        n = n + t[math.floor(random.random() * a)]
    return n


def Ua():
    UA = f'jdapp;iPhone;10.2.0;13.1.2;{randomString(40)};M/5.0;network/wifi;ADID/;model/iPhone8,1;addressid/2308460611;appBuild/167853;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;'
    return UA


def qiang_quan(cookie, i):
    url = 'https://api.m.jd.com/client.action?functionId=lite_newBabelAwardCollection&client=wh5'
    headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        'origin': 'https://pro.m.jd.com',
        "Referer": "https://pro.m.jd.com/jdlite/active/3H885vA4sQj6ctYzzPVix4iiYN2P/index.html?lng=106.476617&lat=29.502674&sid=fbc43764317f538b90e0f9ab43c8285w&un_area=4_50952_106_0",
        "Cookie": cookie,
        "User-Agent": Ua()
    }

    body = json.dumps({"activityId": "vN4YuYXS1mPse7yeVPRq4TNvCMR",
                       "scene": "1",
                       "args": args,
                       "log": log_list[i]['log'],
                       "random": log_list[i]['random']}
                      )
    data = f"body={body}"
    try:
        res = requests.post(url=url, headers=headers, data=data).json()
        if res['code'] == '0':
            logger.info(res['subCodeMsg'])
            if res['subCodeMsg']=='领取成功！感谢您的参与，祝您购物愉快~':
                send('🔔京东极速版抢券!',res['subCodeMsg'])
                sys.exit(0)
            if res['subCodeMsg'].find('抢完'):
                sys.exit(0)
        else:
            logger.info(res['errmsg'])
            
    except:
        pass

def jdtime():
    url = 'http://api.m.jd.com/client.action?functionId=queryMaterialProducts&client=wh5'
    headers = {
        "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
    }

    try:
        res = requests.get(url=url, headers=headers, timeout=1).json()
        return int(res['currentTime2'])
    except:
        return 0

 

if __name__ == '__main__':
    
    # 加载通知部分
    load_send()

    logger.info('极速版抢券准备...')
    logger.info('开始获取log...')
    get_log_list(range_n)
    logger.info('log获取完毕!\n')

    logger.info('开始配置线程...')
    tasks = list()
    if len(log_list) != 0:
        logger.info(f'{len(log_list)}条log获取完毕') 
        j=0
        for i in range(int(range_n)):
            tasks.append(threading.Thread(target=qiang_quan, args=(cookies[j], i)))
            j=j+1
            j=j%len(cookies)
    else:
        logger.infot('暂无可用log')
    logger.info('线程配置完毕!\n')
    
    logger.info('开始等待...')
    starttime =get_next_timeStamp()*1000-2000

    if starttime-time.time()*1000>20000:
        logger.info(f'等待时间过长,为节约资源将先睡眠{(starttime-time.time()*1000)/1000}秒!')
        time.sleep((starttime-time.time()*1000)/1000)

    while True:
        if starttime - int(time.time()*1000) <= 1000:
            break
        else:
            if int(time.time()*1000) - atime >= 1000:
                atime = int(time.time()*1000)
                logger.info(f'还差{int((starttime - int(time.time()*1000)) / 1000)}秒!')   

    logger.info('抢券开始喽!!')
    while True:
        if jdtime() >= starttime:
            i=0
            for task in tasks:
                task.start()
                if i%len(cookies) == len(cookies)-1:  #一组cookie跑完
                    time.sleep(range_sleep)
                i=i+1
            for task in tasks:
                task.join()
            break
    logger.info('抢券结束')
