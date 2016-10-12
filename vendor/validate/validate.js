vali = {
	showMsg:function(msgCont,msgType,showTime){
		
		var  classArr = ['suc','remind','failure'],
			tempMsg ='<div class="msg-toast '+classArr[msgType]+'">'+msgCont+'</div>'
			msgDom = $(tempMsg).appendTo('body').fadeIn();
			setTimeout(function(){
				$('.msg-toast').fadeOut().remove();
			},showTime)
	},
	getCookie:function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
		else
		return null;
	},
	showwait:function() {
		// body...
		$('#loading_bg').fadeIn("fast");
		$('#loading').fadeIn("fast");
	},
	closewait:function() {
		// body...
		$('#loading_bg').fadeOut("fast");
		$('#loading').fadeOut("fast");
	}
}

//module.exports = vali;