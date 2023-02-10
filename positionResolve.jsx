var std = app.project.activeItem;

app.beginUndoGroup("resolve position");

var layer = std.selectedLayers[0];
var p = layer.transform.position;
var a = layer.transform.anchorPoint;

for(i = 1; i <= p.numKeys; i++) {
    p.setValueAtKey(i, 
        [
            p.valueAtTime(p.keyTime(i), false)[0] - a.value[0] + layer.width/2,
            p.valueAtTime(p.keyTime(i), false)[1] - a.value[1] + layer.height/2
        ]
    )
}
a.setValue([layer.width/2,layer.height/2])

app.endUndoGroup();