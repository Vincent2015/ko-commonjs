define(['text!libs/comps/button/button.html','css!libs/comps/button/button.css' ],function(template) {
	var d = document.createElement('DIV');
	d.innerHTML = template;
	d.style.display = 'none';
	document.body.appendChild(d);
})