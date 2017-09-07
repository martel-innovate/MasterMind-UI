import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import ProjectList from '@/components/ProjectList'
import Project from '@/components/Project'
import Cluster from '@/components/Cluster'
import NewProject from '@/components/NewProject'
import NewCluster from '@/components/NewCluster'
import EditProject from '@/components/EditProject'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ProjectList',
      component: ProjectList
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
      path: '/projects/new',
      name: 'NewProject',
      component: NewProject
    },
    {
      path: '/projects/:id',
      name: 'Project',
      component: Project
    },
    {
      path: '/projects/:id/clusters/new',
      name: 'NewCluster',
      component: NewCluster
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
    }
  ]
})
