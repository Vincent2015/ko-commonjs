
module.exports = {
    init: function(projectId,name){
        //alert('page3 init') ;      
        var projectId = projectId;

        var authToken = JSON.parse(vali.getCookie('authToken'));        
        // $('body').attr('pid',projectId);
        // $('body').attr('pname',name);
        $('.u-col-4.col_task ul li .l2 span.start').on('click',function(){
          alert('任务已经启动')	;
        })


        $('.project_detail_content li a').removeClass('active');
        $('.project_detail_content li a.task').addClass('active');
        $('.project_detail_head h2').text($('body').attr('pname'));

        $('.u-col-4.col_task ul li').on('click',function(){
          alert('任务尚未启动')	;
        })

        $('.project_right').css('background-color','#FAFAFA');
        
         $(document).on('click','#project_content .col_task li ',function(e){
        		 if($(e.target).closest('.cl2,.cl3').length) return;
             if(!$(this).attr('tid')) return;

        		  if(!$('.task-detail').length){    			
    	    		var modalJs = require('../project_task_create/project_task_create');	     		 
    			 	  var _html = require('html!../project_task_create/project_task_create.html');			 	 
              var frag = $(_html);
    			 	  frag.find('.title').eq(0).html('任务详情').find('.reset-form').remove();
    			 	  frag.find('.reset-form').remove();
    			 	  frag.find('.u-msg-ok').html('确定');
    			 	  //$('#content').append(frag.removeClass('new-project wt-modal').addClass('task-detail'));
              var taskId = $(this).attr('tid');
              // $('#content').html('');

              $('#content').append(frag.removeClass('new-project wt-modal').addClass('task-detail'));
                                  // u.compMgr.updateComp();
              modalJs.init(projectId,taskId,frag,1);    	
        		 }else{
                var modalJs = require('../project_task_create/project_task_create');
                var frag = $(_html);
                var taskId = $(this).attr('tid');
                modalJs.init(projectId,taskId,frag,0);
             }



    		 	  $('.pro-info-tem.task-detail').removeClass('hidden');
    		 	  setTimeout(function(){
    		 	  	$('.pro-info-tem.task-detail form:first-child').addClass('act');
    		 	  },50);
            	
        })
        
        $('.content_bar span.p_btn.gr,.new-task-btn').on('click',function(){
			setTimeout(function(){
				
				 	  var modalJs = require('../project_task_create/project_task_create');
		     		  
				 	  var _html = require('html!../project_task_create/project_task_create.html');
				 	  var   param	= {
					 	  	  	template:_html,
					 	  	  	msg:'',
					 	  	  	okText:'',
					 	  	  	cancelText:'',
					 	  	  	title:'添加新任务',
					 	  	  	onOk : creattask,
					 	  	  	onCancel : function(){}
				 	  	  	};
				 	  
				 	  u.confirmDialog(param);
		        modalJs.init(null,null,null,1);
				 	  setTimeout(function(){
				 	  	$('.wt-modal.new-task form:first-child').addClass('act');
				 	  },50);
			},50)
		 })
         function starttask(){
         	 var config = require('../../config/config'); 
         	 var projectId,taskId;
           projectId = $('body').attr('pid');
         	 taskId=$(this).parent().attr('tid');
         	 console.log(taskId);    
            vali.showwait();     
         	  $.ajax({                          
                          url: config.server+"/service/project/"+projectId+"/task/"+taskId+"/start",
                          type: 'put',
                          dataType:'json',
                          contentType:'application/json',
                          data:null,
                           headers:{
                            'Authorization':authToken
                           },
                          success: function (json,e) {
                            // alert(JSON.stringify(json));
                             if (!json['success']){                                
                                 vali.closewait();
                                 vali.showMsg(json['error'].errorMessage,1,2000);
                             }else{
                                 console.log(json) ;
                                 initdata(projectId);                                 
                                 vali.closewait();  
                                 vali.showMsg('任务启动成功',0,2000);
                             }
                            
                         },
                         error:function(json,e){
                             console.log(e) ;
                          }
                       }); 
         	 
         }
         function closetask(){
         	 var config = require('../../config/config');
         	 var projectId,taskId;
           projectId = $('body').attr('pid');
         	 taskId=$(this).parent().parent().attr('tid');
         	 // console.log(taskId);
         	 //  return;
            vali.showwait();
         	  $.ajax({
                          url: config.server+"/service/project/"+projectId+"/task/completion/"+taskId,
                          type: 'put',
                          dataType:'json',
                          contentType:'application/json',
                          data:null,
                           headers:{
                            'Authorization':authToken
                           },
                          success: function (json,e) {
                            // alert(JSON.stringify(json));
                            if (!json['success']){                                
                                 vali.closewait();
                                 vali.showMsg(json['error'].errorMessage,1,2000);
                             }else{ 
                                console.log(json) ;
                                initdata(projectId);
                                 vali.closewait();
                                 vali.showMsg('任务完成成功',0,2000);
                            }
                         },
                         error:function(json,e){
                             console.log(e) ;
                          }
                       }); 
         	 
         }

        
        function initdata(projectId){
        	var config = require('../../config/config');
          var tmp =  $('body').attr('pid');
           vali.showwait();
        	 $.ajax({
                      url: config.server+"/service/project/"+tmp+"/task/list",
                      type: 'get',
                      dataType:'json',
                       headers:{
                        'Authorization':authToken
                       },
                      // contentType:'application/json',
                      // data:data,
                      success: function (json,e) {
                       // alert(JSON.stringify(json));
                        console.log(json) ;
                        drawTaskUI(json);
                         vali.closewait();
                     },
                     error:function(json,e){
                         console.log(e) ;
                      }
                });

        }

        function drawTaskUI(json){
					if(json['success']){
						$('.project_detail_head h2').html($('body').attr('pname'));
						var unstarted = json['data']['unstarted'];
						var ongoing = json['data']['ongoing'];
						var finished = json['data']['finished'];

            unstarted = preparedata(unstarted);
            ongoing = preparedata(ongoing);
            finished = preparedata(finished); 
            console.log(unstarted);
            
            if (unstarted){
              $('#unstarted_task > p > i').text('未开始的('+unstarted.length+')');             
            }
            if(ongoing){
              $('#ongoing_task > p > i').text('进行中的('+ongoing.length+')');  
            }
            if(finished){
             $('#finished_task > p > i').text('已完成的('+finished.length+')');    
            }
            
						var doT = require("dot");

						var template=document.getElementById('unstarted').innerHTML;
						var _html = doT.template(template)(unstarted);
     				    $('#unstarted_task ul').empty();
                        $('#unstarted_task ul').html(_html) ;
                        $('#unstarted_task ul li span.cl3').on('click',starttask);

                        var template=document.getElementById('ongoing').innerHTML;
						var _html = doT.template(template)(ongoing);
     				    $('#ongoing_task ul').empty();
                        $('#ongoing_task ul').append(_html) ;
                        $('#ongoing_task ul li span.cl3 input').on('click',closetask);
                      


                        var template=document.getElementById('finished').innerHTML;
						var _html = doT.template(template)(finished);
     				    $('#finished_task ul').empty();
                        $('#finished_task ul').html(_html) ;
					}

        }

        // drawUI(); 其他不应该访问?#/project/detail/doc 不应该触发task
        if ($('body').attr('pid') &&(window.location.hash !== "#/project/detail/doc")&&(window.location.hash !== "#/project/detail/meeting")&&(window.location.hash !== "#/project/detail/review")&&(window.location.hash !== "#/project/detail/dynamic")){
           
             initdata(projectId);  
        }
        

        $(document).on("task", function(){
           
            initdata($('body').attr('pid'));  
          });

        function isHas(adata) {
          if (!adata) return false;
           if (!adata.length) return false;

           var uinfo = JSON.parse(vali.getCookie('userinfo'));
           var cid = uinfo['data']['memberId'];
           
           if (cid){
              // alert(cid);
           }
           else{
            cid = 1;
           }
           
           var i = 0;
           for (i=0;i<adata.length;i++){
             if (cid == adata[i]['id']){
                 return true;
             }
           }
           return false;
        }
        function preparedata(sdata){
           if (!sdata) return;
          var i = 0;
            for (i=0;i<sdata.length;i++){
               if (isHas(sdata[i]['executors'])){
                 sdata[i]['ok'] = 1;
               }
           }         
           return sdata;

        }

        function creattask(){
         var taskModel  = window.taskModel;  
         var config = require('../../config/config');
          var name = $('.new-task:not(.task-detail) #taskformInfo .form-bd > input').val();                      
           if (!$.trim(name)){
              vali.showMsg('任务名称不能为空',2,2000);
              return false;
           }
          var description = $('#taskformInfo .form-bd > textarea').val();    
           // if (!$.trim(description)){
           //    vali.showMsg('任务描述不能为空',2,2000);
           //    return false;
           // }
        
          var startdate = $('#psta1').val();
          var enddate =$('#pend1').val(); 
          if ($.trim(startdate) && !$.trim(enddate) ){
              vali.showMsg('任务结束时间不能为空',2,2000);
              return false;
           }  
            if ($.trim(enddate) && !$.trim(startdate) ){
              vali.showMsg('任务开始时间不能为空',2,2000);
              return false;
           } 

           var start=new Date(startdate.replace("-", "/").replace("-", "/"))
           var end =new Date(enddate.replace("-", "/").replace("-", "/"))
           if (start>end){
             vali.showMsg('任务开始时间不能晚于结束时间',2,2000);
              return false;
           }
          var priority = $('.pro-info-tem .emer-lvl input:checked+label').attr('data'); 
           if (!priority){
              vali.showMsg('任务优先级没有设置',2,2000);
              return false;
           }
          var pInfo = {
                "name":name,                       
                "description":description,
                "planStartdate":startdate,
                "planEnddate":enddate,
                "priority":priority, 
                "executorIdList":['1','2','3']

          };

            taskModel.taskDT.setValue('priority', priority);
            // taskModel.taskDT.setValue('executorList',['1','2','3']);
            var a = [];
            var i = 0;
            var rows = taskModel.taskDT.getValue('executorList').getAllRows();
            for (var i =0;i<rows.length;i++){
                var id = rows[i].getValue('id');
                a[i] = id;
            }
            //taskModel.taskDT.getValue('executors').setSimpleData(['1','2','3']);



           var data = JSON.stringify(pInfo);

           data = taskModel.taskDT.getSimpleData(); 
           var tmp =data[0];
           tmp.executors = a;
           delete data[0].executorList;
            delete data[0].executorIdList;

           var projectId = $('body').attr('pid');
            vali.showwait();
            $.ajax({
              url: config.server+"/service/project/"+projectId+"/task",
              type: 'post',
              dataType:'json',
              contentType:'application/json',
              data:JSON.stringify(data[0]),
               headers:{
                            'Authorization':authToken
                           },
              success: function (json,e) {
                if (!json['success']){
                   vali.closewait();
                  vali.showMsg(json['error'].errorMessage,1,2000);
                }else{
                //alert(JSON.stringify(json));
                console.log(json) ;
                initdata(projectId);
                  vali.closewait();
                 vali.showMsg('任务创建成功',0,2000);
                }  
              
             },
             error:function(json,e){
                 console.log(e) ;

              }
           });
            return true;
    }

    }//end init module
}
