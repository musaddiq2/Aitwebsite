# AIT Website - Architecture Summary

## 🏛 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AIT Website System                        │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
        │  AdminPanel  │ │UserPanel│ │OnlineExam │
        │   (Admin)    │ │(Student)│ │  (Exam)   │
        └──────┬───────┘ └───┬────┘ └─────┬──────┘
               │             │             │
               └─────────────┼─────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌─────▼─────┐      ┌──────▼──────┐
   │AITCenter│         │AITrealDB  │      │  Session    │
   │   DB    │         │  (Exam)   │      │  Storage    │
   └─────────┘         └───────────┘      └─────────────┘
```

## 🔄 Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Validate Creds  │
└──────┬──────────┘
       │
   ┌───┴───┐
   │ Valid │ Invalid
   │       │
   ▼       ▼
┌──────┐ ┌──────────┐
│ Set  │ │ Show    │
│Session│ │ Error   │
└──┬───┘ └──────────┘
   │
   ▼
┌─────────────┐
│ Log History │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard   │
└─────────────┘
```

## 📊 Data Flow - Student Registration

```
Admin → AdminRegisterInsert.aspx
         │
         ├─→ Validate Input
         ├─→ Upload Files (Photo, Aadhaar)
         ├─→ Insert into Registration Table
         ├─→ Set Status = 'Active'
         └─→ Redirect to RegisteredStudent.aspx
```

## 📊 Data Flow - Attendance Marking

```
Admin → Attendancepage.aspx
         │
         ├─→ Select Batch Time & Teacher
         ├─→ Load Students (GridView)
         ├─→ Mark Present/Absent
         ├─→ Check Duplicate (same date)
         ├─→ Insert into Attendance Table
         └─→ Update Counts
```

## 📊 Data Flow - Fee Payment

```
Admin → Installment.aspx
         │
         ├─→ Select Student
         ├─→ Auto-load: Paid Fees, Receipt No
         ├─→ Enter Payment Details
         ├─→ Calculate Balance
         ├─→ Insert into Installment Table
         └─→ Update Registration.FeesPaidAmount
```

## 📊 Data Flow - Online Exam

```
Student → StartExam.aspx
           │
           ├─→ Clear Session
           └─→ Redirect to Exam.aspx
                │
                ├─→ Load Questions (Session)
                ├─→ Start Timer (30 min)
                ├─→ Display Questions
                ├─→ Save Answers (Session)
                │
                └─→ Submit/Time Expiry
                     │
                     ├─→ Calculate Score
                     ├─→ Insert into Results
                     └─→ Show Result.aspx
```

## 🗂 Module Structure

### AdminPanel Module
```
AdminPanel/
├── Authentication
│   ├── AdminLogin.aspx
│   └── Admin.master
│
├── Dashboard
│   └── Default.aspx (Stats + Charts)
│
├── Student Management
│   ├── RegisteredStudent.aspx (CRUD)
│   ├── AdminRegisterInsert.aspx
│   └── Students.aspx
│
├── Course Management
│   ├── CourseMaster.aspx
│   ├── CourseUpgrade.aspx
│   └── StudentCourseDetails.aspx
│
├── Attendance
│   ├── Attendancepage.aspx (Mark)
│   └── Attendanceview.aspx (View)
│
├── Fees
│   ├── Installment.aspx (Record)
│   └── Installmentview.aspx (View)
│
└── Other
    ├── CreateQuestion.aspx
    ├── Certificationview.aspx
    ├── ManageLeaves.aspx
    └── LoginHistory.aspx
```

### UserPanel Module
```
UserPanel/
├── Authentication
│   ├── Login.aspx
│   └── User.master
│
├── Dashboard
│   ├── UserPanel.aspx
│   └── Default1.aspx
│
├── Profile
│   └── MyProfile.aspx
│
├── Courses
│   ├── ShowCourses.aspx
│   └── CourseUpgrade.aspx
│
├── Attendance
│   └── AttendanceView.aspx
│
├── Fees
│   └── InstallmentView.aspx
│
├── Exams
│   ├── ExamRegistration.aspx
│   ├── ResultView.aspx
│   └── ShowExams.aspx
│
└── Other
    ├── CerteficateRequest.aspx
    ├── LeaveApplication.aspx
    └── Feedback.aspx
```

### OnlineExam Module
```
OnlineExam/
├── Authentication
│   └── Login.aspx (Separate DB)
│
├── Student
│   ├── StudentDashboard.aspx
│   ├── StartExam.aspx
│   ├── Exam.aspx (Core)
│   ├── Result.aspx
│   └── StudentViewResults.aspx
│
├── Admin
│   ├── AdminDashboard.aspx
│   ├── CreateAssignExams.aspx
│   ├── AddEditQuestions.aspx
│   ├── ApproveExamRequests.aspx
│   └── ViewAllResults.aspx
│
└── Registration
    ├── NewStudentReg.aspx
    └── PendingRegistrations.aspx
```

