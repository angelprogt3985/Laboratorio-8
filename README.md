# Laboratorio 8 - Parte 1 - Angel Camargo - 24003664

Primero creamos ComparePage.tsx en src/pages, que muestra las propiedades seleccionadas en tarjetas con gradientes de color y una tabla comparativa resaltando el mejor valor en cada métrica. También maneja un estado vacío cuando no hay propiedades seleccionadas.
Luego creamos CompareButton.tsx en src/components, un botón que se coloca en cada tarjeta para agregar o quitar propiedades de la comparación, con un límite de 3.
Después modificamos App.tsx agregando el estado compareList y la función handleToggleCompare, la ruta /compare, y un link de "Comparar" en el header.
Luego en HomePage.tsx agregamos las props compareList y onToggleCompare para pasarlas a cada PropertyCard.
Finalmente en PropertyCard.tsx agregamos el CompareButton en el footer de cada tarjeta.

Videos de demostración: https://drive.google.com/file/d/1c0NKhKQjJIWN0Tm6AtliP3qMxnnniNCm/view?usp=drive_link
