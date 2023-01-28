var project = app.project;
var comp = project.activeItem;
 
// User Interface
var mainWindow = new Window("palette", "Mask Importer/Exporter", undefined);
mainWindow.orientation = "column";
 
var groupOne = mainWindow.add("group", undefined, "groupOne");
groupOne.orientation = "row";
var importButton = groupOne.add("button", undefined, "Import Mask");
var exportButton = groupOne.add("button", undefined, "Export Mask");
 
mainWindow.center();
mainWindow.show();
alert(29);

// Importing mask information
importButton.onClick = function(){
    app.beginUndoGroup("Import Mask");

    var layerMask;

    var importFile = new File;
    importFile = importFile.openDlg();
    
    //var fpath = importFile.absoluteURI; not used
    var docString = "";

    var thisDoc = new File(importFile);
    if(thisDoc.exists){
            thisDoc.open("r");
            docString = thisDoc.read();
            thisDoc.close();
    } else {
        return;
    }
    var Masks = JSON.parse(docString);
    var importLayer = comp.layer(1);
    // generate and apply masks
    var importShape = new Shape();
    for(var e = 0; e < Masks.length; e++) {
        
        importShape.vertices = Masks[e].vertices;
        importShape.inTangents = Masks[e].inTangents;
        importShape.outTangents = Masks[e].outTangents;
        
        layerMask = importLayer.Masks.addProperty("Mask");
        layerMask.property("ADBE Mask Shape").setValue(importShape);
    }
    app.endUndoGroup();
    alert("Import Successful");
    }
 
 
// exporint mask information
exportButton.onClick = function() {
    app.beginUndoGroup("Export Mask");
    
    var exportFolder = Folder.selectDialog("Select a folder");
    if(exportFolder instanceof Folder == false) return;

    var Masks = comp.layer(1).property("Masks");
    var arr = [];

    for(var q = 1; q <= Masks.numProperties; q++){     
        var myPath = Masks.property("Mask " + q).property("Mask Path");

        var maskShape = {};
        maskShape.vertices = myPath.value.vertices;
        maskShape.inTangents = myPath.value.inTangents;
        maskShape.outTangents = myPath.value.inTangents;

        arr.push(maskShape);
    }

    var myFile = new File(exportFolder.absoluteURI + "/mask.json");
    myFile.open("w")
    myFile.encoding = "UTF-8";
    myFile.write(JSON.stringify(arr, undefined, 4));
    myFile.close();
    
    app.endUndoGroup();
    alert("Export Successful");
}