var objData = {
  FormId: "hello world!",
  FormName: "測試",
  Select1: 2,
  Title: "測試"
};

function Bind(options) {
  this.data = options.data;
  this.run = function() {
    Bind.prototype.observe(this.data, this);
    var id = options.el;
    var dom = Bind.prototype.nodeToFragment(document.querySelector(id), this);
    document.querySelector(id).appendChild(dom);
  };
}

Bind.prototype.defineReactive = function(obj, key, val) {
  var dep = new Dep();
  Object.defineProperty(obj, key, {
    get: function() {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set: function(newVal) {
      if (newVal === val) {
        return;
      }
      val = newVal;
      dep.notify();
      console.log(val);
    }
  });
};

Bind.prototype.observe = function(obj, model) {
  Object.keys(obj).forEach(function(key) {
    Bind.prototype.defineReactive(model.data, key, obj[key]);
  });
};

Bind.prototype.compile = function(node, model) {
  var reg = /\{\{(.*)\}\}/;
  // 節點類型為表單元素
  if (node.nodeType === 1) {
    var attr = node.attributes;
    for (var i = 0; i < attr.length; i++) {
      if (attr[i].nodeName === "name") {
        var name = attr[i].nodeValue;
        node.value = model.data[name];
        node.addEventListener("input", function(e) {
          model.data[name] = e.target.value;
        });
        node.removeAttribute("name");
      }
    }
  }

  // 節點類型
  if (node.nodeType === 3) {
    if (reg.test(node.nodeValue)) {
      var name = RegExp.$1;
      name = name.trim();
      // node.nodeValue = vm.data[name]
      new Watcher(model, node, name);
    }
  }
  return node;
};

Bind.prototype.flag = document.createDocumentFragment();
Bind.prototype.nodeToFragment = function(node, model) {
  var child;

  // var children = node.childNodes;
  // for (var i = 0; i < children.length; i++) {
  //   console.log(`${children[i].nodeName}-nodeType:${children[i].nodeType}`);
  //   if (children[i].childNodes.length > 0 && children[i].nodeName != "SELECT") {
  //     Bind.prototype.nodeToFragment(children[i], model);
  //   }
  //   Bind.prototype.compile(children[i], model);
  //   Bind.prototype.flag.appendChild(children[i]);
  // }
  while ((child = node.firstChild)) {
    console.log(
      `${child.nodeName}-nodeType:${child.nodeType}-nodeInnerHtml-${child}`
    );
    if (child.childNodes.length > 0 && child.nodeName != "SELECT") {
      Bind.prototype.nodeToFragment(child, model);
    }
    Bind.prototype.compile(child, model);
    Bind.prototype.flag.appendChild(child);
  }
  return Bind.prototype.flag;
};

function Dep() {
  this.subs = [];
}

Dep.prototype = {
  addSub(sub) {
    this.subs.push(sub);
  },
  notify() {
    this.subs.forEach(function(sub) {
      sub.update();
    });
  }
};

function Watcher(model, node, name) {
  Dep.target = this;
  this.name = name;
  this.node = node;
  this.model = model;
  this.update();
  Dep.target = null;
}

Watcher.prototype = {
  update() {
    this.get();
    this.node.nodeValue = this.value;
  },
  get() {
    this.value = this.model.data[this.name];
  }
};

var bind = new Bind({
  el: "#app",
  data: objData
});

var domTree = document.getElementById("app");
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

function check(textValue) {
  var result = false;
  var reg = /\{\{(.*)\}\}/;
  var textValue = nodes[i].textContent;
  if (textValue.match(reg) !== null) {
    result = true;
  }
  return result;
}

var nodes = textNodesUnder(domTree);
for (var i = 0, len = nodes.length; i < len; i++) {
  if (check(nodes[i])) {
    console.log(nodes[i].nodeValue);
  }
}

var inputs = domTree.querySelectorAll("input");
for (var i = 0, len = inputs.length; i < len; i++) {
  console.log(inputs[i].nodeValue);
}

var selects = domTree.querySelectorAll("Select");
for (var i = 0, len = selects.length; i < len; i++) {
  console.log(selects[i].nodeName);
}

Object.defineProperty(objData, "Title", {
  get: function() {
    return nodes[2].nodeValue;
  },
  set: function(newVal) {
    nodes[2].nodeValue = newVal;
  }
});

// bind.run();
