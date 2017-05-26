var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

//判断用户登录状态
chrome.cookies.get({ url: 'https://aiwriting.io/', name: 'user' }, function(cookie) {
    if (cookie) {
        document.getElementById('loginBox').style.display = "none";
        document.getElementById('saveBox').style.display = "block";
        document.getElementById('userAccount').innerHTML = localStorage['userAccount'];
        // chrome.browserAction.setBadgeText({ text: '' });
    } else {
        document.getElementById('loginBox').style.display = "block";
        document.getElementById('saveBox').style.display = "none";
        // chrome.browserAction.setBadgeText({ text: 'off' }); //未登录提示
        // chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
    }
})

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.loginAction == "login"){
//     	document.getElementById('loginBox').style.display = "none";
//     	document.getElementById('saveBox').style.display = "block";
//         chrome.browserAction.setBadgeText({ text: '' });
//     }else if(request.loginAction == "logout"){
// 		document.getElementById('loginBox').style.display = "block";
//         document.getElementById('saveBox').style.display = "none";
//         chrome.browserAction.setBadgeText({ text: 'off' }); //未登录提示
//         chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
//     }
//   });

//登录操作
document.getElementById('loginBtn').onclick = function() {
    var account = document.getElementById('username').value.trim();
    var pwd = document.getElementById('pwd').value.trim();
    var resultBox = document.getElementById('saveResult');
    if (account && pwd) {
        $.ajax({
            url: 'https://aiwriting.io/doLogin',
            type: 'post',
            data: {
                account: account,
                password: pwd
            },
            success: function(response) {
                
                if (/请输入验证码/.test(response)) {
                    resultBox.style.display = "block";
                    resultBox.innerHTML = '登录失败';
                } else {
                    resultBox.innerHTML = '';
                    document.getElementById('userAccount').innerHTML = account;
                    localStorage['userAccount']=account;
                    document.getElementById('loginBox').style.display = "none";
                    document.getElementById('saveBox').style.display = "block";
                    resultBox.style.display = "none";
                    // chrome.browserAction.setBadgeText({ text: '' });
                }

            },
            error: function(xhr, status) {
                console.error(xhr, status);
                var resultBox = document.getElementById('saveResult');
                resultBox.style.display = "block";
                resultBox.innerHTML = '请求出错';
            }
        })
    } else {
    	resultBox.style.display = "block";
        resultBox.innerHTML = '请输入用户名和密码';
    }
}

//注销操作
document.getElementById('logoutLink').onclick = function() {
    $.ajax({
        url: 'https://aiwriting.io/logout',
        type: 'get',
        success: function(response) {
        	document.getElementById('loginBox').style.display = "block";
            document.getElementById('saveBox').style.display = "none";
            document.getElementById('saveResult').style.display = "none";
        },
        error: function(xhr, status) {
            console.error(xhr, status);
            var resultBox = document.getElementById('saveResult');
            resultBox.style.display = "block";
            resultBox.innerHTML = '请求出错';
        }
    })
}



//保存文章
var myUrl = 'https://aiwriting.io/';
chrome.tabs.getSelected(null, function(tab) {
    myUrl = tab.url;
    document.getElementById('aiUrlInput').value = myUrl;
    var encodedUrl = Base64.encode(myUrl);
    document.getElementById('aiSaveBtn').onclick = function() {
        if (encodedUrl && encodedUrl.trim()) {
            $.ajax({
                url: 'https://aiwriting.io/material/json/import/page/url?url=' + encodedUrl,
                type: 'get',
                success: function(res) {
                    var resultBox = document.getElementById('saveResult');
                    resultBox.style.display = "block";
                    if (res.status == "success") {
                        resultBox.innerHTML = '保存成功';
                        setTimeout(function() {
                            window.close();
                        }, 2000);
                    } else {
                        resultBox.innerHTML = res.message;
                    }
                }
            })
        }
    }
});
