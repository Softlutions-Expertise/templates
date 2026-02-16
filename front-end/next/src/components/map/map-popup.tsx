import { SxProps, Theme } from '@mui/material/styles';
import { PopupProps } from 'react-map-gl';

import { StyledPopup } from './styles';

// ----------------------------------------------------------------------

interface MapControlPopupProps extends PopupProps {
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export default function MapPopup({ sx, children, ...other }: MapControlPopupProps) {
  return (
    <StyledPopup anchor="bottom" sx={sx} {...other}>
      {children}
    </StyledPopup>
  );
}
