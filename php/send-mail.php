<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Nastavení cílového e-mailu (ZDE DOPLŇ SVŮJ E-MAIL)
    $to = "info@justwebsite.cz"; 
    $subject = "Nová poptávka z webu JustWebsite";

    // 2. Načtení a očištění dat z formuláře
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = strip_tags(trim($_POST["message"]));
    $gdpr = isset($_POST["gdpr"]) ? "Ano" : "Ne";

    // 3. Kontrola povinných polí (pro případ, že by někdo obešel JS validaci)
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Prosím vyplňte všechna pole správně.";
        exit;
    }

    // 4. Sestavení obsahu e-mailu
    $email_content = "Jméno: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Zpráva:\n$message\n\n";
    $email_content .= "Souhlas s GDPR: $gdpr\n";

    // 5. Hlavičky e-mailu
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // 6. Odeslání
    if (mail($to, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo "Děkujeme, zpráva byla odeslána.";
    } else {
        http_response_code(500);
        echo "Omlouváme se, ale zprávu se nepodařilo odeslat.";
    }

} else {
    // Pokud někdo zkusí přistoupit k souboru přímo, zakážeme mu to
    http_response_code(403);
    echo "K této stránce nemáte přístup.";
}
?>