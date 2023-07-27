export default function sentenceCase(str) {
    if (typeof str !== 'string') {
      return '';
    }
  
    // Convierte la primera letra en mayúscula y el resto en minúsculas
    str = str.toLowerCase();
    str = str.charAt(0).toUpperCase() + str.slice(1);
  
    // Busca los puntos y convierte la letra siguiente en mayúscula
    str = str.replace(/\.([a-z])/g, (match, letter) => {
      return `.${  letter.toUpperCase()}`;
    });
  
    return str;
  }
  

 