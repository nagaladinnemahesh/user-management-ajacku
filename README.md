# User Management Dashboard

A simple React-based web application to view, add, edit, delete, filter, sort, and paginate user data. This project is built using **React**, **Axios**, **Bootstrap**, and **React-Bootstrap**, and demonstrates frontend CRUD operations with a mock API.

---

## Live Demo

Deployed on [Vercel](https://user-management-ajacku-jw5a.vercel.app/).

---

## Features Implemented

- View Users (list fetched from API)
- Add User (via modal form)
- Edit User (via modal form)
- Delete User (with confirmation)
- Search & Filter (by first name, last name, email, department)
- Sorting (by ID, first name, last name, email, department)
- Pagination (10/25/50/100 per page options)
- Responsive UI with Bootstrap
- Client-side validation (first name, email)
- Loading indicator (spinner on fetch/save)

---

## Installation & Setup

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/nagaladinnemahesh/user-management-ajacku.git

# Navigate to the project folder
cd user-management-ajacku

# Install dependencies
npm install

# Start the development server
npm start

```
### Project Structure
<img width="670" height="280" alt="image" src="https://github.com/user-attachments/assets/6ac5fd9f-a4bc-4a7b-9593-29dc888cd7f5" />

## Future Enhancements
If I had more time, I would improve this application with the following features:

- **Real Backend Integration**  
  Connect with MongoDB using Axios (free tier) instead of mock APIs.  

- **Role-Based Access Control (RBAC)**  
  Define permissions for Admin, Client, and other user types.  

- **Authentication & Authorization**  
  Implement secure login, JWT-based sessions, and protected routes.  

- **Dockerization**  
  Containerize the app for consistent development, testing, and deployment across environments.  


## Design Decisions
Some of the key architectural and UI decisions I made:

- **Pagination over Infinite Scroll**  
  - Pagination makes it easier for users to navigate large datasets without losing context.  

- **Use of Modals**  
  - Modals provide a clean and focused way to handle actions like add/edit without navigating away.  
  - Keeps the user experience simple and avoids cluttering the dashboard with too many inline forms.  

- **Componentization**  
  - Split the UI into small, reusable React components for maintainability and scalability.  

- **Bootstrap & Custom CSS**  
  - Used Bootstrap for quick responsive layout.  
  - Added custom CSS for finer control over branding and styles.  


