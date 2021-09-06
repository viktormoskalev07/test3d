 // onscroll observer 
const scrollLoader = (selector, cusomEvent) => {
    const mediaQuery = window.matchMedia('(max-width: 480px)').matches;
    const target = document.querySelector(selector);
    let firstLoad = 1;
    let nativeEvent = () => {
        if(mediaQuery){
            target.src = target.dataset.src; 
        } else{
            setTimeout(() => {
                target.src = target.dataset.src; 
            }, 800);
        } 
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
            rootMargin: '20px',
            threshold: 0.01
        }
        const observer = new IntersectionObserver(callback, options);
        let minimaldelay = 1;
        if(target.dataset.minimaldelay){
            minimaldelay=target.dataset.minimaldelay;
        }
       setTimeout(() => {
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
        console.log(stimeout , path);
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
        scriptDelay = 400 ;
    } 
    addScript('https://code.jquery.com/jquery-3.6.0.min.js', scriptDelay).addEventListener('load', () => {
        addScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-countto/1.2.0/jquery.countTo.min.js', scriptDelay);
        addScript('https://www.googletagmanager.com/gtag/js?id=UA-133768246-1',scriptDelay);
        addScript('https://www.googletagmanager.com/gtag/js?id=AW-765795194', scriptDelay);
        addScript('js/analytics.js', scriptDelay );
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