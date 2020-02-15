import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, FormControl, FormGroup, HelpBlock, ControlLabel, PageHeader } from 'react-bootstrap';
import 'isomorphic-fetch';
import { Component } from 'react';

interface EquipmentsData {
    equipments: Equip[];
    allEquip: AllEquip[];
    loading: boolean;
    value: string;
}

interface Equip {
    id: string;
    equipments: {id:string, name: string };
    rooms: { id: string, name: string };
    buildings: { id: string, name: string };
    count: number;
}

interface AllEquip {
    id: string;
    name: string;
}

export class Equipments extends React.Component<RouteComponentProps<{}>, EquipmentsData> {
    
    constructor() {
        super();
        this.state = { equipments: [], allEquip: [], loading: true, value: '' };
        let c = String(window.location).split('/');
        let x = c[c.length - 1];

        fetch('api/Associations/' + x)
            .then(response => response.json() as Promise<Equip[]>)
            .then(data => {
                this.setState({ equipments: data, loading: false });
            });

        fetch('api/Equipments')
            .then(response => response.json() as Promise<AllEquip[]>)
            .then(data =>
                this.setState({ allEquip: data })
        );

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillReceiveProps() {
        let c = String(window.location).split('/');
        let x = c[c.length - 1];       

        fetch('api/Associations/' + x)
            .then(response => response.json() as Promise<Equip[]>)
            .then(data => {
                this.setState({ equipments: data, loading: false });
            });
    }

    handleDelete(event:any) {
        fetch('api/Associations/' + event.target.id, {method: 'DELETE'})
        .then(response => response.json() as Promise<Equip[]>)
            .then(data => {
                this.componentWillReceiveProps();
            });
    }

    handleSubmit(event: any) {
        event.preventDefault();
        if (this.state.value === '') {
            alert('Choose equipment!')
        } else {
            fetch('api/Associations', {
                method: 'POST', body: JSON.stringify({
                    Count: 1,
                    BuildingsId: this.state.equipments[0].buildings.id,
                    RoomsId: this.state.equipments[0].rooms.id,
                    EquipmentsId: this.state.value
                }), headers: { 'content-type': 'application/json' }
            })
                .then(response => response.json() as Promise<Equip[]>)
                .then(data => {
                    this.setState({ value: '' })
                    this.componentWillReceiveProps();
                });
        }
    }

    handleChange(event:any) {
        this.setState({ value: event.target.value });
    }

    count(e: React.MouseEvent<Button>, id: string) {
        fetch('api/Associations/' + id, { method: 'PUT' })
            .then(response => response.json() as Promise<Equip[]>)
            .then(data => {
                this.componentWillReceiveProps();                 
            });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderEquipTable(this.state.equipments);

        return <div>
            <h1>Equipment in the room</h1>
            <p>Control equipment in the room.</p>
            {contents}
            <h1>Add equipment to the room</h1>
            {this.renderAddEquip()}
        </div>;    
    }

    renderAddEquip() {
        var equipments = this.state.equipments;
        return (            
            <form>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select Equip</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onClick={this.handleChange} >
                        {this.state.allEquip.map(allEq => {
                            var err = false;
                            equipments.map(eq => {
                                if (allEq.name === eq.equipments.name) {
                                    err = true;
                                }
                            })
                                if (err === false) {
                                  return < option key={allEq.id} value={allEq.id} > {allEq.name}</option>;
                                }
                            })
                        }
                    </FormControl>
                </FormGroup>
                <Button bsStyle="success" bsSize="large" type="button" className='center-block' onClick={this.handleSubmit}>
                    <span className='glyphicon glyphicon-ok'></span> Add Equipment
                </Button>
            </form>
        )
    }

    renderEquipTable(equipments: Equip[]) {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Name Room</th>
                    <th>Name equipment</th>
                    <th>Count</th>
                    <th>Controls</th>
                </tr>
            </thead>
            <tbody>
                {equipments.map(eq => {
                    var id = eq.buildings.id + '_' + eq.rooms.id + '_' + eq.equipments.id;
                    return <tr key={eq.id} >
                        <td>
                            {eq.rooms.name}
                        </td>
                        <td>
                            {eq.equipments.name}
                        </td>
                        <td>
                            {eq.count}
                        </td>
                        <td>
                            <Button onClick={e => this.count(e, ('up_' + id))}>
                                <span className='glyphicon glyphicon-plus-sign'></span>
                            </Button>
                            <Button onClick={e => this.count(e, ('down_' + id))}>
                                <span className='glyphicon glyphicon-minus-sign'></span>
                            </Button>
                            <Button id={eq.id} onClick={this.handleDelete}>
                                <span id={eq.id} className='glyphicon glyphicon-trash'></span>
                            </Button>
                        </td>
                    </tr>
                }
                )}
            </tbody>
        </table>;
    }
}