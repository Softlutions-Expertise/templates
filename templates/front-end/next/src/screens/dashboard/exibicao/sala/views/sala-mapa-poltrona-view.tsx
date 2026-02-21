'use client';

import { useEffect, useState } from 'react';
import { Container, Breadcrumbs } from '@/components';
import { pages, useParams } from '@/routes';
import { salaDesignerService } from '@/services';
import { ISalaDesignerDto } from '@/models';
import { useError } from '@softlutions/hooks';
import { Box, CircularProgress, Alert } from '@mui/material';

import { MapaPoltrona } from '../components';

// ----------------------------------------------------------------------

export function SalaMapaPoltronaView() {
  const handleError = useError();
  const { id } = useParams();

  const [sala, setSala] = useState<ISalaDesignerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSala = () => {
    setLoading(true);
    setError(null);
    
    salaDesignerService.getSalaDesigner(Number(id))
      .then((data) => {
        setSala(data);
      })
      .catch((err: any) => {
        console.error('Erro ao carregar sala:', err);
        handleError(err, 'Erro ao carregar dados da sala');
        setError(err?.message || 'Erro ao carregar dados da sala');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      fetchSala();
    }
  }, [id]);

  return (
    <Container>
      <Breadcrumbs
        heading="Mapa de Poltronas"
        links={[
          { name: 'Painel', href: pages.dashboard.root.path },
          { name: 'Exibição' },
          {
            name: 'Salas',
            href: pages.dashboard.exibicao.sala.list.path,
          },
          { name: sala?.nome || 'Visualizar Mapa' },
        ]}
      />

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && !sala && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Sala não encontrada
        </Alert>
      )}

      {!loading && !error && sala && <MapaPoltrona sala={sala} onRefresh={fetchSala} />}
    </Container>
  );
}
