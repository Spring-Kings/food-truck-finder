import CoolLayout from '../../components/CoolLayout'
import React from 'react'

import UserDashboardComponent from '../../components/dashboards/user/UserDashboard';

function UserDashboard(){
  return(
    <CoolLayout>
      <UserDashboardComponent/>
    </CoolLayout>
  )
}

export default UserDashboard;