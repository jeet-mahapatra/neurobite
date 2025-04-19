import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import MoodEntry from './components/mood/MoodEntry';
import MoodInsights from './components/MoodInsights/MoodInsights';
import MoodHistory from './components/MoodInsights/MoodHistory';
import WellnessResources from './components/wellness/WellnessResources';
import TodoPage from './components/todo/TodoPage'; // Import the new TodoPage component
import ProductivityReportPage from './components/productivityReport/ProductivityReportPage';
import ProtectedLayout from './components/layout/ProtectedLayout';
import LandingPage from './components/LandingPage/LandingPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedLayout activePage="dashboard">
                <Dashboard />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/mood" 
            element={
              <ProtectedLayout activePage="mood">
                <MoodEntry />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/dashboard/insights" 
            element={
              <ProtectedLayout activePage="insights">
                <MoodInsights />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/mood/history" 
            element={
              <ProtectedLayout activePage="insights">
                <MoodHistory />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/wellness-resources" 
            element={
              <ProtectedLayout activePage="wellness">
                <WellnessResources />
              </ProtectedLayout>
            } 
          />
          {/* Add the new Todo route */}
          <Route 
            path="/todo" 
            element={
              <ProtectedLayout activePage="todo">
                <TodoPage />
              </ProtectedLayout>
            } 
          />
          {/* Add the new Productivity Report route */}
          <Route 
            path="/productivity-report" 
            element={
              <ProtectedLayout activePage="productivity">
                <ProductivityReportPage />
              </ProtectedLayout>
            } 
          />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;