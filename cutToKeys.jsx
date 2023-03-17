//git test from mac

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

function cmp(a, b, relativityAmount) {
   if(relativityAmount === undefined) relativityAmount = std.frameDuration/2;
   if(Math.abs(a - b) > relativityAmount) return a - b;
   else return 0;
}

if (!Array.prototype.forEach) {
   Array.prototype.forEach = function (callback, thisArg) {
     var array = this;
     for (var i = 0; i < array.length; i++) {
       callback.call(thisArg, array[i], i, array);
     }
   };
}

function nearestKeyIndex(prop, time, orient) {
   var index = prop.nearestKeyIndex(time);
   
   if (cmp(prop.keyTime(index), time) > 0) {
      if(orient === 1) return index;
      if(index > 1 && orient === -1) return index - 1;
   } else if (cmp(prop.keyTime(index), time) < 0) {
      if(orient === -1) return index;
      if(index < prop.numKeys && orient === 1) return index + 1;
   }
   return 0;
}

function rmvKeysOut(prop, start, end, cutInOut) {
   function cutIn() {
      for(var z = 2; z <= prop.numKeys; z++) {
         if(cmp(prop.keyTime(z), start) <= 0) {
            prop.removeKey(--z);
         } else break;
      }
   }
   function cutOut() {
      for(var z = prop.numKeys - 1; z >= 1; z--) {
         if(prop.keyTime(z) > end) {
            prop.removeKey(z + 1);
         } else break;
      }
   }

   if(cutInOut === false) {
      cutIn();
   } else if (cutInOut === true) {
      cutOut();
   }  else if(cutInOut === undefined) {
      cutIn();
      cutOut();
   }
}

function startEndResolve(prop, layer, cutInOut, keysIn) {
   var startCut, endCut;
   if (layer) {
      startCut = layer.inPoint;
      endCut = layer.outPoint;
   } else {
      startCut = 0;
      endCut = std.duration;
   }

   rmvKeysOut(prop, startCut, endCut, cutInOut);

   if(cutInOut === false || cutInOut === undefined && keysIn) {
      var inIndex = prop.nearestKeyIndex(startCut);
      if (cmp(prop.keyTime(inIndex), startCut) > 0 && inIndex > 1) inIndex--;
      if (cmp(prop.keyTime(inIndex), startCut) < 0 && inIndex < prop.numKeys) {
         prop.addKey(startCut);
         prop.removeKey(inIndex);
      }
   }
   if(cutInOut === true || cutInOut === undefined && keysIn){
      var outIndex = prop.nearestKeyIndex(endCut);
      if (cmp(prop.keyTime(outIndex), endCut) < 0 && outIndex < prop.numKeys) outIndex++;
      if (cmp(prop.keyTime(outIndex), endCut) > 0 && outIndex > 1) {
         prop.addKey(endCut);
         prop.removeKey(++outIndex);
      }
   }
}

function getOptAnimatedSections(prop, layer, cutInOut, keysIn) {
   
   //s keys and logs animated section starts and ends
   var animatedTimes = [];
   
   startEndResolve(prop, layer, cutInOut, keysIn);
   if(prop.numKeys === 0) return animatedTimes;

   var inPerod = false;
   var prevValue = prop.valueAtTime(prop.keyTime(1).toFixed(3), true);
   //alert(prop.name);

   function startAnim(k) {
      if(inPerod) alert("Error: animation is already started!");
      animatedTimes.push([prop.keyTime(k - 1).toFixed(3), 1]);
      inPerod = true;
      prevValue = prop.valueAtTime(prop.keyTime(k).toFixed(3), true);
   }
   function endAnim(k) {
      if(!inPerod) alert("Error: animation must have been started to end!");
      animatedTimes.push([prop.keyTime(k - 1).toFixed(3), -1]);
      inPerod = false;
      if(k === prop.numKeys) prop.removeKey(k);
   }

   for(var k = 2; k <= prop.numKeys; k++) {
      if (inPerod) {
         if(equal(prop.valueAtTime(prop.keyTime(k).toFixed(3), true), prevValue)) {
            endAnim(k);
         } else {
            prevValue = prop.valueAtTime(prop.keyTime(k).toFixed(3), true);
            if(k === prop.numKeys) animatedTimes.push([prop.keyTime(k).toFixed(3), -1]);
         }
      } else {
         if(equal(prop.valueAtTime(prop.keyTime(k).toFixed(3), true), prevValue)) {
            prop.removeKey(--k);
            if(k === prop.numKeys) prop.removeKey(k);
         } else {
            startAnim(k);
            if(k === prop.numKeys) endAnim(k + 1);
         }
      }
   }
   if(prop.numKeys === 1) prop.removeKey(1);
   return animatedTimes;
}

function loopProps(layer, cutInOut, trimAnim) {
   for(var i = 1; i <= layer.numProperties; i++) {
      for(var j = 1; j <= layer.property(i).numProperties; j++) {
         var prop = layer.property(i).property(j);
         if(prop.numKeys) getOptAnimatedSections(prop, layer, cutInOut, trimAnim);
      }
   }
}

function collectAnims(layer) {
   var allAnims = [];
   for(var i = 1; i <= layer.numProperties; i++) {
      for(var j = 1; j <= layer.property(i).numProperties; j++) {
         var prop = layer.property(i).property(j);
         if(prop.numKeys) {
            var animatedSections = getOptAnimatedSections(prop, layer);
            for(var c = 0; c < animatedSections.length; c++) allAnims.push(animatedSections[c]);
         }
      }
   }
   return allAnims;
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


function cutToKeys(layer) {
   if(layer instanceof AVLayer === false) return 0;
   var unionSections = unionAnims(collectAnims(layer));

   var finalLayers = [];

   for(var i = 0; i < unionSections.length; i += 2) {
      if(i) layer = layer.duplicate();
      finalLayers.push(layer);
      layer.inPoint = unionSections[i][0];
      layer.outPoint = unionSections[i + 1][0];
      //loopProps(layer);
   }
   return finalLayers;

   //for(var i = 0; i < finalLayers.length; i++) rmvKeysOut(finalLayers[i]);
}


function cut(layer, trimKeys) {
   if(layer.inPoint >= std.time || layer.outPoint <= std.time) return;
   var secondLayer = layer.duplicate();
   layer.outPoint = std.time;
   var fix = secondLayer.outPoint; //bug tmp fix
   secondLayer.inPoint = std.time;
   secondLayer.outPoint = fix; //bug tmp fix
   loopProps(layer, true, trimKeys);
   loopProps(secondLayer, false, trimKeys);
   return secondLayer;
}

//execution
var testCases = {
   "optimize keys": loopProps,
   "cut animAreas": cutToKeys,
   "trim Layer": cut,
   "trim Layer and keys": function(layer) {
      cut(layer, true);
   },
   "cut animAreas and trim layers": function(layer) {
      cutToKeys(layer).forEach(function(layer) {
         cut(layer);
      })
   },
   "cut animAreas and trim keys": function(layer) {
      cutToKeys(cut(layer, true));
      cutToKeys(layer);
   }
}

var layers = [];

for(i = 0; i < std.selectedLayers.length; i++) {
   layers.push(std.selectedLayers[i]);
}

app.beginUndoGroup("cut to keys");

for(var a = 0; a < layers.length; a++) {
   testCases[layers[a].name](layers[a]);
}

//startEndResolve(std.layer(1).property("Anchor Point"), std.layer(1));

app.endUndoGroup();
