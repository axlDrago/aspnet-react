import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Equipments } from './components/Equipments';
import { Buildings } from './components/Building';
import { AddBuildings } from './components/AddBuildings';
import { AddRoom } from './components/AddRoom';
import { AddEquipments } from './components/AddEquipments';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/fetchdata' component={ FetchData } />
    <Route path = '/equipments/' component={ Equipments } />
    <Route path= '/buildings' component={ Buildings } />
    <Route path='/addBuilding' component={ AddBuildings } />
    <Route path='/AddRoom' component={ AddRoom } />
    <Route path='/AddEquipments' component={AddEquipments } />
</Layout>;
