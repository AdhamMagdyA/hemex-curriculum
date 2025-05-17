const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const { emailPassword, emailFrom } = require('../config');

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailFrom,
    pass: emailPassword
  }
});

class NotificationService {
  async createNotification(userId, type, content) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          content
        }
      });
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async sendOrderConfirmationEmail(order, user) {
    try {
      const mailOptions = {
        from: EMAIL_FROM,
        to: user.email,
        subject: 'Order Confirmation',
        html: `
          <h2>Thank you for your order!</h2>
          <p>Order ID: ${order.id}</p>
          <p>Total Amount: $${order.totalAmount}</p>
          <p>Payment Status: ${order.status}</p>
          <p>Shipping Address: ${order.shippingAddress}</p>
          
          <h3>Order Items:</h3>
          <ul>
            ${order.items.map(item => `
              <li>
                ${item.product.name} × ${item.quantity}
                <br>
                Unit Price: $${item.unitPrice}
              </li>
            `).join('')}
          </ul>

          <p>You can view your order status at: ${BASE_URL}/orders/${order.id}</p>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendAdminNotification(order) {
    try {
      // Get admin users
      const admins = await prisma.user.findMany({
        where: {
          role: {
            name: 'admin'
          }
        }
      });

      // Create notification for each admin
      for (const admin of admins) {
        await this.createNotification(
          admin.id,
          'order_confirmation',
          `New order #${order.id} has been placed`
        );
      }
    } catch (error) {
      console.error('Error sending admin notification:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
