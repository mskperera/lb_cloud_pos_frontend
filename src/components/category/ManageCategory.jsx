import React, { useEffect, useState } from 'react';
import { addCategory, updateCategory } from '../../functions/category';
import { useToast } from '../useToast';
import InputField from '../inputField/InputField';
import FormElementMessage from '../messges/FormElementMessage';


const ManageCategory = ({loadItems, categoryToEdit ,isManageModalOpen}) => {
    const [categoryName, setCategoryName] = useState('');
  
    const [isSubmitting, setIsSubmitting] = useState(false);


useEffect(()=>{
  if(categoryToEdit){
setCategoryName(categoryToEdit?.categoryName);
  }
  else {
    setCategoryName('');
  }
},[categoryToEdit])

    const showToast = useToast();

    const onSubmit = async () => {
        const payLoad = {
            categoryName: categoryName,
        };

        setIsSubmitting(true);

        try {
            let res;
            if (!categoryToEdit) {
                res = await addCategory(payLoad);
            } else {
                res = await updateCategory(categoryToEdit?.categoryId, payLoad);
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
                setCategoryName('');
        
            }

        } catch (error) {
            console.error('Error submitting category:', error);
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
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            validationMessages={validationMessages(categoryName)}
             placeholder="Enter category name"
          />

                <button onClick={onSubmit} disabled={isSubmitting}   type="button"
                      className="btn btn-primary">
                    {!categoryToEdit?.categoryId ? 'Add' : 'Update'}
                </button>
         

        </div>
    );
};

export default ManageCategory;
