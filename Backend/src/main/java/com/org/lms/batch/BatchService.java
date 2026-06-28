package com.org.lms.batch;

import com.org.lms.course.Course;
import com.org.lms.course.CourseRepository;
import com.org.lms.exception.ResourceNotFoundException;
import com.org.lms.user.entity.Student;
import com.org.lms.user.entity.Trainer;
import com.org.lms.user.repository.StudentRepository;
import com.org.lms.user.repository.TrainerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class BatchService {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;
    private final TrainerRepository trainerRepository;
    private final StudentRepository studentRepository;

    public BatchService(
            BatchRepository batchRepository,
            CourseRepository courseRepository,
            TrainerRepository trainerRepository,
            StudentRepository studentRepository) {
        this.batchRepository = batchRepository;
        this.courseRepository = courseRepository;
        this.trainerRepository = trainerRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Batch getBatchById(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + id));
    }

    @Transactional
    public Batch createBatch(Batch batch, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        batch.setCourse(course);
        return batchRepository.save(batch);
    }

    @Transactional
    public Batch updateBatch(Long id, Batch updatedBatch, Long courseId) {
        Batch batch = getBatchById(id);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        
        batch.setName(updatedBatch.getName());
        batch.setStartDate(updatedBatch.getStartDate());
        batch.setEndDate(updatedBatch.getEndDate());
        batch.setCapacity(updatedBatch.getCapacity());
        batch.setCourse(course);
        return batchRepository.save(batch);
    }

    @Transactional
    public void deleteBatch(Long id) {
        if (!batchRepository.existsById(id)) {
            throw new ResourceNotFoundException("Batch not found with ID: " + id);
        }
        batchRepository.deleteById(id);
    }

    // --- TRAINER ASSIGNMENT ---

    @Transactional
    public void assignTrainerToBatch(Long batchId, Long trainerId) {
        Batch batch = getBatchById(batchId);
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + trainerId));
        batch.getTrainers().add(trainer);
        batchRepository.save(batch);
    }

    @Transactional
    public void removeTrainerFromBatch(Long batchId, Long trainerId) {
        Batch batch = getBatchById(batchId);
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + trainerId));
        batch.getTrainers().remove(trainer);
        batchRepository.save(batch);
    }

    @Transactional(readOnly = true)
    public Set<Trainer> getBatchTrainers(Long batchId) {
        Batch batch = getBatchById(batchId);
        return batch.getTrainers();
    }

    // --- STUDENT ENROLLMENT ---

    @Transactional
    public void enrollStudentInBatch(Long batchId, Long studentId) {
        Batch batch = getBatchById(batchId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        
        if (batch.getStudents().size() >= batch.getCapacity()) {
            throw new IllegalStateException("Batch is at maximum student capacity (" + batch.getCapacity() + ")");
        }
        
        batch.getStudents().add(student);
        batchRepository.save(batch);
    }

    @Transactional
    public void removeStudentFromBatch(Long batchId, Long studentId) {
        Batch batch = getBatchById(batchId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        batch.getStudents().remove(student);
        batchRepository.save(batch);
    }

    @Transactional(readOnly = true)
    public Set<Student> getBatchStudents(Long batchId) {
        Batch batch = getBatchById(batchId);
        return batch.getStudents();
    }
}
