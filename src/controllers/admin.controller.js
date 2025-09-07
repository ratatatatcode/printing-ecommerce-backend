import { pool } from "../config/pool.js";
import sendEmail from "../utils/sendEmail.js";

export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.id,
                u.firstName,
                u.lastName,
                u.username,
                u.email,
                u.contactNo,
                u.birthdate,
                u.address,
                u.isActive,
                COUNT(o.id) AS pendingOrdersCount
            FROM users u
            LEFT JOIN orders o 
                ON u.id = o.userId 
                AND o.status IN ("Pending", "Evaluation")
            WHERE u.role = "regular"
            GROUP BY u.id
        `);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id AS id,
        o.userId,
        o.product,
        o.link,
        o.design,
        o.description,
        o.recipient,
        o.contactNo,
        o.email,
        o.address,
        o.status,
        o.paymentStatus,
        o.price,
        CAST(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'paymentId', p.id,
              'userId', p.userId,
              'referenceId', p.referenceId,
              'paymentUrl', p.paymentUrl
            )
          ) AS CHAR
        ) AS payments
      FROM orders o
      LEFT JOIN payments p ON o.id = p.orderId
      GROUP BY o.id
    `);

    const result = rows.map(row => ({
        ...row,
        payments: row.payments ? JSON.parse(row.payments) : []
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

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
