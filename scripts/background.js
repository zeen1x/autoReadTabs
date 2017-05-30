/** 
	@license
	AutoScrollTabs | CyonTech.ca License
	©Copyright 2016 Patrice Desbiens and Francis Desbiens
	
	Description: This extension auto scroll down on tabs, refresh the next tab and 
	switch to the next when it reaches the bottom of the current tab.
				
	Version: 1.0.9
 */

var interval = null;
var botTimeout = null;
var timeout = null;
var isON;
var isNextTabRefresh = false;

if(localStorage["openOnStartup"]){isON=true;}else{isON=false;};

chrome.tabs.getSelected(function(tab){
	setOff();
});

function setOn(){
	chrome.tabs.getSelected(function(tab){
		clearTimeout(timeout);
		clearInterval(interval);
		reloadNextTab();
		scrollDown(tab);
		timeout = setTimeout(openNextTab,localStorage["tabTimeout"]*1000 || 30000);
		chrome.browserAction.setBadgeText({text:" ON "});
		chrome.browserAction.setBadgeBackgroundColor({color: [0,255,20,200]});
	});
}

function setOff(){
	chrome.tabs.getSelected(function(tab){
		clearTimeout(timeout);
		clearInterval(interval);
		resetScroll(tab);
		chrome.browserAction.setBadgeText({text:"OFF"});
		chrome.browserAction.setBadgeBackgroundColor({color: [255,20,0,200]});		
	});
}

function resetScroll(tab){
	var upUrl = "javascript:var interval;tempFunction=new Function('clearTimeout(interval)');document.onkeydown=tempFunction;tempFunction();void(interval=setInterval('if(pageYOffset<document.height-innerHeight){window.scrollBy(0,0)}else{tempFunction()}',0))";
	if(upUrl != tab.url){
		chrome.tabs.update(tab.id,{'url':upUrl});
	}
};

function scrollDown(tab) {
	interval = setInterval(function(){upurl(tab.id);},localStorage["scrollSpeed"] || "40");
};

function upurl(id){
	chrome.tabs.update(id, {'url': 'javascript:document.body.scrollTop+=1;'});
};

function openNextTab(){
	isNextTabRefresh = false;
	getNextTab(function(nextTab){
		chrome.tabs.update(nextTab.id, {selected: true});
	});
};

function reloadNextTab(){
	getNextTab(function(nextTab){
		chrome.tabs.update(nextTab.id, {url: nextTab.url});
	});			
}

function getNextTab(callback){
	var windowId = chrome.windows.WINDOW_ID_CURRENT;
	chrome.tabs.query({"windowId": windowId, "active": true}, function(tab){
		var nextTabIndex = 0;
		chrome.tabs.getSelected(windowId, function(currentTab){
			chrome.tabs.getAllInWindow(windowId, function(tabs) {
				if(currentTab.index + 1 < tabs.length) {
					nextTabIndex = currentTab.index + 1;
				} else {
					nextTabIndex = 0;
				}
				callback(tabs[nextTabIndex]); 
			});
		});
	});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(isON)
	{
		if(request.message == "hasReachedBottom"){
			clearTimeout(timeout);
			timeout = setTimeout(openNextTab,localStorage["botWaitTime"]*1000 || 1000);
		}
		if(request.message == "hiddenTab"){
			clearTimeout(timeout);
		}
		if(request.message == "isAStaticTab"){
			clearTimeout(timeout);
			timeout = setTimeout(openNextTab,localStorage["staticTabTimeout"]*1000 || 15000);
		}
	}
	sendResponse();
});

chrome.browserAction.onClicked.addListener(function(tab){
	if(isON)
	{
		isON = false;
		setOff();
	}
	else
	{
		isON = true;
		setOn();
	}
});

chrome.tabs.onSelectionChanged.addListener(function(tabid,selectinfo){
	if(isON)
	{
		setOn();
	}
});