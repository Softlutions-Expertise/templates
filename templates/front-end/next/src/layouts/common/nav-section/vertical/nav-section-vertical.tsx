import { Collapse, List, Stack } from '@mui/material';
import { memo, useCallback, useState } from 'react';

import { useCheckRole } from '@softlutions/hooks';
import { navVerticalConfig } from '../config';
import { NavConfigProps, NavListProps, NavSectionProps } from '../types';
import NavList from './nav-list';
import { StyledSubheader } from './styles';

// ----------------------------------------------------------------------

function NavSectionVertical({ data, config, sx, ...other }: NavSectionProps) {
  return (
    <Stack sx={sx} {...other}>
      {data.map((group, index) => (
        <Group
          key={group.subheader || index}
          group={group as any}
          subheader={group.subheader}
          items={group.items}
          config={navVerticalConfig(config)}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionVertical);

// ----------------------------------------------------------------------

type GroupProps = {
  subheader: string;
  items: NavListProps[];
  config: NavConfigProps;
  group?: NavListProps;
};

function Group({ subheader, items, config, group }: GroupProps) {
  const { checkRole, getRole } = useCheckRole();

  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const renderContent = items.map((list) => (
    <NavList
      key={list.title + list.path}
      data={list}
      depth={1}
      hasChild={list?.children?.length > 0}
      config={config}
    />
  ));

  const roles = [
    ...(group?.roles ?? []),
    ...items.flatMap((it) => it?.roles ?? []),
  ];
  if (roles && !checkRole(roles)) {
    return null;
  }

  return (
    <List disablePadding sx={{ px: 2 }}>
      {subheader ? (
        <>
          <StyledSubheader disableGutters disableSticky onClick={handleToggle} config={config}>
            {subheader}
          </StyledSubheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </List>
  );
}
