"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/zotero-plugin-toolkit/dist/utils/debugBridge.js
  var require_debugBridge = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/utils/debugBridge.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DebugBridge = void 0;
      var basic_1 = require_basic();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
      var DebugBridge = class _DebugBridge {
        get version() {
          return _DebugBridge.version;
        }
        get disableDebugBridgePassword() {
          return this._disableDebugBridgePassword;
        }
        set disableDebugBridgePassword(value) {
          this._disableDebugBridgePassword = value;
        }
        get password() {
          return basic_1.BasicTool.getZotero().Prefs.get(_DebugBridge.passwordPref, true);
        }
        set password(v) {
          basic_1.BasicTool.getZotero().Prefs.set(_DebugBridge.passwordPref, v, true);
        }
        constructor() {
          this._disableDebugBridgePassword = false;
          this.initializeDebugBridge();
        }
        static setModule(instance) {
          var _a;
          if (!((_a = instance.debugBridge) === null || _a === void 0 ? void 0 : _a.version) || instance.debugBridge.version < _DebugBridge.version) {
            instance.debugBridge = new _DebugBridge();
          }
        }
        initializeDebugBridge() {
          const debugBridgeExtension = {
            noContent: true,
            doAction: async (uri) => {
              var _a;
              const Zotero2 = basic_1.BasicTool.getZotero();
              const window2 = Zotero2.getMainWindow();
              const uriString = uri.spec.split("//").pop();
              if (!uriString) {
                return;
              }
              const params = {};
              (_a = uriString.split("?").pop()) === null || _a === void 0 ? void 0 : _a.split("&").forEach((p) => {
                params[p.split("=")[0]] = decodeURIComponent(p.split("=")[1]);
              });
              const skipPasswordCheck = toolkitGlobal_1.default.getInstance().debugBridge.disableDebugBridgePassword;
              let allowed = false;
              if (skipPasswordCheck) {
                allowed = true;
              } else {
                if (typeof params.password === "undefined" && typeof this.password === "undefined") {
                  allowed = window2.confirm(`External App ${params.app} wants to execute command without password.
Command:
${(params.run || params.file || "").slice(0, 100)}
If you do not know what it is, please click Cancel to deny.`);
                } else {
                  allowed = this.password === params.password;
                }
              }
              if (allowed) {
                if (params.run) {
                  try {
                    const AsyncFunction = Object.getPrototypeOf(async function() {
                    }).constructor;
                    const f = new AsyncFunction("Zotero,window", params.run);
                    await f(Zotero2, window2);
                  } catch (e) {
                    Zotero2.debug(e);
                    window2.console.log(e);
                  }
                }
                if (params.file) {
                  try {
                    Services.scriptloader.loadSubScript(params.file, {
                      Zotero: Zotero2,
                      window: window2
                    });
                  } catch (e) {
                    Zotero2.debug(e);
                    window2.console.log(e);
                  }
                }
              }
            },
            newChannel: function(uri) {
              this.doAction(uri);
            }
          };
          Services.io.getProtocolHandler("zotero").wrappedJSObject._extensions["zotero://ztoolkit-debug"] = debugBridgeExtension;
        }
      };
      exports.DebugBridge = DebugBridge;
      DebugBridge.version = 2;
      DebugBridge.passwordPref = "extensions.zotero.debug-bridge.password";
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/utils/pluginBridge.js
  var require_pluginBridge = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/utils/pluginBridge.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PluginBridge = void 0;
      var basic_1 = require_basic();
      var PluginBridge = class _PluginBridge {
        get version() {
          return _PluginBridge.version;
        }
        constructor() {
          this.initializePluginBridge();
        }
        static setModule(instance) {
          var _a;
          if (!((_a = instance.pluginBridge) === null || _a === void 0 ? void 0 : _a.version) || instance.pluginBridge.version < _PluginBridge.version) {
            instance.pluginBridge = new _PluginBridge();
          }
        }
        initializePluginBridge() {
          const { AddonManager } = ChromeUtils.import("resource://gre/modules/AddonManager.jsm");
          const Zotero2 = basic_1.BasicTool.getZotero();
          const pluginBridgeExtension = {
            noContent: true,
            doAction: async (uri) => {
              var _a;
              try {
                const uriString = uri.spec.split("//").pop();
                if (!uriString) {
                  return;
                }
                const params = {};
                (_a = uriString.split("?").pop()) === null || _a === void 0 ? void 0 : _a.split("&").forEach((p) => {
                  params[p.split("=")[0]] = decodeURIComponent(p.split("=")[1]);
                });
                if (params.action === "install" && params.url) {
                  if (params.minVersion && Services.vc.compare(Zotero2.version, params.minVersion) < 0 || params.maxVersion && Services.vc.compare(Zotero2.version, params.maxVersion) > 0) {
                    throw new Error(`Plugin is not compatible with Zotero version ${Zotero2.version}.The plugin requires Zotero version between ${params.minVersion} and ${params.maxVersion}.`);
                  }
                  const addon = await AddonManager.getInstallForURL(params.url);
                  if (addon && addon.state === AddonManager.STATE_AVAILABLE) {
                    addon.install();
                    hint("Plugin installed successfully.", true);
                  } else {
                    throw new Error(`Plugin ${params.url} is not available.`);
                  }
                }
              } catch (e) {
                Zotero2.logError(e);
                hint(e.message, false);
              }
            },
            newChannel: function(uri) {
              this.doAction(uri);
            }
          };
          Services.io.getProtocolHandler("zotero").wrappedJSObject._extensions["zotero://plugin"] = pluginBridgeExtension;
        }
      };
      exports.PluginBridge = PluginBridge;
      PluginBridge.version = 1;
      function hint(content, success) {
        const progressWindow = new Zotero.ProgressWindow({ closeOnClick: true });
        progressWindow.changeHeadline("Plugin Toolkit");
        progressWindow.progress = new progressWindow.ItemProgress(success ? "chrome://zotero/skin/tick.png" : "chrome://zotero/skin/cross.png", content);
        progressWindow.progress.setProgress(100);
        progressWindow.show();
        progressWindow.startCloseTimer(5e3);
      }
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/toolkitGlobal.js
  var require_toolkitGlobal = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/toolkitGlobal.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ToolkitGlobal = void 0;
      var basic_1 = require_basic();
      var debugBridge_1 = require_debugBridge();
      var pluginBridge_1 = require_pluginBridge();
      var ToolkitGlobal = class _ToolkitGlobal {
        constructor() {
          initializeModules(this);
          this.currentWindow = basic_1.BasicTool.getZotero().getMainWindow();
        }
        /**
         * Get the global unique instance of `class ToolkitGlobal`.
         * @returns An instance of `ToolkitGlobal`.
         */
        static getInstance() {
          const Zotero2 = basic_1.BasicTool.getZotero();
          let requireInit = false;
          if (!("_toolkitGlobal" in Zotero2)) {
            Zotero2._toolkitGlobal = new _ToolkitGlobal();
            requireInit = true;
          }
          const currentGlobal = Zotero2._toolkitGlobal;
          if (currentGlobal.currentWindow !== Zotero2.getMainWindow()) {
            checkWindowDependentModules(currentGlobal);
            requireInit = true;
          }
          if (requireInit) {
            initializeModules(currentGlobal);
          }
          return currentGlobal;
        }
      };
      exports.ToolkitGlobal = ToolkitGlobal;
      function initializeModules(instance) {
        setModule(instance, "fieldHooks", {
          _ready: false,
          getFieldHooks: {},
          setFieldHooks: {},
          isFieldOfBaseHooks: {}
        });
        setModule(instance, "itemTree", {
          _ready: false,
          columns: [],
          renderCellHooks: {}
        });
        setModule(instance, "itemBox", {
          _ready: false,
          fieldOptions: {}
        });
        setModule(instance, "shortcut", {
          _ready: false,
          eventKeys: []
        });
        setModule(instance, "prompt", {
          _ready: false,
          instance: void 0
        });
        setModule(instance, "readerInstance", {
          _ready: false,
          initializedHooks: {}
        });
        debugBridge_1.DebugBridge.setModule(instance);
        pluginBridge_1.PluginBridge.setModule(instance);
      }
      function setModule(instance, key, module2) {
        var _a;
        var _b;
        if (!module2) {
          return;
        }
        if (!instance[key]) {
          instance[key] = module2;
        }
        for (const moduleKey in module2) {
          (_a = (_b = instance[key])[moduleKey]) !== null && _a !== void 0 ? _a : _b[moduleKey] = module2[moduleKey];
        }
      }
      function checkWindowDependentModules(instance) {
        instance.currentWindow = basic_1.BasicTool.getZotero().getMainWindow();
        instance.itemTree = void 0;
        instance.itemBox = void 0;
        instance.shortcut = void 0;
        instance.prompt = void 0;
        instance.readerInstance = void 0;
      }
      exports.default = ToolkitGlobal;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/basic.js
  var require_basic = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/basic.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ManagerTool = exports.BasicTool = void 0;
      exports.unregister = unregister2;
      exports.makeHelperTool = makeHelperTool;
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
      var BasicTool = class _BasicTool {
        get basicOptions() {
          return this._basicOptions;
        }
        /**
         *
         * @param basicTool Pass an BasicTool instance to copy its options.
         */
        constructor(data) {
          this.patchSign = "zotero-plugin-toolkit@2.0.0";
          this._basicOptions = {
            log: {
              _type: "toolkitlog",
              disableConsole: false,
              disableZLog: false,
              prefix: ""
            },
            debug: toolkitGlobal_1.default.getInstance().debugBridge,
            api: {
              pluginID: "zotero-plugin-toolkit@windingwind.com"
            },
            listeners: {
              callbacks: {
                onMainWindowLoad: /* @__PURE__ */ new Set(),
                onMainWindowUnload: /* @__PURE__ */ new Set(),
                onPluginUnload: /* @__PURE__ */ new Set()
              },
              _mainWindow: void 0,
              _plugin: void 0
            }
          };
          this.updateOptions(data);
          return;
        }
        getGlobal(k) {
          const _Zotero = typeof Zotero !== "undefined" ? Zotero : (
            // @ts-ignore
            Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject
          );
          try {
            const window2 = _Zotero.getMainWindow();
            switch (k) {
              case "Zotero":
              case "zotero":
                return _Zotero;
              case "window":
                return window2;
              case "windows":
                return _Zotero.getMainWindows();
              case "document":
                return window2.document;
              case "ZoteroPane":
              case "ZoteroPane_Local":
                return _Zotero.getActiveZoteroPane();
              default:
                return window2[k];
            }
          } catch (e) {
            Zotero.logError(e);
          }
        }
        /**
         * Check if it's running on Zotero 7 (Firefox 102)
         */
        isZotero7() {
          return Zotero.platformMajorVersion >= 102;
        }
        isFX115() {
          return Zotero.platformMajorVersion >= 115;
        }
        /**
         * Get DOMParser.
         *
         * For Zotero 6: mainWindow.DOMParser or nsIDOMParser
         *
         * For Zotero 7: Firefox 102 support DOMParser natively
         */
        getDOMParser() {
          if (this.isZotero7()) {
            return new (this.getGlobal("DOMParser"))();
          }
          try {
            return new (this.getGlobal("DOMParser"))();
          } catch (e) {
            return Components.classes[
              "@mozilla.org/xmlextras/domparser;1"
              // @ts-ignore
            ].createInstance(Components.interfaces.nsIDOMParser);
          }
        }
        /**
         * If it's an XUL element
         * @param elem
         */
        isXULElement(elem) {
          return elem.namespaceURI === "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        }
        /**
         * Create an XUL element
         *
         * For Zotero 6, use `createElementNS`;
         *
         * For Zotero 7+, use `createXULElement`.
         * @param doc
         * @param type
         * @example
         * Create a `<menuitem>`:
         * ```ts
         * const compat = new ZoteroCompat();
         * const doc = compat.getWindow().document;
         * const elem = compat.createXULElement(doc, "menuitem");
         * ```
         */
        createXULElement(doc, type) {
          if (this.isZotero7()) {
            return doc.createXULElement(type);
          } else {
            return doc.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", type);
          }
        }
        /**
         * Output to both Zotero.debug and console.log
         * @param data e.g. string, number, object, ...
         */
        log(...data) {
          var _a;
          if (data.length === 0) {
            return;
          }
          const Zotero2 = this.getGlobal("Zotero");
          const console = this.getGlobal("console");
          let options;
          if (((_a = data[data.length - 1]) === null || _a === void 0 ? void 0 : _a._type) === "toolkitlog") {
            options = data.pop();
          } else {
            options = this._basicOptions.log;
          }
          try {
            if (options.prefix) {
              data.splice(0, 0, options.prefix);
            }
            if (!options.disableConsole) {
              console.groupCollapsed(...data);
              console.trace();
              console.groupEnd();
            }
            if (!options.disableZLog) {
              Zotero2.debug(data.map((d) => {
                try {
                  return typeof d === "object" ? JSON.stringify(d) : String(d);
                } catch (e) {
                  Zotero2.debug(d);
                  return "";
                }
              }).join("\n"));
            }
          } catch (e) {
            console.error(e);
            Zotero2.logError(e);
          }
        }
        /**
         * Patch a function
         * @deprecated Use {@link PatchHelper} instead.
         * @param object The owner of the function
         * @param funcSign The signature of the function(function name)
         * @param ownerSign The signature of patch owner to avoid patching again
         * @param patcher The new wrapper of the patched function
         */
        patch(object, funcSign, ownerSign, patcher) {
          if (object[funcSign][ownerSign]) {
            throw new Error(`${String(funcSign)} re-patched`);
          }
          this.log("patching", funcSign, `by ${ownerSign}`);
          object[funcSign] = patcher(object[funcSign]);
          object[funcSign][ownerSign] = true;
        }
        /**
         * Add a Zotero event listener callback
         * @param type Event type
         * @param callback Event callback
         */
        addListenerCallback(type, callback) {
          if (["onMainWindowLoad", "onMainWindowUnload"].includes(type)) {
            this._ensureMainWindowListener();
          }
          if (type === "onPluginUnload") {
            this._ensurePluginListener();
          }
          this._basicOptions.listeners.callbacks[type].add(callback);
        }
        /**
         * Remove a Zotero event listener callback
         * @param type Event type
         * @param callback Event callback
         */
        removeListenerCallback(type, callback) {
          this._basicOptions.listeners.callbacks[type].delete(callback);
          this._ensureRemoveListener();
        }
        /**
         * Remove all Zotero event listener callbacks when the last callback is removed.
         */
        _ensureRemoveListener() {
          const { listeners } = this._basicOptions;
          if (listeners._mainWindow && listeners.callbacks.onMainWindowLoad.size === 0 && listeners.callbacks.onMainWindowUnload.size === 0) {
            Services.wm.removeListener(listeners._mainWindow);
            delete listeners._mainWindow;
          }
          if (listeners._plugin && listeners.callbacks.onPluginUnload.size === 0) {
            Zotero.Plugins.removeObserver(listeners._plugin);
            delete listeners._plugin;
          }
        }
        /**
         * Ensure the main window listener is registered.
         */
        _ensureMainWindowListener() {
          if (this._basicOptions.listeners._mainWindow) {
            return;
          }
          const mainWindowListener = {
            onOpenWindow: (xulWindow) => {
              const domWindow = xulWindow.docShell.domWindow;
              const onload = async () => {
                domWindow.removeEventListener("load", onload, false);
                if (domWindow.location.href !== "chrome://zotero/content/zoteroPane.xhtml") {
                  return;
                }
                for (const cbk of this._basicOptions.listeners.callbacks.onMainWindowLoad) {
                  try {
                    cbk(domWindow);
                  } catch (e) {
                    this.log(e);
                  }
                }
              };
              domWindow.addEventListener("load", () => onload(), false);
            },
            onCloseWindow: async (xulWindow) => {
              const domWindow = xulWindow.docShell.domWindow;
              if (domWindow.location.href !== "chrome://zotero/content/zoteroPane.xhtml") {
                return;
              }
              for (const cbk of this._basicOptions.listeners.callbacks.onMainWindowUnload) {
                try {
                  cbk(domWindow);
                } catch (e) {
                  this.log(e);
                }
              }
            }
          };
          this._basicOptions.listeners._mainWindow = mainWindowListener;
          Services.wm.addListener(mainWindowListener);
        }
        /**
         * Ensure the plugin listener is registered.
         */
        _ensurePluginListener() {
          if (this._basicOptions.listeners._plugin) {
            return;
          }
          const pluginListener = {
            shutdown: (...args) => {
              for (const cbk of this._basicOptions.listeners.callbacks.onPluginUnload) {
                try {
                  cbk(...args);
                } catch (e) {
                  this.log(e);
                }
              }
            }
          };
          this._basicOptions.listeners._plugin = pluginListener;
          Zotero.Plugins.addObserver(pluginListener);
        }
        updateOptions(source) {
          if (!source) {
            return this;
          }
          if (source instanceof _BasicTool) {
            this._basicOptions = source._basicOptions;
          } else {
            this._basicOptions = source;
          }
          return this;
        }
        static getZotero() {
          return typeof Zotero !== "undefined" ? Zotero : (
            // @ts-ignore
            Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject
          );
        }
      };
      exports.BasicTool = BasicTool;
      var ManagerTool = class extends BasicTool {
        _ensureAutoUnregisterAll() {
          this.addListenerCallback("onPluginUnload", (params, reason) => {
            if (params.id !== this.basicOptions.api.pluginID) {
              return;
            }
            this.unregisterAll();
          });
        }
      };
      exports.ManagerTool = ManagerTool;
      function unregister2(tools) {
        Object.values(tools).forEach((tool) => {
          if (tool instanceof ManagerTool || typeof (tool === null || tool === void 0 ? void 0 : tool.unregisterAll) === "function") {
            tool.unregisterAll();
          }
        });
      }
      function makeHelperTool(cls, options) {
        return new Proxy(cls, {
          construct(target, args) {
            const _origin = new cls(...args);
            if (_origin instanceof BasicTool) {
              _origin.updateOptions(options);
            }
            return _origin;
          }
        });
      }
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/tools/ui.js
  var require_ui = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/tools/ui.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.UITool = void 0;
      var basic_1 = require_basic();
      var UITool = class extends basic_1.BasicTool {
        get basicOptions() {
          return this._basicOptions;
        }
        constructor(base) {
          super(base);
          this.elementCache = [];
          if (!this._basicOptions.ui) {
            this._basicOptions.ui = {
              enableElementRecord: true,
              enableElementJSONLog: false,
              enableElementDOMLog: true
            };
          }
        }
        /**
         * Remove all elements created by `createElement`.
         *
         * @remarks
         * > What is this for?
         *
         * In bootstrap plugins, elements must be manually maintained and removed on exiting.
         *
         * This API does this for you.
         */
        unregisterAll() {
          this.elementCache.forEach((e) => {
            var _a;
            try {
              (_a = e === null || e === void 0 ? void 0 : e.deref()) === null || _a === void 0 ? void 0 : _a.remove();
            } catch (e2) {
              this.log(e2);
            }
          });
        }
        createElement(...args) {
          var _a, _b, _c;
          const doc = args[0];
          const tagName = args[1].toLowerCase();
          let props = args[2] || {};
          if (!tagName) {
            return;
          }
          if (typeof args[2] === "string") {
            props = {
              namespace: args[2],
              enableElementRecord: args[3]
            };
          }
          if (typeof props.enableElementJSONLog !== "undefined" && props.enableElementJSONLog || this.basicOptions.ui.enableElementJSONLog) {
            this.log(props);
          }
          props.properties = props.properties || props.directAttributes;
          props.children = props.children || props.subElementOptions;
          let elem;
          if (tagName === "fragment") {
            const fragElem = doc.createDocumentFragment();
            elem = fragElem;
          } else {
            let realElem = props.id && (props.checkExistenceParent ? props.checkExistenceParent : doc).querySelector(`#${props.id}`);
            if (realElem && props.ignoreIfExists) {
              return realElem;
            }
            if (realElem && props.removeIfExists) {
              realElem.remove();
              realElem = void 0;
            }
            if (props.customCheck && !props.customCheck(doc, props)) {
              return void 0;
            }
            if (!realElem || !props.skipIfExists) {
              let namespace = props.namespace;
              if (!namespace) {
                const mightHTML = HTMLElementTagNames.includes(tagName);
                const mightXUL = XULElementTagNames.includes(tagName);
                const mightSVG = SVGElementTagNames.includes(tagName);
                if (Number(mightHTML) + Number(mightXUL) + Number(mightSVG) > 1) {
                  this.log(`[Warning] Creating element ${tagName} with no namespace specified. Found multiply namespace matches.`);
                }
                if (mightHTML) {
                  namespace = "html";
                } else if (mightXUL) {
                  namespace = "xul";
                } else if (mightSVG) {
                  namespace = "svg";
                } else {
                  namespace = "html";
                }
              }
              if (namespace === "xul") {
                realElem = this.createXULElement(doc, tagName);
              } else {
                realElem = doc.createElementNS({
                  html: "http://www.w3.org/1999/xhtml",
                  svg: "http://www.w3.org/2000/svg"
                }[namespace], tagName);
              }
              if (typeof props.enableElementRecord !== "undefined" ? props.enableElementRecord : this.basicOptions.ui.enableElementRecord) {
                this.elementCache.push(new WeakRef(realElem));
              }
            }
            if (props.id) {
              realElem.id = props.id;
            }
            if (props.styles && Object.keys(props.styles).length) {
              Object.keys(props.styles).forEach((k) => {
                const v = props.styles[k];
                typeof v !== "undefined" && (realElem.style[k] = v);
              });
            }
            if (props.properties && Object.keys(props.properties).length) {
              Object.keys(props.properties).forEach((k) => {
                const v = props.properties[k];
                typeof v !== "undefined" && (realElem[k] = v);
              });
            }
            if (props.attributes && Object.keys(props.attributes).length) {
              Object.keys(props.attributes).forEach((k) => {
                const v = props.attributes[k];
                typeof v !== "undefined" && realElem.setAttribute(k, String(v));
              });
            }
            if ((_a = props.classList) === null || _a === void 0 ? void 0 : _a.length) {
              realElem.classList.add(...props.classList);
            }
            if ((_b = props.listeners) === null || _b === void 0 ? void 0 : _b.length) {
              props.listeners.forEach(({ type, listener, options }) => {
                listener && realElem.addEventListener(type, listener, options);
              });
            }
            elem = realElem;
          }
          if ((_c = props.children) === null || _c === void 0 ? void 0 : _c.length) {
            const subElements = props.children.map((childProps) => {
              childProps.namespace = childProps.namespace || props.namespace;
              return this.createElement(doc, childProps.tag, childProps);
            }).filter((e) => e);
            elem.append(...subElements);
          }
          if (typeof props.enableElementDOMLog !== "undefined" ? props.enableElementDOMLog : this.basicOptions.ui.enableElementDOMLog) {
            this.log(elem);
          }
          return elem;
        }
        /**
         * Append element(s) to a node.
         * @param properties See {@link ElementProps}
         * @param container The parent node to append to.
         * @returns A Node that is the appended child (aChild),
         *          except when aChild is a DocumentFragment,
         *          in which case the empty DocumentFragment is returned.
         */
        appendElement(properties, container) {
          return container.appendChild(this.createElement(container.ownerDocument, properties.tag, properties));
        }
        /**
         * Inserts a node before a reference node as a child of its parent node.
         * @param properties See {@link ElementProps}
         * @param referenceNode The node before which newNode is inserted.
         * @returns
         */
        insertElementBefore(properties, referenceNode) {
          if (referenceNode.parentNode)
            return referenceNode.parentNode.insertBefore(this.createElement(referenceNode.ownerDocument, properties.tag, properties), referenceNode);
          else
            this.log(referenceNode.tagName + " has no parent, cannot insert " + properties.tag);
        }
        /**
         * Replace oldNode with a new one.
         * @param properties See {@link ElementProps}
         * @param oldNode The child to be replaced.
         * @returns The replaced Node. This is the same node as oldChild.
         */
        replaceElement(properties, oldNode) {
          if (oldNode.parentNode)
            return oldNode.parentNode.replaceChild(this.createElement(oldNode.ownerDocument, properties.tag, properties), oldNode);
          else
            this.log(oldNode.tagName + " has no parent, cannot replace it with " + properties.tag);
        }
        /**
         * Parse XHTML to XUL fragment. For Zotero 6.
         *
         * To load preferences from a Zotero 7's `.xhtml`, use this method to parse it.
         * @param str xhtml raw text
         * @param entities dtd file list ("chrome://xxx.dtd")
         * @param defaultXUL true for default XUL namespace
         */
        parseXHTMLToFragment(str, entities = [], defaultXUL = true) {
          let parser = this.getDOMParser();
          const xulns = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
          const htmlns = "http://www.w3.org/1999/xhtml";
          const wrappedStr = `${entities.length ? `<!DOCTYPE bindings [ ${entities.reduce((preamble, url, index) => {
            return preamble + `<!ENTITY % _dtd-${index} SYSTEM "${url}"> %_dtd-${index}; `;
          }, "")}]>` : ""}
      <html:div xmlns="${defaultXUL ? xulns : htmlns}"
          xmlns:xul="${xulns}" xmlns:html="${htmlns}">
      ${str}
      </html:div>`;
          this.log(wrappedStr, parser);
          let doc = parser.parseFromString(wrappedStr, "text/xml");
          this.log(doc);
          if (doc.documentElement.localName === "parsererror") {
            throw new Error("not well-formed XHTML");
          }
          let range = doc.createRange();
          range.selectNodeContents(doc.querySelector("div"));
          return range.extractContents();
        }
      };
      exports.UITool = UITool;
      var HTMLElementTagNames = [
        "a",
        "abbr",
        "address",
        "area",
        "article",
        "aside",
        "audio",
        "b",
        "base",
        "bdi",
        "bdo",
        "blockquote",
        "body",
        "br",
        "button",
        "canvas",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "data",
        "datalist",
        "dd",
        "del",
        "details",
        "dfn",
        "dialog",
        "div",
        "dl",
        "dt",
        "em",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hgroup",
        "hr",
        "html",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "label",
        "legend",
        "li",
        "link",
        "main",
        "map",
        "mark",
        "menu",
        "meta",
        "meter",
        "nav",
        "noscript",
        "object",
        "ol",
        "optgroup",
        "option",
        "output",
        "p",
        "picture",
        "pre",
        "progress",
        "q",
        "rp",
        "rt",
        "ruby",
        "s",
        "samp",
        "script",
        "section",
        "select",
        "slot",
        "small",
        "source",
        "span",
        "strong",
        "style",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "template",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "title",
        "tr",
        "track",
        "u",
        "ul",
        "var",
        "video",
        "wbr"
      ];
      var XULElementTagNames = [
        "action",
        "arrowscrollbox",
        "bbox",
        "binding",
        "bindings",
        "box",
        "broadcaster",
        "broadcasterset",
        "button",
        "browser",
        "checkbox",
        "caption",
        "colorpicker",
        "column",
        "columns",
        "commandset",
        "command",
        "conditions",
        "content",
        "deck",
        "description",
        "dialog",
        "dialogheader",
        "editor",
        "grid",
        "grippy",
        "groupbox",
        "hbox",
        "iframe",
        "image",
        "key",
        "keyset",
        "label",
        "listbox",
        "listcell",
        "listcol",
        "listcols",
        "listhead",
        "listheader",
        "listitem",
        "member",
        "menu",
        "menubar",
        "menuitem",
        "menulist",
        "menupopup",
        "menuseparator",
        "observes",
        "overlay",
        "page",
        "popup",
        "popupset",
        "preference",
        "preferences",
        "prefpane",
        "prefwindow",
        "progressmeter",
        "radio",
        "radiogroup",
        "resizer",
        "richlistbox",
        "richlistitem",
        "row",
        "rows",
        "rule",
        "script",
        "scrollbar",
        "scrollbox",
        "scrollcorner",
        "separator",
        "spacer",
        "splitter",
        "stack",
        "statusbar",
        "statusbarpanel",
        "stringbundle",
        "stringbundleset",
        "tab",
        "tabbrowser",
        "tabbox",
        "tabpanel",
        "tabpanels",
        "tabs",
        "template",
        "textnode",
        "textbox",
        "titlebar",
        "toolbar",
        "toolbarbutton",
        "toolbargrippy",
        "toolbaritem",
        "toolbarpalette",
        "toolbarseparator",
        "toolbarset",
        "toolbarspacer",
        "toolbarspring",
        "toolbox",
        "tooltip",
        "tree",
        "treecell",
        "treechildren",
        "treecol",
        "treecols",
        "treeitem",
        "treerow",
        "treeseparator",
        "triple",
        "vbox",
        "window",
        "wizard",
        "wizardpage"
      ];
      var SVGElementTagNames = [
        "a",
        "animate",
        "animateMotion",
        "animateTransform",
        "circle",
        "clipPath",
        "defs",
        "desc",
        "ellipse",
        "feBlend",
        "feColorMatrix",
        "feComponentTransfer",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feDropShadow",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMerge",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence",
        "filter",
        "foreignObject",
        "g",
        "image",
        "line",
        "linearGradient",
        "marker",
        "mask",
        "metadata",
        "mpath",
        "path",
        "pattern",
        "polygon",
        "polyline",
        "radialGradient",
        "rect",
        "script",
        "set",
        "stop",
        "style",
        "svg",
        "switch",
        "symbol",
        "text",
        "textPath",
        "title",
        "tspan",
        "use",
        "view"
      ];
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/utils/wait.js
  var require_wait = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/utils/wait.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.waitUntil = waitUntil;
      exports.waitUtilAsync = waitUtilAsync;
      var basic_1 = require_basic();
      var basicTool = new basic_1.BasicTool();
      function waitUntil(condition, callback, interval = 100, timeout = 1e4) {
        const start = Date.now();
        const intervalId = basicTool.getGlobal("setInterval")(() => {
          if (condition()) {
            basicTool.getGlobal("clearInterval")(intervalId);
            callback();
          } else if (Date.now() - start > timeout) {
            basicTool.getGlobal("clearInterval")(intervalId);
          }
        }, interval);
      }
      function waitUtilAsync(condition, interval = 100, timeout = 1e4) {
        return new Promise((resolve, reject) => {
          const start = Date.now();
          const intervalId = basicTool.getGlobal("setInterval")(() => {
            if (condition()) {
              basicTool.getGlobal("clearInterval")(intervalId);
              resolve();
            } else if (Date.now() - start > timeout) {
              basicTool.getGlobal("clearInterval")(intervalId);
              reject();
            }
          }, interval);
        });
      }
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/tools/reader.js
  var require_reader = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/tools/reader.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReaderTool = void 0;
      var basic_1 = require_basic();
      var wait_1 = require_wait();
      var ReaderTool = class extends basic_1.BasicTool {
        /**
         * Get the selected tab reader.
         * @param waitTime Wait for n MS until the reader is ready
         */
        async getReader(waitTime = 5e3) {
          const Zotero_Tabs = this.getGlobal("Zotero_Tabs");
          if (Zotero_Tabs.selectedType !== "reader") {
            return void 0;
          }
          let reader = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
          let delayCount = 0;
          const checkPeriod = 50;
          while (!reader && delayCount * checkPeriod < waitTime) {
            await Zotero.Promise.delay(checkPeriod);
            reader = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
            delayCount++;
          }
          await (reader === null || reader === void 0 ? void 0 : reader._initPromise);
          return reader;
        }
        /**
         * Get all window readers.
         */
        getWindowReader() {
          const Zotero_Tabs = this.getGlobal("Zotero_Tabs");
          let windowReaders = [];
          let tabs = Zotero_Tabs._tabs.map((e) => e.id);
          for (let i = 0; i < Zotero.Reader._readers.length; i++) {
            let flag = false;
            for (let j = 0; j < tabs.length; j++) {
              if (Zotero.Reader._readers[i].tabID == tabs[j]) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              windowReaders.push(Zotero.Reader._readers[i]);
            }
          }
          return windowReaders;
        }
        /**
         * Get Reader tabpanel deck element.
         * @deprecated - use item pane api
         * @alpha
         */
        getReaderTabPanelDeck() {
          var _a;
          const deck = (_a = this.getGlobal("window").document.querySelector(".notes-pane-deck")) === null || _a === void 0 ? void 0 : _a.previousElementSibling;
          return deck;
        }
        /**
         * Add a reader tabpanel deck selection change observer.
         * @deprecated - use item pane api
         * @alpha
         * @param callback
         */
        async addReaderTabPanelDeckObserver(callback) {
          await (0, wait_1.waitUtilAsync)(() => !!this.getReaderTabPanelDeck());
          const deck = this.getReaderTabPanelDeck();
          const observer = new (this.getGlobal("MutationObserver"))(async (mutations) => {
            mutations.forEach(async (mutation) => {
              const target = mutation.target;
              if (target.classList.contains("zotero-view-tabbox") || target.tagName === "deck") {
                callback();
              }
            });
          });
          observer.observe(deck, {
            attributes: true,
            attributeFilter: ["selectedIndex"],
            subtree: true
          });
          return observer;
        }
        /**
         * Get the selected annotation data.
         * @param reader Target reader
         * @returns The selected annotation data.
         */
        getSelectedAnnotationData(reader) {
          var _a;
          const annotation = (
            // @ts-ignore
            (_a = reader === null || reader === void 0 ? void 0 : reader._internalReader._lastView._selectionPopup) === null || _a === void 0 ? void 0 : _a.annotation
          );
          return annotation;
        }
        /**
         * Get the text selection of reader.
         * @param reader Target reader
         * @returns The text selection of reader.
         */
        getSelectedText(reader) {
          var _a, _b;
          return (_b = (_a = this.getSelectedAnnotationData(reader)) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
        }
      };
      exports.ReaderTool = ReaderTool;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/tools/extraField.js
  var require_extraField = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/tools/extraField.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ExtraFieldTool = void 0;
      var basic_1 = require_basic();
      var ExtraFieldTool = class extends basic_1.BasicTool {
        /**
         * Get all extra fields
         * @param item
         */
        getExtraFields(item, backend = "custom") {
          const extraFiledRaw = item.getField("extra");
          if (backend === "default") {
            return this.getGlobal("Zotero").Utilities.Internal.extractExtraFields(extraFiledRaw).fields;
          } else {
            const map = /* @__PURE__ */ new Map();
            const nonStandardFields = [];
            extraFiledRaw.split("\n").forEach((line) => {
              const split = line.split(": ");
              if (split.length >= 2 && split[0]) {
                map.set(split[0], split.slice(1).join(": "));
              } else {
                nonStandardFields.push(line);
              }
            });
            map.set("__nonStandard__", nonStandardFields.join("\n"));
            return map;
          }
        }
        /**
         * Get extra field value by key. If it does not exists, return undefined.
         * @param item
         * @param key
         */
        getExtraField(item, key) {
          const fields = this.getExtraFields(item);
          return fields.get(key);
        }
        /**
         * Replace extra field of an item.
         * @param item
         * @param fields
         */
        async replaceExtraFields(item, fields) {
          let kvs = [];
          if (fields.has("__nonStandard__")) {
            kvs.push(fields.get("__nonStandard__"));
            fields.delete("__nonStandard__");
          }
          fields.forEach((v, k) => {
            kvs.push(`${k}: ${v}`);
          });
          item.setField("extra", kvs.join("\n"));
          await item.saveTx();
        }
        /**
         * Set an key-value pair to the item's extra field
         * @param item
         * @param key
         * @param value
         */
        async setExtraField(item, key, value) {
          const fields = this.getExtraFields(item);
          if (value === "" || typeof value === "undefined") {
            fields.delete(key);
          } else {
            fields.set(key, value);
          }
          await this.replaceExtraFields(item, fields);
        }
      };
      exports.ExtraFieldTool = ExtraFieldTool;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/helpers/patch.js
  var require_patch = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/helpers/patch.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PatchHelper = void 0;
      var basic_1 = require_basic();
      var PatchHelper = class extends basic_1.BasicTool {
        constructor() {
          super();
          this.options = void 0;
        }
        setData(options) {
          this.options = options;
          const Zotero2 = this.getGlobal("Zotero");
          const { target, funcSign, patcher } = options;
          const origin = target[funcSign];
          this.log("patching ", funcSign);
          target[funcSign] = function(...args) {
            if (options.enabled)
              try {
                return patcher(origin).apply(this, args);
              } catch (e) {
                Zotero2.logError(e);
              }
            return origin.apply(this, args);
          };
          return this;
        }
        enable() {
          if (!this.options)
            throw new Error("No patch data set");
          this.options.enabled = true;
          return this;
        }
        disable() {
          if (!this.options)
            throw new Error("No patch data set");
          this.options.enabled = false;
          return this;
        }
      };
      exports.PatchHelper = PatchHelper;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/fieldHook.js
  var require_fieldHook = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/fieldHook.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FieldHookManager = void 0;
      var patch_1 = require_patch();
      var basic_1 = require_basic();
      var FieldHookManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.data = {
            getField: {},
            setField: {},
            isFieldOfBase: {}
          };
          this.patchHelpers = {
            getField: new patch_1.PatchHelper(),
            setField: new patch_1.PatchHelper(),
            isFieldOfBase: new patch_1.PatchHelper()
          };
          const _thisHelper = this;
          for (const type of Object.keys(this.patchHelpers)) {
            const helper = this.patchHelpers[type];
            helper.setData({
              target: this.getGlobal("Zotero").Item.prototype,
              funcSign: type,
              patcher: (original) => function(field, ...args) {
                const originalThis = this;
                const handler = _thisHelper.data[type][field];
                if (typeof handler === "function") {
                  try {
                    return handler(field, args[0], args[1], originalThis, original);
                  } catch (e) {
                    return field + String(e);
                  }
                }
                return original.apply(originalThis, [field, ...args]);
              },
              enabled: true
            });
          }
        }
        register(type, field, hook) {
          this.data[type][field] = hook;
        }
        unregister(type, field) {
          delete this.data[type][field];
        }
        unregisterAll() {
          this.data.getField = {};
          this.data.setField = {};
          this.data.isFieldOfBase = {};
          this.patchHelpers.getField.disable();
          this.patchHelpers.setField.disable();
          this.patchHelpers.isFieldOfBase.disable();
        }
      };
      exports.FieldHookManager = FieldHookManager;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/patch.js
  var require_patch2 = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/patch.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PatcherManager = void 0;
      var basic_1 = require_basic();
      var PatcherManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.patcherIDMap = /* @__PURE__ */ new Map();
        }
        /**
         * Patch a function
         * @param object The owner of the function
         * @param funcSign The signature of the function(function name)
         * @param patcher A function that returns the new wrapper of the patched function
         * @returns A unique ID of the patcher, which can be used to unregister the patcher
         */
        register(object, funcSign, patcher) {
          const Zotero2 = this.getGlobal("Zotero");
          const patchIDMap = this.patcherIDMap;
          let id = Zotero2.randomString();
          while (patchIDMap.has(id)) {
            id = Zotero2.randomString();
          }
          const origin = object[funcSign];
          patchIDMap.set(id, true);
          this.log("patching ", funcSign);
          object[funcSign] = function(...args) {
            if (patchIDMap.get(id))
              try {
                return patcher(origin).apply(this, args);
              } catch (e) {
                Zotero2.logError(e);
              }
            return origin.apply(this, args);
          };
          return id;
        }
        /**
         * Unregister a patcher
         * @param patcherID The ID of the patcher to be unregistered
         */
        unregister(patcherID) {
          this.patcherIDMap.delete(patcherID);
        }
        /**
         * Unregister all patchers
         */
        unregisterAll() {
          this.patcherIDMap.clear();
        }
      };
      exports.PatcherManager = PatcherManager;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/itemTree.js
  var require_itemTree = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/itemTree.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ItemTreeManager = void 0;
      var basic_1 = require_basic();
      var fieldHook_1 = require_fieldHook();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
      var patch_1 = require_patch2();
      var ItemTreeManager = class extends basic_1.ManagerTool {
        /**
         * Initialize Zotero._ItemTreeExtraColumnsGlobal if it doesn't exist.
         *
         * New columns and hooks are stored there.
         *
         * Then patch `require("zotero/itemTree").getColumns` and `Zotero.Item.getField`
         */
        constructor(base) {
          super(base);
          this.defaultPersist = [
            "width",
            "ordinal",
            "hidden",
            "sortActive",
            "sortDirection"
          ];
          this.backend = this.getGlobal("Zotero").ItemTreeManager;
          this.localColumnCache = [];
          this.localRenderCellCache = [];
          this.fieldHooks = new fieldHook_1.FieldHookManager(base);
          this.patcherManager = new patch_1.PatcherManager(base);
          this.initializationLock = this.getGlobal("Zotero").Promise.defer();
          if (!this.backend) {
            this.initializeGlobal();
          } else {
            this.initializationLock.resolve();
          }
        }
        unregisterAll() {
          [...this.localColumnCache].forEach((key) => this.unregister(key, { skipGetField: true }));
          [...this.localRenderCellCache].forEach(this.removeRenderCellHook.bind(this));
          this.fieldHooks.unregisterAll();
        }
        /**
         * Register a new column. Don't forget to call `unregister` on plugin exit.
         * @param key Column dataKey
         * @param label Column display label
         * @param getFieldHook Called when loading cell content.
         * If you registered the getField hook somewhere else (in ItemBox or FieldHooks), leave it undefined.
         * @param options See zotero source code:chrome/content/zotero/itemTreeColumns.jsx
         * @param options.renderCellHook Called when rendering cell. This will override
         *
         * @example
         * ```ts
         * const itemTree = new ItemTreeTool();
         * await itemTree.register(
         *   "test",
         *   "new column",
         *   (
         *     field: string,
         *     unformatted: boolean,
         *     includeBaseMapped: boolean,
         *     item: Zotero.Item
         *   ) => {
         *     return field + String(item.id);
         *   },
         *   {
         *     iconPath: "chrome://zotero/skin/cross.png",
         *   }
         * );
         * ```
         */
        async register(key, label, getFieldHook, options = {
          showInColumnPicker: true
        }) {
          var _a;
          await ((_a = this.initializationLock) === null || _a === void 0 ? void 0 : _a.promise);
          if (!this.backend) {
            if (this.globalCache.columns.map((_c) => _c.dataKey).includes(key)) {
              this.log(`ItemTreeTool: ${key} is already registered.`);
              return;
            }
          }
          const column = {
            dataKey: key,
            label,
            pluginID: this._basicOptions.api.pluginID,
            iconLabel: options.iconPath ? this.createIconLabel({
              iconPath: options.iconPath,
              name: label
            }) : void 0,
            iconPath: options.iconPath,
            htmlLabel: options.htmlLabel,
            zoteroPersist: options.zoteroPersist || (this.backend ? this.defaultPersist : new Set(this.defaultPersist)),
            defaultIn: options.defaultIn,
            disabledIn: options.disabledIn,
            enabledTreeIDs: options.enabledTreeIDs,
            defaultSort: options.defaultSort,
            sortReverse: options.sortReverse || options.defaultSort === -1,
            flex: typeof options.flex === "undefined" ? 1 : options.flex,
            width: options.width,
            fixedWidth: options.fixedWidth,
            staticWidth: options.staticWidth,
            minWidth: options.minWidth,
            ignoreInColumnPicker: options.ignoreInColumnPicker,
            showInColumnPicker: typeof options.ignoreInColumnPicker === "undefined" ? true : options.showInColumnPicker,
            submenu: options.submenu,
            columnPickerSubMenu: options.columnPickerSubMenu || options.submenu,
            dataProvider: options.dataProvider || ((item, _dataKey) => item.getField(key)),
            renderCell: options.renderCell || options.renderCellHook
          };
          if (getFieldHook) {
            this.fieldHooks.register("getField", key, getFieldHook);
          }
          if (this.backend) {
            return await this.backend.registerColumns(column);
          } else {
            this.globalCache.columns.push(column);
            this.localColumnCache.push(column.dataKey);
            if (options.renderCellHook) {
              await this.addRenderCellHook(key, options.renderCellHook);
            }
            await this.refresh();
          }
        }
        /**
         * Unregister an extra column. Call it on plugin exit.
         * @param key Column dataKey, should be same as the one used in `register`
         * @param options.skipGetField skip unregister of getField hook.
         * This is useful when the hook is not initialized by this instance
         */
        async unregister(key, options = {}) {
          await this.initializationLock.promise;
          if (this.backend) {
            await this.backend.unregisterColumns(key);
            if (!options.skipGetField) {
              this.fieldHooks.unregister("getField", key);
            }
            return;
          }
          const Zotero2 = this.getGlobal("Zotero");
          let persisted = Zotero2.Prefs.get("pane.persist");
          const persistedJSON = JSON.parse(persisted);
          delete persistedJSON[key];
          Zotero2.Prefs.set("pane.persist", JSON.stringify(persistedJSON));
          const idx = this.globalCache.columns.map((_c) => _c.dataKey).indexOf(key);
          if (idx >= 0) {
            this.globalCache.columns.splice(idx, 1);
          }
          if (!options.skipGetField) {
            this.fieldHooks.unregister("getField", key);
          }
          this.removeRenderCellHook(key);
          await this.refresh();
          const localKeyIdx = this.localColumnCache.indexOf(key);
          if (localKeyIdx >= 0) {
            this.localColumnCache.splice(localKeyIdx, 1);
          }
        }
        /**
         * Add a patch hook for `_renderCell`, which is called when cell is rendered.
         * @deprecated
         *
         * This also works for Zotero's built-in cells.
         * @remarks
         * Don't call it manually unless you understand what you are doing.
         * @param dataKey Cell `dataKey`, e.g. 'title'
         * @param renderCellHook patch hook
         */
        async addRenderCellHook(dataKey, renderCellHook) {
          await this.initializationLock.promise;
          if (dataKey in this.globalCache.renderCellHooks) {
            this.log("[WARNING] ItemTreeTool.addRenderCellHook overwrites an existing hook:", dataKey);
          }
          this.globalCache.renderCellHooks[dataKey] = renderCellHook;
          this.localRenderCellCache.push(dataKey);
        }
        /**
         * Remove a patch hook by `dataKey`.
         * @deprecated
         */
        async removeRenderCellHook(dataKey) {
          delete this.globalCache.renderCellHooks[dataKey];
          const idx = this.localRenderCellCache.indexOf(dataKey);
          if (idx >= 0) {
            this.localRenderCellCache.splice(idx, 1);
          }
          await this.refresh();
        }
        /**
         * Do initializations. Called in constructor to be async
         */
        async initializeGlobal() {
          const Zotero2 = this.getGlobal("Zotero");
          await Zotero2.uiReadyPromise;
          const window2 = this.getGlobal("window");
          this.globalCache = toolkitGlobal_1.default.getInstance().itemTree;
          const globalCache = this.globalCache;
          if (!globalCache._ready) {
            globalCache._ready = true;
            const itemTree = window2.require("zotero/itemTree");
            if (!this.backend) {
              this.patcherManager.register(itemTree.prototype, "getColumns", (original) => function() {
                const columns = original.apply(this, arguments);
                const insertAfter = columns.findIndex((column) => column.dataKey === "title");
                columns.splice(insertAfter + 1, 0, ...globalCache.columns);
                return columns;
              });
            }
            this.patcherManager.register(itemTree.prototype, "_renderCell", (original) => function(index, data, column) {
              if (!(column.dataKey in globalCache.renderCellHooks)) {
                return original.apply(this, arguments);
              }
              const hook = globalCache.renderCellHooks[column.dataKey];
              const elem = hook(index, data, column, original.bind(this));
              if (elem.classList.contains("cell")) {
                return elem;
              }
              const span = window2.document.createElementNS("http://www.w3.org/1999/xhtml", "span");
              span.classList.add("cell", column.dataKey, `${column.dataKey}-item-tree-main-default`);
              if (column.fixedWidth) {
                span.classList.add("fixed-width");
              }
              span.appendChild(elem);
              return span;
            });
          }
          this.initializationLock.resolve();
        }
        /**
         * Create a React Icon element
         * @param props
         */
        createIconLabel(props) {
          const _React = window.require("react");
          return _React.createElement("span", null, _React.createElement("img", {
            src: props.iconPath,
            height: "10px",
            width: "9px",
            style: {
              "margin-left": "6px"
            }
          }), " ", props.name);
        }
        /**
         * Refresh itemView. You don't need to call it manually.
         */
        async refresh() {
          var _a, _b;
          await this.initializationLock.promise;
          const ZoteroPane = this.getGlobal("ZoteroPane");
          const itemsView = ZoteroPane.itemsView;
          if (!itemsView)
            return;
          itemsView._columnsId = null;
          const virtualizedTable = (_a = itemsView.tree) === null || _a === void 0 ? void 0 : _a._columns;
          if (!virtualizedTable) {
            this.log("ItemTree is still loading. Refresh skipped.");
            return;
          }
          (_b = document.querySelector(`.${virtualizedTable._styleKey}`)) === null || _b === void 0 ? void 0 : _b.remove();
          await itemsView.refreshAndMaintainSelection();
          itemsView.tree._columns = new virtualizedTable.__proto__.constructor(itemsView.tree);
          await itemsView.refreshAndMaintainSelection();
        }
      };
      exports.ItemTreeManager = ItemTreeManager;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/prompt.js
  var require_prompt = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/prompt.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PromptManager = exports.Prompt = void 0;
      var basic_1 = require_basic();
      var basic_2 = require_basic();
      var ui_1 = require_ui();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
      var Prompt = class {
        get document() {
          return this.base.getGlobal("document");
        }
        /**
         * Initialize `Prompt` but do not create UI.
         */
        constructor() {
          this.lastInputText = "";
          this.defaultText = {
            placeholder: "Select a command...",
            empty: "No commands found."
          };
          this.maxLineNum = 12;
          this.maxSuggestionNum = 100;
          this.commands = [];
          this.base = new basic_1.BasicTool();
          this.ui = new ui_1.UITool();
          this.initializeUI();
        }
        /**
         * Initialize `Prompt` UI and then bind events on it.
         */
        initializeUI() {
          this.addStyle();
          this.createHTML();
          this.initInputEvents();
          this.registerShortcut();
        }
        createHTML() {
          this.promptNode = this.ui.createElement(this.document, "div", {
            styles: {
              display: "none"
            },
            children: [
              {
                tag: "div",
                styles: {
                  position: "fixed",
                  left: "0",
                  top: "0",
                  backgroundColor: "transparent",
                  width: "100%",
                  height: "100%"
                },
                listeners: [
                  {
                    type: "click",
                    listener: () => {
                      this.promptNode.style.display = "none";
                    }
                  }
                ]
              }
            ]
          });
          this.promptNode.appendChild(this.ui.createElement(this.document, "div", {
            id: `zotero-plugin-toolkit-prompt`,
            classList: ["prompt-container"],
            children: [
              {
                tag: "div",
                classList: ["input-container"],
                children: [
                  {
                    tag: "input",
                    classList: ["prompt-input"],
                    attributes: {
                      type: "text",
                      placeholder: this.defaultText.placeholder
                    }
                  },
                  {
                    tag: "div",
                    classList: ["cta"]
                  }
                ]
              },
              {
                tag: "div",
                classList: ["commands-containers"]
              },
              {
                tag: "div",
                classList: ["instructions"],
                children: [
                  {
                    tag: "div",
                    classList: ["instruction"],
                    children: [
                      {
                        tag: "span",
                        classList: ["key"],
                        properties: {
                          innerText: "\u2191\u2193"
                        }
                      },
                      {
                        tag: "span",
                        properties: {
                          innerText: "to navigate"
                        }
                      }
                    ]
                  },
                  {
                    tag: "div",
                    classList: ["instruction"],
                    children: [
                      {
                        tag: "span",
                        classList: ["key"],
                        properties: {
                          innerText: "enter"
                        }
                      },
                      {
                        tag: "span",
                        properties: {
                          innerText: "to trigger"
                        }
                      }
                    ]
                  },
                  {
                    tag: "div",
                    classList: ["instruction"],
                    children: [
                      {
                        tag: "span",
                        classList: ["key"],
                        properties: {
                          innerText: "esc"
                        }
                      },
                      {
                        tag: "span",
                        properties: {
                          innerText: "to exit"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }));
          this.inputNode = this.promptNode.querySelector("input");
          this.document.documentElement.appendChild(this.promptNode);
        }
        /**
         * Show commands in a new `commandsContainer`
         * All other `commandsContainer` is hidden
         * @param commands Command[]
         * @param clear remove all `commandsContainer` if true
         */
        showCommands(commands, clear = false) {
          if (clear) {
            this.promptNode.querySelectorAll(".commands-container").forEach((e) => e.remove());
          }
          this.inputNode.placeholder = this.defaultText.placeholder;
          const commandsContainer = this.createCommandsContainer();
          for (let command of commands) {
            try {
              if (!command.name || command.when && !command.when()) {
                continue;
              }
            } catch (_a) {
              continue;
            }
            commandsContainer.appendChild(this.createCommandNode(command));
          }
        }
        /**
         * Create a `commandsContainer` div element, append to `commandsContainer` and hide others.
         * @returns commandsNode
         */
        createCommandsContainer() {
          const commandsContainer = this.ui.createElement(this.document, "div", {
            classList: ["commands-container"]
          });
          this.promptNode.querySelectorAll(".commands-container").forEach((e) => {
            e.style.display = "none";
          });
          this.promptNode.querySelector(".commands-containers").appendChild(commandsContainer);
          return commandsContainer;
        }
        /**
         * Return current displayed `commandsContainer`
         * @returns
         */
        getCommandsContainer() {
          return [
            ...Array.from(this.promptNode.querySelectorAll(".commands-container"))
          ].find((e) => {
            return e.style.display != "none";
          });
        }
        /**
         * Create a command item for `Prompt` UI.
         * @param command
         * @returns
         */
        createCommandNode(command) {
          const commandNode = this.ui.createElement(this.document, "div", {
            classList: ["command"],
            children: [
              {
                tag: "div",
                classList: ["content"],
                children: [
                  {
                    tag: "div",
                    classList: ["name"],
                    children: [
                      {
                        tag: "span",
                        properties: {
                          innerText: command.name
                        }
                      }
                    ]
                  },
                  {
                    tag: "div",
                    classList: ["aux"],
                    children: command.label ? [
                      {
                        tag: "span",
                        classList: ["label"],
                        properties: {
                          innerText: command.label
                        }
                      }
                    ] : []
                  }
                ]
              }
            ],
            listeners: [
              {
                type: "mousemove",
                listener: () => {
                  this.selectItem(commandNode);
                }
              },
              {
                type: "click",
                listener: async () => {
                  await this.execCallback(command.callback);
                }
              }
            ]
          });
          commandNode.command = command;
          return commandNode;
        }
        /**
         * Called when `enter` key is pressed.
         */
        trigger() {
          [...Array.from(this.promptNode.querySelectorAll(".commands-container"))].find((e) => e.style.display != "none").querySelector(".selected").click();
        }
        /**
         * Called when `escape` key is pressed.
         */
        exit() {
          this.inputNode.placeholder = this.defaultText.placeholder;
          if (this.promptNode.querySelectorAll(".commands-containers .commands-container").length >= 2) {
            this.promptNode.querySelector(".commands-container:last-child").remove();
            const commandsContainer = this.promptNode.querySelector(".commands-container:last-child");
            commandsContainer.style.display = "";
            commandsContainer.querySelectorAll(".commands").forEach((e) => e.style.display = "flex");
            this.inputNode.focus();
          } else {
            this.promptNode.style.display = "none";
          }
        }
        async execCallback(callback) {
          if (Array.isArray(callback)) {
            this.showCommands(callback);
          } else {
            await callback(this);
          }
        }
        /**
         * Match suggestions for user's entered text.
         */
        async showSuggestions(inputText) {
          var _w = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/, jw = /\s/, Ww = /[\u0F00-\u0FFF\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
          function Yw(e2, t, n, i) {
            if (0 === e2.length)
              return 0;
            var r = 0;
            r -= Math.max(0, e2.length - 1), r -= i / 10;
            var o = e2[0][0];
            return r -= (e2[e2.length - 1][1] - o + 1 - t) / 100, r -= o / 1e3, r -= n / 1e4;
          }
          function $w(e2, t, n, i) {
            if (0 === e2.length)
              return null;
            for (var r = n.toLowerCase(), o = 0, a = 0, s = [], l = 0; l < e2.length; l++) {
              var c = e2[l], u = r.indexOf(c, a);
              if (-1 === u)
                return null;
              var h = n.charAt(u);
              if (u > 0 && !_w.test(h) && !Ww.test(h)) {
                var p = n.charAt(u - 1);
                if (h.toLowerCase() !== h && p.toLowerCase() !== p || h.toUpperCase() !== h && !_w.test(p) && !jw.test(p) && !Ww.test(p))
                  if (i) {
                    if (u !== a) {
                      a += c.length, l--;
                      continue;
                    }
                  } else
                    o += 1;
              }
              if (0 === s.length)
                s.push([u, u + c.length]);
              else {
                var d = s[s.length - 1];
                d[1] < u ? s.push([u, u + c.length]) : d[1] = u + c.length;
              }
              a = u + c.length;
            }
            return {
              matches: s,
              score: Yw(s, t.length, r.length, o)
            };
          }
          function Gw(e2) {
            for (var t = e2.toLowerCase(), n = [], i = 0, r = 0; r < t.length; r++) {
              var o = t.charAt(r);
              jw.test(o) ? (i !== r && n.push(t.substring(i, r)), i = r + 1) : (_w.test(o) || Ww.test(o)) && (i !== r && n.push(t.substring(i, r)), n.push(o), i = r + 1);
            }
            return i !== t.length && n.push(t.substring(i, t.length)), {
              query: e2,
              tokens: n,
              fuzzy: t.split("")
            };
          }
          function Xw(e2, t) {
            if ("" === e2.query)
              return {
                score: 0,
                matches: []
              };
            var n = $w(e2.tokens, e2.query, t, false);
            return n || $w(e2.fuzzy, e2.query, t, true);
          }
          var e = Gw(inputText);
          let container = this.getCommandsContainer();
          if (container.classList.contains("suggestions")) {
            this.exit();
          }
          if (inputText.trim() == "") {
            return true;
          }
          let suggestions = [];
          this.getCommandsContainer().querySelectorAll(".command").forEach((commandNode) => {
            let spanNode = commandNode.querySelector(".name span");
            let spanText = spanNode.innerText;
            let res = Xw(e, spanText);
            if (res) {
              commandNode = this.createCommandNode(commandNode.command);
              let spanHTML = "";
              let i = 0;
              for (let j = 0; j < res.matches.length; j++) {
                let [start, end] = res.matches[j];
                if (start > i) {
                  spanHTML += spanText.slice(i, start);
                }
                spanHTML += `<span class="highlight">${spanText.slice(start, end)}</span>`;
                i = end;
              }
              if (i < spanText.length) {
                spanHTML += spanText.slice(i, spanText.length);
              }
              commandNode.querySelector(".name span").innerHTML = spanHTML;
              suggestions.push({ score: res.score, commandNode });
            }
          });
          if (suggestions.length > 0) {
            suggestions.sort((a, b) => b.score - a.score).slice(this.maxSuggestionNum);
            container = this.createCommandsContainer();
            container.classList.add("suggestions");
            suggestions.forEach((suggestion) => {
              container.appendChild(suggestion.commandNode);
            });
            return true;
          } else {
            const anonymousCommand = this.commands.find((c) => !c.name && (!c.when || c.when()));
            if (anonymousCommand) {
              await this.execCallback(anonymousCommand.callback);
            } else {
              this.showTip(this.defaultText.empty);
            }
            return false;
          }
        }
        /**
         * Bind events of pressing `keydown` and `keyup` key.
         */
        initInputEvents() {
          this.promptNode.addEventListener("keydown", (event) => {
            if (["ArrowUp", "ArrowDown"].indexOf(event.key) != -1) {
              event.preventDefault();
              let selectedIndex;
              let allItems = [
                ...Array.from(this.getCommandsContainer().querySelectorAll(".command"))
              ].filter((e) => e.style.display != "none");
              selectedIndex = allItems.findIndex((e) => e.classList.contains("selected"));
              if (selectedIndex != -1) {
                allItems[selectedIndex].classList.remove("selected");
                selectedIndex += event.key == "ArrowUp" ? -1 : 1;
              } else {
                if (event.key == "ArrowUp") {
                  selectedIndex = allItems.length - 1;
                } else {
                  selectedIndex = 0;
                }
              }
              if (selectedIndex == -1) {
                selectedIndex = allItems.length - 1;
              } else if (selectedIndex == allItems.length) {
                selectedIndex = 0;
              }
              allItems[selectedIndex].classList.add("selected");
              let commandsContainer = this.getCommandsContainer();
              commandsContainer.scrollTo(0, commandsContainer.querySelector(".selected").offsetTop - commandsContainer.offsetHeight + 7.5);
              allItems[selectedIndex].classList.add("selected");
            }
          });
          this.promptNode.addEventListener("keyup", async (event) => {
            if (event.key == "Enter") {
              this.trigger();
            } else if (event.key == "Escape") {
              if (this.inputNode.value.length > 0) {
                this.inputNode.value = "";
              } else {
                this.exit();
              }
            } else if (["ArrowUp", "ArrowDown"].indexOf(event.key) != -1) {
              return;
            }
            const currentInputText = this.inputNode.value;
            if (currentInputText == this.lastInputText) {
              return;
            }
            this.lastInputText = currentInputText;
            window.setTimeout(async () => {
              await this.showSuggestions(currentInputText);
            });
          });
        }
        /**
         * Create a commandsContainer and display a text
         */
        showTip(text) {
          const tipNode = this.ui.createElement(this.document, "div", {
            classList: ["tip"],
            properties: {
              innerText: text
            }
          });
          let container = this.createCommandsContainer();
          container.classList.add("suggestions");
          container.appendChild(tipNode);
          return tipNode;
        }
        /**
         * Mark the selected item with class `selected`.
         * @param item HTMLDivElement
         */
        selectItem(item) {
          this.getCommandsContainer().querySelectorAll(".command").forEach((e) => e.classList.remove("selected"));
          item.classList.add("selected");
        }
        addStyle() {
          const style = this.ui.createElement(this.document, "style", {
            namespace: "html",
            id: "prompt-style"
          });
          style.innerText = `
      .prompt-container * {
        box-sizing: border-box;
      }
      .prompt-container {
        ---radius---: 10px;
        position: fixed;
        left: 25%;
        top: 10%;
        width: 50%;
        border-radius: var(---radius---);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        box-shadow: 0px 1.8px 7.3px rgba(0, 0, 0, 0.071),
                    0px 6.3px 24.7px rgba(0, 0, 0, 0.112),
                    0px 30px 90px rgba(0, 0, 0, 0.2);
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Microsoft YaHei Light", sans-serif;
        background-color: var(--material-background) !important;
        border: var(--material-border-quarternary) !important;
      }
      
      /* input */
      .prompt-container .input-container  {
        width: 100%;
      }

      .input-container input {
        width: -moz-available;
        height: 40px;
        padding: 24px;
        border: none;
        outline: none;
        font-size: 18px;
        margin: 0 !important;
        border-radius: var(---radius---);
        background-color: var(--material-background);
      }
      
      .input-container .cta {
        border-bottom: var(--material-border-quarternary);
        margin: 5px auto;
      }
      
      /* results */
      .commands-containers {
        width: 100%;
        height: 100%;
      }
      .commands-container {
        max-height: calc(${this.maxLineNum} * 35.5px);
        width: calc(100% - 12px);
        margin-left: 12px;
        margin-right: 0%;
        overflow-y: auto;
        overflow-x: hidden;
      }
      
      .commands-container .command {
        display: flex;
        align-content: baseline;
        justify-content: space-between;
        border-radius: 5px;
        padding: 6px 12px;
        margin-right: 12px;
        margin-top: 2px;
        margin-bottom: 2px;
      }
      .commands-container .command .content {
        display: flex;
        width: 100%;
        justify-content: space-between;
        flex-direction: row;
        overflow: hidden;
      }
      .commands-container .command .content .name {
        white-space: nowrap; 
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .commands-container .command .content .aux {
        display: flex;
        align-items: center;
        align-self: center;
        flex-shrink: 0;
      }
      
      .commands-container .command .content .aux .label {
        font-size: 15px;
        color: var(--fill-primary);
        padding: 2px 6px;
        background-color: var(--color-background);
        border-radius: 5px;
      }
      
      .commands-container .selected {
          background-color: var(--material-mix-quinary);
      }

      .commands-container .highlight {
        font-weight: bold;
      }

      .tip {
        color: var(--fill-primary);
        text-align: center;
        padding: 12px 12px;
        font-size: 18px;
      }

      /* instructions */
      .instructions {
        display: flex;
        align-content: center;
        justify-content: center;
        font-size: 15px;
        height: 2.5em;
        width: 100%;
        border-top: var(--material-border-quarternary);
        color: var(--fill-secondary);
        margin-top: 5px;
      }
      
      .instructions .instruction {
        margin: auto .5em;  
      }
      
      .instructions .key {
        margin-right: .2em;
        font-weight: 600;
      }
    `;
          this.document.documentElement.appendChild(style);
        }
        registerShortcut() {
          this.document.addEventListener("keydown", (event) => {
            if (event.shiftKey && event.key.toLowerCase() == "p") {
              if (event.originalTarget.isContentEditable || "value" in event.originalTarget || this.commands.length == 0) {
                return;
              }
              event.preventDefault();
              event.stopPropagation();
              if (this.promptNode.style.display == "none") {
                this.promptNode.style.display = "flex";
                if (this.promptNode.querySelectorAll(".commands-container").length == 1) {
                  this.showCommands(this.commands, true);
                }
                this.promptNode.focus();
                this.inputNode.focus();
              } else {
                this.promptNode.style.display = "none";
              }
            }
          }, true);
        }
      };
      exports.Prompt = Prompt;
      var PromptManager = class extends basic_2.ManagerTool {
        constructor(base) {
          super(base);
          this.commands = [];
          const globalCache = toolkitGlobal_1.default.getInstance().prompt;
          if (!globalCache._ready) {
            globalCache._ready = true;
            globalCache.instance = new Prompt();
          }
          this.prompt = globalCache.instance;
        }
        /**
         * Register commands. Don't forget to call `unregister` on plugin exit.
         * @param commands Command[]
         * @example
         * ```ts
         * let getReader = () => {
         *   return BasicTool.getZotero().Reader.getByTabID(
         *     (Zotero.getMainWindow().Zotero_Tabs).selectedID
         *   )
         * }
         *
         * register([
         *   {
         *     name: "Split Horizontally",
         *     label: "Zotero",
         *     when: () => getReader() as boolean,
         *     callback: (prompt: Prompt) => getReader().menuCmd("splitHorizontally")
         *   },
         *   {
         *     name: "Split Vertically",
         *     label: "Zotero",
         *     when: () => getReader() as boolean,
         *     callback: (prompt: Prompt) => getReader().menuCmd("splitVertically")
         *   }
         * ])
         * ```
         */
        register(commands) {
          commands.forEach((c) => {
            var _a;
            return (_a = c.id) !== null && _a !== void 0 ? _a : c.id = c.name;
          });
          this.prompt.commands = [...this.prompt.commands, ...commands];
          this.commands = [...this.commands, ...commands];
          this.prompt.showCommands(this.commands, true);
        }
        /**
         * You can delete a command registed before by its name.
         * @remarks
         * There is a premise here that the names of all commands registered by a single plugin are not duplicated.
         * @param id Command.name
         */
        unregister(id) {
          this.prompt.commands = this.prompt.commands.filter((c) => c.id != id);
          this.commands = this.commands.filter((c) => c.id != id);
        }
        /**
         * Call `unregisterAll` on plugin exit.
         */
        unregisterAll() {
          this.prompt.commands = this.prompt.commands.filter((c) => {
            return this.commands.every((_c) => _c.id != c.id);
          });
          this.commands = [];
        }
      };
      exports.PromptManager = PromptManager;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/libraryTabPanel.js
  var require_libraryTabPanel = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/libraryTabPanel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LibraryTabPanelManager = void 0;
      var ui_1 = require_ui();
      var basic_1 = require_basic();
      var LibraryTabPanelManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.ui = new ui_1.UITool(this);
          this.libraryTabCache = {
            optionsList: []
          };
        }
        /**
         * Register a tabpanel in library.
         * @remarks
         * If you don't want to remove the tab & panel in runtime, `unregisterLibraryTabPanel` is not a must.
         *
         * The elements wiil be removed by `removeAddonElements`.
         * @param tabLabel Label of panel tab.
         * @param renderPanelHook Called when panel is ready. Add elements to the panel.
         * @param options Other optional parameters.
         * @param options.tabId ID of panel tab. Also used as unregister query. If not set, generate a random one.
         * @param options.panelId ID of panel container (XUL.TabPanel). If not set, generate a random one.
         * @param options.targetIndex Index of the inserted tab. Default the end of tabs.
         * @param options.selectPanel If the panel should be selected immediately.
         * @returns tabId. Use it for unregister.
         * @example
         * Register an extra library tabpanel into index 1.
         * ```ts
         * const libPaneManager = new LibraryTabPanelManager();
         * const libTabId = libPaneManager.registerLibraryTabPanel(
         *   "test",
         *   (panel: XUL.Element, win: Window) => {
         *     const elem = ui.creatElementsFromJSON(
         *       win.document,
         *       {
         *         tag: "vbox",
         *         namespace: "xul",
         *         subElementOptions: [
         *           {
         *             tag: "h2",
         *             directAttributes: {
         *               innerText: "Hello World!",
         *             },
         *           },
         *           {
         *             tag: "label",
         *             namespace: "xul",
         *             directAttributes: {
         *               value: "This is a library tab.",
         *             },
         *           },
         *           {
         *             tag: "button",
         *             directAttributes: {
         *               innerText: "Unregister",
         *             },
         *             listeners: [
         *               {
         *                 type: "click",
         *                 listener: () => {
         *                   ui.unregisterLibraryTabPanel(
         *                     libTabId
         *                   );
         *                 },
         *               },
         *             ],
         *           },
         *         ],
         *       }
         *     );
         *     panel.append(elem);
         *   },
         *   {
         *     targetIndex: 1,
         *   }
         * );
         * ```
         */
        register(tabLabel, renderPanelHook, options) {
          options = options || {
            tabId: void 0,
            panelId: void 0,
            targetIndex: -1,
            selectPanel: false
          };
          const window2 = this.getGlobal("window");
          const tabbox = window2.document.querySelector("#zotero-view-tabbox");
          const randomId = `${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`;
          const tabId = options.tabId || `toolkit-readertab-${randomId}`;
          const panelId = options.panelId || `toolkit-readertabpanel-${randomId}`;
          const tab = this.ui.createElement(window2.document, "tab", {
            id: tabId,
            classList: [`toolkit-ui-tabs-${tabId}`],
            attributes: {
              label: tabLabel
            },
            ignoreIfExists: true
          });
          const tabpanel = this.ui.createElement(window2.document, "tabpanel", {
            id: panelId,
            classList: [`toolkit-ui-tabs-${tabId}`],
            ignoreIfExists: true
          });
          const tabs = tabbox.querySelector("tabs");
          const tabpanels = tabbox.querySelector("tabpanels");
          const targetIndex = typeof options.targetIndex === "number" ? options.targetIndex : -1;
          if (targetIndex >= 0) {
            tabs.querySelectorAll("tab")[targetIndex].before(tab);
            tabpanels.querySelectorAll("tabpanel")[targetIndex].before(tabpanel);
          } else {
            tabs.appendChild(tab);
            tabpanels.appendChild(tabpanel);
          }
          if (options.selectPanel) {
            tabbox.selectedTab = tab;
          }
          this.libraryTabCache.optionsList.push({
            tabId,
            tabLabel,
            panelId,
            renderPanelHook,
            targetIndex,
            selectPanel: options.selectPanel
          });
          renderPanelHook(tabpanel, window2);
          return tabId;
        }
        /**
         * Unregister the library tabpanel.
         * @param tabId tab id
         */
        unregister(tabId) {
          const idx = this.libraryTabCache.optionsList.findIndex((v) => v.tabId === tabId);
          if (idx >= 0) {
            this.libraryTabCache.optionsList.splice(idx, 1);
          }
          this.removeTabPanel(tabId);
        }
        /**
         * Unregister all library tabpanel.
         */
        unregisterAll() {
          const tabIds = this.libraryTabCache.optionsList.map((options) => options.tabId);
          tabIds.forEach(this.unregister.bind(this));
        }
        removeTabPanel(tabId) {
          const doc = this.getGlobal("document");
          Array.prototype.forEach.call(doc.querySelectorAll(`.toolkit-ui-tabs-${tabId}`), (e) => {
            e.remove();
          });
        }
      };
      exports.LibraryTabPanelManager = LibraryTabPanelManager;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/readerTabPanel.js
  var require_readerTabPanel = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/readerTabPanel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReaderTabPanelManager = void 0;
      var ui_1 = require_ui();
      var reader_1 = require_reader();
      var basic_1 = require_basic();
      var ReaderTabPanelManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.ui = new ui_1.UITool(this);
          this.readerTool = new reader_1.ReaderTool(this);
          this.readerTabCache = {
            optionsList: [],
            observer: void 0,
            initializeLock: void 0
          };
        }
        /**
         * Register a tabpanel for every reader.
         * @remarks
         * Don't forget to call `unregisterReaderTabPanel` on exit.
         * @remarks
         * Every time a tab reader is selected/opened, the hook will be called.
         * @param tabLabel Label of panel tab.
         * @param renderPanelHook Called when panel is ready. Add elements to the panel.
         *
         * The panel might be `undefined` when opening a PDF without parent item.
         *
         * The owner deck is the top container of right-side bar.
         *
         * The readerInstance is the reader of current tabpanel.
         * @param options Other optional parameters.
         * @param options.tabId ID of panel tab. Also used as unregister query. If not set, generate a random one.
         * @param options.panelId ID of panel container (XUL.TabPanel). If not set, generate a random one.
         * @param options.targetIndex Index of the inserted tab. Default the end of tabs.
         * @param options.selectPanel If the panel should be selected immediately.
         * @returns tabId. Use it for unregister.
         * @example
         * Register an extra reader tabpanel into index 1.
         * ```ts
         * const readerTabId = `${config.addonRef}-extra-reader-tab`;
         * this._Addon.toolkit.UI.registerReaderTabPanel(
         *   "test",
         *   (
         *     panel: XUL.Element,
         *     deck: XUL.Deck,
         *     win: Window,
         *     reader: _ZoteroReaderInstance
         *   ) => {
         *     if (!panel) {
         *       this._Addon.toolkit.Tool.log(
         *         "This reader do not have right-side bar. Adding reader tab skipped."
         *       );
         *       return;
         *     }
         *     this._Addon.toolkit.Tool.log(reader);
         *     const elem = this._Addon.toolkit.UI.creatElementsFromJSON(
         *       win.document,
         *       {
         *         tag: "vbox",
         *         id: `${config.addonRef}-${reader._instanceID}-extra-reader-tab-div`,
         *         namespace: "xul",
         *         // This is important! Don't create content for multiple times
         *         ignoreIfExists: true,
         *         subElementOptions: [
         *           {
         *             tag: "h2",
         *             directAttributes: {
         *               innerText: "Hello World!",
         *             },
         *           },
         *           {
         *             tag: "label",
         *             namespace: "xul",
         *             directAttributes: {
         *               value: "This is a reader tab.",
         *             },
         *           },
         *           {
         *             tag: "label",
         *             namespace: "xul",
         *             directAttributes: {
         *               value: `Reader: ${reader._title.slice(0, 20)}`,
         *             },
         *           },
         *           {
         *             tag: "label",
         *             namespace: "xul",
         *             directAttributes: {
         *               value: `itemID: ${reader.itemID}.`,
         *             },
         *           },
         *           {
         *             tag: "button",
         *             directAttributes: {
         *               innerText: "Unregister",
         *             },
         *             listeners: [
         *               {
         *                 type: "click",
         *                 listener: () => {
         *                   this._Addon.toolkit.UI.unregisterReaderTabPanel(
         *                     readerTabId
         *                   );
         *                 },
         *               },
         *             ],
         *           },
         *         ],
         *       }
         *     );
         *     panel.append(elem);
         *   },
         *   {
         *     tabId: readerTabId,
         *   }
         * );
         * ```
         */
        async register(tabLabel, renderPanelHook, options) {
          var _a;
          options = options || {
            tabId: void 0,
            panelId: void 0,
            targetIndex: -1,
            selectPanel: false
          };
          if (typeof this.readerTabCache.initializeLock === "undefined") {
            await this.initializeReaderTabObserver();
          }
          await ((_a = this.readerTabCache.initializeLock) === null || _a === void 0 ? void 0 : _a.promise);
          const randomId = `${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`;
          const tabId = options.tabId || `toolkit-readertab-${randomId}`;
          const panelId = options.panelId || `toolkit-readertabpanel-${randomId}`;
          const targetIndex = typeof options.targetIndex === "number" ? options.targetIndex : -1;
          this.readerTabCache.optionsList.push({
            tabId,
            tabLabel,
            panelId,
            renderPanelHook,
            targetIndex,
            selectPanel: options.selectPanel
          });
          await this.addReaderTabPanel();
          return tabId;
        }
        /**
         * Unregister the reader tabpanel.
         * @param tabId tab id
         */
        unregister(tabId) {
          var _a;
          const idx = this.readerTabCache.optionsList.findIndex((v) => v.tabId === tabId);
          if (idx >= 0) {
            this.readerTabCache.optionsList.splice(idx, 1);
          }
          if (this.readerTabCache.optionsList.length === 0) {
            (_a = this.readerTabCache.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
            this.readerTabCache = {
              optionsList: [],
              observer: void 0,
              initializeLock: void 0
            };
          }
          this.removeTabPanel(tabId);
        }
        /**
         * Unregister all library tabpanel.
         */
        unregisterAll() {
          const tabIds = this.readerTabCache.optionsList.map((options) => options.tabId);
          tabIds.forEach(this.unregister.bind(this));
        }
        changeTabPanel(tabId, options) {
          const idx = this.readerTabCache.optionsList.findIndex((v) => v.tabId === tabId);
          if (idx >= 0) {
            Object.assign(this.readerTabCache.optionsList[idx], options);
          }
        }
        removeTabPanel(tabId) {
          const doc = this.getGlobal("document");
          Array.prototype.forEach.call(doc.querySelectorAll(`.toolkit-ui-tabs-${tabId}`), (e) => {
            e.remove();
          });
        }
        async initializeReaderTabObserver() {
          this.readerTabCache.initializeLock = this.getGlobal("Zotero").Promise.defer();
          await Promise.all([
            Zotero.initializationPromise,
            Zotero.unlockPromise,
            Zotero.uiReadyPromise
          ]);
          let lock = Zotero.Promise.defer();
          lock.resolve();
          const observer = await this.readerTool.addReaderTabPanelDeckObserver(async () => {
            await lock.promise;
            lock = Zotero.Promise.defer();
            try {
              this.addReaderTabPanel();
            } catch (e) {
            }
            lock.resolve();
          });
          this.readerTabCache.observer = observer;
          this.readerTabCache.initializeLock.resolve();
        }
        async addReaderTabPanel() {
          var _a, _b;
          const window2 = this.getGlobal("window");
          const deck = this.readerTool.getReaderTabPanelDeck();
          const reader = await this.readerTool.getReader();
          if (!reader) {
            return;
          }
          if (((_a = deck.selectedPanel) === null || _a === void 0 ? void 0 : _a.children[0].tagName) === "vbox") {
            const container = deck.selectedPanel;
            container.innerHTML = "";
            this.ui.appendElement({
              tag: "tabbox",
              classList: ["zotero-view-tabbox"],
              attributes: {
                flex: "1"
              },
              enableElementRecord: false,
              children: [
                {
                  tag: "tabs",
                  classList: ["zotero-editpane-tabs"],
                  attributes: {
                    orient: "horizontal"
                  },
                  enableElementRecord: false
                },
                {
                  tag: "tabpanels",
                  classList: ["zotero-view-item"],
                  attributes: {
                    flex: "1"
                  },
                  enableElementRecord: false
                }
              ]
            }, container);
          }
          let tabbox = (_b = deck.selectedPanel) === null || _b === void 0 ? void 0 : _b.querySelector("tabbox");
          if (!tabbox) {
            return;
          }
          const tabs = tabbox.querySelector("tabs");
          const tabpanels = tabbox.querySelector("tabpanels");
          this.readerTabCache.optionsList.forEach((options) => {
            const tabId = `${options.tabId}-${reader._instanceID}`;
            const tabClass = `toolkit-ui-tabs-${options.tabId}`;
            if (tabs === null || tabs === void 0 ? void 0 : tabs.querySelector(`.${tabClass}`)) {
              return;
            }
            const tab = this.ui.createElement(window2.document, "tab", {
              id: tabId,
              classList: [tabClass],
              attributes: {
                label: options.tabLabel
              },
              ignoreIfExists: true
            });
            const tabpanel = this.ui.createElement(window2.document, "tabpanel", {
              id: `${options.panelId}-${reader._instanceID}`,
              classList: [tabClass],
              ignoreIfExists: true
            });
            if (options.targetIndex >= 0) {
              tabs === null || tabs === void 0 ? void 0 : tabs.querySelectorAll("tab")[options.targetIndex].before(tab);
              tabpanels === null || tabpanels === void 0 ? void 0 : tabpanels.querySelectorAll("tabpanel")[options.targetIndex].before(tabpanel);
              if (tabbox.getAttribute("toolkit-select-fixed") !== "true") {
                tabbox.tabpanels.addEventListener("select", () => {
                  this.getGlobal("setTimeout")(() => {
                    tabbox.tabpanels.selectedPanel = tabbox.tabs.getRelatedElement(tabbox === null || tabbox === void 0 ? void 0 : tabbox.tabs.selectedItem);
                  }, 0);
                });
                tabbox.setAttribute("toolkit-select-fixed", "true");
              }
            } else {
              tabs === null || tabs === void 0 ? void 0 : tabs.appendChild(tab);
              tabpanels === null || tabpanels === void 0 ? void 0 : tabpanels.appendChild(tabpanel);
            }
            if (options.selectPanel) {
              tabbox.selectedTab = tab;
            }
            options.renderPanelHook(tabpanel, deck, window2, reader);
          });
        }
      };
      exports.ReaderTabPanelManager = ReaderTabPanelManager;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/menu.js
  var require_menu = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/menu.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MenuManager = void 0;
      var ui_1 = require_ui();
      var basic_1 = require_basic();
      var MenuManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.ui = new ui_1.UITool(this);
        }
        /**
         * Insert an menu item/menu(with popup)/menuseprator into a menupopup
         * @remarks
         * options:
         * ```ts
         * export interface MenuitemOptions {
         *   tag: "menuitem" | "menu" | "menuseparator";
         *   id?: string;
         *   label?: string;
         *   // data url (chrome://xxx.png) or base64 url (data:image/png;base64,xxx)
         *   icon?: string;
         *   class?: string;
         *   styles?: { [key: string]: string };
         *   hidden?: boolean;
         *   disabled?: boolean;
         *   oncommand?: string;
         *   commandListener?: EventListenerOrEventListenerObject;
         *   // Attributes below are used when type === "menu"
         *   popupId?: string;
         *   onpopupshowing?: string;
         *   subElementOptions?: Array<MenuitemOptions>;
         * }
         * ```
         * @param menuPopup
         * @param options
         * @param insertPosition
         * @param anchorElement The menuitem will be put before/after `anchorElement`. If not set, put at start/end of the menupopup.
         * @example
         * Insert menuitem with icon into item menupopup
         * ```ts
         * // base64 or chrome:// url
         * const menuIcon = "chrome://addontemplate/content/icons/favicon@0.5x.png";
         * ztoolkit.Menu.register("item", {
         *   tag: "menuitem",
         *   id: "zotero-itemmenu-addontemplate-test",
         *   label: "Addon Template: Menuitem",
         *   oncommand: "alert('Hello World! Default Menuitem.')",
         *   icon: menuIcon,
         * });
         * ```
         * @example
         * Insert menu into file menupopup
         * ```ts
         * ztoolkit.Menu.register(
         *   "menuFile",
         *   {
         *     tag: "menu",
         *     label: "Addon Template: Menupopup",
         *     subElementOptions: [
         *       {
         *         tag: "menuitem",
         *         label: "Addon Template",
         *         oncommand: "alert('Hello World! Sub Menuitem.')",
         *       },
         *     ],
         *   },
         *   "before",
         *   Zotero.getMainWindow().document.querySelector(
         *     "#zotero-itemmenu-addontemplate-test"
         *   )
         * );
         * ```
         */
        register(menuPopup, options, insertPosition = "after", anchorElement) {
          let popup;
          if (typeof menuPopup === "string") {
            popup = this.getGlobal("document").querySelector(MenuSelector[menuPopup]);
          } else {
            popup = menuPopup;
          }
          if (!popup) {
            return false;
          }
          const doc = popup.ownerDocument;
          const genMenuElement = (menuitemOption) => {
            var _a, _b;
            const elementOption = {
              tag: menuitemOption.tag,
              id: menuitemOption.id,
              namespace: "xul",
              attributes: {
                label: menuitemOption.label || "",
                hidden: Boolean(menuitemOption.hidden),
                disaled: Boolean(menuitemOption.disabled),
                class: menuitemOption.class || "",
                oncommand: menuitemOption.oncommand || ""
              },
              classList: menuitemOption.classList,
              styles: menuitemOption.styles || {},
              listeners: [],
              children: []
            };
            if (menuitemOption.icon) {
              if (!this.getGlobal("Zotero").isMac) {
                if (menuitemOption.tag === "menu") {
                  elementOption.attributes["class"] += " menu-iconic";
                } else {
                  elementOption.attributes["class"] += " menuitem-iconic";
                }
              }
              elementOption.styles["list-style-image"] = `url(${menuitemOption.icon})`;
            }
            if (menuitemOption.commandListener) {
              (_a = elementOption.listeners) === null || _a === void 0 ? void 0 : _a.push({
                type: "command",
                listener: menuitemOption.commandListener
              });
            }
            const menuItem = this.ui.createElement(doc, menuitemOption.tag, elementOption);
            if (menuitemOption.getVisibility) {
              popup.addEventListener("popupshowing", (ev) => {
                const showing = menuitemOption.getVisibility(menuItem, ev);
                if (showing) {
                  menuItem.removeAttribute("hidden");
                } else {
                  menuItem.setAttribute("hidden", "true");
                }
              });
            }
            if (menuitemOption.tag === "menu") {
              const subPopup = this.ui.createElement(doc, "menupopup", {
                id: menuitemOption.popupId,
                attributes: { onpopupshowing: menuitemOption.onpopupshowing || "" }
              });
              (_b = menuitemOption.children) === null || _b === void 0 ? void 0 : _b.forEach((childOption) => {
                subPopup.append(genMenuElement(childOption));
              });
              menuItem.append(subPopup);
            }
            return menuItem;
          };
          const topMenuItem = genMenuElement(options);
          if (!anchorElement) {
            anchorElement = insertPosition === "after" ? popup.lastElementChild : popup.firstElementChild;
          }
          anchorElement[insertPosition](topMenuItem);
        }
        unregister(menuId) {
          var _a;
          (_a = this.getGlobal("document").querySelector(`#${menuId}`)) === null || _a === void 0 ? void 0 : _a.remove();
        }
        unregisterAll() {
          this.ui.unregisterAll();
        }
      };
      exports.MenuManager = MenuManager;
      var MenuSelector;
      (function(MenuSelector2) {
        MenuSelector2["menuFile"] = "#menu_FilePopup";
        MenuSelector2["menuEdit"] = "#menu_EditPopup";
        MenuSelector2["menuView"] = "#menu_viewPopup";
        MenuSelector2["menuGo"] = "#menu_goPopup";
        MenuSelector2["menuTools"] = "#menu_ToolsPopup";
        MenuSelector2["menuHelp"] = "#menu_HelpPopup";
        MenuSelector2["collection"] = "#zotero-collectionmenu";
        MenuSelector2["item"] = "#zotero-itemmenu";
      })(MenuSelector || (MenuSelector = {}));
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/preferencePane.js
  var require_preferencePane = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/preferencePane.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PreferencePaneManager = void 0;
      var ui_1 = require_ui();
      var basic_1 = require_basic();
      var PreferencePaneManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.alive = true;
          this.ui = new ui_1.UITool(this);
          this.prefPaneCache = { win: void 0, listeners: {} };
        }
        /**
         * Register a preference pane from an xhtml, for Zotero 6 & 7.
         * @remarks
         * Don't forget to call `unregisterPrefPane` on exit.
         * @remarks
         * options:
         * ```ts
         * export interface PrefPaneOptions {
         *   pluginID: string;
         *   src: string;
         *   id?: string;
         *   parent?: string;
         *   label?: string;
         *   image?: string;
         *   extraDTD?: string[];
         *   scripts?: string[];
         *   defaultXUL?: boolean;
         *   // Only for Zotero 6
         *   onload?: (win: Window) => any;
         * }
         * ```
         *
         * @param options See {@link PrefPaneOptions}
         * @example
         * ```ts
         * const prefsManager = new PreferencePaneManager();
         * function initPrefs() {
         *   const prefOptions = {
         *     pluginID: addonID,
         *     src: rootURI + "chrome/content/preferences.xhtml",
         *     label: "Template",
         *     image: `chrome://${addonRef}/content/icons/favicon.png`,
         *     extraDTD: [`chrome://${addonRef}/locale/overlay.dtd`],
         *     defaultXUL: true
         *   };
         *   prefsManager.register(prefOptions);
         * };
         *
         * function unInitPrefs() {
         *   prefsManager.unregisterAll();
         * };
         * ```
         * // bootstrap.js:startup
         * initPrefs();
         *
         * // bootstrap.js:shutdown
         * unInitPrefs();
         */
        register(options) {
          if (this.isZotero7()) {
            this.getGlobal("Zotero").PreferencePanes.register(options);
            return;
          }
          const _initImportedNodesPostInsert = (container) => {
            var _a;
            const _observerSymbols = /* @__PURE__ */ new Map();
            const Zotero2 = this.getGlobal("Zotero");
            const window2 = container.ownerGlobal;
            let useChecked = (elem) => elem instanceof window2.HTMLInputElement && elem.type == "checkbox" || elem.tagName == "checkbox";
            let syncFromPref = (elem, preference) => {
              let value = Zotero2.Prefs.get(preference, true);
              if (useChecked(elem)) {
                elem.checked = value;
              } else {
                elem.value = value;
              }
              elem.dispatchEvent(new window2.Event("syncfrompreference"));
            };
            let syncToPrefOnModify = (event) => {
              const targetNode = event.currentTarget;
              if (targetNode === null || targetNode === void 0 ? void 0 : targetNode.getAttribute("preference")) {
                let value = useChecked(targetNode) ? targetNode.checked : targetNode.value;
                Zotero2.Prefs.set(targetNode.getAttribute("preference") || "", value, true);
                targetNode.dispatchEvent(new window2.Event("synctopreference"));
              }
            };
            let attachToPreference = (elem, preference) => {
              Zotero2.debug(`Attaching <${elem.tagName}> element to ${preference}`);
              let symbol = Zotero2.Prefs.registerObserver(preference, () => syncFromPref(elem, preference), true);
              _observerSymbols.set(elem, symbol);
            };
            let detachFromPreference = (elem) => {
              if (_observerSymbols.has(elem)) {
                Zotero2.debug(`Detaching <${elem.tagName}> element from preference`);
                Zotero2.Prefs.unregisterObserver(this._observerSymbols.get(elem));
                _observerSymbols.delete(elem);
              }
            };
            for (let elem of Array.from(container.querySelectorAll("[preference]"))) {
              let preference = elem.getAttribute("preference");
              if (container.querySelector("preferences > preference#" + preference)) {
                this.log("<preference> is deprecated -- `preference` attribute values should be full preference keys, not <preference> IDs");
                preference = (_a = container.querySelector("preferences > preference#" + preference)) === null || _a === void 0 ? void 0 : _a.getAttribute("name");
              }
              attachToPreference(elem, preference);
              elem.addEventListener(this.isXULElement(elem) ? "command" : "input", syncToPrefOnModify);
              window2.setTimeout(() => {
                syncFromPref(elem, preference);
              });
            }
            new window2.MutationObserver((mutations) => {
              for (let mutation of mutations) {
                if (mutation.type == "attributes") {
                  let target = mutation.target;
                  detachFromPreference(target);
                  if (target.hasAttribute("preference")) {
                    attachToPreference(target, target.getAttribute("preference") || "");
                    target.addEventListener(this.isXULElement(target) ? "command" : "input", syncToPrefOnModify);
                  }
                } else if (mutation.type == "childList") {
                  for (let node of Array.from(mutation.removedNodes)) {
                    detachFromPreference(node);
                  }
                  for (let node of Array.from(mutation.addedNodes)) {
                    if (node.nodeType == window2.Node.ELEMENT_NODE && node.hasAttribute("preference")) {
                      attachToPreference(node, node.getAttribute("preference") || "");
                      node.addEventListener(this.isXULElement(node) ? "command" : "input", syncToPrefOnModify);
                    }
                  }
                }
              }
            }).observe(container, {
              childList: true,
              subtree: true,
              attributeFilter: ["preference"]
            });
            for (let elem of Array.from(container.querySelectorAll("[oncommand]"))) {
              elem.oncommand = elem.getAttribute("oncommand");
            }
            for (let child of Array.from(container.children)) {
              child.dispatchEvent(new window2.Event("load"));
            }
          };
          const windowListener = {
            onOpenWindow: (xulWindow) => {
              if (!this.alive) {
                return;
              }
              const win = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
              win.addEventListener("load", async () => {
                var _a;
                if (win.location.href === "chrome://zotero/content/preferences/preferences.xul") {
                  this.log("registerPrefPane:detected", options);
                  const Zotero2 = this.getGlobal("Zotero");
                  options.id || (options.id = `plugin-${Zotero2.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`);
                  const contentOrXHR = await Zotero2.File.getContentsAsync(options.src);
                  const content = typeof contentOrXHR === "string" ? contentOrXHR : contentOrXHR.response;
                  const src = `<prefpane xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" id="${options.id}" insertafter="zotero-prefpane-advanced" label="${options.label || options.pluginID}" image="${options.image || ""}">
                ${content}
                </prefpane>`;
                  const frag = this.ui.parseXHTMLToFragment(src, options.extraDTD, options.defaultXUL);
                  this.log(frag);
                  const prefWindow = win.document.querySelector("prefwindow");
                  prefWindow.appendChild(frag);
                  const prefPane = win.document.querySelector(`#${options.id}`);
                  prefWindow.addPane(prefPane);
                  const contentBox = win.document.getAnonymousNodes(win.document.querySelector(`#${options.id}`))[0];
                  contentBox.style.overflowY = "scroll";
                  contentBox.style.height = "440px";
                  win.sizeToContent();
                  if (contentBox.scrollHeight === contentBox.clientHeight) {
                    contentBox.style.overflowY = "hidden";
                  }
                  this.prefPaneCache.win = win;
                  this.prefPaneCache.listeners[options.id] = windowListener;
                  _initImportedNodesPostInsert(prefPane);
                  if ((_a = options.scripts) === null || _a === void 0 ? void 0 : _a.length) {
                    options.scripts.forEach((script) => Services.scriptloader.loadSubScript(script, win));
                  }
                  if (options.onload) {
                    options.onload(win);
                  }
                }
              }, false);
            },
            onCloseWindow: () => {
            }
          };
          Services.wm.addListener(windowListener);
        }
        unregister(id) {
          var _a;
          const idx = Object.keys(this.prefPaneCache.listeners).indexOf(id);
          if (idx < 0) {
            return false;
          }
          const listener = this.prefPaneCache.listeners[id];
          Services.wm.removeListener(listener);
          listener.onOpenWindow = void 0;
          const win = this.prefPaneCache.win;
          if (win && !win.closed) {
            (_a = win.document.querySelector(`#${id}`)) === null || _a === void 0 ? void 0 : _a.remove();
          }
          delete this.prefPaneCache.listeners[id];
          return true;
        }
        /**
         * Unregister all preference panes added with this instance
         *
         * Called on exiting
         */
        unregisterAll() {
          this.alive = false;
          for (const id in this.prefPaneCache.listeners) {
            this.unregister(id);
          }
        }
      };
      exports.PreferencePaneManager = PreferencePaneManager;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/shortcut.js
  var require_shortcut = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/shortcut.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ShortcutManager = void 0;
      var basic_1 = require_basic();
      var ui_1 = require_ui();
      var basic_2 = require_basic();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
      var ShortcutManager = class extends basic_2.ManagerTool {
        constructor(base) {
          super(base);
          this.ui = new ui_1.UITool(this);
          this.creatorId = `${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`;
          this.initializeGlobal();
        }
        register(type, keyOptions) {
          const _keyOptions = keyOptions;
          _keyOptions.type = type;
          switch (_keyOptions.type) {
            case "event":
              this.registerEventKey(_keyOptions);
              return true;
            case "element":
              this.registerElementKey(_keyOptions);
              return true;
            case "prefs":
              this.getGlobal("Zotero").Prefs.set(_keyOptions.id, _keyOptions.key || "");
              return true;
            default:
              try {
                if (_keyOptions.register) {
                  return _keyOptions.register(_keyOptions);
                } else {
                  return false;
                }
              } catch (e) {
                this.log(e);
                return false;
              }
          }
        }
        /**
         * Get all shortcuts(element, event, prefs, builtin)
         */
        getAll() {
          return Array.prototype.concat(this.getMainWindowElementKeys(), this.getEventKeys(), this.getPrefsKeys(), this.getBuiltinKeys());
        }
        /**
         * Check key conflicting of `inputKeyOptions`.
         * @param inputKeyOptions
         * @param options
         * @returns conflicting keys array
         */
        checkKeyConflicting(inputKeyOptions, options = { includeEmpty: false, customKeys: [] }) {
          var _a;
          inputKeyOptions.modifiers = new KeyModifier(inputKeyOptions.modifiers || "").getRaw();
          let allKeys = this.getAll();
          if ((_a = options.customKeys) === null || _a === void 0 ? void 0 : _a.length) {
            allKeys = allKeys.concat(options.customKeys);
          }
          if (!options.includeEmpty) {
            allKeys = allKeys.filter((_keyOptions) => _keyOptions.key);
          }
          return allKeys.filter((_keyOptions) => {
            var _a2, _b;
            return _keyOptions.id !== inputKeyOptions.id && ((_a2 = _keyOptions.key) === null || _a2 === void 0 ? void 0 : _a2.toLowerCase()) === ((_b = inputKeyOptions.key) === null || _b === void 0 ? void 0 : _b.toLowerCase()) && _keyOptions.modifiers === inputKeyOptions.modifiers;
          });
        }
        /**
         * Find all key conflicting.
         * @param options
         * @returns An array of conflicting keys arrays. Same conflicting keys are put together.
         */
        checkAllKeyConflicting(options = { includeEmpty: false, customKeys: [] }) {
          var _a;
          let allKeys = this.getAll();
          if ((_a = options.customKeys) === null || _a === void 0 ? void 0 : _a.length) {
            allKeys = allKeys.concat(options.customKeys);
          }
          if (!options.includeEmpty) {
            allKeys = allKeys.filter((_keyOptions) => _keyOptions.key);
          }
          const conflicting = [];
          while (allKeys.length > 0) {
            const checkKey = allKeys.pop();
            const conflictKeys = allKeys.filter((_keyOptions) => {
              var _a2, _b;
              return ((_a2 = _keyOptions.key) === null || _a2 === void 0 ? void 0 : _a2.toLowerCase()) === ((_b = checkKey.key) === null || _b === void 0 ? void 0 : _b.toLowerCase()) && _keyOptions.modifiers === checkKey.modifiers;
            });
            if (conflictKeys.length) {
              conflictKeys.push(checkKey);
              conflicting.push(conflictKeys);
              const conflictingKeyIds = conflictKeys.map((key) => key.id);
              const toRemoveIds = [];
              allKeys.forEach((key, i) => conflictingKeyIds.includes(key.id) && toRemoveIds.push(i));
              toRemoveIds.sort((a, b) => b - a).forEach((id) => allKeys.splice(id, 1));
            }
          }
          return conflicting;
        }
        /**
         * Unregister a key.
         * @remarks
         * `builtin` keys cannot be unregistered.
         * @param keyOptions
         * @returns `true` for success and `false` for failure.
         */
        async unregister(keyOptions) {
          var _a;
          switch (keyOptions.type) {
            case "element":
              (_a = (keyOptions.xulData.document || this.getGlobal("document")).querySelector(`#${keyOptions.id}`)) === null || _a === void 0 ? void 0 : _a.remove();
              return true;
            case "prefs":
              this.getGlobal("Zotero").Prefs.set(keyOptions.id, "");
              return true;
            case "builtin":
              return false;
            case "event":
              let idx = this.globalCache.eventKeys.findIndex((currentKey) => currentKey.id === keyOptions.id);
              while (idx >= 0) {
                this.globalCache.eventKeys.splice(idx, 1);
                idx = this.globalCache.eventKeys.findIndex((currentKey) => currentKey.id === keyOptions.id);
              }
              return true;
            default:
              try {
                if (keyOptions.unregister) {
                  return await keyOptions.unregister(keyOptions);
                } else {
                  return false;
                }
              } catch (e) {
                this.log(e);
                return false;
              }
          }
        }
        /**
         * Unregister all keys created by this instance.
         */
        unregisterAll() {
          this.ui.unregisterAll();
          this.globalCache.eventKeys.filter((keyOptions) => keyOptions.creatorId === this.creatorId).forEach((keyOptions) => this.unregister(keyOptions));
        }
        initializeGlobal() {
          const Zotero2 = this.getGlobal("Zotero");
          const window2 = this.getGlobal("window");
          this.globalCache = toolkitGlobal_1.default.getInstance().shortcut;
          if (!this.globalCache._ready) {
            this.globalCache._ready = true;
            window2.addEventListener("keypress", (event) => {
              let eventMods = [];
              let eventModsWithAccel = [];
              if (event.altKey) {
                eventMods.push("alt");
                eventModsWithAccel.push("alt");
              }
              if (event.shiftKey) {
                eventMods.push("shift");
                eventModsWithAccel.push("shift");
              }
              if (event.metaKey) {
                eventMods.push("meta");
                Zotero2.isMac && eventModsWithAccel.push("accel");
              }
              if (event.ctrlKey) {
                eventMods.push("control");
                !Zotero2.isMac && eventModsWithAccel.push("accel");
              }
              const eventModStr = new KeyModifier(eventMods.join(",")).getRaw();
              const eventModStrWithAccel = new KeyModifier(eventMods.join(",")).getRaw();
              this.globalCache.eventKeys.forEach((keyOptions) => {
                var _a;
                if (keyOptions.disabled) {
                  return;
                }
                const modStr = new KeyModifier(keyOptions.modifiers || "").getRaw();
                if ((modStr === eventModStr || modStr === eventModStrWithAccel) && ((_a = keyOptions.key) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === event.key.toLowerCase()) {
                  keyOptions.callback();
                }
              });
            });
          }
        }
        registerEventKey(keyOptions) {
          keyOptions.creatorId = this.creatorId;
          this.globalCache.eventKeys.push(keyOptions);
        }
        /**
         * Register Element \<commandset\>. In general, use `registerElementKey` or `registerKey`.
         * @param commandSetOptions
         */
        registerElementCommandset(commandSetOptions) {
          var _a;
          (_a = commandSetOptions.document.querySelector("window")) === null || _a === void 0 ? void 0 : _a.appendChild(this.ui.createElement(commandSetOptions.document, "commandset", {
            id: commandSetOptions.id,
            skipIfExists: true,
            children: commandSetOptions.commands.map((cmd) => ({
              tag: "command",
              id: cmd.id,
              attributes: {
                oncommand: cmd.oncommand,
                disabled: cmd.disabled,
                label: cmd.label
              }
            }))
          }));
        }
        /**
         * Register Element \<command\>. In general, use `registerElementKey` or `registerKey`.
         * @param commandOptions
         */
        registerElementCommand(commandOptions) {
          var _a;
          if (commandOptions._parentId) {
            this.registerElementCommandset({
              id: commandOptions._parentId,
              document: commandOptions.document,
              commands: []
            });
          }
          (_a = commandOptions.document.querySelector(`commandset#${commandOptions._parentId}`)) === null || _a === void 0 ? void 0 : _a.appendChild(this.ui.createElement(commandOptions.document, "command", {
            id: commandOptions.id,
            skipIfExists: true,
            attributes: {
              oncommand: commandOptions.oncommand,
              disabled: commandOptions.disabled,
              label: commandOptions.label
            }
          }));
        }
        /**
         * Register Element \<keyset\>. In general, use `registerElementKey` or `registerKey`.
         * @param keySetOptions
         */
        registerElementKeyset(keySetOptions) {
          var _a;
          (_a = keySetOptions.document.querySelector("window")) === null || _a === void 0 ? void 0 : _a.appendChild(this.ui.createElement(keySetOptions.document, "keyset", {
            id: keySetOptions.id,
            skipIfExists: true,
            children: keySetOptions.keys.map((keyOptions) => ({
              tag: "key",
              id: keyOptions.id,
              attributes: {
                oncommand: keyOptions.xulData.oncommand || "//",
                command: keyOptions.xulData.command,
                modifiers: keyOptions.modifiers,
                key: this.getXULKey(keyOptions.key),
                keycode: this.getXULKeyCode(keyOptions.key),
                disabled: keyOptions.disabled
              }
            }))
          }));
        }
        /**
         * Register a shortcut key element \<key\>.
         * @remarks
         * Provide `_parentId` to register a \<keyset\>;
         *
         * Provide `_commandOptions` to register a \<command\>;
         *
         * Provide `_parentId` in `_commandOptions` to register a \<commandset\>.
         *
         * See examples for more details.
         * @param keyOptions
         * @example
         */
        registerElementKey(keyOptions) {
          var _a;
          const doc = keyOptions.xulData.document || this.getGlobal("document");
          if (keyOptions.xulData._parentId) {
            this.registerElementKeyset({
              id: keyOptions.xulData._parentId,
              document: doc,
              keys: []
            });
          }
          (_a = doc.querySelector(`keyset#${keyOptions.xulData._parentId}`)) === null || _a === void 0 ? void 0 : _a.appendChild(this.ui.createElement(doc, "key", {
            id: keyOptions.id,
            skipIfExists: true,
            attributes: {
              oncommand: keyOptions.xulData.oncommand || "//",
              command: keyOptions.xulData.command,
              modifiers: keyOptions.modifiers,
              key: this.getXULKey(keyOptions.key),
              keycode: this.getXULKeyCode(keyOptions.key),
              disabled: keyOptions.disabled
            }
          }));
          if (keyOptions.xulData._commandOptions) {
            this.registerElementCommand(keyOptions.xulData._commandOptions);
          }
        }
        getXULKey(standardKey) {
          if (standardKey.length === 1) {
            return standardKey;
          }
          return void 0;
        }
        getXULKeyCode(standardKey) {
          const idx = Object.values(XUL_KEYCODE_MAPS).findIndex((value) => value === standardKey);
          if (idx >= 0) {
            return Object.values(XUL_KEYCODE_MAPS)[idx];
          }
          return void 0;
        }
        getStandardKey(XULKey, XULKeyCode) {
          if (XULKeyCode && Object.keys(XUL_KEYCODE_MAPS).includes(XULKeyCode)) {
            return XUL_KEYCODE_MAPS[XULKeyCode];
          } else {
            return XULKey;
          }
        }
        /**
         * Get all \<commandset\> details.
         * @param doc
         */
        getElementCommandSets(doc) {
          return Array.from((doc || this.getGlobal("document")).querySelectorAll("commandset")).map((cmdSet) => ({
            id: cmdSet.id,
            commands: Array.from(cmdSet.querySelectorAll("command")).map((cmd) => ({
              id: cmd.id,
              oncommand: cmd.getAttribute("oncommand"),
              disabled: cmd.getAttribute("disabled") === "true",
              label: cmd.getAttribute("label"),
              _parentId: cmdSet.id
            }))
          }));
        }
        /**
         * Get all \<command\> details.
         * @param doc
         */
        getElementCommands(doc) {
          return Array.prototype.concat(...this.getElementCommandSets(doc).map((cmdSet) => cmdSet.commands));
        }
        /**
         * Get all \<keyset\> details.
         * @param doc
         * @param options
         */
        getElementKeySets(doc) {
          let allCommends = this.getElementCommands(doc);
          return Array.from((doc || this.getGlobal("document")).querySelectorAll("keyset")).map((keysetElem) => ({
            id: keysetElem.id,
            document: doc,
            keys: Array.from(keysetElem.querySelectorAll("key")).map((keyElem) => {
              const oncommand = keyElem.getAttribute("oncommand") || "";
              const commandId = keyElem.getAttribute("command") || "";
              const commandOptions = allCommends.find((cmd) => cmd.id === commandId);
              const key = {
                type: "element",
                id: keyElem.id,
                key: this.getStandardKey(keyElem.getAttribute("key") || "", keyElem.getAttribute("keycode") || ""),
                modifiers: new KeyModifier(keyElem.getAttribute("modifiers") || "").getRaw(),
                disabled: keyElem.getAttribute("disabled") === "true",
                xulData: {
                  document: doc,
                  oncommand,
                  command: commandId,
                  _parentId: keysetElem.id,
                  _commandOptions: commandOptions
                },
                callback: () => {
                  const win = doc.ownerGlobal;
                  const _eval = win.eval;
                  _eval(oncommand);
                  _eval((commandOptions === null || commandOptions === void 0 ? void 0 : commandOptions.oncommand) || "");
                }
              };
              return key;
            })
          }));
        }
        /**
         * Get all \<key\> details.
         * @param doc
         * @param options
         */
        getElementKeys(doc) {
          return Array.prototype.concat(...this.getElementKeySets(doc).map((keyset) => keyset.keys)).filter((elemKey) => !ELEM_KEY_IGNORE.includes(elemKey.id));
        }
        /**
         * Get \<key\> details in main window.
         * @param options
         */
        getMainWindowElementKeys() {
          return this.getElementKeys(this.getGlobal("document"));
        }
        getEventKeys() {
          return this.globalCache.eventKeys;
        }
        /**
         * Get Zotero builtin keys defined in preferences.
         */
        getPrefsKeys() {
          const Zotero2 = this.getGlobal("Zotero");
          return PREF_KEYS.map((pref) => ({
            id: pref.id,
            modifiers: pref.modifiers,
            key: Zotero2.Prefs.get(pref.id),
            callback: pref.callback,
            type: "prefs"
          }));
        }
        /**
         * Get Zotero builtin keys not defined in preferences.
         */
        getBuiltinKeys() {
          return BUILTIN_KEYS.map((builtin) => ({
            id: builtin.id,
            modifiers: builtin.modifiers,
            key: builtin.key,
            callback: builtin.callback,
            type: "builtin"
          }));
        }
      };
      exports.ShortcutManager = ShortcutManager;
      var KeyModifier = class {
        constructor(raw) {
          raw = raw || "";
          this.accel = raw.includes("accel");
          this.shift = raw.includes("shift");
          this.control = raw.includes("control");
          this.meta = raw.includes("meta");
          this.alt = raw.includes("alt");
        }
        equals(newMod) {
          this.accel === newMod.accel;
          this.shift === newMod.shift;
          this.control === newMod.control;
          this.meta === newMod.meta;
          this.alt === newMod.alt;
        }
        getRaw() {
          const enabled = [];
          this.accel && enabled.push("accel");
          this.shift && enabled.push("shift");
          this.control && enabled.push("control");
          this.meta && enabled.push("meta");
          this.alt && enabled.push("alt");
          return enabled.join(",");
        }
      };
      var XUL_KEYCODE_MAPS;
      (function(XUL_KEYCODE_MAPS2) {
        XUL_KEYCODE_MAPS2["VK_CANCEL"] = "Unidentified";
        XUL_KEYCODE_MAPS2["VK_BACK"] = "Backspace";
        XUL_KEYCODE_MAPS2["VK_TAB"] = "Tab";
        XUL_KEYCODE_MAPS2["VK_CLEAR"] = "Clear";
        XUL_KEYCODE_MAPS2["VK_RETURN"] = "Enter";
        XUL_KEYCODE_MAPS2["VK_ENTER"] = "Enter";
        XUL_KEYCODE_MAPS2["VK_SHIFT"] = "Shift";
        XUL_KEYCODE_MAPS2["VK_CONTROL"] = "Control";
        XUL_KEYCODE_MAPS2["VK_ALT"] = "Alt";
        XUL_KEYCODE_MAPS2["VK_PAUSE"] = "Pause";
        XUL_KEYCODE_MAPS2["VK_CAPS_LOCK"] = "CapsLock";
        XUL_KEYCODE_MAPS2["VK_ESCAPE"] = "Escape";
        XUL_KEYCODE_MAPS2["VK_SPACE"] = " ";
        XUL_KEYCODE_MAPS2["VK_PAGE_UP"] = "PageUp";
        XUL_KEYCODE_MAPS2["VK_PAGE_DOWN"] = "PageDown";
        XUL_KEYCODE_MAPS2["VK_END"] = "End";
        XUL_KEYCODE_MAPS2["VK_HOME"] = "Home";
        XUL_KEYCODE_MAPS2["VK_LEFT"] = "ArrowLeft";
        XUL_KEYCODE_MAPS2["VK_UP"] = "ArrowUp";
        XUL_KEYCODE_MAPS2["VK_RIGHT"] = "ArrowRight";
        XUL_KEYCODE_MAPS2["VK_DOWN"] = "ArrowDown";
        XUL_KEYCODE_MAPS2["VK_PRINTSCREEN"] = "PrintScreen";
        XUL_KEYCODE_MAPS2["VK_INSERT"] = "Insert";
        XUL_KEYCODE_MAPS2["VK_DELETE"] = "Backspace";
        XUL_KEYCODE_MAPS2["VK_0"] = "0";
        XUL_KEYCODE_MAPS2["VK_1"] = "1";
        XUL_KEYCODE_MAPS2["VK_2"] = "2";
        XUL_KEYCODE_MAPS2["VK_3"] = "3";
        XUL_KEYCODE_MAPS2["VK_4"] = "4";
        XUL_KEYCODE_MAPS2["VK_5"] = "5";
        XUL_KEYCODE_MAPS2["VK_6"] = "6";
        XUL_KEYCODE_MAPS2["VK_7"] = "7";
        XUL_KEYCODE_MAPS2["VK_8"] = "8";
        XUL_KEYCODE_MAPS2["VK_9"] = "9";
        XUL_KEYCODE_MAPS2["VK_A"] = "A";
        XUL_KEYCODE_MAPS2["VK_B"] = "B";
        XUL_KEYCODE_MAPS2["VK_C"] = "C";
        XUL_KEYCODE_MAPS2["VK_D"] = "D";
        XUL_KEYCODE_MAPS2["VK_E"] = "E";
        XUL_KEYCODE_MAPS2["VK_F"] = "F";
        XUL_KEYCODE_MAPS2["VK_G"] = "G";
        XUL_KEYCODE_MAPS2["VK_H"] = "H";
        XUL_KEYCODE_MAPS2["VK_I"] = "I";
        XUL_KEYCODE_MAPS2["VK_J"] = "J";
        XUL_KEYCODE_MAPS2["VK_K"] = "K";
        XUL_KEYCODE_MAPS2["VK_L"] = "L";
        XUL_KEYCODE_MAPS2["VK_M"] = "M";
        XUL_KEYCODE_MAPS2["VK_N"] = "N";
        XUL_KEYCODE_MAPS2["VK_O"] = "O";
        XUL_KEYCODE_MAPS2["VK_P"] = "P";
        XUL_KEYCODE_MAPS2["VK_Q"] = "Q";
        XUL_KEYCODE_MAPS2["VK_R"] = "R";
        XUL_KEYCODE_MAPS2["VK_S"] = "S";
        XUL_KEYCODE_MAPS2["VK_T"] = "T";
        XUL_KEYCODE_MAPS2["VK_U"] = "U";
        XUL_KEYCODE_MAPS2["VK_V"] = "V";
        XUL_KEYCODE_MAPS2["VK_W"] = "W";
        XUL_KEYCODE_MAPS2["VK_X"] = "X";
        XUL_KEYCODE_MAPS2["VK_Y"] = "Y";
        XUL_KEYCODE_MAPS2["VK_Z"] = "Z";
        XUL_KEYCODE_MAPS2["VK_SEMICOLON"] = "Unidentified";
        XUL_KEYCODE_MAPS2["VK_EQUALS"] = "Unidentified";
        XUL_KEYCODE_MAPS2["VK_NUMPAD0"] = "0";
        XUL_KEYCODE_MAPS2["VK_NUMPAD1"] = "1";
        XUL_KEYCODE_MAPS2["VK_NUMPAD2"] = "2";
        XUL_KEYCODE_MAPS2["VK_NUMPAD3"] = "3";
        XUL_KEYCODE_MAPS2["VK_NUMPAD4"] = "4";
        XUL_KEYCODE_MAPS2["VK_NUMPAD5"] = "5";
        XUL_KEYCODE_MAPS2["VK_NUMPAD6"] = "6";
        XUL_KEYCODE_MAPS2["VK_NUMPAD7"] = "7";
        XUL_KEYCODE_MAPS2["VK_NUMPAD8"] = "8";
        XUL_KEYCODE_MAPS2["VK_NUMPAD9"] = "9";
        XUL_KEYCODE_MAPS2["VK_MULTIPLY"] = "Multiply";
        XUL_KEYCODE_MAPS2["VK_ADD"] = "Add";
        XUL_KEYCODE_MAPS2["VK_SEPARATOR"] = "Separator";
        XUL_KEYCODE_MAPS2["VK_SUBTRACT"] = "Subtract";
        XUL_KEYCODE_MAPS2["VK_DECIMAL"] = "Decimal";
        XUL_KEYCODE_MAPS2["VK_DIVIDE"] = "Divide";
        XUL_KEYCODE_MAPS2["VK_F1"] = "F1";
        XUL_KEYCODE_MAPS2["VK_F2"] = "F2";
        XUL_KEYCODE_MAPS2["VK_F3"] = "F3";
        XUL_KEYCODE_MAPS2["VK_F4"] = "F4";
        XUL_KEYCODE_MAPS2["VK_F5"] = "F5";
        XUL_KEYCODE_MAPS2["VK_F6"] = "F6";
        XUL_KEYCODE_MAPS2["VK_F7"] = "F7";
        XUL_KEYCODE_MAPS2["VK_F8"] = "F8";
        XUL_KEYCODE_MAPS2["VK_F9"] = "F9";
        XUL_KEYCODE_MAPS2["VK_F10"] = "F10";
        XUL_KEYCODE_MAPS2["VK_F11"] = "F11";
        XUL_KEYCODE_MAPS2["VK_F12"] = "F12";
        XUL_KEYCODE_MAPS2["VK_F13"] = "F13";
        XUL_KEYCODE_MAPS2["VK_F14"] = "F14";
        XUL_KEYCODE_MAPS2["VK_F15"] = "F15";
        XUL_KEYCODE_MAPS2["VK_F16"] = "F16";
        XUL_KEYCODE_MAPS2["VK_F17"] = "F17";
        XUL_KEYCODE_MAPS2["VK_F18"] = "F18";
        XUL_KEYCODE_MAPS2["VK_F19"] = "F19";
        XUL_KEYCODE_MAPS2["VK_F20"] = "F20";
        XUL_KEYCODE_MAPS2["VK_F21"] = "Soft1";
        XUL_KEYCODE_MAPS2["VK_F22"] = "Soft2";
        XUL_KEYCODE_MAPS2["VK_F23"] = "Soft3";
        XUL_KEYCODE_MAPS2["VK_F24"] = "Soft4";
        XUL_KEYCODE_MAPS2["VK_NUM_LOCK"] = "NumLock";
        XUL_KEYCODE_MAPS2["VK_SCROLL_LOCK"] = "ScrollLock";
        XUL_KEYCODE_MAPS2["VK_COMMA"] = ",";
        XUL_KEYCODE_MAPS2["VK_PERIOD"] = ".";
        XUL_KEYCODE_MAPS2["VK_SLASH"] = "Divide";
        XUL_KEYCODE_MAPS2["VK_BACK_QUOTE"] = "`";
        XUL_KEYCODE_MAPS2["VK_OPEN_BRACKET"] = "[";
        XUL_KEYCODE_MAPS2["VK_CLOSE_BRACKET"] = "]";
        XUL_KEYCODE_MAPS2["VK_QUOTE"] = "\\";
        XUL_KEYCODE_MAPS2["VK_HELP"] = "Help";
      })(XUL_KEYCODE_MAPS || (XUL_KEYCODE_MAPS = {}));
      function getElementKeyCallback(keyId) {
        return function() {
          var _a;
          const win = basic_1.BasicTool.getZotero().getMainWindow();
          const keyElem = win.document.querySelector(`#${keyId}`);
          if (!keyElem) {
            return function() {
            };
          }
          const _eval = win.eval;
          _eval(keyElem.getAttribute("oncommand") || "//");
          const cmdId = keyElem.getAttribute("command");
          if (!cmdId) {
            return;
          }
          _eval(((_a = win.document.querySelector(`#${cmdId}`)) === null || _a === void 0 ? void 0 : _a.getAttribute("oncommand")) || "//");
        };
      }
      function getBuiltinEventKeyCallback(eventId) {
        return function() {
          const Zotero2 = basic_1.BasicTool.getZotero();
          const ZoteroPane = Zotero2.getActiveZoteroPane();
          ZoteroPane.handleKeyPress({
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            originalTarget: { id: "" },
            preventDefault: () => {
            },
            key: Zotero2.Prefs.get(`extensions.zotero.keys.${eventId}`, true)
          });
        };
      }
      var ELEM_KEY_IGNORE = ["key_copyCitation", "key_copyBibliography"];
      var PREF_KEYS = [
        {
          id: "extensions.zotero.keys.copySelectedItemCitationsToClipboard",
          modifiers: "accel,shift",
          elemId: "key_copyCitation",
          callback: getElementKeyCallback("key_copyCitation")
        },
        {
          id: "extensions.zotero.keys.copySelectedItemsToClipboard",
          modifiers: "accel,shift",
          elemId: "key_copyBibliography",
          callback: getElementKeyCallback("key_copyBibliography")
        },
        {
          id: "extensions.zotero.keys.library",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("library")
        },
        {
          id: "extensions.zotero.keys.newItem",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("newItem")
        },
        {
          id: "extensions.zotero.keys.newNote",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("newNote")
        },
        {
          id: "extensions.zotero.keys.quicksearch",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("quicksearch")
        },
        {
          id: "extensions.zotero.keys.saveToZotero",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("saveToZotero")
        },
        {
          id: "extensions.zotero.keys.sync",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("sync")
        },
        {
          id: "extensions.zotero.keys.toggleAllRead",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("toggleAllRead")
        },
        {
          id: "extensions.zotero.keys.toggleRead",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("toggleRead")
        }
      ];
      var BUILTIN_KEYS = [
        {
          id: "showItemCollection",
          modifiers: "",
          key: "Ctrl",
          callback: () => {
            const Zotero2 = basic_1.BasicTool.getZotero();
            const ZoteroPane = Zotero2.getActiveZoteroPane();
            ZoteroPane.handleKeyUp({
              originalTarget: {
                id: ZoteroPane.itemsView ? ZoteroPane.itemsView.id : ""
              },
              keyCode: Zotero2.isWin ? 17 : 18
            });
          }
        },
        {
          id: "closeSelectedTab",
          modifiers: "accel",
          key: "W",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            if (ztabs.selectedIndex > 0) {
              ztabs.close("");
            }
          }
        },
        {
          id: "undoCloseTab",
          modifiers: "accel,shift",
          key: "T",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.undoClose();
          }
        },
        {
          id: "selectNextTab",
          modifiers: "control",
          key: "Tab",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.selectPrev();
          }
        },
        {
          id: "selectPreviousTab",
          modifiers: "control,shift",
          key: "Tab",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.selectNext();
          }
        },
        {
          id: "selectTab1",
          modifiers: "accel",
          key: "1",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(0);
          }
        },
        {
          id: "selectTab2",
          modifiers: "accel",
          key: "2",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(1);
          }
        },
        {
          id: "selectTab3",
          modifiers: "accel",
          key: "3",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(2);
          }
        },
        {
          id: "selectTab4",
          modifiers: "accel",
          key: "4",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(3);
          }
        },
        {
          id: "selectTab5",
          modifiers: "accel",
          key: "5",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(4);
          }
        },
        {
          id: "selectTab6",
          modifiers: "accel",
          key: "6",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(5);
          }
        },
        {
          id: "selectTab7",
          modifiers: "accel",
          key: "7",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(6);
          }
        },
        {
          id: "selectTab8",
          modifiers: "accel",
          key: "8",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(7);
          }
        },
        {
          id: "selectTabLast",
          modifiers: "accel",
          key: "9",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.selectLast();
          }
        }
      ];
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/helpers/clipboard.js
  var require_clipboard = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/helpers/clipboard.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ClipboardHelper = void 0;
      var basic_1 = require_basic();
      var ClipboardHelper = class extends basic_1.BasicTool {
        constructor() {
          super();
          this.filePath = "";
          this.transferable = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
          this.clipboardService = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
          this.transferable.init(null);
        }
        addText(source, type = "text/plain") {
          const str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
          str.data = source;
          if (this.isFX115() && type === "text/unicode")
            type = "text/plain";
          this.transferable.addDataFlavor(type);
          this.transferable.setTransferData(type, str, source.length * 2);
          return this;
        }
        addImage(source) {
          let parts = source.split(",");
          if (!parts[0].includes("base64")) {
            return this;
          }
          let mime = parts[0].match(/:(.*?);/)[1];
          let bstr = this.getGlobal("window").atob(parts[1]);
          let n = bstr.length;
          let u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          let imgTools = Components.classes["@mozilla.org/image/tools;1"].getService(Components.interfaces.imgITools);
          let mimeType;
          let img;
          if (this.getGlobal("Zotero").platformMajorVersion >= 102) {
            img = imgTools.decodeImageFromArrayBuffer(u8arr.buffer, mime);
            mimeType = "application/x-moz-nativeimage";
          } else {
            mimeType = `image/png`;
            img = Components.classes["@mozilla.org/supports-interface-pointer;1"].createInstance(Components.interfaces.nsISupportsInterfacePointer);
            img.data = imgTools.decodeImageFromArrayBuffer(u8arr.buffer, mimeType);
          }
          this.transferable.addDataFlavor(mimeType);
          this.transferable.setTransferData(mimeType, img, 0);
          return this;
        }
        addFile(path) {
          const file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
          file.initWithPath(path);
          this.transferable.addDataFlavor("application/x-moz-file");
          this.transferable.setTransferData("application/x-moz-file", file);
          this.filePath = path;
          return this;
        }
        copy() {
          try {
            this.clipboardService.setData(this.transferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
          } catch (e) {
            if (this.filePath && Zotero.isMac) {
              Zotero.Utilities.Internal.exec(`/usr/bin/osascript`, [
                `-e`,
                `set the clipboard to POSIX file "${this.filePath}"`
              ]);
            } else {
              throw e;
            }
          }
          return this;
        }
      };
      exports.ClipboardHelper = ClipboardHelper;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/helpers/filePicker.js
  var require_filePicker = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/helpers/filePicker.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FilePickerHelper = void 0;
      var basic_1 = require_basic();
      var FilePickerHelper = class extends basic_1.BasicTool {
        constructor(title, mode, filters, suggestion, window2, filterMask, directory) {
          super();
          this.title = title;
          this.mode = mode;
          this.filters = filters;
          this.suggestion = suggestion;
          this.directory = directory;
          this.window = window2;
          this.filterMask = filterMask;
        }
        async open() {
          let backend;
          if (this.isFX115()) {
            backend = ChromeUtils.importESModule("chrome://zotero/content/modules/filePicker.mjs").FilePicker;
          } else {
            backend = this.getGlobal("require")("zotero/modules/filePicker").default;
          }
          const fp = new backend();
          fp.init(this.window || this.getGlobal("window"), this.title, this.getMode(fp));
          for (const [label, ext] of this.filters || []) {
            fp.appendFilter(label, ext);
          }
          if (this.filterMask)
            fp.appendFilters(this.getFilterMask(fp));
          if (this.suggestion)
            fp.defaultString = this.suggestion;
          if (this.directory)
            fp.displayDirectory = this.directory;
          const userChoice = await fp.show();
          switch (userChoice) {
            case fp.returnOK:
            case fp.returnReplace:
              return this.mode === "multiple" ? fp.files : fp.file;
            default:
              return false;
          }
        }
        getMode(fp) {
          switch (this.mode) {
            case "open":
              return fp.modeOpen;
            case "save":
              return fp.modeSave;
            case "folder":
              return fp.modeGetFolder;
            case "multiple":
              return fp.modeOpenMultiple;
            default:
              return 0;
          }
        }
        getFilterMask(fp) {
          switch (this.filterMask) {
            case "all":
              return fp.filterAll;
            case "html":
              return fp.filterHTML;
            case "text":
              return fp.filterText;
            case "images":
              return fp.filterImages;
            case "xml":
              return fp.filterXML;
            case "apps":
              return fp.filterApps;
            case "urls":
              return fp.filterAllowURLs;
            case "audio":
              return fp.filterAudio;
            case "video":
              return fp.filterVideo;
            default:
              return 1;
          }
        }
      };
      exports.FilePickerHelper = FilePickerHelper;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/helpers/progressWindow.js
  var require_progressWindow = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/helpers/progressWindow.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ProgressWindowHelper = void 0;
      var basic_1 = require_basic();
      var ProgressWindowHelper = class extends Zotero.ProgressWindow {
        /**
         *
         * @param header window header
         * @param options
         */
        constructor(header, options = {
          closeOnClick: true,
          closeTime: 5e3
        }) {
          super(options);
          this.lines = [];
          this.closeTime = options.closeTime || 5e3;
          this.changeHeadline(header);
          this.originalShow = this.show;
          this.show = this.showWithTimer;
          if (options.closeOtherProgressWindows) {
            basic_1.BasicTool.getZotero().ProgressWindowSet.closeAll();
          }
        }
        /**
         * Create a new line
         * @param options
         */
        createLine(options) {
          const icon = this.getIcon(options.type, options.icon);
          const line = new this.ItemProgress(icon || "", options.text || "");
          if (typeof options.progress === "number") {
            line.setProgress(options.progress);
          }
          this.lines.push(line);
          this.updateIcons();
          return this;
        }
        /**
         * Change the line content
         * @param options
         */
        changeLine(options) {
          var _a;
          if (((_a = this.lines) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            return this;
          }
          const idx = typeof options.idx !== "undefined" && options.idx >= 0 && options.idx < this.lines.length ? options.idx : 0;
          const icon = this.getIcon(options.type, options.icon);
          if (icon) {
            this.lines[idx].setItemTypeAndIcon(icon);
          }
          options.text && this.lines[idx].setText(options.text);
          typeof options.progress === "number" && this.lines[idx].setProgress(options.progress);
          this.updateIcons();
          return this;
        }
        showWithTimer(closeTime = void 0) {
          this.originalShow();
          typeof closeTime !== "undefined" && (this.closeTime = closeTime);
          if (this.closeTime && this.closeTime > 0) {
            this.startCloseTimer(this.closeTime);
          }
          setTimeout(this.updateIcons.bind(this), 50);
          return this;
        }
        /**
         * Set custom icon uri for progress window
         * @param key
         * @param uri
         */
        static setIconURI(key, uri) {
          icons[key] = uri;
        }
        getIcon(type, defaultIcon) {
          return type && type in icons ? icons[type] : defaultIcon;
        }
        updateIcons() {
          try {
            this.lines.forEach((line) => {
              const box = line._image;
              const icon = box.dataset.itemType;
              if (icon && icon.startsWith("chrome://") && !box.style.backgroundImage.includes("progress_arcs")) {
                box.style.backgroundImage = `url(${box.dataset.itemType})`;
              }
            });
          } catch (e) {
          }
        }
      };
      exports.ProgressWindowHelper = ProgressWindowHelper;
      var icons = {
        success: "chrome://zotero/skin/tick.png",
        fail: "chrome://zotero/skin/cross.png"
      };
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/helpers/virtualizedTable.js
  var require_virtualizedTable = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/helpers/virtualizedTable.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.VirtualizedTableHelper = void 0;
      var basic_1 = require_basic();
      var VirtualizedTableHelper = class extends basic_1.BasicTool {
        constructor(win) {
          super();
          this.window = win;
          const Zotero2 = this.getGlobal("Zotero");
          const _require = win.require;
          this.React = _require("react");
          this.ReactDOM = _require("react-dom");
          this.VirtualizedTable = _require("components/virtualized-table");
          this.IntlProvider = _require("react-intl").IntlProvider;
          this.props = {
            id: `${Zotero2.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`,
            getRowCount: () => 0
          };
          this.localeStrings = Zotero2.Intl.strings;
        }
        setProp(...args) {
          if (args.length === 1) {
            Object.assign(this.props, args[0]);
          } else if (args.length === 2) {
            this.props[args[0]] = args[1];
          }
          return this;
        }
        /**
         * Set locale strings, which replaces the table header's label if matches. Default it's `Zotero.Intl.strings`
         * @param localeStrings
         */
        setLocale(localeStrings) {
          Object.assign(this.localeStrings, localeStrings);
          return this;
        }
        /**
         * Set container element id that the table will be rendered on.
         * @param id element id
         */
        setContainerId(id) {
          this.containerId = id;
          return this;
        }
        /**
         * Render the table.
         * @param selectId Which row to select after rendering
         * @param onfulfilled callback after successfully rendered
         * @param onrejected callback after rendering with error
         */
        render(selectId, onfulfilled, onrejected) {
          const refreshSelection = () => {
            this.treeInstance.invalidate();
            if (typeof selectId !== "undefined" && selectId >= 0) {
              this.treeInstance.selection.select(selectId);
            } else {
              this.treeInstance.selection.clearSelection();
            }
          };
          if (!this.treeInstance) {
            const vtableProps = Object.assign({}, this.props, {
              ref: (ref) => this.treeInstance = ref
            });
            if (vtableProps.getRowData && !vtableProps.renderItem) {
              Object.assign(vtableProps, {
                renderItem: this.VirtualizedTable.makeRowRenderer(vtableProps.getRowData)
              });
            }
            const elem = this.React.createElement(this.IntlProvider, { locale: Zotero.locale, messages: Zotero.Intl.strings }, this.React.createElement(this.VirtualizedTable, vtableProps));
            const container = this.window.document.getElementById(this.containerId);
            new Promise((resolve) => this.ReactDOM.render(elem, container, resolve)).then(() => {
              this.getGlobal("setTimeout")(() => {
                refreshSelection();
              });
            }).then(onfulfilled, onrejected);
          } else {
            refreshSelection();
          }
          return this;
        }
      };
      exports.VirtualizedTableHelper = VirtualizedTableHelper;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/helpers/dialog.js
  var require_dialog = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/helpers/dialog.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DialogHelper = void 0;
      var ui_1 = require_ui();
      var DialogHelper = class extends ui_1.UITool {
        /**
         * Create a dialog helper with row \* column grids.
         * @param row
         * @param column
         */
        constructor(row, column) {
          super();
          if (row <= 0 || column <= 0) {
            throw Error(`row and column must be positive integers.`);
          }
          this.elementProps = {
            tag: "vbox",
            attributes: { flex: 1 },
            styles: {
              width: "100%",
              height: "100%"
            },
            children: []
          };
          for (let i = 0; i < Math.max(row, 1); i++) {
            this.elementProps.children.push({
              tag: "hbox",
              attributes: { flex: 1 },
              children: []
            });
            for (let j = 0; j < Math.max(column, 1); j++) {
              this.elementProps.children[i].children.push({
                tag: "vbox",
                attributes: { flex: 1 },
                children: []
              });
            }
          }
          this.elementProps.children.push({
            tag: "hbox",
            attributes: { flex: 0, pack: "end" },
            children: []
          });
          this.dialogData = {};
        }
        /**
         * Add a cell at (row, column). Index starts from 0.
         * @param row
         * @param column
         * @param elementProps Cell element props. See {@link ElementProps}
         * @param cellFlex If the cell is flex. Default true.
         */
        addCell(row, column, elementProps, cellFlex = true) {
          if (row >= this.elementProps.children.length || column >= this.elementProps.children[row].children.length) {
            throw Error(`Cell index (${row}, ${column}) is invalid, maximum (${this.elementProps.children.length}, ${this.elementProps.children[0].children.length})`);
          }
          this.elementProps.children[row].children[column].children = [
            elementProps
          ];
          this.elementProps.children[row].children[column].attributes.flex = cellFlex ? 1 : 0;
          return this;
        }
        /**
         * Add a control button to the bottom of the dialog.
         * @param label Button label
         * @param id Button id.
         * The corresponding id of the last button user clicks before window exit will be set to `dialogData._lastButtonId`.
         * @param options.noClose Don't close window when clicking this button.
         * @param options.callback Callback of button click event.
         */
        addButton(label, id, options = {}) {
          id = id || `${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`;
          this.elementProps.children[this.elementProps.children.length - 1].children.push({
            tag: "vbox",
            styles: {
              margin: "10px"
            },
            children: [
              {
                tag: "button",
                namespace: "html",
                id,
                attributes: {
                  type: "button",
                  "data-l10n-id": label
                },
                properties: {
                  innerHTML: label
                },
                listeners: [
                  {
                    type: "click",
                    listener: (e) => {
                      this.dialogData._lastButtonId = id;
                      if (options.callback) {
                        options.callback(e);
                      }
                      if (!options.noClose) {
                        this.window.close();
                      }
                    }
                  }
                ]
              }
            ]
          });
          return this;
        }
        /**
         * Dialog data.
         * @remarks
         * This object is passed to the dialog window.
         *
         * The control button id is in `dialogData._lastButtonId`;
         *
         * The data-binding values are in `dialogData`.
         * ```ts
         * interface DialogData {
         *   [key: string | number | symbol]: any;
         *   loadLock?: _ZoteroTypes.PromiseObject; // resolve after window load (auto-generated)
         *   loadCallback?: Function; // called after window load
         *   unloadLock?: _ZoteroTypes.PromiseObject; // resolve after window unload (auto-generated)
         *   unloadCallback?: Function; // called after window unload
         *   beforeUnloadCallback?: Function; // called before window unload when elements are accessable.
         * }
         * ```
         * @param dialogData
         */
        setDialogData(dialogData) {
          this.dialogData = dialogData;
          return this;
        }
        /**
         * Open the dialog
         * @param title Window title
         * @param windowFeatures.width Ignored if fitContent is `true`.
         * @param windowFeatures.height Ignored if fitContent is `true`.
         * @param windowFeatures.left
         * @param windowFeatures.top
         * @param windowFeatures.centerscreen Open window at the center of screen.
         * @param windowFeatures.resizable If window is resizable.
         * @param windowFeatures.fitContent Resize the window to content size after elements are loaded.
         * @param windowFeatures.noDialogMode Dialog mode window only has a close button. Set `true` to make maximize and minimize button visible.
         * @param windowFeatures.alwaysRaised Is the window always at the top.
         */
        open(title, windowFeatures = {
          centerscreen: true,
          resizable: true,
          fitContent: true
        }) {
          this.window = openDialog(this, `${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`, title, this.elementProps, this.dialogData, windowFeatures);
          return this;
        }
      };
      exports.DialogHelper = DialogHelper;
      function openDialog(dialogHelper, targetId, title, elementProps, dialogData, windowFeatures = {
        centerscreen: true,
        resizable: true,
        fitContent: true
      }) {
        var _a, _b, _c;
        const Zotero2 = dialogHelper.getGlobal("Zotero");
        dialogData = dialogData || {};
        if (!dialogData.loadLock) {
          dialogData.loadLock = Zotero2.Promise.defer();
        }
        if (!dialogData.unloadLock) {
          dialogData.unloadLock = Zotero2.Promise.defer();
        }
        let featureString = `resizable=${windowFeatures.resizable ? "yes" : "no"},`;
        if (windowFeatures.width || windowFeatures.height) {
          featureString += `width=${windowFeatures.width || 100},height=${windowFeatures.height || 100},`;
        }
        if (windowFeatures.left) {
          featureString += `left=${windowFeatures.left},`;
        }
        if (windowFeatures.top) {
          featureString += `top=${windowFeatures.top},`;
        }
        if (windowFeatures.centerscreen) {
          featureString += "centerscreen,";
        }
        if (windowFeatures.noDialogMode) {
          featureString += "dialog=no,";
        }
        if (windowFeatures.alwaysRaised) {
          featureString += "alwaysRaised=yes,";
        }
        const win = dialogHelper.getGlobal("openDialog")("about:blank", targetId || "_blank", featureString, dialogData);
        (_a = dialogData.loadLock) === null || _a === void 0 ? void 0 : _a.promise.then(() => {
          win.document.head.appendChild(dialogHelper.createElement(win.document, "title", {
            properties: { innerText: title },
            attributes: { "data-l10n-id": title }
          }));
          let l10nFiles = dialogData.l10nFiles || [];
          if (typeof l10nFiles === "string") {
            l10nFiles = [l10nFiles];
          }
          l10nFiles.forEach((file) => {
            win.document.head.appendChild(dialogHelper.createElement(win.document, "link", {
              properties: {
                rel: "localization",
                href: file
              }
            }));
          });
          dialogHelper.appendElement({
            tag: "fragment",
            children: [
              {
                tag: "style",
                properties: {
                  innerHTML: style
                }
              },
              {
                tag: "link",
                properties: {
                  rel: "stylesheet",
                  href: "chrome://zotero-platform/content/zotero.css"
                }
              }
            ]
          }, win.document.head);
          replaceElement(elementProps, dialogHelper);
          win.document.body.appendChild(dialogHelper.createElement(win.document, "fragment", {
            children: [elementProps]
          }));
          Array.from(win.document.querySelectorAll("*[data-bind]")).forEach((elem) => {
            const bindKey = elem.getAttribute("data-bind");
            const bindAttr = elem.getAttribute("data-attr");
            const bindProp = elem.getAttribute("data-prop");
            if (bindKey && dialogData && dialogData[bindKey]) {
              if (bindProp) {
                elem[bindProp] = dialogData[bindKey];
              } else {
                elem.setAttribute(bindAttr || "value", dialogData[bindKey]);
              }
            }
          });
          if (windowFeatures.fitContent) {
            setTimeout(() => {
              win.sizeToContent();
            }, 300);
          }
          win.focus();
        }).then(() => {
          (dialogData === null || dialogData === void 0 ? void 0 : dialogData.loadCallback) && dialogData.loadCallback();
        });
        dialogData.unloadLock.promise.then(() => {
          (dialogData === null || dialogData === void 0 ? void 0 : dialogData.unloadCallback) && dialogData.unloadCallback();
        });
        win.addEventListener("DOMContentLoaded", function onWindowLoad(ev) {
          var _a2, _b2;
          (_b2 = (_a2 = win.arguments[0]) === null || _a2 === void 0 ? void 0 : _a2.loadLock) === null || _b2 === void 0 ? void 0 : _b2.resolve();
          win.removeEventListener("DOMContentLoaded", onWindowLoad, false);
        }, false);
        win.addEventListener("beforeunload", function onWindowBeforeUnload(ev) {
          Array.from(win.document.querySelectorAll("*[data-bind]")).forEach((elem) => {
            const dialogData2 = this.window.arguments[0];
            const bindKey = elem.getAttribute("data-bind");
            const bindAttr = elem.getAttribute("data-attr");
            const bindProp = elem.getAttribute("data-prop");
            if (bindKey && dialogData2) {
              if (bindProp) {
                dialogData2[bindKey] = elem[bindProp];
              } else {
                dialogData2[bindKey] = elem.getAttribute(bindAttr || "value");
              }
            }
          });
          this.window.removeEventListener("beforeunload", onWindowBeforeUnload, false);
          (dialogData === null || dialogData === void 0 ? void 0 : dialogData.beforeUnloadCallback) && dialogData.beforeUnloadCallback();
        });
        win.addEventListener("unload", function onWindowUnload(ev) {
          var _a2, _b2, _c2;
          if ((_a2 = this.window.arguments[0]) === null || _a2 === void 0 ? void 0 : _a2.loadLock.promise.isPending()) {
            return;
          }
          (_c2 = (_b2 = this.window.arguments[0]) === null || _b2 === void 0 ? void 0 : _b2.unloadLock) === null || _c2 === void 0 ? void 0 : _c2.resolve();
          this.window.removeEventListener("unload", onWindowUnload, false);
        });
        if (win.document.readyState === "complete") {
          (_c = (_b = win.arguments[0]) === null || _b === void 0 ? void 0 : _b.loadLock) === null || _c === void 0 ? void 0 : _c.resolve();
        }
        return win;
      }
      function replaceElement(elementProps, uiTool) {
        var _a, _b, _c, _d, _e, _f, _g;
        let checkChildren = true;
        if (elementProps.tag === "select" && uiTool.isZotero7()) {
          checkChildren = false;
          const customSelectProps = {
            tag: "div",
            classList: ["dropdown"],
            listeners: [
              {
                type: "mouseleave",
                listener: (ev) => {
                  const select = ev.target.querySelector("select");
                  select === null || select === void 0 ? void 0 : select.blur();
                }
              }
            ],
            children: [
              Object.assign({}, elementProps, {
                tag: "select",
                listeners: [
                  {
                    type: "focus",
                    listener: (ev) => {
                      var _a2;
                      const select = ev.target;
                      const dropdown = (_a2 = select.parentElement) === null || _a2 === void 0 ? void 0 : _a2.querySelector(".dropdown-content");
                      dropdown && (dropdown.style.display = "block");
                      select.setAttribute("focus", "true");
                    }
                  },
                  {
                    type: "blur",
                    listener: (ev) => {
                      var _a2;
                      const select = ev.target;
                      const dropdown = (_a2 = select.parentElement) === null || _a2 === void 0 ? void 0 : _a2.querySelector(".dropdown-content");
                      dropdown && (dropdown.style.display = "none");
                      select.removeAttribute("focus");
                    }
                  }
                ]
              }),
              {
                tag: "div",
                classList: ["dropdown-content"],
                children: (_a = elementProps.children) === null || _a === void 0 ? void 0 : _a.map((option) => {
                  var _a2, _b2, _c2;
                  return {
                    tag: "p",
                    attributes: {
                      value: (_a2 = option.properties) === null || _a2 === void 0 ? void 0 : _a2.value
                    },
                    properties: {
                      innerHTML: ((_b2 = option.properties) === null || _b2 === void 0 ? void 0 : _b2.innerHTML) || ((_c2 = option.properties) === null || _c2 === void 0 ? void 0 : _c2.innerText)
                    },
                    classList: ["dropdown-item"],
                    listeners: [
                      {
                        type: "click",
                        listener: (ev) => {
                          var _a3;
                          const select = (_a3 = ev.target.parentElement) === null || _a3 === void 0 ? void 0 : _a3.previousElementSibling;
                          select && (select.value = ev.target.getAttribute("value") || "");
                          select === null || select === void 0 ? void 0 : select.blur();
                        }
                      }
                    ]
                  };
                })
              }
            ]
          };
          for (const key in elementProps) {
            delete elementProps[key];
          }
          Object.assign(elementProps, customSelectProps);
        } else if (elementProps.tag === "a") {
          const href = ((_b = elementProps === null || elementProps === void 0 ? void 0 : elementProps.properties) === null || _b === void 0 ? void 0 : _b.href) || "";
          (_c = elementProps.properties) !== null && _c !== void 0 ? _c : elementProps.properties = {};
          elementProps.properties.href = "javascript:void(0);";
          (_d = elementProps.attributes) !== null && _d !== void 0 ? _d : elementProps.attributes = {};
          elementProps.attributes["zotero-href"] = href;
          (_e = elementProps.listeners) !== null && _e !== void 0 ? _e : elementProps.listeners = [];
          elementProps.listeners.push({
            type: "click",
            listener: (ev) => {
              var _a2;
              const href2 = (_a2 = ev.target) === null || _a2 === void 0 ? void 0 : _a2.getAttribute("zotero-href");
              href2 && uiTool.getGlobal("Zotero").launchURL(href2);
            }
          });
          (_f = elementProps.classList) !== null && _f !== void 0 ? _f : elementProps.classList = [];
          elementProps.classList.push("zotero-text-link");
        }
        if (checkChildren) {
          (_g = elementProps.children) === null || _g === void 0 ? void 0 : _g.forEach((child) => replaceElement(child, uiTool));
        }
      }
      var style = `
.zotero-text-link {
  -moz-user-focus: normal;
  color: -moz-nativehyperlinktext;
  text-decoration: underline;
  border: 1px solid transparent;
  cursor: pointer;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: var(--material-toolbar);
  min-width: 160px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 5px 0 5px 0;
  z-index: 999;
}
.dropdown-item {
  margin: 0px;
  padding: 5px 10px 5px 10px;
}
.dropdown-item:hover {
  background-color: var(--fill-quinary);
}
`;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/readerInstance.js
  var require_readerInstance = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/readerInstance.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReaderInstanceManager = void 0;
      var basic_1 = require_basic();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
      var ReaderInstanceManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.cachedHookIds = [];
          this.initializeGlobal();
        }
        /**
         * Register a reader instance hook
         * @deprecated
         * @remarks
         * initialized: called when reader instance is ready
         * @param type hook type
         * @param id hook id
         * @param hook
         */
        register(type, id, hook) {
          const Zotero2 = this.getGlobal("Zotero");
          switch (type) {
            case "initialized":
              {
                this.globalCache.initializedHooks[id] = hook;
                Zotero2.Reader._readers.forEach(hook);
              }
              break;
            default:
              break;
          }
          this.cachedHookIds.push(id);
        }
        /**
         * Unregister hook by id
         * @param id
         */
        unregister(id) {
          delete this.globalCache.initializedHooks[id];
        }
        /**
         * Unregister all hooks
         */
        unregisterAll() {
          this.cachedHookIds.forEach((id) => this.unregister(id));
        }
        initializeGlobal() {
          this.globalCache = toolkitGlobal_1.default.getInstance().readerInstance;
          if (!this.globalCache._ready) {
            this.globalCache._ready = true;
            const Zotero2 = this.getGlobal("Zotero");
            const _this = this;
            Zotero2.Reader._readers = new (this.getGlobal("Proxy"))(Zotero2.Reader._readers, {
              set(target, p, newValue, receiver) {
                target[p] = newValue;
                if (!isNaN(Number(p))) {
                  Object.values(_this.globalCache.initializedHooks).forEach((hook) => {
                    try {
                      hook(newValue);
                    } catch (e) {
                      _this.log(e);
                    }
                  });
                }
                return true;
              }
            });
          }
        }
      };
      exports.ReaderInstanceManager = ReaderInstanceManager;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/itemBox.js
  var require_itemBox = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/itemBox.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ItemBoxManager = void 0;
      var basic_1 = require_basic();
      var fieldHook_1 = require_fieldHook();
      var patch_1 = require_patch2();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
      var ItemBoxManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.initializationLock = this.getGlobal("Zotero").Promise.defer();
          this.localCache = [];
          this.fieldHooks = new fieldHook_1.FieldHookManager();
          this.patcherManager = new patch_1.PatcherManager();
          this.initializeGlobal();
        }
        /**
         * Register a custom row
         * @param field Field name. Used in `getField` and `setField`.
         * @param displayName The row header display text.
         * @param getFieldHook Called when loading row content.
         * If you registered the getField hook somewhere else (in ItemBox or FieldHooks), leave it undefined.
         * @param options
         * @param options.editable If the row is editable.
         * To edit a row, either the `options.setFieldHook` or a custom hook for `setField` created by FieldHookManager is required.
         * @param options.setFieldHook The `setField` hook.
         * @param options.index Target index. By default it's placed at the end of rows.
         * @param options.multiline If the row content is multiline.
         * @param options.collapsible If the row content is collapsible (like abstract field).
         */
        async register(field, displayName, getFieldHook, options = {}) {
          this.fieldHooks.register("isFieldOfBase", field, () => false);
          if (getFieldHook) {
            this.fieldHooks.register("getField", field, getFieldHook);
          }
          if (options.editable && options.setFieldHook) {
            this.fieldHooks.register("setField", field, options.setFieldHook);
          }
          this.globalCache.fieldOptions[field] = {
            field,
            displayName,
            editable: options.editable || false,
            index: options.index || -1,
            multiline: options.multiline || false,
            collapsible: options.collapsible || false
          };
          this.localCache.push(field);
          await this.initializationLock.promise;
          this.refresh();
        }
        /**
         * Unregister a row of specific field.
         * @param field
         * @param options Skip unregister of certain hooks.
         * This is useful when the hook is not initialized by this instance
         * @param options.skipRefresh Skip refresh after unregister.
         */
        unregister(field, options = {}) {
          delete this.globalCache.fieldOptions[field];
          if (!options.skipIsFieldOfBase) {
            this.fieldHooks.unregister("isFieldOfBase", field);
          }
          if (!options.skipGetField) {
            this.fieldHooks.unregister("getField", field);
          }
          if (!options.skipSetField) {
            this.fieldHooks.unregister("setField", field);
          }
          const idx = this.localCache.indexOf(field);
          if (idx > -1) {
            this.localCache.splice(idx, 1);
          }
          if (!options.skipRefresh) {
            this.refresh();
          }
        }
        unregisterAll() {
          [...this.localCache].forEach((field) => this.unregister(field, {
            skipGetField: true,
            skipSetField: true,
            skipIsFieldOfBase: true,
            skipRefresh: true
          }));
          this.fieldHooks.unregisterAll();
          this.refresh();
        }
        /**
         * Refresh all item boxes.
         */
        refresh() {
          try {
            Array.from(this.getGlobal("document").querySelectorAll(this.isZotero7() ? "item-box" : "zoteroitembox")).forEach((elem) => elem.refresh());
          } catch (e) {
            this.log(e);
          }
        }
        async initializeGlobal() {
          const Zotero2 = this.getGlobal("Zotero");
          await Zotero2.uiReadyPromise;
          const window2 = this.getGlobal("window");
          this.globalCache = toolkitGlobal_1.default.getInstance().itemBox;
          const globalCache = this.globalCache;
          const inZotero7 = this.isZotero7();
          if (!globalCache._ready) {
            globalCache._ready = true;
            let itemBoxInstance;
            if (inZotero7) {
              itemBoxInstance = new (this.getGlobal("customElements").get("item-box"))();
            } else {
              itemBoxInstance = window2.document.querySelector("#zotero-editpane-item-box");
              const wait = 5e3;
              let t = 0;
              while (!itemBoxInstance && t < wait) {
                itemBoxInstance = window2.document.querySelector("#zotero-editpane-item-box");
                await Zotero2.Promise.delay(10);
                t += 10;
              }
              if (!itemBoxInstance) {
                globalCache._ready = false;
                this.log("ItemBox initialization failed");
                return;
              }
            }
            this.patcherManager.register(itemBoxInstance.__proto__, "refresh", (original) => function() {
              const originalThis = this;
              original.apply(originalThis, arguments);
              for (const extraField of Object.values(globalCache.fieldOptions)) {
                const fieldHeader = document.createElement(inZotero7 ? "th" : "label");
                fieldHeader.setAttribute("fieldname", extraField.field);
                const prefKey = `extensions.zotero.pluginToolkit.fieldCollapsed.${extraField.field}`;
                const collapsed = extraField.multiline && extraField.collapsible && Zotero2.Prefs.get(prefKey, true);
                let headerContent = extraField.displayName;
                if (collapsed) {
                  headerContent = `(...)${headerContent}`;
                }
                if (inZotero7) {
                  let label = document.createElement("label");
                  label.className = "key";
                  label.textContent = headerContent;
                  fieldHeader.appendChild(label);
                } else {
                  fieldHeader.setAttribute("value", headerContent);
                }
                const _clickable = originalThis.clickable;
                originalThis.clickable = extraField.editable;
                const fieldValue = originalThis.createValueElement(originalThis.item.getField(extraField.field), extraField.field, 1099);
                originalThis.clickable = _clickable;
                if (extraField.multiline && !Zotero2.Prefs.get(prefKey, true)) {
                  fieldValue.classList.add("multiline");
                } else if (!inZotero7) {
                  fieldValue.setAttribute("crop", "end");
                  fieldValue.setAttribute("value", fieldValue.innerHTML);
                  fieldValue.innerHTML = "";
                }
                if (extraField.collapsible) {
                  fieldHeader.addEventListener("click", function(ev) {
                    Zotero2.Prefs.set(prefKey, !(Zotero2.Prefs.get(prefKey, true) || false), true);
                    originalThis.refresh();
                  });
                }
                fieldHeader.addEventListener("click", inZotero7 ? function(ev) {
                  var _a;
                  const inputField = (_a = ev.currentTarget.nextElementSibling) === null || _a === void 0 ? void 0 : _a.querySelector("input, textarea");
                  if (inputField) {
                    inputField.blur();
                  }
                } : function(ev) {
                  var _a;
                  const inputField = (_a = ev.currentTarget.nextElementSibling) === null || _a === void 0 ? void 0 : _a.inputField;
                  if (inputField) {
                    inputField.blur();
                  }
                });
                const table = inZotero7 ? originalThis._infoTable : originalThis._dynamicFields;
                let fieldIndex = extraField.index;
                if (fieldIndex === 0) {
                  fieldIndex = 1;
                }
                if (fieldIndex && fieldIndex >= 0 && fieldIndex < table.children.length) {
                  originalThis._beforeRow = table.children[fieldIndex];
                  originalThis.addDynamicRow(fieldHeader, fieldValue, true);
                } else {
                  originalThis.addDynamicRow(fieldHeader, fieldValue);
                }
              }
            });
          }
          this.initializationLock.resolve();
        }
      };
      exports.ItemBoxManager = ItemBoxManager;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/helpers/largePref.js
  var require_largePref = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/helpers/largePref.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LargePrefHelper = void 0;
      var basic_1 = require_basic();
      var LargePrefHelper = class extends basic_1.BasicTool {
        /**
         *
         * @param keyPref The preference name for storing the keys of the data.
         * @param valuePrefPrefix The preference name prefix for storing the values of the data.
         * @param hooks Hooks for parsing the values of the data.
         * - `afterGetValue`: A function that takes the value of the data as input and returns the parsed value.
         * - `beforeSetValue`: A function that takes the key and value of the data as input and returns the parsed key and value.
         * If `hooks` is `"default"`, no parsing will be done.
         * If `hooks` is `"parser"`, the values will be parsed as JSON.
         * If `hooks` is an object, the values will be parsed by the hooks.
         */
        constructor(keyPref, valuePrefPrefix, hooks = "default") {
          super();
          this.keyPref = keyPref;
          this.valuePrefPrefix = valuePrefPrefix;
          if (hooks === "default") {
            this.hooks = defaultHooks;
          } else if (hooks === "parser") {
            this.hooks = parserHooks;
          } else {
            this.hooks = Object.assign(Object.assign({}, defaultHooks), hooks);
          }
          this.innerObj = {};
        }
        /**
         * Get the object that stores the data.
         * @returns The object that stores the data.
         */
        asObject() {
          return this.constructTempObj();
        }
        /**
         * Get the Map that stores the data.
         * @returns The Map that stores the data.
         */
        asMapLike() {
          const mapLike = {
            get: (key) => this.getValue(key),
            set: (key, value) => {
              this.setValue(key, value);
              return mapLike;
            },
            has: (key) => this.hasKey(key),
            delete: (key) => this.deleteKey(key),
            clear: () => {
              for (const key of this.getKeys()) {
                this.deleteKey(key);
              }
            },
            forEach: (callback) => {
              return this.constructTempMap().forEach(callback);
            },
            get size() {
              return this._this.getKeys().length;
            },
            entries: () => {
              return this.constructTempMap().values();
            },
            keys: () => {
              const keys = this.getKeys();
              return keys[Symbol.iterator]();
            },
            values: () => {
              return this.constructTempMap().values();
            },
            [Symbol.iterator]: () => {
              return this.constructTempMap()[Symbol.iterator]();
            },
            [Symbol.toStringTag]: "MapLike",
            _this: this
          };
          return mapLike;
        }
        /**
         * Get the keys of the data.
         * @returns The keys of the data.
         */
        getKeys() {
          const rawKeys = Zotero.Prefs.get(this.keyPref, true);
          const keys = rawKeys ? JSON.parse(rawKeys) : [];
          for (const key of keys) {
            const value = "placeholder";
            this.innerObj[key] = value;
          }
          return keys;
        }
        /**
         * Set the keys of the data.
         * @param keys The keys of the data.
         */
        setKeys(keys) {
          keys = [...new Set(keys.filter((key) => key))];
          Zotero.Prefs.set(this.keyPref, JSON.stringify(keys), true);
          for (const key of keys) {
            const value = "placeholder";
            this.innerObj[key] = value;
          }
        }
        /**
         * Get the value of a key.
         * @param key The key of the data.
         * @returns The value of the key.
         */
        getValue(key) {
          const value = Zotero.Prefs.get(`${this.valuePrefPrefix}${key}`, true);
          if (typeof value === "undefined") {
            return;
          }
          let { value: newValue } = this.hooks.afterGetValue({ value });
          this.innerObj[key] = newValue;
          return newValue;
        }
        /**
         * Set the value of a key.
         * @param key The key of the data.
         * @param value The value of the key.
         */
        setValue(key, value) {
          let { key: newKey, value: newValue } = this.hooks.beforeSetValue({
            key,
            value
          });
          this.setKey(newKey);
          Zotero.Prefs.set(`${this.valuePrefPrefix}${newKey}`, newValue, true);
          this.innerObj[newKey] = newValue;
        }
        /**
         * Check if a key exists.
         * @param key The key of the data.
         * @returns Whether the key exists.
         */
        hasKey(key) {
          return this.getKeys().includes(key);
        }
        /**
         * Add a key.
         * @param key The key of the data.
         */
        setKey(key) {
          const keys = this.getKeys();
          if (!keys.includes(key)) {
            keys.push(key);
            this.setKeys(keys);
          }
        }
        /**
         * Delete a key.
         * @param key The key of the data.
         */
        deleteKey(key) {
          const keys = this.getKeys();
          const index = keys.indexOf(key);
          if (index > -1) {
            keys.splice(index, 1);
            delete this.innerObj[key];
            this.setKeys(keys);
          }
          Zotero.Prefs.clear(`${this.valuePrefPrefix}${key}`, true);
          return true;
        }
        constructTempObj() {
          return new Proxy(this.innerObj, {
            get: (target, prop, receiver) => {
              this.getKeys();
              if (typeof prop === "string" && prop in target) {
                this.getValue(prop);
              }
              return Reflect.get(target, prop, receiver);
            },
            set: (target, p, newValue, receiver) => {
              if (typeof p === "string") {
                if (newValue === void 0) {
                  this.deleteKey(p);
                  return true;
                }
                this.setValue(p, newValue);
                return true;
              }
              return Reflect.set(target, p, newValue, receiver);
            },
            has: (target, p) => {
              this.getKeys();
              return Reflect.has(target, p);
            },
            deleteProperty: (target, p) => {
              if (typeof p === "string") {
                this.deleteKey(p);
                return true;
              }
              return Reflect.deleteProperty(target, p);
            }
          });
        }
        constructTempMap() {
          const map = /* @__PURE__ */ new Map();
          for (const key of this.getKeys()) {
            map.set(key, this.getValue(key));
          }
          return map;
        }
      };
      exports.LargePrefHelper = LargePrefHelper;
      var defaultHooks = {
        afterGetValue: ({ value }) => ({ value }),
        beforeSetValue: ({ key, value }) => ({ key, value })
      };
      var parserHooks = {
        afterGetValue: ({ value }) => {
          try {
            value = JSON.parse(value);
          } catch (e) {
            return { value };
          }
          return { value };
        },
        beforeSetValue: ({ key, value }) => {
          value = JSON.stringify(value);
          return { key, value };
        }
      };
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/keyboard.js
  var require_keyboard = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/keyboard.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.KeyModifier = exports.KeyboardManager = void 0;
      var basic_1 = require_basic();
      var wait_1 = require_wait();
      var KeyboardManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this._keyboardCallbacks = /* @__PURE__ */ new Set();
          this.initKeyboardListener = this._initKeyboardListener.bind(this);
          this.unInitKeyboardListener = this._unInitKeyboardListener.bind(this);
          this.triggerKeydown = (e) => {
            if (!this._cachedKey) {
              this._cachedKey = new KeyModifier(e);
            } else {
              this._cachedKey.merge(new KeyModifier(e), { allowOverwrite: false });
            }
            this.dispatchCallback(e, {
              type: "keydown"
            });
          };
          this.triggerKeyup = async (e) => {
            if (!this._cachedKey) {
              return;
            }
            const currentShortcut = new KeyModifier(this._cachedKey);
            this._cachedKey = void 0;
            this.dispatchCallback(e, {
              keyboard: currentShortcut,
              type: "keyup"
            });
          };
          this.id = Zotero.Utilities.randomString();
          this._ensureAutoUnregisterAll();
          this.addListenerCallback("onMainWindowLoad", this.initKeyboardListener);
          this.addListenerCallback("onMainWindowUnload", this.unInitKeyboardListener);
          this.initReaderKeyboardListener();
          for (const win of Zotero.getMainWindows()) {
            this.initKeyboardListener(win);
          }
        }
        /**
         * Register a keyboard event listener.
         * @param callback The callback function.
         */
        register(callback) {
          this._keyboardCallbacks.add(callback);
        }
        /**
         * Unregister a keyboard event listener.
         * @param callback The callback function.
         */
        unregister(callback) {
          this._keyboardCallbacks.delete(callback);
        }
        /**
         * Unregister all keyboard event listeners.
         */
        unregisterAll() {
          this._keyboardCallbacks.clear();
          this.removeListenerCallback("onMainWindowLoad", this.initKeyboardListener);
          this.removeListenerCallback("onMainWindowUnload", this.unInitKeyboardListener);
          for (const win of Zotero.getMainWindows()) {
            this.unInitKeyboardListener(win);
          }
        }
        initReaderKeyboardListener() {
          Zotero.Reader.registerEventListener("renderToolbar", (event) => this.addReaderKeyboardCallback(event), this._basicOptions.api.pluginID);
          Zotero.Reader._readers.forEach((reader) => this.addReaderKeyboardCallback({ reader }));
        }
        addReaderKeyboardCallback(event) {
          const reader = event.reader;
          let initializedKey = `_ztoolkitKeyboard${this.id}Initialized`;
          if (reader._iframeWindow[initializedKey]) {
            return;
          }
          this._initKeyboardListener(reader._iframeWindow);
          (0, wait_1.waitUntil)(() => {
            var _a, _b;
            return !Components.utils.isDeadWrapper(reader._internalReader) && ((_b = (_a = reader._internalReader) === null || _a === void 0 ? void 0 : _a._primaryView) === null || _b === void 0 ? void 0 : _b._iframeWindow);
          }, () => {
            var _a;
            return this._initKeyboardListener((_a = reader._internalReader._primaryView) === null || _a === void 0 ? void 0 : _a._iframeWindow);
          });
          reader._iframeWindow[initializedKey] = true;
        }
        _initKeyboardListener(win) {
          if (!win) {
            return;
          }
          win.addEventListener("keydown", this.triggerKeydown);
          win.addEventListener("keyup", this.triggerKeyup);
        }
        _unInitKeyboardListener(win) {
          if (!win) {
            return;
          }
          win.removeEventListener("keydown", this.triggerKeydown);
          win.removeEventListener("keyup", this.triggerKeyup);
        }
        dispatchCallback(...args) {
          this._keyboardCallbacks.forEach((cbk) => cbk(...args));
        }
      };
      exports.KeyboardManager = KeyboardManager;
      var KeyModifier = class _KeyModifier {
        constructor(raw, options) {
          this.accel = false;
          this.shift = false;
          this.control = false;
          this.meta = false;
          this.alt = false;
          this.key = "";
          this.useAccel = false;
          this.useAccel = (options === null || options === void 0 ? void 0 : options.useAccel) || false;
          if (typeof raw === "undefined") {
            return;
          } else if (typeof raw === "string") {
            raw = raw || "";
            raw = this.unLocalized(raw);
            this.accel = raw.includes("accel");
            this.shift = raw.includes("shift");
            this.control = raw.includes("control");
            this.meta = raw.includes("meta");
            this.alt = raw.includes("alt");
            this.key = raw.replace(/(accel|shift|control|meta|alt| |,|-)/g, "").toLocaleLowerCase();
          } else if (raw instanceof _KeyModifier) {
            this.merge(raw, { allowOverwrite: true });
          } else {
            if (options === null || options === void 0 ? void 0 : options.useAccel) {
              if (Zotero.isMac) {
                this.accel = raw.metaKey;
              } else {
                this.accel = raw.ctrlKey;
              }
            }
            this.shift = raw.shiftKey;
            this.control = raw.ctrlKey;
            this.meta = raw.metaKey;
            this.alt = raw.altKey;
            if (!["Shift", "Meta", "Ctrl", "Alt", "Control"].includes(raw.key)) {
              this.key = raw.key;
            }
          }
        }
        /**
         * Merge another KeyModifier into this one.
         * @param newMod the new KeyModifier
         * @param options
         * @returns
         */
        merge(newMod, options) {
          const allowOverwrite = (options === null || options === void 0 ? void 0 : options.allowOverwrite) || false;
          this.mergeAttribute("accel", newMod.accel, allowOverwrite);
          this.mergeAttribute("shift", newMod.shift, allowOverwrite);
          this.mergeAttribute("control", newMod.control, allowOverwrite);
          this.mergeAttribute("meta", newMod.meta, allowOverwrite);
          this.mergeAttribute("alt", newMod.alt, allowOverwrite);
          this.mergeAttribute("key", newMod.key, allowOverwrite);
          return this;
        }
        /**
         * Check if the current KeyModifier equals to another KeyModifier.
         * @param newMod the new KeyModifier
         * @returns true if equals
         */
        equals(newMod) {
          if (typeof newMod === "string") {
            newMod = new _KeyModifier(newMod);
          }
          if (this.shift !== newMod.shift || this.alt !== newMod.alt || this.key.toLowerCase() !== newMod.key.toLowerCase()) {
            return false;
          }
          if (this.accel || newMod.accel) {
            if (Zotero.isMac) {
              if ((this.accel || this.meta) !== (newMod.accel || newMod.meta) || this.control !== newMod.control) {
                return false;
              }
            } else {
              if ((this.accel || this.control) !== (newMod.accel || newMod.control) || this.meta !== newMod.meta) {
                return false;
              }
            }
          } else {
            if (this.control !== newMod.control || this.meta !== newMod.meta) {
              return false;
            }
          }
          return true;
        }
        /**
         * Get the raw string representation of the KeyModifier.
         */
        getRaw() {
          const enabled = [];
          this.accel && enabled.push("accel");
          this.shift && enabled.push("shift");
          this.control && enabled.push("control");
          this.meta && enabled.push("meta");
          this.alt && enabled.push("alt");
          this.key && enabled.push(this.key);
          return enabled.join(",");
        }
        /**
         * Get the localized string representation of the KeyModifier.
         */
        getLocalized() {
          const raw = this.getRaw();
          if (Zotero.isMac) {
            return raw.replaceAll("control", "\u2303").replaceAll("alt", "\u2325").replaceAll("shift", "\u21E7").replaceAll("meta", "\u2318");
          } else {
            return raw.replaceAll("control", "Ctrl").replaceAll("alt", "Alt").replaceAll("shift", "Shift").replaceAll("meta", "Win");
          }
        }
        /**
         * Get the un-localized string representation of the KeyModifier.
         */
        unLocalized(raw) {
          if (Zotero.isMac) {
            return raw.replaceAll("\u2303", "control").replaceAll("\u2325", "alt").replaceAll("\u21E7", "shift").replaceAll("\u2318", "meta");
          } else {
            return raw.replaceAll("Ctrl", "control").replaceAll("Alt", "alt").replaceAll("Shift", "shift").replaceAll("Win", "meta");
          }
        }
        mergeAttribute(attribute, value, allowOverwrite) {
          if (allowOverwrite || !this[attribute]) {
            this[attribute] = value;
          }
        }
      };
      exports.KeyModifier = KeyModifier;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/helpers/guide.js
  var require_guide = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/helpers/guide.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GuideHelper = void 0;
      var basic_1 = require_basic();
      var GuideHelper = class extends basic_1.BasicTool {
        constructor() {
          super();
          this._steps = [];
        }
        addStep(step) {
          this._steps.push(step);
          return this;
        }
        addSteps(steps) {
          this._steps.push(...steps);
          return this;
        }
        async show(doc) {
          if (!(doc === null || doc === void 0 ? void 0 : doc.ownerGlobal)) {
            throw new Error("Document is required.");
          }
          const guide = new Guide(doc.ownerGlobal);
          await guide.show(this._steps);
          const promise = new Promise((resolve) => {
            guide._panel.addEventListener("guide-finished", () => resolve(guide));
          });
          await promise;
          return guide;
        }
        async highlight(doc, step) {
          if (!(doc === null || doc === void 0 ? void 0 : doc.ownerGlobal)) {
            throw new Error("Document is required.");
          }
          const guide = new Guide(doc.ownerGlobal);
          await guide.show([step]);
          const promise = new Promise((resolve) => {
            guide._panel.addEventListener("guide-finished", () => resolve(guide));
          });
          await promise;
          return guide;
        }
      };
      exports.GuideHelper = GuideHelper;
      var Guide = class {
        get content() {
          return this._window.MozXULElement.parseXULToFragment(`
      <panel id="${this._id}" class="guide-panel" type="arrow" align="top" noautohide="true">
          <html:div class="guide-panel-content">
              <html:div class="guide-panel-header"></html:div>
              <html:div class="guide-panel-body"></html:div>
              <html:div class="guide-panel-footer">
                  <html:div class="guide-panel-progress"></html:div>
                  <html:div class="guide-panel-buttons">
                      <button id="prev-button" class="guide-panel-button" hidden="true"></button>
                      <button id="next-button" class="guide-panel-button" hidden="true"></button>
                      <button id="close-button" class="guide-panel-button" hidden="true"></button>
                  </html:div>
              </html:div>
          </html:div>
          <html:style>
              .guide-panel {
                  background-color: var(--material-menu);
                  color: var(--fill-primary);
              }
              .guide-panel-content {
                  display: flex;
                  flex-direction: column;
                  padding: 0;
              }
              .guide-panel-header {
                  font-size: 1.2em;
                  font-weight: bold;
                  margin-bottom: 10px;
              }
              .guide-panel-header:empty {
                display: none;
              }
              .guide-panel-body {
                  align-items: center;
                  display: flex;
                  flex-direction: column;
                  white-space: pre-wrap;
              }
              .guide-panel-body:empty {
                display: none;
              }
              .guide-panel-footer {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                  margin-top: 10px;
              }
              .guide-panel-progress {
                  font-size: 0.8em;
              }
              .guide-panel-buttons {
                  display: flex;
                  flex-direction: row;
                  flex-grow: 1;
                  justify-content: flex-end;
              }
          </html:style>
      </panel>
  `);
        }
        get currentStep() {
          if (!this._steps)
            return void 0;
          return this._steps[this._currentIndex];
        }
        get currentTarget() {
          const step = this.currentStep;
          if (!(step === null || step === void 0 ? void 0 : step.element))
            return void 0;
          let elem;
          if (typeof step.element === "function") {
            elem = step.element();
          } else if (typeof step.element === "string") {
            elem = document.querySelector(step.element);
          } else if (!step.element) {
            elem = document.documentElement;
          } else {
            elem = step.element;
          }
          return elem;
        }
        get hasNext() {
          return this._steps && this._currentIndex < this._steps.length - 1;
        }
        get hasPrevious() {
          return this._steps && this._currentIndex > 0;
        }
        get hookProps() {
          return {
            config: this.currentStep,
            state: {
              step: this._currentIndex,
              steps: this._steps,
              controller: this
            }
          };
        }
        get panel() {
          return this._panel;
        }
        constructor(win) {
          this._id = `guide-${Zotero.Utilities.randomString()}`;
          this._cachedMasks = [];
          this._centerPanel = () => {
            const win2 = this._window;
            this._panel.moveTo(win2.screenX + win2.innerWidth / 2 - this._panel.clientWidth / 2, win2.screenY + win2.innerHeight / 2 - this._panel.clientHeight / 2);
          };
          this._window = win;
          this._noClose = false;
          this._closed = false;
          this._autoNext = true;
          this._currentIndex = 0;
          const doc = win.document;
          let content = this.content;
          if (content) {
            doc.documentElement.append(doc.importNode(content, true));
          }
          this._panel = doc.querySelector(`#${this._id}`);
          this._header = this._panel.querySelector(".guide-panel-header");
          this._body = this._panel.querySelector(".guide-panel-body");
          this._footer = this._panel.querySelector(".guide-panel-footer");
          this._progress = this._panel.querySelector(".guide-panel-progress");
          this._closeButton = this._panel.querySelector("#close-button");
          this._prevButton = this._panel.querySelector("#prev-button");
          this._nextButton = this._panel.querySelector("#next-button");
          this._closeButton.addEventListener("click", async () => {
            var _a;
            if ((_a = this.currentStep) === null || _a === void 0 ? void 0 : _a.onCloseClick) {
              await this.currentStep.onCloseClick(this.hookProps);
            }
            this.abort();
          });
          this._prevButton.addEventListener("click", async () => {
            var _a;
            if ((_a = this.currentStep) === null || _a === void 0 ? void 0 : _a.onPrevClick) {
              await this.currentStep.onPrevClick(this.hookProps);
            }
            this.movePrevious();
          });
          this._nextButton.addEventListener("click", async () => {
            var _a;
            if ((_a = this.currentStep) === null || _a === void 0 ? void 0 : _a.onNextClick) {
              await this.currentStep.onNextClick(this.hookProps);
            }
            this.moveNext();
          });
          this._panel.addEventListener("popupshown", this._handleShown.bind(this));
          this._panel.addEventListener("popuphidden", this._handleHidden.bind(this));
          this._window.addEventListener("resize", this._centerPanel);
        }
        async show(steps) {
          if (steps) {
            this._steps = steps;
            this._currentIndex = 0;
          }
          let index = this._currentIndex;
          this._noClose = false;
          this._closed = false;
          this._autoNext = true;
          const step = this.currentStep;
          if (!step)
            return;
          const elem = this.currentTarget;
          if (step.onBeforeRender) {
            await step.onBeforeRender(this.hookProps);
            if (index !== this._currentIndex) {
              await this.show();
              return;
            }
          }
          if (step.onMask) {
            step.onMask({ mask: (_e) => this._createMask(_e) });
          } else {
            this._createMask(elem);
          }
          let x, y = 0;
          let position = step.position || "after_start";
          if (position === "center") {
            position = "overlap";
            x = window.innerWidth / 2;
            y = window.innerHeight / 2;
          }
          this._panel.openPopup(elem, step.position || "after_start", x, y, false, false);
        }
        hide() {
          this._panel.hidePopup();
        }
        abort() {
          this._closed = true;
          this.hide();
          this._steps = void 0;
        }
        moveTo(stepIndex) {
          if (!this._steps) {
            this.hide();
            return;
          }
          if (stepIndex < 0)
            stepIndex = 0;
          if (!this._steps[stepIndex]) {
            this._currentIndex = this._steps.length;
            this.hide();
            return;
          }
          this._autoNext = false;
          this._noClose = true;
          this.hide();
          this._noClose = false;
          this._autoNext = true;
          this._currentIndex = stepIndex;
          this.show();
        }
        moveNext() {
          this.moveTo(this._currentIndex + 1);
        }
        movePrevious() {
          this.moveTo(this._currentIndex - 1);
        }
        _handleShown() {
          if (!this._steps)
            return;
          const step = this.currentStep;
          if (!step)
            return;
          this._header.innerHTML = step.title || "";
          this._body.innerHTML = step.description || "";
          this._panel.querySelectorAll(".guide-panel-button").forEach((elem) => {
            elem.hidden = true;
            elem.disabled = false;
          });
          let showButtons = step.showButtons;
          if (!showButtons) {
            showButtons = [];
            if (this.hasPrevious) {
              showButtons.push("prev");
            }
            if (this.hasNext) {
              showButtons.push("next");
            } else {
              showButtons.push("close");
            }
          }
          if (showButtons === null || showButtons === void 0 ? void 0 : showButtons.length) {
            showButtons.forEach((btn) => {
              this._panel.querySelector(`#${btn}-button`).hidden = false;
            });
          }
          if (step.disableButtons) {
            step.disableButtons.forEach((btn) => {
              this._panel.querySelector(`#${btn}-button`).disabled = true;
            });
          }
          if (step.showProgress) {
            this._progress.hidden = false;
            this._progress.textContent = step.progressText || `${this._currentIndex + 1}/${this._steps.length}`;
          } else {
            this._progress.hidden = true;
          }
          this._closeButton.label = step.closeBtnText || "Done";
          this._nextButton.label = step.nextBtnText || "Next";
          this._prevButton.label = step.prevBtnText || "Previous";
          if (step.onRender) {
            step.onRender(this.hookProps);
          }
          if (step.position === "center") {
            this._centerPanel();
            this._window.setTimeout(this._centerPanel, 10);
          }
        }
        async _handleHidden() {
          this._removeMask();
          this._header.innerHTML = "";
          this._body.innerHTML = "";
          this._progress.textContent = "";
          if (!this._steps)
            return;
          const step = this.currentStep;
          if (step && step.onExit) {
            await step.onExit(this.hookProps);
          }
          if (!this._noClose && (this._closed || !this.hasNext)) {
            this._panel.dispatchEvent(new this._window.CustomEvent("guide-finished"));
            this._panel.remove();
            this._window.removeEventListener("resize", this._centerPanel);
            return;
          }
          if (this._autoNext) {
            this.moveNext();
          }
        }
        _createMask(targetElement) {
          const doc = (targetElement === null || targetElement === void 0 ? void 0 : targetElement.ownerDocument) || this._window.document;
          const NS = "http://www.w3.org/2000/svg";
          const svg = doc.createElementNS(NS, "svg");
          svg.id = "guide-panel-mask";
          svg.style.position = "fixed";
          svg.style.top = "0";
          svg.style.left = "0";
          svg.style.width = "100%";
          svg.style.height = "100%";
          svg.style.zIndex = "9999";
          const mask = doc.createElementNS(NS, "mask");
          mask.id = "mask";
          const fullRect = doc.createElementNS(NS, "rect");
          fullRect.setAttribute("x", "0");
          fullRect.setAttribute("y", "0");
          fullRect.setAttribute("width", "100%");
          fullRect.setAttribute("height", "100%");
          fullRect.setAttribute("fill", "white");
          mask.appendChild(fullRect);
          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const targetRect = doc.createElementNS(NS, "rect");
            targetRect.setAttribute("x", rect.left.toString());
            targetRect.setAttribute("y", rect.top.toString());
            targetRect.setAttribute("width", rect.width.toString());
            targetRect.setAttribute("height", rect.height.toString());
            targetRect.setAttribute("fill", "black");
            mask.appendChild(targetRect);
          }
          const maskedRect = doc.createElementNS(NS, "rect");
          maskedRect.setAttribute("x", "0");
          maskedRect.setAttribute("y", "0");
          maskedRect.setAttribute("width", "100%");
          maskedRect.setAttribute("height", "100%");
          maskedRect.setAttribute("mask", "url(#mask)");
          maskedRect.setAttribute("opacity", "0.7");
          svg.appendChild(mask);
          svg.appendChild(maskedRect);
          this._cachedMasks.push(new WeakRef(svg));
          doc.documentElement.appendChild(svg);
        }
        _removeMask() {
          this._cachedMasks.forEach((ref) => {
            const mask = ref.deref();
            if (mask) {
              mask.remove();
            }
          });
          this._cachedMasks = [];
        }
      };
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/index.js
  var require_dist = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ZoteroToolkit = void 0;
      var basic_1 = require_basic();
      var ui_1 = require_ui();
      var reader_1 = require_reader();
      var extraField_1 = require_extraField();
      var itemTree_1 = require_itemTree();
      var prompt_1 = require_prompt();
      var libraryTabPanel_1 = require_libraryTabPanel();
      var readerTabPanel_1 = require_readerTabPanel();
      var menu_1 = require_menu();
      var preferencePane_1 = require_preferencePane();
      var shortcut_1 = require_shortcut();
      var clipboard_1 = require_clipboard();
      var filePicker_1 = require_filePicker();
      var progressWindow_1 = require_progressWindow();
      var virtualizedTable_1 = require_virtualizedTable();
      var dialog_1 = require_dialog();
      var readerInstance_1 = require_readerInstance();
      var fieldHook_1 = require_fieldHook();
      var itemBox_1 = require_itemBox();
      var largePref_1 = require_largePref();
      var keyboard_1 = require_keyboard();
      var patch_1 = require_patch();
      var guide_1 = require_guide();
      var ZoteroToolkit3 = class extends basic_1.BasicTool {
        constructor() {
          super();
          this.UI = new ui_1.UITool(this);
          this.Reader = new reader_1.ReaderTool(this);
          this.ExtraField = new extraField_1.ExtraFieldTool(this);
          this.FieldHooks = new fieldHook_1.FieldHookManager(this);
          this.ItemTree = new itemTree_1.ItemTreeManager(this);
          this.ItemBox = new itemBox_1.ItemBoxManager(this);
          this.Keyboard = new keyboard_1.KeyboardManager(this);
          this.Prompt = new prompt_1.PromptManager(this);
          this.LibraryTabPanel = new libraryTabPanel_1.LibraryTabPanelManager(this);
          this.ReaderTabPanel = new readerTabPanel_1.ReaderTabPanelManager(this);
          this.ReaderInstance = new readerInstance_1.ReaderInstanceManager(this);
          this.Menu = new menu_1.MenuManager(this);
          this.PreferencePane = new preferencePane_1.PreferencePaneManager(this);
          this.Shortcut = new shortcut_1.ShortcutManager(this);
          this.Clipboard = (0, basic_1.makeHelperTool)(clipboard_1.ClipboardHelper, this);
          this.FilePicker = (0, basic_1.makeHelperTool)(filePicker_1.FilePickerHelper, this);
          this.Patch = (0, basic_1.makeHelperTool)(patch_1.PatchHelper, this);
          this.ProgressWindow = (0, basic_1.makeHelperTool)(progressWindow_1.ProgressWindowHelper, this);
          this.VirtualizedTable = (0, basic_1.makeHelperTool)(virtualizedTable_1.VirtualizedTableHelper, this);
          this.Dialog = (0, basic_1.makeHelperTool)(dialog_1.DialogHelper, this);
          this.LargePrefObject = (0, basic_1.makeHelperTool)(largePref_1.LargePrefHelper, this);
          this.Guide = (0, basic_1.makeHelperTool)(guide_1.GuideHelper, this);
        }
        /**
         * Unregister everything created by managers.
         */
        unregisterAll() {
          (0, basic_1.unregister)(this);
        }
      };
      exports.ZoteroToolkit = ZoteroToolkit3;
      exports.default = ZoteroToolkit3;
    }
  });

  // src/index.ts
  var import_zotero_plugin_toolkit3 = __toESM(require_dist());

  // src/modules/locale.ts
  var import_zotero_plugin_toolkit = __toESM(require_dist());
  function getString(key) {
    return (0, import_zotero_plugin_toolkit.getString)(key, "zotero-auto-tagger");
  }

  // src/modules/autoTagger.ts
  var import_zotero_plugin_toolkit2 = __toESM(require_dist());
  var AutoTagger = class {
    constructor() {
      this.config = {
        gptApiEndpoint: "https://api.openai.com/v1/chat/completions",
        gptModel: "gpt-4-turbo-preview",
        maxPagesToProcess: 10
      };
      this.toolkit = new import_zotero_plugin_toolkit2.ZoteroToolkit();
    }
    async createEntryFromPDF(items) {
      if (!items.length) {
        this.showError("Please select at least one PDF item.");
        return;
      }
      const progressWindow = this.toolkit.getProgressWindow("Processing PDFs");
      progressWindow.show();
      try {
        for (const item of items) {
          if (item.isAttachment() && item.attachmentContentType === "application/pdf") {
            this.toolkit.log(`Processing PDF: ${item.getField("title")}`);
            const filePath = await item.getFilePathAsync();
            if (!filePath) {
              this.toolkit.log("Could not get file path for PDF");
              continue;
            }
            const newItem = new Zotero.Item("journalArticle");
            const translator = new Zotero.Translate.ItemGetter();
            translator.attachmentFile = filePath;
            const translatedItems = await translator.translate();
            if (translatedItems?.length > 0) {
              Object.entries(translatedItems[0]).forEach(([key, value]) => {
                if (key !== "itemType") {
                  newItem.setField(key, value);
                }
              });
              await newItem.saveTx();
              item.parentID = newItem.id;
              await item.saveTx();
              this.toolkit.log("Successfully created entry from PDF");
            } else {
              this.toolkit.log("No metadata extracted from PDF");
            }
          }
        }
      } catch (error) {
        this.showError(`Error processing PDFs: ${error instanceof Error ? error.message : String(error)}`);
        this.toolkit.log(`Error in createEntryFromPDF: ${error instanceof Error ? error.stack : String(error)}`);
      } finally {
        await Zotero.Promise.delay(2e3);
        progressWindow.close();
      }
    }
    async autoTagItems(items) {
      if (!items.length) {
        this.showError("Please select at least one item to tag.");
        return;
      }
      const progressWindow = this.toolkit.getProgressWindow("Auto-tagging items");
      progressWindow.show();
      try {
        for (const item of items) {
          this.toolkit.log(`Auto-tagging item: ${item.getField("title")}`);
        }
      } catch (error) {
        this.showError(`Error auto-tagging items: ${error instanceof Error ? error.message : String(error)}`);
        this.toolkit.log(`Error in autoTagItems: ${error instanceof Error ? error.stack : String(error)}`);
      } finally {
        await Zotero.Promise.delay(2e3);
        progressWindow.close();
      }
    }
    showError(message) {
      const progressWindow = this.toolkit.getProgressWindow("Error");
      progressWindow.createLine({
        text: message,
        type: "error"
      });
      progressWindow.show();
      progressWindow.startCloseTimer(8e3);
    }
  };
  var autoTagger_default = new AutoTagger();

  // src/index.ts
  var AutoTaggerPlugin = class {
    constructor() {
      this.data = {
        alive: true,
        toolkit: new import_zotero_plugin_toolkit3.ZoteroToolkit()
      };
    }
    // This is called when the plugin is loaded
    async onStartup() {
      await this.initializePreferences();
      this.registerMenuItems();
    }
    // This is called when the plugin is unloaded
    async onShutdown() {
      this.data.alive = false;
      await (0, import_zotero_plugin_toolkit3.unregister)();
    }
    async initializePreferences() {
    }
    registerMenuItems() {
      if (Zotero.ItemTreeView && Zotero.ItemTreeView.prototype) {
        const originalOnPopup = Zotero.ItemTreeView.prototype.onPopup;
        Zotero.ItemTreeView.prototype.onPopup = function(event) {
          const originalResult = originalOnPopup.apply(this, arguments);
          try {
            const items = Zotero.getActiveZoteroPane().getSelectedItems();
            if (items.length) {
              event.target.appendChild(document.createXULElement("menuseparator"));
              const autoTagMenuItem = document.createXULElement("menuitem");
              autoTagMenuItem.setAttribute("label", getString("menuitem-autotag-label"));
              autoTagMenuItem.addEventListener("command", () => autoTagger_default.autoTagItems(items));
              event.target.appendChild(autoTagMenuItem);
              const createEntryMenuItem = document.createXULElement("menuitem");
              createEntryMenuItem.setAttribute("label", getString("menuitem-createentry-label"));
              createEntryMenuItem.addEventListener("command", () => autoTagger_default.createEntryFromPDF(items));
              event.target.appendChild(createEntryMenuItem);
            }
          } catch (e) {
            this.data.toolkit.log("Error in Auto-Tagger menu popup: " + e);
          }
          return originalResult;
        };
      }
    }
  };
  var src_default = new AutoTaggerPlugin();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L3V0aWxzL2RlYnVnQnJpZGdlLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC91dGlscy9wbHVnaW5CcmlkZ2UuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L21hbmFnZXJzL3Rvb2xraXRHbG9iYWwuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L2Jhc2ljLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC90b29scy91aS5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvem90ZXJvLXBsdWdpbi10b29sa2l0L2Rpc3QvdXRpbHMvd2FpdC5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvem90ZXJvLXBsdWdpbi10b29sa2l0L2Rpc3QvdG9vbHMvcmVhZGVyLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC90b29scy9leHRyYUZpZWxkLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC9oZWxwZXJzL3BhdGNoLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC9tYW5hZ2Vycy9maWVsZEhvb2suanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L21hbmFnZXJzL3BhdGNoLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC9tYW5hZ2Vycy9pdGVtVHJlZS5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvem90ZXJvLXBsdWdpbi10b29sa2l0L2Rpc3QvbWFuYWdlcnMvcHJvbXB0LmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC9tYW5hZ2Vycy9saWJyYXJ5VGFiUGFuZWwuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L21hbmFnZXJzL3JlYWRlclRhYlBhbmVsLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC9tYW5hZ2Vycy9tZW51LmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC9tYW5hZ2Vycy9wcmVmZXJlbmNlUGFuZS5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvem90ZXJvLXBsdWdpbi10b29sa2l0L2Rpc3QvbWFuYWdlcnMvc2hvcnRjdXQuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L2hlbHBlcnMvY2xpcGJvYXJkLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC9oZWxwZXJzL2ZpbGVQaWNrZXIuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L2hlbHBlcnMvcHJvZ3Jlc3NXaW5kb3cuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L2hlbHBlcnMvdmlydHVhbGl6ZWRUYWJsZS5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvem90ZXJvLXBsdWdpbi10b29sa2l0L2Rpc3QvaGVscGVycy9kaWFsb2cuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L21hbmFnZXJzL3JlYWRlckluc3RhbmNlLmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC9tYW5hZ2Vycy9pdGVtQm94LmpzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy96b3Rlcm8tcGx1Z2luLXRvb2xraXQvZGlzdC9oZWxwZXJzL2xhcmdlUHJlZi5qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvem90ZXJvLXBsdWdpbi10b29sa2l0L2Rpc3QvbWFuYWdlcnMva2V5Ym9hcmQuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L2hlbHBlcnMvZ3VpZGUuanMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3pvdGVyby1wbHVnaW4tdG9vbGtpdC9kaXN0L2luZGV4LmpzIiwgIi4uLy4uLy4uLy4uL3NyYy9pbmRleC50cyIsICIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9sb2NhbGUudHMiLCAiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvYXV0b1RhZ2dlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5EZWJ1Z0JyaWRnZSA9IHZvaWQgMDtcclxuY29uc3QgYmFzaWNfMSA9IHJlcXVpcmUoXCIuLi9iYXNpY1wiKTtcclxuY29uc3QgdG9vbGtpdEdsb2JhbF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9tYW5hZ2Vycy90b29sa2l0R2xvYmFsXCIpKTtcclxuLyoqXHJcbiAqIERlYnVnIGJyaWRnZS5cclxuICpcclxuICogQHJlbWFya3NcclxuICogR2xvYmFsIHZhcmlhYmxlczogWm90ZXJvLCB3aW5kb3cobWFpbiB3aW5kb3cpLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBSdW4gc2NyaXB0IGRpcmVjdGx5LiBUaGUgYHJ1bmAgaXMgVVJJZW5jb2RlZCBzY3JpcHQuXHJcbiAqXHJcbiAqIGB6b3Rlcm86Ly96dG9vbGtpdC1kZWJ1Zy8/cnVuPVpvdGVyby5nZXRNYWluV2luZG93KCkuYWxlcnQoJTIySGVsbG9Xb3JsZCElMjIpJmFwcD1kZXZlbG9wZXJgXHJcbiAqIEBleGFtcGxlXHJcbiAqIFJ1biBzY3JpcHQgZnJvbSBmaWxlLiBUaGUgYGZpbGVgIGlzIFVSSWVuY29kZWQgcGF0aCB0byBqcyBmaWxlIHN0YXJ0cyB3aXRoIGBmaWxlOi8vL2BcclxuICpcclxuICogYHpvdGVybzovL3p0b29sa2l0LWRlYnVnLz9maWxlPWZpbGUlM0ElMkYlMkYlMkZDJTNBJTJGVXNlcnMlMkZ3X3hpYSUyRkRlc2t0b3AlMkZydW4uanMmYXBwPWRldmVsb3BlcmBcclxuICovXHJcbmNsYXNzIERlYnVnQnJpZGdlIHtcclxuICAgIGdldCB2ZXJzaW9uKCkge1xyXG4gICAgICAgIHJldHVybiBEZWJ1Z0JyaWRnZS52ZXJzaW9uO1xyXG4gICAgfVxyXG4gICAgZ2V0IGRpc2FibGVEZWJ1Z0JyaWRnZVBhc3N3b3JkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlRGVidWdCcmlkZ2VQYXNzd29yZDtcclxuICAgIH1cclxuICAgIHNldCBkaXNhYmxlRGVidWdCcmlkZ2VQYXNzd29yZCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2Rpc2FibGVEZWJ1Z0JyaWRnZVBhc3N3b3JkID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBnZXQgcGFzc3dvcmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpLlByZWZzLmdldChEZWJ1Z0JyaWRnZS5wYXNzd29yZFByZWYsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgc2V0IHBhc3N3b3JkKHYpIHtcclxuICAgICAgICBiYXNpY18xLkJhc2ljVG9vbC5nZXRab3Rlcm8oKS5QcmVmcy5zZXQoRGVidWdCcmlkZ2UucGFzc3dvcmRQcmVmLCB2LCB0cnVlKTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2Rpc2FibGVEZWJ1Z0JyaWRnZVBhc3N3b3JkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplRGVidWdCcmlkZ2UoKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBzZXRNb2R1bGUoaW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgaWYgKCEoKF9hID0gaW5zdGFuY2UuZGVidWdCcmlkZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS52ZXJzaW9uKSB8fFxyXG4gICAgICAgICAgICBpbnN0YW5jZS5kZWJ1Z0JyaWRnZS52ZXJzaW9uIDwgRGVidWdCcmlkZ2UudmVyc2lvbikge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5kZWJ1Z0JyaWRnZSA9IG5ldyBEZWJ1Z0JyaWRnZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGluaXRpYWxpemVEZWJ1Z0JyaWRnZSgpIHtcclxuICAgICAgICBjb25zdCBkZWJ1Z0JyaWRnZUV4dGVuc2lvbiA9IHtcclxuICAgICAgICAgICAgbm9Db250ZW50OiB0cnVlLFxyXG4gICAgICAgICAgICBkb0FjdGlvbjogYXN5bmMgKHVyaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgWm90ZXJvID0gYmFzaWNfMS5CYXNpY1Rvb2wuZ2V0Wm90ZXJvKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3aW5kb3cgPSBab3Rlcm8uZ2V0TWFpbldpbmRvdygpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXJpU3RyaW5nID0gdXJpLnNwZWMuc3BsaXQoXCIvL1wiKS5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmICghdXJpU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0ge307XHJcbiAgICAgICAgICAgICAgICAoX2EgPSB1cmlTdHJpbmdcclxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCI/XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnBvcCgpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc3BsaXQoXCImXCIpLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXNbcC5zcGxpdChcIj1cIilbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHAuc3BsaXQoXCI9XCIpWzFdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2tpcFBhc3N3b3JkQ2hlY2sgPSB0b29sa2l0R2xvYmFsXzEuZGVmYXVsdC5nZXRJbnN0YW5jZSgpLmRlYnVnQnJpZGdlLmRpc2FibGVEZWJ1Z0JyaWRnZVBhc3N3b3JkO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFsbG93ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmIChza2lwUGFzc3dvcmRDaGVjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbG93ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgcGFzc3dvcmQgaXMgbm90IHNldCwgYXNrIHBlcm1pc3Npb24gZm9yIGNvbW1hbmRzIHdpdGhvdXQgcGFzc3dvcmQuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXMucGFzc3dvcmQgPT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMucGFzc3dvcmQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dlZCA9IHdpbmRvdy5jb25maXJtKGBFeHRlcm5hbCBBcHAgJHtwYXJhbXMuYXBwfSB3YW50cyB0byBleGVjdXRlIGNvbW1hbmQgd2l0aG91dCBwYXNzd29yZC5cXG5Db21tYW5kOlxcbiR7KHBhcmFtcy5ydW4gfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy5maWxlIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiKS5zbGljZSgwLCAxMDApfVxcbklmIHlvdSBkbyBub3Qga25vdyB3aGF0IGl0IGlzLCBwbGVhc2UgY2xpY2sgQ2FuY2VsIHRvIGRlbnkuYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvd2VkID0gdGhpcy5wYXNzd29yZCA9PT0gcGFyYW1zLnBhc3N3b3JkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5ydW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IEFzeW5jRnVuY3Rpb24gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYXN5bmMgZnVuY3Rpb24gKCkgeyB9KS5jb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGYgPSBuZXcgQXN5bmNGdW5jdGlvbihcIlpvdGVybyx3aW5kb3dcIiwgcGFyYW1zLnJ1bik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBmKFpvdGVybywgd2luZG93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWm90ZXJvLmRlYnVnKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VydmljZXMuc2NyaXB0bG9hZGVyLmxvYWRTdWJTY3JpcHQocGFyYW1zLmZpbGUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBab3Rlcm8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpvdGVyby5kZWJ1ZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbmV3Q2hhbm5lbDogZnVuY3Rpb24gKHVyaSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb0FjdGlvbih1cmkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIFNlcnZpY2VzLmlvLmdldFByb3RvY29sSGFuZGxlcihcInpvdGVyb1wiKS53cmFwcGVkSlNPYmplY3QuX2V4dGVuc2lvbnNbXCJ6b3Rlcm86Ly96dG9vbGtpdC1kZWJ1Z1wiXSA9IGRlYnVnQnJpZGdlRXh0ZW5zaW9uO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRGVidWdCcmlkZ2UgPSBEZWJ1Z0JyaWRnZTtcclxuRGVidWdCcmlkZ2UudmVyc2lvbiA9IDI7XHJcbkRlYnVnQnJpZGdlLnBhc3N3b3JkUHJlZiA9IFwiZXh0ZW5zaW9ucy56b3Rlcm8uZGVidWctYnJpZGdlLnBhc3N3b3JkXCI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlYnVnQnJpZGdlLmpzLm1hcCIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlBsdWdpbkJyaWRnZSA9IHZvaWQgMDtcclxuY29uc3QgYmFzaWNfMSA9IHJlcXVpcmUoXCIuLi9iYXNpY1wiKTtcclxuLyoqXHJcbiAqIFBsdWdpbiBicmlkZ2UuIEluc3RhbGwgcGx1Z2luIGZyb20gem90ZXJvOi8vcGx1Z2luXHJcbiAqIEBleGFtcGxlXHJcbiAqIEluc3RhbGwgcGx1Z2luIGZyb20gdXJsLCB3aXRoIG1pbmltYWwgWm90ZXJvIHZlcnNpb24gcmVxdWlyZW1lbnQuXHJcbiAqIGBgYHRleHRcclxuICogem90ZXJvOi8vcGx1Z2luLz9hY3Rpb249aW5zdGFsbCZ1cmw9aHR0cHMlM0ElMkYlMkZnaXRodWIuY29tJTJGTXVpc2VEZXN0aW55JTJGem90ZXJvLXN0eWxlJTJGcmVsZWFzZXMlMkZkb3dubG9hZCUyRjMuMC41JTJGem90ZXJvLXN0eWxlLnhwaSZtaW5WZXJzaW9uPTYuOTk5XHJcbiAqIGBgYFxyXG4gKi9cclxuY2xhc3MgUGx1Z2luQnJpZGdlIHtcclxuICAgIGdldCB2ZXJzaW9uKCkge1xyXG4gICAgICAgIHJldHVybiBQbHVnaW5CcmlkZ2UudmVyc2lvbjtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVBsdWdpbkJyaWRnZSgpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHNldE1vZHVsZShpbnN0YW5jZSkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBpZiAoISgoX2EgPSBpbnN0YW5jZS5wbHVnaW5CcmlkZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS52ZXJzaW9uKSB8fFxyXG4gICAgICAgICAgICBpbnN0YW5jZS5wbHVnaW5CcmlkZ2UudmVyc2lvbiA8IFBsdWdpbkJyaWRnZS52ZXJzaW9uKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnBsdWdpbkJyaWRnZSA9IG5ldyBQbHVnaW5CcmlkZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbml0aWFsaXplUGx1Z2luQnJpZGdlKCkge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBjb25zdCB7IEFkZG9uTWFuYWdlciB9ID0gQ2hyb21lVXRpbHMuaW1wb3J0KFwicmVzb3VyY2U6Ly9ncmUvbW9kdWxlcy9BZGRvbk1hbmFnZXIuanNtXCIpO1xyXG4gICAgICAgIGNvbnN0IFpvdGVybyA9IGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpO1xyXG4gICAgICAgIGNvbnN0IHBsdWdpbkJyaWRnZUV4dGVuc2lvbiA9IHtcclxuICAgICAgICAgICAgbm9Db250ZW50OiB0cnVlLFxyXG4gICAgICAgICAgICBkb0FjdGlvbjogYXN5bmMgKHVyaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmlTdHJpbmcgPSB1cmkuc3BlYy5zcGxpdChcIi8vXCIpLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdXJpU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgKF9hID0gdXJpU3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIj9cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnBvcCgpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc3BsaXQoXCImXCIpLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zW3Auc3BsaXQoXCI9XCIpWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChwLnNwbGl0KFwiPVwiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5hY3Rpb24gPT09IFwiaW5zdGFsbFwiICYmIHBhcmFtcy51cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChwYXJhbXMubWluVmVyc2lvbiAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VydmljZXMudmMuY29tcGFyZShab3Rlcm8udmVyc2lvbiwgcGFyYW1zLm1pblZlcnNpb24pIDwgMCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChwYXJhbXMubWF4VmVyc2lvbiAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlcnZpY2VzLnZjLmNvbXBhcmUoWm90ZXJvLnZlcnNpb24sIHBhcmFtcy5tYXhWZXJzaW9uKSA+IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFBsdWdpbiBpcyBub3QgY29tcGF0aWJsZSB3aXRoIFpvdGVybyB2ZXJzaW9uICR7Wm90ZXJvLnZlcnNpb259LmAgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBUaGUgcGx1Z2luIHJlcXVpcmVzIFpvdGVybyB2ZXJzaW9uIGJldHdlZW4gJHtwYXJhbXMubWluVmVyc2lvbn0gYW5kICR7cGFyYW1zLm1heFZlcnNpb259LmApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkZG9uID0gYXdhaXQgQWRkb25NYW5hZ2VyLmdldEluc3RhbGxGb3JVUkwocGFyYW1zLnVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhZGRvbiAmJiBhZGRvbi5zdGF0ZSA9PT0gQWRkb25NYW5hZ2VyLlNUQVRFX0FWQUlMQUJMRSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkb24uaW5zdGFsbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGludChcIlBsdWdpbiBpbnN0YWxsZWQgc3VjY2Vzc2Z1bGx5LlwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUGx1Z2luICR7cGFyYW1zLnVybH0gaXMgbm90IGF2YWlsYWJsZS5gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgWm90ZXJvLmxvZ0Vycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhpbnQoZS5tZXNzYWdlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5ld0NoYW5uZWw6IGZ1bmN0aW9uICh1cmkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG9BY3Rpb24odXJpKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBTZXJ2aWNlcy5pby5nZXRQcm90b2NvbEhhbmRsZXIoXCJ6b3Rlcm9cIikud3JhcHBlZEpTT2JqZWN0Ll9leHRlbnNpb25zW1wiem90ZXJvOi8vcGx1Z2luXCJdID0gcGx1Z2luQnJpZGdlRXh0ZW5zaW9uO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUGx1Z2luQnJpZGdlID0gUGx1Z2luQnJpZGdlO1xyXG5QbHVnaW5CcmlkZ2UudmVyc2lvbiA9IDE7XHJcbmZ1bmN0aW9uIGhpbnQoY29udGVudCwgc3VjY2Vzcykge1xyXG4gICAgY29uc3QgcHJvZ3Jlc3NXaW5kb3cgPSBuZXcgWm90ZXJvLlByb2dyZXNzV2luZG93KHsgY2xvc2VPbkNsaWNrOiB0cnVlIH0pO1xyXG4gICAgcHJvZ3Jlc3NXaW5kb3cuY2hhbmdlSGVhZGxpbmUoXCJQbHVnaW4gVG9vbGtpdFwiKTtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByb2dyZXNzV2luZG93LnByb2dyZXNzID0gbmV3IHByb2dyZXNzV2luZG93Lkl0ZW1Qcm9ncmVzcyhzdWNjZXNzXHJcbiAgICAgICAgPyBcImNocm9tZTovL3pvdGVyby9za2luL3RpY2sucG5nXCJcclxuICAgICAgICA6IFwiY2hyb21lOi8vem90ZXJvL3NraW4vY3Jvc3MucG5nXCIsIGNvbnRlbnQpO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJvZ3Jlc3NXaW5kb3cucHJvZ3Jlc3Muc2V0UHJvZ3Jlc3MoMTAwKTtcclxuICAgIHByb2dyZXNzV2luZG93LnNob3coKTtcclxuICAgIHByb2dyZXNzV2luZG93LnN0YXJ0Q2xvc2VUaW1lcig1MDAwKTtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wbHVnaW5CcmlkZ2UuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVG9vbGtpdEdsb2JhbCA9IHZvaWQgMDtcclxuY29uc3QgYmFzaWNfMSA9IHJlcXVpcmUoXCIuLi9iYXNpY1wiKTtcclxuY29uc3QgZGVidWdCcmlkZ2VfMSA9IHJlcXVpcmUoXCIuLi91dGlscy9kZWJ1Z0JyaWRnZVwiKTtcclxuY29uc3QgcGx1Z2luQnJpZGdlXzEgPSByZXF1aXJlKFwiLi4vdXRpbHMvcGx1Z2luQnJpZGdlXCIpO1xyXG4vKipcclxuICogVGhlIFNpbmdsZXRvbiBjbGFzcyBvZiBnbG9iYWwgcGFyYW1ldGVycyB1c2VkIGJ5IG1hbmFnZXJzLlxyXG4gKiBAZXhhbXBsZSBgVG9vbGtpdEdsb2JhbC5nZXRJbnN0YW5jZSgpLml0ZW1UcmVlLnN0YXRlYFxyXG4gKi9cclxuY2xhc3MgVG9vbGtpdEdsb2JhbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBpbml0aWFsaXplTW9kdWxlcyh0aGlzKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRXaW5kb3cgPSBiYXNpY18xLkJhc2ljVG9vbC5nZXRab3Rlcm8oKS5nZXRNYWluV2luZG93KCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgZ2xvYmFsIHVuaXF1ZSBpbnN0YW5jZSBvZiBgY2xhc3MgVG9vbGtpdEdsb2JhbGAuXHJcbiAgICAgKiBAcmV0dXJucyBBbiBpbnN0YW5jZSBvZiBgVG9vbGtpdEdsb2JhbGAuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcclxuICAgICAgICBjb25zdCBab3Rlcm8gPSBiYXNpY18xLkJhc2ljVG9vbC5nZXRab3Rlcm8oKTtcclxuICAgICAgICBsZXQgcmVxdWlyZUluaXQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoIShcIl90b29sa2l0R2xvYmFsXCIgaW4gWm90ZXJvKSkge1xyXG4gICAgICAgICAgICBab3Rlcm8uX3Rvb2xraXRHbG9iYWwgPSBuZXcgVG9vbGtpdEdsb2JhbCgpO1xyXG4gICAgICAgICAgICByZXF1aXJlSW5pdCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRHbG9iYWwgPSBab3Rlcm8uX3Rvb2xraXRHbG9iYWw7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRHbG9iYWwuY3VycmVudFdpbmRvdyAhPT0gWm90ZXJvLmdldE1haW5XaW5kb3coKSkge1xyXG4gICAgICAgICAgICBjaGVja1dpbmRvd0RlcGVuZGVudE1vZHVsZXMoY3VycmVudEdsb2JhbCk7XHJcbiAgICAgICAgICAgIHJlcXVpcmVJbml0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVpcmVJbml0KSB7XHJcbiAgICAgICAgICAgIGluaXRpYWxpemVNb2R1bGVzKGN1cnJlbnRHbG9iYWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3VycmVudEdsb2JhbDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlRvb2xraXRHbG9iYWwgPSBUb29sa2l0R2xvYmFsO1xyXG4vKipcclxuICogSW5pdGlhbGl6ZSBnbG9iYWwgbW9kdWxlcyB1c2luZyB0aGUgZGF0YSBvZiB0aGlzIHRvb2xraXQgYnVpbGQuXHJcbiAqIE1vZHVsZXMgYW5kIHRoZWlyIHByb3BlcnRpZXMgdGhhdCBkbyBub3QgZXhpc3Qgd2lsbCBiZSB1cGRhdGVkLlxyXG4gKiBAcGFyYW0gaW5zdGFuY2UgVG9vbGtpdEdsb2JhbCBpbnN0YW5jZVxyXG4gKi9cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZU1vZHVsZXMoaW5zdGFuY2UpIHtcclxuICAgIHNldE1vZHVsZShpbnN0YW5jZSwgXCJmaWVsZEhvb2tzXCIsIHtcclxuICAgICAgICBfcmVhZHk6IGZhbHNlLFxyXG4gICAgICAgIGdldEZpZWxkSG9va3M6IHt9LFxyXG4gICAgICAgIHNldEZpZWxkSG9va3M6IHt9LFxyXG4gICAgICAgIGlzRmllbGRPZkJhc2VIb29rczoge30sXHJcbiAgICB9KTtcclxuICAgIHNldE1vZHVsZShpbnN0YW5jZSwgXCJpdGVtVHJlZVwiLCB7XHJcbiAgICAgICAgX3JlYWR5OiBmYWxzZSxcclxuICAgICAgICBjb2x1bW5zOiBbXSxcclxuICAgICAgICByZW5kZXJDZWxsSG9va3M6IHt9LFxyXG4gICAgfSk7XHJcbiAgICBzZXRNb2R1bGUoaW5zdGFuY2UsIFwiaXRlbUJveFwiLCB7XHJcbiAgICAgICAgX3JlYWR5OiBmYWxzZSxcclxuICAgICAgICBmaWVsZE9wdGlvbnM6IHt9LFxyXG4gICAgfSk7XHJcbiAgICBzZXRNb2R1bGUoaW5zdGFuY2UsIFwic2hvcnRjdXRcIiwge1xyXG4gICAgICAgIF9yZWFkeTogZmFsc2UsXHJcbiAgICAgICAgZXZlbnRLZXlzOiBbXSxcclxuICAgIH0pO1xyXG4gICAgc2V0TW9kdWxlKGluc3RhbmNlLCBcInByb21wdFwiLCB7XHJcbiAgICAgICAgX3JlYWR5OiBmYWxzZSxcclxuICAgICAgICBpbnN0YW5jZTogdW5kZWZpbmVkLFxyXG4gICAgfSk7XHJcbiAgICBzZXRNb2R1bGUoaW5zdGFuY2UsIFwicmVhZGVySW5zdGFuY2VcIiwge1xyXG4gICAgICAgIF9yZWFkeTogZmFsc2UsXHJcbiAgICAgICAgaW5pdGlhbGl6ZWRIb29rczoge30sXHJcbiAgICB9KTtcclxuICAgIGRlYnVnQnJpZGdlXzEuRGVidWdCcmlkZ2Uuc2V0TW9kdWxlKGluc3RhbmNlKTtcclxuICAgIHBsdWdpbkJyaWRnZV8xLlBsdWdpbkJyaWRnZS5zZXRNb2R1bGUoaW5zdGFuY2UpO1xyXG59XHJcbmZ1bmN0aW9uIHNldE1vZHVsZShpbnN0YW5jZSwga2V5LCBtb2R1bGUpIHtcclxuICAgIHZhciBfYTtcclxuICAgIHZhciBfYjtcclxuICAgIGlmICghbW9kdWxlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKCFpbnN0YW5jZVtrZXldKSB7XHJcbiAgICAgICAgaW5zdGFuY2Vba2V5XSA9IG1vZHVsZTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgbW9kdWxlS2V5IGluIG1vZHVsZSkge1xyXG4gICAgICAgIChfYSA9IChfYiA9IGluc3RhbmNlW2tleV0pW21vZHVsZUtleV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfYlttb2R1bGVLZXldID0gbW9kdWxlW21vZHVsZUtleV0pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNoZWNrV2luZG93RGVwZW5kZW50TW9kdWxlcyhpbnN0YW5jZSkge1xyXG4gICAgaW5zdGFuY2UuY3VycmVudFdpbmRvdyA9IGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpLmdldE1haW5XaW5kb3coKTtcclxuICAgIGluc3RhbmNlLml0ZW1UcmVlID0gdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2UuaXRlbUJveCA9IHVuZGVmaW5lZDtcclxuICAgIGluc3RhbmNlLnNob3J0Y3V0ID0gdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2UucHJvbXB0ID0gdW5kZWZpbmVkO1xyXG4gICAgaW5zdGFuY2UucmVhZGVySW5zdGFuY2UgPSB1bmRlZmluZWQ7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gVG9vbGtpdEdsb2JhbDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dG9vbGtpdEdsb2JhbC5qcy5tYXAiLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5NYW5hZ2VyVG9vbCA9IGV4cG9ydHMuQmFzaWNUb29sID0gdm9pZCAwO1xyXG5leHBvcnRzLnVucmVnaXN0ZXIgPSB1bnJlZ2lzdGVyO1xyXG5leHBvcnRzLm1ha2VIZWxwZXJUb29sID0gbWFrZUhlbHBlclRvb2w7XHJcbmNvbnN0IHRvb2xraXRHbG9iYWxfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9tYW5hZ2Vycy90b29sa2l0R2xvYmFsXCIpKTtcclxuLyoqXHJcbiAqIEJhc2ljIEFQSXMgd2l0aCBab3Rlcm8gNiAmIG5ld2VyICg3KSBjb21wYXRpYmlsaXR5LlxyXG4gKiBTZWUgYWxzbyBodHRwczovL3d3dy56b3Rlcm8ub3JnL3N1cHBvcnQvZGV2L3pvdGVyb183X2Zvcl9kZXZlbG9wZXJzXHJcbiAqL1xyXG5jbGFzcyBCYXNpY1Rvb2wge1xyXG4gICAgZ2V0IGJhc2ljT3B0aW9ucygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmFzaWNPcHRpb25zO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGJhc2ljVG9vbCBQYXNzIGFuIEJhc2ljVG9vbCBpbnN0YW5jZSB0byBjb3B5IGl0cyBvcHRpb25zLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgVXNlIGBwYXRjaGVyTWFuYWdlcmAgaW5zdGVhZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnBhdGNoU2lnbiA9IFwiem90ZXJvLXBsdWdpbi10b29sa2l0QDIuMC4wXCI7XHJcbiAgICAgICAgdGhpcy5fYmFzaWNPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBsb2c6IHtcclxuICAgICAgICAgICAgICAgIF90eXBlOiBcInRvb2xraXRsb2dcIixcclxuICAgICAgICAgICAgICAgIGRpc2FibGVDb25zb2xlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVaTG9nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHByZWZpeDogXCJcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGVidWc6IHRvb2xraXRHbG9iYWxfMS5kZWZhdWx0LmdldEluc3RhbmNlKCkuZGVidWdCcmlkZ2UsXHJcbiAgICAgICAgICAgIGFwaToge1xyXG4gICAgICAgICAgICAgICAgcGx1Z2luSUQ6IFwiem90ZXJvLXBsdWdpbi10b29sa2l0QHdpbmRpbmd3aW5kLmNvbVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsaXN0ZW5lcnM6IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uTWFpbldpbmRvd0xvYWQ6IG5ldyBTZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICBvbk1haW5XaW5kb3dVbmxvYWQ6IG5ldyBTZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICBvblBsdWdpblVubG9hZDogbmV3IFNldCgpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF9tYWluV2luZG93OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBfcGx1Z2luOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU9wdGlvbnMoZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZ2V0R2xvYmFsKGspIHtcclxuICAgICAgICBjb25zdCBfWm90ZXJvID0gdHlwZW9mIFpvdGVybyAhPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICA/IFpvdGVyb1xyXG4gICAgICAgICAgICA6IC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIENvbXBvbmVudHMuY2xhc3Nlc1tcIkB6b3Rlcm8ub3JnL1pvdGVybzsxXCJdLmdldFNlcnZpY2UoQ29tcG9uZW50cy5pbnRlcmZhY2VzLm5zSVN1cHBvcnRzKS53cmFwcGVkSlNPYmplY3Q7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgd2luZG93ID0gX1pvdGVyby5nZXRNYWluV2luZG93KCk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaykge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIlpvdGVyb1wiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcInpvdGVyb1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfWm90ZXJvO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIndpbmRvd1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3c7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwid2luZG93c1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfWm90ZXJvLmdldE1haW5XaW5kb3dzKCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZG9jdW1lbnRcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmRvY3VtZW50O1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIlpvdGVyb1BhbmVcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJab3Rlcm9QYW5lX0xvY2FsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9ab3Rlcm8uZ2V0QWN0aXZlWm90ZXJvUGFuZSgpO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93W2tdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIFpvdGVyby5sb2dFcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGl0J3MgcnVubmluZyBvbiBab3Rlcm8gNyAoRmlyZWZveCAxMDIpXHJcbiAgICAgKi9cclxuICAgIGlzWm90ZXJvNygpIHtcclxuICAgICAgICByZXR1cm4gWm90ZXJvLnBsYXRmb3JtTWFqb3JWZXJzaW9uID49IDEwMjtcclxuICAgIH1cclxuICAgIGlzRlgxMTUoKSB7XHJcbiAgICAgICAgcmV0dXJuIFpvdGVyby5wbGF0Zm9ybU1ham9yVmVyc2lvbiA+PSAxMTU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCBET01QYXJzZXIuXHJcbiAgICAgKlxyXG4gICAgICogRm9yIFpvdGVybyA2OiBtYWluV2luZG93LkRPTVBhcnNlciBvciBuc0lET01QYXJzZXJcclxuICAgICAqXHJcbiAgICAgKiBGb3IgWm90ZXJvIDc6IEZpcmVmb3ggMTAyIHN1cHBvcnQgRE9NUGFyc2VyIG5hdGl2ZWx5XHJcbiAgICAgKi9cclxuICAgIGdldERPTVBhcnNlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1pvdGVybzcoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3ICh0aGlzLmdldEdsb2JhbChcIkRPTVBhcnNlclwiKSkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyAodGhpcy5nZXRHbG9iYWwoXCJET01QYXJzZXJcIikpKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgcmV0dXJuIENvbXBvbmVudHMuY2xhc3Nlc1tcIkBtb3ppbGxhLm9yZy94bWxleHRyYXMvZG9tcGFyc2VyOzFcIlxyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIF0uY3JlYXRlSW5zdGFuY2UoQ29tcG9uZW50cy5pbnRlcmZhY2VzLm5zSURPTVBhcnNlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBpdCdzIGFuIFhVTCBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0gZWxlbVxyXG4gICAgICovXHJcbiAgICBpc1hVTEVsZW1lbnQoZWxlbSkge1xyXG4gICAgICAgIHJldHVybiAoZWxlbS5uYW1lc3BhY2VVUkkgPT09XHJcbiAgICAgICAgICAgIFwiaHR0cDovL3d3dy5tb3ppbGxhLm9yZy9rZXltYXN0ZXIvZ2F0ZWtlZXBlci90aGVyZS5pcy5vbmx5Lnh1bFwiKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGFuIFhVTCBlbGVtZW50XHJcbiAgICAgKlxyXG4gICAgICogRm9yIFpvdGVybyA2LCB1c2UgYGNyZWF0ZUVsZW1lbnROU2A7XHJcbiAgICAgKlxyXG4gICAgICogRm9yIFpvdGVybyA3KywgdXNlIGBjcmVhdGVYVUxFbGVtZW50YC5cclxuICAgICAqIEBwYXJhbSBkb2NcclxuICAgICAqIEBwYXJhbSB0eXBlXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogQ3JlYXRlIGEgYDxtZW51aXRlbT5gOlxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGNvbnN0IGNvbXBhdCA9IG5ldyBab3Rlcm9Db21wYXQoKTtcclxuICAgICAqIGNvbnN0IGRvYyA9IGNvbXBhdC5nZXRXaW5kb3coKS5kb2N1bWVudDtcclxuICAgICAqIGNvbnN0IGVsZW0gPSBjb21wYXQuY3JlYXRlWFVMRWxlbWVudChkb2MsIFwibWVudWl0ZW1cIik7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgY3JlYXRlWFVMRWxlbWVudChkb2MsIHR5cGUpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1pvdGVybzcoKSkge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHJldHVybiBkb2MuY3JlYXRlWFVMRWxlbWVudCh0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2MuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy5tb3ppbGxhLm9yZy9rZXltYXN0ZXIvZ2F0ZWtlZXBlci90aGVyZS5pcy5vbmx5Lnh1bFwiLCB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIE91dHB1dCB0byBib3RoIFpvdGVyby5kZWJ1ZyBhbmQgY29uc29sZS5sb2dcclxuICAgICAqIEBwYXJhbSBkYXRhIGUuZy4gc3RyaW5nLCBudW1iZXIsIG9iamVjdCwgLi4uXHJcbiAgICAgKi9cclxuICAgIGxvZyguLi5kYXRhKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IFpvdGVybyA9IHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpO1xyXG4gICAgICAgIGNvbnN0IGNvbnNvbGUgPSB0aGlzLmdldEdsb2JhbChcImNvbnNvbGVcIik7XHJcbiAgICAgICAgLy8gSWYgbG9nT3B0aW9uIGlzIG5vdCBwcm92aWRlcywgdXNlIHRoZSBnbG9iYWwgb25lLlxyXG4gICAgICAgIGxldCBvcHRpb25zO1xyXG4gICAgICAgIGlmICgoKF9hID0gZGF0YVtkYXRhLmxlbmd0aCAtIDFdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuX3R5cGUpID09PSBcInRvb2xraXRsb2dcIikge1xyXG4gICAgICAgICAgICBvcHRpb25zID0gZGF0YS5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLl9iYXNpY09wdGlvbnMubG9nO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5wcmVmaXgpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuc3BsaWNlKDAsIDAsIG9wdGlvbnMucHJlZml4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuZGlzYWJsZUNvbnNvbGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4uZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLnRyYWNlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmRpc2FibGVaTG9nKSB7XHJcbiAgICAgICAgICAgICAgICBab3Rlcm8uZGVidWcoZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGQgPT09IFwib2JqZWN0XCIgPyBKU09OLnN0cmluZ2lmeShkKSA6IFN0cmluZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWm90ZXJvLmRlYnVnKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICBab3Rlcm8ubG9nRXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXRjaCBhIGZ1bmN0aW9uXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBVc2Uge0BsaW5rIFBhdGNoSGVscGVyfSBpbnN0ZWFkLlxyXG4gICAgICogQHBhcmFtIG9iamVjdCBUaGUgb3duZXIgb2YgdGhlIGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0gZnVuY1NpZ24gVGhlIHNpZ25hdHVyZSBvZiB0aGUgZnVuY3Rpb24oZnVuY3Rpb24gbmFtZSlcclxuICAgICAqIEBwYXJhbSBvd25lclNpZ24gVGhlIHNpZ25hdHVyZSBvZiBwYXRjaCBvd25lciB0byBhdm9pZCBwYXRjaGluZyBhZ2FpblxyXG4gICAgICogQHBhcmFtIHBhdGNoZXIgVGhlIG5ldyB3cmFwcGVyIG9mIHRoZSBwYXRjaGVkIGZ1bmN0aW9uXHJcbiAgICAgKi9cclxuICAgIHBhdGNoKG9iamVjdCwgZnVuY1NpZ24sIG93bmVyU2lnbiwgcGF0Y2hlcikge1xyXG4gICAgICAgIGlmIChvYmplY3RbZnVuY1NpZ25dW293bmVyU2lnbl0pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke1N0cmluZyhmdW5jU2lnbil9IHJlLXBhdGNoZWRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2coXCJwYXRjaGluZ1wiLCBmdW5jU2lnbiwgYGJ5ICR7b3duZXJTaWdufWApO1xyXG4gICAgICAgIG9iamVjdFtmdW5jU2lnbl0gPSBwYXRjaGVyKG9iamVjdFtmdW5jU2lnbl0pO1xyXG4gICAgICAgIG9iamVjdFtmdW5jU2lnbl1bb3duZXJTaWduXSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIFpvdGVybyBldmVudCBsaXN0ZW5lciBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIHR5cGUgRXZlbnQgdHlwZVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIEV2ZW50IGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIGFkZExpc3RlbmVyQ2FsbGJhY2sodHlwZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoW1wib25NYWluV2luZG93TG9hZFwiLCBcIm9uTWFpbldpbmRvd1VubG9hZFwiXS5pbmNsdWRlcyh0eXBlKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbnN1cmVNYWluV2luZG93TGlzdGVuZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwib25QbHVnaW5VbmxvYWRcIikge1xyXG4gICAgICAgICAgICB0aGlzLl9lbnN1cmVQbHVnaW5MaXN0ZW5lcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9iYXNpY09wdGlvbnMubGlzdGVuZXJzLmNhbGxiYWNrc1t0eXBlXS5hZGQoY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSBab3Rlcm8gZXZlbnQgbGlzdGVuZXIgY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSB0eXBlIEV2ZW50IHR5cGVcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBFdmVudCBjYWxsYmFja1xyXG4gICAgICovXHJcbiAgICByZW1vdmVMaXN0ZW5lckNhbGxiYWNrKHR5cGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fYmFzaWNPcHRpb25zLmxpc3RlbmVycy5jYWxsYmFja3NbdHlwZV0uZGVsZXRlKGNhbGxiYWNrKTtcclxuICAgICAgICAvLyBSZW1vdmUgbGlzdGVuZXIgaWYgbm8gY2FsbGJhY2tcclxuICAgICAgICB0aGlzLl9lbnN1cmVSZW1vdmVMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYWxsIFpvdGVybyBldmVudCBsaXN0ZW5lciBjYWxsYmFja3Mgd2hlbiB0aGUgbGFzdCBjYWxsYmFjayBpcyByZW1vdmVkLlxyXG4gICAgICovXHJcbiAgICBfZW5zdXJlUmVtb3ZlTGlzdGVuZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBsaXN0ZW5lcnMgfSA9IHRoaXMuX2Jhc2ljT3B0aW9ucztcclxuICAgICAgICBpZiAobGlzdGVuZXJzLl9tYWluV2luZG93ICYmXHJcbiAgICAgICAgICAgIGxpc3RlbmVycy5jYWxsYmFja3Mub25NYWluV2luZG93TG9hZC5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgIGxpc3RlbmVycy5jYWxsYmFja3Mub25NYWluV2luZG93VW5sb2FkLnNpemUgPT09IDApIHtcclxuICAgICAgICAgICAgU2VydmljZXMud20ucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXJzLl9tYWluV2luZG93KTtcclxuICAgICAgICAgICAgZGVsZXRlIGxpc3RlbmVycy5fbWFpbldpbmRvdztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxpc3RlbmVycy5fcGx1Z2luICYmIGxpc3RlbmVycy5jYWxsYmFja3Mub25QbHVnaW5VbmxvYWQuc2l6ZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBab3Rlcm8uUGx1Z2lucy5yZW1vdmVPYnNlcnZlcihsaXN0ZW5lcnMuX3BsdWdpbik7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBsaXN0ZW5lcnMuX3BsdWdpbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZSB0aGUgbWFpbiB3aW5kb3cgbGlzdGVuZXIgaXMgcmVnaXN0ZXJlZC5cclxuICAgICAqL1xyXG4gICAgX2Vuc3VyZU1haW5XaW5kb3dMaXN0ZW5lcigpIHtcclxuICAgICAgICBpZiAodGhpcy5fYmFzaWNPcHRpb25zLmxpc3RlbmVycy5fbWFpbldpbmRvdykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1haW5XaW5kb3dMaXN0ZW5lciA9IHtcclxuICAgICAgICAgICAgb25PcGVuV2luZG93OiAoeHVsV2luZG93KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21XaW5kb3cgPSB4dWxXaW5kb3cuZG9jU2hlbGwuZG9tV2luZG93O1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb25sb2FkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbVdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLCBvbmxvYWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tV2luZG93LmxvY2F0aW9uLmhyZWYgIT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2hyb21lOi8vem90ZXJvL2NvbnRlbnQvem90ZXJvUGFuZS54aHRtbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjYmsgb2YgdGhpcy5fYmFzaWNPcHRpb25zLmxpc3RlbmVycy5jYWxsYmFja3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uTWFpbldpbmRvd0xvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiayhkb21XaW5kb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBkb21XaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gb25sb2FkKCksIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25DbG9zZVdpbmRvdzogYXN5bmMgKHh1bFdpbmRvdykgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tV2luZG93ID0geHVsV2luZG93LmRvY1NoZWxsLmRvbVdpbmRvdztcclxuICAgICAgICAgICAgICAgIGlmIChkb21XaW5kb3cubG9jYXRpb24uaHJlZiAhPT0gXCJjaHJvbWU6Ly96b3Rlcm8vY29udGVudC96b3Rlcm9QYW5lLnhodG1sXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNiayBvZiB0aGlzLl9iYXNpY09wdGlvbnMubGlzdGVuZXJzLmNhbGxiYWNrc1xyXG4gICAgICAgICAgICAgICAgICAgIC5vbk1haW5XaW5kb3dVbmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYmsoZG9tV2luZG93KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fYmFzaWNPcHRpb25zLmxpc3RlbmVycy5fbWFpbldpbmRvdyA9IG1haW5XaW5kb3dMaXN0ZW5lcjtcclxuICAgICAgICBTZXJ2aWNlcy53bS5hZGRMaXN0ZW5lcihtYWluV2luZG93TGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBFbnN1cmUgdGhlIHBsdWdpbiBsaXN0ZW5lciBpcyByZWdpc3RlcmVkLlxyXG4gICAgICovXHJcbiAgICBfZW5zdXJlUGx1Z2luTGlzdGVuZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Jhc2ljT3B0aW9ucy5saXN0ZW5lcnMuX3BsdWdpbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBsdWdpbkxpc3RlbmVyID0ge1xyXG4gICAgICAgICAgICBzaHV0ZG93bjogKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2JrIG9mIHRoaXMuX2Jhc2ljT3B0aW9ucy5saXN0ZW5lcnMuY2FsbGJhY2tzXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uUGx1Z2luVW5sb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2JrKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9iYXNpY09wdGlvbnMubGlzdGVuZXJzLl9wbHVnaW4gPSBwbHVnaW5MaXN0ZW5lcjtcclxuICAgICAgICBab3Rlcm8uUGx1Z2lucy5hZGRPYnNlcnZlcihwbHVnaW5MaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVPcHRpb25zKHNvdXJjZSkge1xyXG4gICAgICAgIGlmICghc291cmNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQmFzaWNUb29sKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhc2ljT3B0aW9ucyA9IHNvdXJjZS5fYmFzaWNPcHRpb25zO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fYmFzaWNPcHRpb25zID0gc291cmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRab3Rlcm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBab3Rlcm8gIT09IFwidW5kZWZpbmVkXCJcclxuICAgICAgICAgICAgPyBab3Rlcm9cclxuICAgICAgICAgICAgOiAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBDb21wb25lbnRzLmNsYXNzZXNbXCJAem90ZXJvLm9yZy9ab3Rlcm87MVwiXS5nZXRTZXJ2aWNlKENvbXBvbmVudHMuaW50ZXJmYWNlcy5uc0lTdXBwb3J0cykud3JhcHBlZEpTT2JqZWN0O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuQmFzaWNUb29sID0gQmFzaWNUb29sO1xyXG5jbGFzcyBNYW5hZ2VyVG9vbCBleHRlbmRzIEJhc2ljVG9vbCB7XHJcbiAgICBfZW5zdXJlQXV0b1VucmVnaXN0ZXJBbGwoKSB7XHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lckNhbGxiYWNrKFwib25QbHVnaW5VbmxvYWRcIiwgKHBhcmFtcywgcmVhc29uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuaWQgIT09IHRoaXMuYmFzaWNPcHRpb25zLmFwaS5wbHVnaW5JRCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudW5yZWdpc3RlckFsbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTWFuYWdlclRvb2wgPSBNYW5hZ2VyVG9vbDtcclxuZnVuY3Rpb24gdW5yZWdpc3Rlcih0b29scykge1xyXG4gICAgT2JqZWN0LnZhbHVlcyh0b29scykuZm9yRWFjaCgodG9vbCkgPT4ge1xyXG4gICAgICAgIGlmICh0b29sIGluc3RhbmNlb2YgTWFuYWdlclRvb2wgfHxcclxuICAgICAgICAgICAgdHlwZW9mICh0b29sID09PSBudWxsIHx8IHRvb2wgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRvb2wudW5yZWdpc3RlckFsbCkgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB0b29sLnVucmVnaXN0ZXJBbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBtYWtlSGVscGVyVG9vbChjbHMsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgUHJveHkoY2xzLCB7XHJcbiAgICAgICAgY29uc3RydWN0KHRhcmdldCwgYXJncykge1xyXG4gICAgICAgICAgICBjb25zdCBfb3JpZ2luID0gbmV3IGNscyguLi5hcmdzKTtcclxuICAgICAgICAgICAgaWYgKF9vcmlnaW4gaW5zdGFuY2VvZiBCYXNpY1Rvb2wpIHtcclxuICAgICAgICAgICAgICAgIF9vcmlnaW4udXBkYXRlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gX29yaWdpbjtcclxuICAgICAgICB9LFxyXG4gICAgfSk7XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmFzaWMuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVUlUb29sID0gdm9pZCAwO1xyXG5jb25zdCBiYXNpY18xID0gcmVxdWlyZShcIi4uL2Jhc2ljXCIpO1xyXG4vKipcclxuICogVUkgQVBJcy4gQ3JlYXRlIGVsZW1lbnRzIGFuZCBtYW5hZ2UgdGhlbS5cclxuICovXHJcbmNsYXNzIFVJVG9vbCBleHRlbmRzIGJhc2ljXzEuQmFzaWNUb29sIHtcclxuICAgIGdldCBiYXNpY09wdGlvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2ljT3B0aW9ucztcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKGJhc2UpIHtcclxuICAgICAgICBzdXBlcihiYXNlKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRDYWNoZSA9IFtdO1xyXG4gICAgICAgIGlmICghdGhpcy5fYmFzaWNPcHRpb25zLnVpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhc2ljT3B0aW9ucy51aSA9IHtcclxuICAgICAgICAgICAgICAgIGVuYWJsZUVsZW1lbnRSZWNvcmQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVFbGVtZW50SlNPTkxvZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVFbGVtZW50RE9NTG9nOiB0cnVlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGFsbCBlbGVtZW50cyBjcmVhdGVkIGJ5IGBjcmVhdGVFbGVtZW50YC5cclxuICAgICAqXHJcbiAgICAgKiBAcmVtYXJrc1xyXG4gICAgICogPiBXaGF0IGlzIHRoaXMgZm9yP1xyXG4gICAgICpcclxuICAgICAqIEluIGJvb3RzdHJhcCBwbHVnaW5zLCBlbGVtZW50cyBtdXN0IGJlIG1hbnVhbGx5IG1haW50YWluZWQgYW5kIHJlbW92ZWQgb24gZXhpdGluZy5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIEFQSSBkb2VzIHRoaXMgZm9yIHlvdS5cclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3RlckFsbCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRDYWNoZS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIChfYSA9IGUgPT09IG51bGwgfHwgZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZS5kZXJlZigpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVFbGVtZW50KC4uLmFyZ3MpIHtcclxuICAgICAgICB2YXIgX2EsIF9iLCBfYztcclxuICAgICAgICBjb25zdCBkb2MgPSBhcmdzWzBdO1xyXG4gICAgICAgIGNvbnN0IHRhZ05hbWUgPSBhcmdzWzFdLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgbGV0IHByb3BzID0gYXJnc1syXSB8fCB7fTtcclxuICAgICAgICBpZiAoIXRhZ05hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzdHJpbmcsIHVzZSB0aGUgb2xkIGNyZWF0ZVxyXG4gICAgICAgIGlmICh0eXBlb2YgYXJnc1syXSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBwcm9wcyA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogYXJnc1syXSxcclxuICAgICAgICAgICAgICAgIGVuYWJsZUVsZW1lbnRSZWNvcmQ6IGFyZ3NbM10sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgodHlwZW9mIHByb3BzLmVuYWJsZUVsZW1lbnRKU09OTG9nICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgICAgIHByb3BzLmVuYWJsZUVsZW1lbnRKU09OTG9nKSB8fFxyXG4gICAgICAgICAgICB0aGlzLmJhc2ljT3B0aW9ucy51aS5lbmFibGVFbGVtZW50SlNPTkxvZykge1xyXG4gICAgICAgICAgICB0aGlzLmxvZyhwcm9wcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgcHJvcHMucHJvcGVydGllcyA9IHByb3BzLnByb3BlcnRpZXMgfHwgcHJvcHMuZGlyZWN0QXR0cmlidXRlcztcclxuICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuIHx8IHByb3BzLnN1YkVsZW1lbnRPcHRpb25zO1xyXG4gICAgICAgIGxldCBlbGVtO1xyXG4gICAgICAgIGlmICh0YWdOYW1lID09PSBcImZyYWdtZW50XCIpIHtcclxuICAgICAgICAgICAgY29uc3QgZnJhZ0VsZW0gPSBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgICAgICBlbGVtID0gZnJhZ0VsZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcmVhbEVsZW0gPSAocHJvcHMuaWQgJiZcclxuICAgICAgICAgICAgICAgIChwcm9wcy5jaGVja0V4aXN0ZW5jZVBhcmVudFxyXG4gICAgICAgICAgICAgICAgICAgID8gcHJvcHMuY2hlY2tFeGlzdGVuY2VQYXJlbnRcclxuICAgICAgICAgICAgICAgICAgICA6IGRvYykucXVlcnlTZWxlY3RvcihgIyR7cHJvcHMuaWR9YCkpO1xyXG4gICAgICAgICAgICBpZiAocmVhbEVsZW0gJiYgcHJvcHMuaWdub3JlSWZFeGlzdHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZWFsRWxlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVhbEVsZW0gJiYgcHJvcHMucmVtb3ZlSWZFeGlzdHMpIHtcclxuICAgICAgICAgICAgICAgIHJlYWxFbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVhbEVsZW0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BzLmN1c3RvbUNoZWNrICYmICFwcm9wcy5jdXN0b21DaGVjayhkb2MsIHByb3BzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXJlYWxFbGVtIHx8ICFwcm9wcy5za2lwSWZFeGlzdHMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBuYW1lc3BhY2UgPSBwcm9wcy5uYW1lc3BhY2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5hbWVzcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pZ2h0SFRNTCA9IEhUTUxFbGVtZW50VGFnTmFtZXMuaW5jbHVkZXModGFnTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWlnaHRYVUwgPSBYVUxFbGVtZW50VGFnTmFtZXMuaW5jbHVkZXModGFnTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWlnaHRTVkcgPSBTVkdFbGVtZW50VGFnTmFtZXMuaW5jbHVkZXModGFnTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlcihtaWdodEhUTUwpICsgTnVtYmVyKG1pZ2h0WFVMKSArIE51bWJlcihtaWdodFNWRykgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKGBbV2FybmluZ10gQ3JlYXRpbmcgZWxlbWVudCAke3RhZ05hbWV9IHdpdGggbm8gbmFtZXNwYWNlIHNwZWNpZmllZC4gRm91bmQgbXVsdGlwbHkgbmFtZXNwYWNlIG1hdGNoZXMuYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtaWdodEhUTUwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gXCJodG1sXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1pZ2h0WFVMKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IFwieHVsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1pZ2h0U1ZHKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IFwic3ZnXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBcImh0bWxcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZXNwYWNlID09PSBcInh1bFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhbEVsZW0gPSB0aGlzLmNyZWF0ZVhVTEVsZW1lbnQoZG9jLCB0YWdOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYWxFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnROUyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWw6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmc6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcclxuICAgICAgICAgICAgICAgICAgICB9W25hbWVzcGFjZV0sIHRhZ05hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wcy5lbmFibGVFbGVtZW50UmVjb3JkICE9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgPyBwcm9wcy5lbmFibGVFbGVtZW50UmVjb3JkXHJcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmJhc2ljT3B0aW9ucy51aS5lbmFibGVFbGVtZW50UmVjb3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Q2FjaGUucHVzaChuZXcgV2Vha1JlZihyZWFsRWxlbSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wcy5pZCkge1xyXG4gICAgICAgICAgICAgICAgcmVhbEVsZW0uaWQgPSBwcm9wcy5pZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcHMuc3R5bGVzICYmIE9iamVjdC5rZXlzKHByb3BzLnN0eWxlcykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wcy5zdHlsZXMpLmZvckVhY2goKGspID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gcHJvcHMuc3R5bGVzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiB2ICE9PSBcInVuZGVmaW5lZFwiICYmIChyZWFsRWxlbS5zdHlsZVtrXSA9IHYpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BzLnByb3BlcnRpZXMgJiYgT2JqZWN0LmtleXMocHJvcHMucHJvcGVydGllcykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wcy5wcm9wZXJ0aWVzKS5mb3JFYWNoKChrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHByb3BzLnByb3BlcnRpZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHYgIT09IFwidW5kZWZpbmVkXCIgJiYgKHJlYWxFbGVtW2tdID0gdik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcHMuYXR0cmlidXRlcyAmJiBPYmplY3Qua2V5cyhwcm9wcy5hdHRyaWJ1dGVzKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHByb3BzLmF0dHJpYnV0ZXMpLmZvckVhY2goKGspID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gcHJvcHMuYXR0cmlidXRlc1trXTtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdiAhPT0gXCJ1bmRlZmluZWRcIiAmJiByZWFsRWxlbS5zZXRBdHRyaWJ1dGUoaywgU3RyaW5nKHYpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEFkZCBjbGFzc2VzIGFmdGVyIGF0dHJpYnV0ZXMsIGFzIHVzZXIgbWF5IHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXHJcbiAgICAgICAgICAgIGlmICgoX2EgPSBwcm9wcy5jbGFzc0xpc3QpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlYWxFbGVtLmNsYXNzTGlzdC5hZGQoLi4ucHJvcHMuY2xhc3NMaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoKF9iID0gcHJvcHMubGlzdGVuZXJzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wcy5saXN0ZW5lcnMuZm9yRWFjaCgoeyB0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIgJiYgcmVhbEVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtID0gcmVhbEVsZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgoX2MgPSBwcm9wcy5jaGlsZHJlbikgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJFbGVtZW50cyA9IHByb3BzLmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAubWFwKChjaGlsZFByb3BzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZFByb3BzLm5hbWVzcGFjZSA9IGNoaWxkUHJvcHMubmFtZXNwYWNlIHx8IHByb3BzLm5hbWVzcGFjZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUVsZW1lbnQoZG9jLCBjaGlsZFByb3BzLnRhZywgY2hpbGRQcm9wcyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChlKSA9PiBlKTtcclxuICAgICAgICAgICAgZWxlbS5hcHBlbmQoLi4uc3ViRWxlbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHByb3BzLmVuYWJsZUVsZW1lbnRET01Mb2cgIT09IFwidW5kZWZpbmVkXCJcclxuICAgICAgICAgICAgPyBwcm9wcy5lbmFibGVFbGVtZW50RE9NTG9nXHJcbiAgICAgICAgICAgIDogdGhpcy5iYXNpY09wdGlvbnMudWkuZW5hYmxlRWxlbWVudERPTUxvZykge1xyXG4gICAgICAgICAgICB0aGlzLmxvZyhlbGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVsZW07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEFwcGVuZCBlbGVtZW50KHMpIHRvIGEgbm9kZS5cclxuICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzIFNlZSB7QGxpbmsgRWxlbWVudFByb3BzfVxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lciBUaGUgcGFyZW50IG5vZGUgdG8gYXBwZW5kIHRvLlxyXG4gICAgICogQHJldHVybnMgQSBOb2RlIHRoYXQgaXMgdGhlIGFwcGVuZGVkIGNoaWxkIChhQ2hpbGQpLFxyXG4gICAgICogICAgICAgICAgZXhjZXB0IHdoZW4gYUNoaWxkIGlzIGEgRG9jdW1lbnRGcmFnbWVudCxcclxuICAgICAqICAgICAgICAgIGluIHdoaWNoIGNhc2UgdGhlIGVtcHR5IERvY3VtZW50RnJhZ21lbnQgaXMgcmV0dXJuZWQuXHJcbiAgICAgKi9cclxuICAgIGFwcGVuZEVsZW1lbnQocHJvcGVydGllcywgY29udGFpbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUVsZW1lbnQoY29udGFpbmVyLm93bmVyRG9jdW1lbnQsIHByb3BlcnRpZXMudGFnLCBwcm9wZXJ0aWVzKSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydHMgYSBub2RlIGJlZm9yZSBhIHJlZmVyZW5jZSBub2RlIGFzIGEgY2hpbGQgb2YgaXRzIHBhcmVudCBub2RlLlxyXG4gICAgICogQHBhcmFtIHByb3BlcnRpZXMgU2VlIHtAbGluayBFbGVtZW50UHJvcHN9XHJcbiAgICAgKiBAcGFyYW0gcmVmZXJlbmNlTm9kZSBUaGUgbm9kZSBiZWZvcmUgd2hpY2ggbmV3Tm9kZSBpcyBpbnNlcnRlZC5cclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGluc2VydEVsZW1lbnRCZWZvcmUocHJvcGVydGllcywgcmVmZXJlbmNlTm9kZSkge1xyXG4gICAgICAgIGlmIChyZWZlcmVuY2VOb2RlLnBhcmVudE5vZGUpXHJcbiAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuY3JlYXRlRWxlbWVudChyZWZlcmVuY2VOb2RlLm93bmVyRG9jdW1lbnQsIHByb3BlcnRpZXMudGFnLCBwcm9wZXJ0aWVzKSwgcmVmZXJlbmNlTm9kZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmxvZyhyZWZlcmVuY2VOb2RlLnRhZ05hbWUgK1xyXG4gICAgICAgICAgICAgICAgXCIgaGFzIG5vIHBhcmVudCwgY2Fubm90IGluc2VydCBcIiArXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnRhZyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlcGxhY2Ugb2xkTm9kZSB3aXRoIGEgbmV3IG9uZS5cclxuICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzIFNlZSB7QGxpbmsgRWxlbWVudFByb3BzfVxyXG4gICAgICogQHBhcmFtIG9sZE5vZGUgVGhlIGNoaWxkIHRvIGJlIHJlcGxhY2VkLlxyXG4gICAgICogQHJldHVybnMgVGhlIHJlcGxhY2VkIE5vZGUuIFRoaXMgaXMgdGhlIHNhbWUgbm9kZSBhcyBvbGRDaGlsZC5cclxuICAgICAqL1xyXG4gICAgcmVwbGFjZUVsZW1lbnQocHJvcGVydGllcywgb2xkTm9kZSkge1xyXG4gICAgICAgIGlmIChvbGROb2RlLnBhcmVudE5vZGUpXHJcbiAgICAgICAgICAgIHJldHVybiBvbGROb2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHRoaXMuY3JlYXRlRWxlbWVudChvbGROb2RlLm93bmVyRG9jdW1lbnQsIHByb3BlcnRpZXMudGFnLCBwcm9wZXJ0aWVzKSwgb2xkTm9kZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmxvZyhvbGROb2RlLnRhZ05hbWUgK1xyXG4gICAgICAgICAgICAgICAgXCIgaGFzIG5vIHBhcmVudCwgY2Fubm90IHJlcGxhY2UgaXQgd2l0aCBcIiArXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnRhZyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFBhcnNlIFhIVE1MIHRvIFhVTCBmcmFnbWVudC4gRm9yIFpvdGVybyA2LlxyXG4gICAgICpcclxuICAgICAqIFRvIGxvYWQgcHJlZmVyZW5jZXMgZnJvbSBhIFpvdGVybyA3J3MgYC54aHRtbGAsIHVzZSB0aGlzIG1ldGhvZCB0byBwYXJzZSBpdC5cclxuICAgICAqIEBwYXJhbSBzdHIgeGh0bWwgcmF3IHRleHRcclxuICAgICAqIEBwYXJhbSBlbnRpdGllcyBkdGQgZmlsZSBsaXN0IChcImNocm9tZTovL3h4eC5kdGRcIilcclxuICAgICAqIEBwYXJhbSBkZWZhdWx0WFVMIHRydWUgZm9yIGRlZmF1bHQgWFVMIG5hbWVzcGFjZVxyXG4gICAgICovXHJcbiAgICBwYXJzZVhIVE1MVG9GcmFnbWVudChzdHIsIGVudGl0aWVzID0gW10sIGRlZmF1bHRYVUwgPSB0cnVlKSB7XHJcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIE1velhVTEVsZW1lbnQucGFyc2VYVUxUb0ZyYWdtZW50XHJcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgaW5kZW50ICovXHJcbiAgICAgICAgbGV0IHBhcnNlciA9IHRoaXMuZ2V0RE9NUGFyc2VyKCk7XHJcbiAgICAgICAgLy8gcGFyc2VyLmZvcmNlRW5hYmxlWFVMWEJMKCk7XHJcbiAgICAgICAgLyogY3NwZWxsOndvcmRzIHh1bG5zIGh0bWxucyAqL1xyXG4gICAgICAgIGNvbnN0IHh1bG5zID0gXCJodHRwOi8vd3d3Lm1vemlsbGEub3JnL2tleW1hc3Rlci9nYXRla2VlcGVyL3RoZXJlLmlzLm9ubHkueHVsXCI7XHJcbiAgICAgICAgY29uc3QgaHRtbG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XHJcbiAgICAgICAgY29uc3Qgd3JhcHBlZFN0ciA9IGAke2VudGl0aWVzLmxlbmd0aFxyXG4gICAgICAgICAgICA/IGA8IURPQ1RZUEUgYmluZGluZ3MgWyAke2VudGl0aWVzLnJlZHVjZSgocHJlYW1ibGUsIHVybCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAocHJlYW1ibGUgK1xyXG4gICAgICAgICAgICAgICAgICAgIGA8IUVOVElUWSAlIF9kdGQtJHtpbmRleH0gU1lTVEVNIFwiJHt1cmx9XCI+ICVfZHRkLSR7aW5kZXh9OyBgKTtcclxuICAgICAgICAgICAgfSwgXCJcIil9XT5gXHJcbiAgICAgICAgICAgIDogXCJcIn1cclxuICAgICAgPGh0bWw6ZGl2IHhtbG5zPVwiJHtkZWZhdWx0WFVMID8geHVsbnMgOiBodG1sbnN9XCJcclxuICAgICAgICAgIHhtbG5zOnh1bD1cIiR7eHVsbnN9XCIgeG1sbnM6aHRtbD1cIiR7aHRtbG5zfVwiPlxyXG4gICAgICAke3N0cn1cclxuICAgICAgPC9odG1sOmRpdj5gO1xyXG4gICAgICAgIHRoaXMubG9nKHdyYXBwZWRTdHIsIHBhcnNlcik7XHJcbiAgICAgICAgbGV0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcod3JhcHBlZFN0ciwgXCJ0ZXh0L3htbFwiKTtcclxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIGluZGVudCAqL1xyXG4gICAgICAgIHRoaXMubG9nKGRvYyk7XHJcbiAgICAgICAgaWYgKGRvYy5kb2N1bWVudEVsZW1lbnQubG9jYWxOYW1lID09PSBcInBhcnNlcmVycm9yXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IHdlbGwtZm9ybWVkIFhIVE1MXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBXZSB1c2UgYSByYW5nZSBoZXJlIHNvIHRoYXQgd2UgZG9uJ3QgYWNjZXNzIHRoZSBpbm5lciBET00gZWxlbWVudHMgZnJvbVxyXG4gICAgICAgIC8vIEphdmFTY3JpcHQgYmVmb3JlIHRoZXkgYXJlIGltcG9ydGVkIGFuZCBpbnNlcnRlZCBpbnRvIGEgZG9jdW1lbnQuXHJcbiAgICAgICAgbGV0IHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XHJcbiAgICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGRvYy5xdWVyeVNlbGVjdG9yKFwiZGl2XCIpKTtcclxuICAgICAgICByZXR1cm4gcmFuZ2UuZXh0cmFjdENvbnRlbnRzKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5VSVRvb2wgPSBVSVRvb2w7XHJcbmNvbnN0IEhUTUxFbGVtZW50VGFnTmFtZXMgPSBbXHJcbiAgICBcImFcIixcclxuICAgIFwiYWJiclwiLFxyXG4gICAgXCJhZGRyZXNzXCIsXHJcbiAgICBcImFyZWFcIixcclxuICAgIFwiYXJ0aWNsZVwiLFxyXG4gICAgXCJhc2lkZVwiLFxyXG4gICAgXCJhdWRpb1wiLFxyXG4gICAgXCJiXCIsXHJcbiAgICBcImJhc2VcIixcclxuICAgIFwiYmRpXCIsXHJcbiAgICBcImJkb1wiLFxyXG4gICAgXCJibG9ja3F1b3RlXCIsXHJcbiAgICBcImJvZHlcIixcclxuICAgIFwiYnJcIixcclxuICAgIFwiYnV0dG9uXCIsXHJcbiAgICBcImNhbnZhc1wiLFxyXG4gICAgXCJjYXB0aW9uXCIsXHJcbiAgICBcImNpdGVcIixcclxuICAgIFwiY29kZVwiLFxyXG4gICAgXCJjb2xcIixcclxuICAgIFwiY29sZ3JvdXBcIixcclxuICAgIFwiZGF0YVwiLFxyXG4gICAgXCJkYXRhbGlzdFwiLFxyXG4gICAgXCJkZFwiLFxyXG4gICAgXCJkZWxcIixcclxuICAgIFwiZGV0YWlsc1wiLFxyXG4gICAgXCJkZm5cIixcclxuICAgIFwiZGlhbG9nXCIsXHJcbiAgICBcImRpdlwiLFxyXG4gICAgXCJkbFwiLFxyXG4gICAgXCJkdFwiLFxyXG4gICAgXCJlbVwiLFxyXG4gICAgXCJlbWJlZFwiLFxyXG4gICAgXCJmaWVsZHNldFwiLFxyXG4gICAgXCJmaWdjYXB0aW9uXCIsXHJcbiAgICBcImZpZ3VyZVwiLFxyXG4gICAgXCJmb290ZXJcIixcclxuICAgIFwiZm9ybVwiLFxyXG4gICAgXCJoMVwiLFxyXG4gICAgXCJoMlwiLFxyXG4gICAgXCJoM1wiLFxyXG4gICAgXCJoNFwiLFxyXG4gICAgXCJoNVwiLFxyXG4gICAgXCJoNlwiLFxyXG4gICAgXCJoZWFkXCIsXHJcbiAgICBcImhlYWRlclwiLFxyXG4gICAgXCJoZ3JvdXBcIixcclxuICAgIFwiaHJcIixcclxuICAgIFwiaHRtbFwiLFxyXG4gICAgXCJpXCIsXHJcbiAgICBcImlmcmFtZVwiLFxyXG4gICAgXCJpbWdcIixcclxuICAgIFwiaW5wdXRcIixcclxuICAgIFwiaW5zXCIsXHJcbiAgICBcImtiZFwiLFxyXG4gICAgXCJsYWJlbFwiLFxyXG4gICAgXCJsZWdlbmRcIixcclxuICAgIFwibGlcIixcclxuICAgIFwibGlua1wiLFxyXG4gICAgXCJtYWluXCIsXHJcbiAgICBcIm1hcFwiLFxyXG4gICAgXCJtYXJrXCIsXHJcbiAgICBcIm1lbnVcIixcclxuICAgIFwibWV0YVwiLFxyXG4gICAgXCJtZXRlclwiLFxyXG4gICAgXCJuYXZcIixcclxuICAgIFwibm9zY3JpcHRcIixcclxuICAgIFwib2JqZWN0XCIsXHJcbiAgICBcIm9sXCIsXHJcbiAgICBcIm9wdGdyb3VwXCIsXHJcbiAgICBcIm9wdGlvblwiLFxyXG4gICAgXCJvdXRwdXRcIixcclxuICAgIFwicFwiLFxyXG4gICAgXCJwaWN0dXJlXCIsXHJcbiAgICBcInByZVwiLFxyXG4gICAgXCJwcm9ncmVzc1wiLFxyXG4gICAgXCJxXCIsXHJcbiAgICBcInJwXCIsXHJcbiAgICBcInJ0XCIsXHJcbiAgICBcInJ1YnlcIixcclxuICAgIFwic1wiLFxyXG4gICAgXCJzYW1wXCIsXHJcbiAgICBcInNjcmlwdFwiLFxyXG4gICAgXCJzZWN0aW9uXCIsXHJcbiAgICBcInNlbGVjdFwiLFxyXG4gICAgXCJzbG90XCIsXHJcbiAgICBcInNtYWxsXCIsXHJcbiAgICBcInNvdXJjZVwiLFxyXG4gICAgXCJzcGFuXCIsXHJcbiAgICBcInN0cm9uZ1wiLFxyXG4gICAgXCJzdHlsZVwiLFxyXG4gICAgXCJzdWJcIixcclxuICAgIFwic3VtbWFyeVwiLFxyXG4gICAgXCJzdXBcIixcclxuICAgIFwidGFibGVcIixcclxuICAgIFwidGJvZHlcIixcclxuICAgIFwidGRcIixcclxuICAgIFwidGVtcGxhdGVcIixcclxuICAgIFwidGV4dGFyZWFcIixcclxuICAgIFwidGZvb3RcIixcclxuICAgIFwidGhcIixcclxuICAgIFwidGhlYWRcIixcclxuICAgIFwidGltZVwiLFxyXG4gICAgXCJ0aXRsZVwiLFxyXG4gICAgXCJ0clwiLFxyXG4gICAgXCJ0cmFja1wiLFxyXG4gICAgXCJ1XCIsXHJcbiAgICBcInVsXCIsXHJcbiAgICBcInZhclwiLFxyXG4gICAgXCJ2aWRlb1wiLFxyXG4gICAgXCJ3YnJcIixcclxuXTtcclxuY29uc3QgWFVMRWxlbWVudFRhZ05hbWVzID0gW1xyXG4gICAgXCJhY3Rpb25cIixcclxuICAgIFwiYXJyb3dzY3JvbGxib3hcIixcclxuICAgIFwiYmJveFwiLFxyXG4gICAgXCJiaW5kaW5nXCIsXHJcbiAgICBcImJpbmRpbmdzXCIsXHJcbiAgICBcImJveFwiLFxyXG4gICAgXCJicm9hZGNhc3RlclwiLFxyXG4gICAgXCJicm9hZGNhc3RlcnNldFwiLFxyXG4gICAgXCJidXR0b25cIixcclxuICAgIFwiYnJvd3NlclwiLFxyXG4gICAgXCJjaGVja2JveFwiLFxyXG4gICAgXCJjYXB0aW9uXCIsXHJcbiAgICBcImNvbG9ycGlja2VyXCIsXHJcbiAgICBcImNvbHVtblwiLFxyXG4gICAgXCJjb2x1bW5zXCIsXHJcbiAgICBcImNvbW1hbmRzZXRcIixcclxuICAgIFwiY29tbWFuZFwiLFxyXG4gICAgXCJjb25kaXRpb25zXCIsXHJcbiAgICBcImNvbnRlbnRcIixcclxuICAgIFwiZGVja1wiLFxyXG4gICAgXCJkZXNjcmlwdGlvblwiLFxyXG4gICAgXCJkaWFsb2dcIixcclxuICAgIFwiZGlhbG9naGVhZGVyXCIsXHJcbiAgICBcImVkaXRvclwiLFxyXG4gICAgXCJncmlkXCIsXHJcbiAgICBcImdyaXBweVwiLFxyXG4gICAgXCJncm91cGJveFwiLFxyXG4gICAgXCJoYm94XCIsXHJcbiAgICBcImlmcmFtZVwiLFxyXG4gICAgXCJpbWFnZVwiLFxyXG4gICAgXCJrZXlcIixcclxuICAgIFwia2V5c2V0XCIsXHJcbiAgICBcImxhYmVsXCIsXHJcbiAgICBcImxpc3Rib3hcIixcclxuICAgIFwibGlzdGNlbGxcIixcclxuICAgIFwibGlzdGNvbFwiLFxyXG4gICAgXCJsaXN0Y29sc1wiLFxyXG4gICAgXCJsaXN0aGVhZFwiLFxyXG4gICAgXCJsaXN0aGVhZGVyXCIsXHJcbiAgICBcImxpc3RpdGVtXCIsXHJcbiAgICBcIm1lbWJlclwiLFxyXG4gICAgXCJtZW51XCIsXHJcbiAgICBcIm1lbnViYXJcIixcclxuICAgIFwibWVudWl0ZW1cIixcclxuICAgIFwibWVudWxpc3RcIixcclxuICAgIFwibWVudXBvcHVwXCIsXHJcbiAgICBcIm1lbnVzZXBhcmF0b3JcIixcclxuICAgIFwib2JzZXJ2ZXNcIixcclxuICAgIFwib3ZlcmxheVwiLFxyXG4gICAgXCJwYWdlXCIsXHJcbiAgICBcInBvcHVwXCIsXHJcbiAgICBcInBvcHVwc2V0XCIsXHJcbiAgICBcInByZWZlcmVuY2VcIixcclxuICAgIFwicHJlZmVyZW5jZXNcIixcclxuICAgIFwicHJlZnBhbmVcIixcclxuICAgIFwicHJlZndpbmRvd1wiLFxyXG4gICAgXCJwcm9ncmVzc21ldGVyXCIsXHJcbiAgICBcInJhZGlvXCIsXHJcbiAgICBcInJhZGlvZ3JvdXBcIixcclxuICAgIFwicmVzaXplclwiLFxyXG4gICAgXCJyaWNobGlzdGJveFwiLFxyXG4gICAgXCJyaWNobGlzdGl0ZW1cIixcclxuICAgIFwicm93XCIsXHJcbiAgICBcInJvd3NcIixcclxuICAgIFwicnVsZVwiLFxyXG4gICAgXCJzY3JpcHRcIixcclxuICAgIFwic2Nyb2xsYmFyXCIsXHJcbiAgICBcInNjcm9sbGJveFwiLFxyXG4gICAgXCJzY3JvbGxjb3JuZXJcIixcclxuICAgIFwic2VwYXJhdG9yXCIsXHJcbiAgICBcInNwYWNlclwiLFxyXG4gICAgXCJzcGxpdHRlclwiLFxyXG4gICAgXCJzdGFja1wiLFxyXG4gICAgXCJzdGF0dXNiYXJcIixcclxuICAgIFwic3RhdHVzYmFycGFuZWxcIixcclxuICAgIFwic3RyaW5nYnVuZGxlXCIsXHJcbiAgICBcInN0cmluZ2J1bmRsZXNldFwiLFxyXG4gICAgXCJ0YWJcIixcclxuICAgIFwidGFiYnJvd3NlclwiLFxyXG4gICAgXCJ0YWJib3hcIixcclxuICAgIFwidGFicGFuZWxcIixcclxuICAgIFwidGFicGFuZWxzXCIsXHJcbiAgICBcInRhYnNcIixcclxuICAgIFwidGVtcGxhdGVcIixcclxuICAgIFwidGV4dG5vZGVcIixcclxuICAgIFwidGV4dGJveFwiLFxyXG4gICAgXCJ0aXRsZWJhclwiLFxyXG4gICAgXCJ0b29sYmFyXCIsXHJcbiAgICBcInRvb2xiYXJidXR0b25cIixcclxuICAgIFwidG9vbGJhcmdyaXBweVwiLFxyXG4gICAgXCJ0b29sYmFyaXRlbVwiLFxyXG4gICAgXCJ0b29sYmFycGFsZXR0ZVwiLFxyXG4gICAgXCJ0b29sYmFyc2VwYXJhdG9yXCIsXHJcbiAgICBcInRvb2xiYXJzZXRcIixcclxuICAgIFwidG9vbGJhcnNwYWNlclwiLFxyXG4gICAgXCJ0b29sYmFyc3ByaW5nXCIsXHJcbiAgICBcInRvb2xib3hcIixcclxuICAgIFwidG9vbHRpcFwiLFxyXG4gICAgXCJ0cmVlXCIsXHJcbiAgICBcInRyZWVjZWxsXCIsXHJcbiAgICBcInRyZWVjaGlsZHJlblwiLFxyXG4gICAgXCJ0cmVlY29sXCIsXHJcbiAgICBcInRyZWVjb2xzXCIsXHJcbiAgICBcInRyZWVpdGVtXCIsXHJcbiAgICBcInRyZWVyb3dcIixcclxuICAgIFwidHJlZXNlcGFyYXRvclwiLFxyXG4gICAgXCJ0cmlwbGVcIixcclxuICAgIFwidmJveFwiLFxyXG4gICAgXCJ3aW5kb3dcIixcclxuICAgIFwid2l6YXJkXCIsXHJcbiAgICBcIndpemFyZHBhZ2VcIixcclxuXTtcclxuY29uc3QgU1ZHRWxlbWVudFRhZ05hbWVzID0gW1xyXG4gICAgXCJhXCIsXHJcbiAgICBcImFuaW1hdGVcIixcclxuICAgIFwiYW5pbWF0ZU1vdGlvblwiLFxyXG4gICAgXCJhbmltYXRlVHJhbnNmb3JtXCIsXHJcbiAgICBcImNpcmNsZVwiLFxyXG4gICAgXCJjbGlwUGF0aFwiLFxyXG4gICAgXCJkZWZzXCIsXHJcbiAgICBcImRlc2NcIixcclxuICAgIFwiZWxsaXBzZVwiLFxyXG4gICAgXCJmZUJsZW5kXCIsXHJcbiAgICBcImZlQ29sb3JNYXRyaXhcIixcclxuICAgIFwiZmVDb21wb25lbnRUcmFuc2ZlclwiLFxyXG4gICAgXCJmZUNvbXBvc2l0ZVwiLFxyXG4gICAgXCJmZUNvbnZvbHZlTWF0cml4XCIsXHJcbiAgICBcImZlRGlmZnVzZUxpZ2h0aW5nXCIsXHJcbiAgICBcImZlRGlzcGxhY2VtZW50TWFwXCIsXHJcbiAgICBcImZlRGlzdGFudExpZ2h0XCIsXHJcbiAgICBcImZlRHJvcFNoYWRvd1wiLFxyXG4gICAgXCJmZUZsb29kXCIsXHJcbiAgICBcImZlRnVuY0FcIixcclxuICAgIFwiZmVGdW5jQlwiLFxyXG4gICAgXCJmZUZ1bmNHXCIsXHJcbiAgICBcImZlRnVuY1JcIixcclxuICAgIFwiZmVHYXVzc2lhbkJsdXJcIixcclxuICAgIFwiZmVJbWFnZVwiLFxyXG4gICAgXCJmZU1lcmdlXCIsXHJcbiAgICBcImZlTWVyZ2VOb2RlXCIsXHJcbiAgICBcImZlTW9ycGhvbG9neVwiLFxyXG4gICAgXCJmZU9mZnNldFwiLFxyXG4gICAgXCJmZVBvaW50TGlnaHRcIixcclxuICAgIFwiZmVTcGVjdWxhckxpZ2h0aW5nXCIsXHJcbiAgICBcImZlU3BvdExpZ2h0XCIsXHJcbiAgICBcImZlVGlsZVwiLFxyXG4gICAgXCJmZVR1cmJ1bGVuY2VcIixcclxuICAgIFwiZmlsdGVyXCIsXHJcbiAgICBcImZvcmVpZ25PYmplY3RcIixcclxuICAgIFwiZ1wiLFxyXG4gICAgXCJpbWFnZVwiLFxyXG4gICAgXCJsaW5lXCIsXHJcbiAgICBcImxpbmVhckdyYWRpZW50XCIsXHJcbiAgICBcIm1hcmtlclwiLFxyXG4gICAgXCJtYXNrXCIsXHJcbiAgICBcIm1ldGFkYXRhXCIsXHJcbiAgICBcIm1wYXRoXCIsXHJcbiAgICBcInBhdGhcIixcclxuICAgIFwicGF0dGVyblwiLFxyXG4gICAgXCJwb2x5Z29uXCIsXHJcbiAgICBcInBvbHlsaW5lXCIsXHJcbiAgICBcInJhZGlhbEdyYWRpZW50XCIsXHJcbiAgICBcInJlY3RcIixcclxuICAgIFwic2NyaXB0XCIsXHJcbiAgICBcInNldFwiLFxyXG4gICAgXCJzdG9wXCIsXHJcbiAgICBcInN0eWxlXCIsXHJcbiAgICBcInN2Z1wiLFxyXG4gICAgXCJzd2l0Y2hcIixcclxuICAgIFwic3ltYm9sXCIsXHJcbiAgICBcInRleHRcIixcclxuICAgIFwidGV4dFBhdGhcIixcclxuICAgIFwidGl0bGVcIixcclxuICAgIFwidHNwYW5cIixcclxuICAgIFwidXNlXCIsXHJcbiAgICBcInZpZXdcIixcclxuXTtcclxuLyogY3NwZWxsOmVuYWJsZSAqL1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD11aS5qcy5tYXAiLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy53YWl0VW50aWwgPSB3YWl0VW50aWw7XHJcbmV4cG9ydHMud2FpdFV0aWxBc3luYyA9IHdhaXRVdGlsQXN5bmM7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbmNvbnN0IGJhc2ljVG9vbCA9IG5ldyBiYXNpY18xLkJhc2ljVG9vbCgpO1xyXG5mdW5jdGlvbiB3YWl0VW50aWwoY29uZGl0aW9uLCBjYWxsYmFjaywgaW50ZXJ2YWwgPSAxMDAsIHRpbWVvdXQgPSAxMDAwMCkge1xyXG4gICAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgaW50ZXJ2YWxJZCA9IGJhc2ljVG9vbC5nZXRHbG9iYWwoXCJzZXRJbnRlcnZhbFwiKSgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGNvbmRpdGlvbigpKSB7XHJcbiAgICAgICAgICAgIGJhc2ljVG9vbC5nZXRHbG9iYWwoXCJjbGVhckludGVydmFsXCIpKGludGVydmFsSWQpO1xyXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChEYXRlLm5vdygpIC0gc3RhcnQgPiB0aW1lb3V0KSB7XHJcbiAgICAgICAgICAgIGJhc2ljVG9vbC5nZXRHbG9iYWwoXCJjbGVhckludGVydmFsXCIpKGludGVydmFsSWQpO1xyXG4gICAgICAgIH1cclxuICAgIH0sIGludGVydmFsKTtcclxufVxyXG5mdW5jdGlvbiB3YWl0VXRpbEFzeW5jKGNvbmRpdGlvbiwgaW50ZXJ2YWwgPSAxMDAsIHRpbWVvdXQgPSAxMDAwMCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XHJcbiAgICAgICAgY29uc3QgaW50ZXJ2YWxJZCA9IGJhc2ljVG9vbC5nZXRHbG9iYWwoXCJzZXRJbnRlcnZhbFwiKSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjb25kaXRpb24oKSkge1xyXG4gICAgICAgICAgICAgICAgYmFzaWNUb29sLmdldEdsb2JhbChcImNsZWFySW50ZXJ2YWxcIikoaW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoRGF0ZS5ub3coKSAtIHN0YXJ0ID4gdGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgYmFzaWNUb29sLmdldEdsb2JhbChcImNsZWFySW50ZXJ2YWxcIikoaW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGludGVydmFsKTtcclxuICAgIH0pO1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdhaXQuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuUmVhZGVyVG9vbCA9IHZvaWQgMDtcclxuY29uc3QgYmFzaWNfMSA9IHJlcXVpcmUoXCIuLi9iYXNpY1wiKTtcclxuY29uc3Qgd2FpdF8xID0gcmVxdWlyZShcIi4uL3V0aWxzL3dhaXRcIik7XHJcbi8qKlxyXG4gKiBab3Rlcm8gUmVhZGVySW5zdGFuY2UgQVBJcy5cclxuICovXHJcbmNsYXNzIFJlYWRlclRvb2wgZXh0ZW5kcyBiYXNpY18xLkJhc2ljVG9vbCB7XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgc2VsZWN0ZWQgdGFiIHJlYWRlci5cclxuICAgICAqIEBwYXJhbSB3YWl0VGltZSBXYWl0IGZvciBuIE1TIHVudGlsIHRoZSByZWFkZXIgaXMgcmVhZHlcclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0UmVhZGVyKHdhaXRUaW1lID0gNTAwMCkge1xyXG4gICAgICAgIGNvbnN0IFpvdGVyb19UYWJzID0gdGhpcy5nZXRHbG9iYWwoXCJab3Rlcm9fVGFic1wiKTtcclxuICAgICAgICBpZiAoWm90ZXJvX1RhYnMuc2VsZWN0ZWRUeXBlICE9PSBcInJlYWRlclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZWFkZXIgPSBab3Rlcm8uUmVhZGVyLmdldEJ5VGFiSUQoWm90ZXJvX1RhYnMuc2VsZWN0ZWRJRCk7XHJcbiAgICAgICAgbGV0IGRlbGF5Q291bnQgPSAwO1xyXG4gICAgICAgIGNvbnN0IGNoZWNrUGVyaW9kID0gNTA7XHJcbiAgICAgICAgd2hpbGUgKCFyZWFkZXIgJiYgZGVsYXlDb3VudCAqIGNoZWNrUGVyaW9kIDwgd2FpdFRpbWUpIHtcclxuICAgICAgICAgICAgYXdhaXQgWm90ZXJvLlByb21pc2UuZGVsYXkoY2hlY2tQZXJpb2QpO1xyXG4gICAgICAgICAgICByZWFkZXIgPSBab3Rlcm8uUmVhZGVyLmdldEJ5VGFiSUQoWm90ZXJvX1RhYnMuc2VsZWN0ZWRJRCk7XHJcbiAgICAgICAgICAgIGRlbGF5Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgKHJlYWRlciA9PT0gbnVsbCB8fCByZWFkZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlYWRlci5faW5pdFByb21pc2UpO1xyXG4gICAgICAgIHJldHVybiByZWFkZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgd2luZG93IHJlYWRlcnMuXHJcbiAgICAgKi9cclxuICAgIGdldFdpbmRvd1JlYWRlcigpIHtcclxuICAgICAgICBjb25zdCBab3Rlcm9fVGFicyA9IHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvX1RhYnNcIik7XHJcbiAgICAgICAgbGV0IHdpbmRvd1JlYWRlcnMgPSBbXTtcclxuICAgICAgICBsZXQgdGFicyA9IFpvdGVyb19UYWJzLl90YWJzLm1hcCgoZSkgPT4gZS5pZCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBab3Rlcm8uUmVhZGVyLl9yZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBmbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGFicy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKFpvdGVyby5SZWFkZXIuX3JlYWRlcnNbaV0udGFiSUQgPT0gdGFic1tqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghZmxhZykge1xyXG4gICAgICAgICAgICAgICAgd2luZG93UmVhZGVycy5wdXNoKFpvdGVyby5SZWFkZXIuX3JlYWRlcnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB3aW5kb3dSZWFkZXJzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgUmVhZGVyIHRhYnBhbmVsIGRlY2sgZWxlbWVudC5cclxuICAgICAqIEBkZXByZWNhdGVkIC0gdXNlIGl0ZW0gcGFuZSBhcGlcclxuICAgICAqIEBhbHBoYVxyXG4gICAgICovXHJcbiAgICBnZXRSZWFkZXJUYWJQYW5lbERlY2soKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGNvbnN0IGRlY2sgPSAoX2EgPSB0aGlzLmdldEdsb2JhbChcIndpbmRvd1wiKS5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5vdGVzLXBhbmUtZGVja1wiKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgcmV0dXJuIGRlY2s7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHJlYWRlciB0YWJwYW5lbCBkZWNrIHNlbGVjdGlvbiBjaGFuZ2Ugb2JzZXJ2ZXIuXHJcbiAgICAgKiBAZGVwcmVjYXRlZCAtIHVzZSBpdGVtIHBhbmUgYXBpXHJcbiAgICAgKiBAYWxwaGFcclxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xyXG4gICAgICovXHJcbiAgICBhc3luYyBhZGRSZWFkZXJUYWJQYW5lbERlY2tPYnNlcnZlcihjYWxsYmFjaykge1xyXG4gICAgICAgIGF3YWl0ICgwLCB3YWl0XzEud2FpdFV0aWxBc3luYykoKCkgPT4gISF0aGlzLmdldFJlYWRlclRhYlBhbmVsRGVjaygpKTtcclxuICAgICAgICBjb25zdCBkZWNrID0gdGhpcy5nZXRSZWFkZXJUYWJQYW5lbERlY2soKTtcclxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyAodGhpcy5nZXRHbG9iYWwoXCJNdXRhdGlvbk9ic2VydmVyXCIpKShhc3luYyAobXV0YXRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKGFzeW5jIChtdXRhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gbXV0YXRpb24udGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgdGFiYm94IGlzIHJlYWR5LCB0aGUgc2VsZWN0ZWRJbmRleCBvZiB0YWJib3ggaXMgY2hhbmdlZC5cclxuICAgICAgICAgICAgICAgIC8vIFdoZW4gcmVhZGVyIHRhYiBpcyBjaGFuZ2VkLCB0aGUgc2VsZWN0ZWRJbmRleCBvZiBkZWNrIGlzIGNoYW5nZWQuXHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInpvdGVyby12aWV3LXRhYmJveFwiKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC50YWdOYW1lID09PSBcImRlY2tcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZGVjaywge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcInNlbGVjdGVkSW5kZXhcIl0sXHJcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHNlbGVjdGVkIGFubm90YXRpb24gZGF0YS5cclxuICAgICAqIEBwYXJhbSByZWFkZXIgVGFyZ2V0IHJlYWRlclxyXG4gICAgICogQHJldHVybnMgVGhlIHNlbGVjdGVkIGFubm90YXRpb24gZGF0YS5cclxuICAgICAqL1xyXG4gICAgZ2V0U2VsZWN0ZWRBbm5vdGF0aW9uRGF0YShyZWFkZXIpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgY29uc3QgYW5ub3RhdGlvbiA9IFxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAoX2EgPSByZWFkZXIgPT09IG51bGwgfHwgcmVhZGVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZWFkZXIuX2ludGVybmFsUmVhZGVyLl9sYXN0Vmlldy5fc2VsZWN0aW9uUG9wdXApID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hbm5vdGF0aW9uO1xyXG4gICAgICAgIHJldHVybiBhbm5vdGF0aW9uO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHRleHQgc2VsZWN0aW9uIG9mIHJlYWRlci5cclxuICAgICAqIEBwYXJhbSByZWFkZXIgVGFyZ2V0IHJlYWRlclxyXG4gICAgICogQHJldHVybnMgVGhlIHRleHQgc2VsZWN0aW9uIG9mIHJlYWRlci5cclxuICAgICAqL1xyXG4gICAgZ2V0U2VsZWN0ZWRUZXh0KHJlYWRlcikge1xyXG4gICAgICAgIHZhciBfYSwgX2I7XHJcbiAgICAgICAgcmV0dXJuIChfYiA9IChfYSA9IHRoaXMuZ2V0U2VsZWN0ZWRBbm5vdGF0aW9uRGF0YShyZWFkZXIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudGV4dCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogXCJcIjtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlJlYWRlclRvb2wgPSBSZWFkZXJUb29sO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWFkZXIuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuRXh0cmFGaWVsZFRvb2wgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbi8qKlxyXG4gKiBHZXQvc2V0IGV4dHJhIGZpZWxkIEFQSXMuXHJcbiAqL1xyXG5jbGFzcyBFeHRyYUZpZWxkVG9vbCBleHRlbmRzIGJhc2ljXzEuQmFzaWNUb29sIHtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFsbCBleHRyYSBmaWVsZHNcclxuICAgICAqIEBwYXJhbSBpdGVtXHJcbiAgICAgKi9cclxuICAgIGdldEV4dHJhRmllbGRzKGl0ZW0sIGJhY2tlbmQgPSBcImN1c3RvbVwiKSB7XHJcbiAgICAgICAgY29uc3QgZXh0cmFGaWxlZFJhdyA9IGl0ZW0uZ2V0RmllbGQoXCJleHRyYVwiKTtcclxuICAgICAgICBpZiAoYmFja2VuZCA9PT0gXCJkZWZhdWx0XCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpLlV0aWxpdGllcy5JbnRlcm5hbC5leHRyYWN0RXh0cmFGaWVsZHMoZXh0cmFGaWxlZFJhdykuZmllbGRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgICAgICBjb25zdCBub25TdGFuZGFyZEZpZWxkcyA9IFtdO1xyXG4gICAgICAgICAgICBleHRyYUZpbGVkUmF3LnNwbGl0KFwiXFxuXCIpLmZvckVhY2goKGxpbmUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNwbGl0ID0gbGluZS5zcGxpdChcIjogXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+PSAyICYmIHNwbGl0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNldChzcGxpdFswXSwgc3BsaXQuc2xpY2UoMSkuam9pbihcIjogXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vblN0YW5kYXJkRmllbGRzLnB1c2gobGluZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtYXAuc2V0KFwiX19ub25TdGFuZGFyZF9fXCIsIG5vblN0YW5kYXJkRmllbGRzLmpvaW4oXCJcXG5cIikpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWFwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGV4dHJhIGZpZWxkIHZhbHVlIGJ5IGtleS4gSWYgaXQgZG9lcyBub3QgZXhpc3RzLCByZXR1cm4gdW5kZWZpbmVkLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqIEBwYXJhbSBrZXlcclxuICAgICAqL1xyXG4gICAgZ2V0RXh0cmFGaWVsZChpdGVtLCBrZXkpIHtcclxuICAgICAgICBjb25zdCBmaWVsZHMgPSB0aGlzLmdldEV4dHJhRmllbGRzKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiBmaWVsZHMuZ2V0KGtleSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlcGxhY2UgZXh0cmEgZmllbGQgb2YgYW4gaXRlbS5cclxuICAgICAqIEBwYXJhbSBpdGVtXHJcbiAgICAgKiBAcGFyYW0gZmllbGRzXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlcGxhY2VFeHRyYUZpZWxkcyhpdGVtLCBmaWVsZHMpIHtcclxuICAgICAgICBsZXQga3ZzID0gW107XHJcbiAgICAgICAgaWYgKGZpZWxkcy5oYXMoXCJfX25vblN0YW5kYXJkX19cIikpIHtcclxuICAgICAgICAgICAga3ZzLnB1c2goZmllbGRzLmdldChcIl9fbm9uU3RhbmRhcmRfX1wiKSk7XHJcbiAgICAgICAgICAgIGZpZWxkcy5kZWxldGUoXCJfX25vblN0YW5kYXJkX19cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKCh2LCBrKSA9PiB7XHJcbiAgICAgICAgICAgIGt2cy5wdXNoKGAke2t9OiAke3Z9YCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXRlbS5zZXRGaWVsZChcImV4dHJhXCIsIGt2cy5qb2luKFwiXFxuXCIpKTtcclxuICAgICAgICBhd2FpdCBpdGVtLnNhdmVUeCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYW4ga2V5LXZhbHVlIHBhaXIgdG8gdGhlIGl0ZW0ncyBleHRyYSBmaWVsZFxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqIEBwYXJhbSBrZXlcclxuICAgICAqIEBwYXJhbSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBhc3luYyBzZXRFeHRyYUZpZWxkKGl0ZW0sIGtleSwgdmFsdWUpIHtcclxuICAgICAgICBjb25zdCBmaWVsZHMgPSB0aGlzLmdldEV4dHJhRmllbGRzKGl0ZW0pO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgZmllbGRzLmRlbGV0ZShrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZmllbGRzLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZXBsYWNlRXh0cmFGaWVsZHMoaXRlbSwgZmllbGRzKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkV4dHJhRmllbGRUb29sID0gRXh0cmFGaWVsZFRvb2w7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4dHJhRmllbGQuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuUGF0Y2hIZWxwZXIgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbmNsYXNzIFBhdGNoSGVscGVyIGV4dGVuZHMgYmFzaWNfMS5CYXNpY1Rvb2wge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBzZXREYXRhKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIGNvbnN0IFpvdGVybyA9IHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpO1xyXG4gICAgICAgIGNvbnN0IHsgdGFyZ2V0LCBmdW5jU2lnbiwgcGF0Y2hlciB9ID0gb3B0aW9ucztcclxuICAgICAgICBjb25zdCBvcmlnaW4gPSB0YXJnZXRbZnVuY1NpZ25dO1xyXG4gICAgICAgIHRoaXMubG9nKFwicGF0Y2hpbmcgXCIsIGZ1bmNTaWduKTtcclxuICAgICAgICB0YXJnZXRbZnVuY1NpZ25dID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlZClcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGNoZXIob3JpZ2luKS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgWm90ZXJvLmxvZ0Vycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBlbmFibGUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHBhdGNoIGRhdGEgc2V0XCIpO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpc2FibGUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHBhdGNoIGRhdGEgc2V0XCIpO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5QYXRjaEhlbHBlciA9IFBhdGNoSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXRjaC5qcy5tYXAiLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5GaWVsZEhvb2tNYW5hZ2VyID0gdm9pZCAwO1xyXG5jb25zdCBwYXRjaF8xID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvcGF0Y2hcIik7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbi8qKlxyXG4gKiBJdGVtIGZpZWxkIGhvb2tzIG1hbmFnZXIuXHJcbiAqL1xyXG5jbGFzcyBGaWVsZEhvb2tNYW5hZ2VyIGV4dGVuZHMgYmFzaWNfMS5NYW5hZ2VyVG9vbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlKSB7XHJcbiAgICAgICAgc3VwZXIoYmFzZSk7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICBnZXRGaWVsZDoge30sXHJcbiAgICAgICAgICAgIHNldEZpZWxkOiB7fSxcclxuICAgICAgICAgICAgaXNGaWVsZE9mQmFzZToge30sXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnBhdGNoSGVscGVycyA9IHtcclxuICAgICAgICAgICAgZ2V0RmllbGQ6IG5ldyBwYXRjaF8xLlBhdGNoSGVscGVyKCksXHJcbiAgICAgICAgICAgIHNldEZpZWxkOiBuZXcgcGF0Y2hfMS5QYXRjaEhlbHBlcigpLFxyXG4gICAgICAgICAgICBpc0ZpZWxkT2ZCYXNlOiBuZXcgcGF0Y2hfMS5QYXRjaEhlbHBlcigpLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgX3RoaXNIZWxwZXIgPSB0aGlzO1xyXG4gICAgICAgIGZvciAoY29uc3QgdHlwZSBvZiBPYmplY3Qua2V5cyh0aGlzLnBhdGNoSGVscGVycykpIHtcclxuICAgICAgICAgICAgY29uc3QgaGVscGVyID0gdGhpcy5wYXRjaEhlbHBlcnNbdHlwZV07XHJcbiAgICAgICAgICAgIGhlbHBlci5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5nZXRHbG9iYWwoXCJab3Rlcm9cIikuSXRlbS5wcm90b3R5cGUsXHJcbiAgICAgICAgICAgICAgICBmdW5jU2lnbjogdHlwZSxcclxuICAgICAgICAgICAgICAgIHBhdGNoZXI6IChvcmlnaW5hbCkgPT4gZnVuY3Rpb24gKGZpZWxkLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsVGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IF90aGlzSGVscGVyLmRhdGFbdHlwZV1bZmllbGRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcihmaWVsZCwgYXJnc1swXSwgYXJnc1sxXSwgb3JpZ2luYWxUaGlzLCBvcmlnaW5hbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZCArIFN0cmluZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsLmFwcGx5KG9yaWdpbmFsVGhpcywgW2ZpZWxkLCAuLi5hcmdzXSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXIodHlwZSwgZmllbGQsIGhvb2spIHtcclxuICAgICAgICB0aGlzLmRhdGFbdHlwZV1bZmllbGRdID0gaG9vaztcclxuICAgIH1cclxuICAgIHVucmVnaXN0ZXIodHlwZSwgZmllbGQpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5kYXRhW3R5cGVdW2ZpZWxkXTtcclxuICAgIH1cclxuICAgIHVucmVnaXN0ZXJBbGwoKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLmdldEZpZWxkID0ge307XHJcbiAgICAgICAgdGhpcy5kYXRhLnNldEZpZWxkID0ge307XHJcbiAgICAgICAgdGhpcy5kYXRhLmlzRmllbGRPZkJhc2UgPSB7fTtcclxuICAgICAgICB0aGlzLnBhdGNoSGVscGVycy5nZXRGaWVsZC5kaXNhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5wYXRjaEhlbHBlcnMuc2V0RmllbGQuZGlzYWJsZSgpO1xyXG4gICAgICAgIHRoaXMucGF0Y2hIZWxwZXJzLmlzRmllbGRPZkJhc2UuZGlzYWJsZSgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRmllbGRIb29rTWFuYWdlciA9IEZpZWxkSG9va01hbmFnZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpZWxkSG9vay5qcy5tYXAiLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5QYXRjaGVyTWFuYWdlciA9IHZvaWQgMDtcclxuY29uc3QgYmFzaWNfMSA9IHJlcXVpcmUoXCIuLi9iYXNpY1wiKTtcclxuLyoqXHJcbiAqIE1hbmFnZSBhbGwgbW9ua2V5IHBhdGNoaW5nIGZ1bmN0aW9ucy5cclxuICogQGRlcHJlY2F0ZWQgVXNlIHtAbGluayBQYXRjaEhlbHBlcn0gaW5zdGVhZC5cclxuICovXHJcbmNsYXNzIFBhdGNoZXJNYW5hZ2VyIGV4dGVuZHMgYmFzaWNfMS5NYW5hZ2VyVG9vbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlKSB7XHJcbiAgICAgICAgc3VwZXIoYmFzZSk7XHJcbiAgICAgICAgLy8gcmVjb3JkIHdldGhlciBhIHBhdGNoZXIgaXMgYWxpdmUgb3Igbm90XHJcbiAgICAgICAgdGhpcy5wYXRjaGVySURNYXAgPSBuZXcgTWFwKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFBhdGNoIGEgZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSBvYmplY3QgVGhlIG93bmVyIG9mIHRoZSBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIGZ1bmNTaWduIFRoZSBzaWduYXR1cmUgb2YgdGhlIGZ1bmN0aW9uKGZ1bmN0aW9uIG5hbWUpXHJcbiAgICAgKiBAcGFyYW0gcGF0Y2hlciBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbmV3IHdyYXBwZXIgb2YgdGhlIHBhdGNoZWQgZnVuY3Rpb25cclxuICAgICAqIEByZXR1cm5zIEEgdW5pcXVlIElEIG9mIHRoZSBwYXRjaGVyLCB3aGljaCBjYW4gYmUgdXNlZCB0byB1bnJlZ2lzdGVyIHRoZSBwYXRjaGVyXHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyKG9iamVjdCwgZnVuY1NpZ24sIHBhdGNoZXIpIHtcclxuICAgICAgICBjb25zdCBab3Rlcm8gPSB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKTtcclxuICAgICAgICBjb25zdCBwYXRjaElETWFwID0gdGhpcy5wYXRjaGVySURNYXA7XHJcbiAgICAgICAgbGV0IGlkID0gWm90ZXJvLnJhbmRvbVN0cmluZygpO1xyXG4gICAgICAgIHdoaWxlIChwYXRjaElETWFwLmhhcyhpZCkpIHtcclxuICAgICAgICAgICAgaWQgPSBab3Rlcm8ucmFuZG9tU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG9yaWdpbiA9IG9iamVjdFtmdW5jU2lnbl07XHJcbiAgICAgICAgcGF0Y2hJRE1hcC5zZXQoaWQsIHRydWUpO1xyXG4gICAgICAgIHRoaXMubG9nKFwicGF0Y2hpbmcgXCIsIGZ1bmNTaWduKTtcclxuICAgICAgICBvYmplY3RbZnVuY1NpZ25dID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHBhdGNoSURNYXAuZ2V0KGlkKSlcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGNoZXIob3JpZ2luKS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgWm90ZXJvLmxvZ0Vycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGEgcGF0Y2hlclxyXG4gICAgICogQHBhcmFtIHBhdGNoZXJJRCBUaGUgSUQgb2YgdGhlIHBhdGNoZXIgdG8gYmUgdW5yZWdpc3RlcmVkXHJcbiAgICAgKi9cclxuICAgIHVucmVnaXN0ZXIocGF0Y2hlcklEKSB7XHJcbiAgICAgICAgdGhpcy5wYXRjaGVySURNYXAuZGVsZXRlKHBhdGNoZXJJRCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVucmVnaXN0ZXIgYWxsIHBhdGNoZXJzXHJcbiAgICAgKi9cclxuICAgIHVucmVnaXN0ZXJBbGwoKSB7XHJcbiAgICAgICAgdGhpcy5wYXRjaGVySURNYXAuY2xlYXIoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlBhdGNoZXJNYW5hZ2VyID0gUGF0Y2hlck1hbmFnZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhdGNoLmpzLm1hcCIsICJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkl0ZW1UcmVlTWFuYWdlciA9IHZvaWQgMDtcclxuY29uc3QgYmFzaWNfMSA9IHJlcXVpcmUoXCIuLi9iYXNpY1wiKTtcclxuY29uc3QgZmllbGRIb29rXzEgPSByZXF1aXJlKFwiLi9maWVsZEhvb2tcIik7XHJcbmNvbnN0IHRvb2xraXRHbG9iYWxfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi90b29sa2l0R2xvYmFsXCIpKTtcclxuY29uc3QgcGF0Y2hfMSA9IHJlcXVpcmUoXCIuL3BhdGNoXCIpO1xyXG4vKipcclxuICogUmVnaXN0ZXIgY3VzdG9taXplZCBuZXcgY29sdW1ucyB0byB0aGUgbGlicmFyeSBpdGVtVHJlZS5cclxuICogQGRlcHJlY2F0ZWQgVXNlIGBab3Rlcm8uSXRlbVRyZWVNYW5hZ2VyLnJlZ2lzdGVyQ29sdW1uc2AgaW5zdGVhZC5cclxuICovXHJcbmNsYXNzIEl0ZW1UcmVlTWFuYWdlciBleHRlbmRzIGJhc2ljXzEuTWFuYWdlclRvb2wge1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIFpvdGVyby5fSXRlbVRyZWVFeHRyYUNvbHVtbnNHbG9iYWwgaWYgaXQgZG9lc24ndCBleGlzdC5cclxuICAgICAqXHJcbiAgICAgKiBOZXcgY29sdW1ucyBhbmQgaG9va3MgYXJlIHN0b3JlZCB0aGVyZS5cclxuICAgICAqXHJcbiAgICAgKiBUaGVuIHBhdGNoIGByZXF1aXJlKFwiem90ZXJvL2l0ZW1UcmVlXCIpLmdldENvbHVtbnNgIGFuZCBgWm90ZXJvLkl0ZW0uZ2V0RmllbGRgXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGJhc2UpIHtcclxuICAgICAgICBzdXBlcihiYXNlKTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRQZXJzaXN0ID0gW1xyXG4gICAgICAgICAgICBcIndpZHRoXCIsXHJcbiAgICAgICAgICAgIFwib3JkaW5hbFwiLFxyXG4gICAgICAgICAgICBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICBcInNvcnRBY3RpdmVcIixcclxuICAgICAgICAgICAgXCJzb3J0RGlyZWN0aW9uXCIsXHJcbiAgICAgICAgXTtcclxuICAgICAgICB0aGlzLmJhY2tlbmQgPSB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKS5JdGVtVHJlZU1hbmFnZXI7XHJcbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIHRoZXNlIHR3byBjYWNoZXNcclxuICAgICAgICB0aGlzLmxvY2FsQ29sdW1uQ2FjaGUgPSBbXTtcclxuICAgICAgICB0aGlzLmxvY2FsUmVuZGVyQ2VsbENhY2hlID0gW107XHJcbiAgICAgICAgdGhpcy5maWVsZEhvb2tzID0gbmV3IGZpZWxkSG9va18xLkZpZWxkSG9va01hbmFnZXIoYmFzZSk7XHJcbiAgICAgICAgdGhpcy5wYXRjaGVyTWFuYWdlciA9IG5ldyBwYXRjaF8xLlBhdGNoZXJNYW5hZ2VyKGJhc2UpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6YXRpb25Mb2NrID0gdGhpcy5nZXRHbG9iYWwoXCJab3Rlcm9cIikuUHJvbWlzZS5kZWZlcigpO1xyXG4gICAgICAgIGlmICghdGhpcy5iYWNrZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZUdsb2JhbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXphdGlvbkxvY2sucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVucmVnaXN0ZXJBbGwoKSB7XHJcbiAgICAgICAgLy8gU2tpcCBmaWVsZCBob29rIHVucmVnaXN0ZXIgYW5kIHVzZSBmaWVsZEhvb2tzLnVucmVnaXN0ZXJBbGxcclxuICAgICAgICAvLyB0byB1bnJlZ2lzdGVyIHRob3NlIGNyZWF0ZWQgYnkgdGhpcyBtYW5hZ2VyIG9ubHlcclxuICAgICAgICBbLi4udGhpcy5sb2NhbENvbHVtbkNhY2hlXS5mb3JFYWNoKChrZXkpID0+IHRoaXMudW5yZWdpc3RlcihrZXksIHsgc2tpcEdldEZpZWxkOiB0cnVlIH0pKTtcclxuICAgICAgICBbLi4udGhpcy5sb2NhbFJlbmRlckNlbGxDYWNoZV0uZm9yRWFjaCh0aGlzLnJlbW92ZVJlbmRlckNlbGxIb29rLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuZmllbGRIb29rcy51bnJlZ2lzdGVyQWxsKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGEgbmV3IGNvbHVtbi4gRG9uJ3QgZm9yZ2V0IHRvIGNhbGwgYHVucmVnaXN0ZXJgIG9uIHBsdWdpbiBleGl0LlxyXG4gICAgICogQHBhcmFtIGtleSBDb2x1bW4gZGF0YUtleVxyXG4gICAgICogQHBhcmFtIGxhYmVsIENvbHVtbiBkaXNwbGF5IGxhYmVsXHJcbiAgICAgKiBAcGFyYW0gZ2V0RmllbGRIb29rIENhbGxlZCB3aGVuIGxvYWRpbmcgY2VsbCBjb250ZW50LlxyXG4gICAgICogSWYgeW91IHJlZ2lzdGVyZWQgdGhlIGdldEZpZWxkIGhvb2sgc29tZXdoZXJlIGVsc2UgKGluIEl0ZW1Cb3ggb3IgRmllbGRIb29rcyksIGxlYXZlIGl0IHVuZGVmaW5lZC5cclxuICAgICAqIEBwYXJhbSBvcHRpb25zIFNlZSB6b3Rlcm8gc291cmNlIGNvZGU6Y2hyb21lL2NvbnRlbnQvem90ZXJvL2l0ZW1UcmVlQ29sdW1ucy5qc3hcclxuICAgICAqIEBwYXJhbSBvcHRpb25zLnJlbmRlckNlbGxIb29rIENhbGxlZCB3aGVuIHJlbmRlcmluZyBjZWxsLiBUaGlzIHdpbGwgb3ZlcnJpZGVcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGNvbnN0IGl0ZW1UcmVlID0gbmV3IEl0ZW1UcmVlVG9vbCgpO1xyXG4gICAgICogYXdhaXQgaXRlbVRyZWUucmVnaXN0ZXIoXHJcbiAgICAgKiAgIFwidGVzdFwiLFxyXG4gICAgICogICBcIm5ldyBjb2x1bW5cIixcclxuICAgICAqICAgKFxyXG4gICAgICogICAgIGZpZWxkOiBzdHJpbmcsXHJcbiAgICAgKiAgICAgdW5mb3JtYXR0ZWQ6IGJvb2xlYW4sXHJcbiAgICAgKiAgICAgaW5jbHVkZUJhc2VNYXBwZWQ6IGJvb2xlYW4sXHJcbiAgICAgKiAgICAgaXRlbTogWm90ZXJvLkl0ZW1cclxuICAgICAqICAgKSA9PiB7XHJcbiAgICAgKiAgICAgcmV0dXJuIGZpZWxkICsgU3RyaW5nKGl0ZW0uaWQpO1xyXG4gICAgICogICB9LFxyXG4gICAgICogICB7XHJcbiAgICAgKiAgICAgaWNvblBhdGg6IFwiY2hyb21lOi8vem90ZXJvL3NraW4vY3Jvc3MucG5nXCIsXHJcbiAgICAgKiAgIH1cclxuICAgICAqICk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVnaXN0ZXIoa2V5LCBsYWJlbCwgZ2V0RmllbGRIb29rLCBvcHRpb25zID0ge1xyXG4gICAgICAgIHNob3dJbkNvbHVtblBpY2tlcjogdHJ1ZSxcclxuICAgIH0pIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgYXdhaXQgKChfYSA9IHRoaXMuaW5pdGlhbGl6YXRpb25Mb2NrKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucHJvbWlzZSk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJhY2tlbmQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsQ2FjaGUuY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgLm1hcCgoX2MpID0+IF9jLmRhdGFLZXkpXHJcbiAgICAgICAgICAgICAgICAuaW5jbHVkZXMoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYEl0ZW1UcmVlVG9vbDogJHtrZXl9IGlzIGFscmVhZHkgcmVnaXN0ZXJlZC5gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb2x1bW4gPSB7XHJcbiAgICAgICAgICAgIGRhdGFLZXk6IGtleSxcclxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxyXG4gICAgICAgICAgICBwbHVnaW5JRDogdGhpcy5fYmFzaWNPcHRpb25zLmFwaS5wbHVnaW5JRCxcclxuICAgICAgICAgICAgaWNvbkxhYmVsOiBvcHRpb25zLmljb25QYXRoXHJcbiAgICAgICAgICAgICAgICA/IHRoaXMuY3JlYXRlSWNvbkxhYmVsKHtcclxuICAgICAgICAgICAgICAgICAgICBpY29uUGF0aDogb3B0aW9ucy5pY29uUGF0aCxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBsYWJlbCxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgaWNvblBhdGg6IG9wdGlvbnMuaWNvblBhdGgsXHJcbiAgICAgICAgICAgIGh0bWxMYWJlbDogb3B0aW9ucy5odG1sTGFiZWwsXHJcbiAgICAgICAgICAgIHpvdGVyb1BlcnNpc3Q6IG9wdGlvbnMuem90ZXJvUGVyc2lzdCB8fFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuYmFja2VuZCA/IHRoaXMuZGVmYXVsdFBlcnNpc3QgOiBuZXcgU2V0KHRoaXMuZGVmYXVsdFBlcnNpc3QpKSxcclxuICAgICAgICAgICAgZGVmYXVsdEluOiBvcHRpb25zLmRlZmF1bHRJbixcclxuICAgICAgICAgICAgZGlzYWJsZWRJbjogb3B0aW9ucy5kaXNhYmxlZEluLFxyXG4gICAgICAgICAgICBlbmFibGVkVHJlZUlEczogb3B0aW9ucy5lbmFibGVkVHJlZUlEcyxcclxuICAgICAgICAgICAgZGVmYXVsdFNvcnQ6IG9wdGlvbnMuZGVmYXVsdFNvcnQsXHJcbiAgICAgICAgICAgIHNvcnRSZXZlcnNlOiBvcHRpb25zLnNvcnRSZXZlcnNlIHx8IG9wdGlvbnMuZGVmYXVsdFNvcnQgPT09IC0xLFxyXG4gICAgICAgICAgICBmbGV4OiB0eXBlb2Ygb3B0aW9ucy5mbGV4ID09PSBcInVuZGVmaW5lZFwiID8gMSA6IG9wdGlvbnMuZmxleCxcclxuICAgICAgICAgICAgd2lkdGg6IG9wdGlvbnMud2lkdGgsXHJcbiAgICAgICAgICAgIGZpeGVkV2lkdGg6IG9wdGlvbnMuZml4ZWRXaWR0aCxcclxuICAgICAgICAgICAgc3RhdGljV2lkdGg6IG9wdGlvbnMuc3RhdGljV2lkdGgsXHJcbiAgICAgICAgICAgIG1pbldpZHRoOiBvcHRpb25zLm1pbldpZHRoLFxyXG4gICAgICAgICAgICBpZ25vcmVJbkNvbHVtblBpY2tlcjogb3B0aW9ucy5pZ25vcmVJbkNvbHVtblBpY2tlcixcclxuICAgICAgICAgICAgc2hvd0luQ29sdW1uUGlja2VyOiB0eXBlb2Ygb3B0aW9ucy5pZ25vcmVJbkNvbHVtblBpY2tlciA9PT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICAgICAgPyB0cnVlXHJcbiAgICAgICAgICAgICAgICA6IG9wdGlvbnMuc2hvd0luQ29sdW1uUGlja2VyLFxyXG4gICAgICAgICAgICBzdWJtZW51OiBvcHRpb25zLnN1Ym1lbnUsXHJcbiAgICAgICAgICAgIGNvbHVtblBpY2tlclN1Yk1lbnU6IG9wdGlvbnMuY29sdW1uUGlja2VyU3ViTWVudSB8fCBvcHRpb25zLnN1Ym1lbnUsXHJcbiAgICAgICAgICAgIGRhdGFQcm92aWRlcjogb3B0aW9ucy5kYXRhUHJvdmlkZXIgfHxcclxuICAgICAgICAgICAgICAgICgoaXRlbSwgX2RhdGFLZXkpID0+IGl0ZW0uZ2V0RmllbGQoa2V5KSksXHJcbiAgICAgICAgICAgIHJlbmRlckNlbGw6IG9wdGlvbnMucmVuZGVyQ2VsbCB8fFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5yZW5kZXJDZWxsSG9vayxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChnZXRGaWVsZEhvb2spIHtcclxuICAgICAgICAgICAgdGhpcy5maWVsZEhvb2tzLnJlZ2lzdGVyKFwiZ2V0RmllbGRcIiwga2V5LCBnZXRGaWVsZEhvb2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5iYWNrZW5kKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmJhY2tlbmQucmVnaXN0ZXJDb2x1bW5zKGNvbHVtbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbENhY2hlLmNvbHVtbnMucHVzaChjb2x1bW4pO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2FsQ29sdW1uQ2FjaGUucHVzaChjb2x1bW4uZGF0YUtleSk7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJlbmRlckNlbGxIb29rKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFkZFJlbmRlckNlbGxIb29rKGtleSwgb3B0aW9ucy5yZW5kZXJDZWxsSG9vayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGFuIGV4dHJhIGNvbHVtbi4gQ2FsbCBpdCBvbiBwbHVnaW4gZXhpdC5cclxuICAgICAqIEBwYXJhbSBrZXkgQ29sdW1uIGRhdGFLZXksIHNob3VsZCBiZSBzYW1lIGFzIHRoZSBvbmUgdXNlZCBpbiBgcmVnaXN0ZXJgXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5za2lwR2V0RmllbGQgc2tpcCB1bnJlZ2lzdGVyIG9mIGdldEZpZWxkIGhvb2suXHJcbiAgICAgKiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHRoZSBob29rIGlzIG5vdCBpbml0aWFsaXplZCBieSB0aGlzIGluc3RhbmNlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHVucmVnaXN0ZXIoa2V5LCBvcHRpb25zID0ge30pIHtcclxuICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemF0aW9uTG9jay5wcm9taXNlO1xyXG4gICAgICAgIGlmICh0aGlzLmJhY2tlbmQpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5iYWNrZW5kLnVucmVnaXN0ZXJDb2x1bW5zKGtleSk7XHJcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5za2lwR2V0RmllbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGRIb29rcy51bnJlZ2lzdGVyKFwiZ2V0RmllbGRcIiwga2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IFpvdGVybyA9IHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpO1xyXG4gICAgICAgIGxldCBwZXJzaXN0ZWQgPSBab3Rlcm8uUHJlZnMuZ2V0KFwicGFuZS5wZXJzaXN0XCIpO1xyXG4gICAgICAgIGNvbnN0IHBlcnNpc3RlZEpTT04gPSBKU09OLnBhcnNlKHBlcnNpc3RlZCk7XHJcbiAgICAgICAgZGVsZXRlIHBlcnNpc3RlZEpTT05ba2V5XTtcclxuICAgICAgICBab3Rlcm8uUHJlZnMuc2V0KFwicGFuZS5wZXJzaXN0XCIsIEpTT04uc3RyaW5naWZ5KHBlcnNpc3RlZEpTT04pKTtcclxuICAgICAgICBjb25zdCBpZHggPSB0aGlzLmdsb2JhbENhY2hlLmNvbHVtbnMubWFwKChfYykgPT4gX2MuZGF0YUtleSkuaW5kZXhPZihrZXkpO1xyXG4gICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbENhY2hlLmNvbHVtbnMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghb3B0aW9ucy5za2lwR2V0RmllbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5maWVsZEhvb2tzLnVucmVnaXN0ZXIoXCJnZXRGaWVsZFwiLCBrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbW92ZVJlbmRlckNlbGxIb29rKGtleSk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgY29uc3QgbG9jYWxLZXlJZHggPSB0aGlzLmxvY2FsQ29sdW1uQ2FjaGUuaW5kZXhPZihrZXkpO1xyXG4gICAgICAgIGlmIChsb2NhbEtleUlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxDb2x1bW5DYWNoZS5zcGxpY2UobG9jYWxLZXlJZHgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgcGF0Y2ggaG9vayBmb3IgYF9yZW5kZXJDZWxsYCwgd2hpY2ggaXMgY2FsbGVkIHdoZW4gY2VsbCBpcyByZW5kZXJlZC5cclxuICAgICAqIEBkZXByZWNhdGVkXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBhbHNvIHdvcmtzIGZvciBab3Rlcm8ncyBidWlsdC1pbiBjZWxscy5cclxuICAgICAqIEByZW1hcmtzXHJcbiAgICAgKiBEb24ndCBjYWxsIGl0IG1hbnVhbGx5IHVubGVzcyB5b3UgdW5kZXJzdGFuZCB3aGF0IHlvdSBhcmUgZG9pbmcuXHJcbiAgICAgKiBAcGFyYW0gZGF0YUtleSBDZWxsIGBkYXRhS2V5YCwgZS5nLiAndGl0bGUnXHJcbiAgICAgKiBAcGFyYW0gcmVuZGVyQ2VsbEhvb2sgcGF0Y2ggaG9va1xyXG4gICAgICovXHJcbiAgICBhc3luYyBhZGRSZW5kZXJDZWxsSG9vayhkYXRhS2V5LCByZW5kZXJDZWxsSG9vaykge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6YXRpb25Mb2NrLnByb21pc2U7XHJcbiAgICAgICAgaWYgKGRhdGFLZXkgaW4gdGhpcy5nbG9iYWxDYWNoZS5yZW5kZXJDZWxsSG9va3MpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2coXCJbV0FSTklOR10gSXRlbVRyZWVUb29sLmFkZFJlbmRlckNlbGxIb29rIG92ZXJ3cml0ZXMgYW4gZXhpc3RpbmcgaG9vazpcIiwgZGF0YUtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2FjaGUucmVuZGVyQ2VsbEhvb2tzW2RhdGFLZXldID0gcmVuZGVyQ2VsbEhvb2s7XHJcbiAgICAgICAgdGhpcy5sb2NhbFJlbmRlckNlbGxDYWNoZS5wdXNoKGRhdGFLZXkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSBwYXRjaCBob29rIGJ5IGBkYXRhS2V5YC5cclxuICAgICAqIEBkZXByZWNhdGVkXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlbW92ZVJlbmRlckNlbGxIb29rKGRhdGFLZXkpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5nbG9iYWxDYWNoZS5yZW5kZXJDZWxsSG9va3NbZGF0YUtleV07XHJcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5sb2NhbFJlbmRlckNlbGxDYWNoZS5pbmRleE9mKGRhdGFLZXkpO1xyXG4gICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvY2FsUmVuZGVyQ2VsbENhY2hlLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2goKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRG8gaW5pdGlhbGl6YXRpb25zLiBDYWxsZWQgaW4gY29uc3RydWN0b3IgdG8gYmUgYXN5bmNcclxuICAgICAqL1xyXG4gICAgYXN5bmMgaW5pdGlhbGl6ZUdsb2JhbCgpIHtcclxuICAgICAgICBjb25zdCBab3Rlcm8gPSB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKTtcclxuICAgICAgICBhd2FpdCBab3Rlcm8udWlSZWFkeVByb21pc2U7XHJcbiAgICAgICAgY29uc3Qgd2luZG93ID0gdGhpcy5nZXRHbG9iYWwoXCJ3aW5kb3dcIik7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDYWNoZSA9IHRvb2xraXRHbG9iYWxfMS5kZWZhdWx0LmdldEluc3RhbmNlKCkuaXRlbVRyZWU7XHJcbiAgICAgICAgY29uc3QgZ2xvYmFsQ2FjaGUgPSB0aGlzLmdsb2JhbENhY2hlO1xyXG4gICAgICAgIGlmICghZ2xvYmFsQ2FjaGUuX3JlYWR5KSB7XHJcbiAgICAgICAgICAgIGdsb2JhbENhY2hlLl9yZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgY29uc3QgaXRlbVRyZWUgPSB3aW5kb3cucmVxdWlyZShcInpvdGVyby9pdGVtVHJlZVwiKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmJhY2tlbmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGF0Y2hlck1hbmFnZXIucmVnaXN0ZXIoaXRlbVRyZWUucHJvdG90eXBlLCBcImdldENvbHVtbnNcIiwgKG9yaWdpbmFsKSA9PiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbnMgPSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc2VydEFmdGVyID0gY29sdW1ucy5maW5kSW5kZXgoKGNvbHVtbikgPT4gY29sdW1uLmRhdGFLZXkgPT09IFwidGl0bGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5zcGxpY2UoaW5zZXJ0QWZ0ZXIgKyAxLCAwLCAuLi5nbG9iYWxDYWNoZS5jb2x1bW5zKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sdW1ucztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucGF0Y2hlck1hbmFnZXIucmVnaXN0ZXIoaXRlbVRyZWUucHJvdG90eXBlLCBcIl9yZW5kZXJDZWxsXCIsIChvcmlnaW5hbCkgPT4gZnVuY3Rpb24gKGluZGV4LCBkYXRhLCBjb2x1bW4pIHtcclxuICAgICAgICAgICAgICAgIGlmICghKGNvbHVtbi5kYXRhS2V5IGluIGdsb2JhbENhY2hlLnJlbmRlckNlbGxIb29rcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBob29rID0gZ2xvYmFsQ2FjaGUucmVuZGVyQ2VsbEhvb2tzW2NvbHVtbi5kYXRhS2V5XTtcclxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW0gPSBob29rKGluZGV4LCBkYXRhLCBjb2x1bW4sIG9yaWdpbmFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2VsbFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3BhbiA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsIFwic3BhblwiKTtcclxuICAgICAgICAgICAgICAgIHNwYW4uY2xhc3NMaXN0LmFkZChcImNlbGxcIiwgY29sdW1uLmRhdGFLZXksIGAke2NvbHVtbi5kYXRhS2V5fS1pdGVtLXRyZWUtbWFpbi1kZWZhdWx0YCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uLmZpeGVkV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzcGFuLmNsYXNzTGlzdC5hZGQoXCJmaXhlZC13aWR0aFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNwYW4uYXBwZW5kQ2hpbGQoZWxlbSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3BhbjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6YXRpb25Mb2NrLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgUmVhY3QgSWNvbiBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0gcHJvcHNcclxuICAgICAqL1xyXG4gICAgY3JlYXRlSWNvbkxhYmVsKHByb3BzKSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGNvbnN0IF9SZWFjdCA9IHdpbmRvdy5yZXF1aXJlKFwicmVhY3RcIik7XHJcbiAgICAgICAgcmV0dXJuIF9SZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBfUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XHJcbiAgICAgICAgICAgIHNyYzogcHJvcHMuaWNvblBhdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogXCIxMHB4XCIsXHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjlweFwiLFxyXG4gICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgXCJtYXJnaW4tbGVmdFwiOiBcIjZweFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pLCBcIiBcIiwgcHJvcHMubmFtZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZnJlc2ggaXRlbVZpZXcuIFlvdSBkb24ndCBuZWVkIHRvIGNhbGwgaXQgbWFudWFsbHkuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlZnJlc2goKSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemF0aW9uTG9jay5wcm9taXNlO1xyXG4gICAgICAgIGNvbnN0IFpvdGVyb1BhbmUgPSB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1BhbmVcIik7XHJcbiAgICAgICAgY29uc3QgaXRlbXNWaWV3ID0gWm90ZXJvUGFuZS5pdGVtc1ZpZXc7XHJcbiAgICAgICAgaWYgKCFpdGVtc1ZpZXcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpdGVtc1ZpZXcuX2NvbHVtbnNJZCA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgdmlydHVhbGl6ZWRUYWJsZSA9IChfYSA9IGl0ZW1zVmlldy50cmVlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuX2NvbHVtbnM7XHJcbiAgICAgICAgaWYgKCF2aXJ0dWFsaXplZFRhYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nKFwiSXRlbVRyZWUgaXMgc3RpbGwgbG9hZGluZy4gUmVmcmVzaCBza2lwcGVkLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSZW1vdmUgc3R5bGUgbGlzdCBvdGhlcndpc2UgdGhlIGNoYW5nZSB3aWxsIG5vdCBiZSB1cGRhdGVkXHJcbiAgICAgICAgKF9iID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7dmlydHVhbGl6ZWRUYWJsZS5fc3R5bGVLZXl9YCkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yZW1vdmUoKTtcclxuICAgICAgICAvLyBSZWZyZXNoIHRvIHJlYnVpbGQgX2NvbHVtbnNcclxuICAgICAgICBhd2FpdCBpdGVtc1ZpZXcucmVmcmVzaEFuZE1haW50YWluU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgLy8gQ29uc3RydWN0IGEgbmV3IHZpcnR1YWxpemVkLXRhYmxlLCBvdGhlcndpc2UgaXQgd2lsbCBub3QgYmUgdXBkYXRlZFxyXG4gICAgICAgIGl0ZW1zVmlldy50cmVlLl9jb2x1bW5zID0gbmV3IHZpcnR1YWxpemVkVGFibGUuX19wcm90b19fLmNvbnN0cnVjdG9yKGl0ZW1zVmlldy50cmVlKTtcclxuICAgICAgICAvLyBSZWZyZXNoIGFnYWluIHRvIHRvdGFsbHkgbWFrZSB0aGUgaXRlbVZpZXcgdXBkYXRlZFxyXG4gICAgICAgIGF3YWl0IGl0ZW1zVmlldy5yZWZyZXNoQW5kTWFpbnRhaW5TZWxlY3Rpb24oKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkl0ZW1UcmVlTWFuYWdlciA9IEl0ZW1UcmVlTWFuYWdlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXRlbVRyZWUuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuUHJvbXB0TWFuYWdlciA9IGV4cG9ydHMuUHJvbXB0ID0gdm9pZCAwO1xyXG5jb25zdCBiYXNpY18xID0gcmVxdWlyZShcIi4uL2Jhc2ljXCIpO1xyXG5jb25zdCBiYXNpY18yID0gcmVxdWlyZShcIi4uL2Jhc2ljXCIpO1xyXG5jb25zdCB1aV8xID0gcmVxdWlyZShcIi4uL3Rvb2xzL3VpXCIpO1xyXG5jb25zdCB0b29sa2l0R2xvYmFsXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vdG9vbGtpdEdsb2JhbFwiKSk7XHJcbi8qKlxyXG4gKiBQcm9tcHQgZm9yIHNldHRpbmcgdXAgb3IgZXhlY3V0aW5nIHNvbWUgY29tbWFuZHMgcXVpY2tseS5cclxuICpcclxuICogYFNoaWZ0ICsgUGAgY2FuIHNob3cvaGlkZSBpdHMgVUkgYW55d2hlcmUgYWZ0ZXIgcmVnaXN0ZXJpbmcgY29tbWFuZHMuXHJcbiAqL1xyXG5jbGFzcyBQcm9tcHQge1xyXG4gICAgZ2V0IGRvY3VtZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJhc2UuZ2V0R2xvYmFsKFwiZG9jdW1lbnRcIik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgYFByb21wdGAgYnV0IGRvIG5vdCBjcmVhdGUgVUkuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlY29yZCB0aGUgbGFzdCB0ZXh0IGVudGVyZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxhc3RJbnB1dFRleHQgPSBcIlwiO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERlZmF1bHQgdGV4dFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFRleHQgPSB7XHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlNlbGVjdCBhIGNvbW1hbmQuLi5cIixcclxuICAgICAgICAgICAgZW1wdHk6IFwiTm8gY29tbWFuZHMgZm91bmQuXCIsXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdCBjb250cm9scyB0aGUgbWF4IGxpbmUgbnVtYmVyIG9mIGNvbW1hbmRzIGRpc3BsYXllZCBpbiBgY29tbWFuZHNOb2RlYC5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLm1heExpbmVOdW0gPSAxMjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdCBjb250cm9scyB0aGUgbWF4IG51bWJlciBvZiBzdWdnZXN0aW9ucy5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLm1heFN1Z2dlc3Rpb25OdW0gPSAxMDA7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2F2ZSBhbGwgY29tbWFuZHMgcmVnaXN0ZXJlZCBieSBhbGwgYWRkb25zLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29tbWFuZHMgPSBbXTtcclxuICAgICAgICB0aGlzLmJhc2UgPSBuZXcgYmFzaWNfMS5CYXNpY1Rvb2woKTtcclxuICAgICAgICB0aGlzLnVpID0gbmV3IHVpXzEuVUlUb29sKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplVUkoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBgUHJvbXB0YCBVSSBhbmQgdGhlbiBiaW5kIGV2ZW50cyBvbiBpdC5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVVJKCkge1xyXG4gICAgICAgIHRoaXMuYWRkU3R5bGUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUhUTUwoKTtcclxuICAgICAgICB0aGlzLmluaXRJbnB1dEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTaG9ydGN1dCgpO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlSFRNTCgpIHtcclxuICAgICAgICB0aGlzLnByb21wdE5vZGUgPSB0aGlzLnVpLmNyZWF0ZUVsZW1lbnQodGhpcy5kb2N1bWVudCwgXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBzdHlsZXM6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZzogXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwiZml4ZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogXCIwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogXCIwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjbGlja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb21wdE5vZGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnByb21wdE5vZGUuYXBwZW5kQ2hpbGQodGhpcy51aS5jcmVhdGVFbGVtZW50KHRoaXMuZG9jdW1lbnQsIFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgaWQ6IGB6b3Rlcm8tcGx1Z2luLXRvb2xraXQtcHJvbXB0YCxcclxuICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJwcm9tcHQtY29udGFpbmVyXCJdLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZzogXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3Q6IFtcImlucHV0LWNvbnRhaW5lclwiXSxcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWc6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wicHJvbXB0LWlucHV0XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLmRlZmF1bHRUZXh0LnBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiBcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJjdGFcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnOiBcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wiY29tbWFuZHMtY29udGFpbmVyc1wiXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnOiBcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wiaW5zdHJ1Y3Rpb25zXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wiaW5zdHJ1Y3Rpb25cIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiBcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJrZXlcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyVGV4dDogXCJcdTIxOTFcdTIxOTNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiBcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJUZXh0OiBcInRvIG5hdmlnYXRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wiaW5zdHJ1Y3Rpb25cIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiBcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJrZXlcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyVGV4dDogXCJlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWc6IFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lclRleHQ6IFwidG8gdHJpZ2dlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWc6IFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3Q6IFtcImluc3RydWN0aW9uXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogXCJzcGFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wia2V5XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lclRleHQ6IFwiZXNjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogXCJzcGFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyVGV4dDogXCJ0byBleGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuaW5wdXROb2RlID0gdGhpcy5wcm9tcHROb2RlLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuICAgICAgICB0aGlzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnByb21wdE5vZGUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93IGNvbW1hbmRzIGluIGEgbmV3IGBjb21tYW5kc0NvbnRhaW5lcmBcclxuICAgICAqIEFsbCBvdGhlciBgY29tbWFuZHNDb250YWluZXJgIGlzIGhpZGRlblxyXG4gICAgICogQHBhcmFtIGNvbW1hbmRzIENvbW1hbmRbXVxyXG4gICAgICogQHBhcmFtIGNsZWFyIHJlbW92ZSBhbGwgYGNvbW1hbmRzQ29udGFpbmVyYCBpZiB0cnVlXHJcbiAgICAgKi9cclxuICAgIHNob3dDb21tYW5kcyhjb21tYW5kcywgY2xlYXIgPSBmYWxzZSkge1xyXG4gICAgICAgIGlmIChjbGVhcikge1xyXG4gICAgICAgICAgICB0aGlzLnByb21wdE5vZGVcclxuICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbW1hbmRzLWNvbnRhaW5lclwiKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKGUpID0+IGUucmVtb3ZlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlucHV0Tm9kZS5wbGFjZWhvbGRlciA9IHRoaXMuZGVmYXVsdFRleHQucGxhY2Vob2xkZXI7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZHNDb250YWluZXIgPSB0aGlzLmNyZWF0ZUNvbW1hbmRzQ29udGFpbmVyKCk7XHJcbiAgICAgICAgZm9yIChsZXQgY29tbWFuZCBvZiBjb21tYW5kcykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmlsdGVyIG91dCBhbm9ueW1vdXMgY29tbWFuZHNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbW1hbmQubmFtZSB8fCAoY29tbWFuZC53aGVuICYmICFjb21tYW5kLndoZW4oKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoX2EpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbW1hbmRzQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlQ29tbWFuZE5vZGUoY29tbWFuZCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgYGNvbW1hbmRzQ29udGFpbmVyYCBkaXYgZWxlbWVudCwgYXBwZW5kIHRvIGBjb21tYW5kc0NvbnRhaW5lcmAgYW5kIGhpZGUgb3RoZXJzLlxyXG4gICAgICogQHJldHVybnMgY29tbWFuZHNOb2RlXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUNvbW1hbmRzQ29udGFpbmVyKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmRzQ29udGFpbmVyID0gdGhpcy51aS5jcmVhdGVFbGVtZW50KHRoaXMuZG9jdW1lbnQsIFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJjb21tYW5kcy1jb250YWluZXJcIl0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gQWRkIHRvIGNvbnRhaW5lciBhbmQgaGlkZSBvdGhlcnNcclxuICAgICAgICB0aGlzLnByb21wdE5vZGVcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tbWFuZHMtY29udGFpbmVyXCIpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucHJvbXB0Tm9kZVxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvcihcIi5jb21tYW5kcy1jb250YWluZXJzXCIpXHJcbiAgICAgICAgICAgIC5hcHBlbmRDaGlsZChjb21tYW5kc0NvbnRhaW5lcik7XHJcbiAgICAgICAgcmV0dXJuIGNvbW1hbmRzQ29udGFpbmVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gY3VycmVudCBkaXNwbGF5ZWQgYGNvbW1hbmRzQ29udGFpbmVyYFxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgZ2V0Q29tbWFuZHNDb250YWluZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgLi4uQXJyYXkuZnJvbSh0aGlzLnByb21wdE5vZGUucXVlcnlTZWxlY3RvckFsbChcIi5jb21tYW5kcy1jb250YWluZXJcIikpLFxyXG4gICAgICAgIF0uZmluZCgoZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZS5zdHlsZS5kaXNwbGF5ICE9IFwibm9uZVwiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBjb21tYW5kIGl0ZW0gZm9yIGBQcm9tcHRgIFVJLlxyXG4gICAgICogQHBhcmFtIGNvbW1hbmRcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUNvbW1hbmROb2RlKGNvbW1hbmQpIHtcclxuICAgICAgICBjb25zdCBjb21tYW5kTm9kZSA9IHRoaXMudWkuY3JlYXRlRWxlbWVudCh0aGlzLmRvY3VtZW50LCBcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIGNsYXNzTGlzdDogW1wiY29tbWFuZFwiXSxcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWc6IFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJjb250ZW50XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wibmFtZVwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWc6IFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lclRleHQ6IGNvbW1hbmQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnOiBcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJhdXhcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogY29tbWFuZC5sYWJlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWc6IFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJsYWJlbFwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lclRleHQ6IGNvbW1hbmQubGFiZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBsaXN0ZW5lcnM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1vdXNlbW92ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbShjb21tYW5kTm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjbGlja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZXhlY0NhbGxiYWNrKGNvbW1hbmQuY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBjb21tYW5kTm9kZS5jb21tYW5kID0gY29tbWFuZDtcclxuICAgICAgICByZXR1cm4gY29tbWFuZE5vZGU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENhbGxlZCB3aGVuIGBlbnRlcmAga2V5IGlzIHByZXNzZWQuXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXIoKSB7XHJcbiAgICAgICAgWy4uLkFycmF5LmZyb20odGhpcy5wcm9tcHROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tbWFuZHMtY29udGFpbmVyXCIpKV1cclxuICAgICAgICAgICAgLmZpbmQoKGUpID0+IGUuc3R5bGUuZGlzcGxheSAhPSBcIm5vbmVcIilcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIuc2VsZWN0ZWRcIikuY2xpY2soKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGVkIHdoZW4gYGVzY2FwZWAga2V5IGlzIHByZXNzZWQuXHJcbiAgICAgKi9cclxuICAgIGV4aXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dE5vZGUucGxhY2Vob2xkZXIgPSB0aGlzLmRlZmF1bHRUZXh0LnBsYWNlaG9sZGVyO1xyXG4gICAgICAgIGlmICh0aGlzLnByb21wdE5vZGUucXVlcnlTZWxlY3RvckFsbChcIi5jb21tYW5kcy1jb250YWluZXJzIC5jb21tYW5kcy1jb250YWluZXJcIikubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9tcHROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuY29tbWFuZHMtY29udGFpbmVyOmxhc3QtY2hpbGRcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRzQ29udGFpbmVyID0gdGhpcy5wcm9tcHROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuY29tbWFuZHMtY29udGFpbmVyOmxhc3QtY2hpbGRcIik7XHJcbiAgICAgICAgICAgIGNvbW1hbmRzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgICAgICBjb21tYW5kc0NvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tbWFuZHNcIilcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChlKSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCIpKTtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dE5vZGUuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvbXB0Tm9kZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXN5bmMgZXhlY0NhbGxiYWNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0NvbW1hbmRzKGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogTWF0Y2ggc3VnZ2VzdGlvbnMgZm9yIHVzZXIncyBlbnRlcmVkIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHNob3dTdWdnZXN0aW9ucyhpbnB1dFRleHQpIHtcclxuICAgICAgICAvLyBGcm9tIE9ic2lkaWFuXHJcbiAgICAgICAgdmFyIF93ID0gL1tcXHUyMDAwLVxcdTIwNkZcXHUyRTAwLVxcdTJFN0ZcXFxcJyFcIiMkJSYoKSorLFxcLS5cXC86Ozw9Pj9AXFxbXFxdXl9ge3x9fl0vLCBqdyA9IC9cXHMvLCBXdyA9IC9bXFx1MEYwMC1cXHUwRkZGXFx1MzA0MC1cXHUzMGZmXFx1MzQwMC1cXHU0ZGJmXFx1NGUwMC1cXHU5ZmZmXFx1ZjkwMC1cXHVmYWZmXFx1ZmY2Ni1cXHVmZjlmXS87XHJcbiAgICAgICAgZnVuY3Rpb24gWXcoZSwgdCwgbiwgaSkge1xyXG4gICAgICAgICAgICBpZiAoMCA9PT0gZS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgdmFyIHIgPSAwO1xyXG4gICAgICAgICAgICAociAtPSBNYXRoLm1heCgwLCBlLmxlbmd0aCAtIDEpKSwgKHIgLT0gaSAvIDEwKTtcclxuICAgICAgICAgICAgdmFyIG8gPSBlWzBdWzBdO1xyXG4gICAgICAgICAgICByZXR1cm4gKChyIC09IChlW2UubGVuZ3RoIC0gMV1bMV0gLSBvICsgMSAtIHQpIC8gMTAwKSxcclxuICAgICAgICAgICAgICAgIChyIC09IG8gLyAxZTMpLFxyXG4gICAgICAgICAgICAgICAgKHIgLT0gbiAvIDFlNCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiAkdyhlLCB0LCBuLCBpKSB7XHJcbiAgICAgICAgICAgIGlmICgwID09PSBlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBmb3IgKHZhciByID0gbi50b0xvd2VyQ2FzZSgpLCBvID0gMCwgYSA9IDAsIHMgPSBbXSwgbCA9IDA7IGwgPCBlLmxlbmd0aDsgbCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGVbbF0sIHUgPSByLmluZGV4T2YoYywgYSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoLTEgPT09IHUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgaCA9IG4uY2hhckF0KHUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHUgPiAwICYmICFfdy50ZXN0KGgpICYmICFXdy50ZXN0KGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBuLmNoYXJBdCh1IC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChoLnRvTG93ZXJDYXNlKCkgIT09IGggJiYgcC50b0xvd2VyQ2FzZSgpICE9PSBwKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoaC50b1VwcGVyQ2FzZSgpICE9PSBoICYmICFfdy50ZXN0KHApICYmICFqdy50ZXN0KHApICYmICFXdy50ZXN0KHApKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1ICE9PSBhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGEgKz0gYy5sZW5ndGgpLCBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbyArPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKDAgPT09IHMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIHMucHVzaChbdSwgdSArIGMubGVuZ3RoXSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHNbcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICBkWzFdIDwgdSA/IHMucHVzaChbdSwgdSArIGMubGVuZ3RoXSkgOiAoZFsxXSA9IHUgKyBjLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhID0gdSArIGMubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaGVzOiBzLFxyXG4gICAgICAgICAgICAgICAgc2NvcmU6IFl3KHMsIHQubGVuZ3RoLCByLmxlbmd0aCwgbyksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIEd3KGUpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgdCA9IGUudG9Mb3dlckNhc2UoKSwgbiA9IFtdLCBpID0gMCwgciA9IDA7IHIgPCB0Lmxlbmd0aDsgcisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbyA9IHQuY2hhckF0KHIpO1xyXG4gICAgICAgICAgICAgICAgancudGVzdChvKVxyXG4gICAgICAgICAgICAgICAgICAgID8gKGkgIT09IHIgJiYgbi5wdXNoKHQuc3Vic3RyaW5nKGksIHIpKSwgKGkgPSByICsgMSkpXHJcbiAgICAgICAgICAgICAgICAgICAgOiAoX3cudGVzdChvKSB8fCBXdy50ZXN0KG8pKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoaSAhPT0gciAmJiBuLnB1c2godC5zdWJzdHJpbmcoaSwgcikpLCBuLnB1c2gobyksIChpID0gciArIDEpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKGkgIT09IHQubGVuZ3RoICYmIG4ucHVzaCh0LnN1YnN0cmluZyhpLCB0Lmxlbmd0aCkpLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuczogbixcclxuICAgICAgICAgICAgICAgICAgICBmdXp6eTogdC5zcGxpdChcIlwiKSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBYdyhlLCB0KSB7XHJcbiAgICAgICAgICAgIGlmIChcIlwiID09PSBlLnF1ZXJ5KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29yZTogMCxcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzOiBbXSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBuID0gJHcoZS50b2tlbnMsIGUucXVlcnksIHQsICExKTtcclxuICAgICAgICAgICAgcmV0dXJuIG4gfHwgJHcoZS5mdXp6eSwgZS5xdWVyeSwgdCwgITApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZSA9IEd3KGlucHV0VGV4dCk7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IHRoaXMuZ2V0Q29tbWFuZHNDb250YWluZXIoKTtcclxuICAgICAgICBpZiAoY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucyhcInN1Z2dlc3Rpb25zXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhpdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5wdXRUZXh0LnRyaW0oKSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc3VnZ2VzdGlvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmdldENvbW1hbmRzQ29udGFpbmVyKClcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tbWFuZFwiKVxyXG4gICAgICAgICAgICAuZm9yRWFjaCgoY29tbWFuZE5vZGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNwYW5Ob2RlID0gY29tbWFuZE5vZGUucXVlcnlTZWxlY3RvcihcIi5uYW1lIHNwYW5cIik7XHJcbiAgICAgICAgICAgIGxldCBzcGFuVGV4dCA9IHNwYW5Ob2RlLmlubmVyVGV4dDtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IFh3KGUsIHNwYW5UZXh0KTtcclxuICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZE5vZGUgPSB0aGlzLmNyZWF0ZUNvbW1hbmROb2RlKGNvbW1hbmROb2RlLmNvbW1hbmQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNwYW5IVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcmVzLm1hdGNoZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW3N0YXJ0LCBlbmRdID0gcmVzLm1hdGNoZXNbal07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0ID4gaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuSFRNTCArPSBzcGFuVGV4dC5zbGljZShpLCBzdGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNwYW5IVE1MICs9IGA8c3BhbiBjbGFzcz1cImhpZ2hsaWdodFwiPiR7c3BhblRleHQuc2xpY2Uoc3RhcnQsIGVuZCl9PC9zcGFuPmA7XHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGVuZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpIDwgc3BhblRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BhbkhUTUwgKz0gc3BhblRleHQuc2xpY2UoaSwgc3BhblRleHQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbW1hbmROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIubmFtZSBzcGFuXCIpLmlubmVySFRNTCA9IHNwYW5IVE1MO1xyXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCh7IHNjb3JlOiByZXMuc2NvcmUsIGNvbW1hbmROb2RlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHN1Z2dlc3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgc3VnZ2VzdGlvbnNcclxuICAgICAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSlcclxuICAgICAgICAgICAgICAgIC5zbGljZSh0aGlzLm1heFN1Z2dlc3Rpb25OdW0pO1xyXG4gICAgICAgICAgICBjb250YWluZXIgPSB0aGlzLmNyZWF0ZUNvbW1hbmRzQ29udGFpbmVyKCk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic3VnZ2VzdGlvbnNcIik7XHJcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25zLmZvckVhY2goKHN1Z2dlc3Rpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzdWdnZXN0aW9uLmNvbW1hbmROb2RlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYW5vbnltb3VzQ29tbWFuZCA9IHRoaXMuY29tbWFuZHMuZmluZCgoYykgPT4gIWMubmFtZSAmJiAoIWMud2hlbiB8fCBjLndoZW4oKSkpO1xyXG4gICAgICAgICAgICBpZiAoYW5vbnltb3VzQ29tbWFuZCkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5leGVjQ2FsbGJhY2soYW5vbnltb3VzQ29tbWFuZC5jYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dUaXAodGhpcy5kZWZhdWx0VGV4dC5lbXB0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQmluZCBldmVudHMgb2YgcHJlc3NpbmcgYGtleWRvd25gIGFuZCBga2V5dXBgIGtleS5cclxuICAgICAqL1xyXG4gICAgaW5pdElucHV0RXZlbnRzKCkge1xyXG4gICAgICAgIHRoaXMucHJvbXB0Tm9kZS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKFtcIkFycm93VXBcIiwgXCJBcnJvd0Rvd25cIl0uaW5kZXhPZihldmVudC5rZXkpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IHNlbGVjdGVkIGl0ZW0gYW5kIGluZGV4XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRJbmRleDtcclxuICAgICAgICAgICAgICAgIGxldCBhbGxJdGVtcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAuLi5BcnJheS5mcm9tKHRoaXMuZ2V0Q29tbWFuZHNDb250YWluZXIoKS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbW1hbmRcIikpLFxyXG4gICAgICAgICAgICAgICAgXS5maWx0ZXIoKGUpID0+IGUuc3R5bGUuZGlzcGxheSAhPSBcIm5vbmVcIik7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gYWxsSXRlbXMuZmluZEluZGV4KChlKSA9PiBlLmNsYXNzTGlzdC5jb250YWlucyhcInNlbGVjdGVkXCIpKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEluZGV4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsSXRlbXNbc2VsZWN0ZWRJbmRleF0uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggKz0gZXZlbnQua2V5ID09IFwiQXJyb3dVcFwiID8gLTEgOiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIkFycm93VXBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gYWxsSXRlbXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleCA9IGFsbEl0ZW1zLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxlY3RlZEluZGV4ID09IGFsbEl0ZW1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWxsSXRlbXNbc2VsZWN0ZWRJbmRleF0uY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbW1hbmRzQ29udGFpbmVyID0gdGhpcy5nZXRDb21tYW5kc0NvbnRhaW5lcigpO1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHNDb250YWluZXIuc2Nyb2xsVG8oMCwgY29tbWFuZHNDb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5zZWxlY3RlZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vZmZzZXRUb3AgLVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzQ29udGFpbmVyLm9mZnNldEhlaWdodCArXHJcbiAgICAgICAgICAgICAgICAgICAgNy41KTtcclxuICAgICAgICAgICAgICAgIGFsbEl0ZW1zW3NlbGVjdGVkSW5kZXhdLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucHJvbXB0Tm9kZS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJFbnRlclwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXkgPT0gXCJFc2NhcGVcIikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXROb2RlLnZhbHVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0Tm9kZS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4aXQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChbXCJBcnJvd1VwXCIsIFwiQXJyb3dEb3duXCJdLmluZGV4T2YoZXZlbnQua2V5KSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbnB1dFRleHQgPSB0aGlzLmlucHV0Tm9kZS52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRJbnB1dFRleHQgPT0gdGhpcy5sYXN0SW5wdXRUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sYXN0SW5wdXRUZXh0ID0gY3VycmVudElucHV0VGV4dDtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zaG93U3VnZ2VzdGlvbnMoY3VycmVudElucHV0VGV4dCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBjb21tYW5kc0NvbnRhaW5lciBhbmQgZGlzcGxheSBhIHRleHRcclxuICAgICAqL1xyXG4gICAgc2hvd1RpcCh0ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgdGlwTm9kZSA9IHRoaXMudWkuY3JlYXRlRWxlbWVudCh0aGlzLmRvY3VtZW50LCBcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIGNsYXNzTGlzdDogW1widGlwXCJdLFxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICBpbm5lclRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IHRoaXMuY3JlYXRlQ29tbWFuZHNDb250YWluZXIoKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcInN1Z2dlc3Rpb25zXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXBOb2RlKTtcclxuICAgICAgICByZXR1cm4gdGlwTm9kZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogTWFyayB0aGUgc2VsZWN0ZWQgaXRlbSB3aXRoIGNsYXNzIGBzZWxlY3RlZGAuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBIVE1MRGl2RWxlbWVudFxyXG4gICAgICovXHJcbiAgICBzZWxlY3RJdGVtKGl0ZW0pIHtcclxuICAgICAgICB0aGlzLmdldENvbW1hbmRzQ29udGFpbmVyKClcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tbWFuZFwiKVxyXG4gICAgICAgICAgICAuZm9yRWFjaCgoZSkgPT4gZS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIikpO1xyXG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG4gICAgYWRkU3R5bGUoKSB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB0aGlzLnVpLmNyZWF0ZUVsZW1lbnQodGhpcy5kb2N1bWVudCwgXCJzdHlsZVwiLCB7XHJcbiAgICAgICAgICAgIG5hbWVzcGFjZTogXCJodG1sXCIsXHJcbiAgICAgICAgICAgIGlkOiBcInByb21wdC1zdHlsZVwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHN0eWxlLmlubmVyVGV4dCA9IGBcclxuICAgICAgLnByb21wdC1jb250YWluZXIgKiB7XHJcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgICAgfVxyXG4gICAgICAucHJvbXB0LWNvbnRhaW5lciB7XHJcbiAgICAgICAgLS0tcmFkaXVzLS0tOiAxMHB4O1xyXG4gICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgICAgICBsZWZ0OiAyNSU7XHJcbiAgICAgICAgdG9wOiAxMCU7XHJcbiAgICAgICAgd2lkdGg6IDUwJTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiB2YXIoLS0tcmFkaXVzLS0tKTtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMHB4IDEuOHB4IDcuM3B4IHJnYmEoMCwgMCwgMCwgMC4wNzEpLFxyXG4gICAgICAgICAgICAgICAgICAgIDBweCA2LjNweCAyNC43cHggcmdiYSgwLCAwLCAwLCAwLjExMiksXHJcbiAgICAgICAgICAgICAgICAgICAgMHB4IDMwcHggOTBweCByZ2JhKDAsIDAsIDAsIDAuMik7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHVpLXNhbnMtc2VyaWYsIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFwiSW50ZXJcIiwgXCJBcHBsZSBDb2xvciBFbW9qaVwiLCBcIlNlZ29lIFVJIEVtb2ppXCIsIFwiU2Vnb2UgVUkgU3ltYm9sXCIsIFwiTWljcm9zb2Z0IFlhSGVpIExpZ2h0XCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWF0ZXJpYWwtYmFja2dyb3VuZCkgIWltcG9ydGFudDtcclxuICAgICAgICBib3JkZXI6IHZhcigtLW1hdGVyaWFsLWJvcmRlci1xdWFydGVybmFyeSkgIWltcG9ydGFudDtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLyogaW5wdXQgKi9cclxuICAgICAgLnByb21wdC1jb250YWluZXIgLmlucHV0LWNvbnRhaW5lciAge1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuaW5wdXQtY29udGFpbmVyIGlucHV0IHtcclxuICAgICAgICB3aWR0aDogLW1vei1hdmFpbGFibGU7XHJcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xyXG4gICAgICAgIHBhZGRpbmc6IDI0cHg7XHJcbiAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLS1yYWRpdXMtLS0pO1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1hdGVyaWFsLWJhY2tncm91bmQpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAuaW5wdXQtY29udGFpbmVyIC5jdGEge1xyXG4gICAgICAgIGJvcmRlci1ib3R0b206IHZhcigtLW1hdGVyaWFsLWJvcmRlci1xdWFydGVybmFyeSk7XHJcbiAgICAgICAgbWFyZ2luOiA1cHggYXV0bztcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLyogcmVzdWx0cyAqL1xyXG4gICAgICAuY29tbWFuZHMtY29udGFpbmVycyB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICB9XHJcbiAgICAgIC5jb21tYW5kcy1jb250YWluZXIge1xyXG4gICAgICAgIG1heC1oZWlnaHQ6IGNhbGMoJHt0aGlzLm1heExpbmVOdW19ICogMzUuNXB4KTtcclxuICAgICAgICB3aWR0aDogY2FsYygxMDAlIC0gMTJweCk7XHJcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDEycHg7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAwJTtcclxuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gICAgICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLmNvbW1hbmRzLWNvbnRhaW5lciAuY29tbWFuZCB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1jb250ZW50OiBiYXNlbGluZTtcclxuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIHBhZGRpbmc6IDZweCAxMnB4O1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTJweDtcclxuICAgICAgICBtYXJnaW4tdG9wOiAycHg7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMnB4O1xyXG4gICAgICB9XHJcbiAgICAgIC5jb21tYW5kcy1jb250YWluZXIgLmNvbW1hbmQgLmNvbnRlbnQge1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgfVxyXG4gICAgICAuY29tbWFuZHMtY29udGFpbmVyIC5jb21tYW5kIC5jb250ZW50IC5uYW1lIHtcclxuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwOyBcclxuICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcclxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICB9XHJcbiAgICAgIC5jb21tYW5kcy1jb250YWluZXIgLmNvbW1hbmQgLmNvbnRlbnQgLmF1eCB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcclxuICAgICAgICBmbGV4LXNocmluazogMDtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLmNvbW1hbmRzLWNvbnRhaW5lciAuY29tbWFuZCAuY29udGVudCAuYXV4IC5sYWJlbCB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS1maWxsLXByaW1hcnkpO1xyXG4gICAgICAgIHBhZGRpbmc6IDJweCA2cHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3ItYmFja2dyb3VuZCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAuY29tbWFuZHMtY29udGFpbmVyIC5zZWxlY3RlZCB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYXRlcmlhbC1taXgtcXVpbmFyeSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5jb21tYW5kcy1jb250YWluZXIgLmhpZ2hsaWdodCB7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC50aXAge1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS1maWxsLXByaW1hcnkpO1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICBwYWRkaW5nOiAxMnB4IDEycHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKiBpbnN0cnVjdGlvbnMgKi9cclxuICAgICAgLmluc3RydWN0aW9ucyB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgIGhlaWdodDogMi41ZW07XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgYm9yZGVyLXRvcDogdmFyKC0tbWF0ZXJpYWwtYm9yZGVyLXF1YXJ0ZXJuYXJ5KTtcclxuICAgICAgICBjb2xvcjogdmFyKC0tZmlsbC1zZWNvbmRhcnkpO1xyXG4gICAgICAgIG1hcmdpbi10b3A6IDVweDtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLmluc3RydWN0aW9ucyAuaW5zdHJ1Y3Rpb24ge1xyXG4gICAgICAgIG1hcmdpbjogYXV0byAuNWVtOyAgXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC5pbnN0cnVjdGlvbnMgLmtleSB7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAuMmVtO1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgIH1cclxuICAgIGA7XHJcbiAgICAgICAgdGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJTaG9ydGN1dCgpIHtcclxuICAgICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkgJiYgZXZlbnQua2V5LnRvTG93ZXJDYXNlKCkgPT0gXCJwXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5vcmlnaW5hbFRhcmdldC5pc0NvbnRlbnRFZGl0YWJsZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIiBpbiBldmVudC5vcmlnaW5hbFRhcmdldCB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9tcHROb2RlLnN0eWxlLmRpc3BsYXkgPT0gXCJub25lXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb21wdE5vZGUuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb21wdE5vZGUucXVlcnlTZWxlY3RvckFsbChcIi5jb21tYW5kcy1jb250YWluZXJcIikubGVuZ3RoID09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93Q29tbWFuZHModGhpcy5jb21tYW5kcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvbXB0Tm9kZS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXROb2RlLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb21wdE5vZGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Qcm9tcHQgPSBQcm9tcHQ7XHJcbmNsYXNzIFByb21wdE1hbmFnZXIgZXh0ZW5kcyBiYXNpY18yLk1hbmFnZXJUb29sIHtcclxuICAgIGNvbnN0cnVjdG9yKGJhc2UpIHtcclxuICAgICAgICBzdXBlcihiYXNlKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTYXZlIHRoZSBjb21tYW5kcyByZWdpc3RlcmVkIGZyb20gdGhpcyBtYW5hZ2VyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb21tYW5kcyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGdsb2JhbENhY2hlID0gdG9vbGtpdEdsb2JhbF8xLmRlZmF1bHQuZ2V0SW5zdGFuY2UoKS5wcm9tcHQ7XHJcbiAgICAgICAgaWYgKCFnbG9iYWxDYWNoZS5fcmVhZHkpIHtcclxuICAgICAgICAgICAgZ2xvYmFsQ2FjaGUuX3JlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgZ2xvYmFsQ2FjaGUuaW5zdGFuY2UgPSBuZXcgUHJvbXB0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucHJvbXB0ID0gZ2xvYmFsQ2FjaGUuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGNvbW1hbmRzLiBEb24ndCBmb3JnZXQgdG8gY2FsbCBgdW5yZWdpc3RlcmAgb24gcGx1Z2luIGV4aXQuXHJcbiAgICAgKiBAcGFyYW0gY29tbWFuZHMgQ29tbWFuZFtdXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGxldCBnZXRSZWFkZXIgPSAoKSA9PiB7XHJcbiAgICAgKiAgIHJldHVybiBCYXNpY1Rvb2wuZ2V0Wm90ZXJvKCkuUmVhZGVyLmdldEJ5VGFiSUQoXHJcbiAgICAgKiAgICAgKFpvdGVyby5nZXRNYWluV2luZG93KCkuWm90ZXJvX1RhYnMpLnNlbGVjdGVkSURcclxuICAgICAqICAgKVxyXG4gICAgICogfVxyXG4gICAgICpcclxuICAgICAqIHJlZ2lzdGVyKFtcclxuICAgICAqICAge1xyXG4gICAgICogICAgIG5hbWU6IFwiU3BsaXQgSG9yaXpvbnRhbGx5XCIsXHJcbiAgICAgKiAgICAgbGFiZWw6IFwiWm90ZXJvXCIsXHJcbiAgICAgKiAgICAgd2hlbjogKCkgPT4gZ2V0UmVhZGVyKCkgYXMgYm9vbGVhbixcclxuICAgICAqICAgICBjYWxsYmFjazogKHByb21wdDogUHJvbXB0KSA9PiBnZXRSZWFkZXIoKS5tZW51Q21kKFwic3BsaXRIb3Jpem9udGFsbHlcIilcclxuICAgICAqICAgfSxcclxuICAgICAqICAge1xyXG4gICAgICogICAgIG5hbWU6IFwiU3BsaXQgVmVydGljYWxseVwiLFxyXG4gICAgICogICAgIGxhYmVsOiBcIlpvdGVyb1wiLFxyXG4gICAgICogICAgIHdoZW46ICgpID0+IGdldFJlYWRlcigpIGFzIGJvb2xlYW4sXHJcbiAgICAgKiAgICAgY2FsbGJhY2s6IChwcm9tcHQ6IFByb21wdCkgPT4gZ2V0UmVhZGVyKCkubWVudUNtZChcInNwbGl0VmVydGljYWxseVwiKVxyXG4gICAgICogICB9XHJcbiAgICAgKiBdKVxyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyKGNvbW1hbmRzKSB7XHJcbiAgICAgICAgLy8gaWQtPm5hbWVcclxuICAgICAgICBjb21tYW5kcy5mb3JFYWNoKChjKSA9PiB7IHZhciBfYTsgcmV0dXJuICgoX2EgPSBjLmlkKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoYy5pZCA9IGMubmFtZSkpOyB9KTtcclxuICAgICAgICAvLyB0aGlzLnByb21wdC5jb21tYW5kcyByZWNvcmRzIGFsbCBjb21tYW5kcyBieSBhbGwgYWRkb25zXHJcbiAgICAgICAgdGhpcy5wcm9tcHQuY29tbWFuZHMgPSBbLi4udGhpcy5wcm9tcHQuY29tbWFuZHMsIC4uLmNvbW1hbmRzXTtcclxuICAgICAgICAvLyB0aGlzLmNvbW1hbmRzIHJlY29yZHMgYWxsIGNvbW1hbmRzIGJ5IHRoZSBhZGRvbiBjcmVhdGluZyB0aGlzIFByb21wdE1hbmFnZXJcclxuICAgICAgICB0aGlzLmNvbW1hbmRzID0gWy4uLnRoaXMuY29tbWFuZHMsIC4uLmNvbW1hbmRzXTtcclxuICAgICAgICB0aGlzLnByb21wdC5zaG93Q29tbWFuZHModGhpcy5jb21tYW5kcywgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFlvdSBjYW4gZGVsZXRlIGEgY29tbWFuZCByZWdpc3RlZCBiZWZvcmUgYnkgaXRzIG5hbWUuXHJcbiAgICAgKiBAcmVtYXJrc1xyXG4gICAgICogVGhlcmUgaXMgYSBwcmVtaXNlIGhlcmUgdGhhdCB0aGUgbmFtZXMgb2YgYWxsIGNvbW1hbmRzIHJlZ2lzdGVyZWQgYnkgYSBzaW5nbGUgcGx1Z2luIGFyZSBub3QgZHVwbGljYXRlZC5cclxuICAgICAqIEBwYXJhbSBpZCBDb21tYW5kLm5hbWVcclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3RlcihpZCkge1xyXG4gICAgICAgIC8vIERlbGV0ZSBpdCBpbiB0aGlzLnByb21wdC5jb21tYW5kc1xyXG4gICAgICAgIHRoaXMucHJvbXB0LmNvbW1hbmRzID0gdGhpcy5wcm9tcHQuY29tbWFuZHMuZmlsdGVyKChjKSA9PiBjLmlkICE9IGlkKTtcclxuICAgICAgICAvLyBEZWxldGUgaXQgaW4gdGhpcy5jb21tYW5kc1xyXG4gICAgICAgIHRoaXMuY29tbWFuZHMgPSB0aGlzLmNvbW1hbmRzLmZpbHRlcigoYykgPT4gYy5pZCAhPSBpZCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENhbGwgYHVucmVnaXN0ZXJBbGxgIG9uIHBsdWdpbiBleGl0LlxyXG4gICAgICovXHJcbiAgICB1bnJlZ2lzdGVyQWxsKCkge1xyXG4gICAgICAgIHRoaXMucHJvbXB0LmNvbW1hbmRzID0gdGhpcy5wcm9tcHQuY29tbWFuZHMuZmlsdGVyKChjKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbW1hbmRzLmV2ZXJ5KChfYykgPT4gX2MuaWQgIT0gYy5pZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kcyA9IFtdO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUHJvbXB0TWFuYWdlciA9IFByb21wdE1hbmFnZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByb21wdC5qcy5tYXAiLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5MaWJyYXJ5VGFiUGFuZWxNYW5hZ2VyID0gdm9pZCAwO1xyXG5jb25zdCB1aV8xID0gcmVxdWlyZShcIi4uL3Rvb2xzL3VpXCIpO1xyXG5jb25zdCBiYXNpY18xID0gcmVxdWlyZShcIi4uL2Jhc2ljXCIpO1xyXG4vKipcclxuICogUmVnaXN0ZXIgYSBuZXcgXFw8dGFicGFuZWxcXD4gaW4gbGlicmFyeSByaWdodC1zaWRlIGJhci5cclxuICovXHJcbmNsYXNzIExpYnJhcnlUYWJQYW5lbE1hbmFnZXIgZXh0ZW5kcyBiYXNpY18xLk1hbmFnZXJUb29sIHtcclxuICAgIGNvbnN0cnVjdG9yKGJhc2UpIHtcclxuICAgICAgICBzdXBlcihiYXNlKTtcclxuICAgICAgICB0aGlzLnVpID0gbmV3IHVpXzEuVUlUb29sKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubGlicmFyeVRhYkNhY2hlID0ge1xyXG4gICAgICAgICAgICBvcHRpb25zTGlzdDogW10sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgYSB0YWJwYW5lbCBpbiBsaWJyYXJ5LlxyXG4gICAgICogQHJlbWFya3NcclxuICAgICAqIElmIHlvdSBkb24ndCB3YW50IHRvIHJlbW92ZSB0aGUgdGFiICYgcGFuZWwgaW4gcnVudGltZSwgYHVucmVnaXN0ZXJMaWJyYXJ5VGFiUGFuZWxgIGlzIG5vdCBhIG11c3QuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIGVsZW1lbnRzIHdpaWwgYmUgcmVtb3ZlZCBieSBgcmVtb3ZlQWRkb25FbGVtZW50c2AuXHJcbiAgICAgKiBAcGFyYW0gdGFiTGFiZWwgTGFiZWwgb2YgcGFuZWwgdGFiLlxyXG4gICAgICogQHBhcmFtIHJlbmRlclBhbmVsSG9vayBDYWxsZWQgd2hlbiBwYW5lbCBpcyByZWFkeS4gQWRkIGVsZW1lbnRzIHRvIHRoZSBwYW5lbC5cclxuICAgICAqIEBwYXJhbSBvcHRpb25zIE90aGVyIG9wdGlvbmFsIHBhcmFtZXRlcnMuXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50YWJJZCBJRCBvZiBwYW5lbCB0YWIuIEFsc28gdXNlZCBhcyB1bnJlZ2lzdGVyIHF1ZXJ5LiBJZiBub3Qgc2V0LCBnZW5lcmF0ZSBhIHJhbmRvbSBvbmUuXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5wYW5lbElkIElEIG9mIHBhbmVsIGNvbnRhaW5lciAoWFVMLlRhYlBhbmVsKS4gSWYgbm90IHNldCwgZ2VuZXJhdGUgYSByYW5kb20gb25lLlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMudGFyZ2V0SW5kZXggSW5kZXggb2YgdGhlIGluc2VydGVkIHRhYi4gRGVmYXVsdCB0aGUgZW5kIG9mIHRhYnMuXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5zZWxlY3RQYW5lbCBJZiB0aGUgcGFuZWwgc2hvdWxkIGJlIHNlbGVjdGVkIGltbWVkaWF0ZWx5LlxyXG4gICAgICogQHJldHVybnMgdGFiSWQuIFVzZSBpdCBmb3IgdW5yZWdpc3Rlci5cclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBSZWdpc3RlciBhbiBleHRyYSBsaWJyYXJ5IHRhYnBhbmVsIGludG8gaW5kZXggMS5cclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBjb25zdCBsaWJQYW5lTWFuYWdlciA9IG5ldyBMaWJyYXJ5VGFiUGFuZWxNYW5hZ2VyKCk7XHJcbiAgICAgKiBjb25zdCBsaWJUYWJJZCA9IGxpYlBhbmVNYW5hZ2VyLnJlZ2lzdGVyTGlicmFyeVRhYlBhbmVsKFxyXG4gICAgICogICBcInRlc3RcIixcclxuICAgICAqICAgKHBhbmVsOiBYVUwuRWxlbWVudCwgd2luOiBXaW5kb3cpID0+IHtcclxuICAgICAqICAgICBjb25zdCBlbGVtID0gdWkuY3JlYXRFbGVtZW50c0Zyb21KU09OKFxyXG4gICAgICogICAgICAgd2luLmRvY3VtZW50LFxyXG4gICAgICogICAgICAge1xyXG4gICAgICogICAgICAgICB0YWc6IFwidmJveFwiLFxyXG4gICAgICogICAgICAgICBuYW1lc3BhY2U6IFwieHVsXCIsXHJcbiAgICAgKiAgICAgICAgIHN1YkVsZW1lbnRPcHRpb25zOiBbXHJcbiAgICAgKiAgICAgICAgICAge1xyXG4gICAgICogICAgICAgICAgICAgdGFnOiBcImgyXCIsXHJcbiAgICAgKiAgICAgICAgICAgICBkaXJlY3RBdHRyaWJ1dGVzOiB7XHJcbiAgICAgKiAgICAgICAgICAgICAgIGlubmVyVGV4dDogXCJIZWxsbyBXb3JsZCFcIixcclxuICAgICAqICAgICAgICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgICB7XHJcbiAgICAgKiAgICAgICAgICAgICB0YWc6IFwibGFiZWxcIixcclxuICAgICAqICAgICAgICAgICAgIG5hbWVzcGFjZTogXCJ4dWxcIixcclxuICAgICAqICAgICAgICAgICAgIGRpcmVjdEF0dHJpYnV0ZXM6IHtcclxuICAgICAqICAgICAgICAgICAgICAgdmFsdWU6IFwiVGhpcyBpcyBhIGxpYnJhcnkgdGFiLlwiLFxyXG4gICAgICogICAgICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgICB9LFxyXG4gICAgICogICAgICAgICAgIHtcclxuICAgICAqICAgICAgICAgICAgIHRhZzogXCJidXR0b25cIixcclxuICAgICAqICAgICAgICAgICAgIGRpcmVjdEF0dHJpYnV0ZXM6IHtcclxuICAgICAqICAgICAgICAgICAgICAgaW5uZXJUZXh0OiBcIlVucmVnaXN0ZXJcIixcclxuICAgICAqICAgICAgICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtcclxuICAgICAqICAgICAgICAgICAgICAge1xyXG4gICAgICogICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpY2tcIixcclxuICAgICAqICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogKCkgPT4ge1xyXG4gICAgICogICAgICAgICAgICAgICAgICAgdWkudW5yZWdpc3RlckxpYnJhcnlUYWJQYW5lbChcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgbGliVGFiSWRcclxuICAgICAqICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgICAgIF0sXHJcbiAgICAgKiAgICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgXSxcclxuICAgICAqICAgICAgIH1cclxuICAgICAqICAgICApO1xyXG4gICAgICogICAgIHBhbmVsLmFwcGVuZChlbGVtKTtcclxuICAgICAqICAgfSxcclxuICAgICAqICAge1xyXG4gICAgICogICAgIHRhcmdldEluZGV4OiAxLFxyXG4gICAgICogICB9XHJcbiAgICAgKiApO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyKHRhYkxhYmVsLCByZW5kZXJQYW5lbEhvb2ssIG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7XHJcbiAgICAgICAgICAgIHRhYklkOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHBhbmVsSWQ6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgdGFyZ2V0SW5kZXg6IC0xLFxyXG4gICAgICAgICAgICBzZWxlY3RQYW5lbDogZmFsc2UsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB3aW5kb3cgPSB0aGlzLmdldEdsb2JhbChcIndpbmRvd1wiKTtcclxuICAgICAgICBjb25zdCB0YWJib3ggPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN6b3Rlcm8tdmlldy10YWJib3hcIik7XHJcbiAgICAgICAgY29uc3QgcmFuZG9tSWQgPSBgJHtab3Rlcm8uVXRpbGl0aWVzLnJhbmRvbVN0cmluZygpfS0ke25ldyBEYXRlKCkuZ2V0VGltZSgpfWA7XHJcbiAgICAgICAgY29uc3QgdGFiSWQgPSBvcHRpb25zLnRhYklkIHx8IGB0b29sa2l0LXJlYWRlcnRhYi0ke3JhbmRvbUlkfWA7XHJcbiAgICAgICAgY29uc3QgcGFuZWxJZCA9IG9wdGlvbnMucGFuZWxJZCB8fCBgdG9vbGtpdC1yZWFkZXJ0YWJwYW5lbC0ke3JhbmRvbUlkfWA7XHJcbiAgICAgICAgY29uc3QgdGFiID0gdGhpcy51aS5jcmVhdGVFbGVtZW50KHdpbmRvdy5kb2N1bWVudCwgXCJ0YWJcIiwge1xyXG4gICAgICAgICAgICBpZDogdGFiSWQsXHJcbiAgICAgICAgICAgIGNsYXNzTGlzdDogW2B0b29sa2l0LXVpLXRhYnMtJHt0YWJJZH1gXSxcclxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHRhYkxhYmVsLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpZ25vcmVJZkV4aXN0czogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCB0YWJwYW5lbCA9IHRoaXMudWkuY3JlYXRlRWxlbWVudCh3aW5kb3cuZG9jdW1lbnQsIFwidGFicGFuZWxcIiwge1xyXG4gICAgICAgICAgICBpZDogcGFuZWxJZCxcclxuICAgICAgICAgICAgY2xhc3NMaXN0OiBbYHRvb2xraXQtdWktdGFicy0ke3RhYklkfWBdLFxyXG4gICAgICAgICAgICBpZ25vcmVJZkV4aXN0czogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCB0YWJzID0gdGFiYm94LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJzXCIpO1xyXG4gICAgICAgIGNvbnN0IHRhYnBhbmVscyA9IHRhYmJveC5xdWVyeVNlbGVjdG9yKFwidGFicGFuZWxzXCIpO1xyXG4gICAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gdHlwZW9mIG9wdGlvbnMudGFyZ2V0SW5kZXggPT09IFwibnVtYmVyXCIgPyBvcHRpb25zLnRhcmdldEluZGV4IDogLTE7XHJcbiAgICAgICAgaWYgKHRhcmdldEluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgdGFicy5xdWVyeVNlbGVjdG9yQWxsKFwidGFiXCIpW3RhcmdldEluZGV4XS5iZWZvcmUodGFiKTtcclxuICAgICAgICAgICAgdGFicGFuZWxzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0YWJwYW5lbFwiKVt0YXJnZXRJbmRleF0uYmVmb3JlKHRhYnBhbmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRhYnMuYXBwZW5kQ2hpbGQodGFiKTtcclxuICAgICAgICAgICAgdGFicGFuZWxzLmFwcGVuZENoaWxkKHRhYnBhbmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0UGFuZWwpIHtcclxuICAgICAgICAgICAgdGFiYm94LnNlbGVjdGVkVGFiID0gdGFiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxpYnJhcnlUYWJDYWNoZS5vcHRpb25zTGlzdC5wdXNoKHtcclxuICAgICAgICAgICAgdGFiSWQsXHJcbiAgICAgICAgICAgIHRhYkxhYmVsLFxyXG4gICAgICAgICAgICBwYW5lbElkLFxyXG4gICAgICAgICAgICByZW5kZXJQYW5lbEhvb2ssXHJcbiAgICAgICAgICAgIHRhcmdldEluZGV4LFxyXG4gICAgICAgICAgICBzZWxlY3RQYW5lbDogb3B0aW9ucy5zZWxlY3RQYW5lbCxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZW5kZXJQYW5lbEhvb2sodGFicGFuZWwsIHdpbmRvdyk7XHJcbiAgICAgICAgcmV0dXJuIHRhYklkO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIHRoZSBsaWJyYXJ5IHRhYnBhbmVsLlxyXG4gICAgICogQHBhcmFtIHRhYklkIHRhYiBpZFxyXG4gICAgICovXHJcbiAgICB1bnJlZ2lzdGVyKHRhYklkKSB7XHJcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5saWJyYXJ5VGFiQ2FjaGUub3B0aW9uc0xpc3QuZmluZEluZGV4KCh2KSA9PiB2LnRhYklkID09PSB0YWJJZCk7XHJcbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGlicmFyeVRhYkNhY2hlLm9wdGlvbnNMaXN0LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbW92ZVRhYlBhbmVsKHRhYklkKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVW5yZWdpc3RlciBhbGwgbGlicmFyeSB0YWJwYW5lbC5cclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3RlckFsbCgpIHtcclxuICAgICAgICBjb25zdCB0YWJJZHMgPSB0aGlzLmxpYnJhcnlUYWJDYWNoZS5vcHRpb25zTGlzdC5tYXAoKG9wdGlvbnMpID0+IG9wdGlvbnMudGFiSWQpO1xyXG4gICAgICAgIHRhYklkcy5mb3JFYWNoKHRoaXMudW5yZWdpc3Rlci5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIHJlbW92ZVRhYlBhbmVsKHRhYklkKSB7XHJcbiAgICAgICAgY29uc3QgZG9jID0gdGhpcy5nZXRHbG9iYWwoXCJkb2N1bWVudFwiKTtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGRvYy5xdWVyeVNlbGVjdG9yQWxsKGAudG9vbGtpdC11aS10YWJzLSR7dGFiSWR9YCksIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5MaWJyYXJ5VGFiUGFuZWxNYW5hZ2VyID0gTGlicmFyeVRhYlBhbmVsTWFuYWdlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlicmFyeVRhYlBhbmVsLmpzLm1hcCIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlJlYWRlclRhYlBhbmVsTWFuYWdlciA9IHZvaWQgMDtcclxuY29uc3QgdWlfMSA9IHJlcXVpcmUoXCIuLi90b29scy91aVwiKTtcclxuY29uc3QgcmVhZGVyXzEgPSByZXF1aXJlKFwiLi4vdG9vbHMvcmVhZGVyXCIpO1xyXG5jb25zdCBiYXNpY18xID0gcmVxdWlyZShcIi4uL2Jhc2ljXCIpO1xyXG4vKipcclxuICogUmVnaXN0ZXIgbmV3IFxcPHRhYnBhbmVsXFw+IGluIHJlYWRlciByaWdodC1zaWRlIGJhci5cclxuICovXHJcbmNsYXNzIFJlYWRlclRhYlBhbmVsTWFuYWdlciBleHRlbmRzIGJhc2ljXzEuTWFuYWdlclRvb2wge1xyXG4gICAgY29uc3RydWN0b3IoYmFzZSkge1xyXG4gICAgICAgIHN1cGVyKGJhc2UpO1xyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgdWlfMS5VSVRvb2wodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZWFkZXJUb29sID0gbmV3IHJlYWRlcl8xLlJlYWRlclRvb2wodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZWFkZXJUYWJDYWNoZSA9IHtcclxuICAgICAgICAgICAgb3B0aW9uc0xpc3Q6IFtdLFxyXG4gICAgICAgICAgICBvYnNlcnZlcjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBpbml0aWFsaXplTG9jazogdW5kZWZpbmVkLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGEgdGFicGFuZWwgZm9yIGV2ZXJ5IHJlYWRlci5cclxuICAgICAqIEByZW1hcmtzXHJcbiAgICAgKiBEb24ndCBmb3JnZXQgdG8gY2FsbCBgdW5yZWdpc3RlclJlYWRlclRhYlBhbmVsYCBvbiBleGl0LlxyXG4gICAgICogQHJlbWFya3NcclxuICAgICAqIEV2ZXJ5IHRpbWUgYSB0YWIgcmVhZGVyIGlzIHNlbGVjdGVkL29wZW5lZCwgdGhlIGhvb2sgd2lsbCBiZSBjYWxsZWQuXHJcbiAgICAgKiBAcGFyYW0gdGFiTGFiZWwgTGFiZWwgb2YgcGFuZWwgdGFiLlxyXG4gICAgICogQHBhcmFtIHJlbmRlclBhbmVsSG9vayBDYWxsZWQgd2hlbiBwYW5lbCBpcyByZWFkeS4gQWRkIGVsZW1lbnRzIHRvIHRoZSBwYW5lbC5cclxuICAgICAqXHJcbiAgICAgKiBUaGUgcGFuZWwgbWlnaHQgYmUgYHVuZGVmaW5lZGAgd2hlbiBvcGVuaW5nIGEgUERGIHdpdGhvdXQgcGFyZW50IGl0ZW0uXHJcbiAgICAgKlxyXG4gICAgICogVGhlIG93bmVyIGRlY2sgaXMgdGhlIHRvcCBjb250YWluZXIgb2YgcmlnaHQtc2lkZSBiYXIuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIHJlYWRlckluc3RhbmNlIGlzIHRoZSByZWFkZXIgb2YgY3VycmVudCB0YWJwYW5lbC5cclxuICAgICAqIEBwYXJhbSBvcHRpb25zIE90aGVyIG9wdGlvbmFsIHBhcmFtZXRlcnMuXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50YWJJZCBJRCBvZiBwYW5lbCB0YWIuIEFsc28gdXNlZCBhcyB1bnJlZ2lzdGVyIHF1ZXJ5LiBJZiBub3Qgc2V0LCBnZW5lcmF0ZSBhIHJhbmRvbSBvbmUuXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5wYW5lbElkIElEIG9mIHBhbmVsIGNvbnRhaW5lciAoWFVMLlRhYlBhbmVsKS4gSWYgbm90IHNldCwgZ2VuZXJhdGUgYSByYW5kb20gb25lLlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMudGFyZ2V0SW5kZXggSW5kZXggb2YgdGhlIGluc2VydGVkIHRhYi4gRGVmYXVsdCB0aGUgZW5kIG9mIHRhYnMuXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5zZWxlY3RQYW5lbCBJZiB0aGUgcGFuZWwgc2hvdWxkIGJlIHNlbGVjdGVkIGltbWVkaWF0ZWx5LlxyXG4gICAgICogQHJldHVybnMgdGFiSWQuIFVzZSBpdCBmb3IgdW5yZWdpc3Rlci5cclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBSZWdpc3RlciBhbiBleHRyYSByZWFkZXIgdGFicGFuZWwgaW50byBpbmRleCAxLlxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGNvbnN0IHJlYWRlclRhYklkID0gYCR7Y29uZmlnLmFkZG9uUmVmfS1leHRyYS1yZWFkZXItdGFiYDtcclxuICAgICAqIHRoaXMuX0FkZG9uLnRvb2xraXQuVUkucmVnaXN0ZXJSZWFkZXJUYWJQYW5lbChcclxuICAgICAqICAgXCJ0ZXN0XCIsXHJcbiAgICAgKiAgIChcclxuICAgICAqICAgICBwYW5lbDogWFVMLkVsZW1lbnQsXHJcbiAgICAgKiAgICAgZGVjazogWFVMLkRlY2ssXHJcbiAgICAgKiAgICAgd2luOiBXaW5kb3csXHJcbiAgICAgKiAgICAgcmVhZGVyOiBfWm90ZXJvUmVhZGVySW5zdGFuY2VcclxuICAgICAqICAgKSA9PiB7XHJcbiAgICAgKiAgICAgaWYgKCFwYW5lbCkge1xyXG4gICAgICogICAgICAgdGhpcy5fQWRkb24udG9vbGtpdC5Ub29sLmxvZyhcclxuICAgICAqICAgICAgICAgXCJUaGlzIHJlYWRlciBkbyBub3QgaGF2ZSByaWdodC1zaWRlIGJhci4gQWRkaW5nIHJlYWRlciB0YWIgc2tpcHBlZC5cIlxyXG4gICAgICogICAgICAgKTtcclxuICAgICAqICAgICAgIHJldHVybjtcclxuICAgICAqICAgICB9XHJcbiAgICAgKiAgICAgdGhpcy5fQWRkb24udG9vbGtpdC5Ub29sLmxvZyhyZWFkZXIpO1xyXG4gICAgICogICAgIGNvbnN0IGVsZW0gPSB0aGlzLl9BZGRvbi50b29sa2l0LlVJLmNyZWF0RWxlbWVudHNGcm9tSlNPTihcclxuICAgICAqICAgICAgIHdpbi5kb2N1bWVudCxcclxuICAgICAqICAgICAgIHtcclxuICAgICAqICAgICAgICAgdGFnOiBcInZib3hcIixcclxuICAgICAqICAgICAgICAgaWQ6IGAke2NvbmZpZy5hZGRvblJlZn0tJHtyZWFkZXIuX2luc3RhbmNlSUR9LWV4dHJhLXJlYWRlci10YWItZGl2YCxcclxuICAgICAqICAgICAgICAgbmFtZXNwYWNlOiBcInh1bFwiLFxyXG4gICAgICogICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCEgRG9uJ3QgY3JlYXRlIGNvbnRlbnQgZm9yIG11bHRpcGxlIHRpbWVzXHJcbiAgICAgKiAgICAgICAgIGlnbm9yZUlmRXhpc3RzOiB0cnVlLFxyXG4gICAgICogICAgICAgICBzdWJFbGVtZW50T3B0aW9uczogW1xyXG4gICAgICogICAgICAgICAgIHtcclxuICAgICAqICAgICAgICAgICAgIHRhZzogXCJoMlwiLFxyXG4gICAgICogICAgICAgICAgICAgZGlyZWN0QXR0cmlidXRlczoge1xyXG4gICAgICogICAgICAgICAgICAgICBpbm5lclRleHQ6IFwiSGVsbG8gV29ybGQhXCIsXHJcbiAgICAgKiAgICAgICAgICAgICB9LFxyXG4gICAgICogICAgICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgICAge1xyXG4gICAgICogICAgICAgICAgICAgdGFnOiBcImxhYmVsXCIsXHJcbiAgICAgKiAgICAgICAgICAgICBuYW1lc3BhY2U6IFwieHVsXCIsXHJcbiAgICAgKiAgICAgICAgICAgICBkaXJlY3RBdHRyaWJ1dGVzOiB7XHJcbiAgICAgKiAgICAgICAgICAgICAgIHZhbHVlOiBcIlRoaXMgaXMgYSByZWFkZXIgdGFiLlwiLFxyXG4gICAgICogICAgICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgICB9LFxyXG4gICAgICogICAgICAgICAgIHtcclxuICAgICAqICAgICAgICAgICAgIHRhZzogXCJsYWJlbFwiLFxyXG4gICAgICogICAgICAgICAgICAgbmFtZXNwYWNlOiBcInh1bFwiLFxyXG4gICAgICogICAgICAgICAgICAgZGlyZWN0QXR0cmlidXRlczoge1xyXG4gICAgICogICAgICAgICAgICAgICB2YWx1ZTogYFJlYWRlcjogJHtyZWFkZXIuX3RpdGxlLnNsaWNlKDAsIDIwKX1gLFxyXG4gICAgICogICAgICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgICB9LFxyXG4gICAgICogICAgICAgICAgIHtcclxuICAgICAqICAgICAgICAgICAgIHRhZzogXCJsYWJlbFwiLFxyXG4gICAgICogICAgICAgICAgICAgbmFtZXNwYWNlOiBcInh1bFwiLFxyXG4gICAgICogICAgICAgICAgICAgZGlyZWN0QXR0cmlidXRlczoge1xyXG4gICAgICogICAgICAgICAgICAgICB2YWx1ZTogYGl0ZW1JRDogJHtyZWFkZXIuaXRlbUlEfS5gLFxyXG4gICAgICogICAgICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAgICB9LFxyXG4gICAgICogICAgICAgICAgIHtcclxuICAgICAqICAgICAgICAgICAgIHRhZzogXCJidXR0b25cIixcclxuICAgICAqICAgICAgICAgICAgIGRpcmVjdEF0dHJpYnV0ZXM6IHtcclxuICAgICAqICAgICAgICAgICAgICAgaW5uZXJUZXh0OiBcIlVucmVnaXN0ZXJcIixcclxuICAgICAqICAgICAgICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtcclxuICAgICAqICAgICAgICAgICAgICAge1xyXG4gICAgICogICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpY2tcIixcclxuICAgICAqICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogKCkgPT4ge1xyXG4gICAgICogICAgICAgICAgICAgICAgICAgdGhpcy5fQWRkb24udG9vbGtpdC5VSS51bnJlZ2lzdGVyUmVhZGVyVGFiUGFuZWwoXHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIHJlYWRlclRhYklkXHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICogICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgICAgICBdLFxyXG4gICAgICogICAgICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgIF0sXHJcbiAgICAgKiAgICAgICB9XHJcbiAgICAgKiAgICAgKTtcclxuICAgICAqICAgICBwYW5lbC5hcHBlbmQoZWxlbSk7XHJcbiAgICAgKiAgIH0sXHJcbiAgICAgKiAgIHtcclxuICAgICAqICAgICB0YWJJZDogcmVhZGVyVGFiSWQsXHJcbiAgICAgKiAgIH1cclxuICAgICAqICk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVnaXN0ZXIodGFiTGFiZWwsIHJlbmRlclBhbmVsSG9vaywgb3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7XHJcbiAgICAgICAgICAgIHRhYklkOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHBhbmVsSWQ6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgdGFyZ2V0SW5kZXg6IC0xLFxyXG4gICAgICAgICAgICBzZWxlY3RQYW5lbDogZmFsc2UsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucmVhZGVyVGFiQ2FjaGUuaW5pdGlhbGl6ZUxvY2sgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplUmVhZGVyVGFiT2JzZXJ2ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgKChfYSA9IHRoaXMucmVhZGVyVGFiQ2FjaGUuaW5pdGlhbGl6ZUxvY2spID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wcm9taXNlKTtcclxuICAgICAgICBjb25zdCByYW5kb21JZCA9IGAke1pvdGVyby5VdGlsaXRpZXMucmFuZG9tU3RyaW5nKCl9LSR7bmV3IERhdGUoKS5nZXRUaW1lKCl9YDtcclxuICAgICAgICBjb25zdCB0YWJJZCA9IG9wdGlvbnMudGFiSWQgfHwgYHRvb2xraXQtcmVhZGVydGFiLSR7cmFuZG9tSWR9YDtcclxuICAgICAgICBjb25zdCBwYW5lbElkID0gb3B0aW9ucy5wYW5lbElkIHx8IGB0b29sa2l0LXJlYWRlcnRhYnBhbmVsLSR7cmFuZG9tSWR9YDtcclxuICAgICAgICBjb25zdCB0YXJnZXRJbmRleCA9IHR5cGVvZiBvcHRpb25zLnRhcmdldEluZGV4ID09PSBcIm51bWJlclwiID8gb3B0aW9ucy50YXJnZXRJbmRleCA6IC0xO1xyXG4gICAgICAgIHRoaXMucmVhZGVyVGFiQ2FjaGUub3B0aW9uc0xpc3QucHVzaCh7XHJcbiAgICAgICAgICAgIHRhYklkLFxyXG4gICAgICAgICAgICB0YWJMYWJlbCxcclxuICAgICAgICAgICAgcGFuZWxJZCxcclxuICAgICAgICAgICAgcmVuZGVyUGFuZWxIb29rLFxyXG4gICAgICAgICAgICB0YXJnZXRJbmRleCxcclxuICAgICAgICAgICAgc2VsZWN0UGFuZWw6IG9wdGlvbnMuc2VsZWN0UGFuZWwsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gVHJ5IHRvIGFkZCB0YWJwYW5lbCB0byBjdXJyZW50IHJlYWRlciBpbW1lZGlhdGVseVxyXG4gICAgICAgIGF3YWl0IHRoaXMuYWRkUmVhZGVyVGFiUGFuZWwoKTtcclxuICAgICAgICByZXR1cm4gdGFiSWQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVucmVnaXN0ZXIgdGhlIHJlYWRlciB0YWJwYW5lbC5cclxuICAgICAqIEBwYXJhbSB0YWJJZCB0YWIgaWRcclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3Rlcih0YWJJZCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBjb25zdCBpZHggPSB0aGlzLnJlYWRlclRhYkNhY2hlLm9wdGlvbnNMaXN0LmZpbmRJbmRleCgodikgPT4gdi50YWJJZCA9PT0gdGFiSWQpO1xyXG4gICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlYWRlclRhYkNhY2hlLm9wdGlvbnNMaXN0LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFkZXJUYWJDYWNoZS5vcHRpb25zTGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgKF9hID0gdGhpcy5yZWFkZXJUYWJDYWNoZS5vYnNlcnZlcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5yZWFkZXJUYWJDYWNoZSA9IHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNMaXN0OiBbXSxcclxuICAgICAgICAgICAgICAgIG9ic2VydmVyOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBpbml0aWFsaXplTG9jazogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbW92ZVRhYlBhbmVsKHRhYklkKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVW5yZWdpc3RlciBhbGwgbGlicmFyeSB0YWJwYW5lbC5cclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3RlckFsbCgpIHtcclxuICAgICAgICBjb25zdCB0YWJJZHMgPSB0aGlzLnJlYWRlclRhYkNhY2hlLm9wdGlvbnNMaXN0Lm1hcCgob3B0aW9ucykgPT4gb3B0aW9ucy50YWJJZCk7XHJcbiAgICAgICAgdGFiSWRzLmZvckVhY2godGhpcy51bnJlZ2lzdGVyLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG4gICAgY2hhbmdlVGFiUGFuZWwodGFiSWQsIG9wdGlvbnMpIHtcclxuICAgICAgICBjb25zdCBpZHggPSB0aGlzLnJlYWRlclRhYkNhY2hlLm9wdGlvbnNMaXN0LmZpbmRJbmRleCgodikgPT4gdi50YWJJZCA9PT0gdGFiSWQpO1xyXG4gICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMucmVhZGVyVGFiQ2FjaGUub3B0aW9uc0xpc3RbaWR4XSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVtb3ZlVGFiUGFuZWwodGFiSWQpIHtcclxuICAgICAgICBjb25zdCBkb2MgPSB0aGlzLmdldEdsb2JhbChcImRvY3VtZW50XCIpO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoYC50b29sa2l0LXVpLXRhYnMtJHt0YWJJZH1gKSwgKGUpID0+IHtcclxuICAgICAgICAgICAgZS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGluaXRpYWxpemVSZWFkZXJUYWJPYnNlcnZlcigpIHtcclxuICAgICAgICB0aGlzLnJlYWRlclRhYkNhY2hlLmluaXRpYWxpemVMb2NrID1cclxuICAgICAgICAgICAgdGhpcy5nZXRHbG9iYWwoXCJab3Rlcm9cIikuUHJvbWlzZS5kZWZlcigpO1xyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICAgICAgWm90ZXJvLmluaXRpYWxpemF0aW9uUHJvbWlzZSxcclxuICAgICAgICAgICAgWm90ZXJvLnVubG9ja1Byb21pc2UsXHJcbiAgICAgICAgICAgIFpvdGVyby51aVJlYWR5UHJvbWlzZSxcclxuICAgICAgICBdKTtcclxuICAgICAgICBsZXQgbG9jayA9IFpvdGVyby5Qcm9taXNlLmRlZmVyKCk7XHJcbiAgICAgICAgbG9jay5yZXNvbHZlKCk7XHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBhd2FpdCB0aGlzLnJlYWRlclRvb2wuYWRkUmVhZGVyVGFiUGFuZWxEZWNrT2JzZXJ2ZXIoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCBsb2NrLnByb21pc2U7XHJcbiAgICAgICAgICAgIGxvY2sgPSBab3Rlcm8uUHJvbWlzZS5kZWZlcigpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRSZWFkZXJUYWJQYW5lbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cclxuICAgICAgICAgICAgbG9jay5yZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZWFkZXJUYWJDYWNoZS5vYnNlcnZlciA9IG9ic2VydmVyO1xyXG4gICAgICAgIHRoaXMucmVhZGVyVGFiQ2FjaGUuaW5pdGlhbGl6ZUxvY2sucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgYWRkUmVhZGVyVGFiUGFuZWwoKSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICBjb25zdCB3aW5kb3cgPSB0aGlzLmdldEdsb2JhbChcIndpbmRvd1wiKTtcclxuICAgICAgICBjb25zdCBkZWNrID0gdGhpcy5yZWFkZXJUb29sLmdldFJlYWRlclRhYlBhbmVsRGVjaygpO1xyXG4gICAgICAgIGNvbnN0IHJlYWRlciA9IGF3YWl0IHRoaXMucmVhZGVyVG9vbC5nZXRSZWFkZXIoKTtcclxuICAgICAgICBpZiAoIXJlYWRlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFBERiB3aXRob3V0IHBhcmVudCBpdGVtIGRvZXMgbm90IGhhdmUgdGFicGFuZWwuIENyZWF0ZSBvbmUuXHJcbiAgICAgICAgaWYgKCgoX2EgPSBkZWNrLnNlbGVjdGVkUGFuZWwpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jaGlsZHJlblswXS50YWdOYW1lKSA9PT0gXCJ2Ym94XCIpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZGVjay5zZWxlY3RlZFBhbmVsO1xyXG4gICAgICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy51aS5hcHBlbmRFbGVtZW50KHtcclxuICAgICAgICAgICAgICAgIHRhZzogXCJ0YWJib3hcIixcclxuICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wiem90ZXJvLXZpZXctdGFiYm94XCJdLFxyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsZXg6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVuYWJsZUVsZW1lbnRSZWNvcmQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogXCJ0YWJzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wiem90ZXJvLWVkaXRwYW5lLXRhYnNcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWVudDogXCJob3Jpem9udGFsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZUVsZW1lbnRSZWNvcmQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6IFwidGFicGFuZWxzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogW1wiem90ZXJvLXZpZXctaXRlbVwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZUVsZW1lbnRSZWNvcmQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LCBjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGFiYm94ID0gKF9iID0gZGVjay5zZWxlY3RlZFBhbmVsKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucXVlcnlTZWxlY3RvcihcInRhYmJveFwiKTtcclxuICAgICAgICBpZiAoIXRhYmJveCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRhYnMgPSB0YWJib3gucXVlcnlTZWxlY3RvcihcInRhYnNcIik7XHJcbiAgICAgICAgY29uc3QgdGFicGFuZWxzID0gdGFiYm94LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJwYW5lbHNcIik7XHJcbiAgICAgICAgdGhpcy5yZWFkZXJUYWJDYWNoZS5vcHRpb25zTGlzdC5mb3JFYWNoKChvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhYklkID0gYCR7b3B0aW9ucy50YWJJZH0tJHtyZWFkZXIuX2luc3RhbmNlSUR9YDtcclxuICAgICAgICAgICAgY29uc3QgdGFiQ2xhc3MgPSBgdG9vbGtpdC11aS10YWJzLSR7b3B0aW9ucy50YWJJZH1gO1xyXG4gICAgICAgICAgICBpZiAodGFicyA9PT0gbnVsbCB8fCB0YWJzID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0YWJzLnF1ZXJ5U2VsZWN0b3IoYC4ke3RhYkNsYXNzfWApKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdGFiID0gdGhpcy51aS5jcmVhdGVFbGVtZW50KHdpbmRvdy5kb2N1bWVudCwgXCJ0YWJcIiwge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHRhYklkLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NMaXN0OiBbdGFiQ2xhc3NdLFxyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBvcHRpb25zLnRhYkxhYmVsLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGlnbm9yZUlmRXhpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgdGFicGFuZWwgPSB0aGlzLnVpLmNyZWF0ZUVsZW1lbnQod2luZG93LmRvY3VtZW50LCBcInRhYnBhbmVsXCIsIHtcclxuICAgICAgICAgICAgICAgIGlkOiBgJHtvcHRpb25zLnBhbmVsSWR9LSR7cmVhZGVyLl9pbnN0YW5jZUlEfWAsXHJcbiAgICAgICAgICAgICAgICBjbGFzc0xpc3Q6IFt0YWJDbGFzc10sXHJcbiAgICAgICAgICAgICAgICBpZ25vcmVJZkV4aXN0czogdHJ1ZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnRhcmdldEluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRhYnMgPT09IG51bGwgfHwgdGFicyA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGFicy5xdWVyeVNlbGVjdG9yQWxsKFwidGFiXCIpW29wdGlvbnMudGFyZ2V0SW5kZXhdLmJlZm9yZSh0YWIpO1xyXG4gICAgICAgICAgICAgICAgdGFicGFuZWxzID09PSBudWxsIHx8IHRhYnBhbmVscyA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGFicGFuZWxzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0YWJwYW5lbFwiKVtvcHRpb25zLnRhcmdldEluZGV4XS5iZWZvcmUodGFicGFuZWwpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhYmJveC5nZXRBdHRyaWJ1dGUoXCJ0b29sa2l0LXNlbGVjdC1maXhlZFwiKSAhPT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUYWJzIGFmdGVyIGN1cnJlbnQgdGFiIHdpbGwgbm90IGJlIGNvcnJlY3RseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEEgd29ya2Fyb3VuZCB0byBtYW51YWxseSBzZXQgc2VsZWN0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgIHRhYmJveC50YWJwYW5lbHMuYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0R2xvYmFsKFwic2V0VGltZW91dFwiKSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJib3gudGFicGFuZWxzLnNlbGVjdGVkUGFuZWwgPSB0YWJib3gudGFicy5nZXRSZWxhdGVkRWxlbWVudCh0YWJib3ggPT09IG51bGwgfHwgdGFiYm94ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0YWJib3gudGFicy5zZWxlY3RlZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0YWJib3guc2V0QXR0cmlidXRlKFwidG9vbGtpdC1zZWxlY3QtZml4ZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFicyA9PT0gbnVsbCB8fCB0YWJzID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0YWJzLmFwcGVuZENoaWxkKHRhYik7XHJcbiAgICAgICAgICAgICAgICB0YWJwYW5lbHMgPT09IG51bGwgfHwgdGFicGFuZWxzID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0YWJwYW5lbHMuYXBwZW5kQ2hpbGQodGFicGFuZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNlbGVjdFBhbmVsKSB7XHJcbiAgICAgICAgICAgICAgICB0YWJib3guc2VsZWN0ZWRUYWIgPSB0YWI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3B0aW9ucy5yZW5kZXJQYW5lbEhvb2sodGFicGFuZWwsIGRlY2ssIHdpbmRvdywgcmVhZGVyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlJlYWRlclRhYlBhbmVsTWFuYWdlciA9IFJlYWRlclRhYlBhbmVsTWFuYWdlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVhZGVyVGFiUGFuZWwuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuTWVudU1hbmFnZXIgPSB2b2lkIDA7XHJcbmNvbnN0IHVpXzEgPSByZXF1aXJlKFwiLi4vdG9vbHMvdWlcIik7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbi8qKlxyXG4gKiBSZWdpc3RlciBcXDxtZW51aXRlbVxcPiwgXFw8bWVudXBvcHVwXFw+LCBvciBcXDxtZW51c2VwZXJhdG9yXFw+IHRvIFpvdGVybyByaWdodC1jbGljay93aW5kb3cgbWVudXMuXHJcbiAqL1xyXG5jbGFzcyBNZW51TWFuYWdlciBleHRlbmRzIGJhc2ljXzEuTWFuYWdlclRvb2wge1xyXG4gICAgY29uc3RydWN0b3IoYmFzZSkge1xyXG4gICAgICAgIHN1cGVyKGJhc2UpO1xyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgdWlfMS5VSVRvb2wodGhpcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydCBhbiBtZW51IGl0ZW0vbWVudSh3aXRoIHBvcHVwKS9tZW51c2VwcmF0b3IgaW50byBhIG1lbnVwb3B1cFxyXG4gICAgICogQHJlbWFya3NcclxuICAgICAqIG9wdGlvbnM6XHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogZXhwb3J0IGludGVyZmFjZSBNZW51aXRlbU9wdGlvbnMge1xyXG4gICAgICogICB0YWc6IFwibWVudWl0ZW1cIiB8IFwibWVudVwiIHwgXCJtZW51c2VwYXJhdG9yXCI7XHJcbiAgICAgKiAgIGlkPzogc3RyaW5nO1xyXG4gICAgICogICBsYWJlbD86IHN0cmluZztcclxuICAgICAqICAgLy8gZGF0YSB1cmwgKGNocm9tZTovL3h4eC5wbmcpIG9yIGJhc2U2NCB1cmwgKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCx4eHgpXHJcbiAgICAgKiAgIGljb24/OiBzdHJpbmc7XHJcbiAgICAgKiAgIGNsYXNzPzogc3RyaW5nO1xyXG4gICAgICogICBzdHlsZXM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xyXG4gICAgICogICBoaWRkZW4/OiBib29sZWFuO1xyXG4gICAgICogICBkaXNhYmxlZD86IGJvb2xlYW47XHJcbiAgICAgKiAgIG9uY29tbWFuZD86IHN0cmluZztcclxuICAgICAqICAgY29tbWFuZExpc3RlbmVyPzogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcclxuICAgICAqICAgLy8gQXR0cmlidXRlcyBiZWxvdyBhcmUgdXNlZCB3aGVuIHR5cGUgPT09IFwibWVudVwiXHJcbiAgICAgKiAgIHBvcHVwSWQ/OiBzdHJpbmc7XHJcbiAgICAgKiAgIG9ucG9wdXBzaG93aW5nPzogc3RyaW5nO1xyXG4gICAgICogICBzdWJFbGVtZW50T3B0aW9ucz86IEFycmF5PE1lbnVpdGVtT3B0aW9ucz47XHJcbiAgICAgKiB9XHJcbiAgICAgKiBgYGBcclxuICAgICAqIEBwYXJhbSBtZW51UG9wdXBcclxuICAgICAqIEBwYXJhbSBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0gaW5zZXJ0UG9zaXRpb25cclxuICAgICAqIEBwYXJhbSBhbmNob3JFbGVtZW50IFRoZSBtZW51aXRlbSB3aWxsIGJlIHB1dCBiZWZvcmUvYWZ0ZXIgYGFuY2hvckVsZW1lbnRgLiBJZiBub3Qgc2V0LCBwdXQgYXQgc3RhcnQvZW5kIG9mIHRoZSBtZW51cG9wdXAuXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogSW5zZXJ0IG1lbnVpdGVtIHdpdGggaWNvbiBpbnRvIGl0ZW0gbWVudXBvcHVwXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogLy8gYmFzZTY0IG9yIGNocm9tZTovLyB1cmxcclxuICAgICAqIGNvbnN0IG1lbnVJY29uID0gXCJjaHJvbWU6Ly9hZGRvbnRlbXBsYXRlL2NvbnRlbnQvaWNvbnMvZmF2aWNvbkAwLjV4LnBuZ1wiO1xyXG4gICAgICogenRvb2xraXQuTWVudS5yZWdpc3RlcihcIml0ZW1cIiwge1xyXG4gICAgICogICB0YWc6IFwibWVudWl0ZW1cIixcclxuICAgICAqICAgaWQ6IFwiem90ZXJvLWl0ZW1tZW51LWFkZG9udGVtcGxhdGUtdGVzdFwiLFxyXG4gICAgICogICBsYWJlbDogXCJBZGRvbiBUZW1wbGF0ZTogTWVudWl0ZW1cIixcclxuICAgICAqICAgb25jb21tYW5kOiBcImFsZXJ0KCdIZWxsbyBXb3JsZCEgRGVmYXVsdCBNZW51aXRlbS4nKVwiLFxyXG4gICAgICogICBpY29uOiBtZW51SWNvbixcclxuICAgICAqIH0pO1xyXG4gICAgICogYGBgXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogSW5zZXJ0IG1lbnUgaW50byBmaWxlIG1lbnVwb3B1cFxyXG4gICAgICogYGBgdHNcclxuICAgICAqIHp0b29sa2l0Lk1lbnUucmVnaXN0ZXIoXHJcbiAgICAgKiAgIFwibWVudUZpbGVcIixcclxuICAgICAqICAge1xyXG4gICAgICogICAgIHRhZzogXCJtZW51XCIsXHJcbiAgICAgKiAgICAgbGFiZWw6IFwiQWRkb24gVGVtcGxhdGU6IE1lbnVwb3B1cFwiLFxyXG4gICAgICogICAgIHN1YkVsZW1lbnRPcHRpb25zOiBbXHJcbiAgICAgKiAgICAgICB7XHJcbiAgICAgKiAgICAgICAgIHRhZzogXCJtZW51aXRlbVwiLFxyXG4gICAgICogICAgICAgICBsYWJlbDogXCJBZGRvbiBUZW1wbGF0ZVwiLFxyXG4gICAgICogICAgICAgICBvbmNvbW1hbmQ6IFwiYWxlcnQoJ0hlbGxvIFdvcmxkISBTdWIgTWVudWl0ZW0uJylcIixcclxuICAgICAqICAgICAgIH0sXHJcbiAgICAgKiAgICAgXSxcclxuICAgICAqICAgfSxcclxuICAgICAqICAgXCJiZWZvcmVcIixcclxuICAgICAqICAgWm90ZXJvLmdldE1haW5XaW5kb3coKS5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICogICAgIFwiI3pvdGVyby1pdGVtbWVudS1hZGRvbnRlbXBsYXRlLXRlc3RcIlxyXG4gICAgICogICApXHJcbiAgICAgKiApO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyKG1lbnVQb3B1cCwgb3B0aW9ucywgaW5zZXJ0UG9zaXRpb24gPSBcImFmdGVyXCIsIGFuY2hvckVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgcG9wdXA7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtZW51UG9wdXAgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgcG9wdXAgPSB0aGlzLmdldEdsb2JhbChcImRvY3VtZW50XCIpLnF1ZXJ5U2VsZWN0b3IoTWVudVNlbGVjdG9yW21lbnVQb3B1cF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcG9wdXAgPSBtZW51UG9wdXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcG9wdXApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkb2MgPSBwb3B1cC5vd25lckRvY3VtZW50O1xyXG4gICAgICAgIGNvbnN0IGdlbk1lbnVFbGVtZW50ID0gKG1lbnVpdGVtT3B0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICB0YWc6IG1lbnVpdGVtT3B0aW9uLnRhZyxcclxuICAgICAgICAgICAgICAgIGlkOiBtZW51aXRlbU9wdGlvbi5pZCxcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogXCJ4dWxcIixcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogbWVudWl0ZW1PcHRpb24ubGFiZWwgfHwgXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBoaWRkZW46IEJvb2xlYW4obWVudWl0ZW1PcHRpb24uaGlkZGVuKSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNhbGVkOiBCb29sZWFuKG1lbnVpdGVtT3B0aW9uLmRpc2FibGVkKSxcclxuICAgICAgICAgICAgICAgICAgICBjbGFzczogbWVudWl0ZW1PcHRpb24uY2xhc3MgfHwgXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBvbmNvbW1hbmQ6IG1lbnVpdGVtT3B0aW9uLm9uY29tbWFuZCB8fCBcIlwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogbWVudWl0ZW1PcHRpb24uY2xhc3NMaXN0LFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBtZW51aXRlbU9wdGlvbi5zdHlsZXMgfHwge30sXHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtdLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAobWVudWl0ZW1PcHRpb24uaWNvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKS5pc01hYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW51aXRlbU9wdGlvbi50YWcgPT09IFwibWVudVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRPcHRpb24uYXR0cmlidXRlc1tcImNsYXNzXCJdICs9IFwiIG1lbnUtaWNvbmljXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50T3B0aW9uLmF0dHJpYnV0ZXNbXCJjbGFzc1wiXSArPSBcIiBtZW51aXRlbS1pY29uaWNcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50T3B0aW9uLnN0eWxlc1tcImxpc3Qtc3R5bGUtaW1hZ2VcIl0gPSBgdXJsKCR7bWVudWl0ZW1PcHRpb24uaWNvbn0pYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWVudWl0ZW1PcHRpb24uY29tbWFuZExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAoX2EgPSBlbGVtZW50T3B0aW9uLmxpc3RlbmVycykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY29tbWFuZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyOiBtZW51aXRlbU9wdGlvbi5jb21tYW5kTGlzdGVuZXIsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBtZW51SXRlbSA9IHRoaXMudWkuY3JlYXRlRWxlbWVudChkb2MsIG1lbnVpdGVtT3B0aW9uLnRhZywgZWxlbWVudE9wdGlvbik7XHJcbiAgICAgICAgICAgIGlmIChtZW51aXRlbU9wdGlvbi5nZXRWaXNpYmlsaXR5KSB7XHJcbiAgICAgICAgICAgICAgICBwb3B1cC5hZGRFdmVudExpc3RlbmVyKFwicG9wdXBzaG93aW5nXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNob3dpbmcgPSBtZW51aXRlbU9wdGlvbi5nZXRWaXNpYmlsaXR5KG1lbnVJdGVtLCBldik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNob3dpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudUl0ZW0ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudUl0ZW0uc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWVudWl0ZW1PcHRpb24udGFnID09PSBcIm1lbnVcIikge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViUG9wdXAgPSB0aGlzLnVpLmNyZWF0ZUVsZW1lbnQoZG9jLCBcIm1lbnVwb3B1cFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IG1lbnVpdGVtT3B0aW9uLnBvcHVwSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogeyBvbnBvcHVwc2hvd2luZzogbWVudWl0ZW1PcHRpb24ub25wb3B1cHNob3dpbmcgfHwgXCJcIiB9LFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAoX2IgPSBtZW51aXRlbU9wdGlvbi5jaGlsZHJlbikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmZvckVhY2goKGNoaWxkT3B0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3ViUG9wdXAuYXBwZW5kKGdlbk1lbnVFbGVtZW50KGNoaWxkT3B0aW9uKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtLmFwcGVuZChzdWJQb3B1cCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1lbnVJdGVtO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgdG9wTWVudUl0ZW0gPSBnZW5NZW51RWxlbWVudChvcHRpb25zKTtcclxuICAgICAgICBpZiAoIWFuY2hvckVsZW1lbnQpIHtcclxuICAgICAgICAgICAgYW5jaG9yRWxlbWVudCA9IChpbnNlcnRQb3NpdGlvbiA9PT0gXCJhZnRlclwiXHJcbiAgICAgICAgICAgICAgICA/IHBvcHVwLmxhc3RFbGVtZW50Q2hpbGRcclxuICAgICAgICAgICAgICAgIDogcG9wdXAuZmlyc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhbmNob3JFbGVtZW50W2luc2VydFBvc2l0aW9uXSh0b3BNZW51SXRlbSk7XHJcbiAgICB9XHJcbiAgICB1bnJlZ2lzdGVyKG1lbnVJZCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICAoX2EgPSB0aGlzLmdldEdsb2JhbChcImRvY3VtZW50XCIpLnF1ZXJ5U2VsZWN0b3IoYCMke21lbnVJZH1gKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gICAgdW5yZWdpc3RlckFsbCgpIHtcclxuICAgICAgICB0aGlzLnVpLnVucmVnaXN0ZXJBbGwoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk1lbnVNYW5hZ2VyID0gTWVudU1hbmFnZXI7XHJcbnZhciBNZW51U2VsZWN0b3I7XHJcbihmdW5jdGlvbiAoTWVudVNlbGVjdG9yKSB7XHJcbiAgICBNZW51U2VsZWN0b3JbXCJtZW51RmlsZVwiXSA9IFwiI21lbnVfRmlsZVBvcHVwXCI7XHJcbiAgICBNZW51U2VsZWN0b3JbXCJtZW51RWRpdFwiXSA9IFwiI21lbnVfRWRpdFBvcHVwXCI7XHJcbiAgICBNZW51U2VsZWN0b3JbXCJtZW51Vmlld1wiXSA9IFwiI21lbnVfdmlld1BvcHVwXCI7XHJcbiAgICBNZW51U2VsZWN0b3JbXCJtZW51R29cIl0gPSBcIiNtZW51X2dvUG9wdXBcIjtcclxuICAgIE1lbnVTZWxlY3RvcltcIm1lbnVUb29sc1wiXSA9IFwiI21lbnVfVG9vbHNQb3B1cFwiO1xyXG4gICAgTWVudVNlbGVjdG9yW1wibWVudUhlbHBcIl0gPSBcIiNtZW51X0hlbHBQb3B1cFwiO1xyXG4gICAgTWVudVNlbGVjdG9yW1wiY29sbGVjdGlvblwiXSA9IFwiI3pvdGVyby1jb2xsZWN0aW9ubWVudVwiO1xyXG4gICAgTWVudVNlbGVjdG9yW1wiaXRlbVwiXSA9IFwiI3pvdGVyby1pdGVtbWVudVwiO1xyXG59KShNZW51U2VsZWN0b3IgfHwgKE1lbnVTZWxlY3RvciA9IHt9KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbnUuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuUHJlZmVyZW5jZVBhbmVNYW5hZ2VyID0gdm9pZCAwO1xyXG5jb25zdCB1aV8xID0gcmVxdWlyZShcIi4uL3Rvb2xzL3VpXCIpO1xyXG5jb25zdCBiYXNpY18xID0gcmVxdWlyZShcIi4uL2Jhc2ljXCIpO1xyXG4vKipcclxuICogUmVnaXN0ZXIgcHJlZmVyZW5jZSBwYW5lIGZyb20gWm90ZXJvIDcncyBgeGh0bWxgLCBmb3IgWm90ZXJvIDYgJiA3LlxyXG4gKiBAZGVwcmVjYXRlZCBVc2UgYFpvdGVyby5QcmVmZXJlbmNlUGFuZXMucmVnaXN0ZXJgIGluc3RlYWQuXHJcbiAqL1xyXG5jbGFzcyBQcmVmZXJlbmNlUGFuZU1hbmFnZXIgZXh0ZW5kcyBiYXNpY18xLk1hbmFnZXJUb29sIHtcclxuICAgIGNvbnN0cnVjdG9yKGJhc2UpIHtcclxuICAgICAgICBzdXBlcihiYXNlKTtcclxuICAgICAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnVpID0gbmV3IHVpXzEuVUlUb29sKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJlZlBhbmVDYWNoZSA9IHsgd2luOiB1bmRlZmluZWQsIGxpc3RlbmVyczoge30gfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgYSBwcmVmZXJlbmNlIHBhbmUgZnJvbSBhbiB4aHRtbCwgZm9yIFpvdGVybyA2ICYgNy5cclxuICAgICAqIEByZW1hcmtzXHJcbiAgICAgKiBEb24ndCBmb3JnZXQgdG8gY2FsbCBgdW5yZWdpc3RlclByZWZQYW5lYCBvbiBleGl0LlxyXG4gICAgICogQHJlbWFya3NcclxuICAgICAqIG9wdGlvbnM6XHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogZXhwb3J0IGludGVyZmFjZSBQcmVmUGFuZU9wdGlvbnMge1xyXG4gICAgICogICBwbHVnaW5JRDogc3RyaW5nO1xyXG4gICAgICogICBzcmM6IHN0cmluZztcclxuICAgICAqICAgaWQ/OiBzdHJpbmc7XHJcbiAgICAgKiAgIHBhcmVudD86IHN0cmluZztcclxuICAgICAqICAgbGFiZWw/OiBzdHJpbmc7XHJcbiAgICAgKiAgIGltYWdlPzogc3RyaW5nO1xyXG4gICAgICogICBleHRyYURURD86IHN0cmluZ1tdO1xyXG4gICAgICogICBzY3JpcHRzPzogc3RyaW5nW107XHJcbiAgICAgKiAgIGRlZmF1bHRYVUw/OiBib29sZWFuO1xyXG4gICAgICogICAvLyBPbmx5IGZvciBab3Rlcm8gNlxyXG4gICAgICogICBvbmxvYWQ/OiAod2luOiBXaW5kb3cpID0+IGFueTtcclxuICAgICAqIH1cclxuICAgICAqIGBgYFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBvcHRpb25zIFNlZSB7QGxpbmsgUHJlZlBhbmVPcHRpb25zfVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBjb25zdCBwcmVmc01hbmFnZXIgPSBuZXcgUHJlZmVyZW5jZVBhbmVNYW5hZ2VyKCk7XHJcbiAgICAgKiBmdW5jdGlvbiBpbml0UHJlZnMoKSB7XHJcbiAgICAgKiAgIGNvbnN0IHByZWZPcHRpb25zID0ge1xyXG4gICAgICogICAgIHBsdWdpbklEOiBhZGRvbklELFxyXG4gICAgICogICAgIHNyYzogcm9vdFVSSSArIFwiY2hyb21lL2NvbnRlbnQvcHJlZmVyZW5jZXMueGh0bWxcIixcclxuICAgICAqICAgICBsYWJlbDogXCJUZW1wbGF0ZVwiLFxyXG4gICAgICogICAgIGltYWdlOiBgY2hyb21lOi8vJHthZGRvblJlZn0vY29udGVudC9pY29ucy9mYXZpY29uLnBuZ2AsXHJcbiAgICAgKiAgICAgZXh0cmFEVEQ6IFtgY2hyb21lOi8vJHthZGRvblJlZn0vbG9jYWxlL292ZXJsYXkuZHRkYF0sXHJcbiAgICAgKiAgICAgZGVmYXVsdFhVTDogdHJ1ZVxyXG4gICAgICogICB9O1xyXG4gICAgICogICBwcmVmc01hbmFnZXIucmVnaXN0ZXIocHJlZk9wdGlvbnMpO1xyXG4gICAgICogfTtcclxuICAgICAqXHJcbiAgICAgKiBmdW5jdGlvbiB1bkluaXRQcmVmcygpIHtcclxuICAgICAqICAgcHJlZnNNYW5hZ2VyLnVucmVnaXN0ZXJBbGwoKTtcclxuICAgICAqIH07XHJcbiAgICAgKiBgYGBcclxuICAgICAqIC8vIGJvb3RzdHJhcC5qczpzdGFydHVwXHJcbiAgICAgKiBpbml0UHJlZnMoKTtcclxuICAgICAqXHJcbiAgICAgKiAvLyBib290c3RyYXAuanM6c2h1dGRvd25cclxuICAgICAqIHVuSW5pdFByZWZzKCk7XHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyKG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1pvdGVybzcoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKS5QcmVmZXJlbmNlUGFuZXMucmVnaXN0ZXIob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgX2luaXRJbXBvcnRlZE5vZGVzUG9zdEluc2VydCA9IChjb250YWluZXIpID0+IHtcclxuICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICBjb25zdCBfb2JzZXJ2ZXJTeW1ib2xzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgICAgICBjb25zdCBab3Rlcm8gPSB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKTtcclxuICAgICAgICAgICAgY29uc3Qgd2luZG93ID0gY29udGFpbmVyLm93bmVyR2xvYmFsO1xyXG4gICAgICAgICAgICBsZXQgdXNlQ2hlY2tlZCA9IChlbGVtKSA9PiAoZWxlbSBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSW5wdXRFbGVtZW50ICYmXHJcbiAgICAgICAgICAgICAgICBlbGVtLnR5cGUgPT0gXCJjaGVja2JveFwiKSB8fFxyXG4gICAgICAgICAgICAgICAgZWxlbS50YWdOYW1lID09IFwiY2hlY2tib3hcIjtcclxuICAgICAgICAgICAgbGV0IHN5bmNGcm9tUHJlZiA9IChlbGVtLCBwcmVmZXJlbmNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBab3Rlcm8uUHJlZnMuZ2V0KHByZWZlcmVuY2UsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHVzZUNoZWNrZWQoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLmNoZWNrZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsZW0uZGlzcGF0Y2hFdmVudChuZXcgd2luZG93LkV2ZW50KFwic3luY2Zyb21wcmVmZXJlbmNlXCIpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gV2UgdXNlIGEgc2luZ2xlIGxpc3RlbmVyIGZ1bmN0aW9uIHNoYXJlZCBiZXR3ZWVuIGFsbCBlbGVtZW50cyBzbyB3ZSBjYW4gZWFzaWx5IGRldGFjaCBpdCBsYXRlclxyXG4gICAgICAgICAgICBsZXQgc3luY1RvUHJlZk9uTW9kaWZ5ID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gZXZlbnQuY3VycmVudFRhcmdldDtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXROb2RlID09PSBudWxsIHx8IHRhcmdldE5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRhcmdldE5vZGUuZ2V0QXR0cmlidXRlKFwicHJlZmVyZW5jZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHVzZUNoZWNrZWQodGFyZ2V0Tm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyB0YXJnZXROb2RlLmNoZWNrZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiB0YXJnZXROb2RlLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIFpvdGVyby5QcmVmcy5zZXQodGFyZ2V0Tm9kZS5nZXRBdHRyaWJ1dGUoXCJwcmVmZXJlbmNlXCIpIHx8IFwiXCIsIHZhbHVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXROb2RlLmRpc3BhdGNoRXZlbnQobmV3IHdpbmRvdy5FdmVudChcInN5bmN0b3ByZWZlcmVuY2VcIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgYXR0YWNoVG9QcmVmZXJlbmNlID0gKGVsZW0sIHByZWZlcmVuY2UpID0+IHtcclxuICAgICAgICAgICAgICAgIFpvdGVyby5kZWJ1ZyhgQXR0YWNoaW5nIDwke2VsZW0udGFnTmFtZX0+IGVsZW1lbnQgdG8gJHtwcmVmZXJlbmNlfWApO1xyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgbGV0IHN5bWJvbCA9IFpvdGVyby5QcmVmcy5yZWdpc3Rlck9ic2VydmVyKHByZWZlcmVuY2UsICgpID0+IHN5bmNGcm9tUHJlZihlbGVtLCBwcmVmZXJlbmNlKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBfb2JzZXJ2ZXJTeW1ib2xzLnNldChlbGVtLCBzeW1ib2wpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgZGV0YWNoRnJvbVByZWZlcmVuY2UgPSAoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9vYnNlcnZlclN5bWJvbHMuaGFzKGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgWm90ZXJvLmRlYnVnKGBEZXRhY2hpbmcgPCR7ZWxlbS50YWdOYW1lfT4gZWxlbWVudCBmcm9tIHByZWZlcmVuY2VgKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgWm90ZXJvLlByZWZzLnVucmVnaXN0ZXJPYnNlcnZlcih0aGlzLl9vYnNlcnZlclN5bWJvbHMuZ2V0KGVsZW0pKTtcclxuICAgICAgICAgICAgICAgICAgICBfb2JzZXJ2ZXJTeW1ib2xzLmRlbGV0ZShlbGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gQWN0aXZhdGUgYHByZWZlcmVuY2VgIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgZm9yIChsZXQgZWxlbSBvZiBBcnJheS5mcm9tKGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiW3ByZWZlcmVuY2VdXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByZWZlcmVuY2UgPSBlbGVtLmdldEF0dHJpYnV0ZShcInByZWZlcmVuY2VcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJwcmVmZXJlbmNlcyA+IHByZWZlcmVuY2UjXCIgKyBwcmVmZXJlbmNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiPHByZWZlcmVuY2U+IGlzIGRlcHJlY2F0ZWQgLS0gYHByZWZlcmVuY2VgIGF0dHJpYnV0ZSB2YWx1ZXMgc2hvdWxkIGJlIGZ1bGwgcHJlZmVyZW5jZSBrZXlzLCBub3QgPHByZWZlcmVuY2U+IElEc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlID0gKF9hID0gY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKFwicHJlZmVyZW5jZXMgPiBwcmVmZXJlbmNlI1wiICsgcHJlZmVyZW5jZSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXR0YWNoVG9QcmVmZXJlbmNlKGVsZW0sIHByZWZlcmVuY2UpO1xyXG4gICAgICAgICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKHRoaXMuaXNYVUxFbGVtZW50KGVsZW0pID8gXCJjb21tYW5kXCIgOiBcImlucHV0XCIsIHN5bmNUb1ByZWZPbk1vZGlmeSk7XHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgdGltZW91dCBiZWZvcmUgcG9wdWxhdGluZyB0aGUgdmFsdWUgc28gdGhlIHBhbmUgY2FuIGFkZCBsaXN0ZW5lcnMgZmlyc3RcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzeW5jRnJvbVByZWYoZWxlbSwgcHJlZmVyZW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXcgd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT0gXCJhdHRyaWJ1dGVzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRhcmdldCA9IG11dGF0aW9uLnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWNoRnJvbVByZWZlcmVuY2UodGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5oYXNBdHRyaWJ1dGUoXCJwcmVmZXJlbmNlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hUb1ByZWZlcmVuY2UodGFyZ2V0LCB0YXJnZXQuZ2V0QXR0cmlidXRlKFwicHJlZmVyZW5jZVwiKSB8fCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHRoaXMuaXNYVUxFbGVtZW50KHRhcmdldCkgPyBcImNvbW1hbmRcIiA6IFwiaW5wdXRcIiwgc3luY1RvUHJlZk9uTW9kaWZ5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChtdXRhdGlvbi50eXBlID09IFwiY2hpbGRMaXN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbm9kZSBvZiBBcnJheS5mcm9tKG11dGF0aW9uLnJlbW92ZWROb2RlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGFjaEZyb21QcmVmZXJlbmNlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG5vZGUgb2YgQXJyYXkuZnJvbShtdXRhdGlvbi5hZGRlZE5vZGVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT0gd2luZG93Lk5vZGUuRUxFTUVOVF9OT0RFICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5oYXNBdHRyaWJ1dGUoXCJwcmVmZXJlbmNlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoVG9QcmVmZXJlbmNlKG5vZGUsIG5vZGUuZ2V0QXR0cmlidXRlKFwicHJlZmVyZW5jZVwiKSB8fCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5pc1hVTEVsZW1lbnQobm9kZSkgPyBcImNvbW1hbmRcIiA6IFwiaW5wdXRcIiwgc3luY1RvUHJlZk9uTW9kaWZ5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkub2JzZXJ2ZShjb250YWluZXIsIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcInByZWZlcmVuY2VcIl0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBwYXJzZVhVTFRvRnJhZ21lbnQoKSBkb2Vzbid0IGNvbnZlcnQgb25jb21tYW5kIGF0dHJpYnV0ZXMgaW50byBhY3R1YWxcclxuICAgICAgICAgICAgLy8gbGlzdGVuZXJzLCBzbyB3ZSdsbCBkbyBpdCBoZXJlXHJcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gb2YgQXJyYXkuZnJvbShjb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIltvbmNvbW1hbmRdXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbS5vbmNvbW1hbmQgPSBlbGVtLmdldEF0dHJpYnV0ZShcIm9uY29tbWFuZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZHJlbikpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmRpc3BhdGNoRXZlbnQobmV3IHdpbmRvdy5FdmVudChcImxvYWRcIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB3aW5kb3dMaXN0ZW5lciA9IHtcclxuICAgICAgICAgICAgb25PcGVuV2luZG93OiAoeHVsV2luZG93KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBBdm9pZCBtdWx0aXBsZSB0YWJzIHdoZW4gdW5yZWdpc3RlciBmYWlsc1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFsaXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2luID0geHVsV2luZG93XHJcbiAgICAgICAgICAgICAgICAgICAgLlF1ZXJ5SW50ZXJmYWNlKENvbXBvbmVudHMuaW50ZXJmYWNlcy5uc0lJbnRlcmZhY2VSZXF1ZXN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgLmdldEludGVyZmFjZShDb21wb25lbnRzLmludGVyZmFjZXMubnNJRE9NV2luZG93KTtcclxuICAgICAgICAgICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW4ubG9jYXRpb24uaHJlZiA9PT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjaHJvbWU6Ly96b3Rlcm8vY29udGVudC9wcmVmZXJlbmNlcy9wcmVmZXJlbmNlcy54dWxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhcInJlZ2lzdGVyUHJlZlBhbmU6ZGV0ZWN0ZWRcIiwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFpvdGVybyA9IHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmlkIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAob3B0aW9ucy5pZCA9IGBwbHVnaW4tJHtab3Rlcm8uVXRpbGl0aWVzLnJhbmRvbVN0cmluZygpfS0ke25ldyBEYXRlKCkuZ2V0VGltZSgpfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50T3JYSFIgPSBhd2FpdCBab3Rlcm8uRmlsZS5nZXRDb250ZW50c0FzeW5jKG9wdGlvbnMuc3JjKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IHR5cGVvZiBjb250ZW50T3JYSFIgPT09IFwic3RyaW5nXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY29udGVudE9yWEhSXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGNvbnRlbnRPclhIUi5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3JjID0gYDxwcmVmcGFuZSB4bWxucz1cImh0dHA6Ly93d3cubW96aWxsYS5vcmcva2V5bWFzdGVyL2dhdGVrZWVwZXIvdGhlcmUuaXMub25seS54dWxcIiBpZD1cIiR7b3B0aW9ucy5pZH1cIiBpbnNlcnRhZnRlcj1cInpvdGVyby1wcmVmcGFuZS1hZHZhbmNlZFwiIGxhYmVsPVwiJHtvcHRpb25zLmxhYmVsIHx8IG9wdGlvbnMucGx1Z2luSUR9XCIgaW1hZ2U9XCIke29wdGlvbnMuaW1hZ2UgfHwgXCJcIn1cIj5cclxuICAgICAgICAgICAgICAgICR7Y29udGVudH1cclxuICAgICAgICAgICAgICAgIDwvcHJlZnBhbmU+YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJhZyA9IHRoaXMudWkucGFyc2VYSFRNTFRvRnJhZ21lbnQoc3JjLCBvcHRpb25zLmV4dHJhRFRELCBvcHRpb25zLmRlZmF1bHRYVUwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhmcmFnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlZldpbmRvdyA9IHdpbi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwicHJlZndpbmRvd1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZldpbmRvdy5hcHBlbmRDaGlsZChmcmFnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlZlBhbmUgPSB3aW4uZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7b3B0aW9ucy5pZH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmV2luZG93LmFkZFBhbmUocHJlZlBhbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFbmFibGUgc2Nyb2xsLiBDaGVjayBpZiB0aGUgY29udGVudCBkb2VzIG92ZXJmbG93IHRoZSBib3ggbGF0ZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudEJveCA9IHdpbi5kb2N1bWVudC5nZXRBbm9ueW1vdXNOb2Rlcyh3aW4uZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7b3B0aW9ucy5pZH1gKSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3guc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEJveC5zdHlsZS5oZWlnaHQgPSBcIjQ0MHB4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlc2l6ZSB3aW5kb3csIG90aGVyd2lzZSB0aGUgbmV3IHByZWZwYW5lIG1heSBiZSBwbGFjZWQgb3V0IG9mIHRoZSB3aW5kb3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW4uc2l6ZVRvQ29udGVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEaXNhYmxlIHNjcm9sbCBpZiB0aGUgY29udGVudCBkb2VzIG5vdCBvdmVyZmxvdy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRCb3guc2Nyb2xsSGVpZ2h0ID09PSBjb250ZW50Qm94LmNsaWVudEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEJveC5zdHlsZS5vdmVyZmxvd1kgPSBcImhpZGRlblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlZlBhbmVDYWNoZS53aW4gPSB3aW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlZlBhbmVDYWNoZS5saXN0ZW5lcnNbb3B0aW9ucy5pZF0gPSB3aW5kb3dMaXN0ZW5lcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmluZGluZyBwcmVmZXJlbmNlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfaW5pdEltcG9ydGVkTm9kZXNQb3N0SW5zZXJ0KHByZWZQYW5lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChfYSA9IG9wdGlvbnMuc2NyaXB0cykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zY3JpcHRzLmZvckVhY2goKHNjcmlwdCkgPT4gU2VydmljZXMuc2NyaXB0bG9hZGVyLmxvYWRTdWJTY3JpcHQoc2NyaXB0LCB3aW4pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25sb2FkKHdpbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQ2xvc2VXaW5kb3c6ICgpID0+IHsgfSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNlcnZpY2VzLndtLmFkZExpc3RlbmVyKHdpbmRvd0xpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHVucmVnaXN0ZXIoaWQpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgY29uc3QgaWR4ID0gT2JqZWN0LmtleXModGhpcy5wcmVmUGFuZUNhY2hlLmxpc3RlbmVycykuaW5kZXhPZihpZCk7XHJcbiAgICAgICAgaWYgKGlkeCA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMucHJlZlBhbmVDYWNoZS5saXN0ZW5lcnNbaWRdO1xyXG4gICAgICAgIFNlcnZpY2VzLndtLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcclxuICAgICAgICBsaXN0ZW5lci5vbk9wZW5XaW5kb3cgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3Qgd2luID0gdGhpcy5wcmVmUGFuZUNhY2hlLndpbjtcclxuICAgICAgICBpZiAod2luICYmICF3aW4uY2xvc2VkKSB7XHJcbiAgICAgICAgICAgIChfYSA9IHdpbi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgdGhpcy5wcmVmUGFuZUNhY2hlLmxpc3RlbmVyc1tpZF07XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVucmVnaXN0ZXIgYWxsIHByZWZlcmVuY2UgcGFuZXMgYWRkZWQgd2l0aCB0aGlzIGluc3RhbmNlXHJcbiAgICAgKlxyXG4gICAgICogQ2FsbGVkIG9uIGV4aXRpbmdcclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3RlckFsbCgpIHtcclxuICAgICAgICB0aGlzLmFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgZm9yIChjb25zdCBpZCBpbiB0aGlzLnByZWZQYW5lQ2FjaGUubGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIHRoaXMudW5yZWdpc3RlcihpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUHJlZmVyZW5jZVBhbmVNYW5hZ2VyID0gUHJlZmVyZW5jZVBhbmVNYW5hZ2VyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVmZXJlbmNlUGFuZS5qcy5tYXAiLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5TaG9ydGN1dE1hbmFnZXIgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbmNvbnN0IHVpXzEgPSByZXF1aXJlKFwiLi4vdG9vbHMvdWlcIik7XHJcbmNvbnN0IGJhc2ljXzIgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbmNvbnN0IHRvb2xraXRHbG9iYWxfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi90b29sa2l0R2xvYmFsXCIpKTtcclxuLyoqXHJcbiAqIFJlZ2lzdGVyIHNob3J0Y3V0IGtleXMuXHJcbiAqIEBkZXByZWNhdGVkIFVzZSB7IEBsaW5rIEtleWJvYXJkTWFuYWdlcn0gaW5zdGVhZC5cclxuICovXHJcbmNsYXNzIFNob3J0Y3V0TWFuYWdlciBleHRlbmRzIGJhc2ljXzIuTWFuYWdlclRvb2wge1xyXG4gICAgY29uc3RydWN0b3IoYmFzZSkge1xyXG4gICAgICAgIHN1cGVyKGJhc2UpO1xyXG4gICAgICAgIHRoaXMudWkgPSBuZXcgdWlfMS5VSVRvb2wodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9ySWQgPSBgJHtab3Rlcm8uVXRpbGl0aWVzLnJhbmRvbVN0cmluZygpfS0ke25ldyBEYXRlKCkuZ2V0VGltZSgpfWA7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplR2xvYmFsKCk7XHJcbiAgICB9XHJcbiAgICByZWdpc3Rlcih0eXBlLCBrZXlPcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgX2tleU9wdGlvbnMgPSBrZXlPcHRpb25zO1xyXG4gICAgICAgIF9rZXlPcHRpb25zLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHN3aXRjaCAoX2tleU9wdGlvbnMudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiZXZlbnRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudEtleShfa2V5T3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgY2FzZSBcImVsZW1lbnRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50S2V5KF9rZXlPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBjYXNlIFwicHJlZnNcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpLlByZWZzLnNldChfa2V5T3B0aW9ucy5pZCwgX2tleU9wdGlvbnMua2V5IHx8IFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfa2V5T3B0aW9ucy5yZWdpc3Rlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2tleU9wdGlvbnMucmVnaXN0ZXIoX2tleU9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFsbCBzaG9ydGN1dHMoZWxlbWVudCwgZXZlbnQsIHByZWZzLCBidWlsdGluKVxyXG4gICAgICovXHJcbiAgICBnZXRBbGwoKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQodGhpcy5nZXRNYWluV2luZG93RWxlbWVudEtleXMoKSwgdGhpcy5nZXRFdmVudEtleXMoKSwgdGhpcy5nZXRQcmVmc0tleXMoKSwgdGhpcy5nZXRCdWlsdGluS2V5cygpKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sga2V5IGNvbmZsaWN0aW5nIG9mIGBpbnB1dEtleU9wdGlvbnNgLlxyXG4gICAgICogQHBhcmFtIGlucHV0S2V5T3B0aW9uc1xyXG4gICAgICogQHBhcmFtIG9wdGlvbnNcclxuICAgICAqIEByZXR1cm5zIGNvbmZsaWN0aW5nIGtleXMgYXJyYXlcclxuICAgICAqL1xyXG4gICAgY2hlY2tLZXlDb25mbGljdGluZyhpbnB1dEtleU9wdGlvbnMsIG9wdGlvbnMgPSB7IGluY2x1ZGVFbXB0eTogZmFsc2UsIGN1c3RvbUtleXM6IFtdIH0pIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgaW5wdXRLZXlPcHRpb25zLm1vZGlmaWVycyA9IG5ldyBLZXlNb2RpZmllcihpbnB1dEtleU9wdGlvbnMubW9kaWZpZXJzIHx8IFwiXCIpLmdldFJhdygpO1xyXG4gICAgICAgIGxldCBhbGxLZXlzID0gdGhpcy5nZXRBbGwoKTtcclxuICAgICAgICBpZiAoKF9hID0gb3B0aW9ucy5jdXN0b21LZXlzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGFsbEtleXMgPSBhbGxLZXlzLmNvbmNhdChvcHRpb25zLmN1c3RvbUtleXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW9wdGlvbnMuaW5jbHVkZUVtcHR5KSB7XHJcbiAgICAgICAgICAgIGFsbEtleXMgPSBhbGxLZXlzLmZpbHRlcigoX2tleU9wdGlvbnMpID0+IF9rZXlPcHRpb25zLmtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbGxLZXlzLmZpbHRlcigoX2tleU9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICAgICAgcmV0dXJuIF9rZXlPcHRpb25zLmlkICE9PSBpbnB1dEtleU9wdGlvbnMuaWQgJiZcclxuICAgICAgICAgICAgICAgICgoX2EgPSBfa2V5T3B0aW9ucy5rZXkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b0xvd2VyQ2FzZSgpKSA9PT0gKChfYiA9IGlucHV0S2V5T3B0aW9ucy5rZXkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi50b0xvd2VyQ2FzZSgpKSAmJlxyXG4gICAgICAgICAgICAgICAgX2tleU9wdGlvbnMubW9kaWZpZXJzID09PSBpbnB1dEtleU9wdGlvbnMubW9kaWZpZXJzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIGFsbCBrZXkgY29uZmxpY3RpbmcuXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xyXG4gICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgY29uZmxpY3Rpbmcga2V5cyBhcnJheXMuIFNhbWUgY29uZmxpY3Rpbmcga2V5cyBhcmUgcHV0IHRvZ2V0aGVyLlxyXG4gICAgICovXHJcbiAgICBjaGVja0FsbEtleUNvbmZsaWN0aW5nKG9wdGlvbnMgPSB7IGluY2x1ZGVFbXB0eTogZmFsc2UsIGN1c3RvbUtleXM6IFtdIH0pIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgbGV0IGFsbEtleXMgPSB0aGlzLmdldEFsbCgpO1xyXG4gICAgICAgIGlmICgoX2EgPSBvcHRpb25zLmN1c3RvbUtleXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgYWxsS2V5cyA9IGFsbEtleXMuY29uY2F0KG9wdGlvbnMuY3VzdG9tS2V5cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghb3B0aW9ucy5pbmNsdWRlRW1wdHkpIHtcclxuICAgICAgICAgICAgYWxsS2V5cyA9IGFsbEtleXMuZmlsdGVyKChfa2V5T3B0aW9ucykgPT4gX2tleU9wdGlvbnMua2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY29uZmxpY3RpbmcgPSBbXTtcclxuICAgICAgICB3aGlsZSAoYWxsS2V5cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrS2V5ID0gYWxsS2V5cy5wb3AoKTtcclxuICAgICAgICAgICAgY29uc3QgY29uZmxpY3RLZXlzID0gYWxsS2V5cy5maWx0ZXIoKF9rZXlPcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICgoX2EgPSBfa2V5T3B0aW9ucy5rZXkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b0xvd2VyQ2FzZSgpKSA9PT0gKChfYiA9IGNoZWNrS2V5LmtleSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnRvTG93ZXJDYXNlKCkpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgX2tleU9wdGlvbnMubW9kaWZpZXJzID09PSBjaGVja0tleS5tb2RpZmllcnM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoY29uZmxpY3RLZXlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uZmxpY3RLZXlzLnB1c2goY2hlY2tLZXkpO1xyXG4gICAgICAgICAgICAgICAgY29uZmxpY3RpbmcucHVzaChjb25mbGljdEtleXMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmxpY3RpbmdLZXlJZHMgPSBjb25mbGljdEtleXMubWFwKChrZXkpID0+IGtleS5pZCk7XHJcbiAgICAgICAgICAgICAgICAvLyBGaW5kIGluZGV4IGluIGFsbEtleXNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvUmVtb3ZlSWRzID0gW107XHJcbiAgICAgICAgICAgICAgICBhbGxLZXlzLmZvckVhY2goKGtleSwgaSkgPT4gY29uZmxpY3RpbmdLZXlJZHMuaW5jbHVkZXMoa2V5LmlkKSAmJiB0b1JlbW92ZUlkcy5wdXNoKGkpKTtcclxuICAgICAgICAgICAgICAgIC8vIFNvcnQgdG9SZW1vdmVJZHMgaW4gZGVjcmVhc2UgYW5kIHJlbW92ZSB0aGVzZSBrZXlzIGJ5IGlkXHJcbiAgICAgICAgICAgICAgICB0b1JlbW92ZUlkc1xyXG4gICAgICAgICAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBiIC0gYSlcclxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoaWQpID0+IGFsbEtleXMuc3BsaWNlKGlkLCAxKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbmZsaWN0aW5nO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGEga2V5LlxyXG4gICAgICogQHJlbWFya3NcclxuICAgICAqIGBidWlsdGluYCBrZXlzIGNhbm5vdCBiZSB1bnJlZ2lzdGVyZWQuXHJcbiAgICAgKiBAcGFyYW0ga2V5T3B0aW9uc1xyXG4gICAgICogQHJldHVybnMgYHRydWVgIGZvciBzdWNjZXNzIGFuZCBgZmFsc2VgIGZvciBmYWlsdXJlLlxyXG4gICAgICovXHJcbiAgICBhc3luYyB1bnJlZ2lzdGVyKGtleU9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgc3dpdGNoIChrZXlPcHRpb25zLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImVsZW1lbnRcIjpcclxuICAgICAgICAgICAgICAgIChfYSA9IChrZXlPcHRpb25zLnh1bERhdGEuZG9jdW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEdsb2JhbChcImRvY3VtZW50XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKGAjJHtrZXlPcHRpb25zLmlkfWApKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgY2FzZSBcInByZWZzXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKS5QcmVmcy5zZXQoa2V5T3B0aW9ucy5pZCwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgY2FzZSBcImJ1aWx0aW5cIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgY2FzZSBcImV2ZW50XCI6XHJcbiAgICAgICAgICAgICAgICBsZXQgaWR4ID0gdGhpcy5nbG9iYWxDYWNoZS5ldmVudEtleXMuZmluZEluZGV4KChjdXJyZW50S2V5KSA9PiBjdXJyZW50S2V5LmlkID09PSBrZXlPcHRpb25zLmlkKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2FjaGUuZXZlbnRLZXlzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkeCA9IHRoaXMuZ2xvYmFsQ2FjaGUuZXZlbnRLZXlzLmZpbmRJbmRleCgoY3VycmVudEtleSkgPT4gY3VycmVudEtleS5pZCA9PT0ga2V5T3B0aW9ucy5pZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleU9wdGlvbnMudW5yZWdpc3Rlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQga2V5T3B0aW9ucy51bnJlZ2lzdGVyKGtleU9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVW5yZWdpc3RlciBhbGwga2V5cyBjcmVhdGVkIGJ5IHRoaXMgaW5zdGFuY2UuXHJcbiAgICAgKi9cclxuICAgIHVucmVnaXN0ZXJBbGwoKSB7XHJcbiAgICAgICAgLy8gVW5yZWdpc3RlciBlbGVtZW50IGtleXNcclxuICAgICAgICB0aGlzLnVpLnVucmVnaXN0ZXJBbGwoKTtcclxuICAgICAgICAvLyBVbnJlZ2lzdGVyIGV2ZW50IGtleXNcclxuICAgICAgICB0aGlzLmdsb2JhbENhY2hlLmV2ZW50S2V5c1xyXG4gICAgICAgICAgICAuZmlsdGVyKChrZXlPcHRpb25zKSA9PiBrZXlPcHRpb25zLmNyZWF0b3JJZCA9PT0gdGhpcy5jcmVhdG9ySWQpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChrZXlPcHRpb25zKSA9PiB0aGlzLnVucmVnaXN0ZXIoa2V5T3B0aW9ucykpO1xyXG4gICAgfVxyXG4gICAgaW5pdGlhbGl6ZUdsb2JhbCgpIHtcclxuICAgICAgICBjb25zdCBab3Rlcm8gPSB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKTtcclxuICAgICAgICBjb25zdCB3aW5kb3cgPSB0aGlzLmdldEdsb2JhbChcIndpbmRvd1wiKTtcclxuICAgICAgICB0aGlzLmdsb2JhbENhY2hlID0gdG9vbGtpdEdsb2JhbF8xLmRlZmF1bHQuZ2V0SW5zdGFuY2UoKS5zaG9ydGN1dDtcclxuICAgICAgICBpZiAoIXRoaXMuZ2xvYmFsQ2FjaGUuX3JlYWR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2FjaGUuX3JlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBldmVudE1vZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGxldCBldmVudE1vZHNXaXRoQWNjZWwgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5hbHRLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudE1vZHMucHVzaChcImFsdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudE1vZHNXaXRoQWNjZWwucHVzaChcImFsdFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TW9kcy5wdXNoKFwic2hpZnRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRNb2RzV2l0aEFjY2VsLnB1c2goXCJzaGlmdFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRNb2RzLnB1c2goXCJtZXRhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFpvdGVyby5pc01hYyAmJiBldmVudE1vZHNXaXRoQWNjZWwucHVzaChcImFjY2VsXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudE1vZHMucHVzaChcImNvbnRyb2xcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgIVpvdGVyby5pc01hYyAmJiBldmVudE1vZHNXaXRoQWNjZWwucHVzaChcImFjY2VsXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnRNb2RTdHIgPSBuZXcgS2V5TW9kaWZpZXIoZXZlbnRNb2RzLmpvaW4oXCIsXCIpKS5nZXRSYXcoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50TW9kU3RyV2l0aEFjY2VsID0gbmV3IEtleU1vZGlmaWVyKGV2ZW50TW9kcy5qb2luKFwiLFwiKSkuZ2V0UmF3KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbENhY2hlLmV2ZW50S2V5cy5mb3JFYWNoKChrZXlPcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlPcHRpb25zLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kU3RyID0gbmV3IEtleU1vZGlmaWVyKGtleU9wdGlvbnMubW9kaWZpZXJzIHx8IFwiXCIpLmdldFJhdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgobW9kU3RyID09PSBldmVudE1vZFN0ciB8fCBtb2RTdHIgPT09IGV2ZW50TW9kU3RyV2l0aEFjY2VsKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoKF9hID0ga2V5T3B0aW9ucy5rZXkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b0xvd2VyQ2FzZSgpKSA9PT0gZXZlbnQua2V5LnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5T3B0aW9ucy5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZWdpc3RlckV2ZW50S2V5KGtleU9wdGlvbnMpIHtcclxuICAgICAgICBrZXlPcHRpb25zLmNyZWF0b3JJZCA9IHRoaXMuY3JlYXRvcklkO1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2FjaGUuZXZlbnRLZXlzLnB1c2goa2V5T3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIEVsZW1lbnQgXFw8Y29tbWFuZHNldFxcPi4gSW4gZ2VuZXJhbCwgdXNlIGByZWdpc3RlckVsZW1lbnRLZXlgIG9yIGByZWdpc3RlcktleWAuXHJcbiAgICAgKiBAcGFyYW0gY29tbWFuZFNldE9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJFbGVtZW50Q29tbWFuZHNldChjb21tYW5kU2V0T3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICAoX2EgPSBjb21tYW5kU2V0T3B0aW9ucy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwid2luZG93XCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYXBwZW5kQ2hpbGQodGhpcy51aS5jcmVhdGVFbGVtZW50KGNvbW1hbmRTZXRPcHRpb25zLmRvY3VtZW50LCBcImNvbW1hbmRzZXRcIiwge1xyXG4gICAgICAgICAgICBpZDogY29tbWFuZFNldE9wdGlvbnMuaWQsXHJcbiAgICAgICAgICAgIHNraXBJZkV4aXN0czogdHJ1ZSxcclxuICAgICAgICAgICAgY2hpbGRyZW46IGNvbW1hbmRTZXRPcHRpb25zLmNvbW1hbmRzLm1hcCgoY21kKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgdGFnOiBcImNvbW1hbmRcIixcclxuICAgICAgICAgICAgICAgIGlkOiBjbWQuaWQsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25jb21tYW5kOiBjbWQub25jb21tYW5kLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBjbWQuZGlzYWJsZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGNtZC5sYWJlbCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIEVsZW1lbnQgXFw8Y29tbWFuZFxcPi4gSW4gZ2VuZXJhbCwgdXNlIGByZWdpc3RlckVsZW1lbnRLZXlgIG9yIGByZWdpc3RlcktleWAuXHJcbiAgICAgKiBAcGFyYW0gY29tbWFuZE9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJFbGVtZW50Q29tbWFuZChjb21tYW5kT3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBpZiAoY29tbWFuZE9wdGlvbnMuX3BhcmVudElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50Q29tbWFuZHNldCh7XHJcbiAgICAgICAgICAgICAgICBpZDogY29tbWFuZE9wdGlvbnMuX3BhcmVudElkLFxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQ6IGNvbW1hbmRPcHRpb25zLmRvY3VtZW50LFxyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFtdLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKF9hID0gY29tbWFuZE9wdGlvbnMuZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoYGNvbW1hbmRzZXQjJHtjb21tYW5kT3B0aW9ucy5fcGFyZW50SWR9YCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hcHBlbmRDaGlsZCh0aGlzLnVpLmNyZWF0ZUVsZW1lbnQoY29tbWFuZE9wdGlvbnMuZG9jdW1lbnQsIFwiY29tbWFuZFwiLCB7XHJcbiAgICAgICAgICAgIGlkOiBjb21tYW5kT3B0aW9ucy5pZCxcclxuICAgICAgICAgICAgc2tpcElmRXhpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICBvbmNvbW1hbmQ6IGNvbW1hbmRPcHRpb25zLm9uY29tbWFuZCxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiBjb21tYW5kT3B0aW9ucy5kaXNhYmxlZCxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBjb21tYW5kT3B0aW9ucy5sYWJlbCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIEVsZW1lbnQgXFw8a2V5c2V0XFw+LiBJbiBnZW5lcmFsLCB1c2UgYHJlZ2lzdGVyRWxlbWVudEtleWAgb3IgYHJlZ2lzdGVyS2V5YC5cclxuICAgICAqIEBwYXJhbSBrZXlTZXRPcHRpb25zXHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyRWxlbWVudEtleXNldChrZXlTZXRPcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIChfYSA9IGtleVNldE9wdGlvbnMuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIndpbmRvd1wiKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFwcGVuZENoaWxkKHRoaXMudWkuY3JlYXRlRWxlbWVudChrZXlTZXRPcHRpb25zLmRvY3VtZW50LCBcImtleXNldFwiLCB7XHJcbiAgICAgICAgICAgIGlkOiBrZXlTZXRPcHRpb25zLmlkLFxyXG4gICAgICAgICAgICBza2lwSWZFeGlzdHM6IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBrZXlTZXRPcHRpb25zLmtleXMubWFwKChrZXlPcHRpb25zKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgdGFnOiBcImtleVwiLFxyXG4gICAgICAgICAgICAgICAgaWQ6IGtleU9wdGlvbnMuaWQsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25jb21tYW5kOiBrZXlPcHRpb25zLnh1bERhdGEub25jb21tYW5kIHx8IFwiLy9cIixcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiBrZXlPcHRpb25zLnh1bERhdGEuY29tbWFuZCxcclxuICAgICAgICAgICAgICAgICAgICBtb2RpZmllcnM6IGtleU9wdGlvbnMubW9kaWZpZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIGtleTogdGhpcy5nZXRYVUxLZXkoa2V5T3B0aW9ucy5rZXkpLFxyXG4gICAgICAgICAgICAgICAgICAgIGtleWNvZGU6IHRoaXMuZ2V0WFVMS2V5Q29kZShrZXlPcHRpb25zLmtleSksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGtleU9wdGlvbnMuZGlzYWJsZWQsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSksXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBhIHNob3J0Y3V0IGtleSBlbGVtZW50IFxcPGtleVxcPi5cclxuICAgICAqIEByZW1hcmtzXHJcbiAgICAgKiBQcm92aWRlIGBfcGFyZW50SWRgIHRvIHJlZ2lzdGVyIGEgXFw8a2V5c2V0XFw+O1xyXG4gICAgICpcclxuICAgICAqIFByb3ZpZGUgYF9jb21tYW5kT3B0aW9uc2AgdG8gcmVnaXN0ZXIgYSBcXDxjb21tYW5kXFw+O1xyXG4gICAgICpcclxuICAgICAqIFByb3ZpZGUgYF9wYXJlbnRJZGAgaW4gYF9jb21tYW5kT3B0aW9uc2AgdG8gcmVnaXN0ZXIgYSBcXDxjb21tYW5kc2V0XFw+LlxyXG4gICAgICpcclxuICAgICAqIFNlZSBleGFtcGxlcyBmb3IgbW9yZSBkZXRhaWxzLlxyXG4gICAgICogQHBhcmFtIGtleU9wdGlvbnNcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyRWxlbWVudEtleShrZXlPcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGNvbnN0IGRvYyA9IGtleU9wdGlvbnMueHVsRGF0YS5kb2N1bWVudCB8fCB0aGlzLmdldEdsb2JhbChcImRvY3VtZW50XCIpO1xyXG4gICAgICAgIGlmIChrZXlPcHRpb25zLnh1bERhdGEuX3BhcmVudElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50S2V5c2V0KHtcclxuICAgICAgICAgICAgICAgIGlkOiBrZXlPcHRpb25zLnh1bERhdGEuX3BhcmVudElkLFxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQ6IGRvYyxcclxuICAgICAgICAgICAgICAgIGtleXM6IFtdLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKF9hID0gZG9jLnF1ZXJ5U2VsZWN0b3IoYGtleXNldCMke2tleU9wdGlvbnMueHVsRGF0YS5fcGFyZW50SWR9YCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hcHBlbmRDaGlsZCh0aGlzLnVpLmNyZWF0ZUVsZW1lbnQoZG9jLCBcImtleVwiLCB7XHJcbiAgICAgICAgICAgIGlkOiBrZXlPcHRpb25zLmlkLFxyXG4gICAgICAgICAgICBza2lwSWZFeGlzdHM6IHRydWUsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgIG9uY29tbWFuZDoga2V5T3B0aW9ucy54dWxEYXRhLm9uY29tbWFuZCB8fCBcIi8vXCIsXHJcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBrZXlPcHRpb25zLnh1bERhdGEuY29tbWFuZCxcclxuICAgICAgICAgICAgICAgIG1vZGlmaWVyczoga2V5T3B0aW9ucy5tb2RpZmllcnMsXHJcbiAgICAgICAgICAgICAgICBrZXk6IHRoaXMuZ2V0WFVMS2V5KGtleU9wdGlvbnMua2V5KSxcclxuICAgICAgICAgICAgICAgIGtleWNvZGU6IHRoaXMuZ2V0WFVMS2V5Q29kZShrZXlPcHRpb25zLmtleSksXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDoga2V5T3B0aW9ucy5kaXNhYmxlZCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgaWYgKGtleU9wdGlvbnMueHVsRGF0YS5fY29tbWFuZE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnRDb21tYW5kKGtleU9wdGlvbnMueHVsRGF0YS5fY29tbWFuZE9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldFhVTEtleShzdGFuZGFyZEtleSkge1xyXG4gICAgICAgIGlmIChzdGFuZGFyZEtleS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YW5kYXJkS2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZ2V0WFVMS2V5Q29kZShzdGFuZGFyZEtleSkge1xyXG4gICAgICAgIGNvbnN0IGlkeCA9IE9iamVjdC52YWx1ZXMoWFVMX0tFWUNPREVfTUFQUykuZmluZEluZGV4KCh2YWx1ZSkgPT4gdmFsdWUgPT09IHN0YW5kYXJkS2V5KTtcclxuICAgICAgICBpZiAoaWR4ID49IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoWFVMX0tFWUNPREVfTUFQUylbaWR4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGdldFN0YW5kYXJkS2V5KFhVTEtleSwgWFVMS2V5Q29kZSkge1xyXG4gICAgICAgIGlmIChYVUxLZXlDb2RlICYmIE9iamVjdC5rZXlzKFhVTF9LRVlDT0RFX01BUFMpLmluY2x1ZGVzKFhVTEtleUNvZGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBYVUxfS0VZQ09ERV9NQVBTW1hVTEtleUNvZGVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFhVTEtleTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgXFw8Y29tbWFuZHNldFxcPiBkZXRhaWxzLlxyXG4gICAgICogQHBhcmFtIGRvY1xyXG4gICAgICovXHJcbiAgICBnZXRFbGVtZW50Q29tbWFuZFNldHMoZG9jKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oKGRvYyB8fCB0aGlzLmdldEdsb2JhbChcImRvY3VtZW50XCIpKS5xdWVyeVNlbGVjdG9yQWxsKFwiY29tbWFuZHNldFwiKSkubWFwKChjbWRTZXQpID0+ICh7XHJcbiAgICAgICAgICAgIGlkOiBjbWRTZXQuaWQsXHJcbiAgICAgICAgICAgIGNvbW1hbmRzOiBBcnJheS5mcm9tKGNtZFNldC5xdWVyeVNlbGVjdG9yQWxsKFwiY29tbWFuZFwiKSkubWFwKChjbWQpID0+ICh7XHJcbiAgICAgICAgICAgICAgICBpZDogY21kLmlkLFxyXG4gICAgICAgICAgICAgICAgb25jb21tYW5kOiBjbWQuZ2V0QXR0cmlidXRlKFwib25jb21tYW5kXCIpLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGNtZC5nZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSA9PT0gXCJ0cnVlXCIsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogY21kLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpLFxyXG4gICAgICAgICAgICAgICAgX3BhcmVudElkOiBjbWRTZXQuaWQsXHJcbiAgICAgICAgICAgIH0pKSxcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgXFw8Y29tbWFuZFxcPiBkZXRhaWxzLlxyXG4gICAgICogQHBhcmFtIGRvY1xyXG4gICAgICovXHJcbiAgICBnZXRFbGVtZW50Q29tbWFuZHMoZG9jKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQoLi4udGhpcy5nZXRFbGVtZW50Q29tbWFuZFNldHMoZG9jKS5tYXAoKGNtZFNldCkgPT4gY21kU2V0LmNvbW1hbmRzKSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgXFw8a2V5c2V0XFw+IGRldGFpbHMuXHJcbiAgICAgKiBAcGFyYW0gZG9jXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICBnZXRFbGVtZW50S2V5U2V0cyhkb2MpIHtcclxuICAgICAgICBsZXQgYWxsQ29tbWVuZHMgPSB0aGlzLmdldEVsZW1lbnRDb21tYW5kcyhkb2MpO1xyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKChkb2MgfHwgdGhpcy5nZXRHbG9iYWwoXCJkb2N1bWVudFwiKSkucXVlcnlTZWxlY3RvckFsbChcImtleXNldFwiKSkubWFwKChrZXlzZXRFbGVtKSA9PiAoe1xyXG4gICAgICAgICAgICBpZDoga2V5c2V0RWxlbS5pZCxcclxuICAgICAgICAgICAgZG9jdW1lbnQ6IGRvYyxcclxuICAgICAgICAgICAga2V5czogQXJyYXkuZnJvbShrZXlzZXRFbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJrZXlcIikpLm1hcCgoa2V5RWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb25jb21tYW5kID0ga2V5RWxlbS5nZXRBdHRyaWJ1dGUoXCJvbmNvbW1hbmRcIikgfHwgXCJcIjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRJZCA9IGtleUVsZW0uZ2V0QXR0cmlidXRlKFwiY29tbWFuZFwiKSB8fCBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tbWFuZE9wdGlvbnMgPSBhbGxDb21tZW5kcy5maW5kKChjbWQpID0+IGNtZC5pZCA9PT0gY29tbWFuZElkKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImVsZW1lbnRcIixcclxuICAgICAgICAgICAgICAgICAgICBpZDoga2V5RWxlbS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IHRoaXMuZ2V0U3RhbmRhcmRLZXkoa2V5RWxlbS5nZXRBdHRyaWJ1dGUoXCJrZXlcIikgfHwgXCJcIiwga2V5RWxlbS5nZXRBdHRyaWJ1dGUoXCJrZXljb2RlXCIpIHx8IFwiXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyczogbmV3IEtleU1vZGlmaWVyKGtleUVsZW0uZ2V0QXR0cmlidXRlKFwibW9kaWZpZXJzXCIpIHx8IFwiXCIpLmdldFJhdygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBrZXlFbGVtLmdldEF0dHJpYnV0ZShcImRpc2FibGVkXCIpID09PSBcInRydWVcIixcclxuICAgICAgICAgICAgICAgICAgICB4dWxEYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50OiBkb2MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY29tbWFuZDogb25jb21tYW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9wYXJlbnRJZDoga2V5c2V0RWxlbS5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NvbW1hbmRPcHRpb25zOiBjb21tYW5kT3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdpbiA9IGRvYy5vd25lckdsb2JhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX2V2YWwgPSB3aW4uZXZhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2V2YWwob25jb21tYW5kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2V2YWwoKGNvbW1hbmRPcHRpb25zID09PSBudWxsIHx8IGNvbW1hbmRPcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb21tYW5kT3B0aW9ucy5vbmNvbW1hbmQpIHx8IFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYWxsIFxcPGtleVxcPiBkZXRhaWxzLlxyXG4gICAgICogQHBhcmFtIGRvY1xyXG4gICAgICogQHBhcmFtIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgZ2V0RWxlbWVudEtleXMoZG9jKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZVxyXG4gICAgICAgICAgICAuY29uY2F0KC4uLnRoaXMuZ2V0RWxlbWVudEtleVNldHMoZG9jKS5tYXAoKGtleXNldCkgPT4ga2V5c2V0LmtleXMpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKChlbGVtS2V5KSA9PiAhRUxFTV9LRVlfSUdOT1JFLmluY2x1ZGVzKGVsZW1LZXkuaWQpKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IFxcPGtleVxcPiBkZXRhaWxzIGluIG1haW4gd2luZG93LlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgZ2V0TWFpbldpbmRvd0VsZW1lbnRLZXlzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEVsZW1lbnRLZXlzKHRoaXMuZ2V0R2xvYmFsKFwiZG9jdW1lbnRcIikpO1xyXG4gICAgfVxyXG4gICAgZ2V0RXZlbnRLZXlzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdsb2JhbENhY2hlLmV2ZW50S2V5cztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IFpvdGVybyBidWlsdGluIGtleXMgZGVmaW5lZCBpbiBwcmVmZXJlbmNlcy5cclxuICAgICAqL1xyXG4gICAgZ2V0UHJlZnNLZXlzKCkge1xyXG4gICAgICAgIGNvbnN0IFpvdGVybyA9IHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpO1xyXG4gICAgICAgIHJldHVybiBQUkVGX0tFWVMubWFwKChwcmVmKSA9PiAoe1xyXG4gICAgICAgICAgICBpZDogcHJlZi5pZCxcclxuICAgICAgICAgICAgbW9kaWZpZXJzOiBwcmVmLm1vZGlmaWVycyxcclxuICAgICAgICAgICAga2V5OiBab3Rlcm8uUHJlZnMuZ2V0KHByZWYuaWQpLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogcHJlZi5jYWxsYmFjayxcclxuICAgICAgICAgICAgdHlwZTogXCJwcmVmc1wiLFxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IFpvdGVybyBidWlsdGluIGtleXMgbm90IGRlZmluZWQgaW4gcHJlZmVyZW5jZXMuXHJcbiAgICAgKi9cclxuICAgIGdldEJ1aWx0aW5LZXlzKCkge1xyXG4gICAgICAgIHJldHVybiBCVUlMVElOX0tFWVMubWFwKChidWlsdGluKSA9PiAoe1xyXG4gICAgICAgICAgICBpZDogYnVpbHRpbi5pZCxcclxuICAgICAgICAgICAgbW9kaWZpZXJzOiBidWlsdGluLm1vZGlmaWVycyxcclxuICAgICAgICAgICAga2V5OiBidWlsdGluLmtleSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGJ1aWx0aW4uY2FsbGJhY2ssXHJcbiAgICAgICAgICAgIHR5cGU6IFwiYnVpbHRpblwiLFxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlNob3J0Y3V0TWFuYWdlciA9IFNob3J0Y3V0TWFuYWdlcjtcclxuY2xhc3MgS2V5TW9kaWZpZXIge1xyXG4gICAgY29uc3RydWN0b3IocmF3KSB7XHJcbiAgICAgICAgcmF3ID0gcmF3IHx8IFwiXCI7XHJcbiAgICAgICAgdGhpcy5hY2NlbCA9IHJhdy5pbmNsdWRlcyhcImFjY2VsXCIpO1xyXG4gICAgICAgIHRoaXMuc2hpZnQgPSByYXcuaW5jbHVkZXMoXCJzaGlmdFwiKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wgPSByYXcuaW5jbHVkZXMoXCJjb250cm9sXCIpO1xyXG4gICAgICAgIHRoaXMubWV0YSA9IHJhdy5pbmNsdWRlcyhcIm1ldGFcIik7XHJcbiAgICAgICAgdGhpcy5hbHQgPSByYXcuaW5jbHVkZXMoXCJhbHRcIik7XHJcbiAgICB9XHJcbiAgICBlcXVhbHMobmV3TW9kKSB7XHJcbiAgICAgICAgdGhpcy5hY2NlbCA9PT0gbmV3TW9kLmFjY2VsO1xyXG4gICAgICAgIHRoaXMuc2hpZnQgPT09IG5ld01vZC5zaGlmdDtcclxuICAgICAgICB0aGlzLmNvbnRyb2wgPT09IG5ld01vZC5jb250cm9sO1xyXG4gICAgICAgIHRoaXMubWV0YSA9PT0gbmV3TW9kLm1ldGE7XHJcbiAgICAgICAgdGhpcy5hbHQgPT09IG5ld01vZC5hbHQ7XHJcbiAgICB9XHJcbiAgICBnZXRSYXcoKSB7XHJcbiAgICAgICAgY29uc3QgZW5hYmxlZCA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWNjZWwgJiYgZW5hYmxlZC5wdXNoKFwiYWNjZWxcIik7XHJcbiAgICAgICAgdGhpcy5zaGlmdCAmJiBlbmFibGVkLnB1c2goXCJzaGlmdFwiKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wgJiYgZW5hYmxlZC5wdXNoKFwiY29udHJvbFwiKTtcclxuICAgICAgICB0aGlzLm1ldGEgJiYgZW5hYmxlZC5wdXNoKFwibWV0YVwiKTtcclxuICAgICAgICB0aGlzLmFsdCAmJiBlbmFibGVkLnB1c2goXCJhbHRcIik7XHJcbiAgICAgICAgcmV0dXJuIGVuYWJsZWQuam9pbihcIixcIik7XHJcbiAgICB9XHJcbn1cclxudmFyIFhVTF9LRVlDT0RFX01BUFM7XHJcbihmdW5jdGlvbiAoWFVMX0tFWUNPREVfTUFQUykge1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0NBTkNFTFwiXSA9IFwiVW5pZGVudGlmaWVkXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfQkFDS1wiXSA9IFwiQmFja3NwYWNlXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfVEFCXCJdID0gXCJUYWJcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19DTEVBUlwiXSA9IFwiQ2xlYXJcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19SRVRVUk5cIl0gPSBcIkVudGVyXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfRU5URVJcIl0gPSBcIkVudGVyXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfU0hJRlRcIl0gPSBcIlNoaWZ0XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfQ09OVFJPTFwiXSA9IFwiQ29udHJvbFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0FMVFwiXSA9IFwiQWx0XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfUEFVU0VcIl0gPSBcIlBhdXNlXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfQ0FQU19MT0NLXCJdID0gXCJDYXBzTG9ja1wiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0VTQ0FQRVwiXSA9IFwiRXNjYXBlXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfU1BBQ0VcIl0gPSBcIiBcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19QQUdFX1VQXCJdID0gXCJQYWdlVXBcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19QQUdFX0RPV05cIl0gPSBcIlBhZ2VEb3duXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfRU5EXCJdID0gXCJFbmRcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19IT01FXCJdID0gXCJIb21lXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfTEVGVFwiXSA9IFwiQXJyb3dMZWZ0XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfVVBcIl0gPSBcIkFycm93VXBcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19SSUdIVFwiXSA9IFwiQXJyb3dSaWdodFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0RPV05cIl0gPSBcIkFycm93RG93blwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX1BSSU5UU0NSRUVOXCJdID0gXCJQcmludFNjcmVlblwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0lOU0VSVFwiXSA9IFwiSW5zZXJ0XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfREVMRVRFXCJdID0gXCJCYWNrc3BhY2VcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS18wXCJdID0gXCIwXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfMVwiXSA9IFwiMVwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLXzJcIl0gPSBcIjJcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS18zXCJdID0gXCIzXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfNFwiXSA9IFwiNFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLXzVcIl0gPSBcIjVcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS182XCJdID0gXCI2XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfN1wiXSA9IFwiN1wiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLXzhcIl0gPSBcIjhcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS185XCJdID0gXCI5XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfQVwiXSA9IFwiQVwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0JcIl0gPSBcIkJcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19DXCJdID0gXCJDXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfRFwiXSA9IFwiRFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0VcIl0gPSBcIkVcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GXCJdID0gXCJGXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfR1wiXSA9IFwiR1wiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0hcIl0gPSBcIkhcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19JXCJdID0gXCJJXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfSlwiXSA9IFwiSlwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0tcIl0gPSBcIktcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19MXCJdID0gXCJMXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfTVwiXSA9IFwiTVwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX05cIl0gPSBcIk5cIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19PXCJdID0gXCJPXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfUFwiXSA9IFwiUFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX1FcIl0gPSBcIlFcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19SXCJdID0gXCJSXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfU1wiXSA9IFwiU1wiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX1RcIl0gPSBcIlRcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19VXCJdID0gXCJVXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfVlwiXSA9IFwiVlwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX1dcIl0gPSBcIldcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19YXCJdID0gXCJYXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfWVwiXSA9IFwiWVwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX1pcIl0gPSBcIlpcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19TRU1JQ09MT05cIl0gPSBcIlVuaWRlbnRpZmllZFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0VRVUFMU1wiXSA9IFwiVW5pZGVudGlmaWVkXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfTlVNUEFEMFwiXSA9IFwiMFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX05VTVBBRDFcIl0gPSBcIjFcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19OVU1QQUQyXCJdID0gXCIyXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfTlVNUEFEM1wiXSA9IFwiM1wiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX05VTVBBRDRcIl0gPSBcIjRcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19OVU1QQUQ1XCJdID0gXCI1XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfTlVNUEFENlwiXSA9IFwiNlwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX05VTVBBRDdcIl0gPSBcIjdcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19OVU1QQUQ4XCJdID0gXCI4XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfTlVNUEFEOVwiXSA9IFwiOVwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX01VTFRJUExZXCJdID0gXCJNdWx0aXBseVwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0FERFwiXSA9IFwiQWRkXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfU0VQQVJBVE9SXCJdID0gXCJTZXBhcmF0b3JcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19TVUJUUkFDVFwiXSA9IFwiU3VidHJhY3RcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19ERUNJTUFMXCJdID0gXCJEZWNpbWFsXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfRElWSURFXCJdID0gXCJEaXZpZGVcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GMVwiXSA9IFwiRjFcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GMlwiXSA9IFwiRjJcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GM1wiXSA9IFwiRjNcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GNFwiXSA9IFwiRjRcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GNVwiXSA9IFwiRjVcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GNlwiXSA9IFwiRjZcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GN1wiXSA9IFwiRjdcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GOFwiXSA9IFwiRjhcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GOVwiXSA9IFwiRjlcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GMTBcIl0gPSBcIkYxMFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0YxMVwiXSA9IFwiRjExXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfRjEyXCJdID0gXCJGMTJcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GMTNcIl0gPSBcIkYxM1wiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0YxNFwiXSA9IFwiRjE0XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfRjE1XCJdID0gXCJGMTVcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GMTZcIl0gPSBcIkYxNlwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0YxN1wiXSA9IFwiRjE3XCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfRjE4XCJdID0gXCJGMThcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GMTlcIl0gPSBcIkYxOVwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0YyMFwiXSA9IFwiRjIwXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfRjIxXCJdID0gXCJTb2Z0MVwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX0YyMlwiXSA9IFwiU29mdDJcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19GMjNcIl0gPSBcIlNvZnQzXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfRjI0XCJdID0gXCJTb2Z0NFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX05VTV9MT0NLXCJdID0gXCJOdW1Mb2NrXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfU0NST0xMX0xPQ0tcIl0gPSBcIlNjcm9sbExvY2tcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19DT01NQVwiXSA9IFwiLFwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX1BFUklPRFwiXSA9IFwiLlwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX1NMQVNIXCJdID0gXCJEaXZpZGVcIjtcclxuICAgIFhVTF9LRVlDT0RFX01BUFNbXCJWS19CQUNLX1FVT1RFXCJdID0gXCJgXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfT1BFTl9CUkFDS0VUXCJdID0gXCJbXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfQ0xPU0VfQlJBQ0tFVFwiXSA9IFwiXVwiO1xyXG4gICAgWFVMX0tFWUNPREVfTUFQU1tcIlZLX1FVT1RFXCJdID0gXCJcXFxcXCI7XHJcbiAgICBYVUxfS0VZQ09ERV9NQVBTW1wiVktfSEVMUFwiXSA9IFwiSGVscFwiO1xyXG59KShYVUxfS0VZQ09ERV9NQVBTIHx8IChYVUxfS0VZQ09ERV9NQVBTID0ge30pKTtcclxuZnVuY3Rpb24gZ2V0RWxlbWVudEtleUNhbGxiYWNrKGtleUlkKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBjb25zdCB3aW4gPSBiYXNpY18xLkJhc2ljVG9vbC5nZXRab3Rlcm8oKS5nZXRNYWluV2luZG93KCk7XHJcbiAgICAgICAgY29uc3Qga2V5RWxlbSA9IHdpbi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtrZXlJZH1gKTtcclxuICAgICAgICBpZiAoIWtleUVsZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHsgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgX2V2YWwgPSB3aW4uZXZhbDtcclxuICAgICAgICBfZXZhbChrZXlFbGVtLmdldEF0dHJpYnV0ZShcIm9uY29tbWFuZFwiKSB8fCBcIi8vXCIpO1xyXG4gICAgICAgIGNvbnN0IGNtZElkID0ga2V5RWxlbS5nZXRBdHRyaWJ1dGUoXCJjb21tYW5kXCIpO1xyXG4gICAgICAgIGlmICghY21kSWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfZXZhbCgoKF9hID0gd2luLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2NtZElkfWApKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0QXR0cmlidXRlKFwib25jb21tYW5kXCIpKSB8fCBcIi8vXCIpO1xyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBnZXRCdWlsdGluRXZlbnRLZXlDYWxsYmFjayhldmVudElkKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IFpvdGVybyA9IGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpO1xyXG4gICAgICAgIGNvbnN0IFpvdGVyb1BhbmUgPSBab3Rlcm8uZ2V0QWN0aXZlWm90ZXJvUGFuZSgpO1xyXG4gICAgICAgIFpvdGVyb1BhbmUuaGFuZGxlS2V5UHJlc3Moe1xyXG4gICAgICAgICAgICBtZXRhS2V5OiB0cnVlLFxyXG4gICAgICAgICAgICBjdHJsS2V5OiB0cnVlLFxyXG4gICAgICAgICAgICBzaGlmdEtleTogdHJ1ZSxcclxuICAgICAgICAgICAgb3JpZ2luYWxUYXJnZXQ6IHsgaWQ6IFwiXCIgfSxcclxuICAgICAgICAgICAgcHJldmVudERlZmF1bHQ6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAga2V5OiBab3Rlcm8uUHJlZnMuZ2V0KGBleHRlbnNpb25zLnpvdGVyby5rZXlzLiR7ZXZlbnRJZH1gLCB0cnVlKSxcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn1cclxuY29uc3QgRUxFTV9LRVlfSUdOT1JFID0gW1wia2V5X2NvcHlDaXRhdGlvblwiLCBcImtleV9jb3B5QmlibGlvZ3JhcGh5XCJdO1xyXG5jb25zdCBQUkVGX0tFWVMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6IFwiZXh0ZW5zaW9ucy56b3Rlcm8ua2V5cy5jb3B5U2VsZWN0ZWRJdGVtQ2l0YXRpb25zVG9DbGlwYm9hcmRcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiYWNjZWwsc2hpZnRcIixcclxuICAgICAgICBlbGVtSWQ6IFwia2V5X2NvcHlDaXRhdGlvblwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiBnZXRFbGVtZW50S2V5Q2FsbGJhY2soXCJrZXlfY29weUNpdGF0aW9uXCIpLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBpZDogXCJleHRlbnNpb25zLnpvdGVyby5rZXlzLmNvcHlTZWxlY3RlZEl0ZW1zVG9DbGlwYm9hcmRcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiYWNjZWwsc2hpZnRcIixcclxuICAgICAgICBlbGVtSWQ6IFwia2V5X2NvcHlCaWJsaW9ncmFwaHlcIixcclxuICAgICAgICBjYWxsYmFjazogZ2V0RWxlbWVudEtleUNhbGxiYWNrKFwia2V5X2NvcHlCaWJsaW9ncmFwaHlcIiksXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcImV4dGVuc2lvbnMuem90ZXJvLmtleXMubGlicmFyeVwiLFxyXG4gICAgICAgIG1vZGlmaWVyczogXCJhY2NlbCxzaGlmdFwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiBnZXRCdWlsdGluRXZlbnRLZXlDYWxsYmFjayhcImxpYnJhcnlcIiksXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcImV4dGVuc2lvbnMuem90ZXJvLmtleXMubmV3SXRlbVwiLFxyXG4gICAgICAgIG1vZGlmaWVyczogXCJhY2NlbCxzaGlmdFwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiBnZXRCdWlsdGluRXZlbnRLZXlDYWxsYmFjayhcIm5ld0l0ZW1cIiksXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcImV4dGVuc2lvbnMuem90ZXJvLmtleXMubmV3Tm90ZVwiLFxyXG4gICAgICAgIG1vZGlmaWVyczogXCJhY2NlbCxzaGlmdFwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiBnZXRCdWlsdGluRXZlbnRLZXlDYWxsYmFjayhcIm5ld05vdGVcIiksXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcImV4dGVuc2lvbnMuem90ZXJvLmtleXMucXVpY2tzZWFyY2hcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiYWNjZWwsc2hpZnRcIixcclxuICAgICAgICBjYWxsYmFjazogZ2V0QnVpbHRpbkV2ZW50S2V5Q2FsbGJhY2soXCJxdWlja3NlYXJjaFwiKSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6IFwiZXh0ZW5zaW9ucy56b3Rlcm8ua2V5cy5zYXZlVG9ab3Rlcm9cIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiYWNjZWwsc2hpZnRcIixcclxuICAgICAgICBjYWxsYmFjazogZ2V0QnVpbHRpbkV2ZW50S2V5Q2FsbGJhY2soXCJzYXZlVG9ab3Rlcm9cIiksXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcImV4dGVuc2lvbnMuem90ZXJvLmtleXMuc3luY1wiLFxyXG4gICAgICAgIG1vZGlmaWVyczogXCJhY2NlbCxzaGlmdFwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiBnZXRCdWlsdGluRXZlbnRLZXlDYWxsYmFjayhcInN5bmNcIiksXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcImV4dGVuc2lvbnMuem90ZXJvLmtleXMudG9nZ2xlQWxsUmVhZFwiLFxyXG4gICAgICAgIG1vZGlmaWVyczogXCJhY2NlbCxzaGlmdFwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiBnZXRCdWlsdGluRXZlbnRLZXlDYWxsYmFjayhcInRvZ2dsZUFsbFJlYWRcIiksXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcImV4dGVuc2lvbnMuem90ZXJvLmtleXMudG9nZ2xlUmVhZFwiLFxyXG4gICAgICAgIG1vZGlmaWVyczogXCJhY2NlbCxzaGlmdFwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiBnZXRCdWlsdGluRXZlbnRLZXlDYWxsYmFjayhcInRvZ2dsZVJlYWRcIiksXHJcbiAgICB9LFxyXG5dO1xyXG5jb25zdCBCVUlMVElOX0tFWVMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6IFwic2hvd0l0ZW1Db2xsZWN0aW9uXCIsXHJcbiAgICAgICAgbW9kaWZpZXJzOiBcIlwiLFxyXG4gICAgICAgIGtleTogXCJDdHJsXCIsXHJcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgWm90ZXJvID0gYmFzaWNfMS5CYXNpY1Rvb2wuZ2V0Wm90ZXJvKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IFpvdGVyb1BhbmUgPSBab3Rlcm8uZ2V0QWN0aXZlWm90ZXJvUGFuZSgpO1xyXG4gICAgICAgICAgICBab3Rlcm9QYW5lLmhhbmRsZUtleVVwKHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVGFyZ2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IFpvdGVyb1BhbmUuaXRlbXNWaWV3ID8gWm90ZXJvUGFuZS5pdGVtc1ZpZXcuaWQgOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGtleUNvZGU6IFpvdGVyby5pc1dpbiA/IDE3IDogMTgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcImNsb3NlU2VsZWN0ZWRUYWJcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiYWNjZWxcIixcclxuICAgICAgICBrZXk6IFwiV1wiLFxyXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHp0YWJzID0gYmFzaWNfMS5CYXNpY1Rvb2wuZ2V0Wm90ZXJvKCkuZ2V0TWFpbldpbmRvdygpXHJcbiAgICAgICAgICAgICAgICAuWm90ZXJvX1RhYnM7XHJcbiAgICAgICAgICAgIGlmICh6dGFicy5zZWxlY3RlZEluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgenRhYnMuY2xvc2UoXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBpZDogXCJ1bmRvQ2xvc2VUYWJcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiYWNjZWwsc2hpZnRcIixcclxuICAgICAgICBrZXk6IFwiVFwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHp0YWJzID0gYmFzaWNfMS5CYXNpY1Rvb2wuZ2V0Wm90ZXJvKCkuZ2V0TWFpbldpbmRvdygpXHJcbiAgICAgICAgICAgICAgICAuWm90ZXJvX1RhYnM7XHJcbiAgICAgICAgICAgIHp0YWJzLnVuZG9DbG9zZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcInNlbGVjdE5leHRUYWJcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiY29udHJvbFwiLFxyXG4gICAgICAgIGtleTogXCJUYWJcIixcclxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB6dGFicyA9IGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpLmdldE1haW5XaW5kb3coKVxyXG4gICAgICAgICAgICAgICAgLlpvdGVyb19UYWJzO1xyXG4gICAgICAgICAgICB6dGFicy5zZWxlY3RQcmV2KCk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6IFwic2VsZWN0UHJldmlvdXNUYWJcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiY29udHJvbCxzaGlmdFwiLFxyXG4gICAgICAgIGtleTogXCJUYWJcIixcclxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB6dGFicyA9IGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpLmdldE1haW5XaW5kb3coKVxyXG4gICAgICAgICAgICAgICAgLlpvdGVyb19UYWJzO1xyXG4gICAgICAgICAgICB6dGFicy5zZWxlY3ROZXh0KCk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6IFwic2VsZWN0VGFiMVwiLFxyXG4gICAgICAgIG1vZGlmaWVyczogXCJhY2NlbFwiLFxyXG4gICAgICAgIGtleTogXCIxXCIsXHJcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgenRhYnMgPSBiYXNpY18xLkJhc2ljVG9vbC5nZXRab3Rlcm8oKS5nZXRNYWluV2luZG93KClcclxuICAgICAgICAgICAgICAgIC5ab3Rlcm9fVGFicztcclxuICAgICAgICAgICAgenRhYnMuanVtcCgwKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBpZDogXCJzZWxlY3RUYWIyXCIsXHJcbiAgICAgICAgbW9kaWZpZXJzOiBcImFjY2VsXCIsXHJcbiAgICAgICAga2V5OiBcIjJcIixcclxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB6dGFicyA9IGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpLmdldE1haW5XaW5kb3coKVxyXG4gICAgICAgICAgICAgICAgLlpvdGVyb19UYWJzO1xyXG4gICAgICAgICAgICB6dGFicy5qdW1wKDEpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcInNlbGVjdFRhYjNcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiYWNjZWxcIixcclxuICAgICAgICBrZXk6IFwiM1wiLFxyXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHp0YWJzID0gYmFzaWNfMS5CYXNpY1Rvb2wuZ2V0Wm90ZXJvKCkuZ2V0TWFpbldpbmRvdygpXHJcbiAgICAgICAgICAgICAgICAuWm90ZXJvX1RhYnM7XHJcbiAgICAgICAgICAgIHp0YWJzLmp1bXAoMik7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6IFwic2VsZWN0VGFiNFwiLFxyXG4gICAgICAgIG1vZGlmaWVyczogXCJhY2NlbFwiLFxyXG4gICAgICAgIGtleTogXCI0XCIsXHJcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgenRhYnMgPSBiYXNpY18xLkJhc2ljVG9vbC5nZXRab3Rlcm8oKS5nZXRNYWluV2luZG93KClcclxuICAgICAgICAgICAgICAgIC5ab3Rlcm9fVGFicztcclxuICAgICAgICAgICAgenRhYnMuanVtcCgzKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBpZDogXCJzZWxlY3RUYWI1XCIsXHJcbiAgICAgICAgbW9kaWZpZXJzOiBcImFjY2VsXCIsXHJcbiAgICAgICAga2V5OiBcIjVcIixcclxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB6dGFicyA9IGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpLmdldE1haW5XaW5kb3coKVxyXG4gICAgICAgICAgICAgICAgLlpvdGVyb19UYWJzO1xyXG4gICAgICAgICAgICB6dGFicy5qdW1wKDQpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcInNlbGVjdFRhYjZcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiYWNjZWxcIixcclxuICAgICAgICBrZXk6IFwiNlwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHp0YWJzID0gYmFzaWNfMS5CYXNpY1Rvb2wuZ2V0Wm90ZXJvKCkuZ2V0TWFpbldpbmRvdygpXHJcbiAgICAgICAgICAgICAgICAuWm90ZXJvX1RhYnM7XHJcbiAgICAgICAgICAgIHp0YWJzLmp1bXAoNSk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6IFwic2VsZWN0VGFiN1wiLFxyXG4gICAgICAgIG1vZGlmaWVyczogXCJhY2NlbFwiLFxyXG4gICAgICAgIGtleTogXCI3XCIsXHJcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgenRhYnMgPSBiYXNpY18xLkJhc2ljVG9vbC5nZXRab3Rlcm8oKS5nZXRNYWluV2luZG93KClcclxuICAgICAgICAgICAgICAgIC5ab3Rlcm9fVGFicztcclxuICAgICAgICAgICAgenRhYnMuanVtcCg2KTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBpZDogXCJzZWxlY3RUYWI4XCIsXHJcbiAgICAgICAgbW9kaWZpZXJzOiBcImFjY2VsXCIsXHJcbiAgICAgICAga2V5OiBcIjhcIixcclxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB6dGFicyA9IGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpLmdldE1haW5XaW5kb3coKVxyXG4gICAgICAgICAgICAgICAgLlpvdGVyb19UYWJzO1xyXG4gICAgICAgICAgICB6dGFicy5qdW1wKDcpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiBcInNlbGVjdFRhYkxhc3RcIixcclxuICAgICAgICBtb2RpZmllcnM6IFwiYWNjZWxcIixcclxuICAgICAgICBrZXk6IFwiOVwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHp0YWJzID0gYmFzaWNfMS5CYXNpY1Rvb2wuZ2V0Wm90ZXJvKCkuZ2V0TWFpbldpbmRvdygpXHJcbiAgICAgICAgICAgICAgICAuWm90ZXJvX1RhYnM7XHJcbiAgICAgICAgICAgIHp0YWJzLnNlbGVjdExhc3QoKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuXTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2hvcnRjdXQuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuQ2xpcGJvYXJkSGVscGVyID0gdm9pZCAwO1xyXG5jb25zdCBiYXNpY18xID0gcmVxdWlyZShcIi4uL2Jhc2ljXCIpO1xyXG4vKipcclxuICogQ29weSBoZWxwZXIgZm9yIHRleHQvcmljaHRleHQvaW1hZ2UuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIENvcHkgcGxhaW4gdGV4dFxyXG4gKiBgYGB0c1xyXG4gKiBuZXcgQ2xpcGJvYXJkSGVscGVyKCkuYWRkVGV4dChcInBsYWluXCIsIFwidGV4dC91bmljb2RlXCIpLmNvcHkoKTtcclxuICogYGBgXHJcbiAqIEBleGFtcGxlXHJcbiAqIENvcHkgcGxhaW4gdGV4dCAmIHJpY2ggdGV4dFxyXG4gKiBgYGB0c1xyXG4gKiBuZXcgQ2xpcGJvYXJkSGVscGVyKCkuYWRkVGV4dChcInBsYWluXCIsIFwidGV4dC91bmljb2RlXCIpXHJcbiAqICAgICAgICAgICAgICAgICAgICAgLmFkZFRleHQoXCI8aDE+cmljaCB0ZXh0PC9oMT5cIiwgXCJ0ZXh0L2h0bWxcIilcclxuICogICAgICAgICAgICAgICAgICAgICAuY29weSgpO1xyXG4gKiBgYGBcclxuICogQGV4YW1wbGVcclxuICogQ29weSBwbGFpbiB0ZXh0LCByaWNoIHRleHQgJiBpbWFnZVxyXG4gKiBgYGB0c1xyXG4gKiBuZXcgQ2xpcGJvYXJkSGVscGVyKCkuYWRkVGV4dChcInBsYWluXCIsIFwidGV4dC91bmljb2RlXCIpXHJcbiAqICAgICAgICAgICAgICAgICAgICAgLmFkZFRleHQoXCI8aDE+cmljaCB0ZXh0PC9oMT5cIiwgXCJ0ZXh0L2h0bWxcIilcclxuICogICAgICAgICAgICAgICAgICAgICAuYWRkSW1hZ2UoXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsLi4uXCIpXHJcbiAqICAgICAgICAgICAgICAgICAgICAgLmNvcHkoKTtcclxuICogYGBgXHJcbiAqL1xyXG5jbGFzcyBDbGlwYm9hcmRIZWxwZXIgZXh0ZW5kcyBiYXNpY18xLkJhc2ljVG9vbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuZmlsZVBhdGggPSBcIlwiO1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLnRyYW5zZmVyYWJsZSA9IENvbXBvbmVudHMuY2xhc3Nlc1tcIkBtb3ppbGxhLm9yZy93aWRnZXQvdHJhbnNmZXJhYmxlOzFcIl0uY3JlYXRlSW5zdGFuY2UoQ29tcG9uZW50cy5pbnRlcmZhY2VzLm5zSVRyYW5zZmVyYWJsZSk7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuY2xpcGJvYXJkU2VydmljZSA9IENvbXBvbmVudHMuY2xhc3Nlc1tcIkBtb3ppbGxhLm9yZy93aWRnZXQvY2xpcGJvYXJkOzFcIl0uZ2V0U2VydmljZShDb21wb25lbnRzLmludGVyZmFjZXMubnNJQ2xpcGJvYXJkKTtcclxuICAgICAgICB0aGlzLnRyYW5zZmVyYWJsZS5pbml0KG51bGwpO1xyXG4gICAgfVxyXG4gICAgYWRkVGV4dChzb3VyY2UsIHR5cGUgPSBcInRleHQvcGxhaW5cIikge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBjb25zdCBzdHIgPSBDb21wb25lbnRzLmNsYXNzZXNbXCJAbW96aWxsYS5vcmcvc3VwcG9ydHMtc3RyaW5nOzFcIl0uY3JlYXRlSW5zdGFuY2UoQ29tcG9uZW50cy5pbnRlcmZhY2VzLm5zSVN1cHBvcnRzU3RyaW5nKTtcclxuICAgICAgICBzdHIuZGF0YSA9IHNvdXJjZTtcclxuICAgICAgICAvLyBDb21wYXRpYmxlIHRvIHRleHQvdW5pY29kZSBpbiBmeDExNVxyXG4gICAgICAgIGlmICh0aGlzLmlzRlgxMTUoKSAmJiB0eXBlID09PSBcInRleHQvdW5pY29kZVwiKVxyXG4gICAgICAgICAgICB0eXBlID0gXCJ0ZXh0L3BsYWluXCI7XHJcbiAgICAgICAgdGhpcy50cmFuc2ZlcmFibGUuYWRkRGF0YUZsYXZvcih0eXBlKTtcclxuICAgICAgICB0aGlzLnRyYW5zZmVyYWJsZS5zZXRUcmFuc2ZlckRhdGEodHlwZSwgc3RyLCBzb3VyY2UubGVuZ3RoICogMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRJbWFnZShzb3VyY2UpIHtcclxuICAgICAgICBsZXQgcGFydHMgPSBzb3VyY2Uuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgIGlmICghcGFydHNbMF0uaW5jbHVkZXMoXCJiYXNlNjRcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtaW1lID0gcGFydHNbMF0ubWF0Y2goLzooLio/KTsvKVsxXTtcclxuICAgICAgICBsZXQgYnN0ciA9IHRoaXMuZ2V0R2xvYmFsKFwid2luZG93XCIpLmF0b2IocGFydHNbMV0pO1xyXG4gICAgICAgIGxldCBuID0gYnN0ci5sZW5ndGg7XHJcbiAgICAgICAgbGV0IHU4YXJyID0gbmV3IFVpbnQ4QXJyYXkobik7XHJcbiAgICAgICAgd2hpbGUgKG4tLSkge1xyXG4gICAgICAgICAgICB1OGFycltuXSA9IGJzdHIuY2hhckNvZGVBdChuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGxldCBpbWdUb29scyA9IENvbXBvbmVudHMuY2xhc3Nlc1tcIkBtb3ppbGxhLm9yZy9pbWFnZS90b29sczsxXCJdLmdldFNlcnZpY2UoQ29tcG9uZW50cy5pbnRlcmZhY2VzLmltZ0lUb29scyk7XHJcbiAgICAgICAgbGV0IG1pbWVUeXBlO1xyXG4gICAgICAgIGxldCBpbWc7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpLnBsYXRmb3JtTWFqb3JWZXJzaW9uID49IDEwMikge1xyXG4gICAgICAgICAgICBpbWcgPSBpbWdUb29scy5kZWNvZGVJbWFnZUZyb21BcnJheUJ1ZmZlcih1OGFyci5idWZmZXIsIG1pbWUpO1xyXG4gICAgICAgICAgICBtaW1lVHlwZSA9IFwiYXBwbGljYXRpb24veC1tb3otbmF0aXZlaW1hZ2VcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG1pbWVUeXBlID0gYGltYWdlL3BuZ2A7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgaW1nID0gQ29tcG9uZW50cy5jbGFzc2VzW1wiQG1vemlsbGEub3JnL3N1cHBvcnRzLWludGVyZmFjZS1wb2ludGVyOzFcIl0uY3JlYXRlSW5zdGFuY2UoQ29tcG9uZW50cy5pbnRlcmZhY2VzLm5zSVN1cHBvcnRzSW50ZXJmYWNlUG9pbnRlcik7XHJcbiAgICAgICAgICAgIGltZy5kYXRhID0gaW1nVG9vbHMuZGVjb2RlSW1hZ2VGcm9tQXJyYXlCdWZmZXIodThhcnIuYnVmZmVyLCBtaW1lVHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudHJhbnNmZXJhYmxlLmFkZERhdGFGbGF2b3IobWltZVR5cGUpO1xyXG4gICAgICAgIHRoaXMudHJhbnNmZXJhYmxlLnNldFRyYW5zZmVyRGF0YShtaW1lVHlwZSwgaW1nLCAwKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEZpbGUocGF0aCkge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBjb25zdCBmaWxlID0gQ29tcG9uZW50cy5jbGFzc2VzW1wiQG1vemlsbGEub3JnL2ZpbGUvbG9jYWw7MVwiXS5jcmVhdGVJbnN0YW5jZShDb21wb25lbnRzLmludGVyZmFjZXMubnNJRmlsZSk7XHJcbiAgICAgICAgZmlsZS5pbml0V2l0aFBhdGgocGF0aCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2ZlcmFibGUuYWRkRGF0YUZsYXZvcihcImFwcGxpY2F0aW9uL3gtbW96LWZpbGVcIik7XHJcbiAgICAgICAgdGhpcy50cmFuc2ZlcmFibGUuc2V0VHJhbnNmZXJEYXRhKFwiYXBwbGljYXRpb24veC1tb3otZmlsZVwiLCBmaWxlKTtcclxuICAgICAgICB0aGlzLmZpbGVQYXRoID0gcGF0aDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGNvcHkoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5jbGlwYm9hcmRTZXJ2aWNlLnNldERhdGEodGhpcy50cmFuc2ZlcmFibGUsIG51bGwsIENvbXBvbmVudHMuaW50ZXJmYWNlcy5uc0lDbGlwYm9hcmQua0dsb2JhbENsaXBib2FyZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8vIEZvciB1bmtub3duIHJlYXNvbnMsIG9uIE1hY09TIHRoZSBjb3B5IHdpbGwgdGhyb3cgMHg4MDAwNDAwNSBlcnJvci5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsZVBhdGggJiYgWm90ZXJvLmlzTWFjKSB7XHJcbiAgICAgICAgICAgICAgICBab3Rlcm8uVXRpbGl0aWVzLkludGVybmFsLmV4ZWMoYC91c3IvYmluL29zYXNjcmlwdGAsIFtcclxuICAgICAgICAgICAgICAgICAgICBgLWVgLFxyXG4gICAgICAgICAgICAgICAgICAgIGBzZXQgdGhlIGNsaXBib2FyZCB0byBQT1NJWCBmaWxlIFwiJHt0aGlzLmZpbGVQYXRofVwiYCxcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkNsaXBib2FyZEhlbHBlciA9IENsaXBib2FyZEhlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xpcGJvYXJkLmpzLm1hcCIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkZpbGVQaWNrZXJIZWxwZXIgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbi8qKlxyXG4gKiBGaWxlIHBpY2tlciBoZWxwZXIuXHJcbiAqIEBwYXJhbSB0aXRsZSB3aW5kb3cgdGl0bGVcclxuICogQHBhcmFtIG1vZGVcclxuICogQHBhcmFtIGZpbHRlcnMgQXJyYXk8W2hpbnQgc3RyaW5nLCBmaWx0ZXIgc3RyaW5nXT5cclxuICogQHBhcmFtIHN1Z2dlc3Rpb24gZGVmYXVsdCBmaWxlL2ZvbGRlclxyXG4gKiBAcGFyYW0gd2luZG93IHRoZSBwYXJlbnQgd2luZG93LiBCeSBkZWZhdWx0IGl0IGlzIHRoZSBtYWluIHdpbmRvd1xyXG4gKiBAcGFyYW0gZmlsdGVyTWFzayBidWlsdC1pbiBmaWx0ZXJzXHJcbiAqIEBwYXJhbSBkaXJlY3RvcnkgZGlyZWN0b3J5IGluIHdoaWNoIHRvIG9wZW4gdGhlIGZpbGUgcGlja2VyXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGF3YWl0IG5ldyBGaWxlUGlja2VySGVscGVyKFxyXG4gKiAgIGAke1pvdGVyby5nZXRTdHJpbmcoXCJmaWxlSW50ZXJmYWNlLmltcG9ydFwiKX0gTWFya0Rvd24gRG9jdW1lbnRgLFxyXG4gKiAgIFwib3BlblwiLFxyXG4gKiAgIFtbXCJNYXJrRG93biBGaWxlKCoubWQpXCIsIFwiKi5tZFwiXV1cclxuICogKS5vcGVuKCk7XHJcbiAqIGBgYFxyXG4gKi9cclxuY2xhc3MgRmlsZVBpY2tlckhlbHBlciBleHRlbmRzIGJhc2ljXzEuQmFzaWNUb29sIHtcclxuICAgIGNvbnN0cnVjdG9yKHRpdGxlLCBtb2RlLCBmaWx0ZXJzLCBzdWdnZXN0aW9uLCB3aW5kb3csIGZpbHRlck1hc2ssIGRpcmVjdG9yeSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMubW9kZSA9IG1vZGU7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gZmlsdGVycztcclxuICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0b3J5ID0gZGlyZWN0b3J5O1xyXG4gICAgICAgIHRoaXMud2luZG93ID0gd2luZG93O1xyXG4gICAgICAgIHRoaXMuZmlsdGVyTWFzayA9IGZpbHRlck1hc2s7XHJcbiAgICB9XHJcbiAgICBhc3luYyBvcGVuKCkge1xyXG4gICAgICAgIGxldCBiYWNrZW5kO1xyXG4gICAgICAgIGlmICh0aGlzLmlzRlgxMTUoKSkge1xyXG4gICAgICAgICAgICBiYWNrZW5kID0gQ2hyb21lVXRpbHMuaW1wb3J0RVNNb2R1bGUoXCJjaHJvbWU6Ly96b3Rlcm8vY29udGVudC9tb2R1bGVzL2ZpbGVQaWNrZXIubWpzXCIpLkZpbGVQaWNrZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBiYWNrZW5kID0gdGhpcy5nZXRHbG9iYWwoXCJyZXF1aXJlXCIpKFwiem90ZXJvL21vZHVsZXMvZmlsZVBpY2tlclwiKS5kZWZhdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBmcCA9IG5ldyBiYWNrZW5kKCk7XHJcbiAgICAgICAgZnAuaW5pdCh0aGlzLndpbmRvdyB8fCB0aGlzLmdldEdsb2JhbChcIndpbmRvd1wiKSwgdGhpcy50aXRsZSwgdGhpcy5nZXRNb2RlKGZwKSk7XHJcbiAgICAgICAgZm9yIChjb25zdCBbbGFiZWwsIGV4dF0gb2YgdGhpcy5maWx0ZXJzIHx8IFtdKSB7XHJcbiAgICAgICAgICAgIGZwLmFwcGVuZEZpbHRlcihsYWJlbCwgZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyTWFzaylcclxuICAgICAgICAgICAgZnAuYXBwZW5kRmlsdGVycyh0aGlzLmdldEZpbHRlck1hc2soZnApKTtcclxuICAgICAgICBpZiAodGhpcy5zdWdnZXN0aW9uKVxyXG4gICAgICAgICAgICBmcC5kZWZhdWx0U3RyaW5nID0gdGhpcy5zdWdnZXN0aW9uO1xyXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdG9yeSlcclxuICAgICAgICAgICAgZnAuZGlzcGxheURpcmVjdG9yeSA9IHRoaXMuZGlyZWN0b3J5O1xyXG4gICAgICAgIGNvbnN0IHVzZXJDaG9pY2UgPSBhd2FpdCBmcC5zaG93KCk7XHJcbiAgICAgICAgc3dpdGNoICh1c2VyQ2hvaWNlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgZnAucmV0dXJuT0s6XHJcbiAgICAgICAgICAgIGNhc2UgZnAucmV0dXJuUmVwbGFjZTpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGUgPT09IFwibXVsdGlwbGVcIiA/IGZwLmZpbGVzIDogZnAuZmlsZTtcclxuICAgICAgICAgICAgZGVmYXVsdDogLy8gYWthIHJldHVybkNhbmNlbFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldE1vZGUoZnApIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwib3BlblwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZwLm1vZGVPcGVuO1xyXG4gICAgICAgICAgICBjYXNlIFwic2F2ZVwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZwLm1vZGVTYXZlO1xyXG4gICAgICAgICAgICBjYXNlIFwiZm9sZGVyXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnAubW9kZUdldEZvbGRlcjtcclxuICAgICAgICAgICAgY2FzZSBcIm11bHRpcGxlXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnAubW9kZU9wZW5NdWx0aXBsZTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldEZpbHRlck1hc2soZnApIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZmlsdGVyTWFzaykge1xyXG4gICAgICAgICAgICBjYXNlIFwiYWxsXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnAuZmlsdGVyQWxsO1xyXG4gICAgICAgICAgICBjYXNlIFwiaHRtbFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZwLmZpbHRlckhUTUw7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnAuZmlsdGVyVGV4dDtcclxuICAgICAgICAgICAgY2FzZSBcImltYWdlc1wiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZwLmZpbHRlckltYWdlcztcclxuICAgICAgICAgICAgY2FzZSBcInhtbFwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZwLmZpbHRlclhNTDtcclxuICAgICAgICAgICAgY2FzZSBcImFwcHNcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBmcC5maWx0ZXJBcHBzO1xyXG4gICAgICAgICAgICBjYXNlIFwidXJsc1wiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZwLmZpbHRlckFsbG93VVJMcztcclxuICAgICAgICAgICAgY2FzZSBcImF1ZGlvXCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnAuZmlsdGVyQXVkaW87XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2aWRlb1wiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZwLmZpbHRlclZpZGVvO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDB4MDAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLkZpbGVQaWNrZXJIZWxwZXIgPSBGaWxlUGlja2VySGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWxlUGlja2VyLmpzLm1hcCIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlByb2dyZXNzV2luZG93SGVscGVyID0gdm9pZCAwO1xyXG5jb25zdCBiYXNpY18xID0gcmVxdWlyZShcIi4uL2Jhc2ljXCIpO1xyXG4vKipcclxuICogUHJvZ3Jlc3NXaW5kb3cgaGVscGVyLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBTaG93IGEgcG9wdXAgd2l0aCBzdWNjZXNzIGljb25cclxuICogYGBgdHNcclxuICogY29uc3QgdG9vbCA9IG5ldyBab3Rlcm9Ub29sKCk7XHJcbiAqIHRvb2wuY3JlYXRlUHJvZ3Jlc3NXaW5kb3coXCJBZGRvblwiKS5jcmVhdGVMaW5lKHtcclxuICogICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICogICB0ZXh0OiBcIkZpbmlzaFwiXHJcbiAqICAgcHJvZ3Jlc3M6IDEwMCxcclxuICogfSkuc2hvdygpO1xyXG4gKiBgYGBcclxuICogQGV4YW1wbGVcclxuICogU2hvdyBhIHBvcHVwIGFuZCBjaGFuZ2UgbGluZSBjb250ZW50XHJcbiAqIGBgYHRzXHJcbiAqIGNvbnN0IGNvbXBhdCA9IG5ldyBab3Rlcm9Db21wYXQoKTtcclxuICogY29uc3QgdG9vbCA9IG5ldyBab3Rlcm9Ub29sKCk7XHJcbiAqIGNvbnN0IHBvcHVwV2luID0gdG9vbC5jcmVhdGVQcm9ncmVzc1dpbmRvdyhcIkFkZG9uXCIpLmNyZWF0ZUxpbmUoe1xyXG4gKiAgIHRleHQ6IFwiTG9hZGluZ1wiXHJcbiAqICAgcHJvZ3Jlc3M6IDUwLFxyXG4gKiB9KS5zaG93KC0xKTtcclxuICogLy8gRG8gb3BlcmF0aW9uc1xyXG4gKiBjb21wYXQuZ2V0R2xvYmFsKFwic2V0VGltZW91dFwiKSgoKT0+e1xyXG4gKiAgIHBvcHVwV2luLmNoYW5nZUxpbmUoe1xyXG4gKiAgICAgdGV4dDogXCJGaW5pc2hcIixcclxuICogICAgIHByb2dyZXNzOiAxMDAsXHJcbiAqICAgfSk7XHJcbiAqIH0sIDMwMDApO1xyXG4gKiBgYGBcclxuICovXHJcbmNsYXNzIFByb2dyZXNzV2luZG93SGVscGVyIGV4dGVuZHMgWm90ZXJvLlByb2dyZXNzV2luZG93IHtcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBoZWFkZXIgd2luZG93IGhlYWRlclxyXG4gICAgICogQHBhcmFtIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoaGVhZGVyLCBvcHRpb25zID0ge1xyXG4gICAgICAgIGNsb3NlT25DbGljazogdHJ1ZSxcclxuICAgICAgICBjbG9zZVRpbWU6IDUwMDAsXHJcbiAgICB9KSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5saW5lcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2xvc2VUaW1lID0gb3B0aW9ucy5jbG9zZVRpbWUgfHwgNTAwMDtcclxuICAgICAgICB0aGlzLmNoYW5nZUhlYWRsaW5lKGhlYWRlcik7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbFNob3cgPSB0aGlzXHJcbiAgICAgICAgICAgIC5zaG93O1xyXG4gICAgICAgIHRoaXMuc2hvdyA9IHRoaXMuc2hvd1dpdGhUaW1lcjtcclxuICAgICAgICBpZiAob3B0aW9ucy5jbG9zZU90aGVyUHJvZ3Jlc3NXaW5kb3dzKSB7XHJcbiAgICAgICAgICAgIGJhc2ljXzEuQmFzaWNUb29sLmdldFpvdGVybygpLlByb2dyZXNzV2luZG93U2V0LmNsb3NlQWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBuZXcgbGluZVxyXG4gICAgICogQHBhcmFtIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgY3JlYXRlTGluZShvcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgaWNvbiA9IHRoaXMuZ2V0SWNvbihvcHRpb25zLnR5cGUsIG9wdGlvbnMuaWNvbik7XHJcbiAgICAgICAgY29uc3QgbGluZSA9IG5ldyB0aGlzLkl0ZW1Qcm9ncmVzcyhpY29uIHx8IFwiXCIsIG9wdGlvbnMudGV4dCB8fCBcIlwiKTtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMucHJvZ3Jlc3MgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgbGluZS5zZXRQcm9ncmVzcyhvcHRpb25zLnByb2dyZXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saW5lcy5wdXNoKGxpbmUpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSWNvbnMoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2hhbmdlIHRoZSBsaW5lIGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSBvcHRpb25zXHJcbiAgICAgKi9cclxuICAgIGNoYW5nZUxpbmUob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBpZiAoKChfYSA9IHRoaXMubGluZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpZHggPSB0eXBlb2Ygb3B0aW9ucy5pZHggIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgICAgICAgb3B0aW9ucy5pZHggPj0gMCAmJlxyXG4gICAgICAgICAgICBvcHRpb25zLmlkeCA8IHRoaXMubGluZXMubGVuZ3RoXHJcbiAgICAgICAgICAgID8gb3B0aW9ucy5pZHhcclxuICAgICAgICAgICAgOiAwO1xyXG4gICAgICAgIGNvbnN0IGljb24gPSB0aGlzLmdldEljb24ob3B0aW9ucy50eXBlLCBvcHRpb25zLmljb24pO1xyXG4gICAgICAgIGlmIChpY29uKSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgdGhpcy5saW5lc1tpZHhdLnNldEl0ZW1UeXBlQW5kSWNvbihpY29uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3B0aW9ucy50ZXh0ICYmIHRoaXMubGluZXNbaWR4XS5zZXRUZXh0KG9wdGlvbnMudGV4dCk7XHJcbiAgICAgICAgdHlwZW9mIG9wdGlvbnMucHJvZ3Jlc3MgPT09IFwibnVtYmVyXCIgJiZcclxuICAgICAgICAgICAgdGhpcy5saW5lc1tpZHhdLnNldFByb2dyZXNzKG9wdGlvbnMucHJvZ3Jlc3MpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSWNvbnMoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNob3dXaXRoVGltZXIoY2xvc2VUaW1lID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbFNob3coKTtcclxuICAgICAgICB0eXBlb2YgY2xvc2VUaW1lICE9PSBcInVuZGVmaW5lZFwiICYmICh0aGlzLmNsb3NlVGltZSA9IGNsb3NlVGltZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VUaW1lICYmIHRoaXMuY2xvc2VUaW1lID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Q2xvc2VUaW1lcih0aGlzLmNsb3NlVGltZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldFRpbWVvdXQodGhpcy51cGRhdGVJY29ucy5iaW5kKHRoaXMpLCA1MCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldCBjdXN0b20gaWNvbiB1cmkgZm9yIHByb2dyZXNzIHdpbmRvd1xyXG4gICAgICogQHBhcmFtIGtleVxyXG4gICAgICogQHBhcmFtIHVyaVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2V0SWNvblVSSShrZXksIHVyaSkge1xyXG4gICAgICAgIGljb25zW2tleV0gPSB1cmk7XHJcbiAgICB9XHJcbiAgICBnZXRJY29uKHR5cGUsIGRlZmF1bHRJY29uKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGUgJiYgdHlwZSBpbiBpY29ucyA/IGljb25zW3R5cGVdIDogZGVmYXVsdEljb247XHJcbiAgICB9XHJcbiAgICB1cGRhdGVJY29ucygpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmxpbmVzLmZvckVhY2goKGxpbmUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJveCA9IGxpbmUuX2ltYWdlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWNvbiA9IGJveC5kYXRhc2V0Lml0ZW1UeXBlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGljb24gJiZcclxuICAgICAgICAgICAgICAgICAgICBpY29uLnN0YXJ0c1dpdGgoXCJjaHJvbWU6Ly9cIikgJiZcclxuICAgICAgICAgICAgICAgICAgICAhYm94LnN0eWxlLmJhY2tncm91bmRJbWFnZS5pbmNsdWRlcyhcInByb2dyZXNzX2FyY3NcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBib3guc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke2JveC5kYXRhc2V0Lml0ZW1UeXBlfSlgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLy8gSWdub3JlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUHJvZ3Jlc3NXaW5kb3dIZWxwZXIgPSBQcm9ncmVzc1dpbmRvd0hlbHBlcjtcclxuLyoqXHJcbiAqIEljb24gZGljdC4gQWRkIHlvdXIgY3VzdG9tIGljb25zIGhlcmUuXHJcbiAqIEBkZWZhdWx0XHJcbiAqIGBgYHRzXHJcbiAqIHtcclxuICogICBzdWNjZXNzOiBcImNocm9tZTovL3pvdGVyby9za2luL3RpY2sucG5nXCIsXHJcbiAqICAgZmFpbDogXCJjaHJvbWU6Ly96b3Rlcm8vc2tpbi9jcm9zcy5wbmdcIixcclxuICogfTtcclxuICogYGBgXHJcbiAqL1xyXG5jb25zdCBpY29ucyA9IHtcclxuICAgIHN1Y2Nlc3M6IFwiY2hyb21lOi8vem90ZXJvL3NraW4vdGljay5wbmdcIixcclxuICAgIGZhaWw6IFwiY2hyb21lOi8vem90ZXJvL3NraW4vY3Jvc3MucG5nXCIsXHJcbn07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByb2dyZXNzV2luZG93LmpzLm1hcCIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlZpcnR1YWxpemVkVGFibGVIZWxwZXIgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbi8qKlxyXG4gKiBWaXJ0dWFsaXplZFRhYmxlIGhlbHBlci5cclxuICovXHJcbmNsYXNzIFZpcnR1YWxpemVkVGFibGVIZWxwZXIgZXh0ZW5kcyBiYXNpY18xLkJhc2ljVG9vbCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih3aW4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMud2luZG93ID0gd2luO1xyXG4gICAgICAgIGNvbnN0IFpvdGVybyA9IHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpO1xyXG4gICAgICAgIGNvbnN0IF9yZXF1aXJlID0gd2luLnJlcXVpcmU7XHJcbiAgICAgICAgLy8gRG9uJ3QgYWN0dWFsbHkgdXNlIGFueSBSZWFjdCBpbnN0YW5jZSwgc28gdGhhdCBpdCB3b24ndCBiZSBhY3R1YWxseSBjb21waWxlZC5cclxuICAgICAgICB0aGlzLlJlYWN0ID0gX3JlcXVpcmUoXCJyZWFjdFwiKTtcclxuICAgICAgICB0aGlzLlJlYWN0RE9NID0gX3JlcXVpcmUoXCJyZWFjdC1kb21cIik7XHJcbiAgICAgICAgdGhpcy5WaXJ0dWFsaXplZFRhYmxlID0gX3JlcXVpcmUoXCJjb21wb25lbnRzL3ZpcnR1YWxpemVkLXRhYmxlXCIpO1xyXG4gICAgICAgIHRoaXMuSW50bFByb3ZpZGVyID0gX3JlcXVpcmUoXCJyZWFjdC1pbnRsXCIpLkludGxQcm92aWRlcjtcclxuICAgICAgICB0aGlzLnByb3BzID0ge1xyXG4gICAgICAgICAgICBpZDogYCR7Wm90ZXJvLlV0aWxpdGllcy5yYW5kb21TdHJpbmcoKX0tJHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gLFxyXG4gICAgICAgICAgICBnZXRSb3dDb3VudDogKCkgPT4gMCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubG9jYWxlU3RyaW5ncyA9IFpvdGVyby5JbnRsLnN0cmluZ3M7XHJcbiAgICB9XHJcbiAgICBzZXRQcm9wKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnByb3BzLCBhcmdzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9wc1thcmdzWzBdXSA9IGFyZ3NbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgbG9jYWxlIHN0cmluZ3MsIHdoaWNoIHJlcGxhY2VzIHRoZSB0YWJsZSBoZWFkZXIncyBsYWJlbCBpZiBtYXRjaGVzLiBEZWZhdWx0IGl0J3MgYFpvdGVyby5JbnRsLnN0cmluZ3NgXHJcbiAgICAgKiBAcGFyYW0gbG9jYWxlU3RyaW5nc1xyXG4gICAgICovXHJcbiAgICBzZXRMb2NhbGUobG9jYWxlU3RyaW5ncykge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5sb2NhbGVTdHJpbmdzLCBsb2NhbGVTdHJpbmdzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGNvbnRhaW5lciBlbGVtZW50IGlkIHRoYXQgdGhlIHRhYmxlIHdpbGwgYmUgcmVuZGVyZWQgb24uXHJcbiAgICAgKiBAcGFyYW0gaWQgZWxlbWVudCBpZFxyXG4gICAgICovXHJcbiAgICBzZXRDb250YWluZXJJZChpZCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVySWQgPSBpZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHRoZSB0YWJsZS5cclxuICAgICAqIEBwYXJhbSBzZWxlY3RJZCBXaGljaCByb3cgdG8gc2VsZWN0IGFmdGVyIHJlbmRlcmluZ1xyXG4gICAgICogQHBhcmFtIG9uZnVsZmlsbGVkIGNhbGxiYWNrIGFmdGVyIHN1Y2Nlc3NmdWxseSByZW5kZXJlZFxyXG4gICAgICogQHBhcmFtIG9ucmVqZWN0ZWQgY2FsbGJhY2sgYWZ0ZXIgcmVuZGVyaW5nIHdpdGggZXJyb3JcclxuICAgICAqL1xyXG4gICAgcmVuZGVyKHNlbGVjdElkLCBvbmZ1bGZpbGxlZCwgb25yZWplY3RlZCkge1xyXG4gICAgICAgIGNvbnN0IHJlZnJlc2hTZWxlY3Rpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudHJlZUluc3RhbmNlLmludmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWxlY3RJZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxlY3RJZCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVJbnN0YW5jZS5zZWxlY3Rpb24uc2VsZWN0KHNlbGVjdElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJlZUluc3RhbmNlLnNlbGVjdGlvbi5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIXRoaXMudHJlZUluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZ0YWJsZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywge1xyXG4gICAgICAgICAgICAgICAgcmVmOiAocmVmKSA9PiAodGhpcy50cmVlSW5zdGFuY2UgPSByZWYpLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHZ0YWJsZVByb3BzLmdldFJvd0RhdGEgJiYgIXZ0YWJsZVByb3BzLnJlbmRlckl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odnRhYmxlUHJvcHMsIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiB0aGlzLlZpcnR1YWxpemVkVGFibGUubWFrZVJvd1JlbmRlcmVyKHZ0YWJsZVByb3BzLmdldFJvd0RhdGEpLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuUmVhY3QuY3JlYXRlRWxlbWVudCh0aGlzLkludGxQcm92aWRlciwgeyBsb2NhbGU6IFpvdGVyby5sb2NhbGUsIG1lc3NhZ2VzOiBab3Rlcm8uSW50bC5zdHJpbmdzIH0sIHRoaXMuUmVhY3QuY3JlYXRlRWxlbWVudCh0aGlzLlZpcnR1YWxpemVkVGFibGUsIHZ0YWJsZVByb3BzKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMud2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVySWQpO1xyXG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gdGhpcy5SZWFjdERPTS5yZW5kZXIoZWxlbSwgY29udGFpbmVyLCByZXNvbHZlKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIEZpeCBzdHlsZSBtYW5hZ2VyIHNob3dpbmcgcGFydGlhbGx5IGJsYW5rIHVudGlsIHNjcm9sbGVkXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldEdsb2JhbChcInNldFRpbWVvdXRcIikoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ob25mdWxmaWxsZWQsIG9ucmVqZWN0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVmcmVzaFNlbGVjdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlZpcnR1YWxpemVkVGFibGVIZWxwZXIgPSBWaXJ0dWFsaXplZFRhYmxlSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD12aXJ0dWFsaXplZFRhYmxlLmpzLm1hcCIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkRpYWxvZ0hlbHBlciA9IHZvaWQgMDtcclxuY29uc3QgdWlfMSA9IHJlcXVpcmUoXCIuLi90b29scy91aVwiKTtcclxuLyoqXHJcbiAqIERpYWxvZyB3aW5kb3cgaGVscGVyLiBBIHN1cGVyc2V0IG9mIFhVTCBkaWFsb2cuXHJcbiAqL1xyXG5jbGFzcyBEaWFsb2dIZWxwZXIgZXh0ZW5kcyB1aV8xLlVJVG9vbCB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRpYWxvZyBoZWxwZXIgd2l0aCByb3cgXFwqIGNvbHVtbiBncmlkcy5cclxuICAgICAqIEBwYXJhbSByb3dcclxuICAgICAqIEBwYXJhbSBjb2x1bW5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iocm93LCBjb2x1bW4pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmIChyb3cgPD0gMCB8fCBjb2x1bW4gPD0gMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgcm93IGFuZCBjb2x1bW4gbXVzdCBiZSBwb3NpdGl2ZSBpbnRlZ2Vycy5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50UHJvcHMgPSB7XHJcbiAgICAgICAgICAgIHRhZzogXCJ2Ym94XCIsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgZmxleDogMSB9LFxyXG4gICAgICAgICAgICBzdHlsZXM6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5tYXgocm93LCAxKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudFByb3BzLmNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdGFnOiBcImhib3hcIixcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgZmxleDogMSB9LFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBNYXRoLm1heChjb2x1bW4sIDEpOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFByb3BzLmNoaWxkcmVuW2ldLmNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZzogXCJ2Ym94XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogeyBmbGV4OiAxIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50UHJvcHMuY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIHRhZzogXCJoYm94XCIsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgZmxleDogMCwgcGFjazogXCJlbmRcIiB9LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW10sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5kaWFsb2dEYXRhID0ge307XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIGNlbGwgYXQgKHJvdywgY29sdW1uKS4gSW5kZXggc3RhcnRzIGZyb20gMC5cclxuICAgICAqIEBwYXJhbSByb3dcclxuICAgICAqIEBwYXJhbSBjb2x1bW5cclxuICAgICAqIEBwYXJhbSBlbGVtZW50UHJvcHMgQ2VsbCBlbGVtZW50IHByb3BzLiBTZWUge0BsaW5rIEVsZW1lbnRQcm9wc31cclxuICAgICAqIEBwYXJhbSBjZWxsRmxleCBJZiB0aGUgY2VsbCBpcyBmbGV4LiBEZWZhdWx0IHRydWUuXHJcbiAgICAgKi9cclxuICAgIGFkZENlbGwocm93LCBjb2x1bW4sIGVsZW1lbnRQcm9wcywgY2VsbEZsZXggPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKHJvdyA+PSB0aGlzLmVsZW1lbnRQcm9wcy5jaGlsZHJlbi5sZW5ndGggfHxcclxuICAgICAgICAgICAgY29sdW1uID49IHRoaXMuZWxlbWVudFByb3BzLmNoaWxkcmVuW3Jvd10uY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBDZWxsIGluZGV4ICgke3Jvd30sICR7Y29sdW1ufSkgaXMgaW52YWxpZCwgbWF4aW11bSAoJHt0aGlzLmVsZW1lbnRQcm9wcy5jaGlsZHJlbi5sZW5ndGh9LCAke3RoaXMuZWxlbWVudFByb3BzLmNoaWxkcmVuWzBdLmNoaWxkcmVuLmxlbmd0aH0pYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWxlbWVudFByb3BzLmNoaWxkcmVuW3Jvd10uY2hpbGRyZW5bY29sdW1uXS5jaGlsZHJlbiA9IFtcclxuICAgICAgICAgICAgZWxlbWVudFByb3BzLFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5lbGVtZW50UHJvcHMuY2hpbGRyZW5bcm93XS5jaGlsZHJlbltjb2x1bW5dLmF0dHJpYnV0ZXMuZmxleCA9XHJcbiAgICAgICAgICAgIGNlbGxGbGV4ID8gMSA6IDA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIGNvbnRyb2wgYnV0dG9uIHRvIHRoZSBib3R0b20gb2YgdGhlIGRpYWxvZy5cclxuICAgICAqIEBwYXJhbSBsYWJlbCBCdXR0b24gbGFiZWxcclxuICAgICAqIEBwYXJhbSBpZCBCdXR0b24gaWQuXHJcbiAgICAgKiBUaGUgY29ycmVzcG9uZGluZyBpZCBvZiB0aGUgbGFzdCBidXR0b24gdXNlciBjbGlja3MgYmVmb3JlIHdpbmRvdyBleGl0IHdpbGwgYmUgc2V0IHRvIGBkaWFsb2dEYXRhLl9sYXN0QnV0dG9uSWRgLlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMubm9DbG9zZSBEb24ndCBjbG9zZSB3aW5kb3cgd2hlbiBjbGlja2luZyB0aGlzIGJ1dHRvbi5cclxuICAgICAqIEBwYXJhbSBvcHRpb25zLmNhbGxiYWNrIENhbGxiYWNrIG9mIGJ1dHRvbiBjbGljayBldmVudC5cclxuICAgICAqL1xyXG4gICAgYWRkQnV0dG9uKGxhYmVsLCBpZCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAgICAgaWQgPSBpZCB8fCBgJHtab3Rlcm8uVXRpbGl0aWVzLnJhbmRvbVN0cmluZygpfS0ke25ldyBEYXRlKCkuZ2V0VGltZSgpfWA7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50UHJvcHMuY2hpbGRyZW5bdGhpcy5lbGVtZW50UHJvcHMuY2hpbGRyZW4ubGVuZ3RoIC0gMV0uY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIHRhZzogXCJ2Ym94XCIsXHJcbiAgICAgICAgICAgIHN0eWxlczoge1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiBcIjEwcHhcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWc6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBcImh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgICBpZCxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS1sMTBuLWlkXCI6IGxhYmVsLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lckhUTUw6IGxhYmVsLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyOiAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nRGF0YS5fbGFzdEJ1dHRvbklkID0gaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayhlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLm5vQ2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3cuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEaWFsb2cgZGF0YS5cclxuICAgICAqIEByZW1hcmtzXHJcbiAgICAgKiBUaGlzIG9iamVjdCBpcyBwYXNzZWQgdG8gdGhlIGRpYWxvZyB3aW5kb3cuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIGNvbnRyb2wgYnV0dG9uIGlkIGlzIGluIGBkaWFsb2dEYXRhLl9sYXN0QnV0dG9uSWRgO1xyXG4gICAgICpcclxuICAgICAqIFRoZSBkYXRhLWJpbmRpbmcgdmFsdWVzIGFyZSBpbiBgZGlhbG9nRGF0YWAuXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW50ZXJmYWNlIERpYWxvZ0RhdGEge1xyXG4gICAgICogICBba2V5OiBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2xdOiBhbnk7XHJcbiAgICAgKiAgIGxvYWRMb2NrPzogX1pvdGVyb1R5cGVzLlByb21pc2VPYmplY3Q7IC8vIHJlc29sdmUgYWZ0ZXIgd2luZG93IGxvYWQgKGF1dG8tZ2VuZXJhdGVkKVxyXG4gICAgICogICBsb2FkQ2FsbGJhY2s/OiBGdW5jdGlvbjsgLy8gY2FsbGVkIGFmdGVyIHdpbmRvdyBsb2FkXHJcbiAgICAgKiAgIHVubG9hZExvY2s/OiBfWm90ZXJvVHlwZXMuUHJvbWlzZU9iamVjdDsgLy8gcmVzb2x2ZSBhZnRlciB3aW5kb3cgdW5sb2FkIChhdXRvLWdlbmVyYXRlZClcclxuICAgICAqICAgdW5sb2FkQ2FsbGJhY2s/OiBGdW5jdGlvbjsgLy8gY2FsbGVkIGFmdGVyIHdpbmRvdyB1bmxvYWRcclxuICAgICAqICAgYmVmb3JlVW5sb2FkQ2FsbGJhY2s/OiBGdW5jdGlvbjsgLy8gY2FsbGVkIGJlZm9yZSB3aW5kb3cgdW5sb2FkIHdoZW4gZWxlbWVudHMgYXJlIGFjY2Vzc2FibGUuXHJcbiAgICAgKiB9XHJcbiAgICAgKiBgYGBcclxuICAgICAqIEBwYXJhbSBkaWFsb2dEYXRhXHJcbiAgICAgKi9cclxuICAgIHNldERpYWxvZ0RhdGEoZGlhbG9nRGF0YSkge1xyXG4gICAgICAgIHRoaXMuZGlhbG9nRGF0YSA9IGRpYWxvZ0RhdGE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIE9wZW4gdGhlIGRpYWxvZ1xyXG4gICAgICogQHBhcmFtIHRpdGxlIFdpbmRvdyB0aXRsZVxyXG4gICAgICogQHBhcmFtIHdpbmRvd0ZlYXR1cmVzLndpZHRoIElnbm9yZWQgaWYgZml0Q29udGVudCBpcyBgdHJ1ZWAuXHJcbiAgICAgKiBAcGFyYW0gd2luZG93RmVhdHVyZXMuaGVpZ2h0IElnbm9yZWQgaWYgZml0Q29udGVudCBpcyBgdHJ1ZWAuXHJcbiAgICAgKiBAcGFyYW0gd2luZG93RmVhdHVyZXMubGVmdFxyXG4gICAgICogQHBhcmFtIHdpbmRvd0ZlYXR1cmVzLnRvcFxyXG4gICAgICogQHBhcmFtIHdpbmRvd0ZlYXR1cmVzLmNlbnRlcnNjcmVlbiBPcGVuIHdpbmRvdyBhdCB0aGUgY2VudGVyIG9mIHNjcmVlbi5cclxuICAgICAqIEBwYXJhbSB3aW5kb3dGZWF0dXJlcy5yZXNpemFibGUgSWYgd2luZG93IGlzIHJlc2l6YWJsZS5cclxuICAgICAqIEBwYXJhbSB3aW5kb3dGZWF0dXJlcy5maXRDb250ZW50IFJlc2l6ZSB0aGUgd2luZG93IHRvIGNvbnRlbnQgc2l6ZSBhZnRlciBlbGVtZW50cyBhcmUgbG9hZGVkLlxyXG4gICAgICogQHBhcmFtIHdpbmRvd0ZlYXR1cmVzLm5vRGlhbG9nTW9kZSBEaWFsb2cgbW9kZSB3aW5kb3cgb25seSBoYXMgYSBjbG9zZSBidXR0b24uIFNldCBgdHJ1ZWAgdG8gbWFrZSBtYXhpbWl6ZSBhbmQgbWluaW1pemUgYnV0dG9uIHZpc2libGUuXHJcbiAgICAgKiBAcGFyYW0gd2luZG93RmVhdHVyZXMuYWx3YXlzUmFpc2VkIElzIHRoZSB3aW5kb3cgYWx3YXlzIGF0IHRoZSB0b3AuXHJcbiAgICAgKi9cclxuICAgIG9wZW4odGl0bGUsIHdpbmRvd0ZlYXR1cmVzID0ge1xyXG4gICAgICAgIGNlbnRlcnNjcmVlbjogdHJ1ZSxcclxuICAgICAgICByZXNpemFibGU6IHRydWUsXHJcbiAgICAgICAgZml0Q29udGVudDogdHJ1ZSxcclxuICAgIH0pIHtcclxuICAgICAgICB0aGlzLndpbmRvdyA9IG9wZW5EaWFsb2codGhpcywgYCR7Wm90ZXJvLlV0aWxpdGllcy5yYW5kb21TdHJpbmcoKX0tJHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gLCB0aXRsZSwgdGhpcy5lbGVtZW50UHJvcHMsIHRoaXMuZGlhbG9nRGF0YSwgd2luZG93RmVhdHVyZXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRGlhbG9nSGVscGVyID0gRGlhbG9nSGVscGVyO1xyXG5mdW5jdGlvbiBvcGVuRGlhbG9nKGRpYWxvZ0hlbHBlciwgdGFyZ2V0SWQsIHRpdGxlLCBlbGVtZW50UHJvcHMsIGRpYWxvZ0RhdGEsIHdpbmRvd0ZlYXR1cmVzID0ge1xyXG4gICAgY2VudGVyc2NyZWVuOiB0cnVlLFxyXG4gICAgcmVzaXphYmxlOiB0cnVlLFxyXG4gICAgZml0Q29udGVudDogdHJ1ZSxcclxufSkge1xyXG4gICAgdmFyIF9hLCBfYiwgX2M7XHJcbiAgICBjb25zdCBab3Rlcm8gPSBkaWFsb2dIZWxwZXIuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpO1xyXG4gICAgZGlhbG9nRGF0YSA9IGRpYWxvZ0RhdGEgfHwge307XHJcbiAgICAvLyBNYWtlIHdpbmRvd2ZlYXR1cmUgc3RyaW5nXHJcbiAgICBpZiAoIWRpYWxvZ0RhdGEubG9hZExvY2spIHtcclxuICAgICAgICBkaWFsb2dEYXRhLmxvYWRMb2NrID0gWm90ZXJvLlByb21pc2UuZGVmZXIoKTtcclxuICAgIH1cclxuICAgIGlmICghZGlhbG9nRGF0YS51bmxvYWRMb2NrKSB7XHJcbiAgICAgICAgZGlhbG9nRGF0YS51bmxvYWRMb2NrID0gWm90ZXJvLlByb21pc2UuZGVmZXIoKTtcclxuICAgIH1cclxuICAgIGxldCBmZWF0dXJlU3RyaW5nID0gYHJlc2l6YWJsZT0ke3dpbmRvd0ZlYXR1cmVzLnJlc2l6YWJsZSA/IFwieWVzXCIgOiBcIm5vXCJ9LGA7XHJcbiAgICBpZiAod2luZG93RmVhdHVyZXMud2lkdGggfHwgd2luZG93RmVhdHVyZXMuaGVpZ2h0KSB7XHJcbiAgICAgICAgZmVhdHVyZVN0cmluZyArPSBgd2lkdGg9JHt3aW5kb3dGZWF0dXJlcy53aWR0aCB8fCAxMDB9LGhlaWdodD0ke3dpbmRvd0ZlYXR1cmVzLmhlaWdodCB8fCAxMDB9LGA7XHJcbiAgICB9XHJcbiAgICBpZiAod2luZG93RmVhdHVyZXMubGVmdCkge1xyXG4gICAgICAgIGZlYXR1cmVTdHJpbmcgKz0gYGxlZnQ9JHt3aW5kb3dGZWF0dXJlcy5sZWZ0fSxgO1xyXG4gICAgfVxyXG4gICAgaWYgKHdpbmRvd0ZlYXR1cmVzLnRvcCkge1xyXG4gICAgICAgIGZlYXR1cmVTdHJpbmcgKz0gYHRvcD0ke3dpbmRvd0ZlYXR1cmVzLnRvcH0sYDtcclxuICAgIH1cclxuICAgIGlmICh3aW5kb3dGZWF0dXJlcy5jZW50ZXJzY3JlZW4pIHtcclxuICAgICAgICBmZWF0dXJlU3RyaW5nICs9IFwiY2VudGVyc2NyZWVuLFwiO1xyXG4gICAgfVxyXG4gICAgaWYgKHdpbmRvd0ZlYXR1cmVzLm5vRGlhbG9nTW9kZSkge1xyXG4gICAgICAgIGZlYXR1cmVTdHJpbmcgKz0gXCJkaWFsb2c9bm8sXCI7XHJcbiAgICB9XHJcbiAgICBpZiAod2luZG93RmVhdHVyZXMuYWx3YXlzUmFpc2VkKSB7XHJcbiAgICAgICAgZmVhdHVyZVN0cmluZyArPSBcImFsd2F5c1JhaXNlZD15ZXMsXCI7XHJcbiAgICB9XHJcbiAgICAvLyBDcmVhdGUgd2luZG93XHJcbiAgICBjb25zdCB3aW4gPSBkaWFsb2dIZWxwZXIuZ2V0R2xvYmFsKFwib3BlbkRpYWxvZ1wiKShcImFib3V0OmJsYW5rXCIsIHRhcmdldElkIHx8IFwiX2JsYW5rXCIsIGZlYXR1cmVTdHJpbmcsIGRpYWxvZ0RhdGEpO1xyXG4gICAgLy8gQWZ0ZXIgbG9hZFxyXG4gICAgKF9hID0gZGlhbG9nRGF0YS5sb2FkTG9jaykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgLy8gU2V0IHRpdGxlXHJcbiAgICAgICAgd2luLmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZGlhbG9nSGVscGVyLmNyZWF0ZUVsZW1lbnQod2luLmRvY3VtZW50LCBcInRpdGxlXCIsIHtcclxuICAgICAgICAgICAgcHJvcGVydGllczogeyBpbm5lclRleHQ6IHRpdGxlIH0sXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgXCJkYXRhLWwxMG4taWRcIjogdGl0bGUgfSxcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgbGV0IGwxMG5GaWxlcyA9IGRpYWxvZ0RhdGEubDEwbkZpbGVzIHx8IFtdO1xyXG4gICAgICAgIGlmICh0eXBlb2YgbDEwbkZpbGVzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGwxMG5GaWxlcyA9IFtsMTBuRmlsZXNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsMTBuRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICB3aW4uZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChkaWFsb2dIZWxwZXIuY3JlYXRlRWxlbWVudCh3aW4uZG9jdW1lbnQsIFwibGlua1wiLCB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVsOiBcImxvY2FsaXphdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGZpbGUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gQWRkIHN0eWxlIGFjY29yZGluZyB0byBab3Rlcm8gcHJlZnNcclxuICAgICAgICAvLyBGb3IgY3VzdG9tIHNlbGVjdChtZW51bGlzdCkgYW5kIGEgbGlua1xyXG4gICAgICAgIGRpYWxvZ0hlbHBlci5hcHBlbmRFbGVtZW50KHtcclxuICAgICAgICAgICAgdGFnOiBcImZyYWdtZW50XCIsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnOiBcInN0eWxlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lckhUTUw6IHN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZzogXCJsaW5rXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWw6IFwic3R5bGVzaGVldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmOiBcImNocm9tZTovL3pvdGVyby1wbGF0Zm9ybS9jb250ZW50L3pvdGVyby5jc3NcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9LCB3aW4uZG9jdW1lbnQuaGVhZCk7XHJcbiAgICAgICAgcmVwbGFjZUVsZW1lbnQoZWxlbWVudFByb3BzLCBkaWFsb2dIZWxwZXIpO1xyXG4gICAgICAgIC8vIENyZWF0ZSBlbGVtZW50XHJcbiAgICAgICAgd2luLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGlhbG9nSGVscGVyLmNyZWF0ZUVsZW1lbnQod2luLmRvY3VtZW50LCBcImZyYWdtZW50XCIsIHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtlbGVtZW50UHJvcHNdLFxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICAvLyBMb2FkIGRhdGEtYmluZGluZ1xyXG4gICAgICAgIEFycmF5LmZyb20od2luLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2RhdGEtYmluZF1cIikpLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYmluZEtleSA9IGVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1iaW5kXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kQXR0ciA9IGVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1hdHRyXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kUHJvcCA9IGVsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1wcm9wXCIpO1xyXG4gICAgICAgICAgICBpZiAoYmluZEtleSAmJiBkaWFsb2dEYXRhICYmIGRpYWxvZ0RhdGFbYmluZEtleV0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChiaW5kUHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1bYmluZFByb3BdID0gZGlhbG9nRGF0YVtiaW5kS2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGJpbmRBdHRyIHx8IFwidmFsdWVcIiwgZGlhbG9nRGF0YVtiaW5kS2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBSZXNpemUgd2luZG93XHJcbiAgICAgICAgaWYgKHdpbmRvd0ZlYXR1cmVzLmZpdENvbnRlbnQpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW4uc2l6ZVRvQ29udGVudCgpO1xyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW4uZm9jdXMoKTtcclxuICAgIH0pLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIC8vIEN1c3RvbSBsb2FkIGNhbGxiYWNrXHJcbiAgICAgICAgKGRpYWxvZ0RhdGEgPT09IG51bGwgfHwgZGlhbG9nRGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGlhbG9nRGF0YS5sb2FkQ2FsbGJhY2spICYmIGRpYWxvZ0RhdGEubG9hZENhbGxiYWNrKCk7XHJcbiAgICB9KTtcclxuICAgIGRpYWxvZ0RhdGEudW5sb2FkTG9jay5wcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIC8vIEN1c3RvbSB1bmxvYWQgY2FsbGJhY2tcclxuICAgICAgICAoZGlhbG9nRGF0YSA9PT0gbnVsbCB8fCBkaWFsb2dEYXRhID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkaWFsb2dEYXRhLnVubG9hZENhbGxiYWNrKSAmJiBkaWFsb2dEYXRhLnVubG9hZENhbGxiYWNrKCk7XHJcbiAgICB9KTtcclxuICAgIC8vIFdhaXQgZm9yIHdpbmRvdyBsb2FkaW5nIHRvIHJlc29sdmUgdGhlIGxvY2sgcHJvbWlzZVxyXG4gICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uIG9uV2luZG93TG9hZChldikge1xyXG4gICAgICAgIHZhciBfYSwgX2I7XHJcbiAgICAgICAgKF9iID0gKF9hID0gd2luLmFyZ3VtZW50c1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxvYWRMb2NrKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucmVzb2x2ZSgpO1xyXG4gICAgICAgIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBvbldpbmRvd0xvYWQsIGZhbHNlKTtcclxuICAgIH0sIGZhbHNlKTtcclxuICAgIC8vIFdhaXQgZm9yIHdpbmRvdyB1bmxvYWQuIFVzZSBiZWZvcmV1bmxvYWQgdG8gYWNjZXNzIGVsZW1lbnRzLlxyXG4gICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24gb25XaW5kb3dCZWZvcmVVbmxvYWQoZXYpIHtcclxuICAgICAgICAvLyBVcGRhdGUgZGF0YS1iaW5kaW5nXHJcbiAgICAgICAgQXJyYXkuZnJvbSh3aW4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipbZGF0YS1iaW5kXVwiKSkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkaWFsb2dEYXRhID0gdGhpcy53aW5kb3cuYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kS2V5ID0gZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJpbmRcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGJpbmRBdHRyID0gZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWF0dHJcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGJpbmRQcm9wID0gZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXByb3BcIik7XHJcbiAgICAgICAgICAgIGlmIChiaW5kS2V5ICYmIGRpYWxvZ0RhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiaW5kUHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpYWxvZ0RhdGFbYmluZEtleV0gPSBlbGVtW2JpbmRQcm9wXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpYWxvZ0RhdGFbYmluZEtleV0gPSBlbGVtLmdldEF0dHJpYnV0ZShiaW5kQXR0ciB8fCBcInZhbHVlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy53aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLCBvbldpbmRvd0JlZm9yZVVubG9hZCwgZmFsc2UpO1xyXG4gICAgICAgIChkaWFsb2dEYXRhID09PSBudWxsIHx8IGRpYWxvZ0RhdGEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRpYWxvZ0RhdGEuYmVmb3JlVW5sb2FkQ2FsbGJhY2spICYmIGRpYWxvZ0RhdGEuYmVmb3JlVW5sb2FkQ2FsbGJhY2soKTtcclxuICAgIH0pO1xyXG4gICAgLy8gV2FpdCBmb3Igd2luZG93IHVubG9hZCB0byByZXNvbHZlIHRoZSBsb2NrIHByb21pc2VcclxuICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsIGZ1bmN0aW9uIG9uV2luZG93VW5sb2FkKGV2KSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XHJcbiAgICAgICAgaWYgKChfYSA9IHRoaXMud2luZG93LmFyZ3VtZW50c1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxvYWRMb2NrLnByb21pc2UuaXNQZW5kaW5nKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAoX2MgPSAoX2IgPSB0aGlzLndpbmRvdy5hcmd1bWVudHNbMF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi51bmxvYWRMb2NrKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MucmVzb2x2ZSgpO1xyXG4gICAgICAgIHRoaXMud2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIiwgb25XaW5kb3dVbmxvYWQsIGZhbHNlKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKHdpbi5kb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIHtcclxuICAgICAgICAoX2MgPSAoX2IgPSB3aW4uYXJndW1lbnRzWzBdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IubG9hZExvY2spID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd2luO1xyXG59XHJcbmZ1bmN0aW9uIHJlcGxhY2VFbGVtZW50KGVsZW1lbnRQcm9wcywgdWlUb29sKSB7XHJcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2c7XHJcbiAgICBsZXQgY2hlY2tDaGlsZHJlbiA9IHRydWU7XHJcbiAgICBpZiAoZWxlbWVudFByb3BzLnRhZyA9PT0gXCJzZWxlY3RcIiAmJiB1aVRvb2wuaXNab3Rlcm83KCkpIHtcclxuICAgICAgICBjaGVja0NoaWxkcmVuID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgY3VzdG9tU2VsZWN0UHJvcHMgPSB7XHJcbiAgICAgICAgICAgIHRhZzogXCJkaXZcIixcclxuICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJkcm9wZG93blwiXSxcclxuICAgICAgICAgICAgbGlzdGVuZXJzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtb3VzZWxlYXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3QgPSBldi50YXJnZXQucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ID09PSBudWxsIHx8IHNlbGVjdCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VsZWN0LmJsdXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sIGVsZW1lbnRQcm9wcywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZzogXCJzZWxlY3RcIixcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJmb2N1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3QgPSBldi50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZHJvcGRvd24gPSAoX2EgPSBzZWxlY3QucGFyZW50RWxlbWVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnF1ZXJ5U2VsZWN0b3IoXCIuZHJvcGRvd24tY29udGVudFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93biAmJiAoZHJvcGRvd24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnNldEF0dHJpYnV0ZShcImZvY3VzXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYmx1clwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3QgPSBldi50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZHJvcGRvd24gPSAoX2EgPSBzZWxlY3QucGFyZW50RWxlbWVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnF1ZXJ5U2VsZWN0b3IoXCIuZHJvcGRvd24tY29udGVudFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93biAmJiAoZHJvcGRvd24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QucmVtb3ZlQXR0cmlidXRlKFwiZm9jdXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWc6IFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0OiBbXCJkcm9wZG93bi1jb250ZW50XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiAoX2EgPSBlbGVtZW50UHJvcHMuY2hpbGRyZW4pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tYXAoKG9wdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWc6IFwicFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAoX2EgPSBvcHRpb24ucHJvcGVydGllcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lckhUTUw6ICgoX2IgPSBvcHRpb24ucHJvcGVydGllcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmlubmVySFRNTCkgfHwgKChfYyA9IG9wdGlvbi5wcm9wZXJ0aWVzKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuaW5uZXJUZXh0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3Q6IFtcImRyb3Bkb3duLWl0ZW1cIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ID0gKF9hID0gZXYudGFyZ2V0LnBhcmVudEVsZW1lbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlbGVjdC52YWx1ZSA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSB8fCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdCA9PT0gbnVsbCB8fCBzZWxlY3QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdC5ibHVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGVsZW1lbnRQcm9wcykge1xyXG4gICAgICAgICAgICBkZWxldGUgZWxlbWVudFByb3BzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudFByb3BzLCBjdXN0b21TZWxlY3RQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChlbGVtZW50UHJvcHMudGFnID09PSBcImFcIikge1xyXG4gICAgICAgIGNvbnN0IGhyZWYgPSAoKChfYiA9IGVsZW1lbnRQcm9wcyA9PT0gbnVsbCB8fCBlbGVtZW50UHJvcHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVsZW1lbnRQcm9wcy5wcm9wZXJ0aWVzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaHJlZikgfHwgXCJcIik7XHJcbiAgICAgICAgKF9jID0gZWxlbWVudFByb3BzLnByb3BlcnRpZXMpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IChlbGVtZW50UHJvcHMucHJvcGVydGllcyA9IHt9KTtcclxuICAgICAgICBlbGVtZW50UHJvcHMucHJvcGVydGllcy5ocmVmID0gXCJqYXZhc2NyaXB0OnZvaWQoMCk7XCI7XHJcbiAgICAgICAgKF9kID0gZWxlbWVudFByb3BzLmF0dHJpYnV0ZXMpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IChlbGVtZW50UHJvcHMuYXR0cmlidXRlcyA9IHt9KTtcclxuICAgICAgICBlbGVtZW50UHJvcHMuYXR0cmlidXRlc1tcInpvdGVyby1ocmVmXCJdID0gaHJlZjtcclxuICAgICAgICAoX2UgPSBlbGVtZW50UHJvcHMubGlzdGVuZXJzKSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiAoZWxlbWVudFByb3BzLmxpc3RlbmVycyA9IFtdKTtcclxuICAgICAgICBlbGVtZW50UHJvcHMubGlzdGVuZXJzLnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgIGxpc3RlbmVyOiAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhyZWYgPSAoX2EgPSBldi50YXJnZXQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRBdHRyaWJ1dGUoXCJ6b3Rlcm8taHJlZlwiKTtcclxuICAgICAgICAgICAgICAgIGhyZWYgJiYgdWlUb29sLmdldEdsb2JhbChcIlpvdGVyb1wiKS5sYXVuY2hVUkwoaHJlZik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgKF9mID0gZWxlbWVudFByb3BzLmNsYXNzTGlzdCkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogKGVsZW1lbnRQcm9wcy5jbGFzc0xpc3QgPSBbXSk7XHJcbiAgICAgICAgZWxlbWVudFByb3BzLmNsYXNzTGlzdC5wdXNoKFwiem90ZXJvLXRleHQtbGlua1wiKTtcclxuICAgIH1cclxuICAgIGlmIChjaGVja0NoaWxkcmVuKSB7XHJcbiAgICAgICAgKF9nID0gZWxlbWVudFByb3BzLmNoaWxkcmVuKSA9PT0gbnVsbCB8fCBfZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2cuZm9yRWFjaCgoY2hpbGQpID0+IHJlcGxhY2VFbGVtZW50KGNoaWxkLCB1aVRvb2wpKTtcclxuICAgIH1cclxufVxyXG5jb25zdCBzdHlsZSA9IGBcclxuLnpvdGVyby10ZXh0LWxpbmsge1xyXG4gIC1tb3otdXNlci1mb2N1czogbm9ybWFsO1xyXG4gIGNvbG9yOiAtbW96LW5hdGl2ZWh5cGVybGlua3RleHQ7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcbi5kcm9wZG93biB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxufVxyXG4uZHJvcGRvd24tY29udGVudCB7XHJcbiAgZGlzcGxheTogbm9uZTtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWF0ZXJpYWwtdG9vbGJhcik7XHJcbiAgbWluLXdpZHRoOiAxNjBweDtcclxuICBib3gtc2hhZG93OiAwcHggMHB4IDVweCAwcHggcmdiYSgwLCAwLCAwLCAwLjUpO1xyXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICBwYWRkaW5nOiA1cHggMCA1cHggMDtcclxuICB6LWluZGV4OiA5OTk7XHJcbn1cclxuLmRyb3Bkb3duLWl0ZW0ge1xyXG4gIG1hcmdpbjogMHB4O1xyXG4gIHBhZGRpbmc6IDVweCAxMHB4IDVweCAxMHB4O1xyXG59XHJcbi5kcm9wZG93bi1pdGVtOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1maWxsLXF1aW5hcnkpO1xyXG59XHJcbmA7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpYWxvZy5qcy5tYXAiLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5SZWFkZXJJbnN0YW5jZU1hbmFnZXIgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbmNvbnN0IHRvb2xraXRHbG9iYWxfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi90b29sa2l0R2xvYmFsXCIpKTtcclxuLyoqXHJcbiAqIFJlYWRlciBpbnN0YW5jZSBob29rcy5cclxuICogQGRlcHJlY2F0ZWRcclxuICovXHJcbmNsYXNzIFJlYWRlckluc3RhbmNlTWFuYWdlciBleHRlbmRzIGJhc2ljXzEuTWFuYWdlclRvb2wge1xyXG4gICAgY29uc3RydWN0b3IoYmFzZSkge1xyXG4gICAgICAgIHN1cGVyKGJhc2UpO1xyXG4gICAgICAgIHRoaXMuY2FjaGVkSG9va0lkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUdsb2JhbCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBhIHJlYWRlciBpbnN0YW5jZSBob29rXHJcbiAgICAgKiBAZGVwcmVjYXRlZFxyXG4gICAgICogQHJlbWFya3NcclxuICAgICAqIGluaXRpYWxpemVkOiBjYWxsZWQgd2hlbiByZWFkZXIgaW5zdGFuY2UgaXMgcmVhZHlcclxuICAgICAqIEBwYXJhbSB0eXBlIGhvb2sgdHlwZVxyXG4gICAgICogQHBhcmFtIGlkIGhvb2sgaWRcclxuICAgICAqIEBwYXJhbSBob29rXHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyKHR5cGUsIGlkLCBob29rKSB7XHJcbiAgICAgICAgY29uc3QgWm90ZXJvID0gdGhpcy5nZXRHbG9iYWwoXCJab3Rlcm9cIik7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbml0aWFsaXplZFwiOlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2FjaGUuaW5pdGlhbGl6ZWRIb29rc1tpZF0gPSBob29rO1xyXG4gICAgICAgICAgICAgICAgICAgIFpvdGVyby5SZWFkZXIuX3JlYWRlcnMuZm9yRWFjaChob29rKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FjaGVkSG9va0lkcy5wdXNoKGlkKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVW5yZWdpc3RlciBob29rIGJ5IGlkXHJcbiAgICAgKiBAcGFyYW0gaWRcclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3RlcihpZCkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmdsb2JhbENhY2hlLmluaXRpYWxpemVkSG9va3NbaWRdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGFsbCBob29rc1xyXG4gICAgICovXHJcbiAgICB1bnJlZ2lzdGVyQWxsKCkge1xyXG4gICAgICAgIHRoaXMuY2FjaGVkSG9va0lkcy5mb3JFYWNoKChpZCkgPT4gdGhpcy51bnJlZ2lzdGVyKGlkKSk7XHJcbiAgICB9XHJcbiAgICBpbml0aWFsaXplR2xvYmFsKCkge1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2FjaGUgPSB0b29sa2l0R2xvYmFsXzEuZGVmYXVsdC5nZXRJbnN0YW5jZSgpLnJlYWRlckluc3RhbmNlO1xyXG4gICAgICAgIGlmICghdGhpcy5nbG9iYWxDYWNoZS5fcmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxDYWNoZS5fcmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zdCBab3Rlcm8gPSB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKTtcclxuICAgICAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICBab3Rlcm8uUmVhZGVyLl9yZWFkZXJzID0gbmV3ICh0aGlzLmdldEdsb2JhbChcIlByb3h5XCIpKShab3Rlcm8uUmVhZGVyLl9yZWFkZXJzLCB7XHJcbiAgICAgICAgICAgICAgICBzZXQodGFyZ2V0LCBwLCBuZXdWYWx1ZSwgcmVjZWl2ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcF0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKE51bWJlcihwKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LnZhbHVlcyhfdGhpcy5nbG9iYWxDYWNoZS5pbml0aWFsaXplZEhvb2tzKS5mb3JFYWNoKChob29rKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2sobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLlJlYWRlckluc3RhbmNlTWFuYWdlciA9IFJlYWRlckluc3RhbmNlTWFuYWdlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVhZGVySW5zdGFuY2UuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuSXRlbUJveE1hbmFnZXIgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbmNvbnN0IGZpZWxkSG9va18xID0gcmVxdWlyZShcIi4vZmllbGRIb29rXCIpO1xyXG5jb25zdCBwYXRjaF8xID0gcmVxdWlyZShcIi4vcGF0Y2hcIik7XHJcbmNvbnN0IHRvb2xraXRHbG9iYWxfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi90b29sa2l0R2xvYmFsXCIpKTtcclxuLyoqXHJcbiAqIFJlZ2lzdGVyIGN1c3RvbWl6ZWQgbmV3IHJvdyB0byB0aGUgbGlicmFyeSBpdGVtQm94IChyaWdodC1zaWRlIGluZm8gdGFiKS5cclxuICovXHJcbmNsYXNzIEl0ZW1Cb3hNYW5hZ2VyIGV4dGVuZHMgYmFzaWNfMS5NYW5hZ2VyVG9vbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihiYXNlKSB7XHJcbiAgICAgICAgc3VwZXIoYmFzZSk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXphdGlvbkxvY2sgPSB0aGlzLmdldEdsb2JhbChcIlpvdGVyb1wiKS5Qcm9taXNlLmRlZmVyKCk7XHJcbiAgICAgICAgdGhpcy5sb2NhbENhY2hlID0gW107XHJcbiAgICAgICAgdGhpcy5maWVsZEhvb2tzID0gbmV3IGZpZWxkSG9va18xLkZpZWxkSG9va01hbmFnZXIoKTtcclxuICAgICAgICB0aGlzLnBhdGNoZXJNYW5hZ2VyID0gbmV3IHBhdGNoXzEuUGF0Y2hlck1hbmFnZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVHbG9iYWwoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgYSBjdXN0b20gcm93XHJcbiAgICAgKiBAcGFyYW0gZmllbGQgRmllbGQgbmFtZS4gVXNlZCBpbiBgZ2V0RmllbGRgIGFuZCBgc2V0RmllbGRgLlxyXG4gICAgICogQHBhcmFtIGRpc3BsYXlOYW1lIFRoZSByb3cgaGVhZGVyIGRpc3BsYXkgdGV4dC5cclxuICAgICAqIEBwYXJhbSBnZXRGaWVsZEhvb2sgQ2FsbGVkIHdoZW4gbG9hZGluZyByb3cgY29udGVudC5cclxuICAgICAqIElmIHlvdSByZWdpc3RlcmVkIHRoZSBnZXRGaWVsZCBob29rIHNvbWV3aGVyZSBlbHNlIChpbiBJdGVtQm94IG9yIEZpZWxkSG9va3MpLCBsZWF2ZSBpdCB1bmRlZmluZWQuXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xyXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZWRpdGFibGUgSWYgdGhlIHJvdyBpcyBlZGl0YWJsZS5cclxuICAgICAqIFRvIGVkaXQgYSByb3csIGVpdGhlciB0aGUgYG9wdGlvbnMuc2V0RmllbGRIb29rYCBvciBhIGN1c3RvbSBob29rIGZvciBgc2V0RmllbGRgIGNyZWF0ZWQgYnkgRmllbGRIb29rTWFuYWdlciBpcyByZXF1aXJlZC5cclxuICAgICAqIEBwYXJhbSBvcHRpb25zLnNldEZpZWxkSG9vayBUaGUgYHNldEZpZWxkYCBob29rLlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaW5kZXggVGFyZ2V0IGluZGV4LiBCeSBkZWZhdWx0IGl0J3MgcGxhY2VkIGF0IHRoZSBlbmQgb2Ygcm93cy5cclxuICAgICAqIEBwYXJhbSBvcHRpb25zLm11bHRpbGluZSBJZiB0aGUgcm93IGNvbnRlbnQgaXMgbXVsdGlsaW5lLlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMuY29sbGFwc2libGUgSWYgdGhlIHJvdyBjb250ZW50IGlzIGNvbGxhcHNpYmxlIChsaWtlIGFic3RyYWN0IGZpZWxkKS5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVnaXN0ZXIoZmllbGQsIGRpc3BsYXlOYW1lLCBnZXRGaWVsZEhvb2ssIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgIHRoaXMuZmllbGRIb29rcy5yZWdpc3RlcihcImlzRmllbGRPZkJhc2VcIiwgZmllbGQsICgpID0+IGZhbHNlKTtcclxuICAgICAgICBpZiAoZ2V0RmllbGRIb29rKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRIb29rcy5yZWdpc3RlcihcImdldEZpZWxkXCIsIGZpZWxkLCBnZXRGaWVsZEhvb2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5lZGl0YWJsZSAmJiBvcHRpb25zLnNldEZpZWxkSG9vaykge1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkSG9va3MucmVnaXN0ZXIoXCJzZXRGaWVsZFwiLCBmaWVsZCwgb3B0aW9ucy5zZXRGaWVsZEhvb2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsb2JhbENhY2hlLmZpZWxkT3B0aW9uc1tmaWVsZF0gPSB7XHJcbiAgICAgICAgICAgIGZpZWxkLFxyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgZWRpdGFibGU6IG9wdGlvbnMuZWRpdGFibGUgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgIGluZGV4OiBvcHRpb25zLmluZGV4IHx8IC0xLFxyXG4gICAgICAgICAgICBtdWx0aWxpbmU6IG9wdGlvbnMubXVsdGlsaW5lIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICBjb2xsYXBzaWJsZTogb3B0aW9ucy5jb2xsYXBzaWJsZSB8fCBmYWxzZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubG9jYWxDYWNoZS5wdXNoKGZpZWxkKTtcclxuICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemF0aW9uTG9jay5wcm9taXNlO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGEgcm93IG9mIHNwZWNpZmljIGZpZWxkLlxyXG4gICAgICogQHBhcmFtIGZpZWxkXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBTa2lwIHVucmVnaXN0ZXIgb2YgY2VydGFpbiBob29rcy5cclxuICAgICAqIFRoaXMgaXMgdXNlZnVsIHdoZW4gdGhlIGhvb2sgaXMgbm90IGluaXRpYWxpemVkIGJ5IHRoaXMgaW5zdGFuY2VcclxuICAgICAqIEBwYXJhbSBvcHRpb25zLnNraXBSZWZyZXNoIFNraXAgcmVmcmVzaCBhZnRlciB1bnJlZ2lzdGVyLlxyXG4gICAgICovXHJcbiAgICB1bnJlZ2lzdGVyKGZpZWxkLCBvcHRpb25zID0ge30pIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5nbG9iYWxDYWNoZS5maWVsZE9wdGlvbnNbZmllbGRdO1xyXG4gICAgICAgIGlmICghb3B0aW9ucy5za2lwSXNGaWVsZE9mQmFzZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkSG9va3MudW5yZWdpc3RlcihcImlzRmllbGRPZkJhc2VcIiwgZmllbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW9wdGlvbnMuc2tpcEdldEZpZWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRIb29rcy51bnJlZ2lzdGVyKFwiZ2V0RmllbGRcIiwgZmllbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW9wdGlvbnMuc2tpcFNldEZpZWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRIb29rcy51bnJlZ2lzdGVyKFwic2V0RmllbGRcIiwgZmllbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpZHggPSB0aGlzLmxvY2FsQ2FjaGUuaW5kZXhPZihmaWVsZCk7XHJcbiAgICAgICAgaWYgKGlkeCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxDYWNoZS5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLnNraXBSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVucmVnaXN0ZXJBbGwoKSB7XHJcbiAgICAgICAgLy8gU2tpcCBmaWVsZCBob29rIHVucmVnaXN0ZXIgYW5kIHVzZSBmaWVsZEhvb2tzLnVucmVnaXN0ZXJBbGxcclxuICAgICAgICAvLyB0byB1bnJlZ2lzdGVyIHRob3NlIGNyZWF0ZWQgYnkgdGhpcyBtYW5hZ2VyIG9ubHlcclxuICAgICAgICBbLi4udGhpcy5sb2NhbENhY2hlXS5mb3JFYWNoKChmaWVsZCkgPT4gdGhpcy51bnJlZ2lzdGVyKGZpZWxkLCB7XHJcbiAgICAgICAgICAgIHNraXBHZXRGaWVsZDogdHJ1ZSxcclxuICAgICAgICAgICAgc2tpcFNldEZpZWxkOiB0cnVlLFxyXG4gICAgICAgICAgICBza2lwSXNGaWVsZE9mQmFzZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2tpcFJlZnJlc2g6IHRydWUsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuZmllbGRIb29rcy51bnJlZ2lzdGVyQWxsKCk7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlZnJlc2ggYWxsIGl0ZW0gYm94ZXMuXHJcbiAgICAgKi9cclxuICAgIHJlZnJlc2goKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgQXJyYXkuZnJvbSh0aGlzLmdldEdsb2JhbChcImRvY3VtZW50XCIpLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pc1pvdGVybzcoKSA/IFwiaXRlbS1ib3hcIiA6IFwiem90ZXJvaXRlbWJveFwiKSkuZm9yRWFjaCgoZWxlbSkgPT4gZWxlbS5yZWZyZXNoKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZyhlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBpbml0aWFsaXplR2xvYmFsKCkge1xyXG4gICAgICAgIGNvbnN0IFpvdGVybyA9IHRoaXMuZ2V0R2xvYmFsKFwiWm90ZXJvXCIpO1xyXG4gICAgICAgIGF3YWl0IFpvdGVyby51aVJlYWR5UHJvbWlzZTtcclxuICAgICAgICBjb25zdCB3aW5kb3cgPSB0aGlzLmdldEdsb2JhbChcIndpbmRvd1wiKTtcclxuICAgICAgICB0aGlzLmdsb2JhbENhY2hlID0gdG9vbGtpdEdsb2JhbF8xLmRlZmF1bHQuZ2V0SW5zdGFuY2UoKS5pdGVtQm94O1xyXG4gICAgICAgIGNvbnN0IGdsb2JhbENhY2hlID0gdGhpcy5nbG9iYWxDYWNoZTtcclxuICAgICAgICBjb25zdCBpblpvdGVybzcgPSB0aGlzLmlzWm90ZXJvNygpO1xyXG4gICAgICAgIGlmICghZ2xvYmFsQ2FjaGUuX3JlYWR5KSB7XHJcbiAgICAgICAgICAgIGdsb2JhbENhY2hlLl9yZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgIGxldCBpdGVtQm94SW5zdGFuY2U7XHJcbiAgICAgICAgICAgIGlmIChpblpvdGVybzcpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1Cb3hJbnN0YW5jZSA9IG5ldyAodGhpcy5nZXRHbG9iYWwoXCJjdXN0b21FbGVtZW50c1wiKS5nZXQoXCJpdGVtLWJveFwiKSkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1Cb3hJbnN0YW5jZSA9IHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3pvdGVyby1lZGl0cGFuZS1pdGVtLWJveFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdhaXQgPSA1MDAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCFpdGVtQm94SW5zdGFuY2UgJiYgdCA8IHdhaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtQm94SW5zdGFuY2UgPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN6b3Rlcm8tZWRpdHBhbmUtaXRlbS1ib3hcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgWm90ZXJvLlByb21pc2UuZGVsYXkoMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIHQgKz0gMTA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW1Cb3hJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbENhY2hlLl9yZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiSXRlbUJveCBpbml0aWFsaXphdGlvbiBmYWlsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucGF0Y2hlck1hbmFnZXIucmVnaXN0ZXIoaXRlbUJveEluc3RhbmNlLl9fcHJvdG9fXywgXCJyZWZyZXNoXCIsIChvcmlnaW5hbCkgPT4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxUaGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsLmFwcGx5KG9yaWdpbmFsVGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZXh0cmFGaWVsZCBvZiBPYmplY3QudmFsdWVzKGdsb2JhbENhY2hlLmZpZWxkT3B0aW9ucykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaW5ab3Rlcm83ID8gXCJ0aFwiIDogXCJsYWJlbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZEhlYWRlci5zZXRBdHRyaWJ1dGUoXCJmaWVsZG5hbWVcIiwgZXh0cmFGaWVsZC5maWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlZktleSA9IGBleHRlbnNpb25zLnpvdGVyby5wbHVnaW5Ub29sa2l0LmZpZWxkQ29sbGFwc2VkLiR7ZXh0cmFGaWVsZC5maWVsZH1gO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IGV4dHJhRmllbGQubXVsdGlsaW5lICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhRmllbGQuY29sbGFwc2libGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgWm90ZXJvLlByZWZzLmdldChwcmVmS2V5LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGVhZGVyQ29udGVudCA9IGV4dHJhRmllbGQuZGlzcGxheU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJDb250ZW50ID0gYCguLi4pJHtoZWFkZXJDb250ZW50fWA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpblpvdGVybzcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBcImtleVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IGhlYWRlckNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkSGVhZGVyLmFwcGVuZENoaWxkKGxhYmVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkSGVhZGVyLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGhlYWRlckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBfY2xpY2thYmxlID0gb3JpZ2luYWxUaGlzLmNsaWNrYWJsZTtcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFRoaXMuY2xpY2thYmxlID0gZXh0cmFGaWVsZC5lZGl0YWJsZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZFZhbHVlID0gb3JpZ2luYWxUaGlzLmNyZWF0ZVZhbHVlRWxlbWVudChvcmlnaW5hbFRoaXMuaXRlbS5nZXRGaWVsZChleHRyYUZpZWxkLmZpZWxkKSwgZXh0cmFGaWVsZC5maWVsZCwgMTA5OSk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxUaGlzLmNsaWNrYWJsZSA9IF9jbGlja2FibGU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gWm90ZXJvIDYgaXMgbXVsdGlsaW5lIGJ5IGRlZmF1bHQsIHdoaWxlIFpvdGVybyA3IGlzIG5vdFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChleHRyYUZpZWxkLm11bHRpbGluZSAmJiAhWm90ZXJvLlByZWZzLmdldChwcmVmS2V5LCB0cnVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFZhbHVlLmNsYXNzTGlzdC5hZGQoXCJtdWx0aWxpbmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFpblpvdGVybzcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGlzYWJsZSBtdWx0aWxpbmUgaW4gWm90ZXJvIDZcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRWYWx1ZS5zZXRBdHRyaWJ1dGUoXCJjcm9wXCIsIFwiZW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFZhbHVlLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGZpZWxkVmFsdWUuaW5uZXJIVE1MKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRWYWx1ZS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0cmFGaWVsZC5jb2xsYXBzaWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZEhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBab3Rlcm8uUHJlZnMuc2V0KHByZWZLZXksICEoWm90ZXJvLlByZWZzLmdldChwcmVmS2V5LCB0cnVlKSB8fCBmYWxzZSksIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxUaGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkSGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBpblpvdGVybzdcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0RmllbGQgPSAoX2EgPSBldi5jdXJyZW50VGFyZ2V0Lm5leHRFbGVtZW50U2libGluZykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dCwgdGV4dGFyZWFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRGaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0RmllbGQuYmx1cigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dEZpZWxkID0gKF9hID0gZXYuY3VycmVudFRhcmdldFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5uZXh0RWxlbWVudFNpYmxpbmcpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbnB1dEZpZWxkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0RmllbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dEZpZWxkLmJsdXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFibGUgPSBpblpvdGVybzdcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBvcmlnaW5hbFRoaXMuX2luZm9UYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG9yaWdpbmFsVGhpcy5fZHluYW1pY0ZpZWxkcztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmllbGRJbmRleCA9IGV4dHJhRmllbGQuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSW5kZXggMCBtdXN0IGJlIGl0ZW1UeXBlIGZpZWxkLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkSW5kZXggPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGRJbmRleCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZEluZGV4ID49IDAgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRJbmRleCA8IHRhYmxlLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFRoaXMuX2JlZm9yZVJvdyA9IHRhYmxlLmNoaWxkcmVuW2ZpZWxkSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFRoaXMuYWRkRHluYW1pY1JvdyhmaWVsZEhlYWRlciwgZmllbGRWYWx1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFRoaXMuYWRkRHluYW1pY1JvdyhmaWVsZEhlYWRlciwgZmllbGRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXphdGlvbkxvY2sucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuSXRlbUJveE1hbmFnZXIgPSBJdGVtQm94TWFuYWdlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXRlbUJveC5qcy5tYXAiLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5MYXJnZVByZWZIZWxwZXIgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbi8qKlxyXG4gKiBIZWxwZXIgY2xhc3MgZm9yIHN0b3JpbmcgbGFyZ2UgYW1vdW50cyBvZiBkYXRhIGluIFpvdGVybyBwcmVmZXJlbmNlcy5cclxuICpcclxuICogQHJlbWFya3NcclxuICogVGhlIGFsbG93ZWQgZGF0YSBsZW5ndGggZm9yIGEgc2luZ2xlIHByZWZlcmVuY2UgaXMgYXQgbGVhc3QgMTAwayxcclxuICogYnV0IGlmIHRoaXMgY2FuIGdyb3cgaW5maW5pdGVseSwgbGlrZSBhbiBBcnJheSBvciBhbiBPYmplY3QsXHJcbiAqIHRoZXJlIHdpbGwgYmUgc2lnbmlmaWNhbnQgcGVyZm9ybWFuY2UgcHJvYmxlbXMuXHJcbiAqXHJcbiAqIFRoaXMgY2xhc3Mgc3RvcmVzIHRoZSBrZXlzIG9mIGRhdGEgaW4gYSBzaW5nbGUgcHJlZmVyZW5jZSBhcyBhIEpTT04gc3RyaW5nIG9mIEFycmF5LFxyXG4gKiBhbmQgc3RvcmVzIHRoZSB2YWx1ZXMgb2YgZGF0YSBpbiBzZXBhcmF0ZSBwcmVmZXJlbmNlcy5cclxuICpcclxuICogWW91IGNhbiBlaXRoZXIgdXNlIHRoZSBjbGFzcyBhcyBhIG5vcm1hbCBvYmplY3Qgd2l0aCBgYXNPYmplY3QoKWAsXHJcbiAqIG9yIHVzZSB0aGUgbWV0aG9kcyB0byBhY2Nlc3MgdGhlIGRhdGEuXHJcbiAqL1xyXG5jbGFzcyBMYXJnZVByZWZIZWxwZXIgZXh0ZW5kcyBiYXNpY18xLkJhc2ljVG9vbCB7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ga2V5UHJlZiBUaGUgcHJlZmVyZW5jZSBuYW1lIGZvciBzdG9yaW5nIHRoZSBrZXlzIG9mIHRoZSBkYXRhLlxyXG4gICAgICogQHBhcmFtIHZhbHVlUHJlZlByZWZpeCBUaGUgcHJlZmVyZW5jZSBuYW1lIHByZWZpeCBmb3Igc3RvcmluZyB0aGUgdmFsdWVzIG9mIHRoZSBkYXRhLlxyXG4gICAgICogQHBhcmFtIGhvb2tzIEhvb2tzIGZvciBwYXJzaW5nIHRoZSB2YWx1ZXMgb2YgdGhlIGRhdGEuXHJcbiAgICAgKiAtIGBhZnRlckdldFZhbHVlYDogQSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSB2YWx1ZSBvZiB0aGUgZGF0YSBhcyBpbnB1dCBhbmQgcmV0dXJucyB0aGUgcGFyc2VkIHZhbHVlLlxyXG4gICAgICogLSBgYmVmb3JlU2V0VmFsdWVgOiBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdGhlIGtleSBhbmQgdmFsdWUgb2YgdGhlIGRhdGEgYXMgaW5wdXQgYW5kIHJldHVybnMgdGhlIHBhcnNlZCBrZXkgYW5kIHZhbHVlLlxyXG4gICAgICogSWYgYGhvb2tzYCBpcyBgXCJkZWZhdWx0XCJgLCBubyBwYXJzaW5nIHdpbGwgYmUgZG9uZS5cclxuICAgICAqIElmIGBob29rc2AgaXMgYFwicGFyc2VyXCJgLCB0aGUgdmFsdWVzIHdpbGwgYmUgcGFyc2VkIGFzIEpTT04uXHJcbiAgICAgKiBJZiBgaG9va3NgIGlzIGFuIG9iamVjdCwgdGhlIHZhbHVlcyB3aWxsIGJlIHBhcnNlZCBieSB0aGUgaG9va3MuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGtleVByZWYsIHZhbHVlUHJlZlByZWZpeCwgaG9va3MgPSBcImRlZmF1bHRcIikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5rZXlQcmVmID0ga2V5UHJlZjtcclxuICAgICAgICB0aGlzLnZhbHVlUHJlZlByZWZpeCA9IHZhbHVlUHJlZlByZWZpeDtcclxuICAgICAgICBpZiAoaG9va3MgPT09IFwiZGVmYXVsdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9va3MgPSBkZWZhdWx0SG9va3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhvb2tzID09PSBcInBhcnNlclwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9va3MgPSBwYXJzZXJIb29rcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9va3MgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRIb29rcyksIGhvb2tzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbm5lck9iaiA9IHt9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG9iamVjdCB0aGF0IHN0b3JlcyB0aGUgZGF0YS5cclxuICAgICAqIEByZXR1cm5zIFRoZSBvYmplY3QgdGhhdCBzdG9yZXMgdGhlIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGFzT2JqZWN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdFRlbXBPYmooKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBNYXAgdGhhdCBzdG9yZXMgdGhlIGRhdGEuXHJcbiAgICAgKiBAcmV0dXJucyBUaGUgTWFwIHRoYXQgc3RvcmVzIHRoZSBkYXRhLlxyXG4gICAgICovXHJcbiAgICBhc01hcExpa2UoKSB7XHJcbiAgICAgICAgY29uc3QgbWFwTGlrZSA9IHtcclxuICAgICAgICAgICAgZ2V0OiAoa2V5KSA9PiB0aGlzLmdldFZhbHVlKGtleSksXHJcbiAgICAgICAgICAgIHNldDogKGtleSwgdmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwTGlrZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGFzOiAoa2V5KSA9PiB0aGlzLmhhc0tleShrZXkpLFxyXG4gICAgICAgICAgICBkZWxldGU6IChrZXkpID0+IHRoaXMuZGVsZXRlS2V5KGtleSksXHJcbiAgICAgICAgICAgIGNsZWFyOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmdldEtleXMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlS2V5KGtleSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvckVhY2g6IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0VGVtcE1hcCgpLmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXQgc2l6ZSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90aGlzLmdldEtleXMoKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudHJpZXM6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdFRlbXBNYXAoKS52YWx1ZXMoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAga2V5czogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IHRoaXMuZ2V0S2V5cygpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleXNbU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB2YWx1ZXM6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdFRlbXBNYXAoKS52YWx1ZXMoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgW1N5bWJvbC5pdGVyYXRvcl06ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdFRlbXBNYXAoKVtTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFtTeW1ib2wudG9TdHJpbmdUYWddOiBcIk1hcExpa2VcIixcclxuICAgICAgICAgICAgX3RoaXM6IHRoaXMsXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbWFwTGlrZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBrZXlzIG9mIHRoZSBkYXRhLlxyXG4gICAgICogQHJldHVybnMgVGhlIGtleXMgb2YgdGhlIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGdldEtleXMoKSB7XHJcbiAgICAgICAgY29uc3QgcmF3S2V5cyA9IFpvdGVyby5QcmVmcy5nZXQodGhpcy5rZXlQcmVmLCB0cnVlKTtcclxuICAgICAgICBjb25zdCBrZXlzID0gcmF3S2V5cyA/IEpTT04ucGFyc2UocmF3S2V5cykgOiBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gXCJwbGFjZWhvbGRlclwiO1xyXG4gICAgICAgICAgICB0aGlzLmlubmVyT2JqW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGtleXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUga2V5cyBvZiB0aGUgZGF0YS5cclxuICAgICAqIEBwYXJhbSBrZXlzIFRoZSBrZXlzIG9mIHRoZSBkYXRhLlxyXG4gICAgICovXHJcbiAgICBzZXRLZXlzKGtleXMpIHtcclxuICAgICAgICBrZXlzID0gWy4uLm5ldyBTZXQoa2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5KSldO1xyXG4gICAgICAgIFpvdGVyby5QcmVmcy5zZXQodGhpcy5rZXlQcmVmLCBKU09OLnN0cmluZ2lmeShrZXlzKSwgdHJ1ZSk7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IFwicGxhY2Vob2xkZXJcIjtcclxuICAgICAgICAgICAgdGhpcy5pbm5lck9ialtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIGEga2V5LlxyXG4gICAgICogQHBhcmFtIGtleSBUaGUga2V5IG9mIHRoZSBkYXRhLlxyXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIG9mIHRoZSBrZXkuXHJcbiAgICAgKi9cclxuICAgIGdldFZhbHVlKGtleSkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gWm90ZXJvLlByZWZzLmdldChgJHt0aGlzLnZhbHVlUHJlZlByZWZpeH0ke2tleX1gLCB0cnVlKTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHsgdmFsdWU6IG5ld1ZhbHVlIH0gPSB0aGlzLmhvb2tzLmFmdGVyR2V0VmFsdWUoeyB2YWx1ZSB9KTtcclxuICAgICAgICB0aGlzLmlubmVyT2JqW2tleV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgdmFsdWUgb2YgYSBrZXkuXHJcbiAgICAgKiBAcGFyYW0ga2V5IFRoZSBrZXkgb2YgdGhlIGRhdGEuXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBrZXkuXHJcbiAgICAgKi9cclxuICAgIHNldFZhbHVlKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBsZXQgeyBrZXk6IG5ld0tleSwgdmFsdWU6IG5ld1ZhbHVlIH0gPSB0aGlzLmhvb2tzLmJlZm9yZVNldFZhbHVlKHtcclxuICAgICAgICAgICAga2V5LFxyXG4gICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNldEtleShuZXdLZXkpO1xyXG4gICAgICAgIFpvdGVyby5QcmVmcy5zZXQoYCR7dGhpcy52YWx1ZVByZWZQcmVmaXh9JHtuZXdLZXl9YCwgbmV3VmFsdWUsIHRydWUpO1xyXG4gICAgICAgIHRoaXMuaW5uZXJPYmpbbmV3S2V5XSA9IG5ld1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBhIGtleSBleGlzdHMuXHJcbiAgICAgKiBAcGFyYW0ga2V5IFRoZSBrZXkgb2YgdGhlIGRhdGEuXHJcbiAgICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBrZXkgZXhpc3RzLlxyXG4gICAgICovXHJcbiAgICBoYXNLZXkoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0S2V5cygpLmluY2x1ZGVzKGtleSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIGtleS5cclxuICAgICAqIEBwYXJhbSBrZXkgVGhlIGtleSBvZiB0aGUgZGF0YS5cclxuICAgICAqL1xyXG4gICAgc2V0S2V5KGtleSkge1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLmdldEtleXMoKTtcclxuICAgICAgICBpZiAoIWtleXMuaW5jbHVkZXMoa2V5KSkge1xyXG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgLy8gT2JqIGlzIHVwZGF0ZWQgaGVyZVxyXG4gICAgICAgICAgICB0aGlzLnNldEtleXMoa2V5cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWxldGUgYSBrZXkuXHJcbiAgICAgKiBAcGFyYW0ga2V5IFRoZSBrZXkgb2YgdGhlIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZUtleShrZXkpIHtcclxuICAgICAgICBjb25zdCBrZXlzID0gdGhpcy5nZXRLZXlzKCk7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBrZXlzLmluZGV4T2Yoa2V5KTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBrZXlzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmlubmVyT2JqW2tleV07XHJcbiAgICAgICAgICAgIC8vIE9iaiBpcyB1cGRhdGVkIGhlcmVcclxuICAgICAgICAgICAgdGhpcy5zZXRLZXlzKGtleXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBab3Rlcm8uUHJlZnMuY2xlYXIoYCR7dGhpcy52YWx1ZVByZWZQcmVmaXh9JHtrZXl9YCwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RUZW1wT2JqKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGhpcy5pbm5lck9iaiwge1xyXG4gICAgICAgICAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldEtleXMoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gXCJzdHJpbmdcIiAmJiBwcm9wIGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0VmFsdWUocHJvcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogKHRhcmdldCwgcCwgbmV3VmFsdWUsIHJlY2VpdmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHAgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUtleShwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUocCwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgcCwgbmV3VmFsdWUsIHJlY2VpdmVyKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGFzOiAodGFyZ2V0LCBwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldEtleXMoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWxldGVQcm9wZXJ0eTogKHRhcmdldCwgcCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVLZXkocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0VGVtcE1hcCgpIHtcclxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5nZXRLZXlzKCkpIHtcclxuICAgICAgICAgICAgbWFwLnNldChrZXksIHRoaXMuZ2V0VmFsdWUoa2V5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXA7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5MYXJnZVByZWZIZWxwZXIgPSBMYXJnZVByZWZIZWxwZXI7XHJcbmNvbnN0IGRlZmF1bHRIb29rcyA9IHtcclxuICAgIGFmdGVyR2V0VmFsdWU6ICh7IHZhbHVlIH0pID0+ICh7IHZhbHVlIH0pLFxyXG4gICAgYmVmb3JlU2V0VmFsdWU6ICh7IGtleSwgdmFsdWUgfSkgPT4gKHsga2V5LCB2YWx1ZSB9KSxcclxufTtcclxuY29uc3QgcGFyc2VySG9va3MgPSB7XHJcbiAgICBhZnRlckdldFZhbHVlOiAoeyB2YWx1ZSB9KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWUgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgdmFsdWUgfTtcclxuICAgIH0sXHJcbiAgICBiZWZvcmVTZXRWYWx1ZTogKHsga2V5LCB2YWx1ZSB9KSA9PiB7XHJcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHsga2V5LCB2YWx1ZSB9O1xyXG4gICAgfSxcclxufTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGFyZ2VQcmVmLmpzLm1hcCIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLktleU1vZGlmaWVyID0gZXhwb3J0cy5LZXlib2FyZE1hbmFnZXIgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbmNvbnN0IHdhaXRfMSA9IHJlcXVpcmUoXCIuLi91dGlscy93YWl0XCIpO1xyXG4vKipcclxuICogUmVnaXN0ZXIgYSBnbG9iYWwga2V5Ym9hcmQgZXZlbnQgbGlzdGVuZXIuXHJcbiAqL1xyXG5jbGFzcyBLZXlib2FyZE1hbmFnZXIgZXh0ZW5kcyBiYXNpY18xLk1hbmFnZXJUb29sIHtcclxuICAgIGNvbnN0cnVjdG9yKGJhc2UpIHtcclxuICAgICAgICBzdXBlcihiYXNlKTtcclxuICAgICAgICB0aGlzLl9rZXlib2FyZENhbGxiYWNrcyA9IG5ldyBTZXQoKTtcclxuICAgICAgICB0aGlzLmluaXRLZXlib2FyZExpc3RlbmVyID0gdGhpcy5faW5pdEtleWJvYXJkTGlzdGVuZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnVuSW5pdEtleWJvYXJkTGlzdGVuZXIgPSB0aGlzLl91bkluaXRLZXlib2FyZExpc3RlbmVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyS2V5ZG93biA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2FjaGVkS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZWRLZXkgPSBuZXcgS2V5TW9kaWZpZXIoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZWRLZXkubWVyZ2UobmV3IEtleU1vZGlmaWVyKGUpLCB7IGFsbG93T3ZlcndyaXRlOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoQ2FsbGJhY2soZSwge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJrZXlkb3duXCIsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyS2V5dXAgPSBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2NhY2hlZEtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTaG9ydGN1dCA9IG5ldyBLZXlNb2RpZmllcih0aGlzLl9jYWNoZWRLZXkpO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWNoZWRLZXkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hDYWxsYmFjayhlLCB7XHJcbiAgICAgICAgICAgICAgICBrZXlib2FyZDogY3VycmVudFNob3J0Y3V0LFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJrZXl1cFwiLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaWQgPSBab3Rlcm8uVXRpbGl0aWVzLnJhbmRvbVN0cmluZygpO1xyXG4gICAgICAgIHRoaXMuX2Vuc3VyZUF1dG9VbnJlZ2lzdGVyQWxsKCk7XHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lckNhbGxiYWNrKFwib25NYWluV2luZG93TG9hZFwiLCB0aGlzLmluaXRLZXlib2FyZExpc3RlbmVyKTtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyQ2FsbGJhY2soXCJvbk1haW5XaW5kb3dVbmxvYWRcIiwgdGhpcy51bkluaXRLZXlib2FyZExpc3RlbmVyKTtcclxuICAgICAgICB0aGlzLmluaXRSZWFkZXJLZXlib2FyZExpc3RlbmVyKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCB3aW4gb2YgWm90ZXJvLmdldE1haW5XaW5kb3dzKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0S2V5Ym9hcmRMaXN0ZW5lcih3aW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgYSBrZXlib2FyZCBldmVudCBsaXN0ZW5lci5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fa2V5Ym9hcmRDYWxsYmFja3MuYWRkKGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVW5yZWdpc3RlciBhIGtleWJvYXJkIGV2ZW50IGxpc3RlbmVyLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayBmdW5jdGlvbi5cclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3RlcihjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuX2tleWJvYXJkQ2FsbGJhY2tzLmRlbGV0ZShjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVucmVnaXN0ZXIgYWxsIGtleWJvYXJkIGV2ZW50IGxpc3RlbmVycy5cclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3RlckFsbCgpIHtcclxuICAgICAgICB0aGlzLl9rZXlib2FyZENhbGxiYWNrcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXJDYWxsYmFjayhcIm9uTWFpbldpbmRvd0xvYWRcIiwgdGhpcy5pbml0S2V5Ym9hcmRMaXN0ZW5lcik7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lckNhbGxiYWNrKFwib25NYWluV2luZG93VW5sb2FkXCIsIHRoaXMudW5Jbml0S2V5Ym9hcmRMaXN0ZW5lcik7XHJcbiAgICAgICAgZm9yIChjb25zdCB3aW4gb2YgWm90ZXJvLmdldE1haW5XaW5kb3dzKCkpIHtcclxuICAgICAgICAgICAgdGhpcy51bkluaXRLZXlib2FyZExpc3RlbmVyKHdpbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaW5pdFJlYWRlcktleWJvYXJkTGlzdGVuZXIoKSB7XHJcbiAgICAgICAgWm90ZXJvLlJlYWRlci5yZWdpc3RlckV2ZW50TGlzdGVuZXIoXCJyZW5kZXJUb29sYmFyXCIsIChldmVudCkgPT4gdGhpcy5hZGRSZWFkZXJLZXlib2FyZENhbGxiYWNrKGV2ZW50KSwgdGhpcy5fYmFzaWNPcHRpb25zLmFwaS5wbHVnaW5JRCk7XHJcbiAgICAgICAgWm90ZXJvLlJlYWRlci5fcmVhZGVycy5mb3JFYWNoKChyZWFkZXIpID0+IHRoaXMuYWRkUmVhZGVyS2V5Ym9hcmRDYWxsYmFjayh7IHJlYWRlciB9KSk7XHJcbiAgICB9XHJcbiAgICBhZGRSZWFkZXJLZXlib2FyZENhbGxiYWNrKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgcmVhZGVyID0gZXZlbnQucmVhZGVyO1xyXG4gICAgICAgIGxldCBpbml0aWFsaXplZEtleSA9IGBfenRvb2xraXRLZXlib2FyZCR7dGhpcy5pZH1Jbml0aWFsaXplZGA7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBleHRyYSBwcm9wZXJ0eVxyXG4gICAgICAgIGlmIChyZWFkZXIuX2lmcmFtZVdpbmRvd1tpbml0aWFsaXplZEtleV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pbml0S2V5Ym9hcmRMaXN0ZW5lcihyZWFkZXIuX2lmcmFtZVdpbmRvdyk7XHJcbiAgICAgICAgKDAsIHdhaXRfMS53YWl0VW50aWwpKCgpID0+IHtcclxuICAgICAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICAgICAgcmV0dXJuICFDb21wb25lbnRzLnV0aWxzLmlzRGVhZFdyYXBwZXIocmVhZGVyLl9pbnRlcm5hbFJlYWRlcikgJiZcclxuICAgICAgICAgICAgICAgICgoX2IgPSAoX2EgPSByZWFkZXIuX2ludGVybmFsUmVhZGVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuX3ByaW1hcnlWaWV3KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuX2lmcmFtZVdpbmRvdyk7XHJcbiAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbml0S2V5Ym9hcmRMaXN0ZW5lcigoX2EgPSByZWFkZXIuX2ludGVybmFsUmVhZGVyLl9wcmltYXJ5VmlldykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLl9pZnJhbWVXaW5kb3cpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmUgZXh0cmEgcHJvcGVydHlcclxuICAgICAgICByZWFkZXIuX2lmcmFtZVdpbmRvd1tpbml0aWFsaXplZEtleV0gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgX2luaXRLZXlib2FyZExpc3RlbmVyKHdpbikge1xyXG4gICAgICAgIGlmICghd2luKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMudHJpZ2dlcktleWRvd24pO1xyXG4gICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy50cmlnZ2VyS2V5dXApO1xyXG4gICAgfVxyXG4gICAgX3VuSW5pdEtleWJvYXJkTGlzdGVuZXIod2luKSB7XHJcbiAgICAgICAgaWYgKCF3aW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy50cmlnZ2VyS2V5ZG93bik7XHJcbiAgICAgICAgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLnRyaWdnZXJLZXl1cCk7XHJcbiAgICB9XHJcbiAgICBkaXNwYXRjaENhbGxiYWNrKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLl9rZXlib2FyZENhbGxiYWNrcy5mb3JFYWNoKChjYmspID0+IGNiayguLi5hcmdzKSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5LZXlib2FyZE1hbmFnZXIgPSBLZXlib2FyZE1hbmFnZXI7XHJcbi8qKlxyXG4gKiBDbGFzcyB0byByZXByZXNlbnQga2V5IHdpdGggbW9kaWZpZXJzXHJcbiAqL1xyXG5jbGFzcyBLZXlNb2RpZmllciB7XHJcbiAgICBjb25zdHJ1Y3RvcihyYXcsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLmFjY2VsID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zaGlmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubWV0YSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWx0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5rZXkgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudXNlQWNjZWwgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnVzZUFjY2VsID0gKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy51c2VBY2NlbCkgfHwgZmFsc2U7XHJcbiAgICAgICAgaWYgKHR5cGVvZiByYXcgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHJhdyA9IHJhdyB8fCBcIlwiO1xyXG4gICAgICAgICAgICByYXcgPSB0aGlzLnVuTG9jYWxpemVkKHJhdyk7XHJcbiAgICAgICAgICAgIHRoaXMuYWNjZWwgPSByYXcuaW5jbHVkZXMoXCJhY2NlbFwiKTtcclxuICAgICAgICAgICAgdGhpcy5zaGlmdCA9IHJhdy5pbmNsdWRlcyhcInNoaWZ0XCIpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wgPSByYXcuaW5jbHVkZXMoXCJjb250cm9sXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGEgPSByYXcuaW5jbHVkZXMoXCJtZXRhXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmFsdCA9IHJhdy5pbmNsdWRlcyhcImFsdFwiKTtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBtb2RpZmllcnMsIHNwYWNlLCBjb21tYSwgYW5kIGRhc2hcclxuICAgICAgICAgICAgdGhpcy5rZXkgPSByYXdcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oYWNjZWx8c2hpZnR8Y29udHJvbHxtZXRhfGFsdHwgfCx8LSkvZywgXCJcIilcclxuICAgICAgICAgICAgICAgIC50b0xvY2FsZUxvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyYXcgaW5zdGFuY2VvZiBLZXlNb2RpZmllcikge1xyXG4gICAgICAgICAgICB0aGlzLm1lcmdlKHJhdywgeyBhbGxvd092ZXJ3cml0ZTogdHJ1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMudXNlQWNjZWwpIHtcclxuICAgICAgICAgICAgICAgIGlmIChab3Rlcm8uaXNNYWMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjY2VsID0gcmF3Lm1ldGFLZXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjY2VsID0gcmF3LmN0cmxLZXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zaGlmdCA9IHJhdy5zaGlmdEtleTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sID0gcmF3LmN0cmxLZXk7XHJcbiAgICAgICAgICAgIHRoaXMubWV0YSA9IHJhdy5tZXRhS2V5O1xyXG4gICAgICAgICAgICB0aGlzLmFsdCA9IHJhdy5hbHRLZXk7XHJcbiAgICAgICAgICAgIGlmICghW1wiU2hpZnRcIiwgXCJNZXRhXCIsIFwiQ3RybFwiLCBcIkFsdFwiLCBcIkNvbnRyb2xcIl0uaW5jbHVkZXMocmF3LmtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua2V5ID0gcmF3LmtleTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogTWVyZ2UgYW5vdGhlciBLZXlNb2RpZmllciBpbnRvIHRoaXMgb25lLlxyXG4gICAgICogQHBhcmFtIG5ld01vZCB0aGUgbmV3IEtleU1vZGlmaWVyXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgbWVyZ2UobmV3TW9kLCBvcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgYWxsb3dPdmVyd3JpdGUgPSAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmFsbG93T3ZlcndyaXRlKSB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLm1lcmdlQXR0cmlidXRlKFwiYWNjZWxcIiwgbmV3TW9kLmFjY2VsLCBhbGxvd092ZXJ3cml0ZSk7XHJcbiAgICAgICAgdGhpcy5tZXJnZUF0dHJpYnV0ZShcInNoaWZ0XCIsIG5ld01vZC5zaGlmdCwgYWxsb3dPdmVyd3JpdGUpO1xyXG4gICAgICAgIHRoaXMubWVyZ2VBdHRyaWJ1dGUoXCJjb250cm9sXCIsIG5ld01vZC5jb250cm9sLCBhbGxvd092ZXJ3cml0ZSk7XHJcbiAgICAgICAgdGhpcy5tZXJnZUF0dHJpYnV0ZShcIm1ldGFcIiwgbmV3TW9kLm1ldGEsIGFsbG93T3ZlcndyaXRlKTtcclxuICAgICAgICB0aGlzLm1lcmdlQXR0cmlidXRlKFwiYWx0XCIsIG5ld01vZC5hbHQsIGFsbG93T3ZlcndyaXRlKTtcclxuICAgICAgICB0aGlzLm1lcmdlQXR0cmlidXRlKFwia2V5XCIsIG5ld01vZC5rZXksIGFsbG93T3ZlcndyaXRlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgdGhlIGN1cnJlbnQgS2V5TW9kaWZpZXIgZXF1YWxzIHRvIGFub3RoZXIgS2V5TW9kaWZpZXIuXHJcbiAgICAgKiBAcGFyYW0gbmV3TW9kIHRoZSBuZXcgS2V5TW9kaWZpZXJcclxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgZXF1YWxzXHJcbiAgICAgKi9cclxuICAgIGVxdWFscyhuZXdNb2QpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG5ld01vZCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBuZXdNb2QgPSBuZXcgS2V5TW9kaWZpZXIobmV3TW9kKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ29tcGFyZSBrZXkgYW5kIG5vbi1wbGF0Zm9ybSBtb2RpZmllcnMgZmlyc3RcclxuICAgICAgICBpZiAodGhpcy5zaGlmdCAhPT0gbmV3TW9kLnNoaWZ0IHx8XHJcbiAgICAgICAgICAgIHRoaXMuYWx0ICE9PSBuZXdNb2QuYWx0IHx8XHJcbiAgICAgICAgICAgIHRoaXMua2V5LnRvTG93ZXJDYXNlKCkgIT09IG5ld01vZC5rZXkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENvbXBhcmUgcGxhdGZvcm0gbW9kaWZpZXJzXHJcbiAgICAgICAgaWYgKHRoaXMuYWNjZWwgfHwgbmV3TW9kLmFjY2VsKSB7XHJcbiAgICAgICAgICAgIGlmIChab3Rlcm8uaXNNYWMpIHtcclxuICAgICAgICAgICAgICAgIGlmICgodGhpcy5hY2NlbCB8fCB0aGlzLm1ldGEpICE9PSAobmV3TW9kLmFjY2VsIHx8IG5ld01vZC5tZXRhKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbCAhPT0gbmV3TW9kLmNvbnRyb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMuYWNjZWwgfHwgdGhpcy5jb250cm9sKSAhPT0gKG5ld01vZC5hY2NlbCB8fCBuZXdNb2QuY29udHJvbCkgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGEgIT09IG5ld01vZC5tZXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9sICE9PSBuZXdNb2QuY29udHJvbCB8fCB0aGlzLm1ldGEgIT09IG5ld01vZC5tZXRhKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcmF3IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgS2V5TW9kaWZpZXIuXHJcbiAgICAgKi9cclxuICAgIGdldFJhdygpIHtcclxuICAgICAgICBjb25zdCBlbmFibGVkID0gW107XHJcbiAgICAgICAgdGhpcy5hY2NlbCAmJiBlbmFibGVkLnB1c2goXCJhY2NlbFwiKTtcclxuICAgICAgICB0aGlzLnNoaWZ0ICYmIGVuYWJsZWQucHVzaChcInNoaWZ0XCIpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbCAmJiBlbmFibGVkLnB1c2goXCJjb250cm9sXCIpO1xyXG4gICAgICAgIHRoaXMubWV0YSAmJiBlbmFibGVkLnB1c2goXCJtZXRhXCIpO1xyXG4gICAgICAgIHRoaXMuYWx0ICYmIGVuYWJsZWQucHVzaChcImFsdFwiKTtcclxuICAgICAgICB0aGlzLmtleSAmJiBlbmFibGVkLnB1c2godGhpcy5rZXkpO1xyXG4gICAgICAgIHJldHVybiBlbmFibGVkLmpvaW4oXCIsXCIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIGxvY2FsaXplZCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIEtleU1vZGlmaWVyLlxyXG4gICAgICovXHJcbiAgICBnZXRMb2NhbGl6ZWQoKSB7XHJcbiAgICAgICAgY29uc3QgcmF3ID0gdGhpcy5nZXRSYXcoKTtcclxuICAgICAgICBpZiAoWm90ZXJvLmlzTWFjKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByYXdcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwiY29udHJvbFwiLCBcIlx1MjMwM1wiKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCJhbHRcIiwgXCJcdTIzMjVcIilcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwic2hpZnRcIiwgXCJcdTIxRTdcIilcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwibWV0YVwiLCBcIlx1MjMxOFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiByYXdcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwiY29udHJvbFwiLCBcIkN0cmxcIilcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwiYWx0XCIsIFwiQWx0XCIpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZUFsbChcInNoaWZ0XCIsIFwiU2hpZnRcIilcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwibWV0YVwiLCBcIldpblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdW4tbG9jYWxpemVkIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgS2V5TW9kaWZpZXIuXHJcbiAgICAgKi9cclxuICAgIHVuTG9jYWxpemVkKHJhdykge1xyXG4gICAgICAgIGlmIChab3Rlcm8uaXNNYWMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJhd1xyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCJcdTIzMDNcIiwgXCJjb250cm9sXCIpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZUFsbChcIlx1MjMyNVwiLCBcImFsdFwiKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCJcdTIxRTdcIiwgXCJzaGlmdFwiKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCJcdTIzMThcIiwgXCJtZXRhXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJhd1xyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCJDdHJsXCIsIFwiY29udHJvbFwiKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCJBbHRcIiwgXCJhbHRcIilcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwiU2hpZnRcIiwgXCJzaGlmdFwiKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCJXaW5cIiwgXCJtZXRhXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG1lcmdlQXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUsIGFsbG93T3ZlcndyaXRlKSB7XHJcbiAgICAgICAgaWYgKGFsbG93T3ZlcndyaXRlIHx8ICF0aGlzW2F0dHJpYnV0ZV0pIHtcclxuICAgICAgICAgICAgdGhpc1thdHRyaWJ1dGVdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuS2V5TW9kaWZpZXIgPSBLZXlNb2RpZmllcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9a2V5Ym9hcmQuanMubWFwIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuR3VpZGVIZWxwZXIgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi4vYmFzaWNcIik7XHJcbi8qKlxyXG4gKiBIZWxwZXIgZm9yIGNyZWF0aW5nIGEgZ3VpZGUuXHJcbiAqIERlc2lnbmVkIGZvciBjcmVhdGluZyBhIHN0ZXAtYnktc3RlcCBndWlkZSBmb3IgdXNlcnMuXHJcbiAqIEBhbHBoYVxyXG4gKi9cclxuY2xhc3MgR3VpZGVIZWxwZXIgZXh0ZW5kcyBiYXNpY18xLkJhc2ljVG9vbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3N0ZXBzID0gW107XHJcbiAgICB9XHJcbiAgICBhZGRTdGVwKHN0ZXApIHtcclxuICAgICAgICB0aGlzLl9zdGVwcy5wdXNoKHN0ZXApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU3RlcHMoc3RlcHMpIHtcclxuICAgICAgICB0aGlzLl9zdGVwcy5wdXNoKC4uLnN0ZXBzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFzeW5jIHNob3coZG9jKSB7XHJcbiAgICAgICAgaWYgKCEoZG9jID09PSBudWxsIHx8IGRvYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZG9jLm93bmVyR2xvYmFsKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEb2N1bWVudCBpcyByZXF1aXJlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGd1aWRlID0gbmV3IEd1aWRlKGRvYy5vd25lckdsb2JhbCk7XHJcbiAgICAgICAgYXdhaXQgZ3VpZGUuc2hvdyh0aGlzLl9zdGVwcyk7XHJcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGd1aWRlLl9wYW5lbC5hZGRFdmVudExpc3RlbmVyKFwiZ3VpZGUtZmluaXNoZWRcIiwgKCkgPT4gcmVzb2x2ZShndWlkZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGF3YWl0IHByb21pc2U7XHJcbiAgICAgICAgcmV0dXJuIGd1aWRlO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaGlnaGxpZ2h0KGRvYywgc3RlcCkge1xyXG4gICAgICAgIGlmICghKGRvYyA9PT0gbnVsbCB8fCBkb2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRvYy5vd25lckdsb2JhbCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRG9jdW1lbnQgaXMgcmVxdWlyZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBndWlkZSA9IG5ldyBHdWlkZShkb2Mub3duZXJHbG9iYWwpO1xyXG4gICAgICAgIGF3YWl0IGd1aWRlLnNob3coW3N0ZXBdKTtcclxuICAgICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgZ3VpZGUuX3BhbmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJndWlkZS1maW5pc2hlZFwiLCAoKSA9PiByZXNvbHZlKGd1aWRlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXdhaXQgcHJvbWlzZTtcclxuICAgICAgICByZXR1cm4gZ3VpZGU7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5HdWlkZUhlbHBlciA9IEd1aWRlSGVscGVyO1xyXG5jbGFzcyBHdWlkZSB7XHJcbiAgICBnZXQgY29udGVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93Lk1velhVTEVsZW1lbnQucGFyc2VYVUxUb0ZyYWdtZW50KGBcclxuICAgICAgPHBhbmVsIGlkPVwiJHt0aGlzLl9pZH1cIiBjbGFzcz1cImd1aWRlLXBhbmVsXCIgdHlwZT1cImFycm93XCIgYWxpZ249XCJ0b3BcIiBub2F1dG9oaWRlPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgPGh0bWw6ZGl2IGNsYXNzPVwiZ3VpZGUtcGFuZWwtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgIDxodG1sOmRpdiBjbGFzcz1cImd1aWRlLXBhbmVsLWhlYWRlclwiPjwvaHRtbDpkaXY+XHJcbiAgICAgICAgICAgICAgPGh0bWw6ZGl2IGNsYXNzPVwiZ3VpZGUtcGFuZWwtYm9keVwiPjwvaHRtbDpkaXY+XHJcbiAgICAgICAgICAgICAgPGh0bWw6ZGl2IGNsYXNzPVwiZ3VpZGUtcGFuZWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxodG1sOmRpdiBjbGFzcz1cImd1aWRlLXBhbmVsLXByb2dyZXNzXCI+PC9odG1sOmRpdj5cclxuICAgICAgICAgICAgICAgICAgPGh0bWw6ZGl2IGNsYXNzPVwiZ3VpZGUtcGFuZWwtYnV0dG9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInByZXYtYnV0dG9uXCIgY2xhc3M9XCJndWlkZS1wYW5lbC1idXR0b25cIiBoaWRkZW49XCJ0cnVlXCI+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwibmV4dC1idXR0b25cIiBjbGFzcz1cImd1aWRlLXBhbmVsLWJ1dHRvblwiIGhpZGRlbj1cInRydWVcIj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjbG9zZS1idXR0b25cIiBjbGFzcz1cImd1aWRlLXBhbmVsLWJ1dHRvblwiIGhpZGRlbj1cInRydWVcIj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPC9odG1sOmRpdj5cclxuICAgICAgICAgICAgICA8L2h0bWw6ZGl2PlxyXG4gICAgICAgICAgPC9odG1sOmRpdj5cclxuICAgICAgICAgIDxodG1sOnN0eWxlPlxyXG4gICAgICAgICAgICAgIC5ndWlkZS1wYW5lbCB7XHJcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1hdGVyaWFsLW1lbnUpO1xyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tZmlsbC1wcmltYXJ5KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgLmd1aWRlLXBhbmVsLWNvbnRlbnQge1xyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nOiAwO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAuZ3VpZGUtcGFuZWwtaGVhZGVyIHtcclxuICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxLjJlbTtcclxuICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIC5ndWlkZS1wYW5lbC1oZWFkZXI6ZW1wdHkge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgLmd1aWRlLXBhbmVsLWJvZHkge1xyXG4gICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIC5ndWlkZS1wYW5lbC1ib2R5OmVtcHR5IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIC5ndWlkZS1wYW5lbC1mb290ZXIge1xyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIC5ndWlkZS1wYW5lbC1wcm9ncmVzcyB7XHJcbiAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMC44ZW07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIC5ndWlkZS1wYW5lbC1idXR0b25zIHtcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgICAgICAgICAgICAgICAgZmxleC1ncm93OiAxO1xyXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIDwvaHRtbDpzdHlsZT5cclxuICAgICAgPC9wYW5lbD5cclxuICBgKTtcclxuICAgIH1cclxuICAgIGdldCBjdXJyZW50U3RlcCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N0ZXBzKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGVwc1t0aGlzLl9jdXJyZW50SW5kZXhdO1xyXG4gICAgfVxyXG4gICAgZ2V0IGN1cnJlbnRUYXJnZXQoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RlcCA9IHRoaXMuY3VycmVudFN0ZXA7XHJcbiAgICAgICAgaWYgKCEoc3RlcCA9PT0gbnVsbCB8fCBzdGVwID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzdGVwLmVsZW1lbnQpKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIGxldCBlbGVtO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc3RlcC5lbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgZWxlbSA9IHN0ZXAuZWxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc3RlcC5lbGVtZW50ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN0ZXAuZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKCFzdGVwLmVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsZW0gPSBzdGVwLmVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtO1xyXG4gICAgfVxyXG4gICAgZ2V0IGhhc05leHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0ZXBzICYmIHRoaXMuX2N1cnJlbnRJbmRleCA8IHRoaXMuX3N0ZXBzLmxlbmd0aCAtIDE7XHJcbiAgICB9XHJcbiAgICBnZXQgaGFzUHJldmlvdXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0ZXBzICYmIHRoaXMuX2N1cnJlbnRJbmRleCA+IDA7XHJcbiAgICB9XHJcbiAgICBnZXQgaG9va1Byb3BzKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jdXJyZW50U3RlcCxcclxuICAgICAgICAgICAgc3RhdGU6IHtcclxuICAgICAgICAgICAgICAgIHN0ZXA6IHRoaXMuX2N1cnJlbnRJbmRleCxcclxuICAgICAgICAgICAgICAgIHN0ZXBzOiB0aGlzLl9zdGVwcyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IHRoaXMsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGdldCBwYW5lbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFuZWw7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3Rvcih3aW4pIHtcclxuICAgICAgICB0aGlzLl9pZCA9IGBndWlkZS0ke1pvdGVyby5VdGlsaXRpZXMucmFuZG9tU3RyaW5nKCl9YDtcclxuICAgICAgICB0aGlzLl9jYWNoZWRNYXNrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2NlbnRlclBhbmVsID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3aW4gPSB0aGlzLl93aW5kb3c7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhbmVsLm1vdmVUbyh3aW4uc2NyZWVuWCArIHdpbi5pbm5lcldpZHRoIC8gMiAtIHRoaXMuX3BhbmVsLmNsaWVudFdpZHRoIC8gMiwgd2luLnNjcmVlblkgKyB3aW4uaW5uZXJIZWlnaHQgLyAyIC0gdGhpcy5fcGFuZWwuY2xpZW50SGVpZ2h0IC8gMik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl93aW5kb3cgPSB3aW47XHJcbiAgICAgICAgdGhpcy5fbm9DbG9zZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2Nsb3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2F1dG9OZXh0ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgIGNvbnN0IGRvYyA9IHdpbi5kb2N1bWVudDtcclxuICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuY29udGVudDtcclxuICAgICAgICBpZiAoY29udGVudCkge1xyXG4gICAgICAgICAgICBkb2MuZG9jdW1lbnRFbGVtZW50LmFwcGVuZChkb2MuaW1wb3J0Tm9kZShjb250ZW50LCB0cnVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BhbmVsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoYCMke3RoaXMuX2lkfWApO1xyXG4gICAgICAgIHRoaXMuX2hlYWRlciA9IHRoaXMuX3BhbmVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ3VpZGUtcGFuZWwtaGVhZGVyXCIpO1xyXG4gICAgICAgIHRoaXMuX2JvZHkgPSB0aGlzLl9wYW5lbC5xdWVyeVNlbGVjdG9yKFwiLmd1aWRlLXBhbmVsLWJvZHlcIik7XHJcbiAgICAgICAgdGhpcy5fZm9vdGVyID0gdGhpcy5fcGFuZWwucXVlcnlTZWxlY3RvcihcIi5ndWlkZS1wYW5lbC1mb290ZXJcIik7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSB0aGlzLl9wYW5lbC5xdWVyeVNlbGVjdG9yKFwiLmd1aWRlLXBhbmVsLXByb2dyZXNzXCIpO1xyXG4gICAgICAgIHRoaXMuX2Nsb3NlQnV0dG9uID0gdGhpcy5fcGFuZWwucXVlcnlTZWxlY3RvcihcIiNjbG9zZS1idXR0b25cIik7XHJcbiAgICAgICAgdGhpcy5fcHJldkJ1dHRvbiA9IHRoaXMuX3BhbmVsLnF1ZXJ5U2VsZWN0b3IoXCIjcHJldi1idXR0b25cIik7XHJcbiAgICAgICAgdGhpcy5fbmV4dEJ1dHRvbiA9IHRoaXMuX3BhbmVsLnF1ZXJ5U2VsZWN0b3IoXCIjbmV4dC1idXR0b25cIik7XHJcbiAgICAgICAgdGhpcy5fY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICBpZiAoKF9hID0gdGhpcy5jdXJyZW50U3RlcCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm9uQ2xvc2VDbGljaykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jdXJyZW50U3RlcC5vbkNsb3NlQ2xpY2sodGhpcy5ob29rUHJvcHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWJvcnQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9wcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgaWYgKChfYSA9IHRoaXMuY3VycmVudFN0ZXApID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vblByZXZDbGljaykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jdXJyZW50U3RlcC5vblByZXZDbGljayh0aGlzLmhvb2tQcm9wcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tb3ZlUHJldmlvdXMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9uZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgaWYgKChfYSA9IHRoaXMuY3VycmVudFN0ZXApID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vbk5leHRDbGljaykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jdXJyZW50U3RlcC5vbk5leHRDbGljayh0aGlzLmhvb2tQcm9wcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3BhbmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJwb3B1cHNob3duXCIsIHRoaXMuX2hhbmRsZVNob3duLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuX3BhbmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJwb3B1cGhpZGRlblwiLCB0aGlzLl9oYW5kbGVIaWRkZW4uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5fY2VudGVyUGFuZWwpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc2hvdyhzdGVwcykge1xyXG4gICAgICAgIGlmIChzdGVwcykge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGVwcyA9IHN0ZXBzO1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9jdXJyZW50SW5kZXg7XHJcbiAgICAgICAgdGhpcy5fbm9DbG9zZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2Nsb3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2F1dG9OZXh0ID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBzdGVwID0gdGhpcy5jdXJyZW50U3RlcDtcclxuICAgICAgICBpZiAoIXN0ZXApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgIGlmIChzdGVwLm9uQmVmb3JlUmVuZGVyKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHN0ZXAub25CZWZvcmVSZW5kZXIodGhpcy5ob29rUHJvcHMpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IHRoaXMuX2N1cnJlbnRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN0ZXAub25NYXNrKSB7XHJcbiAgICAgICAgICAgIHN0ZXAub25NYXNrKHsgbWFzazogKF9lKSA9PiB0aGlzLl9jcmVhdGVNYXNrKF9lKSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZU1hc2soZWxlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB4LCB5ID0gMDtcclxuICAgICAgICBsZXQgcG9zaXRpb24gPSBzdGVwLnBvc2l0aW9uIHx8IFwiYWZ0ZXJfc3RhcnRcIjtcclxuICAgICAgICBpZiAocG9zaXRpb24gPT09IFwiY2VudGVyXCIpIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBcIm92ZXJsYXBcIjtcclxuICAgICAgICAgICAgeCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcclxuICAgICAgICAgICAgeSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BhbmVsLm9wZW5Qb3B1cChlbGVtLCBzdGVwLnBvc2l0aW9uIHx8IFwiYWZ0ZXJfc3RhcnRcIiwgeCwgeSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIH1cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5fcGFuZWwuaGlkZVBvcHVwKCk7XHJcbiAgICB9XHJcbiAgICBhYm9ydCgpIHtcclxuICAgICAgICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMuX3N0ZXBzID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgbW92ZVRvKHN0ZXBJbmRleCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc3RlcHMpIHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN0ZXBJbmRleCA8IDApXHJcbiAgICAgICAgICAgIHN0ZXBJbmRleCA9IDA7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zdGVwc1tzdGVwSW5kZXhdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IHRoaXMuX3N0ZXBzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXV0b05leHQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9ub0Nsb3NlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICB0aGlzLl9ub0Nsb3NlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fYXV0b05leHQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IHN0ZXBJbmRleDtcclxuICAgICAgICB0aGlzLnNob3coKTtcclxuICAgIH1cclxuICAgIG1vdmVOZXh0KCkge1xyXG4gICAgICAgIHRoaXMubW92ZVRvKHRoaXMuX2N1cnJlbnRJbmRleCArIDEpO1xyXG4gICAgfVxyXG4gICAgbW92ZVByZXZpb3VzKCkge1xyXG4gICAgICAgIHRoaXMubW92ZVRvKHRoaXMuX2N1cnJlbnRJbmRleCAtIDEpO1xyXG4gICAgfVxyXG4gICAgX2hhbmRsZVNob3duKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc3RlcHMpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBzdGVwID0gdGhpcy5jdXJyZW50U3RlcDtcclxuICAgICAgICBpZiAoIXN0ZXApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9oZWFkZXIuaW5uZXJIVE1MID0gc3RlcC50aXRsZSB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2JvZHkuaW5uZXJIVE1MID0gc3RlcC5kZXNjcmlwdGlvbiB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMuX3BhbmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3VpZGUtcGFuZWwtYnV0dG9uXCIpLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgZWxlbS5oaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICBlbGVtLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHNob3dCdXR0b25zID0gc3RlcC5zaG93QnV0dG9ucztcclxuICAgICAgICBpZiAoIXNob3dCdXR0b25zKSB7XHJcbiAgICAgICAgICAgIHNob3dCdXR0b25zID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1ByZXZpb3VzKSB7XHJcbiAgICAgICAgICAgICAgICBzaG93QnV0dG9ucy5wdXNoKFwicHJldlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNOZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBzaG93QnV0dG9ucy5wdXNoKFwibmV4dFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNob3dCdXR0b25zLnB1c2goXCJjbG9zZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hvd0J1dHRvbnMgPT09IG51bGwgfHwgc2hvd0J1dHRvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNob3dCdXR0b25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBzaG93QnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhbmVsLnF1ZXJ5U2VsZWN0b3IoYCMke2J0bn0tYnV0dG9uYCkuaGlkZGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3RlcC5kaXNhYmxlQnV0dG9ucykge1xyXG4gICAgICAgICAgICBzdGVwLmRpc2FibGVCdXR0b25zLmZvckVhY2goKGJ0bikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFuZWwucXVlcnlTZWxlY3RvcihgIyR7YnRufS1idXR0b25gKS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3RlcC5zaG93UHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJvZ3Jlc3MuaGlkZGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyZXNzLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICAgIHN0ZXAucHJvZ3Jlc3NUZXh0IHx8IGAke3RoaXMuX2N1cnJlbnRJbmRleCArIDF9LyR7dGhpcy5fc3RlcHMubGVuZ3RofWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmVzcy5oaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jbG9zZUJ1dHRvbi5sYWJlbCA9IHN0ZXAuY2xvc2VCdG5UZXh0IHx8IFwiRG9uZVwiO1xyXG4gICAgICAgIHRoaXMuX25leHRCdXR0b24ubGFiZWwgPSBzdGVwLm5leHRCdG5UZXh0IHx8IFwiTmV4dFwiO1xyXG4gICAgICAgIHRoaXMuX3ByZXZCdXR0b24ubGFiZWwgPSBzdGVwLnByZXZCdG5UZXh0IHx8IFwiUHJldmlvdXNcIjtcclxuICAgICAgICBpZiAoc3RlcC5vblJlbmRlcikge1xyXG4gICAgICAgICAgICBzdGVwLm9uUmVuZGVyKHRoaXMuaG9va1Byb3BzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN0ZXAucG9zaXRpb24gPT09IFwiY2VudGVyXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2VudGVyUGFuZWwoKTtcclxuICAgICAgICAgICAgdGhpcy5fd2luZG93LnNldFRpbWVvdXQodGhpcy5fY2VudGVyUGFuZWwsIDEwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBfaGFuZGxlSGlkZGVuKCkge1xyXG4gICAgICAgIHRoaXMuX3JlbW92ZU1hc2soKTtcclxuICAgICAgICB0aGlzLl9oZWFkZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9ib2R5LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MudGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgIGlmICghdGhpcy5fc3RlcHMpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBzdGVwID0gdGhpcy5jdXJyZW50U3RlcDtcclxuICAgICAgICBpZiAoc3RlcCAmJiBzdGVwLm9uRXhpdCkge1xyXG4gICAgICAgICAgICBhd2FpdCBzdGVwLm9uRXhpdCh0aGlzLmhvb2tQcm9wcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5fbm9DbG9zZSAmJiAodGhpcy5fY2xvc2VkIHx8ICF0aGlzLmhhc05leHQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhbmVsLmRpc3BhdGNoRXZlbnQobmV3IHRoaXMuX3dpbmRvdy5DdXN0b21FdmVudChcImd1aWRlLWZpbmlzaGVkXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFuZWwucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuX2NlbnRlclBhbmVsKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fYXV0b05leHQpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9jcmVhdGVNYXNrKHRhcmdldEVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCBkb2MgPSAodGFyZ2V0RWxlbWVudCA9PT0gbnVsbCB8fCB0YXJnZXRFbGVtZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0YXJnZXRFbGVtZW50Lm93bmVyRG9jdW1lbnQpIHx8IHRoaXMuX3dpbmRvdy5kb2N1bWVudDtcclxuICAgICAgICBjb25zdCBOUyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcclxuICAgICAgICBjb25zdCBzdmcgPSBkb2MuY3JlYXRlRWxlbWVudE5TKE5TLCBcInN2Z1wiKTtcclxuICAgICAgICBzdmcuaWQgPSBcImd1aWRlLXBhbmVsLW1hc2tcIjtcclxuICAgICAgICBzdmcuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XHJcbiAgICAgICAgc3ZnLnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIHN2Zy5zdHlsZS5sZWZ0ID0gXCIwXCI7XHJcbiAgICAgICAgc3ZnLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgc3ZnLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIHN2Zy5zdHlsZS56SW5kZXggPSBcIjk5OTlcIjtcclxuICAgICAgICBjb25zdCBtYXNrID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhOUywgXCJtYXNrXCIpO1xyXG4gICAgICAgIG1hc2suaWQgPSBcIm1hc2tcIjtcclxuICAgICAgICBjb25zdCBmdWxsUmVjdCA9IGRvYy5jcmVhdGVFbGVtZW50TlMoTlMsIFwicmVjdFwiKTtcclxuICAgICAgICBmdWxsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFwiMFwiKTtcclxuICAgICAgICBmdWxsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFwiMFwiKTtcclxuICAgICAgICBmdWxsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBcIjEwMCVcIik7XHJcbiAgICAgICAgZnVsbFJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFwiMTAwJVwiKTtcclxuICAgICAgICBmdWxsUmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwid2hpdGVcIik7XHJcbiAgICAgICAgbWFzay5hcHBlbmRDaGlsZChmdWxsUmVjdCk7XHJcbiAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRhcmdldEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFJlY3QgPSBkb2MuY3JlYXRlRWxlbWVudE5TKE5TLCBcInJlY3RcIik7XHJcbiAgICAgICAgICAgIHRhcmdldFJlY3Quc2V0QXR0cmlidXRlKFwieFwiLCByZWN0LmxlZnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRhcmdldFJlY3Quc2V0QXR0cmlidXRlKFwieVwiLCByZWN0LnRvcC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGFyZ2V0UmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCByZWN0LndpZHRoLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0YXJnZXRSZWN0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCByZWN0LmhlaWdodC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGFyZ2V0UmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwiYmxhY2tcIik7XHJcbiAgICAgICAgICAgIG1hc2suYXBwZW5kQ2hpbGQodGFyZ2V0UmVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1hc2tlZFJlY3QgPSBkb2MuY3JlYXRlRWxlbWVudE5TKE5TLCBcInJlY3RcIik7XHJcbiAgICAgICAgbWFza2VkUmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFwiMFwiKTtcclxuICAgICAgICBtYXNrZWRSZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgXCIwXCIpO1xyXG4gICAgICAgIG1hc2tlZFJlY3Quc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xyXG4gICAgICAgIG1hc2tlZFJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFwiMTAwJVwiKTtcclxuICAgICAgICBtYXNrZWRSZWN0LnNldEF0dHJpYnV0ZShcIm1hc2tcIiwgXCJ1cmwoI21hc2spXCIpO1xyXG4gICAgICAgIG1hc2tlZFJlY3Quc2V0QXR0cmlidXRlKFwib3BhY2l0eVwiLCBcIjAuN1wiKTtcclxuICAgICAgICBzdmcuYXBwZW5kQ2hpbGQobWFzayk7XHJcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKG1hc2tlZFJlY3QpO1xyXG4gICAgICAgIHRoaXMuX2NhY2hlZE1hc2tzLnB1c2gobmV3IFdlYWtSZWYoc3ZnKSk7XHJcbiAgICAgICAgZG9jLmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChzdmcpO1xyXG4gICAgfVxyXG4gICAgX3JlbW92ZU1hc2soKSB7XHJcbiAgICAgICAgdGhpcy5fY2FjaGVkTWFza3MuZm9yRWFjaCgocmVmKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hc2sgPSByZWYuZGVyZWYoKTtcclxuICAgICAgICAgICAgaWYgKG1hc2spIHtcclxuICAgICAgICAgICAgICAgIG1hc2sucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9jYWNoZWRNYXNrcyA9IFtdO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWd1aWRlLmpzLm1hcCIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlpvdGVyb1Rvb2xraXQgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2ljXzEgPSByZXF1aXJlKFwiLi9iYXNpY1wiKTtcclxuY29uc3QgdWlfMSA9IHJlcXVpcmUoXCIuL3Rvb2xzL3VpXCIpO1xyXG5jb25zdCByZWFkZXJfMSA9IHJlcXVpcmUoXCIuL3Rvb2xzL3JlYWRlclwiKTtcclxuY29uc3QgZXh0cmFGaWVsZF8xID0gcmVxdWlyZShcIi4vdG9vbHMvZXh0cmFGaWVsZFwiKTtcclxuY29uc3QgaXRlbVRyZWVfMSA9IHJlcXVpcmUoXCIuL21hbmFnZXJzL2l0ZW1UcmVlXCIpO1xyXG5jb25zdCBwcm9tcHRfMSA9IHJlcXVpcmUoXCIuL21hbmFnZXJzL3Byb21wdFwiKTtcclxuY29uc3QgbGlicmFyeVRhYlBhbmVsXzEgPSByZXF1aXJlKFwiLi9tYW5hZ2Vycy9saWJyYXJ5VGFiUGFuZWxcIik7XHJcbmNvbnN0IHJlYWRlclRhYlBhbmVsXzEgPSByZXF1aXJlKFwiLi9tYW5hZ2Vycy9yZWFkZXJUYWJQYW5lbFwiKTtcclxuY29uc3QgbWVudV8xID0gcmVxdWlyZShcIi4vbWFuYWdlcnMvbWVudVwiKTtcclxuY29uc3QgcHJlZmVyZW5jZVBhbmVfMSA9IHJlcXVpcmUoXCIuL21hbmFnZXJzL3ByZWZlcmVuY2VQYW5lXCIpO1xyXG5jb25zdCBzaG9ydGN1dF8xID0gcmVxdWlyZShcIi4vbWFuYWdlcnMvc2hvcnRjdXRcIik7XHJcbmNvbnN0IGNsaXBib2FyZF8xID0gcmVxdWlyZShcIi4vaGVscGVycy9jbGlwYm9hcmRcIik7XHJcbmNvbnN0IGZpbGVQaWNrZXJfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvZmlsZVBpY2tlclwiKTtcclxuY29uc3QgcHJvZ3Jlc3NXaW5kb3dfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvcHJvZ3Jlc3NXaW5kb3dcIik7XHJcbmNvbnN0IHZpcnR1YWxpemVkVGFibGVfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvdmlydHVhbGl6ZWRUYWJsZVwiKTtcclxuY29uc3QgZGlhbG9nXzEgPSByZXF1aXJlKFwiLi9oZWxwZXJzL2RpYWxvZ1wiKTtcclxuY29uc3QgcmVhZGVySW5zdGFuY2VfMSA9IHJlcXVpcmUoXCIuL21hbmFnZXJzL3JlYWRlckluc3RhbmNlXCIpO1xyXG5jb25zdCBmaWVsZEhvb2tfMSA9IHJlcXVpcmUoXCIuL21hbmFnZXJzL2ZpZWxkSG9va1wiKTtcclxuY29uc3QgaXRlbUJveF8xID0gcmVxdWlyZShcIi4vbWFuYWdlcnMvaXRlbUJveFwiKTtcclxuY29uc3QgbGFyZ2VQcmVmXzEgPSByZXF1aXJlKFwiLi9oZWxwZXJzL2xhcmdlUHJlZlwiKTtcclxuY29uc3Qga2V5Ym9hcmRfMSA9IHJlcXVpcmUoXCIuL21hbmFnZXJzL2tleWJvYXJkXCIpO1xyXG5jb25zdCBwYXRjaF8xID0gcmVxdWlyZShcIi4vaGVscGVycy9wYXRjaFwiKTtcclxuY29uc3QgZ3VpZGVfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvZ3VpZGVcIik7XHJcbi8qKlxyXG4gKiBcdTJCNTBDb250YWlucyBhbGwgdG9vbHMgaW4gdGhpcyBsaWIuIFN0YXJ0IGZyb20gaGVyZSBpZiB5b3UgYXJlIG5ldyB0byB0aGlzIGxpYi5cclxuICogQHJlbWFya3NcclxuICogVG8gbWluaW1pemUgeW91ciBwbHVnaW4sIGltcG9ydCB0aGUgbW9kdWxlcyB5b3UgbmVlZCBtYW51YWxseS5cclxuICovXHJcbmNsYXNzIFpvdGVyb1Rvb2xraXQgZXh0ZW5kcyBiYXNpY18xLkJhc2ljVG9vbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuVUkgPSBuZXcgdWlfMS5VSVRvb2wodGhpcyk7XHJcbiAgICAgICAgdGhpcy5SZWFkZXIgPSBuZXcgcmVhZGVyXzEuUmVhZGVyVG9vbCh0aGlzKTtcclxuICAgICAgICB0aGlzLkV4dHJhRmllbGQgPSBuZXcgZXh0cmFGaWVsZF8xLkV4dHJhRmllbGRUb29sKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuRmllbGRIb29rcyA9IG5ldyBmaWVsZEhvb2tfMS5GaWVsZEhvb2tNYW5hZ2VyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuSXRlbVRyZWUgPSBuZXcgaXRlbVRyZWVfMS5JdGVtVHJlZU1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5JdGVtQm94ID0gbmV3IGl0ZW1Cb3hfMS5JdGVtQm94TWFuYWdlcih0aGlzKTtcclxuICAgICAgICB0aGlzLktleWJvYXJkID0gbmV3IGtleWJvYXJkXzEuS2V5Ym9hcmRNYW5hZ2VyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuUHJvbXB0ID0gbmV3IHByb21wdF8xLlByb21wdE1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5MaWJyYXJ5VGFiUGFuZWwgPSBuZXcgbGlicmFyeVRhYlBhbmVsXzEuTGlicmFyeVRhYlBhbmVsTWFuYWdlcih0aGlzKTtcclxuICAgICAgICB0aGlzLlJlYWRlclRhYlBhbmVsID0gbmV3IHJlYWRlclRhYlBhbmVsXzEuUmVhZGVyVGFiUGFuZWxNYW5hZ2VyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuUmVhZGVySW5zdGFuY2UgPSBuZXcgcmVhZGVySW5zdGFuY2VfMS5SZWFkZXJJbnN0YW5jZU1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5NZW51ID0gbmV3IG1lbnVfMS5NZW51TWFuYWdlcih0aGlzKTtcclxuICAgICAgICB0aGlzLlByZWZlcmVuY2VQYW5lID0gbmV3IHByZWZlcmVuY2VQYW5lXzEuUHJlZmVyZW5jZVBhbmVNYW5hZ2VyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuU2hvcnRjdXQgPSBuZXcgc2hvcnRjdXRfMS5TaG9ydGN1dE1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5DbGlwYm9hcmQgPSAoMCwgYmFzaWNfMS5tYWtlSGVscGVyVG9vbCkoY2xpcGJvYXJkXzEuQ2xpcGJvYXJkSGVscGVyLCB0aGlzKTtcclxuICAgICAgICB0aGlzLkZpbGVQaWNrZXIgPSAoMCwgYmFzaWNfMS5tYWtlSGVscGVyVG9vbCkoZmlsZVBpY2tlcl8xLkZpbGVQaWNrZXJIZWxwZXIsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuUGF0Y2ggPSAoMCwgYmFzaWNfMS5tYWtlSGVscGVyVG9vbCkocGF0Y2hfMS5QYXRjaEhlbHBlciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5Qcm9ncmVzc1dpbmRvdyA9ICgwLCBiYXNpY18xLm1ha2VIZWxwZXJUb29sKShwcm9ncmVzc1dpbmRvd18xLlByb2dyZXNzV2luZG93SGVscGVyLCB0aGlzKTtcclxuICAgICAgICB0aGlzLlZpcnR1YWxpemVkVGFibGUgPSAoMCwgYmFzaWNfMS5tYWtlSGVscGVyVG9vbCkodmlydHVhbGl6ZWRUYWJsZV8xLlZpcnR1YWxpemVkVGFibGVIZWxwZXIsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuRGlhbG9nID0gKDAsIGJhc2ljXzEubWFrZUhlbHBlclRvb2wpKGRpYWxvZ18xLkRpYWxvZ0hlbHBlciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5MYXJnZVByZWZPYmplY3QgPSAoMCwgYmFzaWNfMS5tYWtlSGVscGVyVG9vbCkobGFyZ2VQcmVmXzEuTGFyZ2VQcmVmSGVscGVyLCB0aGlzKTtcclxuICAgICAgICB0aGlzLkd1aWRlID0gKDAsIGJhc2ljXzEubWFrZUhlbHBlclRvb2wpKGd1aWRlXzEuR3VpZGVIZWxwZXIsIHRoaXMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGV2ZXJ5dGhpbmcgY3JlYXRlZCBieSBtYW5hZ2Vycy5cclxuICAgICAqL1xyXG4gICAgdW5yZWdpc3RlckFsbCgpIHtcclxuICAgICAgICAoMCwgYmFzaWNfMS51bnJlZ2lzdGVyKSh0aGlzKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlpvdGVyb1Rvb2xraXQgPSBab3Rlcm9Ub29sa2l0O1xyXG5leHBvcnRzLmRlZmF1bHQgPSBab3Rlcm9Ub29sa2l0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCAiaW1wb3J0IHsgWm90ZXJvVG9vbGtpdCwgdW5yZWdpc3RlciB9IGZyb20gXCJ6b3Rlcm8tcGx1Z2luLXRvb2xraXRcIjtcclxuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSBcIi4vZGF0YS9jb25maWdcIjtcclxuaW1wb3J0IHsgZ2V0U3RyaW5nIH0gZnJvbSBcIi4vbW9kdWxlcy9sb2NhbGVcIjtcclxuaW1wb3J0IGF1dG9UYWdnZXIgZnJvbSBcIi4vbW9kdWxlcy9hdXRvVGFnZ2VyXCI7XHJcblxyXG5jbGFzcyBBdXRvVGFnZ2VyUGx1Z2luIHtcclxuICBwcml2YXRlIGRhdGEgPSB7XHJcbiAgICBhbGl2ZTogdHJ1ZSxcclxuICAgIHRvb2xraXQ6IG5ldyBab3Rlcm9Ub29sa2l0KClcclxuICB9O1xyXG5cclxuICAvLyBUaGlzIGlzIGNhbGxlZCB3aGVuIHRoZSBwbHVnaW4gaXMgbG9hZGVkXHJcbiAgcHVibGljIGFzeW5jIG9uU3RhcnR1cCgpIHtcclxuICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVByZWZlcmVuY2VzKCk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyTWVudUl0ZW1zKCk7XHJcbiAgfVxyXG5cclxuICAvLyBUaGlzIGlzIGNhbGxlZCB3aGVuIHRoZSBwbHVnaW4gaXMgdW5sb2FkZWRcclxuICBwdWJsaWMgYXN5bmMgb25TaHV0ZG93bigpIHtcclxuICAgIHRoaXMuZGF0YS5hbGl2ZSA9IGZhbHNlO1xyXG4gICAgLy8gQ2xlYW4gdXAgYW55IHJlc291cmNlc1xyXG4gICAgYXdhaXQgdW5yZWdpc3RlcigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplUHJlZmVyZW5jZXMoKSB7XHJcbiAgICAvLyBJbml0aWFsaXplIGFueSBwcmVmZXJlbmNlcyBoZXJlXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZ2lzdGVyTWVudUl0ZW1zKCkge1xyXG4gICAgaWYgKFpvdGVyby5JdGVtVHJlZVZpZXcgJiYgWm90ZXJvLkl0ZW1UcmVlVmlldy5wcm90b3R5cGUpIHtcclxuICAgICAgY29uc3Qgb3JpZ2luYWxPblBvcHVwID0gWm90ZXJvLkl0ZW1UcmVlVmlldy5wcm90b3R5cGUub25Qb3B1cDtcclxuICAgICAgXHJcbiAgICAgIFpvdGVyby5JdGVtVHJlZVZpZXcucHJvdG90eXBlLm9uUG9wdXAgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsUmVzdWx0ID0gb3JpZ2luYWxPblBvcHVwLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIC8vIEFkZCBvdXIgbWVudSBpdGVtc1xyXG4gICAgICAgICAgY29uc3QgaXRlbXMgPSBab3Rlcm8uZ2V0QWN0aXZlWm90ZXJvUGFuZSgpLmdldFNlbGVjdGVkSXRlbXMoKTtcclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVhVTEVsZW1lbnQoXCJtZW51c2VwYXJhdG9yXCIpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGF1dG9UYWdNZW51SXRlbSA9IGRvY3VtZW50LmNyZWF0ZVhVTEVsZW1lbnQoXCJtZW51aXRlbVwiKTtcclxuICAgICAgICAgICAgYXV0b1RhZ01lbnVJdGVtLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGdldFN0cmluZyhcIm1lbnVpdGVtLWF1dG90YWctbGFiZWxcIikpO1xyXG4gICAgICAgICAgICBhdXRvVGFnTWVudUl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNvbW1hbmRcIiwgKCkgPT4gYXV0b1RhZ2dlci5hdXRvVGFnSXRlbXMoaXRlbXMpKTtcclxuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmFwcGVuZENoaWxkKGF1dG9UYWdNZW51SXRlbSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjcmVhdGVFbnRyeU1lbnVJdGVtID0gZG9jdW1lbnQuY3JlYXRlWFVMRWxlbWVudChcIm1lbnVpdGVtXCIpO1xyXG4gICAgICAgICAgICBjcmVhdGVFbnRyeU1lbnVJdGVtLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGdldFN0cmluZyhcIm1lbnVpdGVtLWNyZWF0ZWVudHJ5LWxhYmVsXCIpKTtcclxuICAgICAgICAgICAgY3JlYXRlRW50cnlNZW51SXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY29tbWFuZFwiLCAoKSA9PiBhdXRvVGFnZ2VyLmNyZWF0ZUVudHJ5RnJvbVBERihpdGVtcykpO1xyXG4gICAgICAgICAgICBldmVudC50YXJnZXQuYXBwZW5kQ2hpbGQoY3JlYXRlRW50cnlNZW51SXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgdGhpcy5kYXRhLnRvb2xraXQubG9nKFwiRXJyb3IgaW4gQXV0by1UYWdnZXIgbWVudSBwb3B1cDogXCIgKyBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsUmVzdWx0O1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEF1dG9UYWdnZXJQbHVnaW4oKTsgIiwgImltcG9ydCB7IGdldFN0cmluZyBhcyBnZXRTdHJpbmdCYXNlIH0gZnJvbSBcInpvdGVyby1wbHVnaW4tdG9vbGtpdFwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0cmluZyhrZXk6IHN0cmluZykge1xyXG4gIHJldHVybiBnZXRTdHJpbmdCYXNlKGtleSwgXCJ6b3Rlcm8tYXV0by10YWdnZXJcIik7XHJcbn0gIiwgImltcG9ydCB7IFpvdGVyb1Rvb2xraXQgfSBmcm9tIFwiem90ZXJvLXBsdWdpbi10b29sa2l0XCI7XHJcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gXCIuLi9kYXRhL2NvbmZpZ1wiO1xyXG5cclxuY2xhc3MgQXV0b1RhZ2dlciB7XHJcbiAgcHJpdmF0ZSB0b29sa2l0OiBab3Rlcm9Ub29sa2l0O1xyXG4gIHByaXZhdGUgY29uZmlnID0ge1xyXG4gICAgZ3B0QXBpRW5kcG9pbnQ6ICdodHRwczovL2FwaS5vcGVuYWkuY29tL3YxL2NoYXQvY29tcGxldGlvbnMnLFxyXG4gICAgZ3B0TW9kZWw6ICdncHQtNC10dXJiby1wcmV2aWV3JyxcclxuICAgIG1heFBhZ2VzVG9Qcm9jZXNzOiAxMFxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy50b29sa2l0ID0gbmV3IFpvdGVyb1Rvb2xraXQoKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGNyZWF0ZUVudHJ5RnJvbVBERihpdGVtczogWm90ZXJvLkl0ZW1bXSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zaG93RXJyb3IoJ1BsZWFzZSBzZWxlY3QgYXQgbGVhc3Qgb25lIFBERiBpdGVtLicpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJvZ3Jlc3NXaW5kb3cgPSB0aGlzLnRvb2xraXQuZ2V0UHJvZ3Jlc3NXaW5kb3coXCJQcm9jZXNzaW5nIFBERnNcIik7XHJcbiAgICBwcm9ncmVzc1dpbmRvdy5zaG93KCk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uaXNBdHRhY2htZW50KCkgJiYgaXRlbS5hdHRhY2htZW50Q29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9wZGYnKSB7XHJcbiAgICAgICAgICB0aGlzLnRvb2xraXQubG9nKGBQcm9jZXNzaW5nIFBERjogJHtpdGVtLmdldEZpZWxkKCd0aXRsZScpfWApO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGF3YWl0IGl0ZW0uZ2V0RmlsZVBhdGhBc3luYygpO1xyXG4gICAgICAgICAgaWYgKCFmaWxlUGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnRvb2xraXQubG9nKFwiQ291bGQgbm90IGdldCBmaWxlIHBhdGggZm9yIFBERlwiKTtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHBhcmVudCBpdGVtXHJcbiAgICAgICAgICBjb25zdCBuZXdJdGVtID0gbmV3IFpvdGVyby5JdGVtKCdqb3VybmFsQXJ0aWNsZScpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBFeHRyYWN0IG1ldGFkYXRhIHVzaW5nIFpvdGVybydzIGJ1aWx0LWluIGV4dHJhY3RvclxyXG4gICAgICAgICAgY29uc3QgdHJhbnNsYXRvciA9IG5ldyBab3Rlcm8uVHJhbnNsYXRlLkl0ZW1HZXR0ZXIoKTtcclxuICAgICAgICAgIHRyYW5zbGF0b3IuYXR0YWNobWVudEZpbGUgPSBmaWxlUGF0aDtcclxuICAgICAgICAgIGNvbnN0IHRyYW5zbGF0ZWRJdGVtcyA9IGF3YWl0IHRyYW5zbGF0b3IudHJhbnNsYXRlKCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmICh0cmFuc2xhdGVkSXRlbXM/Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModHJhbnNsYXRlZEl0ZW1zWzBdKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgICAgICAgICBpZiAoa2V5ICE9PSAnaXRlbVR5cGUnKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdJdGVtLnNldEZpZWxkKGtleSBhcyBrZXlvZiBab3Rlcm8uSXRlbS5JdGVtRmllbGQsIHZhbHVlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYXdhaXQgbmV3SXRlbS5zYXZlVHgoKTtcclxuICAgICAgICAgICAgaXRlbS5wYXJlbnRJRCA9IG5ld0l0ZW0uaWQ7XHJcbiAgICAgICAgICAgIGF3YWl0IGl0ZW0uc2F2ZVR4KCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnRvb2xraXQubG9nKFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWQgZW50cnkgZnJvbSBQREZcIik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRvb2xraXQubG9nKFwiTm8gbWV0YWRhdGEgZXh0cmFjdGVkIGZyb20gUERGXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5zaG93RXJyb3IoYEVycm9yIHByb2Nlc3NpbmcgUERGczogJHtlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcil9YCk7XHJcbiAgICAgIHRoaXMudG9vbGtpdC5sb2coYEVycm9yIGluIGNyZWF0ZUVudHJ5RnJvbVBERjogJHtlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3Iuc3RhY2sgOiBTdHJpbmcoZXJyb3IpfWApO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgYXdhaXQgWm90ZXJvLlByb21pc2UuZGVsYXkoMjAwMCk7XHJcbiAgICAgIHByb2dyZXNzV2luZG93LmNsb3NlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBhdXRvVGFnSXRlbXMoaXRlbXM6IFpvdGVyby5JdGVtW10pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2hvd0Vycm9yKCdQbGVhc2Ugc2VsZWN0IGF0IGxlYXN0IG9uZSBpdGVtIHRvIHRhZy4nKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByb2dyZXNzV2luZG93ID0gdGhpcy50b29sa2l0LmdldFByb2dyZXNzV2luZG93KFwiQXV0by10YWdnaW5nIGl0ZW1zXCIpO1xyXG4gICAgcHJvZ3Jlc3NXaW5kb3cuc2hvdygpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgIC8vIEltcGxlbWVudGF0aW9uIGZvciBhdXRvLXRhZ2dpbmdcclxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgaW1wbGVtZW50ZWQgYmFzZWQgb24geW91ciBzcGVjaWZpYyByZXF1aXJlbWVudHNcclxuICAgICAgICB0aGlzLnRvb2xraXQubG9nKGBBdXRvLXRhZ2dpbmcgaXRlbTogJHtpdGVtLmdldEZpZWxkKCd0aXRsZScpfWApO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLnNob3dFcnJvcihgRXJyb3IgYXV0by10YWdnaW5nIGl0ZW1zOiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKX1gKTtcclxuICAgICAgdGhpcy50b29sa2l0LmxvZyhgRXJyb3IgaW4gYXV0b1RhZ0l0ZW1zOiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5zdGFjayA6IFN0cmluZyhlcnJvcil9YCk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBhd2FpdCBab3Rlcm8uUHJvbWlzZS5kZWxheSgyMDAwKTtcclxuICAgICAgcHJvZ3Jlc3NXaW5kb3cuY2xvc2UoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2hvd0Vycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgcHJvZ3Jlc3NXaW5kb3cgPSB0aGlzLnRvb2xraXQuZ2V0UHJvZ3Jlc3NXaW5kb3coXCJFcnJvclwiKTtcclxuICAgIHByb2dyZXNzV2luZG93LmNyZWF0ZUxpbmUoe1xyXG4gICAgICB0ZXh0OiBtZXNzYWdlLFxyXG4gICAgICB0eXBlOiBcImVycm9yXCJcclxuICAgIH0pO1xyXG4gICAgcHJvZ3Jlc3NXaW5kb3cuc2hvdygpO1xyXG4gICAgcHJvZ3Jlc3NXaW5kb3cuc3RhcnRDbG9zZVRpbWVyKDgwMDApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEF1dG9UYWdnZXIoKTsgIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFDQSxVQUFJLGtCQUFtQixXQUFRLFFBQUssbUJBQW9CLFNBQVUsS0FBSztBQUNuRSxlQUFRLE9BQU8sSUFBSSxhQUFjLE1BQU0sRUFBRSxXQUFXLElB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LFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFDQSxVQUFNLHFCQUFxQjtBQUFBLFFBQ3ZCO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQ0EsVUFBTSxxQkFBcUI7QUFBQSxRQUN2QjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFD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QVUsRUFDM0IsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLE9BQU8sVUFBVSxDQUFDO0FBQ2xELGVBQUssVUFBVSxJQUFJLFVBQVU7QUFBQSxRQUNqQztBQUFBLFFBQ0EsV0FBVztBQUNQLGdCQUFNLFFBQVEsS0FBSyxHQUFHLGNBQWMsS0FBSyxVQUFVLFNBQVM7QUFBQSxZQUN4RCxXQUFXO0FBQUEsWUFDWCxJQUFJO0FBQUEsVUFDUixDQUFDO0FBQ0QsZ0JBQU0sWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDJCQW9EQyxLQUFLLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFrRmxDLGVB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UUFBQUEsa0JBQWlCLE1BQU0sSUFBSTtBQUMzQixRQUFBQSxrQkFBaUIsTUFBTSxJQUFJO0FBQzNCLFFBQUFBLGtCQUFpQixNQUFNLElBQUk7QUFDM0IsUUFBQUEsa0JBQWlCLE1BQU0sSUFBSTtBQUMzQixRQUFBQSxrQkFBaUIsTUFBTSxJQUFJO0FBQzNCLFFBQUFBLGtCQUFpQixNQUFNLElBQUk7QUFDM0IsUUFBQUEsa0JBQWlCLE1BQU0sSUFBSTtBQUMzQixRQUFBQSxrQkFBaUIsTUFBTSxJQUFJO0FBQzNCLFFBQUFBLGtCQUFpQixNQUFNLElBQUk7QUFDM0IsUUFBQUEsa0JBQWlCLE1BQU0sSUFBSTtBQUMzQixRQUFBQSxrQkFBaUIsTUFBTSxJQUFJO0FBQzNCLFFBQUFBLGtCQUFpQixNQUFNLElBQUk7QUFDM0IsUUFBQUEsa0JBQWlCLE1BQU0sSUFBSTtBQUMzQixRQUFBQSxrQkFBaUIsTUFBTSxJQUFJO0FBQzNCLFFBQUFBLGtCQUFpQixNQUFNLElBQUk7QUFDM0IsUUFBQUEsa0JBQWlCLE1BQU0sSUFBSTtBQUMzQixRQUFBQSxrQkFBaUIsTUFBTSxJQUFJO0FBQzNCLFFBQUFBLGtCQUFpQixNQUFNLElBQUk7QUFDM0IsUUFBQUEsa0JBQWlCLE1BQU0sSUFBSTtBQUMzQixRQUFBQSxrQkFBaUIsY0FBYyxJQUFJO0FBQ25DLFFBQUFBLGtCQUFpQixXQUFXLElBQUk7QUFDaEMsUUFBQUEsa0JBQWlCLFlBQVksSUFBSTtBQUNqQyxRQUFBQSxrQkFBaUIsWUFBWSxJQUFJO0FBQ2pDLFFBQUFBLGtCQUFpQixZQUFZLElBQUk7QUFDakMsUUFBQUEsa0JBQWlCLFlBQVksSUFBSTtBQUNqQyxRQUFBQSxrQkFBaUIsWUFBWSxJQUFJO0FBQ2pDLFFBQUFBLGtCQUFpQixZQUFZLElBQUk7QUFDakMsUUFBQUEsa0JBQWlCLFlBQVksSUFBSTtBQUNqQyxRQUFBQSxrQkFBaUIsWUFBWSxJQUFJO0FBQ2pDLFFBQUFBLGtCQUFpQixZQUFZLElBQUk7QUFDakMsUUFBQUEsa0JBQWlCLFlBQVksSUFBSTtBQUNqQyxRQUFBQSxrQkFBaUIsYUFBYSxJQUFJO0FBQ2xDLFFBQUFBLGtCQUFpQixRQUFRLElBQUk7QUFDN0IsUUFBQUEsa0JBQWlCLGNBQWMsSUFBSTtBQUNuQyxRQUFBQSxrQkFBaUIsYUFBYSxJQUFJO0FBQ2xDLFFBQUFBLGtCQUFpQixZQUFZLElBQUk7QUFDakMsUUFBQUEsa0JBQWlCLFdBQVcsSUFBSTtBQUNoQyxRQUFBQSxrQkFBaUIsT0FBTyxJQUFJO0FBQzVCLFFBQUFBLGtCQUFpQixPQUFPLElBQUk7QUFDNUIsUUFBQUEsa0JBQWlCLE9BQU8sSUFBSTtBQUM1QixRQUFBQSxrQkFBaUIsT0FBTyxJQUFJO0FBQzVCLFFBQUFBLGtCQUFpQixPQUFPLElBQUk7QUFDNUIsUUFBQUEsa0JBQWlCLE9BQU8sSUFBSTtBQUM1QixRQUFBQSxrQkFBaUIsT0FBTyxJQUFJO0FBQzVCLFFBQUFBLGtCQUFpQixPQUFPLElBQUk7QUFDNUIsUUFBQUEsa0JBQWlCLE9BQU8sSUFBSTtBQUM1QixRQUFBQSxrQkFBaUIsUUFBUSxJQUFJO0FBQzdCLFFBQUFBLGtCQUFpQixRQUFRLElBQUk7QUFDN0IsUUFBQUEsa0JBQWlCLFFBQVEsSUFBSTtBQUM3QixRQUFBQSxrQkFBaUIsUUFBUSxJQUFJO0FBQzdCLFFBQUFBLGtCQUFpQixRQUFRLElBQUk7QUFDN0IsUUFBQUEsa0JBQWlCLFFBQVEsSUFBSTtBQUM3QixRQUFBQSxrQkFBaUIsUUFBUSxJQUFJO0FBQzdCLFFBQUFBLGtCQUFpQixRQUFRLElBQUk7QUFDN0IsUUFBQUEsa0JBQWlCLFFBQVEsSUFBSTtBQUM3QixRQUFBQSxrQkFBaUIsUUFBUSxJQUFJO0FBQzdCLFFBQUFBLGtCQUFpQixRQUFRLElBQUk7QUFDN0IsUUFBQUEsa0JBQWlCLFFBQVEsSUFBSTtBQUM3QixRQUFBQSxrQkFBaUIsUUFBUSxJQUFJO0FBQzdCLFFBQUFBLGtCQUFpQixRQUFRLElBQUk7QUFDN0IsUUFBQUEsa0JBQWlCLFFBQVEsSUFBSTtBQUM3QixRQUFBQSxrQkFBaUIsYUFBYSxJQUFJO0FBQ2xDLFFBQUFBLGtCQUFpQixnQkFBZ0IsSUFBSTtBQUNyQyxRQUFBQSxrQkFBaUIsVUFBVSxJQUFJO0FBQy9CLFFBQUFBLGtCQUFpQixXQUFXLElBQUk7QUFDaEMsUUFBQUEsa0JBQWlCLFVBQVUsSUFBSTtBQUMvQixRQUFBQSxrQkFBaUIsZUFBZSxJQUFJO0FBQ3BDLFFBQUFBLGtCQUFpQixpQkFBaUIsSUFBSTtBQUN0QyxRQUFBQSxrQkFBaUIsa0JBQWtCLElBQUk7QUFDdkMsUUFBQUEsa0JBQWlCLFVBQVUsSUFBSTtBQUMvQixRQUFBQSxrQkFBaUIsU0FBUyxJQUFJO0FBQUEsTUFDbEMsR0FBRyxxQkFBcUIsbUJBQW1CLENBQUMsRUFBRTtBQUM5QyxlQUFTLHNCQUFzQixPQUFPO0FBQ2xDLGVBQU8sV0FBWTtBQUNmLGNBQUk7QUFDSixnQkFBTSxNQUFNLFFBQVEsVUFBVSxVQUFVLEVBQUUsY0FBYztBQUN4RCxnQkFBTSxVQUFVLElBQUksU0FBUyxjQUFjLElBQUksS0FBSyxFQUFFO0FBQ3RELGNBQUksQ0FBQyxTQUFTO0FBQ1YsbUJBQU8sV0FBWTtBQUFBLFlBQUU7QUFBQSxVQUN6QjtBQUNBLGdCQUFNLFFBQVEsSUFBSTtBQUNsQixnQkFBTSxRQUFRLGFBQWEsV0FBVyxLQUFLLElBQUk7QUFDL0MsZ0JBQU0sUUFBUSxRQUFRLGFBQWEsU0FBUztBQUM1QyxjQUFJLENBQUMsT0FBTztBQUNSO0FBQUEsVUFDSjtBQUNBLGtCQUFRLEtBQUssSUFBSSxTQUFTLGNBQWMsSUFBSSxLQUFLLEVBQUUsT0FBTyxRQUFRLE9BQU8sU0FBUyxTQUFTLEdBQUcsYUFBYSxXQUFXLE1BQU0sSUFBSTtBQUFBLFFBQ3BJO0FBQUEsTUFDSjtBQUNBLGVBQVMsMkJBQTJCLFNBQVM7QUFDekMsZUFBTyxXQUFZO0FBQ2YsZ0JBQU1GLFVBQVMsUUFBUSxVQUFVLFVBQVU7QUFDM0MsZ0JBQU0sYUFBYUEsUUFBTyxvQkFBb0I7QUFDOUMscUJBQVcsZUFBZTtBQUFBLFlBQ3RCLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxZQUNULFVBQVU7QUFBQSxZQUNWLGdCQUFnQixFQUFFLElBQUksR0FBRztBQUFBLFlBQ3pCLGdCQUFnQixNQUFNO0FBQUEsWUFBRTtBQUFBLFlBQ3hCLEtBQUtBLFFBQU8sTUFBTSxJQUFJLDBCQUEwQixPQUFPLElBQUksSUFBSTtBQUFBLFVBQ25FLENBQUM7QUFBQSxRQUNMO0FBQUEsTUFDSjtBQUNBLFVBQU0sa0JBQWtCLENBQUMsb0JBQW9CLHNCQUFzQjtBQUNuRSxVQUFNLFlBQVk7QUFBQSxRQUNkO0FBQUEsVUFDSSxJQUFJO0FBQUEsVUFDSixXQUFXO0FBQUEsVUFDWCxRQUFRO0FBQUEsVUFDUixVQUFVLHNCQUFzQixrQkFBa0I7QUFBQSxRQUN0RDtBQUFBLFFBQ0E7QUFBQSxVQUNJLElBQUk7QUFBQSxVQUNKLFdBQVc7QUFBQSxVQUNYLFFBQVE7QUFBQSxVQUNSLFVBQVUsc0JBQXNCLHNCQUFzQjtBQUFBLFFBQzFEO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsVUFBVSwyQkFBMkIsU0FBUztBQUFBLFFBQ2xEO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsVUFBVSwyQkFBMkIsU0FBUztBQUFBLFFBQ2xEO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsVUFBVSwyQkFBMkIsU0FBUztBQUFBLFFBQ2xEO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsVUFBVSwyQkFBMkIsYUFBYTtBQUFBLFFBQ3REO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsVUFBVSwyQkFBMkIsY0FBYztBQUFBLFFBQ3ZEO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsVUFBVSwyQkFBMkIsTUFBTTtBQUFBLFFBQy9DO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsVUFBVSwyQkFBMkIsZUFBZTtBQUFBLFFBQ3hEO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsVUFBVSwyQkFBMkIsWUFBWTtBQUFBLFFBQ3JEO0FBQUEsTUFDSjtBQUNBLFVBQU0sZUFBZTtBQUFBLFFBQ2pCO0FBQUEsVUFDSSxJQUFJO0FBQUEsVUFDSixXQUFXO0FBQUEsVUFDWCxLQUFLO0FBQUEsVUFDTCxVQUFVLE1BQU07QUFDWixrQkFBTUEsVUFBUyxRQUFRLFVBQVUsVUFBVTtBQUMzQyxrQkFBTSxhQUFhQSxRQUFPLG9CQUFvQjtBQUM5Qyx1QkFBVyxZQUFZO0FBQUEsY0FDbkIsZ0JBQWdCO0FBQUEsZ0JBQ1osSUFBSSxXQUFXLFlBQVksV0FBVyxVQUFVLEtBQUs7QUFBQSxjQUN6RDtBQUFBLGNBQ0EsU0FBU0EsUUFBTyxRQUFRLEtBQUs7QUFBQSxZQUNqQyxDQUFDO0FBQUEsVUFDTDtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsVUFDSSxJQUFJO0FBQUEsVUFDSixXQUFXO0FBQUEsVUFDWCxLQUFLO0FBQUEsVUFDTCxVQUFVLE1BQU07QUFDWixrQkFBTSxRQUFRLFFBQVEsVUFBVSxVQUFVLEVBQUUsY0FBYyxFQUNyRDtBQUNMLGdCQUFJLE1BQU0sZ0JBQWdCLEdBQUc7QUFDekIsb0JBQU0sTUFBTSxFQUFFO0FBQUEsWUFDbEI7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUNJLElBQUk7QUFBQSxVQUNKLFdBQVc7QUFBQSxVQUNYLEtBQUs7QUFBQSxVQUNMLFVBQVUsTUFBTTtBQUNaLGtCQUFNLFFBQVEsUUFBUSxVQUFVLFVBQVUsRUFBRSxjQUFjLEVBQ3JEO0FBQ0wsa0JBQU0sVUFBVTtBQUFBLFVBQ3BCO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUNJLElBQUk7QUFBQSxVQUNKLFdBQVc7QUFBQSxVQUNYLEtBQUs7QUFBQSxVQUNMLFVBQVUsTUFBTTtBQUNaLGtCQUFNLFFBQVEsUUFBUSxVQUFVLFVBQVUsRUFBRSxjQUFjLEVBQ3JEO0FBQ0wsa0JBQU0sV0FBVztBQUFBLFVBQ3JCO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUNJLElBQUk7QUFBQSxVQUNKLFdBQVc7QUFBQSxVQUNYLEtBQUs7QUFBQSxVQUNMLFVBQVUsTUFBTTtBQUNaLGtCQUFNLFFBQVEsUUFBUSxVQUFVLFVBQVUsRUFBRSxjQUFjLEVBQ3JEO0FBQ0wsa0JBQU0sV0FBVztBQUFBLFVBQ3JCO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUNJLElBQUk7QUFBQSxVQUNKLFdBQVc7QUFBQSxVQUNYLEtBQUs7QUFBQSxVQUNMLFVBQVUsTUFBTTtBQUNaLGtCQUFNLFFBQVEsUUFBUSxVQUFVLFVBQVUsRUFBRSxjQUFjLEVBQ3JEO0FBQ0wsa0JBQU0sS0FBSyxDQUFDO0FBQUEsVUFDaEI7QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsS0FBSztBQUFBLFVBQ0wsVUFBVSxNQUFNO0FBQ1osa0JBQU0sUUFBUSxRQUFRLFVBQVUsVUFBVSxFQUFFLGNBQWMsRUFDckQ7QUFDTCxrQkFBTSxLQUFLLENBQUM7QUFBQSxVQUNoQjtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsVUFDSSxJQUFJO0FBQUEsVUFDSixXQUFXO0FBQUEsVUFDWCxLQUFLO0FBQUEsVUFDTCxVQUFVLE1BQU07QUFDWixrQkFBTSxRQUFRLFFBQVEsVUFBVSxVQUFVLEVBQUUsY0FBYyxFQUNyRDtBQUNMLGtCQUFNLEtBQUssQ0FBQztBQUFBLFVBQ2hCO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUNJLElBQUk7QUFBQSxVQUNKLFdBQVc7QUFBQSxVQUNYLEtBQUs7QUFBQSxVQUNMLFVBQVUsTUFBTTtBQUNaLGtCQUFNLFFBQVEsUUFBUSxVQUFVLFVBQVUsRUFBRSxjQUFjLEVBQ3JEO0FBQ0wsa0JBQU0sS0FBSyxDQUFDO0FBQUEsVUFDaEI7QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsS0FBSztBQUFBLFVBQ0wsVUFBVSxNQUFNO0FBQ1osa0JBQU0sUUFBUSxRQUFRLFVBQVUsVUFBVSxFQUFFLGNBQWMsRUFDckQ7QUFDTCxrQkFBTSxLQUFLLENBQUM7QUFBQSxVQUNoQjtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsVUFDSSxJQUFJO0FBQUEsVUFDSixXQUFXO0FBQUEsVUFDWCxLQUFLO0FBQUEsVUFDTCxVQUFVLE1BQU07QUFDWixrQkFBTSxRQUFRLFFBQVEsVUFBVSxVQUFVLEVBQUUsY0FBYyxFQUNyRDtBQUNMLGtCQUFNLEtBQUssQ0FBQztBQUFBLFVBQ2hCO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUNJLElBQUk7QUFBQSxVQUNKLFdBQVc7QUFBQSxVQUNYLEtBQUs7QUFBQSxVQUNMLFVBQVUsTUFBTTtBQUNaLGtCQUFNLFFBQVEsUUFBUSxVQUFVLFVBQVUsRUFBRSxjQUFjLEVBQ3JEO0FBQ0wsa0JBQU0sS0FBSyxDQUFDO0FBQUEsVUFDaEI7QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFVBQ0ksSUFBSTtBQUFBLFVBQ0osV0FBVztBQUFBLFVBQ1gsS0FBSztBQUFBLFVBQ0wsVUFBVSxNQUFNO0FBQ1osa0JBQU0sUUFBUSxRQUFRLFVBQVUsVUFBVSxFQUFFLGNBQWMsRUFDckQ7QUFDTCxrQkFBTSxLQUFLLENBQUM7QUFBQSxVQUNoQjtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsVUFDSSxJQUFJO0FBQUEsVUFDSixXQUFXO0FBQUEsVUFDWCxLQUFLO0FBQUEsVUFDTCxVQUFVLE1BQU07QUFDWixrQkFBTSxRQUFRLFFBQVEsVUFBVSxVQUFVLEVBQUUsY0FBYyxFQUNyRDtBQUNMLGtCQUFNLFdBQVc7QUFBQSxVQUNyQjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUE7QUFBQTs7O0FDdnpCQTtBQUFBO0FBQUE7QUFDQSxhQUFPLGVBQWUsU0FBUyxjQUFjLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDNUQsY0FBUSxrQkFBa0I7QUFDMUIsVUFBTSxVQUFVO0FBeUJoQixVQUFNLGtCQUFOLGNBQThCLFFBQVEsVUFBVTtBQUFBLFFBQzVDLGNBQWM7QUFDVixnQkFBTTtBQUNOLGVBQUssV0FBVztBQUVoQixlQUFLLGVBQWUsV0FBVyxRQUFRLG9DQUFvQyxFQUFFLGVBQWUsV0FBVyxXQUFXLGVBQWU7QUFFakksZUFBSyxtQkFBbUIsV0FBVyxRQUFRLGlDQUFpQyxFQUFFLFdBQVcsV0FBVyxXQUFXLFlBQVk7QUFDM0gsZUFBSyxhQUFhLEtBQUssSUFBSTtBQUFBLFFBQy9CO0FBQUEsUUFDQSxRQUFRLFFBQVEsT0FBTyxjQUFjO0FBRWpDLGdCQUFNLE1BQU0sV0FBVyxRQUFRLGdDQUFnQyxFQUFFLGVBQWUsV0FBVyxXQUFXLGlCQUFpQjtBQUN2SCxjQUFJLE9BQU87QUFFWCxjQUFJLEtBQUssUUFBUSxLQUFLLFNBQVM7QUFDM0IsbUJBQU87QUFDWCxlQUFLLGFBQWEsY0FBYyxJQUFJO0FBQ3BDLGVBQUssYUFBYSxnQkFBZ0IsTUFBTSxLQUFLLE9BQU8sU0FBUyxDQUFDO0FBQzlELGlCQUFPO0FBQUEsUUFDWDtBQUFBLFFBQ0EsU0FBUyxRQUFRO0FBQ2IsY0FBSSxRQUFRLE9BQU8sTUFBTSxHQUFHO0FBQzVCLGNBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLFFBQVEsR0FBRztBQUM5QixtQkFBTztBQUFBLFVBQ1g7QUFDQSxjQUFJLE9BQU8sTUFBTSxDQUFDLEVBQUUsTUFBTSxTQUFTLEVBQUUsQ0FBQztBQUN0QyxjQUFJLE9BQU8sS0FBSyxVQUFVLFFBQVEsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQ2pELGNBQUksSUFBSSxLQUFLO0FBQ2IsY0FBSSxRQUFRLElBQUksV0FBVyxDQUFDO0FBQzVCLGlCQUFPLEtBQUs7QUFDUixrQkFBTSxDQUFDLElBQUksS0FBSyxXQUFXLENBQUM7QUFBQSxVQUNoQztBQUVBLGNBQUksV0FBVyxXQUFXLFFBQVEsNEJBQTRCLEVBQUUsV0FBVyxXQUFXLFdBQVcsU0FBUztBQUMxRyxjQUFJO0FBQ0osY0FBSTtBQUNKLGNBQUksS0FBSyxVQUFVLFFBQVEsRUFBRSx3QkFBd0IsS0FBSztBQUN0RCxrQkFBTSxTQUFTLDJCQUEyQixNQUFNLFFBQVEsSUFBSTtBQUM1RCx1QkFBVztBQUFBLFVBQ2YsT0FDSztBQUNELHVCQUFXO0FBRVgsa0JBQU0sV0FBVyxRQUFRLDJDQUEyQyxFQUFFLGVBQWUsV0FBVyxXQUFXLDJCQUEyQjtBQUN0SSxnQkFBSSxPQUFPLFNBQVMsMkJBQTJCLE1BQU0sUUFBUSxRQUFRO0FBQUEsVUFDekU7QUFDQSxlQUFLLGFBQWEsY0FBYyxRQUFRO0FBQ3hDLGVBQUssYUFBYSxnQkFBZ0IsVUFBVSxLQUFLLENBQUM7QUFDbEQsaUJBQU87QUFBQSxRQUNYO0FBQUEsUUFDQSxRQUFRLE1BQU07QUFFVixnQkFBTSxPQUFPLFdBQVcsUUFBUSwyQkFBMkIsRUFBRSxlQUFlLFdBQVcsV0FBVyxPQUFPO0FBQ3pHLGVBQUssYUFBYSxJQUFJO0FBQ3RCLGVBQUssYUFBYSxjQUFjLHdCQUF3QjtBQUN4RCxlQUFLLGFBQWEsZ0JBQWdCLDBCQUEwQixJQUFJO0FBQ2hFLGVBQUssV0FBVztBQUNoQixpQkFBTztBQUFBLFFBQ1g7QUFBQSxRQUNBLE9BQU87QUFDSCxjQUFJO0FBQ0EsaUJBQUssaUJBQWlCLFFBQVEsS0FBSyxjQUFjLE1BQU0sV0FBVyxXQUFXLGFBQWEsZ0JBQWdCO0FBQUEsVUFDOUcsU0FDTyxHQUFHO0FBRU4sZ0JBQUksS0FBSyxZQUFZLE9BQU8sT0FBTztBQUMvQixxQkFBTyxVQUFVLFNBQVMsS0FBSyxzQkFBc0I7QUFBQSxnQkFDakQ7QUFBQSxnQkFDQSxvQ0FBb0MsS0FBSyxRQUFRO0FBQUEsY0FDckQsQ0FBQztBQUFBLFlBQ0wsT0FDSztBQUNELG9CQUFNO0FBQUEsWUFDVjtBQUFBLFVBQ0o7QUFDQSxpQkFBTztBQUFBLFFBQ1g7QUFBQSxNQUNKO0FBQ0EsY0FBUSxrQkFBa0I7QUFBQTtBQUFBOzs7QUMzRzFCO0FBQUE7QUFBQTtBQUNBLGFBQU8sZUFBZSxTQUFTLGNBQWMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUM1RCxjQUFRLG1CQUFtQjtBQUMzQixVQUFNLFVBQVU7QUFtQmhCLFVBQU0sbUJBQU4sY0FBK0IsUUFBUSxVQUFVO0FBQUEsUUFDN0MsWUFBWSxPQUFPLE1BQU0sU0FBUyxZQUFZRyxTQUFRLFlBQVksV0FBVztBQUN6RSxnQkFBTTtBQUNOLGVBQUssUUFBUTtBQUNiLGVBQUssT0FBTztBQUNaLGVBQUssVUFBVTtBQUNmLGVBQUssYUFBYTtBQUNsQixlQUFLLFlBQVk7QUFDakIsZUFBSyxTQUFTQTtBQUNkLGVBQUssYUFBYTtBQUFBLFFBQ3RCO0FBQUEsUUFDQSxNQUFNLE9BQU87QUFDVCxjQUFJO0FBQ0osY0FBSSxLQUFLLFFBQVEsR0FBRztBQUNoQixzQkFBVSxZQUFZLGVBQWUsZ0RBQWdELEVBQUU7QUFBQSxVQUMzRixPQUNLO0FBQ0Qsc0JBQVUsS0FBSyxVQUFVLFNBQVMsRUFBRSwyQkFBMkIsRUFBRTtBQUFBLFVBQ3JFO0FBQ0EsZ0JBQU0sS0FBSyxJQUFJLFFBQVE7QUFDdkIsYUFBRyxLQUFLLEtBQUssVUFBVSxLQUFLLFVBQVUsUUFBUSxHQUFHLEtBQUssT0FBTyxLQUFLLFFBQVEsRUFBRSxDQUFDO0FBQzdFLHFCQUFXLENBQUMsT0FBTyxHQUFHLEtBQUssS0FBSyxXQUFXLENBQUMsR0FBRztBQUMzQyxlQUFHLGFBQWEsT0FBTyxHQUFHO0FBQUEsVUFDOUI7QUFDQSxjQUFJLEtBQUs7QUFDTCxlQUFHLGNBQWMsS0FBSyxjQUFjLEVBQUUsQ0FBQztBQUMzQyxjQUFJLEtBQUs7QUFDTCxlQUFHLGdCQUFnQixLQUFLO0FBQzVCLGNBQUksS0FBSztBQUNMLGVBQUcsbUJBQW1CLEtBQUs7QUFDL0IsZ0JBQU0sYUFBYSxNQUFNLEdBQUcsS0FBSztBQUNqQyxrQkFBUSxZQUFZO0FBQUEsWUFDaEIsS0FBSyxHQUFHO0FBQUEsWUFDUixLQUFLLEdBQUc7QUFDSixxQkFBTyxLQUFLLFNBQVMsYUFBYSxHQUFHLFFBQVEsR0FBRztBQUFBLFlBQ3BEO0FBQ0kscUJBQU87QUFBQSxVQUNmO0FBQUEsUUFDSjtBQUFBLFFBQ0EsUUFBUSxJQUFJO0FBQ1Isa0JBQVEsS0FBSyxNQUFNO0FBQUEsWUFDZixLQUFLO0FBQ0QscUJBQU8sR0FBRztBQUFBLFlBQ2QsS0FBSztBQUNELHFCQUFPLEdBQUc7QUFBQSxZQUNkLEtBQUs7QUFDRCxxQkFBTyxHQUFHO0FBQUEsWUFDZCxLQUFLO0FBQ0QscUJBQU8sR0FBRztBQUFBLFlBQ2Q7QUFDSSxxQkFBTztBQUFBLFVBQ2Y7QUFBQSxRQUNKO0FBQUEsUUFDQSxjQUFjLElBQUk7QUFDZCxrQkFBUSxLQUFLLFlBQVk7QUFBQSxZQUNyQixLQUFLO0FBQ0QscUJBQU8sR0FBRztBQUFBLFlBQ2QsS0FBSztBQUNELHFCQUFPLEdBQUc7QUFBQSxZQUNkLEtBQUs7QUFDRCxxQkFBTyxHQUFHO0FBQUEsWUFDZCxLQUFLO0FBQ0QscUJBQU8sR0FBRztBQUFBLFlBQ2QsS0FBSztBQUNELHFCQUFPLEdBQUc7QUFBQSxZQUNkLEtBQUs7QUFDRCxxQkFBTyxHQUFHO0FBQUEsWUFDZCxLQUFLO0FBQ0QscUJBQU8sR0FBRztBQUFBLFlBQ2QsS0FBSztBQUNELHFCQUFPLEdBQUc7QUFBQSxZQUNkLEtBQUs7QUFDRCxxQkFBTyxHQUFHO0FBQUEsWUFDZDtBQUNJLHFCQUFPO0FBQUEsVUFDZjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQ0EsY0FBUSxtQkFBbUI7QUFBQTtBQUFBOzs7QUNwRzNCO0FBQUE7QUFBQTtBQUNBLGFBQU8sZUFBZSxTQUFTLGNBQWMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUM1RCxjQUFRLHVCQUF1QjtBQUMvQixVQUFNLFVBQVU7QUErQmhCLFVBQU0sdUJBQU4sY0FBbUMsT0FBTyxlQUFlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBTXJELFlBQVksUUFBUSxVQUFVO0FBQUEsVUFDMUIsY0FBYztBQUFBLFVBQ2QsV0FBVztBQUFBLFFBQ2YsR0FBRztBQUNDLGdCQUFNLE9BQU87QUFDYixlQUFLLFFBQVEsQ0FBQztBQUNkLGVBQUssWUFBWSxRQUFRLGFBQWE7QUFDdEMsZUFBSyxlQUFlLE1BQU07QUFDMUIsZUFBSyxlQUFlLEtBQ2Y7QUFDTCxlQUFLLE9BQU8sS0FBSztBQUNqQixjQUFJLFFBQVEsMkJBQTJCO0FBQ25DLG9CQUFRLFVBQVUsVUFBVSxFQUFFLGtCQUFrQixTQUFTO0FBQUEsVUFDN0Q7QUFBQSxRQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUtBLFdBQVcsU0FBUztBQUNoQixnQkFBTSxPQUFPLEtBQUssUUFBUSxRQUFRLE1BQU0sUUFBUSxJQUFJO0FBQ3BELGdCQUFNLE9BQU8sSUFBSSxLQUFLLGFBQWEsUUFBUSxJQUFJLFFBQVEsUUFBUSxFQUFFO0FBQ2pFLGNBQUksT0FBTyxRQUFRLGFBQWEsVUFBVTtBQUN0QyxpQkFBSyxZQUFZLFFBQVEsUUFBUTtBQUFBLFVBQ3JDO0FBQ0EsZUFBSyxNQUFNLEtBQUssSUFBSTtBQUNwQixlQUFLLFlBQVk7QUFDakIsaUJBQU87QUFBQSxRQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUtBLFdBQVcsU0FBUztBQUNoQixjQUFJO0FBQ0osZ0JBQU0sS0FBSyxLQUFLLFdBQVcsUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHLFlBQVksR0FBRztBQUMxRSxtQkFBTztBQUFBLFVBQ1g7QUFDQSxnQkFBTSxNQUFNLE9BQU8sUUFBUSxRQUFRLGVBQy9CLFFBQVEsT0FBTyxLQUNmLFFBQVEsTUFBTSxLQUFLLE1BQU0sU0FDdkIsUUFBUSxNQUNSO0FBQ04sZ0JBQU0sT0FBTyxLQUFLLFFBQVEsUUFBUSxNQUFNLFFBQVEsSUFBSTtBQUNwRCxjQUFJLE1BQU07QUFFTixpQkFBSyxNQUFNLEdBQUcsRUFBRSxtQkFBbUIsSUFBSTtBQUFBLFVBQzNDO0FBQ0Esa0JBQVEsUUFBUSxLQUFLLE1BQU0sR0FBRyxFQUFFLFFBQVEsUUFBUSxJQUFJO0FBQ3BELGlCQUFPLFFBQVEsYUFBYSxZQUN4QixLQUFLLE1BQU0sR0FBRyxFQUFFLFlBQVksUUFBUSxRQUFRO0FBQ2hELGVBQUssWUFBWTtBQUNqQixpQkFBTztBQUFBLFFBQ1g7QUFBQSxRQUNBLGNBQWMsWUFBWSxRQUFXO0FBQ2pDLGVBQUssYUFBYTtBQUNsQixpQkFBTyxjQUFjLGdCQUFnQixLQUFLLFlBQVk7QUFDdEQsY0FBSSxLQUFLLGFBQWEsS0FBSyxZQUFZLEdBQUc7QUFDdEMsaUJBQUssZ0JBQWdCLEtBQUssU0FBUztBQUFBLFVBQ3ZDO0FBQ0EscUJBQVcsS0FBSyxZQUFZLEtBQUssSUFBSSxHQUFHLEVBQUU7QUFDMUMsaUJBQU87QUFBQSxRQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBTUEsT0FBTyxXQUFXLEtBQUssS0FBSztBQUN4QixnQkFBTSxHQUFHLElBQUk7QUFBQSxRQUNqQjtBQUFBLFFBQ0EsUUFBUSxNQUFNLGFBQWE7QUFDdkIsaUJBQU8sUUFBUSxRQUFRLFFBQVEsTUFBTSxJQUFJLElBQUk7QUFBQSxRQUNqRDtBQUFBLFFBQ0EsY0FBYztBQUNWLGNBQUk7QUFDQSxpQkFBSyxNQUFNLFFBQVEsQ0FBQyxTQUFTO0FBQ3pCLG9CQUFNLE1BQU0sS0FBSztBQUNqQixvQkFBTSxPQUFPLElBQUksUUFBUTtBQUN6QixrQkFBSSxRQUNBLEtBQUssV0FBVyxXQUFXLEtBQzNCLENBQUMsSUFBSSxNQUFNLGdCQUFnQixTQUFTLGVBQWUsR0FBRztBQUN0RCxvQkFBSSxNQUFNLGtCQUFrQixPQUFPLElBQUksUUFBUSxRQUFRO0FBQUEsY0FDM0Q7QUFBQSxZQUNKLENBQUM7QUFBQSxVQUNMLFNBQ08sR0FBRztBQUFBLFVBRVY7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUNBLGNBQVEsdUJBQXVCO0FBVy9CLFVBQU0sUUFBUTtBQUFBLFFBQ1YsU0FBUztBQUFBLFFBQ1QsTUFBTTtBQUFBLE1BQ1Y7QUFBQTtBQUFBOzs7QUNqSkE7QUFBQTtBQUFBO0FBQ0EsYUFBTyxlQUFlLFNBQVMsY0FBYyxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQzVELGNBQVEseUJBQXlCO0FBQ2pDLFVBQU0sVUFBVTtBQUloQixVQUFNLHlCQUFOLGNBQXFDLFFBQVEsVUFBVTtBQUFBLFFBQ25ELFlBQVksS0FBSztBQUNiLGdCQUFNO0FBQ04sZUFBSyxTQUFTO0FBQ2QsZ0JBQU1DLFVBQVMsS0FBSyxVQUFVLFFBQVE7QUFDdEMsZ0JBQU0sV0FBVyxJQUFJO0FBRXJCLGVBQUssUUFBUSxTQUFTLE9BQU87QUFDN0IsZUFBSyxXQUFXLFNBQVMsV0FBVztBQUNwQyxlQUFLLG1CQUFtQixTQUFTLDhCQUE4QjtBQUMvRCxlQUFLLGVBQWUsU0FBUyxZQUFZLEVBQUU7QUFDM0MsZUFBSyxRQUFRO0FBQUEsWUFDVCxJQUFJLEdBQUdBLFFBQU8sVUFBVSxhQUFhLENBQUMsS0FBSSxvQkFBSSxLQUFLLEdBQUUsUUFBUSxDQUFDO0FBQUEsWUFDOUQsYUFBYSxNQUFNO0FBQUEsVUFDdkI7QUFDQSxlQUFLLGdCQUFnQkEsUUFBTyxLQUFLO0FBQUEsUUFDckM7QUFBQSxRQUNBLFdBQVcsTUFBTTtBQUNiLGNBQUksS0FBSyxXQUFXLEdBQUc7QUFDbkIsbUJBQU8sT0FBTyxLQUFLLE9BQU8sS0FBSyxDQUFDLENBQUM7QUFBQSxVQUNyQyxXQUNTLEtBQUssV0FBVyxHQUFHO0FBQ3hCLGlCQUFLLE1BQU0sS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUM7QUFBQSxVQUNoQztBQUNBLGlCQUFPO0FBQUEsUUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLQSxVQUFVLGVBQWU7QUFDckIsaUJBQU8sT0FBTyxLQUFLLGVBQWUsYUFBYTtBQUMvQyxpQkFBTztBQUFBLFFBQ1g7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBS0EsZUFBZSxJQUFJO0FBQ2YsZUFBSyxjQUFjO0FBQ25CLGlCQUFPO0FBQUEsUUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBT0EsT0FBTyxVQUFVLGFBQWEsWUFBWTtBQUN0QyxnQkFBTSxtQkFBbUIsTUFBTTtBQUMzQixpQkFBSyxhQUFhLFdBQVc7QUFDN0IsZ0JBQUksT0FBTyxhQUFhLGVBQWUsWUFBWSxHQUFHO0FBQ2xELG1CQUFLLGFBQWEsVUFBVSxPQUFPLFFBQVE7QUFBQSxZQUMvQyxPQUNLO0FBQ0QsbUJBQUssYUFBYSxVQUFVLGVBQWU7QUFBQSxZQUMvQztBQUFBLFVBQ0o7QUFDQSxjQUFJLENBQUMsS0FBSyxjQUFjO0FBQ3BCLGtCQUFNLGNBQWMsT0FBTyxPQUFPLENBQUMsR0FBRyxLQUFLLE9BQU87QUFBQSxjQUM5QyxLQUFLLENBQUMsUUFBUyxLQUFLLGVBQWU7QUFBQSxZQUN2QyxDQUFDO0FBQ0QsZ0JBQUksWUFBWSxjQUFjLENBQUMsWUFBWSxZQUFZO0FBQ25ELHFCQUFPLE9BQU8sYUFBYTtBQUFBLGdCQUN2QixZQUFZLEtBQUssaUJBQWlCLGdCQUFnQixZQUFZLFVBQVU7QUFBQSxjQUM1RSxDQUFDO0FBQUEsWUFDTDtBQUNBLGtCQUFNLE9BQU8sS0FBSyxNQUFNLGNBQWMsS0FBSyxjQUFjLEVBQUUsUUFBUSxPQUFPLFFBQVEsVUFBVSxPQUFPLEtBQUssUUFBUSxHQUFHLEtBQUssTUFBTSxjQUFjLEtBQUssa0JBQWtCLFdBQVcsQ0FBQztBQUMvSyxrQkFBTSxZQUFZLEtBQUssT0FBTyxTQUFTLGVBQWUsS0FBSyxXQUFXO0FBQ3RFLGdCQUFJLFFBQVEsQ0FBQyxZQUFZLEtBQUssU0FBUyxPQUFPLE1BQU0sV0FBVyxPQUFPLENBQUMsRUFDbEUsS0FBSyxNQUFNO0FBRVosbUJBQUssVUFBVSxZQUFZLEVBQUUsTUFBTTtBQUMvQixpQ0FBaUI7QUFBQSxjQUNyQixDQUFDO0FBQUEsWUFDTCxDQUFDLEVBQ0ksS0FBSyxhQUFhLFVBQVU7QUFBQSxVQUNyQyxPQUNLO0FBQ0QsNkJBQWlCO0FBQUEsVUFDckI7QUFDQSxpQkFBTztBQUFBLFFBQ1g7QUFBQSxNQUNKO0FBQ0EsY0FBUSx5QkFBeUI7QUFBQTtBQUFBOzs7QUMzRmpDO0FBQUE7QUFBQTtBQUNBLGFBQU8sZUFBZSxTQUFTLGNBQWMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUM1RCxjQUFRLGVBQWU7QUFDdkIsVUFBTSxPQUFPO0FBSWIsVUFBTSxlQUFOLGNBQTJCLEtBQUssT0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1uQyxZQUFZLEtBQUssUUFBUTtBQUNyQixnQkFBTTtBQUNOLGNBQUksT0FBTyxLQUFLLFVBQVUsR0FBRztBQUN6QixrQkFBTSxNQUFNLDJDQUEyQztBQUFBLFVBQzNEO0FBQ0EsZUFBSyxlQUFlO0FBQUEsWUFDaEIsS0FBSztBQUFBLFlBQ0wsWUFBWSxFQUFFLE1BQU0sRUFBRTtBQUFBLFlBQ3RCLFFBQVE7QUFBQSxjQUNKLE9BQU87QUFBQSxjQUNQLFFBQVE7QUFBQSxZQUNaO0FBQUEsWUFDQSxVQUFVLENBQUM7QUFBQSxVQUNmO0FBQ0EsbUJBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUs7QUFDdkMsaUJBQUssYUFBYSxTQUFTLEtBQUs7QUFBQSxjQUM1QixLQUFLO0FBQUEsY0FDTCxZQUFZLEVBQUUsTUFBTSxFQUFFO0FBQUEsY0FDdEIsVUFBVSxDQUFDO0FBQUEsWUFDZixDQUFDO0FBQ0QscUJBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEtBQUs7QUFDMUMsbUJBQUssYUFBYSxTQUFTLENBQUMsRUFBRSxTQUFTLEtBQUs7QUFBQSxnQkFDeEMsS0FBSztBQUFBLGdCQUNMLFlBQVksRUFBRSxNQUFNLEVBQUU7QUFBQSxnQkFDdEIsVUFBVSxDQUFDO0FBQUEsY0FDZixDQUFDO0FBQUEsWUFDTDtBQUFBLFVBQ0o7QUFDQSxlQUFLLGFBQWEsU0FBUyxLQUFLO0FBQUEsWUFDNUIsS0FBSztBQUFBLFlBQ0wsWUFBWSxFQUFFLE1BQU0sR0FBRyxNQUFNLE1BQU07QUFBQSxZQUNuQyxVQUFVLENBQUM7QUFBQSxVQUNmLENBQUM7QUFDRCxlQUFLLGFBQWEsQ0FBQztBQUFBLFFBQ3ZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQVFBLFFBQVEsS0FBSyxRQUFRLGNBQWMsV0FBVyxNQUFNO0FBQ2hELGNBQUksT0FBTyxLQUFLLGFBQWEsU0FBUyxVQUNsQyxVQUFVLEtBQUssYUFBYSxTQUFTLEdBQUcsRUFBRSxTQUFTLFFBQVE7QUFDM0Qsa0JBQU0sTUFBTSxlQUFlLEdBQUcsS0FBSyxNQUFNLDBCQUEwQixLQUFLLGFBQWEsU0FBUyxNQUFNLEtBQUssS0FBSyxhQUFhLFNBQVMsQ0FBQyxFQUFFLFNBQVMsTUFBTSxHQUFHO0FBQUEsVUFDN0o7QUFDQSxlQUFLLGFBQWEsU0FBUyxHQUFHLEVBQUUsU0FBUyxNQUFNLEVBQUUsV0FBVztBQUFBLFlBQ3hEO0FBQUEsVUFDSjtBQUNBLGVBQUssYUFBYSxTQUFTLEdBQUcsRUFBRSxTQUFTLE1BQU0sRUFBRSxXQUFXLE9BQ3hELFdBQVcsSUFBSTtBQUNuQixpQkFBTztBQUFBLFFBQ1g7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFTQSxVQUFVLE9BQU8sSUFBSSxVQUFVLENBQUMsR0FBRztBQUMvQixlQUFLLE1BQU0sR0FBRyxPQUFPLFVBQVUsYUFBYSxDQUFDLEtBQUksb0JBQUksS0FBSyxHQUFFLFFBQVEsQ0FBQztBQUNyRSxlQUFLLGFBQWEsU0FBUyxLQUFLLGFBQWEsU0FBUyxTQUFTLENBQUMsRUFBRSxTQUFTLEtBQUs7QUFBQSxZQUM1RSxLQUFLO0FBQUEsWUFDTCxRQUFRO0FBQUEsY0FDSixRQUFRO0FBQUEsWUFDWjtBQUFBLFlBQ0EsVUFBVTtBQUFBLGNBQ047QUFBQSxnQkFDSSxLQUFLO0FBQUEsZ0JBQ0wsV0FBVztBQUFBLGdCQUNYO0FBQUEsZ0JBQ0EsWUFBWTtBQUFBLGtCQUNSLE1BQU07QUFBQSxrQkFDTixnQkFBZ0I7QUFBQSxnQkFDcEI7QUFBQSxnQkFDQSxZQUFZO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGdCQUNmO0FBQUEsZ0JBQ0EsV0FBVztBQUFBLGtCQUNQO0FBQUEsb0JBQ0ksTUFBTTtBQUFBLG9CQUNOLFVBQVUsQ0FBQyxNQUFNO0FBQ2IsMkJBQUssV0FBVyxnQkFBZ0I7QUFDaEMsMEJBQUksUUFBUSxVQUFVO0FBQ2xCLGdDQUFRLFNBQVMsQ0FBQztBQUFBLHNCQUN0QjtBQUNBLDBCQUFJLENBQUMsUUFBUSxTQUFTO0FBQ2xCLDZCQUFLLE9BQU8sTUFBTTtBQUFBLHNCQUN0QjtBQUFBLG9CQUNKO0FBQUEsa0JBQ0o7QUFBQSxnQkFDSjtBQUFBLGNBQ0o7QUFBQSxZQUNKO0FBQUEsVUFDSixDQUFDO0FBQ0QsaUJBQU87QUFBQSxRQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBcUJBLGNBQWMsWUFBWTtBQUN0QixlQUFLLGFBQWE7QUFDbEIsaUJBQU87QUFBQSxRQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQWNBLEtBQUssT0FBTyxpQkFBaUI7QUFBQSxVQUN6QixjQUFjO0FBQUEsVUFDZCxXQUFXO0FBQUEsVUFDWCxZQUFZO0FBQUEsUUFDaEIsR0FBRztBQUNDLGVBQUssU0FBUyxXQUFXLE1BQU0sR0FBRyxPQUFPLFVBQVUsYUFBYSxDQUFDLEtBQUksb0JBQUksS0FBSyxHQUFFLFFBQVEsQ0FBQyxJQUFJLE9BQU8sS0FBSyxjQUFjLEtBQUssWUFBWSxjQUFjO0FBQ3RKLGlCQUFPO0FBQUEsUUFDWDtBQUFBLE1BQ0o7QUFDQSxjQUFRLGVBQWU7QUFDdkIsZUFBUyxXQUFXLGNBQWMsVUFBVSxPQUFPLGNBQWMsWUFBWSxpQkFBaUI7QUFBQSxRQUMxRixjQUFjO0FBQUEsUUFDZCxXQUFXO0FBQUEsUUFDWCxZQUFZO0FBQUEsTUFDaEIsR0FBRztBQUNDLFlBQUksSUFBSSxJQUFJO0FBQ1osY0FBTUMsVUFBUyxhQUFhLFVBQVUsUUFBUTtBQUM5QyxxQkFBYSxjQUFjLENBQUM7QUFFNUIsWUFBSSxDQUFDLFdBQVcsVUFBVTtBQUN0QixxQkFBVyxXQUFXQSxRQUFPLFFBQVEsTUFBTTtBQUFBLFFBQy9DO0FBQ0EsWUFBSSxDQUFDLFdBQVcsWUFBWTtBQUN4QixxQkFBVyxhQUFhQSxRQUFPLFFBQVEsTUFBTTtBQUFBLFFBQ2pEO0FBQ0EsWUFBSSxnQkFBZ0IsYUFBYSxlQUFlLFlBQVksUUFBUSxJQUFJO0FBQ3hFLFlBQUksZUFBZSxTQUFTLGVBQWUsUUFBUTtBQUMvQywyQkFBaUIsU0FBUyxlQUFlLFNBQVMsR0FBRyxXQUFXLGVBQWUsVUFBVSxHQUFHO0FBQUEsUUFDaEc7QUFDQSxZQUFJLGVBQWUsTUFBTTtBQUNyQiwyQkFBaUIsUUFBUSxlQUFlLElBQUk7QUFBQSxRQUNoRDtBQUNBLFlBQUksZUFBZSxLQUFLO0FBQ3BCLDJCQUFpQixPQUFPLGVBQWUsR0FBRztBQUFBLFFBQzlDO0FBQ0EsWUFBSSxlQUFlLGNBQWM7QUFDN0IsMkJBQWlCO0FBQUEsUUFDckI7QUFDQSxZQUFJLGVBQWUsY0FBYztBQUM3QiwyQkFBaUI7QUFBQSxRQUNyQjtBQUNBLFlBQUksZUFBZSxjQUFjO0FBQzdCLDJCQUFpQjtBQUFBLFFBQ3JCO0FBRUEsY0FBTSxNQUFNLGFBQWEsVUFBVSxZQUFZLEVBQUUsZUFBZSxZQUFZLFVBQVUsZUFBZSxVQUFVO0FBRS9HLFNBQUMsS0FBSyxXQUFXLGNBQWMsUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHLFFBQVEsS0FBSyxNQUFNO0FBRWxGLGNBQUksU0FBUyxLQUFLLFlBQVksYUFBYSxjQUFjLElBQUksVUFBVSxTQUFTO0FBQUEsWUFDNUUsWUFBWSxFQUFFLFdBQVcsTUFBTTtBQUFBLFlBQy9CLFlBQVksRUFBRSxnQkFBZ0IsTUFBTTtBQUFBLFVBQ3hDLENBQUMsQ0FBQztBQUNGLGNBQUksWUFBWSxXQUFXLGFBQWEsQ0FBQztBQUN6QyxjQUFJLE9BQU8sY0FBYyxVQUFVO0FBQy9CLHdCQUFZLENBQUMsU0FBUztBQUFBLFVBQzFCO0FBQ0Esb0JBQVUsUUFBUSxDQUFDLFNBQVM7QUFDeEIsZ0JBQUksU0FBUyxLQUFLLFlBQVksYUFBYSxjQUFjLElBQUksVUFBVSxRQUFRO0FBQUEsY0FDM0UsWUFBWTtBQUFBLGdCQUNSLEtBQUs7QUFBQSxnQkFDTCxNQUFNO0FBQUEsY0FDVjtBQUFBLFlBQ0osQ0FBQyxDQUFDO0FBQUEsVUFDTixDQUFDO0FBR0QsdUJBQWEsY0FBYztBQUFBLFlBQ3ZCLEtBQUs7QUFBQSxZQUNMLFVBQVU7QUFBQSxjQUNOO0FBQUEsZ0JBQ0ksS0FBSztBQUFBLGdCQUNMLFlBQVk7QUFBQSxrQkFDUixXQUFXO0FBQUEsZ0JBQ2Y7QUFBQSxjQUNKO0FBQUEsY0FDQTtBQUFBLGdCQUNJLEtBQUs7QUFBQSxnQkFDTCxZQUFZO0FBQUEsa0JBQ1IsS0FBSztBQUFBLGtCQUNMLE1BQU07QUFBQSxnQkFDVjtBQUFBLGNBQ0o7QUFBQSxZQUNKO0FBQUEsVUFDSixHQUFHLElBQUksU0FBUyxJQUFJO0FBQ3BCLHlCQUFlLGNBQWMsWUFBWTtBQUV6QyxjQUFJLFNBQVMsS0FBSyxZQUFZLGFBQWEsY0FBYyxJQUFJLFVBQVUsWUFBWTtBQUFBLFlBQy9FLFVBQVUsQ0FBQyxZQUFZO0FBQUEsVUFDM0IsQ0FBQyxDQUFDO0FBRUYsZ0JBQU0sS0FBSyxJQUFJLFNBQVMsaUJBQWlCLGNBQWMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxTQUFTO0FBQ3hFLGtCQUFNLFVBQVUsS0FBSyxhQUFhLFdBQVc7QUFDN0Msa0JBQU0sV0FBVyxLQUFLLGFBQWEsV0FBVztBQUM5QyxrQkFBTSxXQUFXLEtBQUssYUFBYSxXQUFXO0FBQzlDLGdCQUFJLFdBQVcsY0FBYyxXQUFXLE9BQU8sR0FBRztBQUM5QyxrQkFBSSxVQUFVO0FBQ1YscUJBQUssUUFBUSxJQUFJLFdBQVcsT0FBTztBQUFBLGNBQ3ZDLE9BQ0s7QUFDRCxxQkFBSyxhQUFhLFlBQVksU0FBUyxXQUFXLE9BQU8sQ0FBQztBQUFBLGNBQzlEO0FBQUEsWUFDSjtBQUFBLFVBQ0osQ0FBQztBQUVELGNBQUksZUFBZSxZQUFZO0FBQzNCLHVCQUFXLE1BQU07QUFDYixrQkFBSSxjQUFjO0FBQUEsWUFDdEIsR0FBRyxHQUFHO0FBQUEsVUFDVjtBQUNBLGNBQUksTUFBTTtBQUFBLFFBQ2QsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUVWLFdBQUMsZUFBZSxRQUFRLGVBQWUsU0FBUyxTQUFTLFdBQVcsaUJBQWlCLFdBQVcsYUFBYTtBQUFBLFFBQ2pILENBQUM7QUFDRCxtQkFBVyxXQUFXLFFBQVEsS0FBSyxNQUFNO0FBRXJDLFdBQUMsZUFBZSxRQUFRLGVBQWUsU0FBUyxTQUFTLFdBQVcsbUJBQW1CLFdBQVcsZUFBZTtBQUFBLFFBQ3JILENBQUM7QUFFRCxZQUFJLGlCQUFpQixvQkFBb0IsU0FBUyxhQUFhLElBQUk7QUFDL0QsY0FBSUMsS0FBSUM7QUFDUixXQUFDQSxPQUFNRCxNQUFLLElBQUksVUFBVSxDQUFDLE9BQU8sUUFBUUEsUUFBTyxTQUFTLFNBQVNBLElBQUcsY0FBYyxRQUFRQyxRQUFPLFNBQVMsU0FBU0EsSUFBRyxRQUFRO0FBQ2hJLGNBQUksb0JBQW9CLG9CQUFvQixjQUFjLEtBQUs7QUFBQSxRQUNuRSxHQUFHLEtBQUs7QUFFUixZQUFJLGlCQUFpQixnQkFBZ0IsU0FBUyxxQkFBcUIsSUFBSTtBQUVuRSxnQkFBTSxLQUFLLElBQUksU0FBUyxpQkFBaUIsY0FBYyxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVM7QUFDeEUsa0JBQU1DLGNBQWEsS0FBSyxPQUFPLFVBQVUsQ0FBQztBQUMxQyxrQkFBTSxVQUFVLEtBQUssYUFBYSxXQUFXO0FBQzdDLGtCQUFNLFdBQVcsS0FBSyxhQUFhLFdBQVc7QUFDOUMsa0JBQU0sV0FBVyxLQUFLLGFBQWEsV0FBVztBQUM5QyxnQkFBSSxXQUFXQSxhQUFZO0FBQ3ZCLGtCQUFJLFVBQVU7QUFDVixnQkFBQUEsWUFBVyxPQUFPLElBQUksS0FBSyxRQUFRO0FBQUEsY0FDdkMsT0FDSztBQUNELGdCQUFBQSxZQUFXLE9BQU8sSUFBSSxLQUFLLGFBQWEsWUFBWSxPQUFPO0FBQUEsY0FDL0Q7QUFBQSxZQUNKO0FBQUEsVUFDSixDQUFDO0FBQ0QsZUFBSyxPQUFPLG9CQUFvQixnQkFBZ0Isc0JBQXNCLEtBQUs7QUFDM0UsV0FBQyxlQUFlLFFBQVEsZUFBZSxTQUFTLFNBQVMsV0FBVyx5QkFBeUIsV0FBVyxxQkFBcUI7QUFBQSxRQUNqSSxDQUFDO0FBRUQsWUFBSSxpQkFBaUIsVUFBVSxTQUFTLGVBQWUsSUFBSTtBQUN2RCxjQUFJRixLQUFJQyxLQUFJRTtBQUNaLGVBQUtILE1BQUssS0FBSyxPQUFPLFVBQVUsQ0FBQyxPQUFPLFFBQVFBLFFBQU8sU0FBUyxTQUFTQSxJQUFHLFNBQVMsUUFBUSxVQUFVLEdBQUc7QUFDdEc7QUFBQSxVQUNKO0FBQ0EsV0FBQ0csT0FBTUYsTUFBSyxLQUFLLE9BQU8sVUFBVSxDQUFDLE9BQU8sUUFBUUEsUUFBTyxTQUFTLFNBQVNBLElBQUcsZ0JBQWdCLFFBQVFFLFFBQU8sU0FBUyxTQUFTQSxJQUFHLFFBQVE7QUFDMUksZUFBSyxPQUFPLG9CQUFvQixVQUFVLGdCQUFnQixLQUFLO0FBQUEsUUFDbkUsQ0FBQztBQUNELFlBQUksSUFBSSxTQUFTLGVBQWUsWUFBWTtBQUN4QyxXQUFDLE1BQU0sS0FBSyxJQUFJLFVBQVUsQ0FBQyxPQUFPLFFBQVEsT0FBTyxTQUFTLFNBQVMsR0FBRyxjQUFjLFFBQVEsT0FBTyxTQUFTLFNBQVMsR0FBRyxRQUFRO0FBQUEsUUFDcEk7QUFDQSxlQUFPO0FBQUEsTUFDWDtBQUNBLGVBQVMsZUFBZSxjQUFjLFFBQVE7QUFDMUMsWUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtBQUM1QixZQUFJLGdCQUFnQjtBQUNwQixZQUFJLGFBQWEsUUFBUSxZQUFZLE9BQU8sVUFBVSxHQUFHO0FBQ3JELDBCQUFnQjtBQUNoQixnQkFBTSxvQkFBb0I7QUFBQSxZQUN0QixLQUFLO0FBQUEsWUFDTCxXQUFXLENBQUMsVUFBVTtBQUFBLFlBQ3RCLFdBQVc7QUFBQSxjQUNQO0FBQUEsZ0JBQ0ksTUFBTTtBQUFBLGdCQUNOLFVBQVUsQ0FBQyxPQUFPO0FBQ2Qsd0JBQU0sU0FBUyxHQUFHLE9BQU8sY0FBYyxRQUFRO0FBQy9DLDZCQUFXLFFBQVEsV0FBVyxTQUFTLFNBQVMsT0FBTyxLQUFLO0FBQUEsZ0JBQ2hFO0FBQUEsY0FDSjtBQUFBLFlBQ0o7QUFBQSxZQUNBLFVBQVU7QUFBQSxjQUNOLE9BQU8sT0FBTyxDQUFDLEdBQUcsY0FBYztBQUFBLGdCQUM1QixLQUFLO0FBQUEsZ0JBQ0wsV0FBVztBQUFBLGtCQUNQO0FBQUEsb0JBQ0ksTUFBTTtBQUFBLG9CQUNOLFVBQVUsQ0FBQyxPQUFPO0FBQ2QsMEJBQUlIO0FBQ0osNEJBQU0sU0FBUyxHQUFHO0FBQ2xCLDRCQUFNLFlBQVlBLE1BQUssT0FBTyxtQkFBbUIsUUFBUUEsUUFBTyxTQUFTLFNBQVNBLElBQUcsY0FBYyxtQkFBbUI7QUFDdEgsbUNBQWEsU0FBUyxNQUFNLFVBQVU7QUFDdEMsNkJBQU8sYUFBYSxTQUFTLE1BQU07QUFBQSxvQkFDdkM7QUFBQSxrQkFDSjtBQUFBLGtCQUNBO0FBQUEsb0JBQ0ksTUFBTTtBQUFBLG9CQUNOLFVBQVUsQ0FBQyxPQUFPO0FBQ2QsMEJBQUlBO0FBQ0osNEJBQU0sU0FBUyxHQUFHO0FBQ2xCLDRCQUFNLFlBQVlBLE1BQUssT0FBTyxtQkFBbUIsUUFBUUEsUUFBTyxTQUFTLFNBQVNBLElBQUcsY0FBYyxtQkFBbUI7QUFDdEgsbUNBQWEsU0FBUyxNQUFNLFVBQVU7QUFDdEMsNkJBQU8sZ0JBQWdCLE9BQU87QUFBQSxvQkFDbEM7QUFBQSxrQkFDSjtBQUFBLGdCQUNKO0FBQUEsY0FDSixDQUFDO0FBQUEsY0FDRDtBQUFBLGdCQUNJLEtBQUs7QUFBQSxnQkFDTCxXQUFXLENBQUMsa0JBQWtCO0FBQUEsZ0JBQzlCLFdBQVcsS0FBSyxhQUFhLGNBQWMsUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXO0FBQzNGLHNCQUFJQSxLQUFJQyxLQUFJRTtBQUNaLHlCQUFRO0FBQUEsb0JBQ0osS0FBSztBQUFBLG9CQUNMLFlBQVk7QUFBQSxzQkFDUixRQUFRSCxNQUFLLE9BQU8sZ0JBQWdCLFFBQVFBLFFBQU8sU0FBUyxTQUFTQSxJQUFHO0FBQUEsb0JBQzVFO0FBQUEsb0JBQ0EsWUFBWTtBQUFBLHNCQUNSLGFBQWFDLE1BQUssT0FBTyxnQkFBZ0IsUUFBUUEsUUFBTyxTQUFTLFNBQVNBLElBQUcsZ0JBQWdCRSxNQUFLLE9BQU8sZ0JBQWdCLFFBQVFBLFFBQU8sU0FBUyxTQUFTQSxJQUFHO0FBQUEsb0JBQ2pLO0FBQUEsb0JBQ0EsV0FBVyxDQUFDLGVBQWU7QUFBQSxvQkFDM0IsV0FBVztBQUFBLHNCQUNQO0FBQUEsd0JBQ0ksTUFBTTtBQUFBLHdCQUNOLFVBQVUsQ0FBQyxPQUFPO0FBQ2QsOEJBQUlIO0FBQ0osZ0NBQU0sVUFBVUEsTUFBSyxHQUFHLE9BQU8sbUJBQW1CLFFBQVFBLFFBQU8sU0FBUyxTQUFTQSxJQUFHO0FBQ3RGLHFDQUNLLE9BQU8sUUFDSixHQUFHLE9BQU8sYUFBYSxPQUFPLEtBQUs7QUFDM0MscUNBQVcsUUFBUSxXQUFXLFNBQVMsU0FBUyxPQUFPLEtBQUs7QUFBQSx3QkFDaEU7QUFBQSxzQkFDSjtBQUFBLG9CQUNKO0FBQUEsa0JBQ0o7QUFBQSxnQkFDSixDQUFDO0FBQUEsY0FDTDtBQUFBLFlBQ0o7QUFBQSxVQUNKO0FBQ0EscUJBQVcsT0FBTyxjQUFjO0FBQzVCLG1CQUFPLGFBQWEsR0FBRztBQUFBLFVBQzNCO0FBQ0EsaUJBQU8sT0FBTyxjQUFjLGlCQUFpQjtBQUFBLFFBQ2pELFdBQ1MsYUFBYSxRQUFRLEtBQUs7QUFDL0IsZ0JBQU0sU0FBVSxLQUFLLGlCQUFpQixRQUFRLGlCQUFpQixTQUFTLFNBQVMsYUFBYSxnQkFBZ0IsUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHLFNBQVM7QUFDM0osV0FBQyxLQUFLLGFBQWEsZ0JBQWdCLFFBQVEsT0FBTyxTQUFTLEtBQU0sYUFBYSxhQUFhLENBQUM7QUFDNUYsdUJBQWEsV0FBVyxPQUFPO0FBQy9CLFdBQUMsS0FBSyxhQUFhLGdCQUFnQixRQUFRLE9BQU8sU0FBUyxLQUFNLGFBQWEsYUFBYSxDQUFDO0FBQzVGLHVCQUFhLFdBQVcsYUFBYSxJQUFJO0FBQ3pDLFdBQUMsS0FBSyxhQUFhLGVBQWUsUUFBUSxPQUFPLFNBQVMsS0FBTSxhQUFhLFlBQVksQ0FBQztBQUMxRix1QkFBYSxVQUFVLEtBQUs7QUFBQSxZQUN4QixNQUFNO0FBQUEsWUFDTixVQUFVLENBQUMsT0FBTztBQUNkLGtCQUFJQTtBQUNKLG9CQUFNSSxTQUFRSixNQUFLLEdBQUcsWUFBWSxRQUFRQSxRQUFPLFNBQVMsU0FBU0EsSUFBRyxhQUFhLGFBQWE7QUFDaEcsY0FBQUksU0FBUSxPQUFPLFVBQVUsUUFBUSxFQUFFLFVBQVVBLEtBQUk7QUFBQSxZQUNyRDtBQUFBLFVBQ0osQ0FBQztBQUNELFdBQUMsS0FBSyxhQUFhLGVBQWUsUUFBUSxPQUFPLFNBQVMsS0FBTSxhQUFhLFlBQVksQ0FBQztBQUMxRix1QkFBYSxVQUFVLEtBQUssa0JBQWtCO0FBQUEsUUFDbEQ7QUFDQSxZQUFJLGVBQWU7QUFDZixXQUFDLEtBQUssYUFBYSxjQUFjLFFBQVEsT0FBTyxTQUFTLFNBQVMsR0FBRyxRQUFRLENBQUMsVUFBVSxlQUFlLE9BQU8sTUFBTSxDQUFDO0FBQUEsUUFDekg7QUFBQSxNQUNKO0FBQ0EsVUFBTSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQzNaZDtBQUFBO0FBQUE7QUFDQSxVQUFJLGtCQUFtQixXQUFRLFFBQUssbUJBQW9CLFNBQVUsS0FBSztBQUNuRSxlQUFRLE9BQU8sSUFBSSxhQUFjLE1BQU0sRUFBRSxXQUFXLElBQUk7QUFBQSxNQUM1RDtBQUNBLGFBQU8sZUFBZSxTQUFTLGNBQWMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUM1RCxjQUFRLHdCQUF3QjtBQUNoQyxVQUFNLFVBQVU7QUFDaEIsVUFBTSxrQkFBa0IsZ0JBQWdCLHVCQUEwQjtBQUtsRSxVQUFNLHdCQUFOLGNBQW9DLFFBQVEsWUFBWTtBQUFBLFFBQ3BELFlBQVksTUFBTTtBQUNkLGdCQUFNLElBQUk7QUFDVixlQUFLLGdCQUFnQixDQUFDO0FBQ3RCLGVBQUssaUJBQWlCO0FBQUEsUUFDMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQVVBLFNBQVMsTUFBTSxJQUFJLE1BQU07QUFDckIsZ0JBQU1DLFVBQVMsS0FBSyxVQUFVLFFBQVE7QUFDdEMsa0JBQVEsTUFBTTtBQUFBLFlBQ1YsS0FBSztBQUNEO0FBQ0kscUJBQUssWUFBWSxpQkFBaUIsRUFBRSxJQUFJO0FBQ3hDLGdCQUFBQSxRQUFPLE9BQU8sU0FBUyxRQUFRLElBQUk7QUFBQSxjQUN2QztBQUNBO0FBQUEsWUFDSjtBQUNJO0FBQUEsVUFDUjtBQUNBLGVBQUssY0FBYyxLQUFLLEVBQUU7QUFBQSxRQUM5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLQSxXQUFXLElBQUk7QUFDWCxpQkFBTyxLQUFLLFlBQVksaUJBQWlCLEVBQUU7QUFBQSxRQUMvQztBQUFBO0FBQUE7QUFBQTtBQUFBLFFBSUEsZ0JBQWdCO0FBQ1osZUFBSyxjQUFjLFFBQVEsQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFLENBQUM7QUFBQSxRQUMxRDtBQUFBLFFBQ0EsbUJBQW1CO0FBQ2YsZUFBSyxjQUFjLGdCQUFnQixRQUFRLFlBQVksRUFBRTtBQUN6RCxjQUFJLENBQUMsS0FBSyxZQUFZLFFBQVE7QUFDMUIsaUJBQUssWUFBWSxTQUFTO0FBQzFCLGtCQUFNQSxVQUFTLEtBQUssVUFBVSxRQUFRO0FBQ3RDLGtCQUFNLFFBQVE7QUFDZCxZQUFBQSxRQUFPLE9BQU8sV0FBVyxLQUFLLEtBQUssVUFBVSxPQUFPLEdBQUdBLFFBQU8sT0FBTyxVQUFVO0FBQUEsY0FDM0UsSUFBSSxRQUFRLEdBQUcsVUFBVSxVQUFVO0FBQy9CLHVCQUFPLENBQUMsSUFBSTtBQUNaLG9CQUFJLENBQUMsTUFBTSxPQUFPLENBQUMsQ0FBQyxHQUFHO0FBQ25CLHlCQUFPLE9BQU8sTUFBTSxZQUFZLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxTQUFTO0FBQ2hFLHdCQUFJO0FBQ0EsMkJBQUssUUFBUTtBQUFBLG9CQUNqQixTQUNPLEdBQUc7QUFDTiw0QkFBTSxJQUFJLENBQUM7QUFBQSxvQkFDZjtBQUFBLGtCQUNKLENBQUM7QUFBQSxnQkFDTDtBQUNBLHVCQUFPO0FBQUEsY0FDWDtBQUFBLFlBQ0osQ0FBQztBQUFBLFVBQ0w7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUNBLGNBQVEsd0JBQXdCO0FBQUE7QUFBQTs7O0FDL0VoQztBQUFBO0FBQUE7QUFDQSxVQUFJLGtCQUFtQixXQUFRLFFBQUssbUJBQW9CLFNBQVUsS0FBSztBQUNuRSxlQUFRLE9BQU8sSUFBSSxhQUFjLE1BQU0sRUFBRSxXQUFXLElBQUk7QUFBQSxNQUM1RDtBQUNBLGFBQU8sZUFBZSxTQUFTLGNBQWMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUM1RCxjQUFRLGlCQUFpQjtBQUN6QixVQUFNLFVBQVU7QUFDaEIsVUFBTSxjQUFjO0FBQ3BCLFVBQU0sVUFBVTtBQUNoQixVQUFNLGtCQUFrQixnQkFBZ0IsdUJBQTBCO0FBSWxFLFVBQU0saUJBQU4sY0FBNkIsUUFBUSxZQUFZO0FBQUEsUUFDN0MsWUFBWSxNQUFNO0FBQ2QsZ0JBQU0sSUFBSTtBQUNWLGVBQUsscUJBQXFCLEtBQUssVUFBVSxRQUFRLEVBQUUsUUFBUSxNQUFNO0FBQ2pFLGVBQUssYUFBYSxDQUFDO0FBQ25CLGVBQUssYUFBYSxJQUFJLFlBQVksaUJBQWlCO0FBQ25ELGVBQUssaUJBQWlCLElBQUksUUFBUSxlQUFlO0FBQ2pELGVBQUssaUJBQWlCO0FBQUEsUUFDMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFlQSxNQUFNLFNBQVMsT0FBTyxhQUFhLGNBQWMsVUFBVSxDQUFDLEdBQUc7QUFDM0QsZUFBSyxXQUFXLFNBQVMsaUJBQWlCLE9BQU8sTUFBTSxLQUFLO0FBQzVELGNBQUksY0FBYztBQUNkLGlCQUFLLFdBQVcsU0FBUyxZQUFZLE9BQU8sWUFBWTtBQUFBLFVBQzVEO0FBQ0EsY0FBSSxRQUFRLFlBQVksUUFBUSxjQUFjO0FBQzFDLGlCQUFLLFdBQVcsU0FBUyxZQUFZLE9BQU8sUUFBUSxZQUFZO0FBQUEsVUFDcEU7QUFDQSxlQUFLLFlBQVksYUFBYSxLQUFLLElBQUk7QUFBQSxZQUNuQztBQUFBLFlBQ0E7QUFBQSxZQUNBLFVBQVUsUUFBUSxZQUFZO0FBQUEsWUFDOUIsT0FBTyxRQUFRLFNBQVM7QUFBQSxZQUN4QixXQUFXLFFBQVEsYUFBYTtBQUFBLFlBQ2hDLGFBQWEsUUFBUSxlQUFlO0FBQUEsVUFDeEM7QUFDQSxlQUFLLFdBQVcsS0FBSyxLQUFLO0FBQzFCLGdCQUFNLEtBQUssbUJBQW1CO0FBQzlCLGVBQUssUUFBUTtBQUFBLFFBQ2pCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQVFBLFdBQVcsT0FBTyxVQUFVLENBQUMsR0FBRztBQUM1QixpQkFBTyxLQUFLLFlBQVksYUFBYSxLQUFLO0FBQzFDLGNBQUksQ0FBQyxRQUFRLG1CQUFtQjtBQUM1QixpQkFBSyxXQUFXLFdBQVcsaUJBQWlCLEtBQUs7QUFBQSxVQUNyRDtBQUNBLGNBQUksQ0FBQyxRQUFRLGNBQWM7QUFDdkIsaUJBQUssV0FBVyxXQUFXLFlBQVksS0FBSztBQUFBLFVBQ2hEO0FBQ0EsY0FBSSxDQUFDLFFBQVEsY0FBYztBQUN2QixpQkFBSyxXQUFXLFdBQVcsWUFBWSxLQUFLO0FBQUEsVUFDaEQ7QUFDQSxnQkFBTSxNQUFNLEtBQUssV0FBVyxRQUFRLEtBQUs7QUFDekMsY0FBSSxNQUFNLElBQUk7QUFDVixpQkFBSyxXQUFXLE9BQU8sS0FBSyxDQUFDO0FBQUEsVUFDakM7QUFDQSxjQUFJLENBQUMsUUFBUSxhQUFhO0FBQ3RCLGlCQUFLLFFBQVE7QUFBQSxVQUNqQjtBQUFBLFFBQ0o7QUFBQSxRQUNBLGdCQUFnQjtBQUdaLFdBQUMsR0FBRyxLQUFLLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVSxLQUFLLFdBQVcsT0FBTztBQUFBLFlBQzNELGNBQWM7QUFBQSxZQUNkLGNBQWM7QUFBQSxZQUNkLG1CQUFtQjtBQUFBLFlBQ25CLGFBQWE7QUFBQSxVQUNqQixDQUFDLENBQUM7QUFDRixlQUFLLFdBQVcsY0FBYztBQUM5QixlQUFLLFFBQVE7QUFBQSxRQUNqQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBSUEsVUFBVTtBQUNOLGNBQUk7QUFDQSxrQkFBTSxLQUFLLEtBQUssVUFBVSxVQUFVLEVBQUUsaUJBQWlCLEtBQUssVUFBVSxJQUFJLGFBQWEsZUFBZSxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUM7QUFBQSxVQUM3SSxTQUNPLEdBQUc7QUFDTixpQkFBSyxJQUFJLENBQUM7QUFBQSxVQUNkO0FBQUEsUUFDSjtBQUFBLFFBQ0EsTUFBTSxtQkFBbUI7QUFDckIsZ0JBQU1DLFVBQVMsS0FBSyxVQUFVLFFBQVE7QUFDdEMsZ0JBQU1BLFFBQU87QUFDYixnQkFBTUMsVUFBUyxLQUFLLFVBQVUsUUFBUTtBQUN0QyxlQUFLLGNBQWMsZ0JBQWdCLFFBQVEsWUFBWSxFQUFFO0FBQ3pELGdCQUFNLGNBQWMsS0FBSztBQUN6QixnQkFBTSxZQUFZLEtBQUssVUFBVTtBQUNqQyxjQUFJLENBQUMsWUFBWSxRQUFRO0FBQ3JCLHdCQUFZLFNBQVM7QUFDckIsZ0JBQUk7QUFDSixnQkFBSSxXQUFXO0FBQ1gsZ0NBQWtCLEtBQUssS0FBSyxVQUFVLGdCQUFnQixFQUFFLElBQUksVUFBVSxHQUFHO0FBQUEsWUFDN0UsT0FDSztBQUNELGdDQUFrQkEsUUFBTyxTQUFTLGNBQWMsMkJBQTJCO0FBQzNFLG9CQUFNLE9BQU87QUFDYixrQkFBSSxJQUFJO0FBQ1IscUJBQU8sQ0FBQyxtQkFBbUIsSUFBSSxNQUFNO0FBQ2pDLGtDQUFrQkEsUUFBTyxTQUFTLGNBQWMsMkJBQTJCO0FBQzNFLHNCQUFNRCxRQUFPLFFBQVEsTUFBTSxFQUFFO0FBQzdCLHFCQUFLO0FBQUEsY0FDVDtBQUNBLGtCQUFJLENBQUMsaUJBQWlCO0FBQ2xCLDRCQUFZLFNBQVM7QUFDckIscUJBQUssSUFBSSwrQkFBK0I7QUFDeEM7QUFBQSxjQUNKO0FBQUEsWUFDSjtBQUNBLGlCQUFLLGVBQWUsU0FBUyxnQkFBZ0IsV0FBVyxXQUFXLENBQUMsYUFBYSxXQUFZO0FBRXpGLG9CQUFNLGVBQWU7QUFDckIsdUJBQVMsTUFBTSxjQUFjLFNBQVM7QUFDdEMseUJBQVcsY0FBYyxPQUFPLE9BQU8sWUFBWSxZQUFZLEdBQUc7QUFDOUQsc0JBQU0sY0FBYyxTQUFTLGNBQWMsWUFBWSxPQUFPLE9BQU87QUFDckUsNEJBQVksYUFBYSxhQUFhLFdBQVcsS0FBSztBQUN0RCxzQkFBTSxVQUFVLGtEQUFrRCxXQUFXLEtBQUs7QUFDbEYsc0JBQU0sWUFBWSxXQUFXLGFBQ3pCLFdBQVcsZUFDWEEsUUFBTyxNQUFNLElBQUksU0FBUyxJQUFJO0FBQ2xDLG9CQUFJLGdCQUFnQixXQUFXO0FBQy9CLG9CQUFJLFdBQVc7QUFDWCxrQ0FBZ0IsUUFBUSxhQUFhO0FBQUEsZ0JBQ3pDO0FBQ0Esb0JBQUksV0FBVztBQUNYLHNCQUFJLFFBQVEsU0FBUyxjQUFjLE9BQU87QUFDMUMsd0JBQU0sWUFBWTtBQUNsQix3QkFBTSxjQUFjO0FBQ3BCLDhCQUFZLFlBQVksS0FBSztBQUFBLGdCQUNqQyxPQUNLO0FBQ0QsOEJBQVksYUFBYSxTQUFTLGFBQWE7QUFBQSxnQkFDbkQ7QUFDQSxzQkFBTSxhQUFhLGFBQWE7QUFDaEMsNkJBQWEsWUFBWSxXQUFXO0FBQ3BDLHNCQUFNLGFBQWEsYUFBYSxtQkFBbUIsYUFBYSxLQUFLLFNBQVMsV0FBVyxLQUFLLEdBQUcsV0FBVyxPQUFPLElBQUk7QUFDdkgsNkJBQWEsWUFBWTtBQUV6QixvQkFBSSxXQUFXLGFBQWEsQ0FBQ0EsUUFBTyxNQUFNLElBQUksU0FBUyxJQUFJLEdBQUc7QUFDMUQsNkJBQVcsVUFBVSxJQUFJLFdBQVc7QUFBQSxnQkFDeEMsV0FDUyxDQUFDLFdBQVc7QUFFakIsNkJBQVcsYUFBYSxRQUFRLEtBQUs7QUFDckMsNkJBQVcsYUFBYSxTQUFTLFdBQVcsU0FBUztBQUNyRCw2QkFBVyxZQUFZO0FBQUEsZ0JBQzNCO0FBQ0Esb0JBQUksV0FBVyxhQUFhO0FBQ3hCLDhCQUFZLGlCQUFpQixTQUFTLFNBQVUsSUFBSTtBQUNoRCxvQkFBQUEsUUFBTyxNQUFNLElBQUksU0FBUyxFQUFFQSxRQUFPLE1BQU0sSUFBSSxTQUFTLElBQUksS0FBSyxRQUFRLElBQUk7QUFDM0UsaUNBQWEsUUFBUTtBQUFBLGtCQUN6QixDQUFDO0FBQUEsZ0JBQ0w7QUFDQSw0QkFBWSxpQkFBaUIsU0FBUyxZQUNoQyxTQUFVLElBQUk7QUFDWixzQkFBSTtBQUNKLHdCQUFNLGNBQWMsS0FBSyxHQUFHLGNBQWMsd0JBQXdCLFFBQVEsT0FBTyxTQUFTLFNBQVMsR0FBRyxjQUFjLGlCQUFpQjtBQUNySSxzQkFBSSxZQUFZO0FBQ1osK0JBQVcsS0FBSztBQUFBLGtCQUNwQjtBQUFBLGdCQUNKLElBQ0UsU0FBVSxJQUFJO0FBQ1osc0JBQUk7QUFDSix3QkFBTSxjQUFjLEtBQUssR0FBRyxjQUN2Qix3QkFBd0IsUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHO0FBQ2pFLHNCQUFJLFlBQVk7QUFDWiwrQkFBVyxLQUFLO0FBQUEsa0JBQ3BCO0FBQUEsZ0JBQ0osQ0FBQztBQUNMLHNCQUFNLFFBQVEsWUFDUixhQUFhLGFBQ2IsYUFBYTtBQUNuQixvQkFBSSxhQUFhLFdBQVc7QUFFNUIsb0JBQUksZUFBZSxHQUFHO0FBQ2xCLCtCQUFhO0FBQUEsZ0JBQ2pCO0FBQ0Esb0JBQUksY0FDQSxjQUFjLEtBQ2QsYUFBYSxNQUFNLFNBQVMsUUFBUTtBQUNwQywrQkFBYSxhQUFhLE1BQU0sU0FBUyxVQUFVO0FBQ25ELCtCQUFhLGNBQWMsYUFBYSxZQUFZLElBQUk7QUFBQSxnQkFDNUQsT0FDSztBQUNELCtCQUFhLGNBQWMsYUFBYSxVQUFVO0FBQUEsZ0JBQ3REO0FBQUEsY0FDSjtBQUFBLFlBQ0osQ0FBQztBQUFBLFVBQ0w7QUFDQSxlQUFLLG1CQUFtQixRQUFRO0FBQUEsUUFDcEM7QUFBQSxNQUNKO0FBQ0EsY0FBUSxpQkFBaUI7QUFBQTtBQUFBOzs7QUN4TnpCO0FBQUE7QUFBQTtBQUNBLGFBQU8sZUFBZSxTQUFTLGNBQWMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUM1RCxjQUFRLGtCQUFrQjtBQUMxQixVQUFNLFVBQVU7QUFlaEIsVUFBTSxrQkFBTixjQUE4QixRQUFRLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFZNUMsWUFBWSxTQUFTLGlCQUFpQixRQUFRLFdBQVc7QUFDckQsZ0JBQU07QUFDTixlQUFLLFVBQVU7QUFDZixlQUFLLGtCQUFrQjtBQUN2QixjQUFJLFVBQVUsV0FBVztBQUNyQixpQkFBSyxRQUFRO0FBQUEsVUFDakIsV0FDUyxVQUFVLFVBQVU7QUFDekIsaUJBQUssUUFBUTtBQUFBLFVBQ2pCLE9BQ0s7QUFDRCxpQkFBSyxRQUFRLE9BQU8sT0FBTyxPQUFPLE9BQU8sQ0FBQyxHQUFHLFlBQVksR0FBRyxLQUFLO0FBQUEsVUFDckU7QUFDQSxlQUFLLFdBQVcsQ0FBQztBQUFBLFFBQ3JCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUtBLFdBQVc7QUFDUCxpQkFBTyxLQUFLLGlCQUFpQjtBQUFBLFFBQ2pDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUtBLFlBQVk7QUFDUixnQkFBTSxVQUFVO0FBQUEsWUFDWixLQUFLLENBQUMsUUFBUSxLQUFLLFNBQVMsR0FBRztBQUFBLFlBQy9CLEtBQUssQ0FBQyxLQUFLLFVBQVU7QUFDakIsbUJBQUssU0FBUyxLQUFLLEtBQUs7QUFDeEIscUJBQU87QUFBQSxZQUNYO0FBQUEsWUFDQSxLQUFLLENBQUMsUUFBUSxLQUFLLE9BQU8sR0FBRztBQUFBLFlBQzdCLFFBQVEsQ0FBQyxRQUFRLEtBQUssVUFBVSxHQUFHO0FBQUEsWUFDbkMsT0FBTyxNQUFNO0FBQ1QseUJBQVcsT0FBTyxLQUFLLFFBQVEsR0FBRztBQUM5QixxQkFBSyxVQUFVLEdBQUc7QUFBQSxjQUN0QjtBQUFBLFlBQ0o7QUFBQSxZQUNBLFNBQVMsQ0FBQyxhQUFhO0FBQ25CLHFCQUFPLEtBQUssaUJBQWlCLEVBQUUsUUFBUSxRQUFRO0FBQUEsWUFDbkQ7QUFBQSxZQUNBLElBQUksT0FBTztBQUNQLHFCQUFPLEtBQUssTUFBTSxRQUFRLEVBQUU7QUFBQSxZQUNoQztBQUFBLFlBQ0EsU0FBUyxNQUFNO0FBQ1gscUJBQU8sS0FBSyxpQkFBaUIsRUFBRSxPQUFPO0FBQUEsWUFDMUM7QUFBQSxZQUNBLE1BQU0sTUFBTTtBQUNSLG9CQUFNLE9BQU8sS0FBSyxRQUFRO0FBQzFCLHFCQUFPLEtBQUssT0FBTyxRQUFRLEVBQUU7QUFBQSxZQUNqQztBQUFBLFlBQ0EsUUFBUSxNQUFNO0FBQ1YscUJBQU8sS0FBSyxpQkFBaUIsRUFBRSxPQUFPO0FBQUEsWUFDMUM7QUFBQSxZQUNBLENBQUMsT0FBTyxRQUFRLEdBQUcsTUFBTTtBQUNyQixxQkFBTyxLQUFLLGlCQUFpQixFQUFFLE9BQU8sUUFBUSxFQUFFO0FBQUEsWUFDcEQ7QUFBQSxZQUNBLENBQUMsT0FBTyxXQUFXLEdBQUc7QUFBQSxZQUN0QixPQUFPO0FBQUEsVUFDWDtBQUNBLGlCQUFPO0FBQUEsUUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLQSxVQUFVO0FBQ04sZ0JBQU0sVUFBVSxPQUFPLE1BQU0sSUFBSSxLQUFLLFNBQVMsSUFBSTtBQUNuRCxnQkFBTSxPQUFPLFVBQVUsS0FBSyxNQUFNLE9BQU8sSUFBSSxDQUFDO0FBQzlDLHFCQUFXLE9BQU8sTUFBTTtBQUNwQixrQkFBTSxRQUFRO0FBQ2QsaUJBQUssU0FBUyxHQUFHLElBQUk7QUFBQSxVQUN6QjtBQUNBLGlCQUFPO0FBQUEsUUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLQSxRQUFRLE1BQU07QUFDVixpQkFBTyxDQUFDLEdBQUcsSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDN0MsaUJBQU8sTUFBTSxJQUFJLEtBQUssU0FBUyxLQUFLLFVBQVUsSUFBSSxHQUFHLElBQUk7QUFDekQscUJBQVcsT0FBTyxNQUFNO0FBQ3BCLGtCQUFNLFFBQVE7QUFDZCxpQkFBSyxTQUFTLEdBQUcsSUFBSTtBQUFBLFVBQ3pCO0FBQUEsUUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1BLFNBQVMsS0FBSztBQUNWLGdCQUFNLFFBQVEsT0FBTyxNQUFNLElBQUksR0FBRyxLQUFLLGVBQWUsR0FBRyxHQUFHLElBQUksSUFBSTtBQUNwRSxjQUFJLE9BQU8sVUFBVSxhQUFhO0FBQzlCO0FBQUEsVUFDSjtBQUNBLGNBQUksRUFBRSxPQUFPLFNBQVMsSUFBSSxLQUFLLE1BQU0sY0FBYyxFQUFFLE1BQU0sQ0FBQztBQUM1RCxlQUFLLFNBQVMsR0FBRyxJQUFJO0FBQ3JCLGlCQUFPO0FBQUEsUUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1BLFNBQVMsS0FBSyxPQUFPO0FBQ2pCLGNBQUksRUFBRSxLQUFLLFFBQVEsT0FBTyxTQUFTLElBQUksS0FBSyxNQUFNLGVBQWU7QUFBQSxZQUM3RDtBQUFBLFlBQ0E7QUFBQSxVQUNKLENBQUM7QUFDRCxlQUFLLE9BQU8sTUFBTTtBQUNsQixpQkFBTyxNQUFNLElBQUksR0FBRyxLQUFLLGVBQWUsR0FBRyxNQUFNLElBQUksVUFBVSxJQUFJO0FBQ25FLGVBQUssU0FBUyxNQUFNLElBQUk7QUFBQSxRQUM1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1BLE9BQU8sS0FBSztBQUNSLGlCQUFPLEtBQUssUUFBUSxFQUFFLFNBQVMsR0FBRztBQUFBLFFBQ3RDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUtBLE9BQU8sS0FBSztBQUNSLGdCQUFNLE9BQU8sS0FBSyxRQUFRO0FBQzFCLGNBQUksQ0FBQyxLQUFLLFNBQVMsR0FBRyxHQUFHO0FBQ3JCLGlCQUFLLEtBQUssR0FBRztBQUViLGlCQUFLLFFBQVEsSUFBSTtBQUFBLFVBQ3JCO0FBQUEsUUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLQSxVQUFVLEtBQUs7QUFDWCxnQkFBTSxPQUFPLEtBQUssUUFBUTtBQUMxQixnQkFBTSxRQUFRLEtBQUssUUFBUSxHQUFHO0FBQzlCLGNBQUksUUFBUSxJQUFJO0FBQ1osaUJBQUssT0FBTyxPQUFPLENBQUM7QUFDcEIsbUJBQU8sS0FBSyxTQUFTLEdBQUc7QUFFeEIsaUJBQUssUUFBUSxJQUFJO0FBQUEsVUFDckI7QUFDQSxpQkFBTyxNQUFNLE1BQU0sR0FBRyxLQUFLLGVBQWUsR0FBRyxHQUFHLElBQUksSUFBSTtBQUN4RCxpQkFBTztBQUFBLFFBQ1g7QUFBQSxRQUNBLG1CQUFtQjtBQUNmLGlCQUFPLElBQUksTUFBTSxLQUFLLFVBQVU7QUFBQSxZQUM1QixLQUFLLENBQUMsUUFBUSxNQUFNLGFBQWE7QUFDN0IsbUJBQUssUUFBUTtBQUNiLGtCQUFJLE9BQU8sU0FBUyxZQUFZLFFBQVEsUUFBUTtBQUM1QyxxQkFBSyxTQUFTLElBQUk7QUFBQSxjQUN0QjtBQUNBLHFCQUFPLFFBQVEsSUFBSSxRQUFRLE1BQU0sUUFBUTtBQUFBLFlBQzdDO0FBQUEsWUFDQSxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsYUFBYTtBQUNwQyxrQkFBSSxPQUFPLE1BQU0sVUFBVTtBQUN2QixvQkFBSSxhQUFhLFFBQVc7QUFDeEIsdUJBQUssVUFBVSxDQUFDO0FBQ2hCLHlCQUFPO0FBQUEsZ0JBQ1g7QUFDQSxxQkFBSyxTQUFTLEdBQUcsUUFBUTtBQUN6Qix1QkFBTztBQUFBLGNBQ1g7QUFDQSxxQkFBTyxRQUFRLElBQUksUUFBUSxHQUFHLFVBQVUsUUFBUTtBQUFBLFlBQ3BEO0FBQUEsWUFDQSxLQUFLLENBQUMsUUFBUSxNQUFNO0FBQ2hCLG1CQUFLLFFBQVE7QUFDYixxQkFBTyxRQUFRLElBQUksUUFBUSxDQUFDO0FBQUEsWUFDaEM7QUFBQSxZQUNBLGdCQUFnQixDQUFDLFFBQVEsTUFBTTtBQUMzQixrQkFBSSxPQUFPLE1BQU0sVUFBVTtBQUN2QixxQkFBSyxVQUFVLENBQUM7QUFDaEIsdUJBQU87QUFBQSxjQUNYO0FBQ0EscUJBQU8sUUFBUSxlQUFlLFFBQVEsQ0FBQztBQUFBLFlBQzNDO0FBQUEsVUFDSixDQUFDO0FBQUEsUUFDTDtBQUFBLFFBQ0EsbUJBQW1CO0FBQ2YsZ0JBQU0sTUFBTSxvQkFBSSxJQUFJO0FBQ3BCLHFCQUFXLE9BQU8sS0FBSyxRQUFRLEdBQUc7QUFDOUIsZ0JBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxHQUFHLENBQUM7QUFBQSxVQUNuQztBQUNBLGlCQUFPO0FBQUEsUUFDWDtBQUFBLE1BQ0o7QUFDQSxjQUFRLGtCQUFrQjtBQUMxQixVQUFNLGVBQWU7QUFBQSxRQUNqQixlQUFlLENBQUMsRUFBRSxNQUFNLE9BQU8sRUFBRSxNQUFNO0FBQUEsUUFDdkMsZ0JBQWdCLENBQUMsRUFBRSxLQUFLLE1BQU0sT0FBTyxFQUFFLEtBQUssTUFBTTtBQUFBLE1BQ3REO0FBQ0EsVUFBTSxjQUFjO0FBQUEsUUFDaEIsZUFBZSxDQUFDLEVBQUUsTUFBTSxNQUFNO0FBQzFCLGNBQUk7QUFDQSxvQkFBUSxLQUFLLE1BQU0sS0FBSztBQUFBLFVBQzVCLFNBQ08sR0FBRztBQUNOLG1CQUFPLEVBQUUsTUFBTTtBQUFBLFVBQ25CO0FBQ0EsaUJBQU8sRUFBRSxNQUFNO0FBQUEsUUFDbkI7QUFBQSxRQUNBLGdCQUFnQixDQUFDLEVBQUUsS0FBSyxNQUFNLE1BQU07QUFDaEMsa0JBQVEsS0FBSyxVQUFVLEtBQUs7QUFDNUIsaUJBQU8sRUFBRSxLQUFLLE1BQU07QUFBQSxRQUN4QjtBQUFBLE1BQ0o7QUFBQTtBQUFBOzs7QUNuUEE7QUFBQTtBQUFBO0FBQ0EsYUFBTyxlQUFlLFNBQVMsY0FBYyxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQzVELGNBQVEsY0FBYyxRQUFRLGtCQUFrQjtBQUNoRCxVQUFNLFVBQVU7QUFDaEIsVUFBTSxTQUFTO0FBSWYsVUFBTSxrQkFBTixjQUE4QixRQUFRLFlBQVk7QUFBQSxRQUM5QyxZQUFZLE1BQU07QUFDZCxnQkFBTSxJQUFJO0FBQ1YsZUFBSyxxQkFBcUIsb0JBQUksSUFBSTtBQUNsQyxlQUFLLHVCQUF1QixLQUFLLHNCQUFzQixLQUFLLElBQUk7QUFDaEUsZUFBSyx5QkFBeUIsS0FBSyx3QkFBd0IsS0FBSyxJQUFJO0FBQ3BFLGVBQUssaUJBQWlCLENBQUMsTUFBTTtBQUN6QixnQkFBSSxDQUFDLEtBQUssWUFBWTtBQUNsQixtQkFBSyxhQUFhLElBQUksWUFBWSxDQUFDO0FBQUEsWUFDdkMsT0FDSztBQUNELG1CQUFLLFdBQVcsTUFBTSxJQUFJLFlBQVksQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLE1BQU0sQ0FBQztBQUFBLFlBQ3ZFO0FBQ0EsaUJBQUssaUJBQWlCLEdBQUc7QUFBQSxjQUNyQixNQUFNO0FBQUEsWUFDVixDQUFDO0FBQUEsVUFDTDtBQUNBLGVBQUssZUFBZSxPQUFPLE1BQU07QUFDN0IsZ0JBQUksQ0FBQyxLQUFLLFlBQVk7QUFDbEI7QUFBQSxZQUNKO0FBQ0Esa0JBQU0sa0JBQWtCLElBQUksWUFBWSxLQUFLLFVBQVU7QUFDdkQsaUJBQUssYUFBYTtBQUNsQixpQkFBSyxpQkFBaUIsR0FBRztBQUFBLGNBQ3JCLFVBQVU7QUFBQSxjQUNWLE1BQU07QUFBQSxZQUNWLENBQUM7QUFBQSxVQUNMO0FBQ0EsZUFBSyxLQUFLLE9BQU8sVUFBVSxhQUFhO0FBQ3hDLGVBQUsseUJBQXlCO0FBQzlCLGVBQUssb0JBQW9CLG9CQUFvQixLQUFLLG9CQUFvQjtBQUN0RSxlQUFLLG9CQUFvQixzQkFBc0IsS0FBSyxzQkFBc0I7QUFDMUUsZUFBSywyQkFBMkI7QUFDaEMscUJBQVcsT0FBTyxPQUFPLGVBQWUsR0FBRztBQUN2QyxpQkFBSyxxQkFBcUIsR0FBRztBQUFBLFVBQ2pDO0FBQUEsUUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLQSxTQUFTLFVBQVU7QUFDZixlQUFLLG1CQUFtQixJQUFJLFFBQVE7QUFBQSxRQUN4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLQSxXQUFXLFVBQVU7QUFDakIsZUFBSyxtQkFBbUIsT0FBTyxRQUFRO0FBQUEsUUFDM0M7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUlBLGdCQUFnQjtBQUNaLGVBQUssbUJBQW1CLE1BQU07QUFDOUIsZUFBSyx1QkFBdUIsb0JBQW9CLEtBQUssb0JBQW9CO0FBQ3pFLGVBQUssdUJBQXVCLHNCQUFzQixLQUFLLHNCQUFzQjtBQUM3RSxxQkFBVyxPQUFPLE9BQU8sZUFBZSxHQUFHO0FBQ3ZDLGlCQUFLLHVCQUF1QixHQUFHO0FBQUEsVUFDbkM7QUFBQSxRQUNKO0FBQUEsUUFDQSw2QkFBNkI7QUFDekIsaUJBQU8sT0FBTyxzQkFBc0IsaUJBQWlCLENBQUMsVUFBVSxLQUFLLDBCQUEwQixLQUFLLEdBQUcsS0FBSyxjQUFjLElBQUksUUFBUTtBQUN0SSxpQkFBTyxPQUFPLFNBQVMsUUFBUSxDQUFDLFdBQVcsS0FBSywwQkFBMEIsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUFBLFFBQ3pGO0FBQUEsUUFDQSwwQkFBMEIsT0FBTztBQUM3QixnQkFBTSxTQUFTLE1BQU07QUFDckIsY0FBSSxpQkFBaUIsb0JBQW9CLEtBQUssRUFBRTtBQUVoRCxjQUFJLE9BQU8sY0FBYyxjQUFjLEdBQUc7QUFDdEM7QUFBQSxVQUNKO0FBQ0EsZUFBSyxzQkFBc0IsT0FBTyxhQUFhO0FBQy9DLFdBQUMsR0FBRyxPQUFPLFdBQVcsTUFBTTtBQUN4QixnQkFBSSxJQUFJO0FBQ1IsbUJBQU8sQ0FBQyxXQUFXLE1BQU0sY0FBYyxPQUFPLGVBQWUsT0FDdkQsTUFBTSxLQUFLLE9BQU8scUJBQXFCLFFBQVEsT0FBTyxTQUFTLFNBQVMsR0FBRyxrQkFBa0IsUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHO0FBQUEsVUFDM0ksR0FBRyxNQUFNO0FBQ0wsZ0JBQUk7QUFDSixtQkFBTyxLQUFLLHVCQUF1QixLQUFLLE9BQU8sZ0JBQWdCLGtCQUFrQixRQUFRLE9BQU8sU0FBUyxTQUFTLEdBQUcsYUFBYTtBQUFBLFVBQ3RJLENBQUM7QUFFRCxpQkFBTyxjQUFjLGNBQWMsSUFBSTtBQUFBLFFBQzNDO0FBQUEsUUFDQSxzQkFBc0IsS0FBSztBQUN2QixjQUFJLENBQUMsS0FBSztBQUNOO0FBQUEsVUFDSjtBQUNBLGNBQUksaUJBQWlCLFdBQVcsS0FBSyxjQUFjO0FBQ25ELGNBQUksaUJBQWlCLFNBQVMsS0FBSyxZQUFZO0FBQUEsUUFDbkQ7QUFBQSxRQUNBLHdCQUF3QixLQUFLO0FBQ3pCLGNBQUksQ0FBQyxLQUFLO0FBQ047QUFBQSxVQUNKO0FBQ0EsY0FBSSxvQkFBb0IsV0FBVyxLQUFLLGNBQWM7QUFDdEQsY0FBSSxvQkFBb0IsU0FBUyxLQUFLLFlBQVk7QUFBQSxRQUN0RDtBQUFBLFFBQ0Esb0JBQW9CLE1BQU07QUFDdEIsZUFBSyxtQkFBbUIsUUFBUSxDQUFDLFFBQVEsSUFBSSxHQUFHLElBQUksQ0FBQztBQUFBLFFBQ3pEO0FBQUEsTUFDSjtBQUNBLGNBQVEsa0JBQWtCO0FBSTFCLFVBQU0sY0FBTixNQUFNLGFBQVk7QUFBQSxRQUNkLFlBQVksS0FBSyxTQUFTO0FBQ3RCLGVBQUssUUFBUTtBQUNiLGVBQUssUUFBUTtBQUNiLGVBQUssVUFBVTtBQUNmLGVBQUssT0FBTztBQUNaLGVBQUssTUFBTTtBQUNYLGVBQUssTUFBTTtBQUNYLGVBQUssV0FBVztBQUNoQixlQUFLLFlBQVksWUFBWSxRQUFRLFlBQVksU0FBUyxTQUFTLFFBQVEsYUFBYTtBQUN4RixjQUFJLE9BQU8sUUFBUSxhQUFhO0FBQzVCO0FBQUEsVUFDSixXQUNTLE9BQU8sUUFBUSxVQUFVO0FBQzlCLGtCQUFNLE9BQU87QUFDYixrQkFBTSxLQUFLLFlBQVksR0FBRztBQUMxQixpQkFBSyxRQUFRLElBQUksU0FBUyxPQUFPO0FBQ2pDLGlCQUFLLFFBQVEsSUFBSSxTQUFTLE9BQU87QUFDakMsaUJBQUssVUFBVSxJQUFJLFNBQVMsU0FBUztBQUNyQyxpQkFBSyxPQUFPLElBQUksU0FBUyxNQUFNO0FBQy9CLGlCQUFLLE1BQU0sSUFBSSxTQUFTLEtBQUs7QUFFN0IsaUJBQUssTUFBTSxJQUNOLFFBQVEseUNBQXlDLEVBQUUsRUFDbkQsa0JBQWtCO0FBQUEsVUFDM0IsV0FDUyxlQUFlLGNBQWE7QUFDakMsaUJBQUssTUFBTSxLQUFLLEVBQUUsZ0JBQWdCLEtBQUssQ0FBQztBQUFBLFVBQzVDLE9BQ0s7QUFDRCxnQkFBSSxZQUFZLFFBQVEsWUFBWSxTQUFTLFNBQVMsUUFBUSxVQUFVO0FBQ3BFLGtCQUFJLE9BQU8sT0FBTztBQUNkLHFCQUFLLFFBQVEsSUFBSTtBQUFBLGNBQ3JCLE9BQ0s7QUFDRCxxQkFBSyxRQUFRLElBQUk7QUFBQSxjQUNyQjtBQUFBLFlBQ0o7QUFDQSxpQkFBSyxRQUFRLElBQUk7QUFDakIsaUJBQUssVUFBVSxJQUFJO0FBQ25CLGlCQUFLLE9BQU8sSUFBSTtBQUNoQixpQkFBSyxNQUFNLElBQUk7QUFDZixnQkFBSSxDQUFDLENBQUMsU0FBUyxRQUFRLFFBQVEsT0FBTyxTQUFTLEVBQUUsU0FBUyxJQUFJLEdBQUcsR0FBRztBQUNoRSxtQkFBSyxNQUFNLElBQUk7QUFBQSxZQUNuQjtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFPQSxNQUFNLFFBQVEsU0FBUztBQUNuQixnQkFBTSxrQkFBa0IsWUFBWSxRQUFRLFlBQVksU0FBUyxTQUFTLFFBQVEsbUJBQW1CO0FBQ3JHLGVBQUssZUFBZSxTQUFTLE9BQU8sT0FBTyxjQUFjO0FBQ3pELGVBQUssZUFBZSxTQUFTLE9BQU8sT0FBTyxjQUFjO0FBQ3pELGVBQUssZUFBZSxXQUFXLE9BQU8sU0FBUyxjQUFjO0FBQzdELGVBQUssZUFBZSxRQUFRLE9BQU8sTUFBTSxjQUFjO0FBQ3ZELGVBQUssZUFBZSxPQUFPLE9BQU8sS0FBSyxjQUFjO0FBQ3JELGVBQUssZUFBZSxPQUFPLE9BQU8sS0FBSyxjQUFjO0FBQ3JELGlCQUFPO0FBQUEsUUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1BLE9BQU8sUUFBUTtBQUNYLGNBQUksT0FBTyxXQUFXLFVBQVU7QUFDNUIscUJBQVMsSUFBSSxhQUFZLE1BQU07QUFBQSxVQUNuQztBQUVBLGNBQUksS0FBSyxVQUFVLE9BQU8sU0FDdEIsS0FBSyxRQUFRLE9BQU8sT0FDcEIsS0FBSyxJQUFJLFlBQVksTUFBTSxPQUFPLElBQUksWUFBWSxHQUFHO0FBQ3JELG1CQUFPO0FBQUEsVUFDWDtBQUVBLGNBQUksS0FBSyxTQUFTLE9BQU8sT0FBTztBQUM1QixnQkFBSSxPQUFPLE9BQU87QUFDZCxtQkFBSyxLQUFLLFNBQVMsS0FBSyxXQUFXLE9BQU8sU0FBUyxPQUFPLFNBQ3RELEtBQUssWUFBWSxPQUFPLFNBQVM7QUFDakMsdUJBQU87QUFBQSxjQUNYO0FBQUEsWUFDSixPQUNLO0FBQ0QsbUJBQUssS0FBSyxTQUFTLEtBQUssY0FBYyxPQUFPLFNBQVMsT0FBTyxZQUN6RCxLQUFLLFNBQVMsT0FBTyxNQUFNO0FBQzNCLHVCQUFPO0FBQUEsY0FDWDtBQUFBLFlBQ0o7QUFBQSxVQUNKLE9BQ0s7QUFDRCxnQkFBSSxLQUFLLFlBQVksT0FBTyxXQUFXLEtBQUssU0FBUyxPQUFPLE1BQU07QUFDOUQscUJBQU87QUFBQSxZQUNYO0FBQUEsVUFDSjtBQUNBLGlCQUFPO0FBQUEsUUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBSUEsU0FBUztBQUNMLGdCQUFNLFVBQVUsQ0FBQztBQUNqQixlQUFLLFNBQVMsUUFBUSxLQUFLLE9BQU87QUFDbEMsZUFBSyxTQUFTLFFBQVEsS0FBSyxPQUFPO0FBQ2xDLGVBQUssV0FBVyxRQUFRLEtBQUssU0FBUztBQUN0QyxlQUFLLFFBQVEsUUFBUSxLQUFLLE1BQU07QUFDaEMsZUFBSyxPQUFPLFFBQVEsS0FBSyxLQUFLO0FBQzlCLGVBQUssT0FBTyxRQUFRLEtBQUssS0FBSyxHQUFHO0FBQ2pDLGlCQUFPLFFBQVEsS0FBSyxHQUFHO0FBQUEsUUFDM0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUlBLGVBQWU7QUFDWCxnQkFBTSxNQUFNLEtBQUssT0FBTztBQUN4QixjQUFJLE9BQU8sT0FBTztBQUNkLG1CQUFPLElBQ0YsV0FBVyxXQUFXLFFBQUcsRUFDekIsV0FBVyxPQUFPLFFBQUcsRUFDckIsV0FBVyxTQUFTLFFBQUcsRUFDdkIsV0FBVyxRQUFRLFFBQUc7QUFBQSxVQUMvQixPQUNLO0FBQ0QsbUJBQU8sSUFDRixXQUFXLFdBQVcsTUFBTSxFQUM1QixXQUFXLE9BQU8sS0FBSyxFQUN2QixXQUFXLFNBQVMsT0FBTyxFQUMzQixXQUFXLFFBQVEsS0FBSztBQUFBLFVBQ2pDO0FBQUEsUUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBSUEsWUFBWSxLQUFLO0FBQ2IsY0FBSSxPQUFPLE9BQU87QUFDZCxtQkFBTyxJQUNGLFdBQVcsVUFBSyxTQUFTLEVBQ3pCLFdBQVcsVUFBSyxLQUFLLEVBQ3JCLFdBQVcsVUFBSyxPQUFPLEVBQ3ZCLFdBQVcsVUFBSyxNQUFNO0FBQUEsVUFDL0IsT0FDSztBQUNELG1CQUFPLElBQ0YsV0FBVyxRQUFRLFNBQVMsRUFDNUIsV0FBVyxPQUFPLEtBQUssRUFDdkIsV0FBVyxTQUFTLE9BQU8sRUFDM0IsV0FBVyxPQUFPLE1BQU07QUFBQSxVQUNqQztBQUFBLFFBQ0o7QUFBQSxRQUNBLGVBQWUsV0FBVyxPQUFPLGdCQUFnQjtBQUM3QyxjQUFJLGtCQUFrQixDQUFDLEtBQUssU0FBUyxHQUFHO0FBQ3BDLGlCQUFLLFNBQVMsSUFBSTtBQUFBLFVBQ3RCO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFDQSxjQUFRLGNBQWM7QUFBQTtBQUFBOzs7QUNqUnRCO0FBQUE7QUFBQTtBQUNBLGFBQU8sZUFBZSxTQUFTLGNBQWMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUM1RCxjQUFRLGNBQWM7QUFDdEIsVUFBTSxVQUFVO0FBTWhCLFVBQU0sY0FBTixjQUEwQixRQUFRLFVBQVU7QUFBQSxRQUN4QyxjQUFjO0FBQ1YsZ0JBQU07QUFDTixlQUFLLFNBQVMsQ0FBQztBQUFBLFFBQ25CO0FBQUEsUUFDQSxRQUFRLE1BQU07QUFDVixlQUFLLE9BQU8sS0FBSyxJQUFJO0FBQ3JCLGlCQUFPO0FBQUEsUUFDWDtBQUFBLFFBQ0EsU0FBUyxPQUFPO0FBQ1osZUFBSyxPQUFPLEtBQUssR0FBRyxLQUFLO0FBQ3pCLGlCQUFPO0FBQUEsUUFDWDtBQUFBLFFBQ0EsTUFBTSxLQUFLLEtBQUs7QUFDWixjQUFJLEVBQUUsUUFBUSxRQUFRLFFBQVEsU0FBUyxTQUFTLElBQUksY0FBYztBQUM5RCxrQkFBTSxJQUFJLE1BQU0sdUJBQXVCO0FBQUEsVUFDM0M7QUFDQSxnQkFBTSxRQUFRLElBQUksTUFBTSxJQUFJLFdBQVc7QUFDdkMsZ0JBQU0sTUFBTSxLQUFLLEtBQUssTUFBTTtBQUM1QixnQkFBTSxVQUFVLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDckMsa0JBQU0sT0FBTyxpQkFBaUIsa0JBQWtCLE1BQU0sUUFBUSxLQUFLLENBQUM7QUFBQSxVQUN4RSxDQUFDO0FBQ0QsZ0JBQU07QUFDTixpQkFBTztBQUFBLFFBQ1g7QUFBQSxRQUNBLE1BQU0sVUFBVSxLQUFLLE1BQU07QUFDdkIsY0FBSSxFQUFFLFFBQVEsUUFBUSxRQUFRLFNBQVMsU0FBUyxJQUFJLGNBQWM7QUFDOUQsa0JBQU0sSUFBSSxNQUFNLHVCQUF1QjtBQUFBLFVBQzNDO0FBQ0EsZ0JBQU0sUUFBUSxJQUFJLE1BQU0sSUFBSSxXQUFXO0FBQ3ZDLGdCQUFNLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQztBQUN2QixnQkFBTSxVQUFVLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDckMsa0JBQU0sT0FBTyxpQkFBaUIsa0JBQWtCLE1BQU0sUUFBUSxLQUFLLENBQUM7QUFBQSxVQUN4RSxDQUFDO0FBQ0QsZ0JBQU07QUFDTixpQkFBTztBQUFBLFFBQ1g7QUFBQSxNQUNKO0FBQ0EsY0FBUSxjQUFjO0FBQ3RCLFVBQU0sUUFBTixNQUFZO0FBQUEsUUFDUixJQUFJLFVBQVU7QUFDVixpQkFBTyxLQUFLLFFBQVEsY0FBYyxtQkFBbUI7QUFBQSxtQkFDMUMsS0FBSyxHQUFHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0EwRHhCO0FBQUEsUUFDQztBQUFBLFFBQ0EsSUFBSSxjQUFjO0FBQ2QsY0FBSSxDQUFDLEtBQUs7QUFDTixtQkFBTztBQUNYLGlCQUFPLEtBQUssT0FBTyxLQUFLLGFBQWE7QUFBQSxRQUN6QztBQUFBLFFBQ0EsSUFBSSxnQkFBZ0I7QUFDaEIsZ0JBQU0sT0FBTyxLQUFLO0FBQ2xCLGNBQUksRUFBRSxTQUFTLFFBQVEsU0FBUyxTQUFTLFNBQVMsS0FBSztBQUNuRCxtQkFBTztBQUNYLGNBQUk7QUFDSixjQUFJLE9BQU8sS0FBSyxZQUFZLFlBQVk7QUFDcEMsbUJBQU8sS0FBSyxRQUFRO0FBQUEsVUFDeEIsV0FDUyxPQUFPLEtBQUssWUFBWSxVQUFVO0FBQ3ZDLG1CQUFPLFNBQVMsY0FBYyxLQUFLLE9BQU87QUFBQSxVQUM5QyxXQUNTLENBQUMsS0FBSyxTQUFTO0FBQ3BCLG1CQUFPLFNBQVM7QUFBQSxVQUNwQixPQUNLO0FBQ0QsbUJBQU8sS0FBSztBQUFBLFVBQ2hCO0FBQ0EsaUJBQU87QUFBQSxRQUNYO0FBQUEsUUFDQSxJQUFJLFVBQVU7QUFDVixpQkFBTyxLQUFLLFVBQVUsS0FBSyxnQkFBZ0IsS0FBSyxPQUFPLFNBQVM7QUFBQSxRQUNwRTtBQUFBLFFBQ0EsSUFBSSxjQUFjO0FBQ2QsaUJBQU8sS0FBSyxVQUFVLEtBQUssZ0JBQWdCO0FBQUEsUUFDL0M7QUFBQSxRQUNBLElBQUksWUFBWTtBQUNaLGlCQUFPO0FBQUEsWUFDSCxRQUFRLEtBQUs7QUFBQSxZQUNiLE9BQU87QUFBQSxjQUNILE1BQU0sS0FBSztBQUFBLGNBQ1gsT0FBTyxLQUFLO0FBQUEsY0FDWixZQUFZO0FBQUEsWUFDaEI7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLFFBQ0EsSUFBSSxRQUFRO0FBQ1IsaUJBQU8sS0FBSztBQUFBLFFBQ2hCO0FBQUEsUUFDQSxZQUFZLEtBQUs7QUFDYixlQUFLLE1BQU0sU0FBUyxPQUFPLFVBQVUsYUFBYSxDQUFDO0FBQ25ELGVBQUssZUFBZSxDQUFDO0FBQ3JCLGVBQUssZUFBZSxNQUFNO0FBQ3RCLGtCQUFNRSxPQUFNLEtBQUs7QUFDakIsaUJBQUssT0FBTyxPQUFPQSxLQUFJLFVBQVVBLEtBQUksYUFBYSxJQUFJLEtBQUssT0FBTyxjQUFjLEdBQUdBLEtBQUksVUFBVUEsS0FBSSxjQUFjLElBQUksS0FBSyxPQUFPLGVBQWUsQ0FBQztBQUFBLFVBQ3ZKO0FBQ0EsZUFBSyxVQUFVO0FBQ2YsZUFBSyxXQUFXO0FBQ2hCLGVBQUssVUFBVTtBQUNmLGVBQUssWUFBWTtBQUNqQixlQUFLLGdCQUFnQjtBQUNyQixnQkFBTSxNQUFNLElBQUk7QUFDaEIsY0FBSSxVQUFVLEtBQUs7QUFDbkIsY0FBSSxTQUFTO0FBQ1QsZ0JBQUksZ0JBQWdCLE9BQU8sSUFBSSxXQUFXLFNBQVMsSUFBSSxDQUFDO0FBQUEsVUFDNUQ7QUFDQSxlQUFLLFNBQVMsSUFBSSxjQUFjLElBQUksS0FBSyxHQUFHLEVBQUU7QUFDOUMsZUFBSyxVQUFVLEtBQUssT0FBTyxjQUFjLHFCQUFxQjtBQUM5RCxlQUFLLFFBQVEsS0FBSyxPQUFPLGNBQWMsbUJBQW1CO0FBQzFELGVBQUssVUFBVSxLQUFLLE9BQU8sY0FBYyxxQkFBcUI7QUFDOUQsZUFBSyxZQUFZLEtBQUssT0FBTyxjQUFjLHVCQUF1QjtBQUNsRSxlQUFLLGVBQWUsS0FBSyxPQUFPLGNBQWMsZUFBZTtBQUM3RCxlQUFLLGNBQWMsS0FBSyxPQUFPLGNBQWMsY0FBYztBQUMzRCxlQUFLLGNBQWMsS0FBSyxPQUFPLGNBQWMsY0FBYztBQUMzRCxlQUFLLGFBQWEsaUJBQWlCLFNBQVMsWUFBWTtBQUNwRCxnQkFBSTtBQUNKLGlCQUFLLEtBQUssS0FBSyxpQkFBaUIsUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHLGNBQWM7QUFDOUUsb0JBQU0sS0FBSyxZQUFZLGFBQWEsS0FBSyxTQUFTO0FBQUEsWUFDdEQ7QUFDQSxpQkFBSyxNQUFNO0FBQUEsVUFDZixDQUFDO0FBQ0QsZUFBSyxZQUFZLGlCQUFpQixTQUFTLFlBQVk7QUFDbkQsZ0JBQUk7QUFDSixpQkFBSyxLQUFLLEtBQUssaUJBQWlCLFFBQVEsT0FBTyxTQUFTLFNBQVMsR0FBRyxhQUFhO0FBQzdFLG9CQUFNLEtBQUssWUFBWSxZQUFZLEtBQUssU0FBUztBQUFBLFlBQ3JEO0FBQ0EsaUJBQUssYUFBYTtBQUFBLFVBQ3RCLENBQUM7QUFDRCxlQUFLLFlBQVksaUJBQWlCLFNBQVMsWUFBWTtBQUNuRCxnQkFBSTtBQUNKLGlCQUFLLEtBQUssS0FBSyxpQkFBaUIsUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHLGFBQWE7QUFDN0Usb0JBQU0sS0FBSyxZQUFZLFlBQVksS0FBSyxTQUFTO0FBQUEsWUFDckQ7QUFDQSxpQkFBSyxTQUFTO0FBQUEsVUFDbEIsQ0FBQztBQUNELGVBQUssT0FBTyxpQkFBaUIsY0FBYyxLQUFLLGFBQWEsS0FBSyxJQUFJLENBQUM7QUFDdkUsZUFBSyxPQUFPLGlCQUFpQixlQUFlLEtBQUssY0FBYyxLQUFLLElBQUksQ0FBQztBQUN6RSxlQUFLLFFBQVEsaUJBQWlCLFVBQVUsS0FBSyxZQUFZO0FBQUEsUUFDN0Q7QUFBQSxRQUNBLE1BQU0sS0FBSyxPQUFPO0FBQ2QsY0FBSSxPQUFPO0FBQ1AsaUJBQUssU0FBUztBQUNkLGlCQUFLLGdCQUFnQjtBQUFBLFVBQ3pCO0FBQ0EsY0FBSSxRQUFRLEtBQUs7QUFDakIsZUFBSyxXQUFXO0FBQ2hCLGVBQUssVUFBVTtBQUNmLGVBQUssWUFBWTtBQUNqQixnQkFBTSxPQUFPLEtBQUs7QUFDbEIsY0FBSSxDQUFDO0FBQ0Q7QUFDSixnQkFBTSxPQUFPLEtBQUs7QUFDbEIsY0FBSSxLQUFLLGdCQUFnQjtBQUNyQixrQkFBTSxLQUFLLGVBQWUsS0FBSyxTQUFTO0FBQ3hDLGdCQUFJLFVBQVUsS0FBSyxlQUFlO0FBQzlCLG9CQUFNLEtBQUssS0FBSztBQUNoQjtBQUFBLFlBQ0o7QUFBQSxVQUNKO0FBQ0EsY0FBSSxLQUFLLFFBQVE7QUFDYixpQkFBSyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sS0FBSyxZQUFZLEVBQUUsRUFBRSxDQUFDO0FBQUEsVUFDdEQsT0FDSztBQUNELGlCQUFLLFlBQVksSUFBSTtBQUFBLFVBQ3pCO0FBQ0EsY0FBSSxHQUFHLElBQUk7QUFDWCxjQUFJLFdBQVcsS0FBSyxZQUFZO0FBQ2hDLGNBQUksYUFBYSxVQUFVO0FBQ3ZCLHVCQUFXO0FBQ1gsZ0JBQUksT0FBTyxhQUFhO0FBQ3hCLGdCQUFJLE9BQU8sY0FBYztBQUFBLFVBQzdCO0FBQ0EsZUFBSyxPQUFPLFVBQVUsTUFBTSxLQUFLLFlBQVksZUFBZSxHQUFHLEdBQUcsT0FBTyxLQUFLO0FBQUEsUUFDbEY7QUFBQSxRQUNBLE9BQU87QUFDSCxlQUFLLE9BQU8sVUFBVTtBQUFBLFFBQzFCO0FBQUEsUUFDQSxRQUFRO0FBQ0osZUFBSyxVQUFVO0FBQ2YsZUFBSyxLQUFLO0FBQ1YsZUFBSyxTQUFTO0FBQUEsUUFDbEI7QUFBQSxRQUNBLE9BQU8sV0FBVztBQUNkLGNBQUksQ0FBQyxLQUFLLFFBQVE7QUFDZCxpQkFBSyxLQUFLO0FBQ1Y7QUFBQSxVQUNKO0FBQ0EsY0FBSSxZQUFZO0FBQ1osd0JBQVk7QUFDaEIsY0FBSSxDQUFDLEtBQUssT0FBTyxTQUFTLEdBQUc7QUFDekIsaUJBQUssZ0JBQWdCLEtBQUssT0FBTztBQUNqQyxpQkFBSyxLQUFLO0FBQ1Y7QUFBQSxVQUNKO0FBQ0EsZUFBSyxZQUFZO0FBQ2pCLGVBQUssV0FBVztBQUNoQixlQUFLLEtBQUs7QUFDVixlQUFLLFdBQVc7QUFDaEIsZUFBSyxZQUFZO0FBQ2pCLGVBQUssZ0JBQWdCO0FBQ3JCLGVBQUssS0FBSztBQUFBLFFBQ2Q7QUFBQSxRQUNBLFdBQVc7QUFDUCxlQUFLLE9BQU8sS0FBSyxnQkFBZ0IsQ0FBQztBQUFBLFFBQ3RDO0FBQUEsUUFDQSxlQUFlO0FBQ1gsZUFBSyxPQUFPLEtBQUssZ0JBQWdCLENBQUM7QUFBQSxRQUN0QztBQUFBLFFBQ0EsZUFBZTtBQUNYLGNBQUksQ0FBQyxLQUFLO0FBQ047QUFDSixnQkFBTSxPQUFPLEtBQUs7QUFDbEIsY0FBSSxDQUFDO0FBQ0Q7QUFDSixlQUFLLFFBQVEsWUFBWSxLQUFLLFNBQVM7QUFDdkMsZUFBSyxNQUFNLFlBQVksS0FBSyxlQUFlO0FBQzNDLGVBQUssT0FBTyxpQkFBaUIscUJBQXFCLEVBQUUsUUFBUSxDQUFDLFNBQVM7QUFDbEUsaUJBQUssU0FBUztBQUNkLGlCQUFLLFdBQVc7QUFBQSxVQUNwQixDQUFDO0FBQ0QsY0FBSSxjQUFjLEtBQUs7QUFDdkIsY0FBSSxDQUFDLGFBQWE7QUFDZCwwQkFBYyxDQUFDO0FBQ2YsZ0JBQUksS0FBSyxhQUFhO0FBQ2xCLDBCQUFZLEtBQUssTUFBTTtBQUFBLFlBQzNCO0FBQ0EsZ0JBQUksS0FBSyxTQUFTO0FBQ2QsMEJBQVksS0FBSyxNQUFNO0FBQUEsWUFDM0IsT0FDSztBQUNELDBCQUFZLEtBQUssT0FBTztBQUFBLFlBQzVCO0FBQUEsVUFDSjtBQUNBLGNBQUksZ0JBQWdCLFFBQVEsZ0JBQWdCLFNBQVMsU0FBUyxZQUFZLFFBQVE7QUFDOUUsd0JBQVksUUFBUSxDQUFDLFFBQVE7QUFDekIsbUJBQUssT0FBTyxjQUFjLElBQUksR0FBRyxTQUFTLEVBQUUsU0FBUztBQUFBLFlBQ3pELENBQUM7QUFBQSxVQUNMO0FBQ0EsY0FBSSxLQUFLLGdCQUFnQjtBQUNyQixpQkFBSyxlQUFlLFFBQVEsQ0FBQyxRQUFRO0FBQ2pDLG1CQUFLLE9BQU8sY0FBYyxJQUFJLEdBQUcsU0FBUyxFQUFFLFdBQVc7QUFBQSxZQUMzRCxDQUFDO0FBQUEsVUFDTDtBQUNBLGNBQUksS0FBSyxjQUFjO0FBQ25CLGlCQUFLLFVBQVUsU0FBUztBQUN4QixpQkFBSyxVQUFVLGNBQ1gsS0FBSyxnQkFBZ0IsR0FBRyxLQUFLLGdCQUFnQixDQUFDLElBQUksS0FBSyxPQUFPLE1BQU07QUFBQSxVQUM1RSxPQUNLO0FBQ0QsaUJBQUssVUFBVSxTQUFTO0FBQUEsVUFDNUI7QUFDQSxlQUFLLGFBQWEsUUFBUSxLQUFLLGdCQUFnQjtBQUMvQyxlQUFLLFlBQVksUUFBUSxLQUFLLGVBQWU7QUFDN0MsZUFBSyxZQUFZLFFBQVEsS0FBSyxlQUFlO0FBQzdDLGNBQUksS0FBSyxVQUFVO0FBQ2YsaUJBQUssU0FBUyxLQUFLLFNBQVM7QUFBQSxVQUNoQztBQUNBLGNBQUksS0FBSyxhQUFhLFVBQVU7QUFDNUIsaUJBQUssYUFBYTtBQUNsQixpQkFBSyxRQUFRLFdBQVcsS0FBSyxjQUFjLEVBQUU7QUFBQSxVQUNqRDtBQUFBLFFBQ0o7QUFBQSxRQUNBLE1BQU0sZ0JBQWdCO0FBQ2xCLGVBQUssWUFBWTtBQUNqQixlQUFLLFFBQVEsWUFBWTtBQUN6QixlQUFLLE1BQU0sWUFBWTtBQUN2QixlQUFLLFVBQVUsY0FBYztBQUM3QixjQUFJLENBQUMsS0FBSztBQUNOO0FBQ0osZ0JBQU0sT0FBTyxLQUFLO0FBQ2xCLGNBQUksUUFBUSxLQUFLLFFBQVE7QUFDckIsa0JBQU0sS0FBSyxPQUFPLEtBQUssU0FBUztBQUFBLFVBQ3BDO0FBQ0EsY0FBSSxDQUFDLEtBQUssYUFBYSxLQUFLLFdBQVcsQ0FBQyxLQUFLLFVBQVU7QUFDbkQsaUJBQUssT0FBTyxjQUFjLElBQUksS0FBSyxRQUFRLFlBQVksZ0JBQWdCLENBQUM7QUFDeEUsaUJBQUssT0FBTyxPQUFPO0FBQ25CLGlCQUFLLFFBQVEsb0JBQW9CLFVBQVUsS0FBSyxZQUFZO0FBQzVEO0FBQUEsVUFDSjtBQUNBLGNBQUksS0FBSyxXQUFXO0FBQ2hCLGlCQUFLLFNBQVM7QUFBQSxVQUNsQjtBQUFBLFFBQ0o7QUFBQSxRQUNBLFlBQVksZUFBZTtBQUN2QixnQkFBTSxPQUFPLGtCQUFrQixRQUFRLGtCQUFrQixTQUFTLFNBQVMsY0FBYyxrQkFBa0IsS0FBSyxRQUFRO0FBQ3hILGdCQUFNLEtBQUs7QUFDWCxnQkFBTSxNQUFNLElBQUksZ0JBQWdCLElBQUksS0FBSztBQUN6QyxjQUFJLEtBQUs7QUFDVCxjQUFJLE1BQU0sV0FBVztBQUNyQixjQUFJLE1BQU0sTUFBTTtBQUNoQixjQUFJLE1BQU0sT0FBTztBQUNqQixjQUFJLE1BQU0sUUFBUTtBQUNsQixjQUFJLE1BQU0sU0FBUztBQUNuQixjQUFJLE1BQU0sU0FBUztBQUNuQixnQkFBTSxPQUFPLElBQUksZ0JBQWdCLElBQUksTUFBTTtBQUMzQyxlQUFLLEtBQUs7QUFDVixnQkFBTSxXQUFXLElBQUksZ0JBQWdCLElBQUksTUFBTTtBQUMvQyxtQkFBUyxhQUFhLEtBQUssR0FBRztBQUM5QixtQkFBUyxhQUFhLEtBQUssR0FBRztBQUM5QixtQkFBUyxhQUFhLFNBQVMsTUFBTTtBQUNyQyxtQkFBUyxhQUFhLFVBQVUsTUFBTTtBQUN0QyxtQkFBUyxhQUFhLFFBQVEsT0FBTztBQUNyQyxlQUFLLFlBQVksUUFBUTtBQUN6QixjQUFJLGVBQWU7QUFDZixrQkFBTSxPQUFPLGNBQWMsc0JBQXNCO0FBQ2pELGtCQUFNLGFBQWEsSUFBSSxnQkFBZ0IsSUFBSSxNQUFNO0FBQ2pELHVCQUFXLGFBQWEsS0FBSyxLQUFLLEtBQUssU0FBUyxDQUFDO0FBQ2pELHVCQUFXLGFBQWEsS0FBSyxLQUFLLElBQUksU0FBUyxDQUFDO0FBQ2hELHVCQUFXLGFBQWEsU0FBUyxLQUFLLE1BQU0sU0FBUyxDQUFDO0FBQ3RELHVCQUFXLGFBQWEsVUFBVSxLQUFLLE9BQU8sU0FBUyxDQUFDO0FBQ3hELHVCQUFXLGFBQWEsUUFBUSxPQUFPO0FBQ3ZDLGlCQUFLLFlBQVksVUFBVTtBQUFBLFVBQy9CO0FBQ0EsZ0JBQU0sYUFBYSxJQUFJLGdCQUFnQixJQUFJLE1BQU07QUFDakQscUJBQVcsYUFBYSxLQUFLLEdBQUc7QUFDaEMscUJBQVcsYUFBYSxLQUFLLEdBQUc7QUFDaEMscUJBQVcsYUFBYSxTQUFTLE1BQU07QUFDdkMscUJBQVcsYUFBYSxVQUFVLE1BQU07QUFDeEMscUJBQVcsYUFBYSxRQUFRLFlBQVk7QUFDNUMscUJBQVcsYUFBYSxXQUFXLEtBQUs7QUFDeEMsY0FBSSxZQUFZLElBQUk7QUFDcEIsY0FBSSxZQUFZLFVBQVU7QUFDMUIsZUFBSyxhQUFhLEtBQUssSUFBSSxRQUFRLEdBQUcsQ0FBQztBQUN2QyxjQUFJLGdCQUFnQixZQUFZLEdBQUc7QUFBQSxRQUN2QztBQUFBLFFBQ0EsY0FBYztBQUNWLGVBQUssYUFBYSxRQUFRLENBQUMsUUFBUTtBQUMvQixrQkFBTSxPQUFPLElBQUksTUFBTTtBQUN2QixnQkFBSSxNQUFNO0FBQ04sbUJBQUssT0FBTztBQUFBLFlBQ2hCO0FBQUEsVUFDSixDQUFDO0FBQ0QsZUFBSyxlQUFlLENBQUM7QUFBQSxRQUN6QjtBQUFBLE1BQ0o7QUFBQTtBQUFBOzs7QUMvWUE7QUFBQTtBQUFBO0FBQ0EsYUFBTyxlQUFlLFNBQVMsY0FBYyxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQzVELGNBQVEsZ0JBQWdCO0FBQ3hCLFVBQU0sVUFBVTtBQUNoQixVQUFNLE9BQU87QUFDYixVQUFNLFdBQVc7QUFDakIsVUFBTSxlQUFlO0FBQ3JCLFVBQU0sYUFBYTtBQUNuQixVQUFNLFdBQVc7QUFDakIsVUFBTSxvQkFBb0I7QUFDMUIsVUFBTSxtQkFBbUI7QUFDekIsVUFBTSxTQUFTO0FBQ2YsVUFBTSxtQkFBbUI7QUFDekIsVUFBTSxhQUFhO0FBQ25CLFVBQU0sY0FBYztBQUNwQixVQUFNLGVBQWU7QUFDckIsVUFBTSxtQkFBbUI7QUFDekIsVUFBTSxxQkFBcUI7QUFDM0IsVUFBTSxXQUFXO0FBQ2pCLFVBQU0sbUJBQW1CO0FBQ3pCLFVBQU0sY0FBYztBQUNwQixVQUFNLFlBQVk7QUFDbEIsVUFBTSxjQUFjO0FBQ3BCLFVBQU0sYUFBYTtBQUNuQixVQUFNLFVBQVU7QUFDaEIsVUFBTSxVQUFVO0FBTWhCLFVBQU1DLGlCQUFOLGNBQTRCLFFBQVEsVUFBVTtBQUFBLFFBQzFDLGNBQWM7QUFDVixnQkFBTTtBQUNOLGVBQUssS0FBSyxJQUFJLEtBQUssT0FBTyxJQUFJO0FBQzlCLGVBQUssU0FBUyxJQUFJLFNBQVMsV0FBVyxJQUFJO0FBQzFDLGVBQUssYUFBYSxJQUFJLGFBQWEsZUFBZSxJQUFJO0FBQ3RELGVBQUssYUFBYSxJQUFJLFlBQVksaUJBQWlCLElBQUk7QUFDdkQsZUFBSyxXQUFXLElBQUksV0FBVyxnQkFBZ0IsSUFBSTtBQUNuRCxlQUFLLFVBQVUsSUFBSSxVQUFVLGVBQWUsSUFBSTtBQUNoRCxlQUFLLFdBQVcsSUFBSSxXQUFXLGdCQUFnQixJQUFJO0FBQ25ELGVBQUssU0FBUyxJQUFJLFNBQVMsY0FBYyxJQUFJO0FBQzdDLGVBQUssa0JBQWtCLElBQUksa0JBQWtCLHVCQUF1QixJQUFJO0FBQ3hFLGVBQUssaUJBQWlCLElBQUksaUJBQWlCLHNCQUFzQixJQUFJO0FBQ3JFLGVBQUssaUJBQWlCLElBQUksaUJBQWlCLHNCQUFzQixJQUFJO0FBQ3JFLGVBQUssT0FBTyxJQUFJLE9BQU8sWUFBWSxJQUFJO0FBQ3ZDLGVBQUssaUJBQWlCLElBQUksaUJBQWlCLHNCQUFzQixJQUFJO0FBQ3JFLGVBQUssV0FBVyxJQUFJLFdBQVcsZ0JBQWdCLElBQUk7QUFDbkQsZUFBSyxhQUFhLEdBQUcsUUFBUSxnQkFBZ0IsWUFBWSxpQkFBaUIsSUFBSTtBQUM5RSxlQUFLLGNBQWMsR0FBRyxRQUFRLGdCQUFnQixhQUFhLGtCQUFrQixJQUFJO0FBQ2pGLGVBQUssU0FBUyxHQUFHLFFBQVEsZ0JBQWdCLFFBQVEsYUFBYSxJQUFJO0FBQ2xFLGVBQUssa0JBQWtCLEdBQUcsUUFBUSxnQkFBZ0IsaUJBQWlCLHNCQUFzQixJQUFJO0FBQzdGLGVBQUssb0JBQW9CLEdBQUcsUUFBUSxnQkFBZ0IsbUJBQW1CLHdCQUF3QixJQUFJO0FBQ25HLGVBQUssVUFBVSxHQUFHLFFBQVEsZ0JBQWdCLFNBQVMsY0FBYyxJQUFJO0FBQ3JFLGVBQUssbUJBQW1CLEdBQUcsUUFBUSxnQkFBZ0IsWUFBWSxpQkFBaUIsSUFBSTtBQUNwRixlQUFLLFNBQVMsR0FBRyxRQUFRLGdCQUFnQixRQUFRLGFBQWEsSUFBSTtBQUFBLFFBQ3RFO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFJQSxnQkFBZ0I7QUFDWixXQUFDLEdBQUcsUUFBUSxZQUFZLElBQUk7QUFBQSxRQUNoQztBQUFBLE1BQ0o7QUFDQSxjQUFRLGdCQUFnQkE7QUFDeEIsY0FBUSxVQUFVQTtBQUFBO0FBQUE7OztBQ2pFbEIsTUFBQUMsZ0NBQTBDOzs7QUNBMUMscUNBQTJDO0FBRXBDLFdBQVMsVUFBVSxLQUFhO0FBQ3JDLGVBQU8sNkJBQUFDLFdBQWMsS0FBSyxvQkFBb0I7QUFBQSxFQUNoRDs7O0FDSkEsTUFBQUMsZ0NBQThCO0FBRzlCLE1BQU0sYUFBTixNQUFpQjtBQUFBLElBUWYsY0FBYztBQU5kLFdBQVEsU0FBUztBQUFBLFFBQ2YsZ0JBQWdCO0FBQUEsUUFDaEIsVUFBVTtBQUFBLFFBQ1YsbUJBQW1CO0FBQUEsTUFDckI7QUFHRSxXQUFLLFVBQVUsSUFBSSw0Q0FBYztBQUFBLElBQ25DO0FBQUEsSUFFQSxNQUFNLG1CQUFtQixPQUFxQztBQUM1RCxVQUFJLENBQUMsTUFBTSxRQUFRO0FBQ2pCLGFBQUssVUFBVSxzQ0FBc0M7QUFDckQ7QUFBQSxNQUNGO0FBRUEsWUFBTSxpQkFBaUIsS0FBSyxRQUFRLGtCQUFrQixpQkFBaUI7QUFDdkUscUJBQWUsS0FBSztBQUVwQixVQUFJO0FBQ0YsbUJBQVcsUUFBUSxPQUFPO0FBQ3hCLGNBQUksS0FBSyxhQUFhLEtBQUssS0FBSywwQkFBMEIsbUJBQW1CO0FBQzNFLGlCQUFLLFFBQVEsSUFBSSxtQkFBbUIsS0FBSyxTQUFTLE9BQU8sQ0FBQyxFQUFFO0FBRTVELGtCQUFNLFdBQVcsTUFBTSxLQUFLLGlCQUFpQjtBQUM3QyxnQkFBSSxDQUFDLFVBQVU7QUFDYixtQkFBSyxRQUFRLElBQUksaUNBQWlDO0FBQ2xEO0FBQUEsWUFDRjtBQUdBLGtCQUFNLFVBQVUsSUFBSSxPQUFPLEtBQUssZ0JBQWdCO0FBR2hELGtCQUFNLGFBQWEsSUFBSSxPQUFPLFVBQVUsV0FBVztBQUNuRCx1QkFBVyxpQkFBaUI7QUFDNUIsa0JBQU0sa0JBQWtCLE1BQU0sV0FBVyxVQUFVO0FBRW5ELGdCQUFJLGlCQUFpQixTQUFTLEdBQUc7QUFDL0IscUJBQU8sUUFBUSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU07QUFDM0Qsb0JBQUksUUFBUSxZQUFZO0FBQ3RCLDBCQUFRLFNBQVMsS0FBb0MsS0FBSztBQUFBLGdCQUM1RDtBQUFBLGNBQ0YsQ0FBQztBQUVELG9CQUFNLFFBQVEsT0FBTztBQUNyQixtQkFBSyxXQUFXLFFBQVE7QUFDeEIsb0JBQU0sS0FBSyxPQUFPO0FBRWxCLG1CQUFLLFFBQVEsSUFBSSxxQ0FBcUM7QUFBQSxZQUN4RCxPQUFPO0FBQ0wsbUJBQUssUUFBUSxJQUFJLGdDQUFnQztBQUFBLFlBQ25EO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGLFNBQVMsT0FBTztBQUNkLGFBQUssVUFBVSwwQkFBMEIsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSyxDQUFDLEVBQUU7QUFDakcsYUFBSyxRQUFRLElBQUksZ0NBQWdDLGlCQUFpQixRQUFRLE1BQU0sUUFBUSxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQUEsTUFDekcsVUFBRTtBQUNBLGNBQU0sT0FBTyxRQUFRLE1BQU0sR0FBSTtBQUMvQix1QkFBZSxNQUFNO0FBQUEsTUFDdkI7QUFBQSxJQUNGO0FBQUEsSUFFQSxNQUFNLGFBQWEsT0FBcUM7QUFDdEQsVUFBSSxDQUFDLE1BQU0sUUFBUTtBQUNqQixhQUFLLFVBQVUseUNBQXlDO0FBQ3hEO0FBQUEsTUFDRjtBQUVBLFlBQU0saUJBQWlCLEtBQUssUUFBUSxrQkFBa0Isb0JBQW9CO0FBQzFFLHFCQUFlLEtBQUs7QUFFcEIsVUFBSTtBQUNGLG1CQUFXLFFBQVEsT0FBTztBQUd4QixlQUFLLFFBQVEsSUFBSSxzQkFBc0IsS0FBSyxTQUFTLE9BQU8sQ0FBQyxFQUFFO0FBQUEsUUFDakU7QUFBQSxNQUNGLFNBQVMsT0FBTztBQUNkLGFBQUssVUFBVSw2QkFBNkIsaUJBQWlCLFFBQVEsTUFBTSxVQUFVLE9BQU8sS0FBSyxDQUFDLEVBQUU7QUFDcEcsYUFBSyxRQUFRLElBQUksMEJBQTBCLGlCQUFpQixRQUFRLE1BQU0sUUFBUSxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQUEsTUFDbkcsVUFBRTtBQUNBLGNBQU0sT0FBTyxRQUFRLE1BQU0sR0FBSTtBQUMvQix1QkFBZSxNQUFNO0FBQUEsTUFDdkI7QUFBQSxJQUNGO0FBQUEsSUFFUSxVQUFVLFNBQXVCO0FBQ3ZDLFlBQU0saUJBQWlCLEtBQUssUUFBUSxrQkFBa0IsT0FBTztBQUM3RCxxQkFBZSxXQUFXO0FBQUEsUUFDeEIsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1IsQ0FBQztBQUNELHFCQUFlLEtBQUs7QUFDcEIscUJBQWUsZ0JBQWdCLEdBQUk7QUFBQSxJQUNyQztBQUFBLEVBQ0Y7QUFFQSxNQUFPLHFCQUFRLElBQUksV0FBVzs7O0FGbkc5QixNQUFNLG1CQUFOLE1BQXVCO0FBQUEsSUFBdkI7QUFDRSxXQUFRLE9BQU87QUFBQSxRQUNiLE9BQU87QUFBQSxRQUNQLFNBQVMsSUFBSSw0Q0FBYztBQUFBLE1BQzdCO0FBQUE7QUFBQTtBQUFBLElBR0EsTUFBYSxZQUFZO0FBQ3ZCLFlBQU0sS0FBSyxzQkFBc0I7QUFDakMsV0FBSyxrQkFBa0I7QUFBQSxJQUN6QjtBQUFBO0FBQUEsSUFHQSxNQUFhLGFBQWE7QUFDeEIsV0FBSyxLQUFLLFFBQVE7QUFFbEIsZ0JBQU0sMENBQVc7QUFBQSxJQUNuQjtBQUFBLElBRUEsTUFBYyx3QkFBd0I7QUFBQSxJQUV0QztBQUFBLElBRVEsb0JBQW9CO0FBQzFCLFVBQUksT0FBTyxnQkFBZ0IsT0FBTyxhQUFhLFdBQVc7QUFDeEQsY0FBTSxrQkFBa0IsT0FBTyxhQUFhLFVBQVU7QUFFdEQsZUFBTyxhQUFhLFVBQVUsVUFBVSxTQUFTLE9BQU87QUFDdEQsZ0JBQU0saUJBQWlCLGdCQUFnQixNQUFNLE1BQU0sU0FBUztBQUU1RCxjQUFJO0FBRUYsa0JBQU0sUUFBUSxPQUFPLG9CQUFvQixFQUFFLGlCQUFpQjtBQUM1RCxnQkFBSSxNQUFNLFFBQVE7QUFDaEIsb0JBQU0sT0FBTyxZQUFZLFNBQVMsaUJBQWlCLGVBQWUsQ0FBQztBQUVuRSxvQkFBTSxrQkFBa0IsU0FBUyxpQkFBaUIsVUFBVTtBQUM1RCw4QkFBZ0IsYUFBYSxTQUFTLFVBQVUsd0JBQXdCLENBQUM7QUFDekUsOEJBQWdCLGlCQUFpQixXQUFXLE1BQU0sbUJBQVcsYUFBYSxLQUFLLENBQUM7QUFDaEYsb0JBQU0sT0FBTyxZQUFZLGVBQWU7QUFFeEMsb0JBQU0sc0JBQXNCLFNBQVMsaUJBQWlCLFVBQVU7QUFDaEUsa0NBQW9CLGFBQWEsU0FBUyxVQUFVLDRCQUE0QixDQUFDO0FBQ2pGLGtDQUFvQixpQkFBaUIsV0FBVyxNQUFNLG1CQUFXLG1CQUFtQixLQUFLLENBQUM7QUFDMUYsb0JBQU0sT0FBTyxZQUFZLG1CQUFtQjtBQUFBLFlBQzlDO0FBQUEsVUFDRixTQUFTLEdBQUc7QUFDVixpQkFBSyxLQUFLLFFBQVEsSUFBSSxzQ0FBc0MsQ0FBQztBQUFBLFVBQy9EO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUEsTUFBTyxjQUFRLElBQUksaUJBQWlCOyIsCiAgIm5hbWVzIjogWyJab3Rlcm8iLCAid2luZG93IiwgIlpvdGVybyIsICJab3Rlcm8iLCAibW9kdWxlIiwgInVucmVnaXN0ZXIiLCAid2luZG93IiwgIlpvdGVybyIsICJlIiwgIlpvdGVybyIsICJyZXF1aXJlX3BhdGNoIiwgIlpvdGVybyIsICJab3Rlcm8iLCAid2luZG93IiwgImUiLCAid2luZG93IiwgIndpbmRvdyIsICJNZW51U2VsZWN0b3IiLCAiWm90ZXJvIiwgIndpbmRvdyIsICJfYSIsICJab3Rlcm8iLCAid2luZG93IiwgIlhVTF9LRVlDT0RFX01BUFMiLCAid2luZG93IiwgIlpvdGVybyIsICJab3Rlcm8iLCAiX2EiLCAiX2IiLCAiZGlhbG9nRGF0YSIsICJfYyIsICJocmVmIiwgIlpvdGVybyIsICJab3Rlcm8iLCAid2luZG93IiwgIndpbiIsICJab3Rlcm9Ub29sa2l0IiwgImltcG9ydF96b3Rlcm9fcGx1Z2luX3Rvb2xraXQiLCAiZ2V0U3RyaW5nQmFzZSIsICJpbXBvcnRfem90ZXJvX3BsdWdpbl90b29sa2l0Il0KfQo=
