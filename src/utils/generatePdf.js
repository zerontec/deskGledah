/* eslint-disable new-cap */
import {jsPDF} from 'jspdf';

const generatePDF = (product) => {
    const doc = new jsPDF();
    let content = `Título del PDF\n\n`;
    content += `- Producto: ${product.name}\n`;
    content += `- Precio: $${product.price}\n`;
    content += `- Descripción: ${product.description}\n`;
    // Agrega más líneas de contenido según tus necesidades
  
    doc.text(content, 10, 10);
  
    // Genera el PDF y obtén su contenido en formato base64
    const pdfContent = doc.output('datauristring');
  
    // Abre el PDF en una nueva pestaña o ventana del navegador
    window.open(pdfContent);
  };

  
  
  
  
 export default  generatePDF;
