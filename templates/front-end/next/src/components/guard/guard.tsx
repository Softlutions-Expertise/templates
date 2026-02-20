import { IUseCheckRoleProps, useCheckRole } from '@softlutions/hooks';

// ----------------------------------------------------------------------

interface Props {
  roles: IUseCheckRoleProps;
  children: React.ReactNode;
}

export const Guard = ({ roles, children }: Props) => {
  const { checkRole } = useCheckRole();

  if (!checkRole(roles)) return <></>;
  return children;
};
