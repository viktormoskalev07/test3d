(function () {
  'use strict';
  // intersection observer
  var observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: .1
  };
  var condition = false
  var callback = function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio > 0) {
        // entry.target;
        // console.log(entry.target)
        // Bug fix for repeated rendering of gallery section
        if (!condition) {
          renderExamples();
          condition = true
        }
        loadVjs();
        initScriptExamples();
        observer.unobserve(entry.target);
      }
    });


    let gallerySlider = new Slider('gallery');
    gallerySlider.init();
  };

  var observer = new IntersectionObserver(callback, observerOptions);

  var timelapses = JSON.parse($('#timelapses-data').text());

  // examples videos
  var observerExamples = document.querySelector('.gallery');
  observer.observe(observerExamples);

  // function render examples
  function renderExamples() {
    let examplesContainer = document.createElement('div');
    examplesContainer.classList.add('slides');

    timelapses.forEach((timelapse, index) => {
      let slide = document.createElement('div');
      slide.classList.add('slide');
      slide.innerHTML = `
        <div class="card">
          <div class="card-img-top">
            <video id="tl-${timelapse.id}" class="video-js vjs-default-skin vjs-big-play-centered" controls   poster="${timelapse.p_json_url.replace('json', 'poster.jpg')}" data-setup='{"fluid": true, "playbackRates": [0.5, 1, 1.5, 2], "controlBar": {"fullscreenToggle": false}}'>
              <source src="${timelapse.p_json_url.replace('.json', '')}" type='video/mp4'>
              <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
            </video>
          </div>
          <div class="card-body">
          <div id="alert-banner-${timelapse.id}" class="bg-warning alert-banner text-center">
            Possible failure detected!
          </div>
          <div class="text-center gauge">
            <canvas id="gauge-${timelapse.id}" data-type="radial-gauge" data-value-dec="0" data-value-int="0" data-width="240" data-height="240" data-units="false" data-title="Looking Good" data-value-box="false" data-min-value="0" data-max-value="100" data-major-ticks='["","","",""]' data-minor-ticks="4" data-highlights='[{ "from": 0, "to": 33, "color": "#5cb85c" },{ "from": 33, "to": 67, "color": "#f0ad4e" },{ "from": 67, "to": 100, "color": "#d9534f" }]' data-color-plate="rgba(255,255,255,.0)" data-color-title="#5cb85c" data-color-stroke-ticks="#EBEBEB" data-color-numbers="#eee" data-color-needle-start="rgba(240, 128, 128, 1)" data-color-needle-end="rgba(255, 160, 122, .9)" data-value-box="true" data-animation-rule="bounce" data-animation-duration="500" data-animated-value="true" data-start-angle="90" data-ticks-angle="180" data-borders="false"></canvas>
          </div>
          </div>
        </div>
      `;

      examplesContainer.append(slide);
    });

    document.getElementById('gallerySlider').querySelector('.slides-wrapper').append(examplesContainer);
  }


  // load video vjs
  function loadVjs() {
    let examples = document.getElementById('gallery');

    var linkVjs = document.createElement('link');
    linkVjs.rel = 'stylesheet';
    linkVjs.href = 'https://vjs.zencdn.net/7.4.1/video-js.css';

    var scriptCanvasGauges = document.createElement('script');
    scriptCanvasGauges.defer = true;
    scriptCanvasGauges.src = 'https://cdn.rawgit.com/Mikhus/canvas-gauges/gh-pages/download/2.1.5/all/gauge.min.js';

    examples.appendChild(linkVjs);
    examples.appendChild(scriptCanvasGauges);
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
})();