var std = app.project.activeItem;

var count = 0;

function setDuration(layer, outPointAdjust) {
   if(layer.source instanceof CompItem){
      if(layer.source.duration != std.duration) {
         layer.source.duration = std.duration;
         count++;
      }
      if(outPointAdjust) layer.outPoint = layer.startTime + layer.source.duration;
      for(var i = 1; i <= layer.source.numLayers; i++) {
         setDuration(layer.source.layer(i), outPointAdjust);
      }
   }
}

app.beginUndoGroup("adjusting frame rates");


for(i = 0; i < std.selectedLayers.length; i++) {
   setDuration(std.selectedLayers[i], true);
}
alert(count + " comp fps have been adjusted");

app.endUndoGroup();