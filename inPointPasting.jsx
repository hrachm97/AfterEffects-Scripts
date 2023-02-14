var std = app.project.activeItem;

var originalTime = std.time;
var layers = [];

app.beginUndoGroup("inPoint pasting");

for(i = 0; i < std.selectedLayers.length; i++) 
{
    layers.push(std.selectedLayers[i]);
    std.selectedLayers[i].selected = false;
}

for(i = 0; i < layers.length; i++) {
    std.time = layers[0].inPoint;
    layers[i].selected = true;
    app.executeCommand(20);
    layers[i].selected = false;
}

std.time = originalTime;

app.endUndoGroup();

