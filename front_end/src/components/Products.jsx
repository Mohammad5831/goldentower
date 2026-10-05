import {
    Box,
    Button,
    IconButton,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductDialog from "../pages/ProductDialog";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const loadData = async () => {
        const res = await axios.get('https://api.goldentower.ir/api/products');
        setProducts(res.data);
    };

    const handleProductDelete = async (uuid) => {
        const res = await axios.delete(`https://api.goldentower.ir/api/products/${uuid}`)
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">مدیریت محصولات</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    افزودن محصول
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>نام</TableCell>
                        <TableCell>قیمت</TableCell>
                        <TableCell>عملیات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.price}</TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => {
                                        setSelected(p);
                                        setOpen(true);
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleProductDelete(p.product_uuid)}
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ProductDialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    setSelected(null);
                }}
                product={selected}
                refresh={loadData}
            />
        </Box>
    );
};

export default Products;
