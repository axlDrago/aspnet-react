import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, FormControl, FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import 'isomorphic-fetch';

interface EquipmentsData {
    valueInput: string;
    building: Building[];
    idSelectBuilding: string;
}

interface Building {
    id: string;
    name: string;
}


export class AddBuildings extends React.Component<RouteComponentProps<{}>, EquipmentsData> {
    constructor() {
        super();

        this.state = { valueInput: '', building: [], idSelectBuilding: '#' };

        this.handlerSubmit = this.handlerSubmit.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
        this.handlerDelete = this.handlerDelete.bind(this);
        this.handlerSelect = this.handlerSelect.bind(this);

        fetch('api/Builders/', { method: 'GET' })
            .then(response => response.json() as Promise<Building[]>)
            .then(data => {
                this.setState({ building : data});
            });
    }

    handlerChange(event: any) {
        this.setState({ valueInput: event.target.value });
    }

    handlerSubmit() {
        fetch('api/Builders/', {
            method: 'POST', body: JSON.stringify({
                name: this.state.valueInput
            }), headers: { 'content-type': 'application/json' }
        }).then(response => {
            this.componentWillReceiveProps();
            alert("Success!");
        }).catch(response => alert("err!"));
    }

    handlerDelete(event: any) {
        fetch('api/Builders/' + this.state.idSelectBuilding, { method: 'DELETE' })
            .then(response => response.json() as Promise<Building[]>)
            .then(data => {
                this.componentWillReceiveProps();
                alert("Success!");
            }).catch(response => alert("err!"));
    }

    handlerSelect(event: any) {
        this.setState({ idSelectBuilding: event.target.value});
    }


    componentWillReceiveProps() {
        fetch('api/Builders/', { method: 'GET' })
            .then(response => response.json() as Promise<Building[]>)
            .then(data => {
                this.setState({ building: data });
            });

    }

    public render() {

        return <div>
            <h1>Add a Building to the database</h1>
            {this.renderEquipTable()}
            <h1> Remove a Building from the database</h1>
            { this.renderDeleteBuilds() }
        </div>;    
    }

    renderEquipTable() {
        return (
            <form>
                <FormGroup controlId="formBasicText">
                    <ControlLabel>Create new Building to the database:</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="Building name"
                        onChange={this.handlerChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Enter the name of the Building</HelpBlock>
                </FormGroup>
                <Button bsStyle="success" bsSize="large" type="button" className='center-block' onClick={this.handlerSubmit}>
                    <span className='glyphicon glyphicon-ok'></span> Add Building
                </Button>
            </form>
        );
    }

    renderDeleteBuilds() {
        return (
            <form>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select a building to remove</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onChange={this.handlerSelect} >
                        {this.state.building.map(b =>
                            <option key={b.id} value={b.id}>{b.name}</option>
                        )}
                    </FormControl>
                </FormGroup>
                <Button bsStyle="success" bsSize="large" type="button" className='center-block' onClick={this.handlerDelete}>
                    <span className='glyphicon glyphicon-ok'></span> Delete Building
                </Button>
            </form>
        )
    }
}