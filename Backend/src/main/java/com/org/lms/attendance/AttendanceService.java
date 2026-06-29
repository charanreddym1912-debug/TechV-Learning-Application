package com.org.lms.attendance;

import com.org.lms.attendance.dto.AttendanceRecordRequest;
import com.org.lms.exception.ResourceNotFoundException;
import com.org.lms.session.Session;
import com.org.lms.session.SessionRepository;
import com.org.lms.user.entity.Student;
import com.org.lms.user.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final SessionRepository sessionRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            SessionRepository sessionRepository,
            StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.sessionRepository = sessionRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public Attendance recordAttendance(AttendanceRecordRequest request) {
        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + request.getSessionId()));
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + request.getStudentId()));

        Optional<Attendance> existing = attendanceRepository.findBySessionIdAndStudentId(session.getId(), student.getId());
        
        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setIsPresent(request.getIsPresent());
        } else {
            attendance = new Attendance();
            attendance.setSession(session);
            attendance.setStudent(student);
            attendance.setIsPresent(request.getIsPresent());
        }
        
        return attendanceRepository.save(attendance);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceBySession(Long sessionId) {
        if (!sessionRepository.existsById(sessionId)) {
            throw new ResourceNotFoundException("Session not found with ID: " + sessionId);
        }
        return attendanceRepository.findBySessionId(sessionId);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentId);
        }
        return attendanceRepository.findByStudentId(studentId);
    }
}
