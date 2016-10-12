var QueryComp = React.createClass({
	getInitialState: function() {
		return {
			value: 'a'
		};
	},
	handleChange: function(event) {
		this.setState({
			value: event.target.value
		})
	},
	btnClick: function(){
		//此处应实现event.js类似的事件机制
		window.main.query(this.getDOMNode().value)
	}
	,
	render: function() {
		return React.createElement("input", {defaultValue:this.props.data}, React.createElement("button",{onClick:this.btnClick}, "query"));
	}
});