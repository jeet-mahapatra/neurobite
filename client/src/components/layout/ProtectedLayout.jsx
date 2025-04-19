import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const ProtectedLayout = ({ children, activePage = '' }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activePage={activePage} />
      <div className="flex-grow pt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;