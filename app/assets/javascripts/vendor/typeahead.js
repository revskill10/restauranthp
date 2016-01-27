/*!
 * jQuery Typeahead
 * Copyright (C) 2015 RunningCoder.org
 * Licensed under the MIT license
 *
 * @author Tom Bertrand
 * @version 2.3.2 (2016-01-13)
 * @link http://www.runningcoder.org/jquerytypeahead/
*/
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){window.Typeahead={version:"2.3.2"};var b={input:null,minLength:2,maxItem:8,dynamic:!1,delay:300,order:null,offset:!1,hint:!1,accent:!1,highlight:!0,group:!1,groupOrder:null,maxItemPerGroup:null,dropdownFilter:!1,dynamicFilter:null,backdrop:!1,backdropOnFocus:!1,cache:!1,ttl:36e5,compression:!1,suggestion:!1,searchOnFocus:!1,resultContainer:null,generateOnLoad:null,mustSelectItem:!1,href:null,display:["display"],template:null,correlativeTemplate:!1,emptyTemplate:!1,filter:!0,matcher:null,source:null,callback:{onInit:null,onReady:null,onShowLayout:null,onHideLayout:null,onSearch:null,onResult:null,onLayoutBuiltBefore:null,onLayoutBuiltAfter:null,onNavigateBefore:null,onNavigateAfter:null,onMouseEnter:null,onMouseLeave:null,onClickBefore:null,onClickAfter:null,onSendRequest:null,onReceiveRequest:null,onPopulateSource:null,onCacheSave:null,onSubmit:null},selector:{container:"typeahead-container",result:"typeahead-result",list:"typeahead-list",group:"typeahead-group",item:"typeahead-item",empty:"typeahead-empty",display:"typeahead-display",query:"typeahead-query",filter:"typeahead-filter",filterButton:"typeahead-filter-button",filterValue:"typeahead-filter-value",dropdown:"typeahead-dropdown",dropdownCaret:"typeahead-caret",button:"typeahead-button",backdrop:"typeahead-backdrop",hint:"typeahead-hint"},debug:!1},c=".typeahead",d={from:"ãàáäâẽèéëêìíïîõòóöôùúüûñç",to:"aaaaaeeeeeiiiiooooouuuunc"},e=~navigator.appVersion.indexOf("MSIE 9."),f=function(a,b){this.rawQuery="",this.query=a.val()||"",this.tmpSource={},this.source={},this.isGenerated=null,this.generatedGroupCount=0,this.groupCount=0,this.groupBy="group",this.result={},this.resultCount=0,this.resultCountPerGroup={},this.options=b,this.node=a,this.container=null,this.resultContainer=null,this.item=null,this.xhr={},this.hintIndex=null,this.filters={dropdown:{},dynamic:{}},this.requests={},this.backdrop={},this.hint={},this.__construct()};f.prototype={extendOptions:function(){this.options.dynamic&&(this.options.cache=!1,this.options.compression=!1),this.options.cache&&(this.options.cache=function(a){var b,c=["localStorage","sessionStorage"];if(a===!0)a="localStorage";else if("string"==typeof a&&!~c.indexOf(a))return!1;b="undefined"!=typeof window[a];try{window[a].setItem("typeahead","typeahead"),window[a].removeItem("typeahead")}catch(d){b=!1}return b&&a||!1}.call(this,this.options.cache)),this.options.compression&&("object"==typeof LZString&&this.options.cache||(this.options.compression=!1)),"undefined"==typeof this.options.maxItem||/^\d+$/.test(this.options.maxItem)&&0!==this.options.maxItem||(this.options.maxItem=1/0),this.options.maxItemPerGroup&&!/^\d+$/.test(this.options.maxItemPerGroup)&&(this.options.maxItemPerGroup=null),!this.options.display||this.options.display instanceof Array||(this.options.display=[this.options.display]),!this.options.group||this.options.group instanceof Array||(this.options.group=[this.options.group]),this.options.highlight&&!~["any",!0].indexOf(this.options.highlight)&&(this.options.highlight=!1),!this.options.dynamicFilter||this.options.dynamicFilter instanceof Array||(this.options.dynamicFilter=[this.options.dynamicFilter]),this.options.accent&&("object"==typeof this.options.accent?this.options.accent.from&&this.options.accent.to&&this.options.accent.from.length===this.options.accent.to.length:this.options.accent=d),this.options.resultContainer&&("string"==typeof this.options.resultContainer&&(this.options.resultContainer=a(this.options.resultContainer)),this.options.resultContainer instanceof jQuery&&this.options.resultContainer[0]&&(this.resultContainer=this.options.resultContainer)),this.options.group&&"string"==typeof this.options.group[0]&&this.options.maxItemPerGroup&&(this.groupBy=this.options.group[0]),this.options.callback&&this.options.callback.onClick&&(this.options.callback.onClickBefore=this.options.callback.onClick,delete this.options.callback.onClick),this.options.callback&&this.options.callback.onNavigate&&(this.options.callback.onNavigateBefore=this.options.callback.onNavigate,delete this.options.callback.onNavigate),this.options=a.extend(!0,{},b,this.options)},unifySourceFormat:function(){if(this.options.source instanceof Array)return this.options.source={group:{data:this.options.source}},this.groupCount+=1,!0;("undefined"!=typeof this.options.source.data||"undefined"!=typeof this.options.source.url)&&(this.options.source={group:this.options.source});var a;for(var b in this.options.source)if(this.options.source.hasOwnProperty(b)){if(a=this.options.source[b],("string"==typeof a||a instanceof Array)&&(a={url:a}),!a.data&&!a.url)return!1;!a.display||a.display instanceof Array||(a.display=[a.display]),a.ignore&&(a.ignore instanceof RegExp||delete a.ignore),this.options.source[b]=a,this.groupCount+=1}return!0},init:function(){this.helper.executeCallback.call(this,this.options.callback.onInit,[this.node]),this.container=this.node.closest("."+this.options.selector.container)},delegateEvents:function(){var b=this,d=["focus"+c,"input"+c,"propertychange"+c,"keydown"+c,"keyup"+c,"dynamic"+c,"generateOnLoad"+c];this.container.off(c).on("click"+c+" touchstart"+c,function(c){c.stopPropagation(),b.options.dropdownFilter&&b.container.hasClass("filter")&&!a(c.target).closest("."+b.options.selector.dropdown.replace(" ","."))[0]&&b.container.removeClass("filter")}),this.node.closest("form").on("submit",function(a){return b.options.mustSelectItem&&b.helper.isEmpty(b.item)?void a.preventDefault():(b.hideLayout(),b.rawQuery="",b.query="",b.helper.executeCallback.call(b,b.options.callback.onSubmit,[b.node,this,b.item,a])?!1:void 0)});var f=!1;this.node.off(c).on(d.join(" "),function(a){switch(a.type){case"focus":b.options.backdropOnFocus&&(b.buildBackdropLayout(),b.showLayout());case"generateOnLoad":b.options.searchOnFocus&&b.query.length>=b.options.minLength&&(b.isGenerated?b.showLayout():null===b.isGenerated&&b.generateSource());case"keydown":null!==b.isGenerated||b.options.dynamic||b.generateSource(),a.keyCode&&~[9,13,27,38,39,40].indexOf(a.keyCode)&&(f=!0,b.navigate(a));break;case"keyup":e&&b.node[0].value.replace(/^\s+/,"").toString().length<b.query.length&&b.node.trigger("input"+c);break;case"propertychange":if(f){f=!1;break}case"input":if(b.rawQuery=b.node[0].value.toString(),b.query=b.rawQuery.replace(/^\s+/,""),b.options.hint&&b.hint.container&&""!==b.hint.container.val()&&0!==b.hint.container.val().indexOf(b.rawQuery)&&b.hint.container.val(""),b.options.dynamic)return b.isGenerated=null,void b.helper.typeWatch(function(){b.query.length>=b.options.minLength?b.generateSource():b.hideLayout()},b.options.delay);case"dynamic":if(!b.isGenerated)break;if(b.searchResult(),b.query.length<b.options.minLength){b.hideLayout();break}b.buildLayout(),b.result.length>0||b.options.emptyTemplate?b.showLayout():b.hideLayout()}}),this.options.generateOnLoad&&this.node.trigger("generateOnLoad"+c)},generateSource:function(){if(!this.isGenerated||this.options.dynamic){if(this.generatedGroupCount=0,this.isGenerated=!1,!this.helper.isEmpty(this.xhr)){for(var a in this.xhr)this.xhr.hasOwnProperty(a)&&this.xhr[a].abort();this.xhr={}}var b,c,d,e;for(b in this.options.source)if(this.options.source.hasOwnProperty(b)){if(c=this.options.source[b],this.options.cache&&(d=window[this.options.cache].getItem("TYPEAHEAD_"+this.node.selector+":"+b))){this.options.compression&&(d=LZString.decompressFromUTF16(d)),e=!1;try{d=JSON.parse(d+""),d.data&&d.ttl>(new Date).getTime()?(this.populateSource(d.data,b),e=!0):window[this.options.cache].removeItem("TYPEAHEAD_"+this.node.selector+":"+b)}catch(f){}if(e)continue}!c.data||c.url?c.url&&(this.requests[b]||(this.requests[b]=this.generateRequestObject(b))):this.populateSource("function"==typeof c.data&&c.data()||c.data,b)}this.handleRequests()}},generateRequestObject:function(b){var c=this,d=this.options.source[b];d.url instanceof Array||(d.url=[d.url]);var e={request:{url:null,dataType:"json",beforeSend:function(a,e){c.xhr[b]=a;var f=c.requests[b].extra.beforeSend||d.url[0].beforeSend;"function"==typeof f&&f.apply(null,arguments)}},extra:{path:null,group:b,callback:{done:null,fail:null,complete:null,always:null}},validForGroup:[b]};Object.defineProperty(e.request,"beforeSend",{writable:!1}),d.url[0]instanceof Object?(d.url[0].callback&&(e.extra.callback=d.url[0].callback,delete d.url[0].callback),e.request=a.extend(!0,e.request,d.url[0])):"string"==typeof d.url[0]&&(e.request.url=d.url[0]),d.url[1]&&"string"==typeof d.url[1]&&(e.extra.path=d.url[1]),"jsonp"===e.request.dataType.toLowerCase()&&(e.request.jsonpCallback="callback_"+b);var f;for(var g in this.requests)if(this.requests.hasOwnProperty(g)&&(f=JSON.stringify(this.requests[g].request),f===JSON.stringify(e.request))){this.requests[g].validForGroup.push(b),e.isDuplicated=!0,delete e.validForGroup;break}return e},handleRequests:function(){var b=this,c=Object.keys(this.requests).length;this.helper.executeCallback.call(this,this.options.callback.onSendRequest,[this.node,this.query]);for(var d in this.requests)this.requests.hasOwnProperty(d)&&(this.requests[d].isDuplicated||!function(d,e){if("function"==typeof b.options.source[d].url[0]){var f=b.options.source[d].url[0].call(b,b.query);if(e.request=a.extend(!0,e.request,f),"object"!=typeof e.request||!e.request.url)return;f.beforeSend&&(b.requests[d].extra.beforeSend=f.beforeSend)}var g,h=!1;if(~e.request.url.indexOf("{{query}}")&&(h||(e=a.extend(!0,{},e),h=!0),e.request.url=e.request.url.replace("{{query}}",b.query.sanitize())),e.request.data)for(var i in e.request.data)if(e.request.data.hasOwnProperty(i)&&~String(e.request.data[i]).indexOf("{{query}}")){h||(e=a.extend(!0,{},e),h=!0),e.request.data[i]=e.request.data[i].replace("{{query}}",b.query.sanitize());break}a.ajax(e.request).done(function(a,d,f){for(var h,i=0;i<e.validForGroup.length;i++)g=b.requests[e.validForGroup[i]],g.extra.callback.done instanceof Function&&(h=g.extra.callback.done(a,d,f),a=h instanceof Array&&h||a),b.populateSource(a,g.extra.group,g.extra.path),c-=1,0===c&&b.helper.executeCallback.call(b,b.options.callback.onReceiveRequest,[b.node,b.query])}).fail(function(a,c,d){for(var f=0;f<e.validForGroup.length;f++)g=b.requests[e.validForGroup[f]],g.extra.callback.fail instanceof Function&&g.extra.callback.fail(a,c,d)}).then(function(a,c){for(var d=0;d<e.validForGroup.length;d++)g=b.requests[e.validForGroup[d]],g.extra.callback.then instanceof Function&&g.extra.callback.then(a,c)}).always(function(a,c,d){for(var f=0;f<e.validForGroup.length;f++)g=b.requests[e.validForGroup[f]],g.extra.callback.always instanceof Function&&g.extra.callback.always(a,c,d)})}(d,this.requests[d]))},populateSource:function(a,b,c){var d=this,e=this.options.source[b],f=e.url&&e.data;a="string"==typeof c?this.helper.namespace(c,a):a,a instanceof Array||(a=[]),f&&("function"==typeof f&&(f=f()),f instanceof Array&&(a=a.concat(f)));for(var g,h=e.display?"compiled"===e.display[0]?e.display[1]:e.display[0]:"compiled"===this.options.display[0]?this.options.display[1]:this.options.display[0],i=0;i<a.length;i++)"string"==typeof a[i]&&(g={},g[h]=a[i],a[i]=g),a[i].group=b;if(this.options.correlativeTemplate){var j=e.template||this.options.template,k="";if("function"==typeof j&&(j=j()),j){if(this.options.correlativeTemplate instanceof Array)for(var i=0;i<this.options.correlativeTemplate.length;i++)k+="{{"+this.options.correlativeTemplate[i]+"}} ";else k=j.replace(/<.+?>/g,"");for(var i=0;i<a.length;i++)a[i].compiled=k.replace(/\{\{([\w\-\.]+)(?:\|(\w+))?}}/g,function(b,c){return d.helper.namespace(c,a[i],"get","")}).trim();e.display?~e.display.indexOf("compiled")||e.display.unshift("compiled"):~this.options.display.indexOf("compiled")||this.options.display.unshift("compiled")}else;}if(this.options.callback.onPopulateSource&&(a=this.helper.executeCallback.call(this,this.options.callback.onPopulateSource,[this.node,a,b,c])),this.tmpSource[b]=a,this.options.cache&&!window[this.options.cache].getItem("TYPEAHEAD_"+this.node.selector+":"+b)){this.options.callback.onCacheSave&&(a=this.helper.executeCallback.call(this,this.options.callback.onCacheSave,[this.node,a,b,c]));var l=JSON.stringify({data:a,ttl:(new Date).getTime()+this.options.ttl});this.options.compression&&(l=LZString.compressToUTF16(l)),window[this.options.cache].setItem("TYPEAHEAD_"+this.node.selector+":"+b,l)}this.incrementGeneratedGroup()},incrementGeneratedGroup:function(){if(this.generatedGroupCount+=1,this.groupCount===this.generatedGroupCount){this.isGenerated=!0,this.xhr={};for(var a=Object.keys(this.options.source),b=0;b<a.length;b++)this.source[a[b]]=this.tmpSource[a[b]];this.tmpSource={},this.node.trigger("dynamic"+c)}},navigate:function(a){if(this.helper.executeCallback.call(this,this.options.callback.onNavigateBefore,[this.node,this.query,a]),~[9,27].indexOf(a.keyCode))return this.query.length||27!==a.keyCode||this.node.blur(),void this.hideLayout();if(this.isGenerated&&this.result.length){var b=this.resultContainer.find("> ul > li:not([data-search-group])"),c=b.filter(".active"),d=c[0]&&b.index(c)||null,e=null;if(13===a.keyCode){if(c.length>0)return a.preventDefault(),void c.find("a:first")[0].click();if(this.options.mustSelectItem&&this.helper.isEmpty(this.item))return;return void this.hideLayout()}if(39===a.keyCode)return void(d?b.eq(d).find("a:first")[0].click():this.options.hint&&""!==this.hint.container.val()&&this.helper.getCaret(this.node[0])>=this.query.length&&b.find('a[data-index="'+this.hintIndex+'"]')[0].click());b.length>0&&c.removeClass("active"),38===a.keyCode?(a.preventDefault(),c.length>0?d-1>=0&&(e=d-1,b.eq(e).addClass("active")):(e=b.length-1,b.last().addClass("active"))):40===a.keyCode&&(a.preventDefault(),c.length>0?d+1<b.length&&(e=d+1,b.eq(e).addClass("active")):(e=0,b.first().addClass("active"))),a.preventInputChange&&~[38,40].indexOf(a.keyCode)&&this.buildHintLayout(null!==e&&e<this.result.length?[this.result[e]]:null),this.options.hint&&this.hint.container&&this.hint.container.css("color",a.preventInputChange?this.hint.css.color:null===e&&this.hint.css.color||this.hint.container.css("background-color")||"fff"),this.node.val(null===e||a.preventInputChange?this.rawQuery:this.result[e][this.result[e].matchedKey]),this.helper.executeCallback.call(this,this.options.callback.onNavigateAfter,[this.node,b,null!==e&&b.eq(e).find("a:first")||void 0,null!==e&&this.result[e]||void 0,this.query,a])}},searchResult:function(a){if(a||(this.item={}),this.resetLayout(),this.helper.executeCallback.call(this,this.options.callback.onSearch,[this.node,this.query]),!(this.query.length<this.options.minLength)){var b,c,d,e,f,g,h,i,j,k,l,m,n=this,o=this.options.group&&"boolean"!=typeof this.options.group[0]?this.options.group[0]:"group",p=null,q=this.query.toLowerCase(),r=this.options.maxItemPerGroup,s=this.filters.dynamic&&!this.helper.isEmpty(this.filters.dynamic),t="function"==typeof this.options.matcher&&this.options.matcher;this.options.accent&&(q=this.helper.removeAccent.call(this,q));for(b in this.source)if(this.source.hasOwnProperty(b)&&(!this.filters.dropdown||"group"!==this.filters.dropdown.key||this.filters.dropdown.value===b)){g="undefined"!=typeof this.options.source[b].filter?this.options.source[b].filter:this.options.filter,i="function"==typeof this.options.source[b].matcher&&this.options.source[b].matcher||t;for(var u=0;u<this.source[b].length&&(!(this.result.length>=this.options.maxItem)||this.options.callback.onResult);u++)if(!s||this.dynamicFilter.validate.apply(this,[this.source[b][u]])){if(c=this.source[b][u],p="group"===o?b:c[o],p&&!this.result[p]&&(this.result[p]=[],this.resultCountPerGroup[p]=0),r&&"group"===o&&this.result[p].length>=r&&!this.options.callback.onResult)break;f=this.options.source[b].display||this.options.display;for(var v=0;v<f.length;v++){if("function"==typeof g){if(h=g.call(this,c,c[f[v]]),void 0===h)break;if(!h)continue;"object"==typeof h&&(c=h)}if(~[void 0,!0].indexOf(g)){if(e=c[f[v]],!e)continue;if(e=e.toString().toLowerCase(),this.options.accent&&(e=this.helper.removeAccent.call(this,e)),d=e.indexOf(q),this.options.correlativeTemplate&&"compiled"===f[v]&&0>d&&/\s/.test(q)){k=!0,l=q.split(" "),m=e;for(var w=0;w<l.length;w++)if(""!==l[w]){if(!~m.indexOf(l[w])){k=!1;break}m=m.replace(l[w],"")}}if(0>d&&!k)continue;if(this.options.offset&&0!==d)continue;if(this.options.source[b].ignore&&this.options.source[b].ignore.test(e))continue;if(i){if(j=i.call(this,c,c[f[v]]),void 0===j)break;if(!j)continue;"object"==typeof j&&(c=j)}}if(!this.filters.dropdown||this.filters.dropdown.value==c[this.filters.dropdown.key]){if(this.resultCount++,this.resultCountPerGroup[p]++,this.resultItemCount<this.options.maxItem){if(r&&this.result[p].length>=r)break;c.matchedKey=f[v],this.result[p].push(c),this.resultItemCount++}break}}if(!this.options.callback.onResult){if(this.resultItemCount>=this.options.maxItem)break;if(r&&this.result[p].length>=r&&"group"===o)break}}}if(this.options.order){var x,f=[];for(var b in this.result)if(this.result.hasOwnProperty(b)){for(var v=0;v<this.result[b].length;v++)x=this.options.source[this.result[b][v].group].display||this.options.display,~f.indexOf(x[0])||f.push(x[0]);this.result[b].sort(n.helper.sort(f,"asc"===n.options.order,function(a){return a.toString().toUpperCase()}))}}var y,z=[];y="function"==typeof this.options.groupOrder?this.options.groupOrder.apply(this,[this.node,this.query,this.result,this.resultCount,this.resultCountPerGroup]):this.options.groupOrder instanceof Array?this.options.groupOrder:"string"==typeof this.options.groupOrder&&~["asc","desc"].indexOf(this.options.groupOrder)?Object.keys(this.result).sort(n.helper.sort([],"asc"===n.options.groupOrder,function(a){return a.toString().toUpperCase()})):Object.keys(this.result);for(var v=0;v<y.length;v++)z=z.concat(this.result[y[v]]||[]);this.result=z,this.helper.executeCallback.call(this,this.options.callback.onResult,[this.node,this.query,this.result,this.resultCount,this.resultCountPerGroup])}},buildLayout:function(){this.resultContainer||(this.resultContainer=a("<div/>",{"class":this.options.selector.result}),this.container.append(this.resultContainer));var b=this.query.toLowerCase();this.options.accent&&(b=this.helper.removeAccent.call(this,b));var c=this,d=a("<ul/>",{"class":this.options.selector.list+(c.helper.isEmpty(c.result)?" empty":""),html:function(){if(c.options.emptyTemplate&&c.helper.isEmpty(c.result)){var d="function"==typeof c.options.emptyTemplate?c.options.emptyTemplate.call(c,c.query):c.options.emptyTemplate.replace(/\{\{query}}/gi,c.query.sanitize());return d instanceof jQuery&&"LI"===d[0].nodeName?d:a("<li/>",{"class":c.options.selector.empty,html:a("<a/>",{href:"javascript:;",html:d})})}for(var e in c.result)c.result.hasOwnProperty(e)&&!function(d,e,f){var g,h,i,j,k=e.group,l=[],m=c.options.source[e.group].display||c.options.display,n=c.options.source[e.group].href||c.options.href;c.options.group&&(c.options.group[1]?"function"==typeof c.options.group[1]?k=c.options.group[1](e):"string"==typeof c.options.group[1]&&(k=c.options.group[1].replace(/(\{\{group}})/gi,e[c.options.group[0]]||k)):"boolean"!=typeof c.options.group[0]&&e[c.options.group[0]]&&(k=e[c.options.group[0]]),a(f).find('li[data-search-group="'+k+'"]')[0]||a(f).append(a("<li/>",{"class":c.options.selector.group,html:a("<a/>",{href:"javascript:;",html:k}),"data-search-group":k}))),g=a("<li/>",{"class":c.options.selector.item,html:a("<a/>",{href:function(){return n&&("string"==typeof n?n=n.replace(/\{\{([\w\-\.]+)(?:\|(\w+))?}}/g,function(a,b,d){var f=c.helper.namespace(b,e,"get","");return d&&"raw"===d?f:c.helper.slugify.call(c,f)}):"function"==typeof n&&(n=n(e)),e.href=n),n||"javascript:;"},"data-group":k,"data-index":d,html:function(){if(j=e.group&&c.options.source[e.group].template||c.options.template)"function"==typeof j&&(j=j.call(c,c.query,e)),h=j.replace(/\{\{([\w\-\.]+)(?:\|(\w+))?}}/g,function(a,d,f){var g=String(c.helper.namespace(d,e,"get","")).sanitize();return f&&"raw"===f||c.options.highlight===!0&&b&&~m.indexOf(d)&&(g=c.helper.highlight.call(c,g,b.split(" "),c.options.accent)),g});else{for(var d=0;d<m.length;d++)l.push(e[m[d]]);h='<span class="'+c.options.selector.display+'">'+String(l.join(" ")).sanitize()+"</span>"}(c.options.highlight===!0&&b&&!j||"any"===c.options.highlight)&&(h=c.helper.highlight.call(c,h,b.split(" "),c.options.accent)),a(this).append(h)},click:function(b){return c.options.mustSelectItem&&c.helper.isEmpty(e)?void b.preventDefault():(c.item=e,c.helper.executeCallback.call(c,c.options.callback.onClickBefore,[c.node,a(this),e,b]),void(b.originalEvent&&b.originalEvent.defaultPrevented||b.isDefaultPrevented()||(c.query=c.rawQuery=e[e.matchedKey].toString(),c.node.val(c.query).focus(),c.searchResult(!0),c.buildLayout(),c.hideLayout(),c.helper.executeCallback.call(c,c.options.callback.onClickAfter,[c.node,a(this),e,b]))))},mouseenter:function(b){a(this).closest("ul").find("li.active").removeClass("active"),a(this).closest("li").addClass("active"),c.helper.executeCallback.call(c,c.options.callback.onMouseEnter,[c.node,a(this),e,b])},mouseleave:function(b){a(this).closest("li").removeClass("active"),c.helper.executeCallback.call(c,c.options.callback.onMouseLeave,[c.node,a(this),e,b])}})}),c.options.group?(i=a(f).find('a[data-group="'+k+'"]:last').closest("li"),i[0]||(i=a(f).find('li[data-search-group="'+k+'"]')),a(g).insertAfter(i)):a(f).append(g)}(e,c.result[e],this)}});if(this.buildBackdropLayout(),this.buildHintLayout(),this.options.callback.onLayoutBuiltBefore){var e=this.helper.executeCallback.call(this,this.options.callback.onLayoutBuiltBefore,[this.node,this.query,this.result,d]);e instanceof jQuery&&(d=e)}this.resultContainer.html(d),this.options.callback.onLayoutBuiltAfter&&this.helper.executeCallback.call(this,this.options.callback.onLayoutBuiltAfter,[this.node,this.query,this.result])},buildBackdropLayout:function(){this.options.backdrop&&(this.backdrop.container||(this.backdrop.css=a.extend({opacity:.6,filter:"alpha(opacity=60)",position:"fixed",top:0,right:0,bottom:0,left:0,"z-index":1040,"background-color":"#000"},this.options.backdrop),this.backdrop.container=a("<div/>",{"class":this.options.selector.backdrop,css:this.backdrop.css}).insertAfter(this.container)),this.container.addClass("backdrop").css({"z-index":this.backdrop.css["z-index"]+1,position:"relative"}))},buildHintLayout:function(b){if(this.options.hint){var c=this,d="",b=b||this.result,e=this.query.toLowerCase();if(this.options.accent&&(e=this.helper.removeAccent.call(this,e)),this.hintIndex=null,this.query.length>=this.options.minLength){if(this.hint.container||(this.hint.css=a.extend({"border-color":"transparent",position:"absolute",top:0,display:"inline","z-index":-1,"float":"none",color:"silver","box-shadow":"none",cursor:"default","-webkit-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none"},this.options.hint),this.hint.container=a("<input/>",{type:this.node.attr("type"),"class":this.node.attr("class"),readonly:!0,unselectable:"on",tabindex:-1,click:function(){c.node.focus()}}).addClass(this.options.selector.hint).css(this.hint.css).insertAfter(this.node),this.node.parent().css({position:"relative"})),this.hint.container.css("color",this.hint.css.color),e)for(var f,g,h,i=0;i<b.length;i++){g=b[i].group,f=this.options.source[g].display||this.options.display;for(var j=0;j<f.length;j++)if(h=String(b[i][f[j]]).toLowerCase(),this.options.accent&&(h=this.helper.removeAccent.call(this,h)),0===h.indexOf(e)){d=String(b[i][f[j]]),this.hintIndex=i;break}if(null!==this.hintIndex)break}this.hint.container.val(d.length>0&&this.rawQuery+d.substring(this.query.length)||"")}}},buildDropdownLayout:function(){function b(a){"*"===a.value?delete this.filters.dropdown:this.filters.dropdown=a,this.container.removeClass("filter").find("."+this.options.selector.filterValue).html(a.display||a.value),this.node.trigger("dynamic"+c),this.node.focus()}if(this.options.dropdownFilter){var d,e=this;if("boolean"==typeof this.options.dropdownFilter)d="all";else if("string"==typeof this.options.dropdownFilter)d=this.options.dropdownFilter;else if(this.options.dropdownFilter instanceof Array)for(var f=0;f<this.options.dropdownFilter.length;f++)if("*"===this.options.dropdownFilter[f].value&&this.options.dropdownFilter[f].display){d=this.options.dropdownFilter[f].display;break}a("<span/>",{"class":this.options.selector.filter,html:function(){a(this).append(a("<button/>",{type:"button","class":e.options.selector.filterButton,html:"<span class='"+e.options.selector.filterValue+"'>"+d+"</span> <span class='"+e.options.selector.dropdownCaret+"'></span>",click:function(a){a.stopPropagation(),e.container.toggleClass("filter")}})),a(this).append(a("<ul/>",{"class":e.options.selector.dropdown,html:function(){var c=e.options.dropdownFilter;if(~["string","boolean"].indexOf(typeof e.options.dropdownFilter)){c=[];for(var d in e.options.source)e.options.source.hasOwnProperty(d)&&c.push({key:"group",value:d});c.push({key:"group",value:"*",display:"string"==typeof e.options.dropdownFilter&&e.options.dropdownFilter||"All"})}for(var f=0;f<c.length;f++)!function(c,d,f){(d.key||"*"===d.value)&&d.value&&("*"===d.value&&a(f).append(a("<li/>",{"class":"divider"})),a(f).append(a("<li/>",{html:a("<a/>",{href:"javascript:;",html:d.display||d.value,click:function(a){a.preventDefault(),b.apply(e,[d])}})})))}(f,c[f],this)}}))}}).insertAfter(e.container.find("."+e.options.selector.query))}},dynamicFilter:{validate:function(a){var b,c,d=null,e=null;for(var f in this.filters.dynamic)if(this.filters.dynamic.hasOwnProperty(f)&&(c=~f.indexOf(".")?this.helper.namespace(f,a,"get"):a[f],"|"!==this.filters.dynamic[f].modifier||d||(d=c==this.filters.dynamic[f].value||!1),"&"===this.filters.dynamic[f].modifier)){if(c!=this.filters.dynamic[f].value){e=!1;break}e=!0}return b=d,null!==e&&(b=e,e===!0&&null!==d&&(b=d)),!!b},set:function(a,b){var c=a.match(/^([|&])?(.+)/);b?this.filters.dynamic[c[2]]={modifier:c[1]||"|",value:b}:delete this.filters.dynamic[c[2]],this.searchResult(),this.buildLayout()},bind:function(){if(this.options.dynamicFilter)for(var b,d=this,e=0;e<this.options.dynamicFilter.length;e++)b=this.options.dynamicFilter[e],"string"==typeof b.selector&&(b.selector=a(b.selector)),b.selector instanceof jQuery&&b.selector[0]&&b.key&&!function(a){a.selector.off(c).on("change"+c,function(){d.dynamicFilter.set.apply(d,[a.key,d.dynamicFilter.getValue(this)])}).trigger("change"+c)}(b)},getValue:function(a){var b;return"SELECT"===a.tagName?b=a.value:"INPUT"===a.tagName&&("checkbox"===a.type?b=a.checked||null:"radio"===a.type&&a.checked&&(b=a.value)),b}},showLayout:function(){if(!this.container.hasClass("result")&&(this.result.length||this.options.emptyTemplate||this.options.backdropOnFocus)){var b=this;a("html").off(c).one("click"+c+" touchstart"+c,function(){b.hideLayout()}),this.container.addClass([this.result.length||this.options.emptyTemplate&&this.query.length>=this.options.minLength?"result ":"",this.options.hint&&this.query.length>=this.options.minLength?"hint":"",this.options.backdrop||this.options.backdropOnFocus?"backdrop":""].join(" ")),this.helper.executeCallback.call(this,this.options.callback.onShowLayout,[this.node,this.query])}},hideLayout:function(){this.container.removeClass("result hint filter"+(this.options.backdropOnFocus&&a(this.node).is(":focus")?"":" backdrop")),this.options.backdropOnFocus&&this.container.hasClass("backdrop")||(a("html").off(c),this.helper.executeCallback.call(this,this.options.callback.onHideLayout,[this.node,this.query]))},resetLayout:function(){this.result={},this.resultCount=0,this.resultCountPerGroup={},this.resultItemCount=0,this.resultContainer&&this.resultContainer.html(""),this.options.hint&&this.hint.container&&this.hint.container.val("")},__construct:function(){this.extendOptions(),this.unifySourceFormat()&&(this.init(),this.delegateEvents(),this.buildDropdownLayout(),this.dynamicFilter.bind.apply(this),this.helper.executeCallback.call(this,this.options.callback.onReady,[this.node]))},helper:{isEmpty:function(a){for(var b in a)if(a.hasOwnProperty(b))return!1;return!0},removeAccent:function(a){if("string"==typeof a){var b=this.options.accent||d;return a=a.toLowerCase().replace(new RegExp("["+b.from+"]","g"),function(a){return b.to[b.from.indexOf(a)]})}},slugify:function(a){return a=String(a),""!==a&&(a=this.helper.removeAccent.call(this,a),a=a.replace(/[^-a-z0-9]+/g,"-").replace(/-+/g,"-").trim("-")),a},sort:function(a,b,c){var d=function(b){for(var d=0;d<a.length;d++)if("undefined"!=typeof b[a[d]])return c(b[a[d]]);return b};return b=[-1,1][+!!b],function(a,c){return a=d(a),c=d(c),b*((a>c)-(c>a))}},replaceAt:function(a,b,c,d){return a.substring(0,b)+d+a.substring(b+c)},highlight:function(a,b,c){a=String(a);var d=c&&this.helper.removeAccent.call(this,a)||a,e=[];b instanceof Array||(b=[b]),b.sort(function(a,b){return b.length-a.length});for(var f=b.length-1;f>=0;f--)""!==b[f].trim()?b[f]=b[f].replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"):b.splice(f,1);d.replace(new RegExp("(?:"+b.join("|")+")(?!([^<]+)?>)","gi"),function(a,b,c){e.push({offset:c,length:a.length})});for(var f=e.length-1;f>=0;f--)a=this.helper.replaceAt(a,e[f].offset,e[f].length,"<strong>"+a.substr(e[f].offset,e[f].length)+"</strong>");return a},getCaret:function(a){if(a.selectionStart)return a.selectionStart;if(document.selection){a.focus();var b=document.selection.createRange();if(null==b)return 0;var c=a.createTextRange(),d=c.duplicate();return c.moveToBookmark(b.getBookmark()),d.setEndPoint("EndToStart",c),d.text.length}return 0},executeCallback:function(a,b){if(!a)return!1;var c;if("function"==typeof a)c=a;else if(("string"==typeof a||a instanceof Array)&&("string"==typeof a&&(a=[a,[]]),c=this.helper.namespace(a[0],window),"function"!=typeof c))return!1;return c.apply(this,(a[1]||[]).concat(b?b:[]))||!0},namespace:function(a,b,c,d){if("string"!=typeof a||""===a)return!1;for(var e=a.split("."),f=b||window,c=c||"get",g=d||{},h="",i=0,j=e.length;j>i;i++){if(h=e[i],"undefined"==typeof f[h]){if(~["get","delete"].indexOf(c))return"undefined"!=typeof d?d:void 0;f[h]={}}if(~["set","create","delete"].indexOf(c)&&i===j-1){if("set"!==c&&"create"!==c)return delete f[h],!0;f[h]=g}f=f[h]}return f},typeWatch:function(){var a=0;return function(b,c){clearTimeout(a),a=setTimeout(b,c)}}()}},a.fn.typeahead=a.typeahead=function(a){return g.typeahead(this,a)};var g={typeahead:function(b,c){if(c&&c.source&&"object"==typeof c.source){if("function"==typeof b){if(!c.input)return;b=a(c.input)}if(b.length&&"INPUT"===b[0].nodeName)for(var d,e=0;e<b.length;e++)d=1===b.length?b:a(b.selector.split(",")[e].trim()),window.Typeahead[d.selector||c.input]=new f(d,c)}}};"sanitize"in String.prototype||(String.prototype.sanitize=function(){var a={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};return this.replace(/[&<>"'\/]/g,function(b){return a[b]})}),window.console=window.console||{log:function(){}},"trim"in String.prototype||(String.prototype.trim=function(){return this.replace(/^\s+/,"").replace(/\s+$/,"")}),"indexOf"in Array.prototype||(Array.prototype.indexOf=function(a,b){void 0===b&&(b=0),0>b&&(b+=this.length),0>b&&(b=0);for(var c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1}),Object.keys||(Object.keys=function(a){var b,c=[];for(b in a)Object.prototype.hasOwnProperty.call(a,b)&&c.push(b);return c})});