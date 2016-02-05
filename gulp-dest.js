module.exports = function(RED) {
	var gulp = require('gulp');

	RED.nodes.registerType("gulp dest", function (config) {
		RED.nodes.createNode(this, config);
		var node = this;

		// https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options
		this.on('input', function(msg){
			var path = config.path || msg.path || '';
			var options = config.options || msg.options || {};

			if(!path){
				RED.log.error('gulp dest: path must be set in config or in message');
				return;
			}


			var p = msg.payload.pipe(gulp.dest(path, options));

			node.send({payload:p});
		});
	
	});
}

