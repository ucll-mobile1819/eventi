import { StyleSheet } from 'react-native';

const iconStyles = StyleSheet.create({
    style: {
        color: 'white',
        paddingRight: 14,
    }
});

const headerStyles = {
    iconProps: {
        size: 28,
        style: iconStyles.style
    }
};

export default headerStyles;