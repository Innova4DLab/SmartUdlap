# SmartUdlap

## Algoritmo de corrección de errores

![Problem](/Images/problemIlustration.png)

Las coordenadas devueltas por el sensor no siempre son exactas y algunas bus stop estan muy cercanas (30 metros) por lo que se implementa el siguiente algoritmo para corregir los errores.

Obtener las bus stop (maximo 2) mas cercanas a la coordenada devuelta por el sensor y almacenarlas en unas variables temporales. Deben recolectarse al menos dos veces los datos. 
Aplicar un algoritmo para determinar en que bus stop se encuentra el camión.

![Solution](/Images/solutionIlustration.png)

si busstop3 > busstop1 && busstop3 <= busstop1 + 1

    Bus stop actual => busstop3

si busstop3 > busstop2 && busstop3 <= busstop2 + 1

    Bus stop actual => busstop3

si busstop4 > busstop1 && busstop4 <= busstop1 + 1
	
    Bus stop actual => busstop4

si busstop4 > busstop2 && busstop4 <= busstop2 + 1
	
    Bus stop actual => busstop4
