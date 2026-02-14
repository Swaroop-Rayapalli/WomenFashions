# Women Fashion Backend API

MySQL-based backend for Women Fashion e-commerce website.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure MySQL:**
   - Create database: `womenfashion_db`
   - Update `.env` with your MySQL credentials

3. **Start server:**
   ```bash
   npm run dev
   ```

4. **Test API:**
   ```
   GET http://localhost:5000/api/health
   ```

## Features

- ✅ MySQL database with Sequelize ORM
- ✅ JWT authentication
- ✅ Role-based access control (Admin/Staff)
- ✅ File upload (images)
- ✅ Error handling
- ✅ Security (Helmet, CORS, Rate limiting)
- ✅ Auto-create database tables

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (Protected)

### Products (Coming Soon)
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)

### Orders (Coming Soon)
- `GET /api/orders` - Get all orders (Admin)
- `POST /api/orders` - Create order

## Environment Variables

Create `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_NAME=womenfashion_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:8000
```

## Database Schema

- users
- categories
- products
- product_images
- product_sizes
- customers
- customer_addresses
- orders
- order_items

## Tech Stack

- Node.js + Express
- MySQL + Sequelize
- JWT + bcrypt
- Multer (file uploads)
- Helmet (security)

## Documentation

See `backend_setup_guide.md` for detailed documentation.
