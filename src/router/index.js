// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts'),
    children: [
      {
        path: 'mint',
        name: 'Mint',
        component: () => import('@/views/Mint'),
        children: [
          {
            path: '1',
            name: 'MintStep1',
            component: () => import('@/views/Mint/Step1')
          },
          {
            path: '2',
            name: 'MintStep2',
            component: () => import('@/views/Mint/Step2')
          },
          {
            path: '3',
            name: 'MintStep3',
            component: () => import('@/views/Mint/Step3')
          }
        ]
      },
      {
        path: 'stake',
        name: 'Stake',
        component: () => import('@/views/Stake'),
        children: [
          {
            path: '1',
            name: 'StakeStep1',
            component: () => import('@/views/Stake/Step1'),
          },
          {
            path: '2',
            name: 'StakeStep2',
            component: () => import('@/views/Stake/Step2'),
          },
          {
            path: '3',
            name: 'StakeStep3',
            component: () => import('@/views/Stake/Step3'),
          }
        ]
      },
      {
        path: 'menft',
        name: 'MENFT',
        component: () => import('@/views/MENFT'),
        children: [
          {
            path: 'mintmenft',
            name: 'MintMENFT',
            component: () => import('@/views/MENFT/MintNFT')
          },
          {
            path: 'mynfts',
            name: 'MyNFTS',
            component: () => import('@/views/MENFT/MyNFT')
          }
        ]
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
