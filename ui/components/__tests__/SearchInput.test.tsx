import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '../SearchInput';

describe('SearchInput', () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        placeholder="Test placeholder"
      />
    );

    const input = screen.getByRole('textbox', { name: /search query/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Test placeholder');
  });

  it('calls onChange when input changes', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(mockOnChange).toHaveBeenCalledWith('test query');
  });

  it('calls onSubmit when form is submitted', () => {
    render(
      <SearchInput
        value="test query"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const form = screen.getByRole('search');
    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalledWith('test query');
  });

  it('shows error for empty query', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const form = screen.getByRole('search');
    fireEvent.submit(form);
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a search query');
  });

  it('prevents potential injection attacks', () => {
    render(
      <SearchInput
        value="javascript:alert('xss')"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const form = screen.getByRole('search');
    fireEvent.submit(form);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid characters detected in query');
  });
});