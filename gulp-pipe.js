module.exports = function(RED) {
	var gulp = require('gulp');
  var fs = require('fs');

  var _loaded_modules = {};

  // load modules
  var gulp_modules = [];
  var files = fs.readdirSync('node_modules');
  for(var i=0; i<=files.length-1; i++){
      if(files[i].match(/^gulp\-/)){
          load_gulp_module(files[i]);
      }
  }

  function load_gulp_module(name){
      console.log('Loadding gulp module: %s', name);
      _loaded_modules[name] = require(name);
      gulp_modules.push(name);
  }

  //console.log('gulp_modules', gulp_modules);
	RED.comms.publish("gulp_pipe_list", gulp_modules, true);

	/**
	 *
	 */
	RED.nodes.registerType("gulp pipe", function (config) {
		RED.nodes.createNode(this, config);
		var node = this;

		this.on('input', function(msg){

			var module_name = config.module;
			var arg1 = config.arg1;
			
			if( module_name && _loaded_modules[module_name] ){
				var module = _loaded_modules[module_name];
				
				var p = msg.payload.pipe( module(arg1) );
				node.send({payload:p});
			}else{
				// error
				console.log('ERROR');
			}
			
		});
	
	});
}

