document.addEventListener('DOMContentLoaded',function(e){
	init();
	document.getElementById("save_settings").addEventListener('click', save_settings);
},false);

function viewStatus(id,msg){
	var status = document.getElementById(id);
	status.innerHTML = msg;
	setTimeout(function(){status.innerHTML = "";}, 1*10000);
};

function init(){
	document.getElementById("scrollSpeed").value = (localStorage["scrollSpeed"] || "40");
	document.getElementById("botWaitTime").value = (localStorage["botWaitTime"] || "10");
	document.getElementById("staticTabTimeout").value = (localStorage["staticTabTimeout"] || "15");
	document.getElementById("tabTimeout").value = (localStorage["tabTimeout"] || "30");
	document.getElementById("openOnStartup").checked = (localStorage["openOnStartup"] || true);
};

function save_settings(){
	localStorage["scrollSpeed"] = document.getElementById("scrollSpeed").value + "";
	localStorage["botWaitTime"] = document.getElementById("botWaitTime").value + "";
	localStorage["staticTabTimeout"] = document.getElementById("staticTabTimeout").value + "";
	localStorage["tabTimeout"] = document.getElementById("tabTimeout").value + "";
	localStorage["openOnStartup"] = document.getElementById("openOnStartup").checked;
	viewStatus("status_settings","Options saved.");
};