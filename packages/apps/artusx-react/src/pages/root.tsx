import React, { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { useMeasure } from '../hooks/useMeasure';
import ReloadPrompt from '../components/ReloadPrompt';
import Side from '../components/Side';

const Root: React.FC<React.PropsWithChildren<{}>> = () => {
  const navigation = useNavigation();

  useMeasure('rootMeasure', 'react.root', 'root.render');

  useEffect(() => {
    console.log('navigation', navigation, navigation.state, navigation.location);
  }, [navigation]);

  return (
    <div className="layout">
      <div className="side">
        <Side />
      </div>

      <div className="main">
        <Outlet />
      </div>

      <ReloadPrompt />
    </div>
  );
};

export default Root;
