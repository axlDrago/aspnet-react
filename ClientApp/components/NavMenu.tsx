import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Collapse, Button, Nav } from 'react-bootstrap';
import 'isomorphic-fetch';

interface FetchDataBuildings {
    navigation: Navigation[];
    buildings: Buildings[];
}

interface Navigation {
    id: string;
    buildings: {id: number, name: string };
    rooms: { id: number, name: string };
}

interface Buildings {
    id: number;
    name: string;
}

export class NavMenu extends React.Component<{}, FetchDataBuildings> {
    
    constructor() {        
        super();
        this.state = { navigation: [], buildings: [] };

        fetch('api/Builders')
            .then(response => response.json() as Promise<Buildings[]>)
            .then(data => {
                this.setState({ buildings: data });
            });

        fetch('api/Associations')
            .then(response => response.json() as Promise<Navigation[]>)
            .then(data => {
                this.setState({ navigation: data });
            });
    }    

    public render() {
        return <div className='main-nav'>
                <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}>All Buildings</Link>
                </div>
                <div className='clearfix'></div>
                {this.NavigationMenu()}
            </div>
        </div>;
    }

    NavigationMenu() {
        var room = Array();
        var nav = this.state.navigation.map(Navigation => Navigation);
        return <div className='navbar-collapse collapse'>
            <ul className='nav navbar-nav'>
                {this.state.buildings.map(Buildings => {
                    room = [];
                    return <li key={Buildings.id}>
                        <NavLink to={'/buildings/' + Buildings.id + '_0'} activeClassName='active' >
                            <span className='glyphicon glyphicon-home '></span>
                            {Buildings.name}
                        </NavLink>

                        <ul>
                            {nav.map(Rooms => {
                                if (Buildings.id === Rooms.buildings.id && room.lastIndexOf(Rooms.rooms.name) === -1) {
                                    room.push(Rooms.rooms.name);

                                    return <li key={Rooms.id} >
                                        <NavLink to={'/equipments/' + Buildings.id + '_' + Rooms.rooms.id} activeClassName='active' >
                                            <span className='glyphicon glyphicon-home'></span>
                                            {Rooms.rooms.name}
                                        </NavLink>
                                    </li>;
                                } 
                            })
                            }
                        </ul>
                    </li>
                })
                }
                <div className='navbar-collapse collapse'></div>
                <div className='clearfix'></div>
                <li>
                    <NavLink to={'/addBuilding'} activeClassName='active'>
                        <span className='glyphicon glyphicon-plus'></span> Add/Remove Building
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/addRoom'} activeClassName='active'>
                        <span className='glyphicon glyphicon-plus'></span> Add/Remove Room
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/addEquipments'} activeClassName='active'>
                        <span className='glyphicon glyphicon-plus'></span> Add/Remove Equipment
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/FetchData'} activeClassName='active'>
                        <span className='glyphicon glyphicon-list-alt'></span> ALL
                    </NavLink>
                </li>
            </ul>
        </div>
    }

 }