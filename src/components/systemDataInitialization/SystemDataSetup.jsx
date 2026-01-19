import { useEffect, useState } from "react";
import InputField from "../inputField/InputField";
import DropdownField from "../inputField/DropdownField";
import { getCurrencies } from "../../functions/dropdowns";
import { useToast } from "../useToast";
import {
  initializeSystemData,
  loadSystemInfoToLocalStorage,
} from "../../functions/systemSettings";
import { useNavigate } from "react-router-dom";
import { setUserAssignedStores } from "../../functions/store";
import { FaBuilding, FaCashRegister, FaGlobe, FaSpinner } from "react-icons/fa";
import {
  getCountries,
  getLanguages,
  getTimezones,
} from "../../functions/dropdownOperational";

const SystemDataSetup = () => {
  // ────────────────────────────────────────────────
  //  Form field states
  // ────────────────────────────────────────────────
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
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [city, setCity] = useState({
    label: "City",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [province, setProvince] = useState({
    label: "Province / State",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [emailAddress, setEmailAddress] = useState({
    label: "Email Address",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [tel1, setTel1] = useState({
    label: "Telephone 1",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [tel2, setTel2] = useState({
    label: "Telephone 2",
    value: "",
    isTouched: false,
    isValid: true,
    rules: { required: false, dataType: "string" },
  });





  // Dropdown options
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [timeZoneOptions, setTimeZoneOptions] = useState([]);
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [languagesOptions, setLanguagesOptions] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = useToast();
  const navigate = useNavigate();

  const userinfo = JSON.parse(localStorage.getItem("user") || "{}");

  // ────────────────────────────────────────────────
  //  Load previously saved values
  // ────────────────────────────────────────────────
  useEffect(() => {
    const systemInfoStr = localStorage.getItem("systemInit_SystemInfoData");
    const companyInfoStr = localStorage.getItem("systemInit_Company");

    if (systemInfoStr) {
      const data = JSON.parse(systemInfoStr);
      setCurrencyId((prev) => ({ ...prev, value: data?.currencyId || "" }));
      setTimeZoneId((prev) => ({ ...prev, value: data?.timeZoneId || "" }));
      setCountryId((prev) => ({ ...prev, value: data?.countryId || "" }));
      setLanguageId((prev) => ({ ...prev, value: data?.languageId || "" }));
    }

    if (companyInfoStr) {
      const data = JSON.parse(companyInfoStr);
      setCompanyName((prev) => ({ ...prev, value: data?.companyName || "" }));
    }
  }, []);

  // ────────────────────────────────────────────────
  //  Load dropdown data once on mount
  // ────────────────────────────────────────────────
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [currRes, tzRes, countryRes, langRes] = await Promise.all([
          getCurrencies(),
          getTimezones(),
          getCountries(),
          getLanguages(),
        ]);

        setCurrencyOptions(currRes?.data?.results?.[0] || currRes?.data || []);
        setTimeZoneOptions(tzRes?.data || []);
        setCountriesOptions(countryRes?.data || []);
        setLanguagesOptions(langRes?.data || []);
      } catch (err) {
        console.error("Failed to load dropdown options:", err);
        showToast("danger", "Error", "Could not load some options. Please refresh.");
      }
    };

    loadDropdowns();
  }, []);

  // ────────────────────────────────────────────────
  //  Handlers
  // ────────────────────────────────────────────────
  const handleInputChange = (setter, field, value) => {
    setter({
      ...field,
      value,
      isTouched: true,
      isValid: field.rules?.required ? !!value?.trim() : true,
    });
  };

  const showError = (field) =>
    field.isTouched && !field.isValid ? (
      <span className="text-red-600 text-xs mt-1 block font-medium">
        This field is required
      </span>
    ) : null;

  const onSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side check
    const requiredFields = [
      companyName,
      storeName,
      terminalName,
      address,
      city,
      province,
      emailAddress,
      tel1,
      currencyId,
      timeZoneId,
      countryId,
      languageId,
    ];

    const hasError = requiredFields.some((f) => !f.isValid);
    const f = requiredFields.find((f) => !f.isValid);
    if (hasError) {
      console.log('f',f)
      showToast("warning", "Incomplete", "Please fill all required fields.");
      return;
    }

    const selectedTz = timeZoneOptions.find(
      (t) => t.id === parseInt(timeZoneId.value)
    );

    if (!selectedTz) {
      showToast("warning", "Invalid", "Selected time zone not found.");
      return;
    }

    const payload = {

      storeName: storeName.value.trim(),
      terminalName: terminalName.value.trim(),
      currencyId: currencyId.value,
 
      timeZoneId: timeZoneId.value,
           utcOffset: selectedTz.utcOffsetMinutes,

        countryCode:countryId.value,
    countryName:countriesOptions.find(c=>c.id===countryId.value).displayName,

      languageId: languageId.value,
      companyName: companyName.value.trim(),
      address: address.value.trim(),
      city: city.value.trim(),
      province: province.value.trim(),
      emailAddress: emailAddress.value.trim(),
      tel1: tel1.value.trim(),
      tel2: tel2.value.trim()

    };

    setIsSubmitting(true);

    try {
      const res = await initializeSystemData(payload);

      if (res?.data?.error) {
        showToast("danger", "Error", res.data.error.message || "Operation failed");
        return;
      }

      const { outputMessage, responseStatus } = res.data.outputValues || {};

      if (responseStatus === "failed") {
        showToast("warning", "Failed", outputMessage || "Setup could not be completed");
      } else {
        showToast("success", "Success", outputMessage || "System initialized successfully");
        await setUserAssignedStores(userinfo?.userId);
        await loadSystemInfoToLocalStorage();
        setTimeout(() => navigate("/home"), 900);
      }
    } catch (err) {
      console.error("Initialization error:", err);
      showToast("danger", "Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ────────────────────────────────────────────────
  //  Render
  // ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50/70 py-10 px-5 sm:px-6 lg:px-8">
      <div className="mx-auto w-full px-40">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10 tracking-tight">
          System Initialization
        </h1>

        <form onSubmit={onSubmit} className="space-y-10">
          {/* Company & Branch */}
          <section className="bg-white rounded-2xl  border border-gray-200/60 overflow-hidden transition-shadow hover:shadow-md">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <FaBuilding className="text-sky-600 text-2xl" />
                Company & Branch Details
              </h2>
            </div>

            <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <InputField
                label={companyName.label}
                value={companyName.value}
                required
                onChange={(e) => handleInputChange(setCompanyName, companyName, e.target.value)}
                placeholder="Company name"
                validationMessages={showError(companyName)}
              />
              


    <div className="sm:col-span-2 lg:col-span-1"> {/* Adjusted grid span for layout balance */}
      <InputField
        label={storeName.label}
        value={storeName.value}
        required
        onChange={(e) => handleInputChange(setStoreName, storeName, e.target.value)}
        placeholder="Branch / Store name"
        validationMessages={showError(storeName)}
      />
    </div>

   {/* <div className="sm:col-span-2 lg:col-span-3">
<InputField
      label={businessDescription.label}
      value={businessDescription.value}
      
      onChange={(e) => handleInputChange(setBusinessDescription, businessDescription, e.target.value)}
      placeholder="Briefly tell us about your business"
      validationMessages={showError(businessDescription)}
      max={100}
    />
</div> */}

              <div className="sm:col-span-2 lg:col-span-2">
                <InputField
                  label={address.label}
                  value={address.value}
                  required
                  onChange={(e) => handleInputChange(setAddress, address, e.target.value)}
                  placeholder="Full street address"
                  validationMessages={showError(address)}
                />
              </div>

  
              <InputField
                label={city.label}
                value={city.value}
                required
                onChange={(e) => handleInputChange(setCity, city, e.target.value)}
                placeholder="City"
                validationMessages={showError(city)}
              />

              <InputField
                label={province.label}
                value={province.value}
                required
                onChange={(e) => handleInputChange(setProvince, province, e.target.value)}
                placeholder="Province / State"
                validationMessages={showError(province)}
              />

              <InputField
                label={emailAddress.label}
                value={emailAddress.value}
                required
                type="email"
                onChange={(e) => handleInputChange(setEmailAddress, emailAddress, e.target.value)}
                placeholder="example@company.com"
                validationMessages={showError(emailAddress)}
              />

              <InputField
                label={tel1.label}
                value={tel1.value}
                required
                type="tel"
                onChange={(e) => handleInputChange(setTel1, tel1, e.target.value)}
                placeholder="+94 11 234 5678"
                validationMessages={showError(tel1)}
              />

              <InputField
                label={tel2.label}
                value={tel2.value}
                type="tel"
                onChange={(e) => handleInputChange(setTel2, tel2, e.target.value)}
                placeholder="Optional second number"
                validationMessages={showError(tel2)}
              />
            </div>
          </section>

          {/* POS Terminal */}
          <section className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden transition-shadow hover:shadow-md">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <FaCashRegister className="text-sky-600 text-2xl" />
                POS Terminal
              </h2>
            </div>

            <div className="grid grid-cols-3">
            <div className="p-6">
              <InputField
                label={terminalName.label}
                value={terminalName.value}
                required
                onChange={(e) => handleInputChange(setTerminalName, terminalName, e.target.value)}
                placeholder="Terminal / Cash register identifier"
                validationMessages={showError(terminalName)}
              />
            </div>
            </div>
          </section>

          {/* Localization */}
          <section className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden transition-shadow hover:shadow-md">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <FaGlobe className="text-sky-600 text-2xl" />
                Localization Settings
              </h2>
            </div>

            <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <DropdownField
                label={currencyId.label}
                value={currencyId.value}
                required
                onChange={(e) => handleInputChange(setCurrencyId, currencyId, e.target.value)}
                options={currencyOptions}
                placeholder="Select currency"
              />

              <DropdownField
                label={timeZoneId.label}
                value={timeZoneId.value}
                required
                onChange={(e) => handleInputChange(setTimeZoneId, timeZoneId, e.target.value)}
                options={timeZoneOptions}
                placeholder="Select time zone"
              />

              <DropdownField
                label={countryId.label}
                value={countryId.value}
                required
                onChange={(e) => handleInputChange(setCountryId, countryId, e.target.value)}
                options={countriesOptions}
                placeholder="Select country"
              />

              <DropdownField
                label={languageId.label}
                value={languageId.value}
                required
                onChange={(e) => handleInputChange(setLanguageId, languageId, e.target.value)}
                options={languagesOptions}
                placeholder="Select primary language"
              />
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-center pt-8 pb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                flex items-center justify-center gap-2.5
                min-w-[220px] px-10 py-3.5
                font-semibold text-white text-lg
                rounded-xl shadow-lg
                transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-sky-300/40
                ${
                  isSubmitting
                    ? "bg-sky-700 cursor-wait"
                    : "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin text-xl" />
                  Initializing...
                </>
              ) : (
                "Complete Setup"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemDataSetup;