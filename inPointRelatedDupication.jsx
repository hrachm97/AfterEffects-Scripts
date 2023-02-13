var std = app.project.activeItem;

var time = 5;
var startTimes = [];

app.beginUndoGroup("inPoint pasting");

for(i = 0; i < std.selectedLayers.length; i++) {
    startTimes.push(std.selectedLayers[i].startTime);
    std.selectedLayers[i].startTime = std.selectedLayers[i].startTime - std.selectedLayers[i].inPoint;
}
std.time = 0;

app.executeCommand(20);

std.time = time;
for(i = 0; i < std.selectedLayers.length; i++) {
    std.selectedLayers[i].startTime = startTimes[i];
}

app.endUndoGroup();
