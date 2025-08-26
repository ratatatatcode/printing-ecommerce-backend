import { pool } from "../config/pool.js";

export const getCurrentUserOrders = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM orders WHERE userId = ?", [req.user.id]);
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const makeOrder = async (req, res) => {
    const { product, design, description, recipient, contactNo, email, address } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            `INSERT INTO orders
            (userId, product, design, description, recipient, contactNo, email, address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, product, design, description, recipient, contactNo, email, address]
        );

        res.status(201).json({ message: "Order created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}