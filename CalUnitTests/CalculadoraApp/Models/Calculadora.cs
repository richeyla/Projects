using System;

namespace CalculadoraApp.Models
{
    public class Calculadora{
        public double Sumar(double a, double b) => a + b;
        public double Restar (double a, double b) => a - b;
        public double Multiplicar(double a, double b) => a * b;
        public double Dividir(double a, double b) 
        {
            if(b == 0)
            throw new DivideByZeroException("No se puede dividir de cero");
            return a / b;
        }

        public double Potencia(double BaseNum, double exponente) => Math.Pow(BaseNum, exponente);
         public double RaizCuadrada(double num)
        {
            if(num < 0)
            throw new ArgumentException("No se puede calcular la raíz cuadrada de un número negativo.");
            return Math.Sqrt(num);
        }
        
    }
}