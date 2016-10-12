require.config({
	baseUrl: "../",
	paths: {
		text: "/uui2/libs/requirejs/text",
		css: "/uui2/libs/requirejs/css",
		jquery: "/uui2/libs/jquery/jquery-1.11.2",
		knockout: "/uui2/libs/knockout/knockout-3.2.0.debug",
		'uui': "/uui2/libs/uui/js/u",
		'u.biz': "/uui2/libs/uui/js/u.biz" ,
		'i18next':"/uui2/libs/i18next/i18next",
		bignumber:"/uui2/libs/bignumber/bignumber",
		director:"/uui2/libs/director/director.min",
		bootstrap:"/uui2/libs/bootstrap/js/bootstrap",
		'billform' : '/iform_web/js/billcomp',
		'gridRender': '/iform_web/js/billcomp',
		'fullgridRender' : '/iform_web/js/billcomp',
		'formula' : '/iform_web/js/billcomp',
		zTree:"/iform_web/static/trd/zTree_v3/js/jquery.ztree.all-3.5.min",
		'zTree.exhide':"/iform_web/static/trd/zTree_v3/js/jquery.ztree.exhide-3.5.min",
		'bootstrap-table': "/iform_web/static/trd/bootstrap-table/src/bootstrap-table",
		'underscore': "/iform_web/static/js/ref/underscore",
		'scrollbar': "/iform_web/static/js/ref/jquery.scrollbar",
		'refer': "/iform_web/static/js/ref/refer",
		'ncReferComp' : "/iform_web/static/js/ref/ncReferComp",
		borderLayout:"/iform_web/static/js/ref/jquery.layout_and_plugins",
	    'wfcomp': "/iwebap/js/sys/workflow/wfcomp",
	    'printModel': "/iwebap/js/sys/printModel",
	    'attachComp': "/iwebap/js/sys/attachComp",
	    compevent: '/uui2/libs/tangram/event',
	    'sco.message':"/iform_web/js/sco.message",
	    'validate':'/iform_web/js/validate',
		'formula2':'/iform_web/static/js/rt/formula',
		'moneyuui':'/iform_web/static/js/rt/moneyuui',
		'viewDataTable':'/iform_web/static/js/rt/view.datatable',
		'dateintervaluui':'/iform_web/static/js/rt/dateintervaluui',
		'processapproveuui':'/iform_web/static/js/rt/processapproveuui',
		'wfcomp':'/iform_web/static/freebill/js/wfcomp',
		'workflow':'/iform_web/static/freebill/js/workflow',
		'dateutil':'/iform_web/static/freebill/js/dateutil'
	},
	shim: {
		bootstrap:{
			deps:["jquery"]
		},
		'uui': {
			deps: ["jquery", "bootstrap", "i18next"]
		},
		'u.biz': {
			deps: ["jquery", "bootstrap","knockout", "uui", "bignumber"]
		},
		'billform':{
   			deps:["jquery","knockout"]
		},
		'gridRender': {
			deps: ["billform"]
		},
		'fullgridRender': {
			deps: ["billform"]
		},
		'formula': {
			deps: ["billform"]
		},
		'eventconst':{
			deps:["billform"]
		},
		zTree: {
			deps: ["jquery","css!/iform_web/static/trd/zTree_v3/css/zTreeStyle/zTreeStyle.css"]
		},
		'zTree.exhide':{
			deps: ["zTree"]
		},
		'bootstrap-table': {
			deps: ["jquery", "css!/iform_web/static/trd/bootstrap-table/src/bootstrap-table.css"]
		},
		'refer':{
			deps:["jquery","underscore","zTree","bootstrap-table","scrollbar"]
		},
		'scrollbar':{
			deps:["jquery","css!/iform_web/static/css/ref/jquery.scrollbar.css"]
		},
		'sco.message':{
			deps: ["jquery"]
		},
		'validate':{
			deps: ["jquery"]
		},
		'ncReferComp':{
			deps:["u.biz"]
		},

		'wfcomp': {
			deps: ["uui","knockout"]
		}, 
		'workflow': {
			deps: ["uui","knockout"]
		},
		'attachComp':{
			deps:["jquery","knockout"]
		},
		'moneyuui': {
			deps: ["jquery",'formula2', "u.biz"]
		},
		'dateintervaluui':{
			deps :["jquery", "u.biz"]
		}
	},
	waitSeconds:60
});

