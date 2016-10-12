module.exports = {
     
    init: function(projectId,frag,bind){
      var edita = false;
     var authToken = JSON.parse(vali.getCookie('authToken'));
      var projectModel = require('./projectModule');      
      if (bind == 1){
         window.projectModel = projectModel;        
         ko.cleanNode($('#projectformInfo')[0]);
         var app = u.createApp({
          el:'#projectformInfo',
          model:projectModel
         });

         var uinfo = JSON.parse(vali.getCookie('userinfo'));
         // alert(vali.getCookie('userinfo'));
         // alert(uinfo['data']['userId']);
         // alert(uinfo['data']['name']);
         projectModel.projectDT.setValue('master.id',uinfo['data']['memberId']);
         projectModel.projectDT.setValue('master.name',uinfo['data']['name']);
         var userId = uinfo['data']['userId'];
          // alert(token);
        // $('.u-overlay').css('z-index','900');
        $('#content').attr('pid',projectId);
        $(document).on('click','.reset-form',function(){
        $(this).closest('form')[0].reset();
            // creatproject();
    	   })
        $(document).on('click','.mem-invite-btn',function(){
        	var tarDom = $('.invite-colleague');
        	tarDom.removeClass('hidden');
        	setTimeout(function(){tarDom.addClass('act')},50)
    	})
        $(document).on('click','.item.add,.item.edit',function(e){
        	$(e.target).siblings('.mem-add-tab').removeClass('hidden')
    	})
       
        $(document).on('click','.invite-colleague .btn-h,.invite-colleague .wt-modal-close',function(){
        	var tarDom = $('.invite-colleague');
        	tarDom.removeClass('act')
        	setTimeout(function(){tarDom.addClass('hidden')},400)
    	})
        $(document).on('click',function(e){
	        	var target = $(e.target),
	        		formIndex = $('.project-detail form:first-child').index(target.closest('form')),
	        		DomToCtrl = $('.project-detail form:first-child');
	        		if(!target.closest('.u-date-panel').length&&(!target.closest('#prodetail').length)&&(!target.closest('.project-detail').length||target.is($('.project-detail form:first-child .wt-modal-close,.project-detail form:first-child .u-msg-ok')))){
			          	DomToCtrl.removeClass('act')
			          	setTimeout(function(){DomToCtrl.parent().remove()},400)
	        		}
    	})
        $(document).on('click','.new-project,.project-detail',function(e){
        	if(!$(e.target).closest('.mem-add-tab').length&&!$(e.target).hasClass('add')&&!$(e.target).hasClass('edit')){
	        	$('.mem-add-tab').addClass('hidden')
        	}
    	})
        $(document).on('click','.pro-info-tem .add-line',function(e){
        	var domStr = '<li><label for="">姓名</label> <input type="" name="" id="" value="" placeholder="请输入姓名"><label for="">联系方式</label> <input type="" name="" id="" value="" placeholder="请输入邮箱或手机号"></li>'
        	$(e.target).siblings('ul').append(domStr);
        });

    }  
     
        function mpdifyproject(projectId){
             var config = require('../../config/config'); 
              vali.showwait();
              $.ajax({
                        url: config.server+"/service/project/"+projectId,
                        type: 'get',
                        dataType:'json',
                        headers:{
                            'Authorization':authToken
                        },
                        // contentType:'application/json',
                        // data:data,
                        success: function (json,e) {
                          // alert('--'+frag);
                          // alert(JSON.stringify(json));
                         console.log('productedit'+JSON.stringify(json));
                          // drawProjectUI(json);
                          //准备编辑数据 
                          if(!$('.project-detail').length){  
                            // $('#content').append(frag.removeClass('new-project wt-modal').addClass('project-detail'));
                            // u.compMgr.updateComp();
                          }                              
                        if (json['success']){ 
                             projectModel.projectDT.setSimpleData(json['data']);                  
                           // projectModel.name(json['data']['name']+'---');

                           //  projectModel.partnerIdList(json['data']['partners']);
                           // $('#projectformInfo .form-bd > input').val(json['data']['name']);  
                           // $('#charges > span').attr('uid','1');  
                           // $('#charges > span').text('杨建祖');  
                           // $('#projectformInfo .form-bd > textarea').val(json['data']['description']); 
                           
                           //  if (json['data']['startdate']){
                           //    $('#psta').val((json['data']['startdate']).substring(0,10));    
                           //  }
                           //  if (json['data']['enddate']){
                           //   $('#pend').val((json['data']['enddate']).substring(0,10)); 
                           //  }
                         }
                          vali.closewait();
                         frag.find('.u-msg-ok').off('click').on('click',saveproject);

                       },
                       error:function(json,e){
                           console.log(e) ;
                        }
                  });
        } 
        // var tmp =  $('#projectformInfo').attr('pid');
        if($('#content').attr('pid')){
           mpdifyproject($('#content').attr('pid')); 
           toggleblur(1) ;
           $('.inter-box .form-foot').css('display','none');
           edita = true;
        }else{
             projectModel.projectDT.removeAllRows();
             projectModel.projectDT.createEmptyRow();
             projectModel.projectDT.setRowSelect(0);
             var uinfo = JSON.parse(vali.getCookie('userinfo'));
             // alert(vali.getCookie('userinfo'));
             // alert(uinfo['data']['userId']);
             // alert(uinfo['data']['name']);
             projectModel.projectDT.setValue('master.id',uinfo['data']['memberId']);
             projectModel.projectDT.setValue('master.name',uinfo['data']['name']);
             toggleblur(0) ;
             edita = false;

             // u.compMgr.updateComp();
             // $('.u-msg-ok').off('click').on('click',creatproject)                           
        }
        

        function saveproject(){

           var config = require('../../config/config');               
         
            var name = $('#projectformInfo .form-bd > input').val();  
            console.log('--------2'+name);
             if (!$.trim(name)){
                vali.showMsg('项目名称不能为空',2,3000);
                return false;
             }
            var master = $('#charges > span').attr('uid');  
            var description = $('#projectformInfo .form-bd > textarea').val();    
             // if (!$.trim(description)){
             //    vali.showMsg('项目描述不能为空',2,2000);
             //    return false;
             // }
            var startdate = $('#psta').val();
            var enddate =$('#pend').val(); 
            if ($.trim(startdate) && !$.trim(enddate) ){
                vali.showMsg('项目结束时间不能为空',2,2000);
                return false;
             }  
              if ($.trim(enddate) && !$.trim(startdate) ){
                vali.showMsg('项目开始时间不能为空',2,2000);
                return false;
             } 
            
            var start=new Date(startdate.replace("-", "/").replace("-", "/"))
             var end =new Date(enddate.replace("-", "/").replace("-", "/"))
             if (start>end){
               vali.showMsg('项目开始时间不能晚于结束时间',2,2000);
                return false;
             }
            var pInfo = {
                  "name":name,
                  "master":1,
                  "description":description,
                  "startdate":startdate,
                  "enddate":enddate,
                  "partnerIdList":['1','2','3'],
                  "sharerIdList":['4','5']

            };
              var tmpid =  $('#content').attr('pid'); 
             var data = JSON.stringify(pInfo);
             console.log(data);

             var uid = window.projectModel.projectDT.getValue('master.id');
                       // alert(uid);
              window.projectModel.projectDT.setValue('master', uid); 

              var a = [];
              var i = 0;
              var rows = window.projectModel.projectDT.getValue('partners').getAllRows();
              for (i =0;i<rows.length;i++){
                  var id = rows[i].getValue('id');
                  a[i] = id;
              }
              // projectModel.projectDT.getValue('partners').setSimpleData(a); 
              var b = [];
              i = 0;
              var rows = window.projectModel.projectDT.getValue('sharers').getAllRows();
              for (i =0;i<rows.length;i++){
                  var id = rows[i].getValue('id');
                  b[i] = id;
              }
              // projectModel.projectDT.getValue('sharers').setSimpleData(a);

              data = window.projectModel.projectDT.getSimpleData(); 
              var tmp =data[0];
               tmp.partners = a;
               tmp.sharers = b;                         
               console.log(JSON.stringify(data[0]));
                vali.showwait();
              $.ajax({
                url: config.server+"/service/project/"+tmpid,
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
                     console.log(json) ;
                     console.log(e) ;
                      vali.closewait();
                     vali.showMsg('项目保存成功',0,2000);
                      
                     $('.project_detail_head h2').text(name).attr('title',name);  
                     $('body').attr('pname',name);  
                      
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
         var selDom = $(self).closest('.line-cont').find('.item'),disUids=[];
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
                        _htm = _htm + '<li id='+userlist[k].id+'>'+userlist[k].name+'</li>'
                        }else{
                        	_htm = _htm + '<li id='+userlist[k].id+' class="checked">'+userlist[k].name+'</li>'
                      }
                      }
                      ul.empty().html(_htm);

                    }
                 },
               error:function(json,e){
                   console.log(e) ;
                }
          });
       }
       $(document).off('keyup').on('keyup','#master,#partner,#sharer',function(e){
          if ($.trim($(this).val()).length){
              getusers($(this).val(),this);
           };


       });
        $(document).off('click','.pro-info-tem .mem-add-tab .mem-list li').on('click','.pro-info-tem .mem-add-tab .mem-list li',function(){
            if(!$(this).hasClass('checked')){
            if ($(this).parent().attr('id') == 'ul_master'){
              projectModel.projectDT.setValue('master.id',$(this).attr('id'))
              projectModel.projectDT.setValue('master.name',$(this).text());  
            }else if ($(this).parent().attr('id') == 'ul_partner'){
              var us = {
                id:$(this).attr('id'),
                name:$(this).text()
              };
              
              // var row = projectModel.projectDT.getValue('partners').createEmptyRow();              
              // projectModel.projectDT.getValue('partners').setRowSelect(row['rowId']);
              // row.getValue('partners').setSimpleData(us);
              projectModel.projectDT.getValue('partners').addSimpleData(us);
		
            }else if ($(this).parent().attr('id') == 'ul_share'){
               var us = {
                id:$(this).attr('id'),
               name:$(this).text()
              };
              // projectModel.projectDT.getValue('sharers').createEmptyRow();
              projectModel.projectDT.getValue('sharers').addSimpleData(us);
            }
		            setTimeout(function(){$('.mem-list').html('')},0); 
             $(this).parent().parent().addClass('hidden');
            }   
            if(edita){
              saveproject();  
            }         
            

        })
      function finishprj(id){
        var config = require('../../config/config');
        // body...
        $.ajax({
                url: config.server+"/service/project/completion/"+id,
                type: 'put',
                dataType:'json',
                contentType:'application/json',
                data:null,
                headers:{
                            'Authorization':authToken
                        },
                success: function (json,e) {
                  if (!json['success']){
                    vali.showMsg(json['error'].errorMessage,1,2000);
                  }else{
                     console.log(json) ;
                     console.log(e) ;
                     vali.showMsg('结束项目成功',0,2000);
                     
                  }
               },
               error:function(json,e){
                   console.log(e) ;
                }
             });
      }
       $('.pro-info-tem .line-cont .add span img').on('click',function(){
           var tar = $(this);
           setTimeout(function(){
            	tar.parent().remove();
            },0)
         // 
       })

       function delteusers(type){
        if (type=="partners"){
          var len = projectModel.projectDT.getAllRows().length;
          projectModel.projectDT.getValue("partners").removeRow(len-1);

        }else if (type=="sharers"){
          var len = projectModel.projectDT.getAllRows().length;
          projectModel.projectDT.getValue("sharers").removeRow(len-1);
         // body...
       }
     }

        // $(document).on('click','.pro-info-tem .line-cont span img',function(){
        //      var tar = $(this);
        //      var temp = $(this).parent().parent().attr('id');
        //      if (temp =='attends'){
        //         temp = "partners";
        //      }else if (temp =='relatives'){
        //        temp = "sharers";
        //      }
        //      setTimeout(function(){
        //     	tar.parent().remove();
        //        delteusers(temp);
        //     },0)
        // })
       
        $(document).on('mouseenter','.pro-info-tem .line-cont .item',function(){
           // alert('1');
        })

        function toggleblur(isblur){
          // body...
          if (isblur){
            $('#projectformInfo .form-bd > input').off('blur').on('blur',saveproject);
            $('#projectformInfo .form-bd > textarea').off('blur').on('blur',saveproject);
          }else{
            $('#projectformInfo .form-bd > input').off('blur');
            $('#projectformInfo .form-bd > textarea').off('blur');
          }

        }
         $(document).on('selpdate',function(){
          // body...
          saveproject();
        })

   },
   saveproject:function(){

           var config = require('../../config/config');               
         
            var name = $('#projectformInfo .form-bd > input').val();  
            console.log('--------2'+name);
             if (!$.trim(name)){
                vali.showMsg('项目名称不能为空',2,3000);
                return false;
             }
            var master = $('#charges > span').attr('uid');  
            var description = $('#projectformInfo .form-bd > textarea').val();    
             // if (!$.trim(description)){
             //    vali.showMsg('项目描述不能为空',2,2000);
             //    return false;
             // }
            var startdate = $('#psta').val();
            var enddate =$('#pend').val(); 
            if ($.trim(startdate) && !$.trim(enddate) ){
                vali.showMsg('项目结束时间不能为空',2,2000);
                return false;
             }  
              if ($.trim(enddate) && !$.trim(startdate) ){
                vali.showMsg('项目开始时间不能为空',2,2000);
                return false;
             } 
            
            var start=new Date(startdate.replace("-", "/").replace("-", "/"))
             var end =new Date(enddate.replace("-", "/").replace("-", "/"))
             if (start>end){
               vali.showMsg('项目开始时间不能晚于结束时间',2,2000);
                return false;
             }
            var pInfo = {
                  "name":name,
                  "master":1,
                  "description":description,
                  "startdate":startdate,
                  "enddate":enddate,
                  "partnerIdList":['1','2','3'],
                  "sharerIdList":['4','5']

            };
              var tmpid =  $('#content').attr('pid'); 
             var data = JSON.stringify(pInfo);
             console.log(data);

             var uid = window.projectModel.projectDT.getValue('master.id');
                       // alert(uid);
              window.projectModel.projectDT.setValue('master', uid); 

              var a = [];
              var i = 0;
              var rows = window.projectModel.projectDT.getValue('partners').getAllRows();
              for (i =0;i<rows.length;i++){
                  var id = rows[i].getValue('id');
                  a[i] = id;
              }
              // projectModel.projectDT.getValue('partners').setSimpleData(a); 
              var b = [];
              i = 0;
              var rows = window.projectModel.projectDT.getValue('sharers').getAllRows();
              for (i =0;i<rows.length;i++){
                  var id = rows[i].getValue('id');
                  b[i] = id;
              }
              // projectModel.projectDT.getValue('sharers').setSimpleData(a);

              data = window.projectModel.projectDT.getSimpleData(); 
              var tmp =data[0];
               tmp.partners = a;
               tmp.sharers = b;                         
               console.log(JSON.stringify(data[0]));
                vali.showwait();
              $.ajax({
                url: config.server+"/service/project/"+tmpid,
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
                     console.log(json) ;
                     console.log(e) ;
                      vali.closewait();
                     vali.showMsg('项目保存成功',0,2000);
                      
                     $('.project_detail_head h2').text(name).attr('title',name);  
                     $('body').attr('pname',name);  
                      
                  }
               },
               error:function(json,e){
                   console.log(e) ;
                }
             });
               return true;
      } 

}
