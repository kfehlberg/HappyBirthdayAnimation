$(window).load(function(){function e(e,t){e.addEventListener?e.addEventListener("click",t,!1):e.attachEvent("click",t)}function t(e){var t=e.target.id;0||($(m).velocity({translateY:["-125px","0px"]}),$.Velocity.RunSequence(I)),e.stopPropagation()}function o(e){var t=e.target.id;"blow_out"===e.target.id?($(a).velocity("stop",!0),$.Velocity.RunSequence(k)):"replay"===e.target.id&&window.location.reload(),e.stopPropagation()}var n=document.getElementById("cake_obj"),r=n.contentDocument,a=r.querySelectorAll("svg .flame_group"),l=r.querySelectorAll("svg .smoke"),s=document.getElementById("balloons_obj"),i=s.contentDocument,p=i.getElementById("b_row"),d=function(){var e=i.getElementById("balloons_svg"),t=$(e).height(),o=$(e).width();return t>o?t/o*-500:-500}(),u=document.getElementById("banner_obj"),c=u.contentDocument,m=c.getElementById("banner"),y=document.getElementById("overlay"),g=document.getElementById("underlay"),f=document.getElementById("blow_out"),v=document.getElementById("replay");$.Velocity.RegisterUI("smokeStroke",{defaultDuration:3e3,calls:[[{strokeDashoffset:["0","110"]},.4],[{strokeDashoffset:["-110","0"]},.6]]}),$.Velocity.RegisterUI("flameSmother",{defaultDuration:1e3,calls:[[{translateX:[4,0],translateY:[24,0],scale:[0,1]},1]]});var I=[{elements:y,properties:{opacity:[0,1]},options:{duration:1500,display:"none"}},{elements:g,properties:"fadeIn",options:{duration:2e3,sequenceQueue:!1}},{elements:n,properties:{scale:[.5,1]},options:{duration:1500}},{elements:n,properties:"reverse",options:{duration:1500}},{elements:a,properties:{translateX:[.8,0],translateY:[4.8,0],scale:[.8,1]},options:{duration:1e3,loop:!0}},{elements:f,properties:"fadeIn",options:{duration:500,display:"block",delay:1e3,sequenceQueue:!1}},{elements:f,properties:"callout.shake"}],k=[{elements:f,properties:"fadeOut",options:{duration:500,display:"none"}},{elements:a,properties:"flameSmother"},{elements:l,properties:"smokeStroke"},{elements:m,properties:{translateY:["0px","-125px"]},options:{duration:2e3}},{elements:p,properties:{translateY:d},options:{duration:5e3,sequenceQueue:!1}},{elements:v,properties:"fadeIn",options:{duration:500,display:"block"}}];e(y,t),e(g,o)});