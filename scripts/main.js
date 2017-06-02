// This is an example of a version of the module pattern in javascript.
// It is useful as it protects out code from being overwritten by other
// javascript that may be imported into the LMS or page.



;var pageModule = (function () {
  
  // use strict helps us catch errors when linting.
  'use strict';
  
  // Module object that is returned
  var module = {};
  
  // https://philipwalton.com/articles/loading-polyfills-only-when-needed/
  // Use modernizr to check for css grid
  // If init doesn't find grid, load polyfill
  // Check on browser stack.
  function loadScript(src, done) {
    var js = document.createElement('script');
    js.src = src;
    js.onload = function() {
      done();
    };
    js.onerror = function() {
      done(new Error('Failed to load script ' + src));
    };
    document.head.appendChild(js);
  }
  
  // This is a private function that can't be
  // accessed from outside our module.
  function resizeParticles() {
    var canvasContainer = document.querySelector('#euro-map');
    var canvas = document.querySelector('.particles-js-canvas-el');
    console.log(canvasContainer.clientHeight);
    // canvas.width = canvasContainer.width;
    canvas.height = canvasContainer.clientHeight;
  }
  
  // This is a public function that can be accessed from
  // outside this module as you can see with the
  // pageModule.init(); code at the bottom.
  module.init = function () {
    
    // particlesJS.load('euro-map', 'scripts/vendors/particlesjs-config.json', function() {
      
    // });
    
    // window.addEventListener('load', function () {
    //   particlesJS.load('euro-map', 'scripts/vendors/particlesjs-config.json', function() {
    //     console.log('callback - particles.js config loaded');
    //     resizeParticles();
    //     window.onresize = function() { 
    //       resizeParticles();
    //     };
    //   });
    // });
    
    // if (Modernizr.cssgrid) {
    //   console.log('Got grids!');
    // } else {
    //   // not-supported
    // }
    
    
    // resizeParticles();
    
  };
  
  // The pageModule variable above basically becomes our module object
  // so we can call any functions and variables attached to it.
  return module;
  
})();

pageModule.init();
