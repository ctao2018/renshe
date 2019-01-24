import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)
Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
const router = new Router({
  // mode: 'hash',
  mode: 'history',
  base: '/sbjccx/',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/firstPage'
    },
    {
      path: '/firstPage',
      name: 'firstPage',
      component: _import('firstPage/firstPage'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/firstPage/:citycode/:cityName',
      name: 'firstPagewithcitycode',
      component: _import('firstPage/firstPage'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/managementNetwork',
      name: 'managementNetwork',
      component: _import('managementNetwork/managementNetwork'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/managementNetwork/:citycode',
      name: 'managementNetworkwithcitycode',
      component: _import('managementNetwork/managementNetwork'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/networkDetail/:id',
      name: 'networkDetail',
      component: _import('networkDetail/networkDetail'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/businessGuide',
      name: 'businessGuide',
      component: _import('businessGuide/businessGuide'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/businessGuide/:citycode/:type',
      name: 'businessGuidewithcitycodetype',
      component: _import('businessGuide/businessGuide'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/businessGuide/:citycode',
      name: 'businessGuidewithcitycode',
      component: _import('businessGuide/businessGuide'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/guideDetail/:id',
      name: 'guideDetail',
      component: _import('guideDetail/guideDetail'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/commonProblem',
      name: 'commonProblem',
      component: _import('commonProblem/commonProblem'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/commonProblem/:citycode',
      name: 'commonProblemwithcitycode',
      component: _import('commonProblem/commonProblem'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/drugstore',
      name: 'drugstore',
      component: _import('drugstore/drugstore'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/drugstore/:citycode',
      name: 'drugstorewithcitycode',
      component: _import('drugstore/drugstore'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/drugstoreDetail/:id',
      name: 'drugstoreDetail',
      component: _import('drugstoreDetail/drugstoreDetail'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/hospital',
      name: 'hospital',
      component: _import('hospital/hospital'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/hospital/:citycode',
      name: 'hospitalwithcitycode',
      component: _import('hospital/hospital'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/hospitalDetail/:id',
      name: 'hospitalDetail',
      component: _import('hospitalDetail/hospitalDetail'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/drugs',
      name: 'drugs',
      component: _import('drugs/drugs'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/drugs/:citycode',
      name: 'drugswithcitycode',
      component: _import('drugs/drugs'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/drugsDetail/:id',
      name: 'drugsDetail',
      component: _import('drugsDetail/drugsDetail'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/search/:pageType/:cityCode',
      name: 'search',
      component: _import('search/search'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/cityChoice',
      name: 'cityChoice',
      component: _import('cityChoice/cityChoice'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/comSearch/:citycode',
      name: 'comSearch',
      component: _import('comSearch/comSearch'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/comQuestDetail/:id',
      name: 'comQuestDetail',
      component: _import('comQuestDetail/comQuestDetail'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: _import('auth/auth'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/authback',
      name: 'authback',
      component: _import('authback/authback'),
      meta: {
        keepAlive: false
      }
    }
  ]
})

export default router
