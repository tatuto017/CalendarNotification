function notice() {
}
function removeReminders() {
}
function createTrigger() {
}/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/CalendarNotification.ts":
/*!*************************************!*\
  !*** ./src/CalendarNotification.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CalendarNotification; });
class CalendarNotification {
    constructor(token, message) {
        this.line_notify_url = 'https://notify-api.line.me/api/notify';
        this.token = token;
        this.message = message;
    }
    createTrigger(hour) {
        ScriptApp.getProjectTriggers().forEach(trigger => {
            if (trigger.getHandlerFunction() == "notice" || trigger.getHandlerFunction() == "removeReminders") {
                ScriptApp.deleteTrigger(trigger);
            }
        });
        ScriptApp.newTrigger("notice").timeBased().atHour(hour).everyDays(1).create();
        hour = hour == 0 ? 23 : hour - 1;
        ScriptApp.newTrigger("removeReminders").timeBased().atHour(hour).everyDays(1).create();
    }
    notice() {
        const calendar = CalendarApp.getDefaultCalendar();
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
        calendar.getEventsForDay(date).forEach(event => {
            this.message = this.message.replace('%title%', event.getTitle());
            this.notify(this.message);
        });
    }
    removeReminders() {
        const calendar = CalendarApp.getDefaultCalendar();
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
        calendar.getEventsForDay(date).forEach(event => {
            event.removeAllReminders();
        });
    }
    notify(messsage) {
        UrlFetchApp.fetch(this.line_notify_url, {
            "method": "post",
            "payload": "message=" + messsage,
            "headers": { "Authorization": "Bearer " + this.token }
        });
    }
}


/***/ }),

/***/ "./src/functions.ts":
/*!**************************!*\
  !*** ./src/functions.ts ***!
  \**************************/
/*! exports provided: getProp, setProp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getProp", function() { return getProp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setProp", function() { return setProp; });
const getProp = (key) => {
    return (PropertiesService.getScriptProperties().getProperty(key) || '');
};
const setProp = (key, value) => {
    PropertiesService.getScriptProperties().setProperty(key, value);
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _CalendarNotification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CalendarNotification */ "./src/CalendarNotification.ts");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functions */ "./src/functions.ts");


