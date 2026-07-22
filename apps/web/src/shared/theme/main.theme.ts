import { createTheme } from "@mantine/core";
import primaryColor from "./colors/primary.color";

const mainTheme = createTheme({
    fontFamily: 'DM Sans, sans-serif',
    colors: {
        primary: primaryColor
    },
    primaryColor: 'primary'
})

export default mainTheme