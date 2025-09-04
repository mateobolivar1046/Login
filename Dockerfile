# Paso 1: Usar una imagen base oficial y ligera de Nginx.
# Nginx es un servidor web de alto rendimiento ideal para servir archivos estáticos.
FROM nginx:1.25-alpine

# Paso 2: Copiar todos los archivos de tu aplicación (HTML, TSX, CSS, etc.)
# al directorio web por defecto de Nginx dentro del contenedor.
COPY . /usr/share/nginx/html

# Paso 3: Exponer el puerto 80. Nginx escucha en este puerto por defecto.
EXPOSE 80

# Paso 4: El comando para iniciar Nginx cuando el contenedor se ejecute.
# La opción "-g 'daemon off;'" asegura que Nginx se ejecute en primer plano,
# lo cual es necesario para que el contenedor de Cloud Run se mantenga activo.
CMD ["nginx", "-g", "daemon off;"]
