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
  window.devMode === true && console.error(error);
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

      if (this.path === path && !forceRefresh) {
        return;
      }

      this.queryString = location.search;
      this.path = path;
      var prev = this.prevPath;
      var current = listener.args.content;

      var routes = this.routes || listener.routes || _Routes.Routes.dump();

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

      if (!document.dispatchEvent(eventStart)) {
        return;
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

        if (result instanceof Promise) {
          return result.then(function (realResult) {
            _this3.update(listener, path, realResult, routes, selected, args, forceRefresh);
          })["catch"](function (error) {
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

            _this3.update(listener, path, window['devMode'] ? String(error) : 'Error: 500', routes, selected, args, forceRefresh);

            throw error;
          });
        } else {
          return this.update(listener, path, result, routes, selected, args, forceRefresh);
        }
      } catch (error) {
        console.error(error);
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
            if (!finalViews[ii].firstNode) {
              finalViews[ii].render(_this3.tag, finalViews[ii + 1]);
              return finalViews[ii].rendered.then(function () {
                return renderRecurse(Number(i) + 1);
              });
            }

            return renderRecurse(Number(i) + 1);
          }

          finalViews[ii].render(_this3.tag, finalViews[ii + 1]);

          _this3.views.splice(ii, 0, finalViews[ii]);

          return finalViews[ii].rendered.then(function () {
            return renderRecurse(Number(i) + 1);
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

require.register("curvature/input/Axis.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Axis = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Axis = /*#__PURE__*/function () {
  function Axis(_ref) {
    var _ref$deadZone = _ref.deadZone,
        deadZone = _ref$deadZone === void 0 ? 0 : _ref$deadZone,
        _ref$proportional = _ref.proportional,
        proportional = _ref$proportional === void 0 ? true : _ref$proportional;

    _classCallCheck(this, Axis);

    _defineProperty(this, "magnitude", 0);

    _defineProperty(this, "delta", 0);

    this.proportional = proportional;
    this.deadZone = deadZone;
  }

  _createClass(Axis, [{
    key: "tilt",
    value: function tilt(magnitude) {
      if (this.deadZone && Math.abs(magnitude) >= this.deadZone) {
        magnitude = (Math.abs(magnitude) - this.deadZone) / (1 - this.deadZone) * Math.sign(magnitude);
      } else if (this.deadZone && Math.abs(magnitude) < this.deadZone) {
        magnitude = 0;
      }

      this.delta = Number(magnitude - this.magnitude).toFixed(3) - 0;
      this.magnitude = Number(magnitude).toFixed(3) - 0;
    }
  }, {
    key: "zero",
    value: function zero() {
      this.magnitude = this.delta = 0;
    }
  }]);

  return Axis;
}();

exports.Axis = Axis;
  })();
});

require.register("curvature/input/Button.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Button = /*#__PURE__*/function () {
  function Button() {
    _classCallCheck(this, Button);

    _defineProperty(this, "active", false);

    _defineProperty(this, "pressure", 0);

    _defineProperty(this, "delta", 0);

    _defineProperty(this, "time", 0);
  }

  _createClass(Button, [{
    key: "update",
    value: function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this.pressure) {
        this.time++;
      } else if (!this.pressure && this.time > 0) {
        this.time = -1;
      } else if (!this.pressure && this.time < 0) {
        this.time--;
      }

      if (this.time < -1 && this.delta === -1) {
        this.delta = 0;
      }
    }
  }, {
    key: "press",
    value: function press(pressure) {
      this.delta = Number(pressure - this.pressure).toFixed(3) - 0;
      this.pressure = Number(pressure).toFixed(3) - 0;
      this.active = true;
      this.time = this.time > 0 ? this.time : 0;
    }
  }, {
    key: "release",
    value: function release() {
      if (!this.active) {
        return;
      }

      this.delta = Number(-this.pressure).toFixed(3) - 0;
      this.pressure = 0;
      this.active = false;
    }
  }, {
    key: "zero",
    value: function zero() {
      this.pressure = this.delta = 0;
      this.active = false;
    }
  }]);

  return Button;
}();

exports.Button = Button;
  })();
});

require.register("curvature/input/Gamepad.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gamepad = void 0;

var _Mixin = require("../base/Mixin");

var _EventTargetMixin = require("../mixin/EventTargetMixin");

var _Axis = require("./Axis");

var _Button = require("./Button");

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var keys = {
  'Space': 0,
  'Enter': 0,
  'NumpadEnter': 0,
  'ControlLeft': 1,
  'ControlRight': 1,
  'ShiftLeft': 2,
  'ShiftRight': 2,
  'KeyZ': 3,
  'KeyQ': 4,
  'KeyE': 5,
  'Digit1': 6,
  'Digit3': 7,
  'KeyW': 12,
  'KeyA': 14,
  'KeyS': 13,
  'KeyD': 15,
  'KeyH': 112,
  'KeyJ': 113,
  'KeyK': 114,
  'KeyL': 115,
  'KeyP': 9,
  'Pause': 9,
  'Tab': 11,
  'ArrowUp': 12,
  'ArrowDown': 13,
  'ArrowLeft': 14,
  'ArrowRight': 15,
  'Numpad4': 112,
  'Numpad2': 113,
  'Numpad8': 114,
  'Numpad6': 115,
  'Backquote': 1010,
  'NumpadAdd': 1011,
  'NumpadSubtract': 1012,
  'NumpadMultiply': 1013,
  'NumpadDivide': 1014,
  'Escape': 1020
};

_toConsumableArray(Array(12)).map(function (x, fn) {
  return keys["F".concat(fn)] = 2000 + fn;
});

var axisMap = {
  12: -1,
  13: +1,
  14: -0,
  15: +0,
  112: -2,
  113: +3,
  114: -3,
  115: +2
};

var Gamepad = /*#__PURE__*/function (_Mixin$with) {
  _inherits(Gamepad, _Mixin$with);

  var _super = _createSuper(Gamepad);

  function Gamepad() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$keys = _ref.keys,
        keys = _ref$keys === void 0 ? {} : _ref$keys,
        _ref$deadZone = _ref.deadZone,
        deadZone = _ref$deadZone === void 0 ? 0 : _ref$deadZone,
        _ref$gamepad = _ref.gamepad,
        gamepad = _ref$gamepad === void 0 ? null : _ref$gamepad,
        _ref$keyboard = _ref.keyboard,
        keyboard = _ref$keyboard === void 0 ? null : _ref$keyboard;

    _classCallCheck(this, Gamepad);

    _this = _super.call(this);
    _this.deadZone = deadZone;
    _this.gamepad = gamepad;
    _this.index = gamepad.index;
    _this.id = gamepad.id;
    Object.defineProperties(_assertThisInitialized(_this), {
      buttons: {
        value: {}
      },
      pressure: {
        value: {}
      },
      axes: {
        value: {}
      },
      keys: {
        value: {}
      }
    });
    return _this;
  }

  _createClass(Gamepad, [{
    key: "update",
    value: function update() {
      for (var i in this.buttons) {
        var button = this.buttons[i];
        button.update();
      }
    }
  }, {
    key: "rumbleEffect",
    value: function rumbleEffect(options) {
      return this.gamepad.vibrationActuator.playEffect("dual-rumble", options);
    }
  }, {
    key: "rumble",
    value: function rumble() {
      if (this.gamepad.vibrationActuator.pulse) {
        var _this$gamepad$vibrati;

        return (_this$gamepad$vibrati = this.gamepad.vibrationActuator).pulse.apply(_this$gamepad$vibrati, arguments);
      } else {
        this.rumbleEffect({
          duration: 1000,
          strongMagnitude: 1.0,
          weakMagnitude: 1.0
        });
      }
    }
  }, {
    key: "readInput",
    value: function readInput() {
      if (!this.gamepad) {
        return;
      }

      var index = String(this.gamepad.index);
      var stat = this.constructor;

      if (!stat.padsRead.has(index)) {
        stat.padsRead = new Map(Object.entries(navigator.getGamepads()));
      }

      var gamepad = this.gamepad = stat.padsRead.get(index);
      stat.padsRead["delete"](index);
      var pressed = {};
      var released = {};

      if (gamepad) {
        for (var i in gamepad.buttons) {
          var button = gamepad.buttons[i];

          if (button.pressed) {
            this.press(i, button.value);
            pressed[i] = true;
          }
        }
      }

      if (this.keyboard) {
        for (var _i in _toConsumableArray(Array(10))) {
          if (pressed[_i]) {
            continue;
          }

          if (this.keyboard.getKeyCode(_i) > 0) {
            this.press(_i, 1);
            pressed[_i] = true;
          }
        }

        for (var keycode in keys) {
          if (pressed[keycode]) {
            continue;
          }

          var buttonId = keys[keycode];

          if (this.keyboard.getKeyCode(keycode) > 0) {
            this.press(buttonId, 1);
            pressed[buttonId] = true;
          }
        }
      }

      if (gamepad) {
        for (var _i2 in gamepad.buttons) {
          if (pressed[_i2]) {
            continue;
          }

          var _button = gamepad.buttons[_i2];

          if (!_button.pressed) {
            this.release(_i2);
            released[_i2] = true;
          }
        }
      }

      if (this.keyboard) {
        for (var _i3 in _toConsumableArray(Array(10))) {
          if (released[_i3]) {
            continue;
          }

          if (pressed[_i3]) {
            continue;
          }

          if (this.keyboard.getKeyCode(_i3) < 0) {
            this.release(_i3);
            released[_i3] = true;
          }
        }

        for (var _keycode in keys) {
          var _buttonId = keys[_keycode];

          if (released[_buttonId]) {
            continue;
          }

          if (pressed[_buttonId]) {
            continue;
          }

          if (this.keyboard.getKeyCode(_keycode) < 0) {
            this.release(_buttonId);
            released[_keycode] = true;
          }
        }
      }

      var tilted = {};

      if (gamepad) {
        for (var _i4 in gamepad.axes) {
          var axis = gamepad.axes[_i4];
          tilted[_i4] = true;
          this.tilt(_i4, axis);
        }
      }

      for (var inputId in axisMap) {
        if (!this.buttons[inputId]) {
          this.buttons[inputId] = new _Button.Button();
        }

        var _axis = axisMap[inputId];
        var value = Math.sign(1 / _axis);
        var axisId = Math.abs(_axis);

        if (this.buttons[inputId].active) {
          tilted[axisId] = true;
          this.tilt(axisId, value);
        } else if (!tilted[axisId]) {
          this.tilt(axisId, 0);
        }
      }
    }
  }, {
    key: "tilt",
    value: function tilt(axisId, magnitude) {
      if (!this.axes[axisId]) {
        this.axes[axisId] = new _Axis.Axis({
          deadZone: this.deadZone
        });
      }

      this.axes[axisId].tilt(magnitude);
    }
  }, {
    key: "press",
    value: function press(buttonId) {
      var pressure = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (!this.buttons[buttonId]) {
        this.buttons[buttonId] = new _Button.Button();
      }

      this.buttons[buttonId].press(pressure);
    }
  }, {
    key: "release",
    value: function release(buttonId) {
      if (!this.buttons[buttonId]) {
        this.buttons[buttonId] = new _Button.Button();
      }

      this.buttons[buttonId].release();
    }
  }, {
    key: "serialize",
    value: function serialize() {
      var buttons = {};

      for (var i in this.buttons) {
        buttons[i] = this.buttons[i].pressure;
      }

      var axes = {};

      for (var _i5 in this.axes) {
        axes[_i5] = this.axes[_i5].magnitude;
      }

      return {
        axes: axes,
        buttons: buttons
      };
    }
  }, {
    key: "replay",
    value: function replay(input) {
      if (input.buttons) {
        for (var i in input.buttons) {
          if (input.buttons[i] > 0) {
            this.press(i, input.buttons[i]);
          } else {
            this.release(i);
          }
        }
      }

      if (input.axes) {
        for (var _i6 in input.axes) {
          if (input.axes[_i6].magnitude !== input.axes[_i6]) {
            this.tilt(_i6, input.axes[_i6]);
          }
        }
      }
    }
  }, {
    key: "zero",
    value: function zero() {
      for (var i in this.axes) {
        this.axes[i].zero();
      }

      for (var _i7 in this.buttons) {
        this.buttons[_i7].zero();
      }
    }
  }], [{
    key: "getPad",
    value: function getPad() {
      var _this2 = this;

      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$index = _ref2.index,
          index = _ref2$index === void 0 ? undefined : _ref2$index,
          _ref2$deadZone = _ref2.deadZone,
          deadZone = _ref2$deadZone === void 0 ? 0 : _ref2$deadZone,
          _ref2$keys = _ref2.keys,
          keys = _ref2$keys === void 0 ? {} : _ref2$keys,
          _ref2$keyboard = _ref2.keyboard,
          keyboard = _ref2$keyboard === void 0 ? null : _ref2$keyboard;

      if (this.padsConnected.has(index)) {
        return this.padsConnected.get(index);
      }

      var waitForPad = new Promise(function (accept) {
        var registerPad = function registerPad(event) {
          event.stopImmediatePropagation();
          var pad = new _this2({
            gamepad: event.gamepad,
            deadZone: deadZone,
            keys: keys,
            keyboard: keyboard
          });

          _this2.padsConnected.set(event.gamepad.index, waitForPad);

          accept(pad);
        };

        addEventListener('gamepadconnected', registerPad, {
          once: true
        });
      });
      return waitForPad;
    }
  }]);

  return Gamepad;
}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));

exports.Gamepad = Gamepad;

_defineProperty(Gamepad, "padsConnected", new Map());

_defineProperty(Gamepad, "padsRead", new Map());
  })();
});

require.register("curvature/input/Keyboard.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keyboard = void 0;

var _Bindable = require("../base/Bindable");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Keyboard = /*#__PURE__*/function () {
  function Keyboard() {
    var _this = this;

    _classCallCheck(this, Keyboard);

    this.maxDecay = 120;
    this.comboTime = 500;
    this.listening = false;
    this.focusElement = document.body;
    Object.defineProperty(this, 'combo', {
      value: _Bindable.Bindable.make([])
    });
    Object.defineProperty(this, 'whichs', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'codes', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'keys', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'pressedWhich', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'pressedCode', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'pressedKey', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'releasedWhich', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'releasedCode', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'releasedKey', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'keyRefs', {
      value: _Bindable.Bindable.make({})
    });
    document.addEventListener('keyup', function (event) {
      if (!_this.listening) {
        return;
      }

      if (_this.focusElement && document.activeElement !== _this.focusElement && (!_this.focusElement.contains(document.activeElement) || document.activeElement.matches('input,textarea'))) {
        return;
      }

      event.preventDefault();
      _this.releasedWhich[event.which] = Date.now();
      _this.releasedCode[event.code] = Date.now();
      _this.releasedKey[event.key] = Date.now();
      _this.whichs[event.which] = -1;
      _this.codes[event.code] = -1;
      _this.keys[event.key] = -1;
    });
    document.addEventListener('keydown', function (event) {
      if (!_this.listening) {
        return;
      }

      if (_this.focusElement && document.activeElement !== _this.focusElement && (!_this.focusElement.contains(document.activeElement) || document.activeElement.matches('input,textarea'))) {
        return;
      }

      event.preventDefault();

      if (event.repeat) {
        return;
      }

      _this.combo.push(event.code);

      clearTimeout(_this.comboTimer);
      _this.comboTimer = setTimeout(function () {
        return _this.combo.splice(0);
      }, _this.comboTime);
      _this.pressedWhich[event.which] = Date.now();
      _this.pressedCode[event.code] = Date.now();
      _this.pressedKey[event.key] = Date.now();

      if (_this.keys[event.key] > 0) {
        return;
      }

      _this.whichs[event.which] = 1;
      _this.codes[event.code] = 1;
      _this.keys[event.key] = 1;
    });

    var windowBlur = function windowBlur(event) {
      for (var i in _this.keys) {
        if (_this.keys[i] < 0) {
          continue;
        }

        _this.releasedKey[i] = Date.now();
        _this.keys[i] = -1;
      }

      for (var _i in _this.codes) {
        if (_this.codes[_i] < 0) {
          continue;
        }

        _this.releasedCode[_i] = Date.now();
        _this.codes[_i] = -1;
      }

      for (var _i2 in _this.whichs) {
        if (_this.whichs[_i2] < 0) {
          continue;
        }

        _this.releasedWhich[_i2] = Date.now();
        _this.whichs[_i2] = -1;
      }
    };

    window.addEventListener('blur', windowBlur);
    window.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        return;
      }

      windowBlur();
    });
  }

  _createClass(Keyboard, [{
    key: "getKeyRef",
    value: function getKeyRef(keyCode) {
      var keyRef = this.keyRefs[keyCode] = this.keyRefs[keyCode] || _Bindable.Bindable.make({});

      return keyRef;
    }
  }, {
    key: "getKeyTime",
    value: function getKeyTime(key) {
      var released = this.releasedKey[key];
      var pressed = this.pressedKey[key];

      if (!pressed) {
        return 0;
      }

      if (!released || released < pressed) {
        return Date.now() - pressed;
      }

      return (Date.now() - released) * -1;
    }
  }, {
    key: "getCodeTime",
    value: function getCodeTime(code) {
      var released = this.releasedCode[code];
      var pressed = this.pressedCode[code];

      if (!pressed) {
        return 0;
      }

      if (!released || released < pressed) {
        return Date.now() - pressed;
      }

      return (Date.now() - released) * -1;
    }
  }, {
    key: "getWhichTime",
    value: function getWhichTime(code) {
      var released = this.releasedWhich[code];
      var pressed = this.pressedWhich[code];

      if (!pressed) {
        return 0;
      }

      if (!released || released < pressed) {
        return Date.now() - pressed;
      }

      return (Date.now() - released) * -1;
    }
  }, {
    key: "getKey",
    value: function getKey(key) {
      if (!this.keys[key]) {
        return 0;
      }

      return this.keys[key];
    }
  }, {
    key: "getKeyCode",
    value: function getKeyCode(code) {
      if (!this.codes[code]) {
        return 0;
      }

      return this.codes[code];
    }
  }, {
    key: "reset",
    value: function reset() {
      for (var i in this.keys) {
        delete this.keys[i];
      }

      for (var i in this.codes) {
        delete this.codes[i];
      }

      for (var i in this.whichs) {
        delete this.whichs[i];
      }
    }
  }, {
    key: "update",
    value: function update() {
      for (var i in this.keys) {
        if (this.keys[i] > 0) {
          this.keys[i]++;
        } else if (this.keys[i] > -this.maxDecay) {
          this.keys[i]--;
        } else {
          delete this.keys[i];
        }
      }

      for (var i in this.codes) {
        var released = this.releasedCode[i];
        var pressed = this.pressedCode[i];
        var keyRef = this.getKeyRef(i);

        if (this.codes[i] > 0) {
          keyRef.frames = this.codes[i]++;
          keyRef.time = pressed ? Date.now() - pressed : 0;
          keyRef.down = true;

          if (!released || released < pressed) {
            return;
          }

          return (Date.now() - released) * -1;
        } else if (this.codes[i] > -this.maxDecay) {
          keyRef.frames = this.codes[i]--;
          keyRef.time = released - Date.now();
          keyRef.down = false;
        } else {
          keyRef.frames = 0;
          keyRef.time = 0;
          keyRef.down = false;
          delete this.codes[i];
        }
      }

      for (var i in this.whichs) {
        if (this.whichs[i] > 0) {
          this.whichs[i]++;
        } else if (this.whichs[i] > -this.maxDecay) {
          this.whichs[i]--;
        } else {
          delete this.whichs[i];
        }
      }
    }
  }], [{
    key: "get",
    value: function get() {
      return this.instance = this.instance || _Bindable.Bindable.make(new this());
    }
  }]);

  return Keyboard;
}();

exports.Keyboard = Keyboard;
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
require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

"use strict";

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;
  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },
    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      }); // Hack to force page repaint after 25ms.

      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    },
    javascript: function javascript() {
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function (script) {
        return script.text;
      }).filter(function (text) {
        return text.length > 0;
      });
      var srcScripts = scripts.filter(function (script) {
        return script.src;
      });
      var loaded = 0;
      var all = srcScripts.length;

      var onLoad = function onLoad() {
        loaded = loaded + 1;

        if (loaded === all) {
          textScripts.forEach(function (script) {
            eval(script);
          });
        }
      };

      srcScripts.forEach(function (script) {
        var src = script.src;
        script.remove();
        var newScript = document.createElement('script');
        newScript.src = cacheBuster(src);
        newScript.async = true;
        newScript.onload = onLoad;
        document.head.appendChild(newScript);
      });
    }
  };
  var port = ar.port || 9486;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);

    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };

    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };

    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };

  connect();
})();
/* jshint ignore:end */
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9jdXJ2YXR1cmUvYmFzZS9CYWcuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvQmluZGFibGUuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvQ2FjaGUuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvQ29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9iYXNlL0RvbS5qcyIsIm5vZGVfbW9kdWxlcy9jdXJ2YXR1cmUvYmFzZS9NaXhpbi5qcyIsIm5vZGVfbW9kdWxlcy9jdXJ2YXR1cmUvYmFzZS9Sb3V0ZXIuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvUm91dGVzLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9iYXNlL1J1bGVTZXQuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2Jhc2UvU2V0TWFwLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9iYXNlL1RhZy5qcyIsIm5vZGVfbW9kdWxlcy9jdXJ2YXR1cmUvYmFzZS9WaWV3LmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9iYXNlL1ZpZXdMaXN0LmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9pbnB1dC9BeGlzLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9pbnB1dC9CdXR0b24uanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2lucHV0L0dhbWVwYWQuanMiLCJub2RlX21vZHVsZXMvY3VydmF0dXJlL2lucHV0L0tleWJvYXJkLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9taXhpbi9FdmVudFRhcmdldE1peGluLmpzIiwibm9kZV9tb2R1bGVzL2N1cnZhdHVyZS9taXhpbi9Qcm9taXNlTWl4aW4uanMiLCJub2RlX21vZHVsZXMvYXV0by1yZWxvYWQtYnJ1bmNoL3ZlbmRvci9hdXRvLXJlbG9hZC5qcyJdLCJuYW1lcyI6WyJXZWJTb2NrZXQiLCJ3aW5kb3ciLCJNb3pXZWJTb2NrZXQiLCJiciIsImJydW5jaCIsImFyIiwiZGlzYWJsZWQiLCJfYXIiLCJjYWNoZUJ1c3RlciIsInVybCIsImRhdGUiLCJNYXRoIiwicm91bmQiLCJEYXRlIiwibm93IiwidG9TdHJpbmciLCJyZXBsYWNlIiwiaW5kZXhPZiIsImJyb3dzZXIiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0b0xvd2VyQ2FzZSIsImZvcmNlUmVwYWludCIsInJlbG9hZGVycyIsInBhZ2UiLCJsb2NhdGlvbiIsInJlbG9hZCIsInN0eWxlc2hlZXQiLCJzbGljZSIsImNhbGwiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmaWx0ZXIiLCJsaW5rIiwidmFsIiwiZ2V0QXR0cmlidXRlIiwiaHJlZiIsImZvckVhY2giLCJzZXRUaW1lb3V0IiwiYm9keSIsIm9mZnNldEhlaWdodCIsImphdmFzY3JpcHQiLCJzY3JpcHRzIiwidGV4dFNjcmlwdHMiLCJtYXAiLCJzY3JpcHQiLCJ0ZXh0IiwibGVuZ3RoIiwic3JjU2NyaXB0cyIsInNyYyIsImxvYWRlZCIsImFsbCIsIm9uTG9hZCIsImV2YWwiLCJyZW1vdmUiLCJuZXdTY3JpcHQiLCJjcmVhdGVFbGVtZW50IiwiYXN5bmMiLCJvbmxvYWQiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJwb3J0IiwiaG9zdCIsInNlcnZlciIsImhvc3RuYW1lIiwiY29ubmVjdCIsImNvbm5lY3Rpb24iLCJvbm1lc3NhZ2UiLCJldmVudCIsIm1lc3NhZ2UiLCJkYXRhIiwicmVsb2FkZXIiLCJvbmVycm9yIiwicmVhZHlTdGF0ZSIsImNsb3NlIiwib25jbG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3IrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxaUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOWJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2pEQTtBQUNBLENBQUMsWUFBVztBQUNWLE1BQUlBLFNBQVMsR0FBR0MsTUFBTSxDQUFDRCxTQUFQLElBQW9CQyxNQUFNLENBQUNDLFlBQTNDO0FBQ0EsTUFBSUMsRUFBRSxHQUFHRixNQUFNLENBQUNHLE1BQVAsR0FBaUJILE1BQU0sQ0FBQ0csTUFBUCxJQUFpQixFQUEzQztBQUNBLE1BQUlDLEVBQUUsR0FBR0YsRUFBRSxDQUFDLGFBQUQsQ0FBRixHQUFxQkEsRUFBRSxDQUFDLGFBQUQsQ0FBRixJQUFxQixFQUFuRDtBQUNBLE1BQUksQ0FBQ0gsU0FBRCxJQUFjSyxFQUFFLENBQUNDLFFBQXJCLEVBQStCO0FBQy9CLE1BQUlMLE1BQU0sQ0FBQ00sR0FBWCxFQUFnQjtBQUNoQk4sUUFBTSxDQUFDTSxHQUFQLEdBQWEsSUFBYjs7QUFFQSxNQUFJQyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFTQyxHQUFULEVBQWE7QUFDN0IsUUFBSUMsSUFBSSxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0MsSUFBSSxDQUFDQyxHQUFMLEtBQWEsSUFBeEIsRUFBOEJDLFFBQTlCLEVBQVg7QUFDQU4sT0FBRyxHQUFHQSxHQUFHLENBQUNPLE9BQUosQ0FBWSx5QkFBWixFQUF1QyxFQUF2QyxDQUFOO0FBQ0EsV0FBT1AsR0FBRyxJQUFJQSxHQUFHLENBQUNRLE9BQUosQ0FBWSxHQUFaLEtBQW9CLENBQXBCLEdBQXdCLEdBQXhCLEdBQThCLEdBQWxDLENBQUgsR0FBMkMsY0FBM0MsR0FBNERQLElBQW5FO0FBQ0QsR0FKRDs7QUFNQSxNQUFJUSxPQUFPLEdBQUdDLFNBQVMsQ0FBQ0MsU0FBVixDQUFvQkMsV0FBcEIsRUFBZDtBQUNBLE1BQUlDLFlBQVksR0FBR2pCLEVBQUUsQ0FBQ2lCLFlBQUgsSUFBbUJKLE9BQU8sQ0FBQ0QsT0FBUixDQUFnQixRQUFoQixJQUE0QixDQUFDLENBQW5FO0FBRUEsTUFBSU0sU0FBUyxHQUFHO0FBQ2RDLFFBQUksRUFBRSxnQkFBVTtBQUNkdkIsWUFBTSxDQUFDd0IsUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUIsSUFBdkI7QUFDRCxLQUhhO0FBS2RDLGNBQVUsRUFBRSxzQkFBVTtBQUNwQixTQUFHQyxLQUFILENBQ0dDLElBREgsQ0FDUUMsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixzQkFBMUIsQ0FEUixFQUVHQyxNQUZILENBRVUsVUFBU0MsSUFBVCxFQUFlO0FBQ3JCLFlBQUlDLEdBQUcsR0FBR0QsSUFBSSxDQUFDRSxZQUFMLENBQWtCLGlCQUFsQixDQUFWO0FBQ0EsZUFBT0YsSUFBSSxDQUFDRyxJQUFMLElBQWFGLEdBQUcsSUFBSSxPQUEzQjtBQUNELE9BTEgsRUFNR0csT0FOSCxDQU1XLFVBQVNKLElBQVQsRUFBZTtBQUN0QkEsWUFBSSxDQUFDRyxJQUFMLEdBQVk1QixXQUFXLENBQUN5QixJQUFJLENBQUNHLElBQU4sQ0FBdkI7QUFDRCxPQVJILEVBRG9CLENBV3BCOztBQUNBLFVBQUlkLFlBQUosRUFBa0JnQixVQUFVLENBQUMsWUFBVztBQUFFUixnQkFBUSxDQUFDUyxJQUFULENBQWNDLFlBQWQ7QUFBNkIsT0FBM0MsRUFBNkMsRUFBN0MsQ0FBVjtBQUNuQixLQWxCYTtBQW9CZEMsY0FBVSxFQUFFLHNCQUFVO0FBQ3BCLFVBQUlDLE9BQU8sR0FBRyxHQUFHZCxLQUFILENBQVNDLElBQVQsQ0FBY0MsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixRQUExQixDQUFkLENBQWQ7QUFDQSxVQUFJWSxXQUFXLEdBQUdELE9BQU8sQ0FBQ0UsR0FBUixDQUFZLFVBQVNDLE1BQVQsRUFBaUI7QUFBRSxlQUFPQSxNQUFNLENBQUNDLElBQWQ7QUFBb0IsT0FBbkQsRUFBcURkLE1BQXJELENBQTRELFVBQVNjLElBQVQsRUFBZTtBQUFFLGVBQU9BLElBQUksQ0FBQ0MsTUFBTCxHQUFjLENBQXJCO0FBQXdCLE9BQXJHLENBQWxCO0FBQ0EsVUFBSUMsVUFBVSxHQUFHTixPQUFPLENBQUNWLE1BQVIsQ0FBZSxVQUFTYSxNQUFULEVBQWlCO0FBQUUsZUFBT0EsTUFBTSxDQUFDSSxHQUFkO0FBQW1CLE9BQXJELENBQWpCO0FBRUEsVUFBSUMsTUFBTSxHQUFHLENBQWI7QUFDQSxVQUFJQyxHQUFHLEdBQUdILFVBQVUsQ0FBQ0QsTUFBckI7O0FBQ0EsVUFBSUssTUFBTSxHQUFHLFNBQVRBLE1BQVMsR0FBVztBQUN0QkYsY0FBTSxHQUFHQSxNQUFNLEdBQUcsQ0FBbEI7O0FBQ0EsWUFBSUEsTUFBTSxLQUFLQyxHQUFmLEVBQW9CO0FBQ2xCUixxQkFBVyxDQUFDTixPQUFaLENBQW9CLFVBQVNRLE1BQVQsRUFBaUI7QUFBRVEsZ0JBQUksQ0FBQ1IsTUFBRCxDQUFKO0FBQWUsV0FBdEQ7QUFDRDtBQUNGLE9BTEQ7O0FBT0FHLGdCQUFVLENBQ1BYLE9BREgsQ0FDVyxVQUFTUSxNQUFULEVBQWlCO0FBQ3hCLFlBQUlJLEdBQUcsR0FBR0osTUFBTSxDQUFDSSxHQUFqQjtBQUNBSixjQUFNLENBQUNTLE1BQVA7QUFDQSxZQUFJQyxTQUFTLEdBQUd6QixRQUFRLENBQUMwQixhQUFULENBQXVCLFFBQXZCLENBQWhCO0FBQ0FELGlCQUFTLENBQUNOLEdBQVYsR0FBZ0J6QyxXQUFXLENBQUN5QyxHQUFELENBQTNCO0FBQ0FNLGlCQUFTLENBQUNFLEtBQVYsR0FBa0IsSUFBbEI7QUFDQUYsaUJBQVMsQ0FBQ0csTUFBVixHQUFtQk4sTUFBbkI7QUFDQXRCLGdCQUFRLENBQUM2QixJQUFULENBQWNDLFdBQWQsQ0FBMEJMLFNBQTFCO0FBQ0QsT0FUSDtBQVVEO0FBNUNhLEdBQWhCO0FBOENBLE1BQUlNLElBQUksR0FBR3hELEVBQUUsQ0FBQ3dELElBQUgsSUFBVyxJQUF0QjtBQUNBLE1BQUlDLElBQUksR0FBRzNELEVBQUUsQ0FBQzRELE1BQUgsSUFBYTlELE1BQU0sQ0FBQ3dCLFFBQVAsQ0FBZ0J1QyxRQUE3QixJQUF5QyxXQUFwRDs7QUFFQSxNQUFJQyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxHQUFVO0FBQ3RCLFFBQUlDLFVBQVUsR0FBRyxJQUFJbEUsU0FBSixDQUFjLFVBQVU4RCxJQUFWLEdBQWlCLEdBQWpCLEdBQXVCRCxJQUFyQyxDQUFqQjs7QUFDQUssY0FBVSxDQUFDQyxTQUFYLEdBQXVCLFVBQVNDLEtBQVQsRUFBZTtBQUNwQyxVQUFJL0QsRUFBRSxDQUFDQyxRQUFQLEVBQWlCO0FBQ2pCLFVBQUkrRCxPQUFPLEdBQUdELEtBQUssQ0FBQ0UsSUFBcEI7QUFDQSxVQUFJQyxRQUFRLEdBQUdoRCxTQUFTLENBQUM4QyxPQUFELENBQVQsSUFBc0I5QyxTQUFTLENBQUNDLElBQS9DO0FBQ0ErQyxjQUFRO0FBQ1QsS0FMRDs7QUFNQUwsY0FBVSxDQUFDTSxPQUFYLEdBQXFCLFlBQVU7QUFDN0IsVUFBSU4sVUFBVSxDQUFDTyxVQUFmLEVBQTJCUCxVQUFVLENBQUNRLEtBQVg7QUFDNUIsS0FGRDs7QUFHQVIsY0FBVSxDQUFDUyxPQUFYLEdBQXFCLFlBQVU7QUFDN0IxRSxZQUFNLENBQUNxQyxVQUFQLENBQWtCMkIsT0FBbEIsRUFBMkIsSUFBM0I7QUFDRCxLQUZEO0FBR0QsR0FkRDs7QUFlQUEsU0FBTztBQUNSLENBbEZEO0FBbUZBIiwiZmlsZSI6ImRvY3MvdmVuZG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvQmFnLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLkJhZyA9IHZvaWQgMDtcblxudmFyIF9CaW5kYWJsZSA9IHJlcXVpcmUoXCIuL0JpbmRhYmxlXCIpO1xuXG52YXIgX01peGluID0gcmVxdWlyZShcIi4vTWl4aW5cIik7XG5cbnZhciBfRXZlbnRUYXJnZXRNaXhpbiA9IHJlcXVpcmUoXCIuLi9taXhpbi9FdmVudFRhcmdldE1peGluXCIpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gZWxzZSBpZiAoY2FsbCAhPT0gdm9pZCAwKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJEZXJpdmVkIGNvbnN0cnVjdG9ycyBtYXkgb25seSByZXR1cm4gb2JqZWN0IG9yIHVuZGVmaW5lZFwiKTsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoQm9vbGVhbiwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIHRvSWQgPSBmdW5jdGlvbiB0b0lkKF9pbnQpIHtcbiAgcmV0dXJuIE51bWJlcihfaW50KTtcbn07XG5cbnZhciBmcm9tSWQgPSBmdW5jdGlvbiBmcm9tSWQoaWQpIHtcbiAgcmV0dXJuIHBhcnNlSW50KGlkKTtcbn07XG5cbnZhciBNYXBwZWQgPSBTeW1ib2woJ01hcHBlZCcpO1xudmFyIEhhcyA9IFN5bWJvbCgnSGFzJyk7XG52YXIgQWRkID0gU3ltYm9sKCdBZGQnKTtcbnZhciBSZW1vdmUgPSBTeW1ib2woJ1JlbW92ZScpO1xudmFyIERlbGV0ZSA9IFN5bWJvbCgnRGVsZXRlJyk7XG5cbnZhciBCYWcgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9NaXhpbiR3aXRoKSB7XG4gIF9pbmhlcml0cyhCYWcsIF9NaXhpbiR3aXRoKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEJhZyk7XG5cbiAgZnVuY3Rpb24gQmFnKCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIHZhciBjaGFuZ2VDYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJhZyk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpO1xuICAgIF90aGlzLm1ldGEgPSBTeW1ib2woJ21ldGEnKTtcbiAgICBfdGhpcy5jb250ZW50ID0gbmV3IE1hcCgpO1xuICAgIF90aGlzLmxpc3QgPSBfQmluZGFibGUuQmluZGFibGUubWFrZUJpbmRhYmxlKFtdKTtcbiAgICBfdGhpcy5jdXJyZW50ID0gMDtcbiAgICBfdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuICAgIF90aGlzLmxlbmd0aCA9IDA7XG4gICAgX3RoaXMuY2hhbmdlQ2FsbGJhY2sgPSBjaGFuZ2VDYWxsYmFjaztcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQmFnLCBbe1xuICAgIGtleTogXCJoYXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFzKGl0ZW0pIHtcbiAgICAgIGlmICh0aGlzW01hcHBlZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbTWFwcGVkXS5oYXMoaXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzW0hhc10oaXRlbSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBIYXMsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKGl0ZW0pIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaGFzKGl0ZW0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKGl0ZW0pIHtcbiAgICAgIGlmICh0aGlzW01hcHBlZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbTWFwcGVkXS5hZGQoaXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzW0FkZF0oaXRlbSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBBZGQsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQgfHwgIShpdGVtIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgb2JqZWN0cyBtYXkgYmUgYWRkZWQgdG8gQmFncy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudHlwZSAmJiAhKGl0ZW0gaW5zdGFuY2VvZiB0aGlzLnR5cGUpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy50eXBlLCBpdGVtKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSBvYmplY3RzIG9mIHR5cGUgXCIuY29uY2F0KHRoaXMudHlwZSwgXCIgbWF5IGJlIGFkZGVkIHRvIHRoaXMgQmFnLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNvbnRlbnQuaGFzKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGFkZGluZyA9IG5ldyBDdXN0b21FdmVudCgnYWRkaW5nJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuZGlzcGF0Y2hFdmVudChhZGRpbmcpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGlkID0gdG9JZCh0aGlzLmN1cnJlbnQrKyk7XG4gICAgICB0aGlzLmNvbnRlbnQuc2V0KGl0ZW0sIGlkKTtcbiAgICAgIHRoaXMubGlzdFtpZF0gPSBpdGVtO1xuXG4gICAgICBpZiAodGhpcy5jaGFuZ2VDYWxsYmFjaykge1xuICAgICAgICB0aGlzLmNoYW5nZUNhbGxiYWNrKGl0ZW0sIHRoaXMubWV0YSwgQmFnLklURU1fQURERUQsIGlkKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFkZCA9IG5ldyBDdXN0b21FdmVudCgnYWRkZWQnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGFkZCk7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuc2l6ZTtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShpdGVtKSB7XG4gICAgICBpZiAodGhpc1tNYXBwZWRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzW01hcHBlZF0ucmVtb3ZlKGl0ZW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpc1tSZW1vdmVdKGl0ZW0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogUmVtb3ZlLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShpdGVtKSB7XG4gICAgICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkIHx8ICEoaXRlbSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9iamVjdHMgbWF5IGJlIHJlbW92ZWQgZnJvbSBCYWdzLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50eXBlICYmICEoaXRlbSBpbnN0YW5jZW9mIHRoaXMudHlwZSkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnR5cGUsIGl0ZW0pO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IG9iamVjdHMgb2YgdHlwZSBcIi5jb25jYXQodGhpcy50eXBlLCBcIiBtYXkgYmUgcmVtb3ZlZCBmcm9tIHRoaXMgQmFnLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5jb250ZW50LmhhcyhpdGVtKSkge1xuICAgICAgICBpZiAodGhpcy5jaGFuZ2VDYWxsYmFjaykge1xuICAgICAgICAgIHRoaXMuY2hhbmdlQ2FsbGJhY2soaXRlbSwgdGhpcy5tZXRhLCAwLCB1bmRlZmluZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVtb3ZpbmcgPSBuZXcgQ3VzdG9tRXZlbnQoJ3JlbW92aW5nJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuZGlzcGF0Y2hFdmVudChyZW1vdmluZykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgaWQgPSB0aGlzLmNvbnRlbnQuZ2V0KGl0ZW0pO1xuICAgICAgZGVsZXRlIHRoaXMubGlzdFtpZF07XG4gICAgICB0aGlzLmNvbnRlbnRbXCJkZWxldGVcIl0oaXRlbSk7XG5cbiAgICAgIGlmICh0aGlzLmNoYW5nZUNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlQ2FsbGJhY2soaXRlbSwgdGhpcy5tZXRhLCBCYWcuSVRFTV9SRU1PVkVELCBpZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZW1vdmUgPSBuZXcgQ3VzdG9tRXZlbnQoJ3JlbW92ZWQnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHJlbW92ZSk7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuc2l6ZTtcbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWxldGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2RlbGV0ZShpdGVtKSB7XG4gICAgICBpZiAodGhpc1tNYXBwZWRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzW01hcHBlZF1bXCJkZWxldGVcIl0oaXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXNbRGVsZXRlXShpdGVtKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IERlbGV0ZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoaXRlbSkge1xuICAgICAgdGhpcy5yZW1vdmUoaXRlbSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXAoKSB7XG4gICAgICB2YXIgbWFwcGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH07XG4gICAgICB2YXIgZmlsdGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH07XG4gICAgICB2YXIgbWFwcGVkSXRlbXMgPSBuZXcgV2Vha01hcCgpO1xuICAgICAgdmFyIG1hcHBlZEJhZyA9IG5ldyBCYWcoKTtcbiAgICAgIG1hcHBlZEJhZ1tNYXBwZWRdID0gdGhpcztcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignYWRkZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC5kZXRhaWwuaXRlbTtcblxuICAgICAgICBpZiAoIWZpbHRlcihpdGVtKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXBwZWRJdGVtcy5oYXMoaXRlbSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWFwcGVkID0gbWFwcGVyKGl0ZW0pO1xuICAgICAgICBtYXBwZWRJdGVtcy5zZXQoaXRlbSwgbWFwcGVkKTtcbiAgICAgICAgbWFwcGVkQmFnW0FkZF0obWFwcGVkKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdyZW1vdmVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBpdGVtID0gZXZlbnQuZGV0YWlsLml0ZW07XG5cbiAgICAgICAgaWYgKCFtYXBwZWRJdGVtcy5oYXMoaXRlbSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWFwcGVkID0gbWFwcGVkSXRlbXMuZ2V0KGl0ZW0pO1xuICAgICAgICBtYXBwZWRJdGVtc1tcImRlbGV0ZVwiXShpdGVtKTtcbiAgICAgICAgbWFwcGVkQmFnW1JlbW92ZV0obWFwcGVkKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1hcHBlZEJhZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2l6ZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5zaXplO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpdGVtc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpdGVtcygpIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuY29udGVudC5lbnRyaWVzKCkpLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgcmV0dXJuIGVudHJ5WzBdO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJhZztcbn0oX01peGluLk1peGluW1wid2l0aFwiXShfRXZlbnRUYXJnZXRNaXhpbi5FdmVudFRhcmdldE1peGluKSk7XG5cbmV4cG9ydHMuQmFnID0gQmFnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhZywgJ0lURU1fQURERUQnLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgdmFsdWU6IDFcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhZywgJ0lURU1fUkVNT1ZFRCcsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICB2YWx1ZTogLTFcbn0pO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvQmluZGFibGUuanNcIiwgZnVuY3Rpb24oZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlKSB7XG4gIHJlcXVpcmUgPSBfX21ha2VSZWxhdGl2ZVJlcXVpcmUocmVxdWlyZSwge30sIFwiY3VydmF0dXJlXCIpO1xuICAoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLkJpbmRhYmxlID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHsgaWYgKF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSkgeyBfY29uc3RydWN0ID0gUmVmbGVjdC5jb25zdHJ1Y3Q7IH0gZWxzZSB7IF9jb25zdHJ1Y3QgPSBmdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHsgdmFyIGEgPSBbbnVsbF07IGEucHVzaC5hcHBseShhLCBhcmdzKTsgdmFyIENvbnN0cnVjdG9yID0gRnVuY3Rpb24uYmluZC5hcHBseShQYXJlbnQsIGEpOyB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTsgaWYgKENsYXNzKSBfc2V0UHJvdG90eXBlT2YoaW5zdGFuY2UsIENsYXNzLnByb3RvdHlwZSk7IHJldHVybiBpbnN0YW5jZTsgfTsgfSByZXR1cm4gX2NvbnN0cnVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgQm9vbGVhbi5wcm90b3R5cGUudmFsdWVPZi5jYWxsKFJlZmxlY3QuY29uc3RydWN0KEJvb2xlYW4sIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgaXRlcltTeW1ib2wuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lKSB7IHRocm93IF9lOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMjsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIFJlZiA9IFN5bWJvbCgncmVmJyk7XG52YXIgT3JpZ2luYWwgPSBTeW1ib2woJ29yaWdpbmFsJyk7XG52YXIgRGVjayA9IFN5bWJvbCgnZGVjaycpO1xudmFyIEJpbmRpbmcgPSBTeW1ib2woJ2JpbmRpbmcnKTtcbnZhciBTdWJCaW5kaW5nID0gU3ltYm9sKCdzdWJCaW5kaW5nJyk7XG52YXIgQmluZGluZ0FsbCA9IFN5bWJvbCgnYmluZGluZ0FsbCcpO1xudmFyIElzQmluZGFibGUgPSBTeW1ib2woJ2lzQmluZGFibGUnKTtcbnZhciBXcmFwcGluZyA9IFN5bWJvbCgnd3JhcHBpbmcnKTtcbnZhciBOYW1lcyA9IFN5bWJvbCgnTmFtZXMnKTtcbnZhciBFeGVjdXRpbmcgPSBTeW1ib2woJ2V4ZWN1dGluZycpO1xudmFyIFN0YWNrID0gU3ltYm9sKCdzdGFjaycpO1xudmFyIE9ialN5bWJvbCA9IFN5bWJvbCgnb2JqZWN0Jyk7XG52YXIgV3JhcHBlZCA9IFN5bWJvbCgnd3JhcHBlZCcpO1xudmFyIFVud3JhcHBlZCA9IFN5bWJvbCgndW53cmFwcGVkJyk7XG52YXIgR2V0UHJvdG8gPSBTeW1ib2woJ2dldFByb3RvJyk7XG52YXIgT25HZXQgPSBTeW1ib2woJ29uR2V0Jyk7XG52YXIgT25BbGxHZXQgPSBTeW1ib2woJ29uQWxsR2V0Jyk7XG52YXIgQmluZENoYWluID0gU3ltYm9sKCdiaW5kQ2hhaW4nKTtcbnZhciBEZXNjcmlwdG9ycyA9IFN5bWJvbCgnRGVzY3JpcHRvcnMnKTtcbnZhciBCZWZvcmUgPSBTeW1ib2woJ0JlZm9yZScpO1xudmFyIEFmdGVyID0gU3ltYm9sKCdBZnRlcicpO1xudmFyIE5vR2V0dGVycyA9IFN5bWJvbCgnTm9HZXR0ZXJzJyk7XG52YXIgVHlwZWRBcnJheSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihJbnQ4QXJyYXkpO1xudmFyIFNldEl0ZXJhdG9yID0gU2V0LnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdO1xudmFyIE1hcEl0ZXJhdG9yID0gTWFwLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdO1xudmFyIHdpbiA9IGdsb2JhbFRoaXM7XG52YXIgZXhjbHVkZWRDbGFzc2VzID0gW3dpbi5Ob2RlLCB3aW4uRmlsZSwgd2luLk1hcCwgd2luLlNldCwgd2luLldlYWtNYXAsIHdpbi5XZWFrU2V0LCB3aW4uQXJyYXlCdWZmZXIsIHdpbi5SZXNpemVPYnNlcnZlciwgd2luLk11dGF0aW9uT2JzZXJ2ZXIsIHdpbi5QZXJmb3JtYW5jZU9ic2VydmVyLCB3aW4uSW50ZXJzZWN0aW9uT2JzZXJ2ZXIsIHdpbi5JREJDdXJzb3IsIHdpbi5JREJDdXJzb3JXaXRoVmFsdWUsIHdpbi5JREJEYXRhYmFzZSwgd2luLklEQkZhY3RvcnksIHdpbi5JREJJbmRleCwgd2luLklEQktleVJhbmdlLCB3aW4uSURCT2JqZWN0U3RvcmUsIHdpbi5JREJPcGVuREJSZXF1ZXN0LCB3aW4uSURCUmVxdWVzdCwgd2luLklEQlRyYW5zYWN0aW9uLCB3aW4uSURCVmVyc2lvbkNoYW5nZUV2ZW50LCB3aW4uRXZlbnQsIHdpbi5DdXN0b21FdmVudCwgd2luLkZpbGVTeXN0ZW1GaWxlSGFuZGxlXS5maWx0ZXIoZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufSk7XG5cbnZhciBCaW5kYWJsZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJpbmRhYmxlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCaW5kYWJsZSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQmluZGFibGUsIG51bGwsIFt7XG4gICAga2V5OiBcImlzQmluZGFibGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNCaW5kYWJsZShvYmplY3QpIHtcbiAgICAgIGlmICghb2JqZWN0IHx8ICFvYmplY3RbSXNCaW5kYWJsZV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0W0lzQmluZGFibGVdID09PSBCaW5kYWJsZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25EZWNrXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uRGVjayhvYmplY3QsIGtleSkge1xuICAgICAgcmV0dXJuIG9iamVjdFtEZWNrXVtrZXldIHx8IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVmKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG9iamVjdFtSZWZdIHx8IG9iamVjdCB8fCBmYWxzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFrZUJpbmRhYmxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1ha2VCaW5kYWJsZShvYmplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLm1ha2Uob2JqZWN0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2h1Y2tcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2h1Y2sob3JpZ2luYWwsIHNlZW4pIHtcbiAgICAgIHNlZW4gPSBzZWVuIHx8IG5ldyBNYXAoKTtcbiAgICAgIHZhciBjbG9uZSA9IHt9O1xuXG4gICAgICBpZiAob3JpZ2luYWwgaW5zdGFuY2VvZiBUeXBlZEFycmF5IHx8IG9yaWdpbmFsIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgdmFyIF9jbG9uZSA9IG9yaWdpbmFsLnNsaWNlKDApO1xuXG4gICAgICAgIHNlZW4uc2V0KG9yaWdpbmFsLCBfY2xvbmUpO1xuICAgICAgICByZXR1cm4gX2Nsb25lO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvcGVydGllcyA9IE9iamVjdC5rZXlzKG9yaWdpbmFsKTtcblxuICAgICAgZm9yICh2YXIgaSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIHZhciBpaSA9IHByb3BlcnRpZXNbaV07XG5cbiAgICAgICAgaWYgKGlpLnN1YnN0cmluZygwLCAzKSA9PT0gJ19fXycpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbHJlYWR5Q2xvbmVkID0gc2Vlbi5nZXQob3JpZ2luYWxbaWldKTtcblxuICAgICAgICBpZiAoYWxyZWFkeUNsb25lZCkge1xuICAgICAgICAgIGNsb25lW2lpXSA9IGFscmVhZHlDbG9uZWQ7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3JpZ2luYWxbaWldID09PSBvcmlnaW5hbCkge1xuICAgICAgICAgIHNlZW4uc2V0KG9yaWdpbmFsW2lpXSwgY2xvbmUpO1xuICAgICAgICAgIGNsb25lW2lpXSA9IGNsb25lO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9yaWdpbmFsW2lpXSAmJiBfdHlwZW9mKG9yaWdpbmFsW2lpXSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdmFyIG9yaWdpbmFsUHJvcCA9IG9yaWdpbmFsW2lpXTtcblxuICAgICAgICAgIGlmIChCaW5kYWJsZS5pc0JpbmRhYmxlKG9yaWdpbmFsW2lpXSkpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsUHJvcCA9IG9yaWdpbmFsW2lpXVtPcmlnaW5hbF07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2xvbmVbaWldID0gdGhpcy5zaHVjayhvcmlnaW5hbFByb3AsIHNlZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNsb25lW2lpXSA9IG9yaWdpbmFsW2lpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlZW4uc2V0KG9yaWdpbmFsW2lpXSwgY2xvbmVbaWldKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEJpbmRhYmxlLmlzQmluZGFibGUob3JpZ2luYWwpKSB7XG4gICAgICAgIGRlbGV0ZSBjbG9uZS5iaW5kVG87XG4gICAgICAgIGRlbGV0ZSBjbG9uZS5pc0JvdW5kO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1ha2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFrZShvYmplY3QpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmICghb2JqZWN0IHx8ICFbJ2Z1bmN0aW9uJywgJ29iamVjdCddLmluY2x1ZGVzKF90eXBlb2Yob2JqZWN0KSkpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH1cblxuICAgICAgaWYgKE9iamVjdC5pc1NlYWxlZChvYmplY3QpIHx8IE9iamVjdC5pc0Zyb3plbihvYmplY3QpIHx8ICFPYmplY3QuaXNFeHRlbnNpYmxlKG9iamVjdCkgfHwgZXhjbHVkZWRDbGFzc2VzLmZpbHRlcihmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgeDtcbiAgICAgIH0pLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqZWN0W1JlZl0pIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFtSZWZdO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqZWN0W0lzQmluZGFibGVdKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIElzQmluZGFibGUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IEJpbmRhYmxlXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIFJlZiwge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIE9yaWdpbmFsLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBvYmplY3RcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgRGVjaywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZToge31cbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgQmluZGluZywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZToge31cbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgU3ViQmluZGluZywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogbmV3IE1hcCgpXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIEJpbmRpbmdBbGwsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IFtdXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIEV4ZWN1dGluZywge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgV3JhcHBpbmcsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIFN0YWNrLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBbXVxuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBCZWZvcmUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IFtdXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIEFmdGVyLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBbXVxuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBXcmFwcGVkLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBuZXcgTWFwKClcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgVW53cmFwcGVkLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiB7fVxuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBEZXNjcmlwdG9ycywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogbmV3IE1hcCgpXG4gICAgICB9KTtcblxuICAgICAgdmFyIGJpbmRUbyA9IGZ1bmN0aW9uIGJpbmRUbyhwcm9wZXJ0eSkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgICAgICAgdmFyIGJpbmRUb0FsbCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BlcnR5KSkge1xuICAgICAgICAgIHZhciBkZWJpbmRlcnMgPSBwcm9wZXJ0eS5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZFRvKHAsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlYmluZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BlcnR5IGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICBvcHRpb25zID0gY2FsbGJhY2sgfHwge307XG4gICAgICAgICAgY2FsbGJhY2sgPSBwcm9wZXJ0eTtcbiAgICAgICAgICBiaW5kVG9BbGwgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZGVsYXkgPj0gMCkge1xuICAgICAgICAgIGNhbGxiYWNrID0gX3RoaXMud3JhcERlbGF5Q2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMuZGVsYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMudGhyb3R0bGUgPj0gMCkge1xuICAgICAgICAgIGNhbGxiYWNrID0gX3RoaXMud3JhcFRocm90dGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMudGhyb3R0bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMud2FpdCA+PSAwKSB7XG4gICAgICAgICAgY2FsbGJhY2sgPSBfdGhpcy53cmFwV2FpdENhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zLndhaXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZnJhbWUpIHtcbiAgICAgICAgICBjYWxsYmFjayA9IF90aGlzLndyYXBGcmFtZUNhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zLmZyYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmlkbGUpIHtcbiAgICAgICAgICBjYWxsYmFjayA9IF90aGlzLndyYXBJZGxlQ2FsbGJhY2soY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpbmRUb0FsbCkge1xuICAgICAgICAgIHZhciBiaW5kSW5kZXggPSBvYmplY3RbQmluZGluZ0FsbF0ubGVuZ3RoO1xuICAgICAgICAgIG9iamVjdFtCaW5kaW5nQWxsXS5wdXNoKGNhbGxiYWNrKTtcblxuICAgICAgICAgIGlmICghKCdub3cnIGluIG9wdGlvbnMpIHx8IG9wdGlvbnMubm93KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9iamVjdCkge1xuICAgICAgICAgICAgICBjYWxsYmFjayhvYmplY3RbaV0sIGksIG9iamVjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWxldGUgb2JqZWN0W0JpbmRpbmdBbGxdW2JpbmRJbmRleF07XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XSkge1xuICAgICAgICAgIG9iamVjdFtCaW5kaW5nXVtwcm9wZXJ0eV0gPSBuZXcgU2V0KCk7XG4gICAgICAgIH0gLy8gbGV0IGJpbmRJbmRleCA9IG9iamVjdFtCaW5kaW5nXVtwcm9wZXJ0eV0ubGVuZ3RoO1xuXG5cbiAgICAgICAgaWYgKG9wdGlvbnMuY2hpbGRyZW4pIHtcbiAgICAgICAgICB2YXIgb3JpZ2luYWwgPSBjYWxsYmFjaztcblxuICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHYgPSBhcmdzWzBdO1xuICAgICAgICAgICAgdmFyIHN1YkRlYmluZCA9IG9iamVjdFtTdWJCaW5kaW5nXS5nZXQob3JpZ2luYWwpO1xuXG4gICAgICAgICAgICBpZiAoc3ViRGViaW5kKSB7XG4gICAgICAgICAgICAgIG9iamVjdFtTdWJCaW5kaW5nXVtcImRlbGV0ZVwiXShvcmlnaW5hbCk7XG4gICAgICAgICAgICAgIHN1YkRlYmluZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3R5cGVvZih2KSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgb3JpZ2luYWwuYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdnYgPSBCaW5kYWJsZS5tYWtlKHYpO1xuXG4gICAgICAgICAgICBpZiAoQmluZGFibGUuaXNCaW5kYWJsZSh2dikpIHtcbiAgICAgICAgICAgICAgb2JqZWN0W1N1YkJpbmRpbmddLnNldChvcmlnaW5hbCwgdnYuYmluZFRvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIHN1YkFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgICAgICAgICAgIHN1YkFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWwuYXBwbHkodm9pZCAwLCBhcmdzLmNvbmNhdChzdWJBcmdzKSk7XG4gICAgICAgICAgICAgIH0sIE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogZmFsc2VcbiAgICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3JpZ2luYWwuYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XS5hZGQoY2FsbGJhY2spO1xuXG4gICAgICAgIGlmICghKCdub3cnIGluIG9wdGlvbnMpIHx8IG9wdGlvbnMubm93KSB7XG4gICAgICAgICAgY2FsbGJhY2sob2JqZWN0W3Byb3BlcnR5XSwgcHJvcGVydHksIG9iamVjdCwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlYmluZGVyID0gZnVuY3Rpb24gZGViaW5kZXIoKSB7XG4gICAgICAgICAgdmFyIHN1YkRlYmluZCA9IG9iamVjdFtTdWJCaW5kaW5nXS5nZXQoY2FsbGJhY2spO1xuXG4gICAgICAgICAgaWYgKHN1YkRlYmluZCkge1xuICAgICAgICAgICAgb2JqZWN0W1N1YkJpbmRpbmddW1wiZGVsZXRlXCJdKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHN1YkRlYmluZCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XS5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JqZWN0W0JpbmRpbmddW3Byb3BlcnR5XVtcImRlbGV0ZVwiXShjYWxsYmFjayk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucmVtb3ZlV2l0aCAmJiBvcHRpb25zLnJlbW92ZVdpdGggaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICAgICAgb3B0aW9ucy5yZW1vdmVXaXRoLm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWJpbmRlcjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWJpbmRlcjtcbiAgICAgIH07XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdiaW5kVG8nLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBiaW5kVG9cbiAgICAgIH0pO1xuXG4gICAgICB2YXIgX19fYmVmb3JlID0gZnVuY3Rpb24gX19fYmVmb3JlKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBiZWZvcmVJbmRleCA9IG9iamVjdFtCZWZvcmVdLmxlbmd0aDtcbiAgICAgICAgb2JqZWN0W0JlZm9yZV0ucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHZhciBjbGVhbmVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGNsZWFuZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjbGVhbmVkID0gdHJ1ZTtcbiAgICAgICAgICBkZWxldGUgb2JqZWN0W0JlZm9yZV1bYmVmb3JlSW5kZXhdO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgdmFyIF9fX2FmdGVyID0gZnVuY3Rpb24gX19fYWZ0ZXIoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGFmdGVySW5kZXggPSBvYmplY3RbQWZ0ZXJdLmxlbmd0aDtcbiAgICAgICAgb2JqZWN0W0FmdGVyXS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgdmFyIGNsZWFuZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoY2xlYW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNsZWFuZWQgPSB0cnVlO1xuICAgICAgICAgIGRlbGV0ZSBvYmplY3RbQWZ0ZXJdW2FmdGVySW5kZXhdO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgQmluZENoYWluLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShwYXRoLCBjYWxsYmFjaykge1xuICAgICAgICAgIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICAgICAgICB2YXIgbm9kZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICAgICAgdmFyIHN1YlBhcnRzID0gcGFydHMuc2xpY2UoMCk7XG4gICAgICAgICAgdmFyIGRlYmluZCA9IFtdO1xuICAgICAgICAgIGRlYmluZC5wdXNoKG9iamVjdC5iaW5kVG8obm9kZSwgZnVuY3Rpb24gKHYsIGssIHQsIGQpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gc3ViUGFydHMuam9pbignLicpO1xuXG4gICAgICAgICAgICBpZiAoc3ViUGFydHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHYsIGssIHQsIGQpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdiA9IHRba10gPSBfdGhpcy5tYWtlQmluZGFibGUoe30pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWJpbmQgPSBkZWJpbmQuY29uY2F0KHZbQmluZENoYWluXShyZXN0LCBjYWxsYmFjaykpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlYmluZC5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgIHJldHVybiB4KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICdfX19iZWZvcmUnLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBfX19iZWZvcmVcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ19fX2FmdGVyJywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogX19fYWZ0ZXJcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgaXNCb3VuZCA9IGZ1bmN0aW9uIGlzQm91bmQoKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gb2JqZWN0W0JpbmRpbmdBbGxdKSB7XG4gICAgICAgICAgaWYgKG9iamVjdFtCaW5kaW5nQWxsXVtpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgX2kgaW4gb2JqZWN0W0JpbmRpbmddKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiBpbiBvYmplY3RbQmluZGluZ11bX2ldKSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0W0JpbmRpbmddW19pXVtqXSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnaXNCb3VuZCcsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IGlzQm91bmRcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICAgIGlmIChvYmplY3RbaV0gJiYgb2JqZWN0W2ldIGluc3RhbmNlb2YgT2JqZWN0ICYmICFvYmplY3RbaV0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgaWYgKCFleGNsdWRlZENsYXNzZXMuZmlsdGVyKGZ1bmN0aW9uIChleGNsdWRlQ2xhc3MpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmplY3RbaV0gaW5zdGFuY2VvZiBleGNsdWRlQ2xhc3M7XG4gICAgICAgICAgfSkubGVuZ3RoICYmIE9iamVjdC5pc0V4dGVuc2libGUob2JqZWN0W2ldKSAmJiAhT2JqZWN0LmlzU2VhbGVkKG9iamVjdFtpXSkpIHtcbiAgICAgICAgICAgIG9iamVjdFtpXSA9IEJpbmRhYmxlLm1ha2Uob2JqZWN0W2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgaW4gb2JqZWN0KSB7XG4gICAgICAgIF9sb29wKGkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2V0ID0gZnVuY3Rpb24gc2V0KHRhcmdldCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAod3JhcHBlZC5oYXMoa2V5KSkge1xuICAgICAgICAgIHdyYXBwZWRbXCJkZWxldGVcIl0oa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrZXkgPT09IE9yaWdpbmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb25EZWNrID0gb2JqZWN0W0RlY2tdO1xuXG4gICAgICAgIGlmIChvbkRlY2tba2V5XSAhPT0gdW5kZWZpbmVkICYmIG9uRGVja1trZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleS5zbGljZSAmJiBrZXkuc2xpY2UoLTMpID09PSAnX19fJykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldFtrZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgaWYgKCFleGNsdWRlZENsYXNzZXMuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgeDtcbiAgICAgICAgICB9KS5sZW5ndGggJiYgT2JqZWN0LmlzRXh0ZW5zaWJsZShvYmplY3QpICYmICFPYmplY3QuaXNTZWFsZWQob2JqZWN0KSkge1xuICAgICAgICAgICAgaWYgKCFvYmplY3RbTm9HZXR0ZXJzXSkge31cblxuICAgICAgICAgICAgdmFsdWUgPSBCaW5kYWJsZS5tYWtlQmluZGFibGUodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9uRGVja1trZXldID0gdmFsdWU7XG5cbiAgICAgICAgZm9yICh2YXIgX2kyIGluIG9iamVjdFtCaW5kaW5nQWxsXSkge1xuICAgICAgICAgIGlmICghb2JqZWN0W0JpbmRpbmdBbGxdW19pMl0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9iamVjdFtCaW5kaW5nQWxsXVtfaTJdKHZhbHVlLCBrZXksIHRhcmdldCwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0b3AgPSBmYWxzZTtcblxuICAgICAgICBpZiAoa2V5IGluIG9iamVjdFtCaW5kaW5nXSkge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvYmplY3RbQmluZGluZ11ba2V5XSksXG4gICAgICAgICAgICAgIF9zdGVwO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IF9zdGVwLnZhbHVlO1xuXG4gICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwga2V5LCB0YXJnZXQsIGZhbHNlLCB0YXJnZXRba2V5XSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc3RvcCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvci5mKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG9uRGVja1trZXldO1xuXG4gICAgICAgIGlmICghc3RvcCkge1xuICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gICAgICAgICAgdmFyIGV4Y2x1ZGVkID0gdGFyZ2V0IGluc3RhbmNlb2YgRmlsZSAmJiBrZXkgPT0gJ2xhc3RNb2RpZmllZERhdGUnO1xuXG4gICAgICAgICAgaWYgKCFleGNsdWRlZCAmJiAoIWRlc2NyaXB0b3IgfHwgZGVzY3JpcHRvci53cml0YWJsZSkgJiYgdGFyZ2V0W2tleV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHQgPSBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUpO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgb2JqZWN0W0JpbmRpbmddWydsZW5ndGgnXSkge1xuICAgICAgICAgIGZvciAodmFyIF9pMyBpbiBvYmplY3RbQmluZGluZ11bJ2xlbmd0aCddKSB7XG4gICAgICAgICAgICB2YXIgX2NhbGxiYWNrID0gb2JqZWN0W0JpbmRpbmddWydsZW5ndGgnXVtfaTNdO1xuXG4gICAgICAgICAgICBfY2FsbGJhY2sodGFyZ2V0Lmxlbmd0aCwgJ2xlbmd0aCcsIHRhcmdldCwgZmFsc2UsIHRhcmdldC5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuXG4gICAgICB2YXIgZGVsZXRlUHJvcGVydHkgPSBmdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICAgICAgICB2YXIgb25EZWNrID0gb2JqZWN0W0RlY2tdO1xuXG4gICAgICAgIGlmIChvbkRlY2tba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIShrZXkgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlc2NyaXB0b3JzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ycy5nZXQoa2V5KTtcblxuICAgICAgICAgIGlmIChkZXNjcmlwdG9yICYmICFkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRlc2NyaXB0b3JzW1wiZGVsZXRlXCJdKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkRlY2tba2V5XSA9IG51bGw7XG5cbiAgICAgICAgaWYgKHdyYXBwZWQuaGFzKGtleSkpIHtcbiAgICAgICAgICB3cmFwcGVkW1wiZGVsZXRlXCJdKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBfaTQgaW4gb2JqZWN0W0JpbmRpbmdBbGxdKSB7XG4gICAgICAgICAgb2JqZWN0W0JpbmRpbmdBbGxdW19pNF0odW5kZWZpbmVkLCBrZXksIHRhcmdldCwgdHJ1ZSwgdGFyZ2V0W2tleV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3RbQmluZGluZ10pIHtcbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yMiA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG9iamVjdFtCaW5kaW5nXVtrZXldKSxcbiAgICAgICAgICAgICAgX3N0ZXAyO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMi5zKCk7ICEoX3N0ZXAyID0gX2l0ZXJhdG9yMi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBiaW5kaW5nID0gX3N0ZXAyLnZhbHVlO1xuICAgICAgICAgICAgICBiaW5kaW5nKHVuZGVmaW5lZCwga2V5LCB0YXJnZXQsIHRydWUsIHRhcmdldFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjIuZShlcnIpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IyLmYoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgb25EZWNrW2tleV07XG4gICAgICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICB2YXIgY29uc3RydWN0ID0gZnVuY3Rpb24gY29uc3RydWN0KHRhcmdldCwgYXJncykge1xuICAgICAgICB2YXIga2V5ID0gJ2NvbnN0cnVjdG9yJztcblxuICAgICAgICBmb3IgKHZhciBfaTUgaW4gdGFyZ2V0W0JlZm9yZV0pIHtcbiAgICAgICAgICB0YXJnZXRbQmVmb3JlXVtfaTVdKHRhcmdldCwga2V5LCBvYmplY3RbU3RhY2tdLCB1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluc3RhbmNlID0gQmluZGFibGUubWFrZShfY29uc3RydWN0KHRhcmdldFtPcmlnaW5hbF0sIF90b0NvbnN1bWFibGVBcnJheShhcmdzKSkpO1xuXG4gICAgICAgIGZvciAodmFyIF9pNiBpbiB0YXJnZXRbQWZ0ZXJdKSB7XG4gICAgICAgICAgdGFyZ2V0W0FmdGVyXVtfaTZdKHRhcmdldCwga2V5LCBvYmplY3RbU3RhY2tdLCBpbnN0YW5jZSwgYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICB9O1xuXG4gICAgICB2YXIgZGVzY3JpcHRvcnMgPSBvYmplY3RbRGVzY3JpcHRvcnNdO1xuICAgICAgdmFyIHdyYXBwZWQgPSBvYmplY3RbV3JhcHBlZF07XG4gICAgICB2YXIgc3RhY2sgPSBvYmplY3RbU3RhY2tdO1xuXG4gICAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gZ2V0KHRhcmdldCwga2V5KSB7XG4gICAgICAgIGlmICh3cmFwcGVkLmhhcyhrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuIHdyYXBwZWQuZ2V0KGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5ID09PSBSZWYgfHwga2V5ID09PSBPcmlnaW5hbCB8fCBrZXkgPT09ICdhcHBseScgfHwga2V5ID09PSAnaXNCb3VuZCcgfHwga2V5ID09PSAnYmluZFRvJyB8fCBrZXkgPT09ICdfX3Byb3RvX18nIHx8IGtleSA9PT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICAgIHJldHVybiBvYmplY3Rba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZXNjcmlwdG9yO1xuXG4gICAgICAgIGlmIChkZXNjcmlwdG9ycy5oYXMoa2V5KSkge1xuICAgICAgICAgIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ycy5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG4gICAgICAgICAgZGVzY3JpcHRvcnMuc2V0KGtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci5jb25maWd1cmFibGUgJiYgIWRlc2NyaXB0b3Iud3JpdGFibGUpIHtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT25BbGxHZXQgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIG9iamVjdFtPbkFsbEdldF0oa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPbkdldCBpbiBvYmplY3QgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICAgIHJldHVybiBvYmplY3RbT25HZXRdKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci5jb25maWd1cmFibGUgJiYgIWRlc2NyaXB0b3Iud3JpdGFibGUpIHtcbiAgICAgICAgICB3cmFwcGVkLnNldChrZXksIG9iamVjdFtrZXldKTtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9iamVjdFtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKE5hbWVzIGluIG9iamVjdFtrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdFtVbndyYXBwZWRdLCBrZXksIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IG9iamVjdFtrZXldXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgICAgIHZhciBpc01ldGhvZCA9IHByb3RvdHlwZVtrZXldID09PSBvYmplY3Rba2V5XTtcbiAgICAgICAgICB2YXIgb2JqUmVmID0gdHlwZW9mIFByb21pc2UgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgTWFwID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIE1hcCB8fCB0eXBlb2YgU2V0ID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIFNldCB8fCB0eXBlb2YgTWFwSXRlcmF0b3IgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0LnByb3RvdHlwZSA9PT0gTWFwSXRlcmF0b3IgfHwgdHlwZW9mIFNldEl0ZXJhdG9yID09PSAnZnVuY3Rpb24nICYmIG9iamVjdC5wcm90b3R5cGUgPT09IFNldEl0ZXJhdG9yIHx8IHR5cGVvZiBTZXRJdGVyYXRvciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmplY3QucHJvdG90eXBlID09PSBTZXRJdGVyYXRvciB8fCB0eXBlb2YgV2Vha01hcCA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmplY3QgaW5zdGFuY2VvZiBXZWFrTWFwIHx8IHR5cGVvZiBXZWFrU2V0ID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIFdlYWtTZXQgfHwgdHlwZW9mIERhdGUgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgRGF0ZSB8fCB0eXBlb2YgVHlwZWRBcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmplY3QgaW5zdGFuY2VvZiBUeXBlZEFycmF5IHx8IHR5cGVvZiBBcnJheUJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmplY3QgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCB0eXBlb2YgRXZlbnRUYXJnZXQgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgRXZlbnRUYXJnZXQgfHwgdHlwZW9mIFJlc2l6ZU9ic2VydmVyID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIFJlc2l6ZU9ic2VydmVyIHx8IHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyID09PSAnZnVuY3Rpb24nICYmIG9iamVjdCBpbnN0YW5jZW9mIE11dGF0aW9uT2JzZXJ2ZXIgfHwgdHlwZW9mIFBlcmZvcm1hbmNlT2JzZXJ2ZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgUGVyZm9ybWFuY2VPYnNlcnZlciB8fCB0eXBlb2YgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0IGluc3RhbmNlb2YgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgfHwgdHlwZW9mIG9iamVjdFtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nICYmIGtleSA9PT0gJ25leHQnID8gb2JqZWN0IDogb2JqZWN0W1JlZl07XG5cbiAgICAgICAgICB2YXIgd3JhcHBlZE1ldGhvZCA9IGZ1bmN0aW9uIHdyYXBwZWRNZXRob2QoKSB7XG4gICAgICAgICAgICBvYmplY3RbRXhlY3V0aW5nXSA9IGtleTtcbiAgICAgICAgICAgIHN0YWNrLnVuc2hpZnQoa2V5KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBwcm92aWRlZEFyZ3MgPSBuZXcgQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgICAgICAgICAgcHJvdmlkZWRBcmdzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3IzID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIob2JqZWN0W0JlZm9yZV0pLFxuICAgICAgICAgICAgICAgIF9zdGVwMztcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZm9yIChfaXRlcmF0b3IzLnMoKTsgIShfc3RlcDMgPSBfaXRlcmF0b3IzLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmVmb3JlQ2FsbGJhY2sgPSBfc3RlcDMudmFsdWU7XG4gICAgICAgICAgICAgICAgYmVmb3JlQ2FsbGJhY2sob2JqZWN0LCBrZXksIHN0YWNrLCBvYmplY3QsIHByb3ZpZGVkQXJncyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBfaXRlcmF0b3IzLmUoZXJyKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIF9pdGVyYXRvcjMuZigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmV0O1xuXG4gICAgICAgICAgICBpZiAobmV3LnRhcmdldCkge1xuICAgICAgICAgICAgICByZXQgPSBfY29uc3RydWN0KG9iamVjdFtVbndyYXBwZWRdW2tleV0sIHByb3ZpZGVkQXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgZnVuYyA9IG9iamVjdFtVbndyYXBwZWRdW2tleV07XG5cbiAgICAgICAgICAgICAgaWYgKGlzTWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gZnVuYy5hcHBseShvYmpSZWYgfHwgb2JqZWN0LCBwcm92aWRlZEFyZ3MpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCA9IGZ1bmMuYXBwbHkodm9pZCAwLCBwcm92aWRlZEFyZ3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfaXRlcmF0b3I0ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIob2JqZWN0W0FmdGVyXSksXG4gICAgICAgICAgICAgICAgX3N0ZXA0O1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmb3IgKF9pdGVyYXRvcjQucygpOyAhKF9zdGVwNCA9IF9pdGVyYXRvcjQubigpKS5kb25lOykge1xuICAgICAgICAgICAgICAgIHZhciBhZnRlckNhbGxiYWNrID0gX3N0ZXA0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGFmdGVyQ2FsbGJhY2sob2JqZWN0LCBrZXksIHN0YWNrLCBvYmplY3QsIHByb3ZpZGVkQXJncyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBfaXRlcmF0b3I0LmUoZXJyKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIF9pdGVyYXRvcjQuZigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvYmplY3RbRXhlY3V0aW5nXSA9IG51bGw7XG4gICAgICAgICAgICBzdGFjay5zaGlmdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgd3JhcHBlZE1ldGhvZFtOYW1lc10gPSB3cmFwcGVkTWV0aG9kW05hbWVzXSB8fCBuZXcgV2Vha01hcCgpO1xuICAgICAgICAgIHdyYXBwZWRNZXRob2RbTmFtZXNdLnNldChvYmplY3QsIGtleSk7XG5cbiAgICAgICAgICB3cmFwcGVkTWV0aG9kW09uQWxsR2V0XSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHZhciBzZWxmTmFtZSA9IHdyYXBwZWRNZXRob2RbTmFtZXNdLmdldChvYmplY3QpO1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFtzZWxmTmFtZV1ba2V5XTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHJlc3VsdCA9IEJpbmRhYmxlLm1ha2Uod3JhcHBlZE1ldGhvZCk7XG4gICAgICAgICAgd3JhcHBlZC5zZXQoa2V5LCByZXN1bHQpO1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICB9O1xuXG4gICAgICB2YXIgZ2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZih0YXJnZXQpIHtcbiAgICAgICAgaWYgKEdldFByb3RvIGluIG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBvYmplY3RbR2V0UHJvdG9dO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBoYW5kbGVyID0ge1xuICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgc2V0OiBzZXQsXG4gICAgICAgIGNvbnN0cnVjdDogY29uc3RydWN0LFxuICAgICAgICBnZXRQcm90b3R5cGVPZjogZ2V0UHJvdG90eXBlT2YsXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5OiBkZWxldGVQcm9wZXJ0eVxuICAgICAgfTtcblxuICAgICAgaWYgKG9iamVjdFtOb0dldHRlcnNdKSB7XG4gICAgICAgIGRlbGV0ZSBoYW5kbGVyLmdldDtcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgUmVmLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBuZXcgUHJveHkob2JqZWN0LCBoYW5kbGVyKVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0W1JlZl07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyQmluZGluZ3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJCaW5kaW5ncyhvYmplY3QpIHtcbiAgICAgIHZhciBjbGVhck9iaiA9IGZ1bmN0aW9uIGNsZWFyT2JqKG8pIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLm1hcChmdW5jdGlvbiAoaykge1xuICAgICAgICAgIHJldHVybiBkZWxldGUgb1trXTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgbWFwcyA9IGZ1bmN0aW9uIG1hcHMoZnVuYykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgb3MgPSBuZXcgQXJyYXkoX2xlbjQpLCBfa2V5NCA9IDA7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICAgICAgICAgIG9zW19rZXk0XSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG9zLm1hcChmdW5jKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBjbGVhck9ianMgPSBtYXBzKGNsZWFyT2JqKTtcbiAgICAgIGNsZWFyT2JqcyhvYmplY3RbV3JhcHBlZF0sIG9iamVjdFtCaW5kaW5nXSwgb2JqZWN0W0JpbmRpbmdBbGxdLCBvYmplY3RbQWZ0ZXJdLCBvYmplY3RbQmVmb3JlXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc29sdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzb2x2ZShvYmplY3QsIHBhdGgpIHtcbiAgICAgIHZhciBvd25lciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBwYXRoUGFydHMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgICB2YXIgdG9wID0gcGF0aFBhcnRzWzBdO1xuXG4gICAgICB3aGlsZSAocGF0aFBhcnRzLmxlbmd0aCkge1xuICAgICAgICBpZiAob3duZXIgJiYgcGF0aFBhcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHZhciBvYmogPSB0aGlzLm1ha2Uob2JqZWN0KTtcbiAgICAgICAgICByZXR1cm4gW29iaiwgcGF0aFBhcnRzLnNoaWZ0KCksIHRvcF07XG4gICAgICAgIH1cblxuICAgICAgICBub2RlID0gcGF0aFBhcnRzLnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKCFub2RlIGluIG9iamVjdCB8fCAhb2JqZWN0W25vZGVdIHx8ICEob2JqZWN0W25vZGVdIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgICAgIG9iamVjdFtub2RlXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqZWN0ID0gdGhpcy5tYWtlKG9iamVjdFtub2RlXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbdGhpcy5tYWtlKG9iamVjdCksIG5vZGUsIHRvcF07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndyYXBEZWxheUNhbGxiYWNrXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdyYXBEZWxheUNhbGxiYWNrKGNhbGxiYWNrLCBkZWxheSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3MpO1xuICAgICAgICB9LCBkZWxheSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ3cmFwVGhyb3R0bGVDYWxsYmFja1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cmFwVGhyb3R0bGVDYWxsYmFjayhjYWxsYmFjaywgdGhyb3R0bGUpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB0aGlzLnRocm90dGxlcy5zZXQoY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfdGhpczIudGhyb3R0bGVzLmdldChjYWxsYmFjaywgdHJ1ZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgX3RoaXMyLnRocm90dGxlcy5zZXQoY2FsbGJhY2ssIHRydWUpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzMi50aHJvdHRsZXMuc2V0KGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIH0sIHRocm90dGxlKTtcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndyYXBXYWl0Q2FsbGJhY2tcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd3JhcFdhaXRDYWxsYmFjayhjYWxsYmFjaywgd2FpdCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNiksIF9rZXk2ID0gMDsgX2tleTYgPCBfbGVuNjsgX2tleTYrKykge1xuICAgICAgICAgIGFyZ3NbX2tleTZdID0gYXJndW1lbnRzW19rZXk2XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3YWl0ZXI7XG5cbiAgICAgICAgaWYgKHdhaXRlciA9IF90aGlzMy53YWl0ZXJzLmdldChjYWxsYmFjaykpIHtcbiAgICAgICAgICBfdGhpczMud2FpdGVyc1tcImRlbGV0ZVwiXShjYWxsYmFjayk7XG5cbiAgICAgICAgICBjbGVhclRpbWVvdXQod2FpdGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdhaXRlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3MpO1xuICAgICAgICB9LCB3YWl0KTtcblxuICAgICAgICBfdGhpczMud2FpdGVycy5zZXQoY2FsbGJhY2ssIHdhaXRlcik7XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ3cmFwRnJhbWVDYWxsYmFja1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cmFwRnJhbWVDYWxsYmFjayhjYWxsYmFjaywgZnJhbWVzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBfbGVuNyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjcpLCBfa2V5NyA9IDA7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcbiAgICAgICAgICBhcmdzW19rZXk3XSA9IGFyZ3VtZW50c1tfa2V5N107XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndyYXBJZGxlQ2FsbGJhY2tcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd3JhcElkbGVDYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjggPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW44KSwgX2tleTggPSAwOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5OF0gPSBhcmd1bWVudHNbX2tleThdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29tcGF0aWJpbGl0eSBmb3IgU2FmYXJpIDA4LzIwMjBcbiAgICAgICAgdmFyIHJlcSA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrIHx8IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgcmVxKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBCaW5kYWJsZTtcbn0oKTtcblxuZXhwb3J0cy5CaW5kYWJsZSA9IEJpbmRhYmxlO1xuXG5fZGVmaW5lUHJvcGVydHkoQmluZGFibGUsIFwid2FpdGVyc1wiLCBuZXcgV2Vha01hcCgpKTtcblxuX2RlZmluZVByb3BlcnR5KEJpbmRhYmxlLCBcInRocm90dGxlc1wiLCBuZXcgV2Vha01hcCgpKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJpbmRhYmxlLCAnT25HZXQnLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiBPbkdldFxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmluZGFibGUsICdOb0dldHRlcnMnLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiBOb0dldHRlcnNcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJpbmRhYmxlLCAnR2V0UHJvdG8nLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiBHZXRQcm90b1xufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmluZGFibGUsICdPbkFsbEdldCcsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbiAgdmFsdWU6IE9uQWxsR2V0XG59KTtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9iYXNlL0NhY2hlLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5DYWNoZSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgQ2FjaGUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDYWNoZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2FjaGUpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENhY2hlLCBudWxsLCBbe1xuICAgIGtleTogXCJzdG9yZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9yZShrZXksIHZhbHVlLCBleHBpcnkpIHtcbiAgICAgIHZhciBidWNrZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6ICdzdGFuZGFyZCc7XG4gICAgICB2YXIgZXhwaXJhdGlvbiA9IDA7XG5cbiAgICAgIGlmIChleHBpcnkpIHtcbiAgICAgICAgZXhwaXJhdGlvbiA9IGV4cGlyeSAqIDEwMDAgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmJ1Y2tldHMpIHtcbiAgICAgICAgdGhpcy5idWNrZXRzID0gbmV3IE1hcCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuYnVja2V0cy5oYXMoYnVja2V0KSkge1xuICAgICAgICB0aGlzLmJ1Y2tldHMuc2V0KGJ1Y2tldCwgbmV3IE1hcCgpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGV2ZW50RW5kID0gbmV3IEN1c3RvbUV2ZW50KCdjdkNhY2hlU3RvcmUnLCB7XG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBleHBpcnk6IGV4cGlyeSxcbiAgICAgICAgICBidWNrZXQ6IGJ1Y2tldFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRFbmQpKSB7XG4gICAgICAgIHRoaXMuYnVja2V0cy5nZXQoYnVja2V0KS5zZXQoa2V5LCB7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIGV4cGlyYXRpb246IGV4cGlyYXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZChrZXkpIHtcbiAgICAgIHZhciBkZWZhdWx0dmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgICAgdmFyIGJ1Y2tldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJ3N0YW5kYXJkJztcbiAgICAgIHZhciBldmVudEVuZCA9IG5ldyBDdXN0b21FdmVudCgnY3ZDYWNoZUxvYWQnLCB7XG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIGRlZmF1bHR2YWx1ZTogZGVmYXVsdHZhbHVlLFxuICAgICAgICAgIGJ1Y2tldDogYnVja2V0XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRFbmQpKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0dmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJ1Y2tldHMgJiYgdGhpcy5idWNrZXRzLmhhcyhidWNrZXQpICYmIHRoaXMuYnVja2V0cy5nZXQoYnVja2V0KS5oYXMoa2V5KSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLmJ1Y2tldHMuZ2V0KGJ1Y2tldCkuZ2V0KGtleSk7IC8vIGNvbnNvbGUubG9nKHRoaXMuYnVja2V0W2J1Y2tldF1ba2V5XS5leHBpcmF0aW9uLCAobmV3IERhdGUpLmdldFRpbWUoKSk7XG5cbiAgICAgICAgaWYgKGVudHJ5LmV4cGlyYXRpb24gPT09IDAgfHwgZW50cnkuZXhwaXJhdGlvbiA+IG5ldyBEYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYnVja2V0cy5nZXQoYnVja2V0KS5nZXQoa2V5KS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGVmYXVsdHZhbHVlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDYWNoZTtcbn0oKTtcblxuZXhwb3J0cy5DYWNoZSA9IENhY2hlO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvQ29uZmlnLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5Db25maWcgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIEFwcENvbmZpZyA9IHt9O1xudmFyIF9yZXF1aXJlID0gcmVxdWlyZTtcblxudHJ5IHtcbiAgQXBwQ29uZmlnID0gX3JlcXVpcmUoJy9Db25maWcnKS5Db25maWcgfHwge307XG59IGNhdGNoIChlcnJvcikge1xuICB3aW5kb3cuZGV2TW9kZSA9PT0gdHJ1ZSAmJiBjb25zb2xlLmVycm9yKGVycm9yKTtcbn1cblxudmFyIENvbmZpZyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENvbmZpZygpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29uZmlnKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDb25maWcsIG51bGwsIFt7XG4gICAga2V5OiBcImdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQobmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnc1tuYW1lXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldChuYW1lLCB2YWx1ZSkge1xuICAgICAgdGhpcy5jb25maWdzW25hbWVdID0gdmFsdWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHVtcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkdW1wKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlncztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaW5pdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGNvbmZpZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIGNvbmZpZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgaW4gY29uZmlncykge1xuICAgICAgICB2YXIgY29uZmlnID0gY29uZmlnc1tpXTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb25maWcgPSBKU09OLnBhcnNlKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBuYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbmZpZ1tuYW1lXTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWdzW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENvbmZpZztcbn0oKTtcblxuZXhwb3J0cy5Db25maWcgPSBDb25maWc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQ29uZmlnLCAnY29uZmlncycsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbiAgdmFsdWU6IEFwcENvbmZpZ1xufSk7XG4gIH0pKCk7XG59KTsiLCJcbnJlcXVpcmUucmVnaXN0ZXIoXCJjdXJ2YXR1cmUvYmFzZS9Eb20uanNcIiwgZnVuY3Rpb24oZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlKSB7XG4gIHJlcXVpcmUgPSBfX21ha2VSZWxhdGl2ZVJlcXVpcmUocmVxdWlyZSwge30sIFwiY3VydmF0dXJlXCIpO1xuICAoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLkRvbSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgdHJhdmVyc2FscyA9IDA7XG5cbnZhciBEb20gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEb20oKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERvbSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRG9tLCBudWxsLCBbe1xuICAgIGtleTogXCJtYXBUYWdzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcFRhZ3MoZG9jLCBzZWxlY3RvciwgY2FsbGJhY2ssIHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgdmFyIHN0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICBpZiAoc3RhcnROb2RlKSB7XG4gICAgICAgIHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVuZGVkID0gZmFsc2U7XG4gICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoZG9jLCBOb2RlRmlsdGVyLlNIT1dfRUxFTUVOVCB8IE5vZGVGaWx0ZXIuU0hPV19URVhULCB7XG4gICAgICAgIGFjY2VwdE5vZGU6IGZ1bmN0aW9uIGFjY2VwdE5vZGUobm9kZSwgd2Fsa2VyKSB7XG4gICAgICAgICAgaWYgKCFzdGFydGVkKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gc3RhcnROb2RlKSB7XG4gICAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIE5vZGVGaWx0ZXIuRklMVEVSX1NLSVA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGVuZE5vZGUgJiYgbm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgICAgICAgZW5kZWQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlbmRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIE5vZGVGaWx0ZXIuRklMVEVSX1NLSVA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgaWYgKG5vZGUubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTm9kZUZpbHRlci5GSUxURVJfQUNDRVBUO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBOb2RlRmlsdGVyLkZJTFRFUl9TS0lQO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBOb2RlRmlsdGVyLkZJTFRFUl9BQ0NFUFQ7XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICAgIHZhciB0cmF2ZXJzYWwgPSB0cmF2ZXJzYWxzKys7XG5cbiAgICAgIHdoaWxlICh0cmVlV2Fsa2VyLm5leHROb2RlKCkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goY2FsbGJhY2sodHJlZVdhbGtlci5jdXJyZW50Tm9kZSwgdHJlZVdhbGtlcikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaXNwYXRjaEV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoZG9jLCBldmVudCkge1xuICAgICAgZG9jLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgRG9tLm1hcFRhZ3MoZG9jLCBmYWxzZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEb207XG59KCk7XG5cbmV4cG9ydHMuRG9tID0gRG9tO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvTWl4aW4uanNcIiwgZnVuY3Rpb24oZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlKSB7XG4gIHJlcXVpcmUgPSBfX21ha2VSZWxhdGl2ZVJlcXVpcmUocmVxdWlyZSwge30sIFwiY3VydmF0dXJlXCIpO1xuICAoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLk1peGluID0gdm9pZCAwO1xuXG52YXIgX0JpbmRhYmxlID0gcmVxdWlyZShcIi4vQmluZGFibGVcIik7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpOyB9XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobywgYWxsb3dBcnJheUxpa2UpIHsgdmFyIGl0ID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0gfHwgb1tcIkBAaXRlcmF0b3JcIl07IGlmICghaXQpIHsgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgeyBpZiAoaXQpIG8gPSBpdDsgdmFyIGkgPSAwOyB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7fTsgcmV0dXJuIHsgczogRiwgbjogZnVuY3Rpb24gbigpIHsgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7IGRvbmU6IHRydWUgfTsgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBvW2krK10gfTsgfSwgZTogZnVuY3Rpb24gZShfZSkgeyB0aHJvdyBfZTsgfSwgZjogRiB9OyB9IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gaXRlcmF0ZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfSB2YXIgbm9ybWFsQ29tcGxldGlvbiA9IHRydWUsIGRpZEVyciA9IGZhbHNlLCBlcnI7IHJldHVybiB7IHM6IGZ1bmN0aW9uIHMoKSB7IGl0ID0gaXQuY2FsbChvKTsgfSwgbjogZnVuY3Rpb24gbigpIHsgdmFyIHN0ZXAgPSBpdC5uZXh0KCk7IG5vcm1hbENvbXBsZXRpb24gPSBzdGVwLmRvbmU7IHJldHVybiBzdGVwOyB9LCBlOiBmdW5jdGlvbiBlKF9lMikgeyBkaWRFcnIgPSB0cnVlOyBlcnIgPSBfZTI7IH0sIGY6IGZ1bmN0aW9uIGYoKSB7IHRyeSB7IGlmICghbm9ybWFsQ29tcGxldGlvbiAmJiBpdFtcInJldHVyblwiXSAhPSBudWxsKSBpdFtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoZGlkRXJyKSB0aHJvdyBlcnI7IH0gfSB9OyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSBlbHNlIGlmIChjYWxsICE9PSB2b2lkIDApIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkRlcml2ZWQgY29uc3RydWN0b3JzIG1heSBvbmx5IHJldHVybiBvYmplY3Qgb3IgdW5kZWZpbmVkXCIpOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IEJvb2xlYW4ucHJvdG90eXBlLnZhbHVlT2YuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChCb29sZWFuLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBDb25zdHJ1Y3RvciA9IFN5bWJvbCgnY29uc3RydWN0b3InKTtcbnZhciBNaXhpbkxpc3QgPSBTeW1ib2woJ21peGluTGlzdCcpO1xuXG52YXIgTWl4aW4gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNaXhpbigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWl4aW4pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE1peGluLCBudWxsLCBbe1xuICAgIGtleTogXCJmcm9tXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZyb20oYmFzZUNsYXNzKSB7XG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgbWl4aW5zID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgbWl4aW5zW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld0NsYXNzID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfYmFzZUNsYXNzKSB7XG4gICAgICAgIF9pbmhlcml0cyhuZXdDbGFzcywgX2Jhc2VDbGFzcyk7XG5cbiAgICAgICAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihuZXdDbGFzcyk7XG5cbiAgICAgICAgZnVuY3Rpb24gbmV3Q2xhc3MoKSB7XG4gICAgICAgICAgdmFyIF90aGlzO1xuXG4gICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIG5ld0NsYXNzKTtcblxuICAgICAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICAgICAgYXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGJhc2VDbGFzcy5jb25zdHJ1Y3RvciA/IF90aGlzID0gX3N1cGVyLmNhbGwuYXBwbHkoX3N1cGVyLCBbdGhpc10uY29uY2F0KGFyZ3MpKSA6IG51bGw7XG5cbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobWl4aW5zKSxcbiAgICAgICAgICAgICAgX3N0ZXA7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3IucygpOyAhKF9zdGVwID0gX2l0ZXJhdG9yLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIG1peGluID0gX3N0ZXAudmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKG1peGluW01peGluLkNvbnN0cnVjdG9yXSkge1xuICAgICAgICAgICAgICAgIG1peGluW01peGluLkNvbnN0cnVjdG9yXS5hcHBseShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzd2l0Y2ggKF90eXBlb2YobWl4aW4pKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgICAgICAgTWl4aW4ubWl4Q2xhc3MobWl4aW4sIG5ld0NsYXNzKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgICAgICAgIE1peGluLm1peE9iamVjdChtaXhpbiwgX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvci5mKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKF90aGlzLCBpbnN0YW5jZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3Q2xhc3M7XG4gICAgICB9KGJhc2VDbGFzcyk7XG5cbiAgICAgIHJldHVybiBuZXdDbGFzcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG8oYmFzZSkge1xuICAgICAgdmFyIGRlc2NyaXB0b3JzID0ge307XG5cbiAgICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgbWl4aW5zID0gbmV3IEFycmF5KF9sZW4zID4gMSA/IF9sZW4zIC0gMSA6IDApLCBfa2V5MyA9IDE7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgICAgbWl4aW5zW19rZXkzIC0gMV0gPSBhcmd1bWVudHNbX2tleTNdO1xuICAgICAgfVxuXG4gICAgICBtaXhpbnMubWFwKGZ1bmN0aW9uIChtaXhpbikge1xuICAgICAgICBzd2l0Y2ggKF90eXBlb2YobWl4aW4pKSB7XG4gICAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZGVzY3JpcHRvcnMsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG1peGluKSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZGVzY3JpcHRvcnMsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG1peGluLnByb3RvdHlwZSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgZGVzY3JpcHRvcnMuY29uc3RydWN0b3I7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGJhc2UucHJvdG90eXBlLCBkZXNjcmlwdG9ycyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwid2l0aFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfd2l0aCgpIHtcbiAgICAgIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgbWl4aW5zID0gbmV3IEFycmF5KF9sZW40KSwgX2tleTQgPSAwOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgICAgIG1peGluc1tfa2V5NF0gPSBhcmd1bWVudHNbX2tleTRdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5mcm9tLmFwcGx5KHRoaXMsIFsvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBfY2xhc3MoKSB7XG4gICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIF9jbGFzcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX2NsYXNzO1xuICAgICAgfSgpXS5jb25jYXQobWl4aW5zKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1peE9iamVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtaXhPYmplY3QobWl4aW4sIGluc3RhbmNlKSB7XG4gICAgICB2YXIgX2l0ZXJhdG9yMiA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG1peGluKSksXG4gICAgICAgICAgX3N0ZXAyO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjIucygpOyAhKF9zdGVwMiA9IF9pdGVyYXRvcjIubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBmdW5jID0gX3N0ZXAyLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBtaXhpbltmdW5jXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaW5zdGFuY2VbZnVuY10gPSBtaXhpbltmdW5jXS5iaW5kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluc3RhbmNlW2Z1bmNdID0gbWl4aW5bZnVuY107XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IyLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjIuZigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2l0ZXJhdG9yMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMobWl4aW4pKSxcbiAgICAgICAgICBfc3RlcDM7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMy5zKCk7ICEoX3N0ZXAzID0gX2l0ZXJhdG9yMy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIF9mdW5jID0gX3N0ZXAzLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBtaXhpbltfZnVuY10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGluc3RhbmNlW19mdW5jXSA9IG1peGluW19mdW5jXS5iaW5kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluc3RhbmNlW19mdW5jXSA9IG1peGluW19mdW5jXTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjMuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yMy5mKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1peENsYXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1peENsYXNzKGNscywgbmV3Q2xhc3MpIHtcbiAgICAgIHZhciBfaXRlcmF0b3I0ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY2xzLnByb3RvdHlwZSkpLFxuICAgICAgICAgIF9zdGVwNDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3I0LnMoKTsgIShfc3RlcDQgPSBfaXRlcmF0b3I0Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZnVuYyA9IF9zdGVwNC52YWx1ZTtcblxuICAgICAgICAgIGlmIChbJ25hbWUnLCAncHJvdG90eXBlJywgJ2xlbmd0aCddLmluY2x1ZGVzKGZ1bmMpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV3Q2xhc3MsIGZ1bmMpO1xuXG4gICAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgIWRlc2NyaXB0b3Iud3JpdGFibGUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY2xzW2Z1bmNdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBuZXdDbGFzcy5wcm90b3R5cGVbZnVuY10gPSBjbHMucHJvdG90eXBlW2Z1bmNdO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV3Q2xhc3MucHJvdG90eXBlW2Z1bmNdID0gY2xzLnByb3RvdHlwZVtmdW5jXS5iaW5kKG5ld0NsYXNzLnByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3I0LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjQuZigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2l0ZXJhdG9yNSA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoY2xzLnByb3RvdHlwZSkpLFxuICAgICAgICAgIF9zdGVwNTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3I1LnMoKTsgIShfc3RlcDUgPSBfaXRlcmF0b3I1Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgX2Z1bmMyID0gX3N0ZXA1LnZhbHVlO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjbHNbX2Z1bmMyXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbmV3Q2xhc3MucHJvdG90eXBlW19mdW5jMl0gPSBjbHMucHJvdG90eXBlW19mdW5jMl07XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXdDbGFzcy5wcm90b3R5cGVbX2Z1bmMyXSA9IGNscy5wcm90b3R5cGVbX2Z1bmMyXS5iaW5kKG5ld0NsYXNzLnByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3I1LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjUuZigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2l0ZXJhdG9yNiA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNscykpLFxuICAgICAgICAgIF9zdGVwNjtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoKSB7XG4gICAgICAgICAgdmFyIGZ1bmMgPSBfc3RlcDYudmFsdWU7XG5cbiAgICAgICAgICBpZiAoWyduYW1lJywgJ3Byb3RvdHlwZScsICdsZW5ndGgnXS5pbmNsdWRlcyhmdW5jKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV3Q2xhc3MsIGZ1bmMpO1xuXG4gICAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgIWRlc2NyaXB0b3Iud3JpdGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjbHNbZnVuY10gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG5ld0NsYXNzW2Z1bmNdID0gY2xzW2Z1bmNdO1xuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcHJldiA9IG5ld0NsYXNzW2Z1bmNdIHx8IGZhbHNlO1xuICAgICAgICAgIHZhciBtZXRoID0gY2xzW2Z1bmNdLmJpbmQobmV3Q2xhc3MpO1xuXG4gICAgICAgICAgbmV3Q2xhc3NbZnVuY10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcmV2ICYmIHByZXYuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIG1ldGguYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChfaXRlcmF0b3I2LnMoKTsgIShfc3RlcDYgPSBfaXRlcmF0b3I2Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgX3JldCA9IF9sb29wKCk7XG5cbiAgICAgICAgICBpZiAoX3JldCA9PT0gXCJjb250aW51ZVwiKSBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjYuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yNi5mKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBfaXRlcmF0b3I3ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhjbHMpKSxcbiAgICAgICAgICBfc3RlcDc7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBfbG9vcDIgPSBmdW5jdGlvbiBfbG9vcDIoKSB7XG4gICAgICAgICAgdmFyIGZ1bmMgPSBfc3RlcDcudmFsdWU7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNsc1tmdW5jXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbmV3Q2xhc3MucHJvdG90eXBlW2Z1bmNdID0gY2xzW2Z1bmNdO1xuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcHJldiA9IG5ld0NsYXNzW2Z1bmNdIHx8IGZhbHNlO1xuICAgICAgICAgIHZhciBtZXRoID0gY2xzW2Z1bmNdLmJpbmQobmV3Q2xhc3MpO1xuXG4gICAgICAgICAgbmV3Q2xhc3NbZnVuY10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcmV2ICYmIHByZXYuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIG1ldGguYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChfaXRlcmF0b3I3LnMoKTsgIShfc3RlcDcgPSBfaXRlcmF0b3I3Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgX3JldDIgPSBfbG9vcDIoKTtcblxuICAgICAgICAgIGlmIChfcmV0MiA9PT0gXCJjb250aW51ZVwiKSBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjcuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yNy5mKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1peFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtaXgobWl4aW5Ubykge1xuICAgICAgdmFyIGNvbnN0cnVjdG9ycyA9IFtdO1xuICAgICAgdmFyIGFsbFN0YXRpYyA9IHt9O1xuICAgICAgdmFyIGFsbEluc3RhbmNlID0ge307XG5cbiAgICAgIHZhciBtaXhhYmxlID0gX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2VCaW5kYWJsZShtaXhpblRvKTtcblxuICAgICAgdmFyIF9sb29wMyA9IGZ1bmN0aW9uIF9sb29wMyhiYXNlKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZS5wcm90b3R5cGUpO1xuICAgICAgICB2YXIgc3RhdGljTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlKTtcbiAgICAgICAgdmFyIHByZWZpeCA9IC9eKGJlZm9yZXxhZnRlcilfXyguKykvO1xuXG4gICAgICAgIHZhciBfaXRlcmF0b3I4ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoc3RhdGljTmFtZXMpLFxuICAgICAgICAgICAgX3N0ZXA4O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIF9sb29wNSA9IGZ1bmN0aW9uIF9sb29wNSgpIHtcbiAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gX3N0ZXA4LnZhbHVlO1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gbWV0aG9kTmFtZS5tYXRjaChwcmVmaXgpO1xuXG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgc3dpdGNoIChtYXRjaFsxXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JlZm9yZSc6XG4gICAgICAgICAgICAgICAgICBtaXhhYmxlLl9fX2JlZm9yZShmdW5jdGlvbiAodCwgZSwgcywgbywgYSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZSAhPT0gbWF0Y2hbMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWV0aG9kID0gYmFzZVttZXRob2ROYW1lXS5iaW5kKG8pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0aG9kLmFwcGx5KHZvaWQgMCwgX3RvQ29uc3VtYWJsZUFycmF5KGEpKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2FmdGVyJzpcbiAgICAgICAgICAgICAgICAgIG1peGFibGUuX19fYWZ0ZXIoZnVuY3Rpb24gKHQsIGUsIHMsIG8sIGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgIT09IG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IGJhc2VbbWV0aG9kTmFtZV0uYmluZChvKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh2b2lkIDAsIF90b0NvbnN1bWFibGVBcnJheShhKSk7XG4gICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxsU3RhdGljW21ldGhvZE5hbWVdKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYmFzZVttZXRob2ROYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhbGxTdGF0aWNbbWV0aG9kTmFtZV0gPSBiYXNlW21ldGhvZE5hbWVdO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmb3IgKF9pdGVyYXRvcjgucygpOyAhKF9zdGVwOCA9IF9pdGVyYXRvcjgubigpKS5kb25lOykge1xuICAgICAgICAgICAgdmFyIF9yZXQzID0gX2xvb3A1KCk7XG5cbiAgICAgICAgICAgIGlmIChfcmV0MyA9PT0gXCJjb250aW51ZVwiKSBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIF9pdGVyYXRvcjguZShlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIF9pdGVyYXRvcjguZigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9pdGVyYXRvcjkgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihpbnN0YW5jZU5hbWVzKSxcbiAgICAgICAgICAgIF9zdGVwOTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBfbG9vcDYgPSBmdW5jdGlvbiBfbG9vcDYoKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IF9zdGVwOS52YWx1ZTtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IG1ldGhvZE5hbWUubWF0Y2gocHJlZml4KTtcblxuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgIHN3aXRjaCAobWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdiZWZvcmUnOlxuICAgICAgICAgICAgICAgICAgbWl4YWJsZS5fX19iZWZvcmUoZnVuY3Rpb24gKHQsIGUsIHMsIG8sIGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUgIT09IG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IGJhc2UucHJvdG90eXBlW21ldGhvZE5hbWVdLmJpbmQobyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodm9pZCAwLCBfdG9Db25zdW1hYmxlQXJyYXkoYSkpO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnYWZ0ZXInOlxuICAgICAgICAgICAgICAgICAgbWl4YWJsZS5fX19hZnRlcihmdW5jdGlvbiAodCwgZSwgcywgbywgYSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZSAhPT0gbWF0Y2hbMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWV0aG9kID0gYmFzZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0uYmluZChvKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh2b2lkIDAsIF90b0NvbnN1bWFibGVBcnJheShhKSk7XG4gICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxsSW5zdGFuY2VbbWV0aG9kTmFtZV0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBiYXNlLnByb3RvdHlwZVttZXRob2ROYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhbGxJbnN0YW5jZVttZXRob2ROYW1lXSA9IGJhc2UucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmb3IgKF9pdGVyYXRvcjkucygpOyAhKF9zdGVwOSA9IF9pdGVyYXRvcjkubigpKS5kb25lOykge1xuICAgICAgICAgICAgdmFyIF9yZXQ0ID0gX2xvb3A2KCk7XG5cbiAgICAgICAgICAgIGlmIChfcmV0NCA9PT0gXCJjb250aW51ZVwiKSBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIF9pdGVyYXRvcjkuZShlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIF9pdGVyYXRvcjkuZigpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBiYXNlID0gdGhpczsgYmFzZSAmJiBiYXNlLnByb3RvdHlwZTsgYmFzZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihiYXNlKSkge1xuICAgICAgICBfbG9vcDMoYmFzZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIG1ldGhvZE5hbWUgaW4gYWxsU3RhdGljKSB7XG4gICAgICAgIG1peGluVG9bbWV0aG9kTmFtZV0gPSBhbGxTdGF0aWNbbWV0aG9kTmFtZV0uYmluZChtaXhpblRvKTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9sb29wNCA9IGZ1bmN0aW9uIF9sb29wNChfbWV0aG9kTmFtZSkge1xuICAgICAgICBtaXhpblRvLnByb3RvdHlwZVtfbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZm9yICh2YXIgX2xlbjUgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgICAgICAgICBhcmdzW19rZXk1XSA9IGFyZ3VtZW50c1tfa2V5NV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGFsbEluc3RhbmNlW19tZXRob2ROYW1lXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIF9tZXRob2ROYW1lIGluIGFsbEluc3RhbmNlKSB7XG4gICAgICAgIF9sb29wNChfbWV0aG9kTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtaXhhYmxlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBNaXhpbjtcbn0oKTtcblxuZXhwb3J0cy5NaXhpbiA9IE1peGluO1xuTWl4aW4uQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9iYXNlL1JvdXRlci5qc1wiLCBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUpIHtcbiAgcmVxdWlyZSA9IF9fbWFrZVJlbGF0aXZlUmVxdWlyZShyZXF1aXJlLCB7fSwgXCJjdXJ2YXR1cmVcIik7XG4gIChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuUm91dGVyID0gdm9pZCAwO1xuXG52YXIgX1ZpZXcgPSByZXF1aXJlKFwiLi9WaWV3XCIpO1xuXG52YXIgX0NhY2hlID0gcmVxdWlyZShcIi4vQ2FjaGVcIik7XG5cbnZhciBfQ29uZmlnID0gcmVxdWlyZShcIi4vQ29uZmlnXCIpO1xuXG52YXIgX1JvdXRlcyA9IHJlcXVpcmUoXCIuL1JvdXRlc1wiKTtcblxuZnVuY3Rpb24gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobywgYWxsb3dBcnJheUxpa2UpIHsgdmFyIGl0ID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0gfHwgb1tcIkBAaXRlcmF0b3JcIl07IGlmICghaXQpIHsgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgeyBpZiAoaXQpIG8gPSBpdDsgdmFyIGkgPSAwOyB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7fTsgcmV0dXJuIHsgczogRiwgbjogZnVuY3Rpb24gbigpIHsgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7IGRvbmU6IHRydWUgfTsgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBvW2krK10gfTsgfSwgZTogZnVuY3Rpb24gZShfZSkgeyB0aHJvdyBfZTsgfSwgZjogRiB9OyB9IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gaXRlcmF0ZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfSB2YXIgbm9ybWFsQ29tcGxldGlvbiA9IHRydWUsIGRpZEVyciA9IGZhbHNlLCBlcnI7IHJldHVybiB7IHM6IGZ1bmN0aW9uIHMoKSB7IGl0ID0gaXQuY2FsbChvKTsgfSwgbjogZnVuY3Rpb24gbigpIHsgdmFyIHN0ZXAgPSBpdC5uZXh0KCk7IG5vcm1hbENvbXBsZXRpb24gPSBzdGVwLmRvbmU7IHJldHVybiBzdGVwOyB9LCBlOiBmdW5jdGlvbiBlKF9lMikgeyBkaWRFcnIgPSB0cnVlOyBlcnIgPSBfZTI7IH0sIGY6IGZ1bmN0aW9uIGYoKSB7IHRyeSB7IGlmICghbm9ybWFsQ29tcGxldGlvbiAmJiBpdFtcInJldHVyblwiXSAhPSBudWxsKSBpdFtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoZGlkRXJyKSB0aHJvdyBlcnI7IH0gfSB9OyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgTm90Rm91bmRFcnJvciA9IFN5bWJvbCgnTm90Rm91bmQnKTtcbnZhciBJbnRlcm5hbEVycm9yID0gU3ltYm9sKCdJbnRlcm5hbCcpO1xuXG52YXIgUm91dGVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUm91dGVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSb3V0ZXIpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFJvdXRlciwgbnVsbCwgW3tcbiAgICBrZXk6IFwid2FpdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3YWl0KHZpZXcpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBldmVudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ0RPTUNvbnRlbnRMb2FkZWQnO1xuICAgICAgdmFyIG5vZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGRvY3VtZW50O1xuICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLmxpc3Rlbih2aWV3KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsaXN0ZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGlzdGVuKGxpc3RlbmVyKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgdmFyIHJvdXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG4gICAgICB0aGlzLmxpc3RlbmVyID0gbGlzdGVuZXIgfHwgdGhpcy5saXN0ZW5lcjtcbiAgICAgIHRoaXMucm91dGVzID0gcm91dGVzIHx8IGxpc3RlbmVyLnJvdXRlcztcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5xdWVyeSwgdGhpcy5xdWVyeU92ZXIoe30pKTtcblxuICAgICAgdmFyIGxpc3RlbiA9IGZ1bmN0aW9uIGxpc3RlbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmIChldmVudC5zdGF0ZSAmJiAncm91dGVkSWQnIGluIGV2ZW50LnN0YXRlKSB7XG4gICAgICAgICAgaWYgKGV2ZW50LnN0YXRlLnJvdXRlZElkIDw9IF90aGlzMi5yb3V0ZUNvdW50KSB7XG4gICAgICAgICAgICBfdGhpczIuaGlzdG9yeS5zcGxpY2UoZXZlbnQuc3RhdGUucm91dGVkSWQpO1xuXG4gICAgICAgICAgICBfdGhpczIucm91dGVDb3VudCA9IGV2ZW50LnN0YXRlLnJvdXRlZElkO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuc3RhdGUucm91dGVkSWQgPiBfdGhpczIucm91dGVDb3VudCkge1xuICAgICAgICAgICAgX3RoaXMyLmhpc3RvcnkucHVzaChldmVudC5zdGF0ZS5wcmV2KTtcblxuICAgICAgICAgICAgX3RoaXMyLnJvdXRlQ291bnQgPSBldmVudC5zdGF0ZS5yb3V0ZWRJZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpczIuc3RhdGUgPSBldmVudC5zdGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoX3RoaXMyLnByZXZQYXRoICE9PSBudWxsICYmIF90aGlzMi5wcmV2UGF0aCAhPT0gbG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICAgICAgICAgIF90aGlzMi5oaXN0b3J5LnB1c2goX3RoaXMyLnByZXZQYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobG9jYXRpb24ub3JpZ2luICE9PSAnbnVsbCcpIHtcbiAgICAgICAgICBfdGhpczIubWF0Y2gobG9jYXRpb24ucGF0aG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpczIubWF0Y2goX3RoaXMyLm5leHRQYXRoLCBsaXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpIGluIF90aGlzMi5xdWVyeSkge1xuICAgICAgICAgIGRlbGV0ZSBfdGhpczIucXVlcnlbaV07XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuYXNzaWduKF90aGlzMi5xdWVyeSwgX3RoaXMyLnF1ZXJ5T3Zlcih7fSkpO1xuICAgICAgfTtcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgbGlzdGVuKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjdlVybENoYW5nZWQnLCBsaXN0ZW4pO1xuICAgICAgdmFyIHJvdXRlID0gbG9jYXRpb24ub3JpZ2luICE9PSAnbnVsbCcgPyBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCA6IGZhbHNlO1xuXG4gICAgICBpZiAobG9jYXRpb24ub3JpZ2luICYmIGxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgcm91dGUgKz0gbG9jYXRpb24uaGFzaDtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICByb3V0ZWRJZDogdGhpcy5yb3V0ZUNvdW50LFxuICAgICAgICB1cmw6IGxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICBwcmV2OiB0aGlzLnByZXZQYXRoXG4gICAgICB9O1xuXG4gICAgICBpZiAobG9jYXRpb24ub3JpZ2luICE9PSAnbnVsbCcpIHtcbiAgICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUoc3RhdGUsIG51bGwsIGxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5nbyhyb3V0ZSAhPT0gZmFsc2UgPyByb3V0ZSA6ICcvJyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdvXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdvKHBhdGgpIHtcbiAgICAgIHZhciBzaWxlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuXG4gICAgICB2YXIgY29uZmlnVGl0bGUgPSBfQ29uZmlnLkNvbmZpZy5nZXQoJ3RpdGxlJyk7XG5cbiAgICAgIGlmIChjb25maWdUaXRsZSkge1xuICAgICAgICBkb2N1bWVudC50aXRsZSA9IGNvbmZpZ1RpdGxlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgIHJvdXRlZElkOiB0aGlzLnJvdXRlQ291bnQsXG4gICAgICAgIHByZXY6IHRoaXMucHJldlBhdGgsXG4gICAgICAgIHVybDogbG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIH07XG5cbiAgICAgIGlmIChzaWxlbnQgPT09IC0xKSB7XG4gICAgICAgIHRoaXMubWF0Y2gocGF0aCwgdGhpcy5saXN0ZW5lciwgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGxvY2F0aW9uLm9yaWdpbiA9PT0gJ251bGwnKSB7XG4gICAgICAgIHRoaXMubmV4dFBhdGggPSBwYXRoO1xuICAgICAgfSBlbHNlIGlmIChzaWxlbnQgPT09IDIgJiYgbG9jYXRpb24ucGF0aG5hbWUgIT09IHBhdGgpIHtcbiAgICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUoc3RhdGUsIG51bGwsIHBhdGgpO1xuICAgICAgfSBlbHNlIGlmIChsb2NhdGlvbi5wYXRobmFtZSAhPT0gcGF0aCkge1xuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgbnVsbCwgcGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghc2lsZW50IHx8IHNpbGVudCA8IDApIHtcbiAgICAgICAgaWYgKHNpbGVudCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLnBhdGggPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgICAgICBpZiAocGF0aC5zdWJzdHJpbmcoMCwgMSkgPT09ICcjJykge1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEhhc2hDaGFuZ2VFdmVudCgnaGFzaGNoYW5nZScpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjdlVybENoYW5nZWQnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5xdWVyeSkge1xuICAgICAgICBkZWxldGUgdGhpcy5xdWVyeVtpXTtcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnF1ZXJ5LCB0aGlzLnF1ZXJ5T3Zlcih7fSkpO1xuICAgICAgdGhpcy5wcmV2UGF0aCA9IHBhdGg7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hdGNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hdGNoKHBhdGgsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIGZvcmNlUmVmcmVzaCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLnBhdGggPT09IHBhdGggJiYgIWZvcmNlUmVmcmVzaCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucXVlcnlTdHJpbmcgPSBsb2NhdGlvbi5zZWFyY2g7XG4gICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgdmFyIHByZXYgPSB0aGlzLnByZXZQYXRoO1xuICAgICAgdmFyIGN1cnJlbnQgPSBsaXN0ZW5lci5hcmdzLmNvbnRlbnQ7XG5cbiAgICAgIHZhciByb3V0ZXMgPSB0aGlzLnJvdXRlcyB8fCBsaXN0ZW5lci5yb3V0ZXMgfHwgX1JvdXRlcy5Sb3V0ZXMuZHVtcCgpO1xuXG4gICAgICB2YXIgcXVlcnkgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCk7XG5cbiAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5xdWVyeSkge1xuICAgICAgICBkZWxldGUgdGhpcy5xdWVyeVtpXTtcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnF1ZXJ5LCB0aGlzLnF1ZXJ5T3Zlcih7fSkpO1xuICAgICAgdmFyIGFyZ3MgPSB7fSxcbiAgICAgICAgICBzZWxlY3RlZCA9IGZhbHNlLFxuICAgICAgICAgIHJlc3VsdCA9ICcnO1xuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpLnNwbGl0KCcvJyk7XG5cbiAgICAgIGZvciAodmFyIF9pIGluIHRoaXMucXVlcnkpIHtcbiAgICAgICAgYXJnc1tfaV0gPSB0aGlzLnF1ZXJ5W19pXTtcbiAgICAgIH1cblxuICAgICAgTDE6IGZvciAodmFyIF9pMiBpbiByb3V0ZXMpIHtcbiAgICAgICAgdmFyIHJvdXRlID0gX2kyLnNwbGl0KCcvJyk7XG5cbiAgICAgICAgaWYgKHJvdXRlLmxlbmd0aCA8IHBhdGgubGVuZ3RoICYmIHJvdXRlW3JvdXRlLmxlbmd0aCAtIDFdICE9PSAnKicpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIEwyOiBmb3IgKHZhciBqIGluIHJvdXRlKSB7XG4gICAgICAgICAgaWYgKHJvdXRlW2pdLnN1YnN0cigwLCAxKSA9PSAnJScpIHtcbiAgICAgICAgICAgIHZhciBhcmdOYW1lID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBncm91cHMgPSAvXiUoXFx3KylcXD8/Ly5leGVjKHJvdXRlW2pdKTtcblxuICAgICAgICAgICAgaWYgKGdyb3VwcyAmJiBncm91cHNbMV0pIHtcbiAgICAgICAgICAgICAgYXJnTmFtZSA9IGdyb3Vwc1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhcmdOYW1lKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlwiLmNvbmNhdChyb3V0ZVtqXSwgXCIgaXMgbm90IGEgdmFsaWQgYXJndW1lbnQgc2VnbWVudCBpbiByb3V0ZSBcXFwiXCIpLmNvbmNhdChfaTIsIFwiXFxcIlwiKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcGF0aFtqXSkge1xuICAgICAgICAgICAgICBpZiAocm91dGVbal0uc3Vic3RyKHJvdXRlW2pdLmxlbmd0aCAtIDEsIDEpID09ICc/Jykge1xuICAgICAgICAgICAgICAgIGFyZ3NbYXJnTmFtZV0gPSAnJztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZSBMMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYXJnc1thcmdOYW1lXSA9IHBhdGhbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChyb3V0ZVtqXSAhPT0gJyonICYmIHBhdGhbal0gIT09IHJvdXRlW2pdKSB7XG4gICAgICAgICAgICBjb250aW51ZSBMMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxlY3RlZCA9IF9pMjtcbiAgICAgICAgcmVzdWx0ID0gcm91dGVzW19pMl07XG5cbiAgICAgICAgaWYgKHJvdXRlW3JvdXRlLmxlbmd0aCAtIDFdID09PSAnKicpIHtcbiAgICAgICAgICBhcmdzLnBhdGhwYXJ0cyA9IHBhdGguc2xpY2Uocm91dGUubGVuZ3RoIC0gMSk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIGV2ZW50U3RhcnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2N2Um91dGVTdGFydCcsIHtcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICBwcmV2OiBwcmV2LFxuICAgICAgICAgIHJvb3Q6IGxpc3RlbmVyLFxuICAgICAgICAgIHNlbGVjdGVkOiBzZWxlY3RlZCxcbiAgICAgICAgICByb3V0ZXM6IHJvdXRlc1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50U3RhcnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3JjZVJlZnJlc2ggJiYgbGlzdGVuZXIgJiYgY3VycmVudCAmJiByZXN1bHQgaW5zdGFuY2VvZiBPYmplY3QgJiYgY3VycmVudCBpbnN0YW5jZW9mIHJlc3VsdCAmJiAhKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpICYmIGN1cnJlbnQudXBkYXRlKGFyZ3MpKSB7XG4gICAgICAgIGxpc3RlbmVyLmFyZ3MuY29udGVudCA9IGN1cnJlbnQ7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShzZWxlY3RlZCBpbiByb3V0ZXMpKSB7XG4gICAgICAgIHJvdXRlc1tzZWxlY3RlZF0gPSByb3V0ZXNbTm90Rm91bmRFcnJvcl07XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9jZXNzUm91dGUgPSBmdW5jdGlvbiBwcm9jZXNzUm91dGUoc2VsZWN0ZWQpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygcm91dGVzW3NlbGVjdGVkXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmIChyb3V0ZXNbc2VsZWN0ZWRdLnByb3RvdHlwZSBpbnN0YW5jZW9mIF9WaWV3LlZpZXcpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyByb3V0ZXNbc2VsZWN0ZWRdKGFyZ3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSByb3V0ZXNbc2VsZWN0ZWRdKGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSByb3V0ZXNbc2VsZWN0ZWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IHByb2Nlc3NSb3V0ZShzZWxlY3RlZCk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXN1bHQgPSBwcm9jZXNzUm91dGUoTm90Rm91bmRFcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQudGhlbihmdW5jdGlvbiAocmVhbFJlc3VsdCkge1xuICAgICAgICAgICAgX3RoaXMzLnVwZGF0ZShsaXN0ZW5lciwgcGF0aCwgcmVhbFJlc3VsdCwgcm91dGVzLCBzZWxlY3RlZCwgYXJncywgZm9yY2VSZWZyZXNoKTtcbiAgICAgICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2N2Um91dGVFcnJvcicsIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgcHJldjogcHJldixcbiAgICAgICAgICAgICAgICB2aWV3OiBsaXN0ZW5lcixcbiAgICAgICAgICAgICAgICByb3V0ZXM6IHJvdXRlcyxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBfdGhpczMudXBkYXRlKGxpc3RlbmVyLCBwYXRoLCB3aW5kb3dbJ2Rldk1vZGUnXSA/IFN0cmluZyhlcnJvcikgOiAnRXJyb3I6IDUwMCcsIHJvdXRlcywgc2VsZWN0ZWQsIGFyZ3MsIGZvcmNlUmVmcmVzaCk7XG5cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZShsaXN0ZW5lciwgcGF0aCwgcmVzdWx0LCByb3V0ZXMsIHNlbGVjdGVkLCBhcmdzLCBmb3JjZVJlZnJlc2gpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2N2Um91dGVFcnJvcicsIHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIGVycm9yOiBlcnJvcixcbiAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICBwcmV2OiBwcmV2LFxuICAgICAgICAgICAgdmlldzogbGlzdGVuZXIsXG4gICAgICAgICAgICByb3V0ZXM6IHJvdXRlcyxcbiAgICAgICAgICAgIHNlbGVjdGVkOiBzZWxlY3RlZFxuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLnVwZGF0ZShsaXN0ZW5lciwgcGF0aCwgd2luZG93WydkZXZNb2RlJ10gPyBTdHJpbmcoZXJyb3IpIDogJ0Vycm9yOiA1MDAnLCByb3V0ZXMsIHNlbGVjdGVkLCBhcmdzLCBmb3JjZVJlZnJlc2gpOyAvLyB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZShsaXN0ZW5lciwgcGF0aCwgcmVzdWx0LCByb3V0ZXMsIHNlbGVjdGVkLCBhcmdzLCBmb3JjZVJlZnJlc2gpIHtcbiAgICAgIGlmICghbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJldiA9IHRoaXMucHJldlBhdGg7XG4gICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2N2Um91dGUnLCB7XG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgcHJldjogcHJldixcbiAgICAgICAgICB2aWV3OiBsaXN0ZW5lcixcbiAgICAgICAgICByb3V0ZXM6IHJvdXRlcyxcbiAgICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWRcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChyZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChsaXN0ZW5lci5hcmdzLmNvbnRlbnQgaW5zdGFuY2VvZiBfVmlldy5WaWV3KSB7XG4gICAgICAgICAgbGlzdGVuZXIuYXJncy5jb250ZW50LnBhdXNlKHRydWUpO1xuICAgICAgICAgIGxpc3RlbmVyLmFyZ3MuY29udGVudC5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KSkge1xuICAgICAgICAgIGxpc3RlbmVyLmFyZ3MuY29udGVudCA9IHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBfVmlldy5WaWV3KSB7XG4gICAgICAgICAgcmVzdWx0LnBhdXNlKGZhbHNlKTtcbiAgICAgICAgICByZXN1bHQudXBkYXRlKGFyZ3MsIGZvcmNlUmVmcmVzaCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGV2ZW50RW5kID0gbmV3IEN1c3RvbUV2ZW50KCdjdlJvdXRlRW5kJywge1xuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgIHByZXY6IHByZXYsXG4gICAgICAgICAgdmlldzogbGlzdGVuZXIsXG4gICAgICAgICAgcm91dGVzOiByb3V0ZXMsXG4gICAgICAgICAgc2VsZWN0ZWQ6IHNlbGVjdGVkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudEVuZCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInF1ZXJ5T3ZlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBxdWVyeU92ZXIoKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgICB2YXIgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgdmFyIGZpbmFsQXJncyA9IHt9O1xuICAgICAgdmFyIHF1ZXJ5ID0ge307XG5cbiAgICAgIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihwYXJhbXMpLFxuICAgICAgICAgIF9zdGVwO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvci5zKCk7ICEoX3N0ZXAgPSBfaXRlcmF0b3IubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBwYWlyID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgcXVlcnlbcGFpclswXV0gPSBwYWlyWzFdO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvci5mKCk7XG4gICAgICB9XG5cbiAgICAgIGZpbmFsQXJncyA9IE9iamVjdC5hc3NpZ24oZmluYWxBcmdzLCBxdWVyeSwgYXJncyk7XG4gICAgICBkZWxldGUgZmluYWxBcmdzWydhcGknXTtcbiAgICAgIHJldHVybiBmaW5hbEFyZ3M7IC8vIGZvcihsZXQgaSBpbiBxdWVyeSlcbiAgICAgIC8vIHtcbiAgICAgIC8vIFx0ZmluYWxBcmdzW2ldID0gcXVlcnlbaV07XG4gICAgICAvLyB9XG4gICAgICAvLyBmb3IobGV0IGkgaW4gYXJncylcbiAgICAgIC8vIHtcbiAgICAgIC8vIFx0ZmluYWxBcmdzW2ldID0gYXJnc1tpXTtcbiAgICAgIC8vIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicXVlcnlUb1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBxdWVyeVRvU3RyaW5nKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgICAgdmFyIGZyZXNoID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgICAgIHZhciBwYXJ0cyA9IFtdLFxuICAgICAgICAgIGZpbmFsQXJncyA9IGFyZ3M7XG5cbiAgICAgIGlmICghZnJlc2gpIHtcbiAgICAgICAgZmluYWxBcmdzID0gdGhpcy5xdWVyeU92ZXIoYXJncyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgaW4gZmluYWxBcmdzKSB7XG4gICAgICAgIGlmIChmaW5hbEFyZ3NbaV0gPT09ICcnKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJ0cy5wdXNoKGkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZmluYWxBcmdzW2ldKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXJ0cy5qb2luKCcmJyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldFF1ZXJ5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFF1ZXJ5KG5hbWUsIHZhbHVlLCBzaWxlbnQpIHtcbiAgICAgIHZhciBhcmdzID0gdGhpcy5xdWVyeU92ZXIoKTtcbiAgICAgIGFyZ3NbbmFtZV0gPSB2YWx1ZTtcblxuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGVsZXRlIGFyZ3NbbmFtZV07XG4gICAgICB9XG5cbiAgICAgIHZhciBxdWVyeVN0cmluZyA9IHRoaXMucXVlcnlUb1N0cmluZyhhcmdzLCB0cnVlKTtcbiAgICAgIHRoaXMuZ28obG9jYXRpb24ucGF0aG5hbWUgKyAocXVlcnlTdHJpbmcgPyAnPycgKyBxdWVyeVN0cmluZyA6ICc/JyksIHNpbGVudCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJvdXRlcjtcbn0oKTtcblxuZXhwb3J0cy5Sb3V0ZXIgPSBSb3V0ZXI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUm91dGVyLCAncXVlcnknLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiB7fVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUm91dGVyLCAnaGlzdG9yeScsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbiAgdmFsdWU6IFtdXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSb3V0ZXIsICdyb3V0ZUNvdW50Jywge1xuICBjb25maWd1cmFibGU6IGZhbHNlLFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgd3JpdGFibGU6IHRydWUsXG4gIHZhbHVlOiAwXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSb3V0ZXIsICdwcmV2UGF0aCcsIHtcbiAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICB2YWx1ZTogbnVsbFxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUm91dGVyLCAncXVlcnlTdHJpbmcnLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgdmFsdWU6IG51bGxcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJvdXRlciwgJ0ludGVybmFsRXJyb3InLCB7XG4gIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG4gIHZhbHVlOiBJbnRlcm5hbEVycm9yXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSb3V0ZXIsICdOb3RGb3VuZEVycm9yJywge1xuICBjb25maWd1cmFibGU6IGZhbHNlLFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgd3JpdGFibGU6IGZhbHNlLFxuICB2YWx1ZTogTm90Rm91bmRFcnJvclxufSk7XG4gIH0pKCk7XG59KTsiLCJcbnJlcXVpcmUucmVnaXN0ZXIoXCJjdXJ2YXR1cmUvYmFzZS9Sb3V0ZXMuanNcIiwgZnVuY3Rpb24oZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlKSB7XG4gIHJlcXVpcmUgPSBfX21ha2VSZWxhdGl2ZVJlcXVpcmUocmVxdWlyZSwge30sIFwiY3VydmF0dXJlXCIpO1xuICAoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLlJvdXRlcyA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgQXBwUm91dGVzID0ge307XG52YXIgX3JlcXVpcmUgPSByZXF1aXJlO1xuXG50cnkge1xuICBPYmplY3QuYXNzaWduKEFwcFJvdXRlcywgX3JlcXVpcmUoJ1JvdXRlcycpLlJvdXRlcyB8fCB7fSk7XG59IGNhdGNoIChlcnJvcikge1xuICBnbG9iYWxUaGlzLmRldk1vZGUgPT09IHRydWUgJiYgY29uc29sZS53YXJuKGVycm9yKTtcbn1cblxudmFyIFJvdXRlcyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJvdXRlcygpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUm91dGVzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhSb3V0ZXMsIG51bGwsIFt7XG4gICAga2V5OiBcImdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQobmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMucm91dGVzW25hbWVdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkdW1wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGR1bXAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yb3V0ZXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJvdXRlcztcbn0oKTtcblxuZXhwb3J0cy5Sb3V0ZXMgPSBSb3V0ZXM7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUm91dGVzLCAncm91dGVzJywge1xuICBjb25maWd1cmFibGU6IGZhbHNlLFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgd3JpdGFibGU6IGZhbHNlLFxuICB2YWx1ZTogQXBwUm91dGVzXG59KTtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9iYXNlL1J1bGVTZXQuanNcIiwgZnVuY3Rpb24oZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlKSB7XG4gIHJlcXVpcmUgPSBfX21ha2VSZWxhdGl2ZVJlcXVpcmUocmVxdWlyZSwge30sIFwiY3VydmF0dXJlXCIpO1xuICAoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLlJ1bGVTZXQgPSB2b2lkIDA7XG5cbnZhciBfRG9tID0gcmVxdWlyZShcIi4vRG9tXCIpO1xuXG52YXIgX1RhZyA9IHJlcXVpcmUoXCIuL1RhZ1wiKTtcblxudmFyIF9WaWV3ID0gcmVxdWlyZShcIi4vVmlld1wiKTtcblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfaSA9IGFyciA9PSBudWxsID8gbnVsbCA6IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJyW1N5bWJvbC5pdGVyYXRvcl0gfHwgYXJyW1wiQEBpdGVyYXRvclwiXTsgaWYgKF9pID09IG51bGwpIHJldHVybjsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfcywgX2U7IHRyeSB7IGZvciAoX2kgPSBfaS5jYWxsKGFycik7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobywgYWxsb3dBcnJheUxpa2UpIHsgdmFyIGl0ID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0gfHwgb1tcIkBAaXRlcmF0b3JcIl07IGlmICghaXQpIHsgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgeyBpZiAoaXQpIG8gPSBpdDsgdmFyIGkgPSAwOyB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7fTsgcmV0dXJuIHsgczogRiwgbjogZnVuY3Rpb24gbigpIHsgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7IGRvbmU6IHRydWUgfTsgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBvW2krK10gfTsgfSwgZTogZnVuY3Rpb24gZShfZTIpIHsgdGhyb3cgX2UyOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UzKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMzsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBSdWxlU2V0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUnVsZVNldCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUnVsZVNldCk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUnVsZVNldCwgW3tcbiAgICBrZXk6IFwiYWRkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgIHRoaXMucnVsZXMgPSB0aGlzLnJ1bGVzIHx8IHt9O1xuICAgICAgdGhpcy5ydWxlc1tzZWxlY3Rvcl0gPSB0aGlzLnJ1bGVzW3NlbGVjdG9yXSB8fCBbXTtcbiAgICAgIHRoaXMucnVsZXNbc2VsZWN0b3JdLnB1c2goY2FsbGJhY2spO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFwcGx5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFwcGx5KCkge1xuICAgICAgdmFyIGRvYyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZG9jdW1lbnQ7XG4gICAgICB2YXIgdmlldyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICAgIFJ1bGVTZXQuYXBwbHkoZG9jLCB2aWV3KTtcblxuICAgICAgZm9yICh2YXIgc2VsZWN0b3IgaW4gdGhpcy5ydWxlcykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMucnVsZXNbc2VsZWN0b3JdKSB7XG4gICAgICAgICAgdmFyIGNhbGxiYWNrID0gdGhpcy5ydWxlc1tzZWxlY3Rvcl1baV07XG4gICAgICAgICAgdmFyIHdyYXBwZWQgPSBSdWxlU2V0LndyYXAoZG9jLCBjYWxsYmFjaywgdmlldyk7XG4gICAgICAgICAgdmFyIG5vZGVzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgICAgICAgdmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG5vZGVzKSxcbiAgICAgICAgICAgICAgX3N0ZXA7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3IucygpOyAhKF9zdGVwID0gX2l0ZXJhdG9yLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIG5vZGUgPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgd3JhcHBlZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvci5mKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInB1cmdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHB1cmdlKCkge1xuICAgICAgaWYgKCF0aGlzLnJ1bGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgX2kgPSAwLCBfT2JqZWN0JGVudHJpZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnJ1bGVzKTsgX2kgPCBfT2JqZWN0JGVudHJpZXMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBfT2JqZWN0JGVudHJpZXMkX2kgPSBfc2xpY2VkVG9BcnJheShfT2JqZWN0JGVudHJpZXNbX2ldLCAyKSxcbiAgICAgICAgICAgIGsgPSBfT2JqZWN0JGVudHJpZXMkX2lbMF0sXG4gICAgICAgICAgICB2ID0gX09iamVjdCRlbnRyaWVzJF9pWzFdO1xuXG4gICAgICAgIGlmICghdGhpcy5ydWxlc1trXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIga2sgaW4gdGhpcy5ydWxlc1trXSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJ1bGVzW2tdW2trXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfV0sIFt7XG4gICAga2V5OiBcImFkZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmdsb2JhbFJ1bGVzID0gdGhpcy5nbG9iYWxSdWxlcyB8fCB7fTtcbiAgICAgIHRoaXMuZ2xvYmFsUnVsZXNbc2VsZWN0b3JdID0gdGhpcy5nbG9iYWxSdWxlc1tzZWxlY3Rvcl0gfHwgW107XG4gICAgICB0aGlzLmdsb2JhbFJ1bGVzW3NlbGVjdG9yXS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhcHBseVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhcHBseSgpIHtcbiAgICAgIHZhciBkb2MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGRvY3VtZW50O1xuICAgICAgdmFyIHZpZXcgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG5cbiAgICAgIGZvciAodmFyIHNlbGVjdG9yIGluIHRoaXMuZ2xvYmFsUnVsZXMpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmdsb2JhbFJ1bGVzW3NlbGVjdG9yXSkge1xuICAgICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuZ2xvYmFsUnVsZXNbc2VsZWN0b3JdW2ldO1xuICAgICAgICAgIHZhciB3cmFwcGVkID0gdGhpcy53cmFwKGRvYywgY2FsbGJhY2ssIHZpZXcpO1xuICAgICAgICAgIHZhciBub2RlcyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgICAgIHZhciBfaXRlcmF0b3IyID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobm9kZXMpLFxuICAgICAgICAgICAgICBfc3RlcDI7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3IyLnMoKTsgIShfc3RlcDIgPSBfaXRlcmF0b3IyLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIG5vZGUgPSBfc3RlcDIudmFsdWU7XG4gICAgICAgICAgICAgIHdyYXBwZWQobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IyLmUoZXJyKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yMi5mKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndhaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd2FpdCgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBldmVudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ0RPTUNvbnRlbnRMb2FkZWQnO1xuICAgICAgdmFyIG5vZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGRvY3VtZW50O1xuXG4gICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQsIG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuYXBwbHkoKTtcbiAgICAgICAgfTtcbiAgICAgIH0oZXZlbnQsIG5vZGUpO1xuXG4gICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwid3JhcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cmFwKGRvYywgb3JpZ2luYWxDYWxsYmFjaykge1xuICAgICAgdmFyIHZpZXcgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBvcmlnaW5hbENhbGxiYWNrO1xuXG4gICAgICBpZiAob3JpZ2luYWxDYWxsYmFjayBpbnN0YW5jZW9mIF9WaWV3LlZpZXcgfHwgb3JpZ2luYWxDYWxsYmFjayAmJiBvcmlnaW5hbENhbGxiYWNrLnByb3RvdHlwZSAmJiBvcmlnaW5hbENhbGxiYWNrLnByb3RvdHlwZSBpbnN0YW5jZW9mIF9WaWV3LlZpZXcpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsYmFjaygpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZ2luYWxDYWxsYmFjaztcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5fX19jdkFwcGxpZWRfX18gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfX19jdkFwcGxpZWRfX18nLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiBuZXcgV2Vha1NldCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbWVudC5fX19jdkFwcGxpZWRfX18uaGFzKG9yaWdpbmFsQ2FsbGJhY2spKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRpcmVjdCwgcGFyZW50VmlldztcblxuICAgICAgICBpZiAodmlldykge1xuICAgICAgICAgIGRpcmVjdCA9IHBhcmVudFZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgaWYgKHZpZXcudmlld0xpc3QpIHtcbiAgICAgICAgICAgIHBhcmVudFZpZXcgPSB2aWV3LnZpZXdMaXN0LnBhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGFnID0gbmV3IF9UYWcuVGFnKGVsZW1lbnQsIHBhcmVudFZpZXcsIG51bGwsIHVuZGVmaW5lZCwgZGlyZWN0KTtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRhZy5lbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICAgIHZhciBzaWJsaW5nID0gdGFnLmVsZW1lbnQubmV4dFNpYmxpbmc7XG4gICAgICAgIHZhciByZXN1bHQgPSBjYWxsYmFjayh0YWcpO1xuXG4gICAgICAgIGlmIChyZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgZWxlbWVudC5fX19jdkFwcGxpZWRfX18uYWRkKG9yaWdpbmFsQ2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgcmVzdWx0ID0gbmV3IF9UYWcuVGFnKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgX1RhZy5UYWcpIHtcbiAgICAgICAgICBpZiAoIXJlc3VsdC5lbGVtZW50LmNvbnRhaW5zKHRhZy5lbGVtZW50KSkge1xuICAgICAgICAgICAgd2hpbGUgKHRhZy5lbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LmVsZW1lbnQuYXBwZW5kQ2hpbGQodGFnLmVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhZy5yZW1vdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2libGluZykge1xuICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShyZXN1bHQuZWxlbWVudCwgc2libGluZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChyZXN1bHQuZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQucHJvdG90eXBlICYmIHJlc3VsdC5wcm90b3R5cGUgaW5zdGFuY2VvZiBfVmlldy5WaWV3KSB7XG4gICAgICAgICAgcmVzdWx0ID0gbmV3IHJlc3VsdCh7fSwgdmlldyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgX1ZpZXcuVmlldykge1xuICAgICAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgICAgICB2aWV3LmNsZWFudXAucHVzaChmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHIucmVtb3ZlKCk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KHJlc3VsdCkpO1xuICAgICAgICAgICAgdmlldy5jbGVhbnVwLnB1c2godmlldy5hcmdzLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCkge1xuICAgICAgICAgICAgICB0W2tdID0gdjtcbiAgICAgICAgICAgICAgcmVzdWx0LmFyZ3Nba10gPSB2O1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdmlldy5jbGVhbnVwLnB1c2gocmVzdWx0LmFyZ3MuYmluZFRvKGZ1bmN0aW9uICh2LCBrLCB0LCBkKSB7XG4gICAgICAgICAgICAgIHRba10gPSB2O1xuICAgICAgICAgICAgICB2aWV3LmFyZ3Nba10gPSB2O1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhZy5jbGVhcigpO1xuICAgICAgICAgIHJlc3VsdC5yZW5kZXIodGFnLmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBSdWxlU2V0O1xufSgpO1xuXG5leHBvcnRzLlJ1bGVTZXQgPSBSdWxlU2V0O1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvU2V0TWFwLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5TZXRNYXAgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykgeyBpZiAoX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpKSB7IF9jb25zdHJ1Y3QgPSBSZWZsZWN0LmNvbnN0cnVjdDsgfSBlbHNlIHsgX2NvbnN0cnVjdCA9IGZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykgeyB2YXIgYSA9IFtudWxsXTsgYS5wdXNoLmFwcGx5KGEsIGFyZ3MpOyB2YXIgQ29uc3RydWN0b3IgPSBGdW5jdGlvbi5iaW5kLmFwcGx5KFBhcmVudCwgYSk7IHZhciBpbnN0YW5jZSA9IG5ldyBDb25zdHJ1Y3RvcigpOyBpZiAoQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihpbnN0YW5jZSwgQ2xhc3MucHJvdG90eXBlKTsgcmV0dXJuIGluc3RhbmNlOyB9OyB9IHJldHVybiBfY29uc3RydWN0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoQm9vbGVhbiwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG8sIGFsbG93QXJyYXlMaWtlKSB7IHZhciBpdCA9IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdIHx8IG9bXCJAQGl0ZXJhdG9yXCJdOyBpZiAoIWl0KSB7IGlmIChBcnJheS5pc0FycmF5KG8pIHx8IChpdCA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvKSkgfHwgYWxsb3dBcnJheUxpa2UgJiYgbyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHsgaWYgKGl0KSBvID0gaXQ7IHZhciBpID0gMDsgdmFyIEYgPSBmdW5jdGlvbiBGKCkge307IHJldHVybiB7IHM6IEYsIG46IGZ1bmN0aW9uIG4oKSB7IGlmIChpID49IG8ubGVuZ3RoKSByZXR1cm4geyBkb25lOiB0cnVlIH07IHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogb1tpKytdIH07IH0sIGU6IGZ1bmN0aW9uIGUoX2UpIHsgdGhyb3cgX2U7IH0sIGY6IEYgfTsgfSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH0gdmFyIG5vcm1hbENvbXBsZXRpb24gPSB0cnVlLCBkaWRFcnIgPSBmYWxzZSwgZXJyOyByZXR1cm4geyBzOiBmdW5jdGlvbiBzKCkgeyBpdCA9IGl0LmNhbGwobyk7IH0sIG46IGZ1bmN0aW9uIG4oKSB7IHZhciBzdGVwID0gaXQubmV4dCgpOyBub3JtYWxDb21wbGV0aW9uID0gc3RlcC5kb25lOyByZXR1cm4gc3RlcDsgfSwgZTogZnVuY3Rpb24gZShfZTIpIHsgZGlkRXJyID0gdHJ1ZTsgZXJyID0gX2UyOyB9LCBmOiBmdW5jdGlvbiBmKCkgeyB0cnkgeyBpZiAoIW5vcm1hbENvbXBsZXRpb24gJiYgaXRbXCJyZXR1cm5cIl0gIT0gbnVsbCkgaXRbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKGRpZEVycikgdGhyb3cgZXJyOyB9IH0gfTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIFNldE1hcCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNldE1hcCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2V0TWFwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIl9tYXBcIiwgbmV3IE1hcCgpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTZXRNYXAsIFt7XG4gICAga2V5OiBcImhhc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYXMoa2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWFwLmhhcyhrZXkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuX21hcC5nZXQoa2V5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0T25lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldE9uZShrZXkpIHtcbiAgICAgIHZhciBzZXQgPSB0aGlzLmdldChrZXkpO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoc2V0KSxcbiAgICAgICAgICBfc3RlcDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IucygpOyAhKF9zdGVwID0gX2l0ZXJhdG9yLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZW50cnkgPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICByZXR1cm4gZW50cnk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yLmYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChrZXksIHZhbHVlKSB7XG4gICAgICB2YXIgc2V0ID0gdGhpcy5fbWFwLmdldChrZXkpO1xuXG4gICAgICBpZiAoIXNldCkge1xuICAgICAgICB0aGlzLl9tYXAuc2V0KGtleSwgc2V0ID0gbmV3IFNldCgpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNldC5hZGQodmFsdWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKGtleSwgdmFsdWUpIHtcbiAgICAgIHZhciBzZXQgPSB0aGlzLl9tYXAuZ2V0KGtleSk7XG5cbiAgICAgIGlmICghc2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlcyA9IHNldFtcImRlbGV0ZVwiXSh2YWx1ZSk7XG5cbiAgICAgIGlmICghc2V0LnNpemUpIHtcbiAgICAgICAgdGhpcy5fbWFwW1wiZGVsZXRlXCJdKGtleSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInZhbHVlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgICByZXR1cm4gX2NvbnN0cnVjdChTZXQsIF90b0NvbnN1bWFibGVBcnJheShfdG9Db25zdW1hYmxlQXJyYXkodGhpcy5fbWFwLnZhbHVlcygpKS5tYXAoZnVuY3Rpb24gKHNldCkge1xuICAgICAgICByZXR1cm4gX3RvQ29uc3VtYWJsZUFycmF5KHNldC52YWx1ZXMoKSk7XG4gICAgICB9KSkpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTZXRNYXA7XG59KCk7XG5cbmV4cG9ydHMuU2V0TWFwID0gU2V0TWFwO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2Jhc2UvVGFnLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5UYWcgPSB2b2lkIDA7XG5cbnZhciBfQmluZGFibGUgPSByZXF1aXJlKFwiLi9CaW5kYWJsZVwiKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgVGFnID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gVGFnKGVsZW1lbnQsIHBhcmVudCwgcmVmLCBpbmRleCwgZGlyZWN0KSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVGFnKTtcblxuICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBzdWJkb2MgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChlbGVtZW50KTtcbiAgICAgIGVsZW1lbnQgPSBzdWJkb2MuZmlyc3RDaGlsZDtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBfQmluZGFibGUuQmluZGFibGUubWFrZUJpbmRhYmxlKGVsZW1lbnQpO1xuICAgIHRoaXMubm9kZSA9IHRoaXMuZWxlbWVudDtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLmRpcmVjdCA9IGRpcmVjdDtcbiAgICB0aGlzLnJlZiA9IHJlZjtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5jbGVhbnVwID0gW107XG5cbiAgICB0aGlzW19CaW5kYWJsZS5CaW5kYWJsZS5PbkFsbEdldF0gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBfdGhpczJbbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzMltuYW1lXTtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzMi5ub2RlICYmIHR5cGVvZiBfdGhpczIubm9kZVtuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBfdGhpczIkbm9kZTtcblxuICAgICAgICAgIHJldHVybiAoX3RoaXMyJG5vZGUgPSBfdGhpczIubm9kZSlbbmFtZV0uYXBwbHkoX3RoaXMyJG5vZGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpczIubm9kZSAmJiBuYW1lIGluIF90aGlzMi5ub2RlKSB7XG4gICAgICAgIHJldHVybiBfdGhpczIubm9kZVtuYW1lXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF90aGlzMltuYW1lXTtcbiAgICB9O1xuXG4gICAgdmFyIGdlbmVyYXRlU3R5bGVyID0gZnVuY3Rpb24gZ2VuZXJhdGVTdHlsZXIoX3RoaXMpIHtcbiAgICAgIHJldHVybiBfQmluZGFibGUuQmluZGFibGUubWFrZShmdW5jdGlvbiAoc3R5bGVzKSB7XG4gICAgICAgIGlmICghX3RoaXMubm9kZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHN0eWxlcykge1xuICAgICAgICAgIGlmIChwcm9wZXJ0eVswXSA9PT0gJy0nKSB7XG4gICAgICAgICAgICBfdGhpcy5ub2RlLnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5LCBTdHJpbmcoc3R5bGVzW3Byb3BlcnR5XSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhpcy5ub2RlLnN0eWxlW3Byb3BlcnR5XSA9IFN0cmluZyhzdHlsZXNbcHJvcGVydHldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLnN0eWxlID0gZ2VuZXJhdGVTdHlsZXIodGhpcyk7XG4gICAgdGhpcy5wcm94eSA9IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlKHRoaXMpO1xuICAgIHRoaXMucHJveHkuc3R5bGUuYmluZFRvKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICBfdGhpczIuZWxlbWVudC5zdHlsZVtrXSA9IHY7XG4gICAgfSk7XG4gICAgdGhpcy5wcm94eS5iaW5kVG8oZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgIGlmIChrIGluIGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudFtrXSA9IHY7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5wcm94eTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhUYWcsIFt7XG4gICAga2V5OiBcImF0dHJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXR0cihhdHRyaWJ1dGVzKSB7XG4gICAgICBmb3IgKHZhciBhdHRyaWJ1dGUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVdID09PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5ub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5vZGUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgYXR0cmlidXRlc1thdHRyaWJ1dGVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgaWYgKHRoaXMubm9kZSkge1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIF9CaW5kYWJsZS5CaW5kYWJsZS5jbGVhckJpbmRpbmdzKHRoaXMpO1xuXG4gICAgICB2YXIgY2xlYW51cDtcblxuICAgICAgd2hpbGUgKGNsZWFudXAgPSB0aGlzLmNsZWFudXAuc2hpZnQoKSkge1xuICAgICAgICBjbGVhbnVwKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgaWYgKCF0aGlzLm5vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGV0YWNoRXZlbnQgPSBuZXcgRXZlbnQoJ2N2RG9tRGV0YWNoZWQnKTtcbiAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KGRldGFjaEV2ZW50KTtcbiAgICAgIHRoaXMubm9kZSA9IHRoaXMuZWxlbWVudCA9IHRoaXMucmVmID0gdGhpcy5wYXJlbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgaWYgKCF0aGlzLm5vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGV0YWNoRXZlbnQgPSBuZXcgRXZlbnQoJ2N2RG9tRGV0YWNoZWQnKTtcblxuICAgICAgd2hpbGUgKHRoaXMubm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgIHRoaXMubm9kZS5maXJzdENoaWxkLmRpc3BhdGNoRXZlbnQoZGV0YWNoRXZlbnQpO1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwYXVzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXVzZSgpIHtcbiAgICAgIHZhciBwYXVzZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxpc3RlblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW4oZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciByZW1vdmVyID0gZnVuY3Rpb24gcmVtb3ZlcigpIHtcbiAgICAgICAgcmVtb3ZlKCk7XG5cbiAgICAgICAgcmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ0FscmVhZHkgcmVtb3ZlZCEnKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMucGFyZW50Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZXIoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlbW92ZXI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFRhZztcbn0oKTtcblxuZXhwb3J0cy5UYWcgPSBUYWc7XG4gIH0pKCk7XG59KTsiLCJcbnJlcXVpcmUucmVnaXN0ZXIoXCJjdXJ2YXR1cmUvYmFzZS9WaWV3LmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5WaWV3ID0gdm9pZCAwO1xuXG52YXIgX0JpbmRhYmxlID0gcmVxdWlyZShcIi4vQmluZGFibGVcIik7XG5cbnZhciBfVmlld0xpc3QgPSByZXF1aXJlKFwiLi9WaWV3TGlzdFwiKTtcblxudmFyIF9Sb3V0ZXIgPSByZXF1aXJlKFwiLi9Sb3V0ZXJcIik7XG5cbnZhciBfRG9tID0gcmVxdWlyZShcIi4vRG9tXCIpO1xuXG52YXIgX1RhZyA9IHJlcXVpcmUoXCIuL1RhZ1wiKTtcblxudmFyIF9CYWcgPSByZXF1aXJlKFwiLi9CYWdcIik7XG5cbnZhciBfUnVsZVNldCA9IHJlcXVpcmUoXCIuL1J1bGVTZXRcIik7XG5cbnZhciBfTWl4aW4gPSByZXF1aXJlKFwiLi9NaXhpblwiKTtcblxudmFyIF9Qcm9taXNlTWl4aW4gPSByZXF1aXJlKFwiLi4vbWl4aW4vUHJvbWlzZU1peGluXCIpO1xuXG52YXIgX0V2ZW50VGFyZ2V0TWl4aW4gPSByZXF1aXJlKFwiLi4vbWl4aW4vRXZlbnRUYXJnZXRNaXhpblwiKTtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgaXRlcltTeW1ib2wuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTsgfVxuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsgdmFyIF9pID0gYXJyID09IG51bGwgPyBudWxsIDogdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcnJbU3ltYm9sLml0ZXJhdG9yXSB8fCBhcnJbXCJAQGl0ZXJhdG9yXCJdOyBpZiAoX2kgPT0gbnVsbCkgcmV0dXJuOyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9zLCBfZTsgdHJ5IHsgZm9yIChfaSA9IF9pLmNhbGwoYXJyKTsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lMikgeyB0aHJvdyBfZTI7IH0sIGY6IEYgfTsgfSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH0gdmFyIG5vcm1hbENvbXBsZXRpb24gPSB0cnVlLCBkaWRFcnIgPSBmYWxzZSwgZXJyOyByZXR1cm4geyBzOiBmdW5jdGlvbiBzKCkgeyBpdCA9IGl0LmNhbGwobyk7IH0sIG46IGZ1bmN0aW9uIG4oKSB7IHZhciBzdGVwID0gaXQubmV4dCgpOyBub3JtYWxDb21wbGV0aW9uID0gc3RlcC5kb25lOyByZXR1cm4gc3RlcDsgfSwgZTogZnVuY3Rpb24gZShfZTMpIHsgZGlkRXJyID0gdHJ1ZTsgZXJyID0gX2UzOyB9LCBmOiBmdW5jdGlvbiBmKCkgeyB0cnkgeyBpZiAoIW5vcm1hbENvbXBsZXRpb24gJiYgaXRbXCJyZXR1cm5cIl0gIT0gbnVsbCkgaXRbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKGRpZEVycikgdGhyb3cgZXJyOyB9IH0gfTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSBlbHNlIGlmIChjYWxsICE9PSB2b2lkIDApIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkRlcml2ZWQgY29uc3RydWN0b3JzIG1heSBvbmx5IHJldHVybiBvYmplY3Qgb3IgdW5kZWZpbmVkXCIpOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IEJvb2xlYW4ucHJvdG90eXBlLnZhbHVlT2YuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChCb29sZWFuLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgZG9udFBhcnNlID0gU3ltYm9sKCdkb250UGFyc2UnKTtcbnZhciBleHBhbmRCaW5kID0gU3ltYm9sKCdleHBhbmRCaW5kJyk7XG52YXIgdXVpZCA9IFN5bWJvbCgndXVpZCcpO1xudmFyIG1vdmVJbmRleCA9IDA7XG5cbnZhciBWaWV3ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfTWl4aW4kd2l0aCkge1xuICBfaW5oZXJpdHMoVmlldywgX01peGluJHdpdGgpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoVmlldyk7XG5cbiAgZnVuY3Rpb24gVmlldygpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgdmFyIG1haW5WaWV3ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFZpZXcpO1xuXG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBhcmdzLCBtYWluVmlldyk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnYXJncycsIHtcbiAgICAgIHZhbHVlOiBfQmluZGFibGUuQmluZGFibGUubWFrZShhcmdzKVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgdXVpZCwge1xuICAgICAgdmFsdWU6IF90aGlzLmNvbnN0cnVjdG9yLnV1aWQoKVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ25vZGVzQXR0YWNoZWQnLCB7XG4gICAgICB2YWx1ZTogbmV3IF9CYWcuQmFnKGZ1bmN0aW9uIChpLCBzLCBhKSB7fSlcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdub2Rlc0RldGFjaGVkJywge1xuICAgICAgdmFsdWU6IG5ldyBfQmFnLkJhZyhmdW5jdGlvbiAoaSwgcywgYSkge30pXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnX29uUmVtb3ZlJywge1xuICAgICAgdmFsdWU6IG5ldyBfQmFnLkJhZyhmdW5jdGlvbiAoaSwgcywgYSkge30pXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnY2xlYW51cCcsIHtcbiAgICAgIHZhbHVlOiBbXVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ3BhcmVudCcsIHtcbiAgICAgIHZhbHVlOiBtYWluVmlld1xuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ3ZpZXdzJywge1xuICAgICAgdmFsdWU6IG5ldyBNYXAoKVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ3ZpZXdMaXN0cycsIHtcbiAgICAgIHZhbHVlOiBuZXcgTWFwKClcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICd3aXRoVmlld3MnLCB7XG4gICAgICB2YWx1ZTogbmV3IE1hcCgpXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAndGFncycsIHtcbiAgICAgIHZhbHVlOiBfQmluZGFibGUuQmluZGFibGUubWFrZSh7fSlcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdub2RlcycsIHtcbiAgICAgIHZhbHVlOiBfQmluZGFibGUuQmluZGFibGUubWFrZShbXSlcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICd0aW1lb3V0cycsIHtcbiAgICAgIHZhbHVlOiBuZXcgTWFwKClcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdpbnRlcnZhbHMnLCB7XG4gICAgICB2YWx1ZTogW11cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdmcmFtZXMnLCB7XG4gICAgICB2YWx1ZTogW11cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdydWxlU2V0Jywge1xuICAgICAgdmFsdWU6IG5ldyBfUnVsZVNldC5SdWxlU2V0KClcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdwcmVSdWxlU2V0Jywge1xuICAgICAgdmFsdWU6IG5ldyBfUnVsZVNldC5SdWxlU2V0KClcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksICdzdWJCaW5kaW5ncycsIHtcbiAgICAgIHZhbHVlOiB7fVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ3RlbXBsYXRlcycsIHtcbiAgICAgIHZhbHVlOiB7fVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ2V2ZW50Q2xlYW51cCcsIHtcbiAgICAgIHZhbHVlOiBbXVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ3VucGF1c2VDYWxsYmFja3MnLCB7XG4gICAgICB2YWx1ZTogbmV3IE1hcCgpXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAnaW50ZXJwb2xhdGVSZWdleCcsIHtcbiAgICAgIHZhbHVlOiAvKFxcW1xcWygoPzpcXCQrKT9bXFx3XFwuXFx8LV0rKVxcXVxcXSkvZ1xuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgJ3JlbmRlcmVkJywge1xuICAgICAgdmFsdWU6IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhY2NlcHQsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCAncmVuZGVyQ29tcGxldGUnLCB7XG4gICAgICAgICAgdmFsdWU6IGFjY2VwdFxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfSk7XG4gICAgX3RoaXMuY29udHJvbGxlciA9IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpO1xuICAgIF90aGlzLmxvYWRlZCA9IFByb21pc2UucmVzb2x2ZShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG4gICAgX3RoaXMudGVtcGxhdGUgPSBcIlwiO1xuICAgIF90aGlzLmZpcnN0Tm9kZSA9IG51bGw7XG4gICAgX3RoaXMubGFzdE5vZGUgPSBudWxsO1xuICAgIF90aGlzLnZpZXdMaXN0ID0gbnVsbDtcbiAgICBfdGhpcy5tYWluVmlldyA9IG51bGw7XG4gICAgX3RoaXMucHJlc2VydmUgPSBmYWxzZTtcbiAgICBfdGhpcy5yZW1vdmVkID0gZmFsc2U7IC8vIHJldHVybiBCaW5kYWJsZS5tYWtlKHRoaXMpO1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFZpZXcsIFt7XG4gICAga2V5OiBcIl9pZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXNbdXVpZF07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9uRnJhbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25GcmFtZShjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciBzdG9wcGVkID0gZmFsc2U7XG5cbiAgICAgIHZhciBjYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgfTtcblxuICAgICAgdmFyIGMgPSBmdW5jdGlvbiBjKHRpbWVzdGFtcCkge1xuICAgICAgICBpZiAoX3RoaXMyLnJlbW92ZWQgfHwgc3RvcHBlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghX3RoaXMyLnBhdXNlZCkge1xuICAgICAgICAgIGNhbGxiYWNrKERhdGUubm93KCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGMpO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGMoRGF0ZS5ub3coKSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZnJhbWVzLnB1c2goY2FuY2VsKTtcbiAgICAgIHJldHVybiBjYW5jZWw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9uTmV4dEZyYW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uTmV4dEZyYW1lKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKERhdGUubm93KCkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9uSWRsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbklkbGUoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiByZXF1ZXN0SWRsZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKERhdGUubm93KCkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9uVGltZW91dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvblRpbWVvdXQodGltZSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICB2YXIgdGltZW91dEluZm8gPSB7XG4gICAgICAgIHRpbWVvdXQ6IG51bGwsXG4gICAgICAgIGNhbGxiYWNrOiBudWxsLFxuICAgICAgICB0aW1lOiB0aW1lLFxuICAgICAgICBmaXJlZDogZmFsc2UsXG4gICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICBwYXVzZWQ6IGZhbHNlXG4gICAgICB9O1xuXG4gICAgICB2YXIgd3JhcHBlZENhbGxiYWNrID0gZnVuY3Rpb24gd3JhcHBlZENhbGxiYWNrKCkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB0aW1lb3V0SW5mby5maXJlZCA9IHRydWU7XG5cbiAgICAgICAgX3RoaXMzLnRpbWVvdXRzW1wiZGVsZXRlXCJdKHRpbWVvdXRJbmZvLnRpbWVvdXQpO1xuICAgICAgfTtcblxuICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHdyYXBwZWRDYWxsYmFjaywgdGltZSk7XG4gICAgICB0aW1lb3V0SW5mby5jYWxsYmFjayA9IHdyYXBwZWRDYWxsYmFjaztcbiAgICAgIHRpbWVvdXRJbmZvLnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgICAgdGhpcy50aW1lb3V0cy5zZXQodGltZW91dEluZm8udGltZW91dCwgdGltZW91dEluZm8pO1xuICAgICAgcmV0dXJuIHRpbWVvdXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyVGltZW91dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiAoX2NsZWFyVGltZW91dCkge1xuICAgICAgZnVuY3Rpb24gY2xlYXJUaW1lb3V0KF94KSB7XG4gICAgICAgIHJldHVybiBfY2xlYXJUaW1lb3V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG5cbiAgICAgIGNsZWFyVGltZW91dC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9jbGVhclRpbWVvdXQudG9TdHJpbmcoKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBjbGVhclRpbWVvdXQ7XG4gICAgfShmdW5jdGlvbiAodGltZW91dCkge1xuICAgICAgdmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMudGltZW91dHMpLFxuICAgICAgICAgIF9zdGVwO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvci5zKCk7ICEoX3N0ZXAgPSBfaXRlcmF0b3IubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBfc3RlcCR2YWx1ZSA9IF9zbGljZWRUb0FycmF5KF9zdGVwLnZhbHVlLCAyKSxcbiAgICAgICAgICAgICAgY2FsbGJhY2sgPSBfc3RlcCR2YWx1ZVswXSxcbiAgICAgICAgICAgICAgdGltZW91dEluZm8gPSBfc3RlcCR2YWx1ZVsxXTtcblxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SW5mby50aW1lb3V0KTtcbiAgICAgICAgICB0aGlzLnRpbWVvdXRzW1wiZGVsZXRlXCJdKHRpbWVvdXRJbmZvLnRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvci5mKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfSwge1xuICAgIGtleTogXCJvbkludGVydmFsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uSW50ZXJ2YWwodGltZSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciB0aW1lb3V0ID0gc2V0SW50ZXJ2YWwoY2FsbGJhY2ssIHRpbWUpO1xuICAgICAgdGhpcy5pbnRlcnZhbHMucHVzaCh7XG4gICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgcGF1c2VkOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGltZW91dDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJJbnRlcnZhbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiAoX2NsZWFySW50ZXJ2YWwpIHtcbiAgICAgIGZ1bmN0aW9uIGNsZWFySW50ZXJ2YWwoX3gyKSB7XG4gICAgICAgIHJldHVybiBfY2xlYXJJbnRlcnZhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuXG4gICAgICBjbGVhckludGVydmFsLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX2NsZWFySW50ZXJ2YWwudG9TdHJpbmcoKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBjbGVhckludGVydmFsO1xuICAgIH0oZnVuY3Rpb24gKHRpbWVvdXQpIHtcbiAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5pbnRlcnZhbHMpIHtcbiAgICAgICAgaWYgKHRpbWVvdXQgPT09IHRoaXMuaW50ZXJ2YWxzW2ldLnRpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxzW2ldLnRpbWVvdXQpO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmludGVydmFsc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0sIHtcbiAgICBrZXk6IFwicGF1c2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGF1c2UoKSB7XG4gICAgICB2YXIgcGF1c2VkID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChwYXVzZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnBhdXNlZCA9ICF0aGlzLnBhdXNlZDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wYXVzZWQgPSBwYXVzZWQ7XG5cbiAgICAgIGlmICh0aGlzLnBhdXNlZCkge1xuICAgICAgICB2YXIgX2l0ZXJhdG9yMiA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMudGltZW91dHMpLFxuICAgICAgICAgICAgX3N0ZXAyO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yIChfaXRlcmF0b3IyLnMoKTsgIShfc3RlcDIgPSBfaXRlcmF0b3IyLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgIHZhciBfc3RlcDIkdmFsdWUgPSBfc2xpY2VkVG9BcnJheShfc3RlcDIudmFsdWUsIDIpLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gX3N0ZXAyJHZhbHVlWzBdLFxuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBfc3RlcDIkdmFsdWVbMV07XG5cbiAgICAgICAgICAgIGlmICh0aW1lb3V0LmZpcmVkKSB7XG4gICAgICAgICAgICAgIHRoaXMudGltZW91dHNbXCJkZWxldGVcIl0odGltZW91dC50aW1lb3V0KTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0LnRpbWVvdXQpO1xuICAgICAgICAgICAgdGltZW91dC5wYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGltZW91dC50aW1lID0gTWF0aC5tYXgoMCwgdGltZW91dC50aW1lIC0gKERhdGUubm93KCkgLSB0aW1lb3V0LmNyZWF0ZWQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIF9pdGVyYXRvcjIuZShlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIF9pdGVyYXRvcjIuZigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmludGVydmFscykge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbHNbaV0udGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBfaXRlcmF0b3IzID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy50aW1lb3V0cyksXG4gICAgICAgICAgICBfc3RlcDM7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKF9pdGVyYXRvcjMucygpOyAhKF9zdGVwMyA9IF9pdGVyYXRvcjMubigpKS5kb25lOykge1xuICAgICAgICAgICAgdmFyIF9zdGVwMyR2YWx1ZSA9IF9zbGljZWRUb0FycmF5KF9zdGVwMy52YWx1ZSwgMiksXG4gICAgICAgICAgICAgICAgX2NhbGxiYWNrID0gX3N0ZXAzJHZhbHVlWzBdLFxuICAgICAgICAgICAgICAgIF90aW1lb3V0ID0gX3N0ZXAzJHZhbHVlWzFdO1xuXG4gICAgICAgICAgICBpZiAoIV90aW1lb3V0LnBhdXNlZCkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF90aW1lb3V0LmZpcmVkKSB7XG4gICAgICAgICAgICAgIHRoaXMudGltZW91dHNbXCJkZWxldGVcIl0oX3RpbWVvdXQudGltZW91dCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdGltZW91dC50aW1lb3V0ID0gc2V0VGltZW91dChfdGltZW91dC5jYWxsYmFjaywgX3RpbWVvdXQudGltZSk7XG4gICAgICAgICAgICBfdGltZW91dC5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIF9pdGVyYXRvcjMuZShlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIF9pdGVyYXRvcjMuZigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgX2kyIGluIHRoaXMuaW50ZXJ2YWxzKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmludGVydmFsc1tfaTJdLnRpbWVvdXQucGF1c2VkKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmludGVydmFsc1tfaTJdLnRpbWVvdXQucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5pbnRlcnZhbHNbX2kyXS50aW1lb3V0ID0gc2V0SW50ZXJ2YWwodGhpcy5pbnRlcnZhbHNbX2kyXS5jYWxsYmFjaywgdGhpcy5pbnRlcnZhbHNbX2kyXS50aW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfaXRlcmF0b3I0ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy51bnBhdXNlQ2FsbGJhY2tzKSxcbiAgICAgICAgICAgIF9zdGVwNDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAoX2l0ZXJhdG9yNC5zKCk7ICEoX3N0ZXA0ID0gX2l0ZXJhdG9yNC5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICB2YXIgX3N0ZXA0JHZhbHVlID0gX3NsaWNlZFRvQXJyYXkoX3N0ZXA0LnZhbHVlLCAyKSxcbiAgICAgICAgICAgICAgICBfY2FsbGJhY2syID0gX3N0ZXA0JHZhbHVlWzFdO1xuXG4gICAgICAgICAgICBfY2FsbGJhY2syKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBfaXRlcmF0b3I0LmUoZXJyKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBfaXRlcmF0b3I0LmYoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5wYXVzZUNhbGxiYWNrcy5jbGVhcigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2l0ZXJhdG9yNSA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMudmlld0xpc3RzKSxcbiAgICAgICAgICBfc3RlcDU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yNS5zKCk7ICEoX3N0ZXA1ID0gX2l0ZXJhdG9yNS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIF9zdGVwNSR2YWx1ZSA9IF9zbGljZWRUb0FycmF5KF9zdGVwNS52YWx1ZSwgMiksXG4gICAgICAgICAgICAgIHRhZyA9IF9zdGVwNSR2YWx1ZVswXSxcbiAgICAgICAgICAgICAgdmlld0xpc3QgPSBfc3RlcDUkdmFsdWVbMV07XG5cbiAgICAgICAgICB2aWV3TGlzdC5wYXVzZSghIXBhdXNlZCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3I1LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjUuZigpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaTMgaW4gdGhpcy50YWdzKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMudGFnc1tfaTNdKSkge1xuICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy50YWdzW19pM10pIHtcbiAgICAgICAgICAgIHRoaXMudGFnc1tfaTNdW2pdLnBhdXNlKCEhcGF1c2VkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFnc1tfaTNdLnBhdXNlKCEhcGF1c2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVuZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHZhciBfdGhpcyRub2RlcyxcbiAgICAgICAgICBfdGhpczQgPSB0aGlzO1xuXG4gICAgICB2YXIgcGFyZW50Tm9kZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICAgIHZhciBpbnNlcnRQb2ludCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgICAgaWYgKHBhcmVudE5vZGUgaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICAgIHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLmZpcnN0Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5zZXJ0UG9pbnQgaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICAgIGluc2VydFBvaW50ID0gaW5zZXJ0UG9pbnQuZmlyc3ROb2RlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5maXJzdE5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVSZW5kZXIocGFyZW50Tm9kZSwgaW5zZXJ0UG9pbnQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZW5kZXInKSk7XG4gICAgICB2YXIgdGVtcGxhdGVQYXJzZWQgPSB0aGlzLnRlbXBsYXRlIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCA/IHRoaXMudGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpIDogVmlldy50ZW1wbGF0ZXMuaGFzKHRoaXMudGVtcGxhdGUpO1xuICAgICAgdmFyIHN1YkRvYyA9IHRlbXBsYXRlUGFyc2VkID8gdGhpcy50ZW1wbGF0ZSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQgPyB0ZW1wbGF0ZVBhcnNlZCA6IFZpZXcudGVtcGxhdGVzLmdldCh0aGlzLnRlbXBsYXRlKS5jbG9uZU5vZGUodHJ1ZSkgOiBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCh0aGlzLnRlbXBsYXRlKTtcblxuICAgICAgaWYgKCF0ZW1wbGF0ZVBhcnNlZCAmJiAhKHRoaXMudGVtcGxhdGUgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSkge1xuICAgICAgICBWaWV3LnRlbXBsYXRlcy5zZXQodGhpcy50ZW1wbGF0ZSwgc3ViRG9jLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWFpblZpZXcgfHwgdGhpcy5wcmVSdWxlU2V0LmFwcGx5KHN1YkRvYywgdGhpcyk7XG4gICAgICB0aGlzLm1hcFRhZ3Moc3ViRG9jKTtcbiAgICAgIHRoaXMubWFpblZpZXcgfHwgdGhpcy5ydWxlU2V0LmFwcGx5KHN1YkRvYywgdGhpcyk7XG5cbiAgICAgIGlmICh3aW5kb3cuZGV2TW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJUZW1wbGF0ZSBcIi5jb25jYXQodGhpcy5faWQsIFwiIFN0YXJ0XCIpKTtcbiAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJUZW1wbGF0ZSBcIi5jb25jYXQodGhpcy5faWQsIFwiIEVuZFwiKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgIH1cblxuICAgICAgKF90aGlzJG5vZGVzID0gdGhpcy5ub2RlcykucHVzaC5hcHBseShfdGhpcyRub2RlcywgW3RoaXMuZmlyc3ROb2RlXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KEFycmF5LmZyb20oc3ViRG9jLmNoaWxkTm9kZXMpKSwgW3RoaXMubGFzdE5vZGVdKSk7XG5cbiAgICAgIHRoaXMucG9zdFJlbmRlcihwYXJlbnROb2RlKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlbmRlcmVkJykpO1xuXG4gICAgICBpZiAoIXRoaXMuZGlzcGF0Y2hBdHRhY2goKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgIHZhciByb290Tm9kZSA9IHBhcmVudE5vZGUuZ2V0Um9vdE5vZGUoKTtcblxuICAgICAgICBpZiAoaW5zZXJ0UG9pbnQpIHtcbiAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmZpcnN0Tm9kZSwgaW5zZXJ0UG9pbnQpO1xuICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMubGFzdE5vZGUsIGluc2VydFBvaW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMuZmlyc3ROb2RlKTtcbiAgICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMubGFzdE5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc3ViRG9jLCB0aGlzLmxhc3ROb2RlKTtcbiAgICAgICAgbW92ZUluZGV4Kys7XG5cbiAgICAgICAgaWYgKHJvb3ROb2RlLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hlZChyb290Tm9kZSwgcGFyZW50Tm9kZSk7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEF0dGFjaGVkKHJvb3ROb2RlLCBwYXJlbnROb2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgZmlyc3REb21BdHRhY2ggPSBmdW5jdGlvbiBmaXJzdERvbUF0dGFjaChldmVudCkge1xuICAgICAgICAgICAgaWYgKCFldmVudC50YXJnZXQuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdGhpczQuYXR0YWNoZWQocm9vdE5vZGUsIHBhcmVudE5vZGUpO1xuXG4gICAgICAgICAgICBfdGhpczQuZGlzcGF0Y2hBdHRhY2hlZChyb290Tm9kZSwgcGFyZW50Tm9kZSk7XG5cbiAgICAgICAgICAgIHBhcmVudE5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY3ZEb21BdHRhY2hlZCcsIGZpcnN0RG9tQXR0YWNoKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcGFyZW50Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdjdkRvbUF0dGFjaGVkJywgZmlyc3REb21BdHRhY2gpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVuZGVyQ29tcGxldGUodGhpcy5ub2Rlcyk7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzcGF0Y2hBdHRhY2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcGF0Y2hBdHRhY2goKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnYXR0YWNoJywge1xuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICB0YXJnZXQ6IHRoaXNcbiAgICAgIH0pKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzcGF0Y2hBdHRhY2hlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwYXRjaEF0dGFjaGVkKHJvb3ROb2RlLCBwYXJlbnROb2RlKSB7XG4gICAgICB2YXIgdmlldyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnYXR0YWNoZWQnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIHZpZXc6IHZpZXcgfHwgdGhpcyxcbiAgICAgICAgICBub2RlOiBwYXJlbnROb2RlLFxuICAgICAgICAgIHJvb3Q6IHJvb3ROb2RlLFxuICAgICAgICAgIG1haW5WaWV3OiB0aGlzXG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hEb21BdHRhY2hlZCh2aWV3KTtcblxuICAgICAgdmFyIF9pdGVyYXRvcjYgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLm5vZGVzQXR0YWNoZWQuaXRlbXMoKSksXG4gICAgICAgICAgX3N0ZXA2O1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjYucygpOyAhKF9zdGVwNiA9IF9pdGVyYXRvcjYubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBjYWxsYmFjayA9IF9zdGVwNi52YWx1ZTtcbiAgICAgICAgICBjYWxsYmFjayhyb290Tm9kZSwgcGFyZW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3I2LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjYuZigpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaXNwYXRjaERvbUF0dGFjaGVkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3BhdGNoRG9tQXR0YWNoZWQodmlldykge1xuICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICAgIHRoaXMubm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBuLm5vZGVUeXBlICE9PSBOb2RlLkNPTU1FTlRfTk9ERTtcbiAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGlmICghY2hpbGQubWF0Y2hlcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9Eb20uRG9tLm1hcFRhZ3MoY2hpbGQsIGZhbHNlLCBmdW5jdGlvbiAodGFnLCB3YWxrZXIpIHtcbiAgICAgICAgICBpZiAoIXRhZy5tYXRjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGFnLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjdkRvbUF0dGFjaGVkJywge1xuICAgICAgICAgICAgdGFyZ2V0OiB0YWcsXG4gICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgdmlldzogdmlldyB8fCBfdGhpczUsXG4gICAgICAgICAgICAgIG1haW5WaWV3OiBfdGhpczVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNoaWxkLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjdkRvbUF0dGFjaGVkJywge1xuICAgICAgICAgIHRhcmdldDogY2hpbGQsXG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICB2aWV3OiB2aWV3IHx8IF90aGlzNSxcbiAgICAgICAgICAgIG1haW5WaWV3OiBfdGhpczVcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZVJlbmRlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZVJlbmRlcihwYXJlbnROb2RlLCBpbnNlcnRQb2ludCkge1xuICAgICAgdmFyIHdpbGxSZVJlbmRlciA9IHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlUmVuZGVyJyksIHtcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgdGFyZ2V0OiB0aGlzXG4gICAgICB9KTtcblxuICAgICAgaWYgKCF3aWxsUmVSZW5kZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3ViRG9jID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgaWYgKHRoaXMuZmlyc3ROb2RlLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHZhciBkZXRhY2ggPSB0aGlzLm5vZGVzRGV0YWNoZWQuaXRlbXMoKTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIGRldGFjaCkge1xuICAgICAgICAgIGRldGFjaFtpXSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN1YkRvYy5hcHBlbmQuYXBwbHkoc3ViRG9jLCBfdG9Db25zdW1hYmxlQXJyYXkodGhpcy5ub2RlcykpO1xuXG4gICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICBpZiAoaW5zZXJ0UG9pbnQpIHtcbiAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmZpcnN0Tm9kZSwgaW5zZXJ0UG9pbnQpO1xuICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMubGFzdE5vZGUsIGluc2VydFBvaW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMuZmlyc3ROb2RlKTtcbiAgICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMubGFzdE5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc3ViRG9jLCB0aGlzLmxhc3ROb2RlKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVSZW5kZXJlZCcpLCB7XG4gICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0YXJnZXQ6IHRoaXNcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciByb290Tm9kZSA9IHBhcmVudE5vZGUuZ2V0Um9vdE5vZGUoKTtcblxuICAgICAgICBpZiAocm9vdE5vZGUuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaGVkKHJvb3ROb2RlLCBwYXJlbnROb2RlKTtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoQXR0YWNoZWQocm9vdE5vZGUsIHBhcmVudE5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBUYWdzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcFRhZ3Moc3ViRG9jKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgX0RvbS5Eb20ubWFwVGFncyhzdWJEb2MsIGZhbHNlLCBmdW5jdGlvbiAodGFnLCB3YWxrZXIpIHtcbiAgICAgICAgaWYgKHRhZ1tkb250UGFyc2VdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhZy5tYXRjaGVzKSB7XG4gICAgICAgICAgdGFnID0gX3RoaXM2Lm1hcEludGVycG9sYXRhYmxlVGFnKHRhZyk7XG4gICAgICAgICAgdGFnID0gdGFnLm1hdGNoZXMoJ1tjdi10ZW1wbGF0ZV0nKSAmJiBfdGhpczYubWFwVGVtcGxhdGVUYWcodGFnKSB8fCB0YWc7XG4gICAgICAgICAgdGFnID0gdGFnLm1hdGNoZXMoJ1tjdi1zbG90XScpICYmIF90aGlzNi5tYXBTbG90VGFnKHRhZykgfHwgdGFnO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3YtcHJlcmVuZGVyXScpICYmIF90aGlzNi5tYXBQcmVuZGVyZXJUYWcodGFnKSB8fCB0YWc7XG4gICAgICAgICAgdGFnID0gdGFnLm1hdGNoZXMoJ1tjdi1saW5rXScpICYmIF90aGlzNi5tYXBMaW5rVGFnKHRhZykgfHwgdGFnO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3YtYXR0cl0nKSAmJiBfdGhpczYubWFwQXR0clRhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgICB0YWcgPSB0YWcubWF0Y2hlcygnW2N2LWV4cGFuZF0nKSAmJiBfdGhpczYubWFwRXhwYW5kYWJsZVRhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgICB0YWcgPSB0YWcubWF0Y2hlcygnW2N2LXJlZl0nKSAmJiBfdGhpczYubWFwUmVmVGFnKHRhZykgfHwgdGFnO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3Ytb25dJykgJiYgX3RoaXM2Lm1hcE9uVGFnKHRhZykgfHwgdGFnO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3YtZWFjaF0nKSAmJiBfdGhpczYubWFwRWFjaFRhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgICB0YWcgPSB0YWcubWF0Y2hlcygnW2N2LWJpbmRdJykgJiYgX3RoaXM2Lm1hcEJpbmRUYWcodGFnKSB8fCB0YWc7XG4gICAgICAgICAgdGFnID0gdGFnLm1hdGNoZXMoJ1tjdi13aXRoXScpICYmIF90aGlzNi5tYXBXaXRoVGFnKHRhZykgfHwgdGFnO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3YtaWZdJykgJiYgX3RoaXM2Lm1hcElmVGFnKHRhZykgfHwgdGFnO1xuICAgICAgICAgIHRhZyA9IHRhZy5tYXRjaGVzKCdbY3Ytdmlld10nKSAmJiBfdGhpczYubWFwVmlld1RhZyh0YWcpIHx8IHRhZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YWcgPSBfdGhpczYubWFwSW50ZXJwb2xhdGFibGVUYWcodGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YWcgIT09IHdhbGtlci5jdXJyZW50Tm9kZSkge1xuICAgICAgICAgIHdhbGtlci5jdXJyZW50Tm9kZSA9IHRhZztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcEV4cGFuZGFibGVUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFwRXhwYW5kYWJsZVRhZyh0YWcpIHtcbiAgICAgIC8qL1xuICAgICAgY29uc3QgdGFnQ29tcGlsZXIgPSB0aGlzLmNvbXBpbGVFeHBhbmRhYmxlVGFnKHRhZyk7XG4gICAgICBcdGNvbnN0IG5ld1RhZyA9IHRhZ0NvbXBpbGVyKHRoaXMpO1xuICAgICAgXHR0YWcucmVwbGFjZVdpdGgobmV3VGFnKTtcbiAgICAgIFx0cmV0dXJuIG5ld1RhZztcbiAgICAgIC8qL1xuICAgICAgdmFyIGV4aXN0aW5nID0gdGFnW2V4cGFuZEJpbmRdO1xuXG4gICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgZXhpc3RpbmcoKTtcbiAgICAgICAgdGFnW2V4cGFuZEJpbmRdID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBfQmluZGFibGUkcmVzb2x2ZSA9IF9CaW5kYWJsZS5CaW5kYWJsZS5yZXNvbHZlKHRoaXMuYXJncywgdGFnLmdldEF0dHJpYnV0ZSgnY3YtZXhwYW5kJyksIHRydWUpLFxuICAgICAgICAgIF9CaW5kYWJsZSRyZXNvbHZlMiA9IF9zbGljZWRUb0FycmF5KF9CaW5kYWJsZSRyZXNvbHZlLCAyKSxcbiAgICAgICAgICBwcm94eSA9IF9CaW5kYWJsZSRyZXNvbHZlMlswXSxcbiAgICAgICAgICBleHBhbmRQcm9wZXJ0eSA9IF9CaW5kYWJsZSRyZXNvbHZlMlsxXTtcblxuICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtZXhwYW5kJyk7XG5cbiAgICAgIGlmICghcHJveHlbZXhwYW5kUHJvcGVydHldKSB7XG4gICAgICAgIHByb3h5W2V4cGFuZFByb3BlcnR5XSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBwcm94eVtleHBhbmRQcm9wZXJ0eV0gPSBfQmluZGFibGUuQmluZGFibGUubWFrZShwcm94eVtleHBhbmRQcm9wZXJ0eV0pO1xuICAgICAgdGhpcy5vblJlbW92ZSh0YWdbZXhwYW5kQmluZF0gPSBwcm94eVtleHBhbmRQcm9wZXJ0eV0uYmluZFRvKGZ1bmN0aW9uICh2LCBrLCB0LCBkLCBwKSB7XG4gICAgICAgIGlmIChkIHx8IHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoaywgdik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYgPT09IG51bGwpIHtcbiAgICAgICAgICB0YWcuc2V0QXR0cmlidXRlKGssICcnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0YWcuc2V0QXR0cmlidXRlKGssIHYpO1xuICAgICAgfSkpOyAvLyBsZXQgZXhwYW5kUHJvcGVydHkgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi1leHBhbmQnKTtcbiAgICAgIC8vIGxldCBleHBhbmRBcmcgPSBCaW5kYWJsZS5tYWtlQmluZGFibGUoXG4gICAgICAvLyBcdHRoaXMuYXJnc1tleHBhbmRQcm9wZXJ0eV0gfHwge31cbiAgICAgIC8vICk7XG4gICAgICAvLyB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi1leHBhbmQnKTtcbiAgICAgIC8vIGZvcihsZXQgaSBpbiBleHBhbmRBcmcpXG4gICAgICAvLyB7XG4gICAgICAvLyBcdGlmKGkgPT09ICduYW1lJyB8fCBpID09PSAndHlwZScpXG4gICAgICAvLyBcdHtcbiAgICAgIC8vIFx0XHRjb250aW51ZTtcbiAgICAgIC8vIFx0fVxuICAgICAgLy8gXHRsZXQgZGViaW5kID0gZXhwYW5kQXJnLmJpbmRUbyhpLCAoKHRhZyxpKT0+KHYpPT57XG4gICAgICAvLyBcdFx0dGFnLnNldEF0dHJpYnV0ZShpLCB2KTtcbiAgICAgIC8vIFx0fSkodGFnLGkpKTtcbiAgICAgIC8vIFx0dGhpcy5vblJlbW92ZSgoKT0+e1xuICAgICAgLy8gXHRcdGRlYmluZCgpO1xuICAgICAgLy8gXHRcdGlmKGV4cGFuZEFyZy5pc0JvdW5kKCkpXG4gICAgICAvLyBcdFx0e1xuICAgICAgLy8gXHRcdFx0QmluZGFibGUuY2xlYXJCaW5kaW5ncyhleHBhbmRBcmcpO1xuICAgICAgLy8gXHRcdH1cbiAgICAgIC8vIFx0fSk7XG4gICAgICAvLyB9XG5cbiAgICAgIHJldHVybiB0YWc7IC8vKi9cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29tcGlsZUV4cGFuZGFibGVUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGlsZUV4cGFuZGFibGVUYWcoc291cmNlVGFnKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGJpbmRpbmdWaWV3KSB7XG4gICAgICAgIHZhciB0YWcgPSBzb3VyY2VUYWcuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICB2YXIgZXhwYW5kUHJvcGVydHkgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi1leHBhbmQnKTtcblxuICAgICAgICB2YXIgZXhwYW5kQXJnID0gX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2UoYmluZGluZ1ZpZXcuYXJnc1tleHBhbmRQcm9wZXJ0eV0gfHwge30pO1xuXG4gICAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LWV4cGFuZCcpO1xuXG4gICAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKGkpIHtcbiAgICAgICAgICBpZiAoaSA9PT0gJ25hbWUnIHx8IGkgPT09ICd0eXBlJykge1xuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZGViaW5kID0gZXhwYW5kQXJnLmJpbmRUbyhpLCBmdW5jdGlvbiAodGFnLCBpKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgdGFnLnNldEF0dHJpYnV0ZShpLCB2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSh0YWcsIGkpKTtcbiAgICAgICAgICBiaW5kaW5nVmlldy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWJpbmQoKTtcblxuICAgICAgICAgICAgaWYgKGV4cGFuZEFyZy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgX0JpbmRhYmxlLkJpbmRhYmxlLmNsZWFyQmluZGluZ3MoZXhwYW5kQXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIGV4cGFuZEFyZykge1xuICAgICAgICAgIHZhciBfcmV0ID0gX2xvb3AoaSk7XG5cbiAgICAgICAgICBpZiAoX3JldCA9PT0gXCJjb250aW51ZVwiKSBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YWc7XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBBdHRyVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcEF0dHJUYWcodGFnKSB7XG4gICAgICAvLyovXG4gICAgICB2YXIgdGFnQ29tcGlsZXIgPSB0aGlzLmNvbXBpbGVBdHRyVGFnKHRhZyk7XG4gICAgICB2YXIgbmV3VGFnID0gdGFnQ29tcGlsZXIodGhpcyk7XG4gICAgICB0YWcucmVwbGFjZVdpdGgobmV3VGFnKTtcbiAgICAgIHJldHVybiBuZXdUYWc7XG4gICAgICAvKi9cbiAgICAgIFx0bGV0IGF0dHJQcm9wZXJ0eSA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LWF0dHInKTtcbiAgICAgIFx0dGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtYXR0cicpO1xuICAgICAgXHRsZXQgcGFpcnMgPSBhdHRyUHJvcGVydHkuc3BsaXQoJywnKTtcbiAgICAgIGxldCBhdHRycyA9IHBhaXJzLm1hcCgocCkgPT4gcC5zcGxpdCgnOicpKTtcbiAgICAgIFx0Zm9yIChsZXQgaSBpbiBhdHRycylcbiAgICAgIHtcbiAgICAgIFx0bGV0IHByb3h5ICAgICAgICA9IHRoaXMuYXJncztcbiAgICAgIFx0bGV0IGJpbmRQcm9wZXJ0eSA9IGF0dHJzW2ldWzFdO1xuICAgICAgXHRsZXQgcHJvcGVydHkgICAgID0gYmluZFByb3BlcnR5O1xuICAgICAgXHRcdGlmKGJpbmRQcm9wZXJ0eS5tYXRjaCgvXFwuLykpXG4gICAgICBcdHtcbiAgICAgIFx0XHRbcHJveHksIHByb3BlcnR5XSA9IEJpbmRhYmxlLnJlc29sdmUoXG4gICAgICBcdFx0XHR0aGlzLmFyZ3NcbiAgICAgIFx0XHRcdCwgYmluZFByb3BlcnR5XG4gICAgICBcdFx0XHQsIHRydWVcbiAgICAgIFx0XHQpO1xuICAgICAgXHR9XG4gICAgICBcdFx0bGV0IGF0dHJpYiA9IGF0dHJzW2ldWzBdO1xuICAgICAgXHRcdHRoaXMub25SZW1vdmUocHJveHkuYmluZFRvKFxuICAgICAgXHRcdHByb3BlcnR5XG4gICAgICBcdFx0LCAodik9PntcbiAgICAgIFx0XHRcdGlmKHYgPT0gbnVsbClcbiAgICAgIFx0XHRcdHtcbiAgICAgIFx0XHRcdFx0dGFnLnNldEF0dHJpYnV0ZShhdHRyaWIsICcnKTtcbiAgICAgIFx0XHRcdFx0cmV0dXJuO1xuICAgICAgXHRcdFx0fVxuICAgICAgXHRcdFx0dGFnLnNldEF0dHJpYnV0ZShhdHRyaWIsIHYpO1xuICAgICAgXHRcdH1cbiAgICAgIFx0KSk7XG4gICAgICB9XG4gICAgICBcdHJldHVybiB0YWc7XG4gICAgICBcdC8vKi9cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29tcGlsZUF0dHJUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGlsZUF0dHJUYWcoc291cmNlVGFnKSB7XG4gICAgICB2YXIgYXR0clByb3BlcnR5ID0gc291cmNlVGFnLmdldEF0dHJpYnV0ZSgnY3YtYXR0cicpO1xuICAgICAgdmFyIHBhaXJzID0gYXR0clByb3BlcnR5LnNwbGl0KCcsJyk7XG4gICAgICB2YXIgYXR0cnMgPSBwYWlycy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuIHAuc3BsaXQoJzonKTtcbiAgICAgIH0pO1xuICAgICAgc291cmNlVGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtYXR0cicpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChiaW5kaW5nVmlldykge1xuICAgICAgICB2YXIgdGFnID0gc291cmNlVGFnLmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICB2YXIgX2xvb3AyID0gZnVuY3Rpb24gX2xvb3AyKGkpIHtcbiAgICAgICAgICB2YXIgYmluZFByb3BlcnR5ID0gYXR0cnNbaV1bMV0gfHwgYXR0cnNbaV1bMF07XG5cbiAgICAgICAgICB2YXIgX0JpbmRhYmxlJHJlc29sdmUzID0gX0JpbmRhYmxlLkJpbmRhYmxlLnJlc29sdmUoYmluZGluZ1ZpZXcuYXJncywgYmluZFByb3BlcnR5LCB0cnVlKSxcbiAgICAgICAgICAgICAgX0JpbmRhYmxlJHJlc29sdmU0ID0gX3NsaWNlZFRvQXJyYXkoX0JpbmRhYmxlJHJlc29sdmUzLCAyKSxcbiAgICAgICAgICAgICAgcHJveHkgPSBfQmluZGFibGUkcmVzb2x2ZTRbMF0sXG4gICAgICAgICAgICAgIHByb3BlcnR5ID0gX0JpbmRhYmxlJHJlc29sdmU0WzFdO1xuXG4gICAgICAgICAgdmFyIGF0dHJpYiA9IGF0dHJzW2ldWzBdO1xuICAgICAgICAgIGJpbmRpbmdWaWV3Lm9uUmVtb3ZlKHByb3h5LmJpbmRUbyhwcm9wZXJ0eSwgZnVuY3Rpb24gKHYsIGssIHQsIGQpIHtcbiAgICAgICAgICAgIGlmIChkIHx8IHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKGF0dHJpYiwgdik7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHYgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgdGFnLnNldEF0dHJpYnV0ZShhdHRyaWIsICcnKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWcuc2V0QXR0cmlidXRlKGF0dHJpYiwgdik7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gYXR0cnMpIHtcbiAgICAgICAgICBfbG9vcDIoaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwSW50ZXJwb2xhdGFibGVUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFwSW50ZXJwb2xhdGFibGVUYWcodGFnKSB7XG4gICAgICB2YXIgX3RoaXM3ID0gdGhpcztcblxuICAgICAgdmFyIHJlZ2V4ID0gdGhpcy5pbnRlcnBvbGF0ZVJlZ2V4O1xuXG4gICAgICBpZiAodGFnLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgICB2YXIgb3JpZ2luYWwgPSB0YWcubm9kZVZhbHVlO1xuXG4gICAgICAgIGlmICghdGhpcy5pbnRlcnBvbGF0YWJsZShvcmlnaW5hbCkpIHtcbiAgICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhlYWRlciA9IDA7XG4gICAgICAgIHZhciBtYXRjaDtcblxuICAgICAgICB2YXIgX2xvb3AzID0gZnVuY3Rpb24gX2xvb3AzKCkge1xuICAgICAgICAgIHZhciBiaW5kUHJvcGVydHkgPSBtYXRjaFsyXTtcbiAgICAgICAgICB2YXIgdW5zYWZlSHRtbCA9IGZhbHNlO1xuICAgICAgICAgIHZhciB1bnNhZmVWaWV3ID0gZmFsc2U7XG4gICAgICAgICAgdmFyIHByb3BlcnR5U3BsaXQgPSBiaW5kUHJvcGVydHkuc3BsaXQoJ3wnKTtcbiAgICAgICAgICB2YXIgdHJhbnNmb3JtZXIgPSBmYWxzZTtcblxuICAgICAgICAgIGlmIChwcm9wZXJ0eVNwbGl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWVyID0gX3RoaXM3LnN0cmluZ1RyYW5zZm9ybWVyKHByb3BlcnR5U3BsaXQuc2xpY2UoMSkpO1xuICAgICAgICAgICAgYmluZFByb3BlcnR5ID0gcHJvcGVydHlTcGxpdFswXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYmluZFByb3BlcnR5LnN1YnN0cigwLCAyKSA9PT0gJyQkJykge1xuICAgICAgICAgICAgdW5zYWZlSHRtbCA9IHRydWU7XG4gICAgICAgICAgICB1bnNhZmVWaWV3ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJpbmRQcm9wZXJ0eSA9IGJpbmRQcm9wZXJ0eS5zdWJzdHIoMik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGJpbmRQcm9wZXJ0eS5zdWJzdHIoMCwgMSkgPT09ICckJykge1xuICAgICAgICAgICAgdW5zYWZlSHRtbCA9IHRydWU7XG4gICAgICAgICAgICBiaW5kUHJvcGVydHkgPSBiaW5kUHJvcGVydHkuc3Vic3RyKDEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChiaW5kUHJvcGVydHkuc3Vic3RyKDAsIDMpID09PSAnMDAwJykge1xuICAgICAgICAgICAgZXhwYW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIGJpbmRQcm9wZXJ0eSA9IGJpbmRQcm9wZXJ0eS5zdWJzdHIoMyk7XG4gICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzdGF0aWNQcmVmaXggPSBvcmlnaW5hbC5zdWJzdHJpbmcoaGVhZGVyLCBtYXRjaC5pbmRleCk7XG4gICAgICAgICAgaGVhZGVyID0gbWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGg7XG4gICAgICAgICAgdmFyIHN0YXRpY05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdGF0aWNQcmVmaXgpO1xuICAgICAgICAgIHN0YXRpY05vZGVbZG9udFBhcnNlXSA9IHRydWU7XG4gICAgICAgICAgdGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHN0YXRpY05vZGUsIHRhZyk7XG4gICAgICAgICAgdmFyIGR5bmFtaWNOb2RlID0gdm9pZCAwO1xuXG4gICAgICAgICAgaWYgKHVuc2FmZUh0bWwpIHtcbiAgICAgICAgICAgIGR5bmFtaWNOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGR5bmFtaWNOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGR5bmFtaWNOb2RlW2RvbnRQYXJzZV0gPSB0cnVlO1xuICAgICAgICAgIHZhciBwcm94eSA9IF90aGlzNy5hcmdzO1xuICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IGJpbmRQcm9wZXJ0eTtcblxuICAgICAgICAgIGlmIChiaW5kUHJvcGVydHkubWF0Y2goL1xcLi8pKSB7XG4gICAgICAgICAgICB2YXIgX0JpbmRhYmxlJHJlc29sdmU1ID0gX0JpbmRhYmxlLkJpbmRhYmxlLnJlc29sdmUoX3RoaXM3LmFyZ3MsIGJpbmRQcm9wZXJ0eSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHZhciBfQmluZGFibGUkcmVzb2x2ZTYgPSBfc2xpY2VkVG9BcnJheShfQmluZGFibGUkcmVzb2x2ZTUsIDIpO1xuXG4gICAgICAgICAgICBwcm94eSA9IF9CaW5kYWJsZSRyZXNvbHZlNlswXTtcbiAgICAgICAgICAgIHByb3BlcnR5ID0gX0JpbmRhYmxlJHJlc29sdmU2WzFdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkeW5hbWljTm9kZSwgdGFnKTtcblxuICAgICAgICAgIGlmIChfdHlwZW9mKHByb3h5KSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBcImJyZWFrXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJveHkgPSBfQmluZGFibGUuQmluZGFibGUubWFrZShwcm94eSk7XG4gICAgICAgICAgdmFyIGRlYmluZCA9IHByb3h5LmJpbmRUbyhwcm9wZXJ0eSwgZnVuY3Rpb24gKHYsIGssIHQpIHtcbiAgICAgICAgICAgIGlmICh0W2tdICE9PSB2ICYmICh0W2tdIGluc3RhbmNlb2YgVmlldyB8fCB0W2tdIGluc3RhbmNlb2YgTm9kZSB8fCB0W2tdIGluc3RhbmNlb2YgX1RhZy5UYWcpKSB7XG4gICAgICAgICAgICAgIGlmICghdFtrXS5wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgICAgIHRba10ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZHluYW1pY05vZGUubm9kZVZhbHVlID0gJyc7XG5cbiAgICAgICAgICAgIGlmICh1bnNhZmVWaWV3ICYmICEodiBpbnN0YW5jZW9mIFZpZXcpKSB7XG4gICAgICAgICAgICAgIHZhciBfdjtcblxuICAgICAgICAgICAgICB2YXIgdW5zYWZlVGVtcGxhdGUgPSAoX3YgPSB2KSAhPT0gbnVsbCAmJiBfdiAhPT0gdm9pZCAwID8gX3YgOiAnJztcbiAgICAgICAgICAgICAgdiA9IG5ldyBWaWV3KF90aGlzNy5hcmdzLCBfdGhpczcpO1xuICAgICAgICAgICAgICB2LnRlbXBsYXRlID0gdW5zYWZlVGVtcGxhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1lcikge1xuICAgICAgICAgICAgICB2ID0gdHJhbnNmb3JtZXIodik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2IGluc3RhbmNlb2YgVmlldykge1xuICAgICAgICAgICAgICB2YXIgb25BdHRhY2ggPSBmdW5jdGlvbiBvbkF0dGFjaChyb290Tm9kZSwgcGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHYuZGlzcGF0Y2hBdHRhY2hlZChyb290Tm9kZSwgcGFyZW50Tm9kZSwgX3RoaXM3KTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBfdGhpczcubm9kZXNBdHRhY2hlZC5hZGQob25BdHRhY2gpO1xuXG4gICAgICAgICAgICAgIHYucmVuZGVyKHRhZy5wYXJlbnROb2RlLCBkeW5hbWljTm9kZSk7XG5cbiAgICAgICAgICAgICAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgICAgICAgICAgIGlmICghdi5wcmVzZXJ2ZSkge1xuICAgICAgICAgICAgICAgICAgdi5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgX3RoaXM3Lm9uUmVtb3ZlKGNsZWFudXApO1xuXG4gICAgICAgICAgICAgIHYub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzNy5ub2Rlc0F0dGFjaGVkLnJlbW92ZShvbkF0dGFjaCk7XG5cbiAgICAgICAgICAgICAgICBfdGhpczcuX29uUmVtb3ZlLnJlbW92ZShjbGVhbnVwKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICAgIHRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh2LCBkeW5hbWljTm9kZSk7XG5cbiAgICAgICAgICAgICAgX3RoaXM3Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdi5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBfVGFnLlRhZykge1xuICAgICAgICAgICAgICB0YWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodi5ub2RlLCBkeW5hbWljTm9kZSk7XG5cbiAgICAgICAgICAgICAgX3RoaXM3Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdi5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAodiBpbnN0YW5jZW9mIE9iamVjdCAmJiB2Ll9fdG9TdHJpbmcgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIHYgPSB2Ll9fdG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh1bnNhZmVIdG1sKSB7XG4gICAgICAgICAgICAgICAgZHluYW1pY05vZGUuaW5uZXJIVE1MID0gdjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkeW5hbWljTm9kZS5ub2RlVmFsdWUgPSB2O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGR5bmFtaWNOb2RlW2RvbnRQYXJzZV0gPSB0cnVlO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgX3RoaXM3Lm9uUmVtb3ZlKGRlYmluZCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgd2hpbGUgKG1hdGNoID0gcmVnZXguZXhlYyhvcmlnaW5hbCkpIHtcbiAgICAgICAgICB2YXIgX3JldDIgPSBfbG9vcDMoKTtcblxuICAgICAgICAgIGlmIChfcmV0MiA9PT0gXCJjb250aW51ZVwiKSBjb250aW51ZTtcbiAgICAgICAgICBpZiAoX3JldDIgPT09IFwiYnJlYWtcIikgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RhdGljU3VmZml4ID0gb3JpZ2luYWwuc3Vic3RyaW5nKGhlYWRlcik7XG4gICAgICAgIHZhciBzdGF0aWNOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RhdGljU3VmZml4KTtcbiAgICAgICAgc3RhdGljTm9kZVtkb250UGFyc2VdID0gdHJ1ZTtcbiAgICAgICAgdGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHN0YXRpY05vZGUsIHRhZyk7XG4gICAgICAgIHRhZy5ub2RlVmFsdWUgPSAnJztcbiAgICAgIH0gZWxzZSBpZiAodGFnLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICB2YXIgX2xvb3A0ID0gZnVuY3Rpb24gX2xvb3A0KGkpIHtcbiAgICAgICAgICBpZiAoIV90aGlzNy5pbnRlcnBvbGF0YWJsZSh0YWcuYXR0cmlidXRlc1tpXS52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGhlYWRlciA9IDA7XG4gICAgICAgICAgdmFyIG1hdGNoID0gdm9pZCAwO1xuICAgICAgICAgIHZhciBvcmlnaW5hbCA9IHRhZy5hdHRyaWJ1dGVzW2ldLnZhbHVlO1xuICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSB0YWcuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICB2YXIgYmluZFByb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgICB2YXIgc2VnbWVudHMgPSBbXTtcblxuICAgICAgICAgIHdoaWxlIChtYXRjaCA9IHJlZ2V4LmV4ZWMob3JpZ2luYWwpKSB7XG4gICAgICAgICAgICBzZWdtZW50cy5wdXNoKG9yaWdpbmFsLnN1YnN0cmluZyhoZWFkZXIsIG1hdGNoLmluZGV4KSk7XG5cbiAgICAgICAgICAgIGlmICghYmluZFByb3BlcnRpZXNbbWF0Y2hbMl1dKSB7XG4gICAgICAgICAgICAgIGJpbmRQcm9wZXJ0aWVzW21hdGNoWzJdXSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiaW5kUHJvcGVydGllc1ttYXRjaFsyXV0ucHVzaChzZWdtZW50cy5sZW5ndGgpO1xuICAgICAgICAgICAgc2VnbWVudHMucHVzaChtYXRjaFsxXSk7XG4gICAgICAgICAgICBoZWFkZXIgPSBtYXRjaC5pbmRleCArIG1hdGNoWzFdLmxlbmd0aDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWdtZW50cy5wdXNoKG9yaWdpbmFsLnN1YnN0cmluZyhoZWFkZXIpKTtcblxuICAgICAgICAgIHZhciBfbG9vcDUgPSBmdW5jdGlvbiBfbG9vcDUoaikge1xuICAgICAgICAgICAgdmFyIHByb3h5ID0gX3RoaXM3LmFyZ3M7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBqO1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5U3BsaXQgPSBqLnNwbGl0KCd8Jyk7XG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBsb25nUHJvcGVydHkgPSBqO1xuXG4gICAgICAgICAgICBpZiAocHJvcGVydHlTcGxpdC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybWVyID0gX3RoaXM3LnN0cmluZ1RyYW5zZm9ybWVyKHByb3BlcnR5U3BsaXQuc2xpY2UoMSkpO1xuICAgICAgICAgICAgICBwcm9wZXJ0eSA9IHByb3BlcnR5U3BsaXRbMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5tYXRjaCgvXFwuLykpIHtcbiAgICAgICAgICAgICAgdmFyIF9CaW5kYWJsZSRyZXNvbHZlNyA9IF9CaW5kYWJsZS5CaW5kYWJsZS5yZXNvbHZlKF90aGlzNy5hcmdzLCBwcm9wZXJ0eSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgdmFyIF9CaW5kYWJsZSRyZXNvbHZlOCA9IF9zbGljZWRUb0FycmF5KF9CaW5kYWJsZSRyZXNvbHZlNywgMik7XG5cbiAgICAgICAgICAgICAgcHJveHkgPSBfQmluZGFibGUkcmVzb2x2ZThbMF07XG4gICAgICAgICAgICAgIHByb3BlcnR5ID0gX0JpbmRhYmxlJHJlc29sdmU4WzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbWF0Y2hpbmcgPSBbXTtcbiAgICAgICAgICAgIHZhciBiaW5kUHJvcGVydHkgPSBqO1xuICAgICAgICAgICAgdmFyIG1hdGNoaW5nU2VnbWVudHMgPSBiaW5kUHJvcGVydGllc1tsb25nUHJvcGVydHldOyAvLyBjb25zdCBjaGFuZ2VBdHRyaWJ1dGUgPSAodiwgaywgdCwgZCkgPT4ge1xuICAgICAgICAgICAgLy8gXHR0YWcuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lLCBzZWdtZW50cy5qb2luKCcnKSk7XG4gICAgICAgICAgICAvLyB9O1xuXG4gICAgICAgICAgICBfdGhpczcub25SZW1vdmUocHJveHkuYmluZFRvKHByb3BlcnR5LCBmdW5jdGlvbiAodiwgaywgdCwgZCkge1xuICAgICAgICAgICAgICBpZiAodHJhbnNmb3JtZXIpIHtcbiAgICAgICAgICAgICAgICB2ID0gdHJhbnNmb3JtZXIodik7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBmb3IgKHZhciBfaTQgaW4gYmluZFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaiBpbiBiaW5kUHJvcGVydGllc1tsb25nUHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICBzZWdtZW50c1tiaW5kUHJvcGVydGllc1tsb25nUHJvcGVydHldW19qXV0gPSB0W19pNF07XG5cbiAgICAgICAgICAgICAgICAgIGlmIChrID09PSBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICBzZWdtZW50c1tiaW5kUHJvcGVydGllc1tsb25nUHJvcGVydHldW19qXV0gPSB2O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICghX3RoaXM3LnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIC8vIGNoYW5nZUF0dHJpYnV0ZSh2LGssdCxkKTtcbiAgICAgICAgICAgICAgICB0YWcuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lLCBzZWdtZW50cy5qb2luKCcnKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy51bnBhdXNlQ2FsbGJhY2tzLnNldChhdHRyaWJ1dGUsICgpID0+IGNoYW5nZUF0dHJpYnV0ZSh2LGssdCxkKSk7XG4gICAgICAgICAgICAgICAgX3RoaXM3LnVucGF1c2VDYWxsYmFja3Muc2V0KGF0dHJpYnV0ZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhZy5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLm5hbWUsIHNlZ21lbnRzLmpvaW4oJycpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBfdGhpczcub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBpZiAoIXByb3h5LmlzQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIF9CaW5kYWJsZS5CaW5kYWJsZS5jbGVhckJpbmRpbmdzKHByb3h5KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGZvciAodmFyIGogaW4gYmluZFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIF9sb29wNShqKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWcuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBfcmV0MyA9IF9sb29wNChpKTtcblxuICAgICAgICAgIGlmIChfcmV0MyA9PT0gXCJjb250aW51ZVwiKSBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBSZWZUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFwUmVmVGFnKHRhZykge1xuICAgICAgdmFyIHJlZkF0dHIgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi1yZWYnKTtcblxuICAgICAgdmFyIF9yZWZBdHRyJHNwbGl0ID0gcmVmQXR0ci5zcGxpdCgnOicpLFxuICAgICAgICAgIF9yZWZBdHRyJHNwbGl0MiA9IF9zbGljZWRUb0FycmF5KF9yZWZBdHRyJHNwbGl0LCAzKSxcbiAgICAgICAgICByZWZQcm9wID0gX3JlZkF0dHIkc3BsaXQyWzBdLFxuICAgICAgICAgIF9yZWZBdHRyJHNwbGl0MiQgPSBfcmVmQXR0ciRzcGxpdDJbMV0sXG4gICAgICAgICAgcmVmQ2xhc3NuYW1lID0gX3JlZkF0dHIkc3BsaXQyJCA9PT0gdm9pZCAwID8gbnVsbCA6IF9yZWZBdHRyJHNwbGl0MiQsXG4gICAgICAgICAgX3JlZkF0dHIkc3BsaXQyJDIgPSBfcmVmQXR0ciRzcGxpdDJbMl0sXG4gICAgICAgICAgcmVmS2V5ID0gX3JlZkF0dHIkc3BsaXQyJDIgPT09IHZvaWQgMCA/IG51bGwgOiBfcmVmQXR0ciRzcGxpdDIkMjtcblxuICAgICAgdmFyIHJlZkNsYXNzID0gX1RhZy5UYWc7XG5cbiAgICAgIGlmIChyZWZDbGFzc25hbWUpIHtcbiAgICAgICAgcmVmQ2xhc3MgPSB0aGlzLnN0cmluZ1RvQ2xhc3MocmVmQ2xhc3NuYW1lKTtcbiAgICAgIH1cblxuICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtcmVmJyk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFnLCAnX19fdGFnX19fJywge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRhZy5fX190YWdfX18gPSBudWxsO1xuICAgICAgICB0YWcucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuICAgICAgdmFyIGRpcmVjdCA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLnZpZXdMaXN0KSB7XG4gICAgICAgIHBhcmVudCA9IHRoaXMudmlld0xpc3QucGFyZW50OyAvLyBpZighdGhpcy52aWV3TGlzdC5wYXJlbnQudGFnc1tyZWZQcm9wXSlcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyBcdHRoaXMudmlld0xpc3QucGFyZW50LnRhZ3NbcmVmUHJvcF0gPSBbXTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBsZXQgcmVmS2V5VmFsID0gdGhpcy5hcmdzW3JlZktleV07XG4gICAgICAgIC8vIHRoaXMudmlld0xpc3QucGFyZW50LnRhZ3NbcmVmUHJvcF1bcmVmS2V5VmFsXSA9IG5ldyByZWZDbGFzcyhcbiAgICAgICAgLy8gXHR0YWcsIHRoaXMsIHJlZlByb3AsIHJlZktleVZhbFxuICAgICAgICAvLyApO1xuICAgICAgfSBlbHNlIHsvLyB0aGlzLnRhZ3NbcmVmUHJvcF0gPSBuZXcgcmVmQ2xhc3MoXG4gICAgICAgIC8vIFx0dGFnLCB0aGlzLCByZWZQcm9wXG4gICAgICAgIC8vICk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0YWdPYmplY3QgPSBuZXcgcmVmQ2xhc3ModGFnLCB0aGlzLCByZWZQcm9wLCB1bmRlZmluZWQsIGRpcmVjdCk7XG4gICAgICB0YWcuX19fdGFnX19fID0gdGFnT2JqZWN0O1xuICAgICAgdGhpcy50YWdzW3JlZlByb3BdID0gdGFnT2JqZWN0O1xuXG4gICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIHZhciByZWZLZXlWYWwgPSB0aGlzLmFyZ3NbcmVmS2V5XTtcblxuICAgICAgICBpZiAocmVmS2V5VmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAoIXBhcmVudC50YWdzW3JlZlByb3BdKSB7XG4gICAgICAgICAgICBwYXJlbnQudGFnc1tyZWZQcm9wXSA9IFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhcmVudC50YWdzW3JlZlByb3BdW3JlZktleVZhbF0gPSB0YWdPYmplY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LnRhZ3NbcmVmUHJvcF0gPSB0YWdPYmplY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXBhcmVudC5wYXJlbnQpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YWc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcEJpbmRUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFwQmluZFRhZyh0YWcpIHtcbiAgICAgIHZhciBfdGhpczggPSB0aGlzO1xuXG4gICAgICB2YXIgYmluZEFyZyA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LWJpbmQnKTtcbiAgICAgIHZhciBwcm94eSA9IHRoaXMuYXJncztcbiAgICAgIHZhciBwcm9wZXJ0eSA9IGJpbmRBcmc7XG4gICAgICB2YXIgdG9wID0gbnVsbDtcblxuICAgICAgaWYgKGJpbmRBcmcubWF0Y2goL1xcLi8pKSB7XG4gICAgICAgIHZhciBfQmluZGFibGUkcmVzb2x2ZTkgPSBfQmluZGFibGUuQmluZGFibGUucmVzb2x2ZSh0aGlzLmFyZ3MsIGJpbmRBcmcsIHRydWUpO1xuXG4gICAgICAgIHZhciBfQmluZGFibGUkcmVzb2x2ZTEwID0gX3NsaWNlZFRvQXJyYXkoX0JpbmRhYmxlJHJlc29sdmU5LCAzKTtcblxuICAgICAgICBwcm94eSA9IF9CaW5kYWJsZSRyZXNvbHZlMTBbMF07XG4gICAgICAgIHByb3BlcnR5ID0gX0JpbmRhYmxlJHJlc29sdmUxMFsxXTtcbiAgICAgICAgdG9wID0gX0JpbmRhYmxlJHJlc29sdmUxMFsyXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3h5ICE9PSB0aGlzLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5zdWJCaW5kaW5nc1tiaW5kQXJnXSA9IHRoaXMuc3ViQmluZGluZ3NbYmluZEFyZ10gfHwgW107XG4gICAgICAgIHRoaXMub25SZW1vdmUodGhpcy5hcmdzLmJpbmRUbyh0b3AsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3aGlsZSAoX3RoaXM4LnN1YkJpbmRpbmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgX3RoaXM4LnN1YkJpbmRpbmdzLnNoaWZ0KCkoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHVuc2FmZUh0bWwgPSBmYWxzZTtcblxuICAgICAgaWYgKHByb3BlcnR5LnN1YnN0cigwLCAxKSA9PT0gJyQnKSB7XG4gICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkuc3Vic3RyKDEpO1xuICAgICAgICB1bnNhZmVIdG1sID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRlYmluZCA9IHByb3h5LmJpbmRUbyhwcm9wZXJ0eSwgZnVuY3Rpb24gKHYsIGssIHQsIGQsIHApIHtcbiAgICAgICAgaWYgKChwIGluc3RhbmNlb2YgVmlldyB8fCBwIGluc3RhbmNlb2YgTm9kZSB8fCBwIGluc3RhbmNlb2YgX1RhZy5UYWcpICYmIHAgIT09IHYpIHtcbiAgICAgICAgICBwLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGF1dG9DaGFuZ2VkRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2N2QXV0b0NoYW5nZWQnLCB7XG4gICAgICAgICAgYnViYmxlczogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXS5pbmNsdWRlcyh0YWcudGFnTmFtZSkpIHtcbiAgICAgICAgICB2YXIgX3R5cGUgPSB0YWcuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG5cbiAgICAgICAgICBpZiAoX3R5cGUgJiYgX3R5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgdGFnLmNoZWNrZWQgPSAhIXY7XG4gICAgICAgICAgICB0YWcuZGlzcGF0Y2hFdmVudChhdXRvQ2hhbmdlZEV2ZW50KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKF90eXBlICYmIF90eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdyYWRpbycpIHtcbiAgICAgICAgICAgIHRhZy5jaGVja2VkID0gdiA9PSB0YWcudmFsdWU7XG4gICAgICAgICAgICB0YWcuZGlzcGF0Y2hFdmVudChhdXRvQ2hhbmdlZEV2ZW50KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKF90eXBlICE9PSAnZmlsZScpIHtcbiAgICAgICAgICAgIGlmICh0YWcudGFnTmFtZSA9PT0gJ1NFTEVDVCcpIHtcbiAgICAgICAgICAgICAgdmFyIHNlbGVjdE9wdGlvbiA9IGZ1bmN0aW9uIHNlbGVjdE9wdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uID0gdGFnLm9wdGlvbnNbaV07XG5cbiAgICAgICAgICAgICAgICAgIGlmIChvcHRpb24udmFsdWUgPT0gdikge1xuICAgICAgICAgICAgICAgICAgICB0YWcuc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIHNlbGVjdE9wdGlvbigpO1xuXG4gICAgICAgICAgICAgIF90aGlzOC5ub2Rlc0F0dGFjaGVkLmFkZChzZWxlY3RPcHRpb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFnLnZhbHVlID0gdiA9PSBudWxsID8gJycgOiB2O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWcuZGlzcGF0Y2hFdmVudChhdXRvQ2hhbmdlZEV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICAgICAgICB2YXIgX2l0ZXJhdG9yNyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRhZy5jaGlsZE5vZGVzKSxcbiAgICAgICAgICAgICAgICBfc3RlcDc7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yNy5zKCk7ICEoX3N0ZXA3ID0gX2l0ZXJhdG9yNy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBfc3RlcDcudmFsdWU7XG4gICAgICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgIF9pdGVyYXRvcjcuZShlcnIpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgX2l0ZXJhdG9yNy5mKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvbkF0dGFjaCA9IGZ1bmN0aW9uIG9uQXR0YWNoKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgdi5kaXNwYXRjaERvbUF0dGFjaGVkKF90aGlzOCk7IC8vIGlmKHYubm9kZXMubGVuZ3RoICYmIHYuZGlzcGF0Y2hBdHRhY2goKSlcbiAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAvLyBcdHYuYXR0YWNoZWQocGFyZW50Tm9kZS5nZXRSb290Tm9kZSgpLCBwYXJlbnROb2RlLCB0aGlzKTtcbiAgICAgICAgICAgICAgLy8gXHR2LmRpc3BhdGNoQXR0YWNoZWQocGFyZW50Tm9kZS5nZXRSb290Tm9kZSgpLCBwYXJlbnROb2RlLCB0aGlzKTtcbiAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX3RoaXM4Lm5vZGVzQXR0YWNoZWQuYWRkKG9uQXR0YWNoKTtcblxuICAgICAgICAgICAgdi5yZW5kZXIodGFnKTtcbiAgICAgICAgICAgIHYub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXM4Lm5vZGVzQXR0YWNoZWQucmVtb3ZlKG9uQXR0YWNoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgIHRhZy5pbnNlcnQodik7XG4gICAgICAgICAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgX1RhZy5UYWcpIHtcbiAgICAgICAgICAgIHRhZy5hcHBlbmQodi5ub2RlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHVuc2FmZUh0bWwpIHtcbiAgICAgICAgICAgIGlmICh0YWcuaW5uZXJIVE1MICE9PSB2KSB7XG4gICAgICAgICAgICAgIHYgPSBTdHJpbmcodik7XG5cbiAgICAgICAgICAgICAgaWYgKHRhZy5pbm5lckhUTUwgPT09IHYuc3Vic3RyaW5nKDAsIHRhZy5pbm5lckhUTUwubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIHRhZy5pbm5lckhUTUwgKz0gdi5zdWJzdHJpbmcodGFnLmlubmVySFRNTC5sZW5ndGgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBfaXRlcmF0b3I4ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGFnLmNoaWxkTm9kZXMpLFxuICAgICAgICAgICAgICAgICAgICBfc3RlcDg7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgZm9yIChfaXRlcmF0b3I4LnMoKTsgIShfc3RlcDggPSBfaXRlcmF0b3I4Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9ub2RlID0gX3N0ZXA4LnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIF9ub2RlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yOC5lKGVycik7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgIF9pdGVyYXRvcjguZigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRhZy5pbm5lckhUTUwgPSB2O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgX0RvbS5Eb20ubWFwVGFncyh0YWcsIGZhbHNlLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0W2RvbnRQYXJzZV0gPSB0cnVlO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRhZy50ZXh0Q29udGVudCAhPT0gdikge1xuICAgICAgICAgICAgICB2YXIgX2l0ZXJhdG9yOSA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRhZy5jaGlsZE5vZGVzKSxcbiAgICAgICAgICAgICAgICAgIF9zdGVwOTtcblxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yOS5zKCk7ICEoX3N0ZXA5ID0gX2l0ZXJhdG9yOS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgICAgICB2YXIgX25vZGUyID0gX3N0ZXA5LnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICBfbm9kZTIucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3I5LmUoZXJyKTtcbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3I5LmYoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHRhZy50ZXh0Q29udGVudCA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHByb3h5ICE9PSB0aGlzLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5zdWJCaW5kaW5nc1tiaW5kQXJnXS5wdXNoKGRlYmluZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub25SZW1vdmUoZGViaW5kKTtcbiAgICAgIHZhciB0eXBlID0gdGFnLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgICAgdmFyIG11bHRpID0gdGFnLmdldEF0dHJpYnV0ZSgnbXVsdGlwbGUnKTtcblxuICAgICAgdmFyIGlucHV0TGlzdGVuZXIgPSBmdW5jdGlvbiBpbnB1dExpc3RlbmVyKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQgIT09IHRhZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlICYmIHR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIGlmICh0YWcuY2hlY2tlZCkge1xuICAgICAgICAgICAgcHJveHlbcHJvcGVydHldID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJveHlbcHJvcGVydHldID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5tYXRjaGVzKCdbY29udGVudGVkaXRhYmxlPXRydWVdJykpIHtcbiAgICAgICAgICBwcm94eVtwcm9wZXJ0eV0gPSBldmVudC50YXJnZXQuaW5uZXJIVE1MO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmaWxlJyAmJiBtdWx0aSkge1xuICAgICAgICAgIHZhciBmaWxlcyA9IEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LmZpbGVzKTtcblxuICAgICAgICAgIHZhciBjdXJyZW50ID0gcHJveHlbcHJvcGVydHldIHx8IF9CaW5kYWJsZS5CaW5kYWJsZS5vbkRlY2socHJveHksIHByb3BlcnR5KTtcblxuICAgICAgICAgIGlmICghY3VycmVudCB8fCAhZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwcm94eVtwcm9wZXJ0eV0gPSBmaWxlcztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIF9sb29wNiA9IGZ1bmN0aW9uIF9sb29wNihpKSB7XG4gICAgICAgICAgICAgIGlmIChmaWxlc1tpXSAhPT0gY3VycmVudFtpXSkge1xuICAgICAgICAgICAgICAgIGZpbGVzW2ldLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVbaV0ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogZmlsZVtpXS5zaXplLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaWxlW2ldLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGZpbGVbaV0ubGFzdE1vZGlmaWVkXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50W2ldID0gZmlsZXNbaV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiYnJlYWtcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBmaWxlcykge1xuICAgICAgICAgICAgICB2YXIgX3JldDQgPSBfbG9vcDYoaSk7XG5cbiAgICAgICAgICAgICAgaWYgKF9yZXQ0ID09PSBcImJyZWFrXCIpIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZmlsZScgJiYgIW11bHRpICYmIGV2ZW50LnRhcmdldC5maWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgX2ZpbGUgPSBldmVudC50YXJnZXQuZmlsZXMuaXRlbSgwKTtcblxuICAgICAgICAgIF9maWxlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIG5hbWU6IF9maWxlLm5hbWUsXG4gICAgICAgICAgICAgIHNpemU6IF9maWxlLnNpemUsXG4gICAgICAgICAgICAgIHR5cGU6IF9maWxlLnR5cGUsXG4gICAgICAgICAgICAgIGRhdGU6IF9maWxlLmxhc3RNb2RpZmllZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcHJveHlbcHJvcGVydHldID0gX2ZpbGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJveHlbcHJvcGVydHldID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAodHlwZSA9PT0gJ2ZpbGUnIHx8IHR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgdGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGlucHV0TGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaW5wdXRMaXN0ZW5lcik7XG4gICAgICAgIHRhZy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBpbnB1dExpc3RlbmVyKTtcbiAgICAgICAgdGFnLmFkZEV2ZW50TGlzdGVuZXIoJ3ZhbHVlLWNoYW5nZWQnLCBpbnB1dExpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0eXBlID09PSAnZmlsZScgfHwgdHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICAgIHRhZy5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBpbnB1dExpc3RlbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBpbnB1dExpc3RlbmVyKTtcbiAgICAgICAgICB0YWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaW5wdXRMaXN0ZW5lcik7XG4gICAgICAgICAgdGFnLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3ZhbHVlLWNoYW5nZWQnLCBpbnB1dExpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi1iaW5kJyk7XG4gICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBPblRhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXBPblRhZyh0YWcpIHtcbiAgICAgIHZhciBfdGhpczkgPSB0aGlzO1xuXG4gICAgICB2YXIgcmVmZXJlbnRzID0gU3RyaW5nKHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LW9uJykpO1xuICAgICAgcmVmZXJlbnRzLnNwbGl0KCc7JykubWFwKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBhLnNwbGl0KCc6Jyk7XG4gICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIGEgPSBhLm1hcChmdW5jdGlvbiAoYSkge1xuICAgICAgICAgIHJldHVybiBhLnRyaW0oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBhcmdMZW4gPSBhLmxlbmd0aDtcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IFN0cmluZyhhLnNoaWZ0KCkpLnRyaW0oKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrTmFtZSA9IFN0cmluZyhhLnNoaWZ0KCkgfHwgZXZlbnROYW1lKS50cmltKCk7XG4gICAgICAgIHZhciBldmVudEZsYWdzID0gU3RyaW5nKGEuc2hpZnQoKSB8fCAnJykudHJpbSgpO1xuICAgICAgICB2YXIgYXJnTGlzdCA9IFtdO1xuICAgICAgICB2YXIgZ3JvdXBzID0gLyhcXHcrKSg/OlxcKChbJFxcd1xccy0nXCIsXSspXFwpKT8vLmV4ZWMoY2FsbGJhY2tOYW1lKTtcblxuICAgICAgICBpZiAoZ3JvdXBzKSB7XG4gICAgICAgICAgY2FsbGJhY2tOYW1lID0gZ3JvdXBzWzFdLnJlcGxhY2UoLyheW1xcc1xcbl0rfFtcXHNcXG5dKyQpLywgJycpO1xuXG4gICAgICAgICAgaWYgKGdyb3Vwc1syXSkge1xuICAgICAgICAgICAgYXJnTGlzdCA9IGdyb3Vwc1syXS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgICByZXR1cm4gcy50cmltKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWFyZ0xpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgYXJnTGlzdC5wdXNoKCckZXZlbnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXZlbnROYW1lIHx8IGFyZ0xlbiA9PT0gMSkge1xuICAgICAgICAgIGV2ZW50TmFtZSA9IGNhbGxiYWNrTmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBldmVudE1ldGhvZDtcbiAgICAgICAgdmFyIHBhcmVudCA9IF90aGlzOTtcblxuICAgICAgICB2YXIgX2xvb3A3ID0gZnVuY3Rpb24gX2xvb3A3KCkge1xuICAgICAgICAgIHZhciBjb250cm9sbGVyID0gcGFyZW50LmNvbnRyb2xsZXI7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNvbnRyb2xsZXJbY2FsbGJhY2tOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZXZlbnRNZXRob2QgPSBmdW5jdGlvbiBldmVudE1ldGhvZCgpIHtcbiAgICAgICAgICAgICAgY29udHJvbGxlcltjYWxsYmFja05hbWVdLmFwcGx5KGNvbnRyb2xsZXIsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gXCJicmVha1wiO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmVudFtjYWxsYmFja05hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBldmVudE1ldGhvZCA9IGZ1bmN0aW9uIGV2ZW50TWV0aG9kKCkge1xuICAgICAgICAgICAgICB2YXIgX3BhcmVudDtcblxuICAgICAgICAgICAgICAoX3BhcmVudCA9IHBhcmVudClbY2FsbGJhY2tOYW1lXS5hcHBseShfcGFyZW50LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIFwiYnJlYWtcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGFyZW50LnBhcmVudCkge1xuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiYnJlYWtcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICAgIHZhciBfcmV0NSA9IF9sb29wNygpO1xuXG4gICAgICAgICAgaWYgKF9yZXQ1ID09PSBcImJyZWFrXCIpIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiBldmVudExpc3RlbmVyKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIGFyZ1JlZnMgPSBhcmdMaXN0Lm1hcChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgICAgIGlmIChOdW1iZXIoYXJnKSA9PSBhcmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnID09PSAnZXZlbnQnIHx8IGFyZyA9PT0gJyRldmVudCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgPT09ICckdmlldycpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnID09PSAnJGNvbnRyb2xsZXInKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb250cm9sbGVyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgPT09ICckdGFnJykge1xuICAgICAgICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgPT09ICckcGFyZW50Jykge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXM5LnBhcmVudDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnID09PSAnJHN1YnZpZXcnKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpczk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyBpbiBfdGhpczkuYXJncykge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXM5LmFyZ3NbYXJnXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPSAvXlsnXCJdKFtcXHctXSs/KVtcIiddJC8uZXhlYyhhcmcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmICghKHR5cGVvZiBldmVudE1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlwiLmNvbmNhdChjYWxsYmFja05hbWUsIFwiIGlzIG5vdCBkZWZpbmVkIG9uIFZpZXcgb2JqZWN0LlwiKSArIFwiXFxuXCIgKyBcIlRhZzpcIiArIFwiXFxuXCIgKyBcIlwiLmNvbmNhdCh0YWcub3V0ZXJIVE1MKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZXZlbnRNZXRob2QuYXBwbHkodm9pZCAwLCBfdG9Db25zdW1hYmxlQXJyYXkoYXJnUmVmcykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBldmVudE9wdGlvbnMgPSB7fTtcblxuICAgICAgICBpZiAoZXZlbnRGbGFncy5pbmNsdWRlcygncCcpKSB7XG4gICAgICAgICAgZXZlbnRPcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50RmxhZ3MuaW5jbHVkZXMoJ1AnKSkge1xuICAgICAgICAgIGV2ZW50T3B0aW9ucy5wYXNzaXZlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnRGbGFncy5pbmNsdWRlcygnYycpKSB7XG4gICAgICAgICAgZXZlbnRPcHRpb25zLmNhcHR1cmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50RmxhZ3MuaW5jbHVkZXMoJ0MnKSkge1xuICAgICAgICAgIGV2ZW50T3B0aW9ucy5jYXB0dXJlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnRGbGFncy5pbmNsdWRlcygnbycpKSB7XG4gICAgICAgICAgZXZlbnRPcHRpb25zLm9uY2UgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50RmxhZ3MuaW5jbHVkZXMoJ08nKSkge1xuICAgICAgICAgIGV2ZW50T3B0aW9ucy5vbmNlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xuICAgICAgICAgIGNhc2UgJ19pbml0JzpcbiAgICAgICAgICAgIGV2ZW50TGlzdGVuZXIoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnX2F0dGFjaCc6XG4gICAgICAgICAgICBfdGhpczkubm9kZXNBdHRhY2hlZC5hZGQoZXZlbnRMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnX2RldGFjaCc6XG4gICAgICAgICAgICBfdGhpczkubm9kZXNEZXRhY2hlZC5hZGQoZXZlbnRMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRhZy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRMaXN0ZW5lciwgZXZlbnRPcHRpb25zKTtcblxuICAgICAgICAgICAgX3RoaXM5Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGFnLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBldmVudExpc3RlbmVyLCBldmVudE9wdGlvbnMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtldmVudE5hbWUsIGNhbGxiYWNrTmFtZSwgYXJnTGlzdF07XG4gICAgICB9KTtcbiAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LW9uJyk7XG4gICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBMaW5rVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcExpbmtUYWcodGFnKSB7XG4gICAgICAvKi9cbiAgICAgIGNvbnN0IHRhZ0NvbXBpbGVyID0gdGhpcy5jb21waWxlTGlua1RhZyh0YWcpO1xuICAgICAgXHRjb25zdCBuZXdUYWcgPSB0YWdDb21waWxlcih0aGlzKTtcbiAgICAgIFx0dGFnLnJlcGxhY2VXaXRoKG5ld1RhZyk7XG4gICAgICBcdHJldHVybiBuZXdUYWc7XG4gICAgICAvKi9cbiAgICAgIHZhciBsaW5rQXR0ciA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LWxpbmsnKTtcbiAgICAgIHRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBsaW5rQXR0cik7XG5cbiAgICAgIHZhciBsaW5rQ2xpY2sgPSBmdW5jdGlvbiBsaW5rQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAobGlua0F0dHIuc3Vic3RyaW5nKDAsIDQpID09PSAnaHR0cCcgfHwgbGlua0F0dHIuc3Vic3RyaW5nKDAsIDIpID09PSAnLy8nKSB7XG4gICAgICAgICAgd2luZG93Lm9wZW4odGFnLmdldEF0dHJpYnV0ZSgnaHJlZicsIGxpbmtBdHRyKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX1JvdXRlci5Sb3V0ZXIuZ28odGFnLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcbiAgICAgIH07XG5cbiAgICAgIHRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxpbmtDbGljayk7XG4gICAgICB0aGlzLm9uUmVtb3ZlKGZ1bmN0aW9uICh0YWcsIGV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0YWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudExpc3RlbmVyKTtcbiAgICAgICAgICB0YWcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZXZlbnRMaXN0ZW5lciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfTtcbiAgICAgIH0odGFnLCBsaW5rQ2xpY2spKTtcbiAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LWxpbmsnKTtcbiAgICAgIHJldHVybiB0YWc7IC8vKi9cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29tcGlsZUxpbmtUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGlsZUxpbmtUYWcoc291cmNlVGFnKSB7XG4gICAgICB2YXIgbGlua0F0dHIgPSBzb3VyY2VUYWcuZ2V0QXR0cmlidXRlKCdjdi1saW5rJyk7XG4gICAgICBzb3VyY2VUYWcucmVtb3ZlQXR0cmlidXRlKCdjdi1saW5rJyk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGJpbmRpbmdWaWV3KSB7XG4gICAgICAgIHZhciB0YWcgPSBzb3VyY2VUYWcuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICB0YWcuc2V0QXR0cmlidXRlKCdocmVmJywgbGlua0F0dHIpO1xuICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwUHJlbmRlcmVyVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcFByZW5kZXJlclRhZyh0YWcpIHtcbiAgICAgIHZhciBwcmVyZW5kZXJBdHRyID0gdGFnLmdldEF0dHJpYnV0ZSgnY3YtcHJlcmVuZGVyJyk7XG4gICAgICB2YXIgcHJlcmVuZGVyaW5nID0gd2luZG93LnByZXJlbmRlcmVyIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL3ByZXJlbmRlci9pKTtcblxuICAgICAgaWYgKHByZXJlbmRlcmluZykge1xuICAgICAgICB3aW5kb3cucHJlcmVuZGVyZXIgPSB3aW5kb3cucHJlcmVuZGVyZXIgfHwgdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXJlbmRlckF0dHIgPT09ICduZXZlcicgJiYgcHJlcmVuZGVyaW5nIHx8IHByZXJlbmRlckF0dHIgPT09ICdvbmx5JyAmJiAhcHJlcmVuZGVyaW5nKSB7XG4gICAgICAgIHRhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhZyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YWc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcFdpdGhUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFwV2l0aFRhZyh0YWcpIHtcbiAgICAgIHZhciBfdGhpczEwID0gdGhpcztcblxuICAgICAgdmFyIHdpdGhBdHRyID0gdGFnLmdldEF0dHJpYnV0ZSgnY3Ytd2l0aCcpO1xuICAgICAgdmFyIGNhcnJ5QXR0ciA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LWNhcnJ5Jyk7XG4gICAgICB2YXIgdmlld0F0dHIgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi12aWV3Jyk7XG4gICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi13aXRoJyk7XG4gICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi1jYXJyeScpO1xuICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtdmlldycpO1xuICAgICAgdmFyIHZpZXdDbGFzcyA9IHZpZXdBdHRyID8gdGhpcy5zdHJpbmdUb0NsYXNzKHZpZXdBdHRyKSA6IFZpZXc7XG4gICAgICB2YXIgc3ViVGVtcGxhdGUgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICBfdG9Db25zdW1hYmxlQXJyYXkodGFnLmNoaWxkTm9kZXMpLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIHN1YlRlbXBsYXRlLmFwcGVuZENoaWxkKG4pO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjYXJyeVByb3BzID0gW107XG5cbiAgICAgIGlmIChjYXJyeUF0dHIpIHtcbiAgICAgICAgY2FycnlQcm9wcyA9IGNhcnJ5QXR0ci5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgICAgIHJldHVybiBzLnRyaW0oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBkZWJpbmQgPSB0aGlzLmFyZ3MuYmluZFRvKHdpdGhBdHRyLCBmdW5jdGlvbiAodiwgaywgdCwgZCkge1xuICAgICAgICBpZiAoX3RoaXMxMC53aXRoVmlld3MuaGFzKHRhZykpIHtcbiAgICAgICAgICBfdGhpczEwLndpdGhWaWV3c1tcImRlbGV0ZVwiXSh0YWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKHRhZy5maXJzdENoaWxkKSB7XG4gICAgICAgICAgdGFnLnJlbW92ZUNoaWxkKHRhZy5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2aWV3ID0gbmV3IHZpZXdDbGFzcyh7fSwgX3RoaXMxMCk7XG5cbiAgICAgICAgX3RoaXMxMC5vblJlbW92ZShmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2aWV3LnJlbW92ZSgpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0odmlldykpO1xuXG4gICAgICAgIHZpZXcudGVtcGxhdGUgPSBzdWJUZW1wbGF0ZTtcblxuICAgICAgICB2YXIgX2xvb3A4ID0gZnVuY3Rpb24gX2xvb3A4KGkpIHtcbiAgICAgICAgICB2YXIgZGViaW5kID0gX3RoaXMxMC5hcmdzLmJpbmRUbyhjYXJyeVByb3BzW2ldLCBmdW5jdGlvbiAodiwgaykge1xuICAgICAgICAgICAgdmlldy5hcmdzW2tdID0gdjtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZpZXcub25SZW1vdmUoZGViaW5kKTtcblxuICAgICAgICAgIF90aGlzMTAub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGViaW5kKCk7XG4gICAgICAgICAgICB2aWV3LnJlbW92ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gY2FycnlQcm9wcykge1xuICAgICAgICAgIF9sb29wOChpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfbG9vcDkgPSBmdW5jdGlvbiBfbG9vcDkoX2k1KSB7XG4gICAgICAgICAgaWYgKF90eXBlb2YodikgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHYgPSBfQmluZGFibGUuQmluZGFibGUubWFrZSh2KTtcbiAgICAgICAgICB2YXIgZGViaW5kID0gdi5iaW5kVG8oX2k1LCBmdW5jdGlvbiAodnYsIGtrLCB0dCwgZGQpIHtcbiAgICAgICAgICAgIGlmICghZGQpIHtcbiAgICAgICAgICAgICAgdmlldy5hcmdzW2trXSA9IHZ2O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrayBpbiB2aWV3LmFyZ3MpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIHZpZXcuYXJnc1tra107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFyIGRlYmluZFVwID0gdmlldy5hcmdzLmJpbmRUbyhfaTUsIGZ1bmN0aW9uICh2diwga2ssIHR0LCBkZCkge1xuICAgICAgICAgICAgaWYgKCFkZCkge1xuICAgICAgICAgICAgICB2W2trXSA9IHZ2O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrayBpbiB2KSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSB2W2trXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIF90aGlzMTAub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGViaW5kKCk7XG5cbiAgICAgICAgICAgIGlmICghdi5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgX0JpbmRhYmxlLkJpbmRhYmxlLmNsZWFyQmluZGluZ3Modik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2aWV3Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlYmluZCgpO1xuXG4gICAgICAgICAgICBpZiAoIXYuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICAgIF9CaW5kYWJsZS5CaW5kYWJsZS5jbGVhckJpbmRpbmdzKHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAodmFyIF9pNSBpbiB2KSB7XG4gICAgICAgICAgdmFyIF9yZXQ2ID0gX2xvb3A5KF9pNSk7XG5cbiAgICAgICAgICBpZiAoX3JldDYgPT09IFwiY29udGludWVcIikgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2aWV3LnJlbmRlcih0YWcpO1xuXG4gICAgICAgIF90aGlzMTAud2l0aFZpZXdzLnNldCh0YWcsIHZpZXcpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMxMC53aXRoVmlld3NbXCJkZWxldGVcIl0odGFnKTtcblxuICAgICAgICBkZWJpbmQoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRhZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwVmlld1RhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXBWaWV3VGFnKHRhZykge1xuICAgICAgdmFyIF90aGlzMTEgPSB0aGlzO1xuXG4gICAgICB2YXIgdmlld0F0dHIgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi12aWV3Jyk7XG4gICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi12aWV3Jyk7XG4gICAgICB2YXIgc3ViVGVtcGxhdGUgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICBfdG9Db25zdW1hYmxlQXJyYXkodGFnLmNoaWxkTm9kZXMpLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIHN1YlRlbXBsYXRlLmFwcGVuZENoaWxkKG4pO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBwYXJ0cyA9IHZpZXdBdHRyLnNwbGl0KCc6Jyk7XG4gICAgICB2YXIgdmlld0NsYXNzID0gcGFydHMucG9wKCkgPyB0aGlzLnN0cmluZ1RvQ2xhc3Modmlld0F0dHIpIDogVmlldztcbiAgICAgIHZhciB2aWV3TmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICB2YXIgdmlldyA9IG5ldyB2aWV3Q2xhc3ModGhpcy5hcmdzLCB0aGlzKTtcbiAgICAgIHRoaXMudmlld3Muc2V0KHRhZywgdmlldyk7XG5cbiAgICAgIGlmICh2aWV3TmFtZSkge1xuICAgICAgICB0aGlzLnZpZXdzLnNldCh2aWV3TmFtZSwgdmlldyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub25SZW1vdmUoZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2aWV3LnJlbW92ZSgpO1xuXG4gICAgICAgICAgX3RoaXMxMS52aWV3c1tcImRlbGV0ZVwiXSh0YWcpO1xuXG4gICAgICAgICAgX3RoaXMxMS52aWV3c1tcImRlbGV0ZVwiXSh2aWV3TmFtZSk7XG4gICAgICAgIH07XG4gICAgICB9KHZpZXcpKTtcbiAgICAgIHZpZXcudGVtcGxhdGUgPSBzdWJUZW1wbGF0ZTtcbiAgICAgIHZpZXcucmVuZGVyKHRhZyk7XG4gICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXBFYWNoVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcEVhY2hUYWcodGFnKSB7XG4gICAgICB2YXIgX3RoaXMxMiA9IHRoaXM7XG5cbiAgICAgIHZhciBlYWNoQXR0ciA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LWVhY2gnKTtcbiAgICAgIHZhciB2aWV3QXR0ciA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LXZpZXcnKTtcbiAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LWVhY2gnKTtcbiAgICAgIHRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LXZpZXcnKTtcbiAgICAgIHZhciB2aWV3Q2xhc3MgPSB2aWV3QXR0ciA/IHRoaXMuc3RyaW5nVG9DbGFzcyh2aWV3QXR0cikgOiBWaWV3O1xuICAgICAgdmFyIHN1YlRlbXBsYXRlID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgX3RvQ29uc3VtYWJsZUFycmF5KHRhZy5jaGlsZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBzdWJUZW1wbGF0ZS5hcHBlbmRDaGlsZChuKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgX2VhY2hBdHRyJHNwbGl0ID0gZWFjaEF0dHIuc3BsaXQoJzonKSxcbiAgICAgICAgICBfZWFjaEF0dHIkc3BsaXQyID0gX3NsaWNlZFRvQXJyYXkoX2VhY2hBdHRyJHNwbGl0LCAzKSxcbiAgICAgICAgICBlYWNoUHJvcCA9IF9lYWNoQXR0ciRzcGxpdDJbMF0sXG4gICAgICAgICAgYXNQcm9wID0gX2VhY2hBdHRyJHNwbGl0MlsxXSxcbiAgICAgICAgICBrZXlQcm9wID0gX2VhY2hBdHRyJHNwbGl0MlsyXTtcblxuICAgICAgdmFyIGRlYmluZCA9IHRoaXMuYXJncy5iaW5kVG8oZWFjaFByb3AsIGZ1bmN0aW9uICh2LCBrLCB0LCBkLCBwKSB7XG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgX0JhZy5CYWcpIHtcbiAgICAgICAgICB2ID0gdi5saXN0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF90aGlzMTIudmlld0xpc3RzLmhhcyh0YWcpKSB7XG4gICAgICAgICAgX3RoaXMxMi52aWV3TGlzdHMuZ2V0KHRhZykucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmlld0xpc3QgPSBuZXcgX1ZpZXdMaXN0LlZpZXdMaXN0KHN1YlRlbXBsYXRlLCBhc1Byb3AsIHYsIF90aGlzMTIsIGtleVByb3AsIHZpZXdDbGFzcyk7XG5cbiAgICAgICAgdmFyIHZpZXdMaXN0UmVtb3ZlciA9IGZ1bmN0aW9uIHZpZXdMaXN0UmVtb3ZlcigpIHtcbiAgICAgICAgICByZXR1cm4gdmlld0xpc3QucmVtb3ZlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgX3RoaXMxMi5vblJlbW92ZSh2aWV3TGlzdFJlbW92ZXIpO1xuXG4gICAgICAgIHZpZXdMaXN0Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMxMi5fb25SZW1vdmUucmVtb3ZlKHZpZXdMaXN0UmVtb3Zlcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBkZWJpbmRBID0gX3RoaXMxMi5hcmdzLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCwgZCkge1xuICAgICAgICAgIGlmIChrID09PSAnX2lkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZCkge1xuICAgICAgICAgICAgdmlld0xpc3Quc3ViQXJnc1trXSA9IHY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChrIGluIHZpZXdMaXN0LnN1YkFyZ3MpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIHZpZXdMaXN0LnN1YkFyZ3Nba107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZGViaW5kQiA9IHZpZXdMaXN0LmFyZ3MuYmluZFRvKGZ1bmN0aW9uICh2LCBrLCB0LCBkLCBwKSB7XG4gICAgICAgICAgaWYgKGsgPT09ICdfaWQnIHx8IGsgPT09ICd2YWx1ZScgfHwgU3RyaW5nKGspLnN1YnN0cmluZygwLCAzKSA9PT0gJ19fXycpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWQpIHtcbiAgICAgICAgICAgIGlmIChrIGluIF90aGlzMTIuYXJncykge1xuICAgICAgICAgICAgICBfdGhpczEyLmFyZ3Nba10gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgX3RoaXMxMi5hcmdzW2tdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZpZXdMaXN0Lm9uUmVtb3ZlKGRlYmluZEEpO1xuICAgICAgICB2aWV3TGlzdC5vblJlbW92ZShkZWJpbmRCKTtcblxuICAgICAgICBfdGhpczEyLm9uUmVtb3ZlKGRlYmluZEEpO1xuXG4gICAgICAgIF90aGlzMTIub25SZW1vdmUoZGViaW5kQik7XG5cbiAgICAgICAgd2hpbGUgKHRhZy5maXJzdENoaWxkKSB7XG4gICAgICAgICAgdGFnLnJlbW92ZUNoaWxkKHRhZy5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMTIudmlld0xpc3RzLnNldCh0YWcsIHZpZXdMaXN0KTtcblxuICAgICAgICB2aWV3TGlzdC5yZW5kZXIodGFnKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5vblJlbW92ZShkZWJpbmQpO1xuICAgICAgcmV0dXJuIHRhZztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWFwSWZUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFwSWZUYWcodGFnKSB7XG4gICAgICB2YXIgX3RoaXMxMyA9IHRoaXM7XG5cbiAgICAgIHZhciBzb3VyY2VUYWcgPSB0YWc7XG4gICAgICB2YXIgdmlld1Byb3BlcnR5ID0gc291cmNlVGFnLmdldEF0dHJpYnV0ZSgnY3YtdmlldycpO1xuICAgICAgdmFyIGlmUHJvcGVydHkgPSBzb3VyY2VUYWcuZ2V0QXR0cmlidXRlKCdjdi1pZicpO1xuICAgICAgdmFyIGlzUHJvcGVydHkgPSBzb3VyY2VUYWcuZ2V0QXR0cmlidXRlKCdjdi1pcycpO1xuICAgICAgdmFyIGludmVydGVkID0gZmFsc2U7XG4gICAgICB2YXIgZGVmaW5lZCA9IGZhbHNlO1xuICAgICAgc291cmNlVGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtdmlldycpO1xuICAgICAgc291cmNlVGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3YtaWYnKTtcbiAgICAgIHNvdXJjZVRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LWlzJyk7XG4gICAgICB2YXIgdmlld0NsYXNzID0gdmlld1Byb3BlcnR5ID8gdGhpcy5zdHJpbmdUb0NsYXNzKHZpZXdQcm9wZXJ0eSkgOiBWaWV3O1xuXG4gICAgICBpZiAoaWZQcm9wZXJ0eS5zdWJzdHIoMCwgMSkgPT09ICchJykge1xuICAgICAgICBpZlByb3BlcnR5ID0gaWZQcm9wZXJ0eS5zdWJzdHIoMSk7XG4gICAgICAgIGludmVydGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlmUHJvcGVydHkuc3Vic3RyKDAsIDEpID09PSAnPycpIHtcbiAgICAgICAgaWZQcm9wZXJ0eSA9IGlmUHJvcGVydHkuc3Vic3RyKDEpO1xuICAgICAgICBkZWZpbmVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN1YlRlbXBsYXRlID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgX3RvQ29uc3VtYWJsZUFycmF5KHNvdXJjZVRhZy5jaGlsZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBzdWJUZW1wbGF0ZS5hcHBlbmRDaGlsZChuKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgYmluZGluZ1ZpZXcgPSB0aGlzO1xuICAgICAgdmFyIGlmRG9jID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIHZhciB2aWV3ID0gbmV3IHZpZXdDbGFzcyhPYmplY3QuYXNzaWduKHt9LCB0aGlzLmFyZ3MpLCBiaW5kaW5nVmlldyk7XG4gICAgICB0aGlzLm9uUmVtb3ZlKHZpZXcudGFncy5iaW5kVG8oZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgX3RoaXMxMy50YWdzW2tdID0gdjtcbiAgICAgIH0pKTtcbiAgICAgIHZpZXcudGVtcGxhdGUgPSBzdWJUZW1wbGF0ZTtcbiAgICAgIHZhciBwcm94eSA9IGJpbmRpbmdWaWV3LmFyZ3M7XG4gICAgICB2YXIgcHJvcGVydHkgPSBpZlByb3BlcnR5O1xuXG4gICAgICBpZiAoaWZQcm9wZXJ0eS5tYXRjaCgvXFwuLykpIHtcbiAgICAgICAgdmFyIF9CaW5kYWJsZSRyZXNvbHZlMTEgPSBfQmluZGFibGUuQmluZGFibGUucmVzb2x2ZShiaW5kaW5nVmlldy5hcmdzLCBpZlByb3BlcnR5LCB0cnVlKTtcblxuICAgICAgICB2YXIgX0JpbmRhYmxlJHJlc29sdmUxMiA9IF9zbGljZWRUb0FycmF5KF9CaW5kYWJsZSRyZXNvbHZlMTEsIDIpO1xuXG4gICAgICAgIHByb3h5ID0gX0JpbmRhYmxlJHJlc29sdmUxMlswXTtcbiAgICAgICAgcHJvcGVydHkgPSBfQmluZGFibGUkcmVzb2x2ZTEyWzFdO1xuICAgICAgfVxuXG4gICAgICB2aWV3LnJlbmRlcihpZkRvYyk7XG4gICAgICB2YXIgcHJvcGVydHlEZWJpbmQgPSBwcm94eS5iaW5kVG8ocHJvcGVydHksIGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgIHZhciBvID0gdjtcblxuICAgICAgICBpZiAoZGVmaW5lZCkge1xuICAgICAgICAgIHYgPSB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgX0JhZy5CYWcpIHtcbiAgICAgICAgICB2ID0gdi5saXN0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgICAgICB2ID0gISF2Lmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1Byb3BlcnR5ICE9PSBudWxsKSB7XG4gICAgICAgICAgdiA9IG8gPT0gaXNQcm9wZXJ0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnZlcnRlZCkge1xuICAgICAgICAgIHYgPSAhdjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgdGFnLmFwcGVuZENoaWxkKGlmRG9jKTtcblxuICAgICAgICAgIF90b0NvbnN1bWFibGVBcnJheShpZkRvYy5jaGlsZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gX0RvbS5Eb20ubWFwVGFncyhub2RlLCBmYWxzZSwgZnVuY3Rpb24gKHRhZywgd2Fsa2VyKSB7XG4gICAgICAgICAgICAgIGlmICghdGFnLm1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0YWcuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2N2RG9tQXR0YWNoZWQnLCB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB0YWcsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICB2aWV3OiB2aWV3IHx8IF90aGlzMTMsXG4gICAgICAgICAgICAgICAgICBtYWluVmlldzogX3RoaXMxM1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlldy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgICAgICByZXR1cm4gaWZEb2MuYXBwZW5kQ2hpbGQobik7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBfRG9tLkRvbS5tYXBUYWdzKGlmRG9jLCBmYWxzZSwgZnVuY3Rpb24gKHRhZywgd2Fsa2VyKSB7XG4gICAgICAgICAgICBpZiAoIXRhZy5tYXRjaGVzKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdjdkRvbURldGFjaGVkJywge1xuICAgICAgICAgICAgICB0YXJnZXQ6IHRhZyxcbiAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgdmlldzogdmlldyB8fCBfdGhpczEzLFxuICAgICAgICAgICAgICAgIG1haW5WaWV3OiBfdGhpczEzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGNoaWxkcmVuOiBBcnJheS5pc0FycmF5KHByb3h5W3Byb3BlcnR5XSlcbiAgICAgIH0pOyAvLyBjb25zdCBwcm9wZXJ0eURlYmluZCA9IHRoaXMuYXJncy5iaW5kQ2hhaW4ocHJvcGVydHksIG9uVXBkYXRlKTtcblxuICAgICAgYmluZGluZ1ZpZXcub25SZW1vdmUocHJvcGVydHlEZWJpbmQpO1xuICAgICAgdmFyIGRlYmluZEEgPSB0aGlzLmFyZ3MuYmluZFRvKGZ1bmN0aW9uICh2LCBrLCB0LCBkKSB7XG4gICAgICAgIGlmIChrID09PSAnX2lkJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZCkge1xuICAgICAgICAgIHZpZXcuYXJnc1trXSA9IHY7XG4gICAgICAgIH0gZWxzZSBpZiAoayBpbiB2aWV3LmFyZ3MpIHtcbiAgICAgICAgICBkZWxldGUgdmlldy5hcmdzW2tdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBkZWJpbmRCID0gdmlldy5hcmdzLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCwgZCwgcCkge1xuICAgICAgICBpZiAoayA9PT0gJ19pZCcgfHwgU3RyaW5nKGspLnN1YnN0cmluZygwLCAzKSA9PT0gJ19fXycpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoayBpbiBfdGhpczEzLmFyZ3MpIHtcbiAgICAgICAgICBpZiAoIWQpIHtcbiAgICAgICAgICAgIF90aGlzMTMuYXJnc1trXSA9IHY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBfdGhpczEzLmFyZ3Nba107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIHZpZXdEZWJpbmQgPSBmdW5jdGlvbiB2aWV3RGViaW5kKCkge1xuICAgICAgICBwcm9wZXJ0eURlYmluZCgpO1xuICAgICAgICBkZWJpbmRBKCk7XG4gICAgICAgIGRlYmluZEIoKTtcblxuICAgICAgICBiaW5kaW5nVmlldy5fb25SZW1vdmUucmVtb3ZlKHByb3BlcnR5RGViaW5kKTsgLy8gYmluZGluZ1ZpZXcuX29uUmVtb3ZlLnJlbW92ZShiaW5kYWJsZURlYmluZCk7XG5cbiAgICAgIH07XG5cbiAgICAgIGJpbmRpbmdWaWV3Lm9uUmVtb3ZlKHZpZXdEZWJpbmQpO1xuICAgICAgdGhpcy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlYmluZEEoKTtcbiAgICAgICAgZGViaW5kQigpO1xuICAgICAgICB2aWV3LnJlbW92ZSgpO1xuXG4gICAgICAgIGlmIChiaW5kaW5nVmlldyAhPT0gX3RoaXMxMykge1xuICAgICAgICAgIGJpbmRpbmdWaWV3LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0YWc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbXBpbGVJZlRhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21waWxlSWZUYWcoc291cmNlVGFnKSB7XG4gICAgICB2YXIgaWZQcm9wZXJ0eSA9IHNvdXJjZVRhZy5nZXRBdHRyaWJ1dGUoJ2N2LWlmJyk7XG4gICAgICB2YXIgaW52ZXJ0ZWQgPSBmYWxzZTtcbiAgICAgIHNvdXJjZVRhZy5yZW1vdmVBdHRyaWJ1dGUoJ2N2LWlmJyk7XG5cbiAgICAgIGlmIChpZlByb3BlcnR5LnN1YnN0cigwLCAxKSA9PT0gJyEnKSB7XG4gICAgICAgIGlmUHJvcGVydHkgPSBpZlByb3BlcnR5LnN1YnN0cigxKTtcbiAgICAgICAgaW52ZXJ0ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3ViVGVtcGxhdGUgPSBuZXcgRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICBfdG9Db25zdW1hYmxlQXJyYXkoc291cmNlVGFnLmNoaWxkTm9kZXMpLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIHN1YlRlbXBsYXRlLmFwcGVuZENoaWxkKG4uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGJpbmRpbmdWaWV3KSB7XG4gICAgICAgIHZhciB0YWcgPSBzb3VyY2VUYWcuY2xvbmVOb2RlKCk7XG4gICAgICAgIHZhciBpZkRvYyA9IG5ldyBEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIHZhciB2aWV3ID0gbmV3IFZpZXcoe30sIGJpbmRpbmdWaWV3KTtcbiAgICAgICAgdmlldy50ZW1wbGF0ZSA9IHN1YlRlbXBsYXRlOyAvLyB2aWV3LnBhcmVudCAgID0gYmluZGluZ1ZpZXc7XG5cbiAgICAgICAgYmluZGluZ1ZpZXcuc3luY0JpbmQodmlldyk7XG4gICAgICAgIHZhciBwcm94eSA9IGJpbmRpbmdWaWV3LmFyZ3M7XG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IGlmUHJvcGVydHk7XG5cbiAgICAgICAgaWYgKGlmUHJvcGVydHkubWF0Y2goL1xcLi8pKSB7XG4gICAgICAgICAgdmFyIF9CaW5kYWJsZSRyZXNvbHZlMTMgPSBfQmluZGFibGUuQmluZGFibGUucmVzb2x2ZShiaW5kaW5nVmlldy5hcmdzLCBpZlByb3BlcnR5LCB0cnVlKTtcblxuICAgICAgICAgIHZhciBfQmluZGFibGUkcmVzb2x2ZTE0ID0gX3NsaWNlZFRvQXJyYXkoX0JpbmRhYmxlJHJlc29sdmUxMywgMik7XG5cbiAgICAgICAgICBwcm94eSA9IF9CaW5kYWJsZSRyZXNvbHZlMTRbMF07XG4gICAgICAgICAgcHJvcGVydHkgPSBfQmluZGFibGUkcmVzb2x2ZTE0WzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhc1JlbmRlcmVkID0gZmFsc2U7XG4gICAgICAgIHZhciBwcm9wZXJ0eURlYmluZCA9IHByb3h5LmJpbmRUbyhwcm9wZXJ0eSwgZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgICBpZiAoIWhhc1JlbmRlcmVkKSB7XG4gICAgICAgICAgICB2YXIgcmVuZGVyRG9jID0gYmluZGluZ1ZpZXcuYXJnc1twcm9wZXJ0eV0gfHwgaW52ZXJ0ZWQgPyB0YWcgOiBpZkRvYztcbiAgICAgICAgICAgIHZpZXcucmVuZGVyKHJlbmRlckRvYyk7XG4gICAgICAgICAgICBoYXNSZW5kZXJlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgICAgICAgIHYgPSAhIXYubGVuZ3RoO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpbnZlcnRlZCkge1xuICAgICAgICAgICAgdiA9ICF2O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICB0YWcuYXBwZW5kQ2hpbGQoaWZEb2MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3Lm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGlmRG9jLmFwcGVuZENoaWxkKG4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTsgLy8gbGV0IGNsZWFuZXIgPSBiaW5kaW5nVmlldztcbiAgICAgICAgLy8gd2hpbGUoY2xlYW5lci5wYXJlbnQpXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gXHRjbGVhbmVyID0gY2xlYW5lci5wYXJlbnQ7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBiaW5kaW5nVmlldy5vblJlbW92ZShwcm9wZXJ0eURlYmluZCk7XG5cbiAgICAgICAgdmFyIGJpbmRhYmxlRGViaW5kID0gZnVuY3Rpb24gYmluZGFibGVEZWJpbmQoKSB7XG4gICAgICAgICAgaWYgKCFwcm94eS5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgIF9CaW5kYWJsZS5CaW5kYWJsZS5jbGVhckJpbmRpbmdzKHByb3h5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHZpZXdEZWJpbmQgPSBmdW5jdGlvbiB2aWV3RGViaW5kKCkge1xuICAgICAgICAgIHByb3BlcnR5RGViaW5kKCk7XG4gICAgICAgICAgYmluZGFibGVEZWJpbmQoKTtcblxuICAgICAgICAgIGJpbmRpbmdWaWV3Ll9vblJlbW92ZS5yZW1vdmUocHJvcGVydHlEZWJpbmQpO1xuXG4gICAgICAgICAgYmluZGluZ1ZpZXcuX29uUmVtb3ZlLnJlbW92ZShiaW5kYWJsZURlYmluZCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmlldy5vblJlbW92ZSh2aWV3RGViaW5kKTtcbiAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcFRlbXBsYXRlVGFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hcFRlbXBsYXRlVGFnKHRhZykge1xuICAgICAgdmFyIHRlbXBsYXRlTmFtZSA9IHRhZy5nZXRBdHRyaWJ1dGUoJ2N2LXRlbXBsYXRlJyk7XG4gICAgICB0YWcucmVtb3ZlQXR0cmlidXRlKCdjdi10ZW1wbGF0ZScpO1xuXG4gICAgICB0aGlzLnRlbXBsYXRlc1t0ZW1wbGF0ZU5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGFnLnRhZ05hbWUgPT09ICdURU1QTEFURScgPyB0YWcuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgOiBuZXcgRG9jdW1lbnRGcmFnbWVudCh0YWcuaW5uZXJIVE1MKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMucmVuZGVyZWQudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0YWcucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0YWc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcFNsb3RUYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWFwU2xvdFRhZyh0YWcpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZU5hbWUgPSB0YWcuZ2V0QXR0cmlidXRlKCdjdi1zbG90Jyk7XG4gICAgICB2YXIgZ2V0VGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlc1t0ZW1wbGF0ZU5hbWVdO1xuXG4gICAgICBpZiAoIWdldFRlbXBsYXRlKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuXG4gICAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgICBnZXRUZW1wbGF0ZSA9IHBhcmVudC50ZW1wbGF0ZXNbdGVtcGxhdGVOYW1lXTtcblxuICAgICAgICAgIGlmIChnZXRUZW1wbGF0ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWdldFRlbXBsYXRlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIlRlbXBsYXRlIFwiLmNvbmNhdCh0ZW1wbGF0ZU5hbWUsIFwiIG5vdCBmb3VuZC5cIikpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdGVtcGxhdGUgPSBnZXRUZW1wbGF0ZSgpO1xuICAgICAgdGFnLnJlbW92ZUF0dHJpYnV0ZSgnY3Ytc2xvdCcpO1xuXG4gICAgICB3aGlsZSAodGFnLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgdGFnLmZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIHRhZy5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG4gICAgICByZXR1cm4gdGFnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzeW5jQmluZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzeW5jQmluZChzdWJWaWV3KSB7XG4gICAgICB2YXIgX3RoaXMxNCA9IHRoaXM7XG5cbiAgICAgIHZhciBkZWJpbmRBID0gdGhpcy5hcmdzLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCwgZCkge1xuICAgICAgICBpZiAoayA9PT0gJ19pZCcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3ViVmlldy5hcmdzW2tdICE9PSB2KSB7XG4gICAgICAgICAgc3ViVmlldy5hcmdzW2tdID0gdjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgZGViaW5kQiA9IHN1YlZpZXcuYXJncy5iaW5kVG8oZnVuY3Rpb24gKHYsIGssIHQsIGQsIHApIHtcbiAgICAgICAgaWYgKGsgPT09ICdfaWQnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5ld1JlZiA9IHY7XG4gICAgICAgIHZhciBvbGRSZWYgPSBwO1xuXG4gICAgICAgIGlmIChuZXdSZWYgaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICAgICAgbmV3UmVmID0gbmV3UmVmLl9fX3JlZl9fXztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvbGRSZWYgaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICAgICAgb2xkUmVmID0gb2xkUmVmLl9fX3JlZl9fXztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdSZWYgIT09IG9sZFJlZiAmJiBvbGRSZWYgaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICAgICAgcC5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrIGluIF90aGlzMTQuYXJncykge1xuICAgICAgICAgIF90aGlzMTQuYXJnc1trXSA9IHY7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5vblJlbW92ZShkZWJpbmRBKTtcbiAgICAgIHRoaXMub25SZW1vdmUoZGViaW5kQik7XG4gICAgICBzdWJWaWV3Lm9uUmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMxNC5fb25SZW1vdmUucmVtb3ZlKGRlYmluZEEpO1xuXG4gICAgICAgIF90aGlzMTQuX29uUmVtb3ZlLnJlbW92ZShkZWJpbmRCKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwb3N0UmVuZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBvc3RSZW5kZXIocGFyZW50Tm9kZSkge31cbiAgfSwge1xuICAgIGtleTogXCJhdHRhY2hlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhdHRhY2hlZChwYXJlbnROb2RlKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImludGVycG9sYXRhYmxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGludGVycG9sYXRhYmxlKHN0cikge1xuICAgICAgcmV0dXJuICEhU3RyaW5nKHN0cikubWF0Y2godGhpcy5pbnRlcnBvbGF0ZVJlZ2V4KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHZhciBfdGhpczE1ID0gdGhpcztcblxuICAgICAgdmFyIG5vdyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZmFsc2U7XG5cbiAgICAgIHZhciByZW1vdmVyID0gZnVuY3Rpb24gcmVtb3ZlcigpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBfdGhpczE1LnRhZ3MpIHtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfdGhpczE1LnRhZ3NbaV0pKSB7XG4gICAgICAgICAgICBfdGhpczE1LnRhZ3NbaV0gJiYgX3RoaXMxNS50YWdzW2ldLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHQucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMxNS50YWdzW2ldLnNwbGljZSgwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMxNS50YWdzW2ldICYmIF90aGlzMTUudGFnc1tpXS5yZW1vdmUoKTtcbiAgICAgICAgICAgIF90aGlzMTUudGFnc1tpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBfaTYgaW4gX3RoaXMxNS5ub2Rlcykge1xuICAgICAgICAgIF90aGlzMTUubm9kZXNbX2k2XSAmJiBfdGhpczE1Lm5vZGVzW19pNl0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2N2RG9tRGV0YWNoZWQnKSk7XG4gICAgICAgICAgX3RoaXMxNS5ub2Rlc1tfaTZdICYmIF90aGlzMTUubm9kZXNbX2k2XS5yZW1vdmUoKTtcbiAgICAgICAgICBfdGhpczE1Lm5vZGVzW19pNl0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczE1Lm5vZGVzLnNwbGljZSgwKTtcblxuICAgICAgICBfdGhpczE1LmZpcnN0Tm9kZSA9IF90aGlzMTUubGFzdE5vZGUgPSB1bmRlZmluZWQ7XG4gICAgICB9O1xuXG4gICAgICBpZiAobm93KSB7XG4gICAgICAgIHJlbW92ZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW1vdmVyKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX29uUmVtb3ZlLml0ZW1zKCk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3IxMCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGNhbGxiYWNrcyksXG4gICAgICAgICAgX3N0ZXAxMDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IxMC5zKCk7ICEoX3N0ZXAxMCA9IF9pdGVyYXRvcjEwLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBfc3RlcDEwLnZhbHVlO1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG5cbiAgICAgICAgICB0aGlzLl9vblJlbW92ZS5yZW1vdmUoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMTAuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yMTAuZigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2l0ZXJhdG9yMTEgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLmNsZWFudXApLFxuICAgICAgICAgIF9zdGVwMTE7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTEucygpOyAhKF9zdGVwMTEgPSBfaXRlcmF0b3IxMS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGNsZWFudXAgPSBfc3RlcDExLnZhbHVlO1xuICAgICAgICAgIGNsZWFudXAgJiYgY2xlYW51cCgpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMTEuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yMTEuZigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNsZWFudXAubGVuZ3RoID0gMDtcblxuICAgICAgdmFyIF9pdGVyYXRvcjEyID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy52aWV3TGlzdHMpLFxuICAgICAgICAgIF9zdGVwMTI7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTIucygpOyAhKF9zdGVwMTIgPSBfaXRlcmF0b3IxMi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIF9zdGVwMTIkdmFsdWUgPSBfc2xpY2VkVG9BcnJheShfc3RlcDEyLnZhbHVlLCAyKSxcbiAgICAgICAgICAgICAgdGFnID0gX3N0ZXAxMiR2YWx1ZVswXSxcbiAgICAgICAgICAgICAgdmlld0xpc3QgPSBfc3RlcDEyJHZhbHVlWzFdO1xuXG4gICAgICAgICAgdmlld0xpc3QucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IxMi5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IxMi5mKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmlld0xpc3RzLmNsZWFyKCk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3IxMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMudGltZW91dHMpLFxuICAgICAgICAgIF9zdGVwMTM7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTMucygpOyAhKF9zdGVwMTMgPSBfaXRlcmF0b3IxMy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIF9zdGVwMTMkdmFsdWUgPSBfc2xpY2VkVG9BcnJheShfc3RlcDEzLnZhbHVlLCAyKSxcbiAgICAgICAgICAgICAgX2NhbGxiYWNrMyA9IF9zdGVwMTMkdmFsdWVbMF0sXG4gICAgICAgICAgICAgIHRpbWVvdXQgPSBfc3RlcDEzJHZhbHVlWzFdO1xuXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQudGltZW91dCk7XG4gICAgICAgICAgdGhpcy50aW1lb3V0c1tcImRlbGV0ZVwiXSh0aW1lb3V0LnRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMTMuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yMTMuZigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2l0ZXJhdG9yMTQgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLmludGVydmFscyksXG4gICAgICAgICAgX3N0ZXAxNDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IxNC5zKCk7ICEoX3N0ZXAxNCA9IF9pdGVyYXRvcjE0Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgaW50ZXJ2YWwgPSBfc3RlcDE0LnZhbHVlO1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMTQuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yMTQuZigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmludGVydmFscy5sZW5ndGggPSAwO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yMTUgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLmZyYW1lcyksXG4gICAgICAgICAgX3N0ZXAxNTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IxNS5zKCk7ICEoX3N0ZXAxNSA9IF9pdGVyYXRvcjE1Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZnJhbWUgPSBfc3RlcDE1LnZhbHVlO1xuICAgICAgICAgIGZyYW1lKCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IxNS5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IxNS5mKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZnJhbWVzLmxlbmd0aCA9IDA7XG4gICAgICB0aGlzLnByZVJ1bGVTZXQucHVyZ2UoKTtcbiAgICAgIHRoaXMucnVsZVNldC5wdXJnZSgpO1xuICAgICAgdGhpcy5yZW1vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmluZFRhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kVGFnKHNlbGVjdG9yKSB7XG4gICAgICBmb3IgKHZhciBpIGluIHRoaXMubm9kZXMpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcblxuICAgICAgICBpZiAoIXRoaXMubm9kZXNbaV0ucXVlcnlTZWxlY3Rvcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubm9kZXNbaV0ubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IF9UYWcuVGFnKHRoaXMubm9kZXNbaV0sIHRoaXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQgPSB0aGlzLm5vZGVzW2ldLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBfVGFnLlRhZyhyZXN1bHQsIHRoaXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmaW5kVGFnc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kVGFncyhzZWxlY3Rvcikge1xuICAgICAgdmFyIF90aGlzMTYgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gdGhpcy5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIG4ucXVlcnlTZWxlY3RvckFsbDtcbiAgICAgIH0pLm1hcChmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gX3RvQ29uc3VtYWJsZUFycmF5KG4ucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICAgICAgfSkuZmxhdCgpLm1hcChmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gbmV3IF9UYWcuVGFnKG4sIF90aGlzMTYsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBfdGhpczE2KTtcbiAgICAgIH0pIHx8IFtdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJvblJlbW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvblJlbW92ZShjYWxsYmFjaykge1xuICAgICAgdGhpcy5fb25SZW1vdmUuYWRkKGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiYmVmb3JlVXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGJlZm9yZVVwZGF0ZShhcmdzKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImFmdGVyVXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFmdGVyVXBkYXRlKGFyZ3MpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwic3RyaW5nVHJhbnNmb3JtZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RyaW5nVHJhbnNmb3JtZXIobWV0aG9kcykge1xuICAgICAgdmFyIF90aGlzMTcgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgZm9yICh2YXIgbSBpbiBtZXRob2RzKSB7XG4gICAgICAgICAgdmFyIHBhcmVudCA9IF90aGlzMTc7XG4gICAgICAgICAgdmFyIG1ldGhvZCA9IG1ldGhvZHNbbV07XG5cbiAgICAgICAgICB3aGlsZSAocGFyZW50ICYmICFwYXJlbnRbbWV0aG9kXSkge1xuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXBhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHggPSBwYXJlbnRbbWV0aG9kc1ttXV0oeCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geDtcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN0cmluZ1RvQ2xhc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RyaW5nVG9DbGFzcyhyZWZDbGFzc25hbWUpIHtcbiAgICAgIGlmIChWaWV3LnJlZkNsYXNzZXMuaGFzKHJlZkNsYXNzbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIFZpZXcucmVmQ2xhc3Nlcy5nZXQocmVmQ2xhc3NuYW1lKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlZkNsYXNzU3BsaXQgPSByZWZDbGFzc25hbWUuc3BsaXQoJy8nKTtcbiAgICAgIHZhciByZWZTaG9ydENsYXNzID0gcmVmQ2xhc3NTcGxpdFtyZWZDbGFzc1NwbGl0Lmxlbmd0aCAtIDFdO1xuXG4gICAgICB2YXIgcmVmQ2xhc3MgPSByZXF1aXJlKHJlZkNsYXNzbmFtZSk7XG5cbiAgICAgIFZpZXcucmVmQ2xhc3Nlcy5zZXQocmVmQ2xhc3NuYW1lLCByZWZDbGFzc1tyZWZTaG9ydENsYXNzXSk7XG4gICAgICByZXR1cm4gcmVmQ2xhc3NbcmVmU2hvcnRDbGFzc107XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByZXZlbnRQYXJzaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByZXZlbnRQYXJzaW5nKG5vZGUpIHtcbiAgICAgIG5vZGVbZG9udFBhcnNlXSA9IHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRvU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZXMubWFwKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBuLm91dGVySFRNTDtcbiAgICAgIH0pLmpvaW4oJyAnKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibGlzdGVuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3Rlbihub2RlLCBldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgICB2YXIgX3RoaXMxOCA9IHRoaXM7XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgb3B0aW9ucyA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayA9IGV2ZW50TmFtZTtcbiAgICAgICAgZXZlbnROYW1lID0gbm9kZTtcbiAgICAgICAgbm9kZSA9IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgVmlldykge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0ZW4obm9kZS5ub2RlcywgZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBub2RlLm1hcChmdW5jdGlvbiAobikge1xuICAgICAgICAgIHJldHVybiBfdGhpczE4Lmxpc3RlbihuLCBldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAocikge1xuICAgICAgICAgIHJldHVybiByKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIF9UYWcuVGFnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3Rlbihub2RlLmVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAgIHJldHVybiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgcmVtb3ZlciA9IGZ1bmN0aW9uIHJlbW92ZXIoKSB7XG4gICAgICAgIHJlbW92ZSgpO1xuXG4gICAgICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHt9O1xuICAgICAgfTtcblxuICAgICAgdGhpcy5vblJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZW1vdmVyKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZW1vdmVyO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZXRhY2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGV0YWNoKCkge1xuICAgICAgZm9yICh2YXIgbiBpbiB0aGlzLm5vZGVzKSB7XG4gICAgICAgIHRoaXMubm9kZXNbbl0ucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICAgIH1cbiAgfV0sIFt7XG4gICAga2V5OiBcImZyb21cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZnJvbSh0ZW1wbGF0ZSkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgdmFyIHBhcmVudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogbnVsbDtcbiAgICAgIHZhciB2aWV3ID0gbmV3IHRoaXMoYXJncywgcGFyZW50KTtcbiAgICAgIHZpZXcudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc1ZpZXdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNWaWV3KCkge1xuICAgICAgcmV0dXJuIFZpZXc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInV1aWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXVpZCgpIHtcbiAgICAgIHJldHVybiAoWzFlN10gKyAtMWUzICsgLTRlMyArIC04ZTMgKyAtMWUxMSkucmVwbGFjZSgvWzAxOF0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgcmV0dXJuIChjIF4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxKSlbMF0gJiAxNSA+PiBjIC8gNCkudG9TdHJpbmcoMTYpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFZpZXc7XG59KF9NaXhpbi5NaXhpbltcIndpdGhcIl0oX0V2ZW50VGFyZ2V0TWl4aW4uRXZlbnRUYXJnZXRNaXhpbikpO1xuXG5leHBvcnRzLlZpZXcgPSBWaWV3O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFZpZXcsICd0ZW1wbGF0ZXMnLCB7XG4gIHZhbHVlOiBuZXcgTWFwKClcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFZpZXcsICdyZWZDbGFzc2VzJywge1xuICB2YWx1ZTogbmV3IE1hcCgpXG59KTtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9iYXNlL1ZpZXdMaXN0LmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5WaWV3TGlzdCA9IHZvaWQgMDtcblxudmFyIF9CaW5kYWJsZSA9IHJlcXVpcmUoXCIuL0JpbmRhYmxlXCIpO1xuXG52YXIgX1NldE1hcCA9IHJlcXVpcmUoXCIuL1NldE1hcFwiKTtcblxudmFyIF9WaWV3ID0gcmVxdWlyZShcIi4vVmlld1wiKTtcblxudmFyIF9CYWcgPSByZXF1aXJlKFwiLi9CYWdcIik7XG5cbmZ1bmN0aW9uIF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG8sIGFsbG93QXJyYXlMaWtlKSB7IHZhciBpdCA9IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdIHx8IG9bXCJAQGl0ZXJhdG9yXCJdOyBpZiAoIWl0KSB7IGlmIChBcnJheS5pc0FycmF5KG8pIHx8IChpdCA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvKSkgfHwgYWxsb3dBcnJheUxpa2UgJiYgbyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHsgaWYgKGl0KSBvID0gaXQ7IHZhciBpID0gMDsgdmFyIEYgPSBmdW5jdGlvbiBGKCkge307IHJldHVybiB7IHM6IEYsIG46IGZ1bmN0aW9uIG4oKSB7IGlmIChpID49IG8ubGVuZ3RoKSByZXR1cm4geyBkb25lOiB0cnVlIH07IHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogb1tpKytdIH07IH0sIGU6IGZ1bmN0aW9uIGUoX2UpIHsgdGhyb3cgX2U7IH0sIGY6IEYgfTsgfSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH0gdmFyIG5vcm1hbENvbXBsZXRpb24gPSB0cnVlLCBkaWRFcnIgPSBmYWxzZSwgZXJyOyByZXR1cm4geyBzOiBmdW5jdGlvbiBzKCkgeyBpdCA9IGl0LmNhbGwobyk7IH0sIG46IGZ1bmN0aW9uIG4oKSB7IHZhciBzdGVwID0gaXQubmV4dCgpOyBub3JtYWxDb21wbGV0aW9uID0gc3RlcC5kb25lOyByZXR1cm4gc3RlcDsgfSwgZTogZnVuY3Rpb24gZShfZTIpIHsgZGlkRXJyID0gdHJ1ZTsgZXJyID0gX2UyOyB9LCBmOiBmdW5jdGlvbiBmKCkgeyB0cnkgeyBpZiAoIW5vcm1hbENvbXBsZXRpb24gJiYgaXRbXCJyZXR1cm5cIl0gIT0gbnVsbCkgaXRbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKGRpZEVycikgdGhyb3cgZXJyOyB9IH0gfTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgVmlld0xpc3QgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBWaWV3TGlzdCh0ZW1wbGF0ZSwgc3ViUHJvcGVydHksIGxpc3QsIHBhcmVudCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIga2V5UHJvcGVydHkgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IG51bGw7XG4gICAgdmFyIHZpZXdDbGFzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDogbnVsbDtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBWaWV3TGlzdCk7XG5cbiAgICB0aGlzLnJlbW92ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmFyZ3MgPSBfQmluZGFibGUuQmluZGFibGUubWFrZUJpbmRhYmxlKHt9KTtcbiAgICB0aGlzLmFyZ3MudmFsdWUgPSBfQmluZGFibGUuQmluZGFibGUubWFrZUJpbmRhYmxlKGxpc3QgfHwge30pO1xuICAgIHRoaXMuc3ViQXJncyA9IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlQmluZGFibGUoe30pO1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLmNsZWFudXAgPSBbXTtcbiAgICB0aGlzLnZpZXdDbGFzcyA9IHZpZXdDbGFzcyB8fCBfVmlldy5WaWV3O1xuICAgIHRoaXMuX29uUmVtb3ZlID0gbmV3IF9CYWcuQmFnKCk7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIHRoaXMuc3ViUHJvcGVydHkgPSBzdWJQcm9wZXJ0eTtcbiAgICB0aGlzLmtleVByb3BlcnR5ID0ga2V5UHJvcGVydHk7XG4gICAgdGhpcy50YWcgPSBudWxsO1xuICAgIHRoaXMuZG93bkRlYmluZCA9IFtdO1xuICAgIHRoaXMudXBEZWJpbmQgPSBbXTtcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMucmVuZGVyZWQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYWNjZXB0LCByZWplY3QpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfdGhpcywgJ3JlbmRlckNvbXBsZXRlJywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IGFjY2VwdFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy53aWxsUmVSZW5kZXIgPSBmYWxzZTtcblxuICAgIHRoaXMuYXJncy5fX19iZWZvcmUoZnVuY3Rpb24gKHQsIGUsIHMsIG8sIGEpIHtcbiAgICAgIGlmIChlID09ICdiaW5kVG8nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3RoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuYXJncy5fX19hZnRlcihmdW5jdGlvbiAodCwgZSwgcywgbywgYSkge1xuICAgICAgaWYgKGUgPT0gJ2JpbmRUbycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5wYXVzZWQgPSBzLmxlbmd0aCA+IDE7XG5cbiAgICAgIF90aGlzLnJlUmVuZGVyKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgZGViaW5kID0gdGhpcy5hcmdzLnZhbHVlLmJpbmRUbyhmdW5jdGlvbiAodiwgaywgdCwgZCkge1xuICAgICAgaWYgKF90aGlzLnBhdXNlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBrayA9IGs7XG5cbiAgICAgIGlmIChfdHlwZW9mKGspID09PSAnc3ltYm9sJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpc05hTihrKSkge1xuICAgICAgICBrayA9ICdfJyArIGs7XG4gICAgICB9XG5cbiAgICAgIGlmIChkKSB7XG4gICAgICAgIGlmIChfdGhpcy52aWV3c1tra10pIHtcbiAgICAgICAgICBfdGhpcy52aWV3c1tra10ucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgX3RoaXMudmlld3Nba2tdO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gX3RoaXMudmlld3MpIHtcbiAgICAgICAgICBpZiAoaXNOYU4oaSkpIHtcbiAgICAgICAgICAgIF90aGlzLnZpZXdzW2ldLmFyZ3NbX3RoaXMua2V5UHJvcGVydHldID0gaS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpcy52aWV3c1tpXS5hcmdzW190aGlzLmtleVByb3BlcnR5XSA9IGk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIV90aGlzLnZpZXdzW2trXSkge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShfdGhpcy53aWxsUmVSZW5kZXIpO1xuICAgICAgICBfdGhpcy53aWxsUmVSZW5kZXIgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzLnJlUmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChfdGhpcy52aWV3c1tra10gJiYgX3RoaXMudmlld3Nba2tdLmFyZ3MpIHtcbiAgICAgICAgX3RoaXMudmlld3Nba2tdLmFyZ3NbX3RoaXMua2V5UHJvcGVydHldID0gaztcbiAgICAgICAgX3RoaXMudmlld3Nba2tdLmFyZ3NbX3RoaXMuc3ViUHJvcGVydHldID0gdjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX29uUmVtb3ZlLmFkZChkZWJpbmQpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFZpZXdMaXN0LCBbe1xuICAgIGtleTogXCJyZW5kZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKHRhZykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciByZW5kZXJzID0gW107XG5cbiAgICAgIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLnZpZXdzKSxcbiAgICAgICAgICBfc3RlcDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoKSB7XG4gICAgICAgICAgdmFyIHZpZXcgPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICB2aWV3LnJlbmRlcih0YWcpO1xuICAgICAgICAgIHJlbmRlcnMucHVzaCh2aWV3LnJlbmRlcmVkLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgX2xvb3AoKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IuZigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRhZyA9IHRhZztcbiAgICAgIFByb21pc2UuYWxsKHJlbmRlcnMpLnRoZW4oZnVuY3Rpb24gKHZpZXdzKSB7XG4gICAgICAgIHJldHVybiBfdGhpczIucmVuZGVyQ29tcGxldGUodmlld3MpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnBhcmVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbGlzdFJlbmRlcmVkJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIGtleTogdGhpcy5zdWJQcm9wZXJ0eSxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLmFyZ3MudmFsdWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVSZW5kZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVSZW5kZXIoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgaWYgKHRoaXMucGF1c2VkIHx8ICF0aGlzLnRhZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB2aWV3cyA9IFtdO1xuICAgICAgdmFyIGV4aXN0aW5nVmlld3MgPSBuZXcgX1NldE1hcC5TZXRNYXAoKTtcblxuICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnZpZXdzKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcy52aWV3c1tpXTtcbiAgICAgICAgdmFyIHJhd1ZhbHVlID0gdmlldy5hcmdzW3RoaXMuc3ViUHJvcGVydHldO1xuICAgICAgICBleGlzdGluZ1ZpZXdzLmFkZChyYXdWYWx1ZSwgdmlldyk7XG4gICAgICAgIHZpZXdzW2ldID0gdmlldztcbiAgICAgIH1cblxuICAgICAgdmFyIGZpbmFsVmlld3MgPSBbXTtcbiAgICAgIHZhciBmaW5hbFZpZXdTZXQgPSBuZXcgU2V0KCk7XG4gICAgICB0aGlzLmRvd25EZWJpbmQubGVuZ3RoICYmIHRoaXMuZG93bkRlYmluZC5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkICYmIGQoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy51cERlYmluZC5sZW5ndGggJiYgdGhpcy51cERlYmluZC5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkICYmIGQoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy51cERlYmluZC5sZW5ndGggPSAwO1xuICAgICAgdGhpcy5kb3duRGViaW5kLmxlbmd0aCA9IDA7XG4gICAgICB2YXIgbWluS2V5ID0gSW5maW5pdHk7XG4gICAgICB2YXIgYW50ZU1pbktleSA9IEluZmluaXR5O1xuXG4gICAgICB2YXIgX2xvb3AyID0gZnVuY3Rpb24gX2xvb3AyKF9pKSB7XG4gICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICB2YXIgayA9IF9pO1xuXG4gICAgICAgIGlmIChpc05hTihrKSkge1xuICAgICAgICAgIGsgPSAnXycgKyBfaTtcbiAgICAgICAgfSBlbHNlIGlmIChTdHJpbmcoaykubGVuZ3RoKSB7XG4gICAgICAgICAgayA9IE51bWJlcihrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfdGhpczMuYXJncy52YWx1ZVtfaV0gIT09IHVuZGVmaW5lZCAmJiBleGlzdGluZ1ZpZXdzLmhhcyhfdGhpczMuYXJncy52YWx1ZVtfaV0pKSB7XG4gICAgICAgICAgdmFyIGV4aXN0aW5nVmlldyA9IGV4aXN0aW5nVmlld3MuZ2V0T25lKF90aGlzMy5hcmdzLnZhbHVlW19pXSk7XG5cbiAgICAgICAgICBpZiAoZXhpc3RpbmdWaWV3KSB7XG4gICAgICAgICAgICBleGlzdGluZ1ZpZXcuYXJnc1tfdGhpczMua2V5UHJvcGVydHldID0gX2k7XG4gICAgICAgICAgICBmaW5hbFZpZXdzW2tdID0gZXhpc3RpbmdWaWV3O1xuICAgICAgICAgICAgZmluYWxWaWV3U2V0LmFkZChleGlzdGluZ1ZpZXcpO1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoIWlzTmFOKGspKSB7XG4gICAgICAgICAgICAgIG1pbktleSA9IE1hdGgubWluKG1pbktleSwgayk7XG4gICAgICAgICAgICAgIGsgPiAwICYmIChhbnRlTWluS2V5ID0gTWF0aC5taW4oYW50ZU1pbktleSwgaykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleGlzdGluZ1ZpZXdzLnJlbW92ZShfdGhpczMuYXJncy52YWx1ZVtfaV0sIGV4aXN0aW5nVmlldyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgIHZhciB2aWV3QXJncyA9IHt9O1xuXG4gICAgICAgICAgdmFyIF92aWV3ID0gZmluYWxWaWV3c1trXSA9IG5ldyBfdGhpczMudmlld0NsYXNzKHZpZXdBcmdzLCBfdGhpczMucGFyZW50KTtcblxuICAgICAgICAgIGlmICghaXNOYU4oaykpIHtcbiAgICAgICAgICAgIG1pbktleSA9IE1hdGgubWluKG1pbktleSwgayk7XG4gICAgICAgICAgICBrID4gMCAmJiAoYW50ZU1pbktleSA9IE1hdGgubWluKGFudGVNaW5LZXksIGspKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaW5hbFZpZXdzW2tdLnRlbXBsYXRlID0gX3RoaXMzLnRlbXBsYXRlO1xuICAgICAgICAgIGZpbmFsVmlld3Nba10udmlld0xpc3QgPSBfdGhpczM7XG4gICAgICAgICAgZmluYWxWaWV3c1trXS5hcmdzW190aGlzMy5rZXlQcm9wZXJ0eV0gPSBfaTtcbiAgICAgICAgICBmaW5hbFZpZXdzW2tdLmFyZ3NbX3RoaXMzLnN1YlByb3BlcnR5XSA9IF90aGlzMy5hcmdzLnZhbHVlW19pXTtcbiAgICAgICAgICBfdGhpczMudXBEZWJpbmRba10gPSB2aWV3QXJncy5iaW5kVG8oX3RoaXMzLnN1YlByb3BlcnR5LCBmdW5jdGlvbiAodiwgaywgdCwgZCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdmlld0FyZ3NbX3RoaXMzLmtleVByb3BlcnR5XTtcblxuICAgICAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIF90aGlzMy5hcmdzLnZhbHVlW2luZGV4XTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdGhpczMuYXJncy52YWx1ZVtpbmRleF0gPSB2O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIF90aGlzMy5kb3duRGViaW5kW2tdID0gX3RoaXMzLnN1YkFyZ3MuYmluZFRvKGZ1bmN0aW9uICh2LCBrLCB0LCBkKSB7XG4gICAgICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgICBkZWxldGUgdmlld0FyZ3Nba107XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmlld0FyZ3Nba10gPSB2O1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIHVwRGViaW5kID0gZnVuY3Rpb24gdXBEZWJpbmQoKSB7XG4gICAgICAgICAgICBfdGhpczMudXBEZWJpbmQuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICByZXR1cm4gZCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF90aGlzMy51cERlYmluZC5sZW5ndGggPSAwO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgZG93bkRlYmluZCA9IGZ1bmN0aW9uIGRvd25EZWJpbmQoKSB7XG4gICAgICAgICAgICBfdGhpczMuZG93bkRlYmluZC5maWx0ZXIoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMzLmRvd25EZWJpbmQubGVuZ3RoID0gMDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgX3ZpZXcub25SZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMzLl9vblJlbW92ZS5yZW1vdmUodXBEZWJpbmQpO1xuXG4gICAgICAgICAgICBfdGhpczMuX29uUmVtb3ZlLnJlbW92ZShkb3duRGViaW5kKTtcblxuICAgICAgICAgICAgX3RoaXMzLnVwRGViaW5kW2tdICYmIF90aGlzMy51cERlYmluZFtrXSgpO1xuICAgICAgICAgICAgX3RoaXMzLmRvd25EZWJpbmRba10gJiYgX3RoaXMzLmRvd25EZWJpbmRba10oKTtcbiAgICAgICAgICAgIGRlbGV0ZSBfdGhpczMudXBEZWJpbmRba107XG4gICAgICAgICAgICBkZWxldGUgX3RoaXMzLmRvd25EZWJpbmRba107XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBfdGhpczMuX29uUmVtb3ZlLmFkZCh1cERlYmluZCk7XG5cbiAgICAgICAgICBfdGhpczMuX29uUmVtb3ZlLmFkZChkb3duRGViaW5kKTtcblxuICAgICAgICAgIHZpZXdBcmdzW190aGlzMy5zdWJQcm9wZXJ0eV0gPSBfdGhpczMuYXJncy52YWx1ZVtfaV07XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIF9pIGluIHRoaXMuYXJncy52YWx1ZSkge1xuICAgICAgICBfbG9vcDIoX2kpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaTIgaW4gdmlld3MpIHtcbiAgICAgICAgaWYgKCFmaW5hbFZpZXdTZXQuaGFzKHZpZXdzW19pMl0pKSB7XG4gICAgICAgICAgdmlld3NbX2kyXS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmFyZ3MudmFsdWUpKSB7XG4gICAgICAgIHZhciBsb2NhbE1pbiA9IG1pbktleSA9PT0gMCAmJiBmaW5hbFZpZXdzWzFdICE9PSB1bmRlZmluZWQgJiYgZmluYWxWaWV3cy5sZW5ndGggPiAxIHx8IGFudGVNaW5LZXkgPT09IEluZmluaXR5ID8gbWluS2V5IDogYW50ZU1pbktleTtcblxuICAgICAgICB2YXIgcmVuZGVyUmVjdXJzZSA9IGZ1bmN0aW9uIHJlbmRlclJlY3Vyc2UoKSB7XG4gICAgICAgICAgdmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgICAgICAgdmFyIGlpID0gZmluYWxWaWV3cy5sZW5ndGggLSBpIC0gMTtcblxuICAgICAgICAgIHdoaWxlIChpaSA+IGxvY2FsTWluICYmIGZpbmFsVmlld3NbaWldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlpLS07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlpIDwgbG9jYWxNaW4pIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZmluYWxWaWV3c1tpaV0gPT09IF90aGlzMy52aWV3c1tpaV0pIHtcbiAgICAgICAgICAgIGlmICghZmluYWxWaWV3c1tpaV0uZmlyc3ROb2RlKSB7XG4gICAgICAgICAgICAgIGZpbmFsVmlld3NbaWldLnJlbmRlcihfdGhpczMudGFnLCBmaW5hbFZpZXdzW2lpICsgMV0pO1xuICAgICAgICAgICAgICByZXR1cm4gZmluYWxWaWV3c1tpaV0ucmVuZGVyZWQudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlclJlY3Vyc2UoTnVtYmVyKGkpICsgMSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyUmVjdXJzZShOdW1iZXIoaSkgKyAxKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaW5hbFZpZXdzW2lpXS5yZW5kZXIoX3RoaXMzLnRhZywgZmluYWxWaWV3c1tpaSArIDFdKTtcblxuICAgICAgICAgIF90aGlzMy52aWV3cy5zcGxpY2UoaWksIDAsIGZpbmFsVmlld3NbaWldKTtcblxuICAgICAgICAgIHJldHVybiBmaW5hbFZpZXdzW2lpXS5yZW5kZXJlZC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXJSZWN1cnNlKE51bWJlcihpKSArIDEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucmVuZGVyZWQgPSByZW5kZXJSZWN1cnNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVuZGVycyA9IFtdO1xuICAgICAgICB2YXIgbGVmdG92ZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgZmluYWxWaWV3cyk7XG5cbiAgICAgICAgdmFyIGlzSW50ID0gZnVuY3Rpb24gaXNJbnQoeCkge1xuICAgICAgICAgIHJldHVybiBwYXJzZUludCh4KSA9PT0geCAtIDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhmaW5hbFZpZXdzKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgaWYgKGlzSW50KGEpICYmIGlzSW50KGIpKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zaWduKGEgLSBiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWlzSW50KGEpICYmICFpc0ludChiKSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFpc0ludChhKSAmJiBpc0ludChiKSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0ludChhKSAmJiAhaXNJbnQoYikpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIF9pdGVyYXRvcjIgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihrZXlzKSxcbiAgICAgICAgICAgIF9zdGVwMjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBfbG9vcDMgPSBmdW5jdGlvbiBfbG9vcDMoKSB7XG4gICAgICAgICAgICB2YXIgaSA9IF9zdGVwMi52YWx1ZTtcbiAgICAgICAgICAgIGRlbGV0ZSBsZWZ0b3ZlcnNbaV07XG5cbiAgICAgICAgICAgIGlmIChmaW5hbFZpZXdzW2ldLmZpcnN0Tm9kZSAmJiBmaW5hbFZpZXdzW2ldID09PSBfdGhpczMudmlld3NbaV0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmluYWxWaWV3c1tpXS5yZW5kZXIoX3RoaXMzLnRhZyk7XG4gICAgICAgICAgICByZW5kZXJzLnB1c2goZmluYWxWaWV3c1tpXS5yZW5kZXJlZC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbmFsVmlld3NbaV07XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMi5zKCk7ICEoX3N0ZXAyID0gX2l0ZXJhdG9yMi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICB2YXIgX3JldCA9IF9sb29wMygpO1xuXG4gICAgICAgICAgICBpZiAoX3JldCA9PT0gXCJjb250aW51ZVwiKSBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIF9pdGVyYXRvcjIuZShlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIF9pdGVyYXRvcjIuZigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgX2kzIGluIGxlZnRvdmVycykge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmFyZ3Mudmlld3NbX2kzXTtcbiAgICAgICAgICBsZWZ0b3ZlcnMucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlcmVkID0gUHJvbWlzZS5hbGwocmVuZGVycyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIF9pNCBpbiBmaW5hbFZpZXdzKSB7XG4gICAgICAgIGlmIChpc05hTihfaTQpKSB7XG4gICAgICAgICAgZmluYWxWaWV3c1tfaTRdLmFyZ3NbdGhpcy5rZXlQcm9wZXJ0eV0gPSBfaTQuc3Vic3RyKDEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluYWxWaWV3c1tfaTRdLmFyZ3NbdGhpcy5rZXlQcm9wZXJ0eV0gPSBfaTQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmlld3MgPSBBcnJheS5pc0FycmF5KHRoaXMuYXJncy52YWx1ZSkgPyBbXS5jb25jYXQoZmluYWxWaWV3cykgOiBmaW5hbFZpZXdzO1xuICAgICAgZmluYWxWaWV3U2V0LmNsZWFyKCk7XG4gICAgICB0aGlzLndpbGxSZVJlbmRlciA9IGZhbHNlO1xuICAgICAgdGhpcy5wYXJlbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2xpc3RSZW5kZXJlZCcsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBrZXk6IHRoaXMuc3ViUHJvcGVydHksXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5hcmdzLnZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBhdXNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgICAgdmFyIF9wYXVzZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcblxuICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnZpZXdzKSB7XG4gICAgICAgIHRoaXMudmlld3NbaV0ucGF1c2UoX3BhdXNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25SZW1vdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25SZW1vdmUoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuX29uUmVtb3ZlLmFkZChjYWxsYmFjayk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICBmb3IgKHZhciBpIGluIHRoaXMudmlld3MpIHtcbiAgICAgICAgdGhpcy52aWV3c1tpXS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG9uUmVtb3ZlID0gdGhpcy5fb25SZW1vdmUuaXRlbXMoKTtcblxuICAgICAgZm9yICh2YXIgX2k1IGluIG9uUmVtb3ZlKSB7XG4gICAgICAgIHRoaXMuX29uUmVtb3ZlLnJlbW92ZShvblJlbW92ZVtfaTVdKTtcblxuICAgICAgICBvblJlbW92ZVtfaTVdKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjbGVhbnVwO1xuXG4gICAgICB3aGlsZSAodGhpcy5jbGVhbnVwLmxlbmd0aCkge1xuICAgICAgICBjbGVhbnVwID0gdGhpcy5jbGVhbnVwLnBvcCgpO1xuICAgICAgICBjbGVhbnVwKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmlld3MgPSBbXTtcblxuICAgICAgd2hpbGUgKHRoaXMudGFnICYmIHRoaXMudGFnLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgdGhpcy50YWcucmVtb3ZlQ2hpbGQodGhpcy50YWcuZmlyc3RDaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnN1YkFyZ3MpIHtcbiAgICAgICAgX0JpbmRhYmxlLkJpbmRhYmxlLmNsZWFyQmluZGluZ3ModGhpcy5zdWJBcmdzKTtcbiAgICAgIH1cblxuICAgICAgX0JpbmRhYmxlLkJpbmRhYmxlLmNsZWFyQmluZGluZ3ModGhpcy5hcmdzKTtcblxuICAgICAgaWYgKHRoaXMuYXJncy52YWx1ZSAmJiAhdGhpcy5hcmdzLnZhbHVlLmlzQm91bmQoKSkge1xuICAgICAgICBfQmluZGFibGUuQmluZGFibGUuY2xlYXJCaW5kaW5ncyh0aGlzLmFyZ3MudmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbW92ZWQgPSB0cnVlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBWaWV3TGlzdDtcbn0oKTtcblxuZXhwb3J0cy5WaWV3TGlzdCA9IFZpZXdMaXN0O1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2lucHV0L0F4aXMuanNcIiwgZnVuY3Rpb24oZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlKSB7XG4gIHJlcXVpcmUgPSBfX21ha2VSZWxhdGl2ZVJlcXVpcmUocmVxdWlyZSwge30sIFwiY3VydmF0dXJlXCIpO1xuICAoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLkF4aXMgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIEF4aXMgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBBeGlzKF9yZWYpIHtcbiAgICB2YXIgX3JlZiRkZWFkWm9uZSA9IF9yZWYuZGVhZFpvbmUsXG4gICAgICAgIGRlYWRab25lID0gX3JlZiRkZWFkWm9uZSA9PT0gdm9pZCAwID8gMCA6IF9yZWYkZGVhZFpvbmUsXG4gICAgICAgIF9yZWYkcHJvcG9ydGlvbmFsID0gX3JlZi5wcm9wb3J0aW9uYWwsXG4gICAgICAgIHByb3BvcnRpb25hbCA9IF9yZWYkcHJvcG9ydGlvbmFsID09PSB2b2lkIDAgPyB0cnVlIDogX3JlZiRwcm9wb3J0aW9uYWw7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQXhpcyk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJtYWduaXR1ZGVcIiwgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkZWx0YVwiLCAwKTtcblxuICAgIHRoaXMucHJvcG9ydGlvbmFsID0gcHJvcG9ydGlvbmFsO1xuICAgIHRoaXMuZGVhZFpvbmUgPSBkZWFkWm9uZTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhBeGlzLCBbe1xuICAgIGtleTogXCJ0aWx0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRpbHQobWFnbml0dWRlKSB7XG4gICAgICBpZiAodGhpcy5kZWFkWm9uZSAmJiBNYXRoLmFicyhtYWduaXR1ZGUpID49IHRoaXMuZGVhZFpvbmUpIHtcbiAgICAgICAgbWFnbml0dWRlID0gKE1hdGguYWJzKG1hZ25pdHVkZSkgLSB0aGlzLmRlYWRab25lKSAvICgxIC0gdGhpcy5kZWFkWm9uZSkgKiBNYXRoLnNpZ24obWFnbml0dWRlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5kZWFkWm9uZSAmJiBNYXRoLmFicyhtYWduaXR1ZGUpIDwgdGhpcy5kZWFkWm9uZSkge1xuICAgICAgICBtYWduaXR1ZGUgPSAwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRlbHRhID0gTnVtYmVyKG1hZ25pdHVkZSAtIHRoaXMubWFnbml0dWRlKS50b0ZpeGVkKDMpIC0gMDtcbiAgICAgIHRoaXMubWFnbml0dWRlID0gTnVtYmVyKG1hZ25pdHVkZSkudG9GaXhlZCgzKSAtIDA7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInplcm9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gemVybygpIHtcbiAgICAgIHRoaXMubWFnbml0dWRlID0gdGhpcy5kZWx0YSA9IDA7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEF4aXM7XG59KCk7XG5cbmV4cG9ydHMuQXhpcyA9IEF4aXM7XG4gIH0pKCk7XG59KTsiLCJcbnJlcXVpcmUucmVnaXN0ZXIoXCJjdXJ2YXR1cmUvaW5wdXQvQnV0dG9uLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5CdXR0b24gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIEJ1dHRvbiA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJ1dHRvbigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQnV0dG9uKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImFjdGl2ZVwiLCBmYWxzZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJwcmVzc3VyZVwiLCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRlbHRhXCIsIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwidGltZVwiLCAwKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhCdXR0b24sIFt7XG4gICAga2V5OiBcInVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICAgIGlmICh0aGlzLnByZXNzdXJlKSB7XG4gICAgICAgIHRoaXMudGltZSsrO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5wcmVzc3VyZSAmJiB0aGlzLnRpbWUgPiAwKSB7XG4gICAgICAgIHRoaXMudGltZSA9IC0xO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5wcmVzc3VyZSAmJiB0aGlzLnRpbWUgPCAwKSB7XG4gICAgICAgIHRoaXMudGltZS0tO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50aW1lIDwgLTEgJiYgdGhpcy5kZWx0YSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5kZWx0YSA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByZXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByZXNzKHByZXNzdXJlKSB7XG4gICAgICB0aGlzLmRlbHRhID0gTnVtYmVyKHByZXNzdXJlIC0gdGhpcy5wcmVzc3VyZSkudG9GaXhlZCgzKSAtIDA7XG4gICAgICB0aGlzLnByZXNzdXJlID0gTnVtYmVyKHByZXNzdXJlKS50b0ZpeGVkKDMpIC0gMDtcbiAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICAgIHRoaXMudGltZSA9IHRoaXMudGltZSA+IDAgPyB0aGlzLnRpbWUgOiAwO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWxlYXNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbGVhc2UoKSB7XG4gICAgICBpZiAoIXRoaXMuYWN0aXZlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kZWx0YSA9IE51bWJlcigtdGhpcy5wcmVzc3VyZSkudG9GaXhlZCgzKSAtIDA7XG4gICAgICB0aGlzLnByZXNzdXJlID0gMDtcbiAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInplcm9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gemVybygpIHtcbiAgICAgIHRoaXMucHJlc3N1cmUgPSB0aGlzLmRlbHRhID0gMDtcbiAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJ1dHRvbjtcbn0oKTtcblxuZXhwb3J0cy5CdXR0b24gPSBCdXR0b247XG4gIH0pKCk7XG59KTsiLCJcbnJlcXVpcmUucmVnaXN0ZXIoXCJjdXJ2YXR1cmUvaW5wdXQvR2FtZXBhZC5qc1wiLCBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUpIHtcbiAgcmVxdWlyZSA9IF9fbWFrZVJlbGF0aXZlUmVxdWlyZShyZXF1aXJlLCB7fSwgXCJjdXJ2YXR1cmVcIik7XG4gIChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5HYW1lcGFkID0gdm9pZCAwO1xuXG52YXIgX01peGluID0gcmVxdWlyZShcIi4uL2Jhc2UvTWl4aW5cIik7XG5cbnZhciBfRXZlbnRUYXJnZXRNaXhpbiA9IHJlcXVpcmUoXCIuLi9taXhpbi9FdmVudFRhcmdldE1peGluXCIpO1xuXG52YXIgX0F4aXMgPSByZXF1aXJlKFwiLi9BeGlzXCIpO1xuXG52YXIgX0J1dHRvbiA9IHJlcXVpcmUoXCIuL0J1dHRvblwiKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IGVsc2UgaWYgKGNhbGwgIT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRGVyaXZlZCBjb25zdHJ1Y3RvcnMgbWF5IG9ubHkgcmV0dXJuIG9iamVjdCBvciB1bmRlZmluZWRcIik7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgQm9vbGVhbi5wcm90b3R5cGUudmFsdWVPZi5jYWxsKFJlZmxlY3QuY29uc3RydWN0KEJvb2xlYW4sIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgaXRlcltTeW1ib2wuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxudmFyIGtleXMgPSB7XG4gICdTcGFjZSc6IDAsXG4gICdFbnRlcic6IDAsXG4gICdOdW1wYWRFbnRlcic6IDAsXG4gICdDb250cm9sTGVmdCc6IDEsXG4gICdDb250cm9sUmlnaHQnOiAxLFxuICAnU2hpZnRMZWZ0JzogMixcbiAgJ1NoaWZ0UmlnaHQnOiAyLFxuICAnS2V5Wic6IDMsXG4gICdLZXlRJzogNCxcbiAgJ0tleUUnOiA1LFxuICAnRGlnaXQxJzogNixcbiAgJ0RpZ2l0Myc6IDcsXG4gICdLZXlXJzogMTIsXG4gICdLZXlBJzogMTQsXG4gICdLZXlTJzogMTMsXG4gICdLZXlEJzogMTUsXG4gICdLZXlIJzogMTEyLFxuICAnS2V5Sic6IDExMyxcbiAgJ0tleUsnOiAxMTQsXG4gICdLZXlMJzogMTE1LFxuICAnS2V5UCc6IDksXG4gICdQYXVzZSc6IDksXG4gICdUYWInOiAxMSxcbiAgJ0Fycm93VXAnOiAxMixcbiAgJ0Fycm93RG93bic6IDEzLFxuICAnQXJyb3dMZWZ0JzogMTQsXG4gICdBcnJvd1JpZ2h0JzogMTUsXG4gICdOdW1wYWQ0JzogMTEyLFxuICAnTnVtcGFkMic6IDExMyxcbiAgJ051bXBhZDgnOiAxMTQsXG4gICdOdW1wYWQ2JzogMTE1LFxuICAnQmFja3F1b3RlJzogMTAxMCxcbiAgJ051bXBhZEFkZCc6IDEwMTEsXG4gICdOdW1wYWRTdWJ0cmFjdCc6IDEwMTIsXG4gICdOdW1wYWRNdWx0aXBseSc6IDEwMTMsXG4gICdOdW1wYWREaXZpZGUnOiAxMDE0LFxuICAnRXNjYXBlJzogMTAyMFxufTtcblxuX3RvQ29uc3VtYWJsZUFycmF5KEFycmF5KDEyKSkubWFwKGZ1bmN0aW9uICh4LCBmbikge1xuICByZXR1cm4ga2V5c1tcIkZcIi5jb25jYXQoZm4pXSA9IDIwMDAgKyBmbjtcbn0pO1xuXG52YXIgYXhpc01hcCA9IHtcbiAgMTI6IC0xLFxuICAxMzogKzEsXG4gIDE0OiAtMCxcbiAgMTU6ICswLFxuICAxMTI6IC0yLFxuICAxMTM6ICszLFxuICAxMTQ6IC0zLFxuICAxMTU6ICsyXG59O1xuXG52YXIgR2FtZXBhZCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX01peGluJHdpdGgpIHtcbiAgX2luaGVyaXRzKEdhbWVwYWQsIF9NaXhpbiR3aXRoKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEdhbWVwYWQpO1xuXG4gIGZ1bmN0aW9uIEdhbWVwYWQoKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICBfcmVmJGtleXMgPSBfcmVmLmtleXMsXG4gICAgICAgIGtleXMgPSBfcmVmJGtleXMgPT09IHZvaWQgMCA/IHt9IDogX3JlZiRrZXlzLFxuICAgICAgICBfcmVmJGRlYWRab25lID0gX3JlZi5kZWFkWm9uZSxcbiAgICAgICAgZGVhZFpvbmUgPSBfcmVmJGRlYWRab25lID09PSB2b2lkIDAgPyAwIDogX3JlZiRkZWFkWm9uZSxcbiAgICAgICAgX3JlZiRnYW1lcGFkID0gX3JlZi5nYW1lcGFkLFxuICAgICAgICBnYW1lcGFkID0gX3JlZiRnYW1lcGFkID09PSB2b2lkIDAgPyBudWxsIDogX3JlZiRnYW1lcGFkLFxuICAgICAgICBfcmVmJGtleWJvYXJkID0gX3JlZi5rZXlib2FyZCxcbiAgICAgICAga2V5Ym9hcmQgPSBfcmVmJGtleWJvYXJkID09PSB2b2lkIDAgPyBudWxsIDogX3JlZiRrZXlib2FyZDtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBHYW1lcGFkKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgX3RoaXMuZGVhZFpvbmUgPSBkZWFkWm9uZTtcbiAgICBfdGhpcy5nYW1lcGFkID0gZ2FtZXBhZDtcbiAgICBfdGhpcy5pbmRleCA9IGdhbWVwYWQuaW5kZXg7XG4gICAgX3RoaXMuaWQgPSBnYW1lcGFkLmlkO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCB7XG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIHZhbHVlOiB7fVxuICAgICAgfSxcbiAgICAgIHByZXNzdXJlOiB7XG4gICAgICAgIHZhbHVlOiB7fVxuICAgICAgfSxcbiAgICAgIGF4ZXM6IHtcbiAgICAgICAgdmFsdWU6IHt9XG4gICAgICB9LFxuICAgICAga2V5czoge1xuICAgICAgICB2YWx1ZToge31cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoR2FtZXBhZCwgW3tcbiAgICBrZXk6IFwidXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5idXR0b25zKSB7XG4gICAgICAgIHZhciBidXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XG4gICAgICAgIGJ1dHRvbi51cGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicnVtYmxlRWZmZWN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJ1bWJsZUVmZmVjdChvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5nYW1lcGFkLnZpYnJhdGlvbkFjdHVhdG9yLnBsYXlFZmZlY3QoXCJkdWFsLXJ1bWJsZVwiLCBvcHRpb25zKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicnVtYmxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJ1bWJsZSgpIHtcbiAgICAgIGlmICh0aGlzLmdhbWVwYWQudmlicmF0aW9uQWN0dWF0b3IucHVsc2UpIHtcbiAgICAgICAgdmFyIF90aGlzJGdhbWVwYWQkdmlicmF0aTtcblxuICAgICAgICByZXR1cm4gKF90aGlzJGdhbWVwYWQkdmlicmF0aSA9IHRoaXMuZ2FtZXBhZC52aWJyYXRpb25BY3R1YXRvcikucHVsc2UuYXBwbHkoX3RoaXMkZ2FtZXBhZCR2aWJyYXRpLCBhcmd1bWVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ydW1ibGVFZmZlY3Qoe1xuICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgIHN0cm9uZ01hZ25pdHVkZTogMS4wLFxuICAgICAgICAgIHdlYWtNYWduaXR1ZGU6IDEuMFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVhZElucHV0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlYWRJbnB1dCgpIHtcbiAgICAgIGlmICghdGhpcy5nYW1lcGFkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGluZGV4ID0gU3RyaW5nKHRoaXMuZ2FtZXBhZC5pbmRleCk7XG4gICAgICB2YXIgc3RhdCA9IHRoaXMuY29uc3RydWN0b3I7XG5cbiAgICAgIGlmICghc3RhdC5wYWRzUmVhZC5oYXMoaW5kZXgpKSB7XG4gICAgICAgIHN0YXQucGFkc1JlYWQgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKG5hdmlnYXRvci5nZXRHYW1lcGFkcygpKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBnYW1lcGFkID0gdGhpcy5nYW1lcGFkID0gc3RhdC5wYWRzUmVhZC5nZXQoaW5kZXgpO1xuICAgICAgc3RhdC5wYWRzUmVhZFtcImRlbGV0ZVwiXShpbmRleCk7XG4gICAgICB2YXIgcHJlc3NlZCA9IHt9O1xuICAgICAgdmFyIHJlbGVhc2VkID0ge307XG5cbiAgICAgIGlmIChnYW1lcGFkKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gZ2FtZXBhZC5idXR0b25zKSB7XG4gICAgICAgICAgdmFyIGJ1dHRvbiA9IGdhbWVwYWQuYnV0dG9uc1tpXTtcblxuICAgICAgICAgIGlmIChidXR0b24ucHJlc3NlZCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzcyhpLCBidXR0b24udmFsdWUpO1xuICAgICAgICAgICAgcHJlc3NlZFtpXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmtleWJvYXJkKSB7XG4gICAgICAgIGZvciAodmFyIF9pIGluIF90b0NvbnN1bWFibGVBcnJheShBcnJheSgxMCkpKSB7XG4gICAgICAgICAgaWYgKHByZXNzZWRbX2ldKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5rZXlib2FyZC5nZXRLZXlDb2RlKF9pKSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJlc3MoX2ksIDEpO1xuICAgICAgICAgICAgcHJlc3NlZFtfaV0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGtleWNvZGUgaW4ga2V5cykge1xuICAgICAgICAgIGlmIChwcmVzc2VkW2tleWNvZGVdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgYnV0dG9uSWQgPSBrZXlzW2tleWNvZGVdO1xuXG4gICAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmQuZ2V0S2V5Q29kZShrZXljb2RlKSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJlc3MoYnV0dG9uSWQsIDEpO1xuICAgICAgICAgICAgcHJlc3NlZFtidXR0b25JZF0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZ2FtZXBhZCkge1xuICAgICAgICBmb3IgKHZhciBfaTIgaW4gZ2FtZXBhZC5idXR0b25zKSB7XG4gICAgICAgICAgaWYgKHByZXNzZWRbX2kyXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9idXR0b24gPSBnYW1lcGFkLmJ1dHRvbnNbX2kyXTtcblxuICAgICAgICAgIGlmICghX2J1dHRvbi5wcmVzc2VkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UoX2kyKTtcbiAgICAgICAgICAgIHJlbGVhc2VkW19pMl0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5rZXlib2FyZCkge1xuICAgICAgICBmb3IgKHZhciBfaTMgaW4gX3RvQ29uc3VtYWJsZUFycmF5KEFycmF5KDEwKSkpIHtcbiAgICAgICAgICBpZiAocmVsZWFzZWRbX2kzXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHByZXNzZWRbX2kzXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmQuZ2V0S2V5Q29kZShfaTMpIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKF9pMyk7XG4gICAgICAgICAgICByZWxlYXNlZFtfaTNdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBfa2V5Y29kZSBpbiBrZXlzKSB7XG4gICAgICAgICAgdmFyIF9idXR0b25JZCA9IGtleXNbX2tleWNvZGVdO1xuXG4gICAgICAgICAgaWYgKHJlbGVhc2VkW19idXR0b25JZF0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcmVzc2VkW19idXR0b25JZF0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLmtleWJvYXJkLmdldEtleUNvZGUoX2tleWNvZGUpIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKF9idXR0b25JZCk7XG4gICAgICAgICAgICByZWxlYXNlZFtfa2V5Y29kZV0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdGlsdGVkID0ge307XG5cbiAgICAgIGlmIChnYW1lcGFkKSB7XG4gICAgICAgIGZvciAodmFyIF9pNCBpbiBnYW1lcGFkLmF4ZXMpIHtcbiAgICAgICAgICB2YXIgYXhpcyA9IGdhbWVwYWQuYXhlc1tfaTRdO1xuICAgICAgICAgIHRpbHRlZFtfaTRdID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnRpbHQoX2k0LCBheGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpbnB1dElkIGluIGF4aXNNYXApIHtcbiAgICAgICAgaWYgKCF0aGlzLmJ1dHRvbnNbaW5wdXRJZF0pIHtcbiAgICAgICAgICB0aGlzLmJ1dHRvbnNbaW5wdXRJZF0gPSBuZXcgX0J1dHRvbi5CdXR0b24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfYXhpcyA9IGF4aXNNYXBbaW5wdXRJZF07XG4gICAgICAgIHZhciB2YWx1ZSA9IE1hdGguc2lnbigxIC8gX2F4aXMpO1xuICAgICAgICB2YXIgYXhpc0lkID0gTWF0aC5hYnMoX2F4aXMpO1xuXG4gICAgICAgIGlmICh0aGlzLmJ1dHRvbnNbaW5wdXRJZF0uYWN0aXZlKSB7XG4gICAgICAgICAgdGlsdGVkW2F4aXNJZF0gPSB0cnVlO1xuICAgICAgICAgIHRoaXMudGlsdChheGlzSWQsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGlsdGVkW2F4aXNJZF0pIHtcbiAgICAgICAgICB0aGlzLnRpbHQoYXhpc0lkLCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0aWx0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRpbHQoYXhpc0lkLCBtYWduaXR1ZGUpIHtcbiAgICAgIGlmICghdGhpcy5heGVzW2F4aXNJZF0pIHtcbiAgICAgICAgdGhpcy5heGVzW2F4aXNJZF0gPSBuZXcgX0F4aXMuQXhpcyh7XG4gICAgICAgICAgZGVhZFpvbmU6IHRoaXMuZGVhZFpvbmVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXhlc1theGlzSWRdLnRpbHQobWFnbml0dWRlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicHJlc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJlc3MoYnV0dG9uSWQpIHtcbiAgICAgIHZhciBwcmVzc3VyZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTtcblxuICAgICAgaWYgKCF0aGlzLmJ1dHRvbnNbYnV0dG9uSWRdKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uc1tidXR0b25JZF0gPSBuZXcgX0J1dHRvbi5CdXR0b24oKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idXR0b25zW2J1dHRvbklkXS5wcmVzcyhwcmVzc3VyZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbGVhc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVsZWFzZShidXR0b25JZCkge1xuICAgICAgaWYgKCF0aGlzLmJ1dHRvbnNbYnV0dG9uSWRdKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uc1tidXR0b25JZF0gPSBuZXcgX0J1dHRvbi5CdXR0b24oKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idXR0b25zW2J1dHRvbklkXS5yZWxlYXNlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNlcmlhbGl6ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXJpYWxpemUoKSB7XG4gICAgICB2YXIgYnV0dG9ucyA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBpIGluIHRoaXMuYnV0dG9ucykge1xuICAgICAgICBidXR0b25zW2ldID0gdGhpcy5idXR0b25zW2ldLnByZXNzdXJlO1xuICAgICAgfVxuXG4gICAgICB2YXIgYXhlcyA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBfaTUgaW4gdGhpcy5heGVzKSB7XG4gICAgICAgIGF4ZXNbX2k1XSA9IHRoaXMuYXhlc1tfaTVdLm1hZ25pdHVkZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYXhlczogYXhlcyxcbiAgICAgICAgYnV0dG9uczogYnV0dG9uc1xuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVwbGF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcGxheShpbnB1dCkge1xuICAgICAgaWYgKGlucHV0LmJ1dHRvbnMpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBpbnB1dC5idXR0b25zKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmJ1dHRvbnNbaV0gPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnByZXNzKGksIGlucHV0LmJ1dHRvbnNbaV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UoaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpbnB1dC5heGVzKSB7XG4gICAgICAgIGZvciAodmFyIF9pNiBpbiBpbnB1dC5heGVzKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmF4ZXNbX2k2XS5tYWduaXR1ZGUgIT09IGlucHV0LmF4ZXNbX2k2XSkge1xuICAgICAgICAgICAgdGhpcy50aWx0KF9pNiwgaW5wdXQuYXhlc1tfaTZdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiemVyb1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB6ZXJvKCkge1xuICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmF4ZXMpIHtcbiAgICAgICAgdGhpcy5heGVzW2ldLnplcm8oKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgX2k3IGluIHRoaXMuYnV0dG9ucykge1xuICAgICAgICB0aGlzLmJ1dHRvbnNbX2k3XS56ZXJvKCk7XG4gICAgICB9XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6IFwiZ2V0UGFkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBhZCgpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgX3JlZjIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9LFxuICAgICAgICAgIF9yZWYyJGluZGV4ID0gX3JlZjIuaW5kZXgsXG4gICAgICAgICAgaW5kZXggPSBfcmVmMiRpbmRleCA9PT0gdm9pZCAwID8gdW5kZWZpbmVkIDogX3JlZjIkaW5kZXgsXG4gICAgICAgICAgX3JlZjIkZGVhZFpvbmUgPSBfcmVmMi5kZWFkWm9uZSxcbiAgICAgICAgICBkZWFkWm9uZSA9IF9yZWYyJGRlYWRab25lID09PSB2b2lkIDAgPyAwIDogX3JlZjIkZGVhZFpvbmUsXG4gICAgICAgICAgX3JlZjIka2V5cyA9IF9yZWYyLmtleXMsXG4gICAgICAgICAga2V5cyA9IF9yZWYyJGtleXMgPT09IHZvaWQgMCA/IHt9IDogX3JlZjIka2V5cyxcbiAgICAgICAgICBfcmVmMiRrZXlib2FyZCA9IF9yZWYyLmtleWJvYXJkLFxuICAgICAgICAgIGtleWJvYXJkID0gX3JlZjIka2V5Ym9hcmQgPT09IHZvaWQgMCA/IG51bGwgOiBfcmVmMiRrZXlib2FyZDtcblxuICAgICAgaWYgKHRoaXMucGFkc0Nvbm5lY3RlZC5oYXMoaW5kZXgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhZHNDb25uZWN0ZWQuZ2V0KGluZGV4KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHdhaXRGb3JQYWQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYWNjZXB0KSB7XG4gICAgICAgIHZhciByZWdpc3RlclBhZCA9IGZ1bmN0aW9uIHJlZ2lzdGVyUGFkKGV2ZW50KSB7XG4gICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgdmFyIHBhZCA9IG5ldyBfdGhpczIoe1xuICAgICAgICAgICAgZ2FtZXBhZDogZXZlbnQuZ2FtZXBhZCxcbiAgICAgICAgICAgIGRlYWRab25lOiBkZWFkWm9uZSxcbiAgICAgICAgICAgIGtleXM6IGtleXMsXG4gICAgICAgICAgICBrZXlib2FyZDoga2V5Ym9hcmRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIF90aGlzMi5wYWRzQ29ubmVjdGVkLnNldChldmVudC5nYW1lcGFkLmluZGV4LCB3YWl0Rm9yUGFkKTtcblxuICAgICAgICAgIGFjY2VwdChwYWQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ2dhbWVwYWRjb25uZWN0ZWQnLCByZWdpc3RlclBhZCwge1xuICAgICAgICAgIG9uY2U6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB3YWl0Rm9yUGFkO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBHYW1lcGFkO1xufShfTWl4aW4uTWl4aW5bXCJ3aXRoXCJdKF9FdmVudFRhcmdldE1peGluLkV2ZW50VGFyZ2V0TWl4aW4pKTtcblxuZXhwb3J0cy5HYW1lcGFkID0gR2FtZXBhZDtcblxuX2RlZmluZVByb3BlcnR5KEdhbWVwYWQsIFwicGFkc0Nvbm5lY3RlZFwiLCBuZXcgTWFwKCkpO1xuXG5fZGVmaW5lUHJvcGVydHkoR2FtZXBhZCwgXCJwYWRzUmVhZFwiLCBuZXcgTWFwKCkpO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL2lucHV0L0tleWJvYXJkLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5LZXlib2FyZCA9IHZvaWQgMDtcblxudmFyIF9CaW5kYWJsZSA9IHJlcXVpcmUoXCIuLi9iYXNlL0JpbmRhYmxlXCIpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBLZXlib2FyZCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEtleWJvYXJkKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgS2V5Ym9hcmQpO1xuXG4gICAgdGhpcy5tYXhEZWNheSA9IDEyMDtcbiAgICB0aGlzLmNvbWJvVGltZSA9IDUwMDtcbiAgICB0aGlzLmxpc3RlbmluZyA9IGZhbHNlO1xuICAgIHRoaXMuZm9jdXNFbGVtZW50ID0gZG9jdW1lbnQuYm9keTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2NvbWJvJywge1xuICAgICAgdmFsdWU6IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlKFtdKVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnd2hpY2hzJywge1xuICAgICAgdmFsdWU6IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlKHt9KVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY29kZXMnLCB7XG4gICAgICB2YWx1ZTogX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2Uoe30pXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdrZXlzJywge1xuICAgICAgdmFsdWU6IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlKHt9KVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncHJlc3NlZFdoaWNoJywge1xuICAgICAgdmFsdWU6IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlKHt9KVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncHJlc3NlZENvZGUnLCB7XG4gICAgICB2YWx1ZTogX0JpbmRhYmxlLkJpbmRhYmxlLm1ha2Uoe30pXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdwcmVzc2VkS2V5Jywge1xuICAgICAgdmFsdWU6IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlKHt9KVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncmVsZWFzZWRXaGljaCcsIHtcbiAgICAgIHZhbHVlOiBfQmluZGFibGUuQmluZGFibGUubWFrZSh7fSlcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JlbGVhc2VkQ29kZScsIHtcbiAgICAgIHZhbHVlOiBfQmluZGFibGUuQmluZGFibGUubWFrZSh7fSlcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JlbGVhc2VkS2V5Jywge1xuICAgICAgdmFsdWU6IF9CaW5kYWJsZS5CaW5kYWJsZS5tYWtlKHt9KVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAna2V5UmVmcycsIHtcbiAgICAgIHZhbHVlOiBfQmluZGFibGUuQmluZGFibGUubWFrZSh7fSlcbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKCFfdGhpcy5saXN0ZW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMuZm9jdXNFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IF90aGlzLmZvY3VzRWxlbWVudCAmJiAoIV90aGlzLmZvY3VzRWxlbWVudC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB8fCBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm1hdGNoZXMoJ2lucHV0LHRleHRhcmVhJykpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIF90aGlzLnJlbGVhc2VkV2hpY2hbZXZlbnQud2hpY2hdID0gRGF0ZS5ub3coKTtcbiAgICAgIF90aGlzLnJlbGVhc2VkQ29kZVtldmVudC5jb2RlXSA9IERhdGUubm93KCk7XG4gICAgICBfdGhpcy5yZWxlYXNlZEtleVtldmVudC5rZXldID0gRGF0ZS5ub3coKTtcbiAgICAgIF90aGlzLndoaWNoc1tldmVudC53aGljaF0gPSAtMTtcbiAgICAgIF90aGlzLmNvZGVzW2V2ZW50LmNvZGVdID0gLTE7XG4gICAgICBfdGhpcy5rZXlzW2V2ZW50LmtleV0gPSAtMTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoIV90aGlzLmxpc3RlbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5mb2N1c0VsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gX3RoaXMuZm9jdXNFbGVtZW50ICYmICghX3RoaXMuZm9jdXNFbGVtZW50LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubWF0Y2hlcygnaW5wdXQsdGV4dGFyZWEnKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoZXZlbnQucmVwZWF0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuY29tYm8ucHVzaChldmVudC5jb2RlKTtcblxuICAgICAgY2xlYXJUaW1lb3V0KF90aGlzLmNvbWJvVGltZXIpO1xuICAgICAgX3RoaXMuY29tYm9UaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuY29tYm8uc3BsaWNlKDApO1xuICAgICAgfSwgX3RoaXMuY29tYm9UaW1lKTtcbiAgICAgIF90aGlzLnByZXNzZWRXaGljaFtldmVudC53aGljaF0gPSBEYXRlLm5vdygpO1xuICAgICAgX3RoaXMucHJlc3NlZENvZGVbZXZlbnQuY29kZV0gPSBEYXRlLm5vdygpO1xuICAgICAgX3RoaXMucHJlc3NlZEtleVtldmVudC5rZXldID0gRGF0ZS5ub3coKTtcblxuICAgICAgaWYgKF90aGlzLmtleXNbZXZlbnQua2V5XSA+IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy53aGljaHNbZXZlbnQud2hpY2hdID0gMTtcbiAgICAgIF90aGlzLmNvZGVzW2V2ZW50LmNvZGVdID0gMTtcbiAgICAgIF90aGlzLmtleXNbZXZlbnQua2V5XSA9IDE7XG4gICAgfSk7XG5cbiAgICB2YXIgd2luZG93Qmx1ciA9IGZ1bmN0aW9uIHdpbmRvd0JsdXIoZXZlbnQpIHtcbiAgICAgIGZvciAodmFyIGkgaW4gX3RoaXMua2V5cykge1xuICAgICAgICBpZiAoX3RoaXMua2V5c1tpXSA8IDApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLnJlbGVhc2VkS2V5W2ldID0gRGF0ZS5ub3coKTtcbiAgICAgICAgX3RoaXMua2V5c1tpXSA9IC0xO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaSBpbiBfdGhpcy5jb2Rlcykge1xuICAgICAgICBpZiAoX3RoaXMuY29kZXNbX2ldIDwgMCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMucmVsZWFzZWRDb2RlW19pXSA9IERhdGUubm93KCk7XG4gICAgICAgIF90aGlzLmNvZGVzW19pXSA9IC0xO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaTIgaW4gX3RoaXMud2hpY2hzKSB7XG4gICAgICAgIGlmIChfdGhpcy53aGljaHNbX2kyXSA8IDApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLnJlbGVhc2VkV2hpY2hbX2kyXSA9IERhdGUubm93KCk7XG4gICAgICAgIF90aGlzLndoaWNoc1tfaTJdID0gLTE7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgd2luZG93Qmx1cik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB3aW5kb3dCbHVyKCk7XG4gICAgfSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoS2V5Ym9hcmQsIFt7XG4gICAga2V5OiBcImdldEtleVJlZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRLZXlSZWYoa2V5Q29kZSkge1xuICAgICAgdmFyIGtleVJlZiA9IHRoaXMua2V5UmVmc1trZXlDb2RlXSA9IHRoaXMua2V5UmVmc1trZXlDb2RlXSB8fCBfQmluZGFibGUuQmluZGFibGUubWFrZSh7fSk7XG5cbiAgICAgIHJldHVybiBrZXlSZWY7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEtleVRpbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0S2V5VGltZShrZXkpIHtcbiAgICAgIHZhciByZWxlYXNlZCA9IHRoaXMucmVsZWFzZWRLZXlba2V5XTtcbiAgICAgIHZhciBwcmVzc2VkID0gdGhpcy5wcmVzc2VkS2V5W2tleV07XG5cbiAgICAgIGlmICghcHJlc3NlZCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZWxlYXNlZCB8fCByZWxlYXNlZCA8IHByZXNzZWQpIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBwcmVzc2VkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKERhdGUubm93KCkgLSByZWxlYXNlZCkgKiAtMTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0Q29kZVRpbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q29kZVRpbWUoY29kZSkge1xuICAgICAgdmFyIHJlbGVhc2VkID0gdGhpcy5yZWxlYXNlZENvZGVbY29kZV07XG4gICAgICB2YXIgcHJlc3NlZCA9IHRoaXMucHJlc3NlZENvZGVbY29kZV07XG5cbiAgICAgIGlmICghcHJlc3NlZCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZWxlYXNlZCB8fCByZWxlYXNlZCA8IHByZXNzZWQpIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBwcmVzc2VkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKERhdGUubm93KCkgLSByZWxlYXNlZCkgKiAtMTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0V2hpY2hUaW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFdoaWNoVGltZShjb2RlKSB7XG4gICAgICB2YXIgcmVsZWFzZWQgPSB0aGlzLnJlbGVhc2VkV2hpY2hbY29kZV07XG4gICAgICB2YXIgcHJlc3NlZCA9IHRoaXMucHJlc3NlZFdoaWNoW2NvZGVdO1xuXG4gICAgICBpZiAoIXByZXNzZWQpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVsZWFzZWQgfHwgcmVsZWFzZWQgPCBwcmVzc2VkKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gcHJlc3NlZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChEYXRlLm5vdygpIC0gcmVsZWFzZWQpICogLTE7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEtleVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRLZXkoa2V5KSB7XG4gICAgICBpZiAoIXRoaXMua2V5c1trZXldKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5rZXlzW2tleV07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEtleUNvZGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0S2V5Q29kZShjb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuY29kZXNbY29kZV0pIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvZGVzW2NvZGVdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXNldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5rZXlzKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmtleXNbaV07XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5jb2Rlcykge1xuICAgICAgICBkZWxldGUgdGhpcy5jb2Rlc1tpXTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLndoaWNocykge1xuICAgICAgICBkZWxldGUgdGhpcy53aGljaHNbaV07XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICBmb3IgKHZhciBpIGluIHRoaXMua2V5cykge1xuICAgICAgICBpZiAodGhpcy5rZXlzW2ldID4gMCkge1xuICAgICAgICAgIHRoaXMua2V5c1tpXSsrO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMua2V5c1tpXSA+IC10aGlzLm1heERlY2F5KSB7XG4gICAgICAgICAgdGhpcy5rZXlzW2ldLS07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMua2V5c1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpIGluIHRoaXMuY29kZXMpIHtcbiAgICAgICAgdmFyIHJlbGVhc2VkID0gdGhpcy5yZWxlYXNlZENvZGVbaV07XG4gICAgICAgIHZhciBwcmVzc2VkID0gdGhpcy5wcmVzc2VkQ29kZVtpXTtcbiAgICAgICAgdmFyIGtleVJlZiA9IHRoaXMuZ2V0S2V5UmVmKGkpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvZGVzW2ldID4gMCkge1xuICAgICAgICAgIGtleVJlZi5mcmFtZXMgPSB0aGlzLmNvZGVzW2ldKys7XG4gICAgICAgICAga2V5UmVmLnRpbWUgPSBwcmVzc2VkID8gRGF0ZS5ub3coKSAtIHByZXNzZWQgOiAwO1xuICAgICAgICAgIGtleVJlZi5kb3duID0gdHJ1ZTtcblxuICAgICAgICAgIGlmICghcmVsZWFzZWQgfHwgcmVsZWFzZWQgPCBwcmVzc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIChEYXRlLm5vdygpIC0gcmVsZWFzZWQpICogLTE7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb2Rlc1tpXSA+IC10aGlzLm1heERlY2F5KSB7XG4gICAgICAgICAga2V5UmVmLmZyYW1lcyA9IHRoaXMuY29kZXNbaV0tLTtcbiAgICAgICAgICBrZXlSZWYudGltZSA9IHJlbGVhc2VkIC0gRGF0ZS5ub3coKTtcbiAgICAgICAgICBrZXlSZWYuZG93biA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGtleVJlZi5mcmFtZXMgPSAwO1xuICAgICAgICAgIGtleVJlZi50aW1lID0gMDtcbiAgICAgICAgICBrZXlSZWYuZG93biA9IGZhbHNlO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvZGVzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgaW4gdGhpcy53aGljaHMpIHtcbiAgICAgICAgaWYgKHRoaXMud2hpY2hzW2ldID4gMCkge1xuICAgICAgICAgIHRoaXMud2hpY2hzW2ldKys7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy53aGljaHNbaV0gPiAtdGhpcy5tYXhEZWNheSkge1xuICAgICAgICAgIHRoaXMud2hpY2hzW2ldLS07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMud2hpY2hzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6IFwiZ2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlID0gdGhpcy5pbnN0YW5jZSB8fCBfQmluZGFibGUuQmluZGFibGUubWFrZShuZXcgdGhpcygpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gS2V5Ym9hcmQ7XG59KCk7XG5cbmV4cG9ydHMuS2V5Ym9hcmQgPSBLZXlib2FyZDtcbiAgfSkoKTtcbn0pOyIsIlxucmVxdWlyZS5yZWdpc3RlcihcImN1cnZhdHVyZS9taXhpbi9FdmVudFRhcmdldE1peGluLmpzXCIsIGZ1bmN0aW9uKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSkge1xuICByZXF1aXJlID0gX19tYWtlUmVsYXRpdmVSZXF1aXJlKHJlcXVpcmUsIHt9LCBcImN1cnZhdHVyZVwiKTtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5FdmVudFRhcmdldE1peGluID0gdm9pZCAwO1xuXG52YXIgX01peGluID0gcmVxdWlyZShcIi4uL2Jhc2UvTWl4aW5cIik7XG5cbnZhciBfRXZlbnRUYXJnZXRNaXhpbjtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIF9FdmVudFRhcmdldCA9IFN5bWJvbCgnVGFyZ2V0Jyk7XG5cbnZhciBFdmVudFRhcmdldE1peGluID0gKF9FdmVudFRhcmdldE1peGluID0ge30sIF9kZWZpbmVQcm9wZXJ0eShfRXZlbnRUYXJnZXRNaXhpbiwgX01peGluLk1peGluLkNvbnN0cnVjdG9yLCBmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgdGhpc1tfRXZlbnRUYXJnZXRdID0gbmV3IEV2ZW50VGFyZ2V0KCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhpc1tfRXZlbnRUYXJnZXRdID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICB9XG59KSwgX2RlZmluZVByb3BlcnR5KF9FdmVudFRhcmdldE1peGluLCBcImRpc3BhdGNoRXZlbnRcIiwgZnVuY3Rpb24gZGlzcGF0Y2hFdmVudCgpIHtcbiAgdmFyIF90aGlzJF9FdmVudFRhcmdldDtcblxuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIGV2ZW50ID0gYXJnc1swXTtcblxuICBpZiAodHlwZW9mIGV2ZW50ID09PSAnc3RyaW5nJykge1xuICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50KTtcbiAgICBhcmdzWzBdID0gZXZlbnQ7XG4gIH1cblxuICAoX3RoaXMkX0V2ZW50VGFyZ2V0ID0gdGhpc1tfRXZlbnRUYXJnZXRdKS5kaXNwYXRjaEV2ZW50LmFwcGx5KF90aGlzJF9FdmVudFRhcmdldCwgYXJncyk7XG5cbiAgdmFyIGRlZmF1bHRIYW5kbGVyID0gXCJvblwiLmNvbmNhdChldmVudC50eXBlWzBdLnRvVXBwZXJDYXNlKCkgKyBldmVudC50eXBlLnNsaWNlKDEpKTtcblxuICBpZiAodHlwZW9mIHRoaXNbZGVmYXVsdEhhbmRsZXJdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpc1tkZWZhdWx0SGFuZGxlcl0oZXZlbnQpO1xuICB9XG5cbiAgcmV0dXJuIGV2ZW50LnJldHVyblZhbHVlO1xufSksIF9kZWZpbmVQcm9wZXJ0eShfRXZlbnRUYXJnZXRNaXhpbiwgXCJhZGRFdmVudExpc3RlbmVyXCIsIGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIoKSB7XG4gIHZhciBfdGhpcyRfRXZlbnRUYXJnZXQyO1xuXG4gIChfdGhpcyRfRXZlbnRUYXJnZXQyID0gdGhpc1tfRXZlbnRUYXJnZXRdKS5hZGRFdmVudExpc3RlbmVyLmFwcGx5KF90aGlzJF9FdmVudFRhcmdldDIsIGFyZ3VtZW50cyk7XG59KSwgX2RlZmluZVByb3BlcnR5KF9FdmVudFRhcmdldE1peGluLCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIiwgZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHtcbiAgdmFyIF90aGlzJF9FdmVudFRhcmdldDM7XG5cbiAgKF90aGlzJF9FdmVudFRhcmdldDMgPSB0aGlzW19FdmVudFRhcmdldF0pLnJlbW92ZUV2ZW50TGlzdGVuZXIuYXBwbHkoX3RoaXMkX0V2ZW50VGFyZ2V0MywgYXJndW1lbnRzKTtcbn0pLCBfRXZlbnRUYXJnZXRNaXhpbik7XG5leHBvcnRzLkV2ZW50VGFyZ2V0TWl4aW4gPSBFdmVudFRhcmdldE1peGluO1xuICB9KSgpO1xufSk7IiwiXG5yZXF1aXJlLnJlZ2lzdGVyKFwiY3VydmF0dXJlL21peGluL1Byb21pc2VNaXhpbi5qc1wiLCBmdW5jdGlvbihleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUpIHtcbiAgcmVxdWlyZSA9IF9fbWFrZVJlbGF0aXZlUmVxdWlyZShyZXF1aXJlLCB7fSwgXCJjdXJ2YXR1cmVcIik7XG4gIChmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuUHJvbWlzZU1peGluID0gdm9pZCAwO1xuXG52YXIgX01peGluID0gcmVxdWlyZShcIi4uL2Jhc2UvTWl4aW5cIik7XG5cbnZhciBfUHJvbWlzZU1peGluO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgX1Byb21pc2UgPSBTeW1ib2woJ1Byb21pc2UnKTtcblxudmFyIEFjY2VwdCA9IFN5bWJvbCgnQWNjZXB0Jyk7XG52YXIgUmVqZWN0ID0gU3ltYm9sKCdSZWplY3QnKTtcbnZhciBQcm9taXNlTWl4aW4gPSAoX1Byb21pc2VNaXhpbiA9IHt9LCBfZGVmaW5lUHJvcGVydHkoX1Byb21pc2VNaXhpbiwgX01peGluLk1peGluLkNvbnN0cnVjdG9yLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgdGhpc1tfUHJvbWlzZV0gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYWNjZXB0LCByZWplY3QpIHtcbiAgICBfdGhpc1tBY2NlcHRdID0gYWNjZXB0O1xuICAgIF90aGlzW1JlamVjdF0gPSByZWplY3Q7XG4gIH0pO1xufSksIF9kZWZpbmVQcm9wZXJ0eShfUHJvbWlzZU1peGluLCBcInRoZW5cIiwgZnVuY3Rpb24gdGhlbigpIHtcbiAgdmFyIF90aGlzJF9Qcm9taXNlO1xuXG4gIHJldHVybiAoX3RoaXMkX1Byb21pc2UgPSB0aGlzW19Qcm9taXNlXSkudGhlbi5hcHBseShfdGhpcyRfUHJvbWlzZSwgYXJndW1lbnRzKTtcbn0pLCBfZGVmaW5lUHJvcGVydHkoX1Byb21pc2VNaXhpbiwgXCJjYXRjaFwiLCBmdW5jdGlvbiBfY2F0Y2goKSB7XG4gIHZhciBfdGhpcyRfUHJvbWlzZTI7XG5cbiAgcmV0dXJuIChfdGhpcyRfUHJvbWlzZTIgPSB0aGlzW19Qcm9taXNlXSlbXCJjYXRjaFwiXS5hcHBseShfdGhpcyRfUHJvbWlzZTIsIGFyZ3VtZW50cyk7XG59KSwgX2RlZmluZVByb3BlcnR5KF9Qcm9taXNlTWl4aW4sIFwiZmluYWxseVwiLCBmdW5jdGlvbiBfZmluYWxseSgpIHtcbiAgdmFyIF90aGlzJF9Qcm9taXNlMztcblxuICByZXR1cm4gKF90aGlzJF9Qcm9taXNlMyA9IHRoaXNbX1Byb21pc2VdKVtcImZpbmFsbHlcIl0uYXBwbHkoX3RoaXMkX1Byb21pc2UzLCBhcmd1bWVudHMpO1xufSksIF9Qcm9taXNlTWl4aW4pO1xuZXhwb3J0cy5Qcm9taXNlTWl4aW4gPSBQcm9taXNlTWl4aW47XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvbWlzZU1peGluLCAnUmVqZWN0Jywge1xuICB2YWx1ZTogUmVqZWN0XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9taXNlTWl4aW4sICdBY2NlcHQnLCB7XG4gIHZhbHVlOiBBY2NlcHRcbn0pO1xuICB9KSgpO1xufSk7IiwiLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuKGZ1bmN0aW9uKCkge1xuICB2YXIgV2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldCB8fCB3aW5kb3cuTW96V2ViU29ja2V0O1xuICB2YXIgYnIgPSB3aW5kb3cuYnJ1bmNoID0gKHdpbmRvdy5icnVuY2ggfHwge30pO1xuICB2YXIgYXIgPSBiclsnYXV0by1yZWxvYWQnXSA9IChiclsnYXV0by1yZWxvYWQnXSB8fCB7fSk7XG4gIGlmICghV2ViU29ja2V0IHx8IGFyLmRpc2FibGVkKSByZXR1cm47XG4gIGlmICh3aW5kb3cuX2FyKSByZXR1cm47XG4gIHdpbmRvdy5fYXIgPSB0cnVlO1xuXG4gIHZhciBjYWNoZUJ1c3RlciA9IGZ1bmN0aW9uKHVybCl7XG4gICAgdmFyIGRhdGUgPSBNYXRoLnJvdW5kKERhdGUubm93KCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgIHVybCA9IHVybC5yZXBsYWNlKC8oXFwmfFxcXFw/KWNhY2hlQnVzdGVyPVxcZCovLCAnJyk7XG4gICAgcmV0dXJuIHVybCArICh1cmwuaW5kZXhPZignPycpID49IDAgPyAnJicgOiAnPycpICsnY2FjaGVCdXN0ZXI9JyArIGRhdGU7XG4gIH07XG5cbiAgdmFyIGJyb3dzZXIgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gIHZhciBmb3JjZVJlcGFpbnQgPSBhci5mb3JjZVJlcGFpbnQgfHwgYnJvd3Nlci5pbmRleE9mKCdjaHJvbWUnKSA+IC0xO1xuXG4gIHZhciByZWxvYWRlcnMgPSB7XG4gICAgcGFnZTogZnVuY3Rpb24oKXtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gICAgfSxcblxuICAgIHN0eWxlc2hlZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICBbXS5zbGljZVxuICAgICAgICAuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1zdHlsZXNoZWV0XScpKVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGxpbmspIHtcbiAgICAgICAgICB2YXIgdmFsID0gbGluay5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0b3JlbG9hZCcpO1xuICAgICAgICAgIHJldHVybiBsaW5rLmhyZWYgJiYgdmFsICE9ICdmYWxzZSc7XG4gICAgICAgIH0pXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGxpbmspIHtcbiAgICAgICAgICBsaW5rLmhyZWYgPSBjYWNoZUJ1c3RlcihsaW5rLmhyZWYpO1xuICAgICAgICB9KTtcblxuICAgICAgLy8gSGFjayB0byBmb3JjZSBwYWdlIHJlcGFpbnQgYWZ0ZXIgMjVtcy5cbiAgICAgIGlmIChmb3JjZVJlcGFpbnQpIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0OyB9LCAyNSk7XG4gICAgfSxcblxuICAgIGphdmFzY3JpcHQ6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgc2NyaXB0cyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0JykpO1xuICAgICAgdmFyIHRleHRTY3JpcHRzID0gc2NyaXB0cy5tYXAoZnVuY3Rpb24oc2NyaXB0KSB7IHJldHVybiBzY3JpcHQudGV4dCB9KS5maWx0ZXIoZnVuY3Rpb24odGV4dCkgeyByZXR1cm4gdGV4dC5sZW5ndGggPiAwIH0pO1xuICAgICAgdmFyIHNyY1NjcmlwdHMgPSBzY3JpcHRzLmZpbHRlcihmdW5jdGlvbihzY3JpcHQpIHsgcmV0dXJuIHNjcmlwdC5zcmMgfSk7XG5cbiAgICAgIHZhciBsb2FkZWQgPSAwO1xuICAgICAgdmFyIGFsbCA9IHNyY1NjcmlwdHMubGVuZ3RoO1xuICAgICAgdmFyIG9uTG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2FkZWQgPSBsb2FkZWQgKyAxO1xuICAgICAgICBpZiAobG9hZGVkID09PSBhbGwpIHtcbiAgICAgICAgICB0ZXh0U2NyaXB0cy5mb3JFYWNoKGZ1bmN0aW9uKHNjcmlwdCkgeyBldmFsKHNjcmlwdCk7IH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNyY1NjcmlwdHNcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24oc2NyaXB0KSB7XG4gICAgICAgICAgdmFyIHNyYyA9IHNjcmlwdC5zcmM7XG4gICAgICAgICAgc2NyaXB0LnJlbW92ZSgpO1xuICAgICAgICAgIHZhciBuZXdTY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICBuZXdTY3JpcHQuc3JjID0gY2FjaGVCdXN0ZXIoc3JjKTtcbiAgICAgICAgICBuZXdTY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgICAgIG5ld1NjcmlwdC5vbmxvYWQgPSBvbkxvYWQ7XG4gICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChuZXdTY3JpcHQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH07XG4gIHZhciBwb3J0ID0gYXIucG9ydCB8fCA5NDg1O1xuICB2YXIgaG9zdCA9IGJyLnNlcnZlciB8fCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfHwgJ2xvY2FsaG9zdCc7XG5cbiAgdmFyIGNvbm5lY3QgPSBmdW5jdGlvbigpe1xuICAgIHZhciBjb25uZWN0aW9uID0gbmV3IFdlYlNvY2tldCgnd3M6Ly8nICsgaG9zdCArICc6JyArIHBvcnQpO1xuICAgIGNvbm5lY3Rpb24ub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgaWYgKGFyLmRpc2FibGVkKSByZXR1cm47XG4gICAgICB2YXIgbWVzc2FnZSA9IGV2ZW50LmRhdGE7XG4gICAgICB2YXIgcmVsb2FkZXIgPSByZWxvYWRlcnNbbWVzc2FnZV0gfHwgcmVsb2FkZXJzLnBhZ2U7XG4gICAgICByZWxvYWRlcigpO1xuICAgIH07XG4gICAgY29ubmVjdGlvbi5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgIGlmIChjb25uZWN0aW9uLnJlYWR5U3RhdGUpIGNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB9O1xuICAgIGNvbm5lY3Rpb24ub25jbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChjb25uZWN0LCAxMDAwKTtcbiAgICB9O1xuICB9O1xuICBjb25uZWN0KCk7XG59KSgpO1xuLyoganNoaW50IGlnbm9yZTplbmQgKi9cbiJdfQ==