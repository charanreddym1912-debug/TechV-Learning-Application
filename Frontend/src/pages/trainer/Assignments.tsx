import React, { useState } from 'react';
import {
  Edit,
  Eye,
  FileText,
  Plus,
  Save,
  Send,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  DangerButton,
  GlassSurface,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  inputClassName,
} from '../../components/trainer/TrainerUI';

interface Assignment {
  id: number;
  title: string;
  course: string;
  batch: string;
  dueDate: string;
  maximumMarks: number;
  status: 'Draft' | 'Published';
  submissions: number;
}

const Assignments: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [course, setCourse] =
    useState('Frontend Development');
  const [batch, setBatch] = useState('Batch A');
  const [dueDate, setDueDate] = useState('');
  const [maximumMarks, setMaximumMarks] = useState(100);
  const [instructions, setInstructions] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [allowedFileType, setAllowedFileType] =
    useState('PDF, DOC, DOCX');
  const [maximumFileSize, setMaximumFileSize] =
    useState(10);

  const [assignments, setAssignments] = useState<Assignment[]>(
    [
      {
        id: 1,
        title: 'React Component Design Assignment',
        course: 'Frontend Development',
        batch: 'Batch A',
        dueDate: '2026-07-25',
        maximumMarks: 100,
        status: 'Published',
        submissions: 18,
      },
      {
        id: 2,
        title: 'Spring Boot API Documentation',
        course: 'Java Full Stack',
        batch: 'Batch B',
        dueDate: '2026-07-28',
        maximumMarks: 100,
        status: 'Draft',
        submissions: 0,
      },
    ],
  );

  const resetForm = () => {
    setTitle('');
    setCourse('Frontend Development');
    setBatch('Batch A');
    setDueDate('');
    setMaximumMarks(100);
    setInstructions('');
    setQuestionText('');
    setAllowedFileType('PDF, DOC, DOCX');
    setMaximumFileSize(10);
    setShowForm(false);
  };

  const saveAssignment = (
    status: Assignment['status'],
  ) => {
    if (!title.trim()) {
      window.alert('Please enter an assignment title.');
      return;
    }

    if (!questionText.trim()) {
      window.alert(
        'Please enter the assignment question or task.',
      );
      return;
    }

    if (!dueDate) {
      window.alert('Please select a due date.');
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now(),
      title: title.trim(),
      course,
      batch,
      dueDate,
      maximumMarks,
      status,
      submissions: 0,
    };

    setAssignments((currentAssignments) => [
      newAssignment,
      ...currentAssignments,
    ]);

    window.alert(
      status === 'Published'
        ? 'Assignment published successfully.'
        : 'Assignment saved as draft.',
    );

    resetForm();
  };

  const deleteAssignment = (assignmentId: number) => {
    setAssignments((currentAssignments) =>
      currentAssignments.filter(
        (assignment) => assignment.id !== assignmentId,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Assignments
          </h1>

          <p className="mt-1 text-gray-500">
            Create written assignments. Students complete the
            work and upload a document for review.
          </p>
        </div>

        <PrimaryButton
          type="button"
          onClick={() => setShowForm((current) => !current)}
        >
          <Plus size={18} />
          {showForm ? 'Close Form' : 'Create Assignment'}
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassSurface className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <FileText size={24} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Assignment Information
              </h2>

              <p className="text-sm text-gray-500">
                Enter the assignment task and document-submission
                requirements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Assignment Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter assignment title"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Course
              </label>

              <select
                value={course}
                onChange={(event) =>
                  setCourse(event.target.value)
                }
                className={inputClassName}
              >
                <option>Frontend Development</option>
                <option>Java Full Stack</option>
                <option>Database Development</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Batch
              </label>

              <select
                value={batch}
                onChange={(event) =>
                  setBatch(event.target.value)
                }
                className={inputClassName}
              >
                <option>Batch A</option>
                <option>Batch B</option>
                <option>Batch C</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Maximum Marks
              </label>

              <input
                type="number"
                min="1"
                value={maximumMarks}
                onChange={(event) =>
                  setMaximumMarks(
                    Number(event.target.value),
                  )
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Allowed File Types
              </label>

              <input
                value={allowedFileType}
                onChange={(event) =>
                  setAllowedFileType(event.target.value)
                }
                placeholder="PDF, DOC, DOCX"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Maximum File Size in MB
              </label>

              <input
                type="number"
                min="1"
                value={maximumFileSize}
                onChange={(event) =>
                  setMaximumFileSize(
                    Number(event.target.value),
                  )
                }
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Instructions
              </label>

              <textarea
                value={instructions}
                onChange={(event) =>
                  setInstructions(event.target.value)
                }
                placeholder="Explain how students should complete and submit the assignment"
                rows={4}
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Assignment Question / Task
              </label>

              <textarea
                value={questionText}
                onChange={(event) =>
                  setQuestionText(event.target.value)
                }
                placeholder="Write the complete assignment question or task here"
                rows={8}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50/60 p-5">
            <div className="flex items-start gap-3">
              <Upload
                size={22}
                className="mt-0.5 text-primary-600"
              />

              <div>
                <h3 className="font-semibold text-gray-800">
                  Student submission
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Students will see the question on screen and
                  upload their completed document. Allowed types:{' '}
                  {allowedFileType}. Maximum size:{' '}
                  {maximumFileSize} MB.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
            <SecondaryButton
              type="button"
              onClick={() => saveAssignment('Draft')}
            >
              <Save size={17} />
              Save Draft
            </SecondaryButton>

            <PrimaryButton
              type="button"
              onClick={() => saveAssignment('Published')}
            >
              <Send size={17} />
              Publish Assignment
            </PrimaryButton>
          </div>
        </GlassSurface>
      )}

      <GlassSurface className="overflow-hidden">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Assignment List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-sm">
            <thead className="bg-primary-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  Title
                </th>
                <th className="px-6 py-4 text-left">
                  Course
                </th>
                <th className="px-6 py-4 text-left">
                  Batch
                </th>
                <th className="px-6 py-4 text-left">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left">
                  Marks
                </th>
                <th className="px-6 py-4 text-left">
                  Submissions
                </th>
                <th className="px-6 py-4 text-left">
                  Status
                </th>
                <th className="px-6 py-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {assignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="transition hover:bg-primary-50/50"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {assignment.title}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assignment.course}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assignment.batch}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assignment.dueDate}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assignment.maximumMarks}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assignment.submissions}
                  </td>

                  <td className="px-6 py-4">
                    {assignment.status === 'Published' ? (
                      <StatusBadge type="success">
                        Published
                      </StatusBadge>
                    ) : (
                      <StatusBadge type="warning">
                        Draft
                      </StatusBadge>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <SecondaryButton
                        type="button"
                        className="p-2.5"
                        title="View assignment"
                      >
                        <Eye size={16} />
                      </SecondaryButton>

                      <SecondaryButton
                        type="button"
                        className="p-2.5"
                        title="Edit assignment"
                      >
                        <Edit size={16} />
                      </SecondaryButton>

                      <DangerButton
                        type="button"
                        className="p-2.5"
                        title="Delete assignment"
                        onClick={() =>
                          deleteAssignment(assignment.id)
                        }
                      >
                        <Trash2 size={16} />
                      </DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassSurface>
    </div>
  );
};

export default Assignments;