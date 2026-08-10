package com.org.lms.coordinator.service;

import com.org.lms.coordinator.dto.MockInterviewRequest;
import com.org.lms.coordinator.dto.MockInterviewResponse;
import com.org.lms.coordinator.entity.Course;
import com.org.lms.coordinator.entity.MockInterview;
import com.org.lms.coordinator.repository.CourseRepository;
import com.org.lms.coordinator.repository.MockInterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MockInterviewService {

    private final MockInterviewRepository mockInterviewRepository;
    private final CourseRepository courseRepository;

    public MockInterviewService(
            MockInterviewRepository mockInterviewRepository,
            CourseRepository courseRepository) {

        this.mockInterviewRepository = mockInterviewRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public MockInterviewResponse createMockInterview(
            Long courseId,
            MockInterviewRequest request) {

        Course course = getCourseOrThrow(courseId);

        validateRequest(request);
        validateDates(course, request.getScheduledDateTime());
        validateDuplicateTitle(course, request.getTitle(), null);

        MockInterview mockInterview = new MockInterview();

        mockInterview.setTitle(request.getTitle().trim());
        mockInterview.setDescription(request.getDescription());
        mockInterview.setScheduledDateTime(request.getScheduledDateTime());
        mockInterview.setInterviewerName(request.getInterviewerName());
        mockInterview.setDurationInMinutes(request.getDurationInMinutes());
        mockInterview.setMeetingLink(request.getMeetingLink().trim());
        mockInterview.setCourse(course);

        MockInterview savedMockInterview =
                mockInterviewRepository.save(mockInterview);

        return mapToResponse(savedMockInterview);
    }

    @Transactional(readOnly = true)
    public List<MockInterviewResponse> getAllMockInterviews() {

        return mockInterviewRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MockInterviewResponse getMockInterviewById(
            Long mockInterviewId) {

        MockInterview mockInterview =
                mockInterviewRepository.findById(mockInterviewId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mock Interview not found with id: "
                                                + mockInterviewId));

        return mapToResponse(mockInterview);
    }

    @Transactional(readOnly = true)
    public List<MockInterviewResponse> getMockInterviewsByCourse(
            Long courseId) {

        getCourseOrThrow(courseId);

        return mockInterviewRepository
                .findByCourse_CourseIdOrderByScheduledDateTimeAsc(courseId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MockInterviewResponse updateMockInterview(
            Long courseId,
            Long mockInterviewId,
            MockInterviewRequest request) {

        Course course = getCourseOrThrow(courseId);

        MockInterview mockInterview =
                mockInterviewRepository.findById(mockInterviewId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mock Interview not found with id: "
                                                + mockInterviewId));

        if (!mockInterview.getCourse()
                .getCourseId()
                .equals(courseId)) {

            throw new IllegalArgumentException(
                    "Mock Interview does not belong to the specified course");
        }

        validateRequest(request);
        validateDates(course, request.getScheduledDateTime());
        validateDuplicateTitle(
                course,
                request.getTitle(),
                mockInterviewId);

        mockInterview.setTitle(request.getTitle().trim());
        mockInterview.setDescription(request.getDescription());
        mockInterview.setScheduledDateTime(
                request.getScheduledDateTime());
        mockInterview.setInterviewerName(
                request.getInterviewerName());
        mockInterview.setDurationInMinutes(
                request.getDurationInMinutes());
        mockInterview.setMeetingLink(
                request.getMeetingLink().trim());

        MockInterview updatedMockInterview =
                mockInterviewRepository.save(mockInterview);

        return mapToResponse(updatedMockInterview);
    }

    @Transactional
    public void deleteMockInterview(
            Long mockInterviewId) {

        MockInterview mockInterview =
                mockInterviewRepository.findById(mockInterviewId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mock Interview not found with id: "
                                                + mockInterviewId));

        mockInterviewRepository.delete(mockInterview);
    }

    private void validateRequest(
            MockInterviewRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Mock interview request cannot be null");
        }

        if (request.getTitle() == null
                || request.getTitle().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Mock interview title is required");
        }

        if (request.getScheduledDateTime() == null) {

            throw new IllegalArgumentException(
                    "Scheduled date and time are required");
        }

        if (request.getMeetingLink() == null
                || request.getMeetingLink().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Meeting link is required");
        }

        if (request.getDurationInMinutes() == null
                || request.getDurationInMinutes() <= 0) {

            throw new IllegalArgumentException(
                    "Duration must be greater than zero");
        }
    }

    private void validateDates(
            Course course,
            LocalDateTime scheduledDateTime) {

        if (scheduledDateTime == null) {

            throw new IllegalArgumentException(
                    "Scheduled date and time are required");
        }

        if (scheduledDateTime.isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Scheduled date and time cannot be in the past");
        }

        if (course.getStartDate() != null
                && scheduledDateTime.toLocalDate()
                .isBefore(course.getStartDate())) {

            throw new IllegalArgumentException(
                    "Scheduled date and time must be on or after the course start date");
        }

        if (course.getEndDate() != null
                && scheduledDateTime.toLocalDate()
                .isAfter(course.getEndDate())) {

            throw new IllegalArgumentException(
                    "Scheduled date and time must be on or before the course end date");
        }
    }

    private void validateDuplicateTitle(
            Course course,
            String title,
            Long currentId) {

        if (title == null || title.trim().isEmpty()) {
            return;
        }

        boolean exists = currentId == null
                ? mockInterviewRepository
                .existsByCourseAndTitleIgnoreCase(
                        course,
                        title.trim())
                : mockInterviewRepository
                .existsByCourseAndTitleIgnoreCaseAndMockInterviewIdNot(
                        course,
                        title.trim(),
                        currentId);

        if (exists) {
            throw new RuntimeException(
                    "Mock interview already exists with title: "
                            + title.trim());
        }
    }

    private Course getCourseOrThrow(
            Long courseId) {

        return courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with id: "
                                        + courseId));
    }

    private MockInterviewResponse mapToResponse(
            MockInterview mockInterview) {

        MockInterviewResponse response =
                new MockInterviewResponse();

        response.setMockInterviewId(
                mockInterview.getMockInterviewId());

        response.setTitle(
                mockInterview.getTitle());

        response.setDescription(
                mockInterview.getDescription());

        response.setScheduledDateTime(
                mockInterview.getScheduledDateTime());

        response.setInterviewerName(
                mockInterview.getInterviewerName());

        response.setDurationInMinutes(
                mockInterview.getDurationInMinutes());

        response.setMeetingLink(
                mockInterview.getMeetingLink());

        if (mockInterview.getCourse() != null) {
            response.setCourseId(
                    mockInterview.getCourse().getCourseId());
        }

        return response;
    }
}