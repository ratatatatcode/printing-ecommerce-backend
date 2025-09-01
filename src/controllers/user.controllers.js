import { pool } from "../config/pool.js";

export const getCurrentUser = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const cancelOrder = async (req, res) => {
    const { orderId } = req.body

    try {
        await pool.query("UPDATE orders SET status = ? WHERE id = ?", ["Cancelled", orderId]);

        res.status(200).json({ message: `Order #${orderId} has been cancelled successfully.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}