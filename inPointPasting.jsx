var std = app.project.activeItem;

var originalTime = std.time;
var layers = [];

app.beginUndoGroup("inPoint pasting");

for(i = 0; i < std.selectedLayers.length; i++) 
{
    layers.push(std.selectedLayers[i]);
}

for(i = 0; i < layers.length; i++) {
    std.time = layers[0].inPoint;
    app.executeCommand(20);
}

std.time = originalTime;

app.endUndoGroup();

