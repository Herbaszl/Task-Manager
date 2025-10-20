import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { LoginPage } from './LoginPage';
import { useLogin } from '../../hooks/useLogin';


jest.mock('../../hooks/useLogin', () => ({
  useLogin: jest.fn(), 
}));

jest.mock('../../components/Input', () => ({
  Input: ({ label, fieldName, register, error, ...rest }: any) => (
    <div>
      <label htmlFor={fieldName}>{label}</label>
      <input id={fieldName} {...register(fieldName)} {...rest} />
      {error && <p data-testid={`${fieldName}-error`}>{error.message}</p>}
    </div>
  ),
}));

jest.mock('../../contexts/Spinner', () => ({
  SmallSpinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('LoginPage', () => {
  const mockUseLogin = useLogin as jest.Mock;
  let mockHandleSubmitLogin: jest.Mock;

  beforeEach(() => {
    mockHandleSubmitLogin = jest.fn();
    mockUseLogin.mockReturnValue({
      apiError: null,
      isSubmitting: false,
      handleSubmitLogin: mockHandleSubmitLogin,
    });
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<div>Register Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('deve renderizar o formulário de login corretamente', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /bem-vindo/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve chamar a função handleSubmitLogin do hook com os dados corretos', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'teste@valido.com');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockHandleSubmitLogin).toHaveBeenCalledTimes(1);
      expect(mockHandleSubmitLogin).toHaveBeenCalledWith({
        email: 'teste@valido.com',
        password: 'senha123',
      });
    });
  });

  it('deve exibir a mensagem de erro da API retornada pelo hook', () => {
    const errorMessage = 'Credenciais inválidas.';
    mockUseLogin.mockReturnValue({
      apiError: errorMessage,
      isSubmitting: false,
      handleSubmitLogin: mockHandleSubmitLogin,
    });

    renderComponent();

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('deve mostrar o estado de "Entrando..." quando isSubmitting for true', () => {
    mockUseLogin.mockReturnValue({
      apiError: null,
      isSubmitting: true,
      handleSubmitLogin: mockHandleSubmitLogin,
    });

    renderComponent();

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/entrando.../i)).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('deve exibir erros de validação ao tentar submeter um formulário inválido', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(submitButton);
    
    expect(await screen.findByTestId('email-error')).toHaveTextContent('O E-Mail é obrigatório'); 
    expect(await screen.findByTestId('password-error')).toHaveTextContent('A senha é obrigatória');

    expect(mockHandleSubmitLogin).not.toHaveBeenCalled();
  });

});