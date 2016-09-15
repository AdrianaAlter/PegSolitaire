document.addEventListener('DOMContentLoaded', function(e) {

  var start;
  var stop;
  var middle;

  var style = "1";

  var pegs = document.getElementsByTagName("li");
  var rows = document.getElementsByClassName("row");

  var addPegs = function(){
    var peg;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].className.split(" ")[0] == "narrow") {
        for (var j = 0; j < 3; j++){
          createPeg(rows[i], j, i);
        }
      }
      else {
        for (var k = 0; k < 7; k++) {
          createPeg(rows[i], k, i);
        }
      }
    }
  };

  var reset = function(){
    for (var i = 0; i < pegs.length; i++){
      if (pegs[i].getAttribute("key") == 3 && pegs[i].getAttribute("rowkey") == 3) {
        pegs[i].className = "peg" + style + " empty";
      }
      else {
        pegs[i].className = "peg" + style;
        pegs[i].style.opacity = "1";
      }
    }
  };

  var undo = function(){
    stop.className += " empty";
    start.className = "peg" + style;
    middle.className = "peg" + style;
  };

  var toggleStyle = function(){
    style == "1" ? style = "2" : style = "1";
    document.getElementsByTagName("section")[0].className = "buttons" + style;
    document.getElementsByTagName("div")[0].className = "board" + style;
    for (var i = 0; i < pegs.length; i++) {
      if (pegs[i].className.split(" ").includes("empty")) {
        pegs[i].className = "peg" + style + " empty";
      }
      else {
        pegs[i].className = "peg" + style;
      }
    };
  };

  document.getElementsByTagName("button")[0].addEventListener('click', reset, false);
  document.getElementsByTagName("button")[1].addEventListener('click', undo, false);
  document.getElementsByTagName("button")[2].addEventListener('click', toggleStyle, false);

  var liftPeg = function(e) {
    if (e.currentTarget.className.split(" ").includes("empty")) {
      start = "";
    }
    else {
      start = e.currentTarget;
      var pegImg = document.createElement("img");
      pegImg.src = "peg" + style + ".png";
      e.dataTransfer.setDragImage(pegImg, 0, 0);
      removePeg(e);
    }
  };
  var removePeg = function(e) {
    start = e.currentTarget;
    e.currentTarget.className += " empty";
  };
  var placePeg = function(e) {
    e.stopPropagation();
    if (e.currentTarget.tagName == "LI") {
      stop = e.currentTarget;
      var valid = findMiddle(start, stop);
      if (valid && stop.className.split(" ").includes("empty")) {
        stop.className = "peg" + style;
      }
      else {
        start.className = "peg" + style;
      }
    }
    else {
      start.className = "peg" + style;
    }
  };

  var findMiddle = function(start, stop) {
    var startRow = parseInt(start.getAttribute("rowkey"));
    var stopRow = parseInt(stop.getAttribute("rowkey"));
    var startKey = parseInt(start.getAttribute("key"));
    var stopKey = parseInt(stop.getAttribute("key"));

    if (startRow == stopRow) {
      if (stopKey == startKey - 2) {
        var l = findLeft(startKey, start.parentElement);
        if (!l.className.split(" ").includes("empty")) {
          middle = l;
          l.className += " empty";
          return true;
        }
      }
      else if (stopKey == startKey + 2) {
        var r = findRight(startKey, start.parentElement);
        if (!r.className.split(" ").includes("empty")) {
          middle = r;
          r.className += " empty";
          return true;
        }
      }
    }
    else if (stopRow == startRow - 2) {
      var t = findTop(start, startKey, startRow);
      if (!t.className.split(" ").includes("empty")) {
        middle = t;
        t.className += " empty";
        return true;
      }
    }
    else if (stopRow == startRow + 2) {
      var b = findBottom(start, startKey, startRow);
      if (!b.className.split(" ").includes("empty")) {
        middle = b;
        b.className += " empty";
        return true;
      }
    }
  };

  var createPeg = function(row, key, rowKey) {
    peg = document.createElement("li");
    peg.className = "peg" + style;
    peg.setAttribute("key", key);
    peg.setAttribute("rowKey", rowKey);
    peg.draggable = true;
    if (row.parentElement.children[3] == row && key == 3) {
      peg.className += " empty";
    }
    row.appendChild(peg);
  };

  addPegs();

  for (var i = 0; i < pegs.length; i++){
      pegs[i].addEventListener('dragstart', liftPeg, false);
  };

  var children = document.getElementsByTagName("*");
  for (var i = 0; i < children.length; i++) {
    children[i].addEventListener('drop', placePeg, false);
  };

  document.addEventListener('dragover', function(e) {
    e.preventDefault();
  });

  var findLeft = function(pegKey, row) {
    var left = row.children[pegKey - 1];
    return left;
  };

  var findRight = function(pegKey, row) {
    var right = row.children[pegKey + 1];
    return right;
  };
  var findTop = function(peg, pegKey, rowKey) {
    var rowUp = peg.parentElement.parentElement.children[rowKey - 1];
    var top;
    if (!rowUp) {
      top = null;
    }
    else if (rowKey == 2) {
      top = rowUp.children[pegKey - 2];
    }
    else if (rowKey == 5) {
      top = rowUp.children[pegKey + 2];
    }
    else {
      top = rowUp.children[pegKey];
    }
    return top;
  };

  var findBottom = function(peg, pegKey, rowKey) {
    var rowDown = peg.parentElement.parentElement.children[rowKey + 1];
    var bottom;

    if (!rowDown) {
      top = null;
    }
    else if (rowKey == 1) {
      bottom = rowDown.children[pegKey + 2];
    }
    else if (rowKey == 5) {
      bottom = rowDown.children[pegKey - 2];
    }
    else {
      bottom = rowDown.children[pegKey];
    }
    return bottom;
  };
});
