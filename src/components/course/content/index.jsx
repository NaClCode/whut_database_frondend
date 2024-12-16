import React, { useState } from 'react';
import CourseContentPlan from './plan';
import CourseContentClasser from './classer';
const CourseContent = () => {
  const [mode, setMode] = useState('plan');
  const [planID, setPlanID] = useState(0);

  return (
    <>
      {mode === 'plan' ? (
        <CourseContentPlan setMode={setMode} setPlanID={setPlanID}/>
      ) : (
        < CourseContentClasser setMode={setMode} classplanid={planID}/>
      )}
    </>
  );
};

export default CourseContent;
