import { useNavigate, Link } from "react-router-dom";
import pos_logo_long from "../../assets/pos_logo_long.png";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null); // null | 'product' | 'legal'

  // Individual refs for each dropdown wrapper
  const productRef = useRef(null);
  const legalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only check the ref of the currently open dropdown
      if (openDropdown === 'product' && productRef.current && !productRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (openDropdown === 'legal' && legalRef.current && !legalRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]); // Re-attach when openDropdown changes

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setOpenDropdown(null); // Close dropdowns after navigation
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/#" className="flex items-center">
            <img src={pos_logo_long} alt="Legend POS" className="h-10" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
    
                        <Link to="/#" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
  Home
</Link>




                        <Link to="/#about" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
  About
</Link>

            {/* Product Dropdown */}
            <div className="relative" ref={productRef}>
              <button
                onClick={() => toggleDropdown('product')}
                className="text-gray-600 hover:text-sky-600 font-medium transition-colors flex items-center gap-1"
              >
                Product
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === 'product' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === 'product' && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">

           <Link to="/#features"          className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-600"
             >
  Features
</Link>


           <Link to="/#desktop"          className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-600"
             >
  Download Desktop App
</Link>
             
                </div>
              )}
            </div>

            {/* <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-600 hover:text-sky-600 font-medium transition-colors"
            >
              Pricing
            </button> */}
            <Link to="/pricing" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
  Pricing
</Link>



                                    <Link to="/#faq" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
  FAQ
</Link>

 <Link to="/#contact" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
  Contact
</Link>
 

            {/* Legal Dropdown */}
            <div className="relative" ref={legalRef}>
           
              <button
                onClick={() => toggleDropdown('legal')}
                className="text-gray-600 hover:text-sky-600 font-medium transition-colors flex items-center gap-1"
              >
                Legal
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === 'legal' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === 'legal' && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <Link
                    to="/terms"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-600"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-600"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/refund"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-600"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Refund Policy
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/signin" className="text-sky-600 hover:text-sky-800 font-medium px-4 py-2">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-sky-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-sky-700 transition-colors shadow-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;