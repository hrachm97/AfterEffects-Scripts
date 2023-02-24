var std = app.project.activeItem;

var count = 0;

function setWidth(comp, value, align) {
    oldWidth = comp.width;
    comp.width = value;
    var a;
    if(align === "center") a = 2;
    else if(align === "right") a = 1;
    else return;
    for(i = 1; i <= comp.numLayers; i++) {
        if(!Boolean(comp.layer(i).parent)) {
            comp.layer(i).position.setValue([
                comp.layer(i).position.value[0] + (value - oldWidth) / a,
                comp.layer(i).position.value[1]
            ]);
        }
    }
}

function setHeight(comp, value, align) {
    oldHeight = comp.height;
    comp.height = value;
    var a;
    if(align === "center") a = 2;
    else if(align === "bottom") a = 1;
    else return;
    for(i = 1; i <= comp.numLayers; i++) {
        if(!Boolean(comp.layer(i).parent)) {
            comp.layer(i).position.setValue([
                comp.layer(i).position.value[0],
                comp.layer(i).position.value[1] + (value - oldHeight) / a
            ]);
        }
    }
}

function setSize(comp, width, height, horizontal, vertical) {
    setWidth(comp, width, horizontal);
    setHeight(comp, height, vertical);
}

function adjustCompSizes(layer) {
    if(layer.source instanceof CompItem){
        if(layer.source.width !== std.width && layer.source.height !== std.height) {
           setSize(layer.source, std.width, std.height, "center", "center");
           count++;
        }
        for(var i = 1; i <= layer.source.numLayers; i++) {
            adjustCompSizes(layer.source.layer(i));
        }
    }
}

app.beginUndoGroup("adjusting frame rates");

for(i = 0; i < std.selectedLayers.length; i++) {
    adjustCompSizes(std.selectedLayers[i]);
}

alert(count + " comp sizes have been adjusted");

app.endUndoGroup();