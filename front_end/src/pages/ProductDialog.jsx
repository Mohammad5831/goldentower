import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createProduct, updateProduct } from "../api/products.api";

const ProductDialog = ({ open, onClose, product, refresh }) => {
  const [form, setForm] = useState({ name: "", price: "" });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const submit = async () => {
    product
      ? await updateProduct(product.id, form)
      : await createProduct(form);
    refresh();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {product ? "ویرایش محصول" : "افزودن محصول"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="نام محصول"
          margin="normal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="قیمت"
          margin="normal"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <Button fullWidth variant="contained" onClick={submit}>
          ثبت
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
