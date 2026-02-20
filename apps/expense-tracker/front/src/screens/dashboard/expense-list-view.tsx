'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  expenseService,
  Expense,
  CreateExpenseData,
} from '@services/expense.service';
import { categoryService, Category } from '@services/category.service';
import { formatCurrency, formatDate } from '@utils/format';

// ----------------------------------------------------------------------

const schema = yup.object({
  description: yup.string().required('Descrição é obrigatória'),
  amount: yup
    .number()
    .typeError('Valor deve ser um número')
    .positive('Valor deve ser positivo')
    .required('Valor é obrigatório'),
  date: yup.string().required('Data é obrigatória'),
  categoryId: yup.string().optional(),
  notes: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

// ----------------------------------------------------------------------

export function ExpenseListView() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      const [expensesData, categoriesData] = await Promise.all([
        expenseService.list({ page, limit: 10 }),
        categoryService.list(),
      ]);
      setExpenses(expensesData.data);
      setTotalPages(Math.ceil(expensesData.meta.totalItems / 10));
      setCategories(categoriesData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setValue('description', expense.description);
      setValue('amount', expense.amount);
      setValue('date', expense.date.split('T')[0]);
      setValue('categoryId', expense.categoryId || '');
      setValue('notes', expense.notes || '');
    } else {
      setEditingExpense(null);
      reset({
        description: '',
        amount: undefined,
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpense(null);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editingExpense) {
        await expenseService.update(editingExpense.id, data);
      } else {
        await expenseService.create(data);
      }
      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      await expenseService.delete(id);
      loadData();
    }
  };

  const getCategoryColor = (categoryId?: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || '#999999';
  };

  const getCategoryName = (categoryId?: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Sem categoria';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Despesas
      </Typography>

      <Card>
        <List>
          {expenses.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="Nenhuma despesa encontrada"
                secondary="Clique no botão + para adicionar"
              />
            </ListItem>
          ) : (
            expenses.map((expense) => (
              <ListItem
                key={expense.id}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDialog(expense)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(expense.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{expense.description}</span>
                      <Chip
                        label={getCategoryName(expense.categoryId)}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(expense.categoryId),
                          color: 'white',
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      {formatDate(expense.date)} •{' '}
                      <strong>{formatCurrency(Number(expense.amount))}</strong>
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>

        {totalPages > 1 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        )}
      </Card>

      {/* FAB */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <Add />
      </Fab>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Descrição"
              margin="normal"
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              fullWidth
              label="Valor"
              type="number"
              margin="normal"
              inputProps={{ step: 0.01 }}
              {...register('amount')}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />

            <TextField
              fullWidth
              label="Data"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              {...register('date')}
              error={!!errors.date}
              helperText={errors.date?.message}
            />

            <TextField
              fullWidth
              select
              label="Categoria"
              margin="normal"
              {...register('categoryId')}
            >
              <MenuItem value="">Sem categoria</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: category.color || '#999',
                      }}
                    />
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Observações"
              margin="normal"
              multiline
              rows={2}
              {...register('notes')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingExpense ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
