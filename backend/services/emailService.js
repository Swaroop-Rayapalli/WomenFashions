const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    const emailUser = process.env.EMAIL_USER || 'pawcare376@gmail.com';
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailPassword) {
        console.error('❌ EMAIL_PASSWORD is not set in .env file');
        throw new Error('Email configuration is incomplete. Please set EMAIL_PASSWORD in .env file.');
    }

    console.log('📧 Creating email transporter for:', emailUser);

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPassword
        }
    });
};

// Send contact form email
const sendContactEmail = async (contactData) => {
    const { name, phone, email, service, message } = contactData;

    console.log('📨 Attempting to send email from contact form...');
    console.log('Contact details:', { name, phone, email, service });

    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER || 'pawcare376@gmail.com',
            to: 'pawcare376@gmail.com',
            subject: `New Contact Form Submission from ${name}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f4ec; border-radius: 10px;">
                <div style="background: linear-gradient(135deg, #9A1F2A, #7A1822); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: #D7A34A; margin: 0; font-size: 28px;">✨ Women Fashions</h1>
                    <p style="color: white; margin: 10px 0 0 0;">New Contact Form Submission</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #9A1F2A; margin-top: 0;">Contact Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #0F4C75; width: 150px;">Name:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #404040;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #0F4C75;">Phone:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #404040;">${phone}</td>
                        </tr>
                        ${email ? `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #0F4C75;">Email:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #404040;">${email}</td>
                        </tr>
                        ` : ''}
                        ${service ? `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #0F4C75;">Service:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #404040;">${service}</td>
                        </tr>
                        ` : ''}
                    </table>
                    
                    <div style="margin-top: 20px; padding: 20px; background: #f9f4ec; border-left: 4px solid #D7A34A; border-radius: 5px;">
                        <h3 style="color: #9A1F2A; margin-top: 0;">Message:</h3>
                        <p style="color: #404040; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 5px; text-align: center;">
                        <p style="margin: 0; color: #737373; font-size: 14px;">
                            📞 Call back: <a href="tel:${phone}" style="color: #9A1F2A; text-decoration: none; font-weight: bold;">${phone}</a>
                        </p>
                        ${email ? `
                        <p style="margin: 10px 0 0 0; color: #737373; font-size: 14px;">
                            ✉️ Email: <a href="mailto:${email}" style="color: #9A1F2A; text-decoration: none; font-weight: bold;">${email}</a>
                        </p>
                        ` : ''}
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #737373; font-size: 12px;">
                    <p>This email was sent from Women Fashions contact form</p>
                    <p>© 2025 Women Fashion - Premium Designing & Stitching Boutique</p>
                </div>
            </div>
        `,
            text: `
New Contact Form Submission

Name: ${name}
Phone: ${phone}
${email ? `Email: ${email}` : ''}
${service ? `Service: ${service}` : ''}

Message:
${message}

---
Women Fashions - Premium Designing & Stitching Boutique
        `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully! Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending error:', error.message);
        console.error('Error details:', error);
        throw error;
    }
};

module.exports = {
    sendContactEmail
};
