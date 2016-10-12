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

		ko.bindingHandlers.StateManager = {
			init: function(element, valueAccessor, allBindings) {
				var ele = $(element)
//				var fmt = ele.attr("state");
				var params = allBindings().StateManager
				debugger;
				ele.stateManager(params)
			},
			update: function(element, valueAccessor, allBindings){
				
			}
		};
	}
)

