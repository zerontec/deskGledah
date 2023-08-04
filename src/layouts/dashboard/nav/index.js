
import PropTypes from 'prop-types';
import { useEffect , useState} from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link,  Drawer, Typography, Avatar, Stack } from '@mui/material';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';

//
import navConfig from './config';
// import {filterAllowedRoutes}from './config';
import { Logout } from '../../../components/Logout';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};


export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const [roleShow, setRoleShow] = useState('')

const usuario = useSelector((state)=> state.auth)
const username = usuario?.user?.username || '';
// if (usuario && usuario.user.username) {
//   // Acceder a la propiedad 'username' solo si el objeto y la propiedad existen
  
//   console.log(usuario.user.username);
// } else {
//   console.log('El objeto o la propiedad "username" son nulos.');
// }
console.log("usuario", usuario)
const allowedRoutes = usuario?.user && usuario?.user?.roles && usuario?.user?.roles.includes('ROLE_ADMIN')




? navConfig
: navConfig.filter((route) => route.path === '/dashboard/facturacionA')

useEffect(() => {
  if (usuario?.user?.roles.includes('ROLE_ADMIN')) {
    setRoleShow('Administrador');
  }
  if (usuario?.user?.roles.includes('ROLE_FACTURACION')) {
    setRoleShow('Facturacion');
  } 
}, [usuario]);

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
  <Link underline="none">
    <StyledAccount>
      <Avatar src={account?.photoURL} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
          {usuario?.user?.username}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {roleShow}
        </Typography>
      </Box>
    </StyledAccount>
  </Link>
</Box>

      <NavSection data={allowedRoutes} />

      <Box sx={{ flexGrow: 1 }} />
<Logout/>
      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          {/* <Box
            component="img"
            src="/assets/logoinst.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          /> */}

          <Logo/>

          {/* <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box> */}

          {/* <Button href="https://material-ui.com/store/items/minimal-dashboard/" target="_blank" variant="contained">
            Upgrade to Pro
          </Button> */}
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
