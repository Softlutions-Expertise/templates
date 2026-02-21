import { SxProps, Tab, Tabs as TabMui } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

interface Props {
  tabs: { value: string; label: string; icon: JSX.Element; disabled?: boolean }[];
  currentTab: string;
  setCurrentTab: (value: any) => void;
  sx?: SxProps;
}

export const Tabs = ({ tabs, currentTab, setCurrentTab, sx }: Props) => {
  return (
    <Grid xs={12}>
      <TabMui
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
        sx={{
          mb: 3,
          ...sx,
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            icon={tab.icon}
            disabled={tab.disabled}
            iconPosition="start"
          />
        ))}
      </TabMui>
    </Grid>
  );
};
