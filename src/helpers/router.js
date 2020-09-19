/**
 * Format routes.
 *
 * @param   {String}  pathPrefix  
 * @param   {String}  namePrefix  
 * @param   {Array}  routes      
 *
 * @return  {Array}              
 */
export function formatRoutes(pathPrefix, namePrefix, routes) {
  return routes.map(route => ({
    path: pathPrefix + route.path,
    name: namePrefix + route.name,
    meta: route.meta,
    component: route.component,
  }))
}

/**
 * Set document title
 *
 * @param   {Object}  meta  
 *
 * @return  {void}        
 */
export function setTitle(meta) {
  const appTitle = process.env.VUE_APP_TITLE

  document.title = meta?.title
    ? `${meta.title} | ${appTitle}`
    : appTitle
}