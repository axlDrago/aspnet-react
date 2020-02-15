import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Hello, world!</h1>
            <p>Web application using react and c#. The application shows all the equipment in the organization.</p>
        </div>;
    }
}
