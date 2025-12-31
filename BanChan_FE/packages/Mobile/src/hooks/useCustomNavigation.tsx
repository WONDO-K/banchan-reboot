import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const useCustomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    setPreviousPath(location.pathname);
  }, [location]);

  const goBack = () => {
    if (previousPath === '/m/community/notice/list' || previousPath === '/m/vote/voteList') {
      navigate(-2);
    } else {
      navigate(-1);
    }
  };

  return { goBack };
};

export default useCustomNavigation;