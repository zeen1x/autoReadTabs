/** 
	@license
	AutoScrollTabs | CyonTech.ca License
	©Copyright 2016 Patrice Desbiens and Francis Desbiens
	
	Description: This extension auto scroll down on tabs, refresh the next tab and 
	switch to the next when it reaches the bottom of the current tab.
				
	Version: 1.1.4
 */

var isON = false;

var scrollSpeed = null;
var scrollTimeout = null;

chrome.tabs.getSelected((tab) => {
	setOff();
});

function setOn() {
	chrome.tabs.getSelected((tab) => {
		clearTimeout(scrollTimeout);
		clearInterval(scrollSpeed);
		refreshNextTab();
		scrollDown(tab);
		scrollTimeout = setTimeout(openNextTab, localStorage["scrollTimeout"] * 1000 || 30000);
		chrome.browserAction.setBadgeText({ text: " ON " });
		chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 20, 200] });
	});
}

function setOff() {
	chrome.tabs.getSelected((tab) => {
		clearTimeout(scrollTimeout);
		clearInterval(scrollSpeed);
		chrome.browserAction.setBadgeText({ text: "OFF" });
		chrome.browserAction.setBadgeBackgroundColor({ color: [255, 20, 0, 200] });
	});
}

function upUrl(id) {
	chrome.tabs.update(id, { url: 'javascript:document.documentElement.scrollTop+=1;' });
}

function nextTab(id) {
	chrome.tabs.update(id, { url: 'javascript:document.documentElement.scrollTop=0;' });
}

function scrollDown(tab) {
	scrollSpeed = setInterval(() => { upUrl(tab.id); }, localStorage["scrollSpeed"] || "50");
}

function openNextTab() {
	getNextTab((nextTab) => {
		chrome.tabs.update(nextTab.id, { selected: true });
	});
}

function refreshNextTab() {
	getNextTab((nextTab) => {
		chrome.tabs.update(nextTab.id, { url: nextTab.url });
	});
}

function getNextTab(callback) {
	var windowId = chrome.windows.WINDOW_ID_CURRENT;
	chrome.tabs.query({ "windowId": windowId, "active": true }, (tab) => {
		var nextTabIndex = 0;
		chrome.tabs.getSelected(windowId, (currentTab) => {
			chrome.tabs.getAllInWindow(windowId, (tabs) => {
				if (currentTab.index + 1 < tabs.length) {
					nextTabIndex = currentTab.index + 1;
				} else {
					nextTabIndex = 0;
				}
				callback(tabs[nextTabIndex]);
			});
		});
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (isON) {
		if (request.message == "hasReachedBottom") {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(openNextTab, localStorage["bottomTimeout"] * 1000 || 5000);
		}
		if (request.message == "hiddenTab") {
			clearTimeout(scrollTimeout);
		}
		if (request.message == "isAStaticTab") {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(openNextTab, localStorage["staticTabTimeout"] * 1000 || 15000);
		}
	}
	sendResponse();
});

chrome.browserAction.onClicked.addListener((tab) => {
	if (isON) {
		isON = false;
		setOff();
	}
	else {
		isON = true;
		setOn();
	}
});

chrome.tabs.onSelectionChanged.addListener((tabid, selectinfo) => {
	if (isON) {
		setOn();
	}
});