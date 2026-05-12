import { useNavigate } from "react-router-dom";

export const ROUTES = {
  home: "/",
  loading: "/loading",
  results: "/results",
  edit: "/edit",
  submitted: "/submitted",
};

export function useNav() {
  const navigate = useNavigate();

  return {
    toHome: () => {
      console.log("Navigation: Moving to HOME");
      navigate(ROUTES.home);
    },
    toLoading: () => {
      console.log("Navigation: Moving to LOADING");
      navigate(ROUTES.loading);
    },
    toResults: () => {
      console.log("Navigation: Moving to RESULTS");
      navigate(ROUTES.results);
    },
    toEdit: () => {
      console.log("Navigation: Moving to EDIT");
      navigate(ROUTES.edit);
    },
    toSubmitted: () => {
      console.log("Navigation: Moving to SUBMITTED");
      navigate(ROUTES.submitted);
    },
  };
}
