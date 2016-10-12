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

		ko.bindingHandlers.precision = {
			init: function(element, valueAccessor, allBindings) {
			},
			update: function(element, valueAccessor, allBindings){
				var ele = $(element)
				var data = ele.attr("data-plugin");
				var dataPlugin = {};
				if(data){
					dataPlugin = eval("(" + data + ")");
				}
				var trueVal =   ko.unwrap(valueAccessor()); 
				if(trueVal != null){
					dataPlugin.formater = {type:'number',precision:trueVal};
			  	    ele.attr("data-plugin", ko.toJSON(dataPlugin))	
			  	  	ele[0].showValue = ''
			  	    ele[0].value = ele[0].value;
				}
			}
		};
	}
)

