import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Если авторизация хранится в Redux

const PrivateRoute = ({ children }) => {
  // Получаем состояние авторизации, например, из Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Если не авторизован, перенаправляем на главную страницу ("/")
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
