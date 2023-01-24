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

function nodeDepth(node, counter) {
    counter = typeof counter == "undefined" ? 0 : counter;
    if(node.parent) {
        return nodeDepth(node.parent, counter + 1);
    } 
    return counter;
}

function toNode(node, depth) {
    var maxDepth = nodeDepth(node);
    if(maxDepth == depth) return node;
    return toNode(node.parent, depth)
}

function makeUnique(arr) {
    var tmp = [];
    for(i = 0; i < arr.length; i++) {
        var found = 0;
        for(j = 0; j < arr.length; j++) {
            if(arr[i] === arr[j]) found++;
        }
        if(found < 2) tmp.push(arr[i]);
    }
    return tmp;
}

function addHandle(node, handler, option) {
    option = typeof option == "undefined" ? false : option;
    if(node.parent) {
        handler.parent = node.parent;
        handler.moveAfter(node.parent);
    } else {
        handler.moveBefore(node);
    }
    handler.position.setValue(option ? [0,0] : node.position.value);
    node.parent = handler;
}

function addParent() {
    app.beginUndoGroup("parenting null");
    var selectedLayers = [];
    for(i = 1; i <= myComp.numLayers; i++) {
        if(myComp.layer(i).selected) {
            selectedLayers.push(myComp.layer(i));
        }
    }
    var handler = myComp.layers.addNull();
    var selectedCases = [
        function() {
            for(i = 2; i <= myComp.numLayers; i++) {
                if(!Boolean(myComp.layer(i).parent)) myComp.layer(i).parent = handler;
            }
        },
        function() {
            addHandle(selectedLayers[0], handler);
            //alert(toNode(selectedLayers[0], 2).name);
        },
        function() {
            var minDepth = nodeDepth(selectedLayers[0]);
            for(i = 1; i < selectedLayers.length; i++) {
                var tmp = nodeDepth(selectedLayers[i]);
                if(minDepth > tmp) minDepth = tmp;
            }
            //alert(selectedLayers.length);
            for(i = 1; i < selectedLayers.length; i++) {
                for(j = minDepth; j >= 0; j--) {
                    if(toNode(selectedLayers[0], j) === toNode(selectedLayers[i], j)) {
                        selectedLayers[0] = toNode(selectedLayers[0], j + 1 > minDepth ? j : j + 1);
                        selectedLayers[i] = toNode(selectedLayers[i], j + 1 > minDepth ? j : j + 1);
                        minDepth = j;
                        break;
                    }
                }
            }
            selectedLayers = makeUnique(selectedLayers);
            //alert(selectedLayers[0].index)
            for(i = 0; i < selectedLayers.length; i++) {
                addHandle(selectedLayers[i], handler, true);
                //alert(selectedLayers[i].index)
            }
        }
    ];
    selectedCases[selectedLayers.length > 2 ? 2 : selectedLayers.length]();
    app.endUndoGroup();
}

addParent()
//alert(toNode(myComp.selectedLayers[0], 2).name);