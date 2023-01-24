var myComp = app.project.activeItem;
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
    app.beginUndoGroup("change comp size");
    setWidth(comp, width, horizontal);
    setHeight(comp, height, vertical);
    app.endUndoGroup();
}
