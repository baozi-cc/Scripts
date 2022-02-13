
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `http://api.gaoqingdianshi.com/api/cash/v1/zz/withdrawal?code=zz2021%40LzxgAhyrSH&rs=zqzv9fl6Uh0ny0TG6qvpCcX&sign=1d14e8ed5959557f7098bbbfeb73210a`;
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
'cuuid' : `782849c10b17fd216a9189b9c9fa9a63`,
'ispId' : ``,
'uuid' : `9e1b8d6fdf8e0fe0`,
'Accept-Language' : `zh-Hans-CN;q=1, en-CN;q=0.9`,
'User-Agent' : `Dsj/Client1.2`,
'appId' : `19227f89ea1a166451593601eb8a1b4f`,
'areaCode' : `330000`,
'MarketChannelName' : `Iphone`,
'countryCode' : ``,
'GpsCity' : ``,
'Host' : `api.gaoqingdianshi.com`,
'Authorization' : `TmpZNVpEa3lOR0ZqWWpRMk5EUXlZVGhrWlRreU5UUTVNalk1TVRJNVpqUT18MTY0MzUxMzU5MTY5MTcwOTM4OHwzZDAyZmNhZTlhZmY0MjJhZjcwMzRmZmQ2NThlZTE5MjE2NTU0ZjFk`,
'Cache-Control' : `no-cache`,
'hwModel' : `iPhone13,2`,
'ethMac' : ``,
'Connection' : `keep-alive`,
'ssid' : ``,
'language' : `zh_CN`,
'user_level_score' : `8729`,
'hwBrand' : `iPhone`,
'erid' : `88851`,
'userid' : `ad083b83fd9374192701de349fe1d234`
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
