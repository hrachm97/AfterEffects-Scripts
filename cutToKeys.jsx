var std = app.project.activeItem;

function debug(msg) {
   alert(msg);
}

function getAnimatedSections(prop) {
   var animatedTimes = [];
   var inPerod = false;
   var prevValue = prop.valueAtTime(prop.keyTime(1).toFixed(3), true);
   //alert(prop.name);
   for(var k = 2; k <= prop.numKeys; k++) {
      if(inPerod) {
         if(JSON.stringify(prop.valueAtTime(prop.keyTime(k).toFixed(3), true)) === JSON.stringify(prevValue)) {
            animatedTimes.push([prop.keyTime(k - 1).toFixed(3), -1]);
            inPerod = false;
         } else {
            prevValue = prop.valueAtTime(prop.keyTime(k).toFixed(3), true);
            if(k === prop.numKeys) animatedTimes.push([prop.keyTime(k).toFixed(3), -1]);
         }
      } else {
         if(JSON.stringify(prop.valueAtTime(prop.keyTime(k).toFixed(3), true)) !== JSON.stringify(prevValue)) {
            animatedTimes.push([prop.keyTime(k - 1).toFixed(3), 1]);
            prevValue = prop.valueAtTime(prop.keyTime(k).toFixed(3), true);
            inPerod = true;
            if(k === prop.numKeys) animatedTimes.push([prop.keyTime(k).toFixed(3), -1]);
         }
      }
   }
   return animatedTimes;
}

function unionAnims(arr) {
   var unionArr = [];
   var stack = 0;
   for(b = 0; b < arr.length; b++) {
      if(stack === 0) unionArr.push(arr[b]);
      stack += arr[b][1];
      if(stack === 0) unionArr.push(arr[b]);
   }
   return unionArr;
}

function cutToKeys(layer) {
   var allAnims = [];
   for(var i = 1; i <= layer.numProperties; i++) {
      for(var j = 1; j <= layer.property(i).numProperties; j++) {
         var prop = layer.property(i).property(j);
         if(prop.numKeys) {
            var propAnims = getAnimatedSections(prop);
            for(z = 0; z < propAnims.length; z++) {
               allAnims.push(propAnims[z]);
            }
         }
      }
   }
   var unionSections = unionAnims(allAnims.sort(function(a, b) {
      return a[0] - b[0];
   }));

   var count = 0;
   for(i = 0; i < unionSections.length; i += 2) {
      if(count) layer = layer.duplicate();
      layer.inPoint = unionSections[i][0];
      layer.outPoint = unionSections[i + 1][0];
      count++;
   }
}

var layers = [];

for(i = 0; i < std.selectedLayers.length; i++) {
   layers.push(std.selectedLayers[i]);
}

app.beginUndoGroup("cut to keys");

for(var a = 0; a < layers.length; a++) {
   cutToKeys(layers[a]);
}

app.endUndoGroup();