
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `http://api.gaoqingdianshi.com/api/cash/v1/zz/withdrawal?code=zz2021%40LzxgAhyrSH&rs=QUXnBTgyI0UUTh1qR4SYUYn0J&sign=2dc38811f861c07e1fb318bc1d992854`;
const method = `GET`;
const headers = {
'Accept' : `*/*`,
'user_level' : `3`,
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
'cuuid' : `013dc0535a475630542a6641ebd8e08c`,
'ispId' : ``,
'uuid' : `88888888888888888888888888888888`,
'Accept-Language' : `zh-Hans-CN;q=1, en-CN;q=0.9`,
'User-Agent' : `Dsj/Client1.2`,
'appId' : `19227f89ea1a166451593601eb8a1b4f`,
'areaCode' : `330000`,
'MarketChannelName' : `Iphone`,
'countryCode' : ``,
'GpsCity' : ``,
'Host' : `api.gaoqingdianshi.com`,
'Authorization' : `TVRZMFpXVXlOREUzT1RobFlqazJOamMyT0dNMFl6ZzFaakUwTVRsaE5EWT18MTY0MzUxMzM4MzczOTE5MTczNXxhZDRjYTVhNjg1Y2UyM2ZkMDg0OWQzYTAwZDIxOGI3Y2YxN2UzZDYz`,
'Cache-Control' : `no-cache`,
'hwModel' : `iPhone13,2`,
'ethMac' : ``,
'Connection' : `keep-alive`,
'ssid' : ``,
'language' : `zh_CN`,
'user_level_score' : `6414`,
'hwBrand' : `iPhone`,
'erid' : `98997`,
'userid' : `44c6851ba6971eb2af7b65627d8ed448`
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
