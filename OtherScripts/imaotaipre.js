let html = $response.body;

html =
  html.replace(/{"code":4031,"message":"库存不足"}/g, `{"code":2000,"data":{"userId":1050525502}}`);


$done({ body: html});
