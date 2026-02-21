export const getStartOfTodayUtc = () => {
  const now = new Date();

  const mes = now.getMonth() + 1;

  return new Date(
    `${now.getFullYear()}-${mes.toString().padStart(2, '0')}-01T00:00:00.000Z`,
  );
};
