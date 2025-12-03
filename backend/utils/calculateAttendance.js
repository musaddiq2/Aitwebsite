// Attendance calculation utilities

export const calculateAttendancePercentage = (present, total) => {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
};

export const getAttendanceStats = (attendanceRecords) => {
  const present = attendanceRecords.filter(a => a.attendance === 'Present').length;
  const absent = attendanceRecords.filter(a => a.attendance === 'Absent').length;
  const total = attendanceRecords.length;
  const percentage = calculateAttendancePercentage(present, total);

  return {
    present,
    absent,
    total,
    percentage
  };
};

export const getMonthlyAttendance = (attendanceRecords, month, year) => {
  const filtered = attendanceRecords.filter(record => {
    const recordDate = new Date(record.attendanceDate);
    return recordDate.getMonth() === month && recordDate.getFullYear() === year;
  });

  return getAttendanceStats(filtered);
};

