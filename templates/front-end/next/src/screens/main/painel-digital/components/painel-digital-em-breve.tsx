'use client';

import { useIndicativeClassification } from '@/hooks';
import { IPainelDigitalViewerMovie, IPainelDigitalViewerPainel } from '@/models';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { zeroNero } from '@/theme/typography';

// ----------------------------------------------------------------------

interface Props {
  painel: IPainelDigitalViewerPainel;
  currentItem: IPainelDigitalViewerMovie;
}

export function PainelDigitalEmBreve({ painel, currentItem }: Props) {
  const handleLabel = useIndicativeClassification();

  const titulo = currentItem?.titulo?.toString().toUpperCase().trim();

  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#161c24',
          height: '94vh',
          position: 'relative',
        }}
      >
        <img 
          src={currentItem?.urlCapa} 
          alt={currentItem?.id} 
          style={{ width: '100%', height: '100%' }} 
        />
        {/*
        <Label
          variant={'filled'}
          sx={{
            width: 110,
            height: 110,
            fontSize: '4.7rem',
            color: 'white',
            bgcolor: handleLabel(currentItem?.classificacaoIndicativa).cor,
            position: 'absolute',
            top: 15,
            right: 15,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          }}
          translate="no"
        >
          {handleLabel(currentItem?.classificacaoIndicativa).texto}
        </Label>
        */}
      </Grid>

      <Grid
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
          alignItems: 'center',
          backgroundColor: '#0b0b0b',
          flexDirection: 'row',
          height: '6vh',
        }}
      >
        {painel?.tipoPainel !== 6 && (
          <Typography
            fontFamily={zeroNero.style.fontFamily}
            variant="subtitle1"
            fontSize="6.5vw"
            color="primary"
            mr="5vw"
          >
            EM-BREVE
          </Typography>
        )}
        <Typography fontFamily={zeroNero.style.fontFamily} variant="subtitle1" fontSize="6.5vw">
          {currentItem?.data || 'AGUARDE!'}
        </Typography>
      </Grid>
    </Grid>
  );
}
