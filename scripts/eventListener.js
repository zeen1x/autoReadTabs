window.addEventListener('scroll', function (e) {
    if(document.body.scrollHeight == document.body.scrollTop + window.innerHeight) {
		chrome.runtime.sendMessage({message:"hasReachedBottom"}, function(e){});
    }
}, false);

window.onfocus = function() {  
	if(!(document.body.scrollHeight > document.body.clientHeight))
	{
		chrome.runtime.sendMessage({message:"isAStaticTab"}, function(e){}); 
	}
};

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

window.onload = function() {
	
	// check the visiblility of the page
	var hidden, visibilityState, visibilityChange;

	if (typeof document.hidden !== "undefined") {
		hidden = "hidden", visibilityChange = "visibilitychange", visibilityState = "visibilityState";
	}
	else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden", visibilityChange = "mozvisibilitychange", visibilityState = "mozVisibilityState";
	}
	else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden", visibilityChange = "msvisibilitychange", visibilityState = "msVisibilityState";
	}
	else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden", visibilityChange = "webkitvisibilitychange", visibilityState = "webkitVisibilityState";
	}


	if (typeof document.addEventListener === "undefined" || typeof hidden === "undefined") {
		// not supported
	}
	else {
		document.addEventListener(visibilityChange, function() {
		
			switch (document[visibilityState]) {
			case "visible":
				chrome.runtime.sendMessage({message:"visibleTab"}, function(e){});
				break;
			case "hidden":
				chrome.runtime.sendMessage({message:"hiddenTab"}, function(e){});
				break;
			}
		}, false);
	}

}; 