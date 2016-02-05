module.exports = function(RED) {
	var gulp = require('gulp');

	RED.nodes.registerType("gulp watch", function (config) {
		RED.nodes.createNode(this, config);
		var node = this;

		// https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob--opts-tasks-or-gulpwatchglob--opts-cb
		var globs = config.globs || '';
		var options = config.options || {};

		if(!globs){
			RED.log.error('gulp watch: glob must be set');
			return;
		}

		gulp.watch(globs, options, function(e){
			console.log('File ' + e.path + ' was ' + e.type + ', running tasks...');
			
			node.send({	payload:{globs:globs, event:e}});

		});
	
	});
}

