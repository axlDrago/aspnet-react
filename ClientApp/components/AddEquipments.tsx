import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, FormControl, FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import 'isomorphic-fetch';

interface EquipmentsData {
    valueInput: string;
    equipments: Equipments[];
    idSelectEquipments: string;
}

interface Equipments {
    id: string;
    name: string;
}


export class AddEquipments extends React.Component<RouteComponentProps<{}>, EquipmentsData> {
    constructor() {
        super();

        this.state = { valueInput: '', equipments: [], idSelectEquipments: '#' };

        this.handlerSubmit = this.handlerSubmit.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
        this.handlerDelete = this.handlerDelete.bind(this);
        this.handlerSelect = this.handlerSelect.bind(this);

        fetch('api/Equipments/', { method: 'GET' })
            .then(response => response.json() as Promise<Equipments[]>)
            .then(data => {
                this.setState({ equipments : data});
            });
    }

    handlerChange(event: any) {
        this.setState({ valueInput: event.target.value });
    }

    handlerSubmit() {
        fetch('api/Equipments/', {
            method: 'POST', body: JSON.stringify({
                name: this.state.valueInput
            }), headers: { 'content-type': 'application/json' }
        }).then(response => {
            this.componentWillReceiveProps();
            alert("Success!");
        }).catch(response => alert("err!"));
    }

    handlerDelete(event: any) {
        fetch('api/Equipments/' + this.state.idSelectEquipments, { method: 'DELETE' })
            .then(response => response.json() as Promise<Equipments[]>)
            .then(data => {
                this.componentWillReceiveProps();
                alert("Success!");
            }).catch(response => alert("err!"));
    }

    handlerSelect(event: any) {
        this.setState({ idSelectEquipments: event.target.value});
    }


    componentWillReceiveProps() {
        fetch('api/Equipments/', { method: 'GET' })
            .then(response => response.json() as Promise<Equipments[]>)
            .then(data => {
                this.setState({ equipments: data });
            });

    }

    public render() {

        return <div>
            <h1>Add a Equipment to the database</h1>
            {this.renderEquipTable()}
            <h1> Remove a Equipment from the database</h1>
            { this.renderDeleteBuilds() }
        </div>;    
    }

    renderEquipTable() {
        return (
            <form>
                <FormGroup controlId="formBasicText">
                    <ControlLabel>Create new Equipments to the database:</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="New Equipments name"
                        onChange={this.handlerChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Enter the name of the Equipments</HelpBlock>
                </FormGroup>
                <Button bsStyle="success" bsSize="large" type="button" className='center-block' onClick={this.handlerSubmit}>
                    <span className='glyphicon glyphicon-ok'></span> Add Equipment
                </Button>
            </form>
        );
    }

    renderDeleteBuilds() {
        return (
            <form>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select a Equipments to remove</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onChange={this.handlerSelect} >
                        {this.state.equipments.map(e =>
                            <option key={e.id} value={e.id}>{e.name}</option>
                        )}
                    </FormControl>
                </FormGroup>
                <Button bsStyle="success" bsSize="large" type="button" className='center-block' onClick={this.handlerDelete}>
                    <span className='glyphicon glyphicon-ok'></span> Delete Equipment
                </Button>
            </form>
        )
    }
}