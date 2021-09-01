const SLIDERS = {
  features: 'featuresSlider',
  gallery: 'gallerySlider',
  testimonials: 'testimonialsSlider',
}

class Slider {
  constructor(sliderType) {
    const sliderWrapper = document.getElementById(SLIDERS[sliderType]);
    this.wrapper = sliderWrapper;

    if (!sliderWrapper) {
      return;
    }

    this.type = sliderType;

    if (sliderType === 'features') {
      this.slides = [];

      const titles = Array.from(sliderWrapper.querySelectorAll('.title span'));
      const web = Array.from(sliderWrapper.querySelectorAll('figure.web .foreground img'));
      const phone = Array.from(sliderWrapper.querySelectorAll('figure.phone .foreground img'));

      for (let i = 0; i < titles.length; i++) {
        this.slides.push({
          title: titles[i],
          web: web[i],
          phone: phone[i],
        })
      }
    } else {
      this.slider = sliderWrapper.querySelector('.slides');
      this.slidesWrapper = sliderWrapper.querySelector('.slides-wrapper');
      this.slides = Array.from(sliderWrapper.querySelectorAll('.slide'));
    }

    this.arrowLeft = sliderWrapper.querySelector('.control.left');
    this.arrowRight = sliderWrapper.querySelector('.control.right');
  }

  init(auto = false, intervalTime = 1000) {
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = null;
    this.currentIndex = 0;

    this.intervalID = null;
    this.intervalTime = intervalTime;
    this.auto = auto;

    if (this.type !== 'features') {
      this.slides.forEach((slide, index) => {
        slide.addEventListener('touchstart', (event) => { this.touchStart(event, index) }, {passive: true});
        slide.addEventListener('touchend', this.touchEnd, {passive: true});
        slide.addEventListener('touchmove', this.touchMove, {passive: true});
      })
    }

    this.arrowLeft.addEventListener('click', this.slideLeft);
    this.arrowRight.addEventListener('click', this.slideRight);


    // Create progress indicators

    const indicators = this.wrapper.querySelector('.indicators');

    if (indicators) {
      for (let i = 0; i < this.slides.length; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (i === 0) indicator.classList.add('active');

        indicators.append(indicator);
      }
    }

    this.indicators = Array.from(this.wrapper.querySelectorAll('.indicator'));


    if (auto) {
      this.intervalID = setInterval(() => { this.nextSlide() }, this.intervalTime);
    }
  }

  getPositionX(event) {
    return event.touches[0].clientX
  }

  touchStart = (event, index) => {
    if (window.innerWidth >= 768) {
      return;
    }

    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }

