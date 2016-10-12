 var taskcreate = require('./project_task_create');
 var taskModel = {
	taskDT: new u.DataTable({
		meta:{
			name: {type: 'string'},
			description: {type: 'string'},
			planStartdate: {type: 'string'},
			planEnddate: {type: 'string'},
			priority: {type: 'string'},
			executorList:{type:'child' ,meta:{
				id:{},
				name:{}
			}},
			executors:{type:'child'},
			executorIdList:{type:'child'}		
		}
	}),
	 delFunc: function(index,row,event){
	 	var dt = this.parent;
	 	dt.removeRow(index);
	 	$(event.currentTarget).parent().remove();
	 	taskcreate.savetask();
	 }
};
         
module.exports = taskModel;