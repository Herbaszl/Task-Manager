import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { RegisterPage } from './RegisterPage';
import { apiRegister } from '../../services/api';

jest.mock('../../services/api', () => ({
  apiRegister: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../components/Input', () => ({
  Input: (props: any) => {
    const { label, fieldName, register, error, ...rest } = props;
    return (
      <div>
        <label htmlFor={fieldName}>{label}</label>
        <input id={fieldName} {...register(fieldName)} {...rest} />
        {error && <p data-testid={`${fieldName}-error`}>{error.message}</p>}
      </div>
    );
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('deve renderizar o formulário de registro corretamente', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /registrar/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument();
  });

  it('deve chamar apiRegister e navegar para /login ao submeter com dados válidos', async () => {
    const user = userEvent.setup();
    (apiRegister as jest.Mock).mockResolvedValue({ id: 'new-user-id' });

    renderComponent();

    await user.type(screen.getByLabelText(/nome completo/i), 'Usuário Teste');
    await user.type(screen.getByLabelText(/email/i), 'teste@valido.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'senhaforte123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senhaforte123');
    await user.click(screen.getByRole('button', { name: /registrar/i }));

    await waitFor(() => {
      expect(apiRegister).toHaveBeenCalledTimes(1);
      expect(apiRegister).toHaveBeenCalledWith({
        name: 'Usuário Teste',
        email: 'teste@valido.com',
        password: 'senhaforte123',
      });
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      state: { message: 'Conta criada com sucesso! Faça o login.' },
    });
  });

  it('deve exibir mensagem de erro da API se apiRegister falhar', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Este email já está em uso.';
    (apiRegister as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    renderComponent();

    await user.type(screen.getByLabelText(/nome completo/i), 'Usuário Teste');
    await user.type(screen.getByLabelText(/email/i), 'teste@valido.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'senhaforte123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senhaforte123');
    await user.click(screen.getByRole('button', { name: /registrar/i }));

    const errorElement = await screen.findByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('deve exibir erros de validação para campos vazios ao submeter', async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /registrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('Digite seu nome');
      expect(screen.getByTestId('email-error')).toHaveTextContent('Digite seu E-Mail');
      expect(screen.getByTestId('password-error')).toHaveTextContent('A senha deve conter no mínimo 8 caracteres');
        expect(screen.getByTestId('confirmPassword-error')).toHaveTextContent('Confirme sua senha');    });
    
    expect(apiRegister).not.toHaveBeenCalled();
  });

  it('deve exibir erro quando as senhas não coincidem', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/^senha$/i), 'senhaforte123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senhafraca456');
    await user.click(screen.getByRole('button', { name: /registrar/i }));

    await waitFor(() => {
        expect(screen.getByTestId('confirmPassword-error')).toHaveTextContent('As senhas não coincidem');
    });

    expect(apiRegister).not.toHaveBeenCalled();
  });
});

