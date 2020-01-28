import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

console.log('App: ', App.getContent);

test('getContent fetches data and returns an array with a length of 5', () => {
  const cluesArray = App.getContent();
  expect(cluesArray).length.toBe(5);
});
