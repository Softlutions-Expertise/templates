'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { categoryService, Category } from '@services/category.service';

// ----------------------------------------------------------------------

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  color: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

// ----------------------------------------------------------------------

const PRESET_COLORS = [
  '#00A76F',
  '#8E33FF',
  '#FFAB00',
  '#FF5630',
  '#00B8D9',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
];

// ----------------------------------------------------------------------

export function CategoryListView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      color: PRESET_COLORS[0],
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await categoryService.list();
      setCategories(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setValue('name', category.name);
      setValue('color', category.color || PRESET_COLORS[0]);
    } else {
      setEditingCategory(null);
      reset({
        name: '',
        color: PRESET_COLORS[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, data);
      } else {
        await categoryService.create(data);
      }
      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await categoryService.delete(id);
      loadData();
    }
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
        Categorias
      </Typography>

      <Card>
        <List>
          {categories.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="Nenhuma categoria encontrada"
                secondary="Clique no botão + para adicionar"
              />
            </ListItem>
          ) : (
            categories.map((category) => (
              <ListItem
                key={category.id}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDialog(category)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(category.id)}
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
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: category.color || '#999',
                        }}
                      />
                      {category.name}
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
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
          {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Nome"
              margin="normal"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Cor
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {PRESET_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setValue('color', color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: color,
                    cursor: 'pointer',
                    border:
                      selectedColor === color
                        ? '3px solid #000'
                        : '3px solid transparent',
                  }}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingCategory ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
