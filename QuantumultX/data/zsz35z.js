/*
"stockStatus"
stockNum"
corner"
"2
"productNo"
"O"
"O"
"rushBeqinTime

*/


let html = $response.body;

html =
  html.replace(/"rushBeqinTime":"[\d:]+",/g, `"rushBeqinTime":"00:00:00",`);
html =
  html.replace(/"stockStatus":"0",/g, `"stockStatus":"2",`);
html =
  html.replace(/"stockNum":"0",/g, `"stockNum":"777",`);
//html =
//  html.replace(/"corner":"2",/g, `"corner":"3",`);


$done({ body: html });
