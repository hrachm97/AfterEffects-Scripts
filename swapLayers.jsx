var std = app.project.activeItem;

function validateSelect(count){
   if (std.selectedLayers.length == count) return true;
   else {
      alert("Please select two layers!");
      return false;
   }
}

function swapLayers(layers){
  if(!validateSelect(2)) return;
  
  app.beginUndoGroup("Swap layers");

  var tmp = layers[0].source;
  layers[0].replaceSource(layers[1].source, true);
  layers[1].replaceSource(tmp, true);

  app.endUndoGroup();
}

swapLayers(std.selectedLayers);
