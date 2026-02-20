'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Collapse,
} from '@mui/material';
import { Iconify } from '@/components';
import { useSettingsContext } from '@/components/settings';
import { auditoriaService } from '@/services';
import { IAuditoria, IAuditoriaFiltros, IUsuario, ISessao } from '@/models/auditoria';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ----------------------------------------------------------------------

const ACAO_COLORS: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
  login: 'success',
  create: 'info',
  update: 'warning',
  delete: 'error',
};

const ACAO_LABELS: Record<string, string> = {
  login: 'Login',
  create: 'Criar',
  update: 'Atualizar',
  delete: 'Deletar',
};

const formatDateTime = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
  } catch {
    return dateString;
  }
};

// ----------------------------------------------------------------------

export function AuditoriaView() {
  const settings = useSettingsContext();
  const [auditorias, setAuditorias] = useState<IAuditoria[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingSessoes, setLoadingSessoes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filtros, setFiltros] = useState<IAuditoriaFiltros>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Busca usuários para o filtro
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoadingUsuarios(true);
        const data = await auditoriaService.listarUsuarios();
        setUsuarios(data);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
      } finally {
        setLoadingUsuarios(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Busca sessões quando um usuário é selecionado
  useEffect(() => {
    const fetchSessoes = async () => {
      if (!filtros.usuarioId) {
        setSessoes([]);
        setFiltros(prev => ({ ...prev, jwtToken: undefined }));
        return;
      }

      try {
        setLoadingSessoes(true);
        const data = await auditoriaService.listarSessoes(filtros.usuarioId);
        setSessoes(data);
      } catch (err) {
        console.error('Erro ao carregar sessões:', err);
      } finally {
        setLoadingSessoes(false);
      }
    };

    fetchSessoes();
  }, [filtros.usuarioId]);

  const fetchAuditorias = async () => {
    try {
      setLoading(true);
      const response = await auditoriaService.listar({
        ...filtros,
        page: page + 1,
        limit,
      });
      setAuditorias(response.data);
      setTotal(response.total);
    } catch (err) {
      setError('Erro ao carregar auditorias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditorias();
  }, [page, limit, filtros]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFiltroChange = (campo: keyof IAuditoriaFiltros, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor || undefined }));
    setPage(0);
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Formata a descrição da sessão
  const formatSessaoLabel = (sessao: ISessao) => {
    const data = formatDateTime(sessao.dataInicio);
    return `Sessão #${sessao.numero} - ${data} (${sessao.totalAcoes} ações)`;
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
        <Typography variant="h4">Auditoria</Typography>

        {/* Filtros */}
        <Card sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>Usuário</InputLabel>
              <Select
                value={filtros.usuarioId || ''}
                label="Usuário"
                onChange={(e) => handleFiltroChange('usuarioId', e.target.value)}
                disabled={loadingUsuarios}
              >
                <MenuItem value="">Todos os usuários</MenuItem>
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario.id} value={usuario.id}>
                    {usuario.name} ({usuario.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro de Sessão - aparece apenas quando um usuário está selecionado */}
            {filtros.usuarioId && (
              <FormControl sx={{ minWidth: 350 }}>
                <InputLabel>Sessão</InputLabel>
                <Select
                  value={filtros.jwtToken || ''}
                  label="Sessão"
                  onChange={(e) => handleFiltroChange('jwtToken', e.target.value)}
                  disabled={loadingSessoes}
                >
                  <MenuItem value="">Todas as sessões</MenuItem>
                  {sessoes.map((sessao) => (
                    <MenuItem key={sessao.id} value={sessao.id}>
                      {formatSessaoLabel(sessao)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Ação</InputLabel>
              <Select
                value={filtros.acao || ''}
                label="Ação"
                onChange={(e) => handleFiltroChange('acao', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="login">Login</MenuItem>
                <MenuItem value="create">Criar</MenuItem>
                <MenuItem value="update">Atualizar</MenuItem>
                <MenuItem value="delete">Deletar</MenuItem>
              </Select>
            </FormControl>

            <TextField
              type="date"
              label="Data Início"
              InputLabelProps={{ shrink: true }}
              value={filtros.dataInicio || ''}
              onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
            />

            <TextField
              type="date"
              label="Data Fim"
              InputLabelProps={{ shrink: true }}
              value={filtros.dataFim || ''}
              onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
            />
          </Stack>
        </Card>

        {/* Tabela */}
        <Card>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50} />
                  <TableCell>Data</TableCell>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Ação</TableCell>
                  <TableCell>Entidade</TableCell>
                  <TableCell>IP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : auditorias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        Nenhum registro encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  auditorias.map((auditoria) => (
                    <>
                      <TableRow key={auditoria.id} hover>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleExpandRow(auditoria.id)}
                          >
                            <Iconify
                              icon={
                                expandedRow === auditoria.id
                                  ? 'solar:alt-arrow-up-bold'
                                  : 'solar:alt-arrow-down-bold'
                              }
                            />
                          </IconButton>
                        </TableCell>
                        <TableCell>{formatDateTime(auditoria.createdAt)}</TableCell>
                        <TableCell>
                          {auditoria.usuarioEmail || 'Sistema'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ACAO_LABELS[auditoria.acao]}
                            color={ACAO_COLORS[auditoria.acao]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {auditoria.entidade}
                          </Typography>
                          {auditoria.entidadeId && (
                            <Tooltip 
                              title={copiedId === auditoria.entidadeId ? 'Copiado!' : `Clique para copiar: ${auditoria.entidadeId}`}
                              arrow
                            >
                              <Chip
                                label={`ID: ${auditoria.entidadeId.slice(0, 8)}...`}
                                size="small"
                                variant="outlined"
                                onClick={() => handleCopyId(auditoria.entidadeId!)}
                                color={copiedId === auditoria.entidadeId ? 'success' : 'default'}
                                sx={{ 
                                  cursor: 'pointer',
                                  mt: 0.5,
                                }}
                              />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {auditoria.ipAddress || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                          <Collapse in={expandedRow === auditoria.id}>
                            <Box sx={{ p: 3, bgcolor: 'background.neutral' }}>
                              <Stack spacing={2}>
                                {auditoria.dadosAnteriores && (
                                  <Box>
                                    <Typography variant="subtitle2" color="error">
                                      Dados Anteriores:
                                    </Typography>
                                    <pre style={{ margin: 0, overflow: 'auto' }}>
                                      {JSON.stringify(auditoria.dadosAnteriores, null, 2)}
                                    </pre>
                                  </Box>
                                )}
                                {auditoria.dadosNovos && (
                                  <Box>
                                    <Typography variant="subtitle2" color="success.main">
                                      Dados Novos:
                                    </Typography>
                                    <pre style={{ margin: 0, overflow: 'auto' }}>
                                      {JSON.stringify(auditoria.dadosNovos, null, 2)}
                                    </pre>
                                  </Box>
                                )}
                              </Stack>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Registros por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </Card>
      </Stack>
    </Container>
  );
}
