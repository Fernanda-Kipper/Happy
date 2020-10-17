import React from 'react';
import { BrowserRouter,Switch, Route } from 'react-router-dom';

import Landing from './Pages/Landing'
import OrphanagesMap from './Pages/OrphanagesMap'
import Orphanage from './Pages/Orphanage'
import CreateOrphanages from './Pages/CreateOrphanage'

function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Landing}/>
                <Route path='/app' component={OrphanagesMap}/>
                <Route path='/orphanages/create' exact component={CreateOrphanages}/>
                <Route path='/orphanages/:id' exact component={Orphanage}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;