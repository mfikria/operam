var operam =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.datatype = {
	    map: __webpack_require__(1),
	    string: __webpack_require__(10)
	};

	exports.core = {
	    Workspace: __webpack_require__(14),
	    WorkspaceManager: __webpack_require__(16),
	    OperationBundle: __webpack_require__(24)
	};

	exports.connection = {
	    AbstractConnector: __webpack_require__(28),
	    SocketConnector: __webpack_require__(29)
	};

	exports.ModelManager = __webpack_require__(31);
	exports.TextareaBinder = __webpack_require__(37);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var MapType = __webpack_require__(2);
	var MapDelta = __webpack_require__(9);

	exports.MapType = MapType;
	exports.newType = function (options) {
	  return new MapType(options);
	};

	exports.MapDelta = MapDelta;
	exports.delta = function () {
	  return new MapDelta();
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTType = __webpack_require__(3);

	var OperationIterator = __webpack_require__(5);
	var OperationSequence = __webpack_require__(6);
	var ops = __webpack_require__(7);

	function keyComparator(a, b) {
	  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
	}

	var MapType = function (_OTType) {
	  _inherits(MapType, _OTType);

	  function MapType() {
	    _classCallCheck(this, MapType);

	    return _possibleConstructorReturn(this, (MapType.__proto__ || Object.getPrototypeOf(MapType)).apply(this, arguments));
	  }

	  _createClass(MapType, [{
	    key: 'compose',
	    value: function compose(left, right) {
	      var it1 = new OperationIterator(left, keyComparator);
	      var it2 = new OperationIterator(right, keyComparator);

	      var result = [];

	      while (it1.hasNext) {
	        var op1 = it1.next();

	        var handled = false;

	        while (it2.hasNext) {
	          var op2 = it2.next();

	          var compared = keyComparator(op1, op2);
	          if (compared > 0) {
	            result.push(op2);
	            continue;
	          } else if (compared < 0) {
	            it2.back();
	          } else {
	            if (op1 instanceof ops.Set && op2 instanceof ops.Set) {
	              it1.replace(new ops.Set(op1.key, op1.oldValue, op2.newValue));
	            }

	            handled = true;
	          }
	          break;
	        }

	        if (!handled) {
	          result.push(op1);
	        }
	      }

	      while (it2.hasNext) {
	        result.push(it2.next());
	      }

	      result.sort(keyComparator);
	      return new OperationSequence(result);
	    }
	  }, {
	    key: 'transform',
	    value: function transform(left, right) {
	      var it1 = new OperationIterator(left, keyComparator);
	      var it2 = new OperationIterator(right, keyComparator);

	      var deltaLeft = [];
	      var deltaRight = [];

	      while (it1.hasNext) {
	        var op1 = it1.next();

	        var handled = false;

	        while (it2.hasNext) {
	          var op2 = it2.next();

	          var compared = keyComparator(op1, op2);
	          if (compared > 0) {
	            deltaRight.push(op2);
	            continue;
	          } else if (compared < 0) {
	            it2.back();
	          } else {
	            if (op1 instanceof ops.Set && op2 instanceof ops.Set) {
	              deltaRight.push(new ops.Set(op1.key, op1.newValue, op2.newValue));
	            }

	            handled = true;
	          }

	          break;
	        }

	        if (!handled) {
	          deltaLeft.push(op1);
	        }
	      }

	      while (it2.hasNext) {
	        deltaRight.push(it2.next());
	      }

	      deltaLeft.sort(keyComparator);
	      deltaRight.sort(keyComparator);
	      return {
	        left: new OperationSequence(deltaLeft),
	        right: new OperationSequence(deltaRight)
	      };
	    }
	  }, {
	    key: 'serializeObject',
	    value: function serializeObject(op) {
	      var result = [];
	      OperationSequence.asArray(op).forEach(function (subOp) {
	        if (subOp instanceof ops.Set) {
	          result.push(['set', {
	            key: subOp.key,
	            oldValue: subOp.oldValue,
	            newValue: subOp.newValue
	          }]);
	        } else {
	          throw new Error('Unsupported operation: ' + subOp);
	        }
	      });

	      return result;
	    }
	  }, {
	    key: 'deserializeObject',
	    value: function deserializeObject(json) {
	      var result = [];

	      json.forEach(function (data) {
	        switch (data[0]) {
	          case 'set':
	            var op = data[1];
	            result.push(new ops.Set(op.key, op.oldValue || null, op.newValue || null));
	            break;
	          default:
	            throw new Error('Unsupported type of operation: ' + data[0]);
	        }
	      });

	      return new OperationSequence(result);
	    }
	  }]);

	  return MapType;
	}(OTType);

	module.exports = MapType;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OperationComposer = __webpack_require__(4);

	var OTType = function () {
	  function OTType() {
	    _classCallCheck(this, OTType);
	  }

	  _createClass(OTType, [{
	    key: 'newOperationComposer',
	    value: function newOperationComposer() {
	      return new OperationComposer(this);
	    }
	  }]);

	  return OTType;
	}();

	module.exports = OTType;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OperationComposer = function () {
	  function OperationComposer(type) {
	    _classCallCheck(this, OperationComposer);

	    this.dataType = type;
	  }

	  _createClass(OperationComposer, [{
	    key: "add",
	    value: function add(op) {
	      if (this.result) {
	        this.result = this.dataType.compose(this.result, op);
	      } else {
	        this.result = op;
	      }

	      return this;
	    }
	  }, {
	    key: "done",
	    value: function done() {
	      return this.result;
	    }
	  }]);

	  return OperationComposer;
	}();

	module.exports = OperationComposer;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OperationSequence = __webpack_require__(6);

	var OperationIterator = function () {
	  function OperationIterator(op, comparator) {
	    _classCallCheck(this, OperationIterator);

	    var ops = OperationSequence.asArray(op);
	    if (comparator) {
	      ops.sort(comparator);
	    }

	    this.index = 0;
	    this.ops = ops;
	  }

	  _createClass(OperationIterator, [{
	    key: 'next',
	    value: function next() {
	      if (this.index >= this.ops.length) {
	        throw 'No more operations available';
	      }

	      var result = this.ops[this.index];
	      this.index++;
	      return result;
	    }
	  }, {
	    key: 'back',
	    value: function back() {
	      if (this.index === 0) {
	        throw 'Can not go back, iteration not started';
	      }

	      this.index--;
	    }
	  }, {
	    key: 'replace',
	    value: function replace(op) {
	      if (this.index === 0) {
	        throw 'Can not replace, iteration not started';
	      }

	      this.index--;
	      this.ops[this.index] = op;
	    }
	  }, {
	    key: 'hasNext',
	    get: function get() {
	      return this.index < this.ops.length;
	    }
	  }]);

	  return OperationIterator;
	}();

	module.exports = OperationIterator;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OperationSequence = function () {
	  function OperationSequence(ops) {
	    _classCallCheck(this, OperationSequence);

	    this.ops = ops;
	  }

	  _createClass(OperationSequence, [{
	    key: 'apply',
	    value: function apply(handler) {
	      this.ops.forEach(function (op) {
	        return op.apply(handler);
	      });
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return 'OperationSequence[' + this.ops + ']';
	    }
	  }, {
	    key: 'operations',
	    get: function get() {
	      return this.ops;
	    },
	    set: function set(ops) {
	      throw 'Can not set operations';
	    }
	  }], [{
	    key: 'asArray',
	    value: function asArray(op) {
	      if (op instanceof OperationSequence) {
	        return op.operations.slice(0);
	      } else if (op && op.apply) {
	        return [op];
	      }
	      throw new Error('No valid operation specified: ' + op);
	    }
	  }]);

	  return OperationSequence;
	}();

	module.exports = OperationSequence;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTOperation = __webpack_require__(8);

	var Set = function (_OTOperation) {
	  _inherits(Set, _OTOperation);

	  function Set(key, oldValue, newValue) {
	    _classCallCheck(this, Set);

	    var _this = _possibleConstructorReturn(this, (Set.__proto__ || Object.getPrototypeOf(Set)).call(this));

	    _this.key = key;
	    _this.oldValue = oldValue;
	    _this.newValue = newValue;
	    return _this;
	  }

	  _createClass(Set, [{
	    key: 'apply',
	    value: function apply(handler) {
	      if (this.newValue === null) {
	        handler.remove(this.key, this.oldValue);
	      } else {
	        handler.set(this.key, this.oldValue, this.newValue);
	      }
	    }
	  }, {
	    key: 'invert',
	    value: function invert() {
	      return new Set(this.key, this.newValue, this.oldValue);
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return 'Set{key=' + this.key + ', oldValue=' + this.oldValue + ', newValue=' + this.newValue + '}';
	    }
	  }]);

	  return Set;
	}(OTOperation);

	exports.Set = Set;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OTOperation = function () {
	  function OTOperation() {
	    _classCallCheck(this, OTOperation);
	  }

	  _createClass(OTOperation, [{
	    key: 'apply',
	    value: function apply() {
	      throw new Error('Not implemented');
	    }
	  }, {
	    key: 'invert',
	    value: function invert() {
	      throw new Error('Not implemented');
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      throw new Error('Not implemented');
	    }
	  }]);

	  return OTOperation;
	}();

	module.exports = OTOperation;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ops = __webpack_require__(7);
	var OperationSequence = __webpack_require__(6);

	var MapDelta = function () {
	  function MapDelta() {
	    _classCallCheck(this, MapDelta);

	    this.values = {};
	  }

	  _createClass(MapDelta, [{
	    key: 'set',
	    value: function set(key, currentValue, newValue) {
	      var current = this.values[key];
	      if (current) {
	        if (current.newValue !== currentValue) {
	          throw new Error('newValue of previous set does not match currentValue of this set');
	        }

	        current.newValue = newValue;
	      } else {
	        this.values[key] = {
	          oldValue: currentValue,
	          newValue: newValue
	        };
	      }

	      return this;
	    }
	  }, {
	    key: 'remove',
	    value: function remove(key, currentValue) {
	      return this.set(key, currentValue, null);
	    }
	  }, {
	    key: 'done',
	    value: function done() {
	      var result = [];

	      for (var key in this.values) {
	        if (!this.values.hasOwnProperty(key)) continue;

	        var value = this.values[key];
	        result.push(new ops.Set(key, value.oldValue, value.newValue));
	      }

	      return new OperationSequence(result);
	    }
	  }]);

	  return MapDelta;
	}();

	module.exports = MapDelta;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var StringType = __webpack_require__(11);
	var StringDelta = __webpack_require__(12);

	exports.StringType = StringType;
	exports.newType = function (options) {
	  return new StringType(options);
	};

	exports.StringDelta = StringDelta;
	exports.delta = function () {
	  return new StringDelta();
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTType = __webpack_require__(3);
	var OperationIterator = __webpack_require__(5);
	var OperationSequence = __webpack_require__(6);

	var StringDelta = __webpack_require__(12);
	var ops = __webpack_require__(13);

	var StringType = function (_OTType) {
	  _inherits(StringType, _OTType);

	  function StringType() {
	    _classCallCheck(this, StringType);

	    return _possibleConstructorReturn(this, (StringType.__proto__ || Object.getPrototypeOf(StringType)).apply(this, arguments));
	  }

	  _createClass(StringType, [{
	    key: 'compose',
	    value: function compose(left, right) {
	      left = new OperationIterator(left);
	      right = new OperationIterator(right);

	      var delta = new StringDelta();

	      function handleRetain(op1, op2) {
	        var length1 = op1.length;

	        if (op2 instanceof ops.Retain) {
	          var length2 = op2.length;

	          if (length1 < length2) {
	            delta.retain(length1);

	            right.replace(new ops.Retain(length2 - length1));
	          } else if (length1 > length2) {
	            delta.retain(length2);

	            left.replace(new ops.Retain(length1 - length2));
	          } else {
	            delta.retain(length1);
	          }
	        } else if (op2 instanceof ops.Insert) {
	          delta.insert(op2.value);

	          left.back();
	        } else if (op2 instanceof ops.Delete) {
	          var value2 = op2.value;
	          var _length = value2.length;

	          // delta.delete(value2);

	          if (length1 < _length) {
	            delta.delete(value2.substring(0, length1));
	            right.replace(new ops.Delete(value2.substring(length1)));
	          } else if (length1 > _length) {
	            delta.delete(value2);
	            left.replace(new ops.Retain(length1 - _length));
	          } else {
	            delta.delete(value2);
	          }
	        }
	      }

	      function handleInsert(op1, op2) {
	        var value1 = op1.value;
	        var length1 = op1.value.length;

	        if (op2 instanceof ops.Retain) {
	          var length2 = op2.length;

	          if (length1 < length2) {
	            delta.insert(value1);
	            right.replace(new ops.Retain(length2 - length1));
	          } else if (length1 > length2) {
	            delta.insert(value1.substring(0, length2));

	            left.replace(new ops.Insert(value1.substring(length2)));
	          } else {
	            delta.insert(value1);
	          }
	        } else if (op2 instanceof ops.Insert) {
	          delta.insert(op2.value);
	          left.back();
	        } else if (op2 instanceof ops.Delete) {
	          var value2 = op2.value;
	          var _length2 = value2.length;

	          if (length1 > _length2) {
	            left.replace(new ops.Insert(value1.substring(_length2)));
	          } else if (length1 < _length2) {
	            right.replace(new ops.Delete(value2.substring(length1)));
	          } else {}
	        }
	      }

	      function handleDelete(op1, op2) {
	        var value1 = op1.value;
	        var length1 = value1.length;

	        if (op2 instanceof ops.Retain) {
	          delta.delete(value1);

	          right.back();
	        } else if (op2 instanceof ops.Insert) {
	          delta.delete(value1);
	          delta.insert(op2.value);
	        } else if (op2 instanceof ops.Delete) {
	          delta.delete(value1);
	          right.back();
	        }
	      }

	      while (left.hasNext && right.hasNext) {
	        var op1 = left.next();
	        var op2 = right.next();

	        if (op1 instanceof ops.Retain) {
	          handleRetain(op1, op2);
	        } else if (op1 instanceof ops.Insert) {
	          handleInsert(op1, op2);
	        } else if (op1 instanceof ops.Delete) {
	          handleDelete(op1, op2);
	        }
	      }

	      if (left.hasNext) {
	        throw new Error('Composition failure');
	      }

	      while (right.hasNext) {
	        var _op = right.next();
	        _op.apply(delta);
	      }

	      return delta.done();
	    }
	  }, {
	    key: 'transform',
	    value: function transform(left, right) {
	      left = new OperationIterator(left);
	      right = new OperationIterator(right);

	      var deltaLeft = new StringDelta();
	      var deltaRight = new StringDelta();

	      function handleRetain(op1, op2) {
	        var length1 = op1.length;

	        if (op2 instanceof ops.Retain) {
	          var length2 = op2.length;

	          if (length1 > length2) {
	            deltaLeft.retain(length2);
	            deltaRight.retain(length2);

	            left.replace(new ops.Retain(length1 - length2));
	          } else if (length1 < length2) {
	            deltaLeft.retain(length1);
	            deltaRight.retain(length1);

	            right.replace(new ops.Retain(length2 - length1));
	          } else {
	            deltaLeft.retain(length1);
	            deltaRight.retain(length2);
	          }
	        } else if (op2 instanceof ops.Insert) {
	          var value2 = op2.value;
	          var _length3 = value2.length;

	          deltaLeft.retain(_length3);
	          deltaRight.insert(value2);

	          left.back();
	        } else if (op2 instanceof ops.Delete) {
	          var _value = op2.value;
	          var _length4 = _value.length;

	          if (length1 > _length4) {
	            deltaRight.delete(_value);

	            left.replace(new ops.Retain(length1 - _length4));
	          } else if (length1 < _length4) {
	            deltaRight.delete(_value.substring(0, length1));

	            right.replace(new ops.Delete(_value.substring(length1)));
	          } else {
	            deltaRight.delete(_value);
	          }
	        }
	      }

	      function handleInsert(op1, op2) {
	        var value1 = op1.value;
	        var length1 = op1.value.length;
	        deltaLeft.insert(value1);
	        deltaRight.retain(length1);
	        right.back();
	      }

	      function handleDelete(op1, op2) {
	        var value1 = op1.value;
	        var length1 = value1.length;

	        if (op2 instanceof ops.Retain) {
	          var length2 = op2.length;
	          if (length1 > length2) {
	            deltaLeft.delete(value1.substring(0, length2));

	            left.replace(new ops.Delete(value1.substring(length2)));
	          } else if (length1 < length2) {
	            deltaLeft.delete(value1);

	            right.replace(new ops.Retain(length2 - length1));
	          } else {
	            deltaLeft.delete(value1);
	          }
	        } else if (op2 instanceof ops.Insert) {
	          var value2 = op2.value;
	          var _length5 = value2.length;

	          deltaLeft.retain(_length5);
	          deltaRight.insert(value2);

	          left.back();
	        } else if (op2 instanceof ops.Delete) {
	          var _value2 = op2.value;
	          var _length6 = _value2.length;

	          if (length1 > _length6) {
	            left.replace(new ops.Delete(value1.substring(_length6)));
	          } else if (length1 < _length6) {
	            right.replace(new ops.Delete(_value2.substring(length1)));
	          } else {}
	        }
	      }

	      while (left.hasNext) {
	        var op1 = left.next();

	        if (right.hasNext) {
	          var op2 = right.next();

	          if (op1 instanceof ops.Retain) {
	            handleRetain(op1, op2);
	          } else if (op1 instanceof ops.Insert) {
	            handleInsert(op1, op2);
	          } else if (op1 instanceof ops.Delete) {
	            handleDelete(op1, op2);
	          } else if (op1 instanceof ops.AnnotationUpdate) {
	            handleAnnotationUpdate(op1, op2);
	          }
	        } else if (op1 instanceof ops.Insert) {
	          var value1 = op1.value;
	          deltaLeft.insert(value1);
	          deltaRight.retain(value1.length);
	        } else {
	          throw new Error('Transformation failure, mismatch in operation. Current left operation: ' + op1.toString());
	        }
	      }

	      while (right.hasNext) {
	        var _op2 = right.next();
	        if (_op2 instanceof ops.Insert) {
	          var value2 = _op2.value;

	          deltaRight.insert(value2);
	          deltaLeft.retain(value2.length);
	        } else {
	          throw new Error('Transformation failure, mismatch in operation. Current right operation: ' + _op2.toString());
	        }
	      }

	      return {
	        left: deltaLeft.done(),
	        right: deltaRight.done()
	      };
	    }
	  }, {
	    key: 'serializeObject',
	    value: function serializeObject(op) {
	      var result = [];
	      OperationSequence.asArray(op).forEach(function (subOp) {
	        if (subOp instanceof ops.Retain) {
	          result.push(['retain', subOp.length]);
	        } else if (subOp instanceof ops.Insert) {
	          result.push(['insert', subOp.value]);
	        } else if (subOp instanceof ops.Delete) {
	          result.push(['delete', subOp.value]);
	        } else {
	          throw new Error('Unsupported operation: ' + subOp);
	        }
	      });

	      return result;
	    }
	  }, {
	    key: 'deserializeObject',
	    value: function deserializeObject(json) {
	      if (!Array.isArray(json)) {
	        throw new Error('Given input is not an array, got: ' + json);
	      }

	      var delta = new StringDelta();
	      json.forEach(function (op) {
	        switch (op[0]) {
	          case 'retain':
	            delta.retain(op[1]);
	            break;
	          case 'insert':
	            delta.insert(op[1]);
	            break;
	          case 'delete':
	            delta.delete(op[1]);
	            break;
	          default:
	            throw new Error('Unknown operation: ' + op);
	        }
	      });

	      return delta.done();
	    }
	  }]);

	  return StringType;
	}(OTType);

	module.exports = StringType;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ops = __webpack_require__(13);
	var OperationSequence = __webpack_require__(6);

	var EMPTY = 0;
	var RETAIN = 1;
	var INSERT = 2;
	var DELETE = 3;

	var StringDelta = function () {
	  function StringDelta() {
	    _classCallCheck(this, StringDelta);

	    this.ops = [];

	    this.state = EMPTY;
	    this.value = '';
	  }

	  _createClass(StringDelta, [{
	    key: 'flush',
	    value: function flush() {
	      switch (this.state) {
	        case RETAIN:
	          if (this.retainCount > 0) {
	            this.ops.push(new ops.Retain(this.retainCount));
	          }
	          break;
	        case INSERT:
	          if (this.value.length > 0) {
	            var op = new ops.Insert(this.value);

	            var previous = this.ops[this.ops.length - 1];
	            if (previous instanceof ops.Delete) {
	              this.ops[this.ops.length - 1] = op;
	              this.ops.push(previous);
	            } else {
	              this.ops.push(op);
	            }
	          }
	          break;
	        case DELETE:
	          if (this.value.length > 0) {
	            this.ops.push(new ops.Delete(this.value));
	          }
	          break;
	      }

	      this.retainCount = 0;
	      this.value = '';
	    }
	  }, {
	    key: 'retain',
	    value: function retain(length) {
	      if (length <= 0) return;

	      if (this.state !== RETAIN) {
	        this.flush();
	        this.state = RETAIN;
	      }

	      this.retainCount += length;
	      return this;
	    }
	  }, {
	    key: 'insert',
	    value: function insert(value) {
	      if (this.state !== INSERT) {
	        this.flush();
	        this.state = INSERT;
	      }

	      this.value += value;
	      return this;
	    }
	  }, {
	    key: 'delete',
	    value: function _delete(value) {
	      if (this.state !== DELETE) {
	        this.flush();
	        this.state = DELETE;
	      }

	      this.value += value;
	      return this;
	    }
	  }, {
	    key: 'done',
	    value: function done() {
	      this.flush();
	      return new OperationSequence(this.ops);
	    }
	  }]);

	  return StringDelta;
	}();

	module.exports = StringDelta;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTOperation = __webpack_require__(8);

	var Retain = function (_OTOperation) {
	  _inherits(Retain, _OTOperation);

	  function Retain(length) {
	    _classCallCheck(this, Retain);

	    var _this = _possibleConstructorReturn(this, (Retain.__proto__ || Object.getPrototypeOf(Retain)).call(this));

	    _this.length = length;
	    return _this;
	  }

	  _createClass(Retain, [{
	    key: 'apply',
	    value: function apply(handler) {
	      handler.retain(this.length);
	    }
	  }, {
	    key: 'invert',
	    value: function invert() {
	      return this;
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return 'Retain{' + this.length + '}';
	    }
	  }]);

	  return Retain;
	}(OTOperation);

	var Insert = function (_OTOperation2) {
	  _inherits(Insert, _OTOperation2);

	  function Insert(value) {
	    _classCallCheck(this, Insert);

	    var _this2 = _possibleConstructorReturn(this, (Insert.__proto__ || Object.getPrototypeOf(Insert)).call(this));

	    _this2.value = value;
	    return _this2;
	  }

	  _createClass(Insert, [{
	    key: 'apply',
	    value: function apply(handler) {
	      handler.insert(this.value);
	    }
	  }, {
	    key: 'invert',
	    value: function invert() {
	      return Delete(this.value);
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return 'Insert{' + this.value + '}';
	    }
	  }]);

	  return Insert;
	}(OTOperation);

	var Delete = function (_OTOperation3) {
	  _inherits(Delete, _OTOperation3);

	  function Delete(value) {
	    _classCallCheck(this, Delete);

	    var _this3 = _possibleConstructorReturn(this, (Delete.__proto__ || Object.getPrototypeOf(Delete)).call(this));

	    _this3.value = value;
	    return _this3;
	  }

	  _createClass(Delete, [{
	    key: 'apply',
	    value: function apply(handler) {
	      handler.delete(this.value);
	    }
	  }, {
	    key: 'invert',
	    value: function invert() {
	      return Insert(this.value);
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return 'Delete{' + this.value + '}';
	    }
	  }]);

	  return Delete;
	}(OTOperation);

	exports.Retain = Retain;
	exports.Insert = Insert;
	exports.Delete = Delete;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventEmitter = __webpack_require__(15);

	var SYNCHRONIZED = 0;
	var AWAITING_CONFIRM = 1;
	var AWAITING_CONFIRM_WITH_BUFFER = 2;

	var Workspace = function () {
	  function Workspace(sync) {
	    _classCallCheck(this, Workspace);

	    this.dataType = sync.dataType;
	    this.sync = sync;

	    this.lastId = 0;

	    this.state = SYNCHRONIZED;
	    this.events = new EventEmitter();

	    this.composing = null;
	    this.composeDepth = 0;
	  }

	  _createClass(Workspace, [{
	    key: 'connect',
	    value: function connect() {
	      var _this = this;

	      return this.sync.connect(this.receive.bind(this)).then(function (initial) {
	        _this.parentHistoryId = initial.historyId;
	        _this.current = initial.operation;
	        _this.operationId = initial.operationId;

	        _this.sync.on('change', _this.receive.bind(_this));

	        return initial.operation;
	      });
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.sync.close();
	    }
	  }, {
	    key: 'performEdit',
	    value: function performEdit(callback) {
	      this.composeDepth++;
	      try {
	        return callback();
	      } finally {
	        if (--this.composeDepth === 0 && this.composing) {
	          this.apply(this.composing);
	          this.composing = null;
	        }
	      }
	    }
	  }, {
	    key: 'on',
	    value: function on(event, listener) {
	      return this.events.on(event, listener);
	    }
	  }, {
	    key: 'removeEventListener',
	    value: function removeEventListener(event, listener) {
	      this.events.removeListener(event, listener);
	    }
	  }, {
	    key: 'receive',
	    value: function receive(op) {
	      switch (this.state) {
	        case SYNCHRONIZED:
	          this.parentHistoryId = op.historyId;
	          this.composeAndTriggerListeners(op.operation);
	          break;
	        case AWAITING_CONFIRM:
	          if (this.lastSent.operationId === op.operationId) {
	            this.parentHistoryId = op.historyId;
	            this.state = SYNCHRONIZED;
	          } else {
	            var transformed = this.dataType.transform(op.operation, this.lastSent.operation);

	            this.lastSent = {
	              historyId: op.historyId,
	              operationId: this.lastSent.operationId,
	              operation: transformed.right
	            };

	            this.parentHistoryId = op.historyId;
	            this.composeAndTriggerListeners(transformed.left);
	          }
	          break;
	        case AWAITING_CONFIRM_WITH_BUFFER:
	          if (this.lastSent.operationId === op.operationId) {
	            this.parentHistoryId = op.historyId;
	            this.state = AWAITING_CONFIRM;

	            this.lastSent = {
	              historyId: op.historyId,
	              operationId: this.buffer.operationId,
	              operation: this.buffer.operation
	            };
	            this.sync.emitDocumentChange(this.lastSent);
	          } else {
	            var _transformed = this.dataType.transform(op.operation, this.lastSent.operation);

	            this.lastSent = {
	              historyId: op.historyId,
	              operationId: this.lastSent.operationId,
	              operation: _transformed.right
	            };

	            _transformed = this.dataType.transform(this.buffer.operation, _transformed.left);

	            this.buffer = {
	              historyId: op.historyId,
	              operationId: this.buffer.operationId,
	              operation: _transformed.left
	            };

	            this.parentHistoryId = op.historyId;
	            this.composeAndTriggerListeners(_transformed.right);
	          }
	          break;
	        default:
	          throw new Error('Unknown state: ' + this.state);
	      }
	    }
	  }, {
	    key: 'apply',
	    value: function apply(op) {
	      if (typeof this.parentHistoryId === 'undefined') {
	        throw new Error('Workspace has not been connected');
	      }

	      if (this.composeDepth > 0) {
	        if (this.composing) {
	          this.composing = this.dataType.compose(this.composing, op);
	        } else {
	          this.composing = op;
	        }

	        return;
	      }

	      this.current = this.dataType.compose(this.current, op);

	      var tagged = void 0;
	      switch (this.state) {
	        case SYNCHRONIZED:

	          tagged = {
	            historyId: this.parentHistoryId,
	            operationId: this.operationId + '-' + this.lastId++,
	            operation: op
	          };

	          this.state = AWAITING_CONFIRM;
	          this.lastSent = tagged;
	          this.sync.emitDocumentChange(tagged);
	          break;
	        case AWAITING_CONFIRM:

	          tagged = {
	            historyId: this.parentHistoryId,
	            operationId: this.operationId + '-' + this.lastId++,
	            operation: op
	          };

	          this.state = AWAITING_CONFIRM_WITH_BUFFER;
	          this.buffer = tagged;
	          break;
	        case AWAITING_CONFIRM_WITH_BUFFER:

	          this.buffer.operation = this.dataType.compose(this.buffer.operation, op);
	          break;
	        default:
	          throw new Error('Unknown state: ' + this.state);
	      }

	      this.events.emit('change', {
	        operation: op,
	        local: true
	      });
	    }
	  }, {
	    key: 'composeAndTriggerListeners',
	    value: function composeAndTriggerListeners(op) {
	      this.current = this.dataType.compose(this.current, op);
	      this.events.emit('change', {
	        operation: op,
	        local: false
	      });
	    }
	  }]);

	  return Workspace;
	}();

	Workspace.SYNCHRONIZED = SYNCHRONIZED;
	Workspace.AWAITING_CONFIRM = AWAITING_CONFIRM;
	Workspace.AWAITING_CONFIRM_WITH_BUFFER = AWAITING_CONFIRM_WITH_BUFFER;

	module.exports = Workspace;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var uuidv4 = __webpack_require__(17);

	var locallock = __webpack_require__(20);
	var OperationBundle = __webpack_require__(24);
	var OperationManager = __webpack_require__(25);

	var WorkspaceManager = function () {
	  function WorkspaceManager(historyBuffer) {
	    _classCallCheck(this, WorkspaceManager);

	    this.historyBuffer = historyBuffer;
	    this.operationManager = new OperationManager();

	    this.lock = locallock();
	  }

	  _createClass(WorkspaceManager, [{
	    key: 'latest',
	    value: function latest() {
	      var _this = this;

	      return this.historyBuffer.latest().then(function (id) {
	        return _this.historyBuffer.until(id + 1).then(function (items) {
	          var sessionId = uuidv4();

	          var composer = _this.operationManager.newOperationComposer();
	          items.forEach(function (item) {
	            composer.add(item);
	          });

	          var composed = composer.done();
	          return new OperationBundle(id, sessionId, composed);
	        });
	      });
	    }
	  }, {
	    key: 'store',
	    value: function store(historyId, operationId, op) {
	      var _this2 = this;

	      return this.lock(function (done) {
	        var toStore = void 0;
	        _this2.historyBuffer.from(historyId + 1).then(function (items) {
	          var operationManager = _this2.operationManager;

	          var composer = operationManager.newOperationComposer();
	          items.forEach(function (item) {
	            composer.add(item);
	          });
	          var composed = composer.done();

	          if (composed) {
	            var transformed = operationManager.transform(composed, op);
	            toStore = transformed.right;
	          } else {
	            toStore = op;
	          }

	          return _this2.historyBuffer.store(toStore);
	        }).then(function (historyId) {
	          done(null, new OperationBundle(historyId, operationId, toStore));
	        }).catch(function (err) {
	          return done(err);
	        });
	      });
	    }
	  }]);

	  return WorkspaceManager;
	}();

	module.exports = WorkspaceManager;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(18);
	var bytesToUuid = __webpack_require__(19);

	function v4(options, buf, offset) {
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || rng)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ++ii) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || bytesToUuid(rnds);
	}

	module.exports = v4;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
	// browser this is a little complicated due to unknown quality of Math.random()
	// and inconsistent support for the `crypto` API.  We do the best we can via
	// feature-detection
	var rng;

	var crypto = global.crypto || global.msCrypto; // for IE 11
	if (crypto && crypto.getRandomValues) {
	  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(rnds8);
	    return rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return rnds;
	  };
	}

	module.exports = rng;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	var byteToHex = [];
	for (var i = 0; i < 256; ++i) {
	  byteToHex[i] = (i + 0x100).toString(16).substr(1);
	}

	function bytesToUuid(buf, offset) {
	  var i = offset || 0;
	  var bth = byteToHex;
	  return bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	module.exports = bytesToUuid;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var doLater = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;

	var LocalLock = function () {
	  function LocalLock() {
	    _classCallCheck(this, LocalLock);

	    this.queue = [];
	    this.acquired = false;
	  }

	  _createClass(LocalLock, [{
	    key: 'acquire',
	    value: function acquire(cb) {
	      var _this = this;

	      return new Promise(function (resolve, reject) {
	        if (_this.acquired) {
	          _this.queue.push({
	            callback: cb,
	            resolve: resolve,
	            reject: reject
	          });
	          return;
	        }

	        _this.acquired = true;

	        cb(_this.createdDoneCallback(resolve, reject));
	      });
	    }
	  }, {
	    key: 'createdDoneCallback',
	    value: function createdDoneCallback(resolve, reject) {
	      var _this2 = this;

	      var used = false;
	      return function (err, result) {
	        if (used) return;

	        if (err !== null) {
	          reject(err);
	        } else {
	          resolve(result);
	        }

	        used = true;
	        if (_this2.queue.length === 0) {
	          _this2.acquired = false;
	        } else {
	          var next = _this2.queue[0];
	          _this2.queue.splice(0, 1);

	          doLater(function () {
	            var done = this.createdDoneCallback(next.resolve, next.reject);
	            next.callback(done);
	          });
	        }
	      };
	    }
	  }]);

	  return LocalLock;
	}();

	module.exports = function () {
	  var lock = new LocalLock();

	  return function (cb) {
	    return lock.acquire(cb);
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).setImmediate))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(22);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(23)))

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OperationBundle = function OperationBundle(historyId, operationId, operation) {
	  _classCallCheck(this, OperationBundle);

	  this.historyId = historyId;
	  this.operationId = operationId;
	  this.operation = operation;
	};

	module.exports = OperationBundle;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTType = __webpack_require__(3);

	var map = __webpack_require__(1);
	var string = __webpack_require__(10);

	var CombinedDelta = __webpack_require__(26);
	var OperationIterator = __webpack_require__(5);
	var OperationSequence = __webpack_require__(6);
	var ops = __webpack_require__(27);

	function idComparator(a, b) {
	  return a.operationId < b.operationId ? -1 : a.operationId > b.operationId ? 1 : 0;
	}

	var OperationManager = function (_OTType) {
	  _inherits(OperationManager, _OTType);

	  function OperationManager() {
	    _classCallCheck(this, OperationManager);

	    var _this = _possibleConstructorReturn(this, (OperationManager.__proto__ || Object.getPrototypeOf(OperationManager)).call(this));

	    _this.dataTypes = {
	      map: map.newType(),
	      string: string.newType()
	    };
	    return _this;
	  }

	  _createClass(OperationManager, [{
	    key: 'addType',
	    value: function addType(id, type) {
	      if (type.newType) {
	        type = type.newType();
	      }

	      if (!type.transform || !type.compose) {
	        throw 'Invalid type. Types must have a compose and transform function';
	      }

	      this.dataTypes[id] = type;
	      return this;
	    }
	  }, {
	    key: 'compose',
	    value: function compose(left, right) {
	      var it1 = new OperationIterator(left, idComparator);
	      var it2 = new OperationIterator(right, idComparator);

	      var result = [];

	      while (it1.hasNext) {
	        var op1 = it1.next();

	        var handled = false;

	        while (it2.hasNext) {
	          var op2 = it2.next();

	          var compared = idComparator(op1, op2);
	          if (compared > 0) {
	            result.push(op2);
	            continue;
	          } else if (compared < 0) {
	            it2.back();
	          } else {
	            if (op1 instanceof ops.OperationWrapper && op2 instanceof ops.OperationWrapper) {
	              if (op1.dataType != op2.dataType) {
	                throw new Error('Operations with id `' + op1.operationId + '` have different types: ' + op1.dataType + ' vs ' + op2.dataType);
	              }

	              var type = this.dataTypes[op1.dataType];
	              if (!type) {
	                throw 'Can not compose, unknown type: ' + op1.dataType;
	              }

	              var composed = type.compose(op1.operation, op2.operation);
	              it1.replace(new ops.OperationWrapper(op1.operationId, op1.dataType, composed));
	            }

	            handled = true;
	          }
	          break;
	        }

	        if (!handled) {
	          result.push(op1);
	        }
	      }

	      while (it2.hasNext) {
	        result.push(it2.next());
	      }

	      result.sort(idComparator);
	      return new OperationSequence(result);
	    }
	  }, {
	    key: 'transform',
	    value: function transform(left, right) {
	      var it1 = new OperationIterator(left, idComparator);
	      var it2 = new OperationIterator(right, idComparator);

	      var deltaLeft = [];
	      var deltaRight = [];

	      while (it1.hasNext) {
	        var op1 = it1.next();

	        var handled = false;

	        while (it2.hasNext) {
	          var op2 = it2.next();

	          var compared = idComparator(op1, op2);
	          if (compared > 0) {
	            deltaRight.push(op2);
	            continue;
	          } else if (compared < 0) {
	            it2.back();
	          } else {
	            if (op1 instanceof ops.OperationWrapper && op2 instanceof ops.OperationWrapper) {
	              if (op1.dataType != op2.dataType) {
	                throw 'Can not compose, operations with id `' + op1.operationId + '` have different types: ' + op1.dataType + ' vs ' + op2.dataType;
	              }

	              var type = this.dataTypes[op1.dataType];
	              if (!type) {
	                throw 'Can not compose, unknown type: ' + op1.dataType;
	              }

	              var transformed = type.transform(op1.operation, op2.operation);
	              deltaLeft.push(new ops.OperationWrapper(op1.operationId, op1.dataType, transformed.left));
	              deltaRight.push(new ops.OperationWrapper(op2.operationId, op2.dataType, transformed.right));
	            }

	            handled = true;
	          }

	          break;
	        }

	        if (!handled) {
	          deltaLeft.push(op1);
	        }
	      }

	      while (it2.hasNext) {
	        deltaRight.push(it2.next());
	      }

	      deltaLeft.sort(idComparator);
	      deltaRight.sort(idComparator);
	      return {
	        left: new OperationSequence(deltaLeft),
	        right: new OperationSequence(deltaRight)
	      };
	    }
	  }, {
	    key: 'serializeObject',
	    value: function serializeObject(op) {
	      var _this2 = this;

	      var result = [];
	      OperationSequence.asArray(op).forEach(function (subOp) {
	        if (subOp instanceof ops.OperationWrapper) {
	          result.push(['update', subOp.operationId, subOp.dataType, _this2.dataTypes[subOp.dataType].serializeObject(subOp.operation)]);
	        } else {
	          throw new Error('Unsupported operation: ' + subOp);
	        }
	      });

	      return result;
	    }
	  }, {
	    key: 'deserializeObject',
	    value: function deserializeObject(json) {
	      var _this3 = this;

	      var delta = new CombinedDelta();

	      json.forEach(function (data) {
	        switch (data[0]) {
	          case 'update':
	            delta.update(data[1], data[2], _this3.dataTypes[data[2]].deserializeObject(data[3]));
	            break;
	          default:
	            throw new Error('Unsupported type of operation: ' + data[0]);
	        }
	      });

	      return delta.done();
	    }
	  }], [{
	    key: 'delta',
	    value: function delta() {
	      return new CombinedDelta();
	    }
	  }]);

	  return OperationManager;
	}(OTType);

	module.exports = OperationManager;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OperationSequence = __webpack_require__(6);
	var ops = __webpack_require__(27);

	var OperationHandler = function () {
	  function OperationHandler() {
	    _classCallCheck(this, OperationHandler);

	    this.ops = [];
	  }

	  _createClass(OperationHandler, [{
	    key: 'update',
	    value: function update(id, type, operation) {
	      if (this.ops[id]) {
	        throw 'Can not update id `' + id + '`';
	      }

	      this.ops[id] = new ops.OperationWrapper(id, type, operation);
	      return this;
	    }
	  }, {
	    key: 'done',
	    value: function done() {
	      var result = [];

	      for (var key in this.ops) {
	        if (!this.ops.hasOwnProperty(key)) continue;

	        var value = this.ops[key];
	        result.push(value);
	      }

	      return new OperationSequence(result);
	    }
	  }]);

	  return OperationHandler;
	}();

	module.exports = OperationHandler;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OperationWrapper = function () {
	  function OperationWrapper(operationId, dataType, operation) {
	    _classCallCheck(this, OperationWrapper);

	    this.operationId = operationId;
	    this.dataType = dataType;
	    this.operation = operation;
	  }

	  _createClass(OperationWrapper, [{
	    key: "apply",
	    value: function apply(handler) {
	      handler.update(this.operationId, this.dataType, this.operation);
	    }
	  }, {
	    key: "invert",
	    value: function invert() {
	      return new OperationWrapper(this.operationId, this.dataType, this.operation.invert());
	    }
	  }, {
	    key: "toString",
	    value: function toString() {
	      return "Operation{id=" + this.operationId + ", type=" + this.dataType + ", operation=" + this.operation + "}";
	    }
	  }]);

	  return OperationWrapper;
	}();

	exports.OperationWrapper = OperationWrapper;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventEmitter = __webpack_require__(15);

	var AbstractConnector = function () {
	  function AbstractConnector(dataType, documentId) {
	    _classCallCheck(this, AbstractConnector);

	    this.events = new EventEmitter();
	    this.dataType = dataType;
	    this.documentId = documentId;
	  }

	  _createClass(AbstractConnector, [{
	    key: 'on',
	    value: function on(event, listener) {
	      return this.events.on(event, listener);
	    }
	  }, {
	    key: 'connect',
	    value: function connect() {
	      throw new Error('Not implemented');
	    }
	  }, {
	    key: 'onDocumentChange',
	    value: function onDocumentChange() {
	      throw new Error('Not implemented');
	    }
	  }, {
	    key: 'onDocumentLoad',
	    value: function onDocumentLoad(resolve) {
	      throw new Error('Not implemented');
	    }
	  }, {
	    key: 'emitDocumentLoad',
	    value: function emitDocumentLoad() {
	      throw new Error('Not implemented');
	    }
	  }, {
	    key: 'emitDocumentChange',
	    value: function emitDocumentChange(operation) {
	      throw new Error('Not implemented');
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      throw new Error('Not implemented');
	    }
	  }]);

	  return AbstractConnector;
	}();

	module.exports = AbstractConnector;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AbstractConnector = __webpack_require__(28);
	var OperationBundle = __webpack_require__(24);
	var Event = __webpack_require__(30);

	var SocketConnector = function (_AbstractConnector) {
	  _inherits(SocketConnector, _AbstractConnector);

	  function SocketConnector(dataType, socket, documentId) {
	    _classCallCheck(this, SocketConnector);

	    var _this = _possibleConstructorReturn(this, (SocketConnector.__proto__ || Object.getPrototypeOf(SocketConnector)).call(this, dataType, documentId));

	    _this.socket = socket;
	    return _this;
	  }

	  _createClass(SocketConnector, [{
	    key: 'connect',
	    value: function connect() {
	      var _this2 = this;

	      return new Promise(function (resolve, reject) {
	        _this2.onDocumentChange();
	        _this2.onDocumentLoad(resolve);
	        _this2.emitDocumentLoad();
	      });
	    }
	  }, {
	    key: 'onDocumentChange',
	    value: function onDocumentChange() {
	      var _this3 = this;

	      this.socket.on(Event.CHANGE_DOCUMENT, function (data) {
	        console.log(data.toString());
	        var operationBundle = new OperationBundle(data.historyId, data.operationId, _this3.dataType.deserializeObject(data.operation));

	        if (data.documentId === _this3.documentId) {
	          _this3.events.emit('change', operationBundle);
	        }
	      });
	    }
	  }, {
	    key: 'onDocumentLoad',
	    value: function onDocumentLoad(resolve) {
	      var _this4 = this;

	      this.socket.on(Event.LOAD_DOCUMENT, function (data) {
	        var operationBundle = new OperationBundle(data.historyId, data.operationId, _this4.dataType.deserializeObject(data.operation));

	        if (data.documentId === _this4.documentId) {
	          resolve(operationBundle);
	        }
	      });
	    }
	  }, {
	    key: 'emitDocumentLoad',
	    value: function emitDocumentLoad() {
	      this.socket.emit(Event.LOAD_DOCUMENT, {
	        documentId: this.documentId
	      });
	    }
	  }, {
	    key: 'emitDocumentChange',
	    value: function emitDocumentChange(op) {
	      console.dir(op);
	      this.socket.emit(Event.CHANGE_DOCUMENT, {
	        documentId: this.documentId,
	        historyId: op.historyId,
	        operationId: op.operationId,
	        operation: this.dataType.serializeObject(op.operation)
	      });
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.socket.emit(Event.CLOSE_DOCUMENT, {
	        documentId: this.documentId
	      });
	    }
	  }]);

	  return SocketConnector;
	}(AbstractConnector);

	module.exports = SocketConnector;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Event = function Event(remote, data) {
	  var _this = this;

	  _classCallCheck(this, Event);

	  this.remote = remote;
	  this.local = !remote;

	  Object.keys(data).forEach(function (k) {
	    return _this[k] = data[k];
	  });
	};

	exports.Event = Event;
	exports.VALUE_CHANGED = 'valueChanged';
	exports.VALUE_REMOVED = 'valueRemoved';

	exports.INSERT = 'insert';
	exports.DELETE = 'delete';

	exports.LOAD_DOCUMENT = 'load document';
	exports.CHANGE_DOCUMENT = 'change document';
	exports.CLOSE_DOCUMENT = 'close document';

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventEmitter = __webpack_require__(15);
	var events = __webpack_require__(30);
	var MapModel = __webpack_require__(32);
	var StringModel = __webpack_require__(35);
	var OperationSequence = __webpack_require__(6);
	var OperationHandler = __webpack_require__(26);
	var OperationManager = __webpack_require__(25);

	var Model = function () {
	  function Model(editor) {
	    var _this = this;

	    _classCallCheck(this, Model);

	    this.workspace = editor;
	    this.dataType = editor.dataType;

	    this.lastObjectId = 0;

	    this.factories = {};

	    this.workspaces = {};
	    this.values = {};
	    this.objects = {};

	    this.events = new EventEmitter();

	    this.operationHandler = new OperationHandler();

	    editor.on('change', function (change) {
	      if (!change.local) {
	        change.operation.apply(_this.changeHandler);
	      }

	      _this.events.emit('change', change);
	    });

	    this.changeHandler = {
	      update: function update(id, type, change) {
	        if (typeof _this.values[id] !== 'undefined') {
	          var current = _this.values[id];
	          var composed = _this.dataType.dataTypes[type].compose(current, change);

	          _this.values[id] = composed;

	          var _editor = _this.workspaces[id];
	          _this.remote = true;
	          _editor.apply({
	            operation: change,
	            local: false,
	            remote: true
	          });
	        } else {
	          _this.values[id] = change;

	          var object = _this.createObject(id, type);
	          _this.objects[id] = object;
	        }
	      }
	    };

	    this.registerType('map', function (e) {
	      return new MapModel(e);
	    });
	    this.registerType('string', function (e) {
	      return new StringModel(e);
	    });

	    this.root = this.getObject('root', 'map');
	    this.root.on('valueChanged', function (data) {
	      return _this.events.emit('valueChanged', data);
	    });
	    this.root.on('valueRemoved', function (data) {
	      return _this.events.emit('valueRemove', data);
	    });
	  }

	  _createClass(Model, [{
	    key: 'registerType',
	    value: function registerType(type, factory) {
	      this.factories[type] = factory;
	      return this;
	    }
	  }, {
	    key: 'newMap',
	    value: function newMap() {
	      return this.newObject('map');
	    }
	  }, {
	    key: 'newList',
	    value: function newList() {
	      return this.newObject('list');
	    }
	  }, {
	    key: 'newString',
	    value: function newString() {
	      return this.newObject('string');
	    }
	  }, {
	    key: 'newObject',
	    value: function newObject(type) {
	      var objectId = this.workspace.operationId + '-' + this.lastObjectId++;
	      return this.getObject(objectId, type);
	    }
	  }, {
	    key: 'open',
	    value: function open() {
	      var _this2 = this;

	      return this.workspace.connect().then(function (initial) {
	        return initial.apply(_this2.changeHandler);
	      });
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.workspace.close();
	    }
	  }, {
	    key: 'performEdit',
	    value: function performEdit(callback) {
	      this.workspace.performEdit(callback);
	    }
	  }, {
	    key: 'apply',
	    value: function apply(id, type, op) {
	      if (typeof this.values[id] !== 'undefined') {
	        var current = this.values[id];
	        var composed = this.dataType.dataTypes[type].compose(current, op);

	        this.values[id] = composed;
	      } else {
	        this.values[id] = op;
	      }

	      var editor = this.workspaces[id];
	      if (editor) {
	        this.remote = false;
	        editor.apply({
	          operation: op,
	          local: true,
	          remote: false
	        });

	        editor.queueEvent('change', op);
	      }

	      this.workspace.apply(new OperationHandler().update(id, type, op).done());
	    }
	  }, {
	    key: 'getObject',
	    value: function getObject(id) {
	      var object = this.objects[id];
	      return object || null;
	    }
	  }, {
	    key: 'queueEvent',
	    value: function queueEvent(id, type, data) {
	      var editor = this.workspaces[id];
	      editor.events.emit(type, new events.Event(this.remote, data));
	    }
	  }, {
	    key: 'getObject',
	    value: function getObject(id, type) {
	      var object = this.objects[id];
	      if (typeof object !== 'undefined') return object;

	      this.values[id] = new OperationSequence([]);
	      object = this.createObject(id, type);
	      this.objects[id] = object;

	      return object;
	    }
	  }, {
	    key: 'createObject',
	    value: function createObject(id, type) {
	      var editor = this.createWorkspace(id, type);
	      this.workspaces[id] = editor;
	      return this.factories[type](editor);
	    }
	  }, {
	    key: 'createWorkspace',
	    value: function createWorkspace(id, type) {
	      var self = this;
	      return {
	        objectId: id,
	        objectType: type,

	        events: new EventEmitter(),

	        model: self,

	        getObject: function getObject(id, type) {
	          return self.getObject(id, type);
	        },
	        queueEvent: function queueEvent(type, data) {
	          self.queueEvent(id, type, data);
	        },


	        get current() {
	          return self.values[this.objectId];
	        },

	        send: function send(op) {
	          self.apply(this.objectId, this.objectType, op);
	        },
	        apply: function apply(op, local) {
	          throw new Error('No hook for applying data registered');
	        }
	      };
	    }
	  }, {
	    key: 'containsKey',
	    value: function containsKey(key) {
	      return this.root.containsKey(key);
	    }
	  }, {
	    key: 'get',
	    value: function get(key, factory) {
	      return this.root.get(key, factory);
	    }
	  }, {
	    key: 'remove',
	    value: function remove(key) {
	      return this.root.remove(key);
	    }
	  }, {
	    key: 'set',
	    value: function set(key, value) {
	      return this.root.set(key, value);
	    }
	  }, {
	    key: 'on',
	    value: function on(event, listener) {
	      return this.events.on(event, listener);
	    }
	  }, {
	    key: 'removeEventListener',
	    value: function removeEventListener(event, listener) {
	      this.events.removeListener(event, listener);
	    }
	  }], [{
	    key: 'defaultType',
	    value: function defaultType() {
	      return new OperationManager();
	    }
	  }]);

	  return Model;
	}();

	module.exports = Model;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTModel = __webpack_require__(33);
	var map = __webpack_require__(1);
	var dataValues = __webpack_require__(34);

	var MapModel = function (_OTModel) {
	  _inherits(MapModel, _OTModel);

	  function MapModel(workspace) {
	    _classCallCheck(this, MapModel);

	    var _this = _possibleConstructorReturn(this, (MapModel.__proto__ || Object.getPrototypeOf(MapModel)).call(this, workspace));

	    _this.values = {};

	    _this.apply({
	      operation: workspace.current
	    });
	    workspace.apply = _this.apply.bind(_this);
	    return _this;
	  }

	  _createClass(MapModel, [{
	    key: 'apply',
	    value: function apply(data) {
	      var _this2 = this;

	      data.operation.apply({
	        remove: function remove(id, oldValue) {
	          var old = _this2.values[id];
	          delete _this2.values[id];

	          _this2.workspace.queueEvent('valueRemoved', {
	            key: id,
	            oldValue: old
	          });
	        },

	        set: function set(id, oldValue, newValue) {
	          var value = dataValues.fromData(_this2.workspace, newValue);
	          var old = _this2.values[id];
	          _this2.values[id] = value;

	          _this2.workspace.queueEvent('valueChanged', {
	            key: id,
	            oldValue: old,
	            newValue: value
	          });
	        }
	      });
	    }
	  }, {
	    key: 'containsKey',
	    value: function containsKey(key) {
	      return typeof this.values[key] !== 'undefined';
	    }
	  }, {
	    key: 'get',
	    value: function get(key, factory) {
	      var _this3 = this;

	      var value = this.values[key];
	      if (value) return value;

	      if (factory) {
	        var model = this.workspace.model;
	        model.performEdit(function () {
	          value = _this3.values[key] = factory(model);

	          _this3.workspace.send(map.delta().set(key, dataValues.toData(null), dataValues.toData(value)).done());
	        });
	      }

	      return value || null;
	    }
	  }, {
	    key: 'remove',
	    value: function remove(key) {
	      var old = this.values[key];
	      if (typeof old !== 'undefined') {
	        this.workspace.send(map.delta().set(key, dataValues.toData(null)));
	      }
	    }
	  }, {
	    key: 'set',
	    value: function set(key, value) {
	      if (value === null || typeof value === 'undefined') {
	        throw new Error('Value undefined');
	      }

	      var old = this.values[key];
	      this.workspace.send(map.delta().set(key, dataValues.toData(old), dataValues.toData(value)).done());
	    }
	  }]);

	  return MapModel;
	}(OTModel);

	module.exports = MapModel;

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OTModel = function () {
	  function OTModel(workspace) {
	    _classCallCheck(this, OTModel);

	    this.workspace = workspace;
	  }

	  _createClass(OTModel, [{
	    key: "on",
	    value: function on(event, listener) {
	      this.workspace.events.on(event, listener);
	      return this;
	    }
	  }, {
	    key: "removeEventListener",
	    value: function removeEventListener(event, listener) {
	      return this.workspace.events.removeListener(event, listener);
	    }
	  }, {
	    key: "objectId",
	    get: function get() {
	      return this.workspace.objectId;
	    }
	  }, {
	    key: "objectType",
	    get: function get() {
	      return this.workspace.objectType;
	    }
	  }]);

	  return OTModel;
	}();

	module.exports = OTModel;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var OTModel = __webpack_require__(33);

	exports.fromData = function (editor, data) {
	  if (typeof data === 'undefined') return null;

	  var type = data[0];
	  switch (type) {
	    case 'ref':
	      return editor.getObject(data[1], data[2]);
	    case 'value':
	      return data[1];
	    default:
	      throw new Error('Unknown type of data: ' + type);
	  }
	};

	exports.toData = function (value) {
	  if (typeof value === 'undefined') return null;

	  if (value instanceof OTModel) {
	    return ['ref', value.objectId, value.objectType];
	  }
	  return ['value', value];
	};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var diff = __webpack_require__(36);

	var OTModel = __webpack_require__(33);
	var string = __webpack_require__(10);

	var StringModel = function (_OTModel) {
	  _inherits(StringModel, _OTModel);

	  function StringModel(workspace) {
	    _classCallCheck(this, StringModel);

	    var _this = _possibleConstructorReturn(this, (StringModel.__proto__ || Object.getPrototypeOf(StringModel)).call(this, workspace));

	    _this.value = '';
	    var self = _this;
	    workspace.current.apply({
	      retain: function retain(count) {
	        throw new Error('Must only contain inserts');
	      },
	      delete: function _delete(value) {
	        throw new Error('Must only contain inserts');
	      },
	      insert: function insert(value) {
	        self.value += value;
	      }
	    });

	    workspace.apply = _this.apply.bind(_this);
	    return _this;
	  }

	  _createClass(StringModel, [{
	    key: 'apply',
	    value: function apply(data) {
	      var self = this;
	      var index = 0;
	      data.operation.apply({
	        retain: function retain(count) {
	          index += count;
	        },
	        insert: function insert(value) {
	          self.value = self.value.substr(0, index) + value + self.value.substr(index);

	          var from = index;
	          index += value.length;

	          self.workspace.queueEvent('insert', {
	            index: from,
	            value: value
	          });
	        },
	        delete: function _delete(value) {
	          self.value = self.value.substr(0, index) + self.value.substr(index + value.length);

	          self.workspace.queueEvent('delete', {
	            index: index,
	            fromIndex: index,
	            toIndex: index + value.length,

	            value: value
	          });
	        }
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.value;
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      if (this.value === value) return;

	      var delta = string.delta();
	      var index = 0;
	      diff(this.value, value).forEach(function (d) {
	        switch (d[0]) {
	          case diff.EQUAL:
	            delta.retain(d[1].length);
	            break;
	          case diff.INSERT:
	            delta.insert(d[1]);

	            break;
	          case diff.DELETE:
	            delta.delete(d[1]);
	            break;
	        }
	      });

	      this.workspace.send(delta.done());
	    }
	  }, {
	    key: 'append',
	    value: function append(value) {
	      var length = this.value.length;
	      this.workspace.send(string.delta().retain(length).insert(value).done());
	    }
	  }, {
	    key: 'insert',
	    value: function insert(index, value) {
	      var length = this.value.length;

	      if (index <= 0) {
	        throw new Error('index invalid');
	      }

	      if (index > length) {
	        throw new Error('index invalid');
	      }

	      this.workspace.send(string.delta().retain(index).insert(value).retain(length - index).done());
	    }
	  }, {
	    key: 'remove',
	    value: function remove(fromIndex, toIndex) {
	      if (fromIndex <= 0) {
	        throw new Error('fromIndex invalid');
	      }

	      var length = this.value.length();
	      if (toIndex > length) {
	        throw new Error('toIndex invalid');
	      }

	      if (toIndex <= fromIndex) {
	        throw new Error('toIndex invalid');
	      }

	      var deleted = this.value.substring(fromIndex, toIndex);
	      this.workspace.send(string.delta().retain(fromIndex).delete(deleted).retain(length - toIndex).done());
	    }
	  }]);

	  return StringModel;
	}(OTModel);

	module.exports = StringModel;

/***/ }),
/* 36 */
/***/ (function(module, exports) {

	/**
	 * This library modifies the diff-patch-match library by Neil Fraser
	 * by removing the patch and match functionality and certain advanced
	 * options in the diff function. The original license is as follows:
	 *
	 * ===
	 *
	 * Diff Match and Patch
	 *
	 * Copyright 2006 Google Inc.
	 * http://code.google.com/p/google-diff-match-patch/
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */


	/**
	 * The data structure representing a diff is an array of tuples:
	 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
	 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
	 */
	var DIFF_DELETE = -1;
	var DIFF_INSERT = 1;
	var DIFF_EQUAL = 0;


	/**
	 * Find the differences between two texts.  Simplifies the problem by stripping
	 * any common prefix or suffix off the texts before diffing.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {Int} cursor_pos Expected edit position in text1 (optional)
	 * @return {Array} Array of diff tuples.
	 */
	function diff_main(text1, text2, cursor_pos) {
	  // Check for equality (speedup).
	  if (text1 == text2) {
	    if (text1) {
	      return [[DIFF_EQUAL, text1]];
	    }
	    return [];
	  }

	  // Check cursor_pos within bounds
	  if (cursor_pos < 0 || text1.length < cursor_pos) {
	    cursor_pos = null;
	  }

	  // Trim off common prefix (speedup).
	  var commonlength = diff_commonPrefix(text1, text2);
	  var commonprefix = text1.substring(0, commonlength);
	  text1 = text1.substring(commonlength);
	  text2 = text2.substring(commonlength);

	  // Trim off common suffix (speedup).
	  commonlength = diff_commonSuffix(text1, text2);
	  var commonsuffix = text1.substring(text1.length - commonlength);
	  text1 = text1.substring(0, text1.length - commonlength);
	  text2 = text2.substring(0, text2.length - commonlength);

	  // Compute the diff on the middle block.
	  var diffs = diff_compute_(text1, text2);

	  // Restore the prefix and suffix.
	  if (commonprefix) {
	    diffs.unshift([DIFF_EQUAL, commonprefix]);
	  }
	  if (commonsuffix) {
	    diffs.push([DIFF_EQUAL, commonsuffix]);
	  }
	  diff_cleanupMerge(diffs);
	  if (cursor_pos != null) {
	    diffs = fix_cursor(diffs, cursor_pos);
	  }
	  return diffs;
	};


	/**
	 * Find the differences between two texts.  Assumes that the texts do not
	 * have any common prefix or suffix.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_compute_(text1, text2) {
	  var diffs;

	  if (!text1) {
	    // Just add some text (speedup).
	    return [[DIFF_INSERT, text2]];
	  }

	  if (!text2) {
	    // Just delete some text (speedup).
	    return [[DIFF_DELETE, text1]];
	  }

	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  var i = longtext.indexOf(shorttext);
	  if (i != -1) {
	    // Shorter text is inside the longer text (speedup).
	    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
	             [DIFF_EQUAL, shorttext],
	             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
	    // Swap insertions for deletions if diff is reversed.
	    if (text1.length > text2.length) {
	      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
	    }
	    return diffs;
	  }

	  if (shorttext.length == 1) {
	    // Single character string.
	    // After the previous speedup, the character can't be an equality.
	    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	  }

	  // Check to see if the problem can be split in two.
	  var hm = diff_halfMatch_(text1, text2);
	  if (hm) {
	    // A half-match was found, sort out the return data.
	    var text1_a = hm[0];
	    var text1_b = hm[1];
	    var text2_a = hm[2];
	    var text2_b = hm[3];
	    var mid_common = hm[4];
	    // Send both pairs off for separate processing.
	    var diffs_a = diff_main(text1_a, text2_a);
	    var diffs_b = diff_main(text1_b, text2_b);
	    // Merge the results.
	    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
	  }

	  return diff_bisect_(text1, text2);
	};


	/**
	 * Find the 'middle snake' of a diff, split the problem in two
	 * and return the recursively constructed diff.
	 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 * @private
	 */
	function diff_bisect_(text1, text2) {
	  // Cache the text lengths to prevent multiple calls.
	  var text1_length = text1.length;
	  var text2_length = text2.length;
	  var max_d = Math.ceil((text1_length + text2_length) / 2);
	  var v_offset = max_d;
	  var v_length = 2 * max_d;
	  var v1 = new Array(v_length);
	  var v2 = new Array(v_length);
	  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
	  // integers and undefined.
	  for (var x = 0; x < v_length; x++) {
	    v1[x] = -1;
	    v2[x] = -1;
	  }
	  v1[v_offset + 1] = 0;
	  v2[v_offset + 1] = 0;
	  var delta = text1_length - text2_length;
	  // If the total number of characters is odd, then the front path will collide
	  // with the reverse path.
	  var front = (delta % 2 != 0);
	  // Offsets for start and end of k loop.
	  // Prevents mapping of space beyond the grid.
	  var k1start = 0;
	  var k1end = 0;
	  var k2start = 0;
	  var k2end = 0;
	  for (var d = 0; d < max_d; d++) {
	    // Walk the front path one step.
	    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
	      var k1_offset = v_offset + k1;
	      var x1;
	      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
	        x1 = v1[k1_offset + 1];
	      } else {
	        x1 = v1[k1_offset - 1] + 1;
	      }
	      var y1 = x1 - k1;
	      while (x1 < text1_length && y1 < text2_length &&
	             text1.charAt(x1) == text2.charAt(y1)) {
	        x1++;
	        y1++;
	      }
	      v1[k1_offset] = x1;
	      if (x1 > text1_length) {
	        // Ran off the right of the graph.
	        k1end += 2;
	      } else if (y1 > text2_length) {
	        // Ran off the bottom of the graph.
	        k1start += 2;
	      } else if (front) {
	        var k2_offset = v_offset + delta - k1;
	        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
	          // Mirror x2 onto top-left coordinate system.
	          var x2 = text1_length - v2[k2_offset];
	          if (x1 >= x2) {
	            // Overlap detected.
	            return diff_bisectSplit_(text1, text2, x1, y1);
	          }
	        }
	      }
	    }

	    // Walk the reverse path one step.
	    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
	      var k2_offset = v_offset + k2;
	      var x2;
	      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
	        x2 = v2[k2_offset + 1];
	      } else {
	        x2 = v2[k2_offset - 1] + 1;
	      }
	      var y2 = x2 - k2;
	      while (x2 < text1_length && y2 < text2_length &&
	             text1.charAt(text1_length - x2 - 1) ==
	             text2.charAt(text2_length - y2 - 1)) {
	        x2++;
	        y2++;
	      }
	      v2[k2_offset] = x2;
	      if (x2 > text1_length) {
	        // Ran off the left of the graph.
	        k2end += 2;
	      } else if (y2 > text2_length) {
	        // Ran off the top of the graph.
	        k2start += 2;
	      } else if (!front) {
	        var k1_offset = v_offset + delta - k2;
	        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
	          var x1 = v1[k1_offset];
	          var y1 = v_offset + x1 - k1_offset;
	          // Mirror x2 onto top-left coordinate system.
	          x2 = text1_length - x2;
	          if (x1 >= x2) {
	            // Overlap detected.
	            return diff_bisectSplit_(text1, text2, x1, y1);
	          }
	        }
	      }
	    }
	  }
	  // Diff took too long and hit the deadline or
	  // number of diffs equals number of characters, no commonality at all.
	  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	};


	/**
	 * Given the location of the 'middle snake', split the diff in two parts
	 * and recurse.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} x Index of split point in text1.
	 * @param {number} y Index of split point in text2.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_bisectSplit_(text1, text2, x, y) {
	  var text1a = text1.substring(0, x);
	  var text2a = text2.substring(0, y);
	  var text1b = text1.substring(x);
	  var text2b = text2.substring(y);

	  // Compute both diffs serially.
	  var diffs = diff_main(text1a, text2a);
	  var diffsb = diff_main(text1b, text2b);

	  return diffs.concat(diffsb);
	};


	/**
	 * Determine the common prefix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the start of each
	 *     string.
	 */
	function diff_commonPrefix(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerstart = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(pointerstart, pointermid) ==
	        text2.substring(pointerstart, pointermid)) {
	      pointermin = pointermid;
	      pointerstart = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Determine the common suffix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of each string.
	 */
	function diff_commonSuffix(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 ||
	      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerend = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
	        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
	      pointermin = pointermid;
	      pointerend = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Do the two texts share a substring which is at least half the length of the
	 * longer text?
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {Array.<string>} Five element Array, containing the prefix of
	 *     text1, the suffix of text1, the prefix of text2, the suffix of
	 *     text2 and the common middle.  Or null if there was no match.
	 */
	function diff_halfMatch_(text1, text2) {
	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
	    return null;  // Pointless.
	  }

	  /**
	   * Does a substring of shorttext exist within longtext such that the substring
	   * is at least half the length of longtext?
	   * Closure, but does not reference any external variables.
	   * @param {string} longtext Longer string.
	   * @param {string} shorttext Shorter string.
	   * @param {number} i Start index of quarter length substring within longtext.
	   * @return {Array.<string>} Five element Array, containing the prefix of
	   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
	   *     of shorttext and the common middle.  Or null if there was no match.
	   * @private
	   */
	  function diff_halfMatchI_(longtext, shorttext, i) {
	    // Start with a 1/4 length substring at position i as a seed.
	    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
	    var j = -1;
	    var best_common = '';
	    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
	    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
	      var prefixLength = diff_commonPrefix(longtext.substring(i),
	                                           shorttext.substring(j));
	      var suffixLength = diff_commonSuffix(longtext.substring(0, i),
	                                           shorttext.substring(0, j));
	      if (best_common.length < suffixLength + prefixLength) {
	        best_common = shorttext.substring(j - suffixLength, j) +
	            shorttext.substring(j, j + prefixLength);
	        best_longtext_a = longtext.substring(0, i - suffixLength);
	        best_longtext_b = longtext.substring(i + prefixLength);
	        best_shorttext_a = shorttext.substring(0, j - suffixLength);
	        best_shorttext_b = shorttext.substring(j + prefixLength);
	      }
	    }
	    if (best_common.length * 2 >= longtext.length) {
	      return [best_longtext_a, best_longtext_b,
	              best_shorttext_a, best_shorttext_b, best_common];
	    } else {
	      return null;
	    }
	  }

	  // First check if the second quarter is the seed for a half-match.
	  var hm1 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 4));
	  // Check again based on the third quarter.
	  var hm2 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 2));
	  var hm;
	  if (!hm1 && !hm2) {
	    return null;
	  } else if (!hm2) {
	    hm = hm1;
	  } else if (!hm1) {
	    hm = hm2;
	  } else {
	    // Both matched.  Select the longest.
	    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
	  }

	  // A half-match was found, sort out the return data.
	  var text1_a, text1_b, text2_a, text2_b;
	  if (text1.length > text2.length) {
	    text1_a = hm[0];
	    text1_b = hm[1];
	    text2_a = hm[2];
	    text2_b = hm[3];
	  } else {
	    text2_a = hm[0];
	    text2_b = hm[1];
	    text1_a = hm[2];
	    text1_b = hm[3];
	  }
	  var mid_common = hm[4];
	  return [text1_a, text1_b, text2_a, text2_b, mid_common];
	};


	/**
	 * Reorder and merge like edit sections.  Merge equalities.
	 * Any edit section can move as long as it doesn't cross an equality.
	 * @param {Array} diffs Array of diff tuples.
	 */
	function diff_cleanupMerge(diffs) {
	  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
	  var pointer = 0;
	  var count_delete = 0;
	  var count_insert = 0;
	  var text_delete = '';
	  var text_insert = '';
	  var commonlength;
	  while (pointer < diffs.length) {
	    switch (diffs[pointer][0]) {
	      case DIFF_INSERT:
	        count_insert++;
	        text_insert += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_DELETE:
	        count_delete++;
	        text_delete += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_EQUAL:
	        // Upon reaching an equality, check for prior redundancies.
	        if (count_delete + count_insert > 1) {
	          if (count_delete !== 0 && count_insert !== 0) {
	            // Factor out any common prefixies.
	            commonlength = diff_commonPrefix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              if ((pointer - count_delete - count_insert) > 0 &&
	                  diffs[pointer - count_delete - count_insert - 1][0] ==
	                  DIFF_EQUAL) {
	                diffs[pointer - count_delete - count_insert - 1][1] +=
	                    text_insert.substring(0, commonlength);
	              } else {
	                diffs.splice(0, 0, [DIFF_EQUAL,
	                                    text_insert.substring(0, commonlength)]);
	                pointer++;
	              }
	              text_insert = text_insert.substring(commonlength);
	              text_delete = text_delete.substring(commonlength);
	            }
	            // Factor out any common suffixies.
	            commonlength = diff_commonSuffix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              diffs[pointer][1] = text_insert.substring(text_insert.length -
	                  commonlength) + diffs[pointer][1];
	              text_insert = text_insert.substring(0, text_insert.length -
	                  commonlength);
	              text_delete = text_delete.substring(0, text_delete.length -
	                  commonlength);
	            }
	          }
	          // Delete the offending records and add the merged ones.
	          if (count_delete === 0) {
	            diffs.splice(pointer - count_insert,
	                count_delete + count_insert, [DIFF_INSERT, text_insert]);
	          } else if (count_insert === 0) {
	            diffs.splice(pointer - count_delete,
	                count_delete + count_insert, [DIFF_DELETE, text_delete]);
	          } else {
	            diffs.splice(pointer - count_delete - count_insert,
	                count_delete + count_insert, [DIFF_DELETE, text_delete],
	                [DIFF_INSERT, text_insert]);
	          }
	          pointer = pointer - count_delete - count_insert +
	                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
	        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
	          // Merge this equality with the previous one.
	          diffs[pointer - 1][1] += diffs[pointer][1];
	          diffs.splice(pointer, 1);
	        } else {
	          pointer++;
	        }
	        count_insert = 0;
	        count_delete = 0;
	        text_delete = '';
	        text_insert = '';
	        break;
	    }
	  }
	  if (diffs[diffs.length - 1][1] === '') {
	    diffs.pop();  // Remove the dummy entry at the end.
	  }

	  // Second pass: look for single edits surrounded on both sides by equalities
	  // which can be shifted sideways to eliminate an equality.
	  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
	  var changes = false;
	  pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
	        diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      if (diffs[pointer][1].substring(diffs[pointer][1].length -
	          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
	        // Shift the edit over the previous equality.
	        diffs[pointer][1] = diffs[pointer - 1][1] +
	            diffs[pointer][1].substring(0, diffs[pointer][1].length -
	                                        diffs[pointer - 1][1].length);
	        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
	        diffs.splice(pointer - 1, 1);
	        changes = true;
	      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
	          diffs[pointer + 1][1]) {
	        // Shift the edit over the next equality.
	        diffs[pointer - 1][1] += diffs[pointer + 1][1];
	        diffs[pointer][1] =
	            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
	            diffs[pointer + 1][1];
	        diffs.splice(pointer + 1, 1);
	        changes = true;
	      }
	    }
	    pointer++;
	  }
	  // If shifts were made, the diff needs reordering and another shift sweep.
	  if (changes) {
	    diff_cleanupMerge(diffs);
	  }
	};


	var diff = diff_main;
	diff.INSERT = DIFF_INSERT;
	diff.DELETE = DIFF_DELETE;
	diff.EQUAL = DIFF_EQUAL;

	module.exports = diff;

	/*
	 * Modify a diff such that the cursor position points to the start of a change:
	 * E.g.
	 *   cursor_normalize_diff([[DIFF_EQUAL, 'abc']], 1)
	 *     => [1, [[DIFF_EQUAL, 'a'], [DIFF_EQUAL, 'bc']]]
	 *   cursor_normalize_diff([[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xyz']], 2)
	 *     => [2, [[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xy'], [DIFF_DELETE, 'z']]]
	 *
	 * @param {Array} diffs Array of diff tuples
	 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
	 * @return {Array} A tuple [cursor location in the modified diff, modified diff]
	 */
	function cursor_normalize_diff (diffs, cursor_pos) {
	  if (cursor_pos === 0) {
	    return [DIFF_EQUAL, diffs];
	  }
	  for (var current_pos = 0, i = 0; i < diffs.length; i++) {
	    var d = diffs[i];
	    if (d[0] === DIFF_DELETE || d[0] === DIFF_EQUAL) {
	      var next_pos = current_pos + d[1].length;
	      if (cursor_pos === next_pos) {
	        return [i + 1, diffs];
	      } else if (cursor_pos < next_pos) {
	        // copy to prevent side effects
	        diffs = diffs.slice();
	        // split d into two diff changes
	        var split_pos = cursor_pos - current_pos;
	        var d_left = [d[0], d[1].slice(0, split_pos)];
	        var d_right = [d[0], d[1].slice(split_pos)];
	        diffs.splice(i, 1, d_left, d_right);
	        return [i + 1, diffs];
	      } else {
	        current_pos = next_pos;
	      }
	    }
	  }
	  throw new Error('cursor_pos is out of bounds!')
	}

	/*
	 * Modify a diff such that the edit position is "shifted" to the proposed edit location (cursor_position).
	 *
	 * Case 1)
	 *   Check if a naive shift is possible:
	 *     [0, X], [ 1, Y] -> [ 1, Y], [0, X]    (if X + Y === Y + X)
	 *     [0, X], [-1, Y] -> [-1, Y], [0, X]    (if X + Y === Y + X) - holds same result
	 * Case 2)
	 *   Check if the following shifts are possible:
	 *     [0, 'pre'], [ 1, 'prefix'] -> [ 1, 'pre'], [0, 'pre'], [ 1, 'fix']
	 *     [0, 'pre'], [-1, 'prefix'] -> [-1, 'pre'], [0, 'pre'], [-1, 'fix']
	 *         ^            ^
	 *         d          d_next
	 *
	 * @param {Array} diffs Array of diff tuples
	 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
	 * @return {Array} Array of diff tuples
	 */
	function fix_cursor (diffs, cursor_pos) {
	  var norm = cursor_normalize_diff(diffs, cursor_pos);
	  var ndiffs = norm[1];
	  var cursor_pointer = norm[0];
	  var d = ndiffs[cursor_pointer];
	  var d_next = ndiffs[cursor_pointer + 1];

	  if (d == null) {
	    // Text was deleted from end of original string,
	    // cursor is now out of bounds in new string
	    return diffs;
	  } else if (d[0] !== DIFF_EQUAL) {
	    // A modification happened at the cursor location.
	    // This is the expected outcome, so we can return the original diff.
	    return diffs;
	  } else {
	    if (d_next != null && d[1] + d_next[1] === d_next[1] + d[1]) {
	      // Case 1)
	      // It is possible to perform a naive shift
	      ndiffs.splice(cursor_pointer, 2, d_next, d)
	      return merge_tuples(ndiffs, cursor_pointer, 2)
	    } else if (d_next != null && d_next[1].indexOf(d[1]) === 0) {
	      // Case 2)
	      // d[1] is a prefix of d_next[1]
	      // We can assume that d_next[0] !== 0, since d[0] === 0
	      // Shift edit locations..
	      ndiffs.splice(cursor_pointer, 2, [d_next[0], d[1]], [0, d[1]]);
	      var suffix = d_next[1].slice(d[1].length);
	      if (suffix.length > 0) {
	        ndiffs.splice(cursor_pointer + 2, 0, [d_next[0], suffix]);
	      }
	      return merge_tuples(ndiffs, cursor_pointer, 3)
	    } else {
	      // Not possible to perform any modification
	      return diffs;
	    }
	  }

	}

	/*
	 * Try to merge tuples with their neigbors in a given range.
	 * E.g. [0, 'a'], [0, 'b'] -> [0, 'ab']
	 *
	 * @param {Array} diffs Array of diff tuples.
	 * @param {Int} start Position of the first element to merge (diffs[start] is also merged with diffs[start - 1]).
	 * @param {Int} length Number of consecutive elements to check.
	 * @return {Array} Array of merged diff tuples.
	 */
	function merge_tuples (diffs, start, length) {
	  // Check from (start-1) to (start+length).
	  for (var i = start + length - 1; i >= 0 && i >= start - 1; i--) {
	    if (i + 1 < diffs.length) {
	      var left_d = diffs[i];
	      var right_d = diffs[i+1];
	      if (left_d[0] === right_d[1]) {
	        diffs.splice(i, 2, [left_d[0], left_d[1] + right_d[1]]);
	      }
	    }
	  }
	  return diffs;
	}


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var events = ['input'];

	var TextareaBinder = function () {
	  function TextareaBinder() {
	    _classCallCheck(this, TextareaBinder);
	  }

	  _createClass(TextareaBinder, null, [{
	    key: 'bind',
	    value: function bind(string, element) {
	      var ignore = false;

	      function snapshot() {
	        if (ignore) return;

	        string.set(element.value);
	      }

	      events.forEach(function (event) {
	        element.addEventListener(event, snapshot);
	      });

	      function insertText(e) {
	        if (e.local) return;

	        ignore = true;
	        try {
	          var start = element.selectionStart;
	          var end = element.selectionEnd;

	          var length = e.value.length;

	          element.value = element.value.substring(0, e.index) + e.value + element.value.substring(e.index);

	          if (start > e.index) start += length;
	          if (end > e.index) end += length;

	          element.selectionStart = start;
	          element.selectionEnd = end;
	        } finally {
	          ignore = false;
	        }
	      }

	      function deleteText(e) {
	        if (e.local) return;

	        ignore = true;
	        try {
	          var start = element.selectionStart;
	          var end = element.selectionEnd;

	          var length = e.value.length;

	          element.value = element.value.substring(0, e.fromIndex) + element.value.substring(e.toIndex);

	          if (start > e.fromIndex) start = Math.max(e.fromIndex, start - length);
	          if (end > e.fromIndex) end = Math.max(e.fromIndex, end - length);

	          element.selectionStart = start;
	          element.selectionEnd = end;
	        } finally {
	          ignore = false;
	        }
	      }

	      string.on('insert', insertText);
	      string.on('delete', deleteText);

	      element.value = string.get();

	      return {
	        disconnect: function disconnect() {
	          string.removeEventListener('insert', insertText);
	          string.removeEventListener('delete', deleteText);

	          events.forEach(function (event) {
	            element.removeEventListener(event, snapshot);
	          });
	        }
	      };
	    }
	  }]);

	  return TextareaBinder;
	}();

	module.exports = TextareaBinder;

/***/ })
/******/ ]);