    this.currentIndex = index
    this.startPos = this.getPositionX(event)
    this.isDragging = true
    this.animationID = requestAnimationFrame(this.animation)
  }
  
  touchEnd = () => {
    if (window.innerWidth >= 768) {
      return;
    }

    cancelAnimationFrame(this.animationID)
    this.isDragging = false
    const movedBy = this.currentTranslate - this.prevTranslate
  
    // if moved enough negative then snap to next slide if there is one
    if (movedBy < -100 && this.currentIndex < this.slides.length - 1) this.currentIndex += 1
  
    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > 100 && this.currentIndex > 0) this.currentIndex -= 1
  
    this.setPositionByIndex()

    if (this.auto) {
      this.intervalID = setInterval(() => { this.nextSlide() }, this.intervalTime);
    }
  }
  
  touchMove = (event) => {
    if (this.isDragging) {
    const currentPosition = this.getPositionX(event)
    this.currentTranslate = this.prevTranslate + currentPosition - this.startPos
    }
  }
  
  animation = () => {
    this.setSliderPosition()
    if (this.isDragging) requestAnimationFrame(this.animation)
  }
  
  setPositionByIndex() {
    if (this.type === 'features') {
      this.wrapper.querySelector('.title').style.opacity = '0';

      this.slides.forEach((slideSet, index) => {
        slideSet.web.style.opacity = '0';
        slideSet.phone.style.opacity = '0';
      })

      setTimeout(() => {
        this.slides.forEach((slideSet, index) => {
          slideSet.title.style.display = 'none';
        })

        this.slides[this.currentIndex].title.style.display = 'block';
        this.wrapper.querySelector('.title').style.opacity = '1';

        this.slides[this.currentIndex].web.style.opacity = '1';
        this.slides[this.currentIndex].phone.style.opacity = '1';

      }, 300);

    } else if (this.type === 'gallery') {
      if (window.innerWidth <= 767) {
        this.currentTranslate = this.currentIndex * -100; //px 
        this.prevTranslate = this.currentTranslate;
        this.setSliderPosition('%');
      } else {
        const MARGIN = 30;

        const parentWidth = this.slidesWrapper.getBoundingClientRect().width;
        const cards = this.slider.querySelectorAll('.card');
        const cardWithMarginWidth = cards[0].getBoundingClientRect().width + MARGIN;
        const innerWidth = cards.length * cardWithMarginWidth - MARGIN;

        const cardsInSlide = Math.floor(parentWidth / cardWithMarginWidth);
        const slideWidth = cardsInSlide * cardWithMarginWidth;
        this.currentTranslate = -Math.min(this.currentIndex * slideWidth, innerWidth - parentWidth);
        this.prevTranslate = this.currentTranslate;
        this.setSliderPosition('px');
      }

    } else {
      this.currentTranslate = this.currentIndex * -100; //%
      this.prevTranslate = this.currentTranslate;
      this.setSliderPosition('%');
    }

    this.updateIndicators();
    this.updateControls();
  }
  
  setSliderPosition(units = '%') {
    this.slider.style.transform = `translateX(${this.currentTranslate}${units})`
  }
  
  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    })
  }
  
  slideLeft = () => {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }

    if (this.currentIndex === 0 || this.arrowLeft.classList.contains('disabled')) {
      return;
    }
  
    this.currentIndex -= 1;
    this.setPositionByIndex();

    if (this.auto) {
      this.intervalID = setInterval(() => { this.nextSlide() }, this.intervalTime);
    }
  }
  
  slideRight = () => {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }

    if (this.currentIndex === (this.indicators.length - 1) || this.arrowRight.classList.contains('disabled')) {
      return;
    }
  
    this.currentIndex += 1;
    this.setPositionByIndex();

    if (this.auto) {
      this.intervalID = setInterval(() => { this.nextSlide() }, this.intervalTime);
    }
  }

  updateControls() {
    let slidesNumber = this.indicators.length;

    if (this.type === 'gallery' && window.innerWidth >= 768) {
      const MARGIN = 30;

      const parentWidth = this.slidesWrapper.getBoundingClientRect().width;
      const cards = this.slider.querySelectorAll('.card');
      const cardWithMarginWidth = cards[0].getBoundingClientRect().width + MARGIN;
      const innerWidth = cards.length * cardWithMarginWidth - MARGIN;

      const cardsInSlide = Math.floor(parentWidth / cardWithMarginWidth);
      const slideWidth = cardsInSlide * cardWithMarginWidth;

      const slidesCount = innerWidth / slideWidth;
      slidesNumber = Math.ceil(slidesCount);
    }


    if (this.currentIndex === 0) {
      this.arrowRight.classList.remove('disabled');
      this.arrowLeft.classList.add('disabled');
    } else if (this.currentIndex === slidesNumber - 1) {
      this.arrowLeft.classList.remove('disabled');
      this.arrowRight.classList.add('disabled');
    } else {
      this.arrowLeft.classList.remove('disabled');
      this.arrowRight.classList.remove('disabled');
    }
  }

  nextSlide() {
    this.currentIndex = this.currentIndex < this.slides.length - 1 ? this.currentIndex + 1 : 0;
    this.setPositionByIndex();
  }
}