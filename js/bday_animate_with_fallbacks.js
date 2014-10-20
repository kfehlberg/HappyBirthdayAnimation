/* modernizr.js */
/* jquery.js */
/* velocity.js */
/* velocity.ui.js */

/*global Modernizr:true */
// var noSmil = true;
// var yesSmil = false;
var yesSmil = Modernizr.smil;
var noSmil = !Modernizr.smil;

$( window ).load(function() {
  // console.log( 'window loaded' );
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //        GLOBAL VARS DEFINED
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  var overlay = document.getElementById("overlay");
  var cakeObj = document.getElementById("cake_obj");
  var bannerObj = document.getElementById("banner_obj"); 
  var balloonsObj = document.getElementById("balloons_obj");
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //        ANIMATION VARIABLES DEFINED
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //================================================ 
  // ALL ANIMATION VARIABLES
  //================================================ 

    var underlay = document.getElementById("underlay");
    var blowOutButton = document.getElementById("blow_out");
    var replayButton = document.getElementById("replay");
    //---------------------------------------
    var minYDistance = (function() {
      var body = document.body;
      var bodyHeight = $(body).height();
      return bodyHeight;
    }() );
    //---------------------------------------
    var openingSequence = [
      { elements: overlay , properties: { opacity: [ 0 , 1 ] }, options: { duration: 1500, delay: 100, display: "none"} },
      { elements: cakeObj , properties: { scale: [ 0.5 , 1 ] }, options: { duration: 1500 } },
      { elements: bannerObj, properties: { translateY: [ "0px" , -minYDistance ] }, options: { duration: 4000, sequenceQueue: false } },   
      { elements: cakeObj , properties: "reverse", options: { duration: 1500, sequenceQueue: false } },
      { elements: blowOutButton, properties: "fadeIn", options: { duration: 500, display: "block" } },
      { elements: blowOutButton, properties: "callout.shake" }  
    ];
    var finishingSequence = [
      { elements: balloonsObj, properties: { translateY: [ "0px", minYDistance ] }, options: { duration: 5000 } },
      { elements: replayButton, properties: "fadeIn", options: { duration: 500, display: "block" } } //show replay button at end of animation
    ];
  //================================================ 
  // SMIL ANIMATION VARIABLES
  //================================================ 
    var svgCakeDoc = cakeObj.contentDocument; // Get the SVG document inside the Object tag
    if ( svgCakeDoc == null ) {
      // console.log('oops. cakeObj.contentDocument is null or undefined - ' + svgCakeDoc );
    } else {
      // console.log('awesome. cakeObj.contentDocument does have a value');
      var flames = svgCakeDoc.querySelectorAll(".flame_group");
      var smokes = svgCakeDoc.querySelectorAll(".smoke");
    }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //        FUNCTIONS DEFINED
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //================================================ 
  // FUNCTION DEF objSvgToPng
  //    -replace svg with png
  //================================================ 
  function objSvgToPng(obj) { 
    if (obj.hasAttribute('type')) {
      var objType = obj.getAttribute('type');
      if (objType === 'image/svg+xml') {
        var objDoc = obj.contentDocument;
        if (objDoc == null) {
          // console.log('Changing svg to png. obj.contentDocument is null or undef so we do not change the visibility');
        } else {
          var svgElem = objDoc.querySelector('svg');
          svgElem.setAttribute('visibility', 'hidden');
        }
        obj.removeAttribute('type');
      }
    }
    if (obj.hasAttribute('data')) {
        // var objData = obj.getAttribute('data');
        // console.log('Original objData = ' + objData);
        obj.removeAttribute('data');
    }
    if (obj.className === 'svg') {
      // var objClass = obj.getAttribute('class');
      // console.log('Original objClass = ' + objClass);
      obj.className = 'svgfallback';
      // var newobjClass = obj.className;
      // console.log('new objClass = ' + newobjClass);
    }
  }
  function imageFallback() {
    // if (!Modernizr.smil) {  //does not support SMIL
    if (noSmil && true ) {  //does not support SMIL
      if (Modernizr.svg) {  //but does support SVG
        objSvgToPng(cakeObj);
        // console.log('Boo.  SMIL animation not supported. But the good news is that SVG IS!');
      } else {
        var svgObjs = [ cakeObj, bannerObj , balloonsObj ];
        var numSvgObjs = svgObjs.length;
        var i;
        for (i=0; i < numSvgObjs; i++) {
          objSvgToPng(svgObjs[i]);
        }
        // console.log('Boo. SMIL and SVG are not supported');
      }
    } else {
      // console.log('YAY! SMIL animation supported!');
    }
  }
  //================================================
  //  FUNCTION EVENTSlisteners  Utilities functions
  //================================================ 
  // function addListeners( element, functionName ) {
  //   if (element.addEventListener) {                      //if addEventListener is supported
  //     element.addEventListener( 'click' , functionName, false );
  //   } else {                                             //else IE fallback
  //     element.attachEvent( 'onclick' , functionName );     
  //     console.log('Event listener added via IE attachEvent fallback');  
  //   }
  // }
  function getTarget(e) {
    if (!e) {
      e = window.event;
      // console.log('event target for IE5-8 = ' + e.srcElement.id);
    }
    // console.log('event target = ' + e.target.id + ' or for IE5-8 = ' + e.srcElement.id);
    return e.target || e.srcElement;                //e.target  is the target of the event e.srcElement is IE5-8 equivalent
  }
  function stopEvent(e) {
    if (!e) {                         //IE5-8
      var e = window.event;           //IE5-8 eventObject is accessed via window
      e.cancelBubble = true;          //IE5-8 equivalent to stopPropagation()
      e.returnValue = false;          //IE5-8 equivalent to preventDefault()
    }
    if (e.stopPropagation) {
      e.stopPropagation();            //Stops event bubbling or capturing further
    }
    if (e.preventDefault) {
      e.preventDefault();             //cancel default behavior of event
    }
    return false;                     //if none of these options work- return: false prevents default behavior and further bubbling
                                      //works in all browsers BUT will stop interpreter from processing any subsequent code within function
  }
    //http://ejohn.org/projects/flexible-javascript-events/#postcomment
  function addEvent(element, eventType, callbackFunc) {
    if (element.addEventListener) {  
      element.addEventListener(eventType, callbackFunc, false); //if addEventListeners works, use it
    } else {
      element['e' + eventType + callbackFunc] = callbackFunc;       //IE5-8 callback method of el 
      element[eventType + callbackFunc] = function() {          //Add second method
        element['e' + eventType + callbackFunc](window.event);    //use it to call previous function
      };
      element.attachEvent('on' + eventType, element[eventType + callbackFunc]); //use attachEvent to call second function which then calls the first
    }
  }
  // //http://ejohn.org/projects/flexible-javascript-events/#postcomment
  // function removeEvent(element, eventType, callbackFunc) {
  //   if (element.removeEventListener) {
  //     element.removeEventListener(eventType, callbackFunc, false);
  //   } else {
  //     element.detachEvent( 'on' + eventType, element[eventType + callbackFunc]);
  //     element[eventType + callbackFunc] = null;
  //   }
  // }
   //================================================
  //  FUNCTION DEF Event Listener Fallback 
  //================================================ 
  // function initialAnimation(e) {
  //   var targetObj = getTarget(e);
  //   if (targetObj.id === 'contiue' || 'close') {
  //     determineOpeningAnimation();
  //   }
  //   // if (e.target.id === 'continue' || 'close') {    //when #continue or #close are clicked
  //     // determineOpeningAnimation();
  //   // } 
  //   stopEvent(event);
  //   // event.stopPropagation(); 
  //                            //event to stop traversing the DOM under all situations once it gets overheard
  // }
  // function continuedAnimation(e) {
  //   var targetObj = getTarget(e);
  //   if (targetObj.id === 'blow_out' ) {              //when #blow_out is clicked
  //     scFinishingAnimation();
  //   } else if (targetObj.id === 'replay') {          //when #replay is clicked
  //     window.location.reload();                         //reload the page
  //   } 
  //   // if (e.target.id === 'blow_out' ) {              //when #blow_out is clicked
  //   //   scFinishingAnimation();
  //   // } else if (e.target.id === 'replay') {          //when #replay is clicked
  //   //   window.location.reload();                         //reload the page
  //   // } 
  //   // event.stopPropagation();                            //event to stop traversing the DOM under all situations once it gets overheard
  //   stopEvent(e);
  // }

  //http://blog.patricktresp.de/2012/02/internet-explorer-8-and-all-the-fun-stuff-e-stoppropagation-e-preventdefault-mousedown/
  
  //================================================ 
  // FUNCTION DEF ANIMATION 
  //================================================ 
    $.Velocity.RegisterUI("spriteSmotherNSmoke", {
      defaultDuration: 1000 ,
      calls: [ 
        [ { 'backgroundPositionX': [ '-500px' , '-500px' ] }, 0.15 ],
        [ { 'backgroundPositionX': [ '-1000px' , '-1000px' ] }, 0.15 ],
        [ { 'backgroundPositionX': [ '-1500px' , '-1500px' ] }, 0.15 ],
        [ { 'backgroundPositionX': [ '-2000px' , '-2000px' ] }, 0.15 ],
        [ { 'backgroundPositionX': [ '-2500px' , '-2500px' ] }, 0.15 ],
        [ { 'backgroundPositionX': [ '-3000px' , '-3000px' ] }, 0.25 ]
      ],
      reset: {'backgroundPositionX': '-3000px' }
    });
  //------------------------------------------------
  function scOpeningAnimation() {
    $.Velocity( bannerObj, { translateY: [ -minYDistance , "0px" ] } ); //move out of view.  animated back to place in cakeContainerSequence
    $.Velocity( balloonsObj, { translateY: [ minYDistance , "0px" ] } ); //move out of view.  animated back to place in blowOutSequence
    $.Velocity.RunSequence(openingSequence);
  }
  function smilOpeningAnimation() {
    scOpeningAnimation();
    $(flames).velocity( { translateX: [ 0.8 , 0 ], translateY: [ 4.8 , 0 ] , scale: [ 0.8 , 1 ]  }, { duration:1000, loop: true });
  }
  function determineOpeningAnimation() {
    // if (Modernizr.smil) {
    if (yesSmil && true) {
    // if (cakeObj.className === 'svg') { //if the svg has not been replaced by png (imageFallback determined svg and smil were supported)
      smilOpeningAnimation();
    } else if (Modernizr.cssanimations) {
      scOpeningAnimation();
    } else {
      $(overlay).velocity("fadeOut");
      // $(underlay).addClassName("showUnderlay");
      // overlay.style.zIndex="0";
      // underlay.style.zIndex="1";
      // console.log('No animation support');
    }
  }
  //------------------------------------------------
  function scFinishingAnimation() {
    $(blowOutButton).velocity( "fadeOut" , { duration: 500, display: "none" } );
    // if (cakeObj.className === 'svg') { //if the svg has not been replaced by png (imageFallback determined svg and smil were supported)
    if (yesSmil && true) {
    // if (Modernizr.smil) {
      $(flames).velocity( "stop");        //stop running looped animation on flames
      $(flames).velocity({ translateX: [ 4 , 0 ] , translateY: [ 24 , 0 ]  , scale: [ 0 , 1 ] }, 1000, function() {
        $(smokes).velocity( { strokeDashoffset: [ "0", "110"] }, 1500 ).velocity( { strokeDashoffset: [ "-110", "0"] }, 1500 );
      });
      $.Velocity.RunSequence(finishingSequence);
    } else {
      $(cakeObj).velocity( "spriteSmotherNSmoke" );
      $.Velocity.RunSequence(finishingSequence);
    }
  }
  //================================================
  //  FUNCTION DEFS animation functions called by event listeners
  //    - event listeners are added to a parent of the buttons that are clicked 
  //    - (http://www.kirupa.com/html5/handling_events_for_many_elements.htm)
  //================================================ 
  function initialAnimation(e) {
    var targetObj = getTarget(e);
    if (targetObj.id === 'contiue' || 'close') {
      determineOpeningAnimation();
    }
    // if (e.target.id === 'continue' || 'close') {    //when #continue or #close are clicked
      // determineOpeningAnimation();
    // } 
    stopEvent(event);
    // event.stopPropagation(); 
                             //event to stop traversing the DOM under all situations once it gets overheard
  }
  function continuedAnimation(e) {
    var targetObj = getTarget(e);
    if (targetObj.id === 'blow_out' ) {              //when #blow_out is clicked
      scFinishingAnimation();
    } else if (targetObj.id === 'replay') {          //when #replay is clicked
      window.location.reload();                         //reload the page
    } 
    // if (e.target.id === 'blow_out' ) {              //when #blow_out is clicked
    //   scFinishingAnimation();
    // } else if (e.target.id === 'replay') {          //when #replay is clicked
    //   window.location.reload();                         //reload the page
    // } 
    // event.stopPropagation();                            //event to stop traversing the DOM under all situations once it gets overheard
    stopEvent(e);
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //        FUNCTIONS CALLED
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  imageFallback();
  // addListeners(overlay, initialAnimation);
  // addListeners(underlay, continuedAnimation);
  addEvent(overlay, 'click', initialAnimation);
  addEvent(underlay, 'click', continuedAnimation);
});