let html = $response.body;


let answer =
  html.match(/answer": "\d/g);

if ($request.method === 'GET') {
  for (var i=0;i<answer.length;i++)
{ 
    answer[i] = answer[i].replace(/answer": "/, ``);
}
  $notify('银联答题', answer?.join('、'), '');
}

$done();
