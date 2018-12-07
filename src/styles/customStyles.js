import { StyleSheet } from 'react-native';

const customStyles = StyleSheet.create({
    inputField: {
        borderWidth: 1,
        borderColor: 'gray',
        margin: 5,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        width: 300,
        height: 40
    },
    bigTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 40,
        textAlign: 'center',
        margin: 15
    },
    smallTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        margin: 15
    }
});

export { customStyles };