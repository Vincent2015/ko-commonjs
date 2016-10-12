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

		ko.bindingHandlers.Combobox = {
			init: function(element, valueAccessor, allBindings) {
				var ele = $(element)
				
				try{
					var fmt = eval("("+ele.attr("combobox")+")");
					
					fmt.onSelect = function(item){
					
						var value = valueAccessor()
						value(item.name)
					}
					ele.Combobox(fmt)
					
				}catch(e){
					debugger;
				}
				
			}
		};
	}
)

