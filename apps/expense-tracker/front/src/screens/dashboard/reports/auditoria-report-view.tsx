'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Download, PictureAsPdf } from '@mui/icons-material';

import { reportService } from '@services/report.service';
import { formatDateInput } from '@utils/format';

// ----------------------------------------------------------------------

type TipoAcao = 'login' | 'create' | 'update' | 'delete';

const acaoOptions: { value: TipoAcao | ''; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'login', label: 'Login' },
  { value: 'create', label: 'Criação' },
  { value: 'update', label: 'Atualização' },
  { value: 'delete', label: 'Exclusão' },
];

// ----------------------------------------------------------------------

export function AuditoriaReportView() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return formatDateInput(date);
  });

  const [endDate, setEndDate] = useState(() => formatDateInput(new Date()));
  const [acao, setAcao] = useState<TipoAcao | ''>('');
  const [entidade, setEntidade] = useState('');
  const [isLoadingHtml, setIsLoadingHtml] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [error, setError] = useState('');

  const handleDownloadHtml = async () => {
    try {
      setIsLoadingHtml(true);
      setError('');
      const html = await reportService.generateAuditoriaReport({
        startDate,
        endDate,
        acao: acao || undefined,
        entidade: entidade || undefined,
      });
      
      // Download do HTML
      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-auditoria-${startDate}-a-${endDate}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar relatório');
    } finally {
      setIsLoadingHtml(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsLoadingPdf(true);
      setError('');
      const blob = await reportService.downloadAuditoriaReportPdf({
        startDate,
        endDate,
        acao: acao || undefined,
        entidade: entidade || undefined,
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-auditoria-${startDate}-a-${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar PDF');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Relatório de Auditoria
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtros
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <TextField
              label="Data Inicial"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data Final"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="acao-label">Ação</InputLabel>
              <Select
                labelId="acao-label"
                value={acao}
                label="Ação"
                onChange={(e) => setAcao(e.target.value as TipoAcao | '')}
              >
                {acaoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Entidade"
              placeholder="Ex: expense, category"
              value={entidade}
              onChange={(e) => setEntidade(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={isLoadingHtml ? <CircularProgress size={20} color="inherit" /> : <Download />}
              onClick={handleDownloadHtml}
              disabled={isLoadingHtml || isLoadingPdf}
            >
              {isLoadingHtml ? 'Gerando...' : 'Baixar HTML'}
            </Button>

            <Button
              variant="outlined"
              startIcon={isLoadingPdf ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdf />}
              onClick={handleDownloadPdf}
              disabled={isLoadingHtml || isLoadingPdf}
            >
              {isLoadingPdf ? 'Gerando...' : 'Baixar PDF'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
