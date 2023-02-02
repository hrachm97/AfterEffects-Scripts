var std = app.project.activeItem;

function deepCopy(layer, std) {
   if (!validateSelect(1)) return;

   app.beginUndoGroup("Deep Copy");

   var duplicatedLayer = layer.duplicate();
   makeSourceUnique(duplicatedLayer, std);

   app.endUndoGroup();
}

function makeSourceUnique(layer, thisComp) {
   var source;
   if(layer.source instanceof CompItem){
      source = layer.source.duplicate(); 
      layer.replaceSource(source, true);
      for(var i = 1; i <= layer.source.numLayers; i++) {
         makeSourceUnique(layer.source.layer(i), layer.source);
      }
   } else if(layer.source instanceof FootageItem && !(layer.source.mainSource instanceof SolidSource)) {
      var projFile = layer.source;
      var imp = new ImportOptions();
      imp.file = projFile.file;
      source = app.project.importFile(imp);
      layer.replaceSource(source, true);
   } 
   else if(layer.source.mainSource instanceof SolidSource) {
      var a = layer.source;
      layer.moveAfter(
         thisComp.layers.addSolid(a.mainSource.color, a.name, a.width, a.height, a.pixelAspect, a.duration)
      );
      layer.remove();
   }

}

deepCopy(std.selectedLayers[0], std);
