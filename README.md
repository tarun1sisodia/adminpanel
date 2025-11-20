# 🎓 SmartCampus Admin Panel
=========================

## 📋 Overview
----------
This repository contains the admin panel for SmartCampus, a comprehensive educational management system designed to streamline campus operations. The admin panel provides a powerful interface for managing users, courses, classes, students, attendance, schedules, and academic records with role-based access control.

## 🌟 Features
----------
- **User Management**: Manage teachers and admin accounts with role-based access
- **Subject Management**: Create and organize academic subjects with codes
- **Course Management**: Define and manage course offerings
- **Class Management**: Organize classes with teacher assignments and schedules
- **Student Management**: Complete student profile management with enrollment tracking
- **Attendance System**: Track and manage student attendance sessions
- **Schedule Management**: Create and manage class timetables
- **Marks & Grades**: Record and manage student marks and academic performance
- **Dashboard Analytics**: Real-time insights and statistics
- **Profile Management**: Update admin/teacher profiles with image upload
- **Secure Authentication**: Role-based access control using Supabase Auth
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## 🛠️ Technology Stack
-----------------
- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **UI Styling**: Tailwind CSS v4.1.4
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Build Tools**: PostCSS, Autoprefixer
- **Icons**: Font Awesome 6.4.0
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure
------------------
```
adminpanel/
├── index.html                    # Main admin dashboard
├── login.html                    # Login page
├── register.html                 # Registration page
├── app.js                        # Main application logic
├── login.js                      # Login functionality
├── register.js                   # Registration functionality
├── supabase.js                   # Supabase client and services
├── styles.css                    # Custom styles
├── complete_setup_database.sql   # Database schema and setup
├── package.json                  # Dependencies
└── .gitignore                    # Git ignore rules
```

## 🎯 Modules
----------

### 📊 Dashboard
- Real-time statistics overview
- Quick access to all modules
- System health monitoring

### 👥 Users Management
- Teacher and admin account management
- Profile information with images
- Role assignment and permissions
- Contact details tracking

### 📚 Academic Management
- **Subjects**: Subject creation with codes
- **Courses**: Course definitions and management
- **Classes**: Class organization with teacher assignment
- **Students**: Student enrollment and profile management

### 📅 Attendance System
- Attendance session creation
- Student attendance tracking
- Attendance reports and analytics
- Session management by class and date

### ⏰ Schedule Management
- Timetable creation and management
- Class scheduling with time slots
- Teacher assignment to schedules
- Day-wise schedule organization

### 📝 Marks & Grades
- Student marks entry
- Academic performance tracking
- Grade management
- Performance analytics

## ⚙️ Getting Started
----------------

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Supabase account and project
- Node.js (v14 or higher) - for development tools
- npm or yarn package manager

### 🚀 Installation

1. **Clone the repository**:
```bash
git clone https://github.com/tarun1sisodia/adminpanel
cd adminpanel
```

2. **Install dependencies** (for Tailwind CSS):
```bash
npm install
```

3. **Configure Supabase**:
   - Create a Supabase project at https://supabase.com
   - Run the `complete_setup_database.sql` script in your Supabase SQL editor
   - Update the Supabase credentials in `supabase.js`:
     ```javascript
     const SUPABASE_URL = 'your-supabase-url';
     const SUPABASE_SERVICE_ROLE_KEY = 'your-supabase-service-role-key';
     ```

4. **Start the application**:
   - Open `login.html` in your browser, or
   - Use a local server:
     ```bash
     npx http-server -p 8080
     ```
   - Navigate to `http://localhost:8080/login.html`

### 🔐 Default Access
After running the database setup script, you can create an admin account through the registration page. Make sure to set the role as 'admin' in the database.

## 🗄️ Database Schema
----------------
The application uses PostgreSQL via Supabase with the following main tables:

- **users**: Admin and teacher accounts with authentication
- **subjects**: Academic subjects with codes
- **courses**: Course definitions
- **classes**: Class organization with teacher assignments
- **students**: Student profiles and enrollment data
- **attendance_sessions**: Attendance tracking sessions
- **attendance_records**: Individual student attendance records
- **schedules**: Class timetables and schedules
- **marks**: Student academic performance records

Refer to `complete_setup_database.sql` for complete schema and relationships.

## 🎨 UI Components
--------------
- **Sidebar Navigation**: Quick access to all modules
- **Data Tables**: Sortable and paginated data displays
- **Modal Forms**: Add and edit records with validation
- **Search & Filter**: Find records quickly
- **Pagination**: Navigate through large datasets
- **Responsive Cards**: Mobile-friendly data presentation
- **Toast Notifications**: User feedback for actions

## 🔒 Security Features
-------------------
- Supabase Row Level Security (RLS) policies
- Role-based access control (RBAC)
- Secure authentication with JWT tokens
- Protected API endpoints
- Session management
- Input validation and sanitization

## 📱 Responsive Design
------------------
The admin panel is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Deployment
-----------
The application can be deployed to:
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Traditional Hosting**: Any web server with static file serving
- **Cloud Platforms**: AWS S3, Google Cloud Storage, Azure Static Web Apps

### Deployment Steps:
1. Update Supabase credentials for production
2. Build/optimize assets if needed
3. Upload files to your hosting platform
4. Configure custom domain (optional)

## 🔧 Configuration
--------------
Key configuration files:
- `supabase.js`: Supabase connection settings
- `app.js`: Application constants and table configurations
- `styles.css`: Custom styling overrides

## 📊 Features in Detail

### Dashboard
- Total users count
- Active classes overview
- Recent attendance records
- Student enrollment statistics

### Data Management
- **CRUD Operations**: Create, Read, Update, Delete for all entities
- **Bulk Actions**: Perform operations on multiple records
- **Export Data**: Download records in various formats
- **Import Data**: Bulk upload functionality

### Attendance Tracking
- Mark attendance for entire classes
- Individual student attendance records
- Attendance reports by date range
- Absence notifications

## 🤝 Contributing
-------------
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License
---------
This project is part of the SmartCampus system. All rights reserved.

## 👨‍💻 Support
-----------
For issues, questions, or contributions, please:
- Open an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History
----------------
- **v1.0.0**: Initial release with core admin panel features
  - User management
  - Academic management (subjects, courses, classes)
  - Student management
  - Attendance tracking
  - Schedule management
  - Marks and grades system

## 🎯 Future Enhancements
--------------------
- [ ] Advanced reporting and analytics
- [ ] Email notifications for attendance
- [ ] Bulk import/export functionality
- [ ] Mobile application
- [ ] Parent portal integration
- [ ] Fee management module
- [ ] Library management
- [ ] Event calendar

---

**Made with ❤️ for SmartCampus**
