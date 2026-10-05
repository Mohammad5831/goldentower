import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function OrderCard({ order, onOpen }) {
  return (
    <Card sx={{ mb: 1, borderRadius: 2 }}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2">سفارش #{order.order_id}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {order.items?.length || 0} کالا — {order.created_at && new Date(order.created_at).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>{order.total.toLocaleString()} تومان</Typography>
        </Box>
        <Box sx={{ ml: 1, textAlign: "center" }}>
          <LocalShippingIcon color="action" />
          <Button size="small" onClick={() => onOpen(order)} sx={{ mt: 1 }}>جزئیات</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
