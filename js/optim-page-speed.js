 // onscroll observer
const scrollLoader = (selector, cusomEvent) => {
    const mediaQuery = window.matchMedia('(max-width: 480px)').matches;
    const target = document.querySelector(selector);
    let firstLoad = 1;
    let nativeEvent = () => { 
        // if function used without callback use that function
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
        // if user came second time load from cache immediately
        addSrc();
        return
    }
    localStorage.setItem(selector, true);
 
    let targetTimeout = 1500 ;
    if (mediaQuery) {
               // if user did not scroll page , preload all data after that timeout ,
                // this works only for YouTube and video.js it is not animation!!
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
            rootMargin: '20px',
            threshold: 0.01
        }
        const observer = new IntersectionObserver(callback, options);
        let minimaldelay = 1;
        if(target.dataset.minimaldelay){
            minimaldelay=target.dataset.minimaldelay;
        }
       setTimeout(() => {
        //    if user scroll to object , load immediately
             observer.observe(target);
       }, minimaldelay);

    }
}
scrollLoader('.lazy_youtube__js')

// onscroll observer



// script append
function addScript(path, stimeout, integrityProp, crossoriginProp) {
    const mediaQuery = window.matchMedia('(min-width: 480px)').matches;
    if (localStorage.getItem(path)) {
        stimeout = 1;
    }
    if(!mediaQuery){
        stimeout= stimeout*2; 
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
    let scriptDelay = 200;
    if (mediaQuery) {
        scriptDelay = 500 ;
    }
    addScript('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js',scriptDelay);
    addScript('https://code.jquery.com/jquery-3.6.0.min.js', scriptDelay).addEventListener('load', () => {
        addScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-countto/1.2.0/jquery.countTo.min.js', scriptDelay+500);
        addScript('https://www.googletagmanager.com/gtag/js?id=UA-133768246-1',0);
        addScript('https://www.googletagmanager.com/gtag/js?id=AW-765795194', 0);
        addScript('js/analytics.js', 0 );
        scrollLoader('.lazy-video__activator-js', () => {
         addScript('https://cdnjs.cloudflare.com/ajax/libs/video.js/7.8.1/video.min.js', 0).addEventListener('load', () => {
            addScript('js/gallery-new.min.js', 0);
        });
        });
        addScript('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js', 0).addEventListener('load', () => {
            addScript('js/slider.min.js', 0).addEventListener('load', () => {
                addScript('js/index-new.min.js', 0);
                const aoscss = document.createElement('link');
                aoscss.rel='stylesheet';
                    aoscss.href="css/aos.min.css";
                    document.body.append(aoscss); 
            }); 
        });
    })
})


// script append
