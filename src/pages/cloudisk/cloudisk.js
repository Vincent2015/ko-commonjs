require("../../../vendor/jquery/jquery-ui.js");
require("../../../vendor/jquery/ajaxfileupload.js");
module.exports = {
    init: function(){
      var ctrl = false;
      var sx,sy;
      var authToken = JSON.parse(vali.getCookie('authToken'));     
      var uinfo = JSON.parse(vali.getCookie('userinfo'));
      var userId = uinfo['data']['userId'];
      var config = require('../config/config'); 
      var cloudModel = require('./cloudModel'); 
      window.cloudModel = cloudModel;
    	ko.cleanNode($('#project_content')[0]);
      	var app = u.createApp({
      	  el:'#project_content',
      	  model:cloudModel
  	 });	
     var dirs=[];
     var dnames =[];
     window.dirs = dirs;
     window.dnames = dnames;
     //dnames.push($('.project_left_nav li.active a').text());
     initdata();
      function initdata(foldid,type){
      var ptype = type || "personal";
     	var url = config.server+"/service/clouddisk/"+ptype+"/itemlist?userId="+userId;      
     	if (foldid){
             url = url + '&dirId='+foldid;       
     	}
      //url ='http://10.1.78.83:3080/web-server/service/clouddisk/'+ptype+"/itemlist?userId="+userId;    
      vali.showwait();
     	$.ajax({
                url: url,
                type: 'get',
                dataType:'json',
                 headers:{
                            'Authorization':authToken
                           },
                success: function (json,e) {                          
                console.log('file data'+JSON.stringify(json));
                if (json['success']){ 
                     //cloudModel.cloudDT.setSimpleData(json['data']);
                     drawProjectUI(json)                  
                   
                 }else{
                  $('#project_content .file_list').empty();
                 }
                  togglefunction();
                  vali.closewait();
               },
               error:function(json,e){                  
                   console.log(e) ;
               }
            });
        } 
    
     function drawProjectUI(json){
        if(json['success']){            
            var fileInfo = json['data']['items'];
            var doT = require("dot");           
            var template=document.getElementById('fileInfo').innerHTML;

            var _html = doT.template(template)(fileInfo);
            $('#project_content .file_list').empty();
            $('#project_content .file_list').html(_html) ;  
             
           
          }


     }

     $(document).on('click','#project_content .file_list .file_b span',function(e){
	       // alert('1');     
			 $(this).siblings('i').attr('contenteditable',"true").removeClass('readmode');
            $(this).siblings('i').css('border',"1px solid #cdcdcd")
                .css('background-color','#FFFFFF').css('height','20px').focus().select();
		})
      $(document).off('keydown','#project_content .file_list .file_b i').on('keydown','#project_content .file_list .file_b i',function(e){
          if (e.keyCode==13){
            $(this).trigger("blur");
            e.preventDefault();
            e.stopPropagation();             
          }
          
     // 	if (e.keyCode==13){     	
     //      console.log('>>>>>',$(e.target))	
     //     console.log(e.currentTarget.tagName);
     // 		var newvalue= $(this).text();
     //   		if (!newvalue){
     //   		   vali.showMsg('文件夹名称不能为空',1,1500);
     //     			return;	
     //   		}
     //   		var dirid = $(this).parent().parent().attr('id');
     //      if (!dirid){
     //        newfile(newvalue);
     //         e.preventDefault();
     //         e.stopPropagation(); 
            
     //      }else{
     //        modifyname(dirid,newvalue);
     //        e.preventDefault();
     //        e.stopPropagation(); 
     //      }
     		  
     // 	}
     	    
      })

      $(document).off('click','#project_content .file_list .file_b i').on('click','#project_content .file_list .file_b i',function(e){
            if ($(this).parent().parent().hasClass('sel')){
                   $(this).attr('contenteditable',"true").removeClass('readmode');
                 $(this).css('border',"1px solid #cdcdcd")
                .css('background-color','#FFFFFF').css('height','20px').focus().select();
                 $(this).trigger("dblclick");
                 e.preventDefault();
                e.stopPropagation(); 
            }else{

            }
      })

       $(document).off('dblclick','#project_content .file_list .file_b i').on('dblclick','#project_content .file_list .file_b i',function(e){
             e.preventDefault();
             e.stopPropagation();
      })

     $(document).off('blur','#project_content .file_list .file_b i').on('blur','#project_content .file_list .file_b i',function(e){
        var newvalue= $(this).text();
          if (!newvalue){
             vali.showMsg('文件夹名称不能为空',1,1500);
              return; 
          }
          var dirid = $(this).parent().parent().attr('id');
          var type = '';
          if ($(this).parent().prev().hasClass('folder')){
            type = 'directory';
          }else{
            type = 'file';
          }
          if (!dirid){
            newfile(newvalue);
             e.preventDefault();
             e.stopPropagation(); 
            
          }else{
            modifyname(dirid,newvalue,type);
            e.preventDefault();
            e.stopPropagation(); 
          }
     })         
     $('.project_detail_head span.file_btn.gr').on('click',function(){
     	     var folderTmp =' <li class="">'+
               '<div class="file_t folder"></div>'+
               '<div class="file_b"><i contenteditable=true autofocus="autofocus" style="background-color:#FFFFFF;border:1px solid #cdcdcd;height:20px;">未命名文件夹</i><span></span></div></li>';
             var dom = $(folderTmp).appendTo($('#project_content ul'));
             $('#project_content').scrollTop(200000);
              dom.find('.file_b i').css('width','90px').focus();


         })

        function modifyname(dirid,newvalue,type) {
          // body...  /service/clouddisk/{doctype}/file/{fileId}/rename?newName=aaa.txt
          console.log('type:'+type);
          var ptype  = $('.project_left_nav li.active').attr('ptype');
          var url = config.server+"/service/clouddisk/"+ptype+"/"+type+"/"+dirid+"/rename?userId="+userId+"&newName="+newvalue;
          vali.showwait();
          $.ajax({
                    url: url,                          
                    type: 'put',
                    dataType:'json',
                    contentType:'application/json',
                    data:null,
                     headers:{
                    'Authorization':authToken
                   },
                    success: function (json,e) {
                      if (!json['success']){
                        $('#project_content .file_list .file_b i').attr('contenteditable',"false").css('border','none').css('background','transparent');
                        vali.closewait();
                        vali.showMsg(json['error'].errorMessage,1,2000);

                      }else{
                        console.log(json) ;
                        vali.showMsg('名称修改成功',0,2000); 
                         var did =  $('#curfolder').attr('data-id');
                         initdata(did,ptype);
                         vali.closewait();
                        return true;                             
                      }
                   },

                   error:function(json,e){
                    $('#project_content .file_list .file_b i').attr('contenteditable',"false").css('border','none').css('background','transparent');
                       console.log(e) ;

                    }
                 });
        }
        function newfile(filename) {
             var ptype  = $('.project_left_nav li.active').attr('ptype');
             var url = config.server+"/service/clouddisk/"+ptype+"/directory?userId="+userId;
             var dirid = $('#curfolder').attr('data-id');
             if (dirid == ''){
                dirid =  null;
             }
             var data = { 
                  parentDirId:dirid,
                  dirName : filename 
                 };
             //alert(JSON.stringify(data));
             vali.showwait();
             $.ajax({
                          url: url,                          
                          type: 'post',
                          dataType:'json',
                          contentType:'application/json',
                          data:JSON.stringify(data),
                           headers:{
                            'Authorization':authToken
                           },
                          success: function (json,e) {
                           if (!json['success']){
                            $('#project_content .file_list .file_b i').attr('contenteditable',"false").css('border','none').css('background','transparent');
                              vali.closewait();
                              vali.showMsg(json['error'].errorMessage,1,2000);
                            }else{
                              console.log(json) ;
                              vali.showMsg('文件夹创建成功',0,2000); 
                               initdata(dirid,ptype);
                               vali.closewait();
                              return true;                             
                            }
                         },

                         error:function(json,e){
                          $('#project_content .file_list .file_b i').attr('contenteditable',"false").css('border','none').css('background','transparent');
                             console.log(e) ;

                          }
                       });
             
        }

       $(document).off('click','#project_content .file_list li').on('click','#project_content .file_list li',function(e){
	
			   if (!$(this).hasClass('sel')){
            if(!ctrl){
              $('#project_content .file_list li').removeClass('sel');
            }
            $(this).addClass('sel');
         }else{
            $(this).removeClass('sel')
         };
            togglefunction();
            
		   })
       function updatedir(dir,isadd) {
         // body...
        if (isadd){
            var dir = JSON.parse(dir);
            var dirtmpl = '<li><span style="float:left;margin-left: 5px;font-size: 16px;color: #636363;cursor:pointer" id="" data-id='+dir.dirid+'>'                     
                          +'<i>'+dir.dirname+'</i></span></li>';
            $('.project_detail_head ul.dir').append(dirtmpl);
          }else{
               var ind; 
                var dir = JSON.parse(dir);
              if (!dir.dirid){
                  ind = 0;
              }

              $('.project_detail_head ul.dir li').each(function(index,item) {              
                if(parseInt($(item).find('span').attr('data-id')) == dir.dirid){
                  ind = index;                  
                }                
              });
               var len = $('.project_detail_head ul.dir li').length;
               if (len <= 0){return;}debugger;
                var arr = $('.project_detail_head ul.dir li');
               if (ind==0){
                arr.splice(1,len);
               }else{
                arr.splice(ind+1,len-1); 
               }
               $('.project_detail_head ul.dir').html(arr);
          }
       }

       $(document).off('dblclick','#project_content .file_list li').on('dblclick','#project_content .file_list li',function(e){
            if ($(this).find('.file_b i').attr('contenteditable') == true){
              return;
            }
            var  parentid,parentname;
            var dirid =  $(this).attr('id');
            if (!$(this).find('div').first().hasClass('folder')){
              return;
            }           
            var foldername = $(this).find('.file_b i').text();
            parentname = $('#curfolder').find('i').text();
            //$('#curfolder').find('i').text(foldername);            
            if (dirs.length==0){                
                parentid='' ; 
                parentname='';              
            }else{
                parentid = $('#curfolder').attr('data-id');
                
            }

            var dd = {
               dirid:dirid,
               parentid:parentid,
               parentname:parentname,
               dirname:foldername
            }
            
            $('#curfolder').attr('data-id',dirid);
            
            dirs.push(JSON.stringify(dd));
            updatedir(JSON.stringify(dd),true);
            var ptype  = $('.project_left_nav li.active').attr('ptype');
            

            console.log('folder open '+ptype+'--'+dirid);
            // alert('folder open '+ptype+'--'+dirid);
             initdata(dirid,ptype);         
          })

         $(document).off('click','.project_detail_head ul.dir li').on('click','.project_detail_head ul.dir li',function() {
           // body...
           var ddid = $(this).find('span').data('id');
           var fname = $(this).find('span i').text();
            var ptype  = $('.project_left_nav li.active').attr('ptype');
            var dd = {
               dirid:ddid,
               parentid:'',
               parentname:'',
               dirname:fname
            }
            updatedir(JSON.stringify(dd),false);
            initdata(ddid,ptype);

         })
         $('#curfolder').on('click',function(){
             var dirid =  $('#curfolder').attr('data-id');
             if (dirs.length==0) return;
             var dirtemp = dirs.pop();           
             dirtemp = JSON.parse(dirtemp);
             dirid = dirtemp.dirid;
             var name =  dirtemp.dirname;
             var parentid = dirtemp.parentid;
             var parentname = dirtemp.parentname;
             // name = dnames.pop();
             //alert('dirid:'+dirid+'---dirname:' + name);
             if (dirs.length>0){
              $('#curfolder').attr('data-id',parentid); 
              $('#curfolder').find('i').text(parentname); 
             }else{
               $('#curfolder').attr('data-id',''); 
               $('#curfolder').find('i').text($('.project_left_nav li.active a').text()); 
             }
             
             var ptype  = $('.project_left_nav li.active').attr('ptype');            
             initdata(parentid,ptype);  
         })
       	 
         $('.project_detail_head span.file_icon.del').on('click',function(){
       		var filelistNode = $('#project_content .file_list li.sel');
       		var i =0 ;
       		if (filelistNode.length<=0) {
                vali.showMsg('请先点击选中要删除的文件',1,1500);
       			return;
       		}
          var data = [];
       		filelistNode.each(function(){  
                var id = $(this).attr('id');            
               if ($(this).find('.file_t').hasClass('folder')){
                  var tmp = {
                     id:id,
                     isDir:true
                  };
                 data.push(tmp); 
               }else{
                var tmp = {
                     id:id,
                     isDir:false
                  };
                   data.push(tmp); 
               }
          });
          var pdata = {
            items:data
          }
          // alert(JSON.stringify(pdata))
          // alert(JSON.stringify(data));
          console.log(JSON.stringify(pdata));
          // return;
          var ptype  = $('.project_left_nav li.active').attr('ptype');
          var dirid = $(this).parent().parent().attr('id');
           dirid = $('#curfolder').attr('data-id');
          var url = config.server+"/service/clouddisk/"+ptype+"?userId="+userId;
          vali.showwait();
          $.ajax({
                          url: url,                          
                          type: 'DELETE',
                          dataType:'json',
                          contentType:'application/json',
                          data:JSON.stringify(pdata),
                           headers:{
                            'Authorization':authToken
                           },
                          success: function (json,e) {
                            if (!json['success']){
                               vali.closewait();
                              vali.showMsg(json['error'].errorMessage,1,2000);
                            }else{
                              console.log(json) ;
                              vali.showMsg('文件夹删除成功',0,2000); 
                               initdata(dirid,ptype);
                                vali.closewait();
                              return true;                             
                            }
                         },

                         error:function(json,e){
                             console.log(e) ;

                          }
                       });
         
       	})

       	$('.project_detail_head span.file_icon.down').on('click',function(){
       		var filelistNode = $('#project_content .file_list li.sel');
       		var i =0 ;
       		if (filelistNode.length<=0) {
                vali.showMsg('请先点击选中文件',1,1500);
       			return;
       		}
       		// for (i=0;i<filelistNode.length;i++){

       		// };
          downfiles();

       	})

       	$('.project_detail_head span.file_icon.lock').on('click',function(){
       		var filelistNode = $('#project_content .file_list li.sel');
       		var i =0 ;
       		if (filelistNode.length<=0) {
                vali.showMsg('请先点击选中文件',1,1500);
       			return;
       		}
       		for (i=0;i<filelistNode.length;i++){

       		};

       	})
        
    function togglefunction(){
      var filelistNode = $('#project_content .file_list li.sel');
      if (filelistNode.length<=0){
         $('.project_detail_head span.file_icon.lock').css('display','none');
         $('.project_detail_head span.file_icon.del').css('display','none');
         $('.project_detail_head span.file_icon.down').css('display','none');
      }else{
         $('.project_detail_head span.file_icon.lock').css('display','inline-block');
         $('.project_detail_head span.file_icon.del').css('display','inline-block');
        if( $('#project_content .file_list li.sel div.file_t:not(.folder)').length>0){
        	$('.project_detail_head span.file_icon.down').css('display','inline-block');
        }else{
        	$('.project_detail_head span.file_icon.down').css('display','none');
        }

      }

    }


    $('.project_left_nav li').on('click',function(){
           $('.project_left_nav li').removeClass('active');
          $(this).addClass('active');
          var ptype = $(this).attr('ptype');
          // dirnames = [];
          // console.log($(this).find('a').text());
          // dirnames.push($(this).find('a').text());
          $('#curfolder').find('i').text($(this).find('a').text());
           dirs.length = 0;
           $('#curfolder').attr('data-id','');
           // dnames.push($('.project_left_nav li.active a').text());
           if (ptype=='share'){
            $('#project_content .file_list').empty();
            return;
          }
          var dname =  $('.project_left_nav li.active').find('a').text();
          var dirtmpl = '<li><span style="float:left;margin-left: 5px;font-size: 16px;color: #636363;cursor:pointer" id="" data-id="">'                     
                +'<i>'+dname+'</i></span></li>';

          $('.project_detail_head ul.dir').empty().append(dirtmpl);

          initdata(null,ptype);

      })
     

   
    function isinlist(id){
      var filelistNode = $('#project_content .file_list li.sel');
      if (filelistNode.length<=0) return false;
      var inlist = false;
       filelistNode.each(function(){
             if ($(this).attr('id')==id){
                inlist = true;        
             }
        });       
       return inlist;       
    }


function movefile(did,tid){
      // body...
      var filelistNode = $('#project_content .file_list li.sel');
        if (filelistNode.length<=0){
            vali.showMsg('请先点击选中要移动的文件',1,1500);
           return;
        } 
        var isin = isinlist(did);
        if(!isin){
           vali.showMsg('请拖拽选中的文件',1,1500);
           return;
        } 
        var data = [];
        filelistNode.each(function(){              
            if($(this).find('.file_t').hasClass('folder')){
                  var tmp = {
                     id:$(this).attr('id'),
                     isDir:true
                  };
                 data.push(tmp); 
               }else{
                var tmp = {
                     id:$(this).attr('id'),
                     isDir:false
                  };
                   data.push(tmp); 
               }
          });
          var pdata = {
            toTargetDirId:tid, 
            items:data
          }
          // alert(JSON.stringify(pdata))
          // alert(JSON.stringify(data));
          //return;
           var ptype  = $('.project_left_nav li.active').attr('ptype');
           var url = config.server+"/service/clouddisk/"+ptype+"/move?userId="+userId;
            vali.showwait();
           $.ajax({
                          url: url,                          
                          type: 'PUT',
                          dataType:'json',
                          contentType:'application/json',
                          data:JSON.stringify(pdata),
                           headers:{
                            'Authorization':authToken
                           },
                          success: function (json,e) {
                            if (!json['success']){
                               vali.closewait();
                              vali.showMsg(json['error'].errorMessage,1,2000);
                            }else{
                              console.log(json) ;
                              vali.showMsg('文件操作成功',0,2000); 
                               filelistNode.each(function(){
                                   $(this).remove();
                               })   
                               var dirid = $('#curfolder').attr('data-id');
                               initdata(dirid,ptype);
                                vali.closewait();
                               return true;                             
                            }
                         },

                         error:function(json,e){
                             console.log(e) ;

                          }
                       });
         }
     // $("#project_content .file_list").dragsort({
    //       dragSelector: "li",
    //       dragEnd: function() { },
    //       dragBetween: true,
    //       placeHolderTemplate: "<li></li>"
    //   });

       document.addEventListener("dragstart", function(event) {
       // The dataTransfer.setData() method sets the data type and the value of the dragged data
        if(!isinlist(event.target.id)) return;
        event.dataTransfer.setData("Text", event.target.id);
    
          // Output some text when starting to drag the p element
          //document.getElementById("demo").innerHTML = "开始拖动 p 元素.";
          
          // Change the opacity of the draggable element
          event.target.style.opacity = "0.4";
          console.log("dragstart");
      });

      // While dragging the p element, change the color of the output text
      document.addEventListener("drag", function(event) {
          //document.getElementById("demo").style.color = "red";
           console.log("drag");
      });

      // Output some text when finished dragging the p element and reset the opacity
      document.addEventListener("dragend", function(event) {
         // document.getElementById("demo").innerHTML = "完成 p 元素的拖动";
          event.target.style.opacity = "1";
          console.log("dragend");
      });


      /* Events fired on the drop target */

      // When the draggable p element enters the droptarget, change the DIVS's border style
      document.addEventListener("dragenter", function(event) {
          if ( event.target.className == "droptarget" ) {
              event.target.style.border = "3px dotted red";
          }
            console.log("dragenter");
      });

      // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
      document.addEventListener("dragover", function(event) {
          event.preventDefault();
            console.log("dragover");
      });

      // When the draggable p element leaves the droptarget, reset the DIVS's border style
      document.addEventListener("dragleave", function(event) {
          if ( event.target.className == "droptarget" ) {
              event.target.style.border = "";
          }
           console.log("dragleave");
      });

      /* On drop - Prevent the browser default handling of the data (default is open as link on drop)
         Reset the color of the output text and DIV's border color
         Get the dragged data with the dataTransfer.getData() method
         The dragged data is the id of the dragged element ("drag1")
         Append the dragged element into the drop element
      */
      document.addEventListener("drop", function(event) {
          event.preventDefault();
          // if ( event.target.className == "droptarget" ) {
             // document.getElementById("demo").style.color = "";
              event.target.style.border = "";
              var data = event.dataTransfer.getData("Text");
              //event.target.appendChild(document.getElementById(data));
          // }
           console.log(data+"--drop--"+event.target.parentNode.id);
           movefile(data,event.target.parentNode.id);
      });
      
      // $("#project_content .file_list li").draggable({
      //       stop: function( event, ui ) {
      //         console.log(event);
      //       }
      //     });
      $('#file_local').on('click',function(){
        $(this).val();
      })
      $('#file_local').on('change',function(){
        var userinfo = JSON.parse(vali.getCookie('userinfo'));
        var appId = userinfo['data']['appId'];
        var etpId = userinfo['data']['etpId'];
        var userToken = userinfo['data']['userToken'];
        var token = userToken['token'];
        var url = 'http://im01.yyuap.com/sysadmin/rest/resource/'+etpId+'/'+appId+'/upload?token='+token;
        var name = getFileName($('#file_local').val());
        var username =  userinfo['data']['username'];
        var creator= username+'.'+appId+'.'+etpId
        var receiver = creator;

         url = url +'&name='+name+'&mediaType=2&breakpoint=0&creator='+creator+'&receiver='+receiver;
         var fileList = this.files;
         var data = new FormData();
         data.append('file',fileList[0]);
         
         vali.showwait();
          // $.ajaxFileUpload({
          // url:url,//处理图片脚本
          // secureuri :false,
          // fileElementId :'file_local',//file控件id
          // dataType : 'json',
          $.ajax({
          url:url,
          type: 'POST',  
          data:data,
          dataType:'json',
          cache:false,
          processData:false,
          contentType:false,
          success : function (data, status){
              if (status == 'success'){
                     
                      var identifier = data['attachId'];
                      console.log('identifier:'+identifier);
                      var ptype  = $('.project_left_nav li.active').attr('ptype');
                      var surl = config.server+"/service/clouddisk/"+ptype+"/file?userId="+userId;
                      var TargetDirId = $('#curfolder').attr('data-id');
                      if (TargetDirId==''){
                        TargetDirId = null;
                      }
                      var pdata = { 
                            "identifier":identifier, //文件标识 
                            "toTargetDirId":TargetDirId //上传到的目录的id， 如果是根目录，那么可以设置为null, 或者"" 
                          } 
                     
                      $.ajax({
                                url: surl,                          
                                type: 'POST',
                                dataType:'JSON',
                                contentType:'application/json',
                                data:JSON.stringify(pdata),
                                 headers:{
                                  'Authorization':authToken
                                 },
                                success: function (json,e) {
                                  if (!json['success']){
                                     vali.closewait();
                                    vali.showMsg(json['error'].errorMessage,1,2000);
                                  }else{
                                     console.log(json) ;
                                     vali.showMsg('文件上传成功',0,2000);                                 
                                     initdata(TargetDirId,ptype);
                                     vali.closewait();
                                     return true;                             
                                  }
                               },

                               error:function(json,e){
                                   console.log(e) ;

                                }
                             });////end ajax

              }else{
                 
              }
          },
          error: function(data, status, e){
              alert(e);
          }
        })//end ajaxupload
       
      
       
      })

      function downfiles(){
        // body...
         var filelistNode = $('#project_content .file_list li.sel');
          if (filelistNode.length<=0){
            vali.showMsg('请先点击选中要下载的文件',1,1500);
           return;
           } 

            if (filelistNode.length>1){
              vali.showMsg('目前只支持单个文件下载',1,1500);
             return;
           } 
           
            var userinfo = JSON.parse(vali.getCookie('userinfo'));
            var appId = userinfo['data']['appId'];
            var etpId = userinfo['data']['etpId'];
            var userToken = userinfo['data']['userToken'];
            var token = userToken['token'];
            var url = 'http://im01.yyuap.com/sysadmin/rest/resource/'+etpId+'/'+appId+'/download?token='+token;
            var username =  userinfo['data']['username'];
            var downloader= username+'.'+appId+'.'+etpId
            url = url+'&downloader='+downloader; 
            var attachId='';               
            filelistNode.each(function(){
                  if ($(this).attr('data-url') == undefined ){
                    attachId = '2tjtkyrafgs432jfa7iqfqje';  
                  }else{
                    attachId = $(this).attr('data-url');
                  }
                  
                  url = url+'&attachId='+attachId
                  window.open(url);              
             })
      }
       function getFileName(o){
          var pos=o.lastIndexOf("\\");
          return o.substring(pos+1);  
      }

      var mdFlag = false;
      $('#project_content').on('mousedown',function(event) {
        // body...
        if (event.ctrlKey==1) 
        { 
           ctrl = true;
             mdFlag = true;
        } 
        else 
        { 
           ctrl = false;
        } 
        // sx = event.pageX;
        // sy = event.pageX        
        //  $('#cover').css({'left':sx+'px','top':(sy-dis)+'px'});
        //  $('#cover').css({'right':($(window).width()-sx)+'px','bottom':($(window).height()-(sy-dis))+'px'});


      })
      //   var sx ;
      //   var sy ;
      // var dis= window.screen.availHeight - $(window).height();
     

      // $('#project_content').on('mousemove',function(event) {           
      //     if(mdFlag){
      //         var dx = event.pageX;
      //          var dy = event.pageX;

      //          console.log("?????????????????")
      //          $('#cover').css({'left':sx+'px','top':(sy-dis)+'px'});
      //          $('#cover').css({'right':($(window).width()-dx)+'px','bottom':($(window).height()-(dy-dis))+'px'});
      //     }
           


      // })
      // $('#cover').on('mousemove',function(event) {
      //   if(mdFlag){
      //          var dx = event.pageX;
      //          var dy = event.pageX;               
      //          $('#cover').css({'left':sx+'px','top':(sy-dis)+'px'});
      //          $('#cover').css({'right':($(window).width()-dx)+'px','bottom':($(window).height()-(dy-dis))+'px'});
      //     }
      // })

      //  $('#project_content').on('mouseup',function(event) {
      //     mdFlag = false;
      // })

  }
};
