
module.exports = {
  //...
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors:{
        primaryColor: '#0284c7',
        primaryColorHover: '#0369a1',
        defalutTextColor: '#334155'
      }
    },
  },
  plugins: [
  //  require('@tailwindcss/forms'), // Example of adding a Tailwind plugin
 //   require('@tailwindcss/typography'), // Another example
    require('daisyui'), // Include DaisyUI if you're using it
  ],
  
}