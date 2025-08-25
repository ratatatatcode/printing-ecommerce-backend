import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/pool.js";
import sendEmail from "../utils/sendEmail.js";

export const register = async (req, res) => {
    const {
        firstName,
        lastName,
        username,
        email,
        contactNo,
        birthdate,
        address,
        password,
    } = req.body;

    try {
        const [existing] = await pool.query(
            "SELECT * FROM users WHERE email = ? OR username = ? OR contactNo = ?",
            [email, username, contactNo]
        );
        if (existing.length > 0) {
            return res.status(400)
            .json({ message: "Email, username, or contact number already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users 
            (firstName, lastName, username, email, contactNo, birthdate, address, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, username, email, contactNo, birthdate, address, hashedPassword]
        );

        const token = jwt.sign({ email }, process.env.ACTIVATION_TOKEN, { expiresIn: "5m" });
        const url = `${process.env.FRONTEND_URL}/api/auth/activate/${token}`;

        await sendEmail({
            to: email,
            subject: "Activate your account",
            text: `Click to activate: ${url}`
        });

        res.status(201).json({ message: "User registered. Check email to activate." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];
        if (!user.isActive) {
            return res.status(403).json({ message: "Please activate your account first" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const activateAccount = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN);

        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [decoded.email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid activation link" });
        }

        const user = rows[0];
        if (user.isActive) {
            return res.status(400).json({ message: "Account already existed" });
        }

        await pool.query("UPDATE users SET isActive = true WHERE email = ?", [decoded.email]);

        res.json({ message: "Account activated successfully." });
    } catch (err) {
        console.error(err);

        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ message: "Activation link expired" });
        }

        res.status(500).json({ message: "Server error." });
    }
};