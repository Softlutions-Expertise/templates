type ReturnType = (classificacao: number | string) => {
  cor: string;
  texto: string;
};

export function useIndicativeClassification(): ReturnType {
  return (classificacao: number | string): { cor: string; texto: string } => {
    switch (classificacao) {
      case 0:
      case 6:
      case 'L':
      case 'AL':
        return {
          cor: '#00a54f',
          texto: 'l',
        };
      case 1:
      case 7:
      case '10':
      case 'A10':
        return {
          cor: '#00aeef',
          texto: '10',
        };
      case 2:
      case 8:
      case '12':
      case 'A12':
        return {
          cor: '#fff101',
          texto: '12',
        };
      case 3:
      case 9:
      case '14':
      case 'A14':
        return {
          cor: '#f58220',
          texto: '14',
        };
      case 4:
      case 10:
      case '16':
      case 'A16':
        return {
          cor: '#ee1d23',
          texto: '16',
        };
      case 'todos':
        return {
          cor: '#white',
          texto: 'Todos',
        };
      default:
        return {
          cor: '#080500',
          texto: '18',
        };
    }
  };
}
