var std = app.project.activeItem;

function nodeDepth(node) {
    var counter = 0;
    while(node.parent) {
        node = node.parent;
        counter++;
    }
    return counter;
}

function toNode(node, depth) {
    while(depth) {
        if(node.parent) node = node.parent;
        else {
            alert("Can't go deeper than node depth: ");
            return;
        }
        depth--;
    }
    return node;
}

function minDepth(arr){
    var minDepth = 10000000;
    for(i = 0; i < arr.length; i++) {
        var min = nodeDepth(arr[i]);
        if(min < minDepth) minDepth = min;
    }
    return minDepth;
}

function toEqualDepths(arr, depth) {
    var layers = [];
    for(i = 0; i < arr.length; i++) {
        layers.push(toNode(arr[i], nodeDepth(arr[i]) - depth));
    }

    return layers;
}

function levelUp(arr) {
    var layers = [];
    for(i = 0; i < arr.length; i++) {
        layers.push(arr[i].parent);
    }
    return layers;
}

function makeUnique(arr) {
    var layers = [];
    for(i = 0; i < arr.length; i++) {
        for(j = i+1; j < arr.length; j++) {
            if(i === j) continue;
            if(arr[i] === arr[j]) {
                arr[j] = false;
            }
        }
        
        if(arr[i] !== false) {
            //alert(arr[i]);
            layers.push(arr[i]);
        }
    }
    return layers;
}

function toNearestMutualNode(arr) {
    var min = minDepth(arr);
    var layers = makeUnique(toEqualDepths(arr, min));
    
    while (makeUnique(levelUp(layers)).length !== 1) {
        layers = makeUnique(levelUp(layers));
    }
    
    return layers;
}

// function makeUnique(arr) {
//     var tmp = [];
//     for(i = 0; i < arr.length; i++) {
//         var found = 0;
//         for(j = 0; j < arr.length; j++) {
//             if(arr[i] === arr[j]) found++;
//         }
//         if(found < 2) tmp.push(arr[i]);
//     }
//     return tmp;
// }

function addHandle(node, handler) {
    if(node.parent) {
        if(handler.parent);
        else {
            handler.parent = node.parent;
            handler.moveAfter(node.parent);
        }
        //handler.position.setValue([0,0]);
    } else {
        if(handler.index > node.index) handler.moveBefore(node);
        //handler.position.setValue(node.position.value);
    }
    node.parent = handler;
}

function doThing() {
    app.beginUndoGroup("test");

    var layers = toNearestMutualNode(std.selectedLayers);
    //alert([layers[0].index, layers[1].index]);

    var handler = std.layers.addNull();

    for(i = 0; i < layers.length; i++) {
        addHandle(layers[i], handler);
    }
    app.endUndoGroup();
}
//alert()
doThing()
//addHandle(std.selectedLayers[0], std.selectedLayers[1], false);