/*
  * Warning *
  _> This pen is just So ! not a violation of the codepen site
*/
function pensearch() {
	navsearch = document.getElementById('navSearch');
	navsearch.style.display = 'block';
	navsearch.style.transition = '.3s';
	navsearch.style.top = '0';
}
function closesearch(){
	navsearch.style.display = 'none';
}
//BTC
//DOGE
//LTC
//DASH

//DEBUG STUFF
var DEBUG = true;
var d_log = function(msg)
{
	if(DEBUG===true)
	{
		console.log("DEBUG: d_log: "+msg);
	}
};

// COOKIE STORAGE AND RETRIEVAL
// Thanks to www.w3schools.com for teaching me how to use cookies
function storeCookie(cookieName, cookieValue, daysUntilExpire, path) 
{
	if(!path){path = '';}
	d_log("storeCookie;"+cookieName+';'+cookieValue+';'+daysUntilExpire+';'+path);
	var dateVar = new Date();
	dateVar.setTime(dateVar.getTime()+(daysUntilExpire*24*60*60*1000));
	dateVar = dateVar.toUTCString();
	document.cookie = cookieName+"="+cookieValue+";expires="+dateVar+";path=/"+path;
}

function retrieveCookie(cookieName)
{
	d_log("retrieveCookie;"+cookieName);
	cookieName = cookieName+"=";
	var cookieArray = document.cookie.split(';');
	for(var i=0; i<cookieArray.length; i+=1)
	{
		var currentCookie = cookieArray[i];
		while (currentCookie.charAt(0)==' ')
		{
			currentCookie = currentCookie.substring(1);
		}
		if (currentCookie.indexOf(cookieName)===0)
		{
			return currentCookie.substring(cookieName.length, currentCookie.length);
		}
	}
	return "";
}

//VARIABLE INITIALIZATION
//Wallet
var curWallet = "9x9zSN9vx3Kf9B4ofwzEfWgiqxwBieCNEb";
var cwal = retrieveCookie("CURRENT-WALLET");
if(cwal!=='')
{
	curWallet = cwal;
	d_log("curWallet==cwal;"+cwal);
}
else
{
	storeCookie("CURRENT-WALLET",curWallet,90);
}
cwal = null;

//Chain
var curChain = "DOGE";
var cchn = retrieveCookie("CURRENT-CHAIN");
if(cchn!=='')
{
	curChain = cchn;
	$("#selectChain_"+curChain).prop("selected",true);
	d_log("curChain==cchn;"+cchn);
}
else
{
	storeCookie("CURRENT-CHAIN",curChain,90);
}
cchn = null;

//Other
var ccoin = document.getElementById("ccoin");
var USD = document.getElementById("USD");
var addressInput = document.getElementById("address-input");
addressInput.value = curWallet;
var balance = document.getElementById("balance");
var balanceuc = document.getElementById("balanceuc");
var rval = document.getElementById("rval");
var rvaluc = document.getElementById("rvaluc");
var sval = document.getElementById("sval");
var svaluc = document.getElementById("svaluc");


//FUNCTIONS
function refreshKey()
{
	var kref = false;
	d_log('refreshKey;'+curWallet);
	$.get( "https://chain.so/api/v2/get_address_balance/"+curChain+"/"+curWallet+"/100", function(get_data,status) 
		{
			$(balance).text('Balance: '+get_data.data.confirmed_balance || 0);
		}, 
	"json" )
		.fail(function() 
		{
    	kref = true;
			$(balance).text('Balance: ERROR');
			$(rval).text('Recieved Value: ERROR');
			$(rvaluc).text('Recieved Value (Unconfirmed): ERROR');
			$(sval).text('Sent Value: ERROR');
			$(svaluc).text('Sent Value (Unconfirmed): ERROR');
  	}
	);
	if(kref===true)
	{
		return false;
	}
	$.get( "https://chain.so/api/v2/get_address_received/"+curChain+"/"+curWallet, function(get_data) 
		{
			$(rval).text('Recieved Value: '+get_data.data.confirmed_received_value || 0);
			$(rvaluc).text('Recieved Value (Unconfirmed): '+(get_data.data.unconfirmed_received_value || 0));
		}, 
	"json" );
	$.get( "https://chain.so/api/v2/get_address_spent/"+curChain+"/"+curWallet, function(get_data) 
		{
			$(sval).text('Sent Value: '+get_data.data.confirmed_sent_value || 0);
			$(svaluc).text('Sent Value (Unconfirmed): '+(get_data.data.unconfirmed_sent_value || 0));
		}, 
	"json" );
}

function refreshNetwork()
{
	if($("#selectChain_DOGE").prop("selected") === true)
	{
		curChain = "DOGE";
	}
	else if($("#selectChain_BTC").prop("selected") === true)
	{
		curChain = "BTC";
	}
	else if($("#selectChain_LTC").prop("selected") === true)
	{
		curChain = "LTC";
	}
	else if($("#selectChain_DASH").prop("selected") === true)
	{
		curChain = "DASH";
	}
	d_log('refreshNetwork;'+curChain);
	$.get("https://chain.so/api/v2/get_price/"+curChain, function(get_data) 
		{
			$(ccoin).html("Network: "+
				"<select id='selectChain' class='body-font'>"+
  				"<option id='selectChain_DOGE' value='DOGE'>DOGE</option>"+
  				"<option id='selectChain_BTC' value='BTC'>BTC</option>"+
  				"<option id='selectChain_LTC' value='LTC'>LTC</option>"+
  				"<option id='selectChain_DASH' value='DASH'>DASH</option>"+
				"</select>");
			var prices = get_data.data.prices[0];
			$(USD).text(prices.price_base+': '+prices.price);
			$("#selectChain_"+get_data.data.network).prop('selected', true);
		},"json");
}

function refreshAll()
{
	d_log('refreshAll;');
	refreshNetwork();
	refreshKey();
}

function submitPressed()
{
	if($("#selectChain_DOGE").prop("selected") === true)
	{
		curChain = "DOGE";
	}
	else if($("#selectChain_BTC").prop("selected") === true)
	{
		curChain = "BTC";
	}
	else if($("#selectChain_LTC").prop("selected") === true)
	{
		curChain = "LTC";
	}
	else if($("#selectChain_DASH").prop("selected") === true)
	{
		curChain = "DASH";
	}
	storeCookie("CURRENT-CHAIN",curChain,90);
	curWallet = addressInput.value;
	storeCookie("CURRENT-WALLET",curWallet,90);
	refreshAll();
}

//AUTOBOTS, ROLL OUT
$(document).ready(
	function()
	{
		d_log('Document Ready');
		refreshAll();
	}
);