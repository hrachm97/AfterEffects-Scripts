app.beginUndoGroup("AutoMagic");
var std = app.project;

var myFolder = new Folder(Folder.selectDialog("Select a folder"));
var myFiles = myFolder.getFiles("*.mov");
var myAudioFiles = myFolder.getFiles("*.m4a");
var allMyFiles = myFiles.concat(myAudioFiles);

var myImportOptions = new ImportOptions();
var importedLayers = new Array();

for(var i = 0; i < allMyFiles.length; i++) {
    myImportOptions.file = allMyFiles[i];
    importedLayers.push(std.importFile(myImportOptions))
}

var Videos = [], Audios = [];
var duration = 0;
var width = height = 4;
for(var e = 1; e <= std.numItems; e++) {
    if(std.item(e).hasVideo == true) {
        Videos.push(std.item(e));
        duration += std.item(e).duration;
        width = Math.max(width, std.item(e).width);
        height = Math.max(height, std.item(e).height);
    }
    if(std.item(e).hasVideo == false && std.item(e).hasAudio == true) {
        Audios.push(std.item(e));
        duration += std.item(e).duration;
    }
}

var tempComp = std.items.addComp("Temp Comp", width, height, 1, duration, 27);  
tempComp.openInViewer();
var start = 0;
for(var q = 0; q < Videos.length; q++) {
    var thisLayer = tempComp.layers.add(Videos[q]);
    thisLayer.startTime = start;
    start = thisLayer.outPoint;
}
for(var q = 0; q < Audios.length; q++) {
    var thisLayer = tempComp.layers.add(Audios[q]);
}

var exportFile = new File(Folder.selectDialog("Select a folder").absoluteURI + tempComp.name + ".mov");
var theRender = std.renderQueue.items.add(tempComp);
theRender.outputModules[1].file = exportFile;

app.endUndoGroup();

std.renderQueue.render();
