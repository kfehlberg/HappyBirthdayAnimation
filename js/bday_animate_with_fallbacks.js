/* modernizr.js */
/* jquery.js */
/* velocity.js */
/* velocity.ui.js */

/*jslint browser: true, plusplus: true */
/*global $, jQuery, alert, console,  Modernizr*/

$(window).load(function () {
    // console.log('window loaded');
    /*=====================
            VARIABLES
    =====================*/
    var smilSupport = Modernizr.smil,
        svgSupport = Modernizr.svg,
        cssTransformsSupport = Modernizr.csstransforms,
        overlay = document.getElementById("overlay"),
        cakeObj = document.getElementById("cake_obj"),
        bannerObj = document.getElementById("banner_obj"),
        balloonsObj = document.getElementById("balloons_obj"),
        underlay = document.getElementById("underlay"),
        blowOutButton = document.getElementById("blow_out"),
        /* button subGroup is the group of buttons that appears at the end of the animation (#replay and 'view on github' */
        buttonSubGroup = document.getElementById("button_subg"),
        /* minYDistance used to determine how far to translate balloonsObj and bannerObj in animation */
        minYDistance = (function () {
            var body = document.body,
                bodyHeight = $(body).height();
            return bodyHeight;
        }()),
        /* Opening animation sequence - Using Velocity.js sequence solution */
        /* http://julian.com/research/velocity/#uiPack */
        openingSequence = [
            { elements: overlay, properties: { opacity: [ 0, 1 ] }, options: { duration: 1500, delay: 100, display: "none"} },
            { elements: cakeObj, properties: { scale: [ 0.5, 1 ] }, options: { duration: 1500 } },
            { elements: bannerObj, properties: { translateY: [ "0px", -minYDistance ] }, options: { duration: 4000, display: "block", sequenceQueue: false } },
            { elements: cakeObj, properties: "reverse", options: { duration: 1500, sequenceQueue: false } },
            { elements: blowOutButton, properties: "fadeIn", options: { duration: 500, display: "block" } },
            { elements: blowOutButton, properties: "callout.shake" }
        ],
        /* Finishing animation sequence - Using Velocity.js sequence solution */
        /* http://julian.com/research/velocity/#uiPack */
        finishingSequence = [
            { elements: balloonsObj, properties: { translateY: [ "0px", minYDistance ] }, options: { duration: 5000, display: "block" } },
            { elements: buttonSubGroup, properties: "fadeIn", options: { duration: 500, display: "inline-block" } }
        ],
        /* SMIL animation vars */
        /* flames and smokes refer to classes inside cake.svg. 
            Conditionally defining them to avoid error in IE for .querySelectorAll and attempting to access content that is not supported */
        svgCakeDoc = svgSupport ? cakeObj.contentDocument : null,                 //    if SVG is supported, Get the SVG document inside the Object tag  
        flames = smilSupport ? svgCakeDoc.querySelectorAll(".flame_group") : null,//    if SMIL animation is supported, any svg element in cake.svg w/ .flame_group
        smokes = smilSupport ? svgCakeDoc.querySelectorAll(".smoke") : null;      //    if SMIL animation is supported, any svg element in cake.svg w/ .smoke

    // console.log('smilSupport = ' + smilSupport);
    // console.log('svgSupport = ' + svgSupport);
    // console.log('svgCakeDoc defined as ' + svgCakeDoc);
    // console.log('flames defined as ' + flames);
    // console.log('smokesdefined as ' + smokes);

    /*=====================
        FUNCTIONS DEF
    =====================*/
    /*---------------------
        Image Fallbacks
    ---------------------*/
    /*  - replaces SVG with PNG */
    /*  - done by removing SVG data and type, and by replacing svg class with svgfallback class
            + png fallbacks are provided in the css file for each element with a svgfallback class */
    /*  - called when:
            + browser does not support SMIL animation. Provide PNG sprite fallback for cakeObj, which can be animated.
            + browser does not support SVG. Provide PNG fallback for all SVG objects. */

    function objSvgToPng(obj) {
        /* if there is svg content in the object, we need to get to the svg element inside and hide it */
        /*  done for cakeObj when SMIL is not supported, so that user can see CSS Sprite animation instead */
        if (obj.contentDocument != null) {
            obj.contentDocument.querySelector('svg').setAttribute('visibility', 'hidden');
        }
        obj.removeAttribute('type');
        obj.removeAttribute('data');
        obj.className = 'svgfallback';
        // console.log(obj.id + ' : new class name = ' + obj.className);
    }
    function imageFallback() {
        if (svgSupport === true) {
            if (smilSupport === false) {
                // console.log('browser DOES support SVG. Calling for ONLY cakeObj to be changed to PNG for animation fallback');
                objSvgToPng(cakeObj);
            } else {
                // console.log('YAY! SMIL animation supported. No image fallbacks needed.');
                return;
            }
        } else {
            // console.log('browser does NOT support SMIL or SVG. calling for PNG fallbacks for all objects with svg content');
            var svgObjs = [ cakeObj, bannerObj, balloonsObj ],
                numSvgObjs = svgObjs.length,
                i;
            for (i = 0; i < numSvgObjs; i++) {
                // console.log('calling objSvgToPng for ' + svgObjs[i].id);
                objSvgToPng(svgObjs[i]);
            }
        }
    }

    /*---------------------
        Events Functions
    ---------------------*/
    /*  Get event.target - with IE5-8 alternative */
    /*  in IE5-8: window.event; e.srcElement; */
    function getTarget(e) {
        if (!e) {
            e = window.event;
        }
        return e.target || e.srcElement;
    }

    /*  stopPropagation of event - w/ IE5-8 alternative */
    /*  in IE5-8: event.cancelBubble = true; */
    function stopProp(e) {
        if (e.stopPropagation) {
            // console.log('stopPropagation');
            e.stopPropagation();
        } else {
            // console.log('ie5-8 alternative for stopPropagation');
            e.cancelBubble = true;
        }
    }

    /* preventDefault behavior of element - w/ IE5-8 alternative */
    /* in IE5-8: e.returnValue = false */
    function prevDef(e) {
        if (e.preventDefault) {
            // console.log('prevent default behavior');
            e.preventDefault();
        } else {
            // console.log('calling ie5-8 alternative for preventDefault');
            e.returnValue = false;
        }
    }

    /* addEventListener - w/ IE5-8 alternative */
    /* In IE5-8: el.attachEvent('on-event', callback()) */
    /* http://ejohn.org/projects/flexible-javascript-events/#postcomment */
    function addEvent(element, eventType, callbackFunc) {
        if (element.addEventListener) {
            element.addEventListener(eventType, callbackFunc, false);
        } else {
            element['e' + eventType + callbackFunc] = callbackFunc;
            element[eventType + callbackFunc] = function () {
                element['e' + eventType + callbackFunc](window.event);
            };
            element.attachEvent('on' + eventType, element[eventType + callbackFunc]);
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

    /*---------------------
        Animation Functions
    ---------------------*/
    /* Hide certain elements before animation, to avoid disruptive flash */
    /* Each element to be revealled in an animation step */
    function hideEls() {
        var elsToHide = [ blowOutButton, buttonSubGroup, balloonsObj, bannerObj ],
            numElsToHide = elsToHide.length,
            i;
        for (i = 0; i < numElsToHide; i++) {
            // console.log('calling elsToHide for ' + elsToHide[i].id);
            elsToHide[i].style.display = 'none';
        }
    }
    /* Custom Effect Registration */
    /*  Sprite animation to go along with cake500.png */
    /*  http://julian.com/research/velocity/#uiPack */
    /*          formerly, 'RegisterUI' - legacy name. changed 2/2015 */
    $.Velocity.RegisterEffect("spriteSmotherNSmoke", {
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

    /* scOpeningAnimation() */
    /* used in browsers that support SMIL animation(smilOpeningAnimation) AND in browsers that do not */
    /*  -   move bannerObj out of view.  animated back to place in cakeContainerSequence
        -   move balloonsObj out of view.  animated back to place in blowOutSequence
        -   run openingSequence */
    function scOpeningAnimation() {
        // console.log('starting scOpeningAnimation');
        hideEls();
        $.Velocity(bannerObj, { translateY: [ -minYDistance, "0px" ] });
        $.Velocity(balloonsObj, { translateY: [ minYDistance, "0px" ] });
        $.Velocity.RunSequence(openingSequence);
    }

    /* SmilOpeningAnimation() */
    /* ONLY used in browsers that support SMIL animation */
    /*  -   call scOpeningAnimation
        -   finish with SMIL animation of flames in cakeObj */
    function smilOpeningAnimation() {
        // console.log('starting smilOpeningAnimation');
        // console.log('calling scOpeningAnimation');
        scOpeningAnimation();
        // console.log('continuing smilOpeningAnimation of flames flickering');
        $(flames).velocity({ translateX: [ 0.8, 0 ], translateY: [ 4.8, 0 ], scale: [ 0.8, 1 ] }, { duration: 1000, loop: true });
    }

    /* determineOpeningAnimation() */
    /* call appropriate animation function depending on browser support */
    function determineOpeningAnimation() {
        if (smilSupport === true) {
            // console.log('calling smilOpeningAnimation');
            smilOpeningAnimation();
        } else if (cssTransformsSupport === true) {
            // console.log('calling scOpeningAnimation');
            scOpeningAnimation();
        } else {
            // console.log('no support for anything fun...serving boring fallback');
            blowOutButton.style.display = 'none'; //hide because there is no blowOut animation 
            buttonSubGroup.style.display = 'none'; //hide until fadeIn
            $.Velocity(overlay, "fadeOut", { duration: 1500, delay: 100, display: "none" });//, complete: function () { console.log('step1 done'); } });
            $.Velocity(buttonSubGroup, "fadeIn", { duration: 600, delay: 1600, display: "inline-block"});//, complete: function () { console.log('step2 done'); } });
        }
    }

    /* scFinishingAnimation() */
    /* determine which animation to apply and apply it */
    /*  -   fade blow_out button out for all
        -   for SMIL - stop flame flicker animation and run blow out animation
        -   or else - sprite animation for blow out
        -   run finishing Sequence for all */
    function scFinishingAnimation() {
        // console.log('starting scFinishingAnimation');
        $(blowOutButton).velocity("fadeOut", { duration: 500, display: "none" });
        if (smilSupport === true) {
            // console.log('starting smil blow out animation');
            $(flames).velocity("stop");
            $(flames).velocity({ translateX: [ 4, 0 ], translateY: [ 24, 0 ], scale: [ 0, 1 ] }, 1000, function () {
                $(smokes).velocity({ strokeDashoffset: [ "0", "110"] }, 1500).velocity({ strokeDashoffset: [ "-110", "0"] }, 1500);
            });
        } else {
            // console.log('starting spriteSmotherNSmoke animation');
            $(cakeObj).velocity("spriteSmotherNSmoke");
        }
        $.Velocity.RunSequence(finishingSequence);
    }

    /*---------------------
        Functions called by Event Listeners
        - event listeners are added to a parent of the buttons that are clicked 
        - http://www.kirupa.com/html5/handling_events_for_many_elements.htm
    ---------------------*/

    /* Inital Animation */
    /*  event listener attached to #overlay  */
    /*  when 'continue' button is clicked, preventDefault behavior and start the animation */
    /*  when anything else is clicked within #overlay, stopPropagation so that user may follow any links */
    function initialAnimation(e) {
        var targetObj = getTarget(e);
        // console.log('targetObj for initialAnimation = ' + targetObj.id);
        if (targetObj.id === 'continue') {
            prevDef(e);
            // console.log('(initialAnimation)called prevDef for ' + targetObj.id + ' on click');
            // console.log('calling determineOpeningAnimation');
            determineOpeningAnimation();
        } else {
            // console.log('(initialAnimation)calling stopProp for ' + targetObj.id + ' on click');
            stopProp(e);
        }
    }

    /* Continued Animation */
    /*  event listener attached to #underlay  */
    /*  when 'blow_out' button is clicked, preventDefault behavior and start the animation */
    /*  when 'replay' button is clicked, reload page */
    /*  when anything else is clicked within #underlay, stopPropagation so that user may follow any links */
    function continuedAnimation(e) {
        var targetObj = getTarget(e);
        // console.log('targetObj for continuedAnimation = ' + targetObj.id);
        if (targetObj.id === 'blow_out') {               //  * when #blow_out is clicked
            prevDef(e);                                   //    prevent default click behavior
            // console.log('(contiunedAnimation)called prevDef for ' + targetObj.id + ' on click');
            // console.log('calling scFinishingAnimation');
            scFinishingAnimation();                       //    call to determine which animation to use/use it 
        } else if (targetObj.id === 'replay') {           //  * when #replay is clicked
            window.location.reload();                     //    reload the page
        } else {                                          //  * when user clicks elsewhere (like #github button) in #underlay
            // console.log('(contiunedAnimation)calling stopProp for ' + targetObj.id + ' on click');
            stopProp(e);                                  //    stops Propagation so that user may follow link
        }
    }

    /*=====================
      FUNCTIONS CALLED
    =====================*/
    imageFallback();
    addEvent(overlay, 'click', initialAnimation);
    addEvent(underlay, 'click', continuedAnimation);
});