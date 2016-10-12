+ function(factory) {
	if (typeof define === "function" && define.amd) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"knockout"
		], factory);
	} else {
		// Browser globals
		factory(jQuery, ko);
	}
}(function($, ko) {
		'use strict';

		ko.bindingHandlers.Reference = {
			init: function(element, valueAccessor) {
				var ele = $(element)
				var cfg=ele.data().refcfg;
				var pageUrl='/iwebap/js/ref/refDList.js';
				if(cfg&&cfg.pageUrl){
					pageUrl=cfg.pageUrl;
				}
				var $input=ele.find("input");
				var  inpuid=$input.attr('id');	
				var contentId='refContainer'+inpuid;
			    var refContainerID=contentId.replace(/[^\w\s]/gi, '\\$&');				
				$.refer({
					contentId:'refContainer'+inpuid,
					dom: ele,
					pageUrl: pageUrl,
					setVal:function(data,noFocus) {
						if (data) {
							var  options=$('#'+refContainerID).Refer('getOptions');
							var pk = $.map(data,function(val, index) {
									return val.refpk
								}).join(',');
							var name = $.map(data,function(val, index) {
									return val.refname
								}).join(',');
							var code=$.map(data,function(val, index) {
									return val.refcode
								}).join(',');
							var value = valueAccessor();
							var oldVal =  value();
							if(pk == ''){
								if(oldVal != null && oldVal != ''){
									value(pk); 
								}
							}else{
								value(pk); 
							}
							ele.find("input").val(options.isReturnCode?code:name).trigger('change');
							if(!noFocus){
							 ele.find("input").focus();
							}
						}
					},
					onOk: function(data) {
						this.setVal(data);
						this.onCancel();
					},
					onCancel: function() {
						$('#'+refContainerID).Refer('hide');
					}
				})			 
			},
			update: function(element, valueAccessor) {
				var ele = $(element)
				var $input=ele.find("input");
				var  inpuid=$input.attr('id');
				var modelValue = ko.utils.unwrapObservable(valueAccessor());
			    var inputVal=ele.find("input").val();
				var refName=ele.attr('refname');
				//解决直接通过KO设置PK
				//TODO:autochck=false不处理
				if(""!==inputVal&&modelValue===refName){
				 //"#refContainer1bodys_project.pk_projectclass" "Str1.str2%str3".replace(/[^\w\s]/gi, '\\$&')
                 var contentId='refContainer'+inpuid;
				 var refContainerID=contentId.replace(/[^\w\s]/gi, '\\$&');
				 //TODO:Refer.js加载延迟bug
				 var data=$('#'+refContainerID).Refer('getRefValByPK',modelValue.split(','));
				 if (data && $.isArray(data)&&data.length > 0 ) {
							var  options=$('#'+refContainerID).Refer('getOptions');
							var pk = $.map(data,function(val, index) {
									return val.refpk
								}).join(',');
							var name = $.map(data,function(val, index) {
									return val.refname
								}).join(',');
							var code=$.map(data,function(val, index) {
									return val.refcode
								}).join(',');
							var value = valueAccessor();
							value(pk); 
							ele.find("input").val(options.isReturnCode?code:name).trigger('change');
						}		
				}
			}
		};

	}
)