module.exports = function(RED) {
	var gulp = require('gulp');
  var fs = require('fs');

  var _loaded_plugins = {};
  var plugin_exclude = ['gulp-util']; // exclude core components

  // load modules
  var plugin_name_arr = [];
  var files = fs.readdirSync('node_modules');	// here located node module (by default)
  for(var i=0; i<=files.length-1; i++){
      if(files[i].match(/^gulp\-/) && plugin_exclude.indexOf(files[i])<0 ){
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
			var options = config.options && JSON.parse(config.options) || msg.options || {};

			// check plugin 
			if( plugin_name && _loaded_plugins[plugin_name] ){
				var plugin = _loaded_plugins[plugin_name];
				
				var p = msg.payload.pipe( plugin(arg1, options) ); // TODO: use apply and beautifull gui for filling data :)
				node.send({payload:p});
			}else{
				RED.log.warn('gulp pipe: unknown plugin: '+plugin_name+'. it will be skipped');
				node.send(msg);
			}
			
		});
	
	});
}

