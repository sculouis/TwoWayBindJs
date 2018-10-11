var objData = {};
function textNodesUnder(el) {
  var text,
    textNodes = [],
    walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  while ((text = walk.nextNode())) {
    if (text.nodeType === 3) {
      textNodes.push(text);
    }
  }
  return textNodes;
}

function check(node) {
  var result = false;
  var reg = /\{\{(.*)\}\}/;
  var textValue = node.textContent;
  if (textValue.match(reg) !== null) {
    result = true;
  }
  return result;
}

//定義node和object綁定
var defineReactive = function(obj, key, node) {
  Object.defineProperty(obj, key, {
    get: function() {
      return node.nodeValue;
    },
    set: function(newVal) {
      node.nodeValue = newVal;
      var inputName = "input[name='" + key + "']";
      if ($(inputName).length) {
        $(inputName).val(newVal);
      }
      var selectName = "Select[name='" + key + "']";
      if ($(selectName).length) {
        $(selectName).val(newVal);
      }
    }
  });
};

var compile = function(node, model, name) {
  // 節點類型為表單元素 if (node.nodeType === 1) { var attr = node.attributes;
  if (node.nodeName === "INPUT") {
    node.addEventListener("input", function(e) {
      model[name] = e.target.value;
    });
  } else {
    var selectName = "Select[name='" + name + "']";
    $(selectName).change(function() {
      model[name] = $(this).val();
    });
  }
};

$(function() {
  var rootnode = document.getElementById("app");
  var walker = document.createTreeWalker(
    rootnode,
    NodeFilter.SHOW_ALL,
    null,
    false
  );

  //Alert the starting node Tree Walker currently points to (root node)
  // alert(walker.currentNode.tagName); //alerts DIV (with id=contentarea)

  //Step through and log all child nodes
  var nodes = [];
  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (node.nodeName === "#text") {
      var reg = /\{\{(.*)\}\}/;
      if (reg.test(node.nodeValue)) {
        var name = RegExp.$1;
        name = name.trim();
        console.log(`節點名稱:${node.nodeName}`);
        console.log(`textNode nodeValue:${name}`);
        var element = { name: name, eNode: node };
        nodes.push(element);
      }
    } else {
      var attrs = node.attributes;
      for (var i = attrs.length - 1; i >= 0; i--) {
        console.log(`屬性名稱:${attrs[i].name} -> ${attrs[i].value}`);
        if (attrs[i].name === "name") {
          var element = { name: attrs[i].value, eNode: node };
          nodes.push(element);
        }
      }
    }
  }
  console.log(`${nodes.length}`);

  var domTree = document.getElementById("app");
  var nodes = textNodesUnder(domTree);
  for (var i = 0, len = nodes.length; i < len; i++) {
    if (check(nodes[i])) {
      var reg = /\{\{(.*)\}\}/;
      if (reg.test(nodes[i].nodeValue)) {
        var name = RegExp.$1;
        name = name.trim();
        defineReactive(objData, name, nodes[i]);
      }

      console.log(nodes[i].nodeValue);
    }
  }

  //inital data
  var dataSource = {
    FormId: "FormId",
    FormName: "FormName",
    Select1: 3,
    Title: "測試"
  };
  Object.keys(dataSource).forEach(function(key) {
    objData[key] = dataSource[key];
  });

  $("input,Select").each(function(index) {
    $(this).val(dataSource[$(this).attr("name")]);
    console.log($(this)[0].tagName + "-" + $(this).attr("name"));
    var selectName =
      $(this)[0].tagName + "[name='" + $(this).attr("name") + "']";
    var node = document.querySelector(selectName);
    compile(node, objData, $(this).attr("name"));
  });
});
