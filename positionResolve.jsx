var std = app.project.activeItem;

app.beginUndoGroup("resolve position");

var layer = std.selectedLayers[0];
var p = layer.transform.position;
var a = layer.transform.anchorPoint;
var rect = layer.sourceRectAtTime(std.time, false);

var x = rect.left + rect.width/2;
var y = rect.top + rect.height/2;

for(i = 1; i <= p.numKeys; i++) {
    p.setValueAtKey(i, 
        [
            p.valueAtTime(p.keyTime(i), false)[0] + x - a.value[0],
            p.valueAtTime(p.keyTime(i), false)[1] + y - a.value[1]
        ]
    )
}
a.setValue([x, y]);

app.endUndoGroup();