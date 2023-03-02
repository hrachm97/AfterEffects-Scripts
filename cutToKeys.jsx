var std = app.project.activeItem;

function relEqual(a,b, relativityAmount) {
   if(relativityAmount === undefined) relativityAmount = std.frameDuration*2;
   //alert(a + ", " + b);
   return Math.abs(a - b) <= relativityAmount;
}

function equal(arr1, arr2) {
   if(arr1.length === undefined) return relEqual(arr1, arr2);
   // If the arrays have different lengths, they are not equal
   if (arr1.length !== arr2.length) {
      $.writeln("Arrays have different lengths: " + arr1.length + " and " + arr2.length);
      return false;
   }

   // Iterate over each element in the arrays
   for (var i = 0; i < arr1.length; i++) {
      val1 = arr1[i];
      val2 = arr2[i];

      //recursively compare them
      if (val1.length !== undefined && val2.length !== undefined) {
         if (!equal(val1, val2)) {
            return false;
         }
      }
      // Otherwise, compare the values directly
      else if (!relEqual(val1, val2)) {
         $.writeln("Arrays are not equal at index " + i + ": " + val1 + " and " + val2);
         return false;
      }
   }

   // If all elements are equal, the arrays are equal
   return true;
}

function getSetAnimatedSections(prop) {
   var animatedTimes = [];
   var inPerod = false;
   var prevValue = prop.valueAtTime(prop.keyTime(1).toFixed(3), true);
   //alert(prop.name);
   for(var k = 2; k <= prop.numKeys; k++) {
      if(inPerod) {
         if(equal(prop.valueAtTime(prop.keyTime(k).toFixed(3), true), prevValue)) {
            animatedTimes.push([prop.keyTime(k - 1).toFixed(3), -1]);
            inPerod = false;
            if(k === prop.numKeys) prop.removeKey(k);
         } else {
            prevValue = prop.valueAtTime(prop.keyTime(k).toFixed(3), true);
            if(k === prop.numKeys) animatedTimes.push([prop.keyTime(k).toFixed(3), -1]);
         }
      } else {
         // alert(prop.valueAtTime(prop.keyTime(k).toFixed(3), true));
         // alert(prevValue);
         if(equal(prop.valueAtTime(prop.keyTime(k).toFixed(3), true), prevValue)) {
            prop.removeKey(k - 1);
            k--;
         } else {
            //std.time = prop.keyTime(k - 1);
            //alert("inPerod");
            //alert(String(prevValue) + ',' + String(prop.valueAtTime(prop.keyTime(k).toFixed(3), true)));
            animatedTimes.push([prop.keyTime(k - 1).toFixed(3), 1]);
            prevValue = prop.valueAtTime(prop.keyTime(k).toFixed(3), true);
            inPerod = true;
            if(k === prop.numKeys) animatedTimes.push([prop.keyTime(k).toFixed(3), -1]);
         }
      }
   }
   //alert(animatedTimes);
   return animatedTimes;
}

function unionAnims(arr) {
   var unionArr = [];
   var stack = 0;
   arr = arr.sort(function(a, b) {
      return a[0] - b[0];
   });
   for(b = 0; b < arr.length; b++) {
      if(stack === 0) unionArr.push(arr[b]);
      stack += arr[b][1];
      if(stack === 0) unionArr.push(arr[b]);
   }
   return unionArr;
}

function rmvKeysOut(layer) {
   if(layer === undefined) return false;
   for(var i = 1; i <= layer.numProperties; i++) {
      for(var j = 1; j <= layer.property(i).numProperties; j++) {
         var prop = layer.property(i).property(j);
         if(prop.numKeys) {
            for(var z = 1; z <= prop.numKeys; z++) {
               if(prop.keyTime(z) < layer.inPoint - std.frameDuration/8) {
                  prop.removeKey(z);
                  z--;
               } else break;
            }
            for(var z = prop.numKeys; z >= 1; z--) {
               if(prop.keyTime(z) > layer.outPoint + std.frameDuration/8) {
                  prop.removeKey(z);
               } else break;
            }
         }
      }
   }
   return true;
}

function cutToKeys(layer) {
   var allAnims = [];
   for(var i = 1; i <= layer.numProperties; i++) {
      for(var j = 1; j <= layer.property(i).numProperties; j++) {
         var prop = layer.property(i).property(j);
         if(prop.numKeys) {
            var propAnims = getSetAnimatedSections(prop);
            for(z = 0; z < propAnims.length; z++) {
               if(propAnims[z + 1]) {
                  if(propAnims[z][0] <= 0 && propAnims[z + 1][0] <= 0) {
                     z++;
                     continue;
                  }
                  else if(propAnims[z][0] * propAnims[z + 1][0] < 0) {
                  //if one is negative and the other not 
                     prop.addKey(0);
                     prop.removeKey(prop.nearestKeyIndex(propAnims[z][0]));
                     propAnims[z][0] = 0;
                  }
               }
               allAnims.push(propAnims[z]);
            }
         }
      }
   }
   var unionSections = unionAnims(allAnims);

   var finalLayers = [];

   for(var i = 0; i < unionSections.length; i += 2) {
      if(i) layer = layer.duplicate();
      finalLayers.push(layer);
      layer.inPoint = unionSections[i][0];
      layer.outPoint = unionSections[i + 1][0];
   }

   for(var i = 0; i < finalLayers.length; i++) rmvKeysOut(finalLayers[i]);
}

var layers = [];

for(i = 0; i < std.selectedLayers.length; i++) {
   layers.push(std.selectedLayers[i]);
}

app.beginUndoGroup("cut to keys");

for(var a = 0; a < layers.length; a++) {
   cutToKeys(layers[a]);
   //rmvKeysOut(layers[a]);
}

app.endUndoGroup();