import button from './button.svelte'
import { render } from '@testing-library/svelte'

it('it works', async () => {
  const { getByText } = render(button)

  expect(getByText('Hello component!'));
})
