let html = $response.body;

html =
  html.replace(/{"code":2000,"data":{"itemId":"IMTP1000006","offline":false,"purchaseInfoMap":{"1000139":{"defaultSkuFlag":false,"purchaseInfo":{"inventory":0,"canAddCart":false,"forbiddenBuyDesc":"附近暂无可售卖门店","limitCount":0,"inDeliveryArea":true,"showSelfPickUpBtn":false,"disable":false,"defaultSkuFlag":false,"ownerName":""}}},"showSaleUnit":false}}/g, `{"code":2000,"data":{"itemId":"IMTP1000006","offline":false,"purchaseInfoMap":{"1000139":{"defaultSkuFlag":true,"shopInfo":{"shopId":"133330681002","shopName":"诸暨市东福路贵州茅台专卖店","desc":"诸暨西子茅台酒销售有限公司","picUrl":"https://resource.moutai519.com.cn/mt-resource/static-union/1646277449020ef9.png","shopType":20,"shopTag":"代理","fullAddress":"绍兴市诸暨市东福路61号","shopTel":"057587384120","hasLicenseFlag":true,"businessCertificate":"http://obs-gzgy.cucloud.cn/yx-mt-gxq/f1df6e8247a64d0183453e64cf0e2a.jpg","foodBusinessLicense":"http://obs-gzgy.cucloud.cn/yx-mt-gxq/f1df6e8247a64d01835507fe642983.jpg"},"purchaseInfo":{"inventory":1,"canAddCart":false,"limitCount":0,"inDeliveryArea":true,"showSelfPickUpBtn":false,"disable":false,"defaultSkuFlag":false,"ownerName":"诸暨西子茅台酒销售有限公司"}}},"showSaleUnit":true}}`);


$done({ body: html});
