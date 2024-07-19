'use client'

import React, { useEffect } from 'react'
import ApproveToken from './ApproveToken'
import StakeAmount from './StakeAmount'
import EarnedReward from './EarnedReward'
import WithdrawAmount from './WithdrawAmount'

type Props = {}

const Staking = (props: Props) => {
    useEffect(() => {
      console.log("hello")
    }, [])
    
  return (
    <div className='px-2'>
        <ApproveToken />
        <div className='mt-4 '>
            <StakeAmount />
        </div>
    </div>
  )
}

export default Staking