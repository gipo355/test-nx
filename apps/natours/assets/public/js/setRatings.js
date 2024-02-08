/*
 * INSTEAD OF USING INLINE STYLES, WE WILL CHANGE IT FROM THIS FILE
 * to prevent CSP errors and vulnerabilities
 */
const EL_STARS = document.querySelectorAll('.Stars');
EL_STARS.forEach((star) => {
  // console.log(star)
  const rating = star.dataset.rating;
  star.style.setProperty('--rating', rating);
  star.style.setProperty('--star-size', '20px');
  // getComputedStyle(star)['--rating'] = rating
  // getComputedStyle(star)['--star-size'] = '20px'
  // star.style['--rating'] = rating
  // star.style['--star-size'] = '20px'
  // star.style['font-size'] = '20px'
  // star.style['font-size'] = '20px'
});
