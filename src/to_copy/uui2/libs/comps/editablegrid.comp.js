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

		ko.bindingHandlers.editablegrid = {
			init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
				var ele = $(element)
				var ctrl = valueAccessor()
				
				function handler_saveItem(o){
					var allValidates = true;
					for(var x in context.bodyformValidates){
						allValidates = allValidates && context.bodyformValidates[x].check();
					}
					if(!allValidates){
						return false;
					}
					
					var dfd = viewModel.aggDs.body.validateCurrentRow();
					$.when(dfd).done(function(){
							viewModel.aggDs.body.commit();
							if(ctrl["afterSaveItem"]){
								ctrl["afterSaveItem"].call(this);
							}
							viewModel.aggDs.body.createRecord();
					})
				}
				
				function handler_saveUadateGridBody(o){
					var allValidates = true;
					for(var x in context.bodyformValidates){
						allValidates = allValidates && context.bodyformValidates[x].check();
					}
					if(!allValidates){
						return false;
					}
					hideBodyEditor(o);
					//点击保存按钮后，设置当前行的修改状态为'cmt'
					viewModel.aggDs.body.currentRecord().state = 'cmt';
					if(ctrl["afterUpdateItem"]){
						ctrl["afterUpdateItem"].call(this);
					}
					
					//保存修改后，设置最后一行空白行为选中行，以便清空编辑表单上的编辑数据
					setLastRowSelected();
				}
				
				function handler_saveUadateGridBody(o){
					var allValidates = true;
					for(var x in context.bodyformValidates){
						allValidates = allValidates && context.bodyformValidates[x].check();
					}
					if(!allValidates){
						return false;
					}
					hideBodyEditor(o);
					//点击保存按钮后，设置当前行的修改状态为'cmt'
					viewModel.aggDs.body.currentRecord().state = 'cmt';
					if(ctrl["afterUpdateItem"]){
						ctrl["afterUpdateItem"].call(this);
					}
					
					//保存修改后，设置最后一行空白行为选中行，以便清空编辑表单上的编辑数据
					setLastRowSelected();
				}
				
				function handler_cacelUpdateGridBody(o){
					hideBodyEditor(o);
					
					//取消修改后，设置最后一行空白行为选中行，以便清空编辑表单上的编辑数据
					setLastRowSelected();
					
					//删除dataset因增加、复制行而添加的record
					$(o).closest('table').find('tbody tr:hidden:not(:last)').each(function() {
						viewModel.aggDs.body.deleteRecordsByIndex($(this).attr('index'));
					});
				}
				
				function handler_saveUadateFullGridBody(o){
					var currentTR = $(o).closest("tr")[0];
					hideBodyEditor(o);
					$(currentTR).hide();
					
					//点击保存按钮后，设置当前行的修改状态为'cmt'
					viewModel.aggDs.body.currentRecord().state = 'cmt';
					if(ctrl["afterUpdateFullItem"]){
						ctrl["afterUpdateFullItem"].call(this);
					}
					
					//保存修改后，设置最后一行空白行为选中行，以便清空编辑表单上的编辑数据
					setLastRowSelected();
				}


				function handler_cacelUadateFullGridBody(o){
					var currentTR = $(o).closest("tr")[0];
					hideBodyEditor(o);
					$(currentTR).hide();
					
					//取消修改后，设置最后一行空白行为选中行，以便清空编辑表单上的编辑数据
					setLastRowSelected();
				}
				
				function handler_add(o){
					var index = parseInt(o.getAttribute("index"));
					viewModel.aggDs.body.createRecord(index+1);
					showBodyEditor(o);
				}
				
				//因为靠”隐藏被选中行”的功能，可能导致编辑缩略或详细图的行时，导致同时隐藏2种图中的行。
				//此处可能需要控制“缩略图”和“详细图”的切换可用性问题。
				function handler_edit(o){
					var tf = $(o).closest("table").find("tfoot");
					var trInFoot = $(o).closest("table").find("tfoot").children("tr")[0];
					//判断tfoot中的children是否是编辑器.
					//如果是编辑器,则调换当前行和编辑器
					$(trInFoot).show();
					if(trInFoot){
						showBodyEditor(o);
						var index = (o.getAttribute("index"));
						viewModel.aggDs.body.setRecordsSelect(index);
					}else{
						//如果不是编辑器，即当前已经处于表体行编辑状态
						var state = viewModel.aggDs.body.currentRecord().state;
						if(state === 'new'){
							viewModel.aggDs.body.currentRecord().state = 'cmt';		
						}
						
						//调换tbody中的编辑器和tfoot众的行.
						var tb = $(o).closest("tbody")[0];
						var editorTr = $(tb).find("tr[editor='true']")[0];
						tb.removeChild(editorTr);
						tf[0].appendChild(editorTr);
						//然后重新执行handler_edit
						handler_edit(o);
					}
				}
				
				function handler_copy(o){
					//TODO　复制后保存算成功复制，复制后取消算失败复制
					var tf = $(o).closest("table").find("tfoot");
					var trInFoot = $(o).closest("table").find("tfoot").children("tr")[0];
					$(trInFoot).show();
					//判断tfoot中的children是否是编辑器.
					//如果是编辑器,则调换当前行和编辑器
					if(trInFoot){
						var index = (o.getAttribute("index"));
						var insertR = viewModel.aggDs.body.getRecord(index);
						var newRecord = viewModel.aggDs.body.copyRecord(insertR);
						showBodyEditor(o);
						if(ctrl["afterCopy"]){
							ctrl["afterCopy"].call(this,newRecord, insertR);
						}
						
					}else{
						//如果不是编辑器，即当前已经处于表体行编辑状态
						var state = viewModel.aggDs.body.currentRecord().state;
						if(state === 'new'){
							viewModel.aggDs.body.currentRecord().state = 'cmt';		
						}
						//调换tbody中的编辑器和tfoot众的行.
						var tb = $(o).closest("tbody")[0];
						var editorTr = $(tb).find("tr[editor='true']")[0];
						tb.removeChild(editorTr);
						tf[0].appendChild(editorTr);
						//然后重新执行handler_copy
						handler_copy(o);
					}
				}
				
				function handler_remove(o){
					var index = (o.getAttribute("index"));
					viewModel.aggDs.body.deleteRecordsByIndex(index);
					if(ctrl["afterRemoveItem"]){
						ctrl["afterRemoveItem"].call(this);
					}
				}

				$(document).on('click', '[data-action="handler_saveItem"]', function(e) {
					handler_saveItem($(this)[0])
				})
				
				$(document).on('click', '[data-action="handler_saveUadateGridBody"]', function(e) {
					handler_saveUadateGridBody($(this)[0])
				})
				
				$(document).on('click', '[data-action="handler_cacelUpdateGridBody"]', function(e) {
					handler_cacelUpdateGridBody($(this)[0])
				})
				
				$(document).on('click', '[data-action="handler_saveUadateFullGridBody"]', function(e) {
					handler_saveUadateFullGridBody($(this)[0])
				})
				
				$(document).on('click', '[data-action="handler_cacelUadateFullGridBody"]', function(e) {
					handler_cacelUadateFullGridBody($(this)[0])
				})
				
				
				
				$(document).on('click', '[data-action="handler_add"]', function(e) {
					handler_add($(this)[0])
				})	

				$(document).on('click', '[data-action="handler_edit"]', function(e) {
					handler_edit($(this)[0])
				})
				
				$(document).on('click', '[data-action="handler_copy"]', function(e) {
					handler_copy($(this)[0])
				})
				
				$(document).on('click', '[data-action="handler_remove"]', function(e) {
					handler_remove($(this)[0])
				})
				
				
				//进入行编辑状态，在表中打开行编辑器
				function showBodyEditor(o){
					var currentTR = $(o).closest("tr")[0];
					var tf = $(o).closest("table").find("tfoot");
					var trInFoot = $(o).closest("table").find("tfoot").children("tr")[0];
					tf[0].removeChild(trInFoot);
					$(trInFoot).insertAfter($(currentTR));
					$(trInFoot).find("#body_add_action").hide();
					$(trInFoot).find("#body_edit_action").show();
				}
				
				//进入行增加状态，在表下面打开行增加编辑器
				function hideBodyEditor(o){
					var tb = $(o).closest("tbody");
					var currentTR = $(o).closest("tr")[0];
					var tf = $(o).closest("table").find("tfoot");
					//将表单所在行从tbody中转移到tfoot中
					tb[0].removeChild(currentTR);
					tf[0].appendChild(currentTR);
					//表体编辑表单中的按钮可见性控制
					$(currentTR).find("#body_add_action").show();
					$(currentTR).find("#body_edit_action").hide();
				}
				
				function setLastRowSelected(){
					var index = viewModel.aggDs.body.records().length - 1; 
					viewModel.aggDs.body.setRecordsSelect(index);
				}
				
				
				
				
			}
		};


	}
)