var std = app.project.activeItem;

function validateSelection(count) {
   if(std.selectedLayers.length == count) return true;
   else {
      alert("Please select " + count + " layers!");
      return false;
   }
}

function validateLayers(layers, count) {
   if(validateSelection(count)) {
      if(layers[0].source && layers[1].source) return 1;
      if(layers[0].content != undefined && layers[1].content != undefined) return 2;
   }
   return 0;
}

var debugState = 0;
function debug(msg) {
   if(debugState) alert(msg);
}

function swapLayers(layers) {
   if(validateSelection(2)) {
      app.beginUndoGroup("Swap layers");

      var time = std.time;
      std.time = 0;

      var ins = [layers[0].inPoint, layers[1].inPoint];
      var outs = [layers[0].outPoint, layers[1].outPoint];
      layers[0].inPoint = layers[1].inPoint = 0;

      var helperKeys = [false, false];

      var isAnimated = [layers[0].transform.position.numKeys, layers[1].transform.position.numKeys];

      if(isAnimated[0] && layers[0].transform.position.keyTime(1) > 0) {
         helperKeys[0] = layers[0].transform.position.addKey(0);
         debug(layers[0].name + "has no keyframe at time 0 so one added");
      }
      if(isAnimated[1] && layers[1].transform.position.keyTime(1) > 0) {
         helperKeys[1] = layers[1].transform.position.addKey(0);
         debug(layers[1].name + "has no keyframe at time 0 so one added");
      }

      var tmp = layers[0].duplicate();
      debug(tmp.name + " duplicated");

      layers[0].selected = layers[1].selected = false;

      if(isAnimated[0]) {
         layers[0].transform.position.selected = true;
         app.executeCommand(21);
         layers[0].selected = false;
         debug(layers[0].name + "'s position cleared!");
      }

      layers[1].transform.position.selected = true;
      app.executeCommand(19);
      layers[1].selected = false;
      debug(layers[1].name + "'s position copied");
      
      layers[0].transform.position.selected = true;
      app.executeCommand(20);
      layers[0].selected = false;
      debug("pasted to " + layers[0].name);

      tmp.transform.position.selected = true;
      app.executeCommand(19);
      tmp.selected = false;
      debug(tmp.name + "'s position copied");

      if(isAnimated[1]) {
         layers[1].transform.position.selected = true;
         app.executeCommand(21);
         layers[1].selected = false;
         debug(layers[1].name + "'s position cleared!");
      }

      layers[1].transform.position.selected = true;
      app.executeCommand(20);
      layers[1].selected = false;
      debug("pasted to " + layers[1].name);

      tmp.remove();
      debug(layers[1].name + "removed");
      std.time = time;
      layers[0].inPoint = ins[1];
      layers[1].inPoint = ins[0];

      if(helperKeys[0]) layers[1].transform.position.removeKey(helperKeys[0]);
      if(helperKeys[1]) layers[0].transform.position.removeKey(helperKeys[1]);

      layers[0].selected = layers[1].selected = true;

      app.endUndoGroup();
   }
}

swapLayers(std.selectedLayers);
//var a = std.selectedLayers[0].transform.position.addKey(0);
//std.selectedLayers[0].transform.position.removeKey(a);
//alert(std.selectedLayers[0].transform.position.keyTime(2))

//std.time = 0;
