//* mdi fonts and icons
import '@mdi/font/css/materialdesignicons.css';

//* vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

const vuetify = createVuetify({
    defaults: {
        VBtn: {
            class: 'text-none',
            rounded: '0'
        },
        VTextField: {
            variant: 'outlined',
            density: 'compact',
            rounded: '0'
        }
    },
});

export default vuetify;