import React, { useEffect, useState } from "react";
import { Container, Box, TextField, MenuItem, IconButton, Typography, Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OrderCard from "../components/OrderCard";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import { fetchOrders, fetchOrderById } from "../api/api";

export default function Orders({ token }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [openOrder, setOpenOrder] = useState(null);

  const load = async () => {
    try {
      const res = await fetchOrders(token, { page, q: query, status });
      setOrders(res.data.orders || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, [page, status]);

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 8 }}>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="جستجوی سفارش یا محصول"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{ endAdornment: <IconButton onClick={load}><SearchIcon /></IconButton> }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField select size="small" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">همه وضعیت‌ها</MenuItem>
          <MenuItem value="pending">در انتظار</MenuItem>
          <MenuItem value="paid">پرداخت شده</MenuItem>
          <MenuItem value="shipped">ارسال شده</MenuItem>
          <MenuItem value="delivered">تحویل شده</MenuItem>
        </TextField>
      </Box>

      <Box>
        {orders.length === 0 ? <Typography color="text.secondary">سفارشی یافت نشد</Typography> :
          orders.map(o => <OrderCard key={o.order_id} order={o} onOpen={setOpenOrder} />)}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination count={5} page={page} onChange={(e, v) => setPage(v)} />
      </Box>

      <OrderDetailsDialog open={Boolean(openOrder)} order={openOrder} onClose={() => setOpenOrder(null)} />
    </Container>
  );
}
