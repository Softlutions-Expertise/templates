export const LimparCpf = (cpfSujo: any) => {
  if (typeof cpfSujo === 'string') {
    return cpfSujo.replace(/\D/g, '');
  }

  return cpfSujo;
};
