/* jquery.js */
/* velocity.js */
/* velocity.ui.js */

$( window ).load(function() {
  // console.log( 'window loaded' );
  //================================================
  //  Cake SVG Variables
  //================================================
  var cakeObj = document.getElementById("cake_obj");        // Get the Object by ID
  var svgCakeDoc = cakeObj.contentDocument;                 // Get the SVG document inside the Object tag
  
  var flames = svgCakeDoc.querySelectorAll("svg .flame_group");
  var smokes = svgCakeDoc.querySelectorAll("svg .smoke");
  //================================================
  //  Balloons SVG Variables
  //================================================
  var balloonsObj = document.getElementById("balloons_obj");  // Get the Object by ID
  var svgBalloonsDoc = balloonsObj.contentDocument;           // Get the SVG document inside the Object tag
  
  var bRow = svgBalloonsDoc.getElementById("b_row");

  var bMinDistance = (function() {
    var balloons = svgBalloonsDoc.getElementById("balloons_svg");
    var bSvgHeight = $(balloons).height(); 
    // console.log("balloonSVG height = " + bSvgHeight);
    var bSvgWidth = $(balloons).width();
    // console.log("balloonSVG width = " + bSvgWidth);
    if (bSvgHeight > bSvgWidth) {
      return ( bSvgHeight / bSvgWidth ) * ( -500 );
    } else {
      return ( -500 );
    }
  }() );

  // console.log("min vertical distance for balloons to float = " + bMinDistance);
  //================================================
  //  Banner SVG Variables
  //================================================ 
  var bannerObj = document.getElementById("banner_obj");      // Get the Object by ID
  var svgBannerDoc = bannerObj.contentDocument;               // Get the SVG document inside the Object tag
  
  var banner = svgBannerDoc.getElementById("banner");
  //================================================
  //  DOM Variables
  //    - when using velocity.js sequence, define variables using DOM 
  //================================================ 
  var overlay = document.getElementById("overlay");
  var underlay = document.getElementById("underlay");
  var blowOutButton = document.getElementById("blow_out");
  var replayButton = document.getElementById("replay");
  //================================================
  //  Velocity Creating Effects
  //    - Requires Velocity.ui.js
  //================================================ 
  $.Velocity.RegisterUI("smokeStroke", {
    defaultDuration: 3000 ,
    calls: [ 
      [ { strokeDashoffset: [ "0", "110"] }, 0.4 ],
      [ { strokeDashoffset: [ "-110", "0"] }, 0.6 ] 
    ]
  });
  $.Velocity.RegisterUI("flameSmother", {
    defaultDuration: 1000 ,
    calls: [ 
      [ { translateX: [ 4 , 0 ] , translateY: [ 24 , 0 ]  , scale: [ 0 , 1 ] }, 1 ]
    ]
  });
  //================================================
  //  Velocity Animation Sequence Objects
  //    - Requires Velocity.ui.js
  //    - Define variables using DOM
  //    - Sequence called using $.Velocity.RunSequence(sequenceName);
  //================================================ 
  var cakeContainerSequence = [
    { elements: overlay , properties: { opacity: [ 0 , 1 ] }, options: { duration: 1500, display: "none"} },    //* CSS */
    { elements: underlay , properties: "fadeIn", options: { duration: 2000 ,sequenceQueue: false} },           //* CSS */
    { elements: cakeObj , properties: { scale: [ 0.5 , 1 ] }, options: { duration: 1500 } },           //* CSS */
    { elements: cakeObj , properties: "reverse", options: { duration: 1500 } },                        //* CSS */                
    { elements: flames , properties: { translateX: [ 0.8 , 0 ], translateY: [ 4.8 , 0 ] , scale: [ 0.8 , 1 ] }, options: { duration: 1000, loop: true } },
    { elements: blowOutButton, properties: "fadeIn", options: { duration: 500, display: "block" , delay: 1000, sequenceQueue: false } },  //* CSS */
    { elements: blowOutButton, properties: "callout.shake" }                                                                              //* CSS */
  ];
  var blowOutSequence = [
    { elements: blowOutButton, properties: "fadeOut", options: { duration: 500, display: "none" } },            //* CSS */
    { elements: flames, properties: "flameSmother" },
    { elements: smokes, properties: "smokeStroke" },
    { elements: banner, properties: { translateY: [ "0px" , "-125px" ] }, options: { duration: 2000 } },
    { elements: bRow, properties: { translateY: bMinDistance }, options: { duration: 5000, sequenceQueue: false } },
    { elements: replayButton, properties: "fadeIn", options: { duration: 500, display: "block" } } //* CSS */ //show replay button at end of animation
  ];
  // var cakeContainerSequence = [
  //   { elements: overlay , properties: { opacity: [ 0 , 1 ] }, options: { duration: 1500, display: "none", complete: function() {console.log( overlay.id  +' complete animation');}} },    //* CSS */
  //   { elements: underlay , properties: "fadeIn", options: { duration: 2000 ,sequenceQueue: false, complete: function() {console.log( underlay.id  +' complete animation');}} },           //* CSS */
  //   { elements: cakeObj , properties: { scale: [ 0.5 , 1 ] }, options: { duration: 1500 , complete: function() {console.log( cakeObj.id  +' complete animation step 1/2');}} },           //* CSS */
  //   { elements: cakeObj , properties: "reverse", options: { duration: 1500 , complete: function() {console.log( cakeObj.id  +' complete animation step 2/2');}} },                        //* CSS */                
  //   { elements: flames , properties: { translateX: [ 0.8 , 0 ], translateY: [ 4.8 , 0 ] , scale: [ 0.8 , 1 ] }, options: { duration: 1000, loop: true } },
  //   { elements: blowOutButton, properties: "fadeIn", options: { duration: 500, display: "block" , delay: 1000, sequenceQueue: false  , complete: function() {console.log( blowOutButton.id  +' complete animation step 1/3: diplay:block');}} },  //* CSS */
  //   { elements: blowOutButton, properties: "callout.shake" , options: { complete: function() {console.log( blowOutButton.id  +' complete animation step 2/3:"callout.shake"');}} }                                                                              //* CSS */
  // ];
  // var blowOutSequence = [
  //   { elements: blowOutButton, properties: "fadeOut", options: { duration: 500, display: "none" , complete: function() {console.log( blowOutButton.id  +' complete animation step 3/3: display:none');}} },            //* CSS */
  //   { elements: flames, properties: "flameSmother" , options: { complete: function() {console.log( flames[0] +' complete animation step 2/2: flameSmother');}} },
  //   { elements: smokes, properties: "smokeStroke" , options: { complete: function() {console.log( smokes[0]  +' complete animation smokeStroke');}} },
  //   { elements: banner, properties: { translateY: [ "0px" , "-125px" ] }, options: {duration: 2000 , complete: function() {console.log( banner.id  +' complete animation step 2/2: drop banner');}} },
  //   { elements: bRow, properties: { translateY: bMinDistance }, options: { duration: 5000, sequenceQueue: false , complete: function() {console.log( bRow.id  +' complete animation float balloons to top');}} },
  //   { elements: replayButton, properties: "fadeIn", options: { duration: 500, display: "block" , complete: function() {console.log( replayButton.id  +' complete animation display:block');}} } //* CSS */ //show replay button at end of animation
  // ];
  //================================================
  //  Event Listener Fallback Function Defined
  //================================================ 
  function eventsFallback( element, functionName ) {
    if (element.addEventListener) {                      //if addEventListener is supported
      element.addEventListener( 'click' , functionName, false );
    } else {                                             //else IE fallback
      element.attachEvent( 'click' , functionName );    
      // console.log('IE fallback .attachEvent. ') ;       
    }
  }
  //================================================
  //  Animation Functions Defined
  //    - functions called by event listeners
  //    - event listeners are added to a parent of the buttons that are clicked 
  //    - (http://www.kirupa.com/html5/handling_events_for_many_elements.htm)
  //================================================ 
  function initialAnimation(event) {
    var clickedItem = event.target.id;                  
    if (clickedItem === 'continue' || 'close') {        //when #continue or #close are clicked
      // console.log('event targeted by ' + clickedItem);
      $(banner).velocity({ translateY: [ "-125px" , "0px" ] });
      $.Velocity.RunSequence(cakeContainerSequence);    //run cakeContainerSequence
    }
    event.stopPropagation();                            //event to stop traversing the DOM under all situations once it gets overheard
  }
  function continuedAnimation(event) {
    var clickedItem = event.target.id;
    if (event.target.id === 'blow_out' ) {              //when #blow_out is clicked
      // console.log('event targeted by ' + clickedItem);
      $(flames)
        .velocity("stop", true );                       //stop running looped animation on flames
      // console.log('flames staggering animation stopped');
      $.Velocity.RunSequence(blowOutSequence);          //run blowOutSequence
      // console.log('blow out animation sequence started');
    } else if (event.target.id === 'replay') {          //when #replay is clicked
      // console.log('event targeted by ' + clickedItem);
      window.location.reload();                         //reload the page
    } 
    event.stopPropagation();                            //event to stop traversing the DOM under all situations once it gets overheard
  }
  //================================================
  //   Event Listener Fallback Functions Called
  //================================================
    eventsFallback(overlay, initialAnimation);
    eventsFallback(underlay, continuedAnimation);
});