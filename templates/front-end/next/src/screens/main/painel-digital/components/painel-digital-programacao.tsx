'use client';

import { Image } from '@/components';
import { useIndicativeClassification } from '@/hooks';
import { IPainelDigitalViewerMovie, IPainelDigitalViewerMovieSessao } from '@/models';
import { Box, Card, Divider, List, ListItem, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { concat } from 'lodash';

import { zeroNero } from '@/theme/typography';

// ----------------------------------------------------------------------

interface Props {
  limiteItens: boolean;
  currentItem: IPainelDigitalViewerMovie;
}

export function PainelDigitalProgramacao({ limiteItens, currentItem }: Props) {
  const handleLabel = useIndicativeClassification();

  const titulo = currentItem?.titulo?.toString().toUpperCase().trim();

  return (
    <Stack direction="row">
      <Stack
        direction="column"
        width="35vw"
        sx={{
          height: '100vh',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#161c24',
        }}
      >
        <img
          src={currentItem?.urlCapa}
          alt={ currentItem?.id}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/*
        <Label
          variant={'filled'}
          sx={{
            width: '7.5vw',
            height: '7.5vw',
            fontSize: '5vw',
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
      </Stack>
      <Stack
        direction="column"
        width="65vw"
        sx={{
          display: 'flex',
          backgroundColor: '#0b0b0b',
          flexDirection: 'column',
          pt: '1.5vw',
          px: '1.5vw',
          height: '100vh',
        }}
      >
        <Typography
          fontFamily={zeroNero.style.fontFamily}
          textAlign={'center'}
          sx={{
            height: '15vh',
            maxHeight: '15vh',
            fontSize: titulo.length >= 40 ? '3.25vw' : '4vw',

            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
            lineHeight: 1.1,
          }}
        >
          {titulo.length >= 60 ? titulo.substring(0, 60).trim() + '...' : titulo}
        </Typography>
        <Divider sx={{ w: '100%', h: 1, my: '3vh', bgcolor: '#191917' }} />
        <Box
          sx={{
            overflow: 'hidden',
            flexGrow: 1,
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            key={currentItem?.titulo}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              ...(limiteItens && {
                animation: 'scroll 35s linear infinite',
              }),
              '@keyframes scroll': {
                '0%': { transform: 'translateY(0)' },
                '100%': { transform: 'translateY(-50%)' },
              },
            }}
          >
            <List
              sx={{
                width: '100%',
                textAlign: 'center',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {concat(limiteItens ? currentItem?.sessao : [], currentItem?.sessao)?.map(
                (item: IPainelDigitalViewerMovieSessao, index: number) => (
                  <Card
                    key={item?.hora + item?.sala}
                    sx={{
                      bgcolor: '#191917',
                      my: '3vh',
                      mt: index === 0 ? '0' : '3vh',
                      position: 'relative',
                      /*...(!item?.esgotado && {
                        filter: 'brightness(0.1)',
                        '&::after': {
                          content: '"ESGOTADO"',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                          fontSize: '4vw',
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          padding: '1vw 2vw',
                          borderRadius: '8px',
                        },
                      }),*/
                    }}
                  >
                    <ListItem
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'start',
                        my: '2vh',
                        mx: '1vw',
                        typography: 'h2',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontSize="3.5vw"
                        fontFamily={zeroNero.style.fontFamily}
                        sx={{
                          whiteSpace: 'nowrap',
                          mr: '1vw',
                        }}
                      >
                        {item?.sala} | {item?.hora}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontSize="3.5vw"
                        fontFamily={zeroNero.style.fontFamily}
                        sx={{
                          color: 'white',
                          paddingBlock: 'unset',
                          bgcolor: item?.tipoProjecao === '2D' ? '#006c9c' : '#51007d',
                          borderRadius: '8px',
                          px: '0.5vw',
                          mr: '1vw',
                        }}
                      >
                        {item?.tipoProjecao}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        fontSize="3.5vw"
                        fontFamily={zeroNero.style.fontFamily}
                        sx={{
                          color: 'white',
                          bgcolor: '#d2232f',
                          paddingBlock: 'unset',
                          borderRadius: '8px',
                          px: '0.5vw',
                          mr: '1vw',
                        }}
                      >
                        {item?.idioma}
                      </Typography>
                      {item?.atmos && !item?.esgotado && (
                        <Typography
                          variant="subtitle1"
                          fontFamily={zeroNero.style.fontFamily}
                          sx={{
                            textAlign: 'center',
                            color: 'white',
                            bgcolor: '#00014f',
                            paddingBlock: 'unset',
                            borderRadius: '8px',
                            px: '0.5vw',
                            mr: '1vw',
                            display: 'flex',
                            position: 'relative',
                            width: '9.5vw',
                            height: '9.5vh',
                          }}
                        >
                          <Image
                            alt="Dolby Atmos"
                            src="/assets/images/atmos.webp"
                            width={'8.5vw'}
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        </Typography>
                      )}
                      {item?.resolucao4k && !item?.esgotado && (
                        <Typography
                          variant="subtitle1"
                          fontSize="3.5vw"
                          fontFamily={zeroNero.style.fontFamily}
                          sx={{
                            color: 'white',
                            bgcolor: '#b29016',
                            paddingBlock: 'unset',
                            borderRadius: '8px',
                            px: '0.5vw',
                            mr: '1vw',
                          }}
                        >
                          4K
                        </Typography>
                      )}
                      {item?.esgotado && (
                        <Typography
                          variant="subtitle1"
                          fontSize="3.5vw"
                          fontFamily={zeroNero.style.fontFamily}
                          sx={{
                            color: 'white',
                            bgcolor: '#F2703C',
                            paddingBlock: 'unset',
                            px: '0.5vw',
                            pt: 0.6,
                            borderRadius: '8px',
                          }}
                        >
                          ESGOTADO
                        </Typography>
                      )}
                    </ListItem>
                  </Card>
                ),
              )}
            </List>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
