
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `http://api.gaoqingdianshi.com/api/cash/v1/zz/withdrawal?code=zz2021%40LzxgAhyrSH&rs=Ql1qrWFr&sign=7832f27fba27c81ec0eae3a683140d09`;
const method = `GET`;
const headers = {
'Accept' : `*/*`,
'user_level' : `2`,
'hwMac' : ``,
'GpsLatitude' : `0`,
'AppVerName' : `2.0.4`,
'Accept-Encoding' : `gzip, deflate`,
'routerMac' : ``,
'cityCode' : `330600`,
'AppVerCode' : `263`,
'GpsLontitude' : `0`,
'Generation' : `com.dianshijia.mobile.ios`,
'gpsCityCode' : ``,
'cuuid' : `31c0ce8df99ab6cf54c3dab73ddf7b47`,
'ispId' : ``,
'uuid' : `cdad367722047ae5`,
'Accept-Language' : `zh-Hans-CN;q=1, en-CN;q=0.9`,
'User-Agent' : `Dsj/Client1.2`,
'appId' : `19227f89ea1a166451593601eb8a1b4f`,
'areaCode' : `330000`,
'MarketChannelName' : `Iphone`,
'countryCode' : ``,
'GpsCity' : ``,
'Host' : `api.gaoqingdianshi.com`,
'Authorization' : `TkRNNE9URTRNR1EzT0dNMVl6bGpNakF3T0RWaE1qbGxORFZqT0RFNU5qST18MTY0MzUxMjk0MjI4OTQyMzMwM3wxMjYyMDQ0YmQyMzY3YmI3NGZmY2NjNmY2MjFmMWQ2YmIwNThkY2M4`,
'Cache-Control' : `no-cache`,
'hwModel' : `iPhone13,2`,
'ethMac' : ``,
'Connection' : `keep-alive`,
'ssid' : ``,
'language' : `zh_CN`,
'user_level_score' : `4940`,
'hwBrand' : `iPhone`,
'erid' : `77132`,
'userid' : `7af8fcec97b63dd8cfc7a3a0bfab18b0`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
