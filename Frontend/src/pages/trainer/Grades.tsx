import React, { useState } from 'react';
import {
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Send,
} from 'lucide-react';

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
  assignment: string;
  generatedGrade: number;
  maximumGrade: number;
  status: 'Awaiting Review' | 'Confirmed' | 'Published';
  feedback: string;
  answers: Answer[];
}

const Grades: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      student: 'John Smith',
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
            'A React component is a reusable part of the user interface.',
          expectedAnswer:
            'A reusable and independent UI building block.',
          marks: 9,
          maximumMarks: 10,
        },
        {
          id: 2,
          question: 'Explain props and state.',
          studentAnswer:
            'Props come from the parent and state is managed inside the component.',
          expectedAnswer:
            'Props are external and read-only; state is internal and changeable.',
          marks: 9,
          maximumMarks: 10,
        },
      ],
    },
  ]);

  const updateFeedback = (submissionId: number, feedback: string) => {
    setSubmissions(
      submissions.map((submission) =>
        submission.id === submissionId
          ? { ...submission, feedback }
          : submission,
      ),
    );
  };

  const confirmGrade = (submissionId: number) => {
    setSubmissions(
      submissions.map((submission) =>
        submission.id === submissionId
          ? { ...submission, status: 'Confirmed' }
          : submission,
      ),
    );
  };

  const publishGrade = (submissionId: number) => {
    setSubmissions(
      submissions.map((submission) =>
        submission.id === submissionId
          ? { ...submission, status: 'Published' }
          : submission,
      ),
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Review Assignments
        </h1>

        <p className="mt-1 text-gray-500">
          Review automatically generated grades and publish results
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Student</th>
              <th className="px-6 py-3 text-left">Assignment</th>
              <th className="px-6 py-3 text-left">Generated Grade</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {submissions.map((submission) => (
              <React.Fragment key={submission.id}>
                <tr>
                  <td className="px-6 py-4 font-medium">
                    {submission.student}
                  </td>

                  <td className="px-6 py-4">
                    {submission.assignment}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {submission.generatedGrade}/
                    {submission.maximumGrade}
                  </td>

                  <td className="px-6 py-4">
                    {submission.status}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(
                          expandedId === submission.id
                            ? null
                            : submission.id,
                        )
                      }
                      className="flex items-center gap-2 rounded-lg border px-3 py-2"
                    >
                      <Eye size={16} />
                      Review

                      {expandedId === submission.id ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>
                  </td>
                </tr>

                {expandedId === submission.id && (
                  <tr>
                    <td colSpan={5} className="bg-gray-50 p-6">
                      <div className="rounded-xl bg-white p-6">
                        {submission.answers.map((answer, index) => (
                          <div
                            key={answer.id}
                            className="mb-5 rounded-lg border p-5"
                          >
                            <h3 className="font-semibold">
                              Question {index + 1}
                            </h3>

                            <p className="mt-2">{answer.question}</p>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-xs font-semibold text-gray-500">
                                  STUDENT ANSWER
                                </p>

                                <p className="mt-2 text-sm">
                                  {answer.studentAnswer}
                                </p>
                              </div>

                              <div className="rounded-lg bg-green-50 p-4">
                                <p className="text-xs font-semibold text-green-700">
                                  EXPECTED ANSWER
                                </p>

                                <p className="mt-2 text-sm">
                                  {answer.expectedAnswer}
                                </p>
                              </div>
                            </div>

                            <p className="mt-4 font-medium">
                              Generated Marks: {answer.marks}/
                              {answer.maximumMarks}
                            </p>
                          </div>
                        ))}

                        <textarea
                          value={submission.feedback}
                          onChange={(event) =>
                            updateFeedback(
                              submission.id,
                              event.target.value,
                            )
                          }
                          placeholder="Trainer feedback"
                          rows={4}
                          className="w-full rounded-lg border px-4 py-2"
                        />

                        <div className="mt-5 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              confirmGrade(submission.id)
                            }
                            className="flex items-center gap-2 rounded-lg border border-blue-300 px-4 py-2 text-blue-700"
                          >
                            <CheckCircle size={17} />
                            Confirm Grade
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              publishGrade(submission.id)
                            }
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white"
                          >
                            <Send size={17} />
                            Publish Grade
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;