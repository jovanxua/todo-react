import { render, screen } from '@testing-library/react';
import Header from './header.component';
import '@testing-library/jest-dom';

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<Header>Test Header</Header>); // Children provided here
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('displays children content', () => {
    const testMessage = 'Test Header Content';
    render(<Header>{testMessage}</Header>); // Children provided here
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
});
