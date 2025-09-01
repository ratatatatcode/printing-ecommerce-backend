import { pool } from "../config/pool.js";
import { supabase } from "../config/supabase.js";

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
  const { product, description, recipient, contactNo, email, address } = req.body;
  const userId = req.user?.id;
  let designUrl = null;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;

      const { error } = await supabase.storage
        .from("uploads")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("uploads")
        .getPublicUrl(fileName);

      designUrl = publicData?.publicUrl || null;
    }

    await pool.query(
      `INSERT INTO orders
        (userId, product, design, description, recipient, contactNo, email, address, paymentStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, product, designUrl, description, recipient, contactNo, email, address, "pending"]
    );

    res.status(201).json({
      message: "Order created successfully",
      design: designUrl,
    });
  } catch (err) {
    console.error("makeOrder error:", err);
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