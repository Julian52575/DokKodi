import { render, screen } from '@testing-library/react-native';

import { EditScreenInfo } from './EditScreenInfo';

it('shows the instructions and the given file path', async () => {
  await render(<EditScreenInfo path="App.tsx" />);

  expect(screen.getByText('Open up the code for this screen:')).toBeOnTheScreen();
  expect(screen.getByText('App.tsx')).toBeOnTheScreen();
  expect(screen.getByText(/your app will automatically update/)).toBeOnTheScreen();
});
