$(window).load(function(){function e(e){e.removeAttribute("type"),e.removeAttribute("data"),e.className="svgfallback"}function t(){if(m===!0){if(p!==!1)return;e(f)}else{var t=[f,b,g],n=t.length,o;for(o=0;n>o;o++)e(t[o])}}function n(e){return e||(e=window.event),e.target||e.srcElement}function o(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0}function i(e){e.preventDefault?e.preventDefault():e.returnValue=!1}function l(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):(e["e"+t+n]=n,e[t+n]=function(){e["e"+t+n](window.event)},e.attachEvent("on"+t,e[t+n]))}function r(){$.Velocity(b,{translateY:[-I,"0px"]}),$.Velocity(g,{translateY:[I,"0px"]}),$.Velocity.RunSequence(h)}function a(){r(),$(P).velocity({translateX:[.8,0],translateY:[4.8,0],scale:[.8,1]},{duration:1e3,loop:!0})}function s(){p===!0?a():r()}function u(){$(k).velocity("fadeOut",{duration:500,display:"none"}),p===!0?($(P).velocity("stop"),$(P).velocity({translateX:[4,0],translateY:[24,0],scale:[0,1]},1e3,function(){$(X).velocity({strokeDashoffset:["0","110"]},1500).velocity({strokeDashoffset:["-110","0"]},1500)})):$(f).velocity("spriteSmotherNSmoke"),$.Velocity.RunSequence(w)}function c(e){var t=n(e);"continue"===t.id?(i(e),s()):o(e)}function d(e){var t=n(e);"blow_out"===t.id?(i(e),u()):"replay"===t.id?window.location.reload():o(e)}var p=Modernizr.smil,m=Modernizr.svg,y=document.getElementById("overlay"),f=document.getElementById("cake_obj"),b=document.getElementById("banner_obj"),g=document.getElementById("balloons_obj"),v=document.getElementById("underlay"),k=document.getElementById("blow_out"),x=document.getElementById("replay"),E=document.getElementById("github"),I=function(){var e=document.body,t=$(e).height();return t}(),h=[{elements:y,properties:{opacity:[0,1]},options:{duration:1500,delay:100,display:"none"}},{elements:f,properties:{scale:[.5,1]},options:{duration:1500}},{elements:b,properties:{translateY:["0px",-I]},options:{duration:4e3,display:"block",sequenceQueue:!1}},{elements:f,properties:"reverse",options:{duration:1500,sequenceQueue:!1}},{elements:k,properties:"fadeIn",options:{duration:500,display:"block"}},{elements:k,properties:"callout.shake"}],w=[{elements:g,properties:{translateY:["0px",I]},options:{duration:5e3,display:"block"}},{elements:x,properties:"fadeIn",options:{duration:500,display:"inline-block"}},{elements:E,properties:"fadeIn",options:{duration:500,display:"inline-block",sequenceQueue:!1}}],B=m?f.contentDocument:null,P=p?B.querySelectorAll(".flame_group"):null,X=p?B.querySelectorAll(".smoke"):null;$.Velocity.RegisterEffect("spriteSmotherNSmoke",{defaultDuration:1e3,calls:[[{backgroundPositionX:["-500px","-500px"]},.15],[{backgroundPositionX:["-1000px","-1000px"]},.15],[{backgroundPositionX:["-1500px","-1500px"]},.15],[{backgroundPositionX:["-2000px","-2000px"]},.15],[{backgroundPositionX:["-2500px","-2500px"]},.15],[{backgroundPositionX:["-3000px","-3000px"]},.25]],reset:{backgroundPositionX:"-3000px"}}),t(),l(y,"click",c),l(v,"click",d)});