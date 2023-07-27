

// component
import SvgColor from '../../../components/svg-color';


// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const navConfig = [

  
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Administracion',
    path: '/dashboard/Administracion',
    icon: icon('ic_analytics'),
    
  },
  // {
  //   title: 'facturacion',
  //   path: '/dashboard/facturacion',
  //   icon: icon('ic_cart'),
  // },

  {
    title: 'facturacion',
    path: '/dashboard/facturacionA',
    icon: icon('ic_cart'),
  },
  {
    title: 'compras',
    path: '/dashboard/compras',
    icon: icon('ic_cart'),
  },
{

title: 'usuarios',
path:'/dashboard/usuarios',
icon: icon('ic_user'),

},
{

  title: 'Empleados',
  path:'/dashboard/vendedores',
  icon: icon('ic_user'),
  
  },
  {

    title: 'clientes',
    path:'/dashboard/clientes',
    icon: icon('ic_user'),
    
    },

    {

      title: 'gastos',
      path:'/dashboard/gastos',
      icon: icon('ic_money'),
      
      },
  




  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },

 

 
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },

  // {
  //   title: 'logout',
  //   path: '/logout',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];



export const filterAllowedRoutes = (userRoles) => {
  if (userRoles.includes('ROLE_ADMIN')) {
    return navConfig; // Mostrar todas las rutas para el rol de administrador
  } if (userRoles.includes('ROLE_FACTURACION')) {
    return navConfig.filter((route) => route.path === '/dashboard/facturacionA');
  } 
    return []; // No se muestran rutas para otros roles
  
};
export default navConfig;