require([
	'jquery',
	'knockout',
	'formula2',
	'moneyuui',
	'viewDataTable',
	'bootstrap',
	'uui',
	'u.biz',
	'ncReferComp',
	'refer',
	'workflow',
	'dateutil',
	'dateintervaluui',
	'processapproveuui'
],
 function($, ko, formula, model, viewctrl, refer) {
	var ctrl = {};
	ctrl.save = function(){
		var data = {};
		var rows = viewModel.headform.getAllRows();
		for(var i = 0, count = rows.length; i < count; i++){
			var rowData = rows[i].data;
			for(var key in rowData){
				if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
					continue;
				data[key] = rowData[key].value;
			}
		}
		
	}

	var viewModel ={
		bpminfo :"",
		authMap:{},
		headform: new $.DataTable({
				meta:{'pk_boins':'','id':'headform','201604121652244trlvrmdHw':{'label':'文本输入框','pk_bo':'c0aa9ae1-7d9d-451e-9b30-c10e3badcd2f','componentKey':'Text','type':'string','fieldId':'201604121652244trlvrmdHw'},'20160412165242WMPe6E9MwO':{'label':'日期','pk_bo':'c0aa9ae1-7d9d-451e-9b30-c10e3badcd2f','componentKey':'DateComponent','type':'string','fieldId':'20160412165242WMPe6E9MwO'},'20160412165231AdwHZJVRbw':{'label':'多行文本框','pk_bo':'c0aa9ae1-7d9d-451e-9b30-c10e3badcd2f','componentKey':'TextArea','type':'string','fieldId':'20160412165231AdwHZJVRbw'},'20160412165254gX2JgRJQB0':{'label':'金额','pk_bo':'c0aa9ae1-7d9d-451e-9b30-c10e3badcd2f','componentKey':'Money','type':'string','fieldId':'20160412165254gX2JgRJQB0','calculate':'false','numberToChinese':'false','decimalPlace':'2','isTotal':'false','mainTableField':'','editFormula':'','moneyFields':'[{"value":"(","type":"curves"},{"value":null,"type":"field"},{"value":")","type":"curves"}]','moneyType':'人民币'},'660677964':{'label':'参照','pk_bo':'c0aa9ae1-7d9d-451e-9b30-c10e3badcd2f','refmodel':'{"refName":"科目1","title":"科目1","refUIType":"CommonRef" ,"rootName":"财务组织1","isNotLeafSelected":true,"refModelClassName":"nc.ui.uap.funcreg.ref.MenuRefModel"}','refcfg':'{"isMultiSelectedEnabled":false}'},'20160412165327OH8yuBiqgT':{'label':'电话','pk_bo':'c0aa9ae1-7d9d-451e-9b30-c10e3badcd2f'},'20160412165334O9YY6BpVRf':{'label':'邮箱','pk_bo':'c0aa9ae1-7d9d-451e-9b30-c10e3badcd2f'}}
		}),
		
	    colors:{},
		save:function(e){
			if(!app.compsValidate($('.cardpanel')[0]) ) {
				$.showMessageDialog({type:"info",title:"提示",msg: '检验不通过',backdrop:true});
				return false;
			}
			app.serverEvent().addDataTables(['headform'],'all').fire({
				url:'/iform_web/evt/dispatch',
				ctrl:'BillCRUDController',
				method:'saveData',
				async: false,
				success: function(data){ 
					 $.showMessageDialog({type:"info",title:"提示",msg: "运行态数据保存成功！",backdrop:true});
				}
			})
		},
		add:function(e){},
		edit:function(e){},
		del:function(e){
			$.ajax({
                type: "post",
                url: "/iform_web/iform_ctr/bill_ctr/deleteData",
                dataType: "json",
                data: param,
                success: function(c) {
                    $.showMessageDialog({type:"info",title:"提示",msg: "删除成功！",backdrop:true});
                    window.location.href = window.location.href.substring(0,window.location.href.indexOf("?"))
                }
            })
		},
		cancel:function(e){},
		viewadd:addFunc,
		viewdel:delFunc,
		isEditable: ko.observable(true),// viewModel上加页面状态 
		isDisable: ko.observable(true)// viewModel上加页面状态 
	}
	var app = $.createApp();
	try{
		//第三个参数为： 是否执行ko.applyBindings  因为组件加载后会主动执行applyBindings,避免重复绑定，这里参数为false
		app.init(viewModel);
		formula.addFormulaEvent(app,function(){
		});
	}catch(e){
		console.log(e.stack);
	}
	
	
	//编辑态
	//viewModel.isEditable(true);
	viewModel.headform.createEmptyRow();
	viewModel.headform.setRowSelect(0);
	
	var bodyformIds = [];
	
	if(viewctrl['init']){ //初始化明细子表
		viewctrl['init'].call(this,viewModel,bodyformIds);
	}
	
	function addFunc(v,e){
		if(viewctrl['add']){
			viewctrl['add'].call(this,v,e);
		}
	}
	
	function delFunc(v,e){
		if(viewctrl['del']){
			viewctrl['del'].call(this,v,e);
		}
	}
	//浏览态
	var param  = (function () {
		var param = {}
		var search = location.search,
			pk_bo = '';
		if (!search) {
			return ""
		}
		search = search.slice(1).split('&')
		$.each(search, function (i, v){
			if(~v.indexOf('=')){
				var array= v.split('=');
				param[array[0]]=array[1];
			}
		})
		return param;
	})();
	
	
	param.pk_bo = "c0aa9ae1-7d9d-451e-9b30-c10e3badcd2f";
	
	var bpminfo;

	//如果有业务对象实例主键，查询
	if(param.pk_boins){
		$.ajax({
			type: "GET", 
			url: "/iform_web/iform_ctr/bill_ctr/loadData",  
			data:param, 
			dataType: "json" ,
			success: function(result) {
				viewModel.bpminfo = result.bpminfo;
				result.pk_boins = param.pk_boins;
				$.hideLoading();
				clearData(viewModel,bodyformIds);
				var headData = result.head;
				var body = result.body;
				loadHeadData(viewModel,headData);
				loadBodyData(viewModel,body,bodyformIds);
				if(result.bpminfo){
					var datatable = viewModel.headform;
					var processauthinfo="{}";
					var activityid = result.bpminfo.activityid;
					viewModel.authMap = processauthinfo[activityid];
					if(viewModel.authMap){
						for(var i=0;i<viewModel.authMap.length;i++){
							var auth = viewModel.authMap[i];
							var fieldauth = auth["auth"];
							var field = auth["fieldid"];
							if(fieldauth=="2"){
								datatable.setMeta(field, "enable", true);
							}else if(fieldauth=="1"){
								datatable.setMeta(field, "enable", false);
							}else{
								datatable.setMeta(field, "enable", false);
								datatable.setMeta(field, "visible", false);
							}
						}
						
					}
				}

				//加载流程面板
				getApproveInfosNew(param, ".workflowpanel", result.bpminfo,"", "");
			}
			});
			
			var clearData = function(viewModel, bodyformIds){
				viewModel.headform.removeAllRows();
				if(bodyformIds && bodyformIds.length >0){
					for(var index =0; index < bodyformIds.length; index++){
						var bodyFormId = bodyformIds[index];
						var body = viewModel[bodyFormId];
						if(body){
							body.removeAllRows();
						}
					}
				}
			};
			
			var loadHeadData = function(viewModel,headData){
				var row = new $.Row({parent:viewModel.headform});
				setRowValue(row, headData);
				//设置当前的实例pk
				row.data.pk_boins = {};
				row.data.pk_boins.key=param.pk_boins;
				row.data.pk_boins.value=param.pk_boins;
				viewModel.headform.addRow(row);
				viewModel.headform.setRowSelect(0);
				updateHeadRowValue(row,headData, viewModel.headform);
			};
			
			var loadBodyData = function(viewModel,body,bodyformIds){
				if(!body)
					return;
				var bodyDatas = body.bodys;
				if(bodyDatas == undefined)
					return;
				var tabRows = {};
				for (var i=0, count = bodyDatas.length; i < count; i++){
					var bodyData = bodyDatas[i];
					var dataTable = viewModel[bodyData.pk.subFormId];
					if(dataTable == undefined){
						continue;
					}
					var row = new $.Row({parent:dataTable}); 
					//设置当前的实例pk
					row.data.id = {};
					row.data.id.key=bodyData.pk.pk;
					row.data.id.value=bodyData.pk.pk;
					setRowValue(row, bodyData);
					var curTabRows = tabRows[bodyData.pk.subFormId];
					if(curTabRows == null){
						curTabRows = [];
						tabRows[bodyData.pk.subFormId] = curTabRows;
					}
					curTabRows.push(row);
				}
				for(var key in tabRows){
					var dataTable = viewModel[key];
					var curTabRows = tabRows[key];
					dataTable.addRows(curTabRows);
				}
				var pageCount = bodyDatas.length/10 + 1;
			};
			
			var setRowValue = function(row, data){
				for(var field in data){
					if(!row.data[field])
						continue;
					if(data[field].scale != undefined){
						row.setMeta(field,'precision',data[field].scale);
					}
					row.setValue(field, data[field].pk);
					row.setMeta(field, "display", data[field].name);
				}
			};
			
			var updateHeadRowValue = function(row, data, datatable){
				var meta = datatable.meta;
				for(var field in data){
					if(!row.data[field])
						continue;
					var o = meta[field];
					if("Dateinterval" === o.componentKey){
						var value = data[field].pk;
						value = value || "";
						var values = value.split(",");
						var startField = o.startField;
						var endField = o.endField;
						if(row.data[startField]){
							if(row.data[startField].scale != undefined){
								row.setMeta(startField,'precision',values[0]);
							}
							row.setValue(startField, values[0]);
							row.setMeta(startField, "display", values[0]);
						}
						if(row.data[endField] && values.length > 1){
							if(row.data[endField].scale != undefined){
								row.setMeta(endField,'precision',values[1]);
							}
							row.setValue(endField, values[1]);
							row.setMeta(endField, "display", values[1]);
						}
					}
					if(data[field].scale != undefined){
						row.setMeta(field,'precision',data[field].scale);
					}
					row.setValue(field, data[field].pk);
					row.setMeta(field, "display", data[field].name);
				}
			};
			
			$("#bfDelete").css("display","block");
	}

	if(viewctrl['loadColor']){ //明细子表颜色
		//viewctrl['loadColor'].call(this,viewModel);
	}
})
