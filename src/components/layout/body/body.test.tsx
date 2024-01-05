import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Body from './body.component';

describe('<Body />', () => {
  it('renders the component', () => {
    render(<Body>Test Content</Body>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies the grid area style', () => {
    // Provide an empty fragment as children
    const { container } = render(<Body>{<></>}</Body>);
    expect(container.firstChild).toHaveStyle('grid-area: body');
  });

  it('displays children content', () => {
    render(<Body><div>Child Div</div></Body>);
    expect(screen.getByText('Child Div')).toBeInTheDocument();
  });
});
