import React, { useState } from 'react';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Send,
} from 'lucide-react';
import {
  GlassSurface,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  inputClassName,
} from '../../components/trainer/TrainerUI';

interface Answer {
  id: number;
  question: string;
  studentAnswer: string;
  expectedAnswer: string;
  marks: number;
  maximumMarks: number;
}

interface Submission {
  id: number;
  student: string;
  employeeId: string;
  assignment: string;
  generatedGrade: number;
  maximumGrade: number;
  status: 'Awaiting Review' | 'Confirmed' | 'Published';
  feedback: string;
  answers: Answer[];
}

const Grades: React.FC = () => {
  const [expandedId, setExpandedId] =
    useState<number | null>(null);

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      student: 'John Smith',
      employeeId: 'EMP-1001',
      assignment: 'React Fundamentals',
      generatedGrade: 18,
      maximumGrade: 20,
      status: 'Awaiting Review',
      feedback: '',
      answers: [
        {
          id: 1,
          question: 'What is a React component?',
          studentAnswer:
            'A reusable part of the user interface.',
          expectedAnswer:
            'A reusable and independent UI building block.',
          marks: 9,
          maximumMarks: 10,
        },
        {
          id: 2,
          question:
            'What is the difference between props and state?',
          studentAnswer:
            'Props come from a parent. State is managed inside the component.',
          expectedAnswer:
            'Props are external and read-only, while state is internal and changeable.',
          marks: 9,
          maximumMarks: 10,
        },
      ],
    },
    {
      id: 2,
      student: 'Priya Sharma',
      employeeId: 'EMP-1002',
      assignment: 'React Fundamentals',
      generatedGrade: 20,
      maximumGrade: 20,
      status: 'Confirmed',
      feedback: 'Excellent work.',
      answers: [
        {
          id: 1,
          question: 'What is a React component?',
          studentAnswer:
            'An independent and reusable UI block.',
          expectedAnswer:
            'A reusable and independent UI building block.',
          marks: 10,
          maximumMarks: 10,
        },
        {
          id: 2,
          question:
            'What is the difference between props and state?',
          studentAnswer:
            'Props are read-only values from a parent. State belongs to the component and can change.',
          expectedAnswer:
            'Props are external and read-only, while state is internal and changeable.',
          marks: 10,
          maximumMarks: 10,
        },
      ],
    },
  ]);

  const updateFeedback = (
    submissionId: number,
    feedback: string,
  ) => {
    setSubmissions((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission.id === submissionId
          ? { ...submission, feedback }
          : submission,
      ),
    );
  };

  const confirmGrade = (submissionId: number) => {
    setSubmissions((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission.id === submissionId
          ? { ...submission, status: 'Confirmed' }
          : submission,
      ),
    );

    window.alert('Grade confirmed successfully.');
  };

  const publishGrade = (submissionId: number) => {
    setSubmissions((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission.id === submissionId
          ? { ...submission, status: 'Published' }
          : submission,
      ),
    );

    window.alert('Grade published to the student.');
  };

  const renderStatus = (
    status: Submission['status'],
  ) => {
    if (status === 'Published') {
      return (
        <StatusBadge type="success">Published</StatusBadge>
      );
    }

    if (status === 'Confirmed') {
      return (
        <StatusBadge type="primary">Confirmed</StatusBadge>
      );
    }

    return (
      <StatusBadge type="warning">
        Awaiting Review
      </StatusBadge>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Review Assignments
        </h1>

        <p className="mt-1 text-gray-500">
          Review automatically generated grades and publish
          results to students.
        </p>
      </div>

      <GlassSurface className="overflow-hidden">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Auto-Graded Submissions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-sm">
            <thead className="bg-primary-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  Student
                </th>
                <th className="px-6 py-4 text-left">
                  Employee ID
                </th>
                <th className="px-6 py-4 text-left">
                  Assignment
                </th>
                <th className="px-6 py-4 text-left">
                  Generated Grade
                </th>
                <th className="px-6 py-4 text-left">
                  Status
                </th>
                <th className="px-6 py-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {submissions.map((submission) => (
                <React.Fragment key={submission.id}>
                  <tr className="transition hover:bg-primary-50/50">
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {submission.student}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {submission.employeeId}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {submission.assignment}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-primary-700">
                        {submission.generatedGrade}/
                        {submission.maximumGrade}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {renderStatus(submission.status)}
                    </td>

                    <td className="px-6 py-4">
                      <SecondaryButton
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            expandedId === submission.id
                              ? null
                              : submission.id,
                          )
                        }
                      >
                        <Eye size={16} />
                        Review Answers

                        {expandedId === submission.id ? (
                          <ChevronUp size={15} />
                        ) : (
                          <ChevronDown size={15} />
                        )}
                      </SecondaryButton>
                    </td>
                  </tr>

                  {expandedId === submission.id && (
                    <tr>
                      <td
                        colSpan={6}
                        className="bg-slate-50 p-6"
                      >
                        <GlassSurface className="p-6">
                          <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {submission.assignment}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                Student: {submission.student}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3 text-center text-white shadow-lg shadow-primary-500/30">
                              <p className="text-xs text-white/80">
                                Generated Grade
                              </p>

                              <p className="text-2xl font-bold">
                                {submission.generatedGrade}/
                                {submission.maximumGrade}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-5">
                            {submission.answers.map(
                              (answer, index) => (
                                <div
                                  key={answer.id}
                                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg"
                                >
                                  <h4 className="font-semibold text-gray-800">
                                    Question {index + 1}
                                  </h4>

                                  <p className="mt-2 text-gray-700">
                                    {answer.question}
                                  </p>

                                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                      <p className="text-xs font-semibold uppercase text-gray-500">
                                        Student Answer
                                      </p>

                                      <p className="mt-2 text-sm text-gray-700">
                                        {answer.studentAnswer}
                                      </p>
                                    </div>

                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                      <p className="text-xs font-semibold uppercase text-emerald-700">
                                        Expected Answer
                                      </p>

                                      <p className="mt-2 text-sm text-emerald-800">
                                        {answer.expectedAnswer}
                                      </p>
                                    </div>
                                  </div>

                                  <p className="mt-4 font-semibold text-primary-700">
                                    Generated Marks: {answer.marks}/
                                    {answer.maximumMarks}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>

                          <div className="mt-6">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Trainer Feedback
                            </label>

                            <textarea
                              value={submission.feedback}
                              onChange={(event) =>
                                updateFeedback(
                                  submission.id,
                                  event.target.value,
                                )
                              }
                              placeholder="Enter feedback for the student"
                              rows={4}
                              className={inputClassName}
                            />
                          </div>

                          <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
                            <SecondaryButton
                              type="button"
                              onClick={() =>
                                confirmGrade(submission.id)
                              }
                            >
                              <CheckCircle size={17} />
                              Confirm Grade
                            </SecondaryButton>

                            <PrimaryButton
                              type="button"
                              onClick={() =>
                                publishGrade(submission.id)
                              }
                            >
                              <Send size={17} />
                              Publish Grade
                            </PrimaryButton>
                          </div>
                        </GlassSurface>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </GlassSurface>
    </div>
  );
};

export default Grades;