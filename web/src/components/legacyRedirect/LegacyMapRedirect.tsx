import { Navigate, useLocation } from "react-router-dom";
import { LEGACY_MAP_PREFIX, ROUTES } from "../../constants/routes";

export default function LegacyMapRedirect() {
  const { pathname, search, state } = useLocation();
  const target = pathname.slice(LEGACY_MAP_PREFIX.length) || ROUTES.map;
  return <Navigate to={`${target}${search}`} state={state} replace />;
}
