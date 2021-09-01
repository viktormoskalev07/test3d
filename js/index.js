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
            var hourNum = data.print_num * 2.214283; // 2.2 hours / print on average
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

$(document).ready(function () {
    // slick carousel slider plugin
    // $('.demo').slick({
    //     dots: false,
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     touchMove: false,
    //     infinite: true,
    //     slidesToScroll: 1,
    //     autoplay: true,
    //     autoplaySpeed: 2000,
    //     arrows: true,
    //     lazyLoad: 'ondemand',
    //     centerPadding: '20px',
    //     prevArrow: '<button type="button" data-role="none" class="slick-prev"><img src="img/arrow-08.svg" alt=""></button>',
    //     nextArrow: '<button type="button" data-role="none" class="slick-next"><img src="img/arrow-08.svg" alt=""></button>',
    // });

    // Magnific Popup
    $('[data-lightbox]').magnificPopup({
        disableOn: 1,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
    });

    var isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;
    var isTablet = window.matchMedia("only screen and (max-width: 992px)").matches;
    if (isMobile || isTablet) {
        // Shift CTA Btn to bottom of hero
        $(".hero-cta-btn-section").insertAfter($(".print-hours-subtitle"))
        // Show only one video in gallery
        // and hide the rest
        // var condition = false
        // $(".timelapse-gallery .timelapse-card").each(function () {
        //     if (!condition) {
        //         condition = true
        //     } else {
        //         $(this).hide()
        //     }
        // })
    }
    // on Scroll
    $(window).scroll(function () {
        var value = $(this).scrollTop();
        if (value > 100) {
            // When scrolling below navbar height
            // Use white logo on black background
            $("#mainNav .navbar-brand img").removeAttr('src data-set data-srcset srcset')
            var whiteLogo = "img/logo-inverted.png"
            $("#mainNav .navbar-brand img").attr({
                "src": whiteLogo,
                "data-src": whiteLogo,
                "data-srcset": whiteLogo,
                "srcset": whiteLogo
            })
        } else {
            // When scrolling back to top
            // Use black logo on white background
            $("#mainNav .navbar-brand img").removeAttr('src data-set data-srcset srcset')
            var blackLogo = "img/logo.png"
            $("#mainNav .navbar-brand img").attr({
                "src": blackLogo,
                "data-src": blackLogo,
                "data-srcset": blackLogo,
                "srcset": blackLogo
            })
        }
    });

});
