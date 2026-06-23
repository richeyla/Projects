<?php
// contact.php

// ✅ Configuración
$TO_EMAIL = "slayinwithamy@gmail.com"; // <-- AQUI llega el mensaje
$SITE_NAME = "Slayin With Amy";

// A dónde volver al terminar (con mensaje)
$REDIRECT_OK = "index.html?sent=1#contact";
$REDIRECT_ERR = "index.html?error=1#contact";

// Solo POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  header("Location: $REDIRECT_ERR");
  exit;
}

// Honeypot anti-spam
$honeypot = trim($_POST["website"] ?? "");
if ($honeypot !== "") {
  header("Location: $REDIRECT_OK");
  exit;
}

// Obtener y limpiar datos
$name    = trim($_POST["name"] ?? "");
$email   = trim($_POST["email"] ?? "");
$subject = trim($_POST["subject"] ?? "");
$message = trim($_POST["message"] ?? "");

// Validaciones básicas
if ($name === "" || $email === "" || $subject === "" || $message === "") {
  header("Location: $REDIRECT_ERR");
  exit;
}

if (strlen($name) > 80 || strlen($email) > 120 || strlen($subject) > 120 || strlen($message) > 2000) {
  header("Location: $REDIRECT_ERR");
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  header("Location: $REDIRECT_ERR");
  exit;
}

// Evitar header injection
function clean_header_value($value) {
  $value = str_replace(["\r", "\n"], "", $value);
  return $value;
}

$name_clean    = clean_header_value($name);
$email_clean   = clean_header_value($email);
$subject_clean = clean_header_value($subject);

// Construir el email
$full_subject = "[$SITE_NAME] " . $subject_clean;

$body  = "You received a new message from the website:\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Email: " . $email . "\n";
$body .= "Subject: " . $subject . "\n";
$body .= "----------------------------------------\n";
$body .= $message . "\n";
$body .= "----------------------------------------\n\n";
$body .= "Sent on: " . date("Y-m-d H:i:s") . "\n";
$body .= "IP: " . ($_SERVER["REMOTE_ADDR"] ?? "unknown") . "\n";

// Headers (importante: From a veces debe ser del mismo dominio en algunos hostings)
$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "From: " . $SITE_NAME . " <no-reply@" . ($_SERVER["SERVER_NAME"] ?? "localhost") . ">";
$headers[] = "Reply-To: " . $name_clean . " <" . $email_clean . ">";

$headers_str = implode("\r\n", $headers);

// Enviar
$sent = @mail($TO_EMAIL, $full_subject, $body, $headers_str);

if ($sent) {
  header("Location: $REDIRECT_OK");
  exit;
} else {
  header("Location: $REDIRECT_ERR");
  exit;
}
