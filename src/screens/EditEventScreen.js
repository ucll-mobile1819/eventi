import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { fetchEvent , putEvent} from '../actions/EventActions';

class EditEventScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    getClearedState() {
        return {
            showActivityIndicator: true
        };
    }

    putEvent(){
        //COMING
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    onLoad() {
        let id = this.props.navigation.state.params.id;
        this.props.fetchEvent(id)
            .then(()=>{
                let event = this.props.events.find(e => e.id === this.props.navigation.state.params.id);
                this.updateState({
                    event: event,
                    showActivityIndicator: false,
                })
                this.props.navigation.setParams({
                    title: "Edit " + this.state.event.name,
                    customHeaderBackgroundColor: this.state.event.group.color,
                    headerTintColor: 'white', // Back arrow color
                    headerTitleStyle: { color: 'white' }, // Title color
                });
        })
    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <Text>hi</Text>
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
        events: state.event.events,
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        fetchEvent , putEvent}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EditEventScreen);