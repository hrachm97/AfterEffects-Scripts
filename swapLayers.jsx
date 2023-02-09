var std = app.project.activeItem;

function validateSelection(count) {
   if(std.selectedLayers.length == count) return true;
   else {
      alert("Please select " + count + " layers!");
      return false;
   }
}

var debugState = 0;
function debug(msg) {
   if(debugState) alert(msg);
}

function isAnimated(property) {
   return property.numKeys;
}

function movePosition(from, to) {
   if(isAnimated(to.transform.position)) {
      to.transform.position.selected = true;
      app.executeCommand(21);
      to.selected = false;
   }
   debug(to.name + "'s position cleared!");

   from.transform.position.selected = true;
   if(isAnimated(from.transform.position)) std.time = from.transform.position.keyTime(1);
   app.executeCommand(19);
   from.selected = false;
   debug(from.name + "'s position copied");

   to.transform.position.selected = true;
   app.executeCommand(20);
   to.selected = false;
   debug("pasted to " + to.name);
}

function swapInOuts(layers) {
   var tmpIn = layers[0].inPoint;
   var tmpOut = layers[0].outPoint;
   layers[0].inPoint = layers[1].inPoint;
   layers[0].outPoint = layers[1].outPoint;
   layers[1].inPoint = tmpIn;
   layers[1].outPoint = tmpOut
}

function swapLayers(layers) {
   if(validateSelection(2)) {
      app.beginUndoGroup("Swap layers");

      var time = std.time;
      var starts = [layers[0].startTime, layers[1].startTime]; 
      layers[0].startTime = layers[1].startTime = 0;
      swapInOuts(layers);
      
      layers[0].selected = layers[1].selected = false;
      
      var tmp = layers[0].duplicate();
      movePosition(layers[1], layers[0]);
      movePosition(tmp, layers[1]);
      tmp.remove();
      
      std.time = time;
      layers[0].startTime = starts[1];
      layers[1].startTime = starts[0];

      layers[0].selected = layers[1].selected = true;

      app.endUndoGroup();
   }
}

swapLayers(std.selectedLayers);
