'use client';

import { Button as ButtonMui, ButtonProps } from '@mui/material';
import { IUseCheckRoleProps, useCheckRole } from '@softlutions/hooks';

// ----------------------------------------------------------------------

interface Props extends ButtonProps {
  children: React.ReactNode;
  roles?: IUseCheckRoleProps;
  [key: string]: any;
}

export function Button({ children, roles, ...other }: Props) {
  const { checkRole } = useCheckRole();

  if (roles && !checkRole(roles)) {
    return <></>;
  }

  return <ButtonMui {...other}>{children}</ButtonMui>;
}
