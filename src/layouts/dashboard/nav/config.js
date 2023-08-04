

// component
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SvgColor from '../../../components/svg-color';


// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`../assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const navConfig = [

  
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: <DashboardIcon/>
  },
  {
    title: 'Administracion',
    path: '/dashboard/Administracion',
    icon: <AdminPanelSettingsIcon/>
    
  },
  // {
  //   title: 'facturacion',
  //   path: '/dashboard/facturacion',
  //   icon: icon('ic_cart'),
  // },

  {
    title: 'facturacion',
    path: '/dashboard/facturacionA',
    icon: <PointOfSaleIcon/>
  },
  {
    title: 'compras',
    path: '/dashboard/compras',
    icon: <ShoppingCartIcon/>
  },

  {
    title: 'Carga Productos',
    path: '/dashboard/cargar-productos',
    icon: <DriveFolderUploadIcon/>,
  },
{

title: 'usuarios',
path:'/dashboard/usuarios',
icon: <PersonIcon/>

},
{

  title: 'Empleados',
  path:'/dashboard/vendedores',
  icon: <BadgeIcon/>,
  
  },
  {

    title: 'clientes',
    path:'/dashboard/clientes',
    icon: <GroupIcon/>,
    
    },

    {

      title: 'gastos',
      path:'/dashboard/gastos',
      icon: <AccountBalanceWalletIcon/>,
      
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
