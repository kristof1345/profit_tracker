import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

const Dashboard = () => {
  const [chartData, setChartData] = useState({ dates: [], profits: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfits = async () => {
      const { data: products, error } = await supabase
        .from("products")
        .select("sale_price, material_cost, sold_at")
        .order("sold_at", { ascending: true });

      if (error || !products) {
        setLoading(false);
        return;
      }

      // Grouping logic (same as before but optimized for MUI arrays)
      const totals = products.reduce((acc, item) => {
        const date = item.sold_at;
        const profit = item.sale_price - item.material_cost;
        acc[date] = (acc[date] || 0) + profit;
        return acc;
      }, {});

      setChartData({
        dates: Object.keys(totals), // X-Axis labels
        profits: Object.values(totals), // Y-Axis values
      });
      setLoading(false);
    };

    fetchProfits();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Business Performance
      </Typography>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 4, bgcolor: "#1e1e1e" }}>
        <LineChart
          xAxis={[
            {
              data: chartData.dates,
              scaleType: "point",
              label: "Date of Sale",
            },
          ]}
          series={[
            {
              data: chartData.profits,
              label: "Profit ($)",
              color: "#0288d1",
              area: true, // This adds a nice subtle fill under the line
            },
          ]}
          height={400}
          margin={{ left: 60, right: 30, top: 30, bottom: 50 }}
          grid={{ vertical: true, horizontal: true }}
          // Styling for Dark Mode look
          sx={{
            ".MuiLineElement-root": { strokeWidth: 4 },
            ".MuiAreaElement-root": { fill: "rgba(2, 136, 209, 0.2)" },
            "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": { fill: "#ccc" },
            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
              fill: "#ccc",
            },
            "& .MuiChartsAxis-label": { fill: "#fff" },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Dashboard;
