import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import ServiceCatalog from '@/components/ServiceCatalog'
import ProjectList from '@/components/ProjectList'
import ActorList from '@/components/ActorList'
import ClusterList from '@/components/ClusterList'
import SubscriptionList from '@/components/SubscriptionList'
import ServiceList from '@/components/ServiceList'
import CatalogEntry from '@/components/CatalogEntry'
import Project from '@/components/Project'
import Cluster from '@/components/Cluster'
import Subscription from '@/components/Subscription'
import Service from '@/components/Service'
import NewCluster from '@/components/NewCluster'
import NewSubscription from '@/components/NewSubscription'
import NewService from '@/components/NewService'
import EditProject from '@/components/EditProject'
import EditCluster from '@/components/EditCluster'
import EditSubscription from '@/components/EditSubscription'
import EditService from '@/components/EditService'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ProjectList',
      component: ProjectList
    },
    {
      path: '/catalog',
      name: 'ServiceCatalog',
      component: ServiceCatalog
    },
    {
      path: '/catalog/:id',
      name: 'CatalogEntry',
      component: CatalogEntry
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/projects',
      name: 'ProjectList',
      component: ProjectList
    },
    {
      path: '/projects/:id',
      name: 'Project',
      component: Project
    },
    {
      path: '/projects/:id/actors',
      name: 'ActorList',
      component: ActorList
    },
    {
      path: '/projects/:id/clusters/new',
      name: 'NewCluster',
      component: NewCluster
    },
    {
      path: '/projects/:id/subscriptions/new',
      name: 'NewSubscription',
      component: NewSubscription
    },
    {
      path: '/projects/:id/services/new',
      name: 'NewService',
      component: NewService
    },
    {
      path: '/projects/:id/edit',
      name: 'EditProject',
      component: EditProject
    },
    {
      path: '/projects/:project_id/clusters/:cluster_id',
      name: 'Cluster',
      component: Cluster
    },
    {
      path: '/projects/:id/clusters',
      name: 'ClusterList',
      component: ClusterList
    },
    {
      path: '/projects/:project_id/subscriptions/:subscription_id',
      name: 'Subscription',
      component: Subscription
    },
    {
      path: '/projects/:id/subscriptions',
      name: 'SubscriptionList',
      component: SubscriptionList
    },
    {
      path: '/projects/:project_id/services/:service_id',
      name: 'Service',
      component: Service
    },
    {
      path: '/projects/:id/services',
      name: 'ServiceList',
      component: ServiceList
    },
    {
      path: '/projects/:project_id/clusters/:cluster_id/edit',
      name: 'EditCluster',
      component: EditCluster
    },
    {
      path: '/projects/:project_id/subscriptions/:subscription_id/edit',
      name: 'EditSubscription',
      component: EditSubscription
    },
    {
      path: '/projects/:project_id/services/:service_id/edit',
      name: 'EditService',
      component: EditService
    }
  ]
})
