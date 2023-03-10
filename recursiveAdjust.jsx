var std = app.project.activeItem;

var count = 0;

function setDuration(layer, outPointAdjust) {
   if(layer.source instanceof CompItem){
      if(layer.source.duration != std.duration) {
         layer.source.duration = std.duration;
         count++;
         for(var i = 1; i <= layer.source.numLayers; i++) {
            setDuration(layer.source.layer(i), outPointAdjust);
         }
      }
      if(outPointAdjust) layer.outPoint = layer.startTime + layer.source.duration;
   } else {
      if(outPointAdjust) layer.outPoint = std.duration;
   }
}

app.beginUndoGroup("adjusting durations");


for(i = 0; i < std.selectedLayers.length; i++) {
   setDuration(std.selectedLayers[i], true);
}

alert(count + " comp duration have been adjusted");

app.endUndoGroup();