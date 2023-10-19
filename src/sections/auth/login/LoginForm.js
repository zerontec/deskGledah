/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */


import { useState,useRef } from 'react';


import { Navigate,useNavigate } from 'react-router-dom';


import { useDispatch, useSelector } from "react-redux";


import Swal from 'sweetalert2'
import Form from "react-validation/build/form";



// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { login } from '../../../redux/modules/auth';
// eslint-disable-next-line import/order
import CheckButton from "react-validation/build/button";

// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const LoginForm= ()=> {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // const handleClick = () => {
  //   navigate('/dashboard', { replace: true });
  // };



  
  const dispatch = useDispatch();
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector((state) => state);
 
  const { auth } = useSelector((state) => state);
  console.log("aqui auth", auth)
  

  if (auth && auth.user && auth.user.username) {
    // Acceder a la propiedad 'username' solo si el objeto y la propiedad existen
    
    console.log(auth.user.username);
  } else {
    console.log('El objeto o la propiedad "username" son nulos.');
  }
  if (auth.isLoggedIn && auth.user && auth.user.roles.includes('ROLE_FACTURACION')) {
    return <Navigate to="/dashboard/facturacionA" />;
  } if (auth.isLoggedIn && auth.user && auth.user.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/dashboard" />;
  }

const {message} = auth;
console.log(message)
  // eslint-disable-next-line consistent-return
  const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          Este dato es requerido!
        </div>
      );
    }
  };

  const onChangeUsername = (e) => {

    const username = e.target.value;
    setUsername(username);
  }

  const onChangePassword = (e) => {

    const password = e.target.value;
    setPassword(password);
  }

  const handleLogin = (e) => {

    e.preventDefault();
    setLoading(true);
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {

      dispatch(login(username, password))
        .then(() => {
          Swal.fire(
            'sesion iniciada con exito !'

          )
          // navigate('/home');
          window.location.reload()

        })
        .catch((error) => {
          setLoading(false);
          // alert(error.message);
          // Swal.fire(
          //  (error.message)

          // )
          // window.location.reload();

        });
    } else {
      setLoading(false);
    }

  };
  if (isLoggedIn) {
    return <Navigate to='/home' />
  }









  return (
    <>
     <Form onSubmit={handleLogin} ref={form}>

      <Stack spacing={3}>
        <TextField name="user" label="Usuario"
        type="text"
      
        value={username}
        onChange={onChangeUsername}
        validations={[required]}
        
        
        
        />

        <TextField
          name="password"
          label="Contraseña"
         
                    
                    value={password}
                    onChange={onChangePassword}
                    validatiosn={[required]}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" /> */}
        <Link variant="subtitle2" underline="hover">
         Olvidaste tu password comunicate con el Administrador
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" >
        Login
      </LoadingButton>
      {message && (
                  <div className="form-group">
                    <div role="alert">
                      {message}
                    </div>
                  </div>
                )}
 <CheckButton style={{ display: "none" }} ref={checkBtn} />

      </Form>
    </>
  );
}
export default LoginForm;