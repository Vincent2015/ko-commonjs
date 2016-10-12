module.exports = {
    init: function(projectId,taskId,frag,bind){
      var edita = false;
      var authToken = JSON.parse(vali.getCookie('authToken'));        
      var taskModel = require('./taskModule');
        if (bind == 1){

         window.taskModel = taskModel;
        
         ko.cleanNode($('#taskformInfo')[0]);
         var app = u.createApp({
          el:'#taskformInfo',
          model:taskModel
         });
        //alert('page3 init')        
        // u.compMgr.updateComp();
        $('#content').attr('pid',projectId);
        $('#content').attr('tid',taskId);
        $(document).on('click','.reset-form',function(){
        	$(this).closest('form')[0].reset();
    	});
        $(document).on('click','.mem-invite-btn',function(){
        	var tarDom = $('.invite-colleague');
        	tarDom.removeClass('hidden');
        	setTimeout(function(){tarDom.addClass('act')},50)
    	});
        $(document).on('click','.item.add',function(){
        	$(this).siblings('.mem-add-tab').removeClass('hidden')
    	});
        $(document).on('click','.invite-colleague .btn-h,.invite-colleague .wt-modal-close',function(){
        	var tarDom = $('.invite-colleague');
        	tarDom.removeClass('act')
        	setTimeout(function(){tarDom.addClass('hidden')},400)
    	});
        $(document).on('click','.new-task',function(e){
        	if(!$(e.target).closest('.mem-add-tab').length&&!$(e.target).hasClass('add')){
	        	$('.mem-add-tab').addClass('hidden')
        	}
    	});
    	$(document).on('click',function(e){
	        	var target = $(e.target),
	        		formIndex = $('.task-detail form:first-child').index(target.closest('form')),
	        		DomToCtrl = $('.task-detail form:first-child');
	        		if(!target.closest('.u-date-panel').length&&(!target.closest('#project_content li').length)&&(!target.closest('.task-detail').length||target.is($('.task-detail form:first-child .wt-modal-close,.task-detail form:first-child .u-msg-ok')))){
			          	DomToCtrl.removeClass('act')
			          	// setTimeout(function(){DomToCtrl.parent().addClass('hidden')},400)
                 DomToCtrl.parent().remove();
                 //setTimeout(function(){DomToCtrl.parent().remove()}0)
	        		}
    	})
    	var c_flag = 1;
        $(document).on('click','.new-task',function(e){
        	c_flag = c_flag==0?c_flag:1;
        	if($(e.target).closest('.emer-lvl').length&&c_flag){
	        	$('.emer-lvl-fileds').removeClass('hidden');
        	}
        	else{
	        	$('.emer-lvl-fileds').addClass('hidden');
	        	c_flag--;
        	}
    	});
       $(document).on('click','.emer-lvl-fileds label',function(){
          $('.emer-lvl-fileds label').removeClass('checked');
          $(this).addClass('checked');
      })  
        
    	$(document).on('click','.pro-info-tem .add-line',function(e){
        	var domStr = '<li><label for="">姓名</label> <input type="" name="" id="" value="" placeholder="请输入姓名"><label for="">联系方式</label> <input type="" name="" id="" value="" placeholder="请输入邮箱或手机号"></li>'
        	$(e.target).siblings('ul').append(domStr);
        	//return false;
        });
}//end bind

        if($('#content').attr('tid')){
          modifyTask(projectId,taskId);  
          toggleblur(1);
          $('.inter-box .form-foot').css('display','none');
          edita = true;
        }else{
           taskModel.taskDT.removeAllRows();
           taskModel.taskDT.createEmptyRow();
           taskModel.taskDT.setRowSelect(0);
           u.compMgr.updateComp();
           toggleblur(0);
           edita = false;
        }

        
       function modifyTask(projectId,taskId){
            var config = require('../../config/config');           
            var projectId = $('body').attr('pid');
              vali.showwait();
             $.ajax({
                          url: config.server+"/service/project/"+projectId+"/task/"+taskId,
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
                            if(!$('.task-detail').length){
                              // $('#content').append(frag.removeClass('new-project wt-modal').addClass('task-detail'));
                              // u.compMgr.updateComp();
                            }
                            //准备编辑数据
                            if (json['success']){
                              
                              taskModel.taskDT.setSimpleData(json['data']);
                              taskModel.taskDT.getValue('executorList').setSimpleData(taskModel.taskDT.getValue('executors').getSimpleData())
                              var priority =  taskModel.taskDT.getValue('priority');
                              $('.emer-lvl-fileds [data="'+priority+'"]').trigger('click');//attr('checked','checked').css('background','#f00');
                                // $('#taskformInfo .form-bd > input').val(json['data']['name']);                      
                                // $('#taskformInfo .form-bd > textarea').val(json['data']['description']);    
                                //  $('#psta1').val((json['data']['planStartdate']).substring(0,10));  
                                //  $('#pend1').val((json['data']['planEnddate']).substring(0,10)); 
                                // $('.taskformInfo .emer-lvl input:checked+label').attr('data',2); 
                            }
                              vali.closewait();

                             frag.find('.u-msg-ok').off('click').on('click',saveTask);
                         },
                         error:function(json,e){
                             console.log(e) ;
                          }
                    });

        }
        function saveTask(){
            var config = require('../../config/config');
            
            var name = $('#taskformInfo .form-bd > input').val();                      
            if (!$.trim(name)){
                      vali.showMsg('任务名称不能为空',2,2000);
                      return false;
             }
            var description = $('#taskformInfo .form-bd > textarea').val();    
            // if (!$.trim(description)){
            //     vali.showMsg('任务描述不能为空',2,2000);
            //     return false;
            //  }
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
            
            var pInfo = {
                  "name":name,                       
                  "description":description,
                  "planStartdate":startdate,
                  "planEnddate":enddate,
                  "priority":priority, 
                  "executors":['1','2']

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
            // taskModel.taskDT.getValue('executors').setSimpleData(a);
          
            var tmp1 =  $('body').attr('pid');
            // $('#content').attr('pid','');
            var tmp2 =  $('#content').attr('tid');
            // $('#content').attr('tid','')
           
          
          
           var data = JSON.stringify(pInfo);
            console.log('1----'+data);
           data = taskModel.taskDT.getSimpleData(); 

           var tmp =data[0];
           tmp.executors = a;
           // alert(JSON.stringify(pInfo));
           delete data[0].executorList;
           console.log('2----'+JSON.stringify(data[0]));
            // return;
              vali.showwait();
            $.ajax({
              // url: "http://10.2.112.33:8080/service/project/"+tmp1+"/task/"+tmp2,
              url: config.server+"/service/project/"+tmp1+"/task/"+data[0].id,
              type: 'put',
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
                  // alert(JSON.stringify(json));
                   console.log(json) ;
                 // initdata(tmp1);
                   $('#content').trigger("task");
                     vali.closewait();
                   vali.showMsg('任务保存成功',0,2000);

                 }
             },
             error:function(json,e){
                 console.log(e) ;
              }
           });
            return true;
        }
          
         function getusers(name,self){
         var ul =$(self).siblings('ul');
         var url = '';
         // return;
         var selDom = $(self).closest('.line-cont').find('.new .item'),disUids=[];
         selDom.each(function(){
         	if($(this).attr('uid')){
	         	disUids.push($(this).attr('uid'));
         	}
         })
         var config = require('../../config/config');
         $.ajax({
                // url: config.server+":10066/service/member/inters/"+name,
                //url:'/mockData/users.json',
                url:config.server+"/service/member/inters/"+name,
                type: 'get',
                dataType:'json', 
                 headers:{
                            'Authorization':authToken
                           },                      
                success: function (json,e) {                        
                 console.log('uselist'+JSON.stringify(json));
                  // drawProjectUI(json);
                  //准备编辑数据              
                    if (json['success']){ 
                     // projectModel.projectDT.setSimpleData(json['data']);
                      var userlist = json['data'];
                      var _htm = '';
                      var k = 0;
                      
                      for(k=0;k<userlist.length;k++){
                      	if($.inArray(""+userlist[k].id,disUids)<0){
	                        _htm = _htm + '<li id='+userlist[k].id+'>'+userlist[k].name+'</li>';
                      	}else{
	                        _htm = _htm + '<li id='+userlist[k].id+' class="checked" '+'>'+userlist[k].name+'</li>';
                      	}
                      }
                      ul.empty().html(_htm);

                    }else{
                      vali.showMsg(json['error'].errorMessage,1,2000);
                    }
                 },
               error:function(json,e){
                   console.log(e) ;
                }
          });
       }
       $(document).off('keyup').on('keyup','#executors',function(e){
//         if (e.keyCode==13){
           if ($.trim($(this).val()).length){
              getusers($(this).val(),this);
           };


       });
        $(document).off('click','.pro-info-tem #taskformInfo .mem-add-tab .mem-list li').on('click','.pro-info-tem #taskformInfo .mem-add-tab .mem-list li',function(e){
            if(!$(this).hasClass('checked')){
            	
	            var us = {
	                 id:$(this).attr('id'),
	                 name:$(this).text()
	               };
	            // taskModel.taskDT.getValue('executorList').createEmptyRow();
	            taskModel.taskDT.getValue('executorList').addSimpleData(us);
				setTimeout(function(){$('.mem-list').html('')},0);         
	             	$(this).parent().parent().addClass('hidden');

                if(edita){
                  saveTask();
                }
            }

        })

          $('.pro-info-tem .line-cont .add span img').on('click',function(){
             var tar = $(this);
             setTimeout(function(){
            	tar.parent().remove();
            },0)
         // 
       })

        // $(document).on('click','.pro-info-tem .line-cont span img',function(){
        //      var tar = $(this);
        //      setTimeout(function(){
        //     	tar.parent().remove();
        //     },0)
        // })
       
        $(document).on('mouseenter','.pro-info-tem .line-cont .item',function(){
           // alert('1');
        })

        function toggleblur(isblur){
          // body...
          if (isblur){
            $('#taskformInfo .form-bd > input').off('blur').on('blur',saveTask);
            $('#taskformInfo .form-bd > textarea').off('blur').on('blur',saveTask);
          }else{
            $('#taskformInfo .form-bd > input').off('blur');
            $('#taskformInfo .form-bd > textarea').off('blur');
          }

        }
         $(document).on('seltdate',function(){
          // body...
          saveTask();
        })
    },
    savetask:function(){
            var config = require('../../config/config');
            
            var name = $('#taskformInfo .form-bd > input').val();                      
            if (!$.trim(name)){
                      vali.showMsg('任务名称不能为空',2,2000);
                      return false;
             }
            var description = $('#taskformInfo .form-bd > textarea').val();    
            // if (!$.trim(description)){
            //     vali.showMsg('任务描述不能为空',2,2000);
            //     return false;
            //  }
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
            
            var pInfo = {
                  "name":name,                       
                  "description":description,
                  "planStartdate":startdate,
                  "planEnddate":enddate,
                  "priority":priority, 
                  "executors":['1','2']

            };
            window.taskModel.taskDT.setValue('priority', priority);
            // taskModel.taskDT.setValue('executorList',['1','2','3']);
            var a = [];
            var i = 0;
            var rows = window.taskModel.taskDT.getValue('executorList').getAllRows();
            for (var i =0;i<rows.length;i++){
                var id = rows[i].getValue('id');
                a[i] = id;
            }
            // taskModel.taskDT.getValue('executors').setSimpleData(a);
          
            var tmp1 =  $('body').attr('pid');
            // $('#content').attr('pid','');
            var tmp2 =  $('#content').attr('tid');
            // $('#content').attr('tid','')
           
          
          
           var data = JSON.stringify(pInfo);
            console.log('1----'+data);
           data = window.taskModel.taskDT.getSimpleData(); 

           var tmp =data[0];
           tmp.executors = a;
           // alert(JSON.stringify(pInfo));
           delete data[0].executorList;
           console.log('2----'+JSON.stringify(data[0]));
            // return;
            vali.showwait();
            $.ajax({
              // url: "http://10.2.112.33:8080/service/project/"+tmp1+"/task/"+tmp2,
              url: config.server+"/service/project/"+tmp1+"/task/"+data[0].id,
              type: 'put',
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
                  // alert(JSON.stringify(json));
                   console.log(json) ;
                 // initdata(tmp1);
                   $('#content').trigger("task");
                     vali.closewait();
                   vali.showMsg('任务保存成功',0,2000);

                 }
             },
             error:function(json,e){
                 console.log(e) ;
              }
           });
            return true;
        }
}
