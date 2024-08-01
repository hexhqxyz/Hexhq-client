import {
    ActivityIcon,
    ArrowDownUpIcon,
    BanknoteIcon,
    CircleDollarSign,
    PlaneTakeoffIcon,
    SquareMousePointerIcon,
    HandCoinsIcon,
    GanttChart,
    ViewIcon,
    HomeIcon,
  } from 'lucide-react';
  
  export const links = [
    {
      title: 'Faucet',
      subLinks: [
        {
          href: '/faucet',
          label: 'Faucet',
          Icon: CircleDollarSign,
        },
      ],
    },
    {
      title: 'Staking',
      subLinks: [
        {
          label: 'Stake',
          href: '/staking',
          Icon: PlaneTakeoffIcon,
        },
        {
          label: 'Withdraw',
          href: '/staking/withdraw',
          Icon: BanknoteIcon,
        },
        {
          label: 'Borrow',
          href: '/staking/borrow',
          Icon: SquareMousePointerIcon,
        },
        {
          label: 'Repay',
          href: '/staking/repay',
          Icon: HandCoinsIcon,
        },
        {
          label: 'Activity',
          href: '/staking/activity',
          Icon: GanttChart,
        },
      ],
    },
    {
      title: 'AMM (Swap)',
      subLinks: [
        {
          href: '/amm/swap',
          label: 'Swap',
          Icon: ArrowDownUpIcon,
          subLabel: 'New',
        },
        {
          href: '/amm/liquidity',
          label: 'Provide liquidity',
          Icon: HandCoinsIcon,
        },
        {
          href: '/amm',
          label: 'Explore',
          Icon: ViewIcon,
        },
      ],
    },
    {
      title: 'Activity',
      subLinks: [
        {
          href: '/activity',
          label: 'My Activity',
          Icon: ActivityIcon,
        },
      ],
    },
  ];
  