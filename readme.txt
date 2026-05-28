PRUEBA DE CARGA - SERVICIO DE LOGIN
====================================

TECNOLOGIAS Y VERSIONES
------------------------
- K6 v2.0.0-rc1
  Descarga (Windows): https://dl.k6.io/msi/k6-latest-amd64.msi
  Version usada: k6 v2.0.0-rc1 (go1.26.2, windows/amd64)

ESTRUCTURA DEL PROYECTO
------------------------
performance/
  script.js         <- Script de la prueba
  usuarios.csv      <- Datos de entrada
  end-summary.json  <- Reporte exportado
  readme.txt        <- Este archivo
  conclusiones.txt  <- Hallazgos del ejercicio

PASO A PASO
-----------
1. Instalar K6 desde https://dl.k6.io/msi/k6-latest-amd64.msi
   Abrir terminal nueva y verificar: k6 version

2. Clonar o descargar el repositorio

3. Abrir una terminal en la carpeta del proyecto

4. Ejecutar la prueba:
   k6 run script.js

5. Para exportar el reporte en JSON:
   k6 run --summary-export=end-summary.json script.js

DESCRIPCION DEL ESCENARIO
--------------------------
Endpoint  : POST https://fakestoreapi.com/auth/login
Executor  : constant-arrival-rate
TPS       : 20 iteraciones por segundo
Duracion  : 60 segundos
Usuarios  : 5 credenciales desde usuarios.csv (round-robin)

CRITERIOS DE ACEPTACION
------------------------
- p(95) de tiempo de respuesta < 1,500 ms
- max de tiempo de respuesta   < 1,500 ms
- Tasa de error HTTP           < 3%