var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
//export interface DotNetInterface {
//    invokeMethodAsync(...args: any[]): any;
//}
//export function DefineClass(name: string, f: any){
//}
(function () {
    var instances = {};
    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }
    Define("class", function () {
        var _a;
        var args = Array.prototype.slice.call(arguments);
        var className = args[0];
        var instanceId = args[1];
        var methodName = camelize(args[2]);
        var parameters = args[3];
        if (methodName === "constructor") {
            instances[className] = instances[className] || {};
            instances[className][instanceId] = new ((_a = window["lt"][className]).bind.apply(_a, __spreadArrays([void 0], parameters)))();
        }
        else {
            var _class = instances[className][instanceId];
            var method = _class[methodName];
            return method.apply(_class, parameters);
        }
    });
})();
Define("assets", function (links, scripts, asset) {
    var head = document.head;
    //@ts-ignore
    var existingLinks = Array.from(head.getElementsByTagName("link"));
    var _loop_1 = function (link) {
        if (!existingLinks.some(function (lk) { return lk.href === document.location.origin + link || lk.href === link; })) {
            var newlk = document.createElement("link");
            newlk.href = link;
            newlk.rel = "stylesheet";
            newlk.type = "text/css";
            head.appendChild(newlk);
        }
    };
    for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
        var link = links_1[_i];
        _loop_1(link);
    }
    var _loop_2 = function (link) {
        if (!links.some(function (lk) { return document.location.origin + lk === link.href || lk === link.href; })) {
            if (!link.hasAttribute("static"))
                link.remove();
        }
    };
    for (var _a = 0, existingLinks_1 = existingLinks; _a < existingLinks_1.length; _a++) {
        var link = existingLinks_1[_a];
        _loop_2(link);
    }
    //@ts-ignore
    var existingScripts = Array.from(head.getElementsByTagName("script"));
    var _loop_3 = function (script) {
        if (!existingScripts.some(function (sc) { return sc.src === document.location.origin + script || sc.src === script; })) {
            var newsc = document.createElement("script");
            newsc.type = "text/javascript";
            head.appendChild(newsc);
            if (asset) {
                newsc.onload = function () {
                    asset.invokeMethodAsync("Loaded", script);
                };
            }
            newsc.src = script;
        }
        else {
            if (asset) {
                asset.invokeMethodAsync("Loaded", script);
            }
        }
    };
    for (var _b = 0, scripts_1 = scripts; _b < scripts_1.length; _b++) {
        var script = scripts_1[_b];
        _loop_3(script);
    }
    var _loop_4 = function (script) {
        if (!scripts.some(function (sc) { return document.location.origin + sc === script.src || sc === script.src; })) {
            if (!script.hasAttribute("static"))
                script.remove();
        }
    };
    for (var _c = 0, existingScripts_1 = existingScripts; _c < existingScripts_1.length; _c++) {
        var script = existingScripts_1[_c];
        _loop_4(script);
    }
    var loading = document.getElementById("loading");
    if (loading) {
        loading.remove();
    }
    var app = (document.getElementsByTagName("app").item(0));
    app.style.display = "";
});
/// <reference path="../../Assets/Assets.razor.ts"></reference>
Define("boxInit", function (box, dom) {
    var obox = {};
    window.addEventListener("resize", function () {
        var _box = dom.getBoundingClientRect();
        _box.scrollWidth = dom.scrollWidth;
        _box.scrollHeight = dom.scrollHeight;
        //const w = dom.clientWidth;
        //const h = dom.clientHeight;
        //const sw = dom.scrollWidth;
        //const sh = dom.scrollHeight;
        if (obox.width !== _box.width || obox.height !== _box.height || obox.scrollWidth !== _box.scrollWidth || obox.scrollHeight !== _box.scrollHeight) {
            box.invokeMethodAsync("SetDimension", _box);
            obox = _box;
        }
    });
    var _box = dom.getBoundingClientRect();
    obox = box;
    _box.scrollWidth = dom.scrollWidth;
    _box.scrollHeight = dom.scrollHeight;
    box.invokeMethodAsync("SetDimension", _box);
});
//import * as Chart from '../../../../../node_modules/@types/chart.js/index.d'; 
/// <reference path="../../../../../node_modules/@types/chart.js/index.d.ts" />
/// <reference path="../../Assets/Assets.razor.ts" />
Define("chartjs", function () {
    var ChartJs = /** @class */ (function () {
        function ChartJs(canvas, parameters) {
            this.canvas = canvas;
            this.chart = new Chart(canvas.getContext("2d"), parameters);
        }
        ChartJs.prototype.update = function (parameter) {
            if (parameter.data)
                this.chart.data = parameter.data;
            if (parameter.options)
                this.chart.options = parameter.options;
            this.chart.update();
        };
        ChartJs.prototype.live = function (x, y, removeFirst) {
            this.chart.data.labels.push(x);
            if (removeFirst) {
                this.chart.config.data.labels.shift();
            }
            // this.chart.config.data.labels.push(Time(value.dateCreated));
            this.chart.data.datasets.forEach(function (dataset, i) {
                if (removeFirst) {
                    dataset.data.shift();
                }
                dataset.data.push(y[i]);
            });
            this.chart.update();
        };
        return ChartJs;
    }());
    var charts = {};
    this.create = function (id, canvas, parameters) {
        var chart = new ChartJs(canvas, parameters);
        charts[id] = chart;
    };
    this.update = function (id, parameters) {
        var chart = charts[id];
        chart.update(parameters);
    };
    this.live = function (id, x, y, removeFirst) {
        var chart = charts[id];
        chart.live(x, y, removeFirst);
    };
    return this;
}.call({}));
/// <reference path="../../Assets/Assets.razor.ts"></reference>
Define("displaySequenceInit", function (dotnetComponent, domElement) {
    domElement.addEventListener("animationend", function () {
        dotnetComponent.invokeMethodAsync("Next");
    });
});
/// <reference path="../../Assets/Assets.razor.ts"></reference>
Define("TypeScriptContentEditable", (function () {
    var ContentEditable = /** @class */ (function () {
        function ContentEditable(input, element, textarea) {
            this.input = input;
            this.element = element;
            var wrapper = document.createElement("span");
            wrapper.className = "wrapper mahx-5 scroll d-i-block";
            var ne = element.cloneNode(true);
            wrapper.appendChild(ne);
            element.parentElement.insertBefore(wrapper, element.nextSibling);
            //ne.addEventListener("input", (ev) => {
            //    input.invokeMethodAsync("Inputted", ne.innerHTML);
            //});
            if (!textarea) {
                ne.addEventListener("keydown", function (ev) {
                    ev.stopPropagation();
                    if (ev.code === "Enter") {
                        input.invokeMethodAsync("Inputted", ne.innerText);
                    }
                });
            }
            ne.addEventListener("keyup", function (ev) {
                ev.stopPropagation();
            });
            var ok = document.createElement("i");
            ok.className = "mdi mdi-check-bold lt clickable canclick";
            wrapper.appendChild(ok);
            ne.focus();
            ok.addEventListener("click", function () {
                if (!textarea) {
                    input.invokeMethodAsync("Inputted", ne.innerText);
                }
                else {
                    input.invokeMethodAsync("Inputted", ne.innerHTML);
                }
            });
            element.remove();
            if (textarea) {
                wrapper.scrollIntoView();
            }
            //element.addEventListener("input", (ev) => {
            //    input.invokeMethodAsync("Inputted", element.innerHTML);
            //});
        }
        ContentEditable.prototype.executeCommand = function (commandName, _arguments) {
            document.execCommand(commandName, true, _arguments);
        };
        return ContentEditable;
    }());
    return ContentEditable;
})());
/// <reference path="../../Assets/Assets.razor.ts"/>
/// <reference path="../../../../../node_modules/@types/leaflet/index.d.ts"/>
///// <reference path="../../../../../node_modules/@types/leaflet.pm/index.d.ts"/>
Define("TypeScriptLeafletMap", (function () {
    var LeafletMap = /** @class */ (function () {
        function LeafletMap(id, center) {
            this.markers = {};
            this.polylines = {};
            this.id = id;
            var googleRoadTile = L.tileLayer("https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga", {
                attribution: "Map data \u00A9" + new Date().getFullYear() + " Google",
                maxZoom: 22,
                maxNativeZoom: 18
            });
            var googleSatelliteTile = L.tileLayer("https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga", {
                attribution: "Map data \u00A9" + new Date().getFullYear() + " Google",
                maxZoom: 22,
                maxNativeZoom: 18
            });
            var googleHybridTile = L.tileLayer("https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga", {
                attribution: "Map data \u00A9" + new Date().getFullYear() + " Google",
                maxZoom: 22,
                maxNativeZoom: 18
            });
            var osmTile = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                maxZoom: 22,
                maxNativeZoom: 19
            });
            //var tileGroup = L.layerGroup(new Leaflet.Layer[]
            //{
            //        googleRoadTile,
            //        googleSatelliteTile,
            //        googleHybridTile,
            //        osmTile
            //}, scope.Instantiate<Leaflet.LayerOptions>((scope, options) =>
            //{
            //}));
            var layers = [];
            var dLayer = L.layerGroup(layers, {});
            this.deviceLayer = dLayer;
            var _map = L.map(id, {
                center: center,
                zoom: 8,
                maxZoom: 18,
                layers: [
                    googleRoadTile,
                    //googleSatelliteTile,
                    //googleHybridTile,
                    //osmTile
                    dLayer
                ]
            });
            this.map = _map;
            var baseLayerObject = {
                "Google Road": googleRoadTile,
                "Google Satellite": googleSatelliteTile,
                "Google Hybrid": googleHybridTile,
                "Open Street Map": osmTile,
            };
            var overlayObject = {
                "Devices": dLayer
            };
            L.control.layers(baseLayerObject, overlayObject, {}).addTo(_map);
        }
        LeafletMap.prototype.createMarker = function (center, parameter) {
            var marker = L.marker(center);
            this.markers[parameter.id] = marker;
            if (parameter.hasHtmlView) {
                var icon = L.divIcon({
                    html: document.getElementById(this.id + "-marker-" + parameter.id),
                    iconSize: L.point(parameter.markerWidth, parameter.markerHeight),
                    popupAnchor: L.point(0, -parameter.markerHeight / 2),
                });
                marker.setIcon(icon);
            }
            if (parameter.hasPopup) {
                marker.bindPopup(document.getElementById(this.id + "-popup-" + parameter.id), { className: parameter.className });
            }
            marker.setOpacity(parameter.opacity);
            if (parameter.label) {
                marker.bindTooltip(parameter.label, { direction: "bottom", permanent: true });
            }
            marker.addTo(this.deviceLayer);
            //scope.If("{0} > 0", (scope) =>
            //{
            //    marker.openPopup(null);
            //}, parameter.Get(p => p.Opacity));
        };
        LeafletMap.prototype.removeMarker = function (id) {
            this.markers[id].remove();
            delete this.markers[id];
        };
        LeafletMap.prototype.setMarkerOpacity = function (id, opacity) {
            this.markers[id].setOpacity(opacity);
        };
        LeafletMap.prototype.moveMarker = function (id, parameter) {
            this.markers[id].setLatLng(parameter);
        };
        LeafletMap.prototype.moveMap = function (parameter) {
            this.map.panTo(parameter);
        };
        LeafletMap.prototype.fitMap = function (parameter) {
            this.map.fitBounds(parameter);
        };
        LeafletMap.prototype.refresh = function () {
            this.map.invalidateSize();
        };
        LeafletMap.prototype.drawPath = function (path, parameter) {
            var polyline = L.polyline(path, { color: parameter.color || "blue" });
            this.polylines[parameter.id] = polyline;
            polyline.addTo(this.map);
        };
        LeafletMap.prototype.addPolyPoint = function (parameter) {
            var polyline = this.polylines[parameter.id];
            polyline.addLatLng([parameter.latitude, parameter.longitude]);
        };
        LeafletMap.prototype.removePath = function (parameter) {
            this.polylines[parameter.id].remove();
            delete this.polylines[parameter.id];
        };
        LeafletMap.prototype.showPath = function (parameter) {
            var polyline = this.polylines[parameter.id];
            if (parameter.opacity) {
                polyline.addTo(this.map);
            }
            else {
                polyline.removeFrom(this.map);
            }
        };
        return LeafletMap;
    }());
    return LeafletMap;
})());
/// <reference path="../../Assets/Assets.razor.ts"></reference>
Define("popupInit", function (popup, activator, target, action) {
    var activated = false;
    activator.addEventListener(action === "hover" ? "mouseover" : "click", function () {
        if (!activated) {
            var vp = document.body.getBoundingClientRect();
            vp.scrollWidth = document.body.scrollWidth;
            vp.scrollHeight = document.body.scrollHeight;
            var ap = activator.getBoundingClientRect();
            var tp = target.getBoundingClientRect();
            popup.invokeMethodAsync("Activate", vp, ap, tp);
            activated = true;
        }
        activator.classList.add("show");
    });
    activator.addEventListener(action === "hover" ? "mouseout" : "", function () {
        activator.classList.remove("show");
    });
});
/// <reference path="../../Assets/Assets.razor.ts"></reference>
Define("paystack", {
    init: function (dotnet) {
        this.dotnet = dotnet;
    },
    pay: function (options) {
        var _this = this;
        var handler = PaystackPop.setup(__assign(__assign({}, options), { metadata: {
                custom_fields: [
                    {
                        display_name: "Mobile Number",
                        variable_name: "mobile_number",
                        value: "+2348012345678"
                    }
                ]
            }, callback: function (response) {
                _this.dotnet.invokeMethodAsync("Paid", response);
            }, onClose: function () {
                _this.dotnet.invokeMethodAsync("Closed");
            } }));
        handler.openIframe();
    }
});
/// <reference path="../../Assets/Assets.razor.ts"></reference>
Define("remita", {
    init: function (dotnet) {
        this.dotnet = dotnet;
    },
    pay: function (options) {
        var _this = this;
        var paymentEngine = RmPaymentEngine.init(__assign(__assign({}, options), { onSuccess: function (response) {
                _this.dotnet.invokeMethodAsync("Paid", response);
            }, onError: function (response) {
                _this.dotnet.invokeMethodAsync("Error", response);
            }, onClose: function () {
                _this.dotnet.invokeMethodAsync("Closed");
            } }));
        paymentEngine.showPaymentWidget();
    }
});
/// <reference path="../../Assets/Assets.razor.ts"></reference>
Define("applicationInit", function (app) {
    var isPortrait;
    window.addEventListener("resize", function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var isP = h > w;
        if (isP !== isPortrait) {
            app.invokeMethodAsync("SetPortrait", isP);
            isPortrait = isP;
        }
    });
    var w = window.innerWidth;
    var h = window.innerHeight;
    var isP = h > w;
    if (isP !== isPortrait) {
        app.invokeMethodAsync("SetPortrait", isP);
        isPortrait = isP;
    }
});
/// <reference path="../../Assets/Assets.razor.ts"></reference>
Define("log", function (message) {
    console.log(message);
});
Define("proxy", {
    scopes: {},
    gens: {},
    storeProcedure: function (gkey, skey, code, parameters) {
        var scope = { f: new Function("p", "x", code), p: parameters };
        this.scopes[skey] = scope;
        this.gens[gkey] = { x: {} };
    },
    execute: function (code, parameters, gkey, skey) {
        var fun = new Function("p", "x", code);
        var gen;
        if (skey !== null) {
            gen = this.gens[gkey] = { x: {} };
            this.scopes[skey] = { f: fun };
        }
        var returns = fun.call(fun, parameters, gen.x);
        return returns;
    },
    executeStored: function (gkey, skey, parameters) {
        var scope = this.scopes[skey];
        var gen = this.gens[gkey];
        var p = __assign(__assign({}, scope.p), parameters);
        var returns = scope.f.call(scope.f, p, gen.x);
        return returns;
    },
    createClass: function (gkey, skey, parameters) {
        var scope = this.scopes[skey];
        var gen = this.gens[gkey];
        var p = __assign(__assign({}, scope.p), parameters);
        var mclass = scope.f.call(scope.f, p, gen.x);
        scope.class = mclass;
    },
    callMember: function (gkey, skey, member, parameters) {
        var scope = this.scopes[skey];
        var gen = this.gens[gkey];
        var p = __assign(__assign({}, scope.p), parameters);
        var method = scope.class[member];
        var returns = method.call(scope.class, p, gen.x);
        returns;
    }
});
Define("setTitle", function (title) {
    document.title = title;
});
Define("setCookie", function (cookie) {
    document.cookie = cookie;
});
Define("removeCookie", function (name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
});
Define("reload", function () {
    window.location.reload();
});
//Define("_localStorage", {
//    getItem: function (key) {
//        console.log("get " + key);
//        return localStorage.getItem(key);
//    },
//    setItem: function (key, value) {
//        return localStorage.setItem(key, value);
//    },
//    removeItem: function (key) {
//        return localStorage.remove(key);
//    }
//});
