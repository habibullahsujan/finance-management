import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {  FileSearch, Loader2, PieChart, RadarIcon, Target } from 'lucide-react';
import React, { useState } from 'react'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import PieVariant from './PieVariant';
import RadarVariant from './RadarVariant';
import RadialVariant from './RadialVariant';
import { Skeleton } from '@/components/ui/skeleton';


type Props = {
    data?: {
        name: string;
        value: number;
    }[]
}
const SpendingPie = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState('pie')

    const onTypeChange = (type: string) => {
        //todo:add paywall
        setChartType(type)
    }
    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
                <CardTitle className='text-xl line-clamp-1'>
                    Categories
                </CardTitle>
                <Select defaultValue={chartType} onValueChange={onTypeChange}>
                    <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
                        <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Chart Type</SelectLabel>
                            <SelectItem value='pie'>
                                <div className="flex item-center">
                                    <PieChart className='size-4 mr-2 shrink-0' />
                                    <p className='line-clamp-1'>Pie Chart</p>
                                </div>
                            </SelectItem>
                            <SelectItem value='radar'>
                                <div className="flex item-center">
                                    <RadarIcon className='size-4 mr-2 shrink-0' />
                                    <p className='line-clamp-1'>Radar Chart</p>
                                </div>
                            </SelectItem>
                            <SelectItem value='radial'>
                                <div className="flex item-center">
                                    <Target className='size-4 mr-2 shrink-0' />
                                    <p className='line-clamp-1'>Radial Chart</p>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {
                    data?.length === 0 ? (
                        <div className='flex flex-col gap-y-4 items-center justify-center h-[350px] w-full'>
                            <FileSearch className='size-6 text-muted-foreground' />
                            <p>No data found for this period.</p>
                        </div>
                    ) : (
                        <>
                            {chartType === 'pie' && <PieVariant data={data} />}
                            {chartType === 'radar' && <RadarVariant data={data} />}
                            {chartType === 'radial' && <RadialVariant data={data} />}
                        </>

                    )
                }

            </CardContent>
        </Card>
    )
}

export default SpendingPie


export const SpendingPieLoading = () => {
    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-8 lg:w-[120px] w-full' />
            </CardHeader>
            <CardContent>
                <div className='h-[350px] w-full items-center flex justify-center'>
                    <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
                </div>
            </CardContent>

        </Card>
    )
}