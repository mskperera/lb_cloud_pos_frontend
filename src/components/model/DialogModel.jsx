import { Dialog } from 'primereact/dialog'
import React from 'react'

function DialogModel(props) {
  return (
    <Dialog
    {...props}
  >
    {props.children}
</Dialog>
  )
}

export default DialogModel