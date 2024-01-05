import { it, expect, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ButtonComponent from './button.component';

describe('ButtonComponent', () => {
  it('renders button with children', () => {
    render(<ButtonComponent>Click me</ButtonComponent>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders button with icon', () => {
    const iconUrl = '/jovanxua.png';
    render(<ButtonComponent icon={iconUrl}>Click me</ButtonComponent>);
    expect(screen.getByRole('img')).toHaveAttribute('src', iconUrl);
  });

  test('applies correct icon size', () => {
    const iconSize = 24;
    render(<ButtonComponent icon="icon.svg" iconsize={iconSize}>Click me</ButtonComponent>);
    const icon = screen.getByRole('img');
    expect(icon).toHaveStyle(`height: ${iconSize}px`);
    expect(icon).toHaveStyle(`width: ${iconSize}px`);
  });

  test('has correct active styles', () => {
    render(<ButtonComponent isactive>Active</ButtonComponent>);
    const button = screen.getByRole('button', { name: /active/i });
    expect(button).toHaveStyle('font-size: 17px');
  });

  test('has correct inactive styles', () => {
    render(<ButtonComponent>Inactive</ButtonComponent>);
    const button = screen.getByRole('button', { name: /inactive/i });
    expect(button).toHaveStyle('font-size: 15px');
  });

  test('passes additional HTML button attributes', () => {
    render(<ButtonComponent aria-label="Submit Form">Submit</ButtonComponent>);
    expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();
  });

  it('button click fires event correctly', () => {
    const handleClick = vi.fn();
    render(<ButtonComponent onClick={handleClick}>Click me</ButtonComponent>);
    fireEvent.click(screen.getByText(/click me/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
