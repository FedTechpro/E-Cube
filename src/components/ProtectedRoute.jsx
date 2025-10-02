import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { RedirectContext } from "../context/RedirectContext";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const { setRedirectPath } = useContext(RedirectContext);

  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setRedirectPath(location.pathname);
      navigate("/login");
    }
  }, [user, loading, location.pathname, setRedirectPath]);

  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return <Outlet />;
};

export default ProtectedRoute;
