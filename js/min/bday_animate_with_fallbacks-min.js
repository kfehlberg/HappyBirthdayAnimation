var yesSmil=Modernizr.smil,noSmil=!Modernizr.smil;$(window).load(function(){function e(e){if(e.hasAttribute("type")){var t=e.getAttribute("type");if("image/svg+xml"===t){var o=e.contentDocument,n=o.querySelector("svg");n.setAttribute("visibility","hidden"),e.removeAttribute("type")}}if(e.hasAttribute("data")){var i=e.getAttribute("data");console.log("Original objData = "+i),e.removeAttribute("data")}if("svg"===e.className){var a=e.getAttribute("class");console.log("Original objClass = "+a),e.className="svgfallback";var s=e.className;console.log("new objClass = "+s)}}function t(){if(noSmil)if(Modernizr.svg)e(u),console.log("Boo.  SMIL animation not supported. But the good news is that SVG IS!");else{var t=[u,d,p],o=t.length,n;for(n=0;o>n;n++)e(t[n]);console.log("Boo. SMIL and SVG are not supported")}else console.log("YAY! SMIL animation supported!")}function o(e,t){e.addEventListener?e.addEventListener("click",t,!1):e.attachEvent("click",t)}function n(){$.Velocity(d,{translateY:[-v,"0px"]}),$.Velocity(p,{translateY:[v,"0px"]}),$.Velocity.RunSequence(b)}function i(){n(),$(k).velocity({translateX:[.8,0],translateY:[4.8,0],scale:[.8,1]},{duration:1e3,loop:!0})}function a(){yesSmil?i():Modernizr.cssanimations?n():($(c).velocity("fadeOut",{display:"none"}),console.log("No animation support"))}function s(){$(g).velocity("fadeOut",{duration:500,display:"none"}),yesSmil?($(k).velocity("stop"),$(k).velocity({translateX:[4,0],translateY:[24,0],scale:[0,1]},1e3,function(){$(x).velocity({strokeDashoffset:["0","110"]},1500).velocity({strokeDashoffset:["-110","0"]},1500)}),$.Velocity.RunSequence(f)):($(u).velocity("spriteSmotherNSmoke"),$.Velocity.RunSequence(f))}function l(e){0||a(),e.stopPropagation()}function r(e){"blow_out"===e.target.id?s():"replay"===e.target.id&&window.location.reload(),e.stopPropagation()}console.log("window loaded");var c=document.getElementById("overlay"),u=document.getElementById("cake_obj"),d=document.getElementById("banner_obj"),p=document.getElementById("balloons_obj"),m=document.getElementById("underlay"),g=document.getElementById("blow_out"),y=document.getElementById("replay"),v=function(){var e=document.body,t=$(e).height();return t}(),b=[{elements:c,properties:{opacity:[0,1]},options:{duration:1500,delay:100,display:"none"}},{elements:u,properties:{scale:[.5,1]},options:{duration:1500}},{elements:d,properties:{translateY:["0px",-v]},options:{duration:4e3,sequenceQueue:!1}},{elements:u,properties:"reverse",options:{duration:1500,sequenceQueue:!1}},{elements:g,properties:"fadeIn",options:{duration:500,display:"block"}},{elements:g,properties:"callout.shake"}],f=[{elements:p,properties:{translateY:["0px",v]},options:{duration:5e3}},{elements:y,properties:"fadeIn",options:{duration:500,display:"block"}}],S=u.contentDocument,k=S.querySelectorAll("svg .flame_group"),x=S.querySelectorAll("svg .smoke");$.Velocity.RegisterUI("spriteSmotherNSmoke",{defaultDuration:1e3,calls:[[{backgroundPositionX:["-500px","-500px"]},.15],[{backgroundPositionX:["-1000px","-1000px"]},.15],[{backgroundPositionX:["-1500px","-1500px"]},.15],[{backgroundPositionX:["-2000px","-2000px"]},.15],[{backgroundPositionX:["-2500px","-2500px"]},.15],[{backgroundPositionX:["-3000px","-3000px"]},.25]],reset:{backgroundPositionX:"-3000px"}}),t(),o(c,l),o(m,r)});