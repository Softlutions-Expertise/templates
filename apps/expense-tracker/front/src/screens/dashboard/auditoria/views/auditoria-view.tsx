'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { History, KeyboardArrowDown, KeyboardArrowUp, ContentCopy, Visibility, VisibilityOff } from '@mui/icons-material';

import { auditoriaService } from '@services/auditoria';
import { IAuditoria, IAuditoriaFiltros, IUsuario, ISessao, decodeJWT } from '@/models/auditoria';
import { formatDateTime } from '@utils/format';

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

// ----------------------------------------------------------------------

export function AuditoriaView() {
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
  
  // Modal de visualização do JWT
  const [jwtModalOpen, setJwtModalOpen] = useState(false);
  const [selectedJWT, setSelectedJWT] = useState<string | null>(null);
  const [decodedJWT, setDecodedJWT] = useState<ReturnType<typeof decodeJWT>>(null);
  const [showFullToken, setShowFullToken] = useState(false);

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
      setError(null);
      const response = await auditoriaService.listar({
        ...filtros,
        page: page + 1,
        limit,
      });
      setAuditorias(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar auditorias');
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

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleViewJWT = (token: string) => {
    setSelectedJWT(token);
    setDecodedJWT(decodeJWT(token));
    setJwtModalOpen(true);
    setShowFullToken(false);
  };

  const handleCloseJwtModal = () => {
    setJwtModalOpen(false);
    setSelectedJWT(null);
    setDecodedJWT(null);
    setShowFullToken(false);
  };

  const formatJWTForDisplay = (token: string) => {
    if (showFullToken) return token;
    return `${token.substring(0, 50)}...${token.substring(token.length - 20)}`;
  };

  // Formata a descrição da sessão
  const formatSessaoLabel = (sessao: ISessao) => {
    const data = formatDateTime(sessao.dataInicio);
    return `Sessão #${sessao.numero} - ${data} (${sessao.totalAcoes} ações)`;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <History />
          Auditoria
        </Typography>

        {/* Filtros */}
        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
              <FormControl sx={{ minWidth: 250 }} size="small">
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
                <FormControl sx={{ minWidth: 400 }} size="small">
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

              <FormControl sx={{ minWidth: 150 }} size="small">
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
                size="small"
                InputLabelProps={{ shrink: true }}
                value={filtros.dataInicio || ''}
                onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
              />

              <TextField
                type="date"
                label="Data Fim"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={filtros.dataFim || ''}
                onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell width={50} />
                  <TableCell>Data</TableCell>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Ação</TableCell>
                  <TableCell>Entidade</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell width={50}>JWT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : auditorias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
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
                            {expandedRow === auditoria.id ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
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
                                icon={<ContentCopy sx={{ fontSize: 14 }} />}
                                label={`${auditoria.entidadeId.slice(0, 8)}...`}
                                size="small"
                                variant="outlined"
                                onClick={() => handleCopyId(auditoria.entidadeId!)}
                                color={copiedId === auditoria.entidadeId ? 'success' : 'default'}
                                sx={{ 
                                  cursor: 'pointer',
                                  mt: 0.5,
                                  '& .MuiChip-icon': { fontSize: 14 }
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
                        <TableCell>
                          {auditoria.jwtToken ? (
                            <Tooltip title="Visualizar JWT">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewJWT(auditoria.jwtToken!)}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                          <Collapse in={expandedRow === auditoria.id}>
                            <Box sx={{ p: 3, bgcolor: 'background.default' }}>
                              <Stack spacing={2}>
                                {auditoria.dadosAnteriores && (
                                  <Box>
                                    <Typography variant="subtitle2" color="error">
                                      Dados Anteriores:
                                    </Typography>
                                    <Box
                                      component="pre"
                                      sx={{
                                        m: 0,
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        overflow: 'auto',
                                        fontSize: '0.75rem',
                                      }}
                                    >
                                      {JSON.stringify(auditoria.dadosAnteriores, null, 2)}
                                    </Box>
                                  </Box>
                                )}
                                {auditoria.dadosNovos && (
                                  <Box>
                                    <Typography variant="subtitle2" color="success.main">
                                      Dados Novos:
                                    </Typography>
                                    <Box
                                      component="pre"
                                      sx={{
                                        m: 0,
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        overflow: 'auto',
                                        fontSize: '0.75rem',
                                      }}
                                    >
                                      {JSON.stringify(auditoria.dadosNovos, null, 2)}
                                    </Box>
                                  </Box>
                                )}
                                {auditoria.userAgent && (
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                      User Agent:
                                    </Typography>
                                    <Typography variant="caption" component="div">
                                      {auditoria.userAgent}
                                    </Typography>
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

      {/* Modal de visualização do JWT */}
      <Dialog open={jwtModalOpen} onClose={handleCloseJwtModal} maxWidth="md" fullWidth>
        <DialogTitle>Visualizar JWT Token</DialogTitle>
        <DialogContent>
          {selectedJWT && (
            <Stack spacing={2}>
              {/* Token completo */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Token:
                  <IconButton 
                    size="small" 
                    onClick={() => setShowFullToken(!showFullToken)}
                    sx={{ ml: 1 }}
                  >
                    {showFullToken ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                  <Button 
                    size="small" 
                    onClick={() => navigator.clipboard.writeText(selectedJWT)}
                    sx={{ ml: 1 }}
                  >
                    Copiar
                  </Button>
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.75rem',
                    wordBreak: 'break-all',
                  }}
                >
                  {formatJWTForDisplay(selectedJWT)}
                </Box>
              </Box>

              {/* Header decodificado */}
              {decodedJWT?.header && (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Header:
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      p: 2,
                      bgcolor: 'primary.50',
                      borderRadius: 1,
                      overflow: 'auto',
                      fontSize: '0.75rem',
                    }}
                  >
                    {JSON.stringify(decodedJWT.header, null, 2)}
                  </Box>
                </Box>
              )}

              {/* Payload decodificado */}
              {decodedJWT?.payload && (
                <Box>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    Payload:
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      p: 2,
                      bgcolor: 'success.50',
                      borderRadius: 1,
                      overflow: 'auto',
                      fontSize: '0.75rem',
                    }}
                  >
                    {JSON.stringify(decodedJWT.payload, null, 2)}
                  </Box>
                </Box>
              )}

              {/* Informações do token */}
              {decodedJWT?.payload && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Informações:
                  </Typography>
                  <Stack spacing={0.5}>
                    {decodedJWT.payload.sub && (
                      <Typography variant="body2">
                        <strong>Subject (sub):</strong> {decodedJWT.payload.sub}
                      </Typography>
                    )}
                    {decodedJWT.payload.email && (
                      <Typography variant="body2">
                        <strong>Email:</strong> {decodedJWT.payload.email}
                      </Typography>
                    )}
                    {decodedJWT.payload.iat && (
                      <Typography variant="body2">
                        <strong>Emitido em (iat):</strong> {new Date(decodedJWT.payload.iat * 1000).toLocaleString()}
                      </Typography>
                    )}
                    {decodedJWT.payload.exp && (
                      <Typography variant="body2">
                        <strong>Expira em (exp):</strong> {new Date(decodedJWT.payload.exp * 1000).toLocaleString()}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJwtModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
