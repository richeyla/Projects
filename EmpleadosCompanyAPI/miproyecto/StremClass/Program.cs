using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

class Program
{
    static void Main(string[] args)
    {
        // Cargar usuarios desde el archivo JSON
        var users = LoadUsersFromJson();

        // Menú de opciones
        Console.WriteLine("Seleccione una opción:");
        Console.WriteLine("1. Agregar usuario");
        Console.WriteLine("2. Buscar usuario por ID");
        Console.Write("Opción: ");
        
        // Leer la opción del usuario
        string option = Console.ReadLine();

        if (option == "1") // Si elige agregar usuario
        {
            AddUser(users); // Llama a la función para agregar un usuario
        }
        else if (option == "2") // Si elige buscar usuario
        {
            Console.Write("Ingrese el ID del usuario a buscar: ");
            if (int.TryParse(Console.ReadLine(), out int id)) // Intenta convertir la entrada a un número
            {
                FindUserById(users, id); // Busca el usuario por ID
            }
            else
            {
                Console.WriteLine("ID inválido. Asegúrese de ingresar un número.");
            }
        }
        else
        {
            Console.WriteLine("Opción no válida.");
        }
    }

    // Cargar usuarios desde un archivo JSON
    static List<User> LoadUsersFromJson()
    {
        if (!File.Exists("users.json")) // Verifica si el archivo existe
        {
            return new List<User>(); // Devuelve una lista vacía si no existe
        }

        string jsonString = File.ReadAllText("users.json"); // Lee el contenido del archivo
        return JsonSerializer.Deserialize<List<User>>(jsonString); // Deserializa el JSON a una lista de usuarios
    }

    // Agregar un nuevo usuario
    static void AddUser(List<User> users)
    {
        Console.Write("Ingrese el ID del nuevo usuario: ");
        if (!int.TryParse(Console.ReadLine(), out int id)) // Intenta convertir la entrada a un número
        {
            Console.WriteLine("ID inválido. Asegúrese de ingresar un número.");
            return; // Sale de la función si el ID no es válido
        }

        Console.Write("Ingrese el nombre del nuevo usuario: ");
        string name = Console.ReadLine(); // Lee el nombre

        Console.Write("Ingrese el correo del nuevo usuario: ");
        string email = Console.ReadLine(); // Lee el corre

        // Crea un nuevo usuario y lo agrega a la lista
        User newUser = new User { Id = id, Name = name, Email = email };
        users.Add(newUser); // Agrega el nuevo usuario a la lista

        // Serializar la lista actualizada de usuarios a JSON
        SerializeUsersToJson(users);

        Console.WriteLine("Usuario agregado exitosamente.");
    }

    // Serializar la lista de usuarios a un archivo JSON
    static void SerializeUsersToJson(List<User> users)
    {
        string jsonString = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true }); // Convierte la lista a JSON
        File.WriteAllText("users.json", jsonString); // Escribe el JSON en el archivo
        Console.WriteLine("Lista de usuarios guardada en el archivo JSON.");
    }

    // Buscar un usuario por su ID
    static void FindUserById(List<User> users, int id)
    {
        User user = users.FirstOrDefault(u => u.Id == id); // Busca el usuario por ID

        if (user != null) // Si se encuentra el usuario
        {
            Console.WriteLine($"Usuario encontrado: {user.Name} ({user.Email})");
        }
        else
        {
            Console.WriteLine("Usuario no encontrado.");
        }
    }

    // Clase User para representar a los usuarios
    class User
    {
        public int Id { get; set; } // ID del usuario
        public string Name { get; set; } = string.Empty; // Nombre del usuario
        public string Email { get; set; } = string.Empty; // Correo del usuario
    }
}
