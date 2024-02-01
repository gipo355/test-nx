const setRatingsModule = function setRatingsModule() {
  /* eslint-disable no-restricted-syntax */
  /*
   * INSTEAD OF USING INLINE STYLES, WE WILL CHANGE IT FROM THIS FILE
   * to prevent CSP errors and vulnerabilities
   */
  const EL_STARS = document.querySelectorAll('.Stars');
  // eslint-disable-next-line no-restricted-syntax
  if (EL_STARS) {
    for (const star of EL_STARS) {
      // console.log(star)
      const { rating } = star.dataset;
      star.style.setProperty('--rating', rating);
      star.style.setProperty('--star-size', '20px');
      // getComputedStyle(star)['--rating'] = rating
      // getComputedStyle(star)['--star-size'] = '20px'
      // star.style['--rating'] = rating
      // star.style['--star-size'] = '20px'
      // star.style['font-size'] = '20px'
      // star.style['font-size'] = '20px'
    }
  }
};

export { setRatingsModule };
