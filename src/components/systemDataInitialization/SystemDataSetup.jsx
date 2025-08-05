import { useEffect, useState } from "react";
import InputField from "../inputField/InputField";
import DropdownField from "../inputField/DropdownField";
import { getCountries, getCurrencies, getLanguages, getTimezones } from "../../functions/dropdowns";
import { useToast } from "../useToast";
import { getSystemInfo, initializeSystemData, loadSystemInfoToLocalStorage } from "../../functions/systemSettings";
import { useNavigate } from "react-router-dom";
import { setUserAssignedStores } from "../../functions/store";
import { faBuilding, faCashRegister, faGlobe} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const SystemDataSetup = () => {

   const systemInit_SystemInfoData=localStorage.getItem('systemInit_SystemInfoData') && JSON.parse(localStorage.getItem('systemInit_SystemInfoData'));
   const systemInit_Company=localStorage.getItem('systemInit_Company') && JSON.parse(localStorage.getItem('systemInit_Company'));
  
  // utcOffset,countryId,currencyId,primaryLanguageId,timeZoneId


  const [terminalName, setTerminalName] = useState({
    label: "Terminal Name",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });
  

  const [storeName, setStoreName] = useState({
    label: "Branch / Store Name",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [currencyId, setCurrencyId] = useState({
    label: "Currency",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  const [timeZoneId, setTimeZoneId] = useState({
    label: "Time Zone",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  const [countryId, setCountryId] = useState({
    label: "Country",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  const [languageId, setLanguageId] = useState({
    label: "Language",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  const [companyName, setCompanyName] = useState({
    label: "Company Name",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [address, setAddress] = useState({
    label: "Address",
    value: "",
    isTouched: false,
    isValid: true,
    rules: { required: true, dataType: "string" },
  });
  
  const [city, setCity] = useState({
    label: "City",
    value: "",
    isTouched: false,
    isValid: true,
    rules: { required: true, dataType: "string" },
  });
  
  const [province, setProvince] = useState({
    label: "Province",
    value: "",
    isTouched: false,
    isValid: true,
    rules: { required: true, dataType: "string" },
  });
  
  const [emailAddress, setEmailAddress] = useState({
    label: "Email Address",
    value: "",
    isTouched: false,
    isValid: true,
    rules: { required: true, dataType: "string" },
  });
  
  const [tel1, setTel1] = useState({
    label: "Telephone 1",
    value: "",
    isTouched: false,
    isValid: true,
    rules: { required: true, dataType: "string" },
  });
  
  const [tel2, setTel2] = useState({
    label: "Telephone 2",
    value: "",
    isTouched: false,
    isValid: true,
    rules: { required: true, dataType: "string" },
  });

  

    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [timeZoneOptions, setTimeZoneOptions] = useState([]);
    const [countriesOptions, setCountriesOptions] = useState([]);
    const [languagesOptions, setLanguagesOptions] = useState([]);


    useEffect(() => {
      if (systemInit_SystemInfoData) {
        setCurrencyId(prev => ({ ...prev,  value: systemInit_SystemInfoData?.currencyId }));
      }
      if (systemInit_SystemInfoData) {
        setTimeZoneId(prev => ({ ...prev, value: systemInit_SystemInfoData?.timeZoneId }));
      }
      if (systemInit_SystemInfoData) {
        setCountryId(prev => ({ ...prev,  value: systemInit_SystemInfoData?.countryId }));
      }
      if (systemInit_SystemInfoData) {
        setLanguageId(prev => ({ ...prev,  value: systemInit_SystemInfoData?.languageId }));
      }
      if (systemInit_Company) {
        setLanguageId(prev => ({ ...prev,    value: systemInit_Company?.companyName}));
      }
    }, []);

    
  const handleInputChange = (setter, field, value) => {
    setter({
      ...field,
      value,
      isTouched: true,
      isValid: field.rules.required ? value.trim() !== "" : true,
    });
  };

  const validationMessages = (field) => {
    if (field.isTouched && !field.isValid) {
      return <span className="text-red-500 text-sm">This field is required.</span>;
    }
    return null;
  };
  const showToast = useToast();
  const navigate = useNavigate();
    useEffect(() => {
      loadDrpCurrency();
      loadDrpTimezones();
      loadDrpCountries();
      loadDrpLanguages();
    }, [currencyId]);
  

     

    const loadDrpCurrency = async () => {
     const objArr = await getCurrencies();
      setCurrencyOptions(objArr.data.results[0]);
    };
  
    const loadDrpTimezones = async () => {
      const objArr = await getTimezones();
      console.log('timeZoneOptions',objArr.data.results[0])
      setTimeZoneOptions(objArr.data.results[0]);
     };
   
     const loadDrpCountries = async () => {
      const objArr = await getCountries();
      setCountriesOptions(objArr.data.results[0]);
     };

     const loadDrpLanguages = async () => {
      const objArr = await getLanguages();
      setLanguagesOptions(objArr.data.results[0]);
     };
     
     
      const [isSubmitting, setIsSubmitting] = useState(false);

      const userinfo=JSON.parse(localStorage.getItem('user'));


       const onSubmit = async (e) => {
         e.preventDefault();
        
const timeZoneselectd=timeZoneOptions.find(t=>t.id===parseInt(timeZoneId.value));

         try {
           const payLoad = {   
    userId:userinfo.userId,
    storeName:storeName.value,
    terminalName:terminalName.value,
    currencyId:currencyId.value,
    utcOffset:timeZoneselectd.utcOffsetMinutes,
    timeZoneId:timeZoneId.value,
    countryId:countryId.value,
    languageId:languageId.value,
    companyhName:companyName.value,

    address: address.value,
    city: city.value,
    province: province.value,
    emailAddress: emailAddress.value,
    tel1: tel1.value,
    tel2: tel2.value,

           };

           setIsSubmitting(true);
 
           const res = await initializeSystemData(payLoad);
             if (res.data.error) {
               const { error } = res.data;
     
               showToast("danger", "Exception", error.message);
               setIsSubmitting(false);
               return;
             }
     
             const { outputMessage, responseStatus } = res.data.outputValues;
             if (responseStatus === "failed") {
               showToast("warning", "Exception", outputMessage);
               setIsSubmitting(false);
             } else {
               showToast("success", "Success", outputMessage);
  
              await setUserAssignedStores(userinfo.userId);
                   navigate('/home');           
               // navigate(`/products/add?saveType=add`);
             }
            
             loadSystemInfoToLocalStorage();
             
           setIsSubmitting(false);
         } catch (error) {
           setIsSubmitting(false);
           console.error("payloadd", error);
         }
       };
     


       return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center py-12">
          <div className="w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 animate-fade-in">
              System Initialization
            </h2>
    
            {/* Company Details Section */}
            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
               <FontAwesomeIcon className="mr-2 text-sky-600" icon={faBuilding} /> Company Details
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InputField
                  label={companyName.label}
                  value={companyName.value}
                  required={companyName.rules.required}
                  onChange={(e) => handleInputChange(setCompanyName, companyName, e.target.value)}
                  type="text"
                  placeholder="Enter Company Name"
                  validationMessages={validationMessages(companyName)}
                />
    
       
    <div className="col-span-2">
                <InputField
                  label={address.label}
                  value={address.value}
                  required={address.rules.required}
                  onChange={(e) => handleInputChange(setAddress, address, e.target.value)}
                  type="text"
                  placeholder="Enter Address"
                  validationMessages={validationMessages(address)}
                />
    </div>

    <InputField
                  label={storeName.label}
                  value={storeName.value}
                  required={storeName.rules.required}
                  onChange={(e) => handleInputChange(setStoreName, storeName, e.target.value)}
                  type="text"
                  placeholder="Enter Branch/Store Name"
                  validationMessages={validationMessages(storeName)}
                />
    
                <InputField
                  label={city.label}
                  value={city.value}
                  required={city.rules.required}
                  onChange={(e) => handleInputChange(setCity, city, e.target.value)}
                  type="text"
                  placeholder="Enter City"
                  validationMessages={validationMessages(city)}
                />
    
                <InputField
                  label={province.label}
                  value={province.value}
                  required={province.rules.required}
                  onChange={(e) => handleInputChange(setProvince, province, e.target.value)}
                  type="text"
                  placeholder="Enter Province"
                  validationMessages={validationMessages(province)}
                />
    
                <InputField
                  label={emailAddress.label}
                  value={emailAddress.value}
                  required={emailAddress.rules.required}
                  onChange={(e) => handleInputChange(setEmailAddress, emailAddress, e.target.value)}
                  type="text"
                  placeholder="Enter Email Address"
                  validationMessages={validationMessages(emailAddress)}
                />
    
                <InputField
                  label={tel1.label}
                  value={tel1.value}
                  required={tel1.rules.required}
                  onChange={(e) => handleInputChange(setTel1, tel1, e.target.value)}
                  type="text"
                  placeholder="Enter Telephone 1"
                  validationMessages={validationMessages(tel1)}
                />
    
                <InputField
                  label={tel2.label}
                  value={tel2.value}
                  required={tel2.rules.required}
                  onChange={(e) => handleInputChange(setTel2, tel2, e.target.value)}
                  type="text"
                  placeholder="Enter Telephone 2"
                  validationMessages={validationMessages(tel2)}
                />
              </div>
            </div>
    
            {/* POS Terminal Details Section */}
            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FontAwesomeIcon className="mr-2 text-sky-600" icon={faCashRegister} /> POS Terminal Details
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InputField
                  label={terminalName.label}
                  value={terminalName.value}
                  required={terminalName.rules.required}
                  onChange={(e) => handleInputChange(setTerminalName, terminalName, e.target.value)}
                  type="text"
                  placeholder="Enter Terminal Name"
                  validationMessages={validationMessages(terminalName)}
                />
              </div>
            </div>
    
            {/* Localization Settings Section */}
            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FontAwesomeIcon className="mr-2 text-sky-600" icon={faGlobe} /> Localization Settings
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <DropdownField
                  id="currencyId"
                  label={currencyId.label}
                  value={currencyId.value}
                  required={currencyId.rules.required}
                  onChange={(e) => handleInputChange(setCurrencyId, currencyId, e.target.value)}
                  options={currencyOptions}
                  placeholder="Select Currency"
                />
    
                <DropdownField
                  id="timeZoneId"
                  label={timeZoneId.label}
                  value={timeZoneId.value}
                  required={timeZoneId.rules.required}
                  onChange={(e) => handleInputChange(setTimeZoneId, timeZoneId, e.target.value)}
                  options={timeZoneOptions}
                  placeholder="Select Time Zone"
                />
    
                <DropdownField
                  id="countryId"
                  label={countryId.label}
                  value={countryId.value}
                  required={countryId.rules.required}
                  onChange={(e) => handleInputChange(setCountryId, countryId, e.target.value)}
                  options={countriesOptions}
                  placeholder="Select Country"
                />
    
                <DropdownField
                  id="languageId"
                  label={languageId.label}
                  value={languageId.value}
                  required={languageId.rules.required}
                  onChange={(e) => handleInputChange(setLanguageId, languageId, e.target.value)}
                  options={languagesOptions}
                  placeholder="Select Language"
                />
              </div>
            </div>
    
            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                className="btn bg-blue-600 text-white w-40 hover:bg-blue-700 transition-all duration-300 shadow-md"
                disabled={isSubmitting}
                onClick={onSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      );
};

export default SystemDataSetup;
