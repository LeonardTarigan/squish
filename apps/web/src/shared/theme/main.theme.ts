import { Button, createTheme } from "@mantine/core";
import primaryColor from "./colors/primary.color";

const mainTheme = createTheme({
    fontFamily: 'DM Sans, sans-serif',
    colors: {
        primary: primaryColor
    },
    primaryColor: 'primary',
    white: '#FAF9F6',
    black: '#2B2B2B',
    components: {
        Button: Button.extend({
            defaultProps: {
                bdrs: 'lg'
            },
            styles: {
                root: {
                    cornerShape: 'squircle'
                }
            }
        })
    }
})

export default mainTheme