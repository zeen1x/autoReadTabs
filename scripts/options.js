document.addEventListener('DOMContentLoaded', (e) => {
	init();
	document.getElementById("save_settings").addEventListener('click', save_settings);
}, false);

function viewStatus(id, msg) {
	var status = document.getElementById(id);
	status.innerHTML = msg;
	setTimeout(() => { status.innerHTML = ""; }, 1 * 10000);
};

function init() {
	document.getElementById("scrollSpeed").value = (localStorage["scrollSpeed"] || "50");
	document.getElementById("bottomTimeout").value = (localStorage["bottomTimeout"] || "5");
	document.getElementById("staticTabTimeout").value = (localStorage["staticTabTimeout"] || "15");
	document.getElementById("scrollTimeout").value = (localStorage["scrollTimeout"] || "30");
};

function save_settings() {
	localStorage["scrollSpeed"] = document.getElementById("scrollSpeed").value + "";
	localStorage["bottomTimeout"] = document.getElementById("bottomTimeout").value + "";
	localStorage["staticTabTimeout"] = document.getElementById("staticTabTimeout").value + "";
	localStorage["scrollTimeout"] = document.getElementById("scrollTimeout").value + "";
	viewStatus("status_settings", "Options saved.");
};