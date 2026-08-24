Esta aplicacion es un ecommerce de herramientas y maquinas para talleres mecanicos. Tiene una pagina de inicio con todos los productos y los podes filtrar por categoria. Tambien tiene una pagina con el detalle de cada producto que se puede agregar a un carrito de compra segun el stock.

Los productos, el carrito y el login se consumen del backend real (`Primera preentrega backend 2`, Express + MongoDB) via fetch — ya no usa Firebase/Firestore. La compra se hace con el Card Payment Brick de Mercado Pago (paga de verdad, en modo prueba con credenciales de test).

Para usar esta aplicacion:
1. Clonar y levantar primero el backend (`Primera preentrega backend 2`, con `npm start`, escucha en el puerto 8080).
2. `git clone https://github.com/mvega1990/Proyecto-React-comision-60010.git`
3. `npm install` para descargar las dependencias.
4. Crear un archivo `.env` (ver `.env` de ejemplo en el repo) con `VITE_API_URL` apuntando al backend y `VITE_MP_PUBLIC_KEY` con la Public Key de prueba de Mercado Pago.
5. `npm run dev` para correrlo.
