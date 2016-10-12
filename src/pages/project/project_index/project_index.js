

module.exports = {
    init: function(){     
        window.sessionStorage.setItem('cid',1);
        var authToken = JSON.parse(vali.getCookie('authToken'));         
        var uinfo = JSON.parse(vali.getCookie('userinfo'));
        var userId = uinfo['data']['userId'];
       //      var addImg = document.getElementById('addImg');
		 // addImg.src = require('../../static/images/n_project.png');
		  $('.project_right').css('border','none');
		 // $('.project_right_content').css('border-top','1px solid #d7d7d7');

		  $('#project_content').css('overflow','auto');
      //$('.project_right_content').css('overflow','hidden');
      $('.project_right').css('overflow','auto');

		  $('.project_left_nav li').on('click',function(){
		 	$('.project_left_nav li').removeClass('active');
    	    $(this).addClass('active');
          var ptype = $(this).attr('ptype');
          initproject(1,ptype);
      })
      $('.page-deader .func-pannal .add-menu li:nth-child(1)').off('click').on('click',function(){
        $('.page-deader .func-pannal .add-menu').addClass('hidden');
       setTimeout(procreate,50)
      });
		 // $('#procreate').on('click',function(){

       function procreate(){        
		 	  var modalJs = require('../project_create/project_create');     		
		 	  var _html = require('html!../project_create/project_create.html');
		 	  var    param	= {
			 	  	  	template:_html,
			 	  	  	msg:'',
			 	  	  	okText:'',
			 	  	  	cancelText:'',
			 	  	  	title:'添加新项目',
			 	  	  	onOk : creatproject,
			 	  	  	onCancel : function(){}
		 	  	  	};
		 	  
		 	  u.confirmDialog(param);
        modalJs.init(null,null,1);
		 	  setTimeout(function(){
		 	  	$('.wt-modal.new-project form:first-child').addClass('act');
		 	  },50);
		 }
     if(window.location.hash == "#/project"){
       initproject(1,'mine');
     }
     

     function initproject(pagenum,ptype){
          var config = require('../../config/config');                 
             vali.showwait();
             $.ajax({
                          url: config.server+"/service/project?type="+ptype+"&pagesize=1000&pagenum="+pagenum,
                          type: 'get',
                          dataType:'json',
                           headers:{
                            'Authorization':authToken
                           },
                          // contentType:'application/json',
                          // data:data,
                          success: function (json,e) {
                           // alert(JSON.stringify(json));
                            if (json['success']){
                              console.log(json) ;
                              drawProjectUI(json);
                              vali.closewait();
                            }else{
                              //$('.project_right ul').empty();
                              vali.closewait();
                            }
                         },
                         error:function(json,e){
                             console.log(e) ;
                          }
                    });


      }
     function drawProjectUI(json){
        if(json['success']){            
            var productInfo = json['data'];
            var doT = require("dot");
            // if (document.getElementById('productInfo')){
              var template=document.getElementById('productInfo').innerHTML;  
            // }else{
            //   return;
            // }
            

            var _html = doT.template(template)(productInfo);
            $('.project_right ul').empty();
            $('.project_right ul').html(_html) ;
            var lastli ='<li><a class="u-nav-link pointer" id="procreate">'+
                 '<p></p>创建新项目</a></li>';
            $('.project_right ul').append(lastli);
            $('#procreate').on('click',procreate);
          }


     }
		 
     function creatproject(){
            
          var projectModel  = window.projectModel;   
          var config = require('../../config/config');          
            var pInfo = {
                            "name":"云创新中心-新增项目1",
                            "master":"222",
                            "description":"这是新增项目描述",
                            "startdate":"2015-12-22 10:11:23",
                            "enddate":"2016-12-23 10:11:23",
                            "partners":[{
                                "id":"1"
                                },{
                                "id":"2"    
                                },{
                                "id":"3"
                            }],
                            "sharers":[{
                                "id":"4"
                                },{
                                "id":"5"    
                                },{
                                "id":"6"
                            }]
                        };

                      var name = $('#projectformInfo .form-bd > input').val(); 
                       if (!$.trim(name)){

                          vali.showMsg('项目名称不能为空',2,2000);
                          return false;
                       }
                      var master = $('#charges > span').attr('uid');  
                      var description = $('#projectformInfo .form-bd > textarea').val();    
                      // if (!$.trim(description)){
                      //     vali.showMsg('项目描述不能为空',2,2000);
                      //     return false;
                      //  }
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
                     
                      // return;
                      var pInfo = {
                            "name":name,
                            "master":1,
                            "description":description,
                            "startdate":startdate,
                            "enddate":enddate,
                            "partnerIdList":['1','2','3'],
                            "sharerIdList":['4','5','6']

                      };
                        
                       var data = JSON.stringify(pInfo);
                       var uid = projectModel.projectDT.getValue('master.id');
                       // alert(uid);
                       projectModel.projectDT.setValue('master', uid);  

                        var a = [];
                        var i = 0;
                        var rows = projectModel.projectDT.getValue('partners').getAllRows();
                        for (i =0;i<rows.length;i++){
                            var id = rows[i].getValue('id');
                            a[i] = id;
                        }
                        // projectModel.projectDT.getValue('partners').setSimpleData(a); 
                        var b = [];
                        i = 0;
                        var rows = projectModel.projectDT.getValue('sharers').getAllRows();
                        for (i =0;i<rows.length;i++){
                            var id = rows[i].getValue('id');
                            b[i] = id;
                        }
                        // projectModel.projectDT.getValue('sharers').setSimpleData(a); 
                       
                         data = projectModel.projectDT.getSimpleData();                         
                         var tmp =data[0];
                         tmp.partners = a;
                         tmp.sharers = b;                         
                         console.log(JSON.stringify(data[0]));
                        // return;
                        vali.showwait();
                        $.ajax({
                          url: config.server+"/service/project",
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
                              console.log(json) ;

                             
                              var type =  $('.project_left_nav li.active').attr('ptype');
                              initproject(1,type);
                              vali.closewait();
                              vali.showMsg('项目创建成功',0,2000); 
                              return true;                             
                            }
                         },

                         error:function(json,e){
                             console.log(e) ;

                          }
                       });
                       return true;
           }

        function deleteprj(id){
        var config = require('../../config/config');
        // body...
         vali.showwait();
        $.ajax({
                url: config.server+"/service/project/"+id,
                type: 'DELETE',
                dataType:'json',
                contentType:'application/json',
                data:null,
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
                     vali.showMsg('结束删除成功',0,2000);
                     
                  }
               },
               error:function(json,e){
                   console.log(e) ;
                }
             });
      }


    }//end moudle init

}
