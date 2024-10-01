import React from 'react'
import DataGrid from './(components)/DataGrid'
import DataCharts from './(components)/DataCharts'

const DashboardPage = () => {
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <DataGrid />
      <DataCharts />
    </div>
  )
}

export default DashboardPage