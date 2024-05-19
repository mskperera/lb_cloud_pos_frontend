import { Message } from "primereact/message";
import React from 'react'
import PropTypes from 'prop-types';

function FormElementMessage({className,severity,text}) {
  return (
<Message className={className} severity={severity} text={text}/>
  )
}

FormElementMessage.propTypes={
  className: PropTypes.string, 
  severity:PropTypes.oneOf(['info','success','warn','error']).isRequired,
  text:PropTypes.string.isRequired
}
export default FormElementMessage
