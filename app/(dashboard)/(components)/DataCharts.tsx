'use client'
import { useGetSummary } from '@/features/summary/api/use-get-summary'
import React from 'react'
import Chart, { ChartLoading } from './Chart'
import SpendingPie, { SpendingPieLoading } from './SpendingPie'

const DataCharts = () => {
    const { data, isLoading } = useGetSummary()

    if (isLoading) {
        return (
            <div className='grid grid-cols-12 gap-8'>
                <div className="col-span-12 lg:col-span-8">
                    <ChartLoading />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <SpendingPieLoading />
                </div>
            </div>
        )
    }
    return (
        <div className='grid grid-cols-12 gap-8'>
            <div className="col-span-12 lg:col-span-8">
                <Chart data={data?.days} />
            </div>
            <div className="col-span-12 lg:col-span-4">
                <SpendingPie data={data?.categories} />
            </div>
        </div>
    )
}

export default DataCharts