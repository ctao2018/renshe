import Vue from 'vue'
import Router from 'vue-router'
// const _import = require('./_import_' + process.env.NODE_ENV)
const firstPage = () => import('components/firstPage/firstPage')
const managementNetwork = () => import('components/managementNetwork/managementNetwork')
const networkDetail = () => import('components/networkDetail/networkDetail')
const businessGuide = () => import('components/businessGuide/businessGuide')
const guideDetail = () => import('components/guideDetail/guideDetail')
const commonProblem = () => import('components/commonProblem/commonProblem')
const drugstore = () => import('components/drugstore/drugstore')
const drugstoreDetail = () => import('components/drugstoreDetail/drugstoreDetail')
const hospital = () => import('components/hospital/hospital')
const hospitalDetail = () => import('components/hospitalDetail/hospitalDetail')
const drugs = () => import('components/drugs/drugs')
const drugsDetail = () => import('components/drugsDetail/drugsDetail')
const search = () => import('components/search/search')
const cityChoice = () => import('components/cityChoice/cityChoice')
const cityChoice_2 = () => import('components/cityChoice/cityChoice_2')
const comSearch = () => import('components/comSearch/comSearch')
const comQuestDetail = () => import('components/comQuestDetail/comQuestDetail')
const auth = () => import('components/auth/auth')
const authback = () => import('components/authback/authback')

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
      component: firstPage,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/firstPage/:citycode',
      name: 'firstPagewithcitycode',
      component: firstPage,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/managementNetwork',
      name: 'managementNetwork',
      component: managementNetwork,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/managementNetwork/:citycode',
      name: 'managementNetworkwithcitycode',
      component: managementNetwork,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/networkDetail/:id',
      name: 'networkDetail',
      component: networkDetail,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/businessGuide',
      name: 'businessGuide',
      component: businessGuide,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/businessGuide/:citycode/:type',
      name: 'businessGuidewithcitycodetype',
      component: businessGuide,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/businessGuide/:citycode',
      name: 'businessGuidewithcitycode',
      component: businessGuide,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/guideDetail/:id',
      name: 'guideDetail',
      component: guideDetail,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/commonProblem',
      name: 'commonProblem',
      component: commonProblem,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/commonProblem/:citycode',
      name: 'commonProblemwithcitycode',
      component: commonProblem,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/drugstore',
      name: 'drugstore',
      component: drugstore,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/drugstore/:citycode',
      name: 'drugstorewithcitycode',
      component: drugstore,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/drugstoreDetail/:id',
      name: 'drugstoreDetail',
      component: drugstoreDetail,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/hospital',
      name: 'hospital',
      component: hospital,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/hospital/:citycode',
      name: 'hospitalwithcitycode',
      component: hospital,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/hospitalDetail/:id',
      name: 'hospitalDetail',
      component: hospitalDetail,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/drugs',
      name: 'drugs',
      component: drugs,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/drugs/:citycode',
      name: 'drugswithcitycode',
      component: drugs,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/drugsDetail/:id',
      name: 'drugsDetail',
      component: drugsDetail,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/search/:pageType/:cityCode',
      name: 'search',
      component: search,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/cityChoice',
      name: 'cityChoice',
      component: cityChoice,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/cityChoice_2',
      name: 'cityChoice_2',
      component: cityChoice_2,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/comSearch/:citycode',
      name: 'comSearch',
      component: comSearch,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/comQuestDetail/:id',
      name: 'comQuestDetail',
      component: comQuestDetail,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: auth,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/authback',
      name: 'authback',
      component: authback,
      meta: {
        keepAlive: false
      }
    }
  ]
})

export default router
