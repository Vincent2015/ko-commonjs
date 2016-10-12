!function(){
	require(["text!/iformtmpl/bill-div.html"],
//	require(["text!/iform/rt_ctr/open?pk_bo=10df67cf-2e3f-4685-9e22-dba189371a17&mode=div"],
		    function(html) {
//		
//				ko.components.unregister('message-editor');
//				ko.components.register('message-editor', {
//					viewModel: function(){}
//				,
//				template:html//{require: 'text!iformtmpl/bill-div.html'}//require('text!./pages/freeform/bill-div.html')
//				});
		$('#iform_container').html(html);
//				require(['/iform/rt_ctr/open?pk_bo=10df67cf-2e3f-4685-9e22-dba189371a17/bill-div.js']);
				require(['/iformtmpl/bill-div.js']);
//				ko.cleanNode($('body')[0]);
//				ko.applyBindings($('body')[0]);
//				console.log(html);
		    }
		);
}();
