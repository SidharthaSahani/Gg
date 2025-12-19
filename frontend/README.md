# Restaurant Table Booking System

A React-based restaurant table booking application with admin panel and customer interface, now using MongoDB for local storage with image upload capability and permanent booking history.

## Features

- Customer interface for browsing tables and making reservations
- Admin panel for managing tables, bookings, and food menu
- Real-time updates using MongoDB
- Image upload functionality for food menu items
- Permanent booking history preservation
- View all menu items with "All Items" filter
- Responsive design with Tailwind CSS
- Automatic session timeout for admin security
- Active bookings display with historical data retention

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB installed locally (for backend services)

## Setup Instructions

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd ResturantTable
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the `backend` directory with your MongoDB URI:
   ```
   MONGODB_URI=mongodb://localhost:27017/abnish
   PORT=5001
   ```

5. Run the backend server:
   ```bash
   cd backend
   npm run dev
   ```

6. Run the frontend development server:
   ```bash
   cd ..
   npm run dev
   ```

7. Build for production:
   ```bash
   npm run build
   ```

8. Run in production mode:
   ```bash
   npm start
   ```

## Database Setup

The application uses MongoDB for local storage with the following collections:

1. `restaurant_tables` - Stores table information
2. `bookings` - Stores booking records with status tracking
3. `food_menu` - Stores food menu items

The application will automatically create these collections when it starts.

## Booking History

The application now preserves all booking records permanently:
- When a table is released, bookings are marked as "completed" instead of being deleted
- All customer data is retained for future reference
- Bookings can have different statuses: pending, confirmed, completed, cancelled
- Completed timestamp is recorded for historical tracking
- Recent Bookings section shows only active bookings, while completed bookings remain in the database

## Menu Navigation

Customers can now view all menu items at once using the "All Items" filter, in addition to filtering by category:
- All Items (shows everything)
- Appetizer
- Main
- Dessert
- Beverage

## Image Upload

The admin panel now supports uploading images from your device for food menu items:
- Images are stored locally on the server
- Supported formats: JPG, PNG, GIF
- Maximum file size: 5MB
- Images are automatically resized and optimized

## Admin Security

The admin panel now includes enhanced security features:

1. **Session Timeout**: Admin sessions automatically expire after 15 minutes of inactivity
2. **Activity Monitoring**: User activity (mouse movement, keyboard input, clicks, scrolling) resets the session timer
3. **Session Warning**: A warning notification appears 1 minute before session expiration
4. **Automatic Logout**: Users are automatically logged out when the session expires
5. **Session Persistence**: Sessions persist across browser refreshes within the 15-minute window

## Admin Access

Use the following credentials to access the admin panel:
- Email: admin@restaurant.com
- Password: admin123

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the built app
- `npm run typecheck` - Runs TypeScript type checking
- `npm start` - Runs the production server (after build)

Note: ESLint configuration needs to be updated for compatibility with current dependencies.

## Troubleshooting

### Blank Screen on Refresh

This is a common issue with Single Page Applications (SPAs). The solution implemented:

1. **Development Server**: Vite is configured with `historyApiFallback: true` to handle client-side routing
2. **Production Server**: A custom Express server is included that serves `index.html` for all routes

If you're still experiencing blank screens on refresh:
1. Make sure you're running the application with `npm start` after building
2. If using a different server, ensure it's configured to serve `index.html` for all routes

### React Router Warnings

You may see warnings in the console about calling `navigate()` outside of `useEffect` or about future flags. These have been addressed:

1. **navigate() warning**: Fixed by moving navigation calls inside `useEffect` hooks
2. **Future flag warnings**: These are informational warnings about upcoming React Router v7 features and can be safely ignored for now. To suppress them, you can add the future flags to your Router component:

```jsx
<Router future={{
  v7_startTransition: true,
  v7_relativeSplatPath: true
}}>
```

However, these warnings do not affect functionality and can be safely ignored.

## Technologies Used

- React 18 with TypeScript
- Vite
- MongoDB (Local Database)
- Express.js (Backend Framework)
- Multer (File Upload Handling)
- Tailwind CSS
- React Router v6
- Lucide React Icons