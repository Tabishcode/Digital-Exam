import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Flag, TableCellsMerge } from 'lucide-react';
import Header from '../../components/Header';
import AIMonitoringWidget from '../../components/AIMonitoringWidget';
import WebcamCapture from '../../components/WebcamCapture';
import { useAuth } from '../../contexts/AuthContext';

// Mock exam data
const mockExam = {
  id: '101',
  title: 'Introduction to Psychology',
  teacherId: 'T001',
  duration: 120, // minutes
  instructions: 'Answer all questions. Each question carries equal marks. Use the flag feature to mark questions for review.',
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      text: 'Which of the following is NOT a perspective in psychology?',
      options: [
        'Behavioral perspective',
        'Cognitive perspective',
        'Mathematical perspective',
        'Psychodynamic perspective',
      ],
      correctAnswer: 2,
    },
    {
      id: 2,
      type: 'multiple-choice',
      text: 'The study of how people think, learn, and remember is known as:',
      options: [
        'Cognitive psychology',
        'Developmental psychology',
        'Social psychology',
        'Clinical psychology',
      ],
      correctAnswer: 0,
    },
    {
      id: 3,
      type: 'multiple-choice',
      text: 'Sigmund Freud is most associated with which perspective?',
      options: [
        'Behavioral',
        'Cognitive',
        'Psychodynamic',
        'Humanistic',
      ],
      correctAnswer: 2,
    },
    {
      id: 4,
      type: 'essay',
      text: 'Explain the difference between classical and operant conditioning, providing examples of each.',
    },
    {
      id: 5,
      type: 'multiple-choice',
      text: 'Which brain structure is primarily responsible for regulating basic life functions like breathing and heart rate?',
      options: [
        'Cerebral cortex',
        'Limbic system',
        'Brainstem',
        'Cerebellum',
      ],
      correctAnswer: 2,
    },
  ],
};

