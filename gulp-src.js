module.exports = function(RED) {
	var gulp = require('gulp');

	RED.nodes.registerType("gulp src", function (config) {
		RED.nodes.createNode(this, config);
		var node = this;

		// https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options
		this.on('input', function(msg){

			var globs = config.globs || msg.globs || '';
			var options = config.options || msg.options || {};

			if(!globs){
				RED.log.error('gulp src: glob must be set in config or in message');
				return;
			}

			var g = gulp.src(globs, options);

			node.send({payload:g});
		});
	
	});
}

