# ABAC (Attribute Based Access Control) Demo

A React-based demonstration of Attribute Based Access Control implementation using TypeScript and Clerk Authentication.

## Overview

This project showcases a practical implementation of ABAC in a Todo application, where different users have varying levels of permissions based on their roles and relationships to resources.

### Features

- **Role-Based Permissions**: Three distinct roles (Admin, Moderator, User) with different permission sets
- **Resource Management**: Todo items and Comments with granular access control
- **Real-time Permission Checking**: Dynamic permission validation for all actions
- **Clerk Authentication**: Secure user authentication and role management
- **Responsive UI**: Modern, mobile-friendly interface

## Permission Structure

### Admin
- Full access to all todos and comments
- Can manage system-wide permissions
- Unrestricted CRUD operations

### Moderator
- Can view and create todos
- Can update any todo
- Can delete only completed todos
- Full access to comments
- Cannot manage permissions

### User
- Can view all todos
- Can create todos
- Can update own todos and todos where invited
- Can delete own completed todos
- Can view and create comments
- Can only update own comments

## Technical Stack

- React
- TypeScript
- Clerk Authentication
- Local Storage for data persistence
- Custom ABAC implementation

## Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
```

3. Set up Clerk Authentication:
   - Create a Clerk account
   - Add your Clerk credentials to `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
```

4. Start the development server:

```bash
npm run dev
```

## Test Accounts

| Email                   | Password  | Role     |
|-------------------------|-----------|----------|
| testuser1@gmail.com     | Admin@001 | User     |
| testuser2@gmail.com     | Admin@001 | User     |
| testuser3@gmail.com     | Admin@001 | Moderator |
| naman.01798@gmail.com   | Admin@001 | Admin    |

## Project Structure

```
src/
├── data/
│   ├── todos.ts       # Todo data management
│   └── comments.ts    # Comments data management
├── types/
│   └── types.ts       # TypeScript types and ABAC logic
└── App.tsx            # Main application component
```

## Key Components

- **ABAC Implementation**: Located in `types/types.ts`
- **Data Management**: Implemented in `data/` directory
- **UI Components**: Modular components in `App.tsx`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Made by [Naman](https://www.linkedin.com/in/naman-doshi-007/)

## Acknowledgments

- Built with React, TypeScript, and Clerk Authentication
- Inspired by real-world ABAC implementations
