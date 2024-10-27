using System;
using CalculadoraApp.Models;

namespace CalculadoraApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Calculadora calc = new Calculadora();
            Console.WriteLine("Calculadora en C#");
            Console.WriteLine("Seleccione una operación: ");
            Console.WriteLine("1. Suma");
            Console.WriteLine("2. Resta");
            Console.WriteLine("3. Multiplicación");
            Console.WriteLine("4. División");
            Console.WriteLine("5. Potencia");
            Console.WriteLine("6. Raíz cuadrada");

            if (!int.TryParse(Console.ReadLine(), out int opcion))
            {
                Console.WriteLine("Entrada no válida para la opción.");
                return;
            }

            try
            {
                Console.Write("Ingrese el primer número: ");
                if (!double.TryParse(Console.ReadLine(), out double num1))
                {
                    Console.WriteLine("Entrada no válida para el número.");
                    return;
                }

                double resultado;

                if (opcion == 6)
                {
                    resultado = calc.RaizCuadrada(num1);
                }
                else
                {
                    Console.Write("Ingrese el segundo número: ");
                    if (!double.TryParse(Console.ReadLine(), out double num2))
                    {
                        Console.WriteLine("Entrada no válida para el número.");
                        return;
                    }

                    resultado = opcion switch
                    {
                        1 => calc.Sumar(num1, num2),
                        2 => calc.Restar(num1, num2),
                        3 => calc.Multiplicar(num1, num2),
                        4 => calc.Dividir(num1, num2),
                        5 => calc.Potencia(num1, num2),
                        _ => throw new InvalidOperationException("Operación no válida.")
                    };
                }

                Console.WriteLine("Resultado: " + resultado);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
    }
}
