# AIT Website - Complete Project Analysis

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Folder Structure](#folder-structure)
4. [Architecture & Design Patterns](#architecture--design-patterns)
5. [Module Breakdown](#module-breakdown)
6. [Database Architecture](#database-architecture)
7. [Authentication & Authorization](#authentication--authorization)
8. [Key Features & Functionality](#key-features--functionality)
9. [Logic Flow](#logic-flow)
10. [File Responsibilities](#file-responsibilities)

---

## 🎯 Project Overview

**AIT Website** is a comprehensive **ASP.NET Web Forms** application designed for an educational/training center (AIT - Academy of Information Technology). The system manages student registration, course management, attendance tracking, fee collection, online examinations, and administrative operations.

### Core Purpose
- Student Management System
- Course & Enrollment Management
- Attendance Tracking
- Fee/Installment Management
- Online Examination System
- Certificate Management
- Leave Management
- Mock Interview Scheduling

---

## 🛠 Technology Stack

### Backend
- **Framework**: ASP.NET Web Forms (.NET Framework 4.0/4.5)
- **Language**: C#
- **Database**: Microsoft SQL Server
- **Database Access**: ADO.NET (SqlConnection, SqlCommand, SqlDataAdapter)
- **Session Management**: ASP.NET Session State
- **Authentication**: Session-based with Cookies

### Frontend
- **UI Framework**: Bootstrap 5.3.3
- **Icons**: Font Awesome 6.4.0/6.5.0
- **JavaScript**: Vanilla JavaScript
- **Charts**: System.Web.DataVisualization.Charting (for admin dashboards)
- **Styling**: Custom CSS with modern gradients and responsive design

### Libraries & Dependencies
- **Newtonsoft.Json.dll**: JSON serialization (in Bin folder)
- **System.Web.DataVisualization**: Chart controls for dashboards

### Database Servers
- **Primary DB**: `AITCenterDB` (Main application database)
- **Exam DB**: `AITrealDB` (Separate database for online exam system)
- **Server**: A2NWPLSK14SQL-v01.shr.prod.iad2.secureserver.net

---

## 📁 Folder Structure

```
Aitwebsite/
├── AdminPanel/              # Administrative interface
│   ├── *.aspx              # Web Forms pages
│   ├── *.aspx.cs           # Code-behind files
│   ├── css/                # Admin-specific styles
│   ├── Photo/              # Admin images/logos
│   └── Web.config          # Admin configuration
│
├── UserPanel/              # Student/User interface
│   ├── *.aspx              # User-facing pages
│   ├── *.aspx.cs           # Code-behind files
│   ├── images/             # User panel images
│   ├── User.master         # Master page for user panel
│   └── Web.config          # User panel configuration
│
├── OnlineExam/             # Online examination system
│   ├── *.aspx              # Exam-related pages
│   ├── *.aspx.cs           # Exam logic
│   ├── images/             # Exam system images
│   └── Web.config          # Exam system configuration
│
├── Photo/                  # Shared images/photos
├── Adhaar/                 # Aadhaar card documents
├── Bin/                    # Compiled DLLs
│   └── Newtonsoft.Json.dll
│
└── Web.config              # Root configuration
```

---

## 🏗 Architecture & Design Patterns

### Architecture Pattern
- **Model-View-Presenter (MVP)** - ASP.NET Web Forms pattern
- **Code-Behind Pattern**: Separation of UI (.aspx) and logic (.aspx.cs)
- **Master Pages**: Consistent layout across pages (Admin.master, User.master)

### Design Patterns Used
1. **Session State Pattern**: User authentication and data persistence
2. **Connection String Pattern**: Centralized in Web.config (though many hardcoded instances exist)
3. **Data Access Pattern**: Direct ADO.NET (no ORM like Entity Framework)
4. **Postback Pattern**: Standard Web Forms page lifecycle

### Key Architectural Decisions
- **Separate Databases**: Main app (`AITCenterDB`) and Exam system (`AITrealDB`)
- **Role-Based Access**: Admin vs Student roles with different interfaces
- **Session-Based Auth**: No token-based authentication
- **Direct SQL Queries**: No stored procedures or repository pattern

---

## 📦 Module Breakdown

### 1. **AdminPanel Module** (`/AdminPanel/`)

**Purpose**: Complete administrative control panel for managing the institution.

#### Key Files:

**Authentication & Access Control**
- `AdminLogin.aspx` / `AdminLogin.aspx.cs`
  - Admin authentication
  - Validates credentials against `register` table
  - Sets session variables: `Session["Admin"]`, `Session["UserID"]`, `Session["Username"]`
  - Logs login history with IP address and timestamp
  - Redirects to `AdminPanel.aspx` or `Default.aspx`

- `Admin.master` / `Admin.master.cs`
  - Master page providing consistent layout
  - Sidebar navigation with all admin features
  - Responsive design with mobile toggle
  - Displays admin name in navbar

**Dashboard & Analytics**
- `Default.aspx` / `Default.aspx.cs`
  - Main admin dashboard
  - Displays statistics: Total students, Present/Absent counts, Fees collected
  - Provides JSON endpoints for charts:
    - `/Default.aspx?type=attendance` - Monthly attendance data
    - `/Default.aspx?type=fees` - Fee collection data
    - `/Default.aspx?type=attendanceDays` - Daily attendance trends
    - `/Default.aspx?type=FetchScore` - Subject-wise exam scores
  - Session validation before access

**Student Management**
- `RegisteredStudent.aspx` / `RegisteredStudent.aspx.cs`
  - View all registered students in GridView
  - Filter by Status (Active/Inactive), Batch Time, or Name search
  - Inline editing: Update student details directly in grid
  - Delete functionality
  - Displays: StudentID, Name, Contact, Email, Course, Fees, Status, etc.

- `Students.aspx` / `Students.aspx.cs`
  - Alternative student listing/viewing page

- `AdminRegisterInsert.aspx` / `AdminRegisterInsert.aspx.cs`
  - New student registration form
  - Inserts into `Registration` table
  - Handles file uploads (photos, documents)

**Course Management**
- `CourseMaster.aspx` / `CourseMaster.aspx.cs`
  - Manage course catalog
  - Add/Edit/Delete courses
  - Stores: CourseID, CourseName, Duration, Fees, etc.

- `CourseMasterInsert.aspx` / `CourseMasterInsert.aspx.cs`
  - Insert new courses into `CourseMaster` table

- `CourseUpgrade.aspx` / `CourseUpgrade.aspx.cs`
  - Upgrade students to higher-level courses
  - Track course progression

- `ShowUpgradedCourse.aspx` / `ShowUpgradedCourse.aspx.cs`
  - View all course upgrades
  - Track student course history

- `StudentCourseDetails.aspx` / `StudentCourseDetails.aspx.cs`
  - View detailed course and subject information for students

**Attendance Management**
- `Attendancepage.aspx` / `Attendancepage.aspx.cs`
  - Mark daily attendance
  - Filter students by Batch Time and Teacher
  - Checkbox selection for multiple students
  - Dropdown for Present/Absent status
  - Prevents duplicate attendance for same date
  - Inserts into `Attendance` table with: StudentID, Date, Status, Teacher, Batch, Remarks

- `Attendanceview.aspx` / `Attendanceview.aspx.cs`
  - View attendance records
  - Filter by date range, student, batch
  - Generate attendance reports

**Fee Management**
- `Installment.aspx` / `Installment.aspx.cs`
  - Record fee payments/installments
  - Auto-generates receipt numbers
  - Calculates balance fees
  - Updates `Registration.FeesPaidAmount`
  - Inserts into `Installment` table

- `Installmentview.aspx` / `Installmentview.aspx.cs`
  - View all installment records
  - Filter by student, date range
  - Payment history tracking

- `StudentFees2.aspx` / `StudentFees2.aspx.cs`
  - Detailed fee management per student

**Examination Management**
- `CreateQuestion.aspx` / `CreateQuestion.aspx.cs`
  - Create exam questions
  - Multiple choice questions (A, B, C, D options)
  - Stores in exam database

- `ExamRegistrationview.aspx` / `ExamRegistrationview.aspx.cs`
  - View exam registrations
  - Approve/reject exam requests

- `ExamResultsview.aspx` / `ExamResultsview.aspx.cs`
  - View and manage exam results
  - Calculate pass/fail status

**Certification & Progress**
- `Certificationview.aspx` / `Certificationview.aspx.cs`
  - View certificate requests
  - Approve certificate issuance

- `UpdateProgressCode.aspx` / `UpdateProgressCode.aspx.cs`
  - Update student progress codes
  - Track course completion status

- `ProgressCodeGenerator.html`
  - Utility tool for generating progress codes

**Leave Management**
- `ManageLeaves.aspx` / `ManageLeaves.aspx.cs`
  - Approve/reject student leave applications
  - View leave history

**User Management**
- `Users.aspx` / `Users.aspx.cs`
  - Manage system users
  - CRUD operations on `Users` table
  - Set user types and status

**Other Features**
- `Feedback.aspx` / `Feedback.aspx.cs` - View student feedback
- `MockInterview.aspx` / `MockInterview.aspx.cs` - Schedule mock interviews
- `LoginHistory.aspx` / `LoginHistory.aspx.cs` - View login audit logs
- `Search1.aspx`, `Search2.aspx`, `Search3.aspx` - Various search functionalities
- `Activate.aspx` / `Activate.aspx.cs` - Activate student accounts

---

### 2. **UserPanel Module** (`/UserPanel/`)

**Purpose**: Student-facing interface for accessing personal information and services.

#### Key Files:

**Authentication**
- `Login.aspx` / `Login.aspx.cs`
  - Student login authentication
  - Validates against `Registration` table
  - Checks: EmailID, Password, Status='Active', IsDeleted='No'
  - Sets extensive session variables:
    - `Session["StudentID"]`, `Session["RollNo"]`, `Session["FirstName"]`, `Session["LastName"]`
    - `Session["StudentName"]`, `Session["CourseName"]`, `Session["PhotoFileName"]`
    - `Session["User"]`, `Session["Role"]`, `Session["Login"]`
  - Logs login history with IP detection
  - Session timeout: 90 minutes
  - Redirects to `Default1.aspx` on success

**Master Page**
- `User.master` / `User.master.cs`
  - Consistent user interface layout
  - Dark theme with gradient backgrounds
  - Responsive sidebar navigation
  - Displays: Welcome name, Current Course, Progress Code, Course End Date, Days Left
  - Profile dropdown with photo
  - Mobile-responsive with toggle sidebar

**Dashboard**
- `UserPanel.aspx` / `UserPanel.aspx.cs`
  - Student dashboard
  - Displays: Exam count, Monthly attendance summary
  - JSON endpoints for charts:
    - `?type=examScores` - Exam performance data
    - `?type=attendance` - Monthly attendance
    - `?type=fees` - Fee payment status
    - `?type=attendanceDays` - Daily attendance
  - Calculates working days (excluding Sundays)
  - Shows present/absent counts for current month

- `Default1.aspx` / `Default1.aspx.cs`
  - Alternative dashboard/home page

**Profile Management**
- `MyProfile.aspx` / `MyProfile.aspx.cs`
  - View and edit personal profile
  - Displays: Name, Contact, Email, Course, Fees, Status, Progress Code, Batch Time
  - Joins with `CourseMaster` for course duration
  - Shows registration date and course end date
  - Displays profile photo

**Course Management**
- `ShowCourses.aspx` / `ShowCourses.aspx.cs`
  - Browse available courses
  - View course details, fees, duration

- `CourseUpgrade.aspx` / `CourseUpgrade.aspx.cs`
  - Request course upgrade
  - Submit upgrade application

**Attendance**
- `AttendanceView.aspx` / `AttendanceView.aspx.cs`
  - View personal attendance records
  - Filter by date range
  - See present/absent history

**Fees & Installments**
- `InstallmentView.aspx` / `InstallmentView.aspx.cs`
  - View personal fee payment history
  - See all installments paid
  - Check receipt numbers and payment dates

**Examinations**
- `ExamRegistration.aspx` / `ExamRegistration.aspx.cs`
  - Register for exams
  - Submit exam registration requests

- `ResultView.aspx` / `ResultView.aspx.cs`
  - View exam results
  - See scores and pass/fail status

- `ShowExams.aspx` / `ShowExams.aspx.cs`
  - Browse available exams
  - View exam schedules

- `StartExam.aspx` / `StartExam.aspx.cs`
  - Start taking an exam
  - Initialize exam session

**Certificates**
- `CerteficateRequest.aspx` / `CerteficateRequest.aspx.cs`
  - Request course completion certificate
  - Submit certificate application

**Leave Management**
- `LeaveApplication.aspx` / `LeaveApplication.aspx.cs`
  - Apply for leave
  - Submit leave requests with dates and reason

- `LeaveStatus.aspx` / `LeaveStatus.aspx.cs`
  - Check leave application status
  - View approved/rejected/pending leaves

**Other Features**
- `Feedback.aspx` / `Feedback.aspx.cs` - Submit feedback
- `MockInterview.aspx` / `MockInterview.aspx.cs` - Request mock interview
- `sessionCheck.aspx` / `sessionCheck.aspx.cs` - Session validation utility

---

### 3. **OnlineExam Module** (`/OnlineExam/`)

**Purpose**: Separate online examination system with its own database and authentication.

#### Key Files:

**Authentication**
- `Login.aspx` / `Login.aspx.cs`
  - Separate login for exam system
  - Uses `AITrealDB` database
  - Supports both Student and Admin roles
  - Validates against `Users` table
  - Checks account approval status
  - Redirects: Students → `StudentDashboard.aspx`, Admins → `AdminDashboard.aspx`

**Student Interface**
- `StudentDashboard.aspx` / `StudentDashboard.aspx.cs`
  - Student exam dashboard
  - View available exams
  - Check exam status
  - View results

- `ExamRequests.aspx` / `ExamRequests.aspx.cs`
  - Submit exam requests
  - View request status

- `StudentExamRequests.aspx` / `StudentExamRequests.aspx.cs`
  - Manage personal exam requests

- `StudentExamStatus.aspx` / `StudentExamStatus.aspx.cs`
  - Check exam approval status

- `StartExam.aspx` / `StartExam.aspx.cs`
  - Initialize exam session
  - Clear previous exam data
  - Redirect to `Exam.aspx`

- `Exam.aspx` / `Exam.aspx.cs`
  - **Core exam interface**
  - Timer-based exam (30 minutes default)
  - Question navigation (Previous/Next)
  - Mark questions for review
  - Save answers in session
  - Auto-submit on time expiry
  - WebMethod: `GetRemainingTime()` for AJAX timer updates
  - Loads questions from `Questions` table
  - Stores answers in session arrays

- `Result.aspx` / `Result.aspx.cs`
  - Display exam results immediately after completion
  - Show score, total marks, percentage
  - Pass/Fail determination

- `StudentViewResults.aspx` / `StudentViewResults.aspx.cs`
  - View all past exam results
  - Historical performance tracking

**Admin Interface**
- `AdminDashboard.aspx` / `AdminDashboard.aspx.cs`
  - Exam admin dashboard
  - Statistics: Total students, Exams, Pending requests
  - Quick access to exam management

- `CreateAssignExams.aspx` / `CreateAssignExams.aspx.cs`
  - Create new exams
  - Assign exams to students
  - Set exam parameters (duration, total marks)

- `AddEditQuestions.aspx` / `AddEditQuestions.aspx.cs`
  - Add/edit exam questions
  - Multiple choice questions with 4 options
  - Set correct answer
  - Assign to specific exams

- `EditQuestions.aspx` / `EditQuestions.aspx.cs`
  - Edit existing questions

- `ApproveExamRequests.aspx` / `ApproveExamRequests.aspx.cs`
  - Approve/reject student exam requests
  - Manage exam registrations

- `ApproveResultRelease.aspx` / `ApproveResultRelease.aspx.cs`
  - Control result visibility
  - Approve result release to students

- `ViewAllResults.aspx` / `ViewAllResults.aspx.cs`
  - View all exam results
  - Filter by exam
  - Export capabilities

- `ViewResults.aspx` / `ViewResults.aspx.cs`
  - Detailed result viewing

- `ProctoringViolations.aspx` / `ProctoringViolations.aspx.cs`
  - Track proctoring violations
  - Monitor exam integrity

**Registration & Management**
- `NewStudentReg.aspx` / `NewStudentReg.aspx.cs`
  - New student registration for exam system
  - Creates account in `Users` table

- `PendingRegistrations.aspx` / `PendingRegistrations.aspx.cs`
  - Approve pending student registrations
  - Activate student accounts

- `LoginHistory.aspx` / `LoginHistory.aspx.cs`
  - View login audit logs for exam system

**Public Pages**
- `Home.aspx` / `Home.aspx.cs` - Landing page
- `AboutUs.aspx` / `AboutUs.aspx.cs` - About page

---

## 🗄 Database Architecture

### Primary Database: `AITCenterDB`

#### Core Tables:

**1. Registration**
- **Purpose**: Main student registration table
- **Key Columns**:
  - `StudentID` (PK, Identity)
  - `FirstName`, `LastName`
  - `EmailID`, `Password`
  - `ContactNumber`, `WhatsAppNumber`, `ParentsContactNumber`
  - `Gender`, `DateofBirth`, `Qualification`
  - `CourseID`, `CourseName`
  - `FullCourseFees`, `FeesPaidAmount`
  - `RecipateNumber`, `FeesPaidMode`
  - `Address`, `City`, `Country`
  - `AdharCard`, `Passportsizephoto`
  - `Status` (Active/Inactive)
  - `IsDeleted` (Yes/No)
  - `ProgressCode`, `CurrentCourse`
  - `BatchTime`, `TeacherName`
  - `RollNo`
  - `RegistrationDate`, `CourseEndDate`

**2. Attendance**
- **Purpose**: Daily attendance records
- **Key Columns**:
  - `StudentID` (FK)
  - `Name`
  - `AttendanceMonth` (e.g., "Jan 2024")
  - `AttendanceDate`
  - `MobileNo`
  - `Course`, `TeacherName`, `BatchTime`
  - `Attendence` (Present/Absent)
  - `TotalPresent`, `TotalAbsent`
  - `Remark`
  - `FeesDate`

**3. Installment**
- **Purpose**: Fee payment records
- **Key Columns**:
  - `StudentID` (FK)
  - `ReceiptNo`
  - `Name`, `MobileNo`
  - `PaidAmount`, `PaidDate`
  - `AmountInWords`
  - `Address`, `Course`
  - `BalanceFees`, `TotalFees`
  - `PaymentMode`

**4. CourseMaster**
- **Purpose**: Course catalog
- **Key Columns**:
  - `CourseID` (PK)
  - `CourseName`
  - `Duration`
  - `Fees`
  - Other course details

**5. register**
- **Purpose**: Admin user accounts
- **Key Columns**:
  - `UserID`
  - `EmailID`, `Password`
  - `Username`
  - Other admin details

**6. Users**
- **Purpose**: System users (different from register)
- **Key Columns**:
  - `UserID` (PK)
  - `UserName`, `UserType`
  - `Status`, `Password`

**7. LoginHistory**
- **Purpose**: Audit trail for logins
- **Key Columns**:
  - `UserID`
  - `UserType` (Admin/Student)
  - `LoginTime`
  - `IPAddress`
  - `CurrentLocation` (URL)

**8. ExamResults**
- **Purpose**: Exam results (legacy, may be in main DB)
- **Key Columns**:
  - `ExamName`
  - `ObtainMarks`
  - Student information

**Other Tables** (referenced in code):
- `StudentExams3` - Student exam records
- Certificate-related tables
- Leave application tables
- Mock interview tables
- Feedback tables

---

### Exam Database: `AITrealDB`

#### Core Tables:

**1. Users**
- **Purpose**: Exam system users
- **Key Columns**:
  - `UserID` (PK)
  - `Username`, `Password`
  - `FullName`
  - `Role` (Student/Admin)
  - `Status` (Approved/Pending/Rejected)

**2. Exams**
- **Purpose**: Exam definitions
- **Key Columns**:
  - `ExamID` (PK)
  - `ExamTitle`
  - `Duration`
  - `TotalMarks`
  - `Description`
  - Other exam parameters

**3. Questions**
- **Purpose**: Exam questions
- **Key Columns**:
  - `QuestionID` (PK)
  - `ExamID` (FK)
  - `QuestionText`
  - `OptionA`, `OptionB`, `OptionC`, `OptionD`
  - `CorrectAnswer` (A/B/C/D)
  - `Marks`

**4. Results**
- **Purpose**: Exam results
- **Key Columns**:
  - `ResultID` (PK)
  - `UserID` (FK)
  - `ExamID` (FK)
  - `StudentName`
  - `Score`
  - `TotalMarks`
  - `ExamDate`
  - `Status` (Passed/Failed)

**5. ExamRequests**
- **Purpose**: Student exam registration requests
- **Key Columns**:
  - `RequestID` (PK)
  - `UserID` (FK)
  - `ExamID` (FK)
  - `RequestDate`
  - `Status` (Pending/Approved/Rejected)

**Other Tables**:
- Proctoring violations table
- Login history for exam system

---

## 🔐 Authentication & Authorization

### Authentication Flow

#### Admin Authentication:
1. User submits credentials on `AdminLogin.aspx`
2. Query: `SELECT * FROM register WHERE EmailID = @EmailID AND Password = @Password`
3. On success:
   - Set `Session["Admin"] = "Head"`
   - Set `Session["UserID"]`, `Session["Username"]`
   - Set `Session["Role"] = "Admin"`
   - Create cookie: `Response.Cookies["name"]` (30 min expiry)
   - Log to `LoginHistory` table
   - Redirect to `Default.aspx` (dashboard)

#### Student Authentication:
1. User submits credentials on `UserPanel/Login.aspx`
2. Query: `SELECT * FROM Registration WHERE EmailID = @EmailID AND Password = @Password AND Status = 'Active' AND IsDeleted = 'No'`
3. On success:
   - Set multiple session variables (StudentID, Name, Course, etc.)
   - Set `Session["User"] = "admin"` (naming inconsistency)
   - Set `Session["Role"] = "Student"`
   - Create cookie (60 min expiry)
   - Log to `LoginHistory` table
   - Redirect to `Default1.aspx`

#### Exam System Authentication:
1. User submits credentials on `OnlineExam/Login.aspx`
2. Query: `SELECT * FROM Users WHERE Username = @u AND Password = @p AND Role = @Role`
3. Check `Status = 'Approved'`
4. Set session: `Session["UserID"]`, `Session["Username"]`, `Session["Role"]`
5. Redirect based on role

### Authorization Checks

**Pattern Used**: Session validation in `Page_Load`:
```csharp
if (Session["Admin"] != "Head")
    Response.Redirect("~/Default.aspx");

if (Request.Cookies["name"] == null)
    Response.Redirect("~/Default.aspx");
```

**Issues**:
- Inconsistent session variable names
- Some pages lack proper authorization checks
- Hardcoded connection strings (security risk)
- Passwords stored in plain text (major security issue)

---

## ⚙️ Key Features & Functionality

### 1. Student Registration
- **Flow**: Admin registers new students via `AdminRegisterInsert.aspx`
- **Data Captured**: Personal info, course selection, fees, documents (Aadhaar, photo)
- **Storage**: `Registration` table
- **Status Management**: Active/Inactive, Soft delete (IsDeleted flag)

### 2. Course Management
- **Course Catalog**: `CourseMaster` table
- **Course Assignment**: Linked to students via `Registration.CourseID`
- **Course Upgrade**: Track student progression to higher courses
- **Progress Tracking**: `ProgressCode` field tracks course completion

### 3. Attendance System
- **Marking**: Admin selects batch → students load → mark Present/Absent
- **Duplicate Prevention**: Checks existing attendance for same date
- **Reporting**: Monthly/daily attendance charts
- **Student View**: Students can view their own attendance history

### 4. Fee Management
- **Installment Tracking**: Record each payment
- **Receipt Generation**: Auto-increment receipt numbers
- **Balance Calculation**: `BalanceFees = TotalFees - PaidAmount`
- **Payment Modes**: Cash, Online, Cheque, etc.
- **History**: View all installments per student

### 5. Online Examination
- **Exam Creation**: Admin creates exams with questions
- **Question Bank**: Multiple choice questions (4 options)
- **Exam Taking**:
  - Timer-based (30 minutes default)
  - Question navigation
  - Mark for review
  - Auto-submit on expiry
- **Result Calculation**: Immediate scoring
- **Result Approval**: Admin controls result release

### 6. Certificate Management
- **Request Flow**: Student requests → Admin approves → Certificate issued
- **Tracking**: View certificate requests and status

### 7. Leave Management
- **Application**: Students submit leave requests
- **Approval**: Admin approves/rejects
- **Status Tracking**: Pending/Approved/Rejected

### 8. Mock Interview
- **Scheduling**: Students request mock interviews
- **Admin Management**: Schedule and manage interviews

### 9. Dashboard Analytics
- **Admin Dashboard**:
  - Total students count
  - Today's present/absent
  - Fees collected today
  - Attendance charts (monthly/daily)
  - Subject-wise score analysis
- **Student Dashboard**:
  - Personal attendance summary
  - Exam count
  - Fee payment status
  - Course progress

### 10. Login History
- **Tracking**: All logins logged with:
  - UserID, UserType
  - LoginTime (with timezone conversion to IST)
  - IPAddress
  - CurrentLocation (URL)

---

## 🔄 Logic Flow

### Student Registration Flow
```
AdminPanel/AdminRegisterInsert.aspx
    ↓
Validate Input
    ↓
Upload Files (Photo, Aadhaar)
    ↓
Insert into Registration table
    ↓
Set Status = 'Pending' or 'Active'
    ↓
Redirect to RegisteredStudent.aspx
```

### Attendance Marking Flow
```
AdminPanel/Attendancepage.aspx
    ↓
Select Batch Time & Teacher
    ↓
Load Students for that Batch
    ↓
Admin marks Present/Absent for each student
    ↓
Check for duplicate (same date)
    ↓
Insert into Attendance table
    ↓
Update counts (TotalPresent, TotalAbsent)
    ↓
Show success message
```

### Fee Payment Flow
```
AdminPanel/Installment.aspx
    ↓
Select Student
    ↓
Auto-load: Course Paid Fees, Generate Receipt No
    ↓
Enter Payment Details (Amount, Date, Mode)
    ↓
Calculate Balance Fees
    ↓
Insert into Installment table
    ↓
Update Registration.FeesPaidAmount
    ↓
Show receipt
```

### Exam Taking Flow
```
OnlineExam/StartExam.aspx
    ↓
Click "Start Exam"
    ↓
Clear previous session data
    ↓
Redirect to Exam.aspx
    ↓
Load Questions from Questions table
    ↓
Store in Session["AllQuestions"]
    ↓
Initialize Session["StartTime"]
    ↓
Display Question 1
    ↓
[User navigates, answers, marks for review]
    ↓
Timer counts down (30 min)
    ↓
On Submit or Time Expiry:
    ↓
Calculate Score
    ↓
Insert into Results table
    ↓
Redirect to Result.aspx
    ↓
Display Score, Pass/Fail
```

### Login Flow
```
Login Page (Admin/Student/Exam)
    ↓
Validate Credentials
    ↓
Check Account Status
    ↓
Set Session Variables
    ↓
Create Cookie
    ↓
Log to LoginHistory
    ↓
Redirect to Dashboard
```

---

## 📄 File Responsibilities

### AdminPanel Files

| File | Responsibility |
|------|----------------|
| `AdminLogin.aspx.cs` | Admin authentication, session setup, login logging |
| `Default.aspx.cs` | Dashboard statistics, JSON endpoints for charts |
| `RegisteredStudent.aspx.cs` | Student listing, filtering, inline editing, deletion |
| `AdminRegisterInsert.aspx.cs` | New student registration, file uploads |
| `Attendancepage.aspx.cs` | Mark attendance, batch filtering, duplicate prevention |
| `Attendanceview.aspx.cs` | View attendance records, generate reports |
| `Installment.aspx.cs` | Record fee payments, receipt generation, balance calculation |
| `Installmentview.aspx.cs` | View payment history, filter by student/date |
| `CourseMaster.aspx.cs` | Manage course catalog (CRUD) |
| `CourseUpgrade.aspx.cs` | Handle course upgrades |
| `CreateQuestion.aspx.cs` | Create exam questions |
| `Certificationview.aspx.cs` | View and manage certificate requests |
| `ManageLeaves.aspx.cs` | Approve/reject leave applications |
| `Users.aspx.cs` | Manage system users |
| `LoginHistory.aspx.cs` | View login audit logs |
| `MockInterview.aspx.cs` | Schedule mock interviews |
| `UpdateProgressCode.aspx.cs` | Update student progress codes |

### UserPanel Files

| File | Responsibility |
|------|----------------|
| `Login.aspx.cs` | Student authentication, IP detection, session setup |
| `UserPanel.aspx.cs` | Student dashboard, JSON endpoints, attendance calculation |
| `MyProfile.aspx.cs` | Display and edit student profile |
| `ShowCourses.aspx.cs` | Browse available courses |
| `AttendanceView.aspx.cs` | View personal attendance records |
| `InstallmentView.aspx.cs` | View fee payment history |
| `ExamRegistration.aspx.cs` | Register for exams |
| `ResultView.aspx.cs` | View exam results |
| `CerteficateRequest.aspx.cs` | Request certificates |
| `LeaveApplication.aspx.cs` | Submit leave requests |
| `LeaveStatus.aspx.cs` | Check leave status |
| `Feedback.aspx.cs` | Submit feedback |
| `MockInterview.aspx.cs` | Request mock interviews |

### OnlineExam Files

| File | Responsibility |
|------|----------------|
| `Login.aspx.cs` | Exam system authentication (separate from main app) |
| `StudentDashboard.aspx.cs` | Student exam dashboard |
| `AdminDashboard.aspx.cs` | Exam admin dashboard, statistics |
| `StartExam.aspx.cs` | Initialize exam session |
| `Exam.aspx.cs` | **Core exam interface**: Question display, navigation, timer, answer saving |
| `Result.aspx.cs` | Display immediate exam results |
| `CreateAssignExams.aspx.cs` | Create and assign exams |
| `AddEditQuestions.aspx.cs` | Manage question bank |
| `ApproveExamRequests.aspx.cs` | Approve exam registrations |
| `ViewAllResults.aspx.cs` | View all exam results (admin) |
| `StudentViewResults.aspx.cs` | View personal results (student) |
| `NewStudentReg.aspx.cs` | Register new students for exam system |
| `PendingRegistrations.aspx.cs` | Approve pending registrations |

---

## 🔍 Key Observations & Issues

### Strengths
1. **Comprehensive Feature Set**: Covers all aspects of educational institution management
2. **Separate Exam System**: Isolated exam functionality with own database
3. **Responsive Design**: Modern UI with Bootstrap and custom styling
4. **Dashboard Analytics**: Visual charts and statistics
5. **Audit Trail**: Login history tracking

### Issues & Concerns

#### Security Issues
1. **Hardcoded Connection Strings**: Database credentials visible in code
2. **Plain Text Passwords**: No password hashing/encryption
3. **SQL Injection Risk**: Some queries may be vulnerable (though parameters are used in most places)
4. **Session Security**: No HTTPS enforcement mentioned
5. **Cookie Security**: No HttpOnly/Secure flags

#### Code Quality Issues
1. **Code Duplication**: Connection strings repeated everywhere
2. **Inconsistent Naming**: Session variables have inconsistent names
3. **No Error Handling**: Many try-catch blocks are empty or redirect without logging
4. **Mixed Concerns**: Business logic mixed with UI code
5. **No Data Access Layer**: Direct SQL in code-behind files

#### Architecture Issues
1. **No ORM**: Direct ADO.NET everywhere (could use Entity Framework)
2. **No Repository Pattern**: Direct database access
3. **Tight Coupling**: UI tightly coupled to database
4. **No Unit Tests**: No test files found
5. **Configuration Management**: Connection strings should be in config only

#### Database Issues
1. **Multiple Connection Strings**: 25+ connection strings in Web.config (should use one)
2. **No Stored Procedures**: All queries inline
3. **No Transactions**: Some operations should be transactional
4. **Separate Databases**: Main app and exam system use different DBs (may cause sync issues)

---

## 🚀 Recommendations

### Immediate Improvements
1. **Move all connection strings to Web.config** (remove hardcoded ones)
2. **Implement password hashing** (bcrypt/Argon2)
3. **Add proper error logging** (log4net or similar)
4. **Consolidate connection strings** (use single connection string name)
5. **Add input validation** on all forms

### Long-term Improvements
1. **Migrate to ASP.NET Core** (modern framework)
2. **Implement Entity Framework** (ORM)
3. **Add Repository Pattern** (separation of concerns)
4. **Implement JWT Authentication** (replace session-based)
5. **Add Unit Tests** (xUnit/NUnit)
6. **Implement API Layer** (separate frontend/backend)
7. **Add Caching** (Redis for session/data caching)
8. **Database Optimization** (indexes, stored procedures)

---

## 📊 Summary

This is a **feature-rich educational management system** built with **ASP.NET Web Forms**. It successfully manages:
- ✅ Student lifecycle (registration to certification)
- ✅ Course and enrollment management
- ✅ Attendance tracking
- ✅ Fee collection and tracking
- ✅ Online examinations
- ✅ Administrative operations

However, it requires **significant refactoring** for:
- 🔴 Security hardening
- 🔴 Code organization
- 🔴 Modern architecture patterns
- 🔴 Performance optimization

The system is **functional and production-ready** but would benefit from modernization and security improvements.

---

**Analysis Date**: 2025
**Framework**: ASP.NET Web Forms (.NET Framework 4.0/4.5)
**Database**: SQL Server (AITCenterDB, AITrealDB)
**Total Files Analyzed**: 100+ .aspx and .aspx.cs files

