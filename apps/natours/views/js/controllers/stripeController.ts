import { bookTour } from '../models/stripeModel';
import { EL_BOOK_TOUR_BUTTON } from '../utils/elements';

const stripeController = function stripeController() {
  if (!EL_BOOK_TOUR_BUTTON) return;
  // console.log(newStripe);

  const bookButtons = [...EL_BOOK_TOUR_BUTTON];
  // eslint-disable-next-line no-restricted-syntax
  for (const element of bookButtons) {
    element.addEventListener('click', (event: Event) => {
      const target = (event.target as HTMLButtonElement).closest(
        '#btn--book-tour'
      );

      const tourId = element?.dataset.tourId;

      if (!target || !tourId) return;

      target.textContent = 'Processing...';

      // fetch(`/api/v1/bookings/checkout-session/${tourId}`)
      //     .then((session) => console.log(session))
      //     .catch((error) => console.log(error));
      // bookTour(tourId)
      //     .then((session) => {
      //         window.location.assign(session.url);
      //     })
      //     .catch((error) => console.log(error))
      //     .finally(() => {});
      void bookTour(tourId);
    });
  }
};

export { stripeController };
