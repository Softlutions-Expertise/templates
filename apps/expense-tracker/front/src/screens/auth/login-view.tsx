'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Alert,
  AlertTitle,
  Typography,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import { Visibility, VisibilityOff, CloudOff, CloudDone } from '@mui/icons-material';

import { useAuth } from '@hooks/use-auth';

// ----------------------------------------------------------------------

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

type FormData = yup.InferType<typeof schema>;

// ----------------------------------------------------------------------

export function LoginView() {
  const { login, apiStatus, checkConnection } = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Verifica conexão a cada 10 segundos se estiver offline
    if (apiStatus === 'offline') {
      const interval = setInterval(() => {
        checkConnection();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [apiStatus, checkConnection]);

  const onSubmit = async (data: FormData) => {
    if (apiStatus === 'offline') {
      setError('Servidor offline. Verifique se o backend está rodando.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(data.email, data.password);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao fazer login';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Status da API */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        {apiStatus === 'checking' && (
          <Chip label="Verificando conexão..." size="small" color="default" />
        )}
        {apiStatus === 'online' && (
          <Chip
            icon={<CloudDone fontSize="small" />}
            label="Servidor online"
            size="small"
            color="success"
            variant="outlined"
          />
        )}
        {apiStatus === 'offline' && (
          <Chip
            icon={<CloudOff fontSize="small" />}
            label="Servidor offline"
            size="small"
            color="error"
            onClick={checkConnection}
            clickable
          />
        )}
      </Box>

      {/* Alerta de offline */}
      {apiStatus === 'offline' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Servidor offline</AlertTitle>
          Verifique se o backend está rodando em{' '}
          <strong>http://localhost:3001</strong>
          <Box sx={{ mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={checkConnection}
            >
              Tentar reconectar
            </Button>
          </Box>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={apiStatus === 'offline'}
      />

      <TextField
        fullWidth
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        margin="normal"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={apiStatus === 'offline'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading || apiStatus === 'offline'}
        sx={{ mt: 3, mb: 2 }}
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>

      <Typography align="center" variant="body2">
        Não tem uma conta?{' '}
        <Link href="/auth/register/" style={{ color: 'inherit' }}>
          Cadastre-se
        </Link>
      </Typography>
    </Box>
  );
}
