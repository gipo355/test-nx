// import { html, render } from 'lit-html';

const hideAlert = function hideAlert() {
  const element = document.querySelector('.alert');
  /**
   * ## why do we need this trick? isn't the element existing and can be removed with element.remove()?
   */
  // if (element) element.parentElement?.removeChild(element);

  /**
   * ## REMOVE IS A NEW FUNCTION, previously i'd need to do DOM traversing
   */
  if (element) element.remove();
};

// we can have type: 'success' , 'fail'
const renderAlertModule = function renderAlertModule(
  type: string,
  message: string,
  element: HTMLElement,
  time = 3
) {
  hideAlert();
  const markUp = ` <div class="alert alert--${type}">${message}</div> `;

  // render(markUp, element);
  //

  element.insertAdjacentHTML('afterbegin', markUp);

  setTimeout(hideAlert, time * 1000);
};

export { renderAlertModule };
