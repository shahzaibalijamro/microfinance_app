import nodemailer from "nodemailer";

const notifyUser = async (userEmail, appointmentDate, appointmentTime, location, status) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_SMTP_USER,
            pass: process.env.GMAIL_SMTP_PASS,
        },
    });

    // Conditional email content based on status
    const emailContent =
        status === "Approved"
            ? `
                <h1>Congratulations!</h1>
                <p>Your loan request has been approved.</p>
                <p>Please visit the following location at the scheduled appointment time, as mentioned on the slip you received during your request.</p>
                <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
                <p><strong>Appointment Time:</strong> ${appointmentTime}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p>Make sure to bring all necessary documents as mentioned in the approval slip.</p>
                <p>We look forward to seeing you!</p>
            `
            : `
                <h1>Loan Request Update</h1>
                <p>We regret to inform you that your loan request has been rejected.</p>
                <p>If you have any questions or need further clarification, please visit our office or contact support.</p>
                <p>Thank you for considering our services.</p>
            `;

    const mailOptions = {
        from: 'shahzaibalijamro@gmail.com',
        to: userEmail,
        subject: status === "Approved" ? 'Loan Request Approved!' : 'Loan Request Rejected',
        html: emailContent,
    };

    await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (userEmail, password, cnic) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_SMTP_USER,
            pass: process.env.GMAIL_SMTP_PASS,
        },
    });

    let credentialsSection = "";
    if (cnic && password) {
        credentialsSection = `
            <p>You can log in with these credentials in our app:</p>
            <p><strong>CNIC:</strong> ${cnic}</p>
            <p><strong>Password:</strong> ${password}</p>
        `;
    }

    const mailOptions = {
        from: "shahzaibalijamro@gmail.com",
        to: userEmail,
        subject: "Welcome to Our App!",
        html: `
            <h1>Welcome!</h1>
            <p>Thank you for registering with our app.</p>
            ${credentialsSection}
        `,
    };

    await transporter.sendMail(mailOptions);
};

export {sendWelcomeEmail,notifyUser}