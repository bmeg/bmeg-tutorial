(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(e,t,a){e.exports=a(33)},21:function(e,t,a){},33:function(e,t,a){"use strict";a.r(t);var n=a(1),l=a.n(n),i=a(4),o=a.n(i),r=(a(21),a(7)),c=a(8),s=a(14),d=a(9),h=a(15),m=a(10),u=a.n(m),f=a(13),g=(a(30),a(5)),p=a.n(g),y=a(11),v=a.n(y),E=a(12);a.n(E)()(p.a,v.a);var b=function(e){function t(){var e,a;Object(r.a)(this,t);for(var n=arguments.length,l=new Array(n),i=0;i<n;i++)l[i]=arguments[i];return(a=Object(s.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(l)))).state={selection:[]},a._handleCyCalled=!1,a.handleCy=function(e){if(e!==a._cy||!a._handleCyCalled){a._cy=e,a._handleCyCalled=!0,a.layout=e.layout({name:a.props.dataset.layout}),e.on("tap","edge",function(e){a.setState({selection:[e.target.data()]})}),e.on("tap","node",function(e){a.setState({selection:[e.target.data()]})}),e.on("select",function(e){var t=a._cy.$(":selected");a.setState({selection:t.reduce(function(e,t){return t&&e.push(t.data()),e},[])})}),a.api=e.viewUtilities({neighbor:function(e){return e.closedNeighborhood().union(e.successors()).union(e.predecessors())},neighborSelectTime:500}),a.layout.run(),a.api.enableMarqueeZoom();var t=e.$(":selected");t.length>0?(e.zoom({level:.4,position:t[0].position()}),a.setState({selection:[t[0].data()]})):console.log("no selected element at startup")}},a.zoomToSelected=function(e){a.api.disableMarqueeZoom();var t=a._cy.$(":selected");a.api.zoomToSelected(t)},a.marqueeZoom=function(e){a.api.enableMarqueeZoom()},a.highlightNeighbors=function(e){a.api.disableMarqueeZoom(),a._cy.$(":selected").length>0&&a.api.highlightNeighbors(a._cy.$(":selected"))},a.removeHighlights=function(e){a.api.disableMarqueeZoom(),a.api.removeHighlights()},a.hideSelected=function(e){a.api.disableMarqueeZoom();var t=a._cy.edges(":hidden").connectedNodes(":visible");a.thinBorder(t),a.api.hide(a._cy.$(":selected")),t=a._cy.edges(":hidden").connectedNodes(":visible"),a.thickenBorder(t)},a.hideUnSelected=function(e){a.api.disableMarqueeZoom();var t=a._cy.edges(":hidden").connectedNodes(":visible");a.thinBorder(t),a.api.hide(a._cy.$(":unselected")),t=a._cy.edges(":hidden").connectedNodes(":visible"),a.thickenBorder(t)},a.showAll=function(e){a.api.disableMarqueeZoom();var t=a._cy.edges(":hidden").connectedNodes(":visible");a.thinBorder(t),a.api.show(a._cy.elements())},a.redraw=function(e){a._cy.remove(":hidden"),a._cy.remove(a._cy.edges(":hidden")),a.layout=a._cy.layout({name:a.props.dataset.layout}),a.layout.run()},a.help=function(e){window.M.toast({html:"<i>SHIFT + drag to specify region.  SHIFT + taphold to select neighbors</i>"})},a}return Object(h.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;fetch(this.props.dataset.url).then(function(e){return e.json()}).then(function(t){e.setState({elements:t})})}},{key:"thickenBorder",value:function(e){return e.forEach(function(e){var t=Number(e.css("border-width").substring(0,e.css("border-width").length-2));e.css("border-width",t+2)}),e}},{key:"thinBorder",value:function(e){return e.forEach(function(e){var t=Number(e.css("border-width").substring(0,e.css("border-width").length-2));e.css("border-width",t-2)}),e}},{key:"render",value:function(){if(!this.state.elements)return l.a.createElement("div",null);var e=["_label","cmd","path"].map(function(e){return{Header:e,accessor:e}});return l.a.createElement("div",null,l.a.createElement("div",null,l.a.createElement("nav",null,l.a.createElement("div",{className:"nav-wrapper"},l.a.createElement("ul",{className:"hide-on-med-and-down"},l.a.createElement("li",null,l.a.createElement("a",{href:"#/",onClick:this.hideSelected},l.a.createElement("i",{className:"fas fa-eye left"}),"Hide Selected")),l.a.createElement("li",null,l.a.createElement("a",{href:"#/",onClick:this.hideUnSelected},l.a.createElement("i",{className:"fas fa-eye-slash left"}),"Hide Unselected")),l.a.createElement("li",null,l.a.createElement("a",{href:"#/",onClick:this.showAll},l.a.createElement("i",{className:"material-icons left"},"all_inclusive"),"Show All")),l.a.createElement("li",null,l.a.createElement("a",{href:"#/",onClick:this.zoomToSelected},l.a.createElement("i",{className:"material-icons left"},"zoom_in"),"Zoom To Selected")),l.a.createElement("li",null,l.a.createElement("a",{href:"#/",onClick:this.marqueeZoom},l.a.createElement("i",{className:"material-icons left"},"select_all"),"Marquee Zoom")),l.a.createElement("li",null,l.a.createElement("a",{href:"#/",onClick:this.highlightNeighbors},l.a.createElement("i",{className:"fas fa-highlighter left"}),"Highlight Neighbors")),l.a.createElement("li",null,l.a.createElement("a",{href:"#/",onClick:this.removeHighlights},l.a.createElement("i",{className:"far fa-highlighter left"}),"Remove Highlights")),l.a.createElement("li",null,l.a.createElement("a",{href:"#/",onClick:this.redraw},l.a.createElement("i",{className:"material-icons left"},"refresh"),"Re-Draw")),l.a.createElement("li",null,l.a.createElement("a",{href:"#/",onClick:this.help},l.a.createElement("i",{className:"material-icons left"},"help"),"Help")))))),l.a.createElement("div",null,l.a.createElement(u.a,{elements:this.state.elements,stylesheet:[{selector:"node.unhighlighted",style:{opacity:.3}},{selector:"edge.unhighlighted",style:{opacity:.3}},{selector:"node[path]",style:{shape:"barrel"}},{selector:"node[cmd]",style:{shape:"triangle"}},{selector:"edge",style:{width:1}}],style:{height:this.props.dataset.height,width:this.props.dataset.width,display:"block",overflow:"scroll"},cy:this.handleCy})),l.a.createElement("div",null,l.a.createElement(f.a,{data:this.state.selection,columns:e})))}}]),t}(l.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function w(){var e=document.getElementById("graph");if(e){var t=e.dataset;o.a.render(l.a.createElement(b,{dataset:t}),e)}}window.addEventListener?window.addEventListener("DOMContentLoaded",w):window.attachEvent("onload",w),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[16,1,2]]]);
//# sourceMappingURL=main.f92aadfb.chunk.js.map