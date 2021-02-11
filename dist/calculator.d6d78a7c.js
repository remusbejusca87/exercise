// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"calculator.js":[function(require,module,exports) {
var rezultatTotal = 0;
var memorie = "0";
var operatiaAnterioara = null;
var ecran = document.querySelector(".ecran");

function clickButon(value) {
  if (isNaN(parseInt(value))) {
    // in cazul in care 'value' nu este un numar, se fol. "isNaN", iar "parseInt" transforma stringul de tip numar in numar!
    handleSymbol(value); //  din moment ce valule nu va fi un numar, va fi un simbol deci se aplica "handleSymbol"
  } else {
    handleNumber(value); //in caz contrar, va fi un numar, deci se aplica "handleNumber"
  }

  randarePeEcran();
}

function handleNumber(value) {
  if (memorie === "0") {
    // cand pe ecran e zero, orice buton apasat va inlocui zero cu valoarea butonului respectiv.
    memorie = value;
  } else {
    memorie += value; // in caz contrar, la valorea de pe ecran se adauga la capat val. butonului apasat cu "+=" 
  }
}

function handleSymbol(value) {
  switch (value) {
    case "C":
      //se aplica atunci cand se apasa butonul "C" (clear)
      memorie = "0";
      rezultatTotal = 0;
      operatiaAnterioara = null;
      break;
    //se aplica tot timpul la sfarsit atunci cand se doreste sa se intrerupa functia de mai sus.

    case "=":
      // se aplica atunci cand se apasa butonul "="
      if (operatiaAnterioara === null) {
        return; // "return" NU afiseaza nimic, ori de cate ori e apasat "=", acesta avand nevoie de 2 numere sa returneze rezultat.
      }

      aplicaOperatiaAnterioara(parseInt(memorie)); // se aplica operatiile anterioare apasarii butonului "="

      operatiaAnterioara = null;
      memorie = "" + rezultatTotal;
      rezultatTotal = 0;
      break;

    case '&#8592':
      // se aplica atunci cand se apasa butonul "<-" (backspace)
      if (memorie.length === 1) {
        //cand se apasa butonul "<-", orice numar ar fi pe ecran, format dintr-o singura cifra, devine zero!
        memorie = "0";
      } else {
        memorie = memorie.substring(0, memorie.length - 1); // orice nr. ar fi pe ecran, format din =>2 cifre, se scade ultima cifra din numar!
      }

      break;

    default:
      // se aplica atunci cand nici unul dintre "case" de mai sus nu se aplica, adica se vor aplica operatii (+,-,x,/)
      handleMath(value);
      break;
  }
}

function handleMath(value) {
  if (memorie === "0") {
    // nu face nimic
    return;
  }

  var intMemorie = parseInt(memorie);

  if (rezultatTotal === 0) {
    // cand se executa orice operatie, numarul de pe ecran devine noul "rezultat total"
    rezultatTotal = intMemorie;
  } else {
    aplicaOperatiaAnterioara(intMemorie); // in caz contrar se aplica operatia anterioara pentru noua valoare, care va fi noul "rezultat total"
  }

  operatiaAnterioara = value;
  memorie = "0"; // dupa executarea operatiei se asteapta noul numar care se va apasa si aparea pe ecran
}

function aplicaOperatiaAnterioara(intMemorie) {
  if (operatiaAnterioara === "+") {
    rezultatTotal += intMemorie;
  } else if (operatiaAnterioara === "-") {
    rezultatTotal -= intMemorie;
  } else if (operatiaAnterioara === "x") {
    rezultatTotal *= intMemorie;
  } else {
    rezultatTotal /= intMemorie;
  }
}

function randarePeEcran() {
  // functie ce face ca valorile butoanelor apasate sa apara pe ecran
  ecran.innerText = memorie;
}

document.querySelector(".butoane").addEventListener("click", function (event) {
  clickButon(event.target.innerText);
});
},{}],"C:/Users/remus/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65343" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/remus/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","calculator.js"], null)
//# sourceMappingURL=/calculator.d6d78a7c.js.map