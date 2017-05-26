// chrome.cookies.onChanged.addListener(function (cookieItem,cause){
// 	console.log(cookieItem,cause)
// 	if(cookieItem.removed && cookieItem.cookie.name=='user'){
// 		chrome.runtime.sendMessage({loginAction: "logout"}, function(response) {
// 		  console.log(response);
// 		});
// 	}else if(cookieItem.cookie.name=='user' && cookieItem.cause == 'explicit'){
// 		chrome.runtime.sendMessage({loginAction: "login"}, function(response) {
// 		  console.log(response);
// 		});
// 	}
// })