import { useOrientation, useResponsive } from '@/hooks';
import { Box, Skeleton } from '@mui/material';

import { MAPA_POLTRONA_ENUM } from './mapa-poltrona-enum';

// ----------------------------------------------------------------------

export function MapaPoltronaSkeleton() {
  const lgUp = useResponsive('up', 'lg');
  const isVertical = useOrientation('vertical');

  const { SIZE_POLTRONA } = MAPA_POLTRONA_ENUM;
  const colunas = 11;
  const linhas = 10;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: '2.5vh',
      }}
    >
      <Box
        sx={{
          maxWidth: '45vw',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${colunas}, 3vw)`,
            gridAutoRows: SIZE_POLTRONA(lgUp, isVertical),
            backgroundColor: '#333d49',
            gap: '1vw',
            borderRadius: 2,
            p: '1vw',
            pb: 0,
            justifyContent: 'center',
          }}
        >
          {[...Array(linhas * colunas)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              animation="wave"
              sx={{
                width: SIZE_POLTRONA(lgUp, isVertical),
                height: SIZE_POLTRONA(lgUp, isVertical),
                borderRadius: 1,
              }}
            />
          ))}
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              gridColumn: '1 / -1',
              width: '100%',
              height: '2vh',
              borderRadius: 0.7,
              mt: '0.5vh',
              mb: '0.25vh',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            borderRadius: 1,
            bgcolor: '#333d49',
            p: '0.3vw',
          }}
        >
          {[...Array(4)].map((_, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: 0.5,
                }}
              />
              <Skeleton variant="text" animation="wave" sx={{ width: 40, height: 16 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
