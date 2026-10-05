import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, DialogActions, Button } from "@mui/material";

export default function OrderDetailsDialog({ open, onClose, order }) {
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle>جزئیات سفارش #{order?.order_id}</DialogTitle>
      <DialogContent>
        <List>
          {order?.items?.map(i => (
            <ListItem key={i.product_uuid}>
              <ListItemText primary={i.name} secondary={`${i.qty} × ${i.price.toLocaleString()} تومان`} />
            </ListItem>
          ))}
        </List>
        <div style={{ marginTop: 12, fontWeight: 700 }}>{order?.total?.toLocaleString()} تومان</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>بستن</Button>
      </DialogActions>
    </Dialog>
  );
}
