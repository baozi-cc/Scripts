
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `http://api.gaoqingdianshi.com/api/cash/v1/zz/withdrawal?code=zz2021%40oLBxKAwvNe&rs=C3bYOADI1Tc4pkRm&sign=ba09611cd57b9653812dd74bb1c5b062`;
const method = `GET`;
const headers = {
'Accept' : `*/*`,
'user_level' : `3`,
'hwMac' : ``,
'GpsLatitude' : `29.78264`,
'AppVerName' : `2.0.2`,
'Accept-Encoding' : `gzip, deflate`,
'routerMac' : `98bb991fee1e`,
'cityCode' : `330600`,
'AppVerCode' : `257`,
'GpsLontitude' : `120.3894`,
'Generation' : `com.dianshijia.mobile.ios`,
'gpsCityCode' : `330600`,
'cuuid' : `522f0a4ea090867420a9bb3b64034960`,
'ispId' : ``,
'uuid' : `5880749bfe387146`,
'Accept-Language' : `zh-Hans;q=1`,
'User-Agent' : `Dsj/Client1.2`,
'appId' : `19227f89ea1a166451593601eb8a1b4f`,
'areaCode' : `330000`,
'MarketChannelName' : `Iphone`,
'countryCode' : `CN`,
'GpsCity' : ``,
'Host' : `api.gaoqingdianshi.com`,
'Authorization' : `WXpCaE5qWTVNV1prTXpjNE5qY3pNekF6TkdOaU56ZzNNV1UwTnpobU9UWT18MTY0MjYwNzI1MjkxMTkxNzIwOHxhZTA1OWM5NWFiY2RmMjBmMDJjZTJmMGFmZjhjNDY0ZTBjNWY2MTg2`,
'Cache-Control' : `no-cache`,
'hwModel' : `iPhone13,2`,
'ethMac' : ``,
'Connection' : `keep-alive`,
'ssid' : `75b62baf-070b-43bd-89fc-7c5b143df162`,
'language' : `zh_CN`,
'user_level_score' : `8386`,
'hwBrand' : `iPhone`,
'erid' : `29868`,
'userid' : `6d38dad4aec3613e9d264501a66230ff`
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
