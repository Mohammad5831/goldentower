import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const res = await axios.get('https://api.goldentower.ir/api/users');
            setUsers(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUsers()
    }, []);

    return (
        <>
            <Typography variant="h6" mb={2}>
                کاربران
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>نام</TableCell>
                        <TableCell>شماره</TableCell>
                        <TableCell>نقش</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.phone}</TableCell>
                            <TableCell>{u.role}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default Users;
