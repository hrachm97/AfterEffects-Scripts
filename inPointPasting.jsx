var std = app.project.activeItem;

var layers = [];

app.beginUndoGroup("inPoint pasting");

for(i = 0; i < std.selectedLayers.length; i++) 
{
    layers.push(std.selectedLayers[i]);
}

app.executeCommand(20);
alert();

for(i = 0; i < layers.length; i++) {
    layers[i].transform.position.expression = "var otherLayer = thisComp.layer(\"" + std.selectedLayers[0].name + "\");\nvar difference = thisLayer.inPoint - otherLayer.inPoint;\notherLayer.transform.position.valueAtTime(time - difference)";
}
std.selectedLayers[0].remove();

app.endUndoGroup();

