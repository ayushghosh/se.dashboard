/*
* Window on load, hijacks all a tag & call loadPage, 
* set size for nav & content, call init
*/
$(function() {
	$('a').on('click',function(e){
		e.preventDefault();
		var href = $(this).attr('href');
		loadPage(href);
	});
	$( window ).resize(function() {
	  setHeights();
	});
	init();
});
/*
* generate function name from page url hash to load the page
*/
function getPageFn(){
	var urlHash = window.location.hash;
	if(urlHash.substr('#/')){
		urlHash = urlHash.replace('#/','');
		urlHash = urlHash.replace('/','_');
	}
	if(!urlHash){
		return 'main'
	}
	return urlHash;
}
/*
* Ajax wrapper, type: document;api
*/
function ajax(url, method, contentType, data, cache, type, callback){
	var pageFn = getPageFn();
	var ajax = $.ajax({
		url:url,
		method:method,
		contentType:contentType,
		crossDomain:true,
		data:data,
		cache:cache,
		beforeSend: beforeSendSetHeader
	})
	.done(function (data, status, jqXHR) {
		if(type == 'document'){
			$('.content').fadeOut(0);
			$('.content').html(data);
			$('.content').fadeIn("slow");
			window[pageFn]();
		}
		else{
			callback = typeof callback !== 'undefined' ? callback : null;
			if(callback){
				window[callback](data);
			}
		}
	})
	.fail(function (jqXHR,status,err) {
	  alert("Promise error callback.");
	})
	.always(function () {
	})
}
/*
* Injects authorization headers
*/
function beforeSendSetHeader(xhr){
	var token = localGet('token');
	xhr.setRequestHeader('Authorization', 'Bearer '+ token);
}

/*
* load a page from the url hash, sets push state
*/
function loadPage(href){
	href = href.replace('#/','');
	history.pushState({}, '', '/#/'+href);
	ajax('/ajax/'+href.replace('/','.')+'.html', 'GET', 'text/html', {}, true, 'document');
	$('.header__nav').html(href.replace('/',' - '));
}
/*
* sets the size of nav & contenet on window resize
*/
function setHeights(){
	var wheight = $(window).height();
	$('.container, .nav, .content').css('min-height',wheight-61);
	// $('.main').css('min-height', wheight-90);

}
/*
* init to initializa the page on first load
*/
function init(){
	setHeights();
	var token = localGet('token');
	// if(!token)
	// {
	// 	$('.header__logo').fadeIn("slow",function() {
	// 		$('.content').fadeIn("fast",function() {
	// 			$('.content').html('<h1><a href="/login" style="">Login required</a></h1>');
	//   		});
	//   	});
	// 	return;
	// }
	$('.header__logo').fadeIn("slow",function() {
		$('.nav').fadeIn("fast",function() {
			$('.content, .header__nav').fadeIn("fast",function() {
  			});
  		});
  	});
	
	var hash = window.location.hash
	hash = hash.replace('#/','');
	if(!hash){
		loadPage('#/dashboard');
	}
	else{
		loadPage(window.location.hash);
	}
	// window[getPageFn()]();
}



/*
* 
*/
function localSet(key, value){
  if(typeof value == 'object')
  {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
}
/*
* 
*/
function localGet(key){
  return localStorage.getItem(key);
}
/*
* 
*/
function localDel(key){
  localStorage.removeItem(key);
}



Handlebars.registerHelper('gravatarurl', function(email) {
    return 'http://www.gravatar.com/avatar/' + md5(email.toLowerCase()) + '.jpg?s=90&d=http%3A%2F%2Fwww.polarb.com%2Fassets%2Fdefault_profile_avatar.png';
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});
Handlebars.registerHelper('toUpperCase', function(str) {
  return str.toUpperCase();
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
/*
* 
*/
function main(data){
	// alert('main he');
}

function dashboard(){
	// alert('main he');
}
function users(){
	console.log("a");
	ajax(api.users.get_all, 'GET', 'application/json', {}, true, 'api','usersShow');
}
function usersShow(users){
	if(users.data !== null){
		users = users.data;
		// users = JSON.parse(users.data);
		var source   = $("#t-user").html();
		var template = Handlebars.compile(source);
		for(var i=0, l=users.length; i<l; i++) {
			var html = template(users[i]);
			$('.view').append(html);
		}
  		
  		ajax(api.users.tags, 'GET', 'application/json', {}, true, 'api','usersShowTags');
	}

}

function usersShowTags(tags){
	var newFilters = '';
	//	<span class="filter" data-filter=".proto-yes">Proto Sample</span>

	if(tags.data.length>0){
		$.each( tags.data, function( key, value ) {
		  newFilters = newFilters + '<span class="filter" data-filter=".'+value+'">'+value.capitalize()+'</span>';
		});
	}
	$('.content .filters_list').append(newFilters);
			$('.view').mixItUp();

}

function products(){
	ajax(api.products.report, 'GET', 'application/json', {}, true, 'api','productsShow');
}
function productsShow(products){
	// $('.content').empty();
	if(products !== null){
		// users = JSON.parse(users.data);
		var source   = $("#t-product").html();
		var template = Handlebars.compile(source);
		for(var i=0, l=products.length; i<l; i++) {
			var html = template(products[i]);
			$('.view').append(html);
		}
		$('.view').mixItUp();

	}

}



switch(location.hostname.split('.').reverse()[0]){
	case 'com': base = 'http://api.sourceeasy.com';break;
	case 'dev': base = 'http://api.sourceeasy.dev';
				// break;
	default: base = 'http://api.sourceeasy.dev';break;
}

api = {
  "users": {
    "get_all": base+'/v1/users',
    "tags": base+"/v1/usertags"
  },
  "products": {
    "get_all": base+'/v1/products/all',
    "report": base+"/v1/reports/products"
  }
};









