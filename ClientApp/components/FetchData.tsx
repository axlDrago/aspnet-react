import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';

interface FetchDataExampleState {
    builders: Builders[];
    loading: boolean;
}

export class FetchData extends React.Component<RouteComponentProps<{}>, FetchDataExampleState> {
    constructor() {
        super();
        this.state = { builders: [], loading: true };

        let c = String(window.location).split('/');
        let x = c[c.length - 1];

        fetch('api/Associations')
            .then(response => response.json() as Promise<Builders[]>)
            .then(data => {                
                this.setState({ builders: data, loading: false });
            });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchData.renderForecastsTable(this.state.builders);

        return <div>
            <h1>ALL Buildings, Rooms && Equipments</h1>
            <p>Table.</p>
            { contents }
        </div>;    
    }

    private static renderForecastsTable(forecasts: Builders[]) {

        return <table className='table'>
            <thead>
                <tr>
                    <th>Name Buildings</th>
                    <th>Name rooms</th>
                    <th>Name equipment</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(Builders =>
                    <tr key={Builders.id} >  
                        <td>
                            {Builders.buildings.name}
                        </td>
                        <td>
                            {Builders.rooms.name}
                        </td>
                        <td>
                            {Builders.equipments.name}
                        </td>
                        <td>
                            {Builders.count}
                        </td>
                    </tr>
                )}

            </tbody>
        </table>;
    }
}

interface Builders {
    id: number;
    name: string;
    count: number;
    equipments: { name: string};
    buildings: { name: string };
    rooms: { name: string };
}