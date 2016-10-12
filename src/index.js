//CSS
import '../vendor/font-awesome/css/font-awesome.min.css';
// import '../vendor/bootstrap/css/bootstrap.css';
import '../vendor/uui/css/u.css';
//import './styles/style.css';
import './styles/portal.css';
import './styles/project.css';
import './styles/common.css';
import './styles/iform-privilege.css';

//import '../vendor/bootstrap/js/bootstrap';
import ko from '../vendor/ko/knockout-3.4.0';
import '../vendor/uui/js/u-polyfill';
import '../vendor/uui/js/u';
import '../vendor/validate/validate';

//Router
import director from '../vendor/director/director';
import routes from './route'

import doT from '../vendor/dot/doT';
import {server} from './pages/config/config';
console.log('server--'+server);
var router = new director.Router(routes).configure({ recurse: 'forward' });
//var router = new director.Router(routes);
window.router = router;
window.ko = ko;
var userImg = document.getElementById('userImg');
// userImg.src = require('./static/images/user.jpg');
document.querySelectorAll('#ripple li').forEach(function(li){
    li.style.overflow ="hidden";
    li.style.position ="relative";
    var rip = new u.Ripple(li);
})

// router.on('inbox', function(){
//         var obj=[{name:'d1'},{name:'d2'},{name:'d3'}];
//         var page = require('./pages/todo/todo');
//         var tem = require('html!./pages/todo/todo.html');
//         // var tem = document.createElement(tem);
//         // var dot = require("dot");
//         var _html = doT.template(tem)(obj);
//         $('#content').empty();
//         $('#content').html(_html) ;
//         page.init();

// });

console.log('router init');
router.init();
// var angular = require('angular');

if (!window.location.hash){
  window.location.hash = "home"    
}
$(document).on('click','.page-aside ul>li:not(:last-child)',function(e){
	$('.page-aside ul>li>a').removeClass('cur');
	$(this).find('a').addClass('cur');
})
!function switchFunc(){
	var site_module = location.hash.indexOf('/')>-1?location.hash.split('/')[1].split('/')[0]:location.hash.split('#')[1],
	    map = ['portal','imhome','approve','project','schedule','contacts','cloudisk','app'],
	    index = map.indexOf(site_module)>-1?map.indexOf(site_module):0;
//	alert($('.page-aside>li').eq(index).html())    
	$('.page-aside ul>li').eq(index).find('a').addClass('cur');
}()
$(document).on('click','.page-deader .func-pannal .add-new',function(e){
	$(e.target).find('.add-menu').toggleClass('hidden');
})
$(document).on('click',function(e){
    if ($(e.target).closest('.add-new').length<=0){
     $('.page-deader .func-pannal .add-menu').addClass('hidden');
   }
})


$(document).on('click','.iform-test',function(){
	 var tem = require('html!./pages/freeform/iform_tmpl.html');
	 $('#content').empty();
     $('#content').html(tem) ;
})
