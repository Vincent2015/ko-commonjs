/*门户入口*/
var  portal = function(){
   // require.ensure([], function(require){
       console.log('current is portal');
       var page = require('./pages/project/home/home');
        var _html = require('html!./pages/project/home/home.html');
        $('#content').empty();
        $('#content').html(_html);
        page.init();
      // });
  };
  /*项目菜单*/
  var  project = function(id){
        console.log('current is project'+'---'+id);
        var page = require('./pages/project/project_index/project_index');
        var _html = require('html!./pages/project/project_index/project_index.html');
        $('#content').empty();
        $('#content').html(_html);
        page.init();
  };
  /*项目祥情*/
  var  detail = function(id,name){
        console.log('current is detail');
        var page = require('./pages/project/project_detail/project_detail');
        var _html = require('html!./pages/project/project_detail/project_detail.html');
        $('#content').empty();
        $('#content').html(_html);

        $('body').attr('pid',id);      
        if (name){
           $('body').attr('pname',decodeURI(name));
        }

        page.init(id,name);
  };
  /*项目动态*/
  var  info = function(){
        console.log('current is info');
        var page = require('./pages/project/project_news/project_news');
        var _html = require('html!./pages/project/project_news/project_news.html');      
        $('#project_content').empty();        
        $('#project_content').html(_html);
        page.init();
  };
  /*项目文档*/
  var  doc = function(){
    console.log('current is doc');
        var page = require('./pages/project/project_doc/project_doc');
        var _html = require('html!./pages/project/project_doc/project_doc.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page.init();
  };
/*项目任务*/
  var  task = function(id,name){
    console.log('current is task');
     var page = require('./pages/project/project_task/project_task');
        var _html = require('html!./pages/project/project_task/project_task.html');
        $('#project_content').empty();
        $('#project_content').html(_html); 
        page.init(id,name);
  };
/*项目会议*/
  var  meeting = function(){
    console.log('current is meeting');
       var page = require('./pages/project/project_meeting/project_meeting');
        var _html = require('html!./pages/project/project_meeting/project_meeting.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page.init();

  };
/*项目审批*/
  var  review = function(){
        console.log('current is review');
        var page = require('./pages/project/project_review/project_review');
        var _html = require('html!./pages/project/project_review/project_review.html');
        $('#project_content').empty();
        $('#project_content').html(_html);

        page.init();


  };
/*项目客户*/
var  customer = function(){
        console.log('current is customer');
        var page = require('./pages/project/project_customer/project_customer');
        var _html = require('html!./pages/project/project_customer/project_customer.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page.init();

  };


/*项目统计*/
var  stat = function(){
        console.log('current is stat');
        var page = require('./pages/project/project_stat/project_stat');
        var _html = require('html!./pages/project/project_stat/project_stat.html');
        $('#project_content').empty();
        $('#project_content').html(_html);
        page.init();

  };  
/**
 * 项目动态 
 * rongqb 20160310
 */
var dynamic = function(id,name){
    console.log('current is dynamic');
    var page = require('./pages/project/project_dynamic/project_dynamic');
    var _html = require('html!./pages/project/project_dynamic/project_dynamic.html');
    $('#project_content').empty();
    $('#project_content').html(_html);      
    page.init(id,name);
};  

/**
 * 消息
 */
 var message = function(){
 	window.scope.$state.transitionTo("imhome", {}, {
		location: true,
		inherit: true,
		notify: true,
		reload: true
	});
 	jQuery('#content').html(window.imContent);
 };
  
 /*项目详情页各tab页，URL访问路径预处理*/ 
 var detailTo = function(){
     if (!$('#project_content')){
        detail();
     }
 }

 var cloudisk = function(id,name){
        console.log('current is cloudisk');
        var page = require('./pages/cloudisk/cloudisk');
        var _html = require('html!./pages/cloudisk/cloudisk.html');
        $('#content').empty();
        $('#content').html(_html);    
       
        page.init();

  };  
module.exports = {
     '/home':portal,
     '/message':message,
      '/cloudisk':cloudisk,
      '/project': {
          '/detail': {
             '/info': {
                on: info
              },
              '/dynamic':{            
                on: dynamic
              },
               '/doc': {                 
                on: doc
              },
              '/task': {
                on: task
              },
               '/meeting': {
                on: meeting
              },
              '/review': {
                on: review
              },
               '/customer': {              
                on: customer
              },              
              '/stat': {
                 on: stat
              }
              ,
              on: [detail]
          },

          on: project
      },
      // '/project/detail/:id/:name': [detail,task]
    '/project/detail/?([^\/]*)\/([^\/]*)/?': [detail,dynamic],    
     '/project/detail/task/?([^\/]*)\/([^\/]*)/?': [detail,task],
     '/project/detail/doc/?([^\/]*)\/([^\/]*)/?': [detail,doc],
      '/project/detail/meeting/?([^\/]*)\/([^\/]*)/?': [detail,meeting],
      '/project/detail/review/?([^\/]*)\/([^\/]*)/?': [detail,review],
     '/project/detail/stat/?([^\/]*)\/([^\/]*)/?': [detail,stat]

};