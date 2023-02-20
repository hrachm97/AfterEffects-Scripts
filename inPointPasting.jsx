var std = app.project.activeItem;

function inPointExpression() {
    var layers = [];

    app.beginUndoGroup("inPoint pasting");

    for(i = 0; i < std.selectedLayers.length; i++) 
    {
        layers.push(std.selectedLayers[i]);
    }

    var tmp = std.layers.addNull();
    app.executeCommand(20);
    var theLayer = std.selectedLayers[0].transform.position.expression;

    function getPosition(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    }

    theLayer = theLayer.substr(0, theLayer.indexOf(").t") + 1);

    tmp.remove();



    for(i = 0; i < layers.length; i++) {
        layers[i].transform.position.expression = "var otherLayer = " + theLayer + ";\nvar difference = thisLayer.inPoint - otherLayer.inPoint;\notherLayer.transform.position.valueAtTime(time - difference)";
    }

    app.endUndoGroup();
}

function pasteKeys() {
    var time = std.time;
    var startTimes = [];

    app.beginUndoGroup("inPoint pasting");

    for(i = 0; i < std.selectedLayers.length; i++) {
        startTimes.push(std.selectedLayers[i].startTime);
        std.selectedLayers[i].startTime -= std.selectedLayers[i].inPoint;
    }
    std.time = 0;

    app.executeCommand(20);

    std.time = time;
    for(i = 0; i < std.selectedLayers.length; i++) {
        std.selectedLayers[i].startTime = startTimes[i];
    }
    
    app.endUndoGroup();
}

inPointExpression();
