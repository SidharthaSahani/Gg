# Restaurant Table Booking System - Folder Structure

## Project Overview
This is a full-stack restaurant table booking system with admin dashboard, food menu, and carousel management.

## Folder Structure

```
ResturantTable/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cors.js
│   │   │   ├── database.js
│   │   │   └── multer.js
│   │   ├── controllers/
│   │   │   ├── bookingController.js
│   │   │   ├── carouselController.js
│   │   │   ├── menuController.js
│   │   │   ├── tableController.js
│   │   │   └── uploadController.js
│   │   ├── middleware/
│   │   │   ├── asyncHandler.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── bookingRoutes.js
│   │   │   ├── carouselRoutes.js
│   │   │   ├── menuRoutes.js
│   │   │   ├── tableRoutes.js
│   │   │   └── uploadRoutes.js
│   │   ├── utils/
│   │   │   └── responseHelper.js
│   │   └── app.js
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── serverbackupcode
└── frontend/
    ├── dist/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AdminPanel.tsx
    │   │   ├── BookingForm.tsx
    │   │   ├── Carousel.tsx
    │   │   ├── FoodManagement.tsx
    │   │   ├── FoodMenu.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── TableGrid.tsx
    │   │   └── UserBooking.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── lib/
    │   │   ├── api.ts
    │   │   └── supabase.ts
    │   ├── pages/
    │   │   ├── AboutUs.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   ├── AdminLogin.tsx
    │   │   └── CustomerBooking.tsx
    │   ├── App.tsx
    │   ├── index.css
    │   ├── main.tsx
    │   └── vite-env.d.ts
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── server.js
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## Component Descriptions

### Backend Components
- **config/**: Configuration files for CORS, database, and file uploads
- **controllers/**: Business logic for handling requests
- **middleware/**: Express middleware for error handling and async operations
- **routes/**: API route definitions
- **utils/**: Utility functions for response formatting

### Frontend Components
- **components/**: Reusable UI components
- **context/**: React context for authentication
- **lib/**: API utilities and database connections
- **pages/**: Page-level components
- **App.tsx**: Main application router and layout

## Key Features
- Restaurant table booking system
- Admin dashboard for managing tables, bookings, and menu
- Carousel image management
- Food menu management
- Responsive design for mobile and desktop
- Authentication system
- About Us page