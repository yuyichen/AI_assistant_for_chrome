
//判断用户登录状态
chrome.cookies.get({ url: 'https://aiwriting.io/', name: 'user' }, function(cookie) {
    if (cookie) {
        document.getElementById('loginBox').style.display = "none";
        document.getElementById('saveBox').style.display = "block";
        document.getElementById('userAccount').innerText = localStorage['userAccount'];
        chrome.browserAction.setIcon({path:'../icon.png'});
        // chrome.browserAction.setBadgeText({ text: '' });
    } else {
        document.getElementById('loginBox').style.display = "block";
        document.getElementById('saveBox').style.display = "none";
        chrome.browserAction.setIcon({path:'../icon_gray.png'});
        // chrome.browserAction.setBadgeText({ text: 'off' }); //未登录提示
        // chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
    }
})


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
                    resultBox.innerText = '登录失败';
                } else {
                    resultBox.innerText = '';
                    document.getElementById('userAccount').innerText = account;
                    localStorage['userAccount']=account;
                    chrome.browserAction.setIcon({path:'../icon.png'});
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
                resultBox.innerText = '请求出错';
            }
        })
    } else {
        resultBox.style.display = "block";
        resultBox.innerText = '请输入用户名和密码';
    }
}

//注销操作
document.getElementById('logoutLink').onclick = function() {
    $.ajax({
        url: 'https://aiwriting.io/logout',
        type: 'get',
        success: function(response) {
            chrome.browserAction.setIcon({path:'../icon_gray.png'});
            localStorage.removeItem('userAccount');
            document.getElementById('loginBox').style.display = "block";
            document.getElementById('saveBox').style.display = "none";
            document.getElementById('saveResult').style.display = "none";
        },
        error: function(xhr, status) {
            console.error(xhr, status);
            var resultBox = document.getElementById('saveResult');
            resultBox.style.display = "block";
            resultBox.innerText = '请求出错';
        }
    })
}



//保存文章
var myUrl = 'https://aiwriting.io/';
// chrome.tabs.getSelected(null, function(tab) {
//     var clipbordContent = getClipBordContent();
//     if(/^http[s]?:\/\//.test(clipbordContent)){
//         myUrl = clipbordContent;//剪贴板内容是网址的时候
//     }else if(/^http[s]?:\/\//.test(tab.url)){
//         myUrl = tab.url;
//     }else{
//         myUrl="";
//     }
    
//     document.getElementById('aiUrlInput').value = myUrl;
//     // document.getElementById('aiUrlInput').focus();
//     // document.execCommand('paste');
//     document.getElementById('aiSaveBtn').onclick = function() {
//         if (myUrl && myUrl.trim()) {
//             chrome.runtime.sendMessage({saveLink: myUrl}, function(res) {
//                 console.log(res);
//                 var resultBox = document.getElementById('saveResult');
//                 resultBox.style.display = "block";
//                 if (res.status == "success") {
//                     resultBox.innerText = '网页内容抓取，抓取成功';
//                     setTimeout(function() {
//                         window.close();
//                     }, 2000);
//                 } else {
//                     resultBox.innerText = res.message;
//                 }
//             });
//         }
//     }
// });
// 
// 
//firefox 不支持chrome.tabs.getSelected方法
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0]
    var clipbordContent = getClipBordContent();
    if(/^http[s]?:\/\//.test(clipbordContent)){
        myUrl = clipbordContent;//剪贴板内容是网址的时候
    }else if(/^http[s]?:\/\//.test(tab.url)){
        myUrl = tab.url;
    }else{
        myUrl="";
    }
    
    document.getElementById('aiUrlInput').value = myUrl;
    // document.getElementById('aiUrlInput').focus();
    // document.execCommand('paste');
    document.getElementById('aiSaveBtn').onclick = function() {
        if (myUrl && myUrl.trim()) {
            chrome.runtime.sendMessage({saveLink: myUrl}, function(res) {
                console.log(res);
                var resultBox = document.getElementById('saveResult');
                resultBox.style.display = "block";
                if (res.status == "success") {
                    resultBox.innerText = '网页内容抓取，抓取成功';
                    setTimeout(function() {
                        window.close();
                    }, 2000);
                } else {
                    resultBox.innerText = res.message;
                }
            });
        }
    }
});

/**
 * 获取剪贴板内容
 * @return {[type]} [description]
 */
function getClipBordContent(){
    var inputDom = document.createElement('textarea');
    inputDom.style.position = "absolute";
    inputDom.style.top = "-99999px";
    document.body.appendChild(inputDom);
    inputDom.focus();
    document.execCommand('paste');
    return inputDom.value;
}


