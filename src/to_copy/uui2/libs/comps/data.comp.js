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

		ko.bindingHandlers.Datetimepicker = {
			init: function(element, valueAccessor) {
				var ele = $(element)
				var fmt = ele.attr("datetimepicker");
				ele.datetimepicker(fmt)
			}
		};


	}
)