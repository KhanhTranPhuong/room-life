# Room Life Backend 🏠

Modern NestJS backend API for Room Life application with authentication, user management, and admin features using MongoDB and JWT.

## 🚀 Features

- **Authentication System** (Register & Login with JWT)
- **User Management** (Customer, Admin, Collaborator roles)
- **Admin Dashboard APIs** (Get users, statistics)
- **Room Management** (CRUD operations)
- **Role-based Access Control**
- **MongoDB Integration** with Mongoose
- **Input Validation** with class-validator
- **Password Hashing** with bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## ⚙️ Setup & Installation

1. **Clone the repository:**
```bash
git clone https://github.com/KhanhTranPhuong/room-life.git
cd room-life
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Configuration:**
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration:
# - Set your MongoDB connection string
# - Generate a secure JWT secret
# - Configure other settings as needed
```

4. **Environment Variables (.env):**
```bash
MONGODB_URI=mongodb://localhost:27017/roomlife
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
NODE_ENV=development
```

5. **Start the application:**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

Server runs on http://localhost:3000 by default.

## 📚 API Documentation

Base URL: http://localhost:3000

### 🔐 Authentication Endpoints

#### Register
- POST /auth/register
- Body (JSON):
  {
    "fullName": "Nguyen Van A",
    "email": "a@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Error Response (400/409):**
```json
{
  "message": [
    "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)"
  ],
  "error": "Bad Request",
  "statusCode": 400,
  "timestamp": "2025-11-01T10:30:00.000Z",
  "path": "/auth/register"
}
```

**Validation Rules:**
- fullName: 2-50 chars, chỉ chữ cái và khoảng trắng
- email: định dạng email hợp lệ, max 100 chars  
- password: 8-50 chars, phải có: chữ hoa, chữ thường, số, ký tự đặc biệt (@$!%*?&)
- confirmPassword: phải trùng với password

#### Login
**POST** `/auth/login`
```json
{
  "email": "a@example.com",
  "password": "Password123!"
}
```

### 👥 Admin Management Endpoints

#### Create Admin Account
**POST** `/admin/create` (No authentication required)
```json
{
  "email": "admin@example.com",
  "password": "SecureAdminPassword123!"
}
```

#### Get All Users (Admin Only)
**GET** `/admin/users?page=1&limit=10&role=CUSTOMER`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`
- **Query Params:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (1-100, default: 10)
  - `role`: Filter by role (ADMIN, CUSTOMER, COLLABORATOR)

#### Get User Statistics (Admin Only)
**GET** `/admin/users/stats`
- **Headers:** `Authorization: Bearer <admin_jwt_token>`

### 🏠 Room Management Endpoints

#### Create Room
**POST** `/room` (Authenticated users)

#### Get All Rooms
**GET** `/room`

**Room Field Validation:**
- roomType: single, double, shared, studio, apartment
- area: 1-500 m²
- pricePerMonth: min 100,000 VND
- maxOccupants: 1-10 people
- floor: 0-50

## 🔒 Authentication & Authorization

### Using JWT Token in Postman
1. Login to get `access_token`
2. Set header: `Authorization: Bearer <access_token>`

### User Roles & Permissions
- **CUSTOMER**: Default role, can view rooms
- **COLLABORATOR**: Can manage rooms
- **ADMIN**: Full access, can manage users

## 📁 Project Structure

```
src/
├── auth/           # Authentication module
├── user/           # User management
├── admin/          # Admin operations
├── room/           # Room management
└── common/         # Shared utilities
    ├── decorators/ # Custom decorators
    ├── filters/    # Exception filters
    └── guards/     # Auth & role guards
```

## 🛠️ Development

```bash
# Watch mode
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Test
npm run test
```

## 📖 Detailed API Documentation

For complete API documentation with examples, see [ADMIN_API.md](./ADMIN_API.md)

## 🚀 Deployment Notes

### Environment Variables
- Use strong JWT_SECRET in production
- Set NODE_ENV=production
- Use MongoDB Atlas for production database
- Configure proper CORS settings

### Security Checklist
- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation
- ✅ Environment variables protection

## 🔄 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] File upload for room images
- [ ] Booking system
- [ ] Payment integration
- [ ] Real-time notifications
- [ ] Admin dashboard UI
- [ ] API rate limiting
- [ ] Comprehensive logging
- Add role-based guards for protected routes.
- Add unit/e2e tests.