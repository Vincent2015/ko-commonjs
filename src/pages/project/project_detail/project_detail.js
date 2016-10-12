
module.exports = {
    init: function(projectId,name){
    	var nameStr = $('body').attr('pname');
        $('.project_detail_head h2').text(nameStr).attr('title',nameStr);
        //alert('page3 init')      
        $('.project_left_nav li').on('click',function(){
		 	$('.project_left_nav li').removeClass('active');
    	    $(this).addClass('active');
          })

        $('.project_detail_content li').on('click',function(){
        	if ($(this).attr('id')=="prodetail") return;
    		$('.project_detail_content li').removeClass('active');
        	$(this).find('a').addClass('active');
        })
        

        $('.project_detail_head h2').on('click',function(){
    		   if(!$('.project-detail').length){
           var projectId =  $('body').attr('pid');
	    		 var modalJs = require('../project_create/project_create');
	     		 
			 	  var _html = require('html!../project_create/project_create.html');
			 	  var frag = $(_html);
			 	  frag.find('.title').eq(0).html('项目详情');
			 	  frag.find('.reset-form').remove();
			 	  frag.find('.u-msg-ok').html('确定');     
           $('#content').append(frag.removeClass('new-project wt-modal').addClass('project-detail'));                             
             
            console.log('LOG....'+projectId);
            modalJs.init(projectId,frag,1);

			   }else{
               var modalJs = require('../project_create/project_create');
               var frag = $('.project-detail');
                console.log('LOG....'+projectId);
                modalJs.init(projectId,frag,0);

         } 	 
          // $('#content').append(frag.removeClass('new-project wt-modal').addClass('project-detail')); 
          //  u.compMgr.updateComp();
		 	  $('.pro-info-tem.project-detail').removeClass('hidden');
		 	  setTimeout(function(){
		 	  	$('.pro-info-tem.project-detail form:first-child').addClass('act');
		 	  },50);
        	
        })
        setroute();
        function setroute(){
           $('.project_detail_content li').each(function function_name (argument) {
             // body...
             var href = $(this).find('a').attr('href');
             href = href +'/'+projectId+'/'+name;
             $(this).find('a').attr('href',href);
           })
        }
        
    }
}
