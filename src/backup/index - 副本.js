//CSS

import '../vendor/font-awesome/css/font-awesome.min.css';
// import '../vendor/bootstrap/css/bootstrap.css';
import '../vendor/uui/css/u.css';
//import './styles/style.css';
import './styles/portal.css';
import './styles/project.css';
//import '../vendor/bootstrap/js/bootstrap';
import '../vendor/uui/js/u';

//Router
import director from '../vendor/director/director';
var router = new director.Router();
window.router = router;

var userImg = document.getElementById('userImg');
// userImg.src = require('./static/images/user.jpg');
document.querySelectorAll('#ripple li').forEach(function(li){
    li.style.overflow ="hidden";
    li.style.position ="relative";
    var rip = new u.Ripple(li);
})


//异步加载

/*门户入口*/
router.on('home', function(){
    require.ensure([], function(require){
        var page0 = require('./pages/project/home/home');
        var _html = require('html!./pages/project/home/home.html');
        $('#content').empty();
        $('#content').html(_html);
        page0.init();
    });
});

/**/
router.on('inbox', function(){
        var page2 = require('./pages/project/page2/page2');
        var _html = require('html!./pages/project/page2/page2.html');
        $('#content').empty();
        $('#content').html(_html);
        page2.init();

});


/*********************项目内部路由******************************/
/*项目菜单入口*/ 
router.on('project', function(){
        var page4 = require('./pages/project/project_index/project_index');
        var _html = require('html!./pages/project/project_index/project_index.html');
        $('#content').empty();
        $('#content').html(_html);
        page4.init();

});
/*项目祥情*/
router.on('projectdetail', function(){
        var page5 = require('./pages/project/project_detail/project_detail');
        var _html = require('html!./pages/project/project_detail/project_detail.html');
        $('#content').empty();
        $('#content').html(_html);
        page5.init();

});

/*项目动态*/
router.on('/projectdetail/info', function(){
        var page3 = require('./pages/project/project_news/project_news');
        var _html = require('html!./pages/project/project_news/project_news.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page3.init();

});
/*项目任务*/
router.on('/projectdetail/task', function(){
        var page6 = require('./pages/project/project_task/project_task');
        var _html = require('html!./pages/project/project_task/project_task.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page6.init();

});
/*项目文档*/
router.on('/projectdetail/doc', function(){
        var page7 = require('./pages/project/project_doc/project_doc');
        var _html = require('html!./pages/project/project_doc/project_doc.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page7.init();

});

/*项目会议*/
router.on('/projectdetail/meeting', function(){
        var page8 = require('./pages/project/project_meeting/project_meeting');
        var _html = require('html!./pages/project/project_meeting/project_meeting.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page8.init();

});

/*项目审批*/
router.on('/projectdetail/review', function(){
        var page9 = require('./pages/project/project_review/project_review');
        var _html = require('html!./pages/project/project_review/project_review.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page9.init();

});

/*项目客户*/
router.on('/projectdetail/customer', function(){
        var page10 = require('./pages/project/project_customer/project_customer');
        var _html = require('html!./pages/project/project_customer/project_customer.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page10.init();

});
 
/*********************项目内部路由******************************/

router.init();
if (!window.location.hash){
  window.location.hash = "home"    
}
