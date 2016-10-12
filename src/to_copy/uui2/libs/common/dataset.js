/* ========================================================================
 * UUI: dataset.js v1.0.0
 *
 * ========================================================================
 * Copyright 2015 yonyou, Inc.
 * Licensed under MIT ()
 * ======================================================================== */



+ function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"knockout"
		], factory );
	} else {
		// Browser globals
		factory( jQuery, ko ,this);
	}
}(function( $ , ko, exports) {
	'use strict';

	var Events = function(){
	}
	
	Events.fn = Events.prototype
	/**
	 *绑定事件
	 */
	Events.fn.on = function(name, callback) {
		name = name.toLowerCase()
		this._events || (this._events = {})
		var events = this._events[name] || (this._events[name] = [])
		events.push({
			callback: callback
		})
		return this;
	}

	/**
	 * 触发事件
	 */
	Events.fn.trigger = function(name) {
		name = name.toLowerCase()
		if (!this._events || !this._events[name]) return this;
		var args =  Array.prototype.slice.call(arguments, 1);
		var events = this._events[name];
		for (var i = 0, count = events.length; i < count; i++) {
			events[i].callback.apply(this, args);
		}
		return this;
	}	
	
	Events.fn.getEvent = function(name){
		name = name.toLowerCase()
		this._events || (this._events = {})
		return this._events[name]
	}


	/**
	 * 字段
	 * 
	 */
	var Field = function(attributes) {
		var attrs = $.extend({}, Field.DEFAULTS, attributes)
		this.id = attrs['id']
		this.label = attrs['label']
		this.type = attrs['type']
		this.format = attrs['format']
		this.defaultName = attrs['defaultName']
		this.defaultPk = attrs['defaultPk']
		this.isExt = attrs['isExt']
		this.uapDataType = attrs['uapDataType']
		this.editFormula = attrs['editFormula']
		this.validateFormula = attrs['validateFormula']
		/** 编辑性 **/
		this.editable = attrs['editable']
		/** 精度 **/
		this.precision = attrs['precision']
		/**必输**/
		this.necessary = attrs['necessary']		
		this.reffilter =attrs['reffilter']	
		/**联动**/
		this.linkage = attrs['linkage']
		/**默认事件*/
		this.defevt = attrs['defevt'];
		/**参照配置*/
		this.refcfg = attrs['refcfg'];
		this.lockflag = attrs['lockflag'];
		this.dataset = null;
	}

	Field.prototype = new Events()
	
	
	Field.DEFAULTS = {
		label: null,
		type: 'string',
		format: null,
		isExt: false,  //是否扩展字段
		uapDataType:'-1', //uap数据类型
		editFormula:'',  //编辑公式
		validateFormula:'',  // 校验公式
		necessary:true,
		precision:null,
		reffilter:'',  //参照过滤条件
		editable:true,
		linkage:false, //联动
		refcfg : null,//参照配置
		lockflag:false,
		defevt:null //默认事件
	}
	
	Field.ON_CHANGE_EVENT = 'change'
	
	Field.fn = Field.prototype
	
	
	Field.fn.setDataSet = function(ds){
		this.dataset = ds
	}
	
	Field.fn.on = function(name, callback){
		var self = this;
		Events.prototype.on.call(this,name, callback)
		if (Field.ON_CHANGE_EVENT == name && this.dataset != null){
			$.map(this.dataset.records(), function(r){
				r.registerSubscribers(self)
			})
		}
	}
	
	/**
	 *行记录
	 * 
	 */
	var Record = function(data){
		this.data = ko.observable()
		if (data){
			this.data(data)
		}
		this.rid = uniqueId('r')
		this.dataset = null
		this.state = Record.STATE_NEW 
	}
	
	Record.STATE_NRM = 'nrm';
	Record.STATE_UPD = 'upd';
	Record.STATE_NEW = 'new';
	Record.STATE_DEL = 'del';
	Record.STATE_COMMIT = 'cmt'
	

    var idCounter = 0;
    var uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	}
	
	Record.fn = Record.prototype
	
	Record.fn.getRealData = function(){
		return ko.toJS(this.data)
	}
	
	Record.fn.getSubmitData = function(){
		var datas = ko.toJS(this.data),subData = {}
		for(var key in datas){
			if(datas[key].pk != null)
				subData[key] = datas[key].pk 
		}
		return subData
	}
	
	Record.fn.setData = function(data){
		if (this.dataset)
			this.dataset.slice = true;
		for(var field in data){
			if (this.data()[field]){
				this.data()[field].pk(data[field].pk)
				this.data()[field].name(data[field].name)				
			}
		}
		if (this.dataset)
			this.dataset.slice = false
	}
	
//	Record.fn.setValue = function(fieldName, value){
//		this.oldValue = this.data()[fieldName] 
//		this.data()[fieldName] = value
//		if (this.dataset){
//			var rIndex = this.dataset.getRecordIndex(this)
//			var args = {
//				recordIndex:rIndex,
//				fieldName:fieldName,
//				oldValue:this.oldValue,
//				newValue:value
//			}
//			this.dataset.trigger(DataSet.ON_VALUE_CHANGE_EVENT,args)
//		}
//		//新增状态始终不修改为编辑状态
//		if (this.state != Record.STATE_NEW)
//			this.state = Record.STATE_UPD
//	}

//	Record.fn.getValue = function(getValue){
//		return this.data()[index]
//	}

	Record.fn.isNew = function(){
//		return this.id == null;
	}
	
	/**
	 * 设置record所属数据集
	 */
	Record.fn.setDataSet = function(ds){
		this.dataset = ds
		this.registerSubscribers()
	}
	
	/**
	 * 设置行状态
	 */
	Record.fn.setState = function(state){
		this.state = state;
	}
	
	/**
	 * 注册订阅者，监听数据变化
	 */
	Record.fn.registerSubscribers = function(f){
		if (!this.dataset) return
		var self = this
		var fields = this.dataset.fields
		if(f){
			if (f.editFormula != ''   || f.linkage || f.getEvent(Field.ON_CHANGE_EVENT)){
				this.addChangeEvent(f)
			}
		}else{
			for (var i=0,count=fields.length; i< count; i++){
				var f = fields[i]
				//1:有公式或者有注册change事件时(f.getEvent(Field.ON_CHANGE_EVENT) )，加监听; 2:联动属性true时加监听
				if (f.editFormula != ''   || f.linkage || f.getEvent(Field.ON_CHANGE_EVENT)){
					this.addChangeEvent(f)
				}
			}
		}

	}
	
//	Record.fn._formula = function(f){
//			var self = this
//			//编辑公式、校验公式的监听
//			if (f.editFormula != '' || f.validateFormula != ''){
//				
//				if (!this.data()[f.id]) return
//				var rindex = this.dataset.getRecordIndex(this)
//				if (typeof this.data()[f.id].pk != 'function')
//					this.data()[f.id].pk = ko.observable(this.data()[f.id].pk)
//					
//				this.data()[f.id].pk.subscribe(function(oldValue){
//					self.data()[f.id].oldPk = oldValue
//				},null,"beforeChange")
//				this.data()[f.id].pk.subscribe(function(newValue){
//					var edititeminfo = {
//						'id': f.id,
//						'value': newValue,
//						'oldvalue': self.data()[f.id].oldPk,
//						'formula': f.editFormula || f.validateFormula, 	
//						'selectrow': rindex, 
//						'classname': self.dataset.classname
//					}
//					self.dataset.aggDs.execFormula(edititeminfo)							
//				})
//			}
//	}
//	
	Record.fn.addChangeEvent = function(f){
		this.subscribes || (this.subscribes = {})
		if (this.subscribes[f.id]) return
		var self = this
		var rindex = this.dataset.getRecordIndex(this)
		this.data()[f.id].pk.subscribe(function(oldValue){
			if (self.dataset.slice) return
			self.data()[f.id]._oldPk = !oldValue?"":oldValue
		},null,"beforeChange")
		this.data()[f.id].pk.subscribe(function(newValue){
			if (self.dataset.slice)return
			if (f.editFormula != ''   || f.linkage){
				if( newValue == self.data()[f.id]._oldPk  ){
					return
				}

				if(f.lockflag){
					f.defaultPk = newValue;
					f.defaultName = newValue;
				}
					
				var edititeminfo = {
					'id': f.id,
					'value': newValue,
					'oldvalue': self.data()[f.id]._oldPk,
					'formula': f.editFormula  , 	
					'selectrow': rindex, 
					'event': 'onChange', 
					'classname': self.dataset.classname,
					'editFormulaPartners':{},
					'validateFormulaPartners':{}
				}
				//搜集编辑公式
				self.dataset.aggDs.fetchAggDatasFormmulas(edititeminfo.editFormulaPartners)
				

					 
				self.dataset.aggDs.execEditEvent(edititeminfo)						
			}
			self.dataset.getField(f.id).trigger(Field.ON_CHANGE_EVENT, {oldValue:self.data()[f.id]._oldPk,newValue:newValue,rowindex:rindex})
		})
		this.subscribes[f.id] = 1
	}

	/**
	 * 数据集
	 * new DataSet({
	 * 	fields:[{id:'code',label:'编码'},{id:'name',label:'名称'}],
	 *  url:'/demo/xxx'
	 * })
	 */
	var DataSet = function(options){
		var self = this
		this.options = $.extend({}, DataSet.DEFAULTS, options)
		this.url = options.url;
		this.classname = options.classname 
		this.records = ko.observableArray([])
		var fields = options['fields']
		if (fields){
			this.fields = $.map(fields, function(item) {
				var f = new Field(item);
				f.setDataSet(self)
				return f
			})
		}
		this.selectedIndices = []
		this.currSelectedIndex = ko.observable()
		this.currentRecord = ko.observable()
		this.bindDefaultEvents();
	}
	
	DataSet.prototype = new Events()
	
	DataSet.ON_RECORD_SELECT_EVENT = 'select'
	DataSet.ON_RECORD_UNSELECT_EVENT = 'unselect'
	DataSet.ON_RECORD_ALLSELECT_EVENT = 'allselect'
	DataSet.ON_RECORD_ALLUNSELECT_EVENT = 'allunselect'
	DataSet.ON_VALUE_CHANGE_EVENT = 'valuechange'
	DataSet.ON_ADD_RECORD_EVENT = 'addrecord'
	DataSet.ON_INSERT_RECORD_EVENT = 'insertrecord'
	DataSet.ON_DELETE_RECORD_EVENT = 'deleterecord'
	DataSet.ON_LOAD_EVENT = 'load'
	
	DataSet.DEFAULTS = {
		url:'',
		classname:'',
		autoCommit:true   //此选项后，“新增”状态的行不被提交，只有“新增并提交”状态的行才被提交
		
	}
	
	DataSet.fn = DataSet.prototype
	
//	/**
//	 *绑定事件
//	 */
//	DataSet.fn.on = function(name, callback) {
//		name = name.toLowerCase()
//		this._events || (this._events = {})
//		var events = this._events[name] || (this._events[name] = [])
//		events.push({
//			callback: callback
//		})
//		return this;
//	}
//
//	/**
//	 * 触发事件
//	 */
//	DataSet.fn.trigger = function(name) {
//		name = name.toLowerCase()
//		if (!this._events || !this._events[name]) return this;
//		var args =  Array.prototype.slice.call(arguments, 1);
//		var events = this._events[name];
//		for (var i = 0, count = events.length; i < count; i++) {
//			events[i].callback.apply(this, args);
//		}
//		return this;
//	}	
	
	DataSet.fn.getRecord = function(index){
		if (index != null && index  != 'undfined'){
			return this.records()[index]
		}
		return null
			
	}
	
	DataSet.fn.getRecords = function(){
		return this.records()
	}
	
	DataSet.fn.addField = function(f){
		this.fields.push(f)
		f.setDataSet(this)
		//fetch default info 4 arap
		var _name = (f.defaultName === undefined) ? null : f.defaultName;
		var _pk = (f.defaultPk === undefined) ? null : f.defaultPk;
		f.tplPk = _pk;
		f.tplName = _name;
		//data[f.id] = {'name':ko.observable(_name),'pk':ko.observable(_pk)}
	}

	DataSet.fn.setFields = function(fields){
		this.fields = fields
		for (var i in this.fields){
			this.fields[i].setDataSet(this)
		}
	}
	
	DataSet.fn.getField = function(name){
		for (var i in this.fields){
			if (this.fields[i].id == name)
				return this.fields[i]
		}
	}
	
	/**
	 * 增加行
	 */
	DataSet.fn.addRecord = function(r){
		this.records.push(r)
		r.setDataSet(this)
		this.trigger(DataSet.ON_ADD_RECORD_EVENT)
		return this.records().length - 1
	}
	
	/**
	 * 插入行
	 */
	DataSet.fn.insertRecord = function(index,r){
		this.records.splice(index, 0, r)
		r.setDataSet(this)
		this.updateSelectedIndices(index, '+')
		this.trigger(DataSet.ON_INSERT_RECORD_EVENT)
	}
	/**
	 * 清除已添加行记录
	 */
 	DataSet.fn.clearCmtRecords  = function(){
 		var self = this;
		var realRecords = this.getRecords()
		var rArr = []
		$.each(realRecords, function(index, record){
			if(record && record.state == Record.STATE_COMMIT)
		 		rArr.push(record);
		});
		
		//执行删除
		$.each(rArr,function(index, record){
			self.deleteRecord(record);
		});
	}
	/**
	 * 删除行
	 * @param submit  true/false 是否提交服务器
	 */
	DataSet.fn.deleteRecordsByIndex = function(indices, submit){
		var self = this;
		var arr = []
		var records = this.records()
		indices = _getIndicesArray(indices)
		indices.sort()
		if (submit == true){ 
			for(var i in indices){
				if (records[indices[i]].state != Record.STATE_NEW)
					arr.push(records[indices[i]].getRealData())
			}
			$.ajax({
				url: this.url,
				type: "delete",
				data:arr,
				contentType: "application/json",
				success: function(result) {
					while(indices.length > 0){
						var index = indices.pop()
						self.records.splice(index,1)
					}
					self.trigger(DataSet.ON_DELETE_RECORD_EVENT,indices)		
				}
			});			
		}
		else{
			while(indices.length > 0){
				var index = indices.pop()
//				if (this.records()[index].state == Record.STATE_NEW)
					this.records.splice(index,1)
					this.updateSelectedIndices(index, '-')
//				else	
//					this.records()[index].setState(Record.STATE_DEL)
			}
			self.trigger(DataSet.ON_DELETE_RECORD_EVENT,indices)		
		}
		
	}
	
	/**
	 * 删除行
	 * @param submit  true/false 是否提交服务器
	 */
	DataSet.fn.deleteRecord = function(record, submit){
		var index = this.getRecordIndex(record)
		this.deleteRecordsByIndex(index, submit)	
		this.updateSelectedIndices(index,'-')
	}
	
	/**
	 * 删除选中行
	 */
	DataSet.fn.deleteSelectedRecords = function(submit){
		if (this.selectedIndices.length > 0)
		this.deleteRecordsByIndex(this.selectedIndices, submit)	
	}
	
	/**
	 * 修改新增行状态为新增提交状态，并非真正提交数据到后台
	 * */
	DataSet.fn.commit = function(){
		var rs = this.records()
		for (var i in rs){
			if (rs[i].state == Record.STATE_NEW)
				rs[i].setState(Record.STATE_COMMIT)
		}
	}
	
	
	
	/**
	 * 获取record的行索引
	 */
	DataSet.fn.getRecordIndex = function(record){
		return this.records.indexOf(record)
	}
	
	/**
	 * 创建新行
	 */
	DataSet.fn.createRecord = function(index,slient){
		var r = new Record()
		if (this.fields){
			var data = {}			
			for(var i in this.fields){
				var f = this.fields[i]
				var _name = (f.defaultName === undefined) ? null : f.defaultName;
				var _pk = (f.defaultPk === undefined) ? null : f.defaultPk;
				data[f.id] = {'name':ko.observable(_name),'pk':ko.observable(_pk)}
			}
			r.data(data)
		}
		if(index == undefined) {
			var lastIndex = this.addRecord(r)
			this.setRecordsSelect(lastIndex,slient)
		}else {
			this.insertRecord(index,r)
			this.setRecordsSelect(index,slient)
		}
		if(!slient)
			this.exeDefEvt();
		return r
	}
	/**
	 * 执行默认事件
	 */
	DataSet.fn.exeDefEvt = function(rowval){
		var fields = this.fields
		var rindex = this.getSelectedIndex()
		window.$exeBatchEditEvent = true;
		for (var i=0,count=fields.length; i< count; i++){
			var f = fields[i]
			if(f.defevt && f.defevt=='init'){
				var tVal = null
				if(rowval === undefined && f.defaultPk != undefined) tVal =f.defaultPk
				if(rowval) tVal = this.getSelectedRecord().data()[f.id].pk()
				var edititeminfo = {
					'id': f.id,
					'value': tVal,
					'oldvalue': null,
					'formula': f.editFormula  , 
					'selectrow': rindex, 
					'event': rowval?'onInit':'load',
					'classname': this.classname 
				}
				this.aggDs.execEditEvent(edititeminfo)
			}
		}
		window["$exeBatchEditEvent"] = null
	}
	
	DataSet.fn.validateCurrentRow = function(){
		var dtd = $.Deferred();
		var fields = this.fields
		window.$exeBatchEditEvent = dtd;
		var hasValidateFormula = false;
		for (var i=0,count=fields.length; i< count; i++){
			var f = fields[i]
			if(f.validateFormula){
				var edititeminfo = {
					'id': f.id,
					'value': this.getSelectedRecord().data()[f.id].pk() || null,
					'oldvalue': null,
					'formula': f.validateFormula, 
					'selectrow': this.getSelectedIndex(), 
					'event':'validate',
					'classname': this.classname
				}
				this.aggDs.execEditEvent(edititeminfo)
				hasValidateFormula = true;
			}
		}
		if(!hasValidateFormula){
			dtd.resolve();
		}
		window["$exeBatchEditEvent"] = null
		return dtd;
	}
	
	
	/**
	 * 复制行
	 */
	DataSet.fn.copyRecord = function(record){
		var r = new Record()
		var oData = record.getRealData()
		if (this.fields){
			var data = {}			
			for(var i in this.fields){
				var f = this.fields[i]
				data[f.id] = {'name':ko.observable(oData[f.id].name),'pk':ko.observable(oData[f.id].pk)}
			}
			r.data(data)
		}		
		
		var index = this.getRecordIndex(record)
		this.insertRecord(index+1, r)
//		var index = this.addRecord(r)
		this.setRecordsSelect(index + 1)
		return r
	}
	
	/**
	 * 复制行
	 */
	DataSet.fn.copyRecordByIndex = function(index){
		var r = this.getRecord(index)
		return this.copyRecord(r)
	}
	
	
	DataSet.fn.getChangeRecordsDatas = function(){
		var rArr = []
		var realRecords = this.getRecords()
		var needSubmit = this.options.needSubmit
		for(var i=0, count = realRecords.length; i< count; i++){
			if (realRecords[i].state != Record.STATE_NRM &&  (!needSubmit || realRecords[i].state != Record.STATE_NEW))
				rArr.push({state:realRecords[i].state,data:realRecords[i].getRealData()})
		}
		return rArr
	}
	
	/**
	 * 获取所有行的提交数据信息
	 */
	DataSet.fn.getAllRecordsDatas = function(){
		var rArr = []
		var realRecords = this.getRecords()
		var needSubmit = this.options.autoCommit
		for(var i=0, count = realRecords.length; i< count; i++){
			if (needSubmit || realRecords[i].state != Record.STATE_NEW)
				rArr.push(realRecords[i].getSubmitData())
		}
		return rArr
	}

	/**
	 * 获取当前行的提交数据信息
	 */
	DataSet.fn.getCurrentRecordData = function(){
		if (!this.currentRecord()) return null
		var r = this.currentRecord()
		return r.getSubmitData()
	}
	
	/**
	 * 获取字段自定义信息
	 */
	DataSet.fn.getDefTypes = function(){
		var defs = {}
		for (var i in this.fields){
			var f = this.fields[i]
			if (f.isExt){
				defs[f.id] = f.uapDataType
			}
		}
		return defs
	}
	
	
	DataSet.fn.getUrl = function(){
		return this.options['url']
	}	
	
	/**
	 * 加载数据
	 */
	DataSet.fn.setRecords = function(records){
		this.records(records)
		for (var i=0,count=records.length; i<count; i++){
			records[i].setDataSet(this)			
		}
		
		this.trigger(DataSet.ON_LOAD_EVENT)
	}
	
	/**
	 *获取pk值 
	 */
	DataSet.fn.getPk = function(rowindex, fieldName){
		var r = this.getRecord(rowindex)
		if (typeof r.data()[fieldName].pk == 'function')
			return r.data()[fieldName].pk()
		else	
			return r.data()[fieldName].pk
	}

	/**
	 *获取name值 
	 */
	DataSet.fn.getName = function(rowindex, fieldName){
		var r = this.getRecord(rowindex)
		if (typeof r.data()[fieldName].name == 'function')
			return r.data()[fieldName].name()
		else	
			return r.data()[fieldName].name
	}
	/**
	 * 设置当前编辑行pk
	 */
	DataSet.fn.setCurPk = function(fieldName, value){
		var record = this.currentRecord();
		if(record && record.data()[fieldName]){
			if (typeof record.data()[fieldName].pk == 'function')
				record.data()[fieldName].pk(value)
			else	
				return record.data()[fieldName].pk = value
		}
	}
	/**
	 *设置pk 
	 */
	DataSet.fn.setPk = function(rowindex, fieldName, value){
		var r = this.getRecord(rowindex)
		if(r && r.data()[fieldName]){
			if (typeof r.data()[fieldName].pk == 'function')
				r.data()[fieldName].pk(value)
			else	
				return r.data()[fieldName].pk = value
		}
		if(rowindex == -99){
			this.setAllPk(fieldName,value);
			if(this.getField(fieldName))
				this.getField(fieldName).defaultPk = value;
		}
	}
	
	/**
	 *设置所有pk 
	 */
	DataSet.fn.setAllPk = function(fieldName, value){
		for (var index=0;index<this.records().length;index++){
			this.setPk(index,fieldName,value);
		}
	}	
	/**
	 *设置当前编辑行name 
	 */
	DataSet.fn.setCurName = function(fieldName, value){
		var record = this.currentRecord();
		if(record && record.data()[fieldName]){
			if (typeof record.data()[fieldName].name == 'function')
				record.data()[fieldName].name(value)
			else	
				return record.data()[fieldName].name = value
		}
	}
	/**
	 *设置name 
	 */
	DataSet.fn.setName = function(rowindex, fieldName, value){
		var r = this.getRecord(rowindex)
		if(r && r.data()[fieldName]){
			if (typeof r.data()[fieldName].name == 'function')
				r.data()[fieldName].name(value)
			else	
				return r.data()[fieldName].name = value
		}
		if(rowindex == -99){
			this.setAllName(fieldName,value);
			if(this.getField(fieldName))
				this.getField(fieldName).defaultName = value;
		}
	}	
	/**
	 *设置所有name 
	 */
	DataSet.fn.setAllName = function(fieldName, value){
		for (var index=0;index<this.records().length;index++){
			this.setName(index,fieldName,value);
		}
	}

	/**
	 * 获取数据
	 */
	DataSet.fn.fetch = function(data,callback,isasync){
		var self = this;
		$.getJSON(this.url,function(data){
//				data = JSON.parse(data)
				$.map(data.bodys, function(item) {
					var r = self.createRecord(undefined,true)
					r.setData(item)
					r.setState(Record.STATE_NRM)
					self.exeDefEvt();
					return r
				})
//				self.setRecords(records);
				if (callback)
					callback.call(this)		
		})
	}
	
	/**
	 * 保存数据
	 */
	DataSet.fn.save = function(){
		var self = this;
		$.ajax({
			url: this.url,
			type: "post",
			data:self.getAllRecordsDatas(),
			contentType: "application/json",
			success: function(result) {
				for(var i = self.records().length - 1; i >= 0; i--){
					if (self.records()[i].state == Record.STATE_DEL)
						self.records.splice(i,1)
					else	
						self.records()[i].setState(Record.STATE_NRM)
				}
			}
		});		
	}	
	
	/**
	 * 设置选中行，清空之前已选中的所有行
	 */
	DataSet.fn.setRecordsSelect = function(indices,slient){
		indices = _getIndicesArray(indices)
		this.setAllRecordsUnSelect()
		this.selectedIndices = indices
		this.currSelectedIndex(this.getSelectedIndex())
		this.trigger(DataSet.ON_RECORD_SELECT_EVENT, indices)
		if(!slient)
			this.exeDefEvt(true)
	}

	/**
	 * 添加选中行，不会清空之前已选中的行
	 */
	DataSet.fn.addRecordsSelect = function(indices){
		indices = _getIndicesArray(indices)
		for (var i=0; i< indices.length; i++){
			this.selectedIndices.push(indices[i])
		}
		this.currSelectedIndex(this.getSelectedIndex())
		this.trigger(DataSet.ON_RECORD_SELECT_EVENT, indices)
		
	}
	
	function _getIndicesArray(indices){
		if (!$.isNumeric(indices) && !$.isArray(indices)) throw new Error('indices mast be number or array')
		if ($.isNumeric(indices)){
			indices = [indices]
		}
		return  indices
	}
	
	/**
	 * 全部选中
	 */
	DataSet.fn.setAllRecordsSelect = function(){
		this.selectedIndices = []
		for (var i=0, count = this.records().length; i<count; i++){
			this.selectedIndices.push[i]	
		}
		this.currSelectedIndex(this.getSelectedIndex())
		this.trigger(DataSet.ON_RECORD_ALLSELECT_EVENT)
	}
	
	/**
	 * 全部取消选中
	 */
	DataSet.fn.setAllRecordsUnSelect = function(){
		this.selectedIndices = []
		this.currSelectedIndex(this.getSelectedIndex())
		this.trigger(DataSet.ON_RECORD_ALLUNSELECT_EVENT)
	}
	
	/**
	 * 取消选中
	 */
	DataSet.fn.setRecordsUnSelect = function(indices){
		indices = _getIndicesArray(indices)
		while(indices.length > 0){
			var index = indices.shift()
			var pos = this.selectedIndices.indexOf(index)
			if (pos != -1)
				this.selectedIndices.splice(pos,1)
		}
		this.currSelectedIndex(this.getSelectedIndex())
		this.trigger(DataSet.ON_RECORD_UNSELECT_EVENT,indices)
	}
	
	/**
	 * 获取所有选中行索引
	 */
	DataSet.fn.getSelectedIndices = function(){
		return this.selectedIndices;	
	}
	
	/**
	 * 获取选中行索引，多选时，只返回第一个行索引
	 */
	DataSet.fn.getSelectedIndex = function(){
		if (this.selectedIndices == null || this.selectedIndices.length == 0)
			return -1
		return this.selectedIndices[0]
	}
	
	/**
	 * 
	 * @param {Object} index 要处理的起始行索引
	 * @param {Object} type   增加或减少  + -
	 */
	DataSet.fn.updateSelectedIndices = function(index, type){
		if (this.selectedIndices == null || this.selectedIndices.length == 0)
			return
		for (var i = 0, count= this.selectedIndices.length; i< count; i++){
			if (type == '+'){
				if (this.selectedIndices[i] >= index)
					this.selectedIndices[i] = parseInt(this.selectedIndices[i]) + 1
			}
			else if (type == '-'){
				if (this.selectedIndices[i] == index)
					this.selectedIndices.splice(i,0)
				else if(this.selectedIndices[i] > index)
					this.selectedIndices[i] = this.selectedIndices[i] -1
			}
		}
		if (type == '+')
			this.selectedIndices.push(index)
		this.currSelectedIndex(this.getSelectedIndex())	
			
	}
	
	/**
	 * 获取选中行，多选时，只返回第一个先被选中的行
	 */
	DataSet.fn.getSelectedRecord = function(){
		var index = this.getSelectedIndex()
		if (index === -1) return null
		var r = this.getRecords()
		return r[index]
	}
	
	/**
	 * 获取所有的选中行
	 */
	DataSet.fn.getSelectedRecords = function(){
		var indices = this.getSelectedIndices();
		if (indices == null || indices.length == 0) {
			return null
		}
		var r = this.getRecords()
		var selRecords = new Array
		for ( var i = 0; i < indices.length; i++)
			selRecords.push(r[indices[i]])
		return selRecords
	}
	DataSet.fn.fieldMap = {};
	/**
	 * 绑定内部事件
	 */
	DataSet.fn.bindDefaultEvents = function(){
		var self = this
		this.on(DataSet.ON_RECORD_SELECT_EVENT, function defaultSelect(indices){
			var lastIndex = indices[indices.length - 1]
			self.currentRecord(self.records()[lastIndex])
		})
//		this.on(DataSet.ON_RECORD_ALLSELECT_EVENT, function defaultAllSelect(){
//			self.currentRecord(self.records[0].data)
//		})
		this.on(DataSet.ON_RECORD_UNSELECT_EVENT, function defaultUnSelect(indices){
			if (self.selectedIndices.length > 0){
				var firstIndex = self.selectedIndices[0]
				self.currentRecord(self.records()[firstIndex])
			}
			else
				self.currentRecord()
		})
		this.on(DataSet.ON_RECORD_ALLUNSELECT_EVENT, function defaultAllUnSelect(){
			self.currentRecord()
		})
		
	}
	
	DataSet.fn.bindFieldAttr = function(fieldName,attrName){
		var item = null;
		for(var i=0,k=this.fields.length;i<k;i++){
			var item = this.fields[i];
			if(item["id"] == fieldName){
				this.fieldMap[fieldName]= (item);
				break;
			}
		}
		if(!this.fieldMap[fieldName]){
			 this.fieldMap[fieldName] = {};
		}
		if(typeof this.fieldMap[fieldName][attrName] != 'function'){
			var obz = ko.observable(item[attrName]);
			this.fieldMap[fieldName][attrName] = obz;
		}
		return this.fieldMap[fieldName][attrName];
	}
	
	/**
	 * 主子组合数据集
	 * @param {Object} options
	 */
	var AggDataSet = function(options){
		this.options = $.extend({}, AggDataSet.DEFAULTS, options)
		var headParams = this.options.head
		var bodyParams = this.options.body
		headParams.autoCommit = bodyParams.autoCommit = this.options.autoCommit
		if (this.options.url != '')
			headParams.url = this.options.url
		if (this.options.headFields)
			headParams.fields = this.options.headFields
		if (this.options.headClassName != '')
			headParams.classname = this.options.headClassName
		if (this.options.bodyFields)
			bodyParams.fields = this.options.bodyFields
		if (this.options.bodyClassName != '')
			bodyParams.classname = this.options.bodyClassName
		this.head = new DataSet(headParams);
		this.body = new DataSet(bodyParams);
		this.head.aggDs = this;
		this.body.aggDs = this;
	}
	
	AggDataSet.DEFAULTS ={
		autoCommit: true,
		head: {},
		body: {},
		url: '',
		headClassName: '',
		bodyClassName: ''
	}
	
	AggDataSet.EDIT_EVENT = "edit"
	
	AggDataSet.prototype = new Events()
	
	AggDataSet.fn = AggDataSet.prototype
	
	AggDataSet.fn.fetch = function(params,isasync){
		var self = this;
		$.getJSON(this.head.url,function(data,a,b){
			if(window.processXHRError(data,a,b)){
				var headData = data.head
				var bodyDatas  = data.body
				//var headRecord = new Record(headData)
				//headRecord.setState(Record.STATE_NRM)
				//self.head.setRecords([headRecord])
				//self.head.setRecordsSelect(0)
				var hr = self.head.createRecord(undefined,true)
				hr.setData(headData)
				hr.setState(Record.STATE_NRM)
				self.head.exeDefEvt(true);
	//			var bodyRecords = []
				for (var i=0, count = bodyDatas.bodys.length; i< count; i++){
					var item = bodyDatas.bodys[i]
					var r = self.body.createRecord(undefined,true)
					r.setData(item)
					r.setState(Record.STATE_NRM)
					self.body.exeDefEvt(true);
	//				bodyRecords.push(r)
				}
				
				self.body.trigger(DataSet.ON_LOAD_EVENT)
			}

		})
	}
	/**
	 * 加载数据
	 */
	AggDataSet.fn.loadData = function(data,self){
		   if(!self)self =this;
		    
		   //清楚所有行
		    self.body.clearCmtRecords();
		    
	        var headData = data.head;
	        var bodyDatas  = data.body;
	        //var headRecord = new Record(headData)
	        //headRecord.setState(Record.STATE_NRM)
	        //self.head.setRecords([headRecord])
	        //self.head.setRecordsSelect(0)
	        var hr = self.head.createRecord(self.head.records().length - 1,true);
	        hr.setData(headData);
	        hr.setState( 'cmt');
	        self.head.exeDefEvt(true);
	//                         var bodyRecords = []
	        for (var i=0, count = bodyDatas.bodys.length; i< count; i++){
	                 var item = bodyDatas.bodys[i];
	                 var r = self.body.createRecord(self.body.records().length - 1,true);
	                 r.setData(item);
	                 r.setState( 'cmt');
	                 self.body.exeDefEvt(true);
	//                                  bodyRecords.push(r)
	        }
	        self.body.setRecordsSelect(self.body.records().length - 1);
	        self.body.trigger('load');
	}
	
	/**
	 * 保存数据
	 */
	AggDataSet.fn.save = function(){
		var self = this;
		$.ajax({
			url: this.url,
			type: "post",
			data:self.getAllRecordsDatas(),
			contentType: "application/json",
			success: function(result) {
				for(var i = self.records().length - 1; i >= 0; i--){
					if (self.records()[i].state == Record.STATE_DEL)
						self.records.splice(i,1)
					else	
						self.records()[i].setState(Record.STATE_NRM)
				}
			}
		});		
	}	
	
	AggDataSet.fn.getAggDatas = function(){
		var head = this.head.getCurrentRecordData()
		var body = this.body.getAllRecordsDatas()
		return {'head':head,'body':{'bodys':body}}
//		var head = ko.toJS(this.head.currentRecord().data)
//		var bodys = ko.toJS(this.body.)
	}
	
	AggDataSet.fn.fetchAggDatasFormmulas = function(editFormulaPartners){
		var formulas = {}
		var head = this.head
		for(var ix=0,len = head.fields.length; ix < len; ix++){
			var myField = head.fields[ix];
			var _formul = [] 
			if(myField.editFormula){
				_formul.push(myField.editFormula)
				formulas[myField.id] = _formul;
			}
		}
		var body = this.body
		for(var ix=0,len = body.fields.length; ix < len; ix++){
			var myField = body.fields[ix];
			if(myField.editFormula){ 
				if(!formulas[myField.id]){
					formulas[myField.id] = [myField.editFormula];
					continue;
				}
				if(formulas[myField.id] && $.inArray(myField.editFormula,formulas[myField.id])== -1){
					 formulas[myField.id].push(myField.editFormula)
				}
			}
		}
		$.each( formulas, function(i, n){
		  editFormulaPartners[i] = n.join(";");
		});
	}
	
	
	AggDataSet.fn.execEditEvent = function(edititeminfo){
		var datas = this.getAggEventDatas()
		datas.edititeminfo = edititeminfo
		this.trigger(AggDataSet.EDIT_EVENT,datas)
		
	}	
	
	AggDataSet.fn.getAggEventDatas = function(){
		var head = this.head.getCurrentRecordData()
		var headdeftype = this.head.getDefTypes() 
		var body = this.body.getCurrentRecordData()
		var bodydeftype = this.body.getDefTypes()
		var result = {
			//"edititeminfo": editinfo,
			"head":{
				"classname":this.head.classname,
				"value":head,
				"headdeftype":headdeftype
			},
			"body":[{
				"classname":this.body.classname,
				"value":[body],
				"bodydeftype":bodydeftype
			}]
		}
		return result
	}	
	
	
	AggDataSet.fn.bindHeadFieldAttr = function(fieldName,attrName){
		
	}
	AggDataSet.fn.bindHeadName = function(fieldName){
		if (!this.head.currentRecord() || !this.head.currentRecord().data()[fieldName]) return
		if (typeof this.head.currentRecord().data()[fieldName].name != 'function')
		 	this.head.currentRecord().data()[fieldName].name = ko.observable(this.head.currentRecord().data()[fieldName].name)
		return this.head.currentRecord().data()[fieldName].name
	}
	
	AggDataSet.fn.bindHeadPk = function(fieldName){
		if (!this.head.currentRecord() || !this.head.currentRecord().data()[fieldName]) return
		if (typeof this.head.currentRecord().data()[fieldName].pk != 'function')
		 	this.head.currentRecord().data()[fieldName].pk = ko.observable(this.head.currentRecord().data()[fieldName].pk)
		return this.head.currentRecord().data()[fieldName].pk
	}
	
	AggDataSet.fn.bindBodyName = function(index, fieldName){
		if (!this.body.records()) return
		if (!this.body.records()[index])
			throw new Error('index not exist: index:' + index + 'fieldName:' + fieldName)
		if (!this.body.records()[index].data()[fieldName])	return
//			throw new Error('fieldName not exist: index:' + index + 'fieldName:' + fieldName)
		if(typeof this.body.records()[index].data()[fieldName].name != 'function')
			this.body.records()[index].data()[fieldName].name = ko.observable(this.body.records()[index].data()[fieldName].name)
		return this.body.records()[index].data()[fieldName].name
	}
	
	AggDataSet.fn.bindBodyPk = function(index, fieldName){
		if (!this.body.records()) return
		if (!this.body.records()[index])
			throw new Error('index not exist: index:' + index + 'fieldName:' + fieldName)
		if (!this.body.records()[index].data()[fieldName])	
			throw new Error('fieldName not exist: index:' + index + 'fieldName:' + fieldName)
		if(typeof this.body.records()[index].data()[fieldName].pk != 'function')
			this.body.records()[index].data()[fieldName].pk = ko.observable(this.body.records()[index].data()[fieldName].pk)
		return this.body.records()[index].data()[fieldName].pk
	}
	
	AggDataSet.fn.bindBodyCurrName = function(fieldName){
		if (!this.body.currentRecord() || !this.body.currentRecord().data()[fieldName]) return
		if (typeof this.body.currentRecord().data()[fieldName].name != 'function')
		 	this.body.currentRecord().data()[fieldName].name = ko.observable(this.body.currentRecord().data()[fieldName].name)
		return this.body.currentRecord().data()[fieldName].name
	}
	
	AggDataSet.fn.bindBodyCurrPk = function(fieldName){
		if (!this.body.currentRecord() || !this.body.currentRecord().data()[fieldName]) return
		if (typeof this.body.currentRecord().data()[fieldName].pk != 'function')
		 	this.body.currentRecord().data()[fieldName].pk = ko.observable(this.body.currentRecord().data()[fieldName].pk)
		return this.body.currentRecord().data()[fieldName].pk
	}
	
	AggDataSet.fn.bindBodyCurrItem = function(fieldName){
		if (!this.body.currentRecord()) return
		return this.body.currentRecord().data()[fieldName]
	}
	

	if (exports){
		exports.Field = Field,
		exports.Record = Record ,
		exports.DataSet = DataSet,
		exports.AggDataSet = AggDataSet
	}
	else
	return {
		Field: Field,
		Record: Record,
		DataSet: DataSet,
		AggDataSet: AggDataSet
	};

});