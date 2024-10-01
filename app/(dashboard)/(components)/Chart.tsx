import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, BarChart3, FileSearch, LineChart, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import AreaVariant from './AreaVariant';
import BarVariant from './BarVariant';
import LineVariant from './LineVariant';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';


type Props = {
    data?: {
        date: string;
        income: number;
        expenses: number
    }[]
}
const Chart = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState('area')

    const onTypeChange = (type: string) => {
        //todo:add paywall
        setChartType(type)
    }
    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
                <CardTitle className='text-xl line-clamp-1'>
                    Transactions
                </CardTitle>
                <Select defaultValue={chartType} onValueChange={onTypeChange}>
                    <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
                        <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Chart Type</SelectLabel>
                            <SelectItem value='area'>
                                <div className="flex item-center">
                                    <AreaChart className='size-4 mr-2 shrink-0' />
                                    <p className='line-clamp-1'>Area Chart</p>
                                </div>
                            </SelectItem>
                            <SelectItem value='line'>
                                <div className="flex item-center">
                                    <LineChart className='size-4 mr-2 shrink-0' />
                                    <p className='line-clamp-1'>Line Chart</p>
                                </div>
                            </SelectItem>
                            <SelectItem value='bar'>
                                <div className="flex item-center">
                                    <BarChart3 className='size-4 mr-2 shrink-0' />
                                    <p className='line-clamp-1'>Bar Chart</p>
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
                            {chartType === 'area' && <AreaVariant data={data} />}
                            {chartType === 'bar' && <BarVariant data={data} />}
                            {chartType === 'line' && <LineVariant data={data} />}
                        </>

                    )
                }

            </CardContent>
        </Card>
    )
}

export default Chart

export const ChartLoading = () => {
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