import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import { Content } from 'native-base';

class EditEventScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    getClearedState() {
        return {
            showActivityIndicator: true,
            eventId: undefined,
            type: '',
            name: '',
            locationName: '',
            address: '',
            description: '',
            groupId: undefined,
            startTime: null,
            endTime: null,


        };
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    onLoad() {

    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} showActivityIndicator={() => this.state.showActivityIndicator} navigate={this.props.navigation.navigate} onLoad={this.onLoad.bind(this)}>
                <Container>
                    <Content padder>
                        <Form style={{ marginLeft: 15, marginRight: 15 }}>
                            {this.isFieldInError('name') && <Text style={{ color: 'red', marginLeft: 15 }}>{this.getErrorsInField('name')[0]}</Text>}
                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Name</Label>
                                <Input  
                                    value={this.state.name} 
                                    onChangeText={name => this.updateState({ name })} 
                                />
                            </Item>

                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Location Name</Label>
                                <Input 
                                    value={this.state.locationName}
                                    onChangeText={locationName => this.updateState({ locationName })} 
                                />
                            </Item>

                            <Item floatingLabel style={{ marginLeft: 0 }}>
                                <Label>Address</Label>
                                <Input
                                    value={this.state.address} 
                                    onChangeText={address => this.updateState({ address })} 
                                />
                            </Item>

                            <Textarea
                                rowSpan={5}
                                bordered
                                placeholder="Description"
                                style={{ width: undefined, marginTop: 20 }}
                                value={this.state.description}
                                onChangeText={description => this.updateState({ description })} />

                            <View style={{ paddingTop: 20 }}>
                                {this.state.type === 'poll' &&
                                    <View style={{ marginBottom: 20 }}>
                                        <H3 style={{ marginBottom: 20 }}>Poll</H3>

                                        {/* <PollTableComponent/> */}
                                    </View>
                                }
                                
                                {this.state.type === 'event' &&
                                    <View>
                                        <H3 style={{ marginBottom: 20 }}>Event: Start time & end time</H3>
                                        {this.isFieldInError('startTime') && <Text style={{ color: 'red' }}>{this.getErrorsInField('startTime')[0]}</Text>}
                                        <DatePickerComponent
                                            style={{ width: 250, marginBottom: 20 }}
                                            placeholder="Start Time"
                                            mode="datetime"
                                            minDate={new Date()}
                                            maxDate={this.state.endTime || new Date(Date.now() + 500 * 365 * 24 * 60 * 60 * 1000)}
                                            onDateChange={startTime => {
                                                this.updateState({ startTime });
                                            }}
                                            date={this.state.startTime}
                                        />
                                        {this.isFieldInError('endTime') && <Text style={{ color: 'red' }}>{this.getErrorsInField('endTime')[0]}</Text>}
                                        <DatePickerComponent
                                            style={{ width: 250, marginBottom: 20 }}
                                            placeholder="End Time"
                                            mode="datetime"
                                            minDate={this.state.startTime || new Date()}
                                            maxDate={new Date(Date.now() + 500 * 365 * 24 * 60 * 60 * 1000)}
                                            onDateChange={endTime => {
                                                this.updateState({ endTime });
                                            }}
                                            date={this.state.endTime}
                                        />
                                    </View>
                                }
                            </View>
                        </Form>
                    </Content>
                </Container>
            </AuthenticatedComponent>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(EditEventScreen);