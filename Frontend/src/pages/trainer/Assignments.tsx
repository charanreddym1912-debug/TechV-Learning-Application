import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Save,
  Send,
} from 'lucide-react';

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

interface Assignment {
  id: number;
  title: string;
  course: string;
  batch: string;
  dueDate: string;
  totalQuestions: number;
  totalMarks: number;
  status: 'Draft' | 'Published';
}

const emptyQuestion = (id: number): Question => ({
  id,
  questionText: '',
  questionType: 'SHORT_ANSWER',
  marks: 10,
  correctAnswer: '',
  options: ['', '', '', ''],
});

const Assignments: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('Frontend Development');
  const [batch, setBatch] = useState('Batch A');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');

  const [questions, setQuestions] = useState<Question[]>([
    emptyQuestion(1),
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'React Fundamentals',
      course: 'Frontend Development',
      batch: 'Batch A',
      dueDate: '2026-07-20',
      totalQuestions: 2,
      totalMarks: 20,
      status: 'Published',
    },
  ]);

  const addQuestion = () => {
    const nextId =
      questions.length === 0
        ? 1
        : Math.max(...questions.map((question) => question.id)) + 1;

    setQuestions([...questions, emptyQuestion(nextId)]);
  };

  const removeQuestion = (questionId: number) => {
    if (questions.length === 1) {
      window.alert('At least one question is required.');
      return;
    }

    setQuestions(
      questions.filter((question) => question.id !== questionId),
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
          ? { ...question, [field]: value }
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

        const options = [...question.options];
        options[optionIndex] = value;

        return { ...question, options };
      }),
    );
  };

  const totalMarks = questions.reduce(
    (total, question) => total + Number(question.marks || 0),
    0,
  );

  const saveAssignment = (status: Assignment['status']) => {
    if (!title.trim() || !dueDate) {
      window.alert('Enter title and due date.');
      return;
    }

    if (
      questions.some(
        (question) => !question.questionText.trim(),
      )
    ) {
      window.alert('Enter text for every question.');
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now(),
      title,
      course,
      batch,
      dueDate,
      totalQuestions: questions.length,
      totalMarks,
      status,
    };

    setAssignments([newAssignment, ...assignments]);

    setTitle('');
    setDueDate('');
    setInstructions('');
    setQuestions([emptyQuestion(1)]);
    setShowForm(false);

    window.alert(
      status === 'Published'
        ? 'Assignment published.'
        : 'Assignment saved as draft.',
    );
  };

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Assignments
          </h1>

          <p className="mt-1 text-gray-500">
            Create assignment questions inside the LMS
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          {showForm ? 'Close Form' : 'Create Assignment'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">
            Assignment Information
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Assignment title"
              className="rounded-lg border border-gray-300 px-4 py-2"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2"
            />

            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              <option>Frontend Development</option>
              <option>Java Full Stack</option>
              <option>Database Development</option>
            </select>

            <select
              value={batch}
              onChange={(event) => setBatch(event.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              <option>Batch A</option>
              <option>Batch B</option>
              <option>Batch C</option>
            </select>

            <textarea
              value={instructions}
              onChange={(event) =>
                setInstructions(event.target.value)
              }
              placeholder="Assignment instructions"
              rows={3}
              className="rounded-lg border border-gray-300 px-4 py-2 md:col-span-2"
            />
          </div>

          <div className="my-6 border-t" />

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Questions
              </h2>

              <p className="text-sm text-gray-500">
                {questions.length} questions • {totalMarks} marks
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="rounded-lg border border-blue-300 px-4 py-2 text-blue-600 hover:bg-blue-50"
            >
              Add Question
            </button>
          </div>

          <div className="space-y-5">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="mb-4 flex justify-between">
                  <h3 className="font-semibold text-gray-800">
                    Question {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <textarea
                  value={question.questionText}
                  onChange={(event) =>
                    updateQuestion(
                      question.id,
                      'questionText',
                      event.target.value,
                    )
                  }
                  placeholder="Type the question"
                  rows={3}
                  className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <select
                    value={question.questionType}
                    onChange={(event) =>
                      updateQuestion(
                        question.id,
                        'questionType',
                        event.target.value as QuestionType,
                      )
                    }
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                  >
                    <option value="MULTIPLE_CHOICE">
                      Multiple Choice
                    </option>
                    <option value="TRUE_FALSE">True / False</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                    <option value="LONG_ANSWER">Long Answer</option>
                  </select>

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
                    placeholder="Marks"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                  />
                </div>

                {question.questionType === 'MULTIPLE_CHOICE' && (
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {question.options.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        value={option}
                        onChange={(event) =>
                          updateOption(
                            question.id,
                            optionIndex,
                            event.target.value,
                          )
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                      />
                    ))}
                  </div>
                )}

                {question.questionType === 'TRUE_FALSE' ? (
                  <select
                    value={question.correctAnswer}
                    onChange={(event) =>
                      updateQuestion(
                        question.id,
                        'correctAnswer',
                        event.target.value,
                      )
                    }
                    className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2"
                  >
                    <option value="">Select correct answer</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                ) : (
                  <textarea
                    value={question.correctAnswer}
                    onChange={(event) =>
                      updateQuestion(
                        question.id,
                        'correctAnswer',
                        event.target.value,
                      )
                    }
                    placeholder="Correct answer or evaluation criteria"
                    rows={3}
                    className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => saveAssignment('Draft')}
              className="flex items-center gap-2 rounded-lg border px-5 py-2"
            >
              <Save size={17} />
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => saveAssignment('Published')}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white"
            >
              <Send size={17} />
              Publish
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Course</th>
              <th className="px-6 py-3 text-left">Batch</th>
              <th className="px-6 py-3 text-left">Questions</th>
              <th className="px-6 py-3 text-left">Marks</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 font-medium">
                  {assignment.title}
                </td>
                <td className="px-6 py-4">{assignment.course}</td>
                <td className="px-6 py-4">{assignment.batch}</td>
                <td className="px-6 py-4">
                  {assignment.totalQuestions}
                </td>
                <td className="px-6 py-4">
                  {assignment.totalMarks}
                </td>
                <td className="px-6 py-4">
                  {assignment.status}
                </td>
                <td className="flex gap-2 px-6 py-4">
                  <Eye size={17} />
                  <Edit size={17} />
                  <Trash2 size={17} className="text-red-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;