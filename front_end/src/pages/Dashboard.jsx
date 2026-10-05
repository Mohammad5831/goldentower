import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import KPIcard from "../components/KPIcard";
import OrderCard from "../components/ OrderCard";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import { fetchOrders } from "../api/api";

export default function Dashboard({ token }) {
  const [kpis, setKpis] = useState({ wallet: 0, activeOrders: 0, lastOrder: null });
  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchOrders(token, { page: 1, per_page: 5 });
        const data = res.data;
        setOrders(data.orders || []);
        // setKpis({
        //   wallet: 0, // نمونه یا از API بگیر
        //   activeOrders: data.orders?.filter(o => o.status !== "delivered").length || 0,
        //   lastOrder: data.orders?.[0] || null,
        // });
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ pt: 5, pb: 8 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h3" color="warning.main" sx={{ flex: 1 }}>داشبورد</Typography>
        <IconButton><DashboardIcon /></IconButton>
      </Box>

      <Grid container spacing={1}>
        {/* <Grid item xs={12} sm={6}>
          <KPIcard title="موجودی کیف پول" value={`${kpis.wallet?.toLocaleString()} تومان`} icon={<AccountBalanceWalletIcon color="warning.main" />} />
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <KPIcard title="سفارش‌های فعال" value={kpis.activeOrders} icon={<ShoppingBagIcon color="warning.main"/>} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" color="warning.main" sx={{ mb: 1 }}>سفارش‌های اخیر</Typography>
        {orders.length === 0 ? (
          <Typography color="text.secondary">سفارشی یافت نشد</Typography>
        ) : (
          orders.map(o => <OrderCard key={o.order_id} order={o} onOpen={setOpenOrder} />)
        )}
      </Box>

      <OrderDetailsDialog open={Boolean(openOrder)} order={openOrder} onClose={() => setOpenOrder(null)} />
    </Container>
  );
}
