import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'sammie.bode78@ethereal.email',
        pass: 'H1HFZ8AYSYU7wVqN1B'
    }
});

const sendWelcomeEmail = async (userEmail,password,cnic) => {
    const mailOptions = {
        from: 'shahzaibalijamro@gmail.com',
        to: userEmail,
        subject: 'Welcome to Our App!',
        html: `<h1>Welcome!</h1><p>Thank you for registering with our app.</p><p>You can login with these credentials in our app.</p><p>CNIC : ${cnic}</p><p>PASSWORD : ${password}</p>`,
    };
    await transporter.sendMail(mailOptions);
};

export {sendWelcomeEmail}