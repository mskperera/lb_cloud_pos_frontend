import React, { forwardRef, useImperativeHandle } from 'react';

const ChildComponent = forwardRef((props, ref) => {
  const someFunction = () => {
    console.log('Function in ChildComponent called');
    // ...function logic
  };

  useImperativeHandle(ref, () => ({
    someFunction
  }));

  return (
    <div>
      {/* Child component content */}
    </div>
  );
});
ChildComponent.displayName='ChildComponent';
export default ChildComponent;
