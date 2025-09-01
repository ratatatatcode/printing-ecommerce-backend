import { pool } from "../config/pool.js";
import sendEmail from "../utils/sendEmail.js";

export const getSales = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM orders WHERE status = 'Delivered' AND paymentStatus = 'Paid'`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const updatePrice = async (req, res) => {
    const { orderId, price } = req.body;

    try {
        await pool.query("UPDATE orders SET price = ? WHERE id = ?", [price, orderId]);

        await sendEmail({
            to: email,
            subject: `Price Update for Order: #${orderId}`,
            text: "Your order has been evaluated. Please proceed to pay the updated price listed on our website."
        });
        
        res.status(200).json({ message: "Order price updated and email notification sent." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
        await pool.query(`DELETE FROM users WHERE id = ?;`, [id]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
