import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            password: process.env.SMTP_PASSWORD
        },
    });

    await transporter.sendMail({
        from: `Snads Trading <${process.env.SMTP_MAIL}>`,
        to,
        subject,
        text,
    });
};

export default sendEmail;