const app = new _CalendarNotification__WEBPACK_IMPORTED_MODULE_0__["default"](Object(_functions__WEBPACK_IMPORTED_MODULE_1__["getProp"])('LineToken'), '明日は%title%の日です。');
global.notice = () => app.notice();
global.removeReminders = () => app.removeReminders();
global.createTrigger = () => app.createTrigger(22);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2FsZW5kYXJOb3RpZmljYXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Z1bmN0aW9ucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtDQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLENBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsSUFBMEU7UUFDMUU7UUFDQSxpQ0FBK0Q7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxVQUFpQztRQUMxRSw2QkFBcUk7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSxJQUF1RDtRQUNQO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLDhDQUFxSDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7Ozs7OztBQ25CQTtBQUFBO0FBQWUsTUFBTSxvQkFBb0I7QUFLTztRQUo1QixLQUFtRTtRQUsvRSxJQUFJLENBQUMsS0FBSyxHQUFLLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRU0sYUFBYSxDQUFDLElBQWE7UUFDOUIsU0FBUyxDQUFDLGtCQUFrQixFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzdDLElBQUksT0FBTyxDQUFDLEdBQXVGO2dCQUNqRyxTQUFTLENBQUMsS0FBdUI7S0FDbEM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQTRCO1FBQzlFLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDakMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQStDO0lBQzNGLENBQUM7SUFFTSxNQUFNO1FBQ1QsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLEdBQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBaUU7UUFFckcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7S0FDc0I7WUFDakUsRUFBMEI7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sZUFBZTtRQUNsQixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNsRCxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQXVFO1FBQ2pHLEdBQStDO0tBQ2hCO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVTLE1BQU0sQ0FBQyxRQUFpQjtRQUM5QixXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDcEMsUUFBUSxFQUFJLE1BQU07V0FDZTtLQUNzQjtTQUMxRCxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7QUMvQ0Q7QUFBQTtBQUFBO0FBQXdDO0lBQ3BDLE9BQU8sQ0FBQyxDQUFnRTtBQUM1RSxDQUFDO0FBRU0sTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFZLEVBQUUsS0FBYyxFQUFFLEVBQUU7SUFDcEQsaUJBQWlCLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3BFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNORDtBQUFBO0FBQUE7QUFBMEQ7QUFDWDtBQU0vQyxNQUFNLEdBQUcsR0FBRyxJQUFJLDJCQUE4RDtBQUU5RSxNQUFNLENBQUMsTUFBTSxHQUFZLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM1QyxNQUFNLENBQUMsZUFBZSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxlbmRhck5vdGlmaWNhdGlvbiB7XG4gICAgcHVibGljIHJlYWRvbmx5IGxpbmVfbm90aWZ5X3VybCA6IHN0cmluZyA9ICdodHRwczovL25vdGlmeS1hcGkubGluZS5tZS9hcGkvbm90aWZ5JztcbiAgICBwcml2YXRlIHRva2VuICAgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBtZXNzYWdlIDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodG9rZW4gOiBzdHJpbmcsIG1lc3NhZ2UgOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50b2tlbiAgID0gdG9rZW47XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVRyaWdnZXIoaG91ciA6IG51bWJlcikge1xuICAgICAgICBTY3JpcHRBcHAuZ2V0UHJvamVjdFRyaWdnZXJzKCkuZm9yRWFjaCh0cmlnZ2VyID0+IHtcbiAgICAgICAgICAgIGlmICh0cmlnZ2VyLmdldEhhbmRsZXJGdW5jdGlvbigpID09IFwibm90aWNlXCIgfHwgdHJpZ2dlci5nZXRIYW5kbGVyRnVuY3Rpb24oKSA9PSBcInJlbW92ZVJlbWluZGVyc1wiKSB7XG4gICAgICAgICAgICAgIFNjcmlwdEFwcC5kZWxldGVUcmlnZ2VyKHRyaWdnZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIFNjcmlwdEFwcC5uZXdUcmlnZ2VyKFwibm90aWNlXCIpLnRpbWVCYXNlZCgpLmF0SG91cihob3VyKS5ldmVyeURheXMoMSkuY3JlYXRlKCk7XG4gICAgICAgIGhvdXIgPSBob3VyID09IDAgPyAyMyA6IGhvdXIgLSAxO1xuICAgICAgICBTY3JpcHRBcHAubmV3VHJpZ2dlcihcInJlbW92ZVJlbWluZGVyc1wiKS50aW1lQmFzZWQoKS5hdEhvdXIoaG91cikuZXZlcnlEYXlzKDEpLmNyZWF0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3RpY2UoKSB7XG4gICAgICAgIGNvbnN0IGNhbGVuZGFyID0gQ2FsZW5kYXJBcHAuZ2V0RGVmYXVsdENhbGVuZGFyKCk7XG4gICAgICAgIGNvbnN0IGRhdGUgICAgID0gbmV3IERhdGUobmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLCBuZXcgRGF0ZSgpLmdldE1vbnRoKCksIG5ldyBEYXRlKCkuZ2V0RGF0ZSgpICsgMSk7XG4gICAgICAgIFxuICAgICAgICBjYWxlbmRhci5nZXRFdmVudHNGb3JEYXkoZGF0ZSkuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2UucmVwbGFjZSgnJXRpdGxlJScsIGV2ZW50LmdldFRpdGxlKCkpO1xuICAgICAgICAgICAgdGhpcy5ub3RpZnkodGhpcy5tZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZVJlbWluZGVycygpIHtcbiAgICAgICAgY29uc3QgY2FsZW5kYXIgPSBDYWxlbmRhckFwcC5nZXREZWZhdWx0Q2FsZW5kYXIoKTtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSwgbmV3IERhdGUoKS5nZXRNb250aCgpLCBuZXcgRGF0ZSgpLmdldERhdGUoKeOAgCsgMSk7XG4gICAgICAgIGNhbGVuZGFyLmdldEV2ZW50c0ZvckRheShkYXRlKS5mb3JFYWNoKGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnJlbW92ZUFsbFJlbWluZGVycygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbm90aWZ5KG1lc3NzYWdlIDogc3RyaW5nKSB7XG4gICAgICAgIFVybEZldGNoQXBwLmZldGNoKHRoaXMubGluZV9ub3RpZnlfdXJsLCB7XG4gICAgICAgICAgICBcIm1ldGhvZFwiICA6IFwicG9zdFwiLFxuICAgICAgICAgICAgXCJwYXlsb2FkXCIgOiBcIm1lc3NhZ2U9XCIgKyBtZXNzc2FnZSxcbiAgICAgICAgICAgIFwiaGVhZGVyc1wiIDoge1wiQXV0aG9yaXphdGlvblwiIDogXCJCZWFyZXIgXCIgKyB0aGlzLnRva2VuIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSIsImV4cG9ydCBjb25zdCBnZXRQcm9wID0gKGtleSA6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiAoUHJvcGVydGllc1NlcnZpY2UuZ2V0U2NyaXB0UHJvcGVydGllcygpLmdldFByb3BlcnR5KGtleSkgfHwgJycpO1xufVxuICBcbmV4cG9ydCBjb25zdCBzZXRQcm9wID0gKGtleSA6IHN0cmluZywgdmFsdWUgOiBzdHJpbmcpID0+IHtcbiAgICBQcm9wZXJ0aWVzU2VydmljZS5nZXRTY3JpcHRQcm9wZXJ0aWVzKCkuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSk7XG59XG4iLCJpbXBvcnQgQ2FsZW5kYXJOb3RpZmljYXRpb24gZnJvbSAnLi9DYWxlbmRhck5vdGlmaWNhdGlvbic7XHJcbmltcG9ydCB7IGdldFByb3AgfSAgICAgICAgICBmcm9tICcuL2Z1bmN0aW9ucyc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGdsb2JhbDoge1xyXG4gIFt4OiBzdHJpbmddOiBhbnk7XHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBDYWxlbmRhck5vdGlmaWNhdGlvbihnZXRQcm9wKCdMaW5lVG9rZW4nKSwgJ+aYjuaXpeOBryV0aXRsZSXjga7ml6XjgafjgZnjgIInKTtcclxuXHJcbmdsb2JhbC5ub3RpY2UgICAgICAgICAgPSAoKSA9PiBhcHAubm90aWNlKCk7XHJcbmdsb2JhbC5yZW1vdmVSZW1pbmRlcnMgPSAoKSA9PiBhcHAucmVtb3ZlUmVtaW5kZXJzKCk7XHJcbmdsb2JhbC5jcmVhdGVUcmlnZ2VyID0gICAoKSA9PiBhcHAuY3JlYXRlVHJpZ2dlcigyMik7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=