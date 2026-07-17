import React, { useState } from 'react';
import {
  Edit,
  Eye,
  Plus,
  Save,
  Send,
  Trash2,
} from 'lucide-react';
import {
  DangerButton,
  GlassSurface,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  inputClassName,
} from '../../components/trainer/TrainerUI';

type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'LONG_ANSWER';

interface Question {
  id: number;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  correctAnswer: string;
  options: string[];
}

interface Assessment {
  id: number;
  title: string;
  course: string;
  batch: string;
  dueDate: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  status: 'Draft' | 'Published';
}

const createEmptyQuestion = (id: number): Question => ({
  id,
  questionText: '',
  questionType: 'SHORT_ANSWER',
  marks: 10,
  correctAnswer: '',
  options: ['', '', '', ''],
});

const Assessment: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [course, setCourse] =
    useState('Frontend Development');
  const [batch, setBatch] = useState('Batch A');
  const [dueDate, setDueDate] = useState('');
  const [durationMinutes, setDurationMinutes] =
    useState(60);
  const [instructions, setInstructions] = useState('');

  const [questions, setQuestions] = useState<Question[]>([
    createEmptyQuestion(1),
  ]);

  const [assessments, setAssessments] =
    useState<Assessment[]>([
      {
        id: 1,
        title: 'React Fundamentals Assessment',
        course: 'Frontend Development',
        batch: 'Batch A',
        dueDate: '2026-07-25',
        durationMinutes: 60,
        totalQuestions: 2,
        totalMarks: 20,
        status: 'Published',
      },
      {
        id: 2,
        title: 'Java REST API Assessment',
        course: 'Java Full Stack',
        batch: 'Batch B',
        dueDate: '2026-07-28',
        durationMinutes: 45,
        totalQuestions: 3,
        totalMarks: 30,
        status: 'Draft',
      },
    ]);

  const addQuestion = () => {
    const nextId =
      questions.length === 0
        ? 1
        : Math.max(
            ...questions.map((question) => question.id),
          ) + 1;

    setQuestions([
      ...questions,
      createEmptyQuestion(nextId),
    ]);
  };

  const removeQuestion = (questionId: number) => {
    if (questions.length === 1) {
      window.alert(
        'An assessment must contain at least one question.',
      );
      return;
    }

    setQuestions(
      questions.filter(
        (question) => question.id !== questionId,
      ),
    );
  };

  const updateQuestion = (
    questionId: number,
    field: keyof Question,
    value: string | number | string[],
  ) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              [field]: value,
            }
          : question,
      ),
    );
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions(
      questions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const updatedOptions = [...question.options];
        updatedOptions[optionIndex] = value;

        return {
          ...question,
          options: updatedOptions,
        };
      }),
    );
  };

  const totalMarks = questions.reduce(
    (total, question) =>
      total + Number(question.marks || 0),
    0,
  );

  const resetForm = () => {
    setTitle('');
    setCourse('Frontend Development');
    setBatch('Batch A');
    setDueDate('');
    setDurationMinutes(60);
    setInstructions('');
    setQuestions([createEmptyQuestion(1)]);
    setShowForm(false);
  };

  const validateAssessment = () => {
    if (!title.trim()) {
      window.alert('Please enter an assessment title.');
      return false;
    }

    if (!dueDate) {
      window.alert('Please select a due date.');
      return false;
    }

    if (durationMinutes <= 0) {
      window.alert(
        'Assessment duration must be greater than zero.',
      );
      return false;
    }

    const hasEmptyQuestion = questions.some(
      (question) => !question.questionText.trim(),
    );

    if (hasEmptyQuestion) {
      window.alert(
        'Please enter text for every question.',
      );
      return false;
    }

    const hasInvalidMarks = questions.some(
      (question) => question.marks <= 0,
    );

    if (hasInvalidMarks) {
      window.alert(
        'Each question must have at least one mark.',
      );
      return false;
    }

    const hasMissingCorrectAnswer = questions.some(
      (question) => !question.correctAnswer.trim(),
    );

    if (hasMissingCorrectAnswer) {
      window.alert(
        'Please enter the correct answer or evaluation criteria for every question.',
      );
      return false;
    }

    const hasIncompleteOptions = questions.some(
      (question) =>
        question.questionType === 'MULTIPLE_CHOICE' &&
        question.options.some(
          (option) => !option.trim(),
        ),
    );

    if (hasIncompleteOptions) {
      window.alert(
        'Please complete all multiple-choice options.',
      );
      return false;
    }

    return true;
  };

  const saveAssessment = (
    status: Assessment['status'],
  ) => {
    if (!validateAssessment()) {
      return;
    }

    const newAssessment: Assessment = {
      id: Date.now(),
      title: title.trim(),
      course,
      batch,
      dueDate,
      durationMinutes,
      totalQuestions: questions.length,
      totalMarks,
      status,
    };

    setAssessments((currentAssessments) => [
      newAssessment,
      ...currentAssessments,
    ]);

    window.alert(
      status === 'Published'
        ? 'Assessment published successfully.'
        : 'Assessment saved as draft.',
    );

    resetForm();
  };

  const deleteAssessment = (assessmentId: number) => {
    setAssessments((currentAssessments) =>
      currentAssessments.filter(
        (assessment) =>
          assessment.id !== assessmentId,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Assessments
          </h1>

          <p className="mt-1 text-gray-500">
            Create online assessments that students answer
            directly inside the LMS.
          </p>
        </div>

        <PrimaryButton
          type="button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          <Plus size={18} />
          {showForm
            ? 'Close Form'
            : 'Create Assessment'}
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassSurface className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">
            Assessment Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Assessment Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter assessment title"
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
                Duration in Minutes
              </label>

              <input
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(event) =>
                  setDurationMinutes(
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
                placeholder="Enter instructions for students"
                rows={4}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="my-8 border-t border-gray-200" />

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Assessment Questions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {questions.length} questions • {totalMarks}{' '}
                total marks
              </p>
            </div>

            <SecondaryButton
              type="button"
              onClick={addQuestion}
            >
              <Plus size={17} />
              Add Question
            </SecondaryButton>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-primary-100 bg-primary-50/40 p-5 transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    Question {index + 1}
                  </h3>

                  <DangerButton
                    type="button"
                    className="p-2.5"
                    onClick={() =>
                      removeQuestion(question.id)
                    }
                    title="Delete question"
                  >
                    <Trash2 size={16} />
                  </DangerButton>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Question Text
                  </label>

                  <textarea
                    value={question.questionText}
                    onChange={(event) =>
                      updateQuestion(
                        question.id,
                        'questionText',
                        event.target.value,
                      )
                    }
                    placeholder="Type the complete question"
                    rows={3}
                    className={inputClassName}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Question Type
                    </label>

                    <select
                      value={question.questionType}
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          'questionType',
                          event.target.value as QuestionType,
                        )
                      }
                      className={inputClassName}
                    >
                      <option value="MULTIPLE_CHOICE">
                        Multiple Choice
                      </option>

                      <option value="TRUE_FALSE">
                        True / False
                      </option>

                      <option value="SHORT_ANSWER">
                        Short Answer
                      </option>

                      <option value="LONG_ANSWER">
                        Long Answer
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Marks
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={question.marks}
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          'marks',
                          Number(event.target.value),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>

                {question.questionType ===
                  'MULTIPLE_CHOICE' && (
                  <div className="mt-4">
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      Answer Options
                    </label>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {question.options.map(
                        (option, optionIndex) => (
                          <input
                            key={optionIndex}
                            type="text"
                            value={option}
                            onChange={(event) =>
                              updateOption(
                                question.id,
                                optionIndex,
                                event.target.value,
                              )
                            }
                            placeholder={`Option ${
                              optionIndex + 1
                            }`}
                            className={inputClassName}
                          />
                        ),
                      )}
                    </div>
                  </div>
                )}

                {question.questionType ===
                  'TRUE_FALSE' ? (
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Correct Answer
                    </label>

                    <select
                      value={question.correctAnswer}
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          'correctAnswer',
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                    >
                      <option value="">
                        Select correct answer
                      </option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Correct Answer or Evaluation Criteria
                    </label>

                    <textarea
                      value={question.correctAnswer}
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          'correctAnswer',
                          event.target.value,
                        )
                      }
                      placeholder="Enter the expected answer or evaluation criteria"
                      rows={3}
                      className={inputClassName}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
            <SecondaryButton
              type="button"
              onClick={() =>
                saveAssessment('Draft')
              }
            >
              <Save size={17} />
              Save Draft
            </SecondaryButton>

            <PrimaryButton
              type="button"
              onClick={() =>
                saveAssessment('Published')
              }
            >
              <Send size={17} />
              Publish Assessment
            </PrimaryButton>
          </div>
        </GlassSurface>
      )}

      <GlassSurface className="overflow-hidden">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Assessment List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
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
                  Questions
                </th>

                <th className="px-6 py-4 text-left">
                  Marks
                </th>

                <th className="px-6 py-4 text-left">
                  Duration
                </th>

                <th className="px-6 py-4 text-left">
                  Due Date
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
              {assessments.map((assessment) => (
                <tr
                  key={assessment.id}
                  className="transition hover:bg-primary-50/50"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {assessment.title}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assessment.course}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assessment.batch}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assessment.totalQuestions}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assessment.totalMarks}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assessment.durationMinutes} minutes
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {assessment.dueDate}
                  </td>

                  <td className="px-6 py-4">
                    {assessment.status ===
                    'Published' ? (
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
                        title="View assessment"
                      >
                        <Eye size={16} />
                      </SecondaryButton>

                      <SecondaryButton
                        type="button"
                        className="p-2.5"
                        title="Edit assessment"
                      >
                        <Edit size={16} />
                      </SecondaryButton>

                      <DangerButton
                        type="button"
                        className="p-2.5"
                        title="Delete assessment"
                        onClick={() =>
                          deleteAssessment(
                            assessment.id,
                          )
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

export default Assessment;