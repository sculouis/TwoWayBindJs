window.data = {};
var _ = require("underscore");
var $ = require("jquery");

//定義node和object綁定
var defineReactive = function(obj, key, node) {
  Object.defineProperty(obj, key, {
    value: obj[key],
    writable: true,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(obj, key, {
    get: function() {
      if (node.tagName === "INPUT" || node.tagName === "SELECT") {
        return $("#" + node.attributes["id"].value).val();
      } else {
        return node.nodeValue;
      }
    },
    set: function(newVal) {
      if (node.tagName === "INPUT" || node.tagName === "SELECT") {
        $("#" + node.attributes["id"].value).val(newVal);
      } else {
        node.nodeValue = newVal;
      }
    }
  });
};

//表單輸入框寫回變數值
$("input").on("input", function(e) {
  var name = $(this).attr("id");
  data[name] = $(this).val();
  console.log($(this).val());
});

//表單下拉框寫回變數值
$("select").change(function() {
  var name = $(this).attr("id");
  data[name] = $(this).val();
  console.log($(this).val());
});

$(function() {
  var rootnode = document.getElementById("app");
  var walker = document.createTreeWalker(
    rootnode,
    NodeFilter.SHOW_ALL,
    null,
    false
  );
  //取得TextNode
  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (node.nodeName === "#text") {
      //text element
      var reg = /\{\{(.*)\}\}/;
      if (reg.test(node.nodeValue)) {
        var name = RegExp.$1;
        name = name.trim();
        console.log(`節點名稱:${node.nodeName}`);
        console.log(`textNode nodeValue:${name}`);
        defineReactive(data, name, node);
      }
    } else {
      var attrs = node.attributes;
      for (var i = attrs.length - 1; i >= 0; i--) {
        console.log(`屬性名稱:${attrs[i].name} -> ${attrs[i].value}`);
        if (attrs[i].name === "id") {
          defineReactive(data, attrs[i].value, node);
        }
      }
    }
  }

  //inital data
  var dataSource = {
    FormId: "FormId",
    FormName: "FormName",
    Select1: 3,
    FormId1: "FormId",
    FormName1: "FormName",
    Select11: 3,
    Title: "測試"
  };
  Object.keys(dataSource).forEach(function(key) {
    data[key] = dataSource[key];
  });
});
