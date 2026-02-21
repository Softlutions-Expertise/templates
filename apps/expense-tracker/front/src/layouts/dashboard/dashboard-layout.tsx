'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Receipt,
  Category,
  Assessment,
  Logout,
  AccountCircle,
  History,
  ExpandLess,
  ExpandMore,
  Description,
} from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';

import { useAuth } from '@hooks/use-auth';

// ----------------------------------------------------------------------

interface MenuItem {
  path?: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const MENU_ITEMS: MenuItem[] = [
  { path: '/dashboard/', label: 'Resumo', icon: <Dashboard /> },
  { path: '/dashboard/expenses/', label: 'Despesas', icon: <Receipt /> },
  { path: '/dashboard/categories/', label: 'Categorias', icon: <Category /> },
  {
    label: 'Relatórios',
    icon: <Assessment />,
    children: [
      { path: '/dashboard/reports/', label: 'Despesas', icon: <Description /> },
      { path: '/dashboard/reports/auditoria/', label: 'Auditoria', icon: <History /> },
    ],
  },
];

// ----------------------------------------------------------------------

interface DashboardLayoutProps {
  children: ReactNode;
}

// ----------------------------------------------------------------------

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportsOpen, setReportsOpen] = useState(pathname.includes('/reports/'));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => pathname === path;
  const isParentActive = (item: MenuItem) => {
    if (item.path) return isActive(item.path);
    return item.children?.some(child => child.path && pathname.startsWith(child.path));
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const toggleReports = () => {
    setReportsOpen(!reportsOpen);
  };

  const renderMenuItem = (item: MenuItem, isSubItem = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isParentActive(item);

    if (hasChildren) {
      return (
        <div key={item.label}>
          <ListItem disablePadding>
            <ListItemButton
              selected={active}
              onClick={toggleReports}
              sx={{ pl: isSubItem ? 4 : 2 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {reportsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderMenuItem(child, true))}
            </List>
          </Collapse>
        </div>
      );
    }

    return (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          selected={item.path ? isActive(item.path) : false}
          onClick={() => item.path && handleNavigate(item.path)}
          sx={{ pl: isSubItem ? 4 : 2 }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    );
  };

  const renderDrawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          💰 Expense Tracker
        </Typography>
      </Box>
      <List>
        {MENU_ITEMS.map((item) => renderMenuItem(item))}
      </List>
    </Box>
  );

  // Para navegação mobile (bottom nav), mostrar apenas itens principais
  const flatMenuItems = MENU_ITEMS.flatMap(item => 
    item.children 
      ? item.children.map(child => ({ ...child, parentLabel: item.label }))
      : [item]
  );

  const currentTab = flatMenuItems.findIndex((item) => 
    item.path ? pathname === item.path : false
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main' }}>
            Expense Tracker
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <AccountCircle sx={{ mr: 1 }} />
              {user?.name}
            </MenuItem>
            <MenuItem onClick={logout}>
              <Logout sx={{ mr: 1 }} />
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer (mobile) */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {renderDrawer}
        </Drawer>
      )}

      {/* Sidebar (desktop) */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {renderDrawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          pb: isMobile ? 10 : 3,
          ml: isMobile ? 0 : '280px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation (mobile) */}
      {isMobile && (
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
          elevation={3}
        >
          <BottomNavigation
            value={currentTab}
            onChange={(_, newValue) => {
              const item = flatMenuItems[newValue];
              if (item.path) router.push(item.path);
            }}
          >
            {flatMenuItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
