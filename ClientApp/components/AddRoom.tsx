import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, FormControl, FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import 'isomorphic-fetch';

interface EquipmentsData {
    valueInput: string;
    rooms: Rooms[];
    idSelectRoom: string;
}

interface Rooms {
    id: string;
    name: string;
}


export class AddRoom extends React.Component<RouteComponentProps<{}>, EquipmentsData> {
    constructor() {
        super();

        this.state = { valueInput: '', rooms: [], idSelectRoom: '#' };

        this.handlerSubmit = this.handlerSubmit.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
        this.handlerDelete = this.handlerDelete.bind(this);
        this.handlerSelect = this.handlerSelect.bind(this);

        fetch('api/Rooms/', { method: 'GET' })
            .then(response => response.json() as Promise<Rooms[]>)
            .then(data => {
                this.setState({ rooms : data});
            });
    }

    handlerChange(event: any) {
        this.setState({ valueInput: event.target.value });
    }

    handlerSubmit() {
        fetch('api/Rooms/', {
            method: 'POST', body: JSON.stringify({
                name: this.state.valueInput
            }), headers: { 'content-type': 'application/json' }
        }).then(response => {
            this.componentWillReceiveProps();
            alert("Success!");
        }).catch(response => alert("err!"));
    }

    handlerDelete(event: any) {
        fetch('api/Rooms/' + this.state.idSelectRoom, { method: 'DELETE' })
            .then(response => response.json() as Promise<Rooms[]>)
            .then(data => {
                this.componentWillReceiveProps();
                alert("Success!");
            }).catch(response => alert("err!"));
    }

    handlerSelect(event: any) {
        this.setState({ idSelectRoom: event.target.value});
    }


    componentWillReceiveProps() {
        fetch('api/Rooms/', { method: 'GET' })
            .then(response => response.json() as Promise<Rooms[]>)
            .then(data => {
                this.setState({ rooms: data });
            });

    }

    public render() {

        return <div>
            <h1>Add a Room to the database</h1>
            {this.renderEquipTable()}
            <h1> Remove a Room from the database</h1>
            { this.renderDeleteBuilds() }
        </div>;    
    }

    renderEquipTable() {
        return (
            <form>
                <FormGroup controlId="formBasicText">
                    <ControlLabel>Create new Room to the database:</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="New Room name"
                        onChange={this.handlerChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Enter the name of the room</HelpBlock>
                </FormGroup>
                <Button bsStyle="success" bsSize="large" type="button" className='center-block' onClick={this.handlerSubmit}>
                    <span className='glyphicon glyphicon-ok'></span> Add Room
                </Button>
            </form>
        );
    }

    renderDeleteBuilds() {
        return (
            <form>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select a Room to remove</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onChange={this.handlerSelect} >
                        {this.state.rooms.map(r =>
                            <option key={r.id} value={r.id}>{r.name}</option>
                        )}
                    </FormControl>
                </FormGroup>
                <Button bsStyle="success" bsSize="large" type="button" className='center-block' onClick={this.handlerDelete}>
                    <span className='glyphicon glyphicon-ok'></span> Delete Room
                </Button>
            </form>
        )
    }
}