const ExamRoom: React.FC = () => {
  const { user } = useAuth();
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(mockExam);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); // Convert minutes to seconds
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [currentWarning, setCurrentWarning] = useState('');
  
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = user?.token;
         
        const response = await fetch('/api/exams', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Find the exam with the matching examId
          const selectedExam = data.find((exam: any) => exam._id === examId);

          if (selectedExam) {
            // Map the API response to the required format
            const formattedExam = {
              id: selectedExam._id,
              teacherId: selectedExam.teacherId,
              title: selectedExam.title,
              duration: Math.round(
                (new Date(selectedExam.endTime).getTime() -
                  new Date(selectedExam.startTime).getTime()) /
                60000
              ), // Calculate duration in minutes
              instructions:
                'Answer all questions. Each question carries equal marks. Use the flag feature to mark questions for review.',
              questions: selectedExam.questions.map((q: any, index: number) => ({
                id: index + 1,
                type: 'multiple-choice', // Assuming all questions are multiple-choice
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer, // Include correctAnswer for validation
              })),
            };

            setExam(formattedExam);
            setTimeLeft(formattedExam.duration); // Set the timer
          } else {
            console.error('Exam not found');
            navigate('/404'); // Redirect to a 404 page if exam not found
          }
        } else {
          console.error('Failed to fetch exams');
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    };

    fetchExam();
  }, [examId, navigate]);




  // Initialize timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle answer changes
  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
  // Toggle flagged question
  const toggleFlaggedQuestion = (questionId: number) => {
    setFlaggedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };
  
  // Navigate to next/previous question
  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (direction === 'next' && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Submit exam
  // Submit exam
  const handleSubmitExam = async () => {
    try {
      if (!exam) {
        console.error('No exam data available');
        return;
      }

      const token = user?.token;

      // Prepare the payload
      const payload = {
        examId: exam.id,
        teacherId: exam.teacherId, // Assuming teacherId is part of the exam data
        questions: exam.questions.map((question: any) => ({
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
          selectedAnswer: question.type === 'multiple-choice' ? question.options[answers[question.id]] : answers[question.id],
        })),
      };

      console.log('Submitting exam with payload:', payload); // Debug log

      // Send the payload to the server
      const response = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Exam submitted successfully:', result);
        alert('Exam submitted successfully!');
        navigate(`/exam-complete/${exam.id}`);
      } else {
        console.error('Failed to submit exam:', response);
        navigate(`/exam-complete/${exam.id}`);

        // alert('Failed to submit exam. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('An error occurred while submitting the exam. Please try again.');
    }
  };
  
  // Simulate AI warnings (for demonstration)
  useEffect(() => {
    const warnings = [
      'Looking away from screen detected',
      'Multiple faces detected in camera',
      'Tab switching detected',
      'Unusual audio detected',
      'Face not visible',
    ];
    
    const showRandomWarning = () => {
      const shouldShowWarning = Math.random() < 0.3; // 30% chance
      
      if (shouldShowWarning) {
        const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
        setCurrentWarning(randomWarning);
        setShowWarning(true);
        setWarningCount(prev => prev + 1);
        
        setTimeout(() => {
          setShowWarning(false);
        }, 5000);
      }
    };
    
    const warningInterval = setInterval(showRandomWarning, 20000);
    return () => clearInterval(warningInterval);
  }, []);
  
  const currentQuestion = exam.questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Exam header */}
          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {exam.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center">
                <Clock size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
              
              <AIMonitoringWidget compact />
              
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="btn btn-primary whitespace-nowrap"
              >
                Submit Exam
              </button>
            </div>
          </div>
          
          {/* Warning notification */}
          {showWarning && (
            <div className="fixed top-20 right-4 w-80 bg-warning/90 text-white p-4 rounded-md shadow-lg z-50 animate-pulse">
              <div className="flex items-start">
                <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Security Warning</p>
                  <p className="text-sm mt-1">{currentWarning}</p>
                  <p className="text-xs mt-2">This incident has been recorded.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* AI monitoring sidebar */}
            <div className="order-2 md:order-1 md:col-span-1">
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-base font-medium text-gray-900 dark:text-white">
                    Exam Monitoring
                  </h2>
                </div>
                
                <div className="p-4">
                  <AIMonitoringWidget />
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Webcam Feed</h3>
                    <WebcamCapture width={250} height={180} showControls={false} />
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Security Warnings</h3>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Warning Count
                        </span>
                        <span className={`font-medium ${warningCount > 0 ? 'text-warning' : 'text-success'}`}>
                          {warningCount}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Question Navigation</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {exam.questions.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`w-full aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                            currentQuestionIndex === index 
                              ? 'bg-primary text-white' 
                              : flaggedQuestions.includes(index + 1)
                                ? 'bg-warning/10 text-warning border border-warning/30' 
                                : answers[index + 1] !== undefined
                                  ? 'bg-success/10 text-success border border-success/30'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main question area */}
            <div className="order-1 md:order-2 md:col-span-3">
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Question {currentQuestionIndex + 1}
                    </h2>
                    
                    <button
                      onClick={() => toggleFlaggedQuestion(currentQuestionIndex + 1)}
                      className={`p-2 rounded-md flex items-center text-sm ${
                        flaggedQuestions.includes(currentQuestionIndex + 1)
                          ? 'bg-warning/10 text-warning'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Flag size={16} className="mr-1" />
                      {flaggedQuestions.includes(currentQuestionIndex + 1) ? 'Flagged' : 'Flag for review'}
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-800 dark:text-gray-200 text-lg mb-6">
                      {currentQuestion.text}
                    </p>
                    
                    {currentQuestion.type === 'multiple-choice' && (
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="radio"
                              id={`question-${currentQuestion.id}-option-${index}`}
                              name={`question-${currentQuestion.id}`}
                              value={index}
                              checked={answers[currentQuestion.id] === index}
                              onChange={() => handleAnswerChange(currentQuestion.id, index)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                            />
                            <label
                              htmlFor={`question-${currentQuestion.id}-option-${index}`}
                              className="ml-3 block text-gray-700 dark:text-gray-300"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {currentQuestion.type === 'essay' && (
                      <textarea
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        rows={10}
                        className="input"
                        placeholder="Type your answer here..."
                      />
                    )}
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => navigateQuestion('prev')}
                      disabled={currentQuestionIndex === 0}
                      className={`btn btn-outline flex items-center ${
                        currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Previous
                    </button>
                    
                    <button
                      onClick={() => navigateQuestion('next')}
                      disabled={currentQuestionIndex === exam.questions.length - 1}
                      className={`btn btn-primary flex items-center ${
                        currentQuestionIndex === exam.questions.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Confirm submission modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <AlertTriangle size={40} className="mx-auto text-warning mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Confirm Exam Submission
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to submit your exam? This action cannot be undone.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Questions Answered:</span>
                <span className="font-medium">{Object.keys(answers).length} of {exam.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Flagged for Review:</span>
                <span className="font-medium">{flaggedQuestions.length}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row-reverse sm:space-x-reverse sm:space-x-3">
              <button
                onClick={handleSubmitExam}
                className="btn btn-primary mb-3 sm:mb-0"
              >
                <CheckCircle size={16} className="mr-2" />
                Submit Exam
              </button>
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="btn btn-outline"
              >
                Continue Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamRoom;