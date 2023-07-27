import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { ShoppingCartOutlined } from '@ant-design/icons';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box, Button } from '@mui/material';
// components
import Iconify from '../components/iconify';


// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { ModuleLinks } from '../components/ModuleLinks';
import { FloatingButtonComponent } from '../components/FloatingButtonComponent';
import { SalesRealTime } from '../components/SalesRealTime';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  const [valoresDolar, setValoresDolar] = useState({});
  const[dataDailySales, setDataDailySale]= useState({});

  useEffect(() => {
    // Realiza la consulta inicial al cargar el componente
    fetchDolarValue();

    // Configura un intervalo para realizar consultas periódicas cada cierto tiempo
    const interval = setInterval(fetchDolarValue, 12 * 60 * 60 * 1000); // Consulta cada 12 horas

    // Limpia el intervalo cuando el componente se desmonta
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchDolarValue = async () => {
    try {
      const response = await fetch('https://expressjs-postgres-production-bd69.up.railway.app/api/consulta/dolar');
      const data = await response.json();
      
      // Convertir los valores a números utilizando parseFloat
      const bcv = data.bcv;
      const enparalelovzla =data.enparalelovzla;
      // ...

      setValoresDolar({
        bcv,
        enparalelovzla,
        // ...
      });
    } catch (error) {
      console.error('Error al obtener los datos del dólar:', error);
    }
  };


// const fetchDayliSales = async() => {

//     try{
//       const response = await fetch('http://localhost:5040/api/report/daily-sales');
//       const data = await response.json();
//       setDataDailySale(data);

//     }catch(error){

//       console.error('Error al obtener los datos del dólar:', error);

//     }


// }



  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | La Muñeca </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
         Hola Bienvenido
        </Typography>

        <Grid item xs={12} md={6} lg={9}>
          <Typography variant="h4" sx={{ mb: 5 }}>
         Dashboard
        </Typography>


          {/* <ButtonBar 
          button1={"Administracion"} 
          button1Link="/dashboard/Administracion" 
          button2={"Compras"} 
          button3={"otro"} 
              /> */}
          </Grid>
          <hr/>






        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
          {/* <MonetizationOnIcon style={{color:'green'}}/> */}
            <AppWidgetSummary title="Tasa $ BCV " total={valoresDolar.bcv} icon={'ant-design:dollar'} />

          </Grid>

          <Grid item xs={12} sm={6} md={6}>
          {/* <MonetizationOnIcon style={{color:'red'}}/> */}
            <AppWidgetSummary title="Tasa $ Paralela" total={valoresDolar.enparalelovzla} color="info" icon={'ant-design:dollar'} />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3}>
          <AddShoppingCartIcon style={{color:"blue"}}/>
            <AppWidgetSummary title="Ventas de el dia "/>
            <SalesRealTime/>
          </Grid> */}

          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:shooping'} />
          </Grid> */}

              

         
{/* 
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}
{/* 
          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>


     
      </Container>
      <hr/>
      <Typography variant="h4" sx={{ mb: 5 }}>
         Modulos de Administracion
        </Typography>
      <ModuleLinks/>
      <FloatingButtonComponent/>
    </>
  );
}
