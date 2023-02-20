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
inPointExpression();
