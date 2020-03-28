sessionStorage.active = 0;
var feedback = function(res) {
	console.log(res)
    if (res.success === true) {
    	var dem = sessionStorage.getItem("active");
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://');
		//url = document.getElementById("urlImg").value+""+get_link+"\n";
		//document.getElementById("urlImg").value = url;
		document.getElementById("icon-picture-o-"+dem+"").style.display = "none";
		document.getElementById("icon-check-square-o-"+dem+"").style.display = "block";
		document.getElementById("link"+dem+"").value = get_link;
		document.getElementById("loading"+dem+"").style.display = "none";
		document.getElementById("link"+dem+"").style.display = "block";
		sessionStorage.active = Number(sessionStorage.active)+1;
		console.log(dem);
    }
};

new Imgur({
    clientid: 'aa3aeb4dab45663', //You can change this ClientID
    callback: feedback
});
