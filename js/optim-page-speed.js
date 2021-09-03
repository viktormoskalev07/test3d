 

// onscroll observer 
const scrollLoader = (selector, cusomEvent) => {
    const mediaQuery = window.matchMedia('(max-width: 480px)').matches;
    const target = document.querySelector(selector);
    let firstLoad = 1;
    let nativeEvent = () => {
        target.src = target.dataset.src; 
    } 
    let addSrc = () => {
        if (target && firstLoad) {
            if (cusomEvent) {
                cusomEvent();
            } else {
                nativeEvent();
            }
            firstLoad = 0;
        }
    }
    if (localStorage.getItem(selector)) {
        addSrc();
        return
    }
    localStorage.setItem(selector, true);
    let targetTimeout = 1000 ;
    if (mediaQuery) {
        targetTimeout = 8000 ;
    }
    setTimeout(() => {
        addSrc();
    }, targetTimeout);

    if (target) {
        const callback = function (entries, observer) {
            entries.forEach(ent => {
                if (!ent.isIntersecting) {
                    return false
                }
                if (firstLoad) {
                    addSrc();
                }
                observer.unobserve(ent.target)
            });
        };
        const options = {
            rootMargin: '-20px',
            threshold: 0.01
        }
        const observer = new IntersectionObserver(callback, options);
        observer.observe(target);
    } 
}
scrollLoader('.lazy_youtube__js')

// onscroll observer 

 

// script append 
function addScript(path, stimeout, integrityProp, crossoriginProp) {
    if (localStorage.getItem(path)) {
        stimeout = 1;
    }
    const someJs = document.createElement('script');
    someJs.defer = true;
    someJs.src = path;
    if (integrityProp) {
        someJs.integrity = integrityProp;
    }
    if (crossoriginProp) {
        someJs.crossorigin = crossoriginProp;
    }
    setTimeout(() => {
        document.body.append(someJs);
        localStorage.setItem(path, true);
    }, stimeout);
    return (
        someJs
    )
}
window.addEventListener('load', function () {
    const mediaQuery = window.matchMedia('(max-width: 480px)').matches;
    let scriptDelay = 1;
    if (mediaQuery) {
        scriptDelay = 1200 ;
    }
    addScript('https://www.googleoptimize.com/optimize.js?id=OPT-5J7WK4M', scriptDelay).addEventListener('load', () => {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-T985NV3');
    })


    addScript('https://code.jquery.com/jquery-3.6.0.min.js', scriptDelay).addEventListener('load', () => {
        addScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-countto/1.2.0/jquery.countTo.min.js', 0);
        addScript('https://www.googletagmanager.com/gtag/js?id=UA-133768246-1',scriptDelay+2800);
        addScript('https://www.googletagmanager.com/gtag/js?id=AW-765795194', scriptDelay+2800 );
        addScript('js/analytics.js', scriptDelay+2800 );
        scrollLoader('.lazy-video__activator-js', () => {
         addScript('https://cdnjs.cloudflare.com/ajax/libs/video.js/7.8.1/video.min.js', 0).addEventListener('load', () => {
            addScript('js/gallery-new.min.js', 0);
        }); 
        }); 
        addScript('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js', 0).addEventListener('load', () => { 
            addScript('js/slider.min.js', 0).addEventListener('load', () => {
                addScript('js/index-new.min.js', 0);
            });
        });
    })  
})


// script append 