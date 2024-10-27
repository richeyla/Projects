using Microsoft.VisualStudio.TestTools.UnitTesting;
using CalculadoraApp.Models;

namespace unitTests
{
    [TestClass]
    public class UnitTest1
    {
        private Calculadora calc;

        [TestInitialize]
        public void Setup()
        {
            calc = new Calculadora();
        }

        [TestMethod]
        public void TestSumar()
        {
            Assert.AreEqual(5, calc.Sumar(2, 3));
        }

        [TestMethod]
        public void TestRestar()
        {
            Assert.AreEqual(1, calc.Restar(3, 2));
        }

        [TestMethod]
        public void TestMultiplicar()
        {
            Assert.AreEqual(6, calc.Multiplicar(2, 3));
        }

        [TestMethod]
        public void TestDividir()
        {
            Assert.AreEqual(2, calc.Dividir(6, 3));
        }

        [TestMethod]
        [ExpectedException(typeof(DivideByZeroException))]
        public void TestDividirPorCero()
        {
            calc.Dividir(5, 0);
        }
    }
}
