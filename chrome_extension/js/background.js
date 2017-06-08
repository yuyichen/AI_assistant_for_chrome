//判断用户登录状态
chrome.cookies.get({ url: 'https://aiwriting.io/', name: 'user' }, function(cookie) {
    if (!cookie) {
    	chrome.browserAction.setIcon({path:'../icon_gray.png'});
    } else{
    	chrome.browserAction.setIcon({path:'../icon.png'});
    }
})

// 
/**
 * 保存链接
 * @param  {[type]}   myUrl [链接地址]
 * @param  {Function} cb    [回调]
 * @return {[type]}         [description]
 */
function saveUrl(myUrl,cb){
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

    var encodedUrl = Base64.encode(myUrl);
    $.ajax({
    	async:false,//必须为同步方式,否则onMessage中的sendResponse无法发送数据
        url: 'https://aiwriting.io/material/json/import/page/url?url=' + encodedUrl,
        type: 'get',
        success: function(res) {
            cb && cb(res);
        }
    })
}

//收藏本页
chrome.contextMenus.create({id:'savePageToAiChuang',title:'收藏本页到我的爱创',contexts:['page']}, function (error){
    error && console.log(error)
});

//链接右键
chrome.contextMenus.create({id:'saveUrlToAiChuang',title:'收藏链接文章到我的爱创',contexts:['link']}, function (error){
    error && console.log(error)
});

//图片右键
chrome.contextMenus.create({id:'saveImgToAiChuang',title:'收藏图片到我的爱创',contexts:['image']}, function (error){
    error && console.log(error)
});

//选择文本右键
chrome.contextMenus.create({id:'saveSelectionToAiChuang',title:'收藏文字到我的爱创',contexts:['selection']}, function (error){
    error && console.log(error)
});



// 右键触发的保存事件
chrome.contextMenus.onClicked.addListener(function(info){
	console.log(info)
	if(!localStorage['userAccount']){
		chrome.notifications.create({
		    "type": "basic",
		    "iconUrl": chrome.extension.getURL("icon_48.png"),
		    "title": "AI创助手提醒您",
		    "message": '请先登录爱创'
		});
		// alert("请先登录爱创")
		return;
	}
	switch(info.menuItemId){
		case "savePageToAiChuang":
		saveUrl(info.pageUrl, function(res) {
		    if (res.status == "success") {
		    	chrome.notifications.create({
				    "type": "basic",
				    "iconUrl": chrome.extension.getURL("icon_48.png"),
				    "title": "AI创助手提醒您",
				    "message": '网页内容抓取，抓取成功'
				},function(notification){
			 	setTimeout(function(){
				chrome.notifications.clear(notification);
			},3000)
			 });
		        // alert('网页内容抓取，抓取成功');
		    } else {
		    	chrome.notifications.create({
				    "type": "basic",
				    "iconUrl": chrome.extension.getURL("icon_48.png"),
				    "title": "AI创助手提醒您",
				    "message": res.message
				 });
		        // alert(res.message);
		    }
		})
		break;
		case "saveUrlToAiChuang":
		saveUrl(info.linkUrl, function(res) {
		    if (res.status == "success") {
		    	chrome.notifications.create({
				    "type": "basic",
				    "iconUrl": chrome.extension.getURL("icon_48.png"),
				    "title": "AI创助手提醒您",
				    "message": '网页内容抓取，抓取成功'
				},function(notification){
			 	setTimeout(function(){
				chrome.notifications.clear(notification);
			},3000)
			 });
		        // alert('网页内容抓取，抓取成功');
		    } else {
		    	chrome.notifications.create({
				    "type": "basic",
				    "iconUrl": chrome.extension.getURL("icon_48.png"),
				    "title": "AI创助手提醒您",
				    "message": res.message
				 });
		        // alert(res.message);
		    }
		})
		break;
		case "saveImgToAiChuang":
			chrome.notifications.create({
			    "type": "basic",
			    "iconUrl": chrome.extension.getURL("icon_48.png"),
			    "title": "AI创助手提醒您",
			    "message": "图片:"+info.srcUrl
			 },function(notification){
			 	setTimeout(function(){
				chrome.notifications.clear(notification);
			},3000)
			 });
		// alert(info.srcUrl);
		break;
		case "saveSelectionToAiChuang":
		// alert(info.selectionText);
			chrome.notifications.create({
			    "type": "basic",
			    "iconUrl": chrome.extension.getURL("icon_48.png"),
			    "title": "AI创助手提醒您",
			    "message": "文本:"+info.selectionText
			 },function(notification){
			 	setTimeout(function(){
				chrome.notifications.clear(notification);
			},3000)
			 });
			
		break;
	}
   
})

// 弹窗的保存事件
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
    if (request.saveLink) {
        saveUrl(request.saveLink, function(res) {
        	console.log(res)
	    	sendResponse(res);
		})
		// sendResponse({status:'aaaa'})
    }
})

