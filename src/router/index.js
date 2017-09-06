import Vue from 'vue'
import Router from 'vue-router'
import ProjectList from '@/components/ProjectList'
import Project from '@/components/Project'
import NewProject from '@/components/NewProject'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ProjectList',
      component: ProjectList
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
    }
  ]
})
