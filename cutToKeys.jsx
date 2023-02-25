var std = app.project.activeItem;

function cutToKeys(layer) {
   var firstKeyTime = 10000;
   var lastKeyTime = -10000;
   for(var i = 1; i <= layer.numProperties; i++) {
      for(var j = 1; j <= layer.property(i).numProperties; j++) {
         var prop = layer.property(i).property(j);
         if(prop.numKeys){
            if(prop.keyTime(1) < firstKeyTime) {
               firstKeyTime = prop.keyTime(1);
            }
            if(prop.keyTime(prop.numKeys) > lastKeyTime) {
               lastKeyTime = prop.keyTime(prop.numKeys);
            }
         }
      }
   }
   layer.inPoint = firstKeyTime;
   layer.outPoint = lastKeyTime;
}

var layers = [];

for (i = 0; i < std.selectedLayers.length; i++) {
   layers.push(std.selectedLayers[i]);
   //alert(layers.length);
}

for(var k = 0; k < layers.length; k++) {
   cutToKeys(layers[k]);
}