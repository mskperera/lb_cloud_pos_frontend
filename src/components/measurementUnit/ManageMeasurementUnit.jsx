import React, { useEffect, useState } from 'react';
import { addMeasurementUnit, updateMeasurementUnit } from '../../functions/measurementUnit';
import { useToast } from '../useToast';
import InputField from '../inputField/InputField';
import FormElementMessage from '../messges/FormElementMessage';


const ManageMeasurementUnit = ({loadItems, measurementUnitToEdit ,isManageModalOpen}) => {
    const [measurementUnitName, setMeasurementUnitName] = useState('');
  
    const [isSubmitting, setIsSubmitting] = useState(false);


useEffect(()=>{
  if(measurementUnitToEdit){
setMeasurementUnitName(measurementUnitToEdit?.measurementUnitName);
  }
  else {
    setMeasurementUnitName('');
  }
},[measurementUnitToEdit])

    const showToast = useToast();

    const onSubmit = async () => {
        const payLoad = {
            measurementUnitName: measurementUnitName,
        };

        setIsSubmitting(true);

        try {
            let res;
            if (!measurementUnitToEdit) {
                res = await addMeasurementUnit(payLoad);
            } else {
                res = await updateMeasurementUnit(measurementUnitToEdit?.measurementUnitId, payLoad);
            }

            if (res.data.error) {
                setIsSubmitting(false);
                showToast('danger', 'Exception', res.data.error.message);
                return;
            }

            const { outputMessage, responseStatus } = res.data.outputValues;
            if (responseStatus === 'failed') {
                showToast('warning', 'Exception', outputMessage);
            } else {
              isManageModalOpen(false);
                showToast('success', 'Success', outputMessage);
                loadItems();
                setMeasurementUnitName('');
        
            }

        } catch (error) {
            console.error('Error submitting measurementUnitName:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


  const validationMessages = (state) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div>
          {state.validationMessages.map((message, index) => (
            <FormElementMessage key={index} severity="error" text={message} />
          ))}
        </div>
      )
    );
  };

    return (
        <div className='flex flex-col gap-5'>
            <InputField
           // label={}
            value={measurementUnitName}
            onChange={(e) => setMeasurementUnitName(e.target.value)}
            validationMessages={validationMessages(measurementUnitName)}
             placeholder="Enter Unit Name"
          />

                <button onClick={onSubmit} disabled={isSubmitting}   type="button"
                      className="btn btn-primary">
                    {!measurementUnitToEdit?.measurementUnitId ? 'Add' : 'Update'}
                </button>
         

        </div>
    );
};

export default ManageMeasurementUnit;
