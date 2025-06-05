# Kanban Task Manager

A modern task management application built with React, TypeScript, and Firebase.

## Features

- User authentication
- Board management
- Task management with drag-and-drop
- Subtasks
- File attachments
- AI-powered subtask suggestions
- Dashboard with statistics
- Export to CSV/PDF

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd kanban-task-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Get your Firebase configuration

4. Create a `.env` file in the root directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Set up Firebase Security Rules:

For Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boards/{boardId} {
      allow read: if request.auth != null && 
        (resource.data.members[request.auth.uid] != null || 
         resource.data.ownerId == request.auth.uid);
      allow write: if request.auth != null && 
        (resource.data.members[request.auth.uid] in ['owner', 'editor'] || 
         resource.data.ownerId == request.auth.uid);
    }
    match /boards/{boardId}/tasks/{taskId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/boards/$(boardId)) &&
        get(/databases/$(database)/documents/boards/$(boardId)).data.members[request.auth.uid] != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/boards/$(boardId)) &&
        get(/databases/$(database)/documents/boards/$(boardId)).data.members[request.auth.uid] in ['owner', 'editor'];
    }
  }
}
```

For Storage:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /boards/{boardId}/tasks/{taskId}/attachments/{fileName} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/boards/$(boardId)) &&
        get(/databases/$(database)/documents/boards/$(boardId)).data.members[request.auth.uid] != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/boards/$(boardId)) &&
        get(/databases/$(database)/documents/boards/$(boardId)).data.members[request.auth.uid] in ['owner', 'editor'];
    }
  }
}
```

6. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
  ├── components/     # React components
  ├── config/        # Configuration files
  ├── constants/     # Constants and enums
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  └── App.tsx        # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 