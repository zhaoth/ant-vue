// eslint-disable-next-line
import { BasicLayout, PageView, UserLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard/workplace',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Workplace'),
        meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['dashboard'], icon: bxAnaalyse }
      },
      // system
      {
        path: '/system',
        redirect: '/system/organization',
        component: RouteView,
        meta: { title: 'menu.system', icon: 'setting' },
        children: [
          {
            path: '/system/menu',
            name: 'Menu',
            component: () => import('@/views/system/menu/index'),
            meta: { title: 'menu.system.menu', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/system/organization',
            name: 'Organization',
            component: () => import('@/views/system/organization/index'),
            meta: { title: 'menu.system.organization', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/system/user',
            name: 'User',
            component: () => import('@/views/system/user/index'),
            meta: { title: 'menu.system.user', keepAlive: true, permission: ['form'] }
          }
        ]
      },
      /* 基礎數據 */
      {
        path: '/basis',
        redirect: '/basis/factory',
        component: RouteView,
        meta: { title: 'basis.Basic.data', icon: 'setting' },
        children: [
          {
            path: '/basis/factory',
            name: 'factory',
            component: () => import('@/views/basis/factory/index'),
            meta: { title: 'basis.factory.pattern', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/basis/car management',
            name: 'car management',
            component: () => import('@/views/basis/car management/index'),
            meta: { title: 'basis.Vehicle.management', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/basis/property management',
            name: 'property management',
            component: () => import('@/views/basis/property management/index'),
            meta: { title: 'basis.Property.management', keepAlive: true, permission: ['form'] }
          }
        ]
      }

    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
