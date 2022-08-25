import time

import requests
import json
import logging
import traceback
import os
import sys
from notify import send


logger = logging.getLogger(name=None)  # 创建一个日志对象
logging.Formatter("%(message)s")  # 日志内容格式化
logger.setLevel(logging.INFO)  # 设置日志等级
logger.addHandler(logging.StreamHandler())  # 添加控制台日志


# 加载通知
def load_send() -> None:
    logger.info("加载推送功能中...")
    global send
    send = None
    cur_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(cur_path)
    if os.path.exists("notify.py"):
        try:
            from notify import send
        except Exception:
            send = None
            logger.info(f"❌加载通知服务失败!!!\n{traceback.format_exc()}")


def checkin(cookie):
    message=''
    draw_url='https://mall.oclean.com/API/VshopProcess.ashx?action=ActivityDraw&ActivityId=9&clientType=5&client=5&openId='+cookie
    checkin_url='https://mall.oclean.com/API/VshopProcess.ashx?action=SignIn&SignInSource=5&clientType=5&client=5&openId='+cookie
    
    
    #转盘抽奖
    draw_ret=requests.post(url=draw_url).json()
    if(draw_ret['Status']=='OK' or draw_ret['Data']['AwardGrade']):
        draw_detail='转盘抽奖 :'+ draw_ret['Data']['Msg'] + '：' +draw_ret['Data']['AwardSubName']+ '(一等奖可能是未中奖)。'
        #logger.info('Oclean_mini draw succeed response :'+ draw_ret['Data']['Msg'] + '：' +draw_ret['Data']['AwardSubName']+ '\n一等奖可能是未中奖。。')
    else:
        draw_detail="转盘抽奖: \n" + str(draw_ret)
        #logger.info("Oclean_mini draw failed response : \n" + str(draw_ret))
    
    #签到
    checkin_ret=requests.post(checkin_url).json()
    if checkin_ret['Status'] == "OK" and checkin_ret['Code'] == 1:
        todayget = checkin_ret['Data']['points']
        total = checkin_ret['Data']['integral']
        checkin_detail = '签到成功！🦷, 签到获得 ' + str(todayget) + ' 积分，账户共有 ' + str(total) + ' 积分。'
    elif checkin_ret['Status'] == "OK" and checkin_ret['Code'] == 2:
        total = checkin_ret['Data']['integral']
        checkin_detail = '重复签到！🥢, 账户共有 ' + str(total)+ ' 积分。'
    elif  checkin_ret['Status'] == "NO":
        checkin_detail = 'Cookie 失效或未获取,请按照脚本开头注释获取 Cookie。'
    else:
        checkin_detail='签到接口请求失败，详情请见日志。'
    
    message=draw_detail+'\n    '+checkin_detail
    return message


def main_handler(event, context):
    message=''
    #读取ck（按照&分割）
    if 'oclean_ck' in os.environ:
        oclean_ck= os.environ["oclean_ck"]
    oclean_ck =oclean_ck.split('#')
    for i in range(len(oclean_ck)):
        message=message+"账号"+str(i+1)+':\n    '
        message+=checkin(oclean_ck[i]) 
        message+='\n'
    logger.info(message)
    send('欧克林签到❤!',message)
