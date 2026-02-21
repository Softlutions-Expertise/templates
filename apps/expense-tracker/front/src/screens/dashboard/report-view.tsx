'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { PictureAsPdf, Visibility } from '@mui/icons-material';

import { reportService } from '@services/report.service';
import { formatDateInput } from '@utils/format';

// ----------------------------------------------------------------------

export function ReportView() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return formatDateInput(date);
  });
  
  const [endDate, setEndDate] = useState(() => formatDateInput(new Date()));
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError('');
      const html = await reportService.generateReport({ startDate, endDate });
      setHtmlContent(html);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar relatório');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError('');
      const blob = await reportService.downloadReport({ startDate, endDate });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-despesas-${startDate}-a-${endDate}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao baixar relatório');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Relatório de Despesas
      </Typography>

      <Card sx={{ mb: 3 }}>
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
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Visibility />}
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Visualizar'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={handleDownload}
              disabled={isLoading}
            >
              Baixar HTML
            </Button>

            {htmlContent && (
              <Button
                variant="outlined"
                onClick={handlePrint}
              >
                Imprimir
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {htmlContent && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pré-visualização
            </Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden' }}>
              <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                style={{ width: '100%', height: '600px', border: 'none' }}
                title="Relatório"
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
