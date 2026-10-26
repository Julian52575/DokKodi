import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ScreenContent } from './ScreenContent';

it('shows the title and the file path', async () => {
  await render(<ScreenContent title="Home" path="App.tsx" />);

  expect(screen.getByText('Home')).toBeOnTheScreen();
  expect(screen.getByText('App.tsx')).toBeOnTheScreen();
});

it('renders its children', async () => {
  await render(
    <ScreenContent title="Home" path="App.tsx">
      <Text>child</Text>
    </ScreenContent>
  );

  expect(screen.getByText('child')).toBeOnTheScreen();
});
