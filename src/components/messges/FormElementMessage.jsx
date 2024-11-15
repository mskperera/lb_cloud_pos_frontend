
import React from 'react'
import PropTypes from 'prop-types';
import DaisyMessage from "../daisyUIMessage/DaisyMessage";

function FormElementMessage({className,severity,text}) {
  return (
<DaisyMessage className={className} severity={severity} text={text}/>
  )
}

FormElementMessage.propTypes={
  className: PropTypes.string, 
  severity:PropTypes.oneOf(['info','success','warn','error']).isRequired,
  text:PropTypes.string.isRequired
}
export default FormElementMessage
