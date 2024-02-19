import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom';

const PublicOnlyRoute = ({ children }) => {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicOnlyRoute