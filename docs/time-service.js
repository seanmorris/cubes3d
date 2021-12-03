(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};

require.register("curvature/base/Bag.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bag = void 0;

var _Bindable = require("./Bindable");

var _Mixin = require("./Mixin");

var _EventTargetMixin = require("../mixin/EventTargetMixin");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var toId = function toId(_int) {
  return Number(_int);
};

var fromId = function fromId(id) {
  return parseInt(id);
};

var Mapped = Symbol('Mapped');
var Has = Symbol('Has');
var Add = Symbol('Add');
var Remove = Symbol('Remove');
var Delete = Symbol('Delete');

var Bag = /*#__PURE__*/function (_Mixin$with) {
  _inherits(Bag, _Mixin$with);

  var _super = _createSuper(Bag);

  function Bag() {
    var _this;

    var changeCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

    _classCallCheck(this, Bag);

    _this = _super.call(this);
    _this.meta = Symbol('meta');
    _this.content = new Map();
    _this.list = _Bindable.Bindable.makeBindable([]);
    _this.current = 0;
    _this.type = undefined;
    _this.length = 0;
    _this.changeCallback = changeCallback;
    return _this;
  }

  _createClass(Bag, [{
    key: "has",
    value: function has(item) {
      if (this[Mapped]) {
        return this[Mapped].has(item);
      }

      return this[Has](item);
    }
  }, {
    key: Has,
    value: function value(item) {
      return this.content.has(item);
    }
  }, {
    key: "add",
    value: function add(item) {
      if (this[Mapped]) {
        return this[Mapped].add(item);
      }

      return this[Add](item);
    }
  }, {
    key: Add,
    value: function value(item) {
      if (item === undefined || !(item instanceof Object)) {
        throw new Error('Only objects may be added to Bags.');
      }

      if (this.type && !(item instanceof this.type)) {
        console.error(this.type, item);
        throw new Error("Only objects of type ".concat(this.type, " may be added to this Bag."));
      }

      if (this.content.has(item)) {
        return;
      }

      var adding = new CustomEvent('adding', {
        detail: {
          item: item
        }
      });

      if (!this.dispatchEvent(adding)) {
        return;
      }

      var id = toId(this.current++);
      this.content.set(item, id);
      this.list[id] = item;

      if (this.changeCallback) {
        this.changeCallback(item, this.meta, Bag.ITEM_ADDED, id);
      }

      var add = new CustomEvent('added', {
        detail: {
          item: item,
          id: id
        }
      });
      this.dispatchEvent(add);
      this.length = this.size;
      return id;
    }
  }, {
    key: "remove",
    value: function remove(item) {
      if (this[Mapped]) {
        return this[Mapped].remove(item);
      }

      return this[Remove](item);
    }
  }, {
    key: Remove,
    value: function value(item) {
      if (item === undefined || !(item instanceof Object)) {
        throw new Error('Only objects may be removed from Bags.');
      }

      if (this.type && !(item instanceof this.type)) {
        console.error(this.type, item);
        throw new Error("Only objects of type ".concat(this.type, " may be removed from this Bag."));
      }

      if (!this.content.has(item)) {
        if (this.changeCallback) {
          this.changeCallback(item, this.meta, 0, undefined);
        }

        return false;
      }

      var removing = new CustomEvent('removing', {
        detail: {
          item: item
        }
      });

      if (!this.dispatchEvent(removing)) {
        return;
      }

      var id = this.content.get(item);
      delete this.list[id];
      this.content["delete"](item);

      if (this.changeCallback) {
        this.changeCallback(item, this.meta, Bag.ITEM_REMOVED, id);
      }

      var remove = new CustomEvent('removed', {
        detail: {
          item: item,
          id: id
        }
      });
      this.dispatchEvent(remove);
      this.length = this.size;
      return item;
    }
  }, {
    key: "delete",
    value: function _delete(item) {
      if (this[Mapped]) {
        return this[Mapped]["delete"](item);
      }

      this[Delete](item);
    }
  }, {
    key: Delete,
    value: function value(item) {
      this.remove(item);
    }
  }, {
    key: "map",
    value: function map() {
      var mapper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
        return x;
      };
      var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (x) {
        return x;
      };
      var mappedItems = new WeakMap();
      var mappedBag = new Bag();
      mappedBag[Mapped] = this;
      this.addEventListener('added', function (event) {
        var item = event.detail.item;

        if (!filter(item)) {
          return;
        }

        if (mappedItems.has(item)) {
          return;
        }

        var mapped = mapper(item);
        mappedItems.set(item, mapped);
        mappedBag[Add](mapped);
      });
      this.addEventListener('removed', function (event) {
        var item = event.detail.item;

        if (!mappedItems.has(item)) {
          return;
        }

        var mapped = mappedItems.get(item);
        mappedItems["delete"](item);
        mappedBag[Remove](mapped);
      });
      return mappedBag;
    }
  }, {
    key: "size",
    get: function get() {
      return this.content.size;
    }
  }, {
    key: "items",
    value: function items() {
      return Array.from(this.content.entries()).map(function (entry) {
        return entry[0];
      });
    }
  }]);

  return Bag;
}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));

exports.Bag = Bag;
Object.defineProperty(Bag, 'ITEM_ADDED', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: 1
});
Object.defineProperty(Bag, 'ITEM_REMOVED', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: -1
});
  })();
});

require.register("curvature/base/Bindable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bindable = void 0;

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Ref = Symbol('ref');
var Original = Symbol('original');
var Deck = Symbol('deck');
var Binding = Symbol('binding');
var SubBinding = Symbol('subBinding');
var BindingAll = Symbol('bindingAll');
var IsBindable = Symbol('isBindable');
var Wrapping = Symbol('wrapping');
var Names = Symbol('Names');
var Executing = Symbol('executing');
var Stack = Symbol('stack');
var ObjSymbol = Symbol('object');
var Wrapped = Symbol('wrapped');
var Unwrapped = Symbol('unwrapped');
var GetProto = Symbol('getProto');
var OnGet = Symbol('onGet');
var OnAllGet = Symbol('onAllGet');
var BindChain = Symbol('bindChain');
var Descriptors = Symbol('Descriptors');
var Before = Symbol('Before');
var After = Symbol('After');
var NoGetters = Symbol('NoGetters');
var TypedArray = Object.getPrototypeOf(Int8Array);
var SetIterator = Set.prototype[Symbol.iterator];
var MapIterator = Map.prototype[Symbol.iterator];
var win = globalThis;
var excludedClasses = [win.Node, win.File, win.Map, win.Set, win.WeakMap, win.WeakSet, win.ArrayBuffer, win.ResizeObserver, win.MutationObserver, win.PerformanceObserver, win.IntersectionObserver, win.IDBCursor, win.IDBCursorWithValue, win.IDBDatabase, win.IDBFactory, win.IDBIndex, win.IDBKeyRange, win.IDBObjectStore, win.IDBOpenDBRequest, win.IDBRequest, win.IDBTransaction, win.IDBVersionChangeEvent, win.Event, win.CustomEvent, win.FileSystemFileHandle].filter(function (x) {
  return typeof x === 'function';
});

var Bindable = /*#__PURE__*/function () {
  function Bindable() {
    _classCallCheck(this, Bindable);
  }

  _createClass(Bindable, null, [{
    key: "isBindable",
    value: function isBindable(object) {
      if (!object || !object[IsBindable]) {
        return false;
      }

      return object[IsBindable] === Bindable;
    }
  }, {
    key: "onDeck",
    value: function onDeck(object, key) {
      return object[Deck][key] || false;
    }
  }, {
    key: "ref",
    value: function ref(object) {
      return object[Ref] || object || false;
    }
  }, {
    key: "makeBindable",
    value: function makeBindable(object) {
      return this.make(object);
    }
  }, {
    key: "shuck",
    value: function shuck(original, seen) {
      seen = seen || new Map();
      var clone = {};

      if (original instanceof TypedArray || original instanceof ArrayBuffer) {
        var _clone = original.slice(0);

        seen.set(original, _clone);
        return _clone;
      }

      var properties = Object.keys(original);

      for (var i in properties) {
        var ii = properties[i];

        if (ii.substring(0, 3) === '___') {
          continue;
        }

        var alreadyCloned = seen.get(original[ii]);

        if (alreadyCloned) {
          clone[ii] = alreadyCloned;
          continue;
        }

        if (original[ii] === original) {
          seen.set(original[ii], clone);
          clone[ii] = clone;
          continue;
        }

        if (original[ii] && _typeof(original[ii]) === 'object') {
          var originalProp = original[ii];

          if (Bindable.isBindable(original[ii])) {
            originalProp = original[ii][Original];
          }

          clone[ii] = this.shuck(originalProp, seen);
        } else {
          clone[ii] = original[ii];
        }

        seen.set(original[ii], clone[ii]);
      }

      if (Bindable.isBindable(original)) {
        delete clone.bindTo;
        delete clone.isBound;
      }

      return clone;
    }
  }, {
    key: "make",
    value: function make(object) {
      var _this = this;

      if (!object || !['function', 'object'].includes(_typeof(object))) {
        return object;
      }

      if (Object.isSealed(object) || Object.isFrozen(object) || !Object.isExtensible(object) || excludedClasses.filter(function (x) {
        return object instanceof x;
      }).length) {
        return object;
      }

      if (object[Ref]) {
        return object[Ref];
      }

      if (object[IsBindable]) {
        return object;
      }

      Object.defineProperty(object, IsBindable, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Bindable
      });
      Object.defineProperty(object, Ref, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: false
      });
      Object.defineProperty(object, Original, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: object
      });
      Object.defineProperty(object, Deck, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, Binding, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, SubBinding, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map()
      });
      Object.defineProperty(object, BindingAll, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, Executing, {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, Wrapping, {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, Stack, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, Before, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, After, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, Wrapped, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map()
      });
      Object.defineProperty(object, Unwrapped, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, Descriptors, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map()
      });

      var bindTo = function bindTo(property) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var bindToAll = false;

        if (Array.isArray(property)) {
          var debinders = property.forEach(function (p) {
            return bindTo(p, callback, options);
          });
          return function () {
            return debinders.forEach(function (d) {
              return d();
            });
          };
        }

        if (property instanceof Function) {
          options = callback || {};
          callback = property;
          bindToAll = true;
        }

        if (options.delay >= 0) {
          callback = _this.wrapDelayCallback(callback, options.delay);
        }

        if (options.throttle >= 0) {
          callback = _this.wrapThrottleCallback(callback, options.throttle);
        }

        if (options.wait >= 0) {
          callback = _this.wrapWaitCallback(callback, options.wait);
        }

        if (options.frame) {
          callback = _this.wrapFrameCallback(callback, options.frame);
        }

        if (options.idle) {
          callback = _this.wrapIdleCallback(callback);
        }

        if (bindToAll) {
          var bindIndex = object[BindingAll].length;
          object[BindingAll].push(callback);

          if (!('now' in options) || options.now) {
            for (var i in object) {
              callback(object[i], i, object, false);
            }
          }

          return function () {
            delete object[BindingAll][bindIndex];
          };
        }

        if (!object[Binding][property]) {
          object[Binding][property] = new Set();
        } // let bindIndex = object[Binding][property].length;


        if (options.children) {
          var original = callback;

          callback = function callback() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var v = args[0];
            var subDebind = object[SubBinding].get(original);

            if (subDebind) {
              object[SubBinding]["delete"](original);
              subDebind();
            }

            if (_typeof(v) !== 'object') {
              original.apply(void 0, args);
              return;
            }

            var vv = Bindable.make(v);

            if (Bindable.isBindable(vv)) {
              object[SubBinding].set(original, vv.bindTo(function () {
                for (var _len2 = arguments.length, subArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  subArgs[_key2] = arguments[_key2];
                }

                return original.apply(void 0, args.concat(subArgs));
              }, Object.assign({}, options, {
                children: false
              })));
            }

            original.apply(void 0, args);
          };
        }

        object[Binding][property].add(callback);

        if (!('now' in options) || options.now) {
          callback(object[property], property, object, false);
        }

        var debinder = function debinder() {
          var subDebind = object[SubBinding].get(callback);

          if (subDebind) {
            object[SubBinding]["delete"](callback);
            subDebind();
          }

          if (!object[Binding][property]) {
            return;
          }

          if (!object[Binding][property].has(callback)) {
            return;
          }

          object[Binding][property]["delete"](callback);
        };

        if (options.removeWith && options.removeWith instanceof View) {
          options.removeWith.onRemove(function () {
            return debinder;
          });
        }

        return debinder;
      };

      Object.defineProperty(object, 'bindTo', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: bindTo
      });

      var ___before = function ___before(callback) {
        var beforeIndex = object[Before].length;
        object[Before].push(callback);
        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }

          cleaned = true;
          delete object[Before][beforeIndex];
        };
      };

      var ___after = function ___after(callback) {
        var afterIndex = object[After].length;
        object[After].push(callback);
        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }

          cleaned = true;
          delete object[After][afterIndex];
        };
      };

      Object.defineProperty(object, BindChain, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function value(path, callback) {
          var parts = path.split('.');
          var node = parts.shift();
          var subParts = parts.slice(0);
          var debind = [];
          debind.push(object.bindTo(node, function (v, k, t, d) {
            var rest = subParts.join('.');

            if (subParts.length === 0) {
              callback(v, k, t, d);
              return;
            }

            if (v === undefined) {
              v = t[k] = _this.makeBindable({});
            }

            debind = debind.concat(v[BindChain](rest, callback));
          }));
          return function () {
            return debind.forEach(function (x) {
              return x();
            });
          };
        }
      });
      Object.defineProperty(object, '___before', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: ___before
      });
      Object.defineProperty(object, '___after', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: ___after
      });

      var isBound = function isBound() {
        for (var i in object[BindingAll]) {
          if (object[BindingAll][i]) {
            return true;
          }
        }

        for (var _i in object[Binding]) {
          for (var j in object[Binding][_i]) {
            if (object[Binding][_i][j]) {
              return true;
            }
          }
        }

        return false;
      };

      Object.defineProperty(object, 'isBound', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: isBound
      });

      var _loop = function _loop(i) {
        if (object[i] && object[i] instanceof Object && !object[i] instanceof Promise) {
          if (!excludedClasses.filter(function (excludeClass) {
            return object[i] instanceof excludeClass;
          }).length && Object.isExtensible(object[i]) && !Object.isSealed(object[i])) {
            object[i] = Bindable.make(object[i]);
          }
        }
      };

      for (var i in object) {
        _loop(i);
      }

      var set = function set(target, key, value) {
        if (wrapped.has(key)) {
          wrapped["delete"](key);
        }

        if (key === Original) {
          return true;
        }

        var onDeck = object[Deck];

        if (onDeck[key] !== undefined && onDeck[key] === value) {
          return true;
        }

        if (key.slice && key.slice(-3) === '___') {
          return true;
        }

        if (target[key] === value) {
          return true;
        }

        if (value && value instanceof Object) {
          if (!excludedClasses.filter(function (x) {
            return object instanceof x;
          }).length && Object.isExtensible(object) && !Object.isSealed(object)) {
            if (!object[NoGetters]) {}

            value = Bindable.makeBindable(value);
          }
        }

        onDeck[key] = value;

        for (var _i2 in object[BindingAll]) {
          if (!object[BindingAll][_i2]) {
            continue;
          }

          object[BindingAll][_i2](value, key, target, false);
        }

        var stop = false;

        if (key in object[Binding]) {
          var _iterator = _createForOfIteratorHelper(object[Binding][key]),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var callback = _step.value;

              if (callback(value, key, target, false, target[key]) === false) {
                stop = true;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        delete onDeck[key];

        if (!stop) {
          var descriptor = Object.getOwnPropertyDescriptor(target, key);
          var excluded = target instanceof File && key == 'lastModifiedDate';

          if (!excluded && (!descriptor || descriptor.writable) && target[key] === value) {
            target[key] = value;
          }
        }

        var result = Reflect.set(target, key, value);

        if (Array.isArray(target) && object[Binding]['length']) {
          for (var _i3 in object[Binding]['length']) {
            var _callback = object[Binding]['length'][_i3];

            _callback(target.length, 'length', target, false, target.length);
          }
        }

        return result;
      };

      var deleteProperty = function deleteProperty(target, key) {
        var onDeck = object[Deck];

        if (onDeck[key] !== undefined) {
          return true;
        }

        if (!(key in target)) {
          return true;
        }

        if (descriptors.has(key)) {
          var descriptor = descriptors.get(key);

          if (descriptor && !descriptor.configurable) {
            return false;
          }

          descriptors["delete"](key);
        }

        onDeck[key] = null;

        if (wrapped.has(key)) {
          wrapped["delete"](key);
        }

        for (var _i4 in object[BindingAll]) {
          object[BindingAll][_i4](undefined, key, target, true, target[key]);
        }

        if (key in object[Binding]) {
          var _iterator2 = _createForOfIteratorHelper(object[Binding][key]),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var binding = _step2.value;
              binding(undefined, key, target, true, target[key]);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }

        delete onDeck[key];
        delete target[key];
        return true;
      };

      var construct = function construct(target, args) {
        var key = 'constructor';

        for (var _i5 in target[Before]) {
          target[Before][_i5](target, key, object[Stack], undefined, args);
        }

        var instance = Bindable.make(_construct(target[Original], _toConsumableArray(args)));

        for (var _i6 in target[After]) {
          target[After][_i6](target, key, object[Stack], instance, args);
        }

        return instance;
      };

      var descriptors = object[Descriptors];
      var wrapped = object[Wrapped];
      var stack = object[Stack];

      var get = function get(target, key) {
        if (wrapped.has(key)) {
          return wrapped.get(key);
        }

        if (key === Ref || key === Original || key === 'apply' || key === 'isBound' || key === 'bindTo' || key === '__proto__' || key === 'constructor') {
          return object[key];
        }

        var descriptor;

        if (descriptors.has(key)) {
          descriptor = descriptors.get(key);
        } else {
          descriptor = Object.getOwnPropertyDescriptor(object, key);
          descriptors.set(key, descriptor);
        }

        if (descriptor && !descriptor.configurable && !descriptor.writable) {
          return object[key];
        }

        if (OnAllGet in object) {
          return object[OnAllGet](key);
        }

        if (OnGet in object && !(key in object)) {
          return object[OnGet](key);
        }

        if (descriptor && !descriptor.configurable && !descriptor.writable) {
          wrapped.set(key, object[key]);
          return object[key];
        }

        if (typeof object[key] === 'function') {
          if (Names in object[key]) {
            return object[key];
          }

          Object.defineProperty(object[Unwrapped], key, {
            configurable: false,
            enumerable: false,
            writable: true,
            value: object[key]
          });
          var prototype = Object.getPrototypeOf(object);
          var isMethod = prototype[key] === object[key];
          var objRef = typeof Promise === 'function' && object instanceof Promise || typeof Map === 'function' && object instanceof Map || typeof Set === 'function' && object instanceof Set || typeof MapIterator === 'function' && object.prototype === MapIterator || typeof SetIterator === 'function' && object.prototype === SetIterator || typeof SetIterator === 'function' && object.prototype === SetIterator || typeof WeakMap === 'function' && object instanceof WeakMap || typeof WeakSet === 'function' && object instanceof WeakSet || typeof Date === 'function' && object instanceof Date || typeof TypedArray === 'function' && object instanceof TypedArray || typeof ArrayBuffer === 'function' && object instanceof ArrayBuffer || typeof EventTarget === 'function' && object instanceof EventTarget || typeof ResizeObserver === 'function' && object instanceof ResizeObserver || typeof MutationObserver === 'function' && object instanceof MutationObserver || typeof PerformanceObserver === 'function' && object instanceof PerformanceObserver || typeof IntersectionObserver === 'function' && object instanceof IntersectionObserver || typeof object[Symbol.iterator] === 'function' && key === 'next' ? object : object[Ref];

          var wrappedMethod = function wrappedMethod() {
            object[Executing] = key;
            stack.unshift(key);

            for (var _len3 = arguments.length, providedArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              providedArgs[_key3] = arguments[_key3];
            }

            var _iterator3 = _createForOfIteratorHelper(object[Before]),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var beforeCallback = _step3.value;
                beforeCallback(object, key, stack, object, providedArgs);
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

            var ret;

            if (new.target) {
              ret = _construct(object[Unwrapped][key], providedArgs);
            } else {
              var func = object[Unwrapped][key];

              if (isMethod) {
                ret = func.apply(objRef || object, providedArgs);
              } else {
                ret = func.apply(void 0, providedArgs);
              }
            }

            var _iterator4 = _createForOfIteratorHelper(object[After]),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var afterCallback = _step4.value;
                afterCallback(object, key, stack, object, providedArgs);
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }

            object[Executing] = null;
            stack.shift();
            return ret;
          };

          wrappedMethod[Names] = wrappedMethod[Names] || new WeakMap();
          wrappedMethod[Names].set(object, key);

          wrappedMethod[OnAllGet] = function (key) {
            var selfName = wrappedMethod[Names].get(object);
            return object[selfName][key];
          };

          var result = Bindable.make(wrappedMethod);
          wrapped.set(key, result);
          return result;
        }

        return object[key];
      };

      var getPrototypeOf = function getPrototypeOf(target) {
        if (GetProto in object) {
          return object[GetProto];
        }

        return Reflect.getPrototypeOf(target);
      };

      var handler = {
        get: get,
        set: set,
        construct: construct,
        getPrototypeOf: getPrototypeOf,
        deleteProperty: deleteProperty
      };

      if (object[NoGetters]) {
        delete handler.get;
      }

      Object.defineProperty(object, Ref, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Proxy(object, handler)
      });
      return object[Ref];
    }
  }, {
    key: "clearBindings",
    value: function clearBindings(object) {
      var clearObj = function clearObj(o) {
        return Object.keys(o).map(function (k) {
          return delete o[k];
        });
      };

      var maps = function maps(func) {
        return function () {
          for (var _len4 = arguments.length, os = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            os[_key4] = arguments[_key4];
          }

          return os.map(func);
        };
      };

      var clearObjs = maps(clearObj);
      clearObjs(object[Wrapped], object[Binding], object[BindingAll], object[After], object[Before]);
    }
  }, {
    key: "resolve",
    value: function resolve(object, path) {
      var owner = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var node;
      var pathParts = path.split('.');
      var top = pathParts[0];

      while (pathParts.length) {
        if (owner && pathParts.length === 1) {
          var obj = this.make(object);
          return [obj, pathParts.shift(), top];
        }

        node = pathParts.shift();

        if (!node in object || !object[node] || !(object[node] instanceof Object)) {
          object[node] = {};
        }

        object = this.make(object[node]);
      }

      return [this.make(object), node, top];
    }
  }, {
    key: "wrapDelayCallback",
    value: function wrapDelayCallback(callback, delay) {
      return function () {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        return setTimeout(function () {
          return callback.apply(void 0, args);
        }, delay);
      };
    }
  }, {
    key: "wrapThrottleCallback",
    value: function wrapThrottleCallback(callback, throttle) {
      var _this2 = this;

      this.throttles.set(callback, false);
      return function () {
        if (_this2.throttles.get(callback, true)) {
          return;
        }

        callback.apply(void 0, arguments);

        _this2.throttles.set(callback, true);

        setTimeout(function () {
          _this2.throttles.set(callback, false);
        }, throttle);
      };
    }
  }, {
    key: "wrapWaitCallback",
    value: function wrapWaitCallback(callback, wait) {
      var _this3 = this;

      return function () {
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }

        var waiter;

        if (waiter = _this3.waiters.get(callback)) {
          _this3.waiters["delete"](callback);

          clearTimeout(waiter);
        }

        waiter = setTimeout(function () {
          return callback.apply(void 0, args);
        }, wait);

        _this3.waiters.set(callback, waiter);
      };
    }
  }, {
    key: "wrapFrameCallback",
    value: function wrapFrameCallback(callback, frames) {
      return function () {
        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }

        requestAnimationFrame(function () {
          return callback.apply(void 0, args);
        });
      };
    }
  }, {
    key: "wrapIdleCallback",
    value: function wrapIdleCallback(callback) {
      return function () {
        for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
          args[_key8] = arguments[_key8];
        }

        // Compatibility for Safari 08/2020
        var req = window.requestIdleCallback || requestAnimationFrame;
        req(function () {
          return callback.apply(void 0, args);
        });
      };
    }
  }]);

  return Bindable;
}();

exports.Bindable = Bindable;

_defineProperty(Bindable, "waiters", new WeakMap());

_defineProperty(Bindable, "throttles", new WeakMap());

Object.defineProperty(Bindable, 'OnGet', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: OnGet
});
Object.defineProperty(Bindable, 'NoGetters', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: NoGetters
});
Object.defineProperty(Bindable, 'GetProto', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: GetProto
});
Object.defineProperty(Bindable, 'OnAllGet', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: OnAllGet
});
  })();
});

require.register("curvature/base/Cache.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cache = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cache = /*#__PURE__*/function () {
  function Cache() {
    _classCallCheck(this, Cache);
  }

  _createClass(Cache, null, [{
    key: "store",
    value: function store(key, value, expiry) {
      var bucket = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'standard';
      var expiration = 0;

      if (expiry) {
        expiration = expiry * 1000 + new Date().getTime();
      }

      if (!this.buckets) {
        this.buckets = new Map();
      }

      if (!this.buckets.has(bucket)) {
        this.buckets.set(bucket, new Map());
      }

      var eventEnd = new CustomEvent('cvCacheStore', {
        cancelable: true,
        detail: {
          key: key,
          value: value,
          expiry: expiry,
          bucket: bucket
        }
      });

      if (document.dispatchEvent(eventEnd)) {
        this.buckets.get(bucket).set(key, {
          value: value,
          expiration: expiration
        });
      }
    }
  }, {
    key: "load",
    value: function load(key) {
      var defaultvalue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var bucket = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'standard';
      var eventEnd = new CustomEvent('cvCacheLoad', {
        cancelable: true,
        detail: {
          key: key,
          defaultvalue: defaultvalue,
          bucket: bucket
        }
      });

      if (!document.dispatchEvent(eventEnd)) {
        return defaultvalue;
      }

      if (this.buckets && this.buckets.has(bucket) && this.buckets.get(bucket).has(key)) {
        var entry = this.buckets.get(bucket).get(key); // console.log(this.bucket[bucket][key].expiration, (new Date).getTime());

        if (entry.expiration === 0 || entry.expiration > new Date().getTime()) {
          return this.buckets.get(bucket).get(key).value;
        }
      }

      return defaultvalue;
    }
  }]);

  return Cache;
}();

exports.Cache = Cache;
  })();
});

require.register("curvature/base/Config.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AppConfig = {};
var _require = require;

try {
  AppConfig = _require('/Config').Config || {};
} catch (error) {
  globalThis.devMode === true && console.error(error);
}

var Config = /*#__PURE__*/function () {
  function Config() {
    _classCallCheck(this, Config);
  }

  _createClass(Config, null, [{
    key: "get",
    value: function get(name) {
      return this.configs[name];
    }
  }, {
    key: "set",
    value: function set(name, value) {
      this.configs[name] = value;
      return this;
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.configs;
    }
  }, {
    key: "init",
    value: function init() {
      for (var _len = arguments.length, configs = new Array(_len), _key = 0; _key < _len; _key++) {
        configs[_key] = arguments[_key];
      }

      for (var i in configs) {
        var config = configs[i];

        if (typeof config === 'string') {
          config = JSON.parse(config);
        }

        for (var name in config) {
          var value = config[name];
          return this.configs[name] = value;
        }
      }

      return this;
    }
  }]);

  return Config;
}();

exports.Config = Config;
Object.defineProperty(Config, 'configs', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: AppConfig
});
  })();
});

require.register("curvature/base/Dom.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dom = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var traversals = 0;

var Dom = /*#__PURE__*/function () {
  function Dom() {
    _classCallCheck(this, Dom);
  }

  _createClass(Dom, null, [{
    key: "mapTags",
    value: function mapTags(doc, selector, callback, startNode, endNode) {
      var result = [];
      var started = true;

      if (startNode) {
        started = false;
      }

      var ended = false;
      var treeWalker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode: function acceptNode(node, walker) {
          if (!started) {
            if (node === startNode) {
              started = true;
            } else {
              return NodeFilter.FILTER_SKIP;
            }
          }

          if (endNode && node === endNode) {
            ended = true;
          }

          if (ended) {
            return NodeFilter.FILTER_SKIP;
          }

          if (selector) {
            if (node instanceof Element) {
              if (node.matches(selector)) {
                return NodeFilter.FILTER_ACCEPT;
              }
            }

            return NodeFilter.FILTER_SKIP;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }, false);
      var traversal = traversals++;

      while (treeWalker.nextNode()) {
        result.push(callback(treeWalker.currentNode, treeWalker));
      }

      return result;
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(doc, event) {
      doc.dispatchEvent(event);
      Dom.mapTags(doc, false, function (node) {
        node.dispatchEvent(event);
      });
    }
  }]);

  return Dom;
}();

exports.Dom = Dom;
  })();
});

require.register("curvature/base/Mixin.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mixin = void 0;

var _Bindable = require("./Bindable");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Constructor = Symbol('constructor');
var MixinList = Symbol('mixinList');

var Mixin = /*#__PURE__*/function () {
  function Mixin() {
    _classCallCheck(this, Mixin);
  }

  _createClass(Mixin, null, [{
    key: "from",
    value: function from(baseClass) {
      for (var _len = arguments.length, mixins = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        mixins[_key - 1] = arguments[_key];
      }

      var newClass = /*#__PURE__*/function (_baseClass) {
        _inherits(newClass, _baseClass);

        var _super = _createSuper(newClass);

        function newClass() {
          var _this;

          _classCallCheck(this, newClass);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var instance = baseClass.constructor ? _this = _super.call.apply(_super, [this].concat(args)) : null;

          var _iterator = _createForOfIteratorHelper(mixins),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var mixin = _step.value;

              if (mixin[Mixin.Constructor]) {
                mixin[Mixin.Constructor].apply(_assertThisInitialized(_this));
              }

              switch (_typeof(mixin)) {
                case 'function':
                  Mixin.mixClass(mixin, newClass);
                  break;

                case 'object':
                  Mixin.mixObject(mixin, _assertThisInitialized(_this));
                  break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return _possibleConstructorReturn(_this, instance);
        }

        return newClass;
      }(baseClass);

      return newClass;
    }
  }, {
    key: "to",
    value: function to(base) {
      var descriptors = {};

      for (var _len3 = arguments.length, mixins = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        mixins[_key3 - 1] = arguments[_key3];
      }

      mixins.map(function (mixin) {
        switch (_typeof(mixin)) {
          case 'object':
            Object.assign(descriptors, Object.getOwnPropertyDescriptors(mixin));
            break;

          case 'function':
            Object.assign(descriptors, Object.getOwnPropertyDescriptors(mixin.prototype));
            break;
        }

        delete descriptors.constructor;
        Object.defineProperties(base.prototype, descriptors);
      });
    }
  }, {
    key: "with",
    value: function _with() {
      for (var _len4 = arguments.length, mixins = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        mixins[_key4] = arguments[_key4];
      }

      return this.from.apply(this, [/*#__PURE__*/function () {
        function _class() {
          _classCallCheck(this, _class);
        }

        return _class;
      }()].concat(mixins));
    }
  }, {
    key: "mixObject",
    value: function mixObject(mixin, instance) {
      var _iterator2 = _createForOfIteratorHelper(Object.getOwnPropertyNames(mixin)),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var func = _step2.value;

          if (typeof mixin[func] === 'function') {
            instance[func] = mixin[func].bind(instance);
            continue;
          }

          instance[func] = mixin[func];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var _iterator3 = _createForOfIteratorHelper(Object.getOwnPropertySymbols(mixin)),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _func = _step3.value;

          if (typeof mixin[_func] === 'function') {
            instance[_func] = mixin[_func].bind(instance);
            continue;
          }

          instance[_func] = mixin[_func];
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "mixClass",
    value: function mixClass(cls, newClass) {
      var _iterator4 = _createForOfIteratorHelper(Object.getOwnPropertyNames(cls.prototype)),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var func = _step4.value;

          if (['name', 'prototype', 'length'].includes(func)) {
            continue;
          }

          var descriptor = Object.getOwnPropertyDescriptor(newClass, func);

          if (descriptor && !descriptor.writable) {
            continue;
          }

          if (typeof cls[func] !== 'function') {
            newClass.prototype[func] = cls.prototype[func];
            continue;
          }

          newClass.prototype[func] = cls.prototype[func].bind(newClass.prototype);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var _iterator5 = _createForOfIteratorHelper(Object.getOwnPropertySymbols(cls.prototype)),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _func2 = _step5.value;

          if (typeof cls[_func2] !== 'function') {
            newClass.prototype[_func2] = cls.prototype[_func2];
            continue;
          }

          newClass.prototype[_func2] = cls.prototype[_func2].bind(newClass.prototype);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      var _iterator6 = _createForOfIteratorHelper(Object.getOwnPropertyNames(cls)),
          _step6;

      try {
        var _loop = function _loop() {
          var func = _step6.value;

          if (['name', 'prototype', 'length'].includes(func)) {
            return "continue";
          }

          var descriptor = Object.getOwnPropertyDescriptor(newClass, func);

          if (descriptor && !descriptor.writable) {
            return "continue";
          }

          if (typeof cls[func] !== 'function') {
            newClass[func] = cls[func];
            return "continue";
          }

          var prev = newClass[func] || false;
          var meth = cls[func].bind(newClass);

          newClass[func] = function () {
            prev && prev.apply(void 0, arguments);
            return meth.apply(void 0, arguments);
          };
        };

        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _ret = _loop();

          if (_ret === "continue") continue;
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      var _iterator7 = _createForOfIteratorHelper(Object.getOwnPropertySymbols(cls)),
          _step7;

      try {
        var _loop2 = function _loop2() {
          var func = _step7.value;

          if (typeof cls[func] !== 'function') {
            newClass.prototype[func] = cls[func];
            return "continue";
          }

          var prev = newClass[func] || false;
          var meth = cls[func].bind(newClass);

          newClass[func] = function () {
            prev && prev.apply(void 0, arguments);
            return meth.apply(void 0, arguments);
          };
        };

        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var _ret2 = _loop2();

          if (_ret2 === "continue") continue;
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "mix",
    value: function mix(mixinTo) {
      var constructors = [];
      var allStatic = {};
      var allInstance = {};

      var mixable = _Bindable.Bindable.makeBindable(mixinTo);

      var _loop3 = function _loop3(base) {
        var instanceNames = Object.getOwnPropertyNames(base.prototype);
        var staticNames = Object.getOwnPropertyNames(base);
        var prefix = /^(before|after)__(.+)/;

        var _iterator8 = _createForOfIteratorHelper(staticNames),
            _step8;

        try {
          var _loop5 = function _loop5() {
            var methodName = _step8.value;
            var match = methodName.match(prefix);

            if (match) {
              switch (match[1]) {
                case 'before':
                  mixable.___before(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }

                    var method = base[methodName].bind(o);
                    return method.apply(void 0, _toConsumableArray(a));
                  });

                  break;

                case 'after':
                  mixable.___after(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }

                    var method = base[methodName].bind(o);
                    return method.apply(void 0, _toConsumableArray(a));
                  });

                  break;
              }

              return "continue";
            }

            if (allStatic[methodName]) {
              return "continue";
            }

            if (typeof base[methodName] !== 'function') {
              return "continue";
            }

            allStatic[methodName] = base[methodName];
          };

          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var _ret3 = _loop5();

            if (_ret3 === "continue") continue;
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }

        var _iterator9 = _createForOfIteratorHelper(instanceNames),
            _step9;

        try {
          var _loop6 = function _loop6() {
            var methodName = _step9.value;
            var match = methodName.match(prefix);

            if (match) {
              switch (match[1]) {
                case 'before':
                  mixable.___before(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }

                    var method = base.prototype[methodName].bind(o);
                    return method.apply(void 0, _toConsumableArray(a));
                  });

                  break;

                case 'after':
                  mixable.___after(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }

                    var method = base.prototype[methodName].bind(o);
                    return method.apply(void 0, _toConsumableArray(a));
                  });

                  break;
              }

              return "continue";
            }

            if (allInstance[methodName]) {
              return "continue";
            }

            if (typeof base.prototype[methodName] !== 'function') {
              return "continue";
            }

            allInstance[methodName] = base.prototype[methodName];
          };

          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var _ret4 = _loop6();

            if (_ret4 === "continue") continue;
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      };

      for (var base = this; base && base.prototype; base = Object.getPrototypeOf(base)) {
        _loop3(base);
      }

      for (var methodName in allStatic) {
        mixinTo[methodName] = allStatic[methodName].bind(mixinTo);
      }

      var _loop4 = function _loop4(_methodName) {
        mixinTo.prototype[_methodName] = function () {
          for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }

          return allInstance[_methodName].apply(this, args);
        };
      };

      for (var _methodName in allInstance) {
        _loop4(_methodName);
      }

      return mixable;
    }
  }]);

  return Mixin;
}();

exports.Mixin = Mixin;
Mixin.Constructor = Constructor;
  })();
});

require.register("curvature/base/Router.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = void 0;

var _View = require("./View");

var _Cache = require("./Cache");

var _Config = require("./Config");

var _Routes = require("./Routes");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NotFoundError = Symbol('NotFound');
var InternalError = Symbol('Internal');

var Router = /*#__PURE__*/function () {
  function Router() {
    _classCallCheck(this, Router);
  }

  _createClass(Router, null, [{
    key: "wait",
    value: function wait(view) {
      var _this = this;

      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DOMContentLoaded';
      var node = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      node.addEventListener(event, function () {
        _this.listen(view);
      });
    }
  }, {
    key: "listen",
    value: function listen(listener) {
      var _this2 = this;

      var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.listener = listener || this.listener;
      this.routes = routes || listener.routes;
      Object.assign(this.query, this.queryOver({}));

      var listen = function listen(event) {
        event.preventDefault();

        if (event.state && 'routedId' in event.state) {
          if (event.state.routedId <= _this2.routeCount) {
            _this2.history.splice(event.state.routedId);

            _this2.routeCount = event.state.routedId;
          } else if (event.state.routedId > _this2.routeCount) {
            _this2.history.push(event.state.prev);

            _this2.routeCount = event.state.routedId;
          }

          _this2.state = event.state;
        } else {
          if (_this2.prevPath !== null && _this2.prevPath !== location.pathname) {
            _this2.history.push(_this2.prevPath);
          }
        }

        if (location.origin !== 'null') {
          _this2.match(location.pathname, listener);
        } else {
          _this2.match(_this2.nextPath, listener);
        }

        for (var i in _this2.query) {
          delete _this2.query[i];
        }

        Object.assign(_this2.query, _this2.queryOver({}));
      };

      window.addEventListener('popstate', listen);
      window.addEventListener('cvUrlChanged', listen);
      var route = location.origin !== 'null' ? location.pathname + location.search : false;

      if (location.origin && location.hash) {
        route += location.hash;
      }

      var state = {
        routedId: this.routeCount,
        url: location.pathname,
        prev: this.prevPath
      };

      if (location.origin !== 'null') {
        history.replaceState(state, null, location.pathname);
      }

      this.go(route !== false ? route : '/');
    }
  }, {
    key: "go",
    value: function go(path) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var configTitle = _Config.Config.get('title');

      if (configTitle) {
        document.title = configTitle;
      }

      var state = {
        routedId: this.routeCount,
        prev: this.prevPath,
        url: location.pathname
      };

      if (silent === -1) {
        this.match(path, this.listener, true);
      } else if (location.origin === 'null') {
        this.nextPath = path;
      } else if (silent === 2 && location.pathname !== path) {
        history.replaceState(state, null, path);
      } else if (location.pathname !== path) {
        history.pushState(state, null, path);
      }

      if (!silent || silent < 0) {
        if (silent === false) {
          this.path = null;
        }

        if (!silent) {
          if (path.substring(0, 1) === '#') {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          } else {
            window.dispatchEvent(new CustomEvent('cvUrlChanged'));
          }
        }
      }

      for (var i in this.query) {
        delete this.query[i];
      }

      Object.assign(this.query, this.queryOver({}));
      this.prevPath = path;
    }
  }, {
    key: "match",
    value: function match(path, listener) {
      var _this3 = this;

      var forceRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (this.path === path && !forceRefresh && typeof document !== 'undefined') {
        return;
      }

      this.queryString = location.search;
      this.path = path;
      var prev = this.prevPath;
      var current = listener && listener.args ? listener.args.content : null;

      var routes = this.routes || listener && listener.routes || _Routes.Routes.dump();

      var query = new URLSearchParams(location.search);

      for (var i in this.query) {
        delete this.query[i];
      }

      Object.assign(this.query, this.queryOver({}));
      var args = {},
          selected = false,
          result = '';
      path = path.substr(1).split('/');

      for (var _i in this.query) {
        args[_i] = this.query[_i];
      }

      L1: for (var _i2 in routes) {
        var route = _i2.split('/');

        if (route.length < path.length && route[route.length - 1] !== '*') {
          continue;
        }

        L2: for (var j in route) {
          if (route[j].substr(0, 1) == '%') {
            var argName = null;
            var groups = /^%(\w+)\??/.exec(route[j]);

            if (groups && groups[1]) {
              argName = groups[1];
            }

            if (!argName) {
              throw new Error("".concat(route[j], " is not a valid argument segment in route \"").concat(_i2, "\""));
            }

            if (!path[j]) {
              if (route[j].substr(route[j].length - 1, 1) == '?') {
                args[argName] = '';
              } else {
                continue L1;
              }
            } else {
              args[argName] = path[j];
            }
          } else if (route[j] !== '*' && path[j] !== route[j]) {
            continue L1;
          }
        }

        selected = _i2;
        result = routes[_i2];

        if (route[route.length - 1] === '*') {
          args.pathparts = path.slice(route.length - 1);
        }

        break;
      }

      var eventStart = new CustomEvent('cvRouteStart', {
        cancelable: true,
        detail: {
          path: path,
          prev: prev,
          root: listener,
          selected: selected,
          routes: routes
        }
      });

      if (typeof document !== 'undefined') {
        if (!document.dispatchEvent(eventStart)) {
          return;
        }
      }

      if (!forceRefresh && listener && current && result instanceof Object && current instanceof result && !(result instanceof Promise) && current.update(args)) {
        listener.args.content = current;
        return true;
      }

      if (!(selected in routes)) {
        routes[selected] = routes[NotFoundError];
      }

      var processRoute = function processRoute(selected) {
        var result = false;

        if (typeof routes[selected] === 'function') {
          if (routes[selected].prototype instanceof _View.View) {
            result = new routes[selected](args);
          } else {
            result = routes[selected](args);
          }
        } else {
          result = routes[selected];
        }

        return result;
      };

      try {
        result = processRoute(selected);

        if (result === false) {
          result = processRoute(NotFoundError);
        }

        if (!(result instanceof Promise)) {
          result = Promise.resolve(result); // return this.update(
          // 	listener
          // 	, path
          // 	, result
          // 	, routes
          // 	, selected
          // 	, args
          // 	, forceRefresh
          // );
        }

        if (typeof document === 'undefined') {
          return result;
        }

        return result.then(function (realResult) {
          _this3.update(listener, path, realResult, routes, selected, args, forceRefresh);
        })["catch"](function (error) {
          if (typeof document !== 'undefined') {
            document.dispatchEvent(new CustomEvent('cvRouteError', {
              detail: {
                error: error,
                path: path,
                prev: prev,
                view: listener,
                routes: routes,
                selected: selected
              }
            }));
          }

          _this3.update(listener, path, window['devMode'] ? String(error) : 'Error: 500', routes, selected, args, forceRefresh);

          throw error;
        });
      } catch (error) {
        console.error(error);

        if (typeof document !== 'undefined') {
          document.dispatchEvent(new CustomEvent('cvRouteError', {
            detail: {
              error: error,
              path: path,
              prev: prev,
              view: listener,
              routes: routes,
              selected: selected
            }
          }));
        }

        this.update(listener, path, window['devMode'] ? String(error) : 'Error: 500', routes, selected, args, forceRefresh); // throw error;
      }
    }
  }, {
    key: "update",
    value: function update(listener, path, result, routes, selected, args, forceRefresh) {
      if (!listener) {
        return;
      }

      var prev = this.prevPath;
      var event = new CustomEvent('cvRoute', {
        cancelable: true,
        detail: {
          result: result,
          path: path,
          prev: prev,
          view: listener,
          routes: routes,
          selected: selected
        }
      });

      if (result !== false) {
        if (listener.args.content instanceof _View.View) {
          listener.args.content.pause(true);
          listener.args.content.remove();
        }

        if (document.dispatchEvent(event)) {
          listener.args.content = result;
        }

        if (result instanceof _View.View) {
          result.pause(false);
          result.update(args, forceRefresh);
        }
      }

      var eventEnd = new CustomEvent('cvRouteEnd', {
        cancelable: true,
        detail: {
          result: result,
          path: path,
          prev: prev,
          view: listener,
          routes: routes,
          selected: selected
        }
      });
      document.dispatchEvent(eventEnd);
    }
  }, {
    key: "queryOver",
    value: function queryOver() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var params = new URLSearchParams(location.search);
      var finalArgs = {};
      var query = {};

      var _iterator = _createForOfIteratorHelper(params),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var pair = _step.value;
          query[pair[0]] = pair[1];
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      finalArgs = Object.assign(finalArgs, query, args);
      delete finalArgs['api'];
      return finalArgs; // for(let i in query)
      // {
      // 	finalArgs[i] = query[i];
      // }
      // for(let i in args)
      // {
      // 	finalArgs[i] = args[i];
      // }
    }
  }, {
    key: "queryToString",
    value: function queryToString() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var fresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var parts = [],
          finalArgs = args;

      if (!fresh) {
        finalArgs = this.queryOver(args);
      }

      for (var i in finalArgs) {
        if (finalArgs[i] === '') {
          continue;
        }

        parts.push(i + '=' + encodeURIComponent(finalArgs[i]));
      }

      return parts.join('&');
    }
  }, {
    key: "setQuery",
    value: function setQuery(name, value, silent) {
      var args = this.queryOver();
      args[name] = value;

      if (value === undefined) {
        delete args[name];
      }

      var queryString = this.queryToString(args, true);
      this.go(location.pathname + (queryString ? '?' + queryString : '?'), silent);
    }
  }]);

  return Router;
}();

exports.Router = Router;
Object.defineProperty(Router, 'query', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: {}
});
Object.defineProperty(Router, 'history', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: []
});
Object.defineProperty(Router, 'routeCount', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: 0
});
Object.defineProperty(Router, 'prevPath', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: null
});
Object.defineProperty(Router, 'queryString', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: null
});
Object.defineProperty(Router, 'InternalError', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: InternalError
});
Object.defineProperty(Router, 'NotFoundError', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: NotFoundError
});
  })();
});

require.register("curvature/base/Routes.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Routes = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AppRoutes = {};
var _require = require;

try {
  Object.assign(AppRoutes, _require('Routes').Routes || {});
} catch (error) {
  globalThis.devMode === true && console.warn(error);
}

var Routes = /*#__PURE__*/function () {
  function Routes() {
    _classCallCheck(this, Routes);
  }

  _createClass(Routes, null, [{
    key: "get",
    value: function get(name) {
      return this.routes[name];
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.routes;
    }
  }]);

  return Routes;
}();

exports.Routes = Routes;
Object.defineProperty(Routes, 'routes', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: AppRoutes
});
  })();
});

require.register("curvature/base/RuleSet.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleSet = void 0;

var _Dom = require("./Dom");

var _Tag = require("./Tag");

var _View = require("./View");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RuleSet = /*#__PURE__*/function () {
  function RuleSet() {
    _classCallCheck(this, RuleSet);
  }

  _createClass(RuleSet, [{
    key: "add",
    value: function add(selector, callback) {
      this.rules = this.rules || {};
      this.rules[selector] = this.rules[selector] || [];
      this.rules[selector].push(callback);
      return this;
    }
  }, {
    key: "apply",
    value: function apply() {
      var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      RuleSet.apply(doc, view);

      for (var selector in this.rules) {
        for (var i in this.rules[selector]) {
          var callback = this.rules[selector][i];
          var wrapped = RuleSet.wrap(doc, callback, view);
          var nodes = doc.querySelectorAll(selector);

          var _iterator = _createForOfIteratorHelper(nodes),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var node = _step.value;
              wrapped(node);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
    }
  }, {
    key: "purge",
    value: function purge() {
      if (!this.rules) {
        return;
      }

      for (var _i = 0, _Object$entries = Object.entries(this.rules); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            k = _Object$entries$_i[0],
            v = _Object$entries$_i[1];

        if (!this.rules[k]) {
          continue;
        }

        for (var kk in this.rules[k]) {
          delete this.rules[k][kk];
        }
      }
    }
  }], [{
    key: "add",
    value: function add(selector, callback) {
      this.globalRules = this.globalRules || {};
      this.globalRules[selector] = this.globalRules[selector] || [];
      this.globalRules[selector].push(callback);
      return this;
    }
  }, {
    key: "apply",
    value: function apply() {
      var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      for (var selector in this.globalRules) {
        for (var i in this.globalRules[selector]) {
          var callback = this.globalRules[selector][i];
          var wrapped = this.wrap(doc, callback, view);
          var nodes = doc.querySelectorAll(selector);

          var _iterator2 = _createForOfIteratorHelper(nodes),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var node = _step2.value;
              wrapped(node);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    }
  }, {
    key: "wait",
    value: function wait() {
      var _this = this;

      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'DOMContentLoaded';
      var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

      var listener = function (event, node) {
        return function () {
          node.removeEventListener(event, listener);
          return _this.apply();
        };
      }(event, node);

      node.addEventListener(event, listener);
    }
  }, {
    key: "wrap",
    value: function wrap(doc, originalCallback) {
      var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var callback = originalCallback;

      if (originalCallback instanceof _View.View || originalCallback && originalCallback.prototype && originalCallback.prototype instanceof _View.View) {
        callback = function callback() {
          return originalCallback;
        };
      }

      return function (element) {
        if (typeof element.___cvApplied___ === 'undefined') {
          Object.defineProperty(element, '___cvApplied___', {
            enumerable: false,
            writable: false,
            value: new WeakSet()
          });
        }

        if (element.___cvApplied___.has(originalCallback)) {
          return;
        }

        var direct, parentView;

        if (view) {
          direct = parentView = view;

          if (view.viewList) {
            parentView = view.viewList.parent;
          }
        }

        var tag = new _Tag.Tag(element, parentView, null, undefined, direct);
        var parent = tag.element.parentNode;
        var sibling = tag.element.nextSibling;
        var result = callback(tag);

        if (result !== false) {
          element.___cvApplied___.add(originalCallback);
        }

        if (result instanceof HTMLElement) {
          result = new _Tag.Tag(result);
        }

        if (result instanceof _Tag.Tag) {
          if (!result.element.contains(tag.element)) {
            while (tag.element.firstChild) {
              result.element.appendChild(tag.element.firstChild);
            }

            tag.remove();
          }

          if (sibling) {
            parent.insertBefore(result.element, sibling);
          } else {
            parent.appendChild(result.element);
          }
        }

        if (result && result.prototype && result.prototype instanceof _View.View) {
          result = new result({}, view);
        }

        if (result instanceof _View.View) {
          if (view) {
            view.cleanup.push(function (r) {
              return function () {
                r.remove();
              };
            }(result));
            view.cleanup.push(view.args.bindTo(function (v, k, t) {
              t[k] = v;
              result.args[k] = v;
            }));
            view.cleanup.push(result.args.bindTo(function (v, k, t, d) {
              t[k] = v;
              view.args[k] = v;
            }));
          }

          tag.clear();
          result.render(tag.element);
        }
      };
    }
  }]);

  return RuleSet;
}();

exports.RuleSet = RuleSet;
  })();
});

require.register("curvature/base/SetMap.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetMap = void 0;

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SetMap = /*#__PURE__*/function () {
  function SetMap() {
    _classCallCheck(this, SetMap);

    _defineProperty(this, "_map", new Map());
  }

  _createClass(SetMap, [{
    key: "has",
    value: function has(key) {
      return this._map.has(key);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: "getOne",
    value: function getOne(key) {
      var set = this.get(key);

      var _iterator = _createForOfIteratorHelper(set),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          return entry;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "add",
    value: function add(key, value) {
      var set = this._map.get(key);

      if (!set) {
        this._map.set(key, set = new Set());
      }

      return set.add(value);
    }
  }, {
    key: "remove",
    value: function remove(key, value) {
      var set = this._map.get(key);

      if (!set) {
        return;
      }

      var res = set["delete"](value);

      if (!set.size) {
        this._map["delete"](key);
      }

      return res;
    }
  }, {
    key: "values",
    value: function values() {
      return _construct(Set, _toConsumableArray(_toConsumableArray(this._map.values()).map(function (set) {
        return _toConsumableArray(set.values());
      })));
    }
  }]);

  return SetMap;
}();

exports.SetMap = SetMap;
  })();
});

require.register("curvature/base/Tag.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tag = void 0;

var _Bindable = require("./Bindable");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tag = /*#__PURE__*/function () {
  function Tag(element, parent, ref, index, direct) {
    var _this2 = this;

    _classCallCheck(this, Tag);

    if (typeof element === 'string') {
      var subdoc = document.createRange().createContextualFragment(element);
      element = subdoc.firstChild;
    }

    this.element = _Bindable.Bindable.makeBindable(element);
    this.node = this.element;
    this.parent = parent;
    this.direct = direct;
    this.ref = ref;
    this.index = index;
    this.cleanup = [];

    this[_Bindable.Bindable.OnAllGet] = function (name) {
      if (typeof _this2[name] === 'function') {
        return _this2[name];
      }

      if (_this2.node && typeof _this2.node[name] === 'function') {
        return function () {
          var _this2$node;

          return (_this2$node = _this2.node)[name].apply(_this2$node, arguments);
        };
      }

      if (_this2.node && name in _this2.node) {
        return _this2.node[name];
      }

      return _this2[name];
    };

    var generateStyler = function generateStyler(_this) {
      return _Bindable.Bindable.make(function (styles) {
        if (!_this.node) {
          return;
        }

        for (var property in styles) {
          if (property[0] === '-') {
            _this.node.style.setProperty(property, String(styles[property]));
          } else {
            _this.node.style[property] = String(styles[property]);
          }
        }
      });
    };

    this.style = generateStyler(this);
    this.proxy = _Bindable.Bindable.make(this);
    this.proxy.style.bindTo(function (v, k) {
      _this2.element.style[k] = v;
    });
    this.proxy.bindTo(function (v, k) {
      if (k in element) {
        element[k] = v;
      }

      return false;
    });
    return this.proxy;
  }

  _createClass(Tag, [{
    key: "attr",
    value: function attr(attributes) {
      for (var attribute in attributes) {
        if (attributes[attribute] === undefined) {
          this.node.removeAttribute(attribute);
        } else if (attributes[attribute] === null) {
          this.node.setAttribute(attribute, '');
        } else {
          this.node.setAttribute(attribute, attributes[attribute]);
        }
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this.node) {
        this.node.remove();
      }

      _Bindable.Bindable.clearBindings(this);

      var cleanup;

      while (cleanup = this.cleanup.shift()) {
        cleanup();
      }

      this.clear();

      if (!this.node) {
        return;
      }

      var detachEvent = new Event('cvDomDetached');
      this.node.dispatchEvent(detachEvent);
      this.node = this.element = this.ref = this.parent = undefined;
    }
  }, {
    key: "clear",
    value: function clear() {
      if (!this.node) {
        return;
      }

      var detachEvent = new Event('cvDomDetached');

      while (this.node.firstChild) {
        this.node.firstChild.dispatchEvent(detachEvent);
        this.node.removeChild(this.node.firstChild);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    }
  }, {
    key: "listen",
    value: function listen(eventName, callback, options) {
      var node = this.node;
      node.addEventListener(eventName, callback, options);

      var remove = function remove() {
        node.removeEventListener(eventName, callback, options);
      };

      var remover = function remover() {
        remove();

        remove = function remove() {
          return console.warn('Already removed!');
        };
      };

      this.parent.onRemove(function () {
        return remover();
      });
      return remover;
    }
  }]);

  return Tag;
}();

exports.Tag = Tag;
  })();
});

require.register("curvature/base/View.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Bindable = require("./Bindable");

var _ViewList = require("./ViewList");

var _Router = require("./Router");

var _Dom = require("./Dom");

var _Tag = require("./Tag");

var _Bag = require("./Bag");

var _RuleSet = require("./RuleSet");

var _Mixin = require("./Mixin");

var _PromiseMixin = require("../mixin/PromiseMixin");

var _EventTargetMixin = require("../mixin/EventTargetMixin");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var dontParse = Symbol('dontParse');
var expandBind = Symbol('expandBind');
var uuid = Symbol('uuid');
var moveIndex = 0;

var View = /*#__PURE__*/function (_Mixin$with) {
  _inherits(View, _Mixin$with);

  var _super = _createSuper(View);

  function View() {
    var _this;

    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var mainView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, View);

    _this = _super.call(this, args, mainView);
    Object.defineProperty(_assertThisInitialized(_this), 'args', {
      value: _Bindable.Bindable.make(args)
    });
    Object.defineProperty(_assertThisInitialized(_this), uuid, {
      value: _this.constructor.uuid()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'nodesAttached', {
      value: new _Bag.Bag(function (i, s, a) {})
    });
    Object.defineProperty(_assertThisInitialized(_this), 'nodesDetached', {
      value: new _Bag.Bag(function (i, s, a) {})
    });
    Object.defineProperty(_assertThisInitialized(_this), '_onRemove', {
      value: new _Bag.Bag(function (i, s, a) {})
    });
    Object.defineProperty(_assertThisInitialized(_this), 'cleanup', {
      value: []
    });
    Object.defineProperty(_assertThisInitialized(_this), 'parent', {
      value: mainView
    });
    Object.defineProperty(_assertThisInitialized(_this), 'views', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'viewLists', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'withViews', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'tags', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(_assertThisInitialized(_this), 'nodes', {
      value: _Bindable.Bindable.make([])
    });
    Object.defineProperty(_assertThisInitialized(_this), 'timeouts', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'intervals', {
      value: []
    });
    Object.defineProperty(_assertThisInitialized(_this), 'frames', {
      value: []
    });
    Object.defineProperty(_assertThisInitialized(_this), 'ruleSet', {
      value: new _RuleSet.RuleSet()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'preRuleSet', {
      value: new _RuleSet.RuleSet()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'subBindings', {
      value: {}
    });
    Object.defineProperty(_assertThisInitialized(_this), 'templates', {
      value: {}
    });
    Object.defineProperty(_assertThisInitialized(_this), 'eventCleanup', {
      value: []
    });
    Object.defineProperty(_assertThisInitialized(_this), 'unpauseCallbacks', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'interpolateRegex', {
      value: /(\[\[((?:\$+)?[\w\.\|-]+)\]\])/g
    });
    Object.defineProperty(_assertThisInitialized(_this), 'rendered', {
      value: new Promise(function (accept, reject) {
        return Object.defineProperty(_assertThisInitialized(_this), 'renderComplete', {
          value: accept
        });
      })
    });
    _this.controller = _assertThisInitialized(_this);
    _this.loaded = Promise.resolve(_assertThisInitialized(_this));
    _this.template = "";
    _this.firstNode = null;
    _this.lastNode = null;
    _this.viewList = null;
    _this.mainView = null;
    _this.preserve = false;
    _this.removed = false; // return Bindable.make(this);

    return _this;
  }

  _createClass(View, [{
    key: "_id",
    get: function get() {
      return this[uuid];
    }
  }, {
    key: "onFrame",
    value: function onFrame(callback) {
      var _this2 = this;

      var stopped = false;

      var cancel = function cancel() {
        stopped = true;
      };

      var c = function c(timestamp) {
        if (_this2.removed || stopped) {
          return;
        }

        if (!_this2.paused) {
          callback(Date.now());
        }

        requestAnimationFrame(c);
      };

      requestAnimationFrame(function () {
        return c(Date.now());
      });
      this.frames.push(cancel);
      return cancel;
    }
  }, {
    key: "onNextFrame",
    value: function onNextFrame(callback) {
      return requestAnimationFrame(function () {
        return callback(Date.now());
      });
    }
  }, {
    key: "onIdle",
    value: function onIdle(callback) {
      return requestIdleCallback(function () {
        return callback(Date.now());
      });
    }
  }, {
    key: "onTimeout",
    value: function onTimeout(time, callback) {
      var _this3 = this;

      var timeoutInfo = {
        timeout: null,
        callback: null,
        time: time,
        fired: false,
        created: new Date().getTime(),
        paused: false
      };

      var wrappedCallback = function wrappedCallback() {
        callback();
        timeoutInfo.fired = true;

        _this3.timeouts["delete"](timeoutInfo.timeout);
      };

      var timeout = setTimeout(wrappedCallback, time);
      timeoutInfo.callback = wrappedCallback;
      timeoutInfo.timeout = timeout;
      this.timeouts.set(timeoutInfo.timeout, timeoutInfo);
      return timeout;
    }
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout(_x) {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function (timeout) {
      var _iterator = _createForOfIteratorHelper(this.timeouts),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              callback = _step$value[0],
              timeoutInfo = _step$value[1];

          clearTimeout(timeoutInfo.timeout);
          this.timeouts["delete"](timeoutInfo.timeout);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    })
  }, {
    key: "onInterval",
    value: function onInterval(time, callback) {
      var timeout = setInterval(callback, time);
      this.intervals.push({
        timeout: timeout,
        callback: callback,
        time: time,
        paused: false
      });
      return timeout;
    }
  }, {
    key: "clearInterval",
    value: function (_clearInterval) {
      function clearInterval(_x2) {
        return _clearInterval.apply(this, arguments);
      }

      clearInterval.toString = function () {
        return _clearInterval.toString();
      };

      return clearInterval;
    }(function (timeout) {
      for (var i in this.intervals) {
        if (timeout === this.intervals[i].timeout) {
          clearInterval(this.intervals[i].timeout);
          delete this.intervals[i];
        }
      }
    })
  }, {
    key: "pause",
    value: function pause() {
      var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (paused === undefined) {
        this.paused = !this.paused;
      }

      this.paused = paused;

      if (this.paused) {
        var _iterator2 = _createForOfIteratorHelper(this.timeouts),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                callback = _step2$value[0],
                timeout = _step2$value[1];

            if (timeout.fired) {
              this.timeouts["delete"](timeout.timeout);
              continue;
            }

            clearTimeout(timeout.timeout);
            timeout.paused = true;
            timeout.time = Math.max(0, timeout.time - (Date.now() - timeout.created));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        for (var i in this.intervals) {
          clearInterval(this.intervals[i].timeout);
        }
      } else {
        var _iterator3 = _createForOfIteratorHelper(this.timeouts),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _step3$value = _slicedToArray(_step3.value, 2),
                _callback = _step3$value[0],
                _timeout = _step3$value[1];

            if (!_timeout.paused) {
              continue;
            }

            if (_timeout.fired) {
              this.timeouts["delete"](_timeout.timeout);
              continue;
            }

            _timeout.timeout = setTimeout(_timeout.callback, _timeout.time);
            _timeout.paused = false;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        for (var _i2 in this.intervals) {
          if (!this.intervals[_i2].timeout.paused) {
            continue;
          }

          this.intervals[_i2].timeout.paused = false;
          this.intervals[_i2].timeout = setInterval(this.intervals[_i2].callback, this.intervals[_i2].time);
        }

        var _iterator4 = _createForOfIteratorHelper(this.unpauseCallbacks),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _step4$value = _slicedToArray(_step4.value, 2),
                _callback2 = _step4$value[1];

            _callback2();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        this.unpauseCallbacks.clear();
      }

      var _iterator5 = _createForOfIteratorHelper(this.viewLists),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _step5$value = _slicedToArray(_step5.value, 2),
              tag = _step5$value[0],
              viewList = _step5$value[1];

          viewList.pause(!!paused);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      for (var _i3 in this.tags) {
        if (Array.isArray(this.tags[_i3])) {
          for (var j in this.tags[_i3]) {
            this.tags[_i3][j].pause(!!paused);
          }

          continue;
        }

        this.tags[_i3].pause(!!paused);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$nodes,
          _this4 = this;

      var parentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var insertPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (parentNode instanceof View) {
        parentNode = parentNode.firstNode.parentNode;
      }

      if (insertPoint instanceof View) {
        insertPoint = insertPoint.firstNode;
      }

      if (this.firstNode) {
        return this.reRender(parentNode, insertPoint);
      }

      this.dispatchEvent(new CustomEvent('render'));
      var templateParsed = this.template instanceof DocumentFragment ? this.template.cloneNode(true) : View.templates.has(this.template);
      var subDoc = templateParsed ? this.template instanceof DocumentFragment ? templateParsed : View.templates.get(this.template).cloneNode(true) : document.createRange().createContextualFragment(this.template);

      if (!templateParsed && !(this.template instanceof DocumentFragment)) {
        View.templates.set(this.template, subDoc.cloneNode(true));
      }

      this.mainView || this.preRuleSet.apply(subDoc, this);
      this.mapTags(subDoc);
      this.mainView || this.ruleSet.apply(subDoc, this);

      if (window.devMode === true) {
        this.firstNode = document.createComment("Template ".concat(this._id, " Start"));
        this.lastNode = document.createComment("Template ".concat(this._id, " End"));
      } else {
        this.firstNode = document.createTextNode('');
        this.lastNode = document.createTextNode('');
      }

      (_this$nodes = this.nodes).push.apply(_this$nodes, [this.firstNode].concat(_toConsumableArray(Array.from(subDoc.childNodes)), [this.lastNode]));

      this.postRender(parentNode);
      this.dispatchEvent(new CustomEvent('rendered'));

      if (!this.dispatchAttach()) {
        return;
      }

      if (parentNode) {
        var rootNode = parentNode.getRootNode();

        if (insertPoint) {
          parentNode.insertBefore(this.firstNode, insertPoint);
          parentNode.insertBefore(this.lastNode, insertPoint);
        } else {
          parentNode.appendChild(this.firstNode);
          parentNode.appendChild(this.lastNode);
        }

        parentNode.insertBefore(subDoc, this.lastNode);
        moveIndex++;

        if (rootNode.isConnected) {
          this.attached(rootNode, parentNode);
          this.dispatchAttached(rootNode, parentNode);
        } else {
          var firstDomAttach = function firstDomAttach(event) {
            if (!event.target.isConnected) {
              return;
            }

            _this4.attached(rootNode, parentNode);

            _this4.dispatchAttached(rootNode, parentNode);

            parentNode.removeEventListener('cvDomAttached', firstDomAttach);
          };

          parentNode.addEventListener('cvDomAttached', firstDomAttach);
        }
      }

      this.renderComplete(this.nodes);
      return this.nodes;
    }
  }, {
    key: "dispatchAttach",
    value: function dispatchAttach() {
      return this.dispatchEvent(new CustomEvent('attach', {
        cancelable: true,
        target: this
      }));
    }
  }, {
    key: "dispatchAttached",
    value: function dispatchAttached(rootNode, parentNode) {
      var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      this.dispatchEvent(new CustomEvent('attached', {
        detail: {
          view: view || this,
          node: parentNode,
          root: rootNode,
          mainView: this
        }
      }));
      this.dispatchDomAttached(view);

      var _iterator6 = _createForOfIteratorHelper(this.nodesAttached.items()),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var callback = _step6.value;
          callback(rootNode, parentNode);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "dispatchDomAttached",
    value: function dispatchDomAttached(view) {
      var _this5 = this;

      this.nodes.filter(function (n) {
        return n.nodeType !== Node.COMMENT_NODE;
      }).forEach(function (child) {
        if (!child.matches) {
          return;
        }

        _Dom.Dom.mapTags(child, false, function (tag, walker) {
          if (!tag.matches) {
            return;
          }

          tag.dispatchEvent(new CustomEvent('cvDomAttached', {
            target: tag,
            detail: {
              view: view || _this5,
              mainView: _this5
            }
          }));
        });

        child.dispatchEvent(new CustomEvent('cvDomAttached', {
          target: child,
          detail: {
            view: view || _this5,
            mainView: _this5
          }
        }));
      });
    }
  }, {
    key: "reRender",
    value: function reRender(parentNode, insertPoint) {
      var willReRender = this.dispatchEvent(new CustomEvent('reRender'), {
        cancelable: true,
        target: this
      });

      if (!willReRender) {
        return;
      }

      var subDoc = new DocumentFragment();

      if (this.firstNode.isConnected) {
        var detach = this.nodesDetached.items();

        for (var i in detach) {
          detach[i]();
        }
      }

      subDoc.append.apply(subDoc, _toConsumableArray(this.nodes));

      if (parentNode) {
        if (insertPoint) {
          parentNode.insertBefore(this.firstNode, insertPoint);
          parentNode.insertBefore(this.lastNode, insertPoint);
        } else {
          parentNode.appendChild(this.firstNode);
          parentNode.appendChild(this.lastNode);
        }

        parentNode.insertBefore(subDoc, this.lastNode);
        this.dispatchEvent(new CustomEvent('reRendered'), {
          cancelable: true,
          target: this
        });
        var rootNode = parentNode.getRootNode();

        if (rootNode.isConnected) {
          this.attached(rootNode, parentNode);
          this.dispatchAttached(rootNode, parentNode);
        }
      }

      return this.nodes;
    }
  }, {
    key: "mapTags",
    value: function mapTags(subDoc) {
      var _this6 = this;

      _Dom.Dom.mapTags(subDoc, false, function (tag, walker) {
        if (tag[dontParse]) {
          return;
        }

        if (tag.matches) {
          tag = _this6.mapInterpolatableTag(tag);
          tag = tag.matches('[cv-template]') && _this6.mapTemplateTag(tag) || tag;
          tag = tag.matches('[cv-slot]') && _this6.mapSlotTag(tag) || tag;
          tag = tag.matches('[cv-prerender]') && _this6.mapPrendererTag(tag) || tag;
          tag = tag.matches('[cv-link]') && _this6.mapLinkTag(tag) || tag;
          tag = tag.matches('[cv-attr]') && _this6.mapAttrTag(tag) || tag;
          tag = tag.matches('[cv-expand]') && _this6.mapExpandableTag(tag) || tag;
          tag = tag.matches('[cv-ref]') && _this6.mapRefTag(tag) || tag;
          tag = tag.matches('[cv-on]') && _this6.mapOnTag(tag) || tag;
          tag = tag.matches('[cv-each]') && _this6.mapEachTag(tag) || tag;
          tag = tag.matches('[cv-bind]') && _this6.mapBindTag(tag) || tag;
          tag = tag.matches('[cv-with]') && _this6.mapWithTag(tag) || tag;
          tag = tag.matches('[cv-if]') && _this6.mapIfTag(tag) || tag;
          tag = tag.matches('[cv-view]') && _this6.mapViewTag(tag) || tag;
        } else {
          tag = _this6.mapInterpolatableTag(tag);
        }

        if (tag !== walker.currentNode) {
          walker.currentNode = tag;
        }
      });
    }
  }, {
    key: "mapExpandableTag",
    value: function mapExpandableTag(tag) {
      /*/
      const tagCompiler = this.compileExpandableTag(tag);
      	const newTag = tagCompiler(this);
      	tag.replaceWith(newTag);
      	return newTag;
      /*/
      var existing = tag[expandBind];

      if (existing) {
        existing();
        tag[expandBind] = false;
      }

      var _Bindable$resolve = _Bindable.Bindable.resolve(this.args, tag.getAttribute('cv-expand'), true),
          _Bindable$resolve2 = _slicedToArray(_Bindable$resolve, 2),
          proxy = _Bindable$resolve2[0],
          expandProperty = _Bindable$resolve2[1];

      tag.removeAttribute('cv-expand');

      if (!proxy[expandProperty]) {
        proxy[expandProperty] = {};
      }

      proxy[expandProperty] = _Bindable.Bindable.make(proxy[expandProperty]);
      this.onRemove(tag[expandBind] = proxy[expandProperty].bindTo(function (v, k, t, d, p) {
        if (d || v === undefined) {
          tag.removeAttribute(k, v);
          return;
        }

        if (v === null) {
          tag.setAttribute(k, '');
          return;
        }

        tag.setAttribute(k, v);
      })); // let expandProperty = tag.getAttribute('cv-expand');
      // let expandArg = Bindable.makeBindable(
      // 	this.args[expandProperty] || {}
      // );
      // tag.removeAttribute('cv-expand');
      // for(let i in expandArg)
      // {
      // 	if(i === 'name' || i === 'type')
      // 	{
      // 		continue;
      // 	}
      // 	let debind = expandArg.bindTo(i, ((tag,i)=>(v)=>{
      // 		tag.setAttribute(i, v);
      // 	})(tag,i));
      // 	this.onRemove(()=>{
      // 		debind();
      // 		if(expandArg.isBound())
      // 		{
      // 			Bindable.clearBindings(expandArg);
      // 		}
      // 	});
      // }

      return tag; //*/
    }
  }, {
    key: "compileExpandableTag",
    value: function compileExpandableTag(sourceTag) {
      return function (bindingView) {
        var tag = sourceTag.cloneNode(true);
        var expandProperty = tag.getAttribute('cv-expand');

        var expandArg = _Bindable.Bindable.make(bindingView.args[expandProperty] || {});

        tag.removeAttribute('cv-expand');

        var _loop = function _loop(i) {
          if (i === 'name' || i === 'type') {
            return "continue";
          }

          var debind = expandArg.bindTo(i, function (tag, i) {
            return function (v) {
              tag.setAttribute(i, v);
            };
          }(tag, i));
          bindingView.onRemove(function () {
            debind();

            if (expandArg.isBound()) {
              _Bindable.Bindable.clearBindings(expandArg);
            }
          });
        };

        for (var i in expandArg) {
          var _ret = _loop(i);

          if (_ret === "continue") continue;
        }

        return tag;
      };
    }
  }, {
    key: "mapAttrTag",
    value: function mapAttrTag(tag) {
      //*/
      var tagCompiler = this.compileAttrTag(tag);
      var newTag = tagCompiler(this);
      tag.replaceWith(newTag);
      return newTag;
      /*/
      	let attrProperty = tag.getAttribute('cv-attr');
      	tag.removeAttribute('cv-attr');
      	let pairs = attrProperty.split(',');
      let attrs = pairs.map((p) => p.split(':'));
      	for (let i in attrs)
      {
      	let proxy        = this.args;
      	let bindProperty = attrs[i][1];
      	let property     = bindProperty;
      		if(bindProperty.match(/\./))
      	{
      		[proxy, property] = Bindable.resolve(
      			this.args
      			, bindProperty
      			, true
      		);
      	}
      		let attrib = attrs[i][0];
      		this.onRemove(proxy.bindTo(
      		property
      		, (v)=>{
      			if(v == null)
      			{
      				tag.setAttribute(attrib, '');
      				return;
      			}
      			tag.setAttribute(attrib, v);
      		}
      	));
      }
      	return tag;
      	//*/
    }
  }, {
    key: "compileAttrTag",
    value: function compileAttrTag(sourceTag) {
      var attrProperty = sourceTag.getAttribute('cv-attr');
      var pairs = attrProperty.split(',');
      var attrs = pairs.map(function (p) {
        return p.split(':');
      });
      sourceTag.removeAttribute('cv-attr');
      return function (bindingView) {
        var tag = sourceTag.cloneNode(true);

        var _loop2 = function _loop2(i) {
          var bindProperty = attrs[i][1] || attrs[i][0];

          var _Bindable$resolve3 = _Bindable.Bindable.resolve(bindingView.args, bindProperty, true),
              _Bindable$resolve4 = _slicedToArray(_Bindable$resolve3, 2),
              proxy = _Bindable$resolve4[0],
              property = _Bindable$resolve4[1];

          var attrib = attrs[i][0];
          bindingView.onRemove(proxy.bindTo(property, function (v, k, t, d) {
            if (d || v === undefined) {
              tag.removeAttribute(attrib, v);
              return;
            }

            if (v === null) {
              tag.setAttribute(attrib, '');
              return;
            }

            tag.setAttribute(attrib, v);
          }));
        };

        for (var i in attrs) {
          _loop2(i);
        }

        return tag;
      };
    }
  }, {
    key: "mapInterpolatableTag",
    value: function mapInterpolatableTag(tag) {
      var _this7 = this;

      var regex = this.interpolateRegex;

      if (tag.nodeType === Node.TEXT_NODE) {
        var original = tag.nodeValue;

        if (!this.interpolatable(original)) {
          return tag;
        }

        var header = 0;
        var match;

        var _loop3 = function _loop3() {
          var bindProperty = match[2];
          var unsafeHtml = false;
          var unsafeView = false;
          var propertySplit = bindProperty.split('|');
          var transformer = false;

          if (propertySplit.length > 1) {
            transformer = _this7.stringTransformer(propertySplit.slice(1));
            bindProperty = propertySplit[0];
          }

          if (bindProperty.substr(0, 2) === '$$') {
            unsafeHtml = true;
            unsafeView = true;
            bindProperty = bindProperty.substr(2);
          }

          if (bindProperty.substr(0, 1) === '$') {
            unsafeHtml = true;
            bindProperty = bindProperty.substr(1);
          }

          if (bindProperty.substr(0, 3) === '000') {
            expand = true;
            bindProperty = bindProperty.substr(3);
            return "continue";
          }

          var staticPrefix = original.substring(header, match.index);
          header = match.index + match[1].length;
          var staticNode = document.createTextNode(staticPrefix);
          staticNode[dontParse] = true;
          tag.parentNode.insertBefore(staticNode, tag);
          var dynamicNode = void 0;

          if (unsafeHtml) {
            dynamicNode = document.createElement('div');
          } else {
            dynamicNode = document.createTextNode('');
          }

          dynamicNode[dontParse] = true;
          var proxy = _this7.args;
          var property = bindProperty;

          if (bindProperty.match(/\./)) {
            var _Bindable$resolve5 = _Bindable.Bindable.resolve(_this7.args, bindProperty, true);

            var _Bindable$resolve6 = _slicedToArray(_Bindable$resolve5, 2);

            proxy = _Bindable$resolve6[0];
            property = _Bindable$resolve6[1];
          }

          tag.parentNode.insertBefore(dynamicNode, tag);

          if (_typeof(proxy) !== 'object') {
            return "break";
          }

          proxy = _Bindable.Bindable.make(proxy);
          var debind = proxy.bindTo(property, function (v, k, t) {
            if (t[k] !== v && (t[k] instanceof View || t[k] instanceof Node || t[k] instanceof _Tag.Tag)) {
              if (!t[k].preserve) {
                t[k].remove();
              }
            }

            dynamicNode.nodeValue = '';

            if (unsafeView && !(v instanceof View)) {
              var _v;

              var unsafeTemplate = (_v = v) !== null && _v !== void 0 ? _v : '';
              v = new View(_this7.args, _this7);
              v.template = unsafeTemplate;
            }

            if (transformer) {
              v = transformer(v);
            }

            if (v instanceof View) {
              var onAttach = function onAttach(rootNode, parentNode) {
                v.dispatchAttached(rootNode, parentNode, _this7);
              };

              _this7.nodesAttached.add(onAttach);

              v.render(tag.parentNode, dynamicNode);

              var cleanup = function cleanup() {
                if (!v.preserve) {
                  v.remove();
                }
              };

              _this7.onRemove(cleanup);

              v.onRemove(function () {
                _this7.nodesAttached.remove(onAttach);

                _this7._onRemove.remove(cleanup);
              });
            } else if (v instanceof Node) {
              tag.parentNode.insertBefore(v, dynamicNode);

              _this7.onRemove(function () {
                return v.remove();
              });
            } else if (v instanceof _Tag.Tag) {
              tag.parentNode.insertBefore(v.node, dynamicNode);

              _this7.onRemove(function () {
                return v.remove();
              });
            } else {
              if (v instanceof Object && v.__toString instanceof Function) {
                v = v.__toString();
              }

              if (unsafeHtml) {
                dynamicNode.innerHTML = v;
              } else {
                dynamicNode.nodeValue = v;
              }
            }

            dynamicNode[dontParse] = true;
          });

          _this7.onRemove(debind);
        };

        while (match = regex.exec(original)) {
          var _ret2 = _loop3();

          if (_ret2 === "continue") continue;
          if (_ret2 === "break") break;
        }

        var staticSuffix = original.substring(header);
        var staticNode = document.createTextNode(staticSuffix);
        staticNode[dontParse] = true;
        tag.parentNode.insertBefore(staticNode, tag);
        tag.nodeValue = '';
      } else if (tag.nodeType === Node.ELEMENT_NODE) {
        var _loop4 = function _loop4(i) {
          if (!_this7.interpolatable(tag.attributes[i].value)) {
            return "continue";
          }

          var header = 0;
          var match = void 0;
          var original = tag.attributes[i].value;
          var attribute = tag.attributes[i];
          var bindProperties = {};
          var segments = [];

          while (match = regex.exec(original)) {
            segments.push(original.substring(header, match.index));

            if (!bindProperties[match[2]]) {
              bindProperties[match[2]] = [];
            }

            bindProperties[match[2]].push(segments.length);
            segments.push(match[1]);
            header = match.index + match[1].length;
          }

          segments.push(original.substring(header));

          var _loop5 = function _loop5(j) {
            var proxy = _this7.args;
            var property = j;
            var propertySplit = j.split('|');
            var transformer = false;
            var longProperty = j;

            if (propertySplit.length > 1) {
              transformer = _this7.stringTransformer(propertySplit.slice(1));
              property = propertySplit[0];
            }

            if (property.match(/\./)) {
              var _Bindable$resolve7 = _Bindable.Bindable.resolve(_this7.args, property, true);

              var _Bindable$resolve8 = _slicedToArray(_Bindable$resolve7, 2);

              proxy = _Bindable$resolve8[0];
              property = _Bindable$resolve8[1];
            }

            var matching = [];
            var bindProperty = j;
            var matchingSegments = bindProperties[longProperty]; // const changeAttribute = (v, k, t, d) => {
            // 	tag.setAttribute(attribute.name, segments.join(''));
            // };

            _this7.onRemove(proxy.bindTo(property, function (v, k, t, d) {
              if (transformer) {
                v = transformer(v);
              }

              for (var _i4 in bindProperties) {
                for (var _j in bindProperties[longProperty]) {
                  segments[bindProperties[longProperty][_j]] = t[_i4];

                  if (k === property) {
                    segments[bindProperties[longProperty][_j]] = v;
                  }
                }
              }

              if (!_this7.paused) {
                // changeAttribute(v,k,t,d);
                tag.setAttribute(attribute.name, segments.join(''));
              } else {
                // this.unpauseCallbacks.set(attribute, () => changeAttribute(v,k,t,d));
                _this7.unpauseCallbacks.set(attribute, function () {
                  return tag.setAttribute(attribute.name, segments.join(''));
                });
              }
            }));

            _this7.onRemove(function () {
              if (!proxy.isBound()) {
                _Bindable.Bindable.clearBindings(proxy);
              }
            });
          };

          for (var j in bindProperties) {
            _loop5(j);
          }
        };

        for (var i = 0; i < tag.attributes.length; i++) {
          var _ret3 = _loop4(i);

          if (_ret3 === "continue") continue;
        }
      }

      return tag;
    }
  }, {
    key: "mapRefTag",
    value: function mapRefTag(tag) {
      var refAttr = tag.getAttribute('cv-ref');

      var _refAttr$split = refAttr.split(':'),
          _refAttr$split2 = _slicedToArray(_refAttr$split, 3),
          refProp = _refAttr$split2[0],
          _refAttr$split2$ = _refAttr$split2[1],
          refClassname = _refAttr$split2$ === void 0 ? null : _refAttr$split2$,
          _refAttr$split2$2 = _refAttr$split2[2],
          refKey = _refAttr$split2$2 === void 0 ? null : _refAttr$split2$2;

      var refClass = _Tag.Tag;

      if (refClassname) {
        refClass = this.stringToClass(refClassname);
      }

      tag.removeAttribute('cv-ref');
      Object.defineProperty(tag, '___tag___', {
        enumerable: false,
        writable: true
      });
      this.onRemove(function () {
        tag.___tag___ = null;
        tag.remove();
      });
      var parent = this;
      var direct = this;

      if (this.viewList) {
        parent = this.viewList.parent; // if(!this.viewList.parent.tags[refProp])
        // {
        // 	this.viewList.parent.tags[refProp] = [];
        // }
        // let refKeyVal = this.args[refKey];
        // this.viewList.parent.tags[refProp][refKeyVal] = new refClass(
        // 	tag, this, refProp, refKeyVal
        // );
      } else {// this.tags[refProp] = new refClass(
        // 	tag, this, refProp
        // );
      }

      var tagObject = new refClass(tag, this, refProp, undefined, direct);
      tag.___tag___ = tagObject;
      this.tags[refProp] = tagObject;

      while (parent) {
        var refKeyVal = this.args[refKey];

        if (refKeyVal !== undefined) {
          if (!parent.tags[refProp]) {
            parent.tags[refProp] = [];
          }

          parent.tags[refProp][refKeyVal] = tagObject;
        } else {
          parent.tags[refProp] = tagObject;
        }

        if (!parent.parent) {
          break;
        }

        parent = parent.parent;
      }

      return tag;
    }
  }, {
    key: "mapBindTag",
    value: function mapBindTag(tag) {
      var _this8 = this;

      var bindArg = tag.getAttribute('cv-bind');
      var proxy = this.args;
      var property = bindArg;
      var top = null;

      if (bindArg.match(/\./)) {
        var _Bindable$resolve9 = _Bindable.Bindable.resolve(this.args, bindArg, true);

        var _Bindable$resolve10 = _slicedToArray(_Bindable$resolve9, 3);

        proxy = _Bindable$resolve10[0];
        property = _Bindable$resolve10[1];
        top = _Bindable$resolve10[2];
      }

      if (proxy !== this.args) {
        this.subBindings[bindArg] = this.subBindings[bindArg] || [];
        this.onRemove(this.args.bindTo(top, function () {
          while (_this8.subBindings.length) {
            _this8.subBindings.shift()();
          }
        }));
      }

      var unsafeHtml = false;

      if (property.substr(0, 1) === '$') {
        property = property.substr(1);
        unsafeHtml = true;
      }

      var debind = proxy.bindTo(property, function (v, k, t, d, p) {
        if ((p instanceof View || p instanceof Node || p instanceof _Tag.Tag) && p !== v) {
          p.remove();
        }

        var autoChangedEvent = new CustomEvent('cvAutoChanged', {
          bubbles: true
        });

        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag.tagName)) {
          var _type = tag.getAttribute('type');

          if (_type && _type.toLowerCase() === 'checkbox') {
            tag.checked = !!v;
            tag.dispatchEvent(autoChangedEvent);
          } else if (_type && _type.toLowerCase() === 'radio') {
            tag.checked = v == tag.value;
            tag.dispatchEvent(autoChangedEvent);
          } else if (_type !== 'file') {
            if (tag.tagName === 'SELECT') {
              var selectOption = function selectOption() {
                for (var i = 0; i < tag.options.length; i++) {
                  var option = tag.options[i];

                  if (option.value == v) {
                    tag.selectedIndex = i;
                  }
                }
              };

              selectOption();

              _this8.nodesAttached.add(selectOption);
            } else {
              tag.value = v == null ? '' : v;
            }

            tag.dispatchEvent(autoChangedEvent);
          }
        } else {
          if (v instanceof View) {
            var _iterator7 = _createForOfIteratorHelper(tag.childNodes),
                _step7;

            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var node = _step7.value;
                node.remove();
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }

            var onAttach = function onAttach(parentNode) {
              v.dispatchDomAttached(_this8); // if(v.nodes.length && v.dispatchAttach())
              // {
              // 	v.attached(parentNode.getRootNode(), parentNode, this);
              // 	v.dispatchAttached(parentNode.getRootNode(), parentNode, this);
              // }
            };

            _this8.nodesAttached.add(onAttach);

            v.render(tag);
            v.onRemove(function () {
              return _this8.nodesAttached.remove(onAttach);
            });
          } else if (v instanceof Node) {
            tag.insert(v);
          } else if (v instanceof _Tag.Tag) {
            tag.append(v.node);
          } else if (unsafeHtml) {
            if (tag.innerHTML !== v) {
              v = String(v);

              if (tag.innerHTML === v.substring(0, tag.innerHTML.length)) {
                tag.innerHTML += v.substring(tag.innerHTML.length);
              } else {
                var _iterator8 = _createForOfIteratorHelper(tag.childNodes),
                    _step8;

                try {
                  for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                    var _node = _step8.value;

                    _node.remove();
                  }
                } catch (err) {
                  _iterator8.e(err);
                } finally {
                  _iterator8.f();
                }

                tag.innerHTML = v;
              }

              _Dom.Dom.mapTags(tag, false, function (t) {
                return t[dontParse] = true;
              });
            }
          } else {
            if (tag.textContent !== v) {
              var _iterator9 = _createForOfIteratorHelper(tag.childNodes),
                  _step9;

              try {
                for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                  var _node2 = _step9.value;

                  _node2.remove();
                }
              } catch (err) {
                _iterator9.e(err);
              } finally {
                _iterator9.f();
              }

              tag.textContent = v;
            }
          }
        }
      });

      if (proxy !== this.args) {
        this.subBindings[bindArg].push(debind);
      }

      this.onRemove(debind);
      var type = tag.getAttribute('type');
      var multi = tag.getAttribute('multiple');

      var inputListener = function inputListener(event) {
        if (event.target !== tag) {
          return;
        }

        if (type && type.toLowerCase() === 'checkbox') {
          if (tag.checked) {
            proxy[property] = event.target.getAttribute('value');
          } else {
            proxy[property] = false;
          }
        } else if (event.target.matches('[contenteditable=true]')) {
          proxy[property] = event.target.innerHTML;
        } else if (type === 'file' && multi) {
          var files = Array.from(event.target.files);

          var current = proxy[property] || _Bindable.Bindable.onDeck(proxy, property);

          if (!current || !files.length) {
            proxy[property] = files;
          } else {
            var _loop6 = function _loop6(i) {
              if (files[i] !== current[i]) {
                files[i].toJSON = function () {
                  return {
                    name: file[i].name,
                    size: file[i].size,
                    type: file[i].type,
                    date: file[i].lastModified
                  };
                };

                current[i] = files[i];
                return "break";
              }
            };

            for (var i in files) {
              var _ret4 = _loop6(i);

              if (_ret4 === "break") break;
            }
          }
        } else if (type === 'file' && !multi && event.target.files.length) {
          var _file = event.target.files.item(0);

          _file.toJSON = function () {
            return {
              name: _file.name,
              size: _file.size,
              type: _file.type,
              date: _file.lastModified
            };
          };

          proxy[property] = _file;
        } else {
          proxy[property] = event.target.value;
        }
      };

      if (type === 'file' || type === 'radio') {
        tag.addEventListener('change', inputListener);
      } else {
        tag.addEventListener('input', inputListener);
        tag.addEventListener('change', inputListener);
        tag.addEventListener('value-changed', inputListener);
      }

      this.onRemove(function () {
        if (type === 'file' || type === 'radio') {
          tag.removeEventListener('change', inputListener);
        } else {
          tag.removeEventListener('input', inputListener);
          tag.removeEventListener('change', inputListener);
          tag.removeEventListener('value-changed', inputListener);
        }
      });
      tag.removeAttribute('cv-bind');
      return tag;
    }
  }, {
    key: "mapOnTag",
    value: function mapOnTag(tag) {
      var _this9 = this;

      var referents = String(tag.getAttribute('cv-on'));
      referents.split(';').map(function (a) {
        return a.split(':');
      }).forEach(function (a) {
        a = a.map(function (a) {
          return a.trim();
        });
        var argLen = a.length;
        var eventName = String(a.shift()).trim();
        var callbackName = String(a.shift() || eventName).trim();
        var eventFlags = String(a.shift() || '').trim();
        var argList = [];
        var groups = /(\w+)(?:\(([$\w\s-'",]+)\))?/.exec(callbackName);

        if (groups) {
          callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');

          if (groups[2]) {
            argList = groups[2].split(',').map(function (s) {
              return s.trim();
            });
          }
        }

        if (!argList.length) {
          argList.push('$event');
        }

        if (!eventName || argLen === 1) {
          eventName = callbackName;
        }

        var eventMethod;
        var parent = _this9;

        var _loop7 = function _loop7() {
          var controller = parent.controller;

          if (typeof controller[callbackName] === 'function') {
            eventMethod = function eventMethod() {
              controller[callbackName].apply(controller, arguments);
            };

            return "break";
          } else if (typeof parent[callbackName] === 'function') {
            eventMethod = function eventMethod() {
              var _parent;

              (_parent = parent)[callbackName].apply(_parent, arguments);
            };

            return "break";
          }

          if (parent.parent) {
            parent = parent.parent;
          } else {
            return "break";
          }
        };

        while (parent) {
          var _ret5 = _loop7();

          if (_ret5 === "break") break;
        }

        var eventListener = function eventListener(event) {
          var argRefs = argList.map(function (arg) {
            var match;

            if (Number(arg) == arg) {
              return arg;
            } else if (arg === 'event' || arg === '$event') {
              return event;
            } else if (arg === '$view') {
              return parent;
            } else if (arg === '$controller') {
              return controller;
            } else if (arg === '$tag') {
              return tag;
            } else if (arg === '$parent') {
              return _this9.parent;
            } else if (arg === '$subview') {
              return _this9;
            } else if (arg in _this9.args) {
              return _this9.args[arg];
            } else if (match = /^['"]([\w-]+?)["']$/.exec(arg)) {
              return match[1];
            }
          });

          if (!(typeof eventMethod === 'function')) {
            throw new Error("".concat(callbackName, " is not defined on View object.") + "\n" + "Tag:" + "\n" + "".concat(tag.outerHTML));
          }

          eventMethod.apply(void 0, _toConsumableArray(argRefs));
        };

        var eventOptions = {};

        if (eventFlags.includes('p')) {
          eventOptions.passive = true;
        } else if (eventFlags.includes('P')) {
          eventOptions.passive = false;
        }

        if (eventFlags.includes('c')) {
          eventOptions.capture = true;
        } else if (eventFlags.includes('C')) {
          eventOptions.capture = false;
        }

        if (eventFlags.includes('o')) {
          eventOptions.once = true;
        } else if (eventFlags.includes('O')) {
          eventOptions.once = false;
        }

        switch (eventName) {
          case '_init':
            eventListener();
            break;

          case '_attach':
            _this9.nodesAttached.add(eventListener);

            break;

          case '_detach':
            _this9.nodesDetached.add(eventListener);

            break;

          default:
            tag.addEventListener(eventName, eventListener, eventOptions);

            _this9.onRemove(function () {
              tag.removeEventListener(eventName, eventListener, eventOptions);
            });

            break;
        }

        return [eventName, callbackName, argList];
      });
      tag.removeAttribute('cv-on');
      return tag;
    }
  }, {
    key: "mapLinkTag",
    value: function mapLinkTag(tag) {
      /*/
      const tagCompiler = this.compileLinkTag(tag);
      	const newTag = tagCompiler(this);
      	tag.replaceWith(newTag);
      	return newTag;
      /*/
      var linkAttr = tag.getAttribute('cv-link');
      tag.setAttribute('href', linkAttr);

      var linkClick = function linkClick(event) {
        event.preventDefault();

        if (linkAttr.substring(0, 4) === 'http' || linkAttr.substring(0, 2) === '//') {
          window.open(tag.getAttribute('href', linkAttr));
          return;
        }

        _Router.Router.go(tag.getAttribute('href'));
      };

      tag.addEventListener('click', linkClick);
      this.onRemove(function (tag, eventListener) {
        return function () {
          tag.removeEventListener('click', eventListener);
          tag = undefined;
          eventListener = undefined;
        };
      }(tag, linkClick));
      tag.removeAttribute('cv-link');
      return tag; //*/
    }
  }, {
    key: "compileLinkTag",
    value: function compileLinkTag(sourceTag) {
      var linkAttr = sourceTag.getAttribute('cv-link');
      sourceTag.removeAttribute('cv-link');
      return function (bindingView) {
        var tag = sourceTag.cloneNode(true);
        tag.setAttribute('href', linkAttr);
        return tag;
      };
    }
  }, {
    key: "mapPrendererTag",
    value: function mapPrendererTag(tag) {
      var prerenderAttr = tag.getAttribute('cv-prerender');
      var prerendering = window.prerenderer || navigator.userAgent.match(/prerender/i);

      if (prerendering) {
        window.prerenderer = window.prerenderer || true;
      }

      if (prerenderAttr === 'never' && prerendering || prerenderAttr === 'only' && !prerendering) {
        tag.parentNode.removeChild(tag);
      }

      return tag;
    }
  }, {
    key: "mapWithTag",
    value: function mapWithTag(tag) {
      var _this10 = this;

      var withAttr = tag.getAttribute('cv-with');
      var carryAttr = tag.getAttribute('cv-carry');
      var viewAttr = tag.getAttribute('cv-view');
      tag.removeAttribute('cv-with');
      tag.removeAttribute('cv-carry');
      tag.removeAttribute('cv-view');
      var viewClass = viewAttr ? this.stringToClass(viewAttr) : View;
      var subTemplate = new DocumentFragment();

      _toConsumableArray(tag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n);
      });

      var carryProps = [];

      if (carryAttr) {
        carryProps = carryAttr.split(',').map(function (s) {
          return s.trim();
        });
      }

      var debind = this.args.bindTo(withAttr, function (v, k, t, d) {
        if (_this10.withViews.has(tag)) {
          _this10.withViews["delete"](tag);
        }

        while (tag.firstChild) {
          tag.removeChild(tag.firstChild);
        }

        var view = new viewClass({}, _this10);

        _this10.onRemove(function (view) {
          return function () {
            view.remove();
          };
        }(view));

        view.template = subTemplate;

        var _loop8 = function _loop8(i) {
          var debind = _this10.args.bindTo(carryProps[i], function (v, k) {
            view.args[k] = v;
          });

          view.onRemove(debind);

          _this10.onRemove(function () {
            debind();
            view.remove();
          });
        };

        for (var i in carryProps) {
          _loop8(i);
        }

        var _loop9 = function _loop9(_i5) {
          if (_typeof(v) !== 'object') {
            return "continue";
          }

          v = _Bindable.Bindable.make(v);
          var debind = v.bindTo(_i5, function (vv, kk, tt, dd) {
            if (!dd) {
              view.args[kk] = vv;
            } else if (kk in view.args) {
              delete view.args[kk];
            }
          });
          var debindUp = view.args.bindTo(_i5, function (vv, kk, tt, dd) {
            if (!dd) {
              v[kk] = vv;
            } else if (kk in v) {
              delete v[kk];
            }
          });

          _this10.onRemove(function () {
            debind();

            if (!v.isBound()) {
              _Bindable.Bindable.clearBindings(v);
            }

            view.remove();
          });

          view.onRemove(function () {
            debind();

            if (!v.isBound()) {
              _Bindable.Bindable.clearBindings(v);
            }
          });
        };

        for (var _i5 in v) {
          var _ret6 = _loop9(_i5);

          if (_ret6 === "continue") continue;
        }

        view.render(tag);

        _this10.withViews.set(tag, view);
      });
      this.onRemove(function () {
        _this10.withViews["delete"](tag);

        debind();
      });
      return tag;
    }
  }, {
    key: "mapViewTag",
    value: function mapViewTag(tag) {
      var _this11 = this;

      var viewAttr = tag.getAttribute('cv-view');
      tag.removeAttribute('cv-view');
      var subTemplate = new DocumentFragment();

      _toConsumableArray(tag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n);
      });

      var parts = viewAttr.split(':');
      var viewClass = parts.pop() ? this.stringToClass(viewAttr) : View;
      var viewName = parts.shift();
      var view = new viewClass(this.args, this);
      this.views.set(tag, view);

      if (viewName) {
        this.views.set(viewName, view);
      }

      this.onRemove(function (view) {
        return function () {
          view.remove();

          _this11.views["delete"](tag);

          _this11.views["delete"](viewName);
        };
      }(view));
      view.template = subTemplate;
      view.render(tag);
      return tag;
    }
  }, {
    key: "mapEachTag",
    value: function mapEachTag(tag) {
      var _this12 = this;

      var eachAttr = tag.getAttribute('cv-each');
      var viewAttr = tag.getAttribute('cv-view');
      tag.removeAttribute('cv-each');
      tag.removeAttribute('cv-view');
      var viewClass = viewAttr ? this.stringToClass(viewAttr) : View;
      var subTemplate = new DocumentFragment();

      _toConsumableArray(tag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n);
      });

      var _eachAttr$split = eachAttr.split(':'),
          _eachAttr$split2 = _slicedToArray(_eachAttr$split, 3),
          eachProp = _eachAttr$split2[0],
          asProp = _eachAttr$split2[1],
          keyProp = _eachAttr$split2[2];

      var debind = this.args.bindTo(eachProp, function (v, k, t, d, p) {
        if (v instanceof _Bag.Bag) {
          v = v.list;
        }

        if (_this12.viewLists.has(tag)) {
          _this12.viewLists.get(tag).remove();
        }

        var viewList = new _ViewList.ViewList(subTemplate, asProp, v, _this12, keyProp, viewClass);

        var viewListRemover = function viewListRemover() {
          return viewList.remove();
        };

        _this12.onRemove(viewListRemover);

        viewList.onRemove(function () {
          return _this12._onRemove.remove(viewListRemover);
        });

        var debindA = _this12.args.bindTo(function (v, k, t, d) {
          if (k === '_id') {
            return;
          }

          if (!d) {
            viewList.subArgs[k] = v;
          } else {
            if (k in viewList.subArgs) {
              delete viewList.subArgs[k];
            }
          }
        });

        var debindB = viewList.args.bindTo(function (v, k, t, d, p) {
          if (k === '_id' || k === 'value' || String(k).substring(0, 3) === '___') {
            return;
          }

          if (!d) {
            if (k in _this12.args) {
              _this12.args[k] = v;
            }
          } else {
            delete _this12.args[k];
          }
        });
        viewList.onRemove(debindA);
        viewList.onRemove(debindB);

        _this12.onRemove(debindA);

        _this12.onRemove(debindB);

        while (tag.firstChild) {
          tag.removeChild(tag.firstChild);
        }

        _this12.viewLists.set(tag, viewList);

        viewList.render(tag);
      });
      this.onRemove(debind);
      return tag;
    }
  }, {
    key: "mapIfTag",
    value: function mapIfTag(tag) {
      var _this13 = this;

      var sourceTag = tag;
      var viewProperty = sourceTag.getAttribute('cv-view');
      var ifProperty = sourceTag.getAttribute('cv-if');
      var isProperty = sourceTag.getAttribute('cv-is');
      var inverted = false;
      var defined = false;
      sourceTag.removeAttribute('cv-view');
      sourceTag.removeAttribute('cv-if');
      sourceTag.removeAttribute('cv-is');
      var viewClass = viewProperty ? this.stringToClass(viewProperty) : View;

      if (ifProperty.substr(0, 1) === '!') {
        ifProperty = ifProperty.substr(1);
        inverted = true;
      }

      if (ifProperty.substr(0, 1) === '?') {
        ifProperty = ifProperty.substr(1);
        defined = true;
      }

      var subTemplate = new DocumentFragment();

      _toConsumableArray(sourceTag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n);
      });

      var bindingView = this;
      var ifDoc = new DocumentFragment();
      var view = new viewClass(Object.assign({}, this.args), bindingView);
      this.onRemove(view.tags.bindTo(function (v, k) {
        _this13.tags[k] = v;
      }));
      view.template = subTemplate;
      var proxy = bindingView.args;
      var property = ifProperty;

      if (ifProperty.match(/\./)) {
        var _Bindable$resolve11 = _Bindable.Bindable.resolve(bindingView.args, ifProperty, true);

        var _Bindable$resolve12 = _slicedToArray(_Bindable$resolve11, 2);

        proxy = _Bindable$resolve12[0];
        property = _Bindable$resolve12[1];
      }

      view.render(ifDoc);
      var propertyDebind = proxy.bindTo(property, function (v, k) {
        var o = v;

        if (defined) {
          v = v !== null && v !== undefined;
        }

        if (v instanceof _Bag.Bag) {
          v = v.list;
        }

        if (Array.isArray(v)) {
          v = !!v.length;
        }

        if (isProperty !== null) {
          v = o == isProperty;
        }

        if (inverted) {
          v = !v;
        }

        if (v) {
          tag.appendChild(ifDoc);

          _toConsumableArray(ifDoc.childNodes).forEach(function (node) {
            return _Dom.Dom.mapTags(node, false, function (tag, walker) {
              if (!tag.matches) {
                return;
              }

              tag.dispatchEvent(new CustomEvent('cvDomAttached', {
                target: tag,
                detail: {
                  view: view || _this13,
                  mainView: _this13
                }
              }));
            });
          });
        } else {
          view.nodes.forEach(function (n) {
            return ifDoc.appendChild(n);
          });

          _Dom.Dom.mapTags(ifDoc, false, function (tag, walker) {
            if (!tag.matches) {
              return;
            }

            new CustomEvent('cvDomDetached', {
              target: tag,
              detail: {
                view: view || _this13,
                mainView: _this13
              }
            });
          });
        }
      }, {
        children: Array.isArray(proxy[property])
      }); // const propertyDebind = this.args.bindChain(property, onUpdate);

      bindingView.onRemove(propertyDebind);
      var debindA = this.args.bindTo(function (v, k, t, d) {
        if (k === '_id') {
          return;
        }

        if (!d) {
          view.args[k] = v;
        } else if (k in view.args) {
          delete view.args[k];
        }
      });
      var debindB = view.args.bindTo(function (v, k, t, d, p) {
        if (k === '_id' || String(k).substring(0, 3) === '___') {
          return;
        }

        if (k in _this13.args) {
          if (!d) {
            _this13.args[k] = v;
          } else {
            delete _this13.args[k];
          }
        }
      });

      var viewDebind = function viewDebind() {
        propertyDebind();
        debindA();
        debindB();

        bindingView._onRemove.remove(propertyDebind); // bindingView._onRemove.remove(bindableDebind);

      };

      bindingView.onRemove(viewDebind);
      this.onRemove(function () {
        debindA();
        debindB();
        view.remove();

        if (bindingView !== _this13) {
          bindingView.remove();
        }
      });
      return tag;
    }
  }, {
    key: "compileIfTag",
    value: function compileIfTag(sourceTag) {
      var ifProperty = sourceTag.getAttribute('cv-if');
      var inverted = false;
      sourceTag.removeAttribute('cv-if');

      if (ifProperty.substr(0, 1) === '!') {
        ifProperty = ifProperty.substr(1);
        inverted = true;
      }

      var subTemplate = new DocumentFragment();

      _toConsumableArray(sourceTag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n.cloneNode(true));
      });

      return function (bindingView) {
        var tag = sourceTag.cloneNode();
        var ifDoc = new DocumentFragment();
        var view = new View({}, bindingView);
        view.template = subTemplate; // view.parent   = bindingView;

        bindingView.syncBind(view);
        var proxy = bindingView.args;
        var property = ifProperty;

        if (ifProperty.match(/\./)) {
          var _Bindable$resolve13 = _Bindable.Bindable.resolve(bindingView.args, ifProperty, true);

          var _Bindable$resolve14 = _slicedToArray(_Bindable$resolve13, 2);

          proxy = _Bindable$resolve14[0];
          property = _Bindable$resolve14[1];
        }

        var hasRendered = false;
        var propertyDebind = proxy.bindTo(property, function (v, k) {
          if (!hasRendered) {
            var renderDoc = bindingView.args[property] || inverted ? tag : ifDoc;
            view.render(renderDoc);
            hasRendered = true;
            return;
          }

          if (Array.isArray(v)) {
            v = !!v.length;
          }

          if (inverted) {
            v = !v;
          }

          if (v) {
            tag.appendChild(ifDoc);
          } else {
            view.nodes.forEach(function (n) {
              return ifDoc.appendChild(n);
            });
          }
        }); // let cleaner = bindingView;
        // while(cleaner.parent)
        // {
        // 	cleaner = cleaner.parent;
        // }

        bindingView.onRemove(propertyDebind);

        var bindableDebind = function bindableDebind() {
          if (!proxy.isBound()) {
            _Bindable.Bindable.clearBindings(proxy);
          }
        };

        var viewDebind = function viewDebind() {
          propertyDebind();
          bindableDebind();

          bindingView._onRemove.remove(propertyDebind);

          bindingView._onRemove.remove(bindableDebind);
        };

        view.onRemove(viewDebind);
        return tag;
      };
    }
  }, {
    key: "mapTemplateTag",
    value: function mapTemplateTag(tag) {
      var templateName = tag.getAttribute('cv-template');
      tag.removeAttribute('cv-template');

      this.templates[templateName] = function () {
        return tag.tagName === 'TEMPLATE' ? tag.content.cloneNode(true) : new DocumentFragment(tag.innerHTML);
      };

      this.rendered.then(function () {
        return tag.remove();
      });
      return tag;
    }
  }, {
    key: "mapSlotTag",
    value: function mapSlotTag(tag) {
      var templateName = tag.getAttribute('cv-slot');
      var getTemplate = this.templates[templateName];

      if (!getTemplate) {
        var parent = this;

        while (parent) {
          getTemplate = parent.templates[templateName];

          if (getTemplate) {
            break;
          }

          parent = this.parent;
        }

        if (!getTemplate) {
          console.error("Template ".concat(templateName, " not found."));
          return;
        }
      }

      var template = getTemplate();
      tag.removeAttribute('cv-slot');

      while (tag.firstChild) {
        tag.firstChild.remove();
      }

      tag.appendChild(template);
      return tag;
    }
  }, {
    key: "syncBind",
    value: function syncBind(subView) {
      var _this14 = this;

      var debindA = this.args.bindTo(function (v, k, t, d) {
        if (k === '_id') {
          return;
        }

        if (subView.args[k] !== v) {
          subView.args[k] = v;
        }
      });
      var debindB = subView.args.bindTo(function (v, k, t, d, p) {
        if (k === '_id') {
          return;
        }

        var newRef = v;
        var oldRef = p;

        if (newRef instanceof View) {
          newRef = newRef.___ref___;
        }

        if (oldRef instanceof View) {
          oldRef = oldRef.___ref___;
        }

        if (newRef !== oldRef && oldRef instanceof View) {
          p.remove();
        }

        if (k in _this14.args) {
          _this14.args[k] = v;
        }
      });
      this.onRemove(debindA);
      this.onRemove(debindB);
      subView.onRemove(function () {
        _this14._onRemove.remove(debindA);

        _this14._onRemove.remove(debindB);
      });
    }
  }, {
    key: "postRender",
    value: function postRender(parentNode) {}
  }, {
    key: "attached",
    value: function attached(parentNode) {}
  }, {
    key: "interpolatable",
    value: function interpolatable(str) {
      return !!String(str).match(this.interpolateRegex);
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this15 = this;

      var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var remover = function remover() {
        for (var i in _this15.tags) {
          if (Array.isArray(_this15.tags[i])) {
            _this15.tags[i] && _this15.tags[i].forEach(function (t) {
              return t.remove();
            });

            _this15.tags[i].splice(0);
          } else {
            _this15.tags[i] && _this15.tags[i].remove();
            _this15.tags[i] = undefined;
          }
        }

        for (var _i6 in _this15.nodes) {
          _this15.nodes[_i6] && _this15.nodes[_i6].dispatchEvent(new Event('cvDomDetached'));
          _this15.nodes[_i6] && _this15.nodes[_i6].remove();
          _this15.nodes[_i6] = undefined;
        }

        _this15.nodes.splice(0);

        _this15.firstNode = _this15.lastNode = undefined;
      };

      if (now) {
        remover();
      } else {
        requestAnimationFrame(remover);
      }

      var callbacks = this._onRemove.items();

      var _iterator10 = _createForOfIteratorHelper(callbacks),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var callback = _step10.value;
          callback();

          this._onRemove.remove(callback);
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }

      var _iterator11 = _createForOfIteratorHelper(this.cleanup),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var cleanup = _step11.value;
          cleanup && cleanup();
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }

      this.cleanup.length = 0;

      var _iterator12 = _createForOfIteratorHelper(this.viewLists),
          _step12;

      try {
        for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
          var _step12$value = _slicedToArray(_step12.value, 2),
              tag = _step12$value[0],
              viewList = _step12$value[1];

          viewList.remove();
        }
      } catch (err) {
        _iterator12.e(err);
      } finally {
        _iterator12.f();
      }

      this.viewLists.clear();

      var _iterator13 = _createForOfIteratorHelper(this.timeouts),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var _step13$value = _slicedToArray(_step13.value, 2),
              _callback3 = _step13$value[0],
              timeout = _step13$value[1];

          clearTimeout(timeout.timeout);
          this.timeouts["delete"](timeout.timeout);
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      var _iterator14 = _createForOfIteratorHelper(this.intervals),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var interval = _step14.value;
          clearInterval(interval);
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      this.intervals.length = 0;

      var _iterator15 = _createForOfIteratorHelper(this.frames),
          _step15;

      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var frame = _step15.value;
          frame();
        }
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }

      this.frames.length = 0;
      this.preRuleSet.purge();
      this.ruleSet.purge();
      this.removed = true;
    }
  }, {
    key: "findTag",
    value: function findTag(selector) {
      for (var i in this.nodes) {
        var result = void 0;

        if (!this.nodes[i].querySelector) {
          continue;
        }

        if (this.nodes[i].matches(selector)) {
          return new _Tag.Tag(this.nodes[i], this, undefined, undefined, this);
        }

        if (result = this.nodes[i].querySelector(selector)) {
          return new _Tag.Tag(result, this, undefined, undefined, this);
        }
      }
    }
  }, {
    key: "findTags",
    value: function findTags(selector) {
      var _this16 = this;

      return this.nodes.filter(function (n) {
        return n.querySelectorAll;
      }).map(function (n) {
        return _toConsumableArray(n.querySelectorAll(selector));
      }).flat().map(function (n) {
        return new _Tag.Tag(n, _this16, undefined, undefined, _this16);
      }) || [];
    }
  }, {
    key: "onRemove",
    value: function onRemove(callback) {
      this._onRemove.add(callback);
    }
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "beforeUpdate",
    value: function beforeUpdate(args) {}
  }, {
    key: "afterUpdate",
    value: function afterUpdate(args) {}
  }, {
    key: "stringTransformer",
    value: function stringTransformer(methods) {
      var _this17 = this;

      return function (x) {
        for (var m in methods) {
          var parent = _this17;
          var method = methods[m];

          while (parent && !parent[method]) {
            parent = parent.parent;
          }

          if (!parent) {
            return;
          }

          x = parent[methods[m]](x);
        }

        return x;
      };
    }
  }, {
    key: "stringToClass",
    value: function stringToClass(refClassname) {
      if (View.refClasses.has(refClassname)) {
        return View.refClasses.get(refClassname);
      }

      var refClassSplit = refClassname.split('/');
      var refShortClass = refClassSplit[refClassSplit.length - 1];

      var refClass = require(refClassname);

      View.refClasses.set(refClassname, refClass[refShortClass]);
      return refClass[refShortClass];
    }
  }, {
    key: "preventParsing",
    value: function preventParsing(node) {
      node[dontParse] = true;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.nodes.map(function (n) {
        return n.outerHTML;
      }).join(' ');
    }
  }, {
    key: "listen",
    value: function listen(node, eventName, callback, options) {
      var _this18 = this;

      if (typeof node === 'string') {
        options = callback;
        callback = eventName;
        eventName = node;
        node = this;
      }

      if (node instanceof View) {
        return this.listen(node.nodes, eventName, callback, options);
      }

      if (Array.isArray(node)) {
        return node.map(function (n) {
          return _this18.listen(n, eventName, callback, options);
        }).forEach(function (r) {
          return r();
        });
      }

      if (node instanceof _Tag.Tag) {
        return this.listen(node.element, eventName, callback, options);
      }

      node.addEventListener(eventName, callback, options);

      var remove = function remove() {
        return node.removeEventListener(eventName, callback, options);
      };

      var remover = function remover() {
        remove();

        remove = function remove() {};
      };

      this.onRemove(function () {
        return remover();
      });
      return remover;
    }
  }, {
    key: "detach",
    value: function detach() {
      for (var n in this.nodes) {
        this.nodes[n].remove();
      }

      return this.nodes;
    }
  }], [{
    key: "from",
    value: function from(template) {
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var view = new this(args, parent);
      view.template = template;
      return view;
    }
  }, {
    key: "isView",
    value: function isView() {
      return View;
    }
  }, {
    key: "uuid",
    value: function uuid() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      });
    }
  }]);

  return View;
}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));

exports.View = View;
Object.defineProperty(View, 'templates', {
  value: new Map()
});
Object.defineProperty(View, 'refClasses', {
  value: new Map()
});
  })();
});

require.register("curvature/base/ViewList.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewList = void 0;

var _Bindable = require("./Bindable");

var _SetMap = require("./SetMap");

var _View = require("./View");

var _Bag = require("./Bag");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ViewList = /*#__PURE__*/function () {
  function ViewList(template, subProperty, list, parent) {
    var _this = this;

    var keyProperty = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var viewClass = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

    _classCallCheck(this, ViewList);

    this.removed = false;
    this.args = _Bindable.Bindable.makeBindable({});
    this.args.value = _Bindable.Bindable.makeBindable(list || {});
    this.subArgs = _Bindable.Bindable.makeBindable({});
    this.views = [];
    this.cleanup = [];
    this.viewClass = viewClass || _View.View;
    this._onRemove = new _Bag.Bag();
    this.template = template;
    this.subProperty = subProperty;
    this.keyProperty = keyProperty;
    this.tag = null;
    this.downDebind = [];
    this.upDebind = [];
    this.paused = false;
    this.parent = parent;
    this.rendered = new Promise(function (accept, reject) {
      Object.defineProperty(_this, 'renderComplete', {
        configurable: false,
        writable: true,
        value: accept
      });
    });
    this.willReRender = false;

    this.args.___before(function (t, e, s, o, a) {
      if (e == 'bindTo') {
        return;
      }

      _this.paused = true;
    });

    this.args.___after(function (t, e, s, o, a) {
      if (e == 'bindTo') {
        return;
      }

      _this.paused = s.length > 1;

      _this.reRender();
    });

    var debind = this.args.value.bindTo(function (v, k, t, d) {
      if (_this.paused) {
        return;
      }

      var kk = k;

      if (_typeof(k) === 'symbol') {
        return;
      }

      if (isNaN(k)) {
        kk = '_' + k;
      }

      if (d) {
        if (_this.views[kk]) {
          _this.views[kk].remove();
        }

        delete _this.views[kk];

        for (var i in _this.views) {
          if (isNaN(i)) {
            _this.views[i].args[_this.keyProperty] = i.substr(1);
            continue;
          }

          _this.views[i].args[_this.keyProperty] = i;
        }
      } else if (!_this.views[kk]) {
        cancelAnimationFrame(_this.willReRender);
        _this.willReRender = requestAnimationFrame(function () {
          _this.reRender();
        });
      } else if (_this.views[kk] && _this.views[kk].args) {
        _this.views[kk].args[_this.keyProperty] = k;
        _this.views[kk].args[_this.subProperty] = v;
      }
    });

    this._onRemove.add(debind);

    Object.preventExtensions(this);
  }

  _createClass(ViewList, [{
    key: "render",
    value: function render(tag) {
      var _this2 = this;

      var renders = [];

      var _iterator = _createForOfIteratorHelper(this.views),
          _step;

      try {
        var _loop = function _loop() {
          var view = _step.value;
          view.render(tag);
          renders.push(view.rendered.then(function () {
            return view;
          }));
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.tag = tag;
      Promise.all(renders).then(function (views) {
        return _this2.renderComplete(views);
      });
      this.parent.dispatchEvent(new CustomEvent('listRendered', {
        detail: {
          detail: {
            key: this.subProperty,
            value: this.args.value
          }
        }
      }));
    }
  }, {
    key: "reRender",
    value: function reRender() {
      var _this3 = this;

      if (this.paused || !this.tag) {
        return;
      }

      var views = [];
      var existingViews = new _SetMap.SetMap();

      for (var i in this.views) {
        var view = this.views[i];
        var rawValue = view.args[this.subProperty];
        existingViews.add(rawValue, view);
        views[i] = view;
      }

      var finalViews = [];
      var finalViewSet = new Set();
      this.downDebind.length && this.downDebind.forEach(function (d) {
        return d && d();
      });
      this.upDebind.length && this.upDebind.forEach(function (d) {
        return d && d();
      });
      this.upDebind.length = 0;
      this.downDebind.length = 0;
      var minKey = Infinity;
      var anteMinKey = Infinity;

      var _loop2 = function _loop2(_i) {
        var found = false;
        var k = _i;

        if (isNaN(k)) {
          k = '_' + _i;
        } else if (String(k).length) {
          k = Number(k);
        }

        if (_this3.args.value[_i] !== undefined && existingViews.has(_this3.args.value[_i])) {
          var existingView = existingViews.getOne(_this3.args.value[_i]);

          if (existingView) {
            existingView.args[_this3.keyProperty] = _i;
            finalViews[k] = existingView;
            finalViewSet.add(existingView);
            found = true;

            if (!isNaN(k)) {
              minKey = Math.min(minKey, k);
              k > 0 && (anteMinKey = Math.min(anteMinKey, k));
            }

            existingViews.remove(_this3.args.value[_i], existingView);
          }
        }

        if (!found) {
          var viewArgs = {};

          var _view = finalViews[k] = new _this3.viewClass(viewArgs, _this3.parent);

          if (!isNaN(k)) {
            minKey = Math.min(minKey, k);
            k > 0 && (anteMinKey = Math.min(anteMinKey, k));
          }

          finalViews[k].template = _this3.template;
          finalViews[k].viewList = _this3;
          finalViews[k].args[_this3.keyProperty] = _i;
          finalViews[k].args[_this3.subProperty] = _this3.args.value[_i];
          _this3.upDebind[k] = viewArgs.bindTo(_this3.subProperty, function (v, k, t, d) {
            var index = viewArgs[_this3.keyProperty];

            if (d) {
              delete _this3.args.value[index];
              return;
            }

            _this3.args.value[index] = v;
          });
          _this3.downDebind[k] = _this3.subArgs.bindTo(function (v, k, t, d) {
            if (d) {
              delete viewArgs[k];
              return;
            }

            viewArgs[k] = v;
          });

          var upDebind = function upDebind() {
            _this3.upDebind.filter(function (x) {
              return x;
            }).forEach(function (d) {
              return d();
            });

            _this3.upDebind.length = 0;
          };

          var downDebind = function downDebind() {
            _this3.downDebind.filter(function (x) {
              return x;
            }).forEach(function (d) {
              return d();
            });

            _this3.downDebind.length = 0;
          };

          _view.onRemove(function () {
            _this3._onRemove.remove(upDebind);

            _this3._onRemove.remove(downDebind);

            _this3.upDebind[k] && _this3.upDebind[k]();
            _this3.downDebind[k] && _this3.downDebind[k]();
            delete _this3.upDebind[k];
            delete _this3.downDebind[k];
          });

          _this3._onRemove.add(upDebind);

          _this3._onRemove.add(downDebind);

          viewArgs[_this3.subProperty] = _this3.args.value[_i];
        }
      };

      for (var _i in this.args.value) {
        _loop2(_i);
      }

      for (var _i2 in views) {
        if (!finalViewSet.has(views[_i2])) {
          views[_i2].remove();
        }
      }

      if (Array.isArray(this.args.value)) {
        var localMin = minKey === 0 && finalViews[1] !== undefined && finalViews.length > 1 || anteMinKey === Infinity ? minKey : anteMinKey;

        var renderRecurse = function renderRecurse() {
          var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var ii = finalViews.length - i - 1;

          while (ii > localMin && finalViews[ii] === undefined) {
            ii--;
          }

          if (ii < localMin) {
            return Promise.resolve();
          }

          if (finalViews[ii] === _this3.views[ii]) {
            if (finalViews[ii] && !finalViews[ii].firstNode) {
              finalViews[ii].render(_this3.tag, finalViews[ii + 1]);
              return finalViews[ii].rendered.then(function () {
                return renderRecurse(Number(i) + 1);
              });
            } else {
              if (i % 500) {
                return renderRecurse(Number(i) + 1);
              } else {
                return new Promise(function (accept) {
                  return requestAnimationFrame(function () {
                    return accept(renderRecurse(Number(i) + 1));
                  });
                });
              }
            }
          }

          finalViews[ii].render(_this3.tag, finalViews[ii + 1]);

          _this3.views.splice(ii, 0, finalViews[ii]);

          return finalViews[ii].rendered.then(function () {
            return renderRecurse(i + 1);
          });
        };

        this.rendered = renderRecurse();
      } else {
        var renders = [];
        var leftovers = Object.assign({}, finalViews);

        var isInt = function isInt(x) {
          return parseInt(x) === x - 0;
        };

        var keys = Object.keys(finalViews).sort(function (a, b) {
          if (isInt(a) && isInt(b)) {
            return Math.sign(a - b);
          }

          if (!isInt(a) && !isInt(b)) {
            return 0;
          }

          if (!isInt(a) && isInt(b)) {
            return -1;
          }

          if (isInt(a) && !isInt(b)) {
            return 1;
          }
        });

        var _iterator2 = _createForOfIteratorHelper(keys),
            _step2;

        try {
          var _loop3 = function _loop3() {
            var i = _step2.value;
            delete leftovers[i];

            if (finalViews[i].firstNode && finalViews[i] === _this3.views[i]) {
              return "continue";
            }

            finalViews[i].render(_this3.tag);
            renders.push(finalViews[i].rendered.then(function () {
              return finalViews[i];
            }));
          };

          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _ret = _loop3();

            if (_ret === "continue") continue;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        for (var _i3 in leftovers) {
          delete this.args.views[_i3];
          leftovers.remove();
        }

        this.rendered = Promise.all(renders);
      }

      for (var _i4 in finalViews) {
        if (isNaN(_i4)) {
          finalViews[_i4].args[this.keyProperty] = _i4.substr(1);
          continue;
        }

        finalViews[_i4].args[this.keyProperty] = _i4;
      }

      this.views = Array.isArray(this.args.value) ? [].concat(finalViews) : finalViews;
      finalViewSet.clear();
      this.willReRender = false;
      this.parent.dispatchEvent(new CustomEvent('listRendered', {
        detail: {
          detail: {
            key: this.subProperty,
            value: this.args.value
          }
        }
      }));
    }
  }, {
    key: "pause",
    value: function pause() {
      var _pause = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      for (var i in this.views) {
        this.views[i].pause(_pause);
      }
    }
  }, {
    key: "onRemove",
    value: function onRemove(callback) {
      this._onRemove.add(callback);
    }
  }, {
    key: "remove",
    value: function remove() {
      for (var i in this.views) {
        this.views[i].remove();
      }

      var onRemove = this._onRemove.items();

      for (var _i5 in onRemove) {
        this._onRemove.remove(onRemove[_i5]);

        onRemove[_i5]();
      }

      var cleanup;

      while (this.cleanup.length) {
        cleanup = this.cleanup.pop();
        cleanup();
      }

      this.views = [];

      while (this.tag && this.tag.firstChild) {
        this.tag.removeChild(this.tag.firstChild);
      }

      if (this.subArgs) {
        _Bindable.Bindable.clearBindings(this.subArgs);
      }

      _Bindable.Bindable.clearBindings(this.args);

      if (this.args.value && !this.args.value.isBound()) {
        _Bindable.Bindable.clearBindings(this.args.value);
      }

      this.removed = true;
    }
  }]);

  return ViewList;
}();

exports.ViewList = ViewList;
  })();
});

require.register("curvature/mixin/EventTargetMixin.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventTargetMixin = void 0;

var _Mixin = require("../base/Mixin");

var _EventTargetMixin;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _EventTarget = Symbol('Target');

var EventTargetMixin = (_EventTargetMixin = {}, _defineProperty(_EventTargetMixin, _Mixin.Mixin.Constructor, function () {
  try {
    this[_EventTarget] = new EventTarget();
  } catch (error) {
    this[_EventTarget] = document.createDocumentFragment();
  }
}), _defineProperty(_EventTargetMixin, "dispatchEvent", function dispatchEvent() {
  var _this$_EventTarget;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var event = args[0];

  if (typeof event === 'string') {
    event = new CustomEvent(event);
    args[0] = event;
  }

  (_this$_EventTarget = this[_EventTarget]).dispatchEvent.apply(_this$_EventTarget, args);

  var defaultHandler = "on".concat(event.type[0].toUpperCase() + event.type.slice(1));

  if (typeof this[defaultHandler] === 'function') {
    this[defaultHandler](event);
  }

  return event.returnValue;
}), _defineProperty(_EventTargetMixin, "addEventListener", function addEventListener() {
  var _this$_EventTarget2;

  (_this$_EventTarget2 = this[_EventTarget]).addEventListener.apply(_this$_EventTarget2, arguments);
}), _defineProperty(_EventTargetMixin, "removeEventListener", function removeEventListener() {
  var _this$_EventTarget3;

  (_this$_EventTarget3 = this[_EventTarget]).removeEventListener.apply(_this$_EventTarget3, arguments);
}), _EventTargetMixin);
exports.EventTargetMixin = EventTargetMixin;
  })();
});

require.register("curvature/mixin/PromiseMixin.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromiseMixin = void 0;

var _Mixin = require("../base/Mixin");

var _PromiseMixin;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Promise = Symbol('Promise');

var Accept = Symbol('Accept');
var Reject = Symbol('Reject');
var PromiseMixin = (_PromiseMixin = {}, _defineProperty(_PromiseMixin, _Mixin.Mixin.Constructor, function () {
  var _this = this;

  this[_Promise] = new Promise(function (accept, reject) {
    _this[Accept] = accept;
    _this[Reject] = reject;
  });
}), _defineProperty(_PromiseMixin, "then", function then() {
  var _this$_Promise;

  return (_this$_Promise = this[_Promise]).then.apply(_this$_Promise, arguments);
}), _defineProperty(_PromiseMixin, "catch", function _catch() {
  var _this$_Promise2;

  return (_this$_Promise2 = this[_Promise])["catch"].apply(_this$_Promise2, arguments);
}), _defineProperty(_PromiseMixin, "finally", function _finally() {
  var _this$_Promise3;

  return (_this$_Promise3 = this[_Promise])["finally"].apply(_this$_Promise3, arguments);
}), _PromiseMixin);
exports.PromiseMixin = PromiseMixin;
Object.defineProperty(PromiseMixin, 'Reject', {
  value: Reject
});
Object.defineProperty(PromiseMixin, 'Accept', {
  value: Accept
});
  })();
});

require.register("curvature/service/Service.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Service = void 0;

var _Router = require("../base/Router");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Service = /*#__PURE__*/function () {
  function Service() {
    _classCallCheck(this, Service);
  }

  _createClass(Service, null, [{
    key: "register",
    value: function register() {
      var _this = this;

      var script = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/time-service.js';
      var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';

      if (!('serviceWorker' in navigator)) {
        return Promise.reject('Service Workers not supported.');
      } // navigator.serviceWorker.startMessages();


      navigator.serviceWorker.addEventListener('message', function (event) {
        return _this.handleResponse(event);
      });
      navigator.serviceWorker.register(script, {
        scope: scope
      });
      navigator.serviceWorker.ready.then(function (registration) {
        return _this.worker = registration.active;
      });
      return navigator.serviceWorker.ready;
    }
  }, {
    key: "request",
    value: function request(_ref) {
      var _this2 = this;

      var command = _ref.command,
          args = _ref.args,
          echo = _ref.echo,
          notify = _ref.notify;
      var correlationId = Number(1 / Math.random()).toString(36);
      var getResponse = new Promise(function (accept) {
        _this2.incomplete.set(correlationId, accept);
      });
      this.worker.postMessage({
        broadcast: false,
        correlationId: correlationId,
        command: command,
        notify: notify,
        args: args,
        echo: echo
      });
      return getResponse;
    }
  }, {
    key: "broadcast",
    value: function broadcast(_ref2) {
      var _this3 = this;

      var command = _ref2.command,
          args = _ref2.args,
          echo = _ref2.echo,
          notify = _ref2.notify;
      var correlationId = Number(1 / Math.random()).toString(36);
      var getResponse = new Promise(function (accept) {
        _this3.incomplete.set(correlationId, accept);
      });
      this.worker.postMessage({
        broadcast: true,
        correlationId: correlationId,
        command: command,
        notify: notify,
        args: args,
        echo: echo
      });
      return getResponse;
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(event) {
      var packet = event.data;

      if (!packet.correlationId) {
        return;
      }

      if (!this.incomplete.has(packet.correlationId)) {
        if (packet.broadcast) {
          this.handleBroadcast(event);
        }

        return;
      }

      var getResponse = this.incomplete.get(packet.correlationId);
      this.incomplete["delete"](packet.correlationId);
      getResponse(packet.result);
    }
  }, {
    key: "handleRequest",
    value: function handleRequest(event) {
      var _this4 = this;

      var packet = event.data;
      var getResponse = Promise.resolve('Unexpected request.');

      if (packet.echo) {
        getResponse = Promise.resolve(packet.echo);
      } else if (packet.notify) {
        var args = packet.args || [];
        getResponse = globalThis.registration.getNotifications().then(function (notifyList) {
          var _globalThis$registrat;

          notifyList.forEach(function (notification) {
            return _this4.notifications.set(notification.tag, notification);
          });
          return (_globalThis$registrat = globalThis.registration).showNotification.apply(_globalThis$registrat, _toConsumableArray(args));
        }).then(function () {
          return globalThis.registration.getNotifications();
        }).then(function (notifyList) {
          var tag = event.data.args && event.data.args[1] && event.data.args[1].tag;
          var notifyClient = new Promise(function (accept) {
            var notifiers;

            if (_this4.notifyClients.has(tag)) {
              notifiers = _this4.notifyClients.get(tag);
            } else {
              notifiers = new Map();

              _this4.notifyClients.set(tag, notifiers);
            }

            notifiers.set(event.source, accept);
          });
          return notifyClient;
        });
      } else if (packet.command) {
        var command = packet.command;

        var _args = packet.args || [];

        var _iterator = _createForOfIteratorHelper(this.serviceHandlers),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var handler = _step.value;

            if (typeof handler[command] === 'function') {
              getResponse = handler[command].apply(handler, _toConsumableArray(_args));
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      if (_typeof(getResponse) !== Promise) {
        getResponse = Promise.resolve(getResponse);
      }

      if (packet.broadcast) {
        var options = {
          type: 'window',
          includeUncontrolled: true
        };
        var source = event.source.id;
        globalThis.clients.matchAll(options).then(function (clientList) {
          clientList.forEach(function (client) {
            getResponse.then(function (response) {
              return client.postMessage(_objectSpread(_objectSpread({}, packet), {}, {
                result: response,
                source: source
              }));
            });
          });
        });
      } else {
        getResponse.then(function (response) {
          return event.source.postMessage(_objectSpread(_objectSpread({}, packet), {}, {
            result: response
          }));
        });
      }
    }
  }, {
    key: "handleInstall",
    value: function handleInstall(event) {
      globalThis.skipWaiting();

      var _iterator2 = _createForOfIteratorHelper(this.pageHandlers),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var handler = _step2.value;

          if (typeof handler.handleInstall === 'function') {
            handler.handleInstall(event);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "handleActivate",
    value: function handleActivate(event) {
      var _iterator3 = _createForOfIteratorHelper(this.pageHandlers),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var handler = _step3.value;

          if (typeof handler.handleActivate === 'function') {
            handler.handleActivate(event);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "handleError",
    value: function handleError(event) {
      console.error(event);

      var _iterator4 = _createForOfIteratorHelper(this.pageHandlers),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var handler = _step4.value;

          if (typeof handler.handleError === 'function') {
            handler.handleError(event);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "handlePush",
    value: function handlePush(event) {// console.log('push', event);
    }
  }, {
    key: "handleSync",
    value: function handleSync(event) {// console.log('sync', event);
    }
  }, {
    key: "handlePeriodicSync",
    value: function handlePeriodicSync(event) {// console.log('periodic sync', event);
    }
  }, {
    key: "handleFetch",
    value: function handleFetch(event) {
      var _iterator5 = _createForOfIteratorHelper(this.pageHandlers),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var handler = _step5.value;

          if (typeof handler.handleFetch === 'function') {
            handler.handleFetch(event);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      if (event.defaultPrevented) {
        return;
      }

      var url = new URL(event.request.url);
      var path = url.pathname + url.search;

      var _iterator6 = _createForOfIteratorHelper(this.serviceHandlers),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _handler = _step6.value;
          var routes = _handler.routes;

          if (!routes) {
            continue;
          }

          _Router.Router.match(url.pathname, {
            routes: routes
          }).then(function (result) {
            if (result === undefined) {
              return;
            }

            event.respondWith(new Response(result));
          });
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "handleBroadcast",
    value: function handleBroadcast(event) {
      var _iterator7 = _createForOfIteratorHelper(this.pageHandlers),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var handler = _step7.value;

          if (typeof handler.handleBroadcast === 'function') {
            handler.handleBroadcast(event);
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "notify",
    value: function notify(title) {
      var _this5 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options.tag = options.tag || ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      });
      return new Promise(function (accept, reject) {
        Notification.requestPermission(function (result) {
          accept(result);
        });
      }).then(function (result) {
        return _this5.request({
          notify: true,
          args: [title, options]
        });
      });
    }
  }, {
    key: "handleNotifyClicked",
    value: function handleNotifyClicked(event) {
      if (this.notifyClients.has(event.notification.tag)) {
        var notifiers = this.notifyClients.get(event.notification.tag);
        var focusables = [];
        notifiers.forEach(function (notifier, client) {
          notifier({
            action: event.action,
            data: event.notification.data,
            click: Date.now(),
            time: event.notification.timestamp,
            tag: event.notification.tag
          });
          focusables.push(client);
        });

        while (focusables.length) {
          var client = focusables.pop();

          if (client.focus()) {
            break;
          }
        }

        this.notifyClients["delete"](event.notification.tag);
      }

      var _iterator8 = _createForOfIteratorHelper(this.pageHandlers),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var handler = _step8.value;

          if (typeof handler.handleNotifyClicked === 'function') {
            handler.handleNotifyClicked(event);
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      event.notification.close();
    }
  }, {
    key: "handleNotifyClosed",
    value: function handleNotifyClosed(event) {
      if (this.notifyClients.has(event.notification.tag)) {
        var notifiers = this.notifyClients.get(event.notification.tag);
        notifiers.forEach(function (notifier) {
          return notifier({
            action: undefined,
            data: event.notification.data,
            close: Date.now(),
            time: event.notification.timestamp,
            tag: event.notification.tag
          });
        });
      }

      if (this.notifyClients["delete"](event.notification.tag)) {
        var _iterator9 = _createForOfIteratorHelper(this.pageHandlers),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var handler = _step9.value;

            if (typeof handler.handleNotifyDismissed === 'function') {
              handler.handleNotifyDismissed(event);
            }
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      }

      var _iterator10 = _createForOfIteratorHelper(this.pageHandlers),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var _handler2 = _step10.value;

          if (typeof _handler2.handleNotifyClosed === 'function') {
            _handler2.handleNotifyClosed(event);
          }
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
    }
  }]);

  return Service;
}();

exports.Service = Service;
Object.defineProperty(Service, 'serviceHandlers', {
  value: new Set()
});
Object.defineProperty(Service, 'pageHandlers', {
  value: new Set()
});
Object.defineProperty(Service, 'incomplete', {
  value: new Map()
});
Object.defineProperty(Service, 'notifications', {
  value: new Map()
});
Object.defineProperty(Service, 'notifyClients', {
  value: new Map()
});
  })();
});
require.register("PageHandler.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageHandler = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PageHandler = /*#__PURE__*/function () {
  function PageHandler() {
    _classCallCheck(this, PageHandler);
  }

  _createClass(PageHandler, null, [{
    key: "handleBroadcast",
    value: function handleBroadcast(event) {
      console.log('Broadcast: ' + JSON.stringify(event.data.result));
    }
  }, {
    key: "handleInstall",
    value: function handleInstall(event) {// console.trace('install', event);
    }
  }, {
    key: "handleActivate",
    value: function handleActivate(event) {
      console.trace('activate', event);
    }
  }, {
    key: "handleError",
    value: function handleError(event) {
      console.trace('error', event);
    }
  }, {
    key: "handleNotifyClicked",
    value: function handleNotifyClicked(event) {
      console.trace('notifyClicked', event);
    }
  }, {
    key: "handleNotifyClosed",
    value: function handleNotifyClosed(event) {// console.trace('notifyClosed', event);
    }
  }, {
    key: "handleNotifyDismissed",
    value: function handleNotifyDismissed(event) {// console.trace('notifyDismissed', event);
    }
  }, {
    key: "handleFetch",
    value: function handleFetch(event) {// console.trace('fetch', event);
    }
  }]);

  return PageHandler;
}();

exports.PageHandler = PageHandler;
});

;require.register("ServiceHandler.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServiceHandler = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ServiceHandler = /*#__PURE__*/function () {
  function ServiceHandler() {
    _classCallCheck(this, ServiceHandler);
  }

  _createClass(ServiceHandler, null, [{
    key: "getTime",
    value: function getTime() {
      return String(new Date());
    }
  }, {
    key: "beeRequest",
    value: function beeRequest() {
      return fetch('https://seanm.free.beeceptor.com/').then(function (response) {
        return response.json();
      });
    }
  }]);

  return ServiceHandler;
}();

exports.ServiceHandler = ServiceHandler;

_defineProperty(ServiceHandler, "routes", {
  // '': () => Promise.resolve('index!!!')
  'other': function other() {
    return Promise.resolve('other!!!');
  } // , 'arg/%named': args => Promise.resolve(JSON.stringify(args))
  // , '*': args => Promise.resolve(JSON.stringify(args))

});
});

;require.register("time-service.js", function(exports, require, module) {
"use strict";

var _Service = require("curvature/service/Service");

var _ServiceHandler = require("./ServiceHandler");

var _PageHandler = require("./PageHandler");

globalThis.window = {
  location: {
    reload: function reload() {}
  }
};
importScripts("/vendor.js");
importScripts("/app.js");

_Service.Service.serviceHandlers.add(_ServiceHandler.ServiceHandler);

_Service.Service.pageHandlers.add(_PageHandler.PageHandler);

globalThis.addEventListener('install', function (event) {
  return _Service.Service.handleInstall(event);
});
globalThis.addEventListener('activate', function (event) {
  return _Service.Service.handleActivate(event);
});
globalThis.addEventListener('error', function (event) {
  return _Service.Service.handleActivate(event);
});
globalThis.addEventListener('message', function (event) {
  return _Service.Service.handleRequest(event);
});
globalThis.addEventListener('fetch', function (event) {
  return _Service.Service.handleFetch(event);
});
globalThis.addEventListener('push', function (event) {
  return _Service.Service.handlePush(event);
});
globalThis.addEventListener('notificationclose', function (event) {
  return _Service.Service.handleNotifyClosed(event);
});
globalThis.addEventListener('notificationclick', function (event) {
  return _Service.Service.handleNotifyClicked(event);
});
globalThis.addEventListener('sync', function (event) {
  return _Service.Service.handleSync(event);
});
globalThis.addEventListener('periodicsync', function (event) {
  return _Service.Service.handlePeriodicSync(event);
});
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('time-service');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9jdXJ2YXR1cmUvYmFzZS9CYWcuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvQmluZGFibGUuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvQ2FjaGUuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvQ29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9iYXNlL0RvbS5qcyIsIm5vZGVfbW9kdWxlcy9jdXJ2YXR1cmUvYmFzZS9NaXhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jdXJ2YXR1cmUvYmFzZS9Sb3V0ZXIuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvUm91dGVzLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9iYXNlL1J1bGVTZXQuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvU2V0TWFwLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9iYXNlL1RhZy5qcyIsIm5vZGVfbW9kdWxlcy9jdXJ2YXR1cmUvYmFzZS9WaWV3LmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9iYXNlL1ZpZXdMaXN0LmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9taXhpbi9FdmVudFRhcmdldE1peGluLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9taXhpbi9Qcm9taXNlTWl4aW4uanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL3NlcnZpY2UvU2VydmljZS5qcyIsImFwcC9QYWdlSGFuZGxlci5qcyIsImFwcC9TZXJ2aWNlSGFuZGxlci5qcyIsImFwcC90aW1lLXNlcnZpY2UuanMiXSwibmFtZXMiOlsiUGFnZUhhbmRsZXIiLCJldmVudCIsImNvbnNvbGUiLCJsb2ciLCJKU09OIiwic3RyaW5naWZ5IiwiZGF0YSIsInJlc3VsdCIsInRyYWNlIiwiU2VydmljZUhhbmRsZXIiLCJTdHJpbmciLCJEYXRlIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiUHJvbWlzZSIsInJlc29sdmUiLCJnbG9iYWxUaGlzIiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJpbXBvcnRTY3JpcHRzIiwiU2VydmljZSIsInNlcnZpY2VIYW5kbGVycyIsImFkZCIsInBhZ2VIYW5kbGVycyIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVJbnN0YWxsIiwiaGFuZGxlQWN0aXZhdGUiLCJoYW5kbGVSZXF1ZXN0IiwiaGFuZGxlRmV0Y2giLCJoYW5kbGVQdXNoIiwiaGFuZGxlTm90aWZ5Q2xvc2VkIiwiaGFuZGxlTm90aWZ5Q2xpY2tlZCIsImhhbmRsZVN5bmMiLCJoYW5kbGVQZXJpb2RpY1N5bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyK0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5ZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFpRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdmZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7SUN2Z0JhQSxXOzs7Ozs7O1dBRVoseUJBQXVCQyxLQUF2QixFQUNBO0FBQ0NDLGFBQU8sQ0FBQ0MsR0FBUixDQUFZLGdCQUFnQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVKLEtBQUssQ0FBQ0ssSUFBTixDQUFXQyxNQUExQixDQUE1QjtBQUNBOzs7V0FFRCx1QkFBcUJOLEtBQXJCLEVBQ0EsQ0FDQztBQUNBOzs7V0FFRCx3QkFBc0JBLEtBQXRCLEVBQ0E7QUFDQ0MsYUFBTyxDQUFDTSxLQUFSLENBQWMsVUFBZCxFQUEwQlAsS0FBMUI7QUFDQTs7O1dBRUQscUJBQW1CQSxLQUFuQixFQUNBO0FBQ0NDLGFBQU8sQ0FBQ00sS0FBUixDQUFjLE9BQWQsRUFBdUJQLEtBQXZCO0FBQ0E7OztXQUVELDZCQUEyQkEsS0FBM0IsRUFDQTtBQUNDQyxhQUFPLENBQUNNLEtBQVIsQ0FBYyxlQUFkLEVBQStCUCxLQUEvQjtBQUNBOzs7V0FFRCw0QkFBMEJBLEtBQTFCLEVBQ0EsQ0FDQztBQUNBOzs7V0FFRCwrQkFBNkJBLEtBQTdCLEVBQ0EsQ0FDQztBQUNBOzs7V0FFRCxxQkFBbUJBLEtBQW5CLEVBQ0EsQ0FDQztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDeENXUSxjOzs7Ozs7O1dBU1osbUJBQ0E7QUFDQyxhQUFPQyxNQUFNLENBQUMsSUFBSUMsSUFBSixFQUFELENBQWI7QUFDQTs7O1dBRUQsc0JBQ0E7QUFDQyxhQUFPQyxLQUFLLENBQUMsbUNBQUQsQ0FBTCxDQUNOQyxJQURNLENBQ0QsVUFBQUMsUUFBUTtBQUFBLGVBQUlBLFFBQVEsQ0FBQ0MsSUFBVCxFQUFKO0FBQUEsT0FEUCxDQUFQO0FBRUE7Ozs7Ozs7O2dCQWxCV04sYyxZQUVJO0FBQ2Y7QUFDQSxXQUFTO0FBQUEsV0FBTU8sT0FBTyxDQUFDQyxPQUFSLENBQWdCLFVBQWhCLENBQU47QUFBQSxHQUZNLENBR2Y7QUFDQTs7QUFKZSxDOzs7Ozs7QUNHakI7O0FBRUE7O0FBQ0E7O0FBUkFDLFVBQVUsQ0FBQ0MsTUFBWCxHQUFvQjtBQUFDQyxVQUFRLEVBQUM7QUFBQ0MsVUFBTSxFQUFFLGtCQUFNLENBQUU7QUFBakI7QUFBVixDQUFwQjtBQUVBQyxhQUFhLENBQUUsWUFBRixDQUFiO0FBQ0FBLGFBQWEsQ0FBRSxTQUFGLENBQWI7O0FBT0FDLGlCQUFRQyxlQUFSLENBQXdCQyxHQUF4QixDQUE2QmhCLDhCQUE3Qjs7QUFDQWMsaUJBQVFHLFlBQVIsQ0FBcUJELEdBQXJCLENBQTBCekIsd0JBQTFCOztBQUVBa0IsVUFBVSxDQUFDUyxnQkFBWCxDQUE0QixTQUE1QixFQUF3QyxVQUFBMUIsS0FBSztBQUFBLFNBQUlzQixpQkFBUUssYUFBUixDQUFzQjNCLEtBQXRCLENBQUo7QUFBQSxDQUE3QztBQUNBaUIsVUFBVSxDQUFDUyxnQkFBWCxDQUE0QixVQUE1QixFQUF3QyxVQUFBMUIsS0FBSztBQUFBLFNBQUlzQixpQkFBUU0sY0FBUixDQUF1QjVCLEtBQXZCLENBQUo7QUFBQSxDQUE3QztBQUNBaUIsVUFBVSxDQUFDUyxnQkFBWCxDQUE0QixPQUE1QixFQUF3QyxVQUFBMUIsS0FBSztBQUFBLFNBQUlzQixpQkFBUU0sY0FBUixDQUF1QjVCLEtBQXZCLENBQUo7QUFBQSxDQUE3QztBQUVBaUIsVUFBVSxDQUFDUyxnQkFBWCxDQUE0QixTQUE1QixFQUF1QyxVQUFBMUIsS0FBSztBQUFBLFNBQUlzQixpQkFBUU8sYUFBUixDQUFzQjdCLEtBQXRCLENBQUo7QUFBQSxDQUE1QztBQUNBaUIsVUFBVSxDQUFDUyxnQkFBWCxDQUE0QixPQUE1QixFQUF1QyxVQUFBMUIsS0FBSztBQUFBLFNBQUlzQixpQkFBUVEsV0FBUixDQUFvQjlCLEtBQXBCLENBQUo7QUFBQSxDQUE1QztBQUNBaUIsVUFBVSxDQUFDUyxnQkFBWCxDQUE0QixNQUE1QixFQUF1QyxVQUFBMUIsS0FBSztBQUFBLFNBQUlzQixpQkFBUVMsVUFBUixDQUFtQi9CLEtBQW5CLENBQUo7QUFBQSxDQUE1QztBQUVBaUIsVUFBVSxDQUFDUyxnQkFBWCxDQUE0QixtQkFBNUIsRUFBaUQsVUFBQTFCLEtBQUs7QUFBQSxTQUFJc0IsaUJBQVFVLGtCQUFSLENBQTJCaEMsS0FBM0IsQ0FBSjtBQUFBLENBQXREO0FBQ0FpQixVQUFVLENBQUNTLGdCQUFYLENBQTRCLG1CQUE1QixFQUFpRCxVQUFBMUIsS0FBSztBQUFBLFNBQUlzQixpQkFBUVcsbUJBQVIsQ0FBNEJqQyxLQUE1QixDQUFKO0FBQUEsQ0FBdEQ7QUFFQWlCLFVBQVUsQ0FBQ1MsZ0JBQVgsQ0FBNEIsTUFBNUIsRUFBNEMsVUFBQTFCLEtBQUs7QUFBQSxTQUFJc0IsaUJBQVFZLFVBQVIsQ0FBbUJsQyxLQUFuQixDQUFKO0FBQUEsQ0FBakQ7QUFDQWlCLFVBQVUsQ0FBQ1MsZ0JBQVgsQ0FBNEIsY0FBNUIsRUFBNEMsVUFBQTFCLEtBQUs7QUFBQSxTQUFJc0IsaUJBQVFhLGtCQUFSLENBQTJCbkMsS0FBM0IsQ0FBSjtBQUFBLENBQWpEIiwiZmlsZSI6ImRvY3MvdGltZS1zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvQmFnLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLkJhZyA9IHZvaWQgMDtcblxudmFyIF9CaW5kYWJsZSA9IHJlcXVpcmUoXCIuL0JpbmRhYmxlXCIpO1xuXG52YXIgX01peGluID0gcmVxdWlyZShcIi4vTWl4aW5cIik7XG5cbnZhciBfRXZlbnRUYXJnZXRNaXhpbiA9IHJlcXVpcmUoXCIuLi9taXhpbi9FdmVudFRhcmdldE1peGluXCIpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gZWxzZSBpZiAoY2FsbCAhPT0gdm9pZCAwKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJEZXJpdmVkIGNvbnN0cnVjdG9ycyBtYXkgb25seSByZXR1cm4gb2JqZWN0IG9yIHVuZGVmaW5lZFwiKTsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoQm9vbGVhbiwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIHRvSWQgPSBmdW5jdGlvbiB0b0lkKF9pbnQpIHtcbiAgcmV0dXJuIE51bWJlcihfaW50KTtcbn07XG5cbnZhciBmcm9tSWQgPSBmdW5jdGlvbiBmcm9tSWQoaWQpIHtcbiAgcmV0dXJuIHBhcnNlSW50KGlkKTtcbn07XG5cbnZhciBNYXBwZWQgPSBTeW1ib2woJ01hcHBlZCcpO1xudmFyIEhhcyA9IFN5bWJvbCgnSGFzJyk7XG52YXIgQWRkID0gU3ltYm9sKCdBZGQnKTtcbnZhciBSZW1vdmUgPSBTeW1ib2woJ1JlbW92ZScpO1xudmFyIERlbGV0ZSA9IFN5bWJvbCgnRGVsZXRlJyk7XG5cbnZhciBCYWcgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9NaXhpbiR3aXRoKSB7XG4gIF9pbmhlcml0cyhCYWcsIF9NaXhpbiR3aXRoKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEJhZyk7XG5cbiAgZnVuY3Rpb24gQmFnKCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIHZhciBjaGFuZ2VDYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJhZyk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpO1xuICAgIF90aGlzLm1ldGEgPSBTeW1ib2woJ21ldGEnKTtcbiAgICBfdGhpcy5jb250ZW50ID0gbmV3IE1hcCgpO1xuICAgIF90aGlzLmxpc3QgPSBfQmluZGFibGUuQmluZGFibGUubWFrZUJpbmRhYmxlKFtdKTtcbiAgICBfdGhpcy5jdXJyZW50ID0gMDtcbiAgICBfdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuICAgIF90aGlzLmxlbmd0aCA9IDA7XG4gICAgX3RoaXMuY2hhbmdlQ2FsbGJhY2sgPSBjaGFuZ2VDYWxsYmFjaztcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQmFnLCBbe1xuICAgIGtleTogXCJoYXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFzKGl0ZW0pIHtcbiAgICAgIGlmICh0aGlzW01hcHBlZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbTWFwcGVkXS5oYXMoaXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzW0hhc10oaXRlbSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBIYXMsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKGl0ZW0pIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaGFzKGl0ZW0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKGl0ZW0pIHtcbiAgICAgIGlmICh0aGlzW01hcHBlZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbTWFwcGVkXS5hZGQoaXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzW0FkZF0oaXRlbSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBBZGQsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQgfHwgIShpdGVtIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgb2JqZWN0cyBtYXkgYmUgYWRkZWQgdG8gQmFncy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudHlwZSAmJiAhKGl0ZW0gaW5zdGFuY2VvZiB0aGlzLnR5cGUpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy50eXBlLCBpdGVtKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSBvYmplY3RzIG9mIHR5cGUgXCIuY29uY2F0KHRoaXMudHlwZSwgXCIgbWF5IGJlIGFkZGVkIHRvIHRoaXMgQmFnLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNvbnRlbnQuaGFzKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGFkZGluZyA9IG5ldyBDdXN0b21FdmVudCgnYWRkaW5nJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuZGlzcGF0Y2hFdmVudChhZGRpbmcpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGlkID0gdG9JZCh0aGlzLmN1cnJlbnQrKyk7XG4gICAgICB0aGlzLmNvbnRlbnQuc2V0KGl0ZW0sIGlkKTtcbiAgICAgIHRoaXMubGlzdFtpZF0gPSBpdGVtO1xuXG4gICAgICBpZiAodGhpcy5jaGFuZ2VDYWxsYmFjaykge1xuICAgICAgICB0aGlzLmNoYW5nZUNhbGxiYWNrKGl0ZW0sIHRoaXMubWV0YSwgQmFnLklURU1fQURERUQsIGlkKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFkZCA9IG5ldyBDdXN0b21FdmVudCgnYWRkZWQnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGFkZCk7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuc2l6ZTtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShpdGVtKSB7XG4gICAgICBpZiAodGhpc1tNYXBwZWRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzW01hcHBlZF0ucmVtb3ZlKGl0ZW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpc1tSZW1vdmVdKGl0ZW0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogUmVtb3ZlLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShpdGVtKSB7XG4gICAgICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkIHx8ICEoaXRlbSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9iamVjdHMgbWF5IGJlIHJlbW92ZWQgZnJvbSBCYWdzLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50eXBlICYmICEoaXRlbSBpbnN0YW5jZW9mIHRoaXMudHlwZSkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnR5cGUsIGl0ZW0pO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IG9iamVjdHMgb2YgdHlwZSBcIi5jb25jYXQodGhpcy50eXBlLCBcIiBtYXkgYmUgcmVtb3ZlZCBmcm9tIHRoaXMgQmFnLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5jb250ZW50LmhhcyhpdGVtKSkge1xuICAgICAgICBpZiAodGhpcy5jaGFuZ2VDYWxsYmFjaykge1xuICAgICAgICAgIHRoaXMuY2hhbmdlQ2FsbGJhY2soaXRlbSwgdGhpcy5tZXRhLCAwLCB1bmRlZmluZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVtb3ZpbmcgPSBuZXcgQ3VzdG9tRXZlbnQoJ3JlbW92aW5nJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuZGlzcGF0Y2hFdmVudChyZW1vdmluZykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgaWQgPSB0aGlzLmNvbnRlbnQuZ2V0KGl0ZW0pO1xuICAgICAgZGVsZXRlIHRoaXMubGlzdFtpZF07XG4gICAgICB0aGlzLmNvbnRlbnRbXCJkZWxldGVcIl0oaXRlbSk7XG5cbiAgICAgIGlmICh0aGlzLmNoYW5nZUNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlQ2FsbGJhY2soaXRlbSwgdGhpcy5tZXRhLCBCYWcuSVRFTV9SRU1PVkVELCBpZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZW1vdmUgPSBuZXcgQ3VzdG9tRXZlbnQoJ3JlbW92ZWQnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHJlbW92ZSk7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuc2l6ZTtcbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWxldGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2RlbGV0ZShpdGVtKSB7XG4gICAgICBpZiAodGhpc1tNYXBwZWRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzW01hcHBlZF1bXCJkZWxldGVcIl0oaXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXNbRGVsZXRlXShpdGVtKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IERlbGV0ZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoaXRlbSkge1xuICAgICAgdGhpcy5yZW1vdmUoaXRlbSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXAoKSB7XG4gICAgICB2YXIgbWFwcGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH07XG4gICAgICB2YXIgZmlsdGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH07XG4gICAgICB2YXIgbWFwcGVkSXRlbXMgPSBuZXcgV2Vha01hcCgpO1xuICAgICAgdmFyIG1hcHBlZEJhZyA9IG5ldyBCYWcoKTtcbiAgICAgIG1hcHBlZEJhZ1tNYXBwZWRdID0gdGhpcztcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignYWRkZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC5kZXRhaWwuaXRlbTtcblxuICAgICAgICBpZiAoIWZpbHRlcihpdGVtKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXBwZWRJdGVtcy5oYXMoaXRlbSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWFwcGVkID0gbWFwcGVyKGl0ZW0pO1xuICAgICAgICBtYXBwZWRJdGVtcy5zZXQoaXRlbSwgbWFwcGVkKTtcbiAgICAgICAgbWFwcGVkQmFnW0FkZF0obWFwcGVkKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdyZW1vdmVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBpdGVtID0gZXZlbnQuZGV0YWlsLml0ZW07XG5cbiAgICAgICAgaWYgKCFtYXBwZWRJdGVtcy5oYXMoaXRlbSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWFwcGVkID0gbWFwcGVkSXRlbXMuZ2V0KGl0ZW0pO1xuICAgICAgICBtYXBwZWRJdGVtc1tcImRlbGV0ZVwiXShpdGVtKTtcbiAgICAgICAgbWFwcGVkQmFnW1JlbW92ZV0obWFwcGVkKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1hcHBlZEJhZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2l6ZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5zaXplO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpdGVtc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpdGVtcygpIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuY29udGVudC5lbnRyaWVzKCkpLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgcmV0dXJuIGVudHJ5WzBdO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJhZztcbn0oX01peGluLk1peGluW1wid2l0aFwiXShfRXZlbnRUYXJnZXRNaXhpbi5FdmVudFRhcmdldE1peGluKSk7XG5cbmV4cG9ydHMuQmFnID0gQmFnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhZywgJ0lURU1fQURERUQnLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgdmFsdWU6IDFcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhZywgJ0lURU1fUkVNT1ZFRCcsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICB2YWx1ZTogLTFcbn0pO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvQmluZGFibGUuanNcIiwgZnVuY3Rpb24oZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlKSB7XG4gIHJlcXVpcmUgPSBfX21ha2VSZWxhdGl2ZVJlcXVpcmUocmVxdWlyZSwge30sIFwiY3VydmF0dXJlXCIpO1xuICAoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLkJpbmRhYmxlID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHsgaWYgKF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSkgeyBfY29uc3RydWN0ID0gUmVmbGVjdC5jb25zdHJ1Y3Q7IH0gZWxzZSB7IF9jb25zdHJ1Y3QgPSBmdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHsgdmFyIGEgPSBbbnVsbF07IGEucHVzaC5hcHBseShhLCBhcmdzKTsgdmFyIENvbnN0cnVjdG9yID0gRnVuY3Rpb24uYmluZC5hcHBseShQYXJlbnQsIGEpOyB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTsgaWYgKENsYXNzKSBfc2V0UHJvdG90eXBlT2YoaW5zdGFuY2UsIENsYXNzLnByb3RvdHlwZSk7IHJldHVybiBpbnN0YW5jZTsgfTsgfSByZXR1cm4gX2NvbnN0cnVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgQm9vbGVhbi5wcm90b3R5cGUudmFsdWVPZi5jYWxsKFJlZmxlY3QuY29uc3RydWN0KEJvb2xlYW4sIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgaXRlcltTeW1ib2wuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lKSB7IHRocm93IF9lOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMjsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIFJlZiA9IFN5bWJvbCgncmVmJyk7XG52YXIgT3JpZ2luYWwgPSBTeW1ib2woJ29yaWdpbmFsJyk7XG52YXIgRGVjayA9IFN5bWJvbCgnZGVjaycpO1xudmFyIEJpbmRpbmcgPSBTeW1ib2woJ2JpbmRpbmcnKTtcbnZhciBTdWJCaW5kaW5nID0gU3ltYm9sKCdzdWJCaW5kaW5nJyk7XG52YXIgQmluZGluZ0FsbCA9IFN5bWJvbCgnYmluZGluZ0FsbCcpO1xudmFyIElzQmluZGFibGUgPSBTeW1ib2woJ2lzQmluZGFibGUnKTtcbnZhciBXcmFwcGluZyA9IFN5bWJvbCgnd3JhcHBpbmcnKTtcbnZhciBOYW1lcyA9IFN5bWJvbCgnTmFtZXMnKTtcbnZhciBFeGVjdXRpbmcgPSBTeW1ib2woJ2V4ZWN1dGluZycpO1xudmFyIFN0YWNrID0gU3ltYm9sKCdzdGFjaycpO1xudmFyIE9ialN5bWJvbCA9IFN5bWJvbCgnb2JqZWN0Jyk7XG52YXIgV3JhcHBlZCA9IFN5bWJvbCgnd3JhcHBlZCcpO1xudmFyIFVud3JhcHBlZCA9IFN5bWJvbCgndW53cmFwcGVkJyk7XG52YXIgR2V0UHJvdG8gPSBTeW1ib2woJ2dldFByb3RvJyk7XG52YXIgT25HZXQgPSBTeW1ib2woJ29uR2V0Jyk7XG52YXIgT25BbGxHZXQgPSBTeW1ib2woJ29uQWxsR2V0Jyk7XG52YXIgQmluZENoYWluID0gU3ltYm9sKCdiaW5kQ2hhaW4nKTtcbnZhciBEZXNjcmlwdG9ycyA9IFN5bWJvbCgnRGVzY3JpcHRvcnMnKTtcbnZhciBCZWZvcmUgPSBTeW1ib2woJ0JlZm9yZScpO1xudmFyIEFmdGVyID0gU3ltYm9sKCdBZnRlcicpO1xudmFyIE5vR2V0dGVycyA9IFN5bWJvbCgnTm9HZXR0ZXJzJyk7XG52YXIgVHlwZWRBcnJheSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihJbnQ4QXJyYXkpO1xudmFyIFNldEl0ZXJhdG9yID0gU2V0LnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdO1xudmFyIE1hcEl0ZXJhdG9yID0gTWFwLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdO1xudmFyIHdpbiA9IGdsb2JhbFRoaXM7XG52YXIgZXhjbHVkZWRDbGFzc2VzID0gW3dpbi5Ob2RlLCB3aW4uRmlsZSwgd2luLk1hcCwgd2luLlNldCwgd2luLldlYWtNYXAsIHdpbi5XZWFrU2V0LCB3aW4uQXJyYXlCdWZmZXIsIHdpbi5SZXNpemVPYnNlcnZlciwgd2luLk11dGF0aW9uT2JzZXJ2ZXIsIHdpbi5QZXJmb3JtYW5jZU9ic2VydmVyLCB3aW4uSW50ZXJzZWN0aW9uT2JzZXJ2ZXIsIHdpbi5JREJDdXJzb3IsIHdpbi5JREJDdXJzb3JXaXRoVmFsdWUsIHdpbi5JREJEYXRhYmFzZSwgd2luLklEQkZhY3RvcnksIHdpbi5JREJJbmRleCwgd2luLklEQktleVJhbmdlLCB3aW4uSURCT2JqZWN0U3RvcmUsIHdpbi5JREJPcGVuREJSZXF1ZXN0LCB3aW4uSURCUmVxdWVzdCwgd2luLklEQlRyYW5zYWN0aW9uLCB3aW4uSURCVmVyc2lvbkNoYW5nZUV2ZW50LCB3aW4uRXZlbnQsIHdpbi5DdXN0b21FdmVudCwgd2luLkZpbGVTeXN0ZW1GaWxlSGFuZGxlXS5maWx0ZXIoZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufSk7XG5cbnZhciBCaW5kYWJsZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJpbmRhYmxlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCaW5kYWJsZSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQmluZGFibGUsIG51bGwsIFt7XG4gICAga2V5OiBcImlzQmluZGFibGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNCaW5kYWJsZShvYmplY3QpIHtcbiAgICAgIGlmICghb2JqZWN0IHx8ICFvYmplY3RbSXNCaW5kYWJsZV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0W0lzQmluZGFibGVdID09PSBCaW5kYWJsZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25EZWNrXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uRGVjayhvYmplY3QsIGtleSkge1xuICAgICAgcmV0dXJuIG9iamVjdFtEZWNrXVtrZXldIHx8IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVmKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG9iamVjdFtSZWZdIHx8IG9iamVjdCB8fCBmYWxzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFrZUJpbmRhYmxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1ha2VCaW5kYWJsZShvYmplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLm1ha2Uob2JqZWN0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2h1Y2tcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2h1Y2sob3JpZ2luYWwsIHNlZW4pIHtcbiAgICAgIHNlZW4gPSBzZWVuIHx8IG5ldyBNYXAoKTtcbiAgICAgIHZhciBjbG9uZSA9IHt9O1xuXG4gICAgICBpZiAob3JpZ2luYWwgaW5zdGFuY2VvZiBUeXBlZEFycmF5IHx8IG9yaWdpbmFsIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgdmFyIF9jbG9uZSA9IG9yaWdpbmFsLnNsaWNlKDApO1xuXG4gICAgICAgIHNlZW4uc2V0KG9yaWdpbmFsLCBfY2xvbmUpO1xuICAgICAgICByZXR1cm4gX2Nsb25lO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvcGVydGllcyA9IE9iamVjdC5rZXlzKG9yaWdpbmFsKTtcblxuICAgICAgZm9yICh2YXIgaSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIHZhciBpaSA9IHByb3BlcnRpZXNbaV07XG5cbiAgICAgICAgaWYgKGlpLnN1YnN0cmluZygwLCAzKSA9PT0gJ19fXycpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbHJlYWR5Q2xvbmVkID0gc2Vlbi5nZXQob3JpZ2luYWxbaWldKTtcblxuICAgICAgICBpZiAoYWxyZWFkeUNsb25lZCkge1xuICAgICAgICAgIGNsb25lW2lpXSA9IGFscmVhZHlDbG9uZWQ7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3JpZ2luYWxbaWldID09PSBvcmlnaW5hbCkge1xuICAgICAgICAgIHNlZW4uc2V0KG9yaWdpbmFsW2lpXSwgY2xvbmUpO1xuICAgICAgICAgIGNsb25lW2lpXSA9IGNsb25lO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9yaWdpbmFsW2lpXSAmJiBfdHlwZW9mKG9yaWdpbmFsW2lpXSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdmFyIG9yaWdpbmFsUHJvcCA9IG9yaWdpbmFsW2lpXTtcblxuICAgICAgICAgIGlmIChCaW5kYWJsZS5pc0JpbmRhYmxlKG9yaWdpbmFsW2lpXSkpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsUHJvcCA9IG9yaWdpbmFsW2lpXVtPcmlnaW5hbF07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2xvbmVbaWldID0gdGhpcy5zaHVjayhvcmlnaW5hbFByb3AsIHNlZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNsb25lW2lpXSA9IG9yaWdpbmFsW2lpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlZW4uc2V0KG9yaWdpbmFsW2lpXSwgY2xvbmVbaWldKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEJpbmRhYmxlLmlzQmluZGFibGUob3JpZ2luYWwpKSB7XG4gICAgICAgIGRlbGV0ZSBjbG9uZS5iaW5kVG87XG4gICAgICAgIGRlbGV0ZSBjbG9uZS5pc0JvdW5kO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1ha2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFrZShvYmplY3QpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmICghb2JqZWN0IHx8ICFbJ2Z1bmN0aW9uJywgJ29iamVjdCddLmluY2x1ZGVzKF90eXBlb2Yob2JqZWN0KSkpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH1cblxuICAgICAgaWYgKE9iamVjdC5pc1NlYWxlZChvYmplY3QpIHx8IE9iamVjdC5pc0Zyb3plbihvYmplY3QpIHx8ICFPYmplY3QuaXNFeHRlbnNpYmxlKG9iamVjdCkgfHwgZXhjbHVkZWRDbGFzc2VzLmZpbHRlcihmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgeDtcbiAgICAgIH0pLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqZWN0W1JlZl0pIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFtSZWZdO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqZWN0W0lzQmluZGFibGVdKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIElzQmluZGFibGUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IEJpbmRhYmxlXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIFJlZiwge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIE9yaWdpbmFsLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBvYmplY3RcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgRGVjaywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZToge31cbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgQmluZGluZywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZToge31cbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgU3ViQmluZGluZywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogbmV3IE1hcCgpXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIEJpbmRpbmdBbGwsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IFtdXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIEV4ZWN1dGluZywge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgV3JhcHBpbmcsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIFN0YWNrLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBbXVxuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBCZWZvcmUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IFtdXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIEFmdGVyLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBbXVxuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBXcmFwcGVkLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBuZXcgTWFwKClcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgVW53cmFwcGVkLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiB7fVxuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBEZXNjcmlwdG9ycywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogbmV3IE1hcCgpXG4gICAgICB9KTtcblxuICAgICAgdmFyIGJpbmRUbyA9IGZ1bmN0aW9uIGJpbmRUbyhwcm9wZXJ0eSkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgICAgICAgdmFyIGJpbmRUb0FsbCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BlcnR5KSkge1xuICAgICAgICAgIHZhciBkZWJpbmRlcnMgPSBwcm9wZXJ0eS5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZFRvKHAsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlYmluZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BlcnR5IGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICBvcHRpb25zID0gY2FsbGJhY2sgfHwge307XG4gICAgICAgICAgY2FsbGJhY2sgPSBwcm9wZXJ0eTtcbiAgICAgICAgICBiaW5kVG9BbGwgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZGVsYXkgPj0gMCkge1xuICAgICAgICAgIGNhbGxiYWNrID0gX3RoaXMud3JhcERlbGF5Q2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMuZGVsYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMudGhyb3R0bGUgPj0gMCkge1xuICAgICAgICAgIGNhbGxiYWNrID0gX3RoaXMud3JhcFRocm90dGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMudGhyb3R0bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMud2FpdCA+PSAwKSB7XG4gICAgICAgICAgY2FsbGJhY2sgPSBfdGhpcy53cmFwV2FpdENhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zLndhaXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZnJhbWUpIHtcbiAgICAgICAgICBjYWxsYmFjayA9IF90aGlzLndyYXBGcmFtZUNhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zLmZyYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmlkbGUpIHtcbiAgICAgICAgICBjYWxsYmFjayA9IF90aGlzLndyYXBJZGxlQ2FsbGJhY2soY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpbmRUb0FsbCkge1xuICAgICAgICAgIHZhciBiaW5kSW5kZXggPSBvYmplY3RbQmluZGluZ0FsbF0ubGVuZ3RoO1xuICAgICAgICAgIG9iamVjdFtCaW5kaW5nQWxsXS5wdXNoKGNhbGxiYWNrKTtcblxuICAgICAgICAgIGlmICghKCdub3cnIGluIG9wdGlvbnMpIHx8IG9wdGlvbnMubm93KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9iamVjdCkge1xuICAgICAgICAgICAgICBjYWxsYmFjayhvYmplY3RbaV0sIGksIG9iamVjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWxldGUgb2JqZWN0W0JpbmRpbmdBbGxdW2JpbmRJbmRleF07XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XSkge1xuICAgICAgICAgIG9iamVjdFtCaW5kaW5nXVtwcm9wZXJ0eV0gPSBuZXcgU2V0KCk7XG4gICAgICAgIH0gLy8gbGV0IGJpbmRJbmRleCA9IG9iamVjdFtCaW5kaW5nXVtwcm9wZXJ0eV0ubGVuZ3RoO1xuXG5cbiAgICAgICAgaWYgKG9wdGlvbnMuY2hpbGRyZW4pIHtcbiAgICAgICAgICB2YXIgb3JpZ2luYWwgPSBjYWxsYmFjaztcblxuICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHYgPSBhcmdzWzBdO1xuICAgICAgICAgICAgdmFyIHN1YkRlYmluZCA9IG9iamVjdFtTdWJCaW5kaW5nXS5nZXQob3JpZ2luYWwpO1xuXG4gICAgICAgICAgICBpZiAoc3ViRGViaW5kKSB7XG4gICAgICAgICAgICAgIG9iamVjdFtTdWJCaW5kaW5nXVtcImRlbGV0ZVwiXShvcmlnaW5hbCk7XG4gICAgICAgICAgICAgIHN1YkRlYmluZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3R5cGVvZih2KSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgb3JpZ2luYWwuYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdnYgPSBCaW5kYWJsZS5tYWtlKHYpO1xuXG4gICAgICAgICAgICBpZiAoQmluZGFibGUuaXNCaW5kYWJsZSh2dikpIHtcbiAgICAgICAgICAgICAgb2JqZWN0W1N1YkJpbmRpbmddLnNldChvcmlnaW5hbCwgdnYuYmluZFRvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIHN1YkFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgICAgICAgICAgIHN1YkFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWwuYXBwbHkodm9pZCAwLCBhcmdzLmNvbmNhdChzdWJBcmdzKSk7XG4gICAgICAgICAgICAgIH0sIE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogZmFsc2VcbiAgICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3JpZ2luYWwuYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XS5hZGQoY2FsbGJhY2spO1xuXG4gICAgICAgIGlmICghKCdub3cnIGluIG9wdGlvbnMpIHx8IG9wdGlvbnMubm93KSB7XG4gICAgICAgICAgY2FsbGJhY2sob2JqZWN0W3Byb3BlcnR5XSwgcHJvcGVydHksIG9iamVjdCwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlYmluZGVyID0gZnVuY3Rpb24gZGViaW5kZXIoKSB7XG4gICAgICAgICAgdmFyIHN1YkRlYmluZCA9IG9iamVjdFtTdWJCaW5kaW5nXS5nZXQoY2FsbGJhY2spO1xuXG4gICAgICAgICAgaWYgKHN1YkRlYmluZCkge1xuICAgICAgICAgICAgb2JqZWN0W1N1YkJpbmRpbmddW1wiZGVsZXRlXCJdKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHN1YkRlYmluZCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XS5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XVtcImRlbGV0ZVwiXShjYWxsYmFjayk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucmVtb3ZlV2l0aCAmJiBvcHRpb25zLnJlbW92ZVdpdGggaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICAgICAgb3B0aW9ucy5yZW1vdmVXaXRoLm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWJpbmRlcjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWJpbmRlcjtcbiAgICAgIH07XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdiaW5kVG8nLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBiaW5kVG9cbiAgICAgIH0pO1xuXG4gICAgICB2YXIgX19fYmVmb3JlID0gZnVuY3Rpb24gX19fYmVmb3JlKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBiZWZvcmVJbmRleCA9IG9iamVjdFtCZWZvcmVdLmxlbmd0aDtcbiAgICAgICAgb2JqZWN0W0JlZm9yZV0ucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHZhciBjbGVhbmVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGNsZWFuZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjbGVhbmVkID0gdHJ1ZTtcbiAgICAgICAgICBkZWxldGUgb2JqZWN0W0JlZm9yZV1bYmVmb3JlSW5kZXhdO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgdmFyIF9fX2FmdGVyID0gZnVuY3Rpb24gX19fYWZ0ZXIoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGFmdGVySW5kZXggPSBvYmplY3RbQWZ0ZXJdLmxlbmd0aDtcbiAgICAgICAgb2JqZWN0W0FmdGVyXS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgdmFyIGNsZWFuZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoY2xlYW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNsZWFuZWQgPSB0cnVlO1xuICAgICAgICAgIGRlbGV0ZSBvYmplY3RbQWZ0ZXJdW2FmdGVySW5kZXhdO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgQmluZENoYWluLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShwYXRoLCBjYWxsYmFjaykge1xuICAgICAgICAgIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICAgICAgICB2YXIgbm9kZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICAgICAgdmFyIHN1YlBhcnRzID0gcGFydHMuc2xpY2UoMCk7XG4gICAgICAgICAgdmFyIGRlYmluZCA9IFtdO1xuICAgICAgICAgIGRlYmluZC5wdXNoKG9iamVjdC5iaW5kVG8obm9kZSwgZnVuY3Rpb24gKHYsIGssIHQsIGQpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gc3ViUGFydHMuam9pbignLicpO1xuXG4gICAgICAgICAgICBpZiAoc3ViUGFydHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHYsIGssIHQsIGQpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdiA9IHRba10gPSBfdGhpcy5tYWtlQmluZGFibGUoe30pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWJpbmQgPSBkZWJpbmQuY29uY2F0KHZbQmluZENoYWluXShyZXN0LCBjYWxsYmFjaykpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlYmluZC5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgIHJldHVybiB4KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdfX19iZWZvcmUnLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBfX19iZWZvcmVcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ19fX2FmdGVyJywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogX19fYWZ0ZXJcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgaXNCb3VuZCA9IGZ1bmN0aW9uIGlzQm91bmQoKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gb2JqZWN0W0JpbmRpbmdBbGxdKSB7XG4gICAgICAgICAgaWYgKG9iamVjdFtCaW5kaW5nQWxsXVtpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgX2kgaW4gb2JqZWN0W0JpbmRpbmddKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiBpbiBvYmplY3RbQmluZGluZ11bX2ldKSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0W0JpbmRpbmddW19pXVtqXSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnaXNCb3VuZCcsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IGlzQm91bmRcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICAgIGlmIChvYmplY3RbaV0gJiYgb2JqZWN0W2ldIGluc3RhbmNlb2YgT2JqZWN0ICYmICFvYmplY3RbaV0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgaWYgKCFleGNsdWRlZENsYXNzZXMuZmlsdGVyKGZ1bmN0aW9uIChleGNsdWRlQ2xhc3MpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmplY3RbaV0gaW5zdGFuY2VvZiBleGNsdWRlQ2xhc3M7XG4gICAgICAgICAgfSkubGVuZ3RoICYmIE9iamVjdC5pc0V4dGVuc2libGUob2JqZWN0W2ldKSAmJiAhT2JqZWN0LmlzU2VhbGVkKG9iamVjdFtpXSkpIHtcbiAgICAgICAgICAgIG9iamVjdFtpXSA9IEJpbmRhYmxlLm1ha2Uob2JqZWN0W2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgaW4gb2JqZWN0KSB7XG4gICAgICAgIF9sb29wKGkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2V0ID0gZnVuY3Rpb24gc2V0KHRhcmdldCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAod3JhcHBlZC5oYXMoa2V5KSkge1xuICAgICAgICAgIHdyYXBwZWRbXCJkZWxldGVcIl0oa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrZXkgPT09IE9yaWdpbmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb25EZWNrID0gb2JqZWN0W0RlY2tdO1xuXG4gICAgICAgIGlmIChvbkRlY2tba2V5XSAhPT0gdW5kZWZpbmVkICYmIG9uRGVja1trZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleS5zbGljZSAmJiBrZXkuc2xpY2UoLTMpID09PSAnX19fJykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldFtrZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgaWYgKCFleGNsdWRlZENsYXNzZXMuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgeDtcbiAgICAgICAgICB9KS5sZW5ndGggJiYgT2JqZWN0LmlzRXh0ZW5zaWJsZShvYmplY3QpICYmICFPYmplY3QuaXNTZWFsZWQob2JqZWN0KSkge1xuICAgICAgICAgICAgaWYgKCFvYmplY3RbTm9HZXR0ZXJzXSkge31cblxuICAgICAgICAgICAgdmFsdWUgPSBCaW5kYWJsZS5tYWtlQmluZGFibGUodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9uRGVja1trZXldID0gdmFsdWU7XG5cbiAgICAgICAgZm9yICh2YXIgX2kyIGluIG9iamVjdFtCaW5kaW5nQWxsXSkge1xuICAgICAgICAgIGlmICghb2JqZWN0W0JpbmRpbmdBbGxdW19pMl0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9iamVjdFtCaW5kaW5nQWxsXVtfaTJdKHZhbHVlLCBrZXksIHRhcmdldCwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0b3AgPSBmYWxzZTtcblxuICAgICAgICBpZiAoa2V5IGluIG9iamVjdFtCaW5kaW5nXSkge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvYmplY3RbQmluZGluZ11ba2V5XSksXG4gICAgICAgICAgICAgIF9zdGVwO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IF9zdGVwLnZhbHVlO1xuXG4gICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwga2V5LCB0YXJnZXQsIGZhbHNlLCB0YXJnZXRba2V5XSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc3RvcCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvci5mKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG9uRGVja1trZXldO1xuXG4gICAgICAgIGlmICghc3RvcCkge1xuICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gICAgICAgICAgdmFyIGV4Y2x1ZGVkID0gdGFyZ2V0IGluc3RhbmNlb2YgRmlsZSAmJiBrZXkgPT0gJ2xhc3RNb2RpZmllZERhdGUnO1xuXG4gICAgICAgICAgaWYgKCFleGNsdWRlZCAmJiAoIWRlc2NyaXB0b3IgfHwgZGVzY3JpcHRvci53cml0YWJsZSkgJiYgdGFyZ2V0W2tleV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHQgPSBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUpO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgb2JqZWN0W0JpbmRpbmddWydsZW5ndGgnXSkge1xuICAgICAgICAgIGZvciAodmFyIF9pMyBpbiBvYmplY3RbQmluZGluZ11bJ2xlbmd0aCddKSB7XG4gICAgICAgICAgICB2YXIgX2NhbGxiYWNrID0gb2JqZWN0W0JpbmRpbmddWydsZW5ndGgnXVtfaTNdO1xuXG4gICAgICAgICAgICBfY2FsbGJhY2sodGFyZ2V0Lmxlbmd0aCwgJ2xlbmd0aCcsIHRhcmdldCwgZmFsc2UsIHRhcmdldC5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuXG4gICAgICB2YXIgZGVsZXRlUHJvcGVydHkgPSBmdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICAgICAgICB2YXIgb25EZWNrID0gb2JqZWN0W0RlY2tdO1xuXG4gICAgICAgIGlmIChvbkRlY2tba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIShrZXkgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlc2NyaXB0b3JzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ycy5nZXQoa2V5KTtcblxuICAgICAgICAgIGlmIChkZXNjcmlwdG9yICYmICFkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRlc2NyaXB0b3JzW1wiZGVsZXRlXCJdKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkRlY2tba2V5XSA9IG51bGw7XG5cbiAgICAgICAgaWYgKHdyYXBwZWQuaGFzKGtleSkpIHtcbiAgICAgICAgICB3cmFwcGVkW1wiZGVsZXRlXCJdKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBfaTQgaW4gb2JqZWN0W0JpbmRpbmdBbGxdKSB7XG4gICAgICAgICAgb2JqZWN0W0JpbmRpbmdBbGxdW19pNF0odW5kZWZpbmVkLCBrZXksIHRhcmdldCwgdHJ1ZSwgdGFyZ2V0W2tleV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3RbQmluZGluZ10pIHtcbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yMiA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG9iamVjdFtCaW5kaW5nXVtrZXldKSxcbiAgICAgICAgICAgICAgX3N0ZXAyO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMi5zKCk7ICEoX3N0ZXAyID0gX2l0ZXJhdG9yMi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBiaW5kaW5nID0gX3N0ZXAyLnZhbHVlO1xuICAgICAgICAgICAgICBiaW5kaW5nKHVuZGVmaW5lZCwga2V5LCB0YXJnZXQsIHRydWUsIHRhcmdldFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjIuZShlcnIpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IyLmYoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgb25EZWNrW2tleV07XG4gICAgICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICB2YXIgY29uc3RydWN0ID0gZnVuY3Rpb24gY29uc3RydWN0KHRhcmdldCwgYXJncykge1xuICAgICAgICB2YXIga2V5ID0gJ2NvbnN0cnVjdG9yJztcblxuICAgICAgICBmb3IgKHZhciBfaTUgaW4gdGFyZ2V0W0JlZm9yZV0pIHtcbiAgICAgICAgICB0YXJnZXRbQmVmb3JlXVtfaTVdKHRhcmdldCwga2V5LCBvYmplY3RbU3RhY2tdLCB1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluc3RhbmNlID0gQmluZGFibGUubWFrZShfY29uc3RydWN0KHRhcmdldFtPcmlnaW5hbF0sIF90b0NvbnN1bWFibGVBcnJheShhcmdzKSkpO1xuXG4gICAgICAgIGZvciAodmFyIF9pNiBpbiB0YXJnZXRbQWZ0ZXJdKSB7XG4gICAgICAgICAgdGFyZ2V0W0FmdGVyXVtfaTZdKHRhcmdldCwga2V5LCBvYmplY3RbU3RhY2tdLCBpbnN0YW5jZSwgYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICB9O1xuXG4gICAgICB2YXIgZGVzY3JpcHRvcnMgPSBvYmplY3RbRGVzY3JpcHRvcnNdO1xuICAgICAgdmFyIHdyYXBwZWQgPSBvYmplY3RbV3JhcHBlZF07XG4gICAgICB2YXIgc3RhY2sgPSBvYmplY3RbU3RhY2tdO1xuXG4gICAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gZ2V0KHRhcmdldCwga2V5KSB7XG4gICAgICAgIGlmICh3cmFwcGVkLmhhcyhrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuIHdyYXBwZWQuZ2V0KGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5ID09PSBSZWYgfHwga2V5ID09PSBPcmlnaW5hbCB8fCBrZXkgPT09ICdhcHBseScgfHwga2V5ID09PSAnaXNCb3VuZCcgfHwga2V5ID09PSAnYmluZFRvJyB8fCBrZXkgPT09ICdfX3Byb3RvX18nIHx8IGtleSA9PT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICAgIHJldHVybiBvYmplY3Rba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZXNjcmlwdG9yO1xuXG4gICAgICAgIGlmIChkZXNjcmlwdG9ycy5oYXMoa2V5KSkge1xuICAgICAgICAgIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ycy5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG4gICAgICAgICAgZGVzY3JpcHRvcnMuc2V0KGtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci5jb25maWd1cmFibGUgJiYgIWRlc2NyaXB0b3Iud3JpdGFibGUpIHtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT25BbGxHZXQgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIG9iamVjdFtPbkFsbEdldF0oa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPbkdldCBpbiBvYmplY3QgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICAgIHJldHVybiBvYmplY3RbT25HZXRdKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci5jb25maWd1cmFibGUgJiYgIWRlc2NyaXB0b3Iud3JpdGFibGUpIHtcbiAgICAgICAgICB3cmFwcGVkLnNldChrZXksIG9iamVjdFtrZXldKTtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9iamVjdFtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKE5hbWVzIGluIG9iamVjdFtrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdFtVbndyYXBwZWRdLCBrZXksIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IG9iamVjdFtrZXldXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgICAgIHZhciBpc01ldGhvZCA9IHByb3RvdHlwZVtrZXldID09PSBvYmplY3Rba2V5XTtcbiAgICAgICAgICB2YXIgb2JqUmVmID0gdHlwZW9mIFByb21pc2UgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgTWFwID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIE1hcCB8fCB0eXBlb2YgU2V0ID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIFNldCB8fCB0eXBlb2YgTWFwSXRlcmF0b3IgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0LnByb3RvdHlwZSA9PT0gTWFwSXRlcmF0b3IgfHwgdHlwZW9mIFNldEl0ZXJhdG9yID09PSAnZnVuY3Rpb24nICYmIG9iamVjdC5wcm90b3R5cGUgPT09IFNldEl0ZXJhdG9yIHx8IHR5cGVvZiBTZXRJdGVyYXRvciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmplY3QucHJvdG90eXBlID09PSBTZXRJdGVyYXRvciB8fCB0eXBlb2YgV2Vha01hcCA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmplY3QgaW5zdGFuY2VvZiBXZWFrTWFwIHx8IHR5cGVvZiBXZWFrU2V0ID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIFdlYWtTZXQgfHwgdHlwZW9mIERhdGUgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgRGF0ZSB8fCB0eXBlb2YgVHlwZWRBcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmplY3QgaW5zdGFuY2VvZiBUeXBlZEFycmF5IHx8IHR5cGVvZiBBcnJheUJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmplY3QgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCB0eXBlb2YgRXZlbnRUYXJnZXQgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgRXZlbnRUYXJnZXQgfHwgdHlwZW9mIFJlc2l6ZU9ic2VydmVyID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIFJlc2l6ZU9ic2VydmVyIHx8IHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIE11dGF0aW9uT2JzZXJ2ZXIgfHwgdHlwZW9mIFBlcmZvcm1hbmNlT2JzZXJ2ZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgUGVyZm9ybWFuY2VPYnNlcnZlciB8fCB0eXBlb2YgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgfHwgdHlwZW9mIG9iamVjdFtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nICYmIGtleSA9PT0gJ25leHQnID8gb2JqZWN0IDogb2JqZWN0W1JlZl07XG5cbiAgICAgICAgICB2YXIgd3JhcHBlZE1ldGhvZCA9IGZ1bmN0aW9uIHdyYXBwZWRNZXRob2QoKSB7XG4gICAgICAgICAgICBvYmplY3RbRXhlY3V0aW5nXSA9IGtleTtcbiAgICAgICAgICAgIHN0YWNrLnVuc2hpZnQoa2V5KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBwcm92aWRlZEFyZ3MgPSBuZXcgQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgICAgICAgICAgcHJvdmlkZWRBcmdzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3IzID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIob2JqZWN0W0JlZm9yZV0pLFxuICAgICAgICAgICAgICAgIF9zdGVwMztcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZm9yIChfaXRlcmF0b3IzLnMoKTsgIShfc3RlcDMgPSBfaXRlcmF0b3IzLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmVmb3JlQ2FsbGJhY2sgPSBfc3RlcDMudmFsdWU7XG4gICAgICAgICAgICAgICAgYmVmb3JlQ2FsbGJhY2sob2JqZWN0LCBrZXksIHN0YWNrLCBvYmplY3QsIHByb3ZpZGVkQXJncyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBfaXRlcmF0b3IzLmUoZXJyKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIF9pdGVyYXRvcjMuZigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmV0O1xuXG4gICAgICAgICAgICBpZiAobmV3LnRhcmdldCkge1xuICAgICAgICAgICAgICByZXQgPSBfY29uc3RydWN0KG9iamVjdFtVbndyYXBwZWRdW2tleV0sIHByb3ZpZGVkQXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgZnVuYyA9IG9iamVjdFtVbndyYXBwZWRdW2tleV07XG5cbiAgICAgICAgICAgICAgaWYgKGlzTWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gZnVuYy5hcHBseShvYmpSZWYgfHwgb2JqZWN0LCBwcm92aWRlZEFyZ3MpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCA9IGZ1bmMuYXBwbHkodm9pZCAwLCBwcm92aWRlZEFyZ3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3I0ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIob2JqZWN0W0FmdGVyXSksXG4gICAgICAgICAgICAgICAgX3N0ZXA0O1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmb3IgKF9pdGVyYXRvcjQucygpOyAhKF9zdGVwNCA9IF9pdGVyYXRvcjQubigpKS5kb25lOykge1xuICAgICAgICAgICAgICAgIHZhciBhZnRlckNhbGxiYWNrID0gX3N0ZXA0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGFmdGVyQ2FsbGJhY2sob2JqZWN0LCBrZXksIHN0YWNrLCBvYmplY3QsIHByb3ZpZGVkQXJncyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBfaXRlcmF0b3I0LmUoZXJyKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIF9pdGVyYXRvcjQuZigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvYmplY3RbRXhlY3V0aW5nXSA9IG51bGw7XG4gICAgICAgICAgICBzdGFjay5zaGlmdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgd3JhcHBlZE1ldGhvZFtOYW1lc10gPSB3cmFwcGVkTWV0aG9kW05hbWVzXSB8fCBuZXcgV2Vha01hcCgpO1xuICAgICAgICAgIHdyYXBwZWRNZXRob2RbTmFtZXNdLnNldChvYmplY3QsIGtleSk7XG5cbiAgICAgICAgICB3cmFwcGVkTWV0aG9kW09uQWxsR2V0XSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHZhciBzZWxmTmFtZSA9IHdyYXBwZWRNZXRob2RbTmFtZXNdLmdldChvYmplY3QpO1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFtzZWxmTmFtZV1ba2V5XTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHJlc3VsdCA9IEJpbmRhYmxlLm1ha2Uod3JhcHBlZE1ldGhvZCk7XG4gICAgICAgICAgd3JhcHBlZC5zZXQoa2V5LCByZXN1bHQpO1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICB9O1xuXG4gICAgICB2YXIgZ2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZih0YXJnZXQpIHtcbiAgICAgICAgaWYgKEdldFByb3RvIGluIG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBvYmplY3RbR2V0UHJvdG9dO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBoYW5kbGVyID0ge1xuICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgc2V0OiBzZXQsXG4gICAgICAgIGNvbnN0cnVjdDogY29uc3RydWN0LFxuICAgICAgICBnZXRQcm90b3R5cGVPZjogZ2V0UHJvdG90eXBlT2YsXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5OiBkZWxldGVQcm9wZXJ0eVxuICAgICAgfTtcblxuICAgICAgaWYgKG9iamVjdFtOb0dldHRlcnNdKSB7XG4gICAgICAgIGRlbGV0ZSBoYW5kbGVyLmdldDtcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgUmVmLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBuZXcgUHJveHkob2JqZWN0LCBoYW5kbGVyKVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0W1JlZl07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyQmluZGluZ3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJCaW5kaW5ncyhvYmplY3QpIHtcbiAgICAgIHZhciBjbGVhck9iaiA9IGZ1bmN0aW9uIGNsZWFyT2JqKG8pIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLm1hcChmdW5jdGlvbiAoaykge1xuICAgICAgICAgIHJldHVybiBkZWxldGUgb1trXTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgbWFwcyA9IGZ1bmN0aW9uIG1hcHMoZnVuYykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgb3MgPSBuZXcgQXJyYXkoX2xlbjQpLCBfa2V5NCA9IDA7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICAgICAgICAgIG9zW19rZXk0XSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG9zLm1hcChmdW5jKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBjbGVhck9ianMgPSBtYXBzKGNsZWFyT2JqKTtcbiAgICAgIGNsZWFyT2JqcyhvYmplY3RbV3JhcHBlZF0sIG9iamVjdFtCaW5kaW5nXSwgb2JqZWN0W0JpbmRpbmdBbGxdLCBvYmplY3RbQWZ0ZXJdLCBvYmplY3RbQmVmb3JlXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc29sdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzb2x2ZShvYmplY3QsIHBhdGgpIHtcbiAgICAgIHZhciBvd25lciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBwYXRoUGFydHMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgICB2YXIgdG9wID0gcGF0aFBhcnRzWzBdO1xuXG4gICAgICB3aGlsZSAocGF0aFBhcnRzLmxlbmd0aCkge1xuICAgICAgICBpZiAob3duZXIgJiYgcGF0aFBhcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHZhciBvYmogPSB0aGlzLm1ha2Uob2JqZWN0KTtcbiAgICAgICAgICByZXR1cm4gW29iaiwgcGF0aFBhcnRzLnNoaWZ0KCksIHRvcF07XG4gICAgICAgIH1cblxuICAgICAgICBub2RlID0gcGF0aFBhcnRzLnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKCFub2RlIGluIG9iamVjdCB8fCAhb2JqZWN0W25vZGVdIHx8ICEob2JqZWN0W25vZGVdIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgICAgIG9iamVjdFtub2RlXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqZWN0ID0gdGhpcy5tYWtlKG9iamVjdFtub2RlXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbdGhpcy5tYWtlKG9iamVjdCksIG5vZGUsIHRvcF07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndyYXBEZWxheUNhbGxiYWNrXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdyYXBEZWxheUNhbGxiYWNrKGNhbGxiYWNrLCBkZWxheSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3MpO1xuICAgICAgICB9LCBkZWxheSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ3cmFwVGhyb3R0bGVDYWxsYmFja1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cmFwVGhyb3R0bGVDYWxsYmFjayhjYWxsYmFjaywgdGhyb3R0bGUpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB0aGlzLnRocm90dGxlcy5zZXQoY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfdGhpczIudGhyb3R0bGVzLmdldChjYWxsYmFjaywgdHJ1ZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgX3RoaXMyLnRocm90dGxlcy5zZXQoY2FsbGJhY2ssIHRydWUpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzMi50aHJvdHRsZXMuc2V0KGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIH0sIHRocm90dGxlKTtcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndyYXBXYWl0Q2FsbGJhY2tcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd3JhcFdhaXRDYWxsYmFjayhjYWxsYmFjaywgd2FpdCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuICAgICAgICAgIGFyZ3NbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3YWl0ZXI7XG5cbiAgICAgICAgaWYgKHdhaXRlciA9IF90aGlzMy53YWl0ZXJzLmdldChjYWxsYmFjaykpIHtcbiAgICAgICAgICBfdGhpczMud2FpdGVyc1tcImRlbGV0ZVwiXShjYWxsYmFjayk7XG5cbiAgICAgICAgICBjbGVhclRpbWVvdXQod2FpdGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdhaXRlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3MpO1xuICAgICAgICB9LCB3YWl0KTtcblxuICAgICAgICBfdGhpczMud2FpdGVycy5zZXQoY2FsbGJhY2ssIHdhaXRlcik7XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ3cmFwRnJhbWVDYWxsYmFja1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cmFwRnJhbWVDYWxsYmFjayhjYWxsYmFjaywgZnJhbWVzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBfbGVuNyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjcpLCBfa2V5NyA9IDA7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcbiAgICAgICAgICBhcmdzW19rZXk3XSA9IGFyZ3VtZW50c1tfa2V5N107XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndyYXBJZGxlQ2FsbGJhY2tcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd3JhcElkbGVDYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjggPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW44KSwgX2tleTggPSAwOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5OF0gPSBhcmd1bWVudHNbX2tleThdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29tcGF0aWJpbGl0eSBmb3IgU2FmYXJpIDA4LzIwMjBcbiAgICAgICAgdmFyIHJlcSA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrIHx8IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgcmVxKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBCaW5kYWJsZTtcbn0oKTtcblxuZXhwb3J0cy5CaW5kYWJsZSA9IEJpbmRhYmxlO1xuXG5fZGVmaW5lUHJvcGVydHkoQmluZGFibGUsIFwid2FpdGVyc1wiLCBuZXcgV2Vha01hcCgpKTtcblxuX2RlZmluZVByb3BlcnR5KEJpbmRhYmxlLCBcInRocm90dGxlc1wiLCBuZXcgV2Vha01hcCgpKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJpbmRhYmxlLCAnT25HZXQnLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiBPbkdldFxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmluZGFibGUsICdOb0dldHRlcnMnLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiBOb0dldHRlcnNcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJpbmRhYmxlLCAnR2V0UHJvdG8nLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiBHZXRQcm90b1xufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmluZGFibGUsICdPbkFsbEdldCcsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbiAgdmFsdWU6IE9uQWxsR2V0XG59KTtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9iYXNlL0NhY2hlLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5DYWNoZSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgQ2FjaGUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDYWNoZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2FjaGUpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENhY2hlLCBudWxsLCBbe1xuICAgIGtleTogXCJzdG9yZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9yZShrZXksIHZhbHVlLCBleHBpcnkpIHtcbiAgICAgIHZhciBidWNrZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6ICdzdGFuZGFyZCc7XG4gICAgICB2YXIgZXhwaXJhdGlvbiA9IDA7XG5cbiAgICAgIGlmIChleHBpcnkpIHtcbiAgICAgICAgZXhwaXJhdGlvbiA9IGV4cGlyeSAqIDEwMDAgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmJ1Y2tldHMpIHtcbiAgICAgICAgdGhpcy5idWNrZXRzID0gbmV3IE1hcCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuYnVja2V0cy5oYXMoYnVja2V0KSkge1xuICAgICAgICB0aGlzLmJ1Y2tldHMuc2V0KGJ1Y2tldCwgbmV3IE1hcCgpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGV2ZW50RW5kID0gbmV3IEN1c3RvbUV2ZW50KCdjdkNhY2hlU3RvcmUnLCB7XG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBleHBpcnk6IGV4cGlyeSxcbiAgICAgICAgICBidWNrZXQ6IGJ1Y2tldFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRFbmQpKSB7XG4gICAgICAgIHRoaXMuYnVja2V0cy5nZXQoYnVja2V0KS5zZXQoa2V5LCB7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIGV4cGlyYXRpb246IGV4cGlyYXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZChrZXkpIHtcbiAgICAgIHZhciBkZWZhdWx0dmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgICAgdmFyIGJ1Y2tldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJ3N0YW5kYXJkJztcbiAgICAgIHZhciBldmVudEVuZCA9IG5ldyBDdXN0b21FdmVudCgnY3ZDYWNoZUxvYWQnLCB7XG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIGRlZmF1bHR2YWx1ZTogZGVmYXVsdHZhbHVlLFxuICAgICAgICAgIGJ1Y2tldDogYnVja2V0XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRFbmQpKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0dmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJ1Y2tldHMgJiYgdGhpcy5idWNrZXRzLmhhcyhidWNrZXQpICYmIHRoaXMuYnVja2V0cy5nZXQoYnVja2V0KS5oYXMoa2V5KSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLmJ1Y2tldHMuZ2V0KGJ1Y2tldCkuZ2V0KGtleSk7IC8vIGNvbnNvbGUubG9nKHRoaXMuYnVja2V0W2J1Y2tldF1ba2V5XS5leHBpcmF0aW9uLCAobmV3IERhdGUpLmdldFRpbWUoKSk7XG5cbiAgICAgICAgaWYgKGVudHJ5LmV4cGlyYXRpb24gPT09IDAgfHwgZW50cnkuZXhwaXJhdGlvbiA+IG5ldyBEYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYnVja2V0cy5nZXQoYnVja2V0KS5nZXQoa2V5KS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGVmYXVsdHZhbHVlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDYWNoZTtcbn0oKTtcblxuZXhwb3J0cy5DYWNoZSA9IENhY2hlO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvQ29uZmlnLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5Db25maWcgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIEFwcENvbmZpZyA9IHt9O1xudmFyIF9yZXF1aXJlID0gcmVxdWlyZTtcblxudHJ5IHtcbiAgQXBwQ29uZmlnID0gX3JlcXVpcmUoJy9Db25maWcnKS5Db25maWcgfHwge307XG59IGNhdGNoIChlcnJvcikge1xuICBnbG9iYWxUaGlzLmRldk1vZGUgPT09IHRydWUgJiYgY29uc29sZS5lcnJvcihlcnJvcik7XG59XG5cbnZhciBDb25maWcgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDb25maWcoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbmZpZyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ29uZmlnLCBudWxsLCBbe1xuICAgIGtleTogXCJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3NbbmFtZV07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXQobmFtZSwgdmFsdWUpIHtcbiAgICAgIHRoaXMuY29uZmlnc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImR1bXBcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHVtcCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3M7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjb25maWdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBjb25maWdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpIGluIGNvbmZpZ3MpIHtcbiAgICAgICAgdmFyIGNvbmZpZyA9IGNvbmZpZ3NbaV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29uZmlnID0gSlNPTi5wYXJzZShjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBjb25maWcpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBjb25maWdbbmFtZV07XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb25maWc7XG59KCk7XG5cbmV4cG9ydHMuQ29uZmlnID0gQ29uZmlnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbmZpZywgJ2NvbmZpZ3MnLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiBBcHBDb25maWdcbn0pO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvRG9tLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5Eb20gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIHRyYXZlcnNhbHMgPSAwO1xuXG52YXIgRG9tID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRG9tKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEb20pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKERvbSwgbnVsbCwgW3tcbiAgICBrZXk6IFwibWFwVGFnc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXBUYWdzKGRvYywgc2VsZWN0b3IsIGNhbGxiYWNrLCBzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIHZhciBzdGFydGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKHN0YXJ0Tm9kZSkge1xuICAgICAgICBzdGFydGVkID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbmRlZCA9IGZhbHNlO1xuICAgICAgdmFyIHRyZWVXYWxrZXIgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKGRvYywgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQgfCBOb2RlRmlsdGVyLlNIT1dfVEVYVCwge1xuICAgICAgICBhY2NlcHROb2RlOiBmdW5jdGlvbiBhY2NlcHROb2RlKG5vZGUsIHdhbGtlcikge1xuICAgICAgICAgIGlmICghc3RhcnRlZCkge1xuICAgICAgICAgICAgaWYgKG5vZGUgPT09IHN0YXJ0Tm9kZSkge1xuICAgICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBOb2RlRmlsdGVyLkZJTFRFUl9TS0lQO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlbmROb2RlICYmIG5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgICAgICAgIGVuZGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBOb2RlRmlsdGVyLkZJTFRFUl9TS0lQO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgICAgICAgIGlmIChub2RlLm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE5vZGVGaWx0ZXIuRklMVEVSX0FDQ0VQVDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gTm9kZUZpbHRlci5GSUxURVJfU0tJUDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gTm9kZUZpbHRlci5GSUxURVJfQUNDRVBUO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICB2YXIgdHJhdmVyc2FsID0gdHJhdmVyc2FscysrO1xuXG4gICAgICB3aGlsZSAodHJlZVdhbGtlci5uZXh0Tm9kZSgpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGNhbGxiYWNrKHRyZWVXYWxrZXIuY3VycmVudE5vZGUsIHRyZWVXYWxrZXIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzcGF0Y2hFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KGRvYywgZXZlbnQpIHtcbiAgICAgIGRvYy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgIERvbS5tYXBUYWdzKGRvYywgZmFsc2UsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRG9tO1xufSgpO1xuXG5leHBvcnRzLkRvbSA9IERvbTtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9iYXNlL01peGluLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5NaXhpbiA9IHZvaWQgMDtcblxudmFyIF9CaW5kYWJsZSA9IHJlcXVpcmUoXCIuL0JpbmRhYmxlXCIpO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgaXRlcltTeW1ib2wuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTsgfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG8sIGFsbG93QXJyYXlMaWtlKSB7IHZhciBpdCA9IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdIHx8IG9bXCJAQGl0ZXJhdG9yXCJdOyBpZiAoIWl0KSB7IGlmIChBcnJheS5pc0FycmF5KG8pIHx8IChpdCA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvKSkgfHwgYWxsb3dBcnJheUxpa2UgJiYgbyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHsgaWYgKGl0KSBvID0gaXQ7IHZhciBpID0gMDsgdmFyIEYgPSBmdW5jdGlvbiBGKCkge307IHJldHVybiB7IHM6IEYsIG46IGZ1bmN0aW9uIG4oKSB7IGlmIChpID49IG8ubGVuZ3RoKSByZXR1cm4geyBkb25lOiB0cnVlIH07IHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogb1tpKytdIH07IH0sIGU6IGZ1bmN0aW9uIGUoX2UpIHsgdGhyb3cgX2U7IH0sIGY6IEYgfTsgfSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH0gdmFyIG5vcm1hbENvbXBsZXRpb24gPSB0cnVlLCBkaWRFcnIgPSBmYWxzZSwgZXJyOyByZXR1cm4geyBzOiBmdW5jdGlvbiBzKCkgeyBpdCA9IGl0LmNhbGwobyk7IH0sIG46IGZ1bmN0aW9uIG4oKSB7IHZhciBzdGVwID0gaXQubmV4dCgpOyBub3JtYWxDb21wbGV0aW9uID0gc3RlcC5kb25lOyByZXR1cm4gc3RlcDsgfSwgZTogZnVuY3Rpb24gZShfZTIpIHsgZGlkRXJyID0gdHJ1ZTsgZXJyID0gX2UyOyB9LCBmOiBmdW5jdGlvbiBmKCkgeyB0cnkgeyBpZiAoIW5vcm1hbENvbXBsZXRpb24gJiYgaXRbXCJyZXR1cm5cIl0gIT0gbnVsbCkgaXRbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKGRpZEVycikgdGhyb3cgZXJyOyB9IH0gfTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gZWxzZSBpZiAoY2FsbCAhPT0gdm9pZCAwKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJEZXJpdmVkIGNvbnN0cnVjdG9ycyBtYXkgb25seSByZXR1cm4gb2JqZWN0IG9yIHVuZGVmaW5lZFwiKTsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoQm9vbGVhbiwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgQ29uc3RydWN0b3IgPSBTeW1ib2woJ2NvbnN0cnVjdG9yJyk7XG52YXIgTWl4aW5MaXN0ID0gU3ltYm9sKCdtaXhpbkxpc3QnKTtcblxudmFyIE1peGluID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTWl4aW4oKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1peGluKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhNaXhpbiwgbnVsbCwgW3tcbiAgICBrZXk6IFwiZnJvbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmcm9tKGJhc2VDbGFzcykge1xuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIG1peGlucyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIG1peGluc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdDbGFzcyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX2Jhc2VDbGFzcykge1xuICAgICAgICBfaW5oZXJpdHMobmV3Q2xhc3MsIF9iYXNlQ2xhc3MpO1xuXG4gICAgICAgIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIobmV3Q2xhc3MpO1xuXG4gICAgICAgIGZ1bmN0aW9uIG5ld0NsYXNzKCkge1xuICAgICAgICAgIHZhciBfdGhpcztcblxuICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBuZXdDbGFzcyk7XG5cbiAgICAgICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBiYXNlQ2xhc3MuY29uc3RydWN0b3IgPyBfdGhpcyA9IF9zdXBlci5jYWxsLmFwcGx5KF9zdXBlciwgW3RoaXNdLmNvbmNhdChhcmdzKSkgOiBudWxsO1xuXG4gICAgICAgICAgdmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG1peGlucyksXG4gICAgICAgICAgICAgIF9zdGVwO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBtaXhpbiA9IF9zdGVwLnZhbHVlO1xuXG4gICAgICAgICAgICAgIGlmIChtaXhpbltNaXhpbi5Db25zdHJ1Y3Rvcl0pIHtcbiAgICAgICAgICAgICAgICBtaXhpbltNaXhpbi5Db25zdHJ1Y3Rvcl0uYXBwbHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgc3dpdGNoIChfdHlwZW9mKG1peGluKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgICAgICAgIE1peGluLm1peENsYXNzKG1peGluLCBuZXdDbGFzcyk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICAgICAgICBNaXhpbi5taXhPYmplY3QobWl4aW4sIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IuZShlcnIpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IuZigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihfdGhpcywgaW5zdGFuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld0NsYXNzO1xuICAgICAgfShiYXNlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gbmV3Q2xhc3M7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvKGJhc2UpIHtcbiAgICAgIHZhciBkZXNjcmlwdG9ycyA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIG1peGlucyA9IG5ldyBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICAgIG1peGluc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICAgIH1cblxuICAgICAgbWl4aW5zLm1hcChmdW5jdGlvbiAobWl4aW4pIHtcbiAgICAgICAgc3dpdGNoIChfdHlwZW9mKG1peGluKSkge1xuICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGRlc2NyaXB0b3JzLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhtaXhpbikpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGRlc2NyaXB0b3JzLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhtaXhpbi5wcm90b3R5cGUpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIGRlc2NyaXB0b3JzLmNvbnN0cnVjdG9yO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhiYXNlLnByb3RvdHlwZSwgZGVzY3JpcHRvcnMpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndpdGhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3dpdGgoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIG1peGlucyA9IG5ldyBBcnJheShfbGVuNCksIF9rZXk0ID0gMDsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgICAgICBtaXhpbnNbX2tleTRdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZnJvbS5hcHBseSh0aGlzLCBbLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gX2NsYXNzKCkge1xuICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBfY2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9jbGFzcztcbiAgICAgIH0oKV0uY29uY2F0KG1peGlucykpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtaXhPYmplY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWl4T2JqZWN0KG1peGluLCBpbnN0YW5jZSkge1xuICAgICAgdmFyIF9pdGVyYXRvcjIgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtaXhpbikpLFxuICAgICAgICAgIF9zdGVwMjtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IyLnMoKTsgIShfc3RlcDIgPSBfaXRlcmF0b3IyLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZnVuYyA9IF9zdGVwMi52YWx1ZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgbWl4aW5bZnVuY10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGluc3RhbmNlW2Z1bmNdID0gbWl4aW5bZnVuY10uYmluZChpbnN0YW5jZSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbnN0YW5jZVtmdW5jXSA9IG1peGluW2Z1bmNdO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMi5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IyLmYoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9pdGVyYXRvcjMgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG1peGluKSksXG4gICAgICAgICAgX3N0ZXAzO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjMucygpOyAhKF9zdGVwMyA9IF9pdGVyYXRvcjMubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBfZnVuYyA9IF9zdGVwMy52YWx1ZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgbWl4aW5bX2Z1bmNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBpbnN0YW5jZVtfZnVuY10gPSBtaXhpbltfZnVuY10uYmluZChpbnN0YW5jZSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbnN0YW5jZVtfZnVuY10gPSBtaXhpbltfZnVuY107XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IzLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjMuZigpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtaXhDbGFzc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtaXhDbGFzcyhjbHMsIG5ld0NsYXNzKSB7XG4gICAgICB2YXIgX2l0ZXJhdG9yNCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNscy5wcm90b3R5cGUpKSxcbiAgICAgICAgICBfc3RlcDQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yNC5zKCk7ICEoX3N0ZXA0ID0gX2l0ZXJhdG9yNC5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGZ1bmMgPSBfc3RlcDQudmFsdWU7XG5cbiAgICAgICAgICBpZiAoWyduYW1lJywgJ3Byb3RvdHlwZScsICdsZW5ndGgnXS5pbmNsdWRlcyhmdW5jKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5ld0NsYXNzLCBmdW5jKTtcblxuICAgICAgICAgIGlmIChkZXNjcmlwdG9yICYmICFkZXNjcmlwdG9yLndyaXRhYmxlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNsc1tmdW5jXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbmV3Q2xhc3MucHJvdG90eXBlW2Z1bmNdID0gY2xzLnByb3RvdHlwZVtmdW5jXTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5ld0NsYXNzLnByb3RvdHlwZVtmdW5jXSA9IGNscy5wcm90b3R5cGVbZnVuY10uYmluZChuZXdDbGFzcy5wcm90b3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yNC5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3I0LmYoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9pdGVyYXRvcjUgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGNscy5wcm90b3R5cGUpKSxcbiAgICAgICAgICBfc3RlcDU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yNS5zKCk7ICEoX3N0ZXA1ID0gX2l0ZXJhdG9yNS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIF9mdW5jMiA9IF9zdGVwNS52YWx1ZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgY2xzW19mdW5jMl0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG5ld0NsYXNzLnByb3RvdHlwZVtfZnVuYzJdID0gY2xzLnByb3RvdHlwZVtfZnVuYzJdO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV3Q2xhc3MucHJvdG90eXBlW19mdW5jMl0gPSBjbHMucHJvdG90eXBlW19mdW5jMl0uYmluZChuZXdDbGFzcy5wcm90b3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yNS5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3I1LmYoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9pdGVyYXRvcjYgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjbHMpKSxcbiAgICAgICAgICBfc3RlcDY7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKCkge1xuICAgICAgICAgIHZhciBmdW5jID0gX3N0ZXA2LnZhbHVlO1xuXG4gICAgICAgICAgaWYgKFsnbmFtZScsICdwcm90b3R5cGUnLCAnbGVuZ3RoJ10uaW5jbHVkZXMoZnVuYykpIHtcbiAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5ld0NsYXNzLCBmdW5jKTtcblxuICAgICAgICAgIGlmIChkZXNjcmlwdG9yICYmICFkZXNjcmlwdG9yLndyaXRhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY2xzW2Z1bmNdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBuZXdDbGFzc1tmdW5jXSA9IGNsc1tmdW5jXTtcbiAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHByZXYgPSBuZXdDbGFzc1tmdW5jXSB8fCBmYWxzZTtcbiAgICAgICAgICB2YXIgbWV0aCA9IGNsc1tmdW5jXS5iaW5kKG5ld0NsYXNzKTtcblxuICAgICAgICAgIG5ld0NsYXNzW2Z1bmNdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJldiAmJiBwcmV2LmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBtZXRoLmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAoX2l0ZXJhdG9yNi5zKCk7ICEoX3N0ZXA2ID0gX2l0ZXJhdG9yNi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIF9yZXQgPSBfbG9vcCgpO1xuXG4gICAgICAgICAgaWYgKF9yZXQgPT09IFwiY29udGludWVcIikgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3I2LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjYuZigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2l0ZXJhdG9yNyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoY2xzKSksXG4gICAgICAgICAgX3N0ZXA3O1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgX2xvb3AyID0gZnVuY3Rpb24gX2xvb3AyKCkge1xuICAgICAgICAgIHZhciBmdW5jID0gX3N0ZXA3LnZhbHVlO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjbHNbZnVuY10gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG5ld0NsYXNzLnByb3RvdHlwZVtmdW5jXSA9IGNsc1tmdW5jXTtcbiAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHByZXYgPSBuZXdDbGFzc1tmdW5jXSB8fCBmYWxzZTtcbiAgICAgICAgICB2YXIgbWV0aCA9IGNsc1tmdW5jXS5iaW5kKG5ld0NsYXNzKTtcblxuICAgICAgICAgIG5ld0NsYXNzW2Z1bmNdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJldiAmJiBwcmV2LmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBtZXRoLmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAoX2l0ZXJhdG9yNy5zKCk7ICEoX3N0ZXA3ID0gX2l0ZXJhdG9yNy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIF9yZXQyID0gX2xvb3AyKCk7XG5cbiAgICAgICAgICBpZiAoX3JldDIgPT09IFwiY29udGludWVcIikgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3I3LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjcuZigpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtaXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWl4KG1peGluVG8pIHtcbiAgICAgIHZhciBjb25zdHJ1Y3RvcnMgPSBbXTtcbiAgICAgIHZhciBhbGxTdGF0aWMgPSB7fTtcbiAgICAgIHZhciBhbGxJbnN0YW5jZSA9IHt9O1xuXG4gICAgICB2YXIgbWl4YWJsZSA9IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlQmluZGFibGUobWl4aW5Ubyk7XG5cbiAgICAgIHZhciBfbG9vcDMgPSBmdW5jdGlvbiBfbG9vcDMoYmFzZSkge1xuICAgICAgICB2YXIgaW5zdGFuY2VOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2UucHJvdG90eXBlKTtcbiAgICAgICAgdmFyIHN0YXRpY05hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZSk7XG4gICAgICAgIHZhciBwcmVmaXggPSAvXihiZWZvcmV8YWZ0ZXIpX18oLispLztcblxuICAgICAgICB2YXIgX2l0ZXJhdG9yOCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHN0YXRpY05hbWVzKSxcbiAgICAgICAgICAgIF9zdGVwODtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBfbG9vcDUgPSBmdW5jdGlvbiBfbG9vcDUoKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IF9zdGVwOC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IG1ldGhvZE5hbWUubWF0Y2gocHJlZml4KTtcblxuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgIHN3aXRjaCAobWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdiZWZvcmUnOlxuICAgICAgICAgICAgICAgICAgbWl4YWJsZS5fX19iZWZvcmUoZnVuY3Rpb24gKHQsIGUsIHMsIG8sIGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgIT09IG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IGJhc2VbbWV0aG9kTmFtZV0uYmluZChvKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh2b2lkIDAsIF90b0NvbnN1bWFibGVBcnJheShhKSk7XG4gICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdhZnRlcic6XG4gICAgICAgICAgICAgICAgICBtaXhhYmxlLl9fX2FmdGVyKGZ1bmN0aW9uICh0LCBlLCBzLCBvLCBhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlICE9PSBtYXRjaFsyXSkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXRob2QgPSBiYXNlW21ldGhvZE5hbWVdLmJpbmQobyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodm9pZCAwLCBfdG9Db25zdW1hYmxlQXJyYXkoYSkpO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbFN0YXRpY1ttZXRob2ROYW1lXSkge1xuICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGJhc2VbbWV0aG9kTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWxsU3RhdGljW21ldGhvZE5hbWVdID0gYmFzZVttZXRob2ROYW1lXTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZm9yIChfaXRlcmF0b3I4LnMoKTsgIShfc3RlcDggPSBfaXRlcmF0b3I4Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgIHZhciBfcmV0MyA9IF9sb29wNSgpO1xuXG4gICAgICAgICAgICBpZiAoX3JldDMgPT09IFwiY29udGludWVcIikgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfaXRlcmF0b3I4LmUoZXJyKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBfaXRlcmF0b3I4LmYoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfaXRlcmF0b3I5ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoaW5zdGFuY2VOYW1lcyksXG4gICAgICAgICAgICBfc3RlcDk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgX2xvb3A2ID0gZnVuY3Rpb24gX2xvb3A2KCkge1xuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBfc3RlcDkudmFsdWU7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBtZXRob2ROYW1lLm1hdGNoKHByZWZpeCk7XG5cbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICBzd2l0Y2ggKG1hdGNoWzFdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYmVmb3JlJzpcbiAgICAgICAgICAgICAgICAgIG1peGFibGUuX19fYmVmb3JlKGZ1bmN0aW9uICh0LCBlLCBzLCBvLCBhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlICE9PSBtYXRjaFsyXSkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXRob2QgPSBiYXNlLnByb3RvdHlwZVttZXRob2ROYW1lXS5iaW5kKG8pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0aG9kLmFwcGx5KHZvaWQgMCwgX3RvQ29uc3VtYWJsZUFycmF5KGEpKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2FmdGVyJzpcbiAgICAgICAgICAgICAgICAgIG1peGFibGUuX19fYWZ0ZXIoZnVuY3Rpb24gKHQsIGUsIHMsIG8sIGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgIT09IG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IGJhc2UucHJvdG90eXBlW21ldGhvZE5hbWVdLmJpbmQobyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodm9pZCAwLCBfdG9Db25zdW1hYmxlQXJyYXkoYSkpO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbEluc3RhbmNlW21ldGhvZE5hbWVdKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYmFzZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWxsSW5zdGFuY2VbbWV0aG9kTmFtZV0gPSBiYXNlLnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZm9yIChfaXRlcmF0b3I5LnMoKTsgIShfc3RlcDkgPSBfaXRlcmF0b3I5Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgIHZhciBfcmV0NCA9IF9sb29wNigpO1xuXG4gICAgICAgICAgICBpZiAoX3JldDQgPT09IFwiY29udGludWVcIikgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfaXRlcmF0b3I5LmUoZXJyKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBfaXRlcmF0b3I5LmYoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgYmFzZSA9IHRoaXM7IGJhc2UgJiYgYmFzZS5wcm90b3R5cGU7IGJhc2UgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYmFzZSkpIHtcbiAgICAgICAgX2xvb3AzKGJhc2UpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBtZXRob2ROYW1lIGluIGFsbFN0YXRpYykge1xuICAgICAgICBtaXhpblRvW21ldGhvZE5hbWVdID0gYWxsU3RhdGljW21ldGhvZE5hbWVdLmJpbmQobWl4aW5Ubyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBfbG9vcDQgPSBmdW5jdGlvbiBfbG9vcDQoX21ldGhvZE5hbWUpIHtcbiAgICAgICAgbWl4aW5Uby5wcm90b3R5cGVbX21ldGhvZE5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZvciAodmFyIF9sZW41ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNSksIF9rZXk1ID0gMDsgX2tleTUgPCBfbGVuNTsgX2tleTUrKykge1xuICAgICAgICAgICAgYXJnc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBhbGxJbnN0YW5jZVtfbWV0aG9kTmFtZV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBfbWV0aG9kTmFtZSBpbiBhbGxJbnN0YW5jZSkge1xuICAgICAgICBfbG9vcDQoX21ldGhvZE5hbWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWl4YWJsZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTWl4aW47XG59KCk7XG5cbmV4cG9ydHMuTWl4aW4gPSBNaXhpbjtcbk1peGluLkNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gIH0pKCk7XG59KTsiLCJcbnJlcXVpcmUucmVnaXN0ZXIoXCJjdXJ2YXR1cmUvYmFzZS9Sb3V0ZXIuanNcIiwgZnVuY3Rpb24oZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlKSB7XG4gIHJlcXVpcmUgPSBfX21ha2VSZWxhdGl2ZVJlcXVpcmUocmVxdWlyZSwge30sIFwiY3VydmF0dXJlXCIpO1xuICAoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLlJvdXRlciA9IHZvaWQgMDtcblxudmFyIF9WaWV3ID0gcmVxdWlyZShcIi4vVmlld1wiKTtcblxudmFyIF9DYWNoZSA9IHJlcXVpcmUoXCIuL0NhY2hlXCIpO1xuXG52YXIgX0NvbmZpZyA9IHJlcXVpcmUoXCIuL0NvbmZpZ1wiKTtcblxudmFyIF9Sb3V0ZXMgPSByZXF1aXJlKFwiLi9Sb3V0ZXNcIik7XG5cbmZ1bmN0aW9uIF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG8sIGFsbG93QXJyYXlMaWtlKSB7IHZhciBpdCA9IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdIHx8IG9bXCJAQGl0ZXJhdG9yXCJdOyBpZiAoIWl0KSB7IGlmIChBcnJheS5pc0FycmF5KG8pIHx8IChpdCA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvKSkgfHwgYWxsb3dBcnJheUxpa2UgJiYgbyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHsgaWYgKGl0KSBvID0gaXQ7IHZhciBpID0gMDsgdmFyIEYgPSBmdW5jdGlvbiBGKCkge307IHJldHVybiB7IHM6IEYsIG46IGZ1bmN0aW9uIG4oKSB7IGlmIChpID49IG8ubGVuZ3RoKSByZXR1cm4geyBkb25lOiB0cnVlIH07IHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogb1tpKytdIH07IH0sIGU6IGZ1bmN0aW9uIGUoX2UpIHsgdGhyb3cgX2U7IH0sIGY6IEYgfTsgfSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH0gdmFyIG5vcm1hbENvbXBsZXRpb24gPSB0cnVlLCBkaWRFcnIgPSBmYWxzZSwgZXJyOyByZXR1cm4geyBzOiBmdW5jdGlvbiBzKCkgeyBpdCA9IGl0LmNhbGwobyk7IH0sIG46IGZ1bmN0aW9uIG4oKSB7IHZhciBzdGVwID0gaXQubmV4dCgpOyBub3JtYWxDb21wbGV0aW9uID0gc3RlcC5kb25lOyByZXR1cm4gc3RlcDsgfSwgZTogZnVuY3Rpb24gZShfZTIpIHsgZGlkRXJyID0gdHJ1ZTsgZXJyID0gX2UyOyB9LCBmOiBmdW5jdGlvbiBmKCkgeyB0cnkgeyBpZiAoIW5vcm1hbENvbXBsZXRpb24gJiYgaXRbXCJyZXR1cm5cIl0gIT0gbnVsbCkgaXRbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKGRpZEVycikgdGhyb3cgZXJyOyB9IH0gfTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIE5vdEZvdW5kRXJyb3IgPSBTeW1ib2woJ05vdEZvdW5kJyk7XG52YXIgSW50ZXJuYWxFcnJvciA9IFN5bWJvbCgnSW50ZXJuYWwnKTtcblxudmFyIFJvdXRlciA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJvdXRlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUm91dGVyKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhSb3V0ZXIsIG51bGwsIFt7XG4gICAga2V5OiBcIndhaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd2FpdCh2aWV3KSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgZXZlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICdET01Db250ZW50TG9hZGVkJztcbiAgICAgIHZhciBub2RlID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBkb2N1bWVudDtcbiAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5saXN0ZW4odmlldyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibGlzdGVuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciByb3V0ZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgICAgdGhpcy5saXN0ZW5lciA9IGxpc3RlbmVyIHx8IHRoaXMubGlzdGVuZXI7XG4gICAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcyB8fCBsaXN0ZW5lci5yb3V0ZXM7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMucXVlcnksIHRoaXMucXVlcnlPdmVyKHt9KSk7XG5cbiAgICAgIHZhciBsaXN0ZW4gPSBmdW5jdGlvbiBsaXN0ZW4oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoZXZlbnQuc3RhdGUgJiYgJ3JvdXRlZElkJyBpbiBldmVudC5zdGF0ZSkge1xuICAgICAgICAgIGlmIChldmVudC5zdGF0ZS5yb3V0ZWRJZCA8PSBfdGhpczIucm91dGVDb3VudCkge1xuICAgICAgICAgICAgX3RoaXMyLmhpc3Rvcnkuc3BsaWNlKGV2ZW50LnN0YXRlLnJvdXRlZElkKTtcblxuICAgICAgICAgICAgX3RoaXMyLnJvdXRlQ291bnQgPSBldmVudC5zdGF0ZS5yb3V0ZWRJZDtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnN0YXRlLnJvdXRlZElkID4gX3RoaXMyLnJvdXRlQ291bnQpIHtcbiAgICAgICAgICAgIF90aGlzMi5oaXN0b3J5LnB1c2goZXZlbnQuc3RhdGUucHJldik7XG5cbiAgICAgICAgICAgIF90aGlzMi5yb3V0ZUNvdW50ID0gZXZlbnQuc3RhdGUucm91dGVkSWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3RoaXMyLnN0YXRlID0gZXZlbnQuc3RhdGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKF90aGlzMi5wcmV2UGF0aCAhPT0gbnVsbCAmJiBfdGhpczIucHJldlBhdGggIT09IGxvY2F0aW9uLnBhdGhuYW1lKSB7XG4gICAgICAgICAgICBfdGhpczIuaGlzdG9yeS5wdXNoKF90aGlzMi5wcmV2UGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvY2F0aW9uLm9yaWdpbiAhPT0gJ251bGwnKSB7XG4gICAgICAgICAgX3RoaXMyLm1hdGNoKGxvY2F0aW9uLnBhdGhuYW1lLCBsaXN0ZW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXMyLm1hdGNoKF90aGlzMi5uZXh0UGF0aCwgbGlzdGVuZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiBfdGhpczIucXVlcnkpIHtcbiAgICAgICAgICBkZWxldGUgX3RoaXMyLnF1ZXJ5W2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihfdGhpczIucXVlcnksIF90aGlzMi5xdWVyeU92ZXIoe30pKTtcbiAgICAgIH07XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGxpc3Rlbik7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY3ZVcmxDaGFuZ2VkJywgbGlzdGVuKTtcbiAgICAgIHZhciByb3V0ZSA9IGxvY2F0aW9uLm9yaWdpbiAhPT0gJ251bGwnID8gbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggOiBmYWxzZTtcblxuICAgICAgaWYgKGxvY2F0aW9uLm9yaWdpbiAmJiBsb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgIHJvdXRlICs9IGxvY2F0aW9uLmhhc2g7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgICAgcm91dGVkSWQ6IHRoaXMucm91dGVDb3VudCxcbiAgICAgICAgdXJsOiBsb2NhdGlvbi5wYXRobmFtZSxcbiAgICAgICAgcHJldjogdGhpcy5wcmV2UGF0aFxuICAgICAgfTtcblxuICAgICAgaWYgKGxvY2F0aW9uLm9yaWdpbiAhPT0gJ251bGwnKSB7XG4gICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHN0YXRlLCBudWxsLCBsb2NhdGlvbi5wYXRobmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZ28ocm91dGUgIT09IGZhbHNlID8gcm91dGUgOiAnLycpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnb1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnbyhwYXRoKSB7XG4gICAgICB2YXIgc2lsZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcblxuICAgICAgdmFyIGNvbmZpZ1RpdGxlID0gX0NvbmZpZy5Db25maWcuZ2V0KCd0aXRsZScpO1xuXG4gICAgICBpZiAoY29uZmlnVGl0bGUpIHtcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBjb25maWdUaXRsZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICByb3V0ZWRJZDogdGhpcy5yb3V0ZUNvdW50LFxuICAgICAgICBwcmV2OiB0aGlzLnByZXZQYXRoLFxuICAgICAgICB1cmw6IGxvY2F0aW9uLnBhdGhuYW1lXG4gICAgICB9O1xuXG4gICAgICBpZiAoc2lsZW50ID09PSAtMSkge1xuICAgICAgICB0aGlzLm1hdGNoKHBhdGgsIHRoaXMubGlzdGVuZXIsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmIChsb2NhdGlvbi5vcmlnaW4gPT09ICdudWxsJykge1xuICAgICAgICB0aGlzLm5leHRQYXRoID0gcGF0aDtcbiAgICAgIH0gZWxzZSBpZiAoc2lsZW50ID09PSAyICYmIGxvY2F0aW9uLnBhdGhuYW1lICE9PSBwYXRoKSB7XG4gICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHN0YXRlLCBudWxsLCBwYXRoKTtcbiAgICAgIH0gZWxzZSBpZiAobG9jYXRpb24ucGF0aG5hbWUgIT09IHBhdGgpIHtcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUsIG51bGwsIHBhdGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNpbGVudCB8fCBzaWxlbnQgPCAwKSB7XG4gICAgICAgIGlmIChzaWxlbnQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5wYXRoID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgICAgaWYgKHBhdGguc3Vic3RyaW5nKDAsIDEpID09PSAnIycpIHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBIYXNoQ2hhbmdlRXZlbnQoJ2hhc2hjaGFuZ2UnKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY3ZVcmxDaGFuZ2VkJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpIGluIHRoaXMucXVlcnkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMucXVlcnlbaV07XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5xdWVyeSwgdGhpcy5xdWVyeU92ZXIoe30pKTtcbiAgICAgIHRoaXMucHJldlBhdGggPSBwYXRoO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXRjaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXRjaChwYXRoLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHZhciBmb3JjZVJlZnJlc2ggPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy5wYXRoID09PSBwYXRoICYmICFmb3JjZVJlZnJlc2ggJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucXVlcnlTdHJpbmcgPSBsb2NhdGlvbi5zZWFyY2g7XG4gICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgdmFyIHByZXYgPSB0aGlzLnByZXZQYXRoO1xuICAgICAgdmFyIGN1cnJlbnQgPSBsaXN0ZW5lciAmJiBsaXN0ZW5lci5hcmdzID8gbGlzdGVuZXIuYXJncy5jb250ZW50IDogbnVsbDtcblxuICAgICAgdmFyIHJvdXRlcyA9IHRoaXMucm91dGVzIHx8IGxpc3RlbmVyICYmIGxpc3RlbmVyLnJvdXRlcyB8fCBfUm91dGVzLlJvdXRlcy5kdW1wKCk7XG5cbiAgICAgIHZhciBxdWVyeSA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uc2VhcmNoKTtcblxuICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnF1ZXJ5KSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnF1ZXJ5W2ldO1xuICAgICAgfVxuXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMucXVlcnksIHRoaXMucXVlcnlPdmVyKHt9KSk7XG4gICAgICB2YXIgYXJncyA9IHt9LFxuICAgICAgICAgIHNlbGVjdGVkID0gZmFsc2UsXG4gICAgICAgICAgcmVzdWx0ID0gJyc7XG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSkuc3BsaXQoJy8nKTtcblxuICAgICAgZm9yICh2YXIgX2kgaW4gdGhpcy5xdWVyeSkge1xuICAgICAgICBhcmdzW19pXSA9IHRoaXMucXVlcnlbX2ldO1xuICAgICAgfVxuXG4gICAgICBMMTogZm9yICh2YXIgX2kyIGluIHJvdXRlcykge1xuICAgICAgICB2YXIgcm91dGUgPSBfaTIuc3BsaXQoJy8nKTtcblxuICAgICAgICBpZiAocm91dGUubGVuZ3RoIDwgcGF0aC5sZW5ndGggJiYgcm91dGVbcm91dGUubGVuZ3RoIC0gMV0gIT09ICcqJykge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgTDI6IGZvciAodmFyIGogaW4gcm91dGUpIHtcbiAgICAgICAgICBpZiAocm91dGVbal0uc3Vic3RyKDAsIDEpID09ICclJykge1xuICAgICAgICAgICAgdmFyIGFyZ05hbWUgPSBudWxsO1xuICAgICAgICAgICAgdmFyIGdyb3VwcyA9IC9eJShcXHcrKVxcPz8vLmV4ZWMocm91dGVbal0pO1xuXG4gICAgICAgICAgICBpZiAoZ3JvdXBzICYmIGdyb3Vwc1sxXSkge1xuICAgICAgICAgICAgICBhcmdOYW1lID0gZ3JvdXBzWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWFyZ05hbWUpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXCIuY29uY2F0KHJvdXRlW2pdLCBcIiBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCBzZWdtZW50IGluIHJvdXRlIFxcXCJcIikuY29uY2F0KF9pMiwgXCJcXFwiXCIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFwYXRoW2pdKSB7XG4gICAgICAgICAgICAgIGlmIChyb3V0ZVtqXS5zdWJzdHIocm91dGVbal0ubGVuZ3RoIC0gMSwgMSkgPT0gJz8nKSB7XG4gICAgICAgICAgICAgICAgYXJnc1thcmdOYW1lXSA9ICcnO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlIEwxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhcmdzW2FyZ05hbWVdID0gcGF0aFtqXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHJvdXRlW2pdICE9PSAnKicgJiYgcGF0aFtqXSAhPT0gcm91dGVbal0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlIEwxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGVjdGVkID0gX2kyO1xuICAgICAgICByZXN1bHQgPSByb3V0ZXNbX2kyXTtcblxuICAgICAgICBpZiAocm91dGVbcm91dGUubGVuZ3RoIC0gMV0gPT09ICcqJykge1xuICAgICAgICAgIGFyZ3MucGF0aHBhcnRzID0gcGF0aC5zbGljZShyb3V0ZS5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB2YXIgZXZlbnRTdGFydCA9IG5ldyBDdXN0b21FdmVudCgnY3ZSb3V0ZVN0YXJ0Jywge1xuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgIHByZXY6IHByZXYsXG4gICAgICAgICAgcm9vdDogbGlzdGVuZXIsXG4gICAgICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkLFxuICAgICAgICAgIHJvdXRlczogcm91dGVzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRTdGFydCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3JjZVJlZnJlc2ggJiYgbGlzdGVuZXIgJiYgY3VycmVudCAmJiByZXN1bHQgaW5zdGFuY2VvZiBPYmplY3QgJiYgY3VycmVudCBpbnN0YW5jZW9mIHJlc3VsdCAmJiAhKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpICYmIGN1cnJlbnQudXBkYXRlKGFyZ3MpKSB7XG4gICAgICAgIGxpc3RlbmVyLmFyZ3MuY29udGVudCA9IGN1cnJlbnQ7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShzZWxlY3RlZCBpbiByb3V0ZXMpKSB7XG4gICAgICAgIHJvdXRlc1tzZWxlY3RlZF0gPSByb3V0ZXNbTm90Rm91bmRFcnJvcl07XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9jZXNzUm91dGUgPSBmdW5jdGlvbiBwcm9jZXNzUm91dGUoc2VsZWN0ZWQpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygcm91dGVzW3NlbGVjdGVkXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmIChyb3V0ZXNbc2VsZWN0ZWRdLnByb3RvdHlwZSBpbnN0YW5jZW9mIF9WaWV3LlZpZXcpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyByb3V0ZXNbc2VsZWN0ZWRdKGFyZ3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSByb3V0ZXNbc2VsZWN0ZWRdKGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSByb3V0ZXNbc2VsZWN0ZWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IHByb2Nlc3NSb3V0ZShzZWxlY3RlZCk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXN1bHQgPSBwcm9jZXNzUm91dGUoTm90Rm91bmRFcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIShyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSkge1xuICAgICAgICAgIHJlc3VsdCA9IFByb21pc2UucmVzb2x2ZShyZXN1bHQpOyAvLyByZXR1cm4gdGhpcy51cGRhdGUoXG4gICAgICAgICAgLy8gXHRsaXN0ZW5lclxuICAgICAgICAgIC8vIFx0LCBwYXRoXG4gICAgICAgICAgLy8gXHQsIHJlc3VsdFxuICAgICAgICAgIC8vIFx0LCByb3V0ZXNcbiAgICAgICAgICAvLyBcdCwgc2VsZWN0ZWRcbiAgICAgICAgICAvLyBcdCwgYXJnc1xuICAgICAgICAgIC8vIFx0LCBmb3JjZVJlZnJlc2hcbiAgICAgICAgICAvLyApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKGZ1bmN0aW9uIChyZWFsUmVzdWx0KSB7XG4gICAgICAgICAgX3RoaXMzLnVwZGF0ZShsaXN0ZW5lciwgcGF0aCwgcmVhbFJlc3VsdCwgcm91dGVzLCBzZWxlY3RlZCwgYXJncywgZm9yY2VSZWZyZXNoKTtcbiAgICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2N2Um91dGVFcnJvcicsIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgcHJldjogcHJldixcbiAgICAgICAgICAgICAgICB2aWV3OiBsaXN0ZW5lcixcbiAgICAgICAgICAgICAgICByb3V0ZXM6IHJvdXRlcyxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF90aGlzMy51cGRhdGUobGlzdGVuZXIsIHBhdGgsIHdpbmRvd1snZGV2TW9kZSddID8gU3RyaW5nKGVycm9yKSA6ICdFcnJvcjogNTAwJywgcm91dGVzLCBzZWxlY3RlZCwgYXJncywgZm9yY2VSZWZyZXNoKTtcblxuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2N2Um91dGVFcnJvcicsIHtcbiAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgIHByZXY6IHByZXYsXG4gICAgICAgICAgICAgIHZpZXc6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICByb3V0ZXM6IHJvdXRlcyxcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGUobGlzdGVuZXIsIHBhdGgsIHdpbmRvd1snZGV2TW9kZSddID8gU3RyaW5nKGVycm9yKSA6ICdFcnJvcjogNTAwJywgcm91dGVzLCBzZWxlY3RlZCwgYXJncywgZm9yY2VSZWZyZXNoKTsgLy8gdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUobGlzdGVuZXIsIHBhdGgsIHJlc3VsdCwgcm91dGVzLCBzZWxlY3RlZCwgYXJncywgZm9yY2VSZWZyZXNoKSB7XG4gICAgICBpZiAoIWxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHByZXYgPSB0aGlzLnByZXZQYXRoO1xuICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjdlJvdXRlJywge1xuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgIHByZXY6IHByZXYsXG4gICAgICAgICAgdmlldzogbGlzdGVuZXIsXG4gICAgICAgICAgcm91dGVzOiByb3V0ZXMsXG4gICAgICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAocmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAobGlzdGVuZXIuYXJncy5jb250ZW50IGluc3RhbmNlb2YgX1ZpZXcuVmlldykge1xuICAgICAgICAgIGxpc3RlbmVyLmFyZ3MuY29udGVudC5wYXVzZSh0cnVlKTtcbiAgICAgICAgICBsaXN0ZW5lci5hcmdzLmNvbnRlbnQucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCkpIHtcbiAgICAgICAgICBsaXN0ZW5lci5hcmdzLmNvbnRlbnQgPSByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgX1ZpZXcuVmlldykge1xuICAgICAgICAgIHJlc3VsdC5wYXVzZShmYWxzZSk7XG4gICAgICAgICAgcmVzdWx0LnVwZGF0ZShhcmdzLCBmb3JjZVJlZnJlc2gpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBldmVudEVuZCA9IG5ldyBDdXN0b21FdmVudCgnY3ZSb3V0ZUVuZCcsIHtcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICBwcmV2OiBwcmV2LFxuICAgICAgICAgIHZpZXc6IGxpc3RlbmVyLFxuICAgICAgICAgIHJvdXRlczogcm91dGVzLFxuICAgICAgICAgIHNlbGVjdGVkOiBzZWxlY3RlZFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRFbmQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJxdWVyeU92ZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcXVlcnlPdmVyKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgICAgdmFyIHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uc2VhcmNoKTtcbiAgICAgIHZhciBmaW5hbEFyZ3MgPSB7fTtcbiAgICAgIHZhciBxdWVyeSA9IHt9O1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIocGFyYW1zKSxcbiAgICAgICAgICBfc3RlcDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IucygpOyAhKF9zdGVwID0gX2l0ZXJhdG9yLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgcGFpciA9IF9zdGVwLnZhbHVlO1xuICAgICAgICAgIHF1ZXJ5W3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IuZigpO1xuICAgICAgfVxuXG4gICAgICBmaW5hbEFyZ3MgPSBPYmplY3QuYXNzaWduKGZpbmFsQXJncywgcXVlcnksIGFyZ3MpO1xuICAgICAgZGVsZXRlIGZpbmFsQXJnc1snYXBpJ107XG4gICAgICByZXR1cm4gZmluYWxBcmdzOyAvLyBmb3IobGV0IGkgaW4gcXVlcnkpXG4gICAgICAvLyB7XG4gICAgICAvLyBcdGZpbmFsQXJnc1tpXSA9IHF1ZXJ5W2ldO1xuICAgICAgLy8gfVxuICAgICAgLy8gZm9yKGxldCBpIGluIGFyZ3MpXG4gICAgICAvLyB7XG4gICAgICAvLyBcdGZpbmFsQXJnc1tpXSA9IGFyZ3NbaV07XG4gICAgICAvLyB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInF1ZXJ5VG9TdHJpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcXVlcnlUb1N0cmluZygpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICAgIHZhciBmcmVzaCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG4gICAgICB2YXIgcGFydHMgPSBbXSxcbiAgICAgICAgICBmaW5hbEFyZ3MgPSBhcmdzO1xuXG4gICAgICBpZiAoIWZyZXNoKSB7XG4gICAgICAgIGZpbmFsQXJncyA9IHRoaXMucXVlcnlPdmVyKGFyZ3MpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpIGluIGZpbmFsQXJncykge1xuICAgICAgICBpZiAoZmluYWxBcmdzW2ldID09PSAnJykge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFydHMucHVzaChpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGZpbmFsQXJnc1tpXSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFydHMuam9pbignJicpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRRdWVyeVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRRdWVyeShuYW1lLCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgICB2YXIgYXJncyA9IHRoaXMucXVlcnlPdmVyKCk7XG4gICAgICBhcmdzW25hbWVdID0gdmFsdWU7XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRlbGV0ZSBhcmdzW25hbWVdO1xuICAgICAgfVxuXG4gICAgICB2YXIgcXVlcnlTdHJpbmcgPSB0aGlzLnF1ZXJ5VG9TdHJpbmcoYXJncywgdHJ1ZSk7XG4gICAgICB0aGlzLmdvKGxvY2F0aW9uLnBhdGhuYW1lICsgKHF1ZXJ5U3RyaW5nID8gJz8nICsgcXVlcnlTdHJpbmcgOiAnPycpLCBzaWxlbnQpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBSb3V0ZXI7XG59KCk7XG5cbmV4cG9ydHMuUm91dGVyID0gUm91dGVyO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJvdXRlciwgJ3F1ZXJ5Jywge1xuICBjb25maWd1cmFibGU6IGZhbHNlLFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgd3JpdGFibGU6IGZhbHNlLFxuICB2YWx1ZToge31cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJvdXRlciwgJ2hpc3RvcnknLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiBbXVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUm91dGVyLCAncm91dGVDb3VudCcsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICB2YWx1ZTogMFxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUm91dGVyLCAncHJldlBhdGgnLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgdmFsdWU6IG51bGxcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJvdXRlciwgJ3F1ZXJ5U3RyaW5nJywge1xuICBjb25maWd1cmFibGU6IGZhbHNlLFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgd3JpdGFibGU6IHRydWUsXG4gIHZhbHVlOiBudWxsXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSb3V0ZXIsICdJbnRlcm5hbEVycm9yJywge1xuICBjb25maWd1cmFibGU6IGZhbHNlLFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgd3JpdGFibGU6IGZhbHNlLFxuICB2YWx1ZTogSW50ZXJuYWxFcnJvclxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUm91dGVyLCAnTm90Rm91bmRFcnJvcicsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbiAgdmFsdWU6IE5vdEZvdW5kRXJyb3Jcbn0pO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvUm91dGVzLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5Sb3V0ZXMgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIEFwcFJvdXRlcyA9IHt9O1xudmFyIF9yZXF1aXJlID0gcmVxdWlyZTtcblxudHJ5IHtcbiAgT2JqZWN0LmFzc2lnbihBcHBSb3V0ZXMsIF9yZXF1aXJlKCdSb3V0ZXMnKS5Sb3V0ZXMgfHwge30pO1xufSBjYXRjaCAoZXJyb3IpIHtcbiAgZ2xvYmFsVGhpcy5kZXZNb2RlID09PSB0cnVlICYmIGNvbnNvbGUud2FybihlcnJvcik7XG59XG5cbnZhciBSb3V0ZXMgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBSb3V0ZXMoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJvdXRlcyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUm91dGVzLCBudWxsLCBbe1xuICAgIGtleTogXCJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJvdXRlc1tuYW1lXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHVtcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkdW1wKCkge1xuICAgICAgcmV0dXJuIHRoaXMucm91dGVzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBSb3V0ZXM7XG59KCk7XG5cbmV4cG9ydHMuUm91dGVzID0gUm91dGVzO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJvdXRlcywgJ3JvdXRlcycsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbiAgdmFsdWU6IEFwcFJvdXRlc1xufSk7XG4gIH0pKCk7XG59KTsiLCJcbnJlcXVpcmUucmVnaXN0ZXIoXCJjdXJ2YXR1cmUvYmFzZS9SdWxlU2V0LmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5SdWxlU2V0ID0gdm9pZCAwO1xuXG52YXIgX0RvbSA9IHJlcXVpcmUoXCIuL0RvbVwiKTtcblxudmFyIF9UYWcgPSByZXF1aXJlKFwiLi9UYWdcIik7XG5cbnZhciBfVmlldyA9IHJlcXVpcmUoXCIuL1ZpZXdcIik7XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyB2YXIgX2kgPSBhcnIgPT0gbnVsbCA/IG51bGwgOiB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGFycltTeW1ib2wuaXRlcmF0b3JdIHx8IGFycltcIkBAaXRlcmF0b3JcIl07IGlmIChfaSA9PSBudWxsKSByZXR1cm47IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX3MsIF9lOyB0cnkgeyBmb3IgKF9pID0gX2kuY2FsbChhcnIpOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG8sIGFsbG93QXJyYXlMaWtlKSB7IHZhciBpdCA9IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdIHx8IG9bXCJAQGl0ZXJhdG9yXCJdOyBpZiAoIWl0KSB7IGlmIChBcnJheS5pc0FycmF5KG8pIHx8IChpdCA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvKSkgfHwgYWxsb3dBcnJheUxpa2UgJiYgbyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHsgaWYgKGl0KSBvID0gaXQ7IHZhciBpID0gMDsgdmFyIEYgPSBmdW5jdGlvbiBGKCkge307IHJldHVybiB7IHM6IEYsIG46IGZ1bmN0aW9uIG4oKSB7IGlmIChpID49IG8ubGVuZ3RoKSByZXR1cm4geyBkb25lOiB0cnVlIH07IHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogb1tpKytdIH07IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IHRocm93IF9lMjsgfSwgZjogRiB9OyB9IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gaXRlcmF0ZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfSB2YXIgbm9ybWFsQ29tcGxldGlvbiA9IHRydWUsIGRpZEVyciA9IGZhbHNlLCBlcnI7IHJldHVybiB7IHM6IGZ1bmN0aW9uIHMoKSB7IGl0ID0gaXQuY2FsbChvKTsgfSwgbjogZnVuY3Rpb24gbigpIHsgdmFyIHN0ZXAgPSBpdC5uZXh0KCk7IG5vcm1hbENvbXBsZXRpb24gPSBzdGVwLmRvbmU7IHJldHVybiBzdGVwOyB9LCBlOiBmdW5jdGlvbiBlKF9lMykgeyBkaWRFcnIgPSB0cnVlOyBlcnIgPSBfZTM7IH0sIGY6IGZ1bmN0aW9uIGYoKSB7IHRyeSB7IGlmICghbm9ybWFsQ29tcGxldGlvbiAmJiBpdFtcInJldHVyblwiXSAhPSBudWxsKSBpdFtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoZGlkRXJyKSB0aHJvdyBlcnI7IH0gfSB9OyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgUnVsZVNldCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJ1bGVTZXQoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJ1bGVTZXQpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFJ1bGVTZXQsIFt7XG4gICAga2V5OiBcImFkZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLnJ1bGVzID0gdGhpcy5ydWxlcyB8fCB7fTtcbiAgICAgIHRoaXMucnVsZXNbc2VsZWN0b3JdID0gdGhpcy5ydWxlc1tzZWxlY3Rvcl0gfHwgW107XG4gICAgICB0aGlzLnJ1bGVzW3NlbGVjdG9yXS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhcHBseVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhcHBseSgpIHtcbiAgICAgIHZhciBkb2MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGRvY3VtZW50O1xuICAgICAgdmFyIHZpZXcgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICBSdWxlU2V0LmFwcGx5KGRvYywgdmlldyk7XG5cbiAgICAgIGZvciAodmFyIHNlbGVjdG9yIGluIHRoaXMucnVsZXMpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnJ1bGVzW3NlbGVjdG9yXSkge1xuICAgICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMucnVsZXNbc2VsZWN0b3JdW2ldO1xuICAgICAgICAgIHZhciB3cmFwcGVkID0gUnVsZVNldC53cmFwKGRvYywgY2FsbGJhY2ssIHZpZXcpO1xuICAgICAgICAgIHZhciBub2RlcyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgICAgIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihub2RlcyksXG4gICAgICAgICAgICAgIF9zdGVwO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBub2RlID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIHdyYXBwZWQobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IuZShlcnIpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IuZigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwdXJnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwdXJnZSgpIHtcbiAgICAgIGlmICghdGhpcy5ydWxlcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIF9pID0gMCwgX09iamVjdCRlbnRyaWVzID0gT2JqZWN0LmVudHJpZXModGhpcy5ydWxlcyk7IF9pIDwgX09iamVjdCRlbnRyaWVzLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgX09iamVjdCRlbnRyaWVzJF9pID0gX3NsaWNlZFRvQXJyYXkoX09iamVjdCRlbnRyaWVzW19pXSwgMiksXG4gICAgICAgICAgICBrID0gX09iamVjdCRlbnRyaWVzJF9pWzBdLFxuICAgICAgICAgICAgdiA9IF9PYmplY3QkZW50cmllcyRfaVsxXTtcblxuICAgICAgICBpZiAoIXRoaXMucnVsZXNba10pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGtrIGluIHRoaXMucnVsZXNba10pIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5ydWxlc1trXVtra107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1dLCBbe1xuICAgIGtleTogXCJhZGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgdGhpcy5nbG9iYWxSdWxlcyA9IHRoaXMuZ2xvYmFsUnVsZXMgfHwge307XG4gICAgICB0aGlzLmdsb2JhbFJ1bGVzW3NlbGVjdG9yXSA9IHRoaXMuZ2xvYmFsUnVsZXNbc2VsZWN0b3JdIHx8IFtdO1xuICAgICAgdGhpcy5nbG9iYWxSdWxlc1tzZWxlY3Rvcl0ucHVzaChjYWxsYmFjayk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYXBwbHlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXBwbHkoKSB7XG4gICAgICB2YXIgZG9jID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBkb2N1bWVudDtcbiAgICAgIHZhciB2aWV3ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG4gICAgICBmb3IgKHZhciBzZWxlY3RvciBpbiB0aGlzLmdsb2JhbFJ1bGVzKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5nbG9iYWxSdWxlc1tzZWxlY3Rvcl0pIHtcbiAgICAgICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLmdsb2JhbFJ1bGVzW3NlbGVjdG9yXVtpXTtcbiAgICAgICAgICB2YXIgd3JhcHBlZCA9IHRoaXMud3JhcChkb2MsIGNhbGxiYWNrLCB2aWV3KTtcbiAgICAgICAgICB2YXIgbm9kZXMgPSBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yMiA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG5vZGVzKSxcbiAgICAgICAgICAgICAgX3N0ZXAyO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMi5zKCk7ICEoX3N0ZXAyID0gX2l0ZXJhdG9yMi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBub2RlID0gX3N0ZXAyLnZhbHVlO1xuICAgICAgICAgICAgICB3cmFwcGVkKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2l0ZXJhdG9yMi5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjIuZigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ3YWl0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdhaXQoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgZXZlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdET01Db250ZW50TG9hZGVkJztcbiAgICAgIHZhciBub2RlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBkb2N1bWVudDtcblxuICAgICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50LCBub2RlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmFwcGx5KCk7XG4gICAgICAgIH07XG4gICAgICB9KGV2ZW50LCBub2RlKTtcblxuICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndyYXBcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd3JhcChkb2MsIG9yaWdpbmFsQ2FsbGJhY2spIHtcbiAgICAgIHZhciB2aWV3ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuICAgICAgdmFyIGNhbGxiYWNrID0gb3JpZ2luYWxDYWxsYmFjaztcblxuICAgICAgaWYgKG9yaWdpbmFsQ2FsbGJhY2sgaW5zdGFuY2VvZiBfVmlldy5WaWV3IHx8IG9yaWdpbmFsQ2FsbGJhY2sgJiYgb3JpZ2luYWxDYWxsYmFjay5wcm90b3R5cGUgJiYgb3JpZ2luYWxDYWxsYmFjay5wcm90b3R5cGUgaW5zdGFuY2VvZiBfVmlldy5WaWV3KSB7XG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgICAgICAgcmV0dXJuIG9yaWdpbmFsQ2FsbGJhY2s7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQuX19fY3ZBcHBsaWVkX19fID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX19fY3ZBcHBsaWVkX19fJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogbmV3IFdlYWtTZXQoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsZW1lbnQuX19fY3ZBcHBsaWVkX19fLmhhcyhvcmlnaW5hbENhbGxiYWNrKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkaXJlY3QsIHBhcmVudFZpZXc7XG5cbiAgICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgICBkaXJlY3QgPSBwYXJlbnRWaWV3ID0gdmlldztcblxuICAgICAgICAgIGlmICh2aWV3LnZpZXdMaXN0KSB7XG4gICAgICAgICAgICBwYXJlbnRWaWV3ID0gdmlldy52aWV3TGlzdC5wYXJlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRhZyA9IG5ldyBfVGFnLlRhZyhlbGVtZW50LCBwYXJlbnRWaWV3LCBudWxsLCB1bmRlZmluZWQsIGRpcmVjdCk7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0YWcuZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICB2YXIgc2libGluZyA9IHRhZy5lbGVtZW50Lm5leHRTaWJsaW5nO1xuICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2sodGFnKTtcblxuICAgICAgICBpZiAocmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVsZW1lbnQuX19fY3ZBcHBsaWVkX19fLmFkZChvcmlnaW5hbENhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgIHJlc3VsdCA9IG5ldyBfVGFnLlRhZyhyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIF9UYWcuVGFnKSB7XG4gICAgICAgICAgaWYgKCFyZXN1bHQuZWxlbWVudC5jb250YWlucyh0YWcuZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHdoaWxlICh0YWcuZWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5lbGVtZW50LmFwcGVuZENoaWxkKHRhZy5lbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWcucmVtb3ZlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNpYmxpbmcpIHtcbiAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUocmVzdWx0LmVsZW1lbnQsIHNpYmxpbmcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocmVzdWx0LmVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnByb3RvdHlwZSAmJiByZXN1bHQucHJvdG90eXBlIGluc3RhbmNlb2YgX1ZpZXcuVmlldykge1xuICAgICAgICAgIHJlc3VsdCA9IG5ldyByZXN1bHQoe30sIHZpZXcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIF9WaWV3LlZpZXcpIHtcbiAgICAgICAgICBpZiAodmlldykge1xuICAgICAgICAgICAgdmlldy5jbGVhbnVwLnB1c2goZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByLnJlbW92ZSgpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfShyZXN1bHQpKTtcbiAgICAgICAgICAgIHZpZXcuY2xlYW51cC5wdXNoKHZpZXcuYXJncy5iaW5kVG8oZnVuY3Rpb24gKHYsIGssIHQpIHtcbiAgICAgICAgICAgICAgdFtrXSA9IHY7XG4gICAgICAgICAgICAgIHJlc3VsdC5hcmdzW2tdID0gdjtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHZpZXcuY2xlYW51cC5wdXNoKHJlc3VsdC5hcmdzLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCwgZCkge1xuICAgICAgICAgICAgICB0W2tdID0gdjtcbiAgICAgICAgICAgICAgdmlldy5hcmdzW2tdID0gdjtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0YWcuY2xlYXIoKTtcbiAgICAgICAgICByZXN1bHQucmVuZGVyKHRhZy5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUnVsZVNldDtcbn0oKTtcblxuZXhwb3J0cy5SdWxlU2V0ID0gUnVsZVNldDtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9iYXNlL1NldE1hcC5qc1wiLCBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUpIHtcbiAgcmVxdWlyZSA9IF9fbWFrZVJlbGF0aXZlUmVxdWlyZShyZXF1aXJlLCB7fSwgXCJjdXJ2YXR1cmVcIik7XG4gIChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuU2V0TWFwID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHsgaWYgKF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSkgeyBfY29uc3RydWN0ID0gUmVmbGVjdC5jb25zdHJ1Y3Q7IH0gZWxzZSB7IF9jb25zdHJ1Y3QgPSBmdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHsgdmFyIGEgPSBbbnVsbF07IGEucHVzaC5hcHBseShhLCBhcmdzKTsgdmFyIENvbnN0cnVjdG9yID0gRnVuY3Rpb24uYmluZC5hcHBseShQYXJlbnQsIGEpOyB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTsgaWYgKENsYXNzKSBfc2V0UHJvdG90eXBlT2YoaW5zdGFuY2UsIENsYXNzLnByb3RvdHlwZSk7IHJldHVybiBpbnN0YW5jZTsgfTsgfSByZXR1cm4gX2NvbnN0cnVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgQm9vbGVhbi5wcm90b3R5cGUudmFsdWVPZi5jYWxsKFJlZmxlY3QuY29uc3RydWN0KEJvb2xlYW4sIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgaXRlcltTeW1ib2wuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lKSB7IHRocm93IF9lOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMjsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBTZXRNYXAgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTZXRNYXAoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNldE1hcCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJfbWFwXCIsIG5ldyBNYXAoKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU2V0TWFwLCBbe1xuICAgIGtleTogXCJoYXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuX21hcC5oYXMoa2V5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAuZ2V0KGtleSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldE9uZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRPbmUoa2V5KSB7XG4gICAgICB2YXIgc2V0ID0gdGhpcy5nZXQoa2V5KTtcblxuICAgICAgdmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHNldCksXG4gICAgICAgICAgX3N0ZXA7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVudHJ5ID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgcmV0dXJuIGVudHJ5O1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvci5mKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoa2V5LCB2YWx1ZSkge1xuICAgICAgdmFyIHNldCA9IHRoaXMuX21hcC5nZXQoa2V5KTtcblxuICAgICAgaWYgKCFzZXQpIHtcbiAgICAgICAgdGhpcy5fbWFwLnNldChrZXksIHNldCA9IG5ldyBTZXQoKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZXQuYWRkKHZhbHVlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShrZXksIHZhbHVlKSB7XG4gICAgICB2YXIgc2V0ID0gdGhpcy5fbWFwLmdldChrZXkpO1xuXG4gICAgICBpZiAoIXNldCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciByZXMgPSBzZXRbXCJkZWxldGVcIl0odmFsdWUpO1xuXG4gICAgICBpZiAoIXNldC5zaXplKSB7XG4gICAgICAgIHRoaXMuX21hcFtcImRlbGV0ZVwiXShrZXkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ2YWx1ZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgICAgcmV0dXJuIF9jb25zdHJ1Y3QoU2V0LCBfdG9Db25zdW1hYmxlQXJyYXkoX3RvQ29uc3VtYWJsZUFycmF5KHRoaXMuX21hcC52YWx1ZXMoKSkubWFwKGZ1bmN0aW9uIChzZXQpIHtcbiAgICAgICAgcmV0dXJuIF90b0NvbnN1bWFibGVBcnJheShzZXQudmFsdWVzKCkpO1xuICAgICAgfSkpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU2V0TWFwO1xufSgpO1xuXG5leHBvcnRzLlNldE1hcCA9IFNldE1hcDtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9iYXNlL1RhZy5qc1wiLCBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUpIHtcbiAgcmVxdWlyZSA9IF9fbWFrZVJlbGF0aXZlUmVxdWlyZShyZXF1aXJlLCB7fSwgXCJjdXJ2YXR1cmVcIik7XG4gIChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuVGFnID0gdm9pZCAwO1xuXG52YXIgX0JpbmRhYmxlID0gcmVxdWlyZShcIi4vQmluZGFibGVcIik7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIFRhZyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFRhZyhlbGVtZW50LCBwYXJlbnQsIHJlZiwgaW5kZXgsIGRpcmVjdCkge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRhZyk7XG5cbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgc3ViZG9jID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoZWxlbWVudCk7XG4gICAgICBlbGVtZW50ID0gc3ViZG9jLmZpcnN0Q2hpbGQ7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50ID0gX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2VCaW5kYWJsZShlbGVtZW50KTtcbiAgICB0aGlzLm5vZGUgPSB0aGlzLmVsZW1lbnQ7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5kaXJlY3QgPSBkaXJlY3Q7XG4gICAgdGhpcy5yZWYgPSByZWY7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIHRoaXMuY2xlYW51cCA9IFtdO1xuXG4gICAgdGhpc1tfQmluZGFibGUuQmluZGFibGUuT25BbGxHZXRdID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgX3RoaXMyW25hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBfdGhpczJbbmFtZV07XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpczIubm9kZSAmJiB0eXBlb2YgX3RoaXMyLm5vZGVbbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgX3RoaXMyJG5vZGU7XG5cbiAgICAgICAgICByZXR1cm4gKF90aGlzMiRub2RlID0gX3RoaXMyLm5vZGUpW25hbWVdLmFwcGx5KF90aGlzMiRub2RlLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMyLm5vZGUgJiYgbmFtZSBpbiBfdGhpczIubm9kZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMyLm5vZGVbbmFtZV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfdGhpczJbbmFtZV07XG4gICAgfTtcblxuICAgIHZhciBnZW5lcmF0ZVN0eWxlciA9IGZ1bmN0aW9uIGdlbmVyYXRlU3R5bGVyKF90aGlzKSB7XG4gICAgICByZXR1cm4gX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2UoZnVuY3Rpb24gKHN0eWxlcykge1xuICAgICAgICBpZiAoIV90aGlzLm5vZGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzdHlsZXMpIHtcbiAgICAgICAgICBpZiAocHJvcGVydHlbMF0gPT09ICctJykge1xuICAgICAgICAgICAgX3RoaXMubm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgU3RyaW5nKHN0eWxlc1twcm9wZXJ0eV0pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMubm9kZS5zdHlsZVtwcm9wZXJ0eV0gPSBTdHJpbmcoc3R5bGVzW3Byb3BlcnR5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5zdHlsZSA9IGdlbmVyYXRlU3R5bGVyKHRoaXMpO1xuICAgIHRoaXMucHJveHkgPSBfQmluZGFibGUuQmluZGFibGUubWFrZSh0aGlzKTtcbiAgICB0aGlzLnByb3h5LnN0eWxlLmJpbmRUbyhmdW5jdGlvbiAodiwgaykge1xuICAgICAgX3RoaXMyLmVsZW1lbnQuc3R5bGVba10gPSB2O1xuICAgIH0pO1xuICAgIHRoaXMucHJveHkuYmluZFRvKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICBpZiAoayBpbiBlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnRba10gPSB2O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMucHJveHk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoVGFnLCBbe1xuICAgIGtleTogXCJhdHRyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGF0dHIoYXR0cmlidXRlcykge1xuICAgICAgZm9yICh2YXIgYXR0cmlidXRlIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlXSA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5ub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIGF0dHJpYnV0ZXNbYXR0cmlidXRlXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIGlmICh0aGlzLm5vZGUpIHtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBfQmluZGFibGUuQmluZGFibGUuY2xlYXJCaW5kaW5ncyh0aGlzKTtcblxuICAgICAgdmFyIGNsZWFudXA7XG5cbiAgICAgIHdoaWxlIChjbGVhbnVwID0gdGhpcy5jbGVhbnVwLnNoaWZ0KCkpIHtcbiAgICAgICAgY2xlYW51cCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgIGlmICghdGhpcy5ub2RlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGRldGFjaEV2ZW50ID0gbmV3IEV2ZW50KCdjdkRvbURldGFjaGVkJyk7XG4gICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChkZXRhY2hFdmVudCk7XG4gICAgICB0aGlzLm5vZGUgPSB0aGlzLmVsZW1lbnQgPSB0aGlzLnJlZiA9IHRoaXMucGFyZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbGVhclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgIGlmICghdGhpcy5ub2RlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGRldGFjaEV2ZW50ID0gbmV3IEV2ZW50KCdjdkRvbURldGFjaGVkJyk7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgICB0aGlzLm5vZGUuZmlyc3RDaGlsZC5kaXNwYXRjaEV2ZW50KGRldGFjaEV2ZW50KTtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUNoaWxkKHRoaXMubm9kZS5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicGF1c2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGF1c2UoKSB7XG4gICAgICB2YXIgcGF1c2VkID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsaXN0ZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGlzdGVuKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlO1xuICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgcmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgcmVtb3ZlciA9IGZ1bmN0aW9uIHJlbW92ZXIoKSB7XG4gICAgICAgIHJlbW92ZSgpO1xuXG4gICAgICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCdBbHJlYWR5IHJlbW92ZWQhJyk7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnBhcmVudC5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZW1vdmVyKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZW1vdmVyO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBUYWc7XG59KCk7XG5cbmV4cG9ydHMuVGFnID0gVGFnO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvVmlldy5qc1wiLCBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUpIHtcbiAgcmVxdWlyZSA9IF9fbWFrZVJlbGF0aXZlUmVxdWlyZShyZXF1aXJlLCB7fSwgXCJjdXJ2YXR1cmVcIik7XG4gIChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuVmlldyA9IHZvaWQgMDtcblxudmFyIF9CaW5kYWJsZSA9IHJlcXVpcmUoXCIuL0JpbmRhYmxlXCIpO1xuXG52YXIgX1ZpZXdMaXN0ID0gcmVxdWlyZShcIi4vVmlld0xpc3RcIik7XG5cbnZhciBfUm91dGVyID0gcmVxdWlyZShcIi4vUm91dGVyXCIpO1xuXG52YXIgX0RvbSA9IHJlcXVpcmUoXCIuL0RvbVwiKTtcblxudmFyIF9UYWcgPSByZXF1aXJlKFwiLi9UYWdcIik7XG5cbnZhciBfQmFnID0gcmVxdWlyZShcIi4vQmFnXCIpO1xuXG52YXIgX1J1bGVTZXQgPSByZXF1aXJlKFwiLi9SdWxlU2V0XCIpO1xuXG52YXIgX01peGluID0gcmVxdWlyZShcIi4vTWl4aW5cIik7XG5cbnZhciBfUHJvbWlzZU1peGluID0gcmVxdWlyZShcIi4uL21peGluL1Byb21pc2VNaXhpblwiKTtcblxudmFyIF9FdmVudFRhcmdldE1peGluID0gcmVxdWlyZShcIi4uL21peGluL0V2ZW50VGFyZ2V0TWl4aW5cIik7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGl0ZXJbU3ltYm9sLml0ZXJhdG9yXSAhPSBudWxsIHx8IGl0ZXJbXCJAQGl0ZXJhdG9yXCJdICE9IG51bGwpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KGFycik7IH1cblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfaSA9IGFyciA9PSBudWxsID8gbnVsbCA6IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJyW1N5bWJvbC5pdGVyYXRvcl0gfHwgYXJyW1wiQEBpdGVyYXRvclwiXTsgaWYgKF9pID09IG51bGwpIHJldHVybjsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfcywgX2U7IHRyeSB7IGZvciAoX2kgPSBfaS5jYWxsKGFycik7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobywgYWxsb3dBcnJheUxpa2UpIHsgdmFyIGl0ID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0gfHwgb1tcIkBAaXRlcmF0b3JcIl07IGlmICghaXQpIHsgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgeyBpZiAoaXQpIG8gPSBpdDsgdmFyIGkgPSAwOyB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7fTsgcmV0dXJuIHsgczogRiwgbjogZnVuY3Rpb24gbigpIHsgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7IGRvbmU6IHRydWUgfTsgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBvW2krK10gfTsgfSwgZTogZnVuY3Rpb24gZShfZTIpIHsgdGhyb3cgX2UyOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UzKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMzsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gZWxzZSBpZiAoY2FsbCAhPT0gdm9pZCAwKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJEZXJpdmVkIGNvbnN0cnVjdG9ycyBtYXkgb25seSByZXR1cm4gb2JqZWN0IG9yIHVuZGVmaW5lZFwiKTsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoQm9vbGVhbiwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIGRvbnRQYXJzZSA9IFN5bWJvbCgnZG9udFBhcnNlJyk7XG52YXIgZXhwYW5kQmluZCA9IFN5bWJvbCgnZXhwYW5kQmluZCcpO1xudmFyIHV1aWQgPSBTeW1ib2woJ3V1aWQnKTtcbnZhciBtb3ZlSW5kZXggPSAwO1xuXG52YXIgVmlldyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX01peGluJHdpdGgpIHtcbiAgX2luaGVyaXRzKFZpZXcsIF9NaXhpbiR3aXRoKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKFZpZXcpO1xuXG4gIGZ1bmN0aW9uIFZpZXcoKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBtYWluVmlldyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBWaWV3KTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgYXJncywgbWFpblZpZXcpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ2FyZ3MnLCB7XG4gICAgICB2YWx1ZTogX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2UoYXJncylcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIHV1aWQsIHtcbiAgICAgIHZhbHVlOiBfdGhpcy5jb25zdHJ1Y3Rvci51dWlkKClcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdub2Rlc0F0dGFjaGVkJywge1xuICAgICAgdmFsdWU6IG5ldyBfQmFnLkJhZyhmdW5jdGlvbiAoaSwgcywgYSkge30pXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnbm9kZXNEZXRhY2hlZCcsIHtcbiAgICAgIHZhbHVlOiBuZXcgX0JhZy5CYWcoZnVuY3Rpb24gKGksIHMsIGEpIHt9KVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ19vblJlbW92ZScsIHtcbiAgICAgIHZhbHVlOiBuZXcgX0JhZy5CYWcoZnVuY3Rpb24gKGksIHMsIGEpIHt9KVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ2NsZWFudXAnLCB7XG4gICAgICB2YWx1ZTogW11cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdwYXJlbnQnLCB7XG4gICAgICB2YWx1ZTogbWFpblZpZXdcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICd2aWV3cycsIHtcbiAgICAgIHZhbHVlOiBuZXcgTWFwKClcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICd2aWV3TGlzdHMnLCB7XG4gICAgICB2YWx1ZTogbmV3IE1hcCgpXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnd2l0aFZpZXdzJywge1xuICAgICAgdmFsdWU6IG5ldyBNYXAoKVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ3RhZ3MnLCB7XG4gICAgICB2YWx1ZTogX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2Uoe30pXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnbm9kZXMnLCB7XG4gICAgICB2YWx1ZTogX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2UoW10pXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAndGltZW91dHMnLCB7XG4gICAgICB2YWx1ZTogbmV3IE1hcCgpXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnaW50ZXJ2YWxzJywge1xuICAgICAgdmFsdWU6IFtdXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnZnJhbWVzJywge1xuICAgICAgdmFsdWU6IFtdXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAncnVsZVNldCcsIHtcbiAgICAgIHZhbHVlOiBuZXcgX1J1bGVTZXQuUnVsZVNldCgpXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAncHJlUnVsZVNldCcsIHtcbiAgICAgIHZhbHVlOiBuZXcgX1J1bGVTZXQuUnVsZVNldCgpXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnc3ViQmluZGluZ3MnLCB7XG4gICAgICB2YWx1ZToge31cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICd0ZW1wbGF0ZXMnLCB7XG4gICAgICB2YWx1ZToge31cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdldmVudENsZWFudXAnLCB7XG4gICAgICB2YWx1ZTogW11cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICd1bnBhdXNlQ2FsbGJhY2tzJywge1xuICAgICAgdmFsdWU6IG5ldyBNYXAoKVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ2ludGVycG9sYXRlUmVnZXgnLCB7XG4gICAgICB2YWx1ZTogLyhcXFtcXFsoKD86XFwkKyk/W1xcd1xcLlxcfC1dKylcXF1cXF0pL2dcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdyZW5kZXJlZCcsIHtcbiAgICAgIHZhbHVlOiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYWNjZXB0LCByZWplY3QpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ3JlbmRlckNvbXBsZXRlJywge1xuICAgICAgICAgIHZhbHVlOiBhY2NlcHRcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH0pO1xuICAgIF90aGlzLmNvbnRyb2xsZXIgPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKTtcbiAgICBfdGhpcy5sb2FkZWQgPSBQcm9taXNlLnJlc29sdmUoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpO1xuICAgIF90aGlzLnRlbXBsYXRlID0gXCJcIjtcbiAgICBfdGhpcy5maXJzdE5vZGUgPSBudWxsO1xuICAgIF90aGlzLmxhc3ROb2RlID0gbnVsbDtcbiAgICBfdGhpcy52aWV3TGlzdCA9IG51bGw7XG4gICAgX3RoaXMubWFpblZpZXcgPSBudWxsO1xuICAgIF90aGlzLnByZXNlcnZlID0gZmFsc2U7XG4gICAgX3RoaXMucmVtb3ZlZCA9IGZhbHNlOyAvLyByZXR1cm4gQmluZGFibGUubWFrZSh0aGlzKTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhWaWV3LCBbe1xuICAgIGtleTogXCJfaWRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzW3V1aWRdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJvbkZyYW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uRnJhbWUoY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgc3RvcHBlZCA9IGZhbHNlO1xuXG4gICAgICB2YXIgY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICBzdG9wcGVkID0gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBjID0gZnVuY3Rpb24gYyh0aW1lc3RhbXApIHtcbiAgICAgICAgaWYgKF90aGlzMi5yZW1vdmVkIHx8IHN0b3BwZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIV90aGlzMi5wYXVzZWQpIHtcbiAgICAgICAgICBjYWxsYmFjayhEYXRlLm5vdygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjKERhdGUubm93KCkpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmZyYW1lcy5wdXNoKGNhbmNlbCk7XG4gICAgICByZXR1cm4gY2FuY2VsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJvbk5leHRGcmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbk5leHRGcmFtZShjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhEYXRlLm5vdygpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJvbklkbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25JZGxlKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gcmVxdWVzdElkbGVDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhEYXRlLm5vdygpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJvblRpbWVvdXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25UaW1lb3V0KHRpbWUsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIHRpbWVvdXRJbmZvID0ge1xuICAgICAgICB0aW1lb3V0OiBudWxsLFxuICAgICAgICBjYWxsYmFjazogbnVsbCxcbiAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgZmlyZWQ6IGZhbHNlLFxuICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgcGF1c2VkOiBmYWxzZVxuICAgICAgfTtcblxuICAgICAgdmFyIHdyYXBwZWRDYWxsYmFjayA9IGZ1bmN0aW9uIHdyYXBwZWRDYWxsYmFjaygpIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgdGltZW91dEluZm8uZmlyZWQgPSB0cnVlO1xuXG4gICAgICAgIF90aGlzMy50aW1lb3V0c1tcImRlbGV0ZVwiXSh0aW1lb3V0SW5mby50aW1lb3V0KTtcbiAgICAgIH07XG5cbiAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dCh3cmFwcGVkQ2FsbGJhY2ssIHRpbWUpO1xuICAgICAgdGltZW91dEluZm8uY2FsbGJhY2sgPSB3cmFwcGVkQ2FsbGJhY2s7XG4gICAgICB0aW1lb3V0SW5mby50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgIHRoaXMudGltZW91dHMuc2V0KHRpbWVvdXRJbmZvLnRpbWVvdXQsIHRpbWVvdXRJbmZvKTtcbiAgICAgIHJldHVybiB0aW1lb3V0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbGVhclRpbWVvdXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gKF9jbGVhclRpbWVvdXQpIHtcbiAgICAgIGZ1bmN0aW9uIGNsZWFyVGltZW91dChfeCkge1xuICAgICAgICByZXR1cm4gX2NsZWFyVGltZW91dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuXG4gICAgICBjbGVhclRpbWVvdXQudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfY2xlYXJUaW1lb3V0LnRvU3RyaW5nKCk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gY2xlYXJUaW1lb3V0O1xuICAgIH0oZnVuY3Rpb24gKHRpbWVvdXQpIHtcbiAgICAgIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLnRpbWVvdXRzKSxcbiAgICAgICAgICBfc3RlcDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IucygpOyAhKF9zdGVwID0gX2l0ZXJhdG9yLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgX3N0ZXAkdmFsdWUgPSBfc2xpY2VkVG9BcnJheShfc3RlcC52YWx1ZSwgMiksXG4gICAgICAgICAgICAgIGNhbGxiYWNrID0gX3N0ZXAkdmFsdWVbMF0sXG4gICAgICAgICAgICAgIHRpbWVvdXRJbmZvID0gX3N0ZXAkdmFsdWVbMV07XG5cbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEluZm8udGltZW91dCk7XG4gICAgICAgICAgdGhpcy50aW1lb3V0c1tcImRlbGV0ZVwiXSh0aW1lb3V0SW5mby50aW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IuZigpO1xuICAgICAgfVxuICAgIH0pXG4gIH0sIHtcbiAgICBrZXk6IFwib25JbnRlcnZhbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbkludGVydmFsKHRpbWUsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgdGltZW91dCA9IHNldEludGVydmFsKGNhbGxiYWNrLCB0aW1lKTtcbiAgICAgIHRoaXMuaW50ZXJ2YWxzLnB1c2goe1xuICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgIHRpbWU6IHRpbWUsXG4gICAgICAgIHBhdXNlZDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRpbWVvdXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFySW50ZXJ2YWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gKF9jbGVhckludGVydmFsKSB7XG4gICAgICBmdW5jdGlvbiBjbGVhckludGVydmFsKF94Mikge1xuICAgICAgICByZXR1cm4gX2NsZWFySW50ZXJ2YWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cblxuICAgICAgY2xlYXJJbnRlcnZhbC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9jbGVhckludGVydmFsLnRvU3RyaW5nKCk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gY2xlYXJJbnRlcnZhbDtcbiAgICB9KGZ1bmN0aW9uICh0aW1lb3V0KSB7XG4gICAgICBmb3IgKHZhciBpIGluIHRoaXMuaW50ZXJ2YWxzKSB7XG4gICAgICAgIGlmICh0aW1lb3V0ID09PSB0aGlzLmludGVydmFsc1tpXS50aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsc1tpXS50aW1lb3V0KTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5pbnRlcnZhbHNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9LCB7XG4gICAga2V5OiBcInBhdXNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgICAgdmFyIHBhdXNlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAocGF1c2VkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSAhdGhpcy5wYXVzZWQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGF1c2VkID0gcGF1c2VkO1xuXG4gICAgICBpZiAodGhpcy5wYXVzZWQpIHtcbiAgICAgICAgdmFyIF9pdGVyYXRvcjIgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLnRpbWVvdXRzKSxcbiAgICAgICAgICAgIF9zdGVwMjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMi5zKCk7ICEoX3N0ZXAyID0gX2l0ZXJhdG9yMi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICB2YXIgX3N0ZXAyJHZhbHVlID0gX3NsaWNlZFRvQXJyYXkoX3N0ZXAyLnZhbHVlLCAyKSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IF9zdGVwMiR2YWx1ZVswXSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gX3N0ZXAyJHZhbHVlWzFdO1xuXG4gICAgICAgICAgICBpZiAodGltZW91dC5maXJlZCkge1xuICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRzW1wiZGVsZXRlXCJdKHRpbWVvdXQudGltZW91dCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dC50aW1lb3V0KTtcbiAgICAgICAgICAgIHRpbWVvdXQucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRpbWVvdXQudGltZSA9IE1hdGgubWF4KDAsIHRpbWVvdXQudGltZSAtIChEYXRlLm5vdygpIC0gdGltZW91dC5jcmVhdGVkKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfaXRlcmF0b3IyLmUoZXJyKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBfaXRlcmF0b3IyLmYoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnRlcnZhbHMpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxzW2ldLnRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgX2l0ZXJhdG9yMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMudGltZW91dHMpLFxuICAgICAgICAgICAgX3N0ZXAzO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yIChfaXRlcmF0b3IzLnMoKTsgIShfc3RlcDMgPSBfaXRlcmF0b3IzLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgIHZhciBfc3RlcDMkdmFsdWUgPSBfc2xpY2VkVG9BcnJheShfc3RlcDMudmFsdWUsIDIpLFxuICAgICAgICAgICAgICAgIF9jYWxsYmFjayA9IF9zdGVwMyR2YWx1ZVswXSxcbiAgICAgICAgICAgICAgICBfdGltZW91dCA9IF9zdGVwMyR2YWx1ZVsxXTtcblxuICAgICAgICAgICAgaWYgKCFfdGltZW91dC5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdGltZW91dC5maXJlZCkge1xuICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRzW1wiZGVsZXRlXCJdKF90aW1lb3V0LnRpbWVvdXQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3RpbWVvdXQudGltZW91dCA9IHNldFRpbWVvdXQoX3RpbWVvdXQuY2FsbGJhY2ssIF90aW1lb3V0LnRpbWUpO1xuICAgICAgICAgICAgX3RpbWVvdXQucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfaXRlcmF0b3IzLmUoZXJyKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBfaXRlcmF0b3IzLmYoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIF9pMiBpbiB0aGlzLmludGVydmFscykge1xuICAgICAgICAgIGlmICghdGhpcy5pbnRlcnZhbHNbX2kyXS50aW1lb3V0LnBhdXNlZCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5pbnRlcnZhbHNbX2kyXS50aW1lb3V0LnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuaW50ZXJ2YWxzW19pMl0udGltZW91dCA9IHNldEludGVydmFsKHRoaXMuaW50ZXJ2YWxzW19pMl0uY2FsbGJhY2ssIHRoaXMuaW50ZXJ2YWxzW19pMl0udGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX2l0ZXJhdG9yNCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMudW5wYXVzZUNhbGxiYWNrcyksXG4gICAgICAgICAgICBfc3RlcDQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKF9pdGVyYXRvcjQucygpOyAhKF9zdGVwNCA9IF9pdGVyYXRvcjQubigpKS5kb25lOykge1xuICAgICAgICAgICAgdmFyIF9zdGVwNCR2YWx1ZSA9IF9zbGljZWRUb0FycmF5KF9zdGVwNC52YWx1ZSwgMiksXG4gICAgICAgICAgICAgICAgX2NhbGxiYWNrMiA9IF9zdGVwNCR2YWx1ZVsxXTtcblxuICAgICAgICAgICAgX2NhbGxiYWNrMigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgX2l0ZXJhdG9yNC5lKGVycik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgX2l0ZXJhdG9yNC5mKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVucGF1c2VDYWxsYmFja3MuY2xlYXIoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9pdGVyYXRvcjUgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLnZpZXdMaXN0cyksXG4gICAgICAgICAgX3N0ZXA1O1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjUucygpOyAhKF9zdGVwNSA9IF9pdGVyYXRvcjUubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBfc3RlcDUkdmFsdWUgPSBfc2xpY2VkVG9BcnJheShfc3RlcDUudmFsdWUsIDIpLFxuICAgICAgICAgICAgICB0YWcgPSBfc3RlcDUkdmFsdWVbMF0sXG4gICAgICAgICAgICAgIHZpZXdMaXN0ID0gX3N0ZXA1JHZhbHVlWzFdO1xuXG4gICAgICAgICAgdmlld0xpc3QucGF1c2UoISFwYXVzZWQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yNS5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3I1LmYoKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgX2kzIGluIHRoaXMudGFncykge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnRhZ3NbX2kzXSkpIHtcbiAgICAgICAgICBmb3IgKHZhciBqIGluIHRoaXMudGFnc1tfaTNdKSB7XG4gICAgICAgICAgICB0aGlzLnRhZ3NbX2kzXVtqXS5wYXVzZSghIXBhdXNlZCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhZ3NbX2kzXS5wYXVzZSghIXBhdXNlZCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbmRlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICB2YXIgX3RoaXMkbm9kZXMsXG4gICAgICAgICAgX3RoaXM0ID0gdGhpcztcblxuICAgICAgdmFyIHBhcmVudE5vZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICB2YXIgaW5zZXJ0UG9pbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG5cbiAgICAgIGlmIChwYXJlbnROb2RlIGluc3RhbmNlb2YgVmlldykge1xuICAgICAgICBwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5maXJzdE5vZGUucGFyZW50Tm9kZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluc2VydFBvaW50IGluc3RhbmNlb2YgVmlldykge1xuICAgICAgICBpbnNlcnRQb2ludCA9IGluc2VydFBvaW50LmZpcnN0Tm9kZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZmlyc3ROb2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlUmVuZGVyKHBhcmVudE5vZGUsIGluc2VydFBvaW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVuZGVyJykpO1xuICAgICAgdmFyIHRlbXBsYXRlUGFyc2VkID0gdGhpcy50ZW1wbGF0ZSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgPyB0aGlzLnRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKSA6IFZpZXcudGVtcGxhdGVzLmhhcyh0aGlzLnRlbXBsYXRlKTtcbiAgICAgIHZhciBzdWJEb2MgPSB0ZW1wbGF0ZVBhcnNlZCA/IHRoaXMudGVtcGxhdGUgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50ID8gdGVtcGxhdGVQYXJzZWQgOiBWaWV3LnRlbXBsYXRlcy5nZXQodGhpcy50ZW1wbGF0ZSkuY2xvbmVOb2RlKHRydWUpIDogZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQodGhpcy50ZW1wbGF0ZSk7XG5cbiAgICAgIGlmICghdGVtcGxhdGVQYXJzZWQgJiYgISh0aGlzLnRlbXBsYXRlIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCkpIHtcbiAgICAgICAgVmlldy50ZW1wbGF0ZXMuc2V0KHRoaXMudGVtcGxhdGUsIHN1YkRvYy5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1haW5WaWV3IHx8IHRoaXMucHJlUnVsZVNldC5hcHBseShzdWJEb2MsIHRoaXMpO1xuICAgICAgdGhpcy5tYXBUYWdzKHN1YkRvYyk7XG4gICAgICB0aGlzLm1haW5WaWV3IHx8IHRoaXMucnVsZVNldC5hcHBseShzdWJEb2MsIHRoaXMpO1xuXG4gICAgICBpZiAod2luZG93LmRldk1vZGUgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5maXJzdE5vZGUgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwiVGVtcGxhdGUgXCIuY29uY2F0KHRoaXMuX2lkLCBcIiBTdGFydFwiKSk7XG4gICAgICAgIHRoaXMubGFzdE5vZGUgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwiVGVtcGxhdGUgXCIuY29uY2F0KHRoaXMuX2lkLCBcIiBFbmRcIikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maXJzdE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICAgIHRoaXMubGFzdE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICB9XG5cbiAgICAgIChfdGhpcyRub2RlcyA9IHRoaXMubm9kZXMpLnB1c2guYXBwbHkoX3RoaXMkbm9kZXMsIFt0aGlzLmZpcnN0Tm9kZV0uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShBcnJheS5mcm9tKHN1YkRvYy5jaGlsZE5vZGVzKSksIFt0aGlzLmxhc3ROb2RlXSkpO1xuXG4gICAgICB0aGlzLnBvc3RSZW5kZXIocGFyZW50Tm9kZSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZW5kZXJlZCcpKTtcblxuICAgICAgaWYgKCF0aGlzLmRpc3BhdGNoQXR0YWNoKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICB2YXIgcm9vdE5vZGUgPSBwYXJlbnROb2RlLmdldFJvb3ROb2RlKCk7XG5cbiAgICAgICAgaWYgKGluc2VydFBvaW50KSB7XG4gICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5maXJzdE5vZGUsIGluc2VydFBvaW50KTtcbiAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmxhc3ROb2RlLCBpbnNlcnRQb2ludCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmZpcnN0Tm9kZSk7XG4gICAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmxhc3ROb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHN1YkRvYywgdGhpcy5sYXN0Tm9kZSk7XG4gICAgICAgIG1vdmVJbmRleCsrO1xuXG4gICAgICAgIGlmIChyb290Tm9kZS5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgIHRoaXMuYXR0YWNoZWQocm9vdE5vZGUsIHBhcmVudE5vZGUpO1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hBdHRhY2hlZChyb290Tm9kZSwgcGFyZW50Tm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZpcnN0RG9tQXR0YWNoID0gZnVuY3Rpb24gZmlyc3REb21BdHRhY2goZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghZXZlbnQudGFyZ2V0LmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3RoaXM0LmF0dGFjaGVkKHJvb3ROb2RlLCBwYXJlbnROb2RlKTtcblxuICAgICAgICAgICAgX3RoaXM0LmRpc3BhdGNoQXR0YWNoZWQocm9vdE5vZGUsIHBhcmVudE5vZGUpO1xuXG4gICAgICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2N2RG9tQXR0YWNoZWQnLCBmaXJzdERvbUF0dGFjaCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHBhcmVudE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY3ZEb21BdHRhY2hlZCcsIGZpcnN0RG9tQXR0YWNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbmRlckNvbXBsZXRlKHRoaXMubm9kZXMpO1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRpc3BhdGNoQXR0YWNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3BhdGNoQXR0YWNoKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2F0dGFjaCcsIHtcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgdGFyZ2V0OiB0aGlzXG4gICAgICB9KSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRpc3BhdGNoQXR0YWNoZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcGF0Y2hBdHRhY2hlZChyb290Tm9kZSwgcGFyZW50Tm9kZSkge1xuICAgICAgdmFyIHZpZXcgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2F0dGFjaGVkJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICB2aWV3OiB2aWV3IHx8IHRoaXMsXG4gICAgICAgICAgbm9kZTogcGFyZW50Tm9kZSxcbiAgICAgICAgICByb290OiByb290Tm9kZSxcbiAgICAgICAgICBtYWluVmlldzogdGhpc1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRG9tQXR0YWNoZWQodmlldyk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3I2ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5ub2Rlc0F0dGFjaGVkLml0ZW1zKCkpLFxuICAgICAgICAgIF9zdGVwNjtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3I2LnMoKTsgIShfc3RlcDYgPSBfaXRlcmF0b3I2Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBfc3RlcDYudmFsdWU7XG4gICAgICAgICAgY2FsbGJhY2socm9vdE5vZGUsIHBhcmVudE5vZGUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yNi5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3I2LmYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzcGF0Y2hEb21BdHRhY2hlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwYXRjaERvbUF0dGFjaGVkKHZpZXcpIHtcbiAgICAgIHZhciBfdGhpczUgPSB0aGlzO1xuXG4gICAgICB0aGlzLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gbi5ub2RlVHlwZSAhPT0gTm9kZS5DT01NRU5UX05PREU7XG4gICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBpZiAoIWNoaWxkLm1hdGNoZXMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfRG9tLkRvbS5tYXBUYWdzKGNoaWxkLCBmYWxzZSwgZnVuY3Rpb24gKHRhZywgd2Fsa2VyKSB7XG4gICAgICAgICAgaWYgKCF0YWcubWF0Y2hlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhZy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY3ZEb21BdHRhY2hlZCcsIHtcbiAgICAgICAgICAgIHRhcmdldDogdGFnLFxuICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgIHZpZXc6IHZpZXcgfHwgX3RoaXM1LFxuICAgICAgICAgICAgICBtYWluVmlldzogX3RoaXM1XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjaGlsZC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY3ZEb21BdHRhY2hlZCcsIHtcbiAgICAgICAgICB0YXJnZXQ6IGNoaWxkLFxuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgdmlldzogdmlldyB8fCBfdGhpczUsXG4gICAgICAgICAgICBtYWluVmlldzogX3RoaXM1XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVSZW5kZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVSZW5kZXIocGFyZW50Tm9kZSwgaW5zZXJ0UG9pbnQpIHtcbiAgICAgIHZhciB3aWxsUmVSZW5kZXIgPSB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZVJlbmRlcicpLCB7XG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIHRhcmdldDogdGhpc1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghd2lsbFJlUmVuZGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHN1YkRvYyA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIGlmICh0aGlzLmZpcnN0Tm9kZS5pc0Nvbm5lY3RlZCkge1xuICAgICAgICB2YXIgZGV0YWNoID0gdGhpcy5ub2Rlc0RldGFjaGVkLml0ZW1zKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiBkZXRhY2gpIHtcbiAgICAgICAgICBkZXRhY2hbaV0oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzdWJEb2MuYXBwZW5kLmFwcGx5KHN1YkRvYywgX3RvQ29uc3VtYWJsZUFycmF5KHRoaXMubm9kZXMpKTtcblxuICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgaWYgKGluc2VydFBvaW50KSB7XG4gICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5maXJzdE5vZGUsIGluc2VydFBvaW50KTtcbiAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmxhc3ROb2RlLCBpbnNlcnRQb2ludCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmZpcnN0Tm9kZSk7XG4gICAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmxhc3ROb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHN1YkRvYywgdGhpcy5sYXN0Tm9kZSk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlUmVuZGVyZWQnKSwge1xuICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgICAgdGFyZ2V0OiB0aGlzXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcm9vdE5vZGUgPSBwYXJlbnROb2RlLmdldFJvb3ROb2RlKCk7XG5cbiAgICAgICAgaWYgKHJvb3ROb2RlLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hlZChyb290Tm9kZSwgcGFyZW50Tm9kZSk7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEF0dGFjaGVkKHJvb3ROb2RlLCBwYXJlbnROb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwVGFnc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXBUYWdzKHN1YkRvYykge1xuICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICAgIF9Eb20uRG9tLm1hcFRhZ3Moc3ViRG9jLCBmYWxzZSwgZnVuY3Rpb24gKHRhZywgd2Fsa2VyKSB7XG4gICAgICAgIGlmICh0YWdbZG9udFBhcnNlXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YWcubWF0Y2hlcykge1xuICAgICAgICAgIHRhZyA9IF90aGlzNi5tYXBJbnRlcnBvbGF0YWJsZVRhZyh0YWcpO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3YtdGVtcGxhdGVdJykgJiYgX3RoaXM2Lm1hcFRlbXBsYXRlVGFnKHRhZykgfHwgdGFnO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3Ytc2xvdF0nKSAmJiBfdGhpczYubWFwU2xvdFRhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgICB0YWcgPSB0YWcubWF0Y2hlcygnW2N2LXByZXJlbmRlcl0nKSAmJiBfdGhpczYubWFwUHJlbmRlcmVyVGFnKHRhZykgfHwgdGFnO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3YtbGlua10nKSAmJiBfdGhpczYubWFwTGlua1RhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgICB0YWcgPSB0YWcubWF0Y2hlcygnW2N2LWF0dHJdJykgJiYgX3RoaXM2Lm1hcEF0dHJUYWcodGFnKSB8fCB0YWc7XG4gICAgICAgICAgdGFnID0gdGFnLm1hdGNoZXMoJ1tjdi1leHBhbmRdJykgJiYgX3RoaXM2Lm1hcEV4cGFuZGFibGVUYWcodGFnKSB8fCB0YWc7XG4gICAgICAgICAgdGFnID0gdGFnLm1hdGNoZXMoJ1tjdi1yZWZdJykgJiYgX3RoaXM2Lm1hcFJlZlRhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgICB0YWcgPSB0YWcubWF0Y2hlcygnW2N2LW9uXScpICYmIF90aGlzNi5tYXBPblRhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgICB0YWcgPSB0YWcubWF0Y2hlcygnW2N2LWVhY2hdJykgJiYgX3RoaXM2Lm1hcEVhY2hUYWcodGFnKSB8fCB0YWc7XG4gICAgICAgICAgdGFnID0gdGFnLm1hdGNoZXMoJ1tjdi1iaW5kXScpICYmIF90aGlzNi5tYXBCaW5kVGFnKHRhZykgfHwgdGFnO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3Ytd2l0aF0nKSAmJiBfdGhpczYubWFwV2l0aFRhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgICB0YWcgPSB0YWcubWF0Y2hlcygnW2N2LWlmXScpICYmIF90aGlzNi5tYXBJZlRhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgICB0YWcgPSB0YWcubWF0Y2hlcygnW2N2LXZpZXddJykgJiYgX3RoaXM2Lm1hcFZpZXdUYWcodGFnKSB8fCB0YWc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFnID0gX3RoaXM2Lm1hcEludGVycG9sYXRhYmxlVGFnKHRhZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFnICE9PSB3YWxrZXIuY3VycmVudE5vZGUpIHtcbiAgICAgICAgICB3YWxrZXIuY3VycmVudE5vZGUgPSB0YWc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBFeHBhbmRhYmxlVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcEV4cGFuZGFibGVUYWcodGFnKSB7XG4gICAgICAvKi9cbiAgICAgIGNvbnN0IHRhZ0NvbXBpbGVyID0gdGhpcy5jb21waWxlRXhwYW5kYWJsZVRhZyh0YWcpO1xuICAgICAgXHRjb25zdCBuZXdUYWcgPSB0YWdDb21waWxlcih0aGlzKTtcbiAgICAgIFx0dGFnLnJlcGxhY2VXaXRoKG5ld1RhZyk7XG4gICAgICBcdHJldHVybiBuZXdUYWc7XG4gICAgICAvKi9cbiAgICAgIHZhciBleGlzdGluZyA9IHRhZ1tleHBhbmRCaW5kXTtcblxuICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgIGV4aXN0aW5nKCk7XG4gICAgICAgIHRhZ1tleHBhbmRCaW5kXSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgX0JpbmRhYmxlJHJlc29sdmUgPSBfQmluZGFibGUuQmluZGFibGUucmVzb2x2ZSh0aGlzLmFyZ3MsIHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LWV4cGFuZCcpLCB0cnVlKSxcbiAgICAgICAgICBfQmluZGFibGUkcmVzb2x2ZTIgPSBfc2xpY2VkVG9BcnJheShfQmluZGFibGUkcmVzb2x2ZSwgMiksXG4gICAgICAgICAgcHJveHkgPSBfQmluZGFibGUkcmVzb2x2ZTJbMF0sXG4gICAgICAgICAgZXhwYW5kUHJvcGVydHkgPSBfQmluZGFibGUkcmVzb2x2ZTJbMV07XG5cbiAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LWV4cGFuZCcpO1xuXG4gICAgICBpZiAoIXByb3h5W2V4cGFuZFByb3BlcnR5XSkge1xuICAgICAgICBwcm94eVtleHBhbmRQcm9wZXJ0eV0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgcHJveHlbZXhwYW5kUHJvcGVydHldID0gX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2UocHJveHlbZXhwYW5kUHJvcGVydHldKTtcbiAgICAgIHRoaXMub25SZW1vdmUodGFnW2V4cGFuZEJpbmRdID0gcHJveHlbZXhwYW5kUHJvcGVydHldLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCwgZCwgcCkge1xuICAgICAgICBpZiAoZCB8fCB2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKGssIHYpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2ID09PSBudWxsKSB7XG4gICAgICAgICAgdGFnLnNldEF0dHJpYnV0ZShrLCAnJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFnLnNldEF0dHJpYnV0ZShrLCB2KTtcbiAgICAgIH0pKTsgLy8gbGV0IGV4cGFuZFByb3BlcnR5ID0gdGFnLmdldEF0dHJpYnV0ZSgnY3YtZXhwYW5kJyk7XG4gICAgICAvLyBsZXQgZXhwYW5kQXJnID0gQmluZGFibGUubWFrZUJpbmRhYmxlKFxuICAgICAgLy8gXHR0aGlzLmFyZ3NbZXhwYW5kUHJvcGVydHldIHx8IHt9XG4gICAgICAvLyApO1xuICAgICAgLy8gdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtZXhwYW5kJyk7XG4gICAgICAvLyBmb3IobGV0IGkgaW4gZXhwYW5kQXJnKVxuICAgICAgLy8ge1xuICAgICAgLy8gXHRpZihpID09PSAnbmFtZScgfHwgaSA9PT0gJ3R5cGUnKVxuICAgICAgLy8gXHR7XG4gICAgICAvLyBcdFx0Y29udGludWU7XG4gICAgICAvLyBcdH1cbiAgICAgIC8vIFx0bGV0IGRlYmluZCA9IGV4cGFuZEFyZy5iaW5kVG8oaSwgKCh0YWcsaSk9Pih2KT0+e1xuICAgICAgLy8gXHRcdHRhZy5zZXRBdHRyaWJ1dGUoaSwgdik7XG4gICAgICAvLyBcdH0pKHRhZyxpKSk7XG4gICAgICAvLyBcdHRoaXMub25SZW1vdmUoKCk9PntcbiAgICAgIC8vIFx0XHRkZWJpbmQoKTtcbiAgICAgIC8vIFx0XHRpZihleHBhbmRBcmcuaXNCb3VuZCgpKVxuICAgICAgLy8gXHRcdHtcbiAgICAgIC8vIFx0XHRcdEJpbmRhYmxlLmNsZWFyQmluZGluZ3MoZXhwYW5kQXJnKTtcbiAgICAgIC8vIFx0XHR9XG4gICAgICAvLyBcdH0pO1xuICAgICAgLy8gfVxuXG4gICAgICByZXR1cm4gdGFnOyAvLyovXG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBpbGVFeHBhbmRhYmxlVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBpbGVFeHBhbmRhYmxlVGFnKHNvdXJjZVRhZykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChiaW5kaW5nVmlldykge1xuICAgICAgICB2YXIgdGFnID0gc291cmNlVGFnLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgdmFyIGV4cGFuZFByb3BlcnR5ID0gdGFnLmdldEF0dHJpYnV0ZSgnY3YtZXhwYW5kJyk7XG5cbiAgICAgICAgdmFyIGV4cGFuZEFyZyA9IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlKGJpbmRpbmdWaWV3LmFyZ3NbZXhwYW5kUHJvcGVydHldIHx8IHt9KTtcblxuICAgICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi1leHBhbmQnKTtcblxuICAgICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICAgICAgaWYgKGkgPT09ICduYW1lJyB8fCBpID09PSAndHlwZScpIHtcbiAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGRlYmluZCA9IGV4cGFuZEFyZy5iaW5kVG8oaSwgZnVuY3Rpb24gKHRhZywgaSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgIHRhZy5zZXRBdHRyaWJ1dGUoaSwgdik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0odGFnLCBpKSk7XG4gICAgICAgICAgYmluZGluZ1ZpZXcub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGViaW5kKCk7XG5cbiAgICAgICAgICAgIGlmIChleHBhbmRBcmcuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICAgIF9CaW5kYWJsZS5CaW5kYWJsZS5jbGVhckJpbmRpbmdzKGV4cGFuZEFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiBleHBhbmRBcmcpIHtcbiAgICAgICAgICB2YXIgX3JldCA9IF9sb29wKGkpO1xuXG4gICAgICAgICAgaWYgKF9yZXQgPT09IFwiY29udGludWVcIikgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwQXR0clRhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXBBdHRyVGFnKHRhZykge1xuICAgICAgLy8qL1xuICAgICAgdmFyIHRhZ0NvbXBpbGVyID0gdGhpcy5jb21waWxlQXR0clRhZyh0YWcpO1xuICAgICAgdmFyIG5ld1RhZyA9IHRhZ0NvbXBpbGVyKHRoaXMpO1xuICAgICAgdGFnLnJlcGxhY2VXaXRoKG5ld1RhZyk7XG4gICAgICByZXR1cm4gbmV3VGFnO1xuICAgICAgLyovXG4gICAgICBcdGxldCBhdHRyUHJvcGVydHkgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi1hdHRyJyk7XG4gICAgICBcdHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LWF0dHInKTtcbiAgICAgIFx0bGV0IHBhaXJzID0gYXR0clByb3BlcnR5LnNwbGl0KCcsJyk7XG4gICAgICBsZXQgYXR0cnMgPSBwYWlycy5tYXAoKHApID0+IHAuc3BsaXQoJzonKSk7XG4gICAgICBcdGZvciAobGV0IGkgaW4gYXR0cnMpXG4gICAgICB7XG4gICAgICBcdGxldCBwcm94eSAgICAgICAgPSB0aGlzLmFyZ3M7XG4gICAgICBcdGxldCBiaW5kUHJvcGVydHkgPSBhdHRyc1tpXVsxXTtcbiAgICAgIFx0bGV0IHByb3BlcnR5ICAgICA9IGJpbmRQcm9wZXJ0eTtcbiAgICAgIFx0XHRpZihiaW5kUHJvcGVydHkubWF0Y2goL1xcLi8pKVxuICAgICAgXHR7XG4gICAgICBcdFx0W3Byb3h5LCBwcm9wZXJ0eV0gPSBCaW5kYWJsZS5yZXNvbHZlKFxuICAgICAgXHRcdFx0dGhpcy5hcmdzXG4gICAgICBcdFx0XHQsIGJpbmRQcm9wZXJ0eVxuICAgICAgXHRcdFx0LCB0cnVlXG4gICAgICBcdFx0KTtcbiAgICAgIFx0fVxuICAgICAgXHRcdGxldCBhdHRyaWIgPSBhdHRyc1tpXVswXTtcbiAgICAgIFx0XHR0aGlzLm9uUmVtb3ZlKHByb3h5LmJpbmRUbyhcbiAgICAgIFx0XHRwcm9wZXJ0eVxuICAgICAgXHRcdCwgKHYpPT57XG4gICAgICBcdFx0XHRpZih2ID09IG51bGwpXG4gICAgICBcdFx0XHR7XG4gICAgICBcdFx0XHRcdHRhZy5zZXRBdHRyaWJ1dGUoYXR0cmliLCAnJyk7XG4gICAgICBcdFx0XHRcdHJldHVybjtcbiAgICAgIFx0XHRcdH1cbiAgICAgIFx0XHRcdHRhZy5zZXRBdHRyaWJ1dGUoYXR0cmliLCB2KTtcbiAgICAgIFx0XHR9XG4gICAgICBcdCkpO1xuICAgICAgfVxuICAgICAgXHRyZXR1cm4gdGFnO1xuICAgICAgXHQvLyovXG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBpbGVBdHRyVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBpbGVBdHRyVGFnKHNvdXJjZVRhZykge1xuICAgICAgdmFyIGF0dHJQcm9wZXJ0eSA9IHNvdXJjZVRhZy5nZXRBdHRyaWJ1dGUoJ2N2LWF0dHInKTtcbiAgICAgIHZhciBwYWlycyA9IGF0dHJQcm9wZXJ0eS5zcGxpdCgnLCcpO1xuICAgICAgdmFyIGF0dHJzID0gcGFpcnMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIHJldHVybiBwLnNwbGl0KCc6Jyk7XG4gICAgICB9KTtcbiAgICAgIHNvdXJjZVRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LWF0dHInKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYmluZGluZ1ZpZXcpIHtcbiAgICAgICAgdmFyIHRhZyA9IHNvdXJjZVRhZy5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgdmFyIF9sb29wMiA9IGZ1bmN0aW9uIF9sb29wMihpKSB7XG4gICAgICAgICAgdmFyIGJpbmRQcm9wZXJ0eSA9IGF0dHJzW2ldWzFdIHx8IGF0dHJzW2ldWzBdO1xuXG4gICAgICAgICAgdmFyIF9CaW5kYWJsZSRyZXNvbHZlMyA9IF9CaW5kYWJsZS5CaW5kYWJsZS5yZXNvbHZlKGJpbmRpbmdWaWV3LmFyZ3MsIGJpbmRQcm9wZXJ0eSwgdHJ1ZSksXG4gICAgICAgICAgICAgIF9CaW5kYWJsZSRyZXNvbHZlNCA9IF9zbGljZWRUb0FycmF5KF9CaW5kYWJsZSRyZXNvbHZlMywgMiksXG4gICAgICAgICAgICAgIHByb3h5ID0gX0JpbmRhYmxlJHJlc29sdmU0WzBdLFxuICAgICAgICAgICAgICBwcm9wZXJ0eSA9IF9CaW5kYWJsZSRyZXNvbHZlNFsxXTtcblxuICAgICAgICAgIHZhciBhdHRyaWIgPSBhdHRyc1tpXVswXTtcbiAgICAgICAgICBiaW5kaW5nVmlldy5vblJlbW92ZShwcm94eS5iaW5kVG8ocHJvcGVydHksIGZ1bmN0aW9uICh2LCBrLCB0LCBkKSB7XG4gICAgICAgICAgICBpZiAoZCB8fCB2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWIsIHYpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIHRhZy5zZXRBdHRyaWJ1dGUoYXR0cmliLCAnJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFnLnNldEF0dHJpYnV0ZShhdHRyaWIsIHYpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIGF0dHJzKSB7XG4gICAgICAgICAgX2xvb3AyKGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcEludGVycG9sYXRhYmxlVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcEludGVycG9sYXRhYmxlVGFnKHRhZykge1xuICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICAgIHZhciByZWdleCA9IHRoaXMuaW50ZXJwb2xhdGVSZWdleDtcblxuICAgICAgaWYgKHRhZy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsID0gdGFnLm5vZGVWYWx1ZTtcblxuICAgICAgICBpZiAoIXRoaXMuaW50ZXJwb2xhdGFibGUob3JpZ2luYWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoZWFkZXIgPSAwO1xuICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgdmFyIF9sb29wMyA9IGZ1bmN0aW9uIF9sb29wMygpIHtcbiAgICAgICAgICB2YXIgYmluZFByb3BlcnR5ID0gbWF0Y2hbMl07XG4gICAgICAgICAgdmFyIHVuc2FmZUh0bWwgPSBmYWxzZTtcbiAgICAgICAgICB2YXIgdW5zYWZlVmlldyA9IGZhbHNlO1xuICAgICAgICAgIHZhciBwcm9wZXJ0eVNwbGl0ID0gYmluZFByb3BlcnR5LnNwbGl0KCd8Jyk7XG4gICAgICAgICAgdmFyIHRyYW5zZm9ybWVyID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAocHJvcGVydHlTcGxpdC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1lciA9IF90aGlzNy5zdHJpbmdUcmFuc2Zvcm1lcihwcm9wZXJ0eVNwbGl0LnNsaWNlKDEpKTtcbiAgICAgICAgICAgIGJpbmRQcm9wZXJ0eSA9IHByb3BlcnR5U3BsaXRbMF07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGJpbmRQcm9wZXJ0eS5zdWJzdHIoMCwgMikgPT09ICckJCcpIHtcbiAgICAgICAgICAgIHVuc2FmZUh0bWwgPSB0cnVlO1xuICAgICAgICAgICAgdW5zYWZlVmlldyA9IHRydWU7XG4gICAgICAgICAgICBiaW5kUHJvcGVydHkgPSBiaW5kUHJvcGVydHkuc3Vic3RyKDIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChiaW5kUHJvcGVydHkuc3Vic3RyKDAsIDEpID09PSAnJCcpIHtcbiAgICAgICAgICAgIHVuc2FmZUh0bWwgPSB0cnVlO1xuICAgICAgICAgICAgYmluZFByb3BlcnR5ID0gYmluZFByb3BlcnR5LnN1YnN0cigxKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYmluZFByb3BlcnR5LnN1YnN0cigwLCAzKSA9PT0gJzAwMCcpIHtcbiAgICAgICAgICAgIGV4cGFuZCA9IHRydWU7XG4gICAgICAgICAgICBiaW5kUHJvcGVydHkgPSBiaW5kUHJvcGVydHkuc3Vic3RyKDMpO1xuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3RhdGljUHJlZml4ID0gb3JpZ2luYWwuc3Vic3RyaW5nKGhlYWRlciwgbWF0Y2guaW5kZXgpO1xuICAgICAgICAgIGhlYWRlciA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMV0ubGVuZ3RoO1xuICAgICAgICAgIHZhciBzdGF0aWNOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RhdGljUHJlZml4KTtcbiAgICAgICAgICBzdGF0aWNOb2RlW2RvbnRQYXJzZV0gPSB0cnVlO1xuICAgICAgICAgIHRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzdGF0aWNOb2RlLCB0YWcpO1xuICAgICAgICAgIHZhciBkeW5hbWljTm9kZSA9IHZvaWQgMDtcblxuICAgICAgICAgIGlmICh1bnNhZmVIdG1sKSB7XG4gICAgICAgICAgICBkeW5hbWljTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkeW5hbWljTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkeW5hbWljTm9kZVtkb250UGFyc2VdID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgcHJveHkgPSBfdGhpczcuYXJncztcbiAgICAgICAgICB2YXIgcHJvcGVydHkgPSBiaW5kUHJvcGVydHk7XG5cbiAgICAgICAgICBpZiAoYmluZFByb3BlcnR5Lm1hdGNoKC9cXC4vKSkge1xuICAgICAgICAgICAgdmFyIF9CaW5kYWJsZSRyZXNvbHZlNSA9IF9CaW5kYWJsZS5CaW5kYWJsZS5yZXNvbHZlKF90aGlzNy5hcmdzLCBiaW5kUHJvcGVydHksIHRydWUpO1xuXG4gICAgICAgICAgICB2YXIgX0JpbmRhYmxlJHJlc29sdmU2ID0gX3NsaWNlZFRvQXJyYXkoX0JpbmRhYmxlJHJlc29sdmU1LCAyKTtcblxuICAgICAgICAgICAgcHJveHkgPSBfQmluZGFibGUkcmVzb2x2ZTZbMF07XG4gICAgICAgICAgICBwcm9wZXJ0eSA9IF9CaW5kYWJsZSRyZXNvbHZlNlsxXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0YWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZHluYW1pY05vZGUsIHRhZyk7XG5cbiAgICAgICAgICBpZiAoX3R5cGVvZihwcm94eSkgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJicmVha1wiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHByb3h5ID0gX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2UocHJveHkpO1xuICAgICAgICAgIHZhciBkZWJpbmQgPSBwcm94eS5iaW5kVG8ocHJvcGVydHksIGZ1bmN0aW9uICh2LCBrLCB0KSB7XG4gICAgICAgICAgICBpZiAodFtrXSAhPT0gdiAmJiAodFtrXSBpbnN0YW5jZW9mIFZpZXcgfHwgdFtrXSBpbnN0YW5jZW9mIE5vZGUgfHwgdFtrXSBpbnN0YW5jZW9mIF9UYWcuVGFnKSkge1xuICAgICAgICAgICAgICBpZiAoIXRba10ucHJlc2VydmUpIHtcbiAgICAgICAgICAgICAgICB0W2tdLnJlbW92ZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGR5bmFtaWNOb2RlLm5vZGVWYWx1ZSA9ICcnO1xuXG4gICAgICAgICAgICBpZiAodW5zYWZlVmlldyAmJiAhKHYgaW5zdGFuY2VvZiBWaWV3KSkge1xuICAgICAgICAgICAgICB2YXIgX3Y7XG5cbiAgICAgICAgICAgICAgdmFyIHVuc2FmZVRlbXBsYXRlID0gKF92ID0gdikgIT09IG51bGwgJiYgX3YgIT09IHZvaWQgMCA/IF92IDogJyc7XG4gICAgICAgICAgICAgIHYgPSBuZXcgVmlldyhfdGhpczcuYXJncywgX3RoaXM3KTtcbiAgICAgICAgICAgICAgdi50ZW1wbGF0ZSA9IHVuc2FmZVRlbXBsYXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtZXIpIHtcbiAgICAgICAgICAgICAgdiA9IHRyYW5zZm9ybWVyKHYpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFZpZXcpIHtcbiAgICAgICAgICAgICAgdmFyIG9uQXR0YWNoID0gZnVuY3Rpb24gb25BdHRhY2gocm9vdE5vZGUsIHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICB2LmRpc3BhdGNoQXR0YWNoZWQocm9vdE5vZGUsIHBhcmVudE5vZGUsIF90aGlzNyk7XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgX3RoaXM3Lm5vZGVzQXR0YWNoZWQuYWRkKG9uQXR0YWNoKTtcblxuICAgICAgICAgICAgICB2LnJlbmRlcih0YWcucGFyZW50Tm9kZSwgZHluYW1pY05vZGUpO1xuXG4gICAgICAgICAgICAgIHZhciBjbGVhbnVwID0gZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXYucHJlc2VydmUpIHtcbiAgICAgICAgICAgICAgICAgIHYucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIF90aGlzNy5vblJlbW92ZShjbGVhbnVwKTtcblxuICAgICAgICAgICAgICB2Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpczcubm9kZXNBdHRhY2hlZC5yZW1vdmUob25BdHRhY2gpO1xuXG4gICAgICAgICAgICAgICAgX3RoaXM3Ll9vblJlbW92ZS5yZW1vdmUoY2xlYW51cCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgICB0YWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodiwgZHluYW1pY05vZGUpO1xuXG4gICAgICAgICAgICAgIF90aGlzNy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYucmVtb3ZlKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgX1RhZy5UYWcpIHtcbiAgICAgICAgICAgICAgdGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHYubm9kZSwgZHluYW1pY05vZGUpO1xuXG4gICAgICAgICAgICAgIF90aGlzNy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYucmVtb3ZlKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBPYmplY3QgJiYgdi5fX3RvU3RyaW5nIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB2ID0gdi5fX3RvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodW5zYWZlSHRtbCkge1xuICAgICAgICAgICAgICAgIGR5bmFtaWNOb2RlLmlubmVySFRNTCA9IHY7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHluYW1pY05vZGUubm9kZVZhbHVlID0gdjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkeW5hbWljTm9kZVtkb250UGFyc2VdID0gdHJ1ZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIF90aGlzNy5vblJlbW92ZShkZWJpbmQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdoaWxlIChtYXRjaCA9IHJlZ2V4LmV4ZWMob3JpZ2luYWwpKSB7XG4gICAgICAgICAgdmFyIF9yZXQyID0gX2xvb3AzKCk7XG5cbiAgICAgICAgICBpZiAoX3JldDIgPT09IFwiY29udGludWVcIikgY29udGludWU7XG4gICAgICAgICAgaWYgKF9yZXQyID09PSBcImJyZWFrXCIpIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0YXRpY1N1ZmZpeCA9IG9yaWdpbmFsLnN1YnN0cmluZyhoZWFkZXIpO1xuICAgICAgICB2YXIgc3RhdGljTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN0YXRpY1N1ZmZpeCk7XG4gICAgICAgIHN0YXRpY05vZGVbZG9udFBhcnNlXSA9IHRydWU7XG4gICAgICAgIHRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzdGF0aWNOb2RlLCB0YWcpO1xuICAgICAgICB0YWcubm9kZVZhbHVlID0gJyc7XG4gICAgICB9IGVsc2UgaWYgKHRhZy5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgdmFyIF9sb29wNCA9IGZ1bmN0aW9uIF9sb29wNChpKSB7XG4gICAgICAgICAgaWYgKCFfdGhpczcuaW50ZXJwb2xhdGFibGUodGFnLmF0dHJpYnV0ZXNbaV0udmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBoZWFkZXIgPSAwO1xuICAgICAgICAgIHZhciBtYXRjaCA9IHZvaWQgMDtcbiAgICAgICAgICB2YXIgb3JpZ2luYWwgPSB0YWcuYXR0cmlidXRlc1tpXS52YWx1ZTtcbiAgICAgICAgICB2YXIgYXR0cmlidXRlID0gdGFnLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgdmFyIGJpbmRQcm9wZXJ0aWVzID0ge307XG4gICAgICAgICAgdmFyIHNlZ21lbnRzID0gW107XG5cbiAgICAgICAgICB3aGlsZSAobWF0Y2ggPSByZWdleC5leGVjKG9yaWdpbmFsKSkge1xuICAgICAgICAgICAgc2VnbWVudHMucHVzaChvcmlnaW5hbC5zdWJzdHJpbmcoaGVhZGVyLCBtYXRjaC5pbmRleCkpO1xuXG4gICAgICAgICAgICBpZiAoIWJpbmRQcm9wZXJ0aWVzW21hdGNoWzJdXSkge1xuICAgICAgICAgICAgICBiaW5kUHJvcGVydGllc1ttYXRjaFsyXV0gPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmluZFByb3BlcnRpZXNbbWF0Y2hbMl1dLnB1c2goc2VnbWVudHMubGVuZ3RoKTtcbiAgICAgICAgICAgIHNlZ21lbnRzLnB1c2gobWF0Y2hbMV0pO1xuICAgICAgICAgICAgaGVhZGVyID0gbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VnbWVudHMucHVzaChvcmlnaW5hbC5zdWJzdHJpbmcoaGVhZGVyKSk7XG5cbiAgICAgICAgICB2YXIgX2xvb3A1ID0gZnVuY3Rpb24gX2xvb3A1KGopIHtcbiAgICAgICAgICAgIHZhciBwcm94eSA9IF90aGlzNy5hcmdzO1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gajtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eVNwbGl0ID0gai5zcGxpdCgnfCcpO1xuICAgICAgICAgICAgdmFyIHRyYW5zZm9ybWVyID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgbG9uZ1Byb3BlcnR5ID0gajtcblxuICAgICAgICAgICAgaWYgKHByb3BlcnR5U3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICB0cmFuc2Zvcm1lciA9IF90aGlzNy5zdHJpbmdUcmFuc2Zvcm1lcihwcm9wZXJ0eVNwbGl0LnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgcHJvcGVydHkgPSBwcm9wZXJ0eVNwbGl0WzBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocHJvcGVydHkubWF0Y2goL1xcLi8pKSB7XG4gICAgICAgICAgICAgIHZhciBfQmluZGFibGUkcmVzb2x2ZTcgPSBfQmluZGFibGUuQmluZGFibGUucmVzb2x2ZShfdGhpczcuYXJncywgcHJvcGVydHksIHRydWUpO1xuXG4gICAgICAgICAgICAgIHZhciBfQmluZGFibGUkcmVzb2x2ZTggPSBfc2xpY2VkVG9BcnJheShfQmluZGFibGUkcmVzb2x2ZTcsIDIpO1xuXG4gICAgICAgICAgICAgIHByb3h5ID0gX0JpbmRhYmxlJHJlc29sdmU4WzBdO1xuICAgICAgICAgICAgICBwcm9wZXJ0eSA9IF9CaW5kYWJsZSRyZXNvbHZlOFsxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1hdGNoaW5nID0gW107XG4gICAgICAgICAgICB2YXIgYmluZFByb3BlcnR5ID0gajtcbiAgICAgICAgICAgIHZhciBtYXRjaGluZ1NlZ21lbnRzID0gYmluZFByb3BlcnRpZXNbbG9uZ1Byb3BlcnR5XTsgLy8gY29uc3QgY2hhbmdlQXR0cmlidXRlID0gKHYsIGssIHQsIGQpID0+IHtcbiAgICAgICAgICAgIC8vIFx0dGFnLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUubmFtZSwgc2VnbWVudHMuam9pbignJykpO1xuICAgICAgICAgICAgLy8gfTtcblxuICAgICAgICAgICAgX3RoaXM3Lm9uUmVtb3ZlKHByb3h5LmJpbmRUbyhwcm9wZXJ0eSwgZnVuY3Rpb24gKHYsIGssIHQsIGQpIHtcbiAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybWVyKSB7XG4gICAgICAgICAgICAgICAgdiA9IHRyYW5zZm9ybWVyKHYpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZm9yICh2YXIgX2k0IGluIGJpbmRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2ogaW4gYmluZFByb3BlcnRpZXNbbG9uZ1Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgc2VnbWVudHNbYmluZFByb3BlcnRpZXNbbG9uZ1Byb3BlcnR5XVtfal1dID0gdFtfaTRdO1xuXG4gICAgICAgICAgICAgICAgICBpZiAoayA9PT0gcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudHNbYmluZFByb3BlcnRpZXNbbG9uZ1Byb3BlcnR5XVtfal1dID0gdjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoIV90aGlzNy5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGFuZ2VBdHRyaWJ1dGUodixrLHQsZCk7XG4gICAgICAgICAgICAgICAgdGFnLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUubmFtZSwgc2VnbWVudHMuam9pbignJykpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMudW5wYXVzZUNhbGxiYWNrcy5zZXQoYXR0cmlidXRlLCAoKSA9PiBjaGFuZ2VBdHRyaWJ1dGUodixrLHQsZCkpO1xuICAgICAgICAgICAgICAgIF90aGlzNy51bnBhdXNlQ2FsbGJhY2tzLnNldChhdHRyaWJ1dGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lLCBzZWdtZW50cy5qb2luKCcnKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgX3RoaXM3Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgaWYgKCFwcm94eS5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICBfQmluZGFibGUuQmluZGFibGUuY2xlYXJCaW5kaW5ncyhwcm94eSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmb3IgKHZhciBqIGluIGJpbmRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBfbG9vcDUoaik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFnLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgX3JldDMgPSBfbG9vcDQoaSk7XG5cbiAgICAgICAgICBpZiAoX3JldDMgPT09IFwiY29udGludWVcIikgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRhZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwUmVmVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcFJlZlRhZyh0YWcpIHtcbiAgICAgIHZhciByZWZBdHRyID0gdGFnLmdldEF0dHJpYnV0ZSgnY3YtcmVmJyk7XG5cbiAgICAgIHZhciBfcmVmQXR0ciRzcGxpdCA9IHJlZkF0dHIuc3BsaXQoJzonKSxcbiAgICAgICAgICBfcmVmQXR0ciRzcGxpdDIgPSBfc2xpY2VkVG9BcnJheShfcmVmQXR0ciRzcGxpdCwgMyksXG4gICAgICAgICAgcmVmUHJvcCA9IF9yZWZBdHRyJHNwbGl0MlswXSxcbiAgICAgICAgICBfcmVmQXR0ciRzcGxpdDIkID0gX3JlZkF0dHIkc3BsaXQyWzFdLFxuICAgICAgICAgIHJlZkNsYXNzbmFtZSA9IF9yZWZBdHRyJHNwbGl0MiQgPT09IHZvaWQgMCA/IG51bGwgOiBfcmVmQXR0ciRzcGxpdDIkLFxuICAgICAgICAgIF9yZWZBdHRyJHNwbGl0MiQyID0gX3JlZkF0dHIkc3BsaXQyWzJdLFxuICAgICAgICAgIHJlZktleSA9IF9yZWZBdHRyJHNwbGl0MiQyID09PSB2b2lkIDAgPyBudWxsIDogX3JlZkF0dHIkc3BsaXQyJDI7XG5cbiAgICAgIHZhciByZWZDbGFzcyA9IF9UYWcuVGFnO1xuXG4gICAgICBpZiAocmVmQ2xhc3NuYW1lKSB7XG4gICAgICAgIHJlZkNsYXNzID0gdGhpcy5zdHJpbmdUb0NsYXNzKHJlZkNsYXNzbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LXJlZicpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhZywgJ19fX3RhZ19fXycsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRoaXMub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICB0YWcuX19fdGFnX19fID0gbnVsbDtcbiAgICAgICAgdGFnLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgICB2YXIgcGFyZW50ID0gdGhpcztcbiAgICAgIHZhciBkaXJlY3QgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy52aWV3TGlzdCkge1xuICAgICAgICBwYXJlbnQgPSB0aGlzLnZpZXdMaXN0LnBhcmVudDsgLy8gaWYoIXRoaXMudmlld0xpc3QucGFyZW50LnRhZ3NbcmVmUHJvcF0pXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gXHR0aGlzLnZpZXdMaXN0LnBhcmVudC50YWdzW3JlZlByb3BdID0gW107XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gbGV0IHJlZktleVZhbCA9IHRoaXMuYXJnc1tyZWZLZXldO1xuICAgICAgICAvLyB0aGlzLnZpZXdMaXN0LnBhcmVudC50YWdzW3JlZlByb3BdW3JlZktleVZhbF0gPSBuZXcgcmVmQ2xhc3MoXG4gICAgICAgIC8vIFx0dGFnLCB0aGlzLCByZWZQcm9wLCByZWZLZXlWYWxcbiAgICAgICAgLy8gKTtcbiAgICAgIH0gZWxzZSB7Ly8gdGhpcy50YWdzW3JlZlByb3BdID0gbmV3IHJlZkNsYXNzKFxuICAgICAgICAvLyBcdHRhZywgdGhpcywgcmVmUHJvcFxuICAgICAgICAvLyApO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGFnT2JqZWN0ID0gbmV3IHJlZkNsYXNzKHRhZywgdGhpcywgcmVmUHJvcCwgdW5kZWZpbmVkLCBkaXJlY3QpO1xuICAgICAgdGFnLl9fX3RhZ19fXyA9IHRhZ09iamVjdDtcbiAgICAgIHRoaXMudGFnc1tyZWZQcm9wXSA9IHRhZ09iamVjdDtcblxuICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICB2YXIgcmVmS2V5VmFsID0gdGhpcy5hcmdzW3JlZktleV07XG5cbiAgICAgICAgaWYgKHJlZktleVZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKCFwYXJlbnQudGFnc1tyZWZQcm9wXSkge1xuICAgICAgICAgICAgcGFyZW50LnRhZ3NbcmVmUHJvcF0gPSBbXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwYXJlbnQudGFnc1tyZWZQcm9wXVtyZWZLZXlWYWxdID0gdGFnT2JqZWN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudC50YWdzW3JlZlByb3BdID0gdGFnT2JqZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFwYXJlbnQucGFyZW50KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBCaW5kVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcEJpbmRUYWcodGFnKSB7XG4gICAgICB2YXIgX3RoaXM4ID0gdGhpcztcblxuICAgICAgdmFyIGJpbmRBcmcgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi1iaW5kJyk7XG4gICAgICB2YXIgcHJveHkgPSB0aGlzLmFyZ3M7XG4gICAgICB2YXIgcHJvcGVydHkgPSBiaW5kQXJnO1xuICAgICAgdmFyIHRvcCA9IG51bGw7XG5cbiAgICAgIGlmIChiaW5kQXJnLm1hdGNoKC9cXC4vKSkge1xuICAgICAgICB2YXIgX0JpbmRhYmxlJHJlc29sdmU5ID0gX0JpbmRhYmxlLkJpbmRhYmxlLnJlc29sdmUodGhpcy5hcmdzLCBiaW5kQXJnLCB0cnVlKTtcblxuICAgICAgICB2YXIgX0JpbmRhYmxlJHJlc29sdmUxMCA9IF9zbGljZWRUb0FycmF5KF9CaW5kYWJsZSRyZXNvbHZlOSwgMyk7XG5cbiAgICAgICAgcHJveHkgPSBfQmluZGFibGUkcmVzb2x2ZTEwWzBdO1xuICAgICAgICBwcm9wZXJ0eSA9IF9CaW5kYWJsZSRyZXNvbHZlMTBbMV07XG4gICAgICAgIHRvcCA9IF9CaW5kYWJsZSRyZXNvbHZlMTBbMl07XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm94eSAhPT0gdGhpcy5hcmdzKSB7XG4gICAgICAgIHRoaXMuc3ViQmluZGluZ3NbYmluZEFyZ10gPSB0aGlzLnN1YkJpbmRpbmdzW2JpbmRBcmddIHx8IFtdO1xuICAgICAgICB0aGlzLm9uUmVtb3ZlKHRoaXMuYXJncy5iaW5kVG8odG9wLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgd2hpbGUgKF90aGlzOC5zdWJCaW5kaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgIF90aGlzOC5zdWJCaW5kaW5ncy5zaGlmdCgpKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHZhciB1bnNhZmVIdG1sID0gZmFsc2U7XG5cbiAgICAgIGlmIChwcm9wZXJ0eS5zdWJzdHIoMCwgMSkgPT09ICckJykge1xuICAgICAgICBwcm9wZXJ0eSA9IHByb3BlcnR5LnN1YnN0cigxKTtcbiAgICAgICAgdW5zYWZlSHRtbCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBkZWJpbmQgPSBwcm94eS5iaW5kVG8ocHJvcGVydHksIGZ1bmN0aW9uICh2LCBrLCB0LCBkLCBwKSB7XG4gICAgICAgIGlmICgocCBpbnN0YW5jZW9mIFZpZXcgfHwgcCBpbnN0YW5jZW9mIE5vZGUgfHwgcCBpbnN0YW5jZW9mIF9UYWcuVGFnKSAmJiBwICE9PSB2KSB7XG4gICAgICAgICAgcC5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhdXRvQ2hhbmdlZEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjdkF1dG9DaGFuZ2VkJywge1xuICAgICAgICAgIGJ1YmJsZXM6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10uaW5jbHVkZXModGFnLnRhZ05hbWUpKSB7XG4gICAgICAgICAgdmFyIF90eXBlID0gdGFnLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuXG4gICAgICAgICAgaWYgKF90eXBlICYmIF90eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIHRhZy5jaGVja2VkID0gISF2O1xuICAgICAgICAgICAgdGFnLmRpc3BhdGNoRXZlbnQoYXV0b0NoYW5nZWRFdmVudCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChfdHlwZSAmJiBfdHlwZS50b0xvd2VyQ2FzZSgpID09PSAncmFkaW8nKSB7XG4gICAgICAgICAgICB0YWcuY2hlY2tlZCA9IHYgPT0gdGFnLnZhbHVlO1xuICAgICAgICAgICAgdGFnLmRpc3BhdGNoRXZlbnQoYXV0b0NoYW5nZWRFdmVudCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChfdHlwZSAhPT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICBpZiAodGFnLnRhZ05hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgICAgICAgICAgIHZhciBzZWxlY3RPcHRpb24gPSBmdW5jdGlvbiBzZWxlY3RPcHRpb24oKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWcub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbiA9IHRhZy5vcHRpb25zW2ldO1xuXG4gICAgICAgICAgICAgICAgICBpZiAob3B0aW9uLnZhbHVlID09IHYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnLnNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBzZWxlY3RPcHRpb24oKTtcblxuICAgICAgICAgICAgICBfdGhpczgubm9kZXNBdHRhY2hlZC5hZGQoc2VsZWN0T3B0aW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhZy52YWx1ZSA9IHYgPT0gbnVsbCA/ICcnIDogdjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFnLmRpc3BhdGNoRXZlbnQoYXV0b0NoYW5nZWRFdmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2IGluc3RhbmNlb2YgVmlldykge1xuICAgICAgICAgICAgdmFyIF9pdGVyYXRvcjcgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0YWcuY2hpbGROb2RlcyksXG4gICAgICAgICAgICAgICAgX3N0ZXA3O1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmb3IgKF9pdGVyYXRvcjcucygpOyAhKF9zdGVwNyA9IF9pdGVyYXRvcjcubigpKS5kb25lOykge1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0gX3N0ZXA3LnZhbHVlO1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBfaXRlcmF0b3I3LmUoZXJyKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIF9pdGVyYXRvcjcuZigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb25BdHRhY2ggPSBmdW5jdGlvbiBvbkF0dGFjaChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgIHYuZGlzcGF0Y2hEb21BdHRhY2hlZChfdGhpczgpOyAvLyBpZih2Lm5vZGVzLmxlbmd0aCAmJiB2LmRpc3BhdGNoQXR0YWNoKCkpXG4gICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgLy8gXHR2LmF0dGFjaGVkKHBhcmVudE5vZGUuZ2V0Um9vdE5vZGUoKSwgcGFyZW50Tm9kZSwgdGhpcyk7XG4gICAgICAgICAgICAgIC8vIFx0di5kaXNwYXRjaEF0dGFjaGVkKHBhcmVudE5vZGUuZ2V0Um9vdE5vZGUoKSwgcGFyZW50Tm9kZSwgdGhpcyk7XG4gICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF90aGlzOC5ub2Rlc0F0dGFjaGVkLmFkZChvbkF0dGFjaCk7XG5cbiAgICAgICAgICAgIHYucmVuZGVyKHRhZyk7XG4gICAgICAgICAgICB2Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzOC5ub2Rlc0F0dGFjaGVkLnJlbW92ZShvbkF0dGFjaCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICB0YWcuaW5zZXJ0KHYpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIF9UYWcuVGFnKSB7XG4gICAgICAgICAgICB0YWcuYXBwZW5kKHYubm9kZSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh1bnNhZmVIdG1sKSB7XG4gICAgICAgICAgICBpZiAodGFnLmlubmVySFRNTCAhPT0gdikge1xuICAgICAgICAgICAgICB2ID0gU3RyaW5nKHYpO1xuXG4gICAgICAgICAgICAgIGlmICh0YWcuaW5uZXJIVE1MID09PSB2LnN1YnN0cmluZygwLCB0YWcuaW5uZXJIVE1MLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICB0YWcuaW5uZXJIVE1MICs9IHYuc3Vic3RyaW5nKHRhZy5pbm5lckhUTUwubGVuZ3RoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgX2l0ZXJhdG9yOCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRhZy5jaGlsZE5vZGVzKSxcbiAgICAgICAgICAgICAgICAgICAgX3N0ZXA4O1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yOC5zKCk7ICEoX3N0ZXA4ID0gX2l0ZXJhdG9yOC5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfbm9kZSA9IF9zdGVwOC52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICBfbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgIF9pdGVyYXRvcjguZShlcnIpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICBfaXRlcmF0b3I4LmYoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0YWcuaW5uZXJIVE1MID0gdjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF9Eb20uRG9tLm1hcFRhZ3ModGFnLCBmYWxzZSwgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdFtkb250UGFyc2VdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0YWcudGV4dENvbnRlbnQgIT09IHYpIHtcbiAgICAgICAgICAgICAgdmFyIF9pdGVyYXRvcjkgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0YWcuY2hpbGROb2RlcyksXG4gICAgICAgICAgICAgICAgICBfc3RlcDk7XG5cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKF9pdGVyYXRvcjkucygpOyAhKF9zdGVwOSA9IF9pdGVyYXRvcjkubigpKS5kb25lOykge1xuICAgICAgICAgICAgICAgICAgdmFyIF9ub2RlMiA9IF9zdGVwOS52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgX25vZGUyLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yOS5lKGVycik7XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yOS5mKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0YWcudGV4dENvbnRlbnQgPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChwcm94eSAhPT0gdGhpcy5hcmdzKSB7XG4gICAgICAgIHRoaXMuc3ViQmluZGluZ3NbYmluZEFyZ10ucHVzaChkZWJpbmQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm9uUmVtb3ZlKGRlYmluZCk7XG4gICAgICB2YXIgdHlwZSA9IHRhZy5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcbiAgICAgIHZhciBtdWx0aSA9IHRhZy5nZXRBdHRyaWJ1dGUoJ211bHRpcGxlJyk7XG5cbiAgICAgIHZhciBpbnB1dExpc3RlbmVyID0gZnVuY3Rpb24gaW5wdXRMaXN0ZW5lcihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSB0YWcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICBpZiAodGFnLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHByb3h5W3Byb3BlcnR5XSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3h5W3Byb3BlcnR5XSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQubWF0Y2hlcygnW2NvbnRlbnRlZGl0YWJsZT10cnVlXScpKSB7XG4gICAgICAgICAgcHJveHlbcHJvcGVydHldID0gZXZlbnQudGFyZ2V0LmlubmVySFRNTDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZmlsZScgJiYgbXVsdGkpIHtcbiAgICAgICAgICB2YXIgZmlsZXMgPSBBcnJheS5mcm9tKGV2ZW50LnRhcmdldC5maWxlcyk7XG5cbiAgICAgICAgICB2YXIgY3VycmVudCA9IHByb3h5W3Byb3BlcnR5XSB8fCBfQmluZGFibGUuQmluZGFibGUub25EZWNrKHByb3h5LCBwcm9wZXJ0eSk7XG5cbiAgICAgICAgICBpZiAoIWN1cnJlbnQgfHwgIWZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcHJveHlbcHJvcGVydHldID0gZmlsZXM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBfbG9vcDYgPSBmdW5jdGlvbiBfbG9vcDYoaSkge1xuICAgICAgICAgICAgICBpZiAoZmlsZXNbaV0gIT09IGN1cnJlbnRbaV0pIHtcbiAgICAgICAgICAgICAgICBmaWxlc1tpXS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWxlW2ldLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IGZpbGVbaV0uc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZmlsZVtpXS50eXBlLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBmaWxlW2ldLmxhc3RNb2RpZmllZFxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY3VycmVudFtpXSA9IGZpbGVzW2ldO1xuICAgICAgICAgICAgICAgIHJldHVybiBcImJyZWFrXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZmlsZXMpIHtcbiAgICAgICAgICAgICAgdmFyIF9yZXQ0ID0gX2xvb3A2KGkpO1xuXG4gICAgICAgICAgICAgIGlmIChfcmV0NCA9PT0gXCJicmVha1wiKSBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2ZpbGUnICYmICFtdWx0aSAmJiBldmVudC50YXJnZXQuZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIF9maWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzLml0ZW0oMCk7XG5cbiAgICAgICAgICBfZmlsZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBuYW1lOiBfZmlsZS5uYW1lLFxuICAgICAgICAgICAgICBzaXplOiBfZmlsZS5zaXplLFxuICAgICAgICAgICAgICB0eXBlOiBfZmlsZS50eXBlLFxuICAgICAgICAgICAgICBkYXRlOiBfZmlsZS5sYXN0TW9kaWZpZWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHByb3h5W3Byb3BlcnR5XSA9IF9maWxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3h5W3Byb3BlcnR5XSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKHR5cGUgPT09ICdmaWxlJyB8fCB0eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAgIHRhZy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBpbnB1dExpc3RlbmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhZy5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGlucHV0TGlzdGVuZXIpO1xuICAgICAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaW5wdXRMaXN0ZW5lcik7XG4gICAgICAgIHRhZy5hZGRFdmVudExpc3RlbmVyKCd2YWx1ZS1jaGFuZ2VkJywgaW5wdXRMaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2ZpbGUnIHx8IHR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgICB0YWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaW5wdXRMaXN0ZW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFnLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaW5wdXRMaXN0ZW5lcik7XG4gICAgICAgICAgdGFnLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGlucHV0TGlzdGVuZXIpO1xuICAgICAgICAgIHRhZy5yZW1vdmVFdmVudExpc3RlbmVyKCd2YWx1ZS1jaGFuZ2VkJywgaW5wdXRMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtYmluZCcpO1xuICAgICAgcmV0dXJuIHRhZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwT25UYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFwT25UYWcodGFnKSB7XG4gICAgICB2YXIgX3RoaXM5ID0gdGhpcztcblxuICAgICAgdmFyIHJlZmVyZW50cyA9IFN0cmluZyh0YWcuZ2V0QXR0cmlidXRlKCdjdi1vbicpKTtcbiAgICAgIHJlZmVyZW50cy5zcGxpdCgnOycpLm1hcChmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gYS5zcGxpdCgnOicpO1xuICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYSkge1xuICAgICAgICBhID0gYS5tYXAoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICByZXR1cm4gYS50cmltKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgYXJnTGVuID0gYS5sZW5ndGg7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSBTdHJpbmcoYS5zaGlmdCgpKS50cmltKCk7XG4gICAgICAgIHZhciBjYWxsYmFja05hbWUgPSBTdHJpbmcoYS5zaGlmdCgpIHx8IGV2ZW50TmFtZSkudHJpbSgpO1xuICAgICAgICB2YXIgZXZlbnRGbGFncyA9IFN0cmluZyhhLnNoaWZ0KCkgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgdmFyIGFyZ0xpc3QgPSBbXTtcbiAgICAgICAgdmFyIGdyb3VwcyA9IC8oXFx3KykoPzpcXCgoWyRcXHdcXHMtJ1wiLF0rKVxcKSk/Ly5leGVjKGNhbGxiYWNrTmFtZSk7XG5cbiAgICAgICAgaWYgKGdyb3Vwcykge1xuICAgICAgICAgIGNhbGxiYWNrTmFtZSA9IGdyb3Vwc1sxXS5yZXBsYWNlKC8oXltcXHNcXG5dK3xbXFxzXFxuXSskKS8sICcnKTtcblxuICAgICAgICAgIGlmIChncm91cHNbMl0pIHtcbiAgICAgICAgICAgIGFyZ0xpc3QgPSBncm91cHNbMl0uc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHMudHJpbSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhcmdMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgIGFyZ0xpc3QucHVzaCgnJGV2ZW50Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWV2ZW50TmFtZSB8fCBhcmdMZW4gPT09IDEpIHtcbiAgICAgICAgICBldmVudE5hbWUgPSBjYWxsYmFja05hbWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXZlbnRNZXRob2Q7XG4gICAgICAgIHZhciBwYXJlbnQgPSBfdGhpczk7XG5cbiAgICAgICAgdmFyIF9sb29wNyA9IGZ1bmN0aW9uIF9sb29wNygpIHtcbiAgICAgICAgICB2YXIgY29udHJvbGxlciA9IHBhcmVudC5jb250cm9sbGVyO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjb250cm9sbGVyW2NhbGxiYWNrTmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGV2ZW50TWV0aG9kID0gZnVuY3Rpb24gZXZlbnRNZXRob2QoKSB7XG4gICAgICAgICAgICAgIGNvbnRyb2xsZXJbY2FsbGJhY2tOYW1lXS5hcHBseShjb250cm9sbGVyLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIFwiYnJlYWtcIjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJlbnRbY2FsbGJhY2tOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZXZlbnRNZXRob2QgPSBmdW5jdGlvbiBldmVudE1ldGhvZCgpIHtcbiAgICAgICAgICAgICAgdmFyIF9wYXJlbnQ7XG5cbiAgICAgICAgICAgICAgKF9wYXJlbnQgPSBwYXJlbnQpW2NhbGxiYWNrTmFtZV0uYXBwbHkoX3BhcmVudCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBcImJyZWFrXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHBhcmVudC5wYXJlbnQpIHtcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcImJyZWFrXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgICB2YXIgX3JldDUgPSBfbG9vcDcoKTtcblxuICAgICAgICAgIGlmIChfcmV0NSA9PT0gXCJicmVha1wiKSBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBldmVudExpc3RlbmVyID0gZnVuY3Rpb24gZXZlbnRMaXN0ZW5lcihldmVudCkge1xuICAgICAgICAgIHZhciBhcmdSZWZzID0gYXJnTGlzdC5tYXAoZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgICAgdmFyIG1hdGNoO1xuXG4gICAgICAgICAgICBpZiAoTnVtYmVyKGFyZykgPT0gYXJnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gJ2V2ZW50JyB8fCBhcmcgPT09ICckZXZlbnQnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBldmVudDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnID09PSAnJHZpZXcnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gJyRjb250cm9sbGVyJykge1xuICAgICAgICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnID09PSAnJHRhZycpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnID09PSAnJHBhcmVudCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzOS5wYXJlbnQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gJyRzdWJ2aWV3Jykge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXM5O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgaW4gX3RoaXM5LmFyZ3MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzOS5hcmdzW2FyZ107XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoID0gL15bJ1wiXShbXFx3LV0rPylbXCInXSQvLmV4ZWMoYXJnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoISh0eXBlb2YgZXZlbnRNZXRob2QgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIi5jb25jYXQoY2FsbGJhY2tOYW1lLCBcIiBpcyBub3QgZGVmaW5lZCBvbiBWaWV3IG9iamVjdC5cIikgKyBcIlxcblwiICsgXCJUYWc6XCIgKyBcIlxcblwiICsgXCJcIi5jb25jYXQodGFnLm91dGVySFRNTCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGV2ZW50TWV0aG9kLmFwcGx5KHZvaWQgMCwgX3RvQ29uc3VtYWJsZUFycmF5KGFyZ1JlZnMpKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZXZlbnRPcHRpb25zID0ge307XG5cbiAgICAgICAgaWYgKGV2ZW50RmxhZ3MuaW5jbHVkZXMoJ3AnKSkge1xuICAgICAgICAgIGV2ZW50T3B0aW9ucy5wYXNzaXZlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudEZsYWdzLmluY2x1ZGVzKCdQJykpIHtcbiAgICAgICAgICBldmVudE9wdGlvbnMucGFzc2l2ZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50RmxhZ3MuaW5jbHVkZXMoJ2MnKSkge1xuICAgICAgICAgIGV2ZW50T3B0aW9ucy5jYXB0dXJlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudEZsYWdzLmluY2x1ZGVzKCdDJykpIHtcbiAgICAgICAgICBldmVudE9wdGlvbnMuY2FwdHVyZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50RmxhZ3MuaW5jbHVkZXMoJ28nKSkge1xuICAgICAgICAgIGV2ZW50T3B0aW9ucy5vbmNlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudEZsYWdzLmluY2x1ZGVzKCdPJykpIHtcbiAgICAgICAgICBldmVudE9wdGlvbnMub25jZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChldmVudE5hbWUpIHtcbiAgICAgICAgICBjYXNlICdfaW5pdCc6XG4gICAgICAgICAgICBldmVudExpc3RlbmVyKCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ19hdHRhY2gnOlxuICAgICAgICAgICAgX3RoaXM5Lm5vZGVzQXR0YWNoZWQuYWRkKGV2ZW50TGlzdGVuZXIpO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ19kZXRhY2gnOlxuICAgICAgICAgICAgX3RoaXM5Lm5vZGVzRGV0YWNoZWQuYWRkKGV2ZW50TGlzdGVuZXIpO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50TGlzdGVuZXIsIGV2ZW50T3B0aW9ucyk7XG5cbiAgICAgICAgICAgIF90aGlzOS5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRhZy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRMaXN0ZW5lciwgZXZlbnRPcHRpb25zKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbZXZlbnROYW1lLCBjYWxsYmFja05hbWUsIGFyZ0xpc3RdO1xuICAgICAgfSk7XG4gICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi1vbicpO1xuICAgICAgcmV0dXJuIHRhZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwTGlua1RhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXBMaW5rVGFnKHRhZykge1xuICAgICAgLyovXG4gICAgICBjb25zdCB0YWdDb21waWxlciA9IHRoaXMuY29tcGlsZUxpbmtUYWcodGFnKTtcbiAgICAgIFx0Y29uc3QgbmV3VGFnID0gdGFnQ29tcGlsZXIodGhpcyk7XG4gICAgICBcdHRhZy5yZXBsYWNlV2l0aChuZXdUYWcpO1xuICAgICAgXHRyZXR1cm4gbmV3VGFnO1xuICAgICAgLyovXG4gICAgICB2YXIgbGlua0F0dHIgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi1saW5rJyk7XG4gICAgICB0YWcuc2V0QXR0cmlidXRlKCdocmVmJywgbGlua0F0dHIpO1xuXG4gICAgICB2YXIgbGlua0NsaWNrID0gZnVuY3Rpb24gbGlua0NsaWNrKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKGxpbmtBdHRyLnN1YnN0cmluZygwLCA0KSA9PT0gJ2h0dHAnIHx8IGxpbmtBdHRyLnN1YnN0cmluZygwLCAyKSA9PT0gJy8vJykge1xuICAgICAgICAgIHdpbmRvdy5vcGVuKHRhZy5nZXRBdHRyaWJ1dGUoJ2hyZWYnLCBsaW5rQXR0cikpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9Sb3V0ZXIuUm91dGVyLmdvKHRhZy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG4gICAgICB9O1xuXG4gICAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaW5rQ2xpY2spO1xuICAgICAgdGhpcy5vblJlbW92ZShmdW5jdGlvbiAodGFnLCBldmVudExpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGFnLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnRMaXN0ZW5lcik7XG4gICAgICAgICAgdGFnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGV2ZW50TGlzdGVuZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH07XG4gICAgICB9KHRhZywgbGlua0NsaWNrKSk7XG4gICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi1saW5rJyk7XG4gICAgICByZXR1cm4gdGFnOyAvLyovXG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBpbGVMaW5rVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBpbGVMaW5rVGFnKHNvdXJjZVRhZykge1xuICAgICAgdmFyIGxpbmtBdHRyID0gc291cmNlVGFnLmdldEF0dHJpYnV0ZSgnY3YtbGluaycpO1xuICAgICAgc291cmNlVGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtbGluaycpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChiaW5kaW5nVmlldykge1xuICAgICAgICB2YXIgdGFnID0gc291cmNlVGFnLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgdGFnLnNldEF0dHJpYnV0ZSgnaHJlZicsIGxpbmtBdHRyKTtcbiAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcFByZW5kZXJlclRhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXBQcmVuZGVyZXJUYWcodGFnKSB7XG4gICAgICB2YXIgcHJlcmVuZGVyQXR0ciA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LXByZXJlbmRlcicpO1xuICAgICAgdmFyIHByZXJlbmRlcmluZyA9IHdpbmRvdy5wcmVyZW5kZXJlciB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9wcmVyZW5kZXIvaSk7XG5cbiAgICAgIGlmIChwcmVyZW5kZXJpbmcpIHtcbiAgICAgICAgd2luZG93LnByZXJlbmRlcmVyID0gd2luZG93LnByZXJlbmRlcmVyIHx8IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmVyZW5kZXJBdHRyID09PSAnbmV2ZXInICYmIHByZXJlbmRlcmluZyB8fCBwcmVyZW5kZXJBdHRyID09PSAnb25seScgJiYgIXByZXJlbmRlcmluZykge1xuICAgICAgICB0YWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBXaXRoVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcFdpdGhUYWcodGFnKSB7XG4gICAgICB2YXIgX3RoaXMxMCA9IHRoaXM7XG5cbiAgICAgIHZhciB3aXRoQXR0ciA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LXdpdGgnKTtcbiAgICAgIHZhciBjYXJyeUF0dHIgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi1jYXJyeScpO1xuICAgICAgdmFyIHZpZXdBdHRyID0gdGFnLmdldEF0dHJpYnV0ZSgnY3YtdmlldycpO1xuICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3Ytd2l0aCcpO1xuICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtY2FycnknKTtcbiAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LXZpZXcnKTtcbiAgICAgIHZhciB2aWV3Q2xhc3MgPSB2aWV3QXR0ciA/IHRoaXMuc3RyaW5nVG9DbGFzcyh2aWV3QXR0cikgOiBWaWV3O1xuICAgICAgdmFyIHN1YlRlbXBsYXRlID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgX3RvQ29uc3VtYWJsZUFycmF5KHRhZy5jaGlsZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBzdWJUZW1wbGF0ZS5hcHBlbmRDaGlsZChuKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgY2FycnlQcm9wcyA9IFtdO1xuXG4gICAgICBpZiAoY2FycnlBdHRyKSB7XG4gICAgICAgIGNhcnJ5UHJvcHMgPSBjYXJyeUF0dHIuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICByZXR1cm4gcy50cmltKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGViaW5kID0gdGhpcy5hcmdzLmJpbmRUbyh3aXRoQXR0ciwgZnVuY3Rpb24gKHYsIGssIHQsIGQpIHtcbiAgICAgICAgaWYgKF90aGlzMTAud2l0aFZpZXdzLmhhcyh0YWcpKSB7XG4gICAgICAgICAgX3RoaXMxMC53aXRoVmlld3NbXCJkZWxldGVcIl0odGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICh0YWcuZmlyc3RDaGlsZCkge1xuICAgICAgICAgIHRhZy5yZW1vdmVDaGlsZCh0YWcuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmlldyA9IG5ldyB2aWV3Q2xhc3Moe30sIF90aGlzMTApO1xuXG4gICAgICAgIF90aGlzMTAub25SZW1vdmUoZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmlldy5yZW1vdmUoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KHZpZXcpKTtcblxuICAgICAgICB2aWV3LnRlbXBsYXRlID0gc3ViVGVtcGxhdGU7XG5cbiAgICAgICAgdmFyIF9sb29wOCA9IGZ1bmN0aW9uIF9sb29wOChpKSB7XG4gICAgICAgICAgdmFyIGRlYmluZCA9IF90aGlzMTAuYXJncy5iaW5kVG8oY2FycnlQcm9wc1tpXSwgZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgICAgIHZpZXcuYXJnc1trXSA9IHY7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2aWV3Lm9uUmVtb3ZlKGRlYmluZCk7XG5cbiAgICAgICAgICBfdGhpczEwLm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlYmluZCgpO1xuICAgICAgICAgICAgdmlldy5yZW1vdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIGNhcnJ5UHJvcHMpIHtcbiAgICAgICAgICBfbG9vcDgoaSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX2xvb3A5ID0gZnVuY3Rpb24gX2xvb3A5KF9pNSkge1xuICAgICAgICAgIGlmIChfdHlwZW9mKHYpICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2ID0gX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2Uodik7XG4gICAgICAgICAgdmFyIGRlYmluZCA9IHYuYmluZFRvKF9pNSwgZnVuY3Rpb24gKHZ2LCBraywgdHQsIGRkKSB7XG4gICAgICAgICAgICBpZiAoIWRkKSB7XG4gICAgICAgICAgICAgIHZpZXcuYXJnc1tra10gPSB2djtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2sgaW4gdmlldy5hcmdzKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSB2aWV3LmFyZ3Nba2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhciBkZWJpbmRVcCA9IHZpZXcuYXJncy5iaW5kVG8oX2k1LCBmdW5jdGlvbiAodnYsIGtrLCB0dCwgZGQpIHtcbiAgICAgICAgICAgIGlmICghZGQpIHtcbiAgICAgICAgICAgICAgdltra10gPSB2djtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2sgaW4gdikge1xuICAgICAgICAgICAgICBkZWxldGUgdltra107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBfdGhpczEwLm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlYmluZCgpO1xuXG4gICAgICAgICAgICBpZiAoIXYuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICAgIF9CaW5kYWJsZS5CaW5kYWJsZS5jbGVhckJpbmRpbmdzKHYpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2aWV3LnJlbW92ZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmlldy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWJpbmQoKTtcblxuICAgICAgICAgICAgaWYgKCF2LmlzQm91bmQoKSkge1xuICAgICAgICAgICAgICBfQmluZGFibGUuQmluZGFibGUuY2xlYXJCaW5kaW5ncyh2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKHZhciBfaTUgaW4gdikge1xuICAgICAgICAgIHZhciBfcmV0NiA9IF9sb29wOShfaTUpO1xuXG4gICAgICAgICAgaWYgKF9yZXQ2ID09PSBcImNvbnRpbnVlXCIpIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmlldy5yZW5kZXIodGFnKTtcblxuICAgICAgICBfdGhpczEwLndpdGhWaWV3cy5zZXQodGFnLCB2aWV3KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzMTAud2l0aFZpZXdzW1wiZGVsZXRlXCJdKHRhZyk7XG5cbiAgICAgICAgZGViaW5kKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0YWc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcFZpZXdUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFwVmlld1RhZyh0YWcpIHtcbiAgICAgIHZhciBfdGhpczExID0gdGhpcztcblxuICAgICAgdmFyIHZpZXdBdHRyID0gdGFnLmdldEF0dHJpYnV0ZSgnY3YtdmlldycpO1xuICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtdmlldycpO1xuICAgICAgdmFyIHN1YlRlbXBsYXRlID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgX3RvQ29uc3VtYWJsZUFycmF5KHRhZy5jaGlsZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBzdWJUZW1wbGF0ZS5hcHBlbmRDaGlsZChuKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgcGFydHMgPSB2aWV3QXR0ci5zcGxpdCgnOicpO1xuICAgICAgdmFyIHZpZXdDbGFzcyA9IHBhcnRzLnBvcCgpID8gdGhpcy5zdHJpbmdUb0NsYXNzKHZpZXdBdHRyKSA6IFZpZXc7XG4gICAgICB2YXIgdmlld05hbWUgPSBwYXJ0cy5zaGlmdCgpO1xuICAgICAgdmFyIHZpZXcgPSBuZXcgdmlld0NsYXNzKHRoaXMuYXJncywgdGhpcyk7XG4gICAgICB0aGlzLnZpZXdzLnNldCh0YWcsIHZpZXcpO1xuXG4gICAgICBpZiAodmlld05hbWUpIHtcbiAgICAgICAgdGhpcy52aWV3cy5zZXQodmlld05hbWUsIHZpZXcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm9uUmVtb3ZlKGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmlldy5yZW1vdmUoKTtcblxuICAgICAgICAgIF90aGlzMTEudmlld3NbXCJkZWxldGVcIl0odGFnKTtcblxuICAgICAgICAgIF90aGlzMTEudmlld3NbXCJkZWxldGVcIl0odmlld05hbWUpO1xuICAgICAgICB9O1xuICAgICAgfSh2aWV3KSk7XG4gICAgICB2aWV3LnRlbXBsYXRlID0gc3ViVGVtcGxhdGU7XG4gICAgICB2aWV3LnJlbmRlcih0YWcpO1xuICAgICAgcmV0dXJuIHRhZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwRWFjaFRhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXBFYWNoVGFnKHRhZykge1xuICAgICAgdmFyIF90aGlzMTIgPSB0aGlzO1xuXG4gICAgICB2YXIgZWFjaEF0dHIgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi1lYWNoJyk7XG4gICAgICB2YXIgdmlld0F0dHIgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi12aWV3Jyk7XG4gICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi1lYWNoJyk7XG4gICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi12aWV3Jyk7XG4gICAgICB2YXIgdmlld0NsYXNzID0gdmlld0F0dHIgPyB0aGlzLnN0cmluZ1RvQ2xhc3Modmlld0F0dHIpIDogVmlldztcbiAgICAgIHZhciBzdWJUZW1wbGF0ZSA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIF90b0NvbnN1bWFibGVBcnJheSh0YWcuY2hpbGROb2RlcykuZm9yRWFjaChmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gc3ViVGVtcGxhdGUuYXBwZW5kQ2hpbGQobik7XG4gICAgICB9KTtcblxuICAgICAgdmFyIF9lYWNoQXR0ciRzcGxpdCA9IGVhY2hBdHRyLnNwbGl0KCc6JyksXG4gICAgICAgICAgX2VhY2hBdHRyJHNwbGl0MiA9IF9zbGljZWRUb0FycmF5KF9lYWNoQXR0ciRzcGxpdCwgMyksXG4gICAgICAgICAgZWFjaFByb3AgPSBfZWFjaEF0dHIkc3BsaXQyWzBdLFxuICAgICAgICAgIGFzUHJvcCA9IF9lYWNoQXR0ciRzcGxpdDJbMV0sXG4gICAgICAgICAga2V5UHJvcCA9IF9lYWNoQXR0ciRzcGxpdDJbMl07XG5cbiAgICAgIHZhciBkZWJpbmQgPSB0aGlzLmFyZ3MuYmluZFRvKGVhY2hQcm9wLCBmdW5jdGlvbiAodiwgaywgdCwgZCwgcCkge1xuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIF9CYWcuQmFnKSB7XG4gICAgICAgICAgdiA9IHYubGlzdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfdGhpczEyLnZpZXdMaXN0cy5oYXModGFnKSkge1xuICAgICAgICAgIF90aGlzMTIudmlld0xpc3RzLmdldCh0YWcpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZpZXdMaXN0ID0gbmV3IF9WaWV3TGlzdC5WaWV3TGlzdChzdWJUZW1wbGF0ZSwgYXNQcm9wLCB2LCBfdGhpczEyLCBrZXlQcm9wLCB2aWV3Q2xhc3MpO1xuXG4gICAgICAgIHZhciB2aWV3TGlzdFJlbW92ZXIgPSBmdW5jdGlvbiB2aWV3TGlzdFJlbW92ZXIoKSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdMaXN0LnJlbW92ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIF90aGlzMTIub25SZW1vdmUodmlld0xpc3RSZW1vdmVyKTtcblxuICAgICAgICB2aWV3TGlzdC5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzMTIuX29uUmVtb3ZlLnJlbW92ZSh2aWV3TGlzdFJlbW92ZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZGViaW5kQSA9IF90aGlzMTIuYXJncy5iaW5kVG8oZnVuY3Rpb24gKHYsIGssIHQsIGQpIHtcbiAgICAgICAgICBpZiAoayA9PT0gJ19pZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWQpIHtcbiAgICAgICAgICAgIHZpZXdMaXN0LnN1YkFyZ3Nba10gPSB2O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoayBpbiB2aWV3TGlzdC5zdWJBcmdzKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSB2aWV3TGlzdC5zdWJBcmdzW2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGRlYmluZEIgPSB2aWV3TGlzdC5hcmdzLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCwgZCwgcCkge1xuICAgICAgICAgIGlmIChrID09PSAnX2lkJyB8fCBrID09PSAndmFsdWUnIHx8IFN0cmluZyhrKS5zdWJzdHJpbmcoMCwgMykgPT09ICdfX18nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFkKSB7XG4gICAgICAgICAgICBpZiAoayBpbiBfdGhpczEyLmFyZ3MpIHtcbiAgICAgICAgICAgICAgX3RoaXMxMi5hcmdzW2tdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIF90aGlzMTIuYXJnc1trXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2aWV3TGlzdC5vblJlbW92ZShkZWJpbmRBKTtcbiAgICAgICAgdmlld0xpc3Qub25SZW1vdmUoZGViaW5kQik7XG5cbiAgICAgICAgX3RoaXMxMi5vblJlbW92ZShkZWJpbmRBKTtcblxuICAgICAgICBfdGhpczEyLm9uUmVtb3ZlKGRlYmluZEIpO1xuXG4gICAgICAgIHdoaWxlICh0YWcuZmlyc3RDaGlsZCkge1xuICAgICAgICAgIHRhZy5yZW1vdmVDaGlsZCh0YWcuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczEyLnZpZXdMaXN0cy5zZXQodGFnLCB2aWV3TGlzdCk7XG5cbiAgICAgICAgdmlld0xpc3QucmVuZGVyKHRhZyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMub25SZW1vdmUoZGViaW5kKTtcbiAgICAgIHJldHVybiB0YWc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcElmVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcElmVGFnKHRhZykge1xuICAgICAgdmFyIF90aGlzMTMgPSB0aGlzO1xuXG4gICAgICB2YXIgc291cmNlVGFnID0gdGFnO1xuICAgICAgdmFyIHZpZXdQcm9wZXJ0eSA9IHNvdXJjZVRhZy5nZXRBdHRyaWJ1dGUoJ2N2LXZpZXcnKTtcbiAgICAgIHZhciBpZlByb3BlcnR5ID0gc291cmNlVGFnLmdldEF0dHJpYnV0ZSgnY3YtaWYnKTtcbiAgICAgIHZhciBpc1Byb3BlcnR5ID0gc291cmNlVGFnLmdldEF0dHJpYnV0ZSgnY3YtaXMnKTtcbiAgICAgIHZhciBpbnZlcnRlZCA9IGZhbHNlO1xuICAgICAgdmFyIGRlZmluZWQgPSBmYWxzZTtcbiAgICAgIHNvdXJjZVRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LXZpZXcnKTtcbiAgICAgIHNvdXJjZVRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LWlmJyk7XG4gICAgICBzb3VyY2VUYWcucmVtb3ZlQXR0cmlidXRlKCdjdi1pcycpO1xuICAgICAgdmFyIHZpZXdDbGFzcyA9IHZpZXdQcm9wZXJ0eSA/IHRoaXMuc3RyaW5nVG9DbGFzcyh2aWV3UHJvcGVydHkpIDogVmlldztcblxuICAgICAgaWYgKGlmUHJvcGVydHkuc3Vic3RyKDAsIDEpID09PSAnIScpIHtcbiAgICAgICAgaWZQcm9wZXJ0eSA9IGlmUHJvcGVydHkuc3Vic3RyKDEpO1xuICAgICAgICBpbnZlcnRlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpZlByb3BlcnR5LnN1YnN0cigwLCAxKSA9PT0gJz8nKSB7XG4gICAgICAgIGlmUHJvcGVydHkgPSBpZlByb3BlcnR5LnN1YnN0cigxKTtcbiAgICAgICAgZGVmaW5lZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdWJUZW1wbGF0ZSA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIF90b0NvbnN1bWFibGVBcnJheShzb3VyY2VUYWcuY2hpbGROb2RlcykuZm9yRWFjaChmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gc3ViVGVtcGxhdGUuYXBwZW5kQ2hpbGQobik7XG4gICAgICB9KTtcblxuICAgICAgdmFyIGJpbmRpbmdWaWV3ID0gdGhpcztcbiAgICAgIHZhciBpZkRvYyA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICB2YXIgdmlldyA9IG5ldyB2aWV3Q2xhc3MoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5hcmdzKSwgYmluZGluZ1ZpZXcpO1xuICAgICAgdGhpcy5vblJlbW92ZSh2aWV3LnRhZ3MuYmluZFRvKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgIF90aGlzMTMudGFnc1trXSA9IHY7XG4gICAgICB9KSk7XG4gICAgICB2aWV3LnRlbXBsYXRlID0gc3ViVGVtcGxhdGU7XG4gICAgICB2YXIgcHJveHkgPSBiaW5kaW5nVmlldy5hcmdzO1xuICAgICAgdmFyIHByb3BlcnR5ID0gaWZQcm9wZXJ0eTtcblxuICAgICAgaWYgKGlmUHJvcGVydHkubWF0Y2goL1xcLi8pKSB7XG4gICAgICAgIHZhciBfQmluZGFibGUkcmVzb2x2ZTExID0gX0JpbmRhYmxlLkJpbmRhYmxlLnJlc29sdmUoYmluZGluZ1ZpZXcuYXJncywgaWZQcm9wZXJ0eSwgdHJ1ZSk7XG5cbiAgICAgICAgdmFyIF9CaW5kYWJsZSRyZXNvbHZlMTIgPSBfc2xpY2VkVG9BcnJheShfQmluZGFibGUkcmVzb2x2ZTExLCAyKTtcblxuICAgICAgICBwcm94eSA9IF9CaW5kYWJsZSRyZXNvbHZlMTJbMF07XG4gICAgICAgIHByb3BlcnR5ID0gX0JpbmRhYmxlJHJlc29sdmUxMlsxXTtcbiAgICAgIH1cblxuICAgICAgdmlldy5yZW5kZXIoaWZEb2MpO1xuICAgICAgdmFyIHByb3BlcnR5RGViaW5kID0gcHJveHkuYmluZFRvKHByb3BlcnR5LCBmdW5jdGlvbiAodiwgaykge1xuICAgICAgICB2YXIgbyA9IHY7XG5cbiAgICAgICAgaWYgKGRlZmluZWQpIHtcbiAgICAgICAgICB2ID0gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIF9CYWcuQmFnKSB7XG4gICAgICAgICAgdiA9IHYubGlzdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICAgICAgdiA9ICEhdi5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQcm9wZXJ0eSAhPT0gbnVsbCkge1xuICAgICAgICAgIHYgPSBvID09IGlzUHJvcGVydHk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW52ZXJ0ZWQpIHtcbiAgICAgICAgICB2ID0gIXY7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodikge1xuICAgICAgICAgIHRhZy5hcHBlbmRDaGlsZChpZkRvYyk7XG5cbiAgICAgICAgICBfdG9Db25zdW1hYmxlQXJyYXkoaWZEb2MuY2hpbGROb2RlcykuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIF9Eb20uRG9tLm1hcFRhZ3Mobm9kZSwgZmFsc2UsIGZ1bmN0aW9uICh0YWcsIHdhbGtlcikge1xuICAgICAgICAgICAgICBpZiAoIXRhZy5tYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdGFnLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjdkRvbUF0dGFjaGVkJywge1xuICAgICAgICAgICAgICAgIHRhcmdldDogdGFnLFxuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgdmlldzogdmlldyB8fCBfdGhpczEzLFxuICAgICAgICAgICAgICAgICAgbWFpblZpZXc6IF90aGlzMTNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZpZXcubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobikge1xuICAgICAgICAgICAgcmV0dXJuIGlmRG9jLmFwcGVuZENoaWxkKG4pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgX0RvbS5Eb20ubWFwVGFncyhpZkRvYywgZmFsc2UsIGZ1bmN0aW9uICh0YWcsIHdhbGtlcikge1xuICAgICAgICAgICAgaWYgKCF0YWcubWF0Y2hlcykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudCgnY3ZEb21EZXRhY2hlZCcsIHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiB0YWcsXG4gICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgIHZpZXc6IHZpZXcgfHwgX3RoaXMxMyxcbiAgICAgICAgICAgICAgICBtYWluVmlldzogX3RoaXMxM1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBjaGlsZHJlbjogQXJyYXkuaXNBcnJheShwcm94eVtwcm9wZXJ0eV0pXG4gICAgICB9KTsgLy8gY29uc3QgcHJvcGVydHlEZWJpbmQgPSB0aGlzLmFyZ3MuYmluZENoYWluKHByb3BlcnR5LCBvblVwZGF0ZSk7XG5cbiAgICAgIGJpbmRpbmdWaWV3Lm9uUmVtb3ZlKHByb3BlcnR5RGViaW5kKTtcbiAgICAgIHZhciBkZWJpbmRBID0gdGhpcy5hcmdzLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCwgZCkge1xuICAgICAgICBpZiAoayA9PT0gJ19pZCcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWQpIHtcbiAgICAgICAgICB2aWV3LmFyZ3Nba10gPSB2O1xuICAgICAgICB9IGVsc2UgaWYgKGsgaW4gdmlldy5hcmdzKSB7XG4gICAgICAgICAgZGVsZXRlIHZpZXcuYXJnc1trXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgZGViaW5kQiA9IHZpZXcuYXJncy5iaW5kVG8oZnVuY3Rpb24gKHYsIGssIHQsIGQsIHApIHtcbiAgICAgICAgaWYgKGsgPT09ICdfaWQnIHx8IFN0cmluZyhrKS5zdWJzdHJpbmcoMCwgMykgPT09ICdfX18nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGsgaW4gX3RoaXMxMy5hcmdzKSB7XG4gICAgICAgICAgaWYgKCFkKSB7XG4gICAgICAgICAgICBfdGhpczEzLmFyZ3Nba10gPSB2O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgX3RoaXMxMy5hcmdzW2tdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciB2aWV3RGViaW5kID0gZnVuY3Rpb24gdmlld0RlYmluZCgpIHtcbiAgICAgICAgcHJvcGVydHlEZWJpbmQoKTtcbiAgICAgICAgZGViaW5kQSgpO1xuICAgICAgICBkZWJpbmRCKCk7XG5cbiAgICAgICAgYmluZGluZ1ZpZXcuX29uUmVtb3ZlLnJlbW92ZShwcm9wZXJ0eURlYmluZCk7IC8vIGJpbmRpbmdWaWV3Ll9vblJlbW92ZS5yZW1vdmUoYmluZGFibGVEZWJpbmQpO1xuXG4gICAgICB9O1xuXG4gICAgICBiaW5kaW5nVmlldy5vblJlbW92ZSh2aWV3RGViaW5kKTtcbiAgICAgIHRoaXMub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWJpbmRBKCk7XG4gICAgICAgIGRlYmluZEIoKTtcbiAgICAgICAgdmlldy5yZW1vdmUoKTtcblxuICAgICAgICBpZiAoYmluZGluZ1ZpZXcgIT09IF90aGlzMTMpIHtcbiAgICAgICAgICBiaW5kaW5nVmlldy5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb21waWxlSWZUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGlsZUlmVGFnKHNvdXJjZVRhZykge1xuICAgICAgdmFyIGlmUHJvcGVydHkgPSBzb3VyY2VUYWcuZ2V0QXR0cmlidXRlKCdjdi1pZicpO1xuICAgICAgdmFyIGludmVydGVkID0gZmFsc2U7XG4gICAgICBzb3VyY2VUYWcucmVtb3ZlQXR0cmlidXRlKCdjdi1pZicpO1xuXG4gICAgICBpZiAoaWZQcm9wZXJ0eS5zdWJzdHIoMCwgMSkgPT09ICchJykge1xuICAgICAgICBpZlByb3BlcnR5ID0gaWZQcm9wZXJ0eS5zdWJzdHIoMSk7XG4gICAgICAgIGludmVydGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN1YlRlbXBsYXRlID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgX3RvQ29uc3VtYWJsZUFycmF5KHNvdXJjZVRhZy5jaGlsZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBzdWJUZW1wbGF0ZS5hcHBlbmRDaGlsZChuLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChiaW5kaW5nVmlldykge1xuICAgICAgICB2YXIgdGFnID0gc291cmNlVGFnLmNsb25lTm9kZSgpO1xuICAgICAgICB2YXIgaWZEb2MgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICB2YXIgdmlldyA9IG5ldyBWaWV3KHt9LCBiaW5kaW5nVmlldyk7XG4gICAgICAgIHZpZXcudGVtcGxhdGUgPSBzdWJUZW1wbGF0ZTsgLy8gdmlldy5wYXJlbnQgICA9IGJpbmRpbmdWaWV3O1xuXG4gICAgICAgIGJpbmRpbmdWaWV3LnN5bmNCaW5kKHZpZXcpO1xuICAgICAgICB2YXIgcHJveHkgPSBiaW5kaW5nVmlldy5hcmdzO1xuICAgICAgICB2YXIgcHJvcGVydHkgPSBpZlByb3BlcnR5O1xuXG4gICAgICAgIGlmIChpZlByb3BlcnR5Lm1hdGNoKC9cXC4vKSkge1xuICAgICAgICAgIHZhciBfQmluZGFibGUkcmVzb2x2ZTEzID0gX0JpbmRhYmxlLkJpbmRhYmxlLnJlc29sdmUoYmluZGluZ1ZpZXcuYXJncywgaWZQcm9wZXJ0eSwgdHJ1ZSk7XG5cbiAgICAgICAgICB2YXIgX0JpbmRhYmxlJHJlc29sdmUxNCA9IF9zbGljZWRUb0FycmF5KF9CaW5kYWJsZSRyZXNvbHZlMTMsIDIpO1xuXG4gICAgICAgICAgcHJveHkgPSBfQmluZGFibGUkcmVzb2x2ZTE0WzBdO1xuICAgICAgICAgIHByb3BlcnR5ID0gX0JpbmRhYmxlJHJlc29sdmUxNFsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoYXNSZW5kZXJlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgcHJvcGVydHlEZWJpbmQgPSBwcm94eS5iaW5kVG8ocHJvcGVydHksIGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgICAgaWYgKCFoYXNSZW5kZXJlZCkge1xuICAgICAgICAgICAgdmFyIHJlbmRlckRvYyA9IGJpbmRpbmdWaWV3LmFyZ3NbcHJvcGVydHldIHx8IGludmVydGVkID8gdGFnIDogaWZEb2M7XG4gICAgICAgICAgICB2aWV3LnJlbmRlcihyZW5kZXJEb2MpO1xuICAgICAgICAgICAgaGFzUmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICAgICAgICB2ID0gISF2Lmxlbmd0aDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaW52ZXJ0ZWQpIHtcbiAgICAgICAgICAgIHYgPSAhdjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgdGFnLmFwcGVuZENoaWxkKGlmRG9jKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlldy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpZkRvYy5hcHBlbmRDaGlsZChuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7IC8vIGxldCBjbGVhbmVyID0gYmluZGluZ1ZpZXc7XG4gICAgICAgIC8vIHdoaWxlKGNsZWFuZXIucGFyZW50KVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vIFx0Y2xlYW5lciA9IGNsZWFuZXIucGFyZW50O1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgYmluZGluZ1ZpZXcub25SZW1vdmUocHJvcGVydHlEZWJpbmQpO1xuXG4gICAgICAgIHZhciBiaW5kYWJsZURlYmluZCA9IGZ1bmN0aW9uIGJpbmRhYmxlRGViaW5kKCkge1xuICAgICAgICAgIGlmICghcHJveHkuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICBfQmluZGFibGUuQmluZGFibGUuY2xlYXJCaW5kaW5ncyhwcm94eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB2aWV3RGViaW5kID0gZnVuY3Rpb24gdmlld0RlYmluZCgpIHtcbiAgICAgICAgICBwcm9wZXJ0eURlYmluZCgpO1xuICAgICAgICAgIGJpbmRhYmxlRGViaW5kKCk7XG5cbiAgICAgICAgICBiaW5kaW5nVmlldy5fb25SZW1vdmUucmVtb3ZlKHByb3BlcnR5RGViaW5kKTtcblxuICAgICAgICAgIGJpbmRpbmdWaWV3Ll9vblJlbW92ZS5yZW1vdmUoYmluZGFibGVEZWJpbmQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZpZXcub25SZW1vdmUodmlld0RlYmluZCk7XG4gICAgICAgIHJldHVybiB0YWc7XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBUZW1wbGF0ZVRhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXBUZW1wbGF0ZVRhZyh0YWcpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZU5hbWUgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi10ZW1wbGF0ZScpO1xuICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtdGVtcGxhdGUnKTtcblxuICAgICAgdGhpcy50ZW1wbGF0ZXNbdGVtcGxhdGVOYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRhZy50YWdOYW1lID09PSAnVEVNUExBVEUnID8gdGFnLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpIDogbmV3IERvY3VtZW50RnJhZ21lbnQodGFnLmlubmVySFRNTCk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnJlbmRlcmVkLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGFnLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBTbG90VGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcFNsb3RUYWcodGFnKSB7XG4gICAgICB2YXIgdGVtcGxhdGVOYW1lID0gdGFnLmdldEF0dHJpYnV0ZSgnY3Ytc2xvdCcpO1xuICAgICAgdmFyIGdldFRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZXNbdGVtcGxhdGVOYW1lXTtcblxuICAgICAgaWYgKCFnZXRUZW1wbGF0ZSkge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcztcblxuICAgICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgICAgZ2V0VGVtcGxhdGUgPSBwYXJlbnQudGVtcGxhdGVzW3RlbXBsYXRlTmFtZV07XG5cbiAgICAgICAgICBpZiAoZ2V0VGVtcGxhdGUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFnZXRUZW1wbGF0ZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUZW1wbGF0ZSBcIi5jb25jYXQodGVtcGxhdGVOYW1lLCBcIiBub3QgZm91bmQuXCIpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHRlbXBsYXRlID0gZ2V0VGVtcGxhdGUoKTtcbiAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LXNsb3QnKTtcblxuICAgICAgd2hpbGUgKHRhZy5maXJzdENoaWxkKSB7XG4gICAgICAgIHRhZy5maXJzdENoaWxkLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICB0YWcuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICAgICAgcmV0dXJuIHRhZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic3luY0JpbmRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3luY0JpbmQoc3ViVmlldykge1xuICAgICAgdmFyIF90aGlzMTQgPSB0aGlzO1xuXG4gICAgICB2YXIgZGViaW5kQSA9IHRoaXMuYXJncy5iaW5kVG8oZnVuY3Rpb24gKHYsIGssIHQsIGQpIHtcbiAgICAgICAgaWYgKGsgPT09ICdfaWQnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN1YlZpZXcuYXJnc1trXSAhPT0gdikge1xuICAgICAgICAgIHN1YlZpZXcuYXJnc1trXSA9IHY7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIGRlYmluZEIgPSBzdWJWaWV3LmFyZ3MuYmluZFRvKGZ1bmN0aW9uICh2LCBrLCB0LCBkLCBwKSB7XG4gICAgICAgIGlmIChrID09PSAnX2lkJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXdSZWYgPSB2O1xuICAgICAgICB2YXIgb2xkUmVmID0gcDtcblxuICAgICAgICBpZiAobmV3UmVmIGluc3RhbmNlb2YgVmlldykge1xuICAgICAgICAgIG5ld1JlZiA9IG5ld1JlZi5fX19yZWZfX187XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2xkUmVmIGluc3RhbmNlb2YgVmlldykge1xuICAgICAgICAgIG9sZFJlZiA9IG9sZFJlZi5fX19yZWZfX187XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3UmVmICE9PSBvbGRSZWYgJiYgb2xkUmVmIGluc3RhbmNlb2YgVmlldykge1xuICAgICAgICAgIHAucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoayBpbiBfdGhpczE0LmFyZ3MpIHtcbiAgICAgICAgICBfdGhpczE0LmFyZ3Nba10gPSB2O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMub25SZW1vdmUoZGViaW5kQSk7XG4gICAgICB0aGlzLm9uUmVtb3ZlKGRlYmluZEIpO1xuICAgICAgc3ViVmlldy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzMTQuX29uUmVtb3ZlLnJlbW92ZShkZWJpbmRBKTtcblxuICAgICAgICBfdGhpczE0Ll9vblJlbW92ZS5yZW1vdmUoZGViaW5kQik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicG9zdFJlbmRlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwb3N0UmVuZGVyKHBhcmVudE5vZGUpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiYXR0YWNoZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXR0YWNoZWQocGFyZW50Tm9kZSkge31cbiAgfSwge1xuICAgIGtleTogXCJpbnRlcnBvbGF0YWJsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbnRlcnBvbGF0YWJsZShzdHIpIHtcbiAgICAgIHJldHVybiAhIVN0cmluZyhzdHIpLm1hdGNoKHRoaXMuaW50ZXJwb2xhdGVSZWdleCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICB2YXIgX3RoaXMxNSA9IHRoaXM7XG5cbiAgICAgIHZhciBub3cgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGZhbHNlO1xuXG4gICAgICB2YXIgcmVtb3ZlciA9IGZ1bmN0aW9uIHJlbW92ZXIoKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gX3RoaXMxNS50YWdzKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX3RoaXMxNS50YWdzW2ldKSkge1xuICAgICAgICAgICAgX3RoaXMxNS50YWdzW2ldICYmIF90aGlzMTUudGFnc1tpXS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgIHJldHVybiB0LnJlbW92ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF90aGlzMTUudGFnc1tpXS5zcGxpY2UoMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzMTUudGFnc1tpXSAmJiBfdGhpczE1LnRhZ3NbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICBfdGhpczE1LnRhZ3NbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgX2k2IGluIF90aGlzMTUubm9kZXMpIHtcbiAgICAgICAgICBfdGhpczE1Lm5vZGVzW19pNl0gJiYgX3RoaXMxNS5ub2Rlc1tfaTZdLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjdkRvbURldGFjaGVkJykpO1xuICAgICAgICAgIF90aGlzMTUubm9kZXNbX2k2XSAmJiBfdGhpczE1Lm5vZGVzW19pNl0ucmVtb3ZlKCk7XG4gICAgICAgICAgX3RoaXMxNS5ub2Rlc1tfaTZdID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMxNS5ub2Rlcy5zcGxpY2UoMCk7XG5cbiAgICAgICAgX3RoaXMxNS5maXJzdE5vZGUgPSBfdGhpczE1Lmxhc3ROb2RlID0gdW5kZWZpbmVkO1xuICAgICAgfTtcblxuICAgICAgaWYgKG5vdykge1xuICAgICAgICByZW1vdmVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVtb3Zlcik7XG4gICAgICB9XG5cbiAgICAgIHZhciBjYWxsYmFja3MgPSB0aGlzLl9vblJlbW92ZS5pdGVtcygpO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yMTAgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihjYWxsYmFja3MpLFxuICAgICAgICAgIF9zdGVwMTA7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTAucygpOyAhKF9zdGVwMTAgPSBfaXRlcmF0b3IxMC5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGNhbGxiYWNrID0gX3N0ZXAxMC52YWx1ZTtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuXG4gICAgICAgICAgdGhpcy5fb25SZW1vdmUucmVtb3ZlKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjEwLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjEwLmYoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9pdGVyYXRvcjExID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5jbGVhbnVwKSxcbiAgICAgICAgICBfc3RlcDExO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjExLnMoKTsgIShfc3RlcDExID0gX2l0ZXJhdG9yMTEubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBjbGVhbnVwID0gX3N0ZXAxMS52YWx1ZTtcbiAgICAgICAgICBjbGVhbnVwICYmIGNsZWFudXAoKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjExLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjExLmYoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbGVhbnVwLmxlbmd0aCA9IDA7XG5cbiAgICAgIHZhciBfaXRlcmF0b3IxMiA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMudmlld0xpc3RzKSxcbiAgICAgICAgICBfc3RlcDEyO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjEyLnMoKTsgIShfc3RlcDEyID0gX2l0ZXJhdG9yMTIubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBfc3RlcDEyJHZhbHVlID0gX3NsaWNlZFRvQXJyYXkoX3N0ZXAxMi52YWx1ZSwgMiksXG4gICAgICAgICAgICAgIHRhZyA9IF9zdGVwMTIkdmFsdWVbMF0sXG4gICAgICAgICAgICAgIHZpZXdMaXN0ID0gX3N0ZXAxMiR2YWx1ZVsxXTtcblxuICAgICAgICAgIHZpZXdMaXN0LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMTIuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yMTIuZigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXdMaXN0cy5jbGVhcigpO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yMTMgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLnRpbWVvdXRzKSxcbiAgICAgICAgICBfc3RlcDEzO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjEzLnMoKTsgIShfc3RlcDEzID0gX2l0ZXJhdG9yMTMubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBfc3RlcDEzJHZhbHVlID0gX3NsaWNlZFRvQXJyYXkoX3N0ZXAxMy52YWx1ZSwgMiksXG4gICAgICAgICAgICAgIF9jYWxsYmFjazMgPSBfc3RlcDEzJHZhbHVlWzBdLFxuICAgICAgICAgICAgICB0aW1lb3V0ID0gX3N0ZXAxMyR2YWx1ZVsxXTtcblxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0LnRpbWVvdXQpO1xuICAgICAgICAgIHRoaXMudGltZW91dHNbXCJkZWxldGVcIl0odGltZW91dC50aW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjEzLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjEzLmYoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9pdGVyYXRvcjE0ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5pbnRlcnZhbHMpLFxuICAgICAgICAgIF9zdGVwMTQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTQucygpOyAhKF9zdGVwMTQgPSBfaXRlcmF0b3IxNC5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGludGVydmFsID0gX3N0ZXAxNC52YWx1ZTtcbiAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjE0LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjE0LmYoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbnRlcnZhbHMubGVuZ3RoID0gMDtcblxuICAgICAgdmFyIF9pdGVyYXRvcjE1ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5mcmFtZXMpLFxuICAgICAgICAgIF9zdGVwMTU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTUucygpOyAhKF9zdGVwMTUgPSBfaXRlcmF0b3IxNS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGZyYW1lID0gX3N0ZXAxNS52YWx1ZTtcbiAgICAgICAgICBmcmFtZSgpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMTUuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yMTUuZigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZyYW1lcy5sZW5ndGggPSAwO1xuICAgICAgdGhpcy5wcmVSdWxlU2V0LnB1cmdlKCk7XG4gICAgICB0aGlzLnJ1bGVTZXQucHVyZ2UoKTtcbiAgICAgIHRoaXMucmVtb3ZlZCA9IHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpbmRUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmluZFRhZyhzZWxlY3Rvcikge1xuICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLm5vZGVzKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG5cbiAgICAgICAgaWYgKCF0aGlzLm5vZGVzW2ldLnF1ZXJ5U2VsZWN0b3IpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm5vZGVzW2ldLm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBfVGFnLlRhZyh0aGlzLm5vZGVzW2ldLCB0aGlzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0ID0gdGhpcy5ub2Rlc1tpXS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgX1RhZy5UYWcocmVzdWx0LCB0aGlzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmluZFRhZ3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmluZFRhZ3Moc2VsZWN0b3IpIHtcbiAgICAgIHZhciBfdGhpczE2ID0gdGhpcztcblxuICAgICAgcmV0dXJuIHRoaXMubm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBuLnF1ZXJ5U2VsZWN0b3JBbGw7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIF90b0NvbnN1bWFibGVBcnJheShuLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgICAgIH0pLmZsYXQoKS5tYXAoZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBfVGFnLlRhZyhuLCBfdGhpczE2LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgX3RoaXMxNik7XG4gICAgICB9KSB8fCBbXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25SZW1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25SZW1vdmUoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuX29uUmVtb3ZlLmFkZChjYWxsYmFjayk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImJlZm9yZVVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBiZWZvcmVVcGRhdGUoYXJncykge31cbiAgfSwge1xuICAgIGtleTogXCJhZnRlclVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZnRlclVwZGF0ZShhcmdzKSB7fVxuICB9LCB7XG4gICAga2V5OiBcInN0cmluZ1RyYW5zZm9ybWVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0cmluZ1RyYW5zZm9ybWVyKG1ldGhvZHMpIHtcbiAgICAgIHZhciBfdGhpczE3ID0gdGhpcztcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIGZvciAodmFyIG0gaW4gbWV0aG9kcykge1xuICAgICAgICAgIHZhciBwYXJlbnQgPSBfdGhpczE3O1xuICAgICAgICAgIHZhciBtZXRob2QgPSBtZXRob2RzW21dO1xuXG4gICAgICAgICAgd2hpbGUgKHBhcmVudCAmJiAhcGFyZW50W21ldGhvZF0pIHtcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB4ID0gcGFyZW50W21ldGhvZHNbbV1dKHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdHJpbmdUb0NsYXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0cmluZ1RvQ2xhc3MocmVmQ2xhc3NuYW1lKSB7XG4gICAgICBpZiAoVmlldy5yZWZDbGFzc2VzLmhhcyhyZWZDbGFzc25hbWUpKSB7XG4gICAgICAgIHJldHVybiBWaWV3LnJlZkNsYXNzZXMuZ2V0KHJlZkNsYXNzbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWZDbGFzc1NwbGl0ID0gcmVmQ2xhc3NuYW1lLnNwbGl0KCcvJyk7XG4gICAgICB2YXIgcmVmU2hvcnRDbGFzcyA9IHJlZkNsYXNzU3BsaXRbcmVmQ2xhc3NTcGxpdC5sZW5ndGggLSAxXTtcblxuICAgICAgdmFyIHJlZkNsYXNzID0gcmVxdWlyZShyZWZDbGFzc25hbWUpO1xuXG4gICAgICBWaWV3LnJlZkNsYXNzZXMuc2V0KHJlZkNsYXNzbmFtZSwgcmVmQ2xhc3NbcmVmU2hvcnRDbGFzc10pO1xuICAgICAgcmV0dXJuIHJlZkNsYXNzW3JlZlNob3J0Q2xhc3NdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwcmV2ZW50UGFyc2luZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcmV2ZW50UGFyc2luZyhub2RlKSB7XG4gICAgICBub2RlW2RvbnRQYXJzZV0gPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLm5vZGVzLm1hcChmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gbi5vdXRlckhUTUw7XG4gICAgICB9KS5qb2luKCcgJyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxpc3RlblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW4obm9kZSwgZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgICAgdmFyIF90aGlzMTggPSB0aGlzO1xuXG4gICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG9wdGlvbnMgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSBldmVudE5hbWU7XG4gICAgICAgIGV2ZW50TmFtZSA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSB0aGlzO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFZpZXcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdGVuKG5vZGUubm9kZXMsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgICAgICByZXR1cm4gbm9kZS5tYXAoZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMxOC5saXN0ZW4obiwgZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICByZXR1cm4gcigpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBfVGFnLlRhZykge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0ZW4obm9kZS5lbGVtZW50LCBldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgcmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICByZXR1cm4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgdmFyIHJlbW92ZXIgPSBmdW5jdGlvbiByZW1vdmVyKCkge1xuICAgICAgICByZW1vdmUoKTtcblxuICAgICAgICByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7fTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlcigpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVtb3ZlcjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGV0YWNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRldGFjaCgpIHtcbiAgICAgIGZvciAodmFyIG4gaW4gdGhpcy5ub2Rlcykge1xuICAgICAgICB0aGlzLm5vZGVzW25dLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgICB9XG4gIH1dLCBbe1xuICAgIGtleTogXCJmcm9tXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZyb20odGVtcGxhdGUpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgIHZhciBwYXJlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG4gICAgICB2YXIgdmlldyA9IG5ldyB0aGlzKGFyZ3MsIHBhcmVudCk7XG4gICAgICB2aWV3LnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaXNWaWV3XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzVmlldygpIHtcbiAgICAgIHJldHVybiBWaWV3O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ1dWlkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHV1aWQoKSB7XG4gICAgICByZXR1cm4gKFsxZTddICsgLTFlMyArIC00ZTMgKyAtOGUzICsgLTFlMTEpLnJlcGxhY2UoL1swMThdL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHJldHVybiAoYyBeIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoMSkpWzBdICYgMTUgPj4gYyAvIDQpLnRvU3RyaW5nKDE2KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBWaWV3O1xufShfTWl4aW4uTWl4aW5bXCJ3aXRoXCJdKF9FdmVudFRhcmdldE1peGluLkV2ZW50VGFyZ2V0TWl4aW4pKTtcblxuZXhwb3J0cy5WaWV3ID0gVmlldztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShWaWV3LCAndGVtcGxhdGVzJywge1xuICB2YWx1ZTogbmV3IE1hcCgpXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShWaWV3LCAncmVmQ2xhc3NlcycsIHtcbiAgdmFsdWU6IG5ldyBNYXAoKVxufSk7XG4gIH0pKCk7XG59KTsiLCJcbnJlcXVpcmUucmVnaXN0ZXIoXCJjdXJ2YXR1cmUvYmFzZS9WaWV3TGlzdC5qc1wiLCBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUpIHtcbiAgcmVxdWlyZSA9IF9fbWFrZVJlbGF0aXZlUmVxdWlyZShyZXF1aXJlLCB7fSwgXCJjdXJ2YXR1cmVcIik7XG4gIChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuVmlld0xpc3QgPSB2b2lkIDA7XG5cbnZhciBfQmluZGFibGUgPSByZXF1aXJlKFwiLi9CaW5kYWJsZVwiKTtcblxudmFyIF9TZXRNYXAgPSByZXF1aXJlKFwiLi9TZXRNYXBcIik7XG5cbnZhciBfVmlldyA9IHJlcXVpcmUoXCIuL1ZpZXdcIik7XG5cbnZhciBfQmFnID0gcmVxdWlyZShcIi4vQmFnXCIpO1xuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lKSB7IHRocm93IF9lOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMjsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIFZpZXdMaXN0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gVmlld0xpc3QodGVtcGxhdGUsIHN1YlByb3BlcnR5LCBsaXN0LCBwYXJlbnQpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGtleVByb3BlcnR5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiBudWxsO1xuICAgIHZhciB2aWV3Q2xhc3MgPSBhcmd1bWVudHMubGVuZ3RoID4gNSAmJiBhcmd1bWVudHNbNV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s1XSA6IG51bGw7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVmlld0xpc3QpO1xuXG4gICAgdGhpcy5yZW1vdmVkID0gZmFsc2U7XG4gICAgdGhpcy5hcmdzID0gX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2VCaW5kYWJsZSh7fSk7XG4gICAgdGhpcy5hcmdzLnZhbHVlID0gX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2VCaW5kYWJsZShsaXN0IHx8IHt9KTtcbiAgICB0aGlzLnN1YkFyZ3MgPSBfQmluZGFibGUuQmluZGFibGUubWFrZUJpbmRhYmxlKHt9KTtcbiAgICB0aGlzLnZpZXdzID0gW107XG4gICAgdGhpcy5jbGVhbnVwID0gW107XG4gICAgdGhpcy52aWV3Q2xhc3MgPSB2aWV3Q2xhc3MgfHwgX1ZpZXcuVmlldztcbiAgICB0aGlzLl9vblJlbW92ZSA9IG5ldyBfQmFnLkJhZygpO1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB0aGlzLnN1YlByb3BlcnR5ID0gc3ViUHJvcGVydHk7XG4gICAgdGhpcy5rZXlQcm9wZXJ0eSA9IGtleVByb3BlcnR5O1xuICAgIHRoaXMudGFnID0gbnVsbDtcbiAgICB0aGlzLmRvd25EZWJpbmQgPSBbXTtcbiAgICB0aGlzLnVwRGViaW5kID0gW107XG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLnJlbmRlcmVkID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKGFjY2VwdCwgcmVqZWN0KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX3RoaXMsICdyZW5kZXJDb21wbGV0ZScsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiBhY2NlcHRcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMud2lsbFJlUmVuZGVyID0gZmFsc2U7XG5cbiAgICB0aGlzLmFyZ3MuX19fYmVmb3JlKGZ1bmN0aW9uICh0LCBlLCBzLCBvLCBhKSB7XG4gICAgICBpZiAoZSA9PSAnYmluZFRvJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF90aGlzLnBhdXNlZCA9IHRydWU7XG4gICAgfSk7XG5cbiAgICB0aGlzLmFyZ3MuX19fYWZ0ZXIoZnVuY3Rpb24gKHQsIGUsIHMsIG8sIGEpIHtcbiAgICAgIGlmIChlID09ICdiaW5kVG8nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3RoaXMucGF1c2VkID0gcy5sZW5ndGggPiAxO1xuXG4gICAgICBfdGhpcy5yZVJlbmRlcigpO1xuICAgIH0pO1xuXG4gICAgdmFyIGRlYmluZCA9IHRoaXMuYXJncy52YWx1ZS5iaW5kVG8oZnVuY3Rpb24gKHYsIGssIHQsIGQpIHtcbiAgICAgIGlmIChfdGhpcy5wYXVzZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIga2sgPSBrO1xuXG4gICAgICBpZiAoX3R5cGVvZihrKSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNOYU4oaykpIHtcbiAgICAgICAga2sgPSAnXycgKyBrO1xuICAgICAgfVxuXG4gICAgICBpZiAoZCkge1xuICAgICAgICBpZiAoX3RoaXMudmlld3Nba2tdKSB7XG4gICAgICAgICAgX3RoaXMudmlld3Nba2tdLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIF90aGlzLnZpZXdzW2trXTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIF90aGlzLnZpZXdzKSB7XG4gICAgICAgICAgaWYgKGlzTmFOKGkpKSB7XG4gICAgICAgICAgICBfdGhpcy52aWV3c1tpXS5hcmdzW190aGlzLmtleVByb3BlcnR5XSA9IGkuc3Vic3RyKDEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3RoaXMudmlld3NbaV0uYXJnc1tfdGhpcy5rZXlQcm9wZXJ0eV0gPSBpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFfdGhpcy52aWV3c1tra10pIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoX3RoaXMud2lsbFJlUmVuZGVyKTtcbiAgICAgICAgX3RoaXMud2lsbFJlUmVuZGVyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpcy5yZVJlbmRlcigpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoX3RoaXMudmlld3Nba2tdICYmIF90aGlzLnZpZXdzW2trXS5hcmdzKSB7XG4gICAgICAgIF90aGlzLnZpZXdzW2trXS5hcmdzW190aGlzLmtleVByb3BlcnR5XSA9IGs7XG4gICAgICAgIF90aGlzLnZpZXdzW2trXS5hcmdzW190aGlzLnN1YlByb3BlcnR5XSA9IHY7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9vblJlbW92ZS5hZGQoZGViaW5kKTtcblxuICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0aGlzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhWaWV3TGlzdCwgW3tcbiAgICBrZXk6IFwicmVuZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcih0YWcpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgcmVuZGVycyA9IFtdO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy52aWV3cyksXG4gICAgICAgICAgX3N0ZXA7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKCkge1xuICAgICAgICAgIHZhciB2aWV3ID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgdmlldy5yZW5kZXIodGFnKTtcbiAgICAgICAgICByZW5kZXJzLnB1c2godmlldy5yZW5kZXJlZC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2aWV3O1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKF9pdGVyYXRvci5zKCk7ICEoX3N0ZXAgPSBfaXRlcmF0b3IubigpKS5kb25lOykge1xuICAgICAgICAgIF9sb29wKCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yLmYoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50YWcgPSB0YWc7XG4gICAgICBQcm9taXNlLmFsbChyZW5kZXJzKS50aGVuKGZ1bmN0aW9uICh2aWV3cykge1xuICAgICAgICByZXR1cm4gX3RoaXMyLnJlbmRlckNvbXBsZXRlKHZpZXdzKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5wYXJlbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2xpc3RSZW5kZXJlZCcsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBrZXk6IHRoaXMuc3ViUHJvcGVydHksXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5hcmdzLnZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlUmVuZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlUmVuZGVyKCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLnBhdXNlZCB8fCAhdGhpcy50YWcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmlld3MgPSBbXTtcbiAgICAgIHZhciBleGlzdGluZ1ZpZXdzID0gbmV3IF9TZXRNYXAuU2V0TWFwKCk7XG5cbiAgICAgIGZvciAodmFyIGkgaW4gdGhpcy52aWV3cykge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXMudmlld3NbaV07XG4gICAgICAgIHZhciByYXdWYWx1ZSA9IHZpZXcuYXJnc1t0aGlzLnN1YlByb3BlcnR5XTtcbiAgICAgICAgZXhpc3RpbmdWaWV3cy5hZGQocmF3VmFsdWUsIHZpZXcpO1xuICAgICAgICB2aWV3c1tpXSA9IHZpZXc7XG4gICAgICB9XG5cbiAgICAgIHZhciBmaW5hbFZpZXdzID0gW107XG4gICAgICB2YXIgZmluYWxWaWV3U2V0ID0gbmV3IFNldCgpO1xuICAgICAgdGhpcy5kb3duRGViaW5kLmxlbmd0aCAmJiB0aGlzLmRvd25EZWJpbmQuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICByZXR1cm4gZCAmJiBkKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudXBEZWJpbmQubGVuZ3RoICYmIHRoaXMudXBEZWJpbmQuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICByZXR1cm4gZCAmJiBkKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudXBEZWJpbmQubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMuZG93bkRlYmluZC5sZW5ndGggPSAwO1xuICAgICAgdmFyIG1pbktleSA9IEluZmluaXR5O1xuICAgICAgdmFyIGFudGVNaW5LZXkgPSBJbmZpbml0eTtcblxuICAgICAgdmFyIF9sb29wMiA9IGZ1bmN0aW9uIF9sb29wMihfaSkge1xuICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGsgPSBfaTtcblxuICAgICAgICBpZiAoaXNOYU4oaykpIHtcbiAgICAgICAgICBrID0gJ18nICsgX2k7XG4gICAgICAgIH0gZWxzZSBpZiAoU3RyaW5nKGspLmxlbmd0aCkge1xuICAgICAgICAgIGsgPSBOdW1iZXIoayk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXMzLmFyZ3MudmFsdWVbX2ldICE9PSB1bmRlZmluZWQgJiYgZXhpc3RpbmdWaWV3cy5oYXMoX3RoaXMzLmFyZ3MudmFsdWVbX2ldKSkge1xuICAgICAgICAgIHZhciBleGlzdGluZ1ZpZXcgPSBleGlzdGluZ1ZpZXdzLmdldE9uZShfdGhpczMuYXJncy52YWx1ZVtfaV0pO1xuXG4gICAgICAgICAgaWYgKGV4aXN0aW5nVmlldykge1xuICAgICAgICAgICAgZXhpc3RpbmdWaWV3LmFyZ3NbX3RoaXMzLmtleVByb3BlcnR5XSA9IF9pO1xuICAgICAgICAgICAgZmluYWxWaWV3c1trXSA9IGV4aXN0aW5nVmlldztcbiAgICAgICAgICAgIGZpbmFsVmlld1NldC5hZGQoZXhpc3RpbmdWaWV3KTtcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKCFpc05hTihrKSkge1xuICAgICAgICAgICAgICBtaW5LZXkgPSBNYXRoLm1pbihtaW5LZXksIGspO1xuICAgICAgICAgICAgICBrID4gMCAmJiAoYW50ZU1pbktleSA9IE1hdGgubWluKGFudGVNaW5LZXksIGspKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhpc3RpbmdWaWV3cy5yZW1vdmUoX3RoaXMzLmFyZ3MudmFsdWVbX2ldLCBleGlzdGluZ1ZpZXcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICB2YXIgdmlld0FyZ3MgPSB7fTtcblxuICAgICAgICAgIHZhciBfdmlldyA9IGZpbmFsVmlld3Nba10gPSBuZXcgX3RoaXMzLnZpZXdDbGFzcyh2aWV3QXJncywgX3RoaXMzLnBhcmVudCk7XG5cbiAgICAgICAgICBpZiAoIWlzTmFOKGspKSB7XG4gICAgICAgICAgICBtaW5LZXkgPSBNYXRoLm1pbihtaW5LZXksIGspO1xuICAgICAgICAgICAgayA+IDAgJiYgKGFudGVNaW5LZXkgPSBNYXRoLm1pbihhbnRlTWluS2V5LCBrKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZmluYWxWaWV3c1trXS50ZW1wbGF0ZSA9IF90aGlzMy50ZW1wbGF0ZTtcbiAgICAgICAgICBmaW5hbFZpZXdzW2tdLnZpZXdMaXN0ID0gX3RoaXMzO1xuICAgICAgICAgIGZpbmFsVmlld3Nba10uYXJnc1tfdGhpczMua2V5UHJvcGVydHldID0gX2k7XG4gICAgICAgICAgZmluYWxWaWV3c1trXS5hcmdzW190aGlzMy5zdWJQcm9wZXJ0eV0gPSBfdGhpczMuYXJncy52YWx1ZVtfaV07XG4gICAgICAgICAgX3RoaXMzLnVwRGViaW5kW2tdID0gdmlld0FyZ3MuYmluZFRvKF90aGlzMy5zdWJQcm9wZXJ0eSwgZnVuY3Rpb24gKHYsIGssIHQsIGQpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZpZXdBcmdzW190aGlzMy5rZXlQcm9wZXJ0eV07XG5cbiAgICAgICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBfdGhpczMuYXJncy52YWx1ZVtpbmRleF07XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3RoaXMzLmFyZ3MudmFsdWVbaW5kZXhdID0gdjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBfdGhpczMuZG93bkRlYmluZFtrXSA9IF90aGlzMy5zdWJBcmdzLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCwgZCkge1xuICAgICAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIHZpZXdBcmdzW2tdO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZXdBcmdzW2tdID0gdjtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciB1cERlYmluZCA9IGZ1bmN0aW9uIHVwRGViaW5kKCkge1xuICAgICAgICAgICAgX3RoaXMzLnVwRGViaW5kLmZpbHRlcihmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfdGhpczMudXBEZWJpbmQubGVuZ3RoID0gMDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIGRvd25EZWJpbmQgPSBmdW5jdGlvbiBkb3duRGViaW5kKCkge1xuICAgICAgICAgICAgX3RoaXMzLmRvd25EZWJpbmQuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICByZXR1cm4gZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF90aGlzMy5kb3duRGViaW5kLmxlbmd0aCA9IDA7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIF92aWV3Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzMy5fb25SZW1vdmUucmVtb3ZlKHVwRGViaW5kKTtcblxuICAgICAgICAgICAgX3RoaXMzLl9vblJlbW92ZS5yZW1vdmUoZG93bkRlYmluZCk7XG5cbiAgICAgICAgICAgIF90aGlzMy51cERlYmluZFtrXSAmJiBfdGhpczMudXBEZWJpbmRba10oKTtcbiAgICAgICAgICAgIF90aGlzMy5kb3duRGViaW5kW2tdICYmIF90aGlzMy5kb3duRGViaW5kW2tdKCk7XG4gICAgICAgICAgICBkZWxldGUgX3RoaXMzLnVwRGViaW5kW2tdO1xuICAgICAgICAgICAgZGVsZXRlIF90aGlzMy5kb3duRGViaW5kW2tdO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgX3RoaXMzLl9vblJlbW92ZS5hZGQodXBEZWJpbmQpO1xuXG4gICAgICAgICAgX3RoaXMzLl9vblJlbW92ZS5hZGQoZG93bkRlYmluZCk7XG5cbiAgICAgICAgICB2aWV3QXJnc1tfdGhpczMuc3ViUHJvcGVydHldID0gX3RoaXMzLmFyZ3MudmFsdWVbX2ldO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBfaSBpbiB0aGlzLmFyZ3MudmFsdWUpIHtcbiAgICAgICAgX2xvb3AyKF9pKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgX2kyIGluIHZpZXdzKSB7XG4gICAgICAgIGlmICghZmluYWxWaWV3U2V0Lmhhcyh2aWV3c1tfaTJdKSkge1xuICAgICAgICAgIHZpZXdzW19pMl0ucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5hcmdzLnZhbHVlKSkge1xuICAgICAgICB2YXIgbG9jYWxNaW4gPSBtaW5LZXkgPT09IDAgJiYgZmluYWxWaWV3c1sxXSAhPT0gdW5kZWZpbmVkICYmIGZpbmFsVmlld3MubGVuZ3RoID4gMSB8fCBhbnRlTWluS2V5ID09PSBJbmZpbml0eSA/IG1pbktleSA6IGFudGVNaW5LZXk7XG5cbiAgICAgICAgdmFyIHJlbmRlclJlY3Vyc2UgPSBmdW5jdGlvbiByZW5kZXJSZWN1cnNlKCkge1xuICAgICAgICAgIHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICAgICAgICAgIHZhciBpaSA9IGZpbmFsVmlld3MubGVuZ3RoIC0gaSAtIDE7XG5cbiAgICAgICAgICB3aGlsZSAoaWkgPiBsb2NhbE1pbiAmJiBmaW5hbFZpZXdzW2lpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpaS0tO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpaSA8IGxvY2FsTWluKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGZpbmFsVmlld3NbaWldID09PSBfdGhpczMudmlld3NbaWldKSB7XG4gICAgICAgICAgICBpZiAoZmluYWxWaWV3c1tpaV0gJiYgIWZpbmFsVmlld3NbaWldLmZpcnN0Tm9kZSkge1xuICAgICAgICAgICAgICBmaW5hbFZpZXdzW2lpXS5yZW5kZXIoX3RoaXMzLnRhZywgZmluYWxWaWV3c1tpaSArIDFdKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbmFsVmlld3NbaWldLnJlbmRlcmVkLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXJSZWN1cnNlKE51bWJlcihpKSArIDEpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChpICUgNTAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlclJlY3Vyc2UoTnVtYmVyKGkpICsgMSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhY2NlcHQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjZXB0KHJlbmRlclJlY3Vyc2UoTnVtYmVyKGkpICsgMSkpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaW5hbFZpZXdzW2lpXS5yZW5kZXIoX3RoaXMzLnRhZywgZmluYWxWaWV3c1tpaSArIDFdKTtcblxuICAgICAgICAgIF90aGlzMy52aWV3cy5zcGxpY2UoaWksIDAsIGZpbmFsVmlld3NbaWldKTtcblxuICAgICAgICAgIHJldHVybiBmaW5hbFZpZXdzW2lpXS5yZW5kZXJlZC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXJSZWN1cnNlKGkgKyAxKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlbmRlcmVkID0gcmVuZGVyUmVjdXJzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlbmRlcnMgPSBbXTtcbiAgICAgICAgdmFyIGxlZnRvdmVycyA9IE9iamVjdC5hc3NpZ24oe30sIGZpbmFsVmlld3MpO1xuXG4gICAgICAgIHZhciBpc0ludCA9IGZ1bmN0aW9uIGlzSW50KHgpIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoeCkgPT09IHggLSAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZmluYWxWaWV3cykuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgIGlmIChpc0ludChhKSAmJiBpc0ludChiKSkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguc2lnbihhIC0gYik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFpc0ludChhKSAmJiAhaXNJbnQoYikpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghaXNJbnQoYSkgJiYgaXNJbnQoYikpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNJbnQoYSkgJiYgIWlzSW50KGIpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBfaXRlcmF0b3IyID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoa2V5cyksXG4gICAgICAgICAgICBfc3RlcDI7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgX2xvb3AzID0gZnVuY3Rpb24gX2xvb3AzKCkge1xuICAgICAgICAgICAgdmFyIGkgPSBfc3RlcDIudmFsdWU7XG4gICAgICAgICAgICBkZWxldGUgbGVmdG92ZXJzW2ldO1xuXG4gICAgICAgICAgICBpZiAoZmluYWxWaWV3c1tpXS5maXJzdE5vZGUgJiYgZmluYWxWaWV3c1tpXSA9PT0gX3RoaXMzLnZpZXdzW2ldKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbmFsVmlld3NbaV0ucmVuZGVyKF90aGlzMy50YWcpO1xuICAgICAgICAgICAgcmVuZGVycy5wdXNoKGZpbmFsVmlld3NbaV0ucmVuZGVyZWQudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaW5hbFZpZXdzW2ldO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmb3IgKF9pdGVyYXRvcjIucygpOyAhKF9zdGVwMiA9IF9pdGVyYXRvcjIubigpKS5kb25lOykge1xuICAgICAgICAgICAgdmFyIF9yZXQgPSBfbG9vcDMoKTtcblxuICAgICAgICAgICAgaWYgKF9yZXQgPT09IFwiY29udGludWVcIikgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfaXRlcmF0b3IyLmUoZXJyKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBfaXRlcmF0b3IyLmYoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIF9pMyBpbiBsZWZ0b3ZlcnMpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5hcmdzLnZpZXdzW19pM107XG4gICAgICAgICAgbGVmdG92ZXJzLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IFByb21pc2UuYWxsKHJlbmRlcnMpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaTQgaW4gZmluYWxWaWV3cykge1xuICAgICAgICBpZiAoaXNOYU4oX2k0KSkge1xuICAgICAgICAgIGZpbmFsVmlld3NbX2k0XS5hcmdzW3RoaXMua2V5UHJvcGVydHldID0gX2k0LnN1YnN0cigxKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmFsVmlld3NbX2k0XS5hcmdzW3RoaXMua2V5UHJvcGVydHldID0gX2k0O1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXdzID0gQXJyYXkuaXNBcnJheSh0aGlzLmFyZ3MudmFsdWUpID8gW10uY29uY2F0KGZpbmFsVmlld3MpIDogZmluYWxWaWV3cztcbiAgICAgIGZpbmFsVmlld1NldC5jbGVhcigpO1xuICAgICAgdGhpcy53aWxsUmVSZW5kZXIgPSBmYWxzZTtcbiAgICAgIHRoaXMucGFyZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdsaXN0UmVuZGVyZWQnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAga2V5OiB0aGlzLnN1YlByb3BlcnR5LFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuYXJncy52YWx1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwYXVzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXVzZSgpIHtcbiAgICAgIHZhciBfcGF1c2UgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICAgIGZvciAodmFyIGkgaW4gdGhpcy52aWV3cykge1xuICAgICAgICB0aGlzLnZpZXdzW2ldLnBhdXNlKF9wYXVzZSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9uUmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uUmVtb3ZlKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLl9vblJlbW92ZS5hZGQoY2FsbGJhY2spO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnZpZXdzKSB7XG4gICAgICAgIHRoaXMudmlld3NbaV0ucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvblJlbW92ZSA9IHRoaXMuX29uUmVtb3ZlLml0ZW1zKCk7XG5cbiAgICAgIGZvciAodmFyIF9pNSBpbiBvblJlbW92ZSkge1xuICAgICAgICB0aGlzLl9vblJlbW92ZS5yZW1vdmUob25SZW1vdmVbX2k1XSk7XG5cbiAgICAgICAgb25SZW1vdmVbX2k1XSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2xlYW51cDtcblxuICAgICAgd2hpbGUgKHRoaXMuY2xlYW51cC5sZW5ndGgpIHtcbiAgICAgICAgY2xlYW51cCA9IHRoaXMuY2xlYW51cC5wb3AoKTtcbiAgICAgICAgY2xlYW51cCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICAgIHdoaWxlICh0aGlzLnRhZyAmJiB0aGlzLnRhZy5maXJzdENoaWxkKSB7XG4gICAgICAgIHRoaXMudGFnLnJlbW92ZUNoaWxkKHRoaXMudGFnLmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdWJBcmdzKSB7XG4gICAgICAgIF9CaW5kYWJsZS5CaW5kYWJsZS5jbGVhckJpbmRpbmdzKHRoaXMuc3ViQXJncyk7XG4gICAgICB9XG5cbiAgICAgIF9CaW5kYWJsZS5CaW5kYWJsZS5jbGVhckJpbmRpbmdzKHRoaXMuYXJncyk7XG5cbiAgICAgIGlmICh0aGlzLmFyZ3MudmFsdWUgJiYgIXRoaXMuYXJncy52YWx1ZS5pc0JvdW5kKCkpIHtcbiAgICAgICAgX0JpbmRhYmxlLkJpbmRhYmxlLmNsZWFyQmluZGluZ3ModGhpcy5hcmdzLnZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZW1vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVmlld0xpc3Q7XG59KCk7XG5cbmV4cG9ydHMuVmlld0xpc3QgPSBWaWV3TGlzdDtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9taXhpbi9FdmVudFRhcmdldE1peGluLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5FdmVudFRhcmdldE1peGluID0gdm9pZCAwO1xuXG52YXIgX01peGluID0gcmVxdWlyZShcIi4uL2Jhc2UvTWl4aW5cIik7XG5cbnZhciBfRXZlbnRUYXJnZXRNaXhpbjtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIF9FdmVudFRhcmdldCA9IFN5bWJvbCgnVGFyZ2V0Jyk7XG5cbnZhciBFdmVudFRhcmdldE1peGluID0gKF9FdmVudFRhcmdldE1peGluID0ge30sIF9kZWZpbmVQcm9wZXJ0eShfRXZlbnRUYXJnZXRNaXhpbiwgX01peGluLk1peGluLkNvbnN0cnVjdG9yLCBmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgdGhpc1tfRXZlbnRUYXJnZXRdID0gbmV3IEV2ZW50VGFyZ2V0KCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhpc1tfRXZlbnRUYXJnZXRdID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICB9XG59KSwgX2RlZmluZVByb3BlcnR5KF9FdmVudFRhcmdldE1peGluLCBcImRpc3BhdGNoRXZlbnRcIiwgZnVuY3Rpb24gZGlzcGF0Y2hFdmVudCgpIHtcbiAgdmFyIF90aGlzJF9FdmVudFRhcmdldDtcblxuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIGV2ZW50ID0gYXJnc1swXTtcblxuICBpZiAodHlwZW9mIGV2ZW50ID09PSAnc3RyaW5nJykge1xuICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50KTtcbiAgICBhcmdzWzBdID0gZXZlbnQ7XG4gIH1cblxuICAoX3RoaXMkX0V2ZW50VGFyZ2V0ID0gdGhpc1tfRXZlbnRUYXJnZXRdKS5kaXNwYXRjaEV2ZW50LmFwcGx5KF90aGlzJF9FdmVudFRhcmdldCwgYXJncyk7XG5cbiAgdmFyIGRlZmF1bHRIYW5kbGVyID0gXCJvblwiLmNvbmNhdChldmVudC50eXBlWzBdLnRvVXBwZXJDYXNlKCkgKyBldmVudC50eXBlLnNsaWNlKDEpKTtcblxuICBpZiAodHlwZW9mIHRoaXNbZGVmYXVsdEhhbmRsZXJdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpc1tkZWZhdWx0SGFuZGxlcl0oZXZlbnQpO1xuICB9XG5cbiAgcmV0dXJuIGV2ZW50LnJldHVyblZhbHVlO1xufSksIF9kZWZpbmVQcm9wZXJ0eShfRXZlbnRUYXJnZXRNaXhpbiwgXCJhZGRFdmVudExpc3RlbmVyXCIsIGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIoKSB7XG4gIHZhciBfdGhpcyRfRXZlbnRUYXJnZXQyO1xuXG4gIChfdGhpcyRfRXZlbnRUYXJnZXQyID0gdGhpc1tfRXZlbnRUYXJnZXRdKS5hZGRFdmVudExpc3RlbmVyLmFwcGx5KF90aGlzJF9FdmVudFRhcmdldDIsIGFyZ3VtZW50cyk7XG59KSwgX2RlZmluZVByb3BlcnR5KF9FdmVudFRhcmdldE1peGluLCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIiwgZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHtcbiAgdmFyIF90aGlzJF9FdmVudFRhcmdldDM7XG5cbiAgKF90aGlzJF9FdmVudFRhcmdldDMgPSB0aGlzW19FdmVudFRhcmdldF0pLnJlbW92ZUV2ZW50TGlzdGVuZXIuYXBwbHkoX3RoaXMkX0V2ZW50VGFyZ2V0MywgYXJndW1lbnRzKTtcbn0pLCBfRXZlbnRUYXJnZXRNaXhpbik7XG5leHBvcnRzLkV2ZW50VGFyZ2V0TWl4aW4gPSBFdmVudFRhcmdldE1peGluO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL21peGluL1Byb21pc2VNaXhpbi5qc1wiLCBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUpIHtcbiAgcmVxdWlyZSA9IF9fbWFrZVJlbGF0aXZlUmVxdWlyZShyZXF1aXJlLCB7fSwgXCJjdXJ2YXR1cmVcIik7XG4gIChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuUHJvbWlzZU1peGluID0gdm9pZCAwO1xuXG52YXIgX01peGluID0gcmVxdWlyZShcIi4uL2Jhc2UvTWl4aW5cIik7XG5cbnZhciBfUHJvbWlzZU1peGluO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgX1Byb21pc2UgPSBTeW1ib2woJ1Byb21pc2UnKTtcblxudmFyIEFjY2VwdCA9IFN5bWJvbCgnQWNjZXB0Jyk7XG52YXIgUmVqZWN0ID0gU3ltYm9sKCdSZWplY3QnKTtcbnZhciBQcm9taXNlTWl4aW4gPSAoX1Byb21pc2VNaXhpbiA9IHt9LCBfZGVmaW5lUHJvcGVydHkoX1Byb21pc2VNaXhpbiwgX01peGluLk1peGluLkNvbnN0cnVjdG9yLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgdGhpc1tfUHJvbWlzZV0gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYWNjZXB0LCByZWplY3QpIHtcbiAgICBfdGhpc1tBY2NlcHRdID0gYWNjZXB0O1xuICAgIF90aGlzW1JlamVjdF0gPSByZWplY3Q7XG4gIH0pO1xufSksIF9kZWZpbmVQcm9wZXJ0eShfUHJvbWlzZU1peGluLCBcInRoZW5cIiwgZnVuY3Rpb24gdGhlbigpIHtcbiAgdmFyIF90aGlzJF9Qcm9taXNlO1xuXG4gIHJldHVybiAoX3RoaXMkX1Byb21pc2UgPSB0aGlzW19Qcm9taXNlXSkudGhlbi5hcHBseShfdGhpcyRfUHJvbWlzZSwgYXJndW1lbnRzKTtcbn0pLCBfZGVmaW5lUHJvcGVydHkoX1Byb21pc2VNaXhpbiwgXCJjYXRjaFwiLCBmdW5jdGlvbiBfY2F0Y2goKSB7XG4gIHZhciBfdGhpcyRfUHJvbWlzZTI7XG5cbiAgcmV0dXJuIChfdGhpcyRfUHJvbWlzZTIgPSB0aGlzW19Qcm9taXNlXSlbXCJjYXRjaFwiXS5hcHBseShfdGhpcyRfUHJvbWlzZTIsIGFyZ3VtZW50cyk7XG59KSwgX2RlZmluZVByb3BlcnR5KF9Qcm9taXNlTWl4aW4sIFwiZmluYWxseVwiLCBmdW5jdGlvbiBfZmluYWxseSgpIHtcbiAgdmFyIF90aGlzJF9Qcm9taXNlMztcblxuICByZXR1cm4gKF90aGlzJF9Qcm9taXNlMyA9IHRoaXNbX1Byb21pc2VdKVtcImZpbmFsbHlcIl0uYXBwbHkoX3RoaXMkX1Byb21pc2UzLCBhcmd1bWVudHMpO1xufSksIF9Qcm9taXNlTWl4aW4pO1xuZXhwb3J0cy5Qcm9taXNlTWl4aW4gPSBQcm9taXNlTWl4aW47XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvbWlzZU1peGluLCAnUmVqZWN0Jywge1xuICB2YWx1ZTogUmVqZWN0XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9taXNlTWl4aW4sICdBY2NlcHQnLCB7XG4gIHZhbHVlOiBBY2NlcHRcbn0pO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL3NlcnZpY2UvU2VydmljZS5qc1wiLCBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUpIHtcbiAgcmVxdWlyZSA9IF9fbWFrZVJlbGF0aXZlUmVxdWlyZShyZXF1aXJlLCB7fSwgXCJjdXJ2YXR1cmVcIik7XG4gIChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuU2VydmljZSA9IHZvaWQgMDtcblxudmFyIF9Sb3V0ZXIgPSByZXF1aXJlKFwiLi4vYmFzZS9Sb3V0ZXJcIik7XG5cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBpZiAoZW51bWVyYWJsZU9ubHkpIHsgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pOyB9IGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTsgaWYgKGkgJSAyKSB7IG93bktleXMoT2JqZWN0KHNvdXJjZSksIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSk7IH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHsgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTsgfSBlbHNlIHsgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpOyB9KTsgfSB9IHJldHVybiB0YXJnZXQ7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lKSB7IHRocm93IF9lOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMjsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBTZXJ2aWNlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2VydmljZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2VydmljZSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU2VydmljZSwgbnVsbCwgW3tcbiAgICBrZXk6IFwicmVnaXN0ZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgc2NyaXB0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnL3RpbWUtc2VydmljZS5qcyc7XG4gICAgICB2YXIgc2NvcGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICcvJztcblxuICAgICAgaWYgKCEoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdTZXJ2aWNlIFdvcmtlcnMgbm90IHN1cHBvcnRlZC4nKTtcbiAgICAgIH0gLy8gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuc3RhcnRNZXNzYWdlcygpO1xuXG5cbiAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmhhbmRsZVJlc3BvbnNlKGV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc2NyaXB0LCB7XG4gICAgICAgIHNjb3BlOiBzY29wZVxuICAgICAgfSk7XG4gICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWFkeS50aGVuKGZ1bmN0aW9uIChyZWdpc3RyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLndvcmtlciA9IHJlZ2lzdHJhdGlvbi5hY3RpdmU7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWFkeTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVxdWVzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXF1ZXN0KF9yZWYpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgY29tbWFuZCA9IF9yZWYuY29tbWFuZCxcbiAgICAgICAgICBhcmdzID0gX3JlZi5hcmdzLFxuICAgICAgICAgIGVjaG8gPSBfcmVmLmVjaG8sXG4gICAgICAgICAgbm90aWZ5ID0gX3JlZi5ub3RpZnk7XG4gICAgICB2YXIgY29ycmVsYXRpb25JZCA9IE51bWJlcigxIC8gTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xuICAgICAgdmFyIGdldFJlc3BvbnNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKGFjY2VwdCkge1xuICAgICAgICBfdGhpczIuaW5jb21wbGV0ZS5zZXQoY29ycmVsYXRpb25JZCwgYWNjZXB0KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgICBicm9hZGNhc3Q6IGZhbHNlLFxuICAgICAgICBjb3JyZWxhdGlvbklkOiBjb3JyZWxhdGlvbklkLFxuICAgICAgICBjb21tYW5kOiBjb21tYW5kLFxuICAgICAgICBub3RpZnk6IG5vdGlmeSxcbiAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgZWNobzogZWNob1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZ2V0UmVzcG9uc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImJyb2FkY2FzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBicm9hZGNhc3QoX3JlZjIpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICB2YXIgY29tbWFuZCA9IF9yZWYyLmNvbW1hbmQsXG4gICAgICAgICAgYXJncyA9IF9yZWYyLmFyZ3MsXG4gICAgICAgICAgZWNobyA9IF9yZWYyLmVjaG8sXG4gICAgICAgICAgbm90aWZ5ID0gX3JlZjIubm90aWZ5O1xuICAgICAgdmFyIGNvcnJlbGF0aW9uSWQgPSBOdW1iZXIoMSAvIE1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KTtcbiAgICAgIHZhciBnZXRSZXNwb25zZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhY2NlcHQpIHtcbiAgICAgICAgX3RoaXMzLmluY29tcGxldGUuc2V0KGNvcnJlbGF0aW9uSWQsIGFjY2VwdCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgYnJvYWRjYXN0OiB0cnVlLFxuICAgICAgICBjb3JyZWxhdGlvbklkOiBjb3JyZWxhdGlvbklkLFxuICAgICAgICBjb21tYW5kOiBjb21tYW5kLFxuICAgICAgICBub3RpZnk6IG5vdGlmeSxcbiAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgZWNobzogZWNob1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZ2V0UmVzcG9uc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZVJlc3BvbnNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlKGV2ZW50KSB7XG4gICAgICB2YXIgcGFja2V0ID0gZXZlbnQuZGF0YTtcblxuICAgICAgaWYgKCFwYWNrZXQuY29ycmVsYXRpb25JZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5pbmNvbXBsZXRlLmhhcyhwYWNrZXQuY29ycmVsYXRpb25JZCkpIHtcbiAgICAgICAgaWYgKHBhY2tldC5icm9hZGNhc3QpIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUJyb2FkY2FzdChldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBnZXRSZXNwb25zZSA9IHRoaXMuaW5jb21wbGV0ZS5nZXQocGFja2V0LmNvcnJlbGF0aW9uSWQpO1xuICAgICAgdGhpcy5pbmNvbXBsZXRlW1wiZGVsZXRlXCJdKHBhY2tldC5jb3JyZWxhdGlvbklkKTtcbiAgICAgIGdldFJlc3BvbnNlKHBhY2tldC5yZXN1bHQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVSZXF1ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QoZXZlbnQpIHtcbiAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICB2YXIgcGFja2V0ID0gZXZlbnQuZGF0YTtcbiAgICAgIHZhciBnZXRSZXNwb25zZSA9IFByb21pc2UucmVzb2x2ZSgnVW5leHBlY3RlZCByZXF1ZXN0LicpO1xuXG4gICAgICBpZiAocGFja2V0LmVjaG8pIHtcbiAgICAgICAgZ2V0UmVzcG9uc2UgPSBQcm9taXNlLnJlc29sdmUocGFja2V0LmVjaG8pO1xuICAgICAgfSBlbHNlIGlmIChwYWNrZXQubm90aWZ5KSB7XG4gICAgICAgIHZhciBhcmdzID0gcGFja2V0LmFyZ3MgfHwgW107XG4gICAgICAgIGdldFJlc3BvbnNlID0gZ2xvYmFsVGhpcy5yZWdpc3RyYXRpb24uZ2V0Tm90aWZpY2F0aW9ucygpLnRoZW4oZnVuY3Rpb24gKG5vdGlmeUxpc3QpIHtcbiAgICAgICAgICB2YXIgX2dsb2JhbFRoaXMkcmVnaXN0cmF0O1xuXG4gICAgICAgICAgbm90aWZ5TGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczQubm90aWZpY2F0aW9ucy5zZXQobm90aWZpY2F0aW9uLnRhZywgbm90aWZpY2F0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gKF9nbG9iYWxUaGlzJHJlZ2lzdHJhdCA9IGdsb2JhbFRoaXMucmVnaXN0cmF0aW9uKS5zaG93Tm90aWZpY2F0aW9uLmFwcGx5KF9nbG9iYWxUaGlzJHJlZ2lzdHJhdCwgX3RvQ29uc3VtYWJsZUFycmF5KGFyZ3MpKTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGdsb2JhbFRoaXMucmVnaXN0cmF0aW9uLmdldE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobm90aWZ5TGlzdCkge1xuICAgICAgICAgIHZhciB0YWcgPSBldmVudC5kYXRhLmFyZ3MgJiYgZXZlbnQuZGF0YS5hcmdzWzFdICYmIGV2ZW50LmRhdGEuYXJnc1sxXS50YWc7XG4gICAgICAgICAgdmFyIG5vdGlmeUNsaWVudCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhY2NlcHQpIHtcbiAgICAgICAgICAgIHZhciBub3RpZmllcnM7XG5cbiAgICAgICAgICAgIGlmIChfdGhpczQubm90aWZ5Q2xpZW50cy5oYXModGFnKSkge1xuICAgICAgICAgICAgICBub3RpZmllcnMgPSBfdGhpczQubm90aWZ5Q2xpZW50cy5nZXQodGFnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5vdGlmaWVycyA9IG5ldyBNYXAoKTtcblxuICAgICAgICAgICAgICBfdGhpczQubm90aWZ5Q2xpZW50cy5zZXQodGFnLCBub3RpZmllcnMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBub3RpZmllcnMuc2V0KGV2ZW50LnNvdXJjZSwgYWNjZXB0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gbm90aWZ5Q2xpZW50O1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAocGFja2V0LmNvbW1hbmQpIHtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSBwYWNrZXQuY29tbWFuZDtcblxuICAgICAgICB2YXIgX2FyZ3MgPSBwYWNrZXQuYXJncyB8fCBbXTtcblxuICAgICAgICB2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5zZXJ2aWNlSGFuZGxlcnMpLFxuICAgICAgICAgICAgX3N0ZXA7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKF9pdGVyYXRvci5zKCk7ICEoX3N0ZXAgPSBfaXRlcmF0b3IubigpKS5kb25lOykge1xuICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSBfc3RlcC52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyW2NvbW1hbmRdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGdldFJlc3BvbnNlID0gaGFuZGxlcltjb21tYW5kXS5hcHBseShoYW5kbGVyLCBfdG9Db25zdW1hYmxlQXJyYXkoX2FyZ3MpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfaXRlcmF0b3IuZShlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIF9pdGVyYXRvci5mKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKF90eXBlb2YoZ2V0UmVzcG9uc2UpICE9PSBQcm9taXNlKSB7XG4gICAgICAgIGdldFJlc3BvbnNlID0gUHJvbWlzZS5yZXNvbHZlKGdldFJlc3BvbnNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhY2tldC5icm9hZGNhc3QpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgdHlwZTogJ3dpbmRvdycsXG4gICAgICAgICAgaW5jbHVkZVVuY29udHJvbGxlZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICB2YXIgc291cmNlID0gZXZlbnQuc291cmNlLmlkO1xuICAgICAgICBnbG9iYWxUaGlzLmNsaWVudHMubWF0Y2hBbGwob3B0aW9ucykudGhlbihmdW5jdGlvbiAoY2xpZW50TGlzdCkge1xuICAgICAgICAgIGNsaWVudExpc3QuZm9yRWFjaChmdW5jdGlvbiAoY2xpZW50KSB7XG4gICAgICAgICAgICBnZXRSZXNwb25zZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2xpZW50LnBvc3RNZXNzYWdlKF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgcGFja2V0KSwge30sIHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlXG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdldFJlc3BvbnNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgcmV0dXJuIGV2ZW50LnNvdXJjZS5wb3N0TWVzc2FnZShfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHBhY2tldCksIHt9LCB7XG4gICAgICAgICAgICByZXN1bHQ6IHJlc3BvbnNlXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlSW5zdGFsbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVJbnN0YWxsKGV2ZW50KSB7XG4gICAgICBnbG9iYWxUaGlzLnNraXBXYWl0aW5nKCk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3IyID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5wYWdlSGFuZGxlcnMpLFxuICAgICAgICAgIF9zdGVwMjtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IyLnMoKTsgIShfc3RlcDIgPSBfaXRlcmF0b3IyLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgaGFuZGxlciA9IF9zdGVwMi52YWx1ZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlci5oYW5kbGVJbnN0YWxsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBoYW5kbGVyLmhhbmRsZUluc3RhbGwoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjIuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yMi5mKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZUFjdGl2YXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUFjdGl2YXRlKGV2ZW50KSB7XG4gICAgICB2YXIgX2l0ZXJhdG9yMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMucGFnZUhhbmRsZXJzKSxcbiAgICAgICAgICBfc3RlcDM7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMy5zKCk7ICEoX3N0ZXAzID0gX2l0ZXJhdG9yMy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGhhbmRsZXIgPSBfc3RlcDMudmFsdWU7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIuaGFuZGxlQWN0aXZhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGhhbmRsZXIuaGFuZGxlQWN0aXZhdGUoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjMuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yMy5mKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZUVycm9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUVycm9yKGV2ZW50KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGV2ZW50KTtcblxuICAgICAgdmFyIF9pdGVyYXRvcjQgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLnBhZ2VIYW5kbGVycyksXG4gICAgICAgICAgX3N0ZXA0O1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjQucygpOyAhKF9zdGVwNCA9IF9pdGVyYXRvcjQubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBoYW5kbGVyID0gX3N0ZXA0LnZhbHVlO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyLmhhbmRsZUVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBoYW5kbGVyLmhhbmRsZUVycm9yKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3I0LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjQuZigpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVQdXNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZVB1c2goZXZlbnQpIHsvLyBjb25zb2xlLmxvZygncHVzaCcsIGV2ZW50KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlU3luY1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVTeW5jKGV2ZW50KSB7Ly8gY29uc29sZS5sb2coJ3N5bmMnLCBldmVudCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZVBlcmlvZGljU3luY1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVQZXJpb2RpY1N5bmMoZXZlbnQpIHsvLyBjb25zb2xlLmxvZygncGVyaW9kaWMgc3luYycsIGV2ZW50KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlRmV0Y2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlRmV0Y2goZXZlbnQpIHtcbiAgICAgIHZhciBfaXRlcmF0b3I1ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5wYWdlSGFuZGxlcnMpLFxuICAgICAgICAgIF9zdGVwNTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3I1LnMoKTsgIShfc3RlcDUgPSBfaXRlcmF0b3I1Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgaGFuZGxlciA9IF9zdGVwNS52YWx1ZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlci5oYW5kbGVGZXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaGFuZGxlci5oYW5kbGVGZXRjaChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yNS5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3I1LmYoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgdXJsID0gbmV3IFVSTChldmVudC5yZXF1ZXN0LnVybCk7XG4gICAgICB2YXIgcGF0aCA9IHVybC5wYXRobmFtZSArIHVybC5zZWFyY2g7XG5cbiAgICAgIHZhciBfaXRlcmF0b3I2ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5zZXJ2aWNlSGFuZGxlcnMpLFxuICAgICAgICAgIF9zdGVwNjtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3I2LnMoKTsgIShfc3RlcDYgPSBfaXRlcmF0b3I2Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgX2hhbmRsZXIgPSBfc3RlcDYudmFsdWU7XG4gICAgICAgICAgdmFyIHJvdXRlcyA9IF9oYW5kbGVyLnJvdXRlcztcblxuICAgICAgICAgIGlmICghcm91dGVzKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfUm91dGVyLlJvdXRlci5tYXRjaCh1cmwucGF0aG5hbWUsIHtcbiAgICAgICAgICAgIHJvdXRlczogcm91dGVzXG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudC5yZXNwb25kV2l0aChuZXcgUmVzcG9uc2UocmVzdWx0KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3I2LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjYuZigpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVCcm9hZGNhc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlQnJvYWRjYXN0KGV2ZW50KSB7XG4gICAgICB2YXIgX2l0ZXJhdG9yNyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMucGFnZUhhbmRsZXJzKSxcbiAgICAgICAgICBfc3RlcDc7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yNy5zKCk7ICEoX3N0ZXA3ID0gX2l0ZXJhdG9yNy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGhhbmRsZXIgPSBfc3RlcDcudmFsdWU7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIuaGFuZGxlQnJvYWRjYXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBoYW5kbGVyLmhhbmRsZUJyb2FkY2FzdChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yNy5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3I3LmYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibm90aWZ5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5vdGlmeSh0aXRsZSkge1xuICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgIG9wdGlvbnMudGFnID0gb3B0aW9ucy50YWcgfHwgKFsxZTddICsgLTFlMyArIC00ZTMgKyAtOGUzICsgLTFlMTEpLnJlcGxhY2UoL1swMThdL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHJldHVybiAoYyBeIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoMSkpWzBdICYgMTUgPj4gYyAvIDQpLnRvU3RyaW5nKDE2KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhY2NlcHQsIHJlamVjdCkge1xuICAgICAgICBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGFjY2VwdChyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gX3RoaXM1LnJlcXVlc3Qoe1xuICAgICAgICAgIG5vdGlmeTogdHJ1ZSxcbiAgICAgICAgICBhcmdzOiBbdGl0bGUsIG9wdGlvbnNdXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZU5vdGlmeUNsaWNrZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlTm90aWZ5Q2xpY2tlZChldmVudCkge1xuICAgICAgaWYgKHRoaXMubm90aWZ5Q2xpZW50cy5oYXMoZXZlbnQubm90aWZpY2F0aW9uLnRhZykpIHtcbiAgICAgICAgdmFyIG5vdGlmaWVycyA9IHRoaXMubm90aWZ5Q2xpZW50cy5nZXQoZXZlbnQubm90aWZpY2F0aW9uLnRhZyk7XG4gICAgICAgIHZhciBmb2N1c2FibGVzID0gW107XG4gICAgICAgIG5vdGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChub3RpZmllciwgY2xpZW50KSB7XG4gICAgICAgICAgbm90aWZpZXIoe1xuICAgICAgICAgICAgYWN0aW9uOiBldmVudC5hY3Rpb24sXG4gICAgICAgICAgICBkYXRhOiBldmVudC5ub3RpZmljYXRpb24uZGF0YSxcbiAgICAgICAgICAgIGNsaWNrOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGltZTogZXZlbnQubm90aWZpY2F0aW9uLnRpbWVzdGFtcCxcbiAgICAgICAgICAgIHRhZzogZXZlbnQubm90aWZpY2F0aW9uLnRhZ1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZvY3VzYWJsZXMucHVzaChjbGllbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB3aGlsZSAoZm9jdXNhYmxlcy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgY2xpZW50ID0gZm9jdXNhYmxlcy5wb3AoKTtcblxuICAgICAgICAgIGlmIChjbGllbnQuZm9jdXMoKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub3RpZnlDbGllbnRzW1wiZGVsZXRlXCJdKGV2ZW50Lm5vdGlmaWNhdGlvbi50YWcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2l0ZXJhdG9yOCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMucGFnZUhhbmRsZXJzKSxcbiAgICAgICAgICBfc3RlcDg7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yOC5zKCk7ICEoX3N0ZXA4ID0gX2l0ZXJhdG9yOC5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGhhbmRsZXIgPSBfc3RlcDgudmFsdWU7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIuaGFuZGxlTm90aWZ5Q2xpY2tlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaGFuZGxlci5oYW5kbGVOb3RpZnlDbGlja2VkKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3I4LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjguZigpO1xuICAgICAgfVxuXG4gICAgICBldmVudC5ub3RpZmljYXRpb24uY2xvc2UoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlTm90aWZ5Q2xvc2VkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZU5vdGlmeUNsb3NlZChldmVudCkge1xuICAgICAgaWYgKHRoaXMubm90aWZ5Q2xpZW50cy5oYXMoZXZlbnQubm90aWZpY2F0aW9uLnRhZykpIHtcbiAgICAgICAgdmFyIG5vdGlmaWVycyA9IHRoaXMubm90aWZ5Q2xpZW50cy5nZXQoZXZlbnQubm90aWZpY2F0aW9uLnRhZyk7XG4gICAgICAgIG5vdGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChub3RpZmllcikge1xuICAgICAgICAgIHJldHVybiBub3RpZmllcih7XG4gICAgICAgICAgICBhY3Rpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRhdGE6IGV2ZW50Lm5vdGlmaWNhdGlvbi5kYXRhLFxuICAgICAgICAgICAgY2xvc2U6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lOiBldmVudC5ub3RpZmljYXRpb24udGltZXN0YW1wLFxuICAgICAgICAgICAgdGFnOiBldmVudC5ub3RpZmljYXRpb24udGFnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5ub3RpZnlDbGllbnRzW1wiZGVsZXRlXCJdKGV2ZW50Lm5vdGlmaWNhdGlvbi50YWcpKSB7XG4gICAgICAgIHZhciBfaXRlcmF0b3I5ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5wYWdlSGFuZGxlcnMpLFxuICAgICAgICAgICAgX3N0ZXA5O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yIChfaXRlcmF0b3I5LnMoKTsgIShfc3RlcDkgPSBfaXRlcmF0b3I5Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGVyID0gX3N0ZXA5LnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIuaGFuZGxlTm90aWZ5RGlzbWlzc2VkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGhhbmRsZXIuaGFuZGxlTm90aWZ5RGlzbWlzc2VkKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIF9pdGVyYXRvcjkuZShlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIF9pdGVyYXRvcjkuZigpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBfaXRlcmF0b3IxMCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMucGFnZUhhbmRsZXJzKSxcbiAgICAgICAgICBfc3RlcDEwO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjEwLnMoKTsgIShfc3RlcDEwID0gX2l0ZXJhdG9yMTAubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBfaGFuZGxlcjIgPSBfc3RlcDEwLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBfaGFuZGxlcjIuaGFuZGxlTm90aWZ5Q2xvc2VkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBfaGFuZGxlcjIuaGFuZGxlTm90aWZ5Q2xvc2VkKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IxMC5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IxMC5mKCk7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNlcnZpY2U7XG59KCk7XG5cbmV4cG9ydHMuU2VydmljZSA9IFNlcnZpY2U7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU2VydmljZSwgJ3NlcnZpY2VIYW5kbGVycycsIHtcbiAgdmFsdWU6IG5ldyBTZXQoKVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU2VydmljZSwgJ3BhZ2VIYW5kbGVycycsIHtcbiAgdmFsdWU6IG5ldyBTZXQoKVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU2VydmljZSwgJ2luY29tcGxldGUnLCB7XG4gIHZhbHVlOiBuZXcgTWFwKClcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNlcnZpY2UsICdub3RpZmljYXRpb25zJywge1xuICB2YWx1ZTogbmV3IE1hcCgpXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXJ2aWNlLCAnbm90aWZ5Q2xpZW50cycsIHtcbiAgdmFsdWU6IG5ldyBNYXAoKVxufSk7XG4gIH0pKCk7XG59KTsiLCJleHBvcnQgY2xhc3MgUGFnZUhhbmRsZXJcbntcblx0c3RhdGljIGhhbmRsZUJyb2FkY2FzdChldmVudClcblx0e1xuXHRcdGNvbnNvbGUubG9nKCdCcm9hZGNhc3Q6ICcgKyBKU09OLnN0cmluZ2lmeShldmVudC5kYXRhLnJlc3VsdCkpO1xuXHR9XG5cblx0c3RhdGljIGhhbmRsZUluc3RhbGwoZXZlbnQpXG5cdHtcblx0XHQvLyBjb25zb2xlLnRyYWNlKCdpbnN0YWxsJywgZXZlbnQpO1xuXHR9XG5cblx0c3RhdGljIGhhbmRsZUFjdGl2YXRlKGV2ZW50KVxuXHR7XG5cdFx0Y29uc29sZS50cmFjZSgnYWN0aXZhdGUnLCBldmVudCk7XG5cdH1cblxuXHRzdGF0aWMgaGFuZGxlRXJyb3IoZXZlbnQpXG5cdHtcblx0XHRjb25zb2xlLnRyYWNlKCdlcnJvcicsIGV2ZW50KTtcblx0fVxuXG5cdHN0YXRpYyBoYW5kbGVOb3RpZnlDbGlja2VkKGV2ZW50KVxuXHR7XG5cdFx0Y29uc29sZS50cmFjZSgnbm90aWZ5Q2xpY2tlZCcsIGV2ZW50KTtcblx0fVxuXG5cdHN0YXRpYyBoYW5kbGVOb3RpZnlDbG9zZWQoZXZlbnQpXG5cdHtcblx0XHQvLyBjb25zb2xlLnRyYWNlKCdub3RpZnlDbG9zZWQnLCBldmVudCk7XG5cdH1cblxuXHRzdGF0aWMgaGFuZGxlTm90aWZ5RGlzbWlzc2VkKGV2ZW50KVxuXHR7XG5cdFx0Ly8gY29uc29sZS50cmFjZSgnbm90aWZ5RGlzbWlzc2VkJywgZXZlbnQpO1xuXHR9XG5cblx0c3RhdGljIGhhbmRsZUZldGNoKGV2ZW50KVxuXHR7XG5cdFx0Ly8gY29uc29sZS50cmFjZSgnZmV0Y2gnLCBldmVudCk7XG5cdH1cbn0iLCJleHBvcnQgY2xhc3MgU2VydmljZUhhbmRsZXJcbntcblx0c3RhdGljIHJvdXRlcyA9IHtcblx0XHQvLyAnJzogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCdpbmRleCEhIScpXG5cdFx0J290aGVyJzogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCdvdGhlciEhIScpXG5cdFx0Ly8gLCAnYXJnLyVuYW1lZCc6IGFyZ3MgPT4gUHJvbWlzZS5yZXNvbHZlKEpTT04uc3RyaW5naWZ5KGFyZ3MpKVxuXHRcdC8vICwgJyonOiBhcmdzID0+IFByb21pc2UucmVzb2x2ZShKU09OLnN0cmluZ2lmeShhcmdzKSlcblx0fTtcblxuXHRzdGF0aWMgZ2V0VGltZSgpXG5cdHtcblx0XHRyZXR1cm4gU3RyaW5nKG5ldyBEYXRlKTtcblx0fVxuXG5cdHN0YXRpYyBiZWVSZXF1ZXN0KClcblx0e1xuXHRcdHJldHVybiBmZXRjaCgnaHR0cHM6Ly9zZWFubS5mcmVlLmJlZWNlcHRvci5jb20vJylcblx0XHQudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpO1xuXHR9XG59IiwiZ2xvYmFsVGhpcy53aW5kb3cgPSB7bG9jYXRpb246e3JlbG9hZDogKCkgPT4ge319fTtcblxuaW1wb3J0U2NyaXB0cyggXCIvdmVuZG9yLmpzXCIgKTtcbmltcG9ydFNjcmlwdHMoIFwiL2FwcC5qc1wiICk7XG5cbmltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICdjdXJ2YXR1cmUvc2VydmljZS9TZXJ2aWNlJztcblxuaW1wb3J0IHsgU2VydmljZUhhbmRsZXIgfSBmcm9tICcuL1NlcnZpY2VIYW5kbGVyJztcbmltcG9ydCB7IFBhZ2VIYW5kbGVyICAgIH0gZnJvbSAnLi9QYWdlSGFuZGxlcic7XG5cblNlcnZpY2Uuc2VydmljZUhhbmRsZXJzLmFkZCggU2VydmljZUhhbmRsZXIgKTtcblNlcnZpY2UucGFnZUhhbmRsZXJzLmFkZCggUGFnZUhhbmRsZXIgKTtcblxuZ2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKCdpbnN0YWxsJywgIGV2ZW50ID0+IFNlcnZpY2UuaGFuZGxlSW5zdGFsbChldmVudCkpO1xuZ2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKCdhY3RpdmF0ZScsIGV2ZW50ID0+IFNlcnZpY2UuaGFuZGxlQWN0aXZhdGUoZXZlbnQpKTtcbmdsb2JhbFRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAgICBldmVudCA9PiBTZXJ2aWNlLmhhbmRsZUFjdGl2YXRlKGV2ZW50KSk7XG5cbmdsb2JhbFRoaXMuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGV2ZW50ID0+IFNlcnZpY2UuaGFuZGxlUmVxdWVzdChldmVudCkpO1xuZ2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKCdmZXRjaCcsICAgZXZlbnQgPT4gU2VydmljZS5oYW5kbGVGZXRjaChldmVudCkpO1xuZ2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKCdwdXNoJywgICAgZXZlbnQgPT4gU2VydmljZS5oYW5kbGVQdXNoKGV2ZW50KSk7XG5cbmdsb2JhbFRoaXMuYWRkRXZlbnRMaXN0ZW5lcignbm90aWZpY2F0aW9uY2xvc2UnLCBldmVudCA9PiBTZXJ2aWNlLmhhbmRsZU5vdGlmeUNsb3NlZChldmVudCkpO1xuZ2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKCdub3RpZmljYXRpb25jbGljaycsIGV2ZW50ID0+IFNlcnZpY2UuaGFuZGxlTm90aWZ5Q2xpY2tlZChldmVudCkpO1xuXG5nbG9iYWxUaGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3N5bmMnLCAgICAgICAgIGV2ZW50ID0+IFNlcnZpY2UuaGFuZGxlU3luYyhldmVudCkpO1xuZ2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKCdwZXJpb2RpY3N5bmMnLCBldmVudCA9PiBTZXJ2aWNlLmhhbmRsZVBlcmlvZGljU3luYyhldmVudCkpO1xuIl19