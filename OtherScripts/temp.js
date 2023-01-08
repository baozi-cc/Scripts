/*
 {"code":200,"msg":"操作成功","data":{"status":0,"button_status":0,"goods_id":146142,"store_count":1050,"waist_image":"","sku_list":[{"image_url":"https://ecompic2.hitv.com/ecom/7925/5eff012f6331f250b8205b251fdf5ca1.png","spec1":"曜金黑","spec2":"","price":199900,"sub_price":199800,"store_count":1050,"key_name":"","image_id":0,"member_price":0,"tax_price":0,"market_price":199900,"sku_id":847617,"credits_num":0,"credits_amount":0,"cut_info":{"cut_price":100,"cut_store":50,"store_count":50,"buy_limit_type":0,"buy_limit_count":0},"buy_limit_tips":"","buy_limit_count":0,"waist_image":"","ship_price":0,"ship_info":"","is_huabei_free":0}],"shop_price":199900,"max_shop_price":199900,"sub_price":199800,"active_info":{"active_name":"年礼节晚会1元秒杀-第二轮","active_desc":"","begin_time":"2023-01-08 20:44:30","end_time":"2023-01-08 21:05:59","server_time":"2023-01-08 20:05:07","cut_price":100,"price_name":"抢购价","price_text":"市场价","active_type":6,"active_status":-1,"is_remind":0,"remind_time":"2023-01-08 20:41:30","active_id":10372},"jump_url":"https://xm.mgtv.com/super-spike.html?isHideMenu=1&isHideFeeds=1&isHideNavBar=1","active_process_img":"https://ecompic2.hitv.com/ecom/6/0823cd235ec6c2d30a9235ec5ec7d6c8.png","sub_type":0}}
*/


let html = $response.body;

html =
  html.replace(/button_status":0,/g, `button_status":1,`);

html =
  html.replace(/active_status":-1,/g, `active_status":1,`);
$done({ body: html});

/*
$done({ body: '{"code":200,"msg":"操作成功","data":{"status":0,"button_status":1,"goods_id":146142,"store_count":1050,"waist_image":"","sku_list":[{"image_url":"https://ecompic2.hitv.com/ecom/7925/5eff012f6331f250b8205b251fdf5ca1.png","spec1":"曜金黑","spec2":"","price":199900,"sub_price":199800,"store_count":1050,"key_name":"","image_id":0,"member_price":0,"tax_price":0,"market_price":199900,"sku_id":847617,"credits_num":10,"credits_amount":1,"cut_info":{"cut_price":100,"cut_store":50,"store_count":50,"buy_limit_type":1,"buy_limit_count":7},"buy_limit_tips":"","buy_limit_count":7,"waist_image":"","ship_price":0,"ship_info":"","is_huabei_free":0}],"shop_price":199900,"max_shop_price":199900,"sub_price":199800,"active_info":{"active_name":"年礼节晚会1元秒杀-第二轮","active_desc":"","begin_time":"2023-01-08 20:44:30","end_time":"2023-01-08 21:05:59","server_time":"2023-01-08 20:05:07","cut_price":100,"price_name":"抢购价","price_text":"市场价","active_type":6,"active_status":1,"is_remind":0,"remind_time":"2023-01-08 20:41:30","active_id":10372},"jump_url":"https://xm.mgtv.com/super-spike.html?isHideMenu=1&isHideFeeds=1&isHideNavBar=1","active_process_img":"https://ecompic2.hitv.com/ecom/6/0823cd235ec6c2d30a9235ec5ec7d6c8.png","sub_type":0}}' });
*/
