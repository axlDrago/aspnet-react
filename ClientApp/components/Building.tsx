import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, FormControl, FormGroup, HelpBlock, ControlLabel, PageHeader } from 'react-bootstrap';
import 'isomorphic-fetch';
import { Component } from 'react';
import { Equipments } from './Equipments';

interface EquipmentsData {
    equipments: Equip[];
    allRoom: AllRoom[];
    allEquip: AllRoom[];
    loading: boolean;
    valueRoomId: string;
    valueEquipId: string;
}

interface Equip {
    id: string;
    equipments: {id:string, name: string };
    rooms: { id: string, name: string };
    buildings: { id: string, name: string };
    count: number;
}

interface AllRoom {
    id: string;
    name: string;
}

export class Buildings extends React.Component<RouteComponentProps<{}>, EquipmentsData> {
    
    constructor() {
        super();
        this.state = {
            equipments: [],
            allEquip: [],
            allRoom: [],
            loading: true,
            valueRoomId: '',
            valueEquipId: ''
        };
        let c = String(window.location).split('/');
        let x = c[c.length - 1];
        let buildingId = (x.split('_')[0]).toString();

        fetch('api/Associations/' + x)
            .then(response => response.json() as Promise<Equip[]>)
            .then(data => {
                if (data.length === 0) {
                    data.push({
                        id: "null", count: 0,
                        equipments: { id: "null", name: "null" },
                        buildings: { id: buildingId, name: "1" },
                        rooms: { id: "null", name: "null" }
                    });
                }
                this.setState({ equipments: data, loading: false });
            });

        fetch('api/Rooms')
            .then(response => response.json() as Promise<AllRoom[]>)
            .then(data =>
                this.setState({ allRoom: data })
        );

        fetch('api/Equipments')
            .then(response => response.json() as Promise<AllRoom[]>)
            .then(data =>
                this.setState({ allEquip: data })
            );

        this.handleChangeEquip = this.handleChangeEquip.bind(this);
        this.handleChangeRoom = this.handleChangeRoom.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillReceiveProps() {
        let c = String(window.location).split('/');
        let x = c[c.length - 1];
        let buildingId = (x.split('_')[0]).toString();

        fetch('api/Associations/' + x)
            .then(response => response.json() as Promise<Equip[]>)
            .then(data => {
                if (data.length === 0) {
                    data.push({
                        id: "null", count: 0,
                        equipments: { id: "null", name: "Room not added" },
                        buildings: { id: buildingId, name: "1" },
                        rooms: { id: "null", name: "Room not added" }
                    });
                }
                this.setState({ equipments: data, loading: false });
            });
    }

    handleDelete(event: any) {
        if (event.target.id !== 'null') {
            fetch('api/Associations/' + event.target.id, { method: 'DELETE' })
                .then(response => response.json() as Promise<Equip[]>)
                .then(data => {
                    this.componentWillReceiveProps();
                });
        } else {
            alert('No rooms in the building!');
        }
    }

    handleSubmit(event: any) {
        event.preventDefault();
        if (this.state.valueEquipId === '' || this.state.valueRoomId === '') {
            alert('Choose Room & Equipment!')
        } else {
            fetch('api/Associations', {
                method: 'POST', body: JSON.stringify({
                    Count: 1,
                    BuildingsId: this.state.equipments[0].buildings.id,
                    RoomsId: this.state.valueRoomId,
                    EquipmentsId: this.state.valueEquipId
                }), headers: { 'content-type': 'application/json' }
            })
                .then(response => response.json() as Promise<Equip[]>)
                .then(data => {
                    this.setState({ valueEquipId: '', valueRoomId: ''})
                    this.componentWillReceiveProps();
                });
        }
    }

    handleChangeRoom(event:any) {
        this.setState({ valueRoomId: event.target.value });
    }

    handleChangeEquip(event: any) {
        this.setState({ valueEquipId: event.target.value });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderEquipTable(this.state.equipments);

        return <div>
            <h1>Equipment in the building</h1>
            <p>Control equipment in the room.</p>
            {contents}
            <h1>Add Room to the Building</h1>
            {this.renderAddRoom()}
        </div>;    
    }

    renderAddRoom() {
        var equipments = this.state.equipments;
        return (            
            <form>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select Room</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onClick={this.handleChangeRoom} >
                        {this.state.allRoom.map(allRoom => {
                            var err = false;
                            equipments.map(eq => {
                                if (allRoom.name === eq.rooms.name) {
                                    err = true;
                                }
                            })
                                if (err === false) {
                                    return < option key={allRoom.id} value={allRoom.id} > {allRoom.name}</option>;
                                }
                            })
                        }
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="formControlsEquip">
                    <ControlLabel>Select Equipment</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onClick={this.handleChangeEquip} >
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
                    <span className='glyphicon glyphicon-ok'></span> Add Room
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