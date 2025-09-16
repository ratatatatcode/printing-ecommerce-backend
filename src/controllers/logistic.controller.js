import { pool } from "../config/pool.js";
import sendEmail from "../utils/sendEmail.js";

export const getUndeliveredItem = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM orders 
            WHERE status IN ('Pending', 'Processing', 'Shipped', 'Out for Delivery') 
            AND paymentStatus = 'Paid'
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateDeliveryStatus = async (req, res) => {
    const { orderId, status, email } = req.body;

    try {
        await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);

        let feedback = ""; 
        if (status === "Shipped") {
            feedback = `The order #${orderId} has been shipped.`;
        } else if (status === "Delivered") {
            feedback = `The order #${orderId} has been delivered successfully.`;
        } else {
            feedback = `The order #${orderId} status has been updated to: ${status}.`;
        }

        await sendEmail({
            to: email,
            subject: `Delivery Status for Order: #${orderId}`,
            text: feedback,
        });

        res.status(200).json({ message: feedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}