module.exports = {
    init: function(id,name){
    	
		if(!id){
			id = document.body.getAttribute('pid');
			name = document.body.getAttribute('pname') || id;
		}
		
		if(!!id){
			var groupId =  document.body.getAttribute('groupId_'+id);
		}
		
		if(!!groupId){
			goToProjectDynamic(groupId,name);
		}else{
			if(!!id){
				jQuery.ajax({
					url: YYIMCacheConfig.SERVICE_ADDRESS + "service/project/" + id + "/group",
					type: "get",
					dataType: "json",
					headers:{
						'Authorization': YYIMUtil['cookie']['get']('authToken')
					},
					cache:false,
					success:function(data){
						if(data.success){
							document.body.setAttribute('groupId_'+id,data.data.groupId);
							goToProjectDynamic(data.data.groupId,name)
						}
					},
					error:function(){
						goToProjectDynamic('_project_' + id ,name);				
						console.log('加载动态时 没有加载到 groupId');
					}
				});
			}
		}
		
		function goToProjectDynamic(id,name){
			window.scope.$state.transitionTo("imhome.message", {
				personId: id,
				personName: name,
				chatType: 'pubaccount',
				spectacle: 'DYNAMIC'
			}, {
				location: true,
				inherit: true,
				notify: true,
				reload: true
			});
			
			jQuery('#im-dynamic-content').html(window.imContent);
			
			$('.project_detail_content li a').removeClass('active');
	        $('.project_detail_content li a.info').addClass('active');
			var nameStr = $('body').attr('pname');
	        $('.project_detail_head h2').text(nameStr).attr('title',nameStr);
		}
		

		
    }
}