## 🗄 Database Schema Overview

### AITCenterDB (Main Database)
```
Registration (Students)
    ├── StudentID (PK)
    ├── Personal Info (Name, Email, Contact)
    ├── Course Info (CourseID, CourseName)
    ├── Fees (FullCourseFees, FeesPaidAmount)
    └── Status, ProgressCode, BatchTime

Attendance
    ├── StudentID (FK → Registration)
    ├── AttendanceDate
    ├── Attendence (Present/Absent)
    └── TeacherName, BatchTime

Installment
    ├── StudentID (FK → Registration)
    ├── ReceiptNo
    ├── PaidAmount, PaidDate
    └── BalanceFees, TotalFees

CourseMaster
    ├── CourseID (PK)
    ├── CourseName
    └── Duration, Fees

register (Admin Users)
    ├── UserID
    ├── EmailID, Password
    └── Username

LoginHistory
    ├── UserID
    ├── UserType, LoginTime
    └── IPAddress, CurrentLocation
```

### AITrealDB (Exam Database)
```
Users
    ├── UserID (PK)
    ├── Username, Password
    ├── FullName
    └── Role, Status

Exams
    ├── ExamID (PK)
    ├── ExamTitle
    └── Duration, TotalMarks

Questions
    ├── QuestionID (PK)
    ├── ExamID (FK → Exams)
    ├── QuestionText
    ├── OptionA, B, C, D
    └── CorrectAnswer

Results
    ├── ResultID (PK)
    ├── UserID (FK → Users)
    ├── ExamID (FK → Exams)
    ├── Score, TotalMarks
    └── ExamDate, Status
```

## 🔐 Session Management

### Admin Session Variables
```csharp
Session["Admin"] = "Head"
Session["UserID"] = adminID
Session["Username"] = adminName
Session["Role"] = "Admin"
Session["Logout"] = email
Response.Cookies["name"] = email (30 min)
```

### Student Session Variables
```csharp
Session["StudentID"] = studentID
Session["RollNo"] = rollNo
Session["FirstName"] = firstName
Session["LastName"] = lastName
Session["StudentName"] = fullName
Session["CourseName"] = course
Session["PhotoFileName"] = photo
Session["User"] = "admin"  // ⚠️ Naming inconsistency
Session["Role"] = "Student"
Session["Login"] = studentID
Session["email"] = email
Session.Timeout = 90 minutes
Response.Cookies["name"] = studentID (60 min)
```

## 🎨 UI/UX Architecture

### Master Pages
- **Admin.master**: Green theme (#556B2F), sidebar navigation
- **User.master**: Dark theme (#0f172a), gradient backgrounds

### Responsive Design
- Bootstrap 5.3.3
- Mobile sidebar toggle
- Responsive grid layouts
- Font Awesome icons

### Dashboard Components
- **Admin**: Charts (attendance, fees, scores)
- **Student**: Personal stats (attendance, exams, fees)

## 🔄 Request Lifecycle

```
1. User Request
   │
   ▼
2. Page_Load Event
   │
   ├─→ Check Session (Authorization)
   │
   ├─→ Check Cookie
   │
   ├─→ Load Data from Database
   │
   └─→ Render Page
        │
        ▼
3. User Interaction (Postback)
   │
   ├─→ Button Click Event
   │
   ├─→ Validate Input
   │
   ├─→ Database Operation
   │
   └─→ Redirect/Update UI
```

## 📈 Key Metrics & Statistics

### Admin Dashboard Tracks:
- Total Active Students
- Today's Present/Absent Count
- Today's Fees Collected
- Monthly Attendance Trends
- Subject-wise Score Analysis

### Student Dashboard Tracks:
- Personal Attendance (Current Month)
- Exam Count
- Fee Payment Status
- Course Progress
- Days Left in Course

## 🚨 Security Flow

```
Request
  │
  ├─→ Session Check
  │     │
  │     ├─→ Valid → Continue
  │     │
  │     └─→ Invalid → Redirect to Login
  │
  ├─→ Cookie Check
  │     │
  │     ├─→ Valid → Continue
  │     │
  │     └─→ Invalid → Redirect to Login
  │
  └─→ Role Check
        │
        ├─→ Admin → AdminPanel Access
        │
        └─→ Student → UserPanel Access
```

---

**Note**: This is a high-level architectural overview. For detailed implementation, refer to `PROJECT_ANALYSIS.md`.

