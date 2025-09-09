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

export const addReview = async (req, res) => {
  const { content, rating } = req.body
  let reviewUrl = null;

  try { 
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;

      const { error } = await supabase.storage
        .from("reviews")
        .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("reviews")
        .getPublicUrl(fileName);

      reviewUrl = publicData?.publicUrl || null;
    }

    await pool.query(
      `INSERT INTO orders
        (content, rating, reviewUrl) VALUES (?, ?)`, [content, rating, reviewUrl]
    );

    res.status(201).json({message: "Review created successfully",});
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
}