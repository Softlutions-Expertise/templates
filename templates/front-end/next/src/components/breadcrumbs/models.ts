import { BreadcrumbsProps } from '@mui/material/Breadcrumbs';
import { IUseCheckRoleProps } from '@softlutions/hooks';

// ----------------------------------------------------------------------

export type TBreadcrumbsLink = {
  name?: string;
  href?: string;
  icon?: React.ReactElement;
};

export interface TBreadcrumbs extends BreadcrumbsProps {
  heading?: string;
  moreLink?: string[];
  activeLast?: boolean;
  actionRouter?: {
    type: 'list' | 'create';
    route?: string;
    onClick?: () => void;
    label: string;
    disabled?: boolean;
    roles?: IUseCheckRoleProps
  };
  action?: React.ReactNode;
  links?: TBreadcrumbsLink[];
}
