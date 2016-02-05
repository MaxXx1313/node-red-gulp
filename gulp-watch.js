module.exports = function(RED) {
	var gulp = require('gulp');

	RED.nodes.registerType("gulp watch", function (config) {
		RED.nodes.createNode(this, config);
		var node = this;

		// https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob--opts-tasks-or-gulpwatchglob--opts-cb
		var globs = config.globs || '';
		var options = config.options && JSON.parse(config.options) || {};

		if(!globs){
			RED.log.error('gulp watch: glob must be set');
			return;
		}

		gulp.watch(globs, options, function(e){
			RED.log.trace('File ' + e.path + ' was ' + e.type );

			notifyChanges(e.type);			
			node.send({	globs:globs, event:e});
		});

		//
		var _timer = null;		
		function notifyChanges(text){
			node.status({fill:"yellow", shape:"dot", text:text});

			if(_timer) clearTimeout(_timer);
			_timer = setTimeout(_onTick, 1000);
		}

		function _onTick(){
			_timer = null;
			node.status({fill:"green",shape:"ring",text:"Watching..."});
		}
		_onTick();
	
	});
}

