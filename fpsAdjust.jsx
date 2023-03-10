var std = app.project.activeItem;

var count = 0;

function setFrameRate(layer) {
   if(layer.source instanceof CompItem){
      if(layer.source.frameRate != std.frameRate) {
         layer.source.frameRate = std.frameRate;
         count++;
      }
      for(var i = 1; i <= layer.source.numLayers; i++) {
         setFrameRate(layer.source.layer(i));
      }
   }
}

app.beginUndoGroup("adjusting frame rates");

for(var i = 0; i < std.selectedLayers.length; i++) {
   setFrameRate(std.selectedLayers[i]);
}
alert(count + " comp fps have been adjusted");

app.endUndoGroup();