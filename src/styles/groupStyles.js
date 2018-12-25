import { StyleSheet } from 'react-native';

const groupStyles = StyleSheet.create({
    container: {
        margin: 8,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'
    },
    overviewColor: {
        width: 20,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    memberCountContainer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        marginLeft: 10
    },
    memberCount: {
        fontSize: 15, 
        color: 'lightgrey'
    }
});

export default groupStyles;