import { StyleSheet } from 'react-native';

const iconStyles = StyleSheet.create({
    style: {
        color: 'white',
        paddingRight: 14,
    },
    style2: {
        color: 'white',
        paddingRight: 12,
    },
});

const headerStyles = {
    iconProps: {
        size: 28,
        style: iconStyles.style
    },
    iconProps2: {
        size: 32,
        style: iconStyles.style2
    },
};

export default headerStyles;