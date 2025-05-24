import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../Navbar';

// Mock do componente CarossiLogo
vi.mock('@/assets/carossi-logo', () => ({
  CarossiLogo: () => <div data-testid="carossi-logo">Logo</div>
}));

// Mock do componente ScrollToSection
vi.mock('../ScrollToSection', () => ({
  ScrollToSection: ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <div onClick={onClick}>{children}</div>
  )
}));

describe('Navbar', () => {
  it('deve renderizar o logo', () => {
    render(<Navbar />);
    expect(screen.getByTestId('carossi-logo')).toBeInTheDocument();
  });

  it('deve renderizar todos os links de navegação', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Quem somos')).toBeInTheDocument();
    expect(screen.getByText('Trabalhos')).toBeInTheDocument();
    expect(screen.getByText('Orçamentos')).toBeInTheDocument();
    expect(screen.getByText('Onde comprar')).toBeInTheDocument();
  });

  it('deve renderizar o botão do menu mobile', () => {
    render(<Navbar />);
    
    const mobileMenuButton = screen.getByLabelText('Toggle menu');
    expect(mobileMenuButton).toBeInTheDocument();
  });
});