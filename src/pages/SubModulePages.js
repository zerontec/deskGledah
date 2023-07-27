import React from 'react'
import { Typography,  } from '@mui/material';
import styled from 'styled-components';

import { SubModule } from '../sections/@dashboard/SubModule'
import { FloatingButtonComponent } from '../components/FloatingButtonComponent';

const FormTipo = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;
  background-color: rgb(0, 123, 255);
  border-radius: 20px;
`


const SubModulePages =()=> (

<>
<FormTipo>
 <Typography style={{marginLeft:15, marginTop:10}} color="white" variant="h5" sx={{ marginBottom: 2 }}>
        Usuarios de el Sistema 
        </Typography>
        </FormTipo>


<SubModule/>

<FloatingButtonComponent/>
</>


)


export default SubModulePages