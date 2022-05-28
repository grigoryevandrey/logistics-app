import { createTheme } from '@mui/material/styles';

// Create a Material-UI theme instance
// https://mui.com/customization/theming/
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#9EEAF9',
//     },
//     secondary: {
//       main: '#9575CD',
//     },
//     background: {
//       default: '#2C2E3B',
//     },
//   },
// typography: {
//   fontWeightMedium: 600,
//   fontSize: 17,
//   h1: {
//     fontSize: '2.2rem',
//     fontWeight: 400,
//     color: '#9EEAF9',
//   },
//   body1: {
//     color: '#9EEAF9',
//   },
// },
// });

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // html: {
        //   fontSize: '62.5%',
        // },
        body: {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          height: '100%',
          // fontSize: '1.6rem',
        },
      },
    },
  },
});

export default theme;
