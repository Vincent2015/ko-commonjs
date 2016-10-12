/**
 * 前后台交互工具
 */

+ function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery"
		], factory );
	} else {
		// Browser globals
		factory( jQuery, this);
	}
}(function( $ , exports) {
	'use strict';
	
	var VMManager = function(){
		this.datasets = {}
	}
	
	VMManager.fn = VMManager.prototype
	VMManager.fn.editEventAjaxPool = [];
	
	VMManager.fn.callback =  function(self, deferred){
					return function(){
						var parm = {};
						var lastInfo = null;
						var edititeminfos = [];
						for(var i=0,len = self.editEventAjaxPool.length;i<len;i++){
							lastInfo = self.editEventAjaxPool[i];
							edititeminfos.push(lastInfo.edititeminfo);
						}
						self.editEventAjaxPool.length = 0;
						lastInfo.edititeminfo = edititeminfos[0];
						lastInfo.edititeminfos = edititeminfos;
						parm.editEventJson = ko.toJSON(lastInfo);
						parm.nodepath = window.nodepath;
						parm.cntparm = ko.toJSON(window.context.parameters);
						parm.environment=ko.toJSON(window.context.environment);
						
						self.ajax({
							 url: "/iwebap/editEvent/proess",
							 type: "POST",
							 data: parm,
							 dataType: "json",
							 async:false,
							 deferred:deferred,
							 success: function(result) {
							  	return result;
							 }
						});
						
						
					}
					
				} 
	
		VMManager.fn.addDataSet = function(id,dataset){
		this.datasets[id] = dataset
		
		
		var self = this
		dataset.on('edit', function(data){
			if (data.edititeminfo.classname == data.head.classname)
				data.edititeminfo.selectrow = -1
			
			if(window["$exeBatchEditEvent"]){
				self.editEventAjaxPool.push(data);
				if(window.$exeBatchEditEventTask){
					clearTimeout(window.$exeBatchEditEventTask);
				}
				window.$exeBatchEditEventTask  = setTimeout(self.callback(self,window["$exeBatchEditEvent"]), 50);
				
			}else{
				var parm ={};
				parm.editEventJson = ko.toJSON(data) ;
				parm.nodepath = window.nodepath;
				parm.cntparm = ko.toJSON(window.context.parameters);
				parm.environment=ko.toJSON(window.context.environment);
				self.ajax({
					 url: "/iwebap/editEvent/proess",
					 type: "POST",
					 data: parm,
					 dataType: "json",
					 async:false,
					 success: function(result) {
					  	return result;
					 }
				});
			}
			
			
		   
		})
	}
	
	VMManager.fn.removeDataSet = function(id){
		delete this.datasets[id]
	}	
	
	VMManager.fn.getDataSet = function(id){
		return this.datasets[id]
	}	
	
	VMManager.fn.ajax = function(params){
		params = this._wrapAjax(params) 
		$.ajax(params)
	}
	
	VMManager.fn.post = function(params){
		params = this._wrapAjax(params) 
		$.post(params)
	}
	
	VMManager.fn.get = function(params){
		params = this._wrapAjax(params) 
		$.get(params)
	}
	
	VMManager.fn.updateDom = function(dom){
		$.each( dom, function(i, n){
		 	var vo = n.two
			var $key = $(n.one)
			_updateDom($key, vo)
		});
	}	
	
	VMManager.fn.updateDs = function(data, deferred){
		if(!$.isEmptyObject(data.headenabled)){
			var das = data.headenabled;
			var fattr = "editable";
			this.updateHeadAttr(das,fattr);
		}		
		if(!$.isEmptyObject(data.bodysenabled)){
			var das = data.bodysenabled;
			var fattr = "editable";
			this.updateBodyAttr(das,fattr);
		}
		
		if(!$.isEmptyObject(data.headnotnull)){
			var das = data.headnotnull;
			var fattr = "necessary";
			this.updateHeadAttr(das,fattr);
		}		
		if(!$.isEmptyObject(data.bodysnotnull)){
			var das = data.bodysnotnull;
			var fattr = "necessary";
			this.updateBodyAttr(das,fattr);
		}
		if(!$.isEmptyObject(data.headdigit)){
			var das = data.headdigit;
			var fattr = "precision";
			this.updateHeadAttr(das,fattr);
		}		
		if(!$.isEmptyObject(data.bodysdigit)){
			var das = data.bodysdigit;
			var fattr = "precision";
			this.updateBodyAttr(das,fattr);
		}
		
		if(!$.isEmptyObject(data.headfilter)){
			var das = data.headfilter;
			var fattr = "reffilter";
			this.updateHeadAttr(das,fattr);
			if(data.eventtype && data.eventtype =='onChange')
				this.clearHeadItem(das,fattr);
		}		
		if(!$.isEmptyObject(data.bodysfilter)){
			var das = data.bodysfilter;
			var fattr = "reffilter";
			this.updateBodyAttr(das,fattr);
			if(data.eventtype && data.eventtype =='onChange')
				this.clearBodyItem(das,fattr);
		}
		if (!$.isEmptyObject(data.head)){
//			var classname = data.head.classname
			var ds = null
			for (var key in this.datasets){
				ds = this.datasets[key].head
				break
//				if (this.datasets[key].head.classname == classname){
//					ds = this.datasets[key].head					
//					break
//				}
			}
			this.updateHeadDsRecord(ds, data.head, deferred)
		}
		if(!$.isEmptyObject(data.body)){
			for (var i in data.body){
				var body = data.body[i]
				var classname = body.classname
				var ds = null
				for (var key in this.datasets){
					if (this.datasets[key].body.classname == classname){
						ds = this.datasets[key].body					
						break
					}
				}
				this.updateBodyDsRecord(ds, body , deferred)
				
				//清空行记录标志
				var clearCmtRec = body.clearCmtRecords;
				if(ds && clearCmtRec){
					ds.clearCmtRecords();
				}
			}
				
		}
		if(!$.isEmptyObject(data.defval)){
			data.defval = JSON.parse(data.defval);
			if(!data.defval)return
			var classname = data.defval.classname;
			var ds = null
			for (var key in this.datasets){
				if (this.datasets[key].body.classname == classname){
					ds = this.datasets[key].body					
					break
				}
			}
			for(var item in data.defval.def){
				if(ds.getField(item)){
					ds.getField(item).defaultPk = data.defval.def[item].pk;
					ds.getField(item).defaultName = data.defval.def[item].name;
				}
			}
		}
		
		window.editCtx =false;
	}	
	VMManager.fn.clearHeadItem = function(das, fattr){
		var ds = null;
			for (var key in this.datasets){
				ds = this.datasets[key].head					
				break
		}
		if(ds){
			for (var i in das){
				if (typeof ds.aggDs.bindHeadName(i) == 'function')
					ds.aggDs.bindHeadName(i)('')
				if(typeof ds.aggDs.bindHeadPk(i) == 'function')
					ds.aggDs.bindHeadPk(i)('')
			}
		}
		
	}
	VMManager.fn.updateHeadAttr = function(das, fattr){
		var ds = null;
			for (var key in this.datasets){
				ds = this.datasets[key].head					
				break
		}
		if(ds){
			for (var i in das){
				var val = das[i];
				if($.isPlainObject(val)){
					var oldVal = ds.bindFieldAttr(i, fattr)();
					var oldObj;
					if (oldVal) {
						oldObj = JSON.parse(oldVal);
						for (var k in val) {
							oldObj[k] = val[k];
						}
					} else
						oldObj = val;
					val = ko.toJSON(oldObj)
				}
				ds.bindFieldAttr(i,fattr)(val)
			}
		}
	}
	VMManager.fn.clearBodyItem = function(das, fattr){
			for (var i in das){
			var body = das[i]
			var classname = i
			var ds = null
			for (var key in this.datasets){
				if (this.datasets[key].body.classname == classname){
					ds = this.datasets[key].body					
					break
				}
			}
			if(ds){
				for(var x in body){
					if (typeof ds.aggDs.bindBodyCurrPk(x) == 'function')
						ds.aggDs.bindBodyCurrPk(x)('')
					if(typeof ds.aggDs.bindBodyCurrName(x) == 'function')
						ds.aggDs.bindBodyCurrName(x)('')
				}
			}

		}
	}
	VMManager.fn.updateBodyAttr = function(das, fattr){
		for (var i in das){
			var body = das[i]
			var classname = i
			var ds = null
			for (var key in this.datasets){
				if (this.datasets[key].body.classname == classname){
					ds = this.datasets[key].body					
					break
				}
			}
			if(ds){
				for(var x in body){
					var val = body[x];
					
					if($.isPlainObject(val)){
						var oldVal = ds.bindFieldAttr(x, fattr)();
						var oldObj;
						if (oldVal) {
							oldObj = JSON.parse(oldVal);
							for (var k in val) {
								oldObj[k] = val[k];
							}
						} else
							oldObj = val;
						val = ko.toJSON(oldObj)

					}
					ds.bindFieldAttr(x,fattr)(val)
				}
			}

		}
	}

	VMManager.fn.updateHeadDsRecord = function(dataset, dsdata , deferred){
//		var rindex = dsdata.row
//		var values = dsdata.head
		//var r = records[rindex]
		if(dataset){
			dataset.slice = true
			for (var key in dsdata){
				if(key == "$Error" && dsdata[key].name){
					$.showMessageDialog({type:"warning",title:"警告",msg:dsdata[key].name,backdrop:true});
					deferred.reject();
				}else{
					var pk = dsdata[key].pk
					var name = dsdata[key].name
					dataset.setName(0, key, name)
					dataset.setPk(0, key, pk)
				}
			}
			dataset.slice = false
		}
	}	


	VMManager.fn.updateBodyDsRecord = function(dataset, dsdata , deferred){
		if(dataset){
			var rindex = dsdata.row
			var values = dsdata.value
			//var r = records[rindex]
			dataset.slice = true
			for (var key in values){
				if(key == "$Error" && values[key].name){
					$.showMessageDialog({type:"warning",title:"警告",msg:values[key].name,backdrop:true});
					deferred.reject();
				}else{
					var pk = values[key].pk
					var name = values[key].name
					if(rindex==-99){
						dataset.setName(rindex, key, name)
						dataset.setPk(rindex, key, pk)
					}else{
						dataset.setCurName(key, name)
						dataset.setCurPk(key, pk)	
					}
				}
			}
			dataset.slice = false
		}
	}	
	
	VMManager.fn._successFunc = function(data, deferred){
		var dsdata = data.data
		var dom =null
		if(dsdata){
			dom = dsdata.dom?dsdata.dom:null
		}
		if (dom)
			this.updateDom(JSON.parse(dom))
		if (dsdata)
			this.updateDs(dsdata, deferred)
			
		deferred.resolve();
	}
		
	//TODO
	VMManager.fn._errorFunc = function(data, callback){
		
	}	
	
	VMManager.fn._wrapAjax = function(params){
		var self = this
		var orignSuccess =  params.success
		var deferred =  params.deferred;
		if(!deferred || !deferred.resolve){
			deferred = {resolve:function(){},reject:function(){}}
		} 
		params.success = function(data,state,xhr){
			if(window.processXHRError(data,state,xhr)){
				orignSuccess.call(null, data)
				self._successFunc(data, deferred)
			}else{
				deferred.reject();
			}
		}
		params.error=function(data,state,xhr){
			if(window.processXHRError(data,state,xhr)){
				orignSuccess.call(null, data)
				self._successFunc(data, deferred)
			}else{
				deferred.reject();
			}
		}
		if(params.data)
			params.data.environment=JSON.stringify(window.context.environment);
		else
			params.data = {environment:JSON.stringify(window.context.environment)}
		return params
	}	
	VMManager.fn.modifyFieldDefault = function(data, ds,id){
		if(data["pk"]){
			var f = ds.getField(id);
			if(f) f.defaultPk = data["pk"];
		}
		if(data["name"]){
			var f = ds.getField(id);
			if(f) f.defaultName = data["name"];
		}		
	}
	VMManager.fn.btnAuth = function(btnGroups){
		var orgibtn = btnGroups;
		var parm ={};
		if(btnGroups.length == 0)
			return;
		parm.environment=ko.toJSON(window.context.environment);
		parm.btgroups = ko.toJSON(btnGroups);
	    this.ajax({
			 url: "/iwebap/btnAuth/auth",
			 type: "POST",
			 data: parm,
			 dataType: "json",
			 async: false,
			 success: function(result) {
			 	 if(result){
					 if(btnGroups.length == 0)
						return;
	 	 			$.grep(btnGroups[0], function(nb,i){
	 	 				if(nb){
	 	 					var exist = false;
							$.each(result, function(i, n){
								if(n.id == nb.id){
									exist=true;
								}
							});
							if(!exist)
								btnGroups[0].splice(i,1);
	 	 				}
					});
			 	 }
			 }
		});
	}
//	var vmutil = {
//		/**
//		 *封装 juqery ajax请求
//		 */
//		ajax: function(params){
//			params = _wrapAjax(params) 
//			$.ajax(params)
//		},
//		
//		/**
//		 *封装 juqery post请求
//		 */
//		post: function(params){
//			params = _wrapAjax(params)
//			$.post(params)
//		},
//		
//		/**
//		 *封装 juqery get请求
//		 */
//		get: function(params){
//			params = _wrapAjax(params)
//			$.get(params)
//		},
//		
//		/**
//		 *更新DOM
//		 */
//		updateDom: function(dom){
//			for (var key in dom){
//				var vo = dom[key]
//				var $key = $(key)
//				_updateDom($key, vo)
//			}
//		},		
//		
//		/**
//		 *更新dataset数据 
//		 */
//		updateDs: function(data){
//			if (!$.isEmptyObject(data.head)){
//				_updateDsRecord(ds.head.records(), data.head)
//			}
//			else if(!$.isEmptyObject(data.body)){
//				_updateDsRecord(ds.body.records(), data.body)
//			}
//		}
//		
//	}
	

	

	
	function _updateDom($key, vos){
		for (var i in vos){
			var vo = vos[i]
			for (var key in vo){
				var props = vo[key]
				if (key == 'trigger'){
					$key.trigger(props[0])	
				}
				else{
					if ($.isArray(props)){
						$.each(props, function(i, n){
						  	$key[i](n)		
						});
					}
					else
						try{
							$key[i](vo)
						}catch(error){
							$key[i](vo[i])
						}
				}
			}
		}
	}
	
	window["processXHRError"] = 	function (rsl,state,xhr) {
		if(xhr.getResponseHeader && xhr.getResponseHeader("X-Error")){
			$.showMessageDialog({type:"info",title:"提示",msg: rsl["message"],backdrop:true});
			if(rsl["operate"]){
				eval(rsl["operate"]);
			}
			return false;
		}

		return true;
	};

	if (exports)
		exports.VMManager = VMManager
	else	
		return {
			VMManager:VMManager	
		}





})	

