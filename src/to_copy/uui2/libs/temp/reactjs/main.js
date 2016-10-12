var MainComp = React.createClass({
	getInitialState: function() {
    	return {value:'a'};
  	},
	query: function(p){
		this.value = p
		this.setState({value: 'b'})
	},
	render: function() {
		return React.createElement("div", null, this.value);
	}
});