export const MOCK_USERS = [
  { id: 1, name: 'Alex Johnson', username: 'alex', password: '123', role: 'student', email: 'alex@edu.com', avatar: 'AJ', color: '#4f46e5', enrolled: [1, 2] },
  { id: 2, name: 'Maria Chen', username: 'maria', password: '123', role: 'trainer', email: 'maria@edu.com', avatar: 'MC', color: '#06b6d4', courses: [1, 2, 3] },
  { id: 3, name: 'Admin User', username: 'admin', password: 'admin', role: 'admin', email: 'admin@edu.com', avatar: 'AD', color: '#10b981', courses: [] },
];

export const MOCK_COURSES = [
  { id: 1, title: 'UI/UX Design Masterclass', icon: '🎨', instructor: 'Maria Chen', category: 'Design', duration: '12 weeks', lessons: 8, enrolled: 34, progress: 75, rating: 4.8, description: 'Master Figma, user research, and modern design systems.' },
  { id: 2, title: 'Full Stack Development', icon: '💻', instructor: 'Maria Chen', category: 'Development', duration: '16 weeks', lessons: 12, enrolled: 28, progress: 40, rating: 4.9, description: 'React, Node.js, PostgreSQL — end to end.' },
  { id: 3, title: 'Data Science Fundamentals', icon: '📊', instructor: 'Maria Chen', category: 'Data', duration: '10 weeks', lessons: 10, enrolled: 19, progress: 0, rating: 4.6, description: 'Python, pandas, and machine learning basics.' },
  { id: 4, title: 'Cloud Architecture', icon: '☁️', instructor: 'Maria Chen', category: 'DevOps', duration: '8 weeks', lessons: 6, enrolled: 12, progress: 0, rating: 4.7, description: 'AWS, Docker, Kubernetes, and CI/CD pipelines.' },
];

export const MOCK_LESSONS = [
  { id: 1, courseId: 1, title: 'Introduction to UX', duration: '18 min', done: true },
  { id: 2, courseId: 1, title: 'Wireframing Techniques', duration: '24 min', done: true },
  { id: 3, courseId: 1, title: 'Color Theory', duration: '20 min', done: true },
  { id: 4, courseId: 1, title: 'Advanced Grid Layouts', duration: '31 min', done: false },
  { id: 5, courseId: 1, title: 'Prototyping in Figma', duration: '28 min', done: false },
  { id: 6, courseId: 2, title: 'React Fundamentals', duration: '35 min', done: true },
  { id: 7, courseId: 2, title: 'State Management', duration: '29 min', done: false },
  { id: 8, courseId: 2, title: 'Node.js & Express', duration: '40 min', done: false },
];

export const MOCK_ASSIGNMENTS = [
  { id: 1, courseId: 1, title: 'Wireframe Submission', due: '2024-02-10', status: 'graded', score: 88, feedback: 'Excellent layout structure!', submitted: true },
  { id: 2, courseId: 1, title: 'Color Palette Project', due: '2024-02-20', status: 'pending', score: null, feedback: null, submitted: true },
  { id: 3, courseId: 2, title: 'React Hooks Deep Dive', due: '2024-02-25', status: 'graded', score: 95, feedback: 'Outstanding!', submitted: true },
  { id: 4, courseId: 2, title: 'REST API Design', due: '2024-03-01', status: 'not_submitted', score: null, feedback: null, submitted: false },
  { id: 5, courseId: 1, title: 'Final Portfolio', due: '2024-03-15', status: 'not_submitted', score: null, feedback: null, submitted: false },
];

export const MOCK_ACTIVITY = [
  { text: 'Submitted: React Hooks Deep Dive', time: '2 hours ago', type: 'success' },
  { text: 'Completed: Color Theory lesson', time: 'Yesterday', type: 'info' },
  { text: 'Enrolled in: Full Stack Development', time: '3 days ago', type: 'purple' },
];

export const MOCK_STUDENTS = [
  { name: 'Alex Johnson', email: 'alex@edu.com', course: 'UI/UX Design Masterclass', progress: 75, status: 'Active' },
  { name: 'Sam Rivera', email: 'sam@edu.com', course: 'Full Stack Development', progress: 40, status: 'Active' },
  { name: 'Priya Patel', email: 'priya@edu.com', course: 'UI/UX Design Masterclass', progress: 90, status: 'Active' },
  { name: 'Tom Lee', email: 'tom@edu.com', course: 'Full Stack Development', progress: 15, status: 'Inactive' },
];
