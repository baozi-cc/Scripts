
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `http://api.gaoqingdianshi.com/api/cash/v1/zz/withdrawal?code=zz2021%40LzxgAhyrSH&rs=7Mb5nSVwbfFbK70TYcIYjJiStO4&sign=9fda846f0c5d70a38adf119fc75e089a`;
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
'cuuid' : `bcf52f9e0ca84b659da9ebfd80f541f5`,
'ispId' : ``,
'uuid' : `42679b4ad2d4dd10`,
'Accept-Language' : `zh-Hans-CN;q=1, en-CN;q=0.9`,
'User-Agent' : `Dsj/Client1.2`,
'appId' : `19227f89ea1a166451593601eb8a1b4f`,
'areaCode' : `330000`,
'MarketChannelName' : `Iphone`,
'countryCode' : ``,
'GpsCity' : ``,
'Host' : `api.gaoqingdianshi.com`,
'Authorization' : `TlRreE5UVXlaRGRrTjJWak16YzFORFUxTkdZeVkyUTJNalEwWlRNMllqST18MTY0MzUxMjQ4MDQ4NDUwNDQyMnxmN2I3ODNhMDNmNDg5NGQxMGY4NWJjZDQ5NjBiMzZmOGQ3ZTYwMmNk`,
'Cache-Control' : `no-cache`,
'hwModel' : `iPhone13,2`,
'ethMac' : ``,
'Connection' : `keep-alive`,
'ssid' : ``,
'language' : `zh_CN`,
'user_level_score' : `3709`,
'hwBrand' : `iPhone`,
'erid' : `64679`,
'userid' : `54f73059d9e3f108702be89ec897d2ca`
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
