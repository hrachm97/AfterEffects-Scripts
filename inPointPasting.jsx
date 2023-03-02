var std = app.project.activeItem;

function inPointExpression() {
    app.beginUndoGroup("inPoint pasting");
    var layers = [];

    for(i = 0; i < std.selectedLayers.length; i++) 
    {
        layers.push(std.selectedLayers[i]);
    }

    var tmp = std.layers.addNull();
    app.executeCommand(20);
    var theLayerPath = tmp.transform.position.expression;

    if(theLayerPath) {
        //alert(theLayerPath);
        theLayerPath = theLayerPath.substr(0, theLayerPath.indexOf(").t") + 1);
        //alert(theLayerPath);
        
        for(i = 0; i < layers.length; i++) {
            layers[i].transform.position.expression = "var otherLayer = " + theLayerPath + ";\nvar difference = thisLayer.inPoint - otherLayer.inPoint;\notherLayer.transform.position.valueAtTime(time - difference)";
        }
    } 
    
    tmp.remove();
    app.endUndoGroup();
    return;
}

function pasteKeys() {
    var time = std.time;
    var startTimes = [];

    app.beginUndoGroup("inPoint pasting");

    for(i = 0; i < std.selectedLayers.length; i++) {
        startTimes.push(std.selectedLayers[i].startTime);
        std.selectedLayers[i].startTime -= std.selectedLayers[i].inPoint;
    }

    var theLayer = std.layer(std.numLayers); // grdon

    std.time = theLayer.transform.position.keyTime(1);

    app.executeCommand(20);

    std.time = time;
    for(i = 0; i < std.selectedLayers.length; i++) {
        std.selectedLayers[i].startTime = startTimes[i];
    }
    
    app.endUndoGroup();
}

pasteKeys();
inPointExpression();