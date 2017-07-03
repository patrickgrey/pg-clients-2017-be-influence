// This is an example of a version of the module pattern in javascript.
// It is useful as it protects out code from being overwritten by other
// javascript that may be imported into the LMS or page.



;var pageModule = (function () {
  
  // use strict helps us catch errors when linting.
  'use strict';
  
  // Module object that is returned
  var module = {},
      currentFlag = 'sco';
  
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
    // console.log(canvasContainer.clientHeight);
    // canvas.width = canvasContainer.width;
    canvas.height = canvasContainer.clientHeight;
  }
  
  function getTranslations () {
    
    var request;
    
    var request = typeof XMLHttpRequest != 'undefined'
    ? new XMLHttpRequest()
    : new ActiveXObject('Microsoft.XMLHTTP');
    
    request.open('GET', 'scripts/translations.json', true);
    // AddEventListeners didn't work in Chrome
    request.onreadystatechange = function (aEvt) {
      if (request.readyState == 4) {
        if(request.status == 200) {
          var data = JSON.parse(request.responseText)
          translationSuccess(data);
        }
        else {
          translationFail();
        }
      }
    };
    
    request.send(null);
  }
  
  function translationSuccess (_data) {
    // console.log(_data);
    var translations = document.getElementById('be-translations');
    translations.classList.add('be-translations-show');
    initTranslations(_data);
  }
  
  function translationFail () {
    console.log('fail!');
    var translations = document.getElementById('be-translations');
    translations.style.display = 'none';
  }
  
  function initTranslations (_data) {
    var data = _data;
    var frenchButton = document.getElementById('be-tranlsation-button-1');
    var germanButton = document.getElementById('be-tranlsation-button-2');
    var spanishButton = document.getElementById('be-tranlsation-button-3');
    // console.log(frenchButton);
    frenchButton.addEventListener('click', function (e) {
      e.preventDefault();
      handleFlagClick(this, this.getAttribute('data-flag-current'), data);
      // currentFlag = this.getAttribute('data-flag-current');
      // translate(data[currentFlag]);
    });
    
    germanButton.addEventListener('click', function (e) {
      e.preventDefault();
      handleFlagClick(this, this.getAttribute('data-flag-current'), data);
    });
    
    spanishButton.addEventListener('click', function (e) {
      e.preventDefault();
      handleFlagClick(this, this.getAttribute('data-flag-current'), data);
    });
  }
  
  function handleFlagClick (_button, _flagCode, _data) {
    translate(_data[_flagCode]);
    _button.setAttribute('data-flag-current', currentFlag);
    var image = _button.querySelector('.be-language');
    image.src = 'images/'+currentFlag+'.svg';
    currentFlag = _flagCode;
    // console.log(image);
    // _button.src = '';
    // set global currentFlag
    // Change src
  }
  
  function translate (_language) {
    // loop through objects - object id should be data-id on element
    // console.log(_language);
    var language = _language;
    for (var element in language) {
      if (language.hasOwnProperty(element)) {
        // console.log('[data-translation="'+element+'"]');
        var domElement = document.querySelector('[data-translation="'+element+'"]');
        domElement.innerHTML = language[element];
      }
    }
  }
  
  function swapFlags (_flag) {
    // pic.src = "http://www.projectvictorycosplay.com/images/zelda/Links/3198_render_link.png";
    // 
  }
  
  // This is a public function that can be accessed from
  // outside this module as you can see with the
  // pageModule.init(); code at the bottom.
  module.init = function () {
    
    // getTranslations();
    
    particlesJS.load('euro-map', 'scripts/vendors/particlesjs-config.json', function() {
      
    });
    
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
