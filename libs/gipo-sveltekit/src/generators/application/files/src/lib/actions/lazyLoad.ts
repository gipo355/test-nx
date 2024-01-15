/**
 * @description lazy load images
 * readaptation from [https://svelte.dev/repl/adb8dc564044415f8ffbbd240a39d68d?version=3.44.2]
 *
 * @param image
 * @param observer
 * @returns
 */
export const lazyLoad = (
  image: HTMLImageElement,
  source: string | undefined
) => {
  if (!source) return;
  const loaded = (event?: Event) => {
    // image.classList.add('visible'); // doesn't work in REPL
    image.style.opacity = '1'; // REPL hack to apply loading animation
    if (!event) return;
    event.currentTarget?.removeEventListener('load', loaded); // clean up the event listener
  };

  const observer = new IntersectionObserver(
    ([entry], _observer) => {
      if (!entry.isIntersecting) return; // if the image isn't in view, do nothing (return
      if (entry.isIntersecting) {
        console.log('an image has loaded'); // console log for REPL
        image.src = source; // replace placeholder src with the image src on observe
        if (image.complete) {
          // check if instantly loaded
          loaded();
        } else {
          image.addEventListener('load', loaded); // if the image isn't loaded yet, add an event listener
        }
        _observer.unobserve(entry.target);
      }
    }

    // {
    //   threshold: 0.1,
    //   root: null,
    //   rootMargin: '200px',
    // }
  );

  observer.observe(image); // intersection observer

  return {
    destroy() {
      image.removeEventListener('load', loaded); // clean up the event listener
      observer.unobserve(image); // clean up the observer
      observer.disconnect();
    },
  };
};
