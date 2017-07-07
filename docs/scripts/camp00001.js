var urls = {
  "solvay": "http://am.solvay.edu",
  "bbc": "http://www.bbc.co.uk/news",
  "guardian": "https://www.theguardian.com/uk",
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function init () {
  var client = decodeURI(getParameterByName('client'));
  var id = getParameterByName('id');
  var redirect = urls[client];
  
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-101946425-1', 'auto');
  ga('send', 'pageview');
  
  window.location.replace(client);
  
}

init();