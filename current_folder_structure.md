# Restaurant Table Booking System - Folder Structure

## Project Root: `d:\Abnish\ResturantTable`

```
ResturantTable/
├── backend/
│   ├── .env
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── serverbackupcode
│   ├── src/
│   │   ├── app.js
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
│   │   └── utils/
│   │       └── responseHelper.js
│   └── uploads/
├── frontend/
│   ├── .gitignore
│   ├── README.md
│   ├── dist/
│   │   ├── index.html
│   │   └── assets/
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public/
│   │   └── logoHD.png
│   ├── server.js
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── Carousel.tsx
│   │   │   ├── FoodManagement.tsx
│   │   │   ├── FoodMenu.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── TableGrid.tsx
│   │   │   ├── UserBooking.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminPanel.tsx
│   │   │   │   ├── BookingTimeline.tsx
│   │   │   │   ├── BookingsTable.tsx
│   │   │   │   ├── CarouselManagement.tsx
│   │   │   │   └── TablesManagement.tsx
│   │   │   └── adminpanelbackupcode
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── useBookings.ts
│   │   │   ├── useCraousel.ts
│   │   │   └── useTables.ts
│   │   ├── index.css
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── apibackupcode
│   │   ├── logo.jpeg
│   │   ├── main.tsx
│   │   ├── pages/
│   │   │   ├── AboutUs.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── CustomerBooking.tsx
│   │   ├── services/
│   │   │   └── carouselService.ts
│   │   ├── utils/
│   │   │   └── bookingUtils.ts
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── FOLDER_STRUCTURE.md
└── .git/
```

## Backend Structure

### Backend Root (`backend/`)
- **Server Configuration**: `server.js` - Main server entry point
- **Application Logic**: `src/app.js` - Express app configuration
- **Environment**: `.env` - Environment variables
- **Dependencies**: `package.json`, `package-lock.json`
- **Uploads**: `uploads/` - Directory for uploaded files

### Backend Source (`backend/src/`)
- **Configuration**: `config/` - Database, CORS, and multer configuration
- **Controllers**: `controllers/` - Business logic for different features
- **Routes**: `routes/` - API route definitions
- **Middleware**: `middleware/` - Custom middleware functions
- **Utilities**: `utils/` - Helper functions

## Frontend Structure

### Frontend Root (`frontend/`)
- **Build Output**: `dist/` - Production build files
- **Configuration**: Various config files (Vite, TypeScript, PostCSS, etc.)
- **Public Assets**: `public/` - Static assets
- **Source Code**: `src/` - Main application source

### Frontend Source (`frontend/src/`)
- **Main Files**: `App.tsx`, `main.tsx`, `index.css`
- **Components**: `components/` - React components
  - **Admin Components**: Specialized admin panel components
- **Hooks**: `hooks/` - Custom React hooks for data management
- **Lib**: `lib/` - API and utility functions
- **Pages**: `pages/` - Top-level page components
- **Context**: `context/` - React context providers
- **Services**: `services/` - Service layer functions
- **Utils**: `utils/` - Utility functions

## Key Features

### Backend API Endpoints
- `/api/tables` - Table management
- `/api/bookings` - Booking management
- `/api/menu` - Menu item management
- `/api/carousel-images` - Carousel image management
- `/api/upload` - File upload functionality

### Frontend Features
- **Admin Panel**: Complete admin dashboard with refresh functionality
- **Table Management**: View and manage restaurant tables
- **Booking System**: Manage customer bookings
- **Menu Management**: Add/edit/delete menu items
- **Carousel Management**: Manage homepage carousel images
- **Authentication**: Admin login system