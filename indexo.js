const { DataFrame } = require('dataframe-js');
const http = require('http');
const XLSX = require('xlsx');
const fs = require('fs').promises;
const DataFrame = require('dataframe-js').DataFrame;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/indexo') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const dni = $[DNI_solitud_1];

        async function processData(dni) {
          // Paso 1: Leer el archivo de Excel y convertirlo en un DataFrame
          try {
            // Paso 1: Leer el archivo de Excel y convertirlo en un DataFrame
            const workbook = XLSX.readFile('reporte.xlsx');
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const table = new DataFrame(jsonData);
          
            // Paso 2: Filtrar DataFrame por dni
            const filteredTable = table.filter(row => row.get(0) === dni);
        
            if (filteredTable.count() === 0) {
              throw new Error('DNI no encontrado');
            }
          
            // Paso 3: Obtener los valores de real_c1 y real_c2 para el dni encontrado
            const rowValues = filteredTable.toArray()[0];
            const real_c1 = rowValues[2];
            const real_c2 = rowValues[3];
            const real_c3 = rowValues[4];
            const real_c4 = rowValues[5];
        
            // Paso 4: Juntar real_c1 y real_c2 en un único objeto llamado "real"
            const responseJSON = { 'real_c1': real_c1, 'real_c2': real_c2, 'real_c3': real_c3, 'real_c4': real_c4 };
            return responseJSON;
          }catch (error) {
            throw error;
          }
        }
        
        processData(dni);

      } catch (error) {
        res.statusCode = 400;
        res.end('Error en los datos JSON o DNI no encontrado.');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Ruta no encontrada.');
  }
});

server.listen(3000, () => {
  console.log('Servidor en ejecución en el puerto 3000');
});