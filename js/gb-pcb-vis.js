!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.gbPcbVis=t()}}(function(){var t;return function e(t,n,r){function o(s,u){if(!n[s]){if(!t[s]){var a="function"==typeof require&&require;if(!u&&a)return a(s,!0);if(i)return i(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[s]={exports:{}};t[s][0].call(l.exports,function(e){var n=t[s][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(t,e,n){function r(t){var e={};return i.forEach(t,function(t){var n="pcb-"+t.toLowerCase();e[n]=new a(n,t)}),e}function o(t,e){s.mount(t,{connections:r(e.connections),images:e.images,prefix:i.uniqueId("gbpcbvis-")})}var i={forEach:t("lodash.foreach"),range:t("lodash.range"),uniqueId:t("lodash.uniqueid")},s=t("riot");t("./gb-pcb-vis.tag");var u={};u.cartridge=["VCC","CLK","WR","RD","MREQ"].concat(i.range(16).map(function(t){return"A"+t}),i.range(8).map(function(t){return"D"+t}),["RS","VIN","GND"]),u.mbc1=u.cartridge.concat(["M14","M15","M16","M17","M18"]);var a=function(t,e){this.id=t,this.name=e,this.selected=!1,this.hovering=!1,s.observable(this)};a.prototype.setSelected=function(t){this.selected!=t&&(this.selected=t,this.trigger("selected",t))},a.prototype.setHovering=function(t){this.hovering!=t&&(this.hovering=t,this.trigger("hovering",t))},e.exports={connections:u,mount:o}},{"./gb-pcb-vis.tag":2,"lodash.foreach":3,"lodash.range":11,"lodash.uniqueid":13,riot:21}],2:[function(t,e,n){function r(t,e,n){n?t.setAttribute(e,""):t.removeAttribute(e)}var o=t("riot"),i={forEach:t("lodash.foreach"),values:t("lodash.values")},s=t("superagent");o.tag("gbpcbvis-svg","",function(t){this.connections=t.connections,this.on("mount",function(){var e=this,n=this.root;s.get(t.svg).end(function(t,o){n.innerHTML=o.text,i.forEach(n.querySelectorAll("#pcb-connections > g"),function(t){var n=e.connections[t.id];n&&(n.on("selected",function(e){r(t,"data-selected",e)}),n.on("hovering",function(e){r(t,"data-hovering",e)}))})})})}),o.tag("gbpcbvis",'<div if="{ loaded }" class="controls"> <div class="size" onchange="{ onSizeChange }"> <input id="{ this.prefix + \'-small\' }" type="radio" name="{ this.prefix + \'-size\' }" value="small" __checked="{ size === \'small\' }"> <label for="{ this.prefix + \'-small\' }">Small</label><br> <input id="{ this.prefix + \'-large\' }" type="radio" name="{ this.prefix + \'-size\' }" value="large" __checked="{ size === \'large\' }"> <label for="{ this.prefix + \'-large\' }">Large</label><br> </div> <ul class="connections"><li each="{ connectionValues }" class="{ selected: selected, hovering: hovering }" onmouseover="{ parent.onConnectionMouseover }" onmouseout="{ parent.onConnectionMouseout }" onclick="{ parent.onConnectionClick }">{ name }</li></ul> </div> <div if="{ loaded }" class="images"><gbpcbvis-svg each="{ svgs }" svg="{ svg }" class="{ parent.size }" connections="{ parent.connections }" onclick="{ parent.onSvgClick }" onmouseover="{ parent.onSvgMouseover }" onmouseout="{ parent.onSvgMouseout }"></gbpcbvis-svg></div> <div if="{ !loaded }" class="placeholders"> <a each="{ images }" href="{ href }"> <img width="400" riot-src="{ thumb }"> </a> </div> <button if="{ !loaded }" onclick="{ load }">Load interactive PCB visualization</button>',function(t){this.prefix=t.prefix,this.loaded=!1,this.images=t.images,this.svgs=[],this.size="small",this.connections=t.connections,this.connectionValues=i.values(this.connections),this.load=function(t){if(!this.loaded){this.loaded=!0;var e=this.svgs;i.forEach(this.images,function(t){e.push(t)})}}.bind(this),this.onSizeChange=function(t){this.size=t.target.value}.bind(this),this.onConnectionClick=function(t){t.item.setSelected(!t.item.selected)}.bind(this),this.onConnectionMouseover=function(t){t.item.setHovering(!0)}.bind(this),this.onConnectionMouseout=function(t){t.item.setHovering(!1)}.bind(this),this.lookupConnection=function(t){for(var e;t&&"pcb-connections"!==t.id;)t.id&&(e=t.id),t=t.parentElement;return this.connections[e]}.bind(this),this.onSvgClick=function(t){var e=this.lookupConnection(t.target);e&&e.setSelected(!e.selected)}.bind(this),this.onSvgMouseover=function(t){var e=this.lookupConnection(t.target);e&&e.setHovering(!0)}.bind(this),this.onSvgMouseout=function(t){var e=this.lookupConnection(t.target);e&&e.setHovering(!1)}.bind(this)})},{"lodash.foreach":3,"lodash.values":15,riot:21,superagent:22}],3:[function(t,e,n){function r(t,e){return function(n,r,o){return"function"==typeof r&&void 0===o&&u(n)?t(n,r):e(n,s(r,o,3))}}var o=t("lodash._arrayeach"),i=t("lodash._baseeach"),s=t("lodash._bindcallback"),u=t("lodash.isarray"),a=r(o,i);e.exports=a},{"lodash._arrayeach":4,"lodash._baseeach":5,"lodash._bindcallback":9,"lodash.isarray":10}],4:[function(t,e,n){function r(t,e){for(var n=-1,r=t.length;++n<r&&e(t[n],n,t)!==!1;);return t}e.exports=r},{}],5:[function(t,e,n){function r(t,e){return h(t,e,l)}function o(t){return function(e){return null==e?void 0:e[t]}}function i(t,e){return function(n,r){var o=n?d(n):0;if(!u(o))return t(n,r);for(var i=e?o:-1,s=a(n);(e?i--:++i<o)&&r(s[i],i,s)!==!1;);return n}}function s(t){return function(e,n,r){for(var o=a(e),i=r(e),s=i.length,u=t?s:-1;t?u--:++u<s;){var c=i[u];if(n(o[c],c,o)===!1)break}return e}}function u(t){return"number"==typeof t&&t>-1&&t%1==0&&f>=t}function a(t){return c(t)?t:Object(t)}function c(t){var e=typeof t;return"function"==e||!!t&&"object"==e}var l=t("lodash.keys"),f=Math.pow(2,53)-1,p=i(r),h=s(),d=o("length");e.exports=p},{"lodash.keys":6}],6:[function(t,e,n){function r(t){return function(e){return null==e?void 0:e[t]}}function o(t){return null!=t&&s(b(t))}function i(t,e){return t=+t,e=null==e?m:e,t>-1&&t%1==0&&e>t}function s(t){return"number"==typeof t&&t>-1&&t%1==0&&m>=t}function u(t){for(var e=c(t),n=e.length,r=n&&t.length,o=r&&s(r)&&(f(t)||y.nonEnumArgs&&l(t)),u=-1,a=[];++u<n;){var p=e[u];(o&&i(p,r)||d.call(t,p))&&a.push(p)}return a}function a(t){var e=typeof t;return"function"==e||!!t&&"object"==e}function c(t){if(null==t)return[];a(t)||(t=Object(t));var e=t.length;e=e&&s(e)&&(f(t)||y.nonEnumArgs&&l(t))&&e||0;for(var n=t.constructor,r=-1,o="function"==typeof n&&n.prototype===t,u=Array(e),c=e>0;++r<e;)u[r]=r+"";for(var p in t)c&&i(p,e)||"constructor"==p&&(o||!d.call(t,p))||u.push(p);return u}var l=t("lodash.isarguments"),f=t("lodash.isarray"),p=t("lodash.isnative"),h=Object.prototype,d=h.hasOwnProperty,v=h.propertyIsEnumerable,g=p(g=Object.keys)&&g,m=Math.pow(2,53)-1,y={};!function(t){var e=function(){this.x=t},n=arguments,r=[];e.prototype={valueOf:t,y:t};for(var o in new e)r.push(o);try{y.nonEnumArgs=!v.call(n,1)}catch(i){y.nonEnumArgs=!0}}(1,0);var b=r("length"),x=g?function(t){var e=null!=t&&t.constructor;return"function"==typeof e&&e.prototype===t||"function"!=typeof t&&o(t)?u(t):a(t)?g(t):[]}:u;e.exports=x},{"lodash.isarguments":7,"lodash.isarray":10,"lodash.isnative":8}],7:[function(t,e,n){function r(t){return!!t&&"object"==typeof t}function o(t){return function(e){return null==e?void 0:e[t]}}function i(t){return null!=t&&s(p(t))}function s(t){return"number"==typeof t&&t>-1&&t%1==0&&f>=t}function u(t){return r(t)&&i(t)&&l.call(t)==a}var a="[object Arguments]",c=Object.prototype,l=c.toString,f=Math.pow(2,53)-1,p=o("length");e.exports=u},{}],8:[function(t,e,n){function r(t){return"string"==typeof t?t:null==t?"":t+""}function o(t){return!!t&&"object"==typeof t}function i(t){return null==t?!1:h.call(t)==u?d.test(p.call(t)):o(t)&&l.test(t)}function s(t){return t=r(t),t&&c.test(t)?t.replace(a,"\\$&"):t}var u="[object Function]",a=/[.*+?^${}()|[\]\/\\]/g,c=RegExp(a.source),l=/^\[object .+?Constructor\]$/,f=Object.prototype,p=Function.prototype.toString,h=f.toString,d=RegExp("^"+s(h).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=i},{}],9:[function(t,e,n){function r(t,e,n){if("function"!=typeof t)return o;if(void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 3:return function(n,r,o){return t.call(e,n,r,o)};case 4:return function(n,r,o,i){return t.call(e,n,r,o,i)};case 5:return function(n,r,o,i,s){return t.call(e,n,r,o,i,s)}}return function(){return t.apply(e,arguments)}}function o(t){return t}e.exports=r},{}],10:[function(t,e,n){function r(t){return"string"==typeof t?t:null==t?"":t+""}function o(t){return!!t&&"object"==typeof t}function i(t){return"number"==typeof t&&t>-1&&t%1==0&&y>=t}function s(t){return null==t?!1:v.call(t)==c?g.test(d.call(t)):o(t)&&p.test(t)}function u(t){return t=r(t),t&&f.test(t)?t.replace(l,"\\$&"):t}var a="[object Array]",c="[object Function]",l=/[.*+?^${}()|[\]\/\\]/g,f=RegExp(l.source),p=/^\[object .+?Constructor\]$/,h=Object.prototype,d=Function.prototype.toString,v=h.toString,g=RegExp("^"+u(v).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),m=s(m=Array.isArray)&&m,y=Math.pow(2,53)-1,b=m||function(t){return o(t)&&i(t.length)&&v.call(t)==a};e.exports=b},{}],11:[function(t,e,n){function r(t,e,n){n&&o(t,e,n)&&(e=n=null),t=+t||0,n=null==n?1:+n||0,null==e?(e=t,t=0):e=+e||0;for(var r=-1,u=s(i((e-t)/(n||1)),0),a=Array(u);++r<u;)a[r]=t,t+=n;return a}var o=t("lodash._isiterateecall"),i=Math.ceil,s=Math.max;e.exports=r},{"lodash._isiterateecall":12}],12:[function(t,e,n){function r(t){return function(e){return null==e?void 0:e[t]}}function o(t){return null!=t&&u(l(t))}function i(t,e){return t=+t,e=null==e?c:e,t>-1&&t%1==0&&e>t}function s(t,e,n){if(!a(n))return!1;var r=typeof e;if("number"==r?o(n)&&i(e,n.length):"string"==r&&e in n){var s=n[e];return t===t?t===s:s!==s}return!1}function u(t){return"number"==typeof t&&t>-1&&t%1==0&&c>=t}function a(t){var e=typeof t;return"function"==e||!!t&&"object"==e}var c=Math.pow(2,53)-1,l=r("length");e.exports=s},{}],13:[function(t,e,n){function r(t){var e=++i;return o(t)+e}var o=t("lodash._basetostring"),i=0;e.exports=r},{"lodash._basetostring":14}],14:[function(t,e,n){function r(t){return"string"==typeof t?t:null==t?"":t+""}e.exports=r},{}],15:[function(t,e,n){function r(t){return o(t,i(t))}var o=t("lodash._basevalues"),i=t("lodash.keys");e.exports=r},{"lodash._basevalues":16,"lodash.keys":17}],16:[function(t,e,n){function r(t,e){for(var n=-1,r=e.length,o=Array(r);++n<r;)o[n]=t[e[n]];return o}e.exports=r},{}],17:[function(t,e,n){arguments[4][6][0].apply(n,arguments)},{dup:6,"lodash.isarguments":18,"lodash.isarray":19,"lodash.isnative":20}],18:[function(t,e,n){arguments[4][7][0].apply(n,arguments)},{dup:7}],19:[function(t,e,n){arguments[4][10][0].apply(n,arguments)},{dup:10}],20:[function(t,e,n){arguments[4][8][0].apply(n,arguments)},{dup:8}],21:[function(e,n,r){!function(e){function o(t){var e={val:t},n=t.split(/\s+in\s+/);return n[1]&&(e.val=L(0)+n[1],n=n[0].slice(L(0).length).trim().split(/,\s*/),e.key=n[0],e.pos=n[1]),e}function i(t,e,n){var r={};return r[t.key]=e,t.pos&&(r[t.pos]=n),r}function s(t,e,n){function r(t,e,n){f.splice(t,0,e),p.splice(t,0,n)}d(t,"each");var s,u=t.outerHTML,a=t.previousSibling,l=t.parentNode,f=[],p=[];n=o(n),e.one("update",function(){l.removeChild(t)}).one("premount",function(){l.stub&&(l=e.root)}).on("update",function(){var t=O(n.val,e);if(t){if(!Array.isArray(t)){var o=JSON.stringify(t);if(o==s)return;s=o,h(p,function(t){t.unmount()}),f=[],p=[],t=Object.keys(t).map(function(e){return i(n,e,t[e])})}h(f,function(e){if(e instanceof Object){if(t.indexOf(e)>-1)return}else{var n=_(t,e),r=_(f,e);if(n.length>=r.length)return}var o=f.indexOf(e),i=p[o];return i?(i.unmount(),f.splice(o,1),p.splice(o,1),!1):void 0});var d=[].indexOf.call(l.childNodes,a)+1;h(t,function(o,a){var h=t.indexOf(o,a),v=f.indexOf(o,a);if(0>h&&(h=t.lastIndexOf(o,a)),0>v&&(v=f.lastIndexOf(o,a)),!(o instanceof Object)){var g=_(t,o),m=_(f,o);g.length>m.length&&(v=-1)}var y=l.childNodes;if(0>v){if(!s&&n.key)var b=i(n,o,h);var x=new c({tmpl:u},{before:y[d+h],parent:e,root:l,item:b||o});return x.mount(),r(h,o,x),!0}return n.pos&&p[v][n.pos]!=h&&(p[v].one("update",function(t){t[n.pos]=h}),p[v].update()),h!=v?(l.insertBefore(y[d+v],y[d+(h>v?h+1:h)]),r(h,f.splice(v,1)[0],p.splice(v,1)[0])):void 0}),f=t.slice()}})}function u(t,e,n){b(t,function(t){if(1==t.nodeType){t.parentNode&&t.parentNode.isLoop&&(t.isLoop=1),t.getAttribute("each")&&(t.isLoop=1);var r=k(t);if(r&&!t.isLoop){for(var o,i=new c(r,{root:t,parent:e},t.innerHTML),s=r.name,u=e;!k(u.root)&&u.parent;)u=u.parent;i.parent=u,o=u.tags[s],o?(Array.isArray(o)||(u.tags[s]=[o]),u.tags[s].push(i)):u.tags[s]=i,t.innerHTML="",n.push(i)}h(t.attributes,function(n){/^(name|id)$/.test(n.name)&&(e[n.value]=t)})}})}function a(t,e,n){function r(t,e,r){if(e.indexOf(L(0))>=0){var o={dom:t,expr:e};n.push(v(o,r))}}b(t,function(t){var n=t.nodeType;if(3==n&&"STYLE"!=t.parentNode.tagName&&r(t,t.nodeValue),1==n){var o=t.getAttribute("each");return o?(s(t,e,o),!1):(h(t.attributes,function(e){var n=e.name,o=n.split("__")[1];return r(t,e.value,{attr:o||n,bool:o}),o?(d(t,n),!1):void 0}),k(t)?!1:void 0)}})}function c(t,e,n){function r(){h(Object.keys(k),function(t){c[t]=O(k[t],f||s)})}function o(t){if(h(g,function(e){e[t?"mount":"unmount"]()}),f){var e=t?"on":"off";f[e]("update",s.update)[e]("unmount",s.unmount)}}var i,s=j.observable(this),c=C(e.opts)||{},l=y(t.tmpl),f=e.parent,d=[],g=[],m=e.root,b=e.item,w=t.fn,_=m.tagName.toLowerCase(),k={};w&&m._tag&&m._tag.unmount(!0),m._tag=this,this._id=~~((new Date).getTime()*Math.random()),v(this,{parent:f,root:m,opts:c,tags:{}},b),h(m.attributes,function(t){k[t.name]=t.value}),l.innerHTML&&!/select/.test(_)&&(l.innerHTML=x(l.innerHTML,n)),this.update=function(t,e){v(s,t,b),r(),s.trigger("update",b),p(d,s,b),s.trigger("updated")},this.mount=function(){if(r(),w&&w.call(s,c),o(!0),a(l,s,d),s.parent||s.update(),s.trigger("premount"),w)for(;l.firstChild;)m.appendChild(l.firstChild);else i=l.firstChild,m.insertBefore(i,e.before||null);m.stub&&(s.root=m=f.root),s.trigger("mount")},this.unmount=function(t){var e=w?m:i,n=e.parentNode;if(n){if(f)Array.isArray(f.tags[_])?h(f.tags[_],function(t,e){t._id==s._id&&f.tags[_].splice(e,1)}):delete f.tags[_];else for(;e.firstChild;)e.removeChild(e.firstChild);t||n.removeChild(e)}s.trigger("unmount"),o(),s.off("*"),m._tag=null},u(l,this,g)}function l(t,n,r,o,i){r[t]=function(t){t=t||e.event,t.which=t.which||t.charCode||t.keyCode,t.target=t.target||t.srcElement,t.currentTarget=r,t.item=i,n.call(o,t)===!0||/radio|check/.test(r.type)||(t.preventDefault&&t.preventDefault(),t.returnValue=!1);var s=i?o.parent:o;s.update()}}function f(t,e,n){t&&(t.insertBefore(n,e),t.removeChild(e))}function p(t,e,n){h(t,function(t,r){var o=t.dom,i=t.attr,s=O(t.expr,e),u=t.dom.parentNode;if(null==s&&(s=""),u&&"TEXTAREA"==u.tagName&&(s=s.replace(/riot-/g,"")),t.value!==s){if(t.value=s,!i)return o.nodeValue=s;if(d(o,i),"function"==typeof s)l(i,s,o,e,n);else if("if"==i){var a=t.stub;s?a&&f(a.parentNode,a,o):(a=t.stub=a||document.createTextNode(""),f(o.parentNode,o,a))}else if(/^(show|hide)$/.test(i))"hide"==i&&(s=!s),o.style.display=s?"":"none";else if("value"==i)o.value=s;else if("riot-"==i.slice(0,5))i=i.slice(5),s?o.setAttribute(i,s):d(o,i);else{if(t.bool){if(o[i]=s,!s)return;s=i}"object"!=typeof s&&o.setAttribute(i,s)}}})}function h(t,e){for(var n,r=0,o=(t||[]).length;o>r;r++)n=t[r],null!=n&&e(n,r)===!1&&r--;return t}function d(t,e){t.removeAttribute(e)}function v(t,e,n){return e&&h(Object.keys(e),function(n){t[n]=e[n]}),n?v(t,n):t}function g(){if(e){var t=navigator.userAgent,n=t.indexOf("MSIE ");return n>0?parseInt(t.substring(n+5,t.indexOf(".",n)),10):0}}function m(t,e){var n=document.createElement("option"),r=/value=[\"'](.+?)[\"']/,o=/selected=[\"'](.+?)[\"']/,i=e.match(r),s=e.match(o);n.innerHTML=e,i&&(n.value=i[1]),s&&n.setAttribute("riot-selected",s[1]),t.appendChild(n)}function y(t){var e=t.trim().slice(1,3).toLowerCase(),n=/td|th/.test(e)?"tr":"tr"==e?"tbody":"div",r=document.createElement(n);return r.stub=!0,"op"===e&&A&&10>A?m(r,t):r.innerHTML=t,r}function b(t,e){if(t)if(e(t)===!1)b(t.nextSibling,e);else for(t=t.firstChild;t;)b(t,e),t=t.nextSibling}function x(t,e){return t.replace(/<(yield)\/?>(<\/\1>)?/gim,e||"")}function w(t,e){return e=e||document,e.querySelectorAll(t)}function _(t,e){return t.filter(function(t){return t===e})}function C(t){function e(){}return e.prototype=t,new e}function k(t){return H[t.getAttribute("riot-tag")||t.tagName.toLowerCase()]}function E(t){var e=document.createElement("style");e.innerHTML=t,document.head.appendChild(e)}function T(t,e,n){var r=H[e],o=t.innerHTML;return t.innerHTML="",r&&t&&(r=new c(r,{root:t,opts:n},o)),r&&r.mount?(r.mount(),M.push(r),r.on("unmount",function(){M.splice(M.indexOf(r),1)})):void 0}var j={version:"v2.0.15",settings:{}},A=g();j.observable=function(t){t=t||{};var e={},n=0;return t.on=function(r,o){return"function"==typeof o&&(o._id="undefined"==typeof o._id?n++:o._id,r.replace(/\S+/g,function(t,n){(e[t]=e[t]||[]).push(o),o.typed=n>0})),t},t.off=function(n,r){return"*"==n?e={}:n.replace(/\S+/g,function(t){if(r)for(var n,o=e[t],i=0;n=o&&o[i];++i)n._id==r._id&&(o.splice(i,1),i--);else e[t]=[]}),t},t.one=function(e,n){function r(){t.off(e,r),n.apply(t,arguments)}return t.on(e,r)},t.trigger=function(n){for(var r,o=[].slice.call(arguments,1),i=e[n]||[],s=0;r=i[s];++s)r.busy||(r.busy=1,r.apply(t,r.typed?[n].concat(o):o),i[s]!==r&&s--,r.busy=0);return e.all&&"all"!=n&&t.trigger.apply(t,["all",n].concat(o)),t},t},function(t,e,n){function r(){return u.href.split("#")[1]||""}function o(t){return t.split("/")}function i(t){t.type&&(t=r()),t!=s&&(a.trigger.apply(null,["H"].concat(o(t))),s=t)}if(n){var s,u=n.location,a=t.observable(),c=n,l=!1,f=t.route=function(t){t[0]?(u.hash=t,i(t)):a.on("H",t)};f.exec=function(t){t.apply(null,o(r()))},f.parser=function(t){o=t},f.stop=function(){l&&(c.removeEventListener?c.removeEventListener(e,i,!1):c.detachEvent("on"+e,i),a.off("*"),l=!1)},f.start=function(){l||(c.addEventListener?c.addEventListener(e,i,!1):c.attachEvent("on"+e,i),l=!0)},f.start()}}(j,"hashchange",e);var L=function(t,e,n){return function(r){return e=j.settings.brackets||t,n!=e&&(n=e.split(" ")),r&&r.test?e==t?r:RegExp(r.source.replace(/\{/g,n[0].replace(/(?=.)/g,"\\")).replace(/\}/g,n[1].replace(/(?=.)/g,"\\")),r.global?"g":""):n[r]}}("{ }"),O=function(){function t(t,e){return t=(t||L(0)+L(1)).replace(L(/\\{/g),"￰").replace(L(/\\}/g),"￱"),e=o(t,i(t,L(/{/),L(/}/))),new Function("d","return "+(e[0]||e[2]||e[3]?"["+e.map(function(t,e){return e%2?n(t,!0):'"'+t.replace(/\n/g,"\\n").replace(/"/g,'\\"')+'"'}).join(",")+'].join("")':n(e[1])).replace(/\uFFF0/g,L(0)).replace(/\uFFF1/g,L(1))+";")}function n(t,e){return t=t.replace(/\n/g," ").replace(L(/^[{ ]+|[ }]+$|\/\*.+?\*\//g),""),/^\s*[\w- "']+ *:/.test(t)?"["+i(t,/["' ]*[\w- ]+["' ]*:/,/,(?=["' ]*[\w- ]+["' ]*:)|}|$/).map(function(t){return t.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/,function(t,e,n){return n.replace(/[^&|=!><]+/g,r)+'?"'+e+'":"",'})}).join("")+'].join(" ").trim()':r(t,e)}function r(t,n){return t=t.trim(),t?"(function(v){try{v="+(t.replace(u,function(t,n,r){return r?"(d."+r+"===undefined?"+("undefined"==typeof e?"global.":"window.")+r+":d."+r+")":t})||"x")+"}finally{return "+(n===!0?'!v&&v!==0?"":v':"v")+"}}).call(d)":""}function o(t,e){var n=[];return e.map(function(e,r){r=t.indexOf(e),n.push(t.slice(0,r),e),t=t.slice(r+e.length)}),n.concat(t)}function i(t,e,n){var r,o=0,i=[],s=new RegExp("("+e.source+")|("+n.source+")","g");return t.replace(s,function(e,n,s,u){!o&&n&&(r=u),o+=n?1:-1,o||null==s||i.push(t.slice(r,u+s.length))}),i}var s={},u=/(['"\/]).*?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_$]\w*)/gi;return function(e,n){return e&&(s[e]=s[e]||t(e))(n)}}(),M=[],H={};j.tag=function(t,e,n,r){return"function"==typeof n?r=n:n&&E(n),H[t]={name:t,tmpl:e,fn:r},t},j.mount=function(t,e,n){function r(t){var r=e||t.getAttribute("riot-tag")||t.tagName.toLowerCase(),o=T(t,r,n);o&&s.push(o)}var o,i=function(t){return t=Object.keys(H).join(", "),t.split(",").map(function(e){t+=', *[riot-tag="'+e.trim()+'"]'}),t},s=[];if("object"==typeof e&&(n=e,e=0),"string"==typeof t?("*"==t&&(t=i(t)),o=w(t)):o=t,"*"==e){if(e=i(t),o.tagName)o=w(e,o);else{var u=[];h(o,function(t){u=w(e,t)}),o=u}e=0}return o.tagName?r(t):h(o,r),s},j.update=function(){return h(M,function(t){t.update()})},j.mountTo=j.mount,j.util={brackets:L,tmpl:O},"object"==typeof r?n.exports=j:"function"==typeof t&&t.amd?t(function(){return j}):e.riot=j}("undefined"!=typeof window?window:void 0)},{}],22:[function(t,e,n){function r(){}function o(t){var e={}.toString.call(t);switch(e){case"[object File]":case"[object Blob]":case"[object FormData]":return!0;default:return!1}}function i(t){return t===Object(t)}function s(t){if(!i(t))return t;var e=[];for(var n in t)null!=t[n]&&e.push(encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e.join("&")}function u(t){for(var e,n,r={},o=t.split("&"),i=0,s=o.length;s>i;++i)n=o[i],e=n.split("="),r[decodeURIComponent(e[0])]=decodeURIComponent(e[1]);return r}function a(t){var e,n,r,o,i=t.split(/\r?\n/),s={};i.pop();for(var u=0,a=i.length;a>u;++u)n=i[u],e=n.indexOf(":"),r=n.slice(0,e).toLowerCase(),o=m(n.slice(e+1)),s[r]=o;return s}function c(t){return t.split(/ *; */).shift()}function l(t){return v(t.split(/ *; */),function(t,e){var n=e.split(/ *= */),r=n.shift(),o=n.shift();return r&&o&&(t[r]=o),t},{})}function f(t,e){e=e||{},this.req=t,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||"undefined"==typeof this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText,this.setStatusProperties(this.xhr.status),this.header=this.headers=a(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this.setHeaderProperties(this.header),this.body="HEAD"!=this.req.method?this.parseBody(this.text?this.text:this.xhr.response):null}function p(t,e){var n=this;d.call(this),this._query=this._query||[],this.method=t,this.url=e,this.header={},this._header={},this.on("end",function(){var t=null,e=null;try{e=new f(n)}catch(r){return t=new Error("Parser is unable to parse the response"),t.parse=!0,t.original=r,n.callback(t)}if(n.emit("response",e),t)return n.callback(t,e);if(e.status>=200&&e.status<300)return n.callback(t,e);var o=new Error(e.statusText||"Unsuccessful HTTP response");o.original=t,o.response=e,o.status=e.status,n.callback(t||o,e)})}function h(t,e){return"function"==typeof e?new p("GET",t).end(e):1==arguments.length?new p("GET",t):new p(t,e)}var d=t("emitter"),v=t("reduce"),g="undefined"==typeof window?this||self:window;h.getXHR=function(){if(!(!g.XMLHttpRequest||g.location&&"file:"==g.location.protocol&&g.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(t){}return!1};var m="".trim?function(t){return t.trim()}:function(t){return t.replace(/(^\s*|\s*$)/g,"")};h.serializeObject=s,h.parseString=u,h.types={html:"text/html",json:"application/json",xml:"application/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},h.serialize={"application/x-www-form-urlencoded":s,"application/json":JSON.stringify},h.parse={"application/x-www-form-urlencoded":u,"application/json":JSON.parse},f.prototype.get=function(t){return this.header[t.toLowerCase()]},f.prototype.setHeaderProperties=function(t){var e=this.header["content-type"]||"";this.type=c(e);var n=l(e);for(var r in n)this[r]=n[r]},f.prototype.parseBody=function(t){var e=h.parse[this.type];return e&&t&&(t.length||t instanceof Object)?e(t):null},f.prototype.setStatusProperties=function(t){1223===t&&(t=204);var e=t/100|0;this.status=t,this.statusType=e,this.info=1==e,this.ok=2==e,this.clientError=4==e,this.serverError=5==e,this.error=4==e||5==e?this.toError():!1,this.accepted=202==t,this.noContent=204==t,this.badRequest=400==t,this.unauthorized=401==t,this.notAcceptable=406==t,this.notFound=404==t,this.forbidden=403==t},f.prototype.toError=function(){var t=this.req,e=t.method,n=t.url,r="cannot "+e+" "+n+" ("+this.status+")",o=new Error(r);return o.status=this.status,o.method=e,o.url=n,o},h.Response=f,d(p.prototype),p.prototype.use=function(t){return t(this),this},p.prototype.timeout=function(t){return this._timeout=t,this},p.prototype.clearTimeout=function(){return this._timeout=0,clearTimeout(this._timer),this},p.prototype.abort=function(){return this.aborted?void 0:(this.aborted=!0,this.xhr.abort(),this.clearTimeout(),this.emit("abort"),this)},p.prototype.set=function(t,e){if(i(t)){for(var n in t)this.set(n,t[n]);return this}return this._header[t.toLowerCase()]=e,this.header[t]=e,this},p.prototype.unset=function(t){return delete this._header[t.toLowerCase()],delete this.header[t],this},p.prototype.getHeader=function(t){return this._header[t.toLowerCase()]},p.prototype.type=function(t){return this.set("Content-Type",h.types[t]||t),this},p.prototype.accept=function(t){return this.set("Accept",h.types[t]||t),this},p.prototype.auth=function(t,e){var n=btoa(t+":"+e);return this.set("Authorization","Basic "+n),this},p.prototype.query=function(t){return"string"!=typeof t&&(t=s(t)),t&&this._query.push(t),this},p.prototype.field=function(t,e){return this._formData||(this._formData=new g.FormData),this._formData.append(t,e),this},p.prototype.attach=function(t,e,n){return this._formData||(this._formData=new g.FormData),this._formData.append(t,e,n),this},p.prototype.send=function(t){var e=i(t),n=this.getHeader("Content-Type");if(e&&i(this._data))for(var r in t)this._data[r]=t[r];else"string"==typeof t?(n||this.type("form"),n=this.getHeader("Content-Type"),this._data="application/x-www-form-urlencoded"==n?this._data?this._data+"&"+t:t:(this._data||"")+t):this._data=t;return!e||o(t)?this:(n||this.type("json"),this)},p.prototype.callback=function(t,e){var n=this._callback;this.clearTimeout(),n(t,e)},p.prototype.crossDomainError=function(){var t=new Error("Origin is not allowed by Access-Control-Allow-Origin");t.crossDomain=!0,this.callback(t)},p.prototype.timeoutError=function(){var t=this._timeout,e=new Error("timeout of "+t+"ms exceeded");e.timeout=t,this.callback(e)},p.prototype.withCredentials=function(){return this._withCredentials=!0,this},p.prototype.end=function(t){var e=this,n=this.xhr=h.getXHR(),i=this._query.join("&"),s=this._timeout,u=this._formData||this._data;this._callback=t||r,n.onreadystatechange=function(){if(4==n.readyState){var t;try{t=n.status}catch(r){t=0}if(0==t){if(e.timedout)return e.timeoutError();if(e.aborted)return;return e.crossDomainError()}e.emit("end")}};var a=function(t){t.total>0&&(t.percent=t.loaded/t.total*100),e.emit("progress",t)};this.hasListeners("progress")&&(n.onprogress=a);try{n.upload&&this.hasListeners("progress")&&(n.upload.onprogress=a)}catch(c){}if(s&&!this._timer&&(this._timer=setTimeout(function(){e.timedout=!0,e.abort()},s)),i&&(i=h.serializeObject(i),this.url+=~this.url.indexOf("?")?"&"+i:"?"+i),n.open(this.method,this.url,!0),this._withCredentials&&(n.withCredentials=!0),"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof u&&!o(u)){var l=h.serialize[this.getHeader("Content-Type")];l&&(u=l(u))}for(var f in this.header)null!=this.header[f]&&n.setRequestHeader(f,this.header[f]);return this.emit("request",this),n.send(u),this},h.Request=p,h.get=function(t,e,n){var r=h("GET",t);return"function"==typeof e&&(n=e,e=null),e&&r.query(e),n&&r.end(n),r},h.head=function(t,e,n){var r=h("HEAD",t);return"function"==typeof e&&(n=e,e=null),e&&r.send(e),n&&r.end(n),r},h.del=function(t,e){var n=h("DELETE",t);return e&&n.end(e),n},h.patch=function(t,e,n){var r=h("PATCH",t);return"function"==typeof e&&(n=e,e=null),e&&r.send(e),n&&r.end(n),r},h.post=function(t,e,n){var r=h("POST",t);return"function"==typeof e&&(n=e,e=null),e&&r.send(e),n&&r.end(n),r},h.put=function(t,e,n){var r=h("PUT",t);return"function"==typeof e&&(n=e,e=null),e&&r.send(e),n&&r.end(n),r},e.exports=h},{emitter:23,reduce:24}],23:[function(t,e,n){function r(t){return t?o(t):void 0}function o(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}e.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks[t]=this._callbacks[t]||[]).push(e),this},r.prototype.once=function(t,e){function n(){r.off(t,n),e.apply(this,arguments)}var r=this;return this._callbacks=this._callbacks||{},n.fn=e,this.on(t,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks[t];if(!n)return this;if(1==arguments.length)return delete this._callbacks[t],this;for(var r,o=0;o<n.length;o++)if(r=n[o],r===e||r.fn===e){n.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks[t];if(n){n=n.slice(0);for(var r=0,o=n.length;o>r;++r)n[r].apply(this,e)}return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks[t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},{}],24:[function(t,e,n){e.exports=function(t,e,n){for(var r=0,o=t.length,i=3==arguments.length?n:t[r++];o>r;)i=e.call(null,i,t[r],++r,t);return i}},{}]},{},[1])(1)});