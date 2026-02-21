'use client';

import { useRef, useState } from 'react';
import { useOrientation, useResponsive } from '@/hooks';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FaArrowsLeftRight, FaWheelchair } from 'react-icons/fa6';
import { PoltronaEditDialog } from './poltrona-edit-dialog';
import type { IPoltronaDto, ISalaDesignerDto } from '@/models';
import { MapaPoltronaSkeleton } from './mapa-poltrona-skeleton';
import { MAPA_POLTRONA_ENUM } from './mapa-poltrona-enum';

// ----------------------------------------------------------------------

interface PropsDivisor {
  render: boolean;
  isVertical: boolean;
}

interface Props {
  sala: ISalaDesignerDto;
}

export function MapaPoltrona({ sala, onRefresh }: Props & { onRefresh?: () => void }) {
  const xlUp = useResponsive('up', 'xl');
  const isVertical = useOrientation('vertical');

  const { FONT_SIZE_POLTRONA, GAP_POLTRONA, SIZE_POLTRONA, COLOR_POLTRONA } = MAPA_POLTRONA_ENUM;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPoltrona, setEditPoltrona] = useState<IPoltronaDto | null>(null);
  const [editPosition, setEditPosition] = useState<{ x: number; y: number }>({ x: 1, y: 1 });

  const mapaPoltronaRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  const getPoltrona = (x: number, y: number): IPoltronaDto | null => {
    return sala.poltronas.find((p) => p.posicaoX === x && p.posicaoY === y) || null;
  };

  const getCorPoltrona = (poltrona: IPoltronaDto | null): string => {
    if (!poltrona || poltrona.tipoBaseMapa?.descricao !== 'Poltrona') return COLOR_POLTRONA.DEFAULT;
    if (poltrona.bloqueada) return COLOR_POLTRONA.OCUPADA;
    if (poltrona.status?.descricao === 'Ocupada') return COLOR_POLTRONA.OCUPADA;
    return COLOR_POLTRONA.DESOCUPADA;
  };

  const organizePoltronas = () => {
    const linhas = [];
    
    for (let y = sala.tamanhoY; y >= 1; y--) {
      const colunas = [];
      for (let x = 1; x <= sala.tamanhoX; x++) {
        const poltrona = getPoltrona(x, y);
        colunas.push(poltrona);
      }
      linhas.push(colunas);
    }
    return linhas;
  };

  const handleClickPoltrona = (poltrona: IPoltronaDto | null, x: number, y: number) => {
    setEditPoltrona(poltrona);
    setEditPosition({ x, y });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditPoltrona(null);
  };

  const handleEditSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const calulateSizeVw = (items: any[]) => {
    if (!Array.isArray(items) || items.length < 3) {
      throw new Error("Você deve passar um array com pelo menos 3 itens, ex: ['10vw', '+', '5vw']");
    }

    const tokens = items?.map((item, index) => {
      if (index % 2 === 0) {
        return Number(item?.toString()?.replace('vw', ''));
      }
      return item;
    });

    const stack = [tokens[0]];
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const nextValue = tokens[i + 1];

      if (operator === '*' || operator === '/') {
        const prevValue = stack.pop();
        let intermediate;
        if (operator === '*') {
          intermediate = prevValue * nextValue;
        } else {
          intermediate = prevValue / nextValue;
        }
        stack.push(intermediate);
      } else {
        stack.push(operator);
        stack.push(nextValue);
      }
    }

    let result = stack[0];
    for (let i = 1; i < stack.length; i += 2) {
      const operator = stack[i];
      const value = stack[i + 1];
      if (operator === '+') {
        result += value;
      } else {
        result -= value;
      }
    }

    return `${result}vw`;
  };

  const Divisor = ({ render, isVertical }: PropsDivisor) => {
    if (!render) return null;
    return (
      <Box
        sx={{
          width: '0.6vw',
          height: '40%',
          bgcolor: '#7d5d3b',
          borderRadius: 0.3,
          mx: isVertical ? '1.52vw' : '0.85vw',
        }}
      />
    );
  };

  if (!sala) {
    return <MapaPoltronaSkeleton />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          container
          sx={{
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            display: 'inline-flex',
            flexDirection: 'column',
            p: '0.5vw',
            mx: '0',
          }}
          ref={mapaPoltronaRef as any}
        >
          {organizePoltronas().map((row, index) => {
            const y = (sala?.tamanhoY ?? 0) - 1 - index;

            const totalDivisores = row.reduce((qtd, poltrona: IPoltronaDto | null) => {
              if (
                poltrona?.divisoriaEsquerda ||
                poltrona?.divisoriaDireita ||
                poltrona?.tipoAcessibilidade?.descricao === 'Obesidade'
              ) {
                return qtd + 1;
              }
              return qtd;
            }, 0);

            const skipTail = totalDivisores;

            return (
              <Grid
                key={index}
                xs={12}
                sx={{
                  color: 'black',
                  display: 'flex',
                }}
              >
                <Box
                  key={`letter-${y}`}
                  sx={{
                    width: SIZE_POLTRONA(xlUp, isVertical),
                    height: SIZE_POLTRONA(xlUp, isVertical),
                    fontSize: FONT_SIZE_POLTRONA(xlUp, isVertical),
                    m: GAP_POLTRONA,
                    mx: `-${GAP_POLTRONA}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {String.fromCharCode(65 + y)}
                </Box>

                {row.map((poltrona: IPoltronaDto | null, idx: number) => {
                  const isTailPosition = idx >= row.length - skipTail;
                  const isEmptySeat = !poltrona || !poltrona.descricao;

                  const isObseidadeInRight =
                    sala?.poltronas?.find(
                      (p) =>
                        p?.posicaoX === (poltrona?.posicaoX ?? 0) + 1 &&
                        p?.posicaoY === poltrona?.posicaoY,
                    )?.tipoAcessibilidade?.descricao === 'Obesidade';

                  if ((isTailPosition && isEmptySeat) || isObseidadeInRight) return null;

                  const divisoriaEsquerda = poltrona?.divisoriaEsquerda ?? false;
                  const divisoriaDireita = poltrona?.divisoriaDireita ?? false;
                  const isDupla = poltrona?.dupla;

                  const poltronaCadeirante = poltrona?.tipoAcessibilidade?.descricao === 'Cadeirante';
                  const poltronaObesidade = poltrona?.tipoAcessibilidade?.descricao === 'Obesidade';
                  const poltronaVipPremium =
                    poltrona?.tipoPoltrona?.descricao === 'VIP' ||
                    poltrona?.tipoPoltrona?.descricao === 'Premium';

                  const SIZE_POLTRONA_OBESIDADE = calulateSizeVw([
                    SIZE_POLTRONA(xlUp, isVertical),
                    '*',
                    2,
                    '+',
                    GAP_POLTRONA,
                  ]);

                  const size = () => {
                    if (poltronaObesidade) {
                      return SIZE_POLTRONA_OBESIDADE;
                    }
                    return calulateSizeVw([
                      SIZE_POLTRONA(xlUp, isVertical),
                      '+',
                      isDupla ? '0.20vw' : '0vw',
                    ]);
                  };

                  const handleMrPoltrona = (boxParent?: boolean) => {
                    switch (true) {
                      case isDupla && !divisoriaDireita:
                        return '0.1vw';
                      default:
                        return boxParent ? 0 : GAP_POLTRONA;
                    }
                  };

                  const handleMlPoltrona = (boxParent?: boolean) => {
                    switch (true) {
                      case isDupla && !divisoriaEsquerda:
                        return '0.1vw';
                      default:
                        return boxParent ? 0 : GAP_POLTRONA;
                    }
                  };

                  const realX = idx + 1;
                  const realY = sala.tamanhoY - index;
                  const cor = getCorPoltrona(poltrona);
                  const isPoltrona = poltrona?.tipoBaseMapa?.descricao === 'Poltrona';

                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Divisor render={divisoriaEsquerda} isVertical={isVertical} />
                      <Box
                        onClick={() => handleClickPoltrona(poltrona, realX, realY)}
                        sx={{
                          width: size,
                          height: SIZE_POLTRONA(xlUp, isVertical),
                          fontSize: FONT_SIZE_POLTRONA(xlUp, isVertical),
                          m: GAP_POLTRONA,
                          mr: handleMrPoltrona(),
                          ml: handleMlPoltrona(),
                          borderRadius: 1,
                          bgcolor: cor,
                          color: poltrona ? 'white' : 'black',
                          zIndex: poltronaObesidade ? 99 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          '&:hover': {
                            opacity: isPoltrona ? 0.8 : 1,
                          },
                        }}
                      >
                        <Stack
                          direction={poltronaObesidade ? 'row' : 'column'}
                          spacing={poltronaObesidade ? '0.25vw' : 0}
                          sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isPoltrona && (
                            <>
                              {poltronaVipPremium && !poltronaCadeirante && (
                                <div
                                  style={{
                                    color: 'white',
                                    margin: 0,
                                    fontSize: isVertical ? 7 : 6,
                                  }}
                                >
                                  {poltrona?.tipoPoltrona?.descricao === 'VIP' ? 'VIP' : 'PREMI'}
                                </div>
                              )}
                              {poltronaObesidade && <FaArrowsLeftRight />}
                              {poltronaCadeirante && <FaWheelchair />}
                              {poltrona?.descricao?.substring(1) || ''}
                            </>
                          )}
                        </Stack>
                      </Box>
                      <Divisor render={divisoriaDireita} isVertical={isVertical} />
                    </Box>
                  );
                })}
              </Grid>
            );
          })}
          <Box
            sx={{
              gridColumn: '1 / -1',
              width: '100%',
              height: isVertical ? '0.8vh' : '2vh',
              mt: '1vw',
              mb: '0.1vw',
              px: '0.75vw',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: '#212b36',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8vw',
                borderRadius: 0.7,
                fontWeight: 'bold',
              }}
            >
              TELA DO CINEMA
            </Box>
          </Box>
        </Grid>

        <Box
          display="grid"
          gridTemplateColumns={`repeat(4, 1fr)`}
          sx={{
            width: mapaPoltronaRef.current?.offsetWidth,
            bgcolor: '#f5f5f5',
            mt: '1vw',
            p: '0.5vw',
            borderRadius: 1,
          }}
        >
          <Stack direction="row" spacing={1} display="flex" alignItems="center" justifyContent="center">
            <Box
              sx={{
                width: calulateSizeVw([SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.5 : 0.75]),
                height: calulateSizeVw([SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.5 : 0.75]),
                bgcolor: COLOR_POLTRONA.DESOCUPADA,
                borderRadius: 0.5,
              }}
            />
            <Typography
              sx={{
                fontSize: calulateSizeVw([FONT_SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.75 : 1]),
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Desocupada
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} display="flex" alignItems="center" justifyContent="center">
            <Box
              sx={{
                width: calulateSizeVw([SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.5 : 0.75]),
                height: calulateSizeVw([SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.5 : 0.75]),
                bgcolor: COLOR_POLTRONA.OCUPADA,
                borderRadius: 0.5,
              }}
            />
            <Typography
              sx={{
                fontSize: calulateSizeVw([FONT_SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.75 : 1]),
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Ocupada
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} display="flex" alignItems="center" justifyContent="center">
            <Box
              sx={{
                width: calulateSizeVw([SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.5 : 0.75]),
                height: calulateSizeVw([SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.5 : 0.75]),
                bgcolor: COLOR_POLTRONA.SELECIONADA_INTEIRA,
                borderRadius: 0.5,
              }}
            />
            <Typography
              sx={{
                fontSize: calulateSizeVw([FONT_SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.75 : 1]),
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Selecionada(Inteira)
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} display="flex" alignItems="center" justifyContent="center">
            <Box
              sx={{
                width: calulateSizeVw([SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.5 : 0.75]),
                height: calulateSizeVw([SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.5 : 0.75]),
                bgcolor: COLOR_POLTRONA.SELECIONADA_MEIA,
                borderRadius: 0.5,
              }}
            />
            <Typography
              sx={{
                fontSize: calulateSizeVw([FONT_SIZE_POLTRONA(xlUp, isVertical), '*', isVertical ? 0.75 : 1]),
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Selecionada(Meia)
            </Typography>
          </Stack>
        </Box>
      </Box>

      <PoltronaEditDialog
        open={editDialogOpen}
        poltrona={editPoltrona}
        salaId={sala.id}
        posicaoX={editPosition.x}
        posicaoY={editPosition.y}
        onClose={handleCloseEditDialog}
        onSuccess={handleEditSuccess}
      />
    </Box>
  );
}
