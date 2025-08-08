import { render, screen, fireEvent } from '@testing-library/react';
import FocusModeDropdown, { FocusMode } from '../FocusModeDropdown';

describe('FocusModeDropdown', () => {
  const mockModes: FocusMode[] = [
    { id: 'web', name: 'Web Search', description: 'Search the web' },
    { id: 'academic', name: 'Academic', description: 'Search academic papers' },
  ];

  const mockOnModeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <FocusModeDropdown
        modes={mockModes}
        selectedMode={mockModes[0]}
        onModeChange={mockOnModeChange}
      />
    );

    const button = screen.getByRole('button', { name: /select focus mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Web Search');
  });

  it('opens dropdown when clicked', () => {
    render(
      <FocusModeDropdown
        modes={mockModes}
        selectedMode={mockModes[0]}
        onModeChange={mockOnModeChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('calls onModeChange when mode is selected', () => {
    render(
      <FocusModeDropdown
        modes={mockModes}
        selectedMode={mockModes[0]}
        onModeChange={mockOnModeChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const academicOption = screen.getByRole('option', { name: /academic/i });
    fireEvent.click(academicOption);

    expect(mockOnModeChange).toHaveBeenCalledWith(mockModes[1]);
  });

  it('closes dropdown after selection', () => {
    render(
      <FocusModeDropdown
        modes={mockModes}
        selectedMode={mockModes[0]}
        onModeChange={mockOnModeChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const academicOption = screen.getByRole('option', { name: /academic/i });
    fireEvent.click(academicOption);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});