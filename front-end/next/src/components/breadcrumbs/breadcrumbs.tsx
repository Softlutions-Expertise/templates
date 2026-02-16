'use client';

import { RouterLink } from '@/routes';
import { Box, Breadcrumbs as MuiBreadcrumbs, Stack, Typography } from '@mui/material';
import { RiFileList2Line } from 'react-icons/ri';

import { Button } from '../button';
import { Iconify } from '../iconify';
import { BreadcrumbsLink } from './link-item';
import { TBreadcrumbs } from './models';

// ----------------------------------------------------------------------

export function Breadcrumbs({
  links,
  action,
  actionRouter,
  heading,
  moreLink,
  activeLast,
  sx,
  ...other
}: TBreadcrumbs) {
  const lastLink = links?.[links.length - 1].name;

  const ButtonActionRouter = () => {
    return (
      <Button
        component={RouterLink}
        href={actionRouter?.route || '#'}
        onClick={actionRouter?.onClick}
        variant="contained"
        startIcon={
          actionRouter?.type === 'list' ? <RiFileList2Line /> : <Iconify icon="mingcute:add-line" />
        }
        disabled={actionRouter?.disabled || false}
        roles={actionRouter?.roles}
      >
        {actionRouter?.label}
      </Button>
    );
  };

  return (
    <Box sx={{ ...sx, mb: { xs: 3, md: 3 } }}>
      <Stack direction="row" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>
          {/* HEADING */}
          {heading && (
            <Typography variant="h3" gutterBottom>
              {heading}
            </Typography>
          )}

          {/* BREADCRUMBS */}
          {!!links?.length && (
            <MuiBreadcrumbs separator={<Separator />} {...other}>
              {links.map((link) => (
                <BreadcrumbsLink
                  key={link.name || ''}
                  link={link}
                  activeLast={activeLast}
                  disabled={link.name === lastLink}
                />
              ))}
            </MuiBreadcrumbs>
          )}
        </Box>

        {action || actionRouter ? (
          <Box sx={{ flexShrink: 0 }}>
            {' '}
            {action} {actionRouter && <ButtonActionRouter />}{' '}
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'text.disabled',
      }}
    />
  );
}
