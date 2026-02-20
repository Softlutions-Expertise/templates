'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material';
import { TrendingUp, Receipt, Category } from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { dashboardService, DashboardSummary, ChartData } from '@services/dashboard.service';
import { formatCurrency } from '@utils/format';

// ----------------------------------------------------------------------

const COLORS = ['#00A76F', '#8E33FF', '#FFAB00', '#FF5630', '#00B8D9', '#919EAB'];

// ----------------------------------------------------------------------

export function OverviewView() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryData, chart] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getChartData(6),
      ]);
      setSummary(summaryData);
      setChartData(chart);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const pieData = summary?.byCategory.map((cat) => ({
    name: cat.name,
    value: cat.amount,
    color: cat.color,
  })) || [];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Resumo
      </Typography>

      {/* Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Este mês
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(summary?.totalMonth || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {summary?.countMonth} despesas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Receipt color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Total gasto
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(summary?.totalAll || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {summary?.countAll} despesas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Gastos nos últimos meses
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        notation: 'compact',
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="total" fill="#00A76F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Por categoria
              </Typography>
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 2 }}>
                    {pieData.map((cat, index) => (
                      <Chip
                        key={cat.name}
                        label={`${cat.name}: ${formatCurrency(cat.value)}`}
                        size="small"
                        sx={{
                          m: 0.5,
                          bgcolor: cat.color || COLORS[index % COLORS.length],
                          color: 'white',
                        }}
                      />
                    ))}
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  Nenhuma despesa este mês
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
