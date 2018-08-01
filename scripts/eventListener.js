window.addEventListener('scroll', (e) => {
	if (document.documentElement.scrollHeight == document.documentElement.scrollTop + window.innerHeight) {
		chrome.runtime.sendMessage({ message: "hasReachedBottom" }, (e) => { });
	}
}, false);

window.onfocus = () => {
	if (!(document.documentElement.scrollHeight > document.documentElement.clientHeight)) {
		chrome.runtime.sendMessage({ message: "isAStaticTab" }, (e) => { });
	}
};

window.onbeforeunload = () => {
	window.scrollTo(0, 0);
}

window.onload = () => {

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
		document.addEventListener(visibilityChange, () => {

			switch (document[visibilityState]) {
				case "visible":
					chrome.runtime.sendMessage({ message: "visibleTab" }, (e) => { });
					break;
				case "hidden":
					chrome.runtime.sendMessage({ message: "hiddenTab" }, (e) => { });
					break;
			}
		}, false);
	}

}; 