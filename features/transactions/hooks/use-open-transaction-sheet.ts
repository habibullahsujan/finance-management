import {create} from 'zustand'

type TProps={
    isOpen:boolean
    onOpen:()=>void
    onClose:()=>void
}

export const useOpenTransactionSheet=create<TProps>((set)=>({

    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false}),
}))