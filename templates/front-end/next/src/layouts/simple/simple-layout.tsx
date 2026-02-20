import { HeaderSimple as Header } from '../common';

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
}

export function SimpleLayout({ children }: Props) {
  return (
    <>
      <Header />

      {children}
    </>
  );
}
