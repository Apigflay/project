// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView } from '@/layouts'


export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    // redirect: '/task-manage',
    redirect: '/manage-set-nb',
    children: [

      //任务管理
      // {
      //   path: '/task-manage',
      //   name: 'task-manage',
      //   component: RouteView,
      //   redirect: '/task-manage/measure-task',
      //   meta: { title: '任务管理', icon: 'schedule' },
      //   children: [
      //     {
      //       path: '/task-manage/measure-task',
      //       name: 'measure-task',
      //       component: () => import('@/views/task-manage/measure-task'),
      //       meta: { title: '测量任务', keepAlive: false, permission: ['admin', 'user'] }
      //     },
      //   ]
      // },


      // 管理设置
      {
        path: '/manage-set-nb',
        name: 'manage-set-nb',
        component: RouteView,
        redirect: '/manage-set-nb/department-manage',
        meta: { title: '管理设置', icon: 'setting', permission: ['admin', 'user'] },
        children: [

          {
            path: '/manage-set-nb/department-manage',
            name: 'department-manage',
            component: () => import('@/views/manage-set-nb/department-manage'),
            meta: { title: '部门管理', keepAlive: false, permission: ['admin', 'user'] }
          },

          {
            path: '/manage-set-nb/point-manage-nb',
            name: 'point-manage-nb',
            component: () => import('@/views/manage-set-nb/point-manage-nb'),
            meta: { title: '测点管理', keepAlive: false, permission: ['admin', 'user'] }
          },


          {
            path: '/manage-set-nb/instrument-manage',
            name: 'instrument-manage',
            component: () => import('@/views/manage-set-nb/instrument-manage'),
            meta: { title: '仪器管理', keepAlive: false, permission: ['admin', 'user'] }
          },

          {
            path: '/manage-set-nb/calibrator-manage',
            name: 'calibrator-manage',
            component: () => import('@/views/manage-set-nb/calibrator-manage'),
            meta: { title: '校准器管理', keepAlive: false, permission: ['admin', 'user'] }
          },

          {
            path: '/manage-set-nb/anemograph-manage',
            name: 'anemograph-manage',
            component: () => import('@/views/manage-set-nb/anemograph-manage'),
            meta: { title: '风速仪管理', keepAlive: false, permission: ['admin', 'user'] }
          },

          {
            path: '/manage-set-nb/task-manage',
            name: 'task-manage',
            component: () => import('@/views/manage-set-nb/task-manage'),
            meta: { title: '任务管理', keepAlive: false, permission: ['admin', 'user'] }
          },

          {
            path: '/manage-set-nb/road-manage',
            name: 'road-manage',
            component: () => import('@/views/manage-set-nb/road-manage'),
            meta: { title: '道路管理', keepAlive: false, permission: ['admin', 'user'] }
          },
          {
            path: '/manage-set-nb/user-manage-nb',
            name: 'user-manage-nb',
            component: () => import('@/views/manage-set-nb/user-manage-nb'),
            meta: { title: '用户管理', keepAlive: false, permission: ['admin', 'user'] }
          },

          {
            path: '/manage-set-nb/role-manage',
            name: 'role-manage',
            component: () => import('@/views/manage-set-nb/role-manage'),
            meta: { title: '角色管理', keepAlive: false, permission: ['admin', 'user'] }
          },
          {
            path: '/manage-set-nb/auth-manage',
            name: 'auth-manage',
            component: () => import('@/views/manage-set-nb/auth-manage'),
            meta: { title: '权限管理', keepAlive: false, permission: ['admin', 'user'] }
          },
          {
            path: '/manage-set-nb/config-manage',
            name: 'config-manage',
            component: () => import('@/views/manage-set-nb/config-manage'),
            meta: { title: '配置管理', keepAlive: false, permission: ['admin', 'user'] }
          },


          {
            path: '/manage-set-nb/person-set-nb',
            name: 'person-set-nb',
            component: () => import('@/views/manage-set-nb/person-set-nb'),
            meta: { title: '个人设置', keepAlive: false, permission: ['admin', 'user'] }
          },


        ]
      },

      // 实时数据
      {
        path: '/real-data',
        name: 'real-data',
        redirect: '/real-data/point-data',
        component: RouteView,
        meta: { title: '实时数据', icon: 'dashboard', permission: ['admin', 'user'] },
        children: [
          {
            path: '/real-data/point-data',
            name: 'point-data',
            component: () => import('@/views/real-data/point-data'),
            meta: { title: '测点数据', keepAlive: false, permission: ['admin', 'user'] }
          },
          {
            path: '/real-data/point-list',
            name: 'point-list',
            component: () => import('@/views/real-data/point-list'),
            meta: { title: '测点列表', keepAlive: false, permission: ['admin', 'user'] }
          },
          {
            path: '/real-data/real-event',
            name: 'real-event',
            component: () => import('@/views/real-data/real-event'),
            meta: { title: '实时事件', keepAlive: false, permission: ['admin', 'user'] }
          },

          {
            path: '/real-data/map-show',
            name: 'map-show',
            component: () => import('@/views/real-data/map-show'),
            meta: { title: '地图展示', keepAlive: false, permission: ['admin', 'user'] }
          },
        ]
      },


      // 数据记录
      {
        path: '/data-record',
        name: 'data-record',
        component: RouteView,
        redirect: '/data-record/data-query',
        meta: { title: '数据记录', icon: 'profile', permission: ['admin', 'user'] },
        children: [
          {
            path: '/data-record/data-query',
            name: 'data-query',
            component: () => import('@/views/data-record/data-query/layout'),
            redirect: '/data-record/data-query/instant-data',
            meta: { title: '数据查询', permission: ['admin', 'user'] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/data-record/data-query/instant-data',
                name: 'instant-data',
                component: () => import('@/views/data-record/data-query/instant-data'),
                meta: { title: '噪声瞬时数据', keepAlive: false, permission: ['admin', 'user'] }
              },
              {
                path: '/data-record/data-query/statistics-data',
                name: 'statistics-data',
                component: () => import('@/views/data-record/data-query/statistics-data'),
                meta: { title: '噪声统计数据', keepAlive: false, permission: ['admin', 'user'] }
              },
              {
                path: '/data-record/data-query/weather-data',
                name: 'weather-data',
                component: () => import('@/views/data-record/data-query/weather-data'),
                meta: { title: '气象数据', keepAlive: false, permission: ['admin', 'user'] }
              },
              // {
              //   path: '/data-record/data-query/dust-data',
              //   name: 'dust-data',
              //   component: () => import('@/views/data-record/data-query/dust-data'),
              //   meta: { title: '粉尘数据', keepAlive: false, permission: ['admin', 'user'] }
              // },
              {
                path: '/data-record/data-query/traffic-data',
                name: 'traffic-data',
                component: () => import('@/views/data-record/data-query/traffic-data'),
                meta: { title: '交通数据', keepAlive: false, permission: ['admin', 'user'] }
              }
            ]
          },
          {
            path: '/data-record/event-query',
            name: 'event-query',
            component: () => import('@/views/data-record/event-query/layout'),
            redirect: '/data-record/event-query/system-event',
            meta: { title: '事件查询', permission: ['admin', 'user'] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/data-record/event-query/system-event',
                name: 'system-event',
                component: () => import('@/views/data-record/event-query/system-event'),
                meta: { title: '系统事件', keepAlive: false, permission: ['admin', 'user'] }
              },
              {
                path: '/data-record/event-query/front-event',
                name: 'front-event',
                component: () => import('@/views/data-record/event-query/front-event'),
                meta: { title: '仪器事件', keepAlive: false, permission: ['admin', 'user'] }
              },
            ]
          },
        ]
      },



      // 数据审核audit
      {
        path: '/data-audit',
        name: 'data-audit',
        component: RouteView,
        redirect: '/data-audit/to-be-confirmed-list',
        meta: { title: '数据审核', icon: 'audit', permission: ['admin', 'user'] },
        children: [
          {
            path: '/data-audit/to-be-confirmed-list',
            name: 'to-be-confirmed-list',
            component: () => import('@/views/data-audit/to-be-confirmed-list'),
            meta: { title: '待审核确认列表', keepAlive: false, },
          },
          {
            path: '/data-audit/audit-history-list',
            name: 'audit-history-list',
            component: () => import('@/views/data-audit/audit-history-list'),
            meta: { title: '审核历史列表', keepAlive: false, },
          },
        ]
      },




      // 数据分析
      {
        path: '/data-analyze',
        redirect: '/data-analyze/statistics-analyze',
        component: RouteView,
        meta: { title: '数据分析', icon: 'line-chart', permission: ['admin', 'user'] },
        children: [
          {
            path: '/data-analyze/report-generate',
            name: 'report-generate',
            component: () => import('@/views/data-analyze/report-generate'),
            meta: { title: '报表生成', keepAlive: false, permission: ['admin', 'user'] }
          },
          // {
          //   path: '/data-analyze/statistics-analyze',
          //   name: 'statistics-analyze',
          //   component: () => import('@/views/data-analyze/statistics-analyze'),
          //   meta: { title: '统计分析', keepAlive: false, permission: ['admin', 'user'] }
          // },
          // {
          //   path: '/data-analyze/data-compare',
          //   name: 'data-compare',
          //   component: () => import('@/views/data-analyze/data-compare'),
          //   meta: { title: '数据比较', keepAlive: false, permission: ['admin', 'user'] }
          // },
          // {
          //   path: '/data-analyze/points-analyze',
          //   name: 'points-analyze',
          //   component: () => import('@/views/data-analyze/points-analyze'),
          //   meta: { title: '多测点数据分析', keepAlive: false, permission: ['admin', 'user'] }
          // },
          {
            path: '/data-analyze/points-analyze2',
            name: 'points-analyze2',
            component: () => import('@/views/data-analyze/points-analyze2'),
            meta: { title: '多测点数据分析', keepAlive: false, permission: ['admin', 'user'] }
          },
          {
            path: '/data-analyze/chart-analyze',
            name: 'chart-analyze',
            component: () => import('@/views/data-analyze/chart-analyze'),
            meta: { title: '图表分析', keepAlive: false, permission: ['admin', 'user'] }
          },
          {
            path: '/data-analyze/area-display',
            name: 'area-display',
            component: () => import('@/views/data-analyze/area-display'),
            meta: { title: '区域显示', keepAlive: false, permission: ['admin', 'user'] }
          },
          {
            path: '/data-analyze/traffic-display',
            name: 'traffic-display',
            component: () => import('@/views/data-analyze/traffic-display'),
            meta: { title: '交通显示', keepAlive: false, permission: ['admin', 'user'] }
          },

        ]
      },
      // 运维设置
      {
        path: '/operation-setting',
        name: 'operation-setting',
        component: RouteView,
        redirect: '/operation-setting/operation-data',
        meta: { title: '运维设置', icon: 'hdd', permission: ['admin', 'user'] },
        children: [
          {
            path: '/operation-setting/operation-data',
            name: 'operation-data',
            component: () => import('@/views/operation-setting/operation-data'),
            meta: { title: '运维数据', keepAlive: false, permission: ['admin', 'user'] },
          },
          {
            path: '/operation-setting/operation-manage',
            name: 'operation-manage',
            component: () => import('@/views/operation-setting/operation-manage'),
            meta: { title: '运维任务管理', keepAlive: false, permission: ['admin', 'user'] },
          },
          {
            path: '/operation-setting/operation-plan',
            name: 'operation-plan',
            component: () => import('@/views/operation-setting/operation-plan'),
            meta: { title: '周期任务管理', keepAlive: false, permission: ['admin', 'user'] },
          },
          {
            path: '/operation-setting/operation-configure',
            name: 'operation-configure',
            component: () => import('@/views/operation-setting/operation-configure'),
            meta: { title: '常规运维表单配置', keepAlive: false, permission: ['admin', 'user'] },
          },
        ]
      },
      // 管理设置
      // {
      //   path: '/manage-set',
      //   name: 'manage-set',
      //   component: RouteView,
      //   redirect: '/manage-set/point-manage',
      //   meta: { title: '管理设置', icon: 'setting', permission: ['admin', 'user'] },
      //   children: [

      //     {
      //       path: '/manage-set/user-manage',
      //       name: 'user-manage',
      //       component: () => import('@/views/manage-set/user-manage'),
      //       meta: { title: '仪器管理', keepAlive: false, permission: ['admin', 'user'] }
      //     },

      //     {
      //       path: '/manage-set/point-manage',
      //       name: 'point-manage',
      //       component: () => import('@/views/manage-set/point-manage'),
      //       meta: { title: '测点管理', keepAlive: false, permission: ['admin', 'user'] }
      //     },

      //     {
      //       path: '/manage-set/person-set',
      //       name: 'person-set',
      //       component: () => import('@/views/manage-set/person-set'),
      //       meta: { title: '个人设置', keepAlive: false, permission: ['admin', 'user'] }
      //     },
      //     {
      //       path: '/manage-set/notification-way',
      //       name: 'notification-way',
      //       component: () => import('@/views/manage-set/notification-way'),
      //       meta: { title: '通知方式', keepAlive: false, permission: ['admin', 'user'] }
      //     },
      //   ]
      // },

      // 手工导入
      // {
      //   path: '/manual-import',
      //   name: 'manual-import',
      //   component: RouteView,
      //   redirect: '/manual-import/add-point',
      //   meta: { title: '手工导入', icon: 'import', permission: ['admin', 'user'] },
      //   children: [

      //     {
      //       path: '/manual-import/add-point',
      //       name: 'add-point',
      //       component: () => import('@/views/manual-import/add-point'),
      //       meta: { title: '添加测点', keepAlive: false, permission: ['admin', 'user'] }
      //     },
      //     {
      //       path: '/manual-import/manual-point-list',
      //       name: 'manual-point-list',
      //       component: () => import('@/views/manual-import/manual-point-list'),
      //       meta: { title: '测点列表', keepAlive: false, permission: ['admin', 'user'] }
      //     },

      //     {
      //       path: '/manual-import/import-data',
      //       name: 'import-data',
      //       component: () => import('@/views/manual-import/import-data'),
      //       meta: { title: '导入数据', keepAlive: false, permission: ['admin', 'user'] }
      //     },


      //     {
      //       path: '/manual-import/data-list',
      //       name: 'data-list',
      //       component: () => import('@/views/manual-import/data-list'),
      //       meta: { title: '数据列表', keepAlive: false, permission: ['admin', 'user'] }
      //     },

      //     {
      //       path: '/manual-import/analyze-data',
      //       name: 'analyze-data',
      //       component: () => import('@/views/manual-import/analyze-data'),
      //       meta: { title: '分析数据', keepAlive: false, permission: ['admin', 'user'] }
      //     },



      //   ]
      // },
    ]
  },

  {
    path: '*', redirect: '/404', hidden: true, permission: ['sadmin', 'admin', 'user']
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
        meta: { keepAlive: false },
        component: () => import('@/views/user/login/login')
      },
      {
        path: 'register',
        name: 'register',
        meta: { keepAlive: false },
        component: () => import('@/views/user/register/activate-device')
      },
      {
        path: 'register-mobile',
        name: 'register-mobile',
        meta: { keepAlive: false },
        component: () => import('@/views/user/register/activate-device-mobile')
      },
      {
        path: 'create-qrcode',
        name: 'create-qrcode',
        meta: { keepAlive: false },
        component: () => import('@/views/user/register/create-qrcode')
      },
      {
        path: 'operation-interface/:mid',
        name: 'operation-interface',
        meta: { keepAlive: false },
        component: () => import('@/views/user/operation-interface')
      },


    ]
  },



  {
    path: '/404',
    component: () => import('@/views/exception/404')
  },

  {
    path: '/403',
    component: () => import('@/views/exception/403')
  },

  {
    path: '/500',
    component: () => import('@/views/exception/500')
  },




]
