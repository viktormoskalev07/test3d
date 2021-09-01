(function ($) {
  'use strict'; // Start of use strict

  var isMobileWidth = $(window).width() < 990;

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 48)
        }, 1000, "easeInOutExpo");
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 54,
  });

  // Collapse Navbar
  var navbarCollapse = function () {
    if ($('#mainNav').offset().top > 100) {
      $('#mainNav').addClass('navbar-shrink');
    } else {
      $('#mainNav').removeClass('navbar-shrink');
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  $('.input').focus(function () {
    $(this)
      .parent()
      .find('.label-txt')
      .addClass('label-active');
  });

  $('.input').focusout(function () {
    if ($(this).val() == '') {
      $(this)
        .parent()
        .find('.label-txt')
        .removeClass('label-active');
    }
  });

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }


  // Instructions cycle
  var howWorksSection = $('.how-works');

  var instructionsInterval;

  function changeSection(section, item) {
    var items = $('.items', section);
    var itemsText = $('.items-text', section);

    var activeItem = $('.active', items).first();
    var nextItem = activeItem && activeItem.next();
    if (nextItem.length === 0) {
      nextItem = $(':first-child', items);
    }
    var selectedItem = item || nextItem;
    $('.active', items).removeClass('active');
    selectedItem.addClass('active');

    var selectedIndex = items.children().index(selectedItem);
    $('.active', itemsText).removeClass('active');
    itemsText
      .children()
      .eq(selectedIndex)
      .addClass('active');
  }

  $('.how-works .icon').each(function (idx, icon) {
    if (isMobileWidth) {
      $(this).on('click', function (event) {
        changeSection(howWorksSection, $(icon));
        clearInterval(instructionsInterval);
        instructionsInterval = setInterval(function () {
          changeSection(howWorksSection);
        }, 3500);
      });
    } else {
      $(this).on('mouseover', function (event) {
        changeSection(howWorksSection, $(icon));
        clearInterval(instructionsInterval);
      });
      $(this).on('mouseout', function (event) {
        clearInterval(instructionsInterval);
        instructionsInterval = setInterval(function () {
          changeSection(howWorksSection);
        }, 3500);
      });
    }
  });

  // Animate-On-Scroll
  AOS.init({
    once: true,
    disable: 'phone',
  });
  if (isMobileWidth) {
    instructionsInterval = setInterval(function () {
      changeSection(howWorksSection);
    }, 3500);
  } else {
    document.addEventListener('aos:in:how-works', function () {
      instructionsInterval = setInterval(function () {
        changeSection(howWorksSection);
      }, 3500);
    });
  }

  // Magnific Popup
  $('[data-lightbox]').magnificPopup({
    disableOn: 600,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  jQuery.ajax({
    url: "https://app.thespaghettidetective.com/ent/api/pub_stats/",
    // url: "http://localhost:3334/ent/api/pub_stats/",
    crossDomain: true,
    dataType: 'json',
    xhrFields: { withCredentials: true },
    contentType: 'application/json',
    success: function (data) {
      var hourNum = data.print_num * 2.599257; // 2.6 hours / print on average
      var hourNumOld = 12000000;

      function printCounter() {
        var counters = $('.counter:not(.counter-instant)');
        if (counters.length > 0) {
          counters.each(function () {
            var element = $(this);
            var counterElementComma = !!element.find('span').attr('data-comma');
              runCounter(element, counterElementComma, hourNum, hourNumOld);
          });
        }
        setTimeout(function () {
          printCounter();
        }, Math.random() * 5 * 1000);
        hourNumOld = hourNum;
        hourNum += 1;
      }
      printCounter(hourNum);
    }
  });

})(jQuery); // End of use strict

function runCounter(counterElement, counterElementComma, numTo, numFrom) {
  if (counterElementComma == true) {
    counterElement.find('span').countTo({
      to: numTo,
      from: numFrom,
      formatter: function (value, options) {
        value = value.toFixed(options.decimals);
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return value;
      },
    });
  } else {
    counterElement.find('span').countTo({ to: numTo, from: numFrom });
  }
}



(function () {

  'use strict';

  // header add class
  var masthead = document.querySelector('.masthead');
  setTimeout(function () {
    masthead.classList.add('masthead-bg');
  }, 1000);


  // intersection observer
  var observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: .1
  };

  var callback = function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio > 0) {
        entry.target;
        //console.log(entry.target)
        renderExamples();
        loadVjs();
        initScriptExamples();
        loadFooterNetworks();
        observer.unobserve(entry.target);
      }
    });
  };

  var observer = new IntersectionObserver(callback, observerOptions);


  // examples videos
  var observerExamples = document.querySelector('.examples');
  observer.observe(observerExamples);

  // function render examples
  function renderExamples() {
    var examplesContainer = document.createElement('div');
    examplesContainer.classList.add('container');
    examplesContainer.innerHTML = "\n<div class=\"section-heading text-center\" data-aos=\"fade-down\">\n      <h1>See It In Action</h1>\n      <hr style=\"background-color: #888;\">\n    </div>\n    <div class=\"row timelapse-gallery\">\n      <div class=\"col-sm-12 col-lg-4 offset-lg-2 timelapse-card\" data-aos=\"fade-right\">\n        <div class=\"card\">\n          <div class=\"card-header\">\n            - By Lila\n          </div>\n  \n          <div class=\"card-img-top\">\n  \n            <video id=\"tl-48\" class=\"video-js vjs-default-skin vjs-big-play-centered\" controls preload=\"auto\"\n              poster=\"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00207.mp4.poster.jpg\"\n              data-setup='{\"fluid\": true, \"playbackRates\": [0.5, 1, 1.5, 2], \"controlBar\": {\"fullscreenToggle\": false}}'>\n              <source src=\"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00207.mp4\" type='video/mp4'>\n  \n              <p class=\"vjs-no-js\">\n                To view this video please enable JavaScript, and consider upgrading to a web browser that\n                <a href=\"https://videojs.com/html5-video-support/\" target=\"_blank\">supports HTML5 video</a>\n              </p>\n            </video>\n          </div>\n  \n          <div class=\"card-body\">\n            <div id=\"alert-banner-48\" class=\"bg-warning alert-banner text-center\">\n              <svg width=\"18\" height=\"16\">\n                <use xlink:href=\"#i-exclamation-triangle\"></use>\n              </svg> Possible failure detected!\n            </div>\n            <div class=\"text-center gauge\">\n              <canvas id=\"gauge-48\" data-type=\"radial-gauge\" data-value-dec=\"0\" data-value-int=\"0\" data-width=\"240\"\n                data-height=\"240\" data-units=\"false\" data-title=\"Looking Good\" data-value-box=\"false\" data-min-value=\"0\"\n                data-max-value=\"100\" data-major-ticks='[\"\",\"\",\"\",\"\"]' data-minor-ticks=\"4\" data-highlights='[\n                                      { \"from\": 0, \"to\": 33, \"color\": \"#5cb85c\" },\n                                      { \"from\": 33, \"to\": 67, \"color\": \"#f0ad4e\" },\n                                      { \"from\": 67, \"to\": 100, \"color\": \"#d9534f\" }\n                                  ]' data-color-plate=\"rgba(255,255,255,.0)\" data-color-title=\"#5cb85c\"\n                data-color-stroke-ticks=\"#EBEBEB\" data-color-numbers=\"#eee\"\n                data-color-needle-start=\"rgba(240, 128, 128, 1)\" data-color-needle-end=\"rgba(255, 160, 122, .9)\"\n                data-value-box=\"true\" data-animation-rule=\"bounce\" data-animation-duration=\"500\"\n                data-animated-value=\"true\" data-start-angle=\"90\" data-ticks-angle=\"180\" data-borders=\"false\"></canvas>\n            </div>\n          </div>\n        </div>\n      </div>\n  \n      <div class=\"col-sm-12 col-lg-4 timelapse-card\" data-aos=\"fade-left\" data-aos-offset=\"250\">\n        <div class=\"card\">\n          <div class=\"card-header\">\n            - By Kenneth\n          </div>\n  \n          <div class=\"card-img-top\">\n  \n            <video id=\"tl-2\" class=\"video-js vjs-default-skin vjs-big-play-centered\" controls preload=\"auto\"\n              poster=\"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00002.mp4.poster.jpg\"\n              data-setup='{\"fluid\": true, \"playbackRates\": [0.5, 1, 1.5, 2], \"controlBar\": {\"fullscreenToggle\": false}}'>\n              <source src=\"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00002.mp4\" type='video/mp4'>\n  \n              <p class=\"vjs-no-js\">\n                To view this video please enable JavaScript, and consider upgrading to a web browser that\n                <a href=\"https://videojs.com/html5-video-support/\" target=\"_blank\">supports HTML5 video</a>\n              </p>\n            </video>\n          </div>\n  \n          <div class=\"card-body\">\n            <div id=\"alert-banner-2\" class=\"bg-warning alert-banner text-center\">\n              <svg width=\"18\" height=\"16\">\n                <use xlink:href=\"#i-exclamation-triangle\"></use>\n              </svg> Possible failure detected!\n            </div>\n            <div class=\"text-center gauge\">\n              <canvas id=\"gauge-2\" data-type=\"radial-gauge\" data-value-dec=\"0\" data-value-int=\"0\" data-width=\"240\"\n                data-height=\"240\" data-units=\"false\" data-title=\"Looking Good\" data-value-box=\"false\" data-min-value=\"0\"\n                data-max-value=\"100\" data-major-ticks='[\"\",\"\",\"\",\"\"]' data-minor-ticks=\"4\" data-highlights='[\n                                      { \"from\": 0, \"to\": 33, \"color\": \"#5cb85c\" },\n                                      { \"from\": 33, \"to\": 67, \"color\": \"#f0ad4e\" },\n                                      { \"from\": 67, \"to\": 100, \"color\": \"#d9534f\" }\n                                  ]' data-color-plate=\"rgba(255,255,255,.0)\" data-color-title=\"#5cb85c\"\n                data-color-stroke-ticks=\"#EBEBEB\" data-color-numbers=\"#eee\"\n                data-color-needle-start=\"rgba(240, 128, 128, 1)\" data-color-needle-end=\"rgba(255, 160, 122, .9)\"\n                data-value-box=\"true\" data-animation-rule=\"bounce\" data-animation-duration=\"500\"\n                data-animated-value=\"true\" data-start-angle=\"90\" data-ticks-angle=\"180\" data-borders=\"false\"></canvas>\n            </div>\n          </div>\n        </div>\n      </div>\n  \n      <div class=\"col-sm-12 col-lg-4 offset-lg-2 timelapse-card\" data-aos=\"fade-right\">\n        <div class=\"card\">\n          <div class=\"card-header\">\n            - By Jimmy\n          </div>\n  \n          <div class=\"card-img-top\">\n  \n            <video id=\"tl-43\" class=\"video-js vjs-default-skin vjs-big-play-centered\" controls preload=\"auto\"\n              poster=\"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00202.mp4.poster.jpg\"\n              data-setup='{\"fluid\": true, \"playbackRates\": [0.5, 1, 1.5, 2], \"controlBar\": {\"fullscreenToggle\": false}}'>\n              <source src=\"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00202.mp4\" type='video/mp4'>\n  \n              <p class=\"vjs-no-js\">\n                To view this video please enable JavaScript, and consider upgrading to a web browser that\n                <a href=\"https://videojs.com/html5-video-support/\" target=\"_blank\">supports HTML5 video</a>\n              </p>\n            </video>\n          </div>\n  \n          <div class=\"card-body\">\n            <div id=\"alert-banner-43\" class=\"bg-warning alert-banner text-center\">\n              <svg width=\"18\" height=\"16\">\n                <use xlink:href=\"#i-exclamation-triangle\"></use>\n              </svg> Possible failure detected!\n            </div>\n            <div class=\"text-center gauge\">\n              <canvas id=\"gauge-43\" data-type=\"radial-gauge\" data-value-dec=\"0\" data-value-int=\"0\" data-width=\"240\"\n                data-height=\"240\" data-units=\"false\" data-title=\"Looking Good\" data-value-box=\"false\" data-min-value=\"0\"\n                data-max-value=\"100\" data-major-ticks='[\"\",\"\",\"\",\"\"]' data-minor-ticks=\"4\" data-highlights='[\n                                      { \"from\": 0, \"to\": 33, \"color\": \"#5cb85c\" },\n                                      { \"from\": 33, \"to\": 67, \"color\": \"#f0ad4e\" },\n                                      { \"from\": 67, \"to\": 100, \"color\": \"#d9534f\" }\n                                  ]' data-color-plate=\"rgba(255,255,255,.0)\" data-color-title=\"#5cb85c\"\n                data-color-stroke-ticks=\"#EBEBEB\" data-color-numbers=\"#eee\"\n                data-color-needle-start=\"rgba(240, 128, 128, 1)\" data-color-needle-end=\"rgba(255, 160, 122, .9)\"\n                data-value-box=\"true\" data-animation-rule=\"bounce\" data-animation-duration=\"500\"\n                data-animated-value=\"true\" data-start-angle=\"90\" data-ticks-angle=\"180\" data-borders=\"false\"></canvas>\n            </div>\n          </div>\n        </div>\n      </div>\n  \n      <div class=\"col-sm-12 col-lg-4 timelapse-card\" data-aos=\"fade-left\" data-aos-offset=\"250\">\n        <div class=\"card\">\n          <div class=\"card-header\">\n            - By Jimmy\n          </div>\n  \n          <div class=\"card-img-top\">\n  \n            <video id=\"tl-47\" class=\"video-js vjs-default-skin vjs-big-play-centered\" controls preload=\"auto\"\n              poster=\"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00206.mp4.poster.jpg\"\n              data-setup='{\"fluid\": true, \"playbackRates\": [0.5, 1, 1.5, 2], \"controlBar\": {\"fullscreenToggle\": false}}'>\n              <source src=\"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00206.mp4\" type='video/mp4'>\n  \n              <p class=\"vjs-no-js\">\n                To view this video please enable JavaScript, and consider upgrading to a web browser that\n                <a href=\"https://videojs.com/html5-video-support/\" target=\"_blank\">supports HTML5 video</a>\n              </p>\n            </video>\n          </div>\n  \n          <div class=\"card-body\">\n            <div id=\"alert-banner-47\" class=\"bg-warning alert-banner text-center\">\n              <svg width=\"18\" height=\"16\">\n                <use xlink:href=\"#i-exclamation-triangle\"></use>\n              </svg> Possible failure detected!\n            </div>\n            <div class=\"text-center gauge\">\n              <canvas id=\"gauge-47\" data-type=\"radial-gauge\" data-value-dec=\"0\" data-value-int=\"0\" data-width=\"240\"\n                data-height=\"240\" data-units=\"false\" data-title=\"Looking Good\" data-value-box=\"false\" data-min-value=\"0\"\n                data-max-value=\"100\" data-major-ticks='[\"\",\"\",\"\",\"\"]' data-minor-ticks=\"4\" data-highlights='[\n                                      { \"from\": 0, \"to\": 33, \"color\": \"#5cb85c\" },\n                                      { \"from\": 33, \"to\": 67, \"color\": \"#f0ad4e\" },\n                                      { \"from\": 67, \"to\": 100, \"color\": \"#d9534f\" }\n                                  ]' data-color-plate=\"rgba(255,255,255,.0)\" data-color-title=\"#5cb85c\"\n                data-color-stroke-ticks=\"#EBEBEB\" data-color-numbers=\"#eee\"\n                data-color-needle-start=\"rgba(240, 128, 128, 1)\" data-color-needle-end=\"rgba(255, 160, 122, .9)\"\n                data-value-box=\"true\" data-animation-rule=\"bounce\" data-animation-duration=\"500\"\n                data-animated-value=\"true\" data-start-angle=\"90\" data-ticks-angle=\"180\" data-borders=\"false\"></canvas>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-lg-8 col-sm-12 offset-lg-2 timelapse-card upload-timelapse\" data-aos=\"fade-up\">\n        <div class=\"upload-timelapse-container\">\n          <a href=\"https://app.thespaghettidetective.com/prints/upload/\">\n            <svg class=\"d-block mb-1 m-auto\" width=\"30\" height=\"30\">\n              <use xlink:href=\"#i-upload\"></use>\n            </svg>\n            <p>\n              UPLOAD YOUR OWN TIME-LAPSES TO TEST IT\n            </p>\n            <p>\n              (LOGIN REQUIRED)\n            </p>\n          </a>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\" style=\"margin-top: 2.5em;\" data-aos=\"fade-up\" data-aos-anchor=\".timelapse-card.upload-timelapse\">\n      <div class=\"col-lg-8 col-sm-12 offset-lg-2 text-right\">\n        <p>More time-lapses in our <a href=\"https://app.thespaghettidetective.com/publictimelapses/\">Spaghetti\n            Gallery</a></p>\n      </div>\n    </div>\n    <script id=\"timelapses-data\"\n    type=\"application/json\">[{\"id\": 48, \"title\": \"T-00207.mp4\", \"priority\": 1000000, \"p_json_url\": \"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00207.mp4.json\"},\n  {\"id\": 2, \"title\": \"T-00002.mp4\", \"priority\": 1000000, \"p_json_url\": \"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00002.mp4.json\"},\n  {\"id\": 43, \"title\": \"T-00202.mp4\", \"priority\": 1000000, \"p_json_url\": \"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00202.mp4.json\"},\n  {\"id\": 47, \"title\": \"T-00206.mp4\", \"priority\": 1000000, \"p_json_url\": \"https://tsd-pub-static.s3.amazonaws.com/pub-tls/T-00206.mp4.json\"}]</script>\n        ";

    observerExamples.appendChild(examplesContainer);
  }


  // load video vjs
  function loadVjs() {
    var linkVjs = document.createElement('link');
    linkVjs.rel = 'stylesheet';
    linkVjs.href = 'https://vjs.zencdn.net/7.4.1/video-js.css';

    var scriptCanvasGauges = document.createElement('script');
    scriptCanvasGauges.defer = true;
    scriptCanvasGauges.src = 'https://cdn.rawgit.com/Mikhus/canvas-gauges/gh-pages/download/2.1.5/all/gauge.min.js';

    examples.appendChild(linkVjs);
    examples.appendChild(scriptCanvasGauges);  }


  // footer networks btns
  var observerFooter = document.querySelector('.nav-footer');
  observer.observe(observerFooter);

  function loadFooterNetworks() {
    loadNetworks();
  }

  function initScriptExamples() {

    function scaleP(p) {
      var CUT_OFF = 0.45;
      var scaleAboveCutOff = 100.0 / 3.0 / (1 - CUT_OFF);
      var scaleBelowCutOff = 200.0 / 3.0 / CUT_OFF;
      if (p > CUT_OFF) {
        return (p - CUT_OFF) * scaleAboveCutOff + 200.0 / 3.0;
      } else {
        return p * scaleBelowCutOff;
      }
    }

    function updateGauge(gaugeEle, p) {
      var scaledP = scaleP(p);
      gaugeEle.attr('data-value', scaledP);
      if (scaledP > 66) {
        gaugeEle.attr('data-title', 'Failing!');
        gaugeEle.attr('data-color-title', 'rgba(255,30,0,.75)');
      } else if (scaledP > 33) {
        gaugeEle.attr('data-title', 'Fishy...');
        gaugeEle.attr('data-color-title', 'rgb(255,165,0,.75)');
      } else {
        gaugeEle.attr('data-title', 'Looking Good');
        gaugeEle.attr('data-color-title', 'rgba(0,255,30,.75)');
      }
    }

    var timelapses = JSON.parse($('#timelapses-data').text());

    for (var i = 0; i < timelapses.length; i++) {
      (function () {
        // Self-invoking function for closure scope
        var tl = timelapses[i];
        $.ajax({
          type: 'GET',
          url: tl.p_json_url,
          dataType: 'json',
          crossDomain: true,
          success: function (frame_p) {
            if ($('#tl-' + tl.id).length < 1) return;

            var gauge = $('#gauge-' + tl.id);
            var vjs = videojs('tl-' + tl.id);
            var alertBanner = $('#alert-banner-' + tl.id);
            vjs.on('timeupdate', function (e) {
              var num = Math.floor(this.currentTime() * 25);
              var p = frame_p[num].p;
              updateGauge(gauge, p);
              if (p > 0.45) {
                alertBanner.show();
              } else {
                alertBanner.hide();
              }
            });

            $('#fullscreen-btn-' + tl.id).click(function () {
              vjs.pause();
              var currentTime = vjs.currentTime();

              $('#tl-modal-title').text('By ' + tl.creator_name);

              var modalVjs = videojs('tl-fullscreen-vjs');
              modalVjs.src(tl.video_url);
              modalVjs.currentTime(currentTime);
              modalVjs.play();

              modalVjs.on('timeupdate', function (e) {
                var num = Math.floor(this.currentTime() * 25);
                var p = frame_p[num].p;
                updateGauge($('#gauge-fullscreen'), p);
              });
            });
          }
        });
      })();
    }

    $('#tl-fullscreen-modal').on('hide.bs.modal', function (e) {
      var player = videojs('tl-fullscreen-vjs');
      player.pause();
    });

  }


  // load networks
  function loadNetworks() {
    var footer = document.querySelector('#footer');

    var scriptPlatform = document.createElement('script');
    scriptPlatform.async = true;
    scriptPlatform.src = 'https://apis.google.com/js/platform.js';

    var scriptFB = document.createElement('script');
    scriptFB.async = true;
    scriptFB.crossorigin = 'anonymous';
    scriptFB.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=176252365784303&autoLogAppEvents=1';

    var scriptTwitter = document.createElement('script');
    scriptTwitter.async = true;
    scriptTwitter.src = 'https://platform.twitter.com/widgets.js';

    var scriptBtns = document.createElement('script');
    scriptTwitter.async = true;
    scriptBtns.src = 'https://buttons.github.io/buttons.js';

    footer.appendChild(scriptPlatform);
    footer.appendChild(scriptFB);
    footer.appendChild(scriptTwitter);
    footer.appendChild(scriptBtns);
  }


  // load scripts
  function loadScripts() {
    var script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=UA-133768246-1';

    var script2 = document.createElement('script');
    script2.async = true;
    script2.src = 'https://www.googletagmanager.com/gtag/js?id=AW-765795194';

    var scriptAws = document.createElement('script');
    scriptAws.src = 'https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.382.0/aws-sdk.min.js';

    document.body.appendChild(script1);
    document.body.appendChild(script2);
    document.body.appendChild(scriptAws);
  }

  setTimeout(function () {
    loadScripts();
  }, 3000);


})();
