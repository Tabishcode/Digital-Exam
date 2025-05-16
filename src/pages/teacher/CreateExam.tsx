import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext'; // Import the AuthContext

// Question types
type QuestionType = 'multiple-choice' | 'essay';

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: number;
  points: number;
}

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Exam details state
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examDuration, setExamDuration] = useState('60');
  const [examInstructions, setExamInstructions] = useState('');

  // Security settings
  const [enableFaceDetection, setEnableFaceDetection] = useState(true);
  const [enableEyeTracking, setEnableEyeTracking] = useState(true);
  const [enableAudioMonitoring, setEnableAudioMonitoring] = useState(true);
  const [enableTabSwitchDetection, setEnableTabSwitchDetection] = useState(true);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: 'multiple-choice',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
    },
  ]);

  // Current form section
  const [currentSection, setCurrentSection] = useState<'details' | 'security' | 'questions'>('details');

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add a new question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type: 'multiple-choice',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
    };

    setQuestions([...questions, newQuestion]);
  };

  // Remove a question
  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // Update question text
  const updateQuestionText = (id: number, text: string) => {
    setQuestions(
      questions.map(q => (q.id === id ? { ...q, text } : q))
    );
  };

  // Update question type
  const updateQuestionType = (id: number, type: QuestionType) => {
    setQuestions(
      questions.map(q => {
        if (q.id === id) {
          if (type === 'multiple-choice') {
            return {
              ...q,
              type,
              options: q.options || ['', '', '', ''],
              correctAnswer: 0,
            };
          } else {
            return {
              ...q,
              type,
              options: undefined,
              correctAnswer: undefined,
            };
          }
        }
        return q;
      })
    );
  };

  // Update option text
  const updateOptionText = (questionId: number, optionIndex: number, text: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = text;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  // Update correct answer
  const updateCorrectAnswer = (questionId: number, correctAnswer: number) => {
    setQuestions(
      questions.map(q => (q.id === questionId ? { ...q, correctAnswer } : q))
    );
  };

  // Update question points
  const updateQuestionPoints = (id: number, points: number) => {
    setQuestions(
      questions.map(q => (q.id === id ? { ...q, points } : q))
    );
  };

  // Add option to a multiple-choice question
  const addOption = (questionId: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId && q.options) {
          return { ...q, options: [...q.options, ''] };
        }
        return q;
      })
    );
  };

  // Remove option from a multiple-choice question
  const removeOption = (questionId: number, optionIndex: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId && q.options && q.options.length > 2) {
          const newOptions = [...q.options];
          newOptions.splice(optionIndex, 1);

          // Adjust correct answer if needed
          let newCorrectAnswer = q.correctAnswer;
          if (q.correctAnswer !== undefined) {
            if (optionIndex === q.correctAnswer) {
              newCorrectAnswer = 0;
            } else if (optionIndex < q.correctAnswer) {
              newCorrectAnswer = q.correctAnswer - 1;
            }
          }

          return {
            ...q,
            options: newOptions,
            correctAnswer: newCorrectAnswer,
          };
        }
        return q;
      })
    );
  };

  // Validate the current section
  const validateSection = (section: 'details' | 'security' | 'questions'): boolean => {
    const newErrors: Record<string, string> = {};

    if (section === 'details') {
      if (!examTitle.trim()) newErrors.examTitle = 'Exam title is required';
      if (!examDate) newErrors.examDate = 'Exam date is required';
      if (!examTime) newErrors.examTime = 'Exam time is required';
      if (!examDuration) newErrors.examDuration = 'Exam duration is required';
      else if (parseInt(examDuration) <= 0) newErrors.examDuration = 'Duration must be greater than 0';
    }

    if (section === 'questions') {
      questions.forEach((question, index) => {
        if (!question.text.trim()) {
          newErrors[`question_${question.id}_text`] = `Question ${index + 1} text is required`;
        }

        if (question.type === 'multiple-choice' && question.options) {
          question.options.forEach((option, optIndex) => {
            if (!option.trim()) {
              newErrors[`question_${question.id}_option_${optIndex}`] = `Option ${optIndex + 1} is required`;
            }
          });
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle section navigation
  const goToNextSection = () => {
    if (currentSection === 'details') {
      if (validateSection('details')) {
        setCurrentSection('security');
      }
    } else if (currentSection === 'security') {
      setCurrentSection('questions');
    }
  };

  const goToPreviousSection = () => {
    if (currentSection === 'security') {
      setCurrentSection('details');
    } else if (currentSection === 'questions') {
      setCurrentSection('security');
    }
  };

  // Submit the exam
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSection(currentSection)) {
      return;
    }

    setIsSubmitting(true);

    const startTime = `${examDate}T${examTime}`;
    const endTime = new Date(new Date(startTime).getTime() + parseInt(examDuration) * 60000).toISOString();

    const payload = {
      title: examTitle,
      startTime,
      endTime,
      questions: questions.map((q) => ({
        text: q.text,
        options: q.options,
        correctAnswer: q.options?.[q.correctAnswer || 0],
      })),
    };
    console.log('Payload:', payload);
    
    try {
      const token = user?.token;
      console.log('Token:', token);
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowSuccess(true);
        alert("Course Created Succesfully!");
        // Redirect after a brief delay
        setTimeout(() => {
          navigate('/teacher');
        }, 2000);
      } else {
        console.error('Failed to create exam');
        alert('Failed to create exam. Please try again.');
        const errorData = await response.json();
        console.error('Error details:', errorData);
        setErrors({ form: 'Failed to create exam. Please check your input.' });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Exam
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set up a new secure online exam with AI monitoring
            </p>
          </div>

          {/* Success message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-start">
              <CheckCircle size={20} className="text-success mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-success">Exam Created Successfully</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                  Your exam has been created and scheduled. Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Form steps navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px" aria-label="Tabs">
                <button
                  onClick={() => validateSection(currentSection) && setCurrentSection('details')}
                  className={`mr-1 py-4 px-1 border-b-2 font-medium text-sm ${currentSection === 'details'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                    }`}
                >
                  1. Exam Details
                </button>

                <button
                  onClick={() => validateSection('details') && setCurrentSection('security')}
                  className={`mr-1 py-4 px-1 border-b-2 font-medium text-sm ${currentSection === 'security'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                    }`}
                >
                  2. Security Settings
                </button>

                <button
                  onClick={() => validateSection('security') && setCurrentSection('questions')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${currentSection === 'questions'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                    }`}
                >
                  3. Questions
                </button>
              </nav>
            </div>
          </div>

          {/* Main form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg overflow-hidden mb-6">
              {/* Exam Details Section */}
              {currentSection === 'details' && (
                <div className="p-6">
                  <div className="mb-6">
                    <label htmlFor="examTitle" className="label">
                      Exam Title
                    </label>
                    <input
                      type="text"
                      id="examTitle"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      className={`input ${errors.examTitle ? 'border-error' : ''}`}
                      placeholder="e.g., Introduction to Psychology Final Exam"
                    />
                    {errors.examTitle && (
                      <p className="mt-1 text-sm text-error">{errors.examTitle}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="examDate" className="label">
                        Exam Date
                      </label>
                      <input
                        type="date"
                        id="examDate"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className={`input ${errors.examDate ? 'border-error' : ''}`}
                      />
                      {errors.examDate && (
                        <p className="mt-1 text-sm text-error">{errors.examDate}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="examTime" className="label">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="examTime"
                        value={examTime}
                        onChange={(e) => setExamTime(e.target.value)}
                        className={`input ${errors.examTime ? 'border-error' : ''}`}
                      />
                      {errors.examTime && (
                        <p className="mt-1 text-sm text-error">{errors.examTime}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="examDuration" className="label">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      id="examDuration"
                      value={examDuration}
                      onChange={(e) => setExamDuration(e.target.value)}
                      className={`input ${errors.examDuration ? 'border-error' : ''}`}
                      min="1"
                    />
                    {errors.examDuration && (
                      <p className="mt-1 text-sm text-error">{errors.examDuration}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="examInstructions" className="label">
                      Instructions for Students
                    </label>
                    <textarea
                      id="examInstructions"
                      value={examInstructions}
                      onChange={(e) => setExamInstructions(e.target.value)}
                      className="input"
                      rows={5}
                      placeholder="Enter any specific instructions for students taking this exam..."
                    />
                  </div>
                </div>
              )}

              {/* Security Settings Section */}
              {currentSection === 'security' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      AI Monitoring Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Configure how SecureExam will monitor students during the exam to prevent cheating.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="faceDetection"
                            type="checkbox"
                            checked={enableFaceDetection}
                            onChange={() => setEnableFaceDetection(!enableFaceDetection)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="faceDetection" className="font-medium text-gray-700 dark:text-gray-300">
                            Face Detection
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Continuously monitors student faces to ensure they are present and looking at the screen.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="eyeTracking"
                            type="checkbox"
                            checked={enableEyeTracking}
                            onChange={() => setEnableEyeTracking(!enableEyeTracking)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="eyeTracking" className="font-medium text-gray-700 dark:text-gray-300">
                            Eye Movement Analysis
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Detects suspicious eye movements that may indicate the student is looking at unauthorized materials.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="audioMonitoring"
                            type="checkbox"
                            checked={enableAudioMonitoring}
                            onChange={() => setEnableAudioMonitoring(!enableAudioMonitoring)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="audioMonitoring" className="font-medium text-gray-700 dark:text-gray-300">
                            Audio Detection
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Analyzes audio to detect conversations or other sounds that may indicate collaboration.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="tabSwitching"
                            type="checkbox"
                            checked={enableTabSwitchDetection}
                            onChange={() => setEnableTabSwitchDetection(!enableTabSwitchDetection)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="tabSwitching" className="font-medium text-gray-700 dark:text-gray-300">
                            Tab Switching Detection
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Flags when students switch to other tabs or applications during the exam.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle size={20} className="text-warning mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-warning">Important Information</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          Students will be required to complete face verification before starting the exam.
                          All AI monitoring features will be visible to students during the exam, and they will
                          receive warnings for suspicious behavior. You will be able to review all flagged incidents after the exam.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Section */}
              {currentSection === 'questions' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Exam Questions
                    </h3>

                    <button
                      type="button"
                      onClick={addQuestion}
                      className="btn btn-outline flex items-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-8">
                    {questions.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 dark:bg-slate-700 p-5 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white">
                            Question {index + 1}
                          </h4>

                          <button
                            type="button"
                            onClick={() => removeQuestion(question.id)}
                            disabled={questions.length === 1}
                            className={`p-2 text-gray-500 hover:text-error rounded-md transition-colors ${questions.length === 1 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="md:col-span-3">
                            <label htmlFor={`question-${question.id}-type`} className="label">
                              Question Type
                            </label>
                            <select
                              id={`question-${question.id}-type`}
                              value={question.type}
                              onChange={(e) => updateQuestionType(question.id, e.target.value as QuestionType)}
                              className="input"
                            >
                              <option value="multiple-choice">Multiple Choice</option>
                              <option value="essay">Essay</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor={`question-${question.id}-points`} className="label">
                              Points
                            </label>
                            <input
                              type="number"
                              id={`question-${question.id}-points`}
                              value={question.points}
                              onChange={(e) => updateQuestionPoints(question.id, parseInt(e.target.value))}
                              className="input"
                              min="1"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor={`question-${question.id}-text`} className="label">
                            Question Text
                          </label>
                          <textarea
                            id={`question-${question.id}-text`}
                            value={question.text}
                            onChange={(e) => updateQuestionText(question.id, e.target.value)}
                            className={`input ${errors[`question_${question.id}_text`] ? 'border-error' : ''}`}
                            rows={3}
                            placeholder="Enter your question here..."
                          />
                          {errors[`question_${question.id}_text`] && (
                            <p className="mt-1 text-sm text-error">{errors[`question_${question.id}_text`]}</p>
                          )}
                        </div>

                        {question.type === 'multiple-choice' && question.options && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="label">Answer Options</label>

                              <button
                                type="button"
                                onClick={() => addOption(question.id)}
                                className="text-sm text-primary hover:text-primary/80 flex items-center"
                              >
                                <Plus size={14} className="mr-1" />
                                Add Option
                              </button>
                            </div>

                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center mb-3">
                                <div className="mr-3">
                                  <input
                                    type="radio"
                                    id={`question-${question.id}-correct-${optionIndex}`}
                                    name={`question-${question.id}-correct`}
                                    checked={question.correctAnswer === optionIndex}
                                    onChange={() => updateCorrectAnswer(question.id, optionIndex)}
                                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                  />
                                </div>

                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOptionText(question.id, optionIndex, e.target.value)}
                                    className={`input ${errors[`question_${question.id}_option_${optionIndex}`] ? 'border-error' : ''}`}
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  {errors[`question_${question.id}_option_${optionIndex}`] && (
                                    <p className="mt-1 text-sm text-error">{errors[`question_${question.id}_option_${optionIndex}`]}</p>
                                  )}
                                </div>

                                {question.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOption(question.id, optionIndex)}
                                    className="ml-2 p-2 text-gray-500 hover:text-error rounded-md transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="p-6 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                {currentSection !== 'details' ? (
                  <button
                    type="button"
                    onClick={goToPreviousSection}
                    className="btn btn-outline"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentSection !== 'questions' ? (
                  <button
                    type="button"
                    onClick={goToNextSection}
                    className="btn btn-primary"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Exam...' : 'Create Exam'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateExam;