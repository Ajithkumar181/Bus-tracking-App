bus-tracker-backend/
│
├── controllers/        # Business logic for each route
│   └── userController.js
│   └── busController.js
│   └── routeController.js
│   └── locationController.js
│
├── models/             # DB queries and SQL abstraction
│   └── db.js           # PostgreSQL client connection
│   └── userModel.js
│   └── busModel.js
│
├── routes/             # Express route definitions
│   └── userRoutes.js
│   └── busRoutes.js
│
├── middleware/         # Auth middleware and error handling
│   └── auth.js
│
├── .env                # Environment variables (port, DB_URL, etc.)
├── app.js              # Main express app entry
├── package.json
