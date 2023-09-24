import { createTheme } from '@mui/material/styles'
import { Colors } from './Colors'

export const Theme = createTheme({
    palette: {
        primary: {
            main: Colors.primaryText
        },
        secondary: {
            main: Colors.secondaryText
        },
        background: {
            default: Colors.softPink
        }
    },
    typography: {
        fontFamily: [
            'Montserrat',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h1: {
            [`@media screen and (max-width: 800px)`]: {
                fontSize: '4.5rem',
              },
              [`@media screen and (max-width: 500px)`]: {
                fontSize: '2.75rem',
              },
        },
        h2: {
            [`@media screen and (max-width: 800px)`]: {
                fontSize: '3.5rem',
              },
              [`@media screen and (max-width: 500px)`]: {
                fontSize: '2.25rem',
              },
        },
        h3: {
            [`@media screen and (max-width: 800px)`]: {
                fontSize: '2.5rem',
              },
              [`@media screen and (max-width: 500px)`]: {
                fontSize: '1.75rem',
              },
        },
        h4: {
            [`@media screen and (max-width: 800px)`]: {
                fontSize: '1.5rem',
              },
              [`@media screen and (max-width: 500px)`]: {
                fontSize: '1.25rem',
              },
        },
        h5: {
          [`@media screen and (max-width: 800px)`]: {
              fontSize: '1.15rem',
            },
            [`@media screen and (max-width: 500px)`]: {
              fontSize: '1rem',
            },
      }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
            @font-face {
              font-family: 'Montserrat';
              font-style: normal;
              font-display: swap;
              font-weight: 400;
              unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }
          `,
        },
    },
})