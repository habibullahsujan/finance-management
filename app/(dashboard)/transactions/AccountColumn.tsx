import { useEditAccount } from '@/features/accounts/hooks/use-edit-account';
import React from 'react'

type Props={
    account:string | null;
    accountId:string | null;
}
const AccountColumn = ({account,accountId}:Props) => {
    const {onOpen:onOpenAccount} =useEditAccount();
    const onClick=()=>{
        onOpenAccount(accountId as string)
    }


  return (
    <div onClick={onClick} className='flex items-center cursor-pointer hover:underline'>
        {account}
    </div>
  )
}

export default AccountColumn