var project_create = require('./project_create');
 var projectModel = {
	 projectDT: new u.DataTable({
		meta:{
			name: {type: 'string'},
			'master.id':{},
			'master.name':{},
			description: {type: 'string'},
			startdate: {type: 'string'},
			enddate: {type: 'string'},			
			partners:{type:'child' ,meta:{
				id:{},
				name:{}
			}},
			sharers:{type:'child' ,meta:{
				id:{},
				name:{}
			}},
			
		}
	}),
	 delFunc: function(index){
	 	var dt = this.parent;
	 	dt.removeRow(index);
	 	project_create.saveproject();
	 	// $(event.currentTarget).parent().remove()
	 }
};
module.exports = projectModel;