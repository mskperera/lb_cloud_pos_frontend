// src/components/ScrollToHash.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // 👉 Scroll to element when hash exists
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 150);
      }
    } else {
      // 👉 No hash → scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // use "smooth" if you want animation
      });
    }
  }, [location.pathname, location.hash]);

  return null;
};

export default ScrollToHash;




// // src/components/ScrollToHash.jsx
// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const ScrollToHash = () => {
//   const location = useLocation();

//   useEffect(() => {
//     // Only act when there's a hash in the URL
//     if (location.hash) {
//       const id = location.hash.replace('#', '');
//       const element = document.getElementById(id);

//       if (element) {
//         // Give the page a tiny moment to render (especially important with Suspense + lazy components)
//         setTimeout(() => {
//           element.scrollIntoView({
//             behavior: 'smooth',
//             block: 'start',
//           });
//         }, 150); // 150–300 ms usually works well; adjust if needed
//       }
//     }
//   }, [location]); // Re-run when location (including hash) changes

//   return null; // Invisible utility component
// };

// export default ScrollToHash;