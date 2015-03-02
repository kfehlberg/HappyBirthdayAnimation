// /* modernizr.js */
// /* jquery.js */
// /* velocity.js */
// /* velocity.ui.js */

/*jslint browser: true, plusplus: true */
/*global $, jQuery, alert, console,  Modernizr*/


    // console.log('smilSupport = ' + smilSupport);
    // console.log('svgSupport = ' + svgSupport);
$(window).load(function () {
    // console.log( 'window loaded' );
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //        GLOBAL VARS DEFINED
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var smilSupport = Modernizr.smil,
        svgSupport = Modernizr.svg,
        overlay = document.getElementById("overlay"),
        cakeObj = document.getElementById("cake_obj"),
        bannerObj = document.getElementById("banner_obj"),
        balloonsObj = document.getElementById("balloons_obj"),
        underlay = document.getElementById("underlay"),
        blowOutButton = document.getElementById("blow_out"),
        replayButton = document.getElementById("replay"),
        githubButton = document.getElementById("github"),
        minYDistance = (function () {
            var body = document.body,
                bodyHeight = $(body).height();
            return bodyHeight;
        }()),
        openingSequence = [
            { elements: overlay, properties: { opacity: [ 0, 1 ] }, options: { duration: 1500, delay: 100, display: "none"} },
            { elements: cakeObj, properties: { scale: [ 0.5, 1 ] }, options: { duration: 1500 } },
            { elements: bannerObj, properties: { translateY: [ "0px", -minYDistance ] }, options: { duration: 4000, display: "block", sequenceQueue: false } },
            { elements: cakeObj, properties: "reverse", options: { duration: 1500, sequenceQueue: false } },
            { elements: blowOutButton, properties: "fadeIn", options: { duration: 500, display: "block" } },
            { elements: blowOutButton, properties: "callout.shake" }
        ],
        finishingSequence = [
            { elements: balloonsObj, properties: { translateY: [ "0px", minYDistance ] }, options: { duration: 5000, display: "block" } },
            { elements: replayButton, properties: "fadeIn", options: { duration: 500, display: "inline-block" } }, //show replay button at end of animation
            { elements: githubButton, properties: "fadeIn", options: { duration: 500, display: "inline-block", sequenceQueue: false } } //show github button at end of animation
        ],
        //__________SMIL ANIMATION VARS____________
        svgCakeDoc = svgSupport ? cakeObj.contentDocument : null,                 //    if SVG is supported, Get the SVG document inside the Object tag  
        flames = smilSupport ? svgCakeDoc.querySelectorAll(".flame_group") : null,//    if SMIL animation is supported, any svg element in cake.svg w/ .flame_group
        smokes = smilSupport ? svgCakeDoc.querySelectorAll(".smoke") : null;      //    if SMIL animation is supported, any svg element in cake.svg w/ .smoke
        // console.log('flames defined as ' + flames);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //        FUNCTIONS DEFINED
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //================================================ 
    // FUNCTION DEF objSvgToPng
    //    -replace SVG with PNG
    //    -done by removing SVG data, type, and by replacing svg class with svgfallback class
    //          + png fallbacks are provided in the css file for each element with a svgfallback class
    //    -called when:
    //          + browser does not support SMIL animation. Provide PNG sprite fallback for cakeObj, which can be animated.
    //          + browser does not support SVG. Provide PNG fallback for all SVG objects.
    //================================================ 
    function objSvgToPng(obj) {
        if (obj.hasAttribute('type')) {
            var objType = obj.getAttribute('type');
            if (objType === 'image/svg+xml') {
                var objDoc = obj.contentDocument;
                if (objDoc != null) {                               //  if there is svg content in object (if svg is supported and displayed)
                    var svgElem = objDoc.querySelector('svg');      //  svg tag inside of object
                    svgElem.setAttribute('visibility', 'hidden');   //  hide svg (so that we can serve png image)
                }
                // else {

                //    console.log('Changing svg to png. obj.contentDocument is null or undef so we do not change the visibility');
                // }
                obj.removeAttribute('type');
            }
        }
        if (obj.hasAttribute('data')) {
            obj.removeAttribute('data');
        }
        if (obj.className === 'obsvg') {
            obj.className = 'svgfallback';
            // var newobjClass = obj.className;
            // console.log('new objClass = ' + newobjClass);
        }
    }
    function imageFallback() {
        if (smilSupport && false) {               //  * if the browser does not support SMIL
            if (svgSupport && true) {            //    * but does support SVG
                objSvgToPng(cakeObj);       //      Only change the cake.svg to png (to be animated as a sprite)
                // console.log('Boo.  SMIL animation not supported. But the good news is that SVG IS!');
            } else {                        //    * if browser does not support SVG
                var svgObjs = [ cakeObj, bannerObj, balloonsObj ],
                    numSvgObjs = svgObjs.length,
                    i;
                for (i = 0; i < numSvgObjs; i++) {
                    objSvgToPng(svgObjs[i]); //     Go through list of svg objects and change them to png
                }
                // console.log('Boo. SMIL and SVG are not supported');
            }
        }
        // else {
        //   // console.log('YAY! SMIL animation supported!');
        // }
    }
    //================================================
    //  FUNCTION EVENTSlisteners  Utilities functions
    //================================================ 
    function getTarget(e) {
        if (!e) {
            e = window.event;
          // console.log('event target for IE5-8 = ' + e.srcElement.id);
        }
        // console.log('event target = ' + e.target.id + ' or for IE5-8 = ' + e.srcElement.id);
        return e.target || e.srcElement;  //e.target  is the target of the event e.srcElement is IE5-8 equivalent
    }
    function stopProp(e) {
        if (!e) {                           //  * IE5-8
            e.cancelBubble = true;          //    IE5-8 equivalent to stopPropagation()
        } else if (e.stopPropagation) {     //  * Supports .stopPropagation 
            e.stopPropagation();            //    Stops event bubbling or capturing further
        } else {                            //  * if none of these options work- 
            return false;                   //    return false will preventDefault and stopPropagation
            //works in all browsers BUT will stop interpreter from processing any subsequent code within function
        }
    }
    function prevDef(e) {
        if (!e) {                           //  * IE5-8
            e.returnValue = false;          //    IE5-8 equivalent to preventDefault()
        } else if (e.preventDefault) {      //  * Supports .preventDefault
            e.preventDefault();             //    cancel default behavior of event
        } else {                            //  * if none of these options work- 
            return false;                   //    - return false will preventDefault and stopPropagation
            //works in all browsers BUT will stop interpreter from processing any subsequent code within function
        }
    }
    //http://ejohn.org/projects/flexible-javascript-events/#postcomment
    function addEvent(element, eventType, callbackFunc) {
        if (element.addEventListener) {
            element.addEventListener(eventType, callbackFunc, false); //if addEventListeners works, use it
        } else {
            element['e' + eventType + callbackFunc] = callbackFunc;   //IE5-8 callback method of el 
            element[eventType + callbackFunc] = function () {          //Add second method
                element['e' + eventType + callbackFunc](window.event);  //use it to call previous function
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
    //http://blog.patricktresp.de/2012/02/internet-explorer-8-and-all-the-fun-stuff-e-stoppropagation-e-preventdefault-mousedown/
    //================================================ 
    // FUNCTION DEF ANIMATION 
    //================================================ 
    $.Velocity.RegisterUI("spriteSmotherNSmoke", {
        defaultDuration: 1000,
        calls: [
            [ { 'backgroundPositionX': [ '-500px', '-500px' ] }, 0.15 ],
            [ { 'backgroundPositionX': [ '-1000px', '-1000px' ] }, 0.15 ],
            [ { 'backgroundPositionX': [ '-1500px', '-1500px' ] }, 0.15 ],
            [ { 'backgroundPositionX': [ '-2000px', '-2000px' ] }, 0.15 ],
            [ { 'backgroundPositionX': [ '-2500px', '-2500px' ] }, 0.15 ],
            [ { 'backgroundPositionX': [ '-3000px', '-3000px' ] }, 0.25 ]
        ],
        reset: {'backgroundPositionX': '-3000px' }
    });
    //------------------------------------------------
    function scOpeningAnimation() { //used in browsers that support SMIL animation(smilOpeningAnimation) AND in browsers that do not
        $.Velocity(bannerObj, { translateY: [ -minYDistance, "0px" ] });   //  move out of view.  animated back to place in cakeContainerSequence
        $.Velocity(balloonsObj, { translateY: [ minYDistance, "0px" ] });  //  move out of view.  animated back to place in blowOutSequence
        $.Velocity.RunSequence(openingSequence);
    }
    function smilOpeningAnimation() {
        scOpeningAnimation();
        $(flames).velocity({ translateX: [ 0.8, 0 ], translateY: [ 4.8, 0 ], scale: [ 0.8, 1 ] }, { duration: 1000, loop: true }); // flickering flame animation
    }
    function determineOpeningAnimation() {
        if (smilSupport && true) { //if SMIL is supported
            smilOpeningAnimation();
        } else {
            scOpeningAnimation();
        }
        // else {
        //   $(overlay).velocity("fadeOut");
        //   // $(underlay).addClassName("showUnderlay");
        //   // overlay.style.zIndex="0";
        //   // underlay.style.zIndex="1";
        //   // console.log('No animation support');
        // }
    }
    //------------------------------------------------
    function scFinishingAnimation() {
        $(blowOutButton).velocity("fadeOut", { duration: 500, display: "none" });
        if (smilSupport && true) {                                        //  * if SMIL animation is supported
            $(flames).velocity("stop");                              //    stop running looped animation on flames
            $(flames).velocity({ translateX: [ 4, 0 ], translateY: [ 24, 0 ], scale: [ 0, 1 ] }, 1000, function () {
                $(smokes).velocity({ strokeDashoffset: [ "0", "110"] }, 1500).velocity({ strokeDashoffset: [ "-110", "0"] }, 1500);
            });                                                       //    sequence of flames blown out and smoke rising 
            $.Velocity.RunSequence(finishingSequence);                //    call finishing sequence
        } else {                                                      //  * if SMIL animation is NOT supported,
            $(cakeObj).velocity("spriteSmotherNSmoke");             //    use sprite animation for blowing out candles
            $.Velocity.RunSequence(finishingSequence);                //    then call finishing sequence
        }
    }
    //================================================
    //  FUNCTION DEFS animation functions called by event listeners
    //    - event listeners are added to a parent of the buttons that are clicked 
    //    - http://www.kirupa.com/html5/handling_events_for_many_elements.htm
    //================================================ 
    function initialAnimation(e) {
        var targetObj = getTarget(e);
        if (targetObj.id === 'continue') {                          //  * when #continue is clicked
            determineOpeningAnimation();                            //    call function to figure out which animation to use/use it
            prevDef(e);                                             //    prevent default click behavior
        } else if (targetObj.id === 'modernizr' || 'velocity') {    //  * when user clicks on #modernizr or #velocity links
            stopProp(e);                                            //    stops Propagation so that user may follow link
        } else {                                                    //  * when user clicks somewhere in #overlay that is not one of the links or buttons above
            prevDef(e);
        }
    }
    function continuedAnimation(e) {
        var targetObj = getTarget(e);
        if (targetObj.id === 'blow_out') {               //  * when #blow_out is clicked
            scFinishingAnimation();                       //    call to determine which animation to use/use it
            prevDef(e);                                   //    prevent default click behavior
        } else if (targetObj.id === 'replay') {           //  * when #replay is clicked
            window.location.reload();                     //    reload the page
        } else if (targetObj.id === 'github') {           //  * when #github link is clicked
            stopProp(e);                                  //    stops Propagation so that user may follow link
        } else {                                          //  * when user clicks somewhere in #underlay that is not one of the links or buttons above
            prevDef(e);
        }
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //        FUNCTIONS CALLED
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    imageFallback();
    addEvent(overlay, 'click', initialAnimation);
    addEvent(underlay, 'click', continuedAnimation);
});