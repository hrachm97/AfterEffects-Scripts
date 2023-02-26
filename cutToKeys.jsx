var std = app.project.activeItem;

function getAnimatedSections(prop) {
   var animatedTimes = [];
   var inPerod = false;
   var prevValue = prop.valueAtTime(prop.keyTime(1), true);
   for(var k = 2; k <= prop.numKeys; k++) {
      if(inPerod) {
         if((prop.valueAtTime(prop.keyTime(k), true)[0] === prevValue[0] && prop.valueAtTime(prop.keyTime(k), false)[1] === prevValue[1])) {
            animatedTimes.push(prop.keyTime(k - 1));
            inPerod = false;
         } else {
            prevValue = prop.valueAtTime(prop.keyTime(k), true);
            if(k === prop.numKeys) animatedTimes.push(prop.keyTime(k));
         }
      } else {
         // alert(prevValue);
         // alert(prop.valueAtTime(prop.keyTime(k), true));
         if(prop.valueAtTime(prop.keyTime(k), true)[0] !== prevValue[0] || prop.valueAtTime(prop.keyTime(k), false)[1] !== prevValue[1]) {
            //alert(k + "nth keyframe is equal to prevValue: " + prevValue[0] + ',' + prevValue[1] + " so pushing it's time to the array");
            animatedTimes.push(prop.keyTime(k - 1));
            if(k === prop.numKeys) animatedTimes.push(prop.keyTime(k));
            prevValue = prop.valueAtTime(prop.keyTime(k), true);
            inPerod = true;
         }
      }
   }
   return animatedTimes;
}

function cutToKeys(layer) {
   var allAmims = [];
   for(var i = 1; i <= layer.numProperties; i++) {
      for(var j = 1; j <= layer.property(i).numProperties; j++) {
         var prop = layer.property(i).property(j);
         if(prop.numKeys) {
            //getAnimatedSections()
            alert(getAnimatedSections(prop));
         }
      }
   }
   // layer.inPoint = firstKeyTime;
   // layer.outPoint = lastKeyTime;
}

var layers = [];

// for (i = 0; i < std.selectedLayers.length; i++) {
//    layers.push(std.selectedLayers[i]);
// }

// for(var a = 0; a < layers.length; a++) {
//    cutToKeys(layers[a]);
// }