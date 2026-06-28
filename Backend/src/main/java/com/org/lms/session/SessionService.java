package com.org.lms.session;

import com.org.lms.batch.Batch;
import com.org.lms.batch.BatchRepository;
import com.org.lms.exception.ResourceNotFoundException;
import com.org.lms.user.entity.Student;
import com.org.lms.user.entity.Trainer;
import com.org.lms.user.repository.StudentRepository;
import com.org.lms.user.repository.TrainerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final BatchRepository batchRepository;
    private final TrainerRepository trainerRepository;
    private final StudentRepository studentRepository;

    public SessionService(
            SessionRepository sessionRepository,
            BatchRepository batchRepository,
            TrainerRepository trainerRepository,
            StudentRepository studentRepository) {
        this.sessionRepository = sessionRepository;
        this.batchRepository = batchRepository;
        this.trainerRepository = trainerRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Session getSessionById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + id));
    }

    @Transactional
    public Session createSession(Session session, Long batchId, Long trainerId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + batchId));
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + trainerId));
        
        session.setBatch(batch);
        session.setTrainer(trainer);
        return sessionRepository.save(session);
    }

    @Transactional
    public Session updateSession(Long id, Session updatedSession, Long batchId, Long trainerId) {
        Session session = getSessionById(id);
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + batchId));
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + trainerId));

        session.setTopic(updatedSession.getTopic());
        session.setStartTime(updatedSession.getStartTime());
        session.setDuration(updatedSession.getDuration());
        session.setZoomMeetingId(updatedSession.getZoomMeetingId());
        session.setBatch(batch);
        session.setTrainer(trainer);
        return sessionRepository.save(session);
    }

    @Transactional
    public void deleteSession(Long id) {
        if (!sessionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Session not found with ID: " + id);
        }
        sessionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Session> getSessionsForTrainer(Long trainerId) {
        return sessionRepository.findByTrainerId(trainerId);
    }

    @Transactional(readOnly = true)
    public List<Session> getSessionsForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        
        // Find all batches the student is enrolled in
        List<Batch> batches = batchRepository.findAll().stream()
                .filter(b -> b.getStudents().contains(student))
                .collect(Collectors.toList());

        if (batches.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> batchIds = batches.stream().map(Batch::getId).collect(Collectors.toList());
        return sessionRepository.findByBatchIdIn(batchIds);
    }
}
