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

		ko.bindingHandlers.multilang = {
			'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {      
				var tmpsort = ko.utils.unwrapObservable(valueAccessor()).split(","), tmpname = allBindings.get("lang"),tmplang=[];							
				$.each(tmpsort, function(i,node) {
					if(i > 0 ){
						tmplang.push( viewModel[tmpname+i]._latestValue )  
					}else{
						tmplang.push( viewModel[tmpname]._latestValue )       			
					}
					tmplang.lang_name = tmpname;                                                 
				});
				$(element).multilang({"multinfo":tmpsort,"add_ko_vm":viewModel,"multidata":tmplang})   
			}
		};
	}
)
