import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { DashBoardPage } from './DashBoardPage';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { type Task } from '../../services/api';
import { within } from '@testing-library/react';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../hooks/useTasks', () => ({
  useTasks: jest.fn(),
}));

jest.mock('../../contexts/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Carregando...</div>,
}));

jest.mock('../../components/CreateTaskForm', () => ({
  CreateTaskForm: ({ onTaskCreated }: { onTaskCreated: (task: Task) => void }) => (
    <div data-testid="create-task-form">
      <button data-testid="mock-create-button" onClick={() => onTaskCreated({ id: 'new-task-mock', title: 'Nova Tarefa Mock', description: '', status: 'Pendente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })}>
        Simular Criação
      </button>
    </div>
  ),
}));

jest.mock('../../components/ConfirmationModal', () => ({
  ConfirmationModal: ({ isOpen, onClose, onConfirm, title, message, confirmButtonText }: any) =>
    isOpen ? (
      <div data-testid="confirmation-modal">
        <h2>{title}</h2>
        <div>{message}</div>
        <button onClick={onClose}>Cancelar</button>
        <button onClick={onConfirm}>{confirmButtonText}</button>
      </div>
    ) : null,
}));

jest.mock('../../components/EditTaskModal', () => ({
  EditTaskModal: ({ isOpen, onClose, onTaskUpdated, task }: any) =>
    isOpen ? (
      <div data-testid="edit-task-modal">
        <h2>Editar Tarefa: {task?.title}</h2>
        <button onClick={onClose}>Fechar Edição</button>
        <button data-testid="mock-update-button" onClick={() => onTaskUpdated({ ...task, title: 'Título Editado Mock', status: 'Feita' })}>
          Simular Edição
        </button>
      </div>
    ) : null,
}));

jest.mock('react-icons/fi', () => ({
  FiLogOut: () => <span data-testid="logout-icon" />,
  FiEdit2: () => <span data-testid="edit-icon" />,
  FiTrash2: () => <span data-testid="delete-icon" />,
}));

const mockTasks: Task[] = [
  { id: '1', title: 'Tarefa 1', description: 'Desc 1', status: 'Pendente', createdAt: '2025-10-19T10:00:00Z', updatedAt: '2025-10-19T10:00:00Z' },
  { id: '2', title: 'Tarefa 2', description: null, status: 'Feita', createdAt: '2025-10-18T10:00:00Z', updatedAt: '2025-10-18T11:00:00Z' },
];

describe('DashBoardPage', () => {
  let mockLogout: jest.Mock;
  let mockAddTask: jest.Mock;
  let mockDeleteTask: jest.Mock;
  let mockUpdateTaskLocally: jest.Mock;
  let mockUseTasks: jest.Mock;

  beforeEach(() => {
    mockLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });

    mockAddTask = jest.fn();
    mockDeleteTask = jest.fn().mockResolvedValue(undefined);
    mockUpdateTaskLocally = jest.fn();
    mockUseTasks = useTasks as jest.Mock;
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: true,
      error: null,
      addTask: mockAddTask,
      deleteTask: mockDeleteTask,
      updateTaskLocally: mockUpdateTaskLocally,
    });

    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <DashBoardPage />
      </MemoryRouter>
    );
  };

  it('deve exibir o spinner enquanto carrega as tarefas', () => {
    renderComponent();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('Nenhuma tarefa encontrada.')).not.toBeInTheDocument();
    expect(screen.queryByText(/Tarefa 1/i)).not.toBeInTheDocument();
  });

  it('deve exibir mensagem de erro se a busca falhar', () => {
    const errorMessage = 'Falha ao buscar tarefas';
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: errorMessage,
      addTask: mockAddTask,
      deleteTask: mockDeleteTask,
      updateTaskLocally: mockUpdateTaskLocally,
    });

    renderComponent();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.queryByText(/Tarefa 1/i)).not.toBeInTheDocument();
  });

  it('deve exibir mensagem de "nenhuma tarefa" se a lista estiver vazia', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: null,
       addTask: mockAddTask,
      deleteTask: mockDeleteTask,
      updateTaskLocally: mockUpdateTaskLocally,
    });

    renderComponent();
    expect(screen.getByText(/Nenhuma tarefa encontrada/i)).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('deve renderizar a lista de tarefas corretamente', () => {
    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
       addTask: mockAddTask,
      deleteTask: mockDeleteTask,
      updateTaskLocally: mockUpdateTaskLocally,
    });

    renderComponent();
    expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText('Tarefa 2')).toBeInTheDocument();
    expect(screen.queryByText('Desc 2')).not.toBeInTheDocument();
    expect(screen.getByText('Feita')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.queryByText(/Nenhuma tarefa encontrada/i)).not.toBeInTheDocument();
  });

  it('deve abrir o modal de logout ao clicar no botão Sair', async () => {
    const user = userEvent.setup();
    mockUseTasks.mockReturnValue({ tasks: [], isLoading: false, error: null, addTask: mockAddTask, deleteTask: mockDeleteTask, updateTaskLocally: mockUpdateTaskLocally });
    renderComponent();

    const logoutButton = screen.getByTitle('Sair da aplicação');
    await user.click(logoutButton);

    expect(await screen.findByText('Confirmar Saída')).toBeInTheDocument();
  });

  it('deve chamar logout ao confirmar no modal de logout', async () => {
    const user = userEvent.setup();
    mockUseTasks.mockReturnValue({ tasks: [], isLoading: false, error: null, addTask: mockAddTask, deleteTask: mockDeleteTask, updateTaskLocally: mockUpdateTaskLocally });
    renderComponent();

    const logoutButton = screen.getByTitle('Sair da aplicação');
    await user.click(logoutButton);

    const confirmButton = await screen.findByRole('button', { name: 'Sair' });
    await user.click(confirmButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('deve abrir o modal de deleção ao clicar no ícone da lixeira', async () => {
    const user = userEvent.setup();
    mockUseTasks.mockReturnValue({ tasks: mockTasks, isLoading: false, error: null, addTask: mockAddTask, deleteTask: mockDeleteTask, updateTaskLocally: mockUpdateTaskLocally });
    renderComponent();

    const task1Item = screen.getByText('Tarefa 1').closest('li');
    expect(task1Item).toBeInTheDocument();
    if (!task1Item) return;
    const deleteButton = within(task1Item).getByTitle('Remover Tarefa');

    await user.click(deleteButton);

    expect(await screen.findByText('Confirmar Remoção')).toBeInTheDocument();
  });

  it('deve chamar deleteTask ao confirmar no modal de deleção', async () => {
    const user = userEvent.setup();
    mockUseTasks.mockReturnValue({ tasks: mockTasks, isLoading: false, error: null, deleteTask: mockDeleteTask, addTask: mockAddTask, updateTaskLocally: mockUpdateTaskLocally });
    renderComponent();

    const task1Item = screen.getByText('Tarefa 1').closest('li');
    expect(task1Item).toBeInTheDocument();
    if (!task1Item) return;
    const deleteButton = within(task1Item).getByTitle('Remover Tarefa');

    await user.click(deleteButton);

    const confirmButton = await screen.findByRole('button', { name: 'Remover' });
    await user.click(confirmButton);

    expect(mockDeleteTask).toHaveBeenCalledTimes(1);
    expect(mockDeleteTask).toHaveBeenCalledWith(mockTasks[0].id);
  });

  it('deve chamar addTask do hook quando CreateTaskForm simular criação', async () => {
    const user = userEvent.setup();
    mockUseTasks.mockReturnValue({ tasks: [], isLoading: false, error: null, addTask: mockAddTask, deleteTask: mockDeleteTask, updateTaskLocally: mockUpdateTaskLocally });
    renderComponent();

    const simulateCreateButton = screen.getByTestId('mock-create-button');
    await user.click(simulateCreateButton);

    expect(mockAddTask).toHaveBeenCalledTimes(1);
    expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({
      id: 'new-task-mock',
      title: 'Nova Tarefa Mock',
      status: 'Pendente',
    }));
  });

  it('deve abrir o modal de edição ao clicar no ícone de editar', async () => {
    const user = userEvent.setup();
    mockUseTasks.mockReturnValue({ tasks: mockTasks, isLoading: false, error: null, addTask: mockAddTask, deleteTask: mockDeleteTask, updateTaskLocally: mockUpdateTaskLocally });
    renderComponent();

    const task1Item = screen.getByText('Tarefa 1').closest('li');
    expect(task1Item).toBeInTheDocument();
    if (!task1Item) return;
    const editButton = within(task1Item).getByTitle('Editar Tarefa');

    await user.click(editButton);

    expect(await screen.findByText(`Editar Tarefa: ${mockTasks[0].title}`)).toBeInTheDocument();
  });

  it('deve chamar updateTaskLocally do hook quando EditTaskModal simular atualização', async () => {
    const user = userEvent.setup();
    mockUseTasks.mockReturnValue({ tasks: mockTasks, isLoading: false, error: null, addTask: mockAddTask, deleteTask: mockDeleteTask, updateTaskLocally: mockUpdateTaskLocally });
    renderComponent();

    const task1Item = screen.getByText('Tarefa 1').closest('li');
    expect(task1Item).toBeInTheDocument();
    if (!task1Item) return;
    const editButton = within(task1Item).getByTitle('Editar Tarefa');

    await user.click(editButton);

    const simulateUpdateButton = await screen.findByTestId('mock-update-button');
    await user.click(simulateUpdateButton);

    expect(mockUpdateTaskLocally).toHaveBeenCalledTimes(1);
    expect(mockUpdateTaskLocally).toHaveBeenCalledWith(expect.objectContaining({
      id: mockTasks[0].id,
      title: 'Título Editado Mock',
      status: 'Feita',
    }));
    expect(screen.queryByText(`Editar Tarefa: ${mockTasks[0].title}`)).not.toBeInTheDocument();
  });
});