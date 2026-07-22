import { createTheme } from "@mantine/core";
import primaryColor from "./colors/primary.color";

const mainTheme = createTheme({
    colors: {
        primary: primaryColor
    },
    primaryColor: 'primary'
})

export default mainTheme