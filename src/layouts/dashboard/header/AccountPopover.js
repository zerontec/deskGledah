import { useState,  useEffect} from 'react';

import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';
import { logout } from '../../../redux/modules/auth';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [roleShow, setRoleShow] = useState('');

  const usuario = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (usuario?.roles?.includes('ROLE_ADMIN')) {
      setRoleShow('Administrador');
    } else if (usuario?.roles?.includes('ROLE_FACTURACION')) {
      setRoleShow('Facturacion');
    } else {
      setRoleShow('Usuario normal');
    }
  }, [usuario]);

  const dispatchar = useDispatch();
  const logoOut = () => {
    dispatchar(logout());
    window.location.reload();
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ p: 0 }}>
        <Avatar src={usuario?.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {usuario?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {usuario?.email}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {roleShow}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {/* {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))} */}
          <Link to={`/dashboard/perfil-usuario/${usuario?.id}`} style={{ textDecoration: 'none' }}>
            <MenuItem sx={{ m: 1 }}>
              Perfil
            </MenuItem>
          </Link>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logoOut} sx={{ m: 1 }}>
          Salir
        </MenuItem>
      </Popover>
    </>
  );
}
