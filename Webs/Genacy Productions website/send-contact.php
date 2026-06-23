<?php
// Solo aceptar peticiones POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 1. Recoger los datos del formulario
    $name     = trim($_POST["name"] ?? "");
    $email    = trim($_POST["email"] ?? "");
    $phone    = trim($_POST["phone"] ?? "");
    $date     = trim($_POST["date"] ?? "");
    $location = trim($_POST["location"] ?? "");
    $budget   = trim($_POST["budget"] ?? "");
    $message  = trim($_POST["message"] ?? "");
    $services = $_POST["services"] ?? [];

    $express  = isset($_POST["express_delivery"]) ? "Yes (client is interested)" : "No";

    // Convertir servicios a texto
    $servicesList = !empty($services) ? implode(", ", $services) : "No services selected";

    // 2. Validar campos básicos
    if ($name === "" || $email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please fill in your name and a valid email address.";
    } else {
        // 3. Configurar correo
        $to = "genacys@gmail.com";

        $subject = "New Wedding Inquiry from $name";

        $body  = "You have received a new inquiry from the website:\n\n";
        $body .= "Name: $name\n";
        $body .= "Email: $email\n";
        $body .= "Phone: $phone\n";
        $body .= "Wedding Date: $date\n";
        $body .= "Wedding Location: $location\n";
        $body .= "Estimated Budget: $budget\n";
        $body .= "Selected Services: $servicesList\n\n";
        $body .= "Express Delivery: $express\n\n";
        $body .= "Message:\n$message\n";



        // Remitente (mejor usar un correo del mismo dominio)
        $headers  = "From: Genacy Wedding Films <no-reply@genacyweddingfilms.com>\r\n";
        $headers .= "Reply-To: $email\r\n";

        // 4. Enviar el correo
        if (mail($to, $subject, $body, $headers)) {
            // Redirigir a página de gracias
            header("Location: thank-you.html");
            exit;
        } else {
            $error = "There was a problem sending your message. Please try again later.";
        }
    }
} else {
    $error = "Invalid request.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contact Error</title>
</head>
<body>
  <h1>Oops!</h1>
  <p><?php echo htmlspecialchars($error ?? "Something went wrong."); ?></p>
  <p><a href="contact.html">Back to contact form</a></p>
</body>
</html>
