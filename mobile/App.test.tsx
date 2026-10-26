import { render, screen } from '@testing-library/react-native';

import App from './App';

// The real provider renders nothing until native insets arrive.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default
);

it('renders the home screen', async () => {
  await render(<App />);

  expect(screen.getByText('Home')).toBeOnTheScreen();
  expect(screen.getByText('App.tsx')).toBeOnTheScreen();
});
