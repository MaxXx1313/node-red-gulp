module.exports = function(RED) {
	var gulp = require('gulp');
  var fs = require('fs');

  var _loaded_plugins = {};

  // load modules
  var plugin_name_arr = [];
  var files = fs.readdirSync('node_modules');
  for(var i=0; i<=files.length-1; i++){
      if(files[i].match(/^gulp\-/)){
          load_gulp_plugin(files[i]);
      }
  }

  function load_gulp_plugin(name){
			RED.log.info('Loading gulp module: '+name );
      _loaded_plugins[name] = require(name);
      plugin_name_arr.push(name);
  }

  //console.log('gulp_modules', gulp_modules);
	RED.comms.publish("gulp_pipe_list", plugin_name_arr, true);

	/**
	 *
	 */
	RED.nodes.registerType("gulp pipe", function (config) {
		RED.nodes.createNode(this, config);
		var node = this;

		this.on('input', function(msg){

			var plugin_name = config.plugin;
			var arg1 = config.arg1;

			
			if( plugin_name && _loaded_plugins[plugin_name] ){
				var plugin = _loaded_plugins[plugin_name];
				
				var p = msg.payload.pipe( plugin(arg1) );
				node.send({payload:p});
			}else{
				RED.log.warn('gulp pipe: unknown plugin. it will be skipped');
				node.send(msg);
			}
			
		});
	
	});